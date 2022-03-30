(function () {
  'use restrict';

  angular.module('app.core')
    .controller('ManageChartofAccountsPopupController', ManageChartofAccountsPopupController);

  /* @ngInject */
  function ManageChartofAccountsPopupController(data, $mdDialog, DialogFactory, CORE, BaseService, ChartOfAccountsFactory, $q, USER, AccountTypeFactory, $scope) {
    var vm = this;
    vm.themeClass = CORE.THEME;
    vm.isChartOfAccountFormDirty = true;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.ChartOfAccountsLabel = CORE.Chart_of_Accounts;
    vm.systemIdLabel = CORE.LabelConstant.COMMON.SystemID;
    vm.descriptionMaxLength = _maxLengthForDescription;
    vm.chartOfAccountModel = {
      isSubAccount: false,
      acct_id: data && data.acct_id ? data.acct_id : null,
      acct_name: data && data.Name ? data.Name : null
    };

    const getAccountTypeBySearch = (searchObj) => AccountTypeFactory.getAccountTypeBySearch().query(searchObj).$promise.then((accountType) => {
      if (accountType) {
        _.each(accountType.data, (item) => item.accountTypeDisplayName = item.class_code ? stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.class_code, item.class_name) : item.class_name);
        if (searchObj && searchObj.class_id) {
          $scope.$broadcast(vm.autoCompleteAccountType.inputName, accountType.data[0]);
        }
        return accountType.data;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    const getChartOfAccountBySearch = (searchObj) => ChartOfAccountsFactory.getChartOfAccountBySearch().query(searchObj).$promise.then((chartofAccount) => {
      if (chartofAccount) {
        _.each(chartofAccount.data, (item) => item.parentAccountDisplayName = item.acct_code ? stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.acct_code, item.acct_name) : item.acct_name);
        if (searchObj && searchObj.acct_id) {
          $scope.$broadcast(vm.autoCompleteParentAccount.inputName, chartofAccount.data[0]);
        }
        return chartofAccount.data;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    const getChartOfAccountById = () => ChartOfAccountsFactory.getChartOfAccountById().query({ id: vm.chartOfAccountModel.acct_id }).$promise.then((response) => {
      if (response && response.data) {
        vm.chartOfAccountModel = response.data;
        if (vm.chartOfAccountModel.sub_class_id) {
          getAccountTypeBySearch({
            class_id: vm.chartOfAccountModel.sub_class_id
          });
        }
        if (vm.chartOfAccountModel.parent_acct_id) {
          getChartOfAccountBySearch({
            acct_id: vm.chartOfAccountModel.parent_acct_id
          });
        }
      }
    }).catch((error) => BaseService.getErrorLog(error));

    const autocompletePromise = [];
    if (vm.chartOfAccountModel.acct_id) {
      autocompletePromise.push(getChartOfAccountById());
    }
    vm.cgBusyLoading = $q.all(autocompletePromise).then(() => initAutoComplete()).catch((error) => BaseService.getErrorLog(error));

    const initAutoComplete = () => {
      vm.autoCompleteAccountType = {
        columnName: 'accountTypeDisplayName',
        controllerName: USER.MANAGE_ACCOUNT_TYPE_MODAL_CONTROLLER,
        viewTemplateURL: USER.MANAGE_ACCOUNT_TYPE_MODAL_VIEW,
        keyColumnName: 'class_id',
        keyColumnId: vm.chartOfAccountModel.sub_class_id || null,
        inputName: vm.ChartOfAccountsLabel.AccountType,
        placeholderName: vm.ChartOfAccountsLabel.AccountType,
        isRequired: true,
        isAddnew: true,
        callbackFn: getAccountTypeBySearch,
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.chartOfAccountModel.sub_class_id = item.class_id;
            if (vm.chartOfAccountModel.parent_acct_id) {
              getChartOfAccountBySearch({
                acct_id: vm.chartOfAccountModel.parent_acct_id
              });
            }
          }
          else {
            $scope.$broadcast(vm.autoCompleteAccountType.inputName, null);
            $scope.$broadcast(vm.autoCompleteParentAccount.inputName, null);
          }
        },
        onSearchFn: (query) => {
          const searchObj = {
            searchString: query
          };
          return getAccountTypeBySearch(searchObj);
        }
      };
      vm.autoCompleteParentAccount = {
        columnName: 'parentAccountDisplayName',
        keyColumnName: 'acct_id',
        keyColumnId: vm.chartOfAccountModel.parent_acct_id || null,
        inputName: vm.ChartOfAccountsLabel.ParentAccount,
        placeholderName: vm.ChartOfAccountsLabel.ParentAccount,
        isRequired: true,
        isAddnew: false,
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.chartOfAccountModel.parent_acct_id = item.class_id;
          }
          else {
            $scope.$broadcast(vm.autoCompleteParentAccount.inputName, null);
          }
        },
        onSearchFn: (query) => {
          const searchObj = {
            searchString: query,
            parent_acct_id: vm.chartOfAccountModel.acct_id
          };
          if (vm.autoCompleteAccountType && vm.autoCompleteAccountType.keyColumnId) {
            searchObj.sub_class_id = vm.autoCompleteAccountType.keyColumnId;
          }
          return getChartOfAccountBySearch(searchObj);
        }
      };
    };

    vm.saveChartOfAccounts = () => {
      if (BaseService.focusRequiredField(vm.chartOfAccountForm, vm.isChartOfAccountFormDirty)) {
        return;
      }

      vm.chartOfAccountModel.sub_class_id = vm.autoCompleteAccountType.keyColumnId || null;
      vm.chartOfAccountModel.parent_acct_id = vm.chartOfAccountModel.isSubAccount && vm.autoCompleteParentAccount && vm.autoCompleteParentAccount.keyColumnId ? vm.autoCompleteParentAccount.keyColumnId : null;

      vm.cgBusyLoading = ChartOfAccountsFactory.saveChartOfAccount().query(vm.chartOfAccountModel).$promise.then((res) => {
        if (res.data && res.data.acct_id) {
          $mdDialog.cancel(res.data);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //Check Duplicate Purchase Inspection Requirement
    vm.checkDuplicateChartOfAccountFormField = (formfieldName) => {
      const formfield = formfieldName;
      if (vm.chartOfAccountModel[formfield]) {
        vm.cgBusyLoading = ChartOfAccountsFactory.checkDuplicateChartOfAccountFormField().save({
          acct_id: (vm.chartOfAccountModel.acct_id || vm.chartOfAccountModel.acct_id === 0) ? vm.chartOfAccountModel.acct_id : null,
          [formfield]: vm.chartOfAccountModel[formfield]
        }).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicate) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
            messageContent.message = stringFormat(messageContent.message, formfield === 'acct_name' ? 'Account Name' : 'Account Code');

            const obj = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK,
              multiple: true
            };

            vm.chartOfAccountModel[formfield] = null;

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

    angular.element(() => focusOnFirstEnabledFormField(vm.chartOfAccountForm));
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    vm.goToaccountTypeList = () => BaseService.openInNew(USER.ADMIN_ACCOUNT_TYPE_STATE);
    vm.changeParentAccountAutocompleteValue = () => {
      if (vm.autoCompleteParentAccount && vm.chartOfAccountModel.isSubAccount) {
        vm.autoCompleteParentAccount.keyColumnId = null;
      }
    };
    vm.cancel = () => {
      if (vm.chartOfAccountForm.$dirty) {
        const data = {
          form: vm.chartOfAccountForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        $mdDialog.cancel();
      }
    };
  }
})();
