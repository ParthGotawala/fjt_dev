(function () {
    'use strict';

    angular
        .module('app.transaction.packingSlip')
        .controller('VerificationPackagingSlipController', VerificationPackagingSlipController);

    function VerificationPackagingSlipController($mdDialog, $timeout, $filter, DialogFactory, CORE, BaseService, data, USER, TRANSACTION, RFQTRANSACTION, PackingSlipFactory, SupplierInvoiceFactory, CustomerFactory) {
        const vm = this;
        vm.CORE = CORE;
        vm.Transaction = TRANSACTION;
        vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
        vm.CORE_CREDIT_DEBIT_MEMO_PRICE_ISSUE_CALCULATION_TOOLTIP = CORE.CREDIT_DEBIT_MEMO_PRICE_ISSUE_CALCULATION_TOOLTIP;
        vm.verification = angular.copy(data);
        vm.verification.orgInvoiceDate = angular.copy(vm.verification.invoiceDate);
        vm.verification.approveNote = null;
        vm.verification.refCreditDebitInvoiceNo = null;
        vm.verification.diffrence = null;
        vm.copyVerification = angular.copy(vm.verification);
        vm.packingSlipData = vm.verification.packingSlipData;
        vm.DefaultDateFormat = _dateDisplayFormat;
        vm.saveBtnDisableFlag = false;
        vm.loginUser = BaseService.loginUser;
        //vm.verification.invoicePrice = vm.verification.invoicePrice;
        //vm.verification.purchasePrice = vm.verification.purchasePrice;
        vm.verification.totalCalculateAmount = 0;
        vm.verification.createNew = true;
        vm.HaltResumePopUp = CORE.HaltResumePopUp;

        vm.invoiceLineId = vm.verification.id;
        vm.action = vm.verification.action;
        vm.orgInvoiceDate = angular.copy(vm.verification.invoiceDate);
        vm.packingSlipId = vm.verification.packingSlipId;
        vm.poNumber = vm.verification.poNumber;

        vm.memoList = [];
        vm.totalMemoAmount = 0;
        vm.remainMemoAmount = 0;
        vm.companyConfig = false;
        vm.rohsIcon = stringFormat('{0}{1}{2}', _configWebUrl, USER.ROHS_BASE_PATH, vm.verification.rohsIcon);
        vm.isCreditMemoDisabled = false;
        vm.isDebitMemoDisabled = false;
        vm.oldMemoObj;
        vm.RadioGroup = {
            memo: {
                array: CORE.memoRadioGroup
            }
        };
        vm.DefaultDateFormat = _dateDisplayFormat;
        const currentDate = new Date($filter('date')(new Date(), vm.DefaultDateFormat));
        vm.invoiceDateOptions = {
            appendToBody: true,
            maxDate: currentDate,
            minDate: vm.orgInvoiceDate
        };
        vm.DATE_PICKER = CORE.DATE_PICKER;
        vm.IsPickerOpen = {
            [vm.DATE_PICKER.invoiceDate]: false
        };
        vm.isMemoForPrice = angular.copy(vm.verification.isMemoForPrice === 1 ? true : false);
        vm.isMemoForQty = angular.copy(vm.verification.isMemoForQty === 1 ? true : false);
        vm.verification.totalAmount = 0;

        vm.getMaxDateValidation = (FromDate, ToDate) => BaseService.getMaxDateValidation(FromDate, ToDate);

        let isGetMergeLineConfirmation = false;

        vm.cgBusyLoading = SupplierInvoiceFactory.companyConfigurationCheck().query({}).$promise.then((response) => {
            if (response && response.data) {
                vm.companyConfig = true;
            }
        }).catch((error) => BaseService.getErrorLog(error));

        const getInvoiceNumber = (isCallFromMemoRadioButton) => PackingSlipFactory.getAllPackingInvoiceByReceiptTypeList().query({ id: vm.packingSlipId, type: vm.verification.receiptType ? 'C' : 'D' }).$promise.then((response) => {
            if (response && response.data) {
                vm.invoiceNumberList = response.data;
                vm.autoCompleteInvoice = null;
                if (isCallFromMemoRadioButton) {
                    //if (Array.isArray(vm.invoiceNumberList) && vm.invoiceNumberList.length > 0) {
                    //  vm.verification.createNew = true;
                    //  $timeout(() => {
                    //    autocompleteInvoice(vm.invoiceNumberList[0].id);
                    //  });
                    //}
                    //else {
                    //  vm.verification.createNew = true;
                    //  vm.verification.invoiceDate = null;
                    //  $timeout(() => {
                    //    autocompleteInvoice(null);
                    //  });
                    //}
                    vm.verification.createNew = true;
                    vm.verification.invoiceDate = null;
                } else {
                    $timeout(() => {
                        autocompleteInvoice(null);
                    });
                }
            }
        }).catch((error) => BaseService.getErrorLog(error));

        const getOldMemoDetailsById = (id) => {
            vm.cgBusyLoading = SupplierInvoiceFactory.getOldMemoDetailsById().query({ id: id, type: vm.verification.receiptType ? 'C' : 'D' }).$promise.then((response) => {
                if (response && response.data) {
                    const oldMemoObj = response.data;
                    _.map(oldMemoObj.packingSlipMaterialReceiveDet, (data) => {
                        data.packingSlipId = oldMemoObj.id;
                        data.poNumber = oldMemoObj.poNumber;
                        data.supplierSONumber = oldMemoObj.supplierSONumber;
                        data.packingSlipNumber = oldMemoObj.packingSlipNumber;
                        data.packingSlipDate = oldMemoObj.packingSlipDate;
                        data.creditMemoNumber = oldMemoObj.creditMemoNumber;
                        data.creditMemoDate = oldMemoObj.creditMemoDate;
                        data.debitMemoNumber = oldMemoObj.debitMemoNumber;
                        data.debitMemoDate = oldMemoObj.debitMemoDate;
                        data.receiptType = oldMemoObj.receiptType;
                        if (data.receiptType === 'C') {
                            data.displaMemoType = TRANSACTION.InvoiceMemoType.CreditMemo;
                        } else if (data.receiptType === 'D') {
                            data.displaMemoType = TRANSACTION.InvoiceMemoType.DebitMemo;
                        }
                        data.memoNumber = data.packingSlipNumber;
                        data.memoDate = data.packingSlipDate ? BaseService.getUIFormatedDate(data.packingSlipDate, vm.DefaultDateFormat) : '';
                    });
                    vm.oldMemoObj = oldMemoObj.packingSlipMaterialReceiveDet;
                }
            }).catch((error) => BaseService.getErrorLog(error));
        };

        const autocompleteInvoice = (selectedID) => {
            vm.autoCompleteInvoice = {
                columnName: vm.verification.receiptType ? 'creditMemoNumber' : 'debitMemoNumber',
                keyColumnName: 'id',
                keyColumnId: selectedID,
                inputName: vm.verification.receiptType ? 'Credit Memo#' : 'Debit Memo#',
                placeholderName: vm.verification.receiptType ? 'Credit Memo#' : 'Debit Memo#',
                isRequired: (vm.verification.receiptType === true || vm.verification.receiptType === false) && !vm.verification.createNew ? true : false,
                isAddnew: false,
                callbackFn: getInvoiceNumber,
                onSelectCallback: getInvoiceNumber,
                onSelectCallbackFn: function (item) {
                    if (item) {
                        vm.verification.invoiceDate = vm.verification.receiptType ? BaseService.getUIFormatedDate(item.creditMemoDate, vm.DefaultDateFormat) : BaseService.getUIFormatedDate(item.debitMemoDate, vm.DefaultDateFormat);
                        vm.verification.detailLineNo = _.maxBy(_.map(item.packingSlipMaterialReceiveDet, (data) => data.lineNo = parseFloat(data.packingSlipSerialNumber || 0)), (item) => item);
                        getOldMemoDetailsById(item.id);
                    } else {
                        vm.oldMemoObj = null;
                        vm.verification.invoiceDate = null;
                        vm.verification.invoiceNumber = null;
                    }
                }
            };
        };
        vm.goToInvoiceList = () => {
            BaseService.goToSupplierInvoiceList();
        };
        vm.goToInvoiceDetail = () => {
            BaseService.goToSupplierInvoiceDetail(null, vm.packingSlipData.invoiceId);
        };

        vm.goToAssemblyList = () => {
            BaseService.goToPartList();
            return false;
        };

        vm.goToAssemblyDetails = (data) => {
            BaseService.goToComponentDetailTab(null, data.partID);
            return false;
        };

        vm.goToSupplier = () => {
            BaseService.openInNew(USER.ADMIN_SUPPLIER_STATE, {});
        };

        vm.goSupplierDetails = (data) => {
            BaseService.goToSupplierDetail(data.id);
            return false;
        };

        vm.headerdata = [
            {
                label: 'Packing Slip Line#',
                value: vm.verification.packingSlipSerialNumber,
                displayOrder: 1
            },
            {
                label: 'Invoice#',
                value: vm.packingSlipData.invoiceNumber,
                displayOrder: 2,
                labelLinkFn: vm.packingSlipData.invoiceId ? vm.goToInvoiceList : null,
                valueLinkFn: vm.packingSlipData.invoiceId ? vm.goToInvoiceDetail : null
            },
            {
                label: 'Invoice Date',
                value: vm.packingSlipData.invoiceDate,
                displayOrder: 3
            },
            {
                label: 'PO#',
                value: vm.poNumber,
                displayOrder: 4
            },
            {
                label: vm.CORE.LabelConstant.MFG.Supplier,
                value: vm.packingSlipData.mfgFullName,
                displayOrder: 5,
                labelLinkFn: vm.goToSupplier,
                valueLinkFn: vm.goSupplierDetails,
                valueLinkFnParams: { id: vm.packingSlipData.mfgCodeID }
            },
            {
                label: vm.CORE.LabelConstant.MFG.MFGPN,
                value: vm.verification.mfgPN,
                displayOrder: 6,
                labelLinkFn: vm.goToAssemblyList,
                valueLinkFn: vm.goToAssemblyDetails,
                valueLinkFnParams: { partID: vm.verification.partID },
                isCopy: true,
                isCopyAheadLabel: false,
                isAssy: true,
                imgParms: {
                    imgPath: vm.rohsIcon,
                    imgDetail: vm.verification.rohsName
                }
            },
            {
                label: 'Received Qty',
                value: vm.verification.receivedQty,
                displayOrder: 7
            }
        ];

        vm.searchToDigikey = () => {
            BaseService.openURLInNew(RFQTRANSACTION.API_LINKS.DIGIKEY + vm.verification.mfgPN);
        };

        vm.changeCreateNew = () => {
            vm.oldMemoObj = null;
            if (vm.verification.createNew) {
                vm.autoCompleteInvoice.keyColumnId = null;
                vm.verification.invoiceDate = null;
            } else {
                getInvoiceNumber(false);
            }
        };

        vm.saveMemo = (isClosePopUp) => {
            vm.saveBtnDisableFlag = true;
            if (BaseService.focusRequiredField(vm.formVarificationPackaging)) {
                vm.saveBtnDisableFlag = false;
                return;
            }

            if (vm.verification && vm.verification.totalAmount === 0 && (vm.verification.receiptType === true || vm.verification.receiptType === false)) {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_CREATE_MEMO_ZERO_AMOUNT);
                messageContent.message = stringFormat(messageContent.message, vm.verification.receiptType ? 'Credit Memo' : 'Debit Memo');
                const obj = {
                    messageContent: messageContent,
                    multiple: true
                };
                return DialogFactory.messageAlertDialog(obj).then((yes) => {
                    if (yes) {
                        vm.saveBtnDisableFlag = false;
                    }
                }, () => {
                }).catch((error) => {
                    vm.saveBtnDisableFlag = false;
                    return BaseService.getErrorLog(error);
                });
            }

            /*debit memo number generation method moved to approvePackingSlipMaterialMemo() API*/
            /*if (vm.verification.receiptType === false) {
              vm.cgBusyLoading = SupplierInvoiceFactory.generateDabitMemoNumber().query({}).$promise.then((res) => {
                if (res && res.data) {
                  vm.verification.invoiceNumber = res.data;
                  vm.verify(isClosePopUp);
                } else {
                  vm.saveBtnDisableFlag = false;
                }
              }).catch((error) => {
                vm.saveBtnDisableFlag = false;
                return BaseService.getErrorLog(error);
              });
            } else {*/
            vm.verify(isClosePopUp);
            /*}*/
        };

        vm.companyConfigDialog = function () {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.COMPANY_CONFIGURATION_SET);
            const model = {
                messageContent: messageContent,
                multiple: true
            };
            DialogFactory.messageAlertDialog(model).then(() => {
                vm.saveBtnDisableFlag = false;
            }).catch((error) => {
                vm.saveBtnDisableFlag = false;
                return BaseService.getErrorLog(error);
            });
        };

        vm.verify = (isClosePopUp) => {
            if (vm.verification.receiptType === true || vm.verification.receiptType === false) {
                const convertApiInvoiceDate = vm.verification.invoiceDate ? (BaseService.getAPIFormatedDate(vm.verification.invoiceDate)) : null;
                vm.verification.invoiceDate = convertApiInvoiceDate;

                const checkStatusAmount = CalcSumofArrayElement([(vm.verification.totalAmount || 0), (vm.totalMemoAmount || 0)], _amountFilterDecimal);

                const verifyData = {
                    poNumber: vm.packingSlipData.poNumber,
                    mfgCodeID: vm.packingSlipData.mfgCodeID,
                    paymentTermsID: vm.packingSlipData.paymentTermsID,
                    termsDays: vm.packingSlipData.termsDays,
                    supplierSONumber: vm.packingSlipData.supplierSONumber,
                    packingSlipNumber: vm.packingSlipData.packingSlipNumber,
                    packingSlipDate: vm.packingSlipData ? (BaseService.getAPIFormatedDate(vm.packingSlipData.packingSlipDate)) : null,
                    refPurchaseOrderID: vm.packingSlipData.refPurchaseOrderID,

                    poDate: vm.verification.poDate ? vm.verification.poDate : null,
                    soDate: vm.verification.soDate ? vm.verification.soDate : null,

                    creditMemoNumber: vm.verification.receiptType ? vm.verification.invoiceNumber : null,
                    creditMemoDate: vm.verification.receiptType ? vm.verification.invoiceDate : null,
                    debitMemoNumber: vm.verification.receiptType ? null : vm.verification.invoiceNumber,
                    debitMemoDate: vm.verification.receiptType ? null : vm.verification.invoiceDate,
                    refSupplierCreditMemoNumber: vm.verification.receiptType ? null : vm.verification.refSupplierCreditMemoNumber,

                    applyDate: vm.verification.invoiceDate,

                    receiptType: vm.verification.receiptType ? 'C' : 'D',
                    status: 'A',
                    creditMemoType: vm.verification.receiptType ? TRANSACTION.creditMemoType[0].value : TRANSACTION.debitMemoType[0].value,
                    refParentCreditDebitInvoiceno: vm.packingSlipId,

                    billToAddressID: vm.defaultBillingAddressId,
                    billToAddress: vm.defaultBillingAddressText,
                    billToContactPersonID: vm.defaultBillingContactPersonId,
                    billToConactPerson: vm.defaultBillingContactPersonText,
                    currentDetail: {
                        id: vm.verification.id,
                        status: checkStatusAmount === vm.verification.totalCalculateAmount ? 'A' : 'D',
                        purchasePrice: vm.verification.purchasePrice,
                        invoicePrice: vm.verification.invoicePrice,
                        difference: vm.verification.diffrence,
                        differenceQty: vm.verification.differenceQty,
                        isMemoForPrice: vm.isMemoForPrice,
                        isMemoForQty: vm.isMemoForQty,
                        //approveNote: vm.verification.approveNote,
                        //extendedPrice: vm.verification.totalAmount * -1,
                        //extendedReceivedPrice: vm.verification.totalAmount * -1,
                        refPackingSlipMaterialRecID: vm.verification.createNew ? vm.packingSlipData.id : vm.autoCompleteInvoice.keyColumnId,
                        isGetMergeLineConfirmation: isGetMergeLineConfirmation
                    },
                    newDetail: {
                        refPackingSlipMaterialRecID: vm.verification.createNew ? vm.packingSlipData.id : vm.autoCompleteInvoice.keyColumnId,
                        nickname: vm.copyVerification.nickname,
                        partID: vm.copyVerification.partID,
                        refSupplierPartID: vm.copyVerification.refSupplierPartID,
                        approveNote: vm.verification.approveNote,
                        status: 'A',
                        refPackingSlipDetId: vm.verification.id,
                        packagingID: vm.copyVerification.packagingID,
                        isMemoForPrice: vm.isMemoForPrice && !vm.verification.isMemoForPrice ? true : false,
                        isMemoForQty: vm.isMemoForQty && !vm.verification.isMemoForQty ? true : false,
                        discount: vm.verification.discount || 0
                    },
                    newDetailForPrice: {},
                    newDetailForQty: {}
                    //newDetail: vm.copyVerification
                };

                if (verifyData.newDetail.isMemoForPrice) {
                    if (vm.copyVerification.packingSlipQty > vm.copyVerification.receivedQty) {
                        verifyData.newDetailForPrice.receivedQty = vm.copyVerification.receivedQty;
                        verifyData.newDetailForPrice.packingSlipQty = vm.copyVerification.receivedQty;
                    } else {
                        verifyData.newDetailForPrice.receivedQty = vm.copyVerification.packingSlipQty;
                        verifyData.newDetailForPrice.packingSlipQty = vm.copyVerification.packingSlipQty;
                    }
                    verifyData.newDetailForPrice.invoicePrice = vm.verification.diffrence;
                    verifyData.newDetailForPrice.purchasePrice = vm.verification.diffrence;
                    verifyData.newDetailForPrice.extendedPrice = (multipleUnitValue(verifyData.newDetailForPrice.packingSlipQty, verifyData.newDetailForPrice.invoicePrice) * -1);
                    verifyData.newDetailForPrice.extendedReceivedPrice = (multipleUnitValue(verifyData.newDetailForPrice.receivedQty, verifyData.newDetailForPrice.purchasePrice) * -1);
                    verifyData.newDetailForPrice.isMemoForPrice = true;
                }

                if (verifyData.newDetail.isMemoForQty) {
                    verifyData.newDetailForQty.receivedQty = vm.verification.differenceQty;
                    verifyData.newDetailForQty.packingSlipQty = vm.verification.differenceQty;
                    verifyData.newDetailForQty.invoicePrice = vm.verification.invoicePrice;
                    verifyData.newDetailForQty.purchasePrice = vm.verification.invoicePrice;
                    verifyData.newDetailForQty.extendedPrice = (multipleUnitValue(verifyData.newDetailForQty.packingSlipQty, verifyData.newDetailForQty.invoicePrice) * -1);
                    verifyData.newDetailForQty.extendedReceivedPrice = (multipleUnitValue(verifyData.newDetailForQty.receivedQty, verifyData.newDetailForQty.purchasePrice) * -1);
                    verifyData.newDetailForQty.isMemoForQty = true;
                }

                //verifyData.newDetail.status = 'A';
                //verifyData.newDetail.refPackingSlipDetId = vm.verification.id;
                //verifyData.newDetail.diffrence = null;
                if (vm.verification.createNew) {
                    if (vm.companyConfig) {
                        if (verifyData.newDetail.isMemoForPrice && verifyData.newDetail.isMemoForQty) {
                            verifyData.invoiceTotalDue = ((CalcSumofArrayElement([verifyData.newDetailForPrice.extendedPrice || 0, verifyData.newDetailForQty.extendedPrice], _amountFilterDecimal)) * -1);
                        } else if (verifyData.newDetail.isMemoForPrice) {
                            verifyData.invoiceTotalDue = ((verifyData.newDetailForPrice.extendedPrice || 0) * -1);
                        } else if (verifyData.newDetail.isMemoForQty) {
                            verifyData.invoiceTotalDue = ((verifyData.newDetailForQty.extendedPrice || 0) * -1);
                        }

                        vm.cgBusyLoading = PackingSlipFactory.approvePackingSlipMaterialMemo().query(verifyData).$promise.then((response) => {
                            if (response.data) {
                                vm.saveBtnDisableFlag = false;
                                if (vm.verification.receiptType === true) {
                                    vm.formVarificationPackaging.$setPristine();
                                    vm.formVarificationPackaging.$setUntouched();
                                    BaseService.currentPagePopupForm = [];
                                    if (isClosePopUp) {
                                        $mdDialog.cancel(true);
                                    }
                                    else {
                                        vm.clearDataAfterAddMemo();
                                        vm.getPackingSlipLineDetailByID();
                                    }
                                }
                                else {
                                    const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SHOW_DEBIT_MEMO_NUMBER);
                                    messageContent.message = stringFormat(messageContent.message, (response.data.debitMemoNumber || ''));
                                    const obj = {
                                        messageContent: messageContent,
                                        multiple: true
                                    };
                                    DialogFactory.messageAlertDialog(obj).then((yes) => {
                                        if (yes) {
                                            vm.formVarificationPackaging.$setPristine();
                                            vm.formVarificationPackaging.$setUntouched();
                                            BaseService.currentPagePopupForm = [];
                                            if (isClosePopUp) {
                                                $mdDialog.cancel(true);
                                            } else {
                                                vm.clearDataAfterAddMemo();
                                                vm.getPackingSlipLineDetailByID();
                                                vm.verification.approveNote = null;
                                                $timeout(() => {
                                                    active(true);
                                                    vm.validationPaymentAmount();
                                                });
                                            }
                                        }
                                    }, () => {
                                    }).catch((error) => {
                                        vm.saveBtnDisableFlag = false;
                                        return BaseService.getErrorLog(error);
                                    });
                                }
                            }
                            else {
                                if (checkResponseHasCallBackFunctionPromise(response)) {
                                    response.alretCallbackFn.then(() => {
                                        BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.formVarificationPackaging);
                                    });
                                }
                                vm.saveBtnDisableFlag = false;
                            }
                        }).catch((error) => {
                            vm.saveBtnDisableFlag = false;
                            return BaseService.getErrorLog(error);
                        });
                    } else {
                        vm.companyConfigDialog();
                    }
                }
                else {
                    if (vm.companyConfig) {
                        if ((vm.verification.detailLineNo % 1) === 0) {
                            verifyData.newDetail.detailLineNo = CalcSumofArrayElement([vm.verification.detailLineNo, 1], 1);
                        } else {
                            verifyData.newDetail.detailLineNo = CalcSumofArrayElement([vm.verification.detailLineNo, 0.9], 1);
                        }
                        vm.cgBusyLoading = PackingSlipFactory.saveCurrentPackingSlipMaterialMemo().query(verifyData).$promise.then((response) => {
                            if (response.data) {
                                vm.saveBtnDisableFlag = false;
                                if (response.data.ErrorCode === 1) {
                                    const objMemoNumber = _.find(vm.invoiceNumberList, (data) => data.id === vm.autoCompleteInvoice.keyColumnId);
                                    const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MERGE_MEMO);
                                    messageContent.message = stringFormat(messageContent.message, vm.verification.packingSlipSerialNumber, vm.verification.receiptType ? 'credit memo' : 'debit memo', objMemoNumber && vm.verification.receiptType ? objMemoNumber.creditMemoNumber : objMemoNumber && !vm.verification.receiptType ? objMemoNumber.debitMemoNumber : '', vm.isMemoForPrice && vm.verification.isMemoForPrice ? 'Price Issue' : 'Qty Issue', vm.isMemoForPrice && vm.verification.isMemoForPrice ? 'Qty Issue' : 'Price Issue');
                                    const model = {
                                        messageContent: messageContent,
                                        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
                                        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT,
                                        multiple: true
                                    };
                                    DialogFactory.messageConfirmDialog(model).then(() => {
                                        isGetMergeLineConfirmation = true;
                                        vm.verify(isClosePopUp);
                                    }, () => {
                                        setFocus('createNew');
                                    }).catch((error) => {
                                        vm.saveBtnDisableFlag = false;
                                        return BaseService.getErrorLog(error);
                                    });
                                    return;
                                }
                                vm.formVarificationPackaging.$setPristine();
                                vm.formVarificationPackaging.$setUntouched();
                                BaseService.currentPagePopupForm = [];
                                if (vm.verification.receiptType === true) {
                                    if (isClosePopUp) {
                                        $mdDialog.cancel(true);
                                    }
                                    else {
                                        vm.clearDataAfterAddMemo();
                                    }
                                } else {
                                    vm.informationPopUpForShowDebitMemoNumner(isClosePopUp);
                                }
                            } else {
                                if (checkResponseHasCallBackFunctionPromise(response)) {
                                    response.alretCallbackFn.then(() => {
                                        BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.formVarificationPackaging);
                                    });
                                }
                                vm.saveBtnDisableFlag = false;
                            }
                        }).catch((error) => {
                            vm.saveBtnDisableFlag = false;
                            return BaseService.getErrorLog(error);
                        });
                    }
                    else {
                        vm.companyConfigDialog();
                    }
                }
            } else if (!parseFloat(vm.verification.diffrence) && !parseFloat(vm.verification.differenceQty)) {
                if (vm.companyConfig) {
                    const verifyData = {
                        id: vm.verification.id,
                        purchasePrice: vm.verification.purchasePrice,
                        invoicePrice: vm.verification.invoicePrice,
                        extendedPrice: multipleUnitValue(vm.verification.packingSlipQty, vm.verification.invoicePrice),
                        extendedReceivedPrice: multipleUnitValue(vm.verification.receivedQty, vm.verification.purchasePrice),
                        status: 'A',
                        approveNote: vm.verification.approveNote,
                        isApproveFlow: true,
                        refPackingSlipMaterialRecID: vm.packingSlipData.id
                    };

                    vm.cgBusyLoading = PackingSlipFactory.saveInvoiceMaterial().query(verifyData).$promise.then((response) => {
                        if (response && response.data) {
                            vm.saveBtnDisableFlag = false;
                            vm.formVarificationPackaging.$setPristine();
                            vm.formVarificationPackaging.$setUntouched();
                            BaseService.currentPagePopupForm = [];
                            $mdDialog.cancel(true);
                        } else {
                            vm.saveBtnDisableFlag = false;
                        }
                    }).catch((error) => {
                        vm.saveBtnDisableFlag = false;
                        return BaseService.getErrorLog(error);
                    });
                } else {
                    vm.companyConfigDialog();
                }
            }
        };

        vm.changeMemo = () => {
            vm.oldMemoObj = null;
            getInvoiceNumber(true);
            vm.verification.invoiceNumber = null;
            vm.verification.refSupplierCreditMemoNumber = null;
        };

        function calculateTotalAmount() {
            if (vm.verification) {
                vm.verification.totalCalculateAmount = Math.abs(CalcSumofArrayElement([vm.verification.priceExtendedCharge, vm.verification.qtyExtendedCharge, (vm.verification.discount || 0)], _amountFilterDecimal));
                vm.verification.totalCalculateAmountDisplay = vm.verification.totalCalculateAmount ? $filter('amount')(vm.verification.totalCalculateAmount) : 0;
                vm.calculateMemoAmount();
                // setRemainingAmount();
            }
            if ((vm.verification.invoicePrice > vm.verification.purchasePrice) || (vm.verification.packingSlipQty > vm.verification.receivedQty)) {
                vm.verification.receiptType = true;
            } else if ((vm.verification.invoicePrice < vm.verification.purchasePrice) || (vm.verification.packingSlipQty < vm.verification.receivedQty)) {
                vm.verification.receiptType = false;
            } else if (vm.verification.packingSlipQty === vm.verification.receivedQty && vm.verification.invoicePrice === vm.verification.purchasePrice) {
                vm.verification.receiptType = null;
            }
            if (vm.verification.invoicePrice === vm.verification.purchasePrice) {
                vm.isMemoForPrice = false;
            }
            if (vm.verification.packingSlipQty === vm.verification.receivedQty) {
                vm.isMemoForQty = false;
            }
        }

        vm.calculatePriceDiffrence = () => {
            if ((vm.verification.purchasePrice || vm.verification.purchasePrice === 0) && vm.verification.receivedQty) {
                vm.verification.diffrence = Math.abs(CalcSumofArrayElement([vm.verification.invoicePrice, (vm.verification.purchasePrice * -1)], 5));
                vm.verification.diffrenceDisplay = vm.verification.diffrence ? $filter('amount')(vm.verification.diffrence) : 0;

                vm.verification.differenceQty = Math.abs(vm.verification.packingSlipQty - vm.verification.receivedQty);
                vm.verification.priceExtendedCharge = multipleUnitValue(vm.verification.diffrence, vm.verification.packingSlipQty > vm.verification.receivedQty ? vm.verification.receivedQty : vm.verification.packingSlipQty);
                vm.verification.priceExtendedChargeDisplay = vm.verification.priceExtendedCharge ? $filter('amount')(vm.verification.priceExtendedCharge) : 0;

                //vm.verification.totalCalculateAmount = Math.abs(CalcSumofArrayElement([vm.verification.priceExtendedCharge, vm.verification.qtyExtendedCharge, (vm.verification.discount || 0)], _amountFilterDecimal));
                calculateTotalAmount();
            }
        };

        vm.calculateQtyDiffrence = () => {
            if ((vm.verification.purchasePrice || vm.verification.purchasePrice === 0) && vm.verification.receivedQty) {
                vm.verification.diffrence = Math.abs(CalcSumofArrayElement([vm.verification.invoicePrice, (vm.verification.purchasePrice * -1)], 5));
                vm.verification.diffrenceDisplay = vm.verification.diffrence ? $filter('amount')(vm.verification.diffrence) : 0;

                vm.verification.differenceQty = Math.abs(vm.verification.packingSlipQty - vm.verification.receivedQty);
                vm.verification.qtyExtendedCharge = multipleUnitValue(vm.verification.differenceQty, vm.verification.invoicePrice);
                vm.verification.qtyExtendedChargeDisplay = vm.verification.qtyExtendedCharge ? $filter('amount')(vm.verification.qtyExtendedCharge) : 0;

                //vm.verification.totalCalculateAmount = Math.abs(CalcSumofArrayElement([vm.verification.priceExtendedCharge, vm.verification.qtyExtendedCharge, (vm.verification.discount || 0)], _amountFilterDecimal));
                calculateTotalAmount();
            }
        };

        function setRemainingAmount() {
            if (vm.memoList) {
                vm.totalMemoAmount = CalcSumofArrayElement(_.map(vm.memoList, 'amount'), _amountFilterDecimal);
                vm.totalCreditMemoAmount = CalcSumofArrayElement(_.map(_.filter(vm.memoList, (a) => a.memoType === 'C'), 'amount'), _amountFilterDecimal);
                vm.totalCreditMemoAmount = vm.totalCreditMemoAmount ? $filter('amount')(vm.totalCreditMemoAmount) : 0;

                vm.totalDebitMemoAmount = CalcSumofArrayElement(_.map(_.filter(vm.memoList, (a) => a.memoType === 'D'), 'amount'), _amountFilterDecimal);
                vm.totalDebitMemoAmount = vm.totalDebitMemoAmount ? $filter('amount')(vm.totalDebitMemoAmount) : 0;
            }
            if (vm.verification) {
                vm.remainMemoAmount = Math.abs(CalcSumofArrayElement([(vm.verification.totalCalculateAmount || 0), ((vm.totalMemoAmount || 0) * -1)], 5));
            }

            vm.remainMemoAmountDisplay = vm.remainMemoAmount ? $filter('amount')(vm.remainMemoAmount) : 0;
        }

        const getOldDebitMemoData = () => {
            if (vm.verification && (vm.verification.packingSlipId || vm.verification.id)) {
                vm.cgBusyLoading = SupplierInvoiceFactory.getOldDebitMemoData().query({
                    packingSlipMasId: vm.verification.packingSlipId,
                    packingSlipDetId: vm.verification.id,
                    receiptType: _.isString(vm.verification.receiptType) ? vm.verification.receiptType : null
                }).$promise.then((res) => {
                    if (res && res.data) {
                        vm.memoList = res.data.memoList;
                        _.map(vm.memoList, (data) => {
                            data.memoType = data.receiptType;
                            if (data.receiptType === 'C') {
                                data.displaMemoType = TRANSACTION.InvoiceMemoType.CreditMemo;
                                data.memoNumber = data.creditMemoNumber;
                                data.memoDate = data.creditMemoDate ? BaseService.getUIFormatedDate(data.creditMemoDate, vm.DefaultDateFormat) : '';
                            } else if (data.receiptType === 'D') {
                                data.displaMemoType = TRANSACTION.InvoiceMemoType.DebitMemo;
                                data.memoNumber = data.debitMemoNumber;
                                data.memoDate = data.debitMemoDate ? BaseService.getUIFormatedDate(data.debitMemoDate, vm.DefaultDateFormat) : '';
                            }
                            data.amount = parseFloat(data.extendedPrice) * -1;
                        });

                        setRemainingAmount();
                        /*vm.totalMemoAmount = CalcSumofArrayElement(_.map(vm.memoList, 'amount'), _amountFilterDecimal);
                        vm.remainMemoAmount = Math.abs(CalcSumofArrayElement([(vm.verification.totalCalculateAmount || 0), ((vm.totalMemoAmount || 0) * -1)], 5));*/
                        //vm.verification.totalAmount = angular.copy(vm.remainMemoAmount);

                        if (vm.action !== 'AddMemo' && vm.memoList.length === 0) {
                            vm.cancel();
                        }
                    }
                }).catch((error) => BaseService.getErrorLog(error));
            }
        };

        function setSelectedTotalAmount() {
            if (vm.verification) {
                vm.verification.totalAmountDisplay = vm.verification.totalAmount ? $filter('amount')(vm.verification.totalAmount) : 0;
            }
        }

        // get address list
        const getSupplierAddressList = () => {
            vm.cgBusyLoading = CustomerFactory.customerAddressList().query({
                customerId: vm.packingSlipData.mfgCodeID,
                addressType: CORE.AddressType.BusinessAddress,
                refTableName: CORE.TABLE_NAME.MFG_CODE_MST
            }).$promise.then((billToAddress) => {
                if (billToAddress) {
                    var billToAddress = _.find(billToAddress.data, (item) => item.isDefault === true);
                    vm.defaultBillingAddressId = billToAddress ? billToAddress.id : null;
                    vm.defaultBillingAddressText = BaseService.generateAddressFormateToStoreInDB(billToAddress);
                    vm.defaultBillingContactPersonId = (billToAddress && billToAddress.contactPerson) ? billToAddress.contactPerson.personId : null;
                    vm.defaultBillingContactPersonText = (vm.defaultBillingContactPersonId) ? BaseService.generateContactPersonDetFormat(billToAddress.contactPerson) : null;
                }
            }).catch((error) => BaseService.getErrorLog(error));
        };

        const active = (isAfterSave) => {
            vm.verification.diffrence = Math.abs(CalcSumofArrayElement([vm.verification.invoicePrice, ((vm.verification.purchasePrice || 0) * -1)], 5));
            vm.verification.differenceQty = Math.abs(CalcSumofArrayElement([vm.verification.packingSlipQty - ((vm.verification.receivedQty || 0) * -1)], 0));
            vm.calculatePriceDiffrence();
            vm.calculateQtyDiffrence();
            getInvoiceNumber(true);
            getOldDebitMemoData();
            getSupplierAddressList();
            //set rows selected in case of line has discount, need to create single memo for both lines
            if ((vm.verification.discount || 0) !== 0) {
                if (vm.verification.priceExtendedCharge) {
                    vm.isMemoForPrice = true;
                }
                if (vm.verification.qtyExtendedCharge) {
                    vm.isMemoForQty = true;
                }
                if (isAfterSave) {
                    vm.verification.totalAmount = 0;

                    $timeout(() => {
                        vm.formVarificationPackaging.$setPristine();
                        vm.formVarificationPackaging.$setUntouched();
                    });
                } else {
                    vm.verification.totalAmount = CalcSumofArrayElement([vm.verification.priceExtendedCharge, vm.verification.qtyExtendedCharge, (vm.verification.discount || 0)], _amountFilterDecimal);
                }
                setSelectedTotalAmount();
            }
        };

        vm.getPackingSlipLineDetailByID = () => {
            if (vm.packingSlipId && vm.invoiceLineId) {
                vm.pagingInfo = {
                    Page: 0,
                    SortColumns: [],
                    SearchColumns: [],
                    pageName: CORE.PAGENAME_CONSTANT[7].PageName,
                    packingSlipID: vm.packingSlipId,
                    invoiceLineId: vm.invoiceLineId
                };
                vm.cgBusyLoading = PackingSlipFactory.getPackingSlipMaterialList().query(vm.pagingInfo).$promise.then((response) => {
                    vm.verification = [];
                    if (response.data && response.data.packingSlipMaterialList) {
                        vm.verification = response.data.packingSlipMaterialList.length > 0 ? (_.first(response.data.packingSlipMaterialList)) : [];
                        vm.verification.discountDisplay = vm.verification.discount ? $filter('amount')(vm.verification.discount) : 0;

                        /*formating date as API format because direct save in DB not displaying on UI*/
                        vm.verification.poDate = vm.verification.poDate ? BaseService.getAPIFormatedDate(vm.verification.poDate) : null;
                        vm.verification.soDate = vm.verification.soDate ? BaseService.getAPIFormatedDate(vm.verification.soDate) : null;

                        vm.verification.approveNote = null;
                        vm.verification.diffrence = null;
                        vm.verification.totalCalculateAmount = 0;
                        vm.verification.createNew = true;
                        vm.verification.totalAmount = 0;
                        setSelectedTotalAmount();

                        vm.isMemoForPrice = angular.copy(vm.verification.isMemoForPrice === 1 ? true : false);
                        vm.isMemoForQty = angular.copy(vm.verification.isMemoForQty === 1 ? true : false);
                        active();
                    }
                }).catch((error) => BaseService.getErrorLog(error));
            } else if (vm.action === 'ViewMemo' && vm.packingSlipId) {
                active();
            }
        };
        vm.getPackingSlipLineDetailByID();

        vm.cancel = () => {
            const isdirty = BaseService.checkFormDirty(vm.formVarificationPackaging, null);
            if (isdirty) {
                BaseService.showWithoutSavingAlertForPopUp();
            } else {
                vm.formVarificationPackaging.$setPristine();
                vm.formVarificationPackaging.$setUntouched();
                BaseService.currentPagePopupForm = [];
                $mdDialog.cancel();
            }
        };

        vm.checkUniquePackingSlipNumber = (callFrom) => {
            let verifyNumber = vm.verification.invoiceNumber;
            if (callFrom === 'RefCMNo') {
                verifyNumber = vm.verification.refSupplierCreditMemoNumber;
            }
            if (vm.packingSlipData && vm.verification && verifyNumber) {
                vm.cgBusyLoading = PackingSlipFactory.checkUniquePackingSlipNumber().query({ id: vm.packingSlipData.id || 0, name: verifyNumber, mfgCodeId: vm.packingSlipData.mfgCodeID, receiptType: 'C' }).$promise.then((res) => {
                    vm.cgBusyLoading = false;
                    if (res && res.data) {
                        const invoiceName = 'Credit Memo#';
                        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PACKING_SLIP_UNIQUE);
                        messageContent.message = stringFormat(messageContent.message, invoiceName, verifyNumber, vm.packingSlipData.mfgFullName, invoiceName);
                        const model = {
                            messageContent: messageContent,
                            multiple: true
                        };
                        DialogFactory.messageAlertDialog(model).then((yes) => {
                            if (yes) {
                                if (callFrom === 'RefCMNo') {
                                    vm.verification.refSupplierCreditMemoNumber = null;
                                    setFocus('refSupplierCreditMemoNumber');
                                } else {
                                    vm.verification.invoiceNumber = null;
                                    setFocus('invoiceNumberCMDM');
                                }
                            }
                        }, () => {
                        }).catch((error) => BaseService.getErrorLog(error));
                    }
                }).catch((error) => BaseService.getErrorLog(error));
            }
        };

        vm.validationPaymentAmount = () => {
            /*currently totalAmount field is disabled so no need to fire this validation
             discussion done between AP and DV on 11-03-2021*/
            /*if (vm.verification && vm.verification.totalAmount && (vm.remainMemoAmount || vm.remainMemoAmount === 0)) {
              if (parseFloat(vm.verification.totalAmount) > parseFloat(vm.remainMemoAmount)) {
                vm.formVarificationPackaging.totalAmount.$setDirty(true);
                vm.formVarificationPackaging.totalAmount.$touched = true;
                vm.formVarificationPackaging.totalAmount.$setValidity('checkPaymentAmount', false);
                vm.formVarificationPackaging.totalAmount.$setValidity('zeroNotAllow', true);
              } else {
                vm.formVarificationPackaging.totalAmount.$setValidity('checkPaymentAmount', true);
                vm.formVarificationPackaging.totalAmount.$setValidity('zeroNotAllow', true);
              }
            } else if (vm.verification && vm.verification.totalAmount === 0) {
              vm.formVarificationPackaging.totalAmount.$setDirty(true);
              vm.formVarificationPackaging.totalAmount.$touched = true;
              vm.formVarificationPackaging.totalAmount.$setValidity('zeroNotAllow', false);
              vm.formVarificationPackaging.totalAmount.$setValidity('checkPaymentAmount', true);
            }*/
        };

        vm.goToSupplierInvoiceDetail = (item) => {
            if (item.receiptType === CORE.packingSlipReceiptType.I.Key) {
                BaseService.goToSupplierInvoiceDetail(TRANSACTION.SupplierInvoiceType.Detail, item.refPackingSlipMaterialRecID);
            } else if (item.receiptType === CORE.packingSlipReceiptType.C.Key) {
                BaseService.goToCreditMemoDetail(TRANSACTION.SupplierInvoiceType.Detail, item.refPackingSlipMaterialRecID);
            } else if (item.receiptType === CORE.packingSlipReceiptType.D.Key) {
                BaseService.goToDebitMemoDetail(TRANSACTION.SupplierInvoiceType.Detail, item.refPackingSlipMaterialRecID);
            }
        };

        vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

        vm.showApproveNote = (object, ev) => {
            object.approveNote = object.approveNote.replace(/###/g, '<br/>');
            const obj = {
                title: 'Approve Note',
                description: object.approveNote
            };
            const data = obj;
            DialogFactory.dialogService(
                CORE.DESCRIPTION_MODAL_CONTROLLER,
                CORE.DESCRIPTION_MODAL_VIEW,
                ev,
                data).then(() => {
                }, (err) => BaseService.getErrorLog(err));
        };

        vm.checkDateValidation = () => {
            if (vm.verification) {
                const orgInvoiceDate = new Date($filter('date')(vm.orgInvoiceDate, vm.DefaultDateFormat));
                const invoiceDate = new Date($filter('date')(vm.verification.invoiceDate, vm.DefaultDateFormat));
                const invoiceMinDate = new Date($filter('date')(vm.orgInvoiceDate, vm.DefaultDateFormat));

                if (vm.formVarificationPackaging) {
                    if (vm.formVarificationPackaging.invoiceDate) {
                        if (invoiceDate < orgInvoiceDate) {
                            vm.formVarificationPackaging.invoiceDate.$setDirty(true);
                            vm.formVarificationPackaging.invoiceDate.$touched = true;
                            vm.formVarificationPackaging.invoiceDate.$setValidity('mindate', false);
                        } else {
                            vm.formVarificationPackaging.invoiceDate.$setValidity('mindate', true);
                        }
                    }
                }
                vm.invoiceDateOptions.minDate = invoiceMinDate;
            }
        };

        vm.deleteMemo = (row) => {
            const selectedIDs = [];
            if (row) {
                if ((row && row.status === CORE.PackingSlipStatus.Paid) ||
                    (row && row.status === CORE.PackingSlipStatus.PartiallyPaid) ||
                    (row && row.totalPaymentCount > 0) ||
                    (vm.packingSlipData && vm.packingSlipData.status === CORE.PackingSlipStatus.Paid) ||
                    (vm.packingSlipData && vm.packingSlipData.status === CORE.PackingSlipStatus.PartiallyPaid) ||
                    (vm.packingSlipData.packingslip_invoice_payment_det && vm.packingSlipData.packingslip_invoice_payment_det.length > 0)) {
                    const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PAID_MEMO_NOT_DELETE);
                    if (row.receiptType === TRANSACTION.PackingSlipReceiptType.CreditMemo) {
                        messageContent.message = stringFormat(messageContent.message, 'Credit Memo');
                    } else if (row.receiptType === TRANSACTION.PackingSlipReceiptType.DebitMemo) {
                        messageContent.message = stringFormat(messageContent.message, 'Debit Memo');
                    }
                    const model = {
                        messageContent: messageContent,
                        multiple: true
                    };
                    return DialogFactory.messageAlertDialog(model);
                }
                selectedIDs.push(row.refPackingSlipMaterialRecID);
            }

            if (selectedIDs) {
                let messageContent = null;
                if (row && row.noOfLineInPackingSlip > 1) {
                    messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.CONFIRMATION_MULTIPLE_DETAILS_LINES_MEMO);
                    if (row.receiptType === TRANSACTION.PackingSlipReceiptType.CreditMemo) {
                        messageContent.message = stringFormat(messageContent.message, 'Credit Memo', row.creditMemoNumber, row.noOfLineInPackingSlip, vm.verification.packingSlipSerialNumber);
                    } else if (row.receiptType === TRANSACTION.PackingSlipReceiptType.DebitMemo) {
                        messageContent.message = stringFormat(messageContent.message, 'Debit Memo', row.debitMemoNumber, row.noOfLineInPackingSlip, vm.verification.packingSlipSerialNumber);
                    }
                } else {
                    messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
                    if (row.receiptType === TRANSACTION.PackingSlipReceiptType.CreditMemo) {
                        messageContent.message = stringFormat(messageContent.message, 'Credit Memo', selectedIDs.length);
                    } else if (row.receiptType === TRANSACTION.PackingSlipReceiptType.DebitMemo) {
                        messageContent.message = stringFormat(messageContent.message, 'Debit Memo', selectedIDs.length);
                    }
                }

                const obj = {
                    messageContent: messageContent,
                    btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                    canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                };
                const objIDs = {
                    id: selectedIDs,
                    invoiceLineId: vm.verification.id,
                    CountList: true
                };

                if (row.receiptType === TRANSACTION.PackingSlipReceiptType.CreditMemo) {
                    objIDs.isCreditMemo = true;
                } else if (row.receiptType === TRANSACTION.PackingSlipReceiptType.DebitMemo) {
                    objIDs.isDebitMemo = true;
                }

                DialogFactory.messageConfirmDialog(obj).then((yes) => {
                    if (yes) {
                        vm.cgBusyLoading = SupplierInvoiceFactory.deleteInvoiceMemo().query({ objIDs: objIDs }).$promise.then((res) => {
                            if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                                if (vm.action === 'AddMemo') {
                                    $timeout(() => {
                                        vm.getPackingSlipLineDetailByID();
                                        vm.verification.invoiceNumber = null;
                                    });
                                } else {
                                    getOldDebitMemoData();
                                }
                            }
                        }).catch((error) => BaseService.getErrorLog(error));
                    }
                }, () => {
                }).catch((error) => BaseService.getErrorLog(error));
            };
        };

        vm.clearDataAfterAddMemo = () => {
            vm.verification.approveNote = null;
            vm.verification.invoiceNumber = null;
            if (vm.autoCompleteInvoice) {
                vm.autoCompleteInvoice.keyColumnId = null;
            }
            vm.verification.invoiceDate = null;
            vm.verification.totalAmount = 0;
            setSelectedTotalAmount();
            if (vm.isMemoForPrice && !vm.verification.isMemoForPrice) {
                vm.verification.isMemoForPrice = true;
            }

            if (vm.isMemoForQty && !vm.verification.isMemoForQty) {
                vm.verification.isMemoForQty = true;
            }

            $timeout(() => {
                active();
                //vm.validationPaymentAmount();
                if (vm.formVarificationPackaging) {
                    vm.formVarificationPackaging.$setPristine();
                    vm.formVarificationPackaging.$setUntouched();
                    BaseService.currentPagePopupForm = [];
                }
            });
        };

        vm.informationPopUpForShowDebitMemoNumner = (isClosePopUp) => {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SHOW_DEBIT_MEMO_NUMBER);
            messageContent.message = stringFormat(messageContent.message, vm.verification.invoiceNumber);
            const obj = {
                messageContent: messageContent,
                multiple: true
            };
            DialogFactory.messageAlertDialog(obj).then((yes) => {
                if (yes) {
                    vm.formVarificationPackaging.$setPristine();
                    vm.formVarificationPackaging.$setUntouched();
                    BaseService.currentPagePopupForm = [];
                    if (isClosePopUp) {
                        $mdDialog.cancel(true);
                    } else {
                        vm.clearDataAfterAddMemo();
                    }
                }
            }, () => {
            }).catch((error) => {
                vm.saveBtnDisableFlag = false;
                return BaseService.getErrorLog(error);
            });
        };

        vm.calculateMemoAmount = () => {
            vm.verification.totalAmount = 0;
            if (vm.isMemoForPrice && !vm.verification.isMemoForPrice) {
                vm.verification.totalAmount = CalcSumofArrayElement([vm.verification.totalAmount, vm.verification.priceExtendedCharge], _amountFilterDecimal);
            }
            if (vm.isMemoForQty && !vm.verification.isMemoForQty) {
                vm.verification.totalAmount = CalcSumofArrayElement([vm.verification.totalAmount, vm.verification.qtyExtendedCharge], _amountFilterDecimal);
            }
            if (vm.verification.discount) {
                vm.verification.totalAmount = CalcSumofArrayElement([vm.verification.totalAmount, vm.verification.discount], _amountFilterDecimal);
            }

            setSelectedTotalAmount();
            setRemainingAmount();
        };

        angular.element(() => {
            BaseService.currentPagePopupForm = [vm.formVarificationPackaging];
        });
    }
})();
