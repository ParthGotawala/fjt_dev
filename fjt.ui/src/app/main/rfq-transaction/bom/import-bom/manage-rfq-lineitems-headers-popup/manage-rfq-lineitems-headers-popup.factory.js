(function () {
    'use strict';

    angular
        .module('app.rfqtransaction')
        .factory('ManageRFQLineitemsHeadersPopupFactory', ManageRFQLineitemsHeadersPopupFactory);

    /** @ngInject */
    function ManageRFQLineitemsHeadersPopupFactory($resource, CORE) {
        return {
            getRFQLineItemsHeaders: (param) => $resource(CORE.API_URL + 'rfqlineitemsheaders/getRfqLineitemsHeaders', {
            }, {
                query: {
                    isArray: false,
                    method: 'GET'
                }
            }),
            saveDisplayOrder: () => $resource(CORE.API_URL + 'rfqlineitemsheaders/saveDisplayOrder',
               {
                     query: {
                     isArray: true,
                     method: 'POST'
             }
         }),
      }
    }
})();