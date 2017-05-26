(function () {
    var key = 0;
    newsAgrArray = [
        'google-news',
        'hacker-news',
        'business-insider',
        'cnn',
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
            clearInterval(animVar);
        }
    }
    var animVar = setInterval(function () {
        intervalAnimation();
    }, 75000);
})();


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
        $("<p>", {
            class: 'marquee',
            text: newsLine,
        }).appendTo('#news_container');
    }).fail(function (err) {
        throw err;
    });
}