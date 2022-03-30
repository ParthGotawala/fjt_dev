(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('EditDescriptionPopupController', EditDescriptionPopupController);

  /** @ngInject */
  function EditDescriptionPopupController($mdDialog, data, TRAVELER, BaseService, DialogFactory, WorkorderOperationFactory, CORE, WORKORDER, NotificationSocketFactory, MasterFactory) {
    const vm = this;
    vm.taToolbar = CORE.Toolbar;
    vm.data = data;
    vm.MainTitle = CORE.MainTitle;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;

    /*Close the popup*/
    vm.cancel = () => {
      let isdirty = vm.checkFormDirty(vm.employeeForm);
      if (isdirty) {
        let data = {
          form: vm.employeeForm
        }
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      let checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    }

    let loginUserDetails = BaseService.loginUser;

    var opData = angular.copy(vm.data.opData);

    // [S] Get WO details for notification
    var workorderDetails = null;
    function getWorkorderByID() {
      MasterFactory.getWODetails().query({ woID: vm.data.opData.woID }).$promise.then((response) => {
        if (response && response.data) {
          workorderDetails = response.data;
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    getWorkorderByID();
    // [E] Get WO details for notification

    vm.UpdateOperation = (ev) => {

      if (BaseService.focusRequiredField(vm.employeeForm, false)) {
        return;
      }
      const operationStatus = {
        woOPID: vm.data.opData.woOPID,
        woID: vm.data.opData.woID,
        opID: vm.data.opData.opID,
        opDoes: vm.data.opData.opDoes,
        opDonts: vm.data.opData.opDonts,
        opDescription: vm.data.opData.opDescription,
        opWorkingCondition: vm.data.opData.opWorkingCondition,
        opManagementInstruction: vm.data.opData.opManagementInstruction,
        opDeferredInstruction: vm.data.opData.opDeferredInstruction,
        woNumber: vm.data.opData.woNumber,
        opName: vm.data.opData.opName,
        opTypeForWOOPTimeLineLog: vm.data.opTypeForWOOPTimeLineLog
      }
      if (vm.data.opData.woOPID) {

        if (workorderDetails && workorderDetails.woStatus == CORE.WOSTATUS.PUBLISHED) {

          var isDetailChanged = false;
          if (vm.employeeForm.$dirty) {
            vm.employeeForm.$$controls.forEach((control) => {
              if (control.$dirty && control.$name) {
                if (control.$$controls) {
                  control.$$controls.forEach((childControl) => {
                    if (childControl.$dirty) {
                      //console.log(childControl.$name);
                      isDetailChanged = true;
                    }
                  });
                }
                else {
                  if (control.$$element.is('text-angular')) {
                    if (operationStatus[control.$name] != opData[control.$name]) {
                      //console.log(control.$name);
                      isDetailChanged = true;
                    }
                  }
                  else {
                    //console.log(control.$name);
                    isDetailChanged = true;
                  }
                }
              }
            });
          }

          if (isDetailChanged) {
            openWOOPRevisionPopup(function (versionModel) {
              // Added for close revision dialog popup
              if (versionModel && versionModel.isCancelled) {
                return;
              }
              saveDetails(operationStatus, versionModel);
            }, ev);
          }
          else
            saveDetails(operationStatus);
        }
        else {
          saveDetails(operationStatus);
        }
      }
    }

    function saveDetails(operationStatus, versionModel) {
      //vm.employeeForm.$invalid || !vm.checkFormDirty(vm.employeeForm)
      if (vm.employeeForm.$invalid) {
        BaseService.focusRequiredField(vm.employeeForm);
        return;
      }

      vm.cgBusyLoading = WorkorderOperationFactory.updateOperation().update({
        id: vm.data.opData.woOPID,
      }, operationStatus, (res) => {
        let objMsg = {};
        objMsg.opData = vm.data.opData;
        objMsg.message = CORE.ApiResponseTypeStatus.SUCCESS;
        //vm.cancel(objMsg);
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel(data);

        // Send details change notification using socket.io
        sendNotification(versionModel);

      }, (error) => {
        return BaseService.getErrorLog(error);
      });
    }

    // [S] Notification methods
    function sendNotification(versionModel) {
      if (versionModel) {

        versionModel.employeeID = loginUserDetails.employee.id;
        versionModel.messageType = CORE.NOTIFICATION_MESSAGETYPE.WO_OP_VERSION_CHANGE.TYPE;
        NotificationSocketFactory.sendNotification().save(versionModel).$promise.then((response) => {
          /* empty */
        }).catch((error) => {
          /* empty */
        });
      }
    }

    function openWOOPRevisionPopup(callbackFn, event) {
      var model = {
        woOPID: vm.data.opData.woOPID
      };
      DialogFactory.dialogService(
        WORKORDER.WORKORDER_OPERATION_REVISION_POPUP_CONTROLLER,
        WORKORDER.WORKORDER_OPERATION_REVISION_POPUP_VIEW,
        event,
        model).then((versionModel) => {
          //if (versionModel.opVersion && versionModel.woVersion) {
          //    vm.operation.opVersion = versionModel.opVersion;
          //    vm.operation.workorder.woVersion = versionModel.woVersion;
          //}
          callbackFn(versionModel);
        }, (error) => {
          callbackFn();
        });
    }
    // [E] Notification methods

    /*Used to check max length*/
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    }

    /*Called on load form*/
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.employeeForm);
    });
  }
})();
