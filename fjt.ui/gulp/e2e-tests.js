'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();



module.exports={

    e2e:()=>{


gulp.task('webdriver-standalone', $.protractor.webdriver_standalone);

function runProtractor()
{
    var params = process.argv;
    var args = params.length > 3 ? [params[3], params[4]] : [];

    gulp.src(path.join(conf.paths.e2e, '/**/*.js'))
        .pipe($.protractor.protractor({
            configFile: 'protractor.conf.js',
            args      : args
        }))
        .on('error', function (err)
        {
            // Make sure failed tests cause gulp to exit non-zero
            throw err;
        })
        .on('end', function ()
        {
            // Close browser sync server
            browserSync.exit();
        });
}

gulp.task('webdriver-update', $.protractor.webdriver_update);

gulp.task('protractor:src', gulp.series('serve:e2e', 'webdriver-update', runProtractor));

gulp.task('protractor:dist', gulp.series('serve:e2e-dist', 'webdriver-update', runProtractor));

    }

}
// Downloads the selenium webdriver
