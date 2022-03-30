
(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .factory('PartCostingFactory', PartCostingFactory);

  /** @ngInject */
  function PartCostingFactory($resource, CORE) {
    return {
      consolidatepart: (param) => $resource(CORE.API_URL + 'consolidatepart/', {
      }, {
        query: {
          isArray: false,
          method: 'GET',
          params: {
            page: param && param.Page ? param.Page : 1,
            id: param && param.id ? param.id : 0,
            pageSize: 500,
            order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
            search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null,
            spName: param && param.spName ? param.spName : null,
            filterID: param && param.FilterID ? param.FilterID : null,
            leadTime: param && param.leadTime ? param.leadTime : null,
            ppackageing: param && param.ppackageing ? param.ppackageing : null
          }
        }
      }),
      retrieveNotQuotedLineItems: (param) => $resource(CORE.API_URL + 'consolidatepart/retrieveNotQuotedLineItems', {
      }, {
        query: {
          isArray: false,
          method: 'GET',
          params: {
            page: param && param.Page ? param.Page : 1,
            id: param && param.id ? param.id : 0,
            pageSize: param && param.pageSize ? param.pageSize : CORE.UIGrid.ItemsPerPage(),
            order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
            search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null
          }
        }
      }),
      retrieveCustomRulesLineItems: (param) => $resource(CORE.API_URL + 'consolidatepart/retrieveCustomRulesLineItems', {
      }, {
        query: {
          isArray: false,
          method: 'GET',
          params: {
            page: param && param.Page ? param.Page : 1,
            id: param && param.id ? param.id : 0,
            pageSize: CORE.UIGrid.ItemsPerPage(),
            order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
            search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null
          }
        }
      }),
      retrieveExcessMaterialLineItems: (param) => $resource(CORE.API_URL + 'consolidatepart/retrieveExcessMaterialLineItems', {
      }, {
        query: {
          isArray: false,
          method: 'GET',
          params: {
            page: param && param.Page ? param.Page : 1,
            id: param && param.id ? param.id : 0,
            pageSize: CORE.UIGrid.ItemsPerPage(),
            order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
            search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null
          }
        }
      }),
      retrieveMaterialAtRiskLineItems: (param) => $resource(CORE.API_URL + 'consolidatepart/retrieveMaterialAtRiskLineItems', {
      }, {
        query: {
          isArray: false,
          method: 'GET',
          params: {
            page: param && param.Page ? param.Page : 1,
            id: param && param.id ? param.id : 0,
            pageSize: CORE.UIGrid.ItemsPerPage(),
            order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
            search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null
          }
        }
      }),
      retrieveLeadTimeRiskLineItems: (param) => $resource(CORE.API_URL + 'consolidatepart/retrieveLeadTimeRiskLineItems', {
      }, {
        query: {
          isArray: false,
          method: 'GET',
          params: {
            page: param && param.Page ? param.Page : 1,
            id: param && param.id ? param.id : 0,
            pageSize: CORE.UIGrid.ItemsPerPage(),
            order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
            search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null
          }
        }
      }),
      retrieveSuggestedAlternative: (param) => $resource(CORE.API_URL + 'consolidatepart/retrieveSuggestedAlternative', {
      }, {
        query: {
          isArray: false,
          method: 'GET',
          params: {
            page: param && param.Page ? param.Page : 1,
            id: param && param.id ? param.id : 0,
            pageSize: CORE.UIGrid.ItemsPerPage(),
            order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
            search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null
          }
        }
      }),

      getPricingHistoryforAssembly: (param) => $resource(CORE.API_URL + 'consolidatepart/getPricingHistoryforAssembly', {
      }, {
        query: {
          isArray: false,
          method: 'GET',
          params: {
            page: param && param.Page ? param.Page : 1,
            prfqAssyID: param && param.id ? param.id : 0,
            pageSize: CORE.UIGrid.ItemsPerPage(),
            order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
            search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null,
            passyQtyID: param && param.passyQtyID ? param.passyQtyID : 0,
            spName: param && param.spName ? param.spName : '',
            pstartHistory: param && param.pstartHistory ? param.pstartHistory : 1,
            plastHistory: param && param.plastHistory ? param.plastHistory : 1
          }
        }
      }),

      getPricingFromApis: () => $resource(CORE.API_URL + 'consolidatepart/getPricingFromApis', {
        pricingApiObj: '@_pricingApiObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      stopPricingRequests: () => $resource(CORE.API_URL + 'consolidatepart/stopPricingRequests', {
        pricingApiObj: '@_pricingApiObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      retrievePricing: () => $resource(CORE.API_URL + 'pricingapi/retrievePricing', {
        pricingObj: '@_pricingObj'
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),

      retrievePriceBreak: () => $resource(CORE.API_URL + 'pricingapi/retrievePriceBreak', {
        pricingObj: '@_pricingObj'
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),

      saveCopyPricing: () => $resource(CORE.API_URL + 'pricingapi/saveCopyPricing', {
        copyPrice: '@_copyPrice'
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),

      updateConsolidatePart: () => $resource(CORE.API_URL + 'consolidatepart/updateConsolidatePart', {
        consolidateObj: '@_consolidateObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getConsolidatePartQty: () => $resource(CORE.API_URL + 'consolidatepart/getConsolidatePartQty/:id', { id: '@_id' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      savePriceForQuantity: () => $resource(CORE.API_URL + 'pricingapi/savePriceForQuantity', {
        pricingObj: '@_pricingObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      saveFinalPrice: () => $resource(CORE.API_URL + 'pricingapi/saveFinalPrice', {
        pricingObj: '@_pricingObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      saveManualPrice: () => $resource(CORE.API_URL + 'consolidatepart/saveManualPrice', {
        objManualPrice: '@_objManualPrice'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      saveSupplierQuotePrice: () => $resource(CORE.API_URL + 'consolidatepart/saveSupplierQuotePrice', {
        objManualPrice: '@_objManualPrice'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      updateManualPrice: () => $resource(CORE.API_URL + 'consolidatepart/updateManualPrice', {
        objManualPrice: '@_objManualPrice'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getComponentPricing: () => $resource(CORE.API_URL + 'pricingapi/getComponentPricing', {
        pricingObj: '@_pricingObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      retrieveAllQtyPricing: () => $resource(CORE.API_URL + 'consolidatepart/retrieveAllQtyPricing/:prfqAssyID', { prfqAssyID: '@_prfqAssyID' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      pricingselectionsetting: () => $resource(CORE.API_URL + 'priceselectionsetting/', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),

      savePriceSelectionSetting: () => $resource(CORE.API_URL + 'priceselectionsetting/savePriceSelectionSetting', {
        priceSettingList: '@_priceSettingList'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      CopyPriceSelectionSetting: () => $resource(CORE.API_URL + 'priceselectionsetting/CopyPriceSelectionSetting', {
        paramobj: '@_paramobj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getPackaging: () => $resource(CORE.API_URL + 'priceselectionsetting/getPackaging', {}, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      saveSummaryQuote: () => $resource(CORE.API_URL + 'summaryquote/saveSummaryQuote', {
        summaryQuoteObj: '@_summaryQuoteObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      retriveDynamicFields: () => $resource(CORE.API_URL + 'summaryquote/retriveDynamicFields', {
      }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      retriveSummaryQuote: () => $resource(CORE.API_URL + 'summaryquote/retriveSummaryQuote', { summaryGetobj: '@_summaryGetobj' }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      getSummaryTermsCondition: () => $resource(CORE.API_URL + 'summaryquote/getSummaryTermsCondition/:rfqAssyID', { rfqAssyID: '@_rfqAssyID' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      cleanSelectionPrice: () => $resource(CORE.API_URL + 'consolidatepart/cleanSelectionPrice', {
        priceClean: '@_priceClean'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      cleanPrice: () => $resource(CORE.API_URL + 'consolidatepart/cleanPrice', {
        priceClean: '@_priceClean'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      saveImportPricing: () => $resource(CORE.API_URL + 'consolidatepart/saveImportPricing', {
        objManualPrice: '@_objManualPrice'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getDigikeyCardential: () => $resource(CORE.API_URL + 'pricingapi/getDigikeyCardential', {}, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      checkAccessToken: () => $resource(CORE.API_URL + 'pricingapi/checkAccessToken', {}, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),

      checkAppAccessTokenActive: () => $resource(CORE.API_URL + 'pricingapi/checkAppAccessTokenActive', {}, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),

      checkAppAccessToken: () => $resource(CORE.API_URL + 'pricingapi/checkAppAccessToken/:appID', { appID: '@_appID' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),

      getImoprtLOA: () => $resource(CORE.API_URL + 'componentcustomerloa/getImoprtLOA', {
        pricingApiObj: '@_pricingApiObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getComponentLOAList: () => $resource(CORE.API_URL + 'componentcustomerloa/getComponentLOAList', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      updateComponentCustomerLOAPrice: () => $resource(CORE.API_URL + 'componentcustomerloa/updateComponentCustomerLOAPrice/', {
        customerLoaModel: '@_customerLoaModel'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getAlternatePartList: () => $resource(CORE.API_URL + 'consolidatepart/getAlternatePartList', {},
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      getAssyIDAlternatePartList: () => $resource(CORE.API_URL + 'consolidatepart/getAssyIDAlternatePartList', {},
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      getSupplierList: () => $resource(CORE.API_URL + 'consolidatepart/getSupplierList', {},
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      revisedQuote: () => $resource(CORE.API_URL + 'summaryquote/revisedQuote', {
        rfqAssyID: '@_rfqAssyID'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      removeQuoteSummary: () => $resource(CORE.API_URL + 'summaryquote/removeQuoteSummary', {
        rfqAssyID: '@_rfqAssyID'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      savePricingHistory: () => $resource(CORE.API_URL + 'consolidatepart/savePricingHistory', {
        historyObj: '@_historyObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getNotQuoteNRNDCount: () => $resource(CORE.API_URL + 'consolidatepart/getNotQuoteNRNDCount', { id: '@_id' },
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      getConsolidateAvailableStock: () => $resource(CORE.API_URL + 'consolidatepart/getConsolidateAvailableStock/:pconsolidateID', { pconsolidateID: '@_pconsolidateID' },
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      retrievePricingList: () => $resource(CORE.API_URL + 'consolidatepart/retrievePricingList/:rfqAssyID/:isPurchaseApi', { rfqAssyID: '@_rfqAssyID', isPurchaseApi: '@_isPurchaseApi' },
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      getnonQuotedQty: () => $resource(CORE.API_URL + 'consolidatepart/getnonQuotedQty/:rfqAssyID/:isPurchaseApi', { rfqAssyID: '@_rfqAssyID', isPurchaseApi: '@_isPurchaseApi' },
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),

      getPricingHistoryList: () => $resource(CORE.API_URL + 'consolidatepart/getPricingHistoryList/:rfqAssyID', { rfqAssyID: '@_rfqAssyID' },
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      saveAssyPriceQtyBreak: () => $resource(CORE.API_URL + 'consolidatepart/saveAssyPriceQtyBreak', {
        assyQtyBreak: '@_assyQtyBreak'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getPriceGroupDetail: () => $resource(CORE.API_URL + 'summaryquote/getPriceGroupDetail', { priceGroupId: '@_priceGroupId' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      getSupplierQuotes: () => $resource(CORE.API_URL + 'pricingapi/getSupplierQuotes/', { partID: '@_partID' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      clearSelectedqtyPrice: () => $resource(CORE.API_URL + 'pricingapi/clearSelectedqtyPrice', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getAssemblyCurrentStatus: () => $resource(CORE.API_URL + 'summaryquote/getAssemblyCurrentStatus/:rfqAssyID', { rfqAssyID: '@_rfqAssyID' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      getUsedPricing: () => $resource(CORE.API_URL + 'consolidatepart/getUsedPricing', { }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      removeSelectedQuotePrice: () => $resource(CORE.API_URL + 'consolidatepart/removeSelectedQuotePrice', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      })
    };
  }
})();
