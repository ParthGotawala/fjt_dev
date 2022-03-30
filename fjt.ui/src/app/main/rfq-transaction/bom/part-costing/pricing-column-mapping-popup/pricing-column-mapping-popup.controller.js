(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .controller('PricingColumnMappingPopupController', PricingColumnMappingPopupController);

  /** @ngInject */
  function PricingColumnMappingPopupController($mdDialog, DialogFactory, data, CORE, RFQTRANSACTION) {

    const vm = this;
    vm.LabelConstant = CORE.LabelConstant;
    vm.Headers = [];
    const excelHeaders = [];
    _.each(data.excelHeaders, (item) => {
      if (item) {
        item = item.replace('*', '').replace(' (Weeks)', '').replace(' (Yes/No)', '');
        excelHeaders.push(item);
      }
    });
    vm.excelHeaders = _.map(_.uniq(excelHeaders), (x) => { return { name: x }; });
    vm.excelHeaders = _.filter(vm.excelHeaders, (uniq) => uniq.name);
    vm.headers = data.headers;
    vm.headerName = data.headerName;
    if (vm.headerName === RFQTRANSACTION.Price_Header) {
      vm.isPricing = true;
    }

    const defaultAutoCompleteHeader = {
      columnName: 'name',
      keyColumnName: 'name',
      keyColumnId: null,
      inputName: 'Column',
      placeholderName: 'Column',
      isRequired: false,
      isAddnew: false,
      callbackFn: null,
      onSelectCallbackFn: function (selectedItem) {

      }
    };
    _.each(vm.headers, (item) => {
      var pricingItem = {
        header: item.fieldName,
        isRequired: item.isRequired
      };
      var autoCompleteHeader = angular.copy(defaultAutoCompleteHeader);
      var excelHeaderObj = vm.excelHeaders.find((x) => { return x.name && item.fieldName && x.name.toUpperCase() === item.fieldName.toUpperCase(); });
      autoCompleteHeader.keyColumnId = excelHeaderObj ? excelHeaderObj.name : null;
      pricingItem.autoCompleteHeader = autoCompleteHeader;

      if (vm.headerName == vm.LabelConstant.UMIDManagement.UMID) {
        if (_.findIndex(CORE.UMID_COLUMN_MAPPING_REQUIRE, (data) => { return data == item.fieldName }) != -1) {
          pricingItem.isRequired = true;
        }
      }
      if (vm.headerName == vm.LabelConstant.SupplierQuote.PartPricing) {
        pricingItem.isRequired = true;
      }
      vm.Headers.push(pricingItem);
    });

    vm.cancel = () => {
      $mdDialog.cancel();
    };

    vm.ok = ($event) => {
      var model = vm.Headers.map((item) => {
        return {
          header: item.header,
          column: item.autoCompleteHeader.keyColumnId
        };
      });
      const res = {
        model: model,
        excelHeaders: vm.excelHeaders
      };
      $mdDialog.hide(res);
    };
  }
})();
