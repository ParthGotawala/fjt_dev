(function () {
  'use strict';

  angular
    .module('app.workorder.workorders')
    .controller('ManageWorkorderDetailsController', ManageWorkorderDetailsController);

  /** @ngInject */
  function ManageWorkorderDetailsController($scope, $q, $timeout, $state,
    CORE, USER, WORKORDER, $mdDialog,
    BaseService, DialogFactory, WorkorderFactory, MasterFactory, SalesOrderFactory, WorkorderSalesOrderDetailsFactory, TRANSACTION) {
    var getsalesOrderDetailWowiseResp;
    // var totalPOqty = 0;
    // console.log('w8');
    // Don't Remove this code
    // Don't add any code before this
    $scope.vm = $scope.$parent.$parent.vm;
    //Add form name for check form dirty
    $scope.vm.CurrentForm = 'frmWorkOrderDetails';
    const vm = $scope.vm;
    // add code after this only
    // Don't Remove this code
    // console.log('w9');
    vm.WONumberPattern = CORE.WONumberPattern;
    vm.selectedCustomer = null;
    vm.autoCompleteAssy = null;
    vm.autoCompleteLocationDet = null;
    // vm.assyList = [];
    vm.assyRevisionList = [];
    vm.SalesOrderNumberList = [];
    vm.emptySearch = CORE.EMPTYSTATE.EMPTY_SEARCH;
    vm.dateCodeFormats = CORE.AssyDateCodeFormats;
    vm.CustomerECO = angular.copy(CORE.workOrderECORequestType.CustomerECO).toUpperCase();
    vm.FCAECO = angular.copy(CORE.workOrderECORequestType.FCAECO).toUpperCase();

    // Restrict changes into all fields if work order status is 'under termination'
    //vm.isWOUnderTermination = (vm.workorder.woStatus == CORE.WOSTATUS.UNDER_TERMINATION || vm.workorder.woStatus == CORE.WOSTATUS.TERMINATED);
    vm.EmptyMesssageSalesOrder = angular.copy(TRANSACTION.TRANSACTION_EMPTYSTATE.ADD_SALESORDER);
    vm.EmptyMesssageSalesOrder.MESSAGE = stringFormat(vm.EmptyMesssageSalesOrder.MESSAGE, vm.workorder.PIDCode);
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.isLoad = false;
    $scope.$emit('bindWorkorderTreeViewMain', { woID: $scope.$parent.$parent.vm.id });
    vm.PartCategory = CORE.PartCategory;
    const rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.ShowSubAssemblyList = false;
    vm.PartCorrectList = CORE.PartCorrectList;
    vm.CorePartStatusList = CORE.PartStatusList;
    vm.isWOTransfered = false;
    vm.saveSODisable = false;
    let isRevisedTransfered = false;
    vm.disableKitAllocationNotRequired = false;
    vm.woNotesConst = WORKORDER.WONotes;
    // let woNumberPrefix;

    if (vm.workorder && vm.workorder.woStatus === CORE.WOSTATUS.DRAFT) {
      vm.disableIncludeSubAssembly = false;
    } else {
      vm.disableIncludeSubAssembly = true;
    }

    if (vm.workorder && (vm.workorder.woStatus === CORE.WOSTATUS.TERMINATED || vm.workorder.woStatus === CORE.WOSTATUS.COMPLETED || vm.workorder.woStatus === CORE.WOSTATUS.VOID)) {
      vm.disableInternalBuild = true;
      vm.disableKitAllocationNotRequired = true;
    } else {
      //if (vm.workorder.isRevisedWO) {
      //  vm.disableInternalBuild = true;
      //} else {
      vm.disableInternalBuild = false;
      //}
      vm.disableKitAllocationRequired = false;
    }


    if (vm.workorder.terminateWOID) {
      isRevisedTransfered = true;
    }
    else {
      isRevisedTransfered = false;
    }

    vm.isWOSalesDetAdded = angular.copy(vm.isWOSalesOrderDetails);
    vm.radioButtonGroup = {
      isRevisedWO: {
        array: WORKORDER.WorkOrderRadioGroup.isRevisedWO,
        checkDisable: () => vm.workorder.woStatus === vm.DisplayStatus.Published.ID || vm.isWOUnderTermination || vm.workorder.terminateWOID || vm.isWOSalesDetAdded || isRevisedTransfered || vm.isWoInSpecificStatusNotAllowedToChange,
        onChange: () => {
          if (vm.workorder.isRevisedWO) {
            vm.workorder.excessQty = null;
            vm.workorder.buildQty = null;
          }
        }
      },
      isHotJob: {
        array: WORKORDER.WorkOrderRadioGroup.isHotJob,
        checkDisable: () => (vm.workorder.woStatus === vm.DisplayStatus.Published.ID || vm.isWOUnderTermination
          || vm.isWoInSpecificStatusNotAllowedToChange)
        //onChange: () => {
        //    //if (vm.workorder.isHotJob) {
        //    //}
        //}
      },
      isOperationTrackBySerialNo: {
        array: WORKORDER.WorkOrderRadioGroup.isOperationTrackBySerialNo,
        checkDisable: () => (vm.workorder.woID && vm.IsProductionStart) || vm.isWOUnderTermination || vm.isWoInSpecificStatusNotAllowedToChange
      },
      isSampleAvailable: {
        array: WORKORDER.WorkOrderRadioGroup.isSampleAvailable,
        checkDisable: () => vm.isWOUnderTermination || vm.isWoInSpecificStatusNotAllowedToChange,
        onChange: () => {
          vm.workorder.locationDetails = null;
          vm.autoCompleteLocationDet.searchText = null;
          vm.workorder.sampleDetails = null;
          vm.autoCompleteLocationDet.isRequired = vm.workorder.isSampleAvailable ? true : false;
        }
      }
    };


    //start - link to open in new tab

    //redirect to sales order master
    vm.goToSalesOrderList = () => {
      BaseService.goToSalesOrderList();
      return false;
    };

    //to add new sales order detail.
    vm.addSalesOrderRecord = () => {
      BaseService.goToManageSalesOrder();
    };

    //redirect to customer master
    vm.goToCustomerList = () => {
      BaseService.goToCustomerList();
    };

    //redirect to assembly master
    vm.goToAssemblyList = () => {
        BaseService.goToPartList();
    };

    //redirect to assembly master
    vm.goToAssemblyDetails = (id) => {
        BaseService.goToComponentDetailTab(null, id);
    };

    //redirect to salesorder details
    vm.goToManageSalesOrder = (data) => {
      let SalesOrderMstID = data.refSalesOrderID;
      if (!SalesOrderMstID) { // when not added so item as wo so
        const selectedSOItem = _.find(vm.SalesOrderNumberList, (soItem) => data.id === soItem.id);
        SalesOrderMstID = selectedSOItem.refSalesOrderID ? selectedSOItem.refSalesOrderID : null;
      }
      BaseService.goToManageSalesOrder(SalesOrderMstID);
      return false;
    };

    // redirect to workorder list
    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
      return false;
    };
    //end - link to open in new tab

    // view assembly stock popup
    vm.ViewAssemblyStockStatus = () => {
      const data = {
        partID: vm.autoCompleteAssy.keyColumnId,
        mfgPN: vm.workorder.mfgPN,
        PIDCode: vm.workorder.PIDCode,
        woID: vm.workorder.woID,
        rohsIcon: vm.workorder.rohsIcon,
        rohsName: vm.workorder.rohsName
      };
      DialogFactory.dialogService(
        CORE.ASSEMBLY_STOCK_STATUS_MODAL_CONTROLLER,
        CORE.ASSEMBLY_STOCK_STATUS_MODAL_VIEW,
        event,
        data).then(() => { // Success Section
        }, () => { // Cancel Section
        }, (err) => BaseService.getErrorLog(err));
    };

    // Start - Bind Autocomplete
    /*
   * Author :  Vaibhav Shah
   * Purpose : Get Customer List
   */
    const getCustomerList = () => MasterFactory.getCustomerList().query().$promise.then((customer) => {
      if (customer && customer.data) {
        vm.CustomerList = customer.data;
      }
      return $q.resolve(vm.CustomerList);
    }).catch((error) => BaseService.getErrorLog(error));

    // get callback function on select of customer
    const getcustomerdetail = (item) => {
      vm.headerdata = [];
      if (item) {
        vm.autoCompleteCustomer.keyColumnId = item.id;
        getAssyList();
      } else {
        vm.autoCompleteCustomer.keyColumnId = null;
        vm.assyList = [];
        resetAssemblyDetails();
      }
    };

    /*
   * Author :  Vaibhav Shah
   * Purpose : Get Assy List
   */
    const getAssyList = () => {
      vm.assyList = [];
      const assyId = vm.workorder.partID ? vm.workorder.partID.toString() : null;
      return MasterFactory.getAssyPartList().query({ customerID: vm.autoCompleteCustomer.keyColumnId, assyIds: assyId }).$promise.then((response) => {
        vm.assyList = response && response.data ? response.data : null;
        //if (vm.workorder && vm.workorder.woID) {
        initAutoCompleteAssy();
        //}
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // Reset Assembly releated records
    const resetAssemblyDetails = () => {
      vm.workorder.mfgPN = null;
      vm.workorder.description = null;
      vm.workorder.nickName = null;
      vm.workorder.RoHSStatusID = null;
      vm.workorder.rohsIcon = null;
      vm.workorder.rohsName = null;
      vm.workorder.liveVersion = null;
      vm.autoCompleteAssy.keyColumnId = null;
      if (!vm.workorder.woID) {
        vm.workorder.woNumber = null;
      }
      vm.headerdata = [];
    };

    //on select callback for assembly revision for add new and selected item
    const selectAssyCallBack = (item) => {
      if (!item) {
        resetAssemblyDetails();
        getSalesOrderDetailsWithStock();
      }
      else {
        if (item.isGoodPart !== vm.PartCorrectList.CorrectPart || item.partStatus === vm.CorePartStatusList.TBD) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.RESTRICTED_INCORRECT_PART);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
          return;
        } else if (!item.RoHSStatusID || item.RoHSStatusID === -1) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.INVALID_ROHS_STATUS);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
          return;
        } else {
          vm.previousAssNickNameID = item.id;
          vm.autoCompleteAssy.keyColumnId = item.id;
          if (vm.isLoad) {
            vm.isLoad = false;
          }
          vm.workorder.PIDCode = item.PIDCode;
          vm.workorder.mfgPN = item.mfgPN;
          vm.workorder.description = item.description;
          vm.workorder.nickName = item.nickName;
          vm.workorder.RoHSStatusID = item.RoHSStatusID;
          vm.workorder.liveVersion = item.liveVersion;
          vm.EmptyMesssageSalesOrder.MESSAGE = stringFormat(vm.EmptyMesssageSalesOrder.MESSAGE, vm.workorder.PIDCode);
          vm.workorder.rohsIcon = rohsImagePath + (vm.IsEdit ? vm.workorder.rohs.rohsIcon : item.rohsIcon);
          vm.workorder.rohsName = vm.IsEdit ? vm.workorder.rohs.name : item.rohsName;
          getSalesOrderDetailsWithStock();
          //getwoMaxNumber();
          if (vm.workorder && vm.workorder.woID) {
            setWoType();
          }
        }
      }
    };

    /* get all existing location sample details */
    const getAllLocationDetails = (searchObj) => {
      vm.allLocationList = [];
      return WorkorderFactory.getAllLocationDetailsOfSample().save(searchObj).$promise.then((allLocations) => {
        if (allLocations && allLocations.data) {
          vm.allLocationList = allLocations.data;
        }
        return $q.resolve(vm.allLocationList);
      }).catch((error) => BaseService.getErrorLog(error));
    };


    // initalize autocomplete for customer
    const initAutoComplete = () => {
      vm.autoCompleteCustomer = {
        columnName: 'mfgCodeName',
        controllerName: USER.ADMIN_CUSTOMER_ADD_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_CUSTOMER_ADD_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.workorder ? (vm.workorder.customerID ? vm.workorder.customerID : null) : null,
        addData: {
          customerType: CORE.CUSTOMER_TYPE.CUSTOMER, popupAccessRoutingState: [USER.ADMIN_MANAGECUSTOMER_DETAIL_STATE],
          pageNameAccessLabel: CORE.PageName.customer
        },
        inputName: 'Customer',
        placeholderName: 'Customer',
        isRequired: true,
        isAddnew: true,
        callbackFn: getCustomerList,
        onSelectCallbackFn: getcustomerdetail
      };
      // initalize autocomplete for location details
      vm.autoCompleteLocationDet = {
        columnName: 'locationDetails',
        keyColumnName: 'locationDetails',
        keyColumnId: vm.workorder ? vm.workorder.locationDetails : null,
        inputName: 'LocationDetails',
        placeholderName: 'Search text or Add',
        isRequired: vm.workorder.isSampleAvailable ? true : false,
        isAddnew: false,
        callbackFn: getAllLocationDetails,
        onSelectCallbackFn: function (item) {
          vm.autoCompleteLocationDet.searchText = item ? item.locationDetails : vm.autoCompleteLocationDet.searchText;
        }
      };
    };

    // initalize autocomplete for Assembly of customer only
    const initAutoCompleteAssy = () => {
      vm.autoCompleteAssy = {
        columnName: 'PIDCode',
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: (vm.workorder && vm.workorder.partID) ? vm.workorder.partID : null,
        inputName: 'Assembly',
        placeholderName: 'Assy ID',
        isRequired: true,
        isAddnew: true,
        callbackFn: getAssyList,
        onSelectCallbackFn: selectAssyCallBack,
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          category: vm.PartCategory.SubAssembly,
          customerID: vm.autoCompleteCustomer ? vm.autoCompleteCustomer.keyColumnId : null,
          popupAccessRoutingState: [USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE],
          pageNameAccessLabel: CORE.LabelConstant.PART_MASTER.PageName
        }
      };
    };

    // sales order details autocomplete
    const defaultAutoCompleteSalesOrderNumber = {
      columnName: 'salescolumn',
      keyColumnName: 'id',
      keyColumnId: null,
      inputName: '',
      placeholderName: '',
      isRequired: false,
      isAddnew: false,
      onSelectCallbackFn: getSelectedSalesOrderDetail
    };
    // End - Bind Autocomplete

    const setWoType = () => {
      if (vm.workorder.woType) {
        vm.workOrderType = _.find(CORE.workOrderTypesWithECORequestType, (item) => item.value === vm.workorder.woType);
        vm.headerdata.push({ label: 'Type', value: vm.workOrderType.requestType, displayOrder: 1 });
      } else {
        vm.headerdata = [];
      }
    };

    //vm.getRepeatType = () => {
    //  vm.headerdata = [];
    //  if (vm.workorder) {
    //    if (!vm.workorder.isRepeat && vm.workorder.isNewRevision) {
    //      vm.workorder.woType = 1;
    //    } else if (vm.workorder.isRepeat && !vm.workorder.isNewRevision) {
    //      vm.workorder.woType = 2;
    //    } else if (vm.workorder.isRepeat && vm.workorder.isNewRevision) {
    //      vm.workorder.woType = 3;
    //    } else {
    //      vm.workorder.woType = 1;
    //    }
    //  }
    //  setWoType();
    //};

    // get workorder max number
    //const getwoMaxNumber = () => {
    //if (!vm.workorder || !vm.workorder.woID) {
    //  const obj = {
    //    assyID: vm.autoCompleteAssy.keyColumnId
    //  };
    //  return WorkorderFactory.getMaxWorkorderNumberByAssyID().update({ obj: obj }).$promise.then((response) => {
    //    if (response && response.data) {
    //      response.data = _.first(response.data);
    //      vm.workorder.isRepeat = response.data.isRepeat;
    //      vm.workorder.isNewRevision = response.data.isNewRevision;
    //      vm.getRepeatType();
    //      if (response.data.maxValue) {
    //        const woNumber = response.data.maxValue.split('-');
    //        woNumberPrefix = woNumber[0];
    //        const woNumberSuffix = woNumber[1];
    //        if (response.data.isRepeat) {
    //          vm.workorder.woNumber = woNumberPrefix + '-' + prepandZero(parseInt(woNumberSuffix) + 1);
    //        } else {
    //          vm.workorder.woNumber = prepandZeroWoNumber(parseInt(woNumberPrefix) + 1) + '-01';
    //        }
    //      }
    //      return response.data;
    //    }
    //  }).catch((error) => BaseService.getErrorLog(error));
    //}
    //else {
    //setWoType();
    //}
    //};

    vm.bindAutocomplete = () => {
      // on page load bind autocomplete of customer.
      var autocompletePromise = [getCustomerList(), getAllLocationDetails()];
      vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
        $timeout(() => {
          initAutoComplete();
          if (!vm.workorder || !vm.workorder.woID) {
            initAutoCompleteAssy();
          }
          vm.isLoad = true;
        }, _configSelectListTimeout);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.bindAutocomplete();

    vm.checkQty = () => {
      const data = _.find(vm.SalesorderListWoWise, (item) => item.woSalesOrderDetID);
      const excessQty = IfNull(vm.workorder.excessQty, 0);
      if (data) {
        if (vm.buildQty && vm.buildQty >= vm.totalPOqty) {
          vm.minQty = (vm.buildQty - vm.totalPOqty);
          if (excessQty !== vm.minQty || excessQty >= 0) {
            vm.workorder.buildQty = parseInt(vm.workorder.excessQty || 0) + parseInt(vm.totalPOqty);
            //vm.frmWorkOrderDetails.excessQty.$setValidity("invalidexcessQty", false);
            //return;
          }
        } else {
          vm.workorder.buildQty = parseInt(vm.workorder.excessQty || 0) + parseInt(vm.totalPOqty);
        }
      }
      vm.frmWorkOrderDetails.excessQty.$setValidity('invalidexcessQty', true);
    };
    // Check proposed UMID Qty
    vm.checkPropUmidQty = () => {
      if (!vm.workorder.isInternalBuild) {
        vm.workorder.proposedUmidQty = 0;
      } else {
        if (vm.workorder.proposedUmidQty > vm.workorder.buildQty) {
          vm.frmWorkOrderDetails.proposedUmidQty.$setValidity('InValidProposedUmidQty', false);
        } else {
          vm.frmWorkOrderDetails.proposedUmidQty.$setValidity('InValidProposedUmidQty', true);
        }
      }
    };

    if (vm.workorder.woID) {
      vm.excessQty = !vm.workorder.excessQty ? 0 : vm.workorder.excessQty;
      vm.buildQty = IfNull(vm.workorder.buildQty, 0);
    }

    // generate serial# on button click if track op by serial# is true
    vm.generateSerialNo = ($event) => {
      if (!vm.workorder.woID) {
        return;
      }
      const data = {
        woID: vm.workorder.woID,
        woNumber: vm.workorder.woNumber,
        buildQty: vm.workorder.buildQty,
        serialType: CORE.SERIAL_TYPE.MANUFACTURE,
        mfgPN: vm.workorder.mfgPN,
        nickName: vm.workorder.nickName,
        partID: vm.workorder.partID,
        PIDCode: vm.workorder.PIDCode,
        rohsIcon: vm.workorder.rohsIcon,
        rohsName: vm.workorder.rohsName,
        mfgPNDescription: vm.workorder.componentAssembly.mfgPNDescription,
        isRevisedWO: vm.workorder.isRevisedWO,
        woVersion: vm.workorder.woVersion,
        terminateWOID: vm.workorder.terminateWOID
      };
      DialogFactory.dialogService(
        WORKORDER.WORKORDER_GENERATE_SERIAL_POPUP_CONTROLLER,
        WORKORDER.WORKORDER_GENERATE_SERIAL_POPUP_VIEW,
        $event,
        data).then(() => { //Success Section
        }, () => { //Cancel Section
        });
    };


    const confirmBuildQtyTask = (totalPOqty, buildQty, isCheckUnique, ev, isFromSODetail, salesItem, isDeleteSODetail) => {
      /* if totalPOqty > buildQty then take conformation of it. so open confirmation popup for it */
      if (taskConfirmationInfo == null && (vm.prevTotalPoQty !== totalPOqty || vm.prevBuildQty !== buildQty || totalPOqty > buildQty)) {
        const messageContent = vm.IsProductionStart ? angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.WO_BUILD_QTY_CHANGE_REASON_CONFM)
          : angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.WO_POQTY_MORE_THAN_BUILDQTY);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            const data = {
              woID: vm.workorder.woID,
              woNumber: (vm.workorder.woNumber ? vm.workorder.woNumber.toUpperCase() : ''),
              woVersion: (vm.workorder.woVersion ? vm.workorder.woVersion.toUpperCase() : ''),
              IsProductionStart: vm.IsProductionStart,
              confirmationType: CORE.woQtyApprovalConfirmationTypes.BuildQtyConfirmation,
              title: vm.IsProductionStart ? 'Add Comments for Change' : 'Build Quantity Deviation Approval',
              autoRemark: 'PO Qty: <b>' + totalPOqty + '</b> <br/>\
                        Build Qty Old value: <b>' + vm.prevBuildQty + '</b> <br/> \
                        Build Qty New value: <b>' + buildQty + '</b>'
            };

            vm.saveDisable = false;
            DialogFactory.dialogService(
              WORKORDER.WORKORDER_QTY_CONFIRMATION_APPROVAl_CONTROLLER,
              WORKORDER.WORKORDER_QTY_CONFIRMATION_APPROVAl_VIEW,
              ev,
              data).then(() => { // Success Section
              }, (taskConfirmationDetails) => {
                if (taskConfirmationDetails) {
                  taskConfirmationInfo = taskConfirmationDetails;
                  if (isFromSODetail) {
                    addUpdateSalesWorkorderDetails(salesItem, taskConfirmationInfo, isDeleteSODetail);
                  } else {
                    SaveWorkorderInfo(taskConfirmationInfo, isCheckUnique, ev);
                  }
                }
                else {
                  return false;
                }
              });
          }
        }, () => {
          vm.saveDisable = false;
        }).catch((error) => {
          vm.saveDisable = false;
          return BaseService.getErrorLog(error);
        });
      }
      else {
        if (isFromSODetail) {
          addUpdateSalesWorkorderDetails(salesItem, taskConfirmationInfo, isDeleteSODetail);
        } else {
          SaveWorkorderInfo(taskConfirmationInfo, isCheckUnique, ev);
        }
      }
    };
    //vm.SaveWorkorderGenralDetails(true);
    /*
    * Author :  Vaibhav Shah
    * Purpose : Save/Update General Details From Step 1 and Get Certificate Standard List
    */
    let taskConfirmationInfo = null;
    vm.SaveWorkorderGenralDetails = (isCheckUnique, ev, isFromSODetail, salesItem, isDeleteSODetail) => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }
      if (!isFromSODetail) { vm.saveDisable = true; }
      if ((!isDeleteSODetail) && (!isFromSODetail)) {
        if (BaseService.focusRequiredField(vm.frmWorkOrderDetails)) {
          vm.saveDisable = false;
          return;
        }
      }
      const inCompleteSalesDetails = _.find(vm.SalesorderListWoWise, (salesItem) => salesItem.isEditClicked === true);
      if (inCompleteSalesDetails && inCompleteSalesDetails.autoCompleteSalesOrderNumber &&
        inCompleteSalesDetails.autoCompleteSalesOrderNumber.keyColumnId > 0 && (!isFromSODetail)) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SAVE_SALESORDER_DETAILS_FIRST);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
        vm.saveDisable = false;
        return;
      }
      vm.prevTotalPoQty = parseInt(vm.totalPOqty || 0) - parseInt(_.sumBy(vm.SalesorderListWoWise, (item) => (!item.salesOrderDetailID) ? item.poQty : 0));
      vm.prevBuildQty = parseInt(vm.prevBuildQty || 0);
      let totalPOqty = vm.totalPOqty;
      let buildQty = parseInt(vm.workorder.buildQty || 0);
      if (isDeleteSODetail) {
        totalPOqty = vm.totalPOqty - salesItem.poQty;
        buildQty = parseInt(vm.workorder.buildQty || 0) - salesItem.poQty;
        vm.workorder.buildQty = angular.copy(buildQty);
      } else if (isFromSODetail) {
        totalPOqty = _.sumBy(vm.SalesorderListWoWise, (item) => item.poQty);
        vm.totalPOqty = totalPOqty;
        buildQty = _.sumBy(vm.SalesorderListWoWise, (item) => item.poQty) + vm.workorder.excessQty;
      }
      //vm.woAssemblyDetails.firstOPtotalQty
      if (vm.IsProductionStart) {
        // check with workorder operation first operation qty passed
        if (vm.woAssemblyDetails.firstOPtotalQty > buildQty) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.WORKORDER_MINQTY_ALREADY_IN_PUBLISH);
          messageContent.message = stringFormat(messageContent.message, stringFormat('<b>{0}</b>',
            vm.woAssemblyDetails.firstOPtotalQty));
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
          vm.saveDisable = false;
          return;
        }
        else if (vm.oldIsClusterAppliedValue !== vm.workorder.isClusterApplied) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.VALUE_NOT_CHANGE_AS_PRODUCTION_STARTED);
          messageContent.message = stringFormat(messageContent.message, 'operations cluster');
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
          vm.saveDisable = false;
          return;
        }
        else if (vm.prevBuildQty < buildQty || vm.woAssemblyDetails.firstOPtotalQty < buildQty) {
          confirmBuildQtyTask(totalPOqty, buildQty, isCheckUnique, ev, isFromSODetail, salesItem, isDeleteSODetail);
        }
        else if (vm.prevBuildQty === buildQty || vm.woAssemblyDetails.firstOPtotalQty === buildQty) {
          if (isFromSODetail) {
            addUpdateSalesWorkorderDetails(salesItem, taskConfirmationInfo, isDeleteSODetail);
          } else {
            SaveWorkorderInfo(taskConfirmationInfo, isCheckUnique, ev);
          }
        }
      }
      else {
        if (totalPOqty > buildQty) {
          if (vm.prevBuildQty > 0 && vm.prevBuildQty === buildQty) {
            if (isFromSODetail) {
              addUpdateSalesWorkorderDetails(salesItem, taskConfirmationInfo, isDeleteSODetail);
            } else {
              SaveWorkorderInfo(taskConfirmationInfo, isCheckUnique, ev);
            }
          } else {
            confirmBuildQtyTask(totalPOqty, buildQty, isCheckUnique, ev, isFromSODetail, salesItem, isDeleteSODetail);
          }
        }
        else {
          if (isFromSODetail) {
            addUpdateSalesWorkorderDetails(salesItem, taskConfirmationInfo, isDeleteSODetail);
          } else {
            SaveWorkorderInfo(taskConfirmationInfo, isCheckUnique, ev);
          }
        }
      }
    };

    // check build excess qty
    vm.checkBuildExcessQtyValidation = () => {
      if (vm.workorder.buildQty) {
        if (vm.totalPOqty === 0 || vm.totalPOqty == null) {
          //vm.workorder.excessQty = vm.excessQty = vm.workorder.buildQty;
        } else {
          if (vm.workorder.buildQty >= vm.totalPOqty) {
            if (vm.workorder.buildQty !== parseInt(vm.workorder.excessQty || 0) + parseInt(vm.totalPOqty)) {
              vm.excessQty = vm.workorder.excessQty = parseInt(vm.workorder.buildQty) - parseInt(vm.totalPOqty);
            }
          }
          else {
            vm.excessQty = vm.workorder.excessQty = 0;
            vm.frmWorkOrderDetails.excessQty.$setValidity('invalidexcessQty', true);
          }
        }
      } else {
        vm.workorder.buildQty = parseInt(vm.workorder.excessQty || 0) + parseInt(vm.totalPOqty);
      }
      vm.buildQty = vm.workorder.buildQty;
      vm.checkQty();
      vm.checkPropUmidQty();
    };

    // get sum of assigned PO Qty
    vm.setSumPoQty = () => {
      vm.totalPOqty = _.sumBy(vm.SalesorderListWoWise, (o) => o.poQty);
    };

    vm.checkBuildQtyValidation = () => {
      vm.setSumPoQty();
      if (IfNull(vm.totalPOqty, 0) > 0) {
        vm.workorder.buildQty = (IfNull(vm.totalPOqty, 0) + IfNull(vm.workorder.excessQty, 0));
        vm.frmWorkOrderDetails.$dirty = true;
        vm.buildQty = vm.workorder.buildQty;
        vm.checkQty();
      }
    };

    function updateWODetails(workorderInfo, versionModel) {
      vm.checkQty();
      vm.checkPropUmidQty();
      if (BaseService.focusRequiredField(vm.frmWorkOrderDetails)) {
        vm.saveDisable = false;
        return;
      }
      vm.cgBusyLoading = WorkorderFactory.workorder().update({
        id: vm.workorder.woID
      }, workorderInfo).$promise.then((res) => {
        if (res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          vm.workorder.customerID = vm.autoCompleteCustomer.keyColumnId ? vm.autoCompleteCustomer.keyColumnId : null;
          vm.workorder.partID = vm.autoCompleteAssy.keyColumnId;
          if (vm.workorder.woStatus === CORE.WOSTATUS.DRAFT) {
            vm.disableIncludeSubAssembly = false;
          } else {
            vm.disableIncludeSubAssembly = true;
          }
          /* start - update latest quantity value*/
          vm.prevBuildQty = workorderInfo.buildQty;
          /* end - update latest quantity value*/
          getAllLocationDetails();
          // Send details change notification using socket.io
          vm.sendNotification(versionModel);
          vm.frmWorkOrderDetails.$setPristine();
          $scope.$emit('bindWorkorderTreeViewMain', {
            woID: vm.workorder.woID
          });
          vm.refreshWorkOrderHeaderDetails();
          $scope.$broadcast(USER.SampleListRefreshBroadcast, null);
        }
        taskConfirmationInfo = null;
        vm.saveDisable = false;
      }).catch((error) => {
        vm.saveDisable = false;
        return BaseService.getErrorLog(error);
      });
    }

    /* create-update WorkorderInfo */
    const SaveWorkorderInfo = (taskConfirmation, isCheckUnique, ev) => {
      vm.saveDisable = true;
      //if (!vm.workorder.woNumber) {
      //  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.WORKORDER_NUMBER_INVALID);
      //  const model = {
      //    messageContent: messageContent,
      //    multiple: true
      //  };
      //  DialogFactory.messageAlertDialog(model);
      //  vm.saveDisable = false;
      //  return;
      //}
      if (!vm.workorder.isSampleAvailable) {
        vm.workorder.locationDetails = null;
        vm.workorder.sampleDetails = null;
        vm.autoCompleteLocationDet.searchText = null;
      }
      const workorderInfo = {
        woID: vm.workorder.woID,
        woNumber: vm.workorder.woID ? vm.workorder.woNumber.toUpperCase() : null,
        customerID: vm.autoCompleteCustomer.keyColumnId,
        woVersion: (vm.workorder.woVersion ? vm.workorder.woVersion.toUpperCase() : ''),
        buildQty: vm.workorder.isRevisedWO ? null : vm.workorder.buildQty,
        excessQty: vm.workorder.isRevisedWO ? null : vm.workorder.excessQty,
        isSampleAvailable: vm.workorder.isSampleAvailable,
        isClusterApplied: vm.workorder.isClusterApplied,
        isIncludeSubAssembly: vm.workorder.isIncludeSubAssembly,
        isCheckUnique: isCheckUnique ? isCheckUnique : false,
        RoHSStatusID: vm.workorder.RoHSStatusID,
        isOperationTrackBySerialNo: vm.workorder.isOperationTrackBySerialNo,
        ECORemark: vm.workorder.ECORemark,
        FCORemark: vm.workorder.FCORemark,
        initialInternalVersion: vm.workorder.liveVersion,
        locationDetails: vm.autoCompleteLocationDet.searchText,
        sampleDetails: vm.workorder.sampleDetails,
        taskConfirmationInfo: taskConfirmation,
        isRevisedWO: vm.workorder.isRevisedWO,
        isHotJob: vm.workorder.isHotJob ? true : false,
        partID: vm.autoCompleteAssy.keyColumnId,
        //woType: vm.workorder.woType,
        isRackTrackingRequired: vm.workorder.isRackTrackingRequired,
        isStrictlyFollowRackValidation: vm.workorder.isStrictlyFollowRackValidation,
        selectedSampleID: vm.workorder.selectedSampleID || null,
        isInternalBuild: vm.workorder.isInternalBuild,
        proposedUmidQty: vm.workorder.proposedUmidQty ? vm.workorder.proposedUmidQty : 0,
        openingStockOfAssyStockTypeConst: CORE.ASSY_STOCK_TYPE.OpeningStock,
        dateCodeFormat: vm.workorder.dateCodeFormat || null,
        dateCode: vm.workorder.dateCode || null,
        isKitAllocationNotRequired: vm.workorder.isKitAllocationNotRequired || false
      };

      if (vm.workorder.woID) {
        if (vm.workorder.woStatus === CORE.WOSTATUS.PUBLISHED) {
          let isWOChanged = false;
          if (vm.frmWorkOrderDetails.$dirty) {
            vm.frmWorkOrderDetails.$$controls.forEach((control) => {
              if (control.$dirty && control.$name) {
                if (control.$$controls) {
                  control.$$controls.forEach((childControl) => {
                    if (childControl.$dirty) {
                      isWOChanged = true;
                    }
                  });
                }
                else {
                  if (control.$$element.is('text-angular')) {
                    if (vm.operation[control.$name] !== vm.operationMain[control.$name]) {
                      isWOChanged = true;
                    }
                  }
                  else {
                    isWOChanged = true;
                  }
                }
              }
            });
          }

          if (isWOChanged) {
            vm.saveDisable = false;
            vm.openWORevisionPopup((versionModel) => {
              // Added for close revision dialog popup
              if (versionModel && versionModel.isCancelled) {
                return;
              }
              if (versionModel) {
                // update woVersion into obj as vm.workorder.woVersion may be updated by openWORevisionPopup
                workorderInfo.woVersion = (vm.workorder.woVersion ? vm.workorder.woVersion.toUpperCase() : '');

                updateWODetails(workorderInfo, versionModel);
              }
              else if (versionModel !== false) {
                updateWODetails(workorderInfo);
              }
            }, ev);
          }
          else {
            updateWODetails(workorderInfo);
          }
        }
        else {
          updateWODetails(workorderInfo);
        }
      }
      else {
        vm.cgBusyLoading = WorkorderFactory.workorder().save(workorderInfo).$promise.then((res) => {
          if (res.data && res.data.woID) {
            vm.id = vm.workorder.woID = res.data.woID;
            vm.workorder.woNumber = res.data.woNumber;
            vm.workorder.woType = res.data.woType;
            vm.workorder.systemID = res.data.systemID;
            getAllDetails();
            getAllLocationDetails();
            setWoType();
            vm.workorder.customerID = vm.autoCompleteCustomer.keyColumnId ? vm.autoCompleteCustomer.keyColumnId : null;
            vm.workorder.partID = vm.autoCompleteAssy.keyColumnId ? vm.autoCompleteAssy.keyColumnId : null;
            if (vm.workorder.woStatus === CORE.WOSTATUS.DRAFT) {
              vm.disableIncludeSubAssembly = false;
            }
            else {
              vm.disableIncludeSubAssembly = true;
            }
            /* start - update latest quantity value*/
            vm.prevBuildQty = workorderInfo.buildQty;
            /* end - update latest quantity value*/
            //vm.isOperationTrackBySerialNo = vm.workorder.isOperationTrackBySerialNo;
            taskConfirmationInfo = null;
            vm.frmWorkOrderDetails.$setPristine();
            $state.transitionTo($state.$current, {
              woID: vm.workorder.woID
            }, { location: true, inherit: true, notify: false, reload: true });
            $scope.$emit('bindWorkorderTreeViewMain', {
              woID: vm.workorder.woID
            });
            vm.refreshWorkOrderHeaderDetails(); // refresh work order header details
          }
          // removed code as message will come from API
          taskConfirmationInfo = null;
          vm.saveDisable = false;
        }).catch((error) => {
          vm.saveDisable = false;
          return BaseService.getErrorLog(error);
        });
      }
    };

    // sales order section start
    const defaultsalesOrder = {
      woSalesOrderDetID: null,
      partID: null,
      salesOrderDetailID: null,
      selectedSalesOrderNumber: null,
      isEditClicked: false,
      poNumber: null,
      poQty: null,
      isHotJob: false,
      idlePOQty: null,
      scrapQty: null,
      oldPOQty: 0,
      autoCompleteSalesOrderNumber: {}
    };

    const assignIdleQtyToObject = (salesItem, isAdd) => {
      if (isAdd) {
        const poDetails = _.filter(vm.poAssemblyDetails, (obj) => salesItem.id === obj.salesOrderDetailID);
        let totalAssignedPOQty = 0;
        let totalAssignedScrappedQty = 0;
        if (salesItem && poDetails.length > 0) {
          totalAssignedPOQty = (_.sumBy(poDetails, (o) => parseInt(o.woPOQty)));
          totalAssignedScrappedQty = (_.sumBy(poDetails, (o) => {
            if (o.woID !== vm.workorder.woID) {
              return parseInt(o.woScrapQty);
            }
          }));
          salesItem.actualIdlePOQty = IfNull(salesItem.qty, 0) - IfNull(totalAssignedPOQty, 0) + IfNull(totalAssignedScrappedQty, 0);
          salesItem.idlePOQty = IfNull(salesItem.qty, 0) - IfNull(totalAssignedPOQty, 0) + IfNull(totalAssignedScrappedQty, 0);
        } else {
          salesItem.actualIdlePOQty = IfNull(salesItem.qty, 0);
          salesItem.idlePOQty = IfNull(salesItem.qty, 0);
        }
        salesItem.oldPOQty = IfNull(salesItem.qty, 0);
        salesItem.poQty = salesItem.idlePOQty;
      } else {
        const allPODetails = _.filter(vm.poAssemblyDetails, (obj) => salesItem.salesOrderDetailID === obj.salesOrderDetailID);
        // remove exisiting record qty from edit case.
        const poDetails = _.filter(vm.poAssemblyDetails, (obj) => salesItem.salesOrderDetailID === obj.salesOrderDetailID && salesItem.woSalesOrderDetID !== obj.woSalesOrderDetID);
        if (salesItem && allPODetails.length > 0) {
          let totalAssignedAllPOQty = 0;
          let totalAssignedAllScrappedQty = 0;
          let totalAssignedPOQty = 0;
          let totalAssignedScrappedQty = 0;
          if (allPODetails.length > 0) {
            totalAssignedAllPOQty = (_.sumBy(allPODetails, (o) => parseInt(o.woPOQty)));
            totalAssignedAllScrappedQty = (_.sumBy(allPODetails, (o) => parseInt(o.woScrapQty)));
            salesItem.actualIdlePOQty = IfNull(salesItem.qty, 0) - IfNull(totalAssignedAllPOQty, 0) + IfNull(totalAssignedAllScrappedQty, 0);
          }
          if (poDetails.length > 0) {
            totalAssignedPOQty = (_.sumBy(poDetails, (o) => parseInt(o.woPOQty)));
            totalAssignedScrappedQty = (_.sumBy(poDetails, (o) => {
              if (o.woID !== vm.workorder.woID) {
                return parseInt(o.woScrapQty);
              }
            }));
            salesItem.idlePOQty = IfNull(salesItem.qty, 0) - IfNull(totalAssignedPOQty, 0) + IfNull(totalAssignedScrappedQty, 0);
          } else {
            salesItem.idlePOQty = IfNull(salesItem.qty, 0);
          }
        } else {
          salesItem.actualIdlePOQty = IfNull(salesItem.qty, 0);
          salesItem.idlePOQty = IfNull(salesItem.qty, 0);
        }
        salesItem.oldPOQty = IfNull(salesItem.qty, 0);
      }
    };

    // empty sales order object for work order sales order details auto complete
    function addEmptysalesOrder(objItem, setFocus) {
      var EmptyObj = angular.copy(defaultsalesOrder);
      EmptyObj.autoCompleteSalesOrderNumber = angular.copy(defaultAutoCompleteSalesOrderNumber);
      EmptyObj.isEditClicked = true;
      EmptyObj.assyType = objItem ? objItem.assyType : 1;
      EmptyObj.filteredSOList = _.filter(vm.SalesOrderNumberList, (item) => item.AssyType === EmptyObj.assyType);
      EmptyObj.isCustomFocus = setFocus;
      vm.SalesorderListWoWise.push(EmptyObj);
    };
    // let totalPOqty = 0;
    function getAllDetails() {
      vm.isWOSalesOrderDetails = false;
      const promises = [getsalesOrderDetailWowise(), getIdlePOQtyByAssyID()];
      vm.cgBusyLoading = $q.all(promises).then((response) => {
        getsalesOrderDetailWowiseResp = response[0] === undefined ? [] : response[0];
        if (getsalesOrderDetailWowiseResp) {
          if (getsalesOrderDetailWowiseResp.length === 0) {
            vm.isWOSalesDetAdded = false;
          } else {
            vm.isWOSalesDetAdded = true;
          }
          vm.isWOSalesOrderDetails = true;
          getsalesOrderDetailWowiseResp.forEach((x) => {
            if (x.woSalesOrderDetID) {
              const getsalesOrderDetailWowiseObj = angular.copy(defaultsalesOrder);
              getsalesOrderDetailWowiseObj.woSalesOrderDetID = x.woSalesOrderDetID;
              getsalesOrderDetailWowiseObj.salesOrderDetailID = x.salesOrderDetailID;
              getsalesOrderDetailWowiseObj.refSalesOrderID = x.SalesOrderDetails.refSalesOrderID;
              getsalesOrderDetailWowiseObj.poNumber = x.refPONumber;
              getsalesOrderDetailWowiseObj.kitReleaseCnt = x.SalesOrderDetails.kitReleaseCnt ? x.SalesOrderDetails.kitReleaseCnt : 0;
              getsalesOrderDetailWowiseObj.poQty = x.poQty;
              getsalesOrderDetailWowiseObj.salesOrderNumber = x.SalesOrderDetails.salesOrderMst ? x.SalesOrderDetails.salesOrderMst.salesOrderNumber : null;
              getsalesOrderDetailWowiseObj.lineID = x.SalesOrderDetails.lineID;
              getsalesOrderDetailWowiseObj.mrpQty = x.SalesOrderDetails.mrpQty;
              getsalesOrderDetailWowiseObj.uniqueID = x.SalesOrderDetails.id;
              getsalesOrderDetailWowiseObj.partID = x.SalesOrderDetails.partID;
              getsalesOrderDetailWowiseObj.scrapQty = IfNull(x.scrapQty, 0);
              getsalesOrderDetailWowiseObj.qpaa = x.qpa;
              getsalesOrderDetailWowiseObj.originalQty = x.SalesOrderDetails.qty;
              x.SalesOrderDetails.qty = (getsalesOrderDetailWowiseObj.qpaa ? getsalesOrderDetailWowiseObj.qpaa : 1) * x.SalesOrderDetails.qty;
              getsalesOrderDetailWowiseObj.qty = x.SalesOrderDetails.qty;
              // need to check blanck PO issue - 30/01/2020
              getsalesOrderDetailWowiseObj.parentPartID = vm.workorder.partID;
              getsalesOrderDetailWowiseObj.assyType = (vm.workorder.partID === getsalesOrderDetailWowiseObj.partID) ? 1 : 2;
              getsalesOrderDetailWowiseObj.filteredSOList = _.filter(vm.SalesOrderNumberList, (item) => item.AssyType === getsalesOrderDetailWowiseObj.assyType);
              getsalesOrderDetailWowiseObj.autoCompleteSalesOrderNumber = angular.copy(defaultAutoCompleteSalesOrderNumber);
              getsalesOrderDetailWowiseObj.autoCompleteSalesOrderNumber.keyColumnId = getsalesOrderDetailWowiseObj.salesOrderDetailID;
              if (getsalesOrderDetailWowiseObj.assyType === 2) {
                _.each(getsalesOrderDetailWowiseObj.filteredSOList, (item) => {
                  if (getsalesOrderDetailWowiseObj.autoCompleteSalesOrderNumber.keyColumnId === item.id) {
                    getsalesOrderDetailWowiseObj.PIDCode = item.PIDCode;
                    getsalesOrderDetailWowiseObj.rohsIcon = rohsImagePath + item.rohsIcon;
                    getsalesOrderDetailWowiseObj.rohsName = item.rohsName;
                  }
                });
              } else {
                const comnpObj = _.find(vm.SalesOrderNumberList, (item) => item.AssyType === getsalesOrderDetailWowiseObj.assyType && item.partID === x.partID);
                if (comnpObj) {
                  getsalesOrderDetailWowiseObj.PIDCode = comnpObj.PIDCode;
                  getsalesOrderDetailWowiseObj.rohsIcon = rohsImagePath + comnpObj.rohsIcon;
                  getsalesOrderDetailWowiseObj.rohsName = comnpObj.rohsName;
                }
              }
              //SalesOrderNumberListd

              // remove exisiting record qty from edit case.
              assignIdleQtyToObject(getsalesOrderDetailWowiseObj, false);
              vm.SalesorderListWoWise.push(getsalesOrderDetailWowiseObj);
            }
          });
          addEmptysalesOrder();
          vm.checkFirstSalesOrderDetails();
          vm.setSumPoQty();
          vm.checkQty();
          vm.checkPropUmidQty();
        }
      }).catch((error) => {
        vm.saveDisable = false;
        return BaseService.getErrorLog(error);
      });
    }

    //get salesorder detail from combination of Assembly.
    function getSalesOrderDetail() {
      let sales;
      if (vm.autoCompleteAssy && vm.autoCompleteAssy.keyColumnId) {
        const shippingInfo = {
          partID: vm.autoCompleteAssy.keyColumnId,
          woID: vm.workorder.woID,
          customerID: vm.autoCompleteCustomer.keyColumnId
        };
        return SalesOrderFactory.getActiveSalesOrderDetailsList().query({
          shippingObj: shippingInfo
        }).$promise.then((res) => {
          vm.salesOrderData = res.data;
          if (res && res.data && res.data.length > 0) {
            vm.SalesOrderNumberList = [];
            sales = _.filter(vm.salesOrderData, (item) => item.salesOrderNumber != null && !item.isCancle);
            if (sales) {
              _.each(sales, (s) => {
                s['originalQty'] = s['qty'];
                s['qty'] = (s.qpaa ? s.qpaa : 1) * s['qty'];
                // to remove already added po qty sales order details from list
                if (s.totalAssignedQty < s.qty) {
                  s.salescolumn = stringFormat('{0}, {1}, {2} ({3})', s.salesOrderNumber, s.PIDCode, s.originalQty, s.lineID);
                  s.isActive = (s.status === CORE.DisplayStatus.Published.ID.toString()) ? true : false;
                  vm.SalesOrderNumberList.push(s);
                }
              });
            }
            if (vm.SalesOrderNumberList.length > 0) {
              //vm.SalesOrderNumberList = _.uniqBy(vm.SalesOrderNumberList, v => [v.id, v.prPerPartID].join());
              vm.SalesOrderNumberList = _.uniqBy(vm.SalesOrderNumberList, (v) => [v.id].join());
            }
            getAllDetails();
          } else {
            vm.SalesOrderNumberList = [];
          }
          return $q.resolve(vm.salesOrderData);
        }).catch((error) => {
          vm.saveDisable = false;
          return BaseService.getErrorLog(error);
        });
      }
      else {
        //if (vm.SalesorderListWoWise && vm.SalesorderListWoWise.length > 1 && vm.autoCompleteAssy && vm.autoCompleteAssy.keyColumnId) {
        if (vm.SalesorderListWoWise && vm.SalesorderListWoWise.length > 1) {  /* to removed saved sales order details */
          //set focus on workorder number hide autocomplete popup of assemblt nick name - vaibhav
          angular.element(document.querySelector('#woDescription')).click();
          const obj = {
            title: CORE.MESSAGE_CONSTANT.CHANGE_ASSY_REV_CONFIRMATION_HEADER,
            textContent: CORE.MESSAGE_CONSTANT.CHANGE_ASSY_REV_CONFIRMATION_BODY_MESSAGE,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          return DialogFactory.confirmDiolog(obj).then((yes) => {
            if (yes) {
              const Info = {
                woID: vm.workorder.woID
              };
              return WorkorderSalesOrderDetailsFactory.deleteWoSalesOrderAssyRevisionWise().update({
                woID: vm.workorder.woID
              }, Info).$promise.then(() => {
                vm.SalesOrderNumberList = [];
                getAllDetails();
              }).catch((error) => {
                vm.saveDisable = false;
                return BaseService.getErrorLog(error);
              });
            }
          }, () => {
            if (!vm.autoCompleteAssy.keyColumnId) {
              vm.autoCompleteAssy.keyColumnId = vm.previousAssNickNameID;
            }
          }).catch((error) => {
            vm.saveDisable = false;
            return BaseService.getErrorLog(error);
          });
        }
        else {
          /* case: if sale order details selected below without save and that time change assy id
                  then remove all selected data */
          vm.SalesOrderNumberList = [];
          vm.SalesorderListWoWise = [];
        }
        return $q.resolve();
      }
    }

    function getSelectedSalesOrderDetail(selectedSalesOrderItem, salesItem) {
      if (!salesItem.woSalesOrderDetID && selectedSalesOrderItem && selectedSalesOrderItem.id) {
        const salesOrderFound = _.find(vm.SalesorderListWoWise, (item) => item.salesOrderDetailID === selectedSalesOrderItem.id);
        if (salesOrderFound) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SALESORDER_ALREADY_ADDED_UPDATE_QTY_IN_SAME);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model).then(() => {
            // remove last record from array
            vm.SalesorderListWoWise.pop();
            // add new empty salesorder details
            addEmptysalesOrder(salesItem, true);
          });
          return false;
        } else if (selectedSalesOrderItem && selectedSalesOrderItem.initialStockCount > 0) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.WO_SO_NOT_ALLOWED_INITIAL_STOCK_CREATED);
          messageContent.message = stringFormat(messageContent.message, selectedSalesOrderItem.salesOrderNumber);
          const obj = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(obj).then(() => {
            // remove last record from array
            vm.SalesorderListWoWise.pop();
            // add new empty salesorder details
            addEmptysalesOrder(salesItem, true);
            return false;
          });
        }
      }
      let sales;
      salesItem.poNumber = selectedSalesOrderItem ? selectedSalesOrderItem.poNumber : null;
      if (salesItem.filteredSOList.length > 0) {
        if (selectedSalesOrderItem) {
          sales = _.filter(salesItem.filteredSOList, (item) => item.id === selectedSalesOrderItem.id);
          if (sales) {
            sales = _.first(sales);
          }
          // assigned sales order detail id after select from auto complete.
          salesItem.id = selectedSalesOrderItem.id;
          salesItem.PIDCode = selectedSalesOrderItem.PIDCode;
          salesItem.rohsIcon = rohsImagePath + selectedSalesOrderItem.rohsIcon;
          salesItem.rohsName = selectedSalesOrderItem.rohsName;
          salesItem.partID = selectedSalesOrderItem.partID;
          salesItem.parentPartID = vm.autoCompleteAssy.keyColumnId;
          salesItem.qpaa = selectedSalesOrderItem.qpaa;

          // assigned qty from sales order detail
          salesItem.qty = sales.qty;
          salesItem.isHotJob = sales.isHotJob;
          if (!vm.workorder.isHotJob && sales.isHotJob) {
            vm.workorder.isHotJob = true;
          }
          if (!salesItem.woSalesOrderDetID) {
            // new record qty from add case.
            assignIdleQtyToObject(salesItem, true);
            salesItem.scrapQty = 0;
          } else {
            // remove exisiting record qty from edit case.
            assignIdleQtyToObject(salesItem, false);
          }
        } else {
          salesItem.poQty = 0;
          salesItem.oldPOQty = 0;
          salesItem.scrapQty = 0;
          salesItem.actualIdlePOQty = 0;
          salesItem.idlePOQty = 0;
          salesItem.isHotJob = false;
          salesItem.PIDCode = null;
          salesItem.rohsIcon = null;
          salesItem.rohsName = null;
          salesItem.parentPartID = null;
          salesItem.qpaa = 0;
          salesItem.qty = 0;
        }
      }
    }

    //get sales order detail by woID wise.
    function getsalesOrderDetailWowise() {
      vm.SalesorderListWoWise = [];
      if (vm.workorder.woID) {
        return WorkorderSalesOrderDetailsFactory.getSalesOrderWoIDwise().query({ woID: vm.workorder.woID }).$promise.then((res) => $q.resolve(res.data))
          .catch((error) => {
            vm.saveDisable = false;
            return BaseService.getErrorLog(error);
          });
      }
    }

    //save workorder sales order detail
    vm.SaveWoSalesOrdrDetail = (salesItem, index, ev) => {
      vm.saveSODisable = true;
      if (BaseService.focusRequiredField(vm.WoSalesOrderDetails['woSoDtl_' + index])) {
        vm.saveSODisable = false;
        return;
      }
      const totalScrapQty = _.sumBy(vm.SalesorderListWoWise, (o) => IfNull(o.scrapQty, 0));
      let messageContent;
      // in all of below no need to add scrap qty validation  (salesItem.scrapQty < 0 ||  !vm.WoSalesOrderDetails['scrapQty' + $index].$valid)
      // as it is hidden in UI and it will be managed by mean of Internal PO.
      if (!salesItem.autoCompleteSalesOrderNumber.keyColumnId) {
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContent.message = stringFormat(messageContent.message, 'sales order detail.');
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
        vm.saveSODisable = false;
        return;
      } else if (!salesItem.poQty || salesItem.poQty < 0) { // || salesItem.scrapQty < 0 || !vm.WoSalesOrderDetails['scrapQty' + $index].$valid) {
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.INVALID_WO_SO_PO_QTY);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
        vm.saveSODisable = false;
        return;
      } else if (vm.workorder.woStatus === vm.DisplayStatus.Published.ID || vm.isWOUnderTermination) {
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.WO_SO_DTL_NOT_ALLOW_CHANGE);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
        vm.saveSODisable = false;
        return;
      } else if (totalScrapQty > 0 && (totalScrapQty > vm.woAssemblyDetails.scrapQty)) {
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SCRAP_QTY_INVALID);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
        vm.saveSODisable = false;
        return;
      } else {
        //addUpdateSalesWorkorderDetails(salesItem);
        vm.SaveWorkorderGenralDetails(false, ev, true, salesItem);
      }
    };
    //on edit click of particular sales order item.
    vm.woSalesOrderEditClicked = (salesItem) => {
      vm.cgBusyLoading = WorkorderSalesOrderDetailsFactory.checkKitReleaseBySalesOrderDetID().query({ woID: vm.workorder.woID, salesOrderDetID: salesItem.salesOrderDetailID }).$promise.then((res) => {
        if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          if (res.data && res.data.kitReleaseCnt === 0) {
            vm.previousIndividualPOqty = salesItem.poQty;
            salesItem.isEditClicked = true;
          } else {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.UPDATE_SALES_DETAIL_WITH_KIT_RELEASE);
            messageContent.message = stringFormat(messageContent.message, 'changed in');
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model);
          }
        }
      });
    };

    //delete workorder sales order detail
    vm.deleteWoSalesOrdrDetail = (salesItem, ev) => {
      vm.cgBusyLoading = WorkorderSalesOrderDetailsFactory.checkKitReleaseBySalesOrderDetID().query({ woID: vm.workorder.woID, salesOrderDetID: salesItem.salesOrderDetailID }).$promise.then((res) => {
        if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          // allow to delete only if kit not released yet
          if (res.data && res.data.kitReleaseCnt === 0) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
            messageContent.message = stringFormat(messageContent.message, 'Work Order Sales Order detail', 1);
            const obj = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
              anbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
            };
            DialogFactory.messageConfirmDialog(obj).then((yes) => {
              if (yes) {
                vm.SaveWorkorderGenralDetails(false, ev, true, salesItem, true);
              }
            }, () => { // Cancel Section
            }).catch((error) => BaseService.getErrorLog(error));
          }
          else {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.UPDATE_SALES_DETAIL_WITH_KIT_RELEASE);
            messageContent.message = stringFormat(messageContent.message, 'removed from');
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model);
          }
        }
      });
    };


    vm.refreshSalesOrder = () => {
      getSalesOrderDetailsWithStock();
    };
    // get assembly stock status list
    const getIdlePOQtyByAssyID = () => {
      vm.woAssemblyDetails = null;
      vm.poAssemblyDetails = null;
      const listObj = {
        assyID: vm.autoCompleteAssy.keyColumnId,
        woID: vm.workorder ? vm.workorder.woID : null
      };
      return WorkorderFactory.getIdlePOQtyByAssyID().query({
        listObj: listObj
      }).$promise.then((assemblyDetails) => {
        vm.woAssemblyDetails = _.first(angular.copy(assemblyDetails.data.woAssemblyDetails));
        vm.poAssemblyDetails = angular.copy(assemblyDetails.data.poAssemblyDetails);
      }).catch((error) => {
        vm.saveDisable = false;
        return BaseService.getErrorLog(error);
      });
    };

    const getSalesOrderDetailsWithStock = () => {
      var detailPromise = [getSalesOrderDetail()];
      vm.cgBusyLoading = $q.all(detailPromise).then(() => { // Success Section
      }).catch((error) => {
        vm.saveDisable = false;
        return BaseService.getErrorLog(error);
      });
    };

    // Allow max assign qty = Total Idle Qty + Total Scrapped Qty
    vm.getMaxAssignQty = (list, salesItem) => IfNull(salesItem.idlePOQty, 0) + IfNull(salesItem.scrapQty, 0);

    // Allow max scrap qty = Total Idle Qty + Total Scrapped Qty
    vm.getMaxScrapQty = (list, salesItem, scrapQty) => {
      const totalPOScrapQty = _.sumBy(list, (o) => {
        if (salesItem !== o) {
          return parseInt(o.scrapQty);
        }
      });
      return (IfNull(scrapQty, 0) - IfNull(totalPOScrapQty, 0));
    };

    // Assign Current Forms to service
    angular.element(() => BaseService.currentPageForms = [vm.frmWorkOrderDetails, vm.WoSalesOrderDetails]);

    // Start - Utility
    /* called for max length validation */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    //close popup on page destroy
    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, {
        closeAll: true
      });
    });

    // End - Utility

    // bind sub assembly details
    vm.bindAssembly = (salesItem) => {
      salesItem.autoCompleteSalesOrderNumber.keyColumnId = null;
      salesItem.filteredSOList = _.filter(vm.SalesOrderNumberList, (item) => item.AssyType === salesItem.assyType);
    };

    // to show sales order details below
    vm.checkFirstSalesOrderDetails = () => {
      vm.foundSOWithDetails = _.first(vm.SalesorderListWoWise);
      //salesOrderDetailID
      vm.ShowSubAssemblyList = vm.foundSOWithDetails ? true : false;
    };

    //Reset After Add/Update WO Details
    vm.resetAssemblyDetails = () => {
      vm.checkBuildQtyValidation();
      vm.refreshWorkOrderHeaderDetails();
      vm.refreshSalesOrder();
      vm.checkFirstSalesOrderDetails();
    };

    vm.changeInternalBuild = () => {
      if (!vm.workorder.isInternalBuild) {
        vm.workorder.proposedUmidQty = 0;
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      const result = BaseService.checkFormDirty(form, columnName);
      return result;
    };

    vm.checkDateCode = () => {
      vm.isInValidDatecode = BaseService.validateDateCode(vm.workorder.dateCodeFormat, vm.workorder.dateCode);
      vm.frmWorkOrderDetails.dateCode.$setValidity('isInValidDatecode', !vm.isInValidDatecode);
    };

    // open work order number build history pop up
    vm.viewWONumberBuildHistory = (event) => {
      const data = {
        partID: vm.workorder.partID || null,
        assyNickName: vm.workorder.nickName || null
      };
      DialogFactory.dialogService(
        CORE.WO_BUILD_HISTORY_COMP_NICKNAME_POPUP_CONTROLLER,
        CORE.WO_BUILD_HISTORY_COMP_NICKNAME_POPUP_VIEW,
        event,
        data).then(() => { // Success Section
        }, () => { // Cancel Section
        }, (err) => BaseService.getErrorLog(err));
    };

    const addUpdateSalesWorkorderDetails = (salesItem, taskConfirmation, isDeleteSODetail) => {
      const data = _.find(vm.SalesorderListWoWise, (item) => item.woSalesOrderDetID === salesItem.woSalesOrderDetID ? salesItem.woSalesOrderDetID : null);
      let diff;
      if (!isDeleteSODetail) {
        if (vm.previousIndividualPOqty && data && data.poQty) {
          if (vm.previousIndividualPOqty > data.poQty) {
            diff = vm.previousIndividualPOqty - parseInt(data.poQty);
            vm.totalPOqty = vm.totalPOqty - diff;
          } else {
            diff = parseInt(data.poQty) - vm.previousIndividualPOqty;
            vm.totalPOqty = vm.totalPOqty + diff;
          }
        }
        const woSalesOrderInfo = {
          woID: vm.workorder.woID,
          woNumber: vm.workorder.woNumber,
          woSalesOrderDetID: salesItem.woSalesOrderDetID,
          poQty: salesItem.poQty,
          scrapQty: salesItem.scrapQty,
          qpa: salesItem.qpaa,
          //partID: (salesItem.autoCompleteSubAssembly && salesItem.autoCompleteSubAssembly.keyColumnId) ? salesItem.autoCompleteSubAssembly.keyColumnId : salesItem.partID,
          partID: salesItem.partID,
          parentPartID: vm.autoCompleteAssy.keyColumnId,
          salesOrderDetailID: salesItem.autoCompleteSalesOrderNumber.keyColumnId ? salesItem.autoCompleteSalesOrderNumber.keyColumnId : null,
          buildQty: vm.workorder.buildQty,
          taskConfirmationInfo: taskConfirmation
          // refPONumber: salesItem.poNumber
        };
        if (woSalesOrderInfo.woSalesOrderDetID) {
          vm.cgBusyLoading = WorkorderSalesOrderDetailsFactory.updateWoSalesOrder().update({ woSalesOrderDetID: woSalesOrderInfo.woSalesOrderDetID }, woSalesOrderInfo).$promise.then((res) => {
            if (res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              vm.saveSODisable = false;
              salesItem.isEditClicked = false;
              vm.resetAssemblyDetails();
              /* start - update latest quantity value*/
              vm.prevBuildQty = vm.workorder.buildQty;
              /* end - update latest quantity value*/
              taskConfirmationInfo = null;
              vm.WoSalesOrderDetails.$setPristine();
              vm.frmWorkOrderDetails.$setPristine();
              vm.frmWorkOrderDetails.$dirty = false;
              //vm.checkBuildQtyValidation();
              // vm.refreshWorkOrderHeaderDetails();
              //vm.refreshSalesOrder();
              //vm.checkFirstSalesOrderDetails();
            } else {
              vm.saveSODisable = false;
            }
          }).catch((error) => {
            vm.saveDisable = false;
            vm.saveSODisable = false;
            return BaseService.getErrorLog(error);
          });
        } else {
          vm.cgBusyLoading = WorkorderSalesOrderDetailsFactory.saveWoSalesOrder().save(woSalesOrderInfo).$promise.then((res) => {
            if (res && res.data && res.data.woSalesOrderDetID) {
              vm.saveSODisable = false;
              salesItem.isEditClicked = false;
              salesItem.woSalesOrderDetID = res.data.woSalesOrderDetID;
              salesItem.salesOrderDetailID = res.data.salesOrderDetailID;
              //salesItem.parentPartID = res.data.partID;              
              addEmptysalesOrder();
              vm.resetAssemblyDetails();
              /* start - update latest quantity value*/
              vm.prevBuildQty = vm.workorder.buildQty;
              /* end - update latest quantity value*/
              taskConfirmationInfo = null;
              vm.WoSalesOrderDetails.$setPristine();
              vm.frmWorkOrderDetails.$setPristine();
              vm.frmWorkOrderDetails.$dirty = false;
              //vm.checkBuildQtyValidation();
              // vm.refreshWorkOrderHeaderDetails();
              //vm.refreshSalesOrder();
              //vm.checkFirstSalesOrderDetails();
            } else {
              vm.saveSODisable = false;
            }
          }).catch((error) => {
            vm.saveDisable = false;
            vm.saveSODisable = false;
            return BaseService.getErrorLog(error);
          });
        }
      } else {
        const woSalesOrderDetObj = {
          woID: vm.workorder.woID,
          woNumber: vm.workorder.woNumber,
          poQty: salesItem.poQty,
          scrapQty: salesItem.scrapQty,
          partID: salesItem.partID,
          parentPartID: vm.autoCompleteAssy.keyColumnId,
          salesOrderDetailID: salesItem.autoCompleteSalesOrderNumber.keyColumnId ? salesItem.autoCompleteSalesOrderNumber.keyColumnId : null
        };
        const woDetailUpdateObj = {
          woID: vm.workorder.woID,
          buildQty: vm.workorder.buildQty,
          taskConfirmationInfo: taskConfirmation
        };
        vm.cgBusyLoading = WorkorderSalesOrderDetailsFactory.WoSalesOrder().delete({
          woSalesOrderDetID: salesItem.woSalesOrderDetID,
          woSalesOrderDetObj: woSalesOrderDetObj
        }, woDetailUpdateObj).$promise.then((res) => {
          if (res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            vm.SalesorderListWoWise = _.reject(vm.SalesorderListWoWise, (item) => item.woSalesOrderDetID === salesItem.woSalesOrderDetID);
            vm.checkBuildQtyValidation();
            vm.WoSalesOrderDetails.$setPristine();
            vm.frmWorkOrderDetails.$setPristine();
            vm.frmWorkOrderDetails.$dirty = false;
            vm.refreshWorkOrderHeaderDetails();
            getAllDetails();
            taskConfirmationInfo = null;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
  }
})();
