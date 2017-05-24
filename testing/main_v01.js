function giveStartDate(dateF) {
    EndDate = moment().subtract(365, "days").format(dateF);
    console.log(EndDate);
    return EndDate;
}

function giveEndDate(dateF) {
    startDate = moment().format(dateF);
    console.log(startDate);
    return startDate;
}

function PrepereNewsString() {
    return ((newsMarquee.join()).toUpperCase()).replace(/,/g, '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
}

function runSearch(e , search='fake news') {
    // var date = giveNowDate();

    clr('#gallery_nyt div');
    clr('img');
    clr('h5');

    resize = '';
    articles = 8;

    inputSubmites = $("input:last").val();

    if (inputSubmites) {
        search = $("input:last").val();
    }


    if (search) {

        var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
        url += '?' + $.param({
            'api-key': "4e68f99a5f41443c9fff43f1791bb49e",
            'q': search,
            'begin_date': giveStartDate('YYYYMMDD'),
            'end_date': giveEndDate('YYYYMMDD'),
            'show-fields': 'all',
            //'fields': "body,headline,snippet,lead_paragraph,web_url,byline",
            'sort': "newest"
        });
        $.ajax({
            url: url,
            method: 'GET',
        }).done(function(result) {

            for (var key in result.response.docs) {
                if (key < articles) { //TODO const 
                    headline = result.response.docs[key].headline.main;
                    snippet = result.response.docs[key].snippet;
                    lead_paragraph = result.response.docs[key].lead_paragraph;
                    web_url = result.response.docs[key].web_url;
                    web_url = web_url.replace("\"", '');
                    pub_date = result.response.docs[key].pub_date;
                    pub_date = pub_date.substring(0, 10);

                    if (result.response.docs[key].byline.original) {
                        byline = result.response.docs[key].byline.original;
                    }

                    // toFileTxt(headline);

                    $("<h5 id='header " + key + '\'' + ">" + headline + "</h5>").appendTo('article#nyt');
                    if (snippet) {
                        $("<h6>" + snippet + "</h6>").appendTo('h5:last');
                    } else if (lead_paragraph) {
                        $("<h6>" + lead_paragraph + "</h6>").appendTo('h5:last');
                    }
                    $("<b class='byline'>" + byline + "</b>").appendTo('h5:last');
                    $("<br><tt class='byline'>" + pub_date + "</tt>").appendTo('h5:last');
                    $("<a href =" + web_url + "  target=\"_blank\">" + "&#9755;" + "</a>").appendTo('h6:last');
                }

            }

            photoArr = [];
            for (key in result.response.docs) {
                if (key < articles) {
                    if (result.response.docs[key].multimedia[2]) {
                        //  if (typeof result.response.docs[key].multimedia[2] != 'undefined' && result.response.docs[key].multimedia[2] !== null && result.response.docs[key].multimedia[2]) {
                        var photo = result.response.docs[key].multimedia[2].url;
                        photo = photo.replace("\"", '');
                        photoArr[key] = "http://www.nytimes.com/" + photo;
                        // $("<h5 id='header " + key + '\'' + "><div><img src=" + "http://www.nytimes.com/" + photo + ">" + "</img></div></h5>").appendTo('article#nyt');
                        web_url = result.response.docs[key].web_url;
                        web_url = web_url.replace("\"", '');

                        $("<div><a href =" + web_url + "  target=\"_blank\"><img src=" + "http://www.nytimes.com/" + photo + " calss='draggme'>" + "</img></a></div>").appendTo('div#gallery_nyt');

                    } //else continue;
                }
            }
            QueryGardian();

        }).fail(function(err) {
            throw err;
        });
    }
}


function QueryGardian() {
    var search = $("input:last").val();

    //https://content.guardianapis.com/search?q=12%20years%20a%20slave&format=json&tag=film/film,tone/reviews&
    //from-date=2010-01-01&show-tags=contributor&show-fields=body,headline,thumbnail,short-url&order-by=relevance&api-key=test

   setTimeout(function() {
        var url = "https://content.guardianapis.com/search";
        url += '?' + $.param({
            'q': search,
            'show-fields': 'body',
            // 'order-by': relevance,
            'from-date': giveStartDate('YYYY-MM-DD'),
            'to-date': giveEndDate('YYYY-MM-DD'),
            'show-blocks': 'all',
            'api-key': "cc07d679-218e-41ce-aadf-90792e934171"

        });
        
        $.ajax({
            url: url,
            method: 'GET',
        }).done(function(result) {

            console.log(result);

            for (var key in result.response.results) {
                if (key < articles) {
                    var headlineS = result.response.results[key].webTitle;
                    // var bodyS = result.response.results[key].blocks.body[0].bodyTextSummary;
                    var bodyS = result.response.results[key].blocks.body[0].bodyHtml;
                    bodyS = bodyS.replace("\"", '');
                    // bodyS = bodyS.substring(0, 550);
                    var web_urlS = result.response.results[key].webUrl;
                    if (result.response.results[key].webPublicationDate) {
                        date_pubS = result.response.results[key].webPublicationDate;
                        date_pubS = date_pubS.substring(0, 10);
                    }

                    // $("#logoS").show();
                    $("article#gardian").show();

                    $("<h5 class=" + resize + " id='header " + key + '\'' + ">" + headlineS + "</h5>").appendTo('article#gardian');
                    $("<h6>" + bodyS + "...</h6>").appendTo('h5:last');
                    $("<br><tt>" + date_pubS + "</tt>").appendTo('h5:last');
                    $("<a href =" + web_urlS + "  target=\"_blank\">" + "&#9755;" + "</a>").appendTo('h6:last');

                    // x = document.querySelectorAll("h2");
                    // $(x[0]).fadeIn();
                    // $("h5").addClass('animated swing');

                }
            }
            // move('.resize');

        }).fail(function(err) {
            throw err;
        });
    }, 0);
}


function RunMyNews(newsAgr) {

    var url = "https://newsapi.org/v1/articles";
    url += '?' + $.param({
        'source': newsAgr,
        'sortBy': 'top',
        'apiKey': '69680bf6a5aa47b9ad8e25aceefafe5a'
    });
    $.ajax({
        url: url,
        method: 'GET',
    }).done(function(result) {

        newsMarquee = [];
        for (var key in result.articles) {

            newsMarquee[key] = headline = result.articles[key].title;
        }

        newsLine = PrepereNewsString();
        console.log(newsLine.replace(/&nbsp;/g, ''));
        $("<p class='marquee' " + ">" + newsLine + "</p>").appendTo('#news_container');

    }).fail(function(err) {
        throw err;
    });
}


// var runMyNews = setInterval(function() {}(), 6000000);
$("article#gardian h5").hover(function() {
    $(this).css("background-color", "darkmagenta");
});

function toggleFocus(e) {
    $("main").toggleClass("lighter", 200, "swing");
    $('#lamp_Clicker').toggleClass('changed');

    console.log(e.type);

}

function clr(elm) {
    $(elm).remove();
}


(function() {
    key = 0;
    newsAgrArray = [
         'bbc-news',
         'the-washington-post',
         'business-insider',
         'cnn',
         'usa_today',
         'the-washington-post',
         'the-new-york-times',
         'daily-mail'
    ];


    RunMyNews(newsAgrArray[key]);

    var x = 0;
    setInterval(function() {
        key++;
        clr('.marquee');
        RunMyNews(newsAgrArray[key]);
        if (++x === articles - 1) {
            window.clearInterval(intervalID);
        }
    }, 75000);
})();


$(document).ready(function(event) {

    $('input#ny_search').keypress(function(e) {
        if (e.which == 13) {
            console.log(e);
            runSearch();
        }
    });

    runSearch();

    $('#ny_click').click(runSearch);
    $('#lamp_Clicker').on('focus', toggleFocus);
    $('#lamp_Clicker').on('click', toggleFocus);


});