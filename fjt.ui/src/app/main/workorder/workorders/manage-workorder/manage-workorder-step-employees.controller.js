(function () {
  'use strict';

  angular
    .module('app.workorder.workorders')
    .controller('ManageWorkorderEmployeesController', ManageWorkorderEmployeesController);

  /** @ngInject */
  function ManageWorkorderEmployeesController($scope, $timeout,
    CORE, USER, WORKORDER, $mdDialog, $state,
    WorkorderOperationEmployeeFactory, BaseService, DialogFactory) {
    // Don't Remove this code
    // Don't add any code before this
    if (!$scope.$parent.$parent.vm.workorder || !$scope.$parent.$parent.vm.workorder.woID) {
      $state.go(WORKORDER.MANAGE_WORKORDER_DETAILS_STATE, { woID: null });
      return;
    }
    $scope.vm = $scope.$parent.$parent.vm;
    //Add form name for check form dirty
    $scope.vm.CurrentForm = null;
    let vm = $scope.vm;
    // add code after this only
    // Don't Remove this code
    vm.EmptyMesssage = WORKORDER.WORKORDER_EMPTYSTATE.ASSIGNEMPLOYEES;
    vm.EmptyMesssageForOperationNotAdded = WORKORDER.WORKORDER_EMPTYSTATE.OPERATION;

    //let _EmployeeListRepo = [];
    vm.SelectAllEmp = false;

    let _SelectedEmployeeList = [];
    vm.SelectedEmployeeList = [];

    // Restrict changes into all fields if work order status is 'under termination'
    //vm.isWOUnderTermination = (vm.workorder.woStatus == CORE.WOSTATUS.UNDER_TERMINATION || vm.workorder.woStatus == CORE.WOSTATUS.TERMINATED);

    vm.SearchSelectedEmployeeTxt = null;

    /*
     * Author :  Vaibhav Shah
     * Purpose : Get All Employee list for woID
     */
    let GetEmployeeListByWoID = () => {
      //vm.SearchSelectedEmployeeTxt = null;
      vm.SelectAllEmp = false;
      vm.SelectedEmployeeList = [];
      if (!vm.SearchSelectedEmployeeTxt) {
        _SelectedEmployeeList = [];
      }
      //vm.cgBusyLoading = WorkorderOperationEmployeeFactory.retriveEmployeeListbyWoID().query({ woID: vm.workorder.woID }).$promise.then((employeelist) => {
      vm.cgBusyLoading = WorkorderOperationEmployeeFactory.retrieveAddedEmployeeListForWO().query({
        woID: vm.workorder.woID,
        searchText: vm.SearchSelectedEmployeeTxt ? vm.SearchSelectedEmployeeTxt : null
      }).$promise.then((employeelist) => {
        //_EmployeeListRepo = employeelist.data.woOpEmpList;
        _.each(employeelist.data.woOpEmpList, (itemData) => {
          let deptName = "";
          let gencCategoryName = "";
          if (itemData.deptName) {
            deptName = " (" + itemData.deptName + ")";
          }
          if (itemData.gencCategoryName) {
            gencCategoryName = " " + itemData.gencCategoryName;
          }
          //itemData.name = (itemData.firstName ? itemData.firstName : "") + " " + (itemData.lastName ? itemData.lastName : "") + deptName + gencCategoryName;
          itemData.name = stringFormat(CORE.GENERIC_DATA_FORMAT.EmployeeManager, itemData.initialName, itemData.firstName, itemData.lastName) + deptName + gencCategoryName;

          if (itemData.profileImg) {
            itemData.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + itemData.profileImg;
          }
          else {
            itemData.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
          }
          itemData.empCertificationDetList = [];
          if (itemData.empCertifications) {
            setEmployeeCertificationDet(itemData);
          }
          if (itemData.workorderOperationEmployee.length > 0) {
            vm.SelectedEmployeeList.push(itemData);
          }
        });

        if (!vm.SearchSelectedEmployeeTxt) {
          _SelectedEmployeeList = angular.copy(vm.SelectedEmployeeList);
        }
        vm.isDiplaySearFilterForWOEmployee = _SelectedEmployeeList.length > 0 ? true : false;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    let setEmployeeCertificationDet = (EmpItemData) => {
      let classWithColorCode = EmpItemData.empCertifications.split("@@@@@@");
      _.each(classWithColorCode, (item) => {
        if (item) {
          let objItem = item.split("######");
          let standardClassObj = {};
          standardClassObj.stdClassName = objItem[0].trim();
          standardClassObj.colorCode = objItem[1] ? objItem[1] : CORE.DefaultStandardTagColor;
          EmpItemData.empCertificationDetList.push(standardClassObj);
        }
      });
    }

    /*
    * Author :  Vaibhav Shah
    * Purpose : Onclick of step 5 Select Employee
    */
    vm.getWorkorderEmployeeList = () => {
      $timeout(() => {
        vm.SearchSelectedEmployeeTxt = null;
        GetEmployeeListByWoID();
      }, _configSelectListTimeout)
    }

    /*
     * Author :  Vaibhav Shah
     * Purpose : Delete employee from operation list for workorder
     */
    vm.DeleteEmployeeFromWorkorder = (employee, type, event) => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }
      let obj = {
        title: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM, "Personnel"),
        textContent: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM_DETAILS_MESSAGE, "Personnel"),
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.confirmDiolog(obj).then((yes) => {
        if (yes) {
          removeEmployeeFromWorkorder(employee, type);
          //if (vm.workorder.woStatus == CORE.WOSTATUS.PUBLISHED) {
          //  vm.openWORevisionPopup(function (versionModel) {
          //    // Added for close revision dialog popup
          //    if (versionModel && versionModel.isCancelled) {
          //      return;
          //    }
          //    removeEmployeeFromWorkorder(employee, type, versionModel);
          //  }, event);
          //}
          //else {
          //  removeEmployeeFromWorkorder(employee, type);
          //}
        }
      }, (cancel) => {
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    function removeEmployeeFromWorkorder(employee, type, versionModel) {
      let _objList = {};
      _objList.woID = vm.workorder.woID;
      let Ids = [];
      let woOPID = [];
      if (type == "Multiple") {
        Ids.push(employee.employeeID);
        _objList.employeeID = employee.employeeID;
        _objList.woOPID = employee.woOPID;
      } else {
        Ids.push(employee.id);
        _objList.employeeID = employee.id;
        _.each(employee.workorderOperationEmployee, (item) => {
          if (item.woOPID != null)
            woOPID.push(item.woOPID);
        });
        _objList.woOPID = woOPID;
      }

      vm.cgBusyLoading = WorkorderOperationEmployeeFactory.deleteOperationFromWorkOrder().query({ listObj: _objList }).$promise.then((employee) => {
        if (employee && employee.data) {
          if (employee.data.TotalCount && employee.data.TotalCount > 0) {
            BaseService.deleteAlertMessage(employee.data);
          }
          else {
            if (type == "Multiple") {
              Ids = _.first(Ids);
              _.each(Ids, (item) => {
                _.remove(_SelectedEmployeeList, (ep) => { return ep.id == item; });
              });
            } else {
              _.remove(_SelectedEmployeeList, (ep) => { return ep.id == Ids; });
            }
            vm.SearchSelectedEmployeeTxt = null;
            GetEmployeeListByWoID();
            //vm.SelectedEmployeeList = _SelectedEmployeeList;
            //vm.isDiplaySearFilterForWOEmployee = _SelectedEmployeeList.length > 0 ? true : false;
            //vm.SelectAllEmp = true;
            //vm.SelectAllEmployee();
            //vm.SearchSelectedEmployeeTxt = null;
            // Send details change notification using socket.io
            //vm.sendNotification(versionModel);

            ///* refresh work order header conditionally */
            //if (versionModel && versionModel.woVersion) {
            //  vm.refreshWorkOrderHeaderDetails();
            //}
          }
        }

      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    /*
     * Author :  Vaibhav Shah
     * Purpose : View Associate Operation For Work Order
     */
    vm.ViewOperationByEmployeeFromWorkorder = (employee, ev) => {
      let data = {};
      data.woID = vm.workorder.woID;
      data.selectedEmployee = angular.copy(employee);
      data.refreshWorkOrderHeaderDetails = vm.refreshWorkOrderHeaderDetails;
      data.isWoInSpecificStatusNotAllowedToChange = vm.isWoInSpecificStatusNotAllowedToChange;
      DialogFactory.dialogService(
        WORKORDER.WORKORDER_SHOWEMPLOYEE_OPERATION_MODAL_CONTROLLER,
        WORKORDER.WORKORDER_SHOWEMPLOYEE_OPERATION_MODAL_VIEW,
        ev,
        data).then(() => {
        }, (val) => {
          if (val) {
            //if (val && val.isChanged) {
            //    vm.SelectedEmployeeList.push(val);
            //    _SelectedEmployeeList = vm.SelectedEmployeeList;
            //    vm.isDiplaySearFilterForWOEmployee = _SelectedEmployeeList.length > 0 ? true : false;
            //}
            vm.SearchSelectedEmployeeTxt = null;
            GetEmployeeListByWoID();
          }
        }, (err) => {
          return BaseService.getErrorLog(err);
        });
    }

    /*
    * Author :  Vaibhav Shah
    * Purpose : Add new employee popup
    */
    vm.AddNewEmployeeToWorkOrder = (ev) => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }
      let data = {};
      data.isFromWOEmployeeList = true;
      data.woID = vm.workorder.woID;
      let listOperation = [];
      data.list = [];
      //data.alreadyAddedEmpIDsInWo = alreadyAddedEmpIDs;
      data.alreadyAddedEmpIDsInWo = _.map(_SelectedEmployeeList, 'id');
      data.headerdata = {
        woNumber: vm.workorder.woNumber ? vm.workorder.woNumber : null,
        PIDCode: (vm.workorder.componentAssembly && vm.workorder.componentAssembly.PIDCode) ? vm.workorder.componentAssembly.PIDCode : null,
        partID: vm.workorder.partID ? vm.workorder.partID : null,
        rohsIcon: (vm.workorder.rohs && vm.workorder.rohs.rohsIcon) ? (CORE.WEB_URL + USER.ROHS_BASE_PATH + vm.workorder.rohs.rohsIcon) : null,
        rohsName: (vm.workorder.rohs && vm.workorder.rohs.name) ? vm.workorder.rohs.name : null
      };
      DialogFactory.dialogService(
        WORKORDER.WORKORDER_SHOW_EMPLOYEELIST_MODAL_CONTROLLER,
        WORKORDER.WORKORDER_SHOW_EMPLOYEELIST_MODAL_VIEW,
        ev,
        data).then((response) => {

          if (response) {
            var val = response[0];
            //var versionModel = response[1];

            if (val) {
              vm.SearchSelectedEmployeeTxt = null;
              GetEmployeeListByWoID();
            }

            // get updated woVersion from model response and update
            //if (versionModel && versionModel.woVersion) {
            //  vm.workorder.woVersion = versionModel.woVersion;
            //}

            ///* refresh work order header conditionally */
            //if (val && versionModel && versionModel.woVersion) {
            //  vm.refreshWorkOrderHeaderDetails();
            //}
          }
        }, () => {
        }, (err) => {
          return BaseService.getErrorLog(err);
        });
    }

    /*
    * Author :  Vaibhav Shah
    * Purpose : Search Employee from Selected Employee List
    */
    vm.SearchSelectedEmployee = () => {
      //if (!searchText) {
      //    vm.SearchSelectedEmployeeTxt = null;
      //    vm.SelectedEmployeeList = _SelectedEmployeeList;
      //    vm.FilterSelectedEmployee = true;
      //    return;
      //}
      //vm.SelectedEmployeeList = $filter('filter')(_SelectedEmployeeList, { name: searchText });
      //vm.FilterSelectedEmployee = vm.SelectedEmployeeList.length > 0;
      GetEmployeeListByWoID();
    }

    /*
    * Author :  Vaibhav Shah
    * Purpose : Get Selected Employee Count
    */
    vm.getSelectedEmployeeCount = () => {
      let objList = [];
      let employeeID = [];
      let woOPID = [];
      objList = _.filter(vm.SelectedEmployeeList, (emp) => { return emp.selected == true; });
      employeeID = _.map(objList, 'id');
      ////Check Not Null for woOPID 
      //_.each(objList, (item) => {
      //    let emp = _.find(item.workorderOperationEmployee, (w) => {
      //        if (w.woOPID != null) {
      //            return w.woOPID;
      //        }
      //    });
      //    if (emp) {
      //        woOPID.push(emp.woOPID);
      //    }
      //});
      _.each(objList, (item) => {
        woOPID.push(_.map(item.workorderOperationEmployee, 'woOPID'));
      });
      vm.selectedEmpList = {
        employeeID: employeeID,
        woOPID: woOPID
      }
      let cnt = vm.SelectedEmployeeList.length;
      let objcnt = objList.length;
      if (objcnt < cnt) {
        vm.SelectAllEmp = false;
      }
      else {
        vm.SelectAllEmp = true;
      }
      return objList.length;
    }

    /*
    * Author :  Vaibhav Shah
    * Purpose : Select All Employee
    */
    vm.SelectAllEmployee = () => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }
      vm.SelectAllEmp = !vm.SelectAllEmp;
      if (vm.SelectAllEmp) {
        _.each(vm.SelectedEmployeeList, (em) => { em.selected = true; });
      }
      else {
        _.each(vm.SelectedEmployeeList, (em) => { em.selected = false; });
      }
    }

    /* to move at employee update page */
    vm.goToUpdatePersonnel = (employeeID) => {
      BaseService.goToManagePersonnel(employeeID);
    }

    vm.moveToAddOperationsTab = () => {
      $('.jstree').jstree(true).deselect_all(true);
      $('.jstree').jstree(true).select_node(CORE.Workorder_Tabs.Operations.ID);
    }

    //close popup on page destroy 
    $scope.$on('$destroy', function () {
      $mdDialog.hide(false, {
        closeAll: true
      });
    });
    vm.getWorkorderEmployeeList();

  };
})();
