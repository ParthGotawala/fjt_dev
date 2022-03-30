

(function () {
  'use strict';

  angular
    .module('app.transaction.transferstock')
    .controller('TransferStockController', TransferStockController);

  /** @ngInject */
  function TransferStockController($rootScope, $scope, $state, $stateParams, DialogFactory, BaseService, USER, CORE, $timeout, TRANSACTION,
    TransferStockFactory, BinFactory, $q, ReceivingMaterialFactory, WarehouseBinFactory, socketConnectionService, PRICING, MasterFactory) {
    const vm = this;
    vm.currentState = $state.current.name;
    vm.TrasferStockType = CORE.TrasferStockType;
    vm.SOWorkingStatus = CORE.SOWorkingStatus;
    vm.showPidRightstatus = false;
    vm.showstatus = false;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.transferStockMessages = CORE.MESSAGE_CONSTANT.TRANSFER_STOCK;
    vm.Kit_Release_Status = CORE.Kit_Release_Status;
    vm.stringFormat = stringFormat;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.warehouseType = TRANSACTION.warehouseType;
    vm.otherKitTransferDet = [];
    vm.paramWHId = $stateParams.whId ? parseInt($stateParams.whId) : 0;
    vm.paramSalesOrderDetailId = $stateParams.sodId ? parseInt($stateParams.sodId) : 0;
    vm.paramAssyId = $stateParams.assyId ? parseInt($stateParams.assyId) : 0;
    vm.parentWarehouseType = CORE.ParentWarehouseType;
    vm.enableWHToWHTransfer = false;
    vm.enableUnallocatedUMIDTransfer = false;
    let reTryCount = 0;
    vm.loginUser = BaseService.loginUser;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.emptySearch = CORE.EMPTYSTATE.EMPTY_SEARCH;
    vm.kitReleaseStatus = CORE.ReleaseKitStatusGridHeaderDropdown;

    vm.fromQuery = {
      order: ''
    };
    vm.toQuery = {
      order: ''
    };

    const getAllRights = () => {
      vm.enableWHToWHTransfer = BaseService.checkFeatureRights(CORE.FEATURE_NAME.TransferWHToWHToOtherDepartment);
      vm.enableUnallocatedUMIDTransfer = BaseService.checkFeatureRights(CORE.FEATURE_NAME.UnallocatedUMIDTransfer);
      if ((vm.enableWHToWHTransfer === null || vm.enableWHToWHTransfer === undefined) || (vm.enableUnallocatedUMIDTransfer === null || vm.enableUnallocatedUMIDTransfer === undefined) && (reTryCount < _configGetFeaturesRetryCount)) {
        getAllRights(); // put for hard reload option as it will not get data from feature rights
        reTryCount++;
      }
    };

    getAllRights();

    vm.selectedDetail = {
      Dept: {
        transferFrom: null,
        transferTo: null
      },
      WH: {
        transferFrom: null,
        transferTo: null
      },
      Bin: {
        transferFrom: null,
        transferTo: null
      },
      Kit: {
        transferFrom: null,
        transferTo: null
      }
    };

    vm.cartImages = CORE.CartImages;
    vm.filter = {
      transferOption: vm.TrasferStockType.StockTransfer
    };

    vm.transferSection = CORE.TransferSection;

    vm.warehouseList = {
      transferFrom: [],
      transferTo: []
    };

    vm.kitList = {
      transferFrom: [],
      transferTo: []
    };

    vm.binList = {
      transferFrom: [],
      transferTo: []
    };

    vm.componentList = {
      transferFrom: [],
      transferTo: []
    };

    vm.warehouseFilter = {
      transferFrom: {
        deptID: 0,
        page: CORE.UIGrid.Page()
      },
      transferTo: {
        deptID: 0,
        page: CORE.UIGrid.Page()
      }
    };

    vm.kitFilter = {
      transferFrom: {
        deptID: 0,
        isCheckMRP: false,
        isCheckMWS: false,
        isCheckMRE: false,
        isCheckPRE: false,
        isCheckPPR: false,
        isCheckMRR: false,
        isCheckPNR: false
      },
      transferTo: {
        deptID: 0,
        isCheckMRP: false,
        isCheckMWS: false,
        isCheckMRE: false,
        isCheckPRE: false,
        isCheckPPR: false,
        isCheckMRR: false,
        isCheckPNR: false
      },
      transferFromAutocomplete: {
        deptID: null
      },
      transferToAutocomplete: {
        deptID: null
      },
      globalSearchFromAutocomplete: {
        deptID: null
      }
    };

    vm.binFilter = {
      transferFrom: {
        warehouseID: 0,
        page: CORE.UIGrid.Page()
      },
      transferTo: {
        warehouseID: 0,
        page: CORE.UIGrid.Page()
      }
    };

    vm.uidFilter = {
      transferFrom: {
        binID: 0,
        page: CORE.UIGrid.Page()
      },
      transferTo: {
        binID: 0,
        page: CORE.UIGrid.Page()
      }
    };

    vm.emptyDropContent = {
      kit: {
        deptID: null,
        name: null,
        type: null,
        transferSection: vm.transferSection.Dept
      },
      WH: {
        parentWHID: null,
        name: null,
        type: null,
        transferSection: vm.transferSection.WH
      }
    };

    const setDefaultValueOfKitFilterCheckBox = () => {
      vm.kitFilter.transferFrom.isCheckMRP = false;
      vm.kitFilter.transferFrom.isCheckMWS = false;
      vm.kitFilter.transferFrom.isCheckMRE = false;
      vm.kitFilter.transferFrom.isCheckPRE = false;
      vm.kitFilter.transferFrom.isCheckPPR = false;
      vm.kitFilter.transferFrom.isCheckPNR = false;
      vm.kitFilter.transferFrom.isCheckMRR = false;
      vm.kitFilter.transferTo.isCheckMRP = false;
      vm.kitFilter.transferTo.isCheckMWS = false;
      vm.kitFilter.transferTo.isCheckMRE = false;
      vm.kitFilter.transferTo.isCheckPRE = false;
      vm.kitFilter.transferTo.isCheckPPR = false;
      vm.kitFilter.transferTo.isCheckPNR = false;
      vm.kitFilter.transferTo.isCheckMRR = false;

      if (vm.selectedDetail && vm.selectedDetail.Dept && vm.selectedDetail.Dept.transferFrom && vm.selectedDetail.Dept.transferFrom.parentWHType === vm.parentWarehouseType.MaterialDepartment) {
        vm.kitFilter.transferFrom.isCheckMRP = true;
        vm.kitFilter.transferFrom.isCheckMWS = true;
        vm.kitFilter.transferFrom.isCheckMRR = true;
        vm.kitFilter.transferFrom.isCheckMRE = false;
      } else if (vm.selectedDetail && vm.selectedDetail.Dept && vm.selectedDetail.Dept.transferFrom && vm.selectedDetail.Dept.transferFrom.parentWHType === vm.parentWarehouseType.ProductionDepartment) {
        vm.kitFilter.transferFrom.isCheckPRE = true;
        vm.kitFilter.transferFrom.isCheckPPR = true;
        vm.kitFilter.transferFrom.isCheckPNR = false;
      }

      if (vm.selectedDetail && vm.selectedDetail.Dept && vm.selectedDetail.Dept.transferTo && vm.selectedDetail.Dept.transferTo.parentWHType === vm.parentWarehouseType.MaterialDepartment) {
        vm.kitFilter.transferTo.isCheckMRP = true;
        vm.kitFilter.transferTo.isCheckMWS = true;
        vm.kitFilter.transferTo.isCheckMRR = true;
        vm.kitFilter.transferTo.isCheckMRE = false;
      } else if (vm.selectedDetail && vm.selectedDetail.Dept && vm.selectedDetail.Dept.transferTo && vm.selectedDetail.Dept.transferTo.parentWHType === vm.parentWarehouseType.ProductionDepartment) {
        vm.kitFilter.transferTo.isCheckPRE = true;
        vm.kitFilter.transferTo.isCheckPPR = true;
        vm.kitFilter.transferTo.isCheckPNR = false;
      }

      vm.showFromKitFilterEmptyState = false;
      vm.showToKitFilterEmptyState = false;
    };

    vm.scanAndSearch = {};

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    /** Handle object to manage drag and drop functionality */
    vm.sortableOptions = {
      connectWith: '.apps-container',
      handle: '> .myHandle',
      start: (e, ui) => {
        vm.dragItem = null;
        if (ui.item && ui.item.sortable && ui.item.sortable.model) {
          vm.dragItem = ui.item.sortable.model;
        }

        let messageContent = null;
        if (!vm.autoCompleteFromDept.keyColumnId || !vm.autoCompleteToDept.keyColumnId) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SELECT_PARENT_WAREHOUSE);
        } else if (vm.autoCompleteFromDept.keyColumnId !== vm.autoCompleteToDept.keyColumnId &&
          (vm.filter.transferOption === vm.TrasferStockType.StockTransfer || vm.filter.transferOption === vm.TrasferStockType.KitTransfer)) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.TRANSFER_WITHIN_DEPARTMENT);
        } else if (vm.autoCompleteFromDept.keyColumnId === vm.autoCompleteToDept.keyColumnId && (vm.filter.transferOption === vm.TrasferStockType.DeptTransfer || vm.filter.transferOption === vm.TrasferStockType.StockTransferToOtherDept)) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.TRANSFER_TO_OTHER_DEPARTMENT);
        }

        if (messageContent) {
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
          ui.item.sortable.cancel();
        }
      },
      update: function (e, ui) {
        ui.item.sortable.cancel();
      },
      stop: function (e, ui) {
        const sourceModel = angular.copy(vm.dragItem);
        vm.dragItem = null;

        if (!vm.autoCompleteFromDept.keyColumnId ||
          !vm.autoCompleteToDept.keyColumnId ||
          (vm.autoCompleteFromDept.keyColumnId !== vm.autoCompleteToDept.keyColumnId && (vm.filter.transferOption === vm.TrasferStockType.StockTransfer || vm.filter.transferOption === vm.TrasferStockType.KitTransfer)) ||
          (vm.autoCompleteFromDept.keyColumnId === vm.autoCompleteToDept.keyColumnId && (vm.filter.transferOption === vm.TrasferStockType.DeptTransfer || vm.filter.transferOption === vm.TrasferStockType.StockTransferToOtherDept))) {
          ui.item.sortable.cancel();
          return;
        }

        let droptargetModel = _.first(ui.item.sortable.droptargetModel);
        if (!droptargetModel && (vm.filter.transferOption === vm.TrasferStockType.DeptTransfer || vm.filter.transferOption === vm.TrasferStockType.StockTransferToOtherDept)) {
          droptargetModel = ui.item.sortable.droptargetModel;
        }
        let isTransferStock = false;
        if (droptargetModel) {
          if (sourceModel.transferLabel === droptargetModel.transferLabel) {
            ui.item.sortable.cancel();
            return;
          }

          let messageContent = null;

          if ((droptargetModel && droptargetModel.id) && (vm.filter.transferOption === vm.TrasferStockType.StockTransferToOtherDept || vm.filter.transferOption === vm.TrasferStockType.DeptTransfer) && !vm.enableWHToWHTransfer) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_RIGHT_FOR_FEATURE);
            messageContent.message = stringFormat(messageContent.message, CORE.FEATURE_NAME.TransferWHToWHToOtherDepartment);
          } else if (sourceModel.transferSection === vm.transferSection.Bin && droptargetModel.transferSection === vm.transferSection.Bin && (vm.filter.transferOption === vm.TrasferStockType.StockTransferToOtherDept || vm.filter.transferOption === vm.TrasferStockType.DeptTransfer)) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.BIN_TO_BIN_NOT_ALLOW);
          } else {
            messageContent = BaseService.validateTransferStock(vm.filter.transferOption, sourceModel, droptargetModel);
          }

          if (messageContent) {
            if (messageContent.message === TRANSACTION.PERFORM_ACTION_IN_TRANSFER_VALIDATION.OPEN_EMPTY_POP_UP) {
              if (sourceModel.id === droptargetModel.id) {
                // can't move within same WH
                ui.item.sortable.cancel();
                return;
              }

              const transferDetail = {
                emptyBinWHList: [{
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
                }],
                stockDetail: {
                  assyID: vm.salesOrderDetail && vm.salesOrderDetail.assyId ? vm.salesOrderDetail.assyId : null,
                  refSalesOrderDetID: vm.salesOrderDetail && vm.salesOrderDetail.SalesOrderDetailId ? vm.salesOrderDetail.SalesOrderDetailId : null
                },
                sourceModelName: vm.salesOrderDetail ? stringFormat('{0}, {1}{2}{3}', vm.salesOrderDetail.poNumber, vm.salesOrderDetail.soNumber, vm.salesOrderDetail.SubAssy, vm.salesOrderDetail.poQty) : null,
                deptTransferToName: droptargetModel.deptName ? droptargetModel.deptName : droptargetModel.name,
                // transferFromDept: {
                //  Name: sourceModel.deptName,
                //  ID: sourceModel.parentWHID,
                //  isPermanentWH: true
                // },
                transferFromDept: null,
                isConfirmation: true
              };

              DialogFactory.dialogService(
                CORE.TRANSFER_EMPTY_BIN_MODAL_CONTROLLER,
                CORE.TRANSFER_EMPTY_BIN_MODAL_VIEW,
                event,
                transferDetail).then((response) => {
                  if (response) {
                    vm.refreshWH('transferFrom', sourceModel.id, false);
                    checkWHToWhAllocatedKitValidation(sourceModel, droptargetModel);
                  }
                }, () => { }, (err) => BaseService.getErrorLog(err));
            } else if (messageContent.message === TRANSACTION.PERFORM_ACTION_IN_TRANSFER_VALIDATION.WH_TRANSFER_CONFIRMATION_ALLOCATED_KIT) {
              if (sourceModel.id === droptargetModel.id) {
                // can't move within same WH
                ui.item.sortable.cancel();
                return;
              }
              checkWHToWhAllocatedKitValidation(sourceModel, droptargetModel);
            } else if (messageContent.message === TRANSACTION.PERFORM_ACTION_IN_TRANSFER_VALIDATION.WH_TRANSFER_CONFIRMATION_UNALLOCATED_UMID) {
              if (sourceModel.id === droptargetModel.id) {
                // can't move within same WH
                ui.item.sortable.cancel();
                return;
              }
              checkWHToWhUnallocatedUMIDValidation(sourceModel, droptargetModel);
            } else {
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              DialogFactory.messageAlertDialog(model);
              ui.item.sortable.cancel();
            }
            return;
          }

          const stockDetail = {
            transferType: vm.filter.transferOption
          };

          const objConfirmation = {
            messageContent: null,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT,
            multiple: true
          };

          if (sourceModel.transferSection === vm.transferSection.WH && droptargetModel.transferSection === vm.transferSection.WH) {
            if (sourceModel.id === droptargetModel.id) {
              // can't move within same WH
              ui.item.sortable.cancel();
              return;
            }
            stockDetail.fromWHID = sourceModel.id;
            if (vm.filter.transferOption === vm.TrasferStockType.StockTransfer) {
              stockDetail.transType = CORE.UMID_History.Trasaction_Type.WH_WH_Transfer;
              stockDetail.toWHID = droptargetModel.id;
              isTransferStock = true;

              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.WH_TO_WH_TRANSFER_CONFIRMATION_MSG);
              messageContent.message = stringFormat(messageContent.message, sourceModel.name, droptargetModel.name);
              objConfirmation.messageContent = messageContent;
            } else if (vm.filter.transferOption === CORE.TrasferStockType.DeptTransfer) {
              if (sourceModel.parentWHType === CORE.ParentWarehouseType.MaterialDepartment) {
                vm.cgBusyLoading = TransferStockFactory.getMismatchItemForKit().query({
                  refSalesOrderDetID: vm.selectedDetail.Kit['transferFrom'].refSalesOrderDetID,
                  assyId: vm.selectedDetail.Kit['transferFrom'].assyID,
                  parentWHType: sourceModel.parentWHType,
                  warehouseId: sourceModel.id
                }).$promise.then((res) => {
                  if (res.data && res.data.mismatchCount) {
                    stockDetail.transType = CORE.UMID_History.Trasaction_Type.WH_WH_Transfer;
                    stockDetail.toWHID = droptargetModel.id;
                    vm.kitReleaseMismatchDetail(sourceModel, droptargetModel, objConfirmation, stockDetail);
                  } else {
                    if (sourceModel.otherKitName) {
                      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.WH_TO_MATERIAL_DEPT_TRANSFER_WITH_OTHER_KIT_CONFIRMATION_MSG);
                      messageContent.message = stringFormat(messageContent.message, sourceModel.name, droptargetModel.name, sourceModel.otherKitName);
                      objConfirmation.messageContent = messageContent;
                    } else {
                      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.WH_TO_WH_TRANSFER_CONFIRMATION_MSG);
                      messageContent.message = stringFormat(messageContent.message, sourceModel.name, droptargetModel.name);
                      objConfirmation.messageContent = messageContent;
                    }
                    vm.transferStockConfirmation(objConfirmation, stockDetail);
                  }
                }).catch((error) => BaseService.getErrorLog(error));
              } else {
                if (sourceModel.otherKitName) {
                  isTransferStock = true;
                  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.WH_TO_MATERIAL_DEPT_TRANSFER_WITH_OTHER_KIT_CONFIRMATION_MSG);
                  messageContent.message = stringFormat(messageContent.message, sourceModel.name, droptargetModel.name, sourceModel.otherKitName);
                  objConfirmation.messageContent = messageContent;
                } else {
                  isTransferStock = true;
                  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.WH_TO_WH_TRANSFER_CONFIRMATION_MSG);
                  messageContent.message = stringFormat(messageContent.message, sourceModel.name, droptargetModel.name);
                  objConfirmation.messageContent = messageContent;
                }
              }
            } else {
              if (droptargetModel.id) {
                stockDetail.transType = CORE.UMID_History.Trasaction_Type.WH_WH_Transfer;
                stockDetail.toWHID = droptargetModel.id;
              } else {
                stockDetail.transType = CORE.UMID_History.Trasaction_Type.WH_Dept_Transfer;
                stockDetail.toParentWH = droptargetModel.parentWHID;
              }
              isTransferStock = true;
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.WH_TO_DEPT_TRANSFER_CONFIRMATION_MSG);
              messageContent.message = stringFormat(messageContent.message, sourceModel.name, droptargetModel.name);
              objConfirmation.messageContent = messageContent;
            }
          } else if (sourceModel.transferSection === vm.transferSection.Bin && droptargetModel.transferSection === vm.transferSection.WH) {
            if (sourceModel.warehouseID === droptargetModel.id) {
              // can't move within same WH
              ui.item.sortable.cancel();
              return;
            }
            stockDetail.transType = CORE.UMID_History.Trasaction_Type.Bin_WH_Transfer;
            stockDetail.fromBinID = sourceModel.id;
            stockDetail.toWHID = droptargetModel.id;

            if (vm.filter.transferOption === vm.TrasferStockType.DeptTransfer) {
              if (sourceModel.parentWHType === CORE.ParentWarehouseType.MaterialDepartment) {
                vm.cgBusyLoading = TransferStockFactory.getMismatchItemForKit().query({
                  refSalesOrderDetID: vm.selectedDetail.Kit['transferFrom'].refSalesOrderDetID,
                  assyId: vm.selectedDetail.Kit['transferFrom'].assyID,
                  parentWHType: sourceModel.parentWHType,
                  warehouseId: sourceModel.warehouseID,
                  binId: sourceModel.id
                }).$promise.then((res) => {
                  if (res.data && res.data.mismatchCount) {
                    vm.kitReleaseMismatchDetail(sourceModel, droptargetModel, objConfirmation, stockDetail);
                  } else {
                    if (sourceModel.otherKitName) {
                      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.BIN_TO_WH_TRANSFER_WITH_OTHER_KIT_CONFIRMATION_MSG);
                      messageContent.message = stringFormat(messageContent.message, sourceModel.name, droptargetModel.name, sourceModel.otherKitName);
                      objConfirmation.messageContent = messageContent;
                    } else {
                      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.BIN_TO_WH_TRANSFER_CONFIRMATION_MSG);
                      messageContent.message = stringFormat(messageContent.message, sourceModel.name, droptargetModel.name);
                      objConfirmation.messageContent = messageContent;
                    }
                    vm.transferStockConfirmation(objConfirmation, stockDetail);
                  }
                }).catch((error) => BaseService.getErrorLog(error));
              } else {
                isTransferStock = true;
                if (sourceModel.otherKitName) {
                  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.BIN_TO_WH_TRANSFER_WITH_OTHER_KIT_CONFIRMATION_MSG);
                  messageContent.message = stringFormat(messageContent.message, sourceModel.name, droptargetModel.name, sourceModel.otherKitName);
                  objConfirmation.messageContent = messageContent;
                } else {
                  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.BIN_TO_WH_TRANSFER_CONFIRMATION_MSG);
                  messageContent.message = stringFormat(messageContent.message, sourceModel.name, droptargetModel.name);
                  objConfirmation.messageContent = messageContent;
                }
              }
            } else {
              isTransferStock = true;
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.BIN_TO_WH_TRANSFER_CONFIRMATION_MSG);
              messageContent.message = stringFormat(messageContent.message, sourceModel.name, droptargetModel.name);
              objConfirmation.messageContent = messageContent;
            }
          } else if (sourceModel.transferSection === vm.transferSection.Bin && droptargetModel.transferSection === vm.transferSection.Bin) {
            if (sourceModel.id === droptargetModel.id) {
              // can't move within same Bin
              ui.item.sortable.cancel();
              return;
            } else if (droptargetModel.isCluster) {
              // can't move within same Bin
              ui.item.sortable.cancel();
              return;
            }
            stockDetail.transType = CORE.UMID_History.Trasaction_Type.Bin_Bin_Transfer;
            stockDetail.fromBinID = sourceModel.id;
            stockDetail.toBinID = droptargetModel.id;
            isTransferStock = true;

            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.BIN_TO_BIN_TRANSFER_CONFIRMATION_MSG);
            messageContent.message = stringFormat(messageContent.message, sourceModel.name, droptargetModel.name);
            objConfirmation.messageContent = messageContent;
          } else if (sourceModel.transferSection === vm.transferSection.UID && droptargetModel.transferSection === vm.transferSection.Bin) {
            if (sourceModel.binID === droptargetModel.id) {
              // can't move within same Bin
              ui.item.sortable.cancel();
              return;
            } else if (droptargetModel.isCluster) {
              // can't move within same Bin
              ui.item.sortable.cancel();
              return;
            }
            stockDetail.transType = CORE.UMID_History.Trasaction_Type.UMID_Bin_Transfer;
            stockDetail.uidID = sourceModel.id;
            stockDetail.toBinID = droptargetModel.id;
            isTransferStock = true;

            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.UID_TO_BIN_TRANSFER_CONFIRMATION_MSG);
            messageContent.message = stringFormat(messageContent.message, sourceModel.uid, droptargetModel.name);
            objConfirmation.messageContent = messageContent;
          } else if (sourceModel.transferSection === vm.transferSection.Kit && droptargetModel.transferSection === vm.transferSection.Dept) {
            stockDetail.transType = CORE.UMID_History.Trasaction_Type.KitTransfer;
            stockDetail.refSalesOrderDetID = sourceModel.refSalesOrderDetID;
            stockDetail.assyID = sourceModel.assyID;
            stockDetail.fromParentWH = sourceModel.deptID;
            stockDetail.toParentWH = droptargetModel.deptID;
            stockDetail.toParentWHName = droptargetModel.name;
            if (droptargetModel.transferSection === vm.transferSection.Dept) {
              stockDetail.isKitSelected = true;
            }

            if (vm.selectedDetail.Dept.transferFrom.parentWHType === CORE.ParentWarehouseType.MaterialDepartment && droptargetModel.type === CORE.ParentWarehouseType.ProductionDepartment) {
              if (sourceModel.totalKitPlan > 0) {
                vm.kitReleaseMismatchDetail(sourceModel, droptargetModel, objConfirmation, stockDetail);
              } else {
                vm.kitRelease(sourceModel);
              }
            } else if (vm.selectedDetail.Dept.transferFrom.parentWHType === CORE.ParentWarehouseType.MaterialDepartment && droptargetModel.type === CORE.ParentWarehouseType.MaterialDepartment) {
              vm.cgBusyLoading = TransferStockFactory.getMismatchItemForKit().query({
                refSalesOrderDetID: vm.selectedDetail.Kit['transferFrom'].refSalesOrderDetID,
                assyId: vm.selectedDetail.Kit['transferFrom'].assyID,
                parentWHType: vm.selectedDetail.Dept.transferFrom.parentWHType
              }).$promise.then((res) => {
                if (res.data && res.data.mismatchCount) {
                  stockDetail.isOnlyKitTransfer = true;
                  vm.kitReleaseMismatchDetail(sourceModel, droptargetModel, objConfirmation, stockDetail);
                } else {
                  if (sourceModel.otherKitName) {
                    const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.TRANSFER_KIT_WITH_ALLOCATED_KIT_CONFIRMATION);
                    messageContent.message = stringFormat(messageContent.message, sourceModel.name, sourceModel.deptName, droptargetModel.name, sourceModel.otherKitName);
                    objConfirmation.messageContent = messageContent;
                  } else {
                    const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.KIT_TO_DEPT_TRANSFER_CONFIRMATION_MSG);
                    messageContent.message = stringFormat(messageContent.message, sourceModel.name, stockDetail.toParentWHName);
                    objConfirmation.messageContent = messageContent;
                  }
                  vm.transferStockConfirmation(objConfirmation, stockDetail);
                }
              }).catch((error) => BaseService.getErrorLog(error));
            } else if (vm.selectedDetail.Dept.transferFrom.parentWHType === CORE.ParentWarehouseType.ProductionDepartment && (droptargetModel.type === CORE.ParentWarehouseType.MaterialDepartment || (droptargetModel.type === CORE.ParentWarehouseType.ProductionDepartment && vm.autoCompleteFromDept.keyColumnId !== vm.autoCompleteToDept.keyColumnId))) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.DEPT_TRANSFER_CONFIRMATION_MSG);
              messageContent.message = stringFormat(messageContent.message, sourceModel.name, droptargetModel.name);
              objConfirmation.messageContent = messageContent;

              validateAndTransferKit(sourceModel, droptargetModel, stockDetail, objConfirmation);
            }
          } else if (sourceModel.transferSection === vm.transferSection.WH && droptargetModel.transferSection === vm.transferSection.Dept) {
            stockDetail.transType = CORE.UMID_History.Trasaction_Type.WH_Dept_Transfer;
            stockDetail.fromWHID = sourceModel.id;
            stockDetail.fromParentWH = sourceModel.parentWHID;
            stockDetail.toParentWH = droptargetModel.deptID;
            stockDetail.toParentWHName = droptargetModel.name;

            if (sourceModel.parentWHType === CORE.ParentWarehouseType.MaterialDepartment) {
              vm.cgBusyLoading = TransferStockFactory.getMismatchItemForKit().query({
                refSalesOrderDetID: vm.selectedDetail.Kit['transferFrom'].refSalesOrderDetID,
                assyId: vm.selectedDetail.Kit['transferFrom'].assyID,
                parentWHType: sourceModel.parentWHType,
                warehouseId: sourceModel.id
              }).$promise.then((res) => {
                if (res.data && res.data.mismatchCount) {
                  vm.kitReleaseMismatchDetail(sourceModel, droptargetModel, objConfirmation, stockDetail);
                } else {
                  if (sourceModel.otherKitName) {
                    const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.TRANSFER_WH_WITH_ALLOCATED_KIT_CONFIRMATION);
                    messageContent.message = stringFormat(messageContent.message, sourceModel.name, sourceModel.deptName, droptargetModel.name, sourceModel.otherKitName);
                    objConfirmation.messageContent = messageContent;
                  } else {
                    const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.WH_TO_DEPT_TRANSFER_CONFIRMATION_MSG);
                    messageContent.message = stringFormat(messageContent.message, sourceModel.name, stockDetail.toParentWHName);
                    objConfirmation.messageContent = messageContent;
                  }
                  vm.transferStockConfirmation(objConfirmation, stockDetail);
                }
              }).catch((error) => BaseService.getErrorLog(error));
            } else if (sourceModel.parentWHType === CORE.ParentWarehouseType.ProductionDepartment) {
              if (sourceModel.otherKitName) {
                isTransferStock = true;
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.TRANSFER_WH_WITH_ALLOCATED_KIT_CONFIRMATION);
                messageContent.message = stringFormat(messageContent.message, sourceModel.name, sourceModel.deptName, droptargetModel.name, sourceModel.otherKitName);
                objConfirmation.messageContent = messageContent;
              } else {
                isTransferStock = true;
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.WH_TO_DEPT_TRANSFER_CONFIRMATION_MSG);
                messageContent.message = stringFormat(messageContent.message, sourceModel.name, stockDetail.toParentWHName);
                objConfirmation.messageContent = messageContent;
              }
            }
          }

          if (isTransferStock) {
            vm.transferStockConfirmation(objConfirmation, stockDetail);
          }
        }
        ui.item.sortable.cancel();
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
      vm.selectWarehouseToTransferEmptyBin({
        emptyBinWHList: emptyBinWHList,
        stockDetail: stockDetail,
        sourceModelName: sourceModelName,
        deptTransferToName: deptTransferToName
      });
    };

    vm.selectWarehouseToTransferEmptyBin = (transferDetail) => {
      transferDetail.transferFromDept = vm.selectedDetail.Dept.transferFrom;
      DialogFactory.dialogService(
        CORE.TRANSFER_EMPTY_BIN_MODAL_CONTROLLER,
        CORE.TRANSFER_EMPTY_BIN_MODAL_VIEW,
        event,
        transferDetail).then((response) => {
          if (response) {
            if (response.action === 'Continue') {
              vm.transferStock(transferDetail.stockDetail);
            }
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    /**
     * Take confirmation before transfer stock if parameter(_transferStockConfirmationRequired) set in config file true else go for transfer material directly
     * @param {any} objConfirmation confirmation message detail
     * @param {any} stockDetail transfer material detail
     */
    vm.transferStockConfirmation = (objConfirmation, stockDetail) => {
      if (_transferStockConfirmationRequired) {
        DialogFactory.messageConfirmDialog(objConfirmation).then((yes) => {
          if (yes) {
            DialogFactory.closeDialogPopup();
            vm.transferStock(stockDetail);
          }
        }, () => { }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.transferStock(stockDetail);
      }
    };

    /**
     * To make warehouse section active when select and get bin detail based on it
     * @param {any} whItem selected warehouse detail
     * @param {any} transferLabel label to indicate selected item is from which section (From/To)
     */
    vm.selectDropableWarehouse = (whItem, transferLabel) => {
      if (whItem) {
        vm.selectedDetail.WH[transferLabel] = whItem;
        const selectedKit = vm.selectedDetail.Kit[transferLabel];
        _.each(vm.warehouseList[transferLabel], (item) => {
          item.isSelected = (item.id === whItem.id);
        });
        // whItem.isSelected = true;
        vm.binFilter[transferLabel].warehouseID = whItem.id;
        vm.binFilter[transferLabel].refSalesOrderDetID = selectedKit ? selectedKit.refSalesOrderDetID : null;
        vm.binFilter[transferLabel].assyID = selectedKit ? selectedKit.assyID : null;
        vm.binFilter[transferLabel].deptID = null;

        vm.uidFilter[transferLabel].refSalesOrderDetID = selectedKit ? selectedKit.refSalesOrderDetID : null;
        vm.uidFilter[transferLabel].assyID = selectedKit ? selectedKit.assyID : null;
        vm.uidFilter[transferLabel].clusterWHID = whItem.id;
        vm.resetInfiniteScrollBin(transferLabel);
        vm.getActiveBin(transferLabel);
      }
    };

    /**
     * To make kit section active when select and get bin detail based on it
     * @param {any} kitItem selected kit detail
     * @param {any} transferLabel label to indicate selected item is from which section (From/To)
     */
    vm.selectDropableKit = (kitItem, transferLabel) => {
      if (kitItem) {
        vm.selectedDetail.Kit[transferLabel] = kitItem;
        _.each(vm.kitList[transferLabel], (item) => {
          item.isSelected = (item.refSalesOrderDetID === kitItem.refSalesOrderDetID && item.assyID === kitItem.assyID);
        });

        vm.warehouseFilter[transferLabel].refSalesOrderDetID = kitItem.refSalesOrderDetID;
        vm.warehouseFilter[transferLabel].assyID = kitItem.assyID;
        vm.warehouseFilter[transferLabel].deptID = vm.kitFilter[transferLabel].deptID;
        // vm.warehouseFilter[transferLabel].searchWHId = null;

        vm.binFilter[transferLabel].warehouseID = null;
        vm.binFilter[transferLabel].refSalesOrderDetID = kitItem.refSalesOrderDetID;
        vm.binFilter[transferLabel].assyID = kitItem.assyID;
        vm.binFilter[transferLabel].deptID = vm.kitFilter[transferLabel].deptID;
        // vm.binFilter[transferLabel].searchBinId = null;

        vm.uidFilter[transferLabel].refSalesOrderDetID = kitItem.refSalesOrderDetID;
        vm.uidFilter[transferLabel].assyID = kitItem.assyID;

        if (transferLabel === 'transferFrom') {
          vm.salesOrderDetail = {
            SubAssy: kitItem.assySubName,
            SalesOrderDetailId: kitItem.refSalesOrderDetID,
            partId: kitItem.assyMainId,
            soId: kitItem.soId,
            poNumber: kitItem.poNumber,
            soNumber: kitItem.salesOrderNumber,
            assyName: kitItem.assyName,
            rohsIcon: kitItem.rohsIcon,
            rohs: kitItem.rohs,
            poQty: kitItem.poQty,
            kitQty: kitItem.kitQty,
            assyPIDCode: kitItem.assyPIDCode,
            SubAssyPIDCode: kitItem.assySubPIDCode,
            assyId: kitItem.assyID
          };
        }
        vm.resetInfiniteScrollWarehouse(transferLabel);
        vm.getActiveWarehouse(transferLabel);
      }
    };

    /**
     * To make bin section active when select and get UMID detail based on it
     * @param {any} binItem selected bin detail
     * @param {any} transferLabel label to indicate selected item is from which section (From/To)
     */
    vm.selectDropableBin = (binItem, transferLabel) => {
      if (binItem) {
        vm.selectedDetail.Bin[transferLabel] = binItem;
        _.each(vm.binList[transferLabel], (item) => {
          item.isSelected = (item.id === binItem.id);
        });
        // binItem.isSelected = true;
        vm.uidFilter[transferLabel].binID = binItem.id;

        vm.uidFilter[transferLabel].clusterWHID = binItem.isCluster ? binItem.warehouseID : null;
        vm.resetInfiniteScrollUMID(transferLabel);
        vm.getUIDDetail(transferLabel);
      }
    };

    /*
     * Get department list and initialize auto-complete
     */

    /** Bind auto-complete for parent warehouse */
    const initAutoComplete = () => {
      vm.autoCompleteFromDept = {
        columnName: 'Name',
        keyColumnName: 'ID',
        keyColumnId: vm.transferDeptDetail ? (vm.transferDeptDetail.fromDeptID ? vm.transferDeptDetail.fromDeptID : null) : null,
        inputName: 'fromDept',
        placeholderName: 'Parent Warehouse',
        isRequired: true,
        isAddnew: false,
        callbackFn: getFromDeptList,
        onSelectCallbackFn: (item) => {
          vm.selectedDetail.Dept.transferFrom = item;
          setDefaultValueOfKitFilterCheckBox();
          if (item) {
            vm.warehouseFilter.transferFrom.deptID = item.ID;
            vm.kitFilter.transferFrom.deptID = item.ID;
            if (vm.filter.transferOption === vm.TrasferStockType.StockTransfer || vm.filter.transferOption === vm.TrasferStockType.StockTransferToOtherDept) {
              vm.resetInfiniteScrollWarehouse('transferFrom');
              vm.getActiveWarehouse('transferFrom');
            } else if (vm.filter.transferOption === vm.TrasferStockType.KitTransfer || vm.filter.transferOption === vm.TrasferStockType.DeptTransfer) {
              vm.resetInfiniteScrollKit('transferFrom');
              vm.getKitToTransferStock('transferFrom');
            }
            vm.transferDeptDetail.fromDeptID = item.ID;
            localStorage.setItem('transferDeptDetail', JSON.stringify(vm.transferDeptDetail));
          } else {
            vm.selectedDetail.WH.transferFrom = null;
            vm.selectedDetail.Bin.transferFrom = null;
            vm.selectedDetail.Kit.transferFrom = null;
            vm.warehouseList.transferFrom = [];
            vm.kitList.transferFrom = [];
            vm.binList.transferFrom = [];
            vm.componentList.transferFrom = [];
            vm.warehouseFilter.transferFrom.deptID = null;
            vm.kitFilter.transferFrom.deptID = null;
            vm.transferDeptDetail.fromDeptID = null;
          }
        }
      };

      vm.autoCompleteToDept = {
        columnName: 'Name',
        keyColumnName: 'ID',
        keyColumnId: vm.transferDeptDetail ? (vm.transferDeptDetail.toDeptID ? vm.transferDeptDetail.toDeptID : null) : null,
        inputName: 'toDept',
        placeholderName: 'Parent Warehouse',
        isRequired: true,
        isAddnew: false,
        callbackFn: getToDeptList,
        onSelectCallbackFn: (item) => {
          vm.selectedDetail.Dept.transferTo = item;
          setDefaultValueOfKitFilterCheckBox();
          if (item) {
            vm.emptyDropContent.kit.deptID = item.ID;
            vm.emptyDropContent.kit.name = vm.selectedDetail.Dept.transferTo.Name;
            vm.emptyDropContent.kit.type = item.parentWHType;
            vm.emptyDropContent.WH.parentWHID = item.ID;
            vm.emptyDropContent.WH.name = vm.selectedDetail.Dept.transferTo.Name;
            vm.emptyDropContent.WH.type = item.parentWHType;
            vm.warehouseFilter.transferTo.deptID = item.ID;
            vm.kitFilter.transferTo.deptID = item.ID;

            if (vm.filter.transferOption === vm.TrasferStockType.StockTransfer || vm.filter.transferOption === vm.TrasferStockType.StockTransferToOtherDept) {
              vm.resetInfiniteScrollWarehouse('transferTo');
              vm.getActiveWarehouse('transferTo');
            } else if (vm.filter.transferOption === vm.TrasferStockType.KitTransfer || vm.filter.transferOption === vm.TrasferStockType.DeptTransfer) {
              vm.resetInfiniteScrollKit('transferTo');
              vm.getKitToTransferStock('transferTo');
            }
            vm.transferDeptDetail.toDeptID = item.ID;
            localStorage.setItem('transferDeptDetail', JSON.stringify(vm.transferDeptDetail));
          } else {
            vm.emptyDropContent.kit.deptID = null;
            vm.emptyDropContent.kit.name = null;
            vm.emptyDropContent.kit.type = null;
            vm.emptyDropContent.WH.parentWHID = null;
            vm.emptyDropContent.WH.name = null;
            vm.emptyDropContent.WH.type = null;
            vm.selectedDetail.WH.transferTo = null;
            vm.selectedDetail.Bin.transferTo = null;
            vm.selectedDetail.Kit.transferTo = null;
            vm.warehouseList.transferTo = [];
            vm.kitList.transferTo = [];
            vm.binList.transferTo = [];
            vm.componentList.transferTo = [];
            vm.warehouseFilter.transferTo.deptID = null;
            vm.kitFilter.transferTo.deptID = null;
            vm.transferDeptDetail.toDeptID = null;
          }
        }
      };
    };

    /** Get list of parent warehouse for 'Transfer From' section */
    const getFromDeptList = () => {
      vm.fromDeptList = [];
      return BinFactory.getAllWarehouse({
        isDepartment: true
      }).query().$promise.then((whlist) => {
        vm.fromDeptList = whlist.data;
        vm.materialDeptList = _.filter(whlist.data, (data) => data.parentWHType === CORE.ParentWarehouseType.MaterialDepartment);
        vm.productionDeptList = _.filter(whlist.data, (data) => data.parentWHType === CORE.ParentWarehouseType.ProductionDepartment);
        return $q.resolve(vm.fromDeptList);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /** Get list of parent warehouse for 'Transfer To' section */
    const getToDeptList = () => {
      vm.toDeptList = [];
      return BinFactory.getAllWarehouse({
        isDepartment: true
      }).query().$promise.then((whlist) => {
        vm.toDeptList = whlist.data;
        return $q.resolve(vm.toDeptList);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const active = () => {
      var autocompletePromise = [getFromDeptList(), getToDeptList()];
      vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
        vm.transferDeptDetail = {};

        if (vm.paramWHId && vm.paramWHId !== 0) {
          const transferDeptDetail = {
            fromDeptID: vm.materialDeptList && vm.materialDeptList.length > 0 ? vm.materialDeptList[0].ID : null,
            toDeptID: vm.productionDeptList && vm.productionDeptList.length > 0 ? vm.materialDeptList[0].ID : null,
            transferOption: CORE.TrasferStockType.StockTransfer
          };
          localStorage.setItem('transferDeptDetail', JSON.stringify(transferDeptDetail));
        }

        if ((vm.paramSalesOrderDetailId && vm.paramSalesOrderDetailId !== 0) && (vm.paramAssyId && vm.paramAssyId !== 0)) {
          const transferDeptDetail = {
            fromDeptID: vm.materialDeptList && vm.materialDeptList.length > 0 ? vm.materialDeptList[0].ID : null,
            toDeptID: vm.productionDeptList && vm.productionDeptList.length > 0 ? vm.productionDeptList[0].ID : null,
            transferOption: CORE.TrasferStockType.KitTransfer
          };
          localStorage.setItem('transferDeptDetail', JSON.stringify(transferDeptDetail));
        } else if (vm.paramSalesOrderDetailId && vm.paramSalesOrderDetailId !== 0) {
          const transferDeptDetail = {
            fromDeptID: vm.materialDeptList && vm.materialDeptList.length > 0 ? vm.materialDeptList[0].ID : null,
            toDeptID: vm.productionDeptList && vm.productionDeptList.length > 0 ? vm.productionDeptList[0].ID : null,
            transferOption: CORE.TrasferStockType.DeptTransfer
          };
          localStorage.setItem('transferDeptDetail', JSON.stringify(transferDeptDetail));
        }

        const transferDeptDetail = localStorage.getItem('transferDeptDetail');
        if (transferDeptDetail) {
          vm.transferDeptDetail = JSON.parse(transferDeptDetail);
        }

        if (vm.transferDeptDetail.transferOption) {
          vm.filter.transferOption = vm.transferDeptDetail.transferOption;
        }

        initAutoComplete();
      }).catch((error) => BaseService.getErrorLog(error));
    };

    active();

    /* Retrieve list of active warehouse to transfer stock */
    vm.getActiveWarehouse = (transferLabel, isInfiniteScroll) => {
      if (vm.warehouseFilter[transferLabel].deptID) {
        if (transferLabel === 'transferFrom' && (vm.paramWHId && vm.paramWHId !== 0)) {
          vm.warehouseFilter[transferLabel].paramSearchWHId = vm.warehouseFilter[transferLabel].paramSearchWHId ? vm.warehouseFilter[transferLabel].paramSearchWHId : vm.paramWHId;
        }
        vm.cgBusyLoading = TransferStockFactory.getActiveWarehouse().query(vm.warehouseFilter[transferLabel]).$promise.then((response) => {
          vm.warehouseFilter[transferLabel].recordCount = response.data && response.data.TotalWarehouse ? (isInfiniteScroll ? vm.warehouseFilter[transferLabel].recordCount : response.data.TotalWarehouse) : 0;
          const tempWarehouseList = _.map((response.data ? response.data.warehouseList : []), (obj) => {
            var objWH = {
              id: obj.id,
              name: obj.name,
              isPermanent: obj.isPermanentWH,
              parentWHID: obj.parentWHID,
              parentWHType: obj.parentWHType,
              warehouseType: obj.warehouseType,
              warehouseTypeValue: obj.warehouseTypeValue
            };
            const kitName = BaseService.generateRedirectLinkForKit(obj.kitName);
            var objCountDetail = angular.copy(objWH);
            objCountDetail = _.assign({}, objCountDetail, {
              deptName: obj.deptName,
              binCount: obj.binCount,
              uidCount: obj.uidCount,
              umidPendingParts: obj.umidPendingParts,
              totalEmptyBin: obj.totalEmptyBin,
              anotherKitStock: obj.anotherKitStock,
              unallocatekitStock: obj.unallocatekitStock,
              numberTotalKit: obj.numberTotalKit,
              unallocatedUMID: obj.unallocatedUMID,
              transferSection: vm.transferSection.WH,
              transferLabel: transferLabel,
              cartImage: obj.isPermanentWH ? vm.cartImages.permanent : (obj.uniqueCartID ? vm.cartImages.kit : vm.cartImages.movable),
              allMovableBin: obj.allMovableBin,
              otherKitName: kitName.length > 0 ? _.map(kitName).join(', ') : '',
              emptyBinName: obj.emptyBinName
            });
            objWH.countDetail = [objCountDetail];
            return objWH;
          });

          if (transferLabel === 'transferFrom' && (vm.paramWHId && vm.paramWHId !== 0)) {
            const getWarehouseDetail = _.find(tempWarehouseList, (data) => data.id === vm.paramWHId);
            if (getWarehouseDetail) {
              vm.scanAndSearch.SearchWarehouse = getWarehouseDetail.name;
            }
          }
          vm.warehouseList[transferLabel] = isInfiniteScroll ? vm.warehouseList[transferLabel].concat(tempWarehouseList) : tempWarehouseList;
          if (tempWarehouseList.length > 0) {
            let warehouseDetail;
            if (vm.selectedDetail.WH[transferLabel]) {
              warehouseDetail = _.find(vm.warehouseList[transferLabel], {
                id: vm.selectedDetail.WH[transferLabel].id
              });
            }
            warehouseDetail = warehouseDetail || _.first(vm.warehouseList[transferLabel]);
            vm.selectDropableWarehouse(warehouseDetail, transferLabel);
          } else {
            vm.selectedDetail.WH[transferLabel] = null;
            vm.selectedDetail.Bin[transferLabel] = null;
            vm.binList[transferLabel] = [];
            vm.componentList[transferLabel] = [];
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    /** Retrieve list of kit to transfer stock */
    vm.getKitToTransferStock = (transferLabel, isInfiniteScroll) => {
      if (transferLabel === 'transferFrom' && ((vm.paramSalesOrderDetailId && vm.paramSalesOrderDetailId !== 0) || (vm.paramAssyId && vm.paramAssyId !== 0))) {
        vm.kitFilter[transferLabel].globalSearchRefSalesOrderDetID = vm.kitFilter[transferLabel].globalSearchRefSalesOrderDetID ? vm.kitFilter[transferLabel].globalSearchRefSalesOrderDetID : vm.paramSalesOrderDetailId;
        vm.kitFilter[transferLabel].globalSearchAssyID = vm.kitFilter[transferLabel].globalSearchAssyID ? vm.kitFilter[transferLabel].globalSearchAssyID : vm.paramAssyId;
      }
      if (vm.kitFilter[transferLabel].deptID) {
        vm.cgBusyLoading = TransferStockFactory.getKitToTransferStock().query(vm.kitFilter[transferLabel]).$promise.then((response) => {
          vm.kitFilter[transferLabel].recordCount = response.data && response.data.TotalKit ? (isInfiniteScroll ? vm.kitFilter[transferLabel].recordCount : response.data.TotalKit) : 0;
          const tempKitList = _.map(response.data ? response.data.kitList : [], (obj) => {
            const kitName = BaseService.generateRedirectLinkForKit(obj.kitName);
            const nextReleasePlan = {
              id: obj.id,
              salesOrderDetID: obj.salesOrderDetID,
              refAssyId: obj.refAssyId,
              subAssyID: obj.subAssyID,
              plannKitNumber: obj.plannKitNumber,
              poQty: obj.poQty,
              poDueDate: obj.poDueDate,
              mfrLeadTime: obj.mfrLeadTime,
              materialDockDate: obj.materialDockDate,
              kitReleaseQty: obj.kitReleaseQty,
              kitReleaseDate: obj.kitReleaseDate,
              kitReleasedPassedDays: obj.kitReleasedPassedDays > 0 ? obj.kitReleasedPassedDays : 0,
              feasibilityWithAllocatedQty: obj.feasibilityWithAllocatedQty,
              actualKitReleaseDate: obj.actualKitReleaseDate,
              releasedBy: obj.releasedBy,
              releaseTimeFeasibility: obj.releaseTimeFeasibility,
              kitStatus: obj.kitStatus,
              rushJob: obj.rushJob,
              mismatchItem: obj.mismatchItem,
              woStatusID: obj.woStatusID,
              refPlanId: obj.refPlanId,
              releasedNote: obj.releasedNote,
              releaseKitNumber: obj.releaseKitNumber,
              kitReturnStatus: obj.kitReturnStatus,
              kitReturnDate: obj.kitReturnDate,
              kitReleaseIndicator: obj.kitReleaseIndicator,
              kitPlanPercentage: (obj.kitPlanPercentage || 0)
            };

            var objKit = {
              id: obj.assyID,
              refSalesOrderDetID: obj.refSalesOrderDetID,
              kitNumber: obj.kitNumber,
              assyID: obj.assyID,
              assyName: obj.assyName,
              assyPIDCode: obj.assyPIDCode,
              assyMainId: obj.assyMainId,
              assyMainName: obj.assyMainName,
              assyMainPIDCode: obj.assyMainPIDCode,
              assySubId: obj.assySubId !== obj.assyMainId ? obj.assySubId : null,
              assySubName: obj.assySubId !== obj.assyMainId ? obj.assySubName : null,
              assySubPIDCode: obj.assySubId !== obj.assyMainId ? obj.assySubPIDCode : null,
              name: obj.name,
              isPermanent: false,
              deptID: obj.deptID,
              deptType: obj.deptType,
              kitReleaseStatus: (obj.kitReleaseStatus || vm.Kit_Release_Status.NotReleased),
              // kitStatusPercentage: (obj.kitStatusPercentage || 0),
              totalLines: (obj.totalLines || 0),
              shortageLines: (obj.shortageLines || 0),
              isHotJob: obj.isHotJob,
              hotJobIcon: vm.cartImages.hotJob,
              alertIcon: vm.cartImages.alert,
              // associatedWorkorder: obj.associatedWorkorder,
              soId: obj.soId,
              poNumber: obj.poNumber,
              salesOrderNumber: obj.salesOrderNumber,
              poDate: obj.poDate,
              poQty: obj.qty,
              kitQty: obj.kitQty,
              totalAssyBuildQty: obj.totalAssyBuildQty,
              rohs: obj.rohs,
              rohsIcon: obj.rohsIcon,
              totalKitPlan: (obj.totalKitPlan || 0),
              totalKitReleasePlan: (obj.totalKitReleasePlan || 0),
              poHalt: obj.poHalt,
              kitHalt: obj.kitHalt,
              kitPercentage: (obj.kitPercentage || 0),
              kitBuildFeasibility: (obj.kitBuildFeasibility || 0),
              mismatchUMIDBin: obj.mismatchUMIDBin,
              transferSection: vm.transferSection.Kit,
              allocationUMIDCount: obj.allocationUMIDCount,
              woID: obj.woID,
              workorderNumber: obj.workorderNumber,
              otherKitName: kitName.length > 0 ? _.map(kitName).join(', ') : '',
              nextReleasePlan: nextReleasePlan,
              salesOrderDetailCompleteStatus: obj.salesOrderDetailCompleteStatus
            };
            var objCountDetail = angular.copy(objKit);
            objCountDetail = _.assign({}, objCountDetail, {
              deptName: obj.deptName,
              binCount: obj.binCount,
              uidCount: obj.uidCount,
              transferSection: vm.transferSection.Kit,
              transferLabel: transferLabel,
              cartImage: vm.cartImages.kit
            });
            objKit.countDetail = [objCountDetail];
            return objKit;
          });

          if (transferLabel === 'transferFrom' && (vm.paramSalesOrderDetailId && vm.paramSalesOrderDetailId !== 0) && (vm.paramAssyId && vm.paramAssyId !== 0)) {
            const getKitDetail = _.find(tempKitList, (data) => data.refSalesOrderDetID === vm.paramSalesOrderDetailId && data.assyID === vm.paramAssyId);
            if (getKitDetail) {
              $scope.$broadcast(vm.autoCompleteSearchKit.inputName, getKitDetail);
            }
          }
          vm.kitList[transferLabel] = isInfiniteScroll ? vm.kitList[transferLabel].concat(tempKitList) : tempKitList;
          if (tempKitList.length > 0) {
            let kitDetail;
            if (vm.selectedDetail.Kit[transferLabel]) {
              kitDetail = _.find(vm.kitList[transferLabel], {
                id: vm.selectedDetail.Kit[transferLabel].id
              });
            }
            kitDetail = kitDetail || _.first(vm.kitList[transferLabel]);
            vm.selectDropableKit(kitDetail, transferLabel);
          } else {
            vm.selectedDetail.Kit[transferLabel] = null;
            vm.selectedDetail.WH[transferLabel] = null;
            vm.selectedDetail.Bin[transferLabel] = null;
            vm.warehouseList[transferLabel] = [];
            vm.binList[transferLabel] = [];
            vm.componentList[transferLabel] = [];
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    /** Retrieve list of  active bin to transfer stock */
    vm.getActiveBin = (transferLabel, isInfiniteScroll) => {
      vm.cgBusyLoading = TransferStockFactory.getActiveBin().query(vm.binFilter[transferLabel]).$promise.then((response) => {
        if (response.data) {
          vm.binFilter[transferLabel].recordCount = response.data && response.data.TotalBin ? (isInfiniteScroll ? vm.binFilter[transferLabel].recordCount : response.data.TotalBin) : 0;
          const tempBinList = _.map(response.data.binList, (obj) => {
            var objBin = {
              id: obj.id,
              name: obj.name,
              isPermanent: obj.isPermanentBin,
              warehouseID: obj.warehouseID,
              warehouseName: obj.warehouseName,
              deptName: obj.deptName,
              isCluster: obj.isCluster,
              parentWHID: obj.departmentID,
              warehouseType: obj.warehouseType
            };
            const kitName = BaseService.generateRedirectLinkForKit(obj.kitName);
            var objCountDetail = angular.copy(objBin);
            objCountDetail = _.assign({}, objCountDetail, {
              PIDCount: obj.PIDCount,
              uidCount: obj.uidCount,
              umidPendingParts: obj.umidPendingParts,
              mismatchUMID: obj.mismatchUMID,
              mismatchPID: obj.mismatchPID,
              transferSection: vm.transferSection.Bin,
              transferLabel: transferLabel,
              cartImage: obj.isPermanentBin ? vm.cartImages.permanent : vm.cartImages.movable,
              otherKitName: kitName.length > 0 ? _.map(kitName).join(', ') : '',
              numberTotalKit: obj.numberTotalKit,
              unallocatedUMID: obj.unallocatedUMID
            });
            objBin.countDetail = [objCountDetail];
            return objBin;
          });
          vm.binList[transferLabel] = isInfiniteScroll ? vm.binList[transferLabel].concat(tempBinList) : tempBinList;
          if (tempBinList.length > 0) {
            let binDetail;
            if (vm.selectedDetail.Bin[transferLabel]) {
              binDetail = _.find(vm.binList[transferLabel], {
                id: vm.selectedDetail.Bin[transferLabel].id
              });
            }
            binDetail = binDetail || _.first(vm.binList[transferLabel]);
            vm.selectDropableBin(binDetail, transferLabel);
          } else {
            vm.selectedDetail.Bin[transferLabel] = null;
            vm.componentList[transferLabel] = [];
            vm.uidFilter[transferLabel].binID = 0;
          }
        }
        vm.binList[transferLabel] = vm.binList[transferLabel] || [];
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /** Retrieve list of part detail to transfer stock */
    vm.getUIDDetail = (transferLabel, isInfiniteScroll) => {
      if (transferLabel === 'transferFrom') {
        vm.transferUMIDList = [];
        vm.isBelongToKit = vm.isNotBelongToKit = vm.isBelongToAnyKit = false;
      }
      vm.cgBusyLoading = TransferStockFactory.getUIDDetail().query(vm.uidFilter[transferLabel]).$promise.then((response) => {
        if (response.data) {
          vm.uidFilter[transferLabel].recordCount = response.data && response.data.TotalComponent ? (isInfiniteScroll ? vm.uidFilter[transferLabel].recordCount : response.data.TotalComponent) : 0;
          vm.componentList[transferLabel] = isInfiniteScroll ? vm.componentList[transferLabel].concat(response.data.component) : response.data.component;
          vm.UMIDListWarehouseType = vm.componentList[transferLabel].length > 0 ? _.first(vm.componentList[transferLabel]).warehouseType : null;
          _.map(vm.componentList[transferLabel], (item) => {
            item.isSelect = false;
            item.transferSection = vm.transferSection.UID;
            item.transferLabel = transferLabel;
            item.isAllocatedToKit = item.isAllocatedToKit === 1 ? true : false;
          });
        }
        vm.componentList[transferLabel] = vm.componentList[transferLabel] || [];
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /** save transfer stock detail to db */
    vm.transferStock = (stockDetail) => {
      var deptOption = CORE.UMID_History.Trasaction_Type.WithinDept;
      if (vm.filter.transferOption === vm.TrasferStockType.StockTransferToOtherDept || vm.filter.transferOption === vm.TrasferStockType.DeptTransfer) {
        deptOption = CORE.UMID_History.Trasaction_Type.OtherDept;
      }

      let transferOption = CORE.UMID_History.Trasaction_Type.TransferStock;
      if (vm.filter.transferOption === vm.TrasferStockType.KitTransfer || vm.filter.transferOption === vm.TrasferStockType.DeptTransfer) {
        transferOption = CORE.UMID_History.Trasaction_Type.TransferKit;
      }

      stockDetail.actionPerformed = stringFormat('{0} ({1}: {2})', CORE.UMID_History.Action_Performed.TransferMaterial, transferOption, deptOption);
      // console.log(stockDetail.transType, stockDetail.actionPerformed);
      // console.log(stockDetail);
      // return;
      vm.cgBusyLoading = TransferStockFactory.managestock().query(stockDetail).$promise.then((res) => {
        if (res.data) {
          const transferDetail = _.first(res.data.transferDetail);
          vm.updateTransferredStockDetail(transferDetail);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /** Update UI as per transfer stock detail */
    vm.updateTransferredStockDetail = (transferDetail) => {
      if (transferDetail) {
        if (transferDetail.transferType === vm.TrasferStockType.StockTransfer || vm.filter.transferOption === vm.TrasferStockType.StockTransferToOtherDept) {
          if (transferDetail.fromWHID && !transferDetail.toWHID) {
            vm.refreshWH('transferTo', transferDetail.fromWHID, true);
            const whItemIndex = _.findIndex(vm.warehouseList['transferFrom'], {
              id: transferDetail.fromWHID
            });
            if (whItemIndex !== -1) {
              vm.warehouseList['transferFrom'].splice(whItemIndex, 1);
            }
          } else if ((transferDetail.fromWHID || transferDetail.fromBinID) && transferDetail.toWHID) {
            let fromWHID = transferDetail.fromWHID;
            if (transferDetail.fromBinID) {
              const fromBinItem = _.find(vm.binList.transferFrom, {
                id: transferDetail.fromBinID
              });
              fromWHID = fromBinItem.warehouseID;
            }

            vm.updateWHCount(fromWHID, 'transferFrom', transferDetail.fromWHBinCount, transferDetail.fromWHUIDCount, true);
            vm.updateWHCount(fromWHID, 'transferTo', transferDetail.fromWHBinCount, transferDetail.fromWHUIDCount, false);

            vm.updateWHCount(transferDetail.toWHID, 'transferTo', transferDetail.toWHBinCount, transferDetail.toWHUIDCount, true);
            vm.updateWHCount(transferDetail.toWHID, 'transferFrom', transferDetail.toWHBinCount, transferDetail.toWHUIDCount, false);
          } else if ((transferDetail.fromBinID || transferDetail.uidID) && transferDetail.toBinID) {
            let binID = transferDetail.fromBinID;
            if (transferDetail.uidID) {
              const component = _.find(vm.componentList.transferFrom, {
                id: transferDetail.uidID
              });
              binID = component ? component.binID : null;

              const fromBin = vm.selectedDetail.Bin.transferFrom;
              const toBinItem = _.find(vm.binList.transferTo, {
                id: transferDetail.toBinID
              });
              _.each([fromBin ? fromBin.warehouseID : 0, toBinItem ? toBinItem.warehouseID : 0], (whID) => {
                if (whID) {
                  _.each(['transferFrom', 'transferTo'], (transferLabel) => {
                    vm.refreshWH(transferLabel, whID, (whID === fromBin.warehouseID && transferLabel === 'transferFrom'));
                  });
                }
              });
            }
            vm.updateBinCount(binID, 'transferFrom', transferDetail.fromBinUIDCount, transferDetail.fromWHBinCount, transferDetail.fromWHUIDCount, transferDetail.fromBinPIDCount, true);
            vm.updateBinCount(binID, 'transferTo', transferDetail.fromBinUIDCount, transferDetail.fromWHBinCount, transferDetail.fromWHUIDCount, transferDetail.fromBinPIDCount, false);

            vm.updateBinCount(transferDetail.toBinID, 'transferTo', transferDetail.toBinUIDCount, transferDetail.toWHBinCount, transferDetail.toWHUIDCount, transferDetail.toBinPIDCount, true);
            vm.updateBinCount(transferDetail.toBinID, 'transferFrom', transferDetail.toBinUIDCount, transferDetail.toWHBinCount, transferDetail.toWHUIDCount, transferDetail.toBinPIDCount, false);
          }
        } else if (transferDetail.transferType === vm.TrasferStockType.KitTransfer || transferDetail.transferType === vm.TrasferStockType.DeptTransfer) {
          vm.refreshKit(transferDetail.assyID, transferDetail.refSalesOrderDetID);

          if (vm.otherKitTransferDet && vm.otherKitTransferDet.length > 0) {
            _.each(vm.otherKitTransferDet, (item) => {
              vm.refreshKit(item.assyID, item.refSalesOrderDetID);
            });
          }
        }
      }
    };

    /**
     * Copy PID code
     * @param {any} item
     */
    vm.copyRightPidText = (item) => {
      var copytext = item;
      var $temp = $('<input>');
      $('body').append($temp);
      $temp.val(copytext).select();
      document.execCommand('copy');
      $temp.remove();
      vm.showPidRightstatus = true;
    };

    /*
     * Remove right PID Code copied status on hover
     * */
    vm.pIdRightStatus = () => {
      vm.showPidRightstatus = false;
    };

    /**
     * Update count of bin section while transfer stock from Bin to Bin or UID to bin
     * @param {any} binId
     * @param {any} transferLabel
     * @param {any} uidCount
     * @param {any} whBinCount
     * @param {any} whUIDCount
     * @param {any} isSelect
     */
    vm.updateBinCount = (binId, transferLabel, uidCount, whBinCount, whUIDCount, pidCount, isSelect) => {
      var binItem = _.find(vm.binList[transferLabel], { id: binId });
      if (binItem) {
        if (binItem.countDetail.length > 0) {
          binItem.countDetail[0].uidCount = uidCount;
          binItem.countDetail[0].PIDCount = pidCount;
        }

        vm.updateWHCount(binItem.warehouseID, transferLabel, whBinCount, whUIDCount, false);

        if (isSelect) {
          vm.selectDropableBin(binItem, transferLabel);
        }
      }
    };

    /**
     * Update count of warehouse section while transfer stock from WH to WH, Bin to Bin or UID to bin
     * @param {any} whId
     * @param {any} transferLabel
     * @param {any} binCount
     * @param {any} uidCount
     * @param {any} isSelect
     */
    vm.updateWHCount = (whId, transferLabel, binCount, uidCount, isSelect) => {
      var whItem = _.find(vm.warehouseList[transferLabel], { id: whId });
      if (whItem) {
        if (whItem.countDetail.length > 0) {
          whItem.countDetail[0].binCount = binCount;
          whItem.countDetail[0].uidCount = uidCount;
        }

        if (isSelect) {
          vm.selectDropableWarehouse(whItem, transferLabel);
        }
      }
    };

    /* Global warehouse filter for 'From' transfer stock */
    vm.scanGlobalSearchWarehouse = ($event) => {
      $timeout(() => {
        if ($event.keyCode === 13) {
          vm.searchWarehouse('SearchWarehouse', 'globalSearchWHString', 'transferFrom');
        }
      });
    };

    /* Individual section warehouse filter for 'From' transfer stock */
    vm.scanInternalFromSearchWarehouse = ($event) => {
      $timeout(() => {
        if ($event.keyCode === 13) {
          vm.searchWarehouse('InternalFromWHSearch', 'searchWHId', 'transferFrom');
        }
      });
    };

    /* Individual section warehouse filter for 'To' transfer stock */
    vm.scanInternalToSearchWarehouse = ($event) => {
      $timeout(() => {
        if ($event.keyCode === 13) {
          vm.searchWarehouse('InternalToWHSearch', 'searchWHId', 'transferTo');
        }
      });
    };

    vm.searchWarehouse = (searchColumnName, searchValueKey, transferLabel) => {
      if (vm.scanAndSearch[searchColumnName]) {
        vm.resetInfiniteScroll(transferLabel);
        vm.warehouseFilter[transferLabel][searchValueKey] = vm.scanAndSearch[searchColumnName];
        vm.warehouseFilter[transferLabel].paramSearchWHId = null;
        if (transferLabel === 'transferFrom') {
          vm.searchFromTransferStock();
        }
        else if (transferLabel === 'transferTo') {
          vm.getActiveWarehouse('transferTo');
        }

        //WarehouseBinFactory.getWarehouseDetailByName().query({ name: vm.scanAndSearch[searchColumnName] }).$promise.then((response) => {
        //  if (response && response.data) {
        //    //For global search 'globalSearchWHId'
        //    //For internal 'From/To' search 'searchWHId'
        //    vm.warehouseFilter[transferLabel][searchValueKey] = response.data.id;
        //    if (transferLabel == 'transferFrom') {
        //      vm.searchFromTransferStock();
        //    }
        //    else if (transferLabel == 'transferTo') {
        //      vm.getActiveWarehouse('transferTo');
        //    }
        //  }
        //  else {
        //    let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SCAN_VALID_WAREHOUSE);
        //    let model = {
        //      messageContent: messageContent,
        //      multiple: true
        //    };
        //    DialogFactory.messageAlertDialog(model).then((yes) => {
        //      if (yes) {
        //        vm.scanAndSearch[searchColumnName] = null;
        //        setFocus(searchColumnName);
        //      }
        //    }).catch((error) => {
        //      return BaseService.getErrorLog(error);
        //    });
        //  }
        //}).catch((error) => {
        //});
      } else {
        vm.resetWHSearch(transferLabel, searchColumnName);
      }
    };

    /* Global bin filter for 'From' transfer stock */
    vm.scanGlobalSearchBin = ($event) => {
      $timeout(() => {
        if ($event.keyCode === 13) {
          vm.searchBin('SearchBin', 'globalSearchBinString', 'transferFrom');
        }
      });
    };

    /* Individual section bin filter for 'From' transfer stock */
    vm.scanInternalFromSearchBin = ($event) => {
      $timeout(() => {
        if ($event.keyCode === 13) {
          vm.searchBin('InternalFromSearchBin', 'searchBinId', 'transferFrom');
        }
      });
    };

    /* Individual section bin filter for 'To' transfer stock */
    vm.scanInternalToSearchBin = ($event) => {
      $timeout(() => {
        if ($event.keyCode === 13) {
          vm.searchBin('InternalToSearchBin', 'searchBinId', 'transferTo');
        }
      });
    };

    vm.searchBin = (searchColumnName, searchValueKey, transferLabel) => {
      if (vm.scanAndSearch[searchColumnName]) {
        vm.resetInfiniteScroll(transferLabel);
        vm.binFilter[transferLabel][searchValueKey] = vm.scanAndSearch[searchColumnName];

        if (searchValueKey === 'globalSearchBinString') {
          vm.warehouseFilter.transferFrom.globalSearchBinString = vm.scanAndSearch[searchColumnName];
          if (vm.filter.transferOption === vm.TrasferStockType.KitTransfer || vm.filter.transferOption === vm.TrasferStockType.DeptTransfer) {
            vm.kitFilter.transferFrom.globalSearchBinString = vm.scanAndSearch[searchColumnName];
          }
        }

        if (transferLabel === 'transferFrom') {
          if (searchValueKey === 'globalSearchBinString') {
            vm.searchFromTransferStock();
          }
          else {
            vm.getActiveBin('transferFrom');
          }
        }
        else if (transferLabel === 'transferTo') {
          vm.getActiveBin('transferTo');
        }

        //BinFactory.getBinDetailByName().query({ name: vm.scanAndSearch[searchColumnName] }).$promise.then((response) => {
        //  if (response && response.data) {
        //    //For global search 'globalSearchBinId'
        //    //For internal 'From/To' search 'searchWHId'
        //    vm.binFilter[transferLabel][searchValueKey] = response.data.id;

        //    if (searchValueKey == 'globalSearchBinId') {
        //      if (vm.filter.transferOption == vm.TrasferStockType.StockTransfer) {
        //        vm.warehouseFilter.transferFrom.globalSearchBinId = response.data.id;
        //      }
        //      else if (vm.filter.transferOption == vm.TrasferStockType.KitTransfer || vm.filter.transferOption == vm.TrasferStockType.DeptTransfer) {
        //        vm.kitFilter.transferFrom.globalSearchBinId = response.data.id;
        //      }
        //    }

        //    if (transferLabel == 'transferFrom') {
        //      if (searchValueKey == 'globalSearchBinId') {
        //        //vm.binFilter.transferFrom.clusterWHID = response.data.isPermanentBin ? response.data.warehousemst.id : null;
        //        vm.searchFromTransferStock();
        //      }
        //      else {
        //        vm.getActiveBin('transferFrom');
        //      }
        //    }
        //    else if (transferLabel == 'transferTo') {
        //      vm.getActiveBin('transferTo');
        //    }
        //  }
        //  else {
        //    let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SCAN_VALID_BIN);
        //    let model = {
        //      messageContent: messageContent,
        //      multiple: true
        //    };
        //    DialogFactory.messageAlertDialog(model).then((yes) => {
        //      if (yes) {
        //        vm.scanAndSearch[searchColumnName] = null;
        //        setFocus(searchColumnName);
        //      }
        //    }).catch((error) => {
        //      return BaseService.getErrorLog(error);
        //    });
        //  }
        //}).catch((error) => {
        //});
      } else {
        vm.resetBinSearch(transferLabel, searchColumnName);
      }
    };

    /* Global UMID filter for 'From' transfer stock */
    vm.scanGlobalSearchUMID = ($event) => {
      $timeout(() => {
        if ($event.keyCode === 13) {
          vm.searchUMID('SearchUMID', 'globalSearchUIDString', 'transferFrom');
        }
      });
    };

    /* Individual section UID filter for 'From' transfer stock */
    vm.scanInternalFromSearchUID = ($event) => {
      $timeout(() => {
        if ($event.keyCode === 13) {
          vm.searchUMID('InternalFromSearchUID', 'searchUIDId', 'transferFrom');
        }
      });
    };

    /* Individual section UID filter for 'To' transfer stock */
    vm.scanInternalToSearchUID = ($event) => {
      $timeout(() => {
        if ($event.keyCode === 13) {
          vm.searchUMID('InternalToSearchUID', 'searchUIDId', 'transferTo');
        }
      });
    };

    vm.searchUMID = (searchColumnName, searchValueKey, transferLabel) => {
      if (vm.scanAndSearch[searchColumnName]) {
        vm.resetInfiniteScroll(transferLabel);
        vm.uidFilter[transferLabel][searchValueKey] = vm.scanAndSearch[searchColumnName];

        if (searchValueKey === 'globalSearchUIDString') {
          vm.warehouseFilter.transferFrom.globalSearchUIDString = vm.scanAndSearch[searchColumnName];
          if (vm.filter.transferOption === vm.TrasferStockType.KitTransfer || vm.filter.transferOption === vm.TrasferStockType.DeptTransfer) {
            vm.kitFilter.transferFrom.globalSearchUIDString = vm.scanAndSearch[searchColumnName];
          }
        }

        if (transferLabel === 'transferFrom') {
          if (searchValueKey === 'globalSearchUIDString') {
            vm.binFilter.transferFrom.globalSearchUIDString = vm.scanAndSearch[searchColumnName];
            vm.searchFromTransferStock();
          }
          else {
            vm.getUIDDetail('transferFrom');
          }
        }
        else if (transferLabel === 'transferTo') {
          vm.getUIDDetail('transferTo');
        }

        //ReceivingMaterialFactory.getUMIDDetailByUMID().query({ UMID: vm.scanAndSearch[searchColumnName] }).$promise.then((response) => {
        //  if (response && response.data) {
        //    ////For global search 'globalSearchBinId'
        //    ////For internal 'From/To' search 'searchWHId'
        //    vm.uidFilter[transferLabel][searchValueKey] = response.data.id;

        //    if (searchValueKey == 'globalSearchUIDId') {
        //      if (vm.filter.transferOption == vm.TrasferStockType.StockTransfer) {
        //        vm.warehouseFilter.transferFrom.globalSearchUIDId = response.data.id;
        //      }
        //      else if (vm.filter.transferOption == vm.TrasferStockType.KitTransfer || vm.filter.transferOption == vm.TrasferStockType.DeptTransfer) {
        //        vm.kitFilter.transferFrom.globalSearchUIDId = response.data.id;
        //      }
        //    }

        //    if (transferLabel == 'transferFrom') {
        //      if (searchValueKey == 'globalSearchUIDId') {
        //        vm.binFilter.transferFrom.globalSearchUIDId = response.data.id;
        //        vm.searchFromTransferStock();
        //      }
        //      else {
        //        vm.getUIDDetail('transferFrom');
        //      }
        //    }
        //    else if (transferLabel == 'transferTo') {
        //      vm.getUIDDetail('transferTo');
        //    }
        //  }
        //  else {
        //    let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SCAN_VALID_UMID);
        //    let model = {
        //      messageContent: messageContent,
        //      multiple: true
        //    };
        //    DialogFactory.messageAlertDialog(model).then((yes) => {
        //      if (yes) {
        //        vm.scanAndSearch[searchColumnName] = null;
        //        setFocus(searchColumnName);
        //      }
        //    }).catch((error) => {
        //      return BaseService.getErrorLog(error);
        //    });
        //  }
        //}).catch((error) => {
        //});
      } else {
        vm.resetUMIDSearch(transferLabel, searchColumnName);
      }
    };

    /** Reset global search of 'From' section */
    vm.resetGlobalSearch = () => {
      vm.scanAndSearch.SearchWarehouse = null;
      vm.scanAndSearch.SearchBin = null;
      vm.scanAndSearch.SearchUMID = null;
      vm.resetInfiniteScroll();
      if (vm.autoCompleteSearchKit && vm.autoCompleteSearchKit.keyColumnId) {
        vm.autoCompleteSearchKit.keyColumnId = null;
        $scope.$broadcast(vm.autoCompleteSearchKit.inputName, null);
      } else {
        vm.searchFromTransferStock();
      }
    };

    /** Reset kit search*/
    vm.resetKitSearch = (transferLabel) => {
      vm.scanAndSearch.SearchWarehouse = null;
      vm.scanAndSearch.SearchBin = null;
      vm.scanAndSearch.SearchUMID = null;
      vm.resetInfiniteScroll();
      vm.resetInfiniteScrollKit(transferLabel);
      vm.searchFromTransferStock();
    };

    /** Reset warehouse search*/
    vm.resetWHSearch = (transferLabel, searchColumnName) => {
      vm.scanAndSearch[searchColumnName] = null;
      vm.warehouseFilter[transferLabel].searchWHId = null;
      vm.resetInfiniteScrollWarehouse(transferLabel);
      if (transferLabel === 'transferFrom') {
        vm.searchFromTransferStock();
      }
      else if (transferLabel === 'transferTo') {
        vm.getActiveWarehouse('transferTo');
      }
    };

    /** Reset bin search*/
    vm.resetBinSearch = (transferLabel, searchColumnName) => {
      vm.scanAndSearch[searchColumnName] = null;
      vm.binFilter[transferLabel].searchBinId = null;
      vm.resetInfiniteScrollBin(transferLabel);
      vm.getActiveBin(transferLabel);
    };

    /** Reset UMID search*/
    vm.resetUMIDSearch = (transferLabel, searchColumnName) => {
      vm.scanAndSearch[searchColumnName] = null;
      vm.uidFilter[transferLabel].searchUIDId = null;
      vm.resetInfiniteScrollUMID(transferLabel);
      vm.getUIDDetail(transferLabel);
    };

    /** Initialize auto-complete of kit search */
    vm.initSearchAutoComplete = () => {
      /* Global kit filter for 'From' transfer stock */
      vm.autoCompleteSearchKit = {
        columnName: 'name',
        keyColumnName: 'name',
        keyColumnId: null,
        inputName: 'kitSearch',
        placeholderName: 'Search Kit',
        isRequired: false,
        isAddnew: false,
        onSelectCallbackFn: (item) => {
          vm.globalSearchKitDet = item;
          $timeout(() => {
            vm.searchFromTransferStock();
          });
        },
        onSearchFn: (query) => {
          vm.kitFilter.globalSearchFromAutocomplete.searchString = query;
          vm.kitFilter.globalSearchFromAutocomplete.deptID = vm.selectedDetail.Dept['transferFrom'].ID;
          return vm.getSearchKit('globalSearchFromAutocomplete');
        }
      };

      /* Individual section kit filter for 'From' transfer stock */
      vm.autoCompleteInternalFromKitSearch = {
        columnName: 'name',
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'fromKitSearch',
        placeholderName: 'Search Kit',
        isRequired: false,
        isAddnew: false,
        onSelectCallbackFn: (item) => {
          vm.searchFromKitDet = item;
          vm.kitFilter.transferFrom.searchRefSalesOrderDetID = vm.searchFromKitDet ? vm.searchFromKitDet.refSalesOrderDetID : null;
          vm.kitFilter.transferFrom.searchAssyID = vm.searchFromKitDet ? vm.searchFromKitDet.assyID : null;
          vm.resetInfiniteScroll('transferFrom');
          vm.getKitToTransferStock('transferFrom');
        },
        onSearchFn: (query) => {
          vm.kitFilter.transferFromAutocomplete.globalSearchRefSalesOrderDetID = vm.globalSearchKitDet ? vm.globalSearchKitDet.refSalesOrderDetID : null;
          vm.kitFilter.transferFromAutocomplete.globalSearchAssyID = vm.globalSearchKitDet ? vm.globalSearchKitDet.assyID : null;
          vm.kitFilter.transferFromAutocomplete.searchString = query;
          vm.kitFilter.transferFromAutocomplete.deptID = vm.selectedDetail.Dept['transferFrom'].ID;
          return vm.getSearchKit('transferFromAutocomplete');
        }
      };

      /* Individual section kit filter for 'To' transfer stock */
      vm.autoCompleteInternalToKitSearch = {
        columnName: 'name',
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'toKitSearch',
        placeholderName: 'Search Kit',
        isRequired: false,
        isAddnew: false,
        onSelectCallbackFn: (item) => {
          vm.searchToKitDet = item;
          vm.kitFilter.transferTo.globalSearchRefSalesOrderDetID = vm.searchToKitDet ? vm.searchToKitDet.refSalesOrderDetID : null;
          vm.kitFilter.transferTo.globalSearchAssyID = vm.searchToKitDet ? vm.searchToKitDet.assyID : null;
          vm.resetInfiniteScroll('transferTo');
          vm.getKitToTransferStock('transferTo');
        },
        onSearchFn: (query) => {
          vm.kitFilter.transferToAutocomplete.deptID = vm.autoCompleteToDept.keyColumnId;
          vm.kitFilter.transferToAutocomplete.searchString = query;
          vm.kitFilter.transferFromAutocomplete.deptID = vm.selectedDetail.Dept['transferTo'].ID;
          return vm.getSearchKit('transferToAutocomplete');
        }
      };
    };

    vm.initSearchAutoComplete();

    /* Retrieve list of active warehouse for search */
    vm.getSearchWarehouse = (transferLabel) => TransferStockFactory.getActiveWarehouse().query(vm.warehouseFilter[transferLabel]).$promise.then((response) => response.data && response.data.warehouseList ? response.data.warehouseList : []).catch((error) => BaseService.getErrorLog(error));

    /* Retrieve list of kit for search */
    vm.getSearchKit = (transferLabel) => {
      const searchObj = angular.copy(vm.kitFilter[transferLabel]);
      searchObj.page = 0;
      searchObj.pageSize = 10;
      const searchLabel = transferLabel === 'transferFromAutocomplete' ? 'transferFrom' : 'transferTo';
      searchObj.isCheckMRP = vm.kitFilter[searchLabel].isCheckMRP;
      searchObj.isCheckMWS = vm.kitFilter[searchLabel].isCheckMWS;
      searchObj.isCheckMRE = vm.kitFilter[searchLabel].isCheckMRE;
      searchObj.isCheckPRE = vm.kitFilter[searchLabel].isCheckPRE;
      searchObj.isCheckPPR = vm.kitFilter[searchLabel].isCheckPPR;
      searchObj.isCheckPNR = vm.kitFilter[searchLabel].isCheckPNR;
      searchObj.isCheckMRR = vm.kitFilter[searchLabel].isCheckMRR;
      return TransferStockFactory.getKitToTransferStock().query(searchObj).$promise.then((response) => response.data && response.data.kitList ? response.data.kitList : []).catch((error) => BaseService.getErrorLog(error));
    };

    /* Retrieve list of  active bin for search */
    vm.getSearchBin = (transferLabel) => vm.cgBusyLoading = TransferStockFactory.getActiveBin().query(vm.binFilter[transferLabel]).$promise.then((response) => response.data && response.data.binList ? response.data.binList : []).catch((error) => BaseService.getErrorLog(error));


    /* Retrieve list of part detail for search */
    vm.getSearchUIDDetail = (transferLabel) => TransferStockFactory.getUIDDetail().query(vm.uidFilter[transferLabel]).$promise.then((response) => response.data && response.data.component ? response.data.component : []).catch((error) => BaseService.getErrorLog(error));


    /** Set filter parameter to search based on selected/entered value */
    vm.searchFromTransferStock = () => {
      if (!vm.scanAndSearch.SearchBin) {
        vm.binFilter.transferFrom.globalSearchBinString = null;
      }

      if (!vm.scanAndSearch.InternalFromSearchBin) {
        vm.binFilter.transferFrom.searchBinId = null;
      }

      if (!vm.scanAndSearch.SearchUMID) {
        vm.warehouseFilter.transferFrom.globalSearchUIDString = null;
        vm.binFilter.transferFrom.globalSearchUIDString = null;
        vm.uidFilter.transferFrom.globalSearchUIDString = null;
      }

      if (!vm.scanAndSearch.InternalFromSearchUID) {
        vm.uidFilter.transferFrom.searchUIDId = null;
      }

      //vm.binFilter.transferFrom.clusterWHID = vm.uidFilter.globalSearchFromAutocomplete.clusterWHID;

      if (vm.filter.transferOption === vm.TrasferStockType.StockTransfer || vm.filter.transferOption === vm.TrasferStockType.StockTransferToOtherDept) {
        if (!vm.scanAndSearch.SearchWarehouse) {
          vm.warehouseFilter.transferFrom.globalSearchWHString = null;
          vm.warehouseFilter.transferFrom.paramSearchWHId = null;
        }

        if (!vm.scanAndSearch.InternalFromWHSearch) {
          vm.warehouseFilter.transferFrom.searchWHId = null;
        }

        if (!vm.scanAndSearch.SearchBin) {
          vm.warehouseFilter.transferFrom.globalSearchBinString = null;
        }

        if (!vm.scanAndSearch.SearchUMID) {
          vm.warehouseFilter.transferFrom.globalSearchUIDString = null;
        }
        //vm.warehouseFilter.transferFrom.clusterWHID = vm.uidFilter.globalSearchFromAutocomplete.clusterWHID;

        vm.paramWHId = 0;

        vm.getActiveWarehouse('transferFrom');
      }
      else if (vm.filter.transferOption === vm.TrasferStockType.KitTransfer || vm.filter.transferOption === vm.TrasferStockType.DeptTransfer) {
        vm.kitFilter.transferFrom.globalSearchRefSalesOrderDetID = vm.globalSearchKitDet ? vm.globalSearchKitDet.refSalesOrderDetID : null;
        vm.kitFilter.transferFrom.globalSearchAssyID = vm.globalSearchKitDet ? vm.globalSearchKitDet.assyID : null;

        if (!vm.scanAndSearch.SearchBin) {
          vm.kitFilter.transferFrom.globalSearchBinString = null;
        }

        if (!vm.scanAndSearch.SearchUMID) {
          vm.kitFilter.transferFrom.globalSearchUIDString = null;
        }

        vm.paramSalesOrderDetailId = 0;
        vm.paramAssyId = 0;

        vm.getKitToTransferStock('transferFrom');
      }
    };

    /**
     * Open pop-up to check history of UMID
     * @param {any} component selected UMID detail
     */
    vm.transferStockHistory = (event, component) => {
      DialogFactory.dialogService(
        TRANSACTION.TRANSACTION_TRANSFER_STOCK_HISTORY_CONTROLLER,
        TRANSACTION.TRANSACTION_TRANSFER_STOCK_HISTORY_VIEW,
        event,
        component).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    };


    vm.OpenMenu = ($event, $mdOpenMenu) => {
      $mdOpenMenu();
      $event.stopPropagation();
    };

    /**
     * Make warehouse inactive
     * @param {any} whDetail
     */
    vm.inactiveWH = (whDetail) => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.INACTIVE_WH_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT,
        multiple: true
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          DialogFactory.closeDialogPopup();
          vm.cgBusyLoading = WarehouseBinFactory.warehouse().save({ ID: whDetail.id, Name: whDetail.name, isActive: false }).$promise.then((res) => {
            if (res && res.data && res.data.ID) {
              _.each(['transferFrom', 'transferTo'], (transferLabel) => {
                vm.getActiveWarehouse(transferLabel);
              });
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    };


    /** Open pop-up to transfer warehouse to department*/
    vm.transferWHToDept = (whDetail) => {
      const transferItemDet = {
        transferItem: whDetail,
        transferTo: vm.transferSection.WH,
        fromWHID: whDetail.id,
        transType: CORE.UMID_History.Trasaction_Type.WH_Dept_Transfer,
        isCheckMismatchInventory: true,
        mismatchInventoryData: {
          whDetail: whDetail,
          currentKit: vm.selectedDetail.Kit['transferFrom'],
          salesOrderDetail: vm.salesOrderDetail
        }
      };
      vm.openTransferPopup(transferItemDet);
    };

    /** Open pop-up to transfer warehouse to warehouse*/
    vm.transferWHToWH = (whDetail) => {
      const transferItemDet = {
        transferItem: whDetail,
        transferTo: vm.transferSection.WH,
        fromWHID: whDetail.id,
        transType: CORE.UMID_History.Trasaction_Type.WH_WH_Transfer,
        isCheckMismatchInventory: true,
        mismatchInventoryData: {
          whDetail: whDetail,
          currentKit: vm.selectedDetail.Kit['transferFrom'],
          salesOrderDetail: vm.salesOrderDetail
        }
      };
      vm.openTransferPopup(transferItemDet);
    };

    /** Open pop-up to check history of warehouse */
    vm.warehouseHistory = (whDetail) => {
      DialogFactory.dialogService(
        CORE.WAREHOUSE_HISTORY_MODAL_CONTROLLER,
        CORE.WAREHOUSE_HISTORY_MODAL_VIEW,
        event,
        whDetail).then(() => {

        }, (err) => BaseService.getErrorLog(err));
    };

    /** Make warehouse inactive */
    vm.inactiveBin = (binDetail) => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.INACTIVE_BIN_ALERT_BODY_MESSAGE);
      var model = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT,
        multiple: true
      };
      DialogFactory.messageConfirmDialog(model).then((yes) => {
        if (yes) {
          DialogFactory.closeDialogPopup();
          vm.cgBusyLoading = BinFactory.updateBin().query({
            id: binDetail.id,
            isActive: false
          }).$promise.then((res) => {
            if (res && res.data && res.data.id) {
              _.each(['transferFrom', 'transferTo'], (transferLabel) => {
                vm.refreshWH(transferLabel, binDetail.warehouseID, false);
              });
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }, () => { }).catch((error) => BaseService.getErrorLog(error));
    };

    /** Open pop-up to check history of bin */
    vm.binHistory = (binDetail) => {
      DialogFactory.dialogService(
        CORE.BIN_HISTORY_MODAL_CONTROLLER,
        CORE.BIN_HISTORY_MODAL_VIEW,
        event,
        binDetail).then(() => {

        }, (err) => BaseService.getErrorLog(err));
    };

    /** Open pop-up to transfer bin to warehouse*/
    vm.transferBinToWH = (binDetail) => {
      const transferItemDet = {
        transferItem: binDetail,
        transferTo: vm.transferSection.WH,
        fromBinID: binDetail.id,
        transType: CORE.UMID_History.Trasaction_Type.Bin_WH_Transfer,
        isCheckMismatchInventory: true,
        mismatchInventoryData: {
          binDetail: binDetail,
          currentKit: vm.selectedDetail.Kit['transferFrom'],
          salesOrderDetail: vm.salesOrderDetail
        }
      };
      vm.openTransferPopup(transferItemDet);
    };

    /** Open pop-up to transfer bin to bin*/
    vm.transferBinToBin = (binDetail) => {
      const transferItemDet = {
        transferItem: binDetail,
        transferTo: vm.transferSection.Bin,
        fromBinID: binDetail.id,
        transType: CORE.UMID_History.Trasaction_Type.Bin_Bin_Transfer
      };
      if (vm.filter.transferOption === vm.TrasferStockType.KitTransfer || vm.filter.transferOption === vm.TrasferStockType.DeptTransfer) {
        transferItemDet.refSalesOrderDetID = vm.selectedDetail.Kit.transferFrom.refSalesOrderDetID;
        transferItemDet.assyID = vm.selectedDetail.Kit.transferFrom.assyID;
      }
      vm.openTransferPopup(transferItemDet);
    };

    /** Open pop-up to transfer UMID to bin*/
    vm.transferUIDToBin = (component) => {
      const transferItemDet = {
        transferItem: component,
        transferTo: vm.transferSection.Bin,
        uidID: component.id,
        transType: CORE.UMID_History.Trasaction_Type.UMID_Bin_Transfer
      };
      if (vm.filter.transferOption === vm.TrasferStockType.KitTransfer || vm.filter.transferOption === vm.TrasferStockType.DeptTransfer) {
        transferItemDet.refSalesOrderDetID = vm.selectedDetail.Kit.transferFrom.refSalesOrderDetID;
        transferItemDet.assyID = vm.selectedDetail.Kit.transferFrom.assyID;
      }
      vm.openTransferPopup(transferItemDet);
    };

    /** Open manual transfer pop-up*/
    vm.openTransferPopup = (transferItemDet) => {
      transferItemDet.transferOption = vm.filter.transferOption;
      transferItemDet.transferFromDept = vm.selectedDetail.Dept.transferFrom;
      if (!(transferItemDet.transferItem.transferSection === vm.transferSection.Kit && transferItemDet.transferTo === vm.transferSection.Dept)) {
        transferItemDet.transferFromWH = vm.selectedDetail.WH.transferFrom;
        transferItemDet.transferFromBin = vm.selectedDetail.Bin.transferFrom;
      }
      transferItemDet.transferToDept = vm.selectedDetail.Dept.transferTo;

      let deptOption = CORE.UMID_History.Trasaction_Type.WithinDept;
      if (vm.filter.transferOption === vm.TrasferStockType.StockTransferToOtherDept || vm.filter.transferOption === vm.TrasferStockType.DeptTransfer) {
        deptOption = CORE.UMID_History.Trasaction_Type.OtherDept;
      }

      let transferOption = CORE.UMID_History.Trasaction_Type.TransferStock;
      if (vm.filter.transferOption === vm.TrasferStockType.KitTransfer || vm.filter.transferOption === vm.TrasferStockType.DeptTransfer) {
        transferOption = CORE.UMID_History.Trasaction_Type.TransferKit;
      }

      transferItemDet.actionPerformed = stringFormat('{0} ({1}: {2})', CORE.UMID_History.Action_Performed.TransferMaterial, transferOption, deptOption);

      DialogFactory.dialogService(
        CORE.TRANSFER_WAREHOUSE_BIN_MODAL_CONTROLLER,
        CORE.TRANSFER_WAREHOUSE_BIN_MODAL_VIEW,
        event,
        transferItemDet).then((response) => {
          if (response) {
            if (vm.filter.transferOption === vm.TrasferStockType.StockTransfer && response.transferDet && response.transferDet.transferTo === vm.transferSection.Bin) {
              _.each([response.transferDet.whID, transferItemDet.transferFromWH.id], (whID) => {
                _.each(['transferFrom', 'transferTo'], (transferLabel) => {
                  vm.refreshWH(transferLabel, whID, false);
                });
              });
            }
            if (response.updateStock) {
              vm.updateTransferredStockDetail(response.updateStock);
            }
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    /** Refresh warehouse section to update count of selected warehouse*/
    vm.refreshWH = (transferLabel, warehouseID) => {
      var whItem = _.find(vm.warehouseList[transferLabel], {
        id: warehouseID
      });
      if (whItem) {
        whItem.isSelected = true;
      }
      if (whItem || vm.filter.transferOption === vm.TrasferStockType.StockTransferToOtherDept) {
        vm.cgBusyLoading = TransferStockFactory.getActiveWarehouse().query({
          paramSearchWHId: warehouseID
        }).$promise.then((response) => {
          if (response.data) {
            const tempWarehouseList = response.data.warehouseList;
            if (tempWarehouseList && tempWarehouseList.length > 0) {
              const whDet = _.first(tempWarehouseList);
              whItem = _.find(vm.warehouseList[transferLabel], {
                id: warehouseID
              });
              if (whDet && vm.selectedDetail.Dept && vm.selectedDetail.Dept[transferLabel] && whDet.parentWHID === vm.selectedDetail.Dept[transferLabel].ID) {
                if (!whItem) {
                  const whItem = {
                    id: whDet.id,
                    name: whDet.name,
                    isPermanent: whDet.isPermanentWH,
                    parentWHID: whDet.parentWHID,
                    parentWHType: whDet.parentWHType,
                    warehouseType: whDet.warehouseType,
                    warehouseTypeValue: whDet.warehouseTypeValue
                  };
                  const kitName = BaseService.generateRedirectLinkForKit(whDet.kitName);
                  let objCountDetail = angular.copy(whItem);
                  objCountDetail = _.assign({}, objCountDetail, {
                    deptName: whDet.deptName,
                    binCount: whDet.binCount,
                    uidCount: whDet.uidCount,
                    umidPendingParts: whDet.umidPendingParts,
                    totalEmptyBin: whDet.totalEmptyBin,
                    anotherKitStock: whDet.anotherKitStock,
                    unallocatekitStock: whDet.unallocatekitStock,
                    numberTotalKit: whDet.numberTotalKit,
                    unallocatedUMID: whDet.unallocatedUMID,
                    transferSection: vm.transferSection.WH,
                    transferLabel: transferLabel,
                    cartImage: whDet.isPermanentWH ? vm.cartImages.permanent : (whDet.uniqueCartID ? vm.cartImages.kit : vm.cartImages.movable),
                    allMovableBin: whDet.allMovableBin,
                    otherKitName: kitName.length > 0 ? _.map(kitName).join(', ') : '',
                    emptyBinName: whDet.emptyBinName
                  });
                  whItem.countDetail = [objCountDetail];
                  vm.warehouseList[transferLabel].push(whItem);
                }
              }
              if (whDet && whItem) {
                const whCountDet = _.first(whItem.countDetail);
                if (whCountDet) {
                  whCountDet.binCount = whDet.binCount;
                  whCountDet.uidCount = whDet.uidCount;
                  whCountDet.umidPendingParts = whDet.umidPendingParts;
                  whCountDet.totalEmptyBin = whDet.totalEmptyBin;
                  whCountDet.anotherKitStock = whDet.anotherKitStock;
                  whCountDet.unallocatekitStock = whDet.unallocatekitStock;
                  whCountDet.numberTotalKit = whDet.numberTotalKit;
                  whCountDet.unallocatedUMID = whDet.unallocatedUMID;
                  whCountDet.emptyBinName = whDet.emptyBinName;
                }
              }
            }
            if (whItem && whItem.isSelected) {
              vm.getActiveBin(transferLabel);
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.goToWHList = () => {
      BaseService.goToWHList();
    };

    vm.goToBinList = () => {
      BaseService.goToBinList();
    };

    vm.goToUMIDList = ($event, whId, binId, refSalesOrderDetID, assyID) => {
      if ($event && (whId || binId || refSalesOrderDetID || assyID)) {
        $event.stopPropagation();
      }

      BaseService.goToUMIDList(whId, binId, refSalesOrderDetID, assyID);
    };

    vm.goDatakeysPage = () => {
      BaseService.gotoDataKeyList();
    };

    vm.changeTransferOption = () => {
      vm.resetInfiniteScroll();
      if (vm.filter.transferOption === vm.TrasferStockType.StockTransfer || vm.filter.transferOption === vm.TrasferStockType.StockTransferToOtherDept) {
        vm.warehouseFilter.transferFrom.assyID = null;
        vm.warehouseFilter.transferFrom.refSalesOrderDetID = null;
        vm.warehouseFilter.transferTo.assyID = null;
        vm.warehouseFilter.transferTo.refSalesOrderDetID = null;
        // vm.getActiveWarehouse('transferFrom');
        // vm.getActiveWarehouse('transferTo');
        vm.selectedDetail.Kit = {
          transferFrom: null,
          transferTo: null
        };

        if (vm.filter.transferOption === vm.TrasferStockType.StockTransfer && vm.autoCompleteToDept.keyColumnId !== vm.autoCompleteFromDept.keyColumnId) {
          vm.autoCompleteToDept.keyColumnId = vm.autoCompleteFromDept.keyColumnId;
          vm.warehouseFilter.transferTo.deptID = vm.autoCompleteToDept.keyColumnId;
        } else if (vm.filter.transferOption === vm.TrasferStockType.StockTransferToOtherDept && vm.autoCompleteToDept.keyColumnId === vm.autoCompleteFromDept.keyColumnId) {
          vm.autoCompleteToDept.keyColumnId = _.find(vm.toDeptList, (item) => item.ID !== vm.autoCompleteFromDept.keyColumnId && item.parentWHType !== vm.selectedDetail.Dept.transferFrom.parentWHType).ID;
          vm.warehouseFilter.transferTo.deptID = vm.autoCompleteToDept.keyColumnId;
        } else {
          vm.getActiveWarehouse('transferTo');
        }
        setDefaultValueOfKitFilterCheckBox();
      } else if (vm.filter.transferOption === vm.TrasferStockType.KitTransfer) {
        vm.getKitToTransferStock('transferFrom');

        if (vm.autoCompleteToDept.keyColumnId !== vm.autoCompleteFromDept.keyColumnId) {
          vm.autoCompleteToDept.keyColumnId = vm.autoCompleteFromDept.keyColumnId;
        } else {
          vm.getKitToTransferStock('transferTo');
        }

        setDefaultValueOfKitFilterCheckBox();
      } else if (vm.filter.transferOption === vm.TrasferStockType.DeptTransfer) {
        vm.emptyDropContent.kit.deptID = vm.autoCompleteToDept.keyColumnId;
        // vm.getKitToTransferStock('transferFrom');

        if (vm.autoCompleteToDept.keyColumnId === vm.autoCompleteFromDept.keyColumnId) {
          vm.autoCompleteToDept.keyColumnId = _.find(vm.toDeptList, (item) => item.ID !== vm.autoCompleteFromDept.keyColumnId && item.parentWHType !== vm.selectedDetail.Dept.transferFrom.parentWHType).ID;
        } else {
          vm.getKitToTransferStock('transferTo');
        }

        setDefaultValueOfKitFilterCheckBox();
      }

      vm.resetGlobalSearch();
      vm.scanAndSearch = {};

      vm.warehouseFilter['transferFrom'].searchWHId = null;
      vm.warehouseFilter['transferTo'].searchWHId = null;
      vm.binFilter['transferFrom'].searchBinId = null;
      vm.binFilter['transferTo'].searchBinId = null;
      vm.uidFilter['transferFrom'].searchUIDId = null;
      vm.uidFilter['transferTo'].searchUIDId = null;

      vm.transferDeptDetail.transferOption = vm.filter.transferOption;
      localStorage.setItem('transferDeptDetail', JSON.stringify(vm.transferDeptDetail));
    };

    vm.changeKitCheckBoxFilter = (type) => {
      if (type === 'TransferFrom') {
        if (!vm.kitFilter.transferFrom.isCheckMRP && !vm.kitFilter.transferFrom.isCheckMWS && !vm.kitFilter.transferFrom.isCheckMRE &&
          !vm.kitFilter.transferFrom.isCheckPRE && !vm.kitFilter.transferFrom.isCheckPPR && !vm.kitFilter.transferFrom.isCheckPNR && !vm.kitFilter.transferFrom.isCheckMRR) {
          vm.showFromKitFilterEmptyState = true;
        } else {
          vm.showFromKitFilterEmptyState = false;
        }

        if (!vm.showFromKitFilterEmptyState) {
          vm.searchFromTransferStock();
        }
      } else {
        if (!vm.kitFilter.transferTo.isCheckMRP && !vm.kitFilter.transferTo.isCheckMWS && !vm.kitFilter.transferTo.isCheckMRE &&
          !vm.kitFilter.transferTo.isCheckPRE && !vm.kitFilter.transferTo.isCheckPPR && !vm.kitFilter.transferTo.isCheckPNR && !vm.kitFilter.transferTo.isCheckMRR) {
          vm.showToKitFilterEmptyState = true;
        } else {
          vm.showToKitFilterEmptyState = false;
        }

        if (!vm.showFromKitFilterEmptyState) {
          vm.getKitToTransferStock('transferTo');
        }
      }
    };

    /** Refresh kit section to update count of selected kit*/
    vm.refreshKit = (assyID, refSalesOrderDetID) => {
      _.each(['transferFrom', 'transferTo'], (transferLabel) => {
        const refreshKitObj = {
          deptID: vm.selectedDetail.Dept[transferLabel].ID,
          searchRefSalesOrderDetID: refSalesOrderDetID,
          searchAssyID: assyID,
          isCheckMRP: vm.kitFilter[transferLabel].isCheckMRP,
          isCheckMWS: vm.kitFilter[transferLabel].isCheckMWS,
          isCheckMRE: vm.kitFilter[transferLabel].isCheckMRE,
          isCheckPRE: vm.kitFilter[transferLabel].isCheckPRE,
          isCheckPPR: vm.kitFilter[transferLabel].isCheckPPR,
          isCheckPNR: vm.kitFilter[transferLabel].isCheckPNR,
          isCheckMRR: vm.kitFilter[transferLabel].isCheckMRR
        };
        vm.cgBusyLoading = TransferStockFactory.getKitToTransferStock().query(refreshKitObj).$promise.then((response) => {
          const tempKitList = response.data ? response.data.kitList : [] || [];
          if (tempKitList && tempKitList.length > 0) {
            const kitDet = _.first(tempKitList);
            if (kitDet) {
              const kitItem = _.find(vm.kitList[transferLabel], { assyID: assyID, refSalesOrderDetID: refSalesOrderDetID });
              if (kitItem) {
                const kitCountDet = _.first(kitItem.countDetail);
                const kitName = BaseService.generateRedirectLinkForKit(kitDet.kitName);
                const nextReleasePlan = {
                  id: kitDet.id,
                  salesOrderDetID: kitDet.salesOrderDetID,
                  refAssyId: kitDet.refAssyId,
                  subAssyID: kitDet.subAssyID,
                  plannKitNumber: kitDet.plannKitNumber,
                  poQty: kitDet.poQty,
                  poDueDate: kitDet.poDueDate,
                  mfrLeadTime: kitDet.mfrLeadTime,
                  materialDockDate: kitDet.materialDockDate,
                  kitReleaseQty: kitDet.kitReleaseQty,
                  kitReleaseDate: kitDet.kitReleaseDate,
                  kitReleasedPassedDays: kitDet.kitReleasedPassedDays > 0 ? kitDet.kitReleasedPassedDays : 0,
                  feasibilityWithAllocatedQty: kitDet.feasibilityWithAllocatedQty,
                  actualKitReleaseDate: kitDet.actualKitReleaseDate,
                  releasedBy: kitDet.releasedBy,
                  releaseTimeFeasibility: kitDet.releaseTimeFeasibility,
                  kitStatus: kitDet.kitStatus,
                  rushJob: kitDet.rushJob,
                  mismatchItem: kitDet.mismatchItem,
                  woStatusID: kitDet.woStatusID,
                  refPlanId: kitDet.refPlanId,
                  releasedNote: kitDet.releasedNote,
                  releaseKitNumber: kitDet.releaseKitNumber,
                  kitReturnStatus: kitDet.kitReturnStatus,
                  kitReturnDate: kitDet.kitReturnDate,
                  kitReleaseIndicator: kitDet.kitReleaseIndicator,
                  kitPlanPercentage: kitDet.kitPlanPercentage
                };
                if (kitCountDet) {
                  kitCountDet.binCount = kitDet.binCount;
                  kitCountDet.uidCount = kitDet.uidCount;
                  kitCountDet.isHotJob = kitDet.isHotJob;
                  kitCountDet.kitPercentage = kitDet.kitPercentage;
                  kitCountDet.totalKitPlan = kitDet.totalKitPlan;
                  kitCountDet.totalKitReleasePlan = kitDet.totalKitReleasePlan;
                  kitCountDet.kitBuildFeasibility = (kitDet.kitBuildFeasibility || 0);
                  kitCountDet.mismatchUMIDBin = kitDet.mismatchUMIDBin;
                  kitCountDet.allocationUMIDCount = kitDet.allocationUMIDCount;
                  kitCountDet.deptType = kitDet.deptType;
                  kitCountDet.woID = kitDet.woID;
                  kitCountDet.workorderNumber = kitDet.workorderNumber;
                  kitCountDet.otherKitName = kitName.length > 0 ? _.map(kitName).join(', ') : '',
                    kitCountDet.nextReleasePlan = nextReleasePlan;
                }
                if (kitItem.isSelected) {
                  vm.getActiveWarehouse(transferLabel);
                }
              } else {
                const objKit = {
                  id: kitDet.assyID,
                  refSalesOrderDetID: kitDet.refSalesOrderDetID,
                  assyID: kitDet.assyID,
                  name: kitDet.name,
                  isPermanent: false,
                  deptID: kitDet.deptID,
                  kitReleaseStatus: (kitDet.kitReleaseStatus || vm.Kit_Release_Status.NotReleased),
                  kitStatusPercentage: (kitDet.kitStatusPercentage || 0),
                  totalLines: (kitDet.totalLines || 0),
                  shortageLines: (kitDet.shortageLines || 0),
                  isHotJob: kitDet.isHotJob,
                  hotJobIcon: vm.cartImages.hotJob,
                  associatedWorkorder: kitDet.associatedWorkorder
                };
                let objCountDetail = angular.copy(objKit);
                objCountDetail = _.assign({}, objCountDetail, {
                  deptName: kitDet.deptName,
                  binCount: kitDet.binCount,
                  uidCount: kitDet.uidCount,
                  transferSection: vm.transferSection.Kit,
                  transferLabel: transferLabel,
                  cartImage: vm.cartImages.kit
                });
                objKit.countDetail = [objCountDetail];
                vm.kitList[transferLabel].push(objKit);
                vm.selectDropableKit(objKit, transferLabel);
              }
            }
          } else {
            const kitIndex = _.findIndex(vm.kitList[transferLabel], {
              assyID: assyID,
              refSalesOrderDetID: refSalesOrderDetID
            });
            if (kitIndex !== -1) {
              vm.kitList[transferLabel].splice(kitIndex, 1);
            }
            if (vm.kitList[transferLabel].length > 0) {
              const kitDet = vm.selectedDetail.Kit[transferLabel];
              if (kitDet) {
                const kitIndex = _.findIndex(vm.kitList[transferLabel], {
                  assyID: kitDet.assyID,
                  refSalesOrderDetID: kitDet.refSalesOrderDetID
                });
                if (kitIndex === -1) {
                  vm.selectDropableKit(_.first(vm.kitList[transferLabel]), transferLabel);
                }
              }
            } else {
              vm.binList = [];
              vm.componentList = [];
            }
          }
        }).catch((error) => BaseService.getErrorLog(error)).finally(() => {
          var kitDet = _.find(vm.otherKitTransferDet, {
            assyID: assyID,
            refSalesOrderDetID: refSalesOrderDetID
          });
          if (kitDet) {
            kitDet.isRefreshed = true;
          }

          if (_.every(vm.otherKitTransferDet, {
            isRefreshed: true
          })) {
            vm.otherKitTransferDet = [];
          }
        });
      });
    };

    vm.transferKitToDept = (kitDetail) => {
      const transferItemDet = {
        transferItem: kitDetail,
        transferTo: vm.transferSection.Dept,
        refSalesOrderDetID: kitDetail.refSalesOrderDetID,
        assyID: kitDetail.assyID,
        transType: CORE.UMID_History.Trasaction_Type.KitTransfer
      };
      vm.openTransferPopup(transferItemDet);
    };

    vm.goToKitList = ($event, refSalesOrderDetID, assyID) => {
      BaseService.goToKitList(refSalesOrderDetID, assyID, null);
    };

    /** Open pop-up to check allocated kit detail*/
    vm.allocatedKit = (rowData) => {
      const data = rowData;
      data.refUMIDId = data.id;
      DialogFactory.dialogService(
        TRANSACTION.ALLOCATED_KIT_CONTROLLER,
        TRANSACTION.ALLOCATED_KIT_VIEW,
        event,
        data).then(() => { }, () => { }, (err) => BaseService.getErrorLog(err));
    };

    vm.goToKitDataList = () => {
      BaseService.goToKitDataList();
    };

    vm.goToNonUMIDStockList = ($event, warehouseID, binID) => {
      $event.stopPropagation();
      BaseService.goToNonUMIDStockList(warehouseID, binID);
    };

    vm.kitRelease = (item) => {
      if (item) {
        const salesOrderDetail = {
          SubAssy: item.assySubName,
          SalesOrderDetailId: item.refSalesOrderDetID,
          partId: item.assyMainId,
          poDate: item.poDate,
          soId: item.soId,
          poNumber: item.poNumber,
          soNumber: item.salesOrderNumber,
          assyName: item.assyName,
          rohsIcon: item.rohsIcon,
          rohs: item.rohs,
          poQty: item.poQty,
          kitQty: item.kitQty,
          assyPIDCode: item.assyPIDCode,
          SubAssyPIDCode: item.assySubPIDCode
        };

        const kitDetail = {
          salesOrderDetail: salesOrderDetail,
          refSalesOrderDetID: item.refSalesOrderDetID,
          assyID: item.assyID,
          isConsolidated: false
        };

        DialogFactory.dialogService(
          TRANSACTION.KIT_RELEASE_POPUP_CONTROLLER,
          TRANSACTION.KIT_RELEASE_POPUP_VIEW,
          event,
          kitDetail).then(() => { }, () => {
            vm.refreshKit(item.assyID, item.refSalesOrderDetID);
          }, (err) => BaseService.getErrorLog(err));
      }
    };

    vm.kitReleaseMismatchDetail = (item, droptargetModel, objConfirmation, stockDetail) => {
      let curentKitDetail = vm.selectedDetail.Kit['transferFrom'];
      if (item.transferSection === vm.transferSection.Kit) {
        curentKitDetail = item;
        vm.salesOrderDetail = {
          SubAssy: item.assySubName,
          SalesOrderDetailId: item.refSalesOrderDetID,
          partId: item.assyMainId,
          soId: item.soId,
          poNumber: item.poNumber,
          soNumber: item.salesOrderNumber,
          assyName: item.assyName,
          rohsIcon: item.rohsIcon,
          rohs: item.rohs,
          poQty: item.poQty,
          kitQty: item.kitQty,
          assyPIDCode: item.assyPIDCode,
          SubAssyPIDCode: item.assySubPIDCode,
          assyId: item.assyID
        };
      }
      const KitReleaseDetail = {
        refSalesOrderDetID: vm.salesOrderDetail.SalesOrderDetailId,
        mainAssyID: vm.salesOrderDetail.partId,
        assyID: curentKitDetail.assyID,
        selectedAssy: curentKitDetail
      };

      const kitDetail = {
        salesOrderDetail: vm.salesOrderDetail,
        refSalesOrderDetID: vm.salesOrderDetail.SalesOrderDetailId,
        assyID: curentKitDetail.assyID,
        mismatchDeptType: item.deptType ? item.deptType : null,
        isConsolidated: false
      };

      const releaseDetail = {
        kitDetail: kitDetail,
        releasePlan: curentKitDetail.nextReleasePlan,
        kitAssyDetail: KitReleaseDetail,
        isMismatchItems: true
      };

      if (item.transferSection === vm.transferSection.Bin) {
        releaseDetail.warehouseId = item.warehouseID;
        releaseDetail.binId = item.id;
        releaseDetail.callFrom = stringFormat('{0} (Transfer: {1})', vm.TrasferStockType.DeptTransfer, vm.transferSection.Bin);
      } else if (item.transferSection === vm.transferSection.WH) {
        releaseDetail.warehouseId = item.id;
        releaseDetail.binId = null;
        releaseDetail.callFrom = stringFormat('{0} (Transfer: {1})', vm.TrasferStockType.DeptTransfer, vm.transferSection.WH);
      } else if (item.transferSection === vm.transferSection.Kit && objConfirmation) {
        releaseDetail.warehouseId = null;
        releaseDetail.binId = null;

        if (stockDetail.isOnlyKitTransfer) {
          releaseDetail.callFrom = stringFormat('{0} (Transfer: {1})', vm.TrasferStockType.DeptTransfer, vm.transferSection.Kit);
        }

        if (item.nextReleasePlan && (!item.nextReleasePlan.mismatchItem || item.nextReleasePlan.mismatchItem === 0 || item.nextReleasePlan.mismatchItem < 0)) {
          releaseDetail.isMismatchItems = false;
        }
      } else {
        releaseDetail.warehouseId = null;
        releaseDetail.binId = null;
      }

      DialogFactory.dialogService(
        TRANSACTION.KIT_RELEASE_MISMATCH_INVENTORY_POPUP_CONTROLLER,
        TRANSACTION.KIT_RELEASE_MISMATCH_INVENTORY_POPUP_VIEW,
        event,
        releaseDetail).then((response) => {
          if (response) {
            if (item.transferSection === vm.transferSection.Kit) {
              vm.refreshKit(item.assyID, item.refSalesOrderDetID);
            }
          }
        }, (data) => {
          if (data) {
            if (item.transferSection === vm.transferSection.Bin) {
              if (item.otherKitName) {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.BIN_TO_WH_TRANSFER_WITH_OTHER_KIT_CONFIRMATION_MSG);
                messageContent.message = stringFormat(messageContent.message, item.name, droptargetModel.name, item.otherKitName);
                objConfirmation.messageContent = messageContent;
              } else {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.BIN_TO_WH_TRANSFER_CONFIRMATION_MSG);
                messageContent.message = stringFormat(messageContent.message, item.name, droptargetModel.name);
                objConfirmation.messageContent = messageContent;
              }
            } else if (item.transferSection === vm.transferSection.WH) {
              if (droptargetModel.id) {
                if (item.otherKitName) {
                  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.WH_TO_MATERIAL_DEPT_TRANSFER_WITH_OTHER_KIT_CONFIRMATION_MSG);
                  messageContent.message = stringFormat(messageContent.message, item.name, droptargetModel.name, item.otherKitName);
                  objConfirmation.messageContent = messageContent;
                } else {
                  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.WH_TO_WH_TRANSFER_CONFIRMATION_MSG);
                  messageContent.message = stringFormat(messageContent.message, item.name, droptargetModel.name);
                  objConfirmation.messageContent = messageContent;
                }
              } else {
                if (item.otherKitName) {
                  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.TRANSFER_WH_WITH_ALLOCATED_KIT_CONFIRMATION);
                  messageContent.message = stringFormat(messageContent.message, item.name, item.deptName, droptargetModel.name, item.otherKitName);
                  objConfirmation.messageContent = messageContent;
                } else {
                  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.WH_TO_DEPT_TRANSFER_CONFIRMATION_MSG);
                  messageContent.message = stringFormat(messageContent.message, item.name, stockDetail.toParentWHName);
                  objConfirmation.messageContent = messageContent;
                }
              }
            } else if (item.transferSection === vm.transferSection.Kit) {
              if (stockDetail && stockDetail.isOnlyKitTransfer) {
                if (item.otherKitName) {
                  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.TRANSFER_KIT_WITH_ALLOCATED_KIT_CONFIRMATION);
                  messageContent.message = stringFormat(messageContent.message, item.name, item.deptName, droptargetModel.name, item.otherKitName);
                  objConfirmation.messageContent = messageContent;
                } else {
                  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.KIT_TO_DEPT_TRANSFER_CONFIRMATION_MSG);
                  messageContent.message = stringFormat(messageContent.message, item.name, droptargetModel.name);
                  objConfirmation.messageContent = messageContent;
                }
              } else {
                vm.refreshKit(item.assyID, item.refSalesOrderDetID);
              }
            }

            if (objConfirmation) {
              vm.transferStockConfirmation(objConfirmation, stockDetail);
            }
          } else {
            vm.refreshKit(item.assyID, item.refSalesOrderDetID);
          }
        }, (err) => {
          BaseService.currentPagePopupForm = [];
          return BaseService.getErrorLog(err);
        });
    };

    const checkWHToWhAllocatedKitValidation = (sourceDetail, targetModel) => {
      if (sourceDetail && targetModel) {
        if (sourceDetail.numberTotalKit > 0) {
          const objConfirmation = {
            messageContent: null,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          if (targetModel.id) {
            if (sourceDetail.transferSection === vm.transferSection.WH) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.WH_TO_MATERIAL_DEPT_TRANSFER_WITH_OTHER_KIT_CONFIRMATION_MSG);
              messageContent.message = stringFormat(messageContent.message, sourceDetail.name, targetModel.name, sourceDetail.otherKitName);
              objConfirmation.messageContent = messageContent;
            } else if (sourceDetail.transferSection === vm.transferSection.Bin) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.BIN_TO_WH_TRANSFER_WITH_OTHER_KIT_CONFIRMATION_MSG);
              messageContent.message = stringFormat(messageContent.message, sourceDetail.name, targetModel.name, sourceDetail.otherKitName);
              objConfirmation.messageContent = messageContent;
            }
          } else {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.TRANSFER_WH_WITH_ALLOCATED_KIT_CONFIRMATION);
            messageContent.message = stringFormat(messageContent.message, sourceDetail.name, sourceDetail.deptName, targetModel.name, sourceDetail.otherKitName);
            objConfirmation.messageContent = messageContent;
          }
          DialogFactory.messageConfirmDialog(objConfirmation).then((yes) => {
            if (yes) {
              checkWHToWhUnallocatedUMIDValidation(sourceDetail, targetModel);
            }
          }, () => { }).catch((error) => BaseService.getErrorLog(error));
        } else {
          checkWHToWhUnallocatedUMIDValidation(sourceDetail, targetModel);
        }
      }
    };

    const checkWHToWhUnallocatedUMIDValidation = (sourceDetail, targetModel) => {
      if (sourceDetail && targetModel) {
        if (sourceDetail.unallocatedUMID > 0) {
          if (vm.filter.transferOption === vm.TrasferStockType.StockTransferToOtherDept) {
            // if (sourceDetail.numberTotalKit > 0) {
            vm.unallocatedXferHistoryData = {};
            let messageContent = null;

            if (vm.enableUnallocatedUMIDTransfer) {
              if (sourceDetail.transferSection === vm.transferSection.WH) {
                messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.TRANSFER_WH_UNALLOCATED_UMID_WITH_PASSWORD_CONFIRMATION);
                messageContent.message = stringFormat(messageContent.message, sourceDetail.name, sourceDetail.deptName, targetModel.deptName ? targetModel.deptName : targetModel.name);
              } else if (sourceDetail.transferSection === vm.transferSection.Bin) {
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
                    vm.unallocatedXferHistoryData.category = CORE.UMID_History.Category.Tranfer_Stock_Dept_To_Dept;
                    if (sourceDetail.transferSection === CORE.TransferSection.WH && targetModel.transferSection === CORE.TransferSection.WH) {
                      vm.unallocatedXferHistoryData.transactionType = CORE.UMID_History.Trasaction_Type.WH_WH_Transfer;
                    } else if (sourceDetail.transferSection === CORE.TransferSection.WH && targetModel.transferSection === CORE.TransferSection.Dept) {
                      vm.unallocatedXferHistoryData.transactionType = CORE.UMID_History.Trasaction_Type.WH_Dept_Transfer;
                    } else if (sourceDetail.transferSection === CORE.TransferSection.Bin && targetModel.transferSection === CORE.TransferSection.WH) {
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
            } else if (!vm.enableUnallocatedUMIDTransfer) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_RIGHT_FOR_FEATURE);
              messageContent.message = stringFormat(messageContent.message, CORE.FEATURE_NAME.UnallocatedUMIDTransfer);
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              DialogFactory.messageAlertDialog(model);
            }
            // }
          } else {
            let messageContent = null;
            if (sourceDetail.transferSection === vm.transferSection.WH) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.TRANSFER_WH_WITH_UNALLOCATED_UMID_EROR);
              messageContent.message = stringFormat(messageContent.message, sourceDetail.name, sourceDetail.deptName, targetModel.deptName ? targetModel.deptName : targetModel.name);
            } else if (sourceDetail.transferSection === vm.transferSection.Bin) {
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
        transferType: vm.filter.transferOption,
        unallocatedXferHistoryData: targetModel.unallocatedXferHistoryData || null
      };

      if (sourceDetail.transferSection === vm.transferSection.WH && targetModel.transferSection === vm.transferSection.WH) {
        stockDetail.fromWHID = sourceDetail.id;
        if (vm.filter.transferOption === vm.TrasferStockType.StockTransferToOtherDept) {
          if (targetModel.id) {
            stockDetail.transType = CORE.UMID_History.Trasaction_Type.WH_WH_Transfer;
            stockDetail.toWHID = targetModel.id;
          } else {
            stockDetail.transType = CORE.UMID_History.Trasaction_Type.WH_Dept_Transfer;
            stockDetail.toParentWH = targetModel.parentWHID;
          }
        }
      } else if (sourceDetail.transferSection === vm.transferSection.Bin && targetModel.transferSection === vm.transferSection.WH) {
        stockDetail.transType = CORE.UMID_History.Trasaction_Type.Bin_WH_Transfer;
        stockDetail.fromBinID = sourceDetail.id;
        stockDetail.toWHID = targetModel.id;
      }
      vm.transferStock(stockDetail);
    };

    vm.selectAllUMID = () => {
      if (vm.isAllSelect) {
        _.map(vm.componentList.transferFrom, (data) => {
          if (data.id) {
            data.isSelect = true;
            vm.anyItemSelect = true;
          }
        });
        // vm.anyItemSelect = true;
      } else {
        _.map(vm.componentList.transferFrom, (data) => {
          data.isSelect = false;
        });
        vm.anyItemSelect = false;
      }
    };

    vm.selectUMID = (item) => {
      if (item.isSelect) {
        const checkAnyDeSelect = _.some(vm.componentList.transferFrom, (data) => data.isSelect === false && data.id);
        if (checkAnyDeSelect) {
          vm.isAllSelect = false;
        } else {
          vm.isAllSelect = true;
        }
      } else {
        vm.isAllSelect = false;
      }
      vm.anyItemSelect = _.some(vm.componentList.transferFrom, (data) => data.isSelect === true);
    };

    vm.selectKitUMID = (option) => {
      vm.transferUMIDList = [];
      switch (option) {
        case 1:
          if (vm.isBelongToKit) {
            vm.isNotBelongToKit = false;
            vm.isBelongToAnyKit = false;
            vm.transferUMIDList = _.filter(vm.componentList.transferFrom, (data) => data.isBelongsToSameKit);
          }
          break;
        case 2:
          if (vm.isBelongToAnyKit) {
            vm.isBelongToKit = false;
            vm.isNotBelongToKit = false;
            if (vm.filter.transferOption === vm.TrasferStockType.KitTransfer || vm.filter.transferOption === vm.TrasferStockType.DeptTransfer) {
              vm.transferUMIDList = _.filter(vm.componentList.transferFrom, (data) => data.allocatedToKits && !data.isBelongsToSameKit);
            } else {
              vm.transferUMIDList = _.filter(vm.componentList.transferFrom, (data) => data.allocatedToKits);
            }
          }
          break;
        case 3:
          if (vm.isNotBelongToKit) {
            vm.isBelongToKit = false;
            vm.isBelongToAnyKit = false;
            vm.transferUMIDList = _.filter(vm.componentList.transferFrom, (data) => !data.allocatedToKits);
          }
          break;
      }
    };

    // check part selected or not
    vm.checkPartForSearch = () => {
      const UMIDList = _.filter(vm.componentList.transferFrom, (item) => item.warehouseType === vm.warehouseType.SmartCart.key);
      if (UMIDList.length > 0) {
        let result = true;
        const objResult = _.find(UMIDList, (data) => data.isSelect);
        if (objResult) {
          result = false;
        }
        return result;
      } else {
        return true;
      }
    };

    vm.changeEvent = (button, ev) => {
      if (button) {
        vm.searchbyUMID(ev);
      } else {
        vm.cancelSearch(ev);
      }
    };
    // Inoauto Search Functionality Start
    // search by umid api call from here on changeof checkbox
    vm.searchbyUMID = (ev) => {
      vm.event = ev;
      const dept = getLocalStorageValue(vm.loginUser.employee.id);
      vm.selectedList = _.filter(vm.componentList.transferFrom, (fltr) => fltr.isSelect);
      if (_.find(vm.selectedList, (selectDept) => selectDept.departmentName !== dept.department.Name) && !vm.isComapnyLevel) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.INOAUTO_DEPARTMENT_VALIDATION);
        messageContent.message = stringFormat(messageContent.message, dept.department.Name);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
        vm.showStatus = false;
        vm.transactionID = null;
        vm.clickButton = false;
      } else {
        checkColorAvailibility(vm.isComapnyLevel ? 0 : dept.department.ID);
      }
    };
    // check color availability to prompt in cart
    function checkColorAvailibility(departmentID) {
      ReceivingMaterialFactory.getPromptIndicatorColor().query({
        pcartMfr: CORE.InoautoCart,
        prefDepartmentID: departmentID
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
          DialogFactory.messageAlertDialog(model);
          vm.showStatus = false;
          vm.transactionID = null;
          vm.clickButton = false;

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
    vm.goToUMIDDetail = (data) => BaseService.goToUMIDDetail(data.id);

    // Connect to Socket
    function connectSocket() {
      socketConnectionService.on(CORE.Socket_IO_Events.InoAuto.updateUMIDRequest, updateUMIDRequest);
      socketConnectionService.on(CORE.Socket_IO_Events.InoAuto.updateCancelRequest, updateCancelRequestStatus);
      socketConnectionService.on(CORE.Socket_IO_Events.InoAuto.updateForceDeliverRequest, updateForceDeliverRequest);
    }
    connectSocket();

    socketConnectionService.on('reconnect', () => {
      connectSocket();
    });

    function removeSocketListener() {
      socketConnectionService.removeListener(CORE.Socket_IO_Events.InoAuto.updateUMIDRequest, updateUMIDRequest);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.InoAuto.updateCancelRequest, updateCancelRequestStatus);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.InoAuto.updateForceDeliverRequest, updateForceDeliverRequest);
    }

    $scope.$on('$destroy', () => {
      cancelRequest();
      removeUMIDStatus();
      removeSocketListener();
    });
    // on disconnect socket
    socketConnectionService.on('disconnect', () => {
      // Remove socket listeners
      removeSocketListener();
    });


    // umid pick request
    function updateForceDeliverRequest(request) {
      if (request.OriginalTransactionID === vm.transactionID) {
        const objUMID = _.find(vm.componentList.transferFrom, (umid) => umid.uid === request.UID);
        if (objUMID) {
          objUMID.ledColorCssClass = null;
          objUMID.ledColorName = null;
          objUMID.inovexStatus = CORE.InoAuto_Search_Status.InTransit;
          objUMID.isTransit = 'Yes';
        }
      }
    }
    // once umid pick will update umid
    function updateUMIDRequest(response) {
      if (vm.transactionID === response.response.TransactionID && !vm.showStatus) {
        const selectedPkg = response.response.ChosenPackages;
        const notFoundedPkg = response.response.UIDNotFound;
        const notAvailablePkg = response.response.UnavailablePackages;
        // add color for selected pkg Department
        _.each(selectedPkg, (item) => {
          var objUMID = _.find(vm.componentList.transferFrom, (umid) => umid.uid === item.UID);
          if (objUMID) {
            objUMID.ledColorCssClass = vm.promptColorDetails.ledColorCssClass;
            objUMID.ledColorName = vm.promptColorDetails.ledColorName;
          }
        });
        _.map(selectedPkg, funChoosen);
        _.map(notFoundedPkg, funNotFound);
        _.map(notAvailablePkg, funNotAvailable);
        vm.showStatus = true;
        if (selectedPkg.length === 0) {
          let messageContent = null;
          if (notAvailablePkg.length === 0) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.INOAUTO_UIDNOTFOUND);
          } else {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.INOAUTO_NOTAVAILABLE);
          }
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model, commonCancelFunction);
        }
      }
    }
    // update status chhosen for all choose umid
    function funChoosen(row) {
      const Chosen = _.find(vm.componentList.transferFrom, (Chosen) => Chosen.uid === row.UID);
      if (Chosen) {
        Chosen.inovexStatus = CORE.InoAuto_Search_Status.Chosen;
      }
    }
    // update status NotFound for all umid which are not in inovaxe
    function funNotFound(row) {
      var notFound = _.find(vm.componentList.transferFrom, (notFound) => notFound.uid === row);
      if (notFound) {
        notFound.inovexStatus = CORE.InoAuto_Search_Status.NotFound;
      }
    }
    // update status NotAvailable for all umid which are already in use
    function funNotAvailable(row) {
      var notAvailable = _.find(vm.componentList.transferFrom, (notAvailable) => notAvailable.uid === row.UID);
      if (notAvailable) {
        notAvailable.inovexStatus = CORE.InoAuto_Search_Status.NotAvailable;
      }
    }
    // cancel request for search part
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
    // cancel Request for search by umid
    vm.cancelSearch = () => {
      cancelRequest();
    };
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
      DialogFactory.messageAlertDialog(model, callbackCancel);
    }
    // common function to clear
    function commonCancelFunction() {
      _.map(vm.componentList.transferFrom, funUMIDList);
      vm.showStatus = false;
      vm.transactionID = null;
      vm.clickButton = false;
    }

    function callbackCancel() {
      vm.open = false;
    }
    // remove assign color from umid list
    function funUMIDList(row) {
      row.inovexStatus = null;
      row.ledColorCssClass = null;
      row.ledColorName = null;
    }

    // update umid record
    const removeUMIDStatus = $rootScope.$on(PRICING.EventName.RemoveUMIDFrmList, (name, data) => {
      const umidStatus = _.find(vm.componentList.transferFrom, (item) => item.uid === data.UID);
      if (umidStatus) {
        umidStatus.binName = data.tolocation;
        umidStatus.warehouseName = data.towarehouse;
        umidStatus.departmentName = data.toparentWarehouse;
        funUMIDList(umidStatus);
      }
    });

    vm.uidTranfer = (event, data, updateStock) => {
      let label;
      if (vm.isBelongToKit) {
        label = stringFormat('"{0}"', vm.LabelConstant.TransferStock.BelongToKit);
      } else if (vm.isBelongToAnyKit) {
        label = stringFormat('"{0}"', vm.LabelConstant.TransferStock.BelongToAnyKit);
      } else {
        label = stringFormat('"{0}"', vm.LabelConstant.TransferStock.NotBelongToKit);
      }
      const transferUMIDDet = {
        uid: data && data.uid,
        isBulkTranfer: true,
        updateStock: updateStock,
        isBelongToKit: vm.isBelongToKit || vm.isBelongToAnyKit,
        isNotBelongToKit: vm.isNotBelongToKit,
        transferUMIDList: vm.transferUMIDList,
        label: label
      };
      DialogFactory.dialogService(
        TRANSACTION.UID_TRANSFER_CONTROLLER,
        TRANSACTION.UID_TRANSFER_VIEW,
        event,
        transferUMIDDet).then(() => {
        }, () => {
          if (vm.filter.transferOption === vm.TrasferStockType.StockTransfer || vm.filter.transferOption === vm.TrasferStockType.StockTransferToOtherDept) {
            if (vm.selectedDetail && vm.selectedDetail.WH && vm.selectedDetail.WH['transferFrom']) {
              vm.refreshWH('transferFrom', vm.selectedDetail.WH['transferFrom'].id, true);
            }
          } else if (vm.filter.transferOption === vm.TrasferStockType.KitTransfer || vm.filter.transferOption === vm.TrasferStockType.DeptTransfer) {
            if (vm.salesOrderDetail) {
              vm.refreshKit(vm.salesOrderDetail.assyId, vm.salesOrderDetail.SalesOrderDetailId);
            }
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.binTransfer = () => {
      DialogFactory.dialogService(
        TRANSACTION.BIN_TRANSFER_POPUP_CONTROLLER,
        TRANSACTION.BIN_TRANSFER_POPUP_VIEW,
        null,
        null).then(() => { }, () => {
          if (vm.filter.transferOption === vm.TrasferStockType.StockTransfer || vm.filter.transferOption === vm.TrasferStockType.StockTransferToOtherDept) {
            if (vm.selectedDetail && vm.selectedDetail.WH && vm.selectedDetail.WH['transferFrom']) {
              vm.refreshWH('transferFrom', vm.selectedDetail.WH['transferFrom'].id, true);
            }
          } else if (vm.filter.transferOption === vm.TrasferStockType.KitTransfer || vm.filter.transferOption === vm.TrasferStockType.DeptTransfer) {
            if (vm.salesOrderDetail) {
              vm.refreshKit(vm.salesOrderDetail.assyId, vm.salesOrderDetail.SalesOrderDetailId);
            }
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.checkFeasibility = (item) => {
      const salesOrderDetail = {
        SubAssy: item.assySubName,
        SalesOrderDetailId: item.refSalesOrderDetID,
        partId: item.assyMainId,
        poDate: item.poDate,
        soId: item.soId,
        poNumber: item.poNumber,
        soNumber: item.salesOrderNumber,
        assyName: item.assyName,
        rohsIcon: item.rohsIcon,
        rohs: item.rohs,
        poQty: item.poQty,
        kitQty: item.kitQty,
        assyPIDCode: item.assyPIDCode,
        SubAssyPIDCode: item.assySubPIDCode
      };

      var feasibilityDetail = {
        refSalesOrderDetID: item.refSalesOrderDetID,
        assyID: item.assyID,
        inputQty: item.totalAssyBuildQty,
        salesOrderDetail: salesOrderDetail
      };

      DialogFactory.dialogService(
        TRANSACTION.KIT_FEASIBILITY_POPUP_CONTROLLER,
        TRANSACTION.KIT_FEASIBILITY_POPUP_VIEW,
        event,
        feasibilityDetail).then(() => { }, () => {

        }, (err) => BaseService.getErrorLog(err));
    };

    //get search time out
    const getSearchTime = () => {
      vm.cgBusyLoading = MasterFactory.getSelectedGlobalSettingKeyValues().query({ allKeys: [TRANSACTION.AUDITPAGE.SearchRequestTimeout] }).$promise.then((response) => {
        if (response && response.data) {
          _.each(response.data, (item) => {
            switch (item.key) {
              case TRANSACTION.AUDITPAGE.SearchRequestTimeout:
                vm.TimeOut = item.values ? parseInt(item.values) : CORE.CANCEL_REQUSET_TIMEOUT;
                break;
            }
          });
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    getSearchTime();

    const validateAndTransferKit = (sourceDetail, targetDetail, stockDetail, confirmationText) => {
      vm.cgBusyLoading = TransferStockFactory.getKitWarehouseDetail({
        refSalesOrderDetID: stockDetail.refSalesOrderDetID,
        assyID: stockDetail.assyID,
        fromParentWHID: stockDetail.fromParentWH
      }).query().$promise.then((res) => {
        if (res.data) {
          // Get list of permanent warehouse
          const objDept = _.find(vm.fromDeptList, {
            id: targetDetail.deptID
          });
          const permenantWarehouse = _.uniq(
            _.union(
              _.map(_.filter(res.data.transferKitWHList, {
                isPermanentWH: 1
              }), 'warehouseName'),
              _.map(_.filter(res.data.kitList, {
                isPermanentWH: 1
              }), 'warehouseName'),
              _.map(_.filter(res.data.UMIDList, {
                isPermanentWH: 1
              }), 'warehouseName')
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
          } else if (res.data.nonUMIDList.length > 0) {
            // If warehouse contains non UMID stock then restrict user to transfer kit.
            const warehouseBinList = _.map(_.groupBy(res.data.nonUMIDList, 'warehouseName'), (item, index) => `${index} [${_.map(item, 'binName')}]`) || '';

            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NON_UMID_STOCK_EXISTS_WITH_KIT);
            messageContent.message = stringFormat(messageContent.message, sourceDetail.name, objDept ? objDept.name : '', warehouseBinList);

            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model);
          } else if (res.data.kitList.length > 0) {
            const KitString = _.map(_.map(res.data.kitList, (data) => data.kitString = stringFormat('{0}###{1}###{2}', data.refSalesOrderDetID, data.assyID, data.name))).join('@@@');

            const curKitString = stringFormat('{0}###{1}###{2}', sourceDetail.refSalesOrderDetID, sourceDetail.assyID, sourceDetail.name);
            const otherKitName = _.map(BaseService.generateRedirectLinkForKit(KitString)).join(', ');
            const currentKitName = BaseService.generateRedirectLinkForKit(curKitString);

            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.OTHER_KIT_STOCK_EXISTS_WITH_KIT);
            messageContent.message = stringFormat(messageContent.message, currentKitName, otherKitName, objDept ? objDept.name : '');

            const model = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
            };

            DialogFactory.messageConfirmDialog(model).then((yes) => {
              if (yes) {
                vm.transferStock(stockDetail);
              }
            }, () => { }).catch((error) => BaseService.getErrorLog(error));
          } else {
            vm.transferStockConfirmation(confirmationText, stockDetail);
          }
        } else {
          vm.transferStockConfirmation(confirmationText, stockDetail);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.scrollWarehouse = (transferOption) => {
      if (vm.warehouseList[transferOption].length < vm.warehouseFilter[transferOption].recordCount) {
        vm.warehouseFilter[transferOption].page += 1;
        vm.getActiveWarehouse(transferOption, true);
      }
    };
    vm.scrollBin = (transferOption) => {
      if (vm.binList[transferOption].length < vm.binFilter[transferOption].recordCount) {
        vm.binFilter[transferOption].page += 1;
        vm.getActiveBin(transferOption, true);
      }
    };
    //vm.scrollUMID = (transferOption) => {
    //  /* if (vm.componentList[transferOption].length < vm.uidFilter[transferOption].recordCount) {
    //    vm.uidFilter[transferOption].page += 1;
    //    vm.getUIDDetail(transferOption, true);
    //  }*/
    //};
    vm.scrollKit = (transferOption) => {
      if (vm.kitList[transferOption].length < vm.kitFilter[transferOption].recordCount) {
        vm.kitFilter[transferOption].page += 1;
        vm.getKitToTransferStock(transferOption, true);
      }
    };
    vm.resetInfiniteScrollWarehouse = (transferOption) => {
      if (transferOption) {
        vm.warehouseFilter[transferOption].page = CORE.UIGrid.Page();
        vm.warehouseFilter[transferOption].pageSize = 10;
      }
    };
    vm.resetInfiniteScrollBin = (transferOption) => {
      vm.binFilter[transferOption].page = CORE.UIGrid.Page();
      vm.binFilter[transferOption].pageSize = 10;
    };
    vm.resetInfiniteScrollKit = (transferOption) => {
      vm.kitFilter[transferOption].page = CORE.UIGrid.Page();
      vm.kitFilter[transferOption].pageSize = 10;
    };
    vm.resetInfiniteScrollUMID = (transferOption) => {
      vm.uidFilter[transferOption].page = 0; // CORE.UIGrid.Page();
      vm.uidFilter[transferOption].pageSize = 10;
    };
    vm.resetInfiniteScroll = (transferOption) => {
      if (transferOption) {
        vm.warehouseFilter[transferOption].page = vm.binFilter[transferOption].page = vm.kitFilter[transferOption].page = CORE.UIGrid.Page();
        vm.warehouseFilter[transferOption].pageSize = vm.binFilter[transferOption].pageSize = vm.kitFilter[transferOption].pageSize = 10;
      } else {
        const options = ['transferFrom', 'transferTo'];
        _.each(options, (item) => {
          vm.warehouseFilter[item].page = vm.binFilter[item].page = vm.kitFilter[item].page = CORE.UIGrid.Page();
          vm.warehouseFilter[item].pageSize = vm.binFilter[item].pageSize = vm.kitFilter[item].pageSize = 10;
        });
      }
    };
  }
})();
