var counter = 0;
var dataBase = [];


function rememberMySearchResolts(headline, snippet, web_url, pub_date) {
    var searchWord = $("input:last").val();
    dataBase[counter] = {
        headline: headline,
        snippet: snippet,
        web_url: web_url,
        pub_date: pub_date,
        search: searchWord,

    };
    counter++;
}