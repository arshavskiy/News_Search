$(document).ready(function() {
    url = 'http://www.thetutlage.com/rss.xml';
    $.ajax({
        type: "GET",
        url: document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=1000&callback=?&q=' + encodeURIComponent(url),
        dataType: 'json',
        error: function() {
            alert('Unable to load feed, Incorrect path or invalid feed');
        },
        success: function(xml) {
            values = xml.responseData.feed.entries;
            console.log(values);
        }
    });
});

$(document).ready(function() {
    //feed to parse
    var feed = "https://feeds.feedburner.com/raymondcamdensblog?format=xml";

    $.ajax(feed, {
        accepts: {
            xml: "application/rss+xml"
        },
        dataType: "xml",
        success: function(data) {
            //Credit: http://stackoverflow.com/questions/10943544/how-to-parse-an-rss-feed-using-javascript

            $(data).find("item").each(function() { // or "item" or whatever suits your feed
                var el = $(this);
                console.log("------------------------");
                console.log("title      : " + el.find("title").text());
                console.log("link       : " + el.find("link").text());
                console.log("description: " + el.find("description").text());
            });


        }
    });

});

$(document).ready(function() {
    $.get('http://stackoverflow.com/feeds/question/10943544', function(data) {
        $(data).find("entry").each(function() { // or "item" or whatever suits your feed
            var el = $(this);

            console.log("------------------------");
            console.log("title      : " + el.find("title").text());
            console.log("author     : " + el.find("author").text());
            console.log("description: " + el.find("description").text());
        });
    });
});