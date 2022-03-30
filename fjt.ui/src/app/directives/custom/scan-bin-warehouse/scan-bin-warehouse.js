(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('scanBinWarehouse', scanBinWarehouse);

    /** @ngInject */
    function scanBinWarehouse() {
        let directive = {
            restrict: 'E',
            scope: {
                toBinId: "="
            },
            templateUrl: 'app/directives/custom/scan-bin-warehouse/scan-bin-warehouse.html',
            controller: scanBinWareHouseCtrl,
            controllerAs: 'vm'
        };
        return directive;

        /** @ngInject */
        /**
        * Controller for time-line define before load directive
        *
        * @param
        */

        function scanBinWareHouseCtrl($scope, $q, $filter, $timeout, msApi, DialogFactory, TimelineFactory, BaseService, ReceivingMaterialFactory,
            CORE, TRANSACTION) {
            var vm = this;
            vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
            vm.uidTransfer = {};
            vm.isUIDDisable = false;
            vm.isWHBinDisable = false;
            vm.LabelConstant = CORE.LabelConstant;
            let WHBinData = {};
            //Reset scanned UMID
            vm.clearAll = () => {
                vm.uidTransfer.ScanWHBin = null;
                vm.isWHBinDisable = false;
                vm.uidTransfer.toWarehouse = null;
                vm.uidTransfer.toBin = null;
                vm.uidTransfer.toDepartment = null;

                vm.formUIDTransfer.$setPristine();
                vm.formUIDTransfer.$setUntouched();
                $timeout(function () {
                    let myEl = angular.element(document.querySelector('#ScanWHBin'));
                    myEl.focus();
                }, _configSecondTimeout);
            }

            //Scan warehouse/bin
            vm.scanWHBin = (e) => {
                $timeout(function () { scanWHBin(e) }, true);
            }

            vm.goToWHList = () => {
                BaseService.goToWHList();
            };

            vm.goToBinList = () => {
                BaseService.goToBinList();
            };

            let scanWHBin = (e) => {
                if (e.keyCode == 13 && vm.uidTransfer.ScanWHBin) {
                    vm.cgBusyLoading = ReceivingMaterialFactory.match_Warehouse_Bin().query({ name: vm.uidTransfer.ScanWHBin }).$promise.then((res) => {
                        if (res && res.data && res.data.responseMessage) {
                            vm.cgBusyLoading = false;
                            var model = {
                                title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
                                textContent: res.data.responseMessage,
                                multiple: true
                            };
                            return DialogFactory.alertDialog(model).then((yes) => {
                                if (yes) {
                                    vm.uidTransfer.ScanWHBin = null;
                                    let myEl = angular.element(document.querySelector('#ScanWHBin'));
                                    myEl.focus();
                                }
                            }, (cancel) => {

                            }).catch((error) => {
                                return BaseService.getErrorLog(error);
                            });
                        } else if (res && res.data) {
                            WHBinData = res.data;
                            $scope.toBinId = WHBinData.id;
                            vm.isWHBinDisable = true;
                            let typeScan = WHBinData && WHBinData.WarehouseID ? TRANSACTION.TypeWHBin.Bin : TRANSACTION.TypeWHBin.Warehouse;
                            if (typeScan == TRANSACTION.TypeWHBin.Bin) {
                                vm.uidTransfer.toWarehouse = WHBinData.warehousemst.Name;
                                vm.uidTransfer.toBin = WHBinData.Name;
                                vm.uidTransfer.toDepartment = WHBinData.warehousemst.parentWarehouseMst.Name;
                                setFocusByName('feederLocation');
                            } else {
                                WHBinData = {};
                                vm.isWHBinDisable = false;
                                vm.uidTransfer.ScanWHBin = null;
                                let myEl = angular.element(document.querySelector('#ScanWHBin'));
                                myEl.focus();
                            }

                        } else {
                            vm.cgBusyLoading = false;
                            var model = {
                                title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
                                textContent: TRANSACTION.SCAN_WH_BIN_NOT_FOUND,
                                multiple: true
                            };
                            return DialogFactory.alertDialog(model).then((yes) => {
                                if (yes) {
                                    vm.uidTransfer.ScanWHBin = null;
                                    let myEl = angular.element(document.querySelector('#ScanWHBin'));
                                    myEl.focus();
                                }
                            }, (cancel) => {

                            }).catch((error) => {
                                return BaseService.getErrorLog(error);
                            });
                        }
                    }).catch((error) => {
                        return BaseService.getErrorLog(error);
                    });
                }
            }
        }
    }
})();