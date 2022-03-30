(function () {
  'use strict';

  angular
    .module('app.transaction.supplierInvoice')
    .controller('SupplierPaymentManageController', SupplierPaymentManageController);

  /** @ngInject */
  function SupplierPaymentManageController($state, $q, $scope, $stateParams, $filter, $timeout, DialogFactory, BaseService, CORE, USER, PackingSlipFactory, TRANSACTION, ReportMasterFactory) {
    const vm = this;
    vm.id = $stateParams.id ? parseInt($stateParams.id) : null;
    vm.tabName = $stateParams.selectedTab;
    vm.IsDetailTab = false;
    vm.IsDocumentTab = false;
    vm.isCurrentTabReadOnly = false;
    vm.selectedTabIndex;
    vm.documentCount = 0;
    vm.saveBtnDisableFlag = false;
    vm.displayPaymentDetail = { paymentId: vm.id };
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.isPaymentLocked = false;
    vm.lockStatus = '';
    vm.lockByName = '';
    vm.lockedAt = '';
    vm.TRANSACTION = TRANSACTION;
    vm.loginUser = BaseService.loginUser;

    vm.supplierInvoicePaymentTabs = TRANSACTION.SupplierInvoicePaymentTabs;
    vm.entityName = CORE.AllEntityIDS.SupplierInvoicePayment.Name;

    vm.pageTabRights = [
      {
        DetailTab: { hasPermission: false, isReadOnly: false },
        DocumentTab: { hasPermission: false, isReadOnly: false }
      }
    ];
    const getAllRights = () => {
      vm.allowToVoidAndReIssuePaymentFeature = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToVoidAndReIssuePayment);
      if ((vm.enableInvoicePayment === null || vm.enableInvoicePayment === undefined ||
        vm.allowToVoidAndReIssuePaymentFeature === null || vm.allowToVoidAndReIssuePaymentFeature === undefined) &&
        (vm.reTryCount < _configGetFeaturesRetryCount)) {
        vm.reTryCount++;
        getAllRights(); // put for hard reload option as it will not get data from feature rights
      }
    };

    getAllRights();

    if (vm.tabName) {
      const tab = _.find(vm.supplierInvoicePaymentTabs, (item) => item.Name === vm.tabName);
      if (tab) {
        vm.selectedTabIndex = tab.ID;
      }
    }

    function setTabWisePageRights(pageList) {
      var tab;
      if (pageList && pageList.length > 0) {
        tab = pageList.find((a) => a.PageDetails && a.PageDetails.pageRoute === TRANSACTION.TRANSACTION_INVOICE_MANAGE_PAYMENT_DETAIL_STATE);
        if (tab) {
          vm.pageTabRights[0].DetailTab.hasPermission = tab.isActive ? true : false;
          vm.pageTabRights[0].DetailTab.isReadOnly = tab.RO ? true : false;
        }
        tab = pageList.find((a) => a.PageDetails && a.PageDetails.pageRoute === TRANSACTION.TRANSACTION_INVOICE_MANAGE_PAYMENT_DOCUMENT_STATE);
        if (tab) {
          vm.pageTabRights[0].DocumentTab.hasPermission = tab.isActive ? true : false;
          vm.pageTabRights[0].DocumentTab.isReadOnly = tab.RO ? true : false;
        }
        switch (vm.selectedTabIndex) {
          case vm.supplierInvoicePaymentTabs.Detail.ID:
            vm.isCurrentTabReadOnly = vm.pageTabRights[0].DetailTab.isReadOnly;
            break;
          case vm.supplierInvoicePaymentTabs.Document.ID:
            vm.isCurrentTabReadOnly = vm.pageTabRights[0].DocumentTab.isReadOnly;
            break;
          default:
            break;
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
        $state.go(TRANSACTION.TRANSACTION_INVOICE_MANAGE_PAYMENT_DETAIL_STATE, { id: item.id });
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
          receiptType: 'SP',
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

      if (vm.id && vm.tabName !== TRANSACTION.SupplierInvoicePaymentTabs.Document.Name) {
        getDocumentCount(vm.id, vm.entityName);
      }
    });

    if (BaseService.loginUserPageList && BaseService.loginUserPageList.length > 0) {
      setTabWisePageRights(BaseService.loginUserPageList);
    }


    vm.stateTransfer = (tabIndex) => {
      var itemTabName = _.find(vm.supplierInvoicePaymentTabs, (valItem) => valItem.ID === tabIndex);
      if (itemTabName && itemTabName.Name !== vm.tabName) {
        switch (itemTabName.Name) {
          case TRANSACTION.SupplierInvoicePaymentTabs.Detail.Name:
            $state.go(TRANSACTION.TRANSACTION_INVOICE_MANAGE_PAYMENT_DETAIL_STATE, { id: vm.id });
            break;
          case TRANSACTION.SupplierInvoicePaymentTabs.Document.Name:
            $state.go(TRANSACTION.TRANSACTION_INVOICE_MANAGE_PAYMENT_DOCUMENT_STATE, { id: vm.id });
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
              vm.formPaidPackaging.$setPristine();
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
        case vm.supplierInvoicePaymentTabs.Detail.ID:
          if (vm.formPaidPackaging && vm.formPaidPackaging.$dirty) {
            return showWithoutSavingAlertforTabChange(step, vm.formPaidPackaging);
          }
          else {
            return true;
          }
          break;
        case vm.supplierInvoicePaymentTabs.Document.ID: {
          break;
        }
      }
    };


    vm.onTabChanges = (TabName, msWizard) => {
      if (TabName === vm.supplierInvoicePaymentTabs.Detail.Name) {
        vm.IsDetailTab = true;
      } else {
        vm.IsDetailTab = false;
      }
      if (TabName === vm.supplierInvoicePaymentTabs.Document.Name) {
        vm.IsDocumentTab = true;
      }
      else {
        vm.IsDocumentTab = false;
      }
      msWizard.selectedIndex = vm.selectedTabIndex;
      vm.stateTransfer(vm.selectedTabIndex);
      $('#content').animate({ scrollTop: 0 }, 200);
    };

    vm.saveDetails = () => {
      switch (vm.selectedTabIndex) {
        case vm.supplierInvoicePaymentTabs.Detail.ID:
          $scope.$broadcast(USER.SupplierInvoicePaymentSaveBroadcase);
          break;
        default:
          break;
      }
    };

    vm.voidPaymentTransaction = () => {
      $scope.$broadcast(USER.SupplierInvoiceVoidPaymentBroadcast);
    };

    $scope.$on(USER.SupplierInvoiceVoidPaymentSaveSuccessBroadcast, () => {
      if (vm.formPaidPackaging && vm.formPaidPackaging.$dirty) {
        vm.formPaidPackaging.$setPristine();
      }
      if (!vm.displayPaymentDetail) {
        vm.displayPaymentDetail = { paymentId: vm.id };
      }
      vm.displayPaymentDetail.isPaymentVoided = true;
    });

    vm.voidAndReIssuePaymentTransaction = () => {
      $scope.$broadcast(USER.SupplierInvoiceVoidAndReIssuePaymentBroadcast, null);
    };

    vm.paymentHistory = (ev) => {
      DialogFactory.dialogService(
        CORE.SUPPLIER_INVOICE_PAYMENT_HISTORY_CONTROLLER,
        CORE.SUPPLIER_INVOICE_PAYMENT_HISTORY_VIEW,
        ev,
        vm.displayPaymentDetail).then(() => {
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
            $state.go(TRANSACTION.TRANSACTION_INVOICE_PAYMENT_STATE);
          }
        }
      }, () => {
        if (form) {
          /*Set focus on first enabled field when user click stay on button*/
          BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(form);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    vm.addPayment = () => {
      $state.go(TRANSACTION.TRANSACTION_INVOICE_MANAGE_PAYMENT_DETAIL_STATE, { id: null });
    };

    vm.goToSupplierList = () => {
      BaseService.goToSupplierList();
    };
    vm.goToSupplierDetail = () => {
      BaseService.goToSupplierDetail(vm.displayPaymentDetail.mfgcodeID);
    };

    vm.goToPaymentMethodDetail = () => {
      BaseService.openInNew(USER.ADMIN_PAYMENT_METHODS_MANAGEGENERICCATEGORY_STATE, { gencCategoryID: vm.displayPaymentDetail.paymentType });
    };

    vm.goToPaymentMethodList = () => {
      BaseService.goToGenericCategoryPayablePaymentMethodList();
    };

    //go back to list page
    vm.goBack = () => {
      switch (vm.selectedTabIndex) {
        case vm.supplierInvoicePaymentTabs.Detail.ID:
          if (BaseService.checkFormDirty(vm.formPaidPackaging)) {
            showWithoutSavingAlertforBackButton(null, vm.formPaidPackaging);
          } else {
            BaseService.currentPageForms = [];
            $state.go(TRANSACTION.TRANSACTION_INVOICE_PAYMENT_STATE);
          }
          break;
        default:
          BaseService.currentPageForms = [];
          $state.go(TRANSACTION.TRANSACTION_INVOICE_PAYMENT_STATE);
          break;
      }
    };

    vm.printCheck = (isRemittanceReport) => {
      if ((!isRemittanceReport || isRemittanceReport === false) &&
        (!vm.displayPaymentDetail.paymentAmount || vm.displayPaymentDetail.paymentAmount === 0)) {
        const alertModel = {
          messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.IN_CASE_OF_ZERO_PAYMENT_CHECK_PRINT_NOT_REQUIRED
        };
        DialogFactory.messageAlertDialog(alertModel);
        return;
      }

      const isDownload = false;
      if (isRemittanceReport) {
        vm.isPrintRemittDisabled = true;
      } else {
        vm.isPrintDisabled = true;
      }
      const paramObj = {
        paymentId: vm.id,
        isRemittanceReport: isRemittanceReport ? isRemittanceReport : false,
        reportAPI: 'PackingSlip/checkPrintAndRemittanceReport'
      };
      ReportMasterFactory.generateReport(paramObj).then((response) => {
        const model = {
          multiple: true
        };
        if (isRemittanceReport) {
          vm.isPrintRemittDisabled = false;
        } else {
          vm.isPrintDisabled = false;
        }
        if (response.status === 404) {
          model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_NotFound);
          DialogFactory.messageAlertDialog(model);
        } else if (response.status === 204) {
          model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_NOCONTENT);
          DialogFactory.messageAlertDialog(model);
        } else if (response.status === 403) {
          model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_AccessDenied);
          DialogFactory.messageAlertDialog(model);
        } else if (response.status === 401) {
          model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_Unauthorized);
          DialogFactory.messageAlertDialog(model);
        } else if (response.status === -1) {
          model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_SERVICEUNAVAILABLE);
          DialogFactory.messageAlertDialog(model);
        } else {
          const blob = new Blob([response.data], {
            type: 'application/pdf'
          });
          if (navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(blob, 'CheckPrintReport.pdf');
          } else {
            const TimeStamp = $filter('date')(new Date(), CORE.DateFormatArray[0].format);
            const link = document.createElement('a');
            if (link.download !== undefined) {
              const url = URL.createObjectURL(blob);
              link.setAttribute('href', url);
              if (isDownload) {
                link.setAttribute('download', 'CheckPrintReport' + TimeStamp + '.pdf');
              } else {
                link.setAttribute('target', '_blank');
              }
              link.style = 'visibility:hidden';
              document.body.appendChild(link);
              $timeout(() => {
                link.click();
                document.body.removeChild(link);
              });
            }
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.printRemittance = () => {
      vm.printCheck(true);
    };

    vm.setFocusOnCloseButton = () => {
      //created blank because used in directive using from popup
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
