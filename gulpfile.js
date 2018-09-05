var gulp = require('gulp');
var concat = require('gulp-concat');
// var jshint = require('gulp-jshint');


gulp.task('default', ['concat-common-services', 'concat-common-controllers', 'concat-common-filters',
    'concat-dashboard-controllers', 'concat-dashboard-services',
    'concat-dashboard-directives', 'concat-dashboard-filters',
    'concat-flow-controllers', 'concat-flow-services', 'concat-flow-directives',
    'concat-widget-controllers', 'concat-widget-services', 'concat-widget-directives',
    'concat-onboard-controllers', 'concat-onboard-services',
    'concat-easysignup-controllers', 'concat-easysignup-services'
]);

gulp.task('watch', ['default'], function () {

    // AngularJS文件监听
    gulp.watch('js/common/services/*.js', ['concat-common-services'], function (event) {
        console.log('Concat common-services ' + event.path);
    });

    gulp.watch('js/common/controllers/*.js', ['concat-common-controllers'], function (event) {
        console.log('Concat common-controllers ' + event.path);
    });

    gulp.watch('js/common/filters/*.js', ['concat-common-filters'], function (event) {
        console.log('Concat common-filters ' + event.path);
    });

    gulp.watch('js/dashboard/controllers/*.js', ['concat-dashboard-controllers'], function (event) {
        console.log('Concat dashboard controllers ' + event.path);
    });

    gulp.watch('js/dashboard/services/*.js', ['concat-dashboard-services'], function (event) {
        console.log('Concat dashboard services' + event.path);
    });

    gulp.watch('js/dashboard/directives/*.js', ['concat-dashboard-directives'], function (event) {
        console.log('Concat dashboard directives' + event.path);
    });

    gulp.watch('js/dashboard/filters/*.js', ['concat-dashboard-filters'], function (event) {
        console.log('Concat dashboard filters' + event.path);
    });

    gulp.watch('js/iframe/flow/controllers/*.js', ['concat-flow-controllers'], function (event) {
        console.log('Concat flow controllers ' + event.path);
    });

    gulp.watch('js/iframe/flow/services/*.js', ['concat-flow-services'], function (event) {
        console.log('Concat flow services' + event.path);
    });

    gulp.watch('js/iframe/flow/directives/*.js', ['concat-flow-directives'], function (event) {
        console.log('Concat flow directives' + event.path);
    });

    gulp.watch('js/iframe/widget/controllers/*.js', ['concat-widget-controllers'], function (event) {
        console.log('Concat widget controllers ' + event.path);
    });

    gulp.watch('js/iframe/widget/services/*.js', ['concat-widget-services'], function (event) {
        console.log('Concat widget services' + event.path);
    });

    gulp.watch('js/iframe/widget/directives/*.js', ['concat-widget-directives'], function (event) {
        console.log('Concat widget directives' + event.path);
    });

    gulp.watch('js/onboard/controllers/*.js', ['concat-onboard-controllers'], function (event) {
        console.log('Concat onboard controllers' + event.path);
    });

    gulp.watch('js/onboard/services/*.js', ['concat-onboard-services'], function (event) {
        console.log('Concat onboard services' + event.path);
    });

    gulp.watch('js/easysignup/controllers/*.js', ['concat-easysignup-controllers'], function (event) {
        console.log('Concat easysignup controllers' + event.path);
    });

    gulp.watch('js/easysignup/services/*.js', ['concat-easysignup-services'], function (event) {
        console.log('Concat easysignup services' + event.path);
    });
});

// Angular合并js
gulp.task('concat-common-services', function () {
    gulp.src(['js/common/services/common-services.js', 'js/common/services/*.js'])
        .pipe(concat('common-services.js'))
        .pipe(gulp.dest('js'));
});

gulp.task('concat-common-controllers', function () {
    gulp.src(['js/common/controllers/controller.js', 'js/common/controllers/*.js'])
        .pipe(concat('common-controller.js'))
        .pipe(gulp.dest('js'));
});

gulp.task('concat-common-filters', function () {
    gulp.src(['js/common/filters/filters.js', 'js/common/filters/*.js'])
        .pipe(concat('common-filters.js'))
        .pipe(gulp.dest('js'));
});

gulp.task('concat-dashboard-controllers', function () {
    gulp.src(['js/dashboard/controllers/controller.js', 'js/dashboard/controllers/*.js'])
        .pipe(concat('dashboard/controllers.js'))
        .pipe(gulp.dest('js'));
});

gulp.task('concat-dashboard-services', function () {
    gulp.src(['js/dashboard/services/service.js', 'js/dashboard/services/*.js'])
        .pipe(concat('dashboard/services.js'))
        .pipe(gulp.dest('js'));
});

gulp.task('concat-dashboard-directives', function () {
    gulp.src(['js/dashboard/directives/directive.js', 'js/dashboard/directives/*.js'])
        .pipe(concat('dashboard/directives.js'))
        .pipe(gulp.dest('js'));
});

gulp.task('concat-dashboard-filters', function () {
    gulp.src(['js/dashboard/filters/filter.js', 'js/dashboard/filters/*.js'])
        .pipe(concat('dashboard/filters.js'))
        .pipe(gulp.dest('js'));
});

gulp.task('concat-flow-controllers', function () {
    gulp.src(['js/iframe/flow/controllers/controller.js', 'js/iframe/flow/controllers/*.js'])
        .pipe(concat('iframe/flow/controllers.js'))
        .pipe(gulp.dest('js'));
});

gulp.task('concat-flow-services', function () {
    gulp.src(['js/iframe/flow/services/service.js', 'js/iframe/flow/services/*.js'])
        .pipe(concat('iframe/flow/services.js'))
        .pipe(gulp.dest('js'));
});

gulp.task('concat-flow-directives', function () {
    gulp.src(['js/iframe/flow/directives/directives.js', 'js/iframe/flow/directives/*.js'])
        .pipe(concat('iframe/flow/directives.js'))
        .pipe(gulp.dest('js'));
});

gulp.task('concat-widget-controllers', function () {
    gulp.src(['js/iframe/widget/controllers/controller.js', 'js/iframe/widget/controllers/*.js'])
        .pipe(concat('iframe/widget/controllers.js'))
        .pipe(gulp.dest('js'));
});

gulp.task('concat-widget-services', function () {
    gulp.src(['js/iframe/widget/services/service.js', 'js/iframe/widget/services/*.js'])
        .pipe(concat('iframe/widget/services.js'))
        .pipe(gulp.dest('js'));
});

gulp.task('concat-widget-directives', function () {
    gulp.src(['js/iframe/widget/directives/directives.js', 'js/iframe/widget/directives/*.js'])
        .pipe(concat('iframe/widget/directives.js'))
        .pipe(gulp.dest('js'));
});

gulp.task('concat-onboard-controllers', function () {
    gulp.src(['js/onboard/controllers/controller.js', 'js/onboard/controllers/*.js'])
        .pipe(concat('onboard/controllers.js'))
        .pipe(gulp.dest('js'));
});

gulp.task('concat-onboard-services', function () {
    gulp.src(['js/onboard/services/service.js', 'js/onboard/services/*.js'])
        .pipe(concat('onboard/services.js'))
        .pipe(gulp.dest('js'));
});

gulp.task('concat-easysignup-controllers', function () {
    gulp.src(['js/easysignup/controllers/controller.js', 'js/easysignup/controllers/*.js'])
        .pipe(concat('easysignup/controllers.js'))
        .pipe(gulp.dest('js'));
});

gulp.task('concat-easysignup-services', function () {
    gulp.src(['js/easysignup/services/service.js', 'js/easysignup/services/*.js'])
        .pipe(concat('easysignup/services.js'))
        .pipe(gulp.dest('js'));
});


