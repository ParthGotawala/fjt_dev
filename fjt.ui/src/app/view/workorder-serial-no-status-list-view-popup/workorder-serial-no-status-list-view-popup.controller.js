(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('WorkorderSerialNoStatusListPopUpController', WorkorderSerialNoStatusListPopUpController);

  function WorkorderSerialNoStatusListPopUpController($mdDialog, CORE, data) {
    const vm = this;
    vm.CORE = CORE;

    vm.prodStatus = CORE.productStatus;
    vm.NOT_PROCESS_SERIAL_NO_MESSAGE = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.NOT_PROCESS_SERIAL_NO_MESSAGE;
    var serialList = angular.copy(data);
    // Change Prod status from Enum list
    _.each(serialList, (data) => {
      var statusDetail = _.find(vm.prodStatus, (item) => {
        return item.id == data.prodstatus;
      });
      if (typeof (statusDetail) === "object") {
        data.prodstatus = statusDetail.status;
      }
    })

    vm.serialNoList = serialList;
    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
