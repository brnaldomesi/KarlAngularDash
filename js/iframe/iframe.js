/**
 * Created by lqh on 2017/3/1.
 */
var widgetLang;
var widgetLink;
var hiddenPopWidgetWindow = function () {
    var iframes = document.getElementById("book-widget");
    if(iframes){
        iframes.parentNode.parentNode.removeChild(iframes.parentNode);
    }
};
var createPopWidgetWindow = function (url) {
    var link = document.scripts[document.scripts.length - 1].src;
    var handleLink=link.split('/');
    handleLink.splice(3);
    var imgSrc=handleLink.join('/');
    console.log(imgSrc);
    var popFrame = document.getElementById("pop-frame");
    if(popFrame){
        return;
    }else{
        popFrame = document.createElement('div');
        popFrame.id = "pop-frame";
        popFrame.style.height = "100%";
        popFrame.style.width = "100%";
        popFrame.style.top = "0";
        popFrame.style.position="fixed";
        popFrame.style.display="block";
        popFrame.style.backgroundColor="rgba(0,0,0,0.5)";
        popFrame.style.zIndex=9999999;
        var closeButton = document.createElement("img");
        closeButton.onclick=function (e) {
            console.log(widgetLang)
            var langMessage
            if(widgetLang){
                if(widgetLang==='fr'){
                    langMessage='Êtes-vous sûr de vouloir quitter toutes vos informations seront perdues?';
                }else {
                    langMessage='Are you sure you want to exit all your info will be lost?';
                }
            }else {
                langMessage='Are you sure you want to exit all your info will be lost?';
            }
            if(e&&e.stopPropagation){
                e.stopPropagation();
            }
            var r = confirm(langMessage);
            if (r == true) {
                hiddenPopWidgetWindow();
            }
            else {
                return;
            }
        };
        closeButton.id = 'close-Buttons';
        closeButton.src = imgSrc+"/img/dashboard/close_red.png";
        closeButton.style.position="absolute";
        closeButton.style.margin="auto";
        closeButton.style.width="35px";
        closeButton.style.height="35px";
        closeButton.style.cursor="pointer";
        popFrame.appendChild(closeButton);
        var frameWidget = document.createElement("iframe");
        frameWidget.id = "book-widget";
        frameWidget.src = url;
        frameWidget.style.border = "none";
        frameWidget.style.overflow = "scroll";
        frameWidget.style.marginTop = "5%";
        frameWidget.style.marginLeft = "10%";
        frameWidget.style.height = "80%";
        frameWidget.style.width = "80%";
        frameWidget.onload=function () {
            popFrame.onclick=function () {
                console.log(widgetLang)
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
                    hiddenPopWidgetWindow();
                }
                else {
                    return;
                }
            }
        };
        popFrame.appendChild(frameWidget);
        document.body.appendChild(popFrame);
    }
    var atagPop = window.document.getElementById('pop-frame');
    var closeButtons = window.document.getElementById('close-Buttons');
    var iframe = window.document.getElementById('book-widget');
    closeButtons.style.top = iframe.offsetTop + 'px';
    closeButtons.style.left = atagPop.offsetWidth-iframe.offsetLeft-50+'px';
};

var addEvent = function(object, type, callback) {
    if (object == null || typeof(object) == 'undefined') return;
    if (object.addEventListener) {
        object.addEventListener(type, callback, false);
    } else if (object.attachEvent) {
        object.attachEvent("on" + type, callback);
    } else {
        object["on"+type] = callback;
    }
};

addEvent(window, "resize", function() {
    var atagPop = window.document.getElementById('pop-frame');
    var closeButton = window.document.getElementById('close-Buttons');
    var iframe = window.document.getElementById('book-widget');
    if(iframe){
        closeButton.style.top = iframe.offsetTop + 'px';
        closeButton.style.left = atagPop.offsetWidth-iframe.offsetLeft-50+'px';
    }
});

window.addEventListener('message', function (e) {
    if (e && e.data && e.data.toString().indexOf('displayFlowIframe') == 0) {
        var url = e.data.toString().substr('displayFlowIframe'.length + 1);
        createPopWidgetWindow(url)
        console.log(widgetLink)
        var args = widgetLink.substr(widgetLink.indexOf("?") + 1).split("&");
        for ( var i = 0; i < args.length; i++) {
            var j = args[i].indexOf("=");
            if (j > -1 && args[i].substr(0, j) === 'lang') {
                widgetLang = args[i].substr(j + 1);
            }
        }
    }
    if (e && e.data && e.data.toString() == 'hideFlowIframe') {
        hiddenPopWidgetWindow()
    }
}, false);

var match = function (value,min) {
    if(value.indexOf("%")>0){
        return "100%";
    }else if(value.toLocaleString().indexOf("px")>0){
        var size = parseInt(value.substring(0,value.length-2));
        return (size>min?size:min)+"px";
    }
};


var initWidget = function () {
    widgetLink = document.scripts[document.scripts.length - 1].src;
    var comId;
    var widType;
    var widgetId=undefined;
    var gaKey;
    var fpkey;
    var lang;
    var src = document.scripts[document.scripts.length - 1].src;
    var args = src.substr(src.indexOf("?") + 1).split("&");
    var url = src.split("/");
    for ( var i = 0; i < args.length; i++) {
        var j = args[i].indexOf("=");
        if (j > -1 && args[i].substr(0, j) === 'c_id') {
            comId = args[i].substr(j + 1);
        }
        if (j > -1 && args[i].substr(0, j) === 'w_type') {
            widType = args[i].substr(j + 1);
        }
        if (j > -1 && args[i].substr(0, j) === 'w_id') {
            widgetId = args[i].substr(j + 1);
        }
        if (j > -1 && args[i].substr(0, j) === 'gaKey') {
            gaKey = args[i].substr(j + 1);
        }
        if (j > -1 && args[i].substr(0, j) === 'fpkey') {
            fpkey = args[i].substr(j + 1);
        }
        if (j > -1 && args[i].substr(0, j) === 'lang') {
            lang = args[i].substr(j + 1);
        }
    }
    if(widgetId === undefined){
        widgetId="karl-booking-widget"
    }
    var widget = document.getElementById(widgetId);

    var iframe = document.createElement('iframe');
    switch (parseInt(widType)){
        case 1:
            iframe.style.width = match(widget.style.width , 340 );
            iframe.style.height = match(widget.style.height , 350 );
            break;
        case 2:
            iframe.style.width = match(widget.style.width , 540);
            iframe.style.height = match(widget.style.height , 230 );
            break;
        case 3:
            iframe.style.width = match(widget.style.width , 340);
            iframe.style.height = match(widget.style.height , 350 );
            break;
        case 4:
            iframe.style.width = match(widget.style.width , 540);
            iframe.style.height = match(widget.style.height , 230 );
            break;
        case 5:
            iframe.style.width = match(widget.style.width ,170);
            iframe.style.height = match(widget.style.height ,400  );

            break;
        case 6:
            iframe.style.width = widget.style.width > 170? widget.style.width:"170px";
            iframe.style.height = widget.style.height > 400 ? widget.style.height:"400px";
            break;
        default:
            iframe.style.width = "100%";
            iframe.style.height = "100%";
            break;
    }
    iframe.style.border = "none";
    iframe.src = url[0]+"//"+url[2]+"/widget.html#/widget?widget_id="+widType+"&company_id="+comId;
    if(gaKey){
        iframe.src+='&gaKey='+gaKey
    }
    if(fpkey){
        iframe.src+='&fpkey='+fpkey
    }
    if(lang){
        iframe.src+='&lang='+lang
    }
    iframe.frameborder = "0";
    iframe.seamless = "seamless";
    iframe.scrolling = "auto";
    widget.appendChild(iframe);

};

initWidget();
// document.
//