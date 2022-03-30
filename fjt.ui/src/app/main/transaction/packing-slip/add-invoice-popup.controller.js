(function () {
    'use strict';

    angular
        .module('app.transaction.packingSlip')
        .controller('AddInvoiceController', AddInvoiceController);

    function AddInvoiceController($mdDialog, $timeout, $q, $state, $filter, CORE, TRANSACTION, BaseService, data, USER, DialogFactory, PackingSlipFactory) {
        const vm = this;
        vm.CORE = CORE;
        vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
        vm.invoiceData = angular.copy(data);
        vm.DefaultDateTimeFormat = _dateTimeDisplayFormat;
        vm.DefaultDateFormat = _dateDisplayFormat;
        let currentDate = new Date($filter('date')(new Date(), vm.DefaultDateFormat));
        vm.invoiceData.invoiceDate = vm.invoiceData.invoiceDate ? vm.invoiceData.invoiceDate : currentDate;
        vm.invoiceData.applyDate = vm.invoiceData.applyDate ? vm.invoiceData.applyDate : vm.invoiceData.invoiceDate;
        //vm.invoiceData.applyDate = vm.invoiceData.applyDate ? BaseService.getUIFormatedDate(vm.invoiceData.applyDate, vm.DefaultDateFormat) : null;
        if (vm.invoiceData && vm.invoiceData.invoiceNumber) {
            vm.isAddNew = false;
        } else {
            vm.isAddNew = true;
        }
        vm.invoiceDateOptions = {
            appendToBody: true,
            maxDate: currentDate
        };
        vm.applyDateOptions = {
            appendToBody: true
        };
        vm.DATE_PICKER = CORE.DATE_PICKER;
        vm.IsPickerOpen = {
            [vm.DATE_PICKER.invoiceDate]: false,
            [vm.DATE_PICKER.applyDate]: false
        };

        vm.getMaxDateValidation = (FromDate, ToDate) => {
            return BaseService.getMaxDateValidation(FromDate, ToDate);
        }

        vm.goToSupplierList = (data) => {
            BaseService.goToSupplierList();
            return false;
        }

        vm.goToSupplierDetail = (data) => {
            BaseService.goToSupplierDetail(data.id);
            return false;
        }

        vm.goToPackingSlipList = (data) => {
            BaseService.goToSupplierInvoiceList();
            return false;
        }

        vm.goToPackingSlipDetail = (data) => {
            BaseService.goToSupplierInvoiceDetail(null, data.id);
            return false;
        }

        vm.headerdata = [];
        vm.headerdata.push({
            label: 'Supplier',
            value: vm.invoiceData.supplierCode ? vm.invoiceData.supplierCode : vm.invoiceData.mfgCodemst.mfgCode,
            displayOrder: 1,
            labelLinkFn: vm.goToSupplierList,
            valueLinkFn: vm.goToSupplierDetail,
            valueLinkFnParams: { id: vm.invoiceData.mfgCodeID ? vm.invoiceData.mfgCodeID : vm.invoiceData.mfgCodemst.id }
        },
        {
            label: 'PO#',
            value: vm.invoiceData.poNumber,
            displayOrder: 2
        },
        {
            label: 'Packing Slip#',
            value: vm.invoiceData.packingSlipNumber,
            displayOrder: 3,
            labelLinkFn: vm.goToPackingSlipList,
            valueLinkFn: vm.goToPackingSlipDetail,
            valueLinkFnParams: { id: vm.invoiceData.id }
        },
        {
            label: 'Packing Slip Date',
            value: $filter('date')(vm.invoiceData.packingSlipDate, vm.DefaultDateFormat),
            displayOrder: 4
        });

        vm.checkDateValidation = () => {
            if (vm.invoiceData) {
                var invoiceDate = new Date($filter('date')(vm.invoiceData.invoiceDate, vm.DefaultDateTimeFormat));
                var packingSlipDate = new Date($filter('date')(vm.invoiceData.packingSlipDate, vm.DefaultDateTimeFormat));

                if (packingSlipDate > invoiceDate) {
                    vm.formAddInvoice.invoiceDate.$setDirty(true);
                    vm.formAddInvoice.invoiceDate.$touched = true;
                    vm.formAddInvoice.invoiceDate.$setValidity("mindate", false);
                } else {
                    vm.formAddInvoice.invoiceDate.$setValidity("mindate", true);
                    if (vm.invoiceData.applyDate) {
                        var applyDate = new Date($filter('date')(vm.invoiceData.applyDate, vm.DefaultDateTimeFormat));
                        if (applyDate < invoiceDate) {
                            vm.formAddInvoice.applyDate.$setDirty(true);
                            vm.formAddInvoice.applyDate.$touched = true;
                            vm.formAddInvoice.applyDate.$setValidity("mindate", false);
                        } else {
                            vm.invoiceData.applyDate = vm.invoiceData.applyDate ? vm.invoiceData.applyDate : angular.copy(vm.invoiceData.invoiceDate);
                        }
                    } else {
                        vm.invoiceData.applyDate = angular.copy(vm.invoiceData.invoiceDate);
                    }
                }
            }
        }

        vm.checkApplyDateValidation = () => {
            if (vm.invoiceData) {
                var invoiceDate = new Date($filter('date')(vm.invoiceData.invoiceDate, vm.DefaultDateTimeFormat));
                var applyDate = new Date($filter('date')(vm.invoiceData.applyDate, vm.DefaultDateTimeFormat));

                if (applyDate < invoiceDate) {
                    vm.formAddInvoice.applyDate.$setDirty(true);
                    vm.formAddInvoice.applyDate.$touched = true;
                    vm.formAddInvoice.applyDate.$setValidity("mindate", false);
                } else {
                    vm.formAddInvoice.applyDate.$setValidity("mindate", true);
                }
            }
        }

        vm.saveInvoice = () => {
            if (!vm.formAddInvoice.$valid) {
                BaseService.focusRequiredField(vm.formAddInvoice);
                return;
            }
            vm.invoiceData.applyDate = BaseService.getAPIFormatedDate(vm.invoiceData.applyDate);
            vm.invoiceData.invoiceDate = BaseService.getAPIFormatedDate(vm.invoiceData.invoiceDate);
            vm.cgBusyLoading = PackingSlipFactory.saveInvoiceData().query(vm.invoiceData).$promise.then((response) => {
                if (response) {
                    vm.formAddInvoice.$setPristine();
                    BaseService.currentPagePopupForm = [];
                    if ($state.current.name == TRANSACTION.TRANSACTION_SUPPLIER_INVOICE_STATE) {
                        vm.cgBusyLoading = false;
                        let obj = {
                            title: CORE.MESSAGE_CONSTANT.CONFIRMATION,
                            textContent: TRANSACTION.CONFIRMATION_FOR_PACKING_SLIP,
                            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT,
                            multiple: true
                        };
                        return DialogFactory.confirmDiolog(obj).then((yes) => {
                            if (yes) {
                                $mdDialog.cancel();
                              $state.go(TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_INVOICE_STATE, { type: TRANSACTION.SupplierInvoiceType.Detail, id: vm.invoiceData.id });
                            }
                        }, (cancel) => {
                            $mdDialog.cancel(true);
                        }).catch((error) => {
                            return BaseService.getErrorLog(error);
                        });
                    } else {
                        let obj = {
                            invoiceNumber: vm.invoiceData.invoiceNumber,
                            invoiceDate: vm.invoiceData.invoiceDate,
                            applyDate: vm.invoiceData.applyDate
                        };
                        $mdDialog.cancel(obj);
                    }
                }
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        }

        vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
            return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
        }

        vm.invoiceDataCopy = _.clone(vm.invoiceData);
        vm.checkDirtyObject = {
            oldModelName: vm.invoiceDataCopy,
            newModelName: vm.invoiceData
        }

        vm.checkFormDirty = (form, columnName) => {
            vm.checkDirty = BaseService.checkFormDirty(form, columnName);
            if (vm.isChanged || vm.checkDirty) {
                vm.checkDirty = true;
            }
            return vm.checkDirty;
        }

        vm.cancel = () => {
            let isdirty = vm.checkFormDirty(vm.formAddInvoice, vm.checkDirtyObject);
            if (isdirty) {
                BaseService.showWithoutSavingAlertForPopUp();
            } else {
                vm.formAddInvoice.$setPristine();
                BaseService.currentPagePopupForm = [];
                $mdDialog.cancel();
            }
        };

      angular.element(() => {
        BaseService.currentPagePopupForm = [vm.formAddInvoice];
      });
    }
})();
