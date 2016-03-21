'use strict';

var gulp = require('gulp');

// Import dependencies
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var bootlint = require('gulp-bootlint');
var templateCache = require('gulp-angular-templatecache');
var replace = require('gulp-replace');
var debug = require('gulp-debug');

var source = 'app/';
var depSource = 'node_modules/';

var jsSources = [source + 'app.module.js',
                 source + 'app.config.js',
                 source + '**/*.js',
                 '!' + source + '**/*.spec.js',
                 '!' + source + '**/*.e2e.js',
                 '!' + source + '**/*.mock.js'];

var jsDeps = [depSource + 'jquery/dist/jquery.min.js',
              depSource + 'angular/angular.min.js',
              depSource + 'angular-route/angular-route.min.js',
              depSource + 'bootstrap/dist/js/bootstrap.min.js',
              depSource + 'd3/d3.min.js',
              depSource + 'nvd3/build/nv.d3.min.js',
              depSource + 'angular-nvd3/dist/angular-nvd3.min.js',
              depSource + 'firebase/lib/firebase-web.js',
              depSource + 'angularfire/dist/angularfire.min.js'];

var cssSources = [source + '**/*.css'];

var cssDeps = [depSource + 'bootstrap/dist/css/bootstrap.min.css',
               depSource + 'nvd3/build/nv.d3.min.css'];

var fontDeps = [depSource + 'bootstrap/dist/fonts/glyphicons*'];

var htmlSources = [source + '**/*.html',
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

gulp.task('bower:js', function() {
    return gulp.src(jsDeps)
            .pipe(debug({title: 'js:'}))
            .pipe(concat('vendor.js'))
            .pipe(replace('module.exports = Firebase;', ''))
            .pipe(gulp.dest(dist.js));
});

gulp.task('bower:css', function() {
    return gulp.src(cssDeps)
            .pipe(debug({title: 'css:'}))
            .pipe(concat('vendor.css'))
            .pipe(gulp.dest(dist.css));
});

gulp.task('bower:font', function() {
    return gulp.src(fontDeps)
            .pipe(debug({title: 'font:'}))
            .pipe(gulp.dest(dist.fonts));
});


gulp.task('bower', ['bower:js', 'bower:css', 'bower:font']);

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
