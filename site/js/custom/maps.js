setTimeout(function () {
  window.scrollTo(0, 1);
}, 1000);

$("#rate").click(function() {
  $("#myModal").modal();
});

$(".box").click(function() {
  console.log(this);
  $(this).css("background-color", "green");
});

$(".modal-footer").click(function() {
  $(".collapse").collapse("hide");
});

// $("#slider").slider({
//   min: 0,
//   max: 10,
//   step: 1,
//   orientation: "horizontal",
//   value: 5
// });

var map,
  geocoder;

function initialize() {
  var mapOptions = {
    zoom: 8,
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
      var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);

      var cricleOptions = {
        strokeColor: '#FF0000',
        strokeOpacity: 1,
        strokeWeight: 4,
        fillOpacity: 0,
        map: map,
        center: pos,
        radius: 3000
      };

      var marker = new google.maps.Marker({
        position: pos,
        map: map,
        title: 'My position'
      });

      // var iAmHereCircle = new google.maps.Circle(cricleOptions);

      // var infowindow = new google.maps.InfoWindow({
      //   map: map,
      //   position: pos,
      //   content: 'Location found using HTML5.'
      // });

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

var suns = [
  [52.80, 13.08],
  [52.60, 13.28],
  [52.30, 12.98]
];

function setMarkers(map) {
  var image = {
    url: 'img/sun.png',
    size : new google.maps.Size(64, 64),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 32)
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
