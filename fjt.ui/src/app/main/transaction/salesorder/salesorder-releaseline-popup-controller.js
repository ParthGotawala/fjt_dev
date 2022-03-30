(function () {
  'use strict';

  angular
    .module('app.transaction.salesorder')
    .controller('SalesOrderReleaseLinePopupController', SalesOrderReleaseLinePopupController);

  /** @ngInject */
  function SalesOrderReleaseLinePopupController($mdDialog, CORE, WorkorderFactory,
    data, BaseService, DialogFactory, USER, SalesOrderFactory, GenericCategoryFactory, $q, CustomerFactory, $timeout, TRANSACTION) {
    const vm = this;
    vm.releaseLineDetail = [];
    const CategoryTypeObjList = angular.copy(CORE.CategoryType);
    vm.soDetail = data || {};
    vm.BUTTON_TYPE = CORE.POPUP_FOOTER_BUTTON;
    vm.lineLevelDetail = data.rowDetail || {};
    vm.customerID = data.customerID;
    vm.isdisabled = vm.soDetail.isDisable || vm.lineLevelDetail.salesOrderDetStatus !== 1;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.ischange = false; // this flag is used to record form level changes
    vm.LabelConstant = CORE.LabelConstant;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.EmptyMesssage = CORE.EMPTYSTATE.RELEASE_LINE;
    vm.assyPartCategory = CORE.PartCategory.SubAssembly;
    vm.BlanketPODetails = TRANSACTION.BLANKETPOOPTIONDET;
    vm.soReleaseLineStatusFilter = angular.copy(TRANSACTION.SO_RELEASE_LINE_STATUS_FILTER);
    vm.releaseLineStatus = TRANSACTION.SO_RELEASE_LINE_STATUS.OPEN; //  default value
    vm.soReleaseLineStatusCode = TRANSACTION.SO_RELEASE_LINE_STATUS;
    vm.partCategoryConst = angular.copy(CORE.PartCategory);

    // get release line level detail for selected po line
    const getSalesOrderLineDetail = () => {
      vm.up = true;
      vm.cgBusyLoading = SalesOrderFactory.getSalesOrderReleaseLineDetail().query({ soDetID: vm.lineLevelDetail.id }).$promise.then((response) => {
        if (response && response.data && response.data.soReleaseDetail) {
          _.each(response.data.soReleaseDetail, (releaseData) => {
            releaseData.shippingDateOptions = {
              appendToBody: true,
              shippingDateOpenFlag: false,
              minDate: vm.soDetail.poDate
            };
            releaseData.dockDateOptions = {
              appendToBody: true,
              dockDateOpenFlag: false,
              minDate: vm.soDetail.poDate
            };
            releaseData.promisedDateOptions = {
              appendToBody: true,
              promisedDateOpenFlag: false,
              minDate: vm.soDetail.poDate
            };
            releaseData.revisedDockDateOptions = {
              appendToBody: true,
              dockDateOpenFlag: false,
              minDate: vm.soDetail.poDate
            };
            releaseData.revisedshippingDateOptions = {
              appendToBody: true,
              shippingDateOpenFlag: false,
              minDate: vm.soDetail.poDate
            };
            releaseData.revisedpromisedDateOptions = {
              appendToBody: true,
              promisedDateOpenFlag: false,
              minDate: vm.soDetail.poDate
            };
            releaseData.isAgreeToShip = releaseData.isAgreeToShip ? true : false;
            releaseData.isReadyToShip = releaseData.isReadyToShip ? true : false;
            //check for ship and open qty
            releaseData.shippedQty = releaseData.shippedQty || 0;
            releaseData.openQty = (releaseData.qty - releaseData.shippedQty) > 0 ? (releaseData.qty - releaseData.shippedQty) : 0;
            releaseData.autoCompleteShipping = angular.copy(defaultAutoCompleteShipping);
            releaseData.autoCompleteShipping.keyColumnId = releaseData.shippingMethodID || null;
            // releaseData.ShippingTypeList = _.clone(vm.ShippingTypeList);
            // set carrier autocomplete
            releaseData.autoCompleteCarrier = _.clone(defaultAutoCompleteCarrier);
            // releaseData.carrierList = _.clone(vm.carrierList);
            releaseData.autoCompleteCarrier.keyColumnId = releaseData.carrierID || null;
            // set shipping address autocomplete
            releaseData.autoCompleteAddress = _.clone(defaultAutoCompleteSalesAddress);
            // releaseData.customerAddressList = _.clone(vm.ShippingAddressList);
            releaseData.autoCompleteAddress.keyColumnId = releaseData.shippingAddressID || null;

            releaseData.autoCompleteContactPerson = _.clone(defaultAutoCompleteContactPerson);
            // releaseData.customerAddressList = _.clone(vm.ShippingAddressList);
            releaseData.autoCompleteContactPerson.keyColumnId = releaseData.shippingContactPersonID || null;

            releaseData.shippingDate = BaseService.getUIFormatedDate(releaseData.shippingDate, vm.DefaultDateFormat);
            releaseData.promisedShipDate = BaseService.getUIFormatedDate(releaseData.promisedShipDate, vm.DefaultDateFormat);
            releaseData.requestedDockDate = BaseService.getUIFormatedDate(releaseData.requestedDockDate, vm.DefaultDateFormat);

            releaseData.revisedRequestedDockDate = BaseService.getUIFormatedDate(releaseData.revisedRequestedDockDate, vm.DefaultDateFormat);
            releaseData.revisedRequestedShipDate = BaseService.getUIFormatedDate(releaseData.revisedRequestedShipDate, vm.DefaultDateFormat);
            releaseData.revisedRequestedPromisedDate = BaseService.getUIFormatedDate(releaseData.revisedRequestedPromisedDate, vm.DefaultDateFormat);

            releaseData.copyOpenQty = releaseData.openQty || 0;
          });
          vm.releaseLineDetail = response.data.soReleaseDetail;
          vm.releaseLineDetailCopy = angular.copy(response.data.soReleaseDetail);
          vm.openQtyList = _.filter(vm.releaseLineDetailCopy, (item) => item.openQty);
          const totalReleaseQty = _.sumBy(vm.releaseLineDetailCopy, (item) => parseInt(item.qty || 0));
          if (vm.openQtyList.length === 0 && vm.releaseLineDetailCopy.length !== 0 && vm.releaseLineStatus !== vm.soReleaseLineStatusCode.COMPLETED && totalReleaseQty === parseInt(vm.lineLevelDetail.qty)) {
            vm.alllineCompleted = true;
          }
          if (vm.openQtyList.length === vm.releaseLineDetailCopy.length && vm.releaseLineDetailCopy.length !== 0 && vm.releaseLineStatus === vm.soReleaseLineStatusCode.COMPLETED) {
            vm.nolineCompleted = true;
          }
          bindHeaderData();
          vm.addnewRecord(true);
          $timeout(() => {
            vm.ischange = false;
          });
        }
        if (response && response.data && response.data.soSalesDetail) {
          vm.releaseLevelComment = response.data.soSalesDetail[0].releaseLevelComment;
          vm.partcategory = response.data.soSalesDetail[0].partCategory;
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
        $mdDialog.cancel(vm.saveSubmitted);
      }
    };

    //add new record
    vm.addnewRecord = (isload) => {
      const maxObj = _.maxBy(vm.releaseLineDetail, (item) => parseInt(item.customerReleaseLine));
      const obj = {
        promisedShipDate: null,
        shippingDate: null,
        revisedRequestedDockDate: null,
        revisedRequestedShipDate: null,
        revisedRequestedPromisedDate: null,
        qty: null,
        releaseNumber: vm.releaseLineDetail.length + 1,
        releaseNotes: null,
        description: null,
        customerReleaseLine: maxObj && !isNaN(maxObj.customerReleaseLine) ? parseInt(maxObj.customerReleaseLine) + 1 : 1,
        sDetID: vm.lineLevelDetail.id,
        shippingDateOptions: {
          appendToBody: true,
          shippingDateOpenFlag: false,
          minDate: vm.soDetail.poDate
        },
        dockDateOptions: {
          appendToBody: true,
          dockDateOpenFlag: false,
          minDate: vm.soDetail.poDate
        },
        promisedDateOptions: {
          appendToBody: true,
          promisedDateOpenFlag: false,
          minDate: vm.soDetail.poDate
        },
        revisedDockDateOptions: {
          appendToBody: true,
          dockDateOpenFlag: false,
          minDate: vm.soDetail.poDate
        },
        revisedshippingDateOptions: {
          appendToBody: true,
          shippingDateOpenFlag: false,
          minDate: vm.soDetail.poDate
        },
        revisedpromisedDateOptions: {
          appendToBody: true,
          promisedDateOpenFlag: false,
          minDate: vm.soDetail.poDate
        },
        autoCompleteShipping: angular.copy(defaultAutoCompleteShipping),
        // ShippingTypeList: _.clone(vm.ShippingTypeList),
        autoCompleteCarrier: _.clone(defaultAutoCompleteCarrier),
        // carrierList: _.clone(vm.carrierList),
        autoCompleteAddress: _.clone(defaultAutoCompleteSalesAddress),
        autoCompleteContactPerson: _.clone(defaultAutoCompleteContactPerson),
        //  customerAddressList: _.clone(vm.ShippingAddressList),
        shippedQty: 0,
        poReleaseNumber: vm.BlanketPODetails.USEBPOANDRELEASE === vm.soDetail.blanketPOOption ? stringFormat('{0}-{1}', vm.soDetail.poNumber, vm.releaseLineDetail.length + 1) : null
      };
      obj.autoCompleteShipping.keyColumnId = null;
      obj.autoCompleteAddress.keyColumnId = null;
      obj.autoCompleteContactPerson.keyColumnId = null;
      obj.autoCompleteCarrier.keyColumnId = null;
      vm.releaseLineDetail.push(obj);
      $timeout(() => {
        sortingReleaseLine(isload);
      }, 1000);
    };
    // set focus
    const setFocusonFirstLine = () => {
      let index = 0;
      if (vm.up) {
        index = vm.releaseLineDetail.length - 1;
      }
      setFocus(stringFormat('qty{0}', index));
    };
    //remove record
    vm.removeRow = (item) => {
      if (item.shippingID) {
        cellEditable(item, true).then((cellresponse) => {
          if (cellresponse) {
            if (vm.salesShippedStatus && vm.salesShippedStatus.shippedqty) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SO_SHIPPING_DET_REMOVE_VALIDATION);
              messageContent.message = stringFormat(messageContent.message, item.releaseNumber, vm.salesShippedStatus.packingSlipNumber || '');
              const model = {
                multiple: true,
                messageContent: messageContent
              };
              return DialogFactory.messageAlertDialog(model).then(() => {
              }).catch(() => BaseService.getErrorLog(error));
            } else if (vm.usedWorkOrderList) {
              const shipping = _.find(vm.usedWorkOrderList, (item) => item.shippingID === row.shippingID);
              if (shipping) {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.PRODUCTION_STARTED_NOT_ALLOW_ANY_CHANGE);
                const model = {
                  messageContent: messageContent,
                  multiple: true
                };
                DialogFactory.messageAlertDialog(model);
                return false;
              }
              else {
                releaseLineDetail(item);
              }
            }
          }
        });
      } else {
        const index = vm.releaseLineDetail.indexOf(item);
        if (index > -1) {
          vm.releaseLineDetail.splice(index, 1);
          setFocusonFirstLine();
        }
      }
    };
    // remove so release line detail
    const releaseLineDetail = (item) => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
      messageContent.message = stringFormat(messageContent.message, 'Shipping', 1);
      const objs = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(objs).then((yes) => {
        if (yes) {
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
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    };
    vm.changValue = () => {
      vm.ischange = true;
    };
    // save Sales release line detail
    vm.saveSalesLineDetails = (iscontinue, buttonCategory) => {
      vm.isbuttondisabled = true;
      if (!vm.ischange) {
        if (BaseService.focusRequiredField(vm.releaselineform)) {
          if (buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
            $mdDialog.hide();
          }
        }
        vm.isbuttondisabled = false;
      } else {
        checkReleaseLineDetail();
        if (vm.isvalid) {
          if (vm.releaseLineDetail.length === 0) { vm.addnewRecord(); }
          commonLineDetail(iscontinue);
        } else if (!vm.ispopupOpen) { callBackFn(); vm.isbuttondisabled = false; }
        else { vm.isbuttondisabled = false; }
      }
    };
    //common code to save release line detail
    const commonLineDetail = (iscontinue) => {
      const releaseLineList = [];
      const differnceChange = [];
      _.each(vm.releaseLineDetail, (plann) => {
        if (!plann.isTBD) {
          const objExists = _.find(vm.releaseLineDetailCopy, (detCopy) => plann.shippingID && detCopy.shippingID === plann.shippingID);
          if (objExists) {
            if (BaseService.getAPIFormatedDate(plann.revisedRequestedDockDate) !== BaseService.getAPIFormatedDate(objExists.revisedRequestedDockDate)) {
              const objRelease = {
                releaseNumber: objExists.releaseNumber,
                customerReleaseLine: objExists.customerReleaseLine,
                fieldName: 'Requested Dock Date (Revised)',
                oldValue: objExists.revisedRequestedDockDate,
                newValue: plann.revisedRequestedDockDate
              };
              differnceChange.push(objRelease);
            }
            if (BaseService.getAPIFormatedDate(plann.revisedRequestedShipDate) !== BaseService.getAPIFormatedDate(objExists.revisedRequestedShipDate)) {
              const objRelease = {
                releaseNumber: objExists.releaseNumber,
                customerReleaseLine: objExists.customerReleaseLine,
                fieldName: 'Requested Ship Date (Revised)',
                oldValue: objExists.revisedRequestedShipDate,
                newValue: plann.revisedRequestedShipDate
              };
              differnceChange.push(objRelease);
            }
            if (BaseService.getAPIFormatedDate(plann.revisedRequestedPromisedDate) !== BaseService.getAPIFormatedDate(objExists.revisedRequestedPromisedDate)) {
              const objRelease = {
                releaseNumber: objExists.releaseNumber,
                customerReleaseLine: objExists.customerReleaseLine,
                fieldName: 'Promised Ship Date (Revised)',
                oldValue: objExists.revisedRequestedPromisedDate,
                newValue: plann.revisedRequestedPromisedDate
              };
              differnceChange.push(objRelease);
            }
          }
          const objReleaseLineDet = {
            shippingDate: BaseService.getAPIFormatedDate(plann.shippingDate),
            promisedShipDate: BaseService.getAPIFormatedDate(plann.promisedShipDate),
            requestedDockDate: BaseService.getAPIFormatedDate(plann.requestedDockDate),
            revisedRequestedDockDate: BaseService.getAPIFormatedDate(plann.revisedRequestedDockDate),
            revisedRequestedShipDate: BaseService.getAPIFormatedDate(plann.revisedRequestedShipDate),
            revisedRequestedPromisedDate: BaseService.getAPIFormatedDate(plann.revisedRequestedPromisedDate),
            isAgreeToShip: plann.isAgreeToShip,
            carrierID: plann.autoCompleteCarrier.keyColumnId || null,
            shippingAddressID: plann.autoCompleteAddress.keyColumnId || null,
            shippingContactPersonID: plann.autoCompleteContactPerson.keyColumnId || null,
            shippingMethodID: plann.autoCompleteShipping.keyColumnId || null,
            releaseNotes: plann.releaseNotes || null,
            shippingID: plann.shippingID,
            customerReleaseLine: plann.customerReleaseLine,
            qty: plann.qty,
            description: plann.description,
            releaseNumber: plann.releaseNumber,
            carrierAccountNumber: plann.carrierAccountNumber,
            sDetID: plann.sDetID,
            isReadyToShip: plann.isReadyToShip,
            poReleaseNumber: plann.poReleaseNumber
          };
          releaseLineList.push(objReleaseLineDet);
        }
      });
      if (differnceChange.length > 0) {
        DialogFactory.dialogService(
          CORE.VIEW_SO_RELEASE_DETAIL_CONFIRM_MODAL_CONTROLLER,
          CORE.VIEW_SO_RELEASE_DETAIL_CONFIRM_MODAL_VIEW,
          null,
          differnceChange).then(() => {
          }, (data) => {
            if (data) {
              saveSalesOrderConfirmDetail(releaseLineList, iscontinue);
            } else { vm.isbuttondisabled = false; setFocus('saveBtn'); }
          }, (err) => BaseService.getErrorLog(err));
      } else {
        saveSalesOrderConfirmDetail(releaseLineList, iscontinue);
      }
    };
    // save sales order release line detail
    const saveReleaseLineDetail = (releaseLineList, iscontinue) => {
      const objReleaseLine = {
        id: vm.lineLevelDetail.id,
        SODetail: releaseLineList,
        isSOrevision: vm.isSOrevision,
        isAskForVersionConfirmation: parseInt(vm.soDetail.status) ? false : vm.isAskForVersionConfirmation,
        soID: vm.soDetail.soID,
        releaseLevelComment: vm.releaseLevelComment,
        blanketPOID: vm.lineLevelDetail.refBlanketPOID
      };
      vm.cgBusyLoading = SalesOrderFactory.saveSalesOrderLineDetail().query(objReleaseLine).$promise.then(() => {
        vm.isbuttondisabled = false;
        vm.saveSubmitted = true;
        if (objReleaseLine.isSOrevision) {
          vm.soDetail.version = parseInt(vm.soDetail.version || 0) + 1;
        }
        if (iscontinue) {
          vm.ResetAll();
        } else {
          BaseService.currentPagePopupForm.pop();
          $mdDialog.cancel(vm.saveSubmitted);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    // save sales order detail
    const saveSalesOrderConfirmDetail = (objSoDet, iscontinue) => {
      vm.isAskForVersionConfirmation = true;
      const newRevision = (parseInt(vm.soDetail.version || 0) + 1) < 10 ? stringFormat('0{0}', (parseInt(vm.soDetail.version || 0) + 1)) : (parseInt(vm.soDetail.version || 0) + 1).toString();
      if (vm.isAskForVersionConfirmation && parseInt(vm.soDetail.status)) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.PUBLISHED_TRANS_UPDATE_REVISION_CONFIRMATION);
        messageContent.message = stringFormat(messageContent.message, 'Sales Order', vm.soDetail.version, newRevision);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.isSOrevision = true;
            saveReleaseLineDetail(objSoDet, iscontinue);
          }
        }, () => {
          vm.isSOrevision = false;
          saveReleaseLineDetail(objSoDet, iscontinue);
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.isSOrevision = false;
        saveReleaseLineDetail(objSoDet, iscontinue);
      }
    };
    function callBackFn() {
      vm.ispopupOpen = false;
      ispoOpen = false;
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
          setFocus('promised' + index);
        }
        else if (item.invaliddockdate) {
          item.requestedDockDate = null;
          setFocus('dock' + index);
        }
        else if (item.invalidreviseddockdate) {
          item.revisedRequestedDockDate = null;
          setFocus('dockrevised' + index);
        }
        else if (item.invalidrevisedshipdate) {
          item.revisedRequestedShipDate = null;
          setFocus('revisedship' + index);
        }
        else if (item.invalidrevisedpromiseddate) {
          item.revisedRequestedPromisedDate = null;
          setFocus('revisedpromised' + index);
        } else if (item.invalidPOReleaseNumber) {
          setFocus('poReleaseNumber' + index);
        }
      });
      isOpen = false;
    }
    let isOpen = false;
    //check detail before save
    const checkReleaseLineDetail = () => {
      vm.isvalid = true;
      vm.releaseLineDetail = _.filter(vm.releaseLineDetail, (item) => !item.isTBD && (item.qty || item.shippingDate || item.requestedDockDate || item.promisedShipDate || item.releaseNotes || item.description || item.autoCompleteShipping.keyColumnId || item.autoCompleteCarrier.keyColumnId || item.autoCompleteAddress.keyColumnId || item.carrierAccountNumber));
      _.each(vm.releaseLineDetail, (releaseLine) => {
        releaseLine.invalidshipdate = false;
        releaseLine.invalidpromiseddate = false;
        releaseLine.invaliddockdate = false;
        releaseLine.invalidPOReleaseNumber = false;
        if (vm.BlanketPODetails.USEBPOANDRELEASE === vm.soDetail.blanketPOOption && !releaseLine.poReleaseNumber) {
          releaseLine.invalidPOReleaseNumber = true; vm.isvalid = false;
        }
        if (!releaseLine.qty) { releaseLine.invalidqty = true; vm.isvalid = false; } else { releaseLine.invalidqty = false; }
        if (!releaseLine.promisedShipDate) { releaseLine.invalidpromiseddate = true; vm.isvalid = false; } else { releaseLine.invalidpromiseddate = false; }
        if (releaseLine.shippingDate && vm.soDetail.poDate && (new Date(releaseLine.shippingDate)).setHours(0, 0, 0, 0) < (new Date(vm.soDetail)).setHours(0, 0, 0, 0)) {
          releaseLine.invalidshipdate = true; vm.isvalid = false;
        }
        if (releaseLine.promisedShipDate && vm.soDetail && (new Date(releaseLine.promisedShipDate)).setHours(0, 0, 0, 0) < (new Date(vm.soDetail)).setHours(0, 0, 0, 0)) {
          releaseLine.invalidpromiseddate = true; vm.isvalid = false;
        }
        if (releaseLine.requestedDockDate && vm.soDetail && (new Date(releaseLine.requestedDockDate)).setHours(0, 0, 0, 0) < (new Date(vm.soDetail)).setHours(0, 0, 0, 0)) {
          releaseLine.invaliddockdate = true; vm.isvalid = false;
        }
        if (!releaseLine.requestedDockDate && !releaseLine.shippingDate) {
          releaseLine.invaliddockdate = true; vm.isvalid = false;
        }
        if (releaseLine.isAgreeToShip && !releaseLine.revisedRequestedPromisedDate) {
          releaseLine.invalidrevisedpromiseddate = true; vm.isvalid = false;
        } else { releaseLine.invalidrevisedpromiseddate = false; }
        if (releaseLine.revisedRequestedShipDate && vm.soDetail.poDate && (new Date(releaseLine.revisedRequestedShipDate)).setHours(0, 0, 0, 0) < (new Date(vm.soDetail)).setHours(0, 0, 0, 0)) {
          releaseLine.invalidrevisedshipdate = true; vm.isvalid = false;
        }
        if (releaseLine.revisedRequestedPromisedDate && vm.soDetail && (new Date(releaseLine.revisedRequestedPromisedDate)).setHours(0, 0, 0, 0) < (new Date(vm.soDetail)).setHours(0, 0, 0, 0)) {
          releaseLine.invalidrevisedpromiseddate = true; vm.isvalid = false;
        }
        if (releaseLine.revisedRequestedDockDate && vm.soDetail && (new Date(releaseLine.revisedRequestedDockDate)).setHours(0, 0, 0, 0) < (new Date(vm.soDetail)).setHours(0, 0, 0, 0)) {
          releaseLine.invalidreviseddockdate = true; vm.isvalid = false;
        }
        if (releaseLine.isAgreeToShip && !releaseLine.revisedRequestedDockDate && !releaseLine.revisedRequestedShipDate) {
          releaseLine.invalidreviseddockdate = true; vm.isvalid = false;
        }
      });
      if (vm.isvalid) {
        const totalQty = _.sumBy(vm.releaseLineDetail, (item) => parseInt(item.qty || 0));
        if (totalQty > vm.lineLevelDetail.qty) {
          vm.isvalid = false;
          vm.ispopupOpen = true;
          vm.releaseLineDetail[vm.releaseLineDetail.length - 1].invalidqty = true;
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.POQTY_RELEASELINEQTY_MISMATCH_INFORMATION);
          messageContent.message = stringFormat(messageContent.message, 'Total Release Qty', 'Total PO Qty');
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model, callBackFn);
        }
      }
    };
    //check for new line item
    // DateType
    // 1- PO Date
    vm.checkForNewLine = (item, isLastDate) => {
      if (vm.isdisabled) { return; }
      if (isOpen) { return; }
      if (item.shippingDateOptions.shippingDateOpenFlag || item.promisedDateOptions.promisedDateOpenFlag || item.dockDateOptions.dockDateOpenFlag || isOpen) {
        return;
      }
      if (!vm.checkDetails()) {
        vm.addnewRecord();
      } else if (isLastDate) {
        const index = vm.releaseLineDetail.indexOf(item);
        setFocus('qty' + (index + 1));
      }
      if (isNaN(item.qty)) {
        item.qty = null;
      }
      if (item.shippingDate && vm.lineLevelDetail.poDate && (new Date(item.shippingDate)).setHours(0, 0, 0, 0) < (new Date(vm.lineLevelDetail.poDate)).setHours(0, 0, 0, 0)) {
        item.invalidshipdate = true;
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DATE_COMPARE_VALIDATION);
        messageContent.message = stringFormat(messageContent.message, 'Requested Ship Date', 'PO Date');
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
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DATE_COMPARE_VALIDATION);
        messageContent.message = stringFormat(messageContent.message, 'Promised Ship Date', 'PO Date');
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
      if (item.requestedDockDate && vm.lineLevelDetail.poDate && (new Date(item.requestedDockDate)).setHours(0, 0, 0, 0) < (new Date(vm.lineLevelDetail.poDate)).setHours(0, 0, 0, 0)) {
        item.invaliddockdate = true;
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DATE_COMPARE_VALIDATION);
        messageContent.message = stringFormat(messageContent.message, 'Requested Dock Date', 'PO Date');
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        isOpen = true;
        DialogFactory.messageAlertDialog(model, callBackFn);
        return;
      } else {
        item.invaliddockdate = false;
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
    vm.checkDetails = () => _.find(_.filter(vm.releaseLineDetail, (removeTBD) => !removeTBD.isTBD), (item) => !item.qty || !item.promisedShipDate || (!item.shippingDate && !item.requestedDockDate));
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
      BaseService.goToManufacturer(vm.lineLevelDetail.mfrID);
    };
    // go to part detailpage
    vm.goToPartDetail = () => {
      BaseService.goToComponentDetailTab(null, vm.lineLevelDetail.partID);
    };
    //go to purchase order detail
    vm.goToSalesOrderDeatil = (id) => {
      BaseService.goToManageSalesOrder(id || vm.soDetail.soID);
    };
    // go to purchase order list page
    vm.goToSalesOrderOrderNumber = () => {
      BaseService.goToSalesOrderList();
    };
    // bind header detail
    function bindHeaderData() {
      vm.headerdata = [];
      vm.headerdata.push({
        label: vm.LabelConstant.SalesOrder.PO,
        value: vm.soDetail.poNumber,
        isCopy: true,
        labelLinkFn: vm.goToSalesOrderOrderNumber,
        valueLinkFn: vm.goToSalesOrderDeatil,
        displayOrder: 1
      }, {
        label: vm.LabelConstant.SalesOrder.SO,
        value: vm.soDetail.soNumber,
        isCopy: true,
        displayOrder: 2,
        labelLinkFn: vm.goToSalesOrderOrderNumber,
        valueLinkFn: vm.goToSalesOrderDeatil
      }, {
        label: CORE.LabelConstant.SalesOrder.Revision,
        value: vm.soDetail.version,
        displayOrder: 3
      }, {
        label: vm.LabelConstant.SalesOrder.LineID,
        value: vm.lineLevelDetail.lineID,
        displayOrder: 4
      }, {
        label: vm.LabelConstant.MFG.MFG,
        value: vm.lineLevelDetail.mfrName,
        displayOrder: 5,
        labelLinkFn: vm.goToMFGList,
        valueLinkFn: vm.goToManufacturerDetail
      }, {
        label: vm.LabelConstant.MFG.MFGPN,
        value: vm.lineLevelDetail.mfgPN,
        displayOrder: 6,
        labelLinkFn: vm.goToPartList,
        valueLinkFn: vm.goToPartDetail,
        isCopy: true,
        isAssy: vm.lineLevelDetail.isCustom,
        imgParms: {
          imgPath: vm.lineLevelDetail.rohsIcon,
          imgDetail: vm.lineLevelDetail.rohsText
        }
      }, {
        label: vm.LabelConstant.SalesOrder.AssyIDPID,
        value: vm.lineLevelDetail.PIDCode,
        displayOrder: 7,
        labelLinkFn: vm.goToPartList,
        valueLinkFn: vm.goToPartDetail,
        isCopy: true,
        isAssy: vm.lineLevelDetail.isCustom,
        imgParms: {
          imgPath: vm.lineLevelDetail.rohsIcon,
          imgDetail: vm.lineLevelDetail.rohsText
        }
      });
      if (vm.lineLevelDetail.materialTentitiveDocDate) {
        vm.headerdata.push({
          label: vm.LabelConstant.SalesOrder.CCMPDD,
          value: vm.lineLevelDetail.materialTentitiveDocDate,
          displayOrder: 8
        });
      }
      if (vm.soDetail.blanketPOOption) {
        vm.headerdata.push({
          label: vm.LabelConstant.SalesOrder.BlanketPO,
          value: 'Yes',
          displayOrder: 3
        });
        vm.headerdata.push({
          label: vm.LabelConstant.SalesOrder.BlanketPOOption,
          value: vm.BlanketPODetails.USEBLANKETPO === vm.soDetail.blanketPOOption ? TRANSACTION.BLANKETPOOPTION[0].value : vm.BlanketPODetails.LINKBLANKETPO === vm.soDetail.blanketPOOption ? TRANSACTION.BLANKETPOOPTION[1].value : TRANSACTION.BLANKETPOOPTION[2].value,
          displayOrder: 3
        });
      }
      if (vm.soDetail.isLegacyPO) {
        vm.headerdata.push({
          label: vm.LabelConstant.SalesOrder.LegacyPo,
          value: 'Yes',
          displayOrder: 3
        });
      }
      if (vm.soDetail.isRmaPO) {
        vm.headerdata.push({
          label: vm.LabelConstant.SalesOrder.RMAPo,
          value: 'Yes',
          displayOrder: 3
        });
      }
    }
    // popup form validation
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.releaselineform);
      const autocompletePromise = [getShippingList(), getCarrierList(), getCustomerAddress(), getCustomerContactPersonList()];
      vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
        getSalesOrderLineDetail();
      }).catch((error) => BaseService.getErrorLog(error));
      setFocus(stringFormat('qty{0}', vm.releaseLineDetail.length - 1));
    });

    vm.totalQty = () => {
      var total = (_.sumBy(_.filter(vm.releaseLineDetail, (solist) => !solist.isTBD), (o) => parseInt(o.qty ? o.qty : 0)));
      if (!isNaN(total)) {
        return total;
      }
      return 0;
    };
    // total ship qty
    vm.totalShipedQty = () => {
      var total = (_.sumBy(_.filter(vm.releaseLineDetail, (solist) => !solist.isTBD), (o) => parseInt(o.shippedQty ? o.shippedQty : 0)));
      if (!isNaN(total)) {
        return total;
      }
      return 0;
    };
    // total open qty
    vm.totalOpenedQty = () => {
      var total = (_.sumBy(_.filter(vm.releaseLineDetail, (solist) => !solist.isTBD), (o) => parseInt(o.openQty ? o.openQty : 0)));
      if (!isNaN(total)) {
        return total;
      }
      return 0;
    };
    //reset all the release line details
    vm.ResetAll = () => {
      vm.ischange = false;
      vm.isbuttondisabled = false;
      if (vm.releaselineform) {
        vm.releaselineform.$setPristine();
        vm.releaselineform.$setUntouched();
      }
      getSalesOrderLineDetail();
    };
    /*
    * Author :  Champak Chaudhary
    * Purpose : Get customer detail
    */
    const getShippingList = () => {
      const GencCategoryType = [];
      GencCategoryType.push(CategoryTypeObjList.ShippingType.Name);
      const listObj = {
        GencCategoryType: GencCategoryType,
        isActive: vm.id ? true : false
      };
      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((shipping) => {
        if (shipping && shipping.data) {
          vm.ShippingTypeList = shipping.data;
          _.each(shipping.data, (item) => {
            if (item.gencCategoryCode) {
              item.gencCategoryDisplayName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.gencCategoryCode, item.gencCategoryName);
            }
            else {
              item.gencCategoryDisplayName = item.gencCategoryName;
            }
          });
          return $q.resolve(vm.ShippingTypeList);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };


    /*const selectShippingMethod = (selectedItem, fromItem) => {
      vm.ischange = true;
      if (param && param.autoCompleteCarriers && (item.carrierID !== param.carrierID || param.autoCompleteCarriers.keyColumnId !== item.carrierID)) {
        if (item.carrierID && item.carrierID !== param.carrierID) {
          const model = {
            messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.UPDATE_SHIPPING_METHOD_CONFIRMATION),
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(model).then(() => {
            param.autoCompleteCarriers.keyColumnId = item.carrierID;
          }, () => {
            param.autoCompleteCarriers.keyColumnId = param.carrierID;
            param.autoCompleteShipping.keyColumnId = param.shippingMethodID;
          });
        } else {
          param.autoCompleteCarriers.keyColumnId = item.carrierID;
        }
      } else if (!param) {
        param.carrierAccountNumber = null;
        param.autoCompleteCarriers.keyColumnId = null;
      }
    };*/

    /*
  * Author :  Champak Chaudhary
  * Purpose : Get carrier detail
  */
    const getCarrierList = () => {
      const GencCategoryType = [];
      GencCategoryType.push(CategoryTypeObjList.Carriers.Name);
      const listObj = {
        GencCategoryType: GencCategoryType,
        isActive: true
      };
      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((carrier) => {
        if (carrier && carrier.data) {
          vm.carrierList = carrier.data;
          _.each(carrier.data, (item) => {
            if (item.gencCategoryCode) {
              item.gencCategoryDisplayName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.gencCategoryCode, item.gencCategoryName);
            }
            else {
              item.gencCategoryDisplayName = item.gencCategoryName;
            }
          });
          return $q.resolve(vm.carrierList);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /*
    * Author :  Champak Chaudhary
    * Purpose : Get customer address
    */
    const getCustomerAddress = () => CustomerFactory.customerAddressList().query({
      customerId: vm.customerID,
      addressType: [CORE.AddressType.ShippingAddress],
      refTableName: CORE.TABLE_NAME.MFG_CODE_MST
    }).$promise.then((customeraddress) => {
      _.each(customeraddress.data, (item) => {
        item.FullAddress = stringFormat('{0}, {1}, {2}, {3}-{4}', item.street1, item.city, item.state, item.countryMst.countryName, item.postcode);
      });
      vm.ShippingAddressList = _.filter(customeraddress.data, (item) => item.addressType === 'S');
      return $q.resolve(vm.ContactAddress);
    }).catch((error) => BaseService.getErrorLog(error));

    const getCustomerContactPersonList = () => CustomerFactory.getCustomerContactPersons().query({
      refTransID: vm.customerID,
      refTableName: CORE.TABLE_NAME.MFG_CODE_MST
    }).$promise.then((contactperson) => {
      if (contactperson && contactperson.data) {
        vm.ContactPersonList = contactperson.data;
        return $q.resolve(vm.ContactPersonList);
      }
    }).catch((error) => BaseService.getErrorLog(error));

    // sales order details autocomplete
    const defaultAutoCompleteShipping = {
      columnName: 'gencCategoryDisplayName',
      controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
      viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
      keyColumnName: 'gencCategoryID',
      keyColumnId: null,
      inputName: CategoryTypeObjList.ShippingType.Name,
      placeholderName: CategoryTypeObjList.ShippingType.Title,
      addData: {
        popupAccessRoutingState: [USER.ADMIN_SHIPPINGTYPE_MANAGEGENERICCATEGORY_STATE],
        pageNameAccessLabel: CORE.PageName.shippingMethods,
        headerTitle: CategoryTypeObjList.ShippingType.Title
      },
      isRequired: false,
      isAddnew: true,
      callbackFn: getShippingList,
      onSelectCallbackFn: (item, rowValue) => {
        vm.ischange = true;
        if (item && rowValue.autoCompleteCarrier && (item.carrierID !== rowValue.carrierID || rowValue.autoCompleteCarrier.keyColumnId !== item.carrierID)) {
          if (item.carrierID && rowValue.carrierID && item.carrierID !== rowValue.carrierID) {
            const model = {
              messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.UPDATE_SHIPPING_METHOD_CONFIRMATION),
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
            };
            DialogFactory.messageConfirmDialog(model).then(() => {
              rowValue.autoCompleteCarrier.keyColumnId = item.carrierID;
            }, () => {
              rowValue.autoCompleteCarrier.keyColumnId = rowValue.carrierID;
              rowValue.autoCompleteShipping.keyColumnId = rowValue.shippingMethodID;
            });
          } else {
            rowValue.autoCompleteCarrier.keyColumnId = item.carrierID;
          }
        } else if (!item) {
          rowValue.carrierAccountNumber = null;
          rowValue.autoCompleteCarrier.keyColumnId = null;
        }
      }
    };


    // shipping address
    const defaultAutoCompleteSalesAddress = {
      columnName: 'FullAddress',
      controllerName: USER.ADMIN_CUSTOMER_BILLING_SHIPPING_ADDRESSS_CONTROLLER,
      viewTemplateURL: USER.ADMIN_CUSTOMER_BILLING_SHIPPING_ADDRESSS_VIEW,
      keyColumnName: 'id',
      keyColumnId: null,
      inputName: vm.LabelConstant.Address.ShippingAddress,
      placeholderName: vm.LabelConstant.Address.ShippingAddress,
      addData: { addressType: 'S', companyNameWithCode: vm.soDetail.companyNameWithCode, companyName: vm.soDetail.companyName, customerId: vm.customerID },
      isRequired: false,
      isAddnew: true,
      callbackFn: getCustomerAddress,
      onSelectCallbackFn: (item, obj) => {
        if (item) {
          validateAndSetShippingAddress(item, obj);
        }
        vm.ischange = true;
      }
    };

    // validate selected shipping address
    const validateAndSetShippingAddress = (item, objLine) => {
      objLine.autoCompleteContactPerson.keyColumnId = objLine.shippingContactPersonID || item.contactPerson && item.contactPerson.personId;
      const objCopy = _.find(vm.releaseLineDetailCopy, (copyObj) => copyObj.shippingID && copyObj.shippingID === objLine.shippingID && copyObj.shippingAddressID !== item.id);
      //check  for export controll
      if (objCopy) {
        const bomPromise = [validateAssemblyByAssyID(item, objLine)];
        vm.cgBusyLoading = $q.all(bomPromise).then((resExp) => {
          if (resExp && resExp[0]) {
            // if no export error then continue further validation
            if (((objLine.shippingID && objCopy && objCopy.shippingAddressID !== item.id) || !objLine.shippingID) && (objLine.carrierID || objLine.carrierAccountNumber || objLine.shippingMethodID) && (item.carrierAccount || item.carrierID || item.shippingMethodID)) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SHIPPING_ADDR_CONFIRM_ALERT);
              const objConfirm = {
                messageContent: messageContent,
                btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
              };
              DialogFactory.messageConfirmDialog(objConfirm).then((yes) => {
                if (yes) {
                  objLine.carrierAccountNumber = item.carrierAccount || objLine.carrierAccountNumber;
                  objLine.autoCompleteCarrier.keyColumnId = item.carrierID || objLine.autoCompleteCarrier.keyColumnId;
                  objLine.autoCompleteShipping.keyColumnId = item.shippingMethodID || objLine.autoCompleteShipping.keyColumnId;
                }
              }, () => {
              });
            }
          } else {
            objLine.autoCompleteAddress.keyColumnId = null;
            objLine.autoCompleteContactPerson.keyColumnId = null;
            return;
          }
        });
      }
    };

    const validateAssemblyByAssyID = (selectedItem, objLine) => {
      const checkShippingAssyList = [];
      const dataArray = [vm.soDetail.rowDetail.partID];

      const shippingCountryDetObj = {};
      shippingCountryDetObj.countryID = selectedItem.countryID;
      shippingCountryDetObj.countryName = selectedItem.countryMst ? selectedItem.countryMst.countryName : '';
      shippingCountryDetObj.partID = vm.soDetail.rowDetail.partID;
      shippingCountryDetObj.qty = objLine.qty;
      shippingCountryDetObj.lineID = vm.soDetail.rowDetail.lineID;
      checkShippingAssyList.push(shippingCountryDetObj);

      const objCheckBOM = {
        partIDs: dataArray,
        shippingAddressID: selectedItem.id,
        isFromSalesOrder: true,
        checkShippingAssyList: checkShippingAssyList
      };
      return WorkorderFactory.validateAssemblyByAssyID().update({ obj: objCheckBOM }).$promise.then((response) => {
        if (response && response.data) {
          const resData = angular.copy(response.data);
          if (resData.errorObjList && resData.errorObjList.length > 0) {
            const errorMessage = _.map(resData.errorObjList, (obj) => { if (obj.isAlert) { return obj.errorText; } }).join('<br/>');
            if (errorMessage) {
              const obj = {
                multiple: true,
                title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
                textContent: errorMessage
              };
              DialogFactory.alertDialog(obj);
              return $q.resolve(false);
            }
            const errorMsg = _.find(resData.errorObjList, (obj) => obj.isMessage && obj.isShippingAddressError);
            if (errorMsg) {
              const assyInvalidShippingList = [];
              _.each(resData.exportControlPartList, (partItem) => {
                let objAssy = {};
                objAssy = _.assign(partItem);

                if (vm.soDetail.rowDetail.partID === partItem.partID) {
                  objAssy.PIDCode = vm.soDetail.rowDetail.PIDCode;
                  objAssy.partID = vm.soDetail.rowDetail.partID;
                  objAssy.rohsIcon = vm.soDetail.rowDetail.rohsIcon;
                  objAssy.rohsText = vm.soDetail.rowDetail.rohsText;
                  objAssy.mfgPN = vm.soDetail.rowDetail.mfgPN;
                  objAssy.nickName = vm.soDetail.rowDetail.nickName;
                  objAssy.description = vm.soDetail.rowDetail.description;
                  objAssy.isCustom = vm.soDetail.rowDetail.isCustom;
                  objAssy.custAssyPN = vm.soDetail.rowDetail.custAssyPN;
                  if (vm.soDetail.rowDetail.partType === vm.partCategoryConst.Component) {
                    if (objAssy.isCustom) {
                      objAssy.partTypeText = 'Custom Part';
                    } else {
                      objAssy.partTypeText = 'Off-the-shelf Part';
                    }
                  }
                  if (vm.soDetail.rowDetail.isCPN) {
                    objAssy.partTypeText = 'CPN Part';
                  }
                  if (vm.soDetail.rowDetail.partType === vm.partCategoryConst.SubAssembly) {
                    objAssy.partTypeText = 'Assembly';
                  }
                  objAssy.componentStandardList = vm.soDetail.rowDetail.standards;
                }
                assyInvalidShippingList.push(objAssy);
              });
              if (assyInvalidShippingList.length > 0) {
                const data = {
                  assyList: assyInvalidShippingList,
                  errorMessage: errorMsg.errorText,
                  salesOrderNumber: vm.soDetail.soNumber,
                  revision: vm.soDetail.version,
                  countryName: selectedItem.countryMst ? selectedItem.countryMst.countryName : '',
                  //countryName: vm.IntermediateAddress && vm.IntermediateAddress.countryMst && vm.IntermediateAddress.countryMst.countryName ? vm.IntermediateAddress.countryMst.countryName : vm.ShippingAddress.countryMst.countryName,
                  salesOrderID: vm.soDetail.soID,
                  isFromRelLine: true
                };
                return DialogFactory.dialogService(
                  CORE.VIEW_EXPORT_CONTROL_ASSY_LIST_MODAL_CONTROLLER,
                  CORE.VIEW_EXPORT_CONTROL_ASSY_LIST_MODAL_VIEW,
                  event,
                  data).then(() => $q.resolve(false), () => $q.resolve(false)
                    , (err) => {
                      BaseService.getErrorLog(err);
                      return $q.resolve(false);
                    });
              } else {
                return $q.resolve(true);
              }
            } else {
              return $q.resolve(true);
            }
          } else {
            return $q.resolve(true);
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // contact person
    const defaultAutoCompleteContactPerson = {
      columnName: 'fullName',
      controllerName: USER.ADMIN_CUSTOMER_BILLING_SHIPPING_ADDRESSS_CONTROLLER,
      viewTemplateURL: USER.ADMIN_CUSTOMER_BILLING_SHIPPING_ADDRESSS_VIEW,
      keyColumnName: 'personId',
      keyColumnId: null,
      inputName: 'Contact Person',
      placeholderName: 'Contact Person',
      addData: { customerId: vm.customerID, refTransID: vm.customerID, companyName: vm.soDetail.companyName, refTableName: CORE.TABLE_NAME.MFG_CODE_MST },
      isRequired: false,
      isAddnew: true,
      callbackFn: getCustomerContactPersonList,
      onSelectCallbackFn: (item, obj) => {
        if (!item) {
          obj.shippingContactPersonID = null;
        }
        vm.ischange = true;
      }
    };
    // carrier order details autocomplete
    const defaultAutoCompleteCarrier = {
      columnName: 'gencCategoryDisplayName',
      controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
      viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
      keyColumnName: 'gencCategoryID',
      keyColumnId: null,
      inputName: CategoryTypeObjList.Carriers.Title,
      placeholderName: CategoryTypeObjList.Carriers.singleLabel,
      addData: {
        popupAccessRoutingState: [USER.ADMIN_CARRIERMST_MANAGEGENERICCATEGORY_STATE],
        pageNameAccessLabel: CORE.PageName.Carrier,
        headerTitle: CategoryTypeObjList.Carriers.Name
      },
      isRequired: false,
      isAddnew: true,
      callbackFn: getCarrierList,
      onSelectCallbackFn: () => {
        vm.ischange = true;
      }
    };
    // check po release number empty or not
    vm.checkPOReleaseNumber = (item) => {
      if (vm.BlanketPODetails.USEBPOANDRELEASE === vm.soDetail.blanketPOOption) {
        if (item.poReleaseNumber) {
          item.invalidPOReleaseNumber = false;
        }
        vm.changValue();
      }
    };
    // check qty is valid or not
    let ispoOpen = false;
    vm.checkSOPOQty = (objReleaseLine) => {
      if (vm.totalQty() > vm.lineLevelDetail.qty && !ispoOpen) {
        ispoOpen = true;
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.POQTY_RELEASELINEQTY_MISMATCH_INFORMATION);
        messageContent.message = stringFormat(messageContent.message, 'Total Release Qty', 'Total PO Qty');
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model).then(() => {
          objReleaseLine.invalidqty = true;
          callBackFn();
        });
      } else if (!ispoOpen) {
        commonQtyCheckValidation(objReleaseLine);
      }
    };
    // update tbd pending qty
    vm.pendingTBDQty = () => {
      const planQty = (_.sumBy(vm.releaseLineDetail, (o) => parseInt(o.qty || 0)));
      const pendingTBD = (vm.lineLevelDetail.qty || 0) - planQty;
      return pendingTBD < 0 ? 0 : pendingTBD;
    };

    const commonQtyCheckValidation = (objReleaseLine) => {
      if (objReleaseLine.shippingID) {
        const originalQty = angular.copy(objReleaseLine.qty);
        const qtyObjRelease = _.find(vm.releaseLineDetailCopy, (item) => item.shippingID === objReleaseLine.shippingID);
        if (qtyObjRelease) {
          objReleaseLine.qty = qtyObjRelease.qty;
        }
        cellEditable(objReleaseLine).then((cellresponse) => {
          objReleaseLine.qty = originalQty;
          if (cellresponse) {
            objReleaseLine.shippedQty = vm.salesShippedStatus ? vm.salesShippedStatus.shippedqty || 0 : 0;
            objReleaseLine.openQty = objReleaseLine.qty ? (objReleaseLine.qty - objReleaseLine.shippedQty) > 0 ? (objReleaseLine.qty - objReleaseLine.shippedQty) : 0 : 0;
            if (vm.salesShippedStatus && parseInt(objReleaseLine.qty || 0) < vm.salesShippedStatus.shippedqty) {
              // aleart message for qty
              if (qtyObjRelease) {
                objReleaseLine.qty = qtyObjRelease.qty;
              }
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SO_RELEASE_LINE_QTY_ERROR_VALIDATION);
              messageContent.message = stringFormat(messageContent.message, vm.salesShippedStatus.shippedqty);
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              objReleaseLine.invalidqty = true;
              DialogFactory.messageAlertDialog(model, callBackFn);
            } else {
              objReleaseLine.invalidqty = false;
              vm.checkForNewLine(objReleaseLine);
            }
          }
        });
      } else {
        objReleaseLine.openQty = objReleaseLine.qty ? (objReleaseLine.qty - objReleaseLine.shippedQty) > 0 ? (objReleaseLine.qty - objReleaseLine.shippedQty) : 0 : 0;
        objReleaseLine.invalidqty = false;
        vm.checkForNewLine(objReleaseLine);
      }
    };
    vm.setNavigatePointer = (ev) => {
      vm.shiftKey = ev.shiftKey;
      vm.keyCode = ev.keyCode;
    };
    // check date validation
    vm.checkDateValidations = (objReleaseLine, type) => {
      if (type === 1) {
        if (objReleaseLine.shippingDate && (new Date(vm.soDetail.poDate)).setHours(0, 0, 0, 0) > (new Date(objReleaseLine.shippingDate)).setHours(0, 0, 0, 0)) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DATE_COMPARE_VALIDATION);
          messageContent.message = stringFormat(messageContent.message, 'Requested Ship Date (Orig.)', 'PO Date');
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          isOpen = true;
          objReleaseLine.shippingDate = null;
          objReleaseLine.invalidshipdate = true;
          DialogFactory.messageAlertDialog(model, callBackFn);
        } else if (objReleaseLine.shippingDate && !objReleaseLine.isShippingDateConfirm && vm.lineLevelDetail.materialTentitiveDocDate && (new Date(vm.lineLevelDetail.materialTentitiveDocDate)).setHours(0, 0, 0, 0) > (new Date(objReleaseLine.shippingDate)).setHours(0, 0, 0, 0)) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SO_CCMPDD_DATE_VALIDATION);
          messageContent.message = stringFormat(messageContent.message, 'Requested Ship Date (Orig.)');
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              objReleaseLine.isShippingDateConfirm = true;
              objReleaseLine.invalidshipdate = false;
              vm.checkForNewLine(objReleaseLine);
            }
          }, () => { objReleaseLine.invalidshipdate = true; objReleaseLine.shippingDate = null; callBackFn(); }).catch((error) => BaseService.getErrorLog(error));
        } else {
          objReleaseLine.invalidshipdate = false;
          vm.checkForNewLine(objReleaseLine);
        }
      } else if (type === 2) {
        if (objReleaseLine.requestedDockDate && (new Date(vm.soDetail.poDate)).setHours(0, 0, 0, 0) > (new Date(objReleaseLine.requestedDockDate)).setHours(0, 0, 0, 0)) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DATE_COMPARE_VALIDATION);
          messageContent.message = stringFormat(messageContent.message, 'Requested Dock Date', 'PO Date');
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          isOpen = true;
          objReleaseLine.requestedDockDate = null;
          objReleaseLine.invaliddockdate = true;
          DialogFactory.messageAlertDialog(model, callBackFn);
        } else if (!objReleaseLine.isrequestedDockDateConfirm && objReleaseLine.requestedDockDate && vm.lineLevelDetail.materialTentitiveDocDate && (new Date(vm.lineLevelDetail.materialTentitiveDocDate)).setHours(0, 0, 0, 0) > (new Date(objReleaseLine.requestedDockDate)).setHours(0, 0, 0, 0)) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SO_CCMPDD_DATE_VALIDATION);
          messageContent.message = stringFormat(messageContent.message, 'Requested Dock Date (Orig.)');
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              objReleaseLine.isrequestedDockDateConfirm = true;
              objReleaseLine.invaliddockdate = false;
              vm.checkForNewLine(objReleaseLine);
              if (!vm.shiftKey && vm.keyCode === 9) {
                //shift was down when tab was pressed
                const index = _.indexOf(vm.releaseLineDetail, objReleaseLine);
                setFocus('promised' + index);
              }
            }
          }, () => { objReleaseLine.invaliddockdate = true; objReleaseLine.requestedDockDate = null; callBackFn(); }).catch((error) => BaseService.getErrorLog(error));
        } else {
          objReleaseLine.invaliddockdate = false;
          vm.checkForNewLine(objReleaseLine);
          if (!vm.shiftKey && vm.keyCode === 9) {
            //shift was down when tab was pressed
            const index = _.indexOf(vm.releaseLineDetail, objReleaseLine);
            setFocus('promised' + index);
          }
        }
      } else {
        if (objReleaseLine.promisedShipDate && (new Date(vm.soDetail.poDate)).setHours(0, 0, 0, 0) > (new Date(objReleaseLine.promisedShipDate)).setHours(0, 0, 0, 0)) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DATE_COMPARE_VALIDATION);
          messageContent.message = stringFormat(messageContent.message, 'Promised Ship Date (Orig.)', 'PO Date');
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          isOpen = true;
          objReleaseLine.promisedShipDate = null;
          objReleaseLine.invalidpromiseddate = true;
          DialogFactory.messageAlertDialog(model, callBackFn);
        } else if (!objReleaseLine.promisedShipDateConfirm && objReleaseLine.promisedShipDate && vm.lineLevelDetail.materialTentitiveDocDate && (new Date(vm.lineLevelDetail.materialTentitiveDocDate)).setHours(0, 0, 0, 0) > (new Date(objReleaseLine.promisedShipDate)).setHours(0, 0, 0, 0)) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SO_CCMPDD_DATE_VALIDATION);
          messageContent.message = stringFormat(messageContent.message, 'Promised Ship Date (Orig.)');
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              objReleaseLine.autofocus = false;
              objReleaseLine.promisedShipDateConfirm = true;
              objReleaseLine.invalidpromiseddate = false;
              $timeout(() => {
                objReleaseLine.autofocus = true;
              });
              vm.checkForNewLine(objReleaseLine, true);
            }
          }, () => { objReleaseLine.invalidpromiseddate = true; objReleaseLine.promisedShipDate = null; callBackFn(); }).catch((error) => BaseService.getErrorLog(error));
        } else {
          objReleaseLine.invalidpromiseddate = false;
          vm.checkForNewLine(objReleaseLine, true);
        }
      }
    };

    // check date validation
    vm.checkRevisedDateValidations = (objReleaseLine, type) => {
      if (type === 1) {
        if (objReleaseLine.revisedRequestedShipDate && (new Date(vm.soDetail.poDate)).setHours(0, 0, 0, 0) > (new Date(objReleaseLine.revisedRequestedShipDate)).setHours(0, 0, 0, 0)) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DATE_COMPARE_VALIDATION);
          messageContent.message = stringFormat(messageContent.message, 'Requested Ship Date (Revised)', 'PO Date');
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          isOpen = true;
          objReleaseLine.revisedRequestedShipDate = null;
          objReleaseLine.invalidrevisedshipdate = true;
          DialogFactory.messageAlertDialog(model, callBackFn);
        } else if (objReleaseLine.revisedRequestedShipDate && !objReleaseLine.isRevisedShippingDateConfirm && vm.lineLevelDetail.materialTentitiveDocDate && (new Date(vm.lineLevelDetail.materialTentitiveDocDate)).setHours(0, 0, 0, 0) > (new Date(objReleaseLine.revisedRequestedShipDate)).setHours(0, 0, 0, 0)) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SO_CCMPDD_DATE_VALIDATION);
          messageContent.message = stringFormat(messageContent.message, 'Requested Ship Date (Revised)');
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              objReleaseLine.isRevisedShippingDateConfirm = true;
              objReleaseLine.invalidrevisedshipdate = false;
              vm.checkForNewLine(objReleaseLine);
            }
          }, () => { objReleaseLine.invalidrevisedshipdate = true; objReleaseLine.revisedRequestedShipDate = null; callBackFn(); }).catch((error) => BaseService.getErrorLog(error));
        } else {
          objReleaseLine.invalidrevisedshipdate = false;
          vm.checkForNewLine(objReleaseLine);
        }
      } else if (type === 2) {
        if (objReleaseLine.revisedRequestedDockDate && (new Date(vm.soDetail.poDate)).setHours(0, 0, 0, 0) > (new Date(objReleaseLine.revisedRequestedDockDate)).setHours(0, 0, 0, 0)) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DATE_COMPARE_VALIDATION);
          messageContent.message = stringFormat(messageContent.message, 'Requested Dock Date (Revised)', 'PO Date');
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          isOpen = true;
          objReleaseLine.revisedRequestedDockDate = null;
          objReleaseLine.invalidreviseddockdate = true;
          DialogFactory.messageAlertDialog(model, callBackFn);
        } else if (!objReleaseLine.isrevisedRequestedDockDateConfirm && objReleaseLine.revisedRequestedDockDate && vm.lineLevelDetail.materialTentitiveDocDate && (new Date(vm.lineLevelDetail.materialTentitiveDocDate)).setHours(0, 0, 0, 0) > (new Date(objReleaseLine.revisedRequestedDockDate)).setHours(0, 0, 0, 0)) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SO_CCMPDD_DATE_VALIDATION);
          messageContent.message = stringFormat(messageContent.message, 'Requested Dock Date (Revised)');
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              objReleaseLine.isrevisedRequestedDockDateConfirm = true;
              objReleaseLine.invalidreviseddockdate = false;
              vm.checkForNewLine(objReleaseLine);
              if (!vm.shiftKey && vm.keyCode === 9) {
                //shift was down when tab was pressed
                const index = _.indexOf(vm.releaseLineDetail, objReleaseLine);
                setFocus('revisedpromised' + index);
              }
            }
          }, () => { objReleaseLine.invalidreviseddockdate = true; objReleaseLine.revisedRequestedDockDate = null; callBackFn(); }).catch((error) => BaseService.getErrorLog(error));
        } else {
          objReleaseLine.invalidreviseddockdate = false;
          vm.checkForNewLine(objReleaseLine);
          if (!vm.shiftKey && vm.keyCode === 9) {
            //shift was down when tab was pressed
            const index = _.indexOf(vm.releaseLineDetail, objReleaseLine);
            setFocus('revisedpromised' + index);
          }
        }
      } else {
        if (objReleaseLine.revisedRequestedPromisedDate && (new Date(vm.soDetail.poDate)).setHours(0, 0, 0, 0) > (new Date(objReleaseLine.revisedRequestedPromisedDate)).setHours(0, 0, 0, 0)) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DATE_COMPARE_VALIDATION);
          messageContent.message = stringFormat(messageContent.message, 'Promised Ship Date (Revised)', 'PO Date');
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          isOpen = true;
          objReleaseLine.revisedRequestedPromisedDate = null;
          objReleaseLine.invalidrevisedpromiseddate = true;
          DialogFactory.messageAlertDialog(model, callBackFn);
        } else if (!objReleaseLine.revisedPromisedShipDateConfirm && objReleaseLine.revisedRequestedPromisedDate && vm.lineLevelDetail.materialTentitiveDocDate && (new Date(vm.lineLevelDetail.materialTentitiveDocDate)).setHours(0, 0, 0, 0) > (new Date(objReleaseLine.revisedRequestedPromisedDate)).setHours(0, 0, 0, 0)) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SO_CCMPDD_DATE_VALIDATION);
          messageContent.message = stringFormat(messageContent.message, 'Promised Ship Date (Revised)');
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              objReleaseLine.autofocus = false;
              objReleaseLine.revisedPromisedShipDateConfirm = true;
              objReleaseLine.invalidrevisedpromiseddate = false;
              $timeout(() => {
                objReleaseLine.autofocus = true;
              });
              vm.checkForNewLine(objReleaseLine);
            }
          }, () => { objReleaseLine.invalidrevisedpromiseddate = true; objReleaseLine.revisedRequestedPromisedDate = null; callBackFn(); }).catch((error) => BaseService.getErrorLog(error));
        } else {
          objReleaseLine.invalidrevisedpromiseddate = false;
          vm.checkForNewLine(objReleaseLine);
        }
      }
    };
    // change default sorting
    vm.changeSorting = () => {
      vm.up = !vm.up;
      sortingReleaseLine(true);
    };
    // check sorting object
    const sortingReleaseLine = () => {
      if (vm.up) {
        vm.releaseLineDetail = _.orderBy(vm.releaseLineDetail, ['releaseNumber'], ['asc']);
      } else {
        vm.releaseLineDetail = _.orderBy(vm.releaseLineDetail, ['releaseNumber'], ['desc']);
      }
      setFocusonFirstLine();
    };

    // check sales order line detail editable or not
    const cellEditable = (row, isremove) => {
      if (row.shippingID) {
        return SalesOrderFactory.retrieveSalesOrderDetailStatus().query({ id: vm.lineLevelDetail.id, releaseLineID: row.shippingID }).$promise.then((salesDet) => {
          if (salesDet && salesDet.data) {
            vm.salesDetStatus = _.head(salesDet.data.soReleaseStatus);
            vm.salesShippedStatus = salesDet.data.soShipStatus.length > 0 ? _.head(salesDet.data.soShipStatus) : null;
            if (vm.salesDetStatus.vQtyRelease || vm.salesDetStatus.vQtyWprkorder) {
              vm.salesDetDisable = true;
            } else { vm.salesDetDisable = false; }
            if (vm.salesShippedStatus && vm.salesShippedStatus.shippedqty >= (parseInt(row.qty))) {
              const messageContent = isremove ? angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SO_SHIPPING_DET_REMOVE_VALIDATION) : angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SO_SHIPPING_RELEASE_NOT_UPDATE);
              messageContent.message = stringFormat(messageContent.message, row.releaseNumber, vm.salesShippedStatus.packingSlipNumber || '');
              const model = {
                multiple: true,
                messageContent: messageContent
              };
              return DialogFactory.messageAlertDialog(model).then((yes) => {
                if (yes) {
                  return false;
                }
              }).catch(() => BaseService.getErrorLog(error));
            } else {
              return true;
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        vm.salesDetStatus = null;
        vm.salesDetDisable = false;
        return true;
      }
    };

    //check unique customer po line
    vm.checkCustomerReleaseLine = (otherLine) => {
      if (!otherLine.customerReleaseLine) { return; }
      const checkUnique = _.find(vm.releaseLineDetail, (item) => item.releaseNumber !== otherLine.releaseNumber && item.customerReleaseLine === otherLine.customerReleaseLine);
      if (checkUnique) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
        messageContent.message = stringFormat(messageContent.message, 'Cust Release#');
        const obj = {
          multiple: true,
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(obj).then((yes) => {
          if (yes) {
            otherLine.customerReleaseLine = null;
            const index = _.indexOf(vm.releaseLineDetail, otherLine);
            setFocus('customerRelease' + index);
          }
        }).catch(() => BaseService.getErrorLog(error));
      } else {
        otherLine.poReleaseNumber = vm.BlanketPODetails.USEBPOANDRELEASE === vm.soDetail.blanketPOOption ? stringFormat('{0}-{1}', vm.soDetail.poNumber, otherLine.customerReleaseLine) : null;
      }
    };

    // set nevigation while going for sorting
    vm.checkNextNevigation = (ev, item) => {
      if (!ev.shiftKey && ev.keyCode === 9 && !vm.up) {
        //shift was down when tab was pressed
        let index = vm.releaseLineDetail.indexOf(item);
        index = index - 1;
        $timeout(() => {
          setFocus('qty' + index);
        });
      }
    };
    // filter details
    vm.changeFilter = (relStatus) => {
      // console.log('change filter : ' + relStatus + ' old :' + vm.releaseLineStatusCopy);
      if (vm.ischange) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SO_FILTETR_COMPLETED_LINE_CONFIRMATION);
        const objs = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(objs).then((yes) => {
          if (yes) {
            vm.releaseLineStatusCopy = angular.copy(vm.relStatus);
            vm.releaseLineStatus = angular.copy(vm.relStatus);
            vm.alllineCompleted = vm.nolineCompleted = false;
            getSalesOrderLineDetail();
          }
        }, () => {
          vm.releaseLineStatus = angular.copy(vm.releaseLineStatusCopy);
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.releaseLineStatusCopy = angular.copy(relStatus);
        vm.releaseLineStatus = angular.copy(relStatus);
        vm.alllineCompleted = vm.nolineCompleted = false;
        getSalesOrderLineDetail();
      }
    };
    vm.myFilter = (item) => {
      // console.log('line status ' + vm.releaseLineStatus);
      if (vm.releaseLineStatus === vm.soReleaseLineStatusCode.COMPLETED) {
        if (item.copyOpenQty === 0) {
          return true;
        } else {
          return false;
        }
      } else if (vm.releaseLineStatus === vm.soReleaseLineStatusCode.OPEN) {
        if (item.copyOpenQty > 0 || !item.shippingID) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
      // (!vm.completedStatus && (item.copyOpenQty > 0 || !item.shippingID)) ? true : (vm.completedStatus && item.copyOpenQty === 0) ? true : false
    };

    const getSalesorderstatus = () => SalesOrderFactory.getSalesOrderStatus().query({ id: vm.soDetail.soID }).$promise.then((salesorder) => {
      if (salesorder && salesorder.data) {
        vm.usedWorkOrderList = salesorder.data.sowoList;
        vm.shippedAssembly = salesorder.data.soShipList;
      }
      return salesorder;
    }).catch((error) => BaseService.getErrorLog(error));
    getSalesorderstatus();

    // open release line history details
    vm.openReleaseLineHistory = (item, ev) => {
      var data = {
        Tablename: 'SALESSHIPINGMST',
        RefTransID: item.shippingID
      };
      DialogFactory.dialogService(
        TRANSACTION.TRANSACTION_CHANGE_HISTORY_CONTROLLER,
        TRANSACTION.TRANSACTION_CHANGE_HISTORY_VIEW,
        ev,
        data).then(() => {

        }, () => {
        }, (error) => BaseService.getErrorLog(error));
    };

    // agree to ship detail
    vm.changeAgreeToShip = (item) => {
      if (!item.isAgreeToShip) {
        item.revisedRequestedDockDate = item.revisedRequestedShipDate = item.revisedRequestedPromisedDate = null;
      }
    };

    // get promised ship date
    vm.getPromisedDate = (item, index) => {
      if (item.requestedDockDate) {
        const dockdate = BaseService.getAPIFormatedDate(item.requestedDockDate);
        SalesOrderFactory.getSOPromisedShipDateFromDockDate().query({ dockDate: dockdate }).$promise.then((response) => {
          if (response && response.data) {
            if (response.data[0].vPromisedShipDate && (new Date(vm.soDetail.poDate)).setHours(0, 0, 0, 0) > (new Date(response.data[0].vPromisedShipDate)).setHours(0, 0, 0, 0)) {
              item.promisedShipDate = vm.soDetail.poDate;
            } else {
              item.promisedShipDate = response.data[0].vPromisedShipDate;
            }
            setFocus('promised' + index);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.assignShipDate = (item) => {
      if (!item.requestedDockDate && item.promisedShipDate && !item.shippingDate) {
        item.shippingDate = item.promisedShipDate;
      }
    };
    // open assembly stock popup
    vm.ViewAssemblyStockStatus = (event) => {
      const data = angular.copy(vm.lineLevelDetail);
      data.rohsName = data.rohsText;
      DialogFactory.dialogService(
        CORE.ASSEMBLY_STOCK_STATUS_MODAL_CONTROLLER,
        CORE.ASSEMBLY_STOCK_STATUS_MODAL_VIEW,
        event,
        data).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };

    // open blanket PO details
    vm.shippedQtyDetails = (entity, ev) => {
      const data = {
        id: vm.lineLevelDetail.id,
        pidCode: vm.lineLevelDetail.PIDCode,
        releaseID: entity ? entity.shippingID : null,
        partID: vm.lineLevelDetail.partID,
        rohsName: vm.lineLevelDetail.rohsText,
        rohsIcon: vm.lineLevelDetail.rohsIcon,
        soID: vm.soDetail.soID,
        partType: vm.lineLevelDetail.partType,
        poQty: entity ? entity.qty : vm.lineLevelDetail.qty,
        shippedQty: entity ? entity.shippedQty : vm.totalShipedQty(),
        custPOLineNumber: vm.lineLevelDetail.custPOLineNumber
      };
      DialogFactory.dialogService(
        TRANSACTION.TRANSACTION_SALESORDER_QTY_CONTROLLER,
        TRANSACTION.TRANSACTION_SALESORDER_QTY_VIEW,
        ev,
        data).then(() => {
        }, () => {
        }, (error) => BaseService.getErrorLog(error));
    };
  }
})();

