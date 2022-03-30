
(function () {
  'use strict';

  angular
    .module('app.transaction.kitAllocation')
    .controller('KitReleaseMismatchInventoryPopUpController', KitReleaseMismatchInventoryPopUpController);

  /** @ngInject */
  function KitReleaseMismatchInventoryPopUpController($scope, $q, $mdDialog, $filter, BaseService, DialogFactory, USER, CORE, data, KitAllocationFactory, TransferStockFactory, TRANSACTION,
    ReceivingMaterialFactory, WarehouseBinFactory, BinFactory, NotificationFactory, socketConnectionService) {
    const vm = this;
    vm.transaction = TRANSACTION;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.kitReleaseDetail = data;
    vm.Reason_Type = CORE.Reason_Type;
    vm.isShowApprovedBtn = false;
    const warehouseId = data && data.warehouseId ? data.warehouseId : null;
    const binId = data && data.binId ? data.binId : null;
    vm.callFrom = data && data.callFrom ? data.callFrom : null;
    vm.haltResumePopUp = CORE.HaltResumePopUp;
    vm.Kit_Release_Status = TRANSACTION.KIT_RELEASE_STATUS;
    vm.KIT_RETURN_STATUS = TRANSACTION.KIT_RETURN_STATUS;
    vm.isReRelease = data && data.isReRelease ? data.isReRelease : false;
    vm.plans = data && data.plans ? data.plans : null;
    vm.textAreaRows = CORE.TEXT_AREA_ROWS;
    vm.kitReleaseDetail = Object.assign(vm.kitReleaseDetail, {
      woID: data && data.releasePlan && data.releasePlan.woID ? data.releasePlan.woID : null,
      description: data && data.releasePlan && data.releasePlan.releasedNote ? (vm.isReRelease ? null : data.releasePlan.releasedNote) : null
    });
    vm.loginUser = BaseService.loginUser;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.UMID_MAX_LENGTH = CORE.UMID_MAX_LENGTH;
    vm.LabelConstant = CORE.LabelConstant;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.warehouseType = TRANSACTION.warehouseType;
    vm.kitAssyDetail = vm.kitReleaseDetail.kitAssyDetail;
    vm.kitReleaseMismatchStockList = [];
    vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.KITRELEASE;
    vm.releaseWithEmptyBin = false;
    vm.releaseStarted = false;
    vm.currentDate = new Date();
    vm.materialDockDateOptions = {
      appendToBody: true,
      maxDate: vm.currentDate
    };
    vm.callFromDeptToDepetWH = stringFormat('{0} (Transfer: {1})', CORE.TrasferStockType.DeptTransfer, CORE.TransferSection.WH);
    vm.callFromDeptToDepetBin = stringFormat('{0} (Transfer: {1})', CORE.TrasferStockType.DeptTransfer, CORE.TransferSection.Bin);
    vm.callFromDeptToDepetKit = stringFormat('{0} (Transfer: {1})', CORE.TrasferStockType.DeptTransfer, CORE.TransferSection.Kit);
    vm.mismatchDeptType = vm.kitReleaseDetail && vm.kitReleaseDetail.kitDetail && vm.kitReleaseDetail.kitDetail.mismatchDeptType ? vm.kitReleaseDetail.kitDetail.mismatchDeptType : null;
    vm.ParentWarehouseType = CORE.ParentWarehouseType;

    if (!vm.kitReleaseDetail.releasePlan.woID && !vm.kitReleaseDetail.releasePlan.isUpdate) {
      vm.isShowParentWH = true;
    } else {
      vm.isShowParentWH = false;
    }

    vm.kitReleaseDateOptions = {
      appendToBody: true,
      maxDate: vm.currentDate
    };

    vm.DATE_PICKER = CORE.DATE_PICKER;
    vm.IsPickerOpen = {
      [vm.DATE_PICKER.materialDockDate]: false,
      [vm.DATE_PICKER.kitReleaseDate]: false
    };


    vm.goToSalesOrderList = () => {
      BaseService.goToSalesOrderList();
      return false;
    };

    vm.goToManageSalesOrder = () => {
      BaseService.goToManageSalesOrder(vm.kitReleaseDetail.kitDetail.salesOrderDetail.soId);
      return false;
    };

    vm.goToAssyMaster = () => {
      BaseService.goToComponentDetailTab(null, vm.kitReleaseDetail.kitAssyDetail.assyID);
      return false;
    };

    vm.goToAssy = () => {
      BaseService.goToPartList();
      return false;
    };

    vm.headerdata = [
      {
        label: 'PO#',
        value: vm.kitReleaseDetail.kitDetail.salesOrderDetail.poNumber,
        displayOrder: 1,
        labelLinkFn: vm.goToSalesOrderList,
        valueLinkFn: vm.goToManageSalesOrder
      },
      {
        label: 'SO#',
        value: vm.kitReleaseDetail.kitDetail.salesOrderDetail.soNumber,
        displayOrder: 2,
        labelLinkFn: vm.goToSalesOrderList,
        valueLinkFn: vm.goToManageSalesOrder
      },
      {
        label: CORE.LabelConstant.Assembly.PIDCode,
        value: vm.kitReleaseDetail.kitDetail.salesOrderDetail.SubAssyPIDCode || vm.kitReleaseDetail.kitDetail.salesOrderDetail.assyPIDCode,
        displayOrder: 3,
        labelLinkFn: vm.goToAssy,
        valueLinkFn: vm.goToAssyMaster,
        isCopy: true,
        imgParms: {
          imgPath: vm.rohsImagePath + vm.kitReleaseDetail.kitDetail.salesOrderDetail.rohsIcon,
          imgDetail: vm.kitReleaseDetail.kitDetail.salesOrderDetail.rohs
        }
      },
      {
        label: vm.LabelConstant.SalesOrder.KitQty,
        value: $filter('numberWithoutDecimal')(vm.kitReleaseDetail.kitDetail.salesOrderDetail.kitQty),
        displayOrder: 4
      }];

    /** Get list of parent warehouse for 'Transfer To' section */
    const getInventoryMisMatchList = () => TransferStockFactory.getKitWarehouseDetail({
      refSalesOrderDetID: vm.kitReleaseDetail.kitAssyDetail.refSalesOrderDetID,
      assyID: vm.kitReleaseDetail.kitAssyDetail.assyID,
      fromParentWHType: vm.kitReleaseDetail && vm.kitReleaseDetail.kitDetail && vm.kitReleaseDetail.kitDetail.mismatchDeptType ? vm.kitReleaseDetail.kitDetail.mismatchDeptType : CORE.ParentWarehouseType.MaterialDepartment,
      warehouseId: warehouseId || null,
      binId: binId || null
    }).query().$promise.then((res) => {
      vm.isAllEmptyBinWHSelect = false;
      if (res.data) {
        vm.permenantWarehouseList = _.chain(_.filter(res.data.transferKitWHList, { isPermanentWH: 1 })).groupBy('warehouseID').map((value) => {
          const warehouseDeail = _.first(value) || {};
          return {
            warehouseID: warehouseDeail.warehouseID,
            warehouseName: warehouseDeail.warehouseName,
            parentWHID: warehouseDeail.parentWHID,
            parentWHName: warehouseDeail.parentWHName,
            isPermanentWH: warehouseDeail.isPermanentWH,
            warehouseType: warehouseDeail.warehouseType,
            allMovableBin: warehouseDeail.allMovableBin,
            allocatedUMIDCount: value.length
          };
        }).value();

        // Get list of shelving cart with empty bins
        vm.emptyBinWHList = _.uniqBy(_.filter(res.data.transferKitWHList, (item) => item.warehouseType === vm.warehouseType.ShelvingCart.key && item.emptyBin > 0), 'warehouseID');
        // If warehouse contains pending UMID stock
        vm.nonUMIDList = res.data.nonUMIDList;

        // Unallocated stock
        vm.unallocatedStock = res.data.UMIDList;

        // Stock shared with other kit
        vm.sharedKitStock = res.data.kitList;
        // assign unallocated umid list

        // to filter smart cart in order to create group clustor for smartcart wh
        const smartCartUnallocatedUMID = _.map(_.groupBy(_.filter(res.data.UnallocatedUMIDSummary, { warehouseType: vm.warehouseType.SmartCart.key }), 'warehouseName'), (data, index) =>
        //   var warehouseID = _.first(data).warehouseID || {};
        ({
          warehouseName: index,
          binName: 'Bin Cluster',
          warehouseID: _.first(data).warehouseID,
          warehouseType: _.first(data).warehouseType,
          allocatedUMID: _.sumBy(data, 'allocatedUMID') || 0,
          unallocatedUMID: _.sumBy(data, 'unallocatedUMID') || 0,
          totalUMID: _.sumBy(data, 'totalUMID') || 0,
          unallocatedStock: _.filter(vm.unallocatedStock, (unallocateStock) => unallocateStock.warehouseID === _.first(data).warehouseID)
        }));

        const otherUnallocatedUMID = _.filter(res.data.UnallocatedUMIDSummary, (item) => item.warehouseType !== vm.warehouseType.SmartCart.key);
        _.each(otherUnallocatedUMID, (unAllocateUMID) => {
          unAllocateUMID.unallocatedStock = _.filter(vm.unallocatedStock, (unallocateStock) => unallocateStock.binID === unAllocateUMID.binID);
        });


        // Unallocated UMID summary
        vm.UnallocatedUMIDSummary = _.concat(smartCartUnallocatedUMID, otherUnallocatedUMID);
      }

      if (vm.releaseStarted && !(vm.permenantWarehouseList.length > 0 || vm.emptyBinWHList.length > 0 || vm.unallocatedStock.length > 0 || vm.nonUMIDList.length > 0)) {
        if (vm.callFrom === vm.callFromDeptToDepetWH || vm.callFrom === vm.callFromDeptToDepetBin || vm.callFrom === vm.callFromDeptToDepetKit || vm.mismatchDeptType === vm.ParentWarehouseType.ProductionDepartment) {
          $mdDialog.cancel(true);
        } else {
          vm.startKitRelease();
        }
      } else if ((vm.callFrom === vm.callFromDeptToDepetWH || vm.callFrom === vm.callFromDeptToDepetBin || vm.callFrom === vm.callFromDeptToDepetKit || vm.mismatchDeptType === vm.ParentWarehouseType.ProductionDepartment) && !(vm.permenantWarehouseList.length > 0 || vm.emptyBinWHList.length > 0 || vm.unallocatedStock.length > 0 || vm.nonUMIDList.length > 0)) {
        $mdDialog.cancel(true);
      }
      return $q.resolve(res);
    }).catch((error) => $q.reject(error));


    vm.getKitMismatchInventoryDetail = () => {
      vm.cgBusyLoading = getInventoryMisMatchList().then(() => {
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.isAllEmptyBinWHSelect = false;
    vm.selectedTranferEmptyBin = false;

    vm.selectAllEmptyBinWH = () => {
      _.map(vm.emptyBinWHList, (item) => {
        item.isSelect = vm.isAllEmptyBinWHSelect;
      });
      vm.selectedTranferEmptyBin = vm.isAllEmptyBinWHSelect;
    };

    vm.selectEmptyBinWH = () => {
      const selectedObject = (_.countBy(vm.emptyBinWHList, 'isSelect') || {});
      if (selectedObject.false > 0) {
        vm.isAllEmptyBinWHSelect = false;
      } else if (selectedObject.true === vm.emptyBinWHList.length) {
        vm.isAllEmptyBinWHSelect = true;
      }
      vm.selectedTranferEmptyBin = _.filter(vm.emptyBinWHList, { isSelect: true }).length > 0 ? true : false;
    };

    vm.selectWarehouseToTransferEmptyBin = () => {
      // let transferFromDept = {};
      // if (vm.materialDeptList && vm.materialDeptList.length > 0) {
      //  transferFromDept.Name = vm.materialDeptList[0].Name;
      //  transferFromDept.ID = vm.materialDeptList[0].ID;
      //  transferFromDept.isPermanentWH = true;
      // }
      const transferDetail = {
        emptyBinWHList: _.filter(vm.emptyBinWHList, { isSelect: true }),
        stockDetail: { assyID: vm.kitReleaseDetail.kitAssyDetail.assyID, refSalesOrderDetID: vm.kitReleaseDetail.kitAssyDetail.refSalesOrderDetID },
        sourceModelName: `${vm.kitReleaseDetail.kitDetail.salesOrderDetail.poNumber}, ${vm.kitReleaseDetail.kitDetail.salesOrderDetail.soNumber}${vm.kitReleaseDetail.kitDetail.salesOrderDetail.SubAssy}${vm.kitReleaseDetail.kitDetail.salesOrderDetail.poQty}`,
        deptTransferToName: null,
        transferFromDept: null,
        isConfirmation: false
      };

      DialogFactory.dialogService(
        CORE.TRANSFER_EMPTY_BIN_MODAL_CONTROLLER,
        CORE.TRANSFER_EMPTY_BIN_MODAL_VIEW,
        event,
        transferDetail).then(() => {
          vm.getKitMismatchInventoryDetail();
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.transferBinToWarehouse = (item) => {
      const transferFromDetail = {
        id: item.binID,
        name: item.binName,
        isPermanent: item.isPermanentBin,
        warehouseID: item.warehouseID,
        warehouseName: item.warehouseName,
        deptName: item.parentWHName,
        isCluster: item.isPermanentBin ? 1 : 0,
        parentWHID: item.parentWHID,
        warehouseType: item.warehouseType,
        transferSection: CORE.TransferSection.Bin,
        transferLabel: 'transferFrom'
      };

      const transferDetail = {
        transferItem: transferFromDetail,
        transferTo: CORE.TransferSection.WH,
        fromBinID: item.binID,
        transferOption: CORE.TrasferStockType.StockTransfer,
        transType: CORE.UMID_History.Trasaction_Type.Bin_WH_Transfer,
        actionPerformed: `${CORE.UMID_History.Action_Performed.KitRelease} ${CORE.UMID_History.Action_Performed.TransferMaterial} (${CORE.UMID_History.Action_Performed.MismatchItem})`,
        transferFromDept: { ID: item.parentWHID, Name: item.parentWHName, isPermanentWH: true },
        transferToDept: { ID: item.parentWHID, Name: item.parentWHName, isPermanentWH: true },
        transferFromWH: {
          id: item.warehouseID,
          name: item.warehouseName,
          isPermanent: item.isPermanentWH,
          parentWHID: item.parentWHID,
          warehouseType: item.warehouseType
        },
        transferFromBin: transferFromDetail
      };

      DialogFactory.dialogService(
        CORE.TRANSFER_WAREHOUSE_BIN_MODAL_CONTROLLER,
        CORE.TRANSFER_WAREHOUSE_BIN_MODAL_VIEW,
        event,
        transferDetail).then((response) => {
          if (response) {
            vm.getKitMismatchInventoryDetail();
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.createrUMID = (item) => {
      BaseService.goToNonUMIDStockList(item.warehouseID, item.binID);
    };

    vm.transferUMIDtoBin = () => {
      DialogFactory.dialogService(
        TRANSACTION.UID_TRANSFER_CONTROLLER,
        TRANSACTION.UID_TRANSFER_VIEW,
        event,
        null).then((response) => {
          if (response) {
            vm.getKitMismatchInventoryDetail();
          }
        }, (transfer) => {
          if (transfer) {
            vm.getKitMismatchInventoryDetail();
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.redirectToUMIDWithBinWHFilter = (item) => {
      BaseService.goToUMIDList(item.warehouseID, item.binID, vm.kitReleaseDetail.kitAssyDetail.refSalesOrderDetID, vm.kitReleaseDetail.kitAssyDetail.assyID);
    };

    vm.transferWHToWH = (item) => {
      const transferFromDetail = {
        id: item.warehouseID,
        name: item.warehouseName,
        isPermanent: item.isPermanentWH,
        parentWHID: item.parentWHID,
        warehouseType: item.warehouseType,
        deptName: item.parentWHName,
        transferSection: CORE.TransferSection.WH,
        transferLabel: 'transferFrom',
        allMovableBin: item.allMovableBin
      };

      const transferDetail = {
        transferItem: transferFromDetail,
        transferTo: CORE.TransferSection.WH,
        fromWHID: item.warehouseID,
        transferOption: CORE.TrasferStockType.StockTransfer,
        transType: CORE.UMID_History.Trasaction_Type.WH_WH_Transfer,
        actionPerformed: `${CORE.UMID_History.Action_Performed.KitRelease} ${CORE.UMID_History.Action_Performed.TransferMaterial} (${CORE.UMID_History.Action_Performed.MismatchItem})`,
        transferFromDept: {
          Name: item.parentWHName,
          ID: item.parentWHID,
          isPermanentWH: true
        },
        transferToDept: {
          Name: item.parentWHName,
          ID: item.parentWHID,
          isPermanentWH: true
        },
        transferFromWH: {
          id: item.warehouseID,
          name: item.warehouseName,
          isPermanent: item.isPermanentWH,
          parentWHID: item.parentWHID,
          warehouseType: item.warehouseType
        }
      };

      DialogFactory.dialogService(
        CORE.TRANSFER_WAREHOUSE_BIN_MODAL_CONTROLLER,
        CORE.TRANSFER_WAREHOUSE_BIN_MODAL_VIEW,
        event,
        transferDetail).then((response) => {
          if (response) {
            vm.getKitMismatchInventoryDetail();
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.totalPOQty = () => {
      const total = (_.sumBy(vm.kitReleasePlanList, (o) => parseInt(o.poQty ? o.poQty : 0)));
      if (!isNaN(total)) {
        return total;
      }
      return 0;
    };
    vm.totalKitQty = () => {
      const total = (_.sumBy(vm.kitReleasePlanList, (o) => parseInt(o.kitReleaseQty ? o.kitReleaseQty : 0)));
      if (!isNaN(total)) {
        return total;
      }
      return 0;
    };

    // get remain qty to plan release
    vm.getRemainPOQty = () => (objPlannDetail.qty - (vm.totalPOQty()));

    // get remain kit qty to plan release
    vm.getRemainkitQty = () => (objPlannDetail.kitQty - (vm.totalKitQty()));

    /** Open feasibility pop-up when click on check feasibility */
    vm.checkFeasibility = () => {
      const salesOrderDetail = angular.copy(vm.kitReleaseDetail.kitDetail.salesOrderDetail);
      salesOrderDetail.SubAssy = vm.kitReleaseDetail.kitAssyDetail.selectedAssy ? vm.kitReleaseDetail.kitAssyDetail.selectedAssy.assyName : null;
      const feasibilityDetail = { refSalesOrderDetID: vm.kitReleaseDetail.kitAssyDetail.refSalesOrderDetID, assyID: vm.kitReleaseDetail.kitAssyDetail.assyID, inputQty: 0, salesOrderDetail: salesOrderDetail };

      DialogFactory.dialogService(
        TRANSACTION.KIT_FEASIBILITY_POPUP_CONTROLLER,
        TRANSACTION.KIT_FEASIBILITY_POPUP_VIEW,
        event,
        feasibilityDetail).then(() => {
        }, () => {

        }, (err) => BaseService.getErrorLog(err));
    };

    vm.startKitRelease = () => {
      vm.kitReleaseDetail.isMismatchItems = false;
      getWOForKitRelease();
      getDeptList();
      initAutoComplete();
      setReleaseHeader();
    };

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    function getWOForKitRelease() {
      return KitAllocationFactory.getWOForKitRelease({ refSalesOrderDetID: vm.kitReleaseDetail.kitAssyDetail.refSalesOrderDetID, assyID: vm.kitReleaseDetail.kitAssyDetail.assyID }).query().$promise.then((res) => {
        vm.workorderList = _.map(_.filter(res.data, (assyDet) => assyDet.componentAssembly), (item) => ({
          woID: item.woID, woNumber: item.woNumber, assyName: item.componentAssembly.PIDCode, displayName: `${item.woNumber} (${item.componentAssembly.PIDCode})`
        }));
        initAutoComplete();
        return vm.workorderList;
      }).catch((error) => BaseService.getErrorLog(error));
    }

    function getDeptList() {
      return BinFactory.getAllWarehouse({ isDepartment: true }).query().$promise.then((whlist) => {
        vm.allDepartmentList = whlist.data;
        vm.materialDeptList = _.filter(whlist.data, (data) => data.parentWHType === CORE.ParentWarehouseType.MaterialDepartment);
        vm.productionDeptList = _.filter(whlist.data, (data) => data.parentWHType === CORE.ParentWarehouseType.ProductionDepartment);
        if (!vm.kitReleaseDetail.woID) {
          initAutoComplete();
        }
        return vm.productionDeptList;
      }).catch((error) => BaseService.getErrorLog(error));
    }

    function initAutoComplete() {
      vm.autoCompleteWorkorder = {
        columnName: 'displayName',
        keyColumnName: 'woID',
        keyColumnId: vm.kitReleaseDetail && vm.kitReleaseDetail.woID ? vm.kitReleaseDetail.woID : null,
        inputName: 'workorder',
        placeholderName: 'workorder',
        isRequired: false,
        isAddnew: false,
        callbackFn: getWOForKitRelease,
        onSelectCallbackFn: (item) => {
          if (item && item.woID) {
            vm.kitReleaseDetail.woID = item.woID;
          } else {
            vm.kitReleaseDetail.woID = null;
          }
        }
      };

      vm.autoCompleteDept = {
        columnName: 'Name',
        keyColumnName: 'ID',
        keyColumnId: vm.kitReleaseDetail && vm.kitReleaseDetail.deptId ? vm.kitReleaseDetail.deptId : null,
        inputName: 'Dept',
        placeholderName: 'Parent Warehouse',
        isRequired: true,
        isAddnew: false,
        callbackFn: getDeptList,
        onSelectCallbackFn: (item) => {
          if (item && item.ID) {
            vm.kitReleaseDetail.deptId = item.ID;
            vm.kitReleaseDetail.deptName = item.Name;
          } else {
            vm.kitReleaseDetail.deptId = null;
          }
        }
      };
    }

    vm.kitRelease = () => {
      vm.releaseStarted = true;
      vm.isSubmitRelease = true;
      if (BaseService.focusRequiredField(vm.formKitRelease)) {
        vm.isSubmitRelease = false;
        return;
      }

      vm.cgBusyLoading = getInventoryMisMatchList().then(() => {
        if ((!vm.releaseWithEmptyBin && vm.emptyBinWHList.length > 0) || (vm.permenantWarehouseList.length > 0 || vm.unallocatedStock.length > 0 || vm.nonUMIDList.length > 0)) {
          vm.kitReleaseDetail.isMismatchItems = true;
          vm.isSubmitRelease = false;
        } else {
          releaseKitConfirmation();
        }
      }).catch((error) => {
        vm.isSubmitRelease = false;
        return BaseService.getErrorLog(error);
      });
    };

    function releaseKitConfirmation() {
      let messageContent;
      if (vm.sharedKitStock.length > 0) {
        const kitNameList = _.map(vm.sharedKitStock, 'name').join('), (');
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.OTHER_KIT_STOCK_EXISTS_WITH_KIT);
        messageContent.message = stringFormat(messageContent.message, '', `(${kitNameList})`, vm.kitReleaseDetail && vm.kitReleaseDetail.deptName ? vm.kitReleaseDetail.deptName : '');
      } else {
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RELEASE_CONFIRMATION);
        messageContent.message = stringFormat(messageContent.message, vm.kitReleaseDetail.deptName, vm.kitReleaseDetail.releasePlan.plannKitNumber);
      }
      DialogFactory.messageConfirmDialog({
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      }).then((yes) => {
        if (yes) {
          woValidation();
        }
      }, () => {
        vm.isSubmitRelease = false;
      }).catch((error) => {
        vm.isSubmitRelease = false;
        return BaseService.getErrorLog(error);
      });
    }
    function woValidation() {
      if (!vm.workorderList || vm.workorderList.length === 0) {
        vm.kitReleaseDetail.woID = null;
      }

      if (vm.kitReleaseDetail.woID) {
        const woCheck = _.find(vm.plans, (data) => data.id !== vm.kitReleaseDetail.releasePlan.id && !data.woID && data.kitStatus === vm.Kit_Release_Status.R.value);
        if (woCheck && (woCheck.plannKitNumber < vm.kitReleaseDetail.releasePlan.plannKitNumber)) {
          const model = {
            messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.ASSIGN_WORKORDER_TO_PLAN,
            multiple: true
          };
          vm.isSubmitRelease = false;
          return DialogFactory.messageAlertDialog(model).then(() => {
            BaseService.currentPagePopupForm = [];
            $mdDialog.hide(true);
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          releaseKit();
        }
      } else {
        const woCheck = _.find(vm.plans, (data) => data.id !== vm.kitReleaseDetail.releasePlan.id && data.woID && data.kitStatus === vm.Kit_Release_Status.R.value && vm.kitReleaseDetail.releasePlan.plannKitNumber < data.plannKitNumber);
        if (woCheck) {
          const model = {
            messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.REMOVE_WORKORDER_TO_PLAN,
            multiple: true
          };
          vm.isSubmitRelease = false;
          return DialogFactory.messageAlertDialog(model).then(() => {
            BaseService.currentPagePopupForm = [];
            $mdDialog.hide(true);
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          releaseKit();
        }
      }
    }
    function releaseKit() {
      vm.isSubmitRelease = true;
      const KitReleaseDetail = {
        refSalesOrderDetID: vm.kitReleaseDetail.kitAssyDetail.refSalesOrderDetID,
        assyID: vm.kitReleaseDetail.kitAssyDetail.mainAssyID,
        subAssyID: (vm.kitReleaseDetail.kitAssyDetail.mainAssyID !== vm.kitReleaseDetail.kitAssyDetail.assyID) ? vm.kitReleaseDetail.kitAssyDetail.assyID : null,
        planDetID: vm.kitReleaseDetail.releasePlan.id,
        woID: vm.kitReleaseDetail.woID,
        deptId: vm.kitReleaseDetail.deptId,
        description: vm.kitReleaseDetail.description,
        isReRelease: vm.isReRelease,
        isMaintainKit: vm.kitReleaseDetail.isMaintainKit,
        isChangeKit: vm.kitReleaseDetail.isChangeKit,
        planKitNumber: vm.kitReleaseDetail.releasePlan.plannKitNumber
      };

      vm.cgBusyLoading = KitAllocationFactory.kitRelease().query(KitReleaseDetail).$promise.then((response) => {
        if (response.data && response.data.IsSalesOrderCanceled) {
          vm.isSubmitRelease = false;
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SO_CANCELED_NOT_ALLOW_KIT_RELEASE);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          return DialogFactory.messageAlertDialog(model).then((yes) => {
            if (yes) {
              $mdDialog.cancel(true);
            }
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          BaseService.currentPagePopupForm = [];
          $mdDialog.hide(true);
        }
      }).catch((error) => BaseService.getErrorLog(error)).finally(() => {
        vm.isSubmitRelease = false;
      });
    }

    // kit release update
    vm.kitReleaseUpdate = () => {
      vm.releaseStarted = true;
      vm.isSubmitRelease = true;
      if (BaseService.focusRequiredField(vm.formKitRelease)) {
        vm.isSubmitRelease = false;
        return;
      }

      woValidation();
    };

    vm.startReleaseWithEmptyBin = () => {
      vm.releaseWithEmptyBin = true;
      vm.startKitRelease();
    };

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.formKitRelease);
      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        vm.formKitRelease.$setPristine();
        BaseService.currentPagePopupForm = [];
        $mdDialog.cancel();
      }
    };

    /* Check form dirty*/
    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    function init() {
      vm.getKitMismatchInventoryDetail();
      getDeptList();
      if (!vm.kitReleaseDetail.isMismatchItems) {
        getWOForKitRelease();
        setReleaseHeader();
      }
    }

    init();

    function setReleaseHeader() {
      vm.headerdata = [{
        label: CORE.LabelConstant.Assembly.PIDCode,
        value: vm.kitReleaseDetail.kitDetail.salesOrderDetail.SubAssyPIDCode || vm.kitReleaseDetail.kitDetail.salesOrderDetail.assyPIDCode,
        displayOrder: 1,
        labelLinkFn: vm.goToAssy,
        valueLinkFn: vm.goToAssyMaster,
        isCopy: true,
        imgParms: {
          imgPath: vm.rohsImagePath + vm.kitReleaseDetail.kitDetail.salesOrderDetail.rohsIcon,
          imgDetail: vm.kitReleaseDetail.kitDetail.salesOrderDetail.rohs
        }
      }, {
        label: vm.LabelConstant.SalesOrder.KitQty,
        value: $filter('numberWithoutDecimal')(vm.kitReleaseDetail.kitDetail.salesOrderDetail.kitQty),
        displayOrder: 2
      }, {
        label: vm.LabelConstant.SalesOrder.PlannKit,
        value: vm.kitReleaseDetail.releasePlan.plannKitNumber,
        displayOrder: 3
      }];
    }

    // Check Form Dirty state on state change and reload browser
    angular.element(() => {
      BaseService.currentPagePopupForm = [vm.formKitRelease];
    });

    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
    };
    // check and scan UMID and filter from list
    vm.scanVerifyUID = (ev) => {
      if (ev.keyCode === 13 && vm.ScanVerifyUMID) {
        vm.searchUMID = '';
        _.map(vm.UnallocatedUMIDSummary, closepopup);
        vm.cgBusyLoading = ReceivingMaterialFactory.get_Component_Sid_ByUID().query({ id: vm.ScanVerifyUMID }).$promise.then((res) => {
          if (res && res.data) {
            vm.bin = res.data.binMst ? res.data.binMst.Name : null;
            vm.warehouseID = res.data.binMst ? res.data.binMst.WarehouseID : null;
            vm.binID = res.data.binID;
            // check bin exist or not in list
            const objBin = res.data.binMst && res.data.binMst.warehousemst && res.data.binMst.warehousemst.warehouseType === vm.warehouseType.SmartCart.key ? _.find(vm.UnallocatedUMIDSummary, (unAllocate) => unAllocate.warehouseID === vm.warehouseID) : _.find(vm.UnallocatedUMIDSummary, (unAllocate) => unAllocate.binID === vm.binID);
            if (objBin) {
              // check UMID from list
              const unAllocatedObj = _.find(objBin.unallocatedStock, (item) => item.uid.toLowerCase() === vm.ScanVerifyUMID.toLowerCase());
              if (unAllocatedObj && unAllocatedObj.binID === vm.binID) {
                objBin.isopen = true;
                vm.searchUMID = unAllocatedObj.uid;
                vm.ScanVerifyUMID = '';
              } else {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.UMID_NOT_EXIST);
                messageContent.message = stringFormat(messageContent.message, vm.ScanVerifyUMID);
                const model = {
                  messageContent: messageContent,
                  multiple: true
                };
                DialogFactory.messageAlertDialog(model).then(() => {
                  focus();
                });
              }
            } else {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.UMID_BIN_NOT_MATCH);
              messageContent.message = stringFormat(messageContent.message, vm.ScanVerifyUMID, vm.bin);
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              DialogFactory.messageAlertDialog(model).then(() => {
                focus();
              });
            }
          } else {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SCAN_UID_NOT_FOUND);
            messageContent.message = stringFormat(messageContent.message, vm.ScanVerifyUMID);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model).then(() => {
              focus();
            });
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      preventInputEnterKeyEvent(ev);
    };
    // focus on filtered field
    const focus = () => {
      vm.ScanVerifyUMID = '';
      setFocus('ScanFilterUMID');
    };

    // open pop-up to transfer bin of UMID
    vm.transferStock = (row, event) => {
      var data = {
        uid: row.uid,
        updateStock: false,
        transactionID: vm.transactionID
      };
      DialogFactory.dialogService(
        TRANSACTION.UID_TRANSFER_CONTROLLER,
        TRANSACTION.UID_TRANSFER_VIEW,
        event,
        data).then(() => {
        }, (transfer) => {
          if (transfer) {
            vm.getKitMismatchInventoryDetail();
          }
        }, (err) => BaseService.getErrorLog(err));
    };
    // close opened list
    const closepopup = (item) => {
      item.isopen = false;
    };
    // transfer bin to bin detail
    /* vm.transferBinToBin = (item, event) => {
      var transferFromDetail = {
        id: item.binID,
        name: item.binName,
        isPermanent: item.isPermanentWH,
        warehouseID: item.warehouseID,
        warehouseName: item.warehouseName,
        deptName: item.parentWHName,
        parentWHID: item.parentWHID,
        warehouseType: item.warehouseType,
        transferSection: CORE.TransferSection.Bin,
        transferLabel: "transferFrom",
      };
      var transferDetail = {
        transferItem: transferFromDetail,
        transferTo: CORE.TransferSection.Bin,
        fromBinID: item.binID,
        transferOption: CORE.TrasferStockType.StockTransfer,
        transType: CORE.UMID_History.Trasaction_Type.Bin_Bin_Transfer,
        actionPerformed: `${CORE.UMID_History.Action_Performed.KitRelease} ${CORE.UMID_History.Action_Performed.TransferMaterial} (${CORE.UMID_History.Action_Performed.MismatchItem})`,
        transferFromBin: {
          id: item.binID,
          name: item.binName,
          isPermanent: item.isPermanentWH,
          warehouseID: item.warehouseID,
          warehouseName: item.warehouseName,
          warehouseType: item.warehouseType,
          deptName: item.parentWHName,
          isSelected: true
        },
        transferFromDept: {
          Name: item.parentWHName,
          ID: item.parentWHID,
        }
      };
      DialogFactory.dialogService(
        CORE.TRANSFER_WAREHOUSE_BIN_MODAL_CONTROLLER,
        CORE.TRANSFER_WAREHOUSE_BIN_MODAL_VIEW,
        event,
        transferDetail).then((response) => {
          if (response) {
            vm.getKitMismatchInventoryDetail();
          }
        }, (err) => {
          return BaseService.getErrorLog(err);
        });
    };*/

    vm.transferBin = (item, event) => {
      const obj = {
        Name: item.binName
      };
      DialogFactory.dialogService(
        TRANSACTION.BIN_TRANSFER_POPUP_CONTROLLER,
        TRANSACTION.BIN_TRANSFER_POPUP_VIEW,
        event,
        obj).then(() => {
        }, () => {
          vm.getKitMismatchInventoryDetail();
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.getHoldResumeStatus = (responseData) => {
      if (responseData.salesOrderDetailId === vm.kitReleaseDetail.kitAssyDetail.refSalesOrderDetID) {
        vm.refType = [vm.haltResumePopUp.refTypePO, vm.haltResumePopUp.refTypeKA, vm.haltResumePopUp.refTypeKR];
        vm.cgBusyLoading = KitAllocationFactory.getHoldResumeStatus().query({
          salesOrderDetId: responseData.salesOrderDetailId,
          refType: vm.refType
        }).$promise.then((response) => {
          if (response) {
            vm.haltStatusCheck = _.groupBy(response.data, 'refType');
            if (vm.haltStatusCheck.PO || vm.haltStatusCheck.KA || vm.haltStatusCheck.KR) {
              $mdDialog.hide(true);
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    // go to UMId page
    vm.goToUMIDManagement = (item) => BaseService.goToUMIDDetail(item.id);

    // show light inovaxe related changes
    vm.applyAll = (isChecked, unallocatedList) => {
      unallocatedList.isCheckedAll = isChecked;
      _.map(unallocatedList.unallocatedStock, (row) => {
        row.isChecked = isChecked;
      });
    };

    // checkbox filter option individual
    vm.changeCheckbox = (unallocatedList) => {
      if (_.find(unallocatedList.unallocatedStock, (fltr) => !fltr.isChecked)) {
        unallocatedList.isCheckedAll = false;
      } else {
        unallocatedList.isCheckedAll = true;
      }
    };
    // search for parts
    vm.changeEvent = (showLight, ev) => {
      if (showLight) {
        vm.searchbyUMID(ev);
      } else {
        vm.cancelSearch(ev);
      }
    };

    // search by umid api call from here on change of checkbox
    vm.searchbyUMID = (ev) => {
      vm.event = ev;
      const dept = getLocalStorageValue(vm.loginUser.employee.id);
      vm.selectedList = [];
      _.each(vm.UnallocatedUMIDSummary, (unallocate) => {
        if (unallocate.warehouseType === vm.warehouseType.SmartCart.key) {
          const unallocateList = _.filter(unallocate.unallocatedStock, (item) => item.isChecked);
          if (unallocateList.length > 0) {
            vm.selectedList.push.apply(vm.selectedList, unallocateList);
          }
        }
      });
      if (_.find(vm.selectedList, (selectDept) => dept && dept.department && selectDept.department !== dept.department.Name) && !vm.isComapnyLevel) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.INOAUTO_DEPARTMENT_VALIDATION);
        messageContent.message = stringFormat(messageContent.message, dept.department.Name);

        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
        vm.clickButton = false;
        return;
      } else {
        checkColorAvailibility(vm.isComapnyLevel ? 0 : dept.department.ID);
      }
    };

    // check color availability to prompt in cart
    function checkColorAvailibility(departmentID) {
      ReceivingMaterialFactory.getPromptIndicatorColor().query({
        pcartMfr: CORE.InoautoCart, prefDepartmentID: departmentID
      }).$promise.then((res) => {
        if (res && res.data) {
          vm.promptColorDetails = res.data.promptColors[0];
          vm.TimeOut = res.data.defaultTimeout && res.data.defaultTimeout[0].values ? res.data.defaultTimeout[0].values : CORE.CANCEL_REQUSET_TIMEOUT;
          funSearchByUMID(departmentID);
        } else {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PROMPT_ALREADY_USE);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          return DialogFactory.messageAlertDialog(model).then(() => {
            vm.showStatus = false;
            vm.transactionID = null;
            vm.clickButton = false;
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
          // color is not available message prompt
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    // umid search
    function funSearchByUMID(departmentID) {
      vm.transactionID = getGUID();
      const objSearchPartUMID = {
        UIDs: _.map(vm.selectedList, 'uid'),
        PromptIndicator: vm.promptColorDetails.ledColorValue,
        ledColorID: vm.promptColorDetails.id,
        Priority: 0,
        TimeOut: vm.TimeOut,
        UserName: vm.loginUser.username,
        InquiryOnly: 0,
        departmentID: departmentID ? departmentID : null,
        TransactionID: vm.transactionID,
        Department: departmentID ? vm.selectedList[0].department : '*',
        ReelBarCode: null
      };
      WarehouseBinFactory.sendRequestToSearchPartByUMID().query(objSearchPartUMID).$promise.then((response) => {
        if (response.status === CORE.ApiResponseTypeStatus.FAILED) {
          vm.showStatus = false;
          vm.transactionID = null;
          vm.clickButton = false;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }
    // check part selected or not
    vm.checkPartForSearch = () => {
      const unallocateUMIDList = _.filter(vm.UnallocatedUMIDSummary, (item) => item.warehouseType === vm.warehouseType.SmartCart.key);
      if (unallocateUMIDList.length > 0) {
        let result = true;
        _.each(unallocateUMIDList, (item) => {
          const objResult = _.find(item.unallocatedStock, (data) => data.isChecked);
          if (objResult) {
            result = false;
          }
        });
        return result;
      } else {
        return true;
      }
    };

    function connectSocket() {
      socketConnectionService.on(CORE.Socket_IO_Events.InoAuto.updateUMIDRequest, updateUMIDRequest);
      socketConnectionService.on(CORE.Socket_IO_Events.InoAuto.updateCancelRequest, updateCancelRequestStatus);
      socketConnectionService.on(CORE.Socket_IO_Events.InoAuto.updateForceDeliverRequest, updateForceDeliverRequest);
      socketConnectionService.on(CORE.Socket_IO_Events.HoldResumeTrans.PO_STOP, vm.getHoldResumeStatus);
      socketConnectionService.on(CORE.Socket_IO_Events.HoldResumeTrans.KIT_ALLOCATION_STOP, vm.getHoldResumeStatus);
      socketConnectionService.on(CORE.Socket_IO_Events.HoldResumeTrans.KIT_RELEASE_STOP, vm.getHoldResumeStatus);
    }
    connectSocket();

    socketConnectionService.on('reconnect', () => {
      connectSocket();
    });
    function removeSocketListener() {
      socketConnectionService.removeListener(CORE.Socket_IO_Events.InoAuto.updateUMIDRequest, updateUMIDRequest);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.InoAuto.updateCancelRequest, updateCancelRequestStatus);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.InoAuto.updateForceDeliverRequest, updateForceDeliverRequest);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.PO_STOP);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.KIT_ALLOCATION_STOP);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.KIT_RELEASE_STOP);
    }

    $scope.$on('$destroy', () => {
      cancelRequest();
      removeSocketListener();
    });
    // on disconnect socket
    socketConnectionService.on('disconnect', () => {
      // Remove socket listeners
      removeSocketListener();
    });

    function updateUMIDRequest(response) {
      if (vm.transactionID === response.response.TransactionID && !vm.showStatus) {
        const selectedPkg = response.response.ChosenPackages;
        const notFoundedPkg = response.response.UIDNotFound;
        const notAvailablePkg = response.response.UnavailablePackages;
        const openList = _.find(vm.UnallocatedUMIDSummary, (unallocate) => unallocate.isopen);
        _.each(vm.UnallocatedUMIDSummary, (unallocateList) => {
          if (unallocateList.warehouseType === vm.warehouseType.SmartCart.key) {
            // selected umid
            _.each(selectedPkg, (item) => {
              var objUMID = _.find(unallocateList.unallocatedStock, (umid) => umid.uid === item.UID);
              if (objUMID) {
                objUMID.ledColorCssClass = vm.promptColorDetails.ledColorCssClass;
                objUMID.ledColorName = vm.promptColorDetails.ledColorName;
                objUMID.inovexStatus = CORE.InoAuto_Search_Status.Chosen;
              }
            });
            // not found umid
            _.map(notFoundedPkg, (item) => {
              var notFound = _.find(unallocateList.unallocatedStock, (notFound) => notFound.uid === item);
              if (notFound) {
                notFound.inovexStatus = CORE.InoAuto_Search_Status.NotFound;
              }
            });
            // not available umid
            _.map(notAvailablePkg, (item) => {
              var notAvailable = _.find(openList.unallocatedStock, (notAvailable) => notAvailable.uid === item.UID);
              if (notAvailable) {
                notAvailable.inovexStatus = CORE.InoAuto_Search_Status.NotAvailable;
              }
            });
          }
        });
        vm.showStatus = true;
        if (selectedPkg.length === 0) {
          if (notAvailablePkg.length === 0) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.INOAUTO_UIDNOTFOUND);
          } else {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.INOAUTO_NOTAVAILABLE);
          }
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          return DialogFactory.messageAlertDialog(model, commonCancelFunction);
        }
      }
    }
    // common function to clear
    function commonCancelFunction() {
      _.each(vm.UnallocatedUMIDSummary, (objunallocate) => {
        _.map(objunallocate.unallocatedStock, (item) => {
          item.inovexStatus = null;
          item.ledColorCssClass = null;
          item.ledColorName = null;
        });
      });
      vm.showStatus = false;
      vm.transactionID = null;
      vm.clickButton = false;
    }

    // received details for cancel request
    function updateCancelRequestStatus(req) {
      if (req.transactionID === vm.transactionID && !vm.open) {
        cancelRequestAlert(req);
      }
    }

    // cancel request
    function cancelRequestAlert(req) {
      commonCancelFunction();
      vm.open = true;
      let messageContent = null;
      if (req.code === CORE.INO_AUTO_RESPONSE.SUCCESS) {
        NotificationFactory.success(req.message);
        callbackCancel();
        return;
      } else if (req.code === CORE.INO_AUTO_RESPONSE.CANCEL) {
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SEARCH_CANCEL_MANUALLY);
      } else {
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SEARCH_CANCEL_TIMEOUT);
      }
      const model = {
        messageContent: messageContent,
        multiple: true
      };
      return DialogFactory.messageAlertDialog(model, callbackCancel);
    }
    // callback function for open
    function callbackCancel() {
      vm.open = false;
    }
    // forece deliver request to update
    function updateForceDeliverRequest(request) {
      _.each(vm.UnallocatedUMIDSummary, (objUnallocate) => {
        var objUMID = _.find(objUnallocate.unallocatedStock, (umid) => umid.uid === request.UID);
        if (objUMID) {
          objUMID.ledColorCssClass = null;
          objUMID.ledColorName = null;
          objUMID.inovexStatus = CORE.InoAuto_Search_Status.InTransit;
          objUMID.isTransit = 'Yes';
        }
      });
    }
    // cancel Request for search by umid
    vm.cancelSearch = () => {
      cancelRequest();
    };
    // cancel request
    function cancelRequest(isManualCancel) {
      if (vm.transactionID) {
        const objTrans = {
          TransactionID: vm.transactionID,
          ReasonCode: CORE.InoAuto_Error_ReasonCode.CancelTask.Code,
          ReasonMessage: CORE.InoAuto_Error_ReasonCode.CancelTask.Message
        };
        if (isManualCancel) {
          objTrans.isManualCancel = true;
        }
        WarehouseBinFactory.sendRequestToCancelCartRequest().query(objTrans).$promise.then(() => {
          if (isManualCancel) {
            commonCancelFunction();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        commonCancelFunction();
      }
    }

    vm.selectReleaseComment = (event, comment) => {
      // Static code to enable save button
      vm.formKitRelease.$$controls[1].$setDirty();
      setFocus('description');
      vm.kitReleaseDetail.description = (vm.kitReleaseDetail.description ? (vm.kitReleaseDetail.description + '\n') : '') + comment;
    };

    vm.goToTransferBulkMaterial = (item) => {
      if (item && item.warehouseID) {
        BaseService.openInNew(TRANSACTION.TRANSACTION_TRANSFER_STOCK_STATE, { whId: item.warehouseID });
      }
    };

    vm.goToWHList = () => {
      BaseService.goToWHList();
    };

    vm.transferWHWithEmptyBin = () => {
      $mdDialog.cancel(true);
    };
  }
})();
