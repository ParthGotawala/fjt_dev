(function () {
    'use strict';

    angular
        .module('app.core')
        .controller('PartInPOLinePopupController', PartInPOLinePopupController);

    /** @ngInject */
    function PartInPOLinePopupController($scope, $mdDialog, DialogFactory, CORE, USER, data, BaseService, PackingSlipFactory, PurchaseOrderFactory) {
        const vm = this;
        vm.Labels = CORE.LabelConstant;
        vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
        vm.selectedPOReleaseItem = [];
        vm.poReleaseLineList = [];
        vm.packingSlipHeaderDetail = data;

        vm.goToPurchaseOrderDetail = () => BaseService.goToPurchaseOrderDetail(vm.packingSlipHeaderDetail.refPurchaseOrderID);
        vm.goToPurchaseOrderList = () => BaseService.goToPurchaseOrderList();

        vm.goToSupplierList = () => BaseService.goToSupplierList();

        vm.goToSupplierDetail = () => BaseService.goToSupplierDetail(vm.packingSlipHeaderDetail.supplierID);

        vm.editManufacturer = (id) => BaseService.goToManufacturer(id);

        vm.headerdata = [
            {
                label: vm.Labels.Purchase.PO,
                value: vm.packingSlipHeaderDetail.poNumber,
                displayOrder: 1,
                valueLinkFn: vm.goToPurchaseOrderDetail,
                labelLinkFn: vm.goToPurchaseOrderList,
                isCopy: true
            },
            {
                label: vm.Labels.Purchase.SO,
                value: vm.packingSlipHeaderDetail.supplierSONumber,
                displayOrder: 2
            },
            {
                label: vm.Labels.SupplierRMA.Supplier,
                value: vm.packingSlipHeaderDetail.supplierName,
                displayOrder: 3,
                labelLinkFn: vm.goToSupplierList,
                valueLinkFn: vm.goToSupplierDetail,
                isCopy: true
            }];

        const gelReleaseLinesForPO = () => {
            vm.poReleaseLineList = [];
            const reqLineDet = {
                refPurchaseOrderID: vm.packingSlipHeaderDetail.refPurchaseOrderID,
                mfgNumber: vm.packingSlipHeaderDetail.mfgNumber,
                partID: vm.packingSlipHeaderDetail.partID
            };
            vm.cgBusyLoading = PackingSlipFactory.gelReleaseLinesForPO().query(reqLineDet).$promise.then((resReleaseLines) => {
                if (resReleaseLines.data && resReleaseLines.data.poReleaseLineList && resReleaseLines.data.poReleaseLineList.length > 0) {
                    vm.poReleaseLineList = _.map(resReleaseLines.data.poReleaseLineList, (item) => {
                        item.shippingDate = BaseService.getUIFormatedDate(item.shippingDate, _dateDisplayFormat);
                        item.promisedShipDate = BaseService.getUIFormatedDate(item.promisedShipDate, _dateDisplayFormat);
                        item['formattedStatus'] = item.poLineWorkingStatus === vm.Labels.PACKING_SLIP.COMPLETE ? vm.Labels.PACKING_SLIP.CLOSED_STATE : vm.Labels.PACKING_SLIP.OPEN_STATE;
                        item['poWorkingStatus'] = item.poWorkingStatus === CORE.PO_Working_Status.InProgress.id ? CORE.PurchaseOrderCompleteStatusGridHeaderDropdown[1] : item.poWorkingStatus === CORE.PO_Working_Status.Completed.id ? CORE.PurchaseOrderCompleteStatusGridHeaderDropdown[2] : CORE.PurchaseOrderCompleteStatusGridHeaderDropdown[3];
                        item['rohsIconLink'] = stringFormat('{0}{1}', vm.rohsImagePath, item.rohsIcon);
                        //if (item.poLineWorkingStatus === CORE.PO_Line_WorkingStatus.Close.id) {
                        //  item.isSelect = true;
                        //}
                        item['lineComment'] = item.lineComment ? item.lineComment.replaceAll('\r', _groupConcatSeparatorValue) : null;
                        item['receivedQty'] = item.receivedQty || 0;
                        item['openQty'] = (item.poReleaseLineQty - item.receivedQty) < 0 ? 0 : item.poReleaseLineQty - item.receivedQty;
                        return item;
                    });
                    vm.isAllSelect = false;
                    setFocus('releaseLine' + _.findIndex(vm.poReleaseLineList, (item) => item.poLineWorkingStatus !== CORE.PO_Line_WorkingStatus.Close.id));
                }
            }).catch((error) => BaseService.getErrorLog(error));
        };

        gelReleaseLinesForPO();

        vm.selectReleaseLine = (item) => {
            if (item && item.formattedStatus === vm.Labels.PACKING_SLIP.CLOSED_STATE) {
                item.isSelect = !item.isSelect ? true : false;
                return;
            }
            if (item.isSelect) {
                const uniqueItems = _.uniqBy(_.filter(vm.poReleaseLineList, { isSelect: true }), 'lineID');
                // not merge two lines as multiple release line have partial qty received
                if (uniqueItems.length > 1) {
                    const mergeLines = _.map(_.orderBy(uniqueItems, ['lineID']), 'lineID');
                    const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.CHECK_RELEASE_QTY_DIFFER_LINE_VALIDATION);
                    messageContent.message = stringFormat(messageContent.message, mergeLines.join(', '));
                    const model = {
                        multiple: true,
                        messageContent: messageContent
                    };
                    DialogFactory.messageAlertDialog(model).then(() => {
                        item.isSelect = false;
                    }, () => {
                    }).catch((error) => BaseService.getErrorLog(error));
                    return;
                }
            }

            const itenIndex = vm.selectedPOReleaseItem.findIndex((val) => val.id === item.id);
            if (itenIndex !== -1) {
                vm.selectedPOReleaseItem.splice(itenIndex, 1);
                // vm.isAllSelect = false;
            }
            else {
                vm.partInPoLineForm.$setDirty(true);
                vm.selectedPOReleaseItem.push(item);
            }
            manuallyCheckAllDetails();
        };

        vm.selectItem = () => {
            //only pass one selected item
            if (vm.selectedPOReleaseItem.length === 1) {
                $mdDialog.hide(vm.selectedPOReleaseItem[0]);
            }
        };

        // select all release lines
        vm.selectAllLines = () => {
            if (vm.isAllSelect) {
                _.map(vm.poReleaseLineList, (item) => {
                    if (item.poLineWorkingStatus !== CORE.PO_Line_WorkingStatus.Close.id) {
                        item.isSelect = true;
                        vm.selectedPOReleaseItem.push(item);
                    }
                });
            } else {
                _.map(vm.poReleaseLineList, (item) => {
                    if (item.poLineWorkingStatus !== CORE.PO_Line_WorkingStatus.Close.id) {
                        item.isSelect = false;
                    }
                });
                vm.selectedPOReleaseItem = [];
            }
        };

        //check all requirement Checked or not
        const manuallyCheckAllDetails = () => {
            const allUpdate = _.find(vm.poReleaseLineList, (item) => !item.isSelect && item.poLineWorkingStatus !== CORE.PO_Line_WorkingStatus.Close.id);
            if (allUpdate) {
                vm.isAllSelect = false;
            } else { vm.isAllSelect = true; }
        };

        // merge release line shipping detail
        vm.mergeReleaseDetails = () => {
            if (vm.selectedPOReleaseItem.length < 2) {
                return;
            }
            const selectedItems = _.filter(vm.selectedPOReleaseItem, (items) => items.receivedQty);
            const uniqueItems = _.uniqBy(vm.selectedPOReleaseItem, 'lineID');
            const poRelease = _.map(_.orderBy(vm.selectedPOReleaseItem, ['releaseNumber'], ['asc']), 'releaseNumber').join();
            const poReleaseReceivedQty = _.map(_.orderBy(selectedItems, ['releaseNumber'], ['asc']), 'releaseNumber').join();
            // not merge two lines as multiple release line have partial qty received
            if (selectedItems.length > 1) {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.CHECK_RELEASE_QTY_RECEIVE_VALIDATION);
                messageContent.message = stringFormat(messageContent.message, poRelease, poReleaseReceivedQty);
                const model = {
                    multiple: true,
                    messageContent: messageContent
                };
                DialogFactory.messageAlertDialog(model).then(() => {
                }, () => {
                }).catch((error) => BaseService.getErrorLog(error));
                return false;
            }
            // not merge two lines as multiple release line have different line id
            else if (uniqueItems.length > 1) {
                const mergeLines = _.map(_.orderBy(uniqueItems, ['lineID']), 'lineID');
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.CHECK_RELEASE_QTY_DIFFER_LINE_VALIDATION);
                messageContent.message = stringFormat(messageContent.message, mergeLines.join(', '));
                const model = {
                    multiple: true,
                    messageContent: messageContent
                };
                DialogFactory.messageAlertDialog(model).then(() => {
                }, () => {
                }).catch((error) => BaseService.getErrorLog(error));
                return false;
            }
            // release line merge confirmation message
            else {
                let selectLine = _.find(vm.selectedPOReleaseItem, (item) => item.receivedQty);
                if (!selectLine) {
                    selectLine = _.minBy(vm.selectedPOReleaseItem, (o) => o.releaseNumber);
                }
                const selectedPOReleaseItem = _.map(_.filter(vm.selectedPOReleaseItem, (selectItem) => selectItem.releaseNumber !== selectLine.releaseNumber), 'releaseNumber').join();
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RELEASE_LINE_MERGE_CONFIRMATION);
                messageContent.message = stringFormat(messageContent.message, selectedPOReleaseItem, selectLine.releaseNumber);
                const obj = {
                    messageContent: messageContent,
                    btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                    canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                };
                DialogFactory.messageConfirmDialog(obj).then((yes) => {
                    if (yes) {
                        const mergelist = [];
                        _.each(vm.selectedPOReleaseItem, (poLine) => {
                            const mergeObj = {
                                id: poLine.id,
                                purchaseDetID: poLine.refPurchaseOrderDetID,
                                qty: poLine.poReleaseLineQty
                            };
                            if (poLine.id === selectLine.id) {
                                mergeObj.qty = _.sumBy(vm.selectedPOReleaseItem, (item) => item.poReleaseLineQty);
                                mergeObj.ismerged = true;
                            };
                            mergelist.push(mergeObj);
                        });
                        saveMergeLineDetails(mergelist);
                    }
                }, () => {
                }).catch((error) => BaseService.getErrorLog(error));
            }
        };

        // save merge line all details
        const saveMergeLineDetails = (list) => {
            vm.cgBusyLoading = PurchaseOrderFactory.updatePurchaseOrderReleaseLineLevelMergeDetail().query({
                list,
                refPOID: vm.packingSlipHeaderDetail.refPurchaseOrderID
            }).$promise.then((res) => {
                if (res && res.data) {
                    vm.selectedPOReleaseItem = [];
                    vm.poReleaseLineList = [];
                    gelReleaseLinesForPO();
                }
            }).catch((error) => BaseService.getErrorLog(error));
        };

        vm.showPackingSlipSummaryDetails = (item) => {
            const data = angular.copy(item);
            data.mfgCodeID = item.mfgcodeID;
            data.iscustom = item.isCustom;
            data.receivedQty = item.totalReceivedQty;
            data.pendingQty = (item.poLineQty - item.totalReceivedQty) < 0 ? 0 : item.poLineQty - item.totalReceivedQty;
            data.poId = vm.packingSlipHeaderDetail.refPurchaseOrderID;
            data.id = item.refPurchaseOrderDetID;
            data.poNumber = vm.packingSlipHeaderDetail.poNumber;
            data.qty = item.poLineQty;
            data.partID = item.partId;
            data.refReleaseLineID = item.id;
            DialogFactory.dialogService(
                CORE.PURCHASE_ORDER_RECEIVED_QTY_DETAILS_POPUP_CONTROLLER,
                CORE.PURCHASE_ORDER_RECEIVED_QTY_DETAILS_POPUP_VIEW,
                event,
                data
            ).then(() => { }, () => { });
        };

        vm.cancel = () => $mdDialog.cancel();
    }
})();
