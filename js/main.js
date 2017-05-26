function buildArticlePost(type, box, container, headline, snippet, web_url, pub_date) {
    $('<article>').addClass(type).appendTo(box);
    // if (imageUrl) {
    //     $('article:last').css('background-image', 'url(' + imageUrl + ')');
    // }
    $("<h2>").html(headline).appendTo(container);
    if (snippet) {
        $("<p>").html(snippet).appendTo(container);
    }
    $('<a>', {
        href: web_url,
        target: '_blank',
        title: web_url
    }).html(byline).appendTo(container);

    // $('<strong>').html(byline).appendTo(container);
    $("<date>").html(pub_date).appendTo(container);
    $(container).click(function () {
        $(this).toggleClass("selected");
    });

    $(container).on('click', e => {
        var headline = e.currentTarget.children[0].innerText;
        var snippet = e.currentTarget.children[1].innerText;
        var web_url = e.currentTarget.children[2].innerText;
        var pub_date = e.currentTarget.children[3].innerText;
        rememberMySearchResolts(headline, snippet, web_url, pub_date);
    });

}



function runSearch(search = 'gods') {
    // var date = giveNowDate();

    clr('article');
    clr('#gallery_nyt div');
    clr('img');
    $('section#nyt').show();
    if ($('#NewslinePage').children()) {
        $('#NewslinePage').children().remove();
    }

    strUser = $("#ddlViewBy :selected").val();
    resize = '';
    articles = 8;
    articlesNyt = 8;

    inputSubmites = $("input:last").val();
    if (inputSubmites) {
        search = inputSubmites;
    }
    if (search) {
        function getByPromise(url) {
            var p = new Promise(function (resolve, reject) {
                $.get(url, function (data) {
                    resolve(data);
                    console.log(search + ' in ' + strUser);
                });
            });
            return p;
        }

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

        var getTimesData = getByPromise(url);
        Promise.all([getTimesData])
            .then(function (result) {
                page++;

                buildMyNYTArticle(result[0]);
                photoGallery(result[0]);

                if ($("input:last").val()) {
                    $('#nextNyt').show();
                }
            })
    }
}

function buildMyNYTArticle(result) {
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
                byline = result.response.docs[key].byline.original;
            }
            // toFileTxt(headline);
            // if (result.response.docs[key].multimedia[2]) {
            //     var imageUrl = result.response.docs[key].multimedia[2].url.replace("\"", '');
            //     imageUrl = "https://www.nytimes.com/" + imageUrl;
            // }
            var type = 'nyt';
            buildArticlePost(type, box, container, headline, snippet, web_url, pub_date);
            // rememberMySearchResolts(headline, snippet, web_url, pub_date);
        }
    }
}

function photoGallery(result) {
    photoArr = [];
    for (key in result.response.docs) {
        if (key < articlesNyt) {
            if (result.response.docs[key].multimedia[1]) {
                var photo = result.response.docs[key].multimedia[1].url.replace("\"", '');
                photoArr[key] = "https://www.nytimes.com/" + photo;
                var web_url = result.response.docs[key].web_url.replace("\"", '');
                $('<div>', {
                    html: $('<a>', {
                        href: web_url,
                        target: "_blank",
                        html: $('<img>', {
                            src: photoArr[key]
                        })
                    })
                }).appendTo('#gallery_nyt');
            }
        }
    }
}



// function QueryGardian(search) {

//     $('#nextNyt').hide();

//     clr('article');
//     clr('#gallery_nyt div');
//     clr('img');
//     if ($('#NewslinePage').children()) {
//         $('#NewslinePage').children().remove();
//     }

//     search = $("input:last").val();
//     console.log(search);
//     strUser = $("#ddlViewBy :selected").val();

//     function getByPromise(url) {
//         var p = new Promise(function (resolve, reject) {
//             $.get(url, function (data) {
//                 resolve(data);
//             });
//         });
//         return p;
//     }

//     var url = "https://content.guardianapis.com/search";
//     url += '?' + $.param({
//         'section': strUser,
//         'q': search,
//         'show-fields': 'body',
//         'order-by': 'relevance',
//         // if relevance is off 
//         // 'from-date': giveStartDate('YYYY-MM-DD'),
//         // 'to-date': giveEndDate('YYYY-MM-DD'),
//         'show-blocks': 'all',
//         'api-key': "cc07d679-218e-41ce-aadf-90792e934171"

//     });

//     $.ajax({
//         url: url,
//         method: 'GET',
//     }).done(function (result) {

//         buildMyGARrticle(result);

//         // TODO animation fade in
//         // x = document.querySelectorAll("h2");
//         // $(x[0]).fadeIn();
//         // $("h5").addClass('animated swing');


//         // move('.resize');

//     }).fail(function (err) {
//         throw err;
//     });
// }


// function buildMyGARrticle(result) {
//     for (var key in result.response.results) {

//         var container = 'article:last';
//         var web_url = lead_paragraph = snippet = '';
//         var box = 'section#gardian';

//         if (key < articles) {

//             var headline = result.response.results[key].webTitle;
//             if (result.response.results[key].blocks.body[0].bodyHtml) {
//                 snippet = result.response.results[key].blocks.body[0].bodyHtml.replace("\"", '');
//             } else {
//                 snippet = result.response.results[key].blocks.body[0].bodyTextSummary.replace("\"", '');
//             }
//             var web_urlS = result.response.results[key].webUrl;
//             if (result.response.results[key].webPublicationDate) {
//                 date_pubS = result.response.results[key].webPublicationDate.substring(0, 10);
//             }
//             $("section#gardian").show();
//             var type = 'gur';
//             buildArticlePost(type, box, container, headline, snippet, lead_paragraph, web_url, date_pubS);

//         }
//     }
// }

function runNewsLinePage(newsAgr) {

    $('#nextNyt').hide();

    $('.next button').hide();
    clr('article');
    clr('#gallery_nyt div');
    clr('img');
    $('section#nyt').hide();
    if ($('#NewslinePage')) {
        $('#NewslinePage').children().remove();
    }

    var counter = 1;
    var photoArrNewsLine = [];

    for (var index = 0; index < newsAgr.length; index++) {

        let newsAgr2 = newsAgr[index];

        var url = "https://newsapi.org/v1/articles";
        url += '?' + $.param({
            'source': newsAgr2,
            'sortBy': 'top',
            'apiKey': '69680bf6a5aa47b9ad8e25aceefafe5a'
        });
        $.ajax({
            url: url,
            method: 'GET',
        }).done(function (result) {
            $('<h5>').html(newsAgr2.toUpperCase()).addClass('news_name').appendTo('#NewslinePage');

            for (var key in result.articles) {

                var newsLinePage = result.articles[key].title;
                var newsLinePhoto = result.articles[key].urlToImage;
                var newsLinedescription = result.articles[key].description;
                var urlLink = result.articles[key].url;
                photoArrNewsLine[key] = newsLinePhoto;

                if (newsLinePhoto) {
                    var newsLinePhoto = newsLinePhoto.replace("\"", '');
                }

                $("<h2>", {
                    text: counter + '\.' + newsLinePage,
                }).appendTo('#NewslinePage');

                $("<em>", {
                    text: newsLinedescription,
                }).appendTo('#NewslinePage');

                $("<a>", {
                    text: "▻",
                    target: '_blank',
                    href: urlLink,
                }).appendTo('#NewslinePage');


                $("<img>", {
                    src: newsLinePhoto,
                    class: 'gallery_line_img',
                }).appendTo('#gallery_line');

                // $("<a href =" + urlLink + "  target=\"_blank\"><img src=" + newsLinePhoto + ">" + "</img></a>").appendTo('#gallery_line');

                counter++;
            }

        }).fail(function (err) {
            throw err;
        });

    }
}

var page = 0;

// var ip = $.getJSON('https://ipinfo.io', function (data) {
// });
// runSearch(ip.responseJSON.city);

$.getJSON('https://ipinfo.io', function (data) {
    if (data.city) {
        runSearch(data.city);
    } else {
        runSearch()
    }
    console.log(data.city);
});


$('input#ny_search').keypress(function (e) {
    if (e.which == 13) {
        runSearch();
        // QueryGardian();

    }
});

$('#nytBtn').on('click', function () {
    runSearch();
    // QueryGardian();
});

$('#ny_click').on('click', function () {
    runSearch();
});

$('#gurBtn').on('click', function () {
    // runSearch();
    QueryGardian();
});

// $('#nextGur').on('click', function () {
//     QueryGardian();
// });


$('<button>', {
    text: 'next',
    id: 'nextNyt',
    class: 'next',
    click: runSearch,
}).appendTo('nav:last');


$('#newsBtn').on('click', function () {
    let newsAgrArrayPage = [
        'the-washington-post',
        'cnn',
        'the-new-york-times'
    ];

    runNewsLinePage(newsAgrArrayPage);

});

$('#newsTechBtn').on('click', function () {
    let newsAgrArrayPage = [
        'ars-technica',
        'engadget',
        'recode',
        'techcrunch',
        'techradar',
        'hacker-news',
        'new-scientist',

    ];
    runNewsLinePage(newsAgrArrayPage);
});

$('#newsLineBtn').on('click', function () {
    let newsAgrArrayPage = [
        'bloomberg',
        'business-insider',
        'cnbc',
        'fortune',
        'financial-times',
        'the-economist',
    ];
    runNewsLinePage(newsAgrArrayPage);
});

$('#newsEnterBtn').on('click', function () {
    let newsAgrArrayPage = [
        'buzzfeed',
        'daily-mail',
        'entertainment-weekly',
        'the-lad-bible',
        'mashable',
    ];
    runNewsLinePage(newsAgrArrayPage);
});


$("section#gardian h5").hover(function () {
    $(this).css("background-color", "darkmagenta");
});

$('#lamp_clicker').on('click', toggleFocus);