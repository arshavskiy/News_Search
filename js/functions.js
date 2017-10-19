

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
    return ((newsMarquee.join()).toUpperCase()).replace(/,/g, ', ' + ' ');
    // return ((newsMarquee.join()).toUpperCase()).replace(/,/g, "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp");
}

function toggleFocus(e) {
    $("main").toggleClass("lighter", 200, "swing");
    $('#lamp_clicker').toggleClass('changed');
}

function clr(elm) {
    $(elm).remove();
}
