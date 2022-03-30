(function () {
  'use strict';

  angular
    .module('app.workorder.workorders')
    .controller('ShowEquipmentOperationPopUpController', ShowEquipmentOperationPopUpController);

  /** @ngInject */
  function ShowEquipmentOperationPopUpController($filter, $scope, $mdDialog, $q, WORKORDER, CORE, data,
    WorkorderOperationEmployeeFactory, WorkorderOperationEquipmentFactory, DialogFactory, BaseService, MasterFactory, NotificationSocketFactory) {

    const vm = this;

    let loginUserDetails = BaseService.loginUser;
    vm.data = data;
    vm.operationListRepo = [];
    let _EquipmentOperationList = [];
    vm.EquipmentOperationList = [];
    vm.SearchEquipmentOperationText = null;
    vm.EmptyMesssageOperation = WORKORDER.WORKORDER_EMPTYSTATE.OPERATION;
    let changeObj = {
      isChanged: false
    };
    /*Used to goto equipment list*/
    vm.goToEquipmentList = () => {
      BaseService.goToEquipmentWorkstationList();
    }

    /*Move to equipment page*/
    vm.goToManageEquipmentWorkstation = (equip) => {
      BaseService.goToManageEquipmentWorkstation(equip.eqpID);
    }

    vm.headerdata = [];
    // vm.headerdata.push({ label: 'Equipment Name', value: vm.data.selectedEquipment.assetName, displayOrder: 1 });
    vm.headerdata.push({
      label: 'Equipment Name',
      value: vm.data.selectedEquipment.assetName,
      displayOrder: 1,
      labelLinkFn: vm.goToEquipmentList,
      valueLinkFn: vm.goToManageEquipmentWorkstation,
      valueLinkFnParams: { eqpID: vm.data.selectedEquipment.eqpID },
      isCopy: false
    });

    // [S] Get WO details for notification
    var workorderDetails = null;
    let getWorkorderByID = () => {
      return MasterFactory.getWODetails().query({ woID: data.woID }).$promise.then((response) => {
        if (response && response.data) {
          workorderDetails = response.data;
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    // [E] Get WO details for notification

    /*
     * Author :  Vaibhav Shah
     * Purpose : Get Equipments Details by EqpID
     */
    let GetEquipmentDetailsByEqpID = () => {
      let _objList = {};
      _objList.woID = data.woID;
      _objList.eqpID = vm.data.selectedEquipment.eqpID;
      return WorkorderOperationEquipmentFactory.retriveEquipmentDetailsbyEqpID().query({ listObj: _objList }).$promise.then((equipmentdetails) => {
        vm.data.selectedEquipment = _.first(equipmentdetails.data);
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }


    /*
      * Author :  Vaibhav Shah
      * Purpose : Bind Equipments Operation List
      */
    let BindEquipmentOperationList = () => {
      _EquipmentOperationList = vm.EquipmentOperationList = [];
      vm.cgBusyLoading = WorkorderOperationEmployeeFactory.retriveOperationListbyWoID().query({ woID: data.woID }).$promise.then((operationlist) => {
        vm.operationListRepo = operationlist.data;
        _.each(vm.operationListRepo, (item) => {
          item.opName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, item.opName, item.opNumber);
        });
        _.each(vm.data.selectedEquipment.workorderOperationEquipment, (item) => {
          if (item) {
            let objOp = _.find(vm.operationListRepo, (op) => {
              return op.opID == item.opID;
            });
            if (objOp) {
              objOp.fluxTypeList = [];
              objOp.fluxTypeList.push({
                value: objOp.isFluxNotApplicable, icon: CORE.FluxTypeIcon.notApplicableIcon, toolTip: CORE.FluxTypeToolTip.notApplicable, isShowIcon: true
              });
              objOp.fluxTypeList.push({
                value: objOp.isNoClean, icon: CORE.FluxTypeIcon.noCleanIcon, toolTip: CORE.FluxTypeToolTip.noClean, isShowIcon: true
              });
              objOp.fluxTypeList.push({
                value: objOp.isWaterSoluble, icon: CORE.FluxTypeIcon.waterSolubleIcon, toolTip: CORE.FluxTypeToolTip.waterSoluble, isShowIcon: true
              });
              objOp.isOnline = item.isOnline;
              vm.EquipmentOperationList.push(objOp);
            }
          }
        });
        _EquipmentOperationList = vm.EquipmentOperationList;
        //vm.ALLoperationList = _EquipmentOperationList;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    var cgPromise = [];
    cgPromise = [getWorkorderByID(), GetEquipmentDetailsByEqpID()];
    vm.cgBusyLoading = $q.all(cgPromise).then((responses) => {
      BindEquipmentOperationList();
    });

    /*
       * Author :  Vaibhav Shah
       * Purpose : Search Operation
       */
    vm.SearchOperation = (list, searchText) => {
      if (!searchText) {
        vm.SearchEquipmentOperationText = null;
        vm.EquipmentOperationList = _EquipmentOperationList;
        vm.FilterOperation = true;
        return;
      }
      vm.EquipmentOperationList = $filter('filter')(_EquipmentOperationList, { opName: searchText });
      vm.FilterEquipmentOperationList = vm.EquipmentOperationList.length > 0;
    }

    vm.setFocus = (text) => {
      let someElement = angular.element(document.querySelector('#' + text));
      if (someElement && someElement.length > 0) {
        someElement[0].focus();
      }
    }

    /*
      * Author :  Vaibhav Shah
      * Purpose : Delete Operation from Work Order
      */
    vm.DeleteOperationFromWorkorder = (operation, event) => {
      let obj = {
        title: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM, "Operation"),
        textContent: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM_DETAILS_MESSAGE, "Operation"),
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.confirmDiolog(obj).then((yes) => {
        if (yes) {
          //if (workorderDetails && workorderDetails.woStatus == CORE.WOSTATUS.PUBLISHED) {
          //    openWORevisionPopup(data.woID, function (versionModel) {
          //        // Added for close revision dialog popup
          //        if (versionModel && versionModel.isCancelled) {
          //            return;
          //        }
          //        deleteOperationForEquipment(operation, versionModel);
          //    }, event);
          //}
          //else {
          //    deleteOperationForEquipment(operation);
          //}
          deleteOperationForEquipment(operation);
        }
      }, (cancel) => {
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    function deleteOperationForEquipment(operation, versionModel) {
      let _objList = {};
      let opIDs = [];
      _objList.woID = data.woID;
      opIDs.push(operation.opID);
      _objList.opID = opIDs;
      _objList.woOPID = operation.woOPID;
      _objList.eqpID = vm.data.selectedEquipment.eqpID;
      vm.cgBusyLoading = WorkorderOperationEmployeeFactory.deleteOperationFromWorkOrder().query({ listObj: _objList }).$promise.then((operation) => {
        if (operation && operation.data) {
          if (operation.data.TotalCount && operation.data.TotalCount > 0) {
            BaseService.deleteAlertMessage(operation.data);
          }
          else {
            _.each(opIDs, (_item) => {
              _.remove(_EquipmentOperationList, (o) => {
                return o.opID == _item;
              });
            });
            vm.EquipmentOperationList = _EquipmentOperationList;
            vm.SearchEquipmentOperationText = null;
            changeObj.isChanged = true;

            // Send notification of change to all users
            //sendNotification(versionModel);

            ///* refresh work order header conditionally */
            //if (versionModel && versionModel.woVersion) {
            //    vm.data.refreshWorkOrderHeaderDetails();
            //}
          }
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    /*
     * Author :  Vaibhav Shah
     * Purpose : Add new operation poup
     */
    vm.AddNewOperationToEquipment = (ev) => {
      let data = {};
      data.isFromWOEquipmentList = false;
      data.woID = vm.data.woID;
      data.eqpID = vm.data.selectedEquipment.eqpID;
      data.headerdata = vm.headerdata;
      let listOperation = [];
      _.each(vm.operationListRepo, (_mainOp) => {
        let obj = _.find(_EquipmentOperationList, (_eqp) => {
          return _eqp.opID == _mainOp.opID;
        });
        if (!obj) {
          listOperation.push(_mainOp);
        }
      })
      data.list = listOperation;
      DialogFactory.dialogService(
        WORKORDER.WORKORDER_SHOW_EQUIPMENTLIST_MODAL_CONTROLLER,
        WORKORDER.WORKORDER_SHOW_EQUIPMENTLIST_MODAL_VIEW,
        ev,
        data).then((response) => {
          var val = response[0];
          //var versionModel = response[1];
          if (val) {
            cgPromise = [GetEquipmentDetailsByEqpID()];
            vm.cgBusyLoading = $q.all(cgPromise).then((responses) => {
              BindEquipmentOperationList();
            });
            ///* refresh work order header conditionally */
            //if (versionModel && versionModel.woVersion) {
            //    vm.data.refreshWorkOrderHeaderDetails();
            //}
          }
        }, (val) => {
          if (val) {
            let obj = _.find(vm.operationListRepo, (oprn) => {
              return oprn.opID == val.opID;
            });
            if (obj) {
              _EquipmentOperationList.push(obj);
              vm.EquipmentOperationList = _EquipmentOperationList;
              changeObj.isChanged = true;
            }
          }
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

    //function openWORevisionPopup(ReftypeID, callbackFn, event) {
    //    var model = {
    //        woID: ReftypeID
    //    };
    //    DialogFactory.dialogService(
    //         WORKORDER.WORKORDER_REVISION_POPUP_CONTROLLER,
    //         WORKORDER.WORKORDER_REVISION_POPUP_VIEW,
    //         event,
    //        model).then((versionModel) => {
    //            callbackFn(versionModel);
    //        }, (error) => {
    //            callbackFn();
    //        });
    //}
    // [E] Notification methods

    vm.cancel = () => {
      $mdDialog.cancel(changeObj);
    };

    /* to move at operation update page */
    vm.goToManageOperation = (operationID) => {
      BaseService.goToManageOperation(operationID);
    }
  }
})();
