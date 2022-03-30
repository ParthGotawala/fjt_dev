/**
 *  Welcome to your gulpfile!
 *  The gulp tasks are splitted in several files in the gulp directory
 *  because putting all here was really too long
 */

'use strict';

var gulp = require('gulp');
var fse = require('fs-extra');
var {build} = require('./gulp/build');
 var {server} = require('./gulp/server');
// var {watch} = require('./gulp/watch');
// var {script} = require('./gulp/scripts');
// var {unitTest} = require('./gulp/unit-tests');

// var {server} = require('./gulp/server');


//var {e2e} = require('./gulp/e2e-tests');

//var { src, dest, series, parallel } = require('gulp');


/**
 *  This will load all js or coffee files in the gulp directory
 *  in order to load all gulp tasks
 */


/*wrench.readdirSyncRecursive('./gulp').filter(function(file) {
 return (/\.(js|coffee)$/i).test(file);
 }).map(function(file) {
 require('./gulp/' + file);
 });*/


/**
 *  Default task clean temporaries directories and launch the
 *  main optimization build task
 */
//, ['clean']

// gulp.task('default',gulp.series() function ()
// {
//     gulp.parallel('build');
// });

// server();
// script();
// unitTest();

// e2e();
// Inject();
// watch();

build();
server();


fse.walkSync('./gulp').filter(function (file)
    {
        return (/\.(js|coffee)$/i).test(file);
    }
).map(function (file)
    {
        //console.log('=>',file);
        require('./' + file);
    }
);


gulp.task('default', gulp.series( 'clean','build',function(done) { 
    //gulp.start('build');
    done();

}));
