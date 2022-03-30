(function () {
  'use strict';

  angular.module('app.core')
    .controller('WidgetCategoryPopupController', WidgetCategoryPopupController);

  /* @ngInject */
  function WidgetCategoryPopupController($mdDialog, data, CORE, BaseService, WidgetCategoryPopupFactory, DialogFactory) {
    var vm = this;

    //vm.themeClass = CORE.THEME;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.BUTTON_TYPE = CORE.POPUP_FOOTER_BUTTON;
    let oldCategoryName = '';

    vm.widgetCatModel = {
      id: data.id,
      name: data.Name,
      order: null
    };

    //vm.title = vm.widgetCatModel.id ? 'Update' : 'Add';
    vm.categoryFor = data.categoryFor ? data.categoryFor : '';

    if (vm.widgetCatModel.id) {
      getChartCategoryByID();
    }

    // Used to check wether form is dirty or not
    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    function getChartCategoryByID() {
      vm.cgBusyLoading = WidgetCategoryPopupFactory.getChartCategoryByID().query({ id: vm.widgetCatModel.id }).$promise.then((response) => {
        if (response && response.data) {
          vm.widgetCatModel = {
            id: data.id,
            name: response.data.name,
            order: response.data.order
          };
        }
      }).catch((error) => {
        BaseService.getErrorLog(error);
      });
    }

    /* Save widget Category. */
    vm.save = (buttonCategory) => {
      vm.saveDisable = true;
      //Used to focus on first error filed of form
      if (BaseService.focusRequiredField(vm.widgetCatForm)) {
        vm.saveDisable = false;
        return;
      }
      vm.cgBusyLoading = WidgetCategoryPopupFactory.saveChartCategory().save(vm.widgetCatModel).$promise.then((response) => {
        if (response && response.data) {
          BaseService.currentPagePopupForm.pop();
          vm.saveAndProceed(buttonCategory, response.data);
        }
        vm.saveDisable = false;
      }).catch((error) => {
        vm.saveDisable = false;
        BaseService.getErrorLog(error);
      });
    };

    /* Manage Add Category Btn and After Save manage need to close popup or not. */
    vm.saveAndProceed = (buttonCategory, data) => {
      if (buttonCategory === vm.BUTTON_TYPE.SAVE) {
        vm.widgetCatForm.$setPristine();
        vm.widgetCatModel.id = data.id;
      } else if (buttonCategory === vm.BUTTON_TYPE.ADDNEW) {
        const isdirty = vm.widgetCatForm.$dirty;
        if (isdirty) {
          const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_RESET_BODY_MESSAGE);
          const obj = {
            messageContent: messgaeContent,
            btnText: CORE.MESSAGE_CONSTANT.RESET_POPUP_BUTTON,
            canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
          };
          DialogFactory.messageConfirmDialog(obj).then(() => {
            vm.widgetCatForm.$setPristine();
            vm.widgetCatModel = {};
            setFocus('name');
          }, () => {
          }, (error) => BaseService.getErrorLog(error));
        } else {
          vm.widgetCatForm.$setPristine();
          vm.widgetCatModel = {};
        }
      } else if (buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
        $mdDialog.cancel(data);
      }
      setFocus('name');
    };


    // to check duplicate category exists or not
    vm.checkDuplicateChartCategory = () => {
      if (oldCategoryName !== vm.widgetCatModel.name) {
        if (vm.widgetCatForm && vm.widgetCatForm.name.$dirty && vm.widgetCatModel.name) {
          vm.cgBusyLoading = WidgetCategoryPopupFactory.checkDuplicateChartCategory().save({
            catMstID: vm.widgetCatModel.id,
            catName: vm.widgetCatModel.name
          }).$promise.then((res) => {
            vm.cgBusyLoading = false;
            oldCategoryName = angular.copy(vm.widgetCatModel.name);
            if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicateCategoryName) {
              oldCategoryName = '';
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DUPLICATE_ENTRY);
              messageContent.message = stringFormat(messageContent.message, vm.widgetCatModel.name);

              const obj = {
                messageContent: messageContent,
                multiple: true
              };
              vm.widgetCatModel.name = null;
              obj.multiple = true;
              DialogFactory.messageAlertDialog(obj).then(() => {
                setFocusByName('name');
              });
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
    };

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.widgetCatForm);
      if (isdirty) {
        const data = {
          form: vm.widgetCatForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };
    //Set as current form when page loaded
    angular.element(() => {
      //check load
      BaseService.currentPagePopupForm.push(vm.widgetCatForm);
    });

    /** Validate max size */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
  }
})();
