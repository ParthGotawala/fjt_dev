(function () {
    'use strict';

    angular
        .module('app.rfqtransaction')
        .factory('CopyBOMPopupFactory', CopyBOMPopupFactory);

    /** @ngInject */
    function CopyBOMPopupFactory($resource, CORE) {
        return {
            copyAssyBOM: (param) =>  $resource(CORE.API_URL + 'rfqlineitems/copyAssyBOM', {
            }, {
                query: {
                    isArray: false,
                    params: param,
                    method: 'POST'
                }
            }),
        }

    }
})();