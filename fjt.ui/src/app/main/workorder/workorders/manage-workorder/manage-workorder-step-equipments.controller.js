(function () {
  'use strict';

  angular
    .module('app.workorder.workorders')
    .controller('ManageWorkorderEquipmentsController', ManageWorkorderEquipmentsController);

  /** @ngInject */
  function ManageWorkorderEquipmentsController($scope, $timeout, $filter,
    CORE, USER, WORKORDER, $mdDialog, $state,
    WorkorderOperationEquipmentFactory, WorkorderOperationEmployeeFactory, BaseService, DialogFactory, socketConnectionService) {
    // Don't Remove this code
    // Don't add any code before this
    if (!$scope.$parent.$parent.vm.workorder || !$scope.$parent.$parent.vm.workorder.woID) {
      $state.go(WORKORDER.MANAGE_WORKORDER_DETAILS_STATE, { woID: null });
      return;
    }
    $scope.vm = $scope.$parent.$parent.vm;
    //Add form name for check form dirty
    $scope.vm.CurrentForm = null;
    let vm = $scope.vm;
    // add code after this only
    // Don't Remove this code

    vm.EmptyMesssageEquipment = WORKORDER.WORKORDER_EMPTYSTATE.ASSIGNEQUIPMENTS;
    vm.EmptyMesssageForOperationNotAdded = WORKORDER.WORKORDER_EMPTYSTATE.OPERATION;

    // Restrict changes into all fields if work order status is 'under termination'
    //vm.isWOUnderTermination = (vm.workorder.woStatus == CORE.WOSTATUS.UNDER_TERMINATION || vm.workorder.woStatus == CORE.WOSTATUS.TERMINATED);

    /*Move to equipment page*/
    vm.goToManageEquipmentWorkstation = (equip) => {
      BaseService.goToManageEquipmentWorkstation(equip.eqpID);
    }

    let _EquipmentListRepo = [];
    vm.SelectAllEqp = false;

    let _SelectedEquipmentList = [];
    vm.SelectedEquipmentList = [];
    /*
     * Author :  Vaibhav Shah
     * Purpose : Get All Equipments list for woID
     */
    let GetEquipmentListByWoID = (msWizard) => {
      vm.SearchSelectedEquipmentTxt = null;
      vm.SelectAllEqp = false;
      _SelectedEquipmentList = vm.SelectedEquipmentList = [];
      vm.cgBusyLoading = WorkorderOperationEquipmentFactory.retriveEquipmentListbyWoID().query({ woID: vm.workorder.woID }).$promise.then((equipmentlist) => {
        _EquipmentListRepo = equipmentlist.data;
        _.each(equipmentlist.data, (item) => {
          if (item.genericFiles) {
            item.ProfilePic = CORE.WEB_URL + USER.EQUIPMENT_BASE_PATH + item.genericFiles.gencFileName;
          }
          else {
            item.ProfilePic = CORE.WEB_URL + USER.EQUIPMENT_DEFAULT_IMAGE_PATH + 'profile.jpg';
          }
          if (item.workorderOperationEquipment.length > 0) {
            item.totalQty = _.sumBy(item.workorderOperationEquipment, function (o) { return o.qty ? o.qty : 0; });
            item.isOnline = _.find(item.workorderOperationEquipment, { 'isOnline': true }) ? true : false;
            vm.SelectedEquipmentList.push(item);
          }
        });
        _SelectedEquipmentList = vm.SelectedEquipmentList;
        vm.isDiplaySearFilterForWOEquipment = _SelectedEquipmentList.length > 0 ? true : false;
        if (msWizard) {
          //msWizard.nextStep();
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    /*
    * Author :  Vaibhav Shah
    * Purpose : Onclick of step 4 Select Equipments
    */
    vm.getWorkorderEquipmentList = () => {
      $timeout(() => {
        GetEquipmentListByWoID();
      }, _configSelectListTimeout)
    }

    /*
     * Author :  Vaibhav Shah
     * Purpose : Delete equipment from operation list for workorder
     */
    vm.DeleteEquipmentFromWorkorder = (equipment, type, event) => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }
      let obj = {
        title: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM, "Equipments"),
        textContent: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM_DETAILS_MESSAGE, "Equipments"),
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.confirmDiolog(obj).then((res) => {
        if (res) {
          //if (vm.workorder.woStatus == CORE.WOSTATUS.PUBLISHED) {
          //  vm.openWORevisionPopup(function (versionModel) {
          //    // Added for close revision dialog popup
          //    if (versionModel && versionModel.isCancelled) {
          //      return;
          //    }
          //    removeEquipmentFromWorkorder(equipment, type, versionModel);
          //  }, event);
          //}
          //else {
          //  removeEquipmentFromWorkorder(equipment, type);
          //}
          removeEquipmentFromWorkorder(equipment, type);
        }
      }, (cancel) => {
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    function removeEquipmentFromWorkorder(equipment, type, versionModel) {
      let _objList = {};
      _objList.woID = vm.workorder.woID;
      let eqpIDs = [];
      let woOPID = [];
      if (type == "Multiple") {
        eqpIDs.push(equipment.eqpID);
        _objList.eqpID = equipment.eqpID;
        _objList.woOPID = equipment.woOPID;
      } else {
        eqpIDs.push(equipment.eqpID);
        _objList.eqpID = equipment.eqpID;
        _.each(equipment.workorderOperationEquipment, (item) => {
          woOPID.push(item.woOPID);
        });
        _objList.woOPID = woOPID;
      }

      vm.cgBusyLoading = WorkorderOperationEmployeeFactory.deleteOperationFromWorkOrder().query({ listObj: _objList }).$promise.then((equipment) => {

        if (equipment && equipment.data) {
          if (equipment.data.TotalCount && equipment.data.TotalCount > 0) {
            BaseService.deleteAlertMessage(equipment.data);
          }
          else {
            if (type == "Multiple") {
              eqpIDs = _.first(eqpIDs);
              _.each(eqpIDs, (item) => {
                _.remove(_SelectedEquipmentList, (ep) => { return ep.eqpID == item; });
              });
            } else {
              _.remove(_SelectedEquipmentList, (ep) => { return ep.eqpID == eqpIDs; });
            }
            GetEquipmentListByWoID();
            ////_SelectedEquipmentList = vm.SelectedEquipmentList;
            //vm.SelectedEquipmentList = _SelectedEquipmentList;
            //vm.isDiplaySearFilterForWOEquipment = _SelectedEquipmentList.length > 0 ? true : false;
            //vm.SelectAllEqp = true;
            //vm.SelectAllEquipment();
            //vm.SearchSelectedEquipmentTxt = null;

            // Send details change notification using socket.io
            vm.sendNotification(versionModel);

            /* refresh work order header conditionally */
            if (versionModel && versionModel.woVersion) {
              vm.refreshWorkOrderHeaderDetails();
            }
          }
        }

      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    /*
     * Author :  Vaibhav Shah
     * Purpose : View Associate Operation For Work Order
     */
    vm.ViewOperationByEquipmentFromWorkorder = (equipment, ev) => {
      let data = {};
      data.woID = vm.workorder.woID;
      data.selectedEquipment = angular.copy(equipment);
      data.refreshWorkOrderHeaderDetails = vm.refreshWorkOrderHeaderDetails;
      data.isWoInSpecificStatusNotAllowedToChange = vm.isWoInSpecificStatusNotAllowedToChange;
      DialogFactory.dialogService(
        WORKORDER.WORKORDER_SHOWEQUIPMENT_OPERATION_MODAL_CONTROLLER,
        WORKORDER.WORKORDER_SHOWEQUIPMENT_OPERATION_MODAL_VIEW,
        ev,
        data).then(() => {
        }, (val) => {
          if (val) {
            if (val && val.isChanged) {
              vm.SelectedEquipmentList.push(val);
              _SelectedEquipmentList = vm.SelectedEquipmentList;
              vm.isDiplaySearFilterForWOEquipment = _SelectedEquipmentList.length > 0 ? true : false;
            }
            GetEquipmentListByWoID();
          }
        }, (err) => {
          return BaseService.getErrorLog(err);
        });
    }

    /*
    * Author :  Vaibhav Shah
    * Purpose : Add new equipment popup
    */
    vm.AddNewEquipmentToWorkOrder = (ev) => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }
      let data = {};
      data.isFromWOEquipmentList = true;
      data.woID = vm.workorder.woID;
      let listOperation = [];
      let alreadyAddedEqpIDs = [];
      _.each(_EquipmentListRepo, (eqpt) => {
        let obj = _.find(_SelectedEquipmentList, (_eqp) => {
          return _eqp.eqpID == eqpt.eqpID;
        });
        if (!obj) {
          if (eqpt.isActive)
            listOperation.push(eqpt);
        }
        else {
          alreadyAddedEqpIDs.push(obj.eqpID);
        }
      });
      data.list = listOperation;
      data.alreadyAddedEqpIDsInWo = alreadyAddedEqpIDs;
      data.headerdata = {
        woNumber: vm.workorder.woNumber ? vm.workorder.woNumber : null,
        PIDCode: (vm.workorder.componentAssembly && vm.workorder.componentAssembly.PIDCode) ? vm.workorder.componentAssembly.PIDCode : null,
        partID: vm.workorder.partID ? vm.workorder.partID : null,
        rohsIcon: (vm.workorder.rohs && vm.workorder.rohs.rohsIcon) ? (CORE.WEB_URL + USER.ROHS_BASE_PATH + vm.workorder.rohs.rohsIcon) : null,
        rohsName: (vm.workorder.rohs && vm.workorder.rohs.name) ? vm.workorder.rohs.name : null
      };
      DialogFactory.dialogService(
        WORKORDER.WORKORDER_SHOW_EQUIPMENTLIST_MODAL_CONTROLLER,
        WORKORDER.WORKORDER_SHOW_EQUIPMENTLIST_MODAL_VIEW,
        ev,
        data).then((response) => {
          if (response) {
            var val = response[0];
            if (val) {
              GetEquipmentListByWoID();
            }
          }
        }, () => {
        }, (err) => {
          return BaseService.getErrorLog(err);
        });
    }
    /*
    * Author :  Vaibhav Shah
    * Purpose : Search Equipments from Selected Equipments List
    */
    vm.SearchSelectedEquipment = (list, searchText) => {
      if (!searchText) {
        vm.SearchSelectedEquipmentTxt = null;
        vm.SelectedEquipmentList = _SelectedEquipmentList;
        vm.FilterSelectedEquipment = true;
        return;
      }
      vm.SelectedEquipmentList = $filter('filter')(_SelectedEquipmentList, { assetName: searchText });
      vm.FilterSelectedEquipment = vm.SelectedEquipmentList.length > 0;
    }
    /*
    * Author :  Vaibhav Shah
    * Purpose : Get Selected Equipments Count
    */
    vm.getSelectedEquipmentCount = () => {
      vm.selectedEqpList = {}
      let objList = [];
      let eqpID = [];
      let woOPID = [];
      objList = _.filter(vm.SelectedEquipmentList, (eqp) => { return eqp.selected == true; });

      eqpID = _.map(objList, 'eqpID');

      _.each(objList, (item) => {
        woOPID.push(_.map(item.workorderOperationEquipment, 'woOPID'));
      });

      vm.selectedEqpList = {
        eqpID: eqpID,
        woOPID: woOPID
      }

      let cnt = vm.SelectedEquipmentList.length;
      let objcnt = objList.length;
      if (objcnt < cnt) {
        vm.SelectAllEqp = false;
      }
      else {
        vm.SelectAllEqp = true;
      }
      return objList.length;
    }

    /*
    * Author :  Vaibhav Shah
    * Purpose : Select All Equipments
    */
    vm.SelectAllEquipment = () => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }
      vm.SelectAllEqp = !vm.SelectAllEqp;
      if (vm.SelectAllEqp) {
        _.each(vm.SelectedEquipmentList, (em) => { em.selected = true; });
      }
      else {
        _.each(vm.SelectedEquipmentList, (em) => { em.selected = false; });
      }
    }

    vm.moveToAddOperationsTab = () => {
      $('.jstree').jstree(true).deselect_all(true);
      $('.jstree').jstree(true).select_node(CORE.Workorder_Tabs.Operations.ID);
    }

    vm.getWorkorderEquipmentList();

    //close popup on page destroy 
    $scope.$on('$destroy', function () {
      $mdDialog.hide(false, {
        closeAll: true
      });
    });
    // [S] Socket Listeners
    function connectSocket() {
      socketConnectionService.on('message:receive', notificationReceiveListener);
    }
    connectSocket();

    socketConnectionService.on('reconnect', () => {
      connectSocket();
    });
    function removeSocketListener() {
      socketConnectionService.removeListener('message:receive', notificationReceiveListener);
    }


    function notificationReceiveListener(message) { $timeout(notificationReceive(message)); }

    function notificationReceive(message) {
      switch (message.event) {
        case CORE.NOTIFICATION_MESSAGETYPE.EQUIPMENT_ONLINE.TYPE:
        case CORE.NOTIFICATION_MESSAGETYPE.EQUIPMENT_OFFLINE.TYPE: {
          _.each(vm.SelectedEquipmentList, (eqp) => {
            let findObj = _.find(eqp.workorderOperationEquipment, { 'woOpEqpID': message.data.operationObj.woOpEqpID });
            if (findObj) {
              findObj.isOnline = message.data.operationObj.isOnline;
            }
            eqp.isOnline = _.find(eqp.workorderOperationEquipment, { 'isOnline': true }) ? true : false;
          });
          break;
        }
      }
    }
    // on disconnect socket.io
    socketConnectionService.on('disconnect', function () {
      removeSocketListener();
    });

    $scope.$on('$destroy', function () {
      // Remove socket listeners
      removeSocketListener();
    });
    // [E] Socket Listeners
  };
})();
