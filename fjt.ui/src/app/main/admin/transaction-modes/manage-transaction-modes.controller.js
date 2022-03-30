
(function () {
  'use strict';

  angular
    .module('app.admin.transactionmodes')
    .controller('ManageTransactionModesController', ManageTransactionModesController);

  /** @ngInject */
  function ManageTransactionModesController($state, $q, $mdDialog, $scope, $stateParams, $timeout, USER, TransactionModesFactory, CORE, ChartOfAccountsFactory, DialogFactory, BaseService) {
    const vm = this;
    vm.tabName = $stateParams.tabName ? $stateParams.tabName.toLowerCase() : USER.TransactionModesTabs.Payable.Name;
    vm.transactionModeId = $stateParams.id ? parseInt($stateParams.id) : null;
    vm.transactionModesTabs = USER.TransactionModesTabs;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.selectedTab = _.find(USER.TransactionModesTabs, (tabs) => tabs.Name === vm.tabName);
    vm.disabledSystemGenerated = false;
    vm.manageTransactionMode = { isActive: true };
    vm.saveBtnFlag = false;
    vm.descriptionMaxLength = _maxLengthForDescription;
    vm.RadioGroup = {
      isActive: {
        array: CORE.ActiveRadioGroup
      }
    };

    /* Return list of TransactionMode by Modetype and searchObj. */
    const getAllTransactionModeByModeType = (searchObj) => {
      const transInfo = {
        modeType: vm.selectedTab.modeType,
        searchObj: (searchObj ? searchObj : null)
      };
      return TransactionModesFactory.getTransModeList().query({ transInfo: transInfo }).$promise.then((transactionmodes) => {
        if (transactionmodes && transactionmodes.data && transactionmodes.data.customerTransModeNameList) {
          return $q.resolve(angular.copy(transactionmodes.data.customerTransModeNameList));
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* Autocomplete for TransactionModeList. */
    vm.autoCompleteTransactionModeList = {
      columnName: 'modeName',
      keyColumnName: 'id',
      keyColumnId: null,
      inputName: 'id',
      placeholderName: 'Type here to search',
      isRequired: false,
      isDisabled: false,
      isAddnew: false,
      onSelectCallbackFn: (item) => {
        if (item) {
          vm.addUpdateTransactionMode(item.id);
          $scope.$broadcast(vm.autoCompleteTransactionModeList.inputName, null);
        }
      },
      onSearchFn: function (query) {
        const searchobj = {
          searchQuery: query
        };
        return getAllTransactionModeByModeType(searchobj);
      }
    };

    /* Return list of Accounts by searchObj. */
    const getChartOfAccountBySearch = (searchObj) => ChartOfAccountsFactory.getChartOfAccountBySearch().query(searchObj).$promise.then((chartofAccount) => {
      if (chartofAccount && chartofAccount.data) {
        _.each(chartofAccount.data, (item) => item.chartOfAccountDisplayName = item.acct_code ? stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.acct_code, item.acct_name) : item.acct_name);
        if (searchObj && searchObj.acct_id) {
          $scope.$broadcast(vm.autoCompleteAcctMaster.inputName, chartofAccount.data[0]);
        }
        return chartofAccount.data;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    /* Autocomplete for Account Master. */
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
      isRequired: false,
      isAddnew: true,
      callbackFn: getChartOfAccountBySearch,
      onSelectCallbackFn: (item) => {
        if (!item) {
          vm.manageTransactionMode.ref_acctid = item.acct_id;
        }
      },
      onSearchFn: (query) => getChartOfAccountBySearch({ searchString: query })
    };

    /* retrieve TransactionMode Details */
    const getTransactionModeDetails = () => {
      if (vm.transactionModeId) {
        vm.cgBusyLoading = TransactionModesFactory.getTransactionModeByID().query({ id: vm.transactionModeId }).$promise.then((transactionmode) => {
          if (transactionmode && transactionmode.data) {
            vm.oldTransactionModedata = transactionmode.data;
            vm.manageTransactionMode = angular.copy(transactionmode.data);
            if (vm.manageTransactionMode && vm.manageTransactionMode.systemGenerated) {
              vm.disabledSystemGenerated = true;
            }
            $timeout(() => {
              if (vm.manageTransactionMode && vm.manageTransactionMode.acct_acctmst && vm.manageTransactionMode.acct_acctmst.acct_id) {
                const searchObj = {
                  acct_id: vm.manageTransactionMode.acct_acctmst.acct_id
                };
                getChartOfAccountBySearch(searchObj);
              }
              if (vm.transactionModeId && vm.manageTransactionModeForm) {
                BaseService.checkFormValid(vm.manageTransactionModeForm, false);
              }
            }, 0);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    getTransactionModeDetails();

    /* get Title / Tooltip name */
    vm.getTitleTooltipName = () => vm.manageTransactionMode.modeName ? ': ' + angular.copy(vm.manageTransactionMode.modeName) : ' ';

    /* Goto Account List page. */
    vm.goToChartOfAccountList = () => {
      BaseService.goToChartOfAccountList();
    };

    /* Goto Manage Page of TransactionMode. */
    vm.addUpdateTransactionMode = (TransModeId, openINSameTab) => {
      BaseService.goToManageTransactionModes(vm.tabName, TransModeId, openINSameTab);
      $timeout(() => {
        vm.autoCompleteTransactionModeList.keyColumnId = null;
      }, true);
    };

    /* check transaction Mode Already Exists. */
    vm.checkTransactionModeAlreadyExists = (validateName) => {
      const checkForDuplicate = vm.oldTransactionModedata ? (validateName ? (vm.oldTransactionModedata.modeName === vm.manageTransactionMode.modeName ? false : true) : (vm.oldTransactionModedata.modeCode === vm.manageTransactionMode.modeCode ? false : true)) : true;
      if (checkForDuplicate) {
        const objs = {
          modeName: validateName ? vm.manageTransactionMode.modeName : null,
          modeCode: validateName ? null : vm.manageTransactionMode.modeCode,
          modeType: vm.selectedTab.modeType,
          id: vm.transactionModeId
        };
        TransactionModesFactory.checkTransactionModeUnique().query(objs).$promise.then((response) => {
          if (response && response.data) {
            duplicateTrnasactionModeMessage(response.data);
          }
        }).catch((error) => {
          BaseService.getErrorLog(error);
        });
      }
    };

    /* Display duplicate TrnasactionMode Message */
    const duplicateTrnasactionModeMessage = (validationResponse) => {
      var duplicateFieldName = null;
      if (vm.manageTransactionMode.modeName && vm.manageTransactionMode.modeName === validationResponse.modeName) {
        duplicateFieldName = 'Name';
      }
      else if (vm.manageTransactionMode.modeCode && vm.manageTransactionMode.modeCode === validationResponse.modeCode) {
        duplicateFieldName = 'Code';
      }
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
      messageContent.message = stringFormat(messageContent.message, vm.selectedTab.addButtonLabel + ' ' + duplicateFieldName);
      const model = {
        messageContent: messageContent,
        multiple: true
      };
      return DialogFactory.messageAlertDialog(model).then(() => {
        if (duplicateFieldName === 'Name') {
          vm.manageTransactionMode.modeName = null;
          setFocus('modeName');
        } else if (duplicateFieldName === 'Code') {
          vm.manageTransactionMode.modeCode = null;
          setFocus('modeCode');
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* save Transaction Mode */
    vm.SaveTransactionMode = () => {
      vm.saveBtnFlag = true;
      //vm.isSubmit = false;
      if (BaseService.focusRequiredField(vm.manageTransactionModeForm)) {
        //vm.isSubmit = true;
        vm.saveBtnFlag = false;
        return;
      }

      const transactionModeInfo = {
        id: vm.transactionModeId,
        modeType: vm.selectedTab.modeType,
        modeCode: vm.manageTransactionMode.modeCode,
        modeName: vm.manageTransactionMode.modeName,
        // displayOrder: vm.manageTransactionMode.displayOrder,
        isActive: vm.manageTransactionMode.isActive || false,
        description: vm.manageTransactionMode.description,
        ref_acctid: vm.autoCompleteAcctMaster.keyColumnId
      };

      vm.cgBusyLoading = TransactionModesFactory.saveTransactionMode().save(transactionModeInfo).$promise.then((res) => {
        if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS && res.data) {
          vm.transactionModeId = res.data.id;
          $state.transitionTo($state.$current, { id: vm.transactionModeId }, { location: true, inherit: true, notify: false });
          //genericcategoryDetails(); // get latest details
          vm.manageTransactionModeForm.$setPristine();
        } else if (res && res.status !== CORE.ApiResponseTypeStatus.SUCCESS && res.errors && res.errors.data && res.errors.data.modeName) {
          duplicateTrnasactionModeMessage(res.errors.data);
        }
        vm.saveBtnFlag = false;
      }).catch((error) => {
        vm.saveBtnFlag = false;
        return BaseService.getErrorLog(error);
      });
    };

    /* goto TransactionModes List Page. */
    vm.goToTransactionModesList = (openINSameTab) => {
      BaseService.goToTransactionModesList(vm.selectedTab.Name, openINSameTab);
    };

    /* go back to list page */
    vm.goBack = () => {
      vm.goToTransactionModesList(true);
    };

    /* get Max length validation message. */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    /* close popup on page destroy */
    $scope.$on('$destroy', () => $mdDialog.hide(false, { closeAll: true }));

    angular.element(() => BaseService.currentPageForms = [vm.manageTransactionModeForm]);
  }
})();
