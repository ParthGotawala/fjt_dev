(function () {
  'use strict';

  angular
    .module('app.workorder.workorders')
    .controller('WorkorderOperationDoDontsController', WorkorderOperationDoDontsController);

  /** @ngInject */
  function WorkorderOperationDoDontsController($scope,
    CORE, WorkorderOperationFactory, BaseService) {
    // Don't Remove this code
    // Don't add any code before this
    $scope.vm = $scope.$parent.$parent.vm;
    //Add form name for check form dirty
    $scope.vm.CurrentForm = 'frmOperationInstruction';
    let vm = $scope.vm;
    // add code after this only
    // Don't Remove this code

    // Restrict changes into all fields if work order status is 'under termination'
    //vm.isWOUnderTermination = (vm.operation.workorder.woStatus == CORE.WOSTATUS.UNDER_TERMINATION || vm.operation.workorder.woStatus == CORE.WOSTATUS.TERMINATED);

    let saveOperationDoesInfo = (versionModel) => {
      const operationDoesInfo = {
        woOPID: vm.operation.woOPID,
        woID: vm.operation.woID,
        opID: vm.operation.opID,
        opDoes: vm.operation.opDoes,
        opDonts: vm.operation.opDonts,
        woNumber: vm.operation.workorder.woNumber,
        opName: vm.operation.opName,
        opTypeForWOOPTimeLineLog: CORE.Operations_Type_For_WOOPTimeLineLog.DosAndDonts
      };

      if (vm.operation.woOPID) {
        vm.cgBusyLoading = WorkorderOperationFactory.updateOperation().update({
          id: vm.operation.woOPID,
        }, operationDoesInfo).$promise.then((res) => {
          //vm.getOperationDocuments();
          vm.sendNotification(versionModel);
          vm.frmOperationInstruction.$setPristine();
          if (versionModel && (versionModel.woVersion || versionModel.opVersion)) {
            vm.refreshWorkOrderHeaderDetails();
          }
          vm.saveDisable = false;
        }).catch((error) => {
          vm.saveDisable = false;
          return BaseService.getErrorLog(error);
        });
      }
    }

    vm.SaveWorkorderOperationInstruction = (event) => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }
      vm.saveDisable = true;
      if (BaseService.focusRequiredField(vm.frmOperationInstruction, false)) {
        vm.saveDisable = false;
        return;
      }

      if (vm.operation.workorder.woStatus == CORE.WOSTATUS.PUBLISHED) {
        var isOperationDetailsChanged = false;
        if (vm.frmOperationInstruction.$dirty) {
          vm.frmOperationInstruction.$$controls.forEach((control) => {
            if (control.$dirty && control.$name) {
              if (control.$$controls) {
                control.$$controls.forEach((childControl) => {
                  if (childControl.$dirty) {
                    //console.log(childControl.$name);
                    isOperationDetailsChanged = true;
                  }
                });
              }
              else {
                if (control.$$element.is('text-angular')) {
                  if (vm.operation[control.$name] != vm.operationMain[control.$name]) {
                    //console.log(control.$name);
                    isOperationDetailsChanged = true;
                  }
                }
                else {
                  //console.log(control.$name);
                  isOperationDetailsChanged = true;
                }
              }
            }
          });
        }

        if (isOperationDetailsChanged) {
          vm.saveDisable = false;
          vm.openWOOPRevisionPopup(function (versionModel) {
            // Added for close revision dialog popup
            if (versionModel && versionModel.isCancelled) {
              return;
            }
            if (versionModel) {
              saveOperationDoesInfo(versionModel);
            }
            else {
              saveOperationDoesInfo();
            }
          }, event);
        }
        else
          saveOperationDoesInfo();
      }
      else
        saveOperationDoesInfo();
    }

    /* called for max length validation */
    vm.getDescrLengthValidation = (maxLength, enterTextLength) => {
      vm.entertext = vm.htmlToPlaintext(enterTextLength)
      return BaseService.getDescrLengthValidation(maxLength, vm.entertext.length);
    }
  };
  //angular
  //   .module('app.workorder.workorders').WorkorderOperationDoDontsController = function () {
  //   };
})();
