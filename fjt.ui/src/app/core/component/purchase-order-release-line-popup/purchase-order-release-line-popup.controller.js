(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('PurchaseOrderReleaseLinePopupController', PurchaseOrderReleaseLinePopupController);

  /** @ngInject */
  function PurchaseOrderReleaseLinePopupController($mdDialog, CORE,
    data, BaseService, DialogFactory, USER, PurchaseOrderFactory) {
    const vm = this;
    vm.releaseLineDetail = [];
    vm.lineLevelDetail = data || {};
    vm.isdisabled = vm.lineLevelDetail.poWorkingStatus === CORE.PO_Working_Status.Completed.id || vm.lineLevelDetail.poWorkingStatus === CORE.PO_Working_Status.Canceled.id || vm.lineLevelDetail.isReadOnly;
    vm.workingStatus = vm.lineLevelDetail.poWorkingStatus === CORE.PO_Working_Status.Completed.id ? CORE.PurchaseOrderCompleteStatusGridHeaderDropdown[2].value : '';
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.isDisabledDelete = vm.ischange = false;
    vm.LabelConstant = CORE.LabelConstant;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.TextAreaRows = CORE.TEXT_AREA_ROWS;
    // get release line level detail for selected po line
    const getPurchaseOrderLineDetail = () => {
      vm.cgBusyLoading = PurchaseOrderFactory.getPurchaseOrderLineDetailByID().query({ id: vm.lineLevelDetail.id }).$promise.then((response) => {
        if (response && response.data) {
          _.each(response.data, (releaseData) => {
            releaseData.poworkingStatus = BaseService.getPOLineWorkingStatus(releaseData.poLineWorkingStatus || 'P');
            releaseData.shippingDateOptions = {
              appendToBody: true,
              shippingDateOpenFlag: false,
              minDate: vm.lineLevelDetail.poDate
            };
            releaseData.promisedDateOptions = {
              appendToBody: true,
              promisedDateOpenFlag: false,
              minDate: vm.lineLevelDetail.poDate
            };
            releaseData.shippingDate = BaseService.getUIFormatedDate(releaseData.shippingDate, vm.DefaultDateFormat);
            releaseData.promisedShipDate = BaseService.getUIFormatedDate(releaseData.promisedShipDate, vm.DefaultDateFormat);
          });
          vm.releaseLineDetail = response.data;
          vm.releaseLineDetailCopy = angular.copy(response.data);
          bindHeaderData();
          vm.addnewRecord(true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    vm.cancel = () => {
      if (vm.ischange) {
        const data = {
          form: vm.releaselineform
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };

    //add new record
    vm.addnewRecord = (isload) => {
      const obj = {
        promisedShipDate: null,
        shippingDate: null,
        qty: null,
        releaseNumber: vm.releaseLineDetail.length + 1,
        releaseNotes: null,
        additionalNotes: null,
        poworkingStatus: BaseService.getPOLineWorkingStatus('P'),
        refPurchaseOrderDetID: vm.lineLevelDetail.id,
        shippingDateOptions: {
          appendToBody: true,
          shippingDateOpenFlag: false,
          minDate: vm.lineLevelDetail.poDate
        },
        promisedDateOptions: {
          appendToBody: true,
          promisedDateOpenFlag: false,
          minDate: vm.lineLevelDetail.poDate
        }
      };
      vm.releaseLineDetail.push(obj);
      if (isload) {
        setFocus(stringFormat('qty{0}', vm.releaseLineDetail.length - 1));
      }
    };
    //remove record
    vm.removeRow = (item) => {
      vm.isDisabledDelete = true;
      const obj = {
        title: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM, 'Shipping'),
        textContent: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM_MESSAGE, 1, 'Shipping'),
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.confirmDiolog(obj).then((response) => {
        vm.isDisabledDelete = false;
        if (response) {
          const _index = vm.releaseLineDetail.indexOf(item);
          vm.releaseLineDetail.splice(_index, 1);
          let index = item.releaseNumber;
          _.each(vm.releaseLineDetail, (sData) => {
            if (sData.releaseNumber > item.releaseNumber) {
              sData.releaseNumber = index;
              index++;
            }
          });
          vm.changValue();
          if (vm.releaseLineDetail.length === 0) {
            vm.addnewRecord();
          }
        }
      }, () => vm.isDisabledDelete = false).catch((error) => BaseService.getErrorLog(error));
    };
    vm.changValue = () => {
      vm.ischange = true;
    };
    // save purchase release line detail
    vm.savePurchaseLineDetails = (iscontinue) => {
      if (vm.isdisabled) { return; }
      vm.isbuttondisabled = true;
      if (!vm.ischange) {
        BaseService.focusRequiredField(vm.releaselineform);
        vm.isbuttondisabled = false;
        return;
      }
      checkReleaseLineDetail();
      if (vm.isvalid) {
        if (vm.releaseLineDetail.length === 0) { vm.addnewRecord(); }
        const totalPoQty = _.sumBy(_.filter(vm.releaseLineDetail, (pData) => pData.qty), (o) => parseInt(o.qty));
        //new validation if po qty not matched than validation
        if (totalPoQty !== parseInt(vm.lineLevelDetail.qty)) {
          vm.releaseLineDetail[vm.releaseLineDetail.length - 1].invalidqty = true;
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.TOTAL_POQTY_SHIPQTYVALIDATION);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model, callBackFn);
          vm.isbuttondisabled = false;
          return;
        }
        vm.releaseLineDetail = _.filter(vm.releaseLineDetail, (item) => item.qty || item.shippingDate || item.promisedShipDate || item.releaseNotes || item.additionalNotes);
        if (vm.releaseLineDetail.length !== vm.lineLevelDetail.totalRelease) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.TOTAL_RELEASE_RELEASECOUNT_MISMATC_CONFIRM);
          messageContent.message = stringFormat(messageContent.message, vm.lineLevelDetail.poNumber);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              commonLineDetail(iscontinue);
            }
          }, () => {
            vm.isbuttondisabled = false;
          }).catch((error) => BaseService.getErrorLog(error));
        }
        else { commonLineDetail(iscontinue); }
      } else { vm.isbuttondisabled = false; }
    };
    //common code to save release line detail
    const commonLineDetail = (iscontinue) => {
      _.each(vm.releaseLineDetail, (plann) => {
        plann.shippingDate = BaseService.getAPIFormatedDate(plann.shippingDate);
        plann.promisedShipDate = BaseService.getAPIFormatedDate(plann.promisedShipDate);
        plann.poLineWorkingStatus = plann.receivedQty && plann.qty && parseInt(plann.receivedQty) >= parseInt(plann.qty) ? 'C' : plann.poLineWorkingStatus;
      });
      const objReleaseLine = {
        id: vm.lineLevelDetail.id,
        PODetail: vm.releaseLineDetail,
        refPOID: vm.lineLevelDetail.refPurchaseOrderID
      };
      vm.cgBusyLoading = PurchaseOrderFactory.savePurchaseOrderLineDetail().query(objReleaseLine).$promise.then((res) => {
        vm.isbuttondisabled = false;
        if (iscontinue) {
          vm.ischange = false;
          vm.lineLevelDetail.totalRelease = res.data.totalRelease;
          getPurchaseOrderLineDetail();
        } else {
          BaseService.currentPagePopupForm.pop();
          $mdDialog.cancel(vm.ischange);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    function callBackFn() {
      _.each(vm.releaseLineDetail, (item, index) => {
        if (item.invalidqty) {
          setFocus('qty' + index);
        }
        else if (item.invalidshipdate) {
          item.shippingDate = null;
          setFocus('ship' + index);
        }
        else if (item.invalidpromiseddate) {
          item.promisedShipDate = null;
          item.invalidpromiseddate = false;
          setFocus('promised' + index);
        }
      });
      isOpen = false;
    }
    let isOpen = false;
    //check detail before save
    const checkReleaseLineDetail = () => {
      vm.isvalid = true;
      vm.releaseLineDetail = _.filter(vm.releaseLineDetail, (item) => item.qty || item.shippingDate || item.promisedShipDate || item.releaseNotes || item.additionalNotes);
      _.each(vm.releaseLineDetail, (releaseLine) => {
        releaseLine.invalidshipdate = false;
        releaseLine.invalidpromiseddate = false;
        if (!releaseLine.qty) { releaseLine.invalidqty = true; vm.isvalid = false; } else { releaseLine.invalidqty = false; }
        if (!releaseLine.shippingDate) { releaseLine.invalidshipdate = true; vm.isvalid = false; } else { releaseLine.invalidshipdate = false; }
        if (releaseLine.shippingDate && vm.lineLevelDetail.poDate && (new Date(releaseLine.shippingDate)).setHours(0, 0, 0, 0) < (new Date(vm.lineLevelDetail.poDate)).setHours(0, 0, 0, 0)) {
          releaseLine.invalidshipdate = true; vm.isvalid = false;
        }
        if (releaseLine.promisedShipDate && vm.lineLevelDetail.poDate && (new Date(releaseLine.promisedShipDate)).setHours(0, 0, 0, 0) < (new Date(vm.lineLevelDetail.poDate)).setHours(0, 0, 0, 0)) {
          releaseLine.invalidpromiseddate = true; vm.isvalid = false;
        }
      });
    };
    //check for new line item
    vm.checkForNewLine = (item, isPoDate) => {
      if (vm.isdisabled) { return; }
      if (isOpen) { return; }
      if (item.shippingDateOptions.shippingDateOpenFlag || item.promisedDateOptions.promisedDateOpenFlag || isOpen) {
        return;
      }
      if (!vm.checkDetails()) {
        vm.addnewRecord();
      }
      if (isNaN(item.qty)) {
        item.qty = null;
      }
      if (item.shippingDate && vm.lineLevelDetail.poDate && (new Date(item.shippingDate)).setHours(0, 0, 0, 0) < (new Date(vm.lineLevelDetail.poDate)).setHours(0, 0, 0, 0)) {
        if (isPoDate) {
          item.invalidshipdate = true;
        }
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.DATE_VALIDATION_PO);
        messageContent.message = stringFormat(messageContent.message, 'Due Date');
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        isOpen = true;
        DialogFactory.messageAlertDialog(model, callBackFn);
        return;
      } else {
        item.invalidshipdate = false;
      }
      if (item.promisedShipDate && vm.lineLevelDetail.poDate && (new Date(item.promisedShipDate)).setHours(0, 0, 0, 0) < (new Date(vm.lineLevelDetail.poDate)).setHours(0, 0, 0, 0)) {
        item.invalidpromiseddate = true;
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.DATE_VALIDATION_PO);
        messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.PURCHASE_ORDER.SupplierPromisedDeliveryDate);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        isOpen = true;
        DialogFactory.messageAlertDialog(model, callBackFn);
        return;
      } else {
        item.invalidpromiseddate = false;
      }
      if (item.qty && parseInt(item.qty) === 0) {
        item.qty = null;
        item.invalidqty = true;

        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.INVALID_DYNAMIC);
        messageContent.message = stringFormat(messageContent.message, 'Qty');
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        isOpen = true;
        DialogFactory.messageAlertDialog(model, callBackFn);
        return;
      } else {
        item.invalidqty = false;
      }
    };

    // check detail fill or not
    vm.checkDetails = () => _.find(vm.releaseLineDetail, (item) => !item.qty || !item.shippingDate);
    //link to go for part master list page
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };
    //link to go for manufacturer master list page
    vm.goToMFGList = () => {
      BaseService.goToManufacturerList();
    };
    // link to go for manufacturer detail tab
    vm.goToManufacturerDetail = () => {
      BaseService.goToManufacturer(vm.lineLevelDetail.mfgcodeID);
    };
    // go to part detailpage
    vm.goToPartDetail = () => {
      BaseService.goToComponentDetailTab(null, vm.lineLevelDetail.mfgPartID);
    };
    //go to purchase order detail
    vm.goToPurchaseOrderDeatil = () => {
      BaseService.goToPurchaseOrderDetail(vm.lineLevelDetail.refPurchaseOrderID);
    };
    // go to purchase order list page
    vm.goToPurchaseOrderNumber = () => {
      BaseService.goToPurchaseOrderList();
    };
    // bind header detail
    function bindHeaderData() {
      vm.headerdata = [];
      vm.headerdata.push({
        label: vm.LabelConstant.MFG.MFG,
        value: vm.lineLevelDetail.mfgcodeName,
        displayOrder: 1,
        labelLinkFn: vm.goToMFGList,
        valueLinkFn: vm.goToManufacturerDetail
      }, {
        label: vm.LabelConstant.MFG.MFGPN,
        value: vm.lineLevelDetail.mfgPN,
        displayOrder: 2,
        labelLinkFn: vm.goToPartList,
        valueLinkFn: vm.goToPartDetail,
        isCopy: true,
        isAssy: vm.lineLevelDetail.iscustom,
        imgParms: {
          imgPath: stringFormat('{0}{1}', vm.rohsImagePath, vm.lineLevelDetail.rohsIcon),
          imgDetail: vm.lineLevelDetail.rohsName
        }
      }, {
        label: vm.LabelConstant.PURCHASE_ORDER.PO,
        value: vm.lineLevelDetail.poNumber,
        displayOrder: 3,
        labelLinkFn: vm.goToPurchaseOrderNumber,
        valueLinkFn: vm.goToPurchaseOrderDeatil
      },
        {
          label: vm.LabelConstant.PURCHASE_ORDER.POLineID,
          value: vm.lineLevelDetail.lineID,
          displayOrder: 4
        }, {
        label: vm.LabelConstant.PURCHASE_ORDER.TotalRelease,
        value: vm.lineLevelDetail.totalRelease,
        displayOrder: 5
      }, {
        label: vm.LabelConstant.PURCHASE_ORDER.PODate,
        value: vm.lineLevelDetail.poDate
      }, {
        label: vm.LabelConstant.SalesOrder.POQTY,
        value: vm.lineLevelDetail.qty
      });
      if (vm.workingStatus) {
        vm.headerdata.push({
          label: vm.LabelConstant.PURCHASE_ORDER.POWorkingStatus,
          value: vm.workingStatus
        });
      }
    }
    // popup form validation
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.releaselineform);
      getPurchaseOrderLineDetail();
      setFocus(stringFormat('qty{0}', vm.releaseLineDetail.length - 1));
    });

    vm.totalQty = () => {
      var total = (_.sumBy(vm.releaseLineDetail, (o) => parseInt(o.qty ? o.qty : 0)));
      if (!isNaN(total)) {
        return total;
      }
      return 0;
    };
    // receive qty
    vm.totalReceivedQty = () => {
      var total = (_.sumBy(vm.releaseLineDetail, (o) => parseInt(o.receivedQty ? o.receivedQty : 0)));
      if (!isNaN(total)) {
        return total;
      }
      return 0;
    };
    //reset all the release line details
    vm.ResetAll = () => {
      vm.ischange = false;
      getPurchaseOrderLineDetail();
    };

    // check pacing slip qty
    vm.checkPacingSlipQty = (item) => {
      if (item.receivedQty) {
        if ((item.qty ? parseInt(item.qty) : 0) < parseInt(item.receivedQty)) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PURCHASE_ORDER_REMOVE_SHIPPING_RESTRICTION_PS);
          messageContent.message = stringFormat('You cannot remove the Release# <b>{0}</b>, Packing slip(s) already generated and received the <b>{1}</b> qty against the selected Release# qty <b>{2}</b>.', item.releaseNumber, (item.receivedQty || 0), item.qty);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model).then(() => {
            const releaseObj = _.find(vm.releaseLineDetailCopy, (release) => release.id === item.id);
            if (releaseObj) {
              item.qty = releaseObj.qty;
              const index = vm.releaseLineDetailCopy.indexOf(releaseObj);
              setFocus('qty' + index);
            }
          });
        }
      };
    };

    vm.openReceivedQtyDetailsPopup = () => {
      const data = vm.lineLevelDetail;
      data.mfgCodeID = vm.lineLevelDetail.mfgcodeID;
      data.partID = vm.lineLevelDetail.mfgPartID;
      data.PIDCode = vm.lineLevelDetail.pidCode;
      data.receivedQty = vm.lineLevelDetail.totalReceivedQty;
      data.pendingQty = vm.lineLevelDetail.totalPendingQty;
      data.mfgName = vm.lineLevelDetail.mfgcodeName;
      data.poId = vm.lineLevelDetail.refPurchaseOrderID;
      DialogFactory.dialogService(
        CORE.PURCHASE_ORDER_RECEIVED_QTY_DETAILS_POPUP_CONTROLLER,
        CORE.PURCHASE_ORDER_RECEIVED_QTY_DETAILS_POPUP_VIEW,
        event,
        data
      ).then(() => { }, () => { });
    };
  }
})();

