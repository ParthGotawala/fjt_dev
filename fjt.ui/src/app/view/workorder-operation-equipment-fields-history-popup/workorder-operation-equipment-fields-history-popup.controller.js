(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('WorkorderOperationEquipmentFieldsHistoryPopupController', WorkorderOperationEquipmentFieldsHistoryPopupController);

    /** @ngInject */
    function WorkorderOperationEquipmentFieldsHistoryPopupController($mdDialog, data, CORE) {
        const vm = this;
        vm.data = data;
        if (!vm.data) {
            vm.cancel();
        }
        vm.woOpCustomDetails = {};
        let eqpMake = vm.data.equipment.eqpMake ? '(' + vm.data.equipment.eqpMake : '-';
        let eqpModel = vm.data.equipment.eqpModel ? '|' + vm.data.equipment.eqpModel : '-';
        let eqpYear = vm.data.equipment.eqpYear ? '|' + vm.data.equipment.eqpYear + ')' : '-';
        vm.woOpCustomDetails = {
            woNumber: vm.data.woNumber,
            woVersion: vm.data.woVersion,
            opFullName: operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, vm.data.opData.opName, vm.data.opData.opNumber),
            eqipmentFullName: vm.data.equipment.assetName + ' ' + eqpMake + eqpModel + eqpYear
        }
        vm.cancel = () => {
            $mdDialog.cancel();
        };
    }
})();