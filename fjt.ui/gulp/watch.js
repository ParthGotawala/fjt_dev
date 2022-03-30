'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');
var { Inject } = require('./inject');
var print = require('gulp-print').default;//purav added
var { styles, buildStyles } = require('./styles');


module.exports = {
  watch: () => {
    Inject();

    function isOnlyChange(event) {
      return event.type === 'changed';
    }

    gulp.task('watch', gulp.series('inject', function (done) {
      gulp.watch([`${conf.paths.src}/*.html`, 'bower.json'], gulp.series('inject-reload'));

      gulp.watch([
        `${conf.paths.src}/app/**/*.css`,
        `${conf.paths.src}/app/*.scss`,
        `${conf.paths.src}/app/**/*.scss`

      ], function (event) {
        console.log('css changed');

        if (isOnlyChange(event)) {
          console.log('styles-reload');
          gulp.series('styles-reload');
        }
        else {
          console.log('inject-reload');
          buildStyles();
        }
        browserSync.reload(event.path);
        event();
      });

      gulp.watch([`${conf.paths.src}/app/**/*.js`], function (event) {
        console.log('js changed');

        if (isOnlyChange(event)) {
          gulp.series('scripts-reload');
        }
        else {
          gulp.series('inject-reload');
        }
        event();
      });

      gulp.watch([
        `${conf.paths.src}/app/**/*.json`,
        `${conf.paths.src}/app/**/*.html`

      ], function (event) {
        console.log('html changed');

        browserSync.reload(event.path);
        event();
      });
      done();
    }));
  }
};
