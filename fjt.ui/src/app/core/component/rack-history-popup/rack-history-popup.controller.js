(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('RackHistoryPopupController', RackHistoryPopupController);

  /** @ngInject */
  function RackHistoryPopupController($mdDialog, TravelersFactory, $timeout, CORE, USER, data, BaseService, DialogFactory, $scope) {
    const vm = this;
    vm.LabelConstant = CORE.LabelConstant;
    vm.rackObj = data || {};
    vm.rackStatus = CORE.productStatus;
    vm.rackID = vm.rackObj.rackID;
    vm.rackHist = {};
    if (vm.rackID)
      vm.scanRackDisable = true;
    vm.cancel = () => {
        $mdDialog.cancel();
    };
    //go to workorder pafge list
    vm.gotoWOlist = () => {
      BaseService.goToWorkorderList();
    }
    //go to workorder manage page
    vm.manageWoPage = () => {
      BaseService.goToWorkorderDetails(vm.rackObj.woID);
    }
    //manage workorder operation
    vm.manageWorkorderOperation = () => {
      BaseService.goToWorkorderOperationDetails(vm.rackObj.woOPID);
    }
    //go to workorder operation
    vm.workorderOperation = () => {
      BaseService.goToWorkorderOperations(vm.rackObj.woID);
    }
    //link to go for part master list page
    vm.goToPartList = () => {
      BaseService.goToPartList();
    }
    //go to part master
    vm.goToPartMaster = () => {
        BaseService.goToComponentDetailTab(null, vm.rackObj.partID);
    }
    //rack master detail
    vm.gotoRack = () => {
      BaseService.goToRackList();
    }
    bindHeaderData();
    function bindHeaderData() {
      vm.headerdata = [];
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
          imgPath: vm.rackObj.PIDCode ? stringFormat("{0}{1}{2}", CORE.WEB_URL, USER.ROHS_BASE_PATH, vm.rackObj.rohsIcon) : null,
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
        valueLinkFn: vm.manageWoPage,
      }, {
        label: vm.LabelConstant.Workorder.Version,
        value: vm.rackObj.woVersion,
        displayOrder: 3,
      }, {
        label: vm.LabelConstant.Operation.OP,
        value: vm.rackObj.opNumber ? stringFormat("({0}) {1}", vm.rackObj.opNumber.toFixed(3), vm.rackObj.opName) : null,
        displayOrder: 4,
        labelLinkFn: vm.workorderOperation,
        valueLinkFn: vm.manageWorkorderOperation
      },
        {
          label: vm.LabelConstant.Operation.Version,
          value: vm.rackObj.opVersion,
          displayOrder: 5,
        },
        {
          label: vm.LabelConstant.RACK_MST.Rack,
          value: vm.rackObj.rackName,
          displayOrder: 6,
          labelLinkFn: vm.gotoRack,
        }
      );
    }


    //scan rack detail
    vm.scanRackLabel = (ev) => {
      $timeout(function () {
        if (ev.keyCode == 13) {
          objScan.pRackNumber = vm.rackHist.racknumber;
          if (objScan.pRackNumber)
            vm.scanRackDet();
        }
      }, true);
      /** Prevent enter key submit event */
      preventInputEnterKeyEvent(ev);
    }

    let objScan = {
    };
    //scan to clear details
    vm.scanRackDet = () => {
      vm.cgBusyLoading = TravelersFactory.scanRackforHistory().query({
        objScan: objScan
      }).$promise.then((response) => {
        if (response && response.data && response.data.scanRack) {
          let scanDetail = response.data.scanRack[0];
          if (scanDetail.statusCode != CORE.API_RESPONSE_CODE.SUCCESS) {
            alertScanRack(scanDetail.errorText);
          } else {
            vm.rackID = scanDetail.rackID;
            $timeout(() => { $scope.$broadcast(CORE.EventName.refreshinoutGrid, vm.rackHist.racknumber); }, true);
            focusonScanRack();
          }
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    //let alert detail for scan rack
    let alertScanRack = (errorText) => {
      let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.INCOMIG_VALIDATION);
      messageContent.message = errorText;
      var model = {
        messageContent: messageContent,
        multiple: false
      };
      return DialogFactory.messageAlertDialog(model).then((yes) => {
        if (yes) {
          focusonScanRack();
        }
      }).catch((error) => {
      });
    }

    //focus on scan rack material
    let focusonScanRack = () => {
      let objScan = document.getElementById('racknumber');
      if (objScan) {
        $timeout(() => { objScan.focus(); });
      }
    }
    //clear rack detail
    vm.clearRack = () => {
      vm.rackHist.racknumber = null;
      vm.rackID = null;
      $timeout(() => { $scope.$broadcast(CORE.EventName.refreshinoutGrid); }, true);
      vm.RackHistory.$setPristine();
      focusonScanRack();
    }
    //max length validation check
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    }
    //change scan detail
    vm.changeDetail = (rack) => {
      if (!rack) {
        vm.rackID = null;
        $timeout(() => { $scope.$broadcast(CORE.EventName.refreshinoutGrid); }, true);
        vm.RackHistory.$setPristine();
        focusonScanRack();
      }
    }
    //rack master detail
    vm.gotoRack = () => {
      BaseService.goToRackList();
    }
    //on load submit form
    angular.element(() => {
      if (vm.rackObj.rackName) {
        vm.rackHist = { racknumber: vm.rackObj.rackName }
        objScan.pRackNumber = vm.rackHist.racknumber;
      }
    });
  }
})();
