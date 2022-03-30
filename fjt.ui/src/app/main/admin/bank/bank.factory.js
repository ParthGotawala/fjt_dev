(function () {
  'use strict';

  angular.module('app.admin.bank').factory('BankFactory', BankFactory);
  /** @ngInject */
  function BankFactory($resource, CORE) {
    return {
      retrieveBankList: () => $resource(CORE.API_URL + 'bank/retrieveBankList', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      checkBankUnique: () => $resource(CORE.API_URL + 'bank/checkBankUnique', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      saveBank: () => $resource(CORE.API_URL + 'bank/saveBank', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      deleteBank: () => $resource(CORE.API_URL + 'bank/deleteBank', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getBankByID: () => $resource(CORE.API_URL + 'bank/getBankByID/:id', {
        id: '@_id'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      getBankList: () => $resource(CORE.API_URL + 'bank/getBankList', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      })
    };
  }
})();
