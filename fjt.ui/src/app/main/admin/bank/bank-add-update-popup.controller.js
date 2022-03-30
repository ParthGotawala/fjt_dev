(function () {
  'use strict';
  angular
    .module('app.admin.bank')
    .controller('BankAddUpdatePopupController', BankAddUpdatePopupController);
  /** @nginject */
  function BankAddUpdatePopupController($mdDialog, $q, data, CORE, USER, DialogFactory, BaseService, BankFactory, ChartOfAccountsFactory, $scope) {
    const vm = this;
    vm.bank = {
      id: data ? data.id : null,
      isActive : true
    };
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.CORE_TypeOfAccount = CORE.TypeOfAccount;
    vm.CORE_CreditDebitType = CORE.CreditDebitType;

    const initAutoComplete = () => {
      vm.autoCompleteTypeOfAccount = {
        columnName: 'name',
        keyColumnName: 'id',
        keyColumnId: vm.bank ? vm.bank.typeOfAccount : null,
        inputName: 'Type of Account',
        placeholderName: 'Type of Account',
        isRequired: true,
        isAddnew: false
      };
      vm.autoCompleteCreditDebitType = {
        columnName: 'name',
        keyColumnName: 'id',
        keyColumnId: vm.bank ? vm.bank.creditDebitType : null,
        inputName: 'Credit Debit Type',
        placeholderName: 'Credit Debit Type',
        isRequired: true,
        isAddnew: false
      };
      vm.autoCompleteAcctMaster = {
        columnName: 'chartOfAccountDisplayName',
        controllerName: CORE.MANAGE_CHART_OF_ACCOUNTS_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_CHART_OF_ACCOUNTS_MODAL_VIEW,
        keyColumnName: 'acct_id',
        keyColumnId: vm.bank ? vm.bank.acctId : null,
        inputName: 'Chart of Accounts',
        placeholderName: 'Chart of Accounts',
        addData: {
          popupAccessRoutingState: [USER.ADMIN_CHART_OF_ACCOUNTS_STATE],
          pageNameAccessLabel: CORE.PageName.ChartOfAccounts,
          headerTitle: CORE.Chart_of_Accounts.SINGLELABEL
        },
        isRequired: true,
        isAddnew: true,
        callbackFn: getChartOfAccountBySearch,
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.bank.acctId = item.acct_id;
          }
          else {
            $scope.$broadcast(vm.autoCompleteAcctMaster.inputName, null);
          }
        },
        onSearchFn: (query) => getChartOfAccountBySearch({ searchString: query })
      };
    };

    vm.checkBankUnique = (isAccountNumber) => {
      if (isAccountNumber && vm.bank.accountNumber && vm.bank.accountNumber <= 0) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.INVALID_DYNAMIC);
        messageContent.message = stringFormat(messageContent.message, 'Account number');
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        return DialogFactory.messageAlertDialog(model).then((yes) => {
          if (yes) {
            vm.bank.accountNumber = null;
            setFocus('accountNumber');
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      if (vm.bank.bankName && vm.bank.accountNumber) {
        const checkObj = {
          id: vm.bank.id,
          bankName: vm.bank.bankName,
          accountNumber: vm.bank.accountNumber,
          bankValidation:true
        };
        BankFactory.checkBankUnique().query(checkObj).$promise.then((response) => {
          if (response.data && response.data) {
            duplicateBankMessage();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.checkAccountCodeUnique = () => {
      if (vm.bank.accountCode) {
        const checkObj = {
          id: vm.bank.id,
          accountCode: vm.bank.accountCode,
          accountCodeValidation : true
        };
        BankFactory.checkBankUnique().query(checkObj).$promise.then((response) => {
          if (response.data && response.data) {
            duplicateBankAccountCodeMessage();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    const duplicateBankMessage = () => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
      messageContent.message = stringFormat(messageContent.message, vm.bank.id ? 'Bank Name' : 'Account Number');
      const model = {
        messageContent: messageContent,
        multiple: true
      };
      return DialogFactory.messageAlertDialog(model).then(() => {
        if (vm.bank.id) {
          vm.bank.bankName = null;
          setFocus('bankName');
        } else {
          vm.bank.accountNumber = vm.bank.confirmAccountNumber = null;
          setFocus('accountNumber');
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const duplicateBankAccountCodeMessage = () => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
      messageContent.message = stringFormat(messageContent.message, vm.bank.id ? 'Bank Name' : 'Account Code');
      const model = {
        messageContent: messageContent,
        multiple: true
      };
      return DialogFactory.messageAlertDialog(model).then(() => {
        if (vm.bank.id) {
          vm.bank.bankName = null;
          setFocus('bankName');
        } else {
          vm.bank.accountCode = vm.bank.accountCode = null;
          setFocus('accountCode');
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const getChartOfAccountBySearch = (searchObj) => ChartOfAccountsFactory.getChartOfAccountBySearch().query(searchObj).$promise.then((chartofAccount) => {
      if (chartofAccount) {
        _.each(chartofAccount.data, (item) => item.chartOfAccountDisplayName = item.acct_code ? stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.acct_code, item.acct_name) : item.acct_name);
        if (searchObj && searchObj.acct_id) {
          $scope.$broadcast(vm.autoCompleteAcctMaster.inputName, chartofAccount.data[0]);
        }
        return chartofAccount.data;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    vm.getBankByID = () => {
      vm.cgBusyLoading = BankFactory.getBankByID().query({ id: vm.bank.id }).$promise.then((response) => {
        if (response.data && response.data) {
          vm.bank = response.data;
          if (vm.bank.acctId) {
            getChartOfAccountBySearch({
              acct_id: vm.bank.acctId
            });
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const promiseArray = [];
    if (vm.bank.id) {
      promiseArray.push(vm.getBankByID());
    }
    vm.cgBusyLoading = $q.all(promiseArray).then(() => {
      initAutoComplete();
    }).catch((error) => BaseService.getErrorLog(error));

    vm.saveBank = () => {
      vm.isSavebtnDisable = true;
      if (BaseService.focusRequiredField(vm.bankForm)) {
        vm.isSavebtnDisable = false;
        return;
      }
      vm.bank.bankValidation = vm.bank.accountCodeValidation = true;
      vm.bank.typeOfAccount = vm.autoCompleteTypeOfAccount.keyColumnId || null;
      vm.bank.creditDebitType = vm.autoCompleteCreditDebitType.keyColumnId || null;
      vm.bank.acctId = vm.autoCompleteAcctMaster.keyColumnId || null;

      vm.cgBusyLoading = BankFactory.saveBank().query(vm.bank).$promise.then((response) => {
        if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          BaseService.currentPagePopupForm.pop();
          $mdDialog.cancel(response.data);
        } else if (response.status === CORE.ApiResponseTypeStatus.EMPTY && response.errors.data && response.errors.data.duplicateBank) {
          duplicateBankMessage();
        } else if (response.status === CORE.ApiResponseTypeStatus.EMPTY && response.errors.data && response.errors.data.duplicateCode) {
          duplicateBankAccountCodeMessage();
        }
      }).catch((error) => BaseService.getErrorLog(error)).finally(() => {
        vm.isSavebtnDisable = false;
      });
    };

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    vm.goToChartOfAccountList = () => {
      BaseService.goToChartOfAccountList();
    };

    vm.cancel = () => {
      if (vm.bankForm.$dirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.bankForm);
    });
  }
})();
