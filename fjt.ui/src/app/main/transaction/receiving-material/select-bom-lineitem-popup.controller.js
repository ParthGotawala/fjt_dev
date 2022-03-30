(function () {
    'use strict';

    angular
        .module('app.transaction.receivingmaterial')
        .controller('SelectBOMLineItemPopUpController', SelectBOMLineItemPopUpController);

    function SelectBOMLineItemPopUpController($mdDialog, $timeout, $state, CORE, USER, DialogFactory, BaseService, $scope, data, ReceivingMaterialFactory) {
        const vm = this;
        vm.LabelConstant = CORE.LabelConstant;
        vm.objPart = data;
        vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
        let splitPart;
        if (vm.objPart && vm.objPart.fromCall == 'Scan') {
            splitPart = vm.objPart.mfgPart.split('+');
        }
        
        let mfrPNId = splitPart ? parseInt(splitPart[0]) : vm.objPart.mfgPart;
        let assyId = vm.objPart ? vm.objPart.assyId : null;
        let salesOrderDetailId = vm.objPart ? vm.objPart.salesOrderDetailId : null;
        vm.query = {
            order: ''
        };
        vm.isDisable = true;

        let getLineDetaillList = () => {
            vm.cgBusyLoading = ReceivingMaterialFactory.getBOMLineDetailForSameMFRPN().query({ mfrPNId: mfrPNId, sodid: salesOrderDetailId }).$promise.then((lineDetail) => {
                if (lineDetail.data) {
                    vm.lineItemList = lineDetail.data.lineItemList;
                    _.map(vm.lineItemList, (data) => {
                        data.mfrRohsIcon = stringFormat('{0}{1}', vm.rohsImagePath, data.mfrRohsIcon);
                        data.assyRohsIcon = stringFormat('{0}{1}', vm.rohsImagePath, data.assyRohsIcon);
                        data.isSelect = false;
                    });
                }
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        }

        getLineDetaillList();

        vm.selectPart = (item) => {
            if (item) {
                vm.isDisable = !item.isSelect;
                vm.selectedRow = item;
                _.map(vm.lineItemList, (data) => {
                    if (data.id != item.id) {
                        data.isSelect = false;
                    }
                });
            }
        }

        vm.confirmSelect = () => {
            $mdDialog.cancel(vm.selectedRow);
        }

        vm.cancel = () => {
            $mdDialog.cancel();
        };

    }
})();