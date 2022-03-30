(function () {
    'use strict';

    angular
        .module('app.workorder')
        .factory('WorkorderRevisionPopupFactory', WorkorderRevisionPopupFactory);

    /** @ngInject */
    function WorkorderRevisionPopupFactory($resource, CORE) {
        return {
            getWODetails: (param) =>  $resource(CORE.API_URL + 'workorders/getWODetails/:woID', {
                woID: '@_woID'
            }, {
                query: {
                    isArray: false,
                    method: 'GET'
                }
            }),
            saveWOVersion: (param) =>  $resource(CORE.API_URL + 'workorders/saveWOVersion', {
            }, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
        }
    }

})();