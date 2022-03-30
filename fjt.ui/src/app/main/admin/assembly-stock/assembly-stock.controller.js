
(function () {
  'use strict';

  angular
    .module('app.admin.assemblyStock')
    .controller('AssemblyStockController', AssemblyStockController);

  /** @ngInject */
  function AssemblyStockController($scope, $state, USER, DialogFactory, BaseService) {
    var vm = this;
    vm.isNoDataFound = false;
    /*Add/Update Assembly Stock*/
    vm.addEditAssemblyStock = (data, ev) => {
      DialogFactory.dialogService(
        USER.ADMIN_ASSEMBLYSTOCK_UPDATE_MODAL_CONTROLLER,
        USER.ADMIN_ASSEMBLYSTOCK_UPDATE_MODAL_VIEW,
        ev,
        data).then(() => {
          $scope.$broadcast(USER.AssemblyStockListReloadBroadcast, null);
          //broadcast grid reload
          //BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
        }, (err) => {
          return BaseService.getErrorLog(err);
        });
    };
  }
})();
