(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('AddProductionStockPopupController', AddProductionStockPopupController);

    /** @ngInject */
    function AddProductionStockPopupController(CORE, $mdDialog, data, WorkorderTransProductionFactory, WorkorderSerialMstFactory, BaseService) {
        const vm = this;
        vm.data = data;
        vm.taToolbar = CORE.Toolbar;
        vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
        vm.ProductStatus = CORE.productStatus;
        vm.statusText = CORE.statusText;
        vm.isOperationTrackBySerialNo = (vm.data.opData ? vm.data.opData.isOperationTrackBySerialNo : false);
        if (vm.data && vm.data.isViewHistory) {
            vm.isOperationTrackBySerialNo = true;
        }
        vm.isParallelOperation = vm.data.isParallelOperation;
        // vm.cancel = (data) => {
        //     $mdDialog.cancel(data);
        // };
        vm.cancel = () => {
            let isdirty = vm.checkFormDirty(vm.productionStockForm);
            if (isdirty) {
                BaseService.showWithoutSavingAlertForPopUp();
            }else{
                $mdDialog.cancel();
            }    
        };

        vm.checkFormDirty = (form, columnName) => {
            let checkDirty = BaseService.checkFormDirty(form, columnName);
            return checkDirty;
        }


        let resetQty = () => {
            vm.data.totalQty = "";
            vm.data.passQty = "";
            vm.data.reprocessQty = "";
            vm.data.observedQty = "";
            vm.data.reworkQty = "";
            vm.data.scrapQty = "";
            vm.data.boardWithMissingPartsQty = "";
            vm.data.bypassQty = "";
        }
        if (!vm.data.isEdit) {
            resetQty();
        }
        vm.saveProductionQty = () => {
            const opHistory = {
                woTransID: vm.data.woOPCurrentHistory.woTransID,
                totalQty: vm.data.totalQty ? vm.data.totalQty : null,
                passQty: vm.data.passQty ? vm.data.passQty : null,
                reprocessQty: vm.data.reprocessQty ? vm.data.reprocessQty : null,
                observedQty: vm.data.observedQty ? vm.data.observedQty : null,
                reworkQty: vm.data.reworkQty ? vm.data.reworkQty : null,
                scrapQty: vm.data.scrapQty ? vm.data.scrapQty : null,
                boardWithMissingPartsQty: vm.data.boardWithMissingPartsQty ? vm.data.boardWithMissingPartsQty : null,
                bypassQty: vm.data.bypassQty ? vm.data.bypassQty : null,
                isFirstArticle: vm.data.isFirstArticle ? vm.data.isFirstArticle : null,
                remark: vm.data.remark,
                employeeID: vm.data.employeeID,
                woID: vm.data.opData.woID,
                opID: vm.data.opData.opID,
                woOPID: vm.data.opData.woOPID,
                opName:vm.data.opData.opName,
                woNumber:vm.data.opData.woNumber
            }
            // added condition for check current total quantity with total build quantity excluding till process scrap quantity
            if ((vm.data.totalQty > vm.data.buildQty)
                || (vm.readyStockData && (vm.readyStockData.OPProdQty + vm.data.totalQty) > (vm.data.buildQty - vm.readyStockData.TillProcessScrapQty))) {
                var model = {
                    title: CORE.MESSAGE_CONSTANT.TOTALQTY_NOT_MORE_THAN_BUILDQTY,
                    multiple: true
                };
                DialogFactory.alertDialog(model);
                return;
            }
            vm.cgBusyLoading = WorkorderTransProductionFactory.workorder_trans_production().save(opHistory).$promise.then((res) => {
                if (res && res.status == CORE.ApiResponseTypeStatus.SUCCESS) {
                    $mdDialog.cancel(CORE.ApiResponseTypeStatus.SUCCESS);
                }
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        }
        let getStock = () => {
            let objs = {
                opID: (vm.data.opData ? vm.data.opData.opID : null),
                woID: (vm.data.opData ? vm.data.opData.woID : null),
                woOPID: (vm.data.opData ? vm.data.opData.woOPID : null)
            }
            vm.cgBusyLoading = WorkorderTransProductionFactory.retrieveWorkorderTransReadyStock().query({ operationObj: objs }).$promise.then((stockData) => {
                if (stockData.data) {
                    if (stockData.data.stockInfo.length > 0) {
                        stockData.data.stockInfo = _.first(stockData.data.stockInfo);
                        vm.readyStockData = stockData.data.stockInfo;
                        vm.readyStockData.totalValidQty = vm.readyStockData.returnPending;
                    }
                    // overwrite valid quantity and return quantity in case of quantity from last pre programming operation
                    if (stockData.data.readyPCBComponentDet) {
                        if (vm.data.opData.woOPID == stockData.data.readyPCBComponentDet.refStkWOOPID && stockData.data.readyPCBComponentDet.readyForPCB < vm.readyStockData.returnPending) {
                            vm.readyStockData.totalValidQty = vm.readyStockData.returnPending = stockData.data.readyPCBComponentDet.readyForPCB;
                        }
                    }
                }
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        }
        if (!vm.data.isEdit) {
            getStock();
        }
        vm.IsValidQty = () => {
            if (vm.data.totalQty) {
                let totalSumQty = (vm.data.passQty ? vm.data.passQty : 0) 
                + (vm.data.observedQty ? vm.data.observedQty : 0) 
                + (vm.data.scrapQty ? vm.data.scrapQty : 0) 
                + (vm.data.reworkQty ? vm.data.reworkQty : 0) 
                + (vm.data.boardWithMissingPartsQty ? vm.data.boardWithMissingPartsQty : 0)
                + (vm.data.bypassQty ? vm.data.bypassQty : 0);
                return ((vm.data.totalQty == totalSumQty) && (vm.data.totalQty <= (vm.readyStockData ? vm.readyStockData.totalValidQty : 0)));
            }
            else {
                return true;
            }
        }

        let getWorkorderTranSerialDetail = () => {
            let objs = {
                woTransID: vm.data.woOPCurrentHistory.woTransID
            }
            vm.cgBusyLoading = WorkorderSerialMstFactory.getSerialNumberDetailsByTransID().query({ operationObj: objs }).$promise.then((serialNoData) => {
                vm.WorkorderTransSerialList = serialNoData.data;
                if (serialNoData.data.length > 0) {
                    serialNoData.data = _.first(serialNoData.data);
                    vm.data.passQty = serialNoData.data.passQty;
                    vm.data.reprocessQty = serialNoData.data.reprocessQty;
                    vm.data.observedQty = serialNoData.data.observedQty;
                    vm.data.scrapQty = serialNoData.data.scrapQty;
                    vm.data.reworkQty = serialNoData.data.reworkQty;
                    vm.data.boardWithMissingPartsQty = serialNoData.data.boardWithMissingPartsQty;
                    vm.data.bypassQty = serialNoData.data.bypassQty;
                    vm.data.totalQty = (vm.data.passQty + vm.data.observedQty 
                        + vm.data.scrapQty + vm.data.reworkQty
                        + (vm.data.boardWithMissingPartsQty || 0) + (vm.data.bypassQty || 0));
                }
                else {
                    vm.data.totalQty = 0;
                }
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        }
        if (vm.isOperationTrackBySerialNo && !vm.data.isEdit) {
            getWorkorderTranSerialDetail();
        }
    }
})();