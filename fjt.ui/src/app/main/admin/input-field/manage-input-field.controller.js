(function () {
  'use strict';

  angular.module('app.admin.inputfield')
    .controller('ManageInputFieldController', ManageInputFieldController);

  /** @ngInject */
  function ManageInputFieldController($scope, $stateParams, $state, $q, $mdDialog, BaseService, InputFieldFactory, DialogFactory, USER, CORE) {
    const vm = this;
    var autocompletePromise;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.inputField = {};
    vm.inputField.inputFieldID = $stateParams.id;
    vm.datatypeList = CORE.InputField_DataType;

    const inputField = {
      displayName: null,
      dataType: null,
      displayOrder: null,
      isActive: true
    };

    const inputFieldDetail = () => {
      /* Get Input fields details */
      if (vm.inputField.inputFieldID) {
        return InputFieldFactory.InputField().query({ id: vm.inputField.inputFieldID }).$promise.then((response) => {
          if (response && response.data) {
            vm.inputField = angular.copy(response.data);
            if (vm.inputField.inputFieldID && vm.inputFieldDetailForm) {
              BaseService.checkFormValid(vm.inputFieldDetailForm, false);
            }
            return $q.resolve(vm.inputField);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        vm.inputField = Object.assign({}, inputField);
      }
    };

    autocompletePromise = [inputFieldDetail()];
    vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
      initAutoComplete();
    }).catch((error) => BaseService.getErrorLog(error));

    const initAutoComplete = () => {
      vm.autoCompleteDatatype = {
        columnName: 'dataTypeName',
        keyColumnName: 'dataTypeName',
        keyColumnId: vm.inputField.dataType ? vm.inputField.dataType : null,
        isRequired: true
      };
    };

    /* Save Input field details */
    vm.saveInputField = () => {
      vm.saveDisable = true;
      if (BaseService.focusRequiredField(vm.inputFieldDetailForm)) {
        vm.saveDisable = false;
        return;
      }

      vm.inputField.dataType = vm.autoCompleteDatatype.keyColumnId ? vm.autoCompleteDatatype.keyColumnId : null;
      if (vm.inputField.inputFieldID > 0) {
        // code to update
        vm.cgBusyLoading = InputFieldFactory.InputField().update({ id: vm.inputField.inputFieldID }, vm.inputField).$promise.then((res) => {
            if (res && res.status === 'SUCCESS') {
              vm.inputFieldDetailForm.$setPristine();
              BaseService.currentPageForms = [];
              $state.go(USER.ADMIN_INPUTFIELD_STATE);
            }
          }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        //code to add
        vm.cgBusyLoading = InputFieldFactory.InputField().save(vm.inputField).$promise.then((res) => {
          if (res && res.data && res.data.inputFieldID) {
            vm.inputField.inputFieldID = res.data.inputFieldID;
            vm.inputFieldDetailForm.$setPristine();
            BaseService.currentPageForms = [];
            $state.go(USER.ADMIN_INPUTFIELD_STATE);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    /* go to back inputField list */
    vm.goBack = () => {
      if (vm.inputFieldDetailForm.$dirty) {
        showWithoutSavingAlertforBackButton();
      } else {
        $state.go(USER.ADMIN_INPUTFIELD_STATE);
      }
    };

    function showWithoutSavingAlertforBackButton() {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          BaseService.currentPageForms = [];
          $state.go(USER.ADMIN_INPUTFIELD_STATE);
        }
      }, (error) => BaseService.getErrorLog(error));
    }

    /* Set as current form when page loaded */
    angular.element(() => {
      BaseService.currentPageForms = [vm.inputFieldDetailForm];
    });

    /* called for max length validation */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    };

    /* check Unique Message */
    vm.checkUniqueName = () => {
      if (vm.inputField.displayName) {
        const objs = {
          displayName: vm.inputField.displayName,
          inputFieldID: vm.inputField.inputFieldID
        };
        vm.cgBusyLoading = InputFieldFactory.checkUniqueName().query({ objs: objs }).$promise.then((res) => {
          vm.cgBusyLoading = false;
          if (res && res.status !== CORE.ApiResponseTypeStatus.SUCCESS) {
            vm.inputField.displayName = null;
            if (checkResponseHasCallBackFunctionPromise(res)) {
              res.alretCallbackFn.then(() => {
                setFocus('displayName');
              });
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    // close popup on page destroy
    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, { closeAll: true });
    });
  }
})();
