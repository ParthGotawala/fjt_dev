(function () {
  'use strict';

  angular
    .module('app.transaction.customerpayment')
    .controller('ManageCustomerPaymentController', ManageCustomerPaymentController);

  /** @ngInject */
  function ManageCustomerPaymentController($scope, $q, $stateParams, USER, CORE, BaseService, BankFactory, GenericCategoryFactory, MasterFactory, $mdDialog, CustomerPaymentFactory, TRANSACTION, $state, DialogFactory, $filter, PackingSlipFactory, $timeout, CONFIGURATION) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = CORE.LabelConstant;
    vm.loginUser = BaseService.loginUser;
    vm.custPaymentMstID = parseInt($stateParams.id);
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.emptyCustomerConst = USER.ADMIN_EMPTYSTATE.CUSTOMER;
    vm.emptyStateCustInvoiceConst = TRANSACTION.TRANSACTION_EMPTYSTATE.CUSTOMER_INVOICE;
    vm.custPayDiffNotesConst = TRANSACTION.CustomerPaymentDiffNotes;
    vm.customerList = [];
    vm.paymentMethodTypeList = [];
    vm.bankList = [];
    vm.custPaymentModel = {};
    $scope.$parent.vm.saveBtnDisableFlag = false;
    vm.customerAllowPaymentDays = angular.copy(_customerAllowPaymentDays);
    vm.CustPaymentLockStatusConst = TRANSACTION.CustomerPaymentLockStatus;
    vm.customerPaymentNotesConst = TRANSACTION.CustomerPaymentNotes;
    vm.receivableRefPaymentModeConst = TRANSACTION.ReceivableRefPaymentMode;
    vm.custPaymentModel.underPaymentAction = TRANSACTION.UnderPaymentActions.LeavethisAsAnUnderpayment.Value;
    vm.custInvoiceSubStatusListConst = CORE.CUSTINVOICE_SUBSTATUS;
    vm.isWOFFTheExtraAmtOptionSelected = false;

    vm.chequeDateOptions = {
      appendToBody: true,
      maxDate: vm.customerAllowPaymentDays ? new Date((new Date()).setDate((new Date()).getDate() + vm.customerAllowPaymentDays)) : null
    };
    const msgContentForMaxDate = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DATE_LESS_THAN_EQUAL_TO);
    vm.maxAllowedPaymentDateMsg = stringFormat(msgContentForMaxDate.message, 'Date', 'configured date ' + $filter('date')((vm.chequeDateOptions.maxDate || new Date()), vm.DefaultDateFormat));
    vm.DATE_PICKER = CORE.DATE_PICKER;
    vm.IsPickerOpen = {
      [vm.DATE_PICKER.paymentDate]: false
    };
    vm.query = {
      order: ''
    };
    vm.invPaySearch = {};
    const custReceiptInvAutoSelectTypeValue = angular.copy(_customerReceiptInvoiceAutoSelect);
    //vm.debounceTimeIntervalConst = CORE.Debounce.mdDataTable;
    vm.debounceTimeIntervalConst = CORE.DEBOUNCE_TIME_INTERVAL;
    vm.invoicePaymentStatusConst = CORE.InvoicePaymentStatus;
    const CategoryTypeObjList = angular.copy(CORE.CategoryType);
    vm.isCustPaymentLocked = false;
    const customerReceiptInvoiceAutoSelectTypeConst = CONFIGURATION.CustomerReceiptInvoiceAutoSelectType;

    vm.RadioGroup = {
      underPaymentActionRBG: {
        array: TRANSACTION.UnderPaymentActions
      },
      overPaymentActionRBG: {
        array: TRANSACTION.OverPaymentActions
      }
    };

    /* get all feature rights for customer payment */
    const getAllFeatureRights = () => {
      vm.allowToLockUnlockCustomerPaymentFeature = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToLockUnlockCustomerPayment);
      vm.allowToVoidAndReIssuePaymentFeature = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToVoidAndReIssueCustomerPayment);
      if ($scope.$parent && $scope.$parent.vm) {
        $scope.$parent.vm.allowToLockUnlockCustomerPaymentFeature = vm.allowToLockUnlockCustomerPaymentFeature;
        $scope.$parent.vm.allowToVoidAndReIssuePaymentFeature = vm.allowToVoidAndReIssuePaymentFeature;
      }
    };
    getAllFeatureRights();

    // get all customer
    const getCustomerList = () => MasterFactory.getCustomerList().query().$promise.then((customer) => {
      if (customer && customer.data) {
        _.each(customer.data, (item) => {
          item.mfgFullName = item.mfgCodeName;
        });
        vm.customerList = customer.data;
      }
      return $q.resolve(vm.customerList);
    }).catch((error) => BaseService.getErrorLog(error));

    /* Get payment method */
    const getPaymentMethodType = () => {
      const GencCategoryType = [];
      GencCategoryType.push(CORE.CategoryType.ReceivablePaymentMethods.Name);
      const listObj = {
        GencCategoryType: GencCategoryType,
        isActive: true
      };
      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((paymentmethod) => {
        if (paymentmethod && paymentmethod.data) {
          if (vm.custPaymentMstID) {
            vm.paymentMethodTypeList = paymentmethod.data;
          }
          else {
            vm.paymentMethodTypeList = _.filter(paymentmethod.data, (item) => item.isActive);
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // Get Bank account code List
    const getBankList = () => BankFactory.getBankList().query().$promise.then((bank) => {
      if (bank && bank.data) {
        if (vm.custPaymentMstID) {
          vm.bankList = bank.data;
        }
        else {
          vm.bankList = _.filter(bank.data, (item) => item.isActive);
        }
        return $q.resolve(vm.bankList);
      }
    }).catch((error) => BaseService.getErrorLog(error));

    const initAutoComplete = () => {
      vm.autoCompleteCustomer = {
        columnName: 'mfgFullName',
        controllerName: USER.ADMIN_CUSTOMER_ADD_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_CUSTOMER_ADD_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.custPaymentModel ? vm.custPaymentModel.mfgcodeID : null,
        addData: {
          customerType: CORE.CUSTOMER_TYPE.CUSTOMER,
          popupAccessRoutingState: [USER.ADMIN_MANAGECUSTOMER_DETAIL_STATE],
          pageNameAccessLabel: CORE.PageName.customer
        },
        inputName: 'Customer',
        placeholderName: 'Customer',
        isRequired: true,
        isAddnew: true,
        callbackFn: getCustomerList,
        onSelectCallbackFn: onSelectCustCallbackFn
      };
      vm.autoCompletePaymentMethodType = {
        columnName: 'gencCategoryName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.custPaymentModel ? vm.custPaymentModel.paymentType : null,
        inputName: CategoryTypeObjList.ReceivablePaymentMethods.Name,
        placeholderName: 'Payment Method',
        isRequired: true,
        isAddnew: true,
        addData: {
          headerTitle: CategoryTypeObjList.ReceivablePaymentMethods.Title,
          popupAccessRoutingState: [USER.ADMIN_PAYMENT_METHODS_MANAGEGENERICCATEGORY_STATE],
          pageNameAccessLabel: CategoryTypeObjList.ReceivablePaymentMethods.Title
        },
        onSelectCallbackFn: function (obj) {
          vm.custPaymentModel.paymentType = (obj) ? obj.gencCategoryID : null;
        },
        callbackFn: getPaymentMethodType
      };
      vm.autoCompleteBankAccountNumber = {
        columnName: 'accountCode',
        controllerName: USER.ADMIN_BANK_ADD_UPDATE_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_BANK_ADD_UPDATE_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.custPaymentModel ? vm.custPaymentModel.bankAccountMasID : null,
        inputName: 'bankAccountNumber',
        placeholderName: vm.LabelConstant.Bank.BankAccountCode,
        isRequired: true,
        isAddnew: true,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_BANK_STATE],
          pageNameAccessLabel: CORE.PageName.Bank
        },
        callbackFn: getBankList,
        onSelectCallbackFn: function (obj) {
          if (obj) {
            vm.custPaymentModel.bankAccountMasID = obj.id;
            vm.custPaymentModel.bankAccountNo = obj.accountCode;
            vm.custPaymentModel.bankName = obj.bankName;
          }
          else {
            vm.custPaymentModel.bankAccountMasID = null;
            vm.custPaymentModel.bankAccountNo = null;
            vm.custPaymentModel.bankName = null;
          }
        }
      };
    };

    // when user select customer
    const onSelectCustCallbackFn = (selectedCust) => {
      if (selectedCust) {
        if ($scope.$parent && $scope.$parent.vm) {
          $scope.$parent.vm.selectedCustomerDet = selectedCust;
        }
        if (!vm.custPaymentMstID) {
          // when new payment entry then fill up details from customer master
          if (selectedCust.paymentMethodID) {
            vm.autoCompletePaymentMethodType.keyColumnId = selectedCust.paymentMethodID;
          }
          vm.custPaymentModel.accountReference = selectedCust.accountRef || null;
        }
        // get all invoices of customer with payment information
        const custPayDet = {
          customerID: selectedCust.id
        };
        retrieveAllInvoiceOfCustomerPayment(custPayDet);
        retrieveAllCreditMemoOfCustomerPayment(custPayDet);
        //$timeout(() => {
        //  if (!vm.custPaymentMstID && vm.customerPaymentForm) {
        //    vm.customerPaymentForm.$setPristine();
        //  }
        //}, 1000);
      }
      else {
        resetAllPaymentDetails();
      }
    };

    // reset payment details
    const resetAllPaymentDetails = () => {
      if ($scope.$parent && $scope.$parent.vm) {
        $scope.$parent.vm.selectedCustomerDet = null;
      }
      vm.custPaymentModel = {};
      vm.custPaymentModel.underPaymentAction = TRANSACTION.UnderPaymentActions.LeavethisAsAnUnderpayment.Value;
      vm.isSelectAllInvNotAllowForZeroInvPayment = false;
      vm.isAllSelectFromCustInvoicePaymentList = false;
      vm.custCurrentTermsDays = null;
      vm.customerPastDueBalanceTillToday = null;
      clearSumOfAmountForCustInvoicePaymentList();
      if (!vm.custPaymentMstID) {
        // when new payment entry then clear all fill up details which set from customer master
        if (vm.autoCompletePaymentMethodType.keyColumnId) {
          vm.autoCompletePaymentMethodType.keyColumnId = null;
        }
        if (vm.autoCompleteBankAccountNumber.keyColumnId) {
          vm.autoCompleteBankAccountNumber.keyColumnId = null;
        }
        $scope.$broadcast(vm.autoCompletePaymentMethodType.inputName + 'searchText', null);
        $scope.$broadcast(vm.autoCompleteBankAccountNumber.inputName + 'searchText', null);
        $scope.$broadcast(vm.autoCompleteCustomer.inputName + 'searchText', null);
      }
    };

    // get all invoices of customer with payment information
    const retrieveAllInvoiceOfCustomerPayment = (custPayDet) => {
      vm.isWOFFTheExtraAmtOptionSelected = false;
      if (!custPayDet || !custPayDet.customerID) {
        return;
      }
      const custPayInfo = {
        customerID: custPayDet.customerID,
        payementMstID: vm.custPaymentMstID || null,
        transTypeForInvoice: CORE.TRANSACTION_TYPE.INVOICE,
        isGetOnlyPaidInvoiceFromPayment: false
      };
      vm.cgBusyLoading = CustomerPaymentFactory.getAllInvoiceOfCustomerPayment().query({ custPayInfo: custPayInfo }).$promise.then((resp) => {
        vm.custInvoicePaymentList = [];
        clearSumOfAmountForCustInvoicePaymentList();
        if (resp && resp.data) {
          if (resp.data.customerInvoiceList && resp.data.customerInvoiceList.length > 0) {
            vm.custInvoicePaymentList = resp.data.customerInvoiceList;
            /* don't put order by below foreach as in for each date converted to string  */
            vm.custInvoicePaymentList = _.orderBy(vm.custInvoicePaymentList, ['invoiceDate', 'invoiceMstID'], ['asc', 'asc']);
            _.each(vm.custInvoicePaymentList, (invItem) => {
              invItem.isZeroValue = invItem.isZeroValue ? true : false;
              invItem.writeOffAmtForSelectedInvoice = 0;

              invItem.paymentAmountForSelectedInvoice = parseFloat((angular.copy(invItem.invPaidAmtFromCurrPaymentDet) || 0).toFixed(2));
              invItem.totWriteOffAmountForSelectedInvoice = parseFloat((invItem.invTotPaidAmtFromAllWriteOff || 0).toFixed(2));

              // past payment = total paid for invoice from all pay det
              invItem.pastPaidAmountForSelectedInvoice = parseFloat((invItem.invTotPaidAmtFromAllPaymentDet || 0).toFixed(2));
              invItem.pastPaidAmtExcludeCurrTransForSelectedInv = parseFloat(((invItem.invTotPaidAmtFromAllPaymentDet || 0) - (invItem.invPaidAmtFromCurrPaymentDet || 0)).toFixed(2));

              invItem.pastPaidAmountFromCMForSelectedInv = parseFloat((invItem.invTotPaidAmtFromAllCMPayment || 0).toFixed(2));

              invItem.pastPaidAmountFromDPForSelectedInvoice = parseFloat(((invItem.pastPaidAmountForSelectedInvoice || 0) - (invItem.invTotPaidAmtFromAllCMPayment || 0) - (invItem.invTotPaidAmtFromAllWriteOff || 0)).toFixed(2));

              // due payment = original pay amount of invoice - total paid for invoice from all pay det
              invItem.dueAmountForSelectedInvoice = parseFloat(((invItem.originalPayAmountOfInvoice || 0) - (invItem.invTotPaidAmtFromAllPaymentDet || 0)).toFixed(2));
              // live due payment >> when user change inv pay amount it will be updated instantly
              invItem.liveDueAmountForSelectedInvoice = angular.copy(invItem.dueAmountForSelectedInvoice);

              invItem.isSelected = invItem.invPaymentDetMstID ? true : false;
              invItem.maxLimitOfDueAmountToPay = parseFloat((invItem.invPaymentDetMstID ? parseFloat(((invItem.dueAmountForSelectedInvoice || 0) + (invItem.invPaidAmtFromCurrPaymentDet || 0)).toFixed(2)) : (invItem.dueAmountForSelectedInvoice || 0)).toFixed(2));
              invItem.invoiceDateWithConverted = BaseService.getUIFormatedDate(invItem.invoiceDate, vm.DefaultDateFormat);
              if (vm.custPaymentModel.isZeroPayment) {
                invItem.isNotAllowForZeroInvPayment = (invItem.originalPayAmountOfInvoice > 0 || !invItem.isZeroValue);
              } else {
                invItem.isNotAllowForZeroInvPayment = invItem.originalPayAmountOfInvoice === 0 && !invItem.isZeroValue;
              }
            });
            setSumOfAmountForCustInvoicePaymentList();
            setSumOfCurrPayAmountForCustInvPaymentList();
            const checkAnyNotSelectedInv = _.some(vm.custInvoicePaymentList, (data) => !data.isSelected);
            vm.isAllSelectFromCustInvoicePaymentList = checkAnyNotSelectedInv ? false : true;

            vm.custPaymentModel.sumOfAppliedInvPayRefundedAmt = parseFloat(((vm.totPayAmountOfSelectedInv || 0) + (vm.custPaymentModel.totRefundIssuedOfPayment || 0)).toFixed(2));
            vm.custPaymentModel.remainingPaymentInclAmtToBeRefunded = parseFloat(((vm.custPaymentModel.paymentAmount || 0) - (vm.custPaymentModel.sumOfAppliedInvPayRefundedAmt || 0)).toFixed(2));

            if (vm.custPaymentModel.isZeroPayment) {
              setSelectAllConfigurationForZeroPayment();
            }
          }
          vm.customerPastDueBalanceTillToday = resp.data.customerPastDueBalance;
          vm.custCurrentTermsDays = resp.data.customerCurrentTermsDays;
          vm.diffAmtBetPayAmtAndSelectedInvAmt = parseFloat(((vm.custPaymentModel.paymentAmount || 0) - (vm.sumOfPaymentAmountForSelectedInvoice || 0)).toFixed(2));
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // get all credit memo of customer with payment information
    const retrieveAllCreditMemoOfCustomerPayment = (custPayDet) => {
      if (!custPayDet || !custPayDet.customerID) {
        return;
      }
      const custPayInfo = {
        customerID: custPayDet.customerID,
        transTypeForCreditMemo: CORE.TRANSACTION_TYPE.CREDITNOTE
      };
      vm.cgBusyLoading = CustomerPaymentFactory.getAllCreditMemoOfCustomerPayment().query({ custPayInfo: custPayInfo }).$promise.then((resp) => {
        vm.custCreditMemoPaymentList = [];
        if (resp && resp.data && resp.data.customerCreditMemoList && resp.data.customerCreditMemoList.length > 0) {
          vm.custCreditMemoPaymentList = resp.data.customerCreditMemoList;
          _.each(vm.custCreditMemoPaymentList, (creditMemoItem) => {
            creditMemoItem.creditMemoDate = BaseService.getUIFormatedDate(creditMemoItem.creditMemoDate, vm.DefaultDateFormat);
            if (creditMemoItem.refDebitMemoDate) {
              creditMemoItem.refDebitMemoDate = BaseService.getUIFormatedDate(creditMemoItem.refDebitMemoDate, vm.DefaultDateFormat);
            }
            // credit memo amount is in minus so below openCreditMemoAmount get with plus
            creditMemoItem.openCreditMemoAmount = parseFloat(((creditMemoItem.originalCreditMemoAmount || 0) + (creditMemoItem.pastPaidAmountFromCreditMemo || 0)).toFixed(2));
          });
          setSumOfAmountForCustCreditMemoPaymentList();
          vm.custCreditMemoPaymentList = _.orderBy(vm.custCreditMemoPaymentList, ['creditMemoDate'], ['asc']);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // to get customer invoice payment master data
    const retrieveCustInvPaymentMstData = () => CustomerPaymentFactory.getCustInvPaymentMstData().query({
      customerPaymentMstID: vm.custPaymentMstID,
      refPaymentMode: TRANSACTION.ReceivableRefPaymentMode.ReceivablePayment.code
    }).$promise.then((resp) => {
      if (resp && resp.data && resp.status === CORE.ApiResponseTypeStatus.SUCCESS) {
        vm.custPaymentModel = resp.data.custPaymentMstData;
        // default under payment action is leave amount as under payment
        vm.custPaymentModel.underPaymentAction = TRANSACTION.UnderPaymentActions.LeavethisAsAnUnderpayment.Value;
        vm.custPaymentModel.isMarkForRefund = vm.custPaymentModel.isMarkForRefund === 1 ? true : false;
        vm.custPaymentModel.leftOverCMAmtToBeRefunded = parseFloat(((vm.custPaymentModel.agreedRefundAmt || 0) - (vm.custPaymentModel.totRefundIssuedOfPayment || 0)).toFixed(2));

        if (vm.custPaymentModel.paymentDate) {
          vm.custPaymentModel.paymentDate = BaseService.getUIFormatedDate(vm.custPaymentModel.paymentDate, vm.DefaultDateFormat);
        }
        vm.isCustPaymentLocked = vm.custPaymentModel.lockStatus === vm.CustPaymentLockStatusConst.Locked ? true : false;
        if ($scope.$parent && $scope.$parent.vm && vm.custPaymentModel) {
          $scope.$parent.vm.custPaymentMstDetParent = vm.custPaymentModel;
          if (vm.isCustPaymentLocked && $scope.$parent.vm.custPaymentMstDetParent.lockedByUserName) {
            const userNameWithSplit = vm.custPaymentModel.lockedByUserName.split(' ');
            $scope.$parent.vm.custPaymentMstDetParent.lockedByUserFullName = stringFormat(CORE.GENERIC_DATA_FORMAT.EmployeeManager, vm.custPaymentModel.lockedByUserInitialName, userNameWithSplit[0], userNameWithSplit[1]);
          }
          $scope.$parent.vm.custPaymentMstDetParent.isCustPaymentLocked = vm.isCustPaymentLocked;
        }
        setDetailsForMainParentForm();
      }
      return $q.resolve(resp);
    }).catch((error) => BaseService.getErrorLog(error));

    const init = () => {
      const promises = [getCustomerList(), getPaymentMethodType(), getBankList()];
      if (vm.custPaymentMstID) {
        promises.push(retrieveCustInvPaymentMstData());
      }
      vm.cgBusyLoading = $q.all(promises).then(() => {
        initAutoComplete();
      }).catch((error) => BaseService.getErrorLog(error));
    };
    init();

    // to set sum count for invoice table payment
    const setSumOfAmountForCustInvoicePaymentList = () => {
      vm.sumOfOriginalPayAmountForSelectedInvoice = parseFloat((_.sumBy(vm.custInvoicePaymentList, (o) => o.originalPayAmountOfInvoice) || 0).toFixed(2));
      vm.sumOfLiveDueAmountForSelectedInvoice = parseFloat((_.sumBy(vm.custInvoicePaymentList, (o) => o.liveDueAmountForSelectedInvoice) || 0).toFixed(2));
      vm.sumOfPaymentAmountForSelectedInvoice = parseFloat((_.sumBy(vm.custInvoicePaymentList, (o) => o.paymentAmountForSelectedInvoice) || 0).toFixed(2));
      vm.sumOfWriteOffAmtForSelectedInvoice = parseFloat((_.sumBy(vm.custInvoicePaymentList, (o) => o.writeOffAmtForSelectedInvoice) || 0).toFixed(2));

      vm.diffAmtBetPayAmtAndSelectedInvAmt = parseFloat(((vm.custPaymentModel.paymentAmount || 0) - (vm.sumOfPaymentAmountForSelectedInvoice)).toFixed(2));
      vm.paymentVariance = parseFloat(((vm.custPaymentModel.paymentAmount || 0) - ((vm.custPaymentModel.agreedRefundAmt || 0) + (vm.sumOfPaymentAmountForSelectedInvoice))).toFixed(2));

      if (vm.diffAmtBetPayAmtAndSelectedInvAmt < 0) {
        vm.custPaymentModel.isMarkForRefund = false;
        vm.custPaymentModel.agreedRefundAmt = null;
      };
    };

    // sum of paying amount
    const setSumOfCurrPayAmountForCustInvPaymentList = () => {
      vm.sumOfPaymentAmountForSelectedInvoice = parseFloat((_.sumBy(vm.custInvoicePaymentList, (o) => o.paymentAmountForSelectedInvoice) || 0).toFixed(2));
      vm.sumOfWriteOffAmtForSelectedInvoice = parseFloat((_.sumBy(vm.custInvoicePaymentList, (o) => o.writeOffAmtForSelectedInvoice) || 0).toFixed(2));

      vm.diffAmtBetPayAmtAndSelectedInvAmt = parseFloat(((vm.custPaymentModel.paymentAmount || 0) - (vm.sumOfPaymentAmountForSelectedInvoice)).toFixed(2));
      vm.paymentVariance = parseFloat(((vm.custPaymentModel.paymentAmount || 0) - ((vm.custPaymentModel.agreedRefundAmt || 0) + (vm.sumOfPaymentAmountForSelectedInvoice))).toFixed(2));

      const selectedInvList = _.filter(vm.custInvoicePaymentList, (invItem) => invItem.isSelected);

      /* total due amount = if invoice payment added then remaining due amount + paid amount = total due
       if invoice payment not added(new payment) then direct due amount of invoice */
      vm.totDueAmountOfSelectedInv = parseFloat((_.sumBy(selectedInvList, (o) => o.invPaymentDetMstID ? (parseFloat(((o.dueAmountForSelectedInvoice || 0) + (o.invPaidAmtFromCurrPaymentDet || 0)).toFixed(2))) : (o.dueAmountForSelectedInvoice || 0)).toFixed(2))
      ) || 0;

      /* below is total paying amount of different selected invoice */
      vm.totPayAmountOfSelectedInv = parseFloat((_.sumBy(selectedInvList, (o) => o.paymentAmountForSelectedInvoice) || 0).toFixed(2));

      vm.checkAnyInvSelected = _.some(vm.custInvoicePaymentList, (data) => data.isSelected);
      if (vm.checkAnyInvSelected) {
        /* total underpayment amount */
        vm.totUnderPaymentOfDifferentSelectedInv = parseFloat((parseFloat(vm.totDueAmountOfSelectedInv.toFixed(2)) - parseFloat(vm.totPayAmountOfSelectedInv.toFixed(2))).toFixed(2));

        /* total underpayment amount */
        vm.totOverPaymentOfDifferentSelectedInv = (vm.totUnderPaymentOfDifferentSelectedInv === 0 && parseFloat((vm.custPaymentModel.paymentAmount || 0).toFixed(2)) > parseFloat(vm.totDueAmountOfSelectedInv.toFixed(2))) ? parseFloat((parseFloat((vm.custPaymentModel.paymentAmount || 0).toFixed(2)) - parseFloat(vm.totDueAmountOfSelectedInv.toFixed(2))).toFixed(2)) : 0;
      } else {
        vm.totUnderPaymentOfDifferentSelectedInv = 0;
        vm.totOverPaymentOfDifferentSelectedInv = 0;
      }
      vm.totalInvSelectedCount = (_.countBy(vm.custInvoicePaymentList, (data) => data.isSelected).true) || 0;
    };

    // clear all sum calculation
    const clearSumOfAmountForCustInvoicePaymentList = () => {
      vm.custInvoicePaymentList = [];
      vm.sumOfOriginalPayAmountForSelectedInvoice = 0;
      //vm.sumOfPastPaidAmountForSelectedInvoice = 0;
      //vm.sumOfDueAmountForSelectedInvoice = 0;
      vm.sumOfLiveDueAmountForSelectedInvoice = 0;
      vm.sumOfPaymentAmountForSelectedInvoice = 0;
      vm.sumOfWriteOffAmtForSelectedInvoice = 0;
      vm.diffAmtBetPayAmtAndSelectedInvAmt = 0;
      vm.totDueAmountOfSelectedInv = 0;
      vm.totPayAmountOfSelectedInv = 0;
      vm.totUnderPaymentOfDifferentSelectedInv = 0;
      //vm.paymentVariance = 0;
    };

    // called when we select any invoice item to pay from table list
    vm.selectCustSingleInvoice = (invItem) => {
      const totPayAmount = parseFloat(((angular.copy(vm.custPaymentModel.paymentAmount) || 0) - (vm.custPaymentModel.agreedRefundAmt || 0)).toFixed(2));

      if (totPayAmount && totPayAmount > 0 && invItem.isSelected && !vm.custPaymentModel.isZeroPayment) {
        if (parseFloat((invItem.dueAmountForSelectedInvoice + (vm.sumOfPaymentAmountForSelectedInvoice || 0)).toFixed(2)) <= totPayAmount) {
          vm.selectSingleInvWithForwardingAmt(invItem, invItem.dueAmountForSelectedInvoice);
        } else {
          const partialDueAmount = parseFloat((totPayAmount - (vm.sumOfPaymentAmountForSelectedInvoice || 0)).toFixed(2));
          vm.selectSingleInvWithForwardingAmt(invItem, partialDueAmount);
        }
      } else if (vm.custPaymentModel.isZeroPayment) {
        setSelectAllConfigurationForZeroPayment();
      } else {
        vm.isAllSelectFromCustInvoicePaymentList = false;
        invItem.paymentAmountForSelectedInvoice = 0;
        invItem.writeOffAmtForSelectedInvoice = 0;
      }
      calcLiveDueAmountForSelectedInv(invItem);
      setSumOfAmountForCustInvoicePaymentList();
      setSumOfCurrPayAmountForCustInvPaymentList();
    };

    // called when we select/deselected all check box
    vm.selectCustAllInvoice = () => {
      //reset all selected first
      const checkAnyInvSelected = _.some(vm.custInvoicePaymentList, (data) => data.isSelected);
      if (checkAnyInvSelected && vm.isAllSelectFromCustInvoicePaymentList) {
        vm.isAllSelectFromCustInvoicePaymentList = false;
        _.each(vm.custInvoicePaymentList, (data) => {
          if (!data.isLocked) {  // if locked then not allowed to change
            data.isSelected = false;
            data.paymentAmountForSelectedInvoice = 0;
            data.writeOffAmtForSelectedInvoice = 0;
            setSumOfAmountForCustInvoicePaymentList();
            setSumOfCurrPayAmountForCustInvPaymentList();
          }
        });
        vm.isAllSelectFromCustInvoicePaymentList = true;
      }

      // apply invoice payment
      let totPayAmount = parseFloat(((angular.copy(vm.custPaymentModel.paymentAmount) || 0) - (vm.custPaymentModel.agreedRefundAmt || 0)).toFixed(2));
      _.each(vm.custInvoicePaymentList, (data) => {
        if (!data.isLocked) {  // if locked then not allowed to change
          if (vm.custPaymentModel.isZeroPayment) {
            data.paymentAmountForSelectedInvoice = 0;
            data.writeOffAmtForSelectedInvoice = 0;
            data.isNotAllowForZeroInvPayment = (data.originalPayAmountOfInvoice > 0 || !data.isZeroValue);
            data.isSelected = (data.originalPayAmountOfInvoice > 0 || !data.isZeroValue) ? false : vm.isAllSelectFromCustInvoicePaymentList;
          } else {
            data.isNotAllowForZeroInvPayment = (data.originalPayAmountOfInvoice === 0 && !data.isZeroValue);
            data.isSelected = data.isNotAllowForZeroInvPayment ? false : vm.isAllSelectFromCustInvoicePaymentList;
            if (totPayAmount && totPayAmount > 0 && vm.isAllSelectFromCustInvoicePaymentList) {
              if (data.invPaymentDetMstID) {
                // in edit case > reset original paid amount (paid from current inv pay det)
                data.paymentAmountForSelectedInvoice = parseFloat(angular.copy(data.invPaidAmtFromCurrPaymentDet).toFixed(2));
                totPayAmount = parseFloat((totPayAmount - data.paymentAmountForSelectedInvoice).toFixed(2));
              } else {
                //// in add new inv pay det case > reset due payment amount
                //data.paymentAmountForSelectedInvoice = parseFloat(data.dueAmountForSelectedInvoice.toFixed(2));
                if (parseFloat((data.dueAmountForSelectedInvoice + (vm.sumOfPaymentAmountForSelectedInvoice || 0)).toFixed(2)) <= totPayAmount) {
                  // in add new inv pay det case > reset due payment amount
                  data.paymentAmountForSelectedInvoice = parseFloat(data.dueAmountForSelectedInvoice.toFixed(2));
                  totPayAmount = parseFloat((totPayAmount - data.dueAmountForSelectedInvoice).toFixed(2));
                } else {
                  const partialDueAmount = parseFloat((totPayAmount - (vm.sumOfPaymentAmountForSelectedInvoice || 0)).toFixed(2));
                  // in add new inv pay det case > reset due payment amount
                  data.paymentAmountForSelectedInvoice = parseFloat(partialDueAmount.toFixed(2));
                  totPayAmount = 0;
                }
              }
            } else {
              data.paymentAmountForSelectedInvoice = 0;
              data.writeOffAmtForSelectedInvoice = 0;
            }
            calcLiveDueAmountForSelectedInv(data);
            //data.liveDueAmountForSelectedInvoice = parseFloat(((parseFloat(data.originalPayAmountOfInvoice.toFixed(2))) - (parseFloat((data.pastPaidAmtExcludeCurrTransForSelectedInv || 0).toFixed(2)) + parseFloat((data.paymentAmountForSelectedInvoice || 0).toFixed(2)) + parseFloat((invItem.writeOffAmtForSelectedInvoice || 0).toFixed(2)))).toFixed(2));
          }
        }
      });
      setSumOfAmountForCustInvoicePaymentList();
      setSumOfCurrPayAmountForCustInvPaymentList();
      if (vm.custPaymentModel.isZeroPayment) {
        setSelectAllConfigurationForZeroPayment();
      }
    };

    /* called on change of main payment amount change */
    vm.mainPaymentAmountChange = () => {
      if (!vm.custInvoicePaymentList || vm.custInvoicePaymentList.length === 0) {
        return;
      }

      vm.isAllSelectFromCustInvoicePaymentList = false;
      vm.selectCustAllInvoice();

      // if feature is on auto select invoice based on > invoice amount > invoice date
      if (custReceiptInvAutoSelectTypeValue && !vm.custPaymentMstID && vm.custPaymentModel.paymentAmount > 0) {
        let totPayAmount = parseFloat((angular.copy(vm.custPaymentModel.paymentAmount) || 0).toFixed(2));
        if (custReceiptInvAutoSelectTypeValue === customerReceiptInvoiceAutoSelectTypeConst.ExactMatchSelection) {
          let isExactMatchedOfInvFoundWithPayAmount = false;

          // first check for exact amount match with invoices amount
          for (let i = 0; i < vm.custInvoicePaymentList.length; i++) {
            let matchedTempInvList = [];
            for (let j = i; j < vm.custInvoicePaymentList.length; j++) {
              matchedTempInvList.push(vm.custInvoicePaymentList[j]);

              // if matched invoice due count matched with total payment count then select all
              if (parseFloat((_.sumBy(matchedTempInvList, (o) => o.dueAmountForSelectedInvoice) || 0).toFixed(2)) === totPayAmount) {
                isExactMatchedOfInvFoundWithPayAmount = true;
                _.each(matchedTempInvList, (matchedTempInvItem) => {
                  //const matchOriginalInvItem = _.find(vm.custInvoicePaymentList, (invItem) => invItem.invoiceMstID === matchedTempInvItem.invoiceMstID);
                  if (matchedTempInvItem.dueAmountForSelectedInvoice > 0) {
                    matchedTempInvItem.isSelected = true;
                    vm.selectCustSingleInvoice(matchedTempInvItem);
                  }
                });
                return;
              }
            }
            if (isExactMatchedOfInvFoundWithPayAmount) {
              matchedTempInvList = [];
              return;
            }
          }

          /* if matched invoice due count NOT matched with total payment count then apply from start (invoice date based) */
          if (!isExactMatchedOfInvFoundWithPayAmount) {
            for (i = 0; i < vm.custInvoicePaymentList.length; i++) {
              if (vm.custInvoicePaymentList[i].dueAmountForSelectedInvoice > 0 && ((totPayAmount - vm.custInvoicePaymentList[i].dueAmountForSelectedInvoice) >= 0)) {
                totPayAmount = totPayAmount - vm.custInvoicePaymentList[i].dueAmountForSelectedInvoice;
                vm.custInvoicePaymentList[i].isSelected = true;
                vm.selectCustSingleInvoice(vm.custInvoicePaymentList[i]);
              }
            }
          }
        } else if (custReceiptInvAutoSelectTypeValue === customerReceiptInvoiceAutoSelectTypeConst.ForwardingBalanceSelection) {
          // Forwarding Balance based invoice selection
          for (i = 0; i < vm.custInvoicePaymentList.length; i++) {
            if (totPayAmount && totPayAmount > 0 && vm.custInvoicePaymentList[i].dueAmountForSelectedInvoice > 0) {
              if (parseFloat((totPayAmount - vm.custInvoicePaymentList[i].dueAmountForSelectedInvoice).toFixed(2)) >= 0) {
                vm.custInvoicePaymentList[i].isSelected = true;
                vm.selectSingleInvWithForwardingAmt(vm.custInvoicePaymentList[i], vm.custInvoicePaymentList[i].dueAmountForSelectedInvoice);
                totPayAmount = parseFloat((totPayAmount - vm.custInvoicePaymentList[i].dueAmountForSelectedInvoice).toFixed(2));
                if (totPayAmount === 0) {
                  break;
                }
              } else {
                vm.custInvoicePaymentList[i].isSelected = true;
                vm.selectSingleInvWithForwardingAmt(vm.custInvoicePaymentList[i], totPayAmount);
                totPayAmount = 0;
                break;
              }
            }
          }
          setSumOfAmountForCustInvoicePaymentList();
        }
      }
    };

    /* called on change of current payment amount change from invoice payment list */
    vm.paymentAmountChangeForSelectedInvoice = (invItem) => {
      // get all invalid/blank/null invoice payment
      if ((invItem.paymentAmountForSelectedInvoice === null) || (invItem.paymentAmountForSelectedInvoice === undefined)) {
        //getLatestInvPaymentDet();
        if (vm.customerPaymentForm['invPayDetForm_' + invItem.invoiceMstID]['paymentAmountForSelectedInvoice_' + invItem.invoiceMstID] && vm.customerPaymentForm['invPayDetForm_' + invItem.invoiceMstID]['paymentAmountForSelectedInvoice_' + invItem.invoiceMstID].$viewValue && vm.customerPaymentForm['invPayDetForm_' + invItem.invoiceMstID]['paymentAmountForSelectedInvoice_' + invItem.invoiceMstID].$viewValue > 0 && vm.customerPaymentForm['invPayDetForm_' + invItem.invoiceMstID]['paymentAmountForSelectedInvoice_' + invItem.invoiceMstID].$viewValue > invItem.maxLimitOfDueAmountToPay) {
          invItem.paymentAmountForSelectedInvoice = 0;
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_INV_PAY_ITEM_MAX_ALLOWED_AMT);
          messageContent.message = stringFormat(messageContent.message, 'Payment', vm.customerPaymentForm['invPayDetForm_' + invItem.invoiceMstID]['paymentAmountForSelectedInvoice_' + invItem.invoiceMstID].$viewValue, invItem.maxLimitOfDueAmountToPay);
          const model = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(model).then(() => {
            setFocus('paymentAmountForSelectedInvoice_' + invItem.invoiceMstID);
          }).catch((error) => {
            BaseService.getErrorLog(error);
          });
        } else {
          invItem.paymentAmountForSelectedInvoice = 0;
        }
        //return;   // all invalid
      }

      /* check main payment amount. if its less than (selected inv + refunded) amount then not valid */
      const sumOfSelectedInvPaymentAmtWithAgreedRefund = parseFloat(((_.sumBy(vm.custInvoicePaymentList, (o) => o.paymentAmountForSelectedInvoice) || 0) + (vm.custPaymentModel.agreedRefundAmt || 0)).toFixed(2));
      // if selected invoices amount is more than main payment amount than display error
      if ((vm.custPaymentModel.paymentAmount || 0) < (sumOfSelectedInvPaymentAmtWithAgreedRefund || 0)) {
        invItem.paymentAmountForSelectedInvoice = 0;
        const msgContForPayAmtNotMore = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.INV_AMT_NOT_MORE_THAN_ACTUAL_PAY_AMT);
        msgContForPayAmtNotMore.message = stringFormat(msgContForPayAmtNotMore.message, 'Remaining Payment');
        const model = {
          messageContent: msgContForPayAmtNotMore
        };
        DialogFactory.messageAlertDialog(model).then(() => {
          setFocus('paymentAmountForSelectedInvoice_' + invItem.invoiceMstID);
        }).catch((error) => {
          BaseService.getErrorLog(error);
        });
      }
      calcLiveDueAmountForSelectedInv(invItem);
      setSumOfAmountForCustInvoicePaymentList();
      setSumOfCurrPayAmountForCustInvPaymentList();
    };

    /* called on change of write off amount from invoice payment list */
    vm.writeOffAmtChangeForSelectedInvoice = (invItem) => {
      // get all invalid/blank/null invoice payment
      if (invItem.writeOffAmtForSelectedInvoice) {
        //getLatestInvPaymentDet();
        if (vm.customerPaymentForm['invPayDetForm_' + invItem.invoiceMstID]['writeOffAmtForSelectedInvoice_' + invItem.invoiceMstID] && vm.customerPaymentForm['invPayDetForm_' + invItem.invoiceMstID]['writeOffAmtForSelectedInvoice_' + invItem.invoiceMstID].$modelValue && vm.customerPaymentForm['invPayDetForm_' + invItem.invoiceMstID]['writeOffAmtForSelectedInvoice_' + invItem.invoiceMstID].$modelValue > invItem.liveDueAmountForSelectedInvoice) {
          invItem.writeOffAmtForSelectedInvoice = 0;
          calcLiveDueAmountForSelectedInv(invItem); // to reset data as its live amount
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_INV_PAY_ITEM_MAX_ALLOWED_AMT);
          messageContent.message = stringFormat(messageContent.message, 'Write Off', vm.customerPaymentForm['invPayDetForm_' + invItem.invoiceMstID]['writeOffAmtForSelectedInvoice_' + invItem.invoiceMstID].$viewValue, invItem.liveDueAmountForSelectedInvoice);
          const model = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(model).then(() => {
            setFocus('writeOffAmtForSelectedInvoice_' + invItem.invoiceMstID);
          }).catch((error) => {
            BaseService.getErrorLog(error);
          });
        }
      }

      /* check main payment amount. if its less than (selected inv + refunded) amount then not valid */
      const sumOfSelectedInvPaymentAmtWithAgreedRefund = parseFloat(((_.sumBy(vm.custInvoicePaymentList, (o) => o.paymentAmountForSelectedInvoice) || 0) + (vm.custPaymentModel.agreedRefundAmt || 0)).toFixed(2));
      // if selected invoices amount is more than main payment amount than display error
      if ((vm.custPaymentModel.paymentAmount || 0) < (sumOfSelectedInvPaymentAmtWithAgreedRefund || 0)) {
        invItem.paymentAmountForSelectedInvoice = 0;
        const msgContForPayAmtNotMore = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.INV_AMT_NOT_MORE_THAN_ACTUAL_PAY_AMT);
        msgContForPayAmtNotMore.message = stringFormat(msgContForPayAmtNotMore.message, 'Remaining Payment');
        const model = {
          messageContent: msgContForPayAmtNotMore
        };
        DialogFactory.messageAlertDialog(model).then(() => {
          setFocus('paymentAmountForSelectedInvoice_' + invItem.invoiceMstID);
        }).catch((error) => {
          BaseService.getErrorLog(error);
        });
      }

      invItem.maxLimitOfDueAmountToPay = parseFloat((invItem.invPaymentDetMstID ? parseFloat((((invItem.dueAmountForSelectedInvoice || 0) + (invItem.invPaidAmtFromCurrPaymentDet || 0)) - (invItem.writeOffAmtForSelectedInvoice || 0)).toFixed(2)) : parseFloat(((invItem.dueAmountForSelectedInvoice || 0) - (invItem.writeOffAmtForSelectedInvoice || 0)).toFixed(2))).toFixed(2));

      calcLiveDueAmountForSelectedInv(invItem);
      setSumOfAmountForCustInvoicePaymentList();
      setSumOfCurrPayAmountForCustInvPaymentList();
    };

    // to set sum count for credit memo table payment
    const setSumOfAmountForCustCreditMemoPaymentList = () => {
      vm.sumOfOriginalCreditMemoAmount = parseFloat((_.sumBy(vm.custCreditMemoPaymentList, (o) => o.originalCreditMemoAmount) || 0).toFixed(2));
      //vm.sumOfPastPaidAmountFromCreditMemo = parseFloat((_.sumBy(vm.custCreditMemoPaymentList, (o) => o.pastPaidAmountFromCreditMemo) || 0).toFixed(2));
      vm.sumOfOpenCreditMemoAmount = parseFloat((_.sumBy(vm.custCreditMemoPaymentList, (o) => o.openCreditMemoAmount) || 0).toFixed(2));
      vm.sumOfTotRefundIssuedAgainstCM = parseFloat((_.sumBy(vm.custCreditMemoPaymentList, (o) => o.totRefundIssuedAgainstCreditMemo) || 0).toFixed(2));
    };

    // create/update customer payment details
    vm.saveCustomerPayment = () => {
      vm.addUpdatePaymentSuccessMsg = null;
      if (vm.custPaymentModel.isPaymentVoided || vm.isCustPaymentLocked) {
        /* when payment is already voided or when customer payment locked then not allowed to access */
        return;
      }

      $scope.$parent.vm.saveBtnDisableFlag = true;
      if (BaseService.focusRequiredField(vm.customerPaymentForm)) {
        $scope.$parent.vm.saveBtnDisableFlag = false;
        return;
      }
      takeConfirmationForZeroAmtInv();
    };

    // check any invoice with 0 amount and selected then take confirmation for same
    const takeConfirmationForZeroAmtInv = () => {
      const checkAnyInvWithZeroAmt = _.some(vm.custInvoicePaymentList, (data) => data.paymentAmountForSelectedInvoice === 0 && data.isSelected);

      if (checkAnyInvWithZeroAmt) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_PAYMENT_INCLUDE_ZERO_AMT_INV_CONFM);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        return DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            validateCustomerPaymentDetails();
          }
        }, () => {
          $scope.$parent.vm.saveBtnDisableFlag = false;
        }).catch((error) => {
          $scope.$parent.vm.saveBtnDisableFlag = false;
          BaseService.getErrorLog(error);
        });
      } else {
        validateCustomerPaymentDetails();
      }
    };

    // validate Customer Payment Details
    const validateCustomerPaymentDetails = () => {
      // get invalid main payment amount
      if ((vm.custPaymentModel.paymentAmount === null) || (vm.custPaymentModel.paymentAmount === undefined) || (vm.custPaymentModel.paymentAmount === '') || ((vm.custPaymentModel.paymentAmount || 0) < 0)) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.PLEASE_ENTER_VALID_FIELD_VALUE);
        messageContent.message = stringFormat(messageContent.message, 'payment amount');
        const model = {
          messageContent: messageContent
        };
        return DialogFactory.messageAlertDialog(model).then(() => {
          $scope.$parent.vm.saveBtnDisableFlag = false;
          setFocusByName('paymentAmount');
        }).catch((error) => {
          $scope.$parent.vm.saveBtnDisableFlag = false;
          BaseService.getErrorLog(error);
        });
      }

      // if selected invoices amount is more than main payment amount than display error
      if ((vm.custPaymentModel.paymentAmount || 0) < (vm.sumOfPaymentAmountForSelectedInvoice || 0)) {
        const msgContForPayAmtNotMore = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.INV_AMT_NOT_MORE_THAN_ACTUAL_PAY_AMT);
        msgContForPayAmtNotMore.message = stringFormat(msgContForPayAmtNotMore.message, 'Payment');
        const model = {
          messageContent: msgContForPayAmtNotMore
        };
        return DialogFactory.messageAlertDialog(model).then(() => {
          $scope.$parent.vm.saveBtnDisableFlag = false;
          setFocusByName('paymentAmount');
        }).catch((error) => {
          $scope.$parent.vm.saveBtnDisableFlag = false;
          BaseService.getErrorLog(error);
        });
      }


      // if selected invoices amount is more than main payment amount than display error
      if (!vm.custPaymentModel.isZeroPayment && (vm.custPaymentModel.agreedRefundAmt || 0) > vm.custPaymentModel.paymentAmount) {
        const model = {
          messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.AGREED_REFUND_AMT_NOT_MORE_THAN_ACTUAL_PAY_AMT)
        };
        return DialogFactory.messageAlertDialog(model).then(() => {
          $scope.$parent.vm.saveBtnDisableFlag = false;
          setFocusByName('agreedRefundAmt');
        }).catch((error) => {
          $scope.$parent.vm.saveBtnDisableFlag = false;
          BaseService.getErrorLog(error);
        });
      }

      // zero payment invoice then at least one invoice must be selected(added) as 0 invoice payment
      if (vm.custPaymentModel.isZeroPayment) {
        const isAnyZeroInvPaySelected = _.some(vm.custInvoicePaymentList, (invItem) => invItem.isSelected && invItem.originalPayAmountOfInvoice === 0);
        if (!isAnyZeroInvPaySelected) {
          const model = {
            messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SELECT_ONE_ZERO_AMT_INV_CUST_PAYMENT)
          };
          return DialogFactory.messageAlertDialog(model).then(() => {
            $scope.$parent.vm.saveBtnDisableFlag = false;
            const firstZeroInvItem = _.find(vm.custInvoicePaymentList, (invItem) => invItem.originalPayAmountOfInvoice === 0);
            if (firstZeroInvItem) {
              setFocus('isSelected_' + firstZeroInvItem.invoiceMstID);
            }
            return;
          }).catch((error) => {
            $scope.$parent.vm.saveBtnDisableFlag = false;
            BaseService.getErrorLog(error);
          });
        }
      }

      // get all invalid invoice payment list
      const invalidPaymentList = _.filter(vm.custInvoicePaymentList, (invItem) => (invItem.paymentAmountForSelectedInvoice === null) || (invItem.paymentAmountForSelectedInvoice === undefined) || (invItem.paymentAmountForSelectedInvoice === '') || (invItem.paymentAmountForSelectedInvoice > invItem.maxLimitOfDueAmountToPay)
      );
      if (invalidPaymentList && invalidPaymentList.length > 0) {
        $scope.$parent.vm.saveBtnDisableFlag = false;
        return;
      }

      // take confirmation for write off transaction
      if (vm.custPaymentModel.underPaymentAction === TRANSACTION.UnderPaymentActions.WriteOffTheExtraAmount.Value) {

        // write off amount required if write off option selected
        if (!vm.sumOfWriteOffAmtForSelectedInvoice) {
          const msgCntForWOFFAmtRequired = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.TOT_CUST_WOFF_GREATER_THEN_ZERO);
          const model = {
            messageContent: msgCntForWOFFAmtRequired
          };
          return DialogFactory.messageAlertDialog(model).then(() => {
            $scope.$parent.vm.saveBtnDisableFlag = false;
            const firstInvItemForWOFF = _.find(vm.custInvoicePaymentList, (invItem) => invItem.isSelected && invItem.maxLimitOfDueAmountToPay > 0);
            if (firstInvItemForWOFF) {
              setFocus('writeOffAmtForSelectedInvoice_' + firstInvItemForWOFF.invoiceMstID);
            }
          }).catch((error) => {
            $scope.$parent.vm.saveBtnDisableFlag = false;
            BaseService.getErrorLog(error);
          });
        }

        const custInvoicePayListForWriteOff = _.filter(vm.custInvoicePaymentList, (invItem) => invItem.isSelected && invItem.writeOffAmtForSelectedInvoice > 0);
        const totWriteOffAmt = parseFloat((_.sumBy(custInvoicePayListForWriteOff, (o) => o.writeOffAmtForSelectedInvoice) || 0).toFixed(2));

        const msgContentForWriteOffAmt = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.WRITE_OFF_FROM_CUST_PAYMENT_CONFIRMATION);
        msgContentForWriteOffAmt.message = stringFormat(msgContentForWriteOffAmt.message, totWriteOffAmt);

        const obj = {
          messageContent: msgContentForWriteOffAmt,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        return DialogFactory.messageConfirmDialog(obj).then((resp) => {
          if (resp) {
            setCustomerPaymentObjToSave();
          }
        }, () => {
          // cancel block
          $scope.$parent.vm.saveBtnDisableFlag = false;
        }).catch((error) => {
          $scope.$parent.vm.saveBtnDisableFlag = false;
          BaseService.getErrorLog(error);
        });
      } else {
        setCustomerPaymentObjToSave();
      }
    };

    // set customer payment object to create/update
    const setCustomerPaymentObjToSave = () => {
      const custPaymentObj = {
        customerPaymentMstID: vm.custPaymentMstID,
        mfgcodeID: vm.autoCompleteCustomer.keyColumnId,
        paymentNumber: vm.custPaymentModel.paymentNumber,
        paymentDate: BaseService.getAPIFormatedDate(vm.custPaymentModel.paymentDate),
        paymentAmount: parseFloat(vm.custPaymentModel.paymentAmount.toFixed(2)),
        paymentType: vm.autoCompletePaymentMethodType.keyColumnId,
        accountReference: vm.custPaymentModel.accountReference,
        bankAccountMasID: vm.autoCompleteBankAccountNumber.keyColumnId,
        bankAccountNo: vm.custPaymentModel.bankAccountNo,
        bankName: vm.custPaymentModel.bankName,
        remark: vm.custPaymentModel.remark,
        isZeroPayment: vm.custPaymentModel.isZeroPayment || false,
        depositBatchNumber: vm.custPaymentModel.depositBatchNumber,
        refGencTransModeID: CORE.GenericTransModeName.RefundPayableWOFF.id,
        refPaymentMode: CORE.RefPaymentModeForInvoicePayment.Receivable,
        isConfmTakenForDuplicateCheckNo: false,
        isMarkForRefund: vm.custPaymentModel.isMarkForRefund,
        agreedRefundAmt: vm.custPaymentModel.agreedRefundAmt ? parseFloat(vm.custPaymentModel.agreedRefundAmt.toFixed(2)) : null,
        refundStatus: null,
        custInvoicePaymentDetList: [],
        deleteCustInvPaymentDetList: [],
        isWriteOffExtraAmount: (vm.custPaymentModel.underPaymentAction === TRANSACTION.UnderPaymentActions.WriteOffTheExtraAmount.Value),
        paymentTypeForWriteOffCustPayment: null,
        paymentAmountForWriteOffCustPayment: null,
        writeOffCustInvoicePaymentDetList: [],
        writeOffReason: vm.custPaymentModel.writeOffReason
      };

      // set Write Off type payment details
      if (custPaymentObj.isWriteOffExtraAmount) {
        const writeOffGCDet = _.find(vm.paymentMethodTypeList, (item) => item.gencCategoryCode === TRANSACTION.ReceivablePaymentMethodGenericCategory.WriteOff.gencCategoryCode);
        custPaymentObj.paymentTypeForWriteOffCustPayment = writeOffGCDet ? writeOffGCDet.gencCategoryID : null;

        const custInvoicePayListForWriteOff = _.filter(vm.custInvoicePaymentList, (invItem) => invItem.isSelected && invItem.writeOffAmtForSelectedInvoice > 0);
        let totDueAmountForWriteOff = 0;
        _.each(custInvoicePayListForWriteOff, (invItem) => {
          const _obj = {
            invoiceMstID: invItem.invoiceMstID,
            dueAmountForSelectedInvoice: parseFloat(invItem.writeOffAmtForSelectedInvoice.toFixed(2))
          };
          totDueAmountForWriteOff = totDueAmountForWriteOff + parseFloat(invItem.writeOffAmtForSelectedInvoice.toFixed(2));
          custPaymentObj.writeOffCustInvoicePaymentDetList.push(_obj);
        });
        custPaymentObj.paymentAmountForWriteOffCustPayment = totDueAmountForWriteOff;
        custPaymentObj.isWriteOffExtraAmount = totDueAmountForWriteOff > 0 ? true : false;
      }

      const custInvoicePayListOfCurrApplyPay = _.filter(vm.custInvoicePaymentList, (invItem) => invItem.isSelected
        && ((invItem.paymentAmountForSelectedInvoice > 0) || (invItem.paymentAmountForSelectedInvoice === 0 && invItem.originalPayAmountOfInvoice === 0)));
      // loop over all selected to pay invoice
      _.each(custInvoicePayListOfCurrApplyPay, (invItem) => {
        const _obj = {
          invPaymentDetMstID: invItem.invPaymentDetMstID || {},
          invoiceMstID: invItem.invoiceMstID,
          originalPayAmountOfInvoice: invItem.originalPayAmountOfInvoice ? parseFloat(invItem.originalPayAmountOfInvoice.toFixed(2)) : 0,
          invTotPaidAmtFromAllPaymentDet: invItem.invTotPaidAmtFromAllPaymentDet ? parseFloat(invItem.invTotPaidAmtFromAllPaymentDet.toFixed(2)) : 0,
          paymentAmountForSelectedInvoice: invItem.paymentAmountForSelectedInvoice ? parseFloat(invItem.paymentAmountForSelectedInvoice.toFixed(2)) : 0,
          appliedDate: {}
        };

        custPaymentObj.custInvoicePaymentDetList.push(_obj);
      });

      // set payment refund status for create payment case (on update case - directly from SP)
      if (!vm.custPaymentMstID) {
        custPaymentObj.refundStatus = vm.custPaymentModel.isMarkForRefund ? TRANSACTION.CustomerPaymentRefundStatusText.PendingRefund.Code : TRANSACTION.CustomerPaymentRefundStatusText.NotApplicable.Code;
      }

      manageCustomerPayment(custPaymentObj);
    };

    // create/update customer payment call
    const manageCustomerPayment = (custPaymentObj) => {
      // call update customer payment and invoice detail list
      if (vm.custPaymentMstID) {
        const deleteCustInvoicePayList = _.filter(vm.custInvoicePaymentList, (invItem) => invItem.invPaymentDetMstID &&
          ((!invItem.isSelected) || (invItem.isSelected && invItem.paymentAmountForSelectedInvoice === 0 && invItem.originalPayAmountOfInvoice > 0)));
        if (deleteCustInvoicePayList && deleteCustInvoicePayList.length > 0) {
          _.each(deleteCustInvoicePayList, (invItem) => {
            const _deleteObj = {
              invPaymentDetMstID: invItem.invPaymentDetMstID,
              refCustPackingslipInvoiceID: invItem.refCustPackingslipInvoiceID
            };
            custPaymentObj.deleteCustInvPaymentDetList.push(_deleteObj);
          });
        }

        vm.cgBusyLoading = CustomerPaymentFactory.updateCustomerPayment().query({ custPayObj: custPaymentObj }).$promise.then((resp) => {
          $scope.$parent.vm.saveBtnDisableFlag = false;
          if (resp && resp.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            vm.addUpdatePaymentSuccessMsg = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_PAYMENT_APPLIED_SUCCESS.message;
            retrieveCustInvPaymentMstData();
            const custPayDet = {
              customerID: vm.autoCompleteCustomer.keyColumnId
            };
            retrieveAllInvoiceOfCustomerPayment(custPayDet);
            setDetailsForMainParentForm();
            vm.customerPaymentForm.$setPristine();
          } else if (resp && resp.status === CORE.ApiResponseTypeStatus.FAILED && resp.errors && resp.errors.data) {
            if ((resp.errors.data.mismatchInvPaymentDetList && resp.errors.data.mismatchInvPaymentDetList.length > 0) ||
              (resp.errors.data.deletedInvPaymentDetList && resp.errors.data.deletedInvPaymentDetList.length > 0)) {
              // customer payment details changed externally/ found any deleted pay details and trying save same
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_PAYMENT_DET_CHANGED_TRY_AGAIN);
              const model = {
                messageContent: messageContent
              };
              DialogFactory.messageAlertDialog(model).then(() => {
                getLatestInvPaymentDet();
              }).catch((error) => {
                $scope.$parent.vm.saveBtnDisableFlag = false;
                BaseService.getErrorLog(error);
              });
            } else if (resp.errors.data.isDuplicateCheckPaymentNo && custPaymentObj.isConfmTakenForDuplicateCheckNo === false) {
              // take confirmation for duplicate payment# or check#
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_PAYMENT_WITH_DUPLICATE_PAY_CHECK_NO_CONFM);
              messageContent.message = stringFormat(messageContent.message, vm.custPaymentModel.paymentNumber);

              const obj = {
                messageContent: messageContent,
                btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
              };
              return DialogFactory.messageConfirmDialog(obj).then((resp) => {
                if (resp) {
                  custPaymentObj.isConfmTakenForDuplicateCheckNo = true;
                  manageCustomerPayment(custPaymentObj);
                }
              }, () => {
                // cancel block
                $scope.$parent.vm.saveBtnDisableFlag = false;
              }).catch((error) => {
                $scope.$parent.vm.saveBtnDisableFlag = false;
                BaseService.getErrorLog(error);
              });
            }
            //else if (resp.errors.data.isInvTotPayDiffWithMainPayAndLockedStatus) {
            //  // when payment locked and invoice total amount mismatch with main payment amount
            //  displayErorMsgForLockPayWithMisMatchInvAmt();
            //  return;
            //}
            else if (resp.errors.data.isAgreedRefundAmtLessThanTotIssued) {
              // when Agreed Refund Amount Less Than Total Issued Amout >> error as not allowed
              vm.custPaymentModel.totRefundIssuedOfPayment = resp.errors.data.totRefundIssuedOfPayment;
              /* ng-changed called vm.refundAmtChanged() as we changed totRefundIssuedOfPayment modal value */
              //displayErrorMsgForAgreedRefundLessThanTotIssued(resp.errors.data.totRefundIssuedOfPayment);
              if (vm.custPaymentModel.totRefundIssuedOfPayment === resp.errors.data.totRefundIssuedOfPayment) {
                displayErrorMsgForAgreedRefundLessThanTotIssued(resp.errors.data.totRefundIssuedOfPayment);
              }
              $scope.$parent.vm.saveBtnDisableFlag = false;
            }
          }
        }).catch((error) => {
          $scope.$parent.vm.saveBtnDisableFlag = false;
          BaseService.getErrorLog(error);
        });
      } else {   // call create customer payment and invoice detail list
        vm.cgBusyLoading = CustomerPaymentFactory.createCustomerPayment().query({ custPayObj: custPaymentObj }).$promise.then((resp) => {
          $scope.$parent.vm.saveBtnDisableFlag = false;
          if (resp && resp.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            vm.addUpdatePaymentSuccessMsg = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_PAYMENT_APPLIED_SUCCESS.message;
            vm.custPaymentMstID = resp.data.insertedInvPaymentMstID;
            // update main controller with paymentID and allow to access different tabs
            if ($scope.$parent && $scope.$parent.vm) {
              $scope.$parent.vm.custPaymentMstID = vm.custPaymentMstID;
              _.each($scope.$parent.vm.tabList, (tabItem) => {
                tabItem.isDisabled = false;
              });
            }
            setDetailsForMainParentForm();
            retrieveCustInvPaymentMstData();
            const custPayDet = {
              customerID: vm.autoCompleteCustomer.keyColumnId
            };
            retrieveAllInvoiceOfCustomerPayment(custPayDet);
            vm.customerPaymentForm.$setPristine();
            $state.transitionTo($state.$current, { id: resp.data.insertedInvPaymentMstID }, { location: true, inherit: true, notify: false });
          } else if (resp && resp.status === CORE.ApiResponseTypeStatus.FAILED && resp.errors && resp.errors.data) {
            if (resp.errors.data.mismatchInvPaymentDetList && resp.errors.data.mismatchInvPaymentDetList.length > 0) {
              // customer payment details changed externally
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_PAYMENT_DET_CHANGED_TRY_AGAIN);
              const model = {
                messageContent: messageContent
              };
              DialogFactory.messageAlertDialog(model).then(() => {
                getLatestInvPaymentDet();
              }).catch((error) => {
                $scope.$parent.vm.saveBtnDisableFlag = false;
                BaseService.getErrorLog(error);
              });
            } else if (resp.errors.data.isDuplicateCheckPaymentNo && custPaymentObj.isConfmTakenForDuplicateCheckNo === false) {
              // take confirmation for duplicate payment# or check#
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_PAYMENT_WITH_DUPLICATE_PAY_CHECK_NO_CONFM);
              messageContent.message = stringFormat(messageContent.message, vm.custPaymentModel.paymentNumber);

              const obj = {
                messageContent: messageContent,
                btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
              };
              return DialogFactory.messageConfirmDialog(obj).then((resp) => {
                if (resp) {
                  custPaymentObj.isConfmTakenForDuplicateCheckNo = true;
                  manageCustomerPayment(custPaymentObj);
                }
              }, () => {
                // cancel block
                $scope.$parent.vm.saveBtnDisableFlag = false;
              }).catch((error) => {
                $scope.$parent.vm.saveBtnDisableFlag = false;
                BaseService.getErrorLog(error);
              });
            }
          }
        }).catch((error) => {
          $scope.$parent.vm.saveBtnDisableFlag = false;
          BaseService.getErrorLog(error);
        });
      }
    };

    const setDetailsForMainParentForm = () => {
      if ($scope.$parent && $scope.$parent.vm) {
        $scope.$parent.vm.paymentNumber = vm.custPaymentModel.paymentNumber;
        if ($scope.$parent.vm.custPaymentMstDetParent) {
          $scope.$parent.vm.custPaymentMstDetParent.isPaymentVoided = vm.custPaymentModel.isPaymentVoided;
        }
      }
    };

    // when search any invoice and enter > search invoice and apply
    vm.searchAndApplyInvFromInvNo = () => {
      if (vm.invPaySearch.invoiceNumber !== null && vm.invPaySearch.invoiceNumber !== undefined && vm.invPaySearch.invoiceNumber !== '') {
        const invPayDet = _.find(vm.custInvoicePaymentList, (invItem) => invItem.invoiceNumber.toLowerCase() === vm.invPaySearch.invoiceNumber.toLowerCase());
        if (invPayDet) {
          if (invPayDet.isSelected) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.INV_ALREADY_APPLIED_IN_CUST_PAYMENT);
            messageContent.message = stringFormat(messageContent.message, invPayDet.invoiceNumber);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            return DialogFactory.messageAlertDialog(model).then((resp) => {
              if (resp) {
                setFocusByName('invoiceNumber');
              }
            }).catch((error) => BaseService.getErrorLog(error));
          } else {
            invPayDet.isSelected = true;
            vm.selectCustSingleInvoice(invPayDet);
            vm.invPaySearch.invoiceNumber = null;
          }
        } else {
          // invoice not available
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SEARCH_ITEM_NOT_EXIST_IN_LIST);
          messageContent.message = stringFormat(messageContent.message, 'Invoice#', vm.invPaySearch.invoiceNumber);
          const model = {
            messageContent: messageContent
          };
          return DialogFactory.messageAlertDialog(model).then((resp) => {
            if (resp) {
              setFocusByName('invoiceNumber');
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
    };

    // when search any invoice amount and enter > search invoice with specific amount and apply
    vm.searchAndApplyInvFromInvAmount = () => {
      if (vm.invPaySearch.invoiceAmount !== null && vm.invPaySearch.invoiceAmount !== undefined && vm.invPaySearch.invoiceAmount !== '') {
        let invPayDetList = [];
        if (vm.invPaySearch.invoiceAmount === 0) {
          invPayDetList = _.sortBy(_.filter(vm.custInvoicePaymentList, (invItem) => invItem.liveDueAmountForSelectedInvoice === 0 && invItem.originalPayAmountOfInvoice === 0 && !invItem.isSelected), (o) => o.invoiceDate);
        } else {
          invPayDetList = _.sortBy(_.filter(vm.custInvoicePaymentList, (invItem) => invItem.liveDueAmountForSelectedInvoice === vm.invPaySearch.invoiceAmount && !invItem.isSelected), (o) => o.invoiceDate);
        }

        if (invPayDetList && invPayDetList.length > 0) {
          const invPayDet = _.first(invPayDetList);
          invPayDet.isSelected = true;
          vm.selectCustSingleInvoice(invPayDet);
          vm.invPaySearch.invoiceAmount = null;
        } else {
          // amount not matched with any invoice
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SEARCH_ITEM_NOT_EXIST_IN_LIST);
          messageContent.message = stringFormat(messageContent.message, 'Outstanding amount', '$' + vm.invPaySearch.invoiceAmount);
          const model = {
            messageContent: messageContent
          };
          return DialogFactory.messageAlertDialog(model).then((resp) => {
            if (resp) {
              setFocusByName('invoiceAmount');
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
    };

    // called when we select any invoice item to pay from table list
    vm.selectSingleInvWithForwardingAmt = (invItem, appliedAmt) => {
      if (invItem.isSelected) {
        const checkAnyNotSelectedInv = _.some(vm.custInvoicePaymentList, (data) => !data.isSelected);
        vm.isAllSelectFromCustInvoicePaymentList = checkAnyNotSelectedInv ? false : true;
        if (invItem.invPaymentDetMstID) {
          // in edit case > reset original paid amount (paid from current inv pay det)
          invItem.paymentAmountForSelectedInvoice = parseFloat(angular.copy(invItem.invPaidAmtFromCurrPaymentDet).toFixed(2));
        } else {
          // in add new inv pay det case > reset due payment amount
          invItem.paymentAmountForSelectedInvoice = parseFloat(appliedAmt.toFixed(2));
        }
      } else {
        vm.isAllSelectFromCustInvoicePaymentList = false;
        invItem.paymentAmountForSelectedInvoice = 0;
        invItem.writeOffAmtForSelectedInvoice = 0;
      }
      calcLiveDueAmountForSelectedInv(invItem);
      setSumOfAmountForCustInvoicePaymentList();
      setSumOfCurrPayAmountForCustInvPaymentList();
    };

    // set live due amount
    const calcLiveDueAmountForSelectedInv = (invItem) => {
      invItem.liveDueAmountForSelectedInvoice = parseFloat(((parseFloat(invItem.originalPayAmountOfInvoice.toFixed(2))) - (parseFloat((invItem.pastPaidAmtExcludeCurrTransForSelectedInv || 0).toFixed(2)) + parseFloat((invItem.paymentAmountForSelectedInvoice || 0).toFixed(2)) + parseFloat((invItem.writeOffAmtForSelectedInvoice || 0).toFixed(2)))).toFixed(2));
    };

    // to reset payment details in add mode
    vm.resetPaymentDet = () => {
      if (vm.autoCompleteCustomer.keyColumnId !== null) {
        vm.autoCompleteCustomer.keyColumnId = null;
      } else {
        resetAllPaymentDetails();
      }
    };

    // to refresh customer payment details
    vm.refreshPaymentDet = () => {
      vm.custPaymentModel.underPaymentAction = TRANSACTION.UnderPaymentActions.LeavethisAsAnUnderpayment.Value;

      let isAnyInvPayDetFormDirty = false;
      _.each(vm.custInvoicePaymentList, (invItem) => {
        const isdirty = checkFormDirty(vm.customerPaymentForm['invPayDetForm_' + invItem.invoiceMstID]);
        if (isdirty) {
          isAnyInvPayDetFormDirty = true;
          return false;
        }
      });
      if (isAnyInvPayDetFormDirty) {
        showWithoutSavingAlertForPopUp();
        return false;
      } else {
        const custPayDet = {
          customerID: vm.autoCompleteCustomer.keyColumnId
        };
        retrieveAllInvoiceOfCustomerPayment(custPayDet);
        retrieveAllCreditMemoOfCustomerPayment(custPayDet);
      }
    };

    const getLatestInvPaymentDet = () => {
      if (vm.custPaymentMstID) {
        retrieveCustInvPaymentMstData();
      }
      const custPayDet = {
        customerID: vm.autoCompleteCustomer.keyColumnId
      };
      retrieveAllInvoiceOfCustomerPayment(custPayDet);
      retrieveAllCreditMemoOfCustomerPayment(custPayDet);
    };

    vm.overPaymentActionChanged = () => {
    };

    // called when under payment any option seleted
    vm.underPaymentActionChanged = () => {
      if (vm.custPaymentModel.underPaymentAction === TRANSACTION.UnderPaymentActions.WriteOffTheExtraAmount.Value) {
        vm.isWOFFTheExtraAmtOptionSelected = true;
        setFocusByName('writeOffReason');
      } else {
        vm.refreshCustomerInvoicesPaymentDet();
        vm.isWOFFTheExtraAmtOptionSelected = false;
      }
    };

    // to refresh customer invoices payment details
    vm.refreshCustomerInvoicesPaymentDet = () => {
      const custPayDet = {
        customerID: vm.autoCompleteCustomer.keyColumnId
      };
      retrieveAllInvoiceOfCustomerPayment(custPayDet);
      retrieveAllCreditMemoOfCustomerPayment(custPayDet);
    };

    /* alert pop up added here for lose updated changes */
    const showWithoutSavingAlertForPopUp = () => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_RESET_DEFINED_DET_MSG);
      messageContent.message = stringFormat(messageContent.message, 'payment details');
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((resp) => {
        if (resp) {
          getLatestInvPaymentDet();
          vm.customerPaymentForm.$setPristine();
        }
      }, () => {
        // cancel block
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // to refresh and get customer account reference
    vm.refreshCustAccountReference = () => {
      const getCustPromises = [getCustomerList()];
      vm.cgBusyLoading = $q.all(getCustPromises).then(() => {
        const custDet = _.find(vm.customerList, (custItem) =>
          custItem.id === vm.autoCompleteCustomer.keyColumnId
        );
        if (custDet) {
          vm.custPaymentModel.accountReference = custDet.accountRef || null;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* Void Payment & Release Invoice Group */
    vm.voidPaymentAndReleaseInvoiceGroup = (event) => {
      if (!vm.allowToVoidAndReIssuePaymentFeature || vm.custPaymentModel.isPaymentVoided) {
        return;
      }

      if (vm.custPaymentModel.lockStatus === vm.CustPaymentLockStatusConst.Locked) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_PAY_LOCKED_WITH_NO_ACCESS);
        messageContent.message = stringFormat(messageContent.message, vm.custPaymentModel.paymentNumber);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
        return;
      }

      //// take confirmation as locked payment
      //if (vm.custPaymentModel.lockStatus === vm.CustPaymentLockStatusConst.Locked) {
      //  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CHANGE_IN_LOCKED_CUST_PAYMENT_CONFM);
      //  messageContent.message = stringFormat(messageContent.message, vm.custPaymentModel.paymentNumber);
      //  const obj = {
      //    messageContent: messageContent,
      //    btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
      //    canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      //  };
      //  return DialogFactory.messageConfirmDialog(obj).then((resp) => {
      //    if (resp) {
      //      voidPaymentAndReleaseInvoiceGroupDet(event);
      //    }
      //  }, () => {
      //    // cancel block
      //  }).catch((error) => {
      //    BaseService.getErrorLog(error);
      //  });
      //} else {
      voidPaymentAndReleaseInvoiceGroupDet(event);
      //}
    };

    const voidPaymentAndReleaseInvoiceGroupDet = (event) => {
      const selectedCustDet = _.find(vm.customerList, (custItem) => custItem.id === vm.autoCompleteCustomer.keyColumnId);
      const headerData = [{
        label: vm.LabelConstant.MFG.Customer,
        value: selectedCustDet ? selectedCustDet.mfgFullName : null,
        displayOrder: 1,
        labelLinkFn: () => {
          BaseService.goToCustomerList();
        },
        valueLinkFn: () => {
          BaseService.goToCustomer(selectedCustDet ? selectedCustDet.id : null);
        }
      },
      {
        label: 'Payment# or Check#',
        value: vm.custPaymentModel.paymentNumber,
        displayOrder: 1,
        labelLinkFn: () => {
          BaseService.goToCustomerPaymentList();
        },
        valueLinkFn: () => {
          BaseService.goToCustomerPaymentDetail(vm.custPaymentMstID);
        }
      }
      ];

      const invoicePaymentChange = {
        AccessRole: CORE.ROLE_ACCESS.VERIFICATION_ROLE_ACCESS,
        isAllowSaveDirect: false,
        popupTitle: 'Void Payment & Release Invoice Group',
        confirmationType: CORE.Generic_Confirmation_Type.CUSTOMER_PAYMENT_VOID,
        isOnlyPassword: true,
        createdBy: vm.loginUser.userid,
        updatedBy: vm.loginUser.userid,
        headerDisplayData: headerData,
        isShowHeaderData: true
      };
      return DialogFactory.dialogService(
        CORE.GENERIC_CONFIRMATION_MODAL_CONTROLLER,
        CORE.GENERIC_CONFIRMATION_MODAL_VIEW,
        event,
        invoicePaymentChange).then((pswConfirmation) => {
          if (pswConfirmation) {
            const objData = {
              id: vm.custPaymentModel.id,
              voidPaymentReason: pswConfirmation.approvalReason,
              refPaymentModeOfInvPayment: CORE.RefPaymentModeForInvoicePayment.Receivable
            };
            vm.cgBusyLoading = PackingSlipFactory.voidSupplierInvoicePayment().query(objData).$promise.then((response) => {
              if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                if (vm.custPaymentMstID) {
                  retrieveCustInvPaymentMstData();
                }
                if (vm.customerPaymentForm) {
                  vm.customerPaymentForm.$setPristine();
                }
              } else if (response && response.status === CORE.ApiResponseTypeStatus.FAILED && response.errors && response.errors.data && response.errors.data.isPaymentAlreadyVoided) {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_PAYMENT_ALREADY_VOIDED);
                messageContent.message = stringFormat(messageContent.message, vm.custPaymentModel.paymentNumber, 'customer payment', 'payment# or check#');
                const model = {
                  messageContent: messageContent
                };
                DialogFactory.messageAlertDialog(model).then(() => {
                  if (vm.customerPaymentForm) {
                    vm.customerPaymentForm.$setPristine();
                  }
                  retrieveCustInvPaymentMstData();
                }).catch((error) => BaseService.getErrorLog(error));
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
    };

    /* Void current payment and reissue new payment */
    vm.voidAndReIssuePayment = (event) => {
      if (!vm.allowToVoidAndReIssuePaymentFeature || vm.custPaymentModel.isPaymentVoided) {
        return;
      }

      if (vm.custPaymentModel.lockStatus === vm.CustPaymentLockStatusConst.Locked) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_PAY_LOCKED_WITH_NO_ACCESS);
        messageContent.message = stringFormat(messageContent.message, vm.custPaymentModel.paymentNumber);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
        return;
      }

      //// take confirmation as locked payment
      //if (vm.custPaymentModel.lockStatus === vm.CustPaymentLockStatusConst.Locked) {
      //  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CHANGE_IN_LOCKED_CUST_PAYMENT_CONFM);
      //  messageContent.message = stringFormat(messageContent.message, vm.custPaymentModel.paymentNumber);
      //  const obj = {
      //    messageContent: messageContent,
      //    btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
      //    canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      //  };
      //  return DialogFactory.messageConfirmDialog(obj).then((resp) => {
      //    if (resp) {
      //      voidAndReIssuePaymentDet(event);
      //    }
      //  }, () => {
      //    // cancel block
      //  }).catch((error) => {
      //    BaseService.getErrorLog(error);
      //  });
      //} else {
      voidAndReIssuePaymentDet(event);
      //}
    };

    const voidAndReIssuePaymentDet = (event) => {
      if (vm.custPaymentModel && vm.custPaymentModel.id) {
        const selectedCustDet = _.find(vm.customerList, (custItem) => custItem.id === vm.autoCompleteCustomer.keyColumnId);

        const PopupParamData = {
          popupTitle: 'Void & Re-Receive Payment',
          custPaymentMstID: vm.custPaymentMstID,
          mfgcodeID: vm.autoCompleteCustomer.keyColumnId,
          customerFullName: selectedCustDet ? selectedCustDet.mfgFullName : null,
          paymentNumber: vm.custPaymentModel.paymentNumber,
          isReadOnlyMode: false
        };

        DialogFactory.dialogService(
          TRANSACTION.VOID_REISSUE_CUST_PAYMENT_MODAL_CONTROLLER,
          TRANSACTION.VOID_REISSUE_CUST_PAYMENT_MODAL_VIEW,
          event,
          PopupParamData).then(() => {
          }, (resp) => {
            if (resp) {
              if (vm.customerPaymentForm) {
                vm.customerPaymentForm.$setPristine();
              }
              retrieveCustInvPaymentMstData();
            }
          }, (err) => BaseService.getErrorLog(err));
      }
    };

    // to move at invoice list page with filter data
    vm.moveToInvoiceListPageWithFilter = () => {
      const searchData = {
        customerID: vm.autoCompleteCustomer.keyColumnId,
        dueDate: BaseService.getCurrentDate(),
        custInvSubStatusList: [vm.custInvoiceSubStatusListConst.INVOICED, vm.custInvoiceSubStatusListConst.CORRECTEDINVOICED]
      };
      BaseService.goToCustInvListWithTermsDueDateSearch(searchData);
    };

    // to move at refund list page with filter data
    vm.addCustomerRefundWithFilter = () => {
      BaseService.openInNew(TRANSACTION.TRANSACTION_CUSTOMER_REFUND_DETAIL_STATE, {
        id: 0,
        transModeID: CORE.GenericTransModeName.RefundPayablePayRefund.id,
        custID: vm.custPaymentModel.mfgcodeID,
        CPID: vm.custPaymentModel.id
      });
    };

    //// when payment locked and invoice total amount mismatch with main payment amount
    //const displayErorMsgForLockPayWithMisMatchInvAmt = () => {
    //  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_PAY_LOCK_STATE_INV_AMT_MISMATCH);
    //  const model = {
    //    messageContent: messageContent
    //  };
    //  DialogFactory.messageAlertDialog(model).then(() => {
    //    $scope.$parent.vm.saveBtnDisableFlag = false;
    //    const firstSelectedInvItem = _.find(vm.custInvoicePaymentList, (invItem) => invItem.isSelected);
    //    if (firstSelectedInvItem) {
    //      setFocus('paymentAmountForSelectedInvoice_' + firstSelectedInvItem.invoiceMstID);
    //    }
    //  }).catch((error) => {
    //    $scope.$parent.vm.saveBtnDisableFlag = false;
    //    BaseService.getErrorLog(error);
    //  });
    //};

    // when Agreed Refund Amount Less Than Total Issued Amout >> error as not allowed
    const displayErrorMsgForAgreedRefundLessThanTotIssued = (totRefundIssuedOfPayment) => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.AGREED_REFUND_NOT_LESS_THAN_TOT_REFUNDED_AMT);
      messageContent.message = stringFormat(messageContent.message, totRefundIssuedOfPayment, (vm.customerPaymentForm.agreedRefundAmt.$viewValue || 0));
      const model = {
        messageContent: messageContent
      };
      return DialogFactory.messageAlertDialog(model).then(() => {
        if (!vm.custPaymentModel.isMarkForRefund) {
          vm.custPaymentModel.isMarkForRefund = true;
        }
        vm.custPaymentModel.agreedRefundAmt = vm.custPaymentModel.totRefundIssuedOfPayment;
        $scope.$parent.vm.saveBtnDisableFlag = false;
        setFocusByName('agreedRefundAmt');
      }).catch((error) => {
        $scope.$parent.vm.saveBtnDisableFlag = false;
        BaseService.getErrorLog(error);
      });
    };

    // on change of Closeout Zero Values Invoices
    vm.isZeroPaymentChange = () => {
      if (vm.custPaymentModel.isZeroPayment) {
        vm.custPaymentModel.paymentAmount = 0;
        vm.custPaymentModel.bankName = null;
        vm.autoCompleteBankAccountNumber.keyColumnId = null;
        $scope.$broadcast(vm.autoCompleteBankAccountNumber.inputName + 'searchText', null);
        vm.autoCompletePaymentMethodType.keyColumnId = null;
        $scope.$broadcast(vm.autoCompletePaymentMethodType.inputName + 'searchText', null);
        vm.custPaymentModel.paymentNumber = null;
        vm.custPaymentModel.paymentDate = vm.custPaymentModel.paymentDate ? vm.custPaymentModel.paymentDate : BaseService.getUIFormatedDateTimeInCompanyTimeZone(new Date(), vm.DefaultDateFormat);

        _.each(vm.custInvoicePaymentList, (invItem) => {
          if (!invItem.isLocked) {  // if locked then not allowed to change
            invItem.paymentAmountForSelectedInvoice = 0;
            invItem.writeOffAmtForSelectedInvoice = 0;
            invItem.isNotAllowForZeroInvPayment = (invItem.originalPayAmountOfInvoice > 0 || !invItem.isZeroValue);
            invItem.isSelected = invItem.isZeroValue && invItem.originalPayAmountOfInvoice === 0 ? true : false;
          }
        });
        //vm.isAllSelectFromCustInvoicePaymentList = false;
        const checkAnyNotSelectedInv = _.some(vm.custInvoicePaymentList, (data) => !data.isSelected);
        vm.isAllSelectFromCustInvoicePaymentList = checkAnyNotSelectedInv ? false : true;
        vm.isSelectAllInvNotAllowForZeroInvPayment = _.every(vm.custInvoicePaymentList, (data) => data.originalPayAmountOfInvoice > 0 || !data.isZeroValue);
      } else {
        _.each(vm.custInvoicePaymentList, (invItem) => {
          if (!invItem.isLocked) {  // if locked then not allowed to change
            invItem.isNotAllowForZeroInvPayment = (invItem.originalPayAmountOfInvoice === 0 && !invItem.isZeroValue) ? true : false;
            invItem.isSelected = false;
          }
        });
        vm.isSelectAllInvNotAllowForZeroInvPayment = false;
      }
      setSumOfAmountForCustInvoicePaymentList();
      setSumOfCurrPayAmountForCustInvPaymentList();
    };

    const setSelectAllConfigurationForZeroPayment = () => {
      const zeroInvPayList = _.filter(vm.custInvoicePaymentList, (invItem) => invItem.originalPayAmountOfInvoice === 0);
      if (zeroInvPayList && zeroInvPayList.length > 0) {
        const isAnyNotSelectedInvWithZeroAmt = _.some(zeroInvPayList, (data) => !data.isSelected);
        vm.isAllSelectFromCustInvoicePaymentList = isAnyNotSelectedInvWithZeroAmt ? false : true;
      } else {
        vm.isAllSelectFromCustInvoicePaymentList = false;
      }
      //const isAllInvSelectedWithZeroAmt = _.every(vm.custInvoicePaymentList, (data) => data.isSelected && data.originalPayAmountOfInvoice === 0);
      //vm.isAllSelectFromCustInvoicePaymentList = isAllInvSelectedWithZeroAmt;
      vm.isSelectAllInvNotAllowForZeroInvPayment = _.every(vm.custInvoicePaymentList, (data) => data.originalPayAmountOfInvoice > 0 || !data.isZeroValue);
    };

    /* open popup to display received/paid data */
    vm.showAppliedInvDPAmount = (invItem, refPaymentModeConst) => {
      if (invItem) {
        const selectedCust = _.find(vm.customerList, (custItem) => custItem.id === vm.autoCompleteCustomer.keyColumnId);
        const data = {
          id: invItem.invoiceMstID,
          mfgCodeID: vm.autoCompleteCustomer.keyColumnId,
          invoiceNumber: invItem.invoiceNumber,
          customerName: selectedCust ? selectedCust.mfgFullName : null,
          refPaymentMode: refPaymentModeConst,
          totalExtendedAmount: invItem.originalPayAmountOfInvoice,
          receivedAmount: invItem.invTotPaidAmtFromAllPaymentDet,
          balanceAmount: invItem.dueAmountForSelectedInvoice,
          isCustPaymentEntity: true
        };

        DialogFactory.dialogService(
          TRANSACTION.SUPPLIER_INVOICE_PAYMENT_TRANSACTION_LIST_POPUP_CONTROLLER,
          TRANSACTION.SUPPLIER_INVOICE_PAYMENT_TRANSACTION_LIST_POPUP_VIEW,
          event,
          data
        ).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
      }
    };

    vm.changeMarkForRefund = () => {
      if (!vm.custPaymentModel.isMarkForRefund) {
        vm.custPaymentModel.agreedRefundAmt = null;
        setSumOfAmountForCustInvoicePaymentList();
      }
    };

    // called on change of agreed refund amount
    vm.refundAmtChanged = () => {
      if ((vm.customerPaymentForm.agreedRefundAmt.$viewValue || 0) < (vm.custPaymentModel.totRefundIssuedOfPayment || 0)) {
        displayErrorMsgForAgreedRefundLessThanTotIssued(vm.custPaymentModel.totRefundIssuedOfPayment);
      }
    };

    /* display refunded amount popup to display all refunded transaction against current payment */
    vm.showTotRefundIssueDetAgainstPayment = () => {
      const selectedCust = _.find(vm.customerList, (custItem) => custItem.id === vm.autoCompleteCustomer.keyColumnId);
      const data =
      {
        id: vm.custPaymentMstID,
        mfgCodeID: vm.autoCompleteCustomer.keyColumnId,
        paymentCMNumber: vm.custPaymentModel.paymentNumber,
        customerName: selectedCust ? selectedCust.mfgFullName : null,
        totalPaymentAmount: vm.custPaymentModel.paymentAmount,
        totalRefundIssuedAmount: vm.custPaymentModel.totRefundIssuedOfPayment,
        agreedRefundAmount: vm.custPaymentModel.agreedRefundAmt,
        refGencTransModeID: CORE.GenericTransModeName.RefundPayablePayRefund.id,
        isDisplayAllTransWhereCreditUsed: false
      };

      DialogFactory.dialogService(
        TRANSACTION.CUSTOMER_REFUND_TRANSACTION_LIST_POPUP_CONTROLLER,
        TRANSACTION.CUSTOMER_REFUND_TRANSACTION_LIST_POPUP_VIEW,
        event,
        data
      ).then(() => {
      }, () => {
      }, (err) => BaseService.getErrorLog(err));
    };

    const checkFormDirty = (form) => {
      const checkDirty = BaseService.checkFormDirty(form);
      return checkDirty;
    };

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    //redirect to customer master
    vm.goToCustomerList = () => {
      BaseService.goToCustomerList();
    };

    /* to go at payment method list (generic category) */
    vm.goToPaymentMethodList = () => {
      BaseService.goToGenericCategoryReceivablePaymentMethodList();
    };

    /* to go at bank list page (account code/name) */
    vm.goToBankList = () => {
      BaseService.goToBankList();
    };

    /* to go at customer bill to address page */
    vm.goToCustomerBillToPage = () => {
      BaseService.goToCustomer(vm.autoCompleteCustomer.keyColumnId, false);
    };

    /* to go at customer invoice page  */
    vm.goToCustInvoiceDetail = (invoiceMstID) => {
      BaseService.goToManageCustomerInvoice(invoiceMstID);
    };

    /* to go at customer credit memo detail page  */
    vm.goToCustCreditMemoDetail = (creditMemoMstID) => {
      BaseService.goToCustomerCreditMemoDetail(creditMemoMstID);
    };

    /* to go at customer payment list page */
    vm.goToCustomerPaymentList = () => {
      BaseService.goToCustomerPaymentList();
    };

    /* to move at apply credit memo on invoice page */
    vm.applyCreditMemoToInvoice = (creditMemoMstID) => {
      if (creditMemoMstID) {
        BaseService.goToApplyCustCreditMemoToPayment(creditMemoMstID, null);
      }
    };

    /* to go at customer refund list page */
    vm.goToCustomerRefundList = () => {
      BaseService.goToCustomerRefundList();
    };

    //add new customer Refund
    vm.addCustomerRefund = () => {
      BaseService.goToCustomerRefundDetail(0);
    };

    // go to manage personnel details
    vm.goToManagePersonal = (employeeId) => {
      BaseService.goToManagePersonnel(employeeId);
    };

    //close pop up on page destroy
    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, {
        closeAll: true
      });
    });

    // Assign Current Forms to service
    angular.element(() => {
      BaseService.currentPageForms = [vm.customerPaymentForm];
      if ($scope.$parent && $scope.$parent.vm) {
        $scope.$parent.vm.customerPaymentForm = vm.customerPaymentForm;
        $scope.$parent.vm.saveCustomerPayment = vm.saveCustomerPayment;
        $scope.$parent.vm.voidPaymentAndReleaseInvoiceGroup = vm.voidPaymentAndReleaseInvoiceGroup;
        $scope.$parent.vm.voidAndReIssuePayment = vm.voidAndReIssuePayment;
        // when click on browser back button then need to set active tab otherwise tab not change
        $scope.$parent.vm.activeTab = $scope.$parent.vm.CustomerPaymentTabIDs.CustomerPayment;
      }
    });
  }
})();
