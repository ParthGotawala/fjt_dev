(function () {
  'use strict';

  angular
    .module('app.workorder')
    .factory('WorkorderSerialMstFactory', WorkorderSerialMstFactory);

  /** @ngInject */
  function WorkorderSerialMstFactory($resource, CORE) {
    return {
      workorder_serialmst: () => $resource(CORE.API_URL + 'workorder_serialmst/:woID/:serialType', {
      }, {
      }),
      retriveWorkorderSerialsList: () => $resource(CORE.API_URL + 'workorder_serialmst/retriveWorkorderSerialsList', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),

      getAllWorkorderSerialsByWoID: () => $resource(CORE.API_URL + 'workorder_serialmst/getAllWorkorderSerialsByWoID/:woID', {
        woID: '@_woID'
      }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),

      getSerialNumberDetailsByTransID: () => $resource(CORE.API_URL + 'workorder_serialmst/getSerialNumberDetailsByTransID', {
        operationObj: '@_operationObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      getWorkorderSerialsForFinalProduct: () => $resource(CORE.API_URL + 'workorder_serialmst/getWorkorderSerialsForFinalProduct/:woID', {
        woID: '@_woID'
      }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      retrieveAllMappedFinalProductSerialsList: () => $resource(CORE.API_URL + 'workorder_serialmst/mapProdSerial/retrieveAllMappedFinalProductSerialsList', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      checkMFGSerialValid: () => $resource(CORE.API_URL + 'workorder_serialmst/mapProdSerial/checkMFGSerialValid', {
        mfgSerialInfo: '@_mfgSerialInfo'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      checkProductSerialValid: () => $resource(CORE.API_URL + 'workorder_serialmst/mapProdSerial/checkProductSerialValid', {
        productSerialInfo: '@_productSerialInfo'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      saveProductSerialMapping: () => $resource(CORE.API_URL + 'workorder_serialmst/mapProdSerial/saveProductSerialMapping', {
        productSerialMappingInfo: '@_productSerialMappingInfo'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deleteProductSerialMapping: () => $resource(CORE.API_URL + 'workorder_serialmst/mapProdSerial/deleteProductSerialMapping', {
        deleteObj: '@_deleteObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getValidateSerialNumberDetails: () => $resource(CORE.API_URL + 'workorder_serialmst/getValidateSerialNumberDetails/:woID/:serialNo', {
        woID: '@_woID',
        serialNo: '@_serialNo'
      }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      getValidateSerialNumberDetailsList: () => $resource(CORE.API_URL + 'workorder_serialmst/getValidateSerialNumberDetailsList', {
      }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      getSerialNumberTransHistory: () => $resource(CORE.API_URL + 'workorder_serialmst/getSerialNumberTransHistory', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      checkMFGScanSerialValidForFirstArticle: () => $resource(CORE.API_URL + 'workorder_serialmst/checkMFGScanSerialValidForFirstArticle', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      })
    };
  }
})();
