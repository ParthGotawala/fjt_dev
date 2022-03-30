(function () {
  'use strict';

  angular
    .module('app.transaction.applycustomercreditmemo')
    .controller('ApplyCustCreditMemoToInvManageDetailController', ApplyCustCreditMemoToInvManageDetailController);

  /** @ngInject */
  function ApplyCustCreditMemoToInvManageDetailController($scope, $q, USER, CORE, BaseService, GenericCategoryFactory, MasterFactory, $mdDialog, CustomerPaymentFactory, TRANSACTION, $state, DialogFactory, CustomerPackingSlipFactory, PackingSlipFactory) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = CORE.LabelConstant;
    vm.loginUser = BaseService.loginUser;
    vm.custCreditMemoMstID = isNaN(parseInt($state.params.ccmid)) ? null : parseInt($state.params.ccmid);
    vm.custPaymentMstID = isNaN(parseInt($state.params.pid)) ? null : parseInt($state.params.pid);
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.emptyCustomerConst = USER.ADMIN_EMPTYSTATE.CUSTOMER;
    vm.emptyStateCustInvoiceConst = TRANSACTION.TRANSACTION_EMPTYSTATE.CUSTOMER_INVOICE;
    vm.emptyStateCustCreditMemoConst = TRANSACTION.TRANSACTION_EMPTYSTATE.CUSTOMER_CREDIT_MEMO;
    vm.custPayDiffNotesConst = TRANSACTION.CustomerPaymentDiffNotes;
    vm.customerList = [];
    vm.custCreditMemoList = [];
    vm.paymentMethodTypeList = [];
    vm.custPaymentModel = {};
    $scope.$parent.vm.saveBtnDisableFlag = false;
    vm.customerAllowPaymentDays = angular.copy(_customerAllowPaymentDays);
    vm.customerPaymentNotesConst = TRANSACTION.CustomerPaymentNotes;
    vm.receivableRefPaymentModeConst = TRANSACTION.ReceivableRefPaymentMode;
    vm.custInvoiceSubStatusListConst = CORE.CUSTINVOICE_SUBSTATUS;
    vm.CustPaymentLockStatusConst = TRANSACTION.CustomerPaymentLockStatus;
    vm.isCustPaymentLocked = false;

    vm.appliedDateOptions = {
      appendToBody: true,
      minDate: null
    };

    vm.DATE_PICKER = CORE.DATE_PICKER;
    vm.IsPickerOpenForAppliedDate = {
      [vm.DATE_PICKER.appliedDate]: false
    };
    vm.query = {
      order: ''
    };
    vm.invPaySearch = {};
    vm.debounceTimeIntervalConst = CORE.Debounce.mdDataTable;
    vm.debounceTimeIntervalConst = CORE.DEBOUNCE_TIME_INTERVAL;
    vm.invoicePaymentStatusConst = CORE.InvoicePaymentStatus;
    const CategoryTypeObjList = angular.copy(CORE.CategoryType);

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
    };

    const initAutoCompleteForCustCreditMemo = () => {
      vm.autoCompleteCustCreditMemo = {
        columnName: 'creditMemoNumber',
        //controllerName: '',
        //viewTemplateURL: '',
        keyColumnName: 'id',
        keyColumnId: vm.custPaymentModel ? vm.custPaymentModel.refCustCreditMemoID : null,
        inputName: 'CustomerCreditMemo',
        placeholderName: 'Customer Credit Memo',
        isRequired: true,
        isAddnew: true,
        isAddFromRoute: true,
        routeName: TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_DETAIL_STATE,
        addData: {
          routeParams: {
            id: 0
          }
        },
        callbackFn: function () {
          const custPayDet = {
            customerID: vm.autoCompleteCustomer.keyColumnId
          };
          return retrieveAllCreditMemoOfCustomer(custPayDet);
        },
        onSelectCallbackFn: onSelectCustCreditMemoCallbackFn
      };
    };

    // when user select customer
    const onSelectCustCallbackFn = (selectedCust) => {
      if (selectedCust) {
        vm.custCurrentTermsDays = selectedCust.paymentTermsDays;
        if ($scope.$parent && $scope.$parent.vm) {
          $scope.$parent.vm.selectedCustomerDet = selectedCust;
        }
        if (!vm.custCreditMemoMstID) {
          vm.custPaymentModel.accountReference = selectedCust.accountRef || null;
          // get all customer credit memo list
          const custPayDet = {
            customerID: selectedCust.id
          };
          retrieveAllCreditMemoOfCustomer(custPayDet);
        } else {
          if (!vm.custPaymentMstID) {
            vm.custPaymentModel.accountReference = selectedCust.accountRef || null;
          }
        }
      }
      else {
        resetAllPaymentDetails();
      }
    };

    // when user select credit memo from auto complete
    const onSelectCustCreditMemoCallbackFn = (selectedCreditMemo) => {
      if (selectedCreditMemo) {
        if (!vm.custCreditMemoMstID) {
          const custCreditMemoDet = {
            custCreditMemoMstID: selectedCreditMemo.id
          };
          retrieveCustCreditMemoPaymentDet(custCreditMemoDet);
        }
        $state.transitionTo($state.$current, { ccmid: selectedCreditMemo.id }, { location: true, inherit: true, notify: false });
      }
      else {
        vm.custCreditMemoMstID = null;
        $state.transitionTo($state.$current, { ccmid: 0 }, { location: true, inherit: true, notify: false });
        resetCustCreditMemoDetails();
        setDetailsForMainParentForm();
      }
    };

    // reset payment details
    const resetAllPaymentDetails = () => {
      vm.custCreditMemoMstID = null;
      vm.custPaymentMstID = null;
      if ($scope.$parent && $scope.$parent.vm) {
        $scope.$parent.vm.selectedCustomerDet = null;
      }
      vm.custPaymentModel = {};
      vm.isAllSelectFromCustInvoicePaymentList = false;
      vm.custCurrentTermsDays = null;
      vm.customerPastDueBalanceTillToday = null;
      clearSumOfAmountForCustInvoicePaymentList();
      // when new payment entry then clear all fill up details which set from customer
      if (vm.autoCompleteCustCreditMemo.keyColumnId) {
        vm.autoCompleteCustCreditMemo.keyColumnId = null;
      }
      $scope.$broadcast(vm.autoCompleteCustCreditMemo.inputName + 'searchText', null);
      $scope.$broadcast(vm.autoCompleteCustomer.inputName + 'searchText', null);
    };

    // reset payment details
    const resetCustCreditMemoDetails = () => {
      vm.custPaymentModel.refCustCreditMemoID = null;
      vm.custPaymentModel.paymentAmount = null;
      vm.custPaymentModel.paymentNumber = null;
      vm.custPaymentModel.creditMemoNumber = null;
      vm.custPaymentModel.creditMemoDate = null;
      vm.custPaymentModel.creditMemoAmount = null;
      vm.custPaymentModel.creditMemoPositiveAmt = null;
      vm.custPaymentModel.creditMemoAgreedRefundAmt = null;
      vm.custPaymentModel.leftOverCMAmtToBeRefunded = null;
      vm.custPaymentModel.sumOfAppliedCMRefundedAmt = null;
      vm.custPaymentModel.remainingCMAmtInclAmtToBeRefunded = null;
      vm.isAllSelectFromCustInvoicePaymentList = false;
      clearSumOfAmountForCustInvoicePaymentList();
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
        isGetOnlyPaidInvoiceFromPayment: false,
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
              invItem.appliedDate = BaseService.getUIFormatedDate(invItem.appliedDate, vm.DefaultDateFormat);
              invItem.paymentAmountForSelectedInvoice = parseFloat((angular.copy(invItem.invPaidAmtFromCurrPaymentDet) || 0).toFixed(2));
              invItem.totWriteOffAmountForSelectedInvoice = parseFloat((invItem.invTotPaidAmtFromAllWriteOff || 0).toFixed(2));

              // past payment = total paid for invoice from all pay det
              invItem.pastPaidAmountForSelectedInvoice = parseFloat((invItem.invTotPaidAmtFromAllPaymentDet || 0).toFixed(2));
              invItem.pastPaidAmtExcludeCurrTransForSelectedInv = parseFloat(((invItem.invTotPaidAmtFromAllPaymentDet || 0) - (invItem.invPaidAmtFromCurrPaymentDet || 0)).toFixed(2));

              invItem.pastPaidAmountFromCMForSelectedInv = parseFloat((invItem.invTotPaidAmtFromAllCMPayment || 0).toFixed(2));

              invItem.pastPaidAmountFromDPForSelectedInvoice = parseFloat(((invItem.invTotPaidAmtFromAllPaymentDet || 0) - (invItem.invTotPaidAmtFromAllCMPayment || 0) - (invItem.invTotPaidAmtFromAllWriteOff || 0)).toFixed(2));

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
          //vm.custCurrentTermsDays = resp.data.customerCurrentTermsDays;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //get feature rights for void
    const getAllFeatureRights = () => {
      vm.allowToVoidCMFeature = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToVoidAndReleaseCustCM);
      if ((vm.allowToVoidCMFeature === null || vm.allowToVoidCMFeature === undefined) && (vm.reTryCount < _configGetFeaturesRetryCount)) {
        getAllFeatureRights(); // put for hard reload option as it will not get data from feature rights
        vm.reTryCount++;
      }
      if ($scope.$parent && $scope.$parent.vm) {
        $scope.$parent.vm.allowToVoidCMFeature = vm.allowToVoidCMFeature;
      }
    };
    getAllFeatureRights();

    //void applied credit memo
    vm.voidAndReleaseInvoiceGroup = (event) => {
      if (!vm.allowToVoidCMFeature || vm.custPaymentModel.isPaymentVoided) {
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

      voidAndReleaseInvoiceGroupDet(event);
    };

    const voidAndReleaseInvoiceGroupDet = (event) => {
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
        label: 'Transaction#',
        value: vm.custPaymentModel.paymentNumber,
        displayOrder: 1,
        labelLinkFn: () => {
          BaseService.vm.goToAppliedCreditMemoList();
        },
        valueLinkFn: () => {
          BaseService.goToApplyCustCreditMemoToPayment(vm.custCreditMemoMstID, vm.custPaymentMstID);
        }
      }
      ];

      const invoicePaymentChange = {
        AccessRole: CORE.ROLE_ACCESS.VERIFICATION_ROLE_ACCESS,
        isAllowSaveDirect: false,
        popupTitle: 'Void Applied CM & Release Invoice Group',
        confirmationType: CORE.Generic_Confirmation_Type.APPLIED_CUST_CREDIT_MEMO_VOID,
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
              refPaymentModeOfInvPayment: TRANSACTION.ReceivableRefPaymentMode.CreditMemoApplied.code
            };
            vm.cgBusyLoading = PackingSlipFactory.voidSupplierInvoicePayment().query(objData).$promise.then((response) => {
              if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                if (vm.custPaymentMstID) {
                  retrieveCustCreditMemoPaymentDet(vm.custPaymentModel);
                }
                if (vm.custInvPayFromCreditMemoForm) {
                  vm.custInvPayFromCreditMemoForm.$setPristine();
                }
              } else if (response && response.status === CORE.ApiResponseTypeStatus.FAILED && response.errors && response.errors.data && response.errors.data.isPaymentAlreadyVoided) {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_PAYMENT_ALREADY_VOIDED);
                messageContent.message = stringFormat(messageContent.message, vm.custPaymentModel.paymentNumber, 'applied credit memo', 'transaction#');
                const model = {
                  messageContent: messageContent
                };
                DialogFactory.messageAlertDialog(model).then(() => {
                  if (vm.custInvPayFromCreditMemoForm) {
                    vm.custInvPayFromCreditMemoForm.$setPristine();
                  }
                  retrieveCustCreditMemoPaymentDet(vm.custPaymentModel);
                }).catch((error) => BaseService.getErrorLog(error));
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
    };
    // get all credit memo of customer with payment information
    const retrieveAllCreditMemoOfCustomer = (custPayDet) => {
      if (!custPayDet || !custPayDet.customerID) {
        return;
      }
      const custPayInfo = {
        customerID: custPayDet.customerID,
        transTypeForCreditMemo: CORE.TRANSACTION_TYPE.CREDITNOTE,
        subStatus: CORE.CUSTCRNOTE_SUBSTATUS.PUBLISHED,
        custPaymentMstID: vm.custPaymentMstID || null
      };
      return CustomerPackingSlipFactory.getAllCreditMemoListByCustomer().query({ custPayInfo: custPayInfo }).$promise.then((resp) => {
        vm.custCreditMemoList = [];
        if (resp && resp.data && resp.data.customerCreditMemoList && resp.data.customerCreditMemoList.length > 0) {
          vm.custCreditMemoList = resp.data.customerCreditMemoList;
          _.each(vm.custCreditMemoList, (creditMemoItem) => {
            creditMemoItem.creditMemoDate = BaseService.getUIFormatedDate(creditMemoItem.creditMemoDate, vm.DefaultDateFormat);
          });
        }
        return $q.resolve(resp);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // to get credit memo details with customer payment master data
    const retrieveCustCreditMemoPaymentDet = (custCreditMemoDet) => {
      if (!custCreditMemoDet || !custCreditMemoDet.custCreditMemoMstID) {
        return;
      }

      return CustomerPackingSlipFactory.getCreditMemoDetailForApplyInInvPayment().query({
        creditMemoTransType: CORE.TRANSACTION_TYPE.CREDITNOTE,
        custCreditMemoMstID: custCreditMemoDet.custCreditMemoMstID,
        customerPaymentMstID: vm.custPaymentMstID || null
      }).$promise.then((resp) => {
        if (resp && resp.data && resp.status === CORE.ApiResponseTypeStatus.SUCCESS && resp.data.custCreditMemoMstData) {
          const custCreditMemoPayDet = resp.data.custCreditMemoMstData;
          const custAccountReference = vm.custPaymentModel.accountReference || null;
          vm.custPaymentModel = resp.data.custCreditMemoMstData || {};
          if (!vm.custCreditMemoMstID) {
            vm.custPaymentModel.accountReference = custAccountReference;
          }
          vm.custPaymentMstID = vm.custPaymentModel.id || null;
          if (!vm.custPaymentMstID) {
            vm.custPaymentModel.paymentNumber = custCreditMemoPayDet.creditMemoNumber;
          }
          if (!$state.params.pid && vm.custPaymentMstID) {
            $state.transitionTo($state.$current, { pid: vm.custPaymentMstID }, { location: true, inherit: true, notify: false });
          }

          // set credit memo details into main payment model
          vm.custPaymentModel.refCustCreditMemoID = custCreditMemoPayDet.custCreditMemoMstID;
          vm.custPaymentModel.creditMemoNumber = custCreditMemoPayDet.creditMemoNumber;
          vm.custPaymentModel.creditMemoDate = BaseService.getUIFormatedDate(custCreditMemoPayDet.creditMemoDate, vm.DefaultDateFormat);
          vm.custPaymentModel.creditMemoAmount = custCreditMemoPayDet.totalAmount;
          vm.custPaymentModel.creditMemoAgreedRefundAmt = custCreditMemoPayDet.agreedRefundAmt;
          vm.custPaymentModel.creditMemoPositiveAmt = Math.abs(custCreditMemoPayDet.totalAmount);
          vm.custPaymentModel.leftOverCMAmtToBeRefunded = parseFloat(((vm.custPaymentModel.creditMemoAgreedRefundAmt || 0) - (vm.custPaymentModel.totRefundIssuedAgainstCreditMemo || 0)).toFixed(2));
          vm.custPaymentModel.sumOfAppliedCMRefundedAmt = parseFloat(((vm.custPaymentModel.paymentAmount || 0) + (vm.custPaymentModel.totRefundIssuedAgainstCreditMemo || 0)).toFixed(2));
          vm.custPaymentModel.remainingCMAmtInclAmtToBeRefunded = parseFloat(((vm.custPaymentModel.creditMemoAmount || 0) + (vm.custPaymentModel.sumOfAppliedCMRefundedAmt || 0)).toFixed(2));
          vm.isCustPaymentLocked = vm.custPaymentModel.lockStatus === vm.CustPaymentLockStatusConst.Locked ? true : false;
          vm.custPaymentModel.lockedByUserInitialName = custCreditMemoPayDet.lockedByUserInitialName;
          vm.custPaymentModel.lockedAt = custCreditMemoPayDet.lockedAt;
          //vm.custPaymentModel.customerFullName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, custCreditMemoPayDet.mfgCodeMst.mfgCode, custCreditMemoPayDet.mfgCodeMst.mfgName);

          /* applied date can not be less than Credit Memo Date  */
          vm.appliedDateOptions.minDate = vm.custPaymentModel.creditMemoDate;

          // get all invoice of customer (paid + pending to pay)
          if (custCreditMemoPayDet.customerID) {
            const custPayDet = {
              customerID: custCreditMemoPayDet.customerID
            };
            retrieveAllInvoiceOfCustomerPayment(custPayDet);
            if (vm.custCreditMemoMstID) {
              vm.custPaymentModel.mfgcodeID = custCreditMemoPayDet.customerID;
              const promises = [retrieveAllCreditMemoOfCustomer(custPayDet)];
              vm.cgBusyLoading = $q.all(promises).then(() => {
                initAutoCompleteForCustCreditMemo();
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }
          setDetailsForMainParentForm();
        }
        return $q.resolve(resp);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const init = () => {
      const promises = [getCustomerList(), getPaymentMethodType()];
      if (vm.custCreditMemoMstID) {
        const custCreditMemoDet = {
          custCreditMemoMstID: vm.custCreditMemoMstID
        };
        promises.push(retrieveCustCreditMemoPaymentDet(custCreditMemoDet));
      }
      vm.cgBusyLoading = $q.all(promises).then(() => {
        initAutoComplete();
        if (!vm.custCreditMemoMstID) {
          initAutoCompleteForCustCreditMemo();
        }
        // set credit memo type payment method
        const creditMemoGCDet = _.find(vm.paymentMethodTypeList, (item) => item.gencCategoryCode === TRANSACTION.ReceivablePaymentMethodGenericCategory.CreditMemo.gencCategoryCode);
        vm.autoCompletePaymentMethodType.keyColumnId = creditMemoGCDet ? creditMemoGCDet.gencCategoryID : null;
      }).catch((error) => BaseService.getErrorLog(error));
    };
    init();

    // to set sum count for invoice table payment
    const setSumOfAmountForCustInvoicePaymentList = () => {
      vm.sumOfOriginalPayAmountForSelectedInvoice = parseFloat((_.sumBy(vm.custInvoicePaymentList, (o) => o.originalPayAmountOfInvoice) || 0).toFixed(2));
      vm.sumOfLiveDueAmountForSelectedInvoice = parseFloat((_.sumBy(vm.custInvoicePaymentList, (o) => o.liveDueAmountForSelectedInvoice) || 0).toFixed(2));
      vm.sumOfPaymentAmountForSelectedInvoice = parseFloat((_.sumBy(vm.custInvoicePaymentList, (o) => o.paymentAmountForSelectedInvoice) || 0).toFixed(2));

      //vm.diffAmtBetPayAmtAndSelectedInvAmt = parseFloat(((vm.custPaymentModel.creditMemoPositiveAmt || 0) - (vm.sumOfPaymentAmountForSelectedInvoice)).toFixed(2));

      // to display in minus we added with credit memo amount which in minus
      vm.remainingCreditMemoAmt = parseFloat(((vm.custPaymentModel.creditMemoAmount || 0) + (vm.custPaymentModel.creditMemoAgreedRefundAmt || 0) + (vm.sumOfPaymentAmountForSelectedInvoice)).toFixed(2));
    };

    // sum of paying amount
    const setSumOfCurrPayAmountForCustInvPaymentList = () => {
      vm.sumOfPaymentAmountForSelectedInvoice = parseFloat((_.sumBy(vm.custInvoicePaymentList, (o) => o.paymentAmountForSelectedInvoice) || 0).toFixed(2));

      //vm.diffAmtBetPayAmtAndSelectedInvAmt = parseFloat(((vm.custPaymentModel.creditMemoPositiveAmt || 0) - (vm.sumOfPaymentAmountForSelectedInvoice)).toFixed(2));

      // to display in minus we added with credit memo amount which in minus
      vm.remainingCreditMemoAmt = parseFloat(((vm.custPaymentModel.creditMemoAmount || 0) + (vm.custPaymentModel.creditMemoAgreedRefundAmt || 0) + (vm.sumOfPaymentAmountForSelectedInvoice)).toFixed(2));

      const selectedInvList = _.filter(vm.custInvoicePaymentList, (invItem) => invItem.isSelected);

      /* total due amount = if invoice payment added then remaining due amount + paid amount = total due
       if invoice payment not added(new payment) then direct due amount of invoice */
      vm.totDueAmountOfSelectedInv = parseFloat((_.sumBy(selectedInvList, (o) => o.invPaymentDetMstID ? (parseFloat(((o.dueAmountForSelectedInvoice || 0) + (o.invPaidAmtFromCurrPaymentDet || 0)).toFixed(2))) : (o.dueAmountForSelectedInvoice || 0)).toFixed(2))
      ) || 0;

      /* below is total paying amount of different selected invoice */
      vm.totPayAmountOfSelectedInv = parseFloat((_.sumBy(selectedInvList, (o) => o.paymentAmountForSelectedInvoice) || 0).toFixed(2));

      vm.checkAnyInvSelected = _.some(vm.custInvoicePaymentList, (data) => data.isSelected);
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
      vm.remainingCreditMemoAmt = 0;
      vm.totDueAmountOfSelectedInv = 0;
      vm.totPayAmountOfSelectedInv = 0;
    };

    // called when we select any invoice item to pay from table list
    vm.selectCustSingleInvoice = (invItem) => {
      const totPayAmount = parseFloat(((angular.copy(vm.custPaymentModel.creditMemoPositiveAmt) || 0) - (vm.custPaymentModel.creditMemoAgreedRefundAmt || 0)).toFixed(2));
      if (totPayAmount && totPayAmount > 0 && invItem.isSelected) {
        if (parseFloat((invItem.dueAmountForSelectedInvoice + (vm.sumOfPaymentAmountForSelectedInvoice || 0)).toFixed(2)) <= totPayAmount) {
          vm.selectSingleInvWithForwardingAmt(invItem, invItem.dueAmountForSelectedInvoice);
        } else {
          const partialDueAmount = parseFloat((totPayAmount - (vm.sumOfPaymentAmountForSelectedInvoice || 0)).toFixed(2));
          vm.selectSingleInvWithForwardingAmt(invItem, partialDueAmount);
        }
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
      let totPayAmount = parseFloat(((angular.copy(vm.custPaymentModel.creditMemoPositiveAmt) || 0) - (vm.custPaymentModel.creditMemoAgreedRefundAmt || 0)).toFixed(2));
      _.each(vm.custInvoicePaymentList, (data) => {
        if (!data.isLocked) {  // if locked then not allowed to change
          data.isSelected = vm.isAllSelectFromCustInvoicePaymentList;
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
          }
          data.liveDueAmountForSelectedInvoice = (parseFloat(data.originalPayAmountOfInvoice.toFixed(2))) - (parseFloat((data.pastPaidAmtExcludeCurrTransForSelectedInv || 0).toFixed(2)) + parseFloat((data.paymentAmountForSelectedInvoice || 0).toFixed(2)));
        }
      });
      setSumOfAmountForCustInvoicePaymentList();
      setSumOfCurrPayAmountForCustInvPaymentList();
    };

    /* called on change of current payment amount change from invoice payment list */
    vm.paymentAmountChangeForSelectedInvoice = (invItem) => {
      if ((invItem.paymentAmountForSelectedInvoice === null) || (invItem.paymentAmountForSelectedInvoice === undefined)) {
        if (vm.custInvPayFromCreditMemoForm['invPayDetForm_' + invItem.invoiceMstID]['paymentAmountForSelectedInvoice_' + invItem.invoiceMstID] && vm.custInvPayFromCreditMemoForm['invPayDetForm_' + invItem.invoiceMstID]['paymentAmountForSelectedInvoice_' + invItem.invoiceMstID].$viewValue && vm.custInvPayFromCreditMemoForm['invPayDetForm_' + invItem.invoiceMstID]['paymentAmountForSelectedInvoice_' + invItem.invoiceMstID].$viewValue > 0 && vm.custInvPayFromCreditMemoForm['invPayDetForm_' + invItem.invoiceMstID]['paymentAmountForSelectedInvoice_' + invItem.invoiceMstID].$viewValue > invItem.maxLimitOfDueAmountToPay) {
          invItem.paymentAmountForSelectedInvoice = 0;
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_INV_PAY_ITEM_MAX_ALLOWED_AMT);
          messageContent.message = stringFormat(messageContent.message,'Credit Memo Applied', vm.custInvPayFromCreditMemoForm['invPayDetForm_' + invItem.invoiceMstID]['paymentAmountForSelectedInvoice_' + invItem.invoiceMstID].$viewValue, invItem.maxLimitOfDueAmountToPay);
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

      const sumOfSelectedInvPaymentAmtWithAgreedRefund = parseFloat(((_.sumBy(vm.custInvoicePaymentList, (o) => o.paymentAmountForSelectedInvoice) || 0) + (vm.custPaymentModel.creditMemoAgreedRefundAmt || 0)).toFixed(2));
      // if selected invoices amount is more than main payment amount than display error
      if ((vm.custPaymentModel.creditMemoPositiveAmt || 0) < (sumOfSelectedInvPaymentAmtWithAgreedRefund || 0)) {
        invItem.paymentAmountForSelectedInvoice = 0;
        const msgContForPayAmtNotMore = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.INV_AMT_NOT_MORE_THAN_ACTUAL_PAY_AMT);
        msgContForPayAmtNotMore.message = stringFormat(msgContForPayAmtNotMore.message, 'Remaining Credit Memo');
        const model = {
          messageContent: msgContForPayAmtNotMore
        };
        DialogFactory.messageAlertDialog(model).then(() => {
          setFocus('paymentAmountForSelectedInvoice_' + invItem.invoiceMstID);
        }).catch((error) => {
          BaseService.getErrorLog(error);
        });
      }

      invItem.liveDueAmountForSelectedInvoice = (parseFloat(invItem.originalPayAmountOfInvoice.toFixed(2))) - (parseFloat((invItem.pastPaidAmtExcludeCurrTransForSelectedInv || 0).toFixed(2)) + parseFloat((invItem.paymentAmountForSelectedInvoice || 0).toFixed(2)));
      setSumOfAmountForCustInvoicePaymentList();
      setSumOfCurrPayAmountForCustInvPaymentList();
    };

    // create/update customer payment details
    vm.saveCustomerPayment = () => {
      vm.addUpdatePaymentSuccessMsg = null;
      $scope.$parent.vm.saveBtnDisableFlag = true;
      if (BaseService.focusRequiredField(vm.custInvPayFromCreditMemoForm)) {
        $scope.$parent.vm.saveBtnDisableFlag = false;
        return;
      }
      if (vm.custPaymentModel.isPaymentVoided || vm.isCustPaymentLocked) {
        /* when transaction is already voided or when transaction locked then not allowed to access */
        return;
      }
      saveCustomerPaymentDetails();
    };

    // create/update customer payment
    const saveCustomerPaymentDetails = () => {
      // get invalid main payment amount
      if ((vm.custPaymentModel.creditMemoPositiveAmt === null) || (vm.custPaymentModel.creditMemoPositiveAmt === undefined) || (vm.custPaymentModel.creditMemoPositiveAmt === '') || ((vm.custPaymentModel.creditMemoPositiveAmt || 0) <= 0)) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.PLEASE_ENTER_VALID_FIELD_VALUE);
        messageContent.message = stringFormat(messageContent.message, 'credit memo amount');
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
      if ((vm.custPaymentModel.creditMemoPositiveAmt || 0) < (vm.sumOfPaymentAmountForSelectedInvoice || 0)) {
        const msgContForPayAmtNotMore = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.INV_AMT_NOT_MORE_THAN_ACTUAL_PAY_AMT);
        msgContForPayAmtNotMore.message = stringFormat(msgContForPayAmtNotMore.message, 'Remaining Credit Memo');
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
      const isAnyInvPaySelected = _.some(vm.custInvoicePaymentList, (invItem) => invItem.isSelected && invItem.originalPayAmountOfInvoice > 0);
      if (!isAnyInvPaySelected) {
        const msgContentForSelectOneInv = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        msgContentForSelectOneInv.message = stringFormat(msgContentForSelectOneInv.message, 'invoice for payment');
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

      // get all invalid invoice payment list
      const invalidPaymentList = _.filter(vm.custInvoicePaymentList, (invItem) => (invItem.paymentAmountForSelectedInvoice === null) || (invItem.paymentAmountForSelectedInvoice === undefined) || (invItem.paymentAmountForSelectedInvoice === '') || (invItem.paymentAmountForSelectedInvoice > invItem.maxLimitOfDueAmountToPay)
      );
      if (invalidPaymentList && invalidPaymentList.length > 0) {
        $scope.$parent.vm.saveBtnDisableFlag = false;
        return;
      }

      const custPaymentObj = {
        customerPaymentMstID: vm.custPaymentMstID,
        mfgcodeID: vm.autoCompleteCustomer.keyColumnId,
        paymentNumber: vm.custPaymentModel.paymentNumber,
        paymentDate: null,
        paymentAmount: vm.sumOfPaymentAmountForSelectedInvoice,  // we store selected inv total payment amount
        paymentType: vm.autoCompletePaymentMethodType.keyColumnId,
        accountReference: vm.custPaymentModel.accountReference,
        bankAccountMasID: null,
        bankAccountNo: null,
        bankName: null,
        remark: vm.custPaymentModel.remark,
        isZeroPayment: false,
        depositBatchNumber: null,
        refPaymentMode: TRANSACTION.ReceivableRefPaymentMode.CreditMemoApplied.code,
        isConfmTakenForDuplicateCheckNo: false,
        refCustCreditMemoID: vm.autoCompleteCustCreditMemo.keyColumnId,
        custInvoicePaymentDetList: [],
        deleteCustInvPaymentDetList: []
      };

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
          appliedDate: BaseService.getAPIFormatedDate(invItem.appliedDate)
        };

        custPaymentObj.custInvoicePaymentDetList.push(_obj);
      });
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
            vm.addUpdatePaymentSuccessMsg = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_CREDIT_MEMO_INV_PAY_APPLIED_SUCCESS.message;
            //retrieveCustInvPaymentMstData();
            const custCreditMemoDet = {
              custCreditMemoMstID: vm.custPaymentModel.refCustCreditMemoID
            };
            retrieveCustCreditMemoPaymentDet(custCreditMemoDet);
            const custPayDet = {
              customerID: vm.autoCompleteCustomer.keyColumnId
            };
            retrieveAllInvoiceOfCustomerPayment(custPayDet);
            //setDetailsForMainParentForm();
            vm.custInvPayFromCreditMemoForm.$setPristine();
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
            vm.addUpdatePaymentSuccessMsg = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_CREDIT_MEMO_INV_PAY_APPLIED_SUCCESS.message;
            vm.custPaymentMstID = resp.data.insertedInvPaymentMstID;
            setDetailsForMainParentForm();
            const custCreditMemoDet = {
              custCreditMemoMstID: vm.custPaymentModel.refCustCreditMemoID
            };
            retrieveCustCreditMemoPaymentDet(custCreditMemoDet);
            const custPayDet = {
              customerID: vm.autoCompleteCustomer.keyColumnId
            };
            retrieveAllInvoiceOfCustomerPayment(custPayDet);
            vm.custInvPayFromCreditMemoForm.$setPristine();
            $state.transitionTo($state.$current, { ccmid: vm.custPaymentModel.refCustCreditMemoID }, { location: true, inherit: true, notify: false });
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
            } else if (resp.errors.data.isCreditMemoAlreadyApplied) {
              // if credit memo already applied then not allow
              $scope.$parent.vm.saveBtnDisableFlag = false;
              const msgContForCMAlreadyApplied = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CREDIT_MEMO_ALREADY_APPLIED_IN_INV_PAY);
              msgContForCMAlreadyApplied.message = stringFormat(msgContForCMAlreadyApplied.message, vm.custPaymentModel.creditMemoNumber);
              const model = {
                messageContent: msgContForCMAlreadyApplied
              };
              DialogFactory.messageAlertDialog(model);
            }
          }
        }).catch((error) => {
          $scope.$parent.vm.saveBtnDisableFlag = false;
          BaseService.getErrorLog(error);
        });
      }
    };

    const setDetailsForMainParentForm = () => {
      if ($scope.$parent && $scope.$parent.vm && $scope.$parent.vm.custCreditMemoPayDetParent) {
        $scope.$parent.vm.custCreditMemoPayDetParent.custPaymentMstID = vm.custPaymentMstID || null;
        $scope.$parent.vm.custCreditMemoPayDetParent.paymentNumber = vm.custPaymentModel.paymentNumber || null;
        $scope.$parent.vm.custCreditMemoPayDetParent.refCustCreditMemoID = vm.custPaymentModel.refCustCreditMemoID || null;
        $scope.$parent.vm.custCreditMemoPayDetParent.isPaymentVoidedConvertedValue = vm.custPaymentModel.isPaymentVoidedConvertedValue;
        $scope.$parent.vm.custCreditMemoPayDetParent.isPaymentVoided = vm.custPaymentModel.isPaymentVoided;
        $scope.$parent.vm.custCreditMemoPayDetParent.creditAppliedStatus = vm.custPaymentModel.creditAppliedStatus;
        $scope.$parent.vm.custCreditMemoPayDetParent.CMPaymentStatus = vm.custPaymentModel.CMPaymentStatus;
        $scope.$parent.vm.custCreditMemoPayDetParent.lockedByUserName = vm.custPaymentModel.lockedByUserName;
        $scope.$parent.vm.custCreditMemoPayDetParent.lockedAt = vm.custPaymentModel.lockedAt;

        if ($scope.$parent.vm.custCreditMemoPayDetParent.lockStatus === vm.CustPaymentLockStatusConst.Locked && $scope.$parent.vm.custCreditMemoPayDetParent.lockedByUserName) {
          const userNameWithSplit = vm.custPaymentModel.lockedByUserName.split(' ');
          $scope.$parent.vm.custCreditMemoPayDetParent.lockedByUserFullName = stringFormat(CORE.GENERIC_DATA_FORMAT.EmployeeManager, vm.custPaymentModel.lockedByUserInitialName, userNameWithSplit[0], userNameWithSplit[1]);
        }
        $scope.$parent.vm.custCreditMemoPayDetParent.isCustPaymentLocked = vm.isCustPaymentLocked;

        const docTabDet = _.find($scope.$parent.vm.tabList, (tabItem) => tabItem.id === $scope.$parent.vm.applyCustCreditMemoManageTabIDsConst.Document);
        if (docTabDet) {
          docTabDet.isDisabled = vm.custPaymentMstID ? false : true;
        }
      }
    };
    setDetailsForMainParentForm();

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
            DialogFactory.messageAlertDialog(model);
            return;
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
      }
      invItem.liveDueAmountForSelectedInvoice = (parseFloat(invItem.originalPayAmountOfInvoice.toFixed(2))) - (parseFloat((invItem.pastPaidAmtExcludeCurrTransForSelectedInv || 0).toFixed(2)) + parseFloat((invItem.paymentAmountForSelectedInvoice || 0).toFixed(2)));
      setSumOfAmountForCustInvoicePaymentList();
      setSumOfCurrPayAmountForCustInvPaymentList();
    };

    // to reset payment details in add mode
    vm.resetPaymentDet = () => {
      if (vm.autoCompleteCustomer.keyColumnId) {
        vm.autoCompleteCustomer.keyColumnId = null;
      }
    };

    // to refresh customer payment details
    vm.refreshPaymentDet = () => {
      let isAnyInvPayDetFormDirty = false;
      _.each(vm.custInvoicePaymentList, (invItem) => {
        const isdirty = checkFormDirty(vm.custInvPayFromCreditMemoForm['invPayDetForm_' + invItem.invoiceMstID]);
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
        retrieveAllCreditMemoOfCustomer(custPayDet);
      }
    };

    const getLatestInvPaymentDet = () => {
      if (vm.autoCompleteCustCreditMemo.keyColumnId) {
        const custCreditMemoDet = {
          custCreditMemoMstID: vm.autoCompleteCustCreditMemo.keyColumnId
        };
        retrieveCustCreditMemoPaymentDet(custCreditMemoDet);
      }
      const custPayDet = {
        customerID: vm.autoCompleteCustomer.keyColumnId
      };
      retrieveAllInvoiceOfCustomerPayment(custPayDet);
    };

    // to refresh customer invoices payment details
    vm.refreshCustomerInvoicesPaymentDet = () => {
      const custPayDet = {
        customerID: vm.autoCompleteCustomer.keyColumnId
      };
      retrieveAllInvoiceOfCustomerPayment(custPayDet);
      retrieveAllCreditMemoOfCustomer(custPayDet);
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
          vm.custInvPayFromCreditMemoForm.$setPristine();
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

    // to move at invoice list page with filter data
    vm.moveToInvoiceListPageWithFilter = () => {
      const searchData = {
        customerID: vm.autoCompleteCustomer.keyColumnId,
        dueDate: BaseService.getCurrentDate(),
        custInvSubStatusList: [vm.custInvoiceSubStatusListConst.INVOICED, vm.custInvoiceSubStatusListConst.CORRECTEDINVOICED]
      };
      BaseService.goToCustInvListWithTermsDueDateSearch(searchData);
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

    /* display refunded amount popup to display all refunded transaction against current payment */
    vm.showTotRefundIssueDetAgainstPayment = (isShowAllTransWhereCreditUsed) => {
      const selectedCust = _.find(vm.customerList, (custItem) => custItem.id === vm.autoCompleteCustomer.keyColumnId);
      const data =
      {
        id: vm.custCreditMemoMstID || vm.custPaymentModel.refCustCreditMemoID,
        mfgCodeID: vm.autoCompleteCustomer.keyColumnId,
        paymentCMNumber: vm.custPaymentModel.creditMemoNumber,
        customerName: selectedCust ? selectedCust.mfgFullName : null,
        totalPaymentAmount: vm.custPaymentModel.creditMemoAmount,
        totalRefundIssuedAmount: vm.custPaymentModel.totRefundIssuedAgainstCreditMemo,
        agreedRefundAmount: vm.custPaymentModel.agreedRefundAmt,
        refGencTransModeID: CORE.GenericTransModeName.RefundPayableCMRefund.id,
        isDisplayAllTransWhereCreditUsed: isShowAllTransWhereCreditUsed,
        sumAppliedCMRefundedAmount: vm.custPaymentModel.sumOfAppliedCMRefundedAmt
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

    /* to move at apply credit memo on invoice page */
    vm.applyCreditMemoToInvoice = (creditMemoMstID) => {
      if (creditMemoMstID) {
        BaseService.goToApplyCustCreditMemoToPayment(creditMemoMstID, null);
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
      BaseService.goToCustomerBillingAddressList(CORE.CUSTOMER_TYPE.CUSTOMER, vm.autoCompleteCustomer.keyColumnId);
    };

    /* to go at customer invoice page  */
    vm.goToCustInvoiceDetail = (invoiceMstID) => {
      BaseService.goToManageCustomerInvoice(invoiceMstID);
    };

    /* to go at applied credit memo list page */
    vm.goToAppliedCreditMemoList = () => {
      BaseService.goToAppliedCustCreditMemoToInvList();
    };

    //go to customer credit memo list page
    vm.goToCustomerCreditMemoList = () => {
      BaseService.goToCustomerCreditMemoList();
    };

    //go to customer credit memo detail page
    vm.goToCustomerCreditMemoDetail = () => {
      BaseService.goToCustomerCreditMemoDetail(vm.custPaymentModel.refCustCreditMemoID);
    };

    /* to go at customer refund list page */
    vm.goToCustomerRefundList = () => {
      BaseService.goToCustomerRefundList();
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
      BaseService.currentPageForms = [vm.custInvPayFromCreditMemoForm];
      if ($scope.$parent && $scope.$parent.vm) {
        $scope.$parent.vm.custInvPayFromCreditMemoForm = vm.custInvPayFromCreditMemoForm;
        $scope.$parent.vm.saveCustomerPayment = vm.saveCustomerPayment;
        $scope.$parent.vm.voidPaymentAndReleaseInvoiceGroup = vm.voidPaymentAndReleaseInvoiceGroup;
        $scope.$parent.vm.voidAndReleaseInvoiceGroup = vm.voidAndReleaseInvoiceGroup;
        $scope.$parent.vm.voidAndReIssuePayment = vm.voidAndReIssuePayment;
        // when click on browser back button then need to set active tab otherwise tab not change
        $scope.$parent.vm.activeTab = $scope.$parent.vm.applyCustCreditMemoManageTabIDsConst.Detail;
      }
    });
  }
})();
