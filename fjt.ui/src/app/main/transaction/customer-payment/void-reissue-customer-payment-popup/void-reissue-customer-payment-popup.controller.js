(function () {
  'use strict';

  angular
    .module('app.transaction.customerpayment')
    .controller('VoidReissueCustomerPaymentController', VoidReissueCustomerPaymentController);

  function VoidReissueCustomerPaymentController($mdDialog, CORE, BaseService, data, GenericCategoryFactory, $q,
    BankFactory, DialogFactory, USER, CustomerPaymentFactory, PackingSlipFactory, TRANSACTION, $filter, $timeout) {
    const vm = this;
    vm.popupParamData = data;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = CORE.LabelConstant;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.loginUser = BaseService.loginUser;
    vm.emptyStateCustInvoiceConst = TRANSACTION.TRANSACTION_EMPTYSTATE.CUSTOMER_INVOICE;
    vm.custPayDiffNotesConst = TRANSACTION.CustomerPaymentDiffNotes;
    vm.paymentMethodTypeList = [];
    vm.bankList = [];
    vm.custVoidReissuePaymentModel = {};
    vm.customerAllowPaymentDays = angular.copy(_customerAllowPaymentDays);
    vm.customerPaymentNotesConst = TRANSACTION.CustomerPaymentNotes;
    vm.receivableRefPaymentModeConst = TRANSACTION.ReceivableRefPaymentMode;
    vm.custVoidReissuePaymentModel.underPaymentAction = TRANSACTION.UnderPaymentActions.LeavethisAsAnUnderpayment.Value;
    vm.custInvoiceSubStatusListConst = CORE.CUSTINVOICE_SUBSTATUS;

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
    vm.saveBtnDisableFlag = false;
    const CategoryTypeObjList = angular.copy(CORE.CategoryType);
    vm.headerdata = [];
    vm.query = {
      order: ''
    };

    vm.RadioGroup = {
      underPaymentActionRBG: {
        array: TRANSACTION.UnderPaymentActions
      },
      overPaymentActionRBG: {
        array: TRANSACTION.OverPaymentActions
      }
    };

    const getAllFeatureRights = () => {
      vm.allowToVoidAndReIssuePaymentFeature = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToVoidAndReIssueCustomerPayment);
      if ((vm.allowToVoidAndReIssuePaymentFeature === null || vm.allowToVoidAndReIssuePaymentFeature === undefined) && (vm.reTryCount < _configGetFeaturesRetryCount)) {
        getAllRights(); // put for hard reload option as it will not get data from feature rights
        vm.reTryCount++;
      }
    };
    getAllFeatureRights();

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
          if (vm.popupParamData.custPaymentMstID) {
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
        if (vm.popupParamData.custPaymentMstID) {
          vm.bankList = bank.data;
        }
        else {
          vm.bankList = _.filter(bank.data, (item) => item.isActive);
        }
        return $q.resolve(vm.bankList);
      }
    }).catch((error) => BaseService.getErrorLog(error));

    const initAutoComplete = () => {
      vm.autoCompletePaymentMethodType = {
        columnName: 'gencCategoryName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.custVoidReissuePaymentModel ? vm.custVoidReissuePaymentModel.paymentType : null,
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
          vm.custVoidReissuePaymentModel.paymentType = (obj) ? obj.gencCategoryID : null;
        },
        callbackFn: getPaymentMethodType
      };
      vm.autoCompleteBankAccountNumber = {
        columnName: 'accountCode',
        controllerName: USER.ADMIN_BANK_ADD_UPDATE_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_BANK_ADD_UPDATE_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.custVoidReissuePaymentModel ? vm.custVoidReissuePaymentModel.bankAccountMasID : null,
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
            vm.custVoidReissuePaymentModel.bankAccountMasID = obj.id;
            vm.custVoidReissuePaymentModel.bankAccountNo = obj.accountCode;
            vm.custVoidReissuePaymentModel.bankName = obj.bankName;
          }
          else {
            vm.custVoidReissuePaymentModel.bankAccountMasID = null;
            vm.custVoidReissuePaymentModel.bankAccountNo = null;
            vm.custVoidReissuePaymentModel.bankName = null;
          }
        }
      };
    };

    // to get customer invoice payment master data
    const retrieveCustInvPaymentMstData = () => CustomerPaymentFactory.getCustInvPaymentMstData().query({
      customerPaymentMstID: vm.popupParamData.custPaymentMstID,
      refPaymentMode: TRANSACTION.ReceivableRefPaymentMode.ReceivablePayment.code
    }).$promise.then((resp) => {
      if (resp && resp.data && resp.status === CORE.ApiResponseTypeStatus.SUCCESS) {
        vm.custVoidReissuePaymentModel = resp.data.custPaymentMstData;
        // default under payment action is leave amount as under payment
        vm.custVoidReissuePaymentModel.underPaymentAction = TRANSACTION.UnderPaymentActions.LeavethisAsAnUnderpayment.Value;

        /* if vm.popupParamData.isReadOnlyMode then display original data only */
        if (!vm.popupParamData.isReadOnlyMode) {
          vm.custVoidReissuePaymentModel.paymentNumber = null;
          vm.custVoidReissuePaymentModel.systemId = null;
        }
        if (vm.custVoidReissuePaymentModel.paymentDate) {
          vm.custVoidReissuePaymentModel.paymentDate = BaseService.getUIFormatedDate(vm.custVoidReissuePaymentModel.paymentDate, vm.DefaultDateFormat);
        }
        if (vm.autoCompleteBankAccountNumber) {
          vm.autoCompleteBankAccountNumber.keyColumnId = vm.custVoidReissuePaymentModel.bankAccountMasID;
        }
        if (vm.autoCompletePaymentMethodType) {
          vm.autoCompletePaymentMethodType.keyColumnId = vm.custVoidReissuePaymentModel.paymentType;
        }
      }
      return $q.resolve(resp);
    }).catch((error) => BaseService.getErrorLog(error));

    // get all invoices of customer with payment information
    const retrieveAllInvoiceOfCustomerPayment = () => {
      const custPayInfo = {
        customerID: vm.popupParamData.mfgcodeID,
        payementMstID: vm.popupParamData.custPaymentMstID,
        transTypeForInvoice: CORE.TRANSACTION_TYPE.INVOICE,
        isGetOnlyPaidInvoiceFromPayment: true
      };
      return CustomerPaymentFactory.getAllInvoiceOfCustomerPayment().query({ custPayInfo: custPayInfo }).$promise.then((resp) => {
        vm.custInvoicePaymentList = [];
        clearSumOfAmountForCustInvoicePaymentList();
        if (resp && resp.data) {
          if (resp.data.customerInvoiceList && resp.data.customerInvoiceList.length > 0) {
            vm.custInvoicePaymentList = resp.data.customerInvoiceList;
            /* don't put order by below foreach as in for each date converted to string  */
            vm.custInvoicePaymentList = _.orderBy(vm.custInvoicePaymentList, ['invoiceDate', 'invoiceMstID'], ['asc', 'asc']);
            _.each(vm.custInvoicePaymentList, (invItem) => {
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
            });
            if (vm.custVoidReissuePaymentModel && vm.custVoidReissuePaymentModel.id) {
              setAllInvAndAmtDet();
            }
          }
          vm.customerPastDueBalanceTillToday = resp.data.customerPastDueBalance;
        }
        return $q.resolve(resp);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const init = () => {
      const promises = [getPaymentMethodType(), getBankList(), retrieveCustInvPaymentMstData(), retrieveAllInvoiceOfCustomerPayment()];
      vm.cgBusyLoading = $q.all(promises).then(() => {
        initAutoComplete();
        setAllInvAndAmtDet();
        if (!vm.popupParamData.isReadOnlyMode && vm.custVoidReissuePaymentModel.isZeroPayment && vm.custVoidReissuePaymentForm) {
          vm.custVoidReissuePaymentForm.$setDirty();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    init();

    // common function to set invoice amount and check-box changes
    const setAllInvAndAmtDet = () => {
      setSumOfAmountForCustInvoicePaymentList();
      setSumOfCurrPayAmountForCustInvPaymentList();
      const checkAnyNotSelectedInv = _.some(vm.custInvoicePaymentList, (data) => !data.isSelected);
      vm.isAllSelectFromCustInvoicePaymentList = checkAnyNotSelectedInv ? false : true;
    };

    // clear all sum calculation
    const clearSumOfAmountForCustInvoicePaymentList = () => {
      vm.custInvoicePaymentList = [];
      vm.sumOfOriginalPayAmountForSelectedInvoice = 0;
      //vm.sumOfPastPaidAmountForSelectedInvoice = 0;
      //vm.sumOfDueAmountForSelectedInvoice = 0;
      vm.sumOfLiveDueAmountForSelectedInvoice = 0;
      vm.sumOfPaymentAmountForSelectedInvoice = 0;
      vm.diffAmtBetPayAmtAndSelectedInvAmt = 0;
      vm.totDueAmountOfSelectedInv = 0;
      vm.totPayAmountOfSelectedInv = 0;
      vm.totUnderPaymentOfDifferentSelectedInv = 0;
    };

    // to set sum count for invoice table payment
    const setSumOfAmountForCustInvoicePaymentList = () => {
      vm.sumOfOriginalPayAmountForSelectedInvoice = parseFloat((_.sumBy(vm.custInvoicePaymentList, (o) => o.originalPayAmountOfInvoice) || 0).toFixed(2));
      vm.sumOfLiveDueAmountForSelectedInvoice = parseFloat((_.sumBy(vm.custInvoicePaymentList, (o) => o.liveDueAmountForSelectedInvoice) || 0).toFixed(2));
      vm.sumOfPaymentAmountForSelectedInvoice = parseFloat((_.sumBy(vm.custInvoicePaymentList, (o) => o.paymentAmountForSelectedInvoice) || 0).toFixed(2));

      vm.diffAmtBetPayAmtAndSelectedInvAmt = parseFloat(((vm.custVoidReissuePaymentModel.paymentAmount || 0) - (vm.sumOfPaymentAmountForSelectedInvoice)).toFixed(2));
    };

    // sum of paying amount
    const setSumOfCurrPayAmountForCustInvPaymentList = () => {
      vm.sumOfPaymentAmountForSelectedInvoice = parseFloat((_.sumBy(vm.custInvoicePaymentList, (o) => o.paymentAmountForSelectedInvoice) || 0).toFixed(2));

      vm.diffAmtBetPayAmtAndSelectedInvAmt = parseFloat(((vm.custVoidReissuePaymentModel.paymentAmount || 0) - (vm.sumOfPaymentAmountForSelectedInvoice)).toFixed(2));

      const selectedInvList = _.filter(vm.custInvoicePaymentList, (invItem) => invItem.isSelected);

      /* total due amount = if invoice payment added then remaining due amount + paid amount = total due
       if invoice payment not added(new payment) then direct due amount of invoice */
      vm.totDueAmountOfSelectedInv = parseFloat((_.sumBy(selectedInvList, (o) => o.invPaymentDetMstID ? parseFloat(((o.dueAmountForSelectedInvoice || 0) + (o.invPaidAmtFromCurrPaymentDet || 0)).toFixed(2)) : (o.dueAmountForSelectedInvoice || 0)
      ) || 0).toFixed(2));

      /* below is total paying amount of different selected invoice */
      vm.totPayAmountOfSelectedInv = parseFloat((_.sumBy(selectedInvList, (o) => o.paymentAmountForSelectedInvoice) || 0).toFixed(2));

      vm.checkAnyInvSelected = _.some(vm.custInvoicePaymentList, (data) => data.isSelected);
      if (vm.checkAnyInvSelected) {
        /* total underpayment amount */
        vm.totUnderPaymentOfDifferentSelectedInv = parseFloat((parseFloat(vm.totDueAmountOfSelectedInv.toFixed(2)) - parseFloat(vm.totPayAmountOfSelectedInv.toFixed(2))).toFixed(2));

        /* total underpayment amount */
        vm.totOverPaymentOfDifferentSelectedInv = (vm.totUnderPaymentOfDifferentSelectedInv === 0 && parseFloat((vm.custVoidReissuePaymentModel.paymentAmount || 0).toFixed(2)) > parseFloat(vm.totDueAmountOfSelectedInv.toFixed(2))) ? parseFloat((parseFloat((vm.custVoidReissuePaymentModel.paymentAmount || 0).toFixed(2)) - parseFloat(vm.totDueAmountOfSelectedInv.toFixed(2))).toFixed(2)) : 0;
      } else {
        vm.totUnderPaymentOfDifferentSelectedInv = 0;
        vm.totOverPaymentOfDifferentSelectedInv = 0;
      }
      vm.totalInvSelectedCount = (_.countBy(vm.custInvoicePaymentList, (data) => data.isSelected).true) || 0;
    };

    /* save - void current payment and reissue same  */
    vm.saveVoidAndReissuePayment = () => {
      vm.saveBtnDisableFlag = true;
      if (BaseService.focusRequiredField(vm.custVoidReissuePaymentForm)) {
        vm.saveBtnDisableFlag = false;
        return;
      }

      // get invalid main payment amount
      if ((vm.custVoidReissuePaymentModel.paymentAmount === null) || (vm.custVoidReissuePaymentModel.paymentAmount === undefined) || (vm.custVoidReissuePaymentModel.paymentAmount === '') || ((vm.custVoidReissuePaymentModel.paymentAmount || 0) < 0)) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.PLEASE_ENTER_VALID_FIELD_VALUE);
        messageContent.message = stringFormat(messageContent.message, 'payment amount');
        const model = {
          messageContent: messageContent
        };
        return DialogFactory.messageAlertDialog(model).then(() => {
          vm.saveBtnDisableFlag = false;
          setFocusByName('paymentNumberReissue');
        }).catch((error) => BaseService.getErrorLog(error));
      }

      // zero payment invoice then at least one invoice must be selected(added) as 0 invoice payment
      if (vm.custVoidReissuePaymentModel.isZeroPayment) {
        const isAnyZeroInvPaySelected = _.some(vm.custInvoicePaymentList, (invItem) => invItem.isSelected && invItem.originalPayAmountOfInvoice === 0);
        if (!isAnyZeroInvPaySelected) {
          const model = {
            messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SELECT_ONE_ZERO_AMT_INV_CUST_PAYMENT)
          };
          return DialogFactory.messageAlertDialog(model).then(() => {
            vm.saveBtnDisableFlag = false;
            const firstZeroInvItem = _.find(vm.custInvoicePaymentList, (invItem) => invItem.originalPayAmountOfInvoice === 0);
            if (firstZeroInvItem) {
              setFocus('isSelected_' + firstZeroInvItem.invoiceMstID);
            }
            return;
          }).catch((error) => {
            vm.saveBtnDisableFlag = false;
            BaseService.getErrorLog(error);
          });
        }
      }

      const requiredDet = {};

      const msgContentForCopyDoc = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.COPY_DOC_WHILE_REISSUE_PAYMENT_CONFM);
      msgContentForCopyDoc.message = stringFormat(msgContentForCopyDoc.message, vm.popupParamData.paymentNumber);
      const obj = {
        messageContent: msgContentForCopyDoc,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      return DialogFactory.messageConfirmDialog(obj).then((resp) => {
        if (resp) {
          requiredDet.isCopyDocumentForReissuePayment = true;
          takePasswordConfirmation(requiredDet);
        }
      }, () => {
        // cancel block
        requiredDet.isCopyDocumentForReissuePayment = false;
        takePasswordConfirmation(requiredDet);
      }).catch((error) => {
        vm.saveBtnDisableFlag = false;
        BaseService.getErrorLog(error);
      });
    };

    const takePasswordConfirmation = (requiredDet) => {
      const invoicePaymentChange = {
        AccessRole: CORE.ROLE_ACCESS.VERIFICATION_ROLE_ACCESS,
        isAllowSaveDirect: false,
        popupTitle: 'Void & Re-Receive ' + CORE.PageName.CustomerPayment,
        confirmationType: CORE.Generic_Confirmation_Type.CUSTOMER_PAYMENT_VOID,
        isOnlyPassword: true,
        createdBy: vm.loginUser.userid,
        updatedBy: vm.loginUser.userid
      };
      return DialogFactory.dialogService(
        CORE.GENERIC_CONFIRMATION_MODAL_CONTROLLER,
        CORE.GENERIC_CONFIRMATION_MODAL_VIEW,
        null,
        invoicePaymentChange).then((pswConfirmation) => {
          if (pswConfirmation) {
            const custVoidReissuePaymentObj = {
              refVoidPaymentId: vm.popupParamData.custPaymentMstID,
              paymentNumber: vm.custVoidReissuePaymentModel.paymentNumber,
              paymentDate: BaseService.getAPIFormatedDate(vm.custVoidReissuePaymentModel.paymentDate),
              paymentType: vm.custVoidReissuePaymentModel.isZeroPayment ? null : vm.autoCompletePaymentMethodType.keyColumnId,
              accountReference: vm.custVoidReissuePaymentModel.accountReference,
              bankAccountMasID: vm.custVoidReissuePaymentModel.isZeroPayment ? null : vm.autoCompleteBankAccountNumber.keyColumnId,
              bankAccountNo: vm.custVoidReissuePaymentModel.isZeroPayment ? null : vm.custVoidReissuePaymentModel.bankAccountNo,
              bankName: vm.custVoidReissuePaymentModel.isZeroPayment ? null : vm.custVoidReissuePaymentModel.bankName,
              remark: vm.custVoidReissuePaymentModel.remark,
              refPaymentModeOfInvPayment: CORE.RefPaymentModeForInvoicePayment.Receivable,
              voidPaymentReason: pswConfirmation.approvalReason,
              isConfmTakenForDuplicateCheckNo: false,
              mfgcodeID: vm.popupParamData.mfgcodeID,
              gencFileOwnerTypeForCustPayment: CORE.AllEntityIDS.CustomerPayment.Name,
              isCopyDocumentForReissuePayment: requiredDet.isCopyDocumentForReissuePayment,
              isCustomerZeroPayment: vm.custVoidReissuePaymentModel.isZeroPayment || false,
              depositBatchNumber: vm.custVoidReissuePaymentModel.depositBatchNumber,
              toBeVoidPaymentNumber: vm.popupParamData.paymentNumber
            };
            saveVoidAndReIssueInvoicePaymentDet(custVoidReissuePaymentObj);
          }
        }, () => {
          vm.saveBtnDisableFlag = false;
          setFocusByName('paymentNumberReissue');
        }).catch((error) => {
          vm.saveBtnDisableFlag = false;
          BaseService.getErrorLog(error);
        });
    };

    // save void reissue payment details
    const saveVoidAndReIssueInvoicePaymentDet = (custVoidReissuePaymentObj) => {
      vm.cgBusyLoading = PackingSlipFactory.voidAndReIssueSupplierInvoicePayment().query(custVoidReissuePaymentObj).$promise.then((resp) => {
        vm.saveBtnDisableFlag = false;
        if (resp && resp.status === CORE.ApiResponseTypeStatus.SUCCESS && resp.data && resp.data.refPayementid) {
          $timeout(() => {
            vm.goToCustomerPaymentDetailPage(resp.data.refPayementid);
          }, 1500);
          vm.custVoidReissuePaymentForm.$setPristine();
          BaseService.currentPagePopupForm = [];
          $mdDialog.cancel(true);
        } else if (resp && resp.status === CORE.ApiResponseTypeStatus.FAILED && resp.errors && resp.errors.data) {
          if (resp.errors.data.isDuplicateCheckPaymentNo && custVoidReissuePaymentObj.isConfmTakenForDuplicateCheckNo === false) {
            // take confirmation for duplicate payment# or check#
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_PAYMENT_WITH_DUPLICATE_PAY_CHECK_NO_CONFM);
            messageContent.message = stringFormat(messageContent.message, vm.custVoidReissuePaymentModel.paymentNumber);

            const obj = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
            };
            DialogFactory.messageConfirmDialog(obj).then((resp) => {
              if (resp) {
                custVoidReissuePaymentObj.isConfmTakenForDuplicateCheckNo = true;
                saveVoidAndReIssueInvoicePaymentDet(custVoidReissuePaymentObj);
              }
            }, () => {
              // cancel block
              vm.saveBtnDisableFlag = false;
              setFocusByName('paymentNumberReissue');
            }).catch((error) => {
              vm.saveBtnDisableFlag = false;
              BaseService.getErrorLog(error);
            });
          } else if (resp.errors.data.isPaymentAlreadyVoided) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_PAYMENT_ALREADY_VOIDED);
            messageContent.message = stringFormat(messageContent.message, vm.popupParamData.paymentNumber, 'customer payment', 'payment# or check#');
            const model = {
              messageContent: messageContent
            };
            DialogFactory.messageAlertDialog(model).then(() => {
              vm.custVoidReissuePaymentForm.$setPristine();
              BaseService.currentPagePopupForm = [];
              $mdDialog.cancel(true);
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }
      }).catch((error) => {
        vm.saveBtnDisableFlag = false;
        BaseService.getErrorLog(error);
      });
    };

    //// to refresh customer payment details
    //vm.refreshPaymentDet = () => {
    //  const isdirty = checkFormDirty(vm.custVoidReissuePaymentForm);
    //  if (isdirty) {
    //    showWithoutSavingAlertForPopUp();
    //    return false;
    //  } else {
    //    getLatestInvPaymentDet();
    //  }
    //};

    const getLatestInvPaymentDet = () => {
      if (vm.popupParamData.custPaymentMstID) {
        retrieveCustInvPaymentMstData();
      }
      const custPayDet = {
        customerID: vm.popupParamData.mfgcodeID
      };
      retrieveAllInvoiceOfCustomerPayment(custPayDet);
    };

    // to move at invoice list page with filter data
    vm.moveToInvoiceListPageWithFilter = () => {
      const searchData = {
        customerID: vm.popupParamData.mfgcodeID,
        dueDate: BaseService.getCurrentDate(),
        custInvSubStatusList: [vm.custInvoiceSubStatusListConst.INVOICED, vm.custInvoiceSubStatusListConst.CORRECTEDINVOICED]
      };
      BaseService.goToCustInvListWithTermsDueDateSearch(searchData);
    };

    /* open popup to display received/paid data */
    vm.showAppliedInvDPAmount = (invItem, refPaymentModeConst) => {
      if (invItem) {
        const data = {
          id: invItem.invoiceMstID,
          mfgCodeID: vm.popupParamData.mfgcodeID,
          invoiceNumber: invItem.invoiceNumber,
          customerName: vm.popupParamData.customerFullName,
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

    vm.cancel = () => {
      let isdirty = false;
      if (!vm.popupParamData.isReadOnlyMode) {
        isdirty = checkFormDirty(vm.custVoidReissuePaymentForm, null);
      }
      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        vm.custVoidReissuePaymentForm.$setPristine();
        BaseService.currentPagePopupForm = [];
        $mdDialog.cancel();
      }
    };

    /* alert pop up added here for lose updated changes */
    const showWithoutSavingAlertForPopUp = () => {
      const obj = {
        messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_APPLY_REFRESH_ALERT),
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((resp) => {
        if (resp) {
          getLatestInvPaymentDet();
          vm.custVoidReissuePaymentForm.$setPristine();
        }
      }, () => {
        // cancel block
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
      BaseService.goToGenericCategoryReceivablePaymentMethodList();
    };

    /* to go at bank list page (account code/name) */
    vm.goToBankList = () => {
      BaseService.goToBankList();
    };

    /* to go at customer bill to address page */
    vm.goToCustomerBillToPage = () => {
      BaseService.goToCustomer(vm.popupParamData.mfgcodeID, false);
    };

    /* to go at customer payment list page */
    vm.goToCustomerPaymentList = () => {
      BaseService.goToCustomerPaymentList();
    };

    //go to customer detail page
    vm.goToCustomerDetail = () => {
      BaseService.goToCustomer(vm.popupParamData.mfgcodeID);
    };

    /* to go at customer invoice page  */
    vm.goToCustInvoiceDetail = (invoiceMstID) => {
      BaseService.goToManageCustomerInvoice(invoiceMstID);
    };

    // to go at customer payment detail page
    vm.goToCustomerPaymentDetailPage = (custPaymentMstID) => {
      BaseService.goToCustomerPaymentDetail(custPaymentMstID);
    };

    // set header data
    if (vm.popupParamData && vm.popupParamData.paymentNumber) {
      vm.headerdata.push({
        label: vm.popupParamData.isReadOnlyMode ? 'Payment# or Check#' : 'Ref Void Payment# or Check#',
        value: vm.popupParamData.paymentNumber,
        displayOrder: 1,
        labelLinkFn: vm.goToCustomerPaymentList,
        valueLinkFn: vm.goToCustomerPaymentDetailPage,
        valueLinkFnParams: vm.popupParamData.custPaymentMstID,
        isCopy: true
      });
    }

    angular.element(() => {
      BaseService.currentPagePopupForm = [vm.custVoidReissuePaymentForm];
    });
  }
})();
