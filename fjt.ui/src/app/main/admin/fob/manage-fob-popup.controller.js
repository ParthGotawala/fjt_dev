(function () {
  'use restrict';

  angular.module('app.core')
    .controller('FOBPopupController', FOBPopupController);

  /* @ngInject */
  function FOBPopupController(data, $mdDialog, DialogFactory, CORE, BaseService, $timeout, FOBFactory) {
    var vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.BUTTON_TYPE = CORE.POPUP_FOOTER_BUTTON;
    vm.fobForm = {};

    vm.pageInit = (data) => {
      vm.fobModel = {
        id: data && data.id ? data.id : null,
        name: data && data.name ? data.name : data && data.Name ? data.Name : null
      };
    };
    vm.pageInit(data);

    vm.saveAndProceed = (buttonCategory, data) => {
      if (data) {
        vm.data = data;
      }
      if (buttonCategory === vm.BUTTON_TYPE.SAVE) {
        vm.fobForm.$setPristine();
        vm.pageInit(data);
      } else if (buttonCategory === vm.BUTTON_TYPE.ADDNEW) {
        const isdirty = vm.checkFormDirty(vm.fobForm);
        if (isdirty) {
          const data = {
            form: vm.fobForm
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
              vm.fobForm.$setPristine();
            }
          }, () => {
          }, (error) => BaseService.getErrorLog(error));
        } else {
          vm.pageInit();
          vm.fobForm.$setPristine();
        }
      } else if (buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel(vm.data);
      }
      setFocusByName('name');
    };

    // Check Duplicate FOB name
    vm.checkDuplicateName = () => {
      vm.isduplicate = false;

      if (vm.fobModel.name) {
        vm.cgBusyLoading = FOBFactory.checkDuplicateFOB().save({
          id: (vm.fobModel.id || vm.fobModel.id === 0) ? vm.fobModel.id : null,
          name: vm.fobModel.name,
          refTableName: CORE.TABLE_NAME.FOB
        }).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicate) {
            vm.isduplicate = true;
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
            messageContent.message = stringFormat(messageContent.message, 'Name');

            const uniqueObj = {
              messageContent: messageContent,
              controlName: 'name'
            };

            const obj = {
              messageContent: uniqueObj.messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK,
              multiple: true
            };

            vm.fobModel.name = null;

            DialogFactory.messageAlertDialog(obj).then(() => {
              if (uniqueObj.controlName) {
                setFocusByName(uniqueObj.controlName);
              }
            }, () => {
            }).catch((error) => BaseService.getErrorLog(error));
          };
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    // Edit FOB Details
    if (vm.fobModel.id || vm.fobModel.id === 0) {
      vm.cgBusyLoading = FOBFactory.getFobById().query({ id: vm.fobModel.id }).$promise.then((response) => {
        if (response && response.data) {
          vm.pageInit(response.data);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    // Save FOB Details
    vm.saveFOB = (buttonCategory) => {
      if (BaseService.focusRequiredField(vm.fobForm)) {
        if (vm.fobModel.id && !vm.fobForm.$dirty && buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
          $mdDialog.cancel(vm.data);
        }
        return;
      }
      vm.cgBusyLoading = FOBFactory.saveFOB().save(vm.fobModel).$promise.then((res) => {
        if (res.data && res.data.id) {
          vm.saveAndProceed(buttonCategory, res.data);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    vm.cancel = () => {
      const isdirty = vm.fobForm.$dirty;
      if (isdirty) {
        const data = {
          form: vm.fobForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        $mdDialog.cancel(true);
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    // Check Form Dirty state on state change and reload browser
    angular.element(() => {
      BaseService.currentPagePopupForm = [vm.fobForm];
      if (data && data.Name) {
        vm.fobForm.$setDirty();
      }
    });
  };
})();
