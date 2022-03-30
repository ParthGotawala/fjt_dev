(function () {
  'use strict';

  angular
    .module('app.workorder')
    .factory('WorkorderSalesOrderDetailsFactory', WorkorderSalesOrderDetailsFactory);
  /** @ngInject */
  function WorkorderSalesOrderDetailsFactory($resource, CORE) {
    return {
      getSalesOrderWoIDwise: () => $resource(CORE.API_URL + 'workorder_salesorder_details/getSalesOrderWoIDwise/:woID', {
        woID: '@_woID'
      }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      saveWoSalesOrder: () => $resource(CORE.API_URL + 'workorder_salesorder_details/saveWoSalesOrder', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      updateWoSalesOrder: () => $resource(CORE.API_URL + 'workorder_salesorder_details/updateWoSalesOrder/:woSalesOrderDetID', {
        woSalesOrderDetID: '@_woSalesOrderDetID'
      }, {
        update: {
          method: 'PUT'
        }
      }),
      WoSalesOrder: () => $resource(CORE.API_URL + 'workorder_salesorder_details/:woSalesOrderDetID', {
        woSalesOrderDetID: '@_woSalesOrderDetID'
      }, {
        update: {
          method: 'PUT'
        },
        delete: {
          method: 'POST'
        }
      }),
      deleteWoSalesOrderAssyRevisionWise: () => $resource(CORE.API_URL + 'workorder_salesorder_details/deleteWoSalesOrderAssyRevisionWise/:woID', {
        woID: '@_woID'
      }, {
        update: {
          method: 'PUT'
        }
      }),
      checkKitReleaseBySalesOrderDetID: () => $resource(CORE.API_URL + 'workorder_salesorder_details/checkKitReleaseBySalesOrderDetID/:woID/:salesOrderDetID', {
        woID: '@_woID',
        salesOrderDetID: '@_salesOrderDetID'
      }, {
        query: {
          method: 'GET',
          isArray: false
        }
      })
    };
  }
})();
