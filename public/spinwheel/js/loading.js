var width = 100,
    perfData = window.performance.timing,
    EstimatedTime = -(perfData.loadEventEnd - perfData.navigationStart),
    time = parseInt((EstimatedTime/1000)%60)*100;

$(".loadbar").animate({
    width: width + "%"
}, time);

var PercentageID = $("#persen"),
    start = 0,
    end = 100,
    durataion = time;
    animateValue(PercentageID, start, end, durataion);

function animateValue(id, start, end, duration) {
    var range = end - start,
        current = start,
        increment = end > start? 1 : -1,
        stepTime = Math.abs(Math.floor(duration / range)),
        obj = $(id);

    var timer = setInterval(function() {
        current += increment;
        $(obj).text(current + "%");
        //obj.innerHTML = current;
        if (current == end) {
        clearInterval(timer);
        }
    }, stepTime);
}

//Hide preloader
setTimeout(function(){
        $('.preloader').addClass('hide');
        $('body').addClass('body-show');
        // localStorage.clear();
}, time);