(function () {
  'use strict';

  angular
    .module('app.transaction')
    .factory('SalesOrderFactory', SalesOrderFactory);

  /** @ngInject */
  function SalesOrderFactory($resource, CORE, $http) {
    return {
      salesOrderNumber: '',
      salesOrderStatus: 0,
      salesorder: () => $resource(CORE.API_URL + 'salesorder/:id', {
        id: '@_id'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        },
        update: {
          method: 'PUT'
        }
      }),
      retrieveSalesOrderList: () => $resource(CORE.API_URL + 'salesorder/retrieveSalesOrderList', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getUnitList: () => $resource(CORE.API_URL + 'salesorder/getUnitList', {}, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),

      getShippingList: () => $resource(CORE.API_URL + 'salesorder/getShippingList', {
        shippingObj: '@_shippingObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      getAllSalesOrderList: () => $resource(CORE.API_URL + 'salesorder/getAllSalesOrderList', {}, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),

      getValidShippedQty: () => $resource(CORE.API_URL + 'salesorder/getValidShippedQty', {
        workorderInfo: '@_workorderInfo'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      getSalesOrderList: () => $resource(CORE.API_URL + 'salesorder/getSalesOrderList', {
        shippingInfo: '@_shippingInfo'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      getActiveSalesOrderDetailsList: () => $resource(CORE.API_URL + 'salesorder/getActiveSalesOrderDetailsList', {
        shippingInfo: '@_shippingInfo'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      getSubAsemblyDetailList: () => $resource(CORE.API_URL + 'salesorder/getSubAsemblyDetailList', {
        assyInfo: '@_assyInfo'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      getWorkOrderOperationList: () => $resource(CORE.API_URL + 'salesorder/getAllWorkOrderOperationList/:id', { id: '@_id' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      deleteSalesOrder: () => $resource(CORE.API_URL + 'salesorder/deleteSalesOrder', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      getCustomerSalesOrderDetail: () => $resource(CORE.API_URL + 'salesorder/getCustomerSalesOrderDetail', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getSalesOrderStatus: () => $resource(CORE.API_URL + 'salesorder/getSalesOrderStatus/:id', { id: '@_id' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),

      salsorderCancleReason: () => $resource(CORE.API_URL + 'salesorder/salsorderCancleReason/', { listObj: '@_listObj' }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      savePlannPurchaseDetail: () => $resource(CORE.API_URL + 'salesorder/savePlannPurchaseDetail/', { plannObj: '@_plannObj' }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      salesorderchangehistory: () => $resource(CORE.API_URL + 'salesorder/salesorderchangehistory', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      salesOrderReport: (salesOrderReportDetails) => $http.post(CORE.REPORT_URL + 'SalesOrderReport/salesOrderReport', salesOrderReportDetails, {
        responseType: 'arraybuffer'
      }).then((response) => response, (error) => error),
      getDataKey: () => $resource(CORE.API_URL + 'salesorder/getDataKey', {}, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      getSalesOrderDetails: () => $resource(CORE.API_URL + 'salesorder/getSalesOrderDetails', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getSalesOrderMstNumber: () => $resource(CORE.API_URL + 'salesorder/getSalesOrderMstNumber', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getCustomerwiseSOPOList: () => $resource(CORE.API_URL + 'salesorder/getCustomerwiseSOPOList', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getCustomerSOwisePOAssyList: () => $resource(CORE.API_URL + 'salesorder/getCustomerSOwisePOAssyList', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      removePlanReleaseDeatil: () => $resource(CORE.API_URL + 'salesorder/removePlanReleaseDeatil', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      getCustomerPOwiseWOAssyList: () => $resource(CORE.API_URL + 'salesorder/getCustomerPOwiseWOAssyList', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getCustomerPOAssywiseWoDetails: () => $resource(CORE.API_URL + 'salesorder/getCustomerPOAssywiseWoDetails', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getKitReleasedQty: () => $resource(CORE.API_URL + 'salesorder/getKitReleasedQty/:PSalesOrderDetID', { PSalesOrderDetID: '@_PSalesOrderDetID' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      getKitPlannedDetailOfSaleOrderAssy: () => $resource(CORE.API_URL + 'salesorder/getKitPlannedDetailOfSaleOrderAssy', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getSalesOrderDetailById: () => $resource(CORE.API_URL + 'salesorder/getSalesOrderDetailById', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      updateKitMrpQty: () => $resource(CORE.API_URL + 'salesorder/updateKitMrpQty', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getKitReleaseListBySalesOrderId: () => $resource(CORE.API_URL + 'salesorder/getKitReleaseListBySalesOrderId', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      holdResumeTrans: () => $resource(CORE.API_URL + 'salesorder/holdResumeTrans', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      getRfqQtyandTurnTimeDetail: () => $resource(CORE.API_URL + 'salesorder/getRfqQtyandTurnTimeDetail/:partID/:rfqQuoteGroupID', { partID: '@_partID', rfqQuoteGroupID: '@_rfqQuoteGroupID' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),

      getQtyandTurnTimeDetailByAssyId: () => $resource(CORE.API_URL + 'salesorder/getQtyandTurnTimeDetailByAssyId', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      getSalesCommissionDetails: () => $resource(CORE.API_URL + 'salesorder/getSalesCommissionDetails', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      saveSalesCommissionDetails: () => $resource(CORE.API_URL + 'salesorder/saveSalesCommissionDetails/', { salesObj: '@_salesObj' }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getQuoteGroupDetailsfromPartID: () => $resource(CORE.API_URL + 'salesorder/getQuoteGroupDetailsfromPartID/:partID', { partID: '@_partID' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      retrieveSalesOrderOtherExpenseDetails: (param) => $resource(CORE.API_URL + 'salesorder/retrieveSalesOrderOtherExpenseDetails', {
      }, {
        query: {
          isArray: false,
          method: 'GET',
          params: param ? {
            page: param && param.Page ? param.Page : 1,
            pageSize: CORE.UIGrid.ItemsPerPage(),
            order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
            search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null,
            refSalesDetID: param && param.refSalesDetID ? param.refSalesDetID : null
          } : null
        }
      }),
      getOtherPartTypeComponentDetails: () => $resource(CORE.API_URL + 'salesorder/getOtherPartTypeComponentDetails', {}, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      retrieveSalesOrderDetailStatus: () => $resource(CORE.API_URL + 'salesorder/retrieveSalesOrderDetailStatus', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      updateSalesOrderDetailStatusManual: () => $resource(CORE.API_URL + 'salesorder/updateSalesOrderDetailStatusManual', { salesObj: '@_salesObj' }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getSalesOrderHeaderWorkingStatus: () => $resource(CORE.API_URL + 'salesorder/getSalesOrderHeaderWorkingStatus', { id: '@_id' }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      salesOrderDetailSkipKitValidation: () => $resource(CORE.API_URL + 'salesorder/salesOrderDetailSkipKitValidation', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      checkRFQQuoteNumberUnique: () => $resource(CORE.API_URL + 'salesorder/checkRFQQuoteNumberUnique', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      checkUniquePOWithCustomer: () => $resource(CORE.API_URL + 'salesorder/checkUniquePOWithCustomer', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getSalesOrderReleaseLineDetail: () => $resource(CORE.API_URL + 'salesorder/getSalesOrderReleaseLineDetail/:soDetID', { soDetID: '@_soDetID' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      createUpdateSalesOrderDetails: () => $resource(CORE.API_URL + 'salesorder/createUpdateSalesOrderDetails', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      retrieveSalesOrderDetail: () => $resource(CORE.API_URL + 'salesorder/retrieveSalesOrderDetail/:id', { id: '@_id' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      saveSalesOrderLineDetail: () => $resource(CORE.API_URL + 'salesorder/saveSalesOrderLineDetail', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      removeSalesOrderDetail: () => $resource(CORE.API_URL + 'salesorder/removeSalesOrderDetail', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      saveSalesOrderOtherCharges: () => $resource(CORE.API_URL + 'salesorder/saveSalesOrderOtherCharges', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      removeSalesOrderReleaseLineDetail: () => $resource(CORE.API_URL + 'salesorder/removeSalesOrderReleaseLineDetail', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getsalesOrderHoldUnhold: () => $resource(CORE.API_URL + 'salesorder/getsalesOrderHoldUnhold', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getSalesCommissionDetailToExport: () => $resource(CORE.API_URL + 'salesorder/getSalesCommissionDetailToExport', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getSOPromisedShipDateFromDockDate: () => $resource(CORE.API_URL + 'salesorder/getSOPromisedShipDateFromDockDate', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getQuoteStatusForSalesCommission: () => $resource(CORE.API_URL + 'salesorder/getQuoteStatusForSalesCommission', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      retrieveSalesOrderSummaryList: () => $resource(CORE.API_URL + 'salesorder/retrieveSalesOrderSummaryList', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getBlanketPOAssyList: () => $resource(CORE.API_URL + 'salesorder/getBlanketPOAssyList', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getBlanketPOUsedQtyForAssy: () => $resource(CORE.API_URL + 'salesorder/getBlanketPOUsedQtyForAssy', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getSalesOrderDetailByPartId: () => $resource(CORE.API_URL + 'salesorder/getSalesOrderDetailByPartId', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      checkPartStatusOfSalesOrder: () => $resource(CORE.API_URL + 'salesorder/checkPartStatusOfSalesOrder/:id', { id: '@_id' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      getDuplicateSalesOrderCommentsList: () => $resource(CORE.API_URL + 'salesorder/getDuplicateSalesOrderCommentsList/:id', { id: '@_id' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      retriveSalesOrderByID: () => $resource(CORE.API_URL + 'salesorder/retriveSalesOrderByID/:id', { id: '@_id' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      copySalesOrderDetail: () => $resource(CORE.API_URL + 'salesorder/copySalesOrderDetail', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getCopySalesOrderAssyMismatch: () => $resource(CORE.API_URL + 'salesorder/getCopySalesOrderAssyMismatch/:id', { id: '@_id' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      getSalesOrderPackingSlipNumber: () => $resource(CORE.API_URL + 'salesorder/getSalesOrderPackingSlipNumber', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getSalesOrderShipmentSummary: () => $resource(CORE.API_URL + 'salesorder/getSalesOrderShipmentSummary', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      updateSalesOrderFromShipmentSummary: () => $resource(CORE.API_URL + 'salesorder/updateSalesOrderFromShipmentSummary', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getSalesOrderBPOValidationDetail: () => $resource(CORE.API_URL + 'salesorder/getSalesOrderBPOValidationDetail', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      unlinkFuturePOFromBlanketPO: () => $resource(CORE.API_URL + 'salesorder/unlinkFuturePOFromBlanketPO', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getSalesOrderFPONotLinkedList: () => $resource(CORE.API_URL + 'salesorder/getSalesOrderFPONotLinkedList', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      linkFuturePOToBlanketPO: () => $resource(CORE.API_URL + 'salesorder/linkFuturePOToBlanketPO', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getLinkedFuturePODetails: () => $resource(CORE.API_URL + 'salesorder/getLinkedFuturePODetails', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      })
    };
  }
})();
