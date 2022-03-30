(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('PathService', ['$window', '$location', PathService]);

    /** @ngInject */
    function PathService($window, $location) {
        return {
            basePath: (value) => new $window.URL($location.absUrl(value.fileName)).origin,
        };
    }

})();