(function () {
  'use strict';

  angular
    .module('app.transaction.transferstock')
    .controller('TransferWarehouseBinPopupController', TransferWarehouseBinPopupController);

  /** @ngInject */
  function TransferWarehouseBinPopupController($scope, $state, $mdDialog, $q, $timeout, data, BaseService, CORE, TransferStockFactory, BinFactory, DialogFactory, ReceivingMaterialFactory, WarehouseBinFactory, TRANSACTION) {
    const vm = this;
    vm.TrasferStockType = CORE.TrasferStockType;
    vm.transferSection = CORE.TransferSection;
    vm.UMID_History = CORE.UMID_History;
    vm.transferItemDet = data;
    vm.transferStockMessages = CORE.MESSAGE_CONSTANT.TRANSFER_STOCK;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.warehouseType = TRANSACTION.warehouseType;
    vm.scanAndSearch = {};
    vm.salesOrderDetail = vm.transferItemDet && vm.transferItemDet.mismatchInventoryData && vm.transferItemDet.mismatchInventoryData.salesOrderDetail ? vm.transferItemDet.mismatchInventoryData.salesOrderDetail : null;
    const sourceModel = vm.transferItemDet ? vm.transferItemDet.transferItem : {};
    vm.enableUnallocatedUMIDTransfer = false;
    vm.currentState = $state.current.name;
    vm.LabelConstant = angular.copy(CORE.LabelConstant);

    if (vm.currentState === TRANSACTION.TRANSACTION_WAREHOUSE_STATE) {
      vm.category = CORE.UMID_History.Category.Warehouse;
    } else if (vm.currentState === TRANSACTION.TRANSACTION_TRANSFER_STOCK_STATE) {
      vm.category = CORE.UMID_History.Category.Tranfer_Stock_Dept_To_Dept;
    }

    const getAllRights = () => {
      vm.enableUnallocatedUMIDTransfer = BaseService.checkFeatureRights(CORE.FEATURE_NAME.UnallocatedUMIDTransfer);
      if (vm.enableUnallocatedUMIDTransfer === null || vm.enableUnallocatedUMIDTransfer === undefined) {
        getAllRights(); //put for hard reload option as it will not get data from feature rights
      }
    };
    getAllRights();

    vm.goToWHList = () => {
      BaseService.goToWHList();
    };

    vm.goToBinList = () => {
      BaseService.goToBinList();
    };

    vm.goToUMIDList = () => {
      BaseService.goToUMIDList();
      return false;
    };

    vm.goToUMIDDetail = (data) => BaseService.goToUMIDDetail(data.id);

    let parentWarehouse, warehouse, bin = null;
    vm.headerData = [];
    vm.title = null;
    if (vm.transferItemDet.transferItem.transferSection === vm.transferSection.WH) {
      vm.title = CORE.TrasferStockType.WarehouseTransfer;
      warehouse = vm.transferItemDet.transferItem.name;
      parentWarehouse = vm.transferItemDet.transferItem.deptName;
    }
    else if (vm.transferItemDet.transferItem.transferSection === vm.transferSection.Bin) {
      vm.title = CORE.TrasferStockType.BinTransfer;
      bin = vm.transferItemDet.transferItem.name;
      warehouse = vm.transferItemDet.transferItem.warehouseName;
      parentWarehouse = vm.transferItemDet.transferItem.deptName;
    }
    else if (vm.transferItemDet.transferItem.transferSection === vm.transferSection.UID) {
      vm.title = CORE.TrasferStockType.UMIDTransfer;

      vm.headerData.push({
        label: vm.LabelConstant.TransferStock.UMID,
        labelLinkFn: vm.goToUMIDList,
        isCopy: true,
        value: vm.transferItemDet.transferItem.uid,
        valueLinkFn: vm.goToUMIDDetail,
        valueLinkFnParams: { id: vm.transferItemDet.transferItem.id },
        displayOrder: (vm.headerData.length + 1)
      });
      bin = vm.transferItemDet.transferItem.binName;
      warehouse = vm.transferItemDet.transferItem.warehouseName;
      parentWarehouse = vm.transferItemDet.transferFromDept.Name;
    }
    else if (vm.transferItemDet.transferItem.transferSection === vm.transferSection.Kit && vm.transferItemDet.transferTo === vm.transferSection.Dept) {
      vm.title = CORE.TrasferStockType.KitTransfer;
      vm.headerData.push({
        label: vm.LabelConstant.TransferStock.Kit,
        value: vm.transferItemDet.transferItem.name,
        displayOrder: (vm.headerData.length + 1)
      });
    }

    if (bin) {
      vm.headerData.push({
        label: vm.LabelConstant.TransferStock.Bin,
        labelLinkFn: vm.goToBinList,
        value: bin,
        displayOrder: (vm.headerData.length + 1)
      });
    }
    if (warehouse) {
      vm.headerData.push({
        label: vm.LabelConstant.TransferStock.WH,
        labelLinkFn: vm.goToWHList,
        value: warehouse,
        displayOrder: (vm.headerData.length + 1)
      });
    }
    if (parentWarehouse) {
      vm.headerData.push({
        label: vm.LabelConstant.TransferStock.ParentWH,
        labelLinkFn: vm.goToWHList,
        value: parentWarehouse,
        displayOrder: (vm.headerData.length + 1)
      });
    }

    vm.warehouseFilter = {
      deptID: null
    };

    vm.binFilter = {
      warehouseID: null
    };

    const initSearchAutoComplete = () => {
      vm.autoCompleteToDept = {
        columnName: 'Name',
        keyColumnName: 'ID',
        keyColumnId: (vm.transferItemDet.transferOption === vm.TrasferStockType.StockTransfer || vm.transferItemDet.transferOption === vm.TrasferStockType.KitTransfer || (vm.transferItemDet.transferOption === vm.TrasferStockType.DeptTransfer && vm.transferItemDet.uidID)) ? (!vm.transferItemDet.transferToDept && !vm.transferItemDet.transferOption ? null : vm.transferItemDet.transferFromDept.ID) : (vm.transferItemDet.transferToDept ? vm.transferItemDet.transferToDept.ID : null),
        inputName: 'toDept',
        placeholderName: 'Department',
        isRequired: true,
        isAddnew: false,
        isDisabled: (vm.transferItemDet.transferOption === vm.TrasferStockType.StockTransfer || vm.transferItemDet.transferOption === vm.TrasferStockType.KitTransfer || (vm.transferItemDet.transferOption === vm.TrasferStockType.DeptTransfer && vm.transferItemDet.uidID)),
        callbackFn: getDeptList,
        onSelectCallbackFn: (item) => {
          vm.warehouseFilter.deptID = item ? item.ID : null;
          if (item) {
            $timeout(() => { featureCheck(item); });
            if (!vm.transferItemDet.transferToDept || !vm.transferItemDet.transferOption) {
              vm.transferItemDet.transferToDept = item.ID;
              vm.transferItemDet.transferOption = item.ID === vm.transferItemDet.transferFromDept.ID ? CORE.TrasferStockType.StockTransfer : CORE.TrasferStockType.StockTransferToOtherDept;
            }
            setFocus('scanWarehouse');
          }
        }
      };
    };

    const featureCheck = (item) => {
      const enableWHToWHTransfer = BaseService.checkFeatureRights(CORE.FEATURE_NAME.TransferWHToWHToOtherDepartment);
      if (item.ID !== vm.transferItemDet.transferFromDept.ID && !enableWHToWHTransfer) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_RIGHT_FOR_FEATURE);
        messageContent.message = stringFormat(messageContent.message, CORE.FEATURE_NAME.TransferWHToWHToOtherDepartment);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model).then((yes) => {
          if (yes) {
            vm.autoCompleteToDept.keyColumnId = null;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    /* Scan warehouse to transfer stock */
    vm.scanWarehouse = ($event, isEnter) => {
      $timeout(()=> {
        if (isEnter) {
          if ($event.keyCode === 13) {
            if (vm.scanAndSearch.scanWarehouse) {
              if (vm.transferItemDet.transferTo === vm.transferSection.Bin) {
                setFocus('scanBin');
              }
              else {
                setFocus('btnTransfer');
              }
            }
          }
        } else {
          vm.searchWarehouse();
        }
      });
      /** Prevent enter key submit event */
      preventInputEnterKeyEvent($event);
    };


    /* Search detail of scan warehouse to transfer stock */
    vm.searchWarehouse = () => {
      if (vm.scanAndSearch.scanWarehouse) {
        WarehouseBinFactory.getWarehouseDetailByName().query({ name: vm.scanAndSearch.scanWarehouse }).$promise.then((response) => {
          let messageContent = null;
          if (response && response.data) {
            if (vm.warehouseFilter.deptID === response.data.parentWarehouseMst.id) {
              vm.transferToWH = response.data;
            }
            else {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SCAN_WH_ParentWH_INVALID);
            }
          }
          else {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SCAN_VALID_WAREHOUSE);
          }
          if (messageContent) {
            vm.transferToBin = null;
            vm.scanAndSearch.scanBin = null;
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                vm.scanAndSearch.scanWarehouse = null;
                setFocus('scanWarehouse');
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        vm.transferToWH = null;
      }
    };

    /* Scan bin to transfer stock */
    vm.scanBin = ($event, isEnter) => {
      //$timeout(function () {
      //  if ($event.keyCode == 13) {
      //    vm.searchBin();
      //  }
      //});
      $timeout(()=> {
        if (isEnter) {
          if ($event.keyCode === 13) {
            $event.preventDefault(); $event.stopPropagation();
            if (vm.scanAndSearch.scanBin) {
              setFocus('btnTransfer');
            }
          }
        } else {
          vm.searchBin();
        }
      });

      /** Prevent enter key submit event */
      preventInputEnterKeyEvent($event);
    };

    /* Search detail of scan bin to transfer stock */
    vm.searchBin = () => {
      if (vm.scanAndSearch.scanBin) {
        BinFactory.getBinDetailByName().query({ name: vm.scanAndSearch.scanBin }).$promise.then((response) => {
          let messageContent = null;
          if (response && response.data) {
            if (vm.warehouseFilter.deptID !== response.data.warehousemst.parentWarehouseMst.id) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SCAN_BIN_ParentWH_INVALID);
            }
            else if (vm.transferToWH && vm.transferToWH.id !== response.data.warehousemst.id) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SCAN_BIN_WH_INVALID);
            }
            else {
              vm.transferToBin = response.data;
              const warehouseDet = response.data ? response.data.warehousemst : null;
              if (warehouseDet && !vm.transferToWH) {
                vm.scanAndSearch.scanWarehouse = warehouseDet.Name;
                vm.transferToWH = {
                  deptName: warehouseDet.parentWarehouseMst.Name,
                  id: warehouseDet.id,
                  name: warehouseDet.Name,
                  parentWHID: warehouseDet.parentWHID
                };
              }
            }
          }
          else {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SCAN_VALID_BIN);
          }
          if (messageContent) {
            vm.transferToBin = null;
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                vm.scanAndSearch.scanBin = null;
                setFocus('scanBin');
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        vm.transferToBin = null;
        if (!vm.scanAndSearch.scanWarehouse || !vm.transferToWH) {
          vm.transferToWH = null;
        }
      }
    };


    /* Retrieve list of active department for search */
    const getDeptList = () => {
      vm.deptList = [];
      return BinFactory.getAllWarehouse({ isDepartment: true }).query().$promise.then((deptlist) => {
        vm.deptList = (vm.transferItemDet.transferOption === vm.TrasferStockType.DeptTransfer || vm.transferItemDet.transferOption === vm.TrasferStockType.StockTransferToOtherDept) ?
          _.filter(deptlist.data, (obj) => {
            if (vm.transferItemDet.transferOption === vm.TrasferStockType.DeptTransfer && vm.transferItemDet.uidID) {
              return obj.ID === vm.transferItemDet.transferFromDept.ID;
            } else {
              return obj.ID !== vm.transferItemDet.transferFromDept.ID;
            }
          }) : deptlist.data;
        return $q.resolve(vm.deptList);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const active = () => {
      const autocompletePromise = [getDeptList()];
      vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
        initSearchAutoComplete();

        const dept = _.find(vm.deptList, { ID: vm.autoCompleteToDept.keyColumnId });
        if (!dept && vm.deptList.length > 0 && vm.autoCompleteToDept && vm.transferItemDet.transferToDept && vm.transferItemDet.transferOption) {
          vm.autoCompleteToDept.keyColumnId = _.first(vm.deptList).ID;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    active();

    ///* Retrieve list of active warehouse for search */
    //vm.getSearchWarehouse = () => {
    //  return TransferStockFactory.getActiveWarehouse(vm.warehouseFilter).query().$promise.then((response) => {
    //    return response.data && response.data.warehouseList ? response.data.warehouseList : [];
    //  }).catch((error) => {
    //    return BaseService.getErrorLog(error);
    //  });
    //};

    ///* Retrieve list of active bin for search */
    //vm.getSearchBin = () => {
    //  vm.binFilter.parentWHID = vm.autoCompleteToDept.keyColumnId;
    //  return vm.cgBusyLoading = ReceivingMaterialFactory.getAllBin().query(vm.binFilter).$promise.then((response) => {
    //    return response && response.data ? response.data : [];
    //  }).catch((error) => {
    //    return BaseService.getErrorLog(error);
    //  });
    //};

    vm.checkMismatchInventoryValidation = ($event) => {
      if (vm.transferItemDet.transferOption === CORE.TrasferStockType.DeptTransfer) {
        if (vm.transferItemDet && vm.transferItemDet.isCheckMismatchInventory) {
          const inventoryMismatch = {
            whDetail: vm.transferItemDet.mismatchInventoryData.whDetail,
            currentKit: vm.transferItemDet.mismatchInventoryData.currentKit,
            salesOrderDetail: vm.transferItemDet.mismatchInventoryData.salesOrderDetail
          };

          if (vm.transferItemDet.transType === CORE.UMID_History.Trasaction_Type.Bin_WH_Transfer) {
            inventoryMismatch.binDetail = vm.transferItemDet.mismatchInventoryData.binDetail;
          } else {
            inventoryMismatch.whDetail = vm.transferItemDet.mismatchInventoryData.whDetail;
          }

          if (vm.transferItemDet.transferItem.parentWHType === CORE.ParentWarehouseType.MaterialDepartment) {
            vm.cgBusyLoading = TransferStockFactory.getMismatchItemForKit().query({
              refSalesOrderDetID: inventoryMismatch.currentKit.refSalesOrderDetID,
              assyId: inventoryMismatch.currentKit.assyID,
              parentWHType: CORE.ParentWarehouseType.MaterialDepartment,
              warehouseId: vm.transferItemDet.transType === CORE.UMID_History.Trasaction_Type.Bin_WH_Transfer ? vm.transferItemDet.transferItem.warehouseID : vm.transferItemDet.transferItem.id,
              binId: vm.transferItemDet.transType === CORE.UMID_History.Trasaction_Type.Bin_WH_Transfer ? vm.transferItemDet.transferItem.id : null
            }).$promise.then((res) => {
              if (res.data && res.data.mismatchCount) {
                vm.kitReleaseMismatchDetail(inventoryMismatch, $event);
              } else {
                vm.transferStock($event);
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
          else {
            vm.transferStock($event);
          }
        } else {
          vm.transferStock($event);
        }
      } else {
        vm.transferStock($event);
      }
    };

    vm.kitReleaseMismatchDetail = (inventoryMismatch, $event) => {
      if (inventoryMismatch) {
        const curentKitDetail = inventoryMismatch.currentKit;
        const KitReleaseDetail = {
          refSalesOrderDetID: inventoryMismatch.salesOrderDetail.SalesOrderDetailId,
          mainAssyID: inventoryMismatch.salesOrderDetail.partId,
          assyID: curentKitDetail.assyID,
          selectedAssy: curentKitDetail
        };

        const kitDetail = {
          salesOrderDetail: inventoryMismatch.salesOrderDetail,
          refSalesOrderDetID: inventoryMismatch.salesOrderDetail.SalesOrderDetailId,
          assyID: curentKitDetail.assyID,
          isConsolidated: false
        };

        const releaseDetail = {
          kitDetail: kitDetail,
          releasePlan: curentKitDetail.nextReleasePlan,
          kitAssyDetail: KitReleaseDetail,
          isMismatchItems: true
        };

        if (vm.transferItemDet.transType === CORE.UMID_History.Trasaction_Type.Bin_WH_Transfer) {
          releaseDetail.warehouseId = inventoryMismatch.binDetail.warehouseID;
          releaseDetail.binId = inventoryMismatch.binDetail.id;
          releaseDetail.callFrom = stringFormat('{0} (Transfer: {1})', vm.TrasferStockType.DeptTransfer, vm.transferSection.Bin);
        } else {
          releaseDetail.warehouseId = inventoryMismatch.whDetail.id;
          releaseDetail.binId = null;
          releaseDetail.callFrom = stringFormat('{0} (Transfer: {1})', CORE.TrasferStockType.DeptTransfer, CORE.TransferSection.WH);
        }

        DialogFactory.dialogService(
          TRANSACTION.KIT_RELEASE_MISMATCH_INVENTORY_POPUP_CONTROLLER,
          TRANSACTION.KIT_RELEASE_MISMATCH_INVENTORY_POPUP_VIEW,
          event,
          releaseDetail).then(() => {
          }, (data) => {
            if (data) {
              vm.transferStock($event);
            }
          }, (err) => {
            BaseService.currentPagePopupForm = [];
            return BaseService.getErrorLog(err);
          });
      }
    };

    vm.transferStock = ($event) => {
      $event.preventDefault();
      $event.stopPropagation();
      if (vm.transferStockForm.$invalid) {
        BaseService.focusRequiredField(vm.transferStockForm); //e.g. msWizard.currentStepForm() in case of wizard and vm.formKitRelease in simple form
        return;
      }
      const stockDetail = {
        transferType: vm.transferItemDet.transferOption,
        fromWHID: vm.transferItemDet.fromWHID,
        fromBinID: vm.transferItemDet.fromBinID,
        uidID: vm.transferItemDet.uidID,
        refSalesOrderDetID: vm.transferItemDet.refSalesOrderDetID,
        assyID: vm.transferItemDet.assyID
      };
      const objDept = _.find(vm.deptList, { ID: vm.autoCompleteToDept.keyColumnId });

      let droptargetModel = null;
      let focusOnControl = null;
      if (vm.transferItemDet.transferTo === vm.transferSection.WH) {
        droptargetModel = vm.transferToWH;
        if (droptargetModel) {
          droptargetModel.transferSection = vm.transferSection.WH;
          droptargetModel.name = droptargetModel.Name;
          droptargetModel.parentWHType = droptargetModel.parentWHType ? droptargetModel.parentWHType : droptargetModel.parentWarehouseMst.parentWHType;
          focusOnControl = 'scanWarehouse';
        }
        else {
          droptargetModel = {
            parentWHID: vm.autoCompleteToDept.keyColumnId,
            transferSection: vm.transferSection.WH,
            name: objDept.Name,
            parentWHType: objDept.parentWHType
          };
        }
      }
      else if (vm.transferItemDet.transferTo === vm.transferSection.Bin) {
        droptargetModel = vm.transferToBin;
        droptargetModel.parentWHID = droptargetModel.warehousemst.parentWHID;
        droptargetModel.parentWHType = droptargetModel.warehousemst.parentWarehouseMst.parentWHType;
        droptargetModel.warehouseType = droptargetModel.warehousemst.warehouseType;
        droptargetModel.transferSection = vm.transferSection.Bin;
        droptargetModel.name = droptargetModel.Name;
        focusOnControl = 'scanBin';
      }

      const messageContent = BaseService.validateTransferStock(vm.transferItemDet.transferOption, vm.transferItemDet.transferItem, droptargetModel);
      if (messageContent) {
        if (messageContent.message === TRANSACTION.PERFORM_ACTION_IN_TRANSFER_VALIDATION.OPEN_EMPTY_POP_UP) {
          const transferDetail = {
            emptyBinWHList: [
              {
                allMovableBin: sourceModel.allMovableBin,
                emptyBin: sourceModel.totalEmptyBin,
                emptyBinName: sourceModel.emptyBinName,
                isPermanentWH: sourceModel.isPermanent,
                isSelect: true,
                parentWHID: sourceModel.parentWHID,
                parentWHType: sourceModel.parentWHType,
                parentWHName: sourceModel.deptName,
                warehouseID: sourceModel.id,
                warehouseName: sourceModel.name,
                warehouseType: sourceModel.warehouseType
              }
            ],
            stockDetail: {
              assyID: vm.salesOrderDetail && vm.salesOrderDetail.assyId ? vm.salesOrderDetail.assyId : null,
              refSalesOrderDetID: vm.salesOrderDetail && vm.salesOrderDetail.SalesOrderDetailId ? vm.salesOrderDetail.SalesOrderDetailId : null
            },
            sourceModelName: vm.salesOrderDetail ? stringFormat('{0}, {1}{2}{3}', vm.salesOrderDetail.poNumber, vm.salesOrderDetail.soNumber, vm.salesOrderDetail.SubAssy, vm.salesOrderDetail.poQty) : null,
            deptTransferToName: droptargetModel.name,
            //transferFromDept: {
            //  Name: sourceModel.deptName,
            //  ID: sourceModel.parentWHID,
            //  isPermanentWH: true
            //},
            transferFromDept: null,
            isConfirmation: true
          };

          DialogFactory.dialogService(
            CORE.TRANSFER_EMPTY_BIN_MODAL_CONTROLLER,
            CORE.TRANSFER_EMPTY_BIN_MODAL_VIEW,
            event,
            transferDetail).then((response) => {
              if (response) {
                checkWHToWhAllocatedKitValidation(sourceModel, droptargetModel);
              }
            }, () => {
            }, (err) => BaseService.getErrorLog(err));
        }
        else if (messageContent.message === TRANSACTION.PERFORM_ACTION_IN_TRANSFER_VALIDATION.WH_TRANSFER_CONFIRMATION_ALLOCATED_KIT) {
          checkWHToWhAllocatedKitValidation(sourceModel, droptargetModel);
        }
        else if (messageContent.message === TRANSACTION.PERFORM_ACTION_IN_TRANSFER_VALIDATION.WH_TRANSFER_CONFIRMATION_UNALLOCATED_UMID) {
          checkWHToWhUnallocatedUMIDValidation(sourceModel, droptargetModel);
        }
        else {
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model).then(() => {
            setFocus(focusOnControl);
            vm.scanAndSearch[focusOnControl] = null;
          });
          //DialogFactory.alertDialog(model).then(() => {
          //  setFocus(focusOnControl);
          //  vm.scanAndSearch[focusOnControl] = null;
          //});
        }
        return;
      }

      let confirmationObj = null;
      if (vm.transferItemDet.transferTo === vm.transferSection.WH) {
        stockDetail.toWHID = vm.transferToWH ? vm.transferToWH.id : null;
        if (vm.transferItemDet.transferItem.transferSection === vm.transferSection.WH) {
          if (vm.transferToWH) {
            stockDetail.transType = vm.UMID_History.Trasaction_Type.WH_WH_Transfer;
            if (vm.transferItemDet.transferItem.otherKitName) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.WH_TO_MATERIAL_DEPT_TRANSFER_WITH_OTHER_KIT_CONFIRMATION_MSG);
              messageContent.message = stringFormat(messageContent.message, vm.transferItemDet.transferItem.name, droptargetModel.name, vm.transferItemDet.transferItem.otherKitName);
              confirmationObj = messageContent;
            }
            else {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.WH_TO_WH_TRANSFER_CONFIRMATION_MSG);
              messageContent.message = stringFormat(messageContent.message, vm.transferItemDet.transferItem.name, vm.transferToWH.Name);
              confirmationObj = messageContent;
            }
          }
          else {
            stockDetail.transType = vm.UMID_History.Trasaction_Type.WH_Dept_Transfer;
            stockDetail.toParentWH = droptargetModel.parentWHID;
            if (vm.transferItemDet.transferItem.otherKitName && vm.transferItemDet.transferItem.parentWHType === CORE.ParentWarehouseType.ProductionDepartment) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.TRANSFER_WH_WITH_ALLOCATED_KIT_CONFIRMATION);
              messageContent.message = stringFormat(messageContent.message, vm.transferItemDet.transferItem.name, vm.transferItemDet.transferItem.deptName, droptargetModel.name, vm.transferItemDet.transferItem.otherKitName);
              confirmationObj = messageContent;
            }
            else {
              if (vm.transferItemDet.transferItem.otherKitName) {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.TRANSFER_WH_WITH_ALLOCATED_KIT_CONFIRMATION);
                messageContent.message = stringFormat(messageContent.message, vm.transferItemDet.transferItem.name, vm.transferItemDet.transferItem.deptName, droptargetModel.name, vm.transferItemDet.transferItem.otherKitName);
                confirmationObj = messageContent;
              } else {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.WH_TO_DEPT_TRANSFER_CONFIRMATION_MSG);
                messageContent.message = stringFormat(messageContent.message, vm.transferItemDet.transferItem.name, droptargetModel.name);
                confirmationObj = messageContent;
              }
            }
          }
        }
        else {
          stockDetail.transType = vm.UMID_History.Trasaction_Type.Bin_WH_Transfer;
          if (vm.transferItemDet.transferOption === vm.TrasferStockType.DeptTransfer || vm.transferItemDet.transferOption === vm.TrasferStockType.StockTransferToOtherDept) {
            if (vm.transferItemDet.transferItem.otherKitName) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.BIN_TO_WH_TRANSFER_WITH_OTHER_KIT_CONFIRMATION_MSG);
              messageContent.message = stringFormat(messageContent.message, vm.transferItemDet.transferItem.name, vm.transferToWH.Name, vm.transferItemDet.transferItem.otherKitName);
              confirmationObj = messageContent;
            } else {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.BIN_TO_WH_TRANSFER_CONFIRMATION_MSG);
              messageContent.message = stringFormat(messageContent.message, vm.transferItemDet.transferItem.name, vm.transferToWH.Name);
              confirmationObj = messageContent;
            }
          } else {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.BIN_TO_WH_TRANSFER_CONFIRMATION_MSG);
            messageContent.message = stringFormat(messageContent.message, vm.transferItemDet.transferItem.name, vm.transferToWH.Name);
            confirmationObj = messageContent;
          }
        }
      }
      else if (vm.transferItemDet.transferTo === vm.transferSection.Bin) {
        stockDetail.toBinID = vm.transferToBin.id;
        if (vm.transferItemDet.transferItem.transferSection === vm.transferSection.Bin) {
          stockDetail.transType = vm.UMID_History.Trasaction_Type.Bin_Bin_Transfer;
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.BIN_TO_BIN_TRANSFER_CONFIRMATION_MSG);
          messageContent.message = stringFormat(messageContent.message, vm.transferItemDet.transferItem.name, vm.transferToBin.Name);
          confirmationObj = messageContent;
        }
        else {
          stockDetail.transType = vm.UMID_History.Trasaction_Type.UMID_Bin_Transfer;
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.UID_TO_BIN_TRANSFER_CONFIRMATION_MSG);
          messageContent.message = stringFormat(messageContent.message, vm.transferItemDet.transferItem.uid, vm.transferToBin.Name);
          confirmationObj = messageContent;
        }
      }
      else if (vm.transferItemDet.transferItem.transferSection === vm.transferSection.Kit && vm.transferItemDet.transferTo === vm.transferSection.Dept) {
        stockDetail.transType = vm.UMID_History.Trasaction_Type.KitTransfer;
        stockDetail.toParentWH = vm.autoCompleteToDept.keyColumnId;
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.DEPT_TRANSFER_CONFIRMATION_MSG);
        messageContent.message = stringFormat(messageContent.message, vm.transferItemDet.transferItem.name, objDept ? objDept.Name : '');
        confirmationObj = messageContent;
        if (vm.transferItemDet.transferTo === vm.transferSection.Dept) {
          stockDetail.isKitSelected = true;
        }
      }

      if (vm.transferItemDet.transferItem.transferSection === vm.transferSection.Kit && vm.transferItemDet.transferTo === vm.transferSection.Dept) {
        vm.cgBusyLoading = TransferStockFactory.getKitWarehouseDetail({ refSalesOrderDetID: stockDetail.refSalesOrderDetID, assyID: stockDetail.assyID, fromParentWHID: data.transferFromDept.ID }).query().$promise.then((res) => {
          if (res.data) {
            // Get list of permanent warehouse
            const permenantWarehouse = _.uniq(
              _.union(
                _.map(_.filter(res.data.transferKitWHList, { isPermanentWH: 1 }), 'warehouseName'),
                _.map(_.filter(res.data.kitList, { isPermanentWH: 1 }), 'warehouseName'),
                _.map(_.filter(res.data.UMIDList, { isPermanentWH: 1 }), 'warehouseName')
              )
            );

            // If kit allocated stock in any permanent warehouse then not allow to transfer
            if (permenantWarehouse.length > 0) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_TRANSFER_PERMANENT_WH);
              messageContent.message = stringFormat(messageContent.message, permenantWarehouse.join(', '));

              const model = {
                messageContent: messageContent,
                multiple: true
              };
              DialogFactory.messageAlertDialog(model);
            }
            else if (res.data.nonUMIDList.length > 0) {
              // If warehouse contains non UMID stock then restrict user to transfer kit.
              const warehouseBinList = _.map(_.groupBy(res.data.nonUMIDList, 'warehouseName'), (item, index) =>`${index} [${_.map(item, 'binName')}]`) || '';

              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NON_UMID_STOCK_EXISTS_WITH_KIT);
              messageContent.message = stringFormat(messageContent.message, `(${vm.transferItemDet.transferItem.name})`, objDept ? objDept.Name : '', warehouseBinList);

              const model = {
                messageContent: messageContent,
                multiple: true
              };
              DialogFactory.messageAlertDialog(model);
            }
            else if (res.data.kitList.length > 0) {
              const KitString = _.map(_.map(res.data.kitList, (data) =>  data.kitString = stringFormat('{0}###{1}###{2}', data.refSalesOrderDetID, data.assyID, data.name))).join('@@@');

              const curKitString = stringFormat('{0}###{1}###{2}', vm.transferItemDet.transferItem.refSalesOrderDetID, vm.transferItemDet.transferItem.assyID, vm.transferItemDet.transferItem.name);
              const otherKitName = _.map(BaseService.generateRedirectLinkForKit(KitString)).join(', ');
              const currentKitName = BaseService.generateRedirectLinkForKit(curKitString);

              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.OTHER_KIT_STOCK_EXISTS_WITH_KIT);
              messageContent.message = stringFormat(messageContent.message, currentKitName, otherKitName, objDept ? objDept.Name : '');

              const model = {
                messageContent: messageContent,
                btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
              };

              DialogFactory.messageConfirmDialog(model).then((yes) => {
                if (yes) {
                  transfer(stockDetail);
                }
              }, () => {
              }).catch((error) => BaseService.getErrorLog(error));
            }
            else {
              vm.transferStockConfirmation(confirmationObj, stockDetail);
            }
          }
          else {
            vm.transferStockConfirmation(confirmationObj, stockDetail);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        vm.transferStockConfirmation(confirmationObj, stockDetail);
      }
    };

    /**
     * Check validation if any warehouse contains empty bin then ask confirmation to transfer kit with empty bin or transfer bin to other warehouse
     * @param {any} emptyBinWHList warehouse list containing empty bin
     * @param {any} objConfirmation confirmation pop-up detail
     * @param {any} stockDetail transfer stock detail
     * @param {any} sourceModelName kit name
     * @param {any} deptTransferToName department name
     */
    vm.checkEmptyBinValidation = (emptyBinWHList, stockDetail, sourceModelName, deptTransferToName) => {
      vm.selectWarehouseToTransferEmptyBin({ emptyBinWHList: emptyBinWHList, stockDetail: stockDetail, sourceModelName: sourceModelName, deptTransferToName: deptTransferToName });
    };

    vm.selectWarehouseToTransferEmptyBin = (transferDetail) => {
      transferDetail.transferFromDept = data.transferFromDept;
      DialogFactory.dialogService(
        CORE.TRANSFER_EMPTY_BIN_MODAL_CONTROLLER,
        CORE.TRANSFER_EMPTY_BIN_MODAL_VIEW,
        event,
        transferDetail).then((response) => {
          if (response) {
            BaseService.currentPagePopupForm = [vm.transferStockForm];
            transfer(transferDetail.stockDetail);
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.transferStockConfirmation = (confirmationObj, stockDetail) => {
      if (_transferStockConfirmationRequired) {
        const objConfirmation = {
          messageContent: confirmationObj,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(objConfirmation).then((yes) => {
          if (yes) {
            transfer(stockDetail);
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        transfer(stockDetail);
      }
    };

    const transfer = (stockDetail) => {
      let deptOption = vm.UMID_History.Trasaction_Type.WithinDept;
      if (vm.transferItemDet.transferOption === vm.TrasferStockType.StockTransferToOtherDept || vm.transferItemDet.transferOption === vm.TrasferStockType.DeptTransfer) {
        deptOption = vm.UMID_History.Trasaction_Type.OtherDept;
      }

      let transferOption = vm.UMID_History.Trasaction_Type.TransferStock;
      if (vm.transferItemDet.transferOption === vm.TrasferStockType.KitTransfer || vm.transferItemDet.transferOption === vm.TrasferStockType.DeptTransfer) {
        transferOption = vm.UMID_History.Trasaction_Type.TransferKit;
      }

      stockDetail.actionPerformed = stringFormat('{0} ({1}: {2})', vm.UMID_History.Action_Performed.TransferMaterial, transferOption, deptOption);
      //console.log(stockDetail);
      //return;
      vm.cgBusyLoading = TransferStockFactory.managestock().query(stockDetail).$promise.then((res) => {
        if (res.data) {
          const updateStock = _.first(res.data.transferDetail);
          BaseService.currentPagePopupForm = [];
          $mdDialog.hide({
            updateStock: updateStock,
            transferDet: {
              transferTo: vm.transferItemDet ? vm.transferItemDet.transferTo : null,
              whID: vm.transferToWH ? vm.transferToWH.id : null,
              binID: vm.transferToBin ? vm.transferToBin.id : null
            }
          });
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const checkWHToWhAllocatedKitValidation = (sourceDetail, targetModel) => {
      if (sourceDetail.numberTotalKit > 0) {
        const confirmationObj = {
          messageContent: null,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        if (targetModel.id) {
          if (sourceDetail.transferSection === vm.transferSection.WH) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.WH_TO_MATERIAL_DEPT_TRANSFER_WITH_OTHER_KIT_CONFIRMATION_MSG);
            messageContent.message = stringFormat(messageContent.message, sourceDetail.name, targetModel.name, sourceDetail.otherKitName);
            confirmationObj.messageContent = messageContent;
          }
          else if (sourceDetail.transferSection === vm.transferSection.Bin) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.BIN_TO_WH_TRANSFER_WITH_OTHER_KIT_CONFIRMATION_MSG);
            messageContent.message = stringFormat(messageContent.message, sourceDetail.name, targetModel.name, sourceDetail.otherKitName);
            confirmationObj.messageContent = messageContent;
          }
        }
        else {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.TRANSFER_WH_WITH_ALLOCATED_KIT_CONFIRMATION);
          messageContent.message = stringFormat(messageContent.message, sourceDetail.name, sourceDetail.deptName, targetModel.name, sourceDetail.otherKitName);
          confirmationObj.messageContent = messageContent;
        }
        DialogFactory.messageConfirmDialog(confirmationObj).then((yes) => {
          if (yes) {
            checkWHToWhUnallocatedUMIDValidation(sourceDetail, targetModel);
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        checkWHToWhUnallocatedUMIDValidation(sourceDetail, targetModel);
      }
    };

    const checkWHToWhUnallocatedUMIDValidation = (sourceDetail, targetModel) => {
      if (sourceDetail && targetModel) {
        if (sourceDetail.unallocatedUMID > 0) {
          if (vm.transferItemDet.transferOption === vm.TrasferStockType.StockTransferToOtherDept) {
            //if (sourceDetail.numberTotalKit > 0) {
            vm.unallocatedXferHistoryData = {};
            let messageContent = null;

            if (vm.enableUnallocatedUMIDTransfer) {
              if (sourceDetail.transferSection === vm.transferSection.WH) {
                messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.TRANSFER_WH_UNALLOCATED_UMID_WITH_PASSWORD_CONFIRMATION);
                messageContent.message = stringFormat(messageContent.message, sourceDetail.name, sourceDetail.deptName, targetModel.deptName ? targetModel.deptName : targetModel.name);
              }
              else if (sourceDetail.transferSection === vm.transferSection.Bin) {
                messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.TRANSFER_BIN_UNALLOCATED_UMID_WITH_PASSWORD_CONFIRMATION);
                messageContent.message = stringFormat(messageContent.message, sourceDetail.name, sourceDetail.deptName, targetModel.deptName ? targetModel.deptName : targetModel.name);
              }
              vm.unallocatedXferHistoryData.message = messageContent.message || null;

              DialogFactory.dialogService(
                TRANSACTION.TRANSFER_STOCK_UNALLOCATED_UMID_HISTORY_POPUP_CONTROLLER,
                TRANSACTION.TRANSFER_STOCK_UNALLOCATED_UMID_HISTORY_POPUP_VIEW,
                event,
                vm.unallocatedXferHistoryData)
                .then((data) => {
                  if (data) {
                    vm.unallocatedXferHistoryData = vm.unallocatedXferHistoryData = data || {};
                    vm.unallocatedXferHistoryData.category = vm.category ? vm.category : CORE.UMID_History.Category.Tranfer_Stock_Dept_To_Dept;
                    if (sourceDetail.transferSection && sourceDetail.transferSection === CORE.TransferSection.WH) {
                      vm.unallocatedXferHistoryData.transactionType = CORE.UMID_History.Trasaction_Type.WH_WH_Transfer;
                    } else if (sourceDetail.transferSection === CORE.TransferSection.WH && sourceDetail.transferSection === CORE.TransferSection.Dept) {
                      vm.unallocatedXferHistoryData.transactionType = CORE.UMID_History.Trasaction_Type.WH_Dept_Transfer;
                    } else if (sourceDetail.transferSection === CORE.TransferSection.Bin && sourceDetail.transferSection === CORE.TransferSection.WH) {
                      vm.unallocatedXferHistoryData.transactionType = CORE.UMID_History.Trasaction_Type.Bin_WH_Transfer;
                    }
                    vm.unallocatedXferHistoryData.transferFrom = sourceDetail.name;
                    vm.unallocatedXferHistoryData.transferTo = targetModel.deptName ? targetModel.deptName : targetModel.name;
                    targetModel.unallocatedXferHistoryData = vm.unallocatedXferHistoryData;
                    transferStockFromWHBINToWH(sourceDetail, targetModel);
                  } else {
                    vm.unallocatedXferHistoryData = null;
                  }
                }, (err) => BaseService.getErrorLog(err));
            }
            else if (!vm.enableUnallocatedUMIDTransfer) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_RIGHT_FOR_FEATURE);
              messageContent.message = stringFormat(messageContent.message, CORE.FEATURE_NAME.UnallocatedUMIDTransfer);
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              DialogFactory.messageAlertDialog(model);
            }
            //}
          } else {
            let messageContent = null;
            if (sourceDetail.transferSection === vm.transferSection.WH) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.TRANSFER_WH_WITH_UNALLOCATED_UMID_EROR);
              messageContent.message = stringFormat(messageContent.message, sourceDetail.name, sourceDetail.deptName, targetModel.deptName ? targetModel.deptName : targetModel.name);
            }
            else if (sourceDetail.transferSection === vm.transferSection.Bin) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.TRANSFER_BIN_WITH_UNALLOCATED_UMID_EROR);
              messageContent.message = stringFormat(messageContent.message, sourceDetail.name, sourceDetail.deptName, targetModel.deptName ? targetModel.deptName : targetModel.name);
            }

            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model);
          }
        } else {
          transferStockFromWHBINToWH(sourceDetail, targetModel);
        }
      }
    };

    const transferStockFromWHBINToWH = (sourceDetail, targetModel) => {
      const stockDetail = {
        transferType: vm.transferItemDet.transferOption,
        unallocatedXferHistoryData: targetModel.unallocatedXferHistoryData || null
      };
      if (sourceDetail.transferSection === vm.transferSection.WH) {
        stockDetail.fromWHID = sourceDetail.id;
        if (vm.transferToWH) {
          stockDetail.transType = vm.UMID_History.Trasaction_Type.WH_WH_Transfer;
          stockDetail.toWHID = targetModel.id;
        } else {
          stockDetail.transType = vm.UMID_History.Trasaction_Type.WH_Dept_Transfer;
          stockDetail.toParentWH = targetModel.parentWHID;
        }
      }
      else if (sourceDetail.transferSection === vm.transferSection.Bin) {
        stockDetail.fromBinID = sourceDetail.id;
        if (vm.transferToWH) {
          stockDetail.transType = vm.UMID_History.Trasaction_Type.Bin_WH_Transfer;
          stockDetail.toWHID = targetModel.id;
        }
      }
      transfer(stockDetail);
    };

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.transferStockForm);
      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        BaseService.currentPagePopupForm = [];
        $mdDialog.cancel();
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };


    // Check Form Dirty state on state change and reload browser
    angular.element(() => {
      BaseService.currentPagePopupForm = [vm.transferStockForm];
    });
  }
})();
