//linkifies text
function linkify (inputText) {
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


function noTweetsFoundAppend() {
    return $("#fromTweets").append('<div class="panel tweet-inputs">' + '<p class="tweet-text-input">' + "Sorry, no tweets found" + '</p>' + '</div>')
}


$(function () {

    $("#search-button").click(function() {

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

            if (result.statuses.length == 0) {
                noTweetsFoundAppend();
            }

            for (i = 0; i < result.statuses.length; i++) {
                var userPostedImage = "";
                var userLatLonInput = "";
                var userURL = '<a href="https://twitter.com/' + result.statuses[i].user.screen_name + '" class="nav-link">'
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


                }
                //Print out username and status
                $("#fromTweets").append('<div class="panel tweet-inputs">' + '<img src="' + userImage + '"">' + userURL + result.statuses[i].user.screen_name + '</a>' + 
                    '<p class="tweet-text-input">' + linkifiedText + '</p>' + '<br/>' +
                    '<p class="tweet-text-time">' + result.statuses[i].created_at + userLatLonInput + '</p>' + userPostedImage + '</div> ')
            }

            zoomToLastMarker();
        });
    });


    $("#search-button-slug").click(function() {
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
                $("#fromCategories").append('<b>' + "Number of Followers: " + '</b>' + result.users[i].followers_count + '<br/>' + '<br/>');
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
            for( i = 0; i < result[0].trends.length; i++) {
                $("#fromTrending").append('<b>' + "Trending: " + '</b>' + result[0].trends[i].name + '<br/>');
                $("#fromTrending").append('<b>' + "Link: " + '</b>' + result[0].trends[i].url + '<br/>' + '<br/>' );
            }
        });
    });
});