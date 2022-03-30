(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('SerialNumberTransHistoryPopupController', SerialNumberTransHistoryPopupController);

  /** @ngInject */
  function SerialNumberTransHistoryPopupController($mdDialog, WORKORDER, CORE, data, BaseService) {
    const vm = this;
    vm.woNumber = data.woNumber;
    vm.serialNoid = data.serialNoid;
    vm.EmptyMesssage = WORKORDER.WORKORDER_EMPTYSTATE.WORKORDER_SERIAL;
    vm.prodStatus = CORE.productStatus;
    vm.statusText = CORE.statusText;
    vm.headerdata = [];

    //redirect to work order list
    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
      return false;
    }
    //redirect to work order details
    vm.goToWorkorderDetails = () => {
      BaseService.goToWorkorderDetails(data.woID);
      return false;
    }

    vm.headerdata = [{
      label: "Serial#", value: data.serialNo, displayOrder: 1
    }, {
      label: CORE.LabelConstant.Workorder.WO, value: data.woNumber, displayOrder: 2, labelLinkFn: vm.goToWorkorderList,
      valueLinkFn: vm.goToWorkorderDetails
      }, {
        label: CORE.LabelConstant.Workorder.Version, value: data.woVersion, displayOrder: 3
      }];
    vm.cancel = () => {
      $mdDialog.hide();
    };
  }
})();
