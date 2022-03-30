(function () {
  'use strict';

  angular
    .module('app.workorder.workorders')
    .controller('ManageWorkorderManualEntryController', ManageWorkorderManualEntryController);

  /** @ngInject */
  function ManageWorkorderManualEntryController($timeout, $state, $stateParams, USER, CORE, BaseService, WORKORDER, $q,
    WorkorderOperationEquipmentFactory, EquipmentFactory, WorkorderOperationEmployeeFactory, WorkorderTransFactory, DialogFactory,
    WorkorderFactory) {  // eslint-disable-line func-names
    const vm = this;
    vm.WOAllLabelConstant = CORE.LabelConstant.Workorder;
    vm.WOOPAllLabelConstant = CORE.LabelConstant.Operation;
    vm.todayDate = new Date();
    vm.isFliedDisabled = true;
    vm.isIssueQtyDisable = true;
    vm.RadioGroup = {
      Activity: {
        array: CORE.CheckInRadioGroup.Activity,
      }
    };
    vm.checkInDateOptions = {
      maxDate: vm.todayDate,
      appendToBody: true,
      checkinTimeOpenFlag: false
    };

    vm.checkOutDateOptions = {
      maxDate: vm.todayDate,
      appendToBody: true,
      checkoutTimeOpenFlag: false
    };

    if (!$stateParams.woID) {
      return;
    }
    vm.woID = $stateParams.woID;
    vm.woTransID = $stateParams.woTransID;
    vm.workOrder = {};
    vm.travelerCommonLabels = CORE.AllCommonLabels.TRAVELER;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.taToolbar = CORE.Toolbar;
    vm.OperationTimePattern = CORE.OperationTimePattern;
    vm.OperationTimeMask = CORE.OperationTimeMask;
    vm.DateTimeFormat = _dateTimeDisplayFormat;
    let woentrytype = CORE.WorkorderEntryType.Manual;
    vm.headerdata = [];
    var selectedEmployee;
    const rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    /* hyperlink go for list page */
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };

    /* go to particular assy */
    vm.goToPartDetails = (data) => {
        BaseService.goToComponentDetailTab(null, data.id);
      return false;
    };
    //redirect to work order list
    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
      return false;
    }
    //redirect to work order details
    vm.goToWorkorderDetails = () => {
      BaseService.goToWorkorderDetails(vm.woID);
      return false;
    }
    vm.goBack = () => {
      if (BaseService.checkFormDirty(vm.woManualEntryForm, vm.checkDirtyObject)) {
        showWithoutSavingAlertforBackButton();
      } else {
        $state.go(WORKORDER.WO_MANUAL_ENTRY_LIST_STATE, {
          woID: vm.woID
        });
      }
    }

    /* get work order status - text */
    let getWoStatus = (statusID) => {
      vm.woStatusText = BaseService.getWoStatus(statusID);
    }
    /* get work order status related css class */
    let getWoStatusClassName = (statusID) => {
      vm.woStatusClassName = BaseService.getWoStatusClassName(statusID);
    }

    function showWithoutSavingAlertforBackButton() {
      let obj = {
        title: CORE.MESSAGE_CONSTANT.WITHOUT_SAVING_ALERT_HEADER_MESSAGE,
        textContent: CORE.MESSAGE_CONSTANT.WITHOUT_SAVING_ALERT_BODY_MESSAGE,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      DialogFactory.confirmDiolog(obj).then((yes) => {
        if (yes)
          $state.go(WORKORDER.WO_MANUAL_ENTRY_LIST_STATE, {
            woID: vm.woID
          });
      }, (error) => {
        return BaseService.getErrorLog(error);
      });
    }

    let initAutoComplete = () => {
      vm.autoCompleteEmployee = {
        columnName: 'name',
        keyColumnName: 'id',
        keyColumnId: vm.workorder_trans ? (vm.workorder_trans.checkinEmployeeID ? vm.workorder_trans.checkinEmployeeID : null) : null,
        inputName: 'Personnel',
        placeholderName: 'Personnel',
        isRequired: true,
        isAddnew: false,
        onSelectCallbackFn: getAllOperationByWoEmpID,
        callbackFn: getAllEmployeeByWoID
      };

      vm.autoCompleteEquipment = {
        columnName: 'eqipmentName',
        keyColumnName: 'eqpID',
        keyColumnId: vm.workorder_trans ? (vm.workorder_trans.equipmentID ? vm.workorder_trans.equipmentID : null) : null,
        inputName: 'Equipments',
        placeholderName: 'Equipments',
        isRequired: false,
        isAddnew: false,
        callbackFn: getAllEquipmentByWoID
      };
    }

    let initAutoCompleteForWorkorderOperation = () => {
      vm.autoCompleteWorkorderOperation = {
        columnName: 'opName',
        keyColumnName: 'woOPID',
        keyColumnId: vm.workorder_trans ? (vm.workorder_trans.woOPID ? vm.workorder_trans.woOPID : null) : null,
        inputName: 'WorkorderOperation',
        placeholderName: 'Work Order Operation',
        isRequired: true,
        isAddnew: false,
        callbackFn: getAllOperation,
        onSelectCallbackFn: setWorkOrderOperationValueToModel
      };
    }
    let initAutoCompleteworkStation = () => {
      vm.autoCompleteWorkstation = {
        columnName: 'eqipmentName',
        //controllerName: USER.ADMIN_EQUIPMENT_ADD_MODAL_CONTROLLER,
        //viewTemplateURL: USER.ADMIN_EQUIPMENT_ADD_MODAL_VIEW,
        keyColumnName: 'eqpID',
        keyColumnId: vm.workorder_trans ? (vm.workorder_trans.workstationID ? vm.workorder_trans.workstationID : null) : null,
        inputName: 'Workstation',
        placeholderName: 'Workstation',
        isRequired: false,
        isAddnew: false,
        callbackFn: getWorkstationList,
        // onSelectCallbackFn: selectWorkstation
      };
    }

    let getWorkorderDetails = () => {
      vm.headerdata = [];
      return WorkorderFactory.workorder().query({ id: vm.woID }).$promise.then((response) => {
        vm.workOrder = (response && response.data) ? _.first(response.data) : null;
        getWoStatus(vm.workOrder.woSubStatus);
        getWoStatusClassName(vm.workOrder.woSubStatus);
        vm.headerdata.push({
          value: (vm.workOrder.componentAssembly && vm.workOrder.componentAssembly.PIDCode) ? vm.workOrder.componentAssembly.PIDCode : null,
          label: CORE.LabelConstant.Assembly.ID,
          displayOrder: (vm.headerdata.length + 1),
          labelLinkFn: vm.goToPartList,
          valueLinkFn: vm.goToPartDetails,
          valueLinkFnParams: { id: vm.workOrder.partID },
          isCopy: true,
          imgParms: {
            imgPath: (vm.workOrder.rohs && vm.workOrder.rohs.rohsIcon) ? (rohsImagePath + vm.workOrder.rohs.rohsIcon) : null,
            imgDetail: (vm.workOrder.rohs && vm.workOrder.rohs.name) ? vm.workOrder.rohs.name : null
          }
        }, {
          label: vm.WOAllLabelConstant.WO,
          value: angular.copy(vm.workOrder.woNumber),
          displayOrder: (vm.headerdata.length + 1),
          labelLinkFn: vm.goToWorkorderList,
          valueLinkFn: vm.goToWorkorderDetails
        }, {
          label: vm.WOAllLabelConstant.Version,
          value: angular.copy(vm.workOrder.woVersion),
          displayOrder: (vm.headerdata.length + 1)
        });
        vm.isWoInSpecificStatusNotAllowedToChange = (vm.workOrder.woStatus === CORE.WOSTATUS.TERMINATED || vm.workOrder.woStatus === CORE.WOSTATUS.COMPLETED || vm.workOrder.woStatus === CORE.WOSTATUS.VOID) ? true : false;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };

    /*Get Equipment List*/
    let getAllEquipmentByWoID = () => {

      return WorkorderOperationEquipmentFactory.retriveEquipmentListbyWoID().query({ woID: vm.woID }).$promise.then((equipmentlist) => {
        if (equipmentlist && equipmentlist.data) {
          _.each(equipmentlist.data, (item) => {
            let eqpMake = "";
            let eqpModel = "";
            let eqpYear = "";
            eqpMake = item.eqpMake ? '(' + item.eqpMake : '-';
            eqpModel = item.eqpModel ? '|' + item.eqpModel : '-';
            eqpYear = item.eqpYear ? '|' + item.eqpYear + ')' : '-';
            item.eqipmentName = item.assetName + ' ' + eqpMake + eqpModel + eqpYear;
          });
          return equipmentlist.data;
        } else {
          return null;
        }

      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    let getAllEmployeeByWoID = () => {
      let SelectedEmployeeList = [];
      return WorkorderOperationEmployeeFactory.retriveEmployeeListbyWoID().query({ woID: vm.woID }).$promise.then((employeelist) => {
        if (employeelist && employeelist.data) {
          _.each(employeelist.data, (item) => {

            if (item.workorderOperationEmployee.length > 0) {

              if (item.employeeDepartment) {
                item.employeeDepartment = _.first(item.employeeDepartment);
              }
              let deptName = "";
              let gencCategoryName = "";
              if (item.employeeDepartment && item.employeeDepartment.department) {
                deptName = " (" + item.employeeDepartment.department.deptName + ")";
              }
              if (item.employeeDepartment && item.employeeDepartment.genericCategory) {
                gencCategoryName = " " + item.employeeDepartment.genericCategory.gencCategoryName;
              }
              //item.name = (item.firstName ? item.firstName : "") + " " + (item.lastName ? item.lastName : "") + deptName + gencCategoryName;
              item.name = stringFormat(CORE.GENERIC_DATA_FORMAT.EmployeeManager, item.initialName, item.firstName, item.lastName) + deptName + gencCategoryName;
              if (item.profileImg && item.profileImg != "null") {
                item.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + item.profileImg;
              }
              else {
                item.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
              }

              SelectedEmployeeList.push(item);
            }
          });
        }
        return SelectedEmployeeList;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }


    let getAllOperationByWoEmpID = (item) => {
      selectedEmployee = item;
      vm.WorkorderOperationList = [];
      if (item && item.id) {
        getAllOperation().then((allOprations) => {
          initAutoCompleteForWorkorderOperation();
        })
        getWorkstationList().then((allOprations) => {
          initAutoCompleteworkStation();
        })
      }
      else {
        // vm.autoCompleteWorkorderOperation.keyColumnId = null;
        // vm.autoCompleteWorkstation.keyColumnId = null;
      }
    }

    //Get Workstation List
    let getWorkstationList = () => {
      let objs = {
        employeeID: selectedEmployee.id,
        equipmentAs: 'W'
      }
      return EquipmentFactory.retriveEmployeeEquipmentsWithProfile().query({ equipmentObj: objs }).$promise.then((workstation) => {
        if (workstation && workstation.data) {
          _.each(workstation.data, (item) => {
            let eqpMake = "";
            let eqpModel = "";
            let eqpYear = "";
            eqpMake = item.eqpMake ? '(' + item.eqpMake : '-';
            eqpModel = item.eqpModel ? '|' + item.eqpModel : '-';
            eqpYear = item.eqpYear ? '|' + item.eqpYear + ')' : '-';
            item.eqipmentName = item.assetName + ' ' + eqpMake + eqpModel + eqpYear;
            //  vm.WorkstationList.push(item);
          });
        }
        return vm.WorkstationList = (workstation && workstation.data) ? workstation.data : null;

      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    function getAllOperation() {
      let _objList = {};
      _objList.woID = vm.woID;
      _objList.employeeID = selectedEmployee.id;
      return WorkorderOperationEmployeeFactory.getOperationListByWoID().query({ listObj: _objList }).$promise.then((workorderoperationlist) => {
        if (workorderoperationlist && workorderoperationlist.data) {
          _.each(workorderoperationlist.data, (item) => {
            item.workorderOperation.opName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, item.workorderOperation.opName, item.workorderOperation.opNumber);
            vm.WorkorderOperationList.push(item.workorderOperation);
            vm.opdata = item.workorderOperation;
          })
        }
        return vm.WorkorderOperationList;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      })
    }

    let getWorkorderTansDetail = () => {
      return WorkorderTransFactory.workorder_trans().query({ woTransID: vm.woTransID }).$promise.then((res) => {
        if (res && res.data) {
          return res.data;
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    //vm.onChange = () => {
    //    if (vm.workorder_trans.isSetup) {
    //        vm.isChecked = false;
    //        vm.workorder_trans.issueQty = null;
    //        vm.workorder_trans.reprocessQty = null;
    //        vm.workorder_trans.totalQty = null;
    //        vm.workorder_trans.passQty = null;
    //        vm.workorder_trans.observedQty = null;
    //        vm.workorder_trans.reworkQty = null;
    //        vm.workorder_trans.scrapQty = null;
    //        vm.workorder_trans.boardWithMissingPartsQty = null;
    //        vm.workorder_trans.bypassQty = null;
    //    }
    //    else {
    //        if (vm.selectedOperation.qtyControl)
    //            vm.isChecked = false;
    //    }
    //}

    let setWorkOrderOperationValueToModel = (item) => {
      vm.selectedOperation = item;
      vm.opID = (item && item.opID) ? item.opID : null;
      vm.qtyControl = (item && item.qtyControl) ? item.qtyControl : null;
      if (item) {
        vm.headerdata.push({
          label: vm.WOOPAllLabelConstant.Name,
          value: angular.copy(item.opName),
          displayOrder: (vm.headerdata.length + 1)
        });
        if (item.qtyControl) {
          vm.isChecked = vm.workorder_trans.isSetup ? false : true;
        }
      }
      else {
        _.remove(vm.headerdata, { label: vm.WOOPAllLabelConstant.Name });
        vm.isChecked = false;
        vm.workorder_trans.issueQty = null;
        vm.workorder_trans.reprocessQty = null;
        vm.workorder_trans.totalQty = null;
        vm.workorder_trans.passQty = null;
        vm.workorder_trans.observedQty = null;
        vm.workorder_trans.reworkQty = null;
        vm.workorder_trans.scrapQty = null;
        vm.workorder_trans.boardWithMissingPartsQty = null;
        vm.workorder_trans.bypassQty = null;
      }
    }

    let selectWorkstation = (item) => {
      vm.eqpID = (item && item.eqpID) ? item.eqpID : null;
    }

    var cgPromise = [getWorkorderDetails(), getAllEquipmentByWoID(), getAllEmployeeByWoID()];
    if (vm.woTransID)
      cgPromise.push(getWorkorderTansDetail());

    vm.cgBusyLoading = $q.all(cgPromise).then((responses) => {
      vm.EquipmentList = responses[1];
      vm.EmployeeList = responses[2];
      vm.workorder_trans = responses[3];
      // vm.WorkstationList = responses[4];
      initAutoComplete();
      if (vm.workorder_trans) {
        //let date = new Date();
        //vm.workorder_trans.checkinTime = BaseService.getUIFormatedDateTime(vm.workorder_trans.checkinTime, vm.DateTimeFormat);  // Date convert date into local timezone
        vm.workorder_trans.checkinTime = vm.workorder_trans.checkinTime ? new Date(vm.workorder_trans.checkinTime) : null;
        vm.workorder_trans.checkoutTime = vm.workorder_trans.checkoutTime ? new Date(vm.workorder_trans.checkoutTime) : null;
        vm.workorder_trans.checkoutSetupTime = vm.workorder_trans.checkoutSetupTime ? secondsToTime(vm.workorder_trans.checkoutSetupTime) : vm.workorder_trans.checkoutSetupTime;
        var workorderTansedetaillist = [];
        workorderTansedetaillist = vm.workorder_trans.workorderTransProduction;
        _.each(workorderTansedetaillist, (item) => {
          vm.workorder_trans.totalQty = item.totalQty,
            vm.workorder_trans.passQty = item.passQty,
            vm.workorder_trans.observedQty = item.observedQty,
            vm.workorder_trans.reworkQty = item.reworkQty,
            vm.workorder_trans.scrapQty = item.scrapQty,
            vm.workorder_trans.issueQty = item.issueQty,
            vm.workorder_trans.reprocessQty = item.reprocessQty,
            vm.workorder_trans.boardWithMissingPartsQty = item.boardWithMissingPartsQty,
            vm.workorder_trans.bypassQty = item.bypassQty,
            vm.transProductionID = item.woTransprodID
        })
      }
      else {
        vm.workorder_trans = {
          isSetup: false
        };
        initAutoCompleteForWorkorderOperation();
        initAutoCompleteworkStation();
      }
      vm.workorder_transCopy = angular.copy(vm.workorder_trans ? vm.workorder_trans : vm.workorder_trans = {
      });
      vm.checkDirtyObject = {
        columnName: ["remark"],
        oldModelName: vm.workorder_transCopy,
        newModelName: vm.workorder_trans ? vm.workorder_trans : vm.workorder_trans = {
        }
      }
      vm.checkInDateOptions = {
        maxDate: vm.workorder_trans.checkoutTime ? vm.workorder_trans.checkoutTime : vm.todayDate
      };
    });
    vm.checkFormDirty = (form, columnName) => {
      let result = BaseService.checkFormDirty(form, columnName);
      return result;
    }

    vm.checkStepAndAction = (msWizard) => {
      if (msWizard.selectedIndex == 0) {
        vm.saveWorkorderTransaction();
      }
    }

    // on click of finish button in steps form
    vm.finish = (msWizard) => {
      if (msWizard.selectedIndex == 0) {
        vm.saveWorkorderTransaction();
      }
    }
    //is check production dtail 
    vm.productionDetail = () => {
      if (vm.isChecked) {
        vm.isFliedDisabled = false;
      }
      else {
        vm.isFliedDisabled = true;
      }

    }

    // Check for valid quantity on checkout button
    vm.IsValidQty = () => {
      if (vm.qtyControl) {
        if (vm.workorder_trans && vm.workorder_trans.totalQty) {
          vm.totalSumQty = (vm.workorder_trans.passQty ? vm.workorder_trans.passQty : 0) + (vm.workorder_trans.observedQty ? vm.workorder_trans.observedQty : 0)
            + (vm.workorder_trans.scrapQty ? vm.workorder_trans.scrapQty : 0) + (vm.workorder_trans.reworkQty ? vm.workorder_trans.reworkQty : 0)
            + (vm.workorder_trans.boardWithMissingPartsQty ? vm.workorder_trans.boardWithMissingPartsQty : 0) + (vm.workorder_trans.bypassQty ? vm.workorder_trans.bypassQty : 0);
          return ((vm.workorder_trans.totalQty == vm.totalSumQty));
        }
        else {
          return true;
        }
      }
      else {
        return true;
      }
    }

    // go to Equipment list page
    vm.goToEquipment = () => {
      BaseService.openInNew(USER.ADMIN_EQUIPMENT_STATE)
    }

    vm.employeelist = () => {
      BaseService.openInNew(USER.ADMIN_EMPLOYEE_STATE)
    }


    // Save Workorder manual data entry 
    vm.saveWorkorderTransaction = (msWizard) => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }
      var workorderTransactionInfo = {
        woID: vm.woID,
        checkinEmployeeID: vm.autoCompleteEmployee.keyColumnId,
        woOPID: vm.autoCompleteWorkorderOperation.keyColumnId,
        opID: vm.opID,
        isSetup: vm.workorder_trans.isSetup,
        equipmentID: vm.autoCompleteEquipment.keyColumnId,
        workstationID: vm.autoCompleteWorkstation.keyColumnId,
        checkinTime: vm.workorder_trans.checkinTime ? vm.workorder_trans.checkinTime : null,
        checkoutTime: vm.workorder_trans.checkoutTime ? vm.workorder_trans.checkoutTime : null,
        checkoutSetupTime: vm.workorder_trans.checkoutSetupTime ? timeToSeconds(vm.workorder_trans.checkoutSetupTime) : null,
        checkoutEmployeeID: vm.workorder_trans.checkoutTime ? vm.autoCompleteEmployee.keyColumnId : null,
        remark: vm.workorder_trans.remark,
        woentrytype: woentrytype,   //[T for Traveller page , M for Manual ]
        woNumber: vm.workOrder.woNumber,
        totalQty: vm.workorder_trans.totalQty,
        passQty: vm.workorder_trans.passQty,
        observedQty: vm.workorder_trans.observedQty,
        reworkQty: vm.workorder_trans.reworkQty,
        scrapQty: vm.workorder_trans.scrapQty,
        issueQty: vm.workorder_trans.issueQty,
        reprocessQty: vm.workorder_trans.reprocessQty,
        boardWithMissingPartsQty: vm.workorder_trans.boardWithMissingPartsQty,
        bypassQty: vm.workorder_trans.bypassQty,
        qtyControl: vm.qtyControl,
        transProductionID: vm.transProductionID,
      }


      if (vm.workorder_trans.woTransID) {
        vm.cgBusyLoading = WorkorderTransFactory.workorder_trans().update({
          woTransID: vm.workorder_trans.woTransID,
        }, workorderTransactionInfo).$promise.then((res) => {
          if (res.status == CORE.ApiResponseTypeStatus.SUCCESS) {
            $state.go(WORKORDER.WO_MANUAL_ENTRY_LIST_STATE, {
              woID: vm.woID
            });
          }
          else {
            if (res.status == "EMPTY" && res.errors) {
              vm.woManualEntryForm.$setPristine();
              vm.workorder_trans.checkoutSetupTime = null;
            }
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
      else {
        vm.cgBusyLoading = WorkorderTransFactory.workorder_trans().save(workorderTransactionInfo).$promise.then((res) => {
          if (res.data && res.data.woTransID.wotransID) {
            vm.workorder_trans.woTransID = res.data.woTransID.wotransID;
            //$state.transitionTo($state.$current, { woTransID: vm.workorder_trans.woTransID }, { location: true, inherit: true, notify: false });
            $state.go(WORKORDER.WO_MANUAL_ENTRY_LIST_STATE, {
              woID: vm.woID
            });
          }
          else {
            if (res.status == "EMPTY" && res.errors) {
              vm.woManualEntryForm.$setPristine();
              vm.workorder_trans.checkoutSetupTime = null;
            }
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
    }
    //Set mindate value onchange in Stop Date Time
    vm.onChangeCheckinTime = (checkoutTime) => {
      if (vm.workorder_trans.checkinTime) {
        vm.checkOutDateOptions = {
          minDate: vm.workorder_trans.checkinTime,
          maxDate: vm.todayDate,
          appendToBody: true,
          checkoutTimeOpenFlag: false
        };
        if (new Date(vm.workorder_trans.checkinTime) > new Date(checkoutTime)) {
          vm.workorder_trans.checkoutTime = null;
        }
      }
    }
    //MaxLength
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    }
  }
})();
