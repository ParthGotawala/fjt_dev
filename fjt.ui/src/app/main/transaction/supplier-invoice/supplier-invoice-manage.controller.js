(function () {
  'use strict';

  angular.module('app.transaction.supplierInvoice')
    .controller('ManageSupplierInvoiceController', ManageSupplierInvoiceController);

  /** @ngInject */
  function ManageSupplierInvoiceController($scope, $rootScope, $state, $stateParams, $timeout, $q, $filter, socketConnectionService, BaseService, MasterFactory, PackingSlipFactory,
    DialogFactory, USER, CORE, TRANSACTION, uiGridGroupingConstants, GenericCategoryFactory, SupplierInvoiceFactory, DataElementTransactionValueFactory, CustomerFactory, ComponentFactory) {
    const vm = this;
    vm.CORE = CORE;
    vm.Transaction = TRANSACTION;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.editRefundAmountDisabled = true;
    vm.CurrentState = $state.current.name;
    vm.tabType = $stateParams.type;
    vm.packingSlipID = $stateParams.id;
    vm.refPackingSlipId = 0;
    vm.slipType = $stateParams.slipType;
    vm.packingSlipNumber = $stateParams.packingSlipNumber;
    vm.LabelConstant = CORE.LabelConstant;
    vm.selectedTabIndex = 0;
    vm.packingSlipDocumentTabName = CORE.PackingslipDocumentTab;
    vm.supplierInvoiceDocumentTabName = CORE.SupplierInvoiceDocumentTab;
    vm.packingSlipInvoiceTabName = CORE.PackingSlipInvoiceTabName;
    vm.miscTabName = CORE.MISCTabName;
    vm.loginUser = BaseService.loginUser;
    const CategoryTypeObjList = angular.copy(CORE.CategoryType);
    vm.isDisableEditPageFields = false;
    vm.IsInvoiceState = false;
    vm.IsDebitMemoState = false;
    vm.IsCreditMemoState = false;
    vm.IsInvoiceTab = false;
    vm.IsPackingSlipDocumentTab = false;
    vm.IsSupplierInvoiceDocumentTab = false;
    vm.IsMISCTab = false;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.DateTimeFormat = _dateTimeDisplayFormat;
    vm.maxLengthForDescription = _maxLengthForDescription;
    vm.invoiceType = TRANSACTION.invoiceType;
    vm.creditMemoType = TRANSACTION.creditMemoType;
    vm.debitMemoType = TRANSACTION.debitMemoType;
    vm.isGetPSDetail = false;
    vm.isHideDelete = false;
    vm.isUpdatable = true;
    vm.isViewTemplate = true;
    vm.sourceData = [];
    vm.PackingSlipStatus = CORE.PackingSlipStatus;
    const amountDecimal = _amountFilterDecimal;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.VerificationGridHeaderDropdown = CORE.InvoiceApproveStatusOptionsGridHeaderDropdown;
    vm.InvoiceApproveMemoOptionsGridHeaderDropdown = CORE.InvoiceApproveMemoOptionsGridHeaderDropdown;
    vm.ConfirmedZeroInvoiceGridHeaderDropdown = CORE.ConfirmedZeroInvoiceGridHeaderDropdown;
    vm.InvoiceDetailDisable = false;
    vm.recordUpdate = false;
    let totalExtendedPriceForReceivedPriceDisplay = null;
    let totalCreditMemoDisplay = null;
    let debitMemoAmount = null;
    vm.totalAmountDifference = null;
    vm.InvoiceToPODifference = null;
    vm.totalRefundedAmount = 0;
    vm.packingSlipDocumentCount = 0;
    vm.supplierInvoiceDocumentCount = 0;
    vm.packingSlipEntityName = CORE.AllEntityIDS.PackingSlip.Name;
    vm.OtherDetailTitle = CORE.OtherDetail.TabName;
    vm.Entity = CORE.Entity;
    vm.EntityName = vm.Entity.SupplierInvoice;
    vm.AllEntityIDS = CORE.AllEntityIDS;
    vm.invoiceApprovalStatusOptionsGridHeaderDropdown = CORE.InvoiceApprovalStatusOptionsGridHeaderDropdown;
    vm.reGetInvoiceDetailDisable = true;
    vm.TabName = null;
    vm.dataElementList = [];
    vm.entityID = 0;
    vm.fileList = {};
    vm.copyPackingSlip = {};
    $scope.$parent.vm.saveBtnDisableFlag = false;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.SUPPLIER_INVOICE;
    let isReGetInformationPopUpOpen = false;
    vm.dropDownPackingSlipReceivedStatus = TRANSACTION.dropDownPackingSlipReceivedStatus;
    vm.gridConfig = CORE.gridConfig;
    vm.lineVariance = null;
    vm.lineQtyVariance = null;
    vm.dueInvoiceMessage = stringFormat(TRANSACTION.INVOICE_TOTAL_DUE_SAME_TOTAL_DUE, 'Invoice Total', 'Per Invoice\'s Invoice Total');
    vm.dueCreditMemoMessage = stringFormat(TRANSACTION.INVOICE_TOTAL_DUE_SAME_TOTAL_DUE, 'Credit Memo Total', 'Per Invoice\'s Credit Memo Total');
    vm.dueDebitMemoMessage = stringFormat(TRANSACTION.INVOICE_TOTAL_DUE_SAME_TOTAL_DUE, 'Debit Memo Total', 'Per Invoice\'s Debit Memo Total');
    vm.dueRMACreditMessage = stringFormat(TRANSACTION.INVOICE_TOTAL_DUE_SAME_TOTAL_DUE, 'Credit Memo Total', 'Per Credit Memo\'s Credit Memo Total');

    vm.billToAddress = null;
    vm.billToAddressContactPerson = null;
    vm.billToAddressViewActionBtnDet = angular.copy(CORE.CustAddressViewActionBtn);
    vm.billToAddressContPersonViewActionBtnDet = angular.copy(CORE.ContactPersonViewActionBtn);

    let idOfSelectMultipleBarcode = null;
    vm.invoiceApprovalStatusNA = _.find(vm.invoiceApprovalStatusOptionsGridHeaderDropdown, (a) => a.value === 'N/A');

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

    vm.billToContactPersonAddUpdateCallback = (ev, appliedContactPerson) => {
      if (appliedContactPerson) {
        vm.billToAddressContactPerson = appliedContactPerson || null;
        vm.packingSlip.billToContactPersonID = appliedContactPerson ? appliedContactPerson.personId : null;
        vm.billToAddressViewAddrOtherDet.alreadySelectedPersonId = vm.packingSlip.billToContactPersonID;
        vm.supplierInvoiceForm.$setDirty();
      }
    };

    vm.billToAddressAddUpdateCallback = (ev, appliedAddress) => {
      if (appliedAddress) {
        vm.billToAddress = appliedAddress;
        vm.packingSlip.billToAddressID = appliedAddress.id;
        vm.billToAddressViewAddrOtherDet.alreadySelectedAddressID = vm.packingSlip.billToAddressID;
        vm.billToAddressContactPerson = (appliedAddress && appliedAddress.contactPerson) ? appliedAddress.contactPerson : null;
        vm.packingSlip.billToContactPersonID = vm.billToAddressContactPerson ? vm.billToAddressContactPerson.personId : null;
        vm.billToAddressViewAddrOtherDet.alreadySelectedPersonId = vm.packingSlip.billToContactPersonID;
        vm.supplierInvoiceForm.$setDirty();
      }
    };

    vm.removeAddress = () => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DEFINE_ADDRESS_REMOVE_CONFIRMATION);
      messageContent.message = stringFormat(messageContent.message, 'supplier business ');
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then(() => {
        vm.packingSlip.billToContactPersonID = vm.packingSlip.billToAddressID = vm.billToAddressViewAddrOtherDet.alreadySelectedPersonId = vm.billToAddressViewAddrOtherDet.alreadySelectedAddressID = vm.billToAddressContactPerson = vm.billToAddress = null;
        vm.billToAddressViewActionBtnDet.Update.isDisable = vm.billToAddressViewActionBtnDet.Delete.isDisable = true;
        vm.supplierInvoiceForm.$setDirty();
      }, () => { });
    };

    vm.removeContactPerson = () => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONTACT_PERSON_FROM_ADDR);
      messageContent.message = stringFormat(messageContent.message, 'supplier business ');
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then(() => {
        vm.packingSlip.billToContactPersonID = vm.billToAddressContactPerson = vm.billToAddressViewAddrOtherDet.alreadySelectedPersonId = null;
        vm.billToAddressContPersonViewActionBtnDet.Update.isDisable = vm.billToAddressContPersonViewActionBtnDet.Delete.isDisable = true;
        vm.supplierInvoiceForm.$setDirty();
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const watchSupplierInvoiceForm = $scope.$watch('vm.supplierInvoiceForm', (newValue) => {
      $scope.$parent.vm.supplierInvoiceForm = newValue;
    });
    const watchmiscForm = $scope.$watch('vm.miscForm', (newValue) => {
      $scope.$parent.vm.miscForm = newValue;
    });

    if (vm.CurrentState === vm.Transaction.TRANSACTION_MANAGE_SUPPLIER_INVOICE_STATE) {
      vm.IsInvoiceState = true;
      vm.InvoiceTotalLabel = 'Invoice Total ($)';
    } else if (vm.CurrentState === vm.Transaction.TRANSACTION_MANAGE_CREDIT_INVOICE_STATE) {
      vm.IsCreditMemoState = true;
      vm.InvoiceTotalLabel = 'Credit Memo Total ($)';
    } else if (vm.CurrentState === vm.Transaction.TRANSACTION_MANAGE_DEBIT_INVOICE_STATE) {
      vm.IsDebitMemoState = true;
      vm.InvoiceTotalLabel = 'Debit Memo Total ($)';
    }

    if (vm.IsInvoiceState) {
      vm.isShowVerificationAction = true;
    } else {
      vm.isShowVerificationAction = false;
    }

    vm.documentEntityName = vm.IsDebitMemoState ? CORE.AllEntityIDS.DebitMemo.Name : (vm.IsCreditMemoState ? CORE.AllEntityIDS.CreditMemo.Name : CORE.AllEntityIDS.SupplierInvoice.Name);

    if (vm.tabType === TRANSACTION.SupplierInvoiceType.Detail) {
      vm.selectedTabIndex = 0;
    } else if (vm.tabType === TRANSACTION.SupplierInvoiceType.Document) {
      vm.selectedTabIndex = 1;
    } else if (vm.tabType === TRANSACTION.SupplierInvoiceType.PackingSlipDocument) {
      vm.selectedTabIndex = 2;
    } else if (vm.tabType === TRANSACTION.SupplierInvoiceType.OtherDetail) {
      vm.selectedTabIndex = vm.IsInvoiceState ? 3 : 2;
    }

    vm.packingSlip = {
      isTariffInvoice: true,
      invoiceNumberSameAsPSNumber: false,
      creditMemoType: vm.IsCreditMemoState ? vm.creditMemoType[1].value : vm.IsDebitMemoState ? vm.debitMemoType[1].value : null,
      markedForRefund: false,
      isZeroValue: false
    };
    vm.invoiceDetail = {
      materialType: true,
      isZeroValue: false,
      status: vm.VerificationGridHeaderDropdown[2].dbValue
    };
    vm.RadioGroup = {
      type: {
        array: TRANSACTION.TypeOfUpdateMaterial
      }
    };

    const setMemoType = () => {
      switch (vm.packingSlip.creditMemoType) {
        case vm.creditMemoType[1].value && vm.IsCreditMemoState:
          vm.isShowRMADetail = true;
          vm.isManualCreditMemo = false;
          break;
        case vm.IsCreditMemoState && vm.creditMemoType[2].value:
          vm.isShowRMADetail = false;
          vm.isManualCreditMemo = true;
          break;
        case vm.IsDebitMemoState && vm.debitMemoType[1].value:
          vm.isShowRMADetail = false;
          vm.isManualDebitMemo = true;
          break;
        default:
          vm.isShowRMADetail = false;
          vm.isManualCreditMemo = false;
          vm.isManualDebitMemo = false;
          break;
      }
    };
    setMemoType();

    const setHeaderInformation = () => {
      $scope.$parent.vm.supplierInvoiceEditObj = {
        id: vm.packingSlip.id,
        isInvoiceState: vm.IsInvoiceState,
        isCreditMemoState: vm.IsCreditMemoState,
        isDebitMemoState: vm.IsDebitMemoState,
        invoiceNumber: vm.packingSlip.invoiceNumber,
        creditMemoNumber: vm.packingSlip.creditMemoNumber,
        debitMemoNumber: vm.packingSlip.debitMemoNumber,
        refPackingSlipId: vm.packingSlip.refPackingSlipId,
        refInvoiceId: vm.packingSlip.refInvoiceOfMemo && vm.packingSlip.refInvoiceOfMemo.id ? vm.packingSlip.refInvoiceOfMemo.id : null,
        refInvoiceNumber: vm.packingSlip.refInvoiceOfMemo && vm.packingSlip.refInvoiceOfMemo.invoiceNumber ? vm.packingSlip.refInvoiceOfMemo.invoiceNumber : null,
        packingSlipNumber: vm.packingSlip.refPackingSlipNumber || vm.packingSlip.packingSlipNumber,
        refPurchaseOrderID: vm.packingSlip.refPurchaseOrderID,
        poNumber: vm.packingSlip.poNumber,
        supplierSONumber: vm.packingSlip.supplierSONumber,
        isShowRMADetail: vm.isShowRMADetail,
        creditMemoType: vm.packingSlip.creditMemoType,
        mfgCodeID: vm.packingSlip.mfgCodeID,
        mfgFullName: vm.packingSlip.mfgFullName,
        mfgCode: vm.packingSlip.mfgCode,
        lockStatus: vm.packingSlip.lockStatus,
        lockedAt: vm.packingSlip.lockedAt,
        lockedByUser: vm.packingSlip.lockedByUser,
        totalExtendedAmount: vm.packingSlip.sumExtendedPrice,
        markedForRefund: vm.packingSlip.markedForRefund,
        receiptType: vm.packingSlip.receiptType,
        markedForRefundAmt: vm.packingSlip.markedForRefundAmt,
        totalRefundedAmount: vm.totalRefundedAmount
      };

      $scope.$parent.vm.getSupplierInvoiceHoldStatus();
    };
    if (!vm.packingSlipID) {
      setHeaderInformation();
    }

    vm.currentDate = new Date();
    vm.poDateOptions = {
      appendToBody: true,
      maxDate: vm.currentDate
    };
    vm.soDateOptions = {
      appendToBody: true,
      maxDate: vm.currentDate
    };
    vm.packingSlipDateOptions = {
      appendToBody: true,
      maxDate: vm.currentDate
    };

    vm.receiptDateOptions = {
      appendToBody: true,
      maxDate: vm.currentDate
    };

    vm.invoiceDateOptions = {
      appendToBody: true,
      maxDate: vm.currentDate
    };

    vm.applyDateOptions = {
      appendToBody: true
    };

    vm.DATE_PICKER = CORE.DATE_PICKER;
    vm.IsPickerOpen = {
      [vm.DATE_PICKER.poDate]: false,
      [vm.DATE_PICKER.soDate]: false,
      [vm.DATE_PICKER.packingSlipDate]: false,
      [vm.DATE_PICKER.receiptDate]: false,
      [vm.DATE_PICKER.invoiceDate]: false,
      [vm.DATE_PICKER.applyDate]: false
    };

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    /* called for max date validation */
    vm.getMaxDateValidation = (FromDate, ToDate) => BaseService.getMaxDateValidation(FromDate, ToDate);

    /* called for min date validation */
    vm.getMinDateValidation = (FromDate, ToDate) => BaseService.getMinDateValidation(FromDate, ToDate);

    function setExtendedPriceforDisplay(isCalculateDiscount) {
      if (vm.invoiceDetail) {
        vm.invoiceDetail.extendedPriceDisplay = vm.invoiceDetail.extendedPrice ? $filter('amount')(vm.invoiceDetail.extendedPrice) : 0;
        vm.invoiceDetail.extendedReceivedPriceDisplay = vm.invoiceDetail.extendedReceivedPrice ? $filter('amount')(vm.invoiceDetail.extendedReceivedPrice) : 0;

        if (vm.IsInvoiceState) {
          if (isCalculateDiscount && (!vm.invoiceDetailCopy || vm.invoiceDetailCopy.invoicePrice !== vm.invoiceDetail.invoicePrice)) {
            if (vm.invoiceDetail.lineQtyVariance && vm.invoiceDetail.lineQtyVariance < 0) {
              vm.invoiceDetail.discount = multipleUnitValue(vm.invoiceDetail.invoicePrice, vm.invoiceDetail.lineQtyVariance, amountDecimal);
            }
            if (vm.invoiceDetail.discount > 0) {
              vm.invoiceDetail.discount = (vm.invoiceDetail.discount * -1);
            }
          }
        }
      }
    }

    vm.getCreditDebitMemoDet = (invoiceId) => {
      if (invoiceId) {
        vm.cgBusyLoading = SupplierInvoiceFactory.getCreditDebitMemoDetails().query({
          invoiceId: invoiceId
        }).$promise.then((response) => {
          if (response && response.data) {
            const totalPaidAmount = CalcSumofArrayElement([response.data.invoiceAmount, response.data.creditMemoAmount, response.data.debitMemoAmount], amountDecimal);
            totalCreditMemoDisplay = response.data.creditMemoAmount;
            debitMemoAmount = response.data.debitMemoAmount;
            vm.packingSlip.totalCreditMemoDisplay = response.data.creditMemoAmount ? $filter('amount')(response.data.creditMemoAmount) : 0;
            vm.packingSlip.totalDebitMemoDisplay = response.data.debitMemoAmount ? $filter('amount')(response.data.debitMemoAmount) : 0;
            vm.packingSlip.totalPaidAmountDisplay = totalPaidAmount ? $filter('amount')(totalPaidAmount) : 0;
            calculateAmountDifference();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.checkDateValidation = (isSODate) => {
      if (vm.packingSlip) {
        if (vm.soDateOptions) {
          vm.soDateOptions.minDate = new Date(vm.packingSlip.poDate);
        } else {
          vm.soDateOptions = { minDate: new Date(vm.packingSlip.poDate) };
        }
        if (vm.poDateOptions && vm.packingSlip.soDate) {
          vm.poDateOptions.maxDate = new Date(vm.packingSlip.soDate) || vm.currentDate;
        } else if (!vm.packingSlip.soDate) {
          vm.poDateOptions.maxDate = vm.currentDate;
        }
        let receiptTypeWiseDate = null;
        if (vm.IsInvoiceState) {
          receiptTypeWiseDate = new Date($filter('date')(vm.packingSlip.invoiceDate, vm.DefaultDateFormat));
        } else if (vm.IsDebitMemoState) {
          receiptTypeWiseDate = new Date($filter('date')(vm.packingSlip.debitMemoDate, vm.DefaultDateFormat));
        } else if (vm.IsCreditMemoState) {
          receiptTypeWiseDate = new Date($filter('date')(vm.packingSlip.creditMemoDate, vm.DefaultDateFormat));
        }
        const packingSlipDate = new Date($filter('date')(vm.packingSlip.packingSlipDate, vm.DefaultDateFormat));
        const receiptDate = new Date($filter('date')(vm.packingSlip.receiptDate, vm.DefaultDateFormat));
        const applyDate = new Date($filter('date')(vm.packingSlip.applyDate, vm.DefaultDateFormat));

        const invoiceMinDate = new Date($filter('date')(vm.packingSlip.packingSlipDate, vm.DefaultDateFormat));
        const receiptMinDate = new Date($filter('date')(vm.packingSlip.packingSlipDate, vm.DefaultDateFormat));
        if (vm.supplierInvoiceForm) {
          if (vm.supplierInvoiceForm.invoiceDate) {
            if (receiptTypeWiseDate < packingSlipDate) {
              vm.supplierInvoiceForm.invoiceDate.$setDirty(true);
              vm.supplierInvoiceForm.invoiceDate.$touched = true;
              vm.supplierInvoiceForm.invoiceDate.$setValidity('mindate', false);
            } else {
              vm.supplierInvoiceForm.invoiceDate.$setValidity('mindate', true);
              if (applyDate) {
                if (applyDate < receiptTypeWiseDate) {
                  vm.supplierInvoiceForm.applyDate.$setDirty(true);
                  vm.supplierInvoiceForm.applyDate.$touched = true;
                  vm.supplierInvoiceForm.applyDate.$setValidity('mindate', false);
                } else {
                  if (!vm.packingSlip.applyDate) {
                    if (vm.IsInvoiceState) {
                      vm.packingSlip.applyDate = angular.copy(vm.packingSlip.invoiceDate);
                    } else if (vm.IsDebitMemoState) {
                      vm.packingSlip.applyDate = angular.copy(vm.packingSlip.debitMemoDate);
                    } else if (vm.IsCreditMemoState) {
                      vm.packingSlip.applyDate = angular.copy(vm.packingSlip.creditMemoDate);
                    }
                  }
                }
              } else {
                if (!vm.packingSlip.applyDate) {
                  if (vm.IsInvoiceState) {
                    vm.packingSlip.applyDate = angular.copy(vm.packingSlip.invoiceDate);
                  } else if (vm.IsDebitMemoState) {
                    vm.packingSlip.applyDate = angular.copy(vm.packingSlip.debitMemoDate);
                  } else if (vm.IsCreditMemoState) {
                    vm.packingSlip.applyDate = angular.copy(vm.packingSlip.creditMemoDate);
                  }
                }
              }
            }
          }

          if (vm.supplierInvoiceForm.receiptDate) {
            if ((vm.IsDebitMemoState || vm.IsCreditMemoState) && vm.isManualCreditMemo) {
              vm.packingSlip.receiptDate = angular.copy(vm.packingSlip.packingSlipDate);
            }
            else if (receiptDate < packingSlipDate) {
              vm.supplierInvoiceForm.receiptDate.$setDirty(true);
              vm.supplierInvoiceForm.receiptDate.$touched = true;
              vm.supplierInvoiceForm.receiptDate.$setValidity('mindate', false);
            } else {
              vm.supplierInvoiceForm.receiptDate.$setValidity('mindate', true);
            }
          }
        }

        if (vm.supplierInvoiceForm.applyDate) {
          if (receiptTypeWiseDate > applyDate) {
            vm.supplierInvoiceForm.applyDate.$setDirty(true);
            vm.supplierInvoiceForm.applyDate.$touched = true;
            vm.supplierInvoiceForm.applyDate.$setValidity('mindate', false);
          } else {
            vm.supplierInvoiceForm.applyDate.$setValidity('mindate', true);
          }
        }

        vm.invoiceDateOptions.minDate = invoiceMinDate;
        vm.receiptDateOptions.minDate = receiptMinDate;

        const poDate = vm.packingSlip.poDate ? new Date($filter('date')(vm.packingSlip.poDate, vm.DefaultDateFormat)) : vm.supplierInvoiceForm && vm.supplierInvoiceForm.poDate && vm.supplierInvoiceForm.poDate.$viewValue ? new Date($filter('date')(vm.supplierInvoiceForm.poDate.$viewValue, vm.DefaultDateFormat)) : null;
        const soDate = vm.packingSlip.soDate ? new Date($filter('date')(vm.packingSlip.soDate, vm.DefaultDateFormat)) : vm.supplierInvoiceForm && vm.supplierInvoiceForm.soDate && vm.supplierInvoiceForm.soDate.$viewValue ? new Date($filter('date')(vm.supplierInvoiceForm.soDate.$viewValue, vm.DefaultDateFormat)) : null;
        if (vm.supplierInvoiceForm) {
          if (vm.supplierInvoiceForm.poDate && vm.supplierInvoiceForm.soDate && poDate && soDate) {
            if (isSODate && poDate <= soDate) {
              vm.packingSlip.poDate = poDate;
              vm.supplierInvoiceForm.poDate.$setValidity('maxvalue', true);
            }
            if (!isSODate && poDate <= soDate) {
              vm.packingSlip.soDate = soDate;
              vm.supplierInvoiceForm.soDate.$setValidity('minvalue', true);
            }
          }
        }
      }
    };

    const getDocumentCount = (id, type) => {
      if (id && type) {
        return PackingSlipFactory.getPackingSlipDocumentCount().query({ id: id, type: type }).$promise.then((response) => response.data)
          .catch((error) => BaseService.getErrorLog(error));
      }
      else {
        return 0;
      }
    };

    vm.isStepValid = function (step) {
      if (vm.IsInvoiceState && step === 3) {
        step = 2;
      }
      let isDirty;
      switch (step) {
        case 0: {
          isDirty = (vm.supplierInvoiceForm && vm.supplierInvoiceForm.$dirty) || (vm.invoiceDetailForm && vm.invoiceDetailForm.$dirty);
          if (isDirty) {
            return showWithoutSavingAlertforTabChange(step);
          }
          else {
            return true;
          }
        }
        case 1: {
          if (vm.supplierRMADocumentForm) {
            vm.supplierRMADocumentForm.$setPristine();
            vm.supplierRMADocumentForm.$setUntouched();
          }
          break;
        }
        case 2: {
          isDirty = vm.miscForm && vm.miscForm.$dirty;

          if (isDirty) {
            return showWithoutSavingAlertforTabChange(step);
          }
          else {
            return true;
          }
        }
      }
    };

    vm.onTabChanges = (TabName, msWizard) => {
      if (TabName === vm.packingSlipInvoiceTabName) {
        vm.IsInvoiceTab = true;
        BaseService.currentPageForms = [vm.supplierInvoiceForm, vm.invoiceDetailForm];
      } else {
        vm.IsInvoiceTab = false;
      }

      if (TabName === vm.packingSlipDocumentTabName) {
        vm.IsPackingSlipDocumentTab = true;
        vm.currentForm = msWizard.currentStepForm();
        BaseService.currentPageForms = [vm.currentForm];
      } else {
        vm.IsPackingSlipDocumentTab = false;
      }

      if (TabName === vm.supplierInvoiceDocumentTabName) {
        vm.IsSupplierInvoiceDocumentTab = true;
        vm.currentForm = msWizard.currentStepForm();
        BaseService.currentPageForms = [vm.currentForm];
      } else {
        vm.IsSupplierInvoiceDocumentTab = false;
      }

      if (TabName === vm.miscTabName) {
        vm.IsMISCTab = true;
        vm.currentForm = msWizard.currentStepForm();
        BaseService.currentPageForms = [vm.currentForm];
      } else {
        vm.IsMISCTab = false;
      }

      vm.msWizard = msWizard;
      msWizard.selectedIndex = vm.selectedTabIndex;
      vm.stateTransfer(TabName);
      $('#content').animate({ scrollTop: 0 }, 200);
    };


    const showWithoutSavingAlertforTabChange = (step) => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      return DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          if (step === 0) {
            if (vm.supplierInvoiceForm) {
              vm.supplierInvoiceForm.$setPristine();
              vm.supplierInvoiceForm.$setUntouched();
            }
            if (vm.invoiceDetailForm) {
              vm.invoiceDetailForm.$setPristine();
              vm.invoiceDetailForm.$setUntouched();
            }
            vm.resetPackingSlip();
            return true;
          }

          if (step === 2) {
            if (vm.miscForm) {
              vm.miscForm.$setPristine();
              vm.miscForm.$setUntouched();
            }
            return true;
          }
        }
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.stateTransfer = (TabName) => {
      //vm.resetPackingSlip();
      vm.TabName = TabName;
      vm.slipType = TabName;
      switch (TabName) {
        case vm.packingSlipInvoiceTabName:
          //vm.slipType = TRANSACTION.MaterialReceiveTabType.InvoiceVerification;
          $scope.$parent.vm.showSaveBtn = true;
          $state.transitionTo($state.$current, { type: TRANSACTION.SupplierInvoiceType.Detail, id: vm.packingSlipID, slipType: vm.slipType }, { location: true, inherit: true, notify: true });
          break;
        case vm.packingSlipDocumentTabName:
          //vm.slipType = TRANSACTION.MaterialReceiveTabType.PackingSlipDocument;
          $scope.$parent.vm.showSaveBtn = false;
          $state.transitionTo($state.$current, { type: TRANSACTION.SupplierInvoiceType.PackingSlipDocument, id: vm.packingSlipID, slipType: vm.slipType }, { location: true, inherit: true, notify: true });
          break;
        case vm.supplierInvoiceDocumentTabName:
          //vm.slipType = TRANSACTION.MaterialReceiveTabType.SupplierInvoiceDocument;
          $scope.$parent.vm.showSaveBtn = false;
          $state.transitionTo($state.$current, { type: TRANSACTION.SupplierInvoiceType.Document, id: vm.packingSlipID, slipType: vm.slipType }, { location: true, inherit: true, notify: true });
          break;
        case vm.miscTabName:
          //vm.slipType = TRANSACTION.MaterialReceiveTabType.MISC;
          $scope.$parent.vm.showSaveBtn = true;
          $state.transitionTo($state.$current, { type: TRANSACTION.SupplierInvoiceType.OtherDetail, id: vm.packingSlipID, slipType: vm.slipType }, { location: true, inherit: true, notify: true });
          break;
        default:
      }
    };

    const getInvoiceDet = () => {
      if (vm.packingSlipID) {
        vm.cgBusyLoading = PackingSlipFactory.getPackingSlipDet().query({
          id: vm.packingSlipID,
          receiptType: vm.IsCreditMemoState ? TRANSACTION.PackingSlipReceiptType.CreditMemo : vm.IsDebitMemoState ? TRANSACTION.PackingSlipReceiptType.DebitMemo : TRANSACTION.PackingSlipReceiptType.SupplierInvoice
        }).$promise.then((response) => {
          if (response && response.data && response.data.PackingSlip) {
            vm.invoicePackingSlipId = response.data.PackingSlip.id;
            if (vm.IsInvoiceState) {
              vm.getCreditDebitMemoDet(vm.invoicePackingSlipId);
            }
            vm.packingSlip = response.data ? response.data.PackingSlip : null;
            vm.packingSlip.mfgCode = vm.packingSlip.mfgCodemst ? vm.packingSlip.mfgCodemst.mfgCode : null;
            vm.packingSlip.mfgInvoicesRequireManagementApproval = vm.packingSlip.mfgCodemst ? vm.packingSlip.mfgCodemst.mfgInvoicesRequireManagementApproval : false;
            vm.packingSlip.isTariffInvoice = !vm.packingSlip.isTariffInvoice ? true : false;
            if (vm.soDateOptions) {
              vm.soDateOptions.minDate = new Date(vm.packingSlip.poDate);
            } else {
              vm.soDateOptions = { minDate: new Date(vm.packingSlip.poDate) };
            }
            vm.packingSlip.poDate = vm.packingSlip.poDate ? BaseService.getUIFormatedDate(vm.packingSlip.poDate, vm.DefaultDateFormat) : null;
            vm.packingSlip.soDate = vm.packingSlip.soDate ? BaseService.getUIFormatedDate(vm.packingSlip.soDate, vm.DefaultDateFormat) : null;
            vm.packingSlip.packingSlipDate = BaseService.getUIFormatedDate(vm.packingSlip.packingSlipDate, vm.DefaultDateFormat);
            vm.packingSlip.receiptDate = BaseService.getUIFormatedDate(vm.packingSlip.receiptDate, vm.DefaultDateFormat);

            vm.packingSlip.invoiceDate = BaseService.getUIFormatedDate(vm.packingSlip.invoiceDate, vm.DefaultDateFormat);
            vm.packingSlip.debitMemoDate = BaseService.getUIFormatedDate(vm.packingSlip.debitMemoDate, vm.DefaultDateFormat);
            vm.packingSlip.creditMemoDate = BaseService.getUIFormatedDate(vm.packingSlip.creditMemoDate, vm.DefaultDateFormat);
            vm.packingSlip.applyDate = BaseService.getUIFormatedDate(vm.packingSlip.applyDate, vm.DefaultDateFormat);
            vm.packingSlip.invoiceApprovalDate = BaseService.getUIFormatedDateTimeInCompanyTimeZone(vm.packingSlip.invoiceApprovalDate, vm.DateTimeFormat);

            vm.packingSlip.lockedAt = BaseService.getUIFormatedDateTimeInCompanyTimeZone(vm.packingSlip.lockedAt, _dateTimeDisplayFormat);
            vm.packingSlip.lockedByUser = vm.packingSlip.packingSlipLockedBy && vm.packingSlip.packingSlipLockedBy.username ? vm.packingSlip.packingSlipLockedBy.username : '';

            if (vm.packingSlip.lockStatus === vm.Transaction.CustomerPaymentLockStatus.Locked && !vm.loginUser.isUserSuperAdmin) {
              vm.isDisableEditPageFields = true;
            }

            vm.refPackingSlipId = vm.packingSlip.refPackingSlipId;
            vm.balanceToPayAmount = 0;
            if ((vm.packingSlip.status === vm.PackingSlipStatus.Paid) ||
              (response.data.PackingSlip.packingslip_invoice_payment_det && response.data.PackingSlip.packingslip_invoice_payment_det.length > 0)) {
              vm.InvoiceDetailDisable = true;
              const paymentRecords = _.filter(response.data.PackingSlip.packingslip_invoice_payment_det, (data) => data.packingslip_invoice_payment.refPaymentMode === 'P');
              if (paymentRecords && paymentRecords.length > 0) {
                vm.balanceToPayAmount = CalcSumofArrayElement(_.map(paymentRecords, 'paymentAmount'), amountDecimal);
              }
              const refundRecords = _.filter(response.data.PackingSlip.packingslip_invoice_payment_det, (data) => data.packingslip_invoice_payment.refPaymentMode === 'RR');
              if (refundRecords && refundRecords.length > 0) {
                vm.totalRefundedAmount = CalcSumofArrayElement(_.map(refundRecords, 'paymentAmount'), amountDecimal);
              }
            }
            vm.balanceToPayAmount = CalcSumofArrayElement([vm.packingSlip.invoiceTotalDue, vm.balanceToPayAmount], amountDecimal);

            setMemoType();

            setHeaderInformation();

            setRadioButtonForLineDetails();

            sourceHeader();
            vm.manageField();

            vm.packingSlip.invoiceNumberSameAsPSNumber = false;
            if (vm.IsInvoiceState) {
              $scope.$parent.vm.invoiceDebitCreditNo = vm.packingSlip.invoiceNumber;
              vm.packingSlip.invoiceNumberSameAsPSNumber = (vm.packingSlip.invoiceNumber === vm.packingSlip.packingSlipNumber);
            } else if (vm.IsCreditMemoState) {
              $scope.$parent.vm.invoiceDebitCreditNo = vm.packingSlip.creditMemoNumber;
            } else if (vm.IsDebitMemoState) {
              $scope.$parent.vm.invoiceDebitCreditNo = vm.packingSlip.debitMemoNumber;
            }
            getAutoCompleteData();

            const counrPromise = [getDocumentCount(vm.packingSlip.refPackingSlipId, CORE.AllEntityIDS.PackingSlip.Name), getDocumentCount(vm.packingSlip.id, vm.documentEntityName)];
            vm.cgBusyLoading = $q.all(counrPromise).then((responsesCount) => {
              vm.packingSlipDocumentCount = responsesCount[0];
              vm.supplierInvoiceDocumentCount = responsesCount[1];

              if (vm.packingSlip.creditMemoType !== vm.creditMemoType[2].value && vm.packingSlip.creditMemoType !== vm.debitMemoType[1].value) {
                setFocus('slipLine');
              } else {
                setFocus('memoScanLabel');
              }
            }).catch((error) => BaseService.getErrorLog(error));

            vm.copyPackingSlip = angular.copy(vm.packingSlip);
            vm.billToAddressViewAddrOtherDet.alreadySelectedAddressID = vm.packingSlip.billToAddressID;
            vm.billToAddressViewAddrOtherDet.alreadySelectedPersonId = vm.packingSlip.billToContactPersonID;

            if (response.data && response.data.IsSuccess) {
              vm.reGetInvoiceDetailDisable = true;
            } else if (response.data && !response.data.IsSuccess) {
              if ((vm.CurrentState === TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_INVOICE_STATE ||
                vm.CurrentState === TRANSACTION.TRANSACTION_MANAGE_CREDIT_INVOICE_STATE) &&
                vm.tabType !== TRANSACTION.SupplierInvoiceType.Detail) {
                vm.reGetInvoiceDetailDisable = false;
              } else {
                const lineUpdateObj = {
                  poNumber: vm.packingSlip.poNumber,
                  PackingSlipNumber: vm.packingSlip.packingSlipNumber,
                  InsertCount: response.data.InsertCount,
                  UpdateCount: response.data.UpdateCount,
                  DeleteCount: response.data.DeleteCount,
                  NotifyFrom: TRANSACTION.ReGetType.REFRESH
                };
                reGetPopUp(lineUpdateObj);
              }
            }
            calculateAmountDifference();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    const reGetOnChnagesOfPackingSlipLineListener = (data) => {
      if (data && data.data && data.data.InvoiceId === parseInt(vm.packingSlipID) && vm.CurrentState === TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_INVOICE_STATE) {
        const lineUpdateObj = {
          poNumber: vm.packingSlip.poNumber,
          PackingSlipNumber: vm.packingSlip.packingSlipNumber,
          InsertCount: data.data.InsertCount,
          UpdateCount: data.data.UpdateCount,
          DeleteCount: data.data.DeleteCount,
          NotifyFrom: data.data.NotifyFrom
        };
        reGetPopUp(lineUpdateObj);
      }
    };

    const reGetPopUp = (lineUpdateObj) => {
      if (lineUpdateObj && (vm.CurrentState === TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_INVOICE_STATE || (vm.CurrentState === TRANSACTION.TRANSACTION_MANAGE_CREDIT_INVOICE_STATE && vm.isShowRMADetail))) {
        vm.reGetInvoiceDetailDisable = false;
        let messageContent = null;
        if (lineUpdateObj.NotifyFrom === TRANSACTION.ReGetType.REFRESH && !vm.isShowRMADetail) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RE_GET_PACKING_SLIP_LINE);
          messageContent.message = stringFormat(messageContent.message, lineUpdateObj.PackingSlipNumber, lineUpdateObj.InsertCount, lineUpdateObj.UpdateCount, lineUpdateObj.DeleteCount);
        } else if (lineUpdateObj.NotifyFrom === TRANSACTION.ReGetType.REFRESH && vm.isShowRMADetail) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RE_GET_CREDIT_MEMO_LINE);
          messageContent.message = stringFormat(messageContent.message, lineUpdateObj.poNumber, lineUpdateObj.InsertCount, lineUpdateObj.UpdateCount, lineUpdateObj.DeleteCount);
        } else {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RE_GET_PACKING_SLIP_LINE_ON_SOCKET_IO);
          messageContent.message = stringFormat(messageContent.message, lineUpdateObj.PackingSlipNumber);
        }

        if (messageContent && !isReGetInformationPopUpOpen) {
          isReGetInformationPopUpOpen = true;
          const model = {
            messageContent: messageContent,
            multiple: false
          };
          DialogFactory.messageAlertDialog(model).then(() => {
            isReGetInformationPopUpOpen = false;
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
    };

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

    /* Get payment terms detail */
    vm.TermsList = [];
    const getPaymentTermsList = () => {
      const GencCategoryType = [];
      GencCategoryType.push(CategoryTypeObjList.Terms.Name);
      const listObj = {
        GencCategoryType: GencCategoryType
      };

      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((terms) => {
        if (terms && terms.data) {
          vm.TermsList = terms.data;
          return $q.resolve(vm.TermsList);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //const getAllGenericCategoryByCategoryType = () => {
    //  const GencCategoryType = [];
    //  GencCategoryType.push(CORE.CategoryType.ChargesType.Name);
    //  const listObj = {
    //    GencCategoryType: GencCategoryType
    //  };
    //  return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((genericCategories) => {
    //    const GenericCategoryAllData = genericCategories.data;
    //    //get cherge list
    //    vm.ChargeList = _.filter(GenericCategoryAllData, (item) => item.categoryType === CORE.CategoryType.ChargesType.Name && item.isActive === true);
    //    return $q.resolve(vm.ChargeList);
    //  }).catch((error) => BaseService.getErrorLog(error));
    //};

    const getOtherComponentDetails = (searchObj) => {
      searchObj.partType = CORE.PartType.Other;
      vm.OtherPartTypeComponents = [];
      return ComponentFactory.getComponentMFGAliasSearch().query({ listObj: searchObj }).$promise.then((component) => {
        if (component && component.data && component.data.data) {
          vm.OtherPartTypeComponents = angular.copy(component.data.data);
          if (searchObj.id || searchObj.id === 0) {
            $timeout(() => {
              if (vm.autoCompletecomponentOther) {
                vm.autoCompletecomponentOther.keyColumnId = component.data.data[0].id;
              }
              if (vm.autoCompleteMfgPIDCodeOther) {
                vm.autoCompleteMfgPIDCodeOther.keyColumnId = component.data.data[0].id;
              }
            });
          }
        }
        return vm.OtherPartTypeComponents;
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const getAutoCompleteData = () => {
      initMFRAutoComplete();
      const autocompletePromise = [getSupplierList(), /*getAllGenericCategoryByCategoryType(),*/ getPaymentTermsList(), getOtherComponentDetails({})];
      vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
        initAutoComplete();
        if (vm.packingSlipNumber) {
          vm.packingSlip.packingSlipNumber = vm.packingSlipNumber;
          vm.getPackingSlipDetailByPackingSlipNumber();
        }

        //InitPackingSlipautoComplete();
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /** Invoke on page initialize */
    const active = () => {
      if (vm.packingSlipID) {
        getInvoiceDet();
        setFocus('invoiceTotalDue');
        if (vm.IsInvoiceState) {
          vm.EntityName = vm.Entity.SupplierInvoice;
          vm.entityID = vm.AllEntityIDS.SupplierInvoice.ID;
        }
        if (vm.IsCreditMemoState) {
          vm.EntityName = vm.Entity.CreditMemo;
          vm.entityID = vm.AllEntityIDS.CreditMemo.ID;
        }
        if (vm.IsDebitMemoState) {
          vm.EntityName = vm.Entity.DebitMemo;
          vm.entityID = vm.AllEntityIDS.DebitMemo.ID;
        }
      }
      else {
        getAutoCompleteData();
      }
    };
    active();

    // get contact person list
    const getCustomerContactPersonList = (objData) => CustomerFactory.getCustomerContactPersons().query({
      refTransID: (objData && objData.supplierID) ? objData.supplierID : null,
      refTableName: CORE.TABLE_NAME.MFG_CODE_MST
    }).$promise.then((contactperson) => {
      if (contactperson && contactperson.data && objData) {
        if (objData.addressType === CORE.AddressType.BusinessAddress) {
          vm.billToAddressContactPerson = _.find(contactperson.data, (item) => item.personId === objData.alreadySelectedPersonId);
          vm.billToAddressViewAddrOtherDet.alreadySelectedPersonId = vm.billToAddressContactPerson ? vm.billToAddressContactPerson.personId : null;
        }
      }
    }).catch((error) => BaseService.getErrorLog(error));

    // get address list
    const getSupplierAddressList = (id) => {
      vm.cgBusyLoading = CustomerFactory.customerAddressList().query({
        customerId: id,
        addressType: CORE.AddressType.BusinessAddress,
        refTableName: CORE.TABLE_NAME.MFG_CODE_MST
      }).$promise.then((billToAddress) => {
        if (vm.packingSlip && vm.packingSlip.billToAddressID && vm.packingSlipID) {
          vm.billToAddress = _.find(billToAddress.data, (item) => item.id === vm.packingSlip.billToAddressID);
          vm.billToAddressViewAddrOtherDet.alreadySelectedAddressID = vm.billToAddress ? vm.billToAddress.id : null;
          getCustomerContactPersonList({
            supplierID: vm.packingSlip.mfgCodeID,
            addressType: CORE.AddressType.BusinessAddress,
            alreadySelectedPersonId: vm.packingSlip.billToContactPersonID
          });
        } else {
          if (!vm.packingSlipID) {
            vm.billToAddress = _.find(billToAddress.data, (item) => item.isDefault === true);
            vm.billToAddressViewAddrOtherDet.alreadySelectedAddressID = vm.billToAddress ? vm.billToAddress.id : null;
            vm.packingSlip.billToAddressID = vm.billToAddressViewAddrOtherDet.alreadySelectedAddressID;
            vm.billToAddressViewAddrOtherDet.showAddressEmptyState = vm.packingSlip.billToAddressID ? false : true;
            vm.billToAddressContactPerson = (vm.billToAddress && vm.billToAddress.contactPerson) ? angular.copy(vm.billToAddress.contactPerson) : null;
            vm.billToAddressViewAddrOtherDet.alreadySelectedPersonId = vm.billToAddressContactPerson ? vm.billToAddressContactPerson.personId : null;
            vm.packingSlip.billToContactPersonID = vm.billToAddressViewAddrOtherDet.alreadySelectedPersonId;
          }
          else {
            vm.billToAddress = null;
            vm.billToAddressContactPerson = null;
            vm.billToAddressViewAddrOtherDet.alreadySelectedAddressID = null;
            vm.billToAddressViewAddrOtherDet.alreadySelectedPersonId = null;
          }
        }
        if (!billToAddress || !billToAddress.data || billToAddress.data.length === 0 &&
          (vm.billToAddressViewAddrOtherDet && !vm.billToAddressViewAddrOtherDet.alreadySelectedAddressID)) {
          vm.billToAddressViewAddrOtherDet.showAddressEmptyState = true;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.refreshSupplierAddress = () => {
      getSupplierAddressList(vm.autoCompleteSupplier.keyColumnId);
    };

    /** Initialize auto-complete */
    const initAutoComplete = () => {
      /** Auto-complete for supplier */
      vm.autoCompleteSupplier = {
        columnName: 'mfgCodeName',
        controllerName: CORE.MANAGE_MFGCODE_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_MFGCODE_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.packingSlip && vm.packingSlip.mfgCodeID ? vm.packingSlip.mfgCodeID : null,
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
          if (item && item.id) {
            vm.packingSlip.mfgCodeID = item.id;
            vm.packingSlip.mfgFullName = item.mfgCodeName;
            vm.packingSlip.mfgCode = item.mfgCode;
            vm.billToAddressViewAddrOtherDet.customerId = vm.packingSlip.mfgCodeID;
            vm.billToAddressViewAddrOtherDet.refTransID = vm.packingSlip.mfgCodeID;
            vm.billToAddressViewAddrOtherDet.companyNameWithCode = vm.packingSlip.mfgFullName;
            if (!vm.isShowRMADetail && !vm.isManualCreditMemo && !vm.isManualDebitMemo) {
              if (item.invoicesRequireManagementApproval) {
                if (!vm.packingSlipID) {
                  vm.packingSlip.invoiceRequireManagementApproval = true;
                }
                vm.packingSlip.mfgInvoicesRequireManagementApproval = item.invoicesRequireManagementApproval;
              } else if (vm.packingSlip.poWorkingStatus === vm.CORE.PO_Working_Status.Canceled.id) {
                vm.packingSlip.invoiceRequireManagementApproval = true;
              } else {
                if (!vm.packingSlipID) {
                  vm.packingSlip.invoiceRequireManagementApproval = false;
                }
              }
            } else {
              vm.packingSlip.invoiceRequireManagementApproval = false;
            }

            if (vm.autoCompletePaymentTerm && !vm.packingSlipID) {
              if (vm.isShowRMADetail) {
                vm.autoCompletePaymentTerm.keyColumnId = vm.packingSlip && vm.packingSlip.paymentTermsID ? vm.packingSlip.paymentTermsID : item.paymentTermsID;
              } else {
                vm.autoCompletePaymentTerm.keyColumnId = item.paymentTermsID ? item.paymentTermsID : null;
              }
            }

            if ($scope.$parent.vm.supplierInvoiceEditObj) {
              $scope.$parent.vm.supplierInvoiceEditObj.mfgCodeID = vm.packingSlip.mfgCodeID;
              $scope.$parent.vm.supplierInvoiceEditObj.mfgFullName = vm.packingSlip.mfgFullName;
              $scope.$parent.vm.supplierInvoiceEditObj.mfgCode = vm.packingSlip.mfgCode;
            }
            vm.checkUniquePackingSlipNumber('SupplierAuto');

            //if (vm.isManualCreditMemo || vm.isManualDebitMemo) {
            //  vm.checkUniquePackingSlipSupplierWise('SupplierAuto');
            //} else {
            //  vm.checkUniquePackingSlipNumber('SupplierAuto');
            //}
            if (vm.IsDebitMemoState && vm.tabType === TRANSACTION.SupplierInvoiceType.Detail) {
              getSupplierAddressList(vm.packingSlip.mfgCodeID);
            }
          }
          else {
            vm.packingSlip.mfgCodeID = null;
            vm.packingSlip.mfgFullName = null;
            vm.packingSlip.mfgCode = null;
            vm.packingSlip.mfgInvoicesRequireManagementApproval = false;
            vm.packingSlip.invoiceRequireManagementApproval = false;
            vm.billToAddressViewAddrOtherDet.customerId = null;
            vm.billToAddressViewAddrOtherDet.refTransID = null;
            vm.billToAddressViewAddrOtherDet.alreadySelectedAddressID = null;
            vm.billToAddressViewAddrOtherDet.alreadySelectedPersonId = null;
            if (vm.autoCompletePaymentTerm) {
              vm.autoCompletePaymentTerm.keyColumnId = null;
            }
          }
        }
      };

      vm.autoCompletePaymentTerm = {
        columnName: 'gencCategoryName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.packingSlip ? (vm.packingSlip.paymentTermsID ? vm.packingSlip.paymentTermsID : null) : null,
        inputName: CategoryTypeObjList.Terms.Name,
        placeholderName: CategoryTypeObjList.Terms.Title,
        addData: {
          headerTitle: CategoryTypeObjList.Terms.Title,
          popupAccessRoutingState: [USER.ADMIN_TERMS_MANAGEGENERICCATEGORY_STATE],
          pageNameAccessLabel: CategoryTypeObjList.Terms.Title
        },
        isRequired: true,
        isAddnew: true,
        callbackFn: getPaymentTermsList,
        onSelectCallbackFn: function (obj) {
          vm.packingSlip.paymentTermsID = (obj) ? obj.gencCategoryID : null;
          vm.packingSlip.termsDays = (obj) ? obj.termsDays : null;
        }
      };
    };

    function initMFRAutoComplete() {
      vm.autoCompletecomponent = {
        columnName: 'mfgPN',
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: (vm.invoiceDetail && vm.invoiceDetail.partID) ? vm.invoiceDetail.partID : null,
        inputName: CORE.LabelConstant.MFG.MFGPN,
        placeholderName: CORE.LabelConstant.MFG.MFGPN,
        isAddnew: true,
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          category: CORE.PartCategory.Component,
          popupAccessRoutingState: [USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE],
          pageNameAccessLabel: CORE.LabelConstant.PART_MASTER.PageName
        },
        isRequired: true,
        callbackFn: function (obj) {
          const searchObj = {
            id: obj.id,
            mfgType: CORE.MFG_TYPE.MFG,
            isContainCPN: true
          };
          return getComponentDetailsByMfg(searchObj);
        },
        onSelectCallbackFn: (item) => {
          if (item) {
            if (item.id) {
              let messageContent;
              if (item.isGoodPart === CORE.PartCorrectList.CorrectPart) {
                vm.invoiceDetail.partID = item.id;
                vm.invoiceDetail.mfgcodeID = item.mfgcodeID;
                vm.invoiceDetail.mfgCode = item.mfgCode;
                vm.invoiceDetail.mfgName = item.mfgName;
                vm.invoiceDetail.fullMfgName = item.mfgCodeName;
                vm.invoiceDetail.mfgPN = item.orgMfgPN;
                vm.invoiceDetail.PIDCode = item.PIDCode;
                vm.invoiceDetail.rohsIcon = item.rohsIcon;
                vm.invoiceDetail.rohsName = item.rohsName;
                vm.invoiceDetail.partType = item.partType;
                vm.invoiceDetail.imageURL = BaseService.getPartMasterImageURL(item.documentPath, item.imageURL);
                $scope.$broadcast(vm.autoCompleteMfgPIDCode.inputName, item);
              } else {
                messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MFRPN_BAD_PART);
                messageContent.message = stringFormat(messageContent.message, item.PIDCode, item.isGoodPart === CORE.PartCorrectList.IncorrectPart ? CORE.PartCorrectLabelList.IncorrectPart : CORE.PartCorrectLabelList.UnknownPart);
                const model = {
                  messageContent: messageContent,
                  multiple: true
                };
                DialogFactory.messageAlertDialog(model).then(() => {
                  if (vm.supplierRMADet) {
                    vm.supplierRMADet.partID = vm.supplierRMADet.mfgPN = null;
                  }
                  $scope.$broadcast(vm.autoCompletecomponent.inputName, null);
                  $scope.$broadcast(vm.autoCompleteMfgPIDCode.inputName, null);
                  vm.autoCompletecomponent.keyColumnId = null;
                  vm.autoCompleteMfgPIDCode.keyColumnId = null;
                  setFocusByName(CORE.LabelConstant.MFG.MFGPN);
                });
              }
            }
          } else {
            vm.invoiceDetail.partID = null;
            vm.invoiceDetail.mfgCode = null;
            vm.invoiceDetail.mfgName = null;
            vm.invoiceDetail.mfgcodeID = null;
            vm.invoiceDetail.fullMfgName = null;
            vm.invoiceDetail.mfgPN = null;
            vm.invoiceDetail.PIDCode = null;
            vm.invoiceDetail.rohsIcon = null;
            vm.invoiceDetail.rohsName = null;
            vm.invoiceDetail.imageURL = null;
            $scope.$broadcast(vm.autoCompleteMfgPIDCode.inputName, null);
          }
        },
        onSearchFn: function (query) {
          const searchObj = {
            query: query,
            mfgType: CORE.MFG_TYPE.MFG,
            inputName: vm.autoCompletecomponent.inputName,
            isContainCPN: true
          };
          return getComponentDetailsByMfg(searchObj);
        }
      };

      vm.autoCompletecomponentOther = {
        columnName: 'mfgPN',
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'Other Charges',
        placeholderName: 'Other Charges',
        isAddnew: true,
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          category: CORE.PartType.Other
        },
        isRequired: true,
        callbackFn: function (obj) {
          const searchObj = {
            id: obj ? obj.id : null,
            isContainCPN: true
          };
          return getOtherComponentDetails(searchObj);
        },
        onSelectCallbackFn: (item) => {
          if (item) {
            if (item.id) {
              let messageContent;
              if (item.isGoodPart === CORE.PartCorrectList.CorrectPart) {
                vm.invoiceDetail.partID = item.id;
                vm.invoiceDetail.mfgcodeID = item.mfgcodeID;
                vm.invoiceDetail.mfgCode = item.mfgCode;
                vm.invoiceDetail.mfgName = item.mfgName;
                vm.invoiceDetail.fullMfgName = item.mfgCodeName;
                vm.invoiceDetail.mfgPN = item.orgMfgPN;
                vm.invoiceDetail.PIDCode = item.PIDCode;
                vm.invoiceDetail.rohsIcon = item.rohsIcon;
                vm.invoiceDetail.rohsName = item.rohsName;
                vm.invoiceDetail.partType = item.partType;
                vm.invoiceDetail.imageURL = BaseService.getPartMasterImageURL(item.documentPath, item.imageURL);
                vm.autoCompleteMfgPIDCodeOther.keyColumnId = item.id;
              } else {
                messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MFRPN_BAD_PART);
                messageContent.message = stringFormat(messageContent.message, item.PIDCode, item.isGoodPart === CORE.PartCorrectList.IncorrectPart ? CORE.PartCorrectLabelList.IncorrectPart : CORE.PartCorrectLabelList.UnknownPart);
                const model = {
                  messageContent: messageContent,
                  multiple: true
                };
                DialogFactory.messageAlertDialog(model).then(() => {
                  if (vm.supplierRMADet) {
                    vm.supplierRMADet.partID = vm.supplierRMADet.mfgPN = null;
                  }
                  vm.autoCompletecomponent.keyColumnId = null;
                  vm.autoCompleteMfgPIDCode.keyColumnId = null;
                  setFocusByName(CORE.LabelConstant.MFG.MFGPN);
                });
              }
            }
            if (vm.invoiceDetail && vm.invoiceDetail.id) {
              const chargeTypeList = _.filter(vm.sourceData, (data) => data.packingSlipSerialNumber > CORE.InvoiceOtherChargeStartNumber);
              if (chargeTypeList.length === 0) {
                vm.invoiceDetail.packingSlipSerialNumber = (CORE.InvoiceOtherChargeStartNumber + 1);
              } else {
                const findChargeTypeObj = _.find(chargeTypeList, (data) => data.partID === item.id);
                if (findChargeTypeObj) {
                  vm.invoiceDetail.packingSlipSerialNumber = findChargeTypeObj.packingSlipSerialNumber;
                  vm.invoiceDetail.id = findChargeTypeObj.id;
                  vm.checkPackingLine();
                } else {
                  vm.invoiceDetail.packingSlipSerialNumber = parseInt(vm.invoiceDetail.packingSlipSerialNumber);
                }
              }
            } else {
              const chargeTypeList = _.filter(vm.sourceData, (data) => data.packingSlipSerialNumber > CORE.InvoiceOtherChargeStartNumber);
              if (chargeTypeList.length === 0) {
                vm.invoiceDetail.packingSlipSerialNumber = (CORE.InvoiceOtherChargeStartNumber + 1);
              } else {
                const findChargeTypeObj = _.find(chargeTypeList, (data) => data.partID === item.id);
                if (findChargeTypeObj) {
                  vm.invoiceDetail.packingSlipSerialNumber = findChargeTypeObj.packingSlipSerialNumber;
                  vm.invoiceDetail.id = findChargeTypeObj.id;
                  vm.checkPackingLine();
                } else {
                  _.map(chargeTypeList, (data) => {
                    data.packingSlipSerialNumber = parseInt(data.packingSlipSerialNumber);
                  });
                  const lastObj = _.maxBy(chargeTypeList, 'packingSlipSerialNumber');
                  vm.invoiceDetail.packingSlipSerialNumber = lastObj ? (lastObj.packingSlipSerialNumber + 1) : 0;
                }
              }
            }
          } else {
            vm.invoiceDetail.partID = null;
            vm.invoiceDetail.mfgCode = null;
            vm.invoiceDetail.mfgName = null;
            vm.invoiceDetail.mfgcodeID = null;
            vm.invoiceDetail.fullMfgName = null;
            vm.invoiceDetail.mfgPN = null;
            vm.invoiceDetail.PIDCode = null;
            vm.invoiceDetail.rohsIcon = null;
            vm.invoiceDetail.rohsName = null;
            vm.invoiceDetail.imageURL = null;
            $scope.$broadcast(vm.autoCompleteMfgPIDCode.inputName, null);
          }
        }
      };

      vm.autoCompleteMfgPIDCode = {
        columnName: 'PIDCode',
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'autoCompleteMfgPIDCode',
        placeholderName: CORE.LabelConstant.MFG.PID,
        isAddnew: true,
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          popupAccessRoutingState: [USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE],
          pageNameAccessLabel: CORE.LabelConstant.PART_MASTER.PageName
        },
        isRequired: true,
        callbackFn: function () {
        },
        onSelectCallbackFn: (item) => {
          if (item && item.id) {
            $scope.$broadcast(vm.autoCompletecomponent.inputName, item);
          } else if (!item) {
            $scope.$broadcast(vm.autoCompletecomponent.inputName, null);
          }
        },
        onSearchFn: function (query) {
          const searchObj = {
            query: query,
            mfgType: CORE.MFG_TYPE.MFG,
            inputName: vm.autoCompleteMfgPIDCode.inputName,
            isContainCPN: true
          };
          return getComponentDetailsByMfg(searchObj);
        }
      };

      vm.autoCompleteMfgPIDCodeOther = {
        columnName: 'PIDCode',
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'autoCompleteMfgPIDCodeOther',
        placeholderName: CORE.LabelConstant.MFG.PID,
        isAddnew: true,
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          category: CORE.PartType.Other
        },
        isRequired: true,
        callbackFn: function (obj) {
          const searchObj = {
            id: obj ? obj.id : null,
            isContainCPN: true
          };
          return getOtherComponentDetails(searchObj);
        },
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.autoCompletecomponentOther.keyColumnId = item.id;
          } else {
            vm.autoCompletecomponentOther.keyColumnId = null;
          }
        },
        onSearchFn: function (query) {
          const searchObj = {
            query: query,
            mfgType: CORE.MFG_TYPE.MFG,
            inputName: vm.autoCompleteMfgPIDCodeOther.inputName,
            isContainCPN: true
          };
          return getComponentDetailsByMfg(searchObj);
        }
      };
      setFocus('slipLine');
    };

    vm.InvoiceNumberSameAsPSNumberOnChange = () => {
      if (vm.packingSlip && vm.packingSlip.invoiceNumberSameAsPSNumber) {
        vm.packingSlip.invoiceNumber = vm.packingSlip.packingSlipNumber;
        vm.supplierInvoiceForm.invoiceNumber.$setDirty(true);
        vm.supplierInvoiceForm.invoiceNumber.$touched = true;
        vm.checkUniquePackingSlipNumber('InvText');
      }
    };

    vm.checkUniquePackingSlipNumber = (callFrom) => {
      //setHeaderInformation();
      let checkUniqueNumber = null;
      let receiptType = null;
      if (vm.IsInvoiceState) {
        checkUniqueNumber = vm.packingSlip.invoiceNumber;
        receiptType = TRANSACTION.PackingSlipReceiptType.SupplierInvoice;
      } else if (vm.IsCreditMemoState) {
        checkUniqueNumber = vm.packingSlip.creditMemoNumber;
        receiptType = TRANSACTION.PackingSlipReceiptType.CreditMemo;
      } else if (vm.IsDebitMemoState) {
        if (callFrom === 'RefCrdText') {
          checkUniqueNumber = vm.packingSlip.refSupplierCreditMemoNumber;
          receiptType = TRANSACTION.PackingSlipReceiptType.CreditMemo;
        } else {
          checkUniqueNumber = vm.packingSlip.debitMemoNumber;
          receiptType = TRANSACTION.PackingSlipReceiptType.DebitMemo;
        }
      } else {
        checkUniqueNumber = null;
        receiptType = null;
      }

      if (vm.packingSlip && (checkUniqueNumber && vm.packingSlip.mfgCodeID)) {
        vm.cgBusyLoading = PackingSlipFactory.checkUniquePackingSlipNumber().query({
          id: vm.packingSlip.id || 0,
          name: checkUniqueNumber,
          mfgCodeId: vm.packingSlip.mfgCodeID,
          receiptType: receiptType
        }).$promise.then((res) => {
          vm.cgBusyLoading = false;
          if (res && res.data) {
            let invoiceName = null;
            if (vm.IsInvoiceState) {
              invoiceName = 'Invoice#';
            } else if (vm.IsCreditMemoState) {
              invoiceName = 'Credit Memo#';
            } else if (vm.IsDebitMemoState) {
              if (callFrom === 'RefCrdText') {
                invoiceName = 'Credit Memo#';
              } else {
                invoiceName = 'Debit Memo#';
              }
            } else {
              typeOfMemo = null;
              receiptType = null;
            }
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PACKING_SLIP_UNIQUE);
            messageContent.message = stringFormat(messageContent.message, invoiceName, checkUniqueNumber, vm.packingSlip.mfgFullName, invoiceName);
            const obj = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(obj).then((yes) => {
              if (yes) {
                if (callFrom === 'SupplierAuto') {
                  vm.autoCompleteSupplier.keyColumnId = null;
                  setFocusByName('Supplier');
                } else if (callFrom === 'InvText') {
                  vm.packingSlip.invoiceNumber = null;
                  vm.packingSlip.invoiceNumberSameAsPSNumber = false;
                  setFocus('invoiceNumber');
                } else if (callFrom === 'DebText') {
                  vm.packingSlip.debitMemoNumber = null;
                  setFocus('invoiceNumber');
                } else if (callFrom === 'CrdText') {
                  vm.packingSlip.creditMemoNumber = null;
                  setFocus('invoiceNumber');
                } else if (callFrom === 'RefCrdText') {
                  vm.packingSlip.refSupplierCreditMemoNumber = null;
                  setFocus('refSupplierCreditMemoNumber');
                }
              }
            }, () => {

            }).catch((error) => BaseService.getErrorLog(error));
          } else {
            if (vm.packingSlip && vm.packingSlip.mfgCodeID && (vm.sourceData && vm.sourceData.length > 0)) {
              const pidString = _.map(_.filter(vm.sourceData, (data) => data.supplierMfgCodeId && data.supplierMfgCodeId !== vm.packingSlip.mfgCodeID), 'supplierPN').join(',');
              if (pidString) {
                const objSupplier = _.find(vm.supplierList, (data) => data.id === vm.packingSlip.mfgCodeID);
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MISMATCH_SUPPLIER);
                messageContent.message = stringFormat(messageContent.message, pidString, objSupplier ? objSupplier.mfgCodeName : '');
                const model = {
                  messageContent: messageContent,
                  multiple: true
                };
                return DialogFactory.messageAlertDialog(model).then((yes) => {
                  if (yes) {
                    vm.autoCompleteSupplier.keyColumnId = null;
                  }
                }, () => {

                }).catch((error) => BaseService.getErrorLog(error));
              }
            };
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.getPSDetail = ($event, isEnter) => {
      $timeout(() => {
        if (isEnter) {
          if ($event.keyCode === 13) {
            if (vm.packingSlip.packingSlipNumber || vm.packingSlip.poNumber) {
              setFocus('invoiceTotalDue');
            }
          }
        } else {
          vm.getPackingSlipDetailByPackingSlipNumber();
        }
      });
      /** Prevent enter key submit event */
      preventInputEnterKeyEvent($event);
    };

    vm.getPackingSlipDetailByPackingSlipNumber = (validateOnSaveTime) => {
      if (vm.packingSlip && vm.packingSlip.packingSlipNumber) {
        vm.cgBusyLoading = SupplierInvoiceFactory.getPackingSlipDetailByPackingSlipNumber().query({
          packingSlipNumber: vm.packingSlip.packingSlipNumber,
          mfgCodeId: vm.packingSlip.mfgCodeId || null,
          creditMemoType: vm.isShowRMADetail ? vm.packingSlip.creditMemoType : vm.creditMemoType[0].value
        }).$promise.then((response) => {
          if (response && response.data) {
            if (response.data.IsSuccess && response.data.ErrorCode === 0 && !validateOnSaveTime) {
              const objPackingSlip = _.first(response.data.PackingSlipDetail);
              vm.packingSlip = objPackingSlip;
              vm.packingSlip.isTariffInvoice = true;
              vm.packingSlip.isZeroValue = false;
              vm.packingSlip.invoiceNumberSameAsPSNumber = false;
              if (vm.IsInvoiceState) {
                vm.packingSlip.invoiceNumberSameAsPSNumber = (vm.packingSlip.invoiceNumber === vm.packingSlip.packingSlipNumber);
              }
              vm.packingSlip.poDate = objPackingSlip.poDate ? BaseService.getUIFormatedDate(objPackingSlip.poDate, vm.DefaultDateFormat) : '';
              vm.packingSlip.soDate = objPackingSlip.soDate ? BaseService.getUIFormatedDate(objPackingSlip.soDate, vm.DefaultDateFormat) : '';

              if (vm.isShowRMADetail) {
                vm.packingSlip.creditMemoType = vm.creditMemoType[1].value;
                vm.packingSlip.creditMemoDate = objPackingSlip.creditMemoDate ? BaseService.getUIFormatedDate(objPackingSlip.creditMemoDate, vm.DefaultDateFormat) : BaseService.getUIFormatedDate(vm.packingSlip.poDate, vm.DefaultDateFormat);
                vm.packingSlip.applyDate = objPackingSlip.applyDate ? BaseService.getUIFormatedDate(objPackingSlip.applyDate, vm.DefaultDateFormat) : BaseService.getUIFormatedDate(vm.packingSlip.poDate, vm.DefaultDateFormat);
              } else {
                if (vm.IsCreditMemoState) {
                  vm.packingSlip.creditMemoType = vm.creditMemoType[0].value;
                } else {
                  vm.packingSlip.creditMemoType = null;
                }
                vm.packingSlip.invoiceDate = objPackingSlip.invoiceDate ? BaseService.getUIFormatedDate(objPackingSlip.invoiceDate, vm.DefaultDateFormat) : BaseService.getUIFormatedDate(vm.packingSlip.packingSlipDate, vm.DefaultDateFormat);
                vm.packingSlip.applyDate = objPackingSlip.applyDate ? BaseService.getUIFormatedDate(objPackingSlip.applyDate, vm.DefaultDateFormat) : BaseService.getUIFormatedDate(vm.packingSlip.invoiceDate, vm.DefaultDateFormat);
              }

              if (vm.soDateOptions && vm.packingSlip.poDate) {
                vm.soDateOptions.minDate = new Date(vm.packingSlip.poDate);
              } else {
                vm.soDateOptions = { minDate: new Date(vm.packingSlip.poDate) };
              }
              if (vm.poDateOptions && vm.packingSlip.soDate) {
                vm.poDateOptions.maxDate = new Date(vm.packingSlip.soDate) || vm.currentDate;
              } else if (!vm.packingSlip.soDate) {
                vm.poDateOptions.maxDate = vm.currentDate;
              }
              vm.packingSlip.packingSlipDate = objPackingSlip.packingSlipDate ? BaseService.getUIFormatedDate(objPackingSlip.packingSlipDate, vm.DefaultDateFormat) : '';
              vm.packingSlip.receiptDate = objPackingSlip.receiptDate ? BaseService.getUIFormatedDate(objPackingSlip.receiptDate, vm.DefaultDateFormat) : '';
              vm.packingSlip.refPackingSlipId = vm.packingSlip.id;
              vm.sourceData = angular.copy(response.data.PackingSlipLineDetail);
              _.map(vm.sourceData, (data) => {
                if (vm.isDisableEditPageFields) {
                  data.isDisabledDelete = true;
                  data.isDisableViewTemplate = true;
                }
              });

              setHeaderInformation();
              initAutoComplete();
              vm.isGetPSDetail = true;
              setFocus('invoiceTotalDue');
            }
            else if (!response.data.IsSuccess && [1, 3, 4, 5].indexOf(response.data.ErrorCode) !== -1) {
              let messageContent;
              if (response.data.ErrorCode === 1) {
                messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PACKING_SLIP_NOT_FOUND);
                messageContent.message = stringFormat(messageContent.message, vm.packingSlip.packingSlipNumber);
              } else if (response.data.ErrorCode === 3) {
                if (vm.isShowRMADetail) {
                  messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SUPPLIER_RMA_ALREADY_CREATED);
                  messageContent.message = stringFormat(messageContent.message, vm.packingSlip.packingSlipNumber, response.data.FullMFGCode);
                } else {
                  messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SUPPLIER_INVOICE_ALREADY_CREATED);
                  messageContent.message = stringFormat(messageContent.message, vm.packingSlip.packingSlipNumber, response.data.FullMFGCode);
                }
              } else if (response.data.ErrorCode === 4) {
                if (vm.isShowRMADetail) {
                  messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RMA_NOT_DETAIL_LINE);
                  messageContent.message = stringFormat(messageContent.message, vm.packingSlip.packingSlipNumber);
                } else {
                  messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PACKING_SLIP_NOT_DETAIL_LINE);
                  messageContent.message = stringFormat(messageContent.message, vm.packingSlip.packingSlipNumber);
                }
              } else if (response.data.ErrorCode === 5) {
                if (vm.isShowRMADetail) {
                  messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RMA_NOT_IN_SHIPPED_CREDIT_MEMO_NOT_CREATE);
                  messageContent.message = stringFormat(messageContent.message, vm.packingSlip.packingSlipNumber);
                } else {
                  messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PACKING_SLIP_IN_DRAFT_INVOICE_NOT_CREATE);
                  messageContent.message = stringFormat(messageContent.message, 'supplier invoice', vm.packingSlip.packingSlipNumber);
                }
              }
              if (messageContent) {
                const model = {
                  messageContent: messageContent,
                  multiple: true
                };
                DialogFactory.messageAlertDialog(model).then((yes) => {
                  if (yes) {
                    if (!validateOnSaveTime) {
                      vm.packingSlip.packingSlipNumber = null;
                      vm.packingSlip.invoiceNumberSameAsPSNumber = false;
                      setFocus('packingSlipNumber');
                    } else {
                      $scope.$parent.vm.saveBtnDisableFlag = false;
                      return;
                    }
                  }
                }).catch((error) => BaseService.getErrorLog(error));
              }
            }
            else if (!response.data.IsSuccess && response.data.ErrorCode === 2 && !validateOnSaveTime) {
              if (vm.isShowRMADetail) {
                selectPackingSlipPopup(vm.packingSlip.poNumber);
              } else {
                selectPackingSlipPopup(vm.packingSlip.packingSlipNumber);
              }
            } else if (validateOnSaveTime) {
              vm.saveInvoice();
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    const selectPackingSlipPopup = (refNumber) => {
      const obj = {
        packingSlipNumber: vm.isShowRMADetail ? null : refNumber,
        poNumber: vm.isShowRMADetail ? refNumber : null,
        isShowRMADetail: vm.isShowRMADetail
      };
      DialogFactory.dialogService(
        TRANSACTION.TRANSACTION_PACKING_SLIP_CONTROLLER,
        TRANSACTION.TRANSACTION_PACKING_SLIP_VIEW,
        event,
        obj).then(() => {
        }, (selectItem) => {
          if (selectItem) {
            if (vm.isShowRMADetail) {
              vm.packingSlip.poNumber = selectItem.poNumber;
            } else {
              vm.packingSlip.packingSlipNumber = selectItem.packingSlipNumber;
            }
            vm.packingSlip.mfgCodeId = selectItem.mfgCodeID;
            vm.getPackingSlipDetailByPackingSlipNumber();
          } else {
            setFocus('packingSlipNumber');
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    function setRadioButtonForLineDetails() {
      if (vm.packingSlip.isTariffInvoice) {
        vm.RadioGroup.type.array[0].isDisabled = false;
        vm.RadioGroup.type.array[1].isDisabled = false;
        if (vm.invoiceDetail) {
          vm.invoiceDetail.materialType = true;
        }
      } else {
        vm.RadioGroup.type.array[0].isDisabled = true;
        vm.RadioGroup.type.array[1].isDisabled = false;
        if (vm.invoiceDetail) {
          vm.invoiceDetail.materialType = false;
        }
      }
    }

    vm.changeInvoiceType = () => {
      setRadioButtonForLineDetails();
      if (vm.packingSlip.isTariffInvoice) {
        vm.resetPackingSlip();
      } else {
        vm.isGetPSDetail = false;
        vm.recordUpdate = false;
        //objOfLineItem = {};
        vm.packingSlip = {
          isTariffInvoice: false,
          invoiceNumberSameAsPSNumber: false,
          markedForRefund: false,
          isZeroValue: false
        };
        vm.sourceData = [];
        if (vm.supplierInvoiceForm) {
          vm.supplierInvoiceForm.$setPristine();
          vm.supplierInvoiceForm.$setUntouched();
        }
        setFocus('invoiceTotalDue');
      }
      vm.packingSlip.packingSlipNumber = null;
      setHeaderInformation();
    };

    vm.changeCreditMemoType = () => {
      if (vm.packingSlip.creditMemoType === vm.creditMemoType[1].value) {
        vm.invoiceDetail.materialType = true;
        vm.isShowRMADetail = true;
        vm.isManualCreditMemo = false;
      } else if (vm.packingSlip.creditMemoType === vm.creditMemoType[2].value) {
        vm.invoiceDetail.materialType = true;
        vm.isShowRMADetail = false;
        vm.isManualCreditMemo = true;
      }
      setHeaderInformation();
    };

    vm.changeInvoiceCharge = () => {
      if (vm.invoiceDetail.materialType) {
        vm.invoiceDetail = {
          materialType: true,
          isZeroValue: false,
          status: vm.VerificationGridHeaderDropdown[2].dbValue
        };
      } else {
        vm.invoiceDetail = {
          materialType: false,
          isZeroValue: false,
          status: vm.VerificationGridHeaderDropdown[2].dbValue
        };
      }
      $scope.$broadcast(vm.autoCompletecomponent ? vm.autoCompletecomponent.inputName : '', null);
      $scope.$broadcast(vm.autoCompleteMfgPIDCode ? vm.autoCompleteMfgPIDCode.inputName : '', null);
      if (vm.autoCompletecomponentOther) {
        vm.autoCompletecomponentOther.keyColumnId = null;
      }
      if (vm.autoCompleteMfgPIDCodeOther) {
        vm.autoCompleteMfgPIDCodeOther.keyColumnId = null;
      }

      if (vm.invoiceDetailForm) {
        vm.invoiceDetailForm.$setPristine();
        vm.invoiceDetailForm.$setUntouched();
      }
    };

    vm.resetPackingSlip = () => {
      vm.isGetPSDetail = false;
      vm.recordUpdate = false;
      vm.InvoiceDetailDisable = false;
      //objOfLineItem = {};
      vm.packingSlip = {
        isTariffInvoice: true,
        invoiceNumberSameAsPSNumber: false,
        creditMemoType: vm.IsCreditMemoState ? vm.creditMemoType[1].value : null,
        markedForRefund: false,
        isZeroValue: false
      };
      vm.sourceData = [];
      if (vm.supplierInvoiceForm) {
        vm.supplierInvoiceForm.$setPristine();
        vm.supplierInvoiceForm.$setUntouched();
      }

      initAutoComplete();
      setFocus('packingSlipNumber');

      $timeout(() => {
        if (vm.supplierInvoiceForm) {
          vm.supplierInvoiceForm.$setPristine();
          vm.supplierInvoiceForm.$setUntouched();
        }
      });
      setHeaderInformation();
    };

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['packingSlipSerialNumber', 'ASC']],
        SearchColumns: [],
        pageName: CORE.PAGENAME_CONSTANT[7].PageName,
        packingSlipID: vm.packingSlipID
      };
    };
    initPageInfo();

    vm.gridOptions = {
      showColumnFooter: true,
      enableRowHeaderSelection: true,
      enableFullRowSelection: false,
      enableRowSelection: true,
      multiSelect: true,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      enableCellEdit: false,
      enableCellEditOnFocus: true,
      exporterCsvFilename: 'Supplier Invoice.csv',
      enableSorting: vm.packingSlipID ? true : false
    };

    const sourceHeader = () => {
      vm.sourceHeader = [
        {
          field: 'Action',
          cellClass: 'layout-align-center-center',
          displayName: 'Action',
          width: '110',
          cellTemplate: '<grid-action-view grid="grid" row="row" ng-if="row.visible" number-of-action-button="3"></grid-action-view>',
          enableFiltering: false,
          enableSorting: false,
          exporterSuppressExport: true,
          pinnedLeft: true
        },
        {
          field: 'packingSlipSerialNumber',
          width: '80',
          displayName: vm.IsInvoiceState ? 'Invoice Line#' : vm.IsCreditMemoState ? 'Credit Memo Line#' : 'Debit Memo Line#',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right">{{grid.appScope.$parent.vm.getTotalLineItems()}}</div>',
          enableFiltering: vm.packingSlipID ? true : false,
          visible: true,
          isMenuItemDisabled: false
        },
        {
          field: 'refInvoiceLine',
          displayName: 'Ref. Invoice Line#',
          width: '160',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableFiltering: vm.packingSlipID ? true : false,
          isConditionallyVisibleColumn: true,
          visible: true,
          isMenuItemDisabled: false
        },
        {
          field: 'refInvoiceNumberForMemo',
          displayName: 'Ref. Invoice#',
          width: '180',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                          <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToSupplierInvoiceDetail(row.entity);" tabindex="-1">{{COL_FIELD}}</a>\
                        </div>',
          enableFiltering: vm.packingSlipID ? true : false,
          isConditionallyVisibleColumn: true,
          visible: true,
          isMenuItemDisabled: false
        },
        {
          field: 'receivedStatusValue',
          displayName: 'Received Status',
          width: '185',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center" ng-if="row.entity.receivedStatus">'
            + '<span class="label-box" \
                              ng-class="{\'label-success\':row.entity.receivedStatus == \'A\', \
                                  \'light-green-bg\':row.entity.receivedStatus === \'AD\', \
                                  \'label-warning\':row.entity.receivedStatus == \'P\', \
                                  \'label-danger\':row.entity.receivedStatus == \'R\'}"> \
                                        {{ COL_FIELD }}'
            + '</span>'
            + '</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.dropDownPackingSlipReceivedStatus
          },
          ColumnDataType: 'StringEquals',
          enableFiltering: vm.packingSlipID ? true : false,
          enableSorting: false,
          isConditionallyVisibleColumn: true,
          visible: true,
          isMenuItemDisabled: false
        },
        {
          field: 'mfgPN',
          displayName: CORE.LabelConstant.MFG.MFGPN,
          cellTemplate: '<common-pid-code-label-link ng-if="row.entity.partID" \
                                    component-id="row.entity.partID" \
                                    label="grid.appScope.$parent.vm.CORE.LabelConstant.MFG.MFGPN" \
                                    value="row.entity.mfgPN" \
                                    is-copy="true" \
                                    is-custom-part="row.entity.isCustom || row.entity.isCustomSupplier "\
                                    rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.rohsIcon" \
                                    rohs-status="row.entity.rohsName" \
                                    supplier-name="(row.entity.isCustom || row.entity.isCustomSupplier) ? null :grid.appScope.$parent.vm.packingSlipData && grid.appScope.$parent.vm.packingSlipData.mfgCodemst ? grid.appScope.$parent.vm.packingSlipData.mfgCodemst.mfgName : null" \
                                    is-search-findchip="true"></common-pid-code-label-link>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
          allowCellFocus: false,
          ColumnDataType: 'StringEquals',
          enableFiltering: vm.packingSlipID ? true : false,
          visible: true,
          isMenuItemDisabled: false
        },
        {
          field: 'packingSlipQty',
          displayName: vm.isShowRMADetail ? 'Credit Memo Qty' : 'Packing Slip Qty',
          width: '120',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal }}</div>',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right" >{{grid.appScope.$parent.vm.getQtySum("packingSlipQty")}}</div>',
          enableFiltering: vm.packingSlipID ? true : false,
          visible: true,
          isMenuItemDisabled: false
        },
        {
          field: 'invoicePrice',
          displayName: vm.isShowRMADetail ? 'Credit Memo Unit Price' : 'Invoice Unit Price',
          width: '120',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="COL_FIELD || COL_FIELD === 0">{{COL_FIELD | unitPrice }}</div>',
          //footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right" >{{grid.appScope.$parent.vm.getFooterTotal("invoicePrice")}}</div>',
          enableFiltering: vm.packingSlipID ? true : false,
          visible: true,
          isMenuItemDisabled: false
        },
        {
          field: 'extendedPrice',
          displayName: vm.isShowRMADetail ? 'Extended Credit Memo Price' : 'Extended Invoice Price',
          width: '140',
          treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="COL_FIELD || COL_FIELD === 0" ng-class="{\'color- red\': COL_FIELD < 0}">{{COL_FIELD | amount }}</div>',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right">{{grid.appScope.$parent.vm.getFooterTotal("extendedPrice")}}</div>',
          enableFiltering: vm.packingSlipID ? true : false,
          visible: true,
          isMenuItemDisabled: false
        },
        {
          field: 'receivedQty',
          displayName: vm.isShowRMADetail ? vm.LabelConstant.SupplierRMA.ShippedQty : 'Received Qty',
          width: '120',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal }}</div>',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right" >{{grid.appScope.$parent.vm.getQtySum("receivedQty")}}</div>',
          enableFiltering: vm.packingSlipID ? true : false,
          visible: true,
          isMenuItemDisabled: false
        },
        {
          field: 'purchasePrice',
          displayName: 'PO Unit Price',
          width: '140',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="COL_FIELD || COL_FIELD === 0">{{COL_FIELD | unitPrice }}</div>',
          //footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right" >{{grid.appScope.$parent.vm.getFooterTotal("purchasePrice")}}</div>',
          enableFiltering: vm.packingSlipID ? true : false,
          visible: true,
          isMenuItemDisabled: false
        },
        {
          field: 'extendedReceivedPrice',
          displayName: 'Extended PO Price',
          width: '140',
          treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="COL_FIELD || COL_FIELD === 0" ng-class="{\'color- red\': COL_FIELD < 0}">{{COL_FIELD | amount }}</div>',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right">{{grid.appScope.$parent.vm.getFooterTotal("extendedReceivedPrice")}}</div>',
          enableFiltering: vm.packingSlipID ? true : false,
          visible: true,
          isMenuItemDisabled: false
        },
        {
          field: 'discount',
          displayName: vm.LabelConstant.SupplierInvoice.Discount,
          width: '120',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right color-red" ng-if="COL_FIELD && COL_FIELD !== 0">{{COL_FIELD | unitPrice }}</div>',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right" >{{grid.appScope.$parent.vm.getFooterTotal("discount")}}</div>',
          enableFiltering: vm.packingSlipID ? true : false,
          visible: true,
          isMenuItemDisabled: false
        },
        {
          field: 'lineVariance',
          displayName: 'Line Price Variance',
          width: '140',
          treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right rec-qty color-red" ng-if="COL_FIELD">{{COL_FIELD | amount }}</div><div class="ui-grid-cell-contents grid-cell-text-right rec-qty" ng-if="!COL_FIELD">${{COL_FIELD || 0}}</div>',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right">{{grid.appScope.$parent.vm.getFooterTotal("lineVariance")}}</div>',
          enableFiltering: vm.packingSlipID ? true : false,
          visible: true,
          isMenuItemDisabled: false
        },
        {
          field: 'lineQtyVariance',
          displayName: 'Line Qty Variance',
          width: '140',
          treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right rec-qty color-red" ng-if="COL_FIELD">{{COL_FIELD | numberWithoutDecimal }}</div><div class="ui-grid-cell-contents grid-cell-text-right rec-qty" ng-if="!COL_FIELD">{{COL_FIELD || 0}}</div>',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right">{{grid.appScope.$parent.vm.getQtySum("lineQtyVariance")}}</div>',
          enableFiltering: vm.packingSlipID ? true : false,
          visible: true,
          isMenuItemDisabled: false
        },
        {
          field: 'invoiceVerificationStatusForButton',
          displayName: 'Verification Action',
          cellTemplate: '<md-button class="md-primary md-raised margin-0" ng-if="row.entity.status == \'D\'" ng-click="grid.appScope.$parent.vm.showVerificationAction(row.entity, $event)"> \
                                   Investigate & Approve \
                                </md-button>',
          enableFiltering: vm.packingSlipID ? true : false,
          enableSorting: false,
          width: 200,
          enableCellEdit: false,
          visible: true,
          isMenuItemDisabled: false
        },
        {
          field: 'isZeroValueText',
          displayName: 'Confirmed Zero Value Line',
          width: 140,
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" ng-class="{\'label-success\':row.entity.isZeroValue == 1 ,\
                                \'label-warning\':row.entity.isZeroValue == 0 }"> \
                                    {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.ConfirmedZeroInvoiceGridHeaderDropdown
          },
          ColumnDataType: 'StringEquals',
          enableFiltering: vm.packingSlipID ? true : false,
          enableSorting: false,
          visible: true,
          isMenuItemDisabled: false
        },
        {
          field: 'invoiceVerificationStatus',
          displayName: 'Charged Status',
          width: '160',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" \
                                        ng-class="{\'label-success\':row.entity.status == \'A\', \
                                                  \'label-warning\':row.entity.status == \'P\', \
                                                  \'label-danger\':row.entity.status == \'D\'}"> \
                                        {{ COL_FIELD }}'
            + '</span>'
            + '</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.VerificationGridHeaderDropdown
          },
          ColumnDataType: 'StringEquals',
          enableFiltering: vm.packingSlipID ? true : false,
          enableSorting: false,
          visible: true,
          isMenuItemDisabled: false
        },
        {
          field: 'approveNote',
          displayName: 'Approve Note',
          cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.approveNote" ng-click="grid.appScope.$parent.vm.showCommentAndApproveNote(row.entity, $event, \'Approve Note\')"> \
                                View \
                            </md-button>',
          enableFiltering: vm.packingSlipID ? true : false,
          enableSorting: false,
          width: '120',
          enableCellEdit: false,
          isConditionallyVisibleColumn: true,
          visible: true,
          isMenuItemDisabled: false
        },
        {
          field: 'comment',
          displayName: 'Line Comment',
          cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.comment" ng-click="grid.appScope.$parent.vm.showCommentAndApproveNote(row.entity, $event, \'Line Comment\')"> \
                                View \
                            </md-button>',
          enableFiltering: vm.packingSlipID ? true : false,
          enableSorting: false,
          width: '120',
          enableCellEdit: false,
          isConditionallyVisibleColumn: true,
          visible: true,
          isMenuItemDisabled: false
        },
        {
          field: 'memoNumber',
          displayName: 'Memo#',
          width: '140',
          cellTemplate: '<div class="ui-grid-cell-contents"><a tabindex="-1" class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.verifiedRecord(row.entity, $event, \'ShowMemo\')">{{COL_FIELD}}</a></div>',
          enableFiltering: vm.packingSlipID ? true : false,
          isConditionallyVisibleColumn: true,
          visible: true,
          isMenuItemDisabled: false
        },
        {
          field: 'difference',
          displayName: 'Variance Amount',
          width: '100',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | unitPrice }}</div>',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right">{{grid.appScope.$parent.vm.getFooterTotal("difference")}}</div>',
          enableFiltering: vm.packingSlipID ? true : false,
          isConditionallyVisibleColumn: true,
          visible: true,
          isMenuItemDisabled: false
        },
        {
          field: 'differenceQty',
          displayName: 'Qty Discrepancy',
          width: '90',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal }}</div>',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right">{{grid.appScope.$parent.vm.getQtySum("differenceQty")}}</div>',
          enableFiltering: vm.packingSlipID ? true : false,
          isConditionallyVisibleColumn: true,
          visible: true,
          isMenuItemDisabled: false
        },
        {
          field: 'amount',
          displayName: 'Amount',
          width: '100',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="row.entity.memoNumber">{{COL_FIELD | amount }}</div>',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right">{{grid.appScope.$parent.vm.getFooterTotal("amount")}}</div>',
          enableFiltering: vm.packingSlipID ? true : false,
          isConditionallyVisibleColumn: true,
          visible: true,
          isMenuItemDisabled: false
        },
        {
          field: 'supplierCode',
          width: 200,
          displayName: CORE.LabelConstant.MFG.SupplierCode,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                                            <a class="cm-text-decoration underline" \
                                                ng-click="grid.appScope.$parent.vm.goToSupplier(row.entity.supplierMfgCodeId);"\
                                                tabindex="-1">{{COL_FIELD}}</a>\
                                            <copy-text label="grid.appScope.$parent.vm.LabelConstant.MFG.SupplierCode" text="row.entity.supplierCode" ng-if="row.entity.supplierCode"></copy-text>\
                                        </div>',
          enableFiltering: vm.packingSlipID ? true : false,
          isConditionallyVisibleColumn: true,
          visible: false,
          isMenuItemDisabled: true
        },
        {
          field: 'supplierPN',
          displayName: CORE.LabelConstant.MFG.SupplierPN,
          cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link ng-if="row.entity.supplierMFGPNID" \
                            component-id="row.entity.supplierMFGPNID" \
                            label="grid.appScope.$parent.vm.CORE.LabelConstant.MFG.SupplierPN" \
                            value="row.entity.supplierPN" \
                            is-copy="true" \
                            rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.supplierRohsIcon" \
                            rohs-status="row.entity.supplierRohsName" \
                            supplier-name="grid.appScope.$parent.vm.packingSlip && grid.appScope.$parent.vm.packingSlip.mfgCodemst ? grid.appScope.$parent.vm.packingSlip.mfgCodemst.mfgName : null" \
                            is-search-findchip="true"></common-pid-code-label-link></div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
          allowCellFocus: false,
          enableFiltering: vm.packingSlipID ? true : false,
          isConditionallyVisibleColumn: true,
          visible: false,
          isMenuItemDisabled: true
        },
        {
          field: 'updatedAt',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
          type: 'datetime',
          enableFiltering: vm.packingSlipID ? true : false
        },
        {
          field: 'updatedByName',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          type: 'StringEquals',
          enableFiltering: vm.packingSlipID ? true : false
        },
        {
          field: 'updatedbyRole',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          type: 'StringEquals',
          enableFiltering: vm.packingSlipID ? true : false
        },
        {
          field: 'createdAt',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
          type: 'datetime',
          enableFiltering: vm.packingSlipID ? true : false
        },
        {
          field: 'createdByName',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
          type: 'StringEquals',
          enableFiltering: vm.packingSlipID ? true : false
        },
        {
          field: 'createdbyRole',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
          type: 'StringEquals',
          enableFiltering: vm.packingSlipID ? true : false
        }];
    };

    sourceHeader();

    vm.manageField = () => {
      if (vm.IsCreditMemoState || vm.IsDebitMemoState) {
        if (vm.isShowRMADetail) {
          const findIndexReceivedStatusValue = _.find(vm.sourceHeader, (data) => data.field === TRANSACTION.PackingSlipLineColumn.ReceivedStatusValue);
          if (findIndexReceivedStatusValue) {
            findIndexReceivedStatusValue.visible = false;
            findIndexReceivedStatusValue.isMenuItemDisabled = true;
          }

          const findIndexApproveNote = _.find(vm.sourceHeader, (data) => data.field === TRANSACTION.PackingSlipLineColumn.ApproveNote);
          if (findIndexApproveNote) {
            findIndexApproveNote.visible = false;
            findIndexApproveNote.isMenuItemDisabled = true;
          }

          const findIndexRefInvoiceNumber = _.find(vm.sourceHeader, (data) => data.field === TRANSACTION.PackingSlipLineColumn.RefInvoiceLine);
          if (findIndexRefInvoiceNumber) {
            findIndexRefInvoiceNumber.visible = false;
            findIndexRefInvoiceNumber.isMenuItemDisabled = true;
          }


          const findIndexRefInvoiceNumberForMemo = _.find(vm.sourceHeader, (data) => data.field === TRANSACTION.PackingSlipLineColumn.RefInvoiceNumberForMemo);
          if (findIndexRefInvoiceNumberForMemo) {
            findIndexRefInvoiceNumberForMemo.visible = false;
            findIndexRefInvoiceNumberForMemo.isMenuItemDisabled = true;
          }

          const findIndexMemoNumber = _.find(vm.sourceHeader, (data) => data.field === TRANSACTION.PackingSlipLineColumn.MemoNumber);
          if (findIndexMemoNumber) {
            findIndexMemoNumber.visible = false;
            findIndexMemoNumber.isMenuItemDisabled = true;
          }

          const findIndexDifference = _.find(vm.sourceHeader, (data) => data.field === TRANSACTION.PackingSlipLineColumn.Difference);
          if (findIndexDifference) {
            findIndexDifference.visible = false;
            findIndexDifference.isMenuItemDisabled = true;
          }

          const findIndexDifferenceQty = _.find(vm.sourceHeader, (data) => data.field === TRANSACTION.PackingSlipLineColumn.DifferenceQty);
          if (findIndexDifferenceQty) {
            findIndexDifferenceQty.visible = false;
            findIndexDifferenceQty.isMenuItemDisabled = true;
          }

          const findIndexAmount = _.find(vm.sourceHeader, (data) => data.field === TRANSACTION.PackingSlipLineColumn.Amount);
          if (findIndexAmount) {
            findIndexAmount.visible = false;
            findIndexAmount.isMenuItemDisabled = true;
          }

          const findIndexVerificationAction = _.find(vm.sourceHeader, (data) => data.displayName === TRANSACTION.PackingSlipLineColumn.VerificationAction);
          if (findIndexVerificationAction) {
            findIndexVerificationAction.visible = false;
            findIndexVerificationAction.isMenuItemDisabled = true;
          }
        }
        else {
          const findIndexReceivedStatusValue = _.find(vm.sourceHeader, (data) => data.field === TRANSACTION.PackingSlipLineColumn.ReceivedStatusValue);
          if (findIndexReceivedStatusValue) {
            findIndexReceivedStatusValue.visible = false;
            findIndexReceivedStatusValue.isMenuItemDisabled = true;
          }

          const findIndexMemoNumber = _.find(vm.sourceHeader, (data) => data.field === TRANSACTION.PackingSlipLineColumn.MemoNumber);
          if (findIndexMemoNumber) {
            findIndexMemoNumber.visible = false;
            findIndexMemoNumber.isMenuItemDisabled = true;
          }

          const findIndexDifference = _.find(vm.sourceHeader, (data) => data.field === TRANSACTION.PackingSlipLineColumn.Difference);
          if (findIndexDifference) {
            findIndexDifference.visible = false;
            findIndexDifference.isMenuItemDisabled = true;
          }

          const findIndexDifferenceQty = _.find(vm.sourceHeader, (data) => data.field === TRANSACTION.PackingSlipLineColumn.DifferenceQty);
          if (findIndexDifferenceQty) {
            findIndexDifferenceQty.visible = false;
            findIndexDifferenceQty.isMenuItemDisabled = true;
          }

          const findIndexAmount = _.find(vm.sourceHeader, (data) => data.field === TRANSACTION.PackingSlipLineColumn.Amount);
          if (findIndexAmount) {
            findIndexAmount.visible = false;
            findIndexAmount.isMenuItemDisabled = true;
          }

          if (vm.packingSlip.creditMemoType === vm.creditMemoType[2].value || vm.packingSlip.creditMemoType === vm.debitMemoType[1].value) {
            const findIndexRefInvoiceLine = _.find(vm.sourceHeader, (data) => data.field === TRANSACTION.PackingSlipLineColumn.RefInvoiceLine);
            if (findIndexRefInvoiceLine) {
              findIndexRefInvoiceLine.visible = false;
              findIndexRefInvoiceLine.isMenuItemDisabled = true;
            }

            const findIndexRefInvoiceNumberForMemo = _.find(vm.sourceHeader, (data) => data.field === TRANSACTION.PackingSlipLineColumn.RefInvoiceNumberForMemo);
            if (findIndexRefInvoiceNumberForMemo) {
              findIndexRefInvoiceNumberForMemo.visible = false;
              findIndexRefInvoiceNumberForMemo.isMenuItemDisabled = true;
            }

            const findIndexSupplierCode = _.find(vm.sourceHeader, (data) => data.field === TRANSACTION.PackingSlipLineColumn.SupplierCode);
            if (findIndexSupplierCode) {
              findIndexSupplierCode.visible = true;
              findIndexSupplierCode.isMenuItemDisabled = false;
            }

            const findIndexSupplierPN = _.find(vm.sourceHeader, (data) => data.field === TRANSACTION.PackingSlipLineColumn.SupplierPN);
            if (findIndexSupplierPN) {
              findIndexSupplierPN.visible = true;
              findIndexSupplierPN.isMenuItemDisabled = false;
            }

            const findIndexVerificationAction = _.find(vm.sourceHeader, (data) => data.displayName === TRANSACTION.PackingSlipLineColumn.VerificationAction);
            if (findIndexVerificationAction) {
              findIndexVerificationAction.visible = false;
              findIndexVerificationAction.isMenuItemDisabled = true;
            }

            const findIndexApproveNote = _.find(vm.sourceHeader, (data) => data.field === TRANSACTION.PackingSlipLineColumn.ApproveNote);
            if (findIndexApproveNote) {
              findIndexApproveNote.visible = false;
              findIndexApproveNote.isMenuItemDisabled = true;
            }
          }
        }
      }
      else {
        const findIndexRefInvoiceNumber = _.find(vm.sourceHeader, (data) => data.field === TRANSACTION.PackingSlipLineColumn.RefInvoiceLine);
        if (findIndexRefInvoiceNumber) {
          findIndexRefInvoiceNumber.visible = false;
          findIndexRefInvoiceNumber.isMenuItemDisabled = true;
        }

        const findIndexRefInvoiceNumberForMemo = _.find(vm.sourceHeader, (data) => data.field === TRANSACTION.PackingSlipLineColumn.RefInvoiceNumberForMemo);
        if (findIndexRefInvoiceNumberForMemo) {
          findIndexRefInvoiceNumberForMemo.visible = false;
          findIndexRefInvoiceNumberForMemo.isMenuItemDisabled = true;
        }
      }
    };

    vm.loadData = () => {
      if (!vm.packingSlipID && vm.sourceData && vm.sourceData.length > 0) {
        vm.totalSourceDataCount = vm.sourceData.length;
        _.map(vm.sourceData, (data) => {
          if (vm.packingSlipID) {
            data.isDisabledUpdate = false;
            data.isDisableViewTemplate = false;
          } else {
            data.isDisabledUpdate = true;
            data.isDisableViewTemplate = true;
          }

          data.isDisabledDelete = true;
          data.isRowSelectable = false;
          //data.invoicePrice = data.invoicePrice ? data.invoicePrice : 0;
          //data.purchasePrice = data.purchasePrice ? data.purchasePrice : 0;
          //data.extendedPrice = data.extendedPrice ? data.extendedPrice : 0;
          data.difference = data.difference ? data.difference : null;
          data.amount = data.amount ? data.amount : null;
          if (data.status === 'D') {
            data.isDisabledVerificationAction = false;
          } else {
            data.isDisabledVerificationAction = true;
          }
        });
        vm.packingSlip.statusText = (_.find(CORE.InvoiceVerificationStatusOptionsGridHeaderDropdown, { code: vm.PackingSlipStatus.Pending })).value;
        vm.packingSlip.showInvoiceApprovalStatusText = (_.find(vm.invoiceApprovalStatusOptionsGridHeaderDropdown, { code: 3 })).value;

        vm.packingSlip.status = vm.PackingSlipStatus.Pending;
        $scope.$parent.vm.showInvoiceStatusText = vm.packingSlip.statusText;
        $scope.$parent.vm.showInvoiceStatus = vm.packingSlip.status;
        $scope.$parent.vm.showInvoiceApprovalStatusText = vm.packingSlip.showInvoiceApprovalStatusText;
        $scope.$parent.vm.showInvoiceApprovalStatus = vm.packingSlip.invoiceApprovalStatus;
        detailOfCharges();
        if (!vm.gridOptions.enablePaging) {
          vm.currentdata = vm.sourceData.length;
          //vm.gridOptions.gridApi.infiniteScroll.resetScroll();
        }
        /*un-commented due to row selection not clear after delete row performed and reset grid click on 13-07-2021*/
        if (vm.gridOptions.clearSelectedRows) {
          vm.gridOptions.clearSelectedRows();
        }
        $timeout(() => {
          vm.resetSourceGrid();
          if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
          }
        });
      }
      else {
        vm.manageField();

        if (vm.pagingInfo.SortColumns.length === 0) {
          vm.pagingInfo.SortColumns = [['packingSlipSerialNumber', 'ASC']];
        }
        _.map(vm.pagingInfo.SearchColumns, (data) => {
          if (data.ColumnName === TRANSACTION.PackingSlipDetailColumn.InvoiceVerificationStatus) {
            data.ColumnName = TRANSACTION.PackingSlipDetailColumn.Status;
            if (data.SearchString === vm.VerificationGridHeaderDropdown[1].value) {
              data.SearchString = 'P';
            } else if (data.SearchString === vm.VerificationGridHeaderDropdown[2].value) {
              data.SearchString = 'A';
            } else if (data.SearchString === vm.VerificationGridHeaderDropdown[3].value) {
              data.SearchString = 'D';
            }
          }
        });
        vm.pagingInfo.Page = 0;
        vm.cgBusyLoading = PackingSlipFactory.getPackingSlipMaterialList().query(vm.pagingInfo).$promise.then((response) => {
          vm.sourceData = [];
          if (response.data) {
            vm.sourceData = response.data.packingSlipMaterialList;
            vm.totalSourceDataCount = response.data.Count;
            vm.statusOfMainSlip = response.data.statusOfMainSlip;
            vm.invoiceApprovalStatusOfMainSlip = response.data.invoiceApprovalStatusOfMainSlip;
            vm.invoiceTotalDue = response.data.invoiceTotalDue;
            vm.paymentAmountTotal = response.data.paymentAmountTotal;

            const otherChargeValue = _.remove(vm.sourceData, (data) => data.packingSlipSerialNumber > CORE.InvoiceOtherChargeStartNumber);
            _.filter(otherChargeValue, (data) => vm.sourceData.push(data));

            vm.packingSlip.totalExtendedPrice = 0;
            _.map(vm.sourceData, (data) => {
              if (vm.statusOfMainSlip) {
                data.isDisabledDelete = (vm.statusOfMainSlip === CORE.InvoiceVerificationStatusOptionsGridHeaderDropdown[5].code || data.memoNumber || vm.paymentAmountTotal !== 0) ? true : false;
                data.isRowSelectable = (vm.statusOfMainSlip === CORE.InvoiceVerificationStatusOptionsGridHeaderDropdown[5].code || data.memoNumber || vm.paymentAmountTotal !== 0) ? false : true;
              }
              //data.invoicePrice = data.invoicePrice ? data.invoicePrice : 0;
              //data.purchasePrice = data.purchasePrice ? data.purchasePrice : 0;
              //data.extendedPrice = data.extendedPrice ? data.extendedPrice : 0;
              data.difference = data.difference ? data.difference : null;
              data.amount = data.amount ? data.amount : null;

              if (vm.packingSlip.status === vm.PackingSlipStatus.Paid || vm.paymentAmountTotal !== 0) {
                data.isDisabledUpdate = true;
              } else {
                data.isDisabledUpdate = false;
                data.isDisableViewTemplate = false;
              }

              if (data.status === 'D') {
                data.isDisabledVerificationAction = false;
              } else {
                data.isDisabledVerificationAction = true;
              }
              if (vm.isDisableEditPageFields) {
                data.isDisabledDelete = true;
              }
            });

            detailOfCharges();

            if (vm.statusOfMainSlip) {
              vm.packingSlip.statusText = (_.find(CORE.InvoiceVerificationStatusOptionsGridHeaderDropdown, { code: vm.statusOfMainSlip })).value;
              vm.packingSlip.status = vm.statusOfMainSlip;
            }

            vm.packingSlip.showInvoiceApprovalStatusText = (_.find(vm.invoiceApprovalStatusOptionsGridHeaderDropdown, { code: vm.invoiceApprovalStatusOfMainSlip })).value;
            vm.packingSlip.invoiceApprovalStatus = vm.invoiceApprovalStatusOfMainSlip;

            $scope.$parent.vm.showInvoiceStatusText = vm.packingSlip.statusText;
            $scope.$parent.vm.showInvoiceStatus = vm.packingSlip.status;
            $scope.$parent.vm.showInvoiceApprovalStatusText = vm.packingSlip.showInvoiceApprovalStatusText;
            $scope.$parent.vm.showInvoiceApprovalStatus = vm.packingSlip.invoiceApprovalStatus;

            vm.packingSlip.invoiceTotalDue = vm.invoiceTotalDue;

            if (!vm.gridOptions.enablePaging) {
              vm.currentdata = vm.sourceData.length;
              //vm.gridOptions.gridApi.infiniteScroll.resetScroll();
            }
            /*un-commented due to row selection not clear after delete row performed and reset grid click on 13-07-2021*/
            if (vm.gridOptions.clearSelectedRows) {
              vm.gridOptions.clearSelectedRows();
            }
            if (vm.totalSourceDataCount === 0) {
              if (vm.pagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
                vm.isNoDataFound = false;
                vm.emptyState = 0;
              }
              else {
                vm.isNoDataFound = true;
                vm.emptyState = null;
              }
            }
            else {
              vm.isNoDataFound = false;
              vm.emptyState = null;
            }

            $timeout(() => {
              vm.resetSourceGrid();
              if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
                return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
              }
            });
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.getFooterTotal = (columnName) => {
      const sumOfArray = _.map(vm.sourceData, (data) => {
        if (columnName === TRANSACTION.PackingSlipColumn.TotalAmount) {
          if (data['memoNumber']) {
            return data[columnName];
          } else {
            return 0;
          }
        } else {
          return data[columnName];
        }
      });
      const sum = $filter('amount')(CalcSumofArrayElement(sumOfArray, amountDecimal));
      return sum;
    };

    vm.getTotalLineItems = () => {
      let sum = vm.sourceData.length > 0 ? vm.sourceData.length : 0;
      sum = $filter('numberWithoutDecimal')(sum);
      const display = stringFormat('Total Line Items: {0}', sum);
      return display;
    };

    vm.getQtySum = (columnName) => {
      const sum = _.sumBy(vm.sourceData, (data) => data[columnName]);
      return $filter('numberWithoutDecimal')(sum);
    };

    function deleteInvoiceLine(material) {
      let selectedIDs = [];
      if (vm.isDisableEditPageFields) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SUPPLIER_TRANSACTION_DELETE_VALIDATION_FOR_LOCKED_HALT_TRANSACTIONS);
        messageContent.message = stringFormat(messageContent.message, 'Locked');
        const model = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(model);
        return;
      }

      if (material) {
        selectedIDs.push(material.id);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((item) => item.id);
        }
      }

      if (selectedIDs) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        if (vm.IsInvoiceState) {
          messageContent.message = stringFormat(messageContent.message, 'Supplier invoice material', selectedIDs.length);
        } else if (vm.IsDebitMemoState) {
          messageContent.message = stringFormat(messageContent.message, 'Debit memo material', selectedIDs.length);
        } else if (vm.IsCreditMemoState) {
          messageContent.message = stringFormat(messageContent.message, 'Credit memo material', selectedIDs.length);
        }
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        const objIDs = {
          id: selectedIDs
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            let memoType = null;
            if (vm.IsDebitMemoState) {
              memoType = 'D';
            } else if (vm.IsCreditMemoState) {
              memoType = 'C';
            } else {
              memoType = 'I';
            }
            vm.cgBusyLoading = PackingSlipFactory.deleteSupplierInvoiceMaterial().query({ objIDs: objIDs, refInvoice: vm.packingSlipID, memoType: memoType }).$promise.then((res) => {
              if (res && res.data && (res.data.TotalCount && res.data.TotalCount > 0)) {
                BaseService.deleteAlertMessage(res.data);
              } else {
                BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        const alertModel = {
          title: USER.USER_ERROR_LABEL,
          textContent: stringFormat(USER.SELECT_ONE_LABEL, 'Supplier invoice material')
        };
        DialogFactory.alertDialog(alertModel);
      }
    };

    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };

    vm.deleteRecord = (material) => {
      if (vm.invoiceDetailForm && vm.invoiceDetailForm.$dirty) {
        const obj = {
          messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SUPPLIER_INVOICE_LINE_DETAILS_RESET_ON_DELETE_CONFIRMTION,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.resetInvoiceDetail();
            deleteInvoiceLine(material);
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        vm.resetInvoiceDetail();
        deleteInvoiceLine(material);
      }
    };

    vm.searchToDigikey = (part) => {
      BaseService.openURLInNew(RFQTRANSACTION.API_LINKS.DIGIKEY + part);
    };

    function calculateAmountDifference() {
      if (vm.packingSlip) {
        //vm.totalAmountDifference = parseFloat(vm.packingSlip.invoiceTotalDue || 0) - roundUpNum((Math.abs(parseFloat(totalExtendedPriceDisplay || 0)) + ((parseFloat(totalCreditMemoDisplay || 0) + parseFloat(debitMemoAmount || 0)) * -1)), 2);
        vm.totalAmountDifference = parseFloat(vm.packingSlip.invoiceTotalDue || 0) - roundUpNum((Math.abs(parseFloat(totalExtendedPriceForReceivedPriceDisplay || 0)) + ((parseFloat(totalCreditMemoDisplay || 0) + parseFloat(debitMemoAmount || 0)) * -1)), 2);
      } else {
        vm.totalAmountDifference = 0;
      }

      vm.packingSlip.amountDifference = vm.totalAmountDifference ? $filter('amount')(vm.totalAmountDifference) : 0;

      vm.InvoiceToPODifference = roundUpNum(parseFloat(vm.packingSlip.totalExtendedPrice || 0) - parseFloat(vm.packingSlip.totalExtendedPriceForReceivedPrice || 0), _amountFilterDecimal);
      vm.packingSlip.invoiceToPODifferenceDisplay = vm.InvoiceToPODifference ? $filter('amount')(vm.InvoiceToPODifference) : 0;
    }

    const detailOfCharges = () => {
      vm.packingSlip.totalChargies = CalcSumofArrayElement(_.map(vm.sourceData, (data) => {
        if (data.packingSlipSerialNumber > CORE.InvoiceOtherChargeStartNumber) {
          return data.extendedPrice;
        } else {
          return 0;
        }
      }), amountDecimal);

      vm.packingSlip.sumExtendedPrice = CalcSumofArrayElement(_.map(vm.sourceData, (data) => {
        if (data.packingSlipSerialNumber < CORE.InvoiceOtherChargeStartNumber) {
          return data.extendedPrice;
        } else {
          return 0;
        }
      }), amountDecimal);

      vm.packingSlip.sumDiscount = CalcSumofArrayElement(_.map(vm.sourceData, (data) => data.discount || 0), amountDecimal);

      vm.packingSlip.sumExtendedPrice = parseFloat(vm.packingSlip.sumExtendedPrice) ? vm.packingSlip.sumExtendedPrice : 0;

      vm.packingSlip.totalExtendedPrice = CalcSumofArrayElement([parseFloat(vm.packingSlip.sumExtendedPrice || 0), parseFloat(vm.packingSlip.totalChargies || 0)], amountDecimal);
      //totalExtendedPriceDisplay = vm.packingSlip.totalExtendedPrice;

      vm.packingSlip.totalChargies = vm.packingSlip.totalChargies ? $filter('amount')(vm.packingSlip.totalChargies) : 0;
      vm.packingSlip.sumExtendedPriceDisplay = vm.packingSlip.sumExtendedPrice ? $filter('amount')(vm.packingSlip.sumExtendedPrice) : 0;
      vm.packingSlip.totalExtendedPriceDisplay = vm.packingSlip.totalExtendedPrice ? $filter('amount')(vm.packingSlip.totalExtendedPrice) : 0;
      vm.packingSlip.totalDiscountDisplay = vm.packingSlip.sumDiscount ? $filter('amount')(vm.packingSlip.sumDiscount) : 0;

      vm.packingSlip.totalChargiesForReceivedPrice = CalcSumofArrayElement(_.map(vm.sourceData, (data) => {
        if (data.packingSlipSerialNumber > CORE.InvoiceOtherChargeStartNumber) {
          return data.extendedReceivedPrice;
        } else {
          return 0;
        }
      }), amountDecimal);

      vm.packingSlip.sumExtendedPriceForReceivedPrice = CalcSumofArrayElement(_.map(vm.sourceData, (data) => {
        if (data.packingSlipSerialNumber < CORE.InvoiceOtherChargeStartNumber) {
          return data.extendedReceivedPrice;
        } else {
          return 0;
        }
      }), amountDecimal);
      vm.packingSlip.sumExtendedPriceForReceivedPrice = parseFloat(vm.packingSlip.sumExtendedPriceForReceivedPrice) ? vm.packingSlip.sumExtendedPriceForReceivedPrice : 0;

      vm.packingSlip.totalExtendedPriceForReceivedPrice = CalcSumofArrayElement([parseFloat(vm.packingSlip.sumExtendedPriceForReceivedPrice || 0), parseFloat(vm.packingSlip.totalChargiesForReceivedPrice || 0), vm.packingSlip.sumDiscount || 0], amountDecimal);
      totalExtendedPriceForReceivedPriceDisplay = vm.packingSlip.totalExtendedPriceForReceivedPrice;

      vm.packingSlip.totalChargiesForReceivedPrice = vm.packingSlip.totalChargiesForReceivedPrice ? $filter('amount')(vm.packingSlip.totalChargiesForReceivedPrice) : 0;
      vm.packingSlip.sumExtendedPriceForReceivedPriceDisplay = vm.packingSlip.sumExtendedPriceForReceivedPrice ? $filter('amount')(vm.packingSlip.sumExtendedPriceForReceivedPrice) : 0;
      vm.packingSlip.totalExtendedPriceForReceivedPriceDisplay = vm.packingSlip.totalExtendedPriceForReceivedPrice ? $filter('amount')(vm.packingSlip.totalExtendedPriceForReceivedPrice) : 0;


      vm.validationInvoiceTotalDue();
      if (vm.IsInvoiceState) {
        vm.getCreditDebitMemoDet(vm.invoicePackingSlipId);
      }
      calculateAmountDifference();
    };

    vm.resetInvoiceDetail = () => {
      if (vm.packingSlip.status !== vm.PackingSlipStatus.Paid) {
        if (vm.IsInvoiceState ||
          (vm.IsCreditMemoState && vm.packingSlip.creditMemoType !== vm.creditMemoType[0].value) ||
          (vm.IsDebitMemoState && vm.packingSlip.creditMemoType !== vm.debitMemoType[0].value)) {
          vm.InvoiceDetailDisable = false;
        }
      }
      idOfSelectMultipleBarcode = null;
      vm.isScanLabel = false;
      vm.invoiceDetail = {
        materialType: (vm.packingSlip.isTariffInvoice && vm.IsInvoiceState) ? false : true,
        isZeroValue: false,
        status: vm.VerificationGridHeaderDropdown[2].dbValue
      };
      vm.lineVariance = null;
      vm.lineQtyVariance = null;
      vm.recordUpdate = false;
      if (vm.invoiceDetailForm) {
        vm.invoiceDetailForm.$setPristine();
        vm.invoiceDetailForm.$setUntouched();
      }

      $scope.$broadcast(vm.autoCompletecomponent ? vm.autoCompletecomponent.inputName : null, null);
      $scope.$broadcast(vm.autoCompleteMfgPIDCode ? vm.autoCompleteMfgPIDCode.inputName : null, null);
      if (vm.autoCompletecomponentOther) {
        vm.autoCompletecomponentOther.keyColumnId = null;
      }
      if (vm.autoCompleteMfgPIDCodeOther) {
        vm.autoCompleteMfgPIDCodeOther.keyColumnId = null;
      }
      setRadioButtonForLineDetails();

      if (vm.packingSlip.creditMemoType !== vm.creditMemoType[2].value && vm.packingSlip.creditMemoType !== vm.debitMemoType[1].value) {
        setFocus('slipLine');
      } else {
        setFocus('memoScanLabel');
      }

      $timeout(() => {
        if (vm.invoiceDetailForm) {
          vm.invoiceDetailForm.$setPristine();
          vm.invoiceDetailForm.$setUntouched();
        }
      });
    };

    /** Redirect to supplier page */
    vm.goToSupplierList = () => {
      BaseService.openInNew(USER.ADMIN_SUPPLIER_STATE, {});
    };
    vm.goToSupplier = (supplierId) => {
      if (supplierId) {
        BaseService.goToSupplierDetail(supplierId);
      }
    };
    vm.goToSupplierPartList = () => {
      BaseService.goToSupplierPartList();
    };

    vm.goToSupplierPartDetails = (id) => {
      BaseService.goToSupplierPartDetails(id);
    };

    vm.goToTermsList = () => {
      BaseService.goToGenericCategoryTermsList();
    };

    vm.goToPersonnelList = () => {
      BaseService.goToPersonnelList();
    };

    const onCallSaveInvoice = $scope.$on('CallSaveInvoice', () => {
      vm.checkStepAndAction();
    });

    const onGoBackToInvoiceList = $scope.$on('goBackToInvoiceList', () => {
      vm.goBack();
    });

    vm.goBack = () => {
      if ((vm.supplierInvoiceForm && vm.supplierInvoiceForm.$dirty) || (vm.invoiceDetailForm && vm.invoiceDetailForm.$dirty)) {
        showWithoutSavingAlertforBackButton();
      }
      else if (vm.miscForm && vm.miscForm.$dirty) {
        showWithoutSavingAlertforBackButton();
      } else {
        if (vm.IsInvoiceState) {
          $state.go(TRANSACTION.TRANSACTION_INVOICE_TARIFF_STATE);
        } else if (vm.IsCreditMemoState) {
          $state.go(TRANSACTION.TRANSACTION_INVOICE_CREDIT_MEMO_STATE);
        } else if (vm.IsDebitMemoState) {
          $state.go(TRANSACTION.TRANSACTION_INVOICE_DEBIT_MEMO_STATE);
        }
      }
    };

    const showWithoutSavingAlertforBackButton = () => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          vm.supplierInvoiceForm.$setPristine();
          vm.supplierInvoiceForm.$setUntouched();

          vm.invoiceDetailForm.$setPristine();
          vm.invoiceDetailForm.$setUntouched();

          vm.miscForm.$setPristine();
          vm.miscForm.$setUntouched();

          if (vm.IsInvoiceState) {
            $state.go(TRANSACTION.TRANSACTION_INVOICE_TARIFF_STATE);
          } else if (vm.IsCreditMemoState) {
            $state.go(TRANSACTION.TRANSACTION_INVOICE_CREDIT_MEMO_STATE);
          } else if (vm.IsDebitMemoState) {
            $state.go(TRANSACTION.TRANSACTION_INVOICE_DEBIT_MEMO_STATE);
          }
        }
      }, (error) => BaseService.getErrorLog(error));
    };

    vm.checkStepAndAction = () => {
      $scope.$parent.vm.saveBtnDisableFlag = true;
      if (vm.slipType === vm.packingSlipInvoiceTabName && BaseService.focusRequiredField(vm.supplierInvoiceForm)) {
        // commented because it set pristine in case of required field validation failed and set focus on that field, so in that case button state changed without save
        //$timeout(() => {
        //  vm.supplierInvoiceForm.$setPristine();
        //}, true);
        $scope.$parent.vm.saveBtnDisableFlag = false;
        return;
      }
      else if (vm.slipType === vm.miscTabName && BaseService.focusRequiredField(vm.miscForm)) {
        $scope.$parent.vm.saveBtnDisableFlag = false;
        return;
      }
      else if (vm.invoiceDetailForm && (vm.invoiceDetailForm.$dirty || (vm.invoiceDetailForm.$dirty && vm.invoiceDetailForm.$invalid))) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SAVE_INVOICE_LINE_DETAIL);
        const obj = {
          messageContent: messageContent,
          multiple: true
        };
        if (obj) {
          DialogFactory.messageAlertDialog(obj);
        }
        $scope.$parent.vm.saveBtnDisableFlag = false;
        return;
      }
      if (vm.packingSlipID) {
        if (vm.slipType === vm.miscTabName) {
          const dynamicControlList = DataElementTransactionValueFactory.getDataElementTransactionList(vm.dataElementList);
          DataElementTransactionValueFactory.saveTransctionValue({
            referenceTransID: parseInt(vm.packingSlipID),
            entityID: vm.entityID,
            dataElementList: dynamicControlList.dataElementList,
            removeElementList: dynamicControlList.removeElementList,
            subFormTransList: dynamicControlList.subFormTransList,
            deletedsubFormTransIDs: dynamicControlList.deletedsubFormTransIDs,
            removeSubFormTransListConditional: dynamicControlList.removeSubFormTransListConditional
          }, vm.fileList).then(() => {
            $scope.$parent.vm.saveBtnDisableFlag = false;
            DataElementTransactionValueFactory.displaySuccessMessage(dynamicControlList.dataElementList);
            vm.miscForm.$setPristine();
            vm.miscForm.$setUntouched();

            /* code for rebinding document to download - (actually all other details) */
            if (vm.fileList && !_.isEmpty(vm.fileList)) {
              vm.IsMISCTab = false;
              vm.fileList = {};
              $timeout(() => {
                vm.IsMISCTab = true;
              }, 0);
            }
          }).catch((error) => {
            $scope.$parent.vm.saveBtnDisableFlag = false;
            return BaseService.getErrorLog(error);
          });
        }
        else if (vm.slipType === vm.packingSlipInvoiceTabName) {
          if (vm.supplierInvoiceForm.$dirty) {
            const objInvoice = {
              id: vm.packingSlipID,
              mfgCodeId: vm.autoCompleteSupplier.keyColumnId,

              invoiceNumber: vm.packingSlip.invoiceNumber,
              invoiceDate: BaseService.getAPIFormatedDate(vm.packingSlip.invoiceDate),

              packingSlipNumber: vm.packingSlip.packingSlipNumber,
              packingSlipDate: BaseService.getAPIFormatedDate(vm.packingSlip.packingSlipDate),

              poNumber: vm.packingSlip.isTariffInvoice ? vm.packingSlip.poNumber : (vm.packingSlip.poNumber || vm.packingSlip.invoiceNumber),
              supplierSONumber: vm.packingSlip.isTariffInvoice ? vm.packingSlip.supplierSONumber : (vm.packingSlip.supplierSONumber || vm.packingSlip.invoiceNumber),

              debitMemoNumber: vm.packingSlip.debitMemoNumber,
              debitMemoDate: BaseService.getAPIFormatedDate(vm.packingSlip.debitMemoDate),
              refSupplierCreditMemoNumber: vm.packingSlip.refSupplierCreditMemoNumber,

              creditMemoNumber: vm.packingSlip.creditMemoNumber,
              creditMemoDate: BaseService.getAPIFormatedDate(vm.packingSlip.creditMemoDate),

              applyDate: BaseService.getAPIFormatedDate(vm.packingSlip.applyDate),
              invoiceTotalDue: vm.packingSlip.invoiceTotalDue,

              paymentTermsID: vm.packingSlip.paymentTermsID,
              termsDays: vm.packingSlip.termsDays,
              invoiceRequireManagementApproval: vm.packingSlip.invoiceRequireManagementApproval,
              internalRemark: vm.packingSlip.internalRemark,
              remark: vm.packingSlip.remark,

              poDate: BaseService.getAPIFormatedDate(vm.packingSlip.poDate),
              soDate: BaseService.getAPIFormatedDate(vm.packingSlip.soDate),

              markedForRefund: vm.packingSlip.markedForRefund,
              markedForRefundAmt: vm.packingSlip.markedForRefundAmt,

              billToAddress: BaseService.generateAddressFormateToStoreInDB(vm.billToAddress),
              billToAddressID: vm.packingSlip.billToAddressID,
              billToConactPerson: BaseService.generateContactPersonDetFormat(vm.billToAddressContactPerson),
              billToContactPersonID: vm.packingSlip.billToContactPersonID,
              isZeroValue: vm.packingSlip.isZeroValue
            };

            if (vm.IsCreditMemoState) {
              if (vm.isShowRMADetail) {
                objInvoice.creditMemoType = vm.packingSlip.creditMemoType;
                objInvoice.packingSlipNumber = vm.packingSlip.packingSlipNumber;
                objInvoice.packingSlipDate = BaseService.getAPIFormatedDate(vm.packingSlip.packingSlipDate);
                objInvoice.poNumber = vm.packingSlip.poNumber;
              } else if (vm.isManualCreditMemo) {
                objInvoice.poNumber = vm.packingSlip.poNumber || vm.packingSlip.creditMemoNumber;
                objInvoice.supplierSONumber = vm.packingSlip.supplierSONumber || vm.packingSlip.creditMemoNumber;
                objInvoice.packingSlipNumber = vm.packingSlip.packingSlipNumber || vm.packingSlip.creditMemoNumber;
                objInvoice.packingSlipDate = vm.packingSlip.packingSlipDate ? BaseService.getAPIFormatedDate(vm.packingSlip.packingSlipDate) : BaseService.getAPIFormatedDate(vm.packingSlip.creditMemoDate);
              } else {
                objInvoice.poNumber = vm.packingSlip.poNumber || vm.packingSlip.creditMemoNumber;
                objInvoice.supplierSONumber = vm.packingSlip.supplierSONumber || vm.packingSlip.creditMemoNumber;
                objInvoice.packingSlipNumber = vm.packingSlip.packingSlipNumber ? vm.packingSlip.packingSlipNumber : vm.packingSlip.creditMemoNumber;
                objInvoice.packingSlipDate = vm.packingSlip.packingSlipDate ? BaseService.getAPIFormatedDate(vm.packingSlip.packingSlipDate) : BaseService.getAPIFormatedDate(vm.packingSlip.creditMemoDate);
              }
            }
            else if (vm.IsDebitMemoState) {
              if (vm.isManualDebitMemo) {
                if (objInvoice && (!objInvoice.billToAddressID)) {
                  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ADDRESS_CONTACT_PERSON_REQUIRED_FOR_STATUS);
                  messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.Address.BillingAddress);
                  return DialogFactory.messageAlertDialog({ messageContent }).then(() => $scope.$parent.vm.saveBtnDisableFlag = false);
                } else if (objInvoice && objInvoice.billToAddressID && !objInvoice.billToContactPersonID) {
                  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ADDRESS_CONTACT_PERSON_REQUIRED_FOR_STATUS);
                  messageContent.message = stringFormat(messageContent.message, 'Billing Contact Person');
                  return DialogFactory.messageAlertDialog({ messageContent }).then(() => $scope.$parent.vm.saveBtnDisableFlag = false);
                }

                objInvoice.poNumber = vm.packingSlip.poNumber || vm.packingSlip.creditMemoNumber;
                objInvoice.supplierSONumber = vm.packingSlip.supplierSONumber || vm.packingSlip.creditMemoNumber;
                objInvoice.packingSlipNumber = vm.packingSlip.packingSlipNumber || vm.packingSlip.creditMemoNumber;
                objInvoice.packingSlipDate = vm.packingSlip.packingSlipDate ? BaseService.getAPIFormatedDate(vm.packingSlip.packingSlipDate) : BaseService.getAPIFormatedDate(vm.packingSlip.debitMemoDate);
              } else {
                objInvoice.poNumber = vm.packingSlip.poNumber || vm.packingSlip.debitMemoNumber;
                objInvoice.supplierSONumber = vm.packingSlip.supplierSONumber || vm.packingSlip.debitMemoNumber;
                objInvoice.packingSlipNumber = vm.packingSlip.packingSlipNumber ? vm.packingSlip.packingSlipNumber : vm.packingSlip.debitMemoNumber;
                objInvoice.packingSlipDate = vm.packingSlip.packingSlipDate ? BaseService.getAPIFormatedDate(vm.packingSlip.packingSlipDate) : BaseService.getAPIFormatedDate(vm.packingSlip.debitMemoDate);
              }
            }

            objInvoice.gencFileOwnerType = vm.documentEntityName;
            objInvoice.mfgFullName = vm.packingSlip.mfgFullName;


            if (vm.IsDebitMemoState) {
              objInvoice.memoType = 'D';
            } else if (vm.IsCreditMemoState) {
              objInvoice.memoType = 'C';
            } else {
              objInvoice.memoType = 'I';
            }

            vm.cgBusyLoading = PackingSlipFactory.saveInvoiceData().query(objInvoice).$promise.then((response) => {
              if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                $scope.$parent.vm.saveBtnDisableFlag = false;
                if (vm.supplierInvoiceForm) {
                  vm.supplierInvoiceForm.$setPristine();
                  vm.supplierInvoiceForm.$setUntouched();
                }
                if (vm.invoiceDetailForm) {
                  vm.invoiceDetailForm.$setPristine();
                  vm.invoiceDetailForm.$setUntouched();
                }
                vm.resetInvoiceDetail();
                if (vm.IsInvoiceState) {
                  $state.go(TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_INVOICE_STATE, { type: vm.tabType, id: parseInt(vm.packingSlipID) }, { reload: true });
                } else if (vm.IsCreditMemoState) {
                  $state.go(TRANSACTION.TRANSACTION_MANAGE_CREDIT_INVOICE_STATE, { type: vm.tabType, id: parseInt(vm.packingSlipID) }, { reload: true });
                } else if (vm.IsDebitMemoState) {
                  $state.go(TRANSACTION.TRANSACTION_MANAGE_DEBIT_INVOICE_STATE, { type: vm.tabType, id: parseInt(vm.packingSlipID) }, { reload: true });
                }
              } else {
                $scope.$parent.vm.saveBtnDisableFlag = false;
              }
            }).catch((error) => {
              $scope.$parent.vm.saveBtnDisableFlag = false;
              return BaseService.getErrorLog(error);
            });
          }
        }
      } else {
        if (!vm.packingSlipID && vm.packingSlip.isTariffInvoice && !vm.isManualCreditMemo && !vm.isManualDebitMemo) {
          vm.getPackingSlipDetailByPackingSlipNumber(true);
        } else {
          vm.saveInvoice();
        }
      }
    };

    vm.saveInvoice = () => {
      $scope.$parent.vm.saveBtnDisableFlag = true;
      const packingSlipData = angular.copy(vm.packingSlip);
      if (vm.isShowRMADetail || vm.isManualCreditMemo) {
        packingSlipData.receiptType = 'C';
      } else if (vm.isManualDebitMemo) {
        packingSlipData.receiptType = 'D';
      } else {
        packingSlipData.receiptType = 'I';
      }

      packingSlipData.status = vm.packingSlipID ? packingSlipData.status : 'PE';
      if (vm.IsCreditMemoState && !vm.packingSlipID && vm.packingSlip.creditMemoType === vm.creditMemoType[1].value) {
        packingSlipData.status = 'I';
      }
      packingSlipData.poDate = packingSlipData.poDate ? (BaseService.getAPIFormatedDate(packingSlipData.poDate)) : null;
      packingSlipData.soDate = packingSlipData.soDate ? (BaseService.getAPIFormatedDate(packingSlipData.soDate)) : null;
      if (packingSlipData.isTariffInvoice) {
        packingSlipData.packingSlipDate = packingSlipData.packingSlipDate ? (BaseService.getAPIFormatedDate(packingSlipData.packingSlipDate)) : null;
        packingSlipData.receiptDate = packingSlipData.receiptDate ? (BaseService.getAPIFormatedDate(packingSlipData.receiptDate)) : null;
        packingSlipData.invoiceDate = packingSlipData.invoiceDate ? (BaseService.getAPIFormatedDate(packingSlipData.invoiceDate)) : null;
        packingSlipData.creditMemoDate = packingSlipData.creditMemoDate ? (BaseService.getAPIFormatedDate(packingSlipData.creditMemoDate)) : null;
        packingSlipData.debitMemoDate = packingSlipData.debitMemoDate ? (BaseService.getAPIFormatedDate(packingSlipData.debitMemoDate)) : null;
        packingSlipData.applyDate = packingSlipData.applyDate ? (BaseService.getAPIFormatedDate(packingSlipData.applyDate)) : null;
        packingSlipData.refPackingSlipId = packingSlipData.id;
        packingSlipData.isTariffInvoice = !packingSlipData.isTariffInvoice;

        if (vm.isShowRMADetail) {
          packingSlipData.supplierSONumber = '';
        } else if (vm.isManualCreditMemo) {
          packingSlipData.poNumber = packingSlipData.poNumber || packingSlipData.creditMemoNumber;
          packingSlipData.supplierSONumber = packingSlipData.supplierSONumber || packingSlipData.creditMemoNumber;
          packingSlipData.packingSlipNumber = packingSlipData.packingSlipNumber || packingSlipData.creditMemoNumber;
          packingSlipData.packingSlipDate = packingSlipData.packingSlipDate ? BaseService.getAPIFormatedDate(packingSlipData.packingSlipDate) : BaseService.getAPIFormatedDate(packingSlipData.creditMemoDate);;
          packingSlipData.receiptDate = BaseService.getAPIFormatedDate(packingSlipData.creditMemoDate);
        } else if (vm.isManualDebitMemo) {
          if (packingSlipData && (!packingSlipData.billToAddressID)) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ADDRESS_CONTACT_PERSON_REQUIRED_FOR_STATUS);
            messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.Address.BillingAddress);
            return DialogFactory.messageAlertDialog({ messageContent }).then(() => $scope.$parent.vm.saveBtnDisableFlag = false);
          } else if (packingSlipData && packingSlipData.billToAddressID && !packingSlipData.billToContactPersonID) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ADDRESS_CONTACT_PERSON_REQUIRED_FOR_STATUS);
            messageContent.message = stringFormat(messageContent.message, 'Billing Contact Person');
            return DialogFactory.messageAlertDialog({ messageContent }).then(() => $scope.$parent.vm.saveBtnDisableFlag = false);
          }
          packingSlipData.poNumber = packingSlipData.poNumber || packingSlipData.debitMemoNumber;
          packingSlipData.supplierSONumber = packingSlipData.supplierSONumber || packingSlipData.debitMemoNumber;
          packingSlipData.packingSlipNumber = packingSlipData.packingSlipNumber || packingSlipData.debitMemoNumber;
          packingSlipData.packingSlipDate = packingSlipData.packingSlipDate ? BaseService.getAPIFormatedDate(packingSlipData.packingSlipDate) : (BaseService.getAPIFormatedDate(packingSlipData.debitMemoDate));
          packingSlipData.receiptDate = BaseService.getAPIFormatedDate(packingSlipData.debitMemoDate);

          packingSlipData.billToAddress = BaseService.generateAddressFormateToStoreInDB(vm.billToAddress);
          packingSlipData.billToAddressID = vm.packingSlip.billToAddressID;
          packingSlipData.billToConactPerson = BaseService.generateContactPersonDetFormat(vm.billToAddressContactPerson);
          packingSlipData.billToContactPersonID = vm.packingSlip.billToContactPersonID;
        }
      }
      else {
        const convertApiInvoiceDate = packingSlipData.invoiceDate ? (BaseService.getAPIFormatedDate(packingSlipData.invoiceDate)) : null;
        packingSlipData.invoiceDate = convertApiInvoiceDate;
        packingSlipData.applyDate = packingSlipData.applyDate ? (BaseService.getAPIFormatedDate(packingSlipData.applyDate)) : null;
        packingSlipData.packingSlipDate = packingSlipData.invoiceDate;
        packingSlipData.receiptDate = packingSlipData.invoiceDate;
        packingSlipData.packingSlipNumber = packingSlipData.invoiceNumber;
        packingSlipData.poNumber = packingSlipData.poNumber || packingSlipData.invoiceNumber;
        packingSlipData.supplierSONumber = packingSlipData.supplierSONumber || packingSlipData.invoiceNumber;
        packingSlipData.mfgCodeID = vm.autoCompleteSupplier && vm.autoCompleteSupplier.keyColumnId ? vm.autoCompleteSupplier.keyColumnId : null;
        packingSlipData.isTariffInvoice = !packingSlipData.isTariffInvoice;
      }

      const incoiceDetailList = [];
      packingSlipData.supplierSONumber = packingSlipData.supplierSONumber ? packingSlipData.supplierSONumber : '';
      packingSlipData['invoiceTotalDue'] = packingSlipData['invoiceTotalDue'] ? packingSlipData['invoiceTotalDue'] : 0;
      packingSlipData.refPurchaseOrderID = packingSlipData.refPurchaseOrderID ? packingSlipData.refPurchaseOrderID : 0;
      packingSlipData.poDate = packingSlipData.poDate ? packingSlipData.poDate : '0000-00-00';
      packingSlipData.soDate = packingSlipData.soDate ? packingSlipData.soDate : '0000-00-00';
      packingSlipData.creditMemoType = packingSlipData.creditMemoType ? packingSlipData.creditMemoType : '';
      packingSlipData.invoiceNumber = packingSlipData.invoiceNumber ? packingSlipData.invoiceNumber : '';
      packingSlipData.invoiceDate = packingSlipData.invoiceDate ? packingSlipData.invoiceDate : '0000-00-00';
      packingSlipData.creditMemoNumber = packingSlipData.creditMemoNumber ? packingSlipData.creditMemoNumber : '';
      packingSlipData.creditMemoDate = packingSlipData.creditMemoDate ? packingSlipData.creditMemoDate : '0000-00-00';
      packingSlipData.debitMemoNumber = packingSlipData.debitMemoNumber ? packingSlipData.debitMemoNumber : '';
      packingSlipData.debitMemoDate = packingSlipData.debitMemoDate ? packingSlipData.debitMemoDate : '0000-00-00';
      packingSlipData.refSupplierCreditMemoNumber = packingSlipData.refSupplierCreditMemoNumber ? packingSlipData.refSupplierCreditMemoNumber : '';

      incoiceDetailList.push(packingSlipData);
      if (Array.isArray(vm.sourceData)) {
        vm.sourceData.forEach((item) => {
          item.receivedQty = item.receivedQty ? item.receivedQty : 0;
          item.packingSlipQty = item.packingSlipQty ? item.packingSlipQty : 0;

          item.invoicePrice = item.invoicePrice ? item.invoicePrice : 0;
          item.purchasePrice = item.purchasePrice ? item.purchasePrice : 0;
          item.disputedPrice = item.disputedPrice ? item.disputedPrice : 0;

          item.extendedPrice = item.extendedPrice ? item.extendedPrice : 0;
          item.difference = item.difference ? item.difference : 0;
          item.otherCharges = item.otherCharges ? item.otherCharges : 0;
          item.refCreditDebitInvoiceNo = item.refCreditDebitInvoiceNo ? item.refCreditDebitInvoiceNo : 0;
          item.partID = item.partID ? item.partID : 0;
          item.refSupplierPartId = item.refSupplierPartId ? item.refSupplierPartId : 0;
          item.binID = item.binID ? item.binID : 0;
          item.warehouseID = item.warehouseID ? item.warehouseID : 0;
          item.parentWarehouseID = item.parentWarehouseID ? item.parentWarehouseID : 0;
          item.packagingID = item.packagingID ? item.packagingID : 0;
        });
      }
      const objInvoice = {
        jsonInvoiceDetail: JSON.stringify(incoiceDetailList),
        packingSlipId: packingSlipData.refPackingSlipId,
        invoiceNumber: packingSlipData.invoiceNumber,
        creditMemoNumber: packingSlipData.creditMemoNumber,
        debitMemoNumber: packingSlipData.debitMemoNumber,
        refSupplierCreditMemoNumber: packingSlipData.refSupplierCreditMemoNumber,
        mfgFullName: packingSlipData.mfgFullName
      };

      if (vm.IsDebitMemoState) {
        objInvoice.memoType = 'D';
      } else if (vm.IsCreditMemoState) {
        objInvoice.memoType = 'C';
      } else {
        objInvoice.memoType = 'I';
      }

      vm.cgBusyLoading = SupplierInvoiceFactory.saveInvoiceAndInvoiceLineDetail().query({ objInvoice: objInvoice }).$promise.then((response) => {
        if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          $scope.$parent.vm.saveBtnDisableFlag = false;
          if (vm.supplierInvoiceForm) {
            vm.supplierInvoiceForm.$setPristine();
            vm.supplierInvoiceForm.$setUntouched();
          }
          if (vm.invoiceDetailForm) {
            vm.invoiceDetailForm.$setPristine();
            vm.invoiceDetailForm.$setUntouched();
          }
          vm.resetInvoiceDetail();
          if (!vm.packingSlipID) {
            vm.packingSlipID = response.data.packingSlipId;
            if (vm.IsCreditMemoState) {
              $state.go(TRANSACTION.TRANSACTION_MANAGE_CREDIT_INVOICE_STATE, { type: vm.tabType, id: parseInt(vm.packingSlipID), slipType: vm.slipType, packingSlipNumber: null, poNumber: null }, { reload: true });
            } else if (vm.IsDebitMemoState) {
              $state.go(TRANSACTION.TRANSACTION_MANAGE_DEBIT_INVOICE_STATE, { type: vm.tabType, id: parseInt(vm.packingSlipID), slipType: vm.slipType, packingSlipNumber: null, poNumber: null }, { reload: true });
            } else {
              $state.go(TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_INVOICE_STATE, { type: vm.tabType, id: parseInt(vm.packingSlipID), slipType: vm.slipType, packingSlipNumber: null, poNumber: null }, { reload: true });
            }
          }
        } else {
          $scope.$parent.vm.saveBtnDisableFlag = false;
        }
      }).catch((error) => {
        $scope.$parent.vm.saveBtnDisableFlag = false;
        return BaseService.getErrorLog(error);
      });
    };

    vm.showApproveNote = (row, event) => {
      const data = row;
      data.packingSlipNumber = vm.packingSlip.packingSlipNumber;
      data.packingSlipId = vm.packingSlip.id;
      DialogFactory.dialogService(
        TRANSACTION.MEMO_APPROVE_NOTE_POPUP_CONTROLLER,
        TRANSACTION.MEMO_APPROVE_NOTE_POPUP_VIEW,
        event,
        row
      ).then(() => {
      }, () => {
      }, (err) => BaseService.getErrorLog(err));
    };

    function setRecordValues(row) {
      vm.invoiceDetail = angular.copy(row.entity);
      vm.invoiceDetail.isZeroValue = vm.invoiceDetail.isZeroValue ? true : false;
      vm.invoiceDetailCopy = angular.copy(vm.invoiceDetail);
      vm.invoiceDetail.packingSlipQty = parseInt(vm.invoiceDetail.packingSlipQty);
      vm.invoiceDetail.receivedQty = parseInt(vm.invoiceDetail.receivedQty);
      vm.invoiceDetail.invoicePrice = parseFloat(vm.invoiceDetail.invoicePrice);
      vm.invoiceDetail.purchasePrice = parseFloat(vm.invoiceDetail.purchasePrice);
      vm.invoiceDetail.extendedPrice = parseFloat(vm.invoiceDetail.extendedPrice) < 0 ? (parseFloat(vm.invoiceDetail.extendedPrice) * -1) : vm.invoiceDetail.extendedPrice;
      vm.invoiceDetail.extendedReceivedPrice = parseFloat(vm.invoiceDetail.extendedReceivedPrice) < 0 ? (parseFloat(vm.invoiceDetail.extendedReceivedPrice) * -1) : parseFloat(vm.invoiceDetail.extendedReceivedPrice);
      vm.lineVariance = vm.invoiceDetail.lineVariance ? $filter('amount')(vm.invoiceDetail.lineVariance) : 0;
      vm.lineQtyVariance = vm.invoiceDetail.lineQtyVariance ? $filter('numberWithoutDecimal')(vm.invoiceDetail.lineQtyVariance) : 0;
      setExtendedPriceforDisplay();
      if (vm.isShowRMADetail) {
        vm.invoiceDetail.rmaIssueQty = parseInt(vm.invoiceDetail.parentDetailLinePackingSlipQty);
        vm.invoiceDetail.rmaIssueUnitPrice = parseFloat(vm.invoiceDetail.parentDetailLineInvoicePrice);
        vm.invoiceDetail.extendedRmaIsuePrice = parseFloat(vm.invoiceDetail.parentDetailLineExtendedPrice) < 0 ? (parseFloat(vm.invoiceDetail.parentDetailLineExtendedPrice) * -1) : vm.invoiceDetail.parentDetailLineExtendedPrice;
      }
      vm.invoiceDetail.fullMfgName = vm.invoiceDetail.mfgName;

      //if (vm.autoCompletecomponent) {
      //getComponentDetailsByMfg({
      //  id: vm.invoiceDetail.partID,
      //  mfgType: CORE.MFG_TYPE.MFG,
      //  isContainCPN: true
      //});
      //}

      if (vm.invoiceDetail.packingSlipSerialNumber > CORE.InvoiceOtherChargeStartNumber) {
        vm.invoiceDetail.materialType = false;
      } else {
        vm.invoiceDetail.materialType = true;
        if (vm.isShowRMADetail) {
          setFocus('receivedQty');
        } else {
          setFocus('invoicePrice');
        }
      }
      $timeout(() => {
        if (vm.autoCompleteMfgPIDCode) {
          $scope.$broadcast(vm.autoCompleteMfgPIDCode.inputName, vm.invoiceDetail.PIDCode);
        }
        if (vm.autoCompletecomponent) {
          $scope.$broadcast(vm.autoCompletecomponent.inputName, `(${vm.invoiceDetail.mfgCode}) ${vm.invoiceDetail.mfgPN}`);
        }
        if (vm.autoCompletecomponentOther) {
          vm.autoCompletecomponentOther.keyColumnId = vm.invoiceDetail.partID;
        }
        if (vm.autoCompleteMfgPIDCodeOther) {
          vm.autoCompleteMfgPIDCodeOther.keyColumnId = vm.invoiceDetail.partID;
        }
      });
      vm.recordUpdate = true;
    }

    vm.updateRecord = (row) => {
      let messageContent = null;
      if (parseFloat(row.entity.packingSlipSerialNumber) < CORE.InvoiceOtherChargeStartNumber && (vm.IsCreditMemoState || vm.IsDebitMemoState) && !vm.isManualCreditMemo && !vm.isManualDebitMemo && !vm.isShowRMADetail) {
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_ALLOW_CHANGE_MEMO);
        messageContent.message = stringFormat(messageContent.message, vm.IsCreditMemoState ? 'Credit Memo' : 'Debit Memo');
      }
      else if (row.entity.receivedStatus === TRANSACTION.PackingSlipReceivedStatus[0].value) {
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PS_RECEIVED_STATUS_NOT_ALLOW_INVOICE_DETAIL);
        messageContent.message = stringFormat(messageContent.message, row.entity.packingSlipSerialNumber, TRANSACTION.PackingSlipReceivedStatus[0].key);
      }
      else if (row.entity.refCreditDebitInvoiceNo) {
        //vm.InvoiceDetailDisable = true;
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_ALLOW_UPDATE_INVOICE_FOR_MEMO_LINE);
        messageContent.message = stringFormat(messageContent.message, row.entity.packingSlipSerialNumber);
      }
      else {
        vm.InvoiceDetailDisable = false;
      }

      if (messageContent) {
        const obj = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(obj).then((yes) => {
          if (yes) {
            vm.resetInvoiceDetail();
            return false;
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
        return;
      }
      setRecordValues(row);
    };

    vm.viewTemplate = (row) => {
      vm.InvoiceDetailDisable = true;
      setRecordValues(row);
    };

    vm.calculateExtendedPrice = () => {
      if (vm.packingSlip.creditMemoType !== vm.creditMemoType[2].value && vm.packingSlip.creditMemoType !== vm.debitMemoType[1].value) {
        if (vm.invoiceDetail && vm.invoiceDetail.packingSlipQty && (vm.invoiceDetail.invoicePrice || vm.invoiceDetail.invoicePrice === 0)) {
          vm.invoiceDetail.extendedPrice = multipleUnitValue(vm.invoiceDetail.packingSlipQty, vm.invoiceDetail.invoicePrice);
        } else if (vm.invoiceDetail && !vm.invoiceDetail.packingSlipQty && !vm.invoiceDetail.materialType && (vm.invoiceDetail.invoicePrice || vm.invoiceDetail.invoicePrice === 0)) {
          vm.invoiceDetail.extendedPrice = multipleUnitValue(1, vm.invoiceDetail.invoicePrice);
          vm.invoiceDetail.packingSlipQty = 1;
        } else if (vm.invoiceDetail) {
          vm.invoiceDetail.extendedPrice = 0;
        }
      } else {
        if (vm.invoiceDetail && vm.invoiceDetail.packingSlipQty && (vm.invoiceDetail.invoicePrice || vm.invoiceDetail.invoicePrice === 0)) {
          vm.invoiceDetail.extendedPrice = multipleUnitValue(vm.invoiceDetail.packingSlipQty, vm.invoiceDetail.invoicePrice);
        } else if (vm.invoiceDetail && !vm.invoiceDetail.packingSlipQty && !vm.invoiceDetail.materialType && (vm.invoiceDetail.invoicePrice || vm.invoiceDetail.invoicePrice === 0)) {
          vm.invoiceDetail.extendedPrice = multipleUnitValue(1, vm.invoiceDetail.invoicePrice);
          vm.invoiceDetail.packingSlipQty = 1;
        } else if (vm.invoiceDetail) {
          vm.invoiceDetail.extendedPrice = 0;
        }
      }
      setExtendedPriceforDisplay(true);

      if (vm.invoiceDetail && (vm.invoiceDetail.invoicePrice !== 0 || vm.invoiceDetail.purchasePrice !== 0 || vm.invoiceDetail.discount !== 0)) {
        vm.invoiceDetail.isZeroValue = false;
      }
      vm.calculateExtendedPriceDiffrence();
    };

    vm.calculateExtendedReceicedPrice = () => {
      if (vm.invoiceDetail && vm.invoiceDetail.receivedQty && (vm.invoiceDetail.purchasePrice || vm.invoiceDetail.purchasePrice === 0)) {
        vm.invoiceDetail.extendedReceivedPrice = multipleUnitValue(vm.invoiceDetail.receivedQty, vm.invoiceDetail.purchasePrice);
      } else if (vm.invoiceDetail && !vm.invoiceDetail.receivedQty && !vm.invoiceDetail.materialType && (vm.invoiceDetail.purchasePrice || vm.invoiceDetail.purchasePrice === 0)) {
        vm.invoiceDetail.extendedReceivedPrice = multipleUnitValue(1, vm.invoiceDetail.purchasePrice);
        vm.invoiceDetail.receivedQty = 1;
      } else if (vm.invoiceDetail) {
        vm.invoiceDetail.extendedReceivedPrice = 0;
      }
      setExtendedPriceforDisplay();
      if (vm.invoiceDetail && vm.invoiceDetail.invoicePrice !== 0 || vm.invoiceDetail.purchasePrice !== 0 || vm.invoiceDetail.discount !== 0) {
        vm.invoiceDetail.isZeroValue = false;
      }
      vm.calculateExtendedPriceDiffrence();
    };

    vm.InvoiceAndPOUnitPriceValidation = () => {

    };

    function calculateLineVariance() {
      const receivedAndDiscountPrice = CalcSumofArrayElement([(vm.invoiceDetail.extendedReceivedPrice || 0), vm.invoiceDetail.discount || 0], amountDecimal);
      return CalcSumofArrayElement([vm.invoiceDetail.extendedPrice || 0, ((receivedAndDiscountPrice || 0) * -1)], amountDecimal);
    }

    vm.calculateExtendedPriceDiffrence = (isDiscountChange) => {
      if (vm.invoiceDetail) {
        if (isDiscountChange) {
          if (vm.invoiceDetail.discount > 0) {
            vm.invoiceDetail.discount = (vm.invoiceDetail.discount * -1);
          }
          if (vm.invoiceDetail.discount) {
            vm.invoiceDetail.isZeroValue = false;
          }
        }
        vm.invoiceDetail.lineVariance = calculateLineVariance();
        vm.lineVariance = vm.invoiceDetail.lineVariance ? $filter('amount')(vm.invoiceDetail.lineVariance) : 0;

        vm.invoiceDetail.lineQtyVariance = CalcSumofArrayElement([vm.invoiceDetail.packingSlipQty || 0, (vm.invoiceDetail.receivedQty || 0) * -1], 0);
        vm.lineQtyVariance = vm.invoiceDetail.lineQtyVariance ? $filter('numberWithoutDecimal')(vm.invoiceDetail.lineQtyVariance) : 0;
      }
    };

    const getInvoiceLineDataByLineId = () => {
      vm.invoiceDetail.purchasePrice = (vm.invoiceDetail.purchasePrice || vm.invoiceDetail.purchasePrice === 0) ? vm.invoiceDetail.purchasePrice : null;
      vm.invoiceDetail.invoicePrice = (vm.invoiceDetail.invoicePrice || vm.invoiceDetail.invoicePrice === 0) ? vm.invoiceDetail.invoicePrice : null;
      vm.lineVariance = vm.invoiceDetail.lineVariance ? $filter('amount')(vm.invoiceDetail.lineVariance) : 0;
      vm.lineQtyVariance = vm.invoiceDetail.lineQtyVariance ? $filter('numberWithoutDecimal')(vm.invoiceDetail.lineQtyVariance) : 0;
      vm.invoiceDetail.extendedPrice = (vm.invoiceDetail.extendedPrice < 0) ? (vm.invoiceDetail.extendedPrice * -1) : vm.invoiceDetail.extendedPrice;
      vm.invoiceDetail.extendedReceivedPrice = (vm.invoiceDetail.extendedReceivedPrice < 0) ? (vm.invoiceDetail.extendedReceivedPrice * -1) : vm.invoiceDetail.extendedReceivedPrice;
      setExtendedPriceforDisplay(true);
      if (vm.isShowRMADetail) {
        vm.invoiceDetail.rmaIssueQty = parseInt(vm.invoiceDetail.parentDetailLinePackingSlipQty);
        vm.invoiceDetail.rmaIssueUnitPrice = parseFloat(vm.invoiceDetail.parentDetailLineInvoicePrice);
        vm.invoiceDetail.extendedRmaIsuePrice = parseFloat(vm.invoiceDetail.parentDetailLineExtendedPrice) < 0 ? (parseFloat(vm.invoiceDetail.parentDetailLineExtendedPrice) * -1) : vm.invoiceDetail.parentDetailLineExtendedPrice;
      }
      vm.invoiceDetail.fullMfgName = vm.invoiceDetail.mfgName;

      //if (vm.autoCompletecomponent) {
      //getComponentDetailsByMfg({
      //  id: vm.invoiceDetail.partID,
      //  mfgType: CORE.MFG_TYPE.MFG,
      //  isContainCPN: true
      //});
      //}

      /*if (vm.invoiceDetail.invoicePrice === 0 && vm.invoiceDetail.purchasePrice === 0 && vm.invoiceDetail.discount === 0 && vm.invoiceDetail.status === 'A') {
          vm.invoiceDetail.confirmingZero = true;
      } else {
          vm.invoiceDetail.confirmingZero = false;
      }*/
      if (vm.invoiceDetail.packingSlipSerialNumber > CORE.InvoiceOtherChargeStartNumber) {
        vm.invoiceDetail.materialType = false;
      } else {
        vm.invoiceDetail.materialType = true;
      }
      $timeout(() => {
        if (vm.autoCompleteMfgPIDCode) {
          $scope.$broadcast(vm.autoCompleteMfgPIDCode.inputName, vm.invoiceDetail.PIDCode);
        }
        if (vm.autoCompletecomponent) {
          $scope.$broadcast(vm.autoCompletecomponent.inputName, `(${vm.invoiceDetail.mfgCode}) ${vm.invoiceDetail.mfgPN}`);
        }

        if (vm.autoCompletecomponentOther) {
          vm.autoCompletecomponentOther.keyColumnId = vm.invoiceDetail.partID;
        }
        if (vm.autoCompleteMfgPIDCodeOther) {
          vm.autoCompleteMfgPIDCodeOther.keyColumnId = vm.invoiceDetail.partID;
        }
      });
    };

    vm.checkPackingLine = () => {
      if (vm.invoiceDetailForm.$dirty &&
        ((!vm.invoiceDetailCopy) ||
          (vm.invoiceDetail && vm.invoiceDetailCopy.packingSlipSerialNumber && vm.invoiceDetailCopy.packingSlipSerialNumber !== vm.invoiceDetail.packingSlipSerialNumber))) {
        const checkPackingLine = _.find(vm.sourceData, (data) => data.packingSlipSerialNumber === parseFloat(vm.invoiceDetail.packingSlipSerialNumber));
        if (checkPackingLine) {
          if ((vm.packingSlip.creditMemoType !== vm.creditMemoType[2].value && vm.packingSlip.creditMemoType !== vm.debitMemoType[1].value) || parseFloat(checkPackingLine.packingSlipSerialNumber) > CORE.InvoiceOtherChargeStartNumber) {
            vm.invoiceDetail = angular.copy(checkPackingLine);
            vm.invoiceDetailCopy = angular.copy(checkPackingLine);
            getInvoiceLineDataByLineId();
          } else {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MANUAL_MEMO_LINE_EXIST);
            messageContent.message = stringFormat(messageContent.message, vm.IsDebitMemoState ? 'Debit Memo' : 'Credit Memo');
            const obj = {
              messageContent: messageContent,
              btnText: TRANSACTION.PackingSlipSameLineConfirmationButton.EditLine,
              canbtnText: TRANSACTION.PackingSlipSameLineConfirmationButton.ChangeLine
            };
            return DialogFactory.messageConfirmDialog(obj).then((yes) => {
              if (yes) {
                vm.invoiceDetail = angular.copy(checkPackingLine);
                vm.invoiceDetailCopy = angular.copy(checkPackingLine);
                getInvoiceLineDataByLineId();
                setFocus('invoicePrice');
              }
            }, () => {
              vm.invoiceDetail.materialType = true;
              vm.invoiceDetail.packingSlipSerialNumber = null;
              setFocus('slipLine');
            }, (error) => BaseService.getErrorLog(error));
          }
        }
        //objOfLineItem = checkPackingLine;
        let messageContent;
        if (checkPackingLine && vm.packingSlip.status === vm.PackingSlipStatus.Paid) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.ALREADY_VERIFIED);
        }
        else if (checkPackingLine && checkPackingLine.refCreditDebitInvoiceNo) {
          vm.InvoiceDetailDisable = true;
          /*messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_ALLOW_UPDATE_INVOICE_FOR_MEMO_LINE);
          messageContent.message = stringFormat(messageContent.message, checkPackingLine.packingSlipSerialNumber);*/
        }
        else if (checkPackingLine && checkPackingLine.packingSlipSerialNumber > CORE.InvoiceOtherChargeStartNumber) {
          vm.invoiceDetail.materialType = false;
          vm.calculateExtendedPriceDiffrence();
          return;
        }
        else if (checkPackingLine && checkPackingLine.packingSlipSerialNumber < CORE.InvoiceOtherChargeStartNumber && !vm.isShowRMADetail) {
          vm.invoiceDetail.materialType = true;
          if (vm.IsCreditMemoState || vm.IsDebitMemoState) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_ALLOW_CHANGE_MEMO);
            messageContent.message = stringFormat(messageContent.message, vm.IsCreditMemoState ? 'Credit Memo' : 'Debit Memo');
          }
          else if (checkPackingLine.receivedStatus === TRANSACTION.PackingSlipReceivedStatus[0].value) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PS_RECEIVED_STATUS_NOT_ALLOW_INVOICE_DETAIL);
            messageContent.message = stringFormat(messageContent.message, checkPackingLine.packingSlipSerialNumber, TRANSACTION.PackingSlipReceivedStatus[0].key);
          }
          else {
            return;
          }
        }
        else if (!checkPackingLine) {
          if (vm.packingSlip.creditMemoType !== vm.creditMemoType[2].value && vm.packingSlip.creditMemoType !== vm.debitMemoType[1].value) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.LINE_ITEM_NOT_FOUND);
          }
        }

        if (messageContent) {
          const alertModel = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(alertModel).then((yes) => {
            if (yes) {
              vm.resetInvoiceDetail();
              return false;
            }
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          vm.calculateExtendedPrice();
        }
      }
    };

    vm.updatePackingDetail = () => {
      if (BaseService.focusRequiredField(vm.invoiceDetailForm)) {
        return;
      }
      if (vm.invoiceDetail && vm.invoiceDetail.packingSlipSerialNumber) {
        if ((parseFloat(vm.invoiceDetail.invoicePrice) === 0 && !vm.invoiceDetail.isZeroValue) && (parseFloat(vm.invoiceDetail.purchasePrice) === 0 && !vm.invoiceDetail.isZeroValue)) {
          let messageContent;
          let controlNameToFocus = '';
          if (!parseFloat(vm.invoiceDetail.invoicePrice)) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.UPDATE_INVOICE_PRICE);
            messageContent.message = stringFormat(messageContent.message, 'Invoice Unit Price');
            controlNameToFocus = 'invoicePrice';
          } else if (!parseFloat(vm.invoiceDetail.purchasePrice)) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.UPDATE_INVOICE_PRICE);
            messageContent.message = stringFormat(messageContent.message, 'PO Unit Price');
            controlNameToFocus = 'purchasePrice';
          }

          const alertModel = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(alertModel).then((yes) => {
            if (yes) {
              if (controlNameToFocus && controlNameToFocus !== '') {
                setFocus(controlNameToFocus);
              }
              return false;
            }
          }, () => {

          }).catch((error) => BaseService.getErrorLog(error));
          return;
        }
        else {
          //Bug 31785: When edit line# from manual Credit/Debit memo then it creates new entry instead of update same entry
          //const checkPackingLine = _.find(vm.gridOptions.data, (data) => data.packingSlipSerialNumber === parseInt(vm.invoiceDetail.packingSlipSerialNumber));
          const checkPackingLine = _.find(vm.gridOptions.data, (data) => data.id === parseInt(vm.invoiceDetail.id));
          const invoiceListData = {
            id: vm.invoiceDetail.id,
            isZeroValue: vm.invoiceDetail.isZeroValue
          };
          setExtendedPriceforDisplay(true);

          if (!checkPackingLine && vm.invoiceDetail.packingSlipSerialNumber > CORE.InvoiceOtherChargeStartNumber) {
            invoiceListData.refPackingSlipMaterialRecID = vm.packingSlipID;
            invoiceListData.packingSlipSerialNumber = parseInt(vm.invoiceDetail.packingSlipSerialNumber);
            invoiceListData.partID = vm.invoiceDetail.partID;
            invoiceListData.refSupplierPartId = vm.invoiceDetail.supplierMFGPNID;
            invoiceListData.receivedQty = vm.invoiceDetail.receivedQty = 1;
            invoiceListData.packingSlipQty = vm.invoiceDetail.packingSlipQty = 1;
            invoiceListData.invoicePrice = vm.invoiceDetail.invoicePrice;
            if (vm.packingSlip.creditMemoType !== vm.creditMemoType[2].value && vm.packingSlip.creditMemoType !== vm.debitMemoType[1].value) {
              invoiceListData.purchasePrice = vm.invoiceDetail.purchasePrice;
            } else {
              invoiceListData.purchasePrice = vm.invoiceDetail.purchasePrice = vm.invoiceDetail.invoicePrice;
            }
            invoiceListData.discount = vm.invoiceDetail.discount || 0;
            invoiceListData.comment = vm.invoiceDetail.comment;
            if (vm.IsDebitMemoState || vm.IsCreditMemoState) {
              invoiceListData.extendedPrice = vm.invoiceDetail.extendedPrice = multipleUnitValue(1, invoiceListData.invoicePrice) * -1;
              invoiceListData.extendedReceivedPrice = vm.invoiceDetail.extendedReceivedPrice = multipleUnitValue(1, invoiceListData.purchasePrice) * -1;
            } else {
              invoiceListData.extendedPrice = vm.invoiceDetail.extendedPrice = multipleUnitValue(invoiceListData.packingSlipQty, invoiceListData.invoicePrice);
              invoiceListData.extendedReceivedPrice = vm.invoiceDetail.extendedReceivedPrice = multipleUnitValue(invoiceListData.receivedQty, invoiceListData.purchasePrice);
            }
          }
          else if (!checkPackingLine && vm.invoiceDetail.packingSlipSerialNumber < CORE.InvoiceOtherChargeStartNumber) {
            invoiceListData.refPackingSlipMaterialRecID = vm.packingSlipID;
            invoiceListData.packingSlipSerialNumber = parseInt(vm.invoiceDetail.packingSlipSerialNumber);
            invoiceListData.partID = vm.invoiceDetail.partID;
            invoiceListData.refSupplierPartId = vm.invoiceDetail.supplierMFGPNID;
            invoiceListData.packingSlipQty = invoiceListData.receivedQty = vm.invoiceDetail.receivedQty = vm.invoiceDetail.packingSlipQty;
            invoiceListData.invoicePrice = invoiceListData.purchasePrice = vm.invoiceDetail.purchasePrice = vm.invoiceDetail.invoicePrice;
            invoiceListData.extendedPrice = vm.invoiceDetail.extendedPrice = multipleUnitValue(invoiceListData.packingSlipQty, invoiceListData.invoicePrice) * -1;
            invoiceListData.extendedReceivedPrice = vm.invoiceDetail.extendedReceivedPrice = multipleUnitValue(invoiceListData.receivedQty, invoiceListData.purchasePrice) * -1;
            invoiceListData.discount = vm.invoiceDetail.discount || 0;
            invoiceListData.comment = vm.invoiceDetail.comment;
          }
          else if (checkPackingLine && checkPackingLine.packingSlipSerialNumber > CORE.InvoiceOtherChargeStartNumber && vm.packingSlip.status === vm.PackingSlipStatus.Paid) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.ALREADY_VERIFIED);
            const obj = {
              messageContent: messageContent
            };
            DialogFactory.messageAlertDialog(obj).then((yes) => {
              if (yes) {
                vm.resetInvoiceDetail();
              }
            }, () => {
            }).catch((error) => BaseService.getErrorLog(error));
            return;
          }
          else {
            invoiceListData.refPackingSlipMaterialRecID = vm.packingSlipID;
            if (vm.IsCreditMemoState || vm.IsDebitMemoState) {
              invoiceListData.packingSlipSerialNumber = parseInt(vm.invoiceDetail.packingSlipSerialNumber);
            }
            invoiceListData.packingSlipQty = vm.invoiceDetail.packingSlipQty;
            invoiceListData.receivedQty = vm.invoiceDetail.receivedQty;
            invoiceListData.invoicePrice = vm.invoiceDetail.invoicePrice;
            invoiceListData.purchasePrice = vm.invoiceDetail.purchasePrice;
            invoiceListData.discount = vm.invoiceDetail.discount || 0;
            if (vm.isShowRMADetail) {
              invoiceListData.extendedPrice = vm.invoiceDetail.extendedPrice = multipleUnitValue(invoiceListData.packingSlipQty, invoiceListData.invoicePrice) * -1;
              invoiceListData.extendedReceivedPrice = vm.invoiceDetail.extendedReceivedPrice = multipleUnitValue(invoiceListData.receivedQty, invoiceListData.purchasePrice) * -1;
            } else if (vm.packingSlip.creditMemoType === vm.creditMemoType[2].value || vm.packingSlip.creditMemoType === vm.debitMemoType[1].value) {
              invoiceListData.packingSlipQty = vm.invoiceDetail.packingSlipQty;
              invoiceListData.receivedQty = vm.invoiceDetail.receivedQty = vm.invoiceDetail.packingSlipQty;
              invoiceListData.invoicePrice = vm.invoiceDetail.invoicePrice;
              invoiceListData.purchasePrice = vm.invoiceDetail.purchasePrice = vm.invoiceDetail.invoicePrice;
              invoiceListData.extendedPrice = vm.invoiceDetail.extendedPrice = multipleUnitValue(invoiceListData.packingSlipQty, invoiceListData.invoicePrice) * -1;
              invoiceListData.extendedReceivedPrice = vm.invoiceDetail.extendedReceivedPrice = multipleUnitValue(invoiceListData.receivedQty, invoiceListData.purchasePrice) * -1;
            } else {
              if (vm.IsDebitMemoState || vm.IsCreditMemoState) {
                invoiceListData.extendedPrice = vm.invoiceDetail.extendedPrice = multipleUnitValue(invoiceListData.packingSlipQty, invoiceListData.invoicePrice) * -1;
                invoiceListData.extendedReceivedPrice = vm.invoiceDetail.extendedReceivedPrice = multipleUnitValue(invoiceListData.receivedQty, invoiceListData.purchasePrice) * -1;
              } else {
                invoiceListData.extendedPrice = vm.invoiceDetail.extendedPrice = multipleUnitValue(invoiceListData.packingSlipQty, invoiceListData.invoicePrice);
                invoiceListData.extendedReceivedPrice = vm.invoiceDetail.extendedReceivedPrice = multipleUnitValue(invoiceListData.receivedQty, invoiceListData.purchasePrice);
              }
            }
            if (vm.invoiceDetail.packingSlipSerialNumber > CORE.InvoiceOtherChargeStartNumber) {
              invoiceListData.partID = vm.invoiceDetail.partID;
            }
            invoiceListData.comment = vm.invoiceDetail.comment;
          }

          if (vm.invoiceDetail.isZeroValue) {
            invoiceListData.status = 'A';
          } else if (!vm.isShowRMADetail && parseFloat(vm.invoiceDetail.purchasePrice) && parseFloat(vm.invoiceDetail.invoicePrice) && (calculateLineVariance() === 0)) {
            // as per discussion with Dixitbhai on 25-02-2021 required to update status as Approved if price variance is Zero, no need to check Qty variance as we are considered discount
            // (vm.invoiceDetail.purchasePrice === vm.invoiceDetail.invoicePrice && vm.invoiceDetail.receivedQty === vm.invoiceDetail.packingSlipQty)
            invoiceListData.status = 'A';
          } else if (vm.isShowRMADetail) {
            invoiceListData.status = vm.invoiceDetail.status;
          } else {
            invoiceListData.status = 'D';
          }

          if (vm.IsDebitMemoState) {
            invoiceListData.memoType = 'D';
          } else if (vm.IsCreditMemoState) {
            invoiceListData.memoType = 'C';
          } else {
            invoiceListData.memoType = 'I';
          }
          invoiceListData.isApproveFlow = false;
          vm.cgBusyLoading = PackingSlipFactory.saveInvoiceMaterial().query(invoiceListData).$promise.then((response) => {
            if (response && response.data && response.data.ErrorCode === 1) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.ALREADY_VERIFIED);
              const obj = {
                messageContent: messageContent
              };
              DialogFactory.messageAlertDialog(obj).then((yes) => {
                if (yes) {
                  vm.resetInvoiceDetail();
                  return false;
                }
              }, () => {
              }).catch((error) => BaseService.getErrorLog(error));
            } else if (response && response.data) {
              BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
              if (vm.packingSlip.creditMemoType !== vm.creditMemoType[2].value && vm.packingSlip.creditMemoType !== vm.debitMemoType[1].value) {
                const oldMaterialType = vm.invoiceDetail.materialType;
                vm.invoiceDetail = {
                  materialType: oldMaterialType,
                  isZeroValue: false,
                  status: vm.VerificationGridHeaderDropdown[2].dbValue
                };
                vm.packingSlip.isZeroValue = response.data.isZeroValueHeader;
              } else {
                const oldMaterialType = vm.invoiceDetail.materialType;
                vm.invoiceDetail = {
                  materialType: oldMaterialType
                };
              }
              $scope.$broadcast(vm.autoCompletecomponent ? vm.autoCompletecomponent.inputName : null, null);
              $scope.$broadcast(vm.autoCompleteMfgPIDCode ? vm.autoCompleteMfgPIDCode.inputName : null, null);
              if (vm.autoCompletecomponentOther) {
                vm.autoCompletecomponentOther.keyColumnId = null;
              }
              if (vm.autoCompleteMfgPIDCodeOther) {
                vm.autoCompleteMfgPIDCodeOther.keyColumnId = null;
              }
              vm.isScanLabel = false;
              vm.lineVariance = null;
              vm.lineQtyVariance = null;
              vm.recordUpdate = false;
              $timeout(() => {
                if (vm.packingSlip.creditMemoType !== vm.creditMemoType[2].value && vm.packingSlip.creditMemoType !== vm.debitMemoType[1].value) {
                  setFocus('slipLine');
                } else {
                  if (vm.invoiceDetail.materialType) {
                    setFocus('memoScanLabel');
                  } else {
                    setFocus('slipLine');
                  }
                }
                vm.invoiceDetailForm.$setPristine();
                vm.invoiceDetailForm.$setUntouched();
              }, true);
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
    };

    vm.scanDocument = () => {
      const scanDocumentDet = {
        id: vm.packingSlip.id,
        filePrefix: `${vm.packingSlip.mfgCode}-${vm.packingSlip.invoiceNumber}-${$filter('date')(new Date(), 'MMddyyyyhhmmss')}`,
        gencFileOwnerType: vm.documentEntityName,
        mfgCodeID: vm.packingSlip.mfgCodeID
      };

      DialogFactory.dialogService(
        CORE.PREVIEW_SCAN_DOCUMENT_MODAL_CONTROLLER,
        CORE.PREVIEW_SCAN_DOCUMENT_MODAL_VIEW,
        event,
        scanDocumentDet).then((response) => {
          if (response && response.saveDocument) {
            const counrPromise = [getDocumentCount(vm.packingSlip.refPackingSlipId, CORE.AllEntityIDS.PackingSlip.Name), getDocumentCount(vm.packingSlip.id, vm.documentEntityName)];
            vm.cgBusyLoading = $q.all(counrPromise).then((responsesCount) => {
              vm.packingSlipDocumentCount = responsesCount[0];
              vm.supplierInvoiceDocumentCount = responsesCount[1];
            }).catch((error) => BaseService.getErrorLog(error));
          }
          if (vm.IsPackingSlipDocumentTab || vm.IsSupplierInvoiceDocumentTab) {
            $rootScope.$emit('refreshDocuments', true);
          }
        }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.validationInvoiceTotalDue = () => {
      calculateAmountDifference();
    };

    vm.verifiedRecord = (row, ev, action) => {
      const data = row;
      data.packingSlipData = vm.packingSlip;
      data.poNumber = vm.packingSlip.poNumber;
      data.packingSlipId = vm.packingSlip.id;
      data.invoiceDate = vm.packingSlip.invoiceDate;
      data.action = action;
      DialogFactory.dialogService(
        TRANSACTION.VERIFICATION_PACKAGING_CONTROLLER,
        TRANSACTION.VERIFICATION_PACKAGING_VIEW,
        ev,
        data).then(() => {
        }, (verified) => {
          if (verified) {
            if (vm.IsInvoiceState) {
              vm.getCreditDebitMemoDet(vm.invoicePackingSlipId);
            }
            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
          } else {
            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.showVerificationAction = (row, ev) => {
      if (vm.invoiceDetailForm && vm.invoiceDetailForm.$dirty) {
        const obj = {
          messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SUPPLIER_INVOICE_LINE_DETAILS_RESET_CONFIRMTION,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.resetInvoiceDetail();
            vm.verifiedRecord(row, ev, 'AddMemo');
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        vm.resetInvoiceDetail();
        vm.verifiedRecord(row, ev, 'AddMemo');
      }
    };

    vm.reGetInvoiceDetail = () => {
      vm.cgBusyLoading = SupplierInvoiceFactory.reGetInvoiceDetail().query({ invoiceId: vm.copyPackingSlip.id, packingSlipId: vm.copyPackingSlip.refPackingSlipId }).$promise.then((response) => {
        if (response && response.data && response.data.IsSuccess) {
          vm.reGetInvoiceDetailDisable = true;
          vm.loadData();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.onConfirmingZeroChange = () => {
      if (vm.invoiceDetail && vm.invoiceDetail.isZeroValue) {
        vm.invoiceDetail.invoicePrice = 0;
        vm.invoiceDetail.purchasePrice = 0;
        vm.invoiceDetail.discount = 0;
        if (!vm.invoiceDetail.materialType) {
          vm.invoiceDetail.packingSlipQty = 1;
          vm.invoiceDetail.receivedQty = 1;
        }
      }
    };

    vm.goToGenericCategoryChargeTypeList = () => {
      BaseService.goToGenericCategoryChargeTypeList();
    };

    const onDocumentCount = $scope.$on('documentCount', (event, documentCount) => {
      if (vm.TabName === vm.packingSlipDocumentTabName) {
        vm.packingSlipDocumentCount = documentCount;
      } else if (vm.TabName === vm.supplierInvoiceDocumentTabName) {
        vm.supplierInvoiceDocumentCount = documentCount;
      }
    });

    vm.showCommentAndApproveNote = (object, ev, title) => {
      const obj = {
        title: title,
        description: title === 'Line Comment' ? object.comment : title === 'Approve Note' ? object.approveNote : null,
        name: object.packingSlipSerialNumber
      };
      const data = obj;
      data.label = 'Invoice Line#';
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        data).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.scanLabel = (e) => {
      $timeout(() => {
        scanLabel(e);
      }, true);
      /** Prevent enter key submit event */
      preventInputEnterKeyEvent(e);
    };

    const scanLabel = (e) => {
      if (e.keyCode === 13) {
        if (!vm.invoiceDetail.scanLabel) {
          return;
        }

        idOfSelectMultipleBarcode = null;

        const scanlabel = {
          regxpString: vm.invoiceDetail.scanLabel,
          category: CORE.BarcodeCategory.MFRPN,
          callFrom: vm.packingSlip.creditMemoType
        };

        scanLabelDetail(scanlabel);
      }
    };

    const scanLabelDetail = (scanlabel) => {
      vm.cgBusyLoading = PackingSlipFactory.scanPackingBarcode().save(scanlabel).$promise.then((res) => {
        vm.isScanLabel = true;
        if (res.data && res.data.Component) {
          if (res.data.Component.supplierMfgId && (vm.autoCompleteSupplier && vm.autoCompleteSupplier.keyColumnId) && res.data.Component.supplierMfgId !== vm.autoCompleteSupplier.keyColumnId) {
            vm.cgBusyLoading = false;
            const objSupplier = _.find(vm.supplierList, (data) => data.id === vm.autoCompleteSupplier.keyColumnId);
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MISMATCH_SUPPLIER);
            messageContent.message = stringFormat(messageContent.message, res.data.Component.supplierMFGPN, objSupplier ? objSupplier.mfgCodeName : '');
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            return DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                vm.resetInvoiceDetail();
                vm.isScanLabel = false;
                setFocus('memoScanLabel');
              }
            }, () => {
            }).catch((error) => BaseService.getErrorLog(error));
          }

          const objPart = res.data.Component;
          if (objPart && objPart.supplierMFGPNID) {
            vm.invoiceDetail.supplierMFGPNID = objPart.supplierMFGPNID;
            vm.invoiceDetail.supplierCode = objPart.supplierMFGCodeName;
            vm.invoiceDetail.supplierMfgCodeId = objPart.supplierMfgId;
            vm.invoiceDetail.supplierPN = objPart.supplierMFGPN;
            vm.invoiceDetail.supplierIsCustom = objPart.isCustom;
            vm.invoiceDetail.supplierRohsName = objPart.supplierRohsName;
            vm.invoiceDetail.supplierRohsIcon = objPart.supplierRohsIcon;
          }
          else {
            vm.invoiceDetail.supplierMFGPNID = null;
            vm.invoiceDetail.supplierCode = null;
            vm.invoiceDetail.supplierMfgCodeId = null;
            vm.invoiceDetail.supplierPN = null;
            vm.invoiceDetail.supplierIsCustom = null;
            vm.invoiceDetail.supplierRohsName = null;
            vm.invoiceDetail.supplierRohsIcon = null;
          }

          getComponentDetailsByMfg({
            id: objPart.id,
            mfgType: CORE.MFG_TYPE.MFG,
            mfgcodeID: objPart.mfgcodeID,
            isContainCPN: true
          });
          initMFRAutoComplete();
          setFocus('slipLine');
        } else {
          vm.isScanLabel = false;
          if (res.data && (res.data.messagecode === '0' || res.data.messagecode === '4')) {
            const obj = {
              title: USER.USER_INFORMATION_LABEL,
              textContent: res.data.Datamessage,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_ADDRECORD_TEXT,
              canbtnText: ''
            };
            if (res.data.messagecode && res.data.messagecode === '0') {
              obj.canbtnText = CORE.MESSAGE_CONSTANT.BUTTON_SKIP_TEXT;
            } else {
              obj.canbtnText = CORE.MESSAGE_CONSTANT.BUTTON_SKIP_PART_TEXT;
            }
            DialogFactory.confirmDiolog(obj).then((item) => {
              if (item) {
                if (res.data && res.data.messagecode === '0') {
                  BaseService.openInNew(USER.ADMIN_MANAGE_BARCODE_LABEL_TEMPLATE_STATE);
                } else {
                  addNewComponent(res.data.MFGPart);
                }
              }
            }, () => {
              vm.invoiceDetail.scanLabel = null;
              setFocus('memoScanLabel');
            }).catch((error) => BaseService.getErrorLog(error));
          }
          else if (res.data && res.data.messagecode === '5') {
            selectPartPopup(res.data.MFGPart);
          }
          else if (['6', '8', '11', '12', '16'].indexOf(res.data.messagecode) !== -1) {
            vm.cgBusyLoading = false;
            const model = {
              title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
              textContent: res.data.messagecode === '11' ? stringFormat(res.data.Datamessage, 'receive') : res.data.Datamessage,
              multiple: true
            };
            return DialogFactory.alertDialog(model).then((yes) => {
              if (yes && res.data.messagecode === '8') {
                BaseService.openInNew(USER.ADMIN_MANAGE_BARCODE_LABEL_TEMPLATE_STATE, {
                  id: res.data.MFGPart
                });
              } else {
                vm.invoiceDetail.scanLabel = null;
                setFocus('memoScanLabel');
              }
            }, () => {
            }).catch((error) => BaseService.getErrorLog(error));
          }
          else if (res.data.messagecode === '9') {
            selectBarcodePopup(res.data.MFGPart);
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const addNewComponent = (MFGPart) => {
      const event = angular.element.Event('click');
      angular.element('body').trigger(event);
      const data = {
        Name: MFGPart,
        mfgType: CORE.MFG_TYPE.MFG,
        category: CORE.PartCategory.Component
      };
      DialogFactory.dialogService(
        CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        CORE.MANAGE_COMPONENT_MODAL_VIEW,
        event,
        data).then(() => { }, () => { }, (error) => BaseService.getErrorLog(error));
    };

    const selectPartPopup = (mfgPart) => {
      const data = {
        mfgPart: mfgPart,
        supplierName: vm.packingSlip.mfgFullName
      };
      DialogFactory.dialogService(
        TRANSACTION.SELECT_PART_MODAL_CONTROLLER,
        TRANSACTION.SELECT_PART_MODAL_VIEW,
        event,
        data).then(() => { }, (selectItem) => {
          if (selectItem) {
            popUpForMultipleListed(selectItem, 'MultiplePart');
            setFocus('rmaSerialNumber');
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    const selectBarcodePopup = (mfgPart) => {
      const data = mfgPart;
      DialogFactory.dialogService(
        TRANSACTION.SELECT_BARCODE_MODAL_CONTROLLER,
        TRANSACTION.SELECT_BARCODE_MODAL_VIEW,
        event,
        data).then(() => { }, (selectItem) => {
          if (selectItem) {
            idOfSelectMultipleBarcode = selectItem.id;
            popUpForMultipleListed(selectItem, 'MultipleBarcode');
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    const popUpForMultipleListed = (selectItem, selectType) => {
      if (selectItem) {
        const scanlabel = {
          regxpString: vm.invoiceDetail.scanLabel,
          mfgId: selectType === 'MultiplePart' && selectItem ? selectItem.id : 0,
          barcodeId: selectType === 'MultipleBarcode' && selectItem ? selectItem.id : idOfSelectMultipleBarcode ? idOfSelectMultipleBarcode : null,
          category: CORE.BarcodeCategory.MFRPN,
          callFrom: vm.packingSlip.creditMemoType
        };
        scanLabelDetail(scanlabel);
      }
    };

    const getComponentDetailsByMfg = (searchObj) => ComponentFactory.getComponentMFGAliasSearch().query({ listObj: searchObj }).$promise.then((component) => {
      _.each(component.data.data, (comp) => {
        comp.ismfgpn = true;
      });
      if (searchObj.id || searchObj.id === 0) {
        $timeout(() => {
          if (vm.autoCompletecomponent) {
            $scope.$broadcast(vm.autoCompletecomponent.inputName, component.data.data[0]);
          }
          if (vm.autoCompleteMfgPIDCode) {
            $scope.$broadcast(vm.autoCompleteMfgPIDCode.inputName, component.data.data[0]);
          }
          if (vm.autoCompletecomponentOther) {
            vm.autoCompletecomponentOther.keyColumnId = component.data.data[0].id;
          }
          if (vm.autoCompleteMfgPIDCodeOther) {
            vm.autoCompleteMfgPIDCodeOther.keyColumnId = component.data.data[0].id;
          }
        });
      }
      return component.data.data;
    }).catch((error) => BaseService.getErrorLog(error));

    vm.onChangeMarkedForRefund = () => {
      if (vm.packingSlip.markedForRefund) {
        vm.packingSlip.markedForRefundAmt = vm.balanceToPayAmount;
        setHeaderInformation();
      } else {
        if (vm.packingSlip.markedForRefundAmt) {
          const obj = {
            messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SUPPLIER_REFUND_AMOUNT_REMOVE_CONFIRMATION,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              vm.packingSlip.markedForRefundAmt = null;
              setHeaderInformation();
            }
          }, () => {
            vm.packingSlip.markedForRefund = true;
            setHeaderInformation();
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
    };

    vm.checkRefundAmount = () => {
      if (vm.packingSlip.markedForRefundAmt > vm.balanceToPayAmount) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.REFUND_AMOUNT_SHOULD_NOT_GRATER_THAN_BALANCE_TO_PAY_AMOUNT);
        messageContent.message = stringFormat(messageContent.message, vm.balanceToPayAmount);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        return DialogFactory.messageAlertDialog(model).then(() => {
          vm.packingSlip.markedForRefundAmt = null;
          $scope.$parent.vm.supplierInvoiceEditObj.markedForRefundAmt = null;
          setFocus('markedForRefundAmt');
        });
      }
      $scope.$parent.vm.supplierInvoiceEditObj.markedForRefundAmt = vm.packingSlip.markedForRefundAmt;
    };

    vm.showPaymentTransactions = (event) => {
      const objData = {
        id: vm.packingSlipID,
        refPaymentMode: 'RR',
        openFrom: 'RMA',
        mfgCodeID: vm.packingSlip.mfgCodeID,
        supplierCode: vm.packingSlip.mfgFullName,
        markedForRefundAmt: vm.packingSlip.markedForRefundAmt || 0,
        refundAmount: vm.totalRefundedAmount || 0,
        waitingForRefundAmount: vm.getWaitingForRefundAmount() || 0
      };
      DialogFactory.dialogService(
        TRANSACTION.SUPPLIER_INVOICE_PAYMENT_TRANSACTION_LIST_POPUP_CONTROLLER,
        TRANSACTION.SUPPLIER_INVOICE_PAYMENT_TRANSACTION_LIST_POPUP_VIEW,
        event,
        objData
      ).then(() => {
      }, () => {
      }, (err) => BaseService.getErrorLog(err));
    };

    vm.getWaitingForRefundAmount = () => {
      var totalRefundAmount = CalcSumofArrayElement([vm.packingSlip.markedForRefundAmt, (vm.totalRefundedAmount * (-1))], amountDecimal);
      //$scope.$parent.vm.supplierInvoiceEditObj.waitingForRefundAmount = totalRefundAmount || 0;
      return totalRefundAmount || 0;
    };

    vm.goToSupplierRMAList = () => {
      BaseService.goToSupplierRMAList();
    };

    vm.goToPackingSlipList = () => {
      BaseService.goToPackingSlipList();
    };

    vm.goToPurchaseOrderList = () => {
      BaseService.goToPurchaseOrderList();
    };

    vm.goToSalesOrderList = () => {
      BaseService.goToSalesOrderList();
    };

    vm.goToSupplierInvoiceDetail = (row) => {
      if (row) {
        BaseService.goToSupplierInvoiceDetail(TRANSACTION.SupplierInvoiceType.Detail, row.refInvoiceIdForMemo);
      }
    };

    vm.goToSupplierInvoiceList = () => {
      BaseService.goToSupplierInvoiceList();
    };

    vm.goToCreditMemoList = () => {
      BaseService.goToCreditMemoList();
    };

    vm.goToDebitMemoList = () => {
      BaseService.goToDebitMemoList();
    };

    vm.goToMFGList = () => {
      BaseService.openInNew(USER.ADMIN_MANUFACTURER_STATE, {});
    };

    vm.goToManufacturerDetail = (id) => {
      BaseService.goToManufacturer(id);
    };

    vm.goToMFGPartList = () => {
      BaseService.openInNew(USER.ADMIN_MFG_COMPONENT_STATE, {});
    };

    //Catch socket calls
    const connectSocket = () => {
      socketConnectionService.on(CORE.Socket_IO_Events.PackingSlipSupplierInvoiceChanges.reGetOnChnagesOfPackingSlipLine, reGetOnChnagesOfPackingSlipLineListener);
    };
    connectSocket();

    socketConnectionService.on('reconnect', () => {
      connectSocket();
    });
    const removeSocketListener = () => {
      socketConnectionService.removeListener(CORE.Socket_IO_Events.PackingSlipSupplierInvoiceChanges.reGetOnChnagesOfPackingSlipLine);
    };

    $scope.$on('$destroy', () => {
      removeSocketListener();
      watchSupplierInvoiceForm();
      watchmiscForm();
      onCallSaveInvoice();
      onGoBackToInvoiceList();
      onDocumentCount();
    });

    // on disconnect socket
    socketConnectionService.on('disconnect', () => {
      removeSocketListener();
    });
  }
})();
