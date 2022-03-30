(function () {
  'use strict';

  angular
    .module('app.admin.component')
    .controller('AddPackagingAliasPartPopupController', AddPackagingAliasPartPopupController);

  /** @ngInject */
  function AddPackagingAliasPartPopupController($scope, $q, $mdDialog, $timeout, CORE, USER, data, BaseService, DialogFactory, ComponentFactory, RFQSettingFactory, MasterFactory, AssyTypeFactory, ManageMFGCodePopupFactory) {
    const vm = this;
    vm.partDetail = data;
    vm.cid = (data && data.id) ? data.id : undefined;
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;

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
      BaseService.goToCustomer(vm.assyData.mfgcodeID);
      return false;
    };
    //redirect to customer list
    vm.goToCustomerList = () => {
      BaseService.goToCustomerList();
      return false;
    };

    vm.headerdata = [];
    vm.headerdata.push(
      {
        label: vm.LabelConstant.MFG.MFG,
        value: BaseService.getMfgCodeNameFormat(vm.partDetail.mfgCode, vm.partDetail.manufacturerName),
        displayOrder: 1,
        labelLinkFn: vm.goToCustomerList,
        valueLinkFn: vm.goToCustomer,
        valueLinkFnParams: null
      },
      {
        label: vm.LabelConstant.MFG.MFGPN,
        value: vm.partDetail.mfgPN,
        displayOrder: 1,
        labelLinkFn: vm.goToAssyList,
        valueLinkFn: vm.goToAssyMaster,
        valueLinkFnParams: vm.partDetail.id,
        isCopy: true,
        isAssy: true,
        imgParms: {
          imgPath: !vm.partDetail.rohsIcon.startsWith(vm.rohsImagePath) ? (vm.rohsImagePath + vm.partDetail.rohsIcon) : vm.partDetail.rohsIcon,
          imgDetail: vm.partDetail.rohsComplientConvertedValue
        }
      }
    );
    vm.checkFormDirty = (form, columnName) => BaseService.checkFormDirty(form, columnName);

    vm.addAlias = (ev) => {
      const passedDetail =
      {
        ev: ev,
        $mdDialog: $mdDialog
      };
      $scope.$broadcast('addPackagingAliasData', passedDetail);
    };
    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.AddPackagingAliasForm);
      if (isdirty) {
        const data = {
          form: vm.AddPackagingAliasForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm = [];
        $mdDialog.cancel();
      }
    };
  }
})();
