(function () {
    'use strict';

    angular
        .module('app.transaction.packingSlip')
        .controller('InvoiceDetailNotePopUpController', InvoiceDetailNotePopUpController);

    function InvoiceDetailNotePopUpController($mdDialog, CORE, TRANSACTION, BaseService, data, USER) {
        const vm = this;
        vm.CORE = CORE;
        vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
        vm.invoiceData = angular.copy(data);
        vm.query = {
            order: ''
        };

        vm.goToSupplierList = (data) => {
            BaseService.goToSupplierList();
            return false;
        }

        vm.goToSupplierDetail = (data) => {
            BaseService.goToSupplierDetail(data.id);
            return false;
        }

        vm.headerdata = [];
        vm.headerdata.push(
            {
                label: 'PO#',
                value: vm.invoiceData.poNumber,
                displayOrder: 1
            },
            {
                label: 'Supplier',
                value: vm.invoiceData.supplierCode,
                displayOrder: 2,
                labelLinkFn: vm.goToSupplierList,
                valueLinkFn: vm.goToSupplierDetail,
                valueLinkFnParams: { id: vm.invoiceData.mfgCodeID }
            }
        );

        let splitNoteList = vm.invoiceData.packingDetailNote.split("||");
        vm.noteList = [];
        _.map(splitNoteList, (data) => {
            let splitValue = data.split("###");
            let obj = {
                lineId: splitValue[0],
                note: splitValue[1]
            }
            vm.noteList.push(obj);
        });

        vm.cancel = () => {
            $mdDialog.cancel();
        };
    }
})();