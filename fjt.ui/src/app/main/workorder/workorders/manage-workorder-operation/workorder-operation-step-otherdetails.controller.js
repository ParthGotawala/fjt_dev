(function () {
  'use strict';
  angular
    .module('app.workorder.workorders')
    .controller('WorkorderOperationOtherDetailsController', WorkorderOperationOtherDetailsController);

  /** @ngInject */
  function WorkorderOperationOtherDetailsController($scope, $timeout,
    CORE,
    DataElementTransactionValueFactory, BaseService) {
    // Don't Remove this code
    // Don't add any code before this
    $scope.vm = $scope.$parent.$parent.vm;
    //Add form name for check form dirty
    $scope.vm.CurrentForm = 'operationOtherDetail';
    const vm = $scope.vm;
    // add code after this only
    // Don't Remove this code

    vm.fileList = {};
    vm.dataElementList = [];
    vm.entityID = 0;
    vm.isDisplayDataElem = true;
    vm.optionalParameter = { woID: vm.operation.woID };

    vm.SaveWorkorderOperationOtherDetails = () => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }
      vm.saveDisable = true;
      if (BaseService.focusRequiredField(vm.operationOtherDetail, false)) {
        vm.saveDisable = false;
        return;
      }

      const dynamicControlList = DataElementTransactionValueFactory.getDataElementTransactionList(vm.dataElementList);
      DataElementTransactionValueFactory.saveTransctionValue({
        referenceTransID: vm.operation.woOPID,
        entityID: vm.entityID,
        dataElementList: dynamicControlList.dataElementList,
        removeElementList: dynamicControlList.removeElementList,
        subFormTransList: dynamicControlList.subFormTransList,
        deletedsubFormTransIDs: dynamicControlList.deletedsubFormTransIDs,
        removeSubFormTransListConditional: dynamicControlList.removeSubFormTransListConditional
      }, vm.fileList).then(() => {
        vm.operationOtherDetail.$setPristine();

        // Display success message of each field if assigned on validation options
        DataElementTransactionValueFactory.displaySuccessMessage(dynamicControlList.dataElementList);
        vm.isDisplayDataElem = false;
        $timeout(() => {
          vm.isDisplayDataElem = true;
        });
        vm.saveDisable = false;
      }).catch((error) => {
        vm.saveDisable = false;
        return BaseService.getErrorLog(error);
      });
    };
  };
  //angular
  //   .module('app.workorder.workorders').WorkorderOperationOtherDetailController = function () {
  //   };
})();
