(function () {
  'user strict';

  angular
    .module('app.core')
    .directive('workorderOperationVerification', workorderOperationVerification);

  /** @ngInject */
  function workorderOperationVerification(CORE, WorkorderFactory, WorkorderOperationEmployeeFactory, BaseService) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        woId: '=?',
        woSubStatus: '=?',
        isOperationsVerified: '=?',
        woOtherDetails:'='
      },
      templateUrl: 'app/directives/custom/workorder-operation-verification/workorder-operation-verification.html',
      controller: workorderOperationVerificationCtrl,
      controllerAs: 'vm'
    };
    return directive;


    /** @ngInject */
    /**
    * Controller for workorder operation verification directive
    *
    * @param
    */
    function workorderOperationVerificationCtrl($scope) {
      var vm = this;

      vm.isOperationAvailable = false;
      vm.isOperationsVerified = $scope.isOperationsVerified;
      vm.woID = $scope.woId;
      vm.woSubStatus = $scope.woSubStatus;
      vm.woOtherDetails = $scope.woOtherDetails;

      //catch if any change in operation
      const operationChange = $scope.$on('operationChangedMain', (evt, data) => {
        if (data) {
          vm.isOperationAvailable = data.isOperationAvailable != null ? data.isOperationAvailable : vm.isOperationAvailable;
          vm.isOperationsVerified = data.isOperationsVerified != null ? data.isOperationsVerified : vm.isOperationsVerified;
        }
      });

      // check all operation verified or not
      vm.ValidateOperation = () => {
        // stop access if wo status in TERMINATED or COMPLETED or VOID
        if (vm.woOtherDetails && vm.woOtherDetails.isWoInSpecificStatusNotAllowedToChange) {
          return;
        }
        if (vm.isOperationAvailable) {
          if (!vm.isOperationsVerified) {
            const workorderStatus = {
              woID: vm.woID,
              woSubStatus: vm.woSubStatus
            };
            if (vm.woID) {
              vm.cgBusyLoading = WorkorderFactory.verifyWorkorder().update({ id: vm.woID }, workorderStatus).$promise.then((res) => {
                if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                  vm.isOperationsVerified = true;
                  $scope.$emit('operationVerified', vm.isOperationsVerified);
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }
        } else {
          //WORKORDER.WORKORDER_MUST_HAVE_ATLEAST_ONE_OPERATION
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.WORKORDER_MUST_HAVE_ATLEAST_ONE_OPERATION);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
        }
      };

      //Get list of operations available.
      vm.GetOperationListByWoID = () => {
        if (vm.woID) {
          vm.cgBusyLoading = WorkorderOperationEmployeeFactory.retriveOperationListbyWoID().query({ woID: vm.woID }).$promise.then((operationlist) => {
            if (operationlist.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              vm.isOperationAvailable = operationlist.data && operationlist.data.length > 0 ? true : false;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          vm.isOperationAvailable = false;
        }
      };

      const checkOperationVerifiedByWoID = () => {
        if (vm.woID) {
          vm.cgBusyLoading = WorkorderFactory.getWorkOrderNumbers().query({ woID: vm.woID }).$promise.then((res) => {
            if (res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              vm.isOperationsVerified = res.data.isOperationsVerified;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };
      //on load get operation count of woID
      vm.GetOperationListByWoID();
      checkOperationVerifiedByWoID();

      //on destroy
      $scope.$on('$destroy', () => operationChange());
    }
  }
})();
