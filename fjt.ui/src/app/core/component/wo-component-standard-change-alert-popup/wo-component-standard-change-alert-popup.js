(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('WOComponentStandardChangeAlertPopupController', WOComponentStandardChangeAlertPopupController);

  /** @ngInject */
  function WOComponentStandardChangeAlertPopupController($mdDialog, data, CORE, USER, BaseService) {
    const vm = this;
    vm.selectedItems = [];
    vm.componentDetails = data.componentDetails;
    vm.workorderDetails = data.workorderDetails;
    vm.DeletedStandardComponent = data.DeletedStandardComponent;
    vm.RFQDetails = data.RFQDetails;
    vm.woComponentStandardChangeMsg = CORE.MESSAGE_CONSTANT.WO_COMPONENT_STANDARD_CHANGE_MSG;
    vm.deleteStandardChangeMsg = CORE.MESSAGE_CONSTANT.DELETE_STANDARD_CHANGE_MSG;
    vm.woAllLabelConstant = CORE.LabelConstant.Workorder;
    vm.assyAllLabelConstant = CORE.LabelConstant.Assembly;
    vm.DateFormatArray = _dateDisplayFormat;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.selectedAllOldStandards = data.selectedAllOldStandards;
    vm.selectedAllNewStandards = data.selectedAllNewStandards;
    /*get wo status*/
    vm.getWoStatus = (statusID) => BaseService.getWoStatus(statusID);
    vm.getWoStatusClassName = (statusID) => BaseService.getWoStatusClassName(statusID);

    /* set wo status labelname and its class */
    if (vm.workorderDetails && vm.workorderDetails.WOListContainSamePartID && vm.workorderDetails.WOListContainSamePartID.length > 0) {
      _.each(vm.workorderDetails.WOListContainSamePartID, (item) => {
        item.statusClassName = vm.getWoStatusClassName(item.woSubStatus);
        item.statusTxt = vm.getWoStatus(item.woSubStatus);
      });
    }
    // Assembly
    vm.goToAssemblyList = () => {
        BaseService.goToPartList();
      return false;
    };
    vm.goToAssemblyDetails = (data) => {
        BaseService.goToComponentDetailTab(null, data.partID);
      return false;
    };

    //redirect to work order list
    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
      return false;
    };

    //redirect to work order detail page
    vm.goToWorkorderDetails = (woID) => {
      BaseService.goToWorkorderDetails(woID);
      return false;
    };

    vm.headerdata = [];

    vm.headerdata.push({
      label: vm.woAllLabelConstant.WO,
      value: angular.copy(vm.workorderDetails.woNumber),
      displayOrder: 1,
      labelLinkFn: vm.goToWorkorderList,
      valueLinkFn: vm.goToWorkorderDetails,
      valueLinkFnParams: vm.workorderDetails.woID
    }, {
      label: vm.woAllLabelConstant.Version,
      value: angular.copy(vm.workorderDetails.woVersion),
      displayOrder: 2
    }, {
      label: vm.assyAllLabelConstant.PIDCode,
      value: angular.copy(vm.componentDetails.PIDCode),
      displayOrder: 3,
      labelLinkFn: vm.goToAssemblyList,
      valueLinkFn: vm.goToAssemblyDetails,
      valueLinkFnParams: { partID: vm.componentDetails.id },
      isCopy: true,
      isCopyAheadLabel: true,
      isCopyAheadOtherThanValue: true,
      copyAheadLabel: vm.assyAllLabelConstant.MFGPN,
      copyAheadValue: vm.componentDetails.mfgPN,
      imgParms: {
        imgPath: vm.rohsImagePath + vm.componentDetails.rohsIcon,
        imgDetail: vm.componentDetails.rohsStatus
      }
    }, {
      label: vm.assyAllLabelConstant.NickName,
      value: angular.copy(vm.componentDetails.nickName),
      displayOrder: 4
    }, {
      label: 'Quote Group#',
      value: angular.copy(vm.RFQDetails.rfqFormsID),
      displayOrder: 5
    });


    /* flex setting based on data */
    if (vm.componentDetails.isCalledFromComponentPage) {
      if (vm.RFQDetails.RFQListContainSamePartID.length > 0 && vm.workorderDetails.WOListContainSamePartID.length > 0) {
        vm.mdDialogFlex = 80;
        vm.componentDivFlex = 0;
        vm.woDivFlex = 55;
        vm.rfqDivFlex = 45;
      }
      else {
        vm.mdDialogFlex = 55;
        vm.componentDivFlex = 0;
        vm.woDivFlex = 100;
        vm.rfqDivFlex = 100;
      }
    }
    else {
      if (vm.RFQDetails.RFQListContainSamePartID.length > 0 && vm.workorderDetails.WOListContainSamePartID.length > 0) {
        vm.mdDialogFlex = 95;
        vm.componentDivFlex = 35;
        vm.woDivFlex = 37;
        vm.rfqDivFlex = 28;
      }
      else if (vm.RFQDetails.RFQListContainSamePartID.length === 0 && vm.workorderDetails.WOListContainSamePartID.length === 0) {
        vm.mdDialogFlex = 55;
        vm.componentDivFlex = 100;
        vm.woDivFlex = 0;
        vm.rfqDivFlex = 0;
      }
      else {
        vm.mdDialogFlex = 80;
        vm.componentDivFlex = 50;
        vm.woDivFlex = 50;
        vm.rfqDivFlex = 50;
      }
    }

    vm.applyStandard = () => {
      $mdDialog.hide(true);
    };
    vm.cancel = () => {
      $mdDialog.cancel();
    };

    vm.goToRFQDetails = (rfqID, rfqAssyID) => {
      BaseService.goToRFQUpdate(rfqID, rfqAssyID);
      return false;
    };
  }
})();
