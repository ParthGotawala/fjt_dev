//(function () {
//    'use strict';

//    angular
//        .module('app.admin')
//        .controller('UserConfirmPasswordPopupController', UserConfirmPasswordPopupController);

//    /** @ngInject */
//    function UserConfirmPasswordPopupController($mdDialog, data, TRAVELER, WorkorderOperationFactory, CORE) {
//        const vm = this;
//        vm.data = data;
//        vm.UserPasswordPattern = CORE.UserPasswordPattern;
//        vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
//        vm.cancel = () => {
//            $mdDialog.cancel();
//        };

//        vm.ConfirmPassowrd = (ev) => {
//            $mdDialog.hide(CORE.ApiResponseTypeStatus.SUCCESS);
//        }
//    }
//})();