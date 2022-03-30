(function () {
    'use strict';

    angular
        .module('app.transaction.receivingmaterial')
        .controller('ReceivingMaterialListController', ReceivingMaterialListController);

    /** @ngInject */
    function ReceivingMaterialListController($mdDialog, $state, BaseService, $scope, CORE) {
        const vm = this;
        $scope.$parent.vm.selectedNavItem = CORE.ReceivingMatirialTab.List.Name;
        $scope.$parent.vm.currentState = $state.current.name;

    }
})();