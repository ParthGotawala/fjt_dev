(function () {
  'use strict';

  angular
    .module('app.admin.department')
    .controller('ManageDepartmentController', ManageDepartmentController);

  /** @ngInject */
  function ManageDepartmentController($state, $q, $stateParams, $filter, $timeout, USER, CORE, DepartmentFactory, EmployeeFactory, DataElementTransactionValueFactory,
    DialogFactory, EmployeeDepartmentFactory, GenericCategoryFactory, BaseService, $mdDialog, $scope, uiSortableMultiSelectionMethods) {

    const vm = this;
    vm.IsOtherDetailTab = false;
    vm.IsEmployeeList = false;
    vm.EmployeeListTitle = 'Employee List';
    vm.LocationTitle = 'Department Geolocations';
    vm.AddEmployeeToDepartmentDivShow = false;
    vm.OtherDetailTabName = CORE.OtherDetailTabName;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.GEOLOCATION;
    vm.EmployeeAutoCompleteDynamicBind = CORE.EmployeeAutoCompleteDynamicBind;
    vm.OtherDetailTitle = CORE.OtherDetail.TabName;
    vm.selectedIndex = 0;
    vm.dataElementList = [];
    let _locationAddedList = [];
    let _locationNoAddedList = [];
    vm.entityID = 0;
    vm.Entity = CORE.Entity;
    let oldDepartmentName = '';
    vm.isContainMasterDataLocation = false;
    vm.deptID = $stateParams.deptID ? $stateParams.deptID : null;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.isEdit = true;
    vm.title = vm.deptID ? 'Update Department' : 'Add Department';
    vm.isSubmit = false;
    vm.manageDepartment = {};
    vm.addEmpInDept = {};
    vm.manageDepartment.isActive = true;
    vm.EmployeeTitle = CORE.CategoryType.EmployeeTitle;
    const CategoryTypeObjList = angular.copy(CORE.CategoryType);
    //if set pagination from controller set true to here
    //vm.ispagination = true;
    vm.selectedItems = [];
    vm.query = {
      order: '',
      search: '',
      limit: !(vm.ispagination == undefined ? CORE.isPagination : vm.ispagination) ? '' : CORE.datalimit,
      page: 1,
      isPagination: vm.ispagination == undefined ? CORE.isPagination : vm.ispagination,
    };
    vm.emptySearch = CORE.EMPTYSTATE.EMPTY_SEARCH;
    vm.debounceConstant = CORE.Debounce;
    vm.QualityDepartmentID = CORE.QualityDepartmentID.id;
    vm.radioButtonGroup = {
      isActive: {
        array: USER.EmployeeRadioGroup.isActive
      },
      isParentDeptID: {
        array: USER.DepartmentRadioGroup.isParentDeptID
      }
    };
    vm.isParentDeptID = false;
    vm.tabName = $stateParams.selectedTab;

    if (vm.tabName) {
      if (!vm.deptID) {
        if (USER.DepartmentTabs.Detail.Name != vm.tabName) {
          $state.go(USER.ADMIN_MANAGEDEPARTMENT_DETAIL_STATE, { deptID: vm.deptID });
        }
      } else {
        const tab = _.find(USER.DepartmentTabs, (item) => item.Name == vm.tabName);
        if (tab) {
          vm.selectedTabIndex = tab.ID;
        }
      }
    }
    vm.pageTabRights =
    {
      DetailTab: false,
      EmployeeTab: false,
      LocationTab: false,
      MiscTab: false
    };

    function setTabWisePageRights(pageList) {
      if (pageList && pageList.length > 0) {
        let tab = pageList.filter((a) => a.PageDetails != null && a.PageDetails.pageRoute == USER.ADMIN_MANAGEDEPARTMENT_DETAIL_STATE);
        if (tab && tab.length > 0 && tab[0].isActive) {
          vm.pageTabRights.DetailTab = true;
        }
        tab = pageList.filter((a) => a.PageDetails != null && a.PageDetails.pageRoute == USER.ADMIN_MANAGEDEPARTMENT_EMPLOYEE_STATE);
        if (tab && tab.length > 0 && tab[0].isActive) {
          vm.pageTabRights.EmployeeTab = true;
        }
        tab = pageList.filter((a) => a.PageDetails != null && a.PageDetails.pageRoute == USER.ADMIN_MANAGEDEPARTMENT_LOCATION_STATE);
        if (tab && tab.length > 0 && tab[0].isActive) {
          vm.pageTabRights.LocationTab = true;
        }
        tab = pageList.filter((a) => a.PageDetails != null && a.PageDetails.pageRoute == USER.ADMIN_MANAGEDEPARTMENT_MISC_STATE);
        if (tab && tab.length > 0 && tab[0].isActive) {
          vm.pageTabRights.MiscTab = true;
        }
      }
    }

    $timeout(() => {
      $scope.$on(USER.LoginUserPageListBroadcast, (event, data) => {
        const menudata = data;
        setTabWisePageRights(menudata);
        $scope.$applyAsync();
      });
    });

    if (BaseService.loginUserPageList && BaseService.loginUserPageList.length > 0) {
      setTabWisePageRights(BaseService.loginUserPageList);
    }

    vm.goBack = () => {
      if (BaseService.checkFormDirty(vm.manageDepartmentForm, vm.checkDirtyObject)) {
        showWithoutSavingAlertforBackButton();
      } else if (vm.employeesInDepartmentForm && vm.employeesInDepartmentForm.$dirty) {
        showWithoutSavingAlertforBackButton();
      } else if (vm.departmentOtherDetail && vm.departmentOtherDetail.$dirty) {
        showWithoutSavingAlertforBackButton();
      } else {
        BaseService.currentPageForms = [];
        $state.go(USER.ADMIN_DEPARTMENT_STATE);
      }
    };

    vm.addDept = () => {
      $state.go(USER.ADMIN_MANAGEDEPARTMENT_DETAIL_STATE, { deptID: null });
    };

    function showWithoutSavingAlertforBackButton() {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);

      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          if (vm.selectedTabIndex === 0) {
            vm.manageDepartmentForm.$setPristine();
          }
          else if (vm.selectedTabIndex === 1) {
            vm.employeesInDepartmentForm.$setPristine();
          } else if (vm.selectedTabIndex === 2) {
            vm.departmentOtherDetail.$setPristine();
          }

          $state.go(USER.ADMIN_DEPARTMENT_STATE);
        }
      }, (error) => BaseService.getErrorLog(error));
    }

    const departmentTemplate = {
      deptID: vm.deptID,
      deptName: null,
      deptMngrID: null,
      parentDeptID: null,
      isActive: true
    };

    vm.clearDepartment = () => {
      vm.manageDepartment = Object.assign({}, departmentTemplate);
    };

    /* retrieve employeeList In particular Department */
    vm.DepartmentEmployeeList = () => {
      if (vm.deptID) {
        vm.cgBusyLoading = EmployeeDepartmentFactory.getEmployeeListInDepartment().query({ departmentID: vm.deptID }).$promise.then((employeelist) => {
          _.each(employeelist.data, (item) => {
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
          vm.EmployeeListInDepartment = employeelist.data;
          getAllGenericCategoryByCategoryType();
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    /* Manager (Employee) dropdown fill up */
    const getEmployeeList = (insertedDataFromPopup, setForEmpAutoCompleteSelectedObj) =>
      EmployeeFactory.GetEmployeeDetail().query({ isOnlyActive: true }).$promise.then((employees) => {
        _.each(employees.data, (item) => {
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
        vm.EmployeeList = employees.data;
        // to set newly added employee in autocomplete selected-Object from wherever called dropdown
        if (insertedDataFromPopup && insertedDataFromPopup.id) {
          const selectedObject = _.find(vm.EmployeeList, (emp) => emp.id === insertedDataFromPopup.id);
          if (setForEmpAutoCompleteSelectedObj === CORE.EmployeeAutoCompleteDynamicBind.selectedEmployee) {
            vm.selectedEmployee = selectedObject;
          }
          else if (setForEmpAutoCompleteSelectedObj === CORE.EmployeeAutoCompleteDynamicBind.selectedNewEmployeeInDepartment) {
            vm.selectedNewEmployeeInDepartment = selectedObject;
          }
        }
        return $q.resolve(vm.EmployeeList);
      }).catch((error) => BaseService.getErrorLog(error));

    /* Parent Department dropdown fill up */
    const getDepartmentList = () => {
      const filter = {};
      if (vm.deptID) {
        filter.filterID = vm.deptID;
      }
      return DepartmentFactory.getAllDepartment().query(filter).$promise.then((departments) => {
        vm.DepartmentList = departments.data;

        vm.DepartmentList = _.filter(vm.DepartmentList, (item) => (item.deptID != vm.deptID && item.parentDeptID != vm.deptID) || (item.deptID != vm.deptID && item.parentDeptID == null));
        return $q.resolve(vm.DepartmentList);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const getDepartmentHeaderList = (searchObj) => DepartmentFactory.getAllDepartment().query(searchObj).$promise.then((departments) => {
      vm.DepartmentHeaderList = departments.data;
      return $q.resolve(vm.DepartmentHeaderList);
    }).catch((error) => BaseService.getErrorLog(error));

    // Get location added list
    const getLocationAddedList = () => {
      vm.SearchAddedListLocation = null;
      vm.SearchNoAddedListLocation = null;
      const listObj = {
        deptID: vm.deptID
      };
      return DepartmentFactory.getLocationAddedList().query({ listObj: listObj }).$promise.then((res) => {
        return res.data;
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // delete location
    const deleteLocation = (listToDelete) => DepartmentFactory.deleteLocation().save({
      deptID: vm.deptID, CountList: false,
      locationTypeID: _.map(listToDelete, (obj) => obj.gencCategoryID)
    }).$promise.then((res) => {
      vm.refreshData();
      if (res && res.data && (res.data.length > 0 || res.data.transactionDetails)) {
        UnSelectAllElement();
        const data = {
          TotalCount: res.data.transactionDetails[0].TotalCount,
          pageName: CORE.PageName.department_location
        };
        BaseService.deleteAlertMessageWithHistory(data, (ev) => {
          return DepartmentFactory.deleteLocation().save({
            deptID: vm.deptID, CountList: true,
            locationTypeID: _.map(listToDelete, (obj) => obj.gencCategoryID)
          }).$promise.then((res) => {
            const IDs = _.map(listToDelete, (obj) => obj.gencCategoryID);
            let data = {};
            data = res.data;
            data.pageTitle = IDs.length > 1 ? stringFormat('{0}{1}', IDs.length, ' Selected') : listToDelete[0].gencCategoryName;
            data.PageName = CORE.PageName.department_location;
            if (res.data) {
              DialogFactory.dialogService(
                USER.ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER,
                USER.ADMIN_SHOW_TRANSACTION_DETAILS_VIEW,
                ev,
                data).then(() => {
                  vm.refreshData();
                }, () => {
                  vm.refreshData();
                });
            }
          }).catch((error) => BaseService.getErrorLog(error));
        });
        return res;
      } else {
        return res;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    // get location for not added list
    vm.getGenericCategoryList = () => {
      vm.SearchAddedListLocation = null;
      vm.SearchNoAddedListLocation = null;
      const GencCategoryType = [];
      GencCategoryType.push(CategoryTypeObjList.LocationType.Name);
      const listObj = {
        GencCategoryType: GencCategoryType,
        isActive: vm.manageDepartment.parentDeptID ? true : false
      };
      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((res) => {
        return res.data;
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const setSelectableListItem = () => {
      $timeout(() => {
        SetDataElementSelectable();
      }, _configSelectListTimeout);
    };

    $scope.selectedLocationListNoAdded = [];
    $scope.selectedLocationListAdded = [];

    //#region sortable option common for all list
    $scope.sortableOptions = uiSortableMultiSelectionMethods.extendOptions({
      cancel: '.cursor-not-allow',
      placeholder: 'beingDragged',
      'ui-floating': true,
      cursorAt: {
        top: 0, left: 0
      },
      start: function () {
      },
      sort: function () {
      },
      stop: function (e, ui) {
        const sourceModel = ui.item.sortable.model;
        if (ui.item.sortable.droptarget) {
          const sourceTarget = ui.item.sortable.source[0];
          const dropTarget = ui.item.sortable.droptarget[0]; // get drop target element
          const SourceDivAdded = sourceTarget.id.indexOf('NoAdded') > -1 ? false : true;
          const DestinationDivAdded = dropTarget.id.indexOf('NoAdded') > -1 ? false : true;
          if (SourceDivAdded != DestinationDivAdded) {
            if (SourceDivAdded == false && DestinationDivAdded == true) {
              if ($scope.selectedLocationListNoAdded.length == 0) {
                $scope.selectedLocationListNoAdded.push(sourceModel);
              }
              vm.ModifyPageAdded('Add', ui.item.sortable.dropindex, e, ui);
              return;
            }
            else if (SourceDivAdded == true && DestinationDivAdded == false) {
              if ($scope.selectedLocationListAdded.length == 0) {
                $scope.selectedLocationListAdded.push(sourceModel);
              }
              vm.ModifyPageAdded('Remove', null, e, ui);
              return;
            }
          }
        }
      },
      connectWith: '.items-container'
    });
    //#endregion
    //#region reset value of selected element
    function ResetSelectedElement() {
      $scope.selectedLocationListNoAdded = [];
      $scope.selectedLocationListAdded = [];
      $scope.selectAnyNoAdded = false;
      $scope.selectAnyAdded = false;
    }
    //#endregion

    //#region check for selected element
    function checkSelectAllFlag() {
      $scope.selectAnyNoAdded = $scope.selectedLocationListNoAdded.length > 0 ? true : false;
      $scope.selectAnyAdded = $scope.selectedLocationListAdded.length > 0 ? true : false;
    }
    //#endregion

    //#region unselect all element list
    function UnSelectAllElement() {
      angular.element('[ui-sortable]#locationNoAddedList .dragsortable').removeClass('ui-sortable-selected');
      angular.element('[ui-sortable]#locationNoAddedList .dragsortable').removeClass('ui-sortable-selected');
      ResetSelectedElement();
    }
    //#endregion

    //#region unselect single element list
    function UnSelectElement(unSelectFrom) {
      if (unSelectFrom == 'NoAdded') {
        angular.element('[ui-sortable]#locationNoAddedList .dragsortable').removeClass('ui-sortable-selected');
      }
      else {
        angular.element('[ui-sortable]#locationAddedList .dragsortable').removeClass('ui-sortable-selected');
      }
      ResetSelectedElement();
    }
    //#endregion

    //#region  set item selectable
    function SetDataElementSelectable() {
      angular.element('[ui-sortable]#locationAddedList').on('ui-sortable-selectionschanged', function (e, args) {
        UnSelectElement('NoAdded');
        const $this = $(this);
        const selectedItemIndexes = $this.find('.ui-sortable-selected').map(function () {
          return $(this).index();
        }).toArray();
        $scope.selectedLocationListAdded = _.map(selectedItemIndexes, (i) => {
          return vm.locationAddedList[i];
        });
        checkSelectAllFlag();
        $scope.$applyAsync();
      });
      angular.element('[ui-sortable]#locationNoAddedList').on('ui-sortable-selectionschanged', () => {
        UnSelectElement('Added');
        const $this = $(this);
        const selectedItemIndexes = $this.find('.ui-sortable-selected').map(function () {
          return $(this).index();
        }).toArray();
        $scope.selectedLocationListNoAdded = _.map(selectedItemIndexes, (i) => {
          return vm.locationNoAddedList[i];
        });
        checkSelectAllFlag();
        $scope.$applyAsync();
      });
    }
    //#endregion

    //#region for destroy selection
    function DestroyDataElementSelection() {
      angular.element('[ui-sortable]#locationNoAddedList').off('ui-sortable-selectionschanged');
      angular.element('[ui-sortable]#locationAddedList').off('ui-sortable-selectionschanged');
    }
    function DestroyAllSelection() {
      DestroyDataElementSelection();
    }
    //#endregion

    vm.SearchLocation = function (list, searchText, IsAdded) {
      if (!searchText) {
        if (IsAdded) {
          vm.SearchAddedListLocation = null;
          vm.isHideSearchButtonadded = false;
          vm.locationAddedList = _locationAddedList;
          vm.FilterDataLocationAdded = true;
        } else {
          vm.SearchNoAddedListLocation = null;
          vm.isHideSearchButton = false;
          vm.locationNoAddedList = _locationNoAddedList;
          vm.FilterDataLocationNotAdded = true;
        }
        return;
      }
      else {
        if (IsAdded) {
          vm.isHideSearchButtonadded = true;
        }
        else {
          vm.isHideSearchButton = true;
        }
      }
      if (IsAdded) {
        vm.locationAddedList = $filter('filter')(_locationAddedList, { gencCategoryName: searchText });
        vm.FilterDataLocationAdded = vm.locationAddedList.length > 0;
      }
      else {
        vm.locationNoAddedList = $filter('filter')(_locationNoAddedList, { gencCategoryName: searchText });
        vm.FilterDataLocationNotAdded = vm.locationNoAddedList.length > 0;
      }
    };

    //#region modify data element Added based on selection from both list
    vm.ModifyPageAdded = (addType, indexPosition, e, ui) => {
      let otherInfoForDataFields = {};
      if (addType == 'Add') {
        const promises = [SaveLocation($scope.selectedLocationListNoAdded, e, ui)];
        vm.cgBusyLoading = $q.all(promises).then((responses) => {
          if (responses[0] && responses[0].status === CORE.ApiResponseTypeStatus.SUCCESS) {
            UnSelectAllElement();
            vm.refreshData();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else if (addType == 'Remove') {
        const promises = [deleteLocation($scope.selectedLocationListAdded, e, ui)];
        vm.cgBusyLoading = $q.all(promises).then((responses) => {
          if (responses[0] && responses[0].status === CORE.ApiResponseTypeStatus.SUCCESS) {
            UnSelectAllElement();
            vm.refreshData();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else if (addType == 'AddAll') {
        const promises = [SaveLocation(vm.locationNoAddedList, e, ui)];
        let locationData = vm.locationNoAddedList;
        vm.cgBusyLoading = $q.all(promises).then((responses) => {
          if (responses[0] && responses[0].status == CORE.ApiResponseTypeStatus.SUCCESS) {
            UnSelectAllElement();
            vm.refreshData();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else if (addType == 'RemoveAll') {
        const promises = [deleteLocation(vm.locationAddedList, e, ui)];
        vm.cgBusyLoading = $q.all(promises).then((responses) => {
          if (responses[0] && responses[0].status == CORE.ApiResponseTypeStatus.SUCCESS) {
            UnSelectAllElement();
            vm.refreshData();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    const setEntityLocationDragDropDetails = () => {
      vm.SearchAddedListLocation = null;
      vm.SearchNoAddedListLocation = null;
      vm.isHideSearchButton = false;
      vm.isHideSearchButtonadded = false;
      vm.locationAddedList = _locationAddedList;
      vm.locationNoAddedList = _locationNoAddedList;
      vm.FilterDataLocationAdded = vm.locationAddedList.length > 0;
      vm.FilterDataLocationNotAdded = vm.locationAddedList.length > 0;
      //reorderList();
    };

    /* save  */
    const SaveLocation = (newListToSave) => {
      vm.SearchAddedListLocation = null;
      vm.SearchNoAddedListLocation = null;
      vm.locationAddedList = _locationAddedList;
      vm.locationNoAddedList = _locationNoAddedList;
      const saveObj = [];
      _.each(newListToSave, (item) => {
        if (item.gencCategoryID) {
          const _object = {};
          _object.locationTypeID = item.gencCategoryID;
          _object.deptID = vm.deptID;
          saveObj.push(_object);
        }
      });
      const listObj = {
        deptID: vm.deptID,
        locationList: saveObj
      };
      return DepartmentFactory.createLocationList().save({ listObj: listObj }).$promise.then((res) => {
        return res;
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* GenericCategory dropdown fill up */
    const getAllGenericCategoryByCategoryType = () => {
      return GenericCategoryFactory.getAllGenericCategoryByCategoryType().query({ categoryType: vm.EmployeeTitle.Name }).$promise
        .then((genericcategorylist) => {
          vm.GenericCategoryList = [];
          if (genericcategorylist && genericcategorylist.data) {
            vm.GenericCategoryList = genericcategorylist.data;
          }
          return $q.resolve(vm.GenericCategoryList);
        }).catch((error) => BaseService.getErrorLog(error));
    };

    function getDeptDetail() {
      /* retrieve Department Details*/
      vm.cgBusyLoading = DepartmentFactory.department().query({ id: vm.deptID }).$promise.then((department) => {
        vm.manageDepartment = angular.copy(department.data);
        vm.manageDepartmentCopy = angular.copy(vm.manageDepartment);
        vm.isParentDeptID = vm.IsSubDepartmentChecked = vm.manageDepartment.parentDeptID ? true : false;
        initAutoComplete();
        $timeout(() => {
          if (vm.deptID && vm.manageDepartmentForm) {
            BaseService.checkFormValid(vm.manageDepartmentForm, false);
            vm.checkDirtyObject = {
              columnName: [],
              oldModelName: null,
              newModelName: null
            };
          }
        }, 0);
      }).catch((error) => BaseService.getErrorLog(error));
    }
    const autocompletePromise = [getEmployeeList(), getDepartmentList(), getAllGenericCategoryByCategoryType(), getDepartmentHeaderList()];
    vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
      if (vm.deptID) {
        getDeptDetail();
      }
      else {
        initAutoComplete();
      }
    }).catch((error) => BaseService.getErrorLog(error));

    const initAutoComplete = () => {
      vm.autoCompleteManagerDetail = {
        columnName: 'name',
        controllerName: USER.ADMIN_EMPLOYEE_ADD_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_EMPLOYEE_ADD_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.manageDepartment.deptMngrID ? vm.manageDepartment.deptMngrID : null,
        inputName: 'Manager',
        placeholderName: 'Manager Name',
        isRequired: true,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_EMPLOYEE_MANAGE_DETAIL_STATE],
          pageNameAccessLabel: CORE.LabelConstant.Personnel.PageName
        },
        isAddnew: true,
        callbackFn: getEmployeeList
      };
      vm.autoCompleteDepartmentDetail = {
        columnName: 'deptName',
        controllerName: USER.ADMIN_DEPARTMENT_ADD_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_DEPARTMENT_ADD_MODAL_VIEW,
        keyColumnName: 'deptID',
        keyColumnId: vm.manageDepartment.parentDeptID ? vm.manageDepartment.parentDeptID : null,
        inputName: 'ParentDepartment',
        placeholderName: 'Parent Department Name',
        isRequired: '',
        addData: {
          popupAccessRoutingState: [USER.ADMIN_DEPARTMENT_STATE],
          pageNameAccessLabel: CORE.LabelConstant.Department.PageName
        },
        isAddnew: true,
        callbackFn: getDepartmentList
      };
      vm.autoCompleteDeptHeaderList = {
        columnName: 'deptName',
        keyColumnName: 'deptID',
        keyColumnId: null,
        inputName: 'id',
        placeholderName: 'id',
        isRequired: false,
        isDisabled: false,
        isAddnew: false,
        //callbackFn: getDepartmentHeaderList,
        onSelectCallbackFn: selectDepartment,
        onSearchFn: function (query) {
          const searchobj = {
            searchquery: query
          };
          return getDepartmentHeaderList(searchobj);
        }
      };
      initDepartmentEmployeeAutoComplete();
    };

    const initDepartmentEmployeeAutoComplete = () => {
      vm.autoCompleteEmployeeInDepartment = {
        columnName: 'name',
        controllerName: USER.ADMIN_EMPLOYEE_ADD_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_EMPLOYEE_ADD_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.addEmpInDept.employeeID ? vm.addEmpInDept.employeeID : null,
        inputName: 'Personnel',
        placeholderName: 'Personnel',
        isRequired: true,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_EMPLOYEE_MANAGE_DETAIL_STATE],
          pageNameAccessLabel: CORE.LabelConstant.Personnel.PageName
        },
        isAddnew: true,
        callbackFn: getEmployeeList
      };
      vm.autoCompleteGenericCategory = {
        columnName: 'gencCategoryName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.addEmpInDept.titleID ? vm.addEmpInDept.titleID : null,
        inputName: vm.EmployeeTitle.Name,
        placeholderName: vm.EmployeeTitle.Title,
        addData: { headerTitle: vm.EmployeeTitle.Title },
        isRequired: true,
        isAddnew: true,
        callbackFn: getAllGenericCategoryByCategoryType
      };
    };

    const selectDepartment = (item) => {
      if (item) {
        $state.go(USER.ADMIN_MANAGEDEPARTMENT_DETAIL_STATE, { deptID: item.deptID }, { reload: true });
        $timeout(() => {
          vm.autoCompleteDeptHeaderList.keyColumnId = null;
        }, true);
      }
    };

    //Check sub department
    vm.CheckSubDepartment = () => {
      if (vm.isParentDeptID === true) {
        vm.IsSubDepartmentChecked = true;
      }
      else {
        vm.manageDepartment.parentDeptID = null;
        vm.IsSubDepartmentChecked = false;
        vm.autoCompleteDepartmentDetail.keyColumnId = null;
      }
    };

    /* create-update department */
    vm.SaveDepartment = () => {
      vm.isSubmit = false;
      if (!vm.manageDepartmentForm.$valid) {
        vm.isSubmit = true;
        return;
      }

      const departmentInfo = {
        deptID: vm.manageDepartment.deptID,
        deptName: vm.manageDepartment.deptName,
        deptMngrID: vm.autoCompleteManagerDetail.keyColumnId ? vm.autoCompleteManagerDetail.keyColumnId : null,
        parentDeptID: vm.autoCompleteDepartmentDetail.keyColumnId ? vm.autoCompleteDepartmentDetail.keyColumnId : null,
        isActive: vm.manageDepartment.isActive
      };
      if (vm.manageDepartment && vm.manageDepartment.deptID) {
        vm.cgBusyLoading = DepartmentFactory.department().update({
          id: vm.manageDepartment.deptID
        }, departmentInfo).$promise.then((res) => {
          if (res && res.status == CORE.ApiResponseTypeStatus.SUCCESS) {
            //BaseService.currentPageForms = [vm.manageDepartmentForm, vm.dataElementValueForm];
            vm.manageDepartmentForm.$setPristine();
            vm.DepartmentEmployeeList();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        vm.cgBusyLoading = DepartmentFactory.department().save(departmentInfo).$promise.then((res) => {
          if (res.data && res.data.deptID) {
            vm.manageDepartmentForm.$setPristine();
            vm.manageDepartment.deptID = res.data.deptID;
            vm.deptID = res.data.deptID;
            vm.DepartmentEmployeeList();

            $state.go(USER.ADMIN_MANAGEDEPARTMENT_DETAIL_STATE, { deptID: vm.deptID }, { reload: true });
          }
          else {
            return BaseService.getErrorLog(error);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    /*To save other value detail
    Note:If any step added after other detail just remove function body and add logic of last step
    */
    vm.fileList = {};
    vm.finish = () => {
      const dynamicControlList = DataElementTransactionValueFactory.getDataElementTransactionList(vm.dataElementList);

      DataElementTransactionValueFactory.saveTransctionValue({
        referenceTransID: vm.deptID,
        entityID: vm.entityID,
        dataElementList: dynamicControlList.dataElementList,
        removeElementList: dynamicControlList.removeElementList,
        subFormTransList: dynamicControlList.subFormTransList,
        deletedsubFormTransIDs: dynamicControlList.deletedsubFormTransIDs,
        removeSubFormTransListConditional: dynamicControlList.removeSubFormTransListConditional
      }, vm.fileList).then(() => {
        // commented as per last discussion on 18/09/2018, no need to move to list will press back button
        //$state.go(USER.ADMIN_DEPARTMENT_STATE);

        // Display success message of each field if assigned on validation options
        DataElementTransactionValueFactory.displaySuccessMessage(dynamicControlList.dataElementList);
        vm.departmentOtherDetail.$setPristine();

        /* code for rebinding document to download - (actually all other details) */

        vm.IsOtherDetailTab = false;
        vm.fileList = {};
        $timeout(() => {
          vm.IsOtherDetailTab = true;
        }, 0);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //transfer rout as per tab change
    vm.stateTransfer = (tabIndex) => {
      const itemTabName = _.find(USER.DepartmentTabs, (valItem) => {
        return valItem.ID == tabIndex;
      });
      if (itemTabName && itemTabName.Name != vm.tabName) {
        switch (itemTabName.Name) {
          case USER.DepartmentTabs.Detail.Name:
            $state.go(USER.ADMIN_MANAGEDEPARTMENT_DETAIL_STATE, { deptID: vm.deptID });
            break;
          case USER.DepartmentTabs.Employee.Name:
            $state.go(USER.ADMIN_MANAGEDEPARTMENT_EMPLOYEE_STATE, { deptID: vm.deptID });
            break;
          case USER.DepartmentTabs.Geolocations.Name:
            $state.go(USER.ADMIN_MANAGEDEPARTMENT_LOCATION_STATE, { deptID: vm.deptID });
            break;
          case USER.DepartmentTabs.Misc.Name:
            $state.go(USER.ADMIN_MANAGEDEPARTMENT_MISC_STATE, { deptID: vm.deptID });
            break;
          default: break;
        }
      }
    };

    /* Manually put as load 'ViewDataElement directive' only on other details tab   */
    vm.onTabChanges = (TabName, msWizard) => {
      vm.query.search = '';
      if (TabName === vm.OtherDetailTabName) {
        vm.IsOtherDetailTab = true;
        BaseService.currentPageForms = [msWizard.currentStepForm()];
      }
      else {
        vm.IsOtherDetailTab = false;
      }
      if (TabName === vm.EmployeeListTitle) {
        vm.AddEmployeeToDepartmentDivShow = true;
        vm.IsEmployeeList = true;
        vm.DepartmentEmployeeList();
        BaseService.currentPageForms = [msWizard.currentStepForm()];
      }
      else {
        vm.IsEmployeeList = false;
      }
      if (TabName === vm.LocationTitle) {
        vm.refreshData();
      }
      msWizard.selectedIndex = vm.selectedTabIndex;
      vm.stateTransfer(vm.selectedTabIndex);
      $('#content').animate({ scrollTop: 0 }, 200);
      vm.isDetailTab = (msWizard.selectedIndex === 0);
      vm.isEmpTab = (msWizard.selectedIndex === 1);
      vm.isLocTab = (msWizard.selectedIndex === 2);
      vm.isMiscTab = (msWizard.selectedIndex === 3);
      vm.showIsActiveDiv = msWizard.selectedIndex === 0 ? true : false;
    };

    /* Save Employee in selected department*/
    vm.SaveEmployeeInDepartment = () => {
      // Used to focus on first error filed of form
      if (vm.employeesInDepartmentForm.$invalid) {
        BaseService.focusRequiredField(vm.employeesInDepartmentForm);
        return;
      }
      const employeeDepartmentInfo = {
        empDeptID: vm.addEmpInDept.empDeptID,
        employeeID: vm.autoCompleteEmployeeInDepartment.keyColumnId ? vm.autoCompleteEmployeeInDepartment.keyColumnId : null,
        departmentID: vm.manageDepartment.deptID,
        titleID: vm.autoCompleteGenericCategory.keyColumnId ? vm.autoCompleteGenericCategory.keyColumnId : null,
        isActive: true
      };
      if (employeeDepartmentInfo.empDeptID) {
        vm.cgBusyLoading = EmployeeDepartmentFactory.updateEmployeeInDepartment().update({
          id: employeeDepartmentInfo.empDeptID,
        }, employeeDepartmentInfo).$promise.then(() => {
          vm.clearEmpInDeptData();
          vm.DepartmentEmployeeList();
          vm.employeesInDepartmentForm.$setPristine();
          vm.AddEmployeeToDepartmentDivShow = false;
          $timeout(() => {
            vm.AddEmployeeToDepartmentDivShow = true;
          });
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        vm.cgBusyLoading = EmployeeDepartmentFactory.addEmployeeInDepartment().save(employeeDepartmentInfo).$promise.then((res) => {
          if (res && res.data && res.data.empDeptID) {
            vm.clearEmpInDeptData();
            vm.DepartmentEmployeeList();
            vm.employeesInDepartmentForm.$setPristine();
            vm.AddEmployeeToDepartmentDivShow = false;
          }
          $timeout(() => {
            vm.AddEmployeeToDepartmentDivShow = true;
          });
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.clearEmpInDeptData = () => {
      vm.addEmpInDept = {};
      vm.AddEmployeeToDepartmentDivShow = !vm.AddEmployeeToDepartmentDivShow;
      initDepartmentEmployeeAutoComplete();
    };

    vm.fab = {
      Status: false
    };

    vm.checkFormDirty = (form, columnName) => {
      const result = BaseService.checkFormDirty(form, columnName);
      return result;
    };

    /* Show save alert popup when performing next and previous*/
    function showWithoutSavingAlertforNextPrevious(tabIndex, isSave, isChanged, isPrevious) {
      const selectedIndex = tabIndex;
      if (isSave) {
        if (selectedIndex === 0) {
          if (vm.manageDepartmentForm.$valid) {
            vm.SaveDepartment(tabIndex);
            vm.manageDepartmentForm.$setPristine();
          }
        }
      }
      else {
        if (isChanged) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
            canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              if (selectedIndex === 0) {
                getDeptDetail();
                vm.DepartmentEmployeeList();
                vm.manageDepartmentForm.$setPristine();
              }
              else if (selectedIndex === 1) {
                vm.employeesInDepartmentForm.$dirty = false;
                vm.AddEmployeeToDepartmentDivShow = true;
                vm.clearEmpInDeptData();
                vm.employeesInDepartmentForm.$setPristine();
              } else if (selectedIndex === 2) {
                vm.departmentOtherDetail.$setPristine();
              }
              if (isPrevious) {
                msWizard.previousStep();
              } else {
                msWizard.nextStep();
              }
            }
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          if (isPrevious) {
            msWizard.previousStep();
          } else {
            msWizard.nextStep();
          }
        }
      }
    }
    /* Check step on save*/
    vm.CheckStepAndAction = (msWizard, isUnique, isSave) => {
      let isChanged = false;

      if (isSave) {
        if (BaseService.focusRequiredField(msWizard.currentStepForm())) {
          return;
        }
      }
      if (vm.selectedTabIndex === 0) {
        vm.DepartmentEmployeeList();
        isChanged = BaseService.checkFormDirty(vm.manageDepartmentForm, vm.checkDirtyObject);
        showWithoutSavingAlertforNextPrevious(vm.selectedTabIndex, isSave, isChanged, false);
      }
      else if (vm.selectedTabIndex === 1) {
        isChanged = BaseService.checkFormDirty(vm.employeesInDepartmentForm, null);
        showWithoutSavingAlertforNextPrevious(vm.selectedTabIndex, isSave, isChanged, false);
      }
      else if (vm.selectedTabIndex === 2) {
        isChanged = BaseService.checkFormDirty(vm.employeesInDepartmentForm, null);
        showWithoutSavingAlertforNextPrevious(vm.selectedTabIndex, isSave, isChanged, false);
      }
      else if (vm.selectedTabIndex === 3) {
        vm.finish();
      }
    };

    //close popup on page destroy
    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, { closeAll: true });
    });
    /* open div of saving employee in department for edit purpose */
    vm.editEmpDept = (empItem) => {
      vm.addEmpInDept.empDeptID = empItem.empDeptID;
      vm.addEmpInDept.employeeID = empItem.employee.id;
      vm.addEmpInDept.titleID = empItem.genericCategory ? empItem.genericCategory.gencCategoryID : null;
      vm.AddEmployeeToDepartmentDivShow = false;
      $timeout(() => {
        vm.AddEmployeeToDepartmentDivShow = true;
        initDepartmentEmployeeAutoComplete();
      }, 0);
    };

    /* remove employee from department */
    vm.DeleteEmployeeDepartment = (row) => {
      if (row && row.empDeptID) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Personnel from department', 1);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            if (vm.addEmpInDept.empDeptID && vm.addEmpInDept.empDeptID === row.empDeptID) {
              vm.clearEmpInDeptData();
            }
            vm.cgBusyLoading = EmployeeDepartmentFactory.employeeDepartment().delete({
              id: row.empDeptID
            }).$promise.then(() => {
              if (vm.AddEmployeeToDepartmentDivShow) {
                vm.AddEmployeeToDepartmentDivShow = !vm.AddEmployeeToDepartmentDivShow;
              }
              vm.DepartmentEmployeeList();
              $timeout(() => {
                vm.AddEmployeeToDepartmentDivShow = true;
              }, 0);
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    /* fun to check form dirty on tab change */
    vm.isStepValid = function (step) {
      switch (step) {
        case 0: {
          const isDirty = vm.manageDepartmentForm && vm.manageDepartmentForm.$dirty;
          if (isDirty) {
            return showWithoutSavingAlertforTabChange(step);
          } else {
            return true;
          }
          break;
        }
        case 1: {
          const isDirty = vm.employeesInDepartmentForm && vm.employeesInDepartmentForm.$dirty;
          if (isDirty) {
            return showWithoutSavingAlertforTabChange(step);
          } else {
            return true;
          }
          break;
        }
        case 2: {
          const isDirty = vm.departmentOtherDetail && vm.departmentOtherDetail.$dirty;
          if (isDirty) {
            return showWithoutSavingAlertforTabChange(step);
          } else {
            return true;
          }
          break;
        }
      }
    };

    /* Show save alert popup when performing tab change*/
    function showWithoutSavingAlertforTabChange(step) {

      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      return DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          vm.isSave = false;
          if (step === 0) {
            getDeptDetail();
            vm.manageDepartmentForm.$setPristine();
            return true;
          } else if (step === 1) {
            vm.clearEmpInDeptData();
            vm.employeesInDepartmentForm.$setPristine();
            return true;
          } else if (step === 2) {
            vm.departmentOtherDetail.$setPristine();
            return true;
          }
        }
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    }

    // show confirmation to switch in edit mode
    vm.CheckForEdit = () => {
      var messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          vm.isEdit = true;
        }
      }, (error) => BaseService.getErrorLog(error));
    };
    //vm.onTabChanges($stateParams.tab, null);

    /* called for max length validation */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    }

    /* redirect to employee(personnel) master */
    vm.goToPersonnelList = () => {
      BaseService.goToPersonnelList();
    }

    vm.goToGenericCategoryTitleList = () => {
      BaseService.goToGenericCategoryTitleList();
    }

    // Function call on department name blue event and check code exist or not
    vm.checkDuplicateDeptName = () => {
      if (oldDepartmentName != vm.manageDepartment.deptName) {
        if (vm.manageDepartmentForm && vm.manageDepartmentForm.deptName.$dirty && vm.manageDepartment.deptName) {
          vm.cgBusyLoading = DepartmentFactory.checkDuplicateDepartmentName().save({
            deptID: vm.manageDepartment && vm.manageDepartment.deptID ? vm.manageDepartment.deptID : null,
            deptName: vm.manageDepartment.deptName
          }).$promise.then((res) => {
            vm.cgBusyLoading = false;
            oldDepartmentName = angular.copy(vm.manageDepartment.deptName);
            if (res && res.status == CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicateDeptName) {
              oldDepartmentName = '';
              vm.manageDepartment.deptName = null;
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
              messageContent.message = stringFormat(messageContent.message, 'Department name');
              let obj = {
                messageContent: messageContent,
                multiple: true
              };
              DialogFactory.messageAlertDialog(obj).then(() => {
                setFocusByName('deptName');
              });
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
    };

    //refresh location details
    vm.refreshData = () => {
      const promises = [vm.getGenericCategoryList(), getLocationAddedList()];
      vm.cgBusyLoading = $q.all(promises).then((responses) => {
        if (responses[0]) {
          _locationNoAddedList = vm.locationNoAddedList = [];
          _.each(responses[0], (itemData) => {
            vm.locationNoAddedList.push(itemData);
          });
          _locationNoAddedList = angular.copy(vm.locationNoAddedList);
        }
        if (responses[1]) {
          _locationAddedList = vm.locationAddedList = [];
          _.each(responses[1], (itemData) => {
            vm.locationAddedList.push(itemData.GenericCategory);
          });
          _locationAddedList = angular.copy(vm.locationAddedList);
        }
        if (_locationAddedList.length > 0) {
          _.each(_locationAddedList, (item) => {
            vm.locationNoAddedList = _.without(vm.locationNoAddedList,
              _.find(vm.locationNoAddedList, (valItem) => {
                return valItem.gencCategoryID == item.gencCategoryID;
              })
            );
          });
        }
        if (_locationNoAddedList.length == 0 && _locationAddedList.length == 0) {
          vm.isContainMasterDataLocation = false;
        }
        else {
          vm.isContainMasterDataLocation = true;
        }
        ResetSelectedElement();
        setSelectableListItem();
      });
    };

    //add location
    vm.addData = (data, ev) => {
      const dataObj = {
        Title: CategoryTypeObjList.LocationType.Name,
        headerTitle: CORE.CategoryType.LocationType.Title
      };
      DialogFactory.dialogService(
        USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        ev,
        dataObj).then(() => {
        }, (data) => {
          if (data) {
            vm.refreshData();
          }
        }, (error) => BaseService.getErrorLog(error));
    };

    /* to move at manage location generic category */
    vm.goToGenericCategoryManageLocation = (gencCategoryID) => {
      BaseService.goToGenericCategoryManageLocation(gencCategoryID);
    };
    vm.addDepartment = () => {
      $state.go(USER.ADMIN_MANAGEDEPARTMENT_DETAIL_STATE, { deptID: null });
    };
    //Set as current form when page loaded
    angular.element(() => {
      //BaseService.currentPageForms = [vm.manageDepartmentForm, vm.dataElementValueForm];
      BaseService.currentPageForms = [vm.manageDepartmentForm];
    });
  }
})();
