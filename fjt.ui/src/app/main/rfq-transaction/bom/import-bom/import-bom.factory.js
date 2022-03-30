(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .factory('ImportBOMFactory', ImportBOMFactory);

  /** @ngInject */
  function ImportBOMFactory($resource, $http, CORE) {
    return {
      saveRFQLineItems: (param) => $resource(CORE.API_URL + 'rfqlineitems/saveRFQLineItems', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      draftRFQLineItems: (param) => $resource(CORE.API_URL + 'rfqlineitems/draftRFQLineItems', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      deleteRFQAssyDetails: (param) => $resource(CORE.API_URL + 'rfqlineitems/deleteRFQAssyDetails', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      validateMFGDistData: (param) => $resource(CORE.API_URL + 'rfqlineitems/validateMFGDistData', {
      }, {
        query: {
          isArray: true,
          method: 'POST'
        }
      }),
      getMFGPNFromDistPN: (param) => $resource(CORE.API_URL + 'rfqlineitems/getMFGPNFromDistPN', {
      }, {
        query: {
          isArray: true,
          method: 'POST'
        }
      }),
      getRfqLineitemsHeaders: (param) => $resource(CORE.API_URL + 'rfqlineitemsheaders/getRfqLineitemsHeaders', {
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      getComponentVerification: (param) => $resource(CORE.API_URL + 'pricingapi/getComponentVerification', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      digikeyAccessToken: (param) => $resource(CORE.API_URL + 'pricingapi/digikeyAccessToken', {
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      getErrorCode: (param) => $resource(CORE.API_URL + 'rfqlineitemerrorcode/getErrorCode', {
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      componentVerification: (param) => $resource(CORE.API_URL + 'rfqlineitems/componentVerification', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      clearAPIVerificationErrors: (param) => $resource(CORE.API_URL + 'rfqlineitems/clearAPIVerificationErrors/:partID', {
        partID: '@_partID'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      checkObsoleteParts: (param) => $resource(CORE.API_URL + 'rfqlineitems/checkObsoleteParts', {
      }, {
        query: {
          isArray: true,
          method: 'POST'
        }
      }),
      getApiVerifiedAlternatePartsCount: (param) => $resource(CORE.API_URL + 'rfqlineitems/getApiVerifiedAlternatePartsCount/:partID', {
        partID: '@_partID'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      cancelAPIVerification: (param) => $resource(CORE.API_URL + 'rfqlineitems/cancelAPIVerification/:partID', {
        partID: '@_partID'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      downloadBOMTemplate: () => $http.get(CORE.API_URL + "rfqlineitems/downloadBOMTemplate", { responseType: 'arraybuffer' })
        .then((response) => {
          return response;
        }, (error) => {
          return error;
        }),

      saveFilterDisplayOrder: () => $resource(CORE.API_URL + 'rfqLineItemFilter/saveFilterDisplayOrder',
        {
          query: {
            isArray: true,
            method: 'POST'
          }
        }),
      checkCPNExistInOtherBOM: (param) => $resource(CORE.API_URL + 'rfqlineitems/checkCPNExistInOtherBOM', {
      }, {
        query: {
          isArray: true,
          method: 'POST'
        }
      }),
      GetCustPNListFromPN: (param) => $resource(CORE.API_URL + 'rfqlineitems/GetCustPNListFromPN', {
      }, {
        query: {
          isArray: true,
          method: 'POST'
        }
      }),

      removeComponentStatus: () => $resource(CORE.API_URL + 'pricingapi/removeComponentStatus', {
        statusObject: '@_statusObject',
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),

      saveUpdatedPIDCode: () => $resource(CORE.API_URL + 'pricingapi/saveUpdatedPIDCode', {
        pidObject: '@_pidObject'
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),

      removeDuplicateSupplierError: () => $resource(CORE.API_URL + 'rfqlineitems/removeDuplicateSupplierError', {
        supplierErrors: '@_supplierErrors',
        deletedRecord: '@_deletedRecord'
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),

      retrieveBOMorPMPregressStatus: () => $resource(CORE.API_URL + 'rfqlineitems/retrieveBOMorPMPregressStatus', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),

      getAllCPNPartDetailListByCPNIDs: () => $resource(CORE.API_URL + 'rfqlineitems/getAllCPNPartDetailListByCPNIDs', {
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),

      getUserBOMFiltersSequence: () => $resource(CORE.API_URL + 'rfqLineItemFilter/getUserBOMFiltersSequence/', {
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),

      exportBOM: (requestObj) => $http.post(CORE.API_URL + 'rfqlineitems/getBOMExportFile', requestObj, {
        responseType: 'arraybuffer'
      }).then((response) => response, (error) => error)
    };
  }
})();
