(function () {
    'use strict';

    angular
        .module('app.transaction.warehousebin')
        .controller('ManageWarehouseController', ManageWarehouseController);

    /** @ngInject */
    function ManageWarehouseController($mdDialog,data) {
        const vm = this;
        vm.data = {};
        vm.data = angular.copy(data);
        vm.cancelDialog = (data) => {
            $mdDialog.cancel(data);
        };
    }
})();
