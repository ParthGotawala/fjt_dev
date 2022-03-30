(function () {
  'use strict';

  angular
    .module('app.admin.defectCategory')
    .controller('AddDefectCategoryPopupController', AddDefectCategoryPopupController);

  /** @ngInject */
  function AddDefectCategoryPopupController($mdDialog, data, CORE, Upload, USER, DialogFactory, DefectCategoryFactory, $filter, BaseService) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.isSubmit = false;
    vm.defectCategory = {};
    //const GenericCategoryAllData = [];
    vm.defectCategory.defectcatName = data ? data.Name : null;
    vm.isSaveDisable = false;
    /* create employee */
    vm.saveDefectCategory = () => {
      vm.isSaveDisable = true;
      vm.isSubmit = false;
      if (!vm.defectCategoryForm.$valid) {
        vm.isSubmit = true;
        BaseService.focusRequiredField(vm.defectCategoryForm);
        return;
      }
      if (vm.defectCategoryForm.$dirty) {
        const defectCategoryInfo = {
          defectcatName: vm.defectCategory.defectcatName,
          order: vm.defectCategory.order
        };

        DefectCategoryFactory.DefectCategory().save(defectCategoryInfo).$promise.then((res) => {
          if (res) {
            if (res.data && res.data.defectCatId) {
              BaseService.currentPagePopupForm.pop();
              $mdDialog.cancel(res.data);
            } else {
              if (res.errors) {
                if (checkResponseHasCallBackFunctionPromise(res)) {
                  res.alretCallbackFn.then(() => {
                    vm.isSaveDisable = false;
                    BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.defectCategoryForm);
                  });
                }
              }
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.defectCategoryForm);
      if (isdirty) {
        const data = {
          form: vm.defectCategoryForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };

    /* called for max length validation */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);


    // Function call on Defect category name blue event and check code exist or not
    vm.checkDuplicateDefectCategoryName = () => {
      if (vm.defectCategory && vm.defectCategory.defectcatName) {
        vm.cgBusyLoading = DefectCategoryFactory.checkDuplicateDefectCategoryName().save(vm.defectCategory).$promise.then((res) => {
          vm.cgBusyLoading = false;
          if (res && res.errors && res.status == CORE.ApiResponseTypeStatus.FAILED && res.errors.data && res.errors.data.isDuplicateDefectCategorytName) {
            vm.defectCategory.defectcatName = null;
            if (checkResponseHasCallBackFunctionPromise(res)) {
              res.alretCallbackFn.then(() => {
                setFocusByName('defectcatName');
              });
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    //on load submit form
    angular.element(() => {
      //check load
      BaseService.currentPagePopupForm.push(vm.defectCategoryForm);
    });
  }
})();

