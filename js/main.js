function buildArticlePost(type, box, container, headline, snippet, web_url, pub_date, img) {
    $('<article>').addClass(type).appendTo(box);
    img  = "https://www.nytimes.com/"+ img || '';

    $('img', { 
        src : img
    }).appendTo(container);
    $('<h2>', {
        html: $('<span>', {
            text: headline,
        })
    }).appendTo(container);

    if (snippet) {
        $("<p>").html(snippet).appendTo(container);
    }
    $('<a>', {
        href: web_url,
        target: '_blank',
        title: web_url
    }).html(byline).appendTo(container);

    $("<date>").html(pub_date).appendTo(container);
    $(container).click(function () {
        $(this).toggleClass("selected");
    });

    $(container).on('click', e => {
        let headline = e.currentTarget.children[0].innerText;
        let snippet = e.currentTarget.children[1].innerText;
        let web_url = e.currentTarget.children[2].innerText;
        let pub_date = e.currentTarget.children[3].innerText;
        rememberMySearchResolts(headline, snippet, web_url, pub_date);
    });

}

function getByPromise(url) {
    let p = new Promise(function (resolve, reject) {
        $.get(url, function (data) {
            resolve(data);
            console.log(search + ' in ' + strUser);
        });
    });
    return p;
}

function runSearch(search = 'gods') {

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
       

        let url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
        url += '?' + $.param({
            'api-key': "XwUT5JobKB82XW1ipcB6t85trGj1Y8HE",
            'q': search,
            'fq': 'news_desk' + '(' + strUser + ')',
            'begin_date': giveStartDate('YYYYMMDD'),
            'end_date': giveEndDate('YYYYMMDD'),
            'show-fields': 'all',
            //'fields': "body,headline,snippet,lead_paragraph,web_url,byline",
            'sort': "newest",
            'page': page

        });

        let getTimesData = getByPromise(url);

        Promise.all([getTimesData])
            .then(function (result) {
                page++;
                if (result[0].response.docs.length){
                    buildMyNYTArticle(result[0]);
                    photoGallery(result[0]);
                } else (runSearch());

                if ($("input:last").val()) {
                    $('#nextNyt').show();
                }
            });
    }
}

function buildMyNYTArticle(result) {
    for (let key in result.response.docs) {

        let container = 'article:last';
        let box = 'section#nyt';
        let snippet;
        let web_url;
        let pub_date;
        let type = 'nyt';
        let img;

        if (key < articlesNyt) {
            let headline = result.response.docs[key].headline.main;
            if (result.response.docs[key].snippet) {
                snippet = result.response.docs[key].snippet;
            } else {
                nippet = result.response.docs[key].lead_paragraph;
            }
            web_url = result.response.docs[key].web_url.replace("\"", '');
            pub_date = result.response.docs[key].pub_date.substring(0, 10);

            if (result.response.docs[key].byline) {
                byline = result.response.docs[key].byline.original;
            }
            
            if (result.response.docs[key].multimedia[1]) {
                img = result.response.docs[key].multimedia[1].url.replace("\"", '');
            }

            buildArticlePost(type, box, container, headline, snippet, web_url, pub_date, img);

        }
    }
}

function photoGallery(result) {
    photoArr = [];
    for (let key in result.response.docs) {
        if (key < articlesNyt) {
            if (result.response.docs[key].multimedia[1]) {
                let photo = result.response.docs[key].multimedia[1].url.replace("\"", '');
                photoArr[key] = "https://www.nytimes.com/" + photo;
                let web_url = result.response.docs[key].web_url.replace("\"", '');
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

    let counter = 1;
    let photoArrNewsLine = [];

    for (let i = 0; i < newsAgr.length; i++) {

        let newsAgr2 = newsAgr[i];

        let url = "https://newsapi.org/v1/articles";
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

            for (let key in result.articles) {

                let newsLinePage = result.articles[key].title;
                let newsLinePhoto = result.articles[key].urlToImage;
                let newsLinedescription = result.articles[key].description;
                let urlLink = result.articles[key].url;
                photoArrNewsLine[key] = newsLinePhoto;

                if (newsLinePhoto) {
                    let newsLinePhoto = newsLinePhoto.replace("\"", '');
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

                counter++;
            }

        }).fail(function (err) {
            throw err;
        });

    }
}

let page = 0;

$.getJSON('https://ipinfo.io', function (data) {
    if (data.city) {
        runSearch(data.city);
    } else {
        runSearch()
    }
    console.log(data.city);

}).fail(function () {
    runSearch();
});


$('input#ny_search').keypress(function (e) {
    if (e.which == 13) {
        runSearch();
    }
});

$('#nytBtn').on('click', function () {
    runSearch();
    // QueryGardian();
});

$('#ny_click').on('click', function () {
    runSearch();
});

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