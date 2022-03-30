(function () {
  'use strict';

  angular
    .module('app.reports.postatusreport')
    .controller('POStatusStepCustomerController', POStatusStepCustomerController);

  /** @ngInject */
  function POStatusStepCustomerController(CORE, BaseService, SalesOrderFactory, $stateParams) {
    const vm = this;
    vm.emptySearch = CORE.EMPTYSTATE.EMPTY_SEARCH;
    if (!$stateParams || !$stateParams.customerID) {
      return;
    }

    let customerID = $stateParams.customerID;
    vm.DateFormat = _dateDisplayFormat;
    vm.allLabelConstant = CORE.LabelConstant;
    vm.debounceConstant = CORE.Debounce;
    vm.customerwisePOSODetails = null;

    vm.selectedItems = [];
    vm.query = {
      order: '',
      search: '',
    };
    vm.limit = 300;

    /* to get and display sales order status with color tag  */
    vm.getWoStatusClassName = (statusID) => {
      return BaseService.getWoStatusClassName(statusID);
    }

    /* to get and display sales order status   */
    vm.getWoStatus = (statusID) => {
      return BaseService.getWoStatus(statusID);
    }

    /*get sales order list with sales/purchase order */
    let retrieveCustomerwiseSOPOList = () => {
      vm.cgBusyLoading = SalesOrderFactory.getCustomerwiseSOPOList().save({
        customerID: customerID,
        refTableName: CORE.TABLE_NAME.MFG_CODE_MST
      }).$promise.then((salesorder) => {
        _.each(salesorder.data.salesordermst, (det) => {
          det.isLegacyPOText = det.isLegacyPO ? 'Yes' : 'No';
        });
        vm.customerwisePOSODetails = salesorder.data;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    retrieveCustomerwiseSOPOList();

    /* to refresh data */
    vm.refreshPODetails = () => {
      retrieveCustomerwiseSOPOList();
    }

    //redirect to salesorder details
    vm.goToManageSalesOrder = (salesOrderMstID) => {
      BaseService.goToManageSalesOrder(salesOrderMstID);
      return false;
    }

  }
})();
