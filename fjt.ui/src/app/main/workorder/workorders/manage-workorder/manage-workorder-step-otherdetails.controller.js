(function () {
  'use strict';

  angular
    .module('app.workorder.workorders')
    .controller('ManageWorkorderOtherDetailsController', ManageWorkorderOtherDetailsController);

  /** @ngInject */
  function ManageWorkorderOtherDetailsController($scope, $timeout,
    CORE, WORKORDER,
    DataElementTransactionValueFactory, BaseService) {
    // Don't Remove this code
    // Don't add any code before this
    if (!$scope.$parent.$parent.vm.workorder || !$scope.$parent.$parent.vm.workorder.woID) {
      $state.go(WORKORDER.MANAGE_WORKORDER_DETAILS_STATE, { woID: null });
      return;
    }
    $scope.vm = $scope.$parent.$parent.vm;
    //Add form name for check form dirty
    $scope.vm.CurrentForm = 'workorderOtherDetail';
    let vm = $scope.vm;
    // add code after this only
    // Don't Remove this code

    vm.IsOtherDetailTab = true;
    vm.OtherDetailTabName = CORE.OtherDetailTabName;
    vm.dataElementList = [];
    vm.entityID = 0;


    /**
     * Send form
     */
    /*To save other value detail
       Note:If any step added after other detail just remove function body and add logic of last step 
    */
    vm.fileList = {};

    vm.SaveWorkorderOtherDetails = () => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }
      vm.saveDisable = true;
      if (BaseService.focusRequiredField(vm.workorderOtherDetail, false)) {
        vm.saveDisable = false;
        return;
      }

      let dynamicControlList = DataElementTransactionValueFactory.getDataElementTransactionList(vm.dataElementList);
      DataElementTransactionValueFactory.saveTransctionValue({
        referenceTransID: vm.workorder.woID,
        entityID: vm.entityID,
        dataElementList: dynamicControlList.dataElementList,
        removeElementList: dynamicControlList.removeElementList,
        subFormTransList: dynamicControlList.subFormTransList,
        deletedsubFormTransIDs: dynamicControlList.deletedsubFormTransIDs,
        removeSubFormTransListConditional: dynamicControlList.removeSubFormTransListConditional
      }, vm.fileList).then((res) => {
        vm.fileList = {};
        vm.workorderOtherDetail.$setPristine();

        // Display success message of each field if assigned on validation options
        DataElementTransactionValueFactory.displaySuccessMessage(dynamicControlList.dataElementList);
        vm.IsOtherDetailTab = false;
        $timeout(function () {
          vm.IsOtherDetailTab = true;
        });
        vm.saveDisable = false;
      }).catch((error) => {
        vm.saveDisable = false;
        return BaseService.getErrorLog(error);
      });
    }


  };
})();
