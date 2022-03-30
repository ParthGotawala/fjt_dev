(function () {
  'use strict';

  angular
    .module('app.workorder.workorders')
    .controller('ShowEmployeeListPopUpController', ShowEmployeeListPopUpController);

  /** @ngInject */
  function ShowEmployeeListPopUpController($filter, $scope, $q, $mdDialog, data, CORE, WORKORDER, OPERATION,
    EmployeeFactory, WorkorderOperationFactory, WorkorderOperationEmployeeFactory, DialogFactory, USER, BaseService, NotificationSocketFactory, MasterFactory) {
    const vm = this;
    vm.data = data;
    vm.EmptyMesssage = WORKORDER.WORKORDER_EMPTYSTATE.OPERATION;
    vm.headeTitle = vm.data.isFromWOEmployeeList ? CORE.LabelConstant.Personnel.PageName : CORE.LabelConstant.Operation.PageName;
    let cgPromise = [];
    const loginUserDetails = BaseService.loginUser;

    /* goto Assembly List Page */
    vm.goToAssemblyList = () => {
      BaseService.goToPartList();
      return false;
    };
    /* goto assembly detail page */
    vm.goToAssemblyDetails = () => {
      BaseService.goToComponentDetailTab(null, data.headerdata.partID);
      return false;
    };
    /* go to workorder list */
    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
      return false;
    };
    /* go to particular workorder detail */
    vm.goToWorkorderDetails = () => {
      BaseService.goToWorkorderDetails(data.woID);
      return false;
    };
    if (data.isFromWOEmployeeList) {
      // toDo for header of supplies material & tool selection
      vm.headerdata = [];
      vm.headerdata.push({
        value: data.headerdata.PIDCode,
        label: CORE.LabelConstant.Assembly.ID,
        displayOrder: (vm.headerdata.length + 1),
        labelLinkFn: vm.goToAssemblyList,
        valueLinkFn: vm.goToAssemblyDetails,
        isCopy: true,
        imgParms: {
          imgPath: data.headerdata.rohsIcon,
          imgDetail: data.headerdata.rohsName
        }
      }, {
        value: data.headerdata.woNumber,
        label: CORE.LabelConstant.Workorder.WO,
        displayOrder: (vm.headerdata.length + 1),
        labelLinkFn: vm.goToWorkorderList,
        valueLinkFn: data.woID ? vm.goToWorkorderDetails : null
      });
    } else {
      // todo for header of operation selection
      vm.headerdata = data.headerdata;
    }

    const getEmployeeList = () => {
      vm.EmployeeList = [];
      return EmployeeFactory.GetEmployeeDetail().query({ isOnlyActive: true }).$promise.then((employee) => {
        if (employee.data) {
          /* in refresh auto complete case - remove already added employee */
          if (vm.data.alreadyAddedEmpIDsInWo && vm.data.alreadyAddedEmpIDsInWo.length > 0) {
            employee.data = employee.data.filter((o1) => !vm.data.alreadyAddedEmpIDsInWo.some((o2) => o1.id === o2));
          }
          _.each(employee.data, (item) => {
            let deptName = '';
            let gencCategoryName = '';
            if (item.deptName) {
              deptName = ' (' + item.deptName + ')';
            }
            if (item.gencCategoryName) {
              gencCategoryName = ' ' + item.gencCategoryName;
            }
            item.name = stringFormat(CORE.GENERIC_DATA_FORMAT.EmployeeManager, item.initialName, item.firstName, item.lastName) + deptName + gencCategoryName;
            if (item.profileImg && item.profileImg !== 'null') {
              item.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + item.profileImg;
            }
            else {
              item.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
            }
          });
          vm.EmployeeList = employee.data;
          return $q.resolve(vm.EmployeeList);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getOperationList = () => {
      vm.WoOperationList = [];
      return WorkorderOperationFactory.retriveOPListbyWoID().query({ woID: data.woID }).$promise.then((operationlist) => {
        _.each(operationlist.data, (item) => {
          item.opName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, item.opName, item.opNumber);
        });
        vm.WoOperationList = operationlist.data;
        _.each(vm.WoOperationList, (item) => {
          item.fluxTypeList = [];
          item.fluxTypeList.push({
            value: item.isFluxNotApplicable, icon: CORE.FluxTypeIcon.notApplicableIcon, toolTip: CORE.FluxTypeToolTip.notApplicable, isShowIcon: true
          });
          item.fluxTypeList.push({
            value: item.isNoClean, icon: CORE.FluxTypeIcon.noCleanIcon, toolTip: CORE.FluxTypeToolTip.noClean, isShowIcon: true
          });
          item.fluxTypeList.push({
            value: item.isWaterSoluble, icon: CORE.FluxTypeIcon.waterSolubleIcon, toolTip: CORE.FluxTypeToolTip.waterSoluble, isShowIcon: true
          });
        });
        return $q.resolve(vm.WoOperationList);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const initAutoComplete = () => {
      vm.autoCompleteEmployee = {
        columnName: 'name',
        controllerName: USER.ADMIN_EMPLOYEE_ADD_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_EMPLOYEE_ADD_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.selectedEmployeeID ? vm.selectedEmployeeID : null,
        inputName: 'Personnel',
        placeholderName: 'Personnel',
        isRequired: true,
        isDisabled: vm.data.isFromWOEmployeeList ? false : true,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_EMPLOYEE_MANAGE_DETAIL_STATE],
          pageNameAccessLabel: CORE.LabelConstant.Personnel.PageName
        },
        isAddnew: true,
        callbackFn: getEmployeeList
      };
    };

    if (!vm.data.isFromWOEmployeeList) {
      cgPromise = [getEmployeeList()];
      vm.cgBusyLoading = $q.all(cgPromise).then(() => {
        vm.selectedEmployeeID = vm.data.employeeID;
        vm.WoOperationList = data.list;
        _.each(vm.WoOperationList, (item) => {
          item.fluxTypeList = [];
          item.fluxTypeList.push({
            value: item.isFluxNotApplicable, icon: CORE.FluxTypeIcon.notApplicableIcon, toolTip: CORE.FluxTypeToolTip.notApplicable, isShowIcon: true
          });
          item.fluxTypeList.push({
            value: item.isNoClean, icon: CORE.FluxTypeIcon.noCleanIcon, toolTip: CORE.FluxTypeToolTip.noClean, isShowIcon: true
          });
          item.fluxTypeList.push({
            value: item.isWaterSoluble, icon: CORE.FluxTypeIcon.waterSolubleIcon, toolTip: CORE.FluxTypeToolTip.waterSoluble, isShowIcon: true
          });
        });
        initAutoComplete();
      });
    }
    else {
      cgPromise = [getEmployeeList(), vm.getOperationList()];
      vm.cgBusyLoading = $q.all(cgPromise).then(() => {
        initAutoComplete();
      });
    }

    vm.save = () => {
      vm.saveDisable = true;
      if (BaseService.focusRequiredField(vm.employeeForm, false)) {
        vm.saveDisable = false;
        return;
      }

      if (vm.WoOperationList.length > 0) {
        const opSelectedlist = _.filter(vm.WoOperationList, (op) => op.selected == true);
        const op_empl_list = [];
        _.each(opSelectedlist, (item) => {
          const obj = {};
          obj.woID = vm.data.woID;
          obj.opID = item.opID;
          obj.woOPID = item.woOPID;
          obj.employeeID = vm.autoCompleteEmployee.keyColumnId ? vm.autoCompleteEmployee.keyColumnId : null;
          op_empl_list.push(obj);
        });
        if (op_empl_list.length > 0) {
          addNewEmployee(op_empl_list);
        } else {
          DialogFactory.alertDialog({ title: CORE.MESSAGE_CONSTANT.ALERT_HEADER, textContent: CORE.MESSAGE_CONSTANT.SELECET_OPERATION, multiple: true });
          vm.saveDisable = false;
        }
      }
      else {
        DialogFactory.alertDialog({
          title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
          textContent: vm.EmptyMesssage.NO_SELECTED,
          multiple: true
        });
        vm.saveDisable = false;
      }
    };

    function addNewEmployee(op_empl_list, versionModel) {
      vm.cgBusyLoading = WorkorderOperationEmployeeFactory.addEmployeeToWorkOrder().query({
        listObj: op_empl_list
      }).$promise.then(() => {
        const obj = _.find(vm.EmployeeList, (emp) => emp.id === vm.autoCompleteEmployee.keyColumnId);
        if (obj) {
          obj.selected = false;
          BaseService.currentPagePopupForm.pop();
          $mdDialog.hide([obj, versionModel]);
          // Send notification of change to all users
          sendNotification(versionModel);
        }
        vm.saveDisable = false;
      }).catch((error) => {
        vm.saveDisable = false;
        return BaseService.getErrorLog(error);
      });
    }

    // [S] Notification methods
    function sendNotification(versionModel) {
      if (versionModel) {
        versionModel.employeeID = loginUserDetails.employee.id;
        versionModel.messageType = CORE.NOTIFICATION_MESSAGETYPE.WO_VERSION_CHANGE.TYPE;
        NotificationSocketFactory.sendNotification().save(versionModel).$promise.then(() => {
          /* empty */
        }).catch(() => {
          vm.saveDisable = false;
        });
      }
    }

    //function openWORevisionPopup(ReftypeID, callbackFn, event) {
    //  var model = {
    //    woID: ReftypeID
    //  };
    //  DialogFactory.dialogService(
    //    WORKORDER.WORKORDER_REVISION_POPUP_CONTROLLER,
    //    WORKORDER.WORKORDER_REVISION_POPUP_VIEW,
    //    event,
    //    model).then((versionModel) => {
    //      callbackFn(versionModel);
    //    }, (error) => {
    //      callbackFn();
    //    });
    //}
    // [E] Notification methods


    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.employeeForm);
      if (isdirty) {
        const data = {
          form: vm.employeeForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    //Redirect to operation master
    vm.goToOperationList = () => {
      BaseService.openInNew(OPERATION.OPERATION_OPERATIONS_STATE, {});
    };

    //Redirect to personal master
    vm.goToPersonalList = () => {
      BaseService.openInNew(USER.ADMIN_EMPLOYEE_STATE, {});
    };

    /*
    * Author :  Vaibhav Shah
    * Purpose : Select All Operations
    */
    vm.SelectAllOp = false;
    vm.SelectAllOperation = () => {
      vm.SelectAllOp = !vm.SelectAllOp;
      if (vm.SelectAllOp) {
        _.each(vm.WoOperationList, (em) => { em.selected = true; });
      }
      else {
        _.each(vm.WoOperationList, (em) => { em.selected = false; });
      }
      if (vm.employeeForm && vm.WoOperationList.length > 0 && vm.employeeForm[vm.WoOperationList[0].opName]) {
        vm.employeeForm.$setDirty();
        vm.employeeForm[vm.WoOperationList[0].opName].$setDirty();
      }
    };

    // set select all/deselect
    vm.AddToSelectedOperation = () => {
      const opCount = _.countBy(vm.WoOperationList, (op) => op.selected == true);
      if (opCount[true] == vm.WoOperationList.length) {
        vm.SelectAllOp = true;
      } else {
        vm.SelectAllOp = false;
      }
    };

    /* to move at operation update page */
    vm.goToManageOperation = (operationID) => {
      BaseService.goToManageOperation(operationID);
    };

    //on load submit form
    angular.element(() => {
      //check load
      BaseService.currentPagePopupForm.push(vm.employeeForm);
    });
  }
})();
