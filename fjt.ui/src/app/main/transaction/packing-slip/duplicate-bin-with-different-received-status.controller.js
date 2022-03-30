(function () {
    'use strict';

    angular
        .module('app.transaction.receivingmaterial')
        .controller('DuplicateBinWithDiffReceivedStatusController', DuplicateBinWithDiffReceivedStatusController);

    /** @ngInject */
    function DuplicateBinWithDiffReceivedStatusController($mdDialog, CORE, data, BinFactory, PackingSlipFactory, BaseService, $timeout, DialogFactory) {
        const vm = this;
        vm.messageConstant = CORE.MESSAGE_CONSTANT;
        vm.labelConstant = CORE.LabelConstant;
        vm.messageContent = data.messageContent || null;
        vm.lineDetails = data.lineDetails || null;
        vm.saveBtnDisableFlag = false;

        vm.saveData = () => {
            if (!(vm.packingSlip && vm.packingSlip.binID)) {
                setFocus('binName');
                return;
            }
            vm.saveBtnDisableFlag = true;
            if (vm.lineDetails.id) {
                vm.cgBusyLoading = PackingSlipFactory.savePackingSlipBinDetails().query({
                    binID: vm.packingSlip.binID,
                    warehouseID: vm.packingSlip.warehouseID,
                    parentWarehouseID: vm.packingSlip.parentWarehouseID,
                    id: vm.lineDetails.id
                }).$promise.then((response) => {
                    if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                        vm.saveBtnDisableFlag = false;
                        $mdDialog.hide({
                            binID: vm.packingSlip.binID,
                            bin: vm.packingSlip.bin,
                            warehouseID: vm.packingSlip.warehouseID,
                            warehouse: vm.packingSlip.warehouse,
                            parentWarehouseID: vm.packingSlip.parentWarehouseID,
                            parentWarehouse: vm.packingSlip.parentWarehouse
                        });
                    } else {
                        vm.saveBtnDisableFlag = false;
                    }
                }).catch((error) => {
                    vm.saveBtnDisableFlag = false;
                    return BaseService.getErrorLog(error);
                });
            } else {
                vm.saveBtnDisableFlag = false;
                $mdDialog.hide({
                    binID: vm.packingSlip.binID,
                    bin: vm.packingSlip.bin,
                    warehouseID: vm.packingSlip.warehouseID,
                    warehouse: vm.packingSlip.warehouse,
                    parentWarehouseID: vm.packingSlip.parentWarehouseID,
                    parentWarehouse: vm.packingSlip.parentWarehouse
                });
            }
        };

        vm.scanBin = ($event, isEnter) => {
            $timeout(() => {
                if (isEnter) {
                    if ($event.keyCode === 13) {
                        $event.preventDefault();
                        $event.stopPropagation();
                        if (vm.packingSlip && vm.packingSlip.bin) {
                            // change focus from bin field for calling ng-blur event and fired bin related validations
                            setFocusByName('saveBtn');
                        }
                    }
                } else {
                    if (vm.packingSlip && vm.packingSlip.bin) {
                        vm.packingSlip.binID = null;
                        BinFactory.getBinDetailByName().query({
                            name: vm.packingSlip.bin
                        }).$promise.then((response) => {
                            if (response && response.data) {
                                if (response.data.warehousemst && response.data.warehousemst.parentWarehouseMst) {
                                    vm.packingSlip.binID = response.data.id;
                                    vm.packingSlip.bin = response.data.Name;
                                    vm.packingSlip.warehouseID = response.data.warehousemst.id;
                                    vm.packingSlip.warehouse = response.data.warehousemst.Name;
                                    vm.packingSlip.parentWarehouseID = response.data.warehousemst.parentWarehouseMst.id;
                                    vm.packingSlip.parentWarehouse = response.data.warehousemst.parentWarehouseMst.Name;

                                    PackingSlipFactory.checkDuplicateParentWarehouseExists().query({
                                        refPackingSlipMaterialRecID: vm.lineDetails.refPackingSlipMaterialRecID,
                                        parentWarehouseID: vm.packingSlip.parentWarehouseID,
                                        id: vm.lineDetails.id || null
                                    }).$promise.then((response) => {
                                        if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data) {
                                            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_ALLOW_DIFFRENT_DEPARTMENT_FOR_PACKINGSLIP);
                                            messageContent.message = stringFormat(messageContent.message, response.data.parentWarehouse.Name, vm.packingSlip.bin, vm.packingSlip.parentWarehouse);
                                            return DialogFactory.messageAlertDialog({ messageContent }).then((yes) => {
                                                if (yes) {
                                                    vm.packingSlip = null;
                                                    setFocus('binName');
                                                }
                                            }, () => { });
                                        }
                                    }).catch((error) => BaseService.getErrorLog(error));
                                }
                            } else {
                                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SCAN_VALID_BIN);
                                return DialogFactory.messageAlertDialog({ messageContent }).then((yes) => {
                                    if (yes) {
                                        vm.packingSlip = null;
                                        setFocus('binName');
                                    }
                                }, () => { });
                            }
                        }).catch((error) => BaseService.getErrorLog(error));
                    } else {
                        vm.packingSlip = null;
                    }
                }
            });
            /** Prevent enter key submit event */
            preventInputEnterKeyEvent($event);
        };

        vm.goToBinList = () => BaseService.goToBinList();
        vm.goToWHList = () => BaseService.goToWHList();
        vm.cancel = () => $mdDialog.cancel();
    }
})();
