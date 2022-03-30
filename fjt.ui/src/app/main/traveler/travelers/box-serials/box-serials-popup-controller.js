
(function () {
  'use strict';

  angular
    .module('app.traveler.travelers')
    .controller('BoxSerialPopupController', BoxSerialPopupController);

  /** @ngInject */
  function BoxSerialPopupController($scope, $mdDialog, DialogFactory, WORKORDER, TRANSACTION, CORE, data, USER, BaseService, $rootScope) {
    const vm = this;
    vm.showUMIDHistory = true;
    vm.actionButtonName = 'Serial# Transaction History';
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.WoTranspackaging = {};
    vm.SerialTypeLabel = CORE.SerialTypeLabel;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.selectedValue = 'SerialNumber';
    vm.LabelConstant = CORE.LabelConstant;
    vm.WOSerialNoFilterType = CORE.WorkorderSerialNumberFilterType;
    vm.EmptyMesssage = WORKORDER.WORKORDER_EMPTYSTATE.WORKORDER_SERIAL;
    vm.prodStatus = CORE.productStatus;
    vm.statusText = CORE.statusText;
    vm.isDisableAddSerialNo = false;
    vm.SetupLabelConstant = CORE.LabelConstant.Traveler;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;

    vm.boxSerialDetailModel = {
      assyStockID: data && data.assyStockID ? data.assyStockID : null,
      woTransID: data && data.woTransId ? data.woTransId : null,
      woID: data && data.woID ? data.woID : null,
      opID: data && data.opID ? data.opID : null,
      employeeId: data && data.employeeId ? data.employeeId : null,
      serialNo: null,
      prodstatus: 1,
      assyID: data && data.assyID ? data.assyID : null,
      isTrackbySerialNo: data && data.isTrackbySerialNo ? data.isTrackbySerialNo : false,
      pidCode: data && data.pidCode ? data.pidCode : null,
      woNumber: data && data.woNumber ? data.woNumber : null,
      IsCheckInOperation: data && data.IsCheckInOperation ? data.IsCheckInOperation : false,
      isSetup: data && data.isSetup ? data.isSetup : false,
      datecode: data && data.datecode ? data.datecode : null
    };
    vm.serialNo_Model = {
      from_SerialNo: null,
      to_serialNo: null
    };
    vm.openCheckOutDetailPopup = (ev) => {
      const boxDetail = {
        ev: ev,
        updateCheckinOperationFn: updateCheckinOperation
      };
      $rootScope.$emit('CheckoutDetromBoxSerialPopup', boxDetail);
    };

    function updateCheckinOperation() {
      vm.boxSerialDetailModel.IsCheckInOperation = false;
    }
    // redirect to work order list
    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
      return false;
    };

    // redirect to work order details
    vm.goToWorkorderDetails = () => {
      BaseService.goToWorkorderDetails(vm.boxSerialDetailModel.woID);
      return false;
    };
    // go to manage assembly
    vm.goToAssyMaster = () => {
        BaseService.goToComponentDetailTab(null, vm.boxSerialDetailModel.assyID);
      return false;
    };

    //go to assy list
    vm.goToAssyList = () => {
        BaseService.goToPartList();
      return false;
    };
    vm.headerdata = [];

    // Configure Chips for Assembly Detail
    const addAssyHeaderData = (assyDetail) => {
      const assyHeaderObj = {
        label: CORE.LabelConstant.Assembly.ID,
        value: assyDetail.pidCode,
        displayOrder: 2,
        labelLinkFn: vm.goToAssyList,
        valueLinkFn: vm.goToAssyMaster,
        valueLinkFnParams: null,
        isCopy: true,
        isCopyAheadLabel: false,
        imgParms: {
          imgPath: assyDetail ? vm.rohsImagePath + assyDetail.assyRohsIcon : null,
          imgDetail: assyDetail ? assyDetail.assyRohsName : null
        }
      };


      vm.headerdata.push(assyHeaderObj);
    };

    // Configure Chips for Work Order Detail
    const addWOHeaderData = (woDetail) => {
      const woHeaderObj = {
        label: CORE.LabelConstant.Workorder.WO,
        value: woDetail.woNumber,
        displayOrder: 1
      };

      if (woDetail && woDetail.woID && !isNaN(woDetail.woID)) {
        woHeaderObj.labelLinkFn = vm.goToWorkorderList;
        woHeaderObj.valueLinkFn = vm.goToWorkorderDetails;
      }
      vm.headerdata.push(woHeaderObj);
    };
    addAssyHeaderData(data);
    addWOHeaderData(data);

    /* Add box serial number */
    vm.addRecord = (data, ev) => {
      const boxDetail = { data: data, travelDetail: vm.boxSerialDetailModel };
      DialogFactory.dialogService(
        TRANSACTION.TRANSACTION_BOX_SERIAL_NUMBERS_POPUP_CONTROLLER,
        TRANSACTION.TRANSACTION_BOX_SERIAL_NUMBERS_POPUP_VIEW,
        ev,
        boxDetail).then(() => {
          // Success Section
        }, (err) => BaseService.getErrorLog(err));
    };

    /* Update Box Serial Number */
    vm.updateRecord = (row) => {
      vm.addRecord({ id: row.entity.id });
    };

    /* Add/update box serial number detail event */
    const addUpdateRecord = $scope.$on('addUpdateRecord', (event, data) => {
      vm.addRecord(data.data, data.ev);
    });

    /* Record Not Found  */
    const isDataAvailable = $scope.$on('isNotDataFound', (event, data) => {
      vm.isNoBoxSerialDataFound = data;
    });

    /*dismiss popup*/
    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.WoTranspackagingForm);
      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        $mdDialog.cancel(null);
      }
    };
    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    /* close popup on page destroy  */
    $scope.$on('$destroy', () => {
      //$mdDialog.hide(false, { closeAll: true });
      addUpdateRecord();
      isDataAvailable();
    });
  }
})();
