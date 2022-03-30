(function () {
    'use strict';

    angular
        .module('app.workorder')
        .factory('WorkorderOperationRevisionPopupFactory', WorkorderOperationRevisionPopupFactory);

    /** @ngInject */
    function WorkorderOperationRevisionPopupFactory($resource, CORE) {
        return {
            getWOOPDetails: (param) =>  $resource(CORE.API_URL + 'workorderoperation/getWOOPDetails/:woOPID', {
                woOPID: '@_woOPID'                
            }, {
                query: {
                    isArray: false,
                    method: 'GET'
                }
            }),
            saveWOOPVersion: (param) =>  $resource(CORE.API_URL + 'workorderoperation/saveWOOPVersion', {                
            }, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
        }
    }

})();