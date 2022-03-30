(function () {
    'use strict';

    angular
        .module('app.rfqtransaction')
        .factory('CustomerConfirmationPopupFactory', CustomerConfirmationPopupFactory);

    /** @ngInject */
    function CustomerConfirmationPopupFactory($resource, CORE) {
        return {
            getRFQLineItemsDescription: (param) => $resource(CORE.API_URL + 'rfqlineitemsadditionalcomment/getRfqLineitemsdescription/:id', {
                id: "@_id"
            }, {
                query: {
                    isArray: false,
                    method: 'GET'
                }
            }),

            createRFQLineItemsDescription: (param) =>  $resource(CORE.API_URL + 'rfqlineitemsadditionalcomment/createRFQLineItemsDescription/', {},
         {
             query: {
                 isArray: false,
                 method: 'POST',
             },
         }),

            getRfqLineItemsCopyDescription: (param) =>  $resource(CORE.API_URL + 'rfqlineitemsadditionalcomment/getRfqLineItemsCopyDescription/', {},
       {
           query: {
               isArray: false,
               method: 'POST',
           },
       }),

            getRfqAdditionalColumnList: (param) => $resource(CORE.API_URL + 'rfqbomheadercomponentconfiguration/getRfqAdditionalColumnList/:id', {
                id: "@_id"
            }, {
                query: {
                    isArray: false,
                    method: 'GET'
                }
            }),

            saveRfqAdditionalColumnList: (param) =>  $resource(CORE.API_URL + 'rfqbomheadercomponentconfiguration/saveRfqAdditionalColumnList/', {},
         {
             query: {
                 isArray: false,
                 method: 'POST',
             },
         }),

        }

    }
})();