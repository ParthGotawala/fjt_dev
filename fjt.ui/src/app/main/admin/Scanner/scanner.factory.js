(function () {
  'use strict';

  angular
    .module('app.admin.scanner')
    .factory('ScannerFactory', scanner);

  /** @ngInject */
  function scanner($resource, CORE) {
    return {
      retrieveScanner: () => $resource(CORE.API_URL + 'scanner/retrieveScanner', {
      }, {
        update: {
          method: 'PUT'
        }
      }),
      retrieveScannerList: () => $resource(CORE.API_URL + 'scanner/retrieveScannerList', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      saveScanner: () => $resource(CORE.API_URL + 'scanner/createScanner', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deleteScanner: () => $resource(CORE.API_URL + 'scanner/deleteScanner', {
        objDelete: '@_objDelete'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      checkipAddressAlreadyExists: () => $resource(CORE.API_URL + 'scanner/checkipAddressAlreadyExists',
        { objs: '@_objs' }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      checkMacAddressAlreadyExists: () => $resource(CORE.API_URL + 'scanner/checkMacAddressAlreadyExists',
        { objs: '@_objs' }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      })
    };
  }
})();
