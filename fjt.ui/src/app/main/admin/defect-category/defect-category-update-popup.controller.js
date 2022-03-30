(function () {
    'use strict';

    angular
        .module('app.admin.defectCategory')
        .controller('DefectCategoryUpdatePopupController', DefectCategoryUpdatePopupController);

    /** @ngInject */
    function DefectCategoryUpdatePopupController($mdDialog, data, CORE, RFQTRANSACTION, DefectCategoryFactory, DialogFactory, $mdColorPicker, BaseService, $timeout) {
        const vm = this;

        vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
        vm.isSubmit = false;
        vm.defectCategory = null;
        vm.defectCategory = angular.copy(data);
        vm.defectCateId = null;
        vm.selectedColor = false;
        vm.isChange = false;
        vm.minLengthMessage = CORE.MESSAGE_CONSTANT.MIN_LENGTH_MESSAGE;
        vm.isSaveDisable = false;
        if (data && data.defectCatId) {
            vm.defectCateId = data.defectCatId;
            if (vm.defectCategory.colorCode)
                vm.selectedColor = true;
            $timeout(() => {
                if (vm.defectCateId && vm.defectCategoryForm) {
                    BaseService.checkFormValid(vm.defectCategoryForm, false);
                }
            }, 0);
        }
        vm.taToolbar = CORE.Toolbar;
        const defectCategoryTemplate = {
            defectcatName: null,
            description: null,
            colorCode: null,
            order: null
        };

        vm.cleardefectCategory = () => {
            vm.defectCategory = Object.assign({}, defectCategoryTemplate);
        };

        if (!vm.defectCategory)
            vm.cleardefectCategory();
        //save or update defect category
        vm.updateDefectCategory = () => {            
            vm.isSubmit = false;
            vm.isSaveDisable = true;            
            if (BaseService.focusRequiredField(vm.defectCategoryForm)) {
              vm.isSubmit = true;
              vm.isSaveDisable = false;
              return;
            }
            
            //if (vm.defectCategoryForm.$dirty || vm.isChange) {
            const defectCategoryInfo = {
                defectcatName: vm.defectCategory.defectcatName,
                description: vm.defectCategory.description,
                colorCode: vm.defectCategory.colorCode,                
                order: vm.defectCategory.order
            };

            if (data && data.defectCatId) {
                vm.cgBusyLoading = DefectCategoryFactory.DefectCategory().update({
                    defectCatId: data.defectCatId,
                }, defectCategoryInfo).$promise.then((res) => {
                    if (res && res.status == CORE.ApiResponseTypeStatus.SUCCESS) {
                        BaseService.currentPagePopupForm.pop();
                        $mdDialog.hide();
                  } else{
                    if (checkResponseHasCallBackFunctionPromise(res)) {
                        res.alretCallbackFn.then(() => {
                        vm.isSaveDisable = false;
                        BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.defectCategoryForm);
                      });
                    }
                  }
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            }
            else {
                vm.cgBusyLoading = DefectCategoryFactory.DefectCategory().save(defectCategoryInfo).$promise.then((res) => {
                    if (res) {

                        if (res.data && res.data.defectCatId) {
                            BaseService.currentPagePopupForm.pop();
                            $mdDialog.hide();
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
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            }
        };
        vm.cancel = () => {
            vm.cleardefectCategory();
            $mdDialog.cancel();
        };

        vm.getColor = ($event, colorCode) => {
            var color = CORE.DEFAULT_STANDARD_CLASS_COLOR;
            if (colorCode) {
                var rgbColor = new tinycolor(colorCode).toRgb();
                color = stringFormat(RFQTRANSACTION.RGB_COLOR_FORMAT, rgbColor.r, rgbColor.g, rgbColor.b);
            }
            $mdColorPicker.show({
                value: color,
                genericPalette: true,
                $event: $event,
                mdColorHistory: false,
                mdColorAlphaChannel: false,
                mdColorSliders: false,
                mdColorGenericPalette: false,
                mdColorMaterialPalette: false,
            }).then(function (color) {
                vm.color = new tinycolor(color).toHex();
                if (vm.defectCategory.colorCode != "#" + vm.color) {
                    vm.isChange = true;
                }
                vm.defectCategory.colorCode = "#" + vm.color;
                vm.defectCategoryForm.$setDirty();
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        }
        /*Used to close pop-up*/
        vm.cancel = () => {
            // Check vm.isChange flag for color picker dirty object 
            let isdirty = vm.checkFormDirty(vm.defectCategoryForm) || vm.isChange;
            if (isdirty) {
                let data = {
                    form: vm.defectCategoryForm
                }
                BaseService.showWithoutSavingAlertForPopUp(data);
            } else {
                BaseService.currentPagePopupForm.pop();
                $mdDialog.cancel();
            }
        };

        //Set as current form when page loaded
      angular.element(() => {
        BaseService.currentPagePopupForm.push(vm.defectCategoryForm);
      });
        vm.checkFormDirty = (form, columnName) => {
            let checkDirty = BaseService.checkFormDirty(form, columnName);
            return checkDirty;
        }

        // Function call on Defect category name blue event and check code exist or not
        vm.checkDuplicateDefectCategoryName = () => {
            if (vm.defectCategory.defectcatName) {
                vm.cgBusyLoading = DefectCategoryFactory.checkDuplicateDefectCategoryName()
                    .save(vm.defectCategory).$promise.then((res) => {
                        vm.cgBusyLoading = false;
                        if (res && res.status == CORE.ApiResponseTypeStatus.FAILED &&  res.errors && res.errors.data && res.errors.data.isDuplicateDefectCategorytName) {
                            vm.defectCategory.defectcatName = null;
                            
                            if (checkResponseHasCallBackFunctionPromise(res)) {
                              res.alretCallbackFn.then(() => {
                                setFocusByName('defectcatName');
                              });
                            }                             
                            
                        }
                    }).catch((error) => {
                        return BaseService.getErrorLog(error);
                    });
            }
        }
        /* called for max length validation */
        vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
            return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
        }
    }
})();
