(function () {
  'use strict';

  angular
    .module('app.workorder.workorders')
    .controller('ManageWorkorderPartsController', ManageWorkorderPartsController);

  /** @ngInject */
  function ManageWorkorderPartsController($scope, $filter, $timeout,
    WORKORDER, CORE, USER, $mdDialog, $state, RFQTRANSACTION, RFQSettingFactory,
    BaseService, DialogFactory, WorkorderOperationPartFactory, WorkorderOperationEmployeeFactory) {
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

    vm.EmptyMesssagePart = WORKORDER.WORKORDER_EMPTYSTATE.ASSIGNPARTS;
    vm.EmptyMesssageForOperationNotAdded = WORKORDER.WORKORDER_EMPTYSTATE.OPERATION;
    vm.AllLabels = WORKORDER.AllLabels;

    // let _PartListRepo = [];
    vm.SelectedAllPart = false;

    let _SelectedPartList = [];
    vm.SelectedPartList = [];
    const rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;

    // Restrict changes into all fields if work order status is 'under termination'
    //vm.isWOUnderTermination = (vm.workorder.woStatus == CORE.WOSTATUS.UNDER_TERMINATION || vm.workorder.woStatus == CORE.WOSTATUS.TERMINATED);

    vm.SearchSelectedPartTxt = null;

    /* get Obsolete Part error code information */
    let getObsoletePartErrorInfo = () => {
      vm.cgBusyLoading = RFQSettingFactory.getErrorCodeByLogicID().save({
        logicID: CORE.errorCodeLogicIDs.OBS
      }).$promise.then((res) => {
        vm.obsoletePartErrorColor = res && res.data ? res.data.errorColor : '';
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    getObsoletePartErrorInfo();

    /*
     * Author :  Vaibhav Shah
     * Purpose : Get All Part list for woID
     */
    let GetPartListByWoID = () => {
      //vm.SearchSelectedPartTxt = null;
      vm.SelectedAllPart = false;
      vm.SelectedPartList = [];
      if (!vm.SearchSelectedPartTxt) {
        _SelectedPartList = [];
      }
      vm.cgBusyLoading = WorkorderOperationPartFactory.retrivePartListbyWoID().save({
        woID: vm.workorder.woID,
        searchText: vm.SearchSelectedPartTxt,
        woAssyID: vm.workorder.partID
      }).$promise.then((partlist) => {
        //if (!vm.SearchSelectedPartTxt) {
        //    _PartListRepo = partlist.data;
        //}
        _.each(partlist.data, (item) => {
          item.rohsIcon = rohsImagePath + item.rohsIcon;
          if (!item.imageURL) {
            item.imageURL = CORE.WEB_URL + USER.COMPONENT_DEFAULT_IMAGE_PATH + 'profile.jpg';
          } else {
            if (!item.imageURL.startsWith("http://") && !item.imageURL.startsWith("https://")) {
              item.imageURL = BaseService.getPartMasterImageURL(item.documentPath, item.imageURL);
            }
          }
          item.isObsoletePart = item.partStatusValue == RFQTRANSACTION.PART_COSTING.Obsolete;
          item.SMTFluxTypeList = [];
          item.SMTFluxTypeList.push({
            value: item.isFluxNotApplicable, icon: CORE.FluxTypeIcon.notApplicableIcon, toolTip: CORE.FluxTypeToolTip.notApplicable, isShowIcon: true
          });
          item.SMTFluxTypeList.push({
            value: item.isNoClean, icon: CORE.FluxTypeIcon.noCleanIcon, toolTip: CORE.FluxTypeToolTip.noClean, isShowIcon: true
          });
          item.SMTFluxTypeList.push({
            value: item.isWaterSoluble, icon: CORE.FluxTypeIcon.waterSolubleIcon, toolTip: CORE.FluxTypeToolTip.waterSoluble, isShowIcon: true
          });
          if (item.workorderOperationPart) {
            vm.SelectedPartList.push(item);
          }
          item.totEstimatedQPABuild = item.totalQPA ? countTotalEstimatedActualQPA(item.totalQPA, item.isMountingGroupTools) : '';
          item.totActualQPABuild = item.totalActualQPA ? countTotalEstimatedActualQPA(item.totalActualQPA, item.isMountingGroupTools) : '';
          if (item.totEstimatedQPABuild && item.totActualQPABuild) {
            item.isGreaterTotActualQPABuild = parseFloat(item.totActualQPABuild.replace(/,/g, "")) > parseFloat(item.totEstimatedQPABuild.replace(/,/g, ""));
          }
        });
        if (!vm.SearchSelectedPartTxt) {
          _SelectedPartList = angular.copy(vm.SelectedPartList);
        }
        vm.isDiplaySearFilterForWOParts = _SelectedPartList.length > 0 ? true : false;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    let countTotalEstimatedActualQPA = (totQPA, isMountingGroupTools) => {
      return $filter('unit')((totQPA * (isMountingGroupTools ? 1 : vm.workorder.buildQty)));
    }

    /*
    * Author :  Vaibhav Shah
    * Purpose : Onclick of step 4 Select Part
    */
    vm.getWorkorderPartList = () => {
      $timeout(() => {
        vm.SearchSelectedPartTxt = null;
        GetPartListByWoID();
      }, _configSelectListTimeout)
    }

    /*
     * Author :  Vaibhav Shah
     * Purpose : Delete part from operation list for workorder
     */
    vm.DeletePartFromWorkorder = (part, type, event) => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }
      let obj = {
        title: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM, "Supplies, Materials & Tools"),
        textContent: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM_DETAILS_MESSAGE, "Supplies, Materials & Tools"),
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.confirmDiolog(obj).then((res) => {
        if (res) {
          removePartFromWorkorder(part, type);
          //if (vm.workorder.woStatus == CORE.WOSTATUS.PUBLISHED) {
          //  vm.openWORevisionPopup(function (versionModel) {
          //    // Added for close revision dialog popup
          //    if (versionModel && versionModel.isCancelled) {
          //      return;
          //    }
          //    removePartFromWorkorder(part, type, versionModel);
          //  }, event);
          //}
          //else {
          //  removePartFromWorkorder(part, type);
          //}
        }
      }, (cancel) => {
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }


    function removePartFromWorkorder(part, type, versionModel) {
      let _objList = {};
      _objList.woID = vm.workorder.woID;
      let partIDs = [];
      let woOPID = [];
      if (type == "Multiple") {
        partIDs.push(part.partID);
        _objList.partID = part.partID;
        _objList.woOPID = part.woOPID;
      } else {
        partIDs.push(part.id);
        _objList.partID = part.id;
        _.each(part.workorderOperationPart, (item) => {
          woOPID.push(item.woOPID);
        });
        _objList.woOPID = woOPID;
        //_objList.woOPID = part.workorderOperationPart.woOPID;
      }
      vm.cgBusyLoading = WorkorderOperationEmployeeFactory.deleteOperationFromWorkOrder().query({ listObj: _objList }).$promise.then((part) => {
        if (part && part.data) {
          if (part.data.TotalCount && part.data.TotalCount > 0) {
            BaseService.deleteAlertMessage(part.data);
          }
          else {
            if (type == "Multiple") {
              partIDs = _.first(partIDs);
              _.each(partIDs, (item) => {
                _.remove(_SelectedPartList, (ep) => { return ep.id == item; });
              });
            } else {
              _.remove(_SelectedPartList, (ep) => { return ep.id == partIDs; });
            }
            ////_SelectedPartList = vm.SelectedPartList;
            //vm.SelectedPartList = _SelectedPartList;
            //vm.isDiplaySearFilterForWOParts = _SelectedPartList.length > 0 ? true : false;
            //vm.SelectedAllPart = false;
            //_.each(vm.SelectedPartList, (part) => { part.selected = false; });
            //vm.SearchSelectedPartTxt = null;
            vm.SearchSelectedPartTxt = null;
            GetPartListByWoID();

            // Send details change notification using socket.io
            //vm.sendNotification(versionModel);

            /* refresh work order header conditionally */
            //if (versionModel && versionModel.woVersion) {
            //  vm.refreshWorkOrderHeaderDetails();
            //}
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
    vm.ViewOperationByPartFromWorkorder = (part, ev) => {
      let data = {};
      data.woID = vm.workorder.woID;
      data.selectedPart = angular.copy(part);
      data.refreshWorkOrderHeaderDetails = vm.refreshWorkOrderHeaderDetails;
      data.isWoInSpecificStatusNotAllowedToChange = vm.isWoInSpecificStatusNotAllowedToChange;
      DialogFactory.dialogService(
        WORKORDER.WORKORDER_SHOWPART_OPERATION_MODAL_CONTROLLER,
        WORKORDER.WORKORDER_SHOWPART_OPERATION_MODAL_VIEW,
        ev,
        data).then(() => {
        }, (val) => {
          if (val) {
            //if (val && val.isChanged) {
            //    vm.SelectedPartList.push(val);
            //    _SelectedPartList = vm.SelectedPartList;
            //    vm.isDiplaySearFilterForWOParts = _SelectedPartList.length > 0 ? true : false;
            //}
            vm.SearchSelectedPartTxt = null;
            GetPartListByWoID();
          }
        }, (err) => {
          return BaseService.getErrorLog(err);
        });
    }

    /*
    * Author :  Vaibhav Shah
    * Purpose : Add new part popup
    */
    vm.AddNewPartToWorkOrder = (ev) => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }
      const data = {};
      data.isFromWOPartList = true;
      data.woID = vm.workorder.woID;
      const listOperation = [];
      data.list = [];
      data.alreadyAddedPartIDsInWo = _.map(_SelectedPartList, 'id');
      data.workorderInfo = {
        woNumber: vm.workorder.woNumber
      };
      data.headerdata = {
        PIDCode: (vm.workorder.componentAssembly && vm.workorder.componentAssembly.PIDCode) ? vm.workorder.componentAssembly.PIDCode : null,
        partID: vm.workorder.partID ? vm.workorder.partID : null,
        rohsIcon: (vm.workorder.rohs && vm.workorder.rohs.rohsIcon) ? (rohsImagePath + vm.workorder.rohs.rohsIcon) : null,
        rohsName: (vm.workorder.rohs && vm.workorder.rohs.name) ? vm.workorder.rohs.name : null
      };
      DialogFactory.dialogService(
        WORKORDER.WORKORDER_SHOW_PARTLIST_MODAL_CONTROLLER,
        WORKORDER.WORKORDER_SHOW_PARTLIST_MODAL_VIEW,
        ev,
        data).then((response) => {
          if (response) {
            const val = response[0];
            //var versionModel = response[1];

            if (val) {
              vm.SearchSelectedPartTxt = null;
              GetPartListByWoID();
              //_SelectedPartList.push(val);
              //vm.isDiplaySearFilterForWOParts = _SelectedPartList.length > 0 ? true : false;
              //vm.SelectedPartList = _SelectedPartList;
            }

            // get updated woVersion from model response and update
            //if (versionModel && versionModel.woVersion) {
            //  vm.workorder.woVersion = versionModel.woVersion;
            //}

            ///* refresh work order header conditionally */
            //if (val && versionModel && versionModel.woVersion) {
            //  vm.refreshWorkOrderHeaderDetails();
            //}
          }
        }, () => {
        }, (err) =>  BaseService.getErrorLog(err));
    }
    /*
    * Author :  Vaibhav Shah
    * Purpose : Search Part from Selected Part List
    */
    vm.SearchSelectedPart = (list, searchText) => {
      //if (!searchText) {
      //    vm.SearchSelectedPartTxt = null;
      //    vm.SelectedPartList = _SelectedPartList;
      //    vm.FilterSelectedPart = true;
      //    return;
      //}
      //vm.SelectedPartList = $filter('filter')(_SelectedPartList, { PIDCode: searchText });
      //vm.FilterSelectedPart = vm.SelectedPartList.length > 0;
      GetPartListByWoID();
    };
    /*
    * Author :  Vaibhav Shah
    * Purpose : Get Selected Part Count
    */
    vm.getSelectedPartCount = () => {
      let objList = [];
      let partID = [];
      const woOPID = [];
      objList = _.filter(vm.SelectedPartList, (part) => part.selected === true);

      partID = _.map(objList, 'id');

      _.each(objList, (item) => {
        woOPID.push(_.map(item.workorderOperationPart, 'woOPID'));
        //woOPID.push(item.workorderOperationPart.woOPID);
      });

      vm.selectedPartList = {
        partID: partID,
        woOPID: woOPID
      };

      //vm.selectedPartList = _.map(objList, 'partID');
      const cnt = vm.SelectedPartList.length;
      const objcnt = objList.length;
      if (objcnt < cnt) {
        vm.diplayButtonText = 'Select All';
      }
      else {
        vm.diplayButtonText = 'Deselect All';
      }
      return objList.length;
    };

    /*
    * Author :  Vaibhav Shah
    * Purpose : Select All Part
    */

    vm.SelectAllPart = () => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }
      vm.SelectedAllPart = !vm.SelectedAllPart;
      if (vm.SelectedAllPart) {
        _.each(vm.SelectedPartList, (part) => { part.selected = true; });
        //_SelectedPartList = vm.SelectedPartList;
      }
      else {
        _.each(vm.SelectedPartList, (part) => { part.selected = false; });
        //_SelectedPartList = vm.SelectedPartList;
      }
      if (vm.diplayButtonText == "Select All") {
        _.each(vm.SelectedPartList, (part) => { part.selected = true; });
      }
      else if (vm.diplayButtonText == "Deselect All") {
        _.each(vm.SelectedPartList, (part) => { part.selected = false; });
      }
    }

    vm.moveToAddOperationsTab = () => {
      $('.jstree').jstree(true).deselect_all(true);
      $('.jstree').jstree(true).select_node(CORE.Workorder_Tabs.Operations.ID);
    }

    vm.getWorkorderPartList();

    //close popup on page destroy 
    $scope.$on('$destroy', function () {
      $mdDialog.hide(false, {
        closeAll: true
      });
    });

    /* refresh work order header */
    let refreshWorkOrderHeaderDetails = () => {
      $timeout(() => {
        //console.log("isWOHeaderDetailsChanged - " + vm.isWOHeaderDetailsChanged);
        vm.isWOHeaderDetailsChanged = !vm.isWOHeaderDetailsChanged;
      }, _configBreadCrumbTimeout);
    }
  };
})();
