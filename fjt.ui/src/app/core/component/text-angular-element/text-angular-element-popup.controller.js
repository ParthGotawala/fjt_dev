(function () {
  'use strict';

  angular.module('app.core')
    .controller('TextAngularElementPopupController', TextAngularElementPopupController);

  /* @ngInject */
  function TextAngularElementPopupController($mdDialog, data, CORE, USER, BaseService) {
    var vm = this;
    vm.labelConstant = CORE.LabelConstant;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.taToolbar = CORE.Toolbar;
    vm.taModel = {
      title: data.title,
      data: data.data,
      isRequired: data.isRequired,
      isDisabled: data.isDisabled || false
    };

    vm.submitForm = function () {
      $mdDialog.hide(vm.taModel.data);
    }


    //go to manage part number
    vm.goToAssyMaster = () => {
        BaseService.goToComponentDetailTab(null, vm.data.partID);
      return false;
    }
    //go to assy list 
    vm.goToAssyList = () => {
        BaseService.goToPartList();
      return false;
    }
    // go to customer
    vm.goToCustomer = () => {
      BaseService.goToCustomer(vm.data.customerID);
      return false;
    }
    //redirect to customer list 
    vm.goToCustomerList = () => {
      BaseService.goToCustomerList();
      return false;
    }

    if (data.isHeaderDisplay) {
      vm.data = data;
      vm.headerdata = [];
      vm.headerdata.push({
        label: vm.labelConstant.Assembly.QuoteGroup,
        value: vm.data.QuoteGroup,
        displayOrder: 1,
        labelLinkFn: null,
        valueLinkFn: null,
        valueLinkFnParams: null,
        isCopy: false,
        copyParams: null,
        imgParms: null
      }, {
        label: vm.labelConstant.Customer.Customer,
        value: vm.data.Customer,
        displayOrder: 1,
        labelLinkFn: vm.goToCustomerList,
        valueLinkFn: vm.goToCustomer,
        valueLinkFnParams: null,
        isCopy: false,
        copyParams: null,
        imgParms: null
      }, {
        label: vm.labelConstant.Assembly.ID,
        value: vm.data.PIDCode,
        displayOrder: 1,
        labelLinkFn: vm.goToAssyList,
        valueLinkFn: vm.goToAssyMaster,
        valueLinkFnParams: null,
        isCopy: true,
        isCopyAheadLabel: false,
        isAssy: true,
        imgParms: {
          imgPath: vm.rohsImagePath + vm.data.rohsIcon,
          imgDetail: vm.data.rohsName
        }
      }, {
        label: vm.labelConstant.Assembly.MFGPN,
        value: vm.data.mfgPN,
        displayOrder: 1,
        labelLinkFn: vm.goToAssyList,
        valueLinkFn: vm.goToAssyMaster,
        valueLinkFnParams: null,
        isCopy: true,
        isCopyAheadLabel: false,
        isAssy: true,
        imgParms: {
          imgPath: vm.rohsImagePath + vm.data.rohsIcon,
          imgDetail: vm.data.rohsName
        }
      });
    }

    vm.cancel = function () {
      $mdDialog.cancel();
    }
  }
})();
