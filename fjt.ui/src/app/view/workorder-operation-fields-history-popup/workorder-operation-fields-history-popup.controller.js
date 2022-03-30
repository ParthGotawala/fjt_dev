(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('WorkorderOperationFieldsHistoryPopupController', WorkorderOperationFieldsHistoryPopupController);

    /** @ngInject */
    function WorkorderOperationFieldsHistoryPopupController($mdDialog, data, CORE) {
        const vm = this;
        vm.data = data;
        if (!vm.data) {
            vm.cancel();
        }
        vm.woOpCustomDetails = {};
        vm.woOpCustomDetails = {
            woNumber: vm.data.woNumber,
            woVersion: vm.data.woVersion,
            opFullName: operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, vm.data.opData.opName, vm.data.opData.opNumber)
        }

        vm.cancel = () => {
            $mdDialog.cancel();
        };
    }
})();