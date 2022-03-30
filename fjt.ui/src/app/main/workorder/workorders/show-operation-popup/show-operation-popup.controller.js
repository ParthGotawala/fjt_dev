(function () {
  'use strict';

  angular
    .module('app.workorder.workorders')
    .controller('ShowOperationPopUpController', ShowOperationPopUpController);

  /** @ngInject */
  function ShowOperationPopUpController($mdDialog, data, CORE, DialogFactory, WorkorderOperationEmployeeFactory, BaseService, NotificationSocketFactory, WORKORDER, MasterFactory, GenericCategoryConstant, $sce) {
    const vm = this;
    vm.data = data;
    vm.maxAllowOperationNumber = data.maxAllowOperationNumber;
    vm.SelectedOperationList = [];
    vm.SelectedOperationList = data.SelectedOperationList;

    var currentopIDList = _.map(vm.SelectedOperationList, 'opID');

    if (vm.data.isFromWOOperationList) {
      vm.IsFromMasterTemplate = false;
    }
    else {
      vm.IsFromMasterTemplate = true;
    }

    let loginUserDetails = BaseService.loginUser;

    // [S] Get WO details for notification
    var workorderDetails = null;
    function getWorkorderByID() {
      MasterFactory.getWODetails().query({ woID: data.woID }).$promise.then((response) => {
        if (response && response.data) {
          workorderDetails = response.data;
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    getWorkorderByID();
    // [E] Get WO details for notification

    let saveAddRemoveOperationDetails = (event) => {

      if (vm.IsFromMasterTemplate && !vm.masterTemplate) {
        let alertModel = {
          title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
          textContent: stringFormat(CORE.MESSAGE_CONSTANT.SELECT_ONE, "operation management"),
          multiple: true
        };
        DialogFactory.alertDialog(alertModel);
        vm.saveDisable = false;
        return;
      }

      if (!vm.SelectedOperationList || vm.SelectedOperationList.length == 0) {
        var messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContent.message = stringFormat(messageContent.message, "operation");
        let alertModel = {
          messageContent: messageContent,
        };
        DialogFactory.messageAlertDialog(alertModel);
        vm.saveDisable = false;
        return;
      }

      if (workorderDetails && workorderDetails.woStatus == CORE.WOSTATUS.PUBLISHED && vm.SelectedOperationList.length > 0) {
        vm.SelectedOperationList = _.sortBy(vm.SelectedOperationList, 'opNumber');
        let errorMsg = [];
        _.each(vm.SelectedOperationList, (op, index) => {
          /******************** start - case 1 - current operation with rework than previous operation must have 'inspection process' ***********/
          if (op.isRework) {
            /*************** start - 1. if current operation is first operation should not be rework type **********************/
            if (index == 0) {
              errorMsg.push(stringFormat(CORE.MESSAGE_CONSTANT.FIRST_OPERATION_REWORK_INVALID, operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, op.opName, op.opNumber)));
            }
            /*************** end - 1. if current operation is first operation should not be rework type **********************/

            /**************** start - 2. rework operation should not be inspection process ********************************/
            if (op.operationType && op.operationType.gencCategoryName == GenericCategoryConstant.OPERATION_TYPE.INSPECTION_PROCESS.gencCategoryName) {
              errorMsg.push(stringFormat(CORE.MESSAGE_CONSTANT.REWORK_IS_INSPECTION_INVALID, operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, op.opName, op.opNumber)));
            }
            /**************** end - 2. rework operation should not be inspection process ********************************/

            /******************** start - 3. rework operation validation for mfg quantity and issue quantity ****************************/
            if (!op.qtyControl || !op.isIssueQty) {
              errorMsg.push(stringFormat(CORE.MESSAGE_CONSTANT.INVALID_REWORK, operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, op.opName, op.opNumber)));
            }
            /******************** end - 3. rework operation validation for mfg quantity and issue quantity ****************************/

            /********************* start - 4. check rework operation should not be in parallel cluster ***************/
            if (op.isParellelOperation) {
              errorMsg.push(stringFormat(CORE.MESSAGE_CONSTANT.CURRENT_REWORK_NOT_ALLOW, operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, op.opName, op.opNumber)));
            }
            /********************* end - 4. check rework operation should not be in parallel cluster ***************/

            /************** start - 5. check previous operation of rework operation must be inspection or rework only ********/
            let previousObj = vm.SelectedOperationList[index - 1];
            if (previousObj) {
              if ((previousObj.operationType) && (previousObj.operationType.gencCategoryName != GenericCategoryConstant.OPERATION_TYPE.INSPECTION_PROCESS.gencCategoryName && !previousObj.isRework)) {
                errorMsg.push(stringFormat(CORE.MESSAGE_CONSTANT.PREV_OPERATION_INSPECTION_OR_REWORK, operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, op.opName, op.opNumber)));
              }
            } else {
              errorMsg.push(stringFormat(CORE.MESSAGE_CONSTANT.PREV_OPERATION_INSPECTION_OR_REWORK, operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, op.opName, op.opNumber)));
            }
            /************** end - 5. check previous operation of rework operation must be inspection or rework only ********/
          }
          /******************** end - case 1 - current operation with rework than previous operation must have 'inspection process' ***********/
          /******************** start - case 2 - current Operation inspection process **************************/
          if (op.operationType.gencCategoryName == GenericCategoryConstant.OPERATION_TYPE.INSPECTION_PROCESS.gencCategoryName) {
            /************** start - 1. inspection operation should not be rework **************************/
            if (op.isRework) {
              errorMsg.push(stringFormat(CORE.MESSAGE_CONSTANT.REWORK_IS_INSPECTION_INVALID, operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, op.opName, op.opNumber)));
            }
            /************** end - 1. inspection operation should not be rework **************************/

            /****************** start - 2. inspection operation validation for mfg quantity *******************************/
            if (!op.qtyControl) {
              errorMsg.push(stringFormat(CORE.MESSAGE_CONSTANT.INVALID_INSPECTION, operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, op.opName, op.opNumber)));
            }
            /***************** end - 2. inspection operation validation for mfg quantity ******************************/

            /****************** start - 3. check inspection operation next operation must be rework only *******************************/
            if (!op.isParellelOperation) {
              let nextObj = vm.SelectedOperationList[index + 1];
              if (nextObj) {
                if (!nextObj.isRework) {
                  errorMsg.push(stringFormat(CORE.MESSAGE_CONSTANT.NEXT_OPERATION_REWORK, operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, op.opName, op.opNumber)));
                }
              } else {
                errorMsg.push(stringFormat(CORE.MESSAGE_CONSTANT.NEXT_OPERATION_REWORK, operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, op.opName, op.opNumber)));
              }
            }
            /***************** end - 3. check inspection operation next operation must be rework only ******************************/
          }
          /******************** end - case 2 - current Operation inspection process **************************/
        });
        if (errorMsg.length > 0) {
          let model = {
            title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
            textContent: $sce.trustAsHtml(errorMsg.join('<br/>')),
            multiple: true
          };
          DialogFactory.alertDialog(model);
          vm.saveDisable = false;
          return false;
        }
      }
      let obj = {
        masterTemplate: vm.masterTemplate,
        SelectedOperationList: vm.SelectedOperationList
      };
      let _objList = {};
      _objList.woID = vm.data.woID;
      _objList.woNumber = vm.data.woNumber;
      _objList.opIDs = _.map(vm.SelectedOperationList, 'opID');
      _objList.masterTemplateMasterID = vm.masterTemplate ? vm.masterTemplate.id : null;

      // check if any changes into operations
      var newOPIDList = _.difference(_objList.opIDs, currentopIDList);
      var removedOPIDList = _.difference(currentopIDList, _objList.opIDs);

      if ((newOPIDList.length || removedOPIDList.length) && workorderDetails && workorderDetails.woStatus == CORE.WOSTATUS.PUBLISHED) {
        openWORevisionPopup(data.woID, function (versionModel) {
          // Added for close revision dialog popup
          if (versionModel && versionModel.isCancelled) {
            return;
          }
          saveOperation(_objList, obj, versionModel);
        }, event);
      }
      else {
        saveOperation(_objList, obj);
      }
    }

    function saveOperation(_objList, obj, versionModel) {
      vm.cgBusyLoading = WorkorderOperationEmployeeFactory.saveWorkorderOperation_Employee().save({ listObj: _objList }).$promise.then((res) => {
        $mdDialog.hide([obj, versionModel]);

        // Send notification of change to all users
        sendNotification(versionModel);

        /* refresh work order header conditionally */
        if (versionModel && versionModel.woVersion) {
          vm.data.refreshWorkOrderHeaderDetails();
        }
        vm.saveDisable = false;
      }).catch((error) => {
        vm.saveDisable = false;
        return BaseService.getErrorLog(error);
      });
    }

    vm.save = (event) => {
      vm.saveDisable = true;
      if (BaseService.focusRequiredField(vm.employeeForm, false)) {
        vm.saveDisable = false;
        return;
      }

      // take confirmation for remove operation items from drag drop options
      let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.STANDARD_CHANGE_CONFIRMATION_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, CORE.MainTitle.Operations);
        let obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((res) => {
          if (res) {
            saveAddRemoveOperationDetails(event);
          }
        }, (cancel) => {
          vm.saveDisable = false;
          return false;
        }).catch((error) => {
          vm.saveDisable = false;
          return BaseService.getErrorLog(error);
        });
    }

    // [S] Notification methods
    function sendNotification(versionModel) {
      if (versionModel) {

        versionModel.employeeID = loginUserDetails.employee.id;
        versionModel.messageType = CORE.NOTIFICATION_MESSAGETYPE.WO_VERSION_CHANGE.TYPE;
        NotificationSocketFactory.sendNotification().save(versionModel).$promise.then((response) => {
          /* empty */
        }).catch((error) => {
          /* empty */
        });
      }
    }

    function openWORevisionPopup(ReftypeID, callbackFn, event) {
      var model = {
        woID: ReftypeID
      };
      DialogFactory.dialogService(
        WORKORDER.WORKORDER_REVISION_POPUP_CONTROLLER,
        WORKORDER.WORKORDER_REVISION_POPUP_VIEW,
        event,
        model).then((versionModel) => {
          callbackFn(versionModel);
        }, (error) => {
          callbackFn();
        });
    }
    // [E] Notification methods

    vm.cancel = () => {
      if (vm.employeeForm.$dirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      }
      else {
        $mdDialog.cancel();
      }
    };

    //// to check form dirty
    //vm.checkFormDirty = (form, columnName) => {
    //  let result = BaseService.checkFormDirty(form, columnName);
    //  return result;
    //}
  }
})();
