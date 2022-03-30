(function () {
  'use strict';

  angular
    .module('app.admin.calibrationdetails')
    .controller('AddUpdateCalibrationDetailsPopupController', AddUpdateCalibrationDetailsPopupController);

  /** @ngInject */
  function AddUpdateCalibrationDetailsPopupController($scope, $mdDialog, $timeout, data, $q, CORE, USER, BaseService, DialogFactory, CalibrationDetailsFactory, EquipmentFactory, DepartmentFactory, NotificationFactory) {
    const vm = this;
    const CategoryTypeObjList = angular.copy(CORE.CategoryType);

    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.BUTTON_TYPE = CORE.POPUP_FOOTER_BUTTON;
    vm.taToolbar = CORE.Toolbar;
    vm.id = (data && data.id) ? data.id : undefined;
    vm.eqpId = (data && data.eqpId) ? data.eqpId : undefined;
    vm.equipmentAs = (data && data.equipmentAs) ? data.equipmentAs : undefined;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.headerdata = [];

    vm.RadioGroup = {
      isActive: {
        array: CORE.ActiveRadioGroup
      },
      equipmentAs: {
        array: CORE.EquipmentRadioGroup.equipmentAs
      }
    };
    vm.equipmentRadioButtonValue = CORE.EquipmentRadioButtonValue;
    vm.calibrationDetails = {
      equipmentAs: vm.equipmentAs ? vm.equipmentAs : vm.equipmentRadioButtonValue.Equipment.ID,
      calibrationType: 1,
      refEqpID: vm.eqpId,
      name: null,
      make: null,
      model: null,
      wanum: null,
      mfrSNum: null,
      location: null,
      description: null
    };

    vm.calibrationTypeList = CORE.CalibrationType;
    vm.calibrationDateOptions = {
      calibrationDateOpenFlag: false
    };
    vm.calibrationExpirationDateOptions = {
      calibrationExpirationDateOpenFlag: false
    };

    //Redirect to department master
    vm.goToDepartmentList = () => {
      BaseService.openInNew(USER.ADMIN_DEPARTMENT_STATE, {});
    };
    //Redirect to location master
    vm.goToLocationList = () => {
      BaseService.openInNew(USER.ADMIN_GENERICCATEGORY_LOCATIONTYPE_STATE, {});
    };

    /* called for max length validation - editor */
    vm.getDescrLengthValidation = (maxLength, enterTextData) => {
      const entertext = htmlToPlaintext(enterTextData);
      return BaseService.getDescrLengthValidation(maxLength, entertext.length);
    };

    // get calibtaion details based on id
    vm.getCalibrationDetails = () => {
      if (vm.id) {
        return CalibrationDetailsFactory.calibrationdetails().query({
          id: vm.id
        }).$promise.then((response) => {
          if (response && response.data) {
            //_.each(response.data, (item) => {
            //  if (item.equipment) {
            //    //item.equipmentAs = item.equipment.equipmentAs;
            //    item.assetNameWithDetail = stringFormat('{0} | {1} | {2}', item.equipment.assetName, item.equipment.eqpMake, item.equipment.eqpModel );
            //  }
            //});
            if (response.data.equipment) {
              switch (response.data.equipment.equipmentAs) {
                case vm.equipmentRadioButtonValue.Equipment.Value:
                  response.data.equipmentAs = vm.equipmentRadioButtonValue.Equipment.ID;
                  break;
                case vm.equipmentRadioButtonValue.Workstation.Value:
                  response.data.equipmentAs = vm.equipmentRadioButtonValue.Workstation.ID;
                  break;
              }
              if (response.data.equipment.isActive) {
                response.data.equipmentActiveStatusValue = 'Active';
              } else {
                response.data.equipmentActiveStatusValue = 'Inactive';
              }
              response.data.equipmentActiveStatus = response.data.equipment.isActive;
            }
            response.data.calibrationDate = response.data.calibrationDate ? BaseService.getUIFormatedDate(response.data.calibrationDate, vm.DefaultDateFormat) : response.data.calibrationDate;
            response.data.calibrationExpirationDate = response.data.calibrationExpirationDate ? BaseService.getUIFormatedDate(response.data.calibrationExpirationDate, vm.DefaultDateFormat) : response.data.calibrationExpirationDate;
            vm.calibrationDetails = response.data;
          }
          return $q.resolve(vm.calibrationDetails);
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    // get all assembly list
    const getEquipmentSearch = (searchObj) => EquipmentFactory.getequipmentBySearch().query({
      listObj: searchObj
    }).$promise.then((equipmentList) => {
      if (equipmentList && equipmentList.data) {
        _.each(equipmentList.data, (item) => {
          item.assetNameWithDetail = stringFormat('{0} | {1} | {2}', item.assetName, item.eqpMake, item.eqpModel);
          if (item.isActive) {
            item.equipmentActiveStatusValue = 'Active';
          } else {
            item.equipmentActiveStatusValue = 'Inactive';
          }
          item.equipmentActiveStatus = item.isActive;
        });
        vm.eqpSearchList = equipmentList.data;
        if (searchObj.eqpID) {
          $timeout(() => {
            if (vm.autoCompleteSearchEquipment && vm.autoCompleteSearchEquipment.inputName) {
              $scope.$broadcast(vm.autoCompleteSearchEquipment.inputName, equipmentList.data[0]);
            }
          });
        }
      } else {
        vm.eqpSearchList = [];
      }
      return vm.eqpSearchList;
    }).catch((error) => BaseService.getErrorLog(error));

    /* Department drop-down list */
    const getDepartmentList = () => {
      DepartmentFactory.getAllDepartment().query().$promise.then((departments) => {
        if (departments && departments.data) {
          vm.DepartmentList = departments.data;
          return $q.resolve(vm.DepartmentList);
        }
      }).catch((error) =>
        BaseService.getErrorLog(error)
      );
    };
    getDepartmentList();

    /* Location drop-down list*/
    const getLocationList = () => {
      vm.locationList = [];
      const listObj = {
        deptID: vm.calibrationDetails.departmentID
      };
      return DepartmentFactory.getLocationAddedList().query({ listObj: listObj }).$promise.then((res) => {
        if (res && res.data) {
          _.each(res.data, (itemData) => {
            vm.locationList.push(itemData.GenericCategory);
          });
          const location = _.find(vm.locationList, (item) => item.gencCategoryID === vm.calibrationDetails.locationTypeID);
          vm.calibrationDetails.locationName = location ? location.gencCategoryName : null;
        }
      }).catch((error) =>
        BaseService.getErrorLog(error)
      );
    };

    /*Autocomplete for location */
    const getLocationAutocomplete = () => {
      /* Location autocomplete*/
      vm.autoCompleteLocation = {
        columnName: 'gencCategoryName',
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.calibrationDetails.locationTypeID ? vm.calibrationDetails.locationTypeID : null,
        inputName: CategoryTypeObjList.LocationType.Name,
        placeholderName: null,
        isRequired: false,
        callbackFn: getLocationList,
        isAddFromRoute: true,
        routeName: USER.ADMIN_MANAGEDEPARTMENT_LOCATION_STATE
      };
    };

    const initAutoComplete = () => {
      vm.autoCompleteSearchEquipment = {
        columnName: 'assetNameWithDetail',
        keyColumnName: 'eqpID',
        controllerName: USER.ADMIN_EQUIPMENT_ADD_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_EQUIPMENT_ADD_MODAL_VIEW,
        keyColumnId: vm.calibrationDetails ? vm.calibrationDetails.refEqpID : null,
        inputName: 'Equipment',
        placeholderName: 'Type here to search Equipment',
        callbackFn: (item) => {
          if (item) {
            if (item.data && item.data.equipmentData) {
              item.data.equipmentData.assetNameWithDetail = stringFormat('{0} | {1} | {2}', item.data.equipmentData.assetName, item.data.equipmentData.eqpMake, item.data.equipmentData.eqpModel);
              vm.autoCompleteSearchEquipment.keyColumnId = item.data.equipmentData.eqpID ? item.data.equipmentData.eqpID : null;
              $scope.$broadcast(vm.autoCompleteSearchEquipment.inputName, item.data.equipmentData);
            } else {
              item.assetNameWithDetail = stringFormat('{0} | {1} | {2}', item.assetName, item.eqpMake, item.eqpModel);
              vm.autoCompleteSearchEquipment.keyColumnId = item.eqpID ? item.eqpID : null;
              $scope.$broadcast(vm.autoCompleteSearchEquipment.inputName, item);
            }
          }
          else {
            vm.autoCompleteSearchEquipment.keyColumnId = null;
            $scope.$broadcast(vm.autoCompleteSearchEquipment.inputName, null);
          }
        },
        isAddnew: true,
        addData: {
          Title: ((vm.equipmentRadioButtonValue.Workstation.ID === vm.calibrationDetails.equipmentAs) ? CORE.EquipmentAndWorkstation_Title.Workstation : CORE.EquipmentAndWorkstation_Title.Equipment),
          isCalibrationRequired: true,
          popupAccessRoutingState: [USER.ADMIN_MANAGEEQUIPMENT_STATE],
          pageNameAccessLabel: CORE.PageName.equipments
        },
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.calibrationDetails.ID = item.eqpID;
            vm.calibrationDetails.name = item.assetName;
            vm.calibrationDetails.make = item.eqpMake;
            vm.calibrationDetails.model = item.eqpModel;
            vm.calibrationDetails.wanum = item.assetNumber;
            vm.calibrationDetails.mfrSNum = item.serialNumber;
            vm.calibrationDetails.locationTypeID = item.locationTypeID ? item.locationTypeID : null;
            vm.calibrationDetails.description = item.eqpDescription;
            if (item.departmentID) {
              vm.calibrationDetails.departmentID = item.departmentID;
              const department = _.find(vm.DepartmentList, (item) => item.deptID === vm.calibrationDetails.departmentID);
              vm.calibrationDetails.departmentName = department ? department.deptName : null;
              if (vm.calibrationDetails.departmentID) { getLocationList(); }
            }
            vm.calibrationDetails.equipmentActiveStatus = item.isActive;
            if (!item.equipmentActiveStatusValue) {
              if (item.isActive) {
                item.equipmentActiveStatusValue = 'Active';
              } else {
                item.equipmentActiveStatusValue = 'Inactive';
              }
            }
            vm.calibrationDetails.equipmentActiveStatusValue = item.equipmentActiveStatusValue;
          }
          else {
            vm.calibrationDetails.ID = null;
            vm.calibrationDetails.name = null;
            vm.calibrationDetails.make = null;
            vm.calibrationDetails.model = null;
            vm.calibrationDetails.wanum = null;
            vm.calibrationDetails.mfrSNum = null;
            vm.calibrationDetails.locationTypeID = null;
            vm.calibrationDetails.description = null;
            vm.calibrationDetails.departmentName = null;
            vm.calibrationDetails.locationName = null;
            vm.calibrationDetails.equipmentActiveStatusValue = null;
            vm.calibrationDetails.equipmentActiveStatus = null;
          }

          /* go To Specific Equipment */
          const goToEquipment = (param) => {
            if (param && param.equpID) {
              { BaseService.goToManageEquipmentWorkstation(param.equpID); }
            }
          };

          vm.headerdata = [{
            value: vm.calibrationDetails.name,
            valueLinkFn: goToEquipment,
            valueLinkFnParams: { equpID: vm.calibrationDetails.ID },
            label: 'Name',
            displayOrder: 1
          }];
        },
        onSearchFn: (query) => {
          const searchObj = {
            query: query,
            equipmentAs: vm.selectedEquipmentAs,
            active: true
          };
          return getEquipmentSearch(searchObj);
        }
      };
      vm.autoCompleteCalibrationType = {
        columnName: 'value',
        keyColumnName: 'id',
        keyColumnId: vm.calibrationDetails.calibrationType ? vm.calibrationDetails.calibrationType : null,
        inputName: 'Calibration Type',
        placeholderName: 'Calibration Type',
        isRequired: false,
        isAddnew: false
      };

      /* Department autocomplete*/
      vm.autoCompleteDepartment = {
        columnName: 'deptName',
        controllerName: USER.ADMIN_DEPARTMENT_ADD_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_DEPARTMENT_ADD_MODAL_VIEW,
        keyColumnName: 'deptID',
        keyColumnId: vm.calibrationDetails.departmentID ? vm.calibrationDetails.departmentID : null,
        inputName: 'Department',
        placeholderName: null,
        isRequired: false,
        callbackFn: getDepartmentList,
        onSelectCallbackFn: getLocationAutocomplete
      };
    };
    initAutoComplete();

    function initAutoCompletePromise() {
      var autocompletePromise = [vm.getCalibrationDetails()];
      vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
        if (vm.calibrationDetails && vm.calibrationDetails.refEqpID) {
          getEquipmentSearch({ eqpID: vm.calibrationDetails.refEqpID });
        }
        vm.autoCompleteCalibrationType.keyColumnId = vm.calibrationDetails.calibrationType;
        vm.equipmentAsChange(vm.calibrationDetails.equipmentAs);
        $timeout(() => {
          BaseService.focusOnFirstEnabledField(vm.calibrationDetailsForm);
        }, _configTimeout);
      }).catch((error) => BaseService.getErrorLog(error));
    }
    initAutoCompletePromise();

    vm.save = (saveType) => {
      vm.saveDisable = true;
      const isdirty = vm.checkFormDirty(vm.calibrationDetailsForm);
      //if (vm.calibrationDetailsForm.$invalid) {
      //  BaseService.focusRequiredField(vm.calibrationDetailsForm);
      //  vm.saveDisable = false;
      //  return;
      //}
      if (BaseService.focusRequiredField(vm.calibrationDetailsForm)) {
        if (!vm.checkFormDirty(vm.calibrationDetailsForm) && saveType === vm.BUTTON_TYPE.SAVEANDEXIT) {
          BaseService.currentPagePopupForm.pop();
          $mdDialog.cancel();
        }
        vm.saveDisable = false;
        return;
      }
      if (!isdirty) {
        if (saveType === vm.BUTTON_TYPE.SAVEANDEXIT) {
          BaseService.currentPagePopupForm.pop();
          DialogFactory.hideDialogPopup();
        }
        else {
          NotificationFactory.information(vm.CORE_MESSAGE_CONSTANT.NO_CHANGES_MADE);
        }
      }
      else {
        const calibrationDetailsObj = {
          id: vm.calibrationDetails.id,
          refEqpID: vm.autoCompleteSearchEquipment.keyColumnId,
          calibrationType: vm.autoCompleteCalibrationType.keyColumnId,
          calibrationDate: (BaseService.getAPIFormatedDate(vm.calibrationDetails.calibrationDate)),
          calibrationExpirationDate: (BaseService.getAPIFormatedDate(vm.calibrationDetails.calibrationExpirationDate)),
          calibrationComments: vm.calibrationDetails.calibrationComments
        };

        if (vm.calibrationDetails && vm.calibrationDetails.id) {
          vm.cgBusyLoading = CalibrationDetailsFactory.calibrationdetails().update({
            id: vm.id
          }, calibrationDetailsObj).$promise.then((response) => {
            if (response && response.data) {
              if (saveType === vm.BUTTON_TYPE.SAVEANDEXIT) {
                BaseService.currentPagePopupForm.pop();
                DialogFactory.hideDialogPopup();
              }
              else {
                vm.pageSet();
              }
              $timeout(() => {
                vm.saveDisable = false;
              }, 700);
            }
            else if (response && response.errors) {
              if (checkResponseHasCallBackFunctionPromise(response)) {
                response.alretCallbackFn.then(() => {
                  BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.calibrationDetailsForm);
                });
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
        else {
          vm.cgBusyLoading = CalibrationDetailsFactory.calibrationdetails().save(calibrationDetailsObj).$promise.then((response) => {
            if (response && response.data) {
              vm.calibrationDetails.id = response.data.id;
              if (saveType === vm.BUTTON_TYPE.SAVEANDEXIT) {
                BaseService.currentPagePopupForm.pop();
                DialogFactory.hideDialogPopup();
              }
              else {
                vm.pageSet();
              }
              $timeout(() => {
                vm.saveDisable = false;
              }, 700);
            }
            else if (response && response.errors) {
              if (checkResponseHasCallBackFunctionPromise(response)) {
                response.alretCallbackFn.then(() => {
                  BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.calibrationDetailsForm);
                });
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    vm.calibrationDateChanged = () => {
      vm.calibrationDateOptions = {
        calibrationDateOpenFlag: false
      };
      if (vm.calibrationDetails.calibrationDate) {
        vm.minExpirationDate = angular.copy(vm.calibrationDetails.calibrationDate);
        vm.minExpirationDate = new Date(vm.minExpirationDate.setDate(vm.minExpirationDate.getDate() + 1));
        vm.calibrationDetails.calibrationExpirationDate = undefined;
      }
    };

    vm.calibrationExpirationDateChanged = () => {
      vm.calibrationExpirationDateOptions = {
        calibrationExpirationDateOpenFlag: false
      };
    };

    vm.equipmentAsChange = (equipmentAs) => {
      if (equipmentAs) {
        vm.calibrationDetails.name = null,
          vm.calibrationDetails.make = null,
          vm.calibrationDetails.model = null,
          vm.calibrationDetails.wanum = null,
          vm.calibrationDetails.mfrSNum = null,
          vm.calibrationDetails.location = null,
          vm.calibrationDetails.description = null;

        $scope.$broadcast(vm.autoCompleteSearchEquipment.inputName, null);
        vm.selectedEquipmentAs = '';
        switch (equipmentAs) {
          case vm.equipmentRadioButtonValue.Equipment.ID:
            vm.selectedEquipmentAs = vm.equipmentRadioButtonValue.Equipment.Value;
            break;
          case vm.equipmentRadioButtonValue.Workstation.ID:
            vm.selectedEquipmentAs = vm.equipmentRadioButtonValue.Workstation.Value;
            break;
        }
        if (vm.autoCompleteSearchEquipment) {
          vm.autoCompleteSearchEquipment.addData.Title = ((vm.equipmentRadioButtonValue.Workstation.ID === vm.calibrationDetails.equipmentAs) ? CORE.EquipmentAndWorkstation_Title.Workstation : CORE.EquipmentAndWorkstation_Title.Equipment);
        }
      }
      else {
        vm.selectedEquipmentAs = undefined;
      }
    };

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.calibrationDetailsForm);
      if (isdirty) {
        const data = {
          form: vm.calibrationDetailsForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        DialogFactory.closeDialogPopup();
      }
    };

    /* reset pageForm  */
    vm.pageSet = () => {
      $timeout(() => {
        vm.calibrationDetailsForm.$setPristine();
        vm.calibrationDetailsForm.dirty = false;
      }, 1000);
    };

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    vm.getMinDateValidation = () => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.CALIBRATION_DATE_AND_CALIBRATION_EXPIRATION_DATE_VALIDATION);
      return messageContent.message;
    };
    //go to equipment page list
    vm.goToEquipmentList = () => {
      BaseService.goToEquipmentWorkstationList();
      return false;
    };

    //check load
    angular.element(() => {
      focusOnFirstEnabledFormField(vm.calibrationDetailsForm);
    });
  }
})();
