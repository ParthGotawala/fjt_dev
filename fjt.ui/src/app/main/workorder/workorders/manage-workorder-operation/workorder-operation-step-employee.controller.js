(function () {
  'use strict';
  angular
    .module('app.workorder.workorders')
    .controller('WorkorderOperationEmployeesController', WorkorderOperationEmployeesController);

  /** @ngInject */
  function WorkorderOperationEmployeesController($scope, $timeout, $q, $mdDialog,
    OPERATION, CORE, USER, DialogFactory,
    uiSortableMultiSelectionMethods, WorkorderOperationFactory, WorkorderOperationEmployeeFactory, BaseService) {
    // Don't Remove this code
    // Don't add any code before this
    $scope.vm = $scope.$parent.$parent.vm;
    //Add form name for check form dirty
    $scope.vm.CurrentForm = null;
    let vm = $scope.vm;
    // add code after this only
    // Don't Remove this code

    vm.EmptyMesssageEmployees = OPERATION.OPERATION_EMPTYSTATE.ASSIGNEMPLOYEES;

    vm.EmptyMesssageForOpDataFields = OPERATION.OPERATION_EMPTYSTATE.ASSIGNEMPLOYEES;
    vm.isContainOpMasterEmployee = false;

    // Restrict changes into all fields if work order status is 'under termination'
    //vm.isWOUnderTermination = (vm.operation.workorder.woStatus == CORE.WOSTATUS.UNDER_TERMINATION || vm.operation.workorder.woStatus == CORE.WOSTATUS.TERMINATED);

    let _employeeAddedList = [];
    let _employeeNoAddedList = [];
    vm.SearchAddedListEmployee = null;
    vm.SearchNoAddedListEmployee = null;
    /**
    * Step 5 Drag and Drop Employee and Select Employee
    *
    * @param
    */

    /**
   * retreive Employee list
   *
   * @param
   */
    vm.employeeOperationDetails = () => {
      //if (isEmployeeTabClick) {
      UnSelectAllEmployee();
      vm.SearchAddedListEmployee = null;
      vm.SearchNoAddedListEmployee = null;
      //}

      let woOpEmpPromises = [getAllEmployeesNotAddedInWoOp(), getAllEmployeesAddedInWoOp()];
      vm.cgBusyLoading = $q.all(woOpEmpPromises).then(function (responses) {
        if (responses && responses.length > 0) {
          setDetailsForWoOpEmp();
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };

    let getAllEmployeesNotAddedInWoOp = () => {
      return WorkorderOperationEmployeeFactory.retrieveNotAddedEmployeeListForWoOp().save({
        woOPID: vm.operation.woOPID,
        searchText: vm.SearchNoAddedListEmployee ? vm.SearchNoAddedListEmployee : null
      }).$promise.then((res) => {
        if (res && res.data && res.data.empMasterList) {
          _employeeNoAddedList = vm.employeeNoAddedList = [];
          _.each(res.data.empMasterList, (itemData) => {
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
            vm.employeeNoAddedList.push(itemData);
          });

          // Filter active Employee only in _EmployeeNoAddedList
          vm.employeeNoAddedList = _.filter(vm.employeeNoAddedList, (emp) => {
            return emp.isActive;
          });
          reorderList();
          _employeeNoAddedList = angular.copy(vm.employeeNoAddedList);
        }
        return $q.resolve(res);
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    let setDetailsForWoOpEmp = () => {
      if (_employeeNoAddedList.length == 0 && _employeeAddedList.length == 0
        && !vm.SearchNoAddedListEmployee && !vm.SearchAddedListEmployee) {
        vm.isContainOpMasterEmployee = false;
      }
      else {
        vm.isContainOpMasterEmployee = true;
      }
      setSelectableListItem();
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

    let getAllEmployeesAddedInWoOp = () => {
      return WorkorderOperationEmployeeFactory.retrieveAddedEmployeeListForWoOp().save({
        woOPID: vm.operation.woOPID,
        searchText: vm.SearchAddedListEmployee ? vm.SearchAddedListEmployee : null
      }).$promise.then((res) => {
        if (res && res.data && res.data.woOpEmpList) {
          _employeeAddedList = vm.employeeAddedList = [];
          _.each(res.data.woOpEmpList, (itemData) => {
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
            vm.employeeAddedList.push(itemData);
          });

          // Filter active Employee only in _EmployeeNoAddedList
          vm.employeeNoAddedList = _.filter(vm.employeeNoAddedList, (emp) => {
            return emp.isActive;
          });
          reorderList();
          _employeeAddedList = angular.copy(vm.employeeAddedList);
        }
        return $q.resolve(res);
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    /* search employee details from not added list  */
    vm.searchEmployeeFromNoAddedList = () => {
      UnSelectAllEmployee();
      let notAddedEmpPromises = [getAllEmployeesNotAddedInWoOp()];
      vm.cgBusyLoading = $q.all(notAddedEmpPromises).then(function (responses) {
        if (responses && responses.length > 0) {
          setDetailsForWoOpEmp();
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    /* search employee details from added list  */
    vm.searchEmployeeFromAddedList = () => {
      UnSelectAllEmployee();
      let addedEmpPromises = [getAllEmployeesAddedInWoOp()];
      vm.cgBusyLoading = $q.all(addedEmpPromises).then(function (responses) {
        if (responses && responses.length > 0) {
          setDetailsForWoOpEmp();
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    vm.refreshDataEmployee = () => {
      vm.employeeOperationDetails();
    }

    vm.addDataEmployee = (data, ev) => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }

      var data = {};
      let popUpData = { popupAccessRoutingState: [USER.ADMIN_EMPLOYEE_MANAGE_DETAIL_STATE], pageNameAccessLabel: CORE.LabelConstant.Personnel.PageName };
      let isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
      if (isAccessPopUp) {
        DialogFactory.dialogService(
          USER.ADMIN_EMPLOYEE_ADD_MODAL_CONTROLLER,
          USER.ADMIN_EMPLOYEE_ADD_MODAL_VIEW,
          ev,
          data).then(() => {
          }, (data) => {
            if (data) {
              vm.refreshDataEmployee();
            }
          },
            (err) => {
            });
      }
    }

    $scope.selectedEmployeeListNoAdded = [];
    $scope.selectedEmployeeListAdded = [];

    //cancel drop event if canceled or validation failed
    let cancelDropEvent = (optype, e, ui) => {
      if (ui) {
        if (ui.item && ui.item.sortable && ui.item.sortable.cancel) {
          ui.item.sortable.cancel();
        } else {
          vm.refreshDataEmployee();
        }
      }
      return false;
    }

    //#region sortable option common for all list
    $scope.sortableOptionsEmployee = uiSortableMultiSelectionMethods.extendOptions({
      cancel: ".cursor-not-allow,:input",
      placeholder: "beingDragged",
      disabled: vm.isWOUnderTermination,
      'ui-floating': true,
      cursorAt: {
        top: 0, left: 0
      },
      start: (e, ui) => {
      },
      sort: (e, ui) => {
      },
      update: (e, ui) => {
        let sourceModel = ui.item.sortable.model;
        if (!ui.item.sortable.received && ui.item.sortable.droptarget) {
          let sourceTarget = ui.item.sortable.source[0];
          let dropTarget = ui.item.sortable.droptarget[0]; // get drop target element
          let SourceDivAdded = sourceTarget.id.indexOf('NoAdded') > -1 ? false : true;
          let DestinationDivAdded = dropTarget.id.indexOf('NoAdded') > -1 ? false : true;
          if (SourceDivAdded != DestinationDivAdded) {
            if (SourceDivAdded == false && DestinationDivAdded == true) {
              let isAllow = checkEmployeeOperationOngoing("Add", e, ui);
              if (!isAllow) {
                cancelDropEvent("Add", e, ui);
              } else {
                if ($scope.selectedEmployeeListNoAdded.length == 0) {
                  $scope.selectedEmployeeListNoAdded.push(sourceModel);
                }
                vm.ModifyPageAddedEmployee("Add", e, ui);
              }
              return;
            }
            else if (SourceDivAdded == true && DestinationDivAdded == false) {
              let isAllow = checkEmployeeOperationOngoing("Remove", e, ui);
              if (!isAllow) {
                cancelDropEvent("Remove", e, ui);
                return false;
              }
              else {
                if ($scope.selectedEmployeeListAdded.length == 0) {
                  $scope.selectedEmployeeListAdded.push(sourceModel);
                }
                vm.ModifyPageAddedEmployee("Remove", e, ui);
              }
              return;
            }
          }
        }
      },
      stop: (e, ui) => {
      },
      connectWith: '.items-container'
    });
    //#endregion


    //#region reset value of selected element
    let ResetSelectedEmployee = () => {
      $scope.selectedEmployeeListNoAdded = [];
      $scope.selectedEmployeeListAdded = [];
      $scope.selectAnyNoAddedEmployee = false;
      $scope.selectAnyAddedEmployee = false;
    }
    //#endregion

    //#region check for selected employee
    let checkSelectAllFlagEmployee = () => {
      $scope.selectAnyNoAddedEmployee = $scope.selectedEmployeeListNoAdded.length > 0 ? true : false;
      $scope.selectAnyAddedEmployee = $scope.selectedEmployeeListAdded.length > 0 ? true : false;
    }
    //#endregion

    //#region unselect all element list
    let UnSelectAllEmployee = () => {
      angular.element('[ui-sortable]#employeeNoAddedList .dragsortable').removeClass('ui-sortable-selected');
      angular.element('[ui-sortable]#employeeAddedList .dragsortable').removeClass('ui-sortable-selected');
      ResetSelectedEmployee();
    }
    //#endregion

    //#region unselect single element list
    let UnSelectEmployee = (unSelectFrom) => {
      if (unSelectFrom == "NoAdded") {
        angular.element('[ui-sortable]#employeeNoAddedList .dragsortable').removeClass('ui-sortable-selected');
      }
      else {
        angular.element('[ui-sortable]#employeeAddedList .dragsortable').removeClass('ui-sortable-selected');
      }
      ResetSelectedEmployee();
    }
    //#endregion

    //#region  set item selectable
    let SetEmployeeSelectable = () => {
      angular.element('[ui-sortable]#employeeAddedList').on('ui-sortable-selectionschanged', function (e, args) {
        UnSelectEmployee("NoAdded");
        let $this = $(this);
        let selectedItemIndexes = $this.find('.ui-sortable-selected').map(function () {
          return $(this).index();
        }).toArray();
        $scope.selectedEmployeeListAdded = _.map(selectedItemIndexes, function (i) {
          return vm.employeeAddedList[i];
        });
        checkSelectAllFlagEmployee();
        $scope.$applyAsync();
      });
      angular.element('[ui-sortable]#employeeNoAddedList').on('ui-sortable-selectionschanged', function (e, args) {
        UnSelectEmployee("Added");
        let $this = $(this);
        let selectedItemIndexes = $this.find('.ui-sortable-selected').map(function () {
          return $(this).index();
        }).toArray();
        $scope.selectedEmployeeListNoAdded = _.map(selectedItemIndexes, function (i) {
          return vm.employeeNoAddedList[i];
        });
        checkSelectAllFlagEmployee();
        $scope.$applyAsync();
      });
    }
    let setSelectableListItem = () => {
      $timeout(() => {
        SetEmployeeSelectable();
      }, _configSelectListTimeout);
    }
    //#endregion

    //#region for destroy selection
    let DestroyEmployeeSelection = () => {
      angular.element('[ui-sortable]#employeeNoAddedList').off('ui-sortable-selectionschanged');
      angular.element('[ui-sortable]#employeeAddedList').off('ui-sortable-selectionschanged');
    }

    let DestroyAllSelectionEmployee = () => {
      DestroyEmployeeSelection();
    }
    //#endregion

    //#region On change of tab
    $scope.$on('$destroy', (e) => {
      DestroyAllSelectionEmployee();
      $mdDialog.hide(false, {
        closeAll: true
      });
    });
    //#endregion

    // ask for revision popup to user
    //let askForRevisionPopUp = (addType, event, ui) => {
    //  if (vm.operation.workorder.woStatus == CORE.WOSTATUS.PUBLISHED) {
    //    vm.openWOOPRevisionPopup(function (versionModel) {
    //      // Added for close revision dialog popup
    //      if (versionModel && versionModel.isCancelled) {
    //        cancelDropEvent(addType, event, ui);
    //        return;
    //      }
    //      if (versionModel) {
    //        saveEmployees(addType, versionModel, ui);
    //      }
    //      else {
    //        saveEmployees(addType, null, ui);
    //      }
    //    }, event);
    //  }
    //  else {
    //    saveEmployees(addType, null, ui);
    //  }
    //}

    //#region modify employee Added based on selection from both list
    vm.ModifyPageAddedEmployee = (addType, event, ui) => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }

      let isAllow = checkEmployeeOperationOngoing(addType);
      if (!isAllow) {
        cancelDropEvent(addType, event, ui);
        return;
      } else {
        if (addType == "Add" || addType == "AddAll") {
          //askForRevisionPopUp(addType, event, ui);
          saveEmployees(addType, null, ui);
        }
        else {
          let obj = {
            title: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM, CORE.MainTitle.Employee),
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.confirmDiolog(obj).then((res) => {
            if (res) {
              //askForRevisionPopUp(addType, event, ui);
              saveEmployees(addType, null, ui);
            }
          }, (cancel) => {
            cancelDropEvent(addType, event, ui);
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
          return;
        }
      }
    }

    let sendNotificationAndRefresh = (versionModel) => {
      vm.sendNotification(versionModel);
      // temporaray added for work order operation trigger issue - VS 31/01/2020
      $timeout(() => { vm.refreshDataEmployee() }, 0);
      if (versionModel && (versionModel.woVersion || versionModel.opVersion)) {
        vm.refreshWorkOrderHeaderDetails();
      }
    }

    function saveEmployees(addType, versionModel, ui) {
      if (addType == "Add") {
        var promises = [saveWorkorderOperationEmployee($scope.selectedEmployeeListNoAdded)];
        vm.cgBusyLoading = $q.all(promises).then(function (responses) {
          if (responses[0] && responses[0].status == CORE.ApiResponseTypeStatus.SUCCESS) {
            sendNotificationAndRefresh(versionModel);
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
      else if (addType == "Remove") {
        var promises = [deleteWorkorderOperationEmployee($scope.selectedEmployeeListAdded)];
        vm.cgBusyLoading = $q.all(promises).then(function (responses) {
          if (responses[0] && responses[0].data) {
            if (responses[0].data.TotalCount && responses[0].data.TotalCount > 0) {
              BaseService.deleteAlertMessage(responses[0].data);
              cancelDropEvent(addType, event, ui);
            } else {
              sendNotificationAndRefresh(versionModel);
            }
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
        return;
      }
      else if (addType == "AddAll") {
        var promises = [saveWorkorderOperationEmployee(vm.employeeNoAddedList)];
        vm.cgBusyLoading = $q.all(promises).then(function (responses) {
          if (responses[0] && responses[0].status == CORE.ApiResponseTypeStatus.SUCCESS) {
            sendNotificationAndRefresh(versionModel);
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
      else if (addType == "RemoveAll") {
        var promises = [deleteWorkorderOperationEmployee(vm.employeeAddedList)];
        vm.cgBusyLoading = $q.all(promises).then(function (responses) {
          if (responses[0] && responses[0].data) {
            if (responses[0].data.TotalCount && responses[0].data.TotalCount > 0) {
              BaseService.deleteAlertMessage(responses[0].data);
              cancelDropEvent(addType, event, ui);
            } else {
              sendNotificationAndRefresh(versionModel);
            }
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
    }
    //#endregion

    let reorderList = () => {
      _employeeAddedList = _.sortBy(_employeeAddedList, 'name');
      _employeeNoAddedList = _.sortBy(_employeeNoAddedList, 'name');
      vm.employeeAddedList = _.sortBy(vm.employeeAddedList, 'name');
      vm.employeeNoAddedList = _.sortBy(vm.employeeNoAddedList, 'name');
    }

    vm.setFocus = (text) => {
      let someElement = angular.element(document.querySelector('#' + text));
      if (someElement && someElement.length > 0) {
        someElement[0].focus();
      }
    }

    /* save employees in work order operation */
    let saveWorkorderOperationEmployee = (newListToSave) => {
      let saveObj = [];

      saveObj = _.map(newListToSave, (item) => {
        return {
          woID: vm.operation.woID,
          opID: vm.operation.opID,
          woOPID: vm.operation.woOPID,
          employeeID: item.id
        }
      });
      let listObj = {
        woID: vm.operation.woID,
        opID: vm.operation.opID,
        woOPID: vm.operation.woOPID,
        employeeList: saveObj,
        woNumber: vm.operation.workorder.woNumber,
        opName: vm.operation.opName
      }

      return WorkorderOperationFactory.createWorkorderOperationEmployees().save({ listObj: listObj }).$promise.then((res) => {
        return res;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    // common function for add/remove employee for work order operation
    /* delete employees in work-order_operation */
    let deleteWorkorderOperationEmployee = (listToDelete) => {
      let _objList = {};
      _objList.woID = vm.operation.woID;
      _objList.woOPID = vm.operation.woOPID;
      _objList.employeeID = _.map(listToDelete, (obj) => {
        return obj.id;
      });
      return WorkorderOperationEmployeeFactory.deleteOperationFromWorkOrder().query({ listObj: _objList }).$promise.then((employee) => {
        return employee;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    vm.employeeOperationDetails();

    //check employee is checked-in than show alert and return
    let checkEmployeeOperationOngoing = (addType) => {
      if (addType == "Remove" || addType == "RemoveAll") {
        if (addType == "RemoveAll" && $scope.selectedEmployeeListAdded.length == 0) {
          $scope.selectedEmployeeListAdded = angular.copy(vm.employeeAddedList);
        }
        let checkEmployee = _.find($scope.selectedEmployeeListAdded, (emp) => {
          return _.find(vm.operation.workorderTransEmpinout, (operation) => {
            return operation.employeeID == emp.id;
          });
        });
        if (checkEmployee && vm.IsProductionStart) {
          var model = {
            title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
            textContent: CORE.MESSAGE_CONSTANT.PRODUCTION_IS_ONGOING_NOT_ALLOW_ANY_CHANGE,
            multiple: true
          };
          DialogFactory.alertDialog(model);
          return false;
        }
        return true;
      }
      return true;
    }

    /* to move at employee update page */
    vm.goToUpdatePersonnel = (employeeID) => {
      BaseService.goToManagePersonnel(employeeID);
    }
  };

  //angular
  //   .module('app.workorder.workorders'). = function () {
  //   };
})();
