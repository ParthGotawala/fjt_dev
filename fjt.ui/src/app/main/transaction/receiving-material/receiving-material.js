(function () {
  'use strict';

  angular
    .module('app.transaction.receivingmaterial')
    .controller('ManageReceivingMaterialController', ManageReceivingMaterialController);

  /** @ngInject */
  function ManageReceivingMaterialController($state, $q, $mdDialog, $stateParams, $filter, $timeout, $window, TRANSACTION, $scope, CORE, USER, BaseService, DialogFactory, RFQSettingFactory, ManageMFGCodePopupFactory, ComponentFactory, ReceivingMaterialFactory, BarcodeLabelTemplateFactory, MasterFactory, PartCostingFactory, BinFactory, socketConnectionService, KitAllocationFactory, DCFormatFactory) {
    const vm = this;
    vm.CORE = CORE;
    vm.kitAllocation = {};
    vm.rohsStatusDetail = {};
    vm.Transaction = TRANSACTION.RECEIVINGMATERIAL;
    vm.TransactionData = TRANSACTION;
    vm.pageName = CORE.ReceivingMatirialTab;
    vm.umidApprovalType = CORE.UMID_APPROVAL_TYPE;
    vm.textAreaRows = CORE.TEXT_AREA_ROWS;
    $scope.$parent.vm.selectedNavItem = CORE.ReceivingMatirialTab.UIDManagement.Name;
    $scope.$parent.vm.refUMIDId = $stateParams.id;
    $scope.$parent.vm.isReservedStock = false;
    $scope.$parent.vm.customerConsign = false;
    $scope.$parent.vm.currentState = $state.current.name;
    vm.nonUMIDStockLabel = vm.pageName.NonUMIDStockList.title;
    vm.loginUser = BaseService.loginUser;
    vm.isEdit = false;
    vm.saveBtnDisableFlag = false;
    vm.userRoHSStatusID = USER.RoHSStatusID;
    vm.haltResumePopUp = CORE.HaltResumePopUp;
    vm.IsReceivingMaterialTabImage = false;
    vm.isApprovalPopupOpen = false;
    vm.partExpiryPopupOpen = false;
    vm.isExpiryDatePopupOpen = false;
    vm.isMfgDatePopupOpen = false;
    vm.isPackagingDisable = false;
    vm.isFromBinDisable = false;
    vm.ReceivingMaterialTabName = 'ReceivingMaterialDetails';
    vm.ReceivingMaterialTabImage = 'ReceivingMaterialImage';
    vm.EntityName = CORE.AllEntityIDS.Component_sid_stock.Name;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.UMID_MAX_LENGTH = CORE.UMID_MAX_LENGTH;
    vm.isDisplayROHS = false;
    vm.isdataValid = true;
    vm.isChanged = false;
    vm.initialLoad = false;
    vm.isMismatchWithKit = false;
    vm.isCallFromMismatchPart = false;
    vm.focusCustomerAuto = false;
    vm.isFocusonCPN = false;
    vm.isReadOnly = false;
    vm.selectPartBarcode = 'true';
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.datePlaceHolderFormat = angular.copy(vm.DefaultDateFormat).toUpperCase();
    vm.currentDate = new Date();
    vm.DATE_PICKER = CORE.DATE_PICKER;
    vm.IsPickerOpenExpiry = {};
    vm.IsPickerOpenExpiry[vm.DATE_PICKER.partExpiryDate] = false;
    vm.IsPickerOpenMFG = {};
    vm.IsPickerOpenMFG[vm.DATE_PICKER.partMFGDate] = false;
    vm.IsPickerOpenSeal = {};
    vm.IsPickerOpenSeal[vm.DATE_PICKER.partSealDate] = false;
    let UIDPrifixStorageValue = null;
    let CustomerPrefixStorageValue = null;
    let FromBinStorageValue = null;
    let UMIDStockInventoryType = null;
    let UMIDPrintButtonFocus = null;
    vm.DateTypeList = vm.TransactionData.DateType;
    let editCostCategoryId = 0;
    let assemblyId = 0;
    vm.isHideDelete = true;
    vm.isExpire = false;
    vm.isHideWOAutocomplete = false;
    vm.RFQ_MOUNTINGTYPE = CORE.RFQ_MOUNTINGTYPE;
    vm.PartCategory = CORE.PartCategory;
    vm.isAllocateToKit = false;
    vm.isScanLabel = false;
    let selectedPO = {};
    let selectedSubAssy = {};
    let rfqLineItemsID;
    let rfqAlternateID;
    vm.isDisableCount = false;
    vm.isDisableBin = false;
    vm.LabelConstant = CORE.LabelConstant;
    vm.isPrefixDisable = false;
    let finalMfgPn = null;
    vm.focusFromBin = false;
    vm.focusCount = false;
    vm.focusPOAuto = false;
    vm.focusPackaginAuto = false;
    vm.focusPriceCategory = false;
    let cpnPartList = [];
    $scope.$parent.vm.UMID = null;
    vm.withKitAllocation = true;
    vm.checkValidation = false;
    let IdOfSelectMultipleBarcode = null;
    let objToBin;
    const PendingUMIDMFRPN = getLocalStorageValue('PendingUMIDMFRPN');
    let objApproval = null;
    let approvalReasonList = [];
    let objDaysApproval = null;
    vm.isSubAssyHighlight = false;
    $scope.$parent.vm.isUMIDDataCount = 1;
    vm.InventoryType = vm.TransactionData.InventoryType;
    vm.expiryInDays = 0;
    vm.mfrDateCodeAutoCompleteDisabled = true;
    vm.isEnableDateCodeModification = false;
    let ErrorForMfgDateCodeFormat;
    vm.DateCodeFormatFrom = CORE.DateCodeFormatFrom;
    vm.DateCodeCategory = USER.DateCodeCategory;
    vm.dataKeyLotCodeFormatID = _umidInternalDateCodeFormat;

    vm.umidDetail = {
      StockInventory: '',
      cpn: false,
      formatType: vm.Transaction.FIRSTSCANLBL,
      isinStk: true,
      printStatus: false,
      mfgAvailabel: false,
      stockInventoryType: vm.TransactionData.InventoryType[0].value,
      changeCustomer: false,
      dateCodeFormatID: vm.dataKeyLotCodeFormatID
    };
    vm.isContainInPartMaster = false;
    vm.isContainInMountingGroup = false;
    vm.MFR_DATE_CODE_FORMAT_NOT_FOUND = angular.copy(TRANSACTION.MFR_DATE_CODE_FORMAT_NOT_FOUND);
    vm.SET_DATE_CODE_FORMAT_BUTTON = angular.copy(TRANSACTION.SET_DATE_CODE_FORMAT_BUTTON);
    vm.isCountValueChange = false;
    vm.gridConfig = CORE.gridConfig;
    let noprint = 1;
    vm.MEASUREMENT_TYPES_COUNT = CORE.MEASUREMENT_TYPES.COUNT;
    $scope.$parent.vm.isEdit = vm.isEdit;
    $scope.$parent.vm.isExpire = vm.isExpire;
    $scope.$parent.vm.checkScanLabel = vm.isScanLabel;
    let buyAndStockMismatchDetail = null;
    const todayDate = new Date();
    vm.expireDateOptions = {
      minDate: todayDate,
      appendToBody: true
    };

    vm.mfgDateOptions = {
      maxDate: todayDate,
      appendToBody: true
    };

    vm.sealDateOptions = {
      appendToBody: true
    };

    /* page readonly mode rights */
    function setTabWisePageRights(pageList) {
      if (pageList && pageList.length > 0) {
        const tab = pageList.find((a) => a.PageDetails && a.PageDetails.pageRoute === TRANSACTION.TRANSACTION_MANAGERECEIVINGMATERIAL_STATE);
        if (tab) {
          vm.isReadOnly = tab.RO ? true : false;
        }
      }
    }
    $timeout(() => {
      $scope.$on(USER.LoginUserPageListBroadcast, (event, data) => {
        var menudata = data;
        setTabWisePageRights(menudata);
        $scope.$applyAsync();
      });
    });
    if (BaseService.loginUserPageList && BaseService.loginUserPageList.length > 0) {
      setTabWisePageRights(BaseService.loginUserPageList);
    }

    vm.isEnableDateCodeModification = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToUpdateUMIDDateCodeFormat);

    const setInternalDateFormatData = (dateCodeFormatID) => {
      const InternalDateCodeFormatValue = _.find(vm.dateCodeFormatList, { id: dateCodeFormatID });
      if (InternalDateCodeFormatValue) {
        vm.umidDetail.dateCodeFormat = InternalDateCodeFormatValue.dateCodeFormat;
      }
    };

    /* on state change and redirect to page set local storage values */
    $scope.$on('$stateChangeSuccess', (event, toState, toParams, fromState) => {
      if (toState.name !== fromState.name) {
        removeLocalStorageValue('UIDPrefix');
        removeLocalStorageValue('CustomerForPrefix');
        removeLocalStorageValue('FromBinForUMID');
        removeLocalStorageValue('UMIDStockInventoryType');
      } else {
        vm.checkUMIDPrefix = getLocalStorageValue('UIDPrefix');
        UIDPrifixStorageValue = getLocalStorageValue('UIDPrefix');
        FromBinStorageValue = getLocalStorageValue('FromBinForUMID');
        UMIDStockInventoryType = getLocalStorageValue('UMIDStockInventoryType');
        CustomerPrefixStorageValue = UMIDStockInventoryType === vm.TransactionData.InventoryType[1].value ? getLocalStorageValue('CustomerForPrefix') : removeLocalStorageValue('CustomerForPrefix');
      }

      if ($stateParams.id) {
        autocompletePromise.push(ReceivingMaterialDetails($stateParams.id));
      } else {
        if (UIDPrifixStorageValue) {
          vm.umidDetail.prefix = UIDPrifixStorageValue.UIDPrefix;
          setInternalDateFormatData(vm.dataKeyLotCodeFormatID);
        }

        vm.umidDetail.MFGorExpiryDate = vm.DateTypeList[0].type;
        if (FromBinStorageValue && FromBinStorageValue.FromBinForUMID) {
          vm.umidDetail.fromBin = FromBinStorageValue.FromBinForUMID.id;
          vm.umidDetail.fromBinName = FromBinStorageValue.FromBinForUMID.Name;
          vm.umidDetail.fromWarehouse = FromBinStorageValue.FromBinForUMID.warehousemst ? FromBinStorageValue.FromBinForUMID.warehousemst.id : FromBinStorageValue.FromBinForUMID.WarehouseID;
          vm.umidDetail.fromDepartment = FromBinStorageValue.FromBinForUMID.warehousemst ? FromBinStorageValue.FromBinForUMID.warehousemst.parentWHID : FromBinStorageValue.FromBinForUMID.parentWHID;
        }
        if (PendingUMIDMFRPN) {
          vm.umidDetail.prefix = PendingUMIDMFRPN.prefix;
          vm.umidDetail.ScanLabel = PendingUMIDMFRPN.mfrpn;
          vm.umidDetail.fromBin = PendingUMIDMFRPN.FromBinForUMID ? PendingUMIDMFRPN.FromBinForUMID.id : null;
          vm.umidDetail.fromBinName = PendingUMIDMFRPN.FromBinForUMID ? PendingUMIDMFRPN.FromBinForUMID.Name : null;
          vm.umidDetail.fromWarehouse = PendingUMIDMFRPN.FromBinForUMID ? PendingUMIDMFRPN.FromBinForUMID.WarehouseID : null;
          vm.umidDetail.fromDepartment = PendingUMIDMFRPN.FromBinForUMID ? (PendingUMIDMFRPN.FromBinForUMID.warehousemst ? PendingUMIDMFRPN.FromBinForUMID.warehousemst.parentWHID : PendingUMIDMFRPN.FromBinForUMID.parentWHID) : null;
          removeLocalStorageValue('PendingUMIDMFRPN');
        }

        if (UMIDStockInventoryType) {
          vm.umidDetail.stockInventoryType = UMIDStockInventoryType.type;
          if (vm.umidDetail.stockInventoryType === vm.TransactionData.InventoryType[1].value) {
            vm.umidDetail.fromBin = CORE.SystemGenratedWarehouseBin.bin.OpeningBin.id;
            vm.umidDetail.fromBinName = CORE.SystemGenratedWarehouseBin.bin.OpeningBin.name;
            vm.umidDetail.fromWarehouse = CORE.SystemGenratedWarehouseBin.warehouse.OpeningWarehouse.id;
            vm.umidDetail.fromDepartment = vm.materialDeptList && vm.materialDeptList.length > 0 ? vm.materialDeptList[0].ID : null;
          }
        } else {
          vm.umidDetail.stockInventoryType = vm.TransactionData.InventoryType[0].value;
          setLocalStorageValue('UMIDStockInventoryType', {
            type: vm.umidDetail.stockInventoryType
          });
          UMIDStockInventoryType = getLocalStorageValue('UMIDStockInventoryType');
        }
      }
    });

    const callbackComponentMfgPN = (item) => {
      if (!vm.isEdit) {
        if (item && !vm.isScanLabel) {
          vm.isDisplayROHS = true;
          vm.isROHS = item.rohsComplient;
          vm.packaginggroupID = item.packaginggroupID;
          finalMfgPn = item.orgMfgPN;
          objApproval = null;
          vm.cgBusyLoading = ReceivingMaterialFactory.getComponentWithTemplateDelimiter().query({
            id: item.id,
            mfgid: item.mfgcodeID ? item.mfgcodeID : item.mfgCodeId ? item.mfgCodeId : 0
          }).$promise.then((receivingmaterialdetail) => {
            if (receivingmaterialdetail && receivingmaterialdetail.data && receivingmaterialdetail.data.length > 0) {
              const componentDetail = receivingmaterialdetail.data[0];
              if (componentDetail.partType === 4) {
                vm.cgBusyLoading = false;
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.UMID_NOT_CREATE_PART_TYPE_OTHER);
                messageContent.message = stringFormat(messageContent.message, item.PIDCode);
                const model = {
                  messageContent: messageContent,
                  multiple: true
                };
                return DialogFactory.messageAlertDialog(model).then(() => {
                  vm.reScan();
                }, () => {
                }).catch((error) => BaseService.getErrorLog(error));
              }

              vm.rohsStatusCheck = componentDetail.RoHSStatusID;
              vm.autoCompleteRohsStatus.keyColumnId = componentDetail.RoHSStatusID;
              cpnPartList = componentDetail.ComponentCustAliasRevPart;
              editCostCategoryId = componentDetail.costCategoryID ? componentDetail.costCategoryID : editCostCategoryId;
              if (vm.autoCompletePriceCategory) {
                vm.autoCompletePriceCategory.keyColumnId = editCostCategoryId;
              }
              vm.umidDetail.refcompid = item.id;
              vm.umidDetail.mfgPN = item.mfgPN;
              vm.umidDetail.mfgType = item.mfgType;
              vm.umidDetail.oldpcbPerArray = componentDetail.pcbPerArray;
              vm.umidDetail.pcbPerArray = componentDetail.pcbPerArray;
              vm.umidDetail.spq = componentDetail.umidSPQ ? componentDetail.umidSPQ : 0;
              vm.umidDetail.uom = componentDetail.uom;
              vm.umidDetail.uomName = componentDetail.UOMs && componentDetail.UOMs.unitName ? componentDetail.UOMs.unitName : null;
              vm.umidDetail.uomClassID = componentDetail.UOMs && componentDetail.UOMs.measurementTypeID ? componentDetail.UOMs.measurementTypeID : null;
              vm.umidDetail.componentUnit = componentDetail.unit ? componentDetail.unit : 1;
              vm.umidDetail.partMasterPackagingId = componentDetail.packagingID;
              vm.umidDetail.cpn = componentDetail.isCPN;
              vm.umidDetail.mfgAvailabel = vm.umidDetail.cpn ? true : false;
              vm.umidDetail.restrictUsePermanently = componentDetail.restrictUsePermanently;
              vm.umidDetail.restrictUSEwithpermission = componentDetail.restrictUSEwithpermission;
              vm.umidDetail.restrictPackagingUsePermanently = componentDetail.restrictPackagingUsePermanently;
              vm.umidDetail.restrictPackagingUseWithpermission = componentDetail.restrictPackagingUseWithpermission;
              vm.umidDetail.PIDCode = componentDetail.PIDCode;
              if (componentDetail.component_packagingmst && componentDetail.component_packagingmst.sourceName === vm.TransactionData.Packaging.TapeAndReel) {
                vm.umidDetail.pkgQty = vm.umidDetail.partPackagingMinQty = componentDetail.umidSPQ;
              }
              if (vm.umidDetail.stockInventoryType === vm.InventoryType[2].value) {
                const packaging = _.find(vm.packagingList, { name: vm.TransactionData.Packaging.Bulk });
                vm.umidDetail.packagingType = packaging ? packaging.name : null;
                vm.umidDetail.sourceName = packaging ? packaging.sourceName : null;
                vm.umidDetail.packaging = packaging ? packaging.id : null;
                vm.umidDetail.pkgQty = vm.umidDetail.woUMIDProposedCountQty ? parseFloat(vm.umidDetail.woUMIDProposedCountQty) : vm.umidDetail.pkgQty;
              } else {
                vm.umidDetail.packagingType = componentDetail.component_packagingmst ? componentDetail.component_packagingmst.name : null;
                vm.umidDetail.sourceName = componentDetail.component_packagingmst ? componentDetail.component_packagingmst.sourceName : null;
                vm.umidDetail.packaging = componentDetail.packagingID;
              }
              if (componentDetail.component_mslmst) {
                vm.umidDetail.mslLevel = stringFormat('{0} ({1})', componentDetail.component_mslmst.levelRating, componentDetail.component_mslmst.time);
              }
              vm.autoCompleteDateCodeFormat.keyColumnId = item.dateCodeFormatID ? item.dateCodeFormatID : (componentDetail.mfgCodemst && componentDetail.mfgCodemst.dateCodeFormatMst ? componentDetail.mfgCodemst.dateCodeFormatMst.id : null);
              vm.umidDetail.fromDateCodeFormat = item.dateCodeFormatID ? vm.DateCodeFormatFrom[2].key : (componentDetail.mfgCodemst && componentDetail.mfgCodemst.dateCodeFormatMst ? vm.DateCodeFormatFrom[1].key : vm.DateCodeFormatFrom[0].key);
              if (vm.umidDetail.fromDateCodeFormat !== vm.DateCodeFormatFrom[0].key) {
                const dateCodeFormatFromValue = _.find(vm.DateCodeFormatFrom, { key: vm.umidDetail.fromDateCodeFormat });
                if (dateCodeFormatFromValue) {
                  vm.umidDetail.dateCodeFormatFromValue = dateCodeFormatFromValue.value;
                }
              }
              vm.umidDetail.tentativePrice = componentDetail.price;
              vm.umidDetail.mfgPNDescription = componentDetail.mfgPNDescription;
              vm.umidDetail.partPackage = componentDetail.rfq_packagecasetypemst ? componentDetail.rfq_packagecasetypemst.name : null;
              vm.umidDetail.externalPartPackage = componentDetail.partPackage;
              vm.umidDetail.selfLifeDays = componentDetail.selfLifeDays || 0;
              vm.umidDetail.shelfLifeAcceptanceDays = componentDetail.shelfLifeAcceptanceDays || 0;
              vm.umidDetail.maxShelfLifeAcceptanceDays = componentDetail.maxShelfLifeAcceptanceDays || 0;
              vm.shelfLifeDateType = componentDetail.shelfLifeDateType || null;
              vm.hasLimitedShelfLife = componentDetail.rfqMountingType && componentDetail.rfqMountingType.hasLimitedShelfLife ? componentDetail.rfqMountingType.hasLimitedShelfLife : 0;
              vm.gridOptions.gridApi.grid.options.hideAddNew = false;
              vm.mountingType = componentDetail.rfqMountingType ? componentDetail.rfqMountingType.name : null;
              if (vm.umidDetail.fromBin !== CORE.SystemGenratedWarehouseBin.bin.OpeningBin.id) {
                getCofCData(vm.umidDetail.fromBin, vm.umidDetail.refcompid);
              }

              // If shelf life days is not added and mounting type shelf life is required then restrict to scan part
              if (vm.umidDetail.selfLifeDays === 0 && vm.hasLimitedShelfLife) {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SHELF_LIFE_DAYS_FOR_MOUNTING_GROUP_CHEMICAL_VALIDATION);
                const model = {
                  messageContent: messageContent,
                  btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT
                };
                DialogFactory.messageAlertDialog(model).then(() => {
                  vm.goToComponentDetail(item.mfgType, item.id);
                  vm.reScan();
                }, () => {
                }).catch((error) => BaseService.getErrorLog(error));
              }
              setShelfLifeDateType(vm.shelfLifeDateType);
              vm.checkCountValueChange();
              autocompleteprice();
              autoComplete();
              setCostCategoryAutoComplete(vm.umidDetail.tentativePrice);
              const bomDetailPromise = [get_RFQ_BOMPart_List(item.id)];
              $q.all(bomDetailPromise).then((responses) => {
                const objBomDetail = responses[0];
                if (vm.umidDetail.restrictUsePermanently || vm.umidDetail.restrictPackagingUsePermanently) {
                  vm.cgBusyLoading = false;
                  let messageContent = null;

                  if (vm.umidDetail.restrictUsePermanently) {
                    messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MFR_RESTRICTED_PART);
                    messageContent.message = stringFormat(messageContent.message, vm.umidDetail.PIDCode, CORE.RestrictWithPermissionLabel.RestrictUSEWithPermanently);
                  } else if (componentDetail.isCPN) {
                    messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.CPN_RESTRICTED_PACKAGING_PART);
                    messageContent.message = stringFormat(messageContent.message, vm.umidDetail.PIDCode, CORE.RestrictWithPermissionLabel.RestrictPackagingUSEWithPermanently);
                  } else {
                    messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MFR_RESTRICTED_PACKAGING_PART);
                    messageContent.message = stringFormat(messageContent.message, vm.umidDetail.PIDCode, CORE.RestrictWithPermissionLabel.RestrictPackagingUSEWithPermanently);
                  }

                  if (messageContent) {
                    const model = {
                      messageContent: messageContent,
                      multiple: true
                    };
                    return DialogFactory.messageAlertDialog(model).then((yes) => {
                      if (yes) {
                        vm.reScan();
                      }
                    }, () => {

                    }).catch((error) => BaseService.getErrorLog(error));
                  }
                } else if ((vm.umidDetail.restrictUSEwithpermission || vm.umidDetail.restrictPackagingUseWithpermission) && !componentDetail.isCPN && (objBomDetail && objBomDetail.customerApproval !== CORE.CustomerApprovalStatus.Approve)) {
                  vm.cgBusyLoading = false;
                  let messageContent = null;

                  if (vm.umidDetail.restrictUSEwithpermission) {
                    messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PERMISSION_PART_NOT_CUSTOMER_APPROVE);
                    messageContent.message = stringFormat(messageContent.message, vm.umidDetail.PIDCode, CORE.RestrictWithPermissionLabel.RestrictUSEWithPermission);
                  } else {
                    messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PERMISSION_PART_NOT_CUSTOMER_APPROVE);
                    messageContent.message = stringFormat(messageContent.message, vm.umidDetail.PIDCode, CORE.RestrictWithPermissionLabel.RestrictPackagingUSEWithPermission);
                  }

                  if (messageContent) {
                    const model = {
                      messageContent: messageContent,
                      multiple: true
                    };
                    return DialogFactory.messageAlertDialog(model).then((yes) => {
                      if (yes) {
                        vm.reScan();
                      }
                    }, () => {

                    }).catch((error) => BaseService.getErrorLog(error));
                  }
                } else if ((vm.umidDetail.restrictUSEwithpermission || vm.umidDetail.restrictPackagingUseWithpermission) && componentDetail.isCPN && (objBomDetail && objBomDetail.customerApprovalCPN !== CORE.CustomerApprovalStatus.Approve)) {
                  vm.cgBusyLoading = false;
                  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.CPN_PERMISSION_PART_NOT_CUSTOMER_APPROVE);
                  messageContent.message = stringFormat(messageContent.message, vm.umidDetail.PIDCode, CORE.RestrictWithPermissionLabel.RestrictPackagingUSEWithPermission);

                  const model = {
                    messageContent: messageContent,
                    multiple: true
                  };
                  return DialogFactory.messageAlertDialog(model).then((yes) => {
                    if (yes) {
                      vm.reScan();
                    }
                  }, () => {

                  }).catch((error) => BaseService.getErrorLog(error));
                } else if ((vm.umidDetail.restrictUSEwithpermission || vm.umidDetail.restrictPackagingUseWithpermission) && (!objBomDetail)) {
                  let messageContent = null;
                  if (vm.umidDetail.restrictUSEwithpermission) {
                    messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PID_RECTRICTED_WITH_PERMISION);
                    messageContent.message = stringFormat(messageContent.message, vm.umidDetail.PIDCode, CORE.RestrictWithPermissionLabel.RestrictUSEWithPermission);
                  } else if (componentDetail.isCPN) {
                    messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.CPN_RECTRICTED_PACKAGING_WITH_PERMISION);
                    messageContent.message = stringFormat(messageContent.message, vm.umidDetail.PIDCode, CORE.RestrictWithPermissionLabel.RestrictPackagingUSEWithPermission);
                  } else {
                    messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PID_RECTRICTED_PACKAGING_WITH_PERMISION);
                    messageContent.message = stringFormat(messageContent.message, vm.umidDetail.PIDCode, CORE.RestrictWithPermissionLabel.RestrictPackagingUSEWithPermission);
                  }

                  const fillDetailMessageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.FILL_DETAIL_FOR_UMID);

                  const objDetail = {
                    event: null,
                    componentObj: vm.umidDetail,
                    bomLineDetail: null,
                    umidDetail: null,
                    dataElementDetail: receivingmaterialdetail.data[1],
                    informationMsg: stringFormat('{0} {1}', messageContent.message, fillDetailMessageContent.message)
                  };
                  getAuthenticationOfApprovalPart(objDetail);
                } else if (vm.umidDetail.stockInventoryType === vm.InventoryType[1].value && componentDetail.category === 3) {
                  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.EXISTING_STOCK_ASSEMBLY_UMID);
                  messageContent.message = stringFormat(messageContent.message, vm.umidDetail.PIDCode);
                  const model = {
                    messageContent: messageContent,
                    multiple: true
                  };
                  return DialogFactory.messageAlertDialog(model).then(() => {
                    $scope.$emit('sendComponent', null);
                    vm.umidDetail.mfgAvailabel = false;
                    $scope.$broadcast(vm.autoCompletecomponent.inputName, null);
                    setFocusByName(vm.autoCompletecomponent.inputName);
                  }, () => {
                  }).catch((error) => BaseService.getErrorLog(error));
                }

                const dataElement = _.find(receivingmaterialdetail.data[1], (data) => data.barcodeDelimiter && data.barcodeDelimiter.length > 0);

                if (dataElement) {
                  _.map(dataElement.barcodeDelimiter, (item) => {
                    item.dataElementName = item.dataelement.dataElementName;
                  });
                  // vm.gridOptions.enableCellEdit = true;
                  getDataElement(dataElement.barcodeDelimiter);
                }

                $scope.$emit('sendComponent', componentDetail);
              });
              if (vm.umidDetail.stockInventoryType === vm.TransactionData.InventoryType[0].value) {
                getSameCriteriaPackingSlipNonUMIDStock();
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          if (!item && !vm.isScanLabel) {
            $scope.$emit('sendComponent', null);
          }
          vm.isDisplayROHS = false;
          vm.isROHS = false;
          vm.packaginggroupID = '';
          finalMfgPn = item ? item.orgMfgPN : null;
          if (!item) {
            rfqLineItemsID = null;
            rfqAlternateID = null;
            vm.isSubAssyHighlight = false;
          }
        }
      }
      if (item && item.mfgcodeID) {
        vm.umidDetail.mfgcodeID = item.mfgcodeID;
        vm.umidDetail.mfgName = BaseService.getMfgCodeNameFormat(item.mfgCode, item.mfgName);
        vm.umidDetail.mfgCode = item.mfgCode;
      } else {
        vm.umidDetail.mfgcodeID = null;
        vm.umidDetail.mfgName = null;
        vm.umidDetail.mfgCode = null;
        vm.reScan();
      }
    };

    const callbackCPNComponentMfgPN = (item) => {
      if (!vm.isEdit) {
        vm.isFocusonCPN = false;
        objApproval = null;
        if (item) {
          vm.isDisplayROHS = true;
          vm.isROHS = item.rohsComplient;
          vm.packaginggroupID = item.packaginggroupID;

          if (vm.umidDetail.cpn) {
            const checkCPNPart = _.find(cpnPartList, (data) => data.refComponentID === item.id);
            if (!checkCPNPart) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_IN_CPN);
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              return DialogFactory.messageAlertDialog(model).then((yes) => {
                if (yes) {
                  $timeout(() => {
                    $scope.$broadcast(vm.autoCompleteCPNComponent.inputName, null);
                  });
                  vm.isFocusonCPN = true;
                }
              }, () => {
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }
        } else {
          vm.isDisplayROHS = false;
          vm.isROHS = false;
          vm.packaginggroupID = '';
        }
      }
      if (item && item.mfgcodeID) {
        vm.umidDetail.cpnMfgcodeID = item.mfgcodeID;
        vm.umidDetail.cpnMfgName = BaseService.getMfgCodeNameFormat(item.mfgCode, item.mfgName);
        vm.umidDetail.cpnMfgCode = item.mfgCode;
        vm.umidDetail.cpnMfgPNDescription = item.mfgPNDescription;
        setFocus(vm.umidDetail.stockInventoryType === vm.InventoryType[0].value ? 'reservedStock' : 'custConsign');
      } else {
        vm.umidDetail.cpnMfgcodeID = null;
        vm.umidDetail.cpnMfgName = null;
        vm.umidDetail.cpnMfgCode = null;
        vm.umidDetail.cpnMfgPNDescription = null;
      }
    };

    /* [S] ------ Auto complete & rendering API(s) ----- [S] */
    vm.getDataElementList = () => {
      vm.cgBusyLoading = BarcodeLabelTemplateFactory.getDataElementFields().query().$promise.then((res) => {
        let dynamicDataArray = [];
        if (res.data && res.data.dynamicData) {
          res.data.dynamicData = _.filter(res.data.dynamicData, (o) => ((o.dataelement_use_at !== CORE.SHOW_ELEMENT_OPTION[1])));
          dynamicDataArray = res.data.dynamicData;
        }

        if (vm.gridOptions && vm.gridOptions.columnDefs && vm.gridOptions.columnDefs.length > 0) {
          vm.gridOptions.columnDefs[1].editDropdownOptionsArray = dynamicDataArray;
        }

        return vm.dataelementList = dynamicDataArray;
      }).catch((error) => BaseService.getErrorLog(error));
    };

    function pricategory() {
      return RFQSettingFactory.getCostCateogryList().query({}).$promise.then((pricecategory) => {
        if (pricecategory && pricecategory.data) {
          vm.priceCategoryList = pricecategory.data;
          vm.priceCategoryList = _.orderBy(vm.priceCategoryList, ['from'], ['asc']);
          return vm.priceCategoryList;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    function getRoHSList() {
      return MasterFactory.getRohsList().query().$promise.then((RoHs) => {
        if (RoHs && RoHs.data) {
          vm.RohsList = _.filter(RoHs.data, (item) => item.isActive);
        } else {
          vm.RohsList = [];
        }
        return RoHs;
      }).catch((error) => BaseService.getErrorLog(error));
    }

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

    function getDateCodeFormatList() {
      return DCFormatFactory.retriveDateCodeFormatList().query().$promise.then((dcFormatList) => {
        if (dcFormatList && dcFormatList.data) {
          vm.dateCodeFormatList = dcFormatList.data;
          const internaDateCodeValue = _.find(vm.dateCodeFormatList, { id: vm.dataKeyLotCodeFormatID });
          if (internaDateCodeValue) {
            vm.umidDetail.internaDateCodeFormatValue = internaDateCodeValue.dateCodeFormatValue;
          }
        }
        return vm.dateCodeFormatList;
      }).catch((error) => BaseService.getErrorLog(error));
    }

    const getAssyList = () => {
      let customerId;
      if (vm.autoCompleteCustomer && vm.autoCompleteCustomer.keyColumnId) {
        customerId = vm.autoCompleteCustomer.keyColumnId;
      } else {
        customerId = 0;
      }

      vm.assyList = [];
      const assyId = vm.umidDetail && vm.umidDetail.assyID ? vm.umidDetail.assyID.toString() : null;
      return MasterFactory.getAssyPartList().query({
        customerID: customerId,
        assyIds: assyId
      }).$promise.then((response) => {
        vm.assyList = response.data;
        initAutoCompleteAssy();
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const getSalesOrderList = () => ReceivingMaterialFactory.get_PO_SO_Assembly_List().query().$promise.then((response) => {
      vm.SalesOrderNumberList = response.data;
      return vm.SalesOrderNumberList;
    }).catch((error) => BaseService.getErrorLog(error));

    const getPackaging = () => PartCostingFactory.getPackaging().query().$promise.then((packaging) => {
      if (packaging && packaging.data) {
        vm.packagingList = packaging.data;
      }
      return vm.packagingList;
    }).catch((error) => BaseService.getErrorLog(error));

    function getDeptList() {
      return BinFactory.getAllWarehouse({
        isDepartment: true
      }).query().$promise.then((whlist) => {
        vm.allDepartmentList = whlist.data;
        vm.materialDeptList = _.filter(whlist.data, (data) => data.parentWHType === CORE.ParentWarehouseType.MaterialDepartment);
        vm.productionDeptList = _.filter(whlist.data, (data) => data.parentWHType === CORE.ParentWarehouseType.ProductionDepartment);
        initAutoComplete();
        return vm.deptList;
      }).catch((error) => BaseService.getErrorLog(error));
    }

    const getExistingAssemblyWorkorderDetail = (woNumber) => ReceivingMaterialFactory.getExistingAssemblyWorkorderDetail({ workorderNumber: woNumber }).query().$promise.then((response) => {
      vm.workorderList = response.data;
      return vm.workorderList;
    }).catch((error) => BaseService.getErrorLog(error));

    function getComponentDetailsByMfg(searchObj) {
      searchObj.isContainCPN = true;
      return ComponentFactory.getComponentMFGAliasSearch().query({
        listObj: searchObj
      }).$promise.then((component) => {
        if (searchObj.id || searchObj.id === 0) {
          const selectedMfgPNCode = component.data.data[0];
          finalMfgPn = selectedMfgPNCode ? selectedMfgPNCode.orgMfgPN : null;
          $timeout(() => {
            $scope.$broadcast(vm.autoCompletecomponent.inputName, selectedMfgPNCode);
          });
        }
        return component.data.data;
      }).catch((error) => BaseService.getErrorLog(error));
    }

    const getCpnComponentDetailsByMfg = (searchObj) => ComponentFactory.getComponentMFGAliasSearch().query({
      listObj: searchObj
    }).$promise.then((component) => {
      if (searchObj.id || searchObj.id === 0) {
        const selectedCPNMfgPNCode = component.data.data[0];
        $timeout(() => {
          $scope.$broadcast(vm.autoCompleteCPNComponent.inputName, selectedCPNMfgPNCode);
        });
      }
      return component.data.data;
    }).catch((error) => BaseService.getErrorLog(error));

    const selectAssyCallBack = (item) => {
      if (!vm.isEdit) {
        if (item) {
          vm.umidDetail.nickName = item.nickName;
          if (vm.umidDetail.isReservedStock && vm.umidDetail.nickName) {
            vm.umidDetail.prefix = vm.umidDetail.nickName ? vm.umidDetail.nickName.substring((vm.umidDetail.nickName.length - 8), vm.umidDetail.nickName.length) : null;
          }
        } else {
          vm.umidDetail.nickName = null;
          if (vm.umidDetail.isReservedStock) {
            const CustomerPrefixStorageValue = getLocalStorageValue('CustomerForPrefix');
            if (CustomerPrefixStorageValue) {
              vm.umidDetail.prefix = CustomerPrefixStorageValue.CustomerForPrefix && CustomerPrefixStorageValue.CustomerForPrefix.mfgCode ? CustomerPrefixStorageValue.CustomerForPrefix.mfgCode.substring((CustomerPrefixStorageValue.CustomerForPrefix.mfgCode.length - 8), CustomerPrefixStorageValue.CustomerForPrefix.mfgCode.length) : null;
            } else {
              vm.umidDetail.prefix = null;
            }
          }
        }
      }
    };

    const getSubAssemblyList = (id) => {
      if (id) {
        vm.cgBusyLoading = ReceivingMaterialFactory.getSubAssemblyOnAssembly().query({
          id: id
        }).$promise.then((response) => {
          vm.SubAssemblyList = response.data;
          initAutoCompleteSubAssembly();
        }).catch((error) => BaseService.getErrorLog(error));
        return $q.resolve(vm.SubAssemblyList);
      }
    };

    const selectWO = (item) => {
      if (item) {
        vm.umidDetail.woNumber = item.woNumber;
        vm.umidDetail.woAssyNumber = item.woAssyNumber;
        vm.umidDetail.woID = item.woID;
        vm.umidDetail.woAvailableQty = item.availableQty;
        vm.umidDetail.fromBinName = item.binName;
        vm.umidDetail.fromBin = item.binID;
        vm.umidDetail.refcompid = item.partID;
        vm.umidDetail.woUMIDProposedQty = item.woUMIDProposedQty;
        vm.umidDetail.woUMIDProposedCountQty = item.woUMIDProposedQty < item.availableQty ? item.woUMIDProposedQty : item.availableQty;
        vm.umidDetail.woUMIDProposedQtyValidation = item.availableQty > item.woUMIDProposedQty;
        if (vm.selectPartBarcode) {
          vm.umidDetail.ScanLabel = item.mfgPN;
        }

        getComponentDetailsByMfg({
          id: item.mfgId,
          mfgcodeID: item.mfgCodeId
        }).then((response) => {
          if (response && response.length > 0) {
            callbackComponentMfgPN(response[0]);
          }
        });

        vm.getFromBinDetail();
      } else {
        vm.umidDetail.woNumber = vm.umidDetail.woAssyNumber = vm.umidDetail.woID = vm.umidDetail.fromBinName = vm.umidDetail.fromBin = vm.umidDetail.woAvailableQty = vm.umidDetail.woUMIDProposedCountQty = vm.umidDetail.woUMIDProposedQtyValidation = vm.umidDetail.refcompid = vm.umidDetail.woUMIDProposedQty = null;
      }
    };

    const selectPONumber = (item) => {
      if (item) {
        vm.autoCompleteSO.keyColumnId = item.SalesOrderDetailId;
        vm.POData = item;
        vm.getHoldResumeStatus({
          salesOrderDetailId: item.SalesOrderDetailId
        });
        selectedPO = item;
        vm.kitAllocation['SO'] = item['Sales Order'];
        vm.kitAllocation['Assy ID'] = item['Assy ID'];
        vm.kitAllocation['PO Qty'] = item['PO Qty'];
        vm.kitAllocation['mrpQty'] = item['mrpQty'];
        vm.FullPoNumber = stringFormat('{0}, {1}, {2}, {3}', item['Po Number'], item['Sales Order'], item['Assy ID'], item['PO Qty']);

        vm.umidDetail.prefix = item['NickName'];
        if (vm.umidDetail.prefix) {
          setLocalStorageValue('UIDPrefix', {
            UIDPrefix: vm.umidDetail.prefix
          });
        }
        vm.autoCompleteCustomer.keyColumnId = item['Customer ID'];
        const custObj = _.find(vm.CustomerList, (data) => data.id === item['Customer ID']);
        if (custObj) {
          setLocalStorageValue('CustomerForPrefix', {
            CustomerForPrefix: custObj
          });
        }

        $timeout(() => {
          vm.autoCompleteAssy.keyColumnId = item['PartID'];
          vm.umidDetail.nickName = item['NickName'];
        }, true);

        if (item['PartID']) {
          const autocompleteSOPromise = [checkAssemblyHasBom(item['PartID'])];
          vm.cgBusyLoading = $q.all(autocompleteSOPromise).then((response) => {
            if (response && response[0] && response[0] === true) {
              getSubAssemblyList(item['PartID']);
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      } else {
        vm.autoCompleteSO.keyColumnId = null;
        vm.autoCompleteSubAssebmly.keyColumnId = null;
        vm.umidDetail.prefix = null;
        removeLocalStorageValue('UIDPrefix');
        if (!vm.isRejectPO) {
          vm.autoCompleteCustomer.keyColumnId = null;
          removeLocalStorageValue('CustomerForPrefix');
        }
      }
      $timeout(() => {
        vm.focusPOAuto = false;
      }, true);
    };

    const selectSubAssembly = (item) => {
      if (item) {
        vm.autoCompleteSubAssebmly.keyColumnId = item.id;
        selectedSubAssy = item;
        get_RFQ_BOMPart_List(vm.autoCompletecomponent && vm.autoCompletecomponent.keyColumnId ? vm.autoCompletecomponent.keyColumnId : null);
      } else {
        vm.autoCompleteSubAssebmly.keyColumnId = null;
        vm.isSubAssyHighlight = false;
      }
    };

    const getMFGCodeOnCustomer = (item) => {
      if (item && item.id) {
        vm.cgBusyLoading = ReceivingMaterialFactory.getMFGCodeOnCustomer().query({
          id: item.id
        }).$promise.then((MFGCode) => {
          if (MFGCode && MFGCode.data && MFGCode.data.length > 0) {
            vm.umidDetail.prefix = item.mfgCode ? item.mfgCode.substring((item.mfgCode.length - 8), item.mfgCode.length) : null;
            setLocalStorageValue('CustomerForPrefix', { CustomerForPrefix: item });
            getAssyList();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        setLocalStorageValue('CustomerForPrefix', { CustomerForPrefix: item });
        vm.autoCompleteAssy.keyColumnId = null;
        vm.umidDetail.nickName = null;
        vm.assyList = [];
        vm.umidDetail.prefix = null;
      }
    };

    const getNumberOfPrintsForUMID = (partId) => {
      ReceivingMaterialFactory.getNumberOfPrintsForUMID().query({
        id: partId
      }).$promise.then((printDetails) => {
        if (printDetails.data) {
          const mslID = printDetails.data.mslID >= 2 ? 2 : 0;
          const numberOfPrintForUMID = printDetails.data.rfqMountingType.numberOfPrintForUMID ? printDetails.data.rfqMountingType.numberOfPrintForUMID : 1;
          noprint = (mslID && numberOfPrintForUMID) ? (mslID > numberOfPrintForUMID ? mslID : numberOfPrintForUMID) : numberOfPrintForUMID;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const autocompletePromise = [vm.getDataElementList(), pricategory(), getRoHSList(),
    getCustomerList(), getAssyList(), getSalesOrderList(), getPackaging(), getDeptList(), getExistingAssemblyWorkorderDetail(), getDateCodeFormatList()
    ];

    vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
      if (!$stateParams.id) {
        initAutoComplete();
        initCPNAutoComplete();
        autocompleteprice();
        autoComplete();
        grid();
        initAutoCompleteSO();
        initAutoCompleteSubAssembly();
        initAutoCompleteWO();
        vm.execute = true;
        if (UMIDStockInventoryType) {
          vm.umidDetail.stockInventoryType = UMIDStockInventoryType.type;
          if (vm.umidDetail.stockInventoryType === vm.TransactionData.InventoryType[1].value) {
            vm.umidDetail.fromDepartment = vm.materialDeptList && vm.materialDeptList.length > 0 ? vm.materialDeptList[0].ID : null;
          }
        }
      }
    }).catch((error) => BaseService.getErrorLog(error));

    function initAutoComplete() {
      vm.autoCompletecomponent = {
        columnName: 'mfgPN',
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.umidDetail ? vm.umidDetail.refcompid : null,
        inputName: vm.LabelConstant.MFG.MFGPN,
        placeholderName: vm.LabelConstant.MFG.MFGPN,
        isAddnew: true,
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          category: CORE.PartCategory.Component,
          popupAccessRoutingState: [USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE],
          pageNameAccessLabel: vm.LabelConstant.PART_MASTER.PageName,
          isCPNPartEntry: vm.umidDetail.cpn ? true : null
        },
        isRequired: true,
        callbackFn: function (obj) {
          const searchObj = {
            mfgType: CORE.MFG_TYPE.MFG,
            id: obj.id
          };
          return getComponentDetailsByMfg(searchObj);
        },
        onSelectCallbackFn: callbackComponentMfgPN,
        onSearchFn: function (query) {
          const searchObj = {
            isGoodPart: CORE.PartCorrectList.CorrectPart,
            query: query,
            mfgType: CORE.MFG_TYPE.MFG,
            inputName: vm.autoCompletecomponent.inputName
          };
          return getComponentDetailsByMfg(searchObj);
        }
      };

      vm.autoCompleteRohsStatus = {
        columnName: 'name',
        controllerName: CORE.MANAGE_ROHS_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_ROHS_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.umidDetail.rohsStatusID ? vm.umidDetail.rohsStatusID : null,
        inputName: 'rohsComplient',
        placeholderName: 'RoHS Status',
        isRequired: true,
        isAddnew: true,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_ROHS_STATE],
          pageNameAccessLabel: CORE.PageName.rohs_status
        },
        callbackFn: getRoHSList,
        onSelectCallbackFn: function () { }
      };

      vm.autoCompleteDateCodeFormat = {
        columnName: 'dateCodeFormatValue',
        keyColumnName: 'id',
        controllerName: USER.ADMIN_DC_FORMAT_POPUP_CONTROLLER,
        viewTemplateURL: USER.ADMIN_DC_FORMAT_POPUP_VIEW,
        keyColumnId: vm.umidDetail && vm.umidDetail.mfrDateCodeFormatID ? vm.umidDetail.mfrDateCodeFormatID : null,
        inputName: 'dateCodeFormatValue',
        placeholderName: vm.LabelConstant.MFG.MFRDateCodeFormat,
        isRequired: false,
        isAddnew: true,
        callbackFn: getDateCodeFormatList,
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.umidDetail.mfrDateCodeFormatCategory = item.dateCodeFormatValue;
            manageResponseForMFRDateCodeChange(item);
          }
          else {
            vm.autoCompleteDateCodeFormat.keyColumnId = vm.umidDetail.mfrDateCodeFormatCategory = vm.umidDetail.mfrDateCodeFormatID = vm.umidDetail.mfrDateCodeFormat = vm.umidDetail.mfrDateCodeLength = null;
          }
        }
      };
    }

    const initCPNAutoComplete = () => {
      vm.autoCompleteCPNComponent = {
        columnName: 'mfgPN',
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.umidDetail ? vm.umidDetail.refCPNMFGPNID : null,
        inputName: `CPN${vm.LabelConstant.MFG.MFGPN}`,
        placeholderName: vm.LabelConstant.MFG.MFGPN,
        isAddnew: true,
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          category: CORE.PartCategory.Component,
          popupAccessRoutingState: [USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE],
          pageNameAccessLabel: vm.LabelConstant.PART_MASTER.PageName
        },
        isRequired: true,
        callbackFn: function (obj) {
          const searchObj = {
            mfgType: CORE.MFG_TYPE.MFG,
            id: obj.id
          };
          return getCpnComponentDetailsByMfg(searchObj);
        },
        onSelectCallbackFn: callbackCPNComponentMfgPN,
        onSearchFn: function (query) {
          const searchObj = {
            isGoodPart: CORE.PartCorrectList.CorrectPart,
            query: query,
            mfgType: CORE.MFG_TYPE.MFG,
            inputName: vm.autoCompleteCPNComponent.inputName
          };
          return getCpnComponentDetailsByMfg(searchObj);
        }
      };
    };

    function autocompleteprice() {
      vm.autoCompletePriceCategory = {
        columnName: 'categoryName',
        keyColumnName: 'id',
        controllerName: CORE.MANAGE_COSE_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COSE_CATEGORY_MODAL_VIEW,
        keyColumnId: editCostCategoryId ? editCostCategoryId : vm.umidDetail ? vm.umidDetail.costCategoryID && vm.umidDetail.costCategoryID !== 0 ? vm.umidDetail.costCategoryID : null : null,
        inputName: 'Price Category',
        placeholderName: 'Cost Category',
        isRequired: true,
        isAddnew: true,
        callbackFn: pricategory,
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.focusPriceCategory = false;
          }
        }
      };
    }

    function autoComplete() {
      vm.autoCompleteCustomer = {
        columnName: 'mfgName',
        controllerName: USER.ADMIN_CUSTOMER_ADD_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_CUSTOMER_ADD_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.umidDetail && vm.umidDetail.customerID ? vm.umidDetail.customerID : null,
        addData: {
          customerType: CORE.CUSTOMER_TYPE.CUSTOMER,
          popupAccessRoutingState: [USER.ADMIN_MANAGECUSTOMER_DETAIL_STATE],
          pageNameAccessLabel: CORE.PageName.customer
        },
        inputName: 'Customer',
        placeholderName: 'Customer',
        isRequired: true,
        isAddnew: true,
        callbackFn: getCustomerList,
        onSelectCallbackFn: getMFGCodeOnCustomer
      };

      vm.autoPackaging = {
        columnName: 'name',
        keyColumnName: 'id',
        controllerName: CORE.MANAGE_PACKAGING_TYPE_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_PACKAGING_TYPE_MODAL_VIEW,
        keyColumnId: vm.umidDetail && vm.umidDetail.packaging ? vm.umidDetail.packaging : null,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_PACKAGING_TYPE_STATE],
          pageNameAccessLabel: CORE.PageName.packaging_type
        },
        inputName: 'Packaging',
        placeholderName: 'Packaging',
        isRequired: true,
        isAddnew: true,
        callbackFn: getPackaging,
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.focusPackaginAuto = false;
            vm.umidDetail.packagingType = item.name;
            vm.umidDetail.sourceName = item.sourceName;
            vm.autoPackaging.keyColumnId = item.id;
            vm.umidDetail.packaging = item.id;
            if (item.sourceName === vm.TransactionData.Packaging.TapeAndReel) {
              vm.isCountValueChange = true;
            }
            packagingValidation(true);
          }
        }
      };
    }

    const initAutoCompleteAssy = () => {
      vm.autoCompleteAssy = {
        columnName: 'PIDCode',
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: assemblyId ? assemblyId : vm.umidDetail ? vm.umidDetail.assyID && vm.umidDetail.assyID !== 0 ? vm.umidDetail.assyID : null : null,
        inputName: 'Assembly',
        placeholderName: 'Assy ID',
        isRequired: false,
        isAddnew: true,
        callbackFn: getAssyList,
        onSelectCallbackFn: selectAssyCallBack,
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          category: vm.PartCategory.SubAssembly,
          customerID: vm.autoCompleteCustomer ? vm.autoCompleteCustomer.keyColumnId : null,
          popupAccessRoutingState: [USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE],
          pageNameAccessLabel: vm.LabelConstant.PART_MASTER.PageName
        }
      };
    };

    const initAutoCompleteSO = () => {
      vm.autoCompleteSO = {
        columnName: 'salescolumn',
        keyColumnName: 'SalesOrderDetailId',
        keyColumnId: selectedPO && selectedPO['SalesOrderDetailId'] ? selectedPO['SalesOrderDetailId'] : null,
        inputName: 'PO#',
        placeholderName: 'PO#',
        isRequired: true,
        isAddnew: false,
        callbackFn: getSalesOrderList,
        onSelectCallbackFn: selectPONumber
      };
    };

    const initAutoCompleteSubAssembly = () => {
      vm.autoCompleteSubAssebmly = {
        columnName: 'PIDCode',
        keyColumnName: 'id',
        keyColumnId: selectedPO && selectedPO['PartID'] ? selectedPO['PartID'] : null,
        inputName: 'Sub Assembly',
        placeholderName: 'Sub Assembly',
        isRequired: true,
        isAddnew: false,
        callbackFn: getSubAssemblyList,
        onSelectCallbackFn: selectSubAssembly
      };
    };

    const initAutoCompleteWO = () => {
      vm.autoCompleteWO = {
        columnName: 'woAssyNumber',
        keyColumnName: 'woNumber',
        keyColumnId: vm.umidDetail && vm.umidDetail.woNumber ? vm.umidDetail.woNumber : null,
        inputName: 'WO#',
        placeholderName: 'WO#',
        isRequired: vm.umidDetail.stockInventoryType === vm.InventoryType[2].value ? true : false,
        isAddnew: false,
        callbackFn: getExistingAssemblyWorkorderDetail,
        onSelectCallbackFn: selectWO
      };
    };

    /* [E] ------ Auto complete & rendering API(s) ----- [E] */

    // Get UMID Details by ID
    const ReceivingMaterialDetails = (componentStockId) => vm.cgBusyLoading = ReceivingMaterialFactory.getUMIDByID().query({
      id: componentStockId
    }).$promise.then((receivingmaterialdetail) => {
      if (receivingmaterialdetail && receivingmaterialdetail.data) {
        vm.isEdit = true;
        $scope.$parent.vm.isEdit = vm.isEdit;
        vm.saveBtnDisableFlag = false;
        const componentSidStock = receivingmaterialdetail.data;
        vm.umidDetail.receiveMaterialType = componentSidStock.receiveMaterialType;
        vm.umidDetail.stockInventoryType = componentSidStock.stockInventoryType;
        vm.umidDetail.orgQty = componentSidStock.orgQty;
        vm.umidDetail.orgPkgUnit = componentSidStock.orgPkgUnit;
        vm.umidDetail.orgRecBin = componentSidStock.orgRecBin;
        vm.umidDetail.woID = componentSidStock.woID;
        vm.umidDetail.woNumber = componentSidStock.woNumber;
        vm.umidDetail.fromUID = componentSidStock.fromUID;
        vm.umidDetail.fromUIDId = componentSidStock.fromUIDId;
        vm.umidDetail.parentUID = componentSidStock.parentUID;
        vm.umidDetail.parentUIDId = componentSidStock.parentUIDId;
        vm.umidDetail.isSplitUID = vm.umidDetail.stockInventoryType === vm.InventoryType[3].value ? true : false;
        $scope.$parent.vm.isSplitUID = vm.umidDetail.isSplitUID;
        if (vm.umidDetail.woNumber && !_.find(vm.workorderList, { woNumber: vm.umidDetail.woNumber })) {
          vm.umidDetail.woAvailableQty = 0;
          vm.isHideWOAutocomplete = true;
        }

        vm.isDisableCount = true;

        if (vm.umidDetail.orgRecBin !== componentSidStock.binID) {
          vm.isDisableBin = true;
        }

        vm.umidDetail.fromBin = componentSidStock.fromBin;
        vm.umidDetail.cpn = componentSidStock.cpn;
        vm.umidDetail.id = componentSidStock.id;
        vm.umidDetail.ScanLabel = componentSidStock.scanlabel;
        if (vm.umidDetail.ScanLabel) {
          vm.selectPartBarcode = 'true';
          vm.umidDetail.formatType = vm.Transaction.FIRSTSCANLBL;
        } else {
          vm.selectPartBarcode = 'false';
          vm.umidDetail.formatType = vm.Transaction.FIRSTMFG;
        }
        vm.umidDetail.pkgQty = componentSidStock.pkgQty;
        vm.umidDetail.uid = componentSidStock.uid;
        vm.umidDetail.oldPackaging = componentSidStock.packaging;
        vm.umidDetail.prefix = componentSidStock.prefix;
        vm.umidDetail.pcbPerArray = componentSidStock.pcbPerArray;
        vm.umidDetail.customerConsign = componentSidStock.customerConsign;
        vm.umidDetail.isReservedStock = componentSidStock.isReservedStock;
        vm.umidDetail.MFGorExpiryDate = componentSidStock.MFGorExpiryDate ? componentSidStock.MFGorExpiryDate : vm.DateTypeList[0].type;
        vm.umidDetail.mfgDate = componentSidStock.mfgDate ? BaseService.getUIFormatedDate(componentSidStock.mfgDate, vm.DefaultDateFormat) : '';
        vm.umidDetail.expiryDate = componentSidStock.expiryDate ? BaseService.getUIFormatedDate(componentSidStock.expiryDate, vm.DefaultDateFormat) : '';
        vm.umidDetail.copyMfgDate = angular.copy(vm.umidDetail.mfgDate);
        vm.umidDetail.copyExpiryDate = angular.copy(vm.umidDetail.expiryDate);
        calCulateExpiryInDays();
        vm.umidDetail.sealDate = componentSidStock.sealDate ? BaseService.getUIFormatedDate(componentSidStock.sealDate, vm.DefaultDateFormat) : '';
        vm.umidDetail.nickName = componentSidStock.nickName;
        vm.umidDetail.packaging = componentSidStock.packaging ? componentSidStock.packaging : componentSidStock.component && componentSidStock.component.packagingID ? componentSidStock.component.packagingID : null;
        if (componentSidStock.fromBinMst) {
          vm.umidDetail.fromBinName = componentSidStock.fromBinMst.Name;
          vm.umidDetail.fromBin = componentSidStock.fromBinMst.id;
        }

        if (componentSidStock.binMst) {
          vm.umidDetail.currentBinName = componentSidStock.binMst.Name;
          vm.umidDetail.binID = componentSidStock.binMst.id;
          vm.umidDetail.currentWarehouseType = componentSidStock.binMst.warehousemst ? componentSidStock.binMst.warehousemst.warehouseType : null;
          vm.umidDetail.currentDepartmentName = componentSidStock.binMst.warehousemst && componentSidStock.binMst.warehousemst.parentWarehouseMst ? componentSidStock.binMst.warehousemst.parentWarehouseMst.Name : null;
          $scope.$parent.vm.currentWarehouseType = vm.umidDetail.currentWarehouseType;
          $scope.$parent.vm.currentDepartmentName = vm.umidDetail.currentDepartmentName;
        }

        vm.umidDetail.customerID = componentSidStock.customerID;
        vm.umidDetail.mfgAvailabel = componentSidStock.mfgAvailabel;
        assemblyId = componentSidStock.assyID;
        vm.umidDetail.specialNote = componentSidStock.specialNote;
        vm.umidDetail.rohsStatusID = componentSidStock.rohsStatusID;
        if (componentSidStock.cofcDocumentCount > 0) {
          if (vm.umidDetail.stockInventoryType === vm.InventoryType[0].value) {
            vm.umidDetail.cOfcCode = componentSidStock.packingSlipDet ? componentSidStock.packingSlipDet.cOfcCode : null;
          } else if (vm.umidDetail.stockInventoryType === vm.InventoryType[3].value) {
            vm.umidDetail.cOfcCode = componentSidStock.packingSlipDet ? componentSidStock.packingSlipDet.cOfcCode : vm.umidDetail.parentUID;
          } else {
            vm.umidDetail.cOfcCode = vm.umidDetail.uid;
          }
        }
        if (vm.umidDetail.stockInventoryType === vm.InventoryType[0].value && componentSidStock.packingSlipDet) {
          vm.umidDetail.packingSlipNumber = componentSidStock.packingSlipDet.packingSlipNumber;
          vm.umidDetail.packingSlipDetailId = componentSidStock.packingSlipDet.id;
        }

        if (componentSidStock.component) {
          vm.umidDetail.PIDCode = componentSidStock.component.PIDCode;
          vm.umidDetail.mfgcodeID = componentSidStock.component.mfgcodeID;
          getComponentDetailsByMfg({
            id: componentSidStock.component.id,
            mfgcodeID: componentSidStock.component.mfgcodeID
          });
          vm.umidDetail.refcompid = componentSidStock.component.id;
          vm.umidDetail.mfgType = componentSidStock.component.mfgType;
          vm.umidDetail.mfgPN = componentSidStock.component.mfgPN;
          vm.umidDetail.mfgPNDescription = componentSidStock.component.mfgPNDescription;
          vm.umidDetail.lotCode = componentSidStock.lotCode;
          vm.umidDetail.mfrDateCodeFormatID = componentSidStock.mfrDateCodeFormatID || null;
          vm.umidDetail.mfrDateCodeFormat = componentSidStock.dateCodeFormatMst ? componentSidStock.dateCodeFormatMst.dateCodeFormat : null;
          vm.umidDetail.mfrDateCode = componentSidStock.mfrDateCode;
          vm.umidDetail.mfrDateCodeLength = vm.umidDetail.mfrDateCodeFormat ? vm.umidDetail.mfrDateCodeFormat.length : 0;
          vm.umidDetail.dateCode = componentSidStock.dateCode;
          vm.umidDetail.dateCodeFormatID = componentSidStock.dateCodeFormatID;
          setInternalDateFormatData(vm.umidDetail.dateCodeFormatID);
          vm.umidDetail.fromDateCodeFormat = componentSidStock.fromDateCodeFormat;
          if (vm.umidDetail.fromDateCodeFormat !== vm.DateCodeFormatFrom[0].key) {
            const dateCodeFormatFromValue = _.find(vm.DateCodeFormatFrom, { key: vm.umidDetail.fromDateCodeFormat });
            if (dateCodeFormatFromValue) {
              vm.umidDetail.dateCodeFormatFromValue = dateCodeFormatFromValue.value;
            }
          }
          if (componentSidStock.component.rfq_rohsmst) {
            if (componentSidStock.component.rfq_rohsmst.refMainCategoryID === -2) {
              vm.umidDetail.rohs = 'No';
            } else if (componentSidStock.component.rfq_rohsmst.refMainCategoryID === -1 && componentSidStock.component.rfq_rohsmst.name !== CORE.RoHSStatus.RoHSExempt) {
              vm.umidDetail.rohs = 'Yes';
            } else if (componentSidStock.component.rfq_rohsmst.refMainCategoryID === -1 && componentSidStock.component.rfq_rohsmst.name === CORE.RoHSStatus.RoHSExempt) {
              vm.umidDetail.rohs = 'Y-Exmpt';
            } else {
              vm.umidDetail.rohs = componentSidStock.component.rfq_rohsmst.name;
            }
            vm.umidDetail.rohsName = componentSidStock.component.rfq_rohsmst.name;
            vm.umidDetail.rohsIcon = componentSidStock.component.rfq_rohsmst.rohsIcon;
          }
          editCostCategoryId = componentSidStock.costCategoryID ? componentSidStock.costCategoryID : componentSidStock.component.costCategoryID;
          vm.umidDetail.oldpcbPerArray = componentSidStock.component.pcbPerArray;
          vm.umidDetail.pcbPerArray = componentSidStock.component.pcbPerArray;
          vm.umidDetail.spq = componentSidStock.component_supplier && componentSidStock.component_supplier.umidSPQ ? componentSidStock.component_supplier.umidSPQ : componentSidStock.component.umidSPQ ? componentSidStock.component.umidSPQ : 0;
          if (componentSidStock.component.component_mslmst) {
            vm.umidDetail.mslLevel = stringFormat('{0} ({1})', componentSidStock.component.component_mslmst.levelRating, componentSidStock.component.component_mslmst.time);
            vm.umidDetail.mslLevelForPrint = stringFormat('{0}-{1}', componentSidStock.component.component_mslmst.levelRating, componentSidStock.component.component_mslmst.code);
          }
          vm.umidDetail.selfLifeDays = componentSidStock.selfLifeDays || 0;
          vm.umidDetail.shelfLifeAcceptanceDays = componentSidStock.shelfLifeAcceptanceDays || 0;
          vm.umidDetail.maxShelfLifeAcceptanceDays = componentSidStock.maxShelfLifeAcceptanceDays || 0;
          vm.shelfLifeDateType = componentSidStock.MFGorExpiryDate || null;
          vm.mountingType = componentSidStock.component.rfqMountingType ? componentSidStock.component.rfqMountingType.name : null;
          vm.hasLimitedShelfLife = componentSidStock.component.rfqMountingType ? componentSidStock.component.rfqMountingType.hasLimitedShelfLife : 0;
          vm.umidDetail.uom = componentSidStock.component.uom ? componentSidStock.component.uom : componentSidStock.uom;
          vm.umidDetail.uomName = componentSidStock.component.UOMs && componentSidStock.component.UOMs.unitName ? componentSidStock.component.UOMs.unitName : null;
          vm.umidDetail.uomClassID = componentSidStock.component.UOMs && componentSidStock.component.UOMs.measurementType && componentSidStock.component.UOMs.measurementType.id ? componentSidStock.component.UOMs.measurementType.id : null;
          vm.umidDetail.componentUnit = componentSidStock.component.unit;
          vm.umidDetail.pkgUnit = componentSidStock.pkgUnit;
          vm.umidDetail.partPackagingMinQty = componentSidStock.component.umidSPQ;
          vm.umidDetail.partPackage = componentSidStock.component.rfq_packagecasetypemst ? componentSidStock.component.rfq_packagecasetypemst.name : null;
          vm.umidDetail.externalPartPackage = componentSidStock.component.partPackage;
          vm.umidDetail.createdUserCode = componentSidStock.createdUserCode;
          if (componentSidStock && componentSidStock.kitAllocation && componentSidStock.kitAllocation.length > 0) {
            vm.allocatedKitCount = componentSidStock.kitAllocation.length;
          }
          setShelfLifeDateType(componentSidStock.MFGorExpiryDate);
          initCPNAutoComplete();
          autocompleteprice();
          $timeout(() => {
            initAutoComplete();
            autoComplete();
          }, true);

          initAutoCompleteSO();
          initAutoCompleteSubAssembly();
          initAutoCompleteWO();
          getNumberOfPrintsForUMID(vm.umidDetail.refcompid);
        }
        if (componentSidStock.component_cpn) {
          vm.umidDetail.cpnmfgcodeID = componentSidStock.component_cpn.mfgcodeID;
          getCpnComponentDetailsByMfg({
            id: componentSidStock.component_cpn.id,
            mfgcodeID: componentSidStock.component_cpn.mfgcodeID
          });
        }
        if (componentSidStock.component_supplier) {
          vm.supplierPartId = componentSidStock.component_supplier.id;
          vm.supplierCode = componentSidStock.component_supplier.mfgCodemst ? BaseService.getMfgCodeNameFormat(componentSidStock.component_supplier.mfgCodemst.mfgCode, componentSidStock.component_supplier.mfgCodemst.mfgName) : null;
          vm.supplierMFGPN = componentSidStock.component_supplier.mfgCodemst ? stringFormat('({0}) {1}', componentSidStock.component_supplier.mfgCodemst.mfgCode, componentSidStock.component_supplier.mfgPN) : null;
          vm.umidDetail.supplierMFGPN = componentSidStock.component_supplier.mfgPN;
        }
        componentSidStock.component.uid = vm.umidDetail.uid;
        $scope.$emit('sendComponent', componentSidStock.component);
        $scope.$parent.vm.UMID = vm.umidDetail.uid;
        vm.umidDetailCopy = _.clone(vm.umidDetail);
        grid();
        vm.cstID = componentStockId;
        vm.execute = true;

        $scope.$parent.vm.isReservedStock = vm.umidDetail.isReservedStock;
        $scope.$parent.vm.customerConsign = vm.umidDetail.customerConsign;

        initPageInfo();
        vm.checkDirtyObject = {
          oldModelName: vm.umidDetailCopy,
          newModelName: vm.umidDetail
        };

        UMIDPrintButtonFocus = getLocalStorageValue('UMIDPrintButtonFocus');
        if (UMIDPrintButtonFocus && UMIDPrintButtonFocus.isFocus) {
          $timeout(() => {
            setFocus('btnPrintLabelUMID');
          });
          removeLocalStorageValue('UMIDPrintButtonFocus');
        }
        manageDateCodeFormatValidation();
      }
    }).catch((error) => {
      vm.saveBtnDisableFlag = false;
      return BaseService.getErrorLog(error);
    });

    vm.goBack = () => {
      if (BaseService.checkFormDirty(vm.formReceivingMaterial, vm.checkDirtyObject)) {
        showWithoutSavingAlertforGoback();
      } else {
        $state.go(vm.TransactionData.TRANSACTION_RECEIVINGMATERIAL_LIST_STATE);
      }
    };

    if ($stateParams.id > 0 && vm.getcomponentStockId) {
      vm.isEdit = true;
      $scope.$parent.vm.isEdit = vm.isEdit;
    }

    /* [S] ------ Data element grid functionality ----- [S] */
    vm.loadData = () => {
      if ($stateParams.id || vm.getcomponentStockId) {
        vm.pagingInfo.Page = 0;
        vm.cgBusyLoading = ReceivingMaterialFactory.componentSidStockDataelementValues().query(vm.pagingInfo).$promise.then((response) => {
          vm.sourceData = response.data.componentSidStockDataelementValues;
          vm.totalSourceDataCount = response.data.Count;

          if (!vm.gridOptions.enablePaging) {
            vm.currentdata = vm.sourceData.length;
            vm.gridOptions.gridApi.infiniteScroll.resetScroll();
          }

          vm.gridOptions.clearSelectedRows();
          if (vm.totalSourceDataCount === 0) {
            if (vm.pagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
              vm.isNoDataFound = false;
              vm.emptyState = 0;
            } else {
              vm.isNoDataFound = true;
              vm.emptyState = null;
            }
          } else {
            /* to set data element name in grid  */
            _.each(vm.sourceData, (item, index) => {
              item['index'] = index;
            });

            vm.isNoDataFound = false;
            vm.emptyState = null;
          }
          $timeout(() => {
            vm.resetSourceGrid();
            vm.getDataElementList();
            $timeout(() => { }, _configTimeout);
            cellEdit();
          });
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.sourceData = [];
        vm.totalSourceDataCount = vm.sourceData.length;
        if (!vm.gridOptions.enablePaging) {
          vm.currentdata = vm.sourceData.length;
        }
        vm.isNoDataFound = true;
        vm.emptyState = null;
        $timeout(() => {
          vm.resetSourceGrid();
          vm.getDataElementList();
          cellEdit();
          if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
          }
        });
      }
    };

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: '0',
        SortColumns: [],
        SearchColumns: [],
        cstID: vm.cstID ? vm.cstID : 0,
        pageName: CORE.PAGENAME_CONSTANT[7].PageName
      };
    };

    initPageInfo();

    vm.gridOptions = {
      showColumnFooter: false,
      enableRowHeaderSelection: true,
      enableFullRowSelection: false,
      enableRowSelection: true,
      multiSelect: true,
      filterOptions: vm.pagingInfo.SearchColumns,
      enableCellEdit: !vm.isReadOnly,
      enablePaging: false,
      enableCellEditOnFocus: true,
      exporterMenuCsv: true,
      exporterCsvFilename: 'Receiving Material Details.csv',
      hideAddNew: $stateParams.id ? false : true
    };

    function cellEdit() {
      vm.gridOptions.gridApi.edit.on.afterCellEdit($scope, (rowEntity, coldef) => {
        // required validatuion for dataElementName
        const emptyDataElement = _.find(vm.sourceData, (d) => d.dataElementName === null);
        if (!emptyDataElement) {
          vm.isdataValid = true;
        } else {
          vm.gridOptions.gridApi.cellNav.scrollToFocus(vm.sourceData[emptyDataElement.index], vm.sourceHeader[2]);
          vm.gridOptions.gridApi.grid.validate.setInvalid(vm.sourceData[emptyDataElement.index], vm.sourceHeader[2]);
          vm.isdataValid = false;
          return;
        }

        // not duplicate data-element
        if (coldef.name === 'dataElementName') {
          if (rowEntity.dataElementName) {
            // check for duplicate data element.
            const duplicateDataElement = _.find(vm.sourceData, (d) => d.dataElementName === rowEntity.dataElementName && rowEntity.index !== d.index);
            if (duplicateDataElement) {
              rowEntity.dataElementName = null;
              vm.gridOptions.gridApi.cellNav.scrollToFocus(vm.sourceData[rowEntity.index], vm.sourceHeader[2]);
              vm.gridOptions.gridApi.grid.validate.setInvalid(vm.sourceData[rowEntity.index], vm.sourceHeader[2]);
              vm.isdataValid = false;
              return;
            } else {
              vm.isdataValid = true;
            }
          }
        }
        if (vm.isdataValid && !vm.initialLoad) {
          vm.isChanged = true;
        }
        vm.initialLoad = false;
      });
    }

    function grid() {
      vm.sourceHeader = [
        {
          field: '#',
          width: '50',
          cellTemplate: '<div class="ui-grid-cell-contents" ng-disabled="row.entity.isdisable || vm.isReadOnly"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
          enableFiltering: false,
          enableSorting: false,
          enableCellEdit: false

        },
        {
          field: 'dataElementName',
          displayName: 'Data Field',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}" ng-disabled="row.entity.isdisable || vm.isReadOnly">{{COL_FIELD}}</div>',
          width: '200',
          editableCellTemplate: '<div style="height:100% !important;width:100% !important"><form name="inputForm" style="height:100% !important;width:100% !important"><select id=\'ddlDataElement_{{grid.renderContainers.body.visibleRowCache.indexOf(row)}}\' ng-class="\'colt\' + col.uid" ui-grid-edit-dropdown ng-model="MODEL_COL_FIELD" ng-options="field[editDropdownIdLabel] as field[editDropdownValueLabel] CUSTOM_FILTERS for field in editDropdownOptionsArray disable when vm.isReadOnly" style="height:100% !important;width:100% !important" class=\'form-control\'></select></form></div>',
          editDropdownIdLabel: 'dataElementName',
          editDropdownValueLabel: 'dataElementName',
          editDropdownOptionsArray: vm.dataelementList,
          validators: {
            required: true
          },
          enableFiltering: false,
          enableSorting: false,
          enableCellEdit: !vm.isReadOnly
        },
        {
          field: 'value',
          displayName: 'Value',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-disabled="row.entity.isdisable || vm.isReadOnly">{{COL_FIELD}}</div>',
          width: '250',
          enableFiltering: false,
          enableSorting: false
        },
        {
          field: 'Action',
          cellClass: 'layout-align-center-center',
          displayName: 'Action',
          width: '120',
          cellTemplate: '<md-button class="md-primary grid-button md-icon-button bdrbtn" ng-disabled="vm.isReadOnly" ng-click="grid.appScope.$parent.vm.deleteRecord(row.entity)">' +
            '<md-icon role="img" md-font-icon="icon-trash"></md-icon><md-tooltip md-direction="top">Delete</md-tooltip>' +
            '</md-button>',
          enableFiltering: false,
          enableSorting: false,
          enableCellEdit: false,
          exporterSuppressExport: true
        }
      ];
    }

    // Add new row in ui grid
    $scope.addNewParentRow = () => {
      if (vm.isdataValid === false && vm.sourceData.length > 0) {
        return;
      }
      if (vm.sourceData && vm.sourceData.length === 0) {
        const obj = {
          index: 0,
          id: 0,
          value: null
        };
        vm.sourceData.push(obj);
      } else {
        const objMax = _.maxBy(vm.sourceData, (item) => item.index);
        if (!objMax) {
          objMax.index = 0;
        }
        const obj = {
          index: objMax.index + 1,
          id: 0,
          value: '',
          dataElementName: null
        };
        vm.sourceData.push(obj);
      }
      vm.totalSourceDataCount = vm.sourceData.length;
      vm.currentdata = vm.totalSourceDataCount;
      $timeout(() => {
        vm.resetSourceGrid();
        vm.getDataElementList();
        vm.gridOptions.gridApi.cellNav.scrollToFocus(vm.sourceData[vm.sourceData.length - 1], vm.sourceHeader[1]);
      }, _configTimeout);
    };

    // Remove row from ui grid
    vm.deleteRecord = (row) => {
      let selectedIDs = [];

      if (row && row.id) {
        selectedIDs.push(row.id);
      } else if (!row) {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((item) => item.id);
        }
      }

      const blankIDs = _.filter(selectedIDs, (item) => item === 0);
      const DBIDs = _.filter(selectedIDs, (item) => item !== 0);

      if (selectedIDs) {
        if (row && row.id === 0 && row.index === 0) {
          selectedIDs.length = 1;
        }
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Data Field', selectedIDs.length);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            if (DBIDs && DBIDs.length > 0) {
              removeIndexFromSourceData(DBIDs);
              const objIDs = {
                id: selectedIDs
              };
              vm.cgBusyLoading = ReceivingMaterialFactory.deleteComponentSidStockDataElement().query({
                objIDs: objIDs
              }).$promise.then((res) => {
                if (res && res.data) {
                  removeIndexFromSourceData(DBIDs);
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
            // if row is blank.
            if (row && row.id === 0) {
              const data = _.find(vm.sourceData, (Item) => Item.index === row.index);
              const index = _.indexOf(vm.sourceData, data);
              removeSingleRowBlankData(index);
            }
            // if selected rows are blank.
            if (blankIDs && blankIDs.length > 0) {
              removeIndexFromSourceData(blankIDs);
            }
          }
        }, () => { }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    /* delete multiple data called from directive of ui-grid*/
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };

    // Deleted rows remove from source data.
    function removeIndexFromSourceData(index) {
      _.each(index, (itemData) => {
        vm.sourceData = _.reject(vm.sourceData, (item) => item.id === itemData);
      });
      vm.totalSourceDataCount = vm.sourceData.length;
      vm.currentdata = vm.totalSourceDataCount;
      vm.gridOptions.clearSelectedRows();
      $timeout(() => {
        vm.resetSourceGrid();
        vm.getDataElementList();
        vm.gridOptions.gridApi.cellNav.scrollToFocus(vm.sourceData[vm.sourceData.length - 1], vm.sourceHeader[1]);
      }, 0);
    }

    // delete singal blank row
    function removeSingleRowBlankData(index) {
      vm.sourceData.splice(index, 1);
      vm.totalSourceDataCount = vm.sourceData.length;
      vm.currentdata = vm.totalSourceDataCount;
      $timeout(() => {
        vm.resetSourceGrid();
        vm.getDataElementList();
        vm.gridOptions.gridApi.cellNav.scrollToFocus(vm.sourceData[vm.sourceData.length - 1], vm.sourceHeader[2]);
      }, 0);
    }

    // get dataentityid and elementid from list
    function checkDataFields(item, elementObj) {
      if (elementObj && elementObj.length > 0) {
        if (elementObj && _.first(elementObj).dataElementID) {
          item.dataelementid = _.first(elementObj).dataElementID;
          item.entityid = _.first(elementObj).entityID;
        }
      }
    }
    /* [E] ------ Data element grid functionality ----- [E] */

    // Save UMID Details
    vm.SaveDataElements = () => {
      vm.scanLabel = false;
      let colindex = null;
      const kitAllocation = {};

      vm.saveBtnDisableFlag = true;

      if (BaseService.focusRequiredField(vm.formReceivingMaterial) || vm.isExpire) {
        vm.saveBtnDisableFlag = false;
        return;
      }

      if (!vm.umidDetail.prefix) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.REQUIRE_PREFIX);
        const returnVal = checkScanValidation(messageContent, 'PrefixRequire');
        if (!returnVal) {
          vm.saveBtnDisableFlag = false;
          return;
        }
      }

      if (!vm.umidDetail.dateCode || !vm.umidDetail.dateCodeFormatID) {
        vm.saveBtnDisableFlag = false;
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.INTERNAL_DATE_CODE_REQUIRED);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        return DialogFactory.messageAlertDialog(model).then((yes) => {
          if (yes) {
            setFocus('mfgDateCode');
          }
        }, () => {

        }).catch((error) => BaseService.getErrorLog(error));
      }

      if (vm.hasLimitedShelfLife && (vm.umidDetail.MFGorExpiryDate === vm.DateTypeList[0].type)) {
        vm.saveBtnDisableFlag = false;
        checkShelfLifeDateTypeForHasShelfLife();
        return;
      }

      if (vm.isAllocateToKit) {
        if (!(vm.getcomponentStockId || $stateParams.id) && !vm.rohsStatusDetail.isMismatch && selectedPO && vm.withKitAllocation && vm.autoCompleteRohsStatus.keyColumnId && vm.rohsStatusCheck !== vm.autoCompleteRohsStatus.keyColumnId) {
          const Obj = {
            PIDCode: vm.umidDetail.PIDCode,
            isUMID: true
          };
          DialogFactory.dialogService(
            CORE.ROHS_STATUS_MISMATCH_CONFIRMATION_CONTROLLER,
            CORE.ROHS_STATUS_MISMATCH_CONFIRMATION_VIEW,
            null,
            Obj).then(() => { }, (data) => {
              if (data) {
                vm.rohsStatusDetail = {
                  roHSApprovalReason: data.reason,
                  isMismatch: true
                };
                vm.SaveDataElements();
              } else {
                vm.saveBtnDisableFlag = false;
              }
            }, (error) => BaseService.getErrorLog(error));
          vm.saveBtnDisableFlag = false;
          return;
        }
        else if (vm.rohsStatusDetail.isMismatch) {
          kitAllocation.roHSApprovalReason = vm.rohsStatusDetail.roHSApprovalReason;
        }

        if (!(vm.getcomponentStockId || $stateParams.id) && !buyAndStockMismatchDetail &&
          ((vm.umidDetail.customerConsign && vm.umidDetail.isPurchaseAtBOM) ||
            ((!vm.umidDetail.customerConsign || vm.umidDetail.isReservedStock) && !vm.umidDetail.isPurchaseAtBOM))) {
          const Obj = {
            popUpHeaderName: CORE.BuyAndStockTypeMismatchConfirmationPopup.HeaderLabel,
            displayMessage: (!vm.umidDetail.customerConsign || vm.umidDetail.isReservedStock) ? stringFormat(CORE.BuyAndStockTypeMismatchConfirmationPopup.DisplayNoteForInternalStockForUMID, vm.umidDetail.PIDCode) : stringFormat(CORE.BuyAndStockTypeMismatchConfirmationPopup.DisplayNoteForCustomerStockForUMID, vm.umidDetail.PIDCode),
            roleAccess: CORE.ROLE_ACCESS.VERIFICATION_ROLE_ACCESS,
            reasonTextBoxLength: 1000,
            CancelButton: CORE.BuyAndStockTypeMismatchConfirmationPopup.CancelButton,
            ConfirmButton: CORE.BuyAndStockTypeMismatchConfirmationPopup.ConfirmButton
          };
          DialogFactory.dialogService(
            CORE.COMMON_USERNAME_PASSWORD_CONFIRMATION_POPUP_CONTROLLER,
            CORE.COMMON_USERNAME_PASSWORD_CONFIRMATION_POPUP_VIEW,
            null,
            Obj).then(() => { }, (data) => {
              if (data) {
                buyAndStockMismatchDetail = data;
                vm.SaveDataElements();
              } else {
                buyAndStockMismatchDetail = null;
              }
            }, (error) => BaseService.getErrorLog(error));
          vm.saveBtnDisableFlag = false;
          return;
        }
        else {
          kitAllocation.allocationRemark = buyAndStockMismatchDetail && buyAndStockMismatchDetail.reason ? buyAndStockMismatchDetail.reason : null;
        }

        vm.getHoldResumeStatus({
          salesOrderDetailId: vm.POData.SalesOrderDetailId
        });
      }

      if (!vm.umidDetail.binID || !vm.umidDetail.fromBin) {
        let messageContent = null;
        if (!vm.umidDetail.fromBin) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RE_ENTER_BIN);
          messageContent.message = stringFormat(messageContent.message, 'From Location/Bin', 'From Location/Bin');
        } else {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RE_ENTER_BIN);
          messageContent.message = stringFormat(messageContent.message, 'To Location/Bin', 'To Location/Bin');
        }

        const model = {
          messageContent: messageContent,
          multiple: true
        };
        return DialogFactory.messageAlertDialog(model).then((yes) => {
          if (yes) {
            if (!vm.umidDetail.fromBin) {
              // if (!vm.isEdit) {
              vm.saveBtnDisableFlag = false;
              vm.umidDetail.fromBin = null;
              vm.umidDetail.fromBinName = null;
              setFocus('fromBinName');
              // }
            } else {
              vm.saveBtnDisableFlag = false;
              vm.umidDetail.binID = null;
              vm.umidDetail.currentBinName = null;
              setFocus('currentBinName');
            }
          }
        }, () => {

        }).catch((error) => {
          vm.saveBtnDisableFlag = false;
          return BaseService.getErrorLog(error);
        });
      }

      if ((vm.umidDetail.stockInventoryType === vm.TransactionData.InventoryType[0].value) && (objToBin && objToBin.warehousemst && objToBin.warehousemst.parentWHID !== vm.umidDetail.fromDepartment)) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.FROM_TO_DEPT_SAME);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        return DialogFactory.messageAlertDialog(model).then((yes) => {
          if (yes) {
            vm.saveBtnDisableFlag = false;
            vm.umidDetail.binID = null;
            vm.umidDetail.currentBinName = null;
            setFocus('currentBinName');
          }
        }, () => {

        }).catch((error) => {
          vm.saveBtnDisableFlag = false;
          return BaseService.getErrorLog(error);
        });
      }

      if (!vm.isScanLabel && (vm.autoCompletecomponent && !vm.autoCompletecomponent.keyColumnId)) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RE_ENTER_BIN);
        messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.MFG.ScanMPNSPN, vm.LabelConstant.MFG.ScanMPNSPN);

        const model = {
          messageContent: messageContent,
          multiple: true
        };
        return DialogFactory.messageAlertDialog(model).then((yes) => {
          if (yes) {
            vm.saveBtnDisableFlag = false;
            vm.isScanLabel = false;
            $scope.$parent.vm.checkScanLabel = vm.isScanLabel;
            vm.umidDetail.ScanLabel = null;
            setFocus('ScanLabel');
          }
        }, () => {
        }).catch((error) => {
          vm.saveBtnDisableFlag = false;
          return BaseService.getErrorLog(error);
        });
      }

      if (vm.isExpire) {
        vm.saveBtnDisableFlag = false;
        return;
      }

      _.each(vm.sourceData, (item) => {
        // Check required validation for inner grid fields.
        if (!item.dataElementName) {
          vm.isfalse = true;
          colindex = item.index;
          vm.gridOptions.gridApi.cellNav.scrollToFocus(vm.sourceData[colindex], vm.sourceHeader[1]);
          vm.gridOptions.gridApi.grid.validate.setInvalid(vm.sourceData[colindex], vm.sourceHeader[1]);
          return false;
        }
      });

      if (vm.getcomponentStockId || $stateParams.id) {
        bindComponentSidStockDetails(true, kitAllocation);
      } else {
        vm.saveBtnDisableFlag = false;
        if (vm.umidDetail.isReservedStock) {
          const returnVal = matchAllocatToKit();
          if (!returnVal) {
            return;
          }
        }

        //Need to remove from here and set logic in bind
        bindComponentSidStockDetails(false, kitAllocation);
      }
    };

    // Manage UMID Details
    const manageSaveDataElements = (componentSidStockDetails) => {
      vm.saveBtnDisableFlag = false;
      //start api calling for add/update
      if (vm.getcomponentStockId || $stateParams.id) {
        vm.cgBusyLoading = ReceivingMaterialFactory.updateComponentSidStock().query({
          componentSidStockDetails: componentSidStockDetails
        }).$promise.then((res) => {
          if (res.data && res.data.messageTypeCode === 'UPDATE') {
            vm.saveBtnDisableFlag = false;
            vm.formReceivingMaterial.$setPristine();
            vm.isScanLabel = false;
            $scope.$parent.vm.checkScanLabel = vm.isScanLabel;
            approvalReasonList = [];
            objDaysApproval = null;
            vm.cstID = vm.getcomponentStockId ? vm.getcomponentStockId : $stateParams.id;
            $timeout(() => {
              ReceivingMaterialDetails(vm.getcomponentStockId ? vm.getcomponentStockId : $stateParams.id);
            }, _configSelectListTimeout);
            vm.loadData();
            $scope.$parent.vm.isUMIDDataCount = 1;
            $timeout(() => {
              setFocus('btnPrintLabelUMID');
            });
          } else {
            vm.saveBtnDisableFlag = false;
          }
        }).catch((error) => {
          vm.saveBtnDisableFlag = false;
          return BaseService.getErrorLog(error);
        });
      }
      else {
        vm.cgBusyLoading = ReceivingMaterialFactory.saveComponentSidStock().query({
          componentSidStk: componentSidStockDetails
        }).$promise.then((res) => {
          if (res.data && res.data.DataId && res.data.messageTypeCode === 'CREATE') {
            vm.saveBtnDisableFlag = false;
            vm.formReceivingMaterial.$setPristine();
            vm.isScanLabel = false;
            $scope.$parent.vm.checkScanLabel = vm.isScanLabel;
            vm.getcomponentStockId = res.data.DataId;
            vm.cstID = vm.getcomponentStockId;
            vm.pagingInfo.cstID = vm.getcomponentStockId;
            vm.loadData();
            $state.transitionTo($state.$current, {
              id: vm.getcomponentStockId
            }, {
              location: true,
              inherit: true,
              notify: true
            });
            setLocalStorageValue('UMIDPrintButtonFocus', {
              isFocus: true
            });
            vm.isChanged = false;
            $scope.$parent.vm.isUMIDDataCount = 1;
            objApproval = null;
            approvalReasonList = [];
            objDaysApproval = null;
            vm.rohsStatusDetail = {};
            $scope.$parent.vm.refUMIDId = vm.cstID;
            $scope.$parent.vm.isReservedStock = vm.umidDetail.isReservedStock;
            $scope.$parent.vm.customerConsign = vm.umidDetail.customerConsign;
            getNonUMIDCount();
          }
          else if (res.data && !res.data.IsSuccess && res.data.KitName) {
            vm.saveBtnDisableFlag = false;
            vm.cgBusyLoading = false;
            vm.focusCount = false;
            vm.rohsStatusDetail = {};
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.UMID_STOCK_NOT_ALLOCATED);
            messageContent.message = stringFormat(messageContent.message, res.data.KitName);
            const model = {
              messageContent: messageContent,
              btnText: vm.TransactionData.RECEIVINGMATERIAL.CreateUMIDWithoutKitAllocation,
              canbtnText: CORE.MESSAGE_CONSTANT.CANCEL_BUTTON,
              multiple: true
            };
            return DialogFactory.messageConfirmDialog(model).then((yes) => {
              if (yes) {
                vm.withKitAllocation = false;
                vm.checkValidation = true;
                vm.SaveDataElements();
              }
            }, () => {
            }).catch((error) => BaseService.getErrorLog(error));
          } else if (res.data && res.data.messageTypeCode) {
            vm.cgBusyLoading = false;
            vm.focusCount = false;
            vm.saveBtnDisableFlag = false;
            vm.rohsStatusDetail = {};
            if (res.data.messageTypeCode === 'BIN_NOT_HAVE_STOCK') {
              const messageContentData = angular.copy(res.data.messageContent);
              const model = {
                messageContent: messageContentData,
                multiple: true
              };
              return DialogFactory.messageAlertDialog(model).then((yes) => {
                if (yes) {
                  setFocusAndValueSelecte('txtqty');
                }
              }, () => {
              }).catch((error) => BaseService.getErrorLog(error));
            } else if (res.data.messageTypeCode === 'STOCK_NOT_EXISTS') {
              const messageContentData = angular.copy(res.data.messageContent);
              messageContentData.message = stringFormat(messageContentData.message, redirectToPackingSlipDetail(vm.umidDetail.packingSlipID, vm.umidDetail.packingSlipNumber));
              const obj = {
                messageContent: messageContentData,
                btnText: CORE.MESSAGE_CONSTANT.GO_TO_PENDING_STOCK,
                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_FOR_CANCEL
              };
              return DialogFactory.messageConfirmDialog(obj).then((item) => {
                if (item) {
                  vm.umidDetail.ScanLabel = null;
                  setFocus('ScanLabel');
                  vm.reScan();
                  BaseService.goToNonUMIDStockList(null, null, finalMfgPn); // Need to fix this CP
                }
              }, () => {
                vm.umidDetail.ScanLabel = null;
                setFocus('ScanLabel');
                vm.reScan();
              }).catch((error) => BaseService.getErrorLog(error));
            } else if (res.data.messageTypeCode === 'KIT_ALLOCATION_VALIDATION') {
              const data = {
                validationMsg: stringFormat(res.data.messageContent, vm.FullPoNumber),
                shortageQty: res.data.shortageQty,
                unit: vm.umidDetail.componentUnit,
                units: vm.umidDetail.pkgUnit,
                uom: vm.umidDetail.uomName,
                count: vm.umidDetail.pkgQty,
                uomClassID: vm.umidDetail.uomClassID,
                errorCode: res.data.errorCode,
                poNumber: vm.FullPoNumber
              };
              DialogFactory.dialogService(
                vm.TransactionData.FULL_KIT_ALLOCATION_POPUP_CONTROLLER,
                vm.TransactionData.FULL_KIT_ALLOCATION_POPUP_VIEW,
                event,
                data).then(() => { }, (kitAllocation) => {
                  if (kitAllocation) {
                    vm.withKitAllocation = kitAllocation.withKitAllocation;
                    vm.allocatedUnitValue = kitAllocation.allocatedUnitValue;
                    vm.checkValidation = kitAllocation.checkValidation;
                    vm.SaveDataElements();
                  }
                }, (err) => BaseService.getErrorLog(err));
            } else if (res.data.messageTypeCode === 5) { // Not getting this message code need to check once - CP
              const messageContent = angular.copy(res.data.messageContent);
              messageContent.message = stringFormat(messageContent.message, vm.umidDetail.uid);
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              return DialogFactory.messageAlertDialog(model).then((yes) => {
                if (yes) {
                  vm.umidDetail.uid = null;
                  setFocus('UID');
                }
              }, () => {
                vm.reScan();
              }).catch((error) => BaseService.getErrorLog(error));
            } else if (res.data.messageTypeCode === 'PS_POSTING_STATUS_NOT_ALLOW' || res.data.messageTypeCode === 'PS_RECEIVED_STATUS_NOT_ALLOW_UMID') {
              const messageContentData = angular.copy(res.data.messageContent);
              const model = {
                messageContent: messageContentData,
                multiple: true
              };
              return DialogFactory.messageAlertDialog(model).then((yes) => {
                if (yes) {
                  vm.umidDetail.fromBinName = null;
                  setFocus('fromBinName');
                }
              }, () => {

              }).catch((error) => BaseService.getErrorLog(error));
            } else {
              vm.rohsStatusDetail = {};
              vm.saveBtnDisableFlag = false;
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    // Bind UMID Details
    const bindComponentSidStockDetails = (isEdit, kitAllocation) => {
      const delimiterDetails = [];
      let elementObj = [];
      vm.componentSidStockDetails = {};

      if (objApproval) {
        approvalReasonList.push(objApproval);
      }
      if (objDaysApproval) {
        approvalReasonList.push(objDaysApproval);
      }

      // Logic added by CP as per new changes - 18-10-2021
      vm.umidDetail.receiveMaterialType = vm.umidDetail.customerConsign ? vm.pageName.CPNReceive.Code : vm.pageName.PartToStock.Code;
      vm.umidDetail.receiveMaterialTypeName = vm.umidDetail.customerConsign ? vm.pageName.CPNReceive.title : vm.pageName.PartToStock.title;

      if (isEdit) {
        if (vm.umidDetail.pkgQty !== vm.umidDetail.orgQty) {
          vm.umidDetail.isCountChange = true;
          vm.umidDetail.curQty = angular.copy(vm.umidDetail.orgQty);
          // Do not change below two line without confirmation of DP/DV. Based on this two fields we are calculating Non-UMID stock
          vm.umidDetail.orgQty = vm.umidDetail.orgQty;
          vm.umidDetail.orgPkgUnit = vm.umidDetail.orgPkgUnit;
        }

        // Do not change below two line without confirmation of DP/DV. Based on this two fields we are calculating Non-UMID stock
        if (vm.umidDetail.pkgQty === vm.umidDetail.orgQty) {
          vm.umidDetail.orgQty = vm.umidDetail.pkgQty;
          vm.umidDetail.orgPkgUnit = vm.umidDetail.pkgUnit;
        }
      } else {
        vm.umidDetail.orgQty = vm.umidDetail.pkgQty;
        vm.umidDetail.orgPkgUnit = vm.umidDetail.pkgUnit;
      }

      _.each(vm.sourceData, (item) => {
        if (item) {
          const dataElementInfo = {};
          elementObj = _.filter(vm.dataelementList, (data) => data.dataElementName === item.dataElementName);
          checkDataFields(item, elementObj);
          dataElementInfo.id = item.id;
          dataElementInfo.refsidid = vm.cstID;
          dataElementInfo.dataelementid = item.dataelementid;
          dataElementInfo.value = !item.value ? item.value = '' : item.value;
          dataElementInfo.entityid = item.entityid;
          delimiterDetails.push(dataElementInfo);
        }
      });

      if (!isEdit && vm.umidDetail.mfgAvailabel) {
        vm.umidDetail.refCPNMFGPNID = vm.autoCompleteCPNComponent && vm.autoCompleteCPNComponent.keyColumnId ? vm.autoCompleteCPNComponent.keyColumnId : null;
      } else {
        vm.umidDetail.refCPNMFGPNID = null;
      }

      vm.umidDetail.expiryDate = vm.umidDetail.MFGorExpiryDate === vm.DateTypeList[0].type ? null : (vm.umidDetail.expiryDate ? (BaseService.getAPIFormatedDate(vm.umidDetail.expiryDate)) : null);
      vm.umidDetail.mfgDate = vm.umidDetail.MFGorExpiryDate === vm.DateTypeList[0].type ? null : (vm.umidDetail.mfgDate ? (BaseService.getAPIFormatedDate(vm.umidDetail.mfgDate)) : null);
      vm.umidDetail.sealDate = vm.umidDetail.sealDate ? (BaseService.getAPIFormatedDate(vm.umidDetail.sealDate)) : null;;
      vm.umidDetail.scanlabel = vm.umidDetail.ScanLabel;
      vm.umidDetail.costCategoryID = vm.autoCompletePriceCategory ? vm.autoCompletePriceCategory.keyColumnId : null;
      vm.umidDetail.packaging = vm.autoPackaging ? vm.autoPackaging.keyColumnId : null;
      vm.umidDetail.assyID = vm.autoCompleteAssy ? vm.autoCompleteAssy.keyColumnId : null;
      vm.umidDetail.refcompid = vm.autoCompletecomponent.keyColumnId;
      vm.umidDetail.refSupplierPartId = vm.supplierPartId;
      vm.umidDetail.customerID = vm.autoCompleteCustomer ? vm.autoCompleteCustomer.keyColumnId : null;
      vm.umidDetail.rohsStatusID = vm.autoCompleteRohsStatus.keyColumnId ? vm.autoCompleteRohsStatus.keyColumnId : null;
      vm.umidDetail.isSplitUID = vm.umidDetail.stockInventoryType === vm.InventoryType[3].value ? true : false;
      vm.umidDetail.finalMfgPn = finalMfgPn;
      if (!isEdit) {
        const component = _.find(vm.ComponentList, (comp) => comp.id === vm.autoCompletecomponent.keyColumnId);
        if (vm.umidDetail.mfgCode && component) {
          vm.umidDetail.PIDCode = stringFormat('{0}+{1}', vm.umidDetail.mfgCode, component.mfgPN);
        }
      }

      if (selectedPO && vm.isAllocateToKit) {
        kitAllocation.refSalesOrderDetID = selectedPO['SalesOrderDetailId'];
        kitAllocation.parentAssyID = selectedPO['PartID'];
        kitAllocation.kitQty = selectedPO['kitQty'];
        kitAllocation.assyID = vm.autoCompleteSubAssebmly && vm.autoCompleteSubAssebmly.keyColumnId ? vm.autoCompleteSubAssebmly.keyColumnId : selectedPO['PartID'];
        kitAllocation.refBOMLineID = rfqLineItemsID;
        kitAllocation.allocatedQty = vm.umidDetail.pkgQty;
        kitAllocation.status = CORE.KitAllocationType.Allocated;
        kitAllocation.refUIDId = vm.umidDetail.id;
        kitAllocation.partId = vm.umidDetail.refcompid;
        kitAllocation.allocatedUnit = vm.umidDetail.pkgUnit;
        kitAllocation.allocatedUnitValue = vm.allocatedUnitValue && vm.checkValidation ? vm.allocatedUnitValue : vm.umidDetail.pkgUnit; //Need to check this
        kitAllocation.allocatedUOM = vm.umidDetail.uom;
        if (vm.isScanLabel && vm.isEdit) {
          kitAllocation.uid = vm.umidDetail.uid;
          kitAllocation.checkValidation = false;
        } else if (vm.withKitAllocation) {
          kitAllocation.checkValidation = vm.checkValidation;
        }
      } else if (vm.isScanLabel && vm.isEdit) {
        kitAllocation.allocatedQty = vm.umidDetail.pkgQty;
        kitAllocation.allocatedUnit = vm.umidDetail.pkgUnit;
        kitAllocation.allocatedUOM = vm.umidDetail.uom;
        kitAllocation.checkValidation = false;
      }
      if (isEdit) {
        vm.componentSidStockDetails.componentSidStock = vm.umidDetail;
      } else {
        vm.componentSidStockDetails = vm.umidDetail;
      }
      vm.componentSidStockDetails.delimiterDetails = delimiterDetails;
      vm.componentSidStockDetails.kitAllocation = kitAllocation;
      vm.componentSidStockDetails.approvalReasonList = approvalReasonList;
      manageSaveDataElements(vm.componentSidStockDetails);
    };

    /*
     scan barcode string and save delimiters values
    */
    vm.scanLabelDet = (e) => {
      $timeout(() => {
        scanlabel(e);
      }, true);
      /** Prevent enter key submit event */
      preventInputEnterKeyEvent(e);
    };

    // call for string
    function scanlabel(e) {
      if ((e.keyCode === 13)) {
        if (!vm.umidDetail.ScanLabel) {
          return;
        }

        if (!vm.umidDetail.prefix) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.REQUIRE_PREFIX);
          const returnVal = checkScanValidation(messageContent, 'PrefixRequire');
          if (!returnVal) {
            return;
          }
        }

        if (vm.umidDetail.isReservedStock) {
          const returnVal = matchAllocatToKit();
          if (!returnVal) {
            return;
          }
        }

        IdOfSelectMultipleBarcode = null;
        objApproval = null;
        const scanlabelObj = {
          regxpString: vm.umidDetail.ScanLabel,
          receiveMaterialType: null,
          nickName: vm.umidDetail.nickName ? vm.umidDetail.nickName : null,
          preFix: vm.umidDetail.prefix ? vm.umidDetail.prefix : null,
          binID: vm.umidDetail.fromBin ? vm.umidDetail.fromBin : null,
          mfgId: 0,
          customerID: vm.autoCompleteCustomer ? vm.autoCompleteCustomer.keyColumnId : null,
          cpn: vm.umidDetail.cpn,
          mfgAvailabel: vm.umidDetail.cpn ? vm.umidDetail.cpn : false,
          refCpnMfgID: vm.autoCompleteCPNComponent ? vm.autoCompleteCPNComponent.keyColumnId ? vm.autoCompleteCPNComponent.keyColumnId : null : null,
          assyId: vm.autoCompleteAssy ? vm.autoCompleteAssy.keyColumnId ? vm.autoCompleteAssy.keyColumnId : null : null,
          salesOrderDetailId: selectedPO && selectedPO['SalesOrderDetailId'] ? selectedPO['SalesOrderDetailId'] : null,
          kitAssemblyID: vm.autoCompleteSubAssebmly && vm.autoCompleteSubAssebmly.keyColumnId ? vm.autoCompleteSubAssebmly.keyColumnId : selectedPO && selectedPO['PartID'] ? selectedPO['PartID'] : null,
          barcodeId: null,
          bOMLineID: null,
          InventoryType: vm.umidDetail.stockInventoryType ? vm.umidDetail.stockInventoryType : null
        };

        vm.cgBusyLoading = ReceivingMaterialFactory.saveScanLabel().save(scanlabelObj).$promise.then((res) => {
          if (res.data && res.data.Component_Sid_Stock) {
            vm.isScanLabel = true;
            $scope.$parent.vm.checkScanLabel = vm.isScanLabel;
            vm.initialLoad = true;
            vm.umidDetail.formatType = vm.Transaction.FIRSTMFG;
            cpnPartList = res.data.CPNPart;

            let messageContent = null;
            if (res.data.Component && res.data.Component.restrictUSEwithpermission && (res.data.BOMLineDetail && res.data.BOMLineDetail.customerApproval !== CORE.CustomerApprovalStatus.Approve)) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PERMISSION_PART_NOT_CUSTOMER_APPROVE);
              messageContent.message = stringFormat(messageContent.message, res.data.Component.PIDCode, CORE.RestrictWithPermissionLabel.RestrictUSEWithPermission);
            } else if (res.data.Component && res.data.Component.restrictPackagingUseWithpermission && (res.data.BOMLineDetail && !res.data.Component.isCPN && res.data.BOMLineDetail.customerApproval !== CORE.CustomerApprovalStatus.Approve)) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PERMISSION_PART_NOT_CUSTOMER_APPROVE);
              messageContent.message = stringFormat(messageContent.message, res.data.Component.PIDCode, CORE.RestrictWithPermissionLabel.RestrictPackagingUSEWithPermission);
            } else if (res.data.Component && res.data.Component.restrictPackagingUseWithpermission && (res.data.BOMLineDetail && res.data.Component.isCPN && res.data.BOMLineDetail.customerApprovalCPN !== CORE.CustomerApprovalStatus.Approve)) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.CPN_PERMISSION_PART_NOT_CUSTOMER_APPROVE);
              messageContent.message = stringFormat(messageContent.message, res.data.Component.PIDCode, CORE.RestrictWithPermissionLabel.RestrictPackagingUSEWithPermission);
            }

            if (messageContent) {
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              return DialogFactory.messageAlertDialog(model).then((yes) => {
                if (yes) {
                  vm.resetKitAllocation();
                }
              }, () => {
                vm.resetKitAllocation();
              }).catch((error) => BaseService.getErrorLog(error));
            }

            let validationMsg = null;
            if (res.data.Component && res.data.Component.restrictUSEwithpermission && (!res.data.BOMLineDetail || (res.data.BOMLineDetail && res.data.BOMLineDetail.customerApproval !== CORE.CustomerApprovalStatus.Approve))) {
              const validationMsgObj = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PID_RECTRICTED_WITH_PERMISION);
              validationMsgObj.message = stringFormat(validationMsgObj.message, res.data.Component.PIDCode, CORE.RestrictWithPermissionLabel.RestrictUSEWithPermission);
              const validationMsgObjFill = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.FILL_DETAIL_FOR_UMID);
              validationMsg = stringFormat('{0} {1}', validationMsgObj.message, validationMsgObjFill.message);
            } else if (res.data.Component && res.data.Component.restrictPackagingUseWithpermission && !res.data.Component.isCPN && (!res.data.BOMLineDetail || (res.data.BOMLineDetail && res.data.BOMLineDetail.customerApproval !== CORE.CustomerApprovalStatus.Approve))) {
              const validationMsgObj = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PID_RECTRICTED_PACKAGING_WITH_PERMISION);
              validationMsgObj.message = stringFormat(validationMsgObj.message, res.data.Component.PIDCode, CORE.RestrictWithPermissionLabel.RestrictPackagingUSEWithPermission);
              const validationMsgObjFill = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.FILL_DETAIL_FOR_UMID);
              validationMsg = stringFormat('{0} {1}', validationMsgObj.message, validationMsgObjFill.message);
            } else if (res.data.Component && res.data.Component.restrictPackagingUseWithpermission && res.data.Component.isCPN && (!res.data.BOMLineDetail || (res.data.BOMLineDetail && res.data.BOMLineDetail.customerApproval !== CORE.CustomerApprovalStatus.Approve))) {
              const validationMsgObj = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.CPN_RECTRICTED_PACKAGING_WITH_PERMISION);
              validationMsgObj.message = stringFormat(validationMsgObj.message, res.data.Component.PIDCode, CORE.RestrictWithPermissionLabel.RestrictPackagingUSEWithPermission);
              const validationMsgObjFill = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.FILL_DETAIL_FOR_UMID);
              validationMsg = stringFormat('{0} {1}', validationMsgObj.message, validationMsgObjFill.message);
            } else if (res.data.BOMLineDetail && res.data.BOMLineDetail.restrictUseInBOMWithPermissionStep) {
              const validationMsgObj = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PART_RESTRICT_WITH_PERMISSION_IN_BOM);
              validationMsgObj.message = stringFormat(validationMsgObj.message, res.data.Component.PIDCode);
              const validationMsgObjFill = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.FILL_DETAIL_FOR_KIT_ALLOCATION);
              validationMsg = stringFormat('{0} {1}', validationMsgObj.message, validationMsgObjFill.message);
            } else if (res.data.BOMLineDetail && res.data.BOMLineDetail.restrictUseInBOMExcludingAliasWithPermissionStep) {
              const validationMsgObj = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PART_RESTRICT_PACKAGING_IN_BOM_PERMISSION);
              validationMsgObj.message = stringFormat(validationMsgObj.message, res.data.Component.PIDCode);
              const validationMsgObjFill = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.FILL_DETAIL_FOR_KIT_ALLOCATION);
              validationMsg = stringFormat('{0} {1}', validationMsgObj.message, validationMsgObjFill.message);
            }

            if (validationMsg) {
              const objDetail = {
                event: null,
                componentObj: res.data.Component,
                bomLineDetail: res.data.BOMLineDetail,
                umidDetail: res.data.Component_Sid_Stock,
                dataElementDetail: res.data.Dataelement,
                informationMsg: validationMsg
              };
              getAuthenticationOfApprovalPart(objDetail);
            } else {
              if (vm.isAllocateToKit && res.data.ValidationMessage && res.data.ValidationMessage && res.data.ValidationMessage.MFGPart) {
                const slitMFGPart = res.data.ValidationMessage.MFGPart.split('###');
                const getSubAssyId = slitMFGPart ? parseInt(slitMFGPart[1]) : 0;
                if (getSubAssyId !== vm.autoCompleteSubAssebmly.keyColumnId) {
                  vm.autoCompleteSubAssebmly.keyColumnId = getSubAssyId;
                  vm.isSubAssyHighlight = true;
                } else {
                  vm.isSubAssyHighlight = false;
                }
              }
              getReceivingDataAfterScan(res.data.Component_Sid_Stock, res.data.Component);
              $timeout(() => {
                const dataElement = [];
                _.each(res.data.Dataelement, (data) => {
                  dataElement.push(data);
                });
                getDataElement(dataElement);
                if (!vm.umidDetail.mfgAvailabel) {
                  setFocus('custConsign');
                }
              }, true);
            }
          } else {
            if (res.data) {
              vm.autoCompleteRohsStatus.keyColumnId = null;
              const messagecode = res.data.messagecode;
              if (messagecode === '0' || messagecode === '4') {
                const obj = {
                  title: USER.USER_INFORMATION_LABEL,
                  textContent: res.data.Datamessage,
                  btnText: CORE.MESSAGE_CONSTANT.BUTTON_ADDRECORD_TEXT,
                  canbtnText: ''
                };
                if (messagecode && messagecode === '0') {
                  obj.canbtnText = CORE.MESSAGE_CONSTANT.BUTTON_SKIP_TEXT;
                } else {
                  obj.canbtnText = CORE.MESSAGE_CONSTANT.BUTTON_SKIP_PART_TEXT;
                }
                DialogFactory.confirmDiolog(obj).then((item) => {
                  if (item) {
                    if (res.data && messagecode === '0') {
                      BaseService.openInNew(USER.ADMIN_MANAGE_BARCODE_LABEL_TEMPLATE_STATE);
                    } else {
                      addNewComponent(res.data.MFGPart);
                    }
                  }
                }, () => {
                  vm.umidDetail.ScanLabel = null;
                  setFocus('ScanLabel');
                }).catch((error) => BaseService.getErrorLog(error));
              } else if (messagecode === '5') {
                selectPartPopup(res.data.MFGPart);
              } else if (['6', '8', '10', '11', '12', '13', '14', '15', '16', '18', '19'].indexOf(messagecode) !== -1) {
                vm.cgBusyLoading = false;
                const model = {
                  title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
                  textContent: messagecode === '11' ? stringFormat(res.data.Datamessage, 'create UMID for') : res.data.Datamessage,
                  multiple: true
                };
                return DialogFactory.alertDialog(model).then((yes) => {
                  if (yes && messagecode === 8) {
                    BaseService.openInNew(USER.ADMIN_MANAGE_BARCODE_LABEL_TEMPLATE_STATE, {
                      id: res.data.MFGPart
                    });
                  } else {
                    vm.umidDetail.ScanLabel = null;
                    setFocus('ScanLabel');
                  }
                }, () => {

                }).catch((error) => BaseService.getErrorLog(error));
              } else if (messagecode === '7') {
                notificationOfMismatchBOM(true);
              } else if (messagecode === '9') {
                selectBarcodePopup(res.data.MFGPart);
              } else if (messagecode === '17') {
                selectLineItemPopup(res.data.MFGPart, 'Scan', null);
              } else if (messagecode === '22' || messagecode === '23' || messagecode === '25' || messagecode === '26') {
                const model = {
                  title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
                  textContent: res.data.Datamessage,
                  multiple: true
                };
                return DialogFactory.alertDialog(model).then(() => {
                  vm.umidDetail.ScanLabel = null;
                  setFocus('ScanLabel');
                }, () => {
                }).catch((error) => BaseService.getErrorLog(error));
              } else if (messagecode === '24') {
                const obj = {
                  title: USER.USER_INFORMATION_LABEL,
                  textContent: res.data.Datamessage,
                  btnText: CORE.MESSAGE_CONSTANT.GO_TO_PENDING_STOCK,
                  canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_FOR_CANCEL
                };
                DialogFactory.confirmDiolog(obj).then((item) => {
                  if (item) {
                    vm.umidDetail.ScanLabel = null;
                    setFocus('ScanLabel');
                    BaseService.goToNonUMIDStockList(null, null, res.data.MFGPart);
                  }
                }, () => {
                  vm.umidDetail.ScanLabel = null;
                  setFocus('ScanLabel');
                }).catch((error) => BaseService.getErrorLog(error));
              }
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    }

    // open add new component popup from recieving material
    const addNewComponent = (MFGPart) => {
      const event = angular.element.Event('click');
      angular.element('body').trigger(event);
      const data = {
        Name: MFGPart,
        mfgType: CORE.MFG_TYPE.MFG,
        category: CORE.PartCategory.Component,
        isCPNPartEntry: vm.umidDetail.cpn ? true : null
      };
      const popUpData = {
        popupAccessRoutingState: [USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE],
        pageNameAccessLabel: vm.LabelConstant.PART_MASTER.PageName
      };
      const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
      if (isAccessPopUp) {
        DialogFactory.dialogService(
          CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
          CORE.MANAGE_COMPONENT_MODAL_VIEW,
          event,
          data).then(() => {

          }, (insertedData) => {
            if (!insertedData) {
              vm.umidDetail.ScanLabel = null;
            }
            setFocus('ScanLabel');
          }, (error) => BaseService.getErrorLog(error));
      }
    };

    vm.savePartToStock = () => {
      vm.saveBtnDisableFlag = true;
      if (BaseService.focusRequiredField(vm.formReceivingMaterial) || vm.isExpire) {
        vm.saveBtnDisableFlag = false;
        return;
      }
      if (!vm.isChanged) {
        vm.isChanged = BaseService.checkFormDirty(vm.formReceivingMaterial, vm.checkDirtyObject);
      }
      vm.saveReceivingMaterial(vm.isChanged, false);
    };

    vm.checkFormDirty = (form, columnName) => {
      vm.checkDirty = BaseService.checkFormDirty(form, columnName);
      if (vm.isChanged || vm.checkDirty) {
        vm.checkDirty = true;
      }
      return vm.checkDirty;
    };

    vm.saveReceivingMaterial = (isChanged, isNickName) => {
      if (isChanged) {
        vm.SaveDataElements(isNickName);
        vm.isChanged = false;
      } else if (!isChanged) {
        vm.saveBtnDisableFlag = false;
        return;
      } else {
        if (isChanged) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
            canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              ReceivingMaterialDetails(vm.cstID);
            }
          }, () => { }).catch((error) => {
            vm.saveBtnDisableFlag = false;
            return BaseService.getErrorLog(error);
          });
        }
      }
    };

    /*
     * Author : Rumit
     * Purpose :Show save alert popup on go back
     */
    function showWithoutSavingAlertforGoback() {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          $state.go(vm.TransactionData.TRANSACTION_RECEIVINGMATERIAL_LIST_STATE);
        }
      }, () => { }).catch((error) => BaseService.getErrorLog(error));
    }

    // ask popup for print and allow number of print
    vm.printMultipleBarcodeLabel = (event) => {
      var data = vm.umidDetail;
      data.pageName = vm.TransactionData.TRANSACTION_RECEIVINGMATERIAL_LABEL;
      DialogFactory.dialogService(
        CORE.PRINT_BARCODE_LABEL_MODAL_CONTROLLER,
        CORE.PRINT_BARCODE_LABEL_MODAL_VIEW,
        event,
        data).then(() => { }, (printerDetailList) => {
          if (printerDetailList) {
            const printList = _.map(printerDetailList, (data) => ({
              'uid': data.UID,
              'id': data.id,
              'numberOfPrint': data.noPrint,
              'reqName': 'Print',
              'PrinterName': data.PrinterName,
              'ServiceName': data.ServiceName,
              'printType': data.printType,
              'pageName': vm.TransactionData.TRANSACTION_RECEIVINGMATERIAL_LABEL
            }));
            printLabel(printList);
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.printBarcodeLabel = () => {
      const printerObj = getLocalStorageValue('Printer');
      const printTemplate = getLocalStorageValue('PrintFormateOfUMID');
      if (printerObj && printerObj.Printer && printTemplate && printTemplate.PrintFormate) {
        const printList = [{
          'uid': vm.umidDetail.uid,
          'id': vm.umidDetail.id,
          'numberOfPrint': noprint,
          'reqName': 'Print',
          'PrinterName': printerObj && printerObj.Printer ? printerObj.Printer.gencCategoryName : null,
          'ServiceName': printTemplate && printTemplate.PrintFormate.Name ? printTemplate.PrintFormate.Name : null,
          'printType': 'Print',
          'pageName': vm.TransactionData.TRANSACTION_RECEIVINGMATERIAL_LABEL
        }];
        printLabel(printList);
      } else {
        vm.printMultipleBarcodeLabel();
      }
    };

    const printLabel = (printList) => {
      if (printList && printList.length > 0) {
        vm.cgBusyLoading = ReceivingMaterialFactory.getDataForPrintLabelTemplate().query({
          printList: printList
        }).$promise.then(() => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    // verify uid and scan label
    vm.verifyBarcodeLabel = (event, data) => {
      if (data) {
        data.ID = $stateParams.id;
      }
      DialogFactory.dialogService(
        CORE.CAMERA_ZOOM_INOUT_MODAL_CONTROLLER,
        CORE.CAMERA_ZOOM_INOUT_MODAL_VIEW,
        event,
        data).then(() => { }, () => {
          vm.getUmidTabCount();
          setFocus('btnFooterAddUMID');
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.getUmidTabCount = () => {
      ReceivingMaterialFactory.getUmidTabCount().query({
        id: $stateParams.id || 0
      }).$promise.then((response) => {
        $scope.$parent.vm.documentCount = response.data.documentCount || 0;
        $scope.$parent.vm.documentCofCCount = response.data.documentCofCCount || 0;
        $scope.$parent.vm.parentDocumentCount = response.data.parentDocumentCount || 0;
        $scope.$parent.vm.splitUIDCount = response.data.splitUIDCount || 0;
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //add new option receive material option
    vm.addNewReceiveMaterial = () => {
      $state.go($state.$current, { id: null }, { reload: true });
    };

    vm.checkPartBarcode = (type) => {
      vm.selectPartBarcode = (type === 'true');
      if (vm.selectPartBarcode) {
        vm.umidDetail.formatType = vm.Transaction.FIRSTSCANLBL;
      } else {
        vm.umidDetail.formatType = vm.Transaction.FIRSTMFG;
      }
      vm.umidDetail.ScanLabel = null;
      vm.selectPartBarcode = vm.selectPartBarcode.toString();
    };

    vm.openPickerExpire = (type, ev) => {
      if (ev.keyCode === 40) {
        vm.IsPickerOpen[type] = true;
      }
    };

    const partShelfLifeValidation = (details) => {
      if (!details.isAllow && !vm.partExpiryPopupOpen) {
        vm.isExpire = true;
        vm.partExpiryPopupOpen = true;
        $scope.$parent.vm.isExpire = vm.isExpire;
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PART_EXPIRE);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model).then(() => {
          vm.partExpiryPopupOpen = false;
          if (details.isFromMfgDate) {
            vm.expiryInDays = null;
            vm.umidDetail.mfgDate = '';
            setFocus('mfgDate');
          } else {
            vm.expiryInDays = null;
            vm.umidDetail.expiryDate = '';
            setFocus('expiryDate');
          }
        }, () => {
          vm.partExpiryPopupOpen = false;
        }).catch((error) => {
          vm.partExpiryPopupOpen = false;
          return BaseService.getErrorLog(error);
        });
        return;
      } else if (!vm.partExpiryPopupOpen) {
        const objDetail = {
          event: null,
          componentObj: null,
          bomLineDetail: null,
          umidDetail: null,
          dataElementDetail: null,
          informationMsg: stringFormat(CORE.MESSAGE_CONSTANT.UMID_VALIDATION_FOR_SHELF_LIFE_DAYS, details.isMaxShelfDays ? 'Reject if expires in (Days)' : 'Accept with permission if expires in (Days)')
        };
        getAuthenticationOfApprovalPart(objDetail, vm.umidApprovalType.selfLifeDays);
      }
      vm.isExpire = false;
      $scope.$parent.vm.isExpire = vm.isExpire;
    };

    const setValidationForExpiryDate = (objDetails) => {
      if (vm.expiryInDays <= 1) {
        partShelfLifeValidation(objDetails);
      } else {
        if (vm.umidDetail.maxShelfLifeAcceptanceDays !== 0) {
          if (vm.expiryInDays > vm.umidDetail.maxShelfLifeAcceptanceDays && vm.expiryInDays <= vm.umidDetail.shelfLifeAcceptanceDays) {
            // Allow to create UMID with supervisor permission
            objDetails.isMaxShelfDays = objDetails.isAllow = true;
            partShelfLifeValidation(objDetails);
          } else if (vm.expiryInDays <= vm.umidDetail.maxShelfLifeAcceptanceDays) {
            // Not allow to create UMID
            partShelfLifeValidation(objDetails);
          }
        }
        else if (vm.umidDetail.shelfLifeAcceptanceDays !== 0) {
          if (vm.expiryInDays > 1 && vm.expiryInDays <= vm.umidDetail.shelfLifeAcceptanceDays) {
            // Allow to create UMID with supervisor permission
            objDetails.isAllow = true;
            partShelfLifeValidation(objDetails);
          }
        }
        else if (vm.umidDetail.selfLifeDays !== 0) {
          if (vm.expiryInDays > vm.umidDetail.selfLifeDays) {
            // Allow to create UMID with supervisor permission
            objDetails.isAllow = true;
            partShelfLifeValidation(objDetails);
          }
        }
      }
    };

    const getComponentShelfLifeDetailsById = (partId) => {
      if (partId) {
        vm.cgBusyLoading = ReceivingMaterialFactory.getComponentShelfLifeDetailsById().query({ partId: partId }).$promise.then((response) => {
          if (response && response.data) {
            vm.umidDetail.selfLifeDays = response.data.selfLifeDays || 0;
            vm.umidDetail.shelfLifeAcceptanceDays = response.data.shelfLifeAcceptanceDays || 0;
            vm.umidDetail.maxShelfLifeAcceptanceDays = response.data.maxShelfLifeAcceptanceDays || 0;
            if (vm.umidDetail.selfLifeDays === 0) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SHELF_LIFE_DAYS_FOR_MOUNTING_GROUP_CHEMICAL_VALIDATION);
              const model = {
                messageContent: messageContent,
                btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_FOR_CANCEL
              };
              DialogFactory.messageConfirmDialog(model).then(() => {
                vm.goToComponentDetail(CORE.MFG_TYPE.MFG, partId);
                vm.umidDetail.MFGorExpiryDate = vm.DateTypeList[0].type;
                setFocus('dateType');
              }, () => {
                vm.umidDetail.MFGorExpiryDate = vm.DateTypeList[0].type;
                setFocus('dateType');
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    const checkShelfLifeDateTypeForHasShelfLife = () => {
      if (vm.hasLimitedShelfLife && (vm.umidDetail.MFGorExpiryDate === vm.DateTypeList[0].type)) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SHELF_LIFE_DATE_TYPE_FOR_LIMITED_SHELF_LIFE);
        messageContent.message = stringFormat(messageContent.message, vm.umidDetail.PIDCode);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model).then(() => {
          vm.DateTypeList[0].IsDisable = true;
          setFocus('dateType');
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    const setShelfLifeDateType = (shelfLifeDateType) => {
      if ((vm.umidDetail.selfLifeDays && vm.umidDetail.selfLifeDays !== 0) || vm.hasLimitedShelfLife) {
        vm.umidDetail.MFGorExpiryDate = shelfLifeDateType ? shelfLifeDateType : vm.DateTypeList[1].type;
        vm.DateTypeList[0].IsDisable = vm.DateTypeList[0].type ? false : true;
      }
    };

    // Calculate Expiry in days
    const calCulateExpiryInDays = () => {
      if (vm.umidDetail.expiryDate) {
        const currentDate = new Date(vm.currentDate.setHours(0, 0, 0, 0));
        const expiryDate = new Date(new Date(vm.umidDetail.expiryDate).setHours(0, 0, 0, 0));
        vm.expiryInDays = Math.floor((Date.UTC(expiryDate.getFullYear(), expiryDate.getMonth(), expiryDate.getDate()) - Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())) / (1000 * 60 * 60 * 24));
      } else {
        vm.expiryInDays = 0;
      }
    };

    vm.setFocusForDate = (event) => {
      if (!event.shiftKey && event.keyCode === 9) {
        if (vm.hasLimitedShelfLife && (vm.umidDetail.MFGorExpiryDate === vm.DateTypeList[0].type)) {
          checkShelfLifeDateTypeForHasShelfLife();
        } else {
          setFocus(vm.umidDetail.MFGorExpiryDate === vm.DateTypeList[1].type ? 'mfgDate' : vm.umidDetail.MFGorExpiryDate === vm.DateTypeList[2].type ? 'expiryDate' : 'btnSaveUMID');
        }
      }
    };

    vm.changeDateType = () => {
      vm.isExpire = false;
      $scope.$parent.vm.isExpire = vm.isExpire;
      if (vm.umidDetail.mfgDate && vm.umidDetail.expiryDate) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.CHANGE_DATE_TYPE_FOR_UMID);
        const model = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(model).then((yes) => {
          if (yes) {
            vm.umidDetail.expiryDate = '';
            vm.umidDetail.mfgDate = '';
            setFocus('dateType');
          }
        }, () => {
          setFocus('dateType');
        }).catch((error) => BaseService.getErrorLog(error));
      }
      getComponentShelfLifeDetailsById(vm.umidDetail.refcompid);
    };

    vm.changeExpiryDate = () => {
      if (!vm.isExpiryDatePopupOpen) {
        vm.isExpiryDatePopupOpen = true;
        const objDetails = {
          isAllow: false,
          isMaxShelfDays: false,
          isFromMfgDate: false
        };
        if (vm.umidDetail.expiryDate) {
          const expiryDate = new Date(vm.umidDetail.expiryDate.setHours(0, 0, 0, 0));
          const currentDate = new Date(vm.currentDate.setHours(0, 0, 0, 0));
          if (!vm.isEdit && expiryDate <= currentDate) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.COMPONENT_EXPIRE);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                vm.umidDetail.expiryDate = '';
                setFocus('expiryDate');
                vm.isExpiryDatePopupOpen = false;
              }
            }, () => {
            }).catch((error) => BaseService.getErrorLog(error));
            vm.isInvalid = false;
          }
          else {
            vm.isInvalid = false;
            if (vm.umidDetail.MFGorExpiryDate !== vm.DateTypeList[1].type) {
              vm.umidDetail.mfgDate = new Date(expiryDate.getFullYear(), expiryDate.getMonth(), expiryDate.getDate() - vm.umidDetail.selfLifeDays);
            }
            if (vm.umidDetail.mfgDate > currentDate) {
              vm.isInvalid = true;
              vm.isExpiryDatePopupOpen = false;
              $scope.$applyAsync(() => {
                vm.formReceivingMaterial.mfgDate.$setValidity('valid', false);
              });
            } else {
              vm.formReceivingMaterial.mfgDate.$setValidity('valid', true);
              calCulateExpiryInDays();
              setValidationForExpiryDate(objDetails);
              vm.isInvalid = false;
              vm.isExpiryDatePopupOpen = false;
            }
          }
        } else {
          vm.isInvalid = false;
          vm.expiryInDays = 0;
          vm.isExpiryDatePopupOpen = false;
        }
      }
    };

    vm.changeMFGDate = () => {
      if (!vm.isMfgDatePopupOpen) {
        vm.isMfgDatePopupOpen = true;
        const objDetails = {
          isAllow: false,
          isMaxShelfDays: false,
          isFromMfgDate: true
        };
        if (vm.umidDetail.mfgDate) {
          const currentDate = new Date(vm.currentDate.setHours(0, 0, 0, 0));
          const mfgDate = new Date(new Date(vm.umidDetail.mfgDate).setHours(0, 0, 0, 0));
          if (mfgDate > currentDate) {
            vm.isInvalid = true;
            vm.isMfgDatePopupOpen = false;
            $scope.$applyAsync(() => {
              vm.formReceivingMaterial.mfgDate.$setValidity('valid', false);
            });
          } else {
            vm.formReceivingMaterial.mfgDate.$setValidity('valid', true);
            vm.isInvalid = false;
            if (vm.umidDetail.MFGorExpiryDate !== vm.DateTypeList[2].type) {
              vm.umidDetail.expiryDate = new Date(mfgDate.getFullYear(), mfgDate.getMonth(), mfgDate.getDate() + vm.umidDetail.selfLifeDays);
            }
            calCulateExpiryInDays();
            setValidationForExpiryDate(objDetails);
            vm.isMfgDatePopupOpen = false;
          }
        } else {
          vm.isInvalid = false;
          vm.expiryInDays = 0;
          vm.isMfgDatePopupOpen = false;
        }
      }
    };

    vm.openPickerMFG = (type, ev) => {
      if (ev.keyCode === 40) {
        vm.IsPickerOpenMFG[type] = true;
      }
    };

    // Function call when select one part in get multiple part after scan label
    const selectPartPopup = (mfgPart) => {
      const obj = {
        mfgPart: mfgPart,
        supplierName: null
      };
      DialogFactory.dialogService(
        vm.TransactionData.SELECT_PART_MODAL_CONTROLLER,
        vm.TransactionData.SELECT_PART_MODAL_VIEW,
        event,
        obj).then(() => { }, (selectItem) => {
          if (selectItem) {
            popUpForMultipleListed(selectItem, 'MultiplePart');
            if (!vm.umidDetail.mfgAvailabel) {
              setFocus('custConsign');
            }
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    const selectBarcodePopup = (mfgPart) => {
      const data = mfgPart;
      DialogFactory.dialogService(
        vm.TransactionData.SELECT_BARCODE_MODAL_CONTROLLER,
        vm.TransactionData.SELECT_BARCODE_MODAL_VIEW,
        event,
        data).then(() => { }, (selectItem) => {
          if (selectItem) {
            IdOfSelectMultipleBarcode = selectItem.id;
            popUpForMultipleListed(selectItem, 'MultipleBarcode');
            setFocus('txtqty');
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    const selectLineItemPopup = (mfgPart, fromCall, partList) => {
      const data = {
        assyId: vm.autoCompleteSubAssebmly && vm.autoCompleteSubAssebmly.keyColumnId ? vm.autoCompleteSubAssebmly && vm.autoCompleteSubAssebmly.keyColumnId : null,
        mfgPart: mfgPart,
        salesOrderDetailId: selectedPO['SalesOrderDetailId'] ? selectedPO['SalesOrderDetailId'] : 0,
        fromCall: fromCall
      };

      DialogFactory.dialogService(
        vm.TransactionData.SELECT_BOM_LINEITEM_POPUP_CONTROLLER,
        vm.TransactionData.SELECT_BOM_LINEITEM_POPUP_VIEW,
        event,
        data).then(() => { }, (selectItem) => {
          if (selectItem) {
            if (fromCall === 'Scan') {
              rfqLineItemsID = selectItem.id;
              rfqAlternateID = selectItem.lineAlternateId;
              popUpForMultipleListed(selectItem, null);
              setFocus('txtqty');
            } else {
              const findPart = _.find(partList, (item) => item.rfqLineItemsID === selectItem.id && item.lineitemAlternatePartId === selectItem.lineAlternateId);
              check_RFQ_BOMPart_Validation(findPart);
            }
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    const popUpForMultipleListed = (selectItem, selectType) => {
      if (selectItem) {
        objApproval = null;
        const scanlabelObj = {
          regxpString: vm.umidDetail.ScanLabel,
          receiveMaterialType: null,
          nickName: vm.umidDetail.nickName ? vm.umidDetail.nickName : null,
          preFix: vm.umidDetail.prefix ? vm.umidDetail.prefix : null,
          binID: vm.umidDetail.fromBin ? vm.umidDetail.fromBin : null,
          mfgId: selectType === 'MultiplePart' && selectItem ? selectItem.id : 0,
          customerID: vm.autoCompleteCustomer ? vm.autoCompleteCustomer.keyColumnId : null,
          cpn: vm.umidDetail.cpn,
          mfgAvailabel: vm.umidDetail.cpn ? vm.umidDetail.cpn : false,
          refCpnMfgID: vm.autoCompleteCPNComponent ? vm.autoCompleteCPNComponent.keyColumnId ? vm.autoCompleteCPNComponent.keyColumnId : null : null,
          assyId: vm.autoCompleteAssy ? vm.autoCompleteAssy.keyColumnId ? vm.autoCompleteAssy.keyColumnId : null : null,
          salesOrderDetailId: selectedPO && selectedPO['SalesOrderDetailId'] ? selectedPO['SalesOrderDetailId'] : null,
          kitAssemblyID: vm.autoCompleteSubAssebmly && vm.autoCompleteSubAssebmly.keyColumnId ? vm.autoCompleteSubAssebmly.keyColumnId : selectedPO && selectedPO['PartID'] ? selectedPO['PartID'] : null,
          barcodeId: selectType === 'MultipleBarcode' && selectItem ? selectItem.id : IdOfSelectMultipleBarcode ? IdOfSelectMultipleBarcode : null,
          bOMLineID: selectItem ? selectItem.lineAlternateId : null,
          InventoryType: vm.umidDetail.stockInventoryType ? vm.umidDetail.stockInventoryType : null
        };

        vm.cgBusyLoading = ReceivingMaterialFactory.saveScanLabel().save(scanlabelObj).$promise.then((res) => {
          if (res.data && res.data.Component_Sid_Stock) {
            vm.isScanLabel = true;
            $scope.$parent.vm.checkScanLabel = vm.isScanLabel;
            vm.initialLoad = true;
            vm.umidDetail.formatType = vm.Transaction.FIRSTMFG;
            cpnPartList = res.data.CPNPart;

            // let validationMsgForPermissionPart = null;
            let messageContent = null;
            if (res.data.Component && res.data.Component.restrictUSEwithpermission && (res.data.BOMLineDetail && res.data.BOMLineDetail.customerApproval !== CORE.CustomerApprovalStatus.Approve)) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PERMISSION_PART_NOT_CUSTOMER_APPROVE);
              messageContent.message = stringFormat(messageContent.message, res.data.Component.PIDCode, CORE.RestrictWithPermissionLabel.RestrictUSEWithPermission);
            } else if (res.data.Component && res.data.Component.restrictPackagingUseWithpermission && (res.data.BOMLineDetail && !res.data.Component.isCPN && res.data.BOMLineDetail.customerApproval !== CORE.CustomerApprovalStatus.Approve)) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PERMISSION_PART_NOT_CUSTOMER_APPROVE);
              messageContent.message = stringFormat(messageContent.message, res.data.Component.PIDCode, CORE.RestrictWithPermissionLabel.RestrictPackagingUSEWithPermission);
            } else if (res.data.Component && res.data.Component.restrictPackagingUseWithpermission && (res.data.BOMLineDetail && res.data.Component.isCPN && res.data.BOMLineDetail.customerApprovalCPN !== CORE.CustomerApprovalStatus.Approve)) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.CPN_PERMISSION_PART_NOT_CUSTOMER_APPROVE);
              messageContent.message = stringFormat(messageContent.message, res.data.Component.PIDCode, CORE.RestrictWithPermissionLabel.RestrictPackagingUSEWithPermission);
            }

            if (messageContent) {
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              return DialogFactory.messageAlertDialog(model).then((yes) => {
                if (yes) {
                  vm.resetKitAllocation();
                }
              }, () => {
                vm.resetKitAllocation();
              }).catch((error) => BaseService.getErrorLog(error));
            }

            let validationMsg = null;
            if (res.data.Component && res.data.Component.restrictUSEwithpermission && (!res.data.BOMLineDetail || (res.data.BOMLineDetail && res.data.BOMLineDetail.customerApproval !== CORE.CustomerApprovalStatus.Approve))) {
              const validationMsgObj = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PID_RECTRICTED_WITH_PERMISION);
              validationMsgObj.message = stringFormat(validationMsgObj.message, res.data.Component.PIDCode, CORE.RestrictWithPermissionLabel.RestrictUSEWithPermission);
              const validationMsgObjFill = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.FILL_DETAIL_FOR_UMID);
              validationMsg = stringFormat('{0} {1}', validationMsgObj.message, validationMsgObjFill.message);
            } else if (res.data.Component && res.data.Component.restrictPackagingUseWithpermission && !res.data.Component.isCPN && (!res.data.BOMLineDetail || (res.data.BOMLineDetail && res.data.BOMLineDetail.customerApproval !== CORE.CustomerApprovalStatus.Approve))) {
              const validationMsgObj = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PID_RECTRICTED_PACKAGING_WITH_PERMISION);
              validationMsgObj.message = stringFormat(validationMsgObj.message, res.data.Component.PIDCode, CORE.RestrictWithPermissionLabel.RestrictPackagingUSEWithPermission);
              const validationMsgObjFill = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.FILL_DETAIL_FOR_UMID);
              validationMsg = stringFormat('{0} {1}', validationMsgObj.message, validationMsgObjFill.message);
            } else if (res.data.Component && res.data.Component.restrictPackagingUseWithpermission && res.data.Component.isCPN && (!res.data.BOMLineDetail || (res.data.BOMLineDetail && res.data.BOMLineDetail.customerApproval !== CORE.CustomerApprovalStatus.Approve))) {
              const validationMsgObj = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.CPN_RECTRICTED_PACKAGING_WITH_PERMISION);
              validationMsgObj.message = stringFormat(validationMsgObj.message, res.data.Component.PIDCode, CORE.RestrictWithPermissionLabel.RestrictPackagingUSEWithPermission);
              const validationMsgObjFill = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.FILL_DETAIL_FOR_UMID);
              validationMsg = stringFormat('{0} {1}', validationMsgObj.message, validationMsgObjFill.message);
            } else if (res.data.BOMLineDetail && res.data.BOMLineDetail.restrictUseInBOMWithPermissionStep) {
              const validationMsgObj = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PART_RESTRICT_WITH_PERMISSION_IN_BOM);
              validationMsgObj.message = stringFormat(validationMsgObj.message, res.data.Component.PIDCode);
              const validationMsgObjFill = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.FILL_DETAIL_FOR_KIT_ALLOCATION);
              validationMsg = stringFormat('{0} {1}', validationMsgObj.message, validationMsgObjFill.message);
            } else if (res.data.BOMLineDetail && res.data.BOMLineDetail.restrictUseInBOMExcludingAliasWithPermissionStep) {
              const validationMsgObj = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PART_RESTRICT_PACKAGING_IN_BOM_PERMISSION);
              validationMsgObj.message = stringFormat(validationMsgObj.message, res.data.Component.PIDCode);
              const validationMsgObjFill = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.FILL_DETAIL_FOR_KIT_ALLOCATION);
              validationMsg = stringFormat('{0} {1}', validationMsgObj.message, validationMsgObjFill.message);
            }

            if (validationMsg) {
              const objDetail = {
                event: null,
                componentObj: res.data.Component,
                bomLineDetail: res.data.BOMLineDetail,
                umidDetail: res.data.Component_Sid_Stock,
                dataElementDetail: res.data.Dataelement,
                informationMsg: validationMsg
              };
              getAuthenticationOfApprovalPart(objDetail);
            } else {
              if (vm.isAllocateToKit && res.data.ValidationMessage && res.data.ValidationMessage && res.data.ValidationMessage.MFGPart) {
                const slitMFGPart = res.data.ValidationMessage.MFGPart.split('###');
                const getSubAssyId = slitMFGPart ? parseInt(slitMFGPart[1]) : 0;
                if (getSubAssyId !== vm.autoCompleteSubAssebmly.keyColumnId) {
                  vm.autoCompleteSubAssebmly.keyColumnId = getSubAssyId;
                  vm.isSubAssyHighlight = true;
                } else {
                  vm.isSubAssyHighlight = false;
                }
              }
              getReceivingDataAfterScan(res.data.Component_Sid_Stock, res.data.Component);
              $timeout(() => {
                const dataElement = [];
                _.each(res.data.Dataelement, (data) => {
                  dataElement.push(data);
                });
                getDataElement(dataElement);
              }, true);
            }
          } else {
            if (res.data) {
              vm.autoCompleteRohsStatus.keyColumnId = null;
              const messagecode = res.data.messagecode;
              if (messagecode === '0' || messagecode === '4') {
                const obj = {
                  title: USER.USER_INFORMATION_LABEL,
                  textContent: res.data.Datamessage,
                  btnText: CORE.MESSAGE_CONSTANT.BUTTON_ADDRECORD_TEXT,
                  canbtnText: ''
                };
                if (res.data.Datamessage && res.data.Datamessage === vm.TransactionData.BARCODE_TEMPLATE_NOT_FOUND) {
                  obj.canbtnText = CORE.MESSAGE_CONSTANT.BUTTON_SKIP_TEXT;
                } else {
                  obj.canbtnText = CORE.MESSAGE_CONSTANT.BUTTON_SKIP_PART_TEXT;
                }
                DialogFactory.confirmDiolog(obj).then((item) => {
                  if (item) {
                    if (res.data && messagecode === '0') {
                      BaseService.openInNew(USER.ADMIN_MANAGE_BARCODE_LABEL_TEMPLATE_STATE);
                    } else {
                      addNewComponent(res.data.MFGPart);
                    }
                  }
                }, () => {
                  vm.umidDetail.ScanLabel = null;
                  setFocus('ScanLabel');
                }).catch((error) => BaseService.getErrorLog(error));
              } else if (messagecode === '5') {
                selectPartPopup(res.data.MFGPart);
              } else if (['6', '8', '10', '11', '12', '13', '14', '15', '16', '18', '19'].indexOf(messagecode) !== -1) {
                vm.cgBusyLoading = false;
                const model = {
                  title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
                  textContent: messagecode === '11' ? stringFormat(res.data.Datamessage, 'create UMID for') : res.data.Datamessage,
                  multiple: true
                };
                return DialogFactory.alertDialog(model).then((yes) => {
                  if (yes && messagecode === '8') {
                    BaseService.openInNew(USER.ADMIN_MANAGE_BARCODE_LABEL_TEMPLATE_STATE, {
                      id: res.data.MFGPart
                    });
                  } else {
                    vm.umidDetail.ScanLabel = null;
                    setFocus('ScanLabel');
                  }
                }, () => {

                }).catch((error) => BaseService.getErrorLog(error));
              } else if (messagecode === '7') {
                notificationOfMismatchBOM(true);
              } else if (messagecode === '9') {
                selectBarcodePopup(res.data.MFGPart);
              } else if (messagecode === '17') {
                selectLineItemPopup(res.data.MFGPart, 'Scan', null);
              } else if (messagecode === '22' || messagecode === '23' || messagecode === '25' || messagecode === '26') {
                const model = {
                  title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
                  textContent: res.data.Datamessage,
                  multiple: true
                };
                return DialogFactory.alertDialog(model).then(() => {
                  vm.umidDetail.ScanLabel = null;
                  setFocus('ScanLabel');
                }, () => {
                }).catch((error) => BaseService.getErrorLog(error));
              } else if (messagecode === '24') {
                vm.cgBusyLoading = false;
                const obj = {
                  title: USER.USER_INFORMATION_LABEL,
                  textContent: res.data.Datamessage,
                  btnText: CORE.MESSAGE_CONSTANT.GO_TO_PENDING_STOCK,
                  canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_FOR_CANCEL
                };
                DialogFactory.confirmDiolog(obj).then((item) => {
                  if (item) {
                    vm.umidDetail.ScanLabel = null;
                    setFocus('ScanLabel');
                    BaseService.goToNonUMIDStockList(null, null, res.data.MFGPart);
                  }
                }, () => {
                  vm.umidDetail.ScanLabel = null;
                  setFocus('ScanLabel');
                }).catch((error) => BaseService.getErrorLog(error));
              }
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.umidDetail.ScanLabel = null;
        setFocus('ScanLabel');
      }
    };

    vm.setPrefixToStorage = () => {
      if (vm.umidDetail.prefix) {
        setLocalStorageValue('UIDPrefix', {
          UIDPrefix: vm.umidDetail.prefix
        });
      }
    };

    $scope.$watch('vm.checkFormDirty(vm.formReceivingMaterial, vm.checkDirtyObject)', () => {
      $scope.$parent.vm.checkForm = vm.formReceivingMaterial;
    });

    vm.mfgAvailabelChange = (item) => {
      if (item) {
        vm.isCPNMFG = true;
      } else {
        vm.isCPNMFG = false;
      }
    };

    vm.goToCustomer = () => {
      BaseService.goToCustomerList();
    };

    vm.goToDCFormatList = () => BaseService.goToDCFormatList();

    vm.isCPNChange = () => {
      if (vm.umidDetail.cpn && vm.autoCompleteCustomer && vm.autoCompleteCustomer.keyColumnId) {
        vm.cgBusyLoading = ReceivingMaterialFactory.getMFGCodeOnCustomer().query({
          id: vm.autoCompleteCustomer.keyColumnId
        }).$promise.then((MFGCode) => {
          if (MFGCode && MFGCode.data && MFGCode.data.length > 0) {
            // vm.umidDetail.nickName = null;
            // getAssyList();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        $scope.$broadcast(vm.autoCompleteCPNComponent.inputName, null);
      }
    };

    vm.checkQty = () => {
      if (vm.umidDetail.spq > 0 && vm.umidDetail.pkgQty && vm.umidDetail.spq < vm.umidDetail.pkgQty) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.COUNT_GREATER);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        return DialogFactory.messageAlertDialog(model).then((yes) => {
          if (yes) {
            vm.umidDetail.pkgQty = null;
            const element = $window.document.getElementById('txtqty');
            if (element) {
              element.focus();
            }
          }
        }, () => {

        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    $scope.$on('CallRemoveFromReserveFromEdit', () => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.UNRESERVE_CONFIMATION);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          unReserveStock();
        }
      }, () => { }).catch((error) => BaseService.getErrorLog(error));
    });

    const unReserveStock = () => {
      const ReceivingMaterial = {};
      ReceivingMaterial.selectedRow = [];
      ReceivingMaterial.selectedRow.push(vm.umidDetail);
      vm.cgBusyLoading = ReceivingMaterialFactory.RemoveFromReserveStock().query(ReceivingMaterial).$promise.then((res) => {
        if (res) {
          $scope.$parent.vm.isReservedStock = false;
          $state.go(vm.TransactionData.TRANSACTION_MANAGERECEIVINGMATERIAL_STATE, {
            id: $stateParams.id
          }, { reload: true });
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    $scope.$on('CallAddInReserveFromEdit', (event) => {
      DialogFactory.dialogService(
        vm.TransactionData.ADD_RESERVE_STOCK_MODAL_CONTROLLER,
        vm.TransactionData.ADD_RESERVE_STOCK_MODAL_VIEW,
        event, {
        id: vm.cstID
      }).then(() => { }, (reserveStock) => {
        if (reserveStock) {
          $scope.$parent.vm.isReservedStock = true;
          $state.go(vm.TransactionData.TRANSACTION_MANAGERECEIVINGMATERIAL_STATE, {
            id: $stateParams.id
          }, { reload: true });
        }
      }, (err) => BaseService.getErrorLog(err));
    });

    vm.changeAllocateToKit = () => {
      if (vm.isAllocateToKit) {
        getSalesOrderList();
        $timeout(() => {
          vm.focusPOAuto = true;
        }, true);
      } else {
        selectedPO['SalesOrderDetailId'] = null;
        selectedPO['PartID'] = null;
        vm.kitAllocation['SO'] = null;
        vm.kitAllocation['Assy ID'] = null;
        vm.kitAllocation['PO Qty'] = null;
        vm.kitAllocation['mrpQty'] = null;
        $scope.$broadcast(`${vm.autoCompleteSO.inputName}ResetAutoComplete`, null);
        vm.autoCompleteSO.keyColumnId = null;
        vm.autoCompleteSubAssebmly.keyColumnId = null;
        rfqLineItemsID = null;
        rfqAlternateID = null;
        if (vm.autoCompleteSubAssebmly && vm.autoCompleteSubAssebmly.keyColumnId) {
          vm.umidDetail.prefix = null;
          removeLocalStorageValue('UIDPrefix');
          vm.autoCompleteCustomer.keyColumnId = null;
          removeLocalStorageValue('CustomerForPrefix');
        }
        $timeout(() => {
          vm.focusPOAuto = false;
        }, true);
      }
    };

    const matchAllocatToKit = () => {
      if (vm.isAllocateToKit && (vm.autoCompleteSO && vm.autoCompleteSO.keyColumnId || selectedPO)) {
        const partId = selectedSubAssy && selectedSubAssy.id ? selectedSubAssy.id : selectedPO['PartID'];
        let messageContent = null;
        if (vm.autoCompleteAssy && vm.autoCompleteAssy.keyColumnId && vm.autoCompleteAssy.keyColumnId !== partId) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MISMATCH_WITH_KIT);
          messageContent.message = stringFormat(messageContent.message, 'Assembly');
        } else if (vm.autoCompleteCustomer && vm.autoCompleteCustomer.keyColumnId && vm.autoCompleteCustomer.keyColumnId !== selectedPO['Customer ID']) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MISMATCH_WITH_KIT);
          messageContent.message = stringFormat(messageContent.message, 'Customer');
        }

        if (messageContent) {
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model).then((yes) => {
            if (yes) {
              vm.isMismatchWithKit = true;
              return false;
            }
          }, () => {
            vm.isMismatchWithKit = false;
            return true;
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          vm.isMismatchWithKit = false;
          return true;
        }
      } else {
        vm.isMismatchWithKit = false;
        return true;
      }
    };

    const get_RFQ_BOMPart_List = (mfgPNID) => {
      if (vm.autoCompleteSO && vm.autoCompleteSO.keyColumnId && selectedPO && selectedPO['PartID'] && mfgPNID) {
        vm.cgBusyLoading = ReceivingMaterialFactory.get_RFQ_BOMPart_List().query({
          id: vm.autoCompleteSubAssebmly && vm.autoCompleteSubAssebmly.keyColumnId ? vm.autoCompleteSubAssebmly.keyColumnId : selectedPO['PartID'],
          sodid: selectedPO['SalesOrderDetailId'] ? selectedPO['SalesOrderDetailId'] : 0
        }).$promise.then((response) => {
          const BOMPart_List = response.data;
          let findPartList;
          let findPart;

          if (rfqLineItemsID && rfqAlternateID) {
            findPartList = _.filter(BOMPart_List, (item) => item.mfgPNID === mfgPNID && item.rfqLineItemsID === rfqLineItemsID && item.lineitemAlternatePartId === rfqAlternateID);
          } else if (rfqLineItemsID) {
            findPartList = _.filter(BOMPart_List, (item) => item.mfgPNID === mfgPNID && item.rfqLineItemsID === rfqLineItemsID);
          } else {
            findPartList = _.filter(BOMPart_List, (item) => item.mfgPNID === mfgPNID);
          }

          if (findPartList.length === 0) {
            notificationOfMismatchBOM(false);
          } else {
            if (findPartList.length === 1) {
              findPart = findPartList[0];
              check_RFQ_BOMPart_Validation(findPart);
            } else {
              selectLineItemPopup(mfgPNID, 'Manual', findPartList);
            }
          }
          return $q.resolve(findPart);
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    const check_RFQ_BOMPart_Validation = (findPart) => {
      if ((findPart.restrictUseInBOMWithPermissionStep || findPart.restrictUseInBOMExcludingAliasWithPermissionStep) && !objApproval) {
        const objDetail = {
          event: null,
          componentObj: null,
          bomLineDetail: findPart,
          umidDetail: null,
          dataElementDetail: null,
          informationMsg: stringFormat('{0} {1}', findPart.restrictUseInBOMWithPermissionStep ? stringFormat(vm.TransactionData.PART_RESTRICT_WITH_PERMISSION_IN_BOM, findPart.PIDCode) : stringFormat(vm.TransactionData.PART_RESTRICT_PACKAGING_IN_BOM_PERMISSION, findPart.PIDCode), vm.TransactionData.FILL_DETAIL_FOR_KIT_ALLOCATION)
        };
        getAuthenticationOfApprovalPart(objDetail);
      } else {
        let messageContent = null;
        if (findPart.restrictUseInBOMStep || findPart.restrictUseInBOMExcludingAliasStep || findPart.restrictCPNUseInBOMStep) {
          if (findPart.restrictUseInBOMStep) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PART_RESTRICT_IN_BOM);
            messageContent.message = stringFormat(messageContent.message, findPart.PIDCode);
          } else if (findPart.restrictUseInBOMExcludingAliasStep) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PART_RESTRICT_PACKAGING_IN_BOM);
            messageContent.message = stringFormat(messageContent.message, findPart.PIDCode);
          } else if (findPart.restrictCPNUseInBOMStep) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.CPN_PART_RESTRICT_IN_BOM);
            messageContent.message = stringFormat(messageContent.message, findPart.PIDCode);
          }
        } else if (!findPart.isInstall && !findPart.isPurchase && !findPart.isBuyDNPQty) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PART_NOT_POPULATE);
        } else if (!findPart.bomLineCleanStatus) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.BOM_LINE_NOT_CLEAN);
          messageContent.message = stringFormat(messageContent.message, findPart.assyPIDCode, findPart.bomLineItemId, findPart.PIDCode);
        } else if (!findPart.uomMismatchedStep) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MISMATCH_UOM_DATA_KITALLOCATION);
          messageContent.message = stringFormat(messageContent.message, 'UOM', findPart.bomLineItemId);
        } else if (findPart.cpnID !== CORE.NOTAVAILABLEMFRPNID && ((!findPart.mismatchMountingTypeStep && !findPart.approvedMountingType) || findPart.mountingTypeID === -1)) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MISMATCH_DATA_KITALLOCATION);
          messageContent.message = stringFormat(messageContent.message, 'Mounting Type', findPart.bomLineItemId);
        } else if (findPart.cpnID !== CORE.NOTAVAILABLEMFRPNID && ((!findPart.mismatchFunctionalCategoryStep && !findPart.approvedMountingType) || findPart.partType === -1)) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MISMATCH_DATA_KITALLOCATION);
          messageContent.message = stringFormat(messageContent.message, 'Functional Type', findPart.bomLineItemId);
        } else {
          messageContent = null;
        }

        if (messageContent) {
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          return DialogFactory.messageAlertDialog(model).then((yes) => {
            if (yes) {
              vm.resetKitAllocation();
            }
          }, () => {

          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          if (findPart.assyId) {
            if (findPart.assyId !== vm.autoCompleteSubAssebmly.keyColumnId) {
              vm.autoCompleteSubAssebmly.keyColumnId = findPart.assyId;
              vm.isSubAssyHighlight = true;
            }
          }
          rfqLineItemsID = findPart.rfqLineItemsID;
          vm.umidDetail.isPurchaseAtBOM = findPart.isPurchase;
        }
      }
    };

    const notificationOfMismatchBOM = (fromScan) => {
      let messageContent;
      if (!vm.isCallFromMismatchPart) {
        vm.isCallFromMismatchPart = true;
        if (vm.umidDetail.stockInventoryType === vm.InventoryType[2].value) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_IN_KIT);
          messageContent.message = stringFormat(messageContent.message, vm.autoCompleteWO.keyColumnId, vm.POData ? vm.POData.salescolumn : '');
        } else {
          const partLabel = stringFormat('{0}/{1}/{2}', vm.LabelConstant.MFG.CustomerPN, vm.LabelConstant.MFG.MFGPN, vm.LabelConstant.MFG.SupplierPN);
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_IN_BOM);
          messageContent.message = stringFormat(messageContent.message, partLabel, vm.POData ? vm.POData.salescolumn : '');
        }
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        return DialogFactory.messageAlertDialog(model).then((yes) => {
          if (yes) {
            if (vm.umidDetail.stockInventoryType === vm.InventoryType[2].value) {
              vm.isCallFromMismatchPart = false;
              vm.isRejectPO = true;
              selectedPO['SalesOrderDetailId'] = null;
              selectedPO['PartID'] = null;
              vm.kitAllocation['SO'] = null;
              vm.kitAllocation['Assy ID'] = null;
              vm.kitAllocation['PO Qty'] = null;
              vm.kitAllocation['mrpQty'] = null;
              $scope.$broadcast(`${vm.autoCompleteSO.inputName}ResetAutoComplete`, null);
              vm.autoCompleteSO.keyColumnId = null;
              vm.autoCompleteSubAssebmly.keyColumnId = null;
              rfqLineItemsID = null;
              rfqAlternateID = null;
              vm.focusPOAuto = true;
              getSalesOrderList();
            } else if (fromScan) {
              vm.reScan();
              setFocus('ScanLabel');
              vm.autoCompleteRohsStatus.keyColumnId = null;
            } else {
              vm.reScan();
              vm.autoCompleteRohsStatus.keyColumnId = null;
            }
          }
        }, () => {
          vm.isCallFromMismatchPart = false;
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    const bindPackingslipDetails = (packingslipLine) => {
      if (packingslipLine) {
        vm.umidDetail.packingSlipID = packingslipLine.packingSlipID;
        vm.umidDetail.packingSlipNumber = packingslipLine.packingSlipNumber;
        vm.umidDetail.packingSlipDetailId = packingslipLine.packingSlipDetID;
        vm.umidDetail.packagingType = packingslipLine.packagingType;
        vm.umidDetail.sourceName = packingslipLine.sourceName;
        vm.umidDetail.packaging = packingslipLine.packaging;
        vm.umidDetail.pkgQty = packingslipLine.umidCount ? packingslipLine.umidCount : (packingslipLine.sourceName === vm.TransactionData.Packaging.TapeAndReel ? packingslipLine.partPackagingMinQty : packingslipLine.BalanceQty);
        vm.umidDetail.pkgUnit = vm.umidDetail.pkgQty * vm.umidDetail.componentUnit;
        vm.umidDetail.customerConsign = (packingslipLine.isCustConsigned || packingslipLine.isLineCustConsigned) ? true : false;
        vm.isPackagingDisable = true;
        vm.isFromBinDisable = true;

        if (vm.autoPackaging) {
          vm.autoPackaging.keyColumnId = vm.umidDetail.packaging;
        }
        if (vm.autoCompleteCustomer) {
          vm.autoCompleteCustomer.keyColumnId = packingslipLine.CustomerID ? packingslipLine.CustomerID : packingslipLine.LineCustomerID;
          getAssyList();
        }
        if (vm.umidDetail.mfgAvailabel) {
          vm.isFocusonCPN = true;
        } else if (!vm.umidDetail.customerConsign) {
          setFocus('reservedStock');
        }
      }
    };

    // Check packing slip details for Non imconing stock
    const getSameCriteriaPackingSlipNonUMIDStock = (isValidate) => {
      const searchObj = {
        partId: vm.umidDetail.refcompid,
        binId: vm.umidDetail.fromBin,
        type: 'UC',
        PIDCode: vm.umidDetail.PIDCode,
        binName: vm.umidDetail.fromBinName,
        isValidate: isValidate
      };

      vm.cgBusyLoading = ReceivingMaterialFactory.getSameCriteriaUMIDPackingSlipDetails().query(searchObj).$promise.then((response) => {
        if (response && response.data) {
          if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            vm.packingSlipDetail = response.data.pendingPackingSlipList;
            if (vm.packingSlipDetail.length > 1) {
              const packingSlipDetail = {
                packingSlipDetail: vm.packingSlipDetail,
                umidCount: vm.umidDetail.pkgQty,
                mfrPnId: vm.umidDetail.refcompid,
                binName: vm.umidDetail.fromBinName,
                PIDCode: vm.umidDetail.PIDCode,
                mfgPN: vm.umidDetail.mfgPN,
                rohsIcon: vm.umidDetail.rohsIcon,
                rohsName: vm.umidDetail.rohsName,
                componentUnit: vm.umidDetail.componentUnit,
                mfgType: vm.umidDetail.mfgType,
                uomClassID: vm.umidDetail.uomClassID
              };

              return DialogFactory.dialogService(
                TRANSACTION.DUPLICATE_PACKINGSLIP_PENDING_UID_STOCK_POPUP_CONTROLLER,
                TRANSACTION.DUPLICATE_PACKINGSLIP_PENDING_UID_STOCK_POPUP_VIEW,
                event,
                packingSlipDetail
              ).then(() => {
              }, (response) => {
                if (response) {
                  bindPackingslipDetails(response);
                } else {
                  vm.reScan();
                }
              }).catch((error) => BaseService.getErrorLog(error));
            } else if (vm.packingSlipDetail.length === 1) {
              const packingSlipDetail = vm.packingSlipDetail[0];
              // packingSlipDetail.pkgQty = packingSlipDetail.BalanceQty;
              bindPackingslipDetails(packingSlipDetail);
            }
          } else if (response.data.messageTypeCode === 1 || response.data.messageTypeCode === 2) {
            const model = {
              messageContent: response.data.messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model).then(() => {
              vm.umidDetail.mfgAvailabel = false;
              if (vm.selectPartBarcode === 'true') {
                vm.umidDetail.ScanLabel = null;
                setFocus('ScanLabel');
              } else {
                $scope.$emit('sendComponent', null);
                $scope.$broadcast(vm.autoCompletecomponent.inputName, null);
                setFocusByName(vm.autoCompletecomponent.inputName);
              }
            }, () => {
            }).catch((error) => BaseService.getErrorLog(error));
          } else if (response.data.messageTypeCode === 3) {
            const obj = {
              messageContent: response.data.messageContent,
              btnText: CORE.MESSAGE_CONSTANT.GO_TO_PENDING_STOCK,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_FOR_CANCEL
            };
            return DialogFactory.messageConfirmDialog(obj).then((item) => {
              if (item) {
                vm.umidDetail.mfgAvailabel = false;
                if (vm.selectPartBarcode === 'true') {
                  vm.umidDetail.ScanLabel = null;
                  setFocus('ScanLabel');
                } else {
                  $scope.$emit('sendComponent', null);
                  $scope.$broadcast(vm.autoCompletecomponent.inputName, null);
                  setFocusByName(vm.autoCompletecomponent.inputName);
                }
                BaseService.goToNonUMIDStockList(null, null, vm.umidDetail.PIDCode);
              }
            }, () => {
              vm.umidDetail.mfgAvailabel = false;
              if (vm.selectPartBarcode === 'true') {
                vm.umidDetail.ScanLabel = null;
                setFocus('ScanLabel');
              } else {
                $scope.$emit('sendComponent', null);
                $scope.$broadcast(vm.autoCompletecomponent.inputName, null);
                setFocusByName(vm.autoCompletecomponent.inputName);
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.goToMFGList = () => {
      BaseService.goToManufacturerList();
    };
    vm.goToRoHSStatusList = () => {
      BaseService.openInNew(USER.ADMIN_ROHS_STATE, {});
    };
    vm.goToMFGPartList = () => {
      BaseService.openInNew(USER.ADMIN_MFG_COMPONENT_STATE, {});
    };

    vm.goToPOList = () => {
      BaseService.openInNew(vm.TransactionData.TRANSACTION_SALESORDER_STATE, {});
    };

    vm.goToWOList = () => {
      BaseService.goToWorkorderList();
    };

    vm.goToUOMList = () => {
      BaseService.openInNew(USER.ADMIN_UNIT_STATE, {});
    };

    vm.goToUIDManage = (id) => BaseService.goToUMIDDetail(id);

    vm.goToCostCategoryList = () => {
      BaseService.openInNew(USER.ADMIN_COST_CATEGORY_STATE, {});
    };

    vm.goToLocationList = () => {
      BaseService.openInNew(vm.TransactionData.TRANSACTION_BIN_STATE, {});
    };

    vm.goToCustomerList = () => {
      BaseService.goToCustomerList();
    };

    vm.goToPackaging = () => {
      BaseService.goToPackaging();
    };

    vm.goToKitList = () => {
      BaseService.goToKitList(selectedPO ? selectedPO.SalesOrderDetailId : 0, vm.autoCompleteSubAssebmly && vm.autoCompleteSubAssebmly.keyColumnId ? vm.autoCompleteSubAssebmly.keyColumnId : 0, null);
    };

    vm.goToManagePackingSlipDetail = () => {
      BaseService.goToManagePackingSlipDetail(vm.umidDetail.packingSlipDetailId);
    };

    vm.allocatedKit = () => {
      const data = vm.umidDetail;
      data.refUMIDId = data.id;
      DialogFactory.dialogService(
        vm.TransactionData.ALLOCATED_KIT_CONTROLLER,
        vm.TransactionData.ALLOCATED_KIT_VIEW,
        event,
        data).then(() => { }, (allocatedtokit) => {
          if (allocatedtokit.length === 0) {
            vm.allocatedKitCount = 0;
          } else {
            vm.allocatedKitCount = allocatedtokit.length;
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    vm.getMinLengthValidation = (minLength, enterTextLength) => BaseService.getMinLengthValidation(minLength, enterTextLength);

    const checkAssemblyHasBom = (partID) => {
      if (partID) {
        return ReceivingMaterialFactory.checkAssemblyHasBom().query({
          id: partID
        }).$promise.then((response) => {
          if (response && response.data && response.data.messageContent) {
            const model = {
              messageContent: response.data.messageContent,
              multiple: true
            };
            return DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                vm.autoCompleteSO.keyColumnId = null;
              }
            }, () => {

            }).catch((error) => BaseService.getErrorLog(error));
          } else {
            return true;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    const checkScanValidation = (messageContent, Type) => {
      const model = {
        messageContent: messageContent,
        multiple: true
      };
      DialogFactory.messageAlertDialog(model).then((yes) => {
        if (yes) {
          if (Type === 'PrefixRequire') {
            setFocus('Prefix');
          } else if (Type === 'WrongScan') {
            vm.umidDetail.ScanLabel = null;
            vm.reScan();
          }

          return false;
        }
      }, () => {

      }).catch((error) => BaseService.getErrorLog(error));
    };

    const getReceivingDataAfterScan = (conmponent_sid_stock, component) => {
      vm.isEdit = false;
      $scope.$parent.vm.isEdit = vm.isEdit;
      const componentSidStock = conmponent_sid_stock;
      vm.umidDetail.cpn = component.isCPN;
      vm.umidDetail.id = componentSidStock.id;
      vm.umidDetail.ScanLabel = componentSidStock.scanlabel;
      vm.rohsStatusCheck = component.RoHSStatusID;
      vm.autoCompleteRohsStatus.keyColumnId = component.RoHSStatusID;
      if (vm.umidDetail.ScanLabel) {
        vm.selectPartBarcode = 'true';
        vm.umidDetail.formatType = vm.Transaction.FIRSTSCANLBL;
      } else {
        vm.selectPartBarcode = 'false';
        vm.umidDetail.formatType = vm.Transaction.FIRSTMFG;
      }
      if (vm.umidDetail.stockInventoryType === vm.InventoryType[2].value) {
        const packaging = _.find(vm.packagingList, { name: vm.TransactionData.Packaging.Bulk });
        vm.umidDetail.packagingType = packaging ? packaging.name : null;
        vm.umidDetail.sourceName = packaging ? packaging.sourceName : null;
        vm.umidDetail.packaging = packaging ? packaging.id : null;
        vm.umidDetail.pkgQty = vm.umidDetail.woUMIDProposedCountQty ? parseFloat(vm.umidDetail.woUMIDProposedCountQty) : vm.umidDetail.pkgQty;
      } else {
        vm.umidDetail.packaging = component.packagingID;
        vm.umidDetail.packagingType = component.packagingName;
        vm.umidDetail.sourceName = component.sourceName;
        if (component.sourceName === vm.TransactionData.Packaging.TapeAndReel) {
          vm.umidDetail.partPackagingMinQty = vm.umidDetail.pkgQty = component.umidSPQ;
        }
      }
      vm.umidDetail.pcbPerArray = componentSidStock.pcbPerArray;
      calCulateExpiryInDays();
      vm.umidDetail.mfgAvailabel = vm.umidDetail.cpn ? true : false;
      assemblyId = componentSidStock.assyID;

      if (component) {
        vm.umidDetail.PIDCode = component.PIDCode;
        vm.umidDetail.mfgcodeID = component.mfgcodeID;
        getComponentDetailsByMfg({
          id: component.id,
          mfgcodeID: component.mfgcodeID
        });
        vm.umidDetail.refcompid = component.id;
        vm.umidDetail.mfgPN = component.mfgPN;
        vm.umidDetail.mfgName = BaseService.getMfgCodeNameFormat(component.mfgCode, component.mfgName);
        vm.umidDetail.mfgCode = component.mfgCode;
        vm.umidDetail.mfgPNDescription = component.mfgPNDescription;
        vm.umidDetail.rohs = component.rfq_rohsmst ? component.rfq_rohsmst.name === CORE.RoHSStatus.RoHS ? 'Y' : component.rfq_rohsmst.name === CORE.RoHSStatus.NonRoHS ? 'N' : component.rfq_rohsmst.name : null;
        editCostCategoryId = component.costCategoryID;
        if (vm.autoCompletePriceCategory) {
          vm.autoCompletePriceCategory.keyColumnId = editCostCategoryId;
        }
        vm.umidDetail.oldpcbPerArray = component.pcbPerArray;
        vm.umidDetail.pcbPerArray = component.pcbPerArray;
        vm.umidDetail.spq = componentSidStock.refSupplierPartId ? component.supplierUmidSPQ : component.umidSPQ ? component.umidSPQ : 0;
        vm.umidDetail.mslLevel = component.mslTime;
        vm.umidDetail.selfLifeDays = component.selfLifeDays || 0;
        vm.umidDetail.shelfLifeAcceptanceDays = component.shelfLifeAcceptanceDays || 0;
        vm.umidDetail.maxShelfLifeAcceptanceDays = component.maxShelfLifeAcceptanceDays || 0;
        vm.shelfLifeDateType = component.shelfLifeDateType || null;
        vm.mountingType = component.mountingTypeName || null;
        vm.hasLimitedShelfLife = component.hasLimitedShelfLife ? component.hasLimitedShelfLife : 0;
        vm.umidDetail.uom = component.uom;
        vm.umidDetail.uomName = component.uomName;
        vm.umidDetail.uomClassID = component.uomClassID;
        vm.umidDetail.componentUnit = component.unit ? component.unit : 1;
        vm.umidDetail.rohsIcon = component.rohsIcon;
        vm.umidDetail.rohsName = component.rohsName;
        vm.umidDetail.partMasterPackagingId = component.packagingID;
        vm.umidDetail.mfrPackagingSourceName = component.sourceName;
        vm.autoCompleteDateCodeFormat.keyColumnId = component.dateCodeFormatID ? component.dateCodeFormatID : (component.mfg_dateCodeFormatId ? component.mfg_dateCodeFormatId : null);
        vm.umidDetail.fromDateCodeFormat = component.dateCodeFormatID ? vm.DateCodeFormatFrom[2].key : (component.mfg_dateCodeFormatId ? vm.DateCodeFormatFrom[1].key : vm.DateCodeFormatFrom[0].key);
        if (vm.umidDetail.fromDateCodeFormat !== vm.DateCodeFormatFrom[0].key) {
          const dateCodeFormatFromValue = _.find(vm.DateCodeFormatFrom, { key: vm.umidDetail.fromDateCodeFormat });
          if (dateCodeFormatFromValue) {
            vm.umidDetail.dateCodeFormatFromValue = dateCodeFormatFromValue.value;
          }
        }
        vm.umidDetail.dateCode = componentSidStock.dateCode;
        vm.umidDetail.lotCode = componentSidStock.lotCode;

        vm.umidDetail.partPackage = component.partPackageName;
        vm.umidDetail.externalPartPackage = component.partPackage;

        vm.umidDetail.tentativePrice = component.price;

        if (selectedPO && selectedPO['SalesOrderDetailId'] && vm.isScanLabel) {
          vm.isAllocateToKit = true;
          get_RFQ_BOMPart_List(vm.umidDetail.refcompid);
        }

        // If Mounting Group is Chemical & shelf life days is not added then we have to restrict user
        if (vm.umidDetail.selfLifeDays === 0 && vm.hasLimitedShelfLife) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SHELF_LIFE_DAYS_FOR_MOUNTING_GROUP_CHEMICAL_VALIDATION);
          const model = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT
          };
          DialogFactory.messageAlertDialog(model).then(() => {
            vm.goToComponentDetail(CORE.MFG_TYPE.MFG, component.id);
            vm.reScan();
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
      setShelfLifeDateType(vm.shelfLifeDateType);
      if (vm.umidDetail.fromBin !== CORE.SystemGenratedWarehouseBin.bin.OpeningBin.id) {
        getCofCData(vm.umidDetail.fromBin, vm.umidDetail.refcompid);
      }

      vm.gridOptions.gridApi.grid.options.hideAddNew = false;

      if (componentSidStock.refCPNMFGPNID) {
        vm.umidDetail.cpnmfgcodeID = component.cpnMFGCodeID;
        getCpnComponentDetailsByMfg({
          id: component.cpnID,
          mfgcodeID: component.cpnMFGCodeID
        });
      }
      if (componentSidStock.refSupplierPartId) {
        vm.supplierPartId = componentSidStock.refSupplierPartId;
        vm.supplierCode = stringFormat('({0}) {1}', component.supplierMFGCode, component.supplierMFGName);
        vm.supplierMFGPN = stringFormat('({0}) {1}', component.supplierMFGCode, component.supplierMFGPN);
        vm.umidDetail.supplierMFGPN = component.supplierMFGPN;
        vm.umidDetail.packaging = component.supplierPackagingId;
        if (component.supplierSourceName === vm.TransactionData.Packaging.TapeAndReel) {
          vm.umidDetail.partPackagingMinQty = vm.umidDetail.pkgQty = component.umidSPQ; // parseFloat(component.minimum);
        } else {
          vm.umidDetail.pkgQty = null;
        }
      }

      $scope.$emit('sendComponent', vm.umidDetail);
      vm.umidDetailCopy = _.clone(vm.umidDetail);
      vm.execute = true;

      vm.checkDirtyObject = {
        oldModelName: vm.umidDetailCopy,
        newModelName: vm.umidDetail
      };

      vm.checkCountValueChange();
      autoComplete();
      autocompleteprice();
      setCostCategoryAutoComplete(vm.umidDetail.tentativePrice);
      if (vm.umidDetail.stockInventoryType === vm.TransactionData.InventoryType[0].value) {
        getSameCriteriaPackingSlipNonUMIDStock();
      }
    };

    const getDataElement = (dataElementList) => {
      vm.sourceData = dataElementList;
      vm.totalSourceDataCount = vm.sourceData.length;

      if (!vm.gridOptions.enablePaging) {
        vm.currentdata = vm.sourceData.length;
        vm.gridOptions.gridApi.infiniteScroll.resetScroll();
      }

      vm.gridOptions.clearSelectedRows();
      if (vm.totalSourceDataCount === 0) {
        if (vm.pagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
          vm.isNoDataFound = false;
          vm.emptyState = 0;
        } else {
          vm.isNoDataFound = true;
          vm.emptyState = null;
        }
      } else {
        /* to set data element name in grid  */
        _.each(vm.sourceData, (item, index) => {
          item['index'] = index;
        });

        vm.isNoDataFound = false;
        vm.emptyState = null;
      }
      $timeout(() => {
        vm.resetSourceGrid();
        vm.getDataElementList();
        cellEdit();
      });
    };

    $scope.addNewParentRow = () => {
      var objMax = _.maxBy(vm.sourceData, (item) => item.index);
      var obj = {
        index: objMax && objMax.index ? objMax.index + 1 : 0,
        id: 0,
        dataelementid: null,
        value: null
      };

      const findEmptyObj = _.some(vm.sourceData, (data) => !data.dataElementName);
      if (findEmptyObj) {
        return;
      } else {
        vm.sourceData.push(obj);
      }
    };

    vm.checkCountValueChange = () => {
      if (vm.umidDetail.pkgQty) {
        vm.isCountValueChange = true;
      } else {
        vm.isCountValueChange = false;
      }
    };

    vm.mfrCheck = (fromPackagingAutoComplete, packagingObj) => {
      if ((vm.umidDetail.stockInventoryType === TRANSACTION.InventoryType[1].value || vm.umidDetail.stockInventoryType === TRANSACTION.InventoryType[0].value) && (vm.umidDetail.pkgQty !== vm.umidDetail.partPackagingMinQty && vm.isCountValueChange) && !vm.isEdit) {
        if (packagingObj.sourceName === vm.TransactionData.Packaging.TapeAndReel) {
          if (vm.umidDetail.pkgQty < vm.umidDetail.partPackagingMinQty) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.CONFIRMATION_CONNTINUE_TR_UMID_COUNT);
            messageContent.message = stringFormat(messageContent.message, 'Count', redirectToPartDetail(vm.umidDetail.refcompid, vm.umidDetail.mfgType, vm.umidDetail.PIDCode), packagingObj.name, 'COUNT', vm.umidDetail.partPackagingMinQty);
            const buttonsList = [{
              name: 'Continue'
            },
            {
              name: 'Change Packaging'
            },
            {
              name: 'Change Count'
            }
            ];

            const data = {
              messageContent: messageContent,
              buttonsList: buttonsList,
              buttonIndexForFocus: 2
            };
            DialogFactory.dialogService(
              CORE.MULTIPLE_BUTTONS_DIALOG_POPUP_CONTROLLER,
              CORE.MULTIPLE_BUTTONS_DIALOG_POPUP_VIEW,
              null,
              data).then(() => { }, (response) => {
                vm.isPackagingPopupOpen = false;
                if (response === buttonsList[0].name) {
                  vm.isCountValueChange = false;
                  if (vm.umidDetail.currentBinName) {
                    vm.focusPackaginAuto = true;
                  } else {
                    setFocusAndValueSelecte('currentBinName');
                  }
                } else if (response === buttonsList[1].name) {
                  vm.autoPackaging.keyColumnId = null;
                  if (vm.umidDetail.currentBinName) {
                    vm.focusPackaginAuto = true;
                  } else {
                    setFocusAndValueSelecte('currentBinName');
                  }
                } else if (response === buttonsList[2].name) {
                  setFocusAndValueSelecte('txtqty');
                }
              }, (err) => BaseService.getErrorLog(err));
          } else {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.EXISTING_STK_COUNT_NOT_MORE_THAN_SPQ);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model).then(() => {
              setFocusAndValueSelecte('txtqty');
            });
          }
        } else if ((packagingObj.sourceName === vm.TransactionData.Packaging.CuteTape || packagingObj.sourceName === vm.TransactionData.Packaging.CustomReel) && vm.umidDetail.pkgQty > vm.umidDetail.partPackagingMinQty) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SPQ_MORE_ALLOW_FOR_CT_CR);
          messageContent.message = stringFormat(messageContent.message, vm.umidDetail.pkgQty, vm.umidDetail.partPackagingMinQty, redirectToManufacturerDetail(vm.umidDetail.mfgcodeID, vm.umidDetail.mfgName), redirectToPartDetail(vm.umidDetail.refcompid, vm.umidDetail.mfgType, vm.umidDetail.mfgPN));
          const buttonsList = [{
            name: 'Continue'
          },
          {
            name: 'Change Count'
          }
          ];

          const data = {
            messageContent: messageContent,
            buttonsList: buttonsList,
            buttonIndexForFocus: 1
          };
          DialogFactory.dialogService(
            CORE.MULTIPLE_BUTTONS_DIALOG_POPUP_CONTROLLER,
            CORE.MULTIPLE_BUTTONS_DIALOG_POPUP_VIEW,
            null,
            data).then(() => { }, (response) => {
              vm.isPackagingPopupOpen = false;
              if (response === buttonsList[0].name) {
                vm.isCountValueChange = false;
                if (vm.umidDetail.currentBinName) {
                  vm.focusPackaginAuto = true;
                } else {
                  setFocusAndValueSelecte('currentBinName');
                }
              } else if (response === buttonsList[1].name) {
                setFocusAndValueSelecte('txtqty');
              }
            }, (err) => BaseService.getErrorLog(err));
        }
      } else {
        if (vm.umidDetail.pkgQty === vm.umidDetail.spq && !vm.isEdit && !fromPackagingAutoComplete) {
          if (vm.umidDetail.stockInventoryType !== vm.InventoryType[0].value) {
            vm.autoPackaging.keyColumnId = vm.umidDetail.partMasterPackagingId;
            if (vm.umidDetail.pkgQty && packagingObj) {
              const obj = {
                componentID: vm.umidDetail.refcompid,
                mfgPN: vm.umidDetail.mfgPN,
                qty: vm.umidDetail.pkgQty,
                PackagingList: _.map(packagingObj.component_packagingmst, 'alias'),
                supplier: vm.umidDetail.stockInventoryType === vm.InventoryType[0].value ? vm.umidDetail.packingSlipSupplierName : null,
                supplierPN: vm.umidDetail.supplierMFGPN
              };
              getPricingDetailForCostCategory(obj);
              vm.isPackagingPopupOpen = false;
            }
          } else {
            vm.isPackagingPopupOpen = false;
          }
        } else if (!fromPackagingAutoComplete && vm.umidDetail.stockInventoryType === vm.InventoryType[2].value) {
          if (vm.umidDetail.woUMIDProposedQty && vm.umidDetail.woUMIDProposedQtyValidation && vm.umidDetail.woUMIDProposedQty !== vm.umidDetail.pkgQty) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PROPOSED_UMID_QTY_CONFIRMATION);
            messageContent.message = stringFormat(messageContent.message, finalMfgPn, vm.umidDetail.woUMIDProposedQty);
            const model = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_FOR_Continue,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_FOR_CANCEL
            };
            return DialogFactory.messageConfirmDialog(model).then(() => {
              vm.isPackagingPopupOpen = false;
              if (vm.umidDetail.currentBinName) {
                vm.focusPackaginAuto = true;
              } else {
                setFocusAndValueSelecte('currentBinName');
              }
            }, () => {
              vm.umidDetail.woUMIDProposedQtyConfirmation = false;
              vm.umidDetail.pkgQty = null;
              setFocus('txtqty');
            }).catch((error) => BaseService.getErrorLog(error));
          } else if (!fromPackagingAutoComplete && vm.umidDetail.pkgQty > vm.umidDetail.woAvailableQty) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.BIN_NOT_HAVE_STOCK);
            messageContent.message = stringFormat(messageContent.message, vm.umidDetail.fromBinName, finalMfgPn, vm.umidDetail.woAvailableQty, vm.umidDetail.pkgQty);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            return DialogFactory.messageAlertDialog(model).then(() => {
              vm.isPackagingPopupOpen = false;
              vm.umidDetail.pkgQty = null;
              setFocus('txtqty');
            }, () => {
            }).catch((error) => BaseService.getErrorLog(error));
          }
        } else {
          if (!fromPackagingAutoComplete) {
            vm.isPackagingPopupOpen = false;
            // commented because while leaving from Count field and count value not matching with part packageQty [not UMID spq] this code clears selection of packaging
            // date 23-04-2021 dicussed between AP and DV
            // vm.autoPackaging.keyColumnId = null;
          } else {
            if (packagingObj) {
              const obj = {
                componentID: vm.umidDetail.refcompid,
                mfgPN: vm.umidDetail.mfgPN,
                qty: vm.umidDetail.pkgQty,
                PackagingList: _.map(packagingObj.component_packagingmst, 'alias'),
                supplier: vm.umidDetail.stockInventoryType === vm.InventoryType[0].value ? vm.umidDetail.packingSlipSupplierName : null,
                supplierPN: vm.umidDetail.supplierMFGPN
              };
              getPricingDetailForCostCategory(obj);
              vm.isPackagingPopupOpen = false;
            }
          }
        }
      }
    };

    const packagingValidation = (fromPackagingAutoComplete) => {
      vm.focusPackaginAuto = false;
      const packagingObj = _.find(vm.packagingList, (item) => item.id === vm.autoPackaging.keyColumnId);

      if (!vm.isPackagingPopupOpen) {
        vm.isPackagingPopupOpen = true;
        // for manufacture part scan pkgQty validation check
        if (vm.umidDetail.pkgQty) {
          if (packagingObj) {
            if (vm.supplierPartId) {
              if (packagingObj.sourceName !== vm.TransactionData.Packaging.TapeAndReel) {
                if (vm.umidDetail.pkgQty > vm.umidDetail.partPackagingMinQty && !vm.isEdit) {
                  if (vm.umidDetail.mfrPackagingSourceName === vm.TransactionData.Packaging.TapeAndReel) {
                    const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.LESS_QTY_OF_PART_SUPPLIER);
                    messageContent.message = stringFormat(messageContent.message, vm.umidDetail.ScanLabel, packagingObj.name);
                    const model = {
                      messageContent: messageContent,
                      btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                      canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                    };
                    DialogFactory.messageConfirmDialog(model).then(() => {
                    }, () => {
                      vm.isPackagingPopupOpen = false;
                      vm.autoPackaging.keyColumnId = null;
                      vm.focusPackaginAuto = true;
                    }).catch((error) => BaseService.getErrorLog(error));
                  } else if ((packagingObj.sourceName === vm.TransactionData.Packaging.CuteTape || packagingObj.sourceName === vm.TransactionData.Packaging.CustomReel) && vm.umidDetail.pkgQty > vm.umidDetail.partPackagingMinQty) {
                    const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SPQ_MORE_ALLOW_FOR_CT_CR);
                    messageContent.message = stringFormat(messageContent.message, vm.umidDetail.pkgQty, vm.umidDetail.partPackagingMinQty, redirectToManufacturerDetail(vm.umidDetail.mfgcodeID, vm.umidDetail.mfgName), redirectToPartDetail(vm.umidDetail.refcompid, vm.umidDetail.mfgType, vm.umidDetail.mfgPN));
                    const buttonsList = [{
                      name: 'Continue'
                    },
                    {
                      name: 'Change Count'
                    }
                    ];

                    const data = {
                      messageContent: messageContent,
                      buttonsList: buttonsList,
                      buttonIndexForFocus: 1
                    };
                    DialogFactory.dialogService(
                      CORE.MULTIPLE_BUTTONS_DIALOG_POPUP_CONTROLLER,
                      CORE.MULTIPLE_BUTTONS_DIALOG_POPUP_VIEW,
                      null,
                      data).then(() => { }, (response) => {
                        if (response === buttonsList[0].name) {
                          vm.isCountValueChange = false;
                          if (vm.umidDetail.currentBinName) {
                            vm.focusPackaginAuto = true;
                          } else {
                            setFocusAndValueSelecte('currentBinName');
                          }
                        } else if (response === buttonsList[1].name) {
                          setFocusAndValueSelecte('txtqty');
                        }
                      }, (err) => BaseService.getErrorLog(err));
                  }
                } else {
                  if (packagingObj) {
                    const obj = {
                      componentID: vm.umidDetail.refcompid,
                      mfgPN: vm.umidDetail.mfgPN,
                      qty: vm.umidDetail.pkgQty,
                      PackagingList: _.map(packagingObj.component_packagingmst, 'alias'),
                      supplier: vm.umidDetail.stockInventoryType === vm.InventoryType[0].value ? vm.umidDetail.packingSlipSupplierName : null,
                      supplierPN: vm.umidDetail.supplierMFGPN
                    };
                    getPricingDetailForCostCategory(obj);
                    vm.isPackagingPopupOpen = false;
                  }
                }
              } else {
                vm.mfrCheck(fromPackagingAutoComplete, packagingObj);
              }
            } else {
              vm.mfrCheck(fromPackagingAutoComplete, packagingObj);
            }
          } else if (vm.umidDetail.stockInventoryType !== vm.InventoryType[0].value) {
            vm.isPackagingPopupOpen = false;
            if (vm.umidDetail.pkgQty === vm.umidDetail.spq) {
              vm.autoPackaging.keyColumnId = vm.umidDetail.partMasterPackagingId;
            } else {
              vm.autoPackaging.keyColumnId = null;
            }
          } else {
            vm.isPackagingPopupOpen = false;
          }
          if (vm.umidDetail.componentUnit) {
            vm.umidDetail.pkgUnit = vm.umidDetail.pkgQty * vm.umidDetail.componentUnit;
          }
        }
        if (!vm.umidDetail.id && !vm.umidDetail.pkgQty && packagingObj.sourceName === vm.TransactionData.Packaging.TapeAndReel) {
          vm.isPackagingPopupOpen = false;
          vm.umidDetail.pkgQty = vm.umidDetail.partPackagingMinQty;
          setFocus('txtqty');
        } else {
          vm.isPackagingPopupOpen = false;
        }
      }
    };

    const getPricingDetailForCostCategory = (obj) => {
      if (obj && (vm.umidDetail && !vm.umidDetail.tentativePrice)) {
        vm.cgBusyLoading = ReceivingMaterialFactory.getPricingDetailForCostCategory().query(obj).$promise.then((pricingDetail) => {
          if (pricingDetail && pricingDetail.data) {
            setCostCategoryAutoComplete(pricingDetail.data.price);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    const setCostCategoryAutoComplete = (price) => {
      if (price && !(vm.getcomponentStockId ? vm.getcomponentStockId : parseInt($stateParams.id))) {
        const objCostCategory = _.find(vm.priceCategoryList, (data) => {
          if (data.from <= price && data.to >= price) {
            return data;
          }
        });
        vm.autoCompletePriceCategory.keyColumnId = objCostCategory ? objCostCategory.id : null;
      }
    };

    vm.setPackingUnit = () => {
      if (vm.umidDetail.pkgQty && vm.umidDetail.componentUnit) {
        vm.umidDetail.pkgUnit = vm.umidDetail.pkgQty * vm.umidDetail.componentUnit;
      } else {
        vm.umidDetail.pkgUnit = null;
      }
      if (vm.umidDetail.pkgQty) {
        packagingValidation(false);
      }
      const element = document.getElementById('txtqty');
      if (element) {
        element.scrollIntoView({
          block: 'start',
          behavior: 'smooth'
        });
      }
    };

    vm.resetScanLabel = () => {
      CustomerPrefixStorageValue = getLocalStorageValue('CustomerForPrefix');
      FromBinStorageValue = getLocalStorageValue('FromBinForUMID');
      UMIDStockInventoryType = getLocalStorageValue('UMIDStockInventoryType');
      vm.sourceData = [];
      vm.isAllocateToKit = false;
      editCostCategoryId = null;
      assemblyId = null;
      vm.kitAllocation = {};
      vm.selectPartBarcode = 'true';
      vm.supplierCode = null;
      IdOfSelectMultipleBarcode = null;
      objApproval = null;
      rfqLineItemsID = null;
      rfqAlternateID = null;
      vm.isSubAssyHighlight = false;
      vm.focusPackaginAuto = false;
      vm.isCountValueChange = false;
      vm.isCallFromMismatchPart = false;
      vm.isPackagingDisable = false;
      vm.isFromBinDisable = false;
      vm.focusCustomerAuto = false;
      vm.isFocusonCPN = false;
      vm.umidDetail = {
        prefix: UIDPrifixStorageValue && UIDPrifixStorageValue.UIDPrefix ? UIDPrifixStorageValue.UIDPrefix : vm.umidDetail.prefix,
        cpn: false,
        formatType: vm.selectPartBarcode ? vm.Transaction.FIRSTSCANLBL : vm.Transaction.FIRSTMFG,
        mfgAvailabel: false,
        customerConsign: false,
        customerID: CustomerPrefixStorageValue ? CustomerPrefixStorageValue.CustomerForPrefix ? CustomerPrefixStorageValue.CustomerForPrefix.id : 0 : 0,
        pkgQty: null,
        pkgUnit: null,
        dateCode: null,
        lotCode: null,
        specialNote: null,
        packaging: null,
        costCategoryID: null,
        binId: null,
        assyID: null,
        ScanLabel: null,
        MFGorExpiryDate: 'N',
        changeCustomer: false
      };

      if (UMIDStockInventoryType && UMIDStockInventoryType.type) {
        vm.umidDetail.stockInventoryType = UMIDStockInventoryType.type;
      }

      if (vm.umidDetail.stockInventoryType === vm.TransactionData.InventoryType[0].value) {
        if (FromBinStorageValue && FromBinStorageValue.FromBinForUMID) {
          vm.umidDetail.fromBin = FromBinStorageValue.FromBinForUMID.id;
          vm.umidDetail.fromBinName = FromBinStorageValue.FromBinForUMID.Name;
          vm.umidDetail.fromWarehouse = FromBinStorageValue.FromBinForUMID.warehousemst ? FromBinStorageValue.FromBinForUMID.warehousemst.id : FromBinStorageValue.FromBinForUMID.WarehouseID;
          vm.umidDetail.fromDepartment = FromBinStorageValue.FromBinForUMID.warehousemst ? FromBinStorageValue.FromBinForUMID.warehousemst.parentWHID : FromBinStorageValue.FromBinForUMID.parentWHID;
        }
      } else {
        vm.umidDetail.fromBin = CORE.SystemGenratedWarehouseBin.bin.OpeningBin.id;
        vm.umidDetail.fromBinName = CORE.SystemGenratedWarehouseBin.bin.OpeningBin.name;
        vm.umidDetail.fromWarehouse = CORE.SystemGenratedWarehouseBin.warehouse.OpeningWarehouse.id;
        vm.umidDetail.fromDepartment = vm.materialDeptList && vm.materialDeptList.length > 0 ? vm.materialDeptList[0].ID : null;
      }

      vm.DateTypeList[0].IsDisable = false;
      vm.isContainInPartMaster = false;
      vm.isContainInMountingGroup = false;
      vm.autoCompleteRohsStatus.keyColumnId = null;
      cpnPartList = [];
      selectedPO = {};

      autoComplete();
      initAutoCompleteSO();
      initAutoCompleteSubAssembly();
      autocompleteprice();
      initAutoCompleteAssy();
      initAutoCompleteWO();
      vm.formReceivingMaterial.$setPristine();
      vm.formReceivingMaterial.$setUntouched();
      vm.gridOptions.gridApi.grid.options.hideAddNew = true;
      $timeout(() => {
        vm.isScanLabel = false;
        $scope.$parent.vm.checkScanLabel = vm.isScanLabel;
        $scope.$broadcast(vm.autoCompletecomponent.inputName, null);
        $scope.$broadcast(vm.autoCompleteCPNComponent.inputName, null);

        $scope.$broadcast(`${vm.autoPackaging.inputName}ResetAutoComplete`, null);
        $scope.$broadcast(`${vm.autoCompletePriceCategory.inputName}ResetAutoComplete`, null);
        $scope.$broadcast(`${vm.autoCompleteRohsStatus.inputName}ResetAutoComplete`, null);
        $scope.$broadcast(`${vm.autoCompleteWO.inputName}ResetAutoComplete`, null);

        getDataElement([]);

        const myEl = angular.element(document.querySelector('input[name=\'fromBin\']'));
        myEl.focus();
      }, true);
      $scope.$emit('sendComponent', vm.umidDetail);
    };

    vm.resetKitAllocation = () => {
      vm.isAllocateToKit = false;
      vm.autoCompleteRohsStatus.keyColumnId = null;
      vm.changeAllocateToKit();
    };

    angular.element(() => {
      BaseService.currentPageForms = [vm.formReceivingMaterial];
    });

    vm.getFromBinDetail = () => {
      if (vm.umidDetail.fromBinName) {
        vm.umidDetail.fromBin = null;
        BinFactory.getBinDetailByName().query({
          name: vm.umidDetail.fromBinName
        }).$promise.then((response) => {
          if (response && response.data) {
            vm.umidDetail.fromBin = response.data.id;
            if (vm.umidDetail.binID && vm.umidDetail.binID === vm.umidDetail.fromBin) {
              checkSameBinValidation(false);
            } else {
              vm.umidDetail.fromWarehouse = response.data.warehousemst ? response.data.warehousemst.id : response.data.WarehouseID;
              vm.umidDetail.fromDepartment = response.data.warehousemst ? response.data.warehousemst.parentWHID : null;
              setLocalStorageValue('FromBinForUMID', {
                FromBinForUMID: response.data
              });
              if (vm.umidDetail.fromBin !== CORE.SystemGenratedWarehouseBin.bin.OpeningBin.id) {
                getCofCData(vm.umidDetail.fromBin, vm.umidDetail.refcompid);
              }
            }
          } else {
            if (vm.umidDetail.stockInventoryType === vm.InventoryType[0].value) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SCAN_VALID_BIN);
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              DialogFactory.messageAlertDialog(model).then((yes) => {
                if (yes) {
                  vm.umidDetail.fromBinName = null;
                  setFocus('fromBinName');
                  vm.umidDetail.fromBin = null;
                  vm.umidDetail.fromWarehouse = null;
                  vm.umidDetail.fromDepartment = null;
                }
              }).catch((error) => BaseService.getErrorLog(error));
            } else {
              vm.umidDetail.fromBin = CORE.SystemGenratedWarehouseBin.bin.OpeningBin.id;
              vm.umidDetail.fromBinName = CORE.SystemGenratedWarehouseBin.bin.OpeningBin.name;
              vm.umidDetail.fromWarehouse = CORE.SystemGenratedWarehouseBin.warehouse.OpeningWarehouse.id;
              vm.umidDetail.fromDepartment = vm.materialDeptList && vm.materialDeptList.length > 0 ? vm.materialDeptList[0].ID : null;
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.umidDetail.fromBinName = null;
        vm.umidDetail.fromBin = null;
        vm.umidDetail.fromWarehouse = null;
        vm.umidDetail.fromDepartment = null;
      }
    };

    // Check validation for transfer into same bin or not
    const checkSameBinValidation = (isToBin) => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.FROM_AND_TO_BIN_UMID_CREATION_VALIDATION);
      if (messageContent) {
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        return DialogFactory.messageAlertDialog(model).then(() => {
          if (isToBin) {
            vm.umidDetail.currentBinName = vm.umidDetail.binID = vm.umidDetail.orgRecBin = vm.umidDetail.orgRecWarehouse = vm.umidDetail.orgRecDepartment = null;
            setFocus('currentBinName');
          } else {
            vm.umidDetail.fromBinName = vm.umidDetail.fromBin = vm.umidDetail.fromWarehouse = vm.umidDetail.fromDepartment = null;
            setFocus('fromBinName');
          }
          return false;
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
      return false;
    };

    vm.getCurrentBinDetail = () => {
      if (vm.umidDetail.currentBinName) {
        vm.umidDetail.binID = null;
        BinFactory.getBinDetailByName().query({
          name: vm.umidDetail.currentBinName
        }).$promise.then((response) => {
          if (response && response.data) {
            objToBin = response.data;
            vm.umidDetail.binID = response.data.id;
            if (vm.umidDetail.fromBin && vm.umidDetail.binID === vm.umidDetail.fromBin) {
              checkSameBinValidation(true);
            } else {
              if (!vm.umidDetail.id) {
                vm.umidDetail.orgRecBin = response.data.id;
                vm.umidDetail.orgRecWarehouse = response.data.WarehouseID;
                vm.umidDetail.orgRecDepartment = response.data.warehousemst ? response.data.warehousemst.parentWHID : null;
              }
            }
          } else {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SCAN_VALID_BIN);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                vm.umidDetail.currentBinName = null;
                setFocus('currentBinName');
                vm.umidDetail.binID = null;
                if (!vm.umidDetail.id) {
                  vm.umidDetail.orgRecBin = null;
                  vm.umidDetail.orgRecWarehouse = null;
                  vm.umidDetail.orgRecDepartment = null;
                }
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.umidDetail.currentBinName = null;
        vm.umidDetail.binID = null;
        if (!vm.umidDetail.id) {
          vm.umidDetail.orgRecBin = null;
          vm.umidDetail.orgRecWarehouse = null;
          vm.umidDetail.orgRecDepartment = null;
        }
      }
    };

    vm.scanBin = ($event, callback, binType, isEnter) => {
      vm.focusPackaginAuto = false;
      $timeout(() => {
        if (isEnter) {
          if ($event.keyCode === 13) {
            $event.preventDefault();
            $event.stopPropagation();
            if (binType === 'From') {
              if (vm.selectPartBarcode) {
                if (vm.umidDetail.refcompid) {
                  setFocusAndValueSelecte('txtqty');
                } else {
                  setFocus('ScanLabel');
                }
              } else {
                setFocusByName('MFG');
              }
            } else {
              if (vm.umidDetail.stockInventoryType === vm.TransactionData.InventoryType[0].value) {
                vm.focusPriceCategory = true;
              } else {
                vm.focusPackaginAuto = true;
              }
            }
          }
        } else {
          if (callback) {
            callback();
          }
        }
      });
      /** Prevent enter key submit event */
      preventInputEnterKeyEvent($event);
    };

    vm.reScan = () => {
      vm.isScanLabel = false;
      vm.isCallFromMismatchPart = false;
      $scope.$parent.vm.checkScanLabel = vm.isScanLabel;
      vm.sourceData = [];
      editCostCategoryId = null;
      vm.supplierCode = null;
      IdOfSelectMultipleBarcode = null;
      vm.umidDetail.mfgcodeID = null;
      vm.umidDetail.refcompid = null;
      vm.umidDetail.pkgQty = null;
      vm.umidDetail.pkgUnit = null;
      vm.umidDetail.dateCode = null;
      vm.umidDetail.lotCode = null;
      vm.umidDetail.specialNote = null;
      vm.umidDetail.packaging = null;
      vm.umidDetail.costCategoryID = null;
      vm.umidDetail.binId = null;
      vm.umidDetail.ScanLabel = null;
      vm.umidDetail.componentUnit = null;
      vm.umidDetail.uomName = null;
      vm.umidDetail.sealDate = null;
      vm.umidDetail.MFGorExpiryDate = 'N';
      vm.DateTypeList[0].IsDisable = false;
      vm.umidDetail.expiryDate = null;
      vm.umidDetail.mfgDate = null;
      vm.umidDetail.mfgAvailabel = false;
      vm.umidDetail.packagingType = null;
      vm.umidDetail.sourceName = null;
      vm.umidDetail.cOfcCode = null;
      vm.umidDetail.mfrDateCodeFormatID = null;
      vm.umidDetail.mfrDateCodeFormatCategory = null;
      vm.umidDetail.mfrDateCodeFormat = null;
      vm.umidDetail.mfrDateCode = null;
      vm.umidDetail.mfrDateCodeLength = null;
      vm.umidDetail.fromDateCodeFormat = null;
      vm.umidDetail.dateCodeFormatFromValue = null;
      vm.umidDetail.dateCodeFormat = null;
      vm.umidDetail.spq = null;
      vm.umidDetail.currentBinName = null;
      vm.umidDetail.mslLevel = null;
      vm.umidDetail.pcbPerArray = null;
      vm.umidDetail.mfgPNDescription = null;
      vm.umidDetail.externalPartPackage = null;
      vm.umidDetail.partPackage = null;
      vm.isSubAssyHighlight = false;
      vm.isContainInPartMaster = false;
      vm.isContainInMountingGroup = false;
      vm.isPackagingDisable = false;
      vm.isFromBinDisable = false;
      vm.focusCustomerAuto = false;
      vm.isFocusonCPN = false;
      rfqLineItemsID = null;
      rfqAlternateID = null;
      vm.focusPackaginAuto = false;
      vm.focusPriceCategory = false;
      cpnPartList = [];
      vm.gridOptions.gridApi.grid.options.hideAddNew = true;
      vm.isCountValueChange = false;
      vm.autoCompleteRohsStatus.keyColumnId = null;
      vm.umidDetail.selfLifeDays = 0;
      vm.umidDetail.shelfLifeAcceptanceDays = 0;
      vm.umidDetail.maxShelfLifeAcceptanceDays = 0;
      vm.umidDetail.expiryInDays = 0;
      vm.umidDetail.customerConsign = false;
      vm.umidDetail.isReservedStock = false;
      vm.umidDetail.changeCustomer = false;
      vm.umidDetail.cpn = false;
      vm.umidDetail.partPackagingMinQty = null;
      $timeout(() => {
        $scope.$broadcast(vm.autoCompleteCPNComponent.inputName, null);
        $scope.$broadcast(vm.autoCompletecomponent.inputName, null);

        $scope.$broadcast(`${vm.autoPackaging.inputName}ResetAutoComplete`, null);
        $scope.$broadcast(`${vm.autoCompletePriceCategory.inputName}ResetAutoComplete`, null);
        $scope.$broadcast(`${vm.autoCompleteRohsStatus.inputName}ResetAutoComplete`, null);
        $scope.$broadcast(`${vm.autoCompleteDateCodeFormat.inputName}ResetAutoComplete`, null);

        vm.formReceivingMaterial.$setPristine();
        vm.formReceivingMaterial.$setUntouched();

        autoComplete();
        autocompleteprice();

        getDataElement([]);
        setFocus('ScanLabel');
      }, true);
      $scope.$emit('sendComponent', null);
    };

    vm.resetCustomer = () => {
      vm.umidDetail.nickName = null;
      vm.autoCompleteCustomer.keyColumnId = null;
      vm.autoCompleteAssy.keyColumnId = null;
      $scope.$broadcast(vm.autoCompleteCustomer.inputName, null);
      $scope.$broadcast(vm.autoCompleteAssy.inputName, null);
    };

    // Redirect to BOM Tab of part master
    vm.goTOBom = () => {
      BaseService.goToComponentBOMWithSubAssy(selectedPO && selectedPO['PartID'] ? selectedPO['PartID'] : 0, vm.autoCompleteSubAssebmly && vm.autoCompleteSubAssebmly.keyColumnId ? vm.autoCompleteSubAssebmly.keyColumnId : 0);
    };

    //go to manufacturer tab
    vm.goToManufacturerDetail = (id) => {
      BaseService.goToManufacturer(id);
    };

    // redirect to part master detail tab
    vm.goToComponentDetail = (mfgType, partId) => {
      if (mfgType) {
        mfgType = mfgType.toLowerCase();
      }
      BaseService.goToComponentDetailTab(mfgType, partId, USER.PartMasterTabs.Detail.Name);
    };

    const getAuthenticationOfApprovalPart = (objDetail, approvalType) => {
      if (objDetail && !vm.isApprovalPopupOpen) {
        vm.isApprovalPopupOpen = true;
        const objPartDetail = {
          AccessRole: CORE.ROLE_ACCESS.VERIFICATION_ROLE_ACCESS,
          refTableName: CORE.TABLE_NAME.COMPONENT_SID_STOCK,
          isAllowSaveDirect: false,
          approveFromPage: CORE.PAGENAME_CONSTANT[24].PageName,
          confirmationType: approvalType === vm.umidApprovalType.selfLifeDays ? CORE.Generic_Confirmation_Type.SHELF_LIFE_DAYS : CORE.Generic_Confirmation_Type.PERMISSION_WITH_PACKAGING_ALIAS,
          createdBy: vm.loginUser.userid,
          updatedBy: vm.loginUser.userid,
          informationMsg: objDetail.informationMsg
        };
        DialogFactory.dialogService(
          CORE.GENERIC_CONFIRMATION_MODAL_CONTROLLER,
          CORE.GENERIC_CONFIRMATION_MODAL_VIEW,
          objDetail.event,
          objPartDetail).then((data) => {
            vm.isApprovalPopupOpen = false;
            if (data) {
              if (approvalType === vm.umidApprovalType.selfLifeDays) {
                data.transactionType = CORE.MESSAGE_CONSTANT.GENERIC_AUTHENTICATION_REASON.CONFIRMATION_FOR_EXPIRATION_DATE;
                objDaysApproval = data;
                setFocus('btnSaveUMID');
              } else {
                let typeOfRestrict = null;
                if (objDetail.bomLineDetail && objDetail.bomLineDetail.restrictUseInBOMWithPermissionStep) {
                  typeOfRestrict = vm.CORE.RestrictWithPermissionLabel.RestrictUSEInBOMWithPermission;
                } else if (objDetail.bomLineDetail && objDetail.bomLineDetail.restrictUseInBOMExcludingAliasWithPermissionStep) {
                  typeOfRestrict = vm.CORE.RestrictWithPermissionLabel.RestrictUseInBOMExcludingAliasWithPermission;
                } else if (objDetail.componentObj && objDetail.componentObj.restrictUSEwithpermission) {
                  typeOfRestrict = vm.CORE.RestrictWithPermissionLabel.RestrictUSEWithPermission;
                } else if (objDetail.componentObj && objDetail.componentObj.restrictPackagingUseWithpermission) {
                  typeOfRestrict = vm.CORE.RestrictWithPermissionLabel.RestrictPackagingUSEWithPermission;
                }

                data.transactionType = stringFormat(CORE.MESSAGE_CONSTANT.GENERIC_AUTHENTICATION_REASON.PERMISSION_WITH_PACKAGING_ALIAS, objDetail.componentObj && objDetail.componentObj.PIDCode ? objDetail.componentObj && objDetail.componentObj.PIDCode : objDetail.bomLineDetail.PIDCode, typeOfRestrict, data.approveFromPage, data.username);

                objApproval = data;

                if (!rfqLineItemsID && objDetail && objDetail.bomLineDetail) {
                  rfqLineItemsID = objDetail.bomLineDetail.rfqLineItemsID;
                }

                if (objDetail.umidDetail) {
                  getReceivingDataAfterScan(objDetail.umidDetail, objDetail.componentObj);
                  $timeout(() => {
                    const dataElement = [];
                    _.each(objDetail.dataElementDetail, (data) => {
                      dataElement.push(data);
                    });
                    getDataElement(dataElement);
                  }, true);
                } else if (!objDetail.componentObj && objDetail.bomLineDetail) {
                  setFocusAndValueSelecte('txtqty');
                }
              }
            }
          }, () => {
            vm.isApprovalPopupOpen = false;
            if (approvalType === vm.umidApprovalType.selfLifeDays) {
              vm.umidDetail.expiryDate = '';
              setFocus('expiryDate');
            } else {
              vm.resetScanLabel();
            }
          }).catch((error) => {
            vm.isApprovalPopupOpen = false;
            return BaseService.getErrorLog(error);
          });
      }
    };

    const getNonUMIDCount = () => ReceivingMaterialFactory.getNonUMIDCount().query().$promise.then((response) => {
      if (response && response.data && response.data[0] && response.data[0].CountNonUMID) {
        $scope.$parent.vm.nonUMIDCount = response.data[0].CountNonUMID;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    vm.changeStockInventoryType = () => {
      setLocalStorageValue('UMIDStockInventoryType', {
        type: vm.umidDetail.stockInventoryType
      });


      if (vm.umidDetail.stockInventoryType === vm.TransactionData.InventoryType[1].value) {
        vm.umidDetail.fromBin = CORE.SystemGenratedWarehouseBin.bin.OpeningBin.id;
        vm.umidDetail.fromBinName = CORE.SystemGenratedWarehouseBin.bin.OpeningBin.name;
        vm.umidDetail.fromWarehouse = CORE.SystemGenratedWarehouseBin.warehouse.OpeningWarehouse.id;
        vm.umidDetail.fromDepartment = vm.materialDeptList && vm.materialDeptList.length > 0 ? vm.materialDeptList[0].ID : null;
      }
      else {
        vm.umidDetail.fromBin = null;
        vm.umidDetail.fromBinName = null;
        vm.umidDetail.fromWarehouse = null;
        vm.umidDetail.fromDepartment = null;

        if (FromBinStorageValue && FromBinStorageValue.FromBinForUMID) {
          vm.umidDetail.fromBin = FromBinStorageValue.FromBinForUMID.id;
          vm.umidDetail.fromBinName = FromBinStorageValue.FromBinForUMID.Name;
          vm.umidDetail.fromWarehouse = FromBinStorageValue.FromBinForUMID.WarehouseID;
          vm.umidDetail.fromDepartment = FromBinStorageValue.FromBinForUMID.warehousemst ? FromBinStorageValue.FromBinForUMID.warehousemst.parentWHID : FromBinStorageValue.FromBinForUMID.parentWHID;
        }
        if (vm.umidDetail.stockInventoryType === vm.TransactionData.InventoryType[2].value) {
          setFocusByName(vm.autoCompleteWO.inputName);
        }
      }
      if (vm.umidDetail.stockInventoryType !== vm.TransactionData.InventoryType[2].value) {
        $scope.$broadcast(`${vm.autoCompleteWO.inputName}ResetAutoComplete`, null);
      }
    };

    vm.goToAttribute = () => {
      BaseService.goToElementManage(CORE.AllEntityIDS.Component_sid_stock.ID);
    };

    vm.goToCofC = () => {
      BaseService.goToCofC(vm.umidDetail.id);
    };

    vm.goToNonUMIDStock = () => {
      BaseService.goToNonUMIDStockList();
    };

    const getCofCData = (fromBinId, partId) => {
      if (fromBinId && partId) {
        if (!vm.umidDetail.id) {
          vm.cgBusyLoading = ReceivingMaterialFactory.getCOFCByBinIdPartId().query({
            binId: fromBinId,
            partId: partId,
            isMfg: false
          }).$promise.then((cofcData) => {
            if (cofcData && cofcData.data) {
              vm.umidDetail.cOfcCode = cofcData.data.cofc;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
        ReceivingMaterialFactory.getCOFCByBinIdPartId().query({
          binId: fromBinId,
          partId: partId,
          isMfg: true
        }).$promise.then((cofcData) => {
          if (cofcData && cofcData.data) {
            vm.umidDetail.packingSlipSupplierName = cofcData.data.cofc;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    const manageDateCodeFormatValidation = () => {
      if (ErrorForMfgDateCodeFormat) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MFR_DATE_CODE_FORMAT_NOT_DEFINED);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        return DialogFactory.messageAlertDialog(model).then(() => {
          if (vm.isEnableDateCodeModification) {
            setFocus('btnUpdateMFRDateCode');
          } else {
            setFocus('btnSetMFRDateCode');
          }
          return true;
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        return false;
      }
    };

    vm.updateMFRDateCodeFormat = () => {
      if (!vm.isEnableDateCodeModification) {
        vm.mfrDateCodeAutoCompleteDisabled = true;
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_RIGHT_FOR_FEATURE);
        messageContent.message = stringFormat(messageContent.message, CORE.FEATURE_NAME.AllowToUpdateUMIDDateCodeFormat);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
        return;
      } else {
        vm.mfrDateCodeAutoCompleteDisabled = false;
        vm.umidDetail.fromDateCodeFormat = vm.DateCodeFormatFrom[0].key;
      }
    };
    const getDateCodeFormatData = () => {
      vm.cgBusyLoading = DCFormatFactory.getDateCodeFormatData().query({ id: vm.umidDetail.refcompid }).$promise.then((res) => {
        if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS && res.data) {
          vm.autoCompleteDateCodeFormat.keyColumnId = res.data.dateCodeFormatID ? res.data.dateCodeFormatID : (res.data.mfgCodemst && res.data.mfgCodemst.dateCodeFormatID ? res.data.mfgCodemst.dateCodeFormatID : vm.umidDetail.mfrDateCodeFormatID);
          vm.umidDetail.fromDateCodeFormat = res.data.dateCodeFormatID ? vm.DateCodeFormatFrom[2].key : (res.data.mfgCodemst && res.data.mfgCodemst.dateCodeFormatID ? vm.DateCodeFormatFrom[1].key : vm.DateCodeFormatFrom[0].key);
          if (vm.umidDetail.fromDateCodeFormat !== vm.DateCodeFormatFrom[0].key) {
            const dateCodeFormatFromValue = _.find(vm.DateCodeFormatFrom, { key: vm.umidDetail.fromDateCodeFormat });
            if (dateCodeFormatFromValue) {
              vm.umidDetail.dateCodeFormatFromValue = dateCodeFormatFromValue.value;
            }
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const manageResponseForMFRDateCodeChange = (item) => {
      if (item) {
        vm.umidDetail.mfrDateCodeFormatID = item.id;
        ErrorForMfgDateCodeFormat = vm.umidDetail.mfrDateCodeFormatID ? false : true;
        if (ErrorForMfgDateCodeFormat) {
          manageDateCodeFormatValidation();
        } else {
          const MFRDateCodeFormatValue = _.find(vm.dateCodeFormatList, { id: vm.umidDetail.mfrDateCodeFormatID });
          if (MFRDateCodeFormatValue) {
            vm.umidDetail.mfrDateCodeFormat = MFRDateCodeFormatValue.dateCodeFormat;
          }
          vm.umidDetail.mfrDateCodeLength = vm.umidDetail.mfrDateCodeFormat ? vm.umidDetail.mfrDateCodeFormat.length : 0;
          setFocus('mfgDateCode');
        }
      }
    };

    vm.setMFGDateCodeFormat = () => {
      const data = {
        mfgType: vm.umidDetail.mfgType,
        mfgPN: vm.umidDetail.mfgPN,
        partId: vm.umidDetail.refcompid,
        mfgCodeName: vm.umidDetail.mfgName,
        mfgCodeId: vm.umidDetail.mfgcodeID,
        PIDCode: vm.umidDetail.PIDCode,
        rohsIcon: vm.umidDetail.rohsIcon,
        rohsName: vm.umidDetail.rohsName,
        mfgCodeFormat: true
      };
      DialogFactory.dialogService(
        TRANSACTION.SET_DATE_CODE_POPUP_CONTROLLER,
        TRANSACTION.SET_DATE_CODE_POPUP_VIEW,
        null,
        data).then(() => {
        }, (umidDetail) => {
          if (umidDetail) {
            getDateCodeFormatData();
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.getInternalCode = () => {
      if (vm.umidDetail.mfrDateCodeFormatID) {
        if (vm.umidDetail.mfrDateCode) {
          vm.cgBusyLoading = ReceivingMaterialFactory.generateInternalDateCode().query({
            MFRDateCodeFormatId: vm.umidDetail.mfrDateCodeFormatID,
            MFRDateCode: vm.umidDetail.mfrDateCode
          }).$promise.then((internalDateCode) => {
            if (internalDateCode && internalDateCode.data) {
              const objDateCode = _.first(internalDateCode.data);
              if (objDateCode) {
                const dateCode = objDateCode.internalDateCode;
                const errorCode = objDateCode.errorMessageCode;

                if (dateCode && !errorCode) {
                  const datecodeWeek = objDateCode.dateCodeWeek;
                  const datecodeYear = objDateCode.dateCodeYear;
                  const currentWeekYear = $filter('date')(vm.currentDate, 'wwyy');
                  const currentWeek = currentWeekYear.substring(0, 2);
                  const currentYear = currentWeekYear.substring(2, 4);

                  if (parseInt(currentYear) < parseInt(datecodeYear)) {
                    const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MFGDATECODE_GRETER_CUURENTDAE);
                    const obj = {
                      messageContent: messageContent,
                      multiple: true
                    };
                    return DialogFactory.messageAlertDialog(obj).then((yes) => {
                      if (yes) {
                        vm.umidDetail.mfrDateCode = null;
                        setFocus('mfgDateCode');
                      }
                    }, () => {

                    }).catch((error) => BaseService.getErrorLog(error));
                  } else {
                    if (parseInt(currentYear) === parseInt(datecodeYear) && parseInt(currentWeek) < parseInt(datecodeWeek)) {
                      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MFGDATECODE_GRETER_CUURENTDAE);
                      const obj = {
                        messageContent: messageContent,
                        multiple: true
                      };
                      return DialogFactory.messageAlertDialog(obj).then((yes) => {
                        if (yes) {
                          vm.umidDetail.mfrDateCode = null;
                          setFocus('mfgDateCode');
                        }
                      }, () => {

                      }).catch((error) => BaseService.getErrorLog(error));
                    } else {
                      vm.umidDetail.dateCode = dateCode;
                    }
                  }
                } else {
                  if (errorCode) {
                    let messageContent = null;
                    if (errorCode === 'ERROR01') {
                      messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.INVALID_MFR_DATE_CODE);
                    }

                    if (messageContent) {
                      const model = {
                        messageContent: messageContent,
                        multiple: true
                      };
                      DialogFactory.messageAlertDialog(model).then((yes) => {
                        if (yes) {
                          vm.umidDetail.mfrDateCode = null;
                          vm.umidDetail.dateCode = null;
                          setFocus('mfgDateCode');
                        }
                      }).catch((error) => BaseService.getErrorLog(error));
                    }
                  } else {
                    vm.umidDetail.dateCode = null;
                  }
                }
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      } else {
        ErrorForMfgDateCodeFormat = true;
        manageDateCodeFormatValidation();
      }
    };

    vm.getHoldResumeStatus = (responseData) => {
      if (vm.isAllocateToKit && vm.POData && responseData.salesOrderDetailId === vm.POData.SalesOrderDetailId) {
        vm.refType = [vm.haltResumePopUp.refTypePO, vm.haltResumePopUp.refTypeKA];
        vm.cgBusyLoading = KitAllocationFactory.getHoldResumeStatus().query({
          salesOrderDetId: responseData.salesOrderDetailId,
          refType: vm.refType
        }).$promise.then((response) => {
          if (response) {
            vm.poHalt = _.find(response.data, (item) => item.refType === vm.haltResumePopUp.refTypePO);
            vm.kaHalt = _.find(response.data, (item) => item.refType === vm.haltResumePopUp.refTypeKA);
            if (vm.poHalt) {
              if (vm.poHalt.status === vm.haltResumePopUp.HaltStatus) {
                vm.isPOHalt = true;
              } else {
                vm.isPOHalt = false;
              }
            } else {
              vm.isPOHalt = false;
            }
            if (vm.kaHalt) {
              if (vm.kaHalt.status === vm.haltResumePopUp.HaltStatus) {
                vm.isKAHalt = true;
              } else {
                vm.isKAHalt = false;
              }
            } else {
              vm.isKAHalt = false;
            }
            if (vm.isPOHalt || vm.isKAHalt) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PO_KIT_ON_HOLD);
              messageContent.message = stringFormat(messageContent.message, vm.POData['Po Number'], vm.POData['Sales Order'], vm.POData['Assy ID']);
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              return DialogFactory.messageAlertDialog(model).then((yes) => {
                if (yes) {
                  vm.POData = vm.autoCompleteSO.keyColumnId = vm.kitAllocation['SO'] = vm.kitAllocation['Assy ID'] = vm.kitAllocation['PO Qty'] = vm.kitAllocation['mrpQty'] = null;
                  vm.saveBtnDisableFlag = false;
                  vm.focusPOAuto = true;
                }
              }, () => {

              }).catch((error) => {
                vm.saveBtnDisableFlag = false;
                return BaseService.getErrorLog(error);
              });
            }
          } else {
            vm.saveBtnDisableFlag = false;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.goToPackageCaseTypeList = () => {
      BaseService.goToPackageCaseTypeList();
    };

    function connectSocket() {
      socketConnectionService.on(CORE.Socket_IO_Events.HoldResumeTrans.PO_START, vm.getHoldResumeStatus);
      socketConnectionService.on(CORE.Socket_IO_Events.HoldResumeTrans.PO_STOP, vm.getHoldResumeStatus);
      socketConnectionService.on(CORE.Socket_IO_Events.HoldResumeTrans.KIT_ALLOCATION_START, vm.getHoldResumeStatus);
      socketConnectionService.on(CORE.Socket_IO_Events.HoldResumeTrans.KIT_ALLOCATION_STOP, vm.getHoldResumeStatus);
    }
    connectSocket();

    socketConnectionService.on('reconnect', () => {
      connectSocket();
    });

    function removeSocketListener() {
      socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.PO_START);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.PO_STOP);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.KIT_ALLOCATION_START);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.KIT_ALLOCATION_STOP);
    }


    // on disconnect socket
    socketConnectionService.on('disconnect', () => {
      // Remove socket listeners
      removeSocketListener();
    });

    const redirectToPartDetail = (pId, mfgType, pMfrPN) => {
      const type = mfgType ? mfgType.toLowerCase() : CORE.MFG_TYPE.MFG;
      const redirectToPartUrl = BaseService.generateComponentRedirectURL(pId, type);
      return BaseService.getHyperlinkHtml(redirectToPartUrl, pMfrPN);
    };

    const redirectToManufacturerDetail = (mfgCodeID, mfrPN) => {
      const redirectToMFGDetailUrl = WebsiteBaseUrl + CORE.URL_PREFIX + USER.ADMIN_MANUFACTURER_ROUTE + USER.ADMIN_MANAGEMANUFACTURER_ROUTE + USER.ADMIN_MANAGEMANUFACTURER_DETAIL_ROUTE.replace(':customerType', CORE.CUSTOMER_TYPE.MANUFACTURER).replace(':cid', mfgCodeID);
      return stringFormat('<a href=\'{0}\' target=\'_blank\' tabindex=\'-1\' class=\'underline\'>{1}</a>', redirectToMFGDetailUrl, mfrPN);
    };

    const redirectToPackingSlipDetail = (pId, pPackingSlipNumber) => {
      const redirectToPartUrl = BaseService.generatePackingSlipRedirectURL(TRANSACTION.PackingSlipTabType.PackingSlip, pId);
      return BaseService.getHyperlinkHtml(redirectToPartUrl, pPackingSlipNumber);
    };

    $scope.$on('RefrestUMIDDetail', () => {
      //$timeout(() => {
      //  ReceivingMaterialDetails(vm.getcomponentStockId ? vm.getcomponentStockId : $stateParams.id);
      //}, _configSelectListTimeout);
      // Above Code is commented by CP: 08-02-2022 as umid managemebnt screen data should also reload after any popup close event to get new data
      $state.go(vm.TransactionData.TRANSACTION_MANAGERECEIVINGMATERIAL_STATE, {
        id: $stateParams.id
      }, { reload: true });
    });

    // destroy page
    $scope.$on('$destroy', () => {
      removeSocketListener();
      $mdDialog.hide(false, {
        closeAll: true
      });
    });

    // event of new blank row in grid
    $scope.$on('AddNew', () => {
      $scope.addNewParentRow();
    });
  }
})();
