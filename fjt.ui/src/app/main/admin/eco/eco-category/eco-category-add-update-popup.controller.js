(function () {
  'use strict';

  angular
    .module('app.admin.eco')
    .controller('ECOCategoryAddUpdatePopupController', ECOCategoryAddUpdatePopupController)

  /** @ngInject */

  function ECOCategoryAddUpdatePopupController(CORE, ECOFactory, data, $mdDialog, BaseService, $q, $timeout, DialogFactory) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.isSubmit = false;
    vm.EcoCategoryModel = null;
    vm.EcoCategoryModel = angular.copy(data);
    vm.ecoTypeCatID = null;
    vm.categoryArray = CORE.CategoryTypeLabel;
    vm.categoryLabel = _.find(vm.categoryArray, function (item) { return item.id == data.categoryType }).value;
    vm.categoryType = data.categoryType ? data.categoryType : null;
    if (data && data.Name) {
      vm.EcoCategoryModel.name = data.Name;
    }
    if (data && data.ecoTypeCatID) {
      vm.ecoTypeCatID = data.ecoTypeCatID;
    }
    $timeout(() => {
      if (!vm.ecoTypeCatID && vm.EcoCategoryModel.name) {
        vm.AddEcoDfmCategoryForm.$dirty = true;
      }
      if (vm.ecoTypeCatID && vm.AddEcoDfmCategoryForm) {
        BaseService.checkFormValid(vm.AddEcoDfmCategoryForm, false);
      }
    }, 0);

    const ecoCategoryTemplete = {
      name: null,
      displayOrder: null,
      multiSelect: false
    }

    //Save or update defect list
    vm.updateEcoCategoryValue = () => {
      vm.isSubmit = false;
      var lst = vm.EcoCategoryModel;
      if (BaseService.focusRequiredField(vm.AddEcoDfmCategoryForm)) {
        return;
      }
      if (!vm.AddEcoDfmCategoryForm.$valid) {
        BaseService.focusRequiredField(vm.AddEcoDfmCategoryForm);
        vm.isSubmit = true;
        return;
      }
      //if (vm.AddECOCategoryValueForm.$dirty) {
      const ecoCategoryInfo = {
        name: vm.EcoCategoryModel.name,
        displayOrder: vm.EcoCategoryModel.displayOrder,
        ecoTypeCatID: vm.ecoTypeCatID,
        category: vm.categoryType ? vm.categoryType : vm.categoryType,
        multiSelect: vm.EcoCategoryModel.multiSelect
      };
      if (data && data.ecoTypeCatID) {
        vm.cgBusyLoading = ECOFactory.ECOCategory().update({
          ecoTypeCatID: data.ecoTypeCatID
        }, ecoCategoryInfo).$promise.then((data) => {
          if (data && data.data) {
            BaseService.currentPagePopupForm.pop();
            $mdDialog.hide();
          } else {
            if (checkResponseHasCallBackFunctionPromise(data)) {
              data.alretCallbackFn.then(() => {
                BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.AddEcoDfmCategoryForm);
              });
            }
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
      else {
        vm.cgBusyLoading = ECOFactory.ECOCategory().save(ecoCategoryInfo).$promise.then((res) => {
          if (res) {
            if (res.data && res.data.ecoTypeCatID) {
              BaseService.currentPagePopupForm.pop();
              $mdDialog.hide(res.data);
            } else {
              if (res.errors && res.erors.data && res.errors.data.fieldName) {
                //check for existing defect list
                let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.UNIQUE_CONFIRM_MESSAGE);
                messageContent.message = stringFormat(messageContent.message, res.data.fieldName)
                let obj = {
                  messageContent: messageContent,
                  btnText: CORE.MESSAGE_CONSTANT.BUTTON_CREATENEW_TEXT,
                  canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                };
                DialogFactory.messageConfirmDialog(obj).then((yes) => {
                  if (yes)
                    vm.updateEcoCategoryValue(false);
                }, (cancel) => {
                }).catch((error) => {
                  return BaseService.getErrorLog(error);
                });
              }
            }
          } else {
            if (checkResponseHasCallBackFunctionPromise(res)) {
              res.alretCallbackFn.then(() => {
                BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.AddEcoDfmCategoryForm);
              });
            }
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
      //} else {
      //    BaseService.currentPagePopupForm.pop();
      //    $mdDialog.cancel();
      //}
    };

    vm.cleardefectList = () => {
      vm.EcoCategoryModel = Object.assign({}, ecoCategoryTemplete);
    };

    if (!vm.EcoCategoryModel)
      vm.cleardefectList();

    vm.cancel = () => {
      let isdirty = vm.checkFormDirty(vm.AddEcoDfmCategoryForm);
      if (isdirty) {
        let data = {
          form: vm.AddEcoDfmCategoryForm
        }
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        vm.cleardefectList();
        $mdDialog.cancel();
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      let checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    }
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    }
    //check ECO category Already Exists
    vm.checkEcoCategoryAlreadyExists = () => {
      if (vm.EcoCategoryModel && vm.EcoCategoryModel.name) {
        let objs = {
          ecoTypeCatID: vm.EcoCategoryModel.ecoTypeCatID,
          name: vm.EcoCategoryModel.name,
          category: vm.categoryType
        };
        vm.cgBusyLoading = ECOFactory.checkEcoCategoryAlreadyExists().query({ objs: objs }).$promise.then((res) => {
          if (res && res.status == CORE.ApiResponseTypeStatus.FAILED) {
            if (checkResponseHasCallBackFunctionPromise(res)) {
              res.alretCallbackFn.then(() => {
                setFocus('name');
              });
            }
            vm.EcoCategoryModel.name = null;
          }
          //if (res && res.errors)
          //vm.EcoCategoryModel.name = null;
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
    }
    //Set as current form when page loaded
    angular.element(() => {
      //check load
      BaseService.currentPagePopupForm.push(vm.AddEcoDfmCategoryForm);
    });
  }
})();
