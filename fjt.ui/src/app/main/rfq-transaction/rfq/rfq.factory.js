(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .factory('RFQFactory', RFQFactory);

  /** @ngInject */
  function RFQFactory($resource, $http, CORE) {
    return {
      getRFQ: (param) => $resource(CORE.API_URL + 'rfqforms/getRFQ', {
      }, {
        query: {
          isArray: false,
          method: 'POST',
          params: param ? {
            page: param && param.Page ? param.Page : 1,
            pageSize: CORE.UIGrid.ItemsPerPage(),
            order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
            search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null,
          } : null
        }
      }),
      retrieveRFQList: () => $resource(CORE.API_URL + 'rfqforms/retrieveRFQList', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getRFQByID: () => $resource(CORE.API_URL + 'rfqforms/getRFQByID/:id', {
        id: '@_id',
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      saveRFQ: (param) => $resource(CORE.API_URL + 'rfqforms/saveRFQ', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      deleteRFQ: (param) => $resource(CORE.API_URL + 'rfqforms/deleteRFQ', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getAssyGlanceData: (param) => $resource(CORE.API_URL + 'rfqAssemblies/getAssyGlanceData/:partID', {
        partID: '@_partID',
      }, {
        query: {
          isArray: false,
          method: 'GET',
        }
      }),
      getRFQAssyQtyList: (param) => $resource(CORE.API_URL + 'rfqAssemblies/getRFQAssyQtyList/:rfqAssyID', {
        rfqAssyID: '@_rfqAssyID',
      }, {
        query: {
          isArray: false,
          method: 'GET',
        }
      }),

      generateRFQQuoteDetailReport: (requestObj) => $http.post(CORE.API_URL + 'rfqAssemblies/generateRFQQuoteDetailReport', requestObj, {
        responseType: 'arraybuffer'
      }).then(function (response) {
        return response;
      }, function (error) {
        return error;
      }),

      generateRFQCostDetailReport: (requestObj) => $http.post(CORE.API_URL + 'rfqAssemblies/generateRFQCostDetailReport', requestObj, {
        responseType: 'arraybuffer'
      }).then(function (response) {
        return response;
      }, function (error) {
        return error;
      }),

      getRfqListHistory: () => $resource(CORE.API_URL + 'rfqforms/getRfqListHistory', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      getAllRFQList: () => $resource(CORE.API_URL + 'rfqforms/getAllRFQList', {},
        {
          query: {
            isArray: false,
            method: 'GET',
          }
        }),
      findSamePriceGroup: (param) => $resource(CORE.API_URL + 'rfqforms/findSamePriceGroup/', {},
        {
          query: {
            isArray: false,
          },
          update: {
            method: 'PUT',
          },
        }),
      downloadRFQPriceGroupTemplate: (param) => $http.post(CORE.API_URL + "rfqforms/downloadRFQPriceGroupTemplate", {
        rfqID: param.prfqID,
        isExportTemplate: param.pisExportTemplate
      },
        {
          responseType: 'arraybuffer'
        }).then((response) => {
          return response;
        }, (error) => {
          return error;
        }),
      getRFQProgressCount: () => $resource(CORE.API_URL + 'rfqforms/getRFQProgressCount', {},
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        })
    }
  }
})();
