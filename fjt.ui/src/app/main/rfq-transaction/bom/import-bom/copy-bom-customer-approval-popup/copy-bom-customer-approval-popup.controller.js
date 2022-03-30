(function () {
    'use strict';

    angular
        .module('app.rfqtransaction')
        .controller('CopyBOMCustomerApprovalPopupController', CopyBOMCustomerApprovalPopupController);

    /** @ngInject */
    function CopyBOMCustomerApprovalPopupController($mdDialog, CORE, RFQTRANSACTION, USER, data, BaseService, DialogFactory, ComponentFactory) {

        const vm = this;
        vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
        vm.COPY_BOM_CONFIRMATION_TEXT = RFQTRANSACTION.BOM.COPY_BOM_CONFIRMATION_TEXT;
        vm.COPY_RFQ_CONFIRMATION_TEXT = RFQTRANSACTION.BOM.COPY_RFQ_CONFIRMATION_TEXT;
        vm.titleNotes = data.isBOM ? vm.COPY_BOM_CONFIRMATION_TEXT : vm.COPY_RFQ_CONFIRMATION_TEXT;
        vm.comment = null;
        vm.LabelConstant = CORE.LabelConstant;
        vm.save = () => {
            if (vm.customerApprovalForm.$invalid) {
                BaseService.focusRequiredField(vm.customerApprovalForm);
                return;
            }
            $mdDialog.hide(vm.comment);
        }

        vm.cancel = () => {
            let isdirty = vm.checkFormDirty(vm.customerApprovalForm);
            if (isdirty) {
                BaseService.showWithoutSavingAlertForPopUp();
            } else {
                $mdDialog.cancel();
            }
        };

        vm.checkFormDirty = (form, columnName) => {
            let checkDirty = BaseService.checkFormDirty(form, columnName);
            return checkDirty;
        }

        /* called for max length validation */
        vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
            return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
        }
    }

})();