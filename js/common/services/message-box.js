/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 11/26/15.
 */
angular.module('Common.Services')
    .factory('MessageBox', function (SweetAlert, cfpLoadingBar,T) {

        var stack_center = {
            "dir1": "down",
            "dir2": "right",
            "firstpos1": 200,
            "firstpos2": ($(window).width() / 2) - (Number(PNotify.prototype.options.width.replace(/\D/g, '')) / 2)
        };
        PNotify.prototype.options.styling = "bootstrap3";
        PNotify.prototype.options.delay = 2000;

        $(window).resize(function () {
            stack_center.firstpos2 = ($(window).width() / 2) - (Number(PNotify.prototype.options.width.replace(/\D/g, '')) / 2);
        });

        return {
            toast: function (message, type) {
                if (type == 'error')
                {
                    new PNotify({
                        title: '',
                        text: message,
                        type: 'error',
                        icon: false,
                        stack: stack_center
                    });
                }
                else if (type == 'success')
                {
                    new PNotify({
                        title: '',
                        text: message,
                        type: 'success',
                        icon: false,
                        stack: stack_center
                    });
                }
                else// if (type == 'info')
                {
                    new PNotify({
                        title: '',
                        text: message,
                        type: 'info',
                        icon: false,
                        stack: stack_center
                    });
                }
            },

            alert: function (title, message) {
                SweetAlert.info(title, message);
            },

            confirm: function (title, message, callback ,comfirmText) {
                if(comfirmText==undefined){
                    comfirmText = T.T('alertTitle.alert_button_yes');
                }
                SweetAlert.swal({
                    title: title,
                    text: message,
                    type: 'info',
                    showCancelButton: true,
                    confirmButtonText:  comfirmText,
                    cancelButtonText: T.T('alertTitle.alert_button_cancel'),
                    closeOnConfirm: true,
                    html: false
                }, function (isConfirm) {
                    if(callback){
                        callback(isConfirm);
                    }
                });
            },

            alertView: function (title, message, callback) {
                SweetAlert.swal({
                    title: title,
                    text: message,
                    type: 'info',
                    showCancelButton: false,
                    confirmButtonText:  'OK',
                    closeOnConfirm: true,
                    html: false
                }, function (isConfirm) {
                    if(callback){
                        callback(isConfirm);
                    }
                });
            },

            successView: function (title, message, callback) {
                SweetAlert.swal({
                    title: title,
                    text: message,
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText:  'OK',
                    closeOnConfirm: true,
                    html: false
                }, function (isConfirm) {
                    if(callback){
                        callback(isConfirm);
                    }
                });
            },

            showLoading:function(){
                cfpLoadingBar.start();
            },

            hideLoading:function(){
                cfpLoadingBar.complete();
            }
        }
    });

