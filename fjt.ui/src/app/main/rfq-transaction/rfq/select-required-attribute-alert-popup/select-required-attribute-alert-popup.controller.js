(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .controller('RequireAttributeAlertPopupController', RequireAttributeAlertPopupController);

  /** @ngInject */
  function RequireAttributeAlertPopupController($mdDialog, CORE, USER, data, BaseService) {
    const vm = this;
    vm.dataList = [];
    vm.selectedDataList = [];
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE;
    vm.labelConstant = CORE.LabelConstant;

    vm.GotoList = () => {
      if (vm.isMountingType) {
        BaseService.goToMountingTypeList();
      } else if (vm.isFunctionalType) {
        BaseService.goToFunctionalTypeList();
      }
    };

    //go to manage part number
    vm.goToAssyMaster = () => {
        BaseService.goToComponentDetailTab(null, data.partID);
      return false;
    };
    //go to assy list
    vm.goToAssyList = () => {
        BaseService.goToPartList();
      return false;
    };
    // go to customer
    vm.goToCustomer = () => {
      BaseService.goToCustomer(data.customerID);
      return false;
    };
    //redirect to customer list
    vm.goToCustomerList = () => {
      BaseService.goToCustomerList();
      return false;
    };
    // close pop up
    vm.cancel = () => {
      $mdDialog.cancel();
    };
    if (data) {
      vm.oldSelectedValues = data.oldSelectedValues;
      vm.selectedValues = data.selectedValues;
      if (data.isMountingType) {
        vm.isMountingType = true;
      }
      if (data.isFunctionalType) {
        vm.isFunctionalType = true;
      }
      vm.headerdata = [];
      vm.headerdata.push({
        label: vm.labelConstant.Customer.Customer,
        value: data.customer,
        displayOrder: 1,
        labelLinkFn: vm.goToCustomerList,
        valueLinkFn: vm.goToCustomer,
        valueLinkFnParams: null,
        isCopy: false,
        copyParams: null,
        imgParms: null
      }, {
        label: vm.labelConstant.Assembly.ID,
        value: data.PIDCode,
        displayOrder: 1,
        labelLinkFn: vm.goToAssyList,
        valueLinkFn: vm.goToAssyMaster,
        valueLinkFnParams: null,
        isCopy: true,
        isCopyAheadLabel: false,
        isAssy: true,
        imgParms: {
          imgPath: data.RoHSIcon,
          imgDetail: data.rohsName
        }
      }, {
        label: vm.labelConstant.Assembly.MFGPN,
        value: data.mfgPN,
        displayOrder: 1,
        labelLinkFn: vm.goToAssyList,
        valueLinkFn: vm.goToAssyMaster,
        valueLinkFnParams: null,
        isCopy: true,
        isCopyAheadLabel: false,
        isAssy: true,
        imgParms: {
          imgPath: data.RoHSIcon,
          imgDetail: data.rohsName
        }
      });
    }
    // send selected list array back to parent controller
    vm.save = () => {
      $mdDialog.hide(vm.selectedDataList);
    };
  }
})();
