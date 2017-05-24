var counter = 0;
var dataBase = [];

var searchWord = $("input:last").val();

function rememberMySearchResolts(headline, snippet, web_url, pub_date) {
    dataBase[counter] = {
        search: searchWord,
        headline: headline,
        snippet: snippet,
        web_url: web_url,
        pub_date: pub_date,

    };
    counter++;
}