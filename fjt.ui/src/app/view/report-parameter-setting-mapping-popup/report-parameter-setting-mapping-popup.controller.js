(function () {
  'use strict';

  angular
    .module('app.reports.dynamicreports')
    .controller('ReportParameterSettingMappingPopupController', ReportParameterSettingMappingPopupController);

  /** @ngInject */
  function ReportParameterSettingMappingPopupController($scope, $mdDialog, data, CORE, ReportMasterFactory, BaseService) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.minLengthMessage = CORE.MESSAGE_CONSTANT.MIN_LENGTH_MESSAGE;
    if (data) {
      vm.copyActive = angular.copy(data.isActive);
    }
    vm.isSubmit = false;
    vm.reportModel = {};
    vm.dateRangeObj = [];
    vm.parameterList = [];
    vm.reportModel = angular.copy(data.entity);
    vm.fromDateDbColumn = CORE.ReportParameterFilterDbColumnName.FromDate;
    vm.toDateDbColumn = CORE.ReportParameterFilterDbColumnName.ToDate;

    // Retrieve Report Parameter setting list
    vm.reportParameterSettingList = () => {
      vm.cgBusyLoading = ReportMasterFactory.retriveParameterSettings({ id: vm.reportModel.id }).query().$promise.then((response) => {
        if (response && response.status && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          vm.parameterList = response.data;
          const maximumDisplayOrder = Math.max.apply(vm.parameterList, vm.parameterList.map((o) => o.displayOrder));
          const dateRange = {
            displayName: 'Duration',
            inputType: 'dateRange',
            isSelected: false,
            displayOrder: maximumDisplayOrder + 2
          };

          _.each(vm.parameterList, (parameter) => {
            parameter.displayOrder = parameter.displayOrder ? parameter.displayOrder : maximumDisplayOrder + 1;
            if (parameter.dbColumnName === vm.fromDateDbColumn || parameter.dbColumnName === vm.toDateDbColumn) {
              parameter.displayOrder = parameter.dbColumnName === vm.fromDateDbColumn ? -1 : -2;
              if (parameter.reportMasterParameters.length > 0) {
                dateRange.isSelected = true;
                dateRange.isRequired = parameter.reportMasterParameters[0].isRequired;
              }
              vm.dateRangeObj.push(parameter);
            }
            if (parameter.reportMasterParameters.length > 0) {
              parameter.isSelected = true;
              parameter.isRequired = parameter.reportMasterParameters[0].isRequired;
            } else {
              parameter.isSelected = false;
            }
          });
          _.each(vm.dateRangeObj, (item) => {
            vm.parameterList.splice(vm.parameterList.indexOf(item), 1);
          });
          vm.parameterList.push(dateRange);
          vm.dateRangeObj.push(dateRange);
          vm.selectParameter();  // If All parameters are selected then check 'Select All' CheckBox on popup open.
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    vm.reportParameterSettingList();

    //save or update Report Parameter Settings
    vm.saveReportParameterSettings = () => {
      vm.isSubmit = false;
      if (BaseService.focusRequiredField(vm.manageReportParameterForm)) {
        vm.isSubmit = true;
        return;
      }
      if (!vm.manageReportParameterForm.$valid) {
        BaseService.focusRequiredField(vm.manageReportParameterForm);
        vm.isSubmit = true;
        return;
      }
      const parameterModel = { id: vm.reportModel.id };
      const parameterList = [];
      _.forEach(vm.parameterList, (data) => {
        if (data.id) {
          parameterList.push({ parameterId: data.id, isSelected: data.isSelected, isRequired: data.isRequired });
        }
      });
      const dateRange = _.find(vm.dateRangeObj, (item) => item.inputType === 'dateRange');
      _.forEach(vm.dateRangeObj, (data) => {
        if (data.dbColumnName === vm.fromDateDbColumn || data.dbColumnName === vm.toDateDbColumn) {
          parameterList.push({ parameterId: data.id, isSelected: dateRange.isSelected, isRequired: dateRange.isRequired });
        }
      });
      parameterModel.parameterList = parameterList;
      vm.cgBusyLoading = ReportMasterFactory.saveReportParameterSettings().save(parameterModel).$promise.then((response) => {
        if (response && response.data) {
          BaseService.currentPagePopupForm = [];
          $mdDialog.hide(response.data);
        }
      }).catch((error) => {
        vm.clickCancel = false;
        BaseService.getErrorLog(error);
      });
    };

    vm.cancel = () => {
      // Check vm.isChange flag for color picker dirty object
      const isdirty = vm.checkFormDirty(vm.manageReportParameterForm, vm.checkDirtyObject);
      if (isdirty) {
        const data = {
          form: vm.manageReportParameterForm
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
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    // Select/De-select all Parameter
    vm.selectAll = () => {
      vm.parameterList.forEach((item) => {
        item.isSelected = vm.isSelectAll;
        // item.isSelected = item.isHiddenParameter ? item.isSelected : vm.isSelectAll;
      });
    };

    // On Select Parameter update 'All Select' checkbox value
    vm.selectParameter = () => {
      var isAnyNotSeleted = vm.parameterList.some((item) => item.isSelected === false);
      vm.isSelectAll = isAnyNotSeleted ? false : true;
    };

    //on load submit form
    angular.element(() => {
      //check load
      BaseService.currentPagePopupForm.push(vm.manageReportParameterForm);
    });
  }
})();
