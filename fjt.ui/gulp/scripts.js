'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
// var print = require('gulp-print').default;//purav added



var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

module.exports={

    script:()=>{
        gulp.task('scripts-reload', function ()
{
    return buildScripts()
        .pipe(browserSync.stream());
});

gulp.task('scripts', function ()
{
    return buildScripts();
});

function buildScripts()
{
  return gulp.src(path.join(conf.paths.src, '/app/**/*.js'))

        // Enable the following two lines if you want linter
        // to check your code every time the scripts reloaded
        //.pipe($.eslint())
        //.pipe($.eslint.format())        
        .pipe($.size())


};

    }

}


