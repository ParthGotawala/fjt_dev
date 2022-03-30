(function () {
  'use strict';
  angular.module('app.core').directive('customerPersonnelMapping', customerPersonnelMapping);

  /** @ngInject */
  function customerPersonnelMapping(BaseService, CORE, OPERATION, DialogFactory, CustomerPersonnelMappingFactory, uiSortableMultiSelectionMethods, USER) {
    let directive = {
      restrict: 'E',
      replace: true,
      scope: {
        personnelid: '=?',
        customerid: '=?',
      },
      templateUrl: 'app/directives/custom/customer-personnel-mapping/customer-personnel-mapping.html',
      controller: CustomerPersonnelMappingController,
      controllerAs: 'vm',
      link: function (scope, element, attrs) {
      }
    };
    return directive;

    /** @ngInject */
    /**
    * Controller for view data of Component DFM
    * @param
    */
    function CustomerPersonnelMappingController($scope, $q, $mdDialog, $timeout, $state, $stateParams) {
      const vm = this;
      vm.personnelid = $scope.personnelid || null;
      vm.customerid = $scope.customerid || null;
      vm.EmptyMesssageEmployees = CORE.EMPTYSTATE.ASSIGNEMPLOYEES;
      vm.EmptyMesssageCustomer = CORE.EMPTYSTATE.ASSIGNCUSTOMER;
      vm.debounceTime = CORE.DEBOUNCE_TIME_INTERVAL;

      vm.isCustomerMappedwithEmployee = false;

      let _employeeAddedList = [];
      let _employeeNoAddedList = [];
      vm.SearchAddedListEmployee = null;
      vm.SearchNoAddedListEmployee = null;

      // retreive Employee list
      vm.employeeDetails = () => {
        UnSelectAllEmployee();
        vm.SearchAddedListEmployee = null;
        vm.SearchNoAddedListEmployee = null;

        let CustomerEmployeePromises = [getAllCustomerNotmappedWithPersonnel(), getAllCustomerMappedWithPersonnel()];
        vm.cgBusyLoading = $q.all(CustomerEmployeePromises).then(function (responses) {
          if (responses && responses.length > 0) {
            setDetailsForCustomerEmployeeMapping();
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      };

      let getAllCustomerNotmappedWithPersonnel = () => {
        return CustomerPersonnelMappingFactory.retrieveNotAddedCustomerListForEmployee().save({
          employeeID: vm.personnelid,
          customerID: vm.customerid,
          searchText: vm.SearchNoAddedListEmployee ? vm.SearchNoAddedListEmployee : null
        }).$promise.then((res) => {
          if (res && res.data && res.data.empMasterList) {
            _employeeNoAddedList = vm.employeeNoAddedList = [];
            _.each(res.data.empMasterList, (itemData) => {
              if (vm.customerid) {
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
              } else if (vm.personnelid) {
                vm.employeeNoAddedList.push(itemData);
              }
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


      let getAllCustomerMappedWithPersonnel = () => {
        return CustomerPersonnelMappingFactory.retrieveAddedCustomerListForEmployee().save({
          employeeID: vm.personnelid,
          customerID: vm.customerid,
          searchText: vm.SearchAddedListEmployee ? vm.SearchAddedListEmployee : null
        }).$promise.then((res) => {
          if (res && res.data && res.data.custEmpMappingList) {
            _employeeAddedList = vm.employeeAddedList = [];
            _.each(res.data.custEmpMappingList, (itemData) => {
              if (vm.customerid) {
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
              } else if (vm.personnelid) {
                vm.employeeAddedList.push(itemData);
              }
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

      let setDetailsForCustomerEmployeeMapping = () => {
        if (_employeeNoAddedList.length == 0 && _employeeAddedList.length == 0
          && !vm.SearchNoAddedListEmployee && !vm.SearchAddedListEmployee) {
          vm.isCustomerMappedwithEmployee = false;
        }
        else {
          vm.isCustomerMappedwithEmployee = true;
        }
        setSelectableListItem();
      }

      let setSelectableListItem = () => {
        $timeout(() => {
          SetEmployeeSelectable();
        }, _configSelectListTimeout);
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

      //#region unselect all element list
      let UnSelectAllEmployee = () => {
        angular.element('[ui-sortable]#employeeNoAddedList .dragsortable').removeClass('ui-sortable-selected');
        angular.element('[ui-sortable]#employeeAddedList .dragsortable').removeClass('ui-sortable-selected');
        ResetSelectedEmployee();
      }
      //#region reset value of selected element
      let ResetSelectedEmployee = () => {
        $scope.selectedEmployeeListNoAdded = [];
        $scope.selectedEmployeeListAdded = [];
        $scope.selectAnyNoAddedEmployee = false;
        $scope.selectAnyAddedEmployee = false;
      }
      //#endregion

      let reorderList = () => {
        _employeeAddedList = _.sortBy(_employeeAddedList, 'name');
        _employeeNoAddedList = _.sortBy(_employeeNoAddedList, 'name');
        vm.employeeAddedList = _.sortBy(vm.employeeAddedList, 'name');
        vm.employeeNoAddedList = _.sortBy(vm.employeeNoAddedList, 'name');
      }
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
      //#region check for selected 
      let checkSelectAllFlagEmployee = () => {
        $scope.selectAnyNoAddedEmployee = $scope.selectedEmployeeListNoAdded.length > 0 ? true : false;
        $scope.selectAnyAddedEmployee = $scope.selectedEmployeeListAdded.length > 0 ? true : false;
      }
      vm.employeeDetails();

      /* search details from not added list  */
      vm.searchFromNotAddedList = () => {
        UnSelectAllEmployee();
        let notAddedPromises = [getAllCustomerNotmappedWithPersonnel()];
        vm.cgBusyLoading = $q.all(notAddedPromises).then(function (responses) {
          if (responses && responses.length > 0) {
            setDetailsForCustomerEmployeeMapping();
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

      /* search details from added list  */
      vm.searchFromAddedList = () => {
        UnSelectAllEmployee();
        let addedEmpPromises = [getAllCustomerMappedWithPersonnel()];
        vm.cgBusyLoading = $q.all(addedEmpPromises).then(function (responses) {
          if (responses && responses.length > 0) {
            setDetailsForCustomerEmployeeMapping();
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

      vm.refreshDataEmployee = () => {
        vm.employeeDetails();
      }

      vm.ModifyPageAddedEmployee = (addType, event, ui) => {
        if (addType == "Add" || addType == "AddAll") {
          saveEmployees(addType, ui);
        }
        else {
          let obj = {
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };

          if (vm.personnelid) {
            obj.messageContent = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.CUSTOMER_DELETED_FROM_EMPLOYEE_CONFIRMATION;
          } else if (vm.customerid) {
            obj.messageContent = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.EMPLOYEE_DELETED_FROM_CUSTOMER_CONFIRMATION;
          }

          DialogFactory.messageConfirmDialog(obj).then((res) => {
            if (res) {
              saveEmployees(addType, ui);
            }
          }, (cancel) => {
            cancelDropEvent(addType, event, ui);
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
          return;

        }
      }

      function saveEmployees(addType, ui) {
        if (addType == "Add") {
          var promises = [saveCustomerEmployeeMapping($scope.selectedEmployeeListNoAdded)];
          vm.cgBusyLoading = $q.all(promises).then(function (responses) {
            if (responses[0] && responses[0].status == CORE.ApiResponseTypeStatus.SUCCESS) {
              $timeout(() => {
                let reloadpromises = [vm.refreshDataEmployee()];
                vm.cgBusyLoading = $q.all(reloadpromises).then(function (responses) { });
              }, 500)
            }
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
        }
        else if (addType == "Remove") {
          var promises = [deleteCustomerEmployeeMapping($scope.selectedEmployeeListAdded)];
          vm.cgBusyLoading = $q.all(promises).then(function (responses) {
            if (responses[0]) {
              if (responses[0].data && responses[0].data.TotalCount && responses[0].data.TotalCount > 0) {
                BaseService.deleteAlertMessage(responses[0].data);
                cancelDropEvent(addType, event, ui);
              } else {
                $timeout(() => {
                  let reloadpromises = [vm.refreshDataEmployee()];
                  vm.cgBusyLoading = $q.all(reloadpromises).then(function (responses) { });
                }, 500)
              }
            }
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
          return;
        }
        else if (addType == "AddAll") {
          var promises = [saveCustomerEmployeeMapping(vm.employeeNoAddedList)];
          vm.cgBusyLoading = $q.all(promises).then(function (responses) {
            if (responses[0] && responses[0].status == CORE.ApiResponseTypeStatus.SUCCESS) {
              $timeout(() => {
                let reloadpromises = [vm.refreshDataEmployee()];
                vm.cgBusyLoading = $q.all(reloadpromises).then(function (responses) { });
              }, 500)
            }
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
        }
        else if (addType == "RemoveAll") {
          var promises = [deleteCustomerEmployeeMapping(vm.employeeAddedList)];
          vm.cgBusyLoading = $q.all(promises).then(function (responses) {
            if (responses[0]) {
              if (responses[0].data && responses[0].data.TotalCount && responses[0].data.TotalCount > 0) {
                BaseService.deleteAlertMessage(responses[0].data);
                cancelDropEvent(addType, event, ui);
              } else {
                $timeout(() => {
                  let reloadpromises = [vm.refreshDataEmployee()];
                  vm.cgBusyLoading = $q.all(reloadpromises).then(function (responses) { });
                }, 500)
              }
            }
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
        }
      }

      /* save mapping for customer parsonel */
      let saveCustomerEmployeeMapping = (newListToSave) => {
        let saveObj = [];

        saveObj = _.map(newListToSave, (item) => {
          if (vm.personnelid) {
            return {
              employeeId: vm.personnelid,
              mfgCodeId: item.id
            }
          } else if (vm.customerid) {
            return {
              employeeId: item.id,
              mfgCodeId: vm.customerid
            }
          }
        });
        let listObj = {
          employeeId: vm.personnelid,
          mfgCodeId: vm.customerid,
          mappingList: saveObj
        }

        return CustomerPersonnelMappingFactory.createCustomerEmployeesMapping().save({ listObj: listObj }).$promise.then((res) => {
          return res;
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

      // common function for remove mapping for customer parsonel'
      let deleteCustomerEmployeeMapping = (listToDelete) => {
        let _objList = {};
        _objList.employeeId = vm.personnelid;
        _objList.mfgCodeId = vm.customerid;
        _objList.ids = _.map(listToDelete, (obj) => {
          return obj.id;
        });
        return CustomerPersonnelMappingFactory.deleteCustomerEmployeeMapping().query({ listObj: _objList }).$promise.then((employee) => {
          return employee;
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

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
      vm.addDataEmployee = (data, ev) => {
        if (vm.customerid) {
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
        } else if (vm.personnelid) {
          var data = {
            customerType: CORE.CUSTOMER_TYPE.CUSTOMER, popupAccessRoutingState: [USER.ADMIN_MANAGECUSTOMER_DETAIL_STATE],
            pageNameAccessLabel: CORE.PageName.customer
          };
          let popUpData = { popupAccessRoutingState: [USER.ADMIN_MANAGECUSTOMER_DETAIL_STATE], pageNameAccessLabel: CORE.LabelConstant.Customer.PageName };
          let isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
          if (isAccessPopUp) {
            DialogFactory.dialogService(
              USER.ADMIN_CUSTOMER_ADD_MODAL_CONTROLLER,
              USER.ADMIN_CUSTOMER_ADD_MODAL_VIEW,
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
      }

      //#region sortable option common for all list
      $scope.sortableOptionsEmployee = uiSortableMultiSelectionMethods.extendOptions({
        cancel: ".cursor-not-allow,:input",
        placeholder: "beingDragged",
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
                if ($scope.selectedEmployeeListNoAdded.length == 0) {
                  $scope.selectedEmployeeListNoAdded.push(sourceModel);
                }
                vm.ModifyPageAddedEmployee("Add", e, ui);
                return;
              }
              else if (SourceDivAdded == true && DestinationDivAdded == false) {
                if ($scope.selectedEmployeeListAdded.length == 0) {
                  $scope.selectedEmployeeListAdded.push(sourceModel);
                }
                vm.ModifyPageAddedEmployee("Remove", e, ui);
                return;
              }
            }
          }
        },
        stop: (e, ui) => {
        },
        connectWith: '.items-container'
      });

      /* to move at employee update page */
      vm.goToUpdatePersonnel = (employeeID) => {
        BaseService.goToManagePersonnel(employeeID);
      }

      /* to move at customer update page */
      vm.goToManageCustomer = (customerID) => {
        BaseService.goToCustomer(customerID);
      }
    }
  }
})();
