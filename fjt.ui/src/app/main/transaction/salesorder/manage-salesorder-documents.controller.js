
(function () {
  'use strict';

  angular
    .module('app.transaction.salesorder')
    .controller('ManageSalesOrderDocument', ManageSalesOrderDocument);

  /** @ngInject */
  function ManageSalesOrderDocument($state, CORE, SalesOrderFactory, BaseService, $scope, $q) {
    const vm = this;
    vm.id = parseInt($state.params.sID);
    vm.entityName = CORE.AllEntityIDS.SalesOrder.Name;
    //get sales order detail
    const getSalesOrderDetail = () => SalesOrderFactory.salesorder().query({
      id: vm.id,
      refTableName: CORE.TABLE_NAME.MFG_CODE_MST
    }).$promise.then((res) => {
      if (res && res.data) {
        vm.salesorder = res.data;
        if ($scope.$parent && $scope.$parent.vm) {
          $scope.$parent.vm.status = vm.salesorder.status;
        }
        $scope.$emit('SalesOrderAutocomplete');
      }
      return res;
    }).catch((error) => BaseService.getErrorLog(error));

    //get status of sales order
    const getSalesorderstatus = () => SalesOrderFactory.getSalesOrderStatus().query({ id: vm.id }).$promise.then((salesorder) => {
      if (salesorder && salesorder.data) {
        vm.usedWorkOrderList = salesorder.data.sowoList;
        vm.shippedAssembly = salesorder.data.soShipList;
        if (vm.shippedAssembly && vm.salesFilterDet && vm.salesFilterDet.length > 0 && vm.shippedAssembly.length === vm.salesFilterDet.length) {
          vm.isDisable = true;
        } else { vm.isDisable = false; }
        if (vm.salesOrderWorkStatus === CORE.SalesOrderDetStatus.COMPLETED) {
          vm.isDisable = true;
        } else { vm.isDisable = false; }
      }
      return salesorder;
    }).catch((error) => BaseService.getErrorLog(error));
    // get salesorder header status
    const getSalesOrderHeaderWorkingStatus = () => SalesOrderFactory.getSalesOrderHeaderWorkingStatus().query({ id: vm.id }).$promise.then((res) => {
      if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
        vm.salesOrderWorkStatus = res.data.SOWorkingStatus[0];
        getSalesorderstatus();
      }
      return res;
    }).catch((error) => BaseService.getErrorLog(error));

    const autocompletePromise = [getSalesOrderDetail(), getSalesOrderHeaderWorkingStatus()];
    vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
    }).catch((error) => BaseService.getErrorLog(error));

    if ($scope.$parent && $scope.$parent.vm) {
      $scope.$parent.vm.activeTab = 1;
    }
  }
})();
