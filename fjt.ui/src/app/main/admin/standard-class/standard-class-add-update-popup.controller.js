(function () {
    'use strict';

    angular
        .module('app.admin.standardClass')
        .controller('StandardClassUpdatePopupController', StandardClassUpdatePopupController);

    function StandardClassUpdatePopupController(StandardClassFactory, CertificateStandardFactory, DialogFactory, $q, data, $mdDialog, CORE, USER, RFQTRANSACTION, $mdColorPicker, BaseService, $timeout) {
      const vm = this;
        vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
        vm.isChange = false;
      vm.BUTTON_TYPE = CORE.POPUP_FOOTER_BUTTON;
      let oldStandardClassName = '';
        vm.pagingInfo = {
            Page: '0',
            SortColumns: [['classID', 'DESC']],
            SearchColumns: []
        };
      vm.pageInit = (data) => {
        vm.StandardClassModel = {
          className: (data && data.className) ? data.className : null,
          colorCode: (data && data.colorCode) ? data.colorCode : null,
          description: (data && data.description) ? data.description : null,
          priority: (data && data.priority) ? data.priority : null,
          certificateStandardID: (data && data.certificateStandardID) ? data.certificateStandardID : null,
          classID: (data && data.classID) ? data.classID : null,
          isActive: (data && data.isActive) ? data.isActive : true
        };
      };
      vm.pageInit(data);


      const getAllStandardClass = () => {
        vm.cgBusyLoading = StandardClassFactory.retriveStandardClassList().query(vm.pagingInfo).$promise.then((classData) => {
          vm.standardClassList = classData.data.classData;
        }).catch((error) =>
          BaseService.getErrorLog(error)
        );
      };
        if (data && data.classID) {
            let rgbColor;
            let color;
            vm.StandardClassModel = angular.copy(data);
            if (data.colorCode) {
                rgbColor = new tinycolor(data.colorCode).toRgb();
            }
          if (rgbColor) {
            color = stringFormat(CORE.STANDARD_CLASS_COLOR_FORMATE, rgbColor.r, rgbColor.g, rgbColor.b);
          }
          else {
                color = null;
            vm.StandardClassModel.colorCode = color;
            vm.StandardClassModel.isActive = vm.StandardClassModel.isActive === '1' ? true : false;
          }
        }

      $timeout(() => {
        if (data && data.classID && vm.StandardClassForm) {
          BaseService.checkFormValid(vm.StandardClassForm, false);
        }
      }, 0);

      vm.getColor = ($event, colorCode) => {
        var color = CORE.DEFAULT_STANDARD_CLASS_COLOR;
        if (colorCode) {
          const rgbColor = new tinycolor(colorCode).toRgb();
          color = stringFormat(CORE.STANDARD_CLASS_COLOR_FORMATE, rgbColor.r, rgbColor.g, rgbColor.b);
        }
        $mdColorPicker.show({
          value: color,
          genericPalette: true,
          $event: $event,
          mdColorHistory: false,
          mdColorAlphaChannel: false,
          mdColorSliders: false,
          mdColorGenericPalette: false,
          mdColorMaterialPalette: false

        }).then((color) => {
          vm.StandardClassModel.colorCode = color;
          vm.isChange = true;
          vm.StandardClassForm.$setDirty();
        }).catch((error) =>
          BaseService.getErrorLog(error)
        );
      };
        //get standard type list
      const getCertificateStandard = () =>
        CertificateStandardFactory.getCertificateStandard().query().$promise.then((certificate) => {
          vm.certificateStandardList = certificate.data;
          return $q.resolve(vm.certificateStandardList);
        }).catch((error) =>
          BaseService.getErrorLog(error)
        );

        const autocompletePromise = [getCertificateStandard(), getAllStandardClass()];
        vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
            initAutoComplete();
        }).catch((error) =>
            BaseService.getErrorLog(error)
        );
      const initAutoComplete = () => {
        vm.autoCompleteCertificateStandard = {
          columnName: 'fullName',
          controllerName: USER.ADMIN_CERTIFICATE_STANDARD_ADD_MODAL_CONTROLLER,
          viewTemplateURL: USER.ADMIN_CERTIFICATE_STANDARD_ADD_MODAL_VIEW,
          keyColumnName: 'certificateStandardID',
          keyColumnId: vm.StandardClassModel ? (vm.StandardClassModel.certificateStandardID ? vm.StandardClassModel.certificateStandardID : null) : null,
          inputName: 'Standard',
          placeholderName: 'Standard',
          isRequired: true,
          addData: {
            popupAccessRoutingState: [USER.CERTIFICATE_STANDARD_STATE],
            pageNameAccessLabel: CORE.LabelConstant.Standards.PageName
          },
          isAddnew: true,
          callbackFn: getCertificateStandard,
          onSelectCallbackFn: (item) => {
            if (item) {
              if (vm.StandardClassModel.className && vm.StandardClassForm.className.$dirty) {
                $timeout(() => {
                  vm.checkDuplicateCategory();
                });
              }
            }
          }
        };
      };
      /*-------------------add standard category--------*/
      vm.saveAndProceed = (buttonCategory,newdata) => {
        if (newdata) {
          vm.tempData = newdata;
        }
        if (buttonCategory === vm.BUTTON_TYPE.SAVE) {
          vm.pageInit(newdata);
          vm.isChange = false;
          vm.StandardClassForm.$setPristine();
        } else if (buttonCategory === vm.BUTTON_TYPE.ADDNEW) {
          data = {};
          const isdirty = vm.checkFormDirty(vm.StandardClassForm);
          if (isdirty) {
            const newdata = {
              form: vm.StandardClassForm
            };
            const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_RESET_BODY_MESSAGE);
            const obj = {
              messageContent: messgaeContent,
              btnText: CORE.MESSAGE_CONSTANT.RESET_POPUP_BUTTON,
              canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
            };
            DialogFactory.messageConfirmDialog(obj).then(() => {
              if (newdata) {
                vm.pageInit(newdata);
                initAutoComplete();
                pageSet();
              }
            }, () => {
            }, (error) => BaseService.getErrorLog(error));
          } else {
            vm.pageInit(newdata);
            initAutoComplete();
            pageSet();
          }
        } else if (buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
          BaseService.currentPagePopupForm.pop();
          $mdDialog.hide(vm.tempData);
        }
      };
      const pageSet = () => {
        $timeout(() => {
          vm.StandardClassForm.$dirty = false;
          vm.StandardClassForm.$setPristine();
          vm.StandardClassForm.$setUntouched();
        },0);
      };
    /*-------------------add standard category--------*/

        /* add/update standard-class */
      vm.save = (buttonCategory) => {
          if (BaseService.focusRequiredField(vm.StandardClassForm)) {
            if (!vm.checkFormDirty(vm.StandardClassForm) && buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
              if (data && !_.isEmpty(data)){
                $mdDialog.hide(data);
              } else {
                return;
              }
            }
            return;
        }
        if (vm.StandardClassForm.$invalid) {
          BaseService.focusRequiredField(vm.StandardClassForm);
          return;
        }
        const StandardClassInfo = {
          className: vm.StandardClassModel.className,
          colorCode: vm.StandardClassModel.colorCode,
          description: vm.StandardClassModel.description,
          priority: vm.StandardClassModel.priority,
          certificateStandardID: vm.autoCompleteCertificateStandard.keyColumnId ? vm.autoCompleteCertificateStandard.keyColumnId : null,
          isActive: vm.StandardClassModel.isActive
        };
        //Update
        if (data && data.certificateStandardID && data.classID) {
          vm.cgBusyLoading = StandardClassFactory.standardClass().update({
            id: data.classID
          }, StandardClassInfo).$promise.then((res) => {
            if (res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              oldStandardClassName = data.className;
              vm.saveAndProceed(buttonCategory, StandardClassInfo);
            } else if (res && res.status === CORE.ApiResponseTypeStatus.FAILED) {
              vm.StandardClassModel.className = null;
            }
            else {
              if (checkResponseHasCallBackFunctionPromise(res)) {
                res.alretCallbackFn.then(() => {
                  BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.StandardClassForm);
                });
              }
            }
          }).catch((error) =>
            BaseService.getErrorLog(error)
          );
        }
        else {
          //Create
          vm.cgBusyLoading = StandardClassFactory.standardClass().save(StandardClassInfo).$promise.then((res) => {
            if (res && res.data && res.data.classID) {
              data = res.data;
              oldStandardClassName = data.className;
              vm.saveAndProceed(buttonCategory, res.data);
            }
            else if (res && res.status === CORE.ApiResponseTypeStatus.FAILED) {
              vm.StandardClassModel.className = null;
            }
            else {
              if (checkResponseHasCallBackFunctionPromise(res)) {
                res.alretCallbackFn.then(() => {
                  BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.StandardClassForm);
                });
              }
            }
          }).catch((error) =>
            BaseService.getErrorLog(error)
          );
        }
      };
      //Function call on standard blur event and check standard name exist and ask for confirmation
      vm.checkDuplicateCategory = () => {
        if (vm.StandardClassForm && vm.StandardClassForm.className.$dirty && vm.StandardClassModel.className) {
          vm.cgBusyLoading = StandardClassFactory.checkDuplicateCategory().query({
            classID: vm.StandardClassModel.classID,
            certificateStandardID: vm.autoCompleteCertificateStandard.keyColumnId ? vm.autoCompleteCertificateStandard.keyColumnId : null,
            className: vm.StandardClassModel.className
          }).$promise.then((res) => {
            vm.cgBusyLoading = false;
            oldStandardClassName = angular.copy(vm.StandardClassModel.className);
            if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicateClassName) {
              displayStandardclassNameUniqueMessage();
            }
          }).catch((error) => {
            oldStandardClassName = null;
            return BaseService.getErrorLog(error);
          });
        }
      };
        /* display standard name unique confirmation message */
      const displayStandardclassNameUniqueMessage = () => {
        oldStandardClassName = '';
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
        messageContent.message = stringFormat(messageContent.message, 'Category name');
        const obj = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(obj).then(() => {
          vm.StandardClassModel.className = null;
          setFocus('className');
        }, () => {
        }).catch((error) =>
          BaseService.getErrorLog(error)
        );
      };

        vm.cancel = () => {
            // Check vm.isChange flag for color picker dirty object
            const isDirty = vm.checkFormDirty(vm.StandardClassForm) || vm.isChange;
            if (isDirty) {
              const data = {
                form: vm.StandardClassForm
              };
               BaseService.showWithoutSavingAlertForPopUp(data);
        } else if (vm.tempData) {
              $mdDialog.cancel(vm.tempData);
        } else {
              BaseService.currentPagePopupForm.pop();
              $mdDialog.cancel();
        }
      };

      vm.checkFormDirty = (form, columnName) => {
        const checkDirty = BaseService.checkFormDirty(form, columnName);
        return checkDirty;
      };

      vm.goToStandard = () => {
        BaseService.goToStandardList();
      };

      vm.getMaxLengthValidation = (maxLength, enterTextLength) =>
        BaseService.getMaxLengthValidation(maxLength, enterTextLength);

        // Check Form Dirty state on state change and reload browser
      angular.element(() => {
        BaseService.currentPagePopupForm = [vm.StandardClassForm];
      });
    }
})();
