(function () {
    'use strict';

    angular
        .module('app.admin.employee')
        .controller('EmpStandardChangeAlertPopupController', EmpStandardChangeAlertPopupController);

    /** @ngInject */
    function EmpStandardChangeAlertPopupController($mdDialog, data, CORE) {
        const vm = this;
        vm.empStandardChangeMsg = CORE.MESSAGE_CONSTANT.EMP_STANDARD_CHANGE_MSG;
        vm.selectedAllOldStandards = data.selectedAllOldStandards;
        vm.selectedAllNewStandards = data.selectedAllNewStandards;
        vm.headerdata = [];
        vm.headerdata.push({
            label: CORE.MainTitle.Employee,
            value: data.employeeName,
            displayOrder: 1
        });

        vm.applyStandard = () => {
            $mdDialog.hide(true);
        }
        vm.cancel = () => {
            $mdDialog.cancel();
        };

    }
})();