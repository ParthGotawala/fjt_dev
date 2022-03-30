(function () {
  'use strict';

  angular
    .module('app.transaction.supplierRMA')
    .controller('SelectLineForSameMFRPNLineController', SelectLineForSameMFRPNLineController);

  function SelectLineForSameMFRPNLineController($mdDialog, CORE, USER, BaseService, data, PackingSlipFactory) {
    const vm = this;
    vm.detailList = data.lineDetailList;
    vm.packingSlipId = data.packingSlipId;
    vm.headerDetail = vm.detailList[0];
    vm.LabelConstant = CORE.LabelConstant;
    vm.query = {
      order: ''
    };
    vm.isDisable = true;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.headerdata = [];

    vm.goToPackingSlipList = () => {
      BaseService.goToPackingSlipList();
    };

    vm.goToManagePackingSlipDetail = () => {
      BaseService.goToManagePackingSlipDetail(vm.packingSlipId);
    };

    vm.goToInvoiceList = () => {
      BaseService.goToSupplierInvoiceList();
    };

    vm.invoiceDetail = () => {
      BaseService.goToSupplierInvoiceDetail(null, vm.psList[0].invoiceId);
    };

    const getPackingSlipList = () => {
      vm.cgBusyLoading = PackingSlipFactory.getPSLineOfSameMFPNList().query({ lines: _.map(vm.detailList, 'id') }).$promise.then((PSlist) => {
        if (PSlist && PSlist.data && PSlist.data.length > 0) {
          vm.psList = PSlist.data;

          _.map(vm.psList, (data) => {
            data.rohsIcon = stringFormat('{0}{1}', vm.rohsImagePath, data.rohsIcon);
          });

          vm.headerdata.push(
            {
              label: vm.LabelConstant.UMIDManagement.PackingSlipNumber,
              value: vm.psList[0].packingSlipNumber,
              displayOrder: 1,
              labelLinkFn: vm.goToPackingSlipList,
              valueLinkFn: vm.goToManagePackingSlipDetail
            },
            {
              label: vm.LabelConstant.SupplierInvoice.InvoiceNumber,
              value: vm.psList[0].invoiceNumber,
              displayOrder: 2,
              labelLinkFn: vm.goToInvoiceList,
              valueLinkFn: vm.invoiceDetail
            }
          );
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    getPackingSlipList();

    vm.selectPart = (item) => {
      if (item) {
        vm.isDisable = !item.isSelect;
        vm.selectedRow = item;
        _.map(vm.psList, (data) => {
          if (data.id !== item.id) {
            data.isSelect = false;
          }
        });
      }
    };

    vm.confirmSelect = () => {
      const selectLine = _.find(vm.detailList, { id: vm.selectedRow.id });
      selectLine.packingSlipDetailId = vm.selectedRow.packingSlipDetailId || vm.selectedRow.id;
      $mdDialog.cancel(selectLine);
    };

    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
