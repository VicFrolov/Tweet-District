var userLat;
var userLon;
var newMarker;
var geoDecodedAddress;

//Load map function
var map;
var initMap = function () {
    map = new google.maps.Map(document.getElementById('map-canvas'), {
        center: {lat: 30.363, lng: -118.044},
        zoom: 3
    });
}


//autocomplete geocoder
var initilize = function () {
    google.maps.event.addDomListener(window, 'load', initilize);
    var autocomplete = new google.maps.places.Autocomplete(document.getElementById('locationSearch'));

    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        var place = autocomplete.getPlace();
        var userAddress = place.formatted_address;
        userLat = place.geometry.location.lat();
        userLon = place.geometry.location.lng();
    });
};


var newMarkerDrop = function () {
    myLatLng = {lat: LatValue, lng: LonValue};
    newMarker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        animation: google.maps.Animation.DROP
    });
}

var zoomToLastMarker = function () {
    map.setZoom(12);
    map.panTo(newMarker.position);
}

//GEOCODING ACTION

$("#locationSearch").click(function () {
    if(!$("#geoCheckBox").is(":checked")) {
        initilize();
    }
});


//GEODECODING ACTION
var getReverseGeocodingData = function (lat, lng) {
    var latlng = new google.maps.LatLng(lat, lng);
    // This is making the Geocode request
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'latLng': latlng }, function (results, status) {
        if (status !== google.maps.GeocoderStatus.OK) {
            alert(status);
        }
        // This is checking to see if the Geoeode Status is OK before proceeding
        if (status === google.maps.GeocoderStatus.OK) {
            //show address in textbox
            locationSearch.value = (results[0].formatted_address);
        }
    });
}


// LAT / LON REQUEST

$("#geoCheckBox").click(function () {
    locationSearch.value = "Please wait...";
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.value = "Not supported by browser.";
    }
});


var showPosition = function (position) { 
    userLat = position.coords.latitude;
    userLon = position.coords.longitude;
    getReverseGeocodingData(userLat, userLon);
}