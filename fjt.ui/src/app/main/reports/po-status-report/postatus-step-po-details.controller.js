(function () {
  'use strict';

  angular
    .module('app.reports.postatusreport')
    .controller('POStatusStepPODetailsController', POStatusStepPODetailsController);

  /** @ngInject */
  function POStatusStepPODetailsController(CORE, BaseService, SalesOrderFactory, $stateParams, USER, REPORTS) {
    const vm = this;
    vm.emptySearch = CORE.EMPTYSTATE.EMPTY_SEARCH;
    if (!$stateParams || !$stateParams.customerID || !$stateParams.salesOrderID) {
      return;
    }

    let customerID = $stateParams.customerID;
    let salesOrderID = $stateParams.salesOrderID;
    vm.allLabelConstant = CORE.LabelConstant;
    vm.debounceConstant = CORE.Debounce;
    //vm.customerwisePOAssyDetails = null;
    vm.defaultDateFormat = _dateDisplayFormat;
    let rohsFolderPath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.poWiseAssyList = [];
    vm.CommonEmptyMessage = {
      IMAGEURL: REPORTS.REPORTS_EMPTYSTATE.NoRecordFound.IMAGEURL,
      MESSAGE: stringFormat(REPORTS.REPORTS_EMPTYSTATE.NoRecordFound.MESSAGE, 'sales order assembly')
    };

    vm.selectedItems = [];
    vm.query = {
      order: '',
      search: '',
    };
    vm.limit = 300;

    /* get sales order list with sales/purchase order and assembly details */
    let retrieveCustomerSOwisePOAssyList = () => {
      vm.cgBusyLoading = SalesOrderFactory.getCustomerSOwisePOAssyList().save({
        customerID: customerID,
        salesOrderID: salesOrderID
      }).$promise.then((res) => {
        if (res && res.data && res.data.poWiseAssyList && res.data.poWiseAssyList.length > 0) {
          vm.poWiseAssyList = res.data.poWiseAssyList;
          _.each(vm.poWiseAssyList, (poAssyItem) => {
            poAssyItem.displayRohsIcon = rohsFolderPath + poAssyItem.RohsIcon;
          });
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    retrieveCustomerSOwisePOAssyList();

    /* to refresh data */
    vm.refreshPODetails = () => {
      retrieveCustomerSOwisePOAssyList();
    }

    //hyperlink go for sales order list page
    vm.goToSalesOrderList = () => {
      BaseService.goToSalesOrderList();
    };

    //redirect to salesorder details
    vm.goToManageSalesOrder = (salesOrderMstID) => {
      BaseService.goToManageSalesOrder(salesOrderMstID);
      return false;
    }

  }
})();
