(function () {
  'use strict';
  angular
    .module('app.admin.rfqsetting')
    .controller('ManageCostCategoryPopupController', ManageCostCategoryPopupController);
  /** @ngInject */
  function ManageCostCategoryPopupController($mdDialog, data, CORE, RFQSettingFactory, BaseService, DialogFactory) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.BUTTON_TYPE = CORE.POPUP_FOOTER_BUTTON;
    vm.taToolbar = CORE.Toolbar;
    vm.pageInit = (data) => {
      vm.costCategoryModel = {
        id: data ? data.id : null,
        categoryName: data && data.Name ? data.Name : data && data.categoryName ? data.categoryName : null,
        from: data ? data.from : null,
        to: data ? data.to : null
      };
    };
    vm.pageInit(data);

    vm.saveAndProceed = (buttonCategory, data) => {
      if (data) {
        vm.data = data;
      }
      if (buttonCategory === vm.BUTTON_TYPE.SAVE) {
        vm.AddCostCategoryForm.$setPristine();
        vm.pageInit(data);
      } else if (buttonCategory === vm.BUTTON_TYPE.ADDNEW) {
        const isdirty = vm.checkFormDirty(vm.AddCostCategoryForm);
        if (isdirty) {
          const data = {
            form: vm.AddCostCategoryForm
          };
          const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_RESET_BODY_MESSAGE);
          const obj = {
            messageContent: messgaeContent,
            btnText: CORE.MESSAGE_CONSTANT.RESET_POPUP_BUTTON,
            canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
          };
          DialogFactory.messageConfirmDialog(obj).then(() => {
            if (data) {
              vm.pageInit(data);
              vm.AddCostCategoryForm.$setPristine();
            }
          }, () => {
          }, (error) => BaseService.getErrorLog(error));
        } else {
          vm.pageInit(data);
          vm.AddCostCategoryForm.$setPristine();
        }
      } else if (buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel(vm.data);
      }
      setFocusByName('categoryName');
    };

    if (vm.costCategoryModel.id) {
      vm.cgBusyLoading = RFQSettingFactory.retriveCostCategory().query({
        id: vm.costCategoryModel.id
      }).$promise.then((response) => {
        if (response && response.data) {
          vm.costCategoryModel.categoryName = response.data.categoryName;
          vm.costCategoryModel.from = response.data.from;
          vm.costCategoryModel.to = response.data.to;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    vm.saveCostCategory = (buttonCategory) => {
      if (BaseService.focusRequiredField(vm.AddCostCategoryForm)) {
        if (vm.costCategoryModel.id && !vm.checkFormDirty(vm.AddCostCategoryForm) && buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
          $mdDialog.cancel(vm.data);
        }
        return;
      }
      if (vm.AddCostCategoryForm.$invalid) {
        BaseService.focusRequiredField(vm.AddCostCategoryForm);
        return;
      }
      if (!vm.isblurevent) {
        vm.cgBusyLoading = RFQSettingFactory.costCategory().save(vm.costCategoryModel).$promise.then((res) => {
          if (res.data) {
            if (res.data.id) {
              vm.saveAndProceed(buttonCategory, res.data);
            }
          } else {
            if (checkResponseHasCallBackFunctionPromise(res)) {
              res.alretCallbackFn.then(() => {
                BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.AddCostCategoryForm);
              });
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.AddCostCategoryForm);
      if (isdirty) {
        const data = {
          form: vm.AddCostCategoryForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel(true);
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };
    vm.min = 0;
    //return mininum value for to dollar
    vm.getMin = () => {
      vm.min = parseFloat((vm.costCategoryModel.from + 0.000001).toFixed(6));
    };

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    //check unique category name
    vm.uniqueCategoryName = () => {
      vm.isblurevent = true;
      if (vm.costCategoryModel.categoryName) {
        const categoryObjName = {
          id: vm.costCategoryModel.id,
          categoryName: vm.costCategoryModel.categoryName
        };
        RFQSettingFactory.checkUniqueCostCategory().query({ categoryObj: categoryObjName }).$promise.then((res) => {
          vm.isblurevent = false;
          if (res.status === 'FAILED') {
            if (checkResponseHasCallBackFunctionPromise(res)) {
              res.alretCallbackFn.then(() => {
                setFocus('categoryName');
              });
            }
            vm.costCategoryModel.categoryName = null;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    //manage form for dirty
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.AddCostCategoryForm);
    });
  }
})();
