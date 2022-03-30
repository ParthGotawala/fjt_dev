'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
//var changed = require('gulp-changed');
var print = require('gulp-print').default;//purav added
var rename = require("gulp-rename");//purav
var uglify = require('gulp-uglify-es').default; // new added
//var cache = require('gulp-cached');
//var remember = require('gulp-remember');

var {Inject} = require('./inject');


var sourcemaps = require('gulp-sourcemaps');
var ngAnnotate = require('gulp-ng-annotate');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});


module.exports={
build:()=>{

  Inject();
  gulp.task('partials', function () {
    return gulp.src([
      path.join(conf.paths.src, '/app/**/*.html'),
      //path.join('!' + conf.paths.src, '/app/main/components/material-docs/demo-partials/**/*.html'), // old code commented
      //path.join('!' + conf.paths.src, '/app/view/*.html'), // new added
      path.join(conf.paths.tmp, '/serve/app/**/*.html') 


    ])
  //  .pipe(print(filepath => `tobehtml min: ${filepath}`)) //purav added

      .pipe($.htmlmin({
        collapseWhitespace: true,
        maxLineLength: 120,
        removeComments: true,
      }))
     // .pipe(print(filepath => `html min: ${filepath}`)) //purav added
     .pipe(rename(function (path) {
      // Updates the object in-place
      // path.dirname += "/ciao";
      // path.basename += "-goodbye";
      // path.extname = ".md";
    // console.log("file : ",path);
    }))
      .pipe($.angularTemplatecache('templateCacheHtml.js', {
        module: 'fuse',
       // root: 'app'
     //  base:'../',
       transformUrl: function(url) {
        return url.replace(/^\\src\\/, '')
    }
      }))
    //  .pipe(print(filepath => `partials: ${filepath}`)) //purav added

      .pipe(gulp.dest(conf.paths.tmp + '/partials/'));
  });
  
  gulp.task('html', gulp.series('inject', 'partials', function () {

    var partialsInjectFile = gulp.src(path.join(conf.paths.tmp, '/partials/templateCacheHtml.js'), { read: false });
    var partialsInjectOptions = {
      starttag: '<!-- inject:partials -->',
      ignorePath: path.join(conf.paths.tmp, '/partials'),
      addRootSlash: false
    };
  
    var cssFilter = $.filter('**/*.css', { restore: true });
    var jsFilter = $.filter('**/*.js', { restore: true });
    var htmlFilter = $.filter('*.html', { restore: true });
  
    console.log('inside html',conf.paths.tmp);

    return gulp.src(path.join(conf.paths.tmp, '/serve/**/*.html'))

    // .pipe(print(filepath => `org : ${path.join(conf.paths.tmp, '/serve/*.html')} 
    // setup : ${path.join(conf.paths.tmp, '/serve/**/index.html')}
    // `)) //purav added

      .pipe($.inject(partialsInjectFile, partialsInjectOptions))
      .pipe($.useref())
      .pipe(jsFilter)
      .pipe($.sourcemaps.init())
         .on('error', function (err) {
        console.log(err.toString());
        this.emit('end');
    })
    //.pipe(sourcemaps.write('./'))

      .pipe(ngAnnotate())
  
    //   .on('error', function (err) {
    //     console.log(err.toString(),'-x-');
    //     this.emit('end');
    // })
  
     // .pipe(print(filepath => `built: ${filepath}`)) //purav added
      .pipe(uglify().on('error', conf.errorHandler('Uglify'))) // new added
    //  .pipe(print(filepath => `after-uglify: ${filepath}`)) //purav added
  
      
      //})) // new added
      //.pipe($.uglify({preserveComments: $.uglifySaveLicense})).on('error', conf.errorHandler('Uglify')) // old code commented
      .pipe($.rev())
    //  .pipe(print(filepath => `rev: ${filepath}`)) //purav added
  
      .pipe(sourcemaps.write('maps'))
     // .pipe(print(filepath => `Js sourcemaps: ${filepath}`)) //purav added
      .pipe(jsFilter.restore)
      .pipe(cssFilter)
      .pipe(sourcemaps.init())
      .pipe($.cleanCss())
      .pipe($.rev())
      .pipe(sourcemaps.write('maps'))
     // .pipe(print(filepath => `Css sourcemaps: ${filepath}`)) //purav added
  
      .pipe(cssFilter.restore)
      .pipe($.revReplace())
     // .pipe(print(filepath => `revReplace: ${filepath}`)) //purav added
  
      .pipe($.replace('../bower_components/mdi/fonts', '../fonts')) // new added
      .pipe($.replace('../bower_components/intl-tel-input/build/img', '../img')) // new added
      .pipe(htmlFilter)
      .pipe($.htmlmin({
        collapseWhitespace: true,
        maxLineLength: 120,
        removeComments: true
      }))
      .pipe(htmlFilter.restore)
     // .pipe(print(filepath => `htmlrestore: ${filepath}`)) //purav added
      .pipe(rename(function (path) {
        // Updates the object in-place
        console.log("after html restor org : ",path);
       // console.log("file : ",path);

        path.dirname=path.dirname.replace(/^.tmp\\serve/,'');
        // path.basename += "-goodbye";
        // path.extname = ".md";
        console.log("new file : ",path);

      }))
      .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
     // .pipe(print(filepath => `dest-: ${filepath}`)) //purav added
  
      .pipe($.size({
        title: path.join(conf.paths.dist, '/'),
        showFiles: true
      }));

      
  }));
  
  // Only applies for fonts from bower dependencies
  // Custom fonts are handled by the "other" task
  gulp.task('fonts', function () {
    console.log("in Fonts");
    return gulp.src($.mainBowerFiles())
      .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
      .pipe($.flatten())
  
      .pipe(gulp.dest(path.join(conf.paths.dist, '/fonts/')));
  });
  
  gulp.task('other', function () {
    var fileFilter = $.filter(function (file) {
      return file.stat.isFile();
    });
  
    return gulp.src([
      path.join(conf.paths.src, '/**/*'),
      path.join('!' + conf.paths.src, '/**/*.{html,css,js,scss}'),            //path.join('!' + conf.paths.src, '/**/*.{html,css,js,scss}'),// old code commented
      //path.join('!' + conf.paths.src, '/**/*.{html,css,js,scss}'),// new added
    ])
      .pipe(fileFilter)
        .pipe(rename(function (path) {
         path.dirname = path.dirname.replace(/src\\|src/, '');
        }))
      .pipe(gulp.dest(path.join(conf.paths.dist)))

      
  });
  // new added
  gulp.task('copy-ui-grid-fonts', function () {
    return gulp.src(path.join(conf.paths.src, 'assets/angular-ui-grid/*.{eot,svg,ttf,woff}'))
    
      .pipe(gulp.dest(path.join(conf.paths.dist, '/styles/fonts/')))
      //.pipe(print(filepath => `dest-font: ${filepath}`));
  });
  // new added
  gulp.task('copy-intl-net-input-img', function () {
    return gulp.src(path.join(conf.paths.src, '../bower_components/intl-tel-input/build/img/*.*'))
      .pipe(gulp.dest(path.join(conf.paths.dist, '/img/')));
  });

  // new added to copy image for tree view lines
    gulp.task('copy-tree-view-image', function () {
      return gulp.src(path.join(conf.paths.src, 'app/*.png'))
        .pipe($.flatten())
        .pipe(gulp.dest(path.join(conf.paths.dist, '/styles/')))
    });
  // Removed old code
  //// Move demo-partials directory for material-docs
  //gulp.task('material-docs', function ()
  //{
  //    var fileFilter = $.filter(function (file)
  //    {
  //        return file.stat.isFile();
  //    });
  
  //    return gulp.src([
  //            path.join(conf.paths.src, '/app/main/components/material-docs/demo-partials/**/*')
  //        ])
  //        .pipe(fileFilter)
  //        .pipe(gulp.dest(path.join(conf.paths.dist, '/app/main/components/material-docs/demo-partials/')));
  //});
  
  //// New Added for popup files
  //// Move popup files for issue resolves
  //gulp.task('popup-files', function ()
  //{
  //    var fileFilter = $.filter(function (file)
  //    {
  //        return file.stat.isFile();
  //    });
  
  //    return gulp.src([
  //            path.join(conf.paths.src, '/app/view/*.html')
  //        ])
  //        .pipe(fileFilter)
  //        .pipe(gulp.dest(path.join(conf.paths.dist, '/app/view/')));
  //});
  
  gulp.task('clean', function () {
    return $.del([path.join(conf.paths.dist, '/'), path.join(conf.paths.tmp, '/')]);
  });
  
  gulp.task('clean-map', function () {
    return $.del([path.join(conf.paths.dist, '/maps'),path.join(conf.paths.dist, '/.tmp')]);
  });

  gulp.task('build', gulp.series( 'clean','html', 'fonts', 'other', 'copy-ui-grid-fonts', 'copy-intl-net-input-img','copy-tree-view-image','clean-map',function(done){
    
    done();
  } )); //'clean'
  //gulp.task('build', ['html', 'fonts', 'other', 'material-docs']);// old code commented
  //gulp.task('build', ['clean', 'html', 'fonts', 'other','copy-ui-grid-fonts','popup-files']); // new added
  

}

}

