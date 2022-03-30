(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('ImportEquipmentFeederPopupController', ImportEquipmentFeederPopupController);

  /** @ngInject */
  function ImportEquipmentFeederPopupController($mdDialog, DialogFactory, data, CORE) {
    const vm = this;
    var feederHeaders;
    var excelHeaderObj;
    vm.feederHeaders = [];
    const excelHeaders = [];
    vm.excelHeaders = [];
    // vm.excelHeaders = _.map(_.uniq(data.excelHeaders), (x) => { return { name: x }; });
    _.map(_.uniq(data.excelHeaders), (x) => { vm.excelHeaders.push({ name: x }); });

    feederHeaders = data.feederHeaders;
    const defaultAutoCompleteHeader = {
      columnName: 'name',
      keyColumnName: 'name',
      keyColumnId: null,
      inputName: 'Column',
      placeholderName: 'Column',
      isRequired: false,
      isAddnew: false,
      callbackFn: null,
      onSelectCallbackFn: () => {
      }
    };
    _.each(vm.excelHeaders, (item) => {
      if (item.name) {
        item.name = item.name.replace('*', '').replace(' (Weeks)', '').replace(' (Yes/No)', '');
        excelHeaders.push(item.name);
      }
    });
    _.each(feederHeaders, (item) => {
      var pricingItem = {
        header: item.Name
      };
      var autoCompleteHeader = angular.copy(defaultAutoCompleteHeader);
      autoCompleteHeader.isRequired = item.isRequired;
      excelHeaderObj = vm.excelHeaders.find((x) => x.name.toUpperCase() === item.Name.toUpperCase());
      autoCompleteHeader.keyColumnId = excelHeaderObj ? excelHeaderObj.name : null;
      pricingItem.autoCompleteHeader = autoCompleteHeader;
      pricingItem.isDisplay = item.isDisplay;
      vm.feederHeaders.push(pricingItem);
    });

    vm.cancel = () => {
      $mdDialog.cancel();
    };

    vm.ok = () => {
      const model = [];
      let missingPIDCode = 0;

      vm.feederHeaders.map((item) => model.push({
        header: item.header,
        column: item.autoCompleteHeader.keyColumnId
      })
      );
      _.each(vm.feederHeaders, (item) => {
        if (item.header === 'PID' || item.header === 'Production PN') {
          if (!item.autoCompleteHeader.keyColumnId) {
            missingPIDCode = missingPIDCode + 1;
          }
        }
      });
      if (missingPIDCode > 1) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.PID_PRODUCTIONPN_REQUIRED);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
        return;
      }
      const res = {
        model: model,
        excelHeaders: excelHeaders
      };
      $mdDialog.hide(res);
    };
  }
})();
