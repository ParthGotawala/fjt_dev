(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .factory('BOMFactory', BOMFactory);

  /** @ngInject */
  function BOMFactory($resource, $http, CORE) {
    return {
      // If any detail of BOM is changed then update the flag
      isBOMChanged: false,
      bomSelectedFilter: null,
      isqtyUpdate: false,
      getRFQLineItems: () => $resource(CORE.API_URL + 'rfqlineitems/getRFQLineItems', {
      }, {
        query: {
          isArray: false,
          method: 'POST',
          timeout: 180000
        }
      }),
      getRFQLineItemsByID: () => $resource(CORE.API_URL + 'rfqlineitems/getRFQLineItemsByID/:id', {
        id: '@_id'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      saveRFQLineItems: () => $resource(CORE.API_URL + 'rfqlineitems/saveRFQLineItems', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getAssyDetails: () => $resource(CORE.API_URL + 'rfqAssemblies/getAssyDetails/:id', {
        id: '@_id'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      getAllUniqueSubAssemblyByPartID: () => $resource(CORE.API_URL + 'rfqAssemblies/getAllUniqueSubAssemblyByPartID/:id', {
        id: '@_id'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      getAllUniqueSubAssemblyByBOMPartID: () => $resource(CORE.API_URL + 'rfqAssemblies/getAllUniqueSubAssemblyByBOMPartID/:id', {
        id: '@_id'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      getRFQAssyByID: () => $resource(CORE.API_URL + 'rfqAssemblies/getRFQAssyByID/:id', {
        id: '@_id'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      getBOMHistory: () => $resource(CORE.API_URL + 'rfqAssemblies/getBOMHistory', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      saveNarrativeHistory: () => $resource(CORE.API_URL + 'rfqAssemblies/saveNarrativeHistory', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getBOMProgress: () => $resource(CORE.API_URL + 'rfqAssemblies/getBOMProgress/:id', {
        id: '@_id'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      getBOMIconList: () => $resource(CORE.API_URL + 'rfqAssemblies/getBOMIconList/:id', {
        id: '@_id'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      getAssemblyRequoteHistory: () => $resource(CORE.API_URL + 'rfqAssemblies/getAssemblyRequoteHistory', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getAssyDriveToolsList: () => $resource(CORE.API_URL + 'rfqlineitems/getAssyDriveToolsList', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getAssyQuoteSummaryDetails: () => $resource(CORE.API_URL + 'rfqAssemblies/getAssyQuoteSummaryDetails/:id/:quoteSubmittedID', {
        id: '@_id',
        quoteSubmittedID: '@_quoteSubmittedID'
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      saveQuoteSubmittedSummaryDetails: () => $resource(CORE.API_URL + 'rfqAssemblies/saveQuoteSubmittedSummaryDetails', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      changeAssyStatus: () => $resource(CORE.API_URL + 'rfqAssemblies/changeAssyStatus', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getAssemblyHeaderDetails: () => $resource(CORE.API_URL + 'rfqAssemblies/getAssemblyHeaderDetails', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      // downloadQuoteSummaryReport: () => $http.post(CORE.API_URL + 'BOM/generateQuoteSummaryReport', null, {
      //       responseType: 'arraybuffer'
      //     }).then(function (response) {
      //     return response;
      //   }, function (error) {
      //     return error;
      //   }),

      downloadQuoteSummaryReport: (requestObj) => $http.post(CORE.REPORT_URL + 'BOM/generateQuoteSummaryReport', requestObj, {
        responseType: 'arraybuffer'
      }).then((response) => response
        , (error) => error
      ),
      generateAssyQuoteSummary: () => $resource(CORE.API_URL + 'rfqAssemblies/generateAssyQuoteSummary/:id/:quoteSubmittedID', {
        id: '@_id',
        quoteSubmittedID: '@_quoteSubmittedID'
      }, {
        query: {
          isArray: false,
          method: 'GET'

        }
      }),
      downloadObsoletePartReport: (requestObj) => $http.post(CORE.REPORT_URL + 'Part/generateObsoletePartReport', requestObj, {
        responseType: 'arraybuffer'
      }
      ).then((response) => response
        , (error) => error
      ),
      downloadLaborReport: (requestObj) => $http.post(CORE.REPORT_URL + 'Labor/generateLaborAssyReport', requestObj, {
        responseType: 'arraybuffer'
      }
      ).then((response) => response
        , (error) => error
      ),
      startStopBOMActivity: () => $resource(CORE.API_URL + 'rfqlineitems/startStopBOMActivity', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      saveInternalVersionAssy: () => $resource(CORE.API_URL + 'rfqAssemblies/saveInternalVersionAssy', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      startStopCostingActivity: () => $resource(CORE.API_URL + 'rfqAssemblies/startStopCostingActivity', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      retrieveActivityTrackingHistory: () => $resource(CORE.API_URL + 'rfqAssemblies/retrieveActivityTrackingHistory', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getPartRefDesgMapping: () => $resource(CORE.API_URL + 'rfqlineitems/getPartRefDesgMapping/:partID', {
        partID: '@_partId'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      getPartProgramMappingDetail: () => $resource(CORE.API_URL + 'rfqlineitems/getPartProgramMappingDetail/:partID', {
        partID: '@_partId'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      savePartProgramMappingDetail: () => $resource(CORE.API_URL + 'rfqlineitems/savePartProgramMappingDetail', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getAllRFQAssemblyByPartID: () => $resource(CORE.API_URL + 'rfqAssemblies/getAllRFQAssemblyByPartID/:id', {
        id: '@_id'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      stopMultipleBOMActivity: () => $resource(CORE.API_URL + 'rfqlineitems/stopMultipleBOMActivity', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getAssemblyHistoryByID: () => $resource(CORE.API_URL + 'rfqAssemblies/getAssemblyHistoryByID/:id', {
        id: '@_id'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      saveManualActivityTracking: () => $resource(CORE.API_URL + 'rfqAssemblies/saveManualActivityTracking', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getAllRFQListByID: () => $resource(CORE.API_URL + 'rfqAssemblies/getAllRFQListByID', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      deleteAssyTransHistory: () => $resource(CORE.API_URL + 'rfqAssemblies/deleteAssyTransHistory', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      updatePaymentBurdanDetails: () => $resource(CORE.API_URL + 'rfqAssemblies/updatePaymentBurdanDetails', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      retrieveManualEntryList: () => $resource(CORE.API_URL + 'rfqAssemblies/retrieveManualEntryList ', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      })
    };
  }
})();
