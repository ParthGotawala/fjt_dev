(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('ShippingExportControlAssemblyPopUpController', ShippingExportControlAssemblyPopUpController);

  function ShippingExportControlAssemblyPopUpController($mdDialog, $timeout, $state, CORE, USER, DialogFactory,
    BaseService, $scope, data, TRANSACTION) {
    const vm = this;
    vm.CORE = CORE;
    //vm.data = angular.copy(data);
    vm.data = data;
    vm.allLabelConstant = CORE.LabelConstant;
    vm.limit = 5;
    vm.empty = CORE.EMPTYSTATE.EMPTY_SEARCH;
    vm.EmptyMesssagePO = angular.copy(TRANSACTION.TRANSACTION_EMPTYSTATE.PO_ASSEMBLY);

    // Assembly
    vm.goToAssemblyList = () => {
      BaseService.goToPartList();
      return false;
    };
    vm.goToAssemblyDetails = () => {
      BaseService.goToComponentDetailTab(null, vm.data.partID);
      return false;
    };

    vm.queryAssemblyList = {
      order: '',
      assembly_search: '',
      limit: 5,
      page: 1,
      isPagination: vm.ispagination === undefined ? CORE.isPagination : vm.ispagination
    };

    //redirect to work order list
    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
      return false;
    };
    //redirect to work order details
    vm.goToWorkorderDetails = () => {
      BaseService.goToWorkorderDetails(vm.data.woID);
      return false;
    };

    //redirect to customer packing slip
    vm.goToCustomerPackingSlipList = () => {
      BaseService.goToCustomerPackingSlipList();
      return;
    };

    //redirect to manage customer packing slip
    vm.goToManageCustomerPackingSlip = () => {
      BaseService.goToManageCustomerPackingSlip(vm.data.customerPackingID, vm.data.salesOrderID || 0);
      return;
    };

    //redirect to sales order list
    vm.goToSalesOrderList = () => {
      BaseService.goToSalesOrderList();
      return;
    };

    //redirect to manage salesorder
    vm.goToManageSalesOrder = () => {
      BaseService.goToManageSalesOrder(vm.data.salesOrderID);
      return;
    };

    // Go to customer invoice list
    vm.goToCustomerInvoiceList = () => {
      BaseService.goToCustomerInvoiceList();
    };

    //go to manage customer invoice
    vm.goToManageCustomerInvoice = () => {
      BaseService.goToManageCustomerInvoice(vm.data.invoiceId);
    };

    vm.headerdata = [];
    if (vm.data.iscustompacking) {
      vm.headerdata.push({
        label: CORE.LabelConstant.CustomerPackingSlip.CustomerPackingSlipNumber,
        value: vm.data.CustomerPackingSlipNumber,
        labelLinkFn: vm.goToCustomerPackingSlipList,
        valueLinkFn: vm.goToManageCustomerPackingSlip,
        displayOrder: 1
      }, {
        label: CORE.LabelConstant.SalesOrder.SO,
        value: vm.data.salesOrderNumber,
        isCopy: true,
        labelLinkFn: vm.goToSalesOrderList,
        valueLinkFn: vm.data.salesOrderID ? vm.goToManageSalesOrder : null,
        displayOrder: 2
      }, {
        label: CORE.LabelConstant.SalesOrder.Revision,
        value: vm.data.revision,
        displayOrder: 3
      });
    } else if (vm.data.transType === CORE.TRANSACTION_TYPE.INVOICE) {
      vm.headerdata.push({
        label: CORE.LabelConstant.CustomerPackingInvoice.CustomerInvoiceNumber,
        value: vm.data.invoiceNumber,
        labelLinkFn: vm.goToCustomerInvoiceList,
        valueLinkFn: vm.goToManageCustomerInvoice,
        displayOrder: 1
      });
    } else {
      vm.headerdata.push({
        label: CORE.LabelConstant.SalesOrder.SO,
        value: vm.data.salesOrderNumber,
        displayOrder: 1,
        isCopy: true,
        labelLinkFn: vm.goToSalesOrderList,
        valueLinkFn: vm.data.salesOrderID ? vm.goToManageSalesOrder : null
      }, {
        label: CORE.LabelConstant.SalesOrder.Revision,
        value: vm.data.revision,
        displayOrder: 2
      });

      vm.headerdata.push({
        label: CORE.LabelConstant.Workorder.WO,
        value: vm.data.woNumber,
        displayOrder: 1,
        labelLinkFn: vm.goToWorkorderList,
        valueLinkFn: vm.goToWorkorderDetails
      }, {
        label: CORE.LabelConstant.Workorder.Version,
        value: vm.data.woVersion,
        displayOrder: 2
      });
    };

    vm.headerdata.push({
      label: vm.data.isFromRelLine ? 'Shipping Country': 'Header Shipping Country',
      value: vm.data.countryName,
      displayOrder: 3
    });

    vm.nonExportControlAssyList = angular.copy(vm.data.assyList) || [];
    // search po assembly list
    vm.searchAssembly = (item) => {
      if (item) {
        let searchTxt = '';
        searchTxt = angular.copy(item).toLowerCase();
        vm.nonExportControlAssyList = _.filter(vm.data.assyList, (assyDetails) => (assyDetails && assyDetails.PIDCode && assyDetails.PIDCode.toLowerCase().indexOf(searchTxt) !== -1)
          || (assyDetails && assyDetails.mfgPN && assyDetails.mfgPN.toLowerCase().indexOf(searchTxt) !== -1)
          || (assyDetails && assyDetails.nickName && assyDetails.nickName.toLowerCase().indexOf(searchTxt) !== -1)
          || (assyDetails && assyDetails.description && assyDetails.description.toLowerCase().indexOf(searchTxt) !== -1)
          || (assyDetails && assyDetails.countryName && assyDetails.countryName.toLowerCase().indexOf(searchTxt) !== -1)
        );
      }
      else {
        vm.nonExportControlAssyList = vm.data.assyList;
      }
    };

    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
