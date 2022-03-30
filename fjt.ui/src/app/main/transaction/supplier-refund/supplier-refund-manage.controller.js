(function () {
  'use strict';

  angular
    .module('app.transaction.supplierInvoice')
    .controller('SupplierRefundManageController', SupplierRefundManageController);

  /** @ngInject */
  function SupplierRefundManageController($state, $q, $mdDialog, $scope, $stateParams, $timeout, DialogFactory, BaseService, CORE, USER, PackingSlipFactory, TRANSACTION) {
    const vm = this;
    vm.id = $stateParams.id ? parseInt($stateParams.id) : null;
    vm.tabName = $stateParams.selectedTab;
    vm.stateParamMfgCodeId = $stateParams.mfgcodeid || null;
    vm.stateParamMemoId = $stateParams.memoid || null;
    vm.IsDetailTab = false;
    vm.IsDocumentTab = false;
    vm.selectedTabIndex;
    vm.documentCount = 0;
    vm.saveBtnDisableFlag = false;
    vm.displayRefundDetail = {};
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.isRefundLocked = false;
    vm.lockStatus = '';
    vm.lockByName = '';
    vm.lockedAt = '';
    vm.TRANSACTION = TRANSACTION;
    vm.loginUser = BaseService.loginUser;

    vm.supplierInvoiceRefundTabs = TRANSACTION.SupplierInvoiceRefundTabs;
    vm.entityName = CORE.AllEntityIDS.SupplierInvoiceRefund.Name;

    vm.pageTabRights = [
      {
        DetailTab: { hasPermission: false, isReadOnly: false },
        DocumentTab: { hasPermission: false, isReadOnly: false }
      }
    ];
    const getAllRights = () => {
      vm.allowToVoidAndReIssuePaymentFeature = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToVoidAndReIssueRefund);
      if ((vm.enableInvoicePayment === null || vm.enableInvoicePayment === undefined ||
        vm.allowToVoidAndReIssuePaymentFeature === null || vm.allowToVoidAndReIssuePaymentFeature === undefined) &&
        (vm.reTryCount < _configGetFeaturesRetryCount)) {
        vm.reTryCount++;
        getAllRights(); // put for hard reload option as it will not get data from feature rights
      }
    };

    getAllRights();

    function getDisplayRefunDetail() {
      if (vm.id) {
        const listObj = {
          paymentId: vm.id
        };
        vm.cgBusyLoading = PackingSlipFactory.getSupplierMemoListForRefund().query(listObj).$promise.then((response) => {
          if (response.status === CORE.ApiResponseTypeStatus.SUCCESS && response && response.data) {
            vm.displayRefundDetail = response.data.refundMaster[0];
            if (vm.displayRefundDetail.lockStatus === TRANSACTION.CustomerPaymentLockStatus.Locked && !vm.loginUser.isUserSuperAdmin) {
              vm.isRefundLocked = true;
            } else {
              vm.isRefundLocked = false;
            }
            vm.lockStatus = vm.displayRefundDetail.lockStatus;
            vm.lockByName = vm.displayRefundDetail.lockByName;
            vm.lockedAt = vm.displayRefundDetail.lockedAt;
          }
          return $q.resolve();
        }).catch((error) => BaseService.getErrorLog(error));
      }
    }

    function setTabWisePageRights(pageList) {
      var tab;
      if (pageList && pageList.length > 0) {
        tab = pageList.find((a) => a.PageDetails && a.PageDetails.pageRoute === TRANSACTION.TRANSACTION_INVOICE_MANAGE_REFUND_DETAIL_STATE);
        if (tab) {
          vm.pageTabRights[0].DetailTab.hasPermission = tab.isActive ? true : false;
          vm.pageTabRights[0].DetailTab.isReadOnly = tab.RO ? true : false;
        }
        tab = pageList.find((a) => a.PageDetails && a.PageDetails.pageRoute === TRANSACTION.TRANSACTION_INVOICE_MANAGE_REFUND_DOCUMENT_STATE);
        if (tab) {
          vm.pageTabRights[0].DocumentTab.hasPermission = tab.isActive ? true : false;
          vm.pageTabRights[0].DocumentTab.isReadOnly = tab.RO ? true : false;
        }
      }
    }

    function getDocumentCount(id, type) {
      vm.documentCount = 0;
      if (id && type) {
        vm.cgBusyLoading = PackingSlipFactory.getPackingSlipDocumentCount().query({
          id: id, type: type
        }).$promise.then((response) => {
          if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            vm.documentCount = response.data;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    }
    function getPaymentNumberHeaderSearch(searchObj) {
      return PackingSlipFactory.getPackingSlipInvoice().query({ search: searchObj }).$promise.then((invoice) => {
        if (invoice && invoice.data) {
          return invoice.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const onSelectPaymentNumber = (item) => {
      if (item) {
        $state.go(TRANSACTION.TRANSACTION_INVOICE_MANAGE_REFUND_DETAIL_STATE, { id: item.id });
      }
    };

    vm.autoCompletePaymentNumber = {
      columnName: 'formattedTransNumber',
      keyColumnName: 'id',
      keyColumnId: null,
      inputName: 'paymentNumber',
      placeholderName: 'Payment#',
      isRequired: false,
      isAddnew: false,
      onSelectCallbackFn: onSelectPaymentNumber,
      onSearchFn: function (query) {
        const searchobj = {
          receiptType: 'RR',
          searchquery: query
        };
        return getPaymentNumberHeaderSearch(searchobj);
      }
    };

    $timeout(() => {
      $scope.$on(USER.LoginUserPageListBroadcast, (event, data) => {
        setTabWisePageRights(data);
        $scope.$applyAsync();
      });

      if (vm.id && vm.tabName !== TRANSACTION.SupplierInvoiceRefundTabs.Detail.Name) {
        getDisplayRefunDetail();
      }
      if (vm.id && vm.tabName !== TRANSACTION.SupplierInvoiceRefundTabs.Document.Name) {
        getDocumentCount(vm.id, vm.entityName);
      }
    });

    if (BaseService.loginUserPageList && BaseService.loginUserPageList.length > 0) {
      setTabWisePageRights(BaseService.loginUserPageList);
    }

    if (vm.tabName) {
      const tab = _.find(vm.supplierInvoiceRefundTabs, (item) => item.Name === vm.tabName);
      if (tab) {
        vm.selectedTabIndex = tab.ID;
      }
    }

    vm.stateTransfer = (tabIndex) => {
      var itemTabName = _.find(vm.supplierInvoiceRefundTabs, (valItem) => valItem.ID === tabIndex);
      if (itemTabName && itemTabName.Name !== vm.tabName) {
        switch (itemTabName.Name) {
          case TRANSACTION.SupplierInvoiceRefundTabs.Detail.Name:
            $state.go(TRANSACTION.TRANSACTION_INVOICE_MANAGE_REFUND_DETAIL_STATE, { id: vm.id });
            break;
          case TRANSACTION.SupplierInvoiceRefundTabs.Document.Name:
            $state.go(TRANSACTION.TRANSACTION_INVOICE_MANAGE_REFUND_DOCUMENT_STATE, { id: vm.id });
            break;
          default:
        }
      }
    };

    /* Show save alert popup when performing tab change*/
    function showWithoutSavingAlertforTabChange(step, form) {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      return DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          switch (step) {
            case 0:
              vm.supplierRefundDetailForm.$setPristine();
              return true;
              break;
            case 1:
              return true;
              break;
          }
        }
      }, () => {
        if (form) {
          /*Set focus on first enabled field when user click stay on button*/
          BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(form);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    vm.isStepValid = (step) => {
      switch (step) {
        case vm.supplierInvoiceRefundTabs.Detail.ID:
          if (vm.supplierRefundDetailForm.$dirty) {
            return showWithoutSavingAlertforTabChange(step, vm.supplierRefundDetailForm);
          }
          else {
            return true;
          }
          break;
        case vm.supplierInvoiceRefundTabs.Document.ID: {
          break;
        }
      }
    };


    vm.onTabChanges = (TabName, msWizard) => {
      vm.IsDetailTab = TabName === vm.supplierInvoiceRefundTabs.Detail.Name;
      vm.IsDocumentTab = TabName === vm.supplierInvoiceRefundTabs.Document.Name;
      msWizard.selectedIndex = vm.selectedTabIndex;
      vm.stateTransfer(vm.selectedTabIndex);
      $('#content').animate({ scrollTop: 0 }, 200);
    };

    vm.saveDetails = () => {
      if (!vm.IsDetailTab || vm.saveBtnDisableFlag || vm.displayRefundDetail.isPaymentVoided || vm.isRefundLocked || (vm.pageTabRights && vm.pageTabRights.length > 0 && vm.pageTabRights[0].DetailTab && vm.pageTabRights[0].DetailTab.isReadOnly)) {
        return;
      }
      $scope.$broadcast(USER.SupplierInvoiceRefundDetailSaveBroadcast);
    };

    vm.voidRefundTransaction = () => {
      if (!vm.id || vm.displayRefundDetail.isPaymentVoided || vm.saveBtnDisableFlag || !vm.allowToVoidAndReIssuePaymentFeature || vm.supplierRefundDetailForm.$dirty || vm.isRefundLocked || (vm.pageTabRights && vm.pageTabRights.length > 0 && vm.pageTabRights[0].DetailTab && vm.pageTabRights[0].DetailTab.isReadOnly)) {
        return;
      }
      $scope.$broadcast(USER.SupplierInvoiceRefundVoidAndReleaseInvoiceGroupBroadcast);
    };

    vm.voidAndReIssueRefundTransaction = (ev) => {
      if (!vm.id || vm.displayRefundDetail.isPaymentVoided || vm.saveBtnDisableFlag || !vm.allowToVoidAndReIssuePaymentFeature || vm.supplierRefundDetailForm.$dirty || vm.isRefundLocked || (vm.pageTabRights && vm.pageTabRights.length > 0 && vm.pageTabRights[0].DetailTab && vm.pageTabRights[0].DetailTab.isReadOnly)) {
        return;
      }
      vm.saveBtnDisableFlag = true;
      const PopupData = {
        packingSlipData: {
          paymentId: vm.id,
          isVoidAndReIssuePayment: true,
          refVoidPaymentOrCheckNumber: vm.displayRefundDetail.paymentNumber
        },
        supplierDet: {
          supplierCode: vm.displayRefundDetail.mfgName,
          mfgCodeID: vm.displayRefundDetail.mfgcodeID
        },
        skipFocusOnFirstElement: true
      };

      DialogFactory.dialogService(
        TRANSACTION.INVOICE_REFUND_POPUP_CONTROLLER,
        TRANSACTION.INVOICE_REFUND_POPUP_VIEW,
        ev,
        PopupData).then(() => {
          vm.saveBtnDisableFlag = false;
        }, (resp) => {
          if (resp && resp.isPaymentVoided) {
            vm.displayRefundDetail.isPaymentVoided = true;
          }
          vm.saveBtnDisableFlag = false;
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.paymentHistory = (ev) => {
      if (!vm.id) {
        return;
      }
      DialogFactory.dialogService(
        CORE.SUPPLIER_INVOICE_PAYMENT_HISTORY_CONTROLLER,
        CORE.SUPPLIER_INVOICE_PAYMENT_HISTORY_VIEW,
        ev,
        vm.displayRefundDetail).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };

    function showWithoutSavingAlertforBackButton(callback, form) {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          if (callback) {
            callback();
          }
          else {
            if (form && form.$dirty) {
              form.$setPristine();
            }
            $state.go(TRANSACTION.TRANSACTION_INVOICE_REFUND_STATE);
          }
        }
      }, () => {
        if (form) {
          /*Set focus on first enabled field when user click stay on button*/
          BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(form);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    vm.addRefund = (isOpenInNewTab) => {
      if (vm.pageTabRights && vm.pageTabRights.length > 0 && vm.pageTabRights[0].DetailTab && (!vm.pageTabRights[0].DetailTab.hasPermission || vm.pageTabRights[0].DetailTab.isReadOnly)) {
        return;
      }
      if (isOpenInNewTab) {
        BaseService.goToSupplierRefundDetail(null);
      } else {
        $state.go(TRANSACTION.TRANSACTION_INVOICE_MANAGE_REFUND_DETAIL_STATE, { id: null });
      }
    };

    vm.goToSupplierList = () => {
      BaseService.goToSupplierList();
    };
    vm.goToSupplierDetail = () => {
      BaseService.goToSupplierDetail(vm.displayRefundDetail.mfgcodeID);
    };

    /* go to Transaction Mode list page */
    vm.goToTransactionModeList = () => {
      BaseService.goToTransactionModesList(USER.TransactionModesTabs.Receivable.Name, false);
    };
    /* go to Transaction Mode Manage page */
    vm.goToTransactionModeDetail = () => {
      BaseService.goToManageTransactionModes(USER.TransactionModesTabs.Receivable.Name, vm.displayRefundDetail.refGencTransModeID, false);
    };

    //go back to list page
    vm.goBack = () => {
      switch (vm.selectedTabIndex) {
        case vm.supplierInvoiceRefundTabs.Detail.ID:
          if (BaseService.checkFormDirty(vm.supplierRefundDetailForm)) {
            showWithoutSavingAlertforBackButton(null, vm.supplierRefundDetailForm);
          } else {
            BaseService.currentPageForms = [];
            $state.go(TRANSACTION.TRANSACTION_INVOICE_REFUND_STATE);
          }
          break;
        default:
          BaseService.currentPageForms = [];
          $state.go(TRANSACTION.TRANSACTION_INVOICE_REFUND_STATE);
          break;
      }
    };

    $scope.$on('documentCount', (event, documentCount) => {
      vm.documentCount = documentCount;
    });

    $scope.$on('$destroy', () => {
    });

    angular.element(() => {
    });
  }
})();
