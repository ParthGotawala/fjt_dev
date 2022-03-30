(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('SelectFeederLocationPopUpController', SelectFeederLocationPopUpController);

  function SelectFeederLocationPopUpController($mdDialog, CORE, data) {

    const vm = this;
    vm.CORE = CORE;
    vm.feederLocationList =  data;;
    vm.query = {
      order: ''
    };
    //select default first feeder location from multuple list
    vm.selectPart = (item) => {
      if (item) {
        vm.isDisable = !item.isSelect;
        vm.selectedRow = item;
        _.map(vm.feederLocationList, (data) => {
          if (data.feederLocation != item.feederLocation) {
            data.isSelect = false;
          }
        });
      }
    }
    vm.feederLocationList[0].isSelect = true;
    vm.selectPart(vm.feederLocationList[0]);
    //confirm feeder
    vm.confirmSelect = () => {
      $mdDialog.cancel(vm.selectedRow);
    }
    //cancel popup
    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
