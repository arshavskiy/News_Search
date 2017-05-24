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

function buildArticlePost(box, container, headline, snippet, byline, pub_date) {

    $('<article>').appendTo(box);
    $("<h2>").html(headline).appendTo(container);
    if (snippet) {
        $("<p>").html(snippet).appendTo(container);
    } else if (lead_paragraph) {
        $("<p>").html(lead_paragraph).appendTo(container);
    }
    $('<strong>').html(byline).appendTo(container);
    if (pub_date) {
        $("<date>").html(pub_date).appendTo(container);
    }
    // $('<a>', {
    //     href: web_url,
    //     target: '_blank',
    //     title: web_url
    // }).html('&#9755').appendTo(container);
}

articles = 9;
articlesNyt = 8;

function runSearch(e, search = 'fake news', page = 1) {
    // var date = giveNowDate();
    clr('#gallery_nyt div');
    clr('img');
    clr('article');

    strUser = $("#ddlViewBy :selected").val();
    resize = '';


    if (!page) {
        page = 1;
    }

    if (search) {
        var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
        url += '?' + $.param({
            'api-key': "4e68f99a5f41443c9fff43f1791bb49e",
            'q': search,
            'fq': 'news_desk' + '(' + strUser + ')',
            'begin_date': giveStartDate('YYYYMMDD'),
            'end_date': giveEndDate('YYYYMMDD'),
            'show-fields': 'all',
            //'fields': "body,headline,snippet,lead_paragraph,web_url,byline",
            'sort': "newest",
            'page': page

        });
        $.ajax({
            url: url,
            method: 'GET',
        }).done(function (result) {

            for (var key in result.response.docs) {

                var container = 'article:last';
                var box = 'section#nyt';

                if (key < articlesNyt) {
                    var headline = result.response.docs[key].headline.main;
                    if (result.response.docs[key].snippet) {
                        var snippet = result.response.docs[key].snippet;
                    } else {
                        var snippet = result.response.docs[key].lead_paragraph;
                    }
                    var web_url = result.response.docs[key].web_url.replace("\"", '');
                    var pub_date = result.response.docs[key].pub_date.substring(0, 10);

                    if (result.response.docs[key].byline) {
                        var byline = result.response.docs[key].byline.original;
                    }
                    // toFileTxt(headline);
                    buildArticlePost(box, container, headline, snippet, byline, pub_date);
                }
            }
            /*TODO buttom and Next Page algoritm
             $('<button class="next_button">').appendTo('h5:last');
            $('.next_button').on('click', function(e){
               page += page;
               runSearch(page);
            });*/

            photoArr = [];
            for (key in result.response.docs) {
                if (key < articlesNyt) {
                    if (result.response.docs[key].multimedia[2]) {
                        var photo = result.response.docs[key].multimedia[2].url.replace("\"", '');
                        photoArr[key] = "http://www.nytimes.com/" + photo;
                        var web_url = result.response.docs[key].web_url.replace("\"", '');
                        $("<div><a href =" + web_url + "  target=\"_blank\"><img src=" + "http://www.nytimes.com/" + photo + ">" + "</img></a></div>").appendTo('section#gallery_nyt');
                    }
                }
            }


        }).fail(function (err) {
            throw err;
        });
    }
}


function QueryGardian(search) {
    strUser = $("#ddlViewBy :selected").val();
    setTimeout(function () {
        var url = "https://content.guardianapis.com/search";
        url += '?' + $.param({
            'section': strUser,
            'q': search,
            'show-fields': 'body',
            'order-by': 'relevance',
            // if relevance is on 
            // 'from-date': giveStartDate('YYYY-MM-DD'),
            // 'to-date': giveEndDate('YYYY-MM-DD'),
            'show-blocks': 'all',
            'api-key': "cc07d679-218e-41ce-aadf-90792e934171"

        });

        $.ajax({
            url: url,
            method: 'GET',
        }).done(function (result) {

            for (var key in result.response.results) {

                var container = 'article:last';
                var web_url = lead_paragraph = snippet = '';
                var box = 'section#gardian';

                if (key < articles) {

                    var headline = result.response.results[key].webTitle;
                    if (result.response.results[key].blocks.body[0].bodyHtml) {
                        snippet = result.response.results[key].blocks.body[0].bodyHtml.replace("\"", '');
                    } else {
                        snippet = result.response.results[key].blocks.body[0].bodyTextSummary.replace("\"", '');
                    }
                    var web_urlS = result.response.results[key].webUrl;
                    if (result.response.results[key].webPublicationDate) {
                        date_pubS = result.response.results[key].webPublicationDate.substring(0, 10);
                    }
                    $("section#gardian").show();
                    buildArticlePost(box, container, headline, snippet, lead_paragraph, web_url, date_pubS);

                    // TODO animation fade in
                    // x = document.querySelectorAll("h2");
                    // $(x[0]).fadeIn();
                    // $("h5").addClass('animated swing');
                }
            }
            // move('.resize');

        }).fail(function (err) {
            throw err;
        });
    }, 0);
}


function hackerNews(search) {
    var url = "https://newsapi.org/v1/articles";
    url += '?' + $.param({
        'source': 'hacker-news',
        'sortBy': 'top',
        'apiKey': '69680bf6a5aa47b9ad8e25aceefafe5a'
    });
    $.ajax({
        url: url,
        method: 'GET',
    }).done(function (result) {
        for (var key in result.articles) {
            var box = 'section#hacker';
            var container = 'article:last';
            var pub_date = lead_paragraph = '';

            if (key < 4) {

                var headline = result.articles[key].title;
                var snippet = result.articles[key].description;
                var web_url = result.articles[key].url;

                buildArticlePost(box, container, headline, snippet, web_url, pub_date);
            }
        }
        // move('.resize');

    }).fail(function (err) {
        throw err;
    });
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
    }).done(function (result) {
        newsMarquee = [];
        for (var key in result.articles) {
            newsMarquee[key] = headline = result.articles[key].title;
        }
        newsLine = PrepereNewsString();
        $("<p class='marquee' " + ">" + newsLine + "</p>").appendTo('#news_container');
    }).fail(function (err) {
        throw err;
    });
}

$("section#gardian h5").hover(function () {
    $(this).css("background-color", "darkmagenta");
});

function toggleFocus(e) {
    $("main").toggleClass("lighter", 200, "swing");
    $('#lamp_clicker').toggleClass('changed');
}

function clr(elm) {
    $(elm).remove();
}

(function () {
    key = 0;
    newsAgrArray = [
        'hacker-news',
        'google-news',
        'business-insider',
        'cnn',
        'usa_today',
        'the-washington-post',
        'the-new-york-times',
        'daily-mail'
    ];

    RunMyNews(newsAgrArray[key]);
    var x = 0;

    function intervalAnimation() {
        key++;
        clr('.marquee');
        RunMyNews(newsAgrArray[key]);
        if (++x === newsAgrArray.length - 1) {
            myStopFunction();
        }
    }
    var animVar = setInterval(function () {
        intervalAnimation();
    }, 75000);

    function myStopFunction() {
        clearInterval(animVar);
    }
}());

search = function SearchVar() {
    inputSubmites = $("input:last").val();
    if (inputSubmites) {
        return $("input:last").val();
    }
};

// strUser = $("#ddlViewBy :selected").val();
$('input#ny_search').keypress(function (e) {
    if (e.which == 13) {
        // runSearch(search);
        hackerNews(search);
        QueryGardian(search);
    }
});

$('#ny_click').on('click', function () {
    // runSearch(search);
    hackerNews(search);
    QueryGardian(search);
});

$('#lamp_clicker').on('click', toggleFocus);
// runSearch(search);
hackerNews(search);
QueryGardian(search);