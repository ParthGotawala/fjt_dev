(function () {
  'use strict';

  angular
    .module('app.transaction.kitAllocation')
    .controller('KitAllocationFeasibilityPopUpController', KitAllocationFeasibilityPopUpController);

  function KitAllocationFeasibilityPopUpController($scope, $mdDialog, $filter, CORE, BaseService, data, USER, KitAllocationFactory) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = CORE.LabelConstant;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.kitAllocationFeasibilityModel = {};
    vm.kitAllocationFeasibilityDetail = data || {};
    if (vm.kitAllocationFeasibilityDetail && vm.kitAllocationFeasibilityDetail.salesOrderDetail && vm.kitAllocationFeasibilityDetail.salesOrderDetail.salesOrderDetail) {
      vm.kitAllocationFeasibilityDetail.salesOrderDetail.salesOrderDetail.isCallFromFeasibility = true;
    }
    vm.selectedAssyId = vm.kitAllocationFeasibilityDetail.salesOrderDetail.assyID;
    vm.isConsolidate = vm.kitAllocationFeasibilityDetail.salesOrderDetail.isConsolidated;
    vm.packagingAlias = true;
    vm.mountingTypeId = vm.kitAllocationFeasibilityDetail.feasibilityLineDetail ? vm.kitAllocationFeasibilityDetail.feasibilityLineDetail.mountingTypeID : null;

    vm.goToSalesOrderList = () => {
      BaseService.goToSalesOrderList();
      return false;
    };

    vm.goToManageSalesOrder = () => {
      BaseService.goToManageSalesOrder(vm.kitAllocationFeasibilityDetail.salesOrderDetail.salesOrderDetail.soId);
      return false;
    };

    vm.goToAssyMaster = () => {
        BaseService.goToComponentDetailTab(null, vm.kitAllocationFeasibilityDetail.salesOrderDetail.assyID);
      return false;
    };

    vm.goToAssy = () => {
        BaseService.goToPartList();
      return false;
    };

    vm.headerdata = [
      {
        label: vm.LabelConstant.SalesOrder.PO,
        value: vm.kitAllocationFeasibilityDetail.salesOrderDetail.salesOrderDetail.poNumber,
        displayOrder: 1,
        labelLinkFn: vm.goToSalesOrderList,
        valueLinkFn: vm.goToManageSalesOrder
      },
      {
        label: vm.LabelConstant.SalesOrder.SO,
        value: vm.kitAllocationFeasibilityDetail.salesOrderDetail.salesOrderDetail.soNumber,
        displayOrder: 2,
        labelLinkFn: vm.goToSalesOrderList,
        valueLinkFn: vm.goToManageSalesOrder
      },
      {
        label: CORE.LabelConstant.Assembly.PIDCode,
        value: vm.kitAllocationFeasibilityDetail.salesOrderDetail.salesOrderDetail.SubAssyId ? vm.kitAllocationFeasibilityDetail.salesOrderDetail.salesOrderDetail.SubAssyPIDCode : vm.kitAllocationFeasibilityDetail.salesOrderDetail.salesOrderDetail.assyPIDCode,
        displayOrder: 3,
        labelLinkFn: vm.goToAssy,
        valueLinkFn: vm.goToAssyMaster,
        isCopy: true,
        imgParms: {
          imgPath: vm.rohsImagePath + vm.kitAllocationFeasibilityDetail.salesOrderDetail.salesOrderDetail.rohsIcon,
          imgDetail: vm.kitAllocationFeasibilityDetail.salesOrderDetail.salesOrderDetail.rohs
        },
      },
      {
        label: CORE.LabelConstant.Assembly.Assy,
        value: vm.kitAllocationFeasibilityDetail.salesOrderDetail.salesOrderDetail.SubAssyId ? vm.kitAllocationFeasibilityDetail.salesOrderDetail.salesOrderDetail.SubAssy : vm.kitAllocationFeasibilityDetail.salesOrderDetail.salesOrderDetail.assyName,
        displayOrder: 4,
        labelLinkFn: vm.goToAssy,
        valueLinkFn: vm.goToAssyMaster,
        isCopy: true,
        imgParms: {
          imgPath: vm.rohsImagePath + vm.kitAllocationFeasibilityDetail.salesOrderDetail.salesOrderDetail.rohsIcon,
          imgDetail: vm.kitAllocationFeasibilityDetail.salesOrderDetail.salesOrderDetail.rohs
        },
      },
      {
        label: 'Build Feasibility Qty',
        value: $filter('numberWithoutDecimal')(vm.kitAllocationFeasibilityDetail.salesOrderDetail.salesOrderDetail.feasibilityKitQty),
        displayOrder: 5
      }];

    let kitAllocationAssyList = () => {
      if (vm.kitAllocationFeasibilityDetail && vm.kitAllocationFeasibilityDetail.salesOrderDetail && vm.kitAllocationFeasibilityDetail.salesOrderDetail.refSalesOrderDetID) {
        vm.cgBusyLoading = KitAllocationFactory.kitAllocationAssyList().query({ id: vm.kitAllocationFeasibilityDetail.salesOrderDetail.refSalesOrderDetID }).$promise.then((response) => {
          let assyList = response.data;
          let findAssy = _.find(assyList, (data) => { return data.partId == vm.selectedAssyId });
          if (findAssy) {
            vm.assemblyDetail = {
              partId: findAssy.partId,
              level: findAssy.bomAssyLevel,
              pIDCode: findAssy.kit_allocation_component.PIDCode,
              mfgPN: findAssy.kit_allocation_component.mfgPN,
              kitQty: findAssy.totalAssyBuildQty,
              kitRohsIcon: stringFormat("{0}{1}", vm.rohsImagePath, findAssy.kit_allocation_component.rfq_rohsmst.rohsIcon),
              kitRohsName: findAssy.kit_allocation_component.rfq_rohsmst.name
            };
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
    }

    if (!vm.isConsolidate) {
      kitAllocationAssyList();
    }

    vm.changePackagingAlias = () => {
      $scope.$broadcast('KitAllocationPackagingAlias', vm.packagingAlias);
    }

    vm.cancel = () => {
      vm.kitAllocationFeasibilityDetail.salesOrderDetail.salesOrderDetail.isCallFromFeasibility = false;
      $mdDialog.cancel();
    };
  }
})();
