var userAddress;
var userLat;
var userLon;
var newMarker;

//Load map function
var map;
function initMap() {
	map = new google.maps.Map(document.getElementById('map-canvas'), {
    	center: {lat: 30.363, lng: -118.044},
    	zoom: 3
	});
}


//autocomplete geocoder
function initilize() {
    google.maps.event.addDomListener(window, 'load', initilize);
    var autocomplete = new google.maps.places.Autocomplete(document.getElementById('location'));

    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        var place = autocomplete.getPlace();
        userAddress = place.formatted_address;
        userLat = place.geometry.location.lat();
        userLon = place.geometry.location.lng();
    });
};


function newMarkerDrop() {
    myLatLng = {lat: LatValue, lng: LonValue};
    newMarker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        animation: google.maps.Animation.DROP
    });
}

function zoomToLastMarker() {
    map.setZoom(12);
    map.panTo(newMarker.position);
}

//GEOCODING ACTION
document.getElementById('location').onclick = function() {
    initilize();
}

