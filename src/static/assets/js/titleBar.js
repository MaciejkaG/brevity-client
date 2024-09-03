let prevOnBar = false;

$(window).on("mousemove", function (event) {
    if (event.pageY <= 30 && !prevOnBar) {
        $('.titleBar').addClass('active');
        prevOnBar = true;
    } else if (!(event.pageY <= 30) && prevOnBar) {
        $('.titleBar').removeClass('active');
        prevOnBar = false;
    }
});