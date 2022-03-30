(function () {
    'use strict';

    angular
        .module('app.transaction.supplierInvoice')
        .controller('MemoApproveNotePopUpController', MemoApproveNotePopUpController);

    function MemoApproveNotePopUpController($mdDialog, CORE, data, BaseService, TRANSACTION, SupplierInvoiceFactory) {
        const vm = this;
        vm.CORE = CORE;
        vm.invoiceLineDetail = angular.copy(data);
        vm.approveList = [];
        vm.query = {
            order: ''
        };

        vm.headerdata = [];
        vm.headerdata.push(
            {
                label: 'Packing Slip Line#',
                value: vm.invoiceLineDetail.packingSlipSerialNumber,
                displayOrder: 1
            }
        );

        let getMemoApproveNoteDetails = () => {
            vm.cgBusyLoading = SupplierInvoiceFactory.getMemoApproveNoteDetails().query({ lineId: vm.invoiceLineDetail.id }).$promise.then((response) => {
                if (response && response.data) {
                    vm.approveList = response.data.approveList;
                    _.map(vm.approveList, (data) => {
                        if (!data.packingSlipId) {
                            data.packingSlipId = vm.invoiceLineDetail.packingSlipId;
                            data.packingSlipNumber = vm.invoiceLineDetail.packingSlipNumber;
                            data.receiptType = 'I';
                            data.lineNumber = vm.invoiceLineDetail.packingSlipSerialNumber;
                        }
                    });
                }
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        }
        getMemoApproveNoteDetails();
        
        vm.supplierInvoiceDetail = (item) => {
            if (item.receiptType == 'I') {
                BaseService.goToSupplierInvoiceDetail(TRANSACTION.PackingSlipTabType.InvoiceVerification, item.packingSlipId)
            } else if (item.receiptType == 'C') {
                BaseService.goToSupplierInvoiceDetail(TRANSACTION.PackingSlipTabType.CreditMemo, item.packingSlipId)
            } else if (item.receiptType == 'D') {
                BaseService.goToSupplierInvoiceDetail(TRANSACTION.PackingSlipTabType.DebitMemo, item.packingSlipId)
            }
        }

        vm.cancel = () => {
            $mdDialog.cancel();
        };
    }
})();