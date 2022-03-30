(function () {
    'use strict';

    angular
        .module('app.core')
        .controller('AuditPagePopupController', AuditPagePopupController);

    /** @ngInject */
    function AuditPagePopupController($scope, $mdDialog, data, BaseService, USER, CORE, TRANSACTION, $timeout, WarehouseBinFactory, ReceivingMaterialFactory, socketConnectionService, MasterFactory, DialogFactory, $rootScope, PRICING) {
        const vm = this;
        vm.cartType = TRANSACTION.warehouseType;
        vm.DefaultDateTimeFormat = _dateTimeDisplayFormat;
        vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.WAREHOUSE_HISTORY;
        vm.warehouseDet = data;
        vm.LabelConstant = angular.copy(CORE.LabelConstant);
        vm.loginUser = BaseService.loginUser;
        vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
        vm.AuditFilter = CORE.Audit_Filter;
        vm.additionalTime = _AdditionalAuditSearchTime;
        vm.auditAllRecords = 0;
        vm.auditMismatchedRecords = 0;
        vm.auditMatchedRecords = 0;
        vm.empty = CORE.EMPTYSTATE.EMPTY_SEARCH;
        vm.cancel = () => {
            $mdDialog.cancel();
        };
        vm.clickButton = false;
        vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
            return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
        };
        vm.ScanWH = data ? data.rightSideWHLabel : null;
        vm.isScanningWarehouse = false;
        //get row interval detail
        vm.cgBusyLoading = MasterFactory.getSelectedGlobalSettingKeyValues().query({ allKeys: [TRANSACTION.AUDITPAGE.NextRowInterval, TRANSACTION.AUDITPAGE.SearchRequestTimeout] }).$promise.then((response) => {
            if (response && response.data) {
                _.each(response.data, (item) => {
                    switch (item.key) {
                        case TRANSACTION.AUDITPAGE.NextRowInterval:
                            vm.rowNumberDelay = item.values ? parseInt(item.values) : 0;
                            vm.perslotTime = vm.rowNumberDelay; //default half second per slot time
                            break;
                        case TRANSACTION.AUDITPAGE.SearchRequestTimeout:
                            vm.timeout = item.values ? parseInt(item.values) : 0;
                            break;
                    }
                });
            }
        }).catch((error) => {
            return BaseService.getErrorLog(error);
        });
        //click button for status
        vm.changeEvent = (item, ev) => {
            if (item) {
                vm.changeLightOption(ev)
            } else {
                vm.cancelSearch(ev)
            }
        }

        //search by umid api call from here on change of checkbox
        vm.searchbyCartID = (ev) => {
            vm.event = ev;
            if (vm.ScanWH) {
                ReceivingMaterialFactory.match_Warehouse_Bin().query({ name: vm.ScanWH }).$promise.then((res) => {
                    if (res && res.data) {
                        vm.WHData = res.data;
                        vm.isScanningWarehouse = false;
                        if (vm.cartType.SmartCart.key == vm.WHData.warehouseType && CORE.InoautoCart == vm.WHData.cartMfr) {
                            if (vm.WHData.rightSideWHLabel.toLowerCase() === vm.ScanWH.toLowerCase() || vm.WHData.leftSideWHLabel.toLowerCase() === vm.ScanWH.toLowerCase()) {
                                if (vm.WHData.isCartOnline) {
                                    getTotalSlotCount();
                                } else {
                                    let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SCAN_CART_IS_NOT_ONLINE);
                                    messageContent.message = stringFormat(messageContent.message, vm.ScanWH);
                                    openAlertMessage(messageContent);
                                }
                            } else {
                                openAlertMessage(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SCAN_CART_WITHOUT_SIDE);
                            }
                        } else {
                            let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SCAN_CART_IS_NOT_SMART_CART);
                            messageContent.message = stringFormat(messageContent.message, vm.ScanWH);
                            openAlertMessage(messageContent);
                        }
                    } else {
                        vm.isScanningWarehouse = false;
                        let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SCAN_CART_NOT_FOUND);
                        messageContent.message = stringFormat(messageContent.message, vm.ScanWH);
                        openAlertMessage(messageContent);
                    }
                }).catch((error) => {
                    vm.isScanningWarehouse = false;
                    return BaseService.getErrorLog(error);
                });
            } else {
                vm.isScanningWarehouse = false;
                setFocus('ScanWH');
            }
        }

        const openAlertMessage = (messageContent) => DialogFactory.messageAlertDialog({ messageContent }).then((yes) => {
            vm.ScanWH = null;
            vm.clickButton = false;
            setFocus('ScanWH');
        });
        //Scan Warehouse
        vm.scanWareHouse = (e) => {
            if (e.keyCode === 13) {
                vm.isScanningWarehouse = true;
                vm.searchbyCartID(e);
            } else {
                vm.rowCount = null;
                vm.slotName = null;
            }
            /** Prevent enter key submit event */
            preventInputEnterKeyEvent(e);
        }


        //show light option
        vm.changeLightOption = () => {
            if (vm.WHData && vm.WHData.Name) {
                vm.toWarehouse = vm.WHData.Name;
                vm.toDepartment = vm.WHData.parentWarehouseMst.Name;
                vm.toDepartmentID = vm.WHData.parentWarehouseMst.id;
                if (vm.ScanWH.toLowerCase() == vm.WHData.leftSideWHLabel.toLowerCase()) {
                    vm.whkey = TRANSACTION.Warehouse_Side.L.key;
                }
                else if (vm.ScanWH.toLowerCase() == vm.WHData.rightSideWHLabel.toLowerCase()) {
                    vm.whkey = TRANSACTION.Warehouse_Side.R.key;
                }
                else {
                    vm.whkey = TRANSACTION.Warehouse_Side.B.key;
                }
                checkColorAvailibility(vm.toDepartmentID);
            }
        }
        //change perslot time
        vm.changeperslotTime = () => {
            vm.timeout = Math.ceil(parseFloat(vm.rowCount * vm.perslotTime)) + _AdditionalAuditSearchTime;
            vm.rowNumberDelay = Math.ceil(parseFloat((_showLightPerSlot * vm.perslotTime)));
        }
        //change timeout detail
        vm.changeauditTime = () => {
            if ((parseFloat(((vm.timeout - _AdditionalAuditSearchTime) / vm.rowCount).toFixed(2))) < vm.perslotTime) {
                updateTimeslotwithTimeout();
            }
        }
        let updateTimeslotwithTimeout = () => {
            vm.perslotTime = parseFloat(((vm.timeout - _AdditionalAuditSearchTime) / vm.rowCount).toFixed(2));
            vm.rowNumberDelay = Math.ceil(parseFloat((_showLightPerSlot * vm.perslotTime)));
        }
        //get total slot number
        let getTotalSlotCount = () => {
            vm.slotName = vm.WHData.rightSideWHLabel.toLowerCase() === vm.ScanWH.toLowerCase() ? vm.WHData.rightSideWHLabel.toUpperCase() : vm.WHData.leftSideWHLabel.toUpperCase();
            if (vm.WHData.rightSideWHLabel.toLowerCase() === vm.ScanWH.toLowerCase()) {
                vm.rowCount = vm.WHData.rightSideWHRows;
            }
            else if (vm.WHData.leftSideWHLabel.toLowerCase() === vm.ScanWH.toLowerCase()) {
                vm.rowCount = vm.WHData.leftSideWHRows;
            }
            vm.changeperslotTime();
            $timeout(() => {
                let objSlotDetail = document.getElementById('perslotTime');
                if (objSlotDetail) {
                    objSlotDetail.focus();
                }
            });
        }
        //check color availability to prompt in cart
        function checkColorAvailibility(departmentID) {
            ReceivingMaterialFactory.getPromptIndicatorColor().query({
                pcartMfr: CORE.InoautoCart, prefDepartmentID: departmentID
            }).$promise.then((res) => {
                if (res && res.data && res.data.promptColors.length > 0) {
                    vm.promptColorDetails = res.data.promptColors[0];
                    vm.TimeOut = vm.timeout ? vm.timeout : res.data.defaultTimeout && res.data.defaultTimeout[0].values ? res.data.defaultTimeout[0].values : CORE.CANCEL_REQUSET_TIMEOUT;
                    funSearchByCartID(departmentID);
                } else {
                    let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PROMPT_ALREADY_USE);
                    var model = {
                        messageContent: messageContent,
                        multiple: true
                    };
                    DialogFactory.messageAlertDialog(model);
                    return;
                    //color is not available message prompt
                }
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });

        }
        function funSearchByCartID(departmentID) {
            vm.transactionID = getGUID();
            vm.request = true;
            var objSearchPartCartID = {
                PromptIndicator: vm.promptColorDetails.ledColorValue,
                ledColorID: vm.promptColorDetails.id,
                Priority: 0,
                TimeOut: vm.TimeOut,
                UserName: vm.loginUser.username,
                InquiryOnly: 0,
                departmentID: departmentID,
                TransactionID: vm.transactionID,
                Department: vm.toDepartment,
                TowerID: vm.WHData.uniqueCartID,
                Side: (vm.whkey == TRANSACTION.Warehouse_Side.L.key ? 0 : (vm.whkey == TRANSACTION.Warehouse_Side.R.key ? 1 : 0)),
                NextRowInterval: vm.rowNumberDelay ? vm.rowNumberDelay : 0,
            };
            WarehouseBinFactory.sendRequestToSearchPartByCartID().query(objSearchPartCartID).$promise.then((response) => {
                if (response.status == "FAILED") {
                    vm.request = false;
                    commonCancelFunction();
                }
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });

        }

        function connectSocket() {
            socketConnectionService.on(CORE.Socket_IO_Events.InoAuto.updateSearchCartIDRequest, updateSearchCartIDRequest);
            socketConnectionService.on(CORE.Socket_IO_Events.InoAuto.updateCancelRequest, updateCancelRequestStatus);
        }
        connectSocket();

        socketConnectionService.on('reconnect', () => {
            connectSocket();
        });

        function removeSocketListener() {
            socketConnectionService.removeListener(CORE.Socket_IO_Events.InoAuto.updateSearchCartIDRequest, updateSearchCartIDRequest);
            socketConnectionService.removeListener(CORE.Socket_IO_Events.InoAuto.updateCancelRequest, updateCancelRequestStatus);
        }
        $scope.$on('$destroy', function () {
            cancelRequest();
            removeSocketListener();
        });
        // on disconnect socket
        socketConnectionService.on('disconnect', function () {
            removeUMIDStatus();
            removeSocketListener();
        });
        vm.umIDList = [];
        function updateSearchCartIDRequest(response) {
            if (vm.transactionID == response.response.TransactionID && !vm.showStatus) {
                vm.showStatus = true;
                vm.isShowAll = CORE.Audit_Filter[1].id;//Set default Mismatched
                vm.request = false;
                vm.response = response.response;
                var selectedPkg = response.response.ChosenPackages;
                var notAvailablePkg = response.response.UnavailablePackages;
                vm.inoAutoList = _.union(selectedPkg, notAvailablePkg);
                vm.cgBusyLoading = WarehouseBinFactory.getUMIDListFromCartID().query({ pwareHouseID: vm.WHData.id }).$promise.then((response) => {
                    vm.fjtUmidList = response.data.umidList;
                    var matchedUMID = _.intersectionWith(vm.inoAutoList, vm.fjtUmidList, _.isEqual);
                    //if record match for inoauto and fjt
                    _.each(matchedUMID, (matchUMID) => {
                        var objUMID = {
                            uid: matchUMID.UID,
                            inovexWh: matchUMID.TowerID,
                            inovexSlot: matchUMID.SlotID,
                            inovexPID: matchUMID.PartNumber,
                            inovexpkgQty: matchUMID.PackageQty,
                            inovexSide: matchUMID.Side == TRANSACTION.Warehouse_Audit_Side.L.key ? TRANSACTION.Warehouse_Audit_Side.L.value : (matchUMID.Side == TRANSACTION.Warehouse_Audit_Side.R.key ? TRANSACTION.Warehouse_Audit_Side.R.value : "-"),
                            fjtWh: matchUMID.TowerID,
                            fjtSlot: matchUMID.SlotID,
                            fjtPID: matchUMID.PartNumber,
                            fjtpkgQty: matchUMID.PackageQty,
                            fjtSide: matchUMID.Side == TRANSACTION.Warehouse_Audit_Side.L.key ? TRANSACTION.Warehouse_Audit_Side.L.value : (matchUMID.Side == TRANSACTION.Warehouse_Audit_Side.R.key ? TRANSACTION.Warehouse_Audit_Side.R.value : "-"),
                            ledColorCssClass: vm.promptColorDetails.ledColorCssClass,
                            ledColorName: vm.promptColorDetails.ledColorName,
                            status: TRANSACTION.AUDITPAGE.ErrorStatus.OK,
                            isTransfer: false
                        }
                        vm.umIDList.push(objUMID);
                    });
                    // record exist in fjt but not in inoauto
                    _.each(vm.fjtUmidList, (isExistinAuto) => {
                        if (!_.find(vm.umIDList, (umid) => { return umid.uid == isExistinAuto.UID })) {
                            var inoautoUmid = _.find(vm.inoAutoList, (fjtUMID) => { return fjtUMID.UID == isExistinAuto.UID });
                            var objUMID = {};
                            if (inoautoUmid) {
                                objUMID = {
                                    uid: inoautoUmid.UID,
                                    inovexWh: inoautoUmid.TowerID,
                                    inovexSlot: inoautoUmid.SlotID,
                                    inovexPID: inoautoUmid.PartNumber,
                                    inovexpkgQty: inoautoUmid.PackageQty,
                                    inovexSide: inoautoUmid.Side == TRANSACTION.Warehouse_Audit_Side.L.key ? TRANSACTION.Warehouse_Audit_Side.L.value : (inoautoUmid.Side == TRANSACTION.Warehouse_Audit_Side.R.key ? TRANSACTION.Warehouse_Audit_Side.R.value : "-"),
                                    fjtWh: isExistinAuto.TowerID,
                                    fjtSlot: isExistinAuto.SlotID,
                                    fjtPID: isExistinAuto.PartNumber,
                                    fjtpkgQty: isExistinAuto.PackageQty,
                                    fjtSide: isExistinAuto.Side == TRANSACTION.Warehouse_Audit_Side.L.key ? TRANSACTION.Warehouse_Audit_Side.L.value : (isExistinAuto.Side == TRANSACTION.Warehouse_Audit_Side.R.key ? TRANSACTION.Warehouse_Audit_Side.R.value : "-"),
                                    isSlotMismatch: inoautoUmid.SlotID != isExistinAuto.SlotID ? true : false,
                                    ispkgQtyMismatch: inoautoUmid.PackageQty != isExistinAuto.PackageQty ? true : false,
                                    isSideMismatch: inoautoUmid.SlotID != isExistinAuto.SlotID ? true : false,
                                    isPartMismatch: inoautoUmid.PartNumber != isExistinAuto.PartNumber ? true : false,
                                    ledColorCssClass: vm.promptColorDetails.ledColorCssClass,
                                    ledColorName: vm.promptColorDetails.ledColorName,
                                    status: TRANSACTION.AUDITPAGE.ErrorStatus.Mismatched,
                                    isTransfer: true
                                }
                            } else {
                                objUMID = {
                                    uid: isExistinAuto.UID,
                                    fjtWh: isExistinAuto.TowerID,
                                    fjtSlot: isExistinAuto.SlotID,
                                    fjtPID: isExistinAuto.PartNumber,
                                    fjtpkgQty: isExistinAuto.PackageQty,
                                    fjtSide: isExistinAuto.Side == TRANSACTION.Warehouse_Audit_Side.L.key ? TRANSACTION.Warehouse_Audit_Side.L.value : (isExistinAuto.Side == TRANSACTION.Warehouse_Audit_Side.R.key ? TRANSACTION.Warehouse_Audit_Side.R.value : "-"),
                                    inovexWh: "-",
                                    inovexSlot: "-",
                                    inovexPID: "-",
                                    inovexpkgQty: "-",
                                    inovexSide: "-",
                                    status: TRANSACTION.AUDITPAGE.ErrorStatus.NotInInovaxe,
                                    isTransfer: false
                                }
                            }
                            vm.umIDList.push(objUMID);
                        }
                    });
                    // record exist in inoauto but not in fjt
                    _.each(vm.inoAutoList, (inoautoUmid) => {
                        if (!_.find(vm.umIDList, (umid) => { return umid.uid == inoautoUmid.UID })) {
                            var isExistinAuto = _.find(vm.fjtUmidList, (fjtUMID) => { return fjtUMID.UID == inoautoUmid.UID });
                            var objUMID = {};
                            if (isExistinAuto) {
                                objUMID = {
                                    uid: inoautoUmid.UID,
                                    inovexWh: inoautoUmid.TowerID,
                                    inovexSlot: inoautoUmid.SlotID,
                                    inovexPID: inoautoUmid.PartNumber,
                                    inovexpkgQty: inoautoUmid.PackageQty,
                                    inovexSide: inoautoUmid.Side == TRANSACTION.Warehouse_Audit_Side.L.key ? TRANSACTION.Warehouse_Audit_Side.L.value : (inoautoUmid.Side == TRANSACTION.Warehouse_Audit_Side.R.key ? TRANSACTION.Warehouse_Audit_Side.R.value : "-"),
                                    fjtWh: isExistinAuto.TowerID,
                                    fjtSlot: isExistinAuto.SlotID,
                                    fjtPID: isExistinAuto.PartNumber,
                                    fjtpkgQty: isExistinAuto.PackageQty,
                                    fjtSide: isExistinAuto.Side == TRANSACTION.Warehouse_Audit_Side.L.key ? TRANSACTION.Warehouse_Audit_Side.L.value : (isExistinAuto.Side == TRANSACTION.Warehouse_Audit_Side.R.key ? TRANSACTION.Warehouse_Audit_Side.R.value : "-"),
                                    isSlotMismatch: inoautoUmid.SlotID != isExistinAuto.SlotID ? true : false,
                                    ispkgQtyMismatch: inoautoUmid.PackageQty != isExistinAuto.PackageQty ? true : false,
                                    isSideMismatch: inoautoUmid.Side != isExistinAuto.Side ? true : false,
                                    isPartMismatch: inoautoUmid.PartNumber != isExistinAuto.PartNumber ? true : false,
                                    ledColorCssClass: vm.promptColorDetails.ledColorCssClass,
                                    ledColorName: vm.promptColorDetails.ledColorName,
                                    status: TRANSACTION.AUDITPAGE.ErrorStatus.Mismatched,
                                    isTransfer: true
                                }
                            } else {
                                objUMID = {
                                    uid: inoautoUmid.UID,
                                    inovexWh: inoautoUmid.TowerID,
                                    inovexSlot: inoautoUmid.SlotID,
                                    inovexPID: inoautoUmid.PartNumber,
                                    inovexpkgQty: inoautoUmid.PackageQty,
                                    inovexSide: inoautoUmid.Side == TRANSACTION.Warehouse_Audit_Side.L.key ? TRANSACTION.Warehouse_Audit_Side.L.value : (inoautoUmid.Side == TRANSACTION.Warehouse_Audit_Side.R.key ? TRANSACTION.Warehouse_Audit_Side.R.value : "-"),
                                    fjtWh: "-",
                                    fjtSlot: "-",
                                    fjtPID: "-",
                                    fjtpkgQty: "-",
                                    fjtSide: "-",
                                    status: TRANSACTION.AUDITPAGE.ErrorStatus.NotInFJT,
                                    ledColorCssClass: vm.promptColorDetails.ledColorCssClass,
                                    ledColorName: vm.promptColorDetails.ledColorName,
                                    isTransfer: false
                                }
                            }
                            vm.umIDList.push(objUMID);
                        }
                    });
                    let filterUMIDs = _.orderBy(_.filter(vm.umIDList, (item) => { return item.status == TRANSACTION.AUDITPAGE.ErrorStatus.OK }), ['fjtWh', 'fjtSlot'], ['asc', 'asc']);
                    let filternotMatchUMIDs = _.orderBy(_.filter(vm.umIDList, (item) => { return item.status != TRANSACTION.AUDITPAGE.ErrorStatus.OK }), ['fjtWh', 'fjtSlot'], ['asc', 'asc']);
                    vm.umIDList = [];
                    vm.umIDList.push.apply(vm.umIDList, filternotMatchUMIDs);
                    vm.umIDList.push.apply(vm.umIDList, filterUMIDs);
                    if (vm.umIDList.length == 0) {
                        let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.CART_EMPTY);
                        messageContent.message = stringFormat(messageContent.message, vm.ScanWH);
                        var model = {
                            messageContent: messageContent,
                            multiple: true
                        };
                        DialogFactory.messageAlertDialog(model, commonCancelFunction);
                        return;
                    } else {
                        vm.checkforFilter();
                        vm.auditAllRecords = vm.umIDList.length;
                        vm.auditMismatchedRecords = _.filter(vm.umIDList, (umids) => { return umids.status != TRANSACTION.AUDITPAGE.ErrorStatus.OK }).length;
                        vm.auditMatchedRecords = _.filter(vm.umIDList, (umids) => { return umids.status == TRANSACTION.AUDITPAGE.ErrorStatus.OK }).length;
                    }
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            }
        }
        vm.checkforFilter = () => {
            if (vm.isShowAll == vm.AuditFilter[0].id) {
                vm.filteUmidList = angular.copy(vm.umIDList);
            } else if (vm.isShowAll == vm.AuditFilter[1].id) {
                vm.filteUmidList = _.filter(vm.umIDList, (umids) => { return umids.status != TRANSACTION.AUDITPAGE.ErrorStatus.OK });
            } else if (vm.isShowAll == vm.AuditFilter[2].id) {
                vm.filteUmidList = _.filter(vm.umIDList, (umids) => { return umids.status == TRANSACTION.AUDITPAGE.ErrorStatus.OK });
            }
        }
        //cancel Request for search by umid
        vm.cancelSearch = () => {
            vm.showStatus = false;
            vm.clickButton = false;
            vm.request = false;
            cancelRequest();
        }

        function cancelRequest() {
            if (vm.transactionID) {
                var objTrans = {
                    TransactionID: vm.transactionID,
                    ReasonCode: CORE.InoAuto_Error_ReasonCode.CancelTask.Code,
                    ReasonMessage: CORE.InoAuto_Error_ReasonCode.CancelTask.Message
                }
                WarehouseBinFactory.sendRequestToCancelCartRequest().query(objTrans).$promise.then((response) => {
                    if (response.status == "FAILED") {
                        commonCancelFunction();
                    }
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            } else {
                commonCancelFunction();
            }
        }

        function commonCancelFunction() {
            vm.showStatus = false;
            vm.transactionID = null;
            vm.clickButton = false;
            vm.request = false;
        }

        //received details for cancel request
        function updateCancelRequestStatus(req) {
            if (req.transactionID == vm.transactionID && !vm.open) {
                cancelRequestAlert(req);
            }
        }
        //cancel request
        function cancelRequestAlert(req) {
            commonCancelFunction();
            vm.open = true;
            var model = {
                title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
                textContent: req.message,
                multiple: true
            };
            DialogFactory.alertDialog(model, callbackCancel);
            return;
        }
        function callbackCancel() {
            vm.open = false;
            vm.umIDList = [];
            vm.filteUmidList = [];
        }

        //open pop-up to transfer bin of UMID
        vm.transferInTransitUMID = (row, ev) => {
            var data = {
                uid: row.uid,
                updateStock: false
            };
            DialogFactory.dialogService(
                TRANSACTION.UID_TRANSFER_CONTROLLER,
                TRANSACTION.UID_TRANSFER_VIEW,
                ev,
                data).then((res) => {
                }, (transfer) => {
                }, (err) => {
                    return BaseService.getErrorLog(err);
                });
        }

        // Update UMID Records
        let removeUMIDStatus = $rootScope.$on(PRICING.EventName.RemoveUMIDFrmList, function (name, data) {
            //remove from filter list
            var umidStatus = _.find(vm.filteUmidList, (item) => { return item.uid == data.UID });
            if (umidStatus) {
                vm.filteUmidList.splice(vm.filteUmidList.indexOf(umidStatus), 1);
            }
            //remove from actual list
            var actualUmidStatus = _.find(vm.umIDList, (item) => { return item.uid == data.UID });
            if (actualUmidStatus) {
                vm.umIDList.splice(vm.umIDList.indexOf(umidStatus), 1);
            }

        });
    }
})();
