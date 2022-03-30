(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('ViewAssemblyListWithoutBOOMPopUpController', ViewAssemblyListWithoutBOOMPopUpController);

  function ViewAssemblyListWithoutBOOMPopUpController($mdDialog, $timeout, $state, CORE, USER, DialogFactory,
    BaseService, $scope, data, WorkorderFactory, TRANSACTION) {
    const vm = this;
    vm.CORE = CORE;
    //vm.data = angular.copy(data);
    vm.data = data;
    vm.allLabelConstant = CORE.LabelConstant;
    vm.limit = 5;
    vm.empty = CORE.EMPTYSTATE.EMPTY_SEARCH;
    vm.BOM_REQUIRE_FIRST = CORE.MESSAGE_CONSTANT.BOM_REQUIRE_FIRST;
    vm.EmptyMesssagePO = angular.copy(TRANSACTION.TRANSACTION_EMPTYSTATE.PO_ASSEMBLY);

    // Assembly
    vm.goToAssemblyList = () => {
        BaseService.goToPartList();
      return false;
    }
    vm.goToAssemblyDetails = () => {
        BaseService.goToComponentDetailTab(null, vm.data.partID);
      return false;
    }

    vm.queryAssemblyList = {
      order: '',
      assembly_search: '',
      limit: 5,
      page: 1,
      isPagination: vm.ispagination == undefined ? CORE.isPagination : vm.ispagination,
    };

    //redirect to work order list
    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
      return false;
    }
    //redirect to work order details
    vm.goToWorkorderDetails = () => {
      BaseService.goToWorkorderDetails(data.woID);
      return false;
    }

    vm.headerdata = [];
    vm.headerdata.push({
      label: CORE.LabelConstant.SalesOrder.SO,
      value: data.salesOrderNumber,
      displayOrder: 1
    }, {
      label: CORE.LabelConstant.SalesOrder.Revision,
      value: data.revision,
      displayOrder: 2
    });
    vm.headerdata.push({
      label: CORE.LabelConstant.Workorder.WO,
      value: data.woNumber,
      displayOrder: 1,
      labelLinkFn: vm.goToWorkorderList,
      valueLinkFn: vm.goToWorkorderDetails
    }, {
      label: CORE.LabelConstant.Workorder.Version,
      value: data.woVersion,
      displayOrder: 2
    });

    vm.nomBOMAssyList = angular.copy(vm.data.assyList) || [];
    // search po assembly list
    vm.searchAssembly = (item) => {
      if (item) {
        let searchTxt = "";
        searchTxt = angular.copy(item).toLowerCase();
        vm.nomBOMAssyList = _.filter(vm.data.assyList, (assyDetails) => {
          return (assyDetails && assyDetails.PIDCode && assyDetails.PIDCode.toLowerCase().indexOf(searchTxt) != -1)
            || (assyDetails && assyDetails.mfgPN && assyDetails.mfgPN.toLowerCase().indexOf(searchTxt) != -1)
            || (assyDetails && assyDetails.nickName && assyDetails.nickName.toLowerCase().indexOf(searchTxt) != -1)
            || (assyDetails && assyDetails.description && assyDetails.description.toLowerCase().indexOf(searchTxt) != -1);
        });
      }
      else {
        vm.nomBOMAssyList = vm.data.assyList;
      }
    }

    vm.cancel = () => {
      $mdDialog.cancel();
    };

    vm.goToComponentBOM = (partID) => {
      BaseService.goToComponentBOM(partID);
      return false;
    }
  }
})();
