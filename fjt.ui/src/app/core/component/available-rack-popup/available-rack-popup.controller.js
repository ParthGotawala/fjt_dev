(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('AvailableRackPopupController', AvailableRackPopupController);

  /** @ngInject */
  function AvailableRackPopupController($mdDialog, CORE, USER, data, BaseService) {
    const vm = this;
    vm.LabelConstant = CORE.LabelConstant;
    vm.rackObj = data || {};
    vm.opname = stringFormat('({0}) {1}', vm.rackObj.opNumber ? vm.rackObj.opNumber.toFixed(3):null, vm.rackObj.opName);
    vm.cancel = () => {
      $mdDialog.cancel();
    };
    //go to workorder pafge list
    vm.gotoWOlist = () => {
      BaseService.goToWorkorderList();
    };
    //go to workorder manage page
    vm.manageWoPage = () => {
      BaseService.goToWorkorderDetails(vm.rackObj.woID);
    };
    //manage workorder operation
    vm.manageWorkorderOperation = () => {
      BaseService.goToWorkorderOperationDetails(vm.rackObj.woOPID);
    };
    //go to workorder operation
    vm.workorderOperation = () => {
      BaseService.goToWorkorderOperations(vm.rackObj.woID);
    };
    //link to go for part master list page
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };
    //go to part master
    vm.goToPartMaster = () => {
        BaseService.goToComponentDetailTab(null, vm.rackObj.partID);
    };
    bindHeaderData();
    function bindHeaderData() {
      // code added to check  passed rohsIcon have path data included or not
      const rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
      vm.headerdata = [];
      if (vm.rackObj && vm.rackObj.rohsIcon && (!vm.rackObj.rohsIcon.toString().startsWith(rohsImagePath))) {
        vm.rackObj.rohsIcon = rohsImagePath + vm.rackObj.rohsIcon;
      }
      vm.headerdata.push({
        label: vm.LabelConstant.MFG.AssyID,
        value: vm.rackObj.PIDCode,
        displayOrder: 1,
        labelLinkFn: vm.goToPartList,
        valueLinkFn: vm.goToPartMaster,
        isCopy: true,
        isCopyAheadLabel: true,
        isAssy: true,
        imgParms: {
          imgPath: vm.rackObj.rohsIcon, // stringFormat("{0}{1}{2}", CORE.WEB_URL, USER.ROHS_BASE_PATH, vm.rackObj.rohsIcon),
          imgDetail: vm.rackObj.rohsStatus
        },
        isCopyAheadOtherThanValue: true,
        copyAheadLabel: vm.LabelConstant.MFG.MFGPN,
        copyAheadValue: vm.rackObj.mfgPN
      }, {
        label: vm.LabelConstant.Workorder.WO,
        value: vm.rackObj.woNumber,
        displayOrder: 2,
        labelLinkFn: vm.gotoWOlist,
        valueLinkFn: vm.manageWoPage
      }, {
        label: vm.LabelConstant.Workorder.Version,
        value: vm.rackObj.woVersion,
        displayOrder: 3
      }, {
        label: vm.LabelConstant.Operation.OP,
        value: stringFormat('({0}) {1}', vm.rackObj.opNumber.toFixed(3), vm.rackObj.opName),
        displayOrder: 4,
        labelLinkFn: vm.workorderOperation,
        valueLinkFn: vm.manageWorkorderOperation
      },
        {
          label: vm.LabelConstant.Operation.Version,
          value: vm.rackObj.opVersion,
          displayOrder: 5
        }
      );
    }
  }
})();
