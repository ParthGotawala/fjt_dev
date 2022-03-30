(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('RackCurrentStatusPopupController', RackCurrentStatusPopupController);

  /** @ngInject */
  function RackCurrentStatusPopupController($mdDialog, TravelersFactory, $timeout, CORE, data, BaseService, USER, DialogFactory) {
    const vm = this;
    vm.LabelConstant = CORE.LabelConstant;
    vm.rackObj = data || {};
    vm.rackStatus = {};
    vm.empty = angular.copy(CORE.EMPTYSTATE.RACK_STATUS_CURRENT);
    vm.selectedItems = [];
    vm.cancel = () => {
        $mdDialog.cancel();
    };
    //go to workorder pafge list
    vm.gotoWOlist = () => {
      BaseService.goToWorkorderList();
    };
    //go to workorder manage page
    vm.manageWoPage = (woid) => {
      BaseService.goToWorkorderDetails(woid);
    };
    //manage workorder operation
    vm.manageWorkorderOperation = (woOPID) => {
      BaseService.goToWorkorderOperationDetails(woOPID);
    };
    //go to workorder operation
    vm.workorderOperation = (woID) => {
      BaseService.goToWorkorderOperations(woID);
    };
    //link to go for part master list page
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };
    //go to workorder standards
    vm.goToWorkorderStandards = (woID) => {
      BaseService.goToWorkorderStandards(woID);
    };
    vm.query = {
      order: '',
      operation_search: '',
      limit: !(vm.ispagination === undefined ? CORE.isPagination : vm.ispagination) ? '' : CORE.datalimit,
      page: 1,
      isPagination: vm.ispagination === undefined ? CORE.isPagination : vm.ispagination
    };
    //scan rack detail
    vm.scanRackLabel = (ev) => {
      $timeout(() => {
        if (ev.keyCode === 13) {
          objScan.pRackNumber = vm.rackStatus.racknumber;
          vm.scanDetail = {};
          vm.oprationDetail = [];
          vm.scanned = false;
          vm.isoperationShow = false;
          if (objScan.pRackNumber) {
            vm.scanRackDet(ev);
          }
        }
      }, true);
      /** Prevent enter key submit event */
      preventInputEnterKeyEvent(ev);
    };
    const objScan = {
    };
    //scan rack number for current status
    vm.scanRackDet = () => {
      vm.cgBusyLoading = TravelersFactory.getCurrentRackStatus().query({
        objScan: objScan
      }).$promise.then((response) => {
        if (response && response.data && response.data.scanMaterial) {
          vm.isoperationShow = false;
          vm.scanned = true;
          vm.scanDetail = response.data.scanMaterial[0];
          vm.oprationDetail = response.data.operationDet;
          vm.empty.MESSAGERACK = stringFormat((angular.copy(CORE.EMPTYSTATE.RACK_STATUS_CURRENT.MESSAGERACK)), vm.rackStatus.racknumber);
          if (vm.scanDetail && vm.scanDetail.rackID) {
            vm.scanDetail.currentrack = vm.rackStatus.racknumber;
            vm.scanDetail.rohsicon = stringFormat('{0}{1}{2}', CORE.WEB_URL, USER.ROHS_BASE_PATH, vm.scanDetail.rohsicon);
            const status = _.find(CORE.RackTransactionType, (item) => parseInt(item.key) === parseInt(vm.scanDetail.pStatus));
            if (status) {
              vm.scanDetail.currentOperationStatus = status.value;
            }
            vm.scanDetail.currentassyStatus = vm.scanDetail.prackStatus;
            if (parseInt(vm.scanDetail.pStatus) === parseInt(CORE.RackTransactionType[3].key) && parseInt(vm.scanDetail.prackStatus) !== parseInt(CORE.productStatus[3].id) && vm.oprationDetail.length > 0 && vm.oprationDetail[0].woNumber) {
              vm.isoperationShow = true;
              vm.oprationDetail = _.sortBy(vm.oprationDetail, (o) => o.pcurWoOPID);
            }
            vm.rackStatus.racknumber = null;
            focusonScanRack();
          } else {
            alertScanRack();
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };


    //focus on scan rack material
    const focusonScanRack = () => {
      const objScan = document.getElementById('racknumber');
      if (objScan) {
        $timeout(() => { objScan.focus(); });
      }
    };
    //let alert detail for scan rack
    const alertScanRack = () => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.INCOMIG_VALIDATION);
      messageContent.message = stringFormat(CORE.RACK_NOT_FOUND, vm.rackStatus.racknumber);
      const model = {
        messageContent: messageContent,
        multiple: false
      };
      return DialogFactory.messageAlertDialog(model).then((yes) => {
        if (yes) {
          vm.rackStatus.racknumber = null;
          focusonScanRack();
        }
      }).catch(() => {
      });
    };
    //clear rack detail
    vm.clearRack = () => {
      vm.rackStatus.racknumber = null;
      vm.scanned = false;
      vm.scanDetail = {};
      vm.oprationDetail = [];
      vm.isoperationShow = false;
      focusonScanRack();
    };
    //rack master detail
    vm.gotoRack = () => {
      BaseService.goToRackList();
    };
    //max length validation check
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    //open history popup
    vm.showRackHistory = (event) => {
      const data = { rackName: vm.scanDetail.currentrack, rackID: vm.scanDetail.rackID };
      DialogFactory.dialogService(
        CORE.RACK_HISTORY_MODAL_CONTROLLER,
        CORE.RACK_HISTORY_MODAL_VIEW,
        event,
        data).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };
    //go to traveller page
    vm.gototravellerPage = (woOPID) => {
      BaseService.goToTravelerOperationDetails(woOPID, BaseService.loginUser.employee.id, woOPID);
      return false;
    };
  }
})();
