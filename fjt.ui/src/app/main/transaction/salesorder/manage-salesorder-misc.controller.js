
(function () {
  'use strict';

  angular
    .module('app.transaction.salesorder')
    .controller('ManageSalesOrderMISCController', ManageSalesOrderMISCController);

  /** @ngInject */
  function ManageSalesOrderMISCController($state, CORE, BaseService, DataElementTransactionValueFactory, $scope, SalesOrderFactory, $q) {
    // console.log("Employee controller");
    const vm = this;
    vm.Entity = CORE.Entity.Salesorder;
    vm.id = parseInt($state.params.sID);
    vm.dataElementList = [];
    vm.entityID = CORE.AllEntityIDS.SalesOrder.ID;
    vm.fileList = {};
    if ($scope.$parent && $scope.$parent.vm) {
      $scope.$parent.vm.activeTab = 2;
    }
    //save other detail for customer packing
    vm.saveOtherDeatils = () => {
      if (BaseService.focusRequiredField(vm.SalesOrderOtherDetail)) {
        return;
      }
      const dynamicControlList = DataElementTransactionValueFactory.getDataElementTransactionList(vm.dataElementList);
      DataElementTransactionValueFactory.saveTransctionValue({
        referenceTransID: vm.id,
        entityID: vm.entityID,
        dataElementList: dynamicControlList.dataElementList,
        removeElementList: dynamicControlList.removeElementList,
        subFormTransList: dynamicControlList.subFormTransList,
        deletedsubFormTransIDs: dynamicControlList.deletedsubFormTransIDs,
        removeSubFormTransListConditional: dynamicControlList.removeSubFormTransListConditional
      }, vm.fileList).then(() => {
        // Display success message of each field if assigned on validation options
        DataElementTransactionValueFactory.displaySuccessMessage(dynamicControlList.dataElementList);
        vm.SalesOrderOtherDetail.$setPristine();
        vm.fileList = {};
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //get sales Order details
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
    //page load then it will add forms in page forms
    angular.element(() => {
      BaseService.currentPageForms = [vm.SalesOrderOtherDetail];
      $scope.$parent.vm.frmSalesOrder = vm.SalesOrderOtherDetail;
      $scope.$parent.vm.saveSalesOrder = vm.saveOtherDeatils;
    });
  }
})();
