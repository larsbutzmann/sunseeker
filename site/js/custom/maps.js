var map,
    geocoder;

function initialize() {
    var mapOptions = {
        zoom: 9,
        minZoom: 7,
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
            var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            var image = {
                url: 'img/iamhere.png',
                size : new google.maps.Size(64, 64),
                anchor: new google.maps.Point(32, 64)
            };

            var marker = new google.maps.Marker({
                position: pos,
                map: map,
                title: 'My position',
                icon: image
            });

            map.setCenter(pos);
        }, function() {
            handleNoGeolocation(true);
        });
    } else {
        // Browser doesn't support Geolocation
        handleNoGeolocation(false);
    }

    setMarkers(map);
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

var suns = [
    [52.80, 13.08],
    [52.60, 13.28],
    [52.30, 12.98]
];

function setMarkers(map) {

    var image = {
        url: 'img/sun.png',
        size : new google.maps.Size(64, 64),
        anchor: new google.maps.Point(32, 32)
    };

    for (var i = 0; i < suns.length; i++) {
        var s = suns[i];
        var myLatLng = new google.maps.LatLng(s[0], s[1]);
        var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            icon: image
        });
    }

    $.ajax({
        type: 'GET',
        url: "/api/weather",
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                var s = data[i];
                var myLatLng = new google.maps.LatLng(s.latitude, s.longitude);
                var marker = new google.maps.Marker({
                    position: myLatLng,
                    map: map,
                    icon: image
                });
            }
        }
    });
}

function handleNoGeolocation(errorFlag) {
    var content, options, infowindow;
    if (errorFlag) {
        content = 'Error: The Geolocation service failed.';
    } else {
        content = 'Error: Your browser doesn\'t support geolocation.';
    }

    options = {
        map: map,
        position: new google.maps.LatLng(60, 105),
        content: content
    };

    infowindow = new google.maps.InfoWindow(options);
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
    }
});

google.maps.event.addDomListener(window, 'load', initialize);
