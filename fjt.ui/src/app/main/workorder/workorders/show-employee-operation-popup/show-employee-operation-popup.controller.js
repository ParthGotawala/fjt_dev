(function () {
  'use strict';

  angular
    .module('app.workorder.workorders')
    .controller('ShowEmployeeOperationPopUpController', ShowEmployeeOperationPopUpController);

  /** @ngInject */
  function ShowEmployeeOperationPopUpController($filter, $scope, $mdDialog, $q, WORKORDER, USER, CORE, data,
    WorkorderOperationEmployeeFactory, DialogFactory, BaseService, MasterFactory, NotificationSocketFactory) {

    const vm = this;
    vm.data = data;

    //vm.department = vm.data.selectedEmployee.deptName;
    //let header = "";
    //if (vm.department)
    //    header = vm.Employee + ' (' + vm.department + ')';
    //else
    //  header = vm.Employee;

    let deptName = "";
    let gencCategoryName = "";
    if (vm.data.selectedEmployee.deptName) {
      deptName = " (" + vm.data.selectedEmployee.deptName + ")";
    }
    if (vm.data.selectedEmployee.gencCategoryName) {
      gencCategoryName = " " + vm.data.selectedEmployee.gencCategoryName;
    }
    vm.Employee = stringFormat(CORE.GENERIC_DATA_FORMAT.EmployeeManager, vm.data.selectedEmployee.initialName, vm.data.selectedEmployee.firstName, vm.data.selectedEmployee.lastName);
    let empFullNameHeader = vm.Employee + deptName + gencCategoryName;

    vm.headerdata = [];
    vm.headerdata.push({ label: 'Personnel', value: empFullNameHeader, displayOrder: 1 });

    vm.operationListRepo = [];
    let _EmployeeOperationList = [];
    vm.EmployeeOperationList = [];
    vm.SearchEmployeeOperationText = null;
    vm.EmptyMesssageOperation = WORKORDER.WORKORDER_EMPTYSTATE.OPERATION;
    let changeObj = {
      isChanged: false
    };

    let loginUserDetails = BaseService.loginUser;

    // [S] Get WO details for notification
    var workorderDetails = null;
    let getWorkorderByID = () => {
      return MasterFactory.getWODetails().query({ woID: data.woID }).$promise.then((response) => {
        if (response && response.data) {
          workorderDetails = response.data;
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    // [E] Get WO details for notification

    /*
     * Author :  Vaibhav Shah
     * Purpose : Get Employee Details by EmpID
     */
    let GetEmployeeDetailsByEmpID = () => {
      let _objList = {};
      _objList.woID = data.woID;
      _objList.employeeID = vm.data.selectedEmployee.id;
      return WorkorderOperationEmployeeFactory.retriveEmployeeDetailsbyEmpID().query({ listObj: _objList }).$promise.then((employeedetails) => {
        if (employeedetails.data.length > 0) {
          vm.data.selectedEmployee = _.first(employeedetails.data);
          // vm.data.selectedEmployee.employeeDocument = _.first(vm.data.selectedEmployee.employeeDocument);
          if (vm.data.selectedEmployee.profileImg) {
            vm.data.selectedEmployee.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + vm.data.selectedEmployee.profileImg;
          }
          else {
            vm.data.selectedEmployee.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
          }
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }


    /*
      * Author :  Vaibhav Shah
      * Purpose : Bind Employee Operation List
      */
    let BindEmployeeOperationList = () => {
      _EmployeeOperationList = vm.EmployeeOperationList = [];
      vm.cgBusyLoading = WorkorderOperationEmployeeFactory.retriveOperationListbyWoID().query({ woID: data.woID }).$promise.then((operationlist) => {
        vm.operationListRepo = operationlist.data;
        _.each(vm.operationListRepo, (item) => {
          item.opName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, item.opName, item.opNumber);
        });
        if (vm.data.selectedEmployee) {
          _.each(vm.data.selectedEmployee.workorderOperationEmployee, (item) => {
            if (item) {
              let objOp = _.find(vm.operationListRepo, (op) => {
                return op.opID == item.opID;
              })
              if (objOp) {
                objOp.fluxTypeList = [];
                objOp.fluxTypeList.push({
                  value: objOp.isFluxNotApplicable, icon: CORE.FluxTypeIcon.notApplicableIcon, toolTip: CORE.FluxTypeToolTip.notApplicable, isShowIcon: true
                });
                objOp.fluxTypeList.push({
                  value: objOp.isNoClean, icon: CORE.FluxTypeIcon.noCleanIcon, toolTip: CORE.FluxTypeToolTip.noClean, isShowIcon: true
                });
                objOp.fluxTypeList.push({
                  value: objOp.isWaterSoluble, icon: CORE.FluxTypeIcon.waterSolubleIcon, toolTip: CORE.FluxTypeToolTip.waterSoluble, isShowIcon: true
                });
                vm.EmployeeOperationList.push(objOp);
              }
            }
          });
        }
        _EmployeeOperationList = vm.EmployeeOperationList;
        //vm.ALLoperationList = _EmployeeOperationList;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    var cgPromise = [];
    cgPromise = [getWorkorderByID(), GetEmployeeDetailsByEmpID()];
    vm.cgBusyLoading = $q.all(cgPromise).then((responses) => {
      BindEmployeeOperationList();
    });

    /*
       * Author :  Vaibhav Shah
       * Purpose : Search Operation
       */
    vm.SearchOperation = (list, searchText) => {
      if (!searchText) {
        vm.SearchEmployeeOperationText = null;
        vm.EmployeeOperationList = _EmployeeOperationList;
        vm.FilterOperation = true;
        return;
      }
      vm.EmployeeOperationList = $filter('filter')(_EmployeeOperationList, { opName: searchText });
      vm.FilterEmployeeOperationList = vm.EmployeeOperationList.length > 0;
    }

    vm.setFocus = (text) => {
      let someElement = angular.element(document.querySelector('#' + text));
      if (someElement && someElement.length > 0) {
        someElement[0].focus();
      }
    }

    /*
      * Author :  Vaibhav Shah
      * Purpose : Delete Operation from Work Order
      */
    vm.DeleteOperationFromWorkorder = (operation, event) => {
      let obj = {
        title: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM, "Operation"),
        textContent: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM_DETAILS_MESSAGE, "Operation"),
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.confirmDiolog(obj).then((yes) => {
        if (yes) {
          removeOperationFromWorkorder(operation);
          //if (workorderDetails && workorderDetails.woStatus == CORE.WOSTATUS.PUBLISHED) {
          //  openWORevisionPopup(data.woID, function (versionModel) {
          //    // Added for close revision dialog popup
          //    if (versionModel && versionModel.isCancelled) {
          //      return;
          //    }
          //    removeOperationFromWorkorder(operation, versionModel);
          //  }, event);
          //}
          //else {
          //  removeOperationFromWorkorder(operation);
          //}
        }
      }, (cancel) => {
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    function removeOperationFromWorkorder(operation, versionModel) {
      let _objList = {};
      let opIDs = [];
      _objList.woID = data.woID;
      opIDs.push(operation.opID);
      _objList.opID = opIDs;
      _objList.woOPID = operation.woOPID;
      _objList.employeeID = vm.data.selectedEmployee.id;

      vm.cgBusyLoading = WorkorderOperationEmployeeFactory.deleteOperationFromWorkOrder().query({ listObj: _objList }).$promise.then((operation) => {
        if (operation && operation.data) {
          if (operation.data.TotalCount && operation.data.TotalCount > 0) {
            BaseService.deleteAlertMessage(operation.data);
          }
          else {
            _.each(opIDs, (_item) => {
              _.remove(_EmployeeOperationList, (o) => {
                return o.opID == _item;
              });
            });
            vm.EmployeeOperationList = _EmployeeOperationList;
            vm.SearchEmployeeOperationText = null;
            changeObj.isChanged = true;

            //// Send notification of change to all users
            //sendNotification(versionModel);

            ///* refresh work order header conditionally */
            //if (versionModel && versionModel.woVersion) {
            //  vm.data.refreshWorkOrderHeaderDetails();
            //}
          }
        }

      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    /*
     * Author :  Vaibhav Shah
     * Purpose : Add new operation poup
     */
    vm.AddNewOperationToEmployee = (ev) => {
      let data = {};
      data.isFromWOEmployeeList = false;
      data.woID = vm.data.woID;
      data.employeeID = vm.data.selectedEmployee.id;
      data.headerdata = vm.headerdata;
      let listOperation = [];
      _.each(vm.operationListRepo, (_mainOp) => {
        let obj = _.find(_EmployeeOperationList, (_emp) => {
          return _emp.opID == _mainOp.opID;
        });
        if (!obj) {
          listOperation.push(_mainOp);
        }
      })
      data.list = listOperation;
      DialogFactory.dialogService(
        WORKORDER.WORKORDER_SHOW_EMPLOYEELIST_MODAL_CONTROLLER,
        WORKORDER.WORKORDER_SHOW_EMPLOYEELIST_MODAL_VIEW,
        ev,
        data).then((response) => {
          var val = response[0];
          //var versionModel = response[1];
          if (val) {
            cgPromise = [GetEmployeeDetailsByEmpID()];
            vm.cgBusyLoading = $q.all(cgPromise).then((responses) => {
              BindEmployeeOperationList();
            });
            /* refresh work order header conditionally */
            //if (versionModel && versionModel.woVersion) {
            //  vm.data.refreshWorkOrderHeaderDetails();
            //}
          }
        }, (val) => {
          if (val) {
            let obj = _.find(vm.operationListRepo, (oprn) => {
              return oprn.opID == val.opID;
            });
            if (obj) {
              _EmployeeOperationList.push(obj);
              vm.EmployeeOperationList = _EmployeeOperationList;
              changeObj.isChanged = true;
            }
          }
        });
    }

    // [S] Notification methods
    function sendNotification(versionModel) {
      if (versionModel) {
        versionModel.employeeID = loginUserDetails.employee.id;
        versionModel.messageType = CORE.NOTIFICATION_MESSAGETYPE.WO_VERSION_CHANGE.TYPE;
        NotificationSocketFactory.sendNotification().save(versionModel).$promise.then((response) => {
          /* empty */
        }).catch((error) => {
          /* empty */
        });
      }
    }

    function openWORevisionPopup(ReftypeID, callbackFn, event) {
      var model = {
        woID: ReftypeID
      };
      DialogFactory.dialogService(
        WORKORDER.WORKORDER_REVISION_POPUP_CONTROLLER,
        WORKORDER.WORKORDER_REVISION_POPUP_VIEW,
        event,
        model).then((versionModel) => {
          callbackFn(versionModel);
        }, (error) => {
          callbackFn();
        });
    }
    // [E] Notification methods

    vm.cancel = () => {
      $mdDialog.cancel(changeObj);
    };

    /* to move at operation update page */
    vm.goToManageOperation = (operationID) => {
      BaseService.goToManageOperation(operationID);
    }

  }
})();
