'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var babel = require('gulp-babel'); // new added

var { script } = require('./scripts');
var { styles } = require('./styles');

var print = require('gulp-print').default;//purav added
var rename = require('gulp-rename');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

var browserSync = require('browser-sync');


module.exports = {

  Inject: () => {

    styles();
    script();

    gulp.task('inject', gulp.series('scripts', 'styles', function () {
      console.log("Working 1 ");
      var injectStyles = gulp.src([
        path.join(conf.paths.tmp, '/serve/app/index.css'),
        path.join('!' + conf.paths.tmp, '/serve/app/vendor.css')
      ], { read: false });
      var injectScripts = gulp.src([
        path.join(conf.paths.src, '/app/**/*.module.js'),
        path.join(conf.paths.src, '/app/**/*.js'),
        path.join('!' + conf.paths.src, '/app/**/*.spec.js'),
        path.join('!' + conf.paths.src, '/app/**/*.mock.js'),
      ])
        .pipe(babel({ compact: false, presets: ['es2015'] })) // new added
        .pipe($.angularFilesort()).on('error', conf.errorHandler('AngularFilesort'));

      var injectOptions = {
        ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
        addRootSlash: false
      };


      return gulp.src(path.join(conf.paths.src, '/*.html'))

        .pipe($.inject(injectStyles, injectOptions))
        .pipe($.inject(injectScripts, injectOptions))
        .pipe(wiredep(_.extend({}, conf.wiredep)))
        .pipe(rename(function (path) {
     console.log("after html restor org : ", path);

          path.dirname = path.dirname.replace(/src/, '');
         }))
        .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
    }));



    gulp.task('inject-reload', gulp.series('inject', function () {
      browserSync.reload();
    }));
  }


};
