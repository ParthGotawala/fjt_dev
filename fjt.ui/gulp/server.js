'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');

var util = require('util');

var proxyMiddleware = require('http-proxy-middleware');
var { watch } = require('./watch');
var { build } = require('./build');


module.exports = {
    server: () => {

        watch();
        build();
        function browserSyncInit(baseDir, browser) {
            browser = browser === undefined ? 'default' : browser;

            var routes = null;
            if (baseDir === conf.paths.src || (util.isArray(baseDir) && baseDir.indexOf(conf.paths.src) !== -1)) {
                routes = {
                    '/bower_components': 'bower_components'
                };
            }

            var server = {
                baseDir: baseDir,
                routes: routes
            };

            /*
             * You can add a proxy to your backend by uncommenting the line below.
             * You just have to configure a context which will we redirected and the target url.
             * Example: $http.get('/users') requests will be automatically proxified.
             *
             * For more details and option, https://github.com/chimurai/http-proxy-middleware/blob/v0.9.0/README.md
             */
            // server.middleware = proxyMiddleware('/users', {target: 'http://jsonplaceholder.typicode.com', changeOrigin: true});

            browserSync.instance = browserSync.init({
                startPath: '/',
                server: server,
                browser: browser,
                ghostMode: false, // new added
                https: true//added to enable hosting on https
                // port: 9999 // 3000 to change ui project port
            });
        }

        browserSync.use(browserSyncSpa({
            selector: '[ng-app]'// Only needed for angular apps
        }));

        gulp.task('serve', gulp.series('watch', function (done) {
            browserSyncInit([path.join(conf.paths.tmp, '/serve'), conf.paths.src]);
            done();
        }));

        gulp.task('serve:dist', gulp.series('build', function () {
            browserSyncInit([conf.paths.dist, conf.paths.src]);
        }));

        gulp.task('serve:e2e', gulp.series('inject', function () {
            browserSyncInit([conf.paths.tmp + '/serve/src', conf.paths.src], []);
        }));

        gulp.task('serve:e2e-dist', gulp.series('build', function () {
            browserSyncInit(conf.paths.dist, []);
        }));

    }
}

