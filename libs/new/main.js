$(document).ready(function(){
    $(".card-more").click(function(){
        $(this).next().fadeToggle(
        );
        $(this).fadeToggle(
            $(this).children("i").toggleClass("fa-ellipsis-v")
        );
    });
});

$(document).ready(function(){
    $(".pay-more").click(function(){

        $(this).nextUntil(1).fadeToggle();

        $(this).fadeToggle(
            $(this).children("i").toggleClass("fa-ellipsis-v")
        );
    });
});

/////删除client/////
$(document).ready(function(){
    $(".card-del").click(function(){
        $(this).parent().find(".card-del-panel").fadeIn(200);
    });
    $(".card-del-cancel").click(function(){
        $(this).parents(".card-del-panel").fadeOut(200);
    });
});

///删除payment////
$(document).ready(function(){
    $(".card-del").click(function(){
        $(this).parent().find(".pay-del-panel").fadeIn(200);
    });
    $(".card-del-cancel").click(function(){
        $(this).parents(".pay-del-panel").fadeOut(200);
    });
});

// /************* 左右滑动tab ************* /
$(".nav-slider li").click(function (e) {

    var mywhidth = $(this).width();
    $(this).addClass("act-tab");
    $(this).siblings().removeClass("act-tab");

    // make sure we cannot click the slider
    if ($(this).hasClass('slider')) {
        return;
    }

    /* Add the slider movement */

    // what tab was pressed
    var whatTab = $(this).index();

    // Work out how far the slider needs to go
    var howFar = mywhidth * whatTab;

    $(".slider").css({
        left: howFar + "px"
    });


});
// /************* / 左右滑动tab ************* /
