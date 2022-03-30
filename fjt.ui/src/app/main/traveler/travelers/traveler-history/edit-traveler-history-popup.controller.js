(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('EditTravelerHistoryPopupController', EditTravelerHistoryPopupController);

    /** @ngInject */
    function EditTravelerHistoryPopupController($mdDialog, $timeout, data, TravelersFactory, CORE, TRAVELER, DialogFactory) {
        const vm = this;
        vm.data = data;
        vm.data.data.checkoutSetupTime = vm.data.data.checkoutSetupTime == 0 ? secondsToTime(vm.data.data.checkoutSetupTime) : (vm.data.data.checkoutSetupTime ? secondsToTime(vm.data.data.checkoutSetupTime) : null);
        vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
        vm.OperationTimePattern = CORE.OperationTimePattern;
        vm.OperationTimeMask = CORE.OperationTimeMask;
        vm.taToolbar = CORE.Toolbar;
        vm.cancel = (data) => {
            $mdDialog.cancel(data);
        };
        vm.UpdateData = () => {
            let qty = parseInt(vm.data.data.qty || 0);
            let repairQty = parseInt(vm.data.data.repairQty || 0);
            let scrapQty = parseInt(vm.data.data.scrapQty || 0);
            let passQty = parseInt(vm.data.data.passQty || 0)
            if ((repairQty + scrapQty + passQty) > qty) {
                DialogFactory.alertDialog({ title: CORE.MESSAGE_CONSTANT.ALERT_HEADER, textContent: TRAVELER.QTY_VALIDATION_ERROR, multiple: true });
                return;
            }
            const opHistory = {
                woTransID: vm.data.data.woTransID,
                woTransinoutID: vm.data.data.woTransinoutID,
                qty: vm.data.data.qty,
                remark: vm.data.data.remark,
                status: vm.data.data.status,
                statusBy: vm.data.data.statusBy,
                checkinTime: vm.data.data.checkinTime,
                checkoutTime: vm.data.data.checkoutTime,
                checkoutSetupTime: vm.data.data.checkoutSetupTime ? timeToSeconds(vm.data.data.checkoutSetupTime) : null,
                scrapQty: vm.data.data.scrapQty == 0 ? vm.data.data.scrapQty : (vm.data.data.scrapQty ? vm.data.data.scrapQty : null),
                repairQty: vm.data.data.repairQty == 0 ? vm.data.data.repairQty : (vm.data.data.repairQty ? vm.data.data.repairQty : null),
                passQty: vm.data.data.passQty == 0 ? vm.data.data.passQty : (vm.data.data.passQty ? vm.data.data.passQty : null),
                woID: vm.data.data.woID,
                opID: vm.data.data.opID,
                isUpdate: true
            }
            if (vm.data.data.woTransID) {
            }
        }

        let checkTime = (i) => {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }

        vm.setPassQty = () => {
            if (vm.data.data.qty) {
                vm.data.passQty = parseInt(vm.data.data.qty || 0) - (parseInt(vm.data.repairQty || 0) + parseInt(vm.data.scrapQty || 0));
            }
        }
    }
})();