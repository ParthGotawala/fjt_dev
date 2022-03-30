(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('ViewOtherChargesWithSODetailPopupController', ViewOtherChargesWithSODetailPopupController);

  function ViewOtherChargesWithSODetailPopupController($mdDialog, CORE,
    BaseService, data, USER) {
    const vm = this;
    vm.CORE = CORE;
    vm.data = data;
    vm.allLabelConstant = CORE.LabelConstant;
    vm.BOM_REQUIRE_FIRST = CORE.MESSAGE_CONSTANT.BOM_REQUIRE_FIRST;
    vm.assyID = data.assyID;
    vm.assyNumber = vm.data.mfgPN;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.subAssy = CORE.PartCategory.SubAssembly;
    //link to go for part master list page
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };
    //go to part master
    vm.goToPartMaster = () => {
        BaseService.goToComponentDetailTab(null, vm.data.partID);
    };

    // go to sales order master
    vm.goToSalesOrderMaster = () => {
      BaseService.goToManageSalesOrder(vm.data.salesOrderID);
    };

    // go to sales order list page
    vm.goTosalesOrderList = () => {
      BaseService.goToSalesOrderList();
    };

    vm.queryAssemblyList = {
      order: '',
      assembly_search: '',
      limit: 5,
      page: 1,
      isPagination: vm.ispagination === undefined ? CORE.isPagination : vm.ispagination
    };

    vm.headerdata = [];
    vm.headerdata.push({
      label: 'Qty',
      value: vm.data.qty,
      displayOrder: 4
    }, {
      label: vm.data.partType === vm.subAssy ? CORE.LabelConstant.Assembly.PIDCode : CORE.LabelConstant.MFG.PID,
      value: vm.assyID,
      displayOrder: 3,
      labelLinkFn: vm.goToPartList,
      valueLinkFn: vm.goToPartMaster,
      isCopy: true,
      isCopyAheadLabel: true,
      isAssy: vm.data.partType === vm.subAssy,
      imgParms: {
        imgPath: stringFormat('{0}{1}', vm.rohsImagePath, vm.data.rohsIcon),
        imgDetail: vm.data.rohsName
      },
      isCopyAheadOtherThanValue: true,
      copyAheadLabel: vm.data.partType === vm.subAssy ? CORE.LabelConstant.Assembly.MFGPN : CORE.LabelConstant.MFG.MFGPN,
      copyAheadValue: vm.data.mfgPN
    }, {
      label: 'PO Line#',
      value: vm.data.custPOLineID,
      displayOrder: 5
    },
      {
        label: 'Release Line#',
        value: vm.data.releaseNumber,
        displayOrder: 5
      },
      {
        label: CORE.LabelConstant.SalesOrder.SO,
        value: vm.data.soNumber,
        labelLinkFn: vm.goTosalesOrderList,
        valueLinkFn: vm.goToSalesOrderMaster,
        displayOrder: 1
      },
      {
        label: CORE.LabelConstant.SalesOrder.PO,
        value: vm.data.poNumber,
        labelLinkFn: vm.goTosalesOrderList,
        valueLinkFn: vm.goToSalesOrderMaster,
        displayOrder: 2
      });

    vm.soOtherChargeslist = angular.copy(vm.data.assyList) || [];
    vm.cancel = (isyes) => {
      $mdDialog.cancel(isyes);
    };

    vm.goToPartMaster = (partID) => {
        BaseService.goToComponentDetailTab(null, partID);
      return false;
    };
  }
})();
