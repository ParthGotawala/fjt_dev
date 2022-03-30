(function () {
  'use restrict';

  angular.module('app.core')
    .controller('ManageAccountTypePopupController', ManageAccountTypePopupController);

  /* @ngInject */
  function ManageAccountTypePopupController(data, $mdDialog, DialogFactory, CORE, BaseService, $q, AccountTypeFactory, $scope) {
    var vm = this;
    vm.themeClass = CORE.THEME;
    vm.isAccountTypeFormDirty = true;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.AccountTypeLabel = CORE.Account_Type;
    vm.descriptionMaxLength = _maxLengthForDescription;
    vm.systemIdLabel = CORE.LabelConstant.COMMON.SystemID;
    vm.accountTypeModel = {
      isSubType: false,
      class_id: data && data.class_id ? data.class_id : null
    };

    const getAccountTypeBySearch = (searchObj) => AccountTypeFactory.getAccountTypeBySearch().query(searchObj).$promise.then((accountType) => {
      if (accountType) {
        _.each(accountType.data, (item) => item.parentAccountTypeDisplayName = item.class_code ? stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.class_code, item.class_name) : item.class_name);
        if (searchObj && searchObj.class_id) {
          $scope.$broadcast(vm.autoCompleteParentAccountType.inputName, accountType.data[0]);
        }
        return accountType.data;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    // Edit Account Type
    const getAccountTypeById = () => AccountTypeFactory.getAccountTypeById().query({ id: vm.accountTypeModel.class_id }).$promise.then((response) => {
      if (response && response.data) {
        vm.accountTypeModel = response.data;
        vm.isSystemGenerated = response.data.system_defined || false;
        if (vm.accountTypeModel.parent_class_id) {
          getAccountTypeBySearch({
            class_id: vm.accountTypeModel.parent_class_id
          });
        }
      }
    }).catch((error) => BaseService.getErrorLog(error));

    const autocompletePromise = [];
    if (vm.accountTypeModel.class_id) {
      autocompletePromise.push(getAccountTypeById());
    }
    vm.cgBusyLoading = $q.all(autocompletePromise).then(() => initAutoComplete()).catch((error) => BaseService.getErrorLog(error));

    const initAutoComplete = () => {
      vm.autoCompleteParentAccountType = {
        columnName: 'parentAccountTypeDisplayName',
        keyColumnName: 'class_id',
        keyColumnId: vm.accountTypeModel.parent_class_id || null,
        inputName: vm.AccountTypeLabel.ParentAccountType,
        placeholderName: vm.AccountTypeLabel.ParentAccountType,
        isRequired: true,
        isAddnew: false,
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.accountTypeModel.parent_class_id = item.class_id;
          }
          else {
            $scope.$broadcast(vm.autoCompleteParentAccountType.inputName, null);
          }
        },
        onSearchFn: (query) => {
          const searchObj = {
            searchString: query,
            parent_class_id: vm.accountTypeModel.class_id
          };
          return getAccountTypeBySearch(searchObj);
        }
      };
    };

    vm.saveAccountType = () => {
      if (BaseService.focusRequiredField(vm.accountTypeForm, vm.isAccountTypeFormDirty)) {
        return;
      }

      vm.accountTypeModel.parent_class_id = vm.accountTypeModel.isSubType && vm.autoCompleteParentAccountType && vm.autoCompleteParentAccountType.keyColumnId ? vm.autoCompleteParentAccountType.keyColumnId : null;

      vm.cgBusyLoading = AccountTypeFactory.saveAccountType().query(vm.accountTypeModel).$promise.then((res) => {
        if (res.data && res.data.class_id) {
          $mdDialog.cancel(res.data);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //Check Duplicate Account Type Form
    vm.checkDuplicateAccountTypeFormField = (formfieldName) => {
      const formfield = formfieldName;
      if (vm.accountTypeModel[formfield]) {
        vm.cgBusyLoading = AccountTypeFactory.checkDuplicateAccountTypeFormField().save({
          class_id: vm.accountTypeModel.class_id ? vm.accountTypeModel.class_id : null,
          [formfield]: vm.accountTypeModel[formfield]
        }).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicate) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
            messageContent.message = stringFormat(messageContent.message, formfield === 'class_name' ? 'Account Type Name' : 'Account Type Code');

            const obj = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK,
              multiple: true
            };

            vm.accountTypeModel[formfield] = null;

            DialogFactory.messageAlertDialog(obj).then(() => {
              if (formfield) {
                setFocusByName(formfield);
              }
            }, () => {
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    angular.element(() => focusOnFirstEnabledFormField(vm.accountTypeForm));
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    vm.changeParentClassAutocompleteValue = () => {
      if (vm.autoCompleteParentAccountType && vm.accountTypeModel.isSubType) {
        vm.autoCompleteParentAccountType.keyColumnId = null;
      }
    };
    vm.cancel = () => {
      if (vm.accountTypeForm.$dirty) {
        const data = {
          form: vm.accountTypeForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        $mdDialog.cancel();
      }
    };
  }
})();
