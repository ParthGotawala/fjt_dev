(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('WOComponentRoHSChangeAlertPopupController', WOComponentRoHSChangeAlertPopupController);

  /** @ngInject */
  function WOComponentRoHSChangeAlertPopupController($mdDialog, data, CORE, USER, BaseService) {
    const vm = this;
    vm.LabelConstant = CORE.LabelConstant;
    vm.selectedItems = [];
    vm.componentDetails = data.componentDetails;
    vm.workorderDetails = data.workorderDetails;
    vm.RFQDetails = data.RFQDetails;
    vm.woComponentRoHSChangeMsg = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.WO_COMPONENT_ROHS_CHANGE_MSG.message;
    vm.woAllLabelConstant = vm.LabelConstant.Workorder;
    vm.assyAllLabelConstant = vm.LabelConstant.Assembly;
    vm.DateFormatArray = _dateDisplayFormat;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.selectedOldRoHS = data.selectedOldRoHS;
    vm.selectedNewRoHS = data.selectedNewRoHS;

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
    vm.goToAssemblyDetails = (item) => {
        BaseService.goToComponentDetailTab(null, item.partID);
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

    // go to RFQ details
    vm.goToRFQDetails = (rfqID, rfqAssyID) => {
      BaseService.goToRFQUpdate(rfqID, rfqAssyID);
      return false;
    };

    vm.headerdata = [];

    vm.headerdata.push(
      {
        label: vm.assyAllLabelConstant.PIDCode,
        value: angular.copy(vm.componentDetails.PIDCode),
        displayOrder: 2,
        labelLinkFn: vm.goToAssemblyList,
        valueLinkFn: vm.goToAssemblyDetails,
        valueLinkFnParams: { partID: vm.componentDetails.id },
        isCopy: true,
        isCopyAheadLabel: true,
        isCopyAheadOtherThanValue: true,
        copyAheadLabel: vm.assyAllLabelConstant.MFGPN,
        copyAheadValue: vm.componentDetails.mfgPN,
        imgParms: {
          imgPath: vm.componentDetails.rohsIcon,
          imgDetail: vm.componentDetails.rohsStatus
        }
      }, {
      label: vm.assyAllLabelConstant.NickName,
      value: angular.copy(vm.componentDetails.nickName),
      displayOrder: 2
    }
    );

    /* flex setting based on data */
    if (vm.RFQDetails && vm.RFQDetails.RFQListContainSamePartID && vm.RFQDetails.RFQListContainSamePartID.length > 0 &&
      vm.workorderDetails && vm.workorderDetails.WOListContainSamePartID && vm.workorderDetails.WOListContainSamePartID.length > 0) {
      vm.mdDialogFlex = 80;
      vm.woDivFlex = 55;
      vm.rfqDivFlex = 45;
    }
    else {
      vm.mdDialogFlex = 55;
      vm.woDivFlex = 100;
      vm.rfqDivFlex = 100;
    }

    vm.applyRoHS = () => {
      $mdDialog.hide(true);
    };
    vm.cancel = () => {
      $mdDialog.cancel();
    };

    /* open Rohs list page */
    vm.goToRoHSStatusList = () => {
      BaseService.openInNew(USER.ADMIN_ROHS_STATE, {});
    };
  }
})();
