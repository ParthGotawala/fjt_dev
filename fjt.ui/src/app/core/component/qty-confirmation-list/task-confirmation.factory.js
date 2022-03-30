(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('TaskConfirmationFactory', TaskConfirmationFactory);

    /** @ngInject */
    function TaskConfirmationFactory($resource, CORE) {
        return {
            getTaskConfirmationlist: (param) =>  $resource(CORE.API_URL + 'taskconfirmation/getTaskConfirmationlist', {
                
            }, {
                query: {
                    isArray: false,
                    params: {
                        confirmationType: param.confirmationType,
                        refTablename: param.refTablename,
                        refId: param.refId
                    }
                }
            })
        }
    }
})();