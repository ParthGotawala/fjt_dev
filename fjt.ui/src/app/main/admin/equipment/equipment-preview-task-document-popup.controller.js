(function () {
    'use strict';

    angular
        .module('app.admin.equipment')
        .controller('EquipmentPreviewTaskDocumentPopupController', EquipmentPreviewTaskDocumentPopupController);

    /** @ngInject */
    function EquipmentPreviewTaskDocumentPopupController($mdDialog, $mdSidenav, $log, data, CORE, EquipmentFactory, DialogFactory, $timeout, $scope, Upload, USER, EquipmentTaskFactory, BaseService) {
        const vm = this;
        vm.refTransID = data.eqpTaskID;
        vm.Equipment_Task = CORE.AllEntityIDS.Equipment_Task.Name;
        vm.Isprofile = data.Isprofile;
        vm.title = data.eqpTaskDescription ? data.eqpTaskDescription : null;
        vm.cancel = () => {
            $mdDialog.cancel(true);
        };
    }

})();