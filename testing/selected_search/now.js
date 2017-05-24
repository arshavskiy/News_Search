$(function() {
    $('input[type="radio"]').click(function() {
        if ($(this).is(':checked')) {
            n = $(this).val();
            console.log(n);
            RunMyNews(n);
        }
    });
});

function countChecked() {
    $('input:checkbox:checked').each(function() {
        if (this.checked) {
            console.log($(this).attr("value"));
        }
    });
}

function RunMyNews(search) {
    var url = "https://newsapi.org/v1/articles";
    url += '?' + $.param({
        'source': search,
        'sortBy': 'top',
        'apiKey': '69680bf6a5aa47b9ad8e25aceefafe5a'
    });
    $.ajax({
        url: url,
        method: 'GET',
    }).done(function(result) {

        clr("article#news_all>h5");
        clr("article#news_all>img");
        console.log(result);

        for (var key in result.articles) {
            if (key < 10) {
                headline = result.articles[key].title;
                byline = result.articles[key].author;
                snippet = result.articles[key].description;
                web_url = result.articles[key].url;
                web_url = web_url.replace("\"", '');
                pub_date = result.articles[key].publishedAt;
                if (pub_date) {
                    pub_date = pub_date.substring(0, 10);
                }
                $("<h5 id='header " + key + '\'' + ">" + headline + "</h5>").appendTo('article#news_all');
                // $("<img src=" + "http://www.nytimes.com/" + photo + ">" + "</img>").appendTo('div#gallery_nyt');
                if (snippet) {
                    $("<h6>" + snippet + "</h6>").appendTo('h5:last');
                }

                if (byline) {
                    $("<b>" + byline + "</b>").appendTo('h5:last');
                }
                // $("<br><tt>" + pub_date + "</tt>").appendTo('h5:last');
                $("<a href =" + web_url + "  target=\"_blank\"></a>").appendTo('h5:last');
            }
        }

    }).fail(function(err) {
        throw err;
    });
}

$('#lamp_Clicker').on('focus', toggleFocus);
$('#lamp_Clicker').on('click', toggleFocus);


RunMyNews(search = 'bbc-news');

// $('article').mouseover(selected);