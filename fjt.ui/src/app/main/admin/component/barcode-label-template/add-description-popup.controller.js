(function () {
    'use strict';

    angular
        .module('app.admin.barcode-label-template')
        .controller('BarcodeDelimiterDescriptionController', BarcodeDelimiterDescriptionController);

    /** @ngInject */
    function BarcodeDelimiterDescriptionController($timeout, $mdDialog, data,$state, USER, CORE, BaseService, DialogFactory, BarcodeLabelTemplateFactory) {
        var vm = this;
        vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
        vm.taToolbar = CORE.Toolbar;

        if (data) {
            vm.BarcodeTemplateModel = data;
        }

        vm.cancel = (data, isOk) => {
            if (!isOk) {
                let isdirty = vm.checkFormDirty(vm.AddDescriptionForm);
                if (isdirty) {
                    BaseService.showWithoutSavingAlertForPopUp();
                } else {
                    $mdDialog.cancel();
                }
            } else {
                $mdDialog.cancel();
            }
        };

        vm.checkFormDirty = (form, columnName) => {
            let checkDirty = BaseService.checkFormDirty(form, columnName);
            return checkDirty;
        };

        vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
            return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
        }
    }

})();