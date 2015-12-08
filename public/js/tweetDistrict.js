$(function () {
    var userLat;
    var userLon;
    var newMarker;
    var map;

    $("#search-button").click(function () {

        $.getJSON(
            "/tw",

            {   
                geoSearchWord: $("#searchme").val(),
                geoSearchWordLat: userLat,
                geoSearchWordLon: userLon,
                geoSearchWordRad: $("#searchRadius").val()
            }

        ).done(function (result) {
            $("#fromTweets").empty();  
            $("#tweetClear").remove(); 

            if (result.statuses.length === 0) {
                noTweetsFoundAppend();
            }

            for (i = 0; i < result.statuses.length; i++) {
                var userPostedImage = "";
                var userLatLonInput = "";
                var userURL = '<a href="https://twitter.com/' + result.statuses[i].user.screen_name + 
                    '" class="nav-link">';
                var linkifiedText = linkify(result.statuses[i].text);
                var userImage = result.statuses[i].user.profile_image_url_https;

                if (result.statuses[i].geo !== null) {
                    //Print out the geolocation && Drop Marker
                    LatValue = parseFloat(result.statuses[i].geo.coordinates[0]);
                    LonValue = parseFloat(result.statuses[i].geo.coordinates[1]);
                    userLatLonInput = ", Lat: " + LatValue + " Lon: " + LonValue;
                    newMarkerDrop();
                }

                if (result.statuses[i].entities.media !== undefined) {
                    //add media functionality to tweet inserts(images)

                }
                //Print out username and status
                $("#fromTweets").append('<div class="panel tweet-inputs">' + '<img src="' + userImage + '"">' + 
                    userURL + result.statuses[i].user.screen_name + '</a>' + '<p class="tweet-text-input">' + 
                    linkifiedText + '</p>' + '<br/>' +'<p class="tweet-text-time">' + result.statuses[i].created_at + 
                    userLatLonInput + '</p>' + userPostedImage + '</div> ');
            }

            zoomToLastMarker();
        });
    });


    $("#search-button-slug").click(function () {
        $.getJSON(

            "/funnytw",

            { 
                slug: $("#categorySearch").val()
            }

        ).done(function (result) {
            $("#fromCategories").empty();
            for (i = 0; i < result.users.length; i++) {
                $("#fromCategories").append('<b>' + "Username: " + '</b>' + result.users[i].screen_name + '<br/>');
                $("#fromCategories").append('<b>' + "Description: " + '</b>' + result.users[i].description + '<br/>');
                $("#fromCategories").append('<b>' + "Number of Followers: " + '</b>' + result.users[i].followers_count +
                 '<br/>' + '<br/>');
            }
        });
    }); 


    $("#search-button-trending").click(function () {
        $.getJSON(
            "/trendstw",

            {
                trendingSearch: $("#trendingSearch").val()
            }

        ).done(function (result) {
            $("#fromTrending").empty();
            for ( i = 0; i < result[0].trends.length; i++) {
                $("#fromTrending").append('<b>' + "Trending: " + '</b>' + result[0].trends[i].name + '<br/>');
                $("#fromTrending").append('<b>' + "Link: " + '</b>' + result[0].trends[i].url + '<br/>' + '<br/>' );
            }
        });
    });


    var initMap = function () {
        map = new google.maps.Map(document.getElementById('map-canvas'), {
            center: {lat: 30.363, lng: -118.044},
            zoom: 3
        });
    }
    initMap();


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

    //activate geocoding on box click
    $("#searchme").click(initilize());


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
                $("#locationSearch").val(results[0].formatted_address);
            }
        });
    }


    // Lat/Lon search and input, along with greyeing out box when checked, clearing and ungreying when unchecked
    $("#geoCheckBox").click(function () {
        if (navigator.geolocation && $("#geoCheckBox").is(":checked")) {
            locationSearch.value = "Finding your location...";
            $("#locationSearch").attr('disabled','disabled');
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            $("#locationSearch").removeAttr('disabled').val('');
            initilize();
        }
    });   


    var showPosition = function (position) { 
        userLat = position.coords.latitude;
        userLon = position.coords.longitude;
        getReverseGeocodingData(userLat, userLon);
    }


    //linkifies text
    var linkify = function (inputText) {
        var replacedText, replacePattern1, replacePattern2, replacePattern3;

        //URLs starting with http://, https://, or ftp://
        replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
        replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

        //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
        replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
        replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

        //Change email addresses to mailto:: links.
        replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
        replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

        return replacedText;
    }


    var noTweetsFoundAppend = function () {
        return $("#fromTweets").append('<div class="panel tweet-inputs">' + '<p class="tweet-text-input">' + 
            "Sorry, no tweets found" + '</p>' + '</div>');
    }    
});