(function () {
  'use strict';

  angular
    .module('app.transaction.receivingmaterial')
    .controller('DuplicatePoLineValidationController', DuplicatePoLineValidationController);

  /** @ngInject */
  function DuplicatePoLineValidationController($mdDialog, CORE, data) {
    const vm = this;
    vm.LabelConstant = CORE.LabelConstant;
    vm.messageContent = data.messageContent || null;
    vm.poLines = data.poLines;
    vm.ButtonList = CORE.duplicatePoLineSaveType;

    vm.cancel = () => $mdDialog.cancel();
    vm.saveData = (ButtonId) => {
      const data = {
        ButtonId: ButtonId,
        selectedLine: vm.selected
      };
      $mdDialog.hide(data);
    };

    vm.selectLine = (item) => {
      if (vm.selected && vm.selected.refPOLineID === item.refPOLineID) {
        item.isSelect = false;
        vm.selected = null;
      } else {
        _.map(vm.poLines, (item) => item.isSelect = false);
        item.isSelect = true;
        vm.selected = item;
      }
    };
  }
})();
