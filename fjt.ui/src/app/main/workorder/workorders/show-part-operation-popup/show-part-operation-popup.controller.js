(function () {
  'use strict';

  angular
    .module('app.workorder.workorders')
    .controller('ShowPartOperationPopUpController', ShowPartOperationPopUpController);

  /** @ngInject */
  function ShowPartOperationPopUpController($filter, $scope, $mdDialog, $q, WORKORDER, CORE, data,
    WorkorderOperationEmployeeFactory, WorkorderOperationPartFactory, DialogFactory, BaseService, NotificationSocketFactory, MasterFactory) {
    const vm = this;
    vm.data = data;
    vm.operationListRepo = [];
    let _PartOperationList = [];
    vm.PartOperationList = [];
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.SearchPartOperationText = null;
    vm.EmptyMesssageOperation = WORKORDER.WORKORDER_EMPTYSTATE.OPERATION;
    const changeObj = {
      isChanged: false
    };

    // Assembly
    vm.goToAssemblyList = () => {
        BaseService.goToPartList();
      return false;
    };

    vm.goToAssemblyDetails = (data) => {
        BaseService.goToComponentDetailTab(null, data.partID);
      return false;
    };

    vm.headerdata = [];
    vm.headerdata.push({
      label: vm.LabelConstant.MFG.PID,
      value: vm.data.selectedPart.PIDCode,
      displayOrder: 1,
      labelLinkFn: vm.goToAssemblyList,
      valueLinkFn: vm.goToAssemblyDetails,
      valueLinkFnParams: { partID: vm.data.selectedPart.id },
      isCopy: true,
      isCopyAheadLabel: true,
      isAssy: true,
      isCopyAheadOtherThanValue: true,
      copyAheadLabel: vm.LabelConstant.MFG.MFGPN,
      copyAheadValue: vm.data.selectedPart.mfgPN,
      imgParms: {
        imgPath: vm.data.selectedPart.rohsIcon,
        imgDetail: vm.data.selectedPart.rohsStatus
      }
    });

    let loginUserDetails = BaseService.loginUser;

    /*
     * Author :  Vaibhav Shah
     * Purpose : Get Part Details by PartID
     */
    const GetPartDetailsByPartID = () => {
      const _objList = {};
      _objList.woID = data.woID;
      _objList.partID = vm.data.selectedPart.id;
      return WorkorderOperationPartFactory.retrivePartDetailsbyPartID().query({ listObj: _objList }).$promise.then((partdetails) => {
        if (partdetails.data.length > 0) {
          vm.data.selectedPart = _.first(partdetails.data);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // [S] Get WO details for notification
    var workorderDetails = null;
    const getWorkorderByID = () => {
      return MasterFactory.getWODetails().query({ woID: data.woID }).$promise.then((response) => {
        if (response && response.data) {
          workorderDetails = response.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    // [E] Get WO details for notification

    /*
      * Author :  Vaibhav Shah
      * Purpose : Bind Part Operation List
      */
    const BindPartOperationList = () => {
      _PartOperationList = vm.PartOperationList = [];
      vm.cgBusyLoading = WorkorderOperationEmployeeFactory.retriveOperationListbyWoID().query({ woID: data.woID }).$promise.then((operationlist) => {
        vm.operationListRepo = operationlist.data;
        _.each(vm.operationListRepo, (item) => {
          item.opName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, item.opName, item.opNumber);
        });
        if (vm.data.selectedPart) {
          _.each(vm.data.selectedPart.workorderOperationPart, (item) => {
            if (vm.data.selectedPart.workorderOperationPart) {
              let objOp = _.find(vm.operationListRepo, (op) => {
                return op.opID == item.opID;
              })
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
                vm.PartOperationList.push(objOp);
              }
            }
          });
        }
        _PartOperationList = vm.PartOperationList;
        //vm.ALLoperationList = _PartOperationList;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    var cgPromise = [];
    cgPromise = [getWorkorderByID(), GetPartDetailsByPartID()];
    vm.cgBusyLoading = $q.all(cgPromise).then((responses) => {
      BindPartOperationList();
    });
    /*
       * Author :  Vaibhav Shah
       * Purpose : Search Operation
       */
    vm.SearchOperation = (list, searchText) => {
      if (!searchText) {
        vm.SearchPartOperationText = null;
        vm.PartOperationList = _PartOperationList;
        vm.FilterOperation = true;
        return;
      }
      vm.PartOperationList = $filter('filter')(_PartOperationList, { opName: searchText });
      vm.FilterPartOperationList = vm.PartOperationList.length > 0;
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
          if (workorderDetails && workorderDetails.woStatus === CORE.WOSTATUS.PUBLISHED) {
            openWORevisionPopup(data.woID,  (versionModel) => {
              // Added for close revision dialog popup
              if (versionModel && versionModel.isCancelled) {
                return;
              }
              deleteOperationForPart(operation, versionModel);
            }, event);
          }
          else {
            deleteOperationForPart(operation);
          }
        }
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    }

    function deleteOperationForPart(operation, versionModel) {
      let _objList = {};
      let opIDs = [];
      _objList.woID = data.woID;
      opIDs.push(operation.opID);
      _objList.opID = opIDs;
      _objList.woOPID = operation.woOPID;
      _objList.partID = vm.data.selectedPart.id;
      vm.cgBusyLoading = WorkorderOperationEmployeeFactory.deleteOperationFromWorkOrder().query({ listObj: _objList }).$promise.then((operation) => {
        if (operation && operation.data) {
          if (operation.data.TotalCount && operation.data.TotalCount > 0) {
            BaseService.deleteAlertMessage(operation.data);
          }
          else {
            _.each(opIDs, (_item) => {
              _.remove(_PartOperationList, (o) => {
                return o.opID == _item;
              });
            });
            vm.PartOperationList = _PartOperationList;
            vm.SearchPartOperationText = null;
            changeObj.isChanged = true;

            // Send notification of change to all users
            sendNotification(versionModel);

            /* refresh work order header conditionally */
            if (versionModel && versionModel.woVersion) {
              vm.data.refreshWorkOrderHeaderDetails();
            }
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
    vm.AddNewOperationToPart = (ev) => {
      const data = {};
      data.isFromWOPartList = false;
      data.woID = vm.data.woID;
      data.partID = vm.data.selectedPart.id;
      data.isFluxNotApplicable = vm.data.selectedPart.isFluxNotApplicable;
      data.isNoClean = vm.data.selectedPart.isNoClean;
      data.isWaterSoluble = vm.data.selectedPart.isWaterSoluble;
      data.headerdata = vm.headerdata;
      data.workorderInfo = {
        partID: workorderDetails.partID,
        woNumber: workorderDetails.woNumber
      };
      const listOperation = [];
      _.each(vm.operationListRepo, (_mainOp) => {
        const obj = _.find(_PartOperationList, (_part) => _part.opID == _mainOp.opID);
        if (!obj) {
          listOperation.push(_mainOp);
        }
      })
      data.list = listOperation;
      DialogFactory.dialogService(
        WORKORDER.WORKORDER_SHOW_PARTLIST_MODAL_CONTROLLER,
        WORKORDER.WORKORDER_SHOW_PARTLIST_MODAL_VIEW,
        ev,
        data).then((response) => {
          var val = response[0];
          //var versionModel = response[1];
          if (val) {
            cgPromise = [GetPartDetailsByPartID()];
            vm.cgBusyLoading = $q.all(cgPromise).then((responses) => {
              BindPartOperationList();
            });
            /* refresh work order header conditionally */
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
              _PartOperationList.push(obj);
              vm.PartOperationList = _PartOperationList;
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
        }).catch(() => {
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
        }, () => {
          callbackFn();
        });
    }
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
