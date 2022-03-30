(function () {
    'use strict';

    angular
        .module('app.rfqtransaction')
        .factory('ImportCustomerAVLPopupFactory', ImportCustomerAVLPopupFactory);

    /** @ngInject */
    function ImportCustomerAVLPopupFactory($resource,$http, CORE) {
        return {
            downloadAVLTemplate: (fileType) => $http.get(CORE.API_URL + "rfqlineitems/downloadAVLTemplate/" + fileType, { responseType: 'arraybuffer' })
                .then((response) => {
                    return response;
                }, (error) => {
                    return error;
                }),
        }

    }
})();