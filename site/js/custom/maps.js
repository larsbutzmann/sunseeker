var map,
    geocoder,
    pos,
    radarOverlay;

var lars;

function initialize() {
    var mapOptions = {
        zoom: 7,
        minZoom: 5,
        panControl: false,
        zoomControl: false,
        scaleControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        },
        mapTypeId: google.maps.MapTypeId.TERRAIN
    };
    geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById('map_canvas'),
            mapOptions);

    // Try HTML5 geolocation
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            // console.log(position);
            pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            var image = {
                url: 'img/iamhere.png',
                size : new google.maps.Size(30, 30),
                anchor: new google.maps.Point(16, 30)
            };

            var marker = new google.maps.Marker({
                position: pos,
                map: map,
                title: 'My position',
                icon: image,
                zIndex: 100
            });

            map.setCenter(pos);
            setRadar();
        }, function() {
            handleNoGeolocation(true);
        });
    } else {
        // Browser doesn't support Geolocation
        handleNoGeolocation(false);
    }

    google.maps.event.addListener(map, 'dragend', function() {
        setRadar();
    });
    google.maps.event.addListener(map, 'zoom_changed', function(event) {
        setRadar();
    });

    // loadWeatherData();
    setMarkers(map);
}

function setRadar() {
    var bounds = map.getBounds();
    var neBound = bounds.getNorthEast();
    var swBound = bounds.getSouthWest();

    var url = "http://api.wunderground.com/api/17cf732ee8929251/radar/image.png?maxlat=" + neBound.lat() + "&maxlon=" + neBound.lng() + "&minlat=" + swBound.lat() + "&minlon=" + swBound.lng() + "&width=" + document.width + "&height=" + document.height;
    // var url2 = "http://radblast.wunderground.com/cgi-bin/radar/WUNIDS_composite?maxlat=" + neBound.lat() + "&maxlon=" + neBound.lng() + "&minlat=" + swBound.lat() + "&minlon=" + swBound.lng() + "&width=" + document.width + "&height=" + document.height + "&type=00Q&frame=0&num=1&delay=25&png=1&min=0&rainsnow=1&nodebug=0&brand=wundermap&smooth=1&noclutter=1&radar_bitmap=1";

    if (typeof(radarOverlay) !== "undefined") {
        radarOverlay.setMap(null);
    }

    radarOverlay = new google.maps.GroundOverlay(url, bounds, {"opacity": 0.6});
    radarOverlay.setMap(map);
}

function loadWeatherData() {
    var imgClear = {
        url: 'img/icons/clear.png',
        size : new google.maps.Size(50, 50),
        anchor: new google.maps.Point(25, 25)
    };

    var imagePartlyCloudy = {
        url: 'img/icons/partlycloudy.png',
        size : new google.maps.Size(60, 60),
        anchor: new google.maps.Point(30, 30)
    };

    var imagePartlySunny = {
        url: 'img/icons/partlysunny.png',
        size : new google.maps.Size(60, 60),
        anchor: new google.maps.Point(30, 30)
    };

    var imageScatteredClouds = {
        url: 'img/icons/scatteredclouds.png',
        size : new google.maps.Size(60, 60),
        anchor: new google.maps.Point(30, 30)
    };

    var imageCloudy = {
        url: 'img/icons/cloudy.png',
        size : new google.maps.Size(60, 60),
        anchor: new google.maps.Point(30, 30)
    };

    var imageRain = {
        url: 'img/icons/rain.png',
        size : new google.maps.Size(50, 50),
        anchor: new google.maps.Point(25, 25)
    };

    var imageTypes = {"NCD": imgClear, "SKC": imgClear, "CLR": imgClear,
        "NSC": imgClear, "FEW": imagePartlyCloudy, "SCT": imagePartlySunny,
        "BKN": imageScatteredClouds, "OVC": imageCloudy, "RAIN": imageRain
    };

    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: "/weatherdata",
        success: function (weatherData) {
            var seenStations = [];
            for (var i = 0; i < weatherData.length; i++) {

                var data = weatherData[i];
                var metarData = parseMETAR(data.raw_text);
                var myLatLng = new google.maps.LatLng(data.latitude, data.longitude);

                if (metarData.clouds === null && metarData.weather === null) {
                    metarData.clouds = [{abbreviation: "CLR"}];
                }

                if (!seenStations.in_array(data.station_id)) {
                    var marker = new google.maps.Marker({
                        position: myLatLng,
                        map: map,
                        icon: (metarData.weather === null) ? imageTypes[metarData.clouds[0].abbreviation] : imageTypes["RAIN"],
                        zIndex: 1
                    });
                }
                seenStations.push_unique(data.station_id);
            }
        }
    });
}

function addMarker() {
    marker = new google.maps.Marker({
        position: map.getCenter(),
        animation: google.maps.Animation.DROP,
        draggable: true,
        map: map
    });

    google.maps.event.addListener(marker, "dragend", function(event) {
        var type;
        var lat = event.latLng.lat();
        var lng = event.latLng.lng();
        $("#myModal").modal();
        $(".box").click(function() {
            console.log(this);
            type = this.innerHTML;
            $.ajax({
                type: 'POST',
                url: "/api/weather",
                data: {
                    latitude: lat,
                    longitude: lng,
                    type: type
                },
                success: function (data) {
                    alert("saved");
                    $(".box").css("background-color", "white");
                    $('.box').unbind('click');
                },
                error: function (xhr, status, error) {
                    console.log('Error: ' + error.message);
                }
            });
        });
    });
}

function setMarkers(map) {

    var image = {
        url: 'img/sun.png',
        size : new google.maps.Size(60, 60),
        anchor: new google.maps.Point(30, 30)
    };

    // $.ajax({
    //     type: 'GET',
    //     url: "/api/weather",
    //     success: function (data) {
    //         for (var i = 0; i < data.length; i++) {
    //             var s = data[i];
    //             var myLatLng = new google.maps.LatLng(s.latitude, s.longitude);
    //             var marker = new google.maps.Marker({
    //                 position: myLatLng,
    //                 map: map,
    //                 icon: image
    //             });
    //         }
    //     }
    // });
}

function handleNoGeolocation(errorFlag) {
    var content, options, infowindow;
    if (errorFlag) {
        content = 'Error: The Geolocation service failed.';
    } else {
        content = 'Error: Your browser doesn\'t support geolocation.';
    }

    alert("Bitte erlauben sie dem Browser die Erkennung");

    options = {
        map: map,
        position: new google.maps.LatLng(52.516, 13.389),
        content: content
    };

    // infowindow = new google.maps.InfoWindow(options);
    map.setCenter(options.position);
}

function codeAddress() {
    var address = document.getElementById('address').value;
    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

$("#address").keyup(function(event){
    if(event.keyCode == 13){
        codeAddress();
        $("#address").blur();
        $("#menuLink").click();
        this.value = "";
    }
});

google.maps.event.addDomListener(window, 'load', initialize);
