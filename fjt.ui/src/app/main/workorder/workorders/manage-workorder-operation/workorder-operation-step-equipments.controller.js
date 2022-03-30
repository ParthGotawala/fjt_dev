(function () {
  'use strict';

  angular
    .module('app.workorder.workorders')
    .controller('WorkorderOperationEquipmentsController', WorkorderOperationEquipmentsController);

  /** @ngInject */
  function WorkorderOperationEquipmentsController($scope, $timeout, $filter, $q, $mdDialog, WORKORDER,
    OPERATION, CORE, USER, DialogFactory,
    uiSortableMultiSelectionMethods, WorkorderOperationFactory, BaseService,
    WorkorderOperationEmployeeFactory, socketConnectionService) {
    // Don't Remove this code
    // Don't add any code before this
    $scope.vm = $scope.$parent.$parent.vm;
    //Add form name for check form dirty
    //$scope.vm.CurrentForm = null;
    $scope.vm.CurrentForm = 'operationEquipments';
    let vm = $scope.vm;
    // add code after this only
    // Don't Remove this code

    vm.EmptyMesssageEquipment = OPERATION.OPERATION_EMPTYSTATE.ASSIGNEQUIPMENT;


    vm.EmptyMesssageForOpDataFields = OPERATION.OPERATION_EMPTYSTATE.ASSIGNEQUIPMENT;
    vm.isContainOpMasterequipment = false;
    // Restrict changes into all fields if work order status is 'under termination'
    // vm.isWOUnderTermination = (vm.operation.workorder.woStatus == CORE.WOSTATUS.UNDER_TERMINATION || vm.operation.workorder.woStatus == CORE.WOSTATUS.TERMINATED);
    vm.goToManageEquipmentWorkstation = (equip) => {
      BaseService.goToManageEquipmentWorkstation(equip.eqpID);
    }

    let _equipmentAddedList = [];
    let _equipmentNoAddedList = [];
    vm.SearchAddedListEquipment = null;
    vm.SearchNoAddedListEquipment = null;
    let loginUserDetails = BaseService.loginUser;
    vm.equipmentSetupMethods = CORE.EQUIPMENT_METHODS.SMTPickAndPlaceSetupAndVerfication;
    /**
    * Step 5 Drag and Drop Equipments and Select Equipments
    *
    * @param
    */

    /**
    * retreive Operation Equipments Details
    *
    * @param
    */
    vm.equipmentDetails = (isEquipmentTabClick) => {
      if (isEquipmentTabClick) {
        UnSelectAllEquipment();
      }

      let objs = {
        woOPID: vm.operation.woOPID
      }
      vm.cgBusyLoading = WorkorderOperationFactory.retrieveEquipmentOperationDetails().query({ operationObj: objs }).$promise.then((res) => {
        if (res && res.data) {
          vm.salesOrderDet = res.data.salesOrderDet || [];
          _equipmentAddedList = vm.equipmentAddedList = [];
          _equipmentNoAddedList = vm.equipmentNoAddedList = [];
          _.each(res.data.equipments, (itemData) => {
            if (itemData.genericFiles) {
              itemData.ProfilePic = CORE.WEB_URL + USER.EQUIPMENT_BASE_PATH + itemData.genericFiles.gencFileName;
            }
            else {
              itemData.ProfilePic = CORE.WEB_URL + USER.EQUIPMENT_DEFAULT_IMAGE_PATH + 'profile.jpg';
            }
            let operationEquipment = _.find(res.data.operationEquipment, { eqpID: itemData.eqpID });
            if (operationEquipment) {
              itemData.woOpEqpID = operationEquipment.woOpEqpID;
              itemData.qty = 1;
              itemData.feederCount = operationEquipment.feederCount;
              itemData.isOnline = operationEquipment.isOnline;
              itemData.createdBy = operationEquipment.createdBy;
              itemData.erOptions = angular.copy(vm.erOptions);
              vm.equipmentAddedList.push(itemData);
            }
            else if (!itemData.isDeleted) {
              itemData.qty = 1;               // Set their Default as a '1'
              vm.equipmentNoAddedList.push(itemData);
            }
          });

          _equipmentAddedList = angular.copy(vm.equipmentAddedList);
          //Filter Employee list by active emp in _employeeNoaddedList
          vm.equipmentNoAddedList = _.filter(vm.equipmentNoAddedList, (eqp) => {
            return eqp.isActive;
          });
          _equipmentNoAddedList = angular.copy(vm.equipmentNoAddedList);

          setSelectableListItem();
          if (_equipmentAddedList.length == 0 && _equipmentNoAddedList.length == 0) {
            vm.isContainOpMasterequipment = false;
          }
          else {
            vm.isContainOpMasterequipment = true;
          }
          /*Used to get count of equipment setup*/
          vm.setupMethodCount = _.filter(vm.equipmentAddedList, (item) => {
            return item.equipmentSetupMethod == 1;
          });
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };
    vm.refreshDataEquipment = () => {
      vm.isHideSearchButtonEquipment = false;
      vm.equipmentDetails(true);
    }
    vm.addDataEquipment = (data, ev) => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }

      let pageRightsAccessDet = {
        popupAccessRoutingState: [USER.ADMIN_MANAGEEQUIPMENT_STATE],
        pageNameAccessLabel: CORE.PageName.equipments
      }
      if (BaseService.checkRightToAccessPopUp(pageRightsAccessDet)) {
        data = {};
        data.Title = CORE.EquipmentAndWorkstation_Title.Equipment;
        DialogFactory.dialogService(
          USER.ADMIN_EQUIPMENT_ADD_MODAL_CONTROLLER,
          USER.ADMIN_EQUIPMENT_ADD_MODAL_VIEW,
          ev,
          data).then(() => {
          }, (data) => {
            if (data) {
              vm.refreshDataEquipment();
            }
          },
            (err) => {
            });
      }
    }
    vm.setFocus = (text) => {
      let someElement = angular.element(document.querySelector('#' + text));
      if (someElement && someElement.length > 0) {
        someElement[0].focus();
      }
    }
    $scope.selectedEquipmentListNoAdded = [];
    $scope.selectedEquipmentListAdded = [];


    //cancel drop event if canceled or validation failed
    let cancelDropEvent = (optype, e, ui) => {
      if (ui) {
        if (ui.item && ui.item.sortable && ui.item.sortable.cancel) {
          ui.item.sortable.cancel();
        } else {
          vm.refreshDataEquipment();
        }
      }
      return false;
    }

    //#region sortable option common for all list
    $scope.sortableOptionsEquipment = uiSortableMultiSelectionMethods.extendOptions({
      cancel: ".cursor-not-allow,:input",
      placeholder: "beingDragged",
      disabled: vm.isWOUnderTermination,
      'ui-floating': true,
      cursorAt: {
        top: 0, left: 0
      },
      start: (e, ui) => {
      },
      sort: (e, ui) => {
      },
      handle: ":not(input)",
      update: (e, ui) => {
        let sourceModel = ui.item.sortable.model;
        if (!ui.item.sortable.received && ui.item.sortable.droptarget) {
          let sourceTarget = ui.item.sortable.source[0];
          let dropTarget = ui.item.sortable.droptarget[0]; // get drop target equipment
          let SourceDivAdded = sourceTarget.id.indexOf('NoAdded') > -1 ? false : true;
          let DestinationDivAdded = dropTarget.id.indexOf('NoAdded') > -1 ? false : true;
          if (SourceDivAdded != DestinationDivAdded) {
            if (SourceDivAdded == false && DestinationDivAdded == true) {
              let isAllow = checkEquipmentOperationOngoing("Add", e, ui);
              if (!isAllow) {
                cancelDropEvent("Add", e, ui);
              } else {
                if ($scope.selectedEquipmentListNoAdded.length == 0) {
                  $scope.selectedEquipmentListNoAdded.push(sourceModel);
                }
                vm.ModifyPageAddedEquipment("Add", e, ui);
              }
              return;
            }
            else if (SourceDivAdded == true && DestinationDivAdded == false) {
              let isAllow = checkEquipmentOperationOngoing("Remove", e, ui);
              if (!isAllow) {
                cancelDropEvent("Remove", e, ui);
                return false;
              }
              else {
                if ($scope.selectedEquipmentListAdded.length == 0) {
                  $scope.selectedEquipmentListAdded.push(sourceModel);
                }
                vm.ModifyPageAddedEquipment("Remove", e, ui);
              }
              return;
            }
          }
        }
      },
      connectWith: '.items-container'
    });
    //#endregion


    //#region reset value of selected equipment
    let ResetSelectedEquipment = () => {
      $scope.selectedEquipmentListNoAdded = [];
      $scope.selectedEquipmentListAdded = [];
      $scope.selectAnyNoAdded = false;
      $scope.selectAnyAdded = false;
    }
    //#endregion

    //#region check for selected equipment
    let checkSelectAllFlagEquipment = () => {
      $scope.selectAnyNoAdded = $scope.selectedEquipmentListNoAdded.length > 0 ? true : false;
      $scope.selectAnyAdded = $scope.selectedEquipmentListAdded.length > 0 ? true : false;
    }
    //#endregion

    //#region unselect all equipment list
    let UnSelectAllEquipment = () => {
      angular.element('[ui-sortable]#equipmentNoAddedList .dragsortable').removeClass('ui-sortable-selected');
      angular.element('[ui-sortable]#equipmentAddedList .dragsortable').removeClass('ui-sortable-selected');
      ResetSelectedEquipment();
    }
    //#endregion

    //#region unselect single equipment list
    let UnSelectEquipment = (unSelectFrom) => {
      if (unSelectFrom == "NoAdded") {
        angular.element('[ui-sortable]#equipmentNoAddedList .dragsortable').removeClass('ui-sortable-selected');
      }
      else {
        angular.element('[ui-sortable]#equipmentAddedList .dragsortable').removeClass('ui-sortable-selected');
      }
      ResetSelectedEquipment();
    }
    //#endregion

    //#region  set item selectable
    let SetEquipmentSelectable = () => {
      angular.element('[ui-sortable]#equipmentAddedList').on('ui-sortable-selectionschanged', function (e, args) {
        UnSelectEquipment("NoAdded");
        var $this = $(this);
        var selectedItemIndexes = $this.find('.ui-sortable-selected').map(function () {
          return $(this).index();
        }).toArray();
        $scope.selectedEquipmentListAdded = _.map(selectedItemIndexes, function (i) {
          return vm.equipmentAddedList[i];
        });
        checkSelectAllFlagEquipment();
        $scope.$applyAsync();
      });
      angular.element('[ui-sortable]#equipmentNoAddedList').on('ui-sortable-selectionschanged', function (e, args) {
        UnSelectEquipment("Added");
        var $this = $(this);
        var selectedItemIndexes = $this.find('.ui-sortable-selected').map(function () {
          return $(this).index();
        }).toArray();
        $scope.selectedEquipmentListNoAdded = _.map(selectedItemIndexes, function (i) {
          return vm.equipmentNoAddedList[i];
        });
        checkSelectAllFlagEquipment();
        $scope.$applyAsync();
      });
    }
    let setSelectableListItem = () => {
      $timeout(() => {
        SetEquipmentSelectable();
      }, _configSelectListTimeout);
    }
    //#endregion

    //#region for destroy selection
    let DestroyEquipmentSelection = () => {
      angular.element('[ui-sortable]#equipmentNoAddedList').off('ui-sortable-selectionschanged');
      angular.element('[ui-sortable]#equipmentAddedList').off('ui-sortable-selectionschanged');
    }

    let DestroyAllSelectionEquipment = () => {
      DestroyEquipmentSelection();
    }
    //#endregion

    //#region On change of tab
    $scope.$on('$destroy', (e) => {
      DestroyAllSelectionEquipment();
      $mdDialog.hide(false, {
        closeAll: true
      });
    });
    //#endregion
    vm.SearchEquipment = (list, searchText, IsAdded) => {
      UnSelectAllEquipment();
      if (!searchText) {
        if (IsAdded) {
          vm.SearchAddedListEquipment = null;
          vm.isHideSearchButtonaddedEquipment = false;
          vm.equipmentAddedList = _equipmentAddedList;
          vm.FilterEquipmentAdded = true;
        } else {
          vm.SearchNoAddedListEquipment = null;
          vm.isHideSearchButtonEquipment = false;
          vm.FilterEquipmentNotAdded = true;
          vm.equipmentNoAddedList = _equipmentNoAddedList;
        }
        return;
      }
      else {
        if (IsAdded) {
          vm.isHideSearchButtonaddedEquipment = true;
        }
        else {
          vm.isHideSearchButtonEquipment = true;
        }
      }
      if (IsAdded) {
        vm.equipmentAddedList = ($filter('filter')(_equipmentAddedList, { assetName: searchText }));
        vm.FilterEquipmentAdded = vm.equipmentAddedList.length > 0;
      }
      else {
        vm.equipmentNoAddedList = ($filter('filter')(_equipmentNoAddedList, { assetName: searchText }));
        vm.FilterEquipmentNotAdded = vm.equipmentNoAddedList.length > 0;
      }
      //}
    }

    // ask for revision popup to user
    //let askForRevisionPopUp = (addType, event, ui) => {
    //  if (vm.operation.workorder.woStatus == CORE.WOSTATUS.PUBLISHED) {
    //    vm.openWOOPRevisionPopup(function (versionModel) {
    //      // Added for close revision dialog popup
    //      if (versionModel && versionModel.isCancelled) {
    //        cancelDropEvent(addType, event, ui);
    //        return;
    //      }
    //      if (versionModel) {
    //        saveEquipment(addType, versionModel, ui);
    //      }
    //      else {
    //        saveEquipment(addType, null, ui);
    //      }
    //    }, event);
    //  }
    //  else {
    //    saveEquipment(addType, null, ui);
    //  }
    //}

    //#region modify data equipment Added based on selection from both list
    vm.ModifyPageAddedEquipment = (addType, event, ui) => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }

      let isAllow = checkEquipmentOperationOngoing(addType);
      if (!isAllow) {
        cancelDropEvent(addType, event, ui);
        return;
      } else {
        if (addType == "Add" || addType == "AddAll") {
          //askForRevisionPopUp(addType, event, ui);
          saveEquipment(addType, null, ui);
        }
        else {
          let obj = {
            title: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM, CORE.MainTitle.Equipment),
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.confirmDiolog(obj).then((res) => {
            if (res) {
              //askForRevisionPopUp(addType, event, ui);
              saveEquipment(addType, null, ui);
            }
          }, (cancel) => {
            cancelDropEvent(addType, event, ui);
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
          return;
        }
      }
    }
    //#endregion

    let sendNotificationAndRefresh = (versionModel) => {
      vm.sendNotification(versionModel);
      vm.refreshDataEquipment();
      if (versionModel && (versionModel.woVersion || versionModel.opVersion)) {
        vm.refreshWorkOrderHeaderDetails();
      }
    }

    // common function for add/remove equipment for work order operation
    function saveEquipment(addType, versionModel, ui) {
      if (addType == "Add") {
        var promises = [saveWorkorderOperationEquipments($scope.selectedEquipmentListNoAdded)];
        vm.cgBusyLoading = $q.all(promises).then(function (responses) {
          if (responses[0] && responses[0].status == CORE.ApiResponseTypeStatus.SUCCESS) {
            sendNotificationAndRefresh(versionModel);
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
      else if (addType == "Remove") {
        var promises = [deleteWorkorderOperationEquipments($scope.selectedEquipmentListAdded)];
        vm.cgBusyLoading = $q.all(promises).then(function (responses) {
          if (responses[0] && responses[0].data) {
            if (responses[0].data.TotalCount && responses[0].data.TotalCount > 0) {
              BaseService.deleteAlertMessage(responses[0].data);
              cancelDropEvent(addType, event, ui);
            } else {
              sendNotificationAndRefresh(versionModel);
            }
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
      else if (addType == "AddAll") {
        var promises = [saveWorkorderOperationEquipments(vm.equipmentNoAddedList)];
        //let WOeqpdata = vm.equipmentNoAddedList;
        vm.cgBusyLoading = $q.all(promises).then(function (responses) {
          if (responses[0] && responses[0].status == CORE.ApiResponseTypeStatus.SUCCESS) {
            sendNotificationAndRefresh(versionModel);
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
      else if (addType == "RemoveAll") {
        var promises = [deleteWorkorderOperationEquipments(vm.equipmentAddedList)];
        vm.cgBusyLoading = $q.all(promises).then(function (responses) {
          if (responses[0] && responses[0].data) {
            if (responses[0].data.TotalCount && responses[0].data.TotalCount > 0) {
              BaseService.deleteAlertMessage(responses[0].data);
              cancelDropEvent(addType, event, ui);
            } else {
              sendNotificationAndRefresh(versionModel);
            }
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
    }

    /* save equipment in work order operation */
    let saveWorkorderOperationEquipments = (newListToSave) => {
      let saveObj = [];
      saveObj = _.map(newListToSave, (item) => {
        return {
          woID: vm.operation.woID,
          opID: vm.operation.opID,
          woOPID: vm.operation.woOPID,
          eqpID: item.eqpID,
          qty: 1
        }
      });
      let listObj = {
        woID: vm.operation.woID,
        opID: vm.operation.opID,
        woOPID: vm.operation.woOPID,
        equipmentList: saveObj,
        woNumber: vm.operation.workorder.woNumber,
        opName: vm.operation.opName
      }

      return WorkorderOperationFactory.createWorkorderOperationEquipments().save({ listObj: listObj }).$promise.then((res) => {
        return res;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }


    /* delete equipment in work-order_operation */
    let deleteWorkorderOperationEquipments = (listToDelete) => {
      let _objList = {};
      _objList.woID = vm.operation.woID;
      _objList.woOPID = vm.operation.woOPID;
      _objList.eqpID = _.map(listToDelete, (obj) => {
        return obj.eqpID;
      });
      return WorkorderOperationEmployeeFactory.deleteOperationFromWorkOrder().query({ listObj: _objList }).$promise.then((equipment) => {
        return equipment;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    vm.equipmentDetails(true);

    /* update equipment and qty in work order operation */
    //vm.UpdateeWorkorderOperationEquipmentDetails = ($event) => {
    //    if (vm.operation.workorder.woStatus == CORE.WOSTATUS.PUBLISHED) {
    //        vm.openWOOPRevisionPopup(function (versionModel) {
    //            if (versionModel && versionModel.isCancelled) {
    //                return;
    //            }
    //            if (versionModel) {
    //                updateAllEquipmentQty(versionModel);
    //            }
    //            else
    //                updateAllEquipmentQty();
    //        }, $event);
    //    }
    //    else {
    //        updateAllEquipmentQty();
    //    }
    //}

    //function updateAllEquipmentQty(versionModel) {
    //    let updateObj = [];
    //    _.each(vm.equipmentAddedList, (eqp) => {
    //        let objEqp = {
    //            woOpEqpID: eqp.woOpEqpID,
    //            feederCount: eqp.feederCount,
    //            qty: 1,
    //            eqpID: eqp.eqpID,
    //            woID: vm.operation.woID,
    //            opID: vm.operation.opID,
    //            woOPID: vm.operation.woOPID,
    //            createdBy: eqp.createdBy
    //        }
    //        updateObj.push(objEqp);
    //    });

    //    return WorkorderOperationEquipmentFactory.updateAllWOEquipmentQty().save({ listObj: updateObj }).$promise.then((res) => {
    //        vm.operationEquipments.$setPristine();
    //        vm.operationEquipments.$setUntouched();
    //        vm.sendNotification(versionModel);
    //        vm.refreshDataEquipment();
    //        if (versionModel && (versionModel.woVersion || versionModel.opVersion)) {
    //            vm.refreshWorkOrderHeaderDetails();
    //        }
    //        return res;
    //    }).catch((error) => {
    //        return BaseService.getErrorLog(error);
    //    });
    //}


    //check equipment is checked-in than show alert and return
    let checkEquipmentOperationOngoing = (addType, e, ui) => {
      if (addType == "Remove" || addType == "RemoveAll") {
        if (addType == "RemoveAll" && $scope.selectedEquipmentListAdded.length == 0) {
          $scope.selectedEquipmentListAdded = angular.copy(vm.equipmentAddedList);
        }
        let checkEquipment = _.find($scope.selectedEquipmentListAdded, (eqp) => {
          return _.find(vm.operation.workorderTransEmpinout, (operation) => {
            return operation.equipmentID == eqp.eqpID;
          });
        });
        if (checkEquipment && vm.IsProductionStart) {
          var model = {
            title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
            textContent: CORE.MESSAGE_CONSTANT.PRODUCTION_IS_ONGOING_NOT_ALLOW_ANY_CHANGE,
            multiple: true
          };
          DialogFactory.alertDialog(model);
          return false;
        }
        return true;
      }
      return true;
    }


    // Column Mapping Common function
    vm.ViewFeederDetails = (equipment, ev) => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }

      const data = {
        equipment: equipment,
        woID: vm.operation.woID,
        woNumber: vm.operation.workorder.woNumber,
        woVersion: vm.operation.workorder.woVersion,
        opID: vm.operation.opID,
        opName: vm.operation.opName,
        opNumber: vm.operation.opNumber,
        opVersion: vm.operation.opVersion,
        eqpID: equipment.eqpID,
        woOpEqpID: equipment.woOpEqpID,
        feederCount: equipment.feederCount,
        isOnline: equipment.isOnline,
        woOPID: vm.operation.woOPID,
        partID: vm.operation.workorder.partID,
        PIDCode: vm.operation.workorder.componentAssembly.PIDCode,
        isCustom: vm.operation.workorder.componentAssembly.isCustom,
        nickName: vm.operation.workorder.componentAssembly.nickName,
        mfgPN: vm.operation.workorder.componentAssembly.mfgPN,
        mfgPNDescription: vm.operation.workorder.componentAssembly.mfgPNDescription,
        name: vm.operation.workorder.rohs.name,
        rohsIcon: vm.operation.workorder.rohs.rohsIcon,
        isVerify: false,
        isDisableScan: vm.isWOUnderTermination,
        isFeeder: true,
        lineID: _.map((vm.salesOrderDet), "lineID").join(),
        salesOrderMstIDs: _.map((_.uniqBy(vm.salesOrderDet, 'refSalesOrderID')), "refSalesOrderID").join(),
        salesOrderDetID: vm.salesOrderDet.length > 0 ? vm.salesOrderDet[0].id : null,
        salesOrderNumber: _.map((_.uniqBy(vm.salesOrderDet, 'salesordernumber')), "salesordernumber").join(),
        poNumber: _.map((_.uniqBy(vm.salesOrderDet, 'poNumber')), "poNumber").join(),
        SOPOQtyValues: _.map((vm.salesOrderDet), "qty").join(),
        soMRPQty: _.map((vm.salesOrderDet), "mrpqty").join(),
        soPOQty: _.map((vm.salesOrderDet), "poQty").join(),
        opFluxNotApplicable: vm.operation.isFluxNotApplicable,
        opNoClean: vm.operation.isNoClean,
        opWaterSoluble: vm.operation.isWaterSoluble
      };
      DialogFactory.dialogService(
        WORKORDER.WORKORDER_VIEW_FEEDER_DETAILS_CONTROLLER,
        WORKORDER.WORKORDER_VIEW_FEEDER_DETAILS_VIEW,
        ev,
        data).then((result) => {
          vm.refreshDataEquipment();
        }, (result) => {
          vm.refreshDataEquipment();
        }, (err) => {
          return BaseService.getErrorLog(err);
        });
    }


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
          let woEqp = _.find(vm.equipmentAddedList, { 'woOpEqpID': message.data.operationObj.woOpEqpID });
          if (woEqp && message.data) {
            woEqp.isOnline = message.data.operationObj.isOnline;
          }
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

  //angular
  //   .module('app.workorder.workorders'). = function () {
  //   };
})();
