(function () {
  'use strict';

  angular
    .module('app.workorder.workorders')
    .controller('ShowEquipmentListPopUpController', ShowEquipmentListPopUpController);

  /** @ngInject */
  function ShowEquipmentListPopUpController($filter, $scope, $q, $mdDialog, WORKORDER, data, USER, CORE, OPERATION,
    EquipmentFactory, WorkorderOperationFactory, WorkorderOperationEquipmentFactory, DialogFactory, BaseService, NotificationSocketFactory, MasterFactory) {
    const vm = this;
    vm.data = data;
    vm.EmptyMesssage = WORKORDER.WORKORDER_EMPTYSTATE.OPERATION;
    vm.headeTitle = vm.data.isFromWOEquipmentList ? CORE.LabelConstant.Equipment.PageName : CORE.LabelConstant.Operation.PageName;
    var cgPromise = [];

    let loginUserDetails = BaseService.loginUser;

    /* goto Assembly List Page */
    vm.goToAssemblyList = () => {
      BaseService.goToPartList();
      return false;
    };
    /* goto assembly detail page */
    vm.goToAssemblyDetails = () => {
        BaseService.goToComponentDetailTab(null, data.headerdata.partID);
      return false;
    };
    /* go to workorder list */
    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
      return false;
    };
    /* go to particular workorder detail */
    vm.goToWorkorderDetails = () => {
      BaseService.goToWorkorderDetails(data.woID);
      return false;
    };
    if (data.isFromWOEquipmentList) {
      // toDo for header of supplies material & tool selection
      vm.headerdata = [];
      vm.headerdata.push({
        value: data.headerdata.PIDCode,
        label: CORE.LabelConstant.Assembly.ID,
        displayOrder: (vm.headerdata.length + 1),
        labelLinkFn: vm.goToAssemblyList,
        valueLinkFn: vm.goToAssemblyDetails,
        isCopy: true,
        imgParms: {
          imgPath: data.headerdata.rohsIcon,
          imgDetail: data.headerdata.rohsName
        }
      }, {
        value: data.headerdata.woNumber,
        label: CORE.LabelConstant.Workorder.WO,
        displayOrder: (vm.headerdata.length + 1),
        labelLinkFn: vm.goToWorkorderList,
        valueLinkFn: data.woID ? vm.goToWorkorderDetails : null
      });
    } else {
      // todo for header of operation selection
      vm.headerdata = data.headerdata;
    }
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
    //getWorkorderByID();
    // [E] Get WO details for notification

    //Get Equipments List
    vm.getEquipmentList = () => {
      vm.EquipmentList = [];
      return EquipmentFactory.getequipmentlist().query().$promise.then((equipment) => {
        if (vm.data.alreadyAddedEqpIDsInWo && vm.data.alreadyAddedEqpIDsInWo.length > 0) {
          /* in refresh auto complete case - remove already added equipement */
          equipment.data = equipment.data.filter(o1 => !vm.data.alreadyAddedEqpIDsInWo.some(o2 => o1.eqpID === o2));
        }
        //equipment.data = _.filter(equipment.data, { 'equipmentAs': "E" });
        _.each(equipment.data, (item) => {
          let eqpMake = "";
          let eqpModel = "";
          let eqpYear = "";
          eqpMake = item.eqpMake ? '(' + item.eqpMake : '-';
          eqpModel = item.eqpModel ? '|' + item.eqpModel : '-';
          eqpYear = item.eqpYear ? '|' + item.eqpYear + ')' : '-';
          item.eqipmentName = item.assetName + ' ' + eqpMake + eqpModel + eqpYear;
        });
        vm.EquipmentList = equipment.data;
        return $q.resolve(vm.EquipmentList);
        //if (vm.NewEquipmentId) {
        //    let objectEquipment = _.find(equipment.data.equipment, (lstItem) => { return vm.NewEquipmentId == lstItem.eqpID });
        //    vm.EquipmentList.push(objectEquipment);
        //    vm.selectedEquipment = _.find(vm.EquipmentList, (equipment) => {
        //        return equipment.eqpID == vm.NewEquipmentId;
        //    });
        //}
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    vm.getOperationList = () => {
      vm.WoOperationList = [];
      vm.cgBusyLoading = WorkorderOperationFactory.retriveOPListbyWoID().query({ woID: data.woID }).$promise.then((operationlist) => {
        _.each(operationlist.data, (item) => {
          item.opName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, item.opName, item.opNumber);
          item.fluxTypeList = [];
          item.fluxTypeList.push({
            value: item.isFluxNotApplicable, icon: CORE.FluxTypeIcon.notApplicableIcon, toolTip: CORE.FluxTypeToolTip.notApplicable, isShowIcon: true
          });
          item.fluxTypeList.push({
            value: item.isNoClean, icon: CORE.FluxTypeIcon.noCleanIcon, toolTip: CORE.FluxTypeToolTip.noClean, isShowIcon: true
          });
          item.fluxTypeList.push({
            value: item.isWaterSoluble, icon: CORE.FluxTypeIcon.waterSolubleIcon, toolTip: CORE.FluxTypeToolTip.waterSoluble, isShowIcon: true
          });
        });
        vm.WoOperationList = operationlist.data;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    let initAutoComplete = () => {
      vm.autoCompleteEquipment = {
        columnName: 'eqipmentName',
        controllerName: USER.ADMIN_EQUIPMENT_ADD_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_EQUIPMENT_ADD_MODAL_VIEW,
        keyColumnName: 'eqpID',
        keyColumnId: vm.selectedEquipmentID ? vm.selectedEquipmentID : null,
        inputName: 'Equipment',
        placeholderName: 'Equipment',
        isDisabled: vm.data.isFromWOEquipmentList ? false : true,
        isRequired: true,
        isAddnew: true,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_MANAGEEQUIPMENT_STATE],
          pageNameAccessLabel: CORE.PageName.equipments
        },
        callbackFn: vm.getEquipmentList
      };
    }

    if (!vm.data.isFromWOEquipmentList) {
      cgPromise = [getWorkorderByID(), vm.getEquipmentList()];
      vm.cgBusyLoading = $q.all(cgPromise).then((responses) => {
        vm.selectedEquipmentID = vm.data.eqpID;
        _.each(data.list, (item) => {
          item.fluxTypeList = [];
          item.fluxTypeList.push({
            value: item.isFluxNotApplicable, icon: CORE.FluxTypeIcon.notApplicableIcon, toolTip: CORE.FluxTypeToolTip.notApplicable, isShowIcon: true
          });
          item.fluxTypeList.push({
            value: item.isNoClean, icon: CORE.FluxTypeIcon.noCleanIcon, toolTip: CORE.FluxTypeToolTip.noClean, isShowIcon: true
          });
          item.fluxTypeList.push({
            value: item.isWaterSoluble, icon: CORE.FluxTypeIcon.waterSolubleIcon, toolTip: CORE.FluxTypeToolTip.waterSoluble, isShowIcon: true
          });
        });
        vm.WoOperationList = data.list;
        initAutoComplete();
      });
    } else {
      cgPromise = [getWorkorderByID(), vm.getEquipmentList(), vm.getOperationList()];
      vm.cgBusyLoading = $q.all(cgPromise).then((responses) => {
        initAutoComplete();
      });
      //if (vm.data.list) {
      //    _.each(vm.data.list, (item) => {
      //        let eqpMake = "";
      //        let eqpModel = "";
      //        let eqpYear = "";
      //        eqpMake = item.eqpMake ? '(' + item.eqpMake : '-';
      //        eqpModel = item.eqpModel ? '|' + item.eqpModel : '-';
      //        eqpYear = item.eqpYear ? '|' + item.eqpYear + ')' : '-';
      //        item.eqipmentName = item.assetName + ' ' + eqpMake + eqpModel + eqpYear;
      //    });
      //    vm.EquipmentList = vm.data.list;
      //}
    }
    vm.save = (event) => {
      vm.saveDisable = true;
      if (BaseService.focusRequiredField(vm.equipmentForm, false)) {
        vm.saveDisable = false;
        return;
      }

      if (vm.WoOperationList.length > 0) {
        let opSelectedlist = _.filter(vm.WoOperationList, (op) => { return op.selected == true; });
        let op_eqp_list = [];
        _.each(opSelectedlist, (item) => {
          let obj = {};
          obj.woID = vm.data.woID;
          obj.opID = item.opID;
          obj.woOPID = item.woOPID;
          obj.eqpID = vm.autoCompleteEquipment.keyColumnId ? vm.autoCompleteEquipment.keyColumnId : null;
          op_eqp_list.push(obj);
        });
        if (op_eqp_list.length > 0) {
          addNewEquipment(op_eqp_list);
          //if (workorderDetails && workorderDetails.woStatus == CORE.WOSTATUS.PUBLISHED) {
          //  openWORevisionPopup(data.woID, function (versionModel) {
          //    // Added for close revision dialog popup
          //    if (versionModel && versionModel.isCancelled) {
          //      vm.saveDisable = false;
          //      return;
          //    }
          //    addNewEquipment(op_eqp_list, versionModel);
          //  }, event);
          //}
          //else {
          //  addNewEquipment(op_eqp_list);
          //}
        } else {
          DialogFactory.alertDialog({ title: CORE.MESSAGE_CONSTANT.ALERT_HEADER, textContent: CORE.MESSAGE_CONSTANT.SELECET_OPERATION, multiple: true });
          vm.saveDisable = false;
        }
      }
      else {
        DialogFactory.alertDialog({
          title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
          textContent: vm.EmptyMesssage.NO_SELECTED,
          multiple: true
        });
        vm.saveDisable = false;
      }
    }

    function addNewOperationForEquipment(versionModel) {
      if (vm.autoCompleteOperation.keyColumnId) {
        let findWoOperation = _.find(vm.OperationList, (op) => {
          return op.opID == vm.autoCompleteOperation.keyColumnId;
        });
        if (findWoOperation)
          vm.selectedWoOPID = findWoOperation.woOPID;
      }
      let op_eqp_list = [];
      let obj = {};
      obj.woID = vm.data.woID;
      obj.opID = vm.autoCompleteOperation.keyColumnId ? vm.autoCompleteOperation.keyColumnId : null;
      obj.eqpID = vm.data.eqpID;
      obj.woOPID = vm.selectedWoOPID;
      op_eqp_list.push(obj);
      vm.cgBusyLoading = WorkorderOperationEquipmentFactory.addEquipmentToWorkOrder().query({ listObj: op_eqp_list }).$promise.then((equipment) => {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel(obj);
        // Send notification of change to all users
        sendNotification(versionModel);

      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    function addNewEquipment(op_eqp_list, versionModel) {
      vm.cgBusyLoading = WorkorderOperationEquipmentFactory.addEquipmentToWorkOrder().query({
        listObj: op_eqp_list
      }).$promise.then((equipment) => {
        let obj = _.find(vm.EquipmentList, (eqp) => {
          return eqp.eqpID == vm.autoCompleteEquipment.keyColumnId;
        });
        if (obj) {
          obj.selected = false;
          BaseService.currentPagePopupForm.pop();
          $mdDialog.hide([obj, versionModel]);

          // Send notification of change to all users
          sendNotification(versionModel);
        }
        vm.saveDisable = false;
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
          vm.saveDisable = false;
        });
      }
    }

    //function openWORevisionPopup(ReftypeID, callbackFn, event) {
    //  var model = {
    //    woID: ReftypeID
    //  };
    //  DialogFactory.dialogService(
    //    WORKORDER.WORKORDER_REVISION_POPUP_CONTROLLER,
    //    WORKORDER.WORKORDER_REVISION_POPUP_VIEW,
    //    event,
    //    model).then((versionModel) => {
    //      callbackFn(versionModel);
    //    }, (error) => {
    //      callbackFn();
    //    });
    //}
    // [E] Notification methods

    vm.cancel = () => {
      let isdirty = vm.checkFormDirty(vm.equipmentForm);
      if (isdirty) {
        let data = {
          form: vm.equipmentForm
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



    //Redirect to operation master
    vm.goToOperationList = () => {
      BaseService.openInNew(OPERATION.OPERATION_OPERATIONS_STATE, {});
    }
    //Redirect to equipment master
    vm.goToEquipmentList = () => {
      BaseService.openInNew(USER.ADMIN_EQUIPMENT_STATE, {});
    }

    /*
    * Author :  Vaibhav Shah
    * Purpose : Select All Operations
    */
    vm.SelectAllOp = false;
    vm.SelectAllOperation = () => {
      vm.SelectAllOp = !vm.SelectAllOp;
      if (vm.SelectAllOp) {
        _.each(vm.WoOperationList, (em) => { em.selected = true; });
      }
      else {
        _.each(vm.WoOperationList, (em) => { em.selected = false; });
      }
      if (vm.equipmentForm && vm.WoOperationList.length > 0 && vm.equipmentForm.chkbOp) {
        vm.equipmentForm.$setDirty();
        vm.equipmentForm.chkbOp.$setDirty();
      }
    }

    // set select all/deselect
    vm.AddToSelectedOperation = () => {
      let opCount = _.countBy(vm.WoOperationList, (op) => { return op.selected == true });
      if (opCount[true] == vm.WoOperationList.length) {
        vm.SelectAllOp = true;
      } else {
        vm.SelectAllOp = false;
      }
    }

    /* to move at operation update page */
    vm.goToManageOperation = (operationID) => {
      BaseService.goToManageOperation(operationID);
    }

    //on load submit form
    angular.element(() => {
      //check load
      BaseService.currentPagePopupForm.push(vm.equipmentForm);
    });
  }
})();
