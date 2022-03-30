(function () {
  'use strict';

  angular
    .module('app.transaction')
    .controller('PlannPurchasePopupController', PlannPurchasePopupController);

  /** @ngInject */
  function PlannPurchasePopupController($state, $mdDialog, $timeout, CORE, data, BaseService, DialogFactory, SalesOrderFactory, TRANSACTION, $filter, ComponentFactory, KitAllocationFactory) {
    const vm = this;
    vm.plannDetail = [];
    vm.objPlannDetail = data || {};
    const icon = vm.objPlannDetail.rohsIcon ? vm.objPlannDetail.rohsIcon.split('/') : null;
    let ischange = false;
    let deleteAnyPlan = false;
    vm.LabelConstant = CORE.LabelConstant;
    vm.Kit_Release_Status = TRANSACTION.KIT_RELEASE_STATUS;
    vm.poDate = new Date(data.PODate);
    vm.currentState = $state.current.name;
    vm.KIT_RETURN_STATUS = TRANSACTION.KIT_RETURN_STATUS;
    vm.errorList = [];
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.BlanketPODetails = TRANSACTION.BLANKETPOOPTIONDET;
    vm.headerdata = [];
    vm.partType = CORE.PartType;
    //get status of sales order
    const getPlannDetails = () => {
      const objDet = {
        refSalesOrderDetID: data.salesOrderDetailId,
        assyID: data.partID
      };

      vm.cgBusyLoading = KitAllocationFactory.getKitReleasePlanDetail().query(objDet).$promise.then((plann) => {
        if (plann && plann.data) {
          ischange = false;
          const releasePlan = _.find(plann.data.planDetails, (item) => item.kitStatus !== vm.Kit_Release_Status.R.value);
          if (releasePlan) {
            releasePlan.isFirstPlann = true;
          }
          _.map(plann.data.planDetails, (data) => {
            data.materialDockDateOptions = { appendToBody: true, materialDockDateOpenFlag: false, minDate: false };
            data.poDueDateOptions = { appendToBody: true, poDueDateOpenFlag: false, minDate: false };
            data.kitReleaseDateOptions = { appendToBody: true, kitReleaseDateOpenFlag: false, minDate: false };
            data.isReleased = (data.kitStatus === vm.Kit_Release_Status.R.value || data.subAssyReleasedCount > 0) ? true : false;
            data.refAssyId = vm.objPlannDetail.partID;
            data.kitReleaseStatus = vm.Kit_Release_Status[data.kitStatus].name;

            data.poDueDate = data.poDueDate ? BaseService.getUIFormatedDate(data.poDueDate, vm.DefaultDateFormat) : null;
            data.kitReleaseDate = data.kitReleaseDate ? BaseService.getUIFormatedDate(data.kitReleaseDate, vm.DefaultDateFormat) : null;
            data.materialDockDate = data.materialDockDate ? BaseService.getUIFormatedDate(data.materialDockDate, vm.DefaultDateFormat) : null;
            data.actualKitReleaseDate = data.actualKitReleaseDate ? BaseService.getUIFormatedDate(data.actualKitReleaseDate, vm.DefaultDateFormat) : null;
            data.kitReturnDate = data.kitReturnDate ? BaseService.getUIFormatedDate(data.kitReturnDate, vm.DefaultDateFormat) : null;
          });
          vm.plannDetail = plann.data.planDetails;
          vm.plannDetail = _.orderBy(vm.plannDetail, ['plannKitNumber'], ['asc']);
          vm.ShipPlanDate = plann.data.shipDate.length > 0 ? plann.data.shipDate[0].promisedShipDate : null;
          vm.isload = true;
          vm.addnewRecord();
          bindHeaderData();
        }
      }).catch((error) =>
        BaseService.getErrorLog(error)
      );
    };
    getPlannDetails();
    // get component  type
    const getPartDetails = () => {
      vm.cgBusyLoading = ComponentFactory.getComponentByID().query({ id: vm.objPlannDetail.partID }).$promise.then((response) => {
        if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          vm.objPlannDetail.partType = response.data.category;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    getPartDetails();

    vm.cancel = () => {
      if (ischange) {
        const data = {
          form: vm.plannPurchaseForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel(deleteAnyPlan);
      }
    };

    //add new record
    vm.addnewRecord = () => {
      _.map(vm.plannDetail, removeDisable);
      const obj = {
        poQty: vm.plannDetail.length === 0 ? data.qty : null,
        poDueDate: vm.plannDetail.length === 0 ? vm.ShipPlanDate : null,
        materialDockDate: null,
        isDisable: true,
        mfrLeadTime: 15,//default 15 days
        plannKitNumber: vm.plannDetail.length === 0 ? 1 : parseInt(vm.plannDetail[vm.plannDetail.length - 1].plannKitNumber) + 1,
        kitReleaseQty: vm.plannDetail.length === 0 ? data.kitQty : null,
        materialDockDateOptions: { appendToBody: true, materialDockDateOpenFlag: false, minDate: false },
        poDueDateOptions: { appendToBody: true, poDueDateOpenFlag: false, minDate: false },
        kitReleaseDateOptions: { appendToBody: true, kitReleaseDateOpenFlag: false, minDate: false },
        salesOrderDetID: data.salesOrderDetailId,
        refAssyId: vm.objPlannDetail.partID,
        kitStatus: vm.Kit_Release_Status.P.value
      };
      vm.plannDetail.push(obj);
      setFocusOnPO();
    };
    function setFocusOnPO() {
      $timeout(() => {
        var objDoc = document.getElementById(stringFormat('poqty{0}', vm.plannDetail.length - 1));
        if (objDoc) {
          objDoc.focus();
        }
      }, 1000);
    }
    //remove disable flag
    function removeDisable(item) {
      item.isDisable = false;
    }

    //remove record
    vm.removeRow = (item) => {
      const obj = {
        title: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM, 'Plan Kit'),
        textContent: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM_MESSAGE, 1, 'Plan Kit'),
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.confirmDiolog(obj).then((resposne) => {
        if (resposne) {
          if (item.id) {
            const objPlan = { id: item.id };
            vm.cgBusyLoading = SalesOrderFactory.removePlanReleaseDeatil().query(objPlan).$promise.then(() => {
              deleteAnyPlan = true;
              getPlannDetails();
            }).catch((error) =>
              BaseService.getErrorLog(error)
            );
          } else if (vm.plannDetail.length > 1) {
            const index = _.indexOf(vm.plannDetail, item);
            vm.plannDetail.splice(index, 1);
            _.each(vm.plannDetail, (remove, index) => {
              remove.plannKitNumber = ++index;
            });
            setFocusOnPO();
          }
        }
      }, () => {
      }).catch((error) =>
        BaseService.getErrorLog(error)
      );
    };

    vm.changValue = () => {
      ischange = true;
    };

    vm.changeQty = (isPOQty, item) => {
      ischange = true;
      if (vm.totalPOQty() > vm.objPlannDetail.qty || vm.totalKitQty() > vm.objPlannDetail.kitQty) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.POQTY_RELEASELINEQTY_MISMATCH_INFORMATION);
        messageContent.message = stringFormat(messageContent.message, 'Total Qty', 'Total PO & Kit Qty');
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model).then(() => {
          if (isPOQty) {
            item.invalidpoqty = true;
          } else {
            item.invalidkitQty = true;
          }
          callBackFn();
        });
      }
    };

    vm.savePurchaseDetails = () => {
      $timeout(() => {
        vm.save = true;

        _.each(vm.plannDetail, (plann) => {
          plann.poDueDate = BaseService.getAPIFormatedDate(plann.poDueDate);
          plann.materialDockDate = BaseService.getAPIFormatedDate(plann.materialDockDate);
          plann.kitReleaseDate = BaseService.getAPIFormatedDate(plann.kitReleaseDate);
        });
        const objPlann = {
          salesOrderDetID: data.salesOrderDetailId,
          plannDetailList: vm.plannDetail
        };
        vm.cgBusyLoading = SalesOrderFactory.savePlannPurchaseDetail().query({ plannObj: objPlann }).$promise.then(() => {
          BaseService.currentPagePopupForm.pop();
          $mdDialog.cancel(ischange);
        }).catch((error) =>
          BaseService.getErrorLog(error)
        ).finally(() => {
          vm.isSubmitPlan = false;
        });
      }, 1000);
    };

    function callBackFn() {
      _.each(vm.plannDetail, (item, index) => {
        if (item.invalidpodate) {
          item.poDueDate = null;
          const objPODate = document.getElementById('po' + index);
          if (objPODate) {
            objPODate.focus();
          }
        }
        else if (item.invalidkitreleasedate) {
          item.kitReleaseDate = null;
          const objkitRelease = document.getElementById('kitRelease' + index);
          if (objkitRelease) {
            objkitRelease.focus();
          }
        }
        else if (item.invalidmaterialdate) {
          item.materialDockDate = null;
          const objMaterialDate = document.getElementById('material' + index);
          if (objMaterialDate) {
            objMaterialDate.focus();
          }
        }
        else if (item.InvalidplannKitNumber) {
          const objplannKitNumber = document.getElementById('plannKitNumber' + index);
          if (objplannKitNumber) {
            objplannKitNumber.focus();
          }
        }
      });
      isOpen = false;
    }
    let isOpen = false;

    //check for new line item
    vm.checkForNewLine = (item, isPoDate, ismfrLeadTime) => {
      if (vm.isload) {
        vm.isload = false;
        return;
      }
      if (item.poDueDateOptions.poDueDateOpenFlag || item.materialDockDateOptions.materialDockDateOpenFlag || isOpen || item.kitReleaseDateOptions.kitReleaseDateOpenFlag) {
        return;
      }

      if (!vm.checkDetails()) {
        vm.addnewRecord();
      }
      if (isNaN(item.poQty)) {
        item.poQty = null;
      }
      if (isNaN(item.mfrLeadTime)) {
        item.mfrLeadTime = null;
      }
      if (isNaN(item.kitReleaseQty)) {
        item.kitReleaseQty = null;
      }

      if (_.filter(vm.plannDetail, (kitNumber) => parseInt(kitNumber.plannKitNumber) === parseInt(item.plannKitNumber)).length > 1) {
        item.plannKitNumber = null;
        item.InvalidplannKitNumber = true;

        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ACTIVE_ALERT_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.SalesOrder.PlannKit);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        isOpen = true;
        DialogFactory.messageAlertDialog(model, callBackFn);
      } else {
        item.InvalidplannKitNumber = false;
      }

      if (ismfrLeadTime) {
        item.kitReleaseDate = null;
      }

      const index = _.indexOf(vm.plannDetail, item);
      if (index > 0) {
        let messageContent = null;
        const upperLineObj = vm.plannDetail[index - 1];
        if (upperLineObj) {
          if (item.poDueDate && ((new Date(upperLineObj.poDueDate)).setHours(0, 0, 0, 0) > (new Date(item.poDueDate)).setHours(0, 0, 0, 0))) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PLANNED_KIT_DATE_SHOULD_BE_LESS_TO_UPPER_ROW);
            messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.SalesOrder.PODueDate, index);
            item.invalidpodate = true;
            item.kitReleaseDate = null;
            item.materialDockDate = null;
          } else if (item.kitReleaseDate && ((new Date(upperLineObj.kitReleaseDate)).setHours(0, 0, 0, 0) > (new Date(item.kitReleaseDate)).setHours(0, 0, 0, 0))) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PLANNED_KIT_DATE_SHOULD_BE_LESS_TO_UPPER_ROW);
            messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.SalesOrder.KitReleaseDate, index);
            item.invalidkitreleasedate = true;
            item.materialDockDate = null;
          } else if (item.materialDockDate && ((new Date(upperLineObj.materialDockDate)).setHours(0, 0, 0, 0) > (new Date(item.materialDockDate)).setHours(0, 0, 0, 0))) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PLANNED_KIT_DATE_SHOULD_BE_LESS_TO_UPPER_ROW);
            messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.SalesOrder.MaterialDockDate, index);
            item.invalidmaterialdate = true;
          }
        }

        if (messageContent) {
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          isOpen = true;
          DialogFactory.messageAlertDialog(model, callBackFn);
          return;
        }
      }

      let messageContentData = null;
      const checkGreaterDate = _.filter(vm.plannDetail, (data, currentIndex) => {
        if (index < currentIndex && (data.poDueDate && data.kitReleaseDate && data.materialDockDate)) {
          if (item.poDueDate && ((new Date(data.poDueDate)).setHours(0, 0, 0, 0) < (new Date(item.poDueDate)).setHours(0, 0, 0, 0))) {
            messageContentData = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PLANNED_KIT_DATE_SHOULD_BE_LESS_TO_LOWER_ROW);
            messageContentData.message = stringFormat(messageContentData.message, vm.LabelConstant.SalesOrder.PODueDate, (index + 1));
            item.invalidpodate = true;
            item.kitReleaseDate = null;
          } else if (item.kitReleaseDate && ((new Date(data.kitReleaseDate)).setHours(0, 0, 0, 0) < (new Date(item.kitReleaseDate)).setHours(0, 0, 0, 0))) {
            messageContentData = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PLANNED_KIT_DATE_SHOULD_BE_LESS_TO_LOWER_ROW);
            messageContentData.message = stringFormat(messageContentData.message, vm.LabelConstant.SalesOrder.KitReleaseDate, (index + 1));
            item.invalidkitreleasedate = true;
          } else if (item.materialDockDate && ((new Date(data.materialDockDate)).setHours(0, 0, 0, 0) < (new Date(item.materialDockDate)).setHours(0, 0, 0, 0))) {
            messageContentData = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PLANNED_KIT_DATE_SHOULD_BE_LESS_TO_LOWER_ROW);
            messageContentData.message = stringFormat(messageContentData.message, vm.LabelConstant.SalesOrder.MaterialDockDate, (index + 1));
            item.invalidmaterialdate = true;
          }
          return data;
        }
      });

      if (checkGreaterDate.length > 0 && messageContentData) {
        const model = {
          messageContent: messageContentData,
          multiple: true
        };
        isOpen = true;
        DialogFactory.messageAlertDialog(model, callBackFn);
        return;
      }

      if (item.kitReleaseDate && item.poDueDate && (new Date(item.poDueDate)).setHours(0, 0, 0, 0) < (new Date(item.kitReleaseDate)).setHours(0, 0, 0, 0)) {
        if (isPoDate) {
          item.invalidkitreleasedate = true;
        }
        else {
          item.invalidpodate = true;
        }

        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.DATE_VALIDATION);
        messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.SalesOrder.KitReleaseDate, vm.LabelConstant.SalesOrder.PODueDate);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        isOpen = true;
        DialogFactory.messageAlertDialog(model, callBackFn);
        return;
      }

      else if (item.poDueDate && (((item.mfrLeadTime || item.mfrLeadTime === 0) && !item.kitReleaseDate) || (!item.mfrLeadTime && item.kitReleaseDate) || ((item.mfrLeadTime || item.mfrLeadTime === 0) && item.kitReleaseDate))) {
        if (item.kitReleaseDate && isPoDate) {
          let days = date_diff_indays(item.kitReleaseDate, item.poDueDate);
          days = getBusinessDays(days);
          item.mfrLeadTime = days;
        }

        if (ismfrLeadTime) {
          const poDueDate = (new Date(item.poDueDate));
          const numberOfDaysToRemove = getWeekDays(parseInt(item.mfrLeadTime));
          item.kitReleaseDate = poDueDate.setDate(poDueDate.getDate() - numberOfDaysToRemove);
        }

        if (item.kitReleaseDate && (new Date(item.kitReleaseDate)).setHours(0, 0, 0, 0) < (new Date(data.PODate)).setHours(0, 0, 0, 0)) {
          item.invalidkitreleasedate = true;
          if (vm.save) {
            item.invalidpodate = false;
          }
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.DATE_VALIDATION_PO);
          messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.SalesOrder.KitReleaseDate);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          isOpen = true;
          DialogFactory.messageAlertDialog(model, callBackFn);
          return;
        } else {
          item.invalidkitreleasedate = false;
          item.invalidpodate = false;
        }
      } else {
        item.invalidpodate = false;
      }

      if (item.materialDockDate && item.kitReleaseDate && (new Date(item.kitReleaseDate)).setHours(0, 0, 0, 0) < (new Date(item.materialDockDate)).setHours(0, 0, 0, 0)) {
        item.invalidmaterialdate = true;
        if (vm.save) {
          item.invalidpodate = false;
          item.invalidkitreleasedate = true;
        }

        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.DATE_VALIDATION);
        messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.SalesOrder.MaterialDockDate, vm.LabelConstant.SalesOrder.KitReleaseDate);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        isOpen = true;
        DialogFactory.messageAlertDialog(model, callBackFn);
        return;
      } else {
        item.invalidmaterialdate = false;
      }

      if (item.poQty && parseInt(item.poQty) === 0) {
        item.poQty = null;
        item.invalidpoqty = true;

        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.INVALID_DYNAMIC);
        messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.SalesOrder.POQTY);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        isOpen = true;
        DialogFactory.messageAlertDialog(model, callBackFn);
        return;
      } else {
        item.invalidpoqty = false;
      }

      if (item.kitReleaseQty && parseInt(item.kitReleaseQty) === 0) {
        //item.kitReleaseQty = null;
        item.invalidkitQty = true;
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.INVALID_DYNAMIC);
        messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.SalesOrder.KitReleaseQty);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        isOpen = true;
        DialogFactory.messageAlertDialog(model, callBackFn);
        return;
      } else {
        item.invalidkitQty = false;
      }

      if (vm.save &&
        (item.poQty || item.kitReleaseQty || item.poDueDate || item.kitReleaseDate || item.materialDockDate) &&
        (!item.plannKitNumber || !item.poQty || !item.kitReleaseQty || !item.poDueDate || !item.kitReleaseDate || !item.materialDockDate)) {
        if (!item.plannKitNumber) {
          item.InvalidplannKitNumber = true;
        } else {
          item.InvalidplannKitNumber = false;
        }

        if (!item.poQty) {
          item.invalidpoqty = true;
        } else {
          item.invalidpoqty = false;
        }

        if (!item.kitReleaseQty) {
          item.invalidkitQty = true;
        } else {
          item.invalidkitQty = false;
        }

        if (!item.poDueDate) {
          item.invalidpodate = true;
        } else {
          item.invalidpodate = false;
        }

        if (!item.kitReleaseDate) {
          item.invalidkitreleasedate = true;
        } else {
          item.invalidkitreleasedate = false;
        }

        if (!item.materialDockDate) {
          item.invalidmaterialdate = true;
        } else {
          item.invalidmaterialdate = false;
        }
      }

      item.isUpdated = true;
    };

    // check detail fill or not
    vm.checkDetails = () => _.find(vm.plannDetail, (item) => !item.poQty || !item.poDueDate || !item.materialDockDate || !item.kitReleaseQty || !item.kitReleaseDate);

    //link to go for part master list page
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };
    //go to part master
    vm.goToPartMaster = () => {
      BaseService.goToComponentDetailTab(null, data.partID);
    };

    vm.goToSalesOrderList = () => {
      BaseService.goToSalesOrderList();
      return false;
    };

    vm.goToManageSalesOrder = () => {
      BaseService.goToManageSalesOrder(data.soId);
      return false;
    };

    vm.updatekitmrpqty = () => {
      if (vm.objPlannDetail && (vm.objPlannDetail.salesOrderDetailId && vm.objPlannDetail.partID)) {
        const obj = {
          salesOrderDetail: vm.objPlannDetail.salesOrderDetailId,
          mainAssyId: null,
          subAssyId: vm.objPlannDetail.rfqAssyID || vm.objPlannDetail.partID
        };
        DialogFactory.dialogService(
          TRANSACTION.UPDATE_KIT_MRP_QTY_POPUP_CONTROLLER,
          TRANSACTION.UPDATE_KIT_MRP_QTY_POPUP_VIEW,
          null,
          obj).then(() => {
          }, (data) => {
            if (data && (vm.currentState !== TRANSACTION.TRANSACTION_KIT_PREPARATION_STATE && vm.currentState !== TRANSACTION.TRANSACTION_KIT_ALLOCATION_STATE)) {
              data.changeQty = true;
              $mdDialog.cancel(data);
            }
          }, (err) =>
            BaseService.getErrorLog(err)
          );
      }
    };

    function bindHeaderData() {
      vm.headerdata = [{
        label: vm.LabelConstant.SalesOrder.PO,
        value: data.poNumber,
        displayOrder: 1,
        labelLinkFn: vm.goToSalesOrderList,
        valueLinkFn: vm.goToManageSalesOrder,
        valueLinkFnParams: null,
        isCopy: true
      }, {
        label: vm.LabelConstant.SalesOrder.SO,
        value: data.salesOrderNumber,
        displayOrder: 2,
        labelLinkFn: vm.goToSalesOrderList,
        valueLinkFn: vm.goToManageSalesOrder,
        valueLinkFnParams: null,
        isCopy: true
      },
      {
        label: vm.LabelConstant.SalesOrder.Revision,
        value: data.version,
        displayOrder: 2
      },
      {
        label: vm.LabelConstant.SalesOrder.PODate,
        value: data.PODate,
        displayOrder: 3,
        labelLinkFn: null,
        valueLinkFn: null,
        valueLinkFnParams: null,
        isCopy: false,
        copyParams: null,
        imgParms: null
      },
      {
        label: stringFormat('{0}/{1}', vm.LabelConstant.Assembly.MFGPN, vm.LabelConstant.MFG.MFGPN),
        value: data.mfgPN,
        displayOrder: 4,
        labelLinkFn: vm.goToPartList,
        valueLinkFn: vm.goToPartMaster,
        isCopy: true,
        isCopyAheadLabel: true,
        isAssy: true,
        imgParms: {
          imgPath: data.rohsIcon,
          imgDetail: data.rohsComplientConvertedValue
        },
        isCopyAheadOtherThanValue: true,
        copyAheadLabel: vm.LabelConstant.Assembly.MFGPN,
        copyAheadValue: data.mfgPN
      },
      {
        label: stringFormat('{0}/{1}', vm.LabelConstant.Assembly.PIDCode, vm.LabelConstant.MFG.PID),
        value: data.PIDCode,
        displayOrder: 5,
        labelLinkFn: vm.goToPartList,
        valueLinkFn: vm.goToPartMaster,
        isCopy: true,
        isCopyAheadLabel: true,
        isAssy: true,
        imgParms: {
          imgPath: data.rohsIcon,
          imgDetail: data.rohsComplientConvertedValue
        },
        isCopyAheadOtherThanValue: true,
        copyAheadLabel: vm.LabelConstant.Assembly.MFGPN,
        copyAheadValue: data.mfgPN
      }, {
        label: vm.LabelConstant.SalesOrder.POQTY,
        value: data.qty,
        displayOrder: 6,
        labelLinkFn: null,
        valueLinkFnParams: null,
        isCopy: false,
        copyParams: null,
        imgParms: null
      },
      {
        label: vm.LabelConstant.SalesOrder.KitQty,
        value: data.kitQty,
        displayOrder: 7,
        labelLinkFn: null,
        valueLinkFnParams: null,
        isCopy: false,
        copyParams: null,
        imgParms: null
      }];

      if (data.subPOQty && data.subKitQty) {
        vm.headerdata.push({
          label: 'Sub Assy PO Qty',
          value: $filter('numberWithoutDecimal')(data.subPOQty),
          displayOrder: 5
        },
          {
            label: 'Sub Assy Kit Qty',
            value: $filter('numberWithoutDecimal')(data.subKitQty),
            displayOrder: 7
          });
      }
      if (data.blanketPOOption) {
        vm.headerdata.push({
          label: vm.LabelConstant.SalesOrder.BlanketPO,
          value: 'Yes',
          displayOrder: 8
        });
        vm.headerdata.push({
          label: vm.LabelConstant.SalesOrder.BlanketPOOption,
          value: vm.BlanketPODetails.USEBLANKETPO === data.blanketPOOption ? TRANSACTION.BLANKETPOOPTION[0].value : vm.BlanketPODetails.LINKBLANKETPO === data.blanketPOOption ? TRANSACTION.BLANKETPOOPTION[1].value : TRANSACTION.BLANKETPOOPTION[2].value,
          displayOrder: 8
        });
      }
      if (data.isLegacyPO) {
        vm.headerdata.push({
          label: vm.LabelConstant.SalesOrder.LegacyPo,
          value: 'Yes',
          displayOrder: 8
        });
      }
      if (data.isRmaPO) {
        vm.headerdata.push({
          label: vm.LabelConstant.SalesOrder.RMAPo,
          value: 'Yes',
          displayOrder: 8
        });
      }
    }

    // popup form validation
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.plannPurchaseForm);
      $timeout(() => {
        const objDoc = document.getElementById(stringFormat('poqty{0}', vm.plannDetail.length - 1));
        if (objDoc) {
          objDoc.focus();
        }
      }, 1000);
    });

    function getWeekDays(days) {
      return Math.ceil(days * 7 / 5);
    }
    function getBusinessDays(days) {
      return Math.ceil((days * 5 / 7));
    }

    // get total po qty to plan release
    vm.totalPOQty = () => {
      const total = (_.sumBy(vm.plannDetail, (o) => parseInt(o.poQty ? o.poQty : 0)));
      if (!isNaN(total)) {
        return total;
      }
      return 0;
    };

    // get total kit qty to plan release
    vm.totalKitQty = () => {
      const total = (_.sumBy(vm.plannDetail, (o) => parseInt(o.kitReleaseQty ? o.kitReleaseQty : 0)));
      if (!isNaN(total)) {
        return total;
      }
      return 0;
    };

    // get remain po qty to plan release
    vm.getRemainPOQty = () => ((vm.objPlannDetail.subPOQty ? vm.objPlannDetail.subPOQty : vm.objPlannDetail.qty) - (vm.totalPOQty()));

    // get remain kit qty to plan release
    vm.getRemainkitQty = () => ((vm.objPlannDetail.subKitQty ? vm.objPlannDetail.subKitQty : vm.objPlannDetail.kitQty) - (vm.totalKitQty()));

    vm.openSubAssyStatus = (ev) => {
      const icon = vm.objPlannDetail.rohsIcon ? vm.objPlannDetail.rohsIcon.split('/') : null;
      const kitDetail = {
        salesOrderDetail: {
          SalesOrderDetailId: vm.objPlannDetail.salesOrderDetailId,
          poDate: vm.objPlannDetail.PODate,
          poNumber: vm.objPlannDetail.poNumber,
          soNumber: vm.objPlannDetail.salesOrderNumber,
          partId: vm.objPlannDetail.partID,
          assyName: vm.objPlannDetail.mfgPN,
          rohsIcon: icon ? (icon[icon.length - 1]) : '',
          rohs: vm.objPlannDetail.rohsComplientConvertedValue,
          kitQty: vm.objPlannDetail.kitQty,
          poQty: vm.objPlannDetail.qty,
          assyPIDCode: vm.objPlannDetail.PIDCode
        },
        refSalesOrderDetID: vm.objPlannDetail.salesOrderDetailId,
        assyID: vm.objPlannDetail.partID,
        isConsolidated: true
      };

      DialogFactory.dialogService(
        TRANSACTION.KIT_RELEASE_POPUP_CONTROLLER,
        TRANSACTION.KIT_RELEASE_POPUP_VIEW,
        ev,
        kitDetail).then(() => {
        }, () => {
          getPlannDetails();
        }, (err) =>
          BaseService.getErrorLog(err)
        );
    };

    /* To display release comment*/
    vm.showReasonForTransaction = (item, ev) => {
      const obj = {
        title: vm.LabelConstant.SalesOrder.ReleasedComment,
        description: item.releasedNote,
        name: item.plannKitNumber,
        label: vm.LabelConstant.SalesOrder.PlannKit
      };
      const data = obj;
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        data
      ).then(() => {

      }, (err) =>
        BaseService.getErrorLog(err)
      );
    };

    /**Open feasibility pop-up when click on check feasibility */
    vm.checkFeasibility = (objFesibility) => {
      if (!objFesibility.shortageLines) {
        return;
      }
      const inputQty = objFesibility.calculatedKitQty;
      const salesOrderDetail = {
        SalesOrderDetailId: vm.objPlannDetail.salesOrderDetailId,
        poDate: vm.objPlannDetail.PODate,
        poNumber: vm.objPlannDetail.poNumber,
        soNumber: vm.objPlannDetail.salesOrderNumber,
        partId: vm.objPlannDetail.partID,
        assyName: vm.objPlannDetail.mfgPN,
        rohsIcon: icon ? (icon[icon.length - 1]) : '',
        rohs: vm.objPlannDetail.rohsComplientConvertedValue,
        kitQty: vm.objPlannDetail.kitQty,
        poQty: vm.objPlannDetail.qty,
        assyPIDCode: vm.objPlannDetail.PIDCode,
        SubAssy: vm.objPlannDetail.PIDCode
      };
      const feasibilityDetail = { refSalesOrderDetID: vm.objPlannDetail.salesOrderDetailId, assyID: vm.objPlannDetail.partID, inputQty: inputQty || 0, salesOrderDetail: salesOrderDetail };

      DialogFactory.dialogService(
        TRANSACTION.KIT_FEASIBILITY_POPUP_CONTROLLER,
        TRANSACTION.KIT_FEASIBILITY_POPUP_VIEW,
        event,
        feasibilityDetail).then(() => {
        }, () => {
        }, (err) =>
          BaseService.getErrorLog(err)
        );
    };

    vm.viewAssemblyStockStatus = () => {
      const dataObj = {
        rohsIcon: vm.objPlannDetail.rohsIcon,
        rohsName: vm.objPlannDetail.rohsComplientConvertedValue,
        mfgPN: vm.objPlannDetail.mfgPN,
        partID: vm.objPlannDetail.partID,
        PIDCode: vm.objPlannDetail.PIDCode
      };
      DialogFactory.dialogService(
        CORE.ASSEMBLY_STOCK_STATUS_MODAL_CONTROLLER,
        CORE.ASSEMBLY_STOCK_STATUS_MODAL_VIEW,
        event,
        dataObj).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };

    //kit release mismatch detail
    vm.kitReleaseMismatchDetail = (item) => {
      const kitDetail = {
        refSalesOrderDetID: vm.objPlannDetail.salesOrderDetailId,
        assyID: vm.objPlannDetail.partID,
        isConsolidated: false,
        salesOrderDetail: {
          poNumber: vm.objPlannDetail.poNumber,
          poDate: vm.objPlannDetail.PODate,
          soNumber: vm.objPlannDetail.salesOrderNumber,
          soId: '',
          assyName: vm.objPlannDetail.mfgPN,
          nickName: '',
          poQty: vm.objPlannDetail.qty,
          kitQty: vm.objPlannDetail.kitQty,
          partId: vm.objPlannDetail.partID,
          rohs: vm.objPlannDetail.rohsComplientConvertedValue,
          rohsIcon: icon ? (icon[icon.length - 1]) : '',
          componentID: vm.objPlannDetail.partID,
          SubAssy: vm.objPlannDetail.PIDCode
        }
      };
      var releaseDetail = {
        kitDetail: kitDetail,
        releasePlan: item,
        kitAssyDetail: {
          refSalesOrderDetID: vm.objPlannDetail.salesOrderDetailId,
          mainAssyID: vm.objPlannDetail.partID,
          assyID: kitDetail.assyID,
          selectedAssy: null
        },
        isMismatchItems: true
      };

      DialogFactory.dialogService(
        TRANSACTION.KIT_RELEASE_MISMATCH_INVENTORY_POPUP_CONTROLLER,
        TRANSACTION.KIT_RELEASE_MISMATCH_INVENTORY_POPUP_VIEW,
        event,
        releaseDetail).then(() => {
          getPlannDetails();
        }, () => {
          getPlannDetails();
        }, (err) =>
          BaseService.getErrorLog(err)
        );
    };

    vm.checkTotalKitMRPQtyAndSave = () => {
      vm.isSubmitPlan = true;
      const sequenceKitNumber = _.sortBy(_.map(vm.plannDetail, 'plannKitNumber'));
      let notInSequance = false;
      vm.errorList = [];
      vm.plannDetail = _.filter(vm.plannDetail, (item) => item.poQty || item.poDueDate || item.materialDockDate || item.kitReleaseDate || item.kitReleaseQty);
      _.map(vm.plannDetail, (item, index) => {
        if (item.plannKitNumber !== sequenceKitNumber[index]) {
          notInSequance = true;
          return;
        }

        const fieldNameForRequire = [];
        const fieldNameForDate = [];
        const rowErrorList = [];

        if (!item.plannKitNumber) {
          item.invalidplannKitNumber = true;
          fieldNameForRequire.push(vm.LabelConstant.SalesOrder.PlannKit);
        }

        if (!item.poQty) {
          item.invalidpoqty = true;
          fieldNameForRequire.push(vm.LabelConstant.SalesOrder.POOrderQty);
        }

        if (!item.kitReleaseQty) {
          item.invalidkitQty = true;
          fieldNameForRequire.push(vm.LabelConstant.SalesOrder.KitReleaseQty);
        }

        if (!item.poDueDate) {
          item.invalidpodate = true;
          fieldNameForRequire.push(vm.LabelConstant.SalesOrder.PODueDate);
        }

        if (!item.kitReleaseDate) {
          item.invalidkitreleasedate = true;
          fieldNameForRequire.push(vm.LabelConstant.SalesOrder.KitReleaseDate);
        }

        if (!item.materialDockDate) {
          item.invalidmaterialdate = true;
          fieldNameForRequire.push(vm.LabelConstant.SalesOrder.MaterialDockDate);
        }

        if (item.poDueDate && data.PODate && (((new Date(data.PODate)).setHours(0, 0, 0, 0) > (new Date(item.poDueDate)).setHours(0, 0, 0, 0)))) {
          item.poDueDate = null;
          fieldNameForDate.push(vm.LabelConstant.SalesOrder.PODueDate);
        }

        if (item.kitReleaseDate && data.PODate && (((new Date(data.PODate)).setHours(0, 0, 0, 0) > (new Date(item.kitReleaseDate)).setHours(0, 0, 0, 0)))) {
          item.kitReleaseDate = null;
          fieldNameForDate.push(vm.LabelConstant.SalesOrder.KitReleaseDate);
        }

        if (item.materialDockDate && data.PODate && (((new Date(data.PODate)).setHours(0, 0, 0, 0) > (new Date(item.materialDockDate)).setHours(0, 0, 0, 0)))) {
          item.materialDockDate = null;
          fieldNameForDate.push(vm.LabelConstant.SalesOrder.MaterialDockDate);
        }

        if (fieldNameForRequire.length > 0) {
          const fieldsName = _.map(fieldNameForRequire).join(', ');
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PLANNED_KIT_REQUIRE_FIELD);
          messageContent.message = stringFormat(messageContent.message, fieldsName);
          rowErrorList.push({ error: messageContent.message });
        }

        if (fieldNameForDate.length > 0) {
          const fieldsName = _.map(fieldNameForDate).join(', ');
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PLANNED_KIT_DATE_NOT_LESS_PO_DATE);
          messageContent.message = stringFormat(messageContent.message, fieldsName, vm.LabelConstant.SalesOrder.PODate);
          rowErrorList.push({ error: messageContent.message });
        }

        if (rowErrorList.length > 0) {
          vm.errorList.push(rowErrorList);
        }
      });

      if (notInSequance) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PLANN_KIT_IN_SEQUENCE);
        messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.SalesOrder.PlannKit);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model).then((yes) => {
          if (yes) {
            const objPlanKit = document.getElementById('plannKitNumber0');
            if (objPlanKit) {
              objPlanKit.focus();
            }
          }
        }, () => {
        }).catch(() => {
        });

        vm.isSubmitPlan = false;
        return;
      }

      if (vm.errorList.length > 0) {
        vm.isSubmitPlan = false;
        return;
      }
      else {
        if (vm.getRemainPOQty() < 0 || vm.getRemainkitQty() < 0 || (vm.getRemainkitQty() === 0 && vm.getRemainPOQty() !== 0) || (vm.getRemainkitQty() !== 0 && vm.getRemainPOQty() === 0)) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.TBD_POKITQTY_VALIDATION);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          vm.isSubmitPlan = false;
          return DialogFactory.messageAlertDialog(model);
        } else {
          vm.savePurchaseDetails();
        }
      }
    };
  }
})();
