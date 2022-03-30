(function () {
  'use strict';

  angular
    .module('app.admin.chartofaccounts')
    .factory('ChartOfAccountsFactory', ChartOfAccountsFactory);
  /** @ngInject */
  function ChartOfAccountsFactory($resource, CORE) {
    return {
      getChartOfAccountsList: () => $resource(CORE.API_URL + 'acctacctmst/getChartOfAccountsList', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getChartOfAccountBySearch: () => $resource(CORE.API_URL + 'acctacctmst/getChartOfAccountBySearch', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getChartOfAccountById: () => $resource(CORE.API_URL + 'acctacctmst/getChartOfAccountById/:id', {
        id: '@_id'
      }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      saveChartOfAccount: () => $resource(CORE.API_URL + 'acctacctmst/saveChartOfAccount', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      deleteChartOfAccount: () => $resource(CORE.API_URL + 'acctacctmst/deleteChartOfAccount', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      checkDuplicateChartOfAccountFormField: () => $resource(CORE.API_URL + 'acctacctmst/checkDuplicateChartOfAccountFormField', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      })
    };
  }
})();
