(function () {
    'use strict';

    angular.module('app.transaction.packingSlip').factory('PackingSlipFactory', PackingSlipFactory);
    /** @ngInject */
    function PackingSlipFactory($resource, CORE, $http) {
        return {
            getPackingSlipList: () => $resource(CORE.API_URL + 'packing_slip/getPackingSlipList', {}, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            getPackingSlipDet: () => $resource(CORE.API_URL + 'packing_slip/getPackingSlipDet/:id/:receiptType', {
                id: '@_id',
                receiptType: '@_receiptType'
            }, {
                query: {
                    method: 'GET',
                    isArray: false
                }
            }),

            savePackingSlip: () => $resource(CORE.API_URL + 'packing_slip/savePackingSlip', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),

            deletePackingSlip: () => $resource(CORE.API_URL + 'packing_slip/deletePackingSlip', {
                listObj: '@_listObj'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            deleteSupplierInvoiceAndMemo: () => $resource(CORE.API_URL + 'packing_slip/deleteSupplierInvoiceAndMemo', {
                listObj: '@_listObj'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            getPackingSlipMaterialList: () => $resource(CORE.API_URL + 'packing_slip/getPackingSlipMaterialList', {}, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            savePackingSlipMaterial: () => $resource(CORE.API_URL + 'packing_slip/savePackingSlipMaterial', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),

            saveInvoiceMaterial: () => $resource(CORE.API_URL + 'packing_slip/saveInvoiceMaterial', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            deletePackingSlipMaterial: () => $resource(CORE.API_URL + 'packing_slip/deletePackingSlipMaterial', {
                listObj: '@_listObj'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),

            deleteSupplierInvoiceMaterial: () => $resource(CORE.API_URL + 'packing_slip/deleteSupplierInvoiceMaterial', {
                listObj: '@_listObj'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),

            scanPackingBarcode: () => $resource(CORE.API_URL + 'packing_slip/scanPackingBarcode', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            getPackingSlipPartQtyByPO: () => $resource(CORE.API_URL + 'packing_slip/getPackingSlipPartQtyByPO', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            getAllPackingSlipList: () => $resource(CORE.API_URL + 'packing_slip/getAllPackingSlipList', {},
                {
                    query: {
                        isArray: false,
                        method: 'GET'
                    }
                }),
            getPackingSlipInvoice: () => $resource(CORE.API_URL + 'packing_slip/getPackingSlipInvoice', {},
                {
                    query: {
                        isArray: false,
                        method: 'POST'
                    }
                }),
            approvePackingSlipMaterialMemo: () => $resource(CORE.API_URL + 'packing_slip/approvePackingSlipMaterialMemo', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            paidPackingSlip: () => $resource(CORE.API_URL + 'packing_slip/paidPackingSlip', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            updateSupplierPayment: () => $resource(CORE.API_URL + 'packing_slip/updateSupplierPayment', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            voidSupplierInvoicePayment: () => $resource(CORE.API_URL + 'packing_slip/voidSupplierInvoicePayment', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            voidAndReIssueSupplierInvoicePayment: () => $resource(CORE.API_URL + 'packing_slip/voidAndReIssueSupplierInvoicePayment', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            getAllPaidPaymentOrCheckNumberBySearch: () => $resource(CORE.API_URL + 'packing_slip/getAllPaidPaymentOrCheckNumberBySearch', {
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            saveSupplierRefund: () => $resource(CORE.API_URL + 'packing_slip/saveSupplierRefund', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            voidAndReissueSupplierRefund: () => $resource(CORE.API_URL + 'packing_slip/voidAndReissueSupplierRefund', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            validateDuplicateSupplierRefundCheckNumber: () => $resource(CORE.API_URL + 'packing_slip/validateDuplicateSupplierRefundCheckNumber', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            scanDocument: () => $resource(CORE.API_URL + 'packing_slip/scanDocument', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            saveInvoiceData: () => $resource(CORE.API_URL + 'packing_slip/saveInvoiceData', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            getPackingSlipDetByPO: () => $resource(CORE.API_URL + 'packing_slip/getPackingSlipDetByPO', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            checkUniquePackingSlipNumber: () => $resource(CORE.API_URL + 'packing_slip/checkUniquePackingSlipNumber', {}, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            getPackingSlipDocumentCount: () => $resource(CORE.API_URL + 'packing_slip/getPackingSlipDocumentCount/:id', {}, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),

            getPackingSlipMaterialDetailStatus: () => $resource(CORE.API_URL + 'packing_slip/getPackingSlipMaterialDetailStatus', {
                listObj: '@_listObj'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),

            getAllPackingInvoiceByReceiptTypeList: () => $resource(CORE.API_URL + 'packing_slip/getAllPackingInvoiceByReceiptTypeList/:id/:type', {
                id: '@_id',
                type: '@_type'
            }, {
                query: {
                    isArray: false,
                    method: 'GET'
                }
            }),
            saveCurrentPackingSlipMaterialMemo: () => $resource(CORE.API_URL + 'packing_slip/saveCurrentPackingSlipMaterialMemo', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            discardScanDocument: () => $resource(CORE.API_URL + 'packing_slip/discardScanDocument/:fileName', {
                fileName: '@_fileName'
            }, {
                query: {
                    method: 'DELETE',
                    isArray: false
                }
            }),
            getScanDocument: (documentDetail) => $http.post(CORE.API_URL + 'packing_slip/getScanDocument', documentDetail, {
                responseType: 'arraybuffer'
            }).then((response) => response, (error) => error),

            downloadSupplierPerformanceReport: (requestObj) => $http.post(CORE.REPORT_URL + 'PackingSlip/supplierPerformanceReport', requestObj, {
                responseType: 'arraybuffer'
            }).then((response) => response, (error) => error),

            checkBinContainSinglePackingSlip: () => $resource(CORE.API_URL + 'packing_slip/checkBinContainSinglePackingSlip', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            getPackingSlipMaterialReceivePartInspectionDetail: () => $resource(CORE.API_URL + 'packing_slip/getPackingSlipMaterialReceivePartInspectionDetail', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),

            updateMaterialReceivePartInstructionStatus: () => $resource(CORE.API_URL + 'packing_slip/updateMaterialReceivePartInstructionStatus', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            getPurchaseCommentList: () => $resource(CORE.API_URL + 'packing_slip/getPurchaseCommentList', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            getPackaingslipPaymentToInformation: () => $resource(CORE.API_URL + 'packing_slip/getPackaingslipPaymentToInformation', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            getSupplierRMAList: () => $resource(CORE.API_URL + 'packing_slip/getSupplierRMAList', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            approveSupplierInvoice: () => $resource(CORE.API_URL + 'packing_slip/approveSupplierInvoice', {}, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            getHistoryOfPackingSlip: () => $resource(CORE.API_URL + 'packing_slip/getHistoryOfPackingSlip', {}, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            retrieveSupplierPaymentBalanceAndPastDue: () => $resource(CORE.API_URL + 'packing_slip/retrieveSupplierPaymentBalanceAndPastDue', {
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            gelReleaseLinesForPO: () => $resource(CORE.API_URL + 'packing_slip/gelReleaseLinesForPO', {
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            checkPOLinesforPart: () => $resource(CORE.API_URL + 'packing_slip/checkPOLinesforPart', {
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            getPSLineOfSameMFPNList: () => $resource(CORE.API_URL + 'packing_slip/getPSLineOfSameMFPNList', {
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            getSupplierRMAStockList: () => $resource(CORE.API_URL + 'packing_slip/getSupplierRMAStockList', {
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            checkBinContainSamePSAndPart: () => $resource(CORE.API_URL + 'packing_slip/checkBinContainSamePSAndPart', {
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            checkRelationOfStockAndRMA: () => $resource(CORE.API_URL + 'packing_slip/checkRelationOfStockAndRMA', {
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            getSOListFromPO: () => $resource(CORE.API_URL + 'packing_slip/getSOListFromPO', {
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            lockTransaction: () => $resource(CORE.API_URL + 'packing_slip/lockTransaction', {
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            getSupplierMemoListForRefund: () => $resource(CORE.API_URL + 'packing_slip/getSupplierMemoListForRefund', {
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            getAllPOLineIdForExternalPO: () => $resource(CORE.API_URL + 'packing_slip/getAllPOLineIdForExternalPO', {
            }, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            checkLineExistsForExternalPO: () => $resource(CORE.API_URL + 'packing_slip/checkLineExistsForExternalPO', {
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            checkPSContainingPendingLine: () => $resource(CORE.API_URL + 'packing_slip/checkPSContainingPendingLine', {
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            getPackingSlipStatus: () => $resource(CORE.API_URL + 'packing_slip/getPackingSlipStatus', {
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            checkSameBinAndDifferentStatus: () => $resource(CORE.API_URL + 'packing_slip/checkSameBinAndDifferentStatus', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            checkDuplicateParentWarehouseExists: () => $resource(CORE.API_URL + 'packing_slip/checkDuplicateParentWarehouseExists', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            savePackingSlipBinDetails: () => $resource(CORE.API_URL + 'packing_slip/savePackingSlipBinDetails', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            checkPackingSlipCustConsignedStatus: () => $resource(CORE.API_URL + 'packing_slip/checkPackingSlipCustConsignedStatus', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            createAndUploadInspectionRequirmentReportInDocuments: () => $resource(CORE.API_URL + 'packing_slip/createAndUploadInspectionRequirmentReportInDocuments', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            checkPackingSlipNonUMIDStockStatus: () => $resource(CORE.API_URL + 'packing_slip/checkPackingSlipNonUMIDStockStatus', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            checkSameBinWithSamePartAndSamePackaging: () => $resource(CORE.API_URL + 'packing_slip/checkSameBinWithSamePartAndSamePackaging', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            })
        };
    }
})();
