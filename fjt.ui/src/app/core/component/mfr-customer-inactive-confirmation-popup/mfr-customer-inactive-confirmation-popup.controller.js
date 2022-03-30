(function () {
    'use strict';
    angular
        .module('app.core')
        .controller('MFRCustomerInactiveConfirmationPopupController', MFRCustomerInactiveConfirmationPopupController);
    /** @ngInject */
    function MFRCustomerInactiveConfirmationPopupController($mdDialog, data, CORE) {
        const vm = this;

        vm.message = stringFormat(CORE.MESSAGE_CONSTANT.MFR_INACTIVE_PARTS_CONFIRMATION, data.mfgName, data.pageName, data.totalCount)
        vm.save = (whData) => {
            $mdDialog.cancel(whData);
        }
    };
})();