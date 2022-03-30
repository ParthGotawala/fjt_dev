(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('DuplicateConfirmationPopupController', DuplicateConfirmationPopupController);

    /** @ngInject */
    function DuplicateConfirmationPopupController($mdDialog, data, CORE, DialogFactory, BaseService) {
        const vm = this;
        vm.data = data;
        vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
        vm.cancel = () => {
            $mdDialog.cancel();
        };

        vm.SaveNew = () => {
            $mdDialog.cancel('AddNew');
        }


        vm.ActivateRecord = () => {
            let obj = {
                title: stringFormat(vm.CORE_MESSAGE_CONSTANT.ACTIVE_ALERT_MESSAGE)
            };
            DialogFactory.alertDialog(obj).then(() => {
                vm.cancel();
            }, (error) => {
                return BaseService.getErrorLog(error);
            });
        }
    }
})();