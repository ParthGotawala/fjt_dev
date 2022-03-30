(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('CheckInPopupController', CheckInPopupController);

  /** @ngInject */
  function CheckInPopupController($mdDialog, data, WorkorderTransFactory, EquipmentFactory, DialogFactory, WorkorderTransProductionFactory,
    CORE, BaseService, $q) {
    const vm = this;
    var detailOfOperation = angular.copy(data);
    vm.selectedItems = [];
    vm.data = detailOfOperation;
    vm.saveBtnDisableFlag = false;
    vm.data.isSetup = vm.data.isSetup ? vm.data.isSetup : false;
    vm.data.opData.opName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, vm.data.opData.opName, vm.data.opData.opNumber);
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.OperationTimePattern = CORE.OperationTimePattern;
    vm.OperationTimeMask = CORE.OperationTimeMask;
    vm.UserPasswordPattern = CORE.UserPasswordPattern;
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.NOTES_FIRST_TRANSACTION_INFORMATION = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.FIRST_TRANSACTION_INFORMATION;
    vm.RadioGroup = {
      Activity: {
        array: CORE.CheckInRadioGroup.Activity
      }
    };
    vm.headerdata = [];

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };
    /* hyperlink go for list page */
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };

    /* go to particular assy */
    vm.goToPartDetails = () => {
        BaseService.goToComponentDetailTab(null, vm.data.partID);
      return false;
    };
    //redirect to work order list
    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
      return false;
    };

    vm.goToWorkorderDetails = (data) => {
      BaseService.goToWorkorderDetails(data.woID);
      return false;
    };

    vm.cancel = (data) => {
      const isdirty = vm.checkFormDirty(vm.checkInForm);
      if (isdirty) {
        const alertFormData = {
          form: vm.checkInForm
        };
        BaseService.showWithoutSavingAlertForPopUp(alertFormData);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel(data);
      }
    };

    //Get Equipments List
    const getEquipmentList = () => {
      const objs = {
        woOPID: vm.data.opData.woOPID,
        equipmentAs: ['E']
      };
      return EquipmentFactory.getOperationEquipmentlist().query({ equipmentObj: objs }).$promise.then((equipment) => {
        _.each(equipment.data, (item) => {
          let eqpMake = '';
          let eqpModel = '';
          let eqpYear = '';
          eqpMake = item.eqpMake ? '(' + item.eqpMake : '-';
          eqpModel = item.eqpModel ? '|' + item.eqpModel : '-';
          eqpYear = item.eqpYear ? '|' + item.eqpYear + ')' : '-';
          item.eqipmentName = item.assetName + ' ' + eqpMake + eqpModel + eqpYear;
        });
        return equipment.data;
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //Get Workstation List
    const getWorkstationList = () => {
      const objs = {
        employeeID: vm.data.employeeID,
        equipmentAs: 'W'
      };
      return EquipmentFactory.retriveEmployeeEquipmentsWithProfile().query({ equipmentObj: objs }).$promise.then((workstation) => {
        _.each(workstation.data, (item) => {
          let eqpMake = '';
          let eqpModel = '';
          let eqpYear = '';
          eqpMake = item.eqpMake ? '(' + item.eqpMake : '-';
          eqpModel = item.eqpModel ? '|' + item.eqpModel : '-';
          eqpYear = item.eqpYear ? '|' + item.eqpYear + ')' : '-';
          item.eqipmentName = item.assetName + ' ' + eqpMake + eqpModel + eqpYear;
        });
        return workstation.data;
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // on load of popup
    const cgPromise = [getEquipmentList(), getWorkstationList()];
    vm.cgBusyLoading = $q.all(cgPromise).then((responses) => {
      vm.EquipmentList = responses[0];
      vm.WorkstationList = responses[1];
      initAutoComplete();
    });

    const initAutoComplete = () => {
      vm.autoCompleteWorkstation = {
        columnName: 'eqipmentName',
        //controllerName: USER.ADMIN_EQUIPMENT_ADD_MODAL_CONTROLLER,
        //viewTemplateURL: USER.ADMIN_EQUIPMENT_ADD_MODAL_VIEW,
        keyColumnName: 'eqpID',
        keyColumnId: vm.selectedWorkstationId ? vm.selectedWorkstationId : null,
        inputName: 'Workstation',
        placeholderName: 'Workstation',
        isRequired: false,
        //isAddnew: true,
        callbackFn: getWorkstationList
      };
      vm.autoCompleteEquipment = {
        columnName: 'eqipmentName',
        //controllerName: USER.ADMIN_EQUIPMENT_ADD_MODAL_CONTROLLER,
        //viewTemplateURL: USER.ADMIN_EQUIPMENT_ADD_MODAL_VIEW,
        keyColumnName: 'eqpID',
        keyColumnId: vm.selectedEquipmentId ? vm.selectedEquipmentId : null,
        inputName: 'Equipments',
        placeholderName: 'Equipments',
        isRequired: false,
        //isAddnew: true,
        callbackFn: getEquipmentList
      };
    };

    const saveCheckInDetails = (opHistory) => {
      vm.saveBtnDisableFlag = true;
      if (vm.checkInForm.$invalid) {
        BaseService.focusRequiredField(vm.checkInForm);
        vm.saveBtnDisableFlag = false;
        return;
      }
      // Ask for confirmation before start activity
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.START_OPERATION_CONFIRM);
      messageContent.message = stringFormat(messageContent.message, vm.data.opData.opName);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          vm.cgBusyLoading = WorkorderTransFactory.checkInOperation().save(opHistory).$promise.then((res) => {
            vm.saveBtnDisableFlag = false;
            if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              closeCheckInPopupWithSuccess();
            }
            else if (res && res.status === CORE.ApiResponseTypeStatus.FAILED) {
              if (res && res.errors && res.errors && res.errors.data && res.errors.data.isActivityAlreadyStarted) {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.WO_OP_EMP_ACTIVITY_ALREADY_DONE);
                messageContent.message = stringFormat(messageContent.message, 'started');
                const model = {
                  messageContent: messageContent,
                  multiple: true
                };
                DialogFactory.messageAlertDialog(model).then(() => {
                  closeCheckInPopupWithSuccess();
                });
              }
            }
          }).catch((error) => {
            vm.saveBtnDisableFlag = false;
            return BaseService.getErrorLog(error);
          });
        }
      }, () => {
        vm.saveBtnDisableFlag = false;
      }).catch((error) => {
        vm.saveBtnDisableFlag = false;
        return BaseService.getErrorLog(error);
      });
    };

    const closeCheckInPopupWithSuccess = () => {
      const objSuccess = {};
      objSuccess.message = CORE.ApiResponseTypeStatus.SUCCESS;
      if (vm.checkInForm) {
        vm.checkInForm.$setPristine();
      }
      BaseService.currentPagePopupForm.pop();
      vm.cancel(objSuccess);
    };

    // check-in operation details
    vm.CheckIn = () => {
      const opHistory = {};
      var encryptedPassword = encryptAES(vm.data.password);
      vm.data.issueQty = vm.data.isSetup ? null : vm.data.issueQty;
      opHistory.woID = vm.data.opData.woID;
      opHistory.opID = vm.data.opData.opID;
      opHistory.woOPID = vm.data.opData.woOPID;
      opHistory.isSetup = vm.data.isSetup;
      opHistory.equipmentID = vm.autoCompleteEquipment.keyColumnId;
      opHistory.workstationID = vm.autoCompleteWorkstation.keyColumnId;
      opHistory.isProductionStarted = vm.data.isProductionStarted;
      if (vm.data.isSingleEmployee) {
        opHistory.isSingleEmployee = vm.data.isSingleEmployee;
        opHistory.woTransID = vm.data.objectEmployee.woTransID;
        opHistory.employeeID = vm.data.objectEmployee.employeeID;
        opHistory.password = encryptedPassword.toString();
      } else {
        opHistory.issueQty = vm.data.issueQty;
        opHistory.checkinEmployeeID = vm.data.employeeID;
        opHistory.employeeID = vm.data.employeeID;
      }

      if (vm.data.isSetup) {
        saveCheckInDetails(opHistory);
      } else {
        // added condition for check current total quantity with total build quantity excluding till process scrap quantity
        if (((vm.data.issueQty > vm.data.buildQty)
          || (vm.readyStockData && (vm.readyStockData.OPProdQty + vm.data.issueQty) > (vm.data.buildQty - vm.readyStockData.TillProcessScrapQty)))
          && (vm.readyStockData && (!vm.readyStockData.nextIsLoopOperation && !vm.readyStockData.currentIsLoopOperation))) {
          showIssueQtyMoreAlertMsg();
          return;
        } else {
          if (vm.data.opData.isRework) {
            if (vm.readyStockData
              && ((vm.readyStockData.OPProdQty + vm.data.issueQty) > vm.data.buildQty)
              && (!vm.readyStockData.nextIsLoopOperation && !vm.readyStockData.currentIsLoopOperation)) {
              showIssueQtyMoreAlertMsg();
              return;
            }
            const obj = {
              messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.REWORK_CASE_VALID_QTY_CONFIRM),
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
            };
            DialogFactory.messageConfirmDialog(obj).then((yes) => {
              if (yes) {
                saveCheckInDetails(opHistory);
              }
            }, () => {
              // cancel event
            }).catch((error) => BaseService.getErrorLog(error));
          } else {
            saveCheckInDetails(opHistory);
          }
        }
      }
    };

    // show issue qty not more than build qty message
    const showIssueQtyMoreAlertMsg = () => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.FROM_QTY_NOT_MORE_THAN_TO_QTY);
      messageContent.message = stringFormat(messageContent.message, 'Issue', 'build');
      const model = {
        messageContent: messageContent
      };
      DialogFactory.messageAlertDialog(model);
    };

    initAutoComplete();

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
            //vm.readyStockData.totalBuildQty = vm.readyStockData.BuildQty - vm.readyStockData.TillProcessScrapQty;
            // check for previous operation first than check for build quantity
            vm.readyStockData.totalValidQty = vm.readyStockData.issuePending;

            //if (vm.readyStockData.totalValidQty > vm.readyStockData.totalBuildQty) {
            //    vm.readyStockData.totalValidQty = vm.readyStockData.totalBuildQty;
            //}
            //OPProdQty
            if (vm.readyStockData) {
              vm.headerdata.push({ label: vm.LabelConstant.Traveler.ReadyforIssueQty, value: vm.readyStockData.issuePending, displayOrder: 1 });
              if (!vm.data.opData.isIssueQty) {
                vm.headerdata.push({ label: vm.LabelConstant.Traveler.CumulativeCompletedQty, value: vm.readyStockData.ReadyStock, displayOrder: 2 });
              }
            }
          }
          // overwrite valid quantity and issue quantity in case of quantity from last pre programming operation
          if (stockData.data.readyPCBComponentDet) {
            if (vm.data.opData.woOPID === stockData.data.readyPCBComponentDet.refStkWOOPID && stockData.data.readyPCBComponentDet.readyForPCB < vm.readyStockData.issuePending) {
              vm.readyStockData.totalValidQty = vm.readyStockData.issuePending = stockData.data.readyPCBComponentDet.readyForPCB;
            }
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    if (vm.data.opData.qtyControl && vm.data.opData.isIssueQty) {
      getStock();
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
    vm.headerdata.push({
      label: vm.LabelConstant.Workorder.WO, value: vm.data.woNumber, displayOrder: 4, labelLinkFn: vm.goToWorkorderList,
      valueLinkFn: vm.goToWorkorderDetails,
      valueLinkFnParams: { woID: vm.data.opData.woID }
    });
    vm.headerdata.push({ label: vm.LabelConstant.Workorder.Version, value: vm.data.woVersion, displayOrder: 5 });

    // on change activity
    vm.ChangeActivity = () => {
      if (vm.data.isSetup) {
        vm.data.issueQty = null;
      }
    };

    //on load submit form
    angular.element(() => {
      //check load
      BaseService.currentPagePopupForm.push(vm.checkInForm);
    });
  }
})();
