(function () {
  'use strict';
  angular
    .module('app.core')
    .directive('supplierInvoicePayment', supplierInvoicePayment);
  function supplierInvoicePayment($mdDialog, $timeout, $filter, DialogFactory, CORE, USER, BaseService, $q, PackingSlipFactory, SupplierInvoiceFactory, TRANSACTION, NotificationFactory, GenericCategoryFactory, BankFactory, ReportMasterFactory, CustomerFactory) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        data: '=?',
        paymentForIds: '=?',
        isAnyRowSelected: '=',
        cgBusyLoading: '=',
        isPaymentVoided: '=',
        paymentId: '=',
        supplierDet: '=',
        saveBtnDisableFlag: '=',
        isPaymentLocked: '=',
        lockStatus: '=',
        lockByName: '=',
        lockedAt: '=',
        setFocusOnCloseButton: '=',
        isReadOnly: '='
      },
      templateUrl: 'app/directives/custom/supplier-invoice-payment/supplier-invoice-payment.html',
      controller: supplierInvoicePaymentController,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function supplierInvoicePaymentController($scope) {
      const vm = this;
      var _dummyEvent = null;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.SUPPLIER_INVOICE_ACCOUNT_REFERENCE_TOOLTIP = CORE.SUPPLIER_INVOICE_ACCOUNT_REFERENCE_TOOLTIP;
      vm.statusTypeList = CORE.InvoiceVerificationStatusOptionsGridHeaderDropdown;
      vm.LabelConstant = angular.copy(CORE.LabelConstant);
      vm.TRANSACTION = TRANSACTION;
      vm.loginUser = BaseService.loginUser;
      vm.paidPackingSlip = {};
      vm.packingSlipData = angular.copy($scope.data);
      vm.amountInputStep = _amountInputStep;
      vm.paymentFieldPrefixName = 'paymentAmount_';

      vm.billToAddress = null;
      vm.billToAddressContactPerson = null;
      vm.billToAddressViewActionBtnDet = angular.copy(CORE.CustAddressViewActionBtn);
      vm.billToAddressContPersonViewActionBtnDet = angular.copy(CORE.ContactPersonViewActionBtn);

      vm.payToAddress = null;
      vm.payToAddressContactPerson = null;
      vm.payToAddressViewActionBtnDet = angular.copy(CORE.CustAddressViewActionBtn);
      vm.payToAddressContPersonViewActionBtnDet = angular.copy(CORE.ContactPersonViewActionBtn);

      vm.billToAddressViewAddrOtherDet = {
        mfgType: CORE.MFG_TYPE.DIST,
        customerId: null,
        addressType: CORE.AddressType.BusinessAddress,
        addressBlockTitle: vm.LabelConstant.Address.SupplierBusinessAddress,
        refTransID: null,
        refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
        alreadySelectedAddressID: null,
        alreadySelectedPersonId: null,
        showAddressEmptyState: false
      };

      vm.payToAddressViewAddrOtherDet = {
        mfgType: CORE.MFG_TYPE.DIST,
        customerId: null,
        addressType: CORE.AddressType.PayToInformation,
        addressBlockTitle: vm.LabelConstant.Address.RemitToAddress,
        refTransID: null,
        refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
        alreadySelectedAddressID: null,
        alreadySelectedPersonId: null,
        showAddressEmptyState: false
      };

      if ($scope.data) {
        vm.paymentId = $scope.data.paymentId ? $scope.data.paymentId : undefined;
        $scope.paymentId = vm.paymentId;
        vm.viewOnly = $scope.data.viewOnly ? true : false;
        vm.isVoidAndReIssuePayment = $scope.data.isVoidAndReIssuePayment ? true : false;
        // vm.refVoidPaymentOrCheckNumber = $scope.data.refVoidPaymentOrCheckNumber;
      }
      $scope.saveBtnDisableFlag = false;
      vm.mfgCodeID = $scope.supplierDet.mfgCodeID;
      vm.supplierCode = $scope.supplierDet.supplierCode;

      vm.memoTypeList = CORE.InvoiceVerificationReceiptTypeOptionsGridHeaderDropdown;
      vm.DefaultDateFormat = _dateDisplayFormat;

      vm.billToContactPersonAddUpdateCallback = (ev, appliedContactPerson) => {
        if (appliedContactPerson) {
          vm.billToAddressContactPerson = appliedContactPerson || null;
          vm.paidPackingSlip.billToContactPersonID = appliedContactPerson ? appliedContactPerson.personId : null;
          vm.billToAddressViewAddrOtherDet.alreadySelectedPersonId = vm.paidPackingSlip.billToContactPersonID;
          vm.formPaidPackaging.$setDirty();
        }
      };

      vm.billToAddressAddUpdateCallback = (ev, appliedAddress) => {
        if (appliedAddress) {
          vm.billToAddress = appliedAddress;
          vm.paidPackingSlip.billToAddressID = appliedAddress.id;
          vm.billToAddressViewAddrOtherDet.alreadySelectedAddressID = vm.paidPackingSlip.billToAddressID;
          vm.billToAddressContactPerson = (appliedAddress && appliedAddress.contactPerson) ? appliedAddress.contactPerson : null;
          vm.paidPackingSlip.billToContactPersonID = vm.billToAddressContactPerson ? vm.billToAddressContactPerson.personId : null;
          vm.billToAddressViewAddrOtherDet.alreadySelectedPersonId = vm.paidPackingSlip.billToContactPersonID;
          vm.formPaidPackaging.$setDirty();
        }
      };

      vm.removeBillToAddress = () => {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DEFINE_ADDRESS_REMOVE_CONFIRMATION);
        messageContent.message = stringFormat(messageContent.message, 'supplier business ');
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then(() => {
          vm.paidPackingSlip.billToContactPersonID = vm.paidPackingSlip.billToAddressID =
            vm.billToAddressViewAddrOtherDet.alreadySelectedPersonId = vm.billToAddressViewAddrOtherDet.alreadySelectedAddressID = vm.billToAddressContactPerson = vm.billToAddress = null;
          vm.billToAddressViewActionBtnDet.Update.isDisable = vm.billToAddressViewActionBtnDet.Delete.isDisable = true;
          vm.formPaidPackaging.$setDirty();
        }, () => { });
      };
      vm.removeBillToContactPerson = () => {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONTACT_PERSON_FROM_ADDR);
        messageContent.message = stringFormat(messageContent.message, 'supplier business ');
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then(() => {
          vm.paidPackingSlip.billToContactPersonID = vm.billToAddressContactPerson = vm.billToAddressViewAddrOtherDet.alreadySelectedPersonId = null;
          vm.billToAddressContPersonViewActionBtnDet.Update.isDisable = vm.billToAddressContPersonViewActionBtnDet.Delete.isDisable = true;
          vm.formPaidPackaging.$setDirty();
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.payToContactPersonAddUpdateCallback = (ev, appliedContactPerson) => {
        if (appliedContactPerson) {
          vm.payToAddressContactPerson = appliedContactPerson || null;
          vm.paidPackingSlip.payToContactPersonID = appliedContactPerson ? appliedContactPerson.personId : null;
          vm.payToAddressViewAddrOtherDet.alreadySelectedPersonId = vm.paidPackingSlip.payToContactPersonID;
          vm.formPaidPackaging.$setDirty();
        }
      };

      vm.payToAddressAddUpdateCallback = (ev, appliedAddress) => {
        if (appliedAddress) {
          vm.payToAddress = appliedAddress;
          vm.paidPackingSlip.payToAddressID = appliedAddress.id;
          vm.payToAddressViewAddrOtherDet.alreadySelectedAddressID = vm.paidPackingSlip.payToAddressID;
          vm.payToAddressContactPerson = (appliedAddress && appliedAddress.contactPerson) ? appliedAddress.contactPerson : null;
          vm.paidPackingSlip.payToContactPersonID = vm.payToAddressContactPerson ? vm.payToAddressContactPerson.personId : null;
          vm.payToAddressViewAddrOtherDet.alreadySelectedPersonId = vm.paidPackingSlip.payToContactPersonID;
          vm.formPaidPackaging.$setDirty();
        }
      };

      vm.removePayToAddress = () => {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DEFINE_ADDRESS_REMOVE_CONFIRMATION);
        messageContent.message = stringFormat(messageContent.message, 'remit to ');
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then(() => {
          vm.paidPackingSlip.payToContactPersonID = vm.paidPackingSlip.payToAddressID =
            vm.payToAddressViewAddrOtherDet.alreadySelectedPersonId = vm.payToAddressViewAddrOtherDet.alreadySelectedAddressID = vm.payToAddressContactPerson = vm.payToAddress = null;
          vm.payToAddressViewActionBtnDet.Update.isDisable = vm.payToAddressViewActionBtnDet.Delete.isDisable = true;
          vm.formPaidPackaging.$setDirty();
        }, () => { });
      };
      vm.removePayToContactPerson = () => {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONTACT_PERSON_FROM_ADDR);
        messageContent.message = stringFormat(messageContent.message, 'remit to ');
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then(() => {
          vm.paidPackingSlip.payToContactPersonID = vm.payToAddressContactPerson = vm.payToAddressViewAddrOtherDet.alreadySelectedPersonId = null;
          vm.payToAddressContPersonViewActionBtnDet.Update.isDisable = vm.payToAddressContPersonViewActionBtnDet.Delete.isDisable = true;
          vm.formPaidPackaging.$setDirty();
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.chequeDateOptions = {
        appendToBody: true
      };
      vm.DATE_PICKER = CORE.DATE_PICKER;
      vm.IsPickerOpen = {
        [vm.DATE_PICKER.paymentDate]: false
      };
      vm.query = {
        order: ''
      };
      $scope.isAnyRowSelected = true;
      vm.currentDate = new Date();

      vm.getTotalPaidAmount = () => {
        vm.grandTotalPaidAmount = CalcSumofArrayElement(_.map(vm.packingSlipData, 'totalPaidAmount'), _amountFilterDecimal);
        return $filter('amount')(vm.grandTotalPaidAmount);
      };

      vm.getTotalDiscountAmount = () => {
        vm.grandTotalDiscountAmount = CalcSumofArrayElement(_.map(vm.packingSlipData, 'totalDiscount'), _amountFilterDecimal);
        return $filter('amount')(vm.grandTotalDiscountAmount);
      };

      vm.getTotalRefundAmount = () => {
        vm.grandTotalRefundAmount = CalcSumofArrayElement(_.map(vm.packingSlipData, 'markedForRefundAmt'), _amountFilterDecimal);
        return $filter('amount')(vm.grandTotalRefundAmount);
      };

      vm.getTotalExtendedAmount = () => {
        vm.grandTotalExtendedAmount = CalcSumofArrayElement(_.map(vm.packingSlipData, 'totalExtendedAmount'), _amountFilterDecimal);
        return $filter('amount')(vm.grandTotalExtendedAmount);
      };

      vm.getTotalPaymentAmount = () => {
        vm.grandTotalPaymentAmount = CalcSumofArrayElement(_.map(vm.packingSlipData, 'paymentAmount'), _amountFilterDecimal);
        return $filter('amount')(vm.grandTotalPaymentAmount);
      };

      vm.getTotalBalancetoPayAmount = () => {
        vm.grandTotalBalanceToPayAmount = CalcSumofArrayElement(_.map(vm.packingSlipData, 'balanceToPayAmount'), _amountFilterDecimal);
        return $filter('amount')(vm.grandTotalBalanceToPayAmount);
      };


      vm.goToSupplierList = () => {
        BaseService.goToSupplierList();
        return false;
      };

      vm.goToSupplierDetail = (data) => {
        BaseService.goToSupplierDetail(data.id);
        return false;
      };

      vm.goToSupplierBillTo = () => {
        BaseService.goToSupplierDetail(vm.paidPackingSlip ? vm.paidPackingSlip.mfgcodeID : null, false);
      };

      vm.goToSupplierBankRemitTo = () => {
        BaseService.goToSupplierBankRemitTo(vm.paidPackingSlip ? vm.paidPackingSlip.mfgcodeID : null);
      };

      vm.goToBankList = () => {
        BaseService.goToBankList();
        return false;
      };

      vm.supplierInvoiceDetail = (item, isRefInvoice) => {
        if (isRefInvoice) {
          BaseService.goToSupplierInvoiceDetail(TRANSACTION.SupplierInvoiceType.Detail, item.refParentCreditDebitInvoiceno);
        } else if (item.receiptType === CORE.packingSlipReceiptType.I.Key) {
          BaseService.goToSupplierInvoiceDetail(TRANSACTION.SupplierInvoiceType.Detail, item.id);
        } else if (item.receiptType === CORE.packingSlipReceiptType.C.Key) {
          BaseService.goToCreditMemoDetail(null, item.id);
        } else if (item.receiptType === CORE.packingSlipReceiptType.D.Key) {
          BaseService.goToDebitMemoDetail(null, item.id);
        }
      };

      function initAutoComplete() {
        vm.autoCompletePaymentMethodType = {
          controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
          viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
          columnName: 'gencCategoryName',
          keyColumnName: 'gencCategoryID',
          keyColumnId: vm.paidPackingSlip ? vm.paidPackingSlip.paymentType : null,
          inputName: CORE.CategoryType.PayablePaymentMethods.Name,
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
              vm.autoCompleteBankAccountNumber.keyColumnId = obj.bankMst ? obj.bankMst.id : null;
            } else {
              vm.paidPackingSlip.paymentType = null;
              vm.autoCompleteBankAccountNumber.keyColumnId = null;
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
      };
      /* Get payable payment method*/
      vm.paymentMethodTypeList = [];
      vm.getPaymentMethodType = () => {
        const GencCategoryType = [];
        GencCategoryType.push(CORE.CategoryType.PayablePaymentMethods.Name);
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

      function setTotalPayableAmountFormat() {
        if (vm.paidPackingSlip) {
          vm.todalPayableAmountDisplay = vm.paidPackingSlip.paymentAmount ? $filter('amount')(vm.paidPackingSlip.paymentAmount) : 0;
        }
      }

      // get contact person list
      const getCustomerContactPersonList = (objData) => CustomerFactory.getCustomerContactPersons().query({
        refTransID: (objData && objData.supplierID) ? objData.supplierID : null,
        refTableName: CORE.TABLE_NAME.MFG_CODE_MST
      }).$promise.then((contactperson) => {
        if (contactperson && contactperson.data && objData) {
          if (objData.addressType === CORE.AddressType.BusinessAddress) {
            vm.billToAddressContactPerson = _.find(contactperson.data, (item) => item.personId === objData.alreadySelectedPersonId);
            vm.billToAddressViewAddrOtherDet.alreadySelectedPersonId = vm.billToAddressContactPerson ? vm.billToAddressContactPerson.personId : null;
          } else if (objData.addressType === CORE.AddressType.PayToInformation) {
            vm.payToAddressContactPerson = _.find(contactperson.data, (item) => item.personId === objData.alreadySelectedPersonId);
            vm.payToAddressViewAddrOtherDet.alreadySelectedPersonId = vm.payToAddressContactPerson ? vm.payToAddressContactPerson.personId : null;
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));

      // get address list
      const getSupplierAddressList = (id, pAddressType) => CustomerFactory.customerAddressList().query({
          customerId: id,
          addressType: pAddressType, //[CORE.AddressType.BillingAddress, CORE.AddressType.PayToInformation],
          refTableName: CORE.TABLE_NAME.MFG_CODE_MST
        }).$promise.then((billToAddress) => {
          if (pAddressType && Array.isArray(pAddressType) && pAddressType.indexOf(CORE.AddressType.BusinessAddress) !== -1) {
            const billingAddress = billToAddress ? _.filter(billToAddress.data, (data) => data.addressType === CORE.AddressType.BusinessAddress) : null;
            if (vm.paidPackingSlip && vm.paidPackingSlip.billToAddressID && (vm.paymentId || vm.isVoidAndReIssuePayment)) {
              vm.billToAddress = _.find(billingAddress, (item) => item.id === vm.paidPackingSlip.billToAddressID);
              vm.billToAddressViewAddrOtherDet.alreadySelectedAddressID = vm.billToAddress ? vm.billToAddress.id : null;
              getCustomerContactPersonList({
                supplierID: vm.paidPackingSlip.mfgcodeID,
                addressType: CORE.AddressType.BusinessAddress,
                alreadySelectedPersonId: vm.paidPackingSlip.billToContactPersonID
              });
            } else {
              if (!vm.paymentId) {
                vm.billToAddress = _.find(billingAddress, (item) => item.isDefault === true);
                vm.billToAddressViewAddrOtherDet.alreadySelectedAddressID = vm.billToAddress ? vm.billToAddress.id : null;
                vm.paidPackingSlip.billToAddressID = vm.billToAddressViewAddrOtherDet.alreadySelectedAddressID;
                vm.billToAddressContactPerson = (vm.billToAddress && vm.billToAddress.contactPerson) ? angular.copy(vm.billToAddress.contactPerson) : null;
                vm.billToAddressViewAddrOtherDet.alreadySelectedPersonId = vm.billToAddressContactPerson ? vm.billToAddressContactPerson.personId : null;
                vm.paidPackingSlip.billToContactPersonID = vm.billToAddressViewAddrOtherDet.alreadySelectedPersonId;
              }
              else {
                vm.billToAddress = null;
                vm.billToAddressContactPerson = null;
                vm.billToAddressViewAddrOtherDet.alreadySelectedAddressID = null;
                vm.billToAddressViewAddrOtherDet.alreadySelectedPersonId = null;
              }
            }
            if (!billingAddress || billingAddress.length === 0 &&
              (vm.billToAddressViewAddrOtherDet && !vm.billToAddressViewAddrOtherDet.alreadySelectedAddressID)) {
              vm.billToAddressViewAddrOtherDet.showAddressEmptyState = true;
            } else {
              vm.billToAddressViewAddrOtherDet.showAddressEmptyState = false;
            }
          }
          if (pAddressType && Array.isArray(pAddressType) && pAddressType.indexOf(CORE.AddressType.PayToInformation) !== -1) {
            const paymentAddress = billToAddress ? _.filter(billToAddress.data, (data) => data.addressType === CORE.AddressType.PayToInformation) : null;
            if (vm.paidPackingSlip && vm.paidPackingSlip.payToAddressID && (vm.paymentId || vm.isVoidAndReIssuePayment)) {
              vm.payToAddress = _.find(paymentAddress, (item) => item.id === vm.paidPackingSlip.payToAddressID);
              vm.payToAddressViewAddrOtherDet.alreadySelectedAddressID = vm.payToAddress ? vm.payToAddress.id : null;
              getCustomerContactPersonList({
                supplierID: vm.paidPackingSlip.mfgcodeID,
                addressType: CORE.AddressType.PayToInformation,
                alreadySelectedPersonId: vm.paidPackingSlip.payToContactPersonID
              });
            } else {
              if (!vm.paymentId) {
                vm.payToAddress = _.find(paymentAddress, (item) => item.isDefault === true);
                vm.payToAddressViewAddrOtherDet.alreadySelectedAddressID = vm.payToAddress ? vm.payToAddress.id : null;
                vm.paidPackingSlip.payToAddressID = vm.payToAddressViewAddrOtherDet.alreadySelectedAddressID;
                vm.payToAddressContactPerson = (vm.payToAddress && vm.payToAddress.contactPerson) ? angular.copy(vm.payToAddress.contactPerson) : null;
                vm.payToAddressViewAddrOtherDet.alreadySelectedPersonId = vm.payToAddressContactPerson ? vm.payToAddressContactPerson.personId : null;
                vm.paidPackingSlip.payToContactPersonID = vm.payToAddressViewAddrOtherDet.alreadySelectedPersonId;
              }
              else {
                vm.payToAddress = null;
                vm.payToAddressContactPerson = null;
                vm.payToAddressViewAddrOtherDet.alreadySelectedAddressID = null;
                vm.payToAddressViewAddrOtherDet.alreadySelectedPersonId = null;
              }
            }
            if (!paymentAddress || paymentAddress.length === 0 &&
              (vm.payToAddressViewAddrOtherDet && !vm.payToAddressViewAddrOtherDet.alreadySelectedAddressID)) {
              vm.payToAddressViewAddrOtherDet.showAddressEmptyState = true;
            } else {
              vm.payToAddressViewAddrOtherDet.showAddressEmptyState = false;
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));

      vm.refreshPayToAddress = () => {
        getSupplierAddressList(vm.paidPackingSlip.mfgcodeID, [CORE.AddressType.PayToInformation]);
      };
      vm.refreshBillToAddress = () => {
        getSupplierAddressList(vm.paidPackingSlip.mfgcodeID, [CORE.AddressType.BusinessAddress]);
      };

      const getPaymentToInformation = (isRefreshAccountReference) => {
        const listObj = { };
        if (vm.paymentId) {
          listObj.paymentId = vm.paymentId;
          vm.billToAddressViewActionBtnDet.AddNew.isDisable = true;
          vm.billToAddressViewActionBtnDet.Update.isDisable = true;
          vm.billToAddressViewActionBtnDet.ApplyNew.isDisable = true;
          vm.billToAddressViewActionBtnDet.Delete.isDisable = true;
          vm.billToAddressContPersonViewActionBtnDet.AddNew.isDisable = true;
          vm.billToAddressContPersonViewActionBtnDet.Update.isDisable = true;
          vm.billToAddressContPersonViewActionBtnDet.ApplyNew.isDisable = true;
          vm.billToAddressContPersonViewActionBtnDet.Delete.isDisable = true;

          vm.payToAddressViewActionBtnDet.AddNew.isDisable = true;
          vm.payToAddressViewActionBtnDet.Update.isDisable = true;
          vm.payToAddressViewActionBtnDet.ApplyNew.isDisable = true;
          vm.payToAddressViewActionBtnDet.Delete.isDisable = true;
          vm.payToAddressContPersonViewActionBtnDet.AddNew.isDisable = true;
          vm.payToAddressContPersonViewActionBtnDet.Update.isDisable = true;
          vm.payToAddressContPersonViewActionBtnDet.ApplyNew.isDisable = true;
          vm.payToAddressContPersonViewActionBtnDet.Delete.isDisable = true;
        } else {
          if (!vm.mfgCodeID) {
            return true;
          }
          listObj.mfgcodeID = vm.mfgCodeID;
        }
        return PackingSlipFactory.getPackaingslipPaymentToInformation().query(listObj).$promise.then((response) => {
          if (response && response.data && response.data.data) {
            if (isRefreshAccountReference) {
              const payToInfoForAccountRef = _.first(response.data.data);
              if (payToInfoForAccountRef) {
                vm.paidPackingSlip.accountReference = payToInfoForAccountRef.accountReference;
              }
            }
            else {
              vm.paidPackingSlip = _.first(response.data.data);
              vm.paidPackingSlip.paymentNumberOld = vm.paidPackingSlip.paymentNumber;
              vm.paidPackingSlip.remarkOld = vm.paidPackingSlip.remark;
              if (!vm.paidPackingSlip) {
                vm.paidPackingSlip = {};
              }
              vm.billToAddressViewAddrOtherDet.customerId = vm.paidPackingSlip.mfgcodeID;
              vm.billToAddressViewAddrOtherDet.alreadySelectedAddressID = vm.paidPackingSlip.billToAddressID;
              vm.billToAddressViewAddrOtherDet.alreadySelectedPersonId = vm.paidPackingSlip.billToContactPersonID;
              vm.billToAddressViewAddrOtherDet.refTransID = vm.paidPackingSlip.mfgcodeID;
              vm.billToAddressViewAddrOtherDet.companyNameWithCode = vm.paidPackingSlip.fullMfgName;
              vm.billToAddressViewAddrOtherDet.companyName = vm.paidPackingSlip.mfgName;

              vm.payToAddressViewAddrOtherDet.customerId = vm.paidPackingSlip.mfgcodeID;
              vm.payToAddressViewAddrOtherDet.alreadySelectedAddressID = vm.paidPackingSlip.payToAddressID;
              vm.payToAddressViewAddrOtherDet.alreadySelectedPersonId = vm.paidPackingSlip.payToContactPersonID;
              vm.payToAddressViewAddrOtherDet.refTransID = vm.paidPackingSlip.mfgcodeID;
              vm.payToAddressViewAddrOtherDet.companyNameWithCode = vm.paidPackingSlip.fullMfgName;
              vm.payToAddressViewAddrOtherDet.companyName = vm.paidPackingSlip.mfgName;

              if (vm.paidPackingSlip.paymentDate) {
                vm.paidPackingSlip.paymentDate = BaseService.getUIFormatedDate(vm.paidPackingSlip.paymentDate, vm.DefaultDateFormat);
              }
              else {
                vm.paidPackingSlip.paymentDate = vm.currentDate;
              }
              $scope.isPaymentVoided = vm.paidPackingSlip.isPaymentVoided;
              if (vm.paidPackingSlip.lockStatus === TRANSACTION.CustomerPaymentLockStatus.Locked && !vm.loginUser.isUserSuperAdmin) {
                $scope.isPaymentLocked = true;
              } else {
                $scope.isPaymentLocked = false;
              }
              if (vm.paymentId && $scope.$parent && $scope.$parent.vm) {
                $scope.$parent.vm.displayPaymentDetail = angular.copy(vm.paidPackingSlip);
                $scope.$parent.vm.displayPaymentDetail.id = vm.paidPackingSlip.paymentId;
                $scope.$parent.vm.isPaymentLocked = $scope.isPaymentLocked;
                $scope.$parent.isPaymentVoided = $scope.isPaymentVoided;
              }
              $scope.lockStatus = vm.paidPackingSlip.lockStatus;
              $scope.lockByName = vm.paidPackingSlip.lockByName;
              $scope.lockedAt = vm.paidPackingSlip.lockedAt;

              vm.paidPackingSlip.totalPayableAmount = vm.packingSlipTotalPayableAmount;
              vm.paidPackingSlip.paymentAmount = vm.packingSlipTotalPayableAmount;
              vm.mfgCodeID = vm.paidPackingSlip.mfgCodeID;
              vm.supplierCode = vm.paidPackingSlip.supplierCode;
              setTotalPayableAmountFormat();
              getSupplierAddressList(vm.paidPackingSlip.mfgcodeID, [CORE.AddressType.BusinessAddress, CORE.AddressType.PayToInformation]);
            }
          }
            return $q.resolve(vm.paidPackingSlip);
        }).catch((error) => BaseService.getErrorLog(error));
      };

      function setInvoiceType() {
        if (vm.packingSlipData) {
          _.map(vm.packingSlipData, (data) => {
            const obj = _.find(vm.memoTypeList, (item) => item.code === data.receiptType);
            data.receiptName = obj && obj.value ? obj.value : null;
            data.isSelected = true;
          });
        }
      }

      const retrieveSupplierInvoicePaymentLines = () => {
        const query = {
          paymentID: vm.paymentId
        };
        return SupplierInvoiceFactory.retrieveSupplierInvoicePaymentLines().query(query).$promise.then((response) => {
          if (response && response.data && response.data.paymentLines) {
            vm.packingSlipData = angular.copy(response.data.paymentLines);
            setInvoiceType();
          }
          return $q.resolve(vm.packingSlipData);
        }).catch((error) => BaseService.getErrorLog(error));
      };

      const retrieveSupplierInvoiceLinesForPayment = () => {
        const pagingInfo = {
          SortColumns: [['paymentDueDate', 'ASC'], ['supplierCode', 'ASC']],
          SearchColumns: [],
          mfgCodeIds: vm.mfgCodeID,
          whereStatus: [vm.statusTypeList[4].code, vm.statusTypeList[7].code],
          SearchColumnName: TRANSACTION.PackingSlipColumn.Status,
          invoiceIds: ($scope.paymentForIds || []).join(',')
        };
        return SupplierInvoiceFactory.getSupplierInvoiceList().query(pagingInfo).$promise.then((response) => {
          if (response && response.data && response.data.supplierInvoice) {
            vm.packingSlipData = angular.copy(response.data.supplierInvoice);

            if (!vm.packingSlipData || vm.packingSlipData.length === 0) {
              // data not found
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.NOT_FOUND);
              messageContent.message = stringFormat(messageContent.message, 'Pending invoice');
              const alertModel = {
                messageContent: messageContent
              };
              DialogFactory.messageAlertDialog(alertModel);
              return;
            }
            _.map(vm.packingSlipData, (data) => {
              var refundAmt = 0;
              if (data.receiptType === 'C' || data.receiptType === 'D') {
                refundAmt = data.markedForRefundAmt;
              }
              data.isSelected = true;
              data.orgBalanceToPayAmount = data.paymentAmount = CalcSumofArrayElement([data.totalExtendedAmount, refundAmt, (data.totalPaidAmount * -1)], _amountFilterDecimal);
              data.invoiceDate = BaseService.getUIFormatedDate(data.invoiceDate, vm.DefaultDateFormat);
              data.packingSlipDate = BaseService.getUIFormatedDate(data.packingSlipDate, vm.DefaultDateFormat);
              data.paymentDueDate = BaseService.getUIFormatedDate(data.paymentDueDate, vm.DefaultDateFormat);
              data.poDate = BaseService.getUIFormatedDate(data.poDate, vm.DefaultDateFormat);
              data.receiptDate = BaseService.getUIFormatedDate(data.receiptDate, vm.DefaultDateFormat);
              data.creditMemoDate = BaseService.getUIFormatedDate(data.creditMemoDate, vm.DefaultDateFormat);
              data.debitMemoDate = BaseService.getUIFormatedDate(data.debitMemoDate, vm.DefaultDateFormat);
            });
            setBalanceAmountRowWise();
            setTotalPayableAmount();
          }
          return $q.resolve(vm.packingSlipData);
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.getAllInvoiceDetails = (event) => {
        const pagingInfo = {
          Page: 0,
          SortColumns: [['paymentDueDate', 'ASC'], ['supplierCode', 'ASC']],
          SearchColumns: [],
          pageName: CORE.PAGENAME_CONSTANT[7].PageName,
          mfgCodeIds: vm.mfgCodeID,
          //receiptType: 'I,C,D',
          receiptType: '"I","C","D"',
          whereStatus: [vm.statusTypeList[4].code, vm.statusTypeList[7].code],
          SearchColumnName: TRANSACTION.PackingSlipColumn.Status
        };
        let allInvoiceDetailsList = [];
        vm.cgBusyLoading = SupplierInvoiceFactory.getSupplierInvoiceList().query(pagingInfo).$promise.then((response) => {
          if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data) {
            const ids = vm.packingSlipData.map((c) => c.id);
            allInvoiceDetailsList = response.data.supplierInvoice.filter(({ id }) => !ids.includes(id));
            if (!allInvoiceDetailsList || allInvoiceDetailsList.length === 0) {
              // data not found
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.NOT_FOUND);
              messageContent.message = stringFormat(messageContent.message, 'Pending invoice');
              const alertModel = {
                messageContent: messageContent
              };
              DialogFactory.messageAlertDialog(alertModel);
              return;
            }

            _.map(allInvoiceDetailsList, (data) => {
              data.invoiceDate = BaseService.getUIFormatedDate(data.invoiceDate, vm.DefaultDateFormat);
              data.packingSlipDate = BaseService.getUIFormatedDate(data.packingSlipDate, vm.DefaultDateFormat);
              data.paymentDueDate = BaseService.getUIFormatedDate(data.paymentDueDate, vm.DefaultDateFormat);
              data.poDate = BaseService.getUIFormatedDate(data.poDate, vm.DefaultDateFormat);
              data.receiptDate = BaseService.getUIFormatedDate(data.receiptDate, vm.DefaultDateFormat);
              data.creditMemoDate = BaseService.getUIFormatedDate(data.creditMemoDate, vm.DefaultDateFormat);
              data.debitMemoDate = BaseService.getUIFormatedDate(data.debitMemoDate, vm.DefaultDateFormat);
            });

            DialogFactory.dialogService(
              TRANSACTION.SELECT_SUPPLIER_INVOICE_POPUP_CONTROLLER,
              TRANSACTION.SELECT_SUPPLIER_INVOICE_POPUP_VIEW,
              event,
              allInvoiceDetailsList
            ).then(() => {
            }, (data) => {
              if (data && data.length > 0) {
                vm.packingSlipData = vm.packingSlipData.concat(data);
                setBalanceAmountRowWise();
                setTotalPayableAmount();
              }
            }, (err) => BaseService.getErrorLog(err));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      const init = () => {
        const promises = [getPaymentToInformation(), getBankList(), vm.getPaymentMethodType()];
        if (vm.paymentId) {
          promises.push(retrieveSupplierInvoicePaymentLines());
        } else {
          promises.push(retrieveSupplierInvoiceLinesForPayment());
        }
        $scope.cgBusyLoading = $q.all(promises).then(() => {
          vm.showTable = true;
          setTotalPayableAmount();
          initAutoComplete();

          setInvoiceType();

          if (_.some(vm.packingSlipData, (data) => data.isSelected === false)) {
            vm.isAllSelect = false;
          } else {
            vm.isAllSelect = true;
          }

          if (!vm.paidPackingSlip || !vm.paidPackingSlip.accountReference) {
            const alertModel = {
              messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PAYMENT_FILL_ACCOUNT_REF_IN_SUPPLIER_MASTER_FIRST,
              multiple: true
            };
            DialogFactory.messageAlertDialog(alertModel).then(() => {
              /*if (yes) {
                BaseService.currentPagePopupForm = [];
                $mdDialog.cancel();
              }*/
            }, () => {
            }).catch((error) => BaseService.getErrorLog(error));
          }
          /*in case of Void and reissue payment need to allow user to edit payment detail
           * so need to remove vm.paymentId and other data which requird to get from user again*/
          if (vm.isVoidAndReIssuePayment) {
            vm.refVoidPaymentId = vm.paymentId;
            vm.paidPackingSlip.systemId = undefined;
            vm.paidPackingSlip.paymentNumber = undefined;
            vm.paidPackingSlip.remark = undefined;
            vm.paidPackingSlip.paymentDate = vm.currentDate;
            vm.paymentId = undefined;
            $scope.paymentId = undefined;
          }
          if (vm.paymentId) {
            $scope.setFocusOnCloseButton();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      init();

      vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

      vm.checkFormDirty = (form, columnName) => BaseService.checkFormDirty(form, columnName);

      function zeroAmountPaymentConfirmation() {
        const obj = {
          messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SUPPLIER_INVOICE_ZERO_PAYMENT_CONFIRMATION,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        return DialogFactory.messageConfirmDialog(obj).then((yes) => yes, () => false);
      }

      function zeroAmountInvoiceConfirmation() {
        const obj = {
          messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.ZERO_AMOUNT_INVOICE_SELECTED_FOR_SUPPLIER_INVOICE_PAYMENT,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        return DialogFactory.messageConfirmDialog(obj).then((yes) => yes, () => false);
      }

      function saveInvoicePayment(pIsCheckPrint) {
        if (vm.paymentId) {
          const objData = {
            id: vm.paymentId,
            remark: vm.paidPackingSlip.remark
          };
          $scope.cgBusyLoading = PackingSlipFactory.updateSupplierPayment().query(objData).$promise.then((response) => {
            if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              vm.formPaidPackaging.$setPristine();
            } else {
              if (checkResponseHasCallBackFunctionPromise(response)) {
                response.alretCallbackFn.then(() => {
                  BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.formPaidPackaging);
                });
              }
            }
            $scope.saveBtnDisableFlag = false;
          }).catch((error) => {
            $scope.saveBtnDisableFlag = false;
            return BaseService.getErrorLog(error);
          });
        } else {
          vm.paidPackingSlip.paymentDate = vm.paidPackingSlip.paymentDate ? BaseService.getAPIFormatedDate(vm.paidPackingSlip.paymentDate) : null;
          vm.paidPackingSlip.billToAddress = BaseService.generateAddressFormateToStoreInDB(vm.billToAddress);
          vm.paidPackingSlip.billToContactPerson = BaseService.generateContactPersonDetFormat(vm.billToAddressContactPerson);
          vm.paidPackingSlip.payToAddress = BaseService.generateAddressFormateToStoreInDB(vm.payToAddress);
          vm.paidPackingSlip.payToContactPerson = BaseService.generateContactPersonDetFormat(vm.payToAddressContactPerson);

          const paidPackingList = [];
          _.map(vm.packingSlipData, (data) => {
            if (data.isSelected) {
              const obj = {
                id: data.id,
                paymentAmount: data.paymentAmount,
                //status: 'P',
                paidReceiptType: data.receiptType,
                paidIsTariffInvoice: data.isTariffInvoice
              };
              paidPackingList.push(obj);
            }
          });
          vm.paidPackingSlip.paidPackingList = paidPackingList;
          vm.paidPackingSlip.refPaymentMode = CORE.RefPaymentModeForInvoicePayment.Payable;

          $scope.cgBusyLoading = PackingSlipFactory.paidPackingSlip().query(vm.paidPackingSlip).$promise.then((response) => {
            if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              vm.formPaidPackaging.$setPristine();
              if (response.data && response.data.id) {
                vm.paymentId = response.data.id;
                $scope.paymentId = vm.paymentId;
                $scope.cgBusyLoading = $q.all([getPaymentToInformation(), retrieveSupplierInvoicePaymentLines()]).then(() => {
                  if (pIsCheckPrint) {
                    //print check
                    vm.printCheck();
                  }
                }).catch((error) => BaseService.getErrorLog(error));
              }
              //BaseService.currentPagePopupForm = [];
              //$mdDialog.cancel(true);
            } else {
              if (checkResponseHasCallBackFunctionPromise(response)) {
                response.alretCallbackFn.then(() => {
                  BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.formPaidPackaging);
                });
              }
            }
            $scope.saveBtnDisableFlag = false;
          }).catch((error) => {
            $scope.saveBtnDisableFlag = false;
            return BaseService.getErrorLog(error);
          });
        }
      }

      vm.paidAmount = (pIsCheckPrint) => {
        if (BaseService.focusRequiredField(vm.formPaidPackaging)) {
          return;
        }
        $scope.saveBtnDisableFlag = true;
        if (vm.isVoidAndReIssuePayment) {
          vm.voidAndReIssuePayment();
        }
        else {
          if (vm.paymentId) {
            saveInvoicePayment(pIsCheckPrint);
          } else {
            if (vm.paidPackingSlip && (!vm.paidPackingSlip.billToAddressID)) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ADDRESS_CONTACT_PERSON_REQUIRED_FOR_STATUS);
              messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.Address.SupplierBusinessAddress);
              return DialogFactory.messageAlertDialog({ messageContent }).then(() => $scope.saveBtnDisableFlag = false);
            } else if (vm.paidPackingSlip && vm.paidPackingSlip.billToAddressID && !vm.paidPackingSlip.billToContactPersonID) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ADDRESS_CONTACT_PERSON_REQUIRED_FOR_STATUS);
              messageContent.message = stringFormat(messageContent.message, `${vm.LabelConstant.Address.SupplierBusinessAddress} Contact Person`);
              return DialogFactory.messageAlertDialog({ messageContent }).then(() => $scope.saveBtnDisableFlag = false);
            }

            if (vm.paidPackingSlip && (!vm.paidPackingSlip.payToAddressID)) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ADDRESS_CONTACT_PERSON_REQUIRED_FOR_STATUS);
              messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.Address.RemitToAddress);
              return DialogFactory.messageAlertDialog({ messageContent }).then(() => $scope.saveBtnDisableFlag = false);
            } else if (vm.paidPackingSlip && vm.paidPackingSlip.payToAddressID && !vm.paidPackingSlip.payToContactPersonID) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ADDRESS_CONTACT_PERSON_REQUIRED_FOR_STATUS);
              messageContent.message = stringFormat(messageContent.message, `${vm.LabelConstant.Address.RemitToAddress} Contact Person`);
              return DialogFactory.messageAlertDialog({ messageContent }).then(() => $scope.saveBtnDisableFlag = false);
            }

            const checkMemo = _.some(vm.packingSlipData, (data) => data.isSelected === true && data.receiptType === 'I');
            if (!checkMemo) {
              const alertModel = {
                messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_PACKING_INVOICE
              };
              DialogFactory.messageAlertDialog(alertModel);
              $scope.saveBtnDisableFlag = false;
              return;
            }

            if (vm.paidPackingSlip.paymentAmount < 0) {
              const alertModel = {
                messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NO_NEED_TO_PAY_FOR_CREDIT_OR_ZERO_DUE
              };
              DialogFactory.messageAlertDialog(alertModel);
              $scope.saveBtnDisableFlag = false;
              return;
            }

            const isZeroAmountInvoice = _.some(vm.packingSlipData, (data) => data.isSelected === true && data.totalExtendedAmount === 0);

            if (isZeroAmountInvoice) {
              zeroAmountInvoiceConfirmation().then((zeroInvoiceResp) => {
                if (zeroInvoiceResp) {
                  if (vm.paidPackingSlip.paymentAmount === 0) {
                    zeroAmountPaymentConfirmation().then((zeroPaymentResp) => {
                      if (zeroPaymentResp) {
                        saveInvoicePayment(pIsCheckPrint);
                      } else {
                        $scope.saveBtnDisableFlag = false;
                      }
                    });
                  }
                  else {
                    saveInvoicePayment(pIsCheckPrint);
                  }
                } else {
                  $scope.saveBtnDisableFlag = false;
                }
              });
            }
            else if (vm.paidPackingSlip.paymentAmount === 0) {
              zeroAmountPaymentConfirmation().then((zeroPaymentResp) => {
                if (zeroPaymentResp) {
                  saveInvoicePayment(pIsCheckPrint);
                } else {
                  $scope.saveBtnDisableFlag = false;
                }
              });
            }
            else {
              saveInvoicePayment(pIsCheckPrint);
            }
          }
        }
      };

      vm.selectAllReceipt = () => {
        if (vm.isAllSelect) {
          _.map(vm.packingSlipData, (data) => {
            if (!data.isSelected) {
              data.isSelected = true;
              //data.paymentAmount = CalcSumofArrayElement([data.totalExtendedAmount, (data.totalPaidAmount * -1)], _amountFilterDecimal);
              setPaymentAmountForRow(data);
            }
          });
          $scope.isAnyRowSelected = true;
        } else {
          _.map(vm.packingSlipData, (data) => {
            data.isSelected = false;
          });
          $scope.isAnyRowSelected = false;
        }
        setBalanceAmountRowWise();
        setTotalPayableAmount();
      };

      vm.selectReceipt = (item) => {
        setPaymentAmountForRow(item);
        _.each(vm.packingSlipData, (d) => {
          if (d.refParentCreditDebitInvoiceno === item.id) {
            if (d.isSelected === false && item.isSelected === true) {
              setPaymentAmountForRow(d);
            }
            d.isSelected = item.isSelected;
          }
        });
        if (item.isSelected) {
          const checkAnyDeSelect = _.some(vm.packingSlipData, (data) => data.isSelected === false);
          if (checkAnyDeSelect) {
            vm.isAllSelect = false;
          }
          else {
            vm.isAllSelect = true;
          }
        } else {
          vm.isAllSelect = false;
        }
        $scope.isAnyRowSelected = _.some(vm.packingSlipData, (data) => data.isSelected === true);
        setBalanceAmountRowWise();
        setTotalPayableAmount();
      };

      function setTotalPayableAmount() {
        if (vm.paidPackingSlip) {
          vm.paidPackingSlip.totalPayableAmount = vm.paidPackingSlip.paymentAmount = vm.packingSlipTotalPayableAmount =
            CalcSumofArrayElement(_.map(vm.packingSlipData, (data) => {
              if (data.isSelected) {
                return data.paymentAmount;
              }
              else {
                return 0;
              }
            }), _amountFilterDecimal);
          setTotalPayableAmountFormat();
        }
      };

      function setBalanceAmountRowWise() {
        if (vm.packingSlipData && vm.packingSlipData.length > 0) {
          _.each(vm.packingSlipData, (data) => {
            if (data.isSelected) {
                data.balanceToPayAmount = CalcSumofArrayElement([data.totalExtendedAmount, (data.receiptType === 'C' || data.receiptType === 'D') ? data.markedForRefundAmt : 0, (data.totalPaidAmount * -1), (data.paymentAmount * -1)], _amountFilterDecimal);
            }
            else {
              data.paymentAmount = 0;
              data.balanceToPayAmount = CalcSumofArrayElement([data.totalExtendedAmount, (data.receiptType === 'C' || data.receiptType === 'D') ? data.markedForRefundAmt : 0, (data.totalPaidAmount * -1)], _amountFilterDecimal);
            }
          });
        }
      };

      function setPaymentAmountForRow(data) {
        data.paymentAmount = data.orgBalanceToPayAmount; //CalcSumofArrayElement([data.totalExtendedAmount, (data.totalPaidAmount * -1)], _amountFilterDecimal);
      }

      vm.onPayableAmountEdit = (item) => {
        var messageContentObj = '';
        if (item.receiptType === 'I') {
          if (item.paymentAmount < 0 || (item.totalExtendedAmount !== 0 && item.paymentAmount === 0)) {
            // payment amount must be greater than zero.
            messageContentObj = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.INVOICE_PAYMENT_AMOUNT_MUST_BE_GRATER_THAN_ZERO);
          }
          else if (item.paymentAmount > item.orgBalanceToPayAmount) {
            // payable amount should not be greater than 100.62
            messageContentObj = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.INVOICE_PAYMENT_AMOUNT_SHOULD_NOT_GRATER_THAN_BALANCE_AMOUNT);
            messageContentObj.message = stringFormat(messageContentObj.message, item.orgBalanceToPayAmount);
          }
        }
        else if (item.receiptType === 'C' || item.receiptType === 'D') {
          if (item.paymentAmount >= 0) {
            // payment amount must be less than zero.
            //messageContentObj = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.DEBIT_CREDIT_MEMO_PAYMENT_AMOUNT_MUST_BE_LESS_THAN_ZERO);
            item.paymentAmount = (item.paymentAmount * -1);/*if user enter positive value auto convert it negetive*/
          }
          if (item.paymentAmount < item.orgBalanceToPayAmount) {
            // payable amount should not be less than -100.62
            messageContentObj = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.DEBIT_CREDIT_MEMO_PAYMENT_AMOUNT_SHOULD_NOT_LESS_THAN_BALANCE_AMOUNT);
            messageContentObj.message = stringFormat(messageContentObj.message, item.orgBalanceToPayAmount);
          }
        }

        if (messageContentObj) {
          const alertModel = {
            messageContent: messageContentObj
          };
          DialogFactory.messageAlertDialog(alertModel).then(() => {
            const idx = _.findIndex(vm.packingSlipData, (data) => data.id === item.id);
            setFocus(vm.paymentFieldPrefixName + idx);
          }).catch((error) => BaseService.getErrorLog(error));
          setPaymentAmountForRow(item);
        }
        setBalanceAmountRowWise();
        setTotalPayableAmount();
      };

      vm.showApproveNote = (row, event) => {
        DialogFactory.dialogService(
          TRANSACTION.INVOICE_DETAIL_NOTE_POPUP_CONTROLLER,
          TRANSACTION.INVOICE_DETAIL_NOTE_POPUP_VIEW,
          event,
          row
        ).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
      };

      vm.printCheck = (isRemittanceReport) => {
        if (!vm.paymentId) {
          return;
        }

        if (isRemittanceReport === false && (!vm.paidPackingSlip.paymentAmount || vm.paidPackingSlip.paymentAmount === 0)) {
          const alertModel = {
            messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.IN_CASE_OF_ZERO_PAYMENT_CHECK_PRINT_NOT_REQUIRED
          };
          DialogFactory.messageAlertDialog(alertModel);
          return;
        }

        const isDownload = false;
        const paramObj = {
          paymentId: vm.paymentId,
          isRemittanceReport: isRemittanceReport ? isRemittanceReport : false,
          reportAPI: 'PackingSlip/checkPrintAndRemittanceReport'
        };
        ReportMasterFactory.generateReport(paramObj).then((response) => {
          const model = {
            multiple: true
          };
          if ($scope.$parent && $scope.$parent.vm) {
            if (isRemittanceReport) {
              $scope.$parent.vm.isPrintRemittDisabled = false;
            } else {
              $scope.$parent.vm.isPrintDisabled = false;
            }
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

      vm.voidPayment = () => {
        $scope.saveBtnDisableFlag = true;
        const loginUser = BaseService.loginUser;
        const invoicePaymentChange = {
          AccessRole: CORE.ROLE_ACCESS.VERIFICATION_ROLE_ACCESS,
          isAllowSaveDirect: false,
          popupTitle: 'Void ' + CORE.PageName.SupplierInvoicePayment,
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
                id: vm.paymentId,
                isPaymentVoided: true,
                voidPaymentReason: pswConfirmation.approvalReason,
                refPaymentModeOfInvPayment: CORE.RefPaymentModeForInvoicePayment.Payable
              };
              $scope.cgBusyLoading = PackingSlipFactory.voidSupplierInvoicePayment().query(objData).$promise.then((response) => {
                if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                  vm.formPaidPackaging.$setPristine();
                  $scope.$emit(USER.SupplierInvoiceVoidPaymentSaveSuccessBroadcast, null);
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
            $scope.saveBtnDisableFlag = false;
          }, () => {
            $scope.saveBtnDisableFlag = false;
          }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.voidAndReIssuePayment = () => {
        if (vm.paidPackingSlip.paymentNumberOld === vm.paidPackingSlip.paymentNumber) {
          $scope.saveBtnDisableFlag = false;
          NotificationFactory.information(TRANSACTION.SAVE_ON_NOCHANGES);
          return;
        }
        const loginUser = BaseService.loginUser;
        const invoicePaymentChange = {
          AccessRole: CORE.ROLE_ACCESS.VERIFICATION_ROLE_ACCESS,
          isAllowSaveDirect: false,
          popupTitle: 'Void & Reissue ' + CORE.PageName.SupplierInvoicePayment,
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
                refVoidPaymentId: vm.refVoidPaymentId,
                accountReference: vm.paidPackingSlip.accountReference,
                paymentType: vm.paidPackingSlip.paymentType,
                paymentNumber: vm.paidPackingSlip.paymentNumber,
                bankAccountMasID: vm.paidPackingSlip.bankAccountMasID,
                bankAccountNo: vm.paidPackingSlip.bankAccountNo,
                bankName: vm.paidPackingSlip.bankName,
                paymentDate: vm.paidPackingSlip.paymentDate ? BaseService.getAPIFormatedDate(vm.paidPackingSlip.paymentDate) : null,
                remark: vm.paidPackingSlip.remark,
                payToName: vm.paidPackingSlip.payToName,

                payToAddressID: vm.paidPackingSlip.payToAddressID,
                payToAddress: BaseService.generateAddressFormateToStoreInDB(vm.payToAddress),
                payToContactPersonID: vm.paidPackingSlip.payToContactPersonID,
                payToContactPerson: BaseService.generateContactPersonDetFormat(vm.payToAddressContactPerson),
                billToAddressID: vm.paidPackingSlip.billToAddressID,
                billToAddress: BaseService.generateAddressFormateToStoreInDB(vm.billToAddress),
                billToContactPersonID: vm.paidPackingSlip.billToContactPersonID,
                billToContactPerson: BaseService.generateContactPersonDetFormat(vm.billToAddressContactPerson),

                voidPaymentReason: pswConfirmation.approvalReason,
                paymentAmount: vm.paidPackingSlip.paymentAmount,
                refPaymentModeOfInvPayment: CORE.RefPaymentModeForInvoicePayment.Payable
              };
              $scope.cgBusyLoading = PackingSlipFactory.voidAndReIssueSupplierInvoicePayment().query(objData).$promise.then((response) => {
                if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                  vm.formPaidPackaging.$setPristine();
                  if (response.data && response.data.refPayementid) {
                    vm.paymentId = response.data.refPayementid;
                    $scope.paymentId = vm.paymentId;
                    $scope.cgBusyLoading = $q.all([getPaymentToInformation(), retrieveSupplierInvoicePaymentLines()]).then(() => {
                    }).catch((error) => BaseService.getErrorLog(error));
                  }
                }
                $scope.saveBtnDisableFlag = false;
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => {
            $scope.saveBtnDisableFlag = false;
          }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.refreshAccountReference = () => {
        $scope.cgBusyLoading = $q.all([getPaymentToInformation(true)]).then(() => {
        }).catch((error) => BaseService.getErrorLog(error));
      };

      $scope.$on(USER.SupplierInvoicePaymentSaveBroadcase, (event, pIsCheckPrint) => {
        vm.paidAmount(pIsCheckPrint);
      });

      $scope.$on(USER.SupplierInvoicePaymentCheckPrintBroadcast, () => {
        vm.printCheck(false);
      });

      $scope.$on(USER.SupplierInvoicePaymentRemottancePrintBroadcast, () => {
        vm.printCheck(true);
      });

      $scope.$on(USER.SupplierInvoiceVoidPaymentBroadcast, () => {
        vm.voidPayment();
      });

      $scope.$on(USER.SupplierInvoiceVoidAndReIssuePaymentBroadcast, () => {
        //vm.voidAndReIssuePayment();
        $scope.saveBtnDisableFlag = true;
        const PopupData = {
          packingSlipData: {
            paymentId: vm.paymentId,
            isVoidAndReIssuePayment: true,
            refVoidPaymentOrCheckNumber: vm.paidPackingSlip.paymentNumber
          },
          supplierDet: {
            supplierCode: vm.supplierCode,
            mfgCodeID: vm.mfgCodeID
          }
        };

        DialogFactory.dialogService(
          TRANSACTION.PAID_VERIFICATION_PACKAGING_CONTROLLER,
          TRANSACTION.PAID_VERIFICATION_PACKAGING_VIEW,
          _dummyEvent,
          PopupData).then(() => {
            $scope.saveBtnDisableFlag = false;
          }, (resp) => {
            if (resp) {
              $scope.isPaymentVoided = true;
            }
              $scope.saveBtnDisableFlag = false;
          }, (err) => BaseService.getErrorLog(err));
      });

      angular.element(() => {
        BaseService.currentPagePopupForm = [vm.formPaidPackaging];
        $scope.$parent.vm.formPaidPackaging = vm.formPaidPackaging;
      });
      vm.cancel = () => {
        const isdirty = vm.checkFormDirty(vm.formPaidPackaging, vm.checkDirtyObject);
        if (isdirty) {
          BaseService.showWithoutSavingAlertForPopUp();
        } else {
          vm.formPaidPackaging.$setPristine();
          BaseService.currentPagePopupForm = [];
          $mdDialog.cancel();
        }
      };

      vm.goToPaymentMethodList = () => {
        BaseService.goToGenericCategoryPayablePaymentMethodList();
      };
    }
  }
})();
