(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('operationDodont', operationDodont);

  /** @ngInject */
  function operationDodont(CORE, BaseService, OperationFactory) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        operationData: '='
      },
      templateUrl: 'app/directives/custom/operation-dodont/operation-dodont.html',
      controller: operationDodontCtrl,
      controllerAs: 'vm'
    };

    return directive;

    /** @ngInject */
    function operationDodontCtrl($scope) {
      var vm = this;
      vm.taToolbar = CORE.Toolbar;
      vm.MainTitle = CORE.MainTitle;
      vm.operationId = $scope.operationData.opID ? parseInt($scope.operationData.opID) : null;
      vm.DisplayStatus = CORE.DisplayStatus;

      const initOpBasicDet = () => {
        vm.operation = {
          opDoes: '',
          opDonts: ''
        };
      };

      //convert html text to plain text to calculate max length validation
      vm.htmlToPlaintext = (text) => text ? String(text).replace(/<[^>]+>/gm, '') : '';

      /* called for max length validation */
      vm.getDescrLengthValidation = (maxLength, enteredText) => {
        const enteredPlainText = vm.htmlToPlaintext(enteredText);
        return BaseService.getDescrLengthValidation(maxLength, enteredPlainText.length);
      };

      if (vm.operationId) {
        //vm.operationDetails(vm.operationId);
        vm.operation = $scope.operationData;
      } else {
        initOpBasicDet();
        if (vm.operation.opStatus === vm.DisplayStatus.Draft.ID) {
          $scope.$parent.vm.operationStatusLabel = CORE.OPSTATUSLABLEPUBLISH;
        }
      }

      //Save operation Do's and Don't data - when clicked on Save button
      vm.saveOperationDoDont = () => {
        if (vm.operationInstruction.$dirty) {
          const operationDoesInfo = {
            opID: vm.operation.opID,
            opDoes: vm.operation.opDoes,
            opDonts: vm.operation.opDonts,
            opStatus: vm.operation.opStatus,
            opNumber: vm.operation.opNumber
          };
          if (vm.operation.opID) {
            vm.cgBusyLoading = OperationFactory.operation().update({
              id: vm.operation.opID
            }, operationDoesInfo).$promise.then(() => {
              vm.operationInstruction.$setPristine();
              $scope.$emit('updateOperationDoDontData', operationDoesInfo);
              $scope.$parent.vm.saveDisable = false;
            }).catch((error) => {
              $scope.$parent.vm.saveDisable = false;
              return BaseService.getErrorLog(error);
            });
          }
        }
        else {
          //Update operation status from manage-operations.controller
          $scope.$emit('statusUpdate');
        }
      };

      //Save Operation Do's and Don't Data before tab change
      $scope.$on('saveOperationDoDontTabChanges', (eve, data) => {
          if (data) {
            vm.operation.opStatus = data;
          }
          vm.saveOperationDoDont();
        });

      angular.element(() => {
        BaseService.currentPageForms.push(vm.operationInstruction);
        $scope.$parent.vm.operationInstruction = vm.operationInstruction;
      });
    }
  }
})();
