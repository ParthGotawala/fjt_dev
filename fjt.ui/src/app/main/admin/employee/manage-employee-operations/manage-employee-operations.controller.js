(function () {
  'use strict';

  angular
    .module('app.admin.employee')
    .controller('ManageEmployeeOperationsController', ManageEmployeeOperationsController);

  /** @ngInject */
  function ManageEmployeeOperationsController($scope, $timeout, $stateParams, $state, $filter,
    uiSortableMultiSelectionMethods, OPERATION, USER, EmployeeFactory, $q, CORE, BaseService, DialogFactory) {
    const vm = this;
    vm.employeeID = $stateParams.id;
    let _operationAddedList = [];
    let _operationNoAddedList = [];
    vm.SearchAddedListOperation = null;
    vm.SearchNoAddedListOperation = null;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.ASSIGN_OPERATION_EMPLOYEE_DRAGDROP;
    //vm.isEmpOpeartionDragDropAnyChangesToSave = false;
    vm.OpStatus = CORE.OpStatus;

    vm.EmptyMesssageForOpDataFields = OPERATION.OPERATION_EMPTYSTATE.OPERATION;
    vm.isContainOpMasterEmployee = true;

    vm.goBack = () => {
      $state.go(USER.ADMIN_EMPLOYEE_STATE);
    };

    vm.employeeOperationDetails = (id) => {
      vm.SearchAddedListOperation = null;
      vm.SearchNoAddedListOperation = null;
      vm.cgBusyLoading = EmployeeFactory.retrieveEmployeeOperations().query({ id: id }).$promise.then((res) => {
        if (res.data) {
          _operationAddedList = vm.operationAddedList = [];
          _operationNoAddedList = vm.operationNoAddedList = [];
          vm.employee = res.data.employee;
          if (vm.employee) {
            vm.employeeTitle = ": " + vm.employee.firstName + " " + vm.employee.lastName;
          }
          _.each(res.data.operationList, (itemData) => {
            itemData.opName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, itemData.opName, itemData.opNumber);
            if (vm.employeeID) {
              if (itemData.operationEmployee.length > 0) {
                const _obj = _.find(itemData.operationEmployee, (o) => o.employeeID == vm.employeeID);
                if (_obj) {
                  vm.operationAddedList.push(itemData);
                }
                else {
                  vm.operationNoAddedList.push(itemData);
                }
              }
              else {
                if (itemData.opStatus == vm.OpStatus[1]['ID']) {
                  vm.operationNoAddedList.push(itemData);
                }
              }
            }
            else {
              if (itemData.opStatus == vm.OpStatus[1]['ID']) {
                vm.operationNoAddedList.push(itemData);
              }
            }
          });
          _operationAddedList = angular.copy(vm.operationAddedList);
          _operationNoAddedList = angular.copy(vm.operationNoAddedList);

          if (_operationNoAddedList.length == 0 && _operationAddedList.length == 0) {
            vm.isContainOpMasterEmployee = false;
          }
          else {
            vm.isContainOpMasterEmployee = true;
          }
          setSelectableListItem();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.refreshDataEmployee = () => {
      vm.employeeOperationDetails(vm.employeeID);
    };

    vm.addDataEmployee = () => {
      BaseService.openInNew(OPERATION.OPERATION_MANAGE_DETAILS_STATE);
    };

    vm.employeeOperationDetails(vm.employeeID);

    vm.setHeight = () => {
      $timeout(() => {
        //let ControlBox = document.getElementById("permission1");
        //ControlBox.setAttribute("style", "max-height:" + (window.innerHeight - ControlBox.offsetTop - 80) + "px");
        const divs = document.getElementsByClassName('permissions');
        _.each(divs, (element) => {
          element.setAttribute('style', 'max-height:' + (window.innerHeight - element.offsetTop - 80) + 'px');
        });
      }, 0);
    };
    vm.setHeight();

    const saveOperationsOfEmployee = (newListToSave) => {
      const saveObj = [];

      _.each(newListToSave, (item) => {
        if (vm.employeeID) {
          const _object = {};
          _object.employeeID = vm.employeeID,
            _object.opID = item.opID,
            saveObj.push(_object);
        }
      });
      const listObj = {
        employeeID: vm.employeeID,
        operationList: saveObj
      };

      return EmployeeFactory.createOperation_EmployeeList().save({ listObj: listObj }).$promise.then((res) => res).catch((error) => BaseService.getErrorLog(error));
    };

    const deleteOperationsOfEmployee = (listToDelete) => EmployeeFactory.deleteOperationsOfEmployee().delete({
      employeeID: vm.employeeID,
      opIDs: _.map(listToDelete, (obj) => obj.opID)
    }).$promise.then((res) => res).catch((error) => BaseService.getErrorLog(error));

    $scope.selectedOperationListNoAdded = [];
    $scope.selectedOperationListAdded = [];
    //#region sortable option common for all list
    $scope.sortableOptions = uiSortableMultiSelectionMethods.extendOptions({
      cancel: '.cursor-not-allow',
      placeholder: 'beingDragged',
      'ui-floating': true,
      cursorAt: {
        top: 0, left: 0
      },
      start: function (e, ui) {
      },
      sort: function (e, ui) {
      },
      stop: function (e, ui) {
        const sourceModel = ui.item.sortable.model;
        if (ui.item.sortable.droptarget) {
          const sourceTarget = ui.item.sortable.source[0];
          const dropTarget = ui.item.sortable.droptarget[0]; // get drop target element
          const SourceDivAdded = sourceTarget.id.indexOf('NoAdded') > -1 ? false : true;
          const DestinationDivAdded = dropTarget.id.indexOf('NoAdded') > -1 ? false : true;
          if (SourceDivAdded !== DestinationDivAdded) {
            if (SourceDivAdded === false && DestinationDivAdded === true) {
              if ($scope.selectedOperationListNoAdded.length === 0) {
                $scope.selectedOperationListNoAdded.push(sourceModel);
              }
              vm.ModifyPageAdded('Add');
              return;
            }
            else if (SourceDivAdded === true && DestinationDivAdded === false) {
              if ($scope.selectedOperationListAdded.length === 0) {
                $scope.selectedOperationListAdded.push(sourceModel);
              }
              vm.ModifyPageAdded('Remove');
              return;
            }
          }
          //else if (sourceTarget.id == 'operationAddedList' && dropTarget.id == 'operationAddedList') {
          //    vm.isEmpOpeartionDragDropAnyChangesToSave = true;
          //}
        }
      },
      connectWith: '.items-container'
    });
    //#endregion


    //#region reset value of selected element
    const ResetSelectedOperation = () => {
      $scope.selectedOperationListNoAdded = [];
      $scope.selectedOperationListAdded = [];
      $scope.selectAnyNoAdded = false;
      $scope.selectAnyAdded = false;
    };
    //#endregion

    //#region check for selected operation
    const checkSelectAllFlag = () => {
      $scope.selectAnyNoAdded = $scope.selectedOperationListNoAdded.length > 0 ? true : false;
      $scope.selectAnyAdded = $scope.selectedOperationListAdded.length > 0 ? true : false;
    };
    //#endregion

    //#region unselect all operation list
    const UnSelectAllOperation = () => {
      angular.element('[ui-sortable]#operationNoAddedList .dragsortable').removeClass('ui-sortable-selected');
      angular.element('[ui-sortable]#operationAddedList .dragsortable').removeClass('ui-sortable-selected');
      ResetSelectedOperation();
    };
    //#endregion

    //#region unselect single operation list
    const UnSelectOperation = (unSelectFrom) => {
      if (unSelectFrom === 'NoAdded') {
        angular.element('[ui-sortable]#operationNoAddedList .dragsortable').removeClass('ui-sortable-selected');
      }
      else {
        angular.element('[ui-sortable]#operationAddedList .dragsortable').removeClass('ui-sortable-selected');
      }
      ResetSelectedOperation();
    };
    //#endregion

    //#region  set item selectable
    const SetOperationSelectable = () => {
      angular.element('[ui-sortable]#operationAddedList').on('ui-sortable-selectionschanged', function (e, args) {
        UnSelectOperation('NoAdded');
        const $this = $(this);
        const selectedItemIndexes = $this.find('.ui-sortable-selected').map(function () {
          return $(this).index();
        }).toArray();
        $scope.selectedOperationListAdded = _.map(selectedItemIndexes, (i) => vm.operationAddedList[i]);
        checkSelectAllFlag();
        $scope.$applyAsync();
      });
      angular.element('[ui-sortable]#operationNoAddedList').on('ui-sortable-selectionschanged', function (e, args) {
        UnSelectOperation('Added');
        const $this = $(this);
        const selectedItemIndexes = $this.find('.ui-sortable-selected').map(function () {
          return $(this).index();
        }).toArray();
        $scope.selectedOperationListNoAdded = _.map(selectedItemIndexes, (i) => vm.operationNoAddedList[i]);
        checkSelectAllFlag();
        $scope.$applyAsync();
      });
    };


    const setSelectableListItem = () => {
      $timeout(() => {
        SetOperationSelectable();
      }, _configSelectListTimeout);
    };
    //#endregion

    //#region for destroy selection
    const DestroyOperationSelection = () => {
      angular.element('[ui-sortable]#operationNoAddedList').off('ui-sortable-selectionschanged');
      angular.element('[ui-sortable]#operationAddedList').off('ui-sortable-selectionschanged');
    };

    const DestroyAllSelection = () => {
      DestroyOperationSelection();
    };
    //#endregion

    //#region On change of tab
    $scope.$on('$destroy', () => {
      DestroyAllSelection();
    });
    //#endregion

    vm.SearchOperation = (list, searchText, IsAdded) => {
      if (!searchText) {
        if (IsAdded) {
          vm.SearchAddedListOperation = null;
          vm.isHideSearchButtonaddedEmployee = false;
          vm.operationAddedList = _operationAddedList;
          vm.FilterOperationAdded = true;
        } else {
          vm.SearchNoAddedListOperation = null;
          vm.isHideSearchButtonEmployee = false;
          vm.operationNoAddedList = _operationNoAddedList;
          vm.FilterOperationNotAdded = true;
        }
        return;
      }
      else {
        if (IsAdded) {
          vm.isHideSearchButtonaddedEmployee = true;
        }
        else {
          vm.isHideSearchButtonEmployee = true;
        }
      }
      if (IsAdded) {
        vm.operationAddedList = $filter('filter')(_operationAddedList, { opName: searchText });
        vm.FilterOperationAdded = vm.operationAddedList.length > 0;
      }
      else {
        vm.operationNoAddedList = $filter('filter')(_operationNoAddedList, { opName: searchText });
        vm.FilterOperationNotAdded = vm.operationNoAddedList.length > 0;
      }
    };


    //#region modify operation Added based on selection from both list
    vm.ModifyPageAdded = (addType) => {
      if (addType === 'Add') {
        const promises = [saveOperationsOfEmployee($scope.selectedOperationListNoAdded)];
        vm.cgBusyLoading = $q.all(promises).then((responses) => {
          if (responses && responses[0] && responses[0].status === CORE.ApiResponseTypeStatus.SUCCESS) {
            _.each($scope.selectedOperationListNoAdded, (item) => {
              const added = _.find(_operationAddedList, (element) => item.opID === element.opID);
              if (!added) {
                _operationAddedList.push(item);
              }
            });
            _.each($scope.selectedOperationListNoAdded, (item) => {
              _operationNoAddedList = _.without(_operationNoAddedList,
                _.find(_operationNoAddedList, (valItem) => valItem.opID === item.opID)
              );
            });
            UnSelectAllOperation();
            setEmpOperationDragDropDetails();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else if (addType === 'Remove') {
        const promises = [deleteOperationsOfEmployee($scope.selectedOperationListAdded)];
        vm.cgBusyLoading = $q.all(promises).then((responses) => {
          if (responses[0] && responses[0].status === CORE.ApiResponseTypeStatus.SUCCESS) {
            _.each($scope.selectedOperationListAdded, (item) => {
              const added = _.find(_operationNoAddedList, (element) => item.opID === element.opID);
              if (!added) {
                _operationNoAddedList.push(item);
              }
            });
            _.each($scope.selectedOperationListAdded, (item) => {
              _operationAddedList = _.without(_operationAddedList,
                _.find(_operationAddedList, (valItem) => valItem.opID === item.opID)
              );
            });
            UnSelectAllOperation();
            setEmpOperationDragDropDetails();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else if (addType === 'AddAll') {
        const promises = [saveOperationsOfEmployee(vm.operationNoAddedList)];
        vm.cgBusyLoading = $q.all(promises).then((responses) => {
          if (responses && responses[0] && responses[0].status === CORE.ApiResponseTypeStatus.SUCCESS) {
            _.each(vm.operationNoAddedList, (item) => {
              const added = _.find(_operationAddedList, (element) => item.opID === element.opID);
              if (!added) {
                _operationAddedList.push(item);
              }
            });
            _.each(_operationAddedList, (item) => {
              _operationNoAddedList = _.without(_operationNoAddedList,
                _.find(_operationNoAddedList, (valItem) => valItem.opID === item.opID)
              );
            });
            UnSelectAllOperation();
            setEmpOperationDragDropDetails();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else if (addType === 'RemoveAll') {
        const promises = [deleteOperationsOfEmployee(vm.operationAddedList)];
        vm.cgBusyLoading = $q.all(promises).then((responses) => {
          if (responses[0] && responses[0].status === CORE.ApiResponseTypeStatus.SUCCESS) {
            _.each(vm.operationAddedList, (item) => {
              const added = _.find(_operationNoAddedList, (element) => item.opID === element.opID);
              if (!added) {
                _operationNoAddedList.push(item);
              }
            });
            _.each(_operationNoAddedList, (item) => {
              _operationAddedList = _.without(_operationAddedList,
                _.find(_operationAddedList, (valItem) => valItem.opID === item.opID)
              );
            });
            UnSelectAllOperation();
            setEmpOperationDragDropDetails();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      //vm.SearchAddedListOperation = null;
      //vm.SearchNoAddedListOperation = null;
      //vm.operationAddedList = _operationAddedList;
      //vm.operationNoAddedList = _operationNoAddedList;
      //vm.FilterOperationAdded = vm.operationAddedList.length > 0;
      //vm.FilterOperationNotAdded = vm.operationNoAddedList.length > 0;
      //vm.isEmpOpeartionDragDropAnyChangesToSave = true;
    };
    //#endregion

    const setEmpOperationDragDropDetails = () => {
      vm.SearchAddedListOperation = null;
      vm.SearchNoAddedListOperation = null;
      vm.isHideSearchButtonEmployee = false;
      vm.isHideSearchButtonaddedEmployee = false;
      vm.operationAddedList = _operationAddedList;
      vm.operationNoAddedList = _operationNoAddedList;
      vm.FilterOperationAdded = vm.operationAddedList.length > 0;
      vm.FilterOperationNotAdded = vm.operationNoAddedList.length > 0;
    };


    vm.setFocus = (text) => {
      const someElement = angular.element(document.querySelector('#' + text));
      if (someElement && someElement.length > 0) {
        someElement[0].focus();
      }
    };

    // Get operation status classname by status value.
    vm.getOpStatusClassName = (statusID) => BaseService.getOpStatusClassName(statusID);

    /* to move at operation update page */
    vm.goToManageOperation = (operationID) => {
      BaseService.goToManageOperation(operationID);
    };

    /* Show Description*/
    vm.showDescription = (operation, ev) => {
      const obj = {
        title: 'Operation',
        description: operation.shortDescription,
        name: operation.opName
      };
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        obj).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    };
  }
})();
