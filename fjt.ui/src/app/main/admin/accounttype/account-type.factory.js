(function () {
  'use strict';

  angular
    .module('app.admin.accounttype')
    .factory('AccountTypeFactory', AccountTypeFactory);
  /** @ngInject */
  function AccountTypeFactory($resource, CORE) {
    return {
      getAccountTypeList: () => $resource(CORE.API_URL + 'acctclassmst/getAccountTypeList', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getAllAccountTypeList: () => $resource(CORE.API_URL + 'acctclassmst/getAllAccountTypeList', {
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      getAccountTypeBySearch: () => $resource(CORE.API_URL + 'acctclassmst/getAccountTypeBySearch', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getAccountTypeById: () => $resource(CORE.API_URL + 'acctclassmst/getAccountTypeById/:id', {
        id: '@_id'
      }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      saveAccountType: () => $resource(CORE.API_URL + 'acctclassmst/saveAccountType', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      deleteAccountType: () => $resource(CORE.API_URL + 'acctclassmst/deleteAccountType', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      checkDuplicateAccountTypeFormField: () => $resource(CORE.API_URL + 'acctclassmst/checkDuplicateAccountTypeFormField', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      })
    };
  }
})();
