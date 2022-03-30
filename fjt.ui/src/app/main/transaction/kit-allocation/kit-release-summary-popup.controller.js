(function () {
  'use strict';

  angular
    .module('app.transaction.kitAllocation')
    .controller('KitReleaseSummaryPopUpController', KitReleaseSummaryPopUpController);

  /** @ngInject */
  function KitReleaseSummaryPopUpController($mdDialog, $filter, BaseService, USER, CORE, data, KitAllocationFactory) {
    const vm = this;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH
    vm.kitDetail = data;
    vm.kitDetail.inputQty = vm.kitDetail.salesOrderDetail.kitQty;

    vm.query = {
      order: ''
    };
    vm.feasibilityList = [];

    vm.goToSalesOrderList = () => {
      BaseService.goToSalesOrderList();
      return false;
    };

    vm.goToManageSalesOrder = () => {
      BaseService.goToManageSalesOrder(vm.kitDetail.salesOrderDetail.soId);
      return false;
    };

    vm.goToAssyMaster = () => {
        BaseService.goToComponentDetailTab(null, vm.kitDetail.assyID);
      return false;
    };

    vm.goToAssy = () => {
        BaseService.goToPartList();
      return false;
    };

    vm.headerdata = [{
      label: 'PO#',
      value: vm.kitDetail.salesOrderDetail.poNumber,
      displayOrder: 1,
      labelLinkFn: vm.goToSalesOrderList,
      valueLinkFn: vm.goToManageSalesOrder
    },
    {
      label: 'SO#',
      value: vm.kitDetail.salesOrderDetail.soNumber,
      displayOrder: 2,
      labelLinkFn: vm.goToSalesOrderList,
      valueLinkFn: vm.goToManageSalesOrder
    },
    {
      label: CORE.LabelConstant.Assembly.PIDCode,
      value: vm.kitDetail.salesOrderDetail.SubAssy || vm.kitDetail.salesOrderDetail.assyName,
      displayOrder: 3,
      labelLinkFn: vm.goToAssy,
      valueLinkFn: vm.goToAssyMaster,
      isCopy: true,
      imgParms: {
        imgPath: vm.rohsImagePath + vm.kitDetail.salesOrderDetail.rohsIcon,
        imgDetail: vm.kitDetail.salesOrderDetail.rohs
      },
    },
    {
      label: 'Kit Qty',
      value: $filter('numberWithoutDecimal')(vm.kitDetail.salesOrderDetail.kitQty),
      displayOrder: 4
      }];

    vm.getKitReleaseDetail = () => {
      vm.cgBusyLoading = KitAllocationFactory.getKitFeasibility().query(vm.kitDetail).$promise.then((response) => {
        if (response.data) {
          vm.feasibilityList = response.data;
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };

    vm.getKitReleaseDetail();

    vm.cancel = () => {
      $mdDialog.cancel();
    };

  }
})();
