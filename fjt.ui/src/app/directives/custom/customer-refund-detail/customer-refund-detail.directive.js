(function () {
  'use strict';
  angular
    .module('app.core')
    .directive('customerRefundDetail', customerRefundDetail);
  function customerRefundDetail($q, USER, CORE, BaseService, BankFactory, GenericCategoryFactory, MasterFactory, CustomerRefundFactory, TransactionModesFactory, TRANSACTION, $state, DialogFactory, $filter, PackingSlipFactory, $location, CustomerFactory, ReportMasterFactory, $timeout) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        custRefundMasterId: '=',
        saveCustomerRefund: '=',
        voidPaymentAndReleaseInvoiceGroup: '=',
        changeCustRefundSubStatus: '=',
        currActiveForm: '=',
        mainParentCtrlScope: '=',
        isPrintCheckAction: '@'
      },
      templateUrl: 'app/directives/custom/customer-refund-detail/customer-refund-detail.html',
      controller: customerRefundDetailDirController,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function customerRefundDetailDirController($scope) {
      const vm = this;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.LabelConstant = CORE.LabelConstant;
      vm.loginUser = BaseService.loginUser;
      vm.custRefundMstID = $scope.custRefundMasterId;
      vm.isPrintCheckAction = $scope.isPrintCheckAction === 'true' ? true : false;
      vm.paramSearchObj = $location.search();
      let oldRefundPaymentCheckNum = '';
      let oldBankAccountNo = '';
      const authenticateCheckNumberDuplication = _authenticateCheckNumberDuplication;
      vm.CustPaymentLockStatusConst = TRANSACTION.CustomerPaymentLockStatus;
      vm.isCustRefundLocked = false;
      vm.custAddrViewActionBtnDet = angular.copy(CORE.CustAddressViewActionBtn);
      vm.contPersonViewActionBtnDet = angular.copy(CORE.ContactPersonViewActionBtn);

      if (vm.paramSearchObj) {
        vm.paramSearchObj.transModeID = vm.paramSearchObj.transModeID ? parseInt(vm.paramSearchObj.transModeID) : null;
        vm.paramSearchObj.custID = vm.paramSearchObj.custID ? parseInt(vm.paramSearchObj.custID) : null;
        vm.paramSearchObj.CMID = vm.paramSearchObj.CMID ? parseInt(vm.paramSearchObj.CMID) : null;
        vm.paramSearchObj.CPID = vm.paramSearchObj.CPID ? parseInt(vm.paramSearchObj.CPID) : null;
      }
      vm.DefaultDateFormat = _dateDisplayFormat;
      vm.emptyCustomerConst = USER.ADMIN_EMPTYSTATE.CUSTOMER;
      vm.emptyStateCustRefConst = TRANSACTION.TRANSACTION_EMPTYSTATE.CUSTOMER_REFUND;
      vm.custPayDiffNotesConst = TRANSACTION.CustomerPaymentDiffNotes;
      vm.customerList = [];
      vm.paymentMethodTypeList = [];
      vm.bankList = [];
      vm.custRefundModel = {
        paymentDate: BaseService.getUIFormatedDateTimeInCompanyTimeZone(new Date(), vm.DefaultDateFormat)
      };
      $scope.mainParentCtrlScope.saveBtnDisableFlag = false;
      vm.custRefundNotesConst = TRANSACTION.CustomerRefundNotes;
      vm.receivableRefPaymentModeConst = TRANSACTION.ReceivableRefPaymentMode;
      vm.genericTransMode = CORE.GenericTransMode.RefundPayable;
      vm.GenericTransModeName = CORE.GenericTransModeName;
      vm.custBillAddrEmptyState = USER.ADMIN_EMPTYSTATE.CUSTOMERBILLINGADDRESS;
      vm.isDisableTotalRefundAmount = false;
      vm.isCheckTypePaymentMtdSelected = false;
      vm.chequeDateOptions = {
        appendToBody: true
        //maxDate: new Date((new Date()).setDate((new Date()).getDate()))
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
      vm.payRefSearch = {};
      //vm.debounceTimeIntervalConst = CORE.Debounce.mdDataTable;
      vm.debounceTimeIntervalConst = CORE.DEBOUNCE_TIME_INTERVAL;
      //vm.invoicePaymentStatusConst = CORE.InvoicePaymentStatus;
      const CategoryTypeObjList = angular.copy(CORE.CategoryType);
      vm.isSubStatusDraft = true;
      vm.isSubStatusPublished = false;

      const setAddrOtherDet = () => {
        vm.viewCustAddrOtherDet = {
          addressType: CORE.AddressType.BillingAddress
        };
      };
      setAddrOtherDet();

      /* get all feature rights for customer payment */
      const getAllFeatureRights = () => {
        vm.allowToVoidCustRefundFeature = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToVoidCustomerRefund);
        //if ( $scope.$parent.vm) {
        //  $scope.$parent.vm.allowToVoidCustRefundFeature = vm.allowToVoidCustRefundFeature;
        //}
        if ($scope.mainParentCtrlScope) {
          $scope.mainParentCtrlScope.allowToVoidCustRefundFeature = vm.allowToVoidCustRefundFeature;
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

      //get generic transmode mst details
      const getTransModeList = () => {
        const transInfo = {
          modeType: vm.genericTransMode
        };

        TransactionModesFactory.getTransModeList().query({ transInfo: transInfo }).$promise.then((transMode) => {
          if (transMode && transMode.data) {
            vm.transModeList = transMode.data.customerTransModeNameList;
            vm.toRemoveGenericTransMode = [{ id: -11, modeType: 'RP', modeCode: '', modeName: 'Write Off', description: 'Write Off', ref_acctid: '' }];
            vm.transModeList = vm.transModeList.filter((item) => !(_.map(vm.toRemoveGenericTransMode, 'id').includes(item.id)));
          }
          return $q.resolve(vm.transModeList);
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* Get payment method */
      const getPaymentMethodType = () => {
        const GencCategoryType = [];
        GencCategoryType.push(CORE.CategoryType.PayablePaymentMethods.Name);
        const listObj = {
          GencCategoryType: GencCategoryType,
          isActive: true
        };
        return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((paymentmethod) => {
          if (paymentmethod && paymentmethod.data) {
            if (vm.custRefundMstID) {
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
          if (vm.custRefundMstID) {
            vm.bankList = bank.data;
          }
          else {
            vm.bankList = _.filter(bank.data, (item) => item.isActive);
          }
          _.each(vm.bankList, (bankItem) => {
            bankItem.accountCodeFullName = stringFormat('{0} | {1}', bankItem.accountCode, bankItem.bankName);
          });
          return $q.resolve(vm.bankList);
        }
      }).catch((error) => BaseService.getErrorLog(error));

      const initAutoComplete = () => {
        vm.autoCompleteCustomer = {
          columnName: 'mfgFullName',
          controllerName: USER.ADMIN_CUSTOMER_ADD_MODAL_CONTROLLER,
          viewTemplateURL: USER.ADMIN_CUSTOMER_ADD_MODAL_VIEW,
          keyColumnName: 'id',
          keyColumnId: vm.custRefundModel ? vm.custRefundModel.mfgcodeID : null,
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

        vm.autoCompleteTransMode = {
          columnName: 'modeName',
          keyColumnName: 'id',
          keyColumnId: vm.custRefundModel ? vm.custRefundModel.refGencTransModeID : null,
          inputName: 'Transaction Mode',
          placeholderName: 'Transaction Mode',
          isRequired: true,
          isAddnew: true,
          isAddFromRoute: true,
          routeName: USER.ADMIN_MANAGE_PAYABLE_TRANSACTION_MODES_STATE,
          addData: {},
          callbackFn: getTransModeList,
          onSelectCallbackFn: onSelectTransModeCallbackFn
        };

        vm.autoCompletePaymentMethodType = {
          columnName: 'gencCategoryName',
          controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
          viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
          keyColumnName: 'gencCategoryID',
          keyColumnId: vm.custRefundModel ? vm.custRefundModel.paymentType : null,
          inputName: CategoryTypeObjList.PayablePaymentMethods.Name,
          placeholderName: 'Payment Method',
          isRequired: true,
          isAddnew: true,
          addData: {
            headerTitle: CategoryTypeObjList.PayablePaymentMethods.Title,
            popupAccessRoutingState: [USER.ADMIN_PAYMENT_METHODS_MANAGEGENERICCATEGORY_STATE],
            pageNameAccessLabel: CategoryTypeObjList.PayablePaymentMethods.Title
          },
          onSelectCallbackFn: onSelectPaymentMethodTypeCallbackFn,
          callbackFn: getPaymentMethodType
        };
        vm.autoCompleteBankAccountNumber = {
          columnName: 'accountCodeFullName',
          controllerName: USER.ADMIN_BANK_ADD_UPDATE_MODAL_CONTROLLER,
          viewTemplateURL: USER.ADMIN_BANK_ADD_UPDATE_MODAL_VIEW,
          keyColumnName: 'id',
          keyColumnId: vm.custRefundModel ? vm.custRefundModel.bankAccountMasID : null,
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
              vm.custRefundModel.bankAccountMasID = obj.id;
              vm.custRefundModel.bankAccountNo = obj.accountCode;
              vm.custRefundModel.bankName = obj.bankName;
            }
            else {
              vm.custRefundModel.bankAccountMasID = null;
              vm.custRefundModel.bankAccountNo = null;
              vm.custRefundModel.bankName = null;
            }
          }
        };
      };

      //on select Generic Trans Mode Type
      const onSelectTransModeCallbackFn = (selectedTransMode) => {
        if (selectedTransMode) {
          if ($scope.mainParentCtrlScope) {
            $scope.mainParentCtrlScope.selectedTransModeDet = selectedTransMode;
          }
        }
        else {
          vm.autoCompleteCustomer.keyColumnId = null;
          resetDetails();
        }
      };

      // on select payment method type
      const onSelectPaymentMethodTypeCallbackFn = (selectedPaymentMethodTypeObj) => {
        if (selectedPaymentMethodTypeObj) {
          vm.custRefundModel.paymentType = selectedPaymentMethodTypeObj.gencCategoryID;
          vm.isCheckTypePaymentMtdSelected = (selectedPaymentMethodTypeObj.gencCategoryCode === TRANSACTION.PayablePaymentMethodGenericCategory.Check.gencCategoryCode) ? true : false;
          vm.custRefundModel.isMarkAsPaid = vm.isCheckTypePaymentMtdSelected ? false : vm.custRefundModel.isMarkAsPaid;
          if ($scope.mainParentCtrlScope) {
            $scope.mainParentCtrlScope.custRefundSubStatusList = angular.copy($scope.mainParentCtrlScope.custRefundSubStatusListOrg);
            if (!vm.isCheckTypePaymentMtdSelected) {
              // remove 'Ready to Print Check' - whose code/id 3
              _.remove($scope.mainParentCtrlScope.custRefundSubStatusList, (statusItem) => statusItem.code === 3);
            }
          }
        } else {
          vm.custRefundModel.paymentType = null;
          vm.custRefundModel.isMarkAsPaid = false;
          vm.isCheckTypePaymentMtdSelected = false;
        }
      };

      // when user select customer
      const onSelectCustCallbackFn = (selectedCust) => {
        if (selectedCust) {
          vm.custRefundModel.mfgName = selectedCust.mfgName;
          if ($scope.mainParentCtrlScope) {
            $scope.mainParentCtrlScope.selectedCustomerDet = selectedCust;
          }
          if (!vm.custRefundMstID) {
            const CheckGCDet = _.find(vm.paymentMethodTypeList, (item) => item.gencCategoryCode === TRANSACTION.PayablePaymentMethodGenericCategory.Check.gencCategoryCode);
            vm.autoCompletePaymentMethodType.keyColumnId = CheckGCDet ? CheckGCDet.gencCategoryID : null;
            // when new payment entry then fill up details from customer master
            //if (selectedCust.paymentMethodID) {
            //  vm.autoCompletePaymentMethodType.keyColumnId = selectedCust.paymentMethodID;
            //}
            vm.custRefundModel.accountReference = selectedCust.accountRef || null;
          }
          // get all refund of customer with payment information
          const custPayDet = {
            customerID: selectedCust.id,
            transModeID: vm.autoCompleteTransMode.keyColumnId
          };
          if (custPayDet.transModeID === vm.GenericTransModeName.RefundPayablePayRefund.id) {
            vm.isDisableTotalRefundAmount = true;
            retrieveAllRefundCustomerPayment(custPayDet);
          } else if (custPayDet.transModeID === vm.GenericTransModeName.RefundPayableCMRefund.id) {
            vm.isDisableTotalRefundAmount = true;
            retrieveAllCreditMemoOfCustomerPayment(custPayDet);
          } else {
            vm.isDisableTotalRefundAmount = false;
            // retrieveCustRefundMstData();
          }
          setOtherDetForCustAddrDir(selectedCust.id);
          getCustomerAddress(selectedCust.id);
          if (vm.custRefundMstID) {
            getCustomerContactPersonList(selectedCust.id);
          }
        }
        else {
          setAddrOtherDet();
          resetDetails();
        }
      };

      // reset refund details
      const resetDetails = () => {
        if ($scope.mainParentCtrlScope) {
          $scope.mainParentCtrlScope.selectedCustomerDet = null;
        }
        vm.custRefundModel = {};
        //vm.custCMRefundModel = {};
        vm.custCreditMemoPaymentList = [];
        vm.customerPaymentList = [];
        vm.isAllSelectFromCustPaymentList = false;
        vm.isAllSelectFromCustCMList = false;
        vm.custRefundModel.totalRefundAmount = null;
        vm.billingAddress = null;
        vm.selectedContactPerson = null;
        vm.custRefundModel.paymentDate = BaseService.getUIFormatedDateTimeInCompanyTimeZone(new Date(), vm.DefaultDateFormat);
        if (!vm.custRefundMstID) {
          const CheckGCDet = _.find(vm.paymentMethodTypeList, (item) => item.gencCategoryCode === TRANSACTION.PayablePaymentMethodGenericCategory.Check.gencCategoryCode);
          vm.autoCompletePaymentMethodType.keyColumnId = CheckGCDet ? CheckGCDet.gencCategoryID : null;
        }
        clearSumOfAmountForCustPaymentList();
        if (!vm.custRefundMstID) {
          // when new  entry then clear all fill up details which set from customer master
          if (vm.autoCompletePaymentMethodType.keyColumnId) {
            vm.autoCompletePaymentMethodType.keyColumnId = null;
          }
          if (vm.autoCompleteBankAccountNumber.keyColumnId) {
            vm.autoCompleteBankAccountNumber.keyColumnId = null;
          }
        }
      };
      // get all Refund of customer with payment information
      const retrieveAllRefundCustomerPayment = (custPayDet) => {
        if (!custPayDet || !custPayDet.customerID) {
          return;
        }
        const custPayInfo = {
          customerID: custPayDet.customerID,
          custRefundMstID: vm.custRefundMstID || null,
          refPaymentMode: CORE.RefPaymentModeForInvoicePayment.Receivable,
          isGetOnlyPaidCustomerRefundFromPayment: false
        };
        vm.cgBusyLoading = CustomerRefundFactory.getAllRefundPaymentOfCustomer().query({ custPayInfo: custPayInfo }).$promise.then((resp) => {
          vm.customerPaymentList = [];
          clearSumOfAmountForCustPaymentList();
          if (resp && resp.data && resp.data.customerPaymentList && resp.data.customerPaymentList.length > 0) {
            vm.customerPaymentList = resp.data.customerPaymentList;
            //Order By payment Date and id
            vm.customerPaymentList = _.orderBy(vm.customerPaymentList, ['paymentDate', 'paymentMstID'], ['asc', 'asc']);
            _.each(vm.customerPaymentList, (payItem) => {
              payItem.totalPaymentAmount = parseFloat((payItem.totalPaymentAmount || 0).toFixed(2));
              payItem.paymentAmountForSelectedPayment = parseFloat((payItem.paymentAmountForSelectedPayment || 0).toFixed(2));
              payItem.paymentAmountForSelectedPaymentCopy = angular.copy(payItem.paymentAmountForSelectedPayment);

              payItem.pastPaidAmountForSelectedPayment = parseFloat((payItem.totalRefundIssuedAmount || 0) + (payItem.paymentAmountForSelectedPayment || 0).toFixed(2));
              payItem.totalAgreedRefundAmt = parseFloat((payItem.agreedRefundAmount || 0).toFixed(2));

              payItem.dueAmountForSelectedPayment = parseFloat(((payItem.agreedRefundAmount || 0) - (payItem.totalRefundIssuedAmount || 0)).toFixed(2));
              // live due refund payment >> when user change pay amount it will be updated instantly
              payItem.liveDueAmountForSelectedPayment = angular.copy(payItem.dueAmountForSelectedPayment);

              payItem.openAmountForSelectedPayment = parseFloat(((payItem.totalPaymentAmount || 0) - (payItem.totalRefundIssuedAmount || 0) - (payItem.paidPaymentAmount || 0)).toFixed(2));

              payItem.isSelected = payItem.paymentDetMstID ? true : false;

              payItem.pastRefundIssuedAmount = parseFloat(((payItem.totalRefundIssuedAmount || 0) - (payItem.paymentAmountForSelectedPayment || 0)).toFixed(2));
              payItem.pastRefundAmtExcludeCurrTransForSelectedPayment = parseFloat(((payItem.totalRefundIssuedAmount || 0) - (payItem.paymentAmountForSelectedPayment || 0)).toFixed(2));

              payItem.maxLimitOfDueAmountToPay = parseFloat((payItem.paymentDetMstID ? parseFloat(((payItem.agreedRefundAmount || 0) - (payItem.pastRefundIssuedAmount || 0)).toFixed(2)) : (payItem.dueAmountForSelectedPayment || 0)).toFixed(2));
              payItem.paymentDateWithConverted = BaseService.getUIFormatedDate(payItem.paymentDate, vm.DefaultDateFormat);
            });
            setSumOfAmountForCustPaymentList();
            setSumOfCurrPayAmountForCustPaymentList();
            const checkAnyNotSelectedPay = _.some(vm.customerPaymentList, (data) => !data.isSelected);
            vm.isAllSelectFromCustPaymentList = checkAnyNotSelectedPay ? false : true;
            // set selected customer payment if external search/set call
            if (!vm.custRefundMstID && vm.paramSearchObj && vm.paramSearchObj.CPID) {
              const searchCPDet = _.find(vm.customerPaymentList, (payItem) => payItem.paymentMstID === vm.paramSearchObj.CPID);
              if (searchCPDet) {
                searchCPDet.isSelected = true;
                vm.selectCustSinglePayment(searchCPDet);
              }
            }
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
          custRefundMstID: vm.custRefundMstID || null,
          transTypeForCreditMemo: CORE.TRANSACTION_TYPE.CREDITNOTE,
          RefPaymentMode: TRANSACTION.ReceivableRefPaymentMode.CreditMemoApplied.code
        };
        vm.cgBusyLoading = CustomerRefundFactory.getAllCreditMemoOfCustomerRefund().query({ custPayInfo: custPayInfo }).$promise.then((resp) => {
          vm.custCreditMemoPaymentList = [];
          if (resp && resp.data && resp.data.customerCreditMemoList && resp.data.customerCreditMemoList.length > 0) {
            vm.custCreditMemoPaymentList = resp.data.customerCreditMemoList;
            vm.custCreditMemoPaymentList = _.orderBy(vm.custCreditMemoPaymentList, ['creditMemoDate'], ['asc']);
            _.each(vm.custCreditMemoPaymentList, (creditMemoItem) => {
              creditMemoItem.creditMemoDate = BaseService.getUIFormatedDate(creditMemoItem.creditMemoDate, vm.DefaultDateFormat);
              // credit memo amount is in minus so below openCreditMemoAmount get with plus
              creditMemoItem.paymentAmountForSelectedCM = parseFloat((creditMemoItem.paymentAmountForSelectedCM || 0).toFixed(2));
              creditMemoItem.paymentAmountForSelectedCMCopy = angular.copy(creditMemoItem.paymentAmountForSelectedCM);

              creditMemoItem.openCreditMemoAmount = parseFloat(((creditMemoItem.originalCreditMemoAmount || 0) + (creditMemoItem.pastPaidAmountFromCreditMemo || 0) + (creditMemoItem.totalRefundIssuedAmount || 0)).toFixed(2));

              creditMemoItem.dueAmountForSelectedCM = parseFloat(((creditMemoItem.agreedRefundAmount || 0) - (creditMemoItem.totalRefundIssuedAmount || 0)).toFixed(2));
              // live due refund payment >> when user change pay amount it will be updated instantly
              creditMemoItem.liveDueAmountForSelectedCM = angular.copy(creditMemoItem.dueAmountForSelectedCM);

              creditMemoItem.isSelected = creditMemoItem.paymentDetMstID ? true : false;

              creditMemoItem.pastRefundIssuedAmount = parseFloat(((creditMemoItem.totalRefundIssuedAmount || 0) - (creditMemoItem.paymentAmountForSelectedCM || 0)).toFixed(2));
              creditMemoItem.pastRefundAmtExcludeCurrTransForSelectedCM = parseFloat(((creditMemoItem.totalRefundIssuedAmount || 0) - (creditMemoItem.paymentAmountForSelectedCM || 0)).toFixed(2));

              creditMemoItem.maxLimitOfDueAmountToPay = parseFloat((creditMemoItem.paymentDetMstID ? parseFloat(((creditMemoItem.agreedRefundAmount || 0) - (creditMemoItem.pastRefundIssuedAmount || 0)).toFixed(2)) : (creditMemoItem.dueAmountForSelectedCM || 0)).toFixed(2));
            });
            setSumOfAmountForCustCreditMemoPaymentList();
            setSumOfCurrCMAmountForCustCMList();
            const checkAnyNotSelectedPay = _.some(vm.custCreditMemoPaymentList, (data) => !data.isSelected);
            vm.isAllSelectFromCustCMList = checkAnyNotSelectedPay ? false : true;
            // set selected credit memo if external search/set call
            if (!vm.custRefundMstID && vm.paramSearchObj && vm.paramSearchObj.CMID) {
              const searchCMDet = _.find(vm.custCreditMemoPaymentList, (CMitem) => CMitem.custCreditMemoMstID === vm.paramSearchObj.CMID);
              if (searchCMDet) {
                searchCMDet.isSelected = true;
                vm.selectCustSingleCM(searchCMDet);
              }
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      // to get customer Refund master data
      const retrieveCustRefundMstData = () => CustomerRefundFactory.getCustRefundMstData().query({
        custRefundMstID: vm.custRefundMstID,
        refPaymentMode: vm.receivableRefPaymentModeConst.Refund.code
      }).$promise.then((resp) => {
        if (resp && resp.data && resp.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          vm.custRefundModel = resp.data.custRefundMstData;
          vm.custRefundModel.isPaymentVoided = vm.custRefundModel.isPaymentVoided ? true : false;
          vm.custRefundModel.totalRefundAmount = resp.data.custRefundMstData.paymentAmount;
          vm.totalRefundAmountOldValue = parseFloat(((vm.custRefundModel.totalRefundAmount || 0) - (vm.custRefundModel.offsetAmount || 0)).toFixed(2));
          if (vm.custRefundModel.paymentDate) {
            vm.custRefundModel.paymentDate = BaseService.getUIFormatedDate(vm.custRefundModel.paymentDate, vm.DefaultDateFormat);
          }
          //if (vm.custRefundModel.billToAddress) {
          //  vm.billToAddressDisplay = formatAddressToDisplay(vm.custRefundModel.billToAddress);
          //}
          vm.isCustRefundLocked = vm.custRefundModel.lockStatus === vm.CustPaymentLockStatusConst.Locked ? true : false;
          vm.custRefundModel.isMarkAsPaid = vm.custRefundModel.isMarkAsPaid ? true : false;
          vm.isSubStatusDraft = (vm.custRefundModel.subStatus === TRANSACTION.CustomerRefundSubStatusIDDet.Draft.code);
          vm.isSubStatusPublished = (vm.custRefundModel.subStatus === TRANSACTION.CustomerRefundSubStatusIDDet.Published.code);
          if ($scope.mainParentCtrlScope && vm.custRefundModel) {
            $scope.mainParentCtrlScope.custRefundMstDetParent = vm.custRefundModel;
            if (vm.isCustRefundLocked && $scope.mainParentCtrlScope.custRefundMstDetParent.lockedByUserName) {
              const userNameWithSplit = vm.custRefundModel.lockedByUserName.split(' ');
              $scope.mainParentCtrlScope.custRefundMstDetParent.lockedByUserFullName = stringFormat(CORE.GENERIC_DATA_FORMAT.EmployeeManager, vm.custRefundModel.lockedByUserInitialName, userNameWithSplit[0], userNameWithSplit[1]);
            }
            $scope.mainParentCtrlScope.custRefundMstDetParent.isCustRefundLocked = vm.isCustRefundLocked;
          }
          oldRefundPaymentCheckNum = vm.custRefundModel.paymentNumber;
          oldBankAccountNo = vm.custRefundModel.bankAccountNo;
          setDetailsForMainParentForm();
          vm.isNotAllowedToChgMajorInfo = vm.isCustRefundLocked || vm.custRefundModel.isPaymentVoided || vm.isPrintCheckAction || (vm.custRefundModel.status === TRANSACTION.CustomerRefundStatusID.Published);
          vm.isNotAllowedChgPMTNumWithSubStatus = ((vm.custRefundModel.subStatus === TRANSACTION.CustomerRefundSubStatusIDDet.ReadytoPrintCheck.code) || (vm.custRefundModel.subStatus === TRANSACTION.CustomerRefundSubStatusIDDet.Refunded.code)) || (vm.custRefundModel.subStatus === TRANSACTION.CustomerRefundSubStatusIDDet.Published.code && !vm.isCheckTypePaymentMtdSelected);
          setAddrContActionBtn();
        }
        return $q.resolve(resp);
      }).catch((error) => BaseService.getErrorLog(error));

      /* get customer all billing address list */
      //const getCustomerAddress = (custID) => CustomerFactory.getCustomerAddress().query({
      //  id: custID || vm.autoCompleteCustomer.keyColumnId
      //}).$promise.then((custAddrResp) => {
      const getCustomerAddress = (custID) => CustomerFactory.customerAddressList().query({
        customerId: custID || vm.autoCompleteCustomer.keyColumnId,
        addressType: CORE.AddressType.BillingAddress,
        refTableName: CORE.TABLE_NAME.MFG_CODE_MST
      }).$promise.then((custAddrResp) => {
        if (custAddrResp && custAddrResp.data) {
          //const custAllAddresses = custAddrResp.data;
          //vm.billingAddressList = _.filter(custAllAddresses, (item) => item.addressType === CORE.AddressType.BillingAddress);
          vm.billingAddressList = custAddrResp.data;
          if (!vm.custRefundMstID) {
            const defaultBillToAddrDet = _.find(vm.billingAddressList, (addrItem) => addrItem.isDefault);
            if (defaultBillToAddrDet) {
              setBillToAddrContDetForApplied(defaultBillToAddrDet);
              const defaultContPersonId = defaultBillToAddrDet.contactPerson ? defaultBillToAddrDet.contactPerson.personId : null;
              getAddressForSupplierPayment(defaultBillToAddrDet.id, defaultContPersonId);
            }
          } else {
            const selectedBillToAddrDet = _.find(vm.billingAddressList, (addrItem) => addrItem.id === vm.custRefundModel.billToAddressID);
            if (selectedBillToAddrDet) {
              vm.viewCustAddrOtherDet.alreadySelectedAddressID = selectedBillToAddrDet.id;
              vm.billingAddress = selectedBillToAddrDet;
            }
            setAddrContActionBtn();
          }
        }
        vm.viewCustAddrOtherDet.showAddressEmptyState = vm.billingAddressList && vm.billingAddressList.length === 0 ? true : false;
        return $q.resolve(custAddrResp);
      }).catch((error) => BaseService.getErrorLog(error));

      // after select/add/update address, set details in model
      const setBillToAddrContDetForApplied = (newApplyAddrDet) => {
        vm.custRefundModel.billToName = newApplyAddrDet.companyName;
        vm.custRefundModel.billToAddressID = newApplyAddrDet.id;
        vm.viewCustAddrOtherDet.alreadySelectedAddressID = newApplyAddrDet.id;
        if (newApplyAddrDet.contactPerson) {
          vm.custRefundModel.billToContactPersonID = newApplyAddrDet.contactPerson.personId;
          vm.custRefundModel.billToContactPerson = BaseService.generateContactPersonDetFormat(newApplyAddrDet.contactPerson);
          vm.selectedContactPerson = angular.copy(newApplyAddrDet.contactPerson);
          vm.viewCustAddrOtherDet.alreadySelectedPersonId = vm.selectedContactPerson.personId;
        } else {
          vm.custRefundModel.billToContactPersonID = null;
          vm.custRefundModel.billToContactPerson = null;
          vm.selectedContactPerson = null;
          vm.viewCustAddrOtherDet.alreadySelectedPersonId = null;
        }
        vm.billingAddress = newApplyAddrDet;
        setAddrContActionBtn();
      };


      // get customer contact person list
      const getCustomerContactPersonList = (custID) => CustomerFactory.getCustomerContactPersons().query({
        refTransID: custID || vm.autoCompleteCustomer.keyColumnId,
        refTableName: CORE.TABLE_NAME.MFG_CODE_MST
      }).$promise.then((contactperson) => {
        if (contactperson && contactperson.data) {
          vm.contactPersonList = contactperson.data;
          if (vm.custRefundMstID && vm.custRefundModel.billToContactPersonID) {
            const selectedContPersonDet = _.find(vm.contactPersonList, (contItem) => contItem.personId === vm.custRefundModel.billToContactPersonID);
            if (selectedContPersonDet) {
              vm.selectedContactPerson = selectedContPersonDet;
              vm.viewCustAddrOtherDet.alreadySelectedPersonId = vm.selectedContactPerson.personId;
            }
          }
        }
        setAddrContActionBtn();
        return $q.resolve(contactperson);
      }).catch((error) => BaseService.getErrorLog(error));

      // set address/contact action button details
      const setAddrContActionBtn = () => {
        if (vm.isNotAllowedToChgMajorInfo) {
          vm.custAddrViewActionBtnDet.AddNew.isDisable = vm.custAddrViewActionBtnDet.Update.isDisable = vm.custAddrViewActionBtnDet.ApplyNew.isDisable = vm.custAddrViewActionBtnDet.Delete.isDisable = true;
          vm.contPersonViewActionBtnDet.AddNew.isDisable = vm.contPersonViewActionBtnDet.Update.isDisable = vm.contPersonViewActionBtnDet.ApplyNew.isDisable = vm.contPersonViewActionBtnDet.Delete.isDisable = true;
        } else {
          vm.custAddrViewActionBtnDet.AddNew.isDisable = vm.custAddrViewActionBtnDet.ApplyNew.isDisable = false;
          vm.contPersonViewActionBtnDet.AddNew.isDisable = vm.contPersonViewActionBtnDet.ApplyNew.isDisable = false;

          vm.custAddrViewActionBtnDet.Update.isDisable = vm.custAddrViewActionBtnDet.Delete.isDisable = vm.billingAddress ? false : true;
          vm.contPersonViewActionBtnDet.Update.isDisable = vm.contPersonViewActionBtnDet.Delete.isDisable = vm.selectedContactPerson ? false : true;

          vm.custAddrViewActionBtnDet.Delete.isVisible = vm.billingAddress ? true : false;
          vm.contPersonViewActionBtnDet.Delete.isVisible = vm.selectedContactPerson ? true : false;
        }
      };

      const init = () => {
        const promises = [getTransModeList(), getCustomerList(), getPaymentMethodType(), getBankList()];
        if (vm.custRefundMstID) {
          promises.push(retrieveCustRefundMstData());
        }
        vm.cgBusyLoading = $q.all(promises).then(() => {
          initAutoComplete();
          // set Check type payment method
          if (!vm.custRefundMstID) {
            const CheckGCDet = _.find(vm.paymentMethodTypeList, (item) => item.gencCategoryCode === TRANSACTION.PayablePaymentMethodGenericCategory.Check.gencCategoryCode);
            vm.autoCompletePaymentMethodType.keyColumnId = CheckGCDet ? CheckGCDet.gencCategoryID : null;
            // set search data which get from state parameters query string
            if (vm.paramSearchObj && vm.paramSearchObj.transModeID && vm.paramSearchObj.custID) {
              vm.autoCompleteTransMode.keyColumnId = vm.paramSearchObj.transModeID;
              vm.autoCompleteCustomer.keyColumnId = vm.paramSearchObj.custID;
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };
      init();

      // to set sum count for invoice payment table.
      const setSumOfAmountForCustPaymentList = () => {
        vm.sumOfOriginalPayAmountForSelectedPayment = parseFloat((_.sumBy(vm.customerPaymentList, (o) => o.totalPaymentAmount) || 0).toFixed(2));
        vm.sumOfOpenCreditAmountForSelectedPayment = parseFloat((_.sumBy(vm.customerPaymentList, (o) => o.openAmountForSelectedPayment) || 0).toFixed(2));
        vm.sumOfLiveDueAmountForSelectedPayment = parseFloat((_.sumBy(vm.customerPaymentList, (o) => o.liveDueAmountForSelectedPayment) || 0).toFixed(2));
        vm.sumOfTotalRefundIssuedAmount = parseFloat((_.sumBy(vm.customerPaymentList, (o) => o.totalRefundIssuedAmount) || 0).toFixed(2));
        vm.sumOfAgreedRefundAmount = parseFloat((_.sumBy(vm.customerPaymentList, (o) => o.agreedRefundAmount) || 0).toFixed(2));
      };

      // sum of paying refund amount
      const setSumOfCurrPayAmountForCustPaymentList = () => {
        vm.sumOfPaymentAmountForSelectedPayment = parseFloat((_.sumBy(vm.customerPaymentList, (o) => o.paymentAmountForSelectedPayment) || 0).toFixed(2));
        const selectedPayList = _.filter(vm.customerPaymentList, (payItem) => payItem.isSelected);
        vm.custRefundModel.totalRefundAmount = parseFloat(((vm.sumOfPaymentAmountForSelectedPayment || 0) + (vm.custRefundModel.offsetAmount || 0)).toFixed(2));
        vm.totDueAmountOfSelectedPayment = parseFloat((_.sumBy(selectedPayList, (o) => o.paymentDetMstID ? (parseFloat(((o.dueAmountForSelectedPayment || 0) + (o.invPaidAmtFromCurrPaymentDet || 0)).toFixed(2))) : (o.dueAmountForSelectedPayment || 0)).toFixed(2))
        ) || 0;
        /* below is total paying refund amount of different selected payment */
        vm.totPayAmountOfSelectedPay = parseFloat((_.sumBy(selectedPayList, (o) => o.paymentAmountForSelectedPayment) || 0).toFixed(2));
        vm.totalPaySelectedCount = (_.countBy(vm.customerPaymentList, (data) => data.isSelected).true) || 0;
      };

      // clear all sum calculation
      const clearSumOfAmountForCustPaymentList = () => {
        vm.customerPaymentList = [];
        vm.paymentAmountForSelectedCM = 0;
        vm.paymentAmountForSelectedPayment = 0;
        vm.sumOfOriginalPayAmountForSelectedPayment = 0;
        vm.sumOfOriginalPayAmountForSelectedCM = 0;
        vm.sumOfOpenCreditAmountForSelectedPayment = 0;
        vm.sumOfLiveDueAmountForSelectedPayment = 0;
        vm.sumOfAgreedRefundAmount = 0;
        vm.sumOfTotalRefundIssuedAmount = 0;
        vm.totDueAmountOfSelectedPayment = 0;
        vm.totPayAmountOfSelectedPay = 0;
        vm.totalPaySelectedCount = 0;
        vm.sumOfPaymentAmountForSelectedPayment = 0;
        vm.totalRefundAmountOldValue = 0;
      };

      // called when we select any Payment item to pay from table list
      vm.selectCustSinglePayment = (payItem) => {
        const totPayAmount = parseFloat((angular.copy(payItem.totalAgreedRefundAmt) || 0).toFixed(2));
        if (totPayAmount && totPayAmount > 0 && payItem.isSelected) {
          if (parseFloat((payItem.dueAmountForSelectedPayment || 0).toFixed(2)) <= totPayAmount) {
            const refAmount = parseFloat((payItem.agreedRefundAmount || 0) - (payItem.totalRefundIssuedAmount || 0).toFixed(2));
            vm.selectSinglePayWithForwardingAmt(payItem, refAmount);
          } else {
            const partialDueAmount = parseFloat((totPayAmount - (vm.sumOfPaymentAmountForSelectedPayment || 0)).toFixed(2));
            vm.selectSinglePayWithForwardingAmt(payItem, partialDueAmount);
          }
        } else {
          vm.isAllSelectFromCustPaymentList = false;
          payItem.paymentAmountForSelectedPayment = 0;
          payItem.comment = null;
        }
        payItem.liveDueAmountForSelectedPayment = (parseFloat(payItem.agreedRefundAmount.toFixed(2))) - (parseFloat((payItem.pastRefundAmtExcludeCurrTransForSelectedPayment || 0).toFixed(2)) + parseFloat((payItem.paymentAmountForSelectedPayment || 0).toFixed(2)));
        setSumOfAmountForCustPaymentList();
        setSumOfCurrPayAmountForCustPaymentList();
      };

      // called when we select any CM item to pay from table list
      vm.selectCustSingleCM = (creditMemoItem) => {
        const totAgreedRefundAmt = parseFloat((angular.copy(creditMemoItem.agreedRefundAmount) || 0).toFixed(2));
        if (totAgreedRefundAmt && totAgreedRefundAmt > 0 && creditMemoItem.isSelected) {
          if (parseFloat((creditMemoItem.dueAmountForSelectedCM || 0).toFixed(2)) <= totAgreedRefundAmt) {
            vm.selectSingleCMWithForwardingAmt(creditMemoItem, creditMemoItem.maxLimitOfDueAmountToPay);
          } else {
            const partialDueAmount = parseFloat((totAgreedRefundAmt - (vm.sumOfPaymentAmountForSelectedCM || 0)).toFixed(2));
            vm.selectSingleCMWithForwardingAmt(creditMemoItem, partialDueAmount);
          }
        } else {
          vm.isAllSelectFromCustCMList = false;
          creditMemoItem.paymentAmountForSelectedCM = 0;
          creditMemoItem.comment = null;
        }
        creditMemoItem.liveDueAmountForSelectedCM = (parseFloat(creditMemoItem.agreedRefundAmount.toFixed(2))) - (parseFloat((creditMemoItem.pastRefundAmtExcludeCurrTransForSelectedCM || 0).toFixed(2)) + parseFloat((creditMemoItem.paymentAmountForSelectedCM || 0).toFixed(2)));
        setSumOfAmountForCustCreditMemoPaymentList();
        setSumOfCurrCMAmountForCustCMList();
      };

      // called when we select/deselected all check box
      vm.selectCustAllPayment = () => {
        //reset all selected first
        const checkAnyPaySelected = _.some(vm.customerPaymentList, (data) => data.isSelected);
        if (checkAnyPaySelected && vm.isAllSelectFromCustPaymentList) {
          vm.isAllSelectFromCustPaymentList = false;
          _.each(vm.customerPaymentList, (data) => {
            if (!data.isLockedTrans) {  // if locked then not allowed to change
              data.isSelected = false;
              data.paymentAmountForSelectedPayment = 0;
              data.comment = null;
              setSumOfAmountForCustPaymentList();
              setSumOfCurrPayAmountForCustPaymentList();
            }
          });
          vm.isAllSelectFromCustPaymentList = true;
        }

        // apply Selected payment
        //let totPayAmount = parseFloat((angular.copy(vm.sumOfAgreedRefundAmount) || 0).toFixed(2));
        _.each(vm.customerPaymentList, (data) => {
          if (!data.isLockedTrans) {   // if locked then not allowed to change
            data.isSelected = vm.isAllSelectFromCustPaymentList;
            if (vm.isAllSelectFromCustPaymentList) {
              if (data.paymentDetMstID) {
                // in edit case > reset original paid amount (paid from current pay det)
                data.paymentAmountForSelectedPayment = parseFloat(angular.copy(data.paymentAmountForSelectedPaymentCopy).toFixed(2));
                //totPayAmount = parseFloat((totPayAmount - data.paymentAmountForSelectedPayment).toFixed(2));
              } else {
                data.paymentAmountForSelectedPayment = parseFloat(angular.copy(data.dueAmountForSelectedPayment).toFixed(2));
              }
            } else {
              data.paymentAmountForSelectedPayment = 0;
              data.comment = null;
            }
            data.liveDueAmountForSelectedPayment = (parseFloat(data.agreedRefundAmount.toFixed(2))) - (parseFloat((data.pastRefundAmtExcludeCurrTransForSelectedPayment || 0).toFixed(2)) + parseFloat((data.paymentAmountForSelectedPayment || 0).toFixed(2)));
          }
        });
        setSumOfAmountForCustPaymentList();
        setSumOfCurrPayAmountForCustPaymentList();
      };

      vm.selectCustAllCM = () => {
        //reset all selected first (other than locked transaction)
        const checkAnyPaySelected = _.some(vm.custCreditMemoPaymentList, (data) => data.isSelected);
        if (checkAnyPaySelected && vm.isAllSelectFromCustCMList) {
          vm.isAllSelectFromCustCMList = false;
          _.each(vm.custCreditMemoPaymentList, (data) => {
            if (!data.isLocked) {   // if locked then not allowed to change
              data.isSelected = false;
              data.paymentAmountForSelectedCM = 0;
              data.comment = null;
              setSumOfAmountForCustCreditMemoPaymentList();
              setSumOfCurrCMAmountForCustCMList();
            }
          });
          vm.isAllSelectFromCustCMList = true;
        }

        // apply Selected payment Refund
        //let totPayAmount = parseFloat((angular.copy(vm.sumOfAgreedRefundAmount) || 0).toFixed(2));
        _.each(vm.custCreditMemoPaymentList, (data) => {
          if (!data.isLocked) {    // if locked then not allowed to change
            data.isSelected = vm.isAllSelectFromCustCMList;
            if (vm.isAllSelectFromCustCMList) {
              if (data.paymentDetMstID) {
                // in edit case > reset original paid amount (paid from current CM detail)
                data.paymentAmountForSelectedCM = parseFloat(angular.copy(data.paymentAmountForSelectedCMCopy).toFixed(2));
                //totPayAmount = parseFloat((totPayAmount - data.totalRefundIssuedAmount).toFixed(2));
              } else {
                // in add new refund case > reset due refund amount
                data.paymentAmountForSelectedCM = parseFloat(data.dueAmountForSelectedCM.toFixed(2));
              }
            } else {
              data.paymentAmountForSelectedCM = 0;
              data.comment = null;
            }
            data.liveDueAmountForSelectedCM = (parseFloat(data.agreedRefundAmount.toFixed(2))) - (parseFloat((data.pastRefundAmtExcludeCurrTransForSelectedCM || 0).toFixed(2)) + parseFloat((data.paymentAmountForSelectedCM || 0).toFixed(2)));
          }
        });
        setSumOfAmountForCustCreditMemoPaymentList();
        setSumOfCurrCMAmountForCustCMList();
      };

      /* called on change of main payment amount change */
      vm.mainRefundAmountChange = () => {
        if (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayablePayRefund.id && vm.customerPaymentList && vm.customerPaymentList.length > 0) {
          setSumOfAmountForCustPaymentList();
          setSumOfCurrPayAmountForCustPaymentList();
        }
        else if (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayableCMRefund.id && vm.custCreditMemoPaymentList && vm.custCreditMemoPaymentList.length > 0) {
          setSumOfAmountForCustCreditMemoPaymentList();
          setSumOfCurrCMAmountForCustCMList();
        } else if (!(vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayableCMRefund.id || vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayablePayRefund.id)) {
          vm.custRefundModel.totalRefundAmount = parseFloat(((vm.totalRefundAmountOldValue || 0) + (vm.custRefundModel.offsetAmount || 0)).toFixed(2));
        }
      };

      vm.refundAmountChange = () => {
        if (vm.custRefundModel.totalRefundAmount !== null && vm.custRefundModel.totalRefundAmount !== undefined && vm.custRefundModel.totalRefundAmount > 0
          && !(vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayablePayRefund.id || vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayableCMRefund.id)) {
          vm.custRefundModel.offsetAmount = null;
          vm.totalRefundAmountOldValue = parseFloat((vm.custRefundModel.totalRefundAmount || 0).toFixed(2));
        }
      };

      /* called on change of current payment amount change from  payment list */
      vm.paymentAmountChangeForSelectedPayment = (payItem) => {
        if ((payItem.paymentAmountForSelectedPayment === null) || (payItem.paymentAmountForSelectedPayment === undefined)) {
          if ($scope.currActiveForm['payRefDetForm_' + payItem.paymentMstID]['paymentAmountForSelectedPayment_' + payItem.paymentMstID] && $scope.currActiveForm['payRefDetForm_' + payItem.paymentMstID]['paymentAmountForSelectedPayment_' + payItem.paymentMstID].$viewValue && $scope.currActiveForm['payRefDetForm_' + payItem.paymentMstID]['paymentAmountForSelectedPayment_' + payItem.paymentMstID].$viewValue > 0 && $scope.currActiveForm['payRefDetForm_' + payItem.paymentMstID]['paymentAmountForSelectedPayment_' + payItem.paymentMstID].$viewValue > payItem.totalMaxLimitOfRefundAmt) {
            payItem.paymentAmountForSelectedPayment = 0;
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_INV_PAY_ITEM_MAX_ALLOWED_AMT);
            messageContent.message = stringFormat(messageContent.message, 'Refund', $scope.currActiveForm['payRefDetForm_' + payItem.paymentMstID]['paymentAmountForSelectedPayment_' + payItem.paymentMstID].$viewValue, payItem.maxLimitOfDueAmountToPay);
            const model = {
              messageContent: messageContent
            };
            DialogFactory.messageAlertDialog(model).then(() => {
              setFocus('paymentAmountForSelectedPayment_' + payItem.paymentMstID);
            }).catch((error) => {
              BaseService.getErrorLog(error);
            });
          } else {
            payItem.paymentAmountForSelectedPayment = 0;
          }
        }

        //const sumOfPaymentAmountForSelectedPay = parseFloat(((_.sumBy(vm.customerPaymentList, (o) => o.maxLimitOfDueAmountToPay) || 0)).toFixed(2));
        // if selected payment amount is more than due agreed refund amount than display error
        const dueRefundAmount = parseFloat(((payItem.agreedRefundAmount || 0) - (payItem.pastRefundIssuedAmount || 0))).toFixed(2);
        if ((dueRefundAmount || 0) < (payItem.paymentAmountForSelectedPayment || 0)) {
          const msgContForPayAmtNotMore = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.PAY_AMT_NOT_MORE_THAN_AGREEED_REF_AMT);
          msgContForPayAmtNotMore.message = stringFormat(msgContForPayAmtNotMore.message, payItem.paymentAmountForSelectedPayment, payItem.maxLimitOfDueAmountToPay);
          const model = {
            messageContent: msgContForPayAmtNotMore
          };
          return DialogFactory.messageAlertDialog(model).then(() => {
            setFocus('paymentAmountForSelectedPayment_' + payItem.paymentMstID);
            payItem.paymentAmountForSelectedPayment = 0;
          }).catch((error) => {
            BaseService.getErrorLog(error);
          });
        }

        payItem.liveDueAmountForSelectedPayment = (parseFloat(payItem.agreedRefundAmount.toFixed(2))) - (parseFloat((payItem.pastRefundAmtExcludeCurrTransForSelectedPayment || 0).toFixed(2)) + parseFloat((payItem.paymentAmountForSelectedPayment || 0).toFixed(2)));
        setSumOfAmountForCustPaymentList();
        setSumOfCurrPayAmountForCustPaymentList();
      };

      //change refund Amount for selected Credit memo
      vm.paymentAmountChangeForSelectedCM = (payItem) => {
        if ((payItem.paymentAmountForSelectedCM === null) || (payItem.paymentAmountForSelectedCM === undefined)) {
          if ($scope.currActiveForm['cmRefDetForm_' + payItem.custCreditMemoMstID]['paymentAmountForSelectedCM_' + payItem.custCreditMemoMstID] && $scope.currActiveForm['cmRefDetForm_' + payItem.custCreditMemoMstID]['paymentAmountForSelectedCM_' + payItem.custCreditMemoMstID].$viewValue && $scope.currActiveForm['cmRefDetForm_' + payItem.custCreditMemoMstID]['paymentAmountForSelectedCM_' + payItem.custCreditMemoMstID].$viewValue > 0 && $scope.currActiveForm['cmRefDetForm_' + payItem.custCreditMemoMstID]['paymentAmountForSelectedCM_' + payItem.custCreditMemoMstID].$viewValue > payItem.maxLimitOfDueAmountToPay) {
            payItem.paymentAmountForSelectedCM = 0;
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_INV_PAY_ITEM_MAX_ALLOWED_AMT);
            messageContent.message = stringFormat(messageContent.message, 'Refund', $scope.currActiveForm['cmRefDetForm_' + payItem.custCreditMemoMstID]['paymentAmountForSelectedCM_' + payItem.custCreditMemoMstID].$viewValue, payItem.maxLimitOfDueAmountToPay);
            const model = {
              messageContent: messageContent
            };
            DialogFactory.messageAlertDialog(model).then(() => {
              setFocus('paymentAmountForSelectedCM_' + payItem.custCreditMemoMstID);
            }).catch((error) => {
              BaseService.getErrorLog(error);
            });
          } else {
            payItem.paymentAmountForSelectedCM = 0;
          }
          //return;   // all invalid
        }

        // if selected refund amount is more than due agreed refund payment amount than display error
        const dueRefundAmount = parseFloat(((payItem.agreedRefundAmount || 0) - (payItem.pastRefundIssuedAmount || 0))).toFixed(2);
        if ((dueRefundAmount || 0) < (payItem.paymentAmountForSelectedCM || 0)) {
          const msgContForPayAmtNotMore = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.PAY_AMT_NOT_MORE_THAN_AGREEED_REF_AMT);
          msgContForPayAmtNotMore.message = stringFormat(msgContForPayAmtNotMore.message, payItem.paymentAmountForSelectedCM, payItem.maxLimitOfDueAmountToPay);
          const model = {
            messageContent: msgContForPayAmtNotMore
          };
          return DialogFactory.messageAlertDialog(model).then(() => {
            setFocus('paymentAmountForSelectedCM_' + payItem.custCreditMemoMstID);
            payItem.paymentAmountForSelectedCM = 0;
          }).catch((error) => {
            BaseService.getErrorLog(error);
          });
        }

        payItem.liveDueAmountForSelectedCM = (parseFloat(payItem.agreedRefundAmount.toFixed(2))) - (parseFloat((payItem.pastRefundAmtExcludeCurrTransForSelectedCM || 0).toFixed(2)) + parseFloat((payItem.paymentAmountForSelectedCM || 0).toFixed(2)));
        setSumOfAmountForCustCreditMemoPaymentList();
        setSumOfCurrCMAmountForCustCMList();
      };


      // to set sum count for credit memo table payment
      const setSumOfAmountForCustCreditMemoPaymentList = () => {
        vm.sumOfOriginalCreditMemoAmount = parseFloat((_.sumBy(vm.custCreditMemoPaymentList, (o) => o.originalCreditMemoAmount) || 0).toFixed(2));
        vm.sumOfOpenCreditMemoAmount = parseFloat((_.sumBy(vm.custCreditMemoPaymentList, (o) => o.openCreditMemoAmount) || 0).toFixed(2));
        vm.sumOfTotalRefundIssuedAmount = parseFloat((_.sumBy(vm.custCreditMemoPaymentList, (o) => o.totalRefundIssuedAmount) || 0).toFixed(2));
        vm.sumOfAgreedRefundAmount = parseFloat((_.sumBy(vm.custCreditMemoPaymentList, (o) => o.agreedRefundAmount) || 0).toFixed(2));
      };
      const setSumOfCurrCMAmountForCustCMList = () => {
        vm.sumOfPaymentAmountForSelectedCM = parseFloat((_.sumBy(vm.custCreditMemoPaymentList, (o) => o.paymentAmountForSelectedCM) || 0).toFixed(2));
        const selectedCMList = _.filter(vm.custCreditMemoPaymentList, (payItem) => payItem.isSelected);
        vm.custRefundModel.totalRefundAmount = parseFloat(((vm.sumOfPaymentAmountForSelectedCM || 0) + (vm.custRefundModel.offsetAmount || 0)).toFixed(2));
        vm.totDueAmountOfSelectedCM = parseFloat((_.sumBy(selectedCMList, (o) => o.paymentDetMstID ? (parseFloat(((o.dueAmountForSelectedCM || 0) + (o.pastPaidAmountFromCreditMemo || 0)).toFixed(2))) : (o.dueAmountForSelectedCM || 0)).toFixed(2))
        ) || 0;
        /* below is total paying amount of different selected CM */
        vm.totPayAmountOfSelectedCM = parseFloat((_.sumBy(selectedCMList, (o) => o.paymentAmountForSelectedCM) || 0).toFixed(2));
        vm.totalCMSelectedCount = (_.countBy(vm.custCreditMemoPaymentList, (data) => data.isSelected).true) || 0;
      };

      // create/update customer Refund details
      $scope.saveCustomerRefund = (newRefundSubStatus) => {
        vm.addUpdateRefundSuccessMsg = null;
        if (vm.custRefundModel.isPaymentVoided || vm.isCustRefundLocked) {
          return;
        }
        $scope.mainParentCtrlScope.saveBtnDisableFlag = true;
        if ((vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayablePayRefund.id && vm.customerPaymentList.length === 0) || (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayableCMRefund.id && vm.custCreditMemoPaymentList.length === 0)) {
          const msgContentForNoListCMPayment = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.NO_CUST_PAY_CM_MARKED_REFUND);
          if (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayablePayRefund.id && vm.customerPaymentList.length === 0) {
            msgContentForNoListCMPayment.message = stringFormat(msgContentForNoListCMPayment.message, 'payment');
          } else if (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayableCMRefund.id && vm.custCreditMemoPaymentList.length === 0) {
            msgContentForNoListCMPayment.message = stringFormat(msgContentForNoListCMPayment.message, 'credit memo');
          }
          const model = {
            messageContent: msgContentForNoListCMPayment
          };
          return DialogFactory.messageAlertDialog(model).then(() => {
            $scope.mainParentCtrlScope.saveBtnDisableFlag = false;
            return;
          }).catch((error) => {
            $scope.mainParentCtrlScope.saveBtnDisableFlag = false;
            BaseService.getErrorLog(error);
          });
        }
        //  at least one Payment or CM must be selected(added)
        let isAnySelected = {};
        if (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayablePayRefund.id) {
          isAnySelected = _.some(vm.customerPaymentList, (payItem) => payItem.isSelected && payItem.agreedRefundAmount > 0);
        } else if (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayableCMRefund.id) {
          isAnySelected = _.some(vm.custCreditMemoPaymentList, (creditMemoItem) => creditMemoItem.isSelected && creditMemoItem.agreedRefundAmount > 0);
        }
        if (!isAnySelected) {
          const msgContentForSelectOneItem = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
          if (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayablePayRefund.id && vm.customerPaymentList && vm.customerPaymentList.length > 0) {
            msgContentForSelectOneItem.message = stringFormat(msgContentForSelectOneItem.message, 'payment for refund');
          } else if (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayableCMRefund.id && vm.custCreditMemoPaymentList && vm.custCreditMemoPaymentList.length > 0) {
            msgContentForSelectOneItem.message = stringFormat(msgContentForSelectOneItem.message, 'credit memo for refund');
          }
          const model = {
            messageContent: msgContentForSelectOneItem
          };
          return DialogFactory.messageAlertDialog(model).then(() => {
            $scope.mainParentCtrlScope.saveBtnDisableFlag = false;
            if (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayablePayRefund.id && vm.customerPaymentList && vm.customerPaymentList.length > 0) {
              setFocus('isSelected_' + vm.customerPaymentList[0].paymentMstID);
              return;
            } else if (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayableCMRefund.id && vm.custCreditMemoPaymentList && vm.custCreditMemoPaymentList.length > 0) {
              setFocus('isSelected_' + vm.custCreditMemoPaymentList[0].custCreditMemoMstID);
              return;
            }
          }).catch((error) => {
            $scope.mainParentCtrlScope.saveBtnDisableFlag = false;
            BaseService.getErrorLog(error);
          });
        }
        if (BaseService.focusRequiredField($scope.currActiveForm)) {
          $scope.mainParentCtrlScope.saveBtnDisableFlag = false;
          return;
        }
        if (vm.custRefundModel.paymentNumber && (vm.custRefundModel.paymentNumber !== oldRefundPaymentCheckNum || vm.custRefundModel.bankAccountNo !== oldBankAccountNo)) {
          checkDuplicatePaymentNumber(newRefundSubStatus);
        } else {
          saveCustomerRefundDetails(newRefundSubStatus, null);
        }
      };

      /* method to check duplicate payment/check number */
      const checkDuplicatePaymentNumber = (newRefundSubStatus) => {
        vm.cgBusyLoading = CustomerRefundFactory.checkDuplicateRefundPaymentCheckNum().save({
          custRefundMstID: vm.custRefundModel.id || null,
          paymentNumber: vm.custRefundModel.paymentNumber,
          bankAccountNo: vm.custRefundModel.bankAccountNo
        }).$promise.then((res) => {
          vm.cgBusyLoading = false;
          //oldRefundPaymentCheckNum = angular.copy(vm.custRefundModel.paymentNumber);
          if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicatePaymentNumber) {
            $scope.mainParentCtrlScope.saveBtnDisableFlag = false;
            const selectedCustDet = _.find(vm.customerList, (custItem) => custItem.id === vm.autoCompleteCustomer.keyColumnId);

            const refundData = {
              custRefundMstID: vm.custRefundModel.id || null,
              paymentNumber: vm.custRefundModel.paymentNumber,
              bankAccountNo: vm.custRefundModel.bankAccountNo,
              isCheckTypePaymentMtdSelected: vm.isCheckTypePaymentMtdSelected,
              mfgFullName: selectedCustDet ? selectedCustDet.mfgFullName : null,
              mfgMstID: selectedCustDet ? selectedCustDet.id : null,
              authenticateCheckNumberDuplication: authenticateCheckNumberDuplication
            };
            const headerData = [{
              label: vm.LabelConstant.MFG.Customer,
              value: vm.custRefundModel.mfgFullName,
              displayOrder: 1,
              labelLinkFn: () => {
                BaseService.goToCustomerList();
              },
              valueLinkFn: () => {
                BaseService.goToCustomer(vm.custRefundModel.mfgcodeID);
              }
            },
            {
              label: 'Payment# or Check#',
              value: vm.custRefundModel.paymentNumber,
              displayOrder: 2
            }
            ];
            refundData.headerData = headerData;

            // open popup to display duplicate payments with same payment number
            DialogFactory.dialogService(
              TRANSACTION.CUST_REFUND_DUPLICATE_PAYMENT_NUM_POPUP_CONTROLLER,
              TRANSACTION.CUST_REFUND_DUPLICATE_PAYMENT_NUM_POPUP_VIEW,
              event,
              refundData
            ).then((resp) => {
              if (resp && resp.isVerified) {
                // if payment method is check then need to save password confirmation otherwise not
                if (vm.isCheckTypePaymentMtdSelected) {
                  saveCustomerRefundDetails(newRefundSubStatus, resp.refundPayNumVerificationDet);
                } else {
                  saveCustomerRefundDetails(newRefundSubStatus, null);
                }
              }
            }, () => {
              setFocusByName('paymentNumber');
            }, (err) => {
              $scope.mainParentCtrlScope.saveBtnDisableFlag = false;
              BaseService.getErrorLog(err);
            });
          } else {
            saveCustomerRefundDetails(newRefundSubStatus, null);
          }
        }).catch((error) => {
          $scope.mainParentCtrlScope.saveBtnDisableFlag = false;
          BaseService.getErrorLog(error);
        });
      };

      ///* verification for duplicate payment# check# */
      //const getPasswordConfmForDuplicatePaymentNum = (newRefundSubStatus) => {
      //  const selectedCustDet = _.find(vm.customerList, (custItem) => custItem.id === vm.autoCompleteCustomer.keyColumnId);
      //  const headerData = [{
      //    label: vm.LabelConstant.MFG.Customer,
      //    value: selectedCustDet ? selectedCustDet.mfgFullName : null,
      //    displayOrder: 1,
      //    labelLinkFn: () => {
      //      BaseService.goToCustomerList();
      //    },
      //    valueLinkFn: () => {
      //      BaseService.goToCustomer(selectedCustDet ? selectedCustDet.id : null);
      //    }
      //  },
      //  {
      //    label: 'Payment# or Check#',
      //    value: vm.custRefundModel.paymentNumber,
      //    displayOrder: 2,
      //    labelLinkFn: () => {
      //      BaseService.goToCustomerRefundList();
      //    },
      //    valueLinkFn: () => {
      //      BaseService.goToCustomerRefundDetail(vm.custRefundMstID);
      //    }
      //  }
      //  ];

      //  const refundPayNumVerification = {
      //    AccessRole: CORE.ROLE_ACCESS.VERIFICATION_ROLE_ACCESS,
      //    isAllowSaveDirect: false,
      //    popupTitle: 'Verification For Duplicate Payment# or Check#',
      //    confirmationType: CORE.Generic_Confirmation_Type.VERIFY_CUST_REFUND_DUPLICATE_PAYMENT_NUM,
      //    isOnlyPassword: true,
      //    createdBy: vm.loginUser.userid,
      //    updatedBy: vm.loginUser.userid,
      //    headerDisplayData: headerData,
      //    isShowHeaderData: true,
      //    refTableName: CORE.TABLE_NAME.PACKINGSLIP_INVOICE_PAYMENT,
      //    refID: vm.custRefundMstID || 0,
      //    approveFromPage: CORE.PageName.CustomerRefund,
      //    transactionType: 'Customer Refund - Verification For Duplicate Payment# or Check#'
      //  };
      //  return DialogFactory.dialogService(
      //    CORE.GENERIC_CONFIRMATION_MODAL_CONTROLLER,
      //    CORE.GENERIC_CONFIRMATION_MODAL_VIEW,
      //    event,
      //    refundPayNumVerification).then((pswConfirmationDet) => {
      //      if (pswConfirmationDet) {
      //        const refundPayNumVerificationDet = _.omit(pswConfirmationDet, ['isAllowSaveDirect', 'popupTitle', 'isShowHeaderData','headerDisplayData']);
      //        saveCustomerRefundDetails(newRefundSubStatus, refundPayNumVerificationDet);
      //      }
      //    }, () => {
      //      // cancel block
      //    }).catch((error) => BaseService.getErrorLog(error));
      //};

      // create/update customer Refund
      const saveCustomerRefundDetails = (newRefundSubStatus, refundPayNumVerificationDet) => {
        // get invalid main Refund amount
        if ((vm.custRefundModel.totalRefundAmount === null) || (vm.custRefundModel.totalRefundAmount === undefined) || (vm.custRefundModel.totalRefundAmount === '') || ((vm.custRefundModel.totalRefundAmount || 0) <= 0)) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.PLEASE_ENTER_VALID_FIELD_VALUE);
          messageContent.message = stringFormat(messageContent.message, 'Refund amount');
          const model = {
            messageContent: messageContent
          };
          return DialogFactory.messageAlertDialog(model).then(() => {
            $scope.mainParentCtrlScope.saveBtnDisableFlag = false;
            setFocusByName('totalRefundAmount');
          }).catch((error) => {
            $scope.mainParentCtrlScope.saveBtnDisableFlag = false;
            BaseService.getErrorLog(error);
          });
        }

        let invalidList = {};
        if (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayablePayRefund.id) {
          invalidList = _.filter(vm.customerPaymentList, (payItem) => ((payItem.isSelected === true) && ((payItem.paymentAmountForSelectedPayment === null) || (payItem.paymentAmountForSelectedPayment === undefined) || (payItem.paymentAmountForSelectedPayment === '') || (payItem.paymentAmountForSelectedPayment > payItem.maxLimitOfDueAmountToPay)))
          );
        } else if (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayableCMRefund.id) {
          invalidList = _.filter(vm.custCreditMemoPaymentList, (creditMemoItem) => ((creditMemoItem.isSelected === true) && ((creditMemoItem.paymentAmountForSelectedCM === null) || (creditMemoItem.paymentAmountForSelectedCM === undefined) || (creditMemoItem.paymentAmountForSelectedCM === '') || (creditMemoItem.paymentAmountForSelectedCM > creditMemoItem.maxLimitOfDueAmountToPay)))
          );
        }
        if (invalidList && invalidList.length > 0) {
          $scope.mainParentCtrlScope.saveBtnDisableFlag = false;
          return;
        }
        const custRefundObj = {
          custRefundMstID: vm.custRefundMstID,
          mfgcodeID: vm.autoCompleteCustomer.keyColumnId,
          paymentNumber: vm.custRefundModel.paymentNumber,
          paymentDate: BaseService.getAPIFormatedDate(vm.custRefundModel.paymentDate),
          paymentAmount: parseFloat(vm.custRefundModel.totalRefundAmount.toFixed(2)),  // we store selected total payment amount
          paymentType: vm.autoCompletePaymentMethodType.keyColumnId,
          accountReference: vm.custRefundModel.accountReference,
          bankAccountMasID: vm.autoCompleteBankAccountNumber.keyColumnId,
          bankAccountNo: vm.custRefundModel.bankAccountNo,
          bankName: vm.custRefundModel.bankName,
          remark: vm.custRefundModel.remark,
          isZeroPayment: false,
          depositBatchNumber: vm.custRefundModel.depositBatchNumber,
          refPaymentMode: TRANSACTION.ReceivableRefPaymentMode.Refund.code,
          refGencTransModeID: vm.autoCompleteTransMode.keyColumnId,
          offsetAmount: vm.custRefundModel.offsetAmount,
          billToName: vm.custRefundModel.billToName,
          billToAddress: vm.custRefundModel.billToAddress,
          billToAddressID: vm.custRefundModel.billToAddressID,
          billToContactPersonID: vm.custRefundModel.billToContactPersonID,
          billToContactPerson: vm.custRefundModel.billToContactPerson,
          isMarkAsPaid: vm.isCheckTypePaymentMtdSelected ? null : (vm.custRefundModel.isMarkAsPaid || false),
          subStatus: newRefundSubStatus ? newRefundSubStatus.code : vm.custRefundModel.subStatus,
          status: newRefundSubStatus ? (newRefundSubStatus.code === TRANSACTION.CustomerRefundSubStatusIDDet.Draft.code ? TRANSACTION.CustomerRefundStatusID.Draft : TRANSACTION.CustomerRefundStatusID.Published) : vm.custRefundModel.status,
          authenticationApprovedDet: refundPayNumVerificationDet || null,
          custPaymentDetList: [],
          deleteCustPaymentDetList: [],
          custCMDetList: [],
          deleteCustCMDetList: []
        };
        if (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayablePayRefund.id) {
          const custPayListOfCurrApplyPay = _.filter(vm.customerPaymentList, (payItem) => payItem.isSelected
            && ((payItem.paymentAmountForSelectedPayment > 0)));
          // loop over all selected to pay Payment and CM
          _.each(custPayListOfCurrApplyPay, (payItem) => {
            const _obj = {
              paymentDetMstID: payItem.paymentDetMstID || {},
              paymentMstID: payItem.paymentMstID,
              agreedRefundAmount: payItem.agreedRefundAmount ? parseFloat(payItem.agreedRefundAmount.toFixed(2)) : 0,
              totalRefundIssuedAmount: payItem.totalRefundIssuedAmount ? parseFloat(payItem.totalRefundIssuedAmount.toFixed(2)) : 0,
              paymentAmountForSelectedPayment: payItem.paymentAmountForSelectedPayment ? parseFloat(payItem.paymentAmountForSelectedPayment.toFixed(2)) : 0,
              comment: payItem.comment || {}
            };
            custRefundObj.custPaymentDetList.push(_obj);
          });
        }
        else if (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayableCMRefund.id) {
          const custCMListOfCurrApplyPay = _.filter(vm.custCreditMemoPaymentList, (CreditMemoItem) => CreditMemoItem.isSelected
            && ((CreditMemoItem.paymentAmountForSelectedCM > 0)));
          // loop over all selected to pay Payment and CM
          _.each(custCMListOfCurrApplyPay, (CreditMemoItem) => {
            const _obj = {
              paymentDetMstID: CreditMemoItem.paymentDetMstID || {},
              paymentMstID: CreditMemoItem.paymentMstID || {},
              custCreditMemoMstID: CreditMemoItem.custCreditMemoMstID,
              agreedRefundAmount: CreditMemoItem.agreedRefundAmount ? parseFloat(CreditMemoItem.agreedRefundAmount.toFixed(2)) : 0,
              totalRefundIssuedAmount: CreditMemoItem.totalRefundIssuedAmount ? parseFloat(CreditMemoItem.totalRefundIssuedAmount.toFixed(2)) : 0,
              paymentAmountForSelectedCM: CreditMemoItem.paymentAmountForSelectedCM ? parseFloat(CreditMemoItem.paymentAmountForSelectedCM.toFixed(2)) : 0,
              comment: CreditMemoItem.comment || {}
            };
            custRefundObj.custCMDetList.push(_obj);
          });
        }
        manageCustomerRefund(custRefundObj);
      };

      // create/update customer payment call
      const manageCustomerRefund = (custRefundObj) => {
        // call update customer payment and CM detail list
        if (vm.custRefundMstID) {
          if (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayablePayRefund.id) {
            const deleteCustPayList = _.filter(vm.customerPaymentList, (payItem) => payItem.paymentDetMstID &&
              ((!payItem.isSelected) || (payItem.isSelected && payItem.totalRefundIssuedAmount === 0 && payItem.agreedRefundAmount > 0)));
            if (deleteCustPayList && deleteCustPayList.length > 0) {
              _.each(deleteCustPayList, (payItem) => {
                const _deleteObj = {
                  paymentDetMstID: payItem.paymentDetMstID,
                  refRefundPaymentID: payItem.refRefundPaymentID
                };
                custRefundObj.deleteCustPaymentDetList.push(_deleteObj);
              });
            }
          } else if (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayableCMRefund.id) {
            const deleteCustCMDetList = _.filter(vm.custCreditMemoPaymentList, (CreditMemoItem) => CreditMemoItem.paymentDetMstID &&
              ((!CreditMemoItem.isSelected) || (CreditMemoItem.isSelected && CreditMemoItem.totalRefundIssuedAmount === 0 && CreditMemoItem.agreedRefundAmount > 0)));
            if (deleteCustCMDetList && deleteCustCMDetList.length > 0) {
              _.each(deleteCustCMDetList, (CreditMemoItem) => {
                const _deleteObj = {
                  paymentDetMstID: CreditMemoItem.paymentDetMstID,
                  refRefundCustCreditMemoID: CreditMemoItem.custCreditMemoMstID
                };
                custRefundObj.deleteCustCMDetList.push(_deleteObj);
              });
            }
          };

          vm.cgBusyLoading = CustomerRefundFactory.updateCustomerRefund().query({ custRefObj: custRefundObj }).$promise.then((resp) => {
            $scope.mainParentCtrlScope.saveBtnDisableFlag = false;
            if (resp && resp.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              const addUpdateRefundSuccessMsg = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.UPDATED);
              addUpdateRefundSuccessMsg.message = stringFormat(addUpdateRefundSuccessMsg.message, 'Customer refund');
              vm.addUpdateRefundSuccessMsg = addUpdateRefundSuccessMsg.message;
              retrieveCustRefundMstData();
              const custPayDet = {
                customerID: vm.autoCompleteCustomer.keyColumnId
              };

              if (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayablePayRefund.id) {
                retrieveAllRefundCustomerPayment(custPayDet);
              } else if (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayableCMRefund.id) {
                retrieveAllCreditMemoOfCustomerPayment(custPayDet);
              }

              setDetailsForMainParentForm();
              $scope.currActiveForm.$setPristine();

              if (vm.isPrintCheckAction && $scope.$parent && $scope.$parent.vm && $scope.$parent.vm.customerRefundPopupForm) {
                vm.printCheck(false);
                $scope.$parent.vm.cancel(true);
              }
            } else if (resp && resp.status === CORE.ApiResponseTypeStatus.FAILED && resp.errors && resp.errors.data) {
              if ((resp.errors.data.mismatchPaymentDetList && resp.errors.data.mismatchPaymentDetList.length > 0) ||
                (resp.errors.data.deleteCustPaymentDetList && resp.errors.data.deleteCustPaymentDetList.length > 0) ||
                (resp.errors.data.mismatchCMDetList && resp.errors.data.mismatchCMDetList.length > 0) ||
                (resp.errors.data.deleteCustCMDetList && resp.errors.data.deleteCustCMDetList.length > 0)) {
                // customer payment details changed externally/ found any deleted pay details and trying save same
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_REFUND_DET_CHANGED_TRY_AGAIN);
                if (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayablePayRefund.id) {
                  messageContent.message = stringFormat(messageContent.message, 'Payment');
                } else if (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayableCMRefund.id) {
                  messageContent.message = stringFormat(messageContent.message, 'Credit Memo');
                }
                const model = {
                  messageContent: messageContent
                };
                DialogFactory.messageAlertDialog(model).then(() => {
                  getLatestRefundDet();
                }).catch((error) => {
                  $scope.mainParentCtrlScope.saveBtnDisableFlag = false;
                  BaseService.getErrorLog(error);
                });
              }
            }
          }).catch((error) => {
            $scope.mainParentCtrlScope.saveBtnDisableFlag = false;
            BaseService.getErrorLog(error);
          });
        } else {   // call create customer refund and payment/CM detail list
          vm.cgBusyLoading = CustomerRefundFactory.createCustomerRefund().query({ custRefObj: custRefundObj }).$promise.then((resp) => {
            $scope.mainParentCtrlScope.saveBtnDisableFlag = false;
            if (resp && resp.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              const addUpdateRefundSuccessMsg = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.CREATED);
              addUpdateRefundSuccessMsg.message = stringFormat(addUpdateRefundSuccessMsg.message, 'Customer refund');
              vm.addUpdateRefundSuccessMsg = addUpdateRefundSuccessMsg.message;
              vm.custRefundMstID = resp.data.insertedRefundMstID;
              // update main controller with paymentID and allow to access different tabs
              if ($scope.mainParentCtrlScope) {
                $scope.mainParentCtrlScope.custRefundMstID = vm.custRefundMstID;
                _.each($scope.mainParentCtrlScope.tabList, (tabItem) => {
                  tabItem.isDisabled = false;
                });
              }
              setDetailsForMainParentForm();
              retrieveCustRefundMstData();
              const custPayDet = {
                customerID: vm.autoCompleteCustomer.keyColumnId
              };

              if (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayablePayRefund.id) {
                retrieveAllRefundCustomerPayment(custPayDet);
              } else if (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayableCMRefund.id) {
                retrieveAllCreditMemoOfCustomerPayment(custPayDet);
              }

              $scope.currActiveForm.$setPristine();
              $state.transitionTo($state.$current, { id: resp.data.insertedRefundMstID }, { location: true, inherit: true, notify: false });
            } else if (resp && resp.status === CORE.ApiResponseTypeStatus.FAILED && resp.errors && resp.errors.data) {
              if ((resp.errors.data.mismatchPaymentDetList && resp.errors.data.mismatchPaymentDetList.length > 0) || (resp.errors.data.mismatchCMDetList && resp.errors.data.mismatchCMDetList.length > 0)) {
                // customer refund details changed externally
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_REFUND_DET_CHANGED_TRY_AGAIN);
                if (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayablePayRefund.id) {
                  messageContent.message = stringFormat(messageContent.message, 'Payment');
                } else if (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayableCMRefund.id) {
                  messageContent.message = stringFormat(messageContent.message, 'Credit Memo');
                }
                const model = {
                  messageContent: messageContent
                };
                DialogFactory.messageAlertDialog(model).then(() => {
                  getLatestRefundDet();
                }).catch((error) => {
                  $scope.mainParentCtrlScope.saveBtnDisableFlag = false;
                  BaseService.getErrorLog(error);
                });
              }
            }
          }).catch((error) => {
            $scope.mainParentCtrlScope.saveBtnDisableFlag = false;
            BaseService.getErrorLog(error);
          });
        }
      };

      const setDetailsForMainParentForm = () => {
        if ($scope.mainParentCtrlScope) {
          $scope.mainParentCtrlScope.paymentNumber = vm.custRefundModel.paymentNumber;
          $scope.mainParentCtrlScope.custRefundMstID = vm.custRefundMstID;
          //$scope.mainParentCtrlScope.subStatus = vm.custRefundModel.subStatus;
          if ($scope.mainParentCtrlScope.custRefundMstDetParent) {
            $scope.mainParentCtrlScope.custRefundMstDetParent.isPaymentVoided = vm.custRefundModel.isPaymentVoided;
            $scope.mainParentCtrlScope.custRefundMstDetParent.isDisablePrintCheck = ((vm.custRefundModel.paymentMethodName !== TRANSACTION.PayablePaymentMethodGenericCategory.Check.gencCategoryName) || (vm.custRefundModel.isPaymentVoided)) ? true : false;
          }
        }
      };

      // when search any paymentNumber and enter > search paymentNumber and apply
      vm.searchAndApplyPayFromPayNo = (paymentCMNumber) => {
        if (paymentCMNumber !== null && paymentCMNumber !== undefined && paymentCMNumber !== '') {
          let payRefDet = [];
          if (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayablePayRefund.id) {
            payRefDet = _.find(vm.customerPaymentList, (payItem) => payItem.paymentNumber.toLowerCase() === paymentCMNumber.toLowerCase());
          } else if (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayableCMRefund.id) {
            payRefDet = _.find(vm.custCreditMemoPaymentList, (payItem) => payItem.creditMemoNumber.toLowerCase() === paymentCMNumber.toLowerCase());
          }

          if (payRefDet) {
            if (payRefDet.isSelected) {
              let messageContent;
              if (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayablePayRefund.id) {
                messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.PAYMENT_ALREADY_APPLIED_IN_CUST_REFUND);
                messageContent.message = stringFormat(messageContent.message, payRefDet.paymentNumber);
              } else if (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayableCMRefund.id) {
                messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CM_ALREADY_APPLIED_IN_CUST_REFUND);
                messageContent.message = stringFormat(messageContent.message, payRefDet.creditMemoNumber);
              }
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              DialogFactory.messageAlertDialog(model);
              return;
            } else {
              payRefDet.isSelected = true;
              if (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayablePayRefund.id) {
                vm.selectCustSinglePayment(payRefDet);
                vm.payRefSearch.paymentNumber = null;
              } else if (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayableCMRefund.id) {
                vm.selectCustSingleCM(payRefDet);
                vm.payRefSearch.creditMemoNumber = null;
              }
            }
          } else {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SEARCH_ITEM_NOT_EXIST_IN_LIST);
            if (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayablePayRefund.id) {
              messageContent.message = stringFormat(messageContent.message, 'Payment# or Check#', vm.payRefSearch.paymentNumber);
            } else if (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayableCMRefund.id) {
              messageContent.message = stringFormat(messageContent.message, 'Credit Memo#', vm.payRefSearch.creditMemoNumber);
            }
            const model = {
              messageContent: messageContent
            };
            return DialogFactory.messageAlertDialog(model).then((resp) => {
              if (resp) {
                setFocusByName('serachPaymentCMNumber');
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }
      };

      // when search any payment amount/CM amount and enter > search payment amount/CM amount with specific amount and apply
      vm.searchAndApplyPayFromPayAmount = (paymentAmount) => {
        if (paymentAmount !== null && paymentAmount !== undefined && paymentAmount !== '') {
          let payRefDetList = [];
          if (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayablePayRefund.id) {
            if (paymentAmount === 0) {
              payRefDetList = _.sortBy(_.filter(vm.customerPaymentList, (payItem) => payItem.openAmountForSelectedPayment === 0 && payItem.openAmountForSelectedPayment === 0 && !payItem.isSelected), (o) => o.paymentDate);
            } else {
              payRefDetList = _.sortBy(_.filter(vm.customerPaymentList, (payItem) => Math.abs(payItem.openAmountForSelectedPayment) === paymentAmount && !payItem.isSelected), (o) => o.paymentDate);
            }
          } else if (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayableCMRefund.id) {
            if (paymentAmount === 0) {
              payRefDetList = _.sortBy(_.filter(vm.custCreditMemoPaymentList, (creditMemoItem) => creditMemoItem.openCreditMemoAmount === 0 && creditMemoItem.openCreditMemoAmount === 0 && !creditMemoItem.isSelected), (o) => o.creditMemoDate);
            } else {
              payRefDetList = _.sortBy(_.filter(vm.custCreditMemoPaymentList, (creditMemoItem) => Math.abs(creditMemoItem.openCreditMemoAmount) === paymentAmount && !creditMemoItem.isSelected), (o) => o.creditMemoDate);
            }
          }
          if (payRefDetList && payRefDetList.length > 0) {
            const payRefDet = _.first(payRefDetList);
            payRefDet.isSelected = true;
            if (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayablePayRefund.id) {
              vm.selectCustSinglePayment(payRefDet);
              vm.payRefSearch.openAmountForSelectedPayment = null;
            } else if (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayableCMRefund.id) {
              vm.selectCustSingleCM(payRefDet);
              vm.payRefSearch.openCreditMemoAmount = null;
            }
          } else {
            // amount not matched with any payment/CM
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SEARCH_ITEM_NOT_EXIST_IN_LIST);
            if (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayablePayRefund.id) {
              messageContent.message = stringFormat(messageContent.message, 'Pending to apply refund', '$' + vm.payRefSearch.openAmountForSelectedPayment);
            } else if (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayableCMRefund.id) {
              messageContent.message = stringFormat(messageContent.message, 'Pending to apply refund', '$' + vm.payRefSearch.openCreditMemoAmount);
            }
            const model = {
              messageContent: messageContent
            };
            return DialogFactory.messageAlertDialog(model).then((resp) => {
              if (resp) {
                if (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayablePayRefund.id) {
                  setFocusByName('openAmountForSelectedPayment');
                } else if (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayableCMRefund.id) {
                  setFocusByName('openCreditMemoAmount');
                }
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }
      };

      // called when we select any payment item to pay from table list
      vm.selectSinglePayWithForwardingAmt = (payItem, appliedAmt) => {
        if (payItem.isSelected) {
          const checkAnyNotSelectedPay = _.some(vm.customerPaymentList, (data) => !data.isSelected);
          vm.isAllSelectFromCustPaymentList = checkAnyNotSelectedPay ? false : true;
          if (payItem.paymentDetMstID) {
            // in edit case > reset original paid amount (paid from current pay det)
            //payItem.paymentAmountForSelectedPayment = parseFloat((payItem.paymentAmountForSelectedPayment || 0).toFixed(2));
            payItem.paymentAmountForSelectedPayment = parseFloat(appliedAmt.toFixed(2));
          } else {
            // in add new inv pay det case > reset due payment amount
            payItem.paymentAmountForSelectedPayment = parseFloat(appliedAmt.toFixed(2));
          }
        } else {
          vm.isAllSelectFromCustPaymentList = false;
          payItem.paymentAmountForSelectedPayment = 0;
          payItem.comment = null;
        }
        payItem.liveDueAmountForSelectedPayment = (parseFloat(payItem.agreedRefundAmount.toFixed(2))) - (parseFloat((payItem.pastRefundAmtExcludeCurrTransForSelectedPayment || 0).toFixed(2)) + parseFloat((payItem.paymentAmountForSelectedPayment || 0).toFixed(2)));
        setSumOfAmountForCustPaymentList();
        setSumOfCurrPayAmountForCustPaymentList();
      };

      // called when we select any CM item to pay from table list
      vm.selectSingleCMWithForwardingAmt = (creditMemoItem, appliedAmt) => {
        if (creditMemoItem.isSelected) {
          const checkAnyNotSelectedCM = _.some(vm.custCreditMemoPaymentList, (data) => !data.isSelected);
          vm.isAllSelectFromCustCMList = checkAnyNotSelectedCM ? false : true;
          if (creditMemoItem.paymentDetMstID) {
            // in edit case > reset original paid amount (paid from current CM det)
            //creditMemoItem.paymentAmountForSelectedCM = parseFloat((creditMemoItem.paymentAmountForSelectedCM || 0).toFixed(2));
            creditMemoItem.paymentAmountForSelectedCM = parseFloat(appliedAmt.toFixed(2));
          } else {
            // in add new inv pay det case > reset due payment amount
            creditMemoItem.paymentAmountForSelectedCM = parseFloat(appliedAmt.toFixed(2));
          }
        } else {
          vm.isAllSelectFromCustCMList = false;
          creditMemoItem.paymentAmountForSelectedCM = 0;
          creditMemoItem.comment = null;
        }
        creditMemoItem.liveDueAmountForSelectedCM = (parseFloat(creditMemoItem.agreedRefundAmount.toFixed(2))) - (parseFloat((creditMemoItem.pastRefundAmtExcludeCurrTransForSelectedCM || 0).toFixed(2)) + parseFloat((creditMemoItem.paymentAmountForSelectedCM || 0).toFixed(2)));
        setSumOfAmountForCustCreditMemoPaymentList();
        setSumOfCurrCMAmountForCustCMList();
      };

      // to reset payment details in add mode
      vm.resetPaymentDet = () => {
        if (vm.autoCompleteCustomer.keyColumnId !== null) {
          vm.autoCompleteCustomer.keyColumnId = null;
        } else {
          resetDetails();
        }
      };

      // to refresh customer refund details
      vm.refreshPaymentDet = () => {
        let isAnyInvPayDetFormDirty = false;
        _.each(vm.customerPaymentList, (payItem) => {
          const isdirty = checkFormDirty($scope.currActiveForm['paymentAmountForSelectedPayment_' + payItem.paymentMstID]);
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
          if (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayablePayRefund.id) {
            retrieveAllRefundCustomerPayment(custPayDet);
          } else if (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayableCMRefund.id) {
            retrieveAllCreditMemoOfCustomerPayment(custPayDet);
          }
        }
      };

      const getLatestRefundDet = () => {
        if (vm.custRefundMstID) {
          retrieveCustRefundMstData();
        }
        const custPayDet = {
          customerID: vm.autoCompleteCustomer.keyColumnId
        };
        if (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayablePayRefund.id) {
          retrieveAllRefundCustomerPayment(custPayDet);
        } else if (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayableCMRefund.id) {
          retrieveAllCreditMemoOfCustomerPayment(custPayDet);
        };
      };

      // to refresh customer invoices payment details
      vm.refreshCustomerPaymentDet = () => {
        const custPayDet = {
          customerID: vm.autoCompleteCustomer.keyColumnId
        };
        if (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayablePayRefund.id) {
          retrieveAllRefundCustomerPayment(custPayDet);
        } else if (vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayableCMRefund.id) {
          retrieveAllCreditMemoOfCustomerPayment(custPayDet);
        };
      };

      /* alert pop up added here for lose updated changes */
      const showWithoutSavingAlertForPopUp = () => {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_RESET_DEFINED_DET_MSG);
        messageContent.message = stringFormat(messageContent.message, 'refund details');
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((resp) => {
          if (resp) {
            getLatestRefundDet();
            $scope.currActiveForm.$setPristine();
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
            vm.custRefundModel.accountReference = custDet.accountRef || null;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };


      /* open popup to display received/paid data */
      vm.showAppliedPayCMRefundIssueAmount = (payCMItem) => {
        if (payCMItem) {
          const selectedCust = _.find(vm.customerList, (custItem) => custItem.id === vm.autoCompleteCustomer.keyColumnId);
          const data =
          {
            id: vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayablePayRefund.id ? payCMItem.paymentMstID : payCMItem.custCreditMemoMstID,
            mfgCodeID: vm.autoCompleteCustomer.keyColumnId,
            paymentCMNumber: vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayablePayRefund.id ? payCMItem.paymentNumber : payCMItem.creditMemoNumber,
            customerName: selectedCust ? selectedCust.mfgFullName : null,
            totalPaymentAmount: vm.autoCompleteTransMode.keyColumnId === vm.GenericTransModeName.RefundPayablePayRefund.id ? payCMItem.totalPaymentAmount : payCMItem.originalCreditMemoAmount,
            totalRefundIssuedAmount: payCMItem.totalRefundIssuedAmount,
            agreedRefundAmount: payCMItem.agreedRefundAmount,
            refGencTransModeID: vm.autoCompleteTransMode.keyColumnId,
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
        }
      };


      //comment pop up.
      vm.manageComment = (payItem) => {
        if (payItem) {
          //const selectedPay = _.find(vm.customerPaymentList, (selectedPay) => selectedPay.id === payItem.payementMstID);
          const data = {
            paymentMstID: payItem.paymentMstID,
            comment: payItem.comment,
            isNotAllowedToChange: vm.isNotAllowedToChgMajorInfo
          };

          DialogFactory.dialogService(
            TRANSACTION.TRANSACTION_CUSTOMER_REFUND_DETAIL_REASON_POPUP_CONTROLLER,
            TRANSACTION.TRANSACTION_CUSTOMER_REFUND_DETAIL_REASON_POPUP_VIEW,
            event,
            data
          ).then(() => {
          }, (res) => {
            if (res && (res.comment !== null || res.comment !== '' || res.comment !== undefined)) {
              payItem.comment = res.comment,
                $scope.currActiveForm.$setDirty();
              $scope.currActiveForm.remark.$dirty = true;
            }
          }, (err) => BaseService.getErrorLog(err));
        }
      };

      /* Void Customer refund functionality (common grid action button with supplier so name like voidPaymentAndReleaseInvoiceGroup) */
      $scope.voidPaymentAndReleaseInvoiceGroup = (event) => {
        if ((vm.custRefundModel.isPaymentVoided === 1) || (!vm.allowToVoidCustRefundFeature)) {
          return;
        }

        if (vm.custRefundModel.lockStatus === vm.CustPaymentLockStatusConst.Locked) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_PAY_LOCKED_WITH_NO_ACCESS);
          messageContent.message = stringFormat(messageContent.message, vm.custRefundModel.paymentNumber);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
          return;
        }

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
          value: vm.custRefundModel.paymentNumber,
          displayOrder: 2,
          labelLinkFn: () => {
            BaseService.goToCustomerRefundList();
          },
          valueLinkFn: () => {
            BaseService.goToCustomerRefundDetail(vm.custRefundMstID);
          }
        }
        ];

        const invoicePaymentChange = {
          AccessRole: CORE.ROLE_ACCESS.VERIFICATION_ROLE_ACCESS,
          isAllowSaveDirect: false,
          popupTitle: 'Void Customer Refund',
          confirmationType: CORE.Generic_Confirmation_Type.CUSTOMER_REFUND_VOID,
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
                id: vm.custRefundModel.id,
                voidPaymentReason: pswConfirmation.approvalReason,
                refPaymentModeOfInvPayment: TRANSACTION.ReceivableRefPaymentMode.Refund.code
              };
              vm.cgBusyLoading = PackingSlipFactory.voidSupplierInvoicePayment().query(objData).$promise.then((response) => {
                if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                  if ($scope.currActiveForm) {
                    $scope.currActiveForm.$setPristine();
                  }
                  retrieveCustRefundMstData();
                } else if (response && response.status === CORE.ApiResponseTypeStatus.FAILED && response.errors && response.errors.data && response.errors.data.isPaymentAlreadyVoided) {
                  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_PAYMENT_ALREADY_VOIDED);
                  messageContent.message = stringFormat(messageContent.message, vm.custRefundModel.paymentNumber || '', 'customer refund', 'payment# or check#');
                  const model = {
                    messageContent: messageContent
                  };
                  DialogFactory.messageAlertDialog(model).then(() => {
                    if ($scope.currActiveForm) {
                      $scope.currActiveForm.$setPristine();
                    }
                    retrieveCustRefundMstData();
                  }).catch((error) => BaseService.getErrorLog(error));
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => {
            // cancel block
          }).catch((error) => BaseService.getErrorLog(error));
      };

      // to move at invoice list page with filter data
      vm.moveToInvoiceListPageWithFilter = () => {
        const searchData = {
          customerID: vm.autoCompleteCustomer.keyColumnId,
          dueDate: BaseService.getCurrentDate()
        };
        BaseService.goToCustInvListWithTermsDueDateSearch(searchData);
      };


      const getAddressForSupplierPayment = (id, defaultContPersonId) => {
        if (id) {
          return CustomerFactory.getAddressForSupplierPayment().query({ id: id, personMstID: defaultContPersonId }).$promise.then((response) => {
            if (response && response.data && response.data.address && response.data.address[0]) {
              vm.custRefundModel.billToAddress = response.data.address[0];
              //vm.billToAddressDisplay = formatAddressToDisplay(vm.custRefundModel.billToAddress);
            }
            return Promise.resolve(true);
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      // open add/Edit customer Addresses popup  // vm.addEditAddress = (ev, addressDet) => {
      vm.addEditAddress = (ev, callBackAddress) => {
        if (callBackAddress) {
          vm.custRefundModel.billToAddressID = callBackAddress.id;
          vm.custRefundModel.billToName = callBackAddress.companyName;
          vm.billingAddress = callBackAddress;
          vm.viewCustAddrOtherDet.alreadySelectedAddressID = callBackAddress.id;
          const addressPromise = [getAddressForSupplierPayment(callBackAddress.id, vm.custRefundModel.billToContactPersonID), getCustomerAddress()];
          vm.cgBusyLoading = $q.all(addressPromise).then(() => {
            setAddrContActionBtn();
            // Static code to enable save button
            $scope.currActiveForm.$setDirty();
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      /* open customer address popup to select new one */
      vm.selectAddress = (ev, callBackAddress) => {
        if (callBackAddress) {
          setBillToAddrContDetForApplied(callBackAddress);
          const defaultContPersonId = callBackAddress.contactPerson ? callBackAddress.contactPerson.personId : null;
          const addressPromise = [getAddressForSupplierPayment(callBackAddress.id, defaultContPersonId)];
          vm.cgBusyLoading = $q.all(addressPromise).then(() => {
            // Static code to enable save button
            $scope.currActiveForm.$setDirty();
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      //// Function call on payment# or check# blue event and check code exist or not
      //vm.checkDuplicatePaymentCheckNum = (event) => {
      //  if (oldRefundPaymentCheckNum !== vm.custRefundModel.paymentNumber && $scope.currActiveForm && $scope.currActiveForm.paymentNumber.$dirty && vm.custRefundModel.paymentNumber) {
      //    vm.cgBusyLoading = CustomerRefundFactory.checkDuplicateRefundPaymentCheckNum().save({
      //      custRefundMstID: vm.custRefundModel.id || null,
      //      paymentNumber: vm.custRefundModel.paymentNumber
      //    }).$promise.then((res) => {
      //      vm.cgBusyLoading = false;
      //      oldRefundPaymentCheckNum = angular.copy(vm.custRefundModel.paymentNumber);
      //      if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicatePaymentNumber) {
      //        const refundData = {
      //          custRefundMstID: vm.custRefundModel.id || null,
      //          paymentNumber: vm.custRefundModel.paymentNumber
      //        };

      //        const headerData = [{
      //          label: vm.LabelConstant.MFG.Customer,
      //          value: vm.custRefundModel.mfgFullName,
      //          displayOrder: 1,
      //          labelLinkFn: () => {
      //            BaseService.goToCustomerList();
      //          },
      //          valueLinkFn: () => {
      //            BaseService.goToCustomer(vm.custRefundModel.mfgcodeID);
      //          }
      //        },
      //        {
      //          label: 'Payment# or Check#',
      //          value: vm.custRefundModel.paymentNumber,
      //          displayOrder: 2
      //        }
      //        ];
      //        refundData.headerData = headerData;

      //        // open popup to display duplicate payments with same payment number
      //        DialogFactory.dialogService(
      //          TRANSACTION.CUST_REFUND_DUPLICATE_PAYMENT_NUM_POPUP_CONTROLLER,
      //          TRANSACTION.CUST_REFUND_DUPLICATE_PAYMENT_NUM_POPUP_VIEW,
      //          event,
      //          refundData
      //        ).then(() => {
      //        }, () => {
      //        }, (err) => BaseService.getErrorLog(err));
      //      }
      //    }).catch((error) => BaseService.getErrorLog(error));
      //  }
      //};

      /* common function to print refund Remittance/Check Report */
      vm.printCheck = (isRemittanceReport) => {
        if (!vm.custRefundMstID) {
          return;
        }

        const isDownload = false;
        if (isRemittanceReport) {
          vm.isPrintRemittDisabled = true;
        } else {
          vm.isPrintLoader = true;
        }
        const paramObj = {
          paymentId: vm.custRefundMstID,
          isRemittanceReport: isRemittanceReport ? isRemittanceReport : false,
          reportAPI: 'InvoicePayment/checkPrintAndRemittanceReport'
        };
        ReportMasterFactory.generateReport(paramObj).then((response) => {
          const model = {
            multiple: true
          };
          if (isRemittanceReport) {
            vm.isPrintRemittDisabled = false;
          } else {
            vm.isPrintLoader = false;
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

      // change customer refund sub status
      $scope.changeCustRefundSubStatus = (newRefundSubStatus) => {
        if (newRefundSubStatus && newRefundSubStatus.code !== vm.custRefundModel.subStatus) {
          // if payment number not added then ask to add first
          if (!vm.custRefundModel.paymentNumber && ((newRefundSubStatus.code === TRANSACTION.CustomerRefundSubStatusIDDet.ReadytoPrintCheck.code) || (newRefundSubStatus.code === TRANSACTION.CustomerRefundSubStatusIDDet.Refunded.code))) {
            const msgContentForRqrPaymentNum = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.PAYMENT_NUM_REQUIRED_TO_PRINT_REFUND_REPORT);
            const model = {
              messageContent: msgContentForRqrPaymentNum
            };
            DialogFactory.messageAlertDialog(model).then(() => {
              setFocus('paymentNumber');
            }).catch((error) => BaseService.getErrorLog(error));
            return;
          }

          // can not allowed to change higher status to lower (change to draft,published not allowed)
          if (((vm.custRefundModel.subStatus === TRANSACTION.CustomerRefundSubStatusIDDet.ReadytoPrintCheck.code) || (vm.custRefundModel.subStatus === TRANSACTION.CustomerRefundSubStatusIDDet.Refunded.code)) && ((newRefundSubStatus.code === TRANSACTION.CustomerRefundSubStatusIDDet.ReadytoPrintCheck.code) || (newRefundSubStatus.code === TRANSACTION.CustomerRefundSubStatusIDDet.Draft.code) || (newRefundSubStatus.code === TRANSACTION.CustomerRefundSubStatusIDDet.Published.code))) {
            const msgContentForNotAllowedToChgStatusToDraft = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.REFUND_STATUS_CANNOT_CHANGED_TO_DRAFT_PUBLISHED);
            const model = {
              messageContent: msgContentForNotAllowedToChgStatusToDraft
            };
            DialogFactory.messageAlertDialog(model);
            return;
          }

          // can not allowed to change status if contact person details not added
          if ((!vm.custRefundModel.billToAddressID || !vm.custRefundModel.billToContactPersonID) && newRefundSubStatus.code !== TRANSACTION.CustomerRefundSubStatusIDDet.Draft.code) {
            const msgContForContPersonRequired = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CONT_PERSON_REQUIRED_TO_CHG_REFUND_STATUS);
            msgContForContPersonRequired.message = stringFormat(msgContForContPersonRequired.message, vm.LabelConstant.Address.BillingAddress);
            const model = {
              messageContent: msgContForContPersonRequired
            };
            DialogFactory.messageAlertDialog(model);
            return;
          }

          /* if payment method other than check, Mark As Paid not selected and changing status from publish to Refunded
           then give error for select first Mark As Paid selection */
          if (!vm.isCheckTypePaymentMtdSelected && !vm.custRefundModel.isMarkAsPaid && (vm.custRefundModel.subStatus === TRANSACTION.CustomerRefundSubStatusIDDet.Draft.code || vm.custRefundModel.subStatus === TRANSACTION.CustomerRefundSubStatusIDDet.Published.code) && newRefundSubStatus.code === TRANSACTION.CustomerRefundSubStatusIDDet.Refunded.code) {
            const oldSubStatus = _.find(_.values(TRANSACTION.CustomerRefundSubStatusIDDet), (subStatusItem) => subStatusItem.code === vm.custRefundModel.subStatus);

            const msgContentForNotAllowedToChgStatusToDraft = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.REFUNDED_STATUS_REQUIRED_MARK_AS_PAID_IN_CUST_REFUND);
            msgContentForNotAllowedToChgStatusToDraft.message = stringFormat(msgContentForNotAllowedToChgStatusToDraft.message, oldSubStatus.name);
            const model = {
              messageContent: msgContentForNotAllowedToChgStatusToDraft
            };
            DialogFactory.messageAlertDialog(model);
            return;
          }

          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.STATUS_CHANGE_CONFIRMATION);
          messageContent.message = stringFormat(messageContent.message, BaseService.getCustomerRefundSubStatus(vm.custRefundModel.subStatus), BaseService.getCustomerRefundSubStatus(newRefundSubStatus.code));
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          return DialogFactory.messageConfirmDialog(obj).then((resp) => {
            if (resp) {
              $scope.currActiveForm.$dirty = true;
              $scope.saveCustomerRefund(newRefundSubStatus);
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      // open select contact person  list
      vm.selectContactPerson = (ev, callBackContactPerson) => {
        if (callBackContactPerson) {
          setContPersonDetAfterApply(callBackContactPerson);
        }
      };

      // set contact person details in current scope modal
      const setContPersonDetAfterApply = (callBackContactPerson) => {
        if (callBackContactPerson) {
          vm.selectedContactPerson = callBackContactPerson;
          vm.viewCustAddrOtherDet.alreadySelectedPersonId = vm.selectedContactPerson.personId;
          vm.custRefundModel.billToContactPersonID = vm.selectedContactPerson.personId;
          vm.custRefundModel.billToContactPerson = BaseService.generateContactPersonDetFormat(callBackContactPerson);
          setAddrContActionBtn();
          // Static code to enable save button
          $scope.currActiveForm.$setDirty();
        }
      };

      // set data for customer address directive
      const setOtherDetForCustAddrDir = (custID) => {
        vm.viewCustAddrOtherDet = {
          customerId: custID || vm.autoCompleteCustomer.keyColumnId,
          addressType: CORE.AddressType.BillingAddress,
          addressBlockTitle: stringFormat('{0}/{1}', vm.LabelConstant.Address.BillingAddress, vm.LabelConstant.Address.RemitToAddress),
          refTransID: custID || vm.autoCompleteCustomer.keyColumnId,
          refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
          alreadySelectedAddressID: null,
          alreadySelectedPersonId: null,
          mfgType: CORE.MFG_TYPE.CUSTOMER
        };
        if ($scope.mainParentCtrlScope && $scope.mainParentCtrlScope.selectedCustomerDet) {
          vm.viewCustAddrOtherDet.companyName = $scope.mainParentCtrlScope.selectedCustomerDet.mfgName;
          vm.viewCustAddrOtherDet.companyNameWithCode = $scope.mainParentCtrlScope.selectedCustomerDet.mfgFullName;
        }
      };

      //function formatAddressToDisplay(address) {
      //  return address ? address.replace(/(?:\r\n|\r|\n)/g, '<br>') : '';
      //}

      // delete address callback function
      vm.deleteCustAddress = () => {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DEFINE_ADDRESS_REMOVE_CONFIRMATION);
        messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.COMMON.BillingAddress);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };

        DialogFactory.messageConfirmDialog(obj).then((resp) => {
          if (resp) {
            vm.billingAddress = null;
            vm.custRefundModel.billToAddressID = null;
            vm.custRefundModel.billToAddress = null;
            vm.selectedContactPerson = null;
            vm.custRefundModel.billToContactPersonID = null;
            vm.custRefundModel.billToContactPerson = null;
            vm.viewCustAddrOtherDet.alreadySelectedAddressID = null;
            vm.viewCustAddrOtherDet.alreadySelectedPersonId = null;
            setAddrContActionBtn();
            // Static code to enable save button
            $scope.currActiveForm.$setDirty();
          }
        });
      };

      // delete contact person callback function
      vm.deleteContPerson = () => {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONTACT_PERSON_FROM_ADDR);
        messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.COMMON.BillingAddress);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.selectedContactPerson = null;
            vm.custRefundModel.billToContactPersonID = null;
            vm.custRefundModel.billToContactPerson = null;
            vm.viewCustAddrOtherDet.alreadySelectedPersonId = null;
            setAddrContActionBtn();
            // Static code to enable save button
            $scope.currActiveForm.$setDirty();
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
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
        BaseService.goToGenericCategoryPayablePaymentMethodList();
      };

      /* to go at bank list page (account code/name) */
      vm.goToBankList = () => {
        BaseService.goToBankList();
      };

      /* to go at customer bill to address page */
      vm.goToCustomerBillToPage = () => {
        BaseService.goToCustomer(vm.autoCompleteCustomer.keyColumnId, false);
      };

      /* to go at customer refund page  */
      vm.goToCustomerRefundDetail = (custRefundMstID) => {
        BaseService.goToCustomerRefundDetail(custRefundMstID);
      };

      /* to go at customer credit memo detail page  */
      vm.goToCustCreditMemoDetail = (creditMemoMstID) => {
        BaseService.goToCustomerCreditMemoDetail(creditMemoMstID);
      };

      /* to go at customer refund list page */
      vm.goToCustomerRefundList = () => {
        BaseService.goToCustomerRefundList();
      };
      vm.goChartOfAccountsList = () => BaseService.goToChartOfAccountList();
      /* to move at apply credit memo on invoice page */
      vm.applyCreditMemoToInvoice = (creditMemoMstID) => {
        if (creditMemoMstID) {
          BaseService.goToApplyCustCreditMemoToPayment(creditMemoMstID, null);
        }
      };

      vm.goToCustomerPaymentDetail = (custPaymentMstID) => {
        BaseService.goToCustomerPaymentDetail(custPaymentMstID);
      };

      vm.goToManagePersonal = (employeeId) => {
        BaseService.goToManagePersonnel(employeeId);
      };

      /* go to customer credit memo list page */
      vm.goToCustCreditMemoList = () => {
        BaseService.goToCustomerCreditMemoList();
      };

      /* go to customer payment list page */
      vm.goToCustPaymentList = () => {
        BaseService.goToCustomerPaymentList();
      };

      /* to move at customer billing address list page */
      vm.goToCustomerBillToTab = () => {
        BaseService.goToCustomer(vm.autoCompleteCustomer.keyColumnId, false);
      };

      /* go to Transaction Mode list page */
      vm.goToTransactionModeList = () => {
        BaseService.goToTransactionModesList(USER.TransactionModesTabs.Payable.Name, false);
      };
    }
  }
})();
