/*
function keyUp() {

    $("input")
        .keyup(function() {
            var value = $(this).val();
            $("p").text(value);
        }).keyup();
}


function toFileTxt(url) {
    result = JSON.stringify(url);
    $.post('post.php', { 'data': result }, function(data) { //{ 'data': "\'" + result + "\'" }

        $.get('get.php', function(data) {
            if (data) {
                console.log("file done");
            }
        });
    });
}



countChecked();
$("input[type=checkbox]").on("click", countChecked);


function move(el) {

    $(el).draggable();
    $(el).resizable();
}


function selected(event) {
    var elm = $(event.target);
    console.log(elm);
    elm.toggleClass('selected');
}

*/

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

function toggleFocus(e) {
    $("main").toggleClass("lighter", 200, "swing");
    $('#lamp_clicker').toggleClass('changed');
}

function clr(elm) {
    $(elm).remove();
}