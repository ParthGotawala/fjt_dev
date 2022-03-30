(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('CustomerTrackingNumber', CustomerTrackingNumber);

  /** @ngInject */
  function CustomerTrackingNumber($mdDialog, $timeout, CORE, WORKORDER, TRANSACTION, $scope, $rootScope, NotificationFactory,
    data, CustomerPackingSlipFactory, DialogFactory, BaseService) {
    const vm = this;
    vm.trackingNumberData = data;
    vm.trackingNumberDet = null;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.isUserSuperAdmin = BaseService.loginUser.isUserAdmin;
    vm.enableCustTrackingFeature = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToChangeCustPackingSlipAndInvoiceTrackingNumber);
    vm.shippedStatus = CORE.CustomerPackingSlipSubStatusID.Shipped;
    vm.BUTTON_TYPE = CORE.POPUP_FOOTER_BUTTON;
    vm.customerPackingSlipTrackNumber = [];
    vm.disableSave = false;
    vm.disableClose = false;

    vm.checkCopyStatus = () => { vm.copystatus = false; };
    vm.copyTrackinNumber = ($event, item) => { $event.stopPropagation(); copyTextForWindow(item); vm.copystatus = true; };

    vm.getCoInvoiceStatusClassName = vm.trackingNumberData.custInvoiceSubstatus ? BaseService.getCustInvStatusClassName(vm.trackingNumberData.custInvoiceSubstatus, 'I') : 'label-warning';
    vm.getCoPackingSlipStatusClassName = vm.trackingNumberData.SubStatus ? BaseService.getCustomerPackingSlipStatusClassName(vm.trackingNumberData.SubStatus) : 'label-warning';

    vm.isVissible = !((vm.trackingNumberData.IsLocked && !vm.isUserSuperAdmin)) && vm.enableCustTrackingFeature && !vm.trackingNumberData.isOnlyView;

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    };

    /* go to CustomerPackingSlip */
    const gotoCustomerPackingSlip = (param) => {
      BaseService.goToManageCustomerPackingSlip(param.psid, param.soid);
    };
    /* go To Customer PackingSlip List */
    const goToCustomerPackingSlipList = () => {
      BaseService.goToCustomerPackingSlipList();
    };

    /* go to Customer Invoice */
    const gotoCustomerInvoice = (param) => {
      BaseService.goToManageCustomerInvoice(param.invid);
    };

    /* go to Customer Invoice List */
    const gotoCustomerInvoiceList = () => {
      BaseService.goToCustomerInvoiceList();
    };

    /* go To Customer */
    const goToCustomer = (param) => {
      BaseService.goToCustomer(param.id);
    };

    /* go To Customer List */
    const goToCustomerList = () => {
      BaseService.goToCustomerList();
    };

    vm.headerdata = [
      {
        label: CORE.LabelConstant.Customer.Customer,
        value: vm.trackingNumberData.CustomerName,
        displayOrder: 1,
        isCopy: true,
        labelLinkFn: goToCustomerList,
        valueLinkFn: goToCustomer,
        valueLinkFnParams: { id: vm.trackingNumberData.CustomerID }
      },
      {
        label: CORE.LabelConstant.CustomerPackingSlip.PackingSlipNumber,
        value: vm.trackingNumberData.custPackingSlipValue,
        displayOrder: 2,
        isCopy: true,
        labelLinkFn: goToCustomerPackingSlipList,
        valueLinkFn: vm.trackingNumberData.custPackingSlipID ? gotoCustomerPackingSlip : null,
        valueLinkFnParams: { psid: vm.trackingNumberData.custPackingSlipID, soid: vm.trackingNumberData.custSalesOrderID }
      }];
    if (vm.trackingNumberData.custInvoiceID) {
      vm.headerdata.push({
        label: CORE.LabelConstant.CustomerPackingInvoice.CustomerInvoiceNumber,
        value: vm.trackingNumberData.custInvoiceValue,
        displayOrder: 3,
        isCopy: true,
        labelLinkFn: gotoCustomerInvoiceList,
        valueLinkFn: gotoCustomerInvoice,
        valueLinkFnParams: { invid: vm.trackingNumberData.custInvoiceID }
      });
    }

    /*Fetch tracking# based in ID*/
    const getCustomerTrackingNumber = () => {
      vm.customerPackingSlipTrackNumber = [];
      vm.fetchedOldTrackingNumber = [];
      const refID = vm.trackingNumberData.isInvoice ? vm.trackingNumberData.custInvoiceID : vm.trackingNumberData.custPackingSlipID;
      CustomerPackingSlipFactory.getCustPackingSlipAndInvoiceTrackingNumber().query({
        custPackingSlipID: refID
      }).$promise.then((response) => {
        if (response.data && response.data.TrackingNumbers) {
          _.each(response.data.TrackingNumbers, (item, index) => {
            vm.customerPackingSlipTrackNumber.push({
              trackNumber: item.trackNumber,
              id: item.id || null,
              refCustPackingSlipID: vm.trackingNumberData.custPackingSlipID,
              tempID: index
            });
          });
          vm.fetchedOldTrackingNumber = angular.copy(vm.customerPackingSlipTrackNumber);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.initDialog = () => {
      getCustomerTrackingNumber();
    };

    vm.initDialog();

    /* Add tracking number */
    vm.addTrackingNumberToList = (event) => {
      if (event.keyCode === 13) {
        $timeout(() => {
          if (!vm.trackingNumberDet.trackNumber || !vm.trackingNumberDet.trackNumber.trim()) {
            setFocus('trackingNumber');
            return;
          }
          if (vm.checkUniqueTrackNumber()) {
            const customerslip = _.find(vm.customerPackingSlipTrackNumber, (obj) => obj.tempID === vm.trackingNumberDet.tempID);
            if (customerslip) {
              customerslip.oldTrackNumber = customerslip.trackNumber;
              customerslip.trackNumber = vm.trackingNumberDet.trackNumber;
              customerslip.isRequiredToUpdate = true;
            } else {
              vm.customerPackingSlipTrackNumber.push({
                trackNumber: vm.trackingNumberDet.trackNumber,
                refCustPackingSlipID: vm.trackingNumberData.custPackingSlipID || null,
                tempID: (vm.customerPackingSlipTrackNumber.length + 1),
                isNewFromPacingSlip: vm.trackingNumberData.isInvoice,
                isNewFromInv: !vm.trackingNumberData.isInvoice
              });
            }
            vm.resetTrackingNumberDet();
            setFocus('trackingNumber');
          } else {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALREADY_EXISTS);
            messageContent.message = stringFormat(messageContent.message, 'Tracking# ' + vm.trackingNumberDet.trackNumber);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model).then(() => {
              vm.resetTrackingNumberDet();
              setFocus('trackingNumber');
            });
          }
        });
        /** Prevent enter key submit event */
        preventInputEnterKeyEvent(event);
      }
    };

    /* Edit tracking number */
    vm.editTrackingNumber = (item) => {
      vm.disableClose = true;
      vm.trackingNumberDet = angular.copy(item);
      setFocus('trackingNumber');
    };

    /* Remove tracking number */
    vm.removeTrackNumber = (item, index) => {
      vm.removeCustomerPackingSlipTrackNumberIds = vm.removeCustomerPackingSlipTrackNumberIds || [];
      vm.removeCustomerInvTrackNumbers = vm.removeCustomerInvTrackNumbers || [];
      if (item) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Customer Packing Slip Tracking#', '');
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };

        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.customerTrackingNumberForm.$setDirty(true);
            if (item.id > 0) {
              vm.removeCustomerPackingSlipTrackNumberIds.push(item.id);
              vm.removeCustomerInvTrackNumbers.push(item.trackNumber);
            }
            vm.customerPackingSlipTrackNumber.splice(index, 1);
            _.each(vm.customerPackingSlipTrackNumber, (item, index) => {
              item.tempID = index;
            });
            setFocus('trackingNumber');
          }
        }, () => {
          setFocus('trackingNumber');
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    /* to reset tracking number */
    vm.resetTrackingNumberDet = () => {
      vm.disableClose = false;
      if (vm.trackingNumberDet) {
        vm.trackingNumberDet.trackNumber = null;
        vm.trackingNumberDet.tempID = null;
      }
    };

    /** Set/Remove duplicate validation if track number is duplicate */
    vm.checkUniqueTrackNumber = () => {
      const checkDuplicate = _.find(vm.customerPackingSlipTrackNumber, (obj) => obj.tempID !== vm.trackingNumberDet.tempID && obj.trackNumber === vm.trackingNumberDet.trackNumber);
      if (checkDuplicate) {
        $scope.$applyAsync(() => {
          vm.customerTrackingNumberForm.trackingNumber.$setValidity('duplicate', false);
        });
        return false;
      }
      vm.customerTrackingNumberForm.trackingNumber.$setValidity('duplicate', true);
      return true;
    };

    /* Save TrackingNumber  */
    vm.saveCustomerTrackingNumber = (buttonType) => {
      const oldTrackingNumbers = _.map(vm.fetchedOldTrackingNumber, (item) => item.trackNumber);
      const currentTrackingNumbers = _.map(vm.customerPackingSlipTrackNumber, (item) => item.trackNumber);

      const isSame = _.isEqual(oldTrackingNumbers.sort(), currentTrackingNumbers.sort());
      if (!isSame && vm.customerTrackingNumberForm.$dirty) {
        vm.disableSave = true;
        const saveObj = {
          custPackingSlipID: vm.trackingNumberData.custPackingSlipID,
          custInvoiceID: vm.trackingNumberData.custInvoiceID,
          removeTrackingNumberIds: vm.removeCustomerPackingSlipTrackNumberIds,
          trackingNumberList: vm.customerPackingSlipTrackNumber,
          removeInvoiceTrackingNumbers: vm.removeCustomerInvTrackNumbers
        };
        CustomerPackingSlipFactory.saveCustPackingSlipAndInvoiceTrackingNumber().query(saveObj).$promise.then((response) => {
          if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            vm.removeCustomerPackingSlipTrackNumberIds = [];
            vm.removeCustomerInvTrackNumbers = [];
            vm.disableSave = false;
            vm.disableClose = false;
            vm.customerTrackingNumberForm.$setPristine();
            getCustomerTrackingNumber();

            $rootScope.$broadcast('refreshCustomerPackingSlip');
            if (vm.trackingNumberData.custInvoiceID) { $rootScope.$broadcast('refreshCustomerInvoice'); }

            if (buttonType === vm.BUTTON_TYPE.SAVEANDEXIT) {
              $mdDialog.hide();
            } else {
              setFocus('trackingNumber');
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        NotificationFactory.information(vm.CORE_MESSAGE_CONSTANT.NO_CHANGES_MADE);
      }
    };

    /* Show save alert popup when user leave in dirtyState*/
    const showWithoutSavingAlertforTabChange = () => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      return DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          vm.customerTrackingNumberForm.$setPristine();
          $mdDialog.cancel();
        }
      }, () => { setFocus('trackingNumber'); }).catch((err) => BaseService.getErrorLog(err));
    };

    vm.close = () => {
      if (vm.customerTrackingNumberForm.$dirty) {
        //setFocus('trackingNumber');
        showWithoutSavingAlertforTabChange();
      }
      else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };

    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.customerTrackingNumberForm);
    });
  }
})();
