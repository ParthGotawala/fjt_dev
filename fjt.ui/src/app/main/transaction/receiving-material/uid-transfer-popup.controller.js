(function () {
  'use strict';

  angular
    .module('app.transaction.receivingmaterial')
    .controller('UIDTransferPopUpController', UIDTransferPopUpController);

  function UIDTransferPopUpController($mdDialog, $timeout, CORE, TRANSACTION, DialogFactory, BaseService, $scope, data, $rootScope, PRICING, $state, TRAVELER,
    ReceivingMaterialFactory, TransferStockFactory, ComponentFactory, $q, $filter, $window, USER, ManufacturerFactory, MasterFactory, CONFIGURATION, KitAllocationFactory, WarehouseBinFactory, socketConnectionService) {
    const vm = this;
    var setTimeoutActivity;
    var activityStartTime = '';
    vm.currentState = $state.current.name;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.UMID_MAX_LENGTH = CORE.UMID_MAX_LENGTH;
    vm.UMIDStockType = CORE.UMIDStockType;
    vm.umidStock = vm.UMIDStockType.All.key;
    vm.uidTransfer = {};
    vm.isUIDDisable = false;
    vm.isWHBinDisable = false;
    vm.umidStockDisable = false;
    vm.LabelConstant = CORE.LabelConstant;
    vm.DefaultDateFormat = _dateTimeDisplayFormat;
    vm.CountMaterialPercentage = 0;
    vm.CORE_SystemGenratedWarehouseBin = CORE.SystemGenratedWarehouseBin;
    vm.scanVerifyUMIDDisable = false;
    const COUNT_MATERIAL_CONFIRMATION = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.COUNT_MATERIAL_CONFIRMATION);
    let confirmUnAllocatedUMIDValidation = false;
    vm.enableUnallocatedUMIDTransfer = false;
    vm.uidTransfer.isConformUponSaving = true;
    vm.uidTransfer.isMustSelectKit = true;
    vm.isOneTimeValidationForAccess = false;
    vm.isLockBin = false;
    vm.accessLevelDetail = {};
    const loginUser = BaseService.loginUser;
    const defaultRoleDetails = _.find(loginUser.roles, { id: loginUser.defaultLoginRoleID });
    vm.Notes = CORE.COUNT_MATERIAL_POPUP_NOTES;
    vm.warningMessage = null;
    vm.dateTimeDisplayFormat = _dateTimeDisplayFormat;
    vm.isMustKitSelectDisable = false;
    vm.uidTransfer.isSelectionMaterial = false;
    vm.isFromUMID = false;
    vm.Kit_Release_Status = CORE.Kit_Release_Status;
    vm.MEASUREMENT_TYPES_COUNT = CORE.MEASUREMENT_TYPES.COUNT;
    vm.bulkTranferHint = null;
    if (vm.currentState === TRANSACTION.TRANSACTION_TRANSFER_STOCK_STATE) {
      vm.category = CORE.UMID_History.Category.Xfer_Bulk_Material;
    } else if (vm.currentState === TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_LIST_STATE) {
      vm.category = CORE.UMID_History.Category.UMID_List;
    } else if (vm.currentState === TRANSACTION.TRANSACTION_MANAGERECEIVINGMATERIAL_STATE) {
      vm.category = CORE.UMID_History.Category.UMID_Management;
    } else if (vm.currentState === TRANSACTION.TRANSACTION_KIT_ALLOCATION_STATE) {
      vm.category = CORE.UMID_History.Category.Kit_Allocation;
    } else if (vm.currentState === TRANSACTION.TRANSACTION_KIT_PREPARATION_STATE) {
      vm.category = CORE.UMID_History.Category.Kit_Preparation;
    } else if (vm.currentState === TRAVELER.TRAVELER_MANAGE_STATE) {
      vm.category = CORE.UMID_History.Category.SMP_Machine_Setup_Verification;
    }
    setFocus('ScanUID');
    function getAccessLevel() {
      return ManufacturerFactory.getAcessLeval().query({ access: CORE.ROLE_ACCESS.VERIFICATION_ROLE_ACCESS }).$promise.then((response) => {
        if (response && response.data) {
          vm.accessLevelDetail.accessRole = response.data.name;
          vm.accessLevelDetail.accessLevel = response.data.accessLevel;
          vm.accessLevelDetail.allowAccess = false;
          vm.accessLevelDetail.isValidate = true;
          if (defaultRoleDetails.accessLevel <= response.data.accessLevel) {
            vm.accessLevelDetail.allowAccess = true;
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }
    getAccessLevel();

    const getAllRights = () => {
      vm.enableUnallocatedUMIDTransfer = BaseService.checkFeatureRights(CORE.FEATURE_NAME.UnallocatedUMIDTransfer);
      if (vm.enableUnallocatedUMIDTransfer === null || vm.enableUnallocatedUMIDTransfer === undefined) {
        getAllRights(); //put for hard reload option as it will not get data from feature rights
      }
    };
    getAllRights();

    const CartOnlineImagePath = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, 'online.png');
    const CartOfflineImagePath = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, 'offline.png');
    vm.isShowUserStatus = _.find(loginUser.featurePageDetail, (item) => item.featureName === CORE.ROLE_ACCESS.SmartCartUser);
    //Get configured consume material percentage
    MasterFactory.getSelectedGlobalSettingKeyValues().query({ allKeys: CONFIGURATION.SETTING.CountMaterialPercentage }).$promise.then((response) => {
      if (response.data) {
        const objKeyDetail = _.find(response.data, { key: CONFIGURATION.SETTING.CountMaterialPercentage });
        if (objKeyDetail) {
          vm.CountMaterialPercentage = Number(objKeyDetail.values);
        }
      }
    }).catch((error) => BaseService.getErrorLog(error));
    vm.isNotDisable = false;
    vm.modalData = data || {};
    if (vm.modalData && vm.modalData.uid) {
      vm.isNotDisable = true;
    }
    let UIDData = {};
    let WHBinData = {};
    const UIDTransferData = {};
    vm.transferStockType = CORE.TransferStockType;
    vm.adjustMaterialType = CORE.AdjustMaterialType;
    vm.allocatedToKit = [];
    vm.transferredUMID = {};

    if (vm.modalData) {
      vm.uidTransfer.imageURL = BaseService.getPartMasterImageURL(null, null);
      if (vm.modalData.updateStock) {
        vm.modalData.transferStockType = vm.transferStockType.Remaining;
      }

      if (vm.modalData.uid) {
        vm.uidTransfer.ScanUID = vm.modalData.uid;
      }
    }

    vm.screenName = vm.modalData.updateStock ? TRANSACTION.UMID_STATUS_LIST_SCREEN.UMID_Stock_Transfer : TRANSACTION.UMID_STATUS_LIST_SCREEN.UMID_Transfer;
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    //Scan UMID
    vm.scanUID = ($event) => {
      if (vm.umidStock === vm.UMIDStockType.CustomerConsignedStock.key && !vm.autoCompleteCustomer.keyColumnId) {
        setFocusByName(vm.autoCompleteCustomer.inputName);
        return;
      }

      $timeout(() => {
        if ($event.keyCode === 13) {
          scanUID($event);
        }
      }, true);
      /** Prevent enter key submit event */
      preventInputEnterKeyEvent($event);
    };

    if (vm.uidTransfer.ScanUID) {
      scanUID();
    }

    function scanUID(isClear) {
      if (vm.uidTransfer.ScanUID) {
        vm.cgBusyLoading = ReceivingMaterialFactory.get_Component_Sid_ByUID().query({ id: vm.uidTransfer.ScanUID }).$promise.then((res) => {
          if (res && res.data) {
            UIDData = res.data;
            if (!vm.modalData.uid && !vm.modalData.updateStock && vm.modalData.transferUMIDList && vm.modalData.transferUMIDList.length > 0 && vm.modalData.isBulkTranfer && !(_.some(vm.modalData.transferUMIDList, (data) => UIDData.uid === data.uid))) {
              vm.bulkTranferHint = vm.modalData.isBelongToKit ? angular.copy(vm.CORE_MESSAGE_CONSTANT.BELONG_TO_KIT) : angular.copy(vm.CORE_MESSAGE_CONSTANT.NOT_BELONG_TO_KIT);
              const hintMessage = stringFormat(angular.copy(vm.CORE_MESSAGE_CONSTANT.TRANSFER_SELECTED_UMID), vm.modalData.label);
              vm.bulkTranferHint = stringFormat(vm.bulkTranferHint, hintMessage);
              if (vm.isFromUMID && vm.isLockBin && !(vm.modalData.uid || vm.scanFromList)) {
                vm.clearUMIDForLockBin();
              } else {
                vm.clearUMID(true);
              }
            } else if (!vm.modalData.uid && vm.umidStock === vm.UMIDStockType.CustomerConsignedStock.key && !UIDData.customerConsign) {
              vm.stockErrorMessage = angular.copy(stringFormat(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.TRANSFER_MATERIAL_STOCK_TYPE_MISMATCH.message, vm.UMIDStockType.CustomerConsignedStock.value.toLowerCase()));
              vm.clearUMID(true);
            } else if (!vm.modalData.uid && vm.umidStock === vm.UMIDStockType.CustomerConsignedStock.key && UIDData.customerConsign && UIDData.customerID !== vm.autoCompleteCustomer.keyColumnId) {
              vm.stockErrorMessage = angular.copy(stringFormat(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.TRANSFER_MATERIAL_UMID_CUSTOMER_MISMATCH.message, vm.UMIDStockType.CustomerConsignedStock.value.toLowerCase()));
              vm.clearUMID(true);
            } else if (!vm.modalData.uid && vm.umidStock === vm.UMIDStockType.InternalStock.key && UIDData.customerConsign) {
              vm.clearUMID(true);
              vm.stockErrorMessage = angular.copy(stringFormat(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.TRANSFER_MATERIAL_STOCK_TYPE_MISMATCH.message, vm.UMIDStockType.InternalStock.value.toLowerCase()));
            } else if (UIDData.inFeederCnt > 0 && vm.modalData.updateStock) {
              /// show Feeder list on count material case
              const data = angular.copy(UIDData);
              DialogFactory.dialogService(
                TRAVELER.UMID_ACTIVE_FEEDER_MODAL_CONTROLLER,
                TRAVELER.UMID_ACTIVE_FEEDER_MODAL_VIEW,
                null,
                data).then(() => {
                  vm.clearUMID(true);
                }, () => {
                  vm.clearUMID(true);
                }).catch((err) => BaseService.getErrorLog(err));
            }
            else {
              vm.stockErrorMessage = null;
              vm.bulkTranferHint = null;
              vm.umidStockDisable = vm.modalData.uid ? false : true;
              vm.isUIDDisable = true;
              vm.scanFromList = false;
              vm.uidTransfer.Warehouse = UIDData.binMst && UIDData.binMst.warehousemst ? UIDData.binMst.warehousemst.Name : null;
              vm.uidTransfer.WarehouseID = UIDData.binMst && UIDData.binMst.WarehouseID ? UIDData.binMst.WarehouseID : null;
              vm.uidTransfer.binID = UIDData.binID;
              vm.uidTransfer.bin = UIDData.binMst ? UIDData.binMst.Name : null;
              vm.uidTransfer.department = UIDData.binMst && UIDData.binMst.warehousemst && UIDData.binMst.warehousemst.parentWarehouseMst ? UIDData.binMst.warehousemst.parentWarehouseMst.Name : null;
              vm.uidTransfer.orgqty = UIDData.orgqty;
              vm.uidTransfer.pkgQty = UIDData.pkgQty;
              vm.uidTransfer.orgPkgUnit = UIDData.orgPkgUnit;
              vm.uidTransfer.pkgUnit = UIDData.pkgUnit;
              vm.uidTransfer.spq = UIDData.spq;
              vm.uidTransfer.uom = UIDData.uom;
              vm.uidTransfer.unitName = UIDData.component && UIDData.component.UOMs ? UIDData.component.UOMs.unitName : null;
              vm.uidTransfer.currentPkgQty = UIDData.pkgQty;
              vm.uidTransfer.currentPkgUnit = UIDData.pkgUnit;
              vm.uidTransfer.stockInventoryType = UIDData.stockInventoryType;
              vm.uidTransfer.packingSlipDetailID = UIDData.componentSidStockPackingDetail && UIDData.componentSidStockPackingDetail.refPackingSlipDetailID ? UIDData.componentSidStockPackingDetail.refPackingSlipDetailID : null;
              vm.uidTransfer.woID = UIDData.woID;
              if (vm.modalData.transferStockType && vm.modalData.transferStockType === vm.transferStockType.Expired || vm.modalData.transferStockType === vm.transferStockType.ZeroOut) {
                vm.uidTransfer.consumedPkgQty = UIDData.pkgQty;
                vm.uidTransfer.consumedPkgUnit = UIDData.pkgUnit;
                vm.uidTransfer.remainingPkgQty = 0;
                vm.uidTransfer.remainingPkgUnit = 0;
              } else {
                vm.uidTransfer.consumedPkgQty = null;
                vm.uidTransfer.consumedPkgUnit = null;
              }
              vm.uidTransfer.componentID = UIDData.component.id;
              vm.uidTransfer.mfgType = UIDData.component.mfgCodemst.mfgType;
              vm.uidTransfer.remainingAdjustPkgQty = null;
              vm.uidTransfer.remainingAdjustPkgUnit = null;
              vm.uidTransfer.remainingAdjustPkgQtyDiff = null;
              vm.uidTransfer.remainingAdjustPkgUnitDiff = null;
              vm.uidTransfer.fromDeptID = UIDData.binMst && UIDData.binMst.warehousemst && UIDData.binMst.warehousemst.parentWarehouseMst ? UIDData.binMst.warehousemst.parentWarehouseMst.id : null;
              vm.uidTransfer.umidId = UIDData.id;
              vm.uidTransfer.umidName = UIDData.uid;
              vm.uidTransfer.mfgCode = BaseService.getMfgCodeNameFormat(UIDData.component.mfgCodemst.mfgCode, UIDData.component.mfgCodemst.mfgName);
              vm.uidTransfer.mfgPN = UIDData.component.mfgPN;
              vm.uidTransfer.PIDCode = UIDData.component.PIDCode;
              vm.uidTransfer.mfgCodeID = UIDData.component.mfgCodemst.id;
              vm.uidTransfer.rfq_rohsmst = UIDData.component.rfq_rohsmst;
              vm.uidTransfer.mfgPNDescription = UIDData.component.mfgPNDescription ? UIDData.component.mfgPNDescription : '-';
              vm.uidTransfer.rfq_mountingType = UIDData.component.rfqMountingType ? UIDData.component.rfqMountingType.name : '-';
              vm.uidTransfer.rfq_packageCaseType = UIDData.component.rfq_packagecasetypemst ? UIDData.component.rfq_packagecasetypemst.name : (UIDData.component.partPackage ? UIDData.component.partPackage : '-');
              vm.uidTransfer.imageURL = BaseService.getPartMasterImageURL(UIDData.component.documentPath, UIDData.component.imageURL);
              vm.uidTransfer.uomClassID = UIDData.component && UIDData.component.UOMs && UIDData.component.UOMs.measurementType && UIDData.component.UOMs.measurementType.id ? UIDData.component.UOMs.measurementType.id : null;
              vm.uidTransfer.originalStockClassId = angular.copy(vm.uidTransfer.uomClassID);
              if (UIDData.component.UOMs) {
                vm.uidTransfer.originalStockUOM = UIDData.component.UOMs;
              }
              vm.headerData = [{
                label: vm.LabelConstant.TransferStock.UMID,
                value: vm.uidTransfer.umidName,
                displayOrder: 1,
                labelLinkFn: vm.goToUMIDList,
                valueLinkFn: vm.goToUMIDDetail,
                isCopy: true
              },
              {
                label: vm.LabelConstant.MFG.MFG,
                value: vm.uidTransfer.mfgCode,
                displayOrder: 2,
                labelLinkFn: vm.goToManufacturerList,
                valueLinkFn: vm.goToManufacturer,
                isCopy: true
              },
              {
                label: vm.LabelConstant.MFG.MPNCPN,
                value: vm.uidTransfer.mfgPN,
                displayOrder: 3,
                labelLinkFn: vm.goToPartList,
                valueLinkFn: vm.goToAssyMaster,
                isCopy: true,
                imgParms: {
                  imgPath: vm.uidTransfer.rfq_rohsmst.rohsIcon !== null ? stringFormat(CORE.RoHSImageFormat, CORE.WEB_URL, USER.ROHS_BASE_PATH, vm.uidTransfer.rfq_rohsmst.rohsIcon) : null,
                  imgDetail: vm.uidTransfer.rfq_rohsmst.name
                }
              },
              {
                label: vm.LabelConstant.MFG.PID,
                value: vm.uidTransfer.PIDCode,
                displayOrder: 4,
                labelLinkFn: vm.goToPartList,
                valueLinkFn: vm.goToAssyMaster,
                isCopy: true,
                isCopyAheadLabel: true,
                imgParms: {
                  imgPath: vm.uidTransfer.rfq_rohsmst.rohsIcon !== null ? stringFormat(CORE.RoHSImageFormat, CORE.WEB_URL, USER.ROHS_BASE_PATH, vm.uidTransfer.rfq_rohsmst.rohsIcon) : null,
                  imgDetail: vm.uidTransfer.rfq_rohsmst.name
                },
                isCopyAheadOtherThanValue: true,
                copyAheadLabel: vm.LabelConstant.MFG.MFGPN,
                copyAheadValue: UIDData.component.mfgPN
              }];

              if (vm.uidTransfer.pkgQty === 0 || vm.uidTransfer.binID === vm.CORE_SystemGenratedWarehouseBin.bin.EmptyBin.id) {
                if (vm.modalData.updateStock) {
                  vm.modalData.transferStockType = vm.transferStockType.Adjust;
                  vm.changeEntryType();
                } else {
                  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_ALLOW_TRASFER_EMPTY_STOCK);
                  const model = {
                    messageContent: messageContent,
                    multiple: true
                  };
                  DialogFactory.messageAlertDialog(model).then(() => {
                    if (vm.modalData.uid) {
                      vm.cancel();
                    }
                    else {
                      vm.clearUMID();
                    }
                  }, () => {
                  }).catch((error) => BaseService.getErrorLog(error));
                }
              } else if (vm.modalData.updateStock) {
                setEmptyBin();
              }
              getAutoCompleteData();
              if (vm.isWHBinDisable) {
                vm.isFromUMID = true;
                if (vm.modalData.updateStock) {
                  confirmationForTransferUMID();
                } else {
                  checkUMIDQtyValidation();
                }
              }
              setFocus('ScanVerifyUMID');
              if (vm.modalData.updateStock) {
                getKitDetail(UIDData.id);
                vm.checkWarningMessage();
              } else {
                setFocus(vm.isLockBin ? 'ScanUID' : (vm.modalData.uid || vm.scanFromList) ? 'ScanWHBin' : 'isLockBin');
                if (!isClear) {
                  checkScannedUMIdStatus();
                }
              }
            }
          } else {
            vm.cgBusyLoading = false;
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SCAN_UID_NOT_FOUND);
            messageContent.message = stringFormat(messageContent.message, vm.uidTransfer.ScanUID);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                vm.uidTransfer.ScanUID = null;
                setFocus('ScanUID');
              }
            }, () => {

            }).catch((error) => BaseService.getErrorLog(error));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    }

    //Scan warehouse/bin
    vm.scanWHBin = ($event) => {
      $timeout(() => {
        if ($event.keyCode === 13) {
          scanWHBin($event);
        }
      }, true);
      /** Prevent enter key submit event */
      preventInputEnterKeyEvent($event);
    };

    const scanWHBin = (e) => {
      vm.event = e;
      if (!vm.formUIDTransfer.$valid) {
        BaseService.focusRequiredField(vm.formUIDTransfer);
        vm.uidTransfer.ScanWHBin = null;
        return;
      }

      if (vm.uidTransfer.ScanWHBin) {
        const obj = {
          name: vm.uidTransfer.ScanWHBin,
          fromBinID: vm.uidTransfer.binID,
          fromDeptID: vm.uidTransfer.fromDeptID,
          fromDeptName: vm.uidTransfer.department,
          umidId: vm.uidTransfer.umidId,
          umidName: vm.uidTransfer.umidName,
          confirmUnAllocatedUMIDValidation: confirmUnAllocatedUMIDValidation
        };
        vm.cgBusyLoading = ReceivingMaterialFactory.match_Warehouse_Bin().query(obj).$promise.then((res) => {
          vm.image = null;
          if (res && res.data && res.data.id < 0 && (res.data.warehousemst && res.data.id !== vm.CORE_SystemGenratedWarehouseBin.bin.EmptyBin.id)) {
            if (vm.modalData.updateStock) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SCAN_VALID_BIN);
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              DialogFactory.messageAlertDialog(model, callBackFunction);
            }
            else {
              WHBinData = {};
              vm.isWHBinDisable = false;
              vm.uidTransfer.ScanWHBin = null;
              vm.image = null;
              setFocus('ScanWHBin');
            }
          }
          else if (res && res.data && res.data.responseMessage && (!res.data.WarehouseID || (res.data.WarehouseID && res.data.warehousemst.warehouseType !== TRANSACTION.warehouseType.SmartCart.key))) {
            vm.cgBusyLoading = false;
            if (res.data.responseMessage.validationType === TRANSACTION.TRANSFER_BIN_VALIDATION_TYPE.Unallocate) {
              if (vm.enableUnallocatedUMIDTransfer) {
                vm.unallocatedXferHistoryData = {};
                vm.unallocatedXferHistoryData.message = res.data.responseMessage.message || null;

                DialogFactory.dialogService(
                  TRANSACTION.TRANSFER_STOCK_UNALLOCATED_UMID_HISTORY_POPUP_CONTROLLER,
                  TRANSACTION.TRANSFER_STOCK_UNALLOCATED_UMID_HISTORY_POPUP_VIEW,
                  event,
                  vm.unallocatedXferHistoryData)
                  .then((data) => {
                    if (data) {
                      vm.unallocatedXferHistoryData = vm.unallocatedXferHistoryData = data || {};
                      vm.unallocatedXferHistoryData.transactionType = CORE.UMID_History.Trasaction_Type.UMID_Bin_Transfer;
                      vm.unallocatedXferHistoryData.category = vm.category ? vm.category : CORE.UMID_History.Category.Xfer_Material;
                      vm.unallocatedXferHistoryData.transferFrom = vm.uidTransfer.umidName;
                      vm.unallocatedXferHistoryData.transferTo = vm.uidTransfer.ScanWHBin;
                      confirmUnAllocatedUMIDValidation = true;
                      scanWHBin();
                    } else {
                      vm.unallocatedXferHistoryData = null;
                    }
                  }, (err) => BaseService.getErrorLog(err));
              }
              else if (!vm.enableUnallocatedUMIDTransfer) {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_RIGHT_FOR_FEATURE);
                messageContent.message = stringFormat(messageContent.message, CORE.FEATURE_NAME.UnallocatedUMIDTransfer);
                const model = {
                  messageContent: messageContent,
                  multiple: true
                };
                DialogFactory.messageAlertDialog(model, callBackFunction);
              }
            }
            else {
              const model = {
                messageContent: res.data.responseMessage,
                multiple: true
              };
              DialogFactory.messageAlertDialog(model).then((yes) => {
                if (yes) {
                  callBackFunction();
                }
              }, () => {
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }
          else if (res && res.data) {
            WHBinData = res.data;
            vm.isWHBinDisable = true;
            const typeScan = WHBinData && WHBinData.WarehouseID ? TRANSACTION.TypeWHBin.Bin : TRANSACTION.TypeWHBin.Warehouse;
            if (typeScan === TRANSACTION.TypeWHBin.Bin) {
              if (WHBinData.warehousemst.warehouseType === TRANSACTION.warehouseType.SmartCart.key) {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.ENTER_VALID_SMARTCART_NAME);
                messageContent.message = stringFormat(messageContent.message, WHBinData.warehousemst.Name);
                const model = {
                  messageContent: messageContent,
                  multiple: true
                };
                DialogFactory.messageAlertDialog(model).then(() => {
                  vm.isWHBinDisable = false;
                  vm.uidTransfer.ScanWHBin = null;
                  setFocus('ScanWHBin');
                }, () => {
                }).catch((error) => BaseService.getErrorLog(error));
                return;
              }
              vm.uidTransfer.toWarehouse = WHBinData.warehousemst.Name;
              vm.uidTransfer.toWarehouseID = WHBinData.warehousemst.id;
              vm.uidTransfer.toBin = WHBinData.Name;
              vm.uidTransfer.toBinID = WHBinData.id;
              vm.uidTransfer.toDepartment = WHBinData.warehousemst.parentWarehouseMst.Name;
              if (vm.isUIDDisable) {
                checkUMIDQtyValidation();
              } else {
                setFocus('ScanUID');
              }
              vm.image = null;
            } else {
              // Coming Soon
              // For Type Warehouse
              // Get the bin from web hook on warehouse id
              //for ware house smart cart and inoauto
              if (TRANSACTION.warehouseType.SmartCart.key === WHBinData.warehouseType && CORE.InoautoCart === WHBinData.cartMfr) {
                vm.uidTransfer.toWarehouse = WHBinData.Name;
                vm.uidTransfer.toWarehouseID = WHBinData.id;
                vm.uidTransfer.toDepartment = WHBinData.parentWarehouseMst.Name;
                vm.uidTransfer.toDepartmentID = WHBinData.parentWarehouseMst.id;
                if (vm.uidTransfer.ScanWHBin.toLowerCase() === WHBinData.leftSideWHLabel.toLowerCase()) {
                  vm.whkey = TRANSACTION.Warehouse_Side.L.key;
                  vm.whSide = TRANSACTION.Warehouse_Side.L.value;
                }
                else if (vm.uidTransfer.ScanWHBin.toLowerCase() === WHBinData.rightSideWHLabel.toLowerCase()) {
                  vm.whkey = TRANSACTION.Warehouse_Side.R.key;
                  vm.whSide = TRANSACTION.Warehouse_Side.R.value;
                }
                else {
                  vm.whkey = TRANSACTION.Warehouse_Side.B.key;
                  vm.whSide = TRANSACTION.Warehouse_Side.B.value;
                }
                if (!vm.modalData.updateStock) {
                  vm.scanWHProgress = true;
                  WarehouseBinFactory.sendRequestToCheckCartStatus().query({
                    TransactionID: getGUID(),
                    TowerID: WHBinData.uniqueCartID
                  }).$promise.then((response) => {
                    if (checkResponseHasCallBackFunctionPromise(response)) {
                      response.alretCallbackFn.then(() => {
                        if (vm.isFromUMID && vm.isLockBin && !(vm.modalData.uid || vm.scanFromList)) {
                          vm.clearUMIDForLockBin();
                        } else {
                          callBackFunction();
                        }
                      });
                    }
                  }).catch((error) => BaseService.getErrorLog(error));
                }
              } else {
                vm.cgBusyLoading = false;
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.INVALID_BIN_OR_SMART_CART);
                const model = {
                  messageContent: messageContent,
                  multiple: true
                };
                DialogFactory.messageAlertDialog(model).then((yes) => {
                  if (yes) {
                    WHBinData = {};
                    vm.isWHBinDisable = false;
                    vm.uidTransfer.ScanWHBin = null;
                    vm.image = null;
                    setFocus('ScanWHBin');
                  }
                }, () => {
                }).catch((error) => BaseService.getErrorLog(error));
              }
            }
          } else {
            vm.cgBusyLoading = false;
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SCAN_WH_BIN_NOT_FOUND);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                vm.uidTransfer.ScanWHBin = null;
                setFocus('ScanWHBin');
              }
            }, () => {
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.changeLockBin = () => {
      vm.isFromUMID = false;
      if (!vm.isLockBin) {
        callBackFunction();
      }
    };

    //check umid is picked by same user or not
    const checkScannedUMIdStatus = () => {
      ReceivingMaterialFactory.getInTransitUMIDDetail().query({ uid: vm.uidTransfer.ScanUID }).$promise.then((res) => {
        if (res && res.data && res.data.length > 0) {
          const scannedUserDetail = res.data[0];

          if (!(scannedUserDetail.isInTransit && (scannedUserDetail.createdBy === loginUser.userid || (scannedUserDetail.pickColorUserID && scannedUserDetail.pickColorUserID === loginUser.userid)))) {
            infoToTransferWrongPickedUMId(scannedUserDetail);
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //ask confirmation for wrong picked umid
    const infoToTransferWrongPickedUMId = (scannedUserDetail) => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.INVALID_REEL_PICK);
      messageContent.message = stringFormat(messageContent.message, vm.uidTransfer.ScanUID, scannedUserDetail.userName, scannedUserDetail.ledColorName);
      const obj = {
        messageContent: messageContent,
        multiple: true
      };
      DialogFactory.messageAlertDialog(obj).then((yes) => {
        if (yes) {
          setFocus(vm.modalData.uid ? 'ScanVerifyUMID' : 'ScanWHBin');
        }
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //check color availability to prompt in cart
    function checkColorAvailibility(cartMfr) {
      ReceivingMaterialFactory.getPromptIndicatorColor().query({ pcartMfr: cartMfr, prefDepartmentID: vm.uidTransfer.toDepartmentID }).$promise.then((res) => {
        vm.promptColorDetails = null;
        if (res && res.data) {
          vm.promptColorDetails = res.data.promptColors[0];
          vm.Checkintimeout = (res.data.defaultCheckinTimeOut && res.data.defaultCheckinTimeOut.length > 0 && res.data.defaultCheckinTimeOut[0].values ? parseInt(res.data.defaultCheckinTimeOut[0].values) : CORE.CANCEL_REQUSET_TIMEOUT) + _configAdditionalTimeout;
          activityStartTime = vm.Checkintimeout;
          if (vm.promptColorDetails) {
            callCheckinRequest(vm.promptColorDetails);
          }
        } else {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PROMPT_ALREADY_USE);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model).then((yes) => {
            if (yes) {
              if (vm.isFromUMID && vm.isLockBin && !(vm.modalData.uid || vm.scanFromList)) {
                vm.clearUMIDForLockBin();
              } else {
                callBackFunction();
              }
            }
          });
          return;
          //color is not available message prompt
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    function callCheckinRequest(qData) {
      vm.transactionID = getGUID();
      const checkinRequestObj = {
        TransactionID: vm.transactionID,
        PromptIndicator: qData.ledColorValue,
        ledColorID: qData.id,
        Priority: 0,
        UserName: loginUser.username,
        TowerSide: [],
        ReelBarCode: UIDData.uid,
        MFGPN: UIDData.component ? UIDData.component.mfgPN : '',
        PartNumber: UIDData.component ? UIDData.component.PIDCode : '',
        MFG: UIDData.component && UIDData.component.mfgCodemst ? UIDData.component.mfgCodemst.mfgName : '',
        Quantity: UIDData.pkgQty,
        DateCode: UIDData.dateCode,
        wareHouseID: WHBinData.id,
        refUMIDId: UIDData.id,
        departmentID: vm.uidTransfer.toDepartmentID,
        Department: vm.uidTransfer.toDepartment,
        reason: vm.unallocatedXferHistoryData ? vm.unallocatedXferHistoryData.reason : null
      };
      if (vm.whkey === TRANSACTION.Warehouse_Side.L.key || vm.whkey === TRANSACTION.Warehouse_Side.B.key) {
        const objSide = {
          TowerID: WHBinData.uniqueCartID,
          Side: 0
        };
        checkinRequestObj.TowerSide.push(objSide);
      }
      if (vm.whkey === TRANSACTION.Warehouse_Side.R.key || vm.whkey === TRANSACTION.Warehouse_Side.B.key) {
        const objSide = {
          TowerID: WHBinData.uniqueCartID,
          Side: 1
        };
        checkinRequestObj.TowerSide.push(objSide);
      }
      WarehouseBinFactory.sendRequestToCheckInCart().query(checkinRequestObj).$promise.then(() => {
      }).catch((error) => BaseService.getErrorLog(error));
    }

    function cancelCheckinRequest() {
      const objTrans = {
        TransactionID: vm.transactionID,
        ReasonCode: CORE.InoAuto_Error_ReasonCode.CancelTask.Code,
        ReasonMessage: CORE.InoAuto_Error_ReasonCode.CancelTask.Message
      };
      WarehouseBinFactory.sendRequestToCancelCartRequest().query(objTrans).$promise.then(() => {
      }).catch((error) => BaseService.getErrorLog(error));
    }

    // Manage deallocation approval history
    vm.countApprovalHistory = () => {
      const selectedKit = _.filter(vm.allocatedToKit, { isReturn: true });
      let deallocatedKit = _.filter(vm.allocatedToKit, { isReturn: false });
      deallocatedKit = _.orderBy(deallocatedKit, [(o) => o.promiseShipDate || ''], ['desc']);
      const totalAllocated = _.sumBy(selectedKit, 'allocatedUnit');
      const kitDetails = {
        deallocatedKit: deallocatedKit,
        accessLevelDetail: vm.accessLevelDetail,
        UMID: vm.uidTransfer.ScanUID,
        consumedUnit: vm.uidTransfer.consumedPkgUnit,
        uom: vm.uidTransfer.consumedStockUOM.unitName,
        consumedQty: vm.uidTransfer.consumedPkgQty,
        currentUnit: vm.uidTransfer.currentPkgUnit,
        currentQty: vm.uidTransfer.currentPkgQty,
        uomClassID: vm.uidTransfer.uomClassID,
        consumedKit: selectedKit,
        mfgCode: vm.uidTransfer.mfgCode,
        mfgPN: vm.uidTransfer.mfgPN,
        rfq_rohsmst: vm.uidTransfer.rfq_rohsmst,
        mfgCodeID: vm.uidTransfer.mfgCodeID,
        mfgType: vm.uidTransfer.mfgType,
        componentID: vm.uidTransfer.componentID,
        umidId: vm.uidTransfer.umidId,
        selectedKitName: _.map(selectedKit, 'kitName').join(','),
        isKitSelected: selectedKit.length === 0 ? false : true,
        isFromSplitUMID: false
      };
      DialogFactory.dialogService(
        TRANSACTION.UID_TRANSFER_DEALLOCATION_VERIFACTION_CONTROLLER,
        TRANSACTION.UID_TRANSFER_DEALLOCATION_VERIFACTION_VIEW,
        null,
        kitDetails).then((data) => {
          if (data) {
            let deallocatedKitName = '';
            const currentConsumedUnit = vm.modalData.transferStockType === vm.transferStockType.Adjust ? vm.uidTransfer.remainingAdjustPkgUnit : vm.modalData.transferStockType === vm.transferStockType.Remaining ? vm.uidTransfer.consumedPkgUnit : vm.uidTransfer.remainingPkgUnit;
            let AccessConsumedUnit = totalAllocated - currentConsumedUnit;
            if (AccessConsumedUnit > 0) {
              const deallocatedKitDocDateDescOrderList = _.orderBy(deallocatedKit, 'promiseShipDate', 'desc');
              _.map(deallocatedKitDocDateDescOrderList, (item) => {
                if (AccessConsumedUnit > 0) {
                  AccessConsumedUnit = AccessConsumedUnit - item.allocatedUnit;
                  deallocatedKitName = deallocatedKitName ? deallocatedKitName.concat(',', item.kitName) : item.kitName;
                }
              });
            }
            // Call Transfer Stock API > Need to set this data for parameter
            vm.countApprovalData = data || null;
            vm.countApprovalData.deallocatedKitDesc = deallocatedKitName;
            UIDTransfer();
          }
        }, () => {
          callBackFunction();
          vm.countApprovalData = null;
        }, (err) => BaseService.getErrorLog(err));
    };

    const checkUMIDQtyValidation = () => {
      // check umis stock is pending for new entered value or not
      if (vm.modalData.transferStockType === vm.transferStockType.Adjust && (vm.modalData.adjustMaterialType === vm.adjustMaterialType.NewCount || vm.modalData.adjustMaterialType === vm.adjustMaterialType.AddAppendCount) && vm.uidTransfer.consumedPkgUnit
        && (vm.uidTransfer.stockInventoryType === TRANSACTION.InventoryType[0].value || vm.uidTransfer.stockInventoryType === TRANSACTION.InventoryType[2].value)) {
        const umidDetails = {
          stockInventoryType: vm.uidTransfer.stockInventoryType,
          woID: vm.uidTransfer.woID,
          packingSlipDetID: vm.uidTransfer.packingSlipDetailID
        };
        vm.cgBusyLoading = ReceivingMaterialFactory.getUMIDDetailsForManageStock().query(umidDetails).$promise.then((response) => {
          if (response && response.data && response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data.umidDetails) {
            const manageReponse = response.data.umidDetails;
            const maxQtyToCreate = vm.uidTransfer.orgPkgUnit + manageReponse.availableQty;
            if (manageReponse.availableQty > 0 || vm.uidTransfer.consumedPkgUnit > maxQtyToCreate) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.UMID_STOCK_NOT_EXITS);
              messageContent.message = stringFormat(messageContent.message, manageReponse.availableQty, maxQtyToCreate);
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              return DialogFactory.messageAlertDialog(model).then((yes) => {
                if (yes) {
                  if (vm.isFromUMID && vm.isLockBin && !(vm.modalData.uid || vm.scanFromList)) {
                    vm.clearUMIDForLockBin();
                  } else {
                    callBackFunction();
                  }
                  return;
                }
              });
            } else {
              confirmationForTransferUMID();
            }
          } else {
            confirmationForTransferUMID();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        confirmationForTransferUMID();
      }
    };

    // Confirmation for transfer UMID
    const confirmationForTransferUMID = () => {
      vm.cgBusyLoading = false;
      const currentConsumedUnit = vm.uidTransfer.consumedPkgUnit;
      const selectedKit = _.filter(vm.allocatedToKit, { isReturn: true });
      const totalAllocated = _.sumBy(selectedKit, 'allocatedUnit');
      const sunOfAllocated = _.sumBy(vm.allocatedToKit, 'allocatedUnit');
      const freeToAllocate = vm.uidTransfer.currentPkgUnit - sunOfAllocated;

      // Check validation for transfer to empty bin or not
      if (checkEmptyBinValidation()) {
        return;
      }

      // Check validation for transfer into same bin
      if (vm.uidTransfer.binID === WHBinData.id) {
        checkSameBinValidation();
        return;
      }
      if (vm.uidTransfer.isConformUponSaving) {
        if (vm.modalData.updateStock) {
          let messageContent;
          //If entered adjust quantity the ask for confirmation before update material
          if (vm.uidTransfer.remainingAdjustPkgQty > 0 || vm.uidTransfer.remainingAdjustPkgUnit) {
            let adjustQtyPercentage = 100 - (((vm.uidTransfer.currentConvertedPkgUnit - vm.uidTransfer.consumedPkgUnit) / vm.uidTransfer.currentConvertedPkgUnit * 10000) / 100);
            adjustQtyPercentage = adjustQtyPercentage < 0 ? (adjustQtyPercentage * -1) : adjustQtyPercentage;

            if (adjustQtyPercentage && adjustQtyPercentage > vm.CountMaterialPercentage && adjustQtyPercentage !== 100) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.ADJUSTED_MATERIAL_MORE_THAN_CONFIGURED);
              messageContent.message = stringFormat(messageContent.message, `<a target='blank' href='${WebsiteBaseUrl}/#!${CORE.USER_PROFILE_SETTINGS_ROUTE}'>${stringFormat('{0}%', vm.CountMaterialPercentage)}</a>`, COUNT_MATERIAL_CONFIRMATION.message);
            } else {
              messageContent = COUNT_MATERIAL_CONFIRMATION;
            }
          }
          if (messageContent) {
            const model = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
            };
            return DialogFactory.messageConfirmDialog(model).then(() => {
              UIDTransfer();
            }, () => {
              callBackFunction();
            }).catch((error) => BaseService.getErrorLog(error));
          }
          const consumedUnit = selectedKit.length > 0 ? _.sumBy(selectedKit, 'consumedUnits') : vm.uidTransfer.consumedPkgUnit;
          const currentUnit = selectedKit.length > 0 ? _.sumBy(selectedKit, 'allocatedUnit') : vm.uidTransfer.currentConvertedPkgUnit;
          let remainingQtyInPercentage = 100 - (((currentUnit - consumedUnit) / currentUnit * 10000) / 100);
          remainingQtyInPercentage = remainingQtyInPercentage < 0 ? (remainingQtyInPercentage * -1) : remainingQtyInPercentage;

          if (remainingQtyInPercentage && remainingQtyInPercentage > vm.CountMaterialPercentage && remainingQtyInPercentage !== 100) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.CONSUMED_MATERIAL_MORE_THAN_CONFIGURED);
            messageContent.message = stringFormat(messageContent.message, `<a target='blank' href='${WebsiteBaseUrl}/#!${CORE.USER_PROFILE_SETTINGS_ROUTE}'>${stringFormat('{0}%', vm.CountMaterialPercentage)}</a>`, COUNT_MATERIAL_CONFIRMATION.message);
          } else {
            messageContent = COUNT_MATERIAL_CONFIRMATION;
          }
          if (messageContent) {
            const model = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
            };
            return DialogFactory.messageConfirmDialog(model).then((yes) => {
              if (yes) {
                if (!(_.some(vm.allocatedToKit, { isReturn: false }))) {
                  // Allocated All kit are seletced
                  UIDTransfer();
                } else if (currentConsumedUnit > totalAllocated && (currentConsumedUnit - totalAllocated) >= freeToAllocate) {
                  vm.countApprovalHistory();
                } else {
                  UIDTransfer();
                }
              }
            }, () => {
              callBackFunction();
            }).catch((error) => BaseService.getErrorLog(error));
          }
        } else {
          UIDTransfer();
        }
      } else {
        if (!(_.some(vm.allocatedToKit, { isReturn: false }))) {
          // Allocated All kit are seletced
          UIDTransfer();
        } else if (vm.modalData.transferStockType !== vm.transferStockType.Adjust && currentConsumedUnit > totalAllocated && (currentConsumedUnit - totalAllocated) >= freeToAllocate) {
          vm.countApprovalHistory();
        } else {
          UIDTransfer();
        }
      }
    };

    // Check validation for transfer to empty bin or not
    function checkEmptyBinValidation() {
      let messageContent = null;
      if (vm.modalData.updateStock) {
        if (vm.modalData.transferStockType === vm.transferStockType.Adjust) {
          if (vm.uidTransfer.consumedPkgUnit > 0 && vm.uidTransfer.toBinID === vm.CORE_SystemGenratedWarehouseBin.bin.EmptyBin.id) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NON_EMPTY_STOCK_INVALID_BIN);
          } else if ((vm.uidTransfer.consumedPkgUnit === 0 || vm.uidTransfer.consumedPkgUnit === null) && vm.uidTransfer.toBinID !== vm.CORE_SystemGenratedWarehouseBin.bin.EmptyBin.id) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.EMPTY_STOCK_INVALID_BIN);
          }
        } else {
          if (vm.uidTransfer.remainingPkgQty > 0 && vm.uidTransfer.toBinID === vm.CORE_SystemGenratedWarehouseBin.bin.EmptyBin.id) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NON_EMPTY_STOCK_INVALID_BIN);
          } else if ((vm.uidTransfer.remainingPkgQty === 0 || vm.uidTransfer.remainingPkgQty === null) && vm.uidTransfer.toBinID !== vm.CORE_SystemGenratedWarehouseBin.bin.EmptyBin.id) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.EMPTY_STOCK_INVALID_BIN);
          }
        }
      } else {
        if (vm.uidTransfer.toBinID === vm.CORE_SystemGenratedWarehouseBin.bin.EmptyBin.id) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NON_EMPTY_STOCK_INVALID_BIN);
        }
      }

      if (messageContent) {
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model).then((yes) => {
          if (yes) {
            if (vm.isFromUMID && vm.isLockBin && !(vm.modalData.uid || vm.scanFromList)) {
              vm.clearUMIDForLockBin();
            } else {
              callBackFunction();
            }
          }
        }, () => {

        }).catch((error) => BaseService.getErrorLog(error));
        return true;
      }
      return false;
    }

    // Check validation for transfer into same bin or not
    function checkSameBinValidation() {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SAME_FROM_TO_BIN);
      if (messageContent) {
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        return DialogFactory.messageAlertDialog(model).then((yes) => {
          if (yes) {
            if (vm.isFromUMID && vm.isLockBin && !(vm.modalData.uid || vm.scanFromList)) {
              vm.clearUMIDForLockBin();
            } else {
              callBackFunction();
            }
            return false;
          }
        }, () => {

        }).catch((error) => BaseService.getErrorLog(error));
      }
      return false;
    }

    const UIDTransfer = () => {
      UIDTransferData.transferType = CORE.TrasferStockType.StockTransfer;
      UIDTransferData.toBinID = WHBinData.id;
      UIDTransferData.uidID = UIDData.id;
      UIDTransferData.transferStockType = vm.modalData.transferStockType;
      UIDTransferData.notes = vm.uidTransfer.updateMaterialNotes;
      UIDTransferData.unallocatedXferHistoryData = vm.unallocatedXferHistoryData;
      UIDTransferData.countApprovalHistoryData = vm.countApprovalData || null;

      if (vm.modalData.updateStock) {
        UIDTransferData.pkgCount = (vm.uidTransfer.remainingPkgQty + vm.uidTransfer.remainingAdjustPkgQtyDiff);
        UIDTransferData.pkgUnit = getUnitConversion(vm.uidTransfer.consumedStockUOM, vm.uidTransfer.originalStockUOM, (vm.uidTransfer.remainingPkgUnit + vm.uidTransfer.remainingAdjustPkgUnitDiff));

        if (vm.modalData.transferStockType === vm.transferStockType.Adjust) {
          UIDTransferData.adjustCount = (vm.uidTransfer.remainingAdjustPkgQtyDiff);
          UIDTransferData.adjustUnit = getUnitConversion(vm.uidTransfer.consumedStockUOM, vm.uidTransfer.originalStockUOM, (vm.uidTransfer.remainingAdjustPkgUnitDiff));
        }
      }

      const kitReturnDetail = _.filter(vm.allocatedToKit, { isReturn: true });

      if (kitReturnDetail.length > 0) {
        UIDTransferData.isKitSelected = true;
        UIDTransferData.kitReturnDetail = _.map(kitReturnDetail, (kitDetail) => {
          const objKit = {
            id: kitDetail.id,
            returnQty: convertUnitWithDecimalPlace((kitDetail.returnUnits * vm.uidTransfer.pkgQty) / vm.uidTransfer.currentConvertedPkgUnit),
            returnUnit: kitDetail.returnUnits,
            umidUOM: vm.uidTransfer.uom
          };

          if (vm.modalData.transferStockType === vm.transferStockType.Scrapped || vm.modalData.transferStockType === vm.transferStockType.Expired) {
            objKit.consumeQty = 0;
            objKit.consumeUnit = 0;
            objKit.scrapExpiredQty = convertUnitWithDecimalPlace((kitDetail.scrapExpiredUnits * vm.uidTransfer.pkgQty) / vm.uidTransfer.currentConvertedPkgUnit);
            objKit.scrapExpiredUnit = kitDetail.scrapExpiredUnits;
          } else {
            objKit.consumeQty = convertUnitWithDecimalPlace((kitDetail.consumedUnits * vm.uidTransfer.pkgQty) / vm.uidTransfer.currentConvertedPkgUnit);
            objKit.consumeUnit = kitDetail.consumedUnits;
            objKit.scrapExpiredQty = 0;
            objKit.scrapExpiredUnit = 0;
          }
          return objKit;
        });
      }

      UIDTransferData.transType = CORE.UMID_History.Trasaction_Type.UMID_Bin_Transfer;
      UIDTransferData.actionPerformed = CORE.UMID_History.Action_Performed.UMIDTransferMaterial;
      if (vm.modalData.updateStock) {
        UIDTransferData.transType = CORE.UMID_History.Trasaction_Type.UMID_Bin_TransferWithChangeCount;
        if (vm.modalData.transferStockType === vm.transferStockType.Adjust) {
          UIDTransferData.actionPerformed = stringFormat('{0} ({1}: {2} Count)', CORE.UMID_History.Action_Performed.UMIDCountMaterial, vm.modalData.transferStockType, vm.modalData.adjustMaterialType);
        } else {
          UIDTransferData.actionPerformed = stringFormat('{0} ({1})', CORE.UMID_History.Action_Performed.UMIDCountMaterial, vm.modalData.transferStockType);
        }

        UIDTransferData.userInputDetail = {
          remainingPkgQty: vm.uidTransfer.remainingPkgQty,
          remainingPkgUnit: vm.uidTransfer.remainingPkgUnit,
          remainingAdjustPkgQty: vm.uidTransfer.remainingAdjustPkgQty,
          remainingAdjustPkgUnit: vm.uidTransfer.remainingAdjustPkgUnit,
          remainingAdjustPkgQtyDiff: vm.uidTransfer.remainingAdjustPkgQtyDiff,
          remainingAdjustPkgUnitDiff: vm.uidTransfer.remainingAdjustPkgUnitDiff,
          unitName: vm.uidTransfer.remainingStockUOM.unitName,
          uom: vm.autoCompleteRemainingStockUOM.keyColumnId,
          refKitAllocationID: (_.first(kitReturnDetail) || {}).id || null
        };

        if (vm.modalData.transferStockType === vm.transferStockType.Scrapped || vm.modalData.transferStockType === vm.transferStockType.Expired) {
          UIDTransferData.userInputDetail.consumeQty = 0;
          UIDTransferData.userInputDetail.consumeUnit = 0;
          UIDTransferData.userInputDetail.scrapExpiredQty = vm.uidTransfer.consumedPkgQty;
          UIDTransferData.userInputDetail.scrapExpiredUnit = vm.uidTransfer.consumedPkgUnit;
        } else {
          UIDTransferData.userInputDetail.consumeQty = vm.uidTransfer.consumedPkgQty;
          UIDTransferData.userInputDetail.consumeUnit = vm.uidTransfer.consumedPkgUnit;
          UIDTransferData.userInputDetail.scrapExpiredQty = 0;
          UIDTransferData.userInputDetail.scrapExpiredUnit = 0;
        }
      }
      vm.cgBusyLoading = TransferStockFactory.managestock().query(UIDTransferData).$promise.then((res) => {
        if (res.data) {
          const objassUMID = {
            id: vm.uidTransfer.umidId,
            UID: vm.uidTransfer.ScanUID,
            frmwarehouse: vm.uidTransfer.Warehouse,
            frmWHID: vm.uidTransfer.WarehouseID,
            frmlocation: vm.uidTransfer.bin,
            frmBinID: vm.uidTransfer.binID,
            frmParentWarehouse: vm.uidTransfer.department,
            towarehouse: vm.uidTransfer.toWarehouse,
            toWarehouseID: vm.uidTransfer.toWarehouseID,
            tolocation: vm.uidTransfer.ScanWHBin,
            toBinID: vm.uidTransfer.toBinID,
            toparentWarehouse: vm.uidTransfer.toDepartment,
            timestamp: new Date(),
            index: vm.assignUMIDList.length + 1
          };
          vm.assignUMIDList.push(objassUMID);
          $rootScope.$emit(PRICING.EventName.RemoveUMIDFrmList, objassUMID);
          $scope.$broadcast('scanned-umid', objassUMID);
          if (!vm.modalData.updateStock) {
            vm.modalData = vm.modalData ? vm.modalData = {} : vm.modalData;
          }
          vm.anyReleasedKit = [];
          vm.scanFromList = false;
          if (vm.isLockBin) {
            vm.clearUMIDForLockBin();
          } else {
            vm.clearUMID();
          }
          if (vm.modalData.isBulkTranfer) {
            vm.transferredUMID = {
              updateStock: _.first(res.data.transferDetail),
              transferDet: {
                whID: vm.uidTransfer ? vm.uidTransfer.toWarehouseID : null
              }
            };
            vm.isOneTimeValidationForAccess = false;
            $mdDialog.hide(vm.transferredUMID);
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // Reset scanned UMID in case of Lock Bin
    vm.clearUMIDForLockBin = () => {
      vm.isUIDDisable = vm.umidStockDisable = false;
      vm.stockErrorMessage = null;
      vm.bulkTranferHint = null;
      vm.uidTransfer.mfgPN = null;
      vm.uidTransfer.mfgCode = null;
      vm.uidTransfer.mfgPNDescription = null;
      vm.uidTransfer.rfq_mountingType = null;
      vm.uidTransfer.rfq_packageCaseType = null;
      vm.uidTransfer.imageURL = BaseService.getPartMasterImageURL(null, null);
      if (vm.umidStock !== vm.UMIDStockType.CustomerConsignedStock.key) {
        vm.autoCompleteCustomer.keyColumnId = null;
      }
      vm.uidTransfer.ScanUID = null;
      vm.uidTransfer.Warehouse = null;
      vm.uidTransfer.bin = null;
      vm.uidTransfer.department = null;
      vm.isWHBinDisable = true;
      vm.scanWHProgress = false;
      vm.uidTransfer.orgqty = null;
      vm.uidTransfer.orgPkgUnit = null;
      vm.uidTransfer.pkgQty = null;
      vm.uidTransfer.pkgUnit = null;
      vm.uidTransfer.spq = null;
      vm.uidTransfer.uom = null;
      vm.uidTransfer.umidName = null;
      vm.isNotDisable = false;
      BaseService.currentPagePopupForm = [];
      vm.formUIDTransfer.$setPristine();
      vm.formUIDTransfer.$setUntouched();
      vm.headerData = [];
      setFocus('ScanUID');
    };

    // Reset scanned UMID
    vm.clearUMID = (isManualReset) => {
      vm.isUIDDisable = vm.umidStockDisable = false;
      if (!isManualReset) {
        vm.stockErrorMessage = null;
        vm.bulkTranferHint = null;
        vm.uidTransfer.mfgPN = null;
        vm.uidTransfer.mfgCode = null;
        vm.uidTransfer.mfgPNDescription = null;
        vm.uidTransfer.rfq_mountingType = null;
        vm.uidTransfer.rfq_packageCaseType = null;
        vm.uidTransfer.imageURL = BaseService.getPartMasterImageURL(null, null);
      }
      if (vm.umidStock !== vm.UMIDStockType.CustomerConsignedStock.key) {
        vm.autoCompleteCustomer.keyColumnId = null;
      }
      if (!vm.uidTransfer.isSelectionMaterial) {
        vm.modalData.transferStockType = vm.transferStockType.Remaining;
        vm.modalData.adjustMaterialType = null;
        vm.adjustMaterialType = CORE.AdjustMaterialType;
      }
      vm.uidTransfer.ScanUID = null;
      vm.uidTransfer.Warehouse = null;
      vm.uidTransfer.bin = null;
      vm.uidTransfer.department = null;
      vm.uidTransfer.ScanWHBin = null;
      vm.isWHBinDisable = false;
      vm.uidTransfer.toWarehouse = null;
      vm.uidTransfer.toBin = null;
      vm.uidTransfer.toDepartment = null;
      vm.scanWHProgress = false;
      vm.uidTransfer.orgqty = null;
      vm.uidTransfer.orgPkgUnit = null;
      vm.uidTransfer.pkgQty = null;
      vm.uidTransfer.pkgUnit = null;
      vm.uidTransfer.spq = null;
      vm.uidTransfer.uom = null;
      vm.uidTransfer.remainingPkgQty = null;
      vm.uidTransfer.remainingPkgUnit = null;
      vm.uidTransfer.consumedPkgQty = null;
      vm.uidTransfer.consumedPkgUnit = null;
      vm.uidTransfer.updateMaterialNotes = null;
      vm.uidTransfer.remainingStockUOM = null;
      vm.uidTransfer.consumedStockUOM = null;
      vm.autoCompleteRemainingStockUOM = null;
      vm.autoCompleteConsumedStockUOM = null;
      vm.uidTransfer.currentPkgQty = null;
      vm.uidTransfer.currentPkgUnit = null;
      vm.uidTransfer.umidName = null;
      vm.isLockBin = false;
      vm.image = null;
      vm.whSide = null;
      vm.promptColorDetails = null;
      vm.iscartCheckin = false;
      vm.ScanVerifyUMID = null;
      vm.scanVerifyUMIDDisable = false;
      vm.warningMessage = null;
      vm.countApprovalData = null;
      if (vm.modalData.uid) {
        vm.isNotDisable = true;
      }
      BaseService.currentPagePopupForm = [];
      vm.formUIDTransfer.$setPristine();
      vm.formUIDTransfer.$setUntouched();
      vm.headerData = [];
      vm.allocatedToKit = [];
      if (!vm.scanFromList) {
        vm.cancelRequest();
      }
      if (vm.modalData.uid) {
        vm.uidTransfer.ScanUID = vm.modalData.uid;
        scanUID(true);
      }
      vm.transactionID = null;
      setFocus('ScanUID');
      vm.isFromUMID = false;
    };

    vm.checkDirtyObject = {
      columnName: [],
      oldModelName: null,
      newModelName: null
    };

    // Close pop-up if form is not dirty
    vm.cancel = () => {
      // Check vm.isChange flag for color picker dirty object
      const isdirty = vm.checkFormDirty(vm.formUIDTransfer, vm.checkDirtyObject);
      if (isdirty) {
        showWithoutSavingAlertForPopUp();
      } else {
        vm.isOneTimeValidationForAccess = false;
        BaseService.currentPagePopupForm = [];
        if (vm.assignUMIDList.length > 0) {
          $mdDialog.cancel(true);
        } else {
          $mdDialog.cancel();
        }
      }
    };

    // Check form dirty
    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    /* unit drop-down fill up */
    const getUomlist = () => ComponentFactory.getUOMsList().query().$promise.then((res) => {
      vm.uomlist = res.data;
      vm.stockUOMList = _.filter(vm.uomlist, (obj) => obj.measurementType && obj.measurementType.name === vm.uidTransfer.originalStockUOM.measurementType.name);
      return res.data;
    }).catch((error) => BaseService.getErrorLog(error));

    const getCustomerList = () => MasterFactory.getCustomerList().query().$promise.then((customer) => {
      if (customer && customer.data) {
        _.each(customer.data, (item) => {
          if (item) {
            item.mfgName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.mfgCode, item.mfgName);
          }
        });
        vm.CustomerList = customer.data;
      }
      return $q.resolve(vm.CustomerList);
    }).catch((error) => BaseService.getErrorLog(error));

    // get auto-complete data
    const getAutoCompleteData = () => {
      const autocompletePromise = [getUomlist()];
      vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
        initAutoComplete();
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // Initialize auto-complete
    function initAutoComplete() {
      vm.autoCompleteRemainingStockUOM = {
        columnName: 'unitName',
        keyColumnName: 'id',
        keyColumnId: vm.uidTransfer ? vm.uidTransfer.uom : null,
        inputName: 'UOM',
        placeholderName: 'UOM',
        isRequired: true,
        isAddnew: false,
        callbackFn: getUomlist,
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.uidTransfer.remainingStockUOM = item;
            vm.uidTransfer.consumedStockUOM = item;
            vm.uidTransfer.remainingStockClassId = vm.uidTransfer.remainingStockUOM.measurementTypeID;
            vm.uidTransfer.consumedStockClassId = vm.uidTransfer.consumedStockUOM.measurementTypeID;
            vm.autoCompleteConsumedStockUOM.keyColumnId = item ? item.id : null;
            vm.uidTransfer.currentConvertedPkgUnit = getUnitConversion(vm.uidTransfer.originalStockUOM, vm.uidTransfer.remainingStockUOM, vm.uidTransfer.pkgUnit);
            vm.uidTransfer.orgConvertedPkgUnit = getUnitConversion(vm.uidTransfer.originalStockUOM, vm.uidTransfer.consumedStockUOM, vm.uidTransfer.orgPkgUnit);
            vm.changeRemainingUnit();
          }
        }
      };

      vm.autoCompleteConsumedStockUOM = {
        columnName: 'unitName',
        keyColumnName: 'id',
        keyColumnId: vm.uidTransfer ? vm.uidTransfer.uom : null,
        inputName: 'UOM',
        placeholderName: 'UOM',
        isRequired: true,
        isAddnew: false,
        callbackFn: getUomlist,
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.uidTransfer.consumedStockUOM = item;
            vm.uidTransfer.remainingStockUOM = item;
            vm.uidTransfer.remainingStockClassId = vm.uidTransfer.remainingStockUOM.measurementTypeID;
            vm.uidTransfer.consumedStockClassId = vm.uidTransfer.consumedStockUOM.measurementTypeID;
            vm.autoCompleteRemainingStockUOM.keyColumnId = item ? item.id : null;
            vm.uidTransfer.currentConvertedPkgUnit = getUnitConversion(vm.uidTransfer.originalStockUOM, vm.uidTransfer.consumedStockUOM, vm.uidTransfer.pkgUnit);
            vm.uidTransfer.orgConvertedPkgUnit = getUnitConversion(vm.uidTransfer.originalStockUOM, vm.uidTransfer.consumedStockUOM, vm.uidTransfer.orgPkgUnit);
            if (vm.modalData.transferStockType === vm.transferStockType.Adjust) {
              vm.changeRemainingAdjustUnit();
            } else {
              vm.changeConsumedUnit();
            }
          }
        }
      };
    }

    const init = () => {
      vm.cgBusyLoading = $q.all([getCustomerList()]).then(() => {
        initCustomerAutoComplete();
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const initCustomerAutoComplete = () => {
      vm.autoCompleteCustomer = {
        columnName: 'mfgName',
        controllerName: USER.ADMIN_CUSTOMER_ADD_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_CUSTOMER_ADD_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'Customer',
        placeholderName: 'Customer',
        isRequired: vm.umidStock === vm.UMIDStockType.CustomerConsignedStock.key ? true : false,
        isAddnew: true,
        addData: {
          customerType: CORE.CUSTOMER_TYPE.CUSTOMER,
          popupAccessRoutingState: [USER.ADMIN_MANAGECUSTOMER_DETAIL_STATE],
          pageNameAccessLabel: CORE.PageName.customer
        },
        callbackFn: getCustomerList,
        onSelectCallbackFn: () => {

        }
      };
    };

    init();

    // Set Empty bin in case of remaing stock will Zero
    const setEmptyBin = () => {
      vm.uidTransfer.ScanWHBin = null;
      vm.uidScanned = vm.modalData.uid || vm.scanFromList ? vm.ScanVerifyUMID : vm.uidTransfer.ScanUID;
      if (vm.uidScanned) {
        if (vm.modalData.transferStockType === vm.transferStockType.Adjust) {
          if (vm.uidTransfer.consumedPkgUnit === 0) {
            vm.uidTransfer.ScanWHBin = vm.CORE_SystemGenratedWarehouseBin.bin.EmptyBin.name;
          }
        } else {
          if (vm.uidTransfer.remainingPkgQty === 0) {
            vm.uidTransfer.ScanWHBin = vm.CORE_SystemGenratedWarehouseBin.bin.EmptyBin.name;
          }
        }
      }
    };

    // Set focus for case to case for handle tab & shift tab functionality - Enter New Count
    vm.setFocusForQty = (event) => {
      if (vm.modalData.updateStock) {
        setEmptyBin();
      }
      if (((!event.shiftKey && event.keyCode === 9) || event.keyCode === 13) && (vm.modalData.transferStockType === vm.transferStockType.Scrapped || vm.modalData.transferStockType === vm.transferStockType.Expired || vm.modalData.transferStockType === vm.transferStockType.Adjust)) {
        event.stopImmediatePropagation();
        event.preventDefault();
        $timeout(() => {
          setFocus('updateMaterialNotes');
        });
      } else if ((!event.shiftKey && event.keyCode === 9) || event.keyCode === 13) {
        event.stopImmediatePropagation();
        event.preventDefault();
        $timeout(() => {
          setFocus('ScanWHBin');
        });
      } else if ((event.shiftKey && event.keyCode === 9) || event.keyCode === 13) {
        setFocus(vm.isMustKitSelectDisable ? 'confirmation-upon-saving' : 'kit-allocation-checkbox');
      }
    };

    // Set focus for case to case for handle tab functionality - Scan UMID/ Scan & Verify UMID
    vm.setFocusForScanUID = (isNeedToHandleEdit) => {
      if ((vm.modalData.uid || vm.scanFromList) && isNeedToHandleEdit) {
        setFocus('ScanVerifyUMID');
      } else if (vm.allocatedToKit.length === 1 && !vm.isMustKitSelectDisable && vm.modalData.transferStockType !== vm.transferStockType.Adjust) {
        _.map(vm.allocatedToKit, (item) => item.isReturn = true);
        setUnitControlFocus();
      } else if (!vm.isMustKitSelectDisable && vm.modalData.transferStockType !== vm.transferStockType.Adjust) {
        setFocus('kit-allocation-checkbox');
      } else {
        setUnitControlFocus();
      }
    };

    // Set Warning Messages based on Unit/count event changes
    vm.checkWarningMessage = (isTrue) => {
      let messageContent = '';
      const selectedKit = _.filter(vm.allocatedToKit, { isReturn: true }) || [];
      const totalAllocated = _.sumBy(vm.allocatedToKit, 'allocatedUnit');
      vm.warningMessage = null;
      vm.uidScanned = vm.modalData.uid || vm.scanFromList ? vm.ScanVerifyUMID : vm.uidTransfer.ScanUID;
      if (vm.uidScanned) {
        if (vm.allocatedToKit.length > 0 && vm.uidTransfer.isMustSelectKit) {
          if (!vm.isMustKitSelectDisable && !(_.find(vm.allocatedToKit, { isReturn: true })) && vm.modalData.transferStockType !== vm.transferStockType.Adjust) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.COUNT_MATERIAL_KIT_SELECTION_WARNING);
            vm.warningMessage = stringFormat(messageContent.message);
            if (vm.uidTransfer.remainingPkgQty) {
              const pkgCount = (vm.uidTransfer.remainingPkgUnit + vm.uidTransfer.remainingAdjustPkgUnitDiff);
              if (totalAllocated > pkgCount) {
                messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.COUNT_MATERIAL_WARNING_WITHOUT_SELECTED_KIT_FOR_DEALLOCATE);
                vm.warningMessage = stringFormat('{0} <br/> {1}', vm.warningMessage, messageContent.message);
              }
            }
          } else if (vm.isMustKitSelectDisable && vm.modalData.transferStockType !== vm.transferStockType.Adjust && vm.anyReleasedKit.length === 0) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.COUNT_MATERIAL_CONFIRMATION_KIT_NOT_RELEASED);
            vm.warningMessage = stringFormat(messageContent.message);
          }
        }
        if (!isTrue) {
          // If entered adjust quantity the ask for confirmation before update material
          if (vm.uidTransfer.remainingAdjustPkgQty > 0 || vm.uidTransfer.remainingAdjustPkgUnit) {
            let adjustQtyPercentage = 100 - (((vm.uidTransfer.currentConvertedPkgUnit - vm.uidTransfer.consumedPkgUnit) / vm.uidTransfer.currentConvertedPkgUnit * 10000) / 100);
            adjustQtyPercentage = adjustQtyPercentage < 0 ? (adjustQtyPercentage * -1) : adjustQtyPercentage;

            if (adjustQtyPercentage && adjustQtyPercentage > vm.CountMaterialPercentage && adjustQtyPercentage !== 100) {
              messageContent = angular.copy(selectedKit > 0 ? CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.COUNT_MATERIAL_ALLOCATE_KIT_COUNT_WARNING : CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.COUNT_MATERIAL_SELECTED_COUNT_WARNING);
              const adjustCountWarningMessage = stringFormat(messageContent.message, 'Adjusted quantity', vm.CountMaterialPercentage, vm.modalData.adjustMaterialType);
              vm.warningMessage = vm.warningMessage ? stringFormat('{0} <br/> {1}', vm.warningMessage, adjustCountWarningMessage) : adjustCountWarningMessage;
            }
          }
          if (vm.modalData.transferStockType !== vm.transferStockType.Adjust && vm.uidTransfer.remainingPkgUnit !== null) {
            // Based on kit selected or not selected manage consumed unit is greater than configured % calculation
            const consumedUnit = selectedKit.length > 0 ? _.sumBy(selectedKit, 'consumedUnits') : vm.uidTransfer.consumedPkgUnit;
            const currentUnit = selectedKit.length > 0 ? _.sumBy(selectedKit, 'allocatedUnit') : vm.uidTransfer.currentConvertedPkgUnit;
            let remainingQtyInPercentage = 100 - (((currentUnit - consumedUnit) / currentUnit * 10000) / 100);
            remainingQtyInPercentage = remainingQtyInPercentage < 0 ? (remainingQtyInPercentage * -1) : remainingQtyInPercentage;

            if (remainingQtyInPercentage && remainingQtyInPercentage > vm.CountMaterialPercentage && remainingQtyInPercentage !== 100) {
              messageContent = angular.copy(selectedKit.length > 0 ? CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.COUNT_MATERIAL_ALLOCATE_KIT_COUNT_WARNING : CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.COUNT_MATERIAL_SELECTED_COUNT_WARNING);
              const remaingCountWarningMessage = stringFormat(messageContent.message, 'Consumption', vm.CountMaterialPercentage, vm.modalData.transferStockType);
              vm.warningMessage = vm.warningMessage ? stringFormat('{0} <br/> {1}', vm.warningMessage, remaingCountWarningMessage) : remaingCountWarningMessage;
            }
          }
        }
      }
      if (vm.modalData.transferStockType === vm.transferStockType.Remaining) {
        if (vm.formUIDTransfer && vm.formUIDTransfer.remainingPkgQty && vm.formUIDTransfer.remainingPkgQty.$error && vm.formUIDTransfer.remainingPkgQty.$error.max) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.ENTER_COUNT_MORE_THAN_CURRENT_COUNT);
          vm.warningMessage = vm.warningMessage ? stringFormat('{0} <br/> {1}', vm.warningMessage, messageContent.message) : messageContent.message;
        } else if (vm.formUIDTransfer && vm.formUIDTransfer.remainingPkgUnit && vm.formUIDTransfer.remainingPkgUnit.$error && vm.formUIDTransfer.remainingPkgUnit.$error.max) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.ENTER_COUNT_MORE_THAN_CURRENT_COUNT);
          vm.warningMessage = vm.warningMessage ? stringFormat('{0} <br/> {1}', vm.warningMessage, messageContent.message) : messageContent.message;
        }
      }
      if (vm.modalData.transferStockType === vm.transferStockType.Consumed || vm.modalData.transferStockType === vm.transferStockType.Scrapped) {
        if (vm.formUIDTransfer && vm.formUIDTransfer.consumedPkgQty && vm.formUIDTransfer.consumedPkgQty.$error && vm.formUIDTransfer.consumedPkgQty.$error.max) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.ENTER_COUNT_MORE_THAN_CURRENT_COUNT);
          vm.warningMessage = vm.warningMessage ? stringFormat('{0} <br/> {1}', vm.warningMessage, messageContent.message) : messageContent.message;
        } else if (vm.formUIDTransfer && vm.formUIDTransfer.consumedPkgUnit && vm.formUIDTransfer.consumedPkgUnit.$error && vm.formUIDTransfer.consumedPkgUnit.$error.max) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.ENTER_COUNT_MORE_THAN_CURRENT_COUNT);
          vm.warningMessage = vm.warningMessage ? stringFormat('{0} <br/> {1}', vm.warningMessage, messageContent.message) : messageContent.message;
        }
      }
      if (vm.modalData.transferStockType === vm.transferStockType.Adjust && vm.modalData.adjustMaterialType === vm.adjustMaterialType.RemoveDeductCount) {
        if (vm.formUIDTransfer && vm.formUIDTransfer.remainingAdjustPkgQty && vm.formUIDTransfer.remainingAdjustPkgQty.$error && vm.formUIDTransfer.remainingAdjustPkgQty.$error.max) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.ENTER_COUNT_MORE_THAN_CURRENT_COUNT);
          vm.warningMessage = vm.warningMessage ? stringFormat('{0} <br/> {1}', vm.warningMessage, messageContent.message) : messageContent.message;
        } else if (vm.formUIDTransfer && vm.formUIDTransfer.consumedPremainingAdjustPkgUnitkgUnit && vm.formUIDTransfer.remainingAdjustPkgUnit.$error && vm.formUIDTransfer.remainingAdjustPkgUnit.$error.max) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.ENTER_COUNT_MORE_THAN_CURRENT_COUNT);
          vm.warningMessage = vm.warningMessage ? stringFormat('{0} <br/> {1}', vm.warningMessage, messageContent.message) : messageContent.message;
        }
      }
    };

    const setFormValidation = (type) => {
      switch (type) {
        case 1: {
          if (vm.uidTransfer.remainingStockClassId === -1 && ((vm.uidTransfer.remainingPkgUnit || 0) % 1 !== 0)) {
            $scope.$applyAsync(() => {
              vm.formUIDTransfer.remainingPkgUnit.$setValidity('decimalNumber', false);
            });
          } else if (vm.uidTransfer.remainingStockClassId === -1 && ((vm.uidTransfer.remainingPkgQty || 0) % 1 !== 0)) {
            $scope.$applyAsync(() => {
              vm.formUIDTransfer.remainingPkgQty.$setValidity('decimalNumber', false);
            });
          } else if (vm.formUIDTransfer && vm.formUIDTransfer.remainingPkgQty && vm.formUIDTransfer.remainingPkgUnit) {
            vm.formUIDTransfer.remainingPkgQty.$setValidity('decimalNumber', true);
            vm.formUIDTransfer.remainingPkgUnit.$setValidity('decimalNumber', true);
          }
          break;
        }
        case 2: {
          if (vm.uidTransfer.consumedStockClassId === -1 && ((vm.uidTransfer.consumedPkgUnit || 0) % 1 !== 0)) {
            $scope.$applyAsync(() => {
              vm.formUIDTransfer.consumedPkgUnit.$setValidity('decimalNumber', false);
            });
          } else if (vm.uidTransfer.consumedStockClassId === -1 && ((vm.uidTransfer.consumedPkgQty || 0) % 1 !== 0)) {
            $scope.$applyAsync(() => {
              vm.formUIDTransfer.consumedPkgQty.$setValidity('decimalNumber', false);
            });
          } else if (vm.formUIDTransfer && vm.formUIDTransfer.consumedPkgQty && vm.formUIDTransfer.consumedPkgUnit) {
            vm.formUIDTransfer.consumedPkgQty.$setValidity('decimalNumber', true);
            vm.formUIDTransfer.consumedPkgUnit.$setValidity('decimalNumber', true);
          }
          break;
        }
        case 3: {
          if (vm.uidTransfer.consumedStockClassId === -1 && ((vm.uidTransfer.remainingAdjustPkgUnit || 0) % 1 !== 0)) {
            $scope.$applyAsync(() => {
              vm.formUIDTransfer.remainingAdjustPkgUnit.$setValidity('decimalNumber', false);
            });
          } else if (vm.uidTransfer.consumedStockClassId === -1 && ((vm.uidTransfer.remainingAdjustPkgQty || 0) % 1 !== 0)) {
            $scope.$applyAsync(() => {
              vm.formUIDTransfer.remainingAdjustPkgQty.$setValidity('decimalNumber', false);
            });
          } else if (vm.formUIDTransfer && vm.formUIDTransfer.remainingAdjustPkgQty && vm.formUIDTransfer.remainingAdjustPkgUnit) {
            vm.formUIDTransfer.remainingAdjustPkgQty.$setValidity('decimalNumber', true);
            vm.formUIDTransfer.remainingAdjustPkgUnit.$setValidity('decimalNumber', true);
          }
          break;
        }
      }
    };

    // Invoke when change remaining units
    vm.changeRemainingUnit = () => {
      vm.uidTransfer.currentPkgUnit = vm.uidTransfer.currentConvertedPkgUnit ? convertUnitWithDecimalPlace(vm.uidTransfer.currentConvertedPkgUnit) : 0;
      vm.uidTransfer.currentPkgQty = vm.uidTransfer.pkgQty ? convertUnitWithDecimalPlace(vm.uidTransfer.pkgQty) : 0;
      if (vm.uidTransfer.remainingPkgUnit !== null) {
        setFormValidation(1);
      }
      if (vm.uidTransfer.remainingPkgUnit !== null && vm.uidTransfer.remainingPkgUnit >= 0) {
        vm.uidTransfer.remainingAdjustPkgUnit = null;
        vm.uidTransfer.remainingAdjustPkgQty = null;
        vm.uidTransfer.remainingAdjustPkgUnitDiff = null;
        vm.uidTransfer.remainingAdjustPkgQtyDiff = null;
        vm.uidTransfer.consumedPkgUnit = convertUnitWithDecimalPlace(vm.uidTransfer.currentConvertedPkgUnit - vm.uidTransfer.remainingPkgUnit);
        vm.uidTransfer.remainingPkgQty = convertUnitWithDecimalPlace((vm.uidTransfer.remainingPkgUnit * vm.uidTransfer.pkgQty) / vm.uidTransfer.currentConvertedPkgUnit);
        vm.uidTransfer.consumedPkgQty = convertUnitWithDecimalPlace(vm.uidTransfer.pkgQty - vm.uidTransfer.remainingPkgQty);
      } else {
        vm.uidTransfer.remainingPkgQty = null;
        vm.uidTransfer.consumedPkgQty = null;
        vm.uidTransfer.consumedPkgUnit = null;
      }
      vm.selectKitToReturn();
    };

    // Invoke when change remaining count
    vm.changeRemainingQty = () => {
      vm.uidTransfer.currentPkgUnit = vm.uidTransfer.currentConvertedPkgUnit ? convertUnitWithDecimalPlace(vm.uidTransfer.currentConvertedPkgUnit) : 0;
      vm.uidTransfer.currentPkgQty = vm.uidTransfer.pkgQty ? convertUnitWithDecimalPlace(vm.uidTransfer.pkgQty) : 0;
      if (vm.uidTransfer.remainingPkgQty !== null) {
        setFormValidation(1);
      }
      if (vm.uidTransfer.remainingPkgQty !== null && vm.uidTransfer.remainingPkgQty >= 0) {
        vm.uidTransfer.remainingAdjustPkgUnit = null;
        vm.uidTransfer.remainingAdjustPkgQty = null;
        vm.uidTransfer.remainingAdjustPkgUnitDiff = null;
        vm.uidTransfer.remainingAdjustPkgQtyDiff = null;
        vm.uidTransfer.consumedPkgQty = convertUnitWithDecimalPlace(vm.uidTransfer.pkgQty - vm.uidTransfer.remainingPkgQty);
        vm.uidTransfer.remainingPkgUnit = convertUnitWithDecimalPlace((vm.uidTransfer.remainingPkgQty * vm.uidTransfer.currentConvertedPkgUnit) / vm.uidTransfer.pkgQty);
        vm.uidTransfer.consumedPkgUnit = convertUnitWithDecimalPlace(vm.uidTransfer.currentConvertedPkgUnit - vm.uidTransfer.remainingPkgUnit);
      } else {
        vm.uidTransfer.remainingPkgUnit = null;
        vm.uidTransfer.consumedPkgQty = null;
        vm.uidTransfer.consumedPkgUnit = null;
      }
      vm.selectKitToReturn();
    };

    // Invoke when change consumed units
    vm.changeConsumedUnit = () => {
      vm.uidTransfer.currentPkgUnit = vm.uidTransfer.currentConvertedPkgUnit ? convertUnitWithDecimalPlace(vm.uidTransfer.currentConvertedPkgUnit) : 0;
      vm.uidTransfer.currentPkgQty = vm.uidTransfer.pkgQty ? convertUnitWithDecimalPlace(vm.uidTransfer.pkgQty) : 0;
      if (vm.uidTransfer.consumedPkgUnit !== null) {
        setFormValidation(2);
      }
      if (vm.uidTransfer.consumedPkgUnit !== null && vm.uidTransfer.consumedPkgUnit >= 0) {
        vm.uidTransfer.remainingPkgUnit = convertUnitWithDecimalPlace(vm.uidTransfer.currentConvertedPkgUnit - vm.uidTransfer.consumedPkgUnit);
        vm.uidTransfer.consumedPkgQty = vm.uidTransfer.consumedPkgUnit === null ? null : convertUnitWithDecimalPlace((vm.uidTransfer.consumedPkgUnit * vm.uidTransfer.pkgQty) / vm.uidTransfer.currentConvertedPkgUnit);
        vm.uidTransfer.remainingPkgQty = convertUnitWithDecimalPlace(vm.uidTransfer.pkgQty - vm.uidTransfer.consumedPkgQty);
      } else {
        vm.uidTransfer.consumedPkgQty = null;
        vm.uidTransfer.remainingPkgQty = null;
        vm.uidTransfer.remainingPkgUnit = null;
      }
      vm.selectKitToReturn();
    };

    // Invoke when change consumed count
    vm.changeConsumedQty = () => {
      vm.uidTransfer.currentPkgUnit = vm.uidTransfer.currentConvertedPkgUnit ? convertUnitWithDecimalPlace(vm.uidTransfer.currentConvertedPkgUnit) : 0;
      vm.uidTransfer.currentPkgQty = vm.uidTransfer.pkgQty ? convertUnitWithDecimalPlace(vm.uidTransfer.pkgQty) : 0;
      if (vm.uidTransfer.consumedPkgQty !== null) {
        setFormValidation(2);
      }
      if (vm.uidTransfer.consumedPkgQty !== null && vm.uidTransfer.consumedPkgQty >= 0) {
        vm.uidTransfer.remainingPkgQty = convertUnitWithDecimalPlace(vm.uidTransfer.pkgQty - vm.uidTransfer.consumedPkgQty);
        vm.uidTransfer.consumedPkgUnit = convertUnitWithDecimalPlace((vm.uidTransfer.consumedPkgQty * vm.uidTransfer.currentConvertedPkgUnit) / vm.uidTransfer.pkgQty);
        vm.uidTransfer.remainingPkgUnit = convertUnitWithDecimalPlace(vm.uidTransfer.currentConvertedPkgUnit - vm.uidTransfer.consumedPkgUnit);
      } else {
        vm.uidTransfer.consumedPkgUnit = null;
        vm.uidTransfer.remainingPkgQty = null;
        vm.uidTransfer.remainingPkgUnit = null;
      }
      vm.selectKitToReturn();
    };

    //Invoke when change adjust unit
    vm.changeRemainingAdjustUnit = () => {
      vm.uidTransfer.currentPkgUnit = vm.uidTransfer.currentConvertedPkgUnit ? convertUnitWithDecimalPlace(vm.uidTransfer.currentConvertedPkgUnit) : 0;
      vm.uidTransfer.currentPkgQty = vm.uidTransfer.pkgQty ? convertUnitWithDecimalPlace(vm.uidTransfer.pkgQty) : 0;
      if (vm.uidTransfer.remainingAdjustPkgUnit !== null) {
        setFormValidation(3);
      }
      if (vm.uidTransfer.remainingAdjustPkgUnit !== null && vm.uidTransfer.remainingAdjustPkgUnit >= 0) {
        vm.uidTransfer.remainingAdjustPkgQty = vm.uidTransfer.remainingAdjustPkgUnit === null ? null : (vm.uidTransfer.pkgQty > 0 ?
          convertUnitWithDecimalPlace((vm.uidTransfer.remainingAdjustPkgUnit * vm.uidTransfer.pkgQty) / vm.uidTransfer.currentConvertedPkgUnit) :
          convertUnitWithDecimalPlace((vm.uidTransfer.remainingAdjustPkgUnit * vm.uidTransfer.orgqty) / vm.uidTransfer.orgConvertedPkgUnit));

        vm.uidTransfer.remainingPkgUnit = vm.uidTransfer.currentConvertedPkgUnit;
        vm.uidTransfer.remainingPkgQty = convertUnitWithDecimalPlace((vm.uidTransfer.remainingPkgUnit * vm.uidTransfer.pkgQty) / vm.uidTransfer.currentConvertedPkgUnit);

        if (vm.modalData.adjustMaterialType === vm.adjustMaterialType.NewCount) {
          vm.uidTransfer.remainingAdjustPkgQtyDiff = (vm.uidTransfer.remainingAdjustPkgQty - vm.uidTransfer.remainingPkgQty);
          vm.uidTransfer.remainingAdjustPkgUnitDiff = (vm.uidTransfer.remainingAdjustPkgUnit - vm.uidTransfer.remainingPkgUnit);
          vm.uidTransfer.consumedPkgUnit = vm.uidTransfer.remainingAdjustPkgUnit;
          vm.uidTransfer.consumedPkgQty = vm.uidTransfer.remainingAdjustPkgQty;
        } else if (vm.modalData.adjustMaterialType === vm.adjustMaterialType.AddAppendCount) {
          vm.uidTransfer.remainingAdjustPkgQtyDiff = vm.uidTransfer.remainingAdjustPkgQty;
          vm.uidTransfer.remainingAdjustPkgUnitDiff = vm.uidTransfer.remainingAdjustPkgUnit;
          vm.uidTransfer.consumedPkgUnit = (vm.uidTransfer.remainingPkgUnit + vm.uidTransfer.remainingAdjustPkgUnit);
          vm.uidTransfer.consumedPkgQty = (vm.uidTransfer.remainingPkgQty + vm.uidTransfer.remainingAdjustPkgQty);
        } else if (vm.modalData.adjustMaterialType === vm.adjustMaterialType.RemoveDeductCount) {
          vm.uidTransfer.remainingAdjustPkgQtyDiff = (vm.uidTransfer.remainingAdjustPkgQty * -1);
          vm.uidTransfer.remainingAdjustPkgUnitDiff = (vm.uidTransfer.remainingAdjustPkgUnit * -1);
          vm.uidTransfer.consumedPkgUnit = (vm.uidTransfer.remainingPkgUnit - vm.uidTransfer.remainingAdjustPkgUnit);
          vm.uidTransfer.consumedPkgQty = (vm.uidTransfer.remainingPkgQty - vm.uidTransfer.remainingAdjustPkgQty);
        }
      } else {
        vm.uidTransfer.remainingAdjustPkgQty = null;
        vm.uidTransfer.consumedPkgQty = null;
        vm.uidTransfer.consumedPkgUnit = null;
        vm.uidTransfer.remainingAdjustPkgQtyDiff = null;
        vm.uidTransfer.remainingAdjustPkgUnitDiff = null;
      }
      vm.checkWarningMessage();
    };

    // Invoke when change adjust count
    vm.changeRemainingAdjustQty = () => {
      vm.uidTransfer.currentPkgUnit = vm.uidTransfer.currentConvertedPkgUnit ? convertUnitWithDecimalPlace(vm.uidTransfer.currentConvertedPkgUnit) : 0;
      vm.uidTransfer.currentPkgQty = vm.uidTransfer.pkgQty ? convertUnitWithDecimalPlace(vm.uidTransfer.pkgQty) : 0;
      if (vm.uidTransfer.remainingAdjustPkgQty !== null) {
        setFormValidation(3);
      }
      if (vm.uidTransfer.remainingAdjustPkgQty !== null && vm.uidTransfer.remainingAdjustPkgQty >= 0) {
        vm.uidTransfer.remainingAdjustPkgUnit = vm.uidTransfer.pkgQty > 0 ?
          convertUnitWithDecimalPlace((vm.uidTransfer.remainingAdjustPkgQty * vm.uidTransfer.currentConvertedPkgUnit) / vm.uidTransfer.pkgQty) :
          convertUnitWithDecimalPlace((vm.uidTransfer.remainingAdjustPkgQty * vm.uidTransfer.orgConvertedPkgUnit) / vm.uidTransfer.orgqty);

        vm.uidTransfer.remainingPkgUnit = vm.uidTransfer.currentConvertedPkgUnit;
        vm.uidTransfer.remainingPkgQty = convertUnitWithDecimalPlace((vm.uidTransfer.remainingPkgUnit * vm.uidTransfer.pkgQty) / vm.uidTransfer.currentConvertedPkgUnit);

        if (vm.modalData.adjustMaterialType === vm.adjustMaterialType.NewCount) {
          vm.uidTransfer.remainingAdjustPkgQtyDiff = (vm.uidTransfer.remainingAdjustPkgQty - vm.uidTransfer.remainingPkgQty);
          vm.uidTransfer.remainingAdjustPkgUnitDiff = (vm.uidTransfer.remainingAdjustPkgUnit - vm.uidTransfer.remainingPkgUnit);
          vm.uidTransfer.consumedPkgUnit = vm.uidTransfer.remainingAdjustPkgUnit;
          vm.uidTransfer.consumedPkgQty = vm.uidTransfer.remainingAdjustPkgQty;
        } else if (vm.modalData.adjustMaterialType === vm.adjustMaterialType.AddAppendCount) {
          vm.uidTransfer.remainingAdjustPkgQtyDiff = vm.uidTransfer.remainingAdjustPkgQty;
          vm.uidTransfer.remainingAdjustPkgUnitDiff = vm.uidTransfer.remainingAdjustPkgUnit;
          vm.uidTransfer.consumedPkgUnit = (vm.uidTransfer.remainingPkgUnit + vm.uidTransfer.remainingAdjustPkgUnit);
          vm.uidTransfer.consumedPkgQty = (vm.uidTransfer.remainingPkgQty + vm.uidTransfer.remainingAdjustPkgQty);
        } else if (vm.modalData.adjustMaterialType === vm.adjustMaterialType.RemoveDeductCount) {
          vm.uidTransfer.remainingAdjustPkgQtyDiff = (vm.uidTransfer.remainingAdjustPkgQty * -1);
          vm.uidTransfer.remainingAdjustPkgUnitDiff = (vm.uidTransfer.remainingAdjustPkgUnit * -1);
          vm.uidTransfer.consumedPkgUnit = (vm.uidTransfer.remainingPkgUnit - vm.uidTransfer.remainingAdjustPkgUnit);
          vm.uidTransfer.consumedPkgQty = (vm.uidTransfer.remainingPkgQty - vm.uidTransfer.remainingAdjustPkgQty);
        }
      } else {
        vm.uidTransfer.remainingAdjustPkgUnit = null;
        vm.uidTransfer.consumedPkgQty = null;
        vm.uidTransfer.consumedPkgUnit = null;
        vm.uidTransfer.remainingAdjustPkgQtyDiff = null;
        vm.uidTransfer.remainingAdjustPkgUnitDiff = null;
      }
      vm.checkWarningMessage();
    };

    vm.changeStockStatus = () => {
      if (vm.umidStock !== vm.UMIDStockType.CustomerConsignedStock.key) {
        vm.autoCompleteCustomer.keyColumnId = null;
      }
      vm.stockErrorMessage = null;
    };

    // Must Select Kit change event
    vm.changeMustSelectKit = () => {
      if (!vm.uidTransfer.isMustSelectKit && !vm.isOneTimeValidationForAccess) {
        DialogFactory.dialogService(
          CORE.VERIFY_USER_PASSWORD_POPUP_CONTROLLER,
          CORE.VERIFY_USER_PASSWORD_POPUP_VIEW,
          null,
          vm.accessLevelDetail).then((data) => {
            if (data) {
              // If Credential is entered by upervisor then OneTime Validation Flag is true
              vm.isOneTimeValidationForAccess = true;
            }
          }, () => {
            // If Login user is not authorized person then Must Select Kit will be true
            vm.uidTransfer.isMustSelectKit = true;
            vm.isOneTimeValidationForAccess = false;
          }, (err) => BaseService.getErrorLog(err));
      }
      vm.checkWarningMessage();
    };

    vm.changeEntryType = () => {
      //Reset comment
      vm.uidTransfer.updateMaterialNotes = null;
      vm.warningMessage = null;

      //Reset calculated value
      vm.uidTransfer.remainingAdjustPkgUnit = null;
      vm.uidTransfer.remainingAdjustPkgQty = null;
      vm.uidTransfer.remainingAdjustPkgUnitDiff = null;
      vm.uidTransfer.remainingAdjustPkgQtyDiff = null;
      vm.uidTransfer.consumedPkgQty = null;
      vm.uidTransfer.consumedPkgUnit = null;
      vm.uidTransfer.remainingPkgQty = null;
      vm.uidTransfer.remainingPkgUnit = null;
      if (vm.autoCompleteRemainingStockUOM) {
        vm.autoCompleteRemainingStockUOM.keyColumnId = vm.uidTransfer.uom;
      }
      if (vm.autoCompleteConsumedStockUOM) {
        vm.autoCompleteConsumedStockUOM.keyColumnId = vm.uidTransfer.uom;
      }
      if (vm.uidTransfer) {
        vm.uidTransfer.currentConvertedPkgUnit = vm.uidTransfer.pkgUnit;
        vm.uidTransfer.orgConvertedPkgUnit = vm.uidTransfer.orgPkgUnit;
        if (vm.modalData.transferStockType === vm.transferStockType.ZeroOut || vm.modalData.transferStockType === vm.transferStockType.Expired) {
          vm.uidTransfer.consumedPkgQty = vm.uidTransfer.pkgQty;
          vm.uidTransfer.consumedPkgUnit = vm.uidTransfer.pkgUnit;
          vm.changeConsumedUnit();

          vm.uidTransfer.remainingStockUOM = vm.uidTransfer.originalStockUOM;
          vm.uidTransfer.consumedStockUOM = vm.uidTransfer.originalStockUOM;
        } else {
          vm.uidTransfer.remainingPkgQty = vm.uidTransfer.pkgQty;
          vm.uidTransfer.remainingPkgUnit = vm.uidTransfer.pkgUnit;
        }

        if (vm.modalData.transferStockType === vm.transferStockType.Adjust) {
          vm.modalData.adjustMaterialType = vm.adjustMaterialType.NewCount;
        } else {
          vm.modalData.adjustMaterialType = null;
        }
      }
      if (vm.modalData.transferStockType === vm.transferStockType.Remaining) {
        vm.uidTransfer.remainingPkgQty = null;
        vm.uidTransfer.remainingPkgUnit = null;
      }
      if (vm.modalData.transferStockType === vm.transferStockType.Adjust) {
        vm.uidTransfer.remainingAdjustPkgQty = null;
        vm.uidTransfer.remainingAdjustPkgUnit = null;
        vm.uidTransfer.consumedPkgQty = vm.uidTransfer.pkgQty;
        vm.uidTransfer.consumedPkgUnit = vm.uidTransfer.pkgUnit;
        // In case of Adjust material type Must Select Kit should be disable
        vm.isMustKitSelectDisable = true;
        _.map(vm.allocatedToKit, (item) => {
          item.isReturn = false;
          item.consumedUnits = item.returnUnits = item.scrapExpiredUnits = 0;
        });
      } else {
        // set Must Select Kit value on change of entry type
        vm.isMustKitSelectDisable = vm.anyReleasedKit && vm.anyReleasedKit.length > 0 ? false : true;
      }
      if (vm.modalData.updateStock) {
        setEmptyBin();
        vm.setFocusForScanUID(vm.ScanVerifyUMID ? false : true);
      }
    };

    vm.changeAdjustmentType = () => {
      vm.uidTransfer.remainingAdjustPkgUnit = null;
      vm.uidTransfer.remainingAdjustPkgQty = null;
      vm.uidTransfer.remainingAdjustPkgUnitDiff = null;
      vm.uidTransfer.remainingAdjustPkgQtyDiff = null;
      vm.uidTransfer.remainingPkgQty = vm.uidTransfer.pkgQty;
      vm.uidTransfer.remainingPkgUnit = vm.uidTransfer.pkgUnit;
      vm.changeRemainingAdjustUnit();
    };

    function setUnitControlFocus() {
      if (vm.modalData.transferStockType === vm.transferStockType.Remaining) {
        setFocus('remainingPkgQty');
      }
      else if (vm.modalData.transferStockType === vm.transferStockType.Consumed || vm.modalData.transferStockType === vm.transferStockType.Scrapped) {
        setFocus('consumedPkgQty');
      } else if (vm.modalData.transferStockType === vm.transferStockType.Adjust) {
        setFocus('remainingAdjustPkgQty');
      } else if (vm.modalData.transferStockType === vm.transferStockType.Expired) {
        setFocus('updateMaterialNotes');
      } else if (vm.modalData.transferStockType === vm.transferStockType.ZeroOut) {
        setFocus('ScanWHBin');
      }
    }

    // go to uom list page
    vm.goToUOMList = () => {
      BaseService.goToUOMList();
    };

    vm.goToManufacturer = () => {
      BaseService.goToManufacturer(vm.uidTransfer.mfgCodeID);
    };

    /** Redirect to Kit Allocation page */
    vm.goToKitList = (data) => {
      BaseService.goToKitList(data.refSalesOrderDetID, data.assyID);
    };

    /** Redirect to bin page */
    vm.goToBinList = () => {
      BaseService.openInNew(TRANSACTION.TRANSACTION_BIN_STATE, {});
    };

    /** Redirect to WH page */
    vm.goToWHList = () => {
      BaseService.openInNew(TRANSACTION.TRANSACTION_WAREHOUSE_STATE, {});
    };

    /** Redirect to umid list page */
    vm.goToUMIDList = () => {
      BaseService.goToUMIDList();
    };

    /** Redirect to manage umid page */
    vm.goToUMIDDetail = () => BaseService.goToUMIDDetail(vm.uidTransfer.umidId);

    //go to manage part number
    vm.goToAssyMaster = () => {
      BaseService.goToComponentDetailTab(vm.uidTransfer.mfgType.toLowerCase(), vm.uidTransfer.componentID, USER.PartMasterTabs.Detail.Name);
      return false;
    };

    //go to manufacturer list page
    vm.goToManufacturerList = () => {
      BaseService.goToManufacturerList();
    };

    //go to part list page
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };

    //go to mounting type list page
    vm.goToMountingTypeList = () => {
      BaseService.goToMountingTypeList();
    };

    //go to package case list page
    vm.goToPackageCaseTypeList = () => {
      BaseService.goToPackageCaseTypeList();
    };

    vm.stringFormat = stringFormat;

    // Check Form Dirty state on state change or reload browser
    angular.element(() => {
      vm.isOneTimeValidationForAccess = false;
      BaseService.currentPagePopupForm = [vm.formUIDTransfer];
      if (vm.modalData.transactionID) {
        IntransitUMID();
      }
    });

    //Get allocated kit detail of scan UMID
    function getKitDetail(umidId) {
      vm.cgBusyLoading = KitAllocationFactory.getAllocatedKitForUMID({ umidId: umidId }).query().$promise.then((res) => {
        if (res && res.data) {
          vm.allocatedToKit = res.data || [];
          if (vm.allocatedToKit.length > 0) {
            _.map(vm.allocatedToKit, (item) => {
              item.isDisable = item.kitReleaseStatus === vm.Kit_Release_Status.NotReleased || item.kitReleaseStatus === vm.Kit_Release_Status.ReadyToRelease ? true : false;
              item.isReturn = false;
            });
            vm.anyReleasedKit = _.filter(vm.allocatedToKit, (item) => item.isDisable === false) || [];
          } else {
            vm.anyReleasedKit = [];
          }
          vm.isMustKitSelectDisable = vm.anyReleasedKit && vm.anyReleasedKit.length > 0 ? false : true;
          vm.setFocusForScanUID(true);
          if (vm.allocatedToKit.length > 0) {
            calculateKitCount();
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    // Select kit to return UMID
    vm.selectKitToReturn = (isScanToVerify) => {
      calculateKitCount();
      vm.checkWarningMessage(isScanToVerify);
    };

    // Assign return and consumed units to display
    function calculateCount() {
      let sumOfConsumedKit = 0;
      let tempConsumedUnit = vm.uidTransfer.consumedPkgUnit;
      const selectedKit = _.filter(vm.allocatedToKit, { isReturn: true });
      const totalAllocatedUnit = _.sumBy(selectedKit, 'allocatedUnit');
      _.each(selectedKit, (item) => {
        if (vm.modalData.transferStockType === vm.transferStockType.Scrapped || vm.modalData.transferStockType === vm.transferStockType.Expired) {
          item.consumedUnits = 0;
          if (item.uomClassID === vm.MEASUREMENT_TYPES_COUNT.ID) {
            item.scrapExpiredUnits = roundUpNum(convertUnitWithDecimalPlace((vm.uidTransfer.consumedPkgUnit * item.allocatedUnit) / totalAllocatedUnit));
            if (tempConsumedUnit && item.scrapExpiredUnits > tempConsumedUnit) {
              item.scrapExpiredUnits = tempConsumedUnit;
            }
            tempConsumedUnit = convertUnitWithDecimalPlace(vm.uidTransfer.consumedPkgUnit - item.scrapExpiredUnits);
          } else {
            item.scrapExpiredUnits = convertUnitWithDecimalPlace((vm.uidTransfer.consumedPkgUnit * item.allocatedUnit) / totalAllocatedUnit);
          }
          sumOfConsumedKit = sumOfConsumedKit + item.scrapExpiredUnits;
        } else {
          if (item.uomClassID === vm.MEASUREMENT_TYPES_COUNT.ID) {
            item.consumedUnits = roundUpNum(convertUnitWithDecimalPlace((vm.uidTransfer.consumedPkgUnit * item.allocatedUnit) / totalAllocatedUnit));
            if (tempConsumedUnit && item.consumedUnits > tempConsumedUnit) {
              item.consumedUnits = tempConsumedUnit;
            }
            tempConsumedUnit = convertUnitWithDecimalPlace(vm.uidTransfer.consumedPkgUnit - item.consumedUnits);
          } else {
            item.consumedUnits = convertUnitWithDecimalPlace((vm.uidTransfer.consumedPkgUnit * item.allocatedUnit) / totalAllocatedUnit);
          }
          sumOfConsumedKit = sumOfConsumedKit + item.consumedUnits;
          item.scrapExpiredUnits = 0;
        }
        item.returnUnits = convertUnitWithDecimalPlace(vm.uidTransfer.currentPkgUnit - sumOfConsumedKit);
      });
    }

    function calculateKitCount() {
      _.each(vm.allocatedToKit, (kitDetail) => {
        kitDetail.consumedUnits = 0;
        kitDetail.returnUnits = 0;
        kitDetail.scrapExpiredUnits = 0;
      });
      const kitDetail = _.filter(vm.allocatedToKit, { isReturn: true });
      if (kitDetail.length > 0) {
        if (vm.modalData.transferStockType === vm.transferStockType.Remaining) {
          if (vm.uidTransfer.remainingPkgUnit !== null) {
            calculateCount();
          }
        } else if (vm.modalData.transferStockType === vm.transferStockType.Expired || vm.modalData.transferStockType === vm.transferStockType.Consumed || vm.modalData.transferStockType === vm.transferStockType.Scrapped || vm.modalData.transferStockType === vm.transferStockType.ZeroOut) {
          if (vm.uidTransfer.consumedPkgUnit !== null) {
            calculateCount();
          }
        }
      }
    }

    // [S] Socket Listeners
    function connectSocket() {
      socketConnectionService.on(CORE.Socket_IO_Events.InoAuto.updateCartStatus, updateCartStatus);
      socketConnectionService.on(CORE.Socket_IO_Events.InoAuto.updateCheckinRequestStatus, updateCheckinStatus);
      socketConnectionService.on(CORE.Socket_IO_Events.InoAuto.updateCancelRequest, updateCancelRequestStatus);
      socketConnectionService.on(CORE.Socket_IO_Events.InoAuto.updateCheckOutRequest, updateCheckOutRequest);
      socketConnectionService.on(CORE.Socket_IO_Events.InoAuto.updateAssignDepartmentRequest, updateAssignDepartmentRequest);
      socketConnectionService.on(CORE.Socket_IO_Events.InoAuto.updateForceDeliverRequest, updateForceDeliverRequest);
      socketConnectionService.on(CORE.Socket_IO_Events.InoAuto.updateUsertoMapandPick, updateUsertoMapandPick);
    }
    connectSocket();

    socketConnectionService.on('reconnect', () => {
      connectSocket();
    });
    function removeSocketListener() {
      socketConnectionService.removeListener(CORE.Socket_IO_Events.InoAuto.updateCartStatus, updateCartStatus);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.InoAuto.updateCheckinRequestStatus, updateCheckinStatus);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.InoAuto.updateCancelRequest, updateCancelRequestStatus);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.InoAuto.updateCheckOutRequest, updateCheckOutRequest);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.InoAuto.updateAssignDepartmentRequest, updateAssignDepartmentRequest);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.InoAuto.updateForceDeliverRequest, updateForceDeliverRequest);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.InoAuto.updateUsertoMapandPick, updateUsertoMapandPick);
    }

    vm.transitUMIDList = [];

    $scope.$on('$destroy', () => {
      vm.cancelRequest();
      //WarehouseBinFactory.pickedReelList=_.filter(WarehouseBinFactory.pickedReelList, (itemObj) => { return itemObj.OriginalTransactionID != vm.modalData.transactionID });
      // Remove socket listeners
      removeSocketListener();
    });

    // on disconnect socket
    socketConnectionService.on('disconnect', () => {
      removeSocketListener();
    });

    function updateForceDeliverRequest(request) {
      if (vm.modalData.transactionID && vm.modalData.transactionID === request.OriginalTransactionID) {
        if (!_.find(vm.transitUMIDList, (item) => item.umid === request.UID)) {
          const objTransferUMID = {
            umid: request.UID,
            location: request.Slot,
            warehouse: request.warehouseName,
            deptName: request.deptName,
            side: request.Side === TRANSACTION.Warehouse_Audit_Side.L.key ? TRANSACTION.Warehouse_Audit_Side.L.value : TRANSACTION.Warehouse_Audit_Side.R.value
          };
          vm.transitUMIDList.push(objTransferUMID);
        }
      }
    }
    function updateUsertoMapandPick(item) {
      if (item.response.userID !== BaseService.loginUser.userid && vm.modalData.transactionID && vm.modalData.transactionID === item.response.TransactionID) {
        commonSetTransaction();
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.COLOR_PICKED_USER);
        messageContent.message = stringFormat(messageContent.message, item.response.ledColorName, item.response.userName);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
      }
      if (item.response.userID === BaseService.loginUser.userid && vm.modalData.transactionID && vm.modalData.transactionID !== item.response.TransactionID) {
        vm.modalData.transactionID = item.response.TransactionID;
        vm.ledcssColorClass = item.response.ledColorCssClass;
        vm.userType = stringFormat('Pick {0} [{1}]', item.response.ledColorName, item.response.searchUserName);
      }
    }
    /**
     * Update cart status online/offline
     * @param {any} response
     */
    function updateCartStatus(response) {
      // console.log('receive', response, new Date());
      if (response) {
        const cartDetail = _.find(response.cartList, (status) => status.uniqueCartID === WHBinData.uniqueCartID);
        if (cartDetail) {
          vm.image = cartDetail.isCartOnline ? CartOnlineImagePath : CartOfflineImagePath;
          vm.isWHBinDisable = true;
          if (!cartDetail.isCartOnline) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.STATUS_OFFLINE_WH);
            messageContent.message = stringFormat(messageContent.message, vm.uidTransfer.ScanWHBin);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                if (vm.isFromUMID && vm.isLockBin && !(vm.modalData.uid || vm.scanFromList)) {
                  vm.clearUMIDForLockBin();
                } else {
                  callBackFunction();
                }
              }
            }, () => {
            }).catch((error) => BaseService.getErrorLog(error));
            return;
          } else {
            if (!vm.iscartCheckin && vm.scanWHProgress) {
              checkColorAvailibility(CORE.InoautoCart);
            }
            // confirmSideForWareHouse(vm.uidTransfer.ScanWHBin, vm.event);
          }
        }
      }
    }

    //focus on sacn field
    function callBackFunction() {
      vm.open = false;
      vm.isWHBinDisable = false;
      vm.iscartCheckin = false;
      vm.transactionID = null;
      vm.image = null;
      vm.whSide = null;
      vm.promptColorDetails = null;
      vm.uidTransfer.ScanWHBin = null;
      vm.uidTransfer.toBin = null;
      vm.uidTransfer.toDepartment = null;
      vm.uidTransfer.toWarehouse = null;
      vm.AssignDepartmentTransactionID = null;
      vm.scanWHProgress = false;
      setFocus('ScanWHBin');
    }

    /**
    * Update Checkin Status
    * @param {any} response
    */
    //check timer and update in all details
    const tickActivity = () => {
      setTimeoutActivity = setInterval(() => {
        activityStartTime = activityStartTime - 1;
        vm.currentTimerDiff = secondsToTime(activityStartTime, true);
        if (activityStartTime === 0) {
          activityStartTime = vm.Checkintimeout;
          clearInterval(setTimeoutActivity);
          vm.currentTimerDiff = null;
          cancelCheckinRequest();
          cancelRequestAlert(CORE.INO_AUTO_RESPONSE.SUCCESS);
          return;
        }
      }, _configSecondTimeout);
    };
    //get checkin response and if department mismatch then it will ask confirmation to change department
    function updateCheckinStatus(response) {
      if (response && vm.transactionID === response.TransactionID && response.PromptIndicator === vm.promptColorDetails.ledColorValue) {
        // console.log('receive', response, new Date());
        if (response.Response !== CORE.INO_AUTO_RESPONSE.SUCCESS && !vm.open) {
          if (CORE.INO_AUTO_RESPONSE.PromptUse === response.Response) {
            checkColorAvailibility(CORE.InoautoCart);
          } else if (response.ResponseMessage === CORE.DEPARTMENT_ASSIGN) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.DEPART_MISMATCH_INOAUTO);
            messageContent.message = stringFormat(messageContent.message, vm.uidTransfer.toWarehouse, response.Department);

            const model = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
            };
            DialogFactory.messageConfirmDialog(model).then((yes) => {
              if (yes) {
                sendAssignDepartmentRequest(response.TowerSide[0].TowerID);
              }
            }, () => {
              if (vm.isFromUMID && vm.isLockBin && !(vm.modalData.uid || vm.scanFromList)) {
                vm.clearUMIDForLockBin();
              } else {
                callBackFunction();
              }
            }).catch((error) => BaseService.getErrorLog(error));
          } else {
            vm.open = true;
            const model = {
              title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
              textContent: stringFormat(response.ResponseMessage),
              multiple: true
            };
            DialogFactory.alertDialog(model).then((yes) => {
              if (yes) {
                if (vm.isFromUMID && vm.isLockBin && !(vm.modalData.uid || vm.scanFromList)) {
                  vm.clearUMIDForLockBin();
                } else {
                  callBackFunction();
                }
              }
            });
            return;
          }
        } else if (!vm.iscartCheckin) {
          vm.iscartCheckin = true;
          vm.message = stringFormat(CORE.MESSAGE_CONSTANT.CHECKIN_REQUSET_SUCCESS_MSG, WHBinData.Name, WHBinData.uniqueCartID);
          vm.currentTimerDiff = '';
          tickActivity();
        }
      }
    }
    //change department request in inoauto
    function updateAssignDepartmentRequest(req) {
      if (vm.AssignDepartmentTransactionID === req.TransactionID) {
        vm.open = true;

        if (req.Response === CORE.API_RESPONSE_CODE.SUCCESS) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.DEPARTMENT_SUCCESSFUL_UPDATE);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model).then((yes) => {
            if (yes) {
              if (vm.isFromUMID && vm.isLockBin && !(vm.modalData.uid || vm.scanFromList)) {
                vm.clearUMIDForLockBin();
              } else {
                callBackFunction();
              }
            }
          });
          return;
        }
        else {
          const model = {
            title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
            textContent: req.ResponseMessage,
            multiple: true
          };
          DialogFactory.alertDialog(model).then((yes) => {
            if (yes) {
              if (vm.isFromUMID && vm.isLockBin && !(vm.modalData.uid || vm.scanFromList)) {
                vm.clearUMIDForLockBin();
              } else {
                callBackFunction();
              }
            }
          });
          return;
        }
      }
    }
    //received details for cancel request
    function updateCancelRequestStatus(req) {
      if (vm.iscartCheckin) {
        if (req.allRequest && !vm.open) {
          cancelRequestAlert(req.code);
        }
        else {
          if (req.transactionID === vm.transactionID && !vm.open) {
            cancelRequestAlert(req.code);
          }
        }
      }
      if (vm.modalData.transactionID && vm.modalData.transactionID === req.transactionID) {
        $timeout(() => {
          commonSetTransaction();
        }, 1500);
      }
    }
    const commonSetTransaction = () => {
      vm.modalData.transactionID = null;
      vm.ledcssColorClass = null;
      vm.userType = null;
    };
    //cancel checkin request
    function cancelRequestAlert(code) {
      vm.open = true;
      clearInterval(setTimeoutActivity);

      vm.currentTimerDiff = null;

      let messageContent = null;
      if (code === CORE.INO_AUTO_RESPONSE.CANCEL) {
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.CANCEL_MANUALLY);
      }
      else {
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.CANCEL_TIMEOUT);
      }
      const model = {
        messageContent: messageContent,
        multiple: true
      };
      DialogFactory.messageAlertDialog(model).then((yes) => {
        if (yes) {
          if (vm.isFromUMID && vm.isLockBin && !(vm.modalData.uid || vm.scanFromList)) {
            vm.clearUMIDForLockBin();
          } else {
            callBackFunction();
          }
        }
      });
      return;
    }
    vm.assignUMIDList = [];

    //received details for successful cart placed
    function updateCheckOutRequest(req) {
      if (req.transactionID === vm.transactionID || (vm.iscartCheckin && UIDData.uid === req.reelBarCode)) {
        activityStartTime = vm.Checkintimeout;
        clearInterval(setTimeoutActivity);
        vm.currentTimerDiff = null;
        const isUMID = _.find(vm.assignUMIDList, (assUMID) => assUMID.UID === req.reelBarCode);
        if (!isUMID) {
          const objassUMID = {
            id: vm.uidTransfer.umidId,
            UID: req.reelBarCode,
            frmwarehouse: vm.uidTransfer.Warehouse,
            frmlocation: vm.uidTransfer.bin,
            frmParentWarehouse: vm.uidTransfer.department,
            towarehouse: vm.uidTransfer.toWarehouse,
            tolocation: req.slot,
            toparentWarehouse: vm.uidTransfer.toDepartment,
            timestamp: new Date(),
            index: vm.assignUMIDList.length + 1
          };
          vm.assignUMIDList.push(objassUMID);
          $rootScope.$emit(PRICING.EventName.RemoveUMIDFrmList, objassUMID);
          $scope.$broadcast(PRICING.EventName.ScannUMID, objassUMID);
          vm.modalData = vm.modalData ? vm.modalData = {} : vm.modalData;
          vm.scanFromList = true;
          vm.clearUMID();
          $timeout(() => {
            setFocus('ScanUID');
          }, 500);
        }
        //remove from pending checkout list
        const isPendingUMID = _.find(vm.transitUMIDList, (assUMID) => assUMID.umid === req.reelBarCode);
        if (isPendingUMID) {
          const objIndex = vm.transitUMIDList.indexOf(isPendingUMID);
          vm.transitUMIDList.splice(objIndex, 1);
        }
      }
    }

    function showWithoutSavingAlertForPopUp() {
      const obj = {
        title: CORE.MESSAGE_CONSTANT.WITHOUT_SAVING_ALERT_HEADER_MESSAGE,
        textContent: CORE.MESSAGE_CONSTANT.WITHOUT_SAVING_ALERT_BODY_MESSAGE,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      DialogFactory.confirmDiolog(obj).then(() => {
        if (vm.transactionID) {
          vm.cancelRequest();
        }
        else {
          vm.scanWHProgress = false;
          vm.isOneTimeValidationForAccess = false;
          BaseService.currentPagePopupForm.pop();
          $mdDialog.cancel();
        }
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    }

    //cancel request for checked in wh on page leave.
    vm.cancelRequest = () => {
      if (vm.transactionID) {
        const objTrans = {
          TransactionID: vm.transactionID,
          ReasonCode: CORE.InoAuto_Error_ReasonCode.CancelTask.Code,
          ReasonMessage: CORE.InoAuto_Error_ReasonCode.CancelTask.Message
        };
        WarehouseBinFactory.sendRequestToCancelCartRequest().query(objTrans).$promise.then(() => {
          if (vm.promptColorDetails) {
            vm.scanWHProgress = false;
            BaseService.currentPagePopupForm.pop();
            vm.isOneTimeValidationForAccess = false;
            $mdDialog.cancel();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };


    //assigned department request sent
    function sendAssignDepartmentRequest(towerID) {
      vm.AssignDepartmentTransactionID = getGUID();
      const assignDepartment = {
        TransactionID: vm.AssignDepartmentTransactionID,
        TowerID: towerID
      };
      TransferStockFactory.RequestToAssignDepartment().query(assignDepartment).$promise.then(() => {
      }).catch((error) => BaseService.getErrorLog(error));
    }

    //sacn and verify
    vm.scanVerifyUID = ($event) => {
      if (vm.umidStock === vm.UMIDStockType.CustomerConsignedStock.key && !vm.autoCompleteCustomer.keyColumnId) {
        setFocusByName(vm.autoCompleteCustomer.inputName);
        return;
      }

      $timeout(() => {
        if ($event.keyCode === 13 && vm.uidTransfer.ScanUID && vm.ScanVerifyUMID) {
          scanVerifyUID();
        }
      }, true);
      /** Prevent enter key submit event */
      preventInputEnterKeyEvent($event);
    };

    //scan umid and compare with original umid
    const scanVerifyUID = () => {
      vm.isNotDisable = true;
      if (vm.uidTransfer.ScanUID.toLowerCase() === vm.ScanVerifyUMID.toLowerCase()) {
        if (vm.umidStock === vm.UMIDStockType.CustomerConsignedStock.key && !UIDData.customerConsign) {
          vm.stockErrorMessage = angular.copy(stringFormat(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.TRANSFER_MATERIAL_STOCK_TYPE_MISMATCH.message, vm.UMIDStockType.CustomerConsignedStock.value.toLowerCase()));
          vm.ScanVerifyUMID = null;
        } else if (vm.umidStock === vm.UMIDStockType.CustomerConsignedStock.key && UIDData.customerConsign && UIDData.customerID !== vm.autoCompleteCustomer.keyColumnId) {
          vm.stockErrorMessage = angular.copy(stringFormat(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.TRANSFER_MATERIAL_UMID_CUSTOMER_MISMATCH.message, vm.UMIDStockType.CustomerConsignedStock.value.toLowerCase()));
          vm.clearUMID(true);
        } else if (vm.umidStock === vm.UMIDStockType.InternalStock.key && UIDData.customerConsign) {
          vm.stockErrorMessage = angular.copy(stringFormat(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.TRANSFER_MATERIAL_STOCK_TYPE_MISMATCH.message, vm.UMIDStockType.InternalStock.value.toLowerCase()));
          vm.ScanVerifyUMID = null;
        } else {
          vm.umidStockDisable = true;
          vm.isNotDisable = false;
          vm.scanVerifyUMIDDisable = true;
          if (vm.modalData.updateStock) {
            setEmptyBin();
            vm.setFocusForScanUID(false);
            vm.selectKitToReturn(true);
          } else {
            setFocus('ScanWHBin');
          }
        }
      } else {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.REEL_MISMATCH);
        messageContent.message = stringFormat(messageContent.message, vm.uidTransfer.ScanUID, vm.ScanVerifyUMID);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model, callBackRemove);
        return;
      }
    };

    //umid is mismatch than need to remove it
    const callBackRemove = () => {
      vm.ScanVerifyUMID = null;
      $timeout(() => {
        setFocus('ScanVerifyUMID');
      }, true);
    };
    //transfer umid
    vm.transferInTransitUMID = (item) => {
      if (vm.modalData) {
        vm.modalData.uid = item.umid;
      }
      vm.uidTransfer.ScanUID = item.umid;
      scanUID();
    };

    //Set md-data table configuration
    vm.query = {
      order: '',
      search: ''
    };

    //get in transit umid detail
    const IntransitUMID = () => {
      ReceivingMaterialFactory.getInTransitCheckoutreel().query({ transactionID: vm.modalData.transactionID }).$promise.then((res) => {
        if (res && res.data) {
          _.each(res.data.inTransitList, (item) => {
            if (item.reelBarCode !== vm.uidTransfer.ScanUID) {
              updateForceDeliverRequest(JSON.parse(item.requestMessage));
            }
          });
          if (res.data.transactionColor && res.data.transactionColor.length > 0) {
            vm.ledcssColorClass = res.data.transactionColor[0].ledColorCssClass;
            vm.userType = stringFormat('Pick {0} [{1}]', res.data.transactionColor[0].ledColorName, res.data.transactionColor[0].userName);
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
  }
})();
