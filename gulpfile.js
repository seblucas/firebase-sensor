'use strict';

var gulp = require('gulp');

// Import dependencies
var jshint = require('gulp-jshint');
var mainBowerFiles = require('main-bower-files');
var concat = require('gulp-concat');
var bootlint = require('gulp-bootlint');
var gulpFilter = require('gulp-filter');
var templateCache = require('gulp-angular-templatecache');
var debug = require('gulp-debug');

var source = 'app/';

var jsSources = [source + 'app.module.js',
                 source + 'app.config.js',
                 source + '**/*.js',
                 '!' + source + 'bower_components/**/*.js',
                 '!' + source + '**/*.spec.js',
                 '!' + source + '**/*.e2e.js',
                 '!' + source + '**/*.mock.js'];

var cssSources = [source + '**/*.css',
                  '!' + source + 'bower_components/**/*.css'];

var htmlSources = [source + '**/*.html',
                   '!' + source + 'bower_components/**/*.html',
                   '!' + source + 'index*.html'];

var publishdir = 'public';
var dist = {
css: publishdir + '/css/',
js: publishdir + '/js/',
fonts: publishdir + '/fonts/',
lang: publishdir + '/lang/'
};
// Define tasks

// Lint Task
gulp.task('bootlint', function () {
    gulp.src([source + '**/*.html'])
        .pipe(bootlint({
          disabledIds: ['E001', 'W001', 'W002', 'W003', 'W005']
        }));
});


// Lint Task
gulp.task('lint', function () {
    gulp.src(jsSources)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('bower', function() {
    var jsFilter = gulpFilter('**/*.js', {restore: true});
    var cssFilter = gulpFilter('**/*.css', {restore: true});
    var fontFilter = gulpFilter('**/*.{otf,eot,svg,ttf,woff,woff2}', {restore: true});

    return gulp.src(mainBowerFiles({ env: 'production' }))
        .pipe(jsFilter)
        .pipe(debug({title: 'js:'}))
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(dist.js))
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        .pipe(debug({title: 'css:'}))
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest(dist.css))
        .pipe(cssFilter.restore)
        .pipe(fontFilter)
        .pipe(debug({title: 'font:'}))
        .pipe(gulp.dest(dist.fonts));
});

gulp.task('js', function() {
    return gulp.src(jsSources)
        .pipe(concat('app.js'))
        .pipe(gulp.dest(dist.js));
});

gulp.task('css', function() {
    return gulp.src(cssSources)
        .pipe(concat('app.css'))
        .pipe(gulp.dest(dist.css));
});

gulp.task('index', function() {
    return gulp.src([source + 'index.html'])
        .pipe(gulp.dest(publishdir));
});

gulp.task('html', function() {
  return gulp.src(htmlSources)
        .pipe(templateCache('templates.js', { standalone: true }))
        .pipe(gulp.dest(dist.js));
});

gulp.task('other', ['index', 'html']);

gulp.task('default', ['bower', 'css', 'js', 'other']);

gulp.task('watch', ['default'], function() {
  gulp.watch(cssSources, ['css']);
  gulp.watch(jsSources, ['js']);
  gulp.watch(htmlSources, ['html']);
}); // development

gulp.task('ci', ['lint', 'bootlint']);
