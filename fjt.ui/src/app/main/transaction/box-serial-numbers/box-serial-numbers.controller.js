(function () {
  'use strict';

  angular
    .module('app.transaction.boxserialnumbers')
    .controller('BoxSerialNumbersController', BoxSerialNumbersController);

  /** @ngInject */
  function BoxSerialNumbersController($scope, $mdDialog, $timeout, TRANSACTION, CORE, USER, BoxSerialNumbersFactory, BaseService, DialogFactory) {
    const vm = this;
    vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.BOX_SERIAL_NUMBERS;
    vm.gridConfig = CORE.gridConfig;
    vm.LabelConstant = CORE.LabelConstant;

    /* Add box serial number */
    vm.addRecord = (data, ev) => {
      const boxDetail = { data: data };
      DialogFactory.dialogService(
        TRANSACTION.TRANSACTION_BOX_SERIAL_NUMBERS_POPUP_CONTROLLER,
        TRANSACTION.TRANSACTION_BOX_SERIAL_NUMBERS_POPUP_VIEW,
        ev,
        boxDetail).then((resposne) => {
          if (resposne) {
            $scope.$broadcast('refreshUIGridList');
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    /* Update Box Serial Number */
    vm.updateRecord = (row) => {
      vm.addRecord({ id: row.entity.id });
    };

    /* Add/update box serial number detail event */
    const addUpdateRecord = $scope.$on('addUpdateRecord', (event, data) => {
      vm.addRecord(data.data, data.ev);
    });

    /* close popup on page destroy  */
    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, { closeAll: true });
      addUpdateRecord();
    });
  }
})();
