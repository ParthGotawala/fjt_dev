(function () {
  'use strict';

  angular
    .module('app.admin.eco')
    .controller('ECOCategoryValueAddUpdatePopupController', ECOCategoryValueAddUpdatePopupController)

  /** @ngInject */

  function ECOCategoryValueAddUpdatePopupController(USER, $stateParams, CORE, ECOFactory, data, $mdDialog, $q, BaseService, $timeout, DialogFactory) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.isSubmit = false;
    vm.ecoTypeValID = null;
    vm.EcoCategoryValueModel = null;
    vm.EcoCategoryValueModel = angular.copy(data);
    vm.data = data;
    vm.categoryArray = CORE.CategoryTypeLabel;
    vm.categoryLabel = _.find(vm.categoryArray, function (item) { return item.id == data.categoryType }).value;
    vm.categoryType = data ? data.categoryType : null;
    vm.RadioGroup = {
      noteRequired: {
        array: CORE.NoteRadioGroup
      }
    }


    //$timeout(() => {
    //    if (vm.ecoTypeValID && vm.AddECOCategoryValueForm) {
    //        BaseService.checkFormValid(vm.AddECOCategoryValueForm, false);
    //    }
    //}, 0);
    const ecoCategoryValueTemplate = {
      name: null,
      noteRequired: true,
      displayOrder: null,
      ecoTypeCatID: null
    };
    //get Eco category list auto complete
    let getECOCategoryList = (insertedDataFromPopup) => {
      return ECOFactory.getAllECOTypeCategory().query({ category: vm.categoryType }).$promise.then((ecoTypeCategory) => {
        vm.ecotypecategoryList = ecoTypeCategory.data.ecoTypeCategory;
        return $q.resolve(vm.ecotypecategoryList);
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    var autocompletePromise = [getECOCategoryList()];
    vm.cgBusyLoading = $q.all(autocompletePromise).then((responses) => {
      if (responses) {
        if (data && data.ecoTypeValID) {
          vm.ecoTypeValID = data.ecoTypeValID;
        }
        if (vm.EcoCategoryValueModel) {
          if (!vm.EcoCategoryValueModel.ecoTypeValID) {
            vm.EcoCategoryValueModel.noteRequired = true;
          }
          vm.EcoCategoryValueModel.noteRequired = vm.EcoCategoryValueModel.noteRequired ? true : false;
        }
        else {
          vm.cleardefectList();
        }

        initAutoComplete();
      }
    }).catch((error) => {
      return BaseService.getErrorLog(error);
    });

    let initAutoComplete = () => {
      vm.autoCompleteECOTypeCategory = {
        columnName: 'ecoTypeCatName',
        controllerName: USER.ADMIN_ECO_CATEGORY_ADD_UPDATE_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_ECO_CATEGORY_ADD_UPDATE_MODAL_VIEW,
        keyColumnName: 'ecoTypeCatID',
        keyColumnId: vm.EcoCategoryValueModel && vm.EcoCategoryValueModel.ecoTypeCatID ? vm.EcoCategoryValueModel.ecoTypeCatID : null,
        inputName: vm.categoryLabel + ' Category',
        placeholderName: vm.categoryLabel + ' Category',
        isRequired: true,
        isAddnew: true,
        callbackFn: getECOCategoryList,
        addData: {
          categoryType: data.categoryType ? data.categoryType : $stateParams.categoryType
        },
        onSelectCallbackFn: (item) => {
          if (item) {
            if (vm.EcoCategoryValueModel.name && vm.AddECOCategoryValueForm.name.$dirty) {
              $timeout(() => {
                vm.checkEcoTypeValuesAlreadyExists();
              });
            }
          }
        }
      }
    }

    //Save or update defect list
    vm.updateEcoCategoryValue = () => {
      vm.isSubmit = false;
      var lst = vm.EcoCategoryValueModel;
      if (BaseService.focusRequiredField(vm.AddECOCategoryValueForm)) {
        return;
      }
      if (!vm.AddECOCategoryValueForm.$valid) {
        BaseService.focusRequiredField(vm.AddECOCategoryValueForm);
        vm.isSubmit = true;
        return;
      }
      //if (vm.AddECOCategoryValueForm.$dirty) {
      const ecoTypeCategoryInfo = {
        name: vm.EcoCategoryValueModel.name,
        noteRequired: vm.EcoCategoryValueModel.noteRequired,
        displayOrder: vm.EcoCategoryValueModel.displayOrder,
        ecoTypeCatID: vm.autoCompleteECOTypeCategory.keyColumnId ? vm.autoCompleteECOTypeCategory.keyColumnId : 0,
        ecoTypeValID: vm.ecoTypeValID,
        category: vm.categoryType
      };

      if (data && data.ecoTypeValID) {
        vm.cgBusyLoading = ECOFactory.ECOTypeValue().update({
          ecoTypeValID: data.ecoTypeValID,
        }, ecoTypeCategoryInfo).$promise.then((data) => {
          if (data.data) {
            BaseService.currentPagePopupForm.pop();
            $mdDialog.hide();
          } else {
            if (checkResponseHasCallBackFunctionPromise(data)) {
              data.alretCallbackFn.then(() => {
                setFocus('name');
              });
            }
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
      else {
        vm.cgBusyLoading = ECOFactory.ECOTypeValue().save(ecoTypeCategoryInfo).$promise.then((res) => {
          if (res.data) {
            if (res.data.ecoTypeValID) {
              BaseService.currentPagePopupForm.pop();
              $mdDialog.hide();
            } else {
              if (res.data && res.data.fieldName) {
                //check for existing defect list
                let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.UNIQUE_CONFIRM_MESSAGE);
                messageContent.message = stringFormat(messageContent.message, res.data.fieldName);
                let obj = {
                  //title: stringFormat(CORE.MESSAGE_CONSTANT.ACTIVE_ALERT_MESSAGE, res.data.fieldName),
                  //textContent: stringFormat(CORE.MESSAGE_CONSTANT.UNIQUE_CONFIRM_MESSAGE),
                  messageContent : messageContent,
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
                vm.EcoCategoryValueModel.name = null;
                setFocus('name');
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
      vm.EcoCategoryValueModel = Object.assign({}, ecoCategoryValueTemplate);
    };

    vm.cancel = () => {
      // Check vm.isChange flag for color picker dirty object 
      let isdirty = vm.checkFormDirty(vm.AddECOCategoryValueForm);
      if (isdirty) {
        let data = {
          form: vm.AddECOCategoryValueForm
        }
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };
    //Set as current form when page loaded
    angular.element(() => {
      //check load
      BaseService.currentPagePopupForm.push(vm.AddECOCategoryValueForm);
    });
    vm.checkFormDirty = (form, columnName) => {
      let checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    }
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    }
    //check ECO Type Values Already Exists
    vm.checkEcoTypeValuesAlreadyExists = () => {
      if (vm.EcoCategoryValueModel && vm.EcoCategoryValueModel.name) {
        let objs = {
          ecoTypeValID: vm.EcoCategoryValueModel.ecoTypeValID,
          ecoTypeCatID: vm.autoCompleteECOTypeCategory.keyColumnId ? vm.autoCompleteECOTypeCategory.keyColumnId : 0,
          name: vm.EcoCategoryValueModel.name,
          category: vm.categoryType
        };
        vm.cgBusyLoading = ECOFactory.checkEcoTypeValuesAlreadyExists().query({ objs: objs }).$promise.then((res) => {
          if (res && res.status == CORE.ApiResponseTypeStatus.FAILED) {
            if (checkResponseHasCallBackFunctionPromise(res)) {
              res.alretCallbackFn.then(() => {
                setFocus('name');
              });
            }
            vm.EcoCategoryValueModel.name = null;
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
    }

    //redirect to ECO and Quote Terms & Condition Attributes
    vm.goToEcoAndTermsConditionList = () => {
      if (vm.categoryType == vm.categoryArray[0].id)
        BaseService.openInNew(USER.ADMIN_ECO_CATEGORY_STATE, {});
      else
        BaseService.openInNew(USER.ADMIN_RFQ_CATEGORY_STATE, {});
    }
  }
})();
