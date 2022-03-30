(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('IncomingOutgoingRackPopupController', IncomingOutgoingRackPopupController);

  /** @ngInject */
  function IncomingOutgoingRackPopupController($mdDialog, TravelersFactory, $timeout, CORE, USER, data, BaseService, DialogFactory, $scope, TRANSACTION, GenericCategoryConstant) {
    const vm = this;
    vm.LabelConstant = CORE.LabelConstant;
    const loginUserDetails = BaseService.loginUser;
    vm.rackObj = data || {};

    vm.rackStatus = CORE.productStatus;
    vm.rackStatusDetail = CORE.productDetailStatus;
    vm.opname = stringFormat('({0}) {1}', vm.rackObj.opNumber.toFixed(3), vm.rackObj.opName);
    vm.popUpType = angular.copy(CORE.Incomin_Outgoing);
    vm.incomOutgoingDet = {};
    let popupName;
    if (vm.rackObj.type) {
      popupName = _.find(vm.popUpType, (type) => type.id === vm.rackObj.type);
    }
    if (popupName) {
      vm.title = popupName.value;
      vm.incomOutgoingDet = { status: vm.rackObj.type === vm.popUpType[0].id ? 0 : vm.rackStatusDetail.Passed.id };
    }
    if (vm.popUpType && vm.popUpType.length > 1 && vm.popUpType[1].id === vm.rackObj.type) {
      vm.incomOutgoingDet.pass = true;
    }
    vm.cancel = () => {
      const isdirty = BaseService.checkFormDirty(vm.incomingOutgoingForm);
      if (isdirty) {
        const data = {
          form: vm.incomingOutgoingForm
        };
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
          imgPath: stringFormat('{0}{1}{2}', CORE.WEB_URL, USER.ROHS_BASE_PATH, vm.rackObj.rohsIcon),
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
    //scan rack detail
    vm.scanRackLabel = (ev) => {
      $timeout(() => {
        if (ev.keyCode === 13) {
          objScan.pRackNumber = vm.incomOutgoingDet.racknumber;
          objScan.pConfirm = false;
          if (objScan.pRackNumber) {
            vm.scanRackDet(ev);
          }
        }
      }, true);
      /** Prevent enter key submit event */
      preventInputEnterKeyEvent(ev);
    };

    const objScan = {
      pScanType: vm.rackObj.type,
      pwoTransID: vm.rackObj.woTransID,
      pwoOPID: vm.rackObj.woOPID,
      pwoID: vm.rackObj.woID,
      ppartID: vm.rackObj.partID,
      pemployeeID: loginUserDetails.employee.id
    };
    //scan incomin and outgoing details
    vm.scanRackDet = () => {
      defaultStatus(objScan);
      vm.cgBusyLoading = TravelersFactory.scanIncomingOutgoingRack().query({
        objScan: objScan
      }).$promise.then((response) => {
        if (response && response.data && response.data.scanMaterial) {
          const scanDetail = response.data.scanMaterial[0];
          if (parseInt(scanDetail.statusCode) !== CORE.API_RESPONSE_CODE.SUCCESS) {
            vm.currentOperation = scanDetail.operation;
            vm.currentUserName = scanDetail.userName;
            vm.currentWoorkorder = scanDetail.workorderName;
            if (vm.currentOperation && vm.currentUserName) {
              vm.currentrackStatus = scanDetail.rackStatus;
            }
            if (scanDetail.isConfirmation) {
              confirmRackScan(scanDetail.errorText);
            } else { alertScanRack(scanDetail.errorText); }
          } else {
            vm.currentWoorkorder = vm.currentOperation = vm.currentUserName = vm.currentrackStatus = null;
            vm.incomOutgoingDet = {};
            if (vm.popUpType && vm.popUpType.length > 1 && vm.popUpType[1].id === vm.rackObj.type) {
              vm.incomOutgoingDet.pass = true;
            }
            vm.incomOutgoingDet.racknumber = null;
            $scope.$broadcast(CORE.EventName.refreshinoutGrid);
            focusonScanRack();
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    //status default
    const defaultStatus = (data) => {
      let statusDet = '';
      if (vm.incomOutgoingDet.pass) {
        statusDet = stringFormat('{0},{1}', statusDet, vm.rackStatusDetail.Passed.id);
      }
      if (vm.incomOutgoingDet.reprocess) {
        statusDet = stringFormat('{0},{1}', statusDet, vm.rackStatusDetail.Reprocess.id);
      }
      if (vm.incomOutgoingDet.defect) {
        statusDet = stringFormat('{0},{1}', statusDet, vm.rackStatusDetail.Defect.id);
      }
      if (vm.incomOutgoingDet.scrapp) {
        statusDet = stringFormat('{0},{1}', statusDet, vm.rackStatusDetail.Scrapped.id);
      }
      if (vm.incomOutgoingDet.rework) {
        statusDet = stringFormat('{0},{1}', statusDet, vm.rackStatusDetail.Rework.id);
      }
      if (vm.incomOutgoingDet.missingParts) {
        statusDet = stringFormat('{0},{1}', statusDet, vm.rackStatusDetail.BoardWithMissing.id);
      }
      if (vm.incomOutgoingDet.bypass) {
        statusDet = stringFormat('{0},{1}', statusDet, vm.rackStatusDetail.Bypassed.id);
      }
      statusDet = statusDet.substr(1);
      data.pStatus = statusDet ? statusDet : '0';
    };

    //let confirmation scan for rack
    const confirmRackScan = (errorText) => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.OUTGOING_CONFIRMATION);
      messageContent.message = errorText;
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          objScan.pConfirm = true;
          if (objScan.pRackNumber) {
            vm.scanRackDet();
          }
        } else { focusonScanRack(); }
      }, () => {
        focusonScanRack();
      }).catch((error) => BaseService.getErrorLog(error));
    };
    //let alert detail for scan rack
    const alertScanRack = (errorText) => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.INCOMIG_VALIDATION);
      messageContent.message = errorText;
      const model = {
        messageContent: messageContent,
        multiple: true
      };
      return DialogFactory.messageAlertDialog(model).then((yes) => {
        if (yes) {
          focusonScanRack();
        }
      }).catch(() => {
      });
    };
    //focus on scan rack material
    const focusonScanRack = () => {
      const objScan = document.getElementById('racknumber');
      if (objScan) {
        objScan.focus();
        vm.incomingOutgoingForm.$setPristine();
      }
    };
    //clear rack detail
    vm.clearRack = () => {
      vm.incomOutgoingDet.racknumber = null;
      vm.currentWoorkorder = null;
      vm.currentOperation = null;
      vm.currentUserName = null;
      vm.currentrackStatus = null;
      focusonScanRack();
    };
    //open popup to show empty rack list
    vm.openEmptyRackDetail = (event) => {
      const data = angular.copy(vm.rackObj);
      DialogFactory.dialogService(
        CORE.SHOW_EMPTY_RACK_MODAL_CONTROLLER,
        CORE.SHOW_EMPTY_RACK_MODAL_VIEW,
        event,
        data).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };
    //open popup to show available rack list page
    vm.openAvailableRack = (event) => {
      const data = angular.copy(vm.rackObj);
      DialogFactory.dialogService(
        CORE.SHOW_AVAILABLE_RACK_MODAL_CONTROLLER,
        CORE.SHOW_AVAILABLE_RACK_MODAL_VIEW,
        event,
        data).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };
    //open add rack popup
    vm.addRack = (ev) => {
      const popUpData = { popupAccessRoutingState: [TRANSACTION.TRANSACTION_RACK_STATE], pageNameAccessLabel: CORE.PageName.Rack };
      const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
      if (isAccessPopUp) {
        DialogFactory.dialogService(
          TRANSACTION.TRANSACTION_RACK_ADD_UPDATE_MODAL_CONTROLLER,
          TRANSACTION.TRANSACTION_RACK_ADD_UPDATE_MODAL_VIEW,
          ev,
          null).then(() => {
          }, () => {
          }, (err) => BaseService.getErrorLog(err));
      }
    };

    //open popup to show clear rack detail for operation
    vm.clearRackPopup = (event) => {
      const data = angular.copy(vm.rackObj);
      DialogFactory.dialogService(
        CORE.CLEAR_RACK_MODAL_CONTROLLER,
        CORE.CLEAR_RACK_MODAL_VIEW,
        event,
        data).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };
    //rack master detail
    vm.gotoRack = () => {
      BaseService.goToRackList();
    };
    //max length validation check
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    //check status need to show or not
    vm.checkCase = (id) => {
      if (vm.rackObj.isRework) {
        if (parseInt(vm.rackStatusDetail.Passed.id) === parseInt(id) || parseInt(vm.rackStatusDetail.Scrapped.id) === parseInt(id)) {
          return true;
        } else {
          return false;
        }
      } else if (vm.rackObj.operationType === GenericCategoryConstant.OPERATION_TYPE.INSPECTION_PROCESS.gencCategoryName) {
        if (parseInt(vm.rackStatusDetail.BoardWithMissing.id) === parseInt(id)) {
          return false;
        } else {
          return true;
        }
      } else if (vm.rackObj.isMoveToStock) {
        const rackStatusID = parseInt(id);
        if (parseInt(vm.rackStatusDetail.Defect.id) === rackStatusID
          || parseInt(vm.rackStatusDetail.Rework.id) === rackStatusID
          || parseInt(vm.rackStatusDetail.BoardWithMissing.id) === rackStatusID
          || parseInt(vm.rackStatusDetail.Bypassed.id) === rackStatusID) {
          return false;
        }
        else {
          return true;
        }
      } else {
        return true;
      }
    };
    //save outgoing detail
    vm.outgoingRackDetail = (ev) => {
      if (vm.rackObj.isMoveToStock) {
        // when last operation - move to stock then defect/rework/missingParts/bypass type not allowed
        vm.incomOutgoingDet.defect = vm.incomOutgoingDet.rework = vm.incomOutgoingDet.missingParts = vm.incomOutgoingDet.bypass = false;
      }
      objScan.pRackNumber = vm.incomOutgoingDet.racknumber;
      objScan.pConfirm = false;
      if (objScan.pRackNumber) {
        vm.scanRackDet(ev);
      }
    };
    vm.checknextField = (ev) => {
      $timeout(() => {
        if (ev.keyCode === 13) {
          if (vm.incomOutgoingDet.racknumber) {
            const objScan = document.getElementById('pass');
            if (objScan) {
              objScan.focus();
            }
          }
        }
      });
      /** Prevent enter key submit event */
      preventInputEnterKeyEvent(ev);
    };
    //on load submit form
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.incomingOutgoingForm);
    });
  }
})();
