(function () {
  'use strict';
  angular
    .module('app.admin.unit')
    .controller('ManageMeasurementTypesPopupController', ManageMeasurementTypesPopupController);
  /** @ngInject */
  function ManageMeasurementTypesPopupController($mdDialog, data, USER, CORE, BaseService, UnitFactory, DialogFactory) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.radioButtonGroup = {
      isActive: {
        array: USER.EmployeeRadioGroup.isActive
      }
    };
    vm.themeClass = CORE.THEME;
    vm.BUTTON_TYPE = CORE.POPUP_FOOTER_BUTTON;

    vm.pageInit = (data) => {
      vm.measurementTypeModel = {
        id: data ? data.id : null,
        name: data && data.name ? data.name : data && data.Name ? data.Name : null,
        displayOrder: data ? data.displayOrder : null,
        isActive: data ? data.isActive : true,
        systemGenerated: data ? data.systemGenerated : false
      };
      vm.copyActive = (vm.measurementTypeModel.isActive);
    };
    vm.pageInit(data);

    vm.saveAndProceed = (buttonCategory, data) => {
      if (data) {
        vm.data = data;
      }
      if (buttonCategory === vm.BUTTON_TYPE.SAVE) {
        vm.AddMeasurementTypesForm.$setPristine();
        vm.pageInit(data);
      } else if (buttonCategory === vm.BUTTON_TYPE.ADDNEW) {
        const isdirty = vm.checkFormDirty(vm.AddMeasurementTypesForm);
        if (isdirty) {
          const data = {
            form: vm.AddMeasurementTypesForm
          };
          const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_RESET_BODY_MESSAGE);
          const obj = {
            messageContent: messgaeContent,
            btnText: CORE.MESSAGE_CONSTANT.RESET_POPUP_BUTTON,
            canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
          };
          DialogFactory.messageConfirmDialog(obj).then(() => {
            if (data) {
              vm.pageInit();
              vm.AddMeasurementTypesForm.$setPristine();
            }
          }, () => {
          }, (error) => BaseService.getErrorLog(error));
        } else {
          vm.pageInit();
          vm.AddMeasurementTypesForm.$setPristine();
        }
      } else if (buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel(vm.data);
      }
      setFocusByName('name');
    };

    if (vm.measurementTypeModel.id || vm.measurementTypeModel.id === 0) {
      vm.cgBusyLoading = UnitFactory.retriveMeasurementType().query({
        id: vm.measurementTypeModel.id
      }).$promise.then((response) => {
        if (response && response.data) {
          vm.pageInit(response.data);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    vm.saveMeasurementType = (buttonCategory) => {
      if (BaseService.focusRequiredField(vm.AddMeasurementTypesForm)) {
        if (vm.measurementTypeModel.id && !vm.checkFormDirty(vm.AddMeasurementTypesForm) && buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
          $mdDialog.cancel(vm.data);
        }
        return;
      }
      if (vm.measurementTypeModel.id && vm.copyActive !== vm.measurementTypeModel.isActive) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.STATUS_CHANGE_CONFIRMATION);
        messageContent.message = stringFormat(messageContent.message, vm.copyActive ? 'Active' : 'Inactive', vm.measurementTypeModel.isActive ? 'Active' : 'Inactive');
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            saveMeasermentType(buttonCategory);
          }
        }, () => {
        });
      } else { saveMeasermentType(buttonCategory); }
    };

    // save measerment type
    const saveMeasermentType = (buttonCategory) => {
      vm.cgBusyLoading = UnitFactory.measurementType().save(vm.measurementTypeModel).$promise.then((res) => {
        if (res.data && res.data.id) {
          vm.saveAndProceed(buttonCategory, res.data);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.AddMeasurementTypesForm);
      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        $mdDialog.cancel(vm.data);
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
  }
})();
