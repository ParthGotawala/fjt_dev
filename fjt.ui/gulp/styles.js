'use strict';


module.exports = {

  buildStyles: () => {

    var path = require('path');
    var gulp = require('gulp');
    var conf = require('./conf');
    var sass = require('gulp-sass');

    var browserSync = require('browser-sync');

    var $ = require('gulp-load-plugins')();
    var rename = require('gulp-rename');
    var print = require('gulp-print').default;//purav added

    var wiredep = require('wiredep').stream;
    var _ = require('lodash');

    var sassOptions = {
      style: 'expanded'
    };

    var injectFiles = gulp.src([
      path.join(conf.paths.src, '/app/core/scss/**/*.scss'),
      path.join(conf.paths.src, '/app/core/**/*.scss'),
      path.join(conf.paths.src, '/app/**/*.scss'),
      path.join(conf.paths.src, '/app/main/**/**/*.scss'), // new added
      path.join('!' + conf.paths.src, '/app/main/components/material-docs/demo-partials/**/*.scss'),
      path.join('!' + conf.paths.src, '/app/core/scss/partials/**/*.scss'),
      path.join('!' + conf.paths.src, '/app/index.scss')
    ], { read: false });

    var injectOptions = {
      transform: function (filePath) {
        filePath = filePath.replace(conf.paths.src + '/app/', '');
        return '@import "' + filePath + '";';
      },
      starttag: '// injector',
      endtag: '// endinjector',
      addRootSlash: false
    };

    return gulp.src([
      path.join(conf.paths.src, '/app/index.scss')
    ])
      .pipe($.inject(injectFiles, injectOptions))
      .pipe(wiredep(_.extend({}, conf.wiredep)))
      .pipe($.sourcemaps.init())
      .pipe($.sass(sassOptions)).on('error', conf.errorHandler('Sass'))
      .pipe($.autoprefixer()).on('error', conf.errorHandler('Autoprefixer'))
      .pipe($.sourcemaps.write())
      .pipe(rename(function (path) {
        path.dirname = path.dirname.replace(/src\\/, '');
      }))
      .pipe(gulp.dest(path.join(conf.paths.tmp, 'serve/')));
  },

  styles: () => {


    var path = require('path');
    var gulp = require('gulp');
    var conf = require('./conf');
    var sass = require('gulp-sass');

    var browserSync = require('browser-sync');

    var $ = require('gulp-load-plugins')();
    var rename = require('gulp-rename');
    var print = require('gulp-print').default;//purav added

    var wiredep = require('wiredep').stream;
    var _ = require('lodash');

    gulp.task('styles', function () {
      return buildStyles();
    });

    var buildStyles = function () {
      var sassOptions = {
        style: 'expanded'
      };

      var injectFiles = gulp.src([
        path.join(conf.paths.src, '/app/core/scss/**/*.scss'),
        path.join(conf.paths.src, '/app/core/**/*.scss'),
        path.join(conf.paths.src, '/app/**/*.scss'),
        path.join(conf.paths.src, '/app/main/**/**/*.scss'), // new added
        path.join('!' + conf.paths.src, '/app/main/components/material-docs/demo-partials/**/*.scss'),
        path.join('!' + conf.paths.src, '/app/core/scss/partials/**/*.scss'),
        path.join('!' + conf.paths.src, '/app/index.scss')
      ], { read: false });

      var injectOptions = {
        transform: function (filePath) {
          filePath = filePath.replace(conf.paths.src + '/app/', '');
          return '@import "' + filePath + '";';
        },
        starttag: '// injector',
        endtag: '// endinjector',
        addRootSlash: false
      };

      return gulp.src([
        path.join(conf.paths.src, '/app/index.scss')
      ])
        .pipe($.inject(injectFiles, injectOptions))
        .pipe(wiredep(_.extend({}, conf.wiredep)))
        .pipe($.sourcemaps.init())
        .pipe($.sass(sassOptions)).on('error', conf.errorHandler('Sass'))
        .pipe($.autoprefixer()).on('error', conf.errorHandler('Autoprefixer'))
        .pipe($.sourcemaps.write())
        .pipe(rename(function (path) {
          path.dirname = path.dirname.replace(/src\\/, '');
        }))
        .pipe(gulp.dest(path.join(conf.paths.tmp, 'serve/')));
    };

    gulp.task('styles-reload', gulp.series('styles', function () {
      return buildStyles()
        .pipe(browserSync.stream());
    }));
  }


};

