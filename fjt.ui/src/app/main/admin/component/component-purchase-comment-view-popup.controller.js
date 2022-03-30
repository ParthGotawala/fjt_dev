(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('ComponentPurchaseCommentViewPopupController', ComponentPurchaseCommentViewPopupController);

  /** @ngInject */
  function ComponentPurchaseCommentViewPopupController($scope, $mdDialog, data, CORE, USER, BaseService) {
    const vm = this;
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;

    vm.data = data;

    //go to manage part number
    vm.goToAssyMaster = (partID) => {
        BaseService.goToComponentDetailTab(null, partID);
      return false;
    };
    //go to assy list
    vm.goToAssyList = () => {
        BaseService.goToPartList();
      return false;
    };
    // go to customer
    vm.goToCustomer = () => {
      BaseService.goToCustomer(vm.data.mfgcodeID);
      return false;
    };
    //redirect to customer list
    vm.goToCustomerList = () => {
      BaseService.goToCustomerList();
      return false;
    };



    vm.headerdata = [];
    vm.headerdata.push({
      label: vm.LabelConstant.MFG.MFG,
      value: stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, vm.data.mfgCode, vm.data.manufacturerName),
      displayOrder: 1,
      labelLinkFn: vm.goToCustomerList,
      valueLinkFn: vm.goToCustomer,
      valueLinkFnParams: null
    }, {
      label: vm.LabelConstant.MFG.MFGPN,
      value: vm.data.mfgPN,
      displayOrder: 2,
      labelLinkFn: vm.goToAssyList,
      valueLinkFn: vm.goToAssyMaster,
      valueLinkFnParams: vm.data.id,
      isCopy: true,
      isAssy: true,
      imgParms: {
        imgPath: !vm.data.rohsIcon.startsWith(vm.rohsImagePath) ? (vm.rohsImagePath + vm.data.rohsIcon) : vm.data.rohsIcon,
        imgDetail: vm.data.rohsComplientConvertedValue
      }
    });
    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
