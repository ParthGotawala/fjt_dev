(function () {
  'use strict';

  angular
    .module('app.admin.equipment')
    .controller('ManageEquipmentController', ManageEquipmentController);

  /** @ngInject */
  function ManageEquipmentController($state, $q, $stateParams, $timeout, OPERATION, $filter, USER, CORE,
    EquipmentFactory, GenericCategoryFactory, DataElementTransactionValueFactory,
    EntityFactory, $scope, uiSortableMultiSelectionMethods, EquipmentDataelementFactory, BinFactory,
    Upload, DialogFactory, $mdDialog, EquipmentTaskFactory, DepartmentFactory, BaseService, MasterFactory, TRANSACTION, ComponentFactory) {
    const vm = this;
    var oldimgfile;
    vm.equipmentAndWorkstationTabs = angular.copy(USER.EquipmentAndWorkstationTabs);
    vm.equipmentAndWorkstationTabs.OtherDetail.Name = CORE.OtherDetail.TabName;
    vm.equipmentAndWorkstationMaintananceScheduleTabs = angular.copy(USER.EquipmentAndWorkstationMaintananceScheduleTabs);
    vm.currentTabName = $stateParams.selectedTab;
    vm.currentSubTabName = $stateParams.subTab;
    vm.LabelConstant = CORE.LabelConstant;
    vm.entityName = CORE.AllEntityIDS.Equipment;
    const IsPermanentDelete = CORE.IsPermanentDelete;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.Maintenance_Schedule_RepeatTypeDataValue = CORE.Maintenance_Schedule_RepeatTypeDataValue;
    vm.Maintenance_Schedule_RepeatTypeKey = CORE.Maintenance_Schedule_RepeatTypeKey;
    vm.EquipmentMaintenanceType = CORE.EquipmentMaintenanceType;
    vm.dataElementList = [];
    vm.taToolbar = CORE.Toolbar;
    vm.entityID = 0;
    vm.Entity = CORE.Entity;
    vm.isCustomer = false;
    vm.isLoan = false;
    vm.EquipmentLocationList = [];
    vm.minLengthMessage = CORE.MESSAGE_CONSTANT.MIN_LENGTH_MESSAGE;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    const dataelementInputFieldList = CORE.InputeFields;
    let isProfileImageDeleteAction = false;
    vm.debounceConstant = CORE.Debounce;
    /* "_.values" used to convert object to array*/
    vm.equipmentSetupMethodConstList = _.values(CORE.EQUIPMENT_SETUP_METHODS);
    vm.equipmentSetupMethod = CORE.EQUIPMENT_SETUP_METHODS.Default.Value;
    vm.EmptyMesssageForDataField = OPERATION.OPERATION_EMPTYSTATE.ASSIGNFILEDS;
    vm.isContainMasterDataField = false;
    let imageName;
    vm.warehouseType = TRANSACTION.warehouseType.Equipment.key;
    vm.RadioGroup = {
      isActive: {
        array: CORE.ActiveRadioGroup
      },
      equipmentAs: {
        array: CORE.EquipmentRadioGroup.equipmentAs
      }
    };
    vm.equipmentRadioButtonValue = CORE.EquipmentRadioButtonValue;
    vm.pageTabRights =
    {
      Detail: false,
      MaintenanceSchedule: false,
      CalibrationDetails: false,
      Document: false,
      DataFields: false,
      OtherDetail: false
    };
    //vm.PartCorrectList = CORE.PartCorrectList;

    vm.imagefile = CORE.WEB_URL + CORE.NO_IMAGE_EQUIPMENT;
    /* for down arrow key open date picker */
    vm.DATE_PICKER = CORE.DATE_PICKER;
    vm.IsPickerOpen = {};
    vm.IsPickerOpen[vm.DATE_PICKER.placedInServiceDate] = false;
    vm.IsPickerOpen[vm.DATE_PICKER.outOfServiceDate] = false;
    const CategoryTypeObjList = angular.copy(CORE.CategoryType);
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;

    vm.isSubmit = false;
    vm.manageEquipment = {};
    vm.manageEquipment.eqpID = $stateParams.eqpID ? $stateParams.eqpID : null;
    vm.manageEquipment.equipmentAs = vm.equipmentRadioButtonValue.Equipment.ID;
    vm.manageEquipment.calibrationRequired = false;
    vm.todayDate = new Date();
    vm.placedInServiceDateOptions = {
      maxDate: vm.todayDate,
      appendToBody: true
    };
    vm.outOfServiceDateOptions = {
      minDate: new Date(vm.manageEquipment.eqpID ? vm.manageEquipment.placedInServiceDate : (vm.manageEquipment.placedInServiceDate ? ((vm.outOfServiceDateOptions.minDate > vm.todayDate) ? vm.manageEquipment.placedInServiceDate : vm.todayDate) : vm.todayDate)),
      appendToBody: true
    };


    vm.selectedTabIndex = 0;
    if (vm.currentTabName) {
      if (!vm.manageEquipment.eqpID) {
        if (USER.EquipmentAndWorkstationTabs.Detail.Name !== vm.currentTabName) {
          $state.go(USER.ADMIN_MANAGEEQUIPMENT_DETAIL_STATE, { id: vm.manageEquipment.eqpID });
        }
      } else {
        const tab = _.find(USER.EquipmentAndWorkstationTabs, (item) =>
          item.Name === vm.currentTabName
        );
        if (tab) {
          vm.selectedTabIndex = tab.ID;
        }
      }
    }
    vm.selectedSUBTabIndex = 0;
    if (vm.currentSubTabName) {
      const subtab = _.find(USER.EquipmentAndWorkstationMaintananceScheduleTabs, (item) =>
        item.Name === vm.currentSubTabName
      );
      if (subtab) {
        vm.selectedSUBTabIndex = subtab.ID;
      }
    }
    vm.isUpdate = false;
    let GenericCategoryAllData = [];
    let _dataElementAddedList = [];
    let _dataElementNoAddedList = [];
    vm.SearchAddedListElement = null;
    vm.SearchNoAddedListElement = null;
    let SubFormElementList = [];
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.ASSIGNFILEDS;
    vm.EmptyMesssageForEquipmentTask = USER.ADMIN_EMPTYSTATE.EQUIPMENT_SCHEDULE_TASK;
    vm.goBack = (msWizard) => {
      if (BaseService.checkFormDirty(vm.manageEquipmentForm, null)) {
        showWithoutSavingAlertforBackButton(msWizard);
      } else if (BaseService.checkFormDirty(vm.equipmentMaintenanceDetailForm, null)) {
        showWithoutSavingAlertforBackButton(msWizard);
      } else if (vm.equipmentOtherDetail.$dirty) {
        showWithoutSavingAlertforBackButton(msWizard);
      } else {
        $state.go(USER.ADMIN_EQUIPMENT_STATE);
      }
    };
    function showWithoutSavingAlertforBackButton(msWizard) {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          const step = msWizard.selectedIndex;
          if (step === vm.equipmentAndWorkstationTabs.Detail.ID) {
            vm.manageEquipmentForm.$setPristine();
          } else if (step === vm.equipmentAndWorkstationTabs.MaintenanceSchedule.ID) {
            vm.equipmentMaintenanceDetailForm.$setPristine();
          } else if (step === vm.equipmentAndWorkstationTabs.OtherDetail.ID) {
            vm.equipmentOtherDetail.$setPristine();
          }
          $state.go(USER.ADMIN_EQUIPMENT_STATE);
        }
      }, (error) =>
        BaseService.getErrorLog(error)
      );
    }

    const selectEquipment = (item) => {
      if (item) {
        $state.go(USER.ADMIN_MANAGEEQUIPMENT_DETAIL_STATE, { eqpID: item.eqpID }, { reload: true });
        $timeout(() => {
          vm.autoCompleteEquipment.keyColumnId = null;
        }, true);
      }
    };

    const getEquipmentSearchSearch = (searchObj) =>
      EquipmentFactory.getequipmentlist().query(searchObj).$promise.then((eqp) => {
        if (eqp) {
          return eqp.data;
        }
      }).catch((error) =>
        BaseService.getErrorLog(error)
      );

    /*Auto-complete for Search equipment and workstation */
    vm.autoCompleteEquipment = {
      columnName: 'assetName',
      keyColumnName: 'eqpID',
      keyColumnId: null,
      inputName: 'Equipment, Workstation & Sample',
      placeholderName: 'Equipment, Workstation & Sample',
      isRequired: false,
      isAddnew: false,
      onSelectCallbackFn: selectEquipment,
      onSearchFn: function (query) {
        const searchobj = {
          searchquery: query
        };
        return getEquipmentSearchSearch(searchobj);
      }
    };

    /* Department drop-down fill up */
    const getDepartmentList = (newlyAddedDeptIdFromAutoComplete, NewDepartmentId) =>
      DepartmentFactory.getAllDepartment().query().$promise.then((departments) => {
        vm.DepartmentList = departments.data;
        $timeout(() => {
          if (vm.manageEquipment && vm.manageEquipment.departmentID) {
            const selectedDepartment = _.find(vm.DepartmentList, (dept) =>
              dept.deptID === vm.manageEquipment.departmentID
            );
            vm.selectedDepartment = selectedDepartment ? selectedDepartment : null;
          }
        }, 0);
        if (NewDepartmentId) {
          const selectedDepartment = _.find(vm.DepartmentList, (dept) =>
            dept.deptID === NewDepartmentId
          );
          vm.selectedDepartment = selectedDepartment ? selectedDepartment : null;
        }
        return $q.resolve(vm.DepartmentList);
      }).catch((error) =>
        BaseService.getErrorLog(error)
      );

    vm.querySearchForDepartment = (query) => {
      if (vm.DepartmentList) {
        return $filter('filter')(vm.keyColumnId, { deptName: query });
      }
      else {
        return [];
      }
    };
    vm.chekDateKeyPress = ($event) => {
      if ($event.target.value && vm.manageEquipment && vm.manageEquipment.placedInServiceDate && vm.isUpdate) {
        return vm.manageEquipment.placedInServiceDate = null;
      }
      if (vm.manageEquipment && !vm.manageEquipment.placedInServiceDate) {
        vm.invalidDate = true;
      }
      if (!vm.manageEquipment) { vm.RequiredDate = true; }
    };
    vm.selectedItemChangeForDepartment = (item) => {
      if (item) {
        vm.manageEquipment.departmentID = item.deptID;
      }
      else {
        vm.manageEquipment.departmentID = null;
      }
    };

    const equipmentTemplate = {
      eqpID: vm.manageEquipment.eqpID,
      assetName: null,
      eqpSubGroupID: null,
      eqpGroupID: null,
      isActive: true,
      equipmentAs: vm.equipmentRadioButtonValue.Equipment.ID,
      calibrationRequired: false
    };

    vm.clearEquipment = () => {
      vm.manageEquipment = Object.assign({}, equipmentTemplate);
      if (vm.autoCompleteSearchAssy) {
        $scope.$broadcast(vm.autoCompleteSearchAssy.inputName, null);
      }
    };

    if (!vm.manageEquipment.eqpID) {
      vm.clearEquipment();
    }


    /* retrieve Equipment Details*/
    const getEquipmentDetails = () => {
      isProfileImageDeleteAction = false;
      if (!vm.manageEquipment.eqpID) {
        return;
      }
      return EquipmentFactory.equipment().query({ id: vm.manageEquipment.eqpID }).$promise.then((equipment) => {
        if (equipment && equipment.data) {
          equipment.data.eqpYear = equipment.data.eqpYear ? parseInt(equipment.data.eqpYear) : null;
          vm.equipmentSetupMethod = equipment.data.equipmentSetupMethod;
          vm.oldEquipmentSetupMethod = angular.copy(equipment.data.equipmentSetupMethod);
          vm.manageEquipment = angular.copy(equipment.data);
          vm.isDatLoaded = true;
          vm.outOfServiceDateOptions = {
            minDate: new Date(vm.manageEquipment.eqpID ? vm.manageEquipment.placedInServiceDate : (vm.manageEquipment.placedInServiceDate ? ((vm.outOfServiceDateOptions.minDate > vm.todayDate) ? vm.manageEquipment.placedInServiceDate : vm.todayDate) : vm.todayDate)),
            appendToBody: true
          };
          vm.manageEquipment.placedInServiceDate = BaseService.getUIFormatedDate(vm.manageEquipment.placedInServiceDate, vm.DefaultDateFormat); //outOfServiceDate
          vm.manageEquipment.outOfServiceDate = BaseService.getUIFormatedDate(vm.manageEquipment.outOfServiceDate, vm.DefaultDateFormat);
          vm.isUpdate = true;
          if (vm.manageEquipment.equipmentAs) {
            switch (vm.manageEquipment.equipmentAs) {
              case vm.equipmentRadioButtonValue.Equipment.Value:
                {
                  vm.manageEquipment.equipmentAs = vm.equipmentRadioButtonValue.Equipment.ID;
                }
                break;
              case vm.equipmentRadioButtonValue.Workstation.Value:
                {
                  vm.manageEquipment.equipmentAs = vm.equipmentRadioButtonValue.Workstation.ID;
                  //vm.manageEquipment.placedInServiceDate = null;
                  vm.equipmentSetupMethod = CORE.EQUIPMENT_SETUP_METHODS.Default.Value;
                }
                break;
              case vm.equipmentRadioButtonValue.Sample.Value:
                {
                  vm.manageEquipment.equipmentAs = vm.equipmentRadioButtonValue.Sample.ID;
                }
                break;
            }
          }


          /* if maintenanceType not defined then it is Usage type (STATIC CODE) */
          if (vm.selectedSUBTabIndex) {
            vm.selectedTabIndexForScheduleType = vm.selectedSUBTabIndex;
            if (vm.selectedTabIndexForScheduleType === vm.equipmentAndWorkstationMaintananceScheduleTabs.Usage.ID) {
              vm.manageEquipment.maintenanceType = vm.EquipmentMaintenanceType.Usage;
            }
            else if (vm.selectedTabIndexForScheduleType === vm.equipmentAndWorkstationMaintananceScheduleTabs.Time.ID) {
              vm.manageEquipment.maintenanceType = vm.EquipmentMaintenanceType.Time;
            }
          }
          else {
            vm.selectedTabIndexForScheduleType = vm.equipmentAndWorkstationMaintananceScheduleTabs.Usage.ID;  /* 0-UsageTab and 1-TimeTab */
            vm.manageEquipment.maintenanceType = vm.EquipmentMaintenanceType.Usage;
          }

          if (vm.manageEquipment.customerId) {
            vm.isCustomer = true;
          }
          else {
            vm.isCustomer = false;
          }
          /*convert utc time (scheduleStartTime) to local datetime*/
          _.each(vm.manageEquipment.equipmentTask, (itemEquipmentTask) => {
            _.each(itemEquipmentTask.equipmentTaskSchedule, (itemEquipmentTaskSchedule) => {
              if (itemEquipmentTaskSchedule.scheduleStartTime) {
                const dateWithTime = new Date($filter('date')(new Date(), _dateDisplayFormat) + ' ' + itemEquipmentTaskSchedule.scheduleStartTime);
                itemEquipmentTaskSchedule.scheduleStartTime = adjustDateByTimezoneOffset(dateWithTime, false);
              }
            });
          });

          //vm.files = [];
          if (vm.manageEquipment.genericFiles) {
            vm.manageEquipment.genericFiles.forEach((value) => {
              if (value.gencFileName.includes('profile')) {
                if (value.gencFileName) {
                  vm.imagefile = CORE.WEB_URL + USER.EQUIPMENT_BASE_PATH + value.gencFileName;
                  vm.originalFileName = value.gencOriginalName;
                } else {
                  vm.imagefile = CORE.WEB_URL + CORE.NO_IMAGE_EQUIPMENT;
                  vm.originalFileName = '';
                }
                vm.fileName = value.gencFileName;
                vm.profileId = value.gencFileID;
                oldimgfile = vm.imagefile;
                vm.manageEquipment.profileImage = value.gencFileName;
              }
            });
          } else {
            vm.manageEquipment.profileImage = null;
            vm.imagefile = CORE.WEB_URL + CORE.NO_IMAGE_EQUIPMENT;
            oldimgfile = vm.imagefile;
          }
          vm.manageEquipment.warehouseMst = equipment.data.warehouseMst ? equipment.data.warehouseMst : null;
          if (equipment.data.binMst) {
            vm.manageEquipment.bin = equipment.data.binMst.Name;
            vm.manageEquipment.warehouse = equipment.data.binMst.warehousemst ? equipment.data.binMst.warehousemst.Name : null;
            vm.manageEquipment.parentWarehouse = (equipment.data.binMst.warehousemst && equipment.data.binMst.warehousemst.parentWarehouseMst) ? equipment.data.binMst.warehousemst.parentWarehouseMst.Name : null;
          }
          vm.manageEquipmentCopy = angular.copy(vm.manageEquipment);
        }
        return $q.resolve(vm.manageEquipment);
      }).catch((error) =>
        BaseService.getErrorLog(error)
      );
    };

    vm.cropImage = (file, ev) => {
      if (!file) {
        return;
      }

      file.isProfileImage = true;

      DialogFactory.dialogService(
        USER.IMAGE_CROP_CONTROLLER,
        USER.IMAGE_CROP_VIEW,
        ev,
        file).then((res) => {
          vm.originalFileName = file.name;
          vm.croppedImage = res.croppedImage;
          vm.imagefile = vm.croppedImage;
          vm.manageEquipmentForm.$$controls[0].$setDirty();
        }, () => {
        },
          () => {
            if (oldimgfile === vm.imagefile) {
              vm.manageEquipmentForm.profileImage.$dirty = false;
            }
          });
    };
    // retrieve location list
    const getLocationList = (dept) => {
      if (!dept) {
        if (vm.autoCompleteEquipmentLocation) {
          vm.autoCompleteEquipmentLocation.keyColumnId = null;
        }
        vm.manageEquipment.locationTypeID = null;
      }
      vm.EquipmentLocationList = [];
      vm.manageEquipment.departmentID = dept ? dept.deptID : vm.manageEquipment.departmentID;
      const listObj = {
        deptID: vm.manageEquipment.departmentID
      };
      return DepartmentFactory.getLocationAddedList().query({ listObj: listObj }).$promise.then((res) => {
        if (res.data) {
          _.each(res.data, (itemData) => {
            vm.EquipmentLocationList.push(itemData.GenericCategory);
          });
          if (vm.manageEquipment.eqpID) {
            initautoCompleteEquipmentLocation();
          };
          vm.autoCompleteEquipmentLocation.addData.routeParams.deptID = vm.manageEquipment.departmentID;
        }
      }).catch((error) =>
        BaseService.getErrorLog(error)
      );
    };
    const getGenericCategoryList = (item) => {
      const GencCategoryType = [];
      GencCategoryType.push(CategoryTypeObjList.EquipmentGroup.Name);
      GencCategoryType.push(CategoryTypeObjList.EquipmentType.Name);
      GencCategoryType.push(CategoryTypeObjList.EquipmentOwnership.Name);
      const listObj = {
        GencCategoryType: GencCategoryType,
        isActive: vm.manageEquipment.eqpID ? true : false
      };
      if (item && item.categoryType === CORE.CategoryType.EquipmentOwnership.Name) {
        if (item && item.gencCategoryName === CORE.EQUIPMENT_OWNERSHIP_TYPE.CUSTOMER) {
          vm.isCustomer = true;
          vm.isLoan = false;
          vm.manageEquipment.bankName = null;
        }
        else if (item && item.gencCategoryName === CORE.EQUIPMENT_OWNERSHIP_TYPE.LOAN) {
          vm.isLoan = true;
          vm.isCustomer = false;
        }
        else {
          vm.isCustomer = false;
          vm.isLoan = false;
          //vm.manageEquipment.placedInServiceDate = null;
          //vm.manageEquipment.outOfServiceDate = null;
          vm.manageEquipment.bankName = null;
        }
      }
      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((genericCategories) => {
        GenericCategoryAllData = genericCategories.data;
        vm.EquipmentGroupList = _.filter(GenericCategoryAllData, (item) =>
          item.parentGencCategoryID === null && item.categoryType === CategoryTypeObjList.EquipmentGroup.Name
        );
        if (vm.autoCompleteEquipmentGroup && vm.autoCompleteEquipmentGroup.keyColumnId) {
          vm.EquipmentSubGroupList = _.filter(GenericCategoryAllData, (item) =>
            item.parentGencCategoryID !== null && item.categoryType === CategoryTypeObjList.EquipmentGroup.Name && item.parentGencCategoryID === vm.autoCompleteEquipmentGroup.keyColumnId
          );
        } else {
          vm.EquipmentSubGroupList = _.filter(GenericCategoryAllData, (item) =>
            item.parentGencCategoryID !== null && item.categoryType === CategoryTypeObjList.EquipmentGroup.Name
          );
        }
        vm.EquipmentTypeList = _.filter(GenericCategoryAllData, (item) =>
          item.parentGencCategoryID === null && item.categoryType === CategoryTypeObjList.EquipmentType.Name
        );
        vm.EquipmentOwnershipTypeList = _.filter(GenericCategoryAllData, (item) =>
          item.parentGencCategoryID === null && item.categoryType === CategoryTypeObjList.EquipmentOwnership.Name
        );

        return $q.resolve(vm.EquipmentTypeList);
      }).catch((error) =>
        BaseService.getErrorLog(error)
      );
    };

    const getCustomerList = () =>
      MasterFactory.getCustomerList().query().$promise.then((customer) => {
        // Added by Vaibhav - For display company name with customer code
        if (customer && customer.data) {
          _.each(customer.data, (item) => {
            item.mfgName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.mfgCode, item.mfgName);
          });
          vm.CustomerList = customer.data;
        }
        return $q.resolve(vm.CustomerList);
      }).catch((error) =>
        BaseService.getErrorLog(error)
      );
    // get all assembly list
    const getPartSearch = (searchObj) =>
      ComponentFactory.getAllAssemblyBySearch().save({
        listObj: searchObj
      }).$promise.then((partList) => {
        if (partList && partList.data && partList.data.data) {
          vm.partSearchList = partList.data.data;
          if (!_.isUndefined(searchObj.id) && searchObj.id !== null) {
            $timeout(() => {
              if (vm.autoCompleteSearchAssy && vm.autoCompleteSearchAssy.inputName) {
                $scope.$broadcast(vm.autoCompleteSearchAssy.inputName, partList.data.data[0]);
              }
            });
          }
        }
        else {
          vm.partSearchList = [];
        }
        return vm.partSearchList;
      }).catch((error) =>
        BaseService.getErrorLog(error)
      );

    vm.fromPlacedInServiceDateChanged = () => {
      var placedInServiceDate = new Date(vm.manageEquipment.placedInServiceDate);
      var outOfServiceDate = new Date(vm.manageEquipment.outOfServiceDate);
      if (placedInServiceDate > outOfServiceDate) {
        vm.manageEquipment.outOfServiceDate = null;
      }
    };

    vm.toOutOfServiceDateChanged = () => {
      var placedInServiceDate = new Date(vm.manageEquipment.placedInServiceDate);
      var outOfServiceDate = new Date(vm.manageEquipment.outOfServiceDate);
      if (placedInServiceDate > outOfServiceDate) {
        vm.manageEquipment.placedInServiceDate = null;
      }
    };

    const selectSubGroup = (item) => {
      if (item && item.gencCategoryID) {
        //SubCategoryList = vm.SubCategoryList;
        vm.EquipmentSubGroupList = _.filter(GenericCategoryAllData, (subItem) =>
          subItem.parentGencCategoryID === item.gencCategoryID && subItem.categoryType === CategoryTypeObjList.EquipmentGroup.Name
        );
        initSubGroupAutoComplete();
      }
      else {
        vm.autoCompleteEquipmentSubGroup.keyColumnId = null;
      }
    };
    function initAutoCompletePromise() {
      var autocompletePromise = [getGenericCategoryList(), getDepartmentList(), getCustomerList(), getEquipmentDetails()];
      vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
        if (vm.manageEquipment.eqpID) {
          if (vm.manageEquipment.assetName) {
            vm.equipmentsuffix = ': ' + vm.manageEquipment.assetName + '(' + vm.manageEquipment.eqpMake + '|' + vm.manageEquipment.eqpModel + '| ' + vm.manageEquipment.eqpYear + '' + ')';
          }
        }
        initAutoComplete();
        if (vm.manageEquipment && vm.manageEquipment.assyId) {
          getPartSearch({ id: vm.manageEquipment.assyId });
        }
        //initialized location auto-complete
        if (!vm.manageEquipment.eqpID) {
          initautoCompleteEquipmentLocation();
        }
      }).catch((error) =>
        BaseService.getErrorLog(error)
      );
    }
    initAutoCompletePromise();
    const initSubGroupAutoComplete = () => {
      vm.autoCompleteEquipmentSubGroup = {
        columnName: 'gencCategoryName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.manageEquipment.eqpSubGroupID ? vm.manageEquipment.eqpSubGroupID : null,
        //parentId: vm.autoCompleteEquipmentGroup.keyColumnId ? vm.autoCompleteEquipmentGroup.keyColumnId : null,
        inputName: CategoryTypeObjList.EquipmentGroup.Name,
        placeholderName: 'Sub Group',
        addData: {
          headerTitle: CORE.CategoryType.EquipmentGroup.Title,
          popupAccessRoutingState: [USER.ADMIN_EQPGROUP_MANAGEGENERICCATEGORY_STATE],
          pageNameAccessLabel: stringFormat(CORE.Manage_PageName_Title_Format, CORE.CategoryType.EquipmentGroup.Title)
        },
        isRequired: false,
        isAddnew: true,
        callbackFn: getGenericCategoryList
      };
    };
    const initAutoComplete = () => {
      vm.autoCompleteEquipmentType = {
        columnName: 'gencCategoryName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.manageEquipment.eqpTypeID ? vm.manageEquipment.eqpTypeID : null,
        inputName: CategoryTypeObjList.EquipmentType.Name,
        placeholderName: 'Type',
        addData: {
          headerTitle: CORE.CategoryType.EquipmentType.Title,
          popupAccessRoutingState: [USER.ADMIN_EQPTYPE_TYPE_MANAGEGENERICCATEGORY_STATE],
          pageNameAccessLabel: stringFormat(CORE.Manage_PageName_Title_Format, CORE.CategoryType.EquipmentType.Title)
        },
        isRequired: false,
        isAddnew: true,
        callbackFn: getGenericCategoryList
      };
      vm.autoCompleteEquipmentGroup = {
        columnName: 'gencCategoryName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.manageEquipment.eqpGroupID ? vm.manageEquipment.eqpGroupID : null,
        inputName: CategoryTypeObjList.EquipmentGroup.Name,
        placeholderName: 'Group',
        addData: {
          headerTitle: CORE.CategoryType.EquipmentGroup.Title,
          popupAccessRoutingState: [USER.ADMIN_EQPGROUP_MANAGEGENERICCATEGORY_STATE],
          pageNameAccessLabel: stringFormat(CORE.Manage_PageName_Title_Format, CORE.CategoryType.EquipmentGroup.Title)
        },
        isRequired: false,
        isAddnew: true,
        callbackFn: getGenericCategoryList,
        onSelectCallbackFn: selectSubGroup
      };

      vm.autoCompleteDepartment = {
        columnName: 'deptName',
        controllerName: USER.ADMIN_DEPARTMENT_ADD_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_DEPARTMENT_ADD_MODAL_VIEW,
        keyColumnName: 'deptID',
        keyColumnId: vm.manageEquipment.departmentID ? vm.manageEquipment.departmentID : null,
        inputName: 'Department',
        placeholderName: 'Department',
        isRequired: false,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_MANAGEDEPARTMENT_DETAIL_STATE],
          pageNameAccessLabel: CORE.LabelConstant.Department.PageName
        },
        isAddnew: true,
        callbackFn: getDepartmentList,
        onSelectCallbackFn: getLocationList
      };
      vm.autoCompleteEquipmentOwnershipType = {
        columnName: 'gencCategoryName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.manageEquipment.eqpOwnershipTypeID ? vm.manageEquipment.eqpOwnershipTypeID : null,
        inputName: CategoryTypeObjList.EquipmentOwnership.Name,
        placeholderName: 'Ownership',
        addData: {
          headerTitle: CORE.CategoryType.EquipmentOwnership.Title,
          popupAccessRoutingState: [USER.ADMIN_EQPOWNER_MANAGEGENERICCATEGORY_STATE],
          pageNameAccessLabel: stringFormat(CORE.Manage_PageName_Title_Format, CORE.CategoryType.EquipmentOwnership.Title)
        },
        isRequired: true,
        isAddnew: true,
        callbackFn: getGenericCategoryList,
        onSelectCallbackFn: getGenericCategoryList
      };
      vm.autoCompleteCustomer = {
        columnName: 'mfgName',
        controllerName: USER.ADMIN_CUSTOMER_ADD_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_CUSTOMER_ADD_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.manageEquipment.customerId ? vm.manageEquipment.customerId : null,
        addData: {
          customerType: CORE.CUSTOMER_TYPE.CUSTOMER, popupAccessRoutingState: [USER.ADMIN_MANAGECUSTOMER_DETAIL_STATE],
          pageNameAccessLabel: CORE.PageName.customer
        },
        inputName: 'Customer',
        placeholderName: 'Customer',
        isRequired: true,
        isAddnew: true,
        callbackFn: getCustomerList
      };
      vm.autoCompleteSearchAssy = {
        columnName: 'PIDCode',
        keyColumnName: 'id',
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        keyColumnId: vm.manageEquipment ? vm.manageEquipment.assyId : null,
        inputName: 'SearchPart',
        placeholderName: 'Type here to search assembly',
        callbackFn: () => {
        },
        isAddnew: true,
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          category: CORE.PartCategory.SubAssembly,
          popupAccessRoutingState: [USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE],
          pageNameAccessLabel: CORE.PageName.part_master
        },
        onSelectCallbackFn: (item) => {
          if (item) {
             vm.selectedMFG = item;
          } else {
            vm.selectedMFG = '';
          }
        },
        onSearchFn: (query) => {
          const searchObj = {
            query: query
          };
          return getPartSearch(searchObj);
        }
      };
      initSubGroupAutoComplete();
    };
    // bind Equipment Location
    const initautoCompleteEquipmentLocation = () => {
      vm.autoCompleteEquipmentLocation = {
        columnName: 'gencCategoryName',
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.manageEquipment.locationTypeID ? vm.manageEquipment.locationTypeID : null,
        inputName: CategoryTypeObjList.LocationType.Name,
        placeholderName: 'Geolocation',
        isRequired: false,
        isAddnew: true,
        callbackFn: getLocationList,
        isAddFromRoute: true,
        routeName: USER.ADMIN_MANAGEDEPARTMENT_LOCATION_STATE,
        addData: {
          routeParams: {
            deptID: vm.autoCompleteDepartment.keyColumnId
          }
        }
      };
    };

    const returnKeyColumnID = (obj) =>
      obj ? (obj.keyColumnId ? obj.keyColumnId : null) : null;

    // update save object equipment
    const updateSaveObj = (equipment) => {
      const newObj = equipment;
      const resultObj = _.pickBy(newObj, (v) => v !== null && v !== undefined);
      return resultObj;
    };

    /* save equipment */
    vm.SaveEquipment = () => {
      vm.isSubmit = false;
      if (!vm.manageEquipmentForm.$valid) {
        BaseService.focusRequiredField(vm.manageEquipmentForm);
        vm.isSubmit = true;
        return;
      }
      if (vm.croppedImage) {
        const filename = vm.originalFileName;
        const originalFileName = filename.substr(0, filename.lastIndexOf('.')) || filename;
        imageName = `${originalFileName}.png`;
        vm.manageEquipment.fileArray = Upload.dataUrltoBlob(vm.croppedImage, imageName);
      }
      let eqpValue = '';
      switch (vm.manageEquipment.equipmentAs) {
        case vm.equipmentRadioButtonValue.Equipment.ID:
          eqpValue = vm.equipmentRadioButtonValue.Equipment.Value;
          break;
        case vm.equipmentRadioButtonValue.Workstation.ID:
          eqpValue = vm.equipmentRadioButtonValue.Workstation.Value;
          break;
        case vm.equipmentRadioButtonValue.Sample.ID:
          eqpValue = vm.equipmentRadioButtonValue.Sample.Value;
          break;
      }
      let equipmentInfo = {
        eqpID: vm.manageEquipment.eqpID ? vm.manageEquipment.eqpID : undefined,
        assetName: vm.manageEquipment.assetName,
        assetNumber: vm.manageEquipment.assetNumber,
        eqpTypeID: returnKeyColumnID(vm.autoCompleteEquipmentType),
        eqpMake: vm.manageEquipment.eqpMake,
        eqpModel: vm.manageEquipment.eqpModel,
        eqpYear: vm.manageEquipment.eqpYear,
        eqpGroupID: returnKeyColumnID(vm.autoCompleteEquipmentGroup),
        eqpSubGroupID: returnKeyColumnID(vm.autoCompleteEquipmentSubGroup),
        eqpOwnershipTypeID: returnKeyColumnID(vm.autoCompleteEquipmentOwnershipType),
        bankName: vm.manageEquipment.bankName,
        customerId: returnKeyColumnID(vm.autoCompleteCustomer),
        //placedInServiceDate: vm.manageEquipment.placedInServiceDate,
        placedInServiceDate: BaseService.getAPIFormatedDate(vm.manageEquipment.placedInServiceDate),
        //outOfServiceDate: vm.manageEquipment.outOfServiceDate,
        outOfServiceDate: BaseService.getAPIFormatedDate(vm.manageEquipment.outOfServiceDate),
        eqpDescription: vm.manageEquipment.eqpDescription,
        isActive: vm.manageEquipment.isActive ? vm.manageEquipment.isActive : false,
        profile: vm.manageEquipment.fileArray,
        profileId: vm.profileId,
        entityID: vm.entityName.ID,
        ownertype: vm.entityName.Name,
        equipmentAs: eqpValue,
        departmentID: returnKeyColumnID(vm.autoCompleteDepartment),
        locationTypeID: returnKeyColumnID(vm.autoCompleteEquipmentLocation),
        macAddress: vm.manageEquipment.macAddress,
        //this value is set for form dirty issue onclick backbutton
        //scheduleComments: vm.manageEquipment.eqpID ? vm.manageEquipment.scheduleComments : defaultValueForUsageTab.scheduleComments,
        scheduleComments: vm.manageEquipment.scheduleComments,
        profileImage: imageName,
        isProfileImageDeleteAction: vm.manageEquipment.eqpID ? isProfileImageDeleteAction : false,
        equipmentSetupMethod: vm.equipmentSetupMethod,
        assyId: vm.autoCompleteSearchAssy.keyColumnId,
        binId: vm.manageEquipment.binId,
        serialNumber: vm.manageEquipment.serialNumber,
        calibrationRequired: (vm.manageEquipment.equipmentAs === vm.equipmentRadioButtonValue.Sample.ID) ? false : vm.manageEquipment.calibrationRequired
      };
      equipmentInfo = updateSaveObj(equipmentInfo);

      if (vm.manageEquipment && vm.manageEquipment.eqpID) {  // update
        const objs = {
          id: equipmentInfo && equipmentInfo.eqpID ? equipmentInfo.eqpID : 0,
          name: equipmentInfo && equipmentInfo.assetName ? equipmentInfo.assetName : null
        };
        EquipmentFactory.checkEquipmentInWarehouse().query({ objs: objs }).$promise.then((res) => {
          if (res && res.data) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.EQUIPMENT_IN_USE);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            return DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                vm.saveDisable = false;
                return;
              }
            }, () => {
              vm.saveDisable = false;
            }).catch((error) => {
              vm.saveDisable = false;
              return BaseService.getErrorLog(error);
            });
            return;
          } else {
            if (vm.manageEquipment.equipmentAs === vm.equipmentRadioButtonValue.Equipment.ID) {
              if (vm.oldEquipmentSetupMethod !== vm.equipmentSetupMethod) {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.DELETE_ALIAS_CONFIRM_MESSAGE);
                const alertModel = {
                  messageContent: messageContent,
                  multiple: true
                };
                return DialogFactory.messageAlertDialog(alertModel).then((yes) => {
                  if (yes) {
                    equipmentUpdate(equipmentInfo);
                  }
                }, () => {
                  vm.saveDisable = false;
                });
              }
              else {
                equipmentUpdate(equipmentInfo);
              }
            }
            else {
              equipmentUpdate(equipmentInfo);
            }
          }
        });
      }
      else { // add new
        vm.cgBusyLoading = Upload.upload({
          url: CORE.API_URL + USER.ADMIN_EQUIPMENT_PATH,
          data: equipmentInfo
        }).then((res) => {
          if (res.data && res.data.data) {
            vm.manageEquipment.eqpID = res.data.data.equipmentData.eqpID;
            vm.manageEquipment.maintenanceType = vm.EquipmentMaintenanceType.Usage; // by default set usage type when create mode
            vm.equipmentsuffix = ': ' + vm.manageEquipment.assetName + '(' + vm.manageEquipment.eqpMake + '|' + vm.manageEquipment.eqpModel + '| ' + vm.manageEquipment.eqpYear + '' + ')';
            if (res.data.data.profileImageData) {
              if (res.data.data.profileImageData.gencFileName.includes('profile')) {
                vm.imagefile = CORE.WEB_URL + USER.EQUIPMENT_BASE_PATH + res.data.data.profileImageData.gencFileName;
                vm.fileName = res.data.data.profileImageData.gencFileName;
                vm.profileId = res.data.data.profileImageData.gencFileID;
                oldimgfile = vm.imagefile;
                vm.manageEquipment.profileImage = res.data.data.profileImageData.gencFileName;
                vm.originalFileName = res.data.data.profileImageData.gencOriginalName;
              }
            } else {
              vm.manageEquipment.profileImage = null;
              vm.imagefile = CORE.WEB_URL + CORE.NO_IMAGE_EQUIPMENT;
              oldimgfile = vm.imagefile;
              vm.originalFileName = '';
            }
            vm.manageEquipment.fileArray = null;
            vm.croppedImage = null;

            $state.transitionTo($state.$current, { eqpID: vm.manageEquipment.eqpID }, { location: true, inherit: true, notify: false });
            vm.manageEquipmentCopy = angular.copy(vm.manageEquipment);
            vm.manageEquipmentForm.$setPristine();
          }
          vm.saveDisable = false;
        }).catch((error) => {
          vm.saveDisable = false;
          return BaseService.getErrorLog(error);
        });
      }
    };
    /*Update equipment*/
    const equipmentUpdate = (equipmentInfo) => {
      vm.cgBusyLoading = Upload.upload({
        url: `${CORE.API_URL}equipment/${vm.manageEquipment.eqpID}`,
        method: 'PUT',
        data: equipmentInfo
      }).then((res) => {
        if (res.data && res.data.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          if (res.data.data.profileImageData) {
            vm.imagefile = CORE.WEB_URL + USER.EQUIPMENT_BASE_PATH + res.data.data.profileImageData.gencFileName;
            vm.manageEquipment.profileImage = res.data.data.profileImageData.gencFileName;
            vm.profileId = res.data.data.profileImageData.gencFileID;
            vm.originalFileName = res.data.data.profileImageData.gencOriginalName;
            oldimgfile = vm.imagefile;
          } else {
            vm.imagefile = CORE.WEB_URL + CORE.NO_IMAGE_EQUIPMENT;
            vm.manageEquipment.profileImage = null;
            vm.profileId = null;
            oldimgfile = vm.imagefile;
            vm.originalFileName = '';
          }
          vm.oldEquipmentSetupMethod = vm.equipmentSetupMethod;
          vm.manageEquipment.fileArray = null;
          vm.croppedImage = null;
          isProfileImageDeleteAction = false;
          vm.manageEquipmentForm.$setPristine();
          vm.manageEquipmentForm.profileImage.$setValidity('pattern', true);
        }
        vm.saveDisable = false;
      }).catch((error) => {
        vm.saveDisable = false;
        return BaseService.getErrorLog(error);
      });
    };

    /* save Equipment MainTenanceSchedule */
    const SaveEquipmentMainTenanceSchedule = () => {
      vm.isSubmit = false;
      if (!vm.equipmentMaintenanceDetailForm.$valid) {
        vm.isSubmit = true;
        return;
      }

      const equipmentMaintenanceScheduleInfo = {};
      equipmentMaintenanceScheduleInfo.maintenanceType = vm.manageEquipment.maintenanceType;
      equipmentMaintenanceScheduleInfo.scheduleModifiedOn = vm.manageEquipment.scheduleAddedOn ? new Date() : vm.manageEquipment.scheduleModifiedOn;
      equipmentMaintenanceScheduleInfo.scheduleAddedOn = vm.manageEquipment.scheduleAddedOn ? vm.manageEquipment.scheduleAddedOn : new Date();
      if (vm.manageEquipment.maintenanceType === vm.EquipmentMaintenanceType.Usage) {
        equipmentMaintenanceScheduleInfo.noOfHours = vm.manageEquipment.noOfHours;
        equipmentMaintenanceScheduleInfo.scheduleComments = vm.manageEquipment.scheduleComments;
      }
      else if (vm.manageEquipment.maintenanceType === vm.EquipmentMaintenanceType.Time) {
        equipmentMaintenanceScheduleInfo.noOfHours = null;
      }


      if (vm.manageEquipment && vm.manageEquipment.eqpID) {
        vm.cgBusyLoading = EquipmentFactory.saveEquipmentMaintenanceSchedule().update({
          id: vm.manageEquipment.eqpID
        }, equipmentMaintenanceScheduleInfo).$promise.then(() => {
          // msWizard.nextStep();
          vm.equipmentMaintenanceDetailForm.$setPristine();
          vm.saveDisable = false;
        }).catch((error) => {
          vm.saveDisable = false;
          return BaseService.getErrorLog(error);
        });
      }
    };


    /* Show save alert popup when performing next and previous*/
    function showWithoutSavingAlertforNextPrevious(msWizard, isSave, isChanged, isPrevious) {
      const selectedIndex = msWizard.selectedIndex;
      if (isSave) {
        if (selectedIndex === vm.equipmentAndWorkstationTabs.Detail.ID) {
          vm.SaveEquipment(msWizard);
        }
        else if (selectedIndex === vm.equipmentAndWorkstationTabs.MaintenanceSchedule.ID) {
          if (vm.manageEquipment.maintenanceType === vm.EquipmentMaintenanceType.Usage) {
            SaveEquipmentMainTenanceSchedule(msWizard);
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
              if (selectedIndex === vm.equipmentAndWorkstationTabs.Detail.ID) {
                getEquipmentDetails();
                initAutoCompletePromise();
                vm.manageEquipmentForm.$setPristine();
              } else if (selectedIndex === vm.equipmentAndWorkstationTabs.MaintenanceSchedule.ID) {
                getEquipmentDetails();
                vm.equipmentMaintenanceDetailForm.$setPristine();
              }
              else if (selectedIndex === vm.equipmentAndWorkstationTabs.OtherDetail.ID) {
                vm.equipmentOtherDetail.$setPristine();
              }
              if (isPrevious) {
                msWizard.previousStep();
              } else {
                msWizard.nextStep();
              }
            }
            vm.saveDisable = false;
          }, () => {
            vm.saveDisable = false;
          }).catch((error) => {
            vm.saveDisable = false;
            return BaseService.getErrorLog(error);
          });
        } else {
          if (isPrevious) {
            msWizard.previousStep();
          } else {
            msWizard.nextStep();
          }
        }
      }
    }
    vm.CheckStepAndAction = (msWizard, isUnique, isSave) => {
      let isChanged = false;
      if (msWizard.selectedIndex === vm.equipmentAndWorkstationTabs.Detail.ID) {
        if (isSave) {
          vm.saveDisable = true;
          if (BaseService.focusRequiredField(vm.manageEquipmentForm)) {
            vm.saveDisable = false;
            return;
          }
        }
        isChanged = BaseService.checkFormDirty(vm.manageEquipmentForm, null);
        showWithoutSavingAlertforNextPrevious(msWizard, isSave, isChanged, false);
      }
      else if (msWizard.selectedIndex === vm.equipmentAndWorkstationTabs.MaintenanceSchedule.ID) {
        if (isSave) {
          vm.saveDisable = true;
          if (BaseService.focusRequiredField(vm.equipmentMaintenanceDetailForm)) {
            vm.saveDisable = false;
            return;
          }
        }
        isChanged = BaseService.checkFormDirty(vm.equipmentMaintenanceDetailForm, null);
        showWithoutSavingAlertforNextPrevious(msWizard, isSave, isChanged, false);
      }
      else if (msWizard.selectedIndex === vm.equipmentAndWorkstationTabs.CalibrationDetails.ID) {
        msWizard.nextStep();
      }
      else if (msWizard.selectedIndex === vm.equipmentAndWorkstationTabs.Document.ID) {
        vm.entitiesAll(true);
        msWizard.nextStep();
      }
      else if (msWizard.selectedIndex === vm.equipmentAndWorkstationTabs.DataFields.ID) {
        msWizard.nextStep();
      }
      else if (msWizard.selectedIndex === vm.equipmentAndWorkstationTabs.OtherDetail.ID) {
        if (isSave) {
          vm.saveDisable = true;
          if (BaseService.focusRequiredField(vm.equipmentOtherDetail)) {
            vm.saveDisable = false;
            return;
          }
        }
        isChanged = BaseService.checkFormDirty(vm.equipmentOtherDetail, null);
        showWithoutSavingAlertforNextPrevious(msWizard, isSave, isChanged, false);
        vm.finish();
      }
    };

    /**
    * Tab Data element - Drag and Drop Data Elements for Equipment
    * retrieve all entities
    */
    vm.entitiesAll = (isDataFieldsTabClick) => {
      vm.SearchAddedListElement = null;
      vm.SearchNoAddedListElement = null;
      vm.cgBusyLoading = EntityFactory.getEntityByName().query({ name: CORE.Entity.Equipment }).$promise.then((res) => {
        if (res && res.data) {
          if (isDataFieldsTabClick) {
            UnSelectAllElement();
          }
          const objEntity = res.data;
          enityElementDetails(objEntity.entityID);
        }
      }).catch((error) =>
        BaseService.getErrorLog(error)
      );
    };

    /* retrieve EntityElement Details for Equipment */
    const enityElementDetails = (entityID) => {
      const objs = {
        id: entityID,
        eqpID: vm.manageEquipment.eqpID
      };
      vm.cgBusyLoading = EquipmentFactory.retrieveEquipmentEntityDataElements().query({ equipmentObj: objs }).$promise.then((res) => {
        if (res && res.data) {
          SubFormElementList = _.remove(res.data, (o) => o.parentDataElementID !== null );
          res.data = _.orderBy(res.data, ['displayOrder'], ['asc']);
          _dataElementAddedList = vm.dataElementAddedList = [];
          _dataElementNoAddedList = vm.dataElementNoAddedList = [];
          _.each(res.data, (itemData) => {
            itemData.icon = _.find(dataelementInputFieldList, (data) =>
              itemData.controlTypeID === data.ID
            );
            itemData.equipmentDataelement = _.first(itemData.equipmentDataelement);
            if (vm.manageEquipment.eqpID) {
              if (itemData.equipmentDataelement) {
                vm.dataElementAddedList.push(itemData);
              }
              else {
                vm.dataElementNoAddedList.push(itemData);
              }
            }
            else {
              vm.dataElementNoAddedList.push(itemData);
            }
          });
          vm.dataElementAddedList = _.orderBy(vm.dataElementAddedList, (e) => e.equipmentDataelement.displayOrder , ['asc']);
          _dataElementAddedList = angular.copy(vm.dataElementAddedList);
          _dataElementNoAddedList = angular.copy(vm.dataElementNoAddedList);

          if (_dataElementAddedList.length === 0 && _dataElementNoAddedList.length === 0) {
            vm.isContainMasterDataField = false;
          }
          else {
            vm.isContainMasterDataField = true;
          }
          setSelectableListItem();
        }
      }).catch((error) =>
        BaseService.getErrorLog(error)
      );
    };


    const setSelectableListItem = () => {
      $timeout(() => {
        SetDataElementSelectable();
      }, _configSelectListTimeout);
    };

    $scope.selectedElementListNoAdded = [];
    $scope.selectedElementListAdded = [];
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
        var sourceModel = ui.item.sortable.model;
        if (ui.item.sortable.droptarget) {
          const sourceTarget = ui.item.sortable.source[0];
          const dropTarget = ui.item.sortable.droptarget[0]; // get drop target element
          const SourceDivAdded = sourceTarget.id.indexOf('NoAdded') > -1 ? false : true;
          const DestinationDivAdded = dropTarget.id.indexOf('NoAdded') > -1 ? false : true;
          if (SourceDivAdded !== DestinationDivAdded) {
            if (SourceDivAdded === false && DestinationDivAdded === true) {
              if ($scope.selectedElementListNoAdded.length === 0) {
                $scope.selectedElementListNoAdded.push(sourceModel);
              }
              vm.ModifyPageAdded('Add', ui.item.sortable.dropindex);
              return;
            }
            else if (SourceDivAdded === true && DestinationDivAdded === false) {
              if ($scope.selectedElementListAdded.length === 0) {
                $scope.selectedElementListAdded.push(sourceModel);
              }
              vm.ModifyPageAdded('Remove');
              return;
            }
          }
          else if (sourceTarget.id === 'dataElementAddedList' && dropTarget.id === 'dataElementAddedList') {
            _dataElementAddedList = [];
            _dataElementAddedList = ui.item.sortable.droptargetModel;
            vm.ModifyPageAdded('InnerSorting');
            return;
          }
        }
      },
      connectWith: '.items-container'
    });
    //#endregion


    //#region reset value of selected element
    function ResetSelectedElement() {
      $scope.selectedElementListNoAdded = [];
      $scope.selectedElementListAdded = [];
      $scope.selectAnyNoAdded = false;
      $scope.selectAnyAdded = false;
    }
    //#endregion

    //#region check for selected element
    function checkSelectAllFlag() {
      $scope.selectAnyNoAdded = $scope.selectedElementListNoAdded.length > 0 ? true : false;
      $scope.selectAnyAdded = $scope.selectedElementListAdded.length > 0 ? true : false;
    }
    //#endregion

    //#region unselect all element list
    function UnSelectAllElement() {
      angular.element('[ui-sortable]#dataElementNoAddedList .dragsortable').removeClass('ui-sortable-selected');
      angular.element('[ui-sortable]#dataElementAddedList .dragsortable').removeClass('ui-sortable-selected');
      ResetSelectedElement();
    }
    //#endregion

    //#region unselect single element list
    function UnSelectElement(unSelectFrom) {
      if (unSelectFrom === 'NoAdded') {
        angular.element('[ui-sortable]#dataElementNoAddedList .dragsortable').removeClass('ui-sortable-selected');
      }
      else {
        angular.element('[ui-sortable]#dataElementAddedList .dragsortable').removeClass('ui-sortable-selected');
      }
      ResetSelectedElement();
    }
    //#endregion

    //#region  set item selectable
    function SetDataElementSelectable() {
      angular.element('[ui-sortable]#dataElementAddedList').on('ui-sortable-selectionschanged', function () {
        UnSelectElement('NoAdded');
        const $this = $(this);
        const selectedItemIndexes = $this.find('.ui-sortable-selected').map(function () {
          return $(this).index();
        }).toArray();
        $scope.selectedElementListAdded = _.map(selectedItemIndexes, (i) =>
         vm.dataElementAddedList[i]
        );
        checkSelectAllFlag();
        $scope.$applyAsync();
      });
      angular.element('[ui-sortable]#dataElementNoAddedList').on('ui-sortable-selectionschanged', function () {
        UnSelectElement('Added');
        const $this = $(this);
        const selectedItemIndexes = $this.find('.ui-sortable-selected').map(function () {
          return $(this).index();
        }).toArray();
        $scope.selectedElementListNoAdded = _.map(selectedItemIndexes, (i) =>
          vm.dataElementNoAddedList[i]
        );
        checkSelectAllFlag();
        $scope.$applyAsync();
      });
    }
    //#endregion

    //#region for destroy selection
    function DestroyDataElementSelection() {
      angular.element('[ui-sortable]#dataElementNoAddedList').off('ui-sortable-selectionschanged');
      angular.element('[ui-sortable]#dataElementAddedList').off('ui-sortable-selectionschanged');
    }

    function DestroyAllSelection() {
      DestroyDataElementSelection();
    }
    //#endregion

    vm.SearchElement = function (list, searchText, IsAdded) {
      if (!searchText) {
        if (IsAdded) {
          vm.SearchAddedListElement = null;
          vm.dataElementAddedList = _dataElementAddedList;
          vm.FilterDataElementAdded = true;
        } else {
          vm.SearchNoAddedListElement = null;
          vm.dataElementNoAddedList = _dataElementNoAddedList;
          vm.FilterDataElementNotAdded = true;
        }
        return;
      }

      if (IsAdded) {
        vm.dataElementAddedList = $filter('filter')(_dataElementAddedList, { dataElementName: searchText });
        vm.FilterDataElementAdded = vm.dataElementAddedList.length > 0;
      }
      else {
        vm.dataElementNoAddedList = $filter('filter')(_dataElementNoAddedList, { dataElementName: searchText });
        vm.FilterDataElementNotAdded = vm.dataElementNoAddedList.length > 0;
      }
    };

    vm.refreshData = () => {
      vm.entitiesAll();
    };

    vm.addData = () => {
      BaseService.goToElementManage(CORE.AllEntityIDS.Equipment.ID);
    };

    //#region modify data element Added based on selection from both list
    vm.ModifyPageAdded = (addType, indexPosition) => {
      const otherInfoForDataFields = {};
      if (addType === 'Add') {
        _.each($scope.selectedElementListNoAdded, (item) => {
          var added = _.find(_dataElementAddedList, (element) =>
            item.dataElementID === element.dataElementID
          );
          if (!added) {
            if (indexPosition !== undefined && indexPosition !== null) {
              _dataElementAddedList.splice(indexPosition, 0, item);
            }
            else {
              _dataElementAddedList.push(item);
            }
            indexPosition++;
          }
        });
        _.each($scope.selectedElementListNoAdded, (item) => {
          _dataElementNoAddedList = _.without(_dataElementNoAddedList,
            _.find(_dataElementNoAddedList, (valItem) =>
              valItem.dataElementID === item.dataElementID
            )
          );
        });
        UnSelectAllElement();
      }
      else if (addType === 'Remove') {
        _.each($scope.selectedElementListAdded, (item) => {
          var added = _.find(_dataElementNoAddedList, (element) =>
            item.dataElementID === element.dataElementID
          );
          if (!added) {
            _dataElementNoAddedList.push(item);
          }
        });
        _.each($scope.selectedElementListAdded, (item) => {
          _dataElementAddedList = _.without(_dataElementAddedList,
            _.find(_dataElementAddedList, (valItem) =>
              valItem.dataElementID === item.dataElementID
            )
          );
        });
        UnSelectAllElement();
      }
      else if (addType === 'AddAll') {
        _.each(vm.dataElementNoAddedList, (item) => {
          var added = _.find(_dataElementAddedList, (element) =>
            item.dataElementID === element.dataElementID
          );
          if (!added) {
            _dataElementAddedList.push(item);
          }
        });
        _.each(_dataElementAddedList, (item) => {
          _dataElementNoAddedList = _.without(_dataElementNoAddedList,
            _.find(_dataElementNoAddedList, (valItem) =>
              valItem.dataElementID === item.dataElementID
            )
          );
        });
        UnSelectAllElement();
      }
      else if (addType === 'RemoveAll') {
        _.each(vm.dataElementAddedList, (item) => {
          var added = _.find(_dataElementNoAddedList, (element) =>
            item.dataElementID === element.dataElementID
          );
          if (!added) {
            _dataElementNoAddedList.push(item);
          }
        });
        _.each(_dataElementNoAddedList, (item) => {
          _dataElementAddedList = _.without(_dataElementAddedList,
            _.find(_dataElementAddedList, (valItem) =>
              valItem.dataElementID === item.dataElementID
            )
          );
        });
        UnSelectAllElement();
      }
      else if (addType === 'InnerSorting') {
        otherInfoForDataFields.isInnerSortingOfElement = true;
        addType = 'AddAll';
      }
      vm.SearchAddedListElement = null;
      vm.SearchNoAddedListElement = null;
      vm.dataElementAddedList = _dataElementAddedList;
      vm.dataElementNoAddedList = _dataElementNoAddedList;
      vm.FilterDataElementAdded = vm.dataElementAddedList.length > 0;
      vm.FilterDataElementNotAdded = vm.dataElementNoAddedList.length > 0;
      SaveEquipmentDataelement(addType, otherInfoForDataFields);
    };
    //#endregion


    /* Save-Update equipment_dataelement */
    const SaveEquipmentDataelement = (OperationTypeToChange, otherInfoForDataFields) => {
      vm.SearchAddedListElement = null;
      vm.SearchNoAddedListElement = null;
      vm.dataElementAddedList = _dataElementAddedList;
      vm.dataElementNoAddedList = _dataElementNoAddedList;
      const saveObj = [];
      let index = 1;
      _.each(_dataElementAddedList, (item) => {
        if (item.dataElementID) {
          const _object = {};
          _object.eqpDataElementID = item.equipmentDataelement ? item.equipmentDataelement.eqpDataElementID : null,
            _object.eqpID = vm.manageEquipment.eqpID,
            _object.dataElementID = item.dataElementID,
            _object.displayOrder = index;
          saveObj.push(_object);
        }
        const subFormElements = _.filter(SubFormElementList, (subFormItem) => subFormItem.parentDataElementID === item.dataElementID);
        if (subFormElements.length > 0) {
          _.each(subFormElements, (subItem) => {
            if (subItem.dataElementID) {
              const eqpDataElementIDOfSubFormItem = _.find(subItem.equipmentDataelement, (subFormEquipElementItem) =>
                subFormEquipElementItem.eqpID === vm.manageEquipment.eqpID && subFormEquipElementItem.dataElementID === subItem.dataElementID
              );
              const _object = {};
              _object.eqpDataElementID = eqpDataElementIDOfSubFormItem ? eqpDataElementIDOfSubFormItem.eqpDataElementID : null,
                _object.eqpID = vm.manageEquipment.eqpID,
                _object.dataElementID = subItem.dataElementID,
                _object.displayOrder = index;
              saveObj.push(_object);
            }
            index++;
          });
        }
        index++;
      });
      const listObj = {
        entityID: vm.entityName.ID,
        eqpID: vm.manageEquipment.eqpID,
        dataElementIDs: saveObj.map((item) =>
          item.dataElementID
        ),
        dataElementList: saveObj,
        isInnerSortingOfElement: otherInfoForDataFields.isInnerSortingOfElement
      };

      /* add new data element with update order of already exists */
      if (OperationTypeToChange === 'Add' || OperationTypeToChange === 'AddAll') {
        vm.cgBusyLoading = EquipmentDataelementFactory.createEquipment_DataElementList().save({ listObj: listObj }).$promise.then(() => {
          setDataAfterSaveOrDeleteDataElement();
        }).catch((error) =>
          BaseService.getErrorLog(error)
        );
      }
      /* delete data_element other than passed from here and update display_order of elements which are passed */
      else {
        vm.cgBusyLoading = EquipmentDataelementFactory.deleteEquipment_DataElementList().save({ listObj: listObj }).$promise.then(() => {
          setDataAfterSaveOrDeleteDataElement();
        }).catch((error) =>
          BaseService.getErrorLog(error)
        );
      }
    };

    const setDataAfterSaveOrDeleteDataElement = () => {
      vm.SearchAddedListElement = null;
      vm.SearchNoAddedListElement = null;
      vm.dataElementAddedList = _dataElementAddedList;
      vm.dataElementNoAddedList = _dataElementNoAddedList;
      vm.entitiesAll(false);
    };

    vm.stateTransfer = (tabName, subTabName) => {
      if ((tabName && tabName !== vm.currentTabName) || (subTabName && subTabName !== vm.currentSubTabName)) {
        switch (tabName) {
          case USER.EquipmentAndWorkstationTabs.Detail.Name:
            $state.go(USER.ADMIN_MANAGEEQUIPMENT_DETAIL_STATE, { eqpID: vm.manageEquipment.eqpID });
            break;
          case USER.EquipmentAndWorkstationTabs.MaintenanceSchedule.Name:
            let subTabNameToTransfer = USER.EquipmentAndWorkstationMaintananceScheduleTabs.Usage.Name;
            if (subTabName && subTabName !== vm.currentSubTabName) {
              subTabNameToTransfer = subTabName;
            }

            if (subTabNameToTransfer !== vm.currentSubTabName) {
              $state.go(USER.ADMIN_MANAGEEQUIPMENT_MAINTENANCE_SCHEDULE_STATE, { eqpID: vm.manageEquipment.eqpID, subTab: subTabNameToTransfer });
            }
            break;
          case USER.EquipmentAndWorkstationTabs.CalibrationDetails.Name:
            $state.go(USER.ADMIN_MANAGEEQUIPMENT_CALIBRATION_DETAIL_STATE, { eqpID: vm.manageEquipment.eqpID });
            break;
          case USER.EquipmentAndWorkstationTabs.Document.Name:
            $state.go(USER.ADMIN_MANAGEEQUIPMENT_DOCUMENTS_STATE, { eqpID: vm.manageEquipment.eqpID });
            break;
          case USER.EquipmentAndWorkstationTabs.DataFields.Name:
            $state.go(USER.ADMIN_MANAGEEQUIPMENT_DATA_FIELDS_STATE, { eqpID: vm.manageEquipment.eqpID });
            break;
          case USER.EquipmentAndWorkstationTabs.OtherDetail.Name:
            $state.go(USER.ADMIN_MANAGEEQUIPMENT_OTHER_STATE, { eqpID: vm.manageEquipment.eqpID });
            break;
          default:
        }
      }
    };

    /* Manually put as load "ViewDataElement directive" only on other details tab   */
    vm.onTabChanges = (TabName, msWizard, subTabName) => {
      msWizard.selectedIndex = vm.selectedTabIndex;
      if (TabName === vm.equipmentAndWorkstationTabs.DataFields.Name) {
        vm.refreshData();
      }
      vm.stateTransfer(TabName, subTabName);
      $('#content').animate({ scrollTop: 0 }, 200);
    };

    /*To save other value detail
       Note:If any step added after other detail just remove function body and add logic of last step
    */
    vm.fileList = {};
    vm.finish = () => {
      const dynamicControlList = DataElementTransactionValueFactory.getDataElementTransactionList(vm.dataElementList);
      DataElementTransactionValueFactory.saveTransctionValue({
        referenceTransID: vm.manageEquipment.eqpID,
        entityID: vm.entityID,
        dataElementList: dynamicControlList.dataElementList,
        removeElementList: dynamicControlList.removeElementList,
        subFormTransList: dynamicControlList.subFormTransList,
        deletedsubFormTransIDs: dynamicControlList.deletedsubFormTransIDs,
        removeSubFormTransListConditional: dynamicControlList.removeSubFormTransListConditional
      }, vm.fileList).then(() => {
        // commented as per last discussion on 18/09/2018, no need to move to list will press back button
        //$state.go(USER.ADMIN_EQUIPMENT_STATE);

        // Display success message of each field if assigned on validation options
        DataElementTransactionValueFactory.displaySuccessMessage(dynamicControlList.dataElementList);
        vm.equipmentOtherDetail.$setPristine();

        /* code for rebinding document to download - (actually all other details) */
        //if (vm.fileList && !_.isEmpty(vm.fileList)) {
        vm.fileList = {};
        vm.currentTabName = null;
        $timeout(() => {
          vm.currentTabName = vm.equipmentAndWorkstationTabs.OtherDetail.Name;
        }, 0);
        //}
        vm.saveDisable = false;
      }).catch((error) => {
        vm.saveDisable = false;
        return BaseService.getErrorLog(error);
      });
    };

    /* Open equipment task popup  */
    vm.addTask = (itemEquipmentTask, ev) => {
      const data = {
        eqpTaskID: itemEquipmentTask ? itemEquipmentTask.eqpTaskID : null,
        eqpID: vm.manageEquipment ? vm.manageEquipment.eqpID : null,
        eqpTask: itemEquipmentTask ? itemEquipmentTask : null
      };
      const taskData = angular.copy(data);
      DialogFactory.dialogService(
        USER.ADMIN_EQUIPMENT_MANAGETASK_MODAL_CONTROLLER,
        USER.ADMIN_EQUIPMENT_MANAGETASK_MODAL_VIEW,
        ev,
        taskData).then(() => {
        }, (val) => {
          if (val) {
            getEquipmentDetails(vm.selectedTabIndexForScheduleType);
          }
        }, (err) =>
          BaseService.getErrorLog(err)
        );
    };

    /* Open maintenance schedule task document popup  */
    vm.manageScheduleTaskDocument = (eqpTask, ev) => {
      vm.trnsId = eqpTask.eqpTaskID;
      const data = {
        eqpTaskID: eqpTask.eqpTaskID,
        Isprofile: false,
        eqpTaskDescription: eqpTask.taskDetail
      };

      DialogFactory.dialogService(
        USER.ADMIN_EQUIPMENT_PREVIEW_TASKDOCUMENTS_MODAL_CONTROLLER,
        USER.ADMIN_EQUIPMENT_PREVIEW_TASKDOCUMENTS_MODAL_VIEW,
        ev,
        data).then(() => {
        }, (val) => {
          if (val) {
            getEquipmentDetails(vm.selectedTabIndexForScheduleType);
          }
        }, (err) =>
          BaseService.getErrorLog(err)
        );
    };

    /* Open maintenance schedule popup  */
    vm.openSchedulePopup = (ev, repeatsType, itemETS) => {
      const data = {
        repeatsType: repeatsType,
        TaskSchedule: itemETS,
        Iseditable: true
      };

      DialogFactory.dialogService(
        USER.ADMIN_EQUIPMENT_MAINTENANCESCHEDULE_MODAL_CONTROLLER,
        USER.ADMIN_EQUIPMENT_MAINTENANCESCHEDULE_MODAL_VIEW,
        ev,
        data).then(() => {
        }, (val) => {
          if (val) {
            getEquipmentDetails(vm.selectedTabIndexForScheduleType);
          }
        }, () => {

        });
    };

    /* delete schedule task (for maintenance type - time) */
    vm.deleteEquipmentScheduleTask = (row) => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
      messageContent.message = stringFormat(messageContent.message, 'Equipment, Workstation & Sample schedule task', 1);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          vm.cgBusyLoading = EquipmentTaskFactory.equipmentTask().delete({
            id: row.eqpTaskID,
            isPermanentDelete: IsPermanentDelete
          }).$promise.then(() => {
            getEquipmentDetails(vm.selectedTabIndexForScheduleType);
          }).catch((error) =>
            BaseService.getErrorLog(error)
          );
        }
      }, () => {
      }).catch((error) =>
        BaseService.getErrorLog(error)
      );
    };

    vm.onInnerTabChangesOfScheduleType = (MaintenanceType) => {
      if (vm.selectedTabIndexForScheduleType === vm.equipmentAndWorkstationMaintananceScheduleTabs.Usage.ID) {
        vm.equipmentMaintenanceDetailForm.$setPristine();
        vm.equipmentMaintenanceDetailForm.$setUntouched();
        vm.manageEquipment.maintenanceType = MaintenanceType;
      }
      else {
        vm.isInnerStepForValidForMaintanceSchedule(MaintenanceType);
      }
    };

    vm.refreshMaintenanceScheduleData = () => {
      getEquipmentDetails();
    };

    /* fun to check form dirty on tab change */
    vm.isStepValid = function (step) {
      switch (step) {
        case 0: {
          const isDirty = BaseService.checkFormDirty(vm.manageEquipmentForm, null);
          if (isDirty) {
            return showWithoutSavingAlertforTabChange(step);
          }
          else {
            break;
          }
        }
        case 1: {
          const isDirty = BaseService.checkFormDirty(vm.equipmentMaintenanceDetailForm, null);
          if (isDirty) {
            return showWithoutSavingAlertforTabChange(step);
          }
          else {
            return true;
          }
          break;
        }
        case 4: {
          const isDirty = vm.equipmentOtherDetail.$dirty;
          if (isDirty) {
            return showWithoutSavingAlertforTabChange(step);
          }

          else {
            return true;
          }
          break;
        }
      }
    };

    /* fun to check form dirty on inner tab change for maintenance schedule */
    vm.isInnerStepForValidForMaintanceSchedule = function (MaintenanceType) {
      switch (vm.selectedTabIndexForScheduleType) {
        case vm.equipmentAndWorkstationMaintananceScheduleTabs.Usage.ID: {
          const isDirty = BaseService.checkFormDirty(vm.equipmentMaintenanceDetailForm, null);
          if (isDirty) {
            return showWithoutSavingAlertforMCInnerTabChange(vm.selectedTabIndexForScheduleType, MaintenanceType);
          }
          return true;
          break;
        }
        case vm.equipmentAndWorkstationMaintananceScheduleTabs.Time.ID: {
          const isDirty = BaseService.checkFormDirty(vm.equipmentMaintenanceDetailForm, null);
          if (isDirty) {
            const requestedTabIndexForScheduleType = vm.selectedTabIndexForScheduleType;
            vm.selectedTabIndexForScheduleType = vm.equipmentAndWorkstationMaintananceScheduleTabs.Usage.ID;
            return showWithoutSavingAlertforMCInnerTabChange(requestedTabIndexForScheduleType, MaintenanceType);
          }
          else {
            vm.manageEquipment.maintenanceType = MaintenanceType;
          }
          getEquipmentDetails(vm.selectedTabIndexForScheduleType);
          return true;
          break;
        }
        default:
          return true;
          break;
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
          if (step === vm.equipmentAndWorkstationTabs.Detail.ID) {
            getEquipmentDetails();
            vm.manageEquipmentForm.$setPristine();
            return true;
          } else if (step === vm.equipmentAndWorkstationTabs.MaintenanceSchedule.ID) {
            getEquipmentDetails();
            vm.equipmentMaintenanceDetailForm.$setPristine();
            return true;
          } else if (step === vm.equipmentAndWorkstationTabs.OtherDetail.ID) {
            vm.equipmentOtherDetail.$setPristine();
            return true;
          }
        }
      }, () => {
      }).catch((error) =>
        BaseService.getErrorLog(error)
      );
    }

    /* Show save alert popup when performing tab change for Maintenance schedule*/
    function showWithoutSavingAlertforMCInnerTabChange(requestedTab, MaintenanceType) {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      return DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          vm.isSave = false;
          switch (requestedTab) {
            case vm.equipmentAndWorkstationMaintananceScheduleTabs.Usage.ID:
              vm.equipmentMaintenanceDetailForm.$setPristine();
              break;
            case vm.equipmentAndWorkstationMaintananceScheduleTabs.Time.ID:
              vm.selectedTabIndexForScheduleType = requestedTab;
              vm.manageEquipment.maintenanceType = MaintenanceType;
              getEquipmentDetails(vm.selectedTabIndexForScheduleType);
              vm.equipmentMaintenanceDetailForm.$setPristine();
              return true;
              break;
          }
        }
      }, () => {
      }).catch((error) =>
        BaseService.getErrorLog(error)
      );
    }

    function setTabWisePageRights(pageList) {
      if (pageList && pageList.length > 0) {
        let tab = pageList.filter((a) => a.PageDetails !== null && a.PageDetails.pageRoute === USER.ADMIN_MANAGEEQUIPMENT_DETAIL_STATE);
        if (tab && tab.length > 0 && tab[0].isActive) {
          vm.pageTabRights.Detail = true;
        }
        tab = pageList.filter((a) => a.PageDetails !== null && a.PageDetails.pageRoute === USER.ADMIN_MANAGEEQUIPMENT_MAINTENANCE_SCHEDULE_STATE);
        if (tab && tab.length > 0 && tab[0].isActive) {
          vm.pageTabRights.MaintenanceSchedule = true;
        }
        tab = pageList.filter((a) => a.PageDetails !== null && a.PageDetails.pageRoute === USER.ADMIN_MANAGEEQUIPMENT_CALIBRATION_DETAIL_STATE);
        if (tab && tab.length > 0 && tab[0].isActive) {
          vm.pageTabRights.CalibrationDetails = true;
        }
        tab = pageList.filter((a) => a.PageDetails !== null && a.PageDetails.pageRoute === USER.ADMIN_MANAGEEQUIPMENT_DOCUMENTS_STATE);
        if (tab && tab.length > 0 && tab[0].isActive) {
          vm.pageTabRights.Document = true;
        }
        tab = pageList.filter((a) => a.PageDetails !== null && a.PageDetails.pageRoute === USER.ADMIN_MANAGEEQUIPMENT_DATA_FIELDS_STATE);
        if (tab && tab.length > 0 && tab[0].isActive) {
          vm.pageTabRights.DataFields = true;
        }
        tab = pageList.filter((a) => a.PageDetails !== null && a.PageDetails.pageRoute === USER.ADMIN_MANAGEEQUIPMENT_OTHER_STATE);
        if (tab && tab.length > 0 && tab[0].isActive) {
          vm.pageTabRights.OtherDetail = true;
        }
      }
    }
    $timeout(() => {
      $scope.$on(USER.LoginUserPageListBroadcast, (event, data) => {
        var menudata = data;
        setTabWisePageRights(menudata);
        $scope.$applyAsync();
      });
    });

    if (BaseService.loginUserPageList && BaseService.loginUserPageList.length > 0) {
      setTabWisePageRights(BaseService.loginUserPageList);
    }

    //Redirect to equipment type master
    vm.goToEquipmentTypeList = () => {
      BaseService.openInNew(USER.ADMIN_GENERICCATEGORY_EQPTYPE_STATE, {});
    };
    //Redirect to equipment group master
    vm.goToEquipmentGroupList = () => {
      BaseService.openInNew(USER.ADMIN_GENERICCATEGORY_EQPGROUP_STATE, {});
    };
    //Redirect to equipment group master
    vm.goToEquipmentSubGroupList = () => {
      BaseService.openInNew(USER.ADMIN_GENERICCATEGORY_EQPGROUP_STATE, {});
    };
    //Redirect to equipment ownership type master
    vm.goToEquipmentOwnershipTypeList = () => {
      BaseService.openInNew(USER.ADMIN_GENERICCATEGORY_EQPOWNER_STATE, {});
    };
    //Redirect to department master
    vm.goToDepartmentList = () => {
      BaseService.openInNew(USER.ADMIN_DEPARTMENT_STATE, {});
    };
    //Redirect to location master
    vm.goToLocationList = () => {
      BaseService.openInNew(USER.ADMIN_GENERICCATEGORY_LOCATIONTYPE_STATE, {});
    };
    //Redirect to Customer master
    vm.goToCustomerList = () => {
      BaseService.goToCustomerList();
    };
    //Get component master
    vm.goToMFGPartList = () => {
      BaseService.openInNew(USER.ADMIN_MFG_COMPONENT_STATE, {});
    };

    //Get manufacturer master
    vm.gotoManufacturerList = () => {
      BaseService.goToManufacturerList();
    };

    // Redirected to Update Manufacturer
    vm.goToManufacturerDetail = () => {
      BaseService.goToManufacturer(vm.selectedMFG.mfgCodeID);
    };

    vm.getMaxLengthValidation = (maxLength, enterTextLength) =>
      BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    //check equipments and workstations name Already Exists
    vm.checkEquipmentAndWorkstationNameAlreadyExists = () => {
      vm.nameExists = null;
      let eqpValue = '';
      switch (vm.manageEquipment.equipmentAs) {
        case vm.equipmentRadioButtonValue.Equipment.ID:
          eqpValue = vm.equipmentRadioButtonValue.Equipment.Value;
          break;
        case vm.equipmentRadioButtonValue.Workstation.ID:
          eqpValue = vm.equipmentRadioButtonValue.Workstation.Value;
          break;
        case vm.equipmentRadioButtonValue.Sample.ID:
          eqpValue = vm.equipmentRadioButtonValue.Sample.Value;
          break;
      }
      if (vm.manageEquipment && vm.manageEquipment.assetName) {
        const objs = {
          eqpID: vm.manageEquipment.eqpID ? vm.manageEquipment.eqpID : undefined,
          assetName: vm.manageEquipment.assetName,
          equipmentAs: eqpValue
        };
        vm.cgBusyLoading = EquipmentFactory.checkEquipmentAndWorkstationNameAlreadyExists().query({ objs: objs }).$promise.then((res) => {
          if (res.errors) {
            vm.manageEquipment.assetName = null;
            /*Set focus on first enabled field after user click Ok button*/
            if (checkResponseHasCallBackFunctionPromise(res)) {
              res.alretCallbackFn.then(() => {
                setFocusByName('assetName');
              });
            }
          }
        }).catch((error) =>
          BaseService.getErrorLog(error)
        );
      }
    };
    //null macAddress and placedInServiceDate input filed when it's disable
    vm.equipmentworkStationChange = (equipmentAs) => {
      vm.manageEquipment.placedInServiceDate = (equipmentAs && equipmentAs === vm.equipmentRadioButtonValue.Equipment.ID) ? vm.manageEquipment.placedInServiceDate : null;
      vm.manageEquipment.macAddress = (equipmentAs && equipmentAs === vm.equipmentRadioButtonValue.Workstation.ID) ? vm.manageEquipment.macAddress : null;
      if (!equipmentAs || equipmentAs !== vm.equipmentRadioButtonValue.Sample.ID) {
        if (vm.autoCompleteSearchAssy) {
          $scope.$broadcast(vm.autoCompleteSearchAssy.inputName, null);
        }
      }
      //Check only for Add time, because edit time we are not allowing to change type Equipment, Workstation or Sample
      if (!vm.manageEquipment || !vm.manageEquipment.eqpID) {
        vm.checkEquipmentAndWorkstationNameAlreadyExists();
      }
    };
    //delete image
    vm.deleteImage = () => {
      vm.manageEquipmentForm.$$controls[0].$setDirty();
      if (vm.manageEquipment.profileImage || vm.imagefile) {
        vm.croppedImage = null;
        vm.manageEquipment.fileArray = '';
        vm.manageEquipment.profileImage = null;
        vm.imagefile = null;
        oldimgfile = '';
        vm.imagefile = CORE.WEB_URL + CORE.NO_IMAGE_EQUIPMENT;
        isProfileImageDeleteAction = true;
        vm.originalFileName = '';
      }
    };
    vm.cancel = () => {
      vm.croppedImage = null;
      vm.manageEquipment.fileArray = '';
      vm.manageEquipment.profileImage = null;
      vm.imagefile = null;
      oldimgfile = '';
      $mdDialog.cancel();
    };
    /* called for max date validation */
    vm.getMaxDateValidation = (FromDateLabel, ToDateLabel) =>
      BaseService.getMaxDateValidation(FromDateLabel, ToDateLabel);

    /* called for min date validation */
    vm.getMinDateValidation = (FromDateLabel, ToDateLabel) =>
      BaseService.getMinDateValidation(FromDateLabel, ToDateLabel);

    vm.getMinDateValidationEquipmentDate = (FromDateLabel) => {
      const str = getCompareDateLabel();
      return vm.getMinDateValidation(FromDateLabel, str);
    };
    const getCompareDateLabel = () => {
      let str = 'Today Date';
      if (vm.manageEquipment.placedInServiceDate
        && vm.manageEquipmentForm.outOfServiceDate
        && vm.manageEquipmentForm.outOfServiceDate.$viewValue
        && new Date(vm.manageEquipmentForm.outOfServiceDate.$viewValue) < new Date(vm.manageEquipment.placedInServiceDate)) {
        str = 'Placed In Service Date';
      }
      return str;
    };

    //Set mindate value onchange in Placed In Service Date
    vm.onChangePlacedInServiceDate = (outOfServiceDate) => {
      if (vm.manageEquipment.placedInServiceDate) {
        vm.manageEquipment.outOfServiceDateOptions = {
          minDate: vm.manageEquipment.eqpID ? vm.manageEquipment.placedInServiceDate : (vm.manageEquipment.placedInServiceDate ? ((vm.outOfServiceDateOptions.minDate > vm.todayDate) ? vm.manageEquipment.placedInServiceDate : vm.todayDate) : vm.todayDate),
          appendToBody: true
        };
        if (new Date(vm.manageEquipment.placedInServiceDate) > new Date(outOfServiceDate)) {
          vm.manageEquipment.outOfServiceDate = null;
        }
        if (!outOfServiceDate) {
          vm.manageEquipment.outOfServiceDate = null;
        }
      } else {
        vm.manageEquipment.outOfServiceDateOptions = {
          minDate: new Date(vm.todayDate),
          appendToBody: true
        };
      }
    };

    //#region On change of tab
    $scope.$on('$destroy',  () => {
      DestroyAllSelection();
      $mdDialog.hide(false, { closeAll: true });
    });
    //#endregion
    /*Add form on load*/
    angular.element(() => {
      switch (vm.currentTabName) {
        case vm.equipmentAndWorkstationTabs.Detail.Name:
          vm.manageEquipmentForm.$setPristine();
          BaseService.currentPageForms = [vm.manageEquipmentForm];
          break;
        case vm.equipmentAndWorkstationTabs.MaintenanceSchedule.Name:
          vm.equipmentMaintenanceDetailForm.$setPristine();
          vm.equipmentMaintenanceDetailForm.$setUntouched();
          BaseService.currentPageForms = [vm.equipmentMaintenanceDetailForm];
          break;
        case vm.equipmentAndWorkstationTabs.CalibrationDetails.Name:
          BaseService.currentPageForms = [vm.equipmentCalibrationDetailsForm];
          break;
        case vm.equipmentAndWorkstationTabs.Document.Name:
          BaseService.currentPageForms = [vm.equipmentDocument];
          break;
        case vm.equipmentAndWorkstationTabs.DataFields.Name:
          BaseService.currentPageForms = [vm.EquipmentDataFields];
          break;
        case vm.equipmentAndWorkstationTabs.OtherDetail.Name:
          BaseService.currentPageForms = [vm.equipmentOtherDetail];
          break;
      }
    });
    /*Used to redirect on warehouse list page*/
    vm.goToWarehouseList = () => {
      BaseService.openInNew(TRANSACTION.TRANSACTION_WAREHOUSE_STATE);
    };
    /*Used to open warehouse popup*/
    vm.openWarehousePopUp = (ev) => {
      vm.DisableAddWarehouse = true;
      const data = { generateWarehouse: false, warehouseType: vm.warehouseType, eqpID: vm.manageEquipment.eqpID, isFromEquipmentMasterPage: true }; //equipmentDetail.eqpID
      DialogFactory.dialogService(
        TRANSACTION.TRANSACTION_MANAGEWAREHOUSE_CONTROLLER,
        TRANSACTION.TRANSACTION_MANAGEWAREHOUSE_VIEW,
        ev,
        data).then(() => {
          vm.DisableAddWarehouse = false;
        }, (data) => {
          /*Need to add in cancel because cancel method is init from the the child page on hide dialogue */
          if (data) {
            vm.manageEquipment.warehouseMst = data;
          }
          vm.DisableAddWarehouse = false;
        }, (err) => {
          vm.DisableAddWarehouse = false;
          return BaseService.getErrorLog(err);
        });
    };

    vm.addEquipmentAndWorkstation = () => {
      $state.go(USER.ADMIN_MANAGEEQUIPMENT_DETAIL_STATE, { eqpID: null });
    };

    /* called for max length validation - editor */
    vm.getDescrLengthValidation = (maxLength, enterTextData) => {
      const entertext = htmlToPlaintext(enterTextData);
      return BaseService.getDescrLengthValidation(maxLength, entertext.length);
    };

    const htmlToPlaintext = (text) =>
      text ? String(text).replace(/<[^>]+>/gm, '') : '';

    vm.getLocationBinDetail = () => {
      if (vm.manageEquipment.bin) {
        vm.manageEquipment.binId = null;
        BinFactory.getBinDetailByName().query({ name: vm.manageEquipment.bin }).$promise.then((response) => {
          if (response && response.data) {
            vm.manageEquipment.binId = response.data.id;
            vm.manageEquipment.bin = response.data.Name;
            vm.manageEquipment.warehouse = response.data.warehousemst.Name;
            vm.manageEquipment.parentWarehouse = response.data.warehousemst.parentWarehouseMst.Name;
          }
          else {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SCAN_VALID_BIN);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                vm.manageEquipment.binId = vm.manageEquipment.bin = vm.manageEquipment.warehouse = vm.manageEquipment.parentWarehouse = null;
                setFocusByName('binName');
              }
            }).catch((error) =>
              BaseService.getErrorLog(error)
            );
          }
        }).catch((error) =>
          BaseService.getErrorLog(error)
        );
      } else {
        vm.manageEquipment.binId = vm.manageEquipment.bin = vm.manageEquipment.warehouse = vm.manageEquipment.parentWarehouse = null;
      }
    };

    vm.scanBin = ($event, isEnter) => {
      $timeout(() => {
        if (isEnter) {
          if ($event.keyCode === 13) {
            $event.preventDefault(); $event.stopPropagation();
            if (vm.manageEquipment.bin) {
              setFocusByName(vm.autoCompleteEquipmentType.inputName);
            }
          }
        } else {
          vm.getLocationBinDetail($event);
        }
      });
      /** Prevent enter key submit event */
      preventInputEnterKeyEvent($event);
    };

    /* go to data element manage page */
    vm.goToElementManage = (entityID, dataElementID) => {
      BaseService.goToElementManage(entityID, dataElementID);
    };
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };
    vm.goToBinList = () => {
      BaseService.openInNew(TRANSACTION.TRANSACTION_BIN_STATE, {});
    };
    vm.goToWHList = () => {
      BaseService.openInNew(TRANSACTION.TRANSACTION_WAREHOUSE_STATE, {});
    };
  }
})();
