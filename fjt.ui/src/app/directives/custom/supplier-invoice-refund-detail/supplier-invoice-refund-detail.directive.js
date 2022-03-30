(function () {
  'use strict';
  angular
    .module('app.core')
    .directive('supplierInvoiceRefundDetail', supplierInvoiceRefundDetail);
  function supplierInvoiceRefundDetail($state, $timeout, DialogFactory, CORE, USER, BaseService, $q, PackingSlipFactory, TRANSACTION, MasterFactory, GenericCategoryFactory, BankFactory, ChartOfAccountsFactory, TransactionModesFactory) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        paymentId: '=',
        saveBtnDisableFlag: '=',
        cgBusyLoading: '=',
        displayRefundDetail: '=',
        isVoidAndReissuePayment: '=',
        isRefundLocked: '=',
        lockStatus: '=',
        lockByName: '=',
        lockedAt: '=',
        stateParamMfgCodeId: '=',
        stateParamMemoId: '='
      },
      templateUrl: 'app/directives/custom/supplier-invoice-refund-detail/supplier-invoice-refund-detail.html',
      controller: supplierInvoiceRefundController,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function supplierInvoiceRefundController($scope, $element, $attrs) {
      const vm = this;
      vm.paymentId = $scope.paymentId ? parseInt($scope.paymentId) : null;
      vm.isVoidAndReIssuePayment = $scope.isVoidAndReissuePayment ? $scope.isVoidAndReissuePayment : false;
      $scope.saveBtnDisableFlag = false;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.SUPPLIER_INVOICE_ACCOUNT_REFERENCE_TOOLTIP = CORE.SUPPLIER_INVOICE_ACCOUNT_REFERENCE_TOOLTIP;
      vm.LabelConstant = angular.copy(CORE.LabelConstant);
      vm.TRANSACTION = TRANSACTION;
      vm.currentDate = new Date();
      vm.paidPackingSlip = { paymentDate: vm.currentDate };
      /*auto select credit/debit memo when open from manage page of CM/DM*/
      if ($scope.stateParamMfgCodeId) {
        vm.paidPackingSlip.mfgcodeID = parseInt($scope.stateParamMfgCodeId);
        vm.paidPackingSlip.refGencTransModeID = CORE.GenericTransModeName.RefundReceivableCMRefund.id;
      }
      vm.oldPaymentNumber = '';
      $scope.displayRefundDetail = vm.paidPackingSlip;
      vm.amountInputStep = _amountInputStep;
      vm.DefaultDateFormat = _dateDisplayFormat;
      vm.debounceTimeIntervalConst = CORE.DEBOUNCE_TIME_INTERVAL;
      vm.refundReceivableCMRefund = CORE.GenericTransModeName.RefundReceivableCMRefund;
      vm.loginUser = BaseService.loginUser;

      function setTabWisePageRights(pageList) {
        if (pageList && pageList.length > 0) {
          const tab = pageList.find((a) => a.PageDetails && a.PageDetails.pageRoute === TRANSACTION.TRANSACTION_INVOICE_MANAGE_REFUND_DETAIL_STATE);
          if (tab) {
            vm.isReadOnly = tab.RO ? true : false;
            if ($scope.$parent && $scope.$parent.vm && $scope.$parent.vm.pageTabRights && $scope.$parent.vm.pageTabRights.length > 0 && $scope.$parent.vm.pageTabRights[0].DetailTab) {
              $scope.$parent.vm.pageTabRights[0].DetailTab.isReadOnly = vm.isReadOnly;
            }
          }
        }
      }

      $timeout(() => {
        $scope.$on(USER.LoginUserPageListBroadcast, (event, data) => {
          var menudata = data;
          setTabWisePageRights(menudata);
          $scope.$applyAsync();
        });
      });

      if (BaseService.loginUserPageList && BaseService.loginUserPageList.length > 0) {
        setTabWisePageRights(BaseService.loginUserPageList);
      }

      //Get Bank List
      const getBankList = () => BankFactory.getBankList().query().$promise.then((bank) => {
        if (bank && bank.data) {
          if (!vm.isVoidAndReIssuePayment && vm.paymentId) {
            vm.bankList = bank.data;
          }
          else {
            vm.bankList = _.filter(bank.data, (item) => item.isActive);
          }
          return $q.resolve(vm.bankList);
        }
      }).catch((error) => BaseService.getErrorLog(error));

      /** Get supplier list */
      const getSupplierList = () => {
        const queryObj = {
          isCustomerCodeRequired: true
        };
        return MasterFactory.getSupplierList().query(queryObj).$promise.then((response) => {
          if (response && response.data) {
            vm.supplierList = response.data;
          }
          return $q.resolve(vm.supplierList);
        }).catch((error) => BaseService.getErrorLog(error));
      };
      const getPaymentToInformation = (isRefreshAccountReference) => {
        if (!vm.autoCompleteSupplier || !vm.autoCompleteSupplier.keyColumnId) {
          return true;
        }
        const listObj = {
          mfgcodeID: vm.autoCompleteSupplier.keyColumnId
        };
        return PackingSlipFactory.getPackaingslipPaymentToInformation().query(listObj).$promise.then((response) => {
          if (response && response.data && response.data.data) {
            if (isRefreshAccountReference) {
              const payToInfoForAccountRef = _.first(response.data.data);
              if (payToInfoForAccountRef) {
                vm.paidPackingSlip.accountReference = payToInfoForAccountRef.accountReference;
              }
            }
          }
          return $q.resolve(vm.paidPackingSlip);
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* Get payable payment method*/
      vm.paymentMethodTypeList = [];
      vm.getPaymentMethodType = () => {
        const GencCategoryType = [];
        GencCategoryType.push(CORE.CategoryType.ReceivablePaymentMethods.Name);
        const listObj = {
          GencCategoryType: GencCategoryType,
          isActive: true /*added to to fetch all data (active and inactive both)*/
        };
        return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((paymentmethod) => {
          if (paymentmethod && paymentmethod.data) {
            if (!vm.isVoidAndReIssuePayment && vm.paymentId) {
              vm.paymentMethodTypeList = paymentmethod.data;
            }
            else {
              vm.paymentMethodTypeList = _.filter(paymentmethod.data, (item) => item.isActive);
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };
      vm.getTransactionModeList = () => {
        vm.transactionModeSearchText = null;
        const transInfo = { modeType: CORE.GenericTransMode.RefundReceivable };
        return TransactionModesFactory.getTransModeList().query({ transInfo: transInfo }).$promise.then((response) => {
          if (response && response.data && response.data.customerTransModeNameList) {
            vm.transactionModeList = response.data.customerTransModeNameList;
            return $q.resolve(vm.transactionModeList);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.refreshAccountReference = () => {
        $scope.cgBusyLoading = $q.all([getPaymentToInformation(true)]).then(() => {
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.getSupplierMemoListForRefund = () => {
        if (!vm.paymentId && (!vm.autoCompleteSupplier.keyColumnId || vm.autoCompleteTransactionMode.keyColumnId !== vm.refundReceivableCMRefund.id)) {
          return true;
        }
        const listObj = {};
        if (vm.autoCompleteSupplier && vm.autoCompleteSupplier.keyColumnId) {
          listObj.mfgcodeID = vm.autoCompleteSupplier.keyColumnId;
        }
        if (vm.paymentId) {
          listObj.paymentId = vm.paymentId;
        }

        listObj.isVoidAndReissuePayment = vm.isVoidAndReIssuePayment;

        $scope.cgBusyLoading = PackingSlipFactory.getSupplierMemoListForRefund().query(listObj).$promise.then((response) => {
          if (response.status === CORE.ApiResponseTypeStatus.SUCCESS && response && response.data) {
            if (vm.paymentId) {
              vm.paidPackingSlip = response.data.refundMaster[0];
              vm.oldPaymentNumber = angular.copy(vm.paidPackingSlip.paymentNumber);

              if (vm.isVoidAndReIssuePayment) {
                vm.paidPackingSlip.systemId = null;
                vm.paidPackingSlip.paymentDate = vm.currentDate;
                vm.paidPackingSlip.paymentNumber = null;
                vm.paidPackingSlip.bankAccountMasID = null;
                vm.paidPackingSlip.bankName = null;
                vm.paidPackingSlip.paymentType = null;
                vm.paidPackingSlip.depositBatchNumber = null;
                vm.paidPackingSlip.remark = null;
              } else {
                vm.paidPackingSlip.paymentDate = BaseService.getUIFormatedDate(vm.paidPackingSlip.paymentDate, vm.DefaultDateFormat);
              }
              if (vm.paidPackingSlip.lockStatus === TRANSACTION.CustomerPaymentLockStatus.Locked && !vm.loginUser.isUserSuperAdmin) {
                $scope.isRefundLocked = true;
                vm.isRefundLocked = true;
              } else {
                $scope.isRefundLocked = false;
                vm.isRefundLocked = false;
              }
              $scope.lockStatus = vm.paidPackingSlip.lockStatus;
              $scope.lockByName = vm.paidPackingSlip.lockByName;
              $scope.lockedAt = vm.paidPackingSlip.lockedAt;

              $scope.displayRefundDetail = vm.paidPackingSlip;
              vm.autoCompleteSupplier.keyColumnId = vm.paidPackingSlip.mfgcodeID;
              vm.autoCompleteTransactionMode.keyColumnId = vm.paidPackingSlip.refGencTransModeID;
              vm.autoCompleteBankAccountNumber.keyColumnId = vm.paidPackingSlip.bankAccountMasID;
              vm.autoCompletePaymentMethodType.keyColumnId = vm.paidPackingSlip.paymentType;
              getChartOfAccountBySearch({ class_id: CORE.AccountType.Income, acct_id: vm.paidPackingSlip.acctId });
            }
            if (vm.autoCompleteTransactionMode.keyColumnId === vm.refundReceivableCMRefund.id) {
              vm.supplierMemoRefundList = _.each(response.data.refundLines, (a) => {
                a.isSelected = a.isSelected === 1 ? true : false;
                a.balanceToRefundAmtEditCase = CalcSumofArrayElement([a.balanceToRefundAmt || 0, a.paymentAmountForSelectedInvoice || 0], _amountFilterDecimal);
              });
              if (vm.paymentId) {
                setSelectAllCheckBox();
              } else if ($scope.stateParamMemoId) {
                /*auto select credit/debit memo when open from manage page of CM/DM*/
                const unSelectedInvoices = _.find(vm.supplierMemoRefundList, (data) => data.refPackingslipInvoiceID === parseInt($scope.stateParamMemoId));
                if (unSelectedInvoices) {
                  unSelectedInvoices.isSelected = true;
                  unSelectedInvoices.paymentAmountForSelectedInvoice = unSelectedInvoices.balanceToRefundAmt;
                  setSelectAllCheckBox();
                  setFocus('paymentAmount');
                }
              }
            }
          }
          return $q.resolve();
        }).catch((error) => BaseService.getErrorLog(error));
      };

      const getChartOfAccountBySearch = (searchObj) => ChartOfAccountsFactory.getChartOfAccountBySearch().query(searchObj).$promise.then((chartofAccount) => {
        if (chartofAccount) {
          _.each(chartofAccount.data, (item) => item.chartOfAccountsDisplayName = item.acct_code ? stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.acct_code, item.acct_name) : item.acct_name);
          if (searchObj && searchObj.acct_id) {
            $scope.$broadcast(vm.autoCompleteCOA.inputName, chartofAccount.data[0]);
          }
          return chartofAccount.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));

      function initAutoComplete() {
        vm.autoCompleteSupplier = {
          columnName: 'mfgCodeName',
          controllerName: CORE.MANAGE_MFGCODE_MODAL_CONTROLLER,
          viewTemplateURL: CORE.MANAGE_MFGCODE_MODAL_VIEW,
          keyColumnName: 'id',
          keyColumnId: vm.paidPackingSlip && vm.paidPackingSlip.mfgcodeID ? vm.paidPackingSlip.mfgcodeID : null,
          inputName: 'Supplier',
          placeholderName: CORE.LabelConstant.MFG.Supplier,
          isRequired: true,
          isAddnew: true,
          addData: {
            mfgType: CORE.MFG_TYPE.DIST,
            popupAccessRoutingState: [USER.ADMIN_MANAGESUPPLIER_DETAIL_STATE],
            pageNameAccessLabel: CORE.PageName.supplier
          },
          callbackFn: getSupplierList,
          onSelectCallbackFn: (item) => {
            if (item) {
              vm.paidPackingSlip.mfgName = item.mfgCodeName;
              vm.paidPackingSlip.mfgcodeID = item.id;
              if (!vm.paymentId) {
                vm.autoCompleteSupplier.keyColumnId = item.id;
                vm.refreshAccountReference();
                vm.getSupplierMemoListForRefund();
              }
            } else {
              vm.paidPackingSlip.accountReference = null;
              vm.paidPackingSlip.mfgName = null;
              vm.paidPackingSlip.mfgcodeID = null;
              vm.supplierMemoRefundList = [];
            }
          }
        };
        vm.autoCompletePaymentMethodType = {
          controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
          viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
          columnName: 'gencCategoryName',
          keyColumnName: 'gencCategoryID',
          keyColumnId: vm.paidPackingSlip ? vm.paidPackingSlip.paymentType : null,
          inputName: CORE.CategoryType.ReceivablePaymentMethods.Name,
          placeholderName: 'Payment Method',
          isRequired: true,
          isAddnew: true,
          addData: {
            headerTitle: CORE.CategoryType.PayablePaymentMethods.Title,
            popupAccessRoutingState: [USER.ADMIN_PAYMENT_METHODS_MANAGEGENERICCATEGORY_STATE],
            pageNameAccessLabel: CORE.CategoryType.PayablePaymentMethods.Title
          },
          onSelectCallbackFn: function (obj) {
            if (obj) {
              vm.paidPackingSlip.paymentType = obj.gencCategoryID;
            } else {
              vm.paidPackingSlip.paymentType = null;
            }
          },
          callbackFn: vm.getPaymentMethodType
        };
        vm.autoCompleteBankAccountNumber = {
          columnName: 'accountCode',
          controllerName: USER.ADMIN_BANK_ADD_UPDATE_MODAL_CONTROLLER,
          viewTemplateURL: USER.ADMIN_BANK_ADD_UPDATE_MODAL_VIEW,
          keyColumnName: 'id',
          keyColumnId: vm.paidPackingSlip ? vm.paidPackingSlip.bankAccountMasID : null,
          inputName: 'bankAccountNumber',
          placeholderName: vm.LabelConstant.Bank.BankAccountCode,
          isRequired: true,
          isAddnew: true,
          addData: {
            popupAccessRoutingState: [USER.ADMIN_BANK_STATE],
            pageNameAccessLabel: CORE.PageName.Bank
          },
          onSelectCallbackFn: function (obj) {
            if (obj) {
              vm.paidPackingSlip.bankAccountMasID = obj.id;
              vm.paidPackingSlip.bankAccountNo = obj.accountCode;
              vm.paidPackingSlip.bankName = obj.bankName;
            }
            else {
              vm.paidPackingSlip.bankAccountMasID = undefined;
              vm.paidPackingSlip.bankAccountNo = undefined;
              vm.paidPackingSlip.bankName = undefined;
            }
          },
          callbackFn: getBankList
        };
        vm.autoCompleteCOA = {
          columnName: 'chartOfAccountsDisplayName',
          controllerName: CORE.MANAGE_CHART_OF_ACCOUNTS_MODAL_CONTROLLER,
          viewTemplateURL: CORE.MANAGE_CHART_OF_ACCOUNTS_MODAL_VIEW,
          keyColumnName: 'acct_id',
          keyColumnId: vm.paidPackingSlip && vm.paidPackingSlip.acctId ? vm.paidPackingSlip.acctId : null,
          inputName: 'COA',
          placeholderName: 'COA',
          isRequired: false,
          isAddnew: true,
          addData: {
            class_id: CORE.AccountType.Income
          },
          callbackFn: (item) => {
            item.class_id = CORE.AccountType.Income;
            getChartOfAccountBySearch(item);
          },
          onSelectCallbackFn: (item) => {
            if (item) {
              vm.paidPackingSlip.acctId = item.acct_id;
            }
            else {
              $scope.$broadcast(vm.autoCompleteCOA.inputName, null);
            }
          },
          onSearchFn: (query) => getChartOfAccountBySearch({ class_id: CORE.AccountType.Income, searchString: query })
        };
        vm.autoCompleteTransactionMode = {
          columnName: 'modeName',
          keyColumnName: 'id',
          keyColumnId: vm.paidPackingSlip ? vm.paidPackingSlip.refGencTransModeID : null,
          inputName: 'transactionMode',
          placeholderName: vm.LabelConstant.SupplierInvoice.TransactionMode,
          isRequired: true,
          isAddnew: true,
          isAddFromRoute: true,
          routeName: USER.ADMIN_MANAGE_RECEIVABLE_TRANSACTION_MODES_STATE,
          addData: {},
          onSelectCallbackFn: function (obj) {
            if (obj) {
              vm.autoCompleteTransactionMode.keyColumnId = obj.id;
              vm.paidPackingSlip.refGencTransModeID = obj.id;
              vm.paidPackingSlip.transactionModeName = obj.modeName;
              if (!vm.paymentId) {
                vm.getSupplierMemoListForRefund();
              }
            } else {
              vm.paidPackingSlip.refGencTransModeID = null;
              vm.paidPackingSlip.transactionModeName = null;
              vm.supplierMemoRefundList = [];
            }
          },
          callbackFn: vm.getTransactionModeList
        };
      };

      const init = () => {
        const promises = [getSupplierList(), vm.getPaymentMethodType(), getBankList(), vm.getTransactionModeList()];
        $scope.cgBusyLoading = $q.all(promises).then(() => {
          initAutoComplete();
          if (vm.paymentId) {
            vm.getSupplierMemoListForRefund();
          }/* else if ($scope.stateParamMfgCodeId) {
            vm.autoCompleteSupplier.keyColumnId = $scope.stateParamMfgCodeId;
          }*/
        }).catch((error) => BaseService.getErrorLog(error));
      };

      init();

      vm.selectAllInvoice = () => {
        _.each(vm.supplierMemoRefundList, (data) => {
          data.isSelected = vm.isAllSelectFromSupplierInvoicePaymentList;
          data.paymentAmountForSelectedInvoice = data.isSelected ? data.balanceToRefundAmt : 0;
        });
      };

      vm.selectSingleInvoice = (invItem) => {
        invItem.paymentAmountForSelectedInvoice = invItem.isSelected ? invItem.balanceToRefundAmt : 0;
        setSelectAllCheckBox();
      };

      function setSelectAllCheckBox() {
        const unSelectedInvoices = _.find(vm.supplierMemoRefundList, (data) => !data.isSelected);
        vm.isAllSelectFromSupplierInvoicePaymentList = (!unSelectedInvoices || unSelectedInvoices.length === 0);
      }

      vm.getSelectedRecordCount = () => ((_.countBy(vm.supplierMemoRefundList, (data) => data.isSelected).true) || 0);
      vm.getTotalMarkedForRefundAmt = () => (_.sumBy(vm.supplierMemoRefundList, (data) => data.markedForRefundAmt) || 0);
      vm.getTotalRefundAmount = () => (_.sumBy(vm.supplierMemoRefundList, (data) => data.totalRefundAmount) || 0);
      vm.getTotalBalanceToRefundAmt = () => (_.sumBy(vm.supplierMemoRefundList, (data) => data.balanceToRefundAmt) || 0);
      vm.getTotalPaymentAmountForSelectedInvoice = () => {
        vm.totalSelectedRefundAmount = (_.sumBy(vm.supplierMemoRefundList, (data) => data.paymentAmountForSelectedInvoice) || 0);
        vm.calculateVarianceAmount();
        return vm.totalSelectedRefundAmount;
      };

      vm.calculateVarianceAmount = () => {
        vm.paidPackingSlip.varianceAmount = CalcSumofArrayElement([vm.paidPackingSlip.paymentAmount || 0, vm.paidPackingSlip.offsetAmount || 0, (vm.totalSelectedRefundAmount * -1)], _amountFilterDecimal);
      };

      function saveInvoicePayment() {
        const paymentDataObj = angular.copy(vm.paidPackingSlip);
        paymentDataObj.paymentId = vm.paymentId;
        paymentDataObj.paymentDate = paymentDataObj.paymentDate ? BaseService.getAPIFormatedDate(paymentDataObj.paymentDate) : null;
        paymentDataObj.mfgcodeID = vm.autoCompleteSupplier.keyColumnId;
        paymentDataObj.acctId = vm.autoCompleteCOA.keyColumnId || null;

        const paidPackingList = [];
        const deletedPackingList = [];
        _.map(vm.supplierMemoRefundList, (data) => {
          if (data.isSelected) {
            const obj = {
              id: data.id,
              refPackingslipInvoiceID: data.refPackingslipInvoiceID,
              paymentAmount: data.paymentAmountForSelectedInvoice,
              receiptType: data.receiptType
            };
            paidPackingList.push(obj);
          } else if (!data.isSelected && data.id) {
            const obj = {
              id: data.id,
              receiptType: data.receiptType
            };
            deletedPackingList.push(obj);
          }
        });
        paymentDataObj.paidPackingList = paidPackingList;
        paymentDataObj.deletedPackingList = deletedPackingList;
        paymentDataObj.refPaymentMode = CORE.RefPaymentModeForInvoicePayment.SupplierRefund;

        $scope.cgBusyLoading = PackingSlipFactory.saveSupplierRefund().query(paymentDataObj).$promise.then((response) => {
          if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            vm.supplierRefundDetailForm.$setPristine();
            if (response.data && response.data.id) {
              vm.paymentId = response.data.id;
              $scope.paymentId = vm.paymentId;
              $state.go(TRANSACTION.TRANSACTION_INVOICE_MANAGE_REFUND_DETAIL_STATE, { id: vm.paymentId });
            }
          } else {
            if (checkResponseHasCallBackFunctionPromise(response)) {
              response.alretCallbackFn.then(() => {
                BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.supplierRefundDetailForm);
              });
            }
          }
          $scope.saveBtnDisableFlag = false;
        }).catch((error) => {
          $scope.saveBtnDisableFlag = false;
          return BaseService.getErrorLog(error);
        });
      }

      vm.saveRefundTransaction = () => {
        if (BaseService.focusRequiredField(vm.supplierRefundDetailForm)) {
          return;
        }
        $scope.saveBtnDisableFlag = true;

        if (vm.autoCompleteTransactionMode.keyColumnId === vm.refundReceivableCMRefund.id) {
          const checkSelectedMemo = _.some(vm.supplierMemoRefundList, (data) => data.isSelected === true);
          if (!checkSelectedMemo) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
            messageContent.message = stringFormat(messageContent.message, 'Record');
            const alertModel = {
              messageContent: messageContent
            };
            DialogFactory.messageAlertDialog(alertModel);
            $scope.saveBtnDisableFlag = false;
            return;
          }

          if (vm.paidPackingSlip.varianceAmount !== 0) {
            const alertModel = {
              messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SUPPLIER_REFUND_HAS_VARIANCE_SO_CAN_NOT_SAVE
            };
            DialogFactory.messageAlertDialog(alertModel);
            $scope.saveBtnDisableFlag = false;
            return;
          }
        }
        saveInvoicePayment();
      };

      vm.voidRefundTransaction = (event) => {
        const loginUser = BaseService.loginUser;
        const invoicePaymentChange = {
          AccessRole: CORE.ROLE_ACCESS.VERIFICATION_ROLE_ACCESS,
          isAllowSaveDirect: false,
          popupTitle: 'Void ' + CORE.PageName.SupplierInvoiceRefund,
          confirmationType: CORE.Generic_Confirmation_Type.SUPPLIER_INVOICE_PAYMENT_VOID,
          isOnlyPassword: true,
          createdBy: loginUser.userid,
          updatedBy: loginUser.userid
        };
        return DialogFactory.dialogService(
          CORE.GENERIC_CONFIRMATION_MODAL_CONTROLLER,
          CORE.GENERIC_CONFIRMATION_MODAL_VIEW,
          event,
          invoicePaymentChange).then((pswConfirmation) => {
            if (pswConfirmation) {
              const objData = {
                id: vm.paymentId,
                isPaymentVoided: true,
                voidPaymentReason: pswConfirmation.approvalReason,
                refPaymentModeOfInvPayment: CORE.RefPaymentModeForInvoicePayment.SupplierRefund
              };
              vm.cgBusyLoading = PackingSlipFactory.voidSupplierInvoicePayment().query(objData).$promise.then((response) => {
                if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                  vm.paidPackingSlip.isPaymentVoided = true;
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.voidAndReissueRefundTransaction = () => {
        if (BaseService.focusRequiredField(vm.supplierRefundDetailForm)) {
          return;
        }
        const loginUser = BaseService.loginUser;
        const invoicePaymentChange = {
          AccessRole: CORE.ROLE_ACCESS.VERIFICATION_ROLE_ACCESS,
          isAllowSaveDirect: false,
          popupTitle: 'Void & Reissue ' + CORE.PageName.SupplierInvoiceRefund,
          confirmationType: CORE.Generic_Confirmation_Type.SUPPLIER_INVOICE_PAYMENT_VOID,
          isOnlyPassword: true,
          createdBy: loginUser.userid,
          updatedBy: loginUser.userid
        };
        return DialogFactory.dialogService(
          CORE.GENERIC_CONFIRMATION_MODAL_CONTROLLER,
          CORE.GENERIC_CONFIRMATION_MODAL_VIEW,
          null,
          invoicePaymentChange).then((pswConfirmation) => {
            if (pswConfirmation) {
              const objData = {
                refVoidPaymentId: vm.paymentId,
                accountReference: vm.paidPackingSlip.accountReference,
                paymentType: vm.paidPackingSlip.paymentType,
                paymentNumber: vm.paidPackingSlip.paymentNumber,
                bankAccountMasID: vm.paidPackingSlip.bankAccountMasID,
                bankAccountNo: vm.paidPackingSlip.bankAccountNo,
                bankName: vm.paidPackingSlip.bankName,
                paymentDate: vm.paidPackingSlip.paymentDate ? BaseService.getAPIFormatedDate(vm.paidPackingSlip.paymentDate) : null,
                remark: vm.paidPackingSlip.remark,
                voidPaymentReason: pswConfirmation.approvalReason,
                refPaymentModeOfInvPayment: CORE.RefPaymentModeForInvoicePayment.SupplierRefund,
                mfgcodeID: vm.autoCompleteSupplier.keyColumnId,
                depositBatchNumber: vm.paidPackingSlip.depositBatchNumber
              };
              $scope.cgBusyLoading = PackingSlipFactory.voidAndReissueSupplierRefund().query(objData).$promise.then((response) => {
                if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                  vm.supplierRefundDetailForm.$setPristine();
                  $scope.$emit(USER.SupplierInvoiceVoidRefundSaveSuccessBroadcast);
                }
                $scope.saveBtnDisableFlag = false;
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => {
            $scope.saveBtnDisableFlag = false;
          }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.validateDuplicateSupplierRefundCheckNumber = () => {
        if (!vm.paymentId || (vm.paymentId && vm.oldPaymentNumber !== vm.paidPackingSlip.paymentNumber)) {
          if (vm.paidPackingSlip.paymentNumber && vm.autoCompleteSupplier.keyColumnId) {
            const paymentDataObj = {
              paymentNumber: vm.paidPackingSlip.paymentNumber,
              mfgcodeID: vm.autoCompleteSupplier.keyColumnId
            };
            $scope.cgBusyLoading = PackingSlipFactory.validateDuplicateSupplierRefundCheckNumber().query(paymentDataObj).$promise.then((response) => {
              if (!response || response.status !== CORE.ApiResponseTypeStatus.SUCCESS) {
                if (checkResponseHasCallBackFunctionPromise(response)) {
                  response.alretCallbackFn.then(() => {
                    vm.paidPackingSlip.paymentNumber = null;
                    setFocus('paymentNumber');
                  });
                }
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }
      };

      vm.goToSupplierList = () => {
        BaseService.goToSupplierList();
        return false;
      };

      vm.goToSupplierBillTo = () => {
        BaseService.goToSupplierDetail(vm.autoCompleteSupplier ? vm.autoCompleteSupplier.keyColumnId : null, false);
      };

      vm.goToBankList = () => {
        BaseService.goToBankList();
        return false;
      };

      vm.goToPaymentMethodList = () => {
        BaseService.goToGenericCategoryReceivablePaymentMethodList();
      };

      vm.goToCreditDebitMemoDetail = (item) => {
        if (item.receiptType === 'C') {
          BaseService.goToCreditMemoDetail(null, item.refPackingslipInvoiceID);
        } else if (item.receiptType === 'D') {
          BaseService.goToDebitMemoDetail(null, item.refPackingslipInvoiceID);
        }
      };

      /*method implementation pending because master creation is pending*/
      vm.goToTransactionModeList = () => {
        BaseService.goToTransactionModesList(USER.TransactionModesTabs.Receivable.Name, false);
      };

      vm.goChartOfAccountsList = () => BaseService.goToChartOfAccountList();

      vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

      $scope.$on(USER.SupplierInvoiceRefundDetailSaveBroadcast, () => {
        vm.saveRefundTransaction();
      });

      $scope.$on(USER.SupplierInvoiceRefundVoidAndReleaseInvoiceGroupBroadcast, () => {
        vm.voidRefundTransaction();
      });

      $scope.$on(USER.SupplierInvoiceVoidAndReIssueRefundBroadcast, () => {
        vm.voidAndReissueRefundTransaction();
      });

      angular.element(() => {
        BaseService.currentPageForms.push(vm.supplierRefundDetailForm);
        $scope.$parent.vm.supplierRefundDetailForm = vm.supplierRefundDetailForm;

        $timeout(() => {
          if (vm.supplierRefundDetailForm) {
            BaseService.focusOnFirstEnabledField(vm.supplierRefundDetailForm);
          }
        }, _configTimeout);
      });
    }
  }
})();
