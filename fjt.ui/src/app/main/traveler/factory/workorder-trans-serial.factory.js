(function () {
    'use strict';

    angular
        .module('app.traveler.travelers')
        .factory('WorkorderTransSerialFactory', WorkorderTransSerialFactoryFactory);

    /** @ngInject */
    function WorkorderTransSerialFactoryFactory($resource, CORE) {
        return {

            deleteWoTransSerialNo: (param) =>  $resource(CORE.API_URL + 'generateWorkorder_trans_serialNo/deleteWoTransSerialNo', {

            }, {
                query: {
                    isArray: false,
                },
            }),

            getTransPrevOpPassedSerials: () => $resource(CORE.API_URL + 'generateWorkorder_trans_serialNo/getTransPrevOpPassedSerials', {
                objWoTransCurrOp: '@_objWoTransCurrOp',
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
        }
    }

})();