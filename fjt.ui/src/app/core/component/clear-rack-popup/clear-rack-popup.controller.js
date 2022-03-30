(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('ClearRackPopupController', ClearRackPopupController);

  /** @ngInject */
  function ClearRackPopupController($mdDialog, TravelersFactory, $timeout, CORE, USER, data, BaseService, DialogFactory, $scope) {
    const vm = this;
    vm.LabelConstant = CORE.LabelConstant;
    vm.rackObj = data || {};
    vm.rackStatus = CORE.productStatus;
    vm.opname = stringFormat("({0}) {1}", vm.rackObj.opNumber.toFixed(3), vm.rackObj.opName);
    let objIsAdmin = _.find(BaseService.loginUser.roles, (item) => {
      return item.id == BaseService.loginUser.defaultLoginRoleID && item.name == CORE.Role.SuperAdmin
    });
    vm.clearRackDet = {};
    vm.cancel = () => {
      let isdirty = BaseService.checkFormDirty(vm.ClearForm);
      if (isdirty) {
        let data = {
          form: vm.ClearForm
        }
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };
    //go to workorder pafge list
    vm.gotoWOlist = () => {
      BaseService.goToWorkorderList();
    };
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
          imgPath: stringFormat("{0}{1}{2}", CORE.WEB_URL, USER.ROHS_BASE_PATH, vm.rackObj.rohsIcon),
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
        value: stringFormat("({0}) {1}", vm.rackObj.opNumber.toFixed(3), vm.rackObj.opName),
        displayOrder: 4,
        labelLinkFn: vm.workorderOperation,
        valueLinkFn: vm.manageWorkorderOperation
      },
        {
          label: vm.LabelConstant.Operation.Version,
          value: vm.rackObj.opVersion,
          displayOrder: 5,
        }
      );
    }
    //scan rack detail
    vm.scanRackLabel = (ev) => {
      $timeout(() => {
        if (ev.keyCode === 13) {
          objScan.pRackNumber = vm.clearRackDet.racknumber;
          objScan.pisClean = false;
          if (objScan.pRackNumber) {
            vm.scanRackDet(ev);
            const objScan = document.getElementById('clearRack');
            if (objScan) {
              objScan.focus();
            }
          }
        }
      }, true);
      /** Prevent enter key submit event */
      preventInputEnterKeyEvent(ev);
    };

    let objScan = {
      pwoTransID: vm.rackObj.woTransID,
    };
    //scan to clear details
    vm.scanRackDet = () => {
      objScan.issuperadmin = objIsAdmin ? true : false;
      vm.cgBusyLoading = TravelersFactory.scanClearMaterial().query({
        objScan: objScan
      }).$promise.then((response) => {
        if (response && response.data && response.data.scanMaterial) {
          let scanDetail = response.data.scanMaterial[0];
          if (scanDetail.statusCode != CORE.API_RESPONSE_CODE.SUCCESS) {
            alertScanRack(scanDetail.errorText);
          } else {
            if (scanDetail.currentOperation) {
              vm.currentOperation = scanDetail.currentOperation;
              vm.currentUserName = scanDetail.userName;
              vm.currentWoorkorder = scanDetail.workorderName;
              vm.currentrackStatus = scanDetail.rackStatus;
            } else {
              vm.currentOperation = vm.currentUserName = vm.currentWoorkorder = vm.currentrackStatus = null;
              vm.clearRackDet.racknumber = null;
              $scope.$broadcast(CORE.EventName.refreshinoutGrid);
              focusonScanRack();
            }
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
        objScan.focus();
        vm.ClearForm.$setPristine();
      }
    }
    //clear rack detail
    vm.clearRack = () => {
      vm.clearRackDet.racknumber = null;
      vm.currentOperation = null;
      vm.currentUserName = null;
      vm.currentrackStatus = null;
      focusonScanRack();
    }

    //clear rack detail to scan
    vm.clearScanRack = () => {
      if (vm.clearRackDet.racknumber)
      confirmRackScan();
    }
    //let confirmation for clear rack
    let confirmRackScan = () => {
      let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CLEAR_RACK_CONFIRM);
      messageContent.message = stringFormat(messageContent.message, vm.clearRackDet.racknumber);
      let obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          objScan.pisClean = true;
          if (vm.clearRackDet.racknumber) {
            objScan.pRackNumber = vm.clearRackDet.racknumber;
            vm.scanRackDet();
          }
        } else { focusonScanRack(); }
      }, (cancel) => {
        focusonScanRack();
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    //max length validation check
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    }

    //rack master detail
    vm.gotoRack = () => {
      BaseService.goToRackList();
    }
    //on load submit form
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.ClearForm);
    });
  }
})();
