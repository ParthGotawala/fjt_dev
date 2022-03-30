(function () {
    'use strict';

    angular
        .module('app.core')
        .service('dynamicMessageService', dynamicMessageService);

    /** @ngInject */
    function dynamicMessageService($http, CORE) {
        var service = {
            getAllModuleDynamicMessages: getAllModuleDynamicMessages
        }
        function getAllModuleDynamicMessages() {
            return $http.get(CORE.API_URL + "alldynamicmessage/getAllModuleDynamicMessages").
            then(function (response) {
                // console.log('2');
                return response.data;
            });
        }
        return service;
    }
})();
