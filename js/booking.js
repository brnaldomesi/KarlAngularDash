/**
 * Created by lqh on 2017/3/1.
 */

var widgetLang;
var hideFlowIframe = function () {
    var iframes = document.getElementById("atag-pop-book-frame");
    iframes.style.display = "none";
    var bookWidget = document.getElementById("atag-book-widget");
    bookWidget.src = undefined;
};
var createPopWindow = function () {
    var link = document.scripts[document.scripts.length - 1].src;
    var handleLink = link.split('/');
    handleLink.splice(-2);
    var imgSrc = handleLink.join('/');
    // console.log(imgSrc);
    var popFrame = document.getElementById("atag-pop-book-frame");
    if (popFrame) {
        return;
    } else {
        popFrame = document.createElement('div');
        popFrame.id = "atag-pop-book-frame";
        popFrame.style.display = "none";
        popFrame.style.height = "100%";
        popFrame.style.width = "100%";
        popFrame.style.top = "0";
        popFrame.style.position = "fixed";
        popFrame.style.backgroundColor = "rgba(0,0,0,0.5)";
        popFrame.style.zIndex = 9999999;
        var closeButton = document.createElement("img");
        closeButton.id = 'close-Button';
        closeButton.src = imgSrc + "/img/dashboard/close_red.png";
        closeButton.style.position = "absolute";
        closeButton.style.margin = "auto";
        closeButton.style.width = "35px";
        closeButton.style.height = "35px";
        closeButton.style.cursor = "pointer";
        popFrame.appendChild(closeButton);
        var frameWidget = document.createElement("iframe");
        frameWidget.name = "atag-book-widget";
        frameWidget.id = "atag-book-widget";
        frameWidget.style.border = "none";
        frameWidget.style.overflow = "scroll";
        frameWidget.style.marginTop = "5%";
        frameWidget.style.marginLeft = "10%";
        frameWidget.style.height = "80%";
        frameWidget.style.width = "80%";
        frameWidget.onload = function () {
            popFrame.onclick = function () {
                // console.log(widgetLang)
                var langMessage;
                if(widgetLang){
                    if(widgetLang==='fr'){
                        langMessage='Êtes-vous sûr de vouloir quitter toutes vos informations seront perdues?';
                    }else {
                        langMessage='Are you sure you want to exit all your info will be lost?';
                    }
                }else {
                    langMessage='Are you sure you want to exit all your info will be lost?';
                }

                var r = confirm(langMessage);
                if (r == true) {
                    hideFlowIframe();
                }
                else {
                    return;
                }
            };
            closeButton.onclick = function (e) {
                // console.log(widgetLang)
                var langMessage;
                if(widgetLang){
                    if(widgetLang==='fr'){
                        langMessage='Êtes-vous sûr de vouloir quitter toutes vos informations seront perdues?';
                    }else {
                        langMessage='Are you sure you want to exit all your info will be lost?';
                    }
                }else {
                    langMessage='Are you sure you want to exit all your info will be lost?';
                }
                if (e && e.stopPropagation) {
                    e.stopPropagation();
                }
                var r = confirm(langMessage);
                if (r == true) {
                    hideFlowIframe();
                }
                else {
                    return;
                }
            };
        };
        popFrame.appendChild(frameWidget);
        document.body.appendChild(popFrame);
    }
};

window.onresize = function () {
    distanceCloseButton();
};

var distanceCloseButton = function () {
    var iframe = window.document.getElementById('atag-book-widget');
    var closeButton = window.document.getElementById('close-Button');
    var atagPop = window.document.getElementById('atag-pop-book-frame');
    closeButton.style.top = iframe.offsetTop + 'px';
    closeButton.style.left = atagPop.offsetWidth - iframe.offsetLeft - 50 + 'px';
};

var showPopWindow = function () {
    var iframes = document.getElementById("atag-pop-book-frame");
    iframes.style.display = "block";
    distanceCloseButton()
};

window.addEventListener('message', function (e) {
    if (e && e.data && e.data.toString() === ('showPopWindows')) {
        showPopWindow();
        if (document.cookie) {
            var getWidgetLang = document.cookie.split(';');
            // console.log(getWidgetLang);
            for (var i = 0; i < getWidgetLang.length; i++) {
                if (getWidgetLang[i].indexOf('widgetLang') > -1) {
                    widgetLang = getWidgetLang[i].split('=')[1];
                }
            }
        }
    }
    if (e && e.data && e.data.toString() === ('hideFlowIframe')) {
        hideFlowIframe();
    }
}, false);


createPopWindow();
// document.
//