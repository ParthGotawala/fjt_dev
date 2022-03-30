(function () {
  'use strict';

  angular
    .module('app.admin.transactionmodes')
    .factory('TransactionModesFactory', TransactionModesFactory);

  /** @ngInject */
  function TransactionModesFactory($resource, CORE) {
    return {
      retrieveTransactionModesList: () => $resource(CORE.API_URL + 'transactionModes/retrieveTransactionModesList', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      saveTransactionMode: () => $resource(CORE.API_URL + 'transactionModes/saveTransactionMode', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      checkTransactionModeUnique: () => $resource(CORE.API_URL + 'transactionModes/checkTransactionModeUnique', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getTransactionModeByID: () => $resource(CORE.API_URL + 'transactionModes/getTransactionModeByID/:id', {
        id: '@_id'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      getTransModeList: () => $resource(CORE.API_URL + 'transactionModes/getTransModeList', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deleteTransactionModes: () => $resource(CORE.API_URL + 'transactionModes/deleteTransactionModes', {
        listObj: '@_listObj'
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      })
    };
  }
})();
