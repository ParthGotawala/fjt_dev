(function () {
  'use strict';

  angular
    .module('app.transaction.customerpayment')
    .controller('ApplyCustWriteOffToInvManageDetailController', ApplyCustWriteOffToInvManageDetailController);

  /** @ngInject */
  function ApplyCustWriteOffToInvManageDetailController($scope, $q, $stateParams, USER, CORE, BaseService, BankFactory, GenericCategoryFactory, MasterFactory, $mdDialog, CustomerPaymentFactory, TRANSACTION, $state, DialogFactory, $filter, PackingSlipFactory, TransactionModesFactory) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = CORE.LabelConstant;
    vm.loginUser = BaseService.loginUser;
    vm.custPaymentMstID = parseInt($stateParams.id);
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.emptyCustomerConst = USER.ADMIN_EMPTYSTATE.CUSTOMER;
    vm.emptyStateCustInvoiceConst = TRANSACTION.TRANSACTION_EMPTYSTATE.CUSTOMER_INVOICE;
    vm.custPayDiffNotesConst = TRANSACTION.CustomerPaymentDiffNotes;
    vm.CustPaymentLockStatusConst = TRANSACTION.CustomerPaymentLockStatus;
    vm.customerList = [];
    vm.paymentMethodTypeList = [];
    vm.gencTransactionModeList = [];
    vm.bankList = [];
    vm.isCustPaymentLocked = false;
    vm.custPaymentModel = {
      paymentDate: BaseService.getUIFormatedDateTimeInCompanyTimeZone(new Date(), vm.DefaultDateFormat)
    };
    $scope.$parent.vm.saveBtnDisableFlag = false;
    vm.customerPaymentNotesConst = TRANSACTION.CustomerPaymentNotes;
    vm.receivableRefPaymentModeConst = TRANSACTION.ReceivableRefPaymentMode;
    vm.custInvoiceSubStatusListConst = CORE.CUSTINVOICE_SUBSTATUS;

    vm.chequeDateOptions = {
      appendToBody: true,
      maxDate: null
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
    vm.debounceTimeIntervalConst = CORE.Debounce.mdDataTable;
    vm.debounceTimeIntervalConst = CORE.DEBOUNCE_TIME_INTERVAL;
    vm.invoicePaymentStatusConst = CORE.InvoicePaymentStatus;
    const CategoryTypeObjList = angular.copy(CORE.CategoryType);

    /* get all feature rights for void customer write off payment */
    const getAllFeatureRights = () => {
      vm.allowToVoidCustWriteOffAndReleaseInv = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToVoidCustWriteOffAndReleaseInv);
      if ($scope.$parent && $scope.$parent.vm) {
        $scope.$parent.vm.allowToVoidCustWriteOffAndReleaseInv = vm.allowToVoidCustWriteOffAndReleaseInv;
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

    /* Get generic payment transaction mode list */
    const getGencTransactionModes = () => {
      const transInfo = {
        modeType: CORE.GenericTransMode.RefundPayable
      };
      return TransactionModesFactory.getTransModeList().query({ transInfo: transInfo }).$promise.then((resp) => {
        vm.gencTransactionModeList = [];
        if (resp && resp.data && resp.data.customerTransModeNameList) {
          if (vm.custPaymentMstID) {
            vm.gencTransactionModeList = resp.data.customerTransModeNameList;
          }
          else {
            vm.gencTransactionModeList = _.filter(resp.data.customerTransModeNameList, (item) => item.isActive);
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
      vm.autoCompleteGencTransactionMode = {
        columnName: 'modeName',
        //controllerName: null,
        //viewTemplateURL: null,
        keyColumnName: 'id',
        keyColumnId: vm.custPaymentModel ? vm.custPaymentModel.refGencTransModeID : null,
        inputName: 'transactionMode',
        placeholderName: 'Transaction Mode',
        isRequired: true,
        isAddnew: false,
        addData: {
        },
        onSelectCallbackFn: function () {
        },
        callbackFn: getGencTransactionModes
      };
    };

    // when user select customer
    const onSelectCustCallbackFn = (selectedCust) => {
      if (selectedCust) {
        if ($scope.$parent && $scope.$parent.vm) {
          $scope.$parent.vm.selectedCustomerDet = selectedCust;
        }
        if (!vm.custPaymentMstID) {
          vm.custPaymentModel.accountReference = selectedCust.accountRef || null;
        }
        // get all invoices of customer with payment information
        const custPayDet = {
          customerID: selectedCust.id
        };
        retrieveAllInvoiceOfCustomerPayment(custPayDet);
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
      vm.isSelectAllInvNotAllowForZeroInvPayment = false;
      vm.isAllSelectFromCustInvoicePaymentList = false;
      vm.custCurrentTermsDays = null;
      vm.customerPastDueBalanceTillToday = null;
      clearSumOfAmountForCustInvoicePaymentList();
      if (!vm.custPaymentMstID) {
        $scope.$broadcast(vm.autoCompleteCustomer.inputName + 'searchText', null);
      }
    };

    // get all invoices of customer with payment information
    const retrieveAllInvoiceOfCustomerPayment = (custPayDet) => {
      if (!custPayDet || !custPayDet.customerID) {
        return;
      }
      const custPayInfo = {
        customerID: custPayDet.customerID,
        payementMstID: vm.custPaymentMstID || null,
        transTypeForInvoice: CORE.TRANSACTION_TYPE.INVOICE,
        isGetOnlyPaidInvoiceFromPayment: vm.custPaymentModel && vm.custPaymentModel.refPaymentID ? true : false,
        isExcludeZeroValueInv: true
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
              invItem.paymentAmountForSelectedInvoice = parseFloat((angular.copy(invItem.invPaidAmtFromCurrPaymentDet) || 0).toFixed(2));
              invItem.totWriteOffAmountForSelectedInvoice = parseFloat((invItem.invTotPaidAmtFromAllWriteOff || 0).toFixed(2));

              //// past payment = total paid for invoice from all pay det
              invItem.pastPaidAmountForSelectedInvoice = parseFloat((invItem.invTotPaidAmtFromAllPaymentDet || 0).toFixed(2));
              invItem.pastPaidAmtExcludeCurrTransForSelectedInv = parseFloat(((invItem.invTotPaidAmtFromAllPaymentDet || 0) - (invItem.invPaidAmtFromCurrPaymentDet || 0)).toFixed(2));

              invItem.pastPaidAmountFromCMForSelectedInv = parseFloat((invItem.invTotPaidAmtFromAllCMPayment || 0).toFixed(2));

              invItem.pastPaidAmountFromDPForSelectedInvoice = parseFloat(((invItem.pastPaidAmountForSelectedInvoice || 0) - (invItem.invTotPaidAmtFromAllCMPayment || 0) - (invItem.invTotPaidAmtFromAllWriteOff || 0)).toFixed(2));
              //}

              // due payment = original pay amount of invoice - total paid for invoice from all pay det
              invItem.dueAmountForSelectedInvoice = parseFloat(((invItem.originalPayAmountOfInvoice || 0) - (invItem.invTotPaidAmtFromAllPaymentDet || 0)).toFixed(2));
              // live due payment >> when user change inv pay amount it will be updated instantly
              invItem.liveDueAmountForSelectedInvoice = angular.copy(invItem.dueAmountForSelectedInvoice);

              invItem.isSelected = invItem.invPaymentDetMstID ? true : false;
              invItem.maxLimitOfDueAmountToPay = parseFloat((invItem.invPaymentDetMstID ? parseFloat(((invItem.dueAmountForSelectedInvoice || 0) + (invItem.invPaidAmtFromCurrPaymentDet || 0)).toFixed(2)) : (invItem.dueAmountForSelectedInvoice || 0)).toFixed(2));
              invItem.invoiceDateWithConverted = BaseService.getUIFormatedDate(invItem.invoiceDate, vm.DefaultDateFormat);
            });
            setSumOfAmountForCustInvoicePaymentList();
            setSumOfCurrPayAmountForCustInvPaymentList();
            const checkAnyNotSelectedInv = _.some(vm.custInvoicePaymentList, (data) => !data.isSelected);
            vm.isAllSelectFromCustInvoicePaymentList = checkAnyNotSelectedInv ? false : true;
          }
          vm.customerPastDueBalanceTillToday = resp.data.customerPastDueBalance;
          vm.custCurrentTermsDays = resp.data.customerCurrentTermsDays;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // to get customer invoice payment master data
    const retrieveCustInvPaymentMstData = () => CustomerPaymentFactory.getCustInvPaymentMstData().query({
      customerPaymentMstID: vm.custPaymentMstID,
      refPaymentMode: TRANSACTION.ReceivableRefPaymentMode.Writeoff.code
    }).$promise.then((resp) => {
      if (resp && resp.data && resp.status === CORE.ApiResponseTypeStatus.SUCCESS) {
        vm.custPaymentModel = resp.data.custPaymentMstData;
        if (vm.custPaymentModel.paymentDate) {
          vm.custPaymentModel.paymentDate = BaseService.getUIFormatedDate(vm.custPaymentModel.paymentDate, vm.DefaultDateFormat);
        }
        vm.isCustPaymentLocked = vm.custPaymentModel.lockStatus === vm.CustPaymentLockStatusConst.Locked ? true : false;
        if ($scope.$parent && $scope.$parent.vm && vm.custPaymentModel) {
          $scope.$parent.vm.custPaymentMstDetParent = vm.custPaymentModel;
          if ($scope.$parent.vm.custPaymentMstDetParent.lockStatus === vm.CustPaymentLockStatusConst.Locked && $scope.$parent.vm.custPaymentMstDetParent.lockedByUserName) {
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
      const promises = [getCustomerList(), getPaymentMethodType(), getBankList(), getGencTransactionModes()];
      if (vm.custPaymentMstID) {
        promises.push(retrieveCustInvPaymentMstData());
      }
      vm.cgBusyLoading = $q.all(promises).then(() => {
        initAutoComplete();
        if (!vm.custPaymentMstID) {
          setDefaultPaymentMethodType();
          setDefaultGencTransMode();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    init();

    // set write off type payment method
    const setDefaultPaymentMethodType = () => {
      const writeOffGCDet = _.find(vm.paymentMethodTypeList, (item) => item.gencCategoryCode === TRANSACTION.ReceivablePaymentMethodGenericCategory.WriteOff.gencCategoryCode);
      vm.autoCompletePaymentMethodType.keyColumnId = writeOffGCDet ? writeOffGCDet.gencCategoryID : null;
    };

    // set write off generic transaction mode
    const setDefaultGencTransMode = () => {
      const writeOffGCTransModeDet = _.find(vm.gencTransactionModeList, (item) => item.id === CORE.GenericTransModeName.RefundPayableWOFF.id);
      vm.autoCompleteGencTransactionMode.keyColumnId = writeOffGCTransModeDet ? writeOffGCTransModeDet.id : null;
    };

    // to set sum count for invoice table payment
    const setSumOfAmountForCustInvoicePaymentList = () => {
      vm.sumOfOriginalPayAmountForSelectedInvoice = parseFloat((_.sumBy(vm.custInvoicePaymentList, (o) => o.originalPayAmountOfInvoice) || 0).toFixed(2));
      vm.sumOfLiveDueAmountForSelectedInvoice = parseFloat((_.sumBy(vm.custInvoicePaymentList, (o) => o.liveDueAmountForSelectedInvoice) || 0).toFixed(2));
      vm.sumOfPaymentAmountForSelectedInvoice = parseFloat((_.sumBy(vm.custInvoicePaymentList, (o) => o.paymentAmountForSelectedInvoice) || 0).toFixed(2));

      // paymentAmount is equal to sum of seleted inv write off
      vm.custPaymentModel.paymentAmount = vm.sumOfPaymentAmountForSelectedInvoice;

      vm.diffAmtBetPayAmtAndSelectedInvAmt = parseFloat(((vm.custPaymentModel.paymentAmount || 0) - (vm.sumOfPaymentAmountForSelectedInvoice)).toFixed(2));
    };

    // sum of paying amount
    const setSumOfCurrPayAmountForCustInvPaymentList = () => {
      const selectedInvList = _.filter(vm.custInvoicePaymentList, (invItem) => invItem.isSelected);

      /* total due amount = if invoice payment added then remaining due amount + paid amount = total due
       if invoice payment not added(new payment) then direct due amount of invoice */
      vm.totDueAmountOfSelectedInv = parseFloat((_.sumBy(selectedInvList, (o) => o.invPaymentDetMstID ? (parseFloat(((o.dueAmountForSelectedInvoice || 0) + (o.invPaidAmtFromCurrPaymentDet || 0)).toFixed(2))) : (o.dueAmountForSelectedInvoice || 0)).toFixed(2))
      ) || 0;

      /* below is total paying amount of different selected invoice */
      vm.totPayAmountOfSelectedInv = parseFloat((_.sumBy(selectedInvList, (o) => o.paymentAmountForSelectedInvoice) || 0).toFixed(2));

      vm.totalInvSelectedCount = (_.countBy(vm.custInvoicePaymentList, (data) => data.isSelected).true) || 0;
    };

    // clear all sum calculation
    const clearSumOfAmountForCustInvoicePaymentList = () => {
      vm.custInvoicePaymentList = [];
      vm.sumOfOriginalPayAmountForSelectedInvoice = 0;
      vm.sumOfLiveDueAmountForSelectedInvoice = 0;
      vm.sumOfPaymentAmountForSelectedInvoice = 0;
      vm.diffAmtBetPayAmtAndSelectedInvAmt = 0;
      vm.totDueAmountOfSelectedInv = 0;
      vm.totPayAmountOfSelectedInv = 0;
    };

    // called when we select any invoice item to pay from table list
    vm.selectCustSingleInvoice = (invItem) => {
      //const totPayAmount = parseFloat((angular.copy(vm.custPaymentModel.paymentAmount) || 0).toFixed(2));
      if (invItem.isSelected) {  //totPayAmount && totPayAmount > 0 &&
        //if (parseFloat((invItem.dueAmountForSelectedInvoice + (vm.sumOfPaymentAmountForSelectedInvoice || 0)).toFixed(2)) <= totPayAmount) {
        const checkAnyNotSelectedInv = _.some(vm.custInvoicePaymentList, (data) => !data.isSelected);
        vm.isAllSelectFromCustInvoicePaymentList = checkAnyNotSelectedInv ? false : true;
        if (invItem.invPaymentDetMstID) {
          // in edit case > reset original paid amount (paid from current inv pay det)
          invItem.paymentAmountForSelectedInvoice = parseFloat(angular.copy(invItem.invPaidAmtFromCurrPaymentDet).toFixed(2));
        } else {
          // in add new inv pay det case > reset due payment amount
          invItem.paymentAmountForSelectedInvoice = parseFloat(invItem.dueAmountForSelectedInvoice.toFixed(2));
        }
        //vm.selectSingleInvWithForwardingAmt(invItem, invItem.dueAmountForSelectedInvoice);
        //} else {
        //  const partialDueAmount = parseFloat((totPayAmount - (vm.sumOfPaymentAmountForSelectedInvoice || 0)).toFixed(2));
        //  vm.selectSingleInvWithForwardingAmt(invItem, partialDueAmount);
        //}
      } else {
        vm.isAllSelectFromCustInvoicePaymentList = false;
        invItem.paymentAmountForSelectedInvoice = 0;
      }
      invItem.liveDueAmountForSelectedInvoice = (parseFloat(invItem.originalPayAmountOfInvoice.toFixed(2))) - (parseFloat((invItem.pastPaidAmtExcludeCurrTransForSelectedInv || 0).toFixed(2)) + parseFloat((invItem.paymentAmountForSelectedInvoice || 0).toFixed(2)));

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
            setSumOfAmountForCustInvoicePaymentList();
            setSumOfCurrPayAmountForCustInvPaymentList();
          }
        });
        vm.isAllSelectFromCustInvoicePaymentList = true;
      }

      // apply invoice payment
      //let totPayAmount = parseFloat((angular.copy(vm.custPaymentModel.paymentAmount) || 0).toFixed(2));
      _.each(vm.custInvoicePaymentList, (data) => {
        if (!data.isLocked) {   // if locked then not allowed to change
          data.isSelected = vm.isAllSelectFromCustInvoicePaymentList;
          if (vm.isAllSelectFromCustInvoicePaymentList) { // totPayAmount && totPayAmount > 0 &&
            if (data.invPaymentDetMstID) {
              // in edit case > reset original paid amount (paid from current inv pay det)
              data.paymentAmountForSelectedInvoice = parseFloat(angular.copy(data.invPaidAmtFromCurrPaymentDet).toFixed(2));
              //totPayAmount = parseFloat((totPayAmount - data.paymentAmountForSelectedInvoice).toFixed(2));
            } else {
              //// in add new inv pay det case > reset due payment amount
              //data.paymentAmountForSelectedInvoice = parseFloat(data.dueAmountForSelectedInvoice.toFixed(2));
              //if (parseFloat((data.dueAmountForSelectedInvoice + (vm.sumOfPaymentAmountForSelectedInvoice || 0)).toFixed(2)) <= totPayAmount) {
              // in add new inv pay det case > reset due payment amount
              data.paymentAmountForSelectedInvoice = parseFloat(data.dueAmountForSelectedInvoice.toFixed(2));
              //totPayAmount = parseFloat((totPayAmount - data.dueAmountForSelectedInvoice).toFixed(2));
              //}
              //else {
              //  const partialDueAmount = parseFloat((totPayAmount - (vm.sumOfPaymentAmountForSelectedInvoice || 0)).toFixed(2));
              //  // in add new inv pay det case > reset due payment amount
              //  data.paymentAmountForSelectedInvoice = parseFloat(partialDueAmount.toFixed(2));
              //  totPayAmount = 0;
              //}
            }
          } else {
            data.paymentAmountForSelectedInvoice = 0;
          }
          data.liveDueAmountForSelectedInvoice = (parseFloat(data.originalPayAmountOfInvoice.toFixed(2))) - (parseFloat((data.pastPaidAmtExcludeCurrTransForSelectedInv || 0).toFixed(2)) + parseFloat((data.paymentAmountForSelectedInvoice || 0).toFixed(2)));
        }
      });
      setSumOfAmountForCustInvoicePaymentList();
      setSumOfCurrPayAmountForCustInvPaymentList();
    };

    /* called on change of current payment amount change from invoice write off payment list */
    vm.paymentAmountChangeForSelectedInvoice = (invItem) => {
      if ((invItem.paymentAmountForSelectedInvoice === null) || (invItem.paymentAmountForSelectedInvoice === undefined)) {
        if (vm.custPaymentWriteOffForm['invPayDetForm_' + invItem.invoiceMstID]['paymentAmountForSelectedInvoice_' + invItem.invoiceMstID] && vm.custPaymentWriteOffForm['invPayDetForm_' + invItem.invoiceMstID]['paymentAmountForSelectedInvoice_' + invItem.invoiceMstID].$viewValue && vm.custPaymentWriteOffForm['invPayDetForm_' + invItem.invoiceMstID]['paymentAmountForSelectedInvoice_' + invItem.invoiceMstID].$viewValue > 0 && vm.custPaymentWriteOffForm['invPayDetForm_' + invItem.invoiceMstID]['paymentAmountForSelectedInvoice_' + invItem.invoiceMstID].$viewValue > invItem.maxLimitOfDueAmountToPay) {
          invItem.paymentAmountForSelectedInvoice = 0;
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_INV_PAY_ITEM_MAX_ALLOWED_AMT);
          messageContent.message = stringFormat(messageContent.message, 'Write Off', vm.custPaymentWriteOffForm['invPayDetForm_' + invItem.invoiceMstID]['paymentAmountForSelectedInvoice_' + invItem.invoiceMstID].$viewValue, invItem.maxLimitOfDueAmountToPay);
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
      invItem.liveDueAmountForSelectedInvoice = (parseFloat(invItem.originalPayAmountOfInvoice.toFixed(2))) - (parseFloat((invItem.pastPaidAmtExcludeCurrTransForSelectedInv || 0).toFixed(2)) + parseFloat((invItem.paymentAmountForSelectedInvoice || 0).toFixed(2)));
      setSumOfAmountForCustInvoicePaymentList();
      setSumOfCurrPayAmountForCustInvPaymentList();
    };

    // create/update customer write off payment details
    vm.saveCustomerPayment = () => {
      vm.addUpdatePaymentSuccessMsg = null;
      if (vm.custPaymentModel.isPaymentVoided || vm.isCustPaymentLocked) {
        /* when payment is already voided or when customer payment locked then not allowed to access */
        return;
      }

      $scope.$parent.vm.saveBtnDisableFlag = true;
      if (BaseService.focusRequiredField(vm.custPaymentWriteOffForm)) {
        $scope.$parent.vm.saveBtnDisableFlag = false;
        return;
      }

      // check/get invalid main payment amount
      if ((vm.custPaymentModel.paymentAmount === null) || (vm.custPaymentModel.paymentAmount === undefined) || (vm.custPaymentModel.paymentAmount === '') || ((vm.custPaymentModel.paymentAmount || 0) <= 0)) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.PLEASE_ENTER_VALID_FIELD_VALUE);
        messageContent.message = stringFormat(messageContent.message, 'Write Off amount');
        const model = {
          messageContent: messageContent
        };
        return DialogFactory.messageAlertDialog(model).then(() => {
          $scope.$parent.vm.saveBtnDisableFlag = false;
        }).catch((error) => {
          $scope.$parent.vm.saveBtnDisableFlag = false;
          BaseService.getErrorLog(error);
        });
      }

      // if selected invoices amount is more than main payment amount than display error
      if ((vm.custPaymentModel.paymentAmount || 0) < (vm.sumOfPaymentAmountForSelectedInvoice || 0)) {
        const msgContForPayAmtNotMore = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.INV_AMT_NOT_MORE_THAN_ACTUAL_PAY_AMT);
        msgContForPayAmtNotMore.message = stringFormat(msgContForPayAmtNotMore.message, 'Total Write Off');
        const model = {
          messageContent: msgContForPayAmtNotMore
        };
        return DialogFactory.messageAlertDialog(model).then(() => {
          $scope.$parent.vm.saveBtnDisableFlag = false;
        }).catch((error) => {
          $scope.$parent.vm.saveBtnDisableFlag = false;
          BaseService.getErrorLog(error);
        });
      }

      //  at least one invoice must be selected(added)
      const isAnyInvPaySelected = _.some(vm.custInvoicePaymentList, (invItem) => invItem.isSelected && invItem.originalPayAmountOfInvoice > 0 && invItem.originalPayAmountOfInvoice > 0);
      if (!isAnyInvPaySelected) {
        const msgContentForSelectOneInv = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        msgContentForSelectOneInv.message = stringFormat(msgContentForSelectOneInv.message, 'invoice for write off');
        const model = {
          messageContent: msgContentForSelectOneInv
        };
        return DialogFactory.messageAlertDialog(model).then(() => {
          $scope.$parent.vm.saveBtnDisableFlag = false;
          setFocus('isSelected_' + vm.custInvoicePaymentList[0].invoiceMstID);
          return;
        }).catch((error) => {
          $scope.$parent.vm.saveBtnDisableFlag = false;
          BaseService.getErrorLog(error);
        });
      }

      // invoice payment amount not matched with main payment amount then show error like mismatch amount
      if ((vm.custPaymentModel.paymentAmount || 0) !== (vm.sumOfPaymentAmountForSelectedInvoice || 0)) {
        return;
      }

      // get all invalid invoice write off payment list
      const invalidPaymentList = _.filter(vm.custInvoicePaymentList, (invItem) => (invItem.paymentAmountForSelectedInvoice === null) || (invItem.paymentAmountForSelectedInvoice === undefined) || (invItem.paymentAmountForSelectedInvoice === '') || (invItem.paymentAmountForSelectedInvoice > invItem.maxLimitOfDueAmountToPay)
      );
      if (invalidPaymentList && invalidPaymentList.length > 0) {
        $scope.$parent.vm.saveBtnDisableFlag = false;
        return;
      }

      // take confirmation for write off transaction
      const totWriteOffAmt = parseFloat(vm.sumOfPaymentAmountForSelectedInvoice.toFixed(2));
      const msgContentForWriteOffAmt = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.WRITE_OFF_CUST_TRANSACTION_CONFIRMATION);
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
    };

    // set customer write off payment object to create/update
    const setCustomerPaymentObjToSave = () => {
      const custPaymentObj = {
        customerPaymentMstID: vm.custPaymentMstID,
        mfgcodeID: vm.autoCompleteCustomer.keyColumnId,
        paymentNumber: vm.custPaymentModel.paymentNumber || null,  // auto generate
        paymentDate: BaseService.getAPIFormatedDate(vm.custPaymentModel.paymentDate),
        paymentAmount: parseFloat(vm.custPaymentModel.paymentAmount.toFixed(2)),
        paymentType: vm.autoCompletePaymentMethodType.keyColumnId,
        accountReference: vm.custPaymentModel.accountReference,
        bankAccountMasID: null,
        bankAccountNo: null,
        bankName: null,
        remark: vm.custPaymentModel.remark,
        isZeroPayment: false,
        depositBatchNumber: null,
        refGencTransModeID: vm.autoCompleteGencTransactionMode.keyColumnId,
        refPaymentMode: TRANSACTION.ReceivableRefPaymentMode.Writeoff.code,
        isConfmTakenForDuplicateCheckNo: false,
        isMarkForRefund: false,
        agreedRefundAmt: null,
        custInvoicePaymentDetList: [],
        deleteCustInvPaymentDetList: [],
        isWriteOffExtraAmount: true,
        paymentTypeForWriteOffCustPayment: vm.autoCompletePaymentMethodType.keyColumnId,
        paymentAmountForWriteOffCustPayment: parseFloat(vm.sumOfPaymentAmountForSelectedInvoice.toFixed(2)),
        writeOffCustInvoicePaymentDetList: [],
        writeOffReason: vm.custPaymentModel.remark
      };

      // set Write Off type payment details
      if (custPaymentObj.isWriteOffExtraAmount) {
        const custInvoicePayListForWriteOff = _.filter(vm.custInvoicePaymentList, (invItem) => invItem.isSelected && invItem.paymentAmountForSelectedInvoice > 0);
        _.each(custInvoicePayListForWriteOff, (invItem) => {
          const _obj = {
            invoiceMstID: invItem.invoiceMstID,
            dueAmountForSelectedInvoice: parseFloat(invItem.paymentAmountForSelectedInvoice.toFixed(2))
          };
          custPaymentObj.writeOffCustInvoicePaymentDetList.push(_obj);
        });
      }

      const custInvoicePayListOfCurrApplyPay = _.filter(vm.custInvoicePaymentList, (invItem) => invItem.isSelected
        && ((invItem.paymentAmountForSelectedInvoice > 0) || (invItem.paymentAmountForSelectedInvoice === 0 && invItem.originalPayAmountOfInvoice === 0)));
      // loop over all selected to write off pay invoice
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
      manageCustomerPayment(custPaymentObj);
    };

    // create/update customer write off payment call
    const manageCustomerPayment = (custPaymentObj) => {
      // call update customer write off payment and invoice detail list
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
            vm.addUpdatePaymentSuccessMsg = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_INV_PAY_WRITE_OFF_APPLIED_SUCCESS.message;
            retrieveCustInvPaymentMstData();
            const custPayDet = {
              customerID: vm.autoCompleteCustomer.keyColumnId
            };
            retrieveAllInvoiceOfCustomerPayment(custPayDet);
            setDetailsForMainParentForm();
            vm.custPaymentWriteOffForm.$setPristine();
          } else if (resp && resp.status === CORE.ApiResponseTypeStatus.FAILED && resp.errors && resp.errors.data) {
            if ((resp.errors.data.mismatchInvPaymentDetList && resp.errors.data.mismatchInvPaymentDetList.length > 0) ||
              (resp.errors.data.deletedInvPaymentDetList && resp.errors.data.deletedInvPaymentDetList.length > 0)) {
              // customer write off payment details changed externally/ found any deleted pay details and trying save same
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
            }
            //else if (resp.errors.data.isInvTotPayDiffWithMainPayAndLockedStatus) {
            //  // when payment locked and invoice total amount mismatch with main payment amount
            //  displayErorMsgForLockPayWithMisMatchInvAmt();
            //  return;
            //}
          }
        }).catch((error) => {
          $scope.$parent.vm.saveBtnDisableFlag = false;
          BaseService.getErrorLog(error);
        });
      } else {   // call create customer write off payment and invoice detail list
        vm.cgBusyLoading = CustomerPaymentFactory.createCustomerPayment().query({ custPayObj: custPaymentObj }).$promise.then((resp) => {
          $scope.$parent.vm.saveBtnDisableFlag = false;
          if (resp && resp.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            vm.addUpdatePaymentSuccessMsg = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_INV_PAY_WRITE_OFF_APPLIED_SUCCESS.message;
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
            vm.custPaymentWriteOffForm.$setPristine();
            $state.transitionTo($state.$current, { id: resp.data.insertedInvPaymentMstID }, { location: true, inherit: true, notify: false });
          } else if (resp && resp.status === CORE.ApiResponseTypeStatus.FAILED && resp.errors && resp.errors.data) {
            if (resp.errors.data.mismatchInvPaymentDetList && resp.errors.data.mismatchInvPaymentDetList.length > 0) {
              // customer write off payment details changed externally
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

    //// called when we select any invoice item to pay from table list
    //vm.selectSingleInvWithForwardingAmt = (invItem, appliedAmt) => {
    //  if (invItem.isSelected) {
    //    const checkAnyNotSelectedInv = _.some(vm.custInvoicePaymentList, (data) => !data.isSelected);
    //    vm.isAllSelectFromCustInvoicePaymentList = checkAnyNotSelectedInv ? false : true;
    //    if (invItem.invPaymentDetMstID) {
    //      // in edit case > reset original paid amount (paid from current inv pay det)
    //      invItem.paymentAmountForSelectedInvoice = parseFloat(angular.copy(invItem.invPaidAmtFromCurrPaymentDet).toFixed(2));
    //    } else {
    //      // in add new inv pay det case > reset due payment amount
    //      invItem.paymentAmountForSelectedInvoice = parseFloat(appliedAmt.toFixed(2));
    //    }
    //  } else {
    //    vm.isAllSelectFromCustInvoicePaymentList = false;
    //    invItem.paymentAmountForSelectedInvoice = 0;
    //  }
    //  invItem.liveDueAmountForSelectedInvoice = (parseFloat(invItem.originalPayAmountOfInvoice.toFixed(2))) - (parseFloat((invItem.pastPaidAmtExcludeCurrTransForSelectedInv || 0).toFixed(2)) + parseFloat((invItem.paymentAmountForSelectedInvoice || 0).toFixed(2)));
    //  setSumOfAmountForCustInvoicePaymentList();
    //  setSumOfCurrPayAmountForCustInvPaymentList();
    //};

    // to reset payment details in add mode
    vm.resetPaymentDet = () => {
      if (vm.autoCompleteCustomer.keyColumnId !== null) {
        vm.autoCompleteCustomer.keyColumnId = null;
      } else {
        resetAllPaymentDetails();
      }
    };

    // to refresh customer write off payment details
    vm.refreshPaymentDet = () => {
      let isAnyInvPayDetFormDirty = false;
      _.each(vm.custInvoicePaymentList, (invItem) => {
        const isdirty = checkFormDirty(vm.custPaymentWriteOffForm['invPayDetForm_' + invItem.invoiceMstID]);
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
    };

    vm.overPaymentActionChanged = () => {
    };

    vm.underPaymentActionChanged = () => {
    };

    // to refresh customer invoices payment details
    vm.refreshCustomerInvoicesPaymentDet = () => {
      const custPayDet = {
        customerID: vm.autoCompleteCustomer.keyColumnId
      };
      retrieveAllInvoiceOfCustomerPayment(custPayDet);
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
          vm.custPaymentWriteOffForm.$setPristine();
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

    /* Void Write Off Payment & Release Invoice Group */
    vm.voidWriteOffPaymentAndReleaseInvGroup = (event) => {
      if (!vm.allowToVoidCustWriteOffAndReleaseInv || vm.custPaymentModel.isPaymentVoided) {
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

      voidPaymentAndReleaseInvoiceGroupDet(event);
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
        label: 'Write Off#',
        value: vm.custPaymentModel.paymentNumber,
        displayOrder: 1,
        labelLinkFn: () => {
          BaseService.goToAppliedCustWriteOffToInvList();
        },
        valueLinkFn: () => {
          BaseService.goToApplyCustWriteOffToPayment(vm.custPaymentMstID);
        }
      }
      ];

      const invoicePaymentChange = {
        AccessRole: CORE.ROLE_ACCESS.VERIFICATION_ROLE_ACCESS,
        isAllowSaveDirect: false,
        popupTitle: 'Void Write Off & Release Invoice Group',
        confirmationType: CORE.Generic_Confirmation_Type.APPLIED_CUST_WRITE_OFF_VOID,
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
              refPaymentModeOfInvPayment: TRANSACTION.ReceivableRefPaymentMode.Writeoff.code
            };
            vm.cgBusyLoading = PackingSlipFactory.voidSupplierInvoicePayment().query(objData).$promise.then((response) => {
              if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                if (vm.custPaymentMstID) {
                  retrieveCustInvPaymentMstData();
                }
                if (vm.custPaymentWriteOffForm) {
                  vm.custPaymentWriteOffForm.$setPristine();
                }
              } else if (response && response.status === CORE.ApiResponseTypeStatus.FAILED && response.errors && response.errors.data && response.errors.data.isPaymentAlreadyVoided) {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_PAYMENT_ALREADY_VOIDED);
                messageContent.message = stringFormat(messageContent.message, vm.custPaymentModel.paymentNumber, 'applied write off', 'write off#');
                const model = {
                  messageContent: messageContent
                };
                DialogFactory.messageAlertDialog(model).then(() => {
                  if (vm.custPaymentWriteOffForm) {
                    vm.custPaymentWriteOffForm.$setPristine();
                  }
                  retrieveCustInvPaymentMstData();
                }).catch((error) => BaseService.getErrorLog(error));
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
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

    /* to go at customer bill to address page */
    vm.goToCustomerBillToPage = () => {
      BaseService.goToCustomer(vm.autoCompleteCustomer.keyColumnId, false);
    };

    /* to go at customer invoice page  */
    vm.goToCustInvoiceDetail = (invoiceMstID) => {
      BaseService.goToManageCustomerInvoice(invoiceMstID);
    };

    /* to go at customer write off payment list page */
    vm.goToCustWriteOffPaymentList = () => {
      BaseService.goToAppliedCustWriteOffToInvList();
    };

    /* to move at apply credit memo on invoice page */
    vm.applyCreditMemoToInvoice = (creditMemoMstID) => {
      if (creditMemoMstID) {
        BaseService.goToApplyCustCreditMemoToPayment(creditMemoMstID, null);
      }
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
      BaseService.currentPageForms = [vm.custPaymentWriteOffForm];
      if ($scope.$parent && $scope.$parent.vm) {
        $scope.$parent.vm.custPaymentWriteOffForm = vm.custPaymentWriteOffForm;
        $scope.$parent.vm.saveCustomerPayment = vm.saveCustomerPayment;
        $scope.$parent.vm.voidWriteOffPaymentAndReleaseInvGroup = vm.voidWriteOffPaymentAndReleaseInvGroup;
        // when click on browser back button then need to set active tab otherwise tab not change
        $scope.$parent.vm.activeTab = $scope.$parent.vm.applyCustWriteOffManageTabIDsConst.Detail;
      }
    });
  }
})();
