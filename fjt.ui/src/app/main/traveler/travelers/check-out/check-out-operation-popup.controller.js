(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('CheckOutPopupController', CheckOutPopupController);

  /** @ngInject */
  function CheckOutPopupController($mdDialog, CORE, TRAVELER, data, WorkorderTransFactory,
    WorkorderTransProductionFactory, BaseService, WorkorderSerialMstFactory, DialogFactory) {
    const vm = this;
    vm.saveBtnDisableFlag = false;
    vm.data = angular.copy(data);
    vm.data.opData.opName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, vm.data.opData.opName, vm.data.opData.opNumber);
    vm.data.checkoutSetupTime = secondsToTime(0, false);
    vm.CORE_MESSAGE_CONSTANT = angular.copy(CORE.MESSAGE_CONSTANT);
    vm.InTotalValidQtyMessage = stringFormat(vm.CORE_MESSAGE_CONSTANT.INVALID_DYNAMIC, 'Total Qty');
    vm.OperationTimePattern = CORE.OperationTimePattern;
    vm.OperationTimeMask = CORE.OperationTimeMask;
    vm.taToolbar = CORE.Toolbar;
    vm.ProductStatus = CORE.productStatus;
    vm.statusText = CORE.statusText;
    vm.isOperationTrackBySerialNo = vm.data.opData.isOperationTrackBySerialNo;
    vm.isTrackBySerialNo = vm.data.opData.isTrackBySerialNo;
    vm.isParallelOperation = vm.data.isParallelOperation;
    vm.data.isInterimCheckout = false;
    vm.data.isFirstArticle = false;
    vm.travelerCommonLabels = CORE.AllCommonLabels.TRAVELER;
    vm.interimCheckoutForTeamNote = stringFormat(TRAVELER.INTERIM_CHECKOUT, 'team');
    vm.midShiftCheckoutForTeamNote = stringFormat(TRAVELER.MIDSHIFT_CHECKOUT, 'team');
    vm.interimCheckoutForEmpNote = stringFormat(TRAVELER.INTERIM_CHECKOUT, 'personnel');
    vm.midShiftCheckoutForEmpNote = stringFormat(TRAVELER.MIDSHIFT_CHECKOUT, 'personnel');
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.debounceConstant = CORE.Debounce;
    vm.LOOP_OPERATION_PASS_QTY_INFORMATION = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.LOOP_OPERATION_PASS_QTY_INFORMATION;
    vm.headerdata = [];
    vm.RadioGroup = {
      checkOutType: {
        array: CORE.CheckOutRadioGroup.CheckOutType
      }
    };

    // set total quantity sum of note
    if (vm.data.opData.isMoveToStock) {
      vm.totalQtySumNote = vm.travelerCommonLabels.MoveToStockOPTotalQty;
    }
    else if (vm.data.opData.isRework) {
      vm.totalQtySumNote = vm.travelerCommonLabels.ReworkTotalQty;
    }
    else if (vm.data.inspectionProcess) {
      vm.totalQtySumNote = vm.data.opData.isAllowBypassQty ? (vm.travelerCommonLabels.TotalQty + ' + ' + vm.LabelConstant.Traveler.BypassedQty) : vm.travelerCommonLabels.TotalQty;
    }
    else {
      if (vm.data.opData.isAllowMissingPartQty && vm.data.opData.isAllowBypassQty) {
        vm.totalQtySumNote = vm.travelerCommonLabels.TotalQty + ' + ' + vm.LabelConstant.Traveler.BoardWithMissingPartsQty + ' + ' + vm.LabelConstant.Traveler.BypassedQty;
      }
      else if (vm.data.opData.isAllowMissingPartQty && !vm.data.opData.isAllowBypassQty) {
        vm.totalQtySumNote = vm.travelerCommonLabels.TotalQty + ' + ' + vm.LabelConstant.Traveler.BoardWithMissingPartsQty;
      }
      else if (!vm.data.opData.isAllowMissingPartQty && vm.data.opData.isAllowBypassQty) {
        vm.totalQtySumNote = vm.travelerCommonLabels.TotalQty + ' + ' + vm.LabelConstant.Traveler.BypassedQty;
      }
      else {
        vm.totalQtySumNote = vm.travelerCommonLabels.TotalQty;
      }
    }

    /* hyperlink go for list page */
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };

    /* go to particular assy */
    vm.goToPartDetails = () => {
        BaseService.goToComponentDetailTab(null, vm.data.partID);
      return false;
    };
    // Work order
    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
      return false;
    };
    vm.goToWorkorderDetails = (data) => {
      BaseService.goToWorkorderDetails(data.woID);
      return false;
    };

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    vm.cancel = (data) => {
      const isdirty = vm.checkFormDirty(vm.checkOutForm);
      if (isdirty) {
        const alertFormData = {
          form: vm.checkOutForm
        };
        BaseService.showWithoutSavingAlertForPopUp(alertFormData);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel(data);
      }
    };

    // on click of stop activity
    vm.CheckOut = (isCheckUnique) => {
      vm.saveBtnDisableFlag = true;
      if (vm.checkOutForm && vm.checkOutForm.totalQty) {
        vm.checkOutForm.totalQty.$setValidity('invalidtotalQty', true);
      }
      if ((vm.checkOutForm && vm.checkOutForm.totalQty) && !vm.IsValidQty()) {
        vm.checkOutForm.totalQty.$setValidity('invalidtotalQty', false);
      }
      if (vm.checkOutForm.$invalid || !vm.IsValidQty()) {
        BaseService.focusRequiredField(vm.checkOutForm);
        vm.saveBtnDisableFlag = false;
        return;
      }
      // added condition for check current total quantity with total build quantity excluding till process scrap quantity
      if ((vm.data.totalQty > vm.data.buildQty)
        || (vm.readyStockData && (vm.readyStockData.OPProdQty + vm.data.totalQty) > (vm.data.buildQty - vm.readyStockData.TillProcessScrapQty))) {
        if (vm.readyStockData && (!vm.readyStockData.nextIsLoopOperation && !vm.readyStockData.currentIsLoopOperation)) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.FROM_QTY_NOT_MORE_THAN_TO_QTY);
          messageContent.message = stringFormat(messageContent.message, 'Total', 'build');
          const model = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(model);
          vm.saveBtnDisableFlag = false;
          return;
        }
      }

      const opHistory = {};
      opHistory.woTransID = vm.data.woOPCurrentHistory.woTransID;
      opHistory.woID = vm.data.opData.woID;
      opHistory.opID = vm.data.opData.opID;
      opHistory.woOPID = vm.data.opData.woOPID;
      opHistory.remark = vm.data.remark;
      opHistory.isFirstArticle = vm.data.isFirstArticle || false;
      opHistory.totalQty = vm.data.totalQty || null;
      opHistory.passQty = vm.data.passQty || null;
      opHistory.reprocessQty = (vm.data.reprocessQty) && (vm.isOperationTrackBySerialNo || vm.isTrackBySerialNo) ? vm.data.reprocessQty : null;
      opHistory.observedQty = vm.data.observedQty || null;
      opHistory.reworkQty = vm.data.reworkQty || null;
      opHistory.scrapQty = vm.data.scrapQty || null;
      opHistory.boardWithMissingPartsQty = vm.data.boardWithMissingPartsQty || null;
      opHistory.bypassQty = vm.data.bypassQty || null;
      opHistory.qtyControl = vm.data.opData.qtyControl || false;

      if (vm.data.isInterimCheckout) { /* production data (in-terim) stop activity */
        if (vm.data.opData.isStopOperation || vm.data.opData.isStopWorkorder) {
          const opFullName = vm.data.opData.opName;
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.OPERATION_ALREADY_STOPPED);
          messageContent.message = stringFormat(messageContent.message, opFullName);
          const model = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(model);
          vm.saveBtnDisableFlag = false;
          return;
        }
        if (vm.data.isSingleEmployee) { /* stop actvity from team operation of single-single employee */
          opHistory.employeeID = vm.data.objectEmployee.employeeID;
        }
        else {
          opHistory.employeeID = vm.data.employeeID;
        }
        opHistory.opName = vm.data.opData.opName;
        opHistory.woNumber = vm.data.opData.woNumber;

        vm.cgBusyLoading = WorkorderTransProductionFactory.workorder_trans_production().save(opHistory).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            vm.checkOutForm.$setPristine();
            BaseService.currentPagePopupForm.pop();
            $mdDialog.cancel(CORE.ApiResponseTypeStatus.SUCCESS);
          }
          vm.saveBtnDisableFlag = false;
        }).catch((error) => {
          vm.saveBtnDisableFlag = false;
          return BaseService.getErrorLog(error);
        });
      }
      else { /* full stop activity */
        opHistory.checkoutSetupTime = vm.data.checkoutSetupTime ? timeToSeconds(vm.data.checkoutSetupTime) : null;
        opHistory.qtyControl = vm.data.opData.qtyControl;
        opHistory.employeeID = vm.data.employeeID;
        opHistory.isCheckUnique = isCheckUnique ? isCheckUnique : false;

        if (vm.data.isSingleEmployee) { /* stop activity from team operation of single-single employee */
          opHistory.checkinTime = vm.data.objectEmployee.checkinTime;
          opHistory.woTransinoutID = vm.data.objectEmployee.woTransinoutID;
          opHistory.checkoutEmployeeID = vm.data.objectEmployee.employeeID;

          vm.cgBusyLoading = WorkorderTransFactory.checkOutEmployeeFromOperation().save(opHistory).$promise.then((res) => {
            vm.saveBtnDisableFlag = false;
            if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              confirmCheckoutWithoutScan(res, opHistory);
            }
            else if (res && res.status === CORE.ApiResponseTypeStatus.FAILED) {
              if (res && res.errors && res.errors && res.errors.data && res.errors.data.isActivityAlreadyStopped) {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.WO_OP_EMP_ACTIVITY_ALREADY_DONE);
                messageContent.message = stringFormat(messageContent.message, 'stopped');
                const model = {
                  messageContent: messageContent,
                  multiple: true
                };
                DialogFactory.messageAlertDialog(model).then(() => {
                  closeCheckOutPopupWithSuccess();
                });
              }
            }
          }).catch((error) => {
            vm.saveBtnDisableFlag = false;
            return BaseService.getErrorLog(error);
          });
        } else {
          opHistory.checkinTime = vm.data.woOPCurrentHistory.checkinTime;
          opHistory.isPaused = vm.data.isPaused ? vm.data.isPaused : null;
          opHistory.checkoutEmployeeID = vm.data.employeeID;

          if (vm.data.woOPCurrentHistory.woTransID) {
            vm.cgBusyLoading = WorkorderTransFactory.checkOutOperation().save(opHistory).$promise.then((res) => {
              vm.saveBtnDisableFlag = false;
              if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                confirmCheckoutWithoutScan(res, opHistory);
              }
              else if (res && res.status === CORE.ApiResponseTypeStatus.FAILED) {
                if (res && res.errors && res.errors && res.errors.data && res.errors.data.isActivityAlreadyStopped) {
                  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.WO_OP_EMP_ACTIVITY_ALREADY_DONE);
                  messageContent.message = stringFormat(messageContent.message, 'stopped');
                  const model = {
                    messageContent: messageContent,
                    multiple: true
                  };
                  DialogFactory.messageAlertDialog(model).then(() => {
                    closeCheckOutPopupWithSuccess();
                  });
                }
              }
            }).catch((error) => {
              vm.saveBtnDisableFlag = false;
              return BaseService.getErrorLog(error);
            });
          }
        }
      }
    };

    //confirm checkout with out scan
    const confirmCheckoutWithoutScan = (res, opHistory) => {
      if (res.data && res.data.stockDetails) {
        if (opHistory.isCheckUnique && res.data.stockDetails.umidTransactionQty === 0 && (vm.data.opData.qtyControl && !vm.data.woOPCurrentHistory.isSetup)) {
          // confirmation popup and send same request again
          opHistory.isCheckUnique = false;
          const obj = {
            messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CHECKOUT_WITHOUT_SCAN_UMID_MATERIAL_CONFM),
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((res) => {
            if (res) {
              vm.CheckOut(false);
            }
          }, () => {
            // cancel block
          }).catch((error) => BaseService.getErrorLog(error));
          return;
        } else {
          closeCheckOutPopupWithSuccess();
        }
      } else {
        closeCheckOutPopupWithSuccess();
      }
    };

    const closeCheckOutPopupWithSuccess = () => {
      vm.checkOutForm.$setPristine();
      BaseService.currentPagePopupForm.pop();
      vm.cancel(CORE.ApiResponseTypeStatus.SUCCESS);
    };

    // get stock data
    const getStock = () => {
      vm.headerdata = [];
      const objs = {
        opID: vm.data.opData.opID,
        woID: vm.data.opData.woID,
        woOPID: vm.data.opData.woOPID
      };
      vm.cgBusyLoading = WorkorderTransProductionFactory.retrieveWorkorderTransReadyStock().query({ operationObj: objs }).$promise.then((stockData) => {
        if (stockData.data) {
          if (stockData.data.stockInfo.length > 0) {
            stockData.data.stockInfo = _.first(stockData.data.stockInfo);
            vm.readyStockData = stockData.data.stockInfo;
            vm.readyStockData.totalValidQty = vm.readyStockData.returnPending;
            if (vm.readyStockData && !vm.data.woOPCurrentHistory.isSetup) {
              vm.headerdata.push({ label: vm.LabelConstant.Traveler.AvailableQty, value: vm.readyStockData.returnPending, displayOrder: 1 });
              if (!vm.data.opData.isIssueQty) {
                vm.headerdata.push({ label: vm.LabelConstant.Traveler.CumulativeCompletedQty, value: vm.readyStockData.ReadyStock, displayOrder: 2 });
              }
            }
          }
          // overwrite valid quantity and return quantity in case of quantity from last pre programming operation
          if (stockData.data.readyPCBComponentDet) {
            if (vm.data.opData.woOPID === stockData.data.readyPCBComponentDet.refStkWOOPID && stockData.data.readyPCBComponentDet.readyForPCB < vm.readyStockData.returnPending) {
              vm.readyStockData.totalValidQty = vm.readyStockData.returnPending = stockData.data.readyPCBComponentDet.readyForPCB;
            }
          }
        }
        vm.headerdata.push({
          value: vm.data.PIDCode,
          label: CORE.LabelConstant.Assembly.ID,
          displayOrder: 3,
          labelLinkFn: vm.goToPartList,
          valueLinkFn: vm.goToPartDetails,
          isCopy: true,
          imgParms: {
            imgPath: vm.data.rohsIcon,
            imgDetail: vm.data.rohsName
          }
        });
        vm.headerdata.push({ label: vm.LabelConstant.Workorder.WO, value: vm.data.woNumber, displayOrder: 4, labelLinkFn: vm.goToWorkorderList, valueLinkFn: vm.goToWorkorderDetails, valueLinkFnParams: { woID: vm.data.opData.woID }, isCopy: false });
        vm.headerdata.push({ label: vm.LabelConstant.Workorder.Version, value: vm.data.woVersion, displayOrder: 5 });
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // get workorder trans serial# detail in case of workorder serial# track by
    const getWorkorderTranSerialDetail = () => {
      const objs = {
        woTransID: vm.data.woOPCurrentHistory.woTransID
      };
      vm.cgBusyLoading = WorkorderSerialMstFactory.getSerialNumberDetailsByTransID().query({ operationObj: objs }).$promise.then((serialNoData) => {
        if (serialNoData && serialNoData.data.length > 0) {
          serialNoData.data = _.first(serialNoData.data);
          vm.data.passQty = serialNoData.data.passQty;
          //vm.data.reprocessQty = serialNoData.data.reprocessQty;
          vm.data.observedQty = serialNoData.data.observedQty;
          vm.data.scrapQty = serialNoData.data.scrapQty;
          vm.data.reworkQty = serialNoData.data.reworkQty;
          vm.data.reprocessQty = serialNoData.data.reprocessQty;
          vm.data.boardWithMissingPartsQty = serialNoData.data.boardWithMissingPartsQty;
          vm.data.bypassQty = serialNoData.data.bypassQty;
          vm.data.totalQty = (vm.data.passQty + vm.data.observedQty
            + vm.data.scrapQty + vm.data.reworkQty
            + (vm.data.boardWithMissingPartsQty || 0) + (vm.data.bypassQty || 0));
        }
        else {
          vm.data.totalQty = 0;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    if (vm.data.opData.qtyControl) {
      getStock();
      if (vm.isOperationTrackBySerialNo || vm.isTrackBySerialNo) {
        getWorkorderTranSerialDetail();
      }
    }

    // Check for valid quantity on checkout button
    vm.IsValidQty = () => {
      if (vm.data.opData.qtyControl) {
        if (vm.data.totalQty) {
          const totalSumQty = (vm.data.passQty ? vm.data.passQty : 0) + (vm.data.observedQty ? vm.data.observedQty : 0) +
            (vm.data.scrapQty ? vm.data.scrapQty : 0) + (vm.data.reworkQty ? vm.data.reworkQty : 0) +
            (vm.data.boardWithMissingPartsQty ? vm.data.boardWithMissingPartsQty : 0) + (vm.data.bypassQty ? vm.data.bypassQty : 0);
          return ((vm.data.totalQty === totalSumQty) && (vm.data.totalQty <= (vm.readyStockData ? vm.readyStockData.totalValidQty : 0)));
        }
        else {
          return true;
        }
      }
      else {
        return true;
      }
    };

    /* *************** Production List section   ************************/
    vm.ProductionList = [];
    vm.EmptyMesssage = TRAVELER.TRAVELER_EMPTYSTATE.ASSEMBLY_STOCK;
    vm.ispagination = true;
    vm.selectedItems = [];
    vm.query = {
      order: '',
      search: '',
      limit: CORE.datalimit,
      page: 1,
      isPagination: CORE.isPagination
    };
    vm.emptySearch = CORE.EMPTYSTATE.EMPTY_SEARCH;

    const getProductionData = () => {
      const objs = {
        woTransID: vm.data.woOPCurrentHistory.woTransID
      };
      vm.cgBusyLoading = WorkorderTransProductionFactory.retrieveWorkorderTransactionDetails().query({ operationObj: objs }).$promise.then((productionData) => {
        if (productionData && productionData.data) {
          vm.ProductionList = productionData.data;
          _.each(vm.ProductionList, (productionData) => {
            productionData.employee.name = productionData.employee.firstName + ' ' + productionData.employee.lastName;
          });
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    if (vm.data.opData.qtyControl) {
      getProductionData();
    }

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    //on load submit form
    angular.element(() => {
      //check load
      BaseService.currentPagePopupForm.push(vm.checkOutForm);
    });
  }
})();
