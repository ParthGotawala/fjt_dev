
(function () {
  'use strict';

  angular.module('app.transaction.packingSlip')
    .controller('ManagePackingSlipController', ManagePackingSlipController);

  /** @ngInject */
  function ManagePackingSlipController($scope, $rootScope, $state, $stateParams, $timeout, $q, $filter, BaseService, MasterFactory, PackingSlipFactory, DataElementTransactionValueFactory,
    ComponentFactory, DialogFactory, USER, CORE, TRANSACTION, RFQTRANSACTION, uiGridGroupingConstants, PartCostingFactory, BinFactory, PurchaseOrderFactory, ManageMFGCodePopupFactory, ReportMasterFactory, ManufacturerFactory) {
    const vm = this;
    vm.isPOCanceled = false;
    vm.isNonUMIDStock = true;
    vm.isCreateSupplierRMA = true;
    vm.isGenerateInspectionRequirmentReport = true;
    vm.CORE = CORE;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.OtherDetailTabName = CORE.OtherDetailTabName;
    vm.OtherDetailTitle = CORE.OtherDetail.TabName;
    vm.Transaction = TRANSACTION;
    vm.dataElementList = [];
    vm.fileList = {};
    vm.Entity = CORE.Entity.PackingSlip;
    const PackingSlipEntity = CORE.AllEntityIDS.PackingSlip;
    vm.entityID = PackingSlipEntity.ID;
    vm.entityName = PackingSlipEntity.Name;
    vm.trackingNumberDet = {
      trackNumber: null
    };
    vm.packingSlip = {
      packingSlipDate: new Date(),
      receiptDate: new Date(),
      packingSlipTrackNumber: [],
      totalDetailLine: 0,
      rejectedDetailLine: 0,
      packingSlipModeStatus: 'D',
      userAllowedForDuplication: false
    };
    vm.packingSlipID = $stateParams.id;
    vm.tabType = $stateParams.type;
    vm.slipType = $stateParams.slipType;
    vm.packingSlipReceivedStatus = TRANSACTION.PackingSlipReceivedStatus;
    vm.packingSlipDet = {
      refPackingSlipMaterialRecID: vm.packingSlipID,
      receivedStatus: vm.packingSlipReceivedStatus[0].value
    };
    vm.maxLengthForDescription = _maxLengthForDescription;
    vm.isUpdatable = vm.viewPackingSlipDet = true;
    vm.isView = false;
    vm.documentTabName = CORE.DocumentTabName;
    vm.packingSlipTabName = CORE.PackingSlipTabName;
    vm.selectedTabIndex = 0;
    vm.selectedTabName = vm.packingSlipTabName;
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.totalCustomerConsignedLines = [];

    vm.disablePackingSlipDetSO = vm.askSamePartWithSamePackagingValidation = vm.isReceivedQtyValueChange = vm.isopenPopup = false;

    vm.IsPackingTab = false;
    vm.IsDocumentTab = false;
    vm.isAddTrackDisable = false;
    vm.pageRefresh = false;

    vm.isScanLabel = false;
    vm.isScanLabelPS = false;
    vm.disableScanPS = false;
    let IdOfSelectMultipleBarcode = null;
    let IdOfSelectMultipleBarcodePS = null;
    vm.focusOnBinAuto = false;
    vm.focusOnPackaging = false;
    vm.saveBtnDisableFlag = false;
    vm.loginUser = BaseService.loginUser;
    vm.unitInputStep = 1;

    vm.purchaseInspectionList = vm.purchaseRequirementList = vm.poLineIDList = [];
    vm.purchaseCommentList = null;
    vm.isMaterialReceivePartInstructionDetail = true;
    vm.dropDownPackingSlipReceivedStatus = TRANSACTION.dropDownPackingSlipReceivedStatus;

    vm.packingSlipModeStatus = CORE.PackingSlipModeStatus;
    vm.disableTrackingNumber = false;

    let scanPackingSlipDetail = null;

    vm.isDisablePackingSlip = $state.current.name !== TRANSACTION.TRANSACTION_MANAGE_MATERIAL_RECEIVE_STATE;

    if (vm.tabType === TRANSACTION.MaterialReceiveTabType.PackingSlip) {
      vm.selectedTabIndex = 0;
    } else if (vm.tabType === TRANSACTION.MaterialReceiveTabType.Documents) {
      vm.selectedTabIndex = 1;
    } else if (vm.tabType === TRANSACTION.MaterialReceiveTabType.MISC) {
      vm.selectedTabIndex = 2;
    }

    vm.materialDetTitle = 'Add';
    vm.currentDate = new Date();
    vm.poDateOptions = {
      appendToBody: true,
      maxDate: vm.currentDate
    };
    vm.soDateOptions = {
      appendToBody: true,
      maxDate: vm.currentDate
    };
    vm.packingSlipDateOptions = {
      appendToBody: true,
      maxDate: vm.currentDate
    };
    vm.receiptDateOptions = {
      appendToBody: true,
      maxDate: vm.currentDate
    };
    /* called for max date validation */
    vm.getMaxDateValidation = (FromDate, ToDate) => BaseService.getMaxDateValidation(FromDate, ToDate);
    vm.getMinDateValidation = (FromDate, ToDate) => BaseService.getMinDateValidation(FromDate, ToDate);

    vm.DATE_PICKER = CORE.DATE_PICKER;
    vm.IsPickerOpen = {
      [vm.DATE_PICKER.packingSlipDate]: false,
      [vm.DATE_PICKER.receiptDate]: false,
      [vm.DATE_PICKER.poDate]: false,
      [vm.DATE_PICKER.soDate]: false
    };

    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.addTrackNumber = addTrackNumber;
    vm.disablePackingSlipDet = false;
    vm.getPackingSlipDetByPO = getPackingSlipDetByPO;
    vm.PackingSlipStatus = CORE.PackingSlipStatus;
    vm.MaterialInvoiceStatus = CORE.MaterialInvoiceStatus;
    vm.LabelConstant = CORE.LabelConstant;
    vm.checkUniquePackingSlipNumber = checkUniquePackingSlipNumber;

    /** Get supplier list */
    const getSupplierList = () => {
      const queryObj = {
        isCustomerCodeRequired: true
      };
      return MasterFactory.getSupplierList().query(queryObj).$promise.then((response) => {
        if (response && response.data) {
          _.each(response.data, (item) => item.mfgName = item.mfgCodeName);
          vm.supplierList = response.data;
        }
        return $q.resolve(vm.supplierList);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const getPackingSlipSearch = (searchObj) => PackingSlipFactory.getPackingSlipInvoice().query({
      search: searchObj
    }).$promise.then((packingSlip) => {
      if (packingSlip) {
        return packingSlip.data;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    const getAutoCompleteData = () => {
      const autocompletePromise = [getSupplierList()];
      vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
        initAutoComplete();
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const getMaterialAutoComplete = () => {
      const autocompletePromise = [getPackaging()];
      vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
        initMaterialAutoComplete();
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /** Get packing slip detail for editable record */
    const getPackingSlipDet = () => {
      if (vm.packingSlipID) {
        vm.packingSlipDisable = false;
        vm.cgBusyLoading = PackingSlipFactory.getPackingSlipDet().query({
          id: vm.packingSlipID,
          receiptType: TRANSACTION.PackingSlipReceiptType.PackingSlip
        }).$promise.then((response) => {
          if (response.data) {
            vm.packingSlip = response.data ? response.data.PackingSlip : null;
            vm.packingSlip.updatedAt = BaseService.getUIFormatedDateTimeInCompanyTimeZone(vm.packingSlip.updatedAt, _dateTimeFullTimeDisplayFormat);
            if (vm.packingSlip) {
              vm.packingSlip.isNonUMIDStockdbObject = vm.packingSlip.isNonUMIDStock;
              vm.packingSlip.mfgCode = vm.packingSlip.mfgCodemst ? vm.packingSlip.mfgCodemst.mfgCode : null;
              vm.packingSlip.internalRemark = vm.packingSlip.internalRemark || null;
              vm.packingSlip.packingSlipDate = BaseService.getUIFormatedDate(vm.packingSlip.packingSlipDate, vm.DefaultDateFormat);
              vm.packingSlip.receiptDate = BaseService.getUIFormatedDate(vm.packingSlip.receiptDate, vm.DefaultDateFormat);
              vm.packingSlip.poDate = BaseService.getUIFormatedDate(vm.packingSlip.poDate, vm.DefaultDateFormat);
              vm.packingSlip.soDate = BaseService.getUIFormatedDate(vm.packingSlip.soDate, vm.DefaultDateFormat);
              if (vm.packingSlip.refInvoice && vm.packingSlip.refInvoice.invoiceDate) {
                vm.packingSlip.refInvoice.invoiceDate = BaseService.getUIFormatedDate(vm.packingSlip.refInvoice.invoiceDate, vm.DefaultDateFormat);
              }

              vm.disablePO = vm.packingSlip.poNumber ? true : false;

              if (vm.autoCompleteLineCustomer && vm.packingSlip.customerID) {
                getSupplierMfgCodeSearch({
                  mfgcodeID: vm.packingSlip.customerID,
                  type: CORE.MFG_TYPE.MFG,
                  isCustomer: true
                });
              }

              vm.packingSlip.scanLabelPS = vm.packingSlip.scanLabel;
              vm.packingSlip.poNumberOld = vm.packingSlip.poNumber;
              vm.packingSlip.supplierSONumberOld = vm.packingSlip.supplierSONumber;
              $scope.$broadcast(vm.autoCompleteSO.inputName, vm.packingSlip.supplierSONumber);
              vm.packingSlip.packingSlipNumberOld = vm.packingSlip.packingSlipNumber;
              vm.packingSlip.lockedAt = BaseService.getUIFormatedDateTimeInCompanyTimeZone(vm.packingSlip.lockedAt, _dateTimeDisplayFormat);
              vm.packingSlip.lockedByUser = vm.packingSlip.packingSlipLockedBy && vm.packingSlip.packingSlipLockedBy.username ? vm.packingSlip.packingSlipLockedBy.username : '';

              vm.trackingNumberDet.trackNumber = null;
              vm.disableScanPS = true;
              if (vm.packingSlip.status === vm.PackingSlipStatus.Approved || vm.packingSlip.status === vm.PackingSlipStatus.Paid || vm.packingSlip.packingSlipModeStatus === 'P' ||
                (vm.packingSlip.lockStatus === vm.Transaction.CustomerPaymentLockStatus.Locked && !vm.loginUser.isUserSuperAdmin)) {
                vm.packingSlipDisable = true;
              }
              vm.packingSlip.packingSlipTrackNumber = vm.packingSlip.packingSlipTrackNumber || [];
              _.each(vm.packingSlip.packingSlipTrackNumber, (item, index) => {
                item.tempID = (index + 1);
              });
              if (vm.packingSlip.mfgCodemst) {
                vm.packingSlip.mfgFullName = vm.packingSlip.mfgCodemst.mfgCodeName;
              }
              if (vm.packingSlip.packingSlipModeStatus === 'D') {
                vm.label = CORE.OPSTATUSLABLEPUBLISH;
              } else {
                vm.label = CORE.OPSTATUSLABLEDRAFT;
              }
              vm.packingSlip.totalDetailLine = vm.totalSourceDataCount;
              vm.packingSlip.rejectedDetailLine = _.filter(vm.sourceData || [], (data) => data.receivedStatus === 'R').length;
              getAutoCompleteData();
              getMaterialAutoComplete();
              vm.checkDateValidation();
              getPackingSlipDocumentCount();
              vm.packingSlip.statusText = (_.find(CORE.InvoiceVerificationStatusOptionsGridHeaderDropdown, {
                code: vm.packingSlip.status
              }) || {
                value: CORE.InvoiceVerificationStatusOptionsGridHeaderDropdown[1].value
              }).value;
            }
            $timeout(() => {
              if (vm.sourceData && vm.sourceData.lnegth > 0) {
                vm.resetSourceGrid();
              }
            });
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    /** Get nickname for material detail*/
    const getNicknameSearch = (searchObj) => ComponentFactory.getAllAssemblyBySearch().save({ listObj: searchObj }).$promise.then((nickNameList) => {
      if (nickNameList && nickNameList.data.data) {
        vm.partSearchList = nickNameList.data.data;
        const selectedMfgCode = vm.partSearchList[0];
        if (!vm.autoCompleteAssyNickname) {
          initMaterialAutoComplete();
        }
        if (searchObj.id) {
          $timeout(() => {
            if (vm.autoCompleteAssyNickname) {
              $scope.$broadcast(vm.autoCompleteAssyNickname.inputName, selectedMfgCode);
            }
          });
        }
      } else {
        vm.partSearchList = [];
      }
      return vm.partSearchList;
    }).catch((error) => BaseService.getErrorLog(error));

    /** Get packaging for material detail*/
    const getPackaging = () => PartCostingFactory.getPackaging().query().$promise.then((packaging) => {
      if (packaging && packaging.data) {
        vm.packagingList = packaging.data;
      }
      return vm.packagingList;
    }).catch((error) => BaseService.getErrorLog(error));

    /** Get PO line for external po*/
    vm.getAllPOLine = (poLineID) => {
      vm.poLineIDList = [];
      if (vm.packingSlipDet && vm.packingSlipDet.partID) {
        const refPOLineID = poLineID ? poLineID : vm.packingSlipDet.refPOLineID;
        return PackingSlipFactory.getAllPOLineIdForExternalPO().query({ poNumber: vm.packingSlip.poNumber, partID: vm.packingSlipDet.partID, refPOLineID }).$promise.then((response) => {
          if (response && response.data) {
            if (refPOLineID && response.data.length > 0) {
              vm.autoCompletePOLine.keyColumnId = refPOLineID;
            }
            vm.poLineIDList = response.data;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      return $q.resolve(vm.poLineIDList);
    };

    /** Invoke on page initialize */
    const active = () => {
      if (vm.packingSlipID) {
        getPackingSlipDet();
        setFocus('scanLabel');
      } else {
        getAutoCompleteData();
        initMaterialAutoComplete();
        setFocus('scanLabelPS');
        if (vm.packingSlip.packingSlipModeStatus === 'D') {
          vm.label = CORE.OPSTATUSLABLEPUBLISH;
        }
      }
    };

    const getPurchaseInspectionList = (id) => {
      if (id) {
        vm.cgBusyLoading = ComponentFactory.getPurchaseInspectionRequirementByPartId().query({ partId: id, category: vm.CORE.RequirmentCategory.PurchasingAndIncomingInspectionComments.id }).$promise.then((purchaseInspection) => {
          if (purchaseInspection) {
            vm.purchaseInspectionList = _.filter(purchaseInspection.data, (data) => data.inspectionmst);
            vm.purchaseRequirementList = _.filter(purchaseInspection.data, (data) => data.inspectionmst && data.inspectionmst.requiementType === 'R');
            if (vm.packingSlip.refPurchaseOrderID && vm.packingSlipDet.isReceivedWrongPart) {
              vm.packingSlipDet.receivedStatus = vm.packingSlipReceivedStatus[2].value;
            } else {
              vm.packingSlipDet.receivedStatus = vm.isPOCanceled ? vm.packingSlipReceivedStatus[2].value : vm.purchaseRequirementList.length > 0 ? vm.packingSlipReceivedStatus[0].value : vm.packingSlipReceivedStatus[1].value;
            }
            vm.purchaseCommentList = _.map(_.map(_.filter(purchaseInspection.data || [], (data) => data.inspectionmst && data.inspectionmst.requiementType === 'C' ? data.inspectionmst : null), (item) => item.inspectionmst), 'requirement').join(_groupConcatSeparatorValue);
            vm.purchaseCommentHtml(vm.purchaseCommentList);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.purchaseInspectionList = [];
        vm.purchaseCommentList = null;
        vm.purchaseRequirementList = [];
        vm.packingSlipDet.receivedStatus = vm.isPOCanceled ? vm.packingSlipReceivedStatus[2].value : vm.packingSlipReceivedStatus[0].value;
      }
    };

    const getPurchaseRequirementCommentFromPO = (refPurchaseOrderDetID) => {
      if (refPurchaseOrderDetID) {
        vm.cgBusyLoading = PurchaseOrderFactory.getPurchaseOrderRequirement().query({ id: refPurchaseOrderDetID }).$promise.then((purchaseInspection) => {
          if (purchaseInspection && purchaseInspection.data) {
            vm.purchaseRequirementList = purchaseInspection.data;
            vm.packingSlipDet.receivedStatus = vm.isPOCanceled ? vm.packingSlipReceivedStatus[2].value : vm.purchaseRequirementList.length > 0 ? vm.packingSlipReceivedStatus[0].value : vm.packingSlipReceivedStatus[1].value;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.purchaseRequirementList = [];
        vm.packingSlipDet.receivedStatus = vm.isPOCanceled ? vm.packingSlipReceivedStatus[2].value : vm.packingSlipReceivedStatus[0].value;
      }
    };
    /** Initialize auto-complete */
    const initAutoComplete = () => {
      /** Auto-complete for supplier */
      vm.autoCompleteSupplier = {
        columnName: 'mfgName',
        controllerName: CORE.MANAGE_MFGCODE_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_MFGCODE_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.packingSlip && vm.packingSlip.mfgCodeID ? vm.packingSlip.mfgCodeID : null,
        inputName: 'Supplier',
        placeholderName: 'Supplier',
        isRequired: true,
        isAddnew: true,
        addData: {
          mfgType: CORE.MFG_TYPE.DIST,
          popupAccessRoutingState: [USER.ADMIN_MANAGESUPPLIER_DETAIL_STATE],
          pageNameAccessLabel: CORE.PageName.supplier
        },
        callbackFn: getSupplierList,
        onSelectCallbackFn: (item) => {
          if (item && item.id) {
            vm.packingSlip.mfgCodeID = item.id;
            vm.packingSlip.mfgFullName = item.mfgName;
            vm.packingSlip.mfgCode = item.mfgCode;
            //vm.getPackingSlipPartQtyByPO();
            const searchObj = {
              inputName: vm.autoCompleteCustomer.inputName,
              type: CORE.MFG_TYPE.MFG,
              isCustomer: true
            };
            getCustomerMappingList(searchObj);
            checkUniquePackingSlipNumber();
          } else {
            vm.packingSlip.mfgCodeID = null;
            vm.packingSlip.mfgCode = null;
            vm.packingSlip.mfgFullName = null;
            vm.packingSlip.customerID = null;
            if (vm.autoCompleteCustomer && vm.autoCompleteCustomer.inputName) {
              $scope.$broadcast(vm.autoCompleteCustomer.inputName, null);
            }
          }
        }
      };

      /* Auto-complete for packing slip */
      vm.autoCompletePackagingSlip = {
        columnName: 'formattedTransNumber',
        keyColumnName: 'id',
        keyColumnId: vm.selectPackingSlipNumber ? vm.selectPackingSlipNumber : null,
        inputName: 'packingSlipNumber',
        placeholderName: 'Packing Slip#',
        isRequired: false,
        isAddnew: false,
        callbackFn: function () { }, // getAllPackingSlipList,
        onSelectCallbackFn: selectPackingSlip,
        onSearchFn: function (query) {
          const searchObj = {
            receiptType: 'P',
            searchquery: query
          };
          return getPackingSlipSearch(searchObj);
        }
      };

      /** Auto-complete for MFG PN */
      vm.autoCompletecomponent = {
        columnName: 'mfgPN',
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: CORE.LabelConstant.MFG.MFGPN,
        placeholderName: CORE.LabelConstant.MFG.MFGPN,
        isAddnew: true,
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          category: CORE.PartCategory.Component,
          popupAccessRoutingState: [USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE],
          pageNameAccessLabel: CORE.LabelConstant.PART_MASTER.PageName
        },
        callbackFn: function (obj) {
          const searchObj = {
            mfgType: CORE.MFG_TYPE.MFG,
            id: obj.id,
            isContainCPN: true,
            partStatus: (!obj.id) ? CORE.PartStatusList.InActiveInternal : null
          };
          return getComponentDetailsByMfg(searchObj);
        },
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.packagingFlag = false;
            let messageContent;
            getPackingSlipDetByPO();
            if (item.id) {
              if (item.isGoodPart === CORE.PartCorrectList.CorrectPart) {
                if ((item.restrictUsePermanently || item.restrictPackagingUsePermanently) && !vm.isScanLabel) {
                  if (item.restrictUsePermanently) {
                    messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MFR_RESTRICTED_PART);
                    messageContent.message = stringFormat(messageContent.message, item.PIDCode, CORE.RestrictWithPermissionLabel.RestrictUSEWithPermanently);
                  } else {
                    messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MFR_RESTRICTED_PACKAGING_PART);
                    messageContent.message = stringFormat(messageContent.message, item.PIDCode, CORE.RestrictWithPermissionLabel.RestrictPackagingUSEWithPermanently);
                  }

                  const model = {
                    messageContent: messageContent,
                    multiple: true
                  };
                  DialogFactory.messageAlertDialog(model).then(() => {
                    vm.packingSlipDet.partID = vm.packingSlipDet.mfgPN = null;
                    $scope.$broadcast(vm.autoCompletecomponent.inputName, null);
                    vm.autoCompletecomponent.keyColumnId = null;
                    vm.autoFocusMfgPN = true;
                  });
                }
                else if ((item.restrictUSEwithpermission || item.restrictPackagingUseWithpermission) && !vm.isScanLabel) {
                  const messageContentInfo = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.FILL_DETAIL_FOR_SLIP);
                  if (item.restrictUSEwithpermission) {
                    messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PID_RECTRICTED_WITH_PERMISION);
                    messageContent.message = stringFormat(messageContent.message, item.PIDCode, CORE.RestrictWithPermissionLabel.RestrictUSEWithPermission);
                    item.informationMsg = stringFormat('{0} {1}', messageContent.message, messageContentInfo.message);
                  } else {
                    messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PID_RECTRICTED_WITH_PERMISION);
                    messageContent.message = stringFormat(messageContent.message, item.PIDCode, CORE.RestrictWithPermissionLabel.RestrictPackagingUSEWithPermission);
                    item.informationMsg = stringFormat('{0} {1}', messageContent.message, messageContentInfo.message);
                  }
                  getAuthenticationOfApprovalPart(null, item);
                }
                else {
                  vm.packingSlipDet.isLineCustConsigned = vm.packingSlip.isCustConsigned;
                  vm.packingSlipDet.isNonUMIDStock = vm.packingSlip.isNonUMIDStock;
                  if (item.partType === CORE.PartType.Other) {
                    vm.packingSlipDet.isNonUMIDStock = true;
                    vm.packingSlipDet.isLineCustConsigned = false;
                    vm.packingSlipDet.lineCustomerID = null;
                    if (vm.autoCompleteLineCustomer && vm.autoCompleteLineCustomer.inputName) {
                      $scope.$broadcast(vm.autoCompleteLineCustomer.inputName, null);
                    }
                  }
                  vm.packingSlipDet.isCPN = item.isCPN;
                  vm.packingSlipDet.partID = item.id;
                  vm.packingSlipDet.mfgPN = item.orgMfgPN;
                  vm.packingSlipDet.PIDCode = item.PIDCode;
                  vm.packingSlipDet.rohsIcon = item.rohsIcon;
                  vm.packingSlipDet.rohsName = item.rohsName;
                  vm.packingSlipDet.unit = item.unit;
                  vm.packingSlipDet.unitDisabled = vm.packingSlipDet.unit;
                  vm.packingSlipDet.uom = item.uom;
                  vm.packingSlipDet.uomName = item.unitName;
                  vm.packingSlipDet.uomNameDisabled = vm.packingSlipDet.uomName;
                  vm.packingSlipDet.mfgcodeID = item.mfgcodeID;
                  if (vm.packingSlip.customerID) {
                    vm.packingSlipDet.lineCustomerID = vm.packingSlip.customerID;
                    if (vm.autoCompleteLineCustomer) {
                      getSupplierMfgCodeSearch({
                        mfgcodeID: vm.packingSlipDet.lineCustomerID,
                        type: CORE.MFG_TYPE.MFG,
                        isCustomer: true
                      }, true);
                    }
                  } else if (vm.packingSlipDet.isCPN && vm.packingSlipDet.isLineCustConsigned) {
                    vm.packingSlipDet.lineCustomerID = vm.packingSlipDet.mfgcodeID;
                    if (vm.autoCompleteLineCustomer) {
                      getSupplierMfgCodeSearch({
                        mfgcodeID: vm.packingSlipDet.lineCustomerID,
                        type: CORE.MFG_TYPE.MFG,
                        isCustomer: true
                      }, true);
                    }
                  }
                  vm.packingSlipDet.mfgName = item.mfgCodeName;
                  vm.packingSlipDet.mfgCode = item.mfgCode;
                  vm.packingSlipDet.isReceiveBulkItem = item.isReceiveBulkItem;
                  vm.packingSlipDet.bin = null;
                  vm.packingSlipDet.warehouseDisabled = vm.packingSlipDet.warehouse = null;
                  vm.packingSlipDet.parentWarehouseDisabled = vm.packingSlipDet.parentWarehouse = null;
                  vm.packingSlipDet.packingSlipSerialNumber = null;
                  vm.packingSlipDet.poLineID = null;
                  vm.packingSlipDet.poReleaseNumber = null;
                  vm.packingSlipDet.internalRef = null;
                  vm.autoCompleteAssyNickname.keyColumnId = null;
                  vm.autoCompleteRohsStatus.keyColumnId = item.RoHSStatusID ? item.RoHSStatusID : null;
                  vm.packingSlipDet.rohsstatus = item.RoHSStatusID;
                  if (vm.packingSlip.refPurchaseOrderID) {
                    vm.autoPackaging.keyColumnId = null;
                    const poMFRDet = {
                      refPurchaseOrderID: vm.packingSlip.refPurchaseOrderID,
                      partID: vm.packingSlipDet.partID
                    };

                    vm.checkPOLinesforPart(poMFRDet, false, item);
                  }
                  else {
                    vm.getAllPOLine();
                    vm.packingSlipDet.refPOReleaseLineID = null;
                    getPurchaseInspectionList(vm.packingSlipDet.partID);
                    vm.checkvalidation(item);
                  }
                }
              } else {
                messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MFRPN_BAD_PART);
                messageContent.message = stringFormat(messageContent.message, item.PIDCode, item.isGoodPart === CORE.PartCorrectList.IncorrectPart ? CORE.PartCorrectLabelList.IncorrectPart : CORE.PartCorrectLabelList.UnknownPart);
                const model = {
                  messageContent: messageContent,
                  multiple: true
                };
                DialogFactory.messageAlertDialog(model).then(() => {
                  vm.packingSlipDet.partID = vm.packingSlipDet.mfgPN = null;
                  $scope.$broadcast(vm.autoCompletecomponent.inputName, null);
                  vm.autoCompletecomponent.keyColumnId = null;
                  vm.autoFocusMfgPN = true;
                });
              }
            }
          } else {
            vm.resetPackingSlipMaterialDet();
            setFocus('scanLabel');
          }
        },
        onSearchFn: function (query) {
          const searchObj = {
            // isGoodPart: true,
            query: query,
            mfgType: CORE.MFG_TYPE.MFG,//type: CORE.MFG_TYPE.MFG,
            inputName: vm.autoCompletecomponent.inputName,
            isContainCPN: true,
            POID: vm.packingSlip.refPurchaseOrderID ? vm.packingSlip.refPurchaseOrderID : null,
            exculdePartStatus: CORE.PartStatusList.InActiveInternal
          };
          return getComponentDetailsByMfg(searchObj);
        }
      };
    };

    function getSupplierMfgCodeSearch(searchObj, isLineLevelCustomer) {
      return ManageMFGCodePopupFactory.getMfgcodeList().query(searchObj).$promise.then((mfgcodes) => {
        vm.customersList = [];
        if (mfgcodes && mfgcodes.data) {
          if (searchObj.mfgcodeID) {
            $timeout(() => {
              if (searchObj.isCustomer) {
                if (isLineLevelCustomer && vm.autoCompleteLineCustomer && vm.autoCompleteLineCustomer.inputName) {
                  $scope.$broadcast(vm.autoCompleteLineCustomer.inputName, mfgcodes.data[0]);
                } else {
                  if (vm.autoCompleteCustomer && vm.autoCompleteCustomer.inputName) {
                    $scope.$broadcast(vm.autoCompleteCustomer.inputName, mfgcodes.data[0]);
                  }
                }
              }
            });
          }
          vm.customersList = mfgcodes.data;
        }
        return vm.customersList;
      }).catch((error) => BaseService.getErrorLog(error));
    };

    function getCustomerMappingList(searchObj, isLineLevelCustomer) {
      if (vm.packingSlip.mfgCodeID) {
        return ManufacturerFactory.getCustomerMappingList().query({ id: vm.packingSlip.mfgCodeID }).$promise.then((response) => {
          if (response && response.data && response.data.length > 0) {
            const customerList = _.map(response.data, 'MfgCodeMstCustomer');
            if (vm.packingSlipDet.isCPN && vm.packingSlipDet.mfgName && vm.packingSlipDet.mfgcodeID) {
              customerList.push({
                id: vm.packingSlipDet.mfgcodeID,
                mfgCodeName: vm.packingSlipDet.mfgName
              });
            }
            if (customerList.length === 1) {
              if (isLineLevelCustomer && vm.autoCompleteLineCustomer && vm.autoCompleteLineCustomer.inputName && vm.packingSlipDet.isLineCustConsigned) {
                $scope.$broadcast(vm.autoCompleteLineCustomer.inputName, customerList[0]);
              } else {
                if (vm.autoCompleteCustomer && vm.autoCompleteCustomer.inputName && vm.packingSlip.isCustConsigned) {
                  $scope.$broadcast(vm.autoCompleteCustomer.inputName, customerList[0]);
                }
              }
            } else {
              return customerList;
            }
          } else {
            return getSupplierMfgCodeSearch(searchObj, isLineLevelCustomer).then((response) => {
              if (!searchObj.mfgcodeID) {
                return response;
              }
            });
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        return getSupplierMfgCodeSearch(searchObj, isLineLevelCustomer).then((response) => {
          if (!searchObj.mfgcodeID) {
            return response;
          }
        });
      }
    }

    vm.autoCompleteCustomer = {
      columnName: 'mfgCodeName',
      controllerName: USER.ADMIN_CUSTOMER_ADD_MODAL_CONTROLLER,
      viewTemplateURL: USER.ADMIN_CUSTOMER_ADD_MODAL_VIEW,
      keyColumnName: 'id',
      keyColumnId: vm.packingSlip && vm.packingSlip.customerID ? vm.packingSlip.customerID : null,
      inputName: 'Customer',
      placeholderName: 'Type here to Search and Add',
      addData: {
        customerType: CORE.CUSTOMER_TYPE.CUSTOMER,
        popupAccessRoutingState: [USER.ADMIN_MANAGECUSTOMER_DETAIL_STATE],
        pageNameAccessLabel: CORE.PageName.customer
      },
      isAddnew: true,
      callbackFn: function (obj) {
        const searchObj = {
          mfgcodeID: obj.id,
          type: CORE.MFG_TYPE.MFG,
          isCustomer: true
        };
        return getCustomerMappingList(searchObj);
      },
      onSelectCallbackFn: (item) => {
        if (item) {
          vm.packingSlip.customerID = item.id;
          if (vm.autoCompletecomponent.keyColumnId) {
            vm.packingSlipDet.lineCustomerID = vm.packingSlip.customerID;
            if (vm.autoCompleteLineCustomer) {
              getSupplierMfgCodeSearch({
                mfgcodeID: vm.packingSlipDet.lineCustomerID,
                type: CORE.MFG_TYPE.MFG,
                isCustomer: true
              }, true);
            }
          }
        } else {
          vm.packingSlip.customerID = null;
          $scope.$broadcast(vm.autoCompleteCustomer.inputName, null);
          if (vm.autoCompletecomponent.keyColumnId) {
            vm.packingSlipDet.lineCustomerID = null;
            if (vm.autoCompleteLineCustomer && vm.autoCompleteLineCustomer.inputName) {
              $scope.$broadcast(vm.autoCompleteLineCustomer.inputName, null);
            }
          }
        }
      },
      onSearchFn: function (query) {
        const searchObj = {
          searchQuery: query,
          inputName: vm.autoCompleteCustomer.inputName,
          type: CORE.MFG_TYPE.MFG,
          isCustomer: true
        };
        return getCustomerMappingList(searchObj);
      }
    };

    vm.autoCompleteLineCustomer = {
      columnName: 'mfgCodeName',
      controllerName: USER.ADMIN_CUSTOMER_ADD_MODAL_CONTROLLER,
      viewTemplateURL: USER.ADMIN_CUSTOMER_ADD_MODAL_VIEW,
      keyColumnName: 'id',
      keyColumnId: vm.packingSlipDet && vm.packingSlipDet.lineCustomerID ? vm.packingSlipDet.lineCustomerID : null,
      inputName: 'Line Customer',
      placeholderName: 'Type here to Search and Add',
      addData: {
        customerType: CORE.CUSTOMER_TYPE.CUSTOMER,
        popupAccessRoutingState: [USER.ADMIN_MANAGECUSTOMER_DETAIL_STATE],
        pageNameAccessLabel: CORE.PageName.customer
      },
      isAddnew: true,
      callbackFn: function (obj) {
        const searchObj = {
          mfgcodeID: obj.id,
          type: CORE.MFG_TYPE.MFG,
          isCustomer: true
        };
        return getCustomerMappingList(searchObj, true);
      },
      onSelectCallbackFn: (item) => {
        if (item) {
          vm.packingSlipDet.lineCustomerID = item.id;
        } else {
          vm.packingSlipDet.lineCustomerID = null;
          $scope.$broadcast(vm.autoCompleteLineCustomer.inputName, null);
        }
      },
      onSearchFn: function (query) {
        const searchObj = {
          searchQuery: query,
          inputName: vm.autoCompleteLineCustomer.inputName,
          type: CORE.MFG_TYPE.MFG,
          isCustomer: true
        };
        return getCustomerMappingList(searchObj, true);
      }
    };

    vm.checkvalidation = (item) => {
      if (scanPackingSlipDetail && scanPackingSlipDetail.packaging) {
        const packagingObj = _.find(vm.packagingList, (data) => data.name === scanPackingSlipDetail.packaging);
        vm.packingSlipDet.packagingID = packagingObj && packagingObj.id ? packagingObj.id : null;
        vm.packingSlipDet.packaging = packagingObj ? packagingObj.name : null;
      }
      else {
        vm.packingSlipDet.packagingID = vm.packingSlipDet && vm.packingSlipDet.supplierPackagingId ? vm.packingSlipDet.supplierPackagingId : item.packagingID;
        const packagingObj = _.find(vm.packagingList, (data) => data.id === vm.packingSlipDet.packagingID);
        vm.packingSlipDet.packaging = packagingObj ? packagingObj.name : null;
      }
      vm.packingSlipDet.spq = vm.packingSlipDet && vm.packingSlipDet.supplierSpq ? vm.packingSlipDet.supplierSpq : (item.umidSPQ ? item.umidSPQ : 0);
      vm.packingSlipDet.spqDisabled = vm.packingSlipDet.spq;
      vm.packingSlipDet.packageQty = vm.packingSlipDet && vm.packingSlipDet.supplierPackageQty ? vm.packingSlipDet.supplierPackageQty : (item.packageQty || (item.spq || 0));
      vm.packingSlipDet.packageQtyDisabled = vm.packingSlipDet.packageQty;
      vm.packingSlipDet.partType = item.partType;
      vm.getPackingSlipPartQtyByPO();
      checkPackagingBySPQ('Packaging');
      if (scanPackingSlipDetail && scanPackingSlipDetail.pkgQty) {
        vm.packingSlipDet.orderedQty = vm.packingSlipDet.receivedQty = vm.packingSlipDet.packingSlipQty = scanPackingSlipDetail.pkgQty;
      }
      initMaterialAutoComplete();
    };

    vm.checkPOLinesforPart = (poMFRDet, isMultipleMFR, item) => PackingSlipFactory.checkPOLinesforPart().query(poMFRDet).$promise.then((response) => {
      if (response.data) {
        if (response.data.poReleaseLineList && response.data.poReleaseLineList.length === 1) {
          //If Part has single release line then auto-fill release detail
          const item = response.data.poReleaseLineList[0];
          if (item.poLineWorkingStatus === vm.CORE.PO_Line_WorkingStatus.Open.id) {
            assignReleaseLineDetailToMaterialDetail(item);
            if (item) {
              vm.checkvalidation(item);
            }
          } else {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PO_LINE_STATUS_IS_CLOSED);
            messageContent.message = stringFormat(messageContent.message, redirectToPartDetail(item.partId, item.PIDCode), redirectToPOAnchorTag(vm.packingSlip.refPurchaseOrderID, vm.packingSlip.poNumber));
            const obj = {
              messageContent: messageContent,
              multiple: true
            };
            return DialogFactory.messageAlertDialog(obj).then((yes) => {
              if (yes) {
                vm.resetPackingSlipMaterialDet();
              }
            }, () => {
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }
        else if ((response.data.poReleaseLineList && response.data.poReleaseLineList.length > 0) || response.data.totalReleaseCount > 0) {
          //If Part has multiple release line then open release line pop-up
          openPOReleaseLinePopup(null, vm.packingSlipDet.partID);
          if (item) {
            vm.checkvalidation(item);
          }
        }
        else {
          //If Part not found then ask for received wrong part
          vm.packingSlipDet.refPOReleaseLineID = null;
          if (isMultipleMFR) {
            selectPartPopup(poMFRDet.mfgPN);
          } else {
            confirmationReceivedWrongPart(item ? item : null);
          }
        }
      }
    }).catch((error) => { BaseService.getErrorLog(error); });

    const confirmationReceivedWrongPart = (item) => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PART_DO_NOT_EXIST_IN_PO_LINE);
      messageContent.message = stringFormat(messageContent.message, redirectToPartDetail(vm.packingSlipDet.partID, vm.packingSlipDet.PIDCode), redirectToPOAnchorTag(vm.packingSlip.refPurchaseOrderID, vm.packingSlip.poNumber));
      const model = {
        messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(model).then((yes) => {
        if (yes) {
          //isWrongPart-ConfirmedByUser
          vm.packingSlipDet.isReceivedWrongPart = true;
          vm.packingSlipDet.receivedStatus = vm.packingSlipReceivedStatus[2].value;
          getPurchaseInspectionList(vm.packingSlipDet.partID);
          setFocus('packingSlipSerialNumber');
          if (item) {
            vm.checkvalidation(item);
          }
        }
      }, () => {
        vm.resetPackingSlipMaterialDet();
      }, (error) => BaseService.getErrorLog(error));
    };

    const assignReleaseLineDetailToMaterialDetail = (item) => { //here
      vm.packingSlipDet.isLineCustConsigned = item.isLineCustConsigned ? true : false;
      vm.packingSlipDet.lineCustomerID = item.lineCustomerID;
      if (vm.autoCompleteLineCustomer && vm.packingSlipDet.lineCustomerID) {
        getSupplierMfgCodeSearch({
          mfgcodeID: vm.packingSlipDet.lineCustomerID,
          type: CORE.MFG_TYPE.MFG,
          isCustomer: true
        }, true);
      }
      vm.packingSlipDet.partType = item.partType;
      vm.packingSlipDet.isNonUMIDStock = vm.packingSlip.isNonUMIDStock ? vm.packingSlip.isNonUMIDStock : item.isNonUMIDStock ? true : false;
      if (vm.packingSlipDet.partType === CORE.PartType.Other) {
        vm.packingSlipDet.isNonUMIDStock = true;
      }
      vm.packingSlipDet.isReceivedWrongPart = false;
      vm.packingSlipDet.partID = item.partId ? item.partId : null;
      vm.autoCompletecomponent.keyColumnId = item.partId;
      $scope.$broadcast(vm.autoCompletecomponent.inputName, `(${item.mfgCode}) ${item.mfgPN}`);
      vm.packingSlipDet.PIDCode = item.PIDCode;
      vm.packingSlipDet.mfgcodeID = item.mfgcodeID;
      vm.packingSlipDet.mfgPN = item.mfgPN;
      vm.packingSlipDet.mfgCode = item.mfgCode;
      vm.packingSlipDet.mfgName = item.mfgName;
      vm.packingSlipDet.spq = item.umidSPQ ? item.umidSPQ : 0;
      vm.packingSlipDet.spqDisabled = vm.packingSlipDet.spq;
      vm.packingSlipDet.packageQty = item.spq ? item.spq : 0;
      vm.packingSlipDet.packageQtyDisabled = vm.packingSlipDet.packageQty;
      vm.packingSlipDet.unit = item.unit ? parseFloat(item.unit) : 1;
      vm.packingSlipDet.unitDisabled = vm.packingSlipDet.unit;
      vm.packingSlipDet.uom = item.uom;
      vm.packingSlipDet.uomName = item.uomText ? item.uomText : 'EACH'; // need to confirm
      vm.packingSlipDet.uomNameDisabled = vm.packingSlipDet.uomName;
      if (vm.autoPackaging && vm.autoPackaging.keyColumnId) {
        vm.autoPackaging.keyColumnId = item.packagingID;
      }
      vm.packingSlipDet.packagingID = item.packagingID;
      vm.packingSlipDet.refPurchaseOrderDetID = item.refPurchaseOrderDetID;
      vm.packingSlipDet.refPOReleaseLineID = item.id;
      vm.packingSlipDet.refPOLineID = item.lineID;
      vm.packingSlipDet.orderedQty = parseInt(item.poLineQty);
      vm.packingSlipDet.supplierPN = item.supplierPN ? item.supplierPN : null;
      vm.packingSlipDet.supplierPNDisabled = vm.packingSlipDet.supplierPN;
      vm.packingSlipDet.supplierMFGPNID = item.supplierPNId ? item.supplierPNId : null;
      vm.packingSlipDet.supplierCode = item.supplierCode ? item.supplierCode : null;
      vm.packingSlipDet.supplierCodeDisabled = vm.packingSlipDet.supplierCode;
      vm.packingSlipDet.poReleaseNumber = item.releaseNumber;
      vm.autoCompleteRohsStatus.keyColumnId = item.poLineRoHSID ? item.poLineRoHSID : item.RoHSStatusID;
      vm.packingSlipDet.rohsstatus = vm.autoCompleteRohsStatus.keyColumnId;
      vm.packingSlipDet.poLineID = item.lineID;
      vm.packingSlipDet.internalRef = item.internalRef;
      vm.getNicknameFromInternalRefForSysgenpo();
      vm.popurchaseInspectionComment = item.lineComment;
      vm.purchaseCommentHtml(item.lineComment);
      vm.packingSlipDet.poDescription = item.partDescription;
      vm.packingSlipDet.poDescriptionDisabled = vm.packingSlipDet.poDescription;
      vm.packingSlipDet.poInternalComment = item.internalLineComment;
      vm.packingSlipDet.poInternalCommentDisabledfield = item.internalLineComment;
      vm.packingSlipDet.rohsIcon = item.rohsIcon;
      vm.packingSlipDet.supplierRohsName = item.supplierRohsName;
      vm.packingSlipDet.supplierRohsIcon = item.supplierRohsIcon;
      getPurchaseRequirementCommentFromPO(vm.packingSlipDet.refPurchaseOrderDetID);
      //getPurchaseInspectionList(vm.packingSlipDet.partID);
      setFocus('packingSlipSerialNumber');
    };

    const initMaterialAutoComplete = () => {
      /** Auto-complete for Nick name */
      vm.autoCompleteAssyNickname = {
        columnName: 'nickName',
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'nickName',
        placeholderName: 'NickName',
        isRequired: false,
        isAddnew: false,
        isUppercaseSearchText: true,
        callbackFn: (obj) => {
          const searchObj = {
            id: obj.id
          };
          return getNicknameSearch(searchObj);
        },
        onSelectCallbackFn: (item) => {
          if (item || (vm.autoCompleteAssyNickname && vm.autoCompleteAssyNickname.searchText)) {
            vm.packingSlipDet.nickname = item && item.nickName ? item.nickName : vm.autoCompleteAssyNickname.searchText;
          } else {
            vm.packingSlipDet.nickname = null;
            $scope.$broadcast(vm.autoCompleteAssyNickname.inputName, null);
          }
        },
        onSearchFn: (query) => {
          const searchObj = {
            query: query
          };
          return getNicknameSearch(searchObj);
        }
      };

      vm.autoPackaging = {
        columnName: 'name',
        keyColumnName: 'id',
        controllerName: CORE.MANAGE_PACKAGING_TYPE_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_PACKAGING_TYPE_MODAL_VIEW,
        keyColumnId: vm.packingSlipDet && vm.packingSlipDet.packagingID ? vm.packingSlipDet.packagingID : null,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_PACKAGING_TYPE_STATE],
          pageNameAccessLabel: CORE.PageName.packaging_type
        },
        inputName: 'Packaging',
        placeholderName: 'Packaging',
        isAddnew: true,
        callbackFn: getPackaging,
        onSelectCallbackFn: (item) => {
          if (item) {
            if (item.id === TRANSACTION.TAPEANDREELID && !vm.isEditLine /*vm.packingSlipDet.packagingID !== item.id*/) {
              vm.isReceivedQtyValueChange = true;
            }
            vm.isEditLine = false;
            vm.packingSlipDet.packagingID = item.id;
            vm.packingSlipDet.packaging = item.name;
            vm.getPackingSlipPartQtyByPO();
            checkPackagingBySPQ('ReceivedQty');
            if (!vm.isopenPopup) {
              checkDuplicatePartWithSamePackaging(true);
            }
            validationForSPQ();
          } else {
            vm.askSamePartWithSamePackagingValidation = false;
          }
          vm.focusOnPackaging = false;
        }
      };

      if (!vm.packingSlipDet.refPurchaseOrderDetID) {
        vm.autoCompletePOLine = {
          columnName: 'POLine',
          keyColumnName: 'refPOLineID',
          keyColumnId: null,
          inputName: 'poLineID',
          placeholderName: 'PO Line#',
          callbackFn: vm.getAllPOLine,
          onSelectCallbackFn: (item) => {
            if (item && item.id) {
              vm.packingSlipDet.packagingID = vm.packingSlipDet.EditPackaging ? vm.packingSlipDet.EditPackaging : item.packagingID;
              vm.packingSlipDet.packaging = vm.packingSlipDet.EditPackagingName ? vm.packingSlipDet.EditPackagingName : item.name;
              if (vm.autoPackaging) {
                vm.autoPackaging.keyColumnId = vm.packingSlipDet.EditPackaging ? vm.packingSlipDet.EditPackaging : vm.packingSlipDet.packagingID;
              }
              vm.packingSlipDet.orderedQty = item.orderedQty;
              vm.isDisabledOrderQty = item.TotalReleaseLine !== 1;
              vm.autoCompletePOLine.keyColumnId = vm.packingSlipDet.poLineID = item.refPOLineID;
              vm.packingSlipDet.isLineCustConsigned = item.isLineCustConsigned ? true : false;
              vm.packingSlipDet.isNonUMIDStock = item.isNonUMIDStock ? true : false;
              vm.packingSlipDet.lineCustomerID = item.lineCustomerID;
              if (vm.packingSlipDet.lineCustomerID && vm.autoCompleteLineCustomer) {
                getSupplierMfgCodeSearch({
                  mfgcodeID: vm.packingSlipDet.lineCustomerID,
                  type: CORE.MFG_TYPE.MFG,
                  isCustomer: true
                }, true);
              }
              vm.getPackingSlipPartQtyByPO();
            } else {
              vm.autoCompletePOLine.keyColumnId = vm.packingSlipDet.packagingID = vm.packingSlipDet.packaging = vm.packingSlipDet.lineCustomerID = vm.packingSlipDet.poLineID = vm.packingSlipDet.orderedQty = vm.packingSlipDet.receivedQty = vm.packingSlipDet.packingSlipQty = vm.packingSlipDet.totalReceivedQtyDisabled = vm.packingSlipDet.totalReceivedQty = vm.packingSlipDet.pendingQtyDisabled = vm.packingSlipDet.pendingQty = null;
              if (vm.autoPackaging) {
                vm.autoPackaging.keyColumnId = null;
              }
              if (vm.autoCompleteLineCustomer && vm.autoCompleteLineCustomer.inputName) {
                $scope.$broadcast(vm.autoCompleteLineCustomer.inputName, null);
              }
              vm.isDisabledOrderQty = vm.packingSlipDet.isLineCustConsigned = vm.packingSlipDet.isNonUMIDStock = false;
            }
          }
        };
      }
    };

    const selectPackingSlip = (item) => {
      if (item) {
        if (vm.tabType === TRANSACTION.MaterialReceiveTabType.InvoiceVerification) {
          $state.go(TRANSACTION.TRANSACTION_MANAGE_MATERIAL_RECEIVE_STATE, {
            type: TRANSACTION.MaterialReceiveTabType.InvoiceVerification,
            id: item.id
          });
        } else {
          $state.go(TRANSACTION.TRANSACTION_MANAGE_MATERIAL_RECEIVE_STATE, {
            type: TRANSACTION.MaterialReceiveTabType.PackingSlip,
            id: item.id
          });
        }
        $timeout(() => {
          vm.autoCompletePackagingSlip.keyColumnId = null;
        }, true);
      }
    };

    /**
     * Get MFG PN List
     * @param {any} searchObj
     */
    const getComponentDetailsByMfg = (searchObj) => ComponentFactory.getComponentMFGAliasSearch().query({
      listObj: searchObj
    }).$promise.then((component) => {
      _.each(component.data.data, (comp) => {
        comp.ismfgpn = true;
      });
      if (searchObj.id || searchObj.id === 0) {
        $timeout(() => {
          $scope.$broadcast(vm.autoCompletecomponent.inputName, component.data.data[0]);
        });
      }
      return component.data.data;
    }).catch((error) => BaseService.getErrorLog(error));

    /** Redirect to supplier page */
    vm.goToSupplier = () => BaseService.openInNew(USER.ADMIN_SUPPLIER_STATE, {});
    /** Redirect to bin page */
    vm.goToBinList = () => BaseService.openInNew(TRANSACTION.TRANSACTION_BIN_STATE, {});

    vm.goToWHList = () => BaseService.openInNew(TRANSACTION.TRANSACTION_WAREHOUSE_STATE, {});

    vm.goToSupplierPartList = () => BaseService.goToSupplierPartList();

    /** Column definition for material grid */
    vm.sourceHeader = [
      {
        field: 'Action',
        cellClass: 'layout-align-center-center',
        displayName: 'Action',
        width: '100',
        cellTemplate: '<grid-action-view grid="grid" row="row" row-entity="row.entity"></grid-action-view>',
        enableFiltering: false,
        enableSorting: false,
        exporterSuppressExport: true,
        pinnedLeft: true
      },
      {
        field: 'packingSlipSerialNumber',
        width: '90',
        displayName: 'PS Line#',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
        reeAggregationType: uiGridGroupingConstants.aggregation.SUM,
        footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right" >{{grid.appScope.$parent.vm.getTotalLineItems()}}</div>'
      },
      {
        field: 'refPOLineID',
        width: '105',
        displayName: vm.LabelConstant.PACKING_SLIP.POLineID,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>'
      },
      {
        field: 'receivedStatusValue',
        displayName: 'Received Status',
        width: '185',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" \
                              ng-class="{\'label-success\':row.entity.receivedStatus === \'A\', \
                                  \'light-green-bg\':row.entity.receivedStatus === \'AD\', \
                                  \'label-warning\':row.entity.receivedStatus === \'P\', \
                                  \'label-danger\':row.entity.receivedStatus === \'R\'}"> \
                                        {{ COL_FIELD }}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.dropDownPackingSlipReceivedStatus
        },
        ColumnDataType: 'StringEquals',
        enableFiltering: true,
        enableSorting: false
      },
      {
        field: 'internalRef',
        width: '150',
        displayName: 'Internal Ref#',
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>'
      },
      {
        field: 'nickname',
        width: '150',
        displayName: 'Nickname',
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>'
      },
      {
        field: 'mfgName',
        width: 200,
        displayName: CORE.LabelConstant.MFG.MFG,
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>'
      },
      {
        field: 'mfgPN',
        displayName: CORE.LabelConstant.MFG.MFGPN,
        cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link ng-if="row.entity.partID" \
                            component-id="row.entity.partID" \
                            label="grid.appScope.$parent.vm.CORE.LabelConstant.MFG.MFGPN" \
                            value="row.entity.mfgPN" \
                            is-copy="true" \
                            is-custom-part="row.entity.isCustom || row.entity.isCustomSupplier "\
                            cust-part-number="row.entity.custAssyPN"\
                            rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.rohsIcon" \
                            rohs-status="row.entity.rohsName" \
                            supplier-name="(row.entity.isCustom || row.entity.isCustomSupplier) ? null :(grid.appScope.$parent.vm.packingSlip && grid.appScope.$parent.vm.packingSlip.mfgCodemst ? grid.appScope.$parent.vm.packingSlip.mfgCodemst.mfgName : null)" \
                            is-search-findchip="true"></common-pid-code-label-link></div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
        allowCellFocus: false
      },
      {
        field: 'packaging',
        width: '120',
        displayName: 'Packaging',
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>'
      },
      {
        field: 'isLineCustConsignedValue',
        displayName: vm.LabelConstant.PACKING_SLIP.CustomerConsigned,
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span  ng-class="{\'label-box label-warning\':(!row.entity.isLineCustConsigned),\
                        \'label-box label-success\':(row.entity.isLineCustConsigned)}"> \
                            {{COL_FIELD}}'
          + '</span>'
          + '</div>',
        width: '170',
        allowCellFocus: false,
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: CORE.CustomerConsignedDropDown
        },
        ColumnDataType: 'StringEquals',
        enableFiltering: true,
        enableSorting: false
      },
      {
        field: 'customerName',
        displayName: vm.LabelConstant.PACKING_SLIP.Customer,
        cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-if="row.entity.lineCustomerID && row.entity.customerName"> <span><a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-click="grid.appScope.$parent.vm.goToCustomer(row.entity.lineCustomerID);$event.preventDefault();">{{COL_FIELD}}</a>\
                                    </span>\
                                    <copy-text label="\'Customer\'" text="row.entity.customerName"></copy-text></div>',
        width: '220',
        enableCellEdit: false,
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'isNonUMIDStockValue',
        displayName: vm.LabelConstant.PACKING_SLIP.NonUMIDStock,
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span  ng-class="{\'label-box label-warning\':(!row.entity.isNonUMIDStock),\
                        \'label-box label-success\':(row.entity.isNonUMIDStock)}"> \
                            {{COL_FIELD}}'
          + '</span>'
          + '</div>',
        width: '170',
        allowCellFocus: false,
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: CORE.NonUmidStockDropDown
        },
        ColumnDataType: 'StringEquals',
        enableFiltering: true,
        enableSorting: false
      }, {
        field: 'orderedQty',
        width: 120,
        displayName: vm.LabelConstant.PACKING_SLIP.OrderedQty,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>'
        // treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
        // footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right" >{{grid.appScope.$parent.vm.getQtySum("orderedQty")}}</div>'
      },
      {
        field: 'TotalUMIDCount',
        width: '120',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
        displayName: 'Created UMID'
      },
      {
        field: 'receivedQty',
        width: 150,
        displayName: vm.LabelConstant.PACKING_SLIP.ReceivedQty,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right rec-qty">{{COL_FIELD | numberWithoutDecimal}}</div>',
        treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
        footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right rec-qty" >{{grid.appScope.$parent.vm.getQtySum("receivedQty")}}</div>'
      }, {
        field: 'allReceivedQty',
        width: 150,
        displayName: 'All Received Qty',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right rec-qty">{{COL_FIELD}}</div>'
      }, {
        field: 'packingSlipQty',
        width: 120,
        displayName: vm.LabelConstant.PACKING_SLIP.PackingSlipQty,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
        treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
        footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right" >{{grid.appScope.$parent.vm.getQtySum("packingSlipQty")}}</div>'
      },
      {
        field: 'totalReceivedQty',
        width: 120,
        displayName: 'Qty Received against PO',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">\
                                        <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-if="row.entity.totalReceivedQty > 0" ng-click="grid.appScope.$parent.vm.showPackingSlipSummaryDetails(row.entity);$event.preventDefault();">{{ COL_FIELD | numberWithoutDecimal}}</a>\
                                        <span ng-if="row.entity.totalReceivedQty <= 0">{{ COL_FIELD | numberWithoutDecimal}}</span> \
                                    </div>'
        // treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
        // footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right" >{{grid.appScope.$parent.vm.getQtySum("totalReceivedQty")}}</div>'
      },
      {
        field: 'pendingQty',
        width: 150,
        displayName: 'Backorder Qty',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-class="{\'grid-cell-text-danger\': COL_FIELD > 0}">{{COL_FIELD | numberWithoutDecimal}}</div>'
        // treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
        //  footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right" ng-class="{\'grid-cell-text-danger\': grid.appScope.$parent.vm.totalpendingQty > 0}">{{grid.appScope.$parent.vm.getQtySum("pendingQty")}}</div>'
      },
      {
        field: 'disputeQty',
        width: 150,
        displayName: 'Disputed Qty',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-class="{\'grid-cell-text-danger\': COL_FIELD < 0}">{{COL_FIELD | numberWithoutDecimal}}</div>'
      },
      {
        field: 'bin',
        width: '150',
        displayName: CORE.LabelConstant.TransferStock.Bin,
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>'
      },
      {
        field: 'warehouse',
        width: '150',
        displayName: CORE.LabelConstant.TransferStock.WH,
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>'
      },
      {
        field: 'parentWarehouse',
        width: 200,
        displayName: CORE.LabelConstant.TransferStock.ParentWH,
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>'
      },
      {
        field: 'unit',
        width: '80',
        displayName: 'Unit',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | unit }}</div>'
      },
      {
        field: 'uomName',
        width: '160',
        displayName: 'UOM',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
      },
      {
        field: 'scanLabel',
        width: '170',
        displayName: 'Label String',
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>'
      },
      {
        field: 'poReleaseNumber',
        width: '160',
        displayName: 'PO Release#',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>'
      },
      {
        field: 'supplierCode',
        width: 200,
        displayName: CORE.LabelConstant.MFG.Supplier,
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>'
      },
      {
        field: 'supplierPN',
        displayName: CORE.LabelConstant.MFG.SupplierPN,
        cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link ng-if="row.entity.supplierMFGPNID" \
                            component-id="row.entity.supplierMFGPNID" \
                            label="grid.appScope.$parent.vm.CORE.LabelConstant.MFG.SupplierPN" \
                            value="row.entity.supplierPN" \
                            is-custom-part="row.entity.isCustom || row.entity.isCustomSupplier "\
                            cust-part-number="row.entity.custAssyPN"\
                            is-copy="true" \
                            rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.supplierRohsIcon" \
                            rohs-status="row.entity.supplierRohsName" \
                            supplier-name="grid.appScope.$parent.vm.packingSlip && grid.appScope.$parent.vm.packingSlip.mfgCodemst ? grid.appScope.$parent.vm.packingSlip.mfgCodemst.mfgName : null" \
                            is-search-findchip="true"></common-pid-code-label-link></div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
        allowCellFocus: false
      },
      {
        field: 'purchaseRequirementCount',
        displayName: 'Purchase Requirement Count',
        width: '150',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>'
      },
      {
        field: 'prohsName',
        displayName: 'RoHS Requirement',
        width: '160',
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>'
      },
      {
        field: 'totalLines',
        displayName: vm.LabelConstant.PACKING_SLIP.TotalLines,
        width: '100',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>'
      },
      {
        field: 'pendingLines',
        displayName: vm.LabelConstant.PACKING_SLIP.PendingLines,
        width: '85',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>'
      },
      {
        field: 'acceptedWithDeviationLines',
        displayName: vm.LabelConstant.PACKING_SLIP.AcceptedWithDeviationLines,
        width: '125',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>'
      },
      {
        field: 'rejectedLines',
        displayName: vm.LabelConstant.PACKING_SLIP.RejectedLines,
        width: '85',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>'
      },
      {
        field: 'acceptedLines',
        displayName: vm.LabelConstant.PACKING_SLIP.AcceptedLines,
        width: '85',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>'
      },
      {
        field: 'rejectedPurchaseRequirementCount',
        displayName: 'Rejected Purchase Requirement Count',
        width: '160',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>'
      },
      {
        field: 'commentCount',
        displayName: 'Purchase Comment Count',
        width: '140',
        cellTemplate: '<a class="ui-grid-cell-contents grid-cell-text-right cursor-pointer" ng-class="{\'cursor-not-allow\':row.entity.commentCount==0}" ng-click="grid.appScope.$parent.vm.viewPurchaseComments(row.entity,$event)">{{COL_FIELD | numberWithoutDecimal}}</a>'
      },
      {
        field: 'remark',
        displayName: 'Line Comment',
        width: '130',
        cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.remark" ng-click="grid.appScope.$parent.vm.showDescriptionPopUp(row.entity, $event, \'Line Comment\')"> \
                                View \
                            </md-button>'
      },
      {
        field: 'partDescription',
        displayName: 'PO Description',
        width: '130',
        cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.partDescription" ng-click="grid.appScope.$parent.vm.showDescriptionPopUp(row.entity, $event, \'PO Description\')"> \
                                View \
                            </md-button>'
      },
      {
        field: 'internalLineComment',
        displayName: 'PO Line Internal Notes',
        width: '130',
        cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.internalLineComment" ng-click="grid.appScope.$parent.vm.showDescriptionPopUp(row.entity, $event, \'PO Internal Comment\')"> \
                                View \
                            </md-button>'
      },
      {
        field: 'internalLineComment',
        displayName: 'Part Purchase Comment',
        width: '130',
        cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.purchaseInspectionComment" ng-click="grid.appScope.$parent.vm.showDescriptionPopUp(row.entity, $event, \'Part Purchase Comment\')"> \
                                View \
                            </md-button>'
      },
      {
        field: 'updatedAt',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableFiltering: false
      },
      {
        field: 'updatedByName',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true
      },
      {
        field: 'updatedbyRole',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true
      },
      {
        field: 'createdAt',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableFiltering: false
      },
      {
        field: 'createdByName',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        type: 'StringEquals',
        enableFiltering: true
      },
      {
        field: 'createdbyRole',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }
    ];

    /** Paging detail for material grid */
    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [
          ['packingSlipSerialNumber', 'ASC']
        ],
        SearchColumns: [],
        pageName: CORE.PAGENAME_CONSTANT[7].PageName,
        packingSlipID: vm.packingSlipID
      };
    };
    initPageInfo();


    /** Grid options for material grid */
    vm.gridOptions = {
      showColumnFooter: true,
      enableRowHeaderSelection: true,
      enableFullRowSelection: false,
      enableRowSelection: true,
      multiSelect: true,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      allowToExportAllData: true,
      exporterCsvFilename: 'Packing Slip Material.csv',
      exporterAllDataFn: () => {
        const pagingInfoOld = _.clone(vm.pagingInfo);
        pagingInfoOld.pageSize = 0;
        pagingInfoOld.Page = 1;
        vm.gridOptions.isExport = pagingInfoOld.isExport = true;
        return PackingSlipFactory.getPackingSlipMaterialList().query(pagingInfoOld).$promise.then((response) => {
          if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            if (response && response.data && response.data.packingSlipMaterialList) {
              setDataAfterGetAPICall(response.data);
              return response.data.packingSlipMaterialList;
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      },
      CurrentPage: CORE.PAGENAME_CONSTANT[45].PageName,
      rowTemplate: '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.uid" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader, \'cm-halted-row-grid-background-color\': (row.entity.receivedStatus === grid.appScope.$parent.vm.packingSlipReceivedStatus[2].value) }" role="gridcell" ui-grid-cell="">'
    };

    function setDataAfterGetAPICall(response) {
      vm.sourceData = response.packingSlipMaterialList;
      getPackingSlipDetByPO(true); // to check for system-generated PO
      vm.disablePackingSlipDetSO = true;
      vm.totalSourceDataCount = response.Count;

      _.map(vm.sourceData, (data) => {
        data.isNonUMIDStockDBObject = data.isNonUMIDStock ? true : false;
        data.isDisabledUpdate = false;
        data.isDisabledDelete = false;
        data.isRowSelectable = true;
        if (vm.packingSlip && (vm.packingSlip.status === vm.PackingSlipStatus.Approved || vm.packingSlip.status === vm.PackingSlipStatus.Paid || vm.packingSlip.packingSlipModeStatus === CORE.PackingSlipModeStatus[1].ID)) {
          data.isDisabledUpdate = true;
        } else {
          data.isDisabledUpdate = false;
        }
        if (vm.packingSlip && (vm.packingSlip.status === vm.PackingSlipStatus.Approved || vm.packingSlip.status === vm.PackingSlipStatus.Paid || vm.packingSlip.packingSlipModeStatus === CORE.PackingSlipModeStatus[1].ID)) {
          data.isDisabledDelete = true;
          data.isRowSelectable = false;
        } else {
          data.isDisabledDelete = false;
          data.isRowSelectable = true;
        }
        if (data.purchaseRequirementCount > 0 && !data.isReceiveBulkItem) {
          data.isDisableMaterialReceivePartInstructionDetail = false;
          data.isDisableGenerateInspectionRequirmentReport = false;
        } else {
          data.isDisableMaterialReceivePartInstructionDetail = true;
          data.isDisableGenerateInspectionRequirmentReport = true;
        }

        data.isDisableCreateRMA = vm.packingSlip.packingSlipModeStatus === vm.packingSlipModeStatus[0].ID;
        const splitPSInspectionStatus = data.psInspectionStatus ? data.psInspectionStatus.split(_groupConcatSeparatorValue) : [];
        if (splitPSInspectionStatus && splitPSInspectionStatus.length > 0) {
          if (_.some(splitPSInspectionStatus, (data) => data === vm.Transaction.PackingSlipInspectionStatus[2].value)) {
            data.psInspectionStatusLineWise = vm.packingSlipReceivedStatus[2].value;
          } else if (_.some(splitPSInspectionStatus, (data) => data === vm.Transaction.PackingSlipInspectionStatus[0].value)) {
            data.psInspectionStatusLineWise = vm.packingSlipReceivedStatus[0].value;
          } else if (_.some(splitPSInspectionStatus, (data) => data === vm.Transaction.PackingSlipInspectionStatus[3].value)) {
            data.psInspectionStatusLineWise = vm.packingSlipReceivedStatus[3].value;
          } else {
            data.psInspectionStatusLineWise = vm.packingSlipReceivedStatus[1].value;
          }
        } else {
          data.psInspectionStatusLineWise = vm.isPOCanceled ? vm.packingSlipReceivedStatus[2].value : vm.packingSlipReceivedStatus[1].value;
        }
      });
      vm.packingSlip.totalDetailLine = vm.totalSourceDataCount;
      vm.packingSlip.rejectedDetailLine = _.filter(vm.sourceData || [], (data) => data.receivedStatus === 'R').length;
      vm.totalCustomerConsignedLines = _.filter(vm.sourceData || [], ['isLineCustConsigned', 1]);

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
        vm.isNoDataFound = false;
        vm.emptyState = null;
      }

      _.map(vm.sourceData, (item, index) => {
        item.tempID = (index + 1);
        item.oldReceivedQty = item.receivedQty;
      });
      $timeout(() => {
        vm.resetSourceGrid();
        if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
          return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
        }
      });
    }
    /* retrieve packing slip material list*/
    vm.loadData = () => {
      if (vm.packingSlipID > 0) {
        vm.removeMaterialList = [];
        if (vm.pagingInfo.SortColumns.length === 0) {
          vm.pagingInfo.SortColumns = [
            ['packingSlipSerialNumber', 'ASC']
          ];
        }

        vm.pagingInfo.Page = 0;
        vm.cgBusyLoading = PackingSlipFactory.getPackingSlipMaterialList().query(vm.pagingInfo).$promise.then((response) => {
          if (response && response.data && response.data.packingSlipMaterialList) {
            setDataAfterGetAPICall(response.data);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.sourceData = [];
        vm.totalSourceDataCount = 0;
        vm.isNoDataFound = true;
        vm.emptyState = null;
        $timeout(() => {
          if (!vm.gridOptions.enablePaging) {
            vm.currentdata = vm.sourceData.length;
            vm.gridOptions.gridApi.infiniteScroll.resetScroll();
          }
          vm.gridOptions.clearSelectedRows();
          vm.resetSourceGrid();
          if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
          }
        });
      }
    };

    /** Method call for infinite scroll of material grid */
    vm.getDataDown = () => {
      // vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.pagingInfo.Page = 0;
      vm.cgBusyLoading = PackingSlipFactory.getPackingSlipMaterialList().query(vm.pagingInfo).$promise.then((response) => {
        // vm.sourceData = vm.sourceData.concat(response.data.packingSlipMaterialList);
        vm.sourceData = response.data.packingSlipMaterialList;
        vm.currentdata = vm.sourceData.length;
        _.remove(vm.sourceData, (data) => data.packingSlipSerialNumber < 0);
        vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
        _.map(vm.sourceData, (item, index) => {
          item.tempID = (index + 1);
          item.oldReceivedQty = item.receivedQty;
        });
        $timeout(() => {
          vm.resetSourceGrid();
          return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount !== vm.currentdata ? true : false);
        });
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const unSavedChangesConfirmation = (row, ev) => {
      if (vm.packingSlipDetForm.$dirty) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.BARCODE_MESSAGE_LOST);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            editMaterialDetail(row.entity, ev);
          }
        }, () => {

        }, (error) => BaseService.getErrorLog(error));
      } else {
        editMaterialDetail(row.entity, ev);
      }
    };

    vm.checkPackingSlipLine = (ev) => {
      if (vm.packingSlipDetForm.$dirty && vm.packingSlipDet.packingSlipSerialNumber && vm.sourceData.length > 0) {
        const row = _.find(vm.sourceData, (row) => row.id !== vm.packingSlipDet.id && row.packingSlipSerialNumber === parseInt(vm.packingSlipDet.packingSlipSerialNumber));
        if (row && vm.packingSlipDet.partID) {
          const sameRowWithPart = _.find(vm.sourceData, { packingSlipSerialNumber: parseInt(vm.packingSlipDet.packingSlipSerialNumber), partID: vm.packingSlipDet.partID });
          if (sameRowWithPart) {
            duplicatePackingSlipLineMessage(sameRowWithPart, ev);
          } else {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PACKING_SLIP_LINE_EXIST_CONFIRMATION);
            messageContent.message = stringFormat(messageContent.message, `(${vm.packingSlipDet.mfgCode}) ${vm.packingSlipDet.mfgPN}`);
            const obj = {
              messageContent: messageContent,
              btnText: TRANSACTION.PackingSlipSameLineConfirmationButton.EditLine,
              canbtnText: TRANSACTION.PackingSlipSameLineConfirmationButton.ChangeLine
            };
            DialogFactory.messageConfirmDialog(obj).then((yes) => {
              if (yes) {
                editMaterialDetail(row, ev);
              }
            }, () => {
              vm.packingSlipDet.packingSlipSerialNumber = null;
              setFocus('packingSlipSerialNumber');
            }, (error) => BaseService.getErrorLog(error));
          }
        }
        else if (row) {
          duplicatePackingSlipLineMessage(row, ev);
        }
      }
    };

    const duplicatePackingSlipLineMessage = (row, ev) => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PACKING_SLIP_LINE_EDIT_CONFIRMATION);
      messageContent.message = stringFormat(messageContent.message, vm.packingSlipDet.packingSlipSerialNumber);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          editMaterialDetail(row, ev);
        }
      }, () => {
        vm.packingSlipDet.packingSlipSerialNumber = null;
        setFocus('packingSlipSerialNumber');
      }, (error) => BaseService.getErrorLog(error));
    };

    vm.updateRecord = (row, ev, isView) => {
      //editMaterialDetail(row, ev);
      vm.isView = isView ? true : false;
      if (row.entity.id > 0 && !vm.isView) {
        getPackingSlipMaterialDetailStatus([row.entity.id], 'edit').then((res) => {
          if (res) {
            unSavedChangesConfirmation(row, ev);
          }
        }, (error) => BaseService.getErrorLog(error));
      } else {
        unSavedChangesConfirmation(row, ev);
      }
    };

    vm.goToNonUMIDStockList = (row) => {
      if (vm.packingSlip && vm.packingSlipID) {
        if (row) {
          const keywords = stringFormat('{0}{1}{2}{3}{4}{5}{6}', row.PIDCode, _groupConcatSeparatorValue, vm.packingSlip.packingSlipNumber, _groupConcatSeparatorValue, vm.packingSlip.mfgFullName, _groupConcatSeparatorValue, vm.packingSlip.mfgCodeID);
          BaseService.goToNonUMIDStockList(row.warehouseID, row.binID, keywords);
        } else {
          const keywords = stringFormat('{0}{1}{2}{3}{4}{5}{6}', '', _groupConcatSeparatorValue, vm.packingSlip.packingSlipNumber, _groupConcatSeparatorValue, vm.packingSlip.mfgFullName, _groupConcatSeparatorValue, vm.packingSlip.mfgCodeID);
          BaseService.goToNonUMIDStockList(null, null, keywords);
        }
      }
    };

    const getPackingSlipMaterialDetailStatus = (objIDs, action, labelName) => new Promise((resolve, reject) => {
      PackingSlipFactory.getPackingSlipMaterialDetailStatus().query({
        objIDs: objIDs,
        packingSlipID: vm.packingSlipID
      }).$promise.then((res) => {
        const invoiceDet = _.first(res.data);
        let messageContent;
        let obj;
        if (invoiceDet) {
          if (invoiceDet.invoiceStatus === CORE.PackingSlipStatus.Paid) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PACKING_SLIP_INVOICE_STATUS_CHANGED);
            messageContent.message = stringFormat(messageContent.message, action);

            obj = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(obj);
            resolve(false);
          } else if (invoiceDet.UMIDCount > 0 && (action === 'delete' || action === 'checkValidation')) {
            if (action === 'delete') {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PACKING_SLIP_UMID_CREATED);
            } else if (action === 'checkValidation') {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_ALLOW_CHANGE_NON_UMID_STOCK);
            }
            DialogFactory.messageAlertDialog({ messageContent });
            resolve(false);
          } else if (invoiceDet.RMACount > 0 && action === 'checkValidation') {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_ALLOW_CHANGE_CUST_CONSIGNED_FIELD_RMA_CREATED);
            messageContent.message = stringFormat(messageContent.message, labelName);
            DialogFactory.messageAlertDialog({ messageContent });
            resolve(false);
          } else {
            resolve(true);
          }
        } else {
          resolve(true);
        }
      }).catch((error) => {
        reject(error);
      });
    });

    function editMaterialDetail(row) {
      if (vm.packingSlipDetForm) {
        vm.packingSlipDetForm.$setPristine();
        vm.packingSlipDetForm.$setUntouched();
      }
      vm.isEditLine = vm.isView ? false : true;
      vm.materialDetTitle = 'Update';
      vm.packingSlipDet = angular.copy(row);
      vm.packingSlipDet.isLineCustConsigned = vm.packingSlipDet.isLineCustConsigned ? true : false;
      vm.packingSlipDet.isNonUMIDStock = vm.packingSlipDet.isNonUMIDStock ? true : false;
      if (vm.packingSlipDet.partType === CORE.PartType.Other) {
        vm.packingSlipDet.isNonUMIDStock = true;
      }
      if (vm.packingSlipDet.lineCustomerID && vm.autoCompleteLineCustomer) {
        getSupplierMfgCodeSearch({
          mfgcodeID: vm.packingSlipDet.lineCustomerID,
          type: CORE.MFG_TYPE.MFG,
          isCustomer: true
        }, true);
      } else {
        if (vm.autoCompleteLineCustomer && vm.autoCompleteLineCustomer.inputName) {
          $scope.$broadcast(vm.autoCompleteLineCustomer.inputName, null);
        }
      }
      vm.packingSlipDet.pendingQtyDisabled = vm.packingSlipDet.pendingQty;
      vm.packingSlipDet.supplierCodeDisabled = vm.packingSlipDet.supplierCode;
      vm.packingSlipDet.supplierPNDisabled = vm.packingSlipDet.supplierPN;
      vm.packingSlipDet.packageQtyDisabled = vm.packingSlipDet.packageQty;
      vm.packingSlipDet.spqDisabled = vm.packingSlipDet.spq;
      vm.packingSlipDet.uomNameDisabled = vm.packingSlipDet.uomName;
      vm.packingSlipDet.parentWarehouseDisabled = vm.packingSlipDet.parentWarehouse;
      vm.packingSlipDet.warehouseDisabled = vm.packingSlipDet.warehouse;
      vm.packingSlipDet.acceptedLinesDisabled = vm.packingSlipDet.acceptedLines;
      vm.packingSlipDet.unit = parseFloat(vm.packingSlipDet.unit);
      vm.packingSlipDet.unitDisabled = vm.packingSlipDet.unit;
      vm.packingSlipDet.orderedQty = parseFloat(vm.packingSlipDet.orderedQty);
      vm.packingSlipDet.receivedQty = parseFloat(vm.packingSlipDet.receivedQty);
      vm.packingSlipDet.packingSlipQty = parseFloat(vm.packingSlipDet.packingSlipQty);
      vm.packingSlipDet.totalReceivedQty = parseFloat(vm.packingSlipDet.totalReceivedQty);
      vm.packingSlipDet.totalReceivedQtyDisabled = vm.packingSlipDet.totalReceivedQty;
      vm.packingSlipDet.disputeQty = parseFloat(vm.packingSlipDet.packingSlipQty - vm.packingSlipDet.receivedQty);
      vm.packingSlipDet.disputeQtyDisabled = vm.packingSlipDet.disputeQty;
      vm.autoCompleteRohsStatus.keyColumnId = vm.packingSlipDet.rohsstatus;
      vm.purchaseCommentList = vm.packingSlipDet.purchaseInspectionComment;
      vm.purchaseCommentHtml(vm.purchaseCommentList);
      vm.packingSlipDet.poDescription = vm.packingSlipDet.partDescription;
      vm.packingSlipDet.poDescriptionDisabled = vm.packingSlipDet.poDescription;
      vm.packingSlipDet.poInternalComment = vm.packingSlipDet.internalLineComment;
      vm.packingSlipDet.poInternalCommentDisabledfield = vm.packingSlipDet.internalLineComment;
      vm.packingSlipDet.poLineID = vm.packingSlipDet.refPOLineID;
      vm.packingSlipDet.isReceivedWrongPart = row.isReceivedWrongPart === 1 ? true : false;
      vm.packingSlipDet.isConfirmMissMatchQty = true;
      vm.packingSlipDet.oldReceivedStatus = angular.copy(vm.packingSlipDet.receivedStatus);
      $scope.$broadcast(vm.autoCompletecomponent.inputName, `(${vm.packingSlipDet.mfgCode}) ${vm.packingSlipDet.mfgPN}`);
      vm.packingSlipDet.EditPackaging = vm.packingSlipDet.packagingID;
      vm.packingSlipDet.EditPackagingName = vm.packingSlipDet.packaging;
      if (vm.autoCompletePOLine) {
        vm.getAllPOLine(vm.packingSlipDet.refPOLineID);
      }
      $timeout(() => vm.autoCompletecomponent.keyColumnId = vm.packingSlipDet.partID);
      setFocus('packingSlipSerialNumber');
      if (vm.autoPackaging) {
        vm.autoPackaging.keyColumnId = vm.packingSlipDet.packagingID;
      }

      if (vm.packingSlipDet.partType === CORE.PartType.Other) {
        initMaterialAutoComplete();
      } else {
        if (vm.packingSlipDet && vm.packingSlipDet.nickname) {
          const assemblyDet = {
            nickName: vm.packingSlipDet.nickname
          };
          $scope.$broadcast(vm.autoCompleteAssyNickname.inputName, assemblyDet);
        } else {
          $scope.$broadcast(vm.autoCompleteAssyNickname.inputName, null);
        }
      }
    }

    vm.savePackingSlipMaterialDet = () => {
      if (BaseService.focusRequiredField(vm.packingSlipDetForm) || (!vm.packingSlipID) || vm.saveBtnDisableFlag || vm.packingSlipDisable || vm.isView) {
        return;
      }
      vm.saveBtnDisableFlag = true;
      if (vm.packingSlipDet.id) {
        vm.packingSlipDet.packingSlipNonUMIDStock = vm.packingSlip.isNonUMIDStock;
        vm.packingSlipDet.packingSlipCustConsigned = vm.packingSlip.isCustConsigned;
        vm.packingSlipDet.isDisabledOrderQty = vm.isDisabledOrderQty;
        vm.packingSlipDet.refPurchaseOrderID = vm.packingSlip.refPurchaseOrderID;
      }
      vm.isEditLine = false;
      let messageContent;

      if (vm.packingSlipDet && vm.packingSlipDet.refPurchaseOrderDetID) {
        vm.cgBusyLoading = PurchaseOrderFactory.getPurchaseOrderLineDetailByID().query({ id: vm.packingSlipDet.refPurchaseOrderDetID }).$promise.then((response) => {
          vm.saveBtnDisableFlag = false;
          if (response && response.data) {
            const poline = _.find(response.data, (poLineItem) => poLineItem.id === vm.packingSlipDet.refPOReleaseLineID);
            if (poline && poline.poLineWorkingStatus === vm.CORE.PO_Line_WorkingStatus.Close.id && !vm.packingSlipDet.id) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PART_ALREADY_CLOSE_FROM_PO);
              messageContent.message = stringFormat(messageContent.message, redirectToPartDetail(vm.packingSlipDet.partID, vm.packingSlipDet.PIDCode), vm.packingSlipDet.poReleaseNumber, vm.packingSlipDet.poLineID, redirectToPOAnchorTag(vm.packingSlip.refPurchaseOrderID, vm.packingSlip.poNumber));
              return DialogFactory.messageAlertDialog({ messageContent }).then((yes) => {
                if (yes) {
                  vm.resetPackingSlipMaterialDet();
                }
              });
            } else {
              vm.checkBinValidation();
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        if (!vm.packingSlipDet.poLineID && !vm.packingSlip.refPurchaseOrderID) {
          vm.cgBusyLoading = PackingSlipFactory.checkLineExistsForExternalPO().query({
            poNumber: vm.packingSlip.poNumber || null,
            orderedQty: vm.packingSlipDet.orderedQty || null,
            partID: vm.packingSlipDet.partID || null
          }).$promise.then((response) => {
            if (response && response.data && response.data.length > 0) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.CONFIRM_TO_SELECT_PO_LINE);
              messageContent.message = stringFormat(messageContent.message, redirectToPartDetail(vm.packingSlipDet.partID, vm.packingSlipDet.PIDCode), vm.packingSlip.poNumber);
              const data = {
                messageContent,
                poLines: response.data
              };
              return DialogFactory.dialogService(
                TRANSACTION.DUPLICATE_PO_LINE_VALIDATION_CONTROLLER,
                TRANSACTION.DUPLICATE_PO_LINE_VALIDATION_VIEW,
                null,
                data).then((response) => {
                  if (response && response.ButtonId === CORE.duplicatePoLineSaveType.SameLine.ID && response.selectedLine) {
                    vm.packingSlipDet.poLineID = response.selectedLine.refPOLineID;
                    vm.packingSlipDet.isLineCustConsigned = response.selectedLine.isLineCustConsigned ? true : false;
                    vm.packingSlipDet.isNonUMIDStock = response.selectedLine.isNonUMIDStock ? true : false;
                    vm.packingSlipDet.lineCustomerID = response.selectedLine.lineCustomerID;
                  } else {
                    vm.packingSlipDet.poLineID = null;
                  }
                  vm.checkBinValidation();
                }, () => vm.saveBtnDisableFlag = false, (err) => BaseService.getErrorLog(err));
            } else {
              vm.checkBinValidation();
            }
          }).catch((error) => BaseSevice.getErrorLog(error));
        } else {
          vm.checkBinValidation();
        }
      }
    };

    vm.checkBinValidation = () => {
      let messageContent;
      // Check if bin not scan properly than make empty all details related to bin
      if (!vm.packingSlipDet.binID && vm.packingSlipDet.partType !== CORE.PartType.Other && !(vm.packingSlipDet.isNonUMIDStock || vm.packingSlip.isNonUMIDStock)) {
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RE_ENTER_BIN);
        messageContent.message = stringFormat(messageContent.message, 'Location/Bin', 'Location/Bin');
        return DialogFactory.messageAlertDialog({ messageContent }).then((yes) => {
          if (yes) {
            vm.packingSlipDet.binID = vm.packingSlipDet.bin = vm.packingSlipDet.warehouseDisabled = vm.packingSlipDet.warehouse = vm.packingSlipDet.warehouseID = vm.packingSlipDet.parentWarehouseDisabled = vm.packingSlipDet.parentWarehouse = vm.packingSlipDet.parentWarehouseID = null;
            setFocus('packingSlipBinName');
            vm.saveBtnDisableFlag = false;
          }
        });
      }

      const duplicatePackingLineNum = _.findIndex(vm.sourceData, (obj) => obj.id !== vm.packingSlipDet.id && obj.packingSlipSerialNumber === parseInt(vm.packingSlipDet.packingSlipSerialNumber));
      if (duplicatePackingLineNum !== -1) {
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
        messageContent.message = stringFormat(messageContent.message, 'Packing slip line number');
        return DialogFactory.messageAlertDialog({ messageContent }).then((yes) => {
          if (yes) {
            vm.saveBtnDisableFlag = false;
            vm.packingSlipDet.packingSlipSerialNumber = null;
            setFocus('packingSlipSerialNumber');
          }
        });
      }

      checkDuplicatePartWithSamePackaging();
    };

    const checkDuplicatePartWithSamePackaging = (isCheckDuplicatePartValidationOnly) => {
      if (((vm.autoPackaging && vm.autoPackaging.keyColumnId) || vm.packingSlipDet.packagingID) || isCheckDuplicatePartValidationOnly) {
        const partExists = _.find(vm.sourceData, (obj) => obj.id !== vm.packingSlipDet.id && obj.partID === vm.packingSlipDet.partID && obj.packagingID === vm.packingSlipDet.packagingID);
        const packagingObj = _.find(vm.packagingList, (obj) => obj.id === vm.packingSlipDet.packagingID);
        if (partExists && !vm.askSamePartWithSamePackagingValidation && !vm.packingSlipDet.id && !vm.isView) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.CONFIRMATION_PART_EXIST_WITH_SAME_PACKAGING);
          messageContent.message = stringFormat(messageContent.message, vm.packingSlipDet.mfgPN, packagingObj ? packagingObj.name : vm.packingSlipDet.packaging);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          return DialogFactory.messageConfirmDialog(obj).then(() => {
            vm.askSamePartWithSamePackagingValidation = true;
            if (!isCheckDuplicatePartValidationOnly) {
              vm.checkduplicateBinWithSamePartAndPackaging();
            } else {
              if (!vm.packingSlipDet.packingSlipSerialNumber) {
                setFocus('packingSlipSerialNumber');
              } else if (!(vm.packingSlip.refPurchaseOrderID || vm.packingSlipDet.TotalUMIDCount > 0 || vm.packingSlipDet.isRMACreated || vm.packingSlip.isCustConsigned || vm.packingSlipDet.partType === vm.CORE.PartType.Other)) {
                setFocus('isLineCustConsigned');
              } else if (vm.packingSlipDet.partType !== vm.CORE.PartType.Other || vm.packingSlipDet.TotalUMIDCount > 0 || vm.packingSlipDet.isRMACreated || vm.packingSlipDet.isNonUMIDStock || vm.packingSlip.isNonUMIDStock) {
                setFocus('packingSlipBinName');
              } else if (vm.packingSlipDet.isReceiveBulkItem) {
                setFocus('totalLines');
              } else {
                setFocus('orderedQty');
              }
            }
          }, () => {
            if (!isCheckDuplicatePartValidationOnly) {
              vm.saveBtnDisableFlag = false;
            } else {
              vm.autoPackaging.keyColumnId = null;
            }
            vm.focusOnPackaging = true;
          });
        } else if (!isCheckDuplicatePartValidationOnly) {
          vm.checkduplicateBinWithSamePartAndPackaging();
        }
      } else {
        vm.checkduplicateBinWithSamePartAndPackaging();
      }
    };

    vm.checkduplicateBinWithSamePartAndPackaging = (isCheckDuplicateBinValidationOnly) => {
      if ((vm.packingSlipDet.partType !== CORE.PartType.Other && !(vm.packingSlipDet.isNonUMIDStock || vm.packingSlip.isNonUMIDStock)) || isCheckDuplicateBinValidationOnly) {
        vm.cgBusyLoading = PackingSlipFactory.checkSameBinWithSamePartAndSamePackaging().query({
          partID: vm.packingSlipDet.partID || null,
          refPackingSlipMaterialRecID: vm.packingSlipDet.refPackingSlipMaterialRecID || null,
          binID: vm.packingSlipDet.binID || null,
          packagingID: vm.autoPackaging.keyColumnId || null,
          id: vm.packingSlipDet.id || null
        }).$promise.then((response) => {
          if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            if (response.data && response.data.length > 0) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.BIN_CONTAIN_SAME_PART_WITH_SAME_PACKAGING);
              messageContent.message = stringFormat(messageContent.message, vm.packingSlipDet.bin, redirectToPartDetail(vm.packingSlipDet.partID, vm.packingSlipDet.PIDCode), vm.packingSlipDet.packaging);
              const data = {
                messageContent,
                lineDetails: vm.packingSlipDet
              };
              return DialogFactory.dialogService(
                TRANSACTION.DUPLICATE_BIN_WITH_DIFFERENT_RECEIVED_STATUS_CONTROLLER,
                TRANSACTION.DUPLICATE_BIN_WITH_DIFFERENT_RECEIVED_STATUS_VIEW,
                null,
                data).then((response) => {
                  if (response && response.binID) {
                    vm.packingSlipDet.binID = response.binID;
                    vm.packingSlipDet.bin = response.bin;
                    vm.packingSlipDet.warehouseID = response.warehouseID;
                    vm.packingSlipDet.warehouse = response.warehouse;
                    vm.packingSlipDet.warehouseDisabled = vm.packingSlipDet.warehouse;
                    vm.packingSlipDet.parentWarehouseID = response.parentWarehouseID;
                    vm.packingSlipDet.parentWarehouse = response.parentWarehouse;
                    vm.packingSlipDet.parentWarehouseDisabled = vm.packingSlipDet.parentWarehouse;
                    vm.checkduplicateBinWithSamePartAndPackaging(isCheckDuplicateBinValidationOnly);
                  }
                }, () => {
                  if (!isCheckDuplicateBinValidationOnly) {
                    vm.saveBtnDisableFlag = false;
                  }
                });
            } else if (!isCheckDuplicateBinValidationOnly) {
              vm.checkduplicateBinValidation();
            } else {
              if (vm.packingSlip.refPurchaseOrderID && vm.packingSlipDet.orderedQty) {
                setFocus('receivedQty');
              }
              else { setFocus('orderedQty'); }
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.checkduplicateBinValidation();
      }
    };

    vm.checkduplicateBinValidation = () => {
      if (vm.packingSlipDet.receivedStatus !== vm.packingSlipReceivedStatus[0].value && vm.packingSlipDet.partType !== CORE.PartType.Other && !(vm.packingSlipDet.isNonUMIDStock || vm.packingSlip.isNonUMIDStock)) {
        vm.cgBusyLoading = PackingSlipFactory.checkSameBinAndDifferentStatus().query({
          partID: vm.packingSlipDet.partID || null,
          refPackingSlipMaterialRecID: vm.packingSlipDet.refPackingSlipMaterialRecID || null,
          binID: vm.packingSlipDet.binID || null,
          packagingID: vm.autoPackaging.keyColumnId || null,
          id: vm.packingSlipDet.id || null,
          receivedStatus: vm.packingSlipDet.receivedStatus || null
        }).$promise.then((response) => {
          if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            if (response.data && response.data.length > 0) {
              const receivedStatusName = _.find(vm.packingSlipReceivedStatus, (status) => status.value === vm.packingSlipDet.receivedStatus);
              const newReceivedStatusName = vm.packingSlipDet.receivedStatus === vm.packingSlipReceivedStatus[2].value ? `${vm.packingSlipReceivedStatus[1].key} / ${vm.packingSlipReceivedStatus[3].key}` : vm.packingSlipReceivedStatus[2].key;
              const messageContent = vm.packingSlipDet.purchaseRequirementCount > 0 ? angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.BIN_CONTAIN_SAME_PART_WITH_SAME_STATUS) : angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.BIN_CONTAIN_SAME_PART_WITH_SAME_STATUS_WITHOUT_REQUIREMENT);
              messageContent.message = stringFormat(messageContent.message, receivedStatusName.key, redirectToPartDetail(vm.packingSlipDet.partID, vm.packingSlipDet.PIDCode), newReceivedStatusName, vm.packingSlipDet.bin);
              const data = {
                messageContent,
                lineDetails: vm.packingSlipDet
              };
              return DialogFactory.dialogService(
                TRANSACTION.DUPLICATE_BIN_WITH_DIFFERENT_RECEIVED_STATUS_CONTROLLER,
                TRANSACTION.DUPLICATE_BIN_WITH_DIFFERENT_RECEIVED_STATUS_VIEW,
                null,
                data).then((response) => {
                  if (response && response.binID) {
                    vm.packingSlipDet.binID = response.binID;
                    vm.packingSlipDet.bin = response.bin;
                    vm.packingSlipDet.warehouseID = response.warehouseID;
                    vm.packingSlipDet.warehouse = response.warehouse;
                    vm.packingSlipDet.warehouseDisabled = vm.packingSlipDet.warehouse;
                    vm.packingSlipDet.parentWarehouseID = response.parentWarehouseID;
                    vm.packingSlipDet.parentWarehouse = response.parentWarehouse;
                    vm.packingSlipDet.parentWarehouseDisabled = vm.packingSlipDet.parentWarehouse;
                    vm.checkduplicateBinValidation();
                  }
                }, () => vm.saveBtnDisableFlag = false);
            } else {
              saveMaterialDet();
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        saveMaterialDet();
      }
    };

    //check for mismatch in packingSlip and Receiving qty
    vm.checkMissmatchInQty = () => {
      if (vm.packingSlipDet.receivedQty && vm.packingSlipDet.packingSlipQty) {
        vm.packingSlipDet.disputeQty = vm.packingSlipDet.packingSlipQty - vm.packingSlipDet.receivedQty;
        vm.packingSlipDet.disputeQtyDisabled = vm.packingSlipDet.disputeQty;
      }
      if (vm.packingSlipDet.packingSlipQty && vm.packingSlipDet.receivedQty &&
        vm.packingSlipDet.packingSlipQty !== vm.packingSlipDet.receivedQty &&
        !vm.packingSlipDet.isConfirmMissMatchQty &&
        !vm.isReceivingQtyConfirmationPending) {
        const messageContent = angular.copy(vm.CORE_MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RECEIVING_AND_PACKINGSLIP_QTY_MISSMATCH_CONFIRMATION);
        const buttonsList = [{
          name: vm.CORE_MESSAGE_CONSTANT.BUTTON_FOR_Continue
        },
        {
          name: 'Change Packing Slip/Ship Qty'
        },
        {
          name: 'Change Received Qty'
        }
        ];
        const model = {
          messageContent,
          multiple: true,
          buttonsList
        };
        DialogFactory.dialogService(
          CORE.MULTIPLE_BUTTONS_DIALOG_POPUP_CONTROLLER,
          CORE.MULTIPLE_BUTTONS_DIALOG_POPUP_VIEW,
          null,
          model).then(() => { }, (response) => {
            if (response === buttonsList[0].name) {
              vm.packingSlipDet.isConfirmMissMatchQty = true;
              setFocus('receivedStatusGroup');
            } else if (response === buttonsList[1].name) {
              vm.packingSlipDet.isConfirmMissMatchQty = false;
              vm.packingSlipDet.packingSlipQty = null;
              setFocus('packingSlipQty');
            } else if (response === buttonsList[2].name) {
              vm.packingSlipDet.isConfirmMissMatchQty = false;
              vm.packingSlipDet.receivedQty = null;
              vm.packingSlipDet.allReceivedQty = null;
              setFocus('receivedQty');
            }
          }, (err) => BaseService.getErrorLog(err));
      }
    };

    //Check for wrong part before saving material detail
    function saveMaterialDet() {
      if (vm.packingSlip.refPurchaseOrderID && vm.packingSlipDet && vm.packingSlipDet.isReceivedWrongPart && vm.packingSlipDet.refPurchaseOrderDetID) {
        // isReceivedWrongPart is selected and part is present in PO
        //here
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.WRONG_PART_CNF_FOR_PART_IN_PO);
        messageContent.message = stringFormat(messageContent.message, redirectToPartDetail(vm.packingSlipDet.partID, vm.packingSlipDet.PIDCode), redirectToPOAnchorTag(vm.packingSlip.refPurchaseOrderID, vm.packingSlip.poNumber));
        const model = {
          messageContent
        };

        DialogFactory.messageAlertDialog(model).then(() => {
          //saveMaterialDetLogic();
          vm.saveBtnDisableFlag = false;
        }, (error) => BaseService.getErrorLog(error));
      }
      else if (vm.packingSlip.refPurchaseOrderID && !vm.packingSlipDet.isReceivedWrongPart && !vm.packingSlipDet.poLineID && !vm.packingSlipDet.poReleaseNumber) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.WRONG_PART_IS_UNCHECKED);
        messageContent.message = stringFormat(messageContent.message, redirectToPartDetail(vm.packingSlipDet.partID, vm.packingSlipDet.PIDCode), redirectToPOAnchorTag(vm.packingSlip.refPurchaseOrderID, vm.packingSlip.poNumber));
        const model = {
          messageContent: messageContent
        };

        DialogFactory.messageAlertDialog(model).then(() => {
          vm.saveBtnDisableFlag = false;
        }, (error) => BaseService.getErrorLog(error));
      }
      else {
        checkPackingSlipCustConsigned();
      }
    }

    const checkPackingSlipCustConsigned = () => {
      if (!vm.packingSlip.refPurchaseOrderID) {
        vm.cgBusyLoading = PackingSlipFactory.checkPackingSlipCustConsignedStatus().query({
          id: vm.packingSlipID,
          isLineCustConsigned: vm.packingSlip.isCustConsigned
        }).$promise.then((response) => {
          if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            if (response.data) {
              vm.saveBtnDisableFlag = false;
              const messageContent = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PRIOR_TO_SAVE_PACKINGSLIP_DETAILS;
              return DialogFactory.messageAlertDialog({ messageContent });
            } else {
              checkPackingSlipNonUMIDStockStatus();
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        checkPackingSlipNonUMIDStockStatus();
      }
    };

    const checkPackingSlipNonUMIDStockStatus = () => {
      // check header level non-umid-stock field is mismatched without saving
      vm.cgBusyLoading = PackingSlipFactory.checkPackingSlipNonUMIDStockStatus().query({
        id: vm.packingSlipID,
        isNonUMIDStock: vm.packingSlip.isNonUMIDStock
      }).$promise.then((response) => {
        if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          if (response.data) {
            vm.saveBtnDisableFlag = false;
            const messageContent = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PRIOR_TO_SAVE_PACKINGSLIP_DETAILS;
            return DialogFactory.messageAlertDialog({ messageContent });
          } else {
            if (vm.packingSlipDet.isNonUMIDStock && !vm.packingSlipDet.isNonUMIDStockDBObject && !vm.packingSlip.isNonUMIDStock) {
              const messageContent = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.ADDING_AS_NON_UMID_STOCK;
              return DialogFactory.messageConfirmDialog({
                messageContent,
                btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
              }).then(() => saveMaterialDetLogic(), () => vm.saveBtnDisableFlag = false);
            } else {
              saveMaterialDetLogic();
            }
          }
        } else {
          vm.saveBtnDisableFlag = false;
          return;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.toggleReceivedStaus = (isWrongPart) => {
      if ((!vm.packingSlipID) || vm.packingSlipDisable || !vm.packingSlip.refPurchaseOrderID || vm.packingSlipDet.TotalUMIDCount > 0 || vm.packingSlipDet.isRMACreated || vm.isView) {
        vm.packingSlipDet.isReceivedWrongPart = !isWrongPart ? true : false;
        return;
      }
      vm.packingSlipDet.receivedStatus = !vm.packingSlipDet.isReceivedWrongPart || vm.isPOCanceled ? vm.packingSlipReceivedStatus[2].value : vm.packingSlipReceivedStatus[0].value;
      if (vm.packingSlipDet.isReceivedWrongPart) {
        vm.packingSlipDet.orderedQty = null;
      }
    };

    // Save material detail
    function saveMaterialDetLogic() {
      vm.packingSlipDet.refSupplierPartId = vm.packingSlipDet.supplierMFGPNID;
      vm.packingSlipDet.refPackingSlipNumberForInvoice = vm.packingSlip.refPackingSlipNumberForInvoice;
      vm.packingSlipDet.refPOLineID = vm.packingSlipDet.poLineID ? vm.packingSlipDet.poLineID : null;
      vm.packingSlipDet.nickname = vm.packingSlipDet.nickname ? vm.packingSlipDet.nickname : vm.autoCompleteAssyNickname.searchText;
      vm.packingSlipDet.refPurchaseOrderID = vm.packingSlip.refPurchaseOrderID;
      if (vm.packingSlip.refPurchaseOrderID && !vm.packingSlipDet.isReceivedWrongPart) {
        vm.packingSlipDet.purchaseInspectionComment = vm.popurchaseInspectionComment;
        vm.packingSlipDet.purchaseInspectionList = _.map(vm.purchaseRequirementList, (requirements) => ({
          partId: vm.packingSlipDet.partID,
          category: 'P',
          inspectionmst: { requirement: requirements.instruction, requiementType: 'R' }
        }));
      }
      else {
        vm.packingSlipDet.purchaseInspectionComment = vm.purchaseCommentList;
        vm.packingSlipDet.purchaseInspectionList = _.filter(vm.purchaseRequirementList, (item) => item && item.inspectionmst && item.inspectionmst.requiementType === 'R');
        vm.packingSlipDet.rohsstatus = vm.autoCompleteRohsStatus.keyColumnId ? vm.autoCompleteRohsStatus.keyColumnId : null;
        vm.packingSlipDet.poNumber = vm.packingSlip.poNumber;
      }
      vm.cgBusyLoading = PackingSlipFactory.savePackingSlipMaterial().query(vm.packingSlipDet).$promise.then((response) => {
        if (response) {
          vm.saveBtnDisableFlag = false;
          if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            if (vm.packingSlipDet.id) {
              vm.resetPackingSlipMaterialDet();
              BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
            } else {
              const objRequirementList = _.filter(vm.packingSlipDet.purchaseInspectionList, (data) => data.inspectionmst && data.inspectionmst.requiementType === 'R');
              if (objRequirementList && objRequirementList.length > 0 && !vm.packingSlipDet.isReceiveBulkItem) {
                vm.packingSlipDet.isPOCanceled = vm.isPOCanceled;
                const obj = {
                  lineDetail: vm.packingSlipDet,
                  packingSlipDisable: false
                };
                obj.lineDetail.id = response.data.id;
                DialogFactory.dialogService(
                  TRANSACTION.PACKING_SLIP_RECEIVE_PART_INSPECTION_POPUP_CONTROLLER,
                  TRANSACTION.PACKING_SLIP_RECEIVE_PART_INSPECTION_POPUP_VIEW,
                  null,
                  obj).then(() => {
                    vm.resetPackingSlipMaterialDet();
                    BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                  }, () => {
                    vm.resetPackingSlipMaterialDet();
                    BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                  });
              } else {
                vm.resetPackingSlipMaterialDet();
                BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
              }
            }
          }
          else {
            if (response.errors && response.errors.data && response.errors.data.length > 0) {
              vm.saveBtnDisableFlag = false;
              let focusColumnName;
              let messageContent;
              const packingSlipStatusDet = _.find(response.errors.data, (item) => item.errorCode === 1);
              if (packingSlipStatusDet) {
                messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_UPDATE_PAID_PACKING_SLIP);
              }
              else {
                const packingSlipLineStatusDet = _.find(response.errors.data, (item) => item.errorCode === 6);
                if (packingSlipLineStatusDet) {
                  if (packingSlipLineStatusDet.invoiceLineStatus === CORE.MaterialInvoiceStatus.Approved) {
                    messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_ALLOW_UPDATE_PS_BASE_ON_INVOICE_STATUS);
                    messageContent.message = stringFormat(messageContent.message, 'edit', packingSlipLineStatusDet.invoiceSerialNumber, CORE.MaterialInvoiceStatusValue.Approved);
                  }
                  else if (packingSlipLineStatusDet.invoiceLineStatus === CORE.MaterialInvoiceStatus.Disapproved) {
                    messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_ALLOW_UPDATE_PS_BASE_ON_INVOICE_STATUS);
                    messageContent.message = stringFormat(messageContent.message, 'edit', packingSlipLineStatusDet.invoiceSerialNumber, CORE.MaterialInvoiceStatusValue.Disapproved);
                  }
                }
                else {
                  const existInSameBin = _.find(response.errors.data, (item) => item.errorCode === 2);
                  if (existInSameBin) {
                    messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.BIN_CONTAIN_SAME_PS_PART);
                    messageContent.message = stringFormat(messageContent.message, existInSameBin.binName, existInSameBin.PIDCode, existInSameBin.packingSlipNumber, existInSameBin.mfgCodeName);
                    vm.packingSlipDet.binID = vm.packingSlipDet.bin = vm.packingSlipDet.warehouseDisabled = vm.packingSlipDet.warehouse = vm.packingSlipDet.warehouseID = vm.packingSlipDet.parentWarehouseDisabled = vm.packingSlipDet.parentWarehouse = vm.packingSlipDet.parentWarehouseID = null;
                    focusColumnName = 'packingSlipBinName';
                  }
                  else {
                    const UMIDQtyDet = _.find(response.errors.data, (item) => item.errorCode === 3);
                    if (UMIDQtyDet) {
                      messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_ALLOW_TO_REDUCE_PACKING_SLIP_QTY_THEN_UMID_QTY);
                      messageContent.message = stringFormat(messageContent.message, UMIDQtyDet.umidCreatedQty);
                      focusColumnName = 'receivedQty';
                    }
                    else {
                      const UMIDCreated = _.find(response.errors.data, (item) => item.errorCode === 4);
                      if (UMIDCreated) {
                        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.UMID_CREATED_NOT_CHANGE_PACKAGING);
                        messageContent.message = stringFormat(messageContent.message, vm.packingSlipDet.packingSlipSerialNumber);
                        focusColumnName = 'packaging';
                        vm.autoPackaging.keyColumnId = null;
                      }
                      else {
                        const existInSameBinOfPackaging = _.find(response.errors.data, (item) => item.errorCode === 5);
                        if (existInSameBinOfPackaging) {
                          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.BIN_CONTAIN_SAME_PS_PACKAGING_PART);
                          messageContent.message = stringFormat(messageContent.message, vm.packingSlipDet.PIDCode, existInSameBinOfPackaging.PIDCode, existInSameBinOfPackaging.binName, existInSameBinOfPackaging.packingSlipNumber, existInSameBinOfPackaging.mfgCodeName);
                          vm.packingSlipDet.binID = vm.packingSlipDet.bin = vm.packingSlipDet.warehouseDisabled = vm.packingSlipDet.warehouse = vm.packingSlipDet.warehouseID = vm.packingSlipDet.parentWarehouseDisabled = vm.packingSlipDet.parentWarehouse = vm.packingSlipDet.parentWarehouseID = null;
                          focusColumnName = 'packingSlipBinName';
                        } else {
                          const IsReleaseLineDeleted = _.find(response.errors.data, (item) => item.errorCode === 7);
                          if (IsReleaseLineDeleted) {
                            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PO_RELEASE_LINE_IS_NOT_EXISTS);
                            messageContent.message = stringFormat(messageContent.message, redirectToPartDetail(vm.packingSlipDet.partID, vm.packingSlipDet.PIDCode), redirectToPOAnchorTag(vm.packingSlip.refPurchaseOrderID, vm.packingSlip.poNumber), vm.packingSlipDet.poLineID, vm.packingSlipDet.poReleaseNumber);
                          } else {
                            const RMAQtyDet = _.find(response.errors.data, (item) => item.errorCode === 8);
                            if (RMAQtyDet) {
                              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_ALLOW_TO_REDUCE_PACKING_SLIP_QTY_THEN_RMA_QTY);
                              messageContent.message = stringFormat(messageContent.message, RMAQtyDet.RMAQty);
                              focusColumnName = 'receivedQty';
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }

              if (messageContent) {
                const obj = {
                  messageContent,
                  multiple: true
                };
                DialogFactory.messageAlertDialog(obj).then(() => {
                  if (focusColumnName) {
                    if (focusColumnName === 'packaging') {
                      vm.focusOnPackaging = true;
                    } else {
                      setFocus(focusColumnName);
                    }
                  }
                  vm.saveBtnDisableFlag = false;
                });
              }
            } else {
              if (response.errors) {
                return BaseService.getErrorLog(response.errors);
              }
            }
          }
        } else {
          vm.saveBtnDisableFlag = false;
        }
      }).catch((error) => {
        vm.saveBtnDisableFlag = false;
        return BaseService.getErrorLog(error);
      });
    }
    /** Reset packing slip material detail form */
    vm.resetPackingSlipMaterialDet = () => {
      vm.saveBtnDisableFlag = false;
      vm.isReceivedQtyValueChange = false;
      vm.isEditLine = false;
      vm.isView = false;
      vm.focusOnPackaging = false;
      vm.materialDetTitle = 'Add';
      vm.autoCompleteAssyNickname = null;
      vm.packagingFlag = false;
      vm.autoPackaging = null;
      IdOfSelectMultipleBarcode = null;
      vm.isScanLabel = vm.isDisabledOrderQty = false;
      vm.purchaseInspectionList = vm.purchaseRequirementList = vm.poLineIDList = [];
      vm.autoCompleteRohsStatus.keyColumnId = null;
      vm.purchaseCommentHtmlStr = null;
      vm.purchaseCommentList = null;
      vm.isDisabledPendingStatus = vm.isDisabledAcceptedStatus = vm.askSamePartWithSamePackagingValidation = vm.isopenPopup = false;

      vm.packingSlipDet = {
        isReceivedWrongPart: false,
        refPackingSlipMaterialRecID: vm.packingSlipID,
        scanLabel: null,
        packingSlipSerialNumber: null,
        nickname: null,
        unit: null,
        unitDisabled: null,
        uomName: null,
        uomNameDisabled: null,
        warehouse: null,
        warehouseDisabled: null,
        parentWarehouse: null,
        parentWarehouseDisabled: null,
        orderedQty: null,
        receivedQty: null,
        totalReceivedQty: null,
        totalReceivedQtyDisabled: null,
        pendingQty: null,
        pendingQtyDisabled: null,
        disputeQty: null,
        disputeQtyDisabled: null,
        poReleaseNumber: null,
        packingSlipQty: null,
        packagingID: null,
        bin: null,
        receivedStatus: vm.packingSlipReceivedStatus[0].value,
        remark: null,
        allReceivedQty: null,
        isConfirmMissMatchQty: false,
        poLineID: null,
        EditPackaging: null,
        EditPackagingName: null,
        lineCustomerID: null
      };
      scanPackingSlipDetail = null;

      if (vm.autoCompleteLineCustomer && vm.autoCompleteLineCustomer.inputName) {
        $scope.$broadcast(vm.autoCompleteLineCustomer.inputName, null);
      }

      if (vm.packingSlipDetForm) {
        vm.packingSlipDetForm.$setPristine();
        vm.packingSlipDetForm.$setUntouched();
      }

      if (vm.autoCompletePOLine) {
        vm.autoCompletePOLine.keyColumnId = null;
      }

      $scope.$broadcast(vm.autoCompletecomponent ? vm.autoCompletecomponent.inputName : null, null);
      if (vm.packingSlip && vm.packingSlip.poNumber) {
        setFocus('scanLabel');
      }

      $timeout(() => {
        if (vm.packingSlipDetForm) {
          vm.packingSlipDetForm.$setPristine();
          vm.packingSlipDetForm.$setUntouched();
        }
        getMaterialAutoComplete();
      });
    };

    /* delete packing slip material*/
    vm.deleteRecord = (material) => {
      if (vm.packingSlip.lockStatus === vm.Transaction.CustomerPaymentLockStatus.Locked && !vm.loginUser.isUserSuperAdmin) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SUPPLIER_TRANSACTION_DELETE_VALIDATION_FOR_LOCKED_HALT_TRANSACTIONS);
        messageContent.message = stringFormat(messageContent.message, 'Locked');
        DialogFactory.messageAlertDialog({ messageContent });
        return;
      }
      if ((vm.packingSlip.status === vm.PackingSlipStatus.Approved || vm.packingSlip.status === vm.PackingSlipStatus.Paid)) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PACKING_SLIP_NOT_DELETE_APPROVED);
        return DialogFactory.messageAlertDialog({ messageContent });
      };

      let selectedIDs = [];
      let isRMACreated = false;
      let lineNumberContainMemo = null;
      if (material) {
        selectedIDs.push(material.id);
        isRMACreated = material.isRMACreated;
        lineNumberContainMemo = material.invoiceLineHasMemo ? material.packingSlipSerialNumber : null;
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((item) => {
            if (item.isRMACreated) {
              isRMACreated = true;
            }
            return item.id;
          });
          lineNumberContainMemo = _.map(_.filter(vm.selectedRows, (data) => data.invoiceLineHasMemo), 'packingSlipSerialNumber').join(', ');
        }
      }

      if (isRMACreated) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PACKING_SLIP_RMA_CREATED);
        return DialogFactory.messageAlertDialog({ messageContent }).then(() => { });
      }

      if (lineNumberContainMemo) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PS_LINE_NOT_DELETE_AS_MEMO_CREATED);
        messageContent.message = stringFormat(messageContent.message, lineNumberContainMemo);
        const obj = {
          messageContent: messageContent,
          multiple: true
        };
        return DialogFactory.messageAlertDialog(obj).then(() => {
        }).catch((error) => BaseService.getErrorLog(error));
      }

      if (selectedIDs) {
        getPackingSlipMaterialDetailStatus(selectedIDs, 'delete').then((res) => {
          if (res) {
            deletedMaterialDetail(selectedIDs);
          }
        }, (error) => BaseService.getErrorLog(error));
      }
    };

    function deletedMaterialDetail(selectedIDs) {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
      messageContent.message = stringFormat(messageContent.message, 'Packing slip material', selectedIDs.length);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      const objIDs = {
        id: selectedIDs
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          vm.cgBusyLoading = PackingSlipFactory.deletePackingSlipMaterial().query({
            objIDs: objIDs,
            refPackingSlipMaterialRecID: vm.packingSlipID,
            refPackingSlipNumberForInvoice: vm.packingSlip.refPackingSlipNumberForInvoice
          }).$promise.then((res) => {
            if (res && res.data && (res.data.TotalCount && res.data.TotalCount > 0)) {
              BaseService.deleteAlertMessage(res.data);
            } else {
              BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }, () => { }).catch((error) => BaseService.getErrorLog(error));
    }

    vm.CheckStepAndAction = () => {
      if (BaseService.focusRequiredField(vm.packingSlipForm) || vm.saveBtnDisableFlag || (vm.packingSlip.lockStatus === vm.Transaction.CustomerPaymentLockStatus.Locked && !vm.loginUser.isUserSuperAdmin)) {
        return;
      }

      vm.pageRefresh = vm.saveBtnDisableFlag = true;
      checkSOValidationAndConfirm();
    };

    vm.isStepValid = function (step) {
      let isValid = false;
      switch (step) {
        case 0: {
          let isDirty;
          if (vm.tabType === TRANSACTION.MaterialReceiveTabType.PackingSlip) {
            isDirty = (vm.packingSlipForm && vm.packingSlipForm.$dirty) || (vm.packingSlipDetForm && vm.packingSlipDetForm.$dirty);
          }

          if (isDirty) {
            isValid = showWithoutSavingAlertforTabChange(step);
          } else {
            isValid = true;
          }
          break;
        }
        case 1: {
          if (vm.packingSlipDocument) {
            vm.packingSlipDocument.$setPristine();
            vm.packingSlipDocument.$setUntouched();
          }
          break;
        }
        case 2: {
          if (vm.packingSlipOtherDetail && vm.packingSlipOtherDetail.$dirty) {
            isValid = showWithoutSavingAlertforTabChange(step, vm.packingSlipOtherDetail);
          } else {
            isValid = true;
          }
          break;
        }
      }
      return isValid;
    };


    /* Manually put as load "ViewDataElement directive" only on other details tab   */
    vm.onTabChanges = (TabName, msWizard) => {
      // BaseService.setLoginUserChangeDetail(false);
      if (TabName === vm.packingSlipTabName) {
        vm.IsPackingTab = true;
        vm.currentForm = msWizard.currentStepForm();
        // getPackingSlipDet();
      } else {
        vm.IsPackingTab = false;
      }

      if (TabName === vm.documentTabName) {
        vm.IsDocumentTab = true;
        vm.currentForm = msWizard.currentStepForm();
      } else {
        vm.IsDocumentTab = false;
      }

      if (TabName === vm.OtherDetailTabName) {
        vm.IsOtherDetailTab = true;
        vm.currentForm = msWizard.currentStepForm();
        // BaseService.currentPageForms = [vm.packingSlipOtherDetail];
      } else {
        vm.IsOtherDetailTab = false;
      }

      active();

      msWizard.selectedIndex = vm.selectedTabIndex;
      BaseService.currentPageForms = [vm.currentForm];
      vm.stateTransfer(TabName);
      $('#content').animate({
        scrollTop: 0
      }, 200);

      getPackingSlipDocumentCount();
    };

    vm.stateTransfer = (TabName) => {
      if (vm.packingSlipDetForm && vm.packingSlipDetForm.$dirty) {
        vm.resetPackingSlipMaterialDet();
      }
      switch (TabName) {
        case vm.packingSlipTabName:
          $state.transitionTo($state.$current, {
            type: TRANSACTION.MaterialReceiveTabType.PackingSlip,
            id: vm.packingSlipID
          }, {
            location: true,
            inherit: true,
            notify: false
          });
          break;
        case vm.documentTabName:
          $state.transitionTo($state.$current, {
            type: TRANSACTION.MaterialReceiveTabType.Documents,
            id: vm.packingSlipID
          }, {
            location: true,
            inherit: true,
            notify: false
          });
          break;
        case vm.OtherDetailTabName:
          $state.transitionTo($state.$current, {
            type: TRANSACTION.MaterialReceiveTabType.MISC,
            id: vm.packingSlipID
          }, {
            location: true,
            inherit: true,
            notify: false
          });
          break;
        default:
      }
    };


    const showWithoutSavingAlertforTabChange = (step) => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      return DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          vm.isSave = false;
          if (step === 0) {
            if (vm.packingSlipForm) {
              vm.packingSlipForm.$setPristine();
              vm.packingSlipForm.$setUntouched();
            }
            // getPackingSlipDet();
            vm.resetPackingSlipMaterialDet();
            return true;
          }
          if (step === 2) {
            if (vm.packingSlipOtherDetail) {
              vm.packingSlipOtherDetail.$setPristine();
              vm.packingSlipOtherDetail.$setUntouched();
            }
            return true;
          }
        }
      }, () => { }).catch((error) => BaseService.getErrorLog(error));
    };

    const savePackingSlipDet = () => {
      vm.packingSlip.status = vm.packingSlip.id > 0 ? vm.packingSlip.status : vm.packingSlip.packingSlipModeStatus === CORE.PackingSlipModeStatus[0].ID ? CORE.PackingSlipStatus.Investigate : CORE.PackingSlipStatus.WaitingForInvoice;
      vm.packingSlip.receiptDate = BaseService.getAPIFormatedDate(vm.packingSlip.receiptDate);
      vm.packingSlip.packingSlipDate = BaseService.getAPIFormatedDate(vm.packingSlip.packingSlipDate);
      vm.packingSlip.poDate = BaseService.getAPIFormatedDate(vm.packingSlip.poDate);
      vm.packingSlip.soDate = BaseService.getAPIFormatedDate(vm.packingSlip.soDate);
      vm.packingSlip.gencFileOwnerType = vm.entityName;
      vm.packingSlip.receiptType = CORE.packingSlipReceiptType.P.Key;
      if (vm.packingSlip.isNonUMIDStock && !vm.packingSlip.isNonUMIDStockdbObject) {
        const messageContent = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.ADDING_AS_NON_UMID_STOCK;
        return DialogFactory.messageConfirmDialog({
          messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        }).then(() => savePackingSlipBusyLoading(), () => vm.saveBtnDisableFlag = false);
      } else {
        savePackingSlipBusyLoading();
      }
    };

    const checkSOValidationAndConfirm = () => PackingSlipFactory.getSOListFromPO().query({ poNumber: vm.packingSlip.poNumber }).$promise.then((res) => {
      var SOList = [];
      if (res && res.data) {
        if (vm.packingSlip.refPurchaseOrderID && res.data.soNumber && res.data.soNumber.length > 0 && !vm.disablePackingSlipDetSO) {
          SOList = _.filter(_.flatMap(res.data.soNumber, (item) => _.split(item.soNumber, ',')), (item) => item);
          if ((_.findIndex(SOList, (item) => item && item.toLowerCase() === vm.packingSlip.supplierSONumber.toLowerCase())) === -1) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PACKING_SLIP_SO_MISMATCH_WITH_PO_FROM_PURCHASE_ORDER);
            messageContent.message = stringFormat(messageContent.message, vm.packingSlip.supplierSONumber, redirectToPOAnchorTag(vm.packingSlip.refPurchaseOrderID, vm.packingSlip.poNumber));
            const obj = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
            };
            DialogFactory.messageConfirmDialog(obj).then((yes) => {
              if (yes) {
                savePackingSlipDet();
              }
            }, () => {
              vm.saveBtnDisableFlag = false;
              vm.packingSlip.supplierSONumber = null;
              vm.packingSlip.soDate = null;
              $scope.$broadcast(vm.autoCompleteSO.inputName, null);
              setFocusByName(vm.autoCompleteSO.inputName);
              return;
            });
            return;
          }
        }

        if (SOList.length === 0 && res.data.supplierSONumber && res.data.supplierSONumber.length > 0 && (_.findIndex(res.data.supplierSONumber, (item) => item.supplierSONumber.toLowerCase() === vm.packingSlip.supplierSONumber.toLowerCase())) === -1) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PACKING_SLIP_SO_MISMATCH_WITH_PO_FROM_OTHER_PACKING_SLIP);
          messageContent.message = stringFormat(messageContent.message, vm.packingSlip.supplierSONumber, vm.packingSlip.poNumber);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              savePackingSlipDet();
            }
          }, () => {
            vm.saveBtnDisableFlag = false;
            vm.packingSlip.soDate = null;
            $scope.$broadcast(vm.autoCompleteSO.inputName, null);
            setFocusByName(vm.autoCompleteSO.inputName);
            return;
          });
          return;
        }

        SOList = _.filter(_.uniq([...SOList, _.map(res.data.supplierSONumber, 'supplierSONumber')]), (item) => item);
        vm.SOList = _.map(SOList, (item) => ({ supplierSONumber: item }));
        savePackingSlipDet();
      }
    }).catch((error) => BaseService.getErrorLog(error));

    const savePackingSlipBusyLoading = () => {
      vm.cgBusyLoading = PackingSlipFactory.savePackingSlip().query(vm.packingSlip).$promise.then((response) => {
        if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          if (vm.packingSlipForm) {
            vm.packingSlipForm.$setPristine();
            vm.packingSlipForm.$setUntouched();
          }
          if (vm.packingSlipDetForm) {
            vm.packingSlipDetForm.$setPristine();
            vm.packingSlipDetForm.$setUntouched();
          }
          vm.resetPackingSlipMaterialDet();
          if (response && response.data) {
            if (!vm.packingSlipID) {
              vm.packingSlipID = response.data.packingSlipDet.id;
              $state.go(TRANSACTION.TRANSACTION_MANAGE_MATERIAL_RECEIVE_STATE, {
                id: vm.packingSlipID
              });
            } else {
              if (vm.tabType === TRANSACTION.MaterialReceiveTabType.PackingSlip) {
                vm.loadData();
                getPackingSlipDet();
              }
            }
          }
        }
        else if (response.status === CORE.ApiResponseTypeStatus.FAILED) {
          if (response.errors && response.errors.data.errorCode === 1) {
            const obj = vm.autoCompleteSupplier && vm.autoCompleteSupplier.keyColumnId ? _.find(vm.supplierList, (data) => data.id === vm.autoCompleteSupplier.keyColumnId) : {};
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PACKING_SLIP_UNIQUE);
            messageContent.message = stringFormat(messageContent.message, 'packing slip#', vm.packingSlip && vm.packingSlip.packingSlipNumber ? vm.packingSlip.packingSlipNumber : null, obj && obj.mfgName ? obj.mfgName : null, 'packing slip#');
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model).then(() => {
              vm.packingSlip.packingSlipNumber = null;
              setFocus('packingSlipNumber');
            });
          }
        }
      }).catch((error) => BaseService.getErrorLog(error)).finally(() => {
        vm.saveBtnDisableFlag = false;
      });
    };
    /**
     * check date validation, secondDate must be greater than first date
     * Receipt date should not be less than packing List date and Packing List date should not be Less then Invoice date
     * @param {any} formobj
     * @param {any} firstDateColumn
     * @param {any} secondDateColumn
     */
    vm.checkDateValidation = () => {
      if (vm.packingSlip) {
        const packingSlipDate = new Date($filter('date')(vm.packingSlip.packingSlipDate, vm.DefaultDateFormat));
        const receiptDate = new Date($filter('date')(vm.packingSlip.receiptDate, vm.DefaultDateFormat));
        const receiptMinDate = new Date($filter('date')(vm.packingSlip.packingSlipDate, vm.DefaultDateFormat));

        if (vm.packingSlipForm) {
          if (vm.packingSlipForm.receiptDate) {
            if (receiptDate < packingSlipDate) {
              vm.packingSlipForm.receiptDate.$setDirty(true);
              vm.packingSlipForm.receiptDate.$touched = true;
              vm.packingSlipForm.receiptDate.$setValidity('mindate', false);
            } else {
              vm.packingSlipForm.receiptDate.$setValidity('mindate', true);
            }
          }
        }
        vm.receiptDateOptions.minDate = receiptMinDate;
      }
    };

    const showWithoutSavingAlertforBackButton = () => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          BaseService.currentPageForms = [];
          $state.go(TRANSACTION.TRANSACTION_MATERIAL_RECEIVE_STATE);
        }
      }, (error) => BaseService.getErrorLog(error));
    };

    vm.goBack = () => {
      let isDirty;
      if (isDirty) {
        return showWithoutSavingAlertforBackButton();
      } else {
        $state.go(TRANSACTION.TRANSACTION_MATERIAL_RECEIVE_STATE, {
          type: TRANSACTION.MaterialReceiveTabType.PackingSlip
        });
      }
    };
    vm.reScan = () => {
      if (vm.isScanLabelPS) {
        vm.packingSlip.scanLabelPS = vm.packingSlip.scanLabel = vm.packingSlip.poNumber = vm.packingSlip.supplierSONumber = vm.packingSlip.packingSlipNumber = vm.autoCompleteSupplier.keyColumnId = null;
        vm.packingSlip.poDate = null;
        vm.packingSlip.soDate = null;
        $scope.$broadcast(vm.autoCompleteSO.inputName, vm.packingSlip.supplierSONumber);
        vm.disablePackingSlipDet = vm.packingSlipDisable = vm.disableScanPS = vm.isScanLabelPS = vm.disablePO = vm.disableSO = vm.disablePackingSlipNumber = false;
        vm.packingSlipForm.$setPristine();
        vm.packingSlipForm.$setUntouched();
        setFocus('scanLabelPS');
      }
    };

    vm.checkSOMismatch = () => {
      if (vm.packingSlip.id && vm.packingSlip.scanLabel && vm.packingSlip.supplierSONumber && vm.packingSlip.supplierSONumber !== vm.packingSlip.supplierSONumberOld) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PACKING_SLIP_SCANNED_MISMATCH);
        messageContent.message = stringFormat(messageContent.message, 'SO#');
        const obj = {
          messageContent: messageContent,
          btnText: TRANSACTION.PackingSlipScanMismatchButton.RESET,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_FOR_CANCEL
        };
        return DialogFactory.messageConfirmDialog(obj).then(() => {
          vm.packingSlip.supplierSONumber = vm.packingSlip.scanLabel = vm.packingSlip.scanLabelPS = null;
          vm.packingSlip.soDate = null;
          $scope.$broadcast(vm.autoCompleteSO.inputName, vm.packingSlip.supplierSONumber);
          vm.disableSO = false;
          setFocus('scanLabelPS');
        }, () => {
          vm.packingSlip.supplierSONumber = vm.packingSlip.supplierSONumberOld;
          $scope.$broadcast(vm.autoCompleteSO.inputName, vm.packingSlip.supplierSONumber);
          setFocusByName('supplierSONumber');
        }, (error) => BaseService.getErrorLog(error));
      }
    };

    vm.scanLabelPS = (e) => {
      if (vm.isScanLabelPS || vm.packingSlip.scanLabel || vm.packingSlipDisable || vm.disableScanPS) {
        return;
      }
      $timeout(() => {
        scanLabelPS(e);
      }, true);
      /** Prevent enter key submit event */
      preventInputEnterKeyEvent(e);
    };

    const scanLabelPS = (e) => {
      if (e.keyCode === 13) {
        if (!vm.packingSlip.scanLabelPS) {
          return;
        }
        const scanlabel = {
          regxpString: vm.packingSlip.scanLabelPS,
          category: CORE.BarcodeCategory.PackingSlip
        };
        scanBarcodePS(scanlabel);
      }
    };

    const scanBarcodePS = (scanlabel) => {
      vm.cgBusyLoading = PackingSlipFactory.scanPackingBarcode().save(scanlabel).$promise.then((response) => {
        if (response.data && response.data.PackingSlip) {
          vm.packingSlip.scanLabel = vm.packingSlip.scanLabelPS;

          vm.packingSlip.poNumber = response.data.PackingSlip.poNumber ? response.data.PackingSlip.poNumber : null;
          vm.packingSlip.supplierSONumber = response.data.PackingSlip.supplierSONumber ? response.data.PackingSlip.supplierSONumber : null;
          $scope.$broadcast(vm.autoCompleteSO.inputName, vm.packingSlip.supplierSONumber);
          vm.packingSlip.packingSlipNumber = response.data.PackingSlip.packingSlipNumber ? response.data.PackingSlip.packingSlipNumber : null;

          if (response.data.PackingSlip.poNumber && response.data.PackingSlip.supplierSONumber && response.data.PackingSlip.packingSlipNumber) {
            vm.isScanLabelPS = vm.disablePO = vm.disableSO = vm.disablePackingSlipNumber = true;
            getPackingSlipDetByPO(true, true);
          } else if (response.data.PackingSlip.poNumber && response.data.PackingSlip.supplierSONumber) {
            vm.isScanLabelPS = vm.disablePO = vm.disableSO = true;
            getPackingSlipDetByPO(true, true);
          } else if (response.data.PackingSlip.poNumber) {
            vm.isScanLabelPS = vm.disablePO = true;
            getPackingSlipDetByPO(false, true);
          } else if (response.data.PackingSlip.supplierSONumber) {
            vm.isScanLabelPS = vm.disableSO = true;
            setFocus('poNumber');
          }
        } else if (response.data && response.data.messagecode === '0') {
          const obj = {
            title: USER.USER_INFORMATION_LABEL,
            textContent: response.data.Datamessage,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_ADDRECORD_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_SKIP_TEXT
          };
          DialogFactory.confirmDiolog(obj).then(() => {
            BaseService.openInNew(USER.ADMIN_MANAGE_BARCODE_LABEL_TEMPLATE_STATE);
          }, () => {
            vm.packingSlip.scanLabelPS = null;
            setFocus('scanLabelPS');
          }).catch((error) => BaseService.getErrorLog(error));
        } else if (response.data && response.data.messagecode === '9') {
          selectBarcodePopupPackingSlip(response.data.scanLabelPS);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.scanLabel = (e) => {
      $timeout(() => {
        scanlabel(e);
      }, true);
      /** Prevent enter key submit event */
      preventInputEnterKeyEvent(e);
    };

    const scanlabel = (e) => {
      if (e.keyCode === 13) {
        if (!vm.packingSlipDet.scanLabel) {
          return;
        }
        getPackingSlipDetByPO();
        IdOfSelectMultipleBarcode = null;
        const scanlabel = {
          regxpString: vm.packingSlipDet.scanLabel,
          category: CORE.BarcodeCategory.MFRPN,
          exculdePartStatus: CORE.PartStatusList.InActiveInternal
        };
        vm.purchaseCommentList = null;
        vm.packingSlipDet.receivedStatus = vm.isPOCanceled ? vm.packingSlipReceivedStatus[2].value : vm.packingSlipReceivedStatus[0].value;
        vm.cgBusyLoading = PackingSlipFactory.scanPackingBarcode().save(scanlabel).$promise.then((res) => {
          vm.isScanLabel = true;
          vm.packagingFlag = false;
          if (res.data) {
            if (res.data.Component) {
              // If scanned part is supplier PN and if part is not belongs to supplier of packing slip then we does not allow to receive that part
              if (res.data.Component.supplierMfgId && vm.autoCompleteSupplier && vm.autoCompleteSupplier.keyColumnId && res.data.Component.supplierMfgId !== vm.autoCompleteSupplier.keyColumnId) {
                const objSupplier = _.find(vm.supplierList, (data) => data.id === vm.autoCompleteSupplier.keyColumnId);
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MISMATCH_SUPPLIER);
                messageContent.message = stringFormat(messageContent.message, res.data.Component.supplierMFGPN, objSupplier ? objSupplier.mfgName : '');
                const model = {
                  messageContent: messageContent,
                  multiple: true
                };
                return DialogFactory.messageAlertDialog(model).then((yes) => {
                  if (yes) {
                    vm.resetPackingSlipMaterialDet();
                  }
                }, () => {
                }).catch((error) => BaseService.getErrorLog(error));
              }

              // If part is restrict with permission then ask permission before receive
              if (res.data.Component.restrictUSEwithpermission || res.data.Component.restrictPackagingUseWithpermission) {
                const objPart = res.data.Component;

                objPart.informationMsg = stringFormat('{0} {1}', res.data.Component.restrictUSEwithpermission ? stringFormat(TRANSACTION.PID_RECTRICTED_WITH_PERMISION, res.data.Component.PIDCode, CORE.RestrictWithPermissionLabel.RestrictUSEWithPermission) : stringFormat(TRANSACTION.PID_RECTRICTED_PACKAGING_WITH_PERMISION, res.data.Component.PIDCode, CORE.RestrictWithPermissionLabel.RestrictPackagingUSEWithPermission), TRANSACTION.FILL_DETAIL_FOR_SLIP);
                getAuthenticationOfApprovalPart(null, objPart);
              }
              else {
                const objPart = res.data.Component;
                scanPackingSlipDetail = res.data.PackingSlipDetail;
                if (objPart && objPart.supplierMFGPNID) {
                  vm.packingSlipDet.supplierMFGPNID = objPart.supplierMFGPNID;
                  vm.packingSlipDet.supplierCode = stringFormat('({0}) {1}', objPart.supplierMFGCode, objPart.supplierMFGName);
                  vm.packingSlipDet.supplierCodeDisabled = vm.packingSlipDet.supplierCode;
                  vm.packingSlipDet.supplierMfgCodeId = objPart.supplierMfgId;
                  vm.packingSlipDet.supplierPN = objPart.supplierMFGPN;
                  vm.packingSlipDet.supplierPNDisabled = vm.packingSlipDet.supplierPN;
                  vm.packingSlipDet.supplierRohsName = objPart.supplierRohsName;
                  vm.packingSlipDet.supplierRohsIcon = objPart.supplierRohsIcon;
                  vm.packingSlipDet.supplierPackagingId = objPart.supplierPackagingId;
                  vm.packingSlipDet.supplierSpq = objPart.supplierUmidSPQ;
                  vm.packingSlipDet.supplierPackageQty = objPart.supplierPkgQty;
                } else {
                  vm.packingSlipDet.supplierMFGPNID = null;
                  vm.packingSlipDet.supplierCodeDisabled = vm.packingSlipDet.supplierCode = null;
                  vm.packingSlipDet.supplierMfgCodeId = null;
                  vm.packingSlipDet.supplierPNDisabled = vm.packingSlipDet.supplierPN = null;
                  vm.packingSlipDet.supplierRohsName = null;
                  vm.packingSlipDet.supplierRohsIcon = null;
                  vm.packingSlipDet.supplierPackagingId = null;
                  vm.packingSlipDet.supplierSpq = null;
                  vm.packingSlipDet.supplierPackageQty = null;
                }
                vm.packingSlipDet.rohsstatus = objPart.RoHSStatusID;
                vm.autoCompleteRohsStatus.keyColumnId = objPart.RoHSStatusID;

                getComponentDetailsByMfg({
                  id: objPart.id,
                  mfgcodeID: objPart.mfgcodeID,
                  isContainCPN: true
                });
                initAutoComplete();
                setFocus('packingSlipSerialNumber');
              }
            } else {
              vm.isScanLabel = false;
              // If scanned part is not found or barcode label template not found then ask to add new part or barcode label template
              if (res.data.messagecode === '0' || res.data.messagecode === '4') {
                const obj = {
                  title: USER.USER_INFORMATION_LABEL,
                  textContent: res.data.Datamessage,
                  btnText: CORE.MESSAGE_CONSTANT.BUTTON_ADDRECORD_TEXT,
                  canbtnText: ''
                };
                if (res.data.messagecode && res.data.messagecode === '0') {
                  obj.canbtnText = CORE.MESSAGE_CONSTANT.BUTTON_SKIP_TEXT;
                } else {
                  obj.canbtnText = CORE.MESSAGE_CONSTANT.BUTTON_SKIP_PART_TEXT;
                }
                DialogFactory.confirmDiolog(obj).then((item) => {
                  if (item) {
                    if (res.data.messagecode === '0') {
                      BaseService.openInNew(USER.ADMIN_MANAGE_BARCODE_LABEL_TEMPLATE_STATE);
                    } else {
                      addNewComponent(res.data.MFGPart);
                    }
                  }
                }, () => {
                  vm.packingSlipDet.scanLabel = null;
                  setFocus('scanLabel');
                }).catch((error) => BaseService.getErrorLog(error));
              }
              // If part has multiple MFR then ask user to select part with proper manufacturer
              else if (res.data.messagecode === '5') {
                // If internal PO then first check release lines for that part and if more then one release line found then open release line popup
                if (vm.packingSlip.refPurchaseOrderID) {
                  const poMFRDet = {
                    refPurchaseOrderID: vm.packingSlip.refPurchaseOrderID,
                    mfgPN: res.data.MFGPart
                  };
                  vm.checkPOLinesforPart(poMFRDet, true);
                }
                else {
                  selectPartPopup(res.data.MFGPart);
                }
              } else if (['6', '8', '11', '12', '16'].indexOf(res.data.messagecode) !== -1) {
                vm.cgBusyLoading = false;
                const model = {
                  title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
                  textContent: res.data.messagecode === '11' ? stringFormat(res.data.Datamessage, 'receive') : res.data.Datamessage,
                  multiple: true
                };
                return DialogFactory.alertDialog(model).then((yes) => {
                  if (yes && res.data.messagecode === '8') {
                    BaseService.openInNew(USER.ADMIN_MANAGE_BARCODE_LABEL_TEMPLATE_STATE, {
                      id: res.data.MFGPart
                    });
                  } else {
                    vm.packingSlipDet.scanLabel = null;
                    setFocus('scanLabel');
                  }
                }, () => {
                }).catch((error) => BaseService.getErrorLog(error));
              } else if (res.data.messagecode === '9') {
                selectBarcodePopup(res.data.MFGPart);
              }
            }
          } else {
            vm.isScanLabel = false;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    const addNewComponent = (MFGPart) => {
      const event = angular.element.Event('click');
      angular.element('body').trigger(event);
      const data = {
        Name: MFGPart,
        mfgType: CORE.MFG_TYPE.MFG,
        category: CORE.PartCategory.Component
      };
      DialogFactory.dialogService(
        CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        CORE.MANAGE_COMPONENT_MODAL_VIEW,
        event,
        data).then(() => { }, () => { }, (error) => BaseService.getErrorLog(error));
    };

    const selectPartPopup = (mfgPart) => {
      const data = {
        mfgPart: mfgPart,
        supplierName: vm.packingSlip && vm.packingSlip.mfgCodemst ? vm.packingSlip.mfgCodemst.mfgName : null
      };
      DialogFactory.dialogService(
        TRANSACTION.SELECT_PART_MODAL_CONTROLLER,
        TRANSACTION.SELECT_PART_MODAL_VIEW,
        event,
        data).then(() => { }, (selectItem) => {
          if (selectItem) {
            popUpForMultipleListed(selectItem, 'MultiplePart');
            setFocus('packingSlipSerialNumber');
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    const selectBarcodePopupPackingSlip = (packingSlip) => {
      DialogFactory.dialogService(
        TRANSACTION.SELECT_BARCODE_MODAL_CONTROLLER,
        TRANSACTION.SELECT_BARCODE_MODAL_VIEW,
        event,
        packingSlip).then(() => { }, (selectItem) => {
          if (selectItem) {
            IdOfSelectMultipleBarcodePS = selectItem.id;
            popUpForMultipleListedPackingSlip(selectItem, 'MultipleBarcode');
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    const popUpForMultipleListedPackingSlip = (selectItem, selectType) => {
      if (selectItem) {
        const scanlabel = {
          regxpString: vm.packingSlip.scanLabelPS,
          barcodeId: selectType === 'MultipleBarcode' && selectItem ? selectItem.id : IdOfSelectMultipleBarcodePS ? IdOfSelectMultipleBarcodePS : null,
          category: CORE.BarcodeCategory.PackingSlip
        };
        scanBarcodePS(scanlabel);
      }
    };

    const selectBarcodePopup = (mfgPart) => {
      const data = mfgPart;
      DialogFactory.dialogService(
        TRANSACTION.SELECT_BARCODE_MODAL_CONTROLLER,
        TRANSACTION.SELECT_BARCODE_MODAL_VIEW,
        event,
        data).then(() => { }, (selectItem) => {
          if (selectItem) {
            IdOfSelectMultipleBarcode = selectItem.id;
            popUpForMultipleListed(selectItem, 'MultipleBarcode');
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    const popUpForMultipleListed = (selectItem, selectType) => {
      if (selectItem) {
        const scanlabel = {
          regxpString: vm.packingSlipDet.scanLabel,
          mfgId: selectType === 'MultiplePart' && selectItem ? selectItem.id : 0,
          barcodeId: selectType === 'MultipleBarcode' && selectItem ? selectItem.id : IdOfSelectMultipleBarcode ? IdOfSelectMultipleBarcode : null,
          category: CORE.BarcodeCategory.MFRPN
        };

        vm.purchaseCommentList = null;
        vm.packingSlipDet.receivedStatus = vm.isPOCanceled ? vm.packingSlipReceivedStatus[2].value : vm.packingSlipReceivedStatus[0].value;
        vm.cgBusyLoading = PackingSlipFactory.scanPackingBarcode().save(scanlabel).$promise.then((res) => {
          vm.isScanLabel = true;
          if (res.data && res.data.Component) {
            if (res.data.Component.supplierMfgId && vm.autoCompleteSupplier && res.data.Component.supplierMfgId !== vm.autoCompleteSupplier.keyColumnId) {
              const objSupplier = _.find(vm.supplierList, (data) => data.id === vm.autoCompleteSupplier.keyColumnId);
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MISMATCH_SUPPLIER);
              messageContent.message = stringFormat(messageContent.message, res.data.Component.supplierMFGPN, objSupplier ? objSupplier.mfgName : '');
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              return DialogFactory.messageAlertDialog(model).then((yes) => {
                if (yes) {
                  vm.resetPackingSlipMaterialDet();
                }
              }, () => {
              }).catch((error) => BaseService.getErrorLog(error));
            }

            if (res.data.Component.restrictUSEwithpermission || res.data.Component.restrictPackagingUseWithpermission) {
              const objPart = res.data.Component;

              objPart.informationMsg = stringFormat('{0} {1}', res.data.Component.restrictUSEwithpermission ? stringFormat(TRANSACTION.PID_RECTRICTED_WITH_PERMISION, res.data.Component.PIDCode, CORE.RestrictWithPermissionLabel.RestrictUSEWithPermission) : stringFormat(TRANSACTION.PID_RECTRICTED_PACKAGING_WITH_PERMISION, res.data.Component.PIDCode, CORE.RestrictWithPermissionLabel.RestrictPackagingUSEWithPermission), TRANSACTION.FILL_DETAIL_FOR_SLIP);
              getAuthenticationOfApprovalPart(null, objPart);
            } else {
              const objPart = res.data.Component;
              scanPackingSlipDetail = res.data.PackingSlipDetail;
              if (objPart.supplierMFGPNID) {
                vm.packingSlipDet.supplierMFGPNID = objPart.supplierMFGPNID;
                vm.packingSlipDet.supplierCode = stringFormat('({0}) {1}', objPart.supplierMFGCode, objPart.supplierMFGName);
                vm.packingSlipDet.supplierCodeDisabled = vm.packingSlipDet.supplierCode;
                vm.packingSlipDet.supplierMfgCodeId = objPart.supplierMfgId;
                vm.packingSlipDet.supplierPN = objPart.supplierMFGPN;
                vm.packingSlipDet.supplierPNDisabled = vm.packingSlipDet.supplierPN;
                vm.packingSlipDet.supplierRohsName = objPart.supplierRohsName;
                vm.packingSlipDet.supplierRohsIcon = objPart.supplierRohsIcon;
                vm.packingSlipDet.supplierPackagingId = objPart.supplierPackagingId;
                vm.packingSlipDet.supplierSpq = objPart.supplierPkgQty;
                vm.packingSlipDet.supplierPackageQty = objPart.supplierPkgQty;
              }
              getComponentDetailsByMfg({
                id: objPart.id,
                mfgcodeID: objPart.mfgcodeID,
                isContainCPN: true
              });
              initAutoComplete();
            }
          } else {
            vm.isScanLabel = false;
            if (res.data.messagecode === '0' || res.data.messagecode === '4') {
              const obj = {
                title: USER.USER_INFORMATION_LABEL,
                textContent: res.data.Datamessage,
                btnText: CORE.MESSAGE_CONSTANT.BUTTON_ADDRECORD_TEXT,
                canbtnText: ''
              };
              if (res.data.messagecode && res.data.messagecode === '0') {
                obj.canbtnText = CORE.MESSAGE_CONSTANT.BUTTON_SKIP_TEXT;
              } else {
                obj.canbtnText = CORE.MESSAGE_CONSTANT.BUTTON_SKIP_PART_TEXT;
              }
              DialogFactory.confirmDiolog(obj).then((item) => {
                if (item) {
                  if (res.data && res.data.messagecode === '0') {
                    BaseService.openInNew(USER.ADMIN_MANAGE_BARCODE_LABEL_TEMPLATE_STATE);
                  } else {
                    addNewComponent(res.data.MFGPart);
                  }
                }
              }, () => {
                vm.packingSlipDet.scanLabel = null;
                setFocus('scanLabel');
              }).catch((error) => BaseService.getErrorLog(error));
            } else if (res.data.messagecode === '5') {
              selectPartPopup(res.data.MFGPart);
            } else if (['6', '8', '11', '12', '16'].indexOf(res.data.messagecode) !== '-1') {
              vm.cgBusyLoading = false;
              const model = {
                title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
                textContent: res.data.messagecode === '11' ? stringFormat(res.data.Datamessage, 'receive') : res.data.Datamessage,
                multiple: true
              };
              return DialogFactory.alertDialog(model).then((yes) => {
                if (yes && res.data.messagecode === '8') {
                  BaseService.openInNew(USER.ADMIN_MANAGE_BARCODE_LABEL_TEMPLATE_STATE, {
                    id: res.data.MFGPart
                  });
                }
              }, () => {

              }).catch((error) => BaseService.getErrorLog(error));
            } else if (res.data.messagecode === '9') {
              selectBarcodePopup(res.data.MFGPart);
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.changeOrderQty = () => {
      if (!vm.packingSlipDet.receivedQty) {
        const pendingQty = ((vm.packingSlipDet.orderedQty || 0) - (vm.packingSlipDet.totalReceivedQty || 0)) + (vm.packingSlipDet.oldReceivedQty && vm.packingSlipDet.id ? (vm.packingSlipDet.oldReceivedQty || 0) : 0);
        vm.packingSlipDet.receivedQty = pendingQty > 0 ? pendingQty : null;
      }

      if (!vm.packingSlipDet.packingSlipQty && !vm.packingSlipDetForm.packingSlipQty.$dirty) {
        vm.packingSlipDet.packingSlipQty = vm.packingSlipDet.receivedQty;
      }
    };

    vm.changeReceivedQty = (isFromAllReceivedQty) => {
      if (isFromAllReceivedQty) {
        changeReceivedQty();
      } else {
        if (vm.packingSlipDet.allReceivedQty && vm.packingSlipDet.receivedQty !== _.sum(_.map(vm.packingSlipDet.allReceivedQty.split(','), (item) => parseInt(item)))) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RECEIVED_QTY_CONFIRMATION);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              vm.packingSlipDet.allReceivedQty = null;
              changeReceivedQty();
              setFocus('packingSlipQty');
            }
          }, () => {
            vm.packingSlipDet.receivedQty = _.sum(_.map(vm.packingSlipDet.allReceivedQty.split(','), (item) => parseInt(item)));
            changeReceivedQty();
            setFocus('packingSlipQty');
          }, (error) => BaseService.getErrorLog(error));
        } else {
          changeReceivedQty();
        }
      }
    };

    const changeReceivedQty = () => {
      if (!vm.packingSlipDet.packingSlipQty && !vm.packingSlipDetForm.packingSlipQty.$dirty) {
        vm.packingSlipDet.packingSlipQty = vm.packingSlipDet.receivedQty;
        vm.packingSlipDet.disputeQty = 0;
        vm.packingSlipDet.disputeQtyDisabled = vm.packingSlipDet.disputeQty;
      } else {
        vm.packingSlipDet.disputeQty = vm.packingSlipDet.packingSlipQty - vm.packingSlipDet.receivedQty;
        vm.packingSlipDet.disputeQtyDisabled = vm.packingSlipDet.disputeQty;
      }
      //vm.checkMissmatchInQty('RQ');
      checkPackagingBySPQ('Packaging');
    };

    // copy part number on click
    /** copy part number on click */
    vm.copyText = (copytext) => {
      const $temp = $('<input>');
      $('body').append($temp);
      $temp.val(copytext).select();
      document.execCommand('copy');
      $temp.remove();
      vm.showstatus = true;
    };

    /** remove copied status on hover */
    vm.checkStatus = () => vm.showstatus = false;

    /** search part from Digikey */
    vm.searchToDigikey = (part) => BaseService.openURLInNew(RFQTRANSACTION.API_LINKS.DIGIKEY + part);

    /** Get detail of order and received quantity based on selected part and sales order number */
    vm.getPackingSlipPartQtyByPO = () => {
      if (vm.packingSlip && vm.packingSlipDet && vm.packingSlip.poNumber && vm.packingSlipDet.poLineID) {
        if (!vm.packingSlipDet.id) {
          PackingSlipFactory.getPackingSlipPartQtyByPO().query({
            poNumber: vm.packingSlip.poNumber,
            refPOLineID: vm.packingSlipDet.poLineID
          }).$promise.then((response) => {
            if (response && response.data && response.data.qtyDetail) {
              vm.packingSlipDet.orderedQty = vm.packingSlipDet.orderedQty ? vm.packingSlipDet.orderedQty : response.data.qtyDetail.orderedQty;
              const pendingQty = (vm.packingSlipDet.orderedQty - response.data.qtyDetail.totalPackingSlipQty);
              vm.packingSlipDet.receivedQty = vm.packingSlipDetForm.receivedQty.$dirty ? vm.packingSlipDet.receivedQty : (pendingQty > 0 ? pendingQty : (vm.packagingFlag ? vm.packingSlipDet.receivedQty : 0));
              vm.packingSlipDet.packingSlipQty = vm.packingSlipDetForm.packingSlipQty.$dirty ? vm.packingSlipDet.packingSlipQty : (pendingQty > 0 ? pendingQty : (vm.packagingFlag ? vm.packingSlipDet.packingSlipQty : 0));
              vm.packingSlipDet.disputeQty = vm.packingSlipDet.packingSlipQty - vm.packingSlipDet.receivedQty;
              vm.packingSlipDet.disputeQtyDisabled = vm.packingSlipDet.disputeQty;
              vm.packingSlipDet.totalReceivedQty = response.data.qtyDetail.totalReceived || 0;
              vm.packingSlipDet.totalReceivedQtyDisabled = vm.packingSlipDet.totalReceivedQty;
              vm.packingSlipDet.pendingQty = pendingQty || 0;
              vm.packingSlipDet.pendingQtyDisabled = vm.packingSlipDet.pendingQty;
              vm.packingSlipDet.allReceivedQty = vm.packingSlipDet.receivedQty ? vm.packingSlipDet.allReceivedQty : null;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      } else {
        vm.packingSlipDet.orderedQty = vm.packingSlipDet.orderedQty || !vm.packingSlipDetForm.orderedQty.$dirty ? vm.packingSlipDet.orderedQty : null;
        vm.packingSlipDet.receivedQty = vm.packingSlipDetForm.receivedQty.$dirty ? vm.packingSlipDet.receivedQty : (vm.packingSlipDet.receivedQty || vm.packagingFlag ? vm.packingSlipDet.receivedQty : null);
        vm.packingSlipDet.packingSlipQty = vm.packingSlipDetForm.packingSlipQty.$dirty ? vm.packingSlipDet.packingSlipQty : (vm.packingSlipDet.packingSlipQty || vm.packagingFlag ? vm.packingSlipDet.packingSlipQty : null);
        vm.packingSlipDet.totalReceivedQty = vm.packingSlipDet.totalReceivedQty || null;
        vm.packingSlipDet.totalReceivedQtyDisabled = vm.packingSlipDet.totalReceivedQty;
        vm.packingSlipDet.pendingQty = vm.packingSlipDet.pendingQty || vm.packingSlipDet.pendingQty === 0 ? vm.packingSlipDet.pendingQty : null;
        vm.packingSlipDet.pendingQtyDisabled = vm.packingSlipDet.pendingQty;
        vm.packingSlipDet.allReceivedQty = vm.packingSlipDet.receivedQty ? vm.packingSlipDet.allReceivedQty : null;
        vm.packingSlipDet.disputeQty = vm.packingSlipDet.disputeQty && vm.packingSlipDet.disputeQty === 0 ? vm.packingSlipDet.disputeQty : null;
        vm.packingSlipDet.disputeQtyDisabled = vm.packingSlipDet.disputeQty;
      }
    };

    /** Redirect to packing slip list page */
    vm.goToPackingSlipList = () => BaseService.goToPackingSlipList();

    /** Add track number */
    function addTrackNumber() {
      const index = _.findIndex(vm.packingSlip.packingSlipTrackNumber, (obj) => !obj.trackNumber);
      if (index !== -1) {
        $timeout(() => {
          setFocus('trackNumber_' + index);
        });
      } else {
        vm.packingSlip.packingSlipTrackNumber.push({
          trackNumber: null,
          refPackingSlipMaterialRecID: vm.packingSlipID
        });
      }
      vm.isAddTrackDisable = _.filter(vm.packingSlip.packingSlipTrackNumber, (obj) => !obj.trackNumber).length > 0;
    }

    /** Add/Update track number */
    vm.addTrackingNumberToList = (event) => {
      if (event.keyCode === 13 && !(vm.packingSlip.lockStatus === vm.Transaction.CustomerPaymentLockStatus.Locked && !vm.loginUser.isUserSuperAdmin) && !vm.disableTrackingNumber) {
        vm.disableTrackingNumber = true;
        $timeout(() => {
          if (!vm.trackingNumberDet.trackNumber || !vm.trackingNumberDet.trackNumber.trim()) {
            vm.disableTrackingNumber = false;
            setFocus('trackingNumber');
            return;
          }
          if (vm.checkUniqueTrackNumber()) {
            vm.disableTrackingNumber = false;
            setFocus('trackingNumber');
            const trackingNumberDet = _.find(vm.packingSlip.packingSlipTrackNumber, (obj) => obj.tempID === vm.trackingNumberDet.tempID);
            if (trackingNumberDet) {
              trackingNumberDet.trackNumber = vm.trackingNumberDet.trackNumber;
            } else {
              vm.packingSlip.packingSlipTrackNumber.push({
                trackNumber: vm.trackingNumberDet.trackNumber,
                refPackingSlipMaterialRecID: vm.packingSlipID,
                tempID: (vm.packingSlip.packingSlipTrackNumber.length + 1)
              });
            }
            vm.trackingNumberDet = {
              trackNumber: null
            };
          }
        });

        /** Prevent enter key submit event */
        preventInputEnterKeyEvent(event);
      }
    };

    /** Edit track number */
    vm.editTrackingNumber = (item) => {
      if (vm.packingSlip.lockStatus === vm.Transaction.CustomerPaymentLockStatus.Locked && !vm.loginUser.isUserSuperAdmin) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.INVOICE_CREATED_AGAINST_PACKING_SLIP);
        messageContent.message = stringFormat(messageContent.message, vm.packingSlip.refInvoice.invoiceNumber);
        const model = {
          messageContent: messageContent,
          multiple: false
        };
        return DialogFactory.messageAlertDialog(model).then(() => {
          vm.trackingNumberDet.trackNumber = null;
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.trackingNumberDet = angular.copy(item);
      }
    };

    /** Remove track number from list */
    vm.removeTrackNumber = (item, index) => {
      if (vm.packingSlip.lockStatus === vm.Transaction.CustomerPaymentLockStatus.Locked && !vm.loginUser.isUserSuperAdmin) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.INVOICE_CREATED_AGAINST_PACKING_SLIP);
        messageContent.message = stringFormat(messageContent.message, vm.packingSlip.refInvoice.invoiceNumber);
        const model = {
          messageContent: messageContent,
          multiple: false
        };
        return DialogFactory.messageAlertDialog(model).then(() => {
          vm.trackingNumberDet.trackNumber = null;
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.packingSlip.removePackingSlipTrackNumberIds = vm.packingSlip.removePackingSlipTrackNumberIds || [];
        if (item) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, 'Packing slip tracking number', '');
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };

          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              vm.packingSlipForm.$setDirty(true);
              if (item.id > 0) {
                vm.packingSlip.removePackingSlipTrackNumberIds.push(item.id);
              }

              vm.packingSlip.packingSlipTrackNumber.splice(index, 1);
              const numberIndex = _.findIndex(vm.packingSlip.packingSlipTrackNumber, (obj) => obj.trackNumber === item.trackNumber);
              $timeout(() => {
                if (numberIndex === -1) {
                  vm.packingSlipForm.trackingNumber.$setValidity('duplicate', true);
                }
              });
              vm.isAddTrackDisable = _.filter(vm.packingSlip.packingSlipTrackNumber, (obj) => !obj.trackNumber).length > 0;
              _.each(vm.packingSlip.packingSlipTrackNumber, (item, index) => {
                item.tempID = (index + 1);
              });

              setFocus('trackingNumber');
            }
          }, () => {
            setFocus('trackingNumber');
          }).catch((error) => BaseService.getErrorLog(error));
        }

        vm.isAddTrackDisable = _.filter(vm.packingSlip.packingSlipTrackNumber, (obj) => !obj.trackNumber).length > 0;
      }
    };

    /** Set/Remove duplicate validation if track number is duplicate */
    vm.checkUniqueTrackNumber = () => {
      const checkDuplicate = _.find(vm.packingSlip.packingSlipTrackNumber, (obj) => obj.tempID !== vm.trackingNumberDet.tempID && obj.trackNumber === vm.trackingNumberDet.trackNumber);
      if (checkDuplicate) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALREADY_EXISTS);
        messageContent.message = stringFormat(messageContent.message, 'Tracking# ' + vm.trackingNumberDet.trackNumber);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model).then((yes) => {
          if (yes) {
            vm.disableTrackingNumber = false;
            vm.trackingNumberDet.trackNumber = null;
            setFocus('trackingNumber');
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
        return false;
      }
      return true;
    };

    /** Redirect to manufacturer page */
    vm.goToMFGList = () => {
      BaseService.openInNew(USER.ADMIN_MANUFACTURER_STATE, {});
    };

    /** Redirect to part master page */
    vm.goToMFGPartList = () => {
      BaseService.openInNew(USER.ADMIN_MFG_COMPONENT_STATE, {});
    };

    /** Redirect to UOM page */
    vm.goToUomList = () => {
      BaseService.openInNew(USER.ADMIN_UNIT_STATE, {});
    };

    vm.goToSupplierList = () => {
      BaseService.goToSupplierList();
      return false;
    };

    vm.goToSupplierDetail = () => {
      BaseService.goToSupplierDetail(vm.packingSlip && vm.packingSlip.mfgCodemst && vm.packingSlip.mfgCodemst.id ? vm.packingSlip.mfgCodemst.id : vm.packingSlip.mfgCodeID);
      return false;
    };

    vm.scanDocument = () => {
      if ((!vm.packingSlipID) || vm.packingSlipDisable) {
        return;
      }
      const scanDocumentDet = {
        id: vm.packingSlip.id,
        filePrefix: `${vm.packingSlip.mfgCode}-${vm.packingSlip.packingSlipNumber}-${$filter('date')(new Date(), 'MMddyyyyhhmmss')}`,
        gencFileOwnerType: vm.entityName,
        mfgCodeID: vm.packingSlip.mfgCodeID
      };
      DialogFactory.dialogService(
        CORE.PREVIEW_SCAN_DOCUMENT_MODAL_CONTROLLER,
        CORE.PREVIEW_SCAN_DOCUMENT_MODAL_VIEW,
        event,
        scanDocumentDet).then((response) => {
          if (response && response.saveDocument) {
            getPackingSlipDocumentCount();
          }
          if (vm.IsDocumentTab) {
            $rootScope.$emit('refreshDocuments', true);
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    function setPackingSlipData(data) {
      //If not published, user cannot create PS
      if (data && data.postatus === 0) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PO_STATUS_IN_DRAFT_MODE);
        messageContent.message = stringFormat(messageContent.message, redirectToPOAnchorTag(data.poID, vm.packingSlip.poNumber));
        const model = {
          messageContent: messageContent,
          multiple: false
        };
        return DialogFactory.messageAlertDialog(model).then(() => {
          //vm.trackingNumberDet.trackNumber = null here;
          if (vm.isScanLabelPS) {
            vm.reScan();
          } else {
            vm.packingSlip.poNumber = null;
            setFocus('poNumber');
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }

      vm.packingSlip.refPurchaseOrderID = data.poID ? data.poID : null;
      if (vm.packingSlip.refPurchaseOrderID) {
        vm.packingSlip.isCustConsigned = data.isCustConsigned;
        if (!vm.packingSlipID) {
          vm.packingSlip.isNonUMIDStock = data.isNonUMIDStock;
        }
        vm.packingSlip.CustomerID = data.customerID;
        if (vm.autoCompleteLineCustomer) {
          if (vm.packingSlip.CustomerID) {
            getSupplierMfgCodeSearch({
              mfgcodeID: vm.packingSlip.CustomerID,
              type: CORE.MFG_TYPE.MFG,
              isCustomer: true
            });
          } else {
            $scope.$broadcast(vm.autoCompleteLineCustomer.inputName, null);
          }
        }
      }
      // vm.packingSlip.refPurchaseOrderID = vm.sysgenPOID;
      vm.posupplierSONumber = data.posupplierSONumber ? data.posupplierSONumber : null;
      if (!vm.packingSlip.id && (data.supplierSONumber || (data.posupplierSONumber && data.posupplierSONumber.trim())) && (!vm.packingSlip.scanLabel || (vm.packingSlip.scanLabel && !vm.packingSlip.supplierSONumber))) {
        vm.packingSlip.supplierSONumber = null;
      }
      //validation for empty so
      if ((!vm.packingSlip.scanLabel || (vm.packingSlip.scanLabel && !vm.packingSlip.supplierSONumber))) {
        if (vm.packingSlip.refPurchaseOrderID && !vm.packingSlip.supplierSONumber) {
          if (data.supplierSONumber) {
            vm.packingSlip.supplierSONumber = data.supplierSONumber;
          }
          else if (data.posupplierSONumber) {
            vm.packingSlip.supplierSONumber = _.split(data.posupplierSONumber, ',')[0];
          }
        }
        else if (!vm.packingSlip.id && data.supplierSONumber && !vm.packingSlip.refPurchaseOrderID) {
          //add default packing slip SO# in case of external PO
          vm.packingSlip.supplierSONumber = data.supplierSONumber;
        }
      }
      $scope.$broadcast(vm.autoCompleteSO.inputName, vm.packingSlip.supplierSONumber);
      vm.packingSlip.poComment = data.poComment ? data.poComment : null;
      vm.packingSlip.poCommentDisabledField = vm.packingSlip.poComment;
      vm.packingSlip.poInternalNotes = data.shippingComment ? data.shippingComment : null;
      vm.packingSlip.poInternalNotesDisabledField = vm.packingSlip.poInternalNotes;
      if (data.poDate || data.po_poDate) {
        vm.packingSlip.poDate = BaseService.getUIFormatedDate((data.poDate || data.po_poDate), vm.DefaultDateFormat);
      }
      if (!vm.packingSlip.soDate && (data.soDate || data.po_soDate)) {
        vm.packingSlip.soDate = BaseService.getUIFormatedDate((data.soDate || data.po_soDate), vm.DefaultDateFormat);
      }
      if (vm.autoCompleteSupplier) {
        vm.autoCompleteSupplier.keyColumnId = data.mfgCodeID ? data.mfgCodeID : data.pomfgCodeID;
      }
      const id = _.first((data.packingSlipIDs || '').split(','));
      if (data.packingSlipCount > 1 || vm.packingSlip.id !== parseInt(id)) {
        if (vm.packingSlip.refPurchaseOrderID) {
          vm.disablePackingSlipDet = false;
          if (data.packingSlipCount > 1 || data.supplierSONumber) {
            vm.disablePackingSlipDet = true;
          }
        }
        else {
          vm.disablePackingSlipDet = true;
        }
        if (vm.packingSlipID) {
          if (vm.packingSlipDet && vm.packingSlipDet.partID) {
            setFocus('packingSlipSerialNumber');
          } else {
            setFocus('scanLabel');
          }
        } else {
          if (!vm.disablePackingSlipDet) {
            if (vm.packingSlip.supplierSONumber) {
              if (vm.packingSlip.soDate) {
                setFocus('packingSlipNumber');
              }
              else {
                setFocus('soDate');
              }
            }
            else { setFocusByName('supplierSONumber'); }
          } else {
            setFocus('packingSlipNumber');
          }
        }
      } else {
        vm.disablePackingSlipDet = false;
        setFocusByName('supplierSONumber');
      }
    }

    /** Get supplier and supplier order number by purchase order number*/
    function getPackingSlipDetByPO(scan, isPOSelect) {
      if (vm.packingSlip && vm.packingSlip.poNumber) {
        vm.cgBusyLoading = PackingSlipFactory.getPackingSlipDetByPO().query({
          poNumber: vm.packingSlip.poNumber
        }).$promise.then((response) => {
          vm.disablePackingSlipDet = false;
          //if (vm.autoCompleteSupplier) {
          //  vm.autoCompleteSupplier.keyColumnId = null;
          //}
          vm.packingSlip.poComment = null;
          vm.packingSlip.poCommentDisabledField = null;
          vm.packingSlip.poInternalNotes = null;
          vm.packingSlip.poInternalNotesDisabledField = null;
          vm.isPOCanceled = false;
          vm.packingSlip.refPurchaseOrderID = null;
          const purchaseOrderDet = response.data;
          if (!scan && vm.packingSlip.id && vm.packingSlip.scanLabel && vm.packingSlip.poNumber !== vm.packingSlip.poNumberOld) {
            vm.cgBusyLoading = false;
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PACKING_SLIP_SCANNED_MISMATCH);
            messageContent.message = stringFormat(messageContent.message, 'PO#');
            const obj = {
              messageContent: messageContent,
              btnText: TRANSACTION.PackingSlipScanMismatchButton.RESET,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_FOR_CANCEL
            };
            return DialogFactory.messageConfirmDialog(obj).then(() => {
              vm.packingSlip.poNumber = vm.packingSlip.scanLabel = vm.packingSlip.scanLabelPS = null;
              vm.disablePO = false;
              setFocus('scanLabelPS');
            }, () => {
              vm.packingSlip.poNumber = vm.packingSlip.poNumberOld;
              setFocus('poNumber');
            }, (error) => BaseService.getErrorLog(error));
          }

          if (purchaseOrderDet) {
            if (purchaseOrderDet.poWorkingStatus === vm.CORE.PO_Working_Status.Completed.id && isPOSelect) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PO_IS_COMPLETED);
              messageContent.message = stringFormat(messageContent.message, redirectToPOAnchorTag(purchaseOrderDet.poID, vm.packingSlip.poNumber));
              const obj = {
                messageContent: messageContent,
                multiple: true
              };
              return DialogFactory.messageAlertDialog(obj).then((yes) => {
                if (yes) {
                  if (vm.packingSlip.scanLabelPS) {
                    vm.reScan();
                  } else {
                    vm.packingSlip.poNumber = null;
                    setFocus('poNumber');
                  }
                }
              }, () => {
              }).catch((error) => BaseService.getErrorLog(error));
            } else {
              if (purchaseOrderDet.poWorkingStatus) {
                vm.isPOCanceled = response.data.poWorkingStatus === vm.CORE.PO_Working_Status.Canceled.id;
              }
              if (purchaseOrderDet.poWorkingStatus === vm.CORE.PO_Working_Status.Canceled.id && isPOSelect) {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PO_ALREADY_CANCELED);
                messageContent.message = stringFormat(messageContent.message, redirectToPOAnchorTag(purchaseOrderDet.poID, vm.packingSlip.poNumber));
                const model = {
                  messageContent: messageContent,
                  btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                  canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                };
                return DialogFactory.messageConfirmDialog(model).then((yes) => {
                  if (yes) {
                    vm.packingSlipDet.receivedStatus = vm.packingSlipReceivedStatus[2].value;
                    setPackingSlipData(purchaseOrderDet);
                  }
                }, () => {
                  vm.packingSlip.poNumber = null;
                  setFocus('poNumber');
                  vm.isPOCanceled = false;
                }).catch((error) => BaseService.getErrorLog(error));
              }
              setPackingSlipData(purchaseOrderDet);
            }
          } else {
            if (!vm.packingSlip.poDate) {
              setFocus('poDate');
            } else {
              if (scan) {
                if (vm.packingSlip.packingSlipNumber) {
                  checkUniquePackingSlipNumber();
                } else {
                  setFocusByName(vm.autoCompleteSupplier.inputName);
                }
              } else {
                //vm.packingSlip.supplierSONumber = null;
                //$scope.$broadcast(vm.autoCompleteSO.inputName, vm.packingSlip.supplierSONumber);
                vm.disablePackingSlipDet = false;
                setFocus('poDate');
                //setFocusByName(vm.autoCompleteSO.inputName);
              }
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    }

    /* Check unique name validation for packing slip #*/
    // vm.checkUniquePackingSlipNumber = () => {
    function checkUniquePackingSlipNumber() {
      if (vm.packingSlip.id && vm.packingSlip.scanLabel && vm.packingSlip.packingSlipNumber && vm.packingSlip.packingSlipNumber !== vm.packingSlip.packingSlipNumberOld) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PACKING_SLIP_SCANNED_MISMATCH);
        messageContent.message = stringFormat(messageContent.message, 'Packing Slip#');
        const obj = {
          messageContent: messageContent,
          btnText: TRANSACTION.PackingSlipScanMismatchButton.RESET,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_FOR_CANCEL
        };
        return DialogFactory.messageConfirmDialog(obj).then(() => {
          vm.packingSlip.packingSlipNumber = vm.packingSlip.scanLabel = vm.packingSlip.scanLabelPS = null;
          vm.disablePackingSlipNumber = false;
          setFocus('scanLabelPS');
        }, () => {
          vm.packingSlip.packingSlipNumber = vm.packingSlip.packingSlipNumberOld;
          setFocus('packingSlipNumber');
        }, (error) => BaseService.getErrorLog(error));
      }
      if (vm.packingSlip && vm.packingSlip.mfgCodeID && (vm.sourceData && vm.sourceData.length > 0)) {
        const checkWrongSupplierList = _.filter(vm.sourceData, (data) => data.supplierMfgCodeId && data.supplierMfgCodeId !== vm.packingSlip.mfgCodeID);
        let pidString;
        if (checkWrongSupplierList && checkWrongSupplierList.length > 0) {
          pidString = _.map(checkWrongSupplierList, 'supplierPN').join(',');
        }
        if (pidString) {
          const objSupplier = _.find(vm.supplierList, (data) => data.id === vm.packingSlip.mfgCodeID);
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MISMATCH_SUPPLIER);
          messageContent.message = stringFormat(messageContent.message, pidString, objSupplier ? objSupplier.mfgName : '');
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          return DialogFactory.messageAlertDialog(model).then((yes) => {
            if (yes) {
              vm.autoCompleteSupplier.keyColumnId = null;
            }
          }, () => {

          }).catch((error) => BaseService.getErrorLog(error));
        }
      }

      if (vm.packingSlip.packingSlipNumber && vm.packingSlip.mfgCodeID) {
        vm.cgBusyLoading = PackingSlipFactory.checkUniquePackingSlipNumber().query({
          id: vm.packingSlip.id || 0,
          name: vm.packingSlip.packingSlipNumber,
          mfgCodeId: vm.packingSlip.mfgCodeID,
          receiptType: 'P'
        }).$promise.then((res) => {
          vm.cgBusyLoading = false;
          if (res && res.data) {
            const obj = vm.autoCompleteSupplier && vm.autoCompleteSupplier.keyColumnId ? _.find(vm.supplierList, (data) => data.id === vm.autoCompleteSupplier.keyColumnId) : {};
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PACKING_SLIP_UNIQUE);
            messageContent.message = stringFormat(messageContent.message, 'packing slip#', vm.packingSlip && vm.packingSlip.packingSlipNumber ? vm.packingSlip.packingSlipNumber : null, obj && obj.mfgName ? obj.mfgName : null, 'packing slip#');
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                if (vm.isScanLabelPS) {
                  vm.disablePackingSlipNumber = false;
                }
                vm.packingSlip.packingSlipNumber = null;
                setFocus('packingSlipNumber');
              }
            }, () => {

            }).catch((error) => BaseService.getErrorLog(error));
          } else {
            if (vm.isScanLabelPS) {
              if (!vm.packingSlip.supplierSONumber) {
                setFocusByName('supplierSONumber');
              } else if (!vm.packingSlip.soDate) {
                setFocus('soDate');
              } else {
                if (!vm.autoCompleteSupplier.keyColumnId) {
                  setFocusByName(vm.autoCompleteSupplier.inputName);
                } else {
                  setFocus('packingSlipDate');
                }
              }
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else if (vm.isScanLabelPS) {
        if (vm.packingSlip.supplierSONumber) {
          if (vm.packingSlip.soDate) {
            if (!vm.packingSlip.mfgCodeID) {
              setFocusByName(vm.autoCompleteSupplier.inputName);
            } else {
              setFocus('packingSlipNumber');
            }
          }
          else {
            setFocus('soDate');
          }
        } else {
          setFocusByName('supplierSONumber');
        }
      }
    }

    vm.getQtySum = (columnName) => {
      const sum = CalcSumofArrayElement(_.map(vm.sourceData, columnName), _amountFilterDecimal);
      vm[`total${columnName}`] = sum;
      return $filter('unit')(sum);
    };

    // Get total line items for packing slip
    vm.getTotalLineItems = () => {
      let sum = vm.sourceData.length > 0 ? vm.sourceData.length : 0;
      sum = $filter('numberWithoutDecimal')(sum);
      const display = stringFormat('Total Line Items: {0}', sum);
      return display;
    };

    // Get count of document uploaded for packing slip
    function getPackingSlipDocumentCount() {
      if (vm.packingSlip && vm.packingSlip.id) {
        vm.cgBusyLoading = PackingSlipFactory.getPackingSlipDocumentCount().query({
          id: vm.packingSlip.id,
          type: vm.entityName
        }).$promise.then((response) => {
          vm.documentCount = response.data;
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.documentCount = 0;
      }
    }

    $scope.$on('documentCount', (event, documentCount) => {
      vm.documentCount = documentCount;
    });

    vm.goToPackaging = () => {
      BaseService.goToPackaging();
    };

    vm.addReceivedQty = (ev) => {
      if ((!vm.packingSlipID) || vm.packingSlipDisable || vm.isView) {
        return;
      }
      const data = {
        allReceivedQty: vm.packingSlipDet.allReceivedQty ? _.map(vm.packingSlipDet.allReceivedQty.split(','), (item) => ({
          receivedQty: parseInt(item),
          isDisable: false
        })) : [{
          receivedQty: parseInt(vm.packingSlipDet.receivedQty)
        }]
      };
      DialogFactory.dialogService(
        CORE.PACKING_SLIP_RECEIVED_QTY_CONTROLLER,
        CORE.PACKING_SLIP_RECEIVED_QTY_VIEW,
        ev,
        data).then((data) => {
          if (data) {
            vm.packingSlipDetForm.$$controls[0].$setDirty();
            vm.isReceivedQtyValueChange = true;
            vm.packingSlipDet.allReceivedQty = data.allReceivedQty;
            vm.packingSlipDet.receivedQty = data.receivedQty;
            vm.changeReceivedQty(true);
            /*bellow condition is to prevent multiple confirmation of same thing, because checking onblur event*/
            if (vm.packingSlipDet.spq === vm.packingSlipDet.receivedQty) {
              setFocus('receivedQty');
            }
          }
        }, () => {
          setFocus('packingSlipQty');
        }).catch((error) => BaseService.getErrorLog(error));
    };


    const getAuthenticationOfApprovalPart = (ev, componentObj) => {
      const objPartDetail = {
        AccessRole: CORE.ROLE_ACCESS.VERIFICATION_ROLE_ACCESS,
        tempID: vm.sourceData && vm.sourceData.length ? vm.sourceData.length + 1 : 1,
        refTableName: CORE.TABLE_NAME.PACKING_SLIP_MATERIAL_RECEIVE_DET,
        isAllowSaveDirect: false,
        approveFromPage: CORE.PAGENAME_CONSTANT[23].PageName,
        confirmationType: CORE.Generic_Confirmation_Type.PERMISSION_WITH_PACKAGING_ALIAS,
        createdBy: vm.loginUser.userid,
        updatedBy: vm.loginUser.userid,
        informationMsg: componentObj.informationMsg
      };
      DialogFactory.dialogService(
        CORE.GENERIC_CONFIRMATION_MODAL_CONTROLLER,
        CORE.GENERIC_CONFIRMATION_MODAL_VIEW,
        ev,
        objPartDetail).then((data) => {
          if (data) {
            data.transactionType = stringFormat(CORE.MESSAGE_CONSTANT.GENERIC_AUTHENTICATION_REASON.PERMISSION_WITH_PACKAGING_ALIAS, componentObj.PIDCode, componentObj.restrictUSEwithpermission ? vm.CORE.RestrictWithPermissionLabel.RestrictUSEWithPermission : vm.CORE.RestrictWithPermissionLabel.RestrictPackagingUSEWithPermission, data.approveFromPage, data.username);
            vm.packingSlipDet.objApproval = data;
            if (vm.isScanLabel) {
              getComponentDetailsByMfg({
                id: componentObj.id,
                mfgcodeID: componentObj.mfgcodeID,
                isContainCPN: true
              });
              initAutoComplete();
            } else {
              vm.packingSlipDet.partID = componentObj.id;
              vm.packingSlipDet.unit = componentObj.unit;
              vm.packingSlipDet.unitDisabled = vm.packingSlipDet.unit;
              vm.packingSlipDet.uom = componentObj.uom;
              vm.packingSlipDet.uomName = componentObj.unitName;
              vm.packingSlipDet.uomNameDisabled = vm.packingSlipDet.uomName;
              vm.packingSlipDet.packagingID = componentObj.packagingID;
              const packagingObj = _.find(vm.packagingList, (data) => data.id === vm.packingSlipDet.packagingID);
              vm.packingSlipDet.packaging = packagingObj ? packagingObj.name : null;
              vm.packingSlipDet.spq = componentObj.umidSPQ ? componentObj.umidSPQ : 0;
              vm.packingSlipDet.spqDisabled = vm.packingSlipDet.spq;
              vm.packingSlipDet.packageQty = componentObj.packageQty ? componentObj.packageQty : 0;
              vm.packingSlipDet.packageQtyDisabled = vm.packingSlipDet.packageQty;
              checkPackagingBySPQ('Packaging');
              initMaterialAutoComplete();
              getPurchaseInspectionList(vm.packingSlipDet.partID);
            }
            setFocus('packingSlipSerialNumber');
          }
        }, () => {
          vm.isScanLabel = false;
          vm.packingSlipDet.scanLabel = null;
          $scope.$broadcast(vm.autoCompletecomponent.inputName, null);
          setFocus('scanLabel');
        }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.scanBin = ($event, isEnter) => {
      $timeout(() => {
        // if ($event.keyCode == 13) {
        //  vm.getLocationBinDetail();
        // }

        if (isEnter) {
          if ($event.keyCode === 13) {
            $event.preventDefault();
            $event.stopPropagation();
            if (vm.packingSlipDet.bin) {
              if (vm.packingSlip.refPurchaseOrderID && vm.packingSlipDet.orderedQty) {
                setFocus('receivedQty');
              }
              else { setFocus('orderedQty'); }
            }
          }
        } else {
          vm.getLocationBinDetail();
        }
      });
      /** Prevent enter key submit event */
      preventInputEnterKeyEvent($event);
    };

    vm.addPackingSlip = (isOpenInSameTab) => BaseService.goToManagePackingSlipDetail(null, null, isOpenInSameTab);

    vm.openPackingSlipHistory = (ev) => {
      const data = {
        id: vm.packingSlipID,
        receiptType: vm.packingSlip.receiptType,
        supplierCodeName: vm.packingSlip.mfgFullName,
        mfgCodeID: vm.packingSlip.mfgCodeID,
        packingSlipNumber: vm.packingSlip.packingSlipNumber
      };
      DialogFactory.dialogService(
        TRANSACTION.TRANSACTION_PACKING_SLIP_CHANGE_HISTORY_CONTROLLER,
        TRANSACTION.TRANSACTION_PACKING_SLIP_CHANGE_HISTORY_VIEW,
        ev,
        data).then(() => { }, () => { });
    };

    vm.getLocationBinDetail = () => {
      if (vm.packingSlipDet.bin && !(vm.packingSlipDet.isNonUMIDStock || vm.packingSlip.isNonUMIDStock)) {
        vm.packingSlipDet.binID = null;
        BinFactory.getBinDetailByName().query({
          name: vm.packingSlipDet.bin
        }).$promise.then((response) => {
          if (response && response.data) {
            if (response.data.warehousemst && response.data.warehousemst.parentWarehouseMst) {
              if (vm.sourceData && vm.sourceData.length > 0) {
                const mismatchDepartment = _.find(vm.sourceData, (data) => data.parentWarehouseID && data.parentWarehouseID !== response.data.warehousemst.parentWarehouseMst.id && data.id !== vm.packingSlipDet.id);
                if (mismatchDepartment) {
                  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_ALLOW_DIFFRENT_DEPARTMENT_FOR_PACKINGSLIP);
                  messageContent.message = stringFormat(messageContent.message, mismatchDepartment.parentWarehouse, vm.packingSlipDet.bin, response.data.warehousemst.parentWarehouseMst.Name);
                  const model = {
                    messageContent: messageContent,
                    multiple: true
                  };
                  DialogFactory.messageAlertDialog(model).then((yes) => {
                    if (yes) {
                      vm.packingSlipDet.bin = null;
                      vm.packingSlipDet.warehouseDisabled = vm.packingSlipDet.warehouse = null;
                      vm.packingSlipDet.parentWarehouseDisabled = vm.packingSlipDet.parentWarehouse = null;
                      setFocus('packingSlipBinName');
                    }
                  }).catch((error) => BaseService.getErrorLog(error));
                  return;
                }
              }

              vm.packingSlipDet.binID = response.data.id;
              vm.packingSlipDet.bin = response.data.Name;
              vm.packingSlipDet.warehouse = response.data.warehousemst.Name;
              vm.packingSlipDet.warehouseDisabled = vm.packingSlipDet.warehouse;
              vm.packingSlipDet.warehouseID = response.data.warehousemst.id;
              vm.packingSlipDet.parentWarehouse = response.data.warehousemst.parentWarehouseMst.Name;
              vm.packingSlipDet.parentWarehouseDisabled = vm.packingSlipDet.parentWarehouse;
              vm.packingSlipDet.parentWarehouseID = response.data.warehousemst.parentWarehouseMst.id;

              vm.checkduplicateBinWithSamePartAndPackaging(true);
            }
          } else {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SCAN_VALID_BIN);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                vm.packingSlipDet.binID = vm.packingSlipDet.bin = vm.packingSlipDet.warehouseDisabled = vm.packingSlipDet.warehouse = vm.packingSlipDet.warehouseID = vm.packingSlipDet.parentWarehouseDisabled = vm.packingSlipDet.parentWarehouse = vm.packingSlipDet.parentWarehouseID = null;
                setFocus('packingSlipBinName');
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.packingSlipDet.binID = vm.packingSlipDet.bin = vm.packingSlipDet.warehouseDisabled = vm.packingSlipDet.warehouse = vm.packingSlipDet.warehouseID = vm.packingSlipDet.parentWarehouseDisabled = vm.packingSlipDet.parentWarehouse = vm.packingSlipDet.parentWarehouseID = null;
      }
    };

    const checkPackagingBySPQ = () => {
      vm.isReceivingQtyConfirmationPending = false;
      if ((vm.packingSlipDet.uom && vm.packingSlipDet.uom === -1) &&
        (vm.packingSlipDet.packagingID && vm.packingSlipDet.packagingID === TRANSACTION.TAPEANDREELID) &&
        vm.packingSlipDet.spq && vm.packingSlipDet.receivedQty) {
        const modeOfSpq = (vm.packingSlipDet.receivedQty % vm.packingSlipDet.spq);
        if (modeOfSpq !== 0 && vm.isReceivedQtyValueChange) {
          vm.isReceivingQtyConfirmationPending = true;
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.CONFIRMATION_CONNTINUE_TR_UMID_COUNT);
          messageContent.message = stringFormat(messageContent.message, 'Received Qty', redirectToPartDetail(vm.packingSlipDet.partID, vm.packingSlipDet.PIDCode), vm.packingSlipDet.packaging, 'RECEIVED QTY', vm.packingSlipDet.spq);
          const buttonsList = [{
            name: CORE.MESSAGE_CONSTANT.BUTTON_FOR_Continue
          },
          {
            name: 'Change Packaging'
          },
          {
            name: 'Change Received Qty'
          }
          ];

          const data = {
            messageContent,
            buttonsList,
            buttonIndexForFocus: 2
          };
          DialogFactory.dialogService(
            CORE.MULTIPLE_BUTTONS_DIALOG_POPUP_CONTROLLER,
            CORE.MULTIPLE_BUTTONS_DIALOG_POPUP_VIEW,
            null,
            data).then(() => { }, (response) => {
              if (response === buttonsList[0].name) {
                vm.isReceivingQtyConfirmationPending = false;
                vm.isReceivedQtyValueChange = false;
                setFocusAndValueSelecte('packingSlipQty');
              } else if (response === buttonsList[1].name) {
                vm.packagingFlag = true;
                vm.autoPackaging.keyColumnId = null;
                vm.focusOnPackaging = true;
              } else if (response === buttonsList[2].name) {
                vm.packingSlipDet.receivedQty = null;
                vm.packingSlipDet.allReceivedQty = null;
                setFocus('receivedQty');
              }
            }, (err) => BaseService.getErrorLog(err));
        }
      } else {
        vm.checkMissmatchInQty();
      }
    };

    angular.element(() => {
      if ($state.current.name === TRANSACTION.TRANSACTION_MANAGE_MATERIAL_RECEIVE_STATE) {
        BaseService.currentPageForms = [vm.packingSlipForm, vm.packingSlipDetForm];
      }
    });


    const validationForSPQ = () => {
      if (parseInt(vm.packingSlipDet.spq) === 0 && vm.packingSlipDet.packagingID === TRANSACTION.TAPEANDREELID) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SPQ_ZERO_NOT_ALLOW_FOR_TR);
        const model = {
          messageContent: messageContent,
          multiple: false
        };
        return DialogFactory.messageAlertDialog(model).then((yes) => {
          if (yes) {
            vm.packingSlipDet.scanLabel = null;
            vm.packingSlipDet.packingSlipSerialNumber = null;
            vm.packingSlipDet.nickname = null;
            vm.packingSlipDet.unitDisabled = vm.packingSlipDet.unit = null;
            vm.packingSlipDet.uomNameDisabled = vm.packingSlipDet.uomName = null;
            $scope.$broadcast(vm.autoCompleteAssyNickname.inputName, null);
            vm.autoPackaging.keyColumnId = null;
            const partId = vm.packingSlipDet.partID;
            $scope.$broadcast(vm.autoCompletecomponent ? vm.autoCompletecomponent.inputName : null, null);
            setFocus('scanLabel');
            BaseService.goToComponentDetailTab(CORE.MFG_TYPE.MFG, partId, null);
            return;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.finish = () => {
      if (BaseService.focusRequiredField(vm.packingSlipOtherDetail) || (vm.packingSlip.lockStatus === vm.Transaction.CustomerPaymentLockStatus.Locked && !vm.loginUser.isUserSuperAdmin)) {
        return;
      }
      const dynamicControlList = DataElementTransactionValueFactory.getDataElementTransactionList(vm.dataElementList);
      DataElementTransactionValueFactory.saveTransctionValue({
        referenceTransID: vm.packingSlipID,
        entityID: vm.entityID,
        dataElementList: dynamicControlList.dataElementList,
        removeElementList: dynamicControlList.removeElementList,
        subFormTransList: dynamicControlList.subFormTransList,
        deletedsubFormTransIDs: dynamicControlList.deletedsubFormTransIDs,
        removeSubFormTransListConditional: dynamicControlList.removeSubFormTransListConditional
      }, vm.fileList).then(() => {
        DataElementTransactionValueFactory.displaySuccessMessage(dynamicControlList.dataElementList);
        vm.packingSlipOtherDetail.$setPristine();
        vm.packingSlipOtherDetail.$setUntouched();

        vm.IsOtherDetailTab = false;
        vm.fileList = {};
        $timeout(() => {
          vm.IsOtherDetailTab = true;
        }, 0);
        vm.saveDisable = false;
      }).catch((error) => {
        vm.saveDisable = false;
        return BaseService.getErrorLog(error);
      });
    };

    vm.materialReceivePartInstructionDetail = (row, event) => {
      const data = {
        lineDetail: row.entity || row || null,
        packingSlipDisable: vm.packingSlipDisable
      };
      data.lineDetail.isPOCanceled = vm.isPOCanceled;
      data.lineDetail.refPackingSlipNumberForInvoice = vm.packingSlip.refPackingSlipNumberForInvoice || null;
      DialogFactory.dialogService(
        TRANSACTION.PACKING_SLIP_RECEIVE_PART_INSPECTION_POPUP_CONTROLLER,
        TRANSACTION.PACKING_SLIP_RECEIVE_PART_INSPECTION_POPUP_VIEW,
        event,
        data).then((response) => {
          if (data.lineDetail.id === vm.packingSlipDet.id && response) {
            vm.packingSlipDet.receivedStatus = response;
          }
          BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
        }, () => { });
    };
    /**
     * view purchase comments from grid cell
     * @param {any} rowdata
     * @param {any} event
     */
    vm.viewPurchaseComments = (rowdata, event) => {
      if (rowdata && rowdata.commentCount > 0) {
        DialogFactory.dialogService(
          TRANSACTION.PURCHASE_COMMENT_VIEW_POPUP_CONTROLLER,
          TRANSACTION.PURCHASE_COMMENT_VIEW_POPUP_VIEW,
          event,
          rowdata).then(() => {
          }, () => {
          }, (err) => BaseService.getErrorLog(err));
      }
    };

    vm.getNicknameFromInternalRef = (e) => {
      $timeout(() => {
        if (e.keyCode === 13) {
          if (!vm.packingSlipDet.internalRef) {
            return;
          }
          const splitInternalRef = vm.packingSlipDet.internalRef.split('#');
          if (splitInternalRef && splitInternalRef.length > 0) {
            $scope.$broadcast(vm.autoCompleteAssyNickname.inputName, splitInternalRef[0] ? {
              nickName: splitInternalRef[0]
            } : null);
            setFocusByName(vm.autoCompleteAssyNickname.inputName);
          }
        }
      }, true);
      /** Prevent enter key submit event */
      preventInputEnterKeyEvent(e);
    };

    vm.getNicknameFromInternalRefForSysgenpo = () => {
      $timeout(() => {
        if (!vm.packingSlipDet.internalRef) {
          return;
        }
        const splitInternalRef = vm.packingSlipDet.internalRef.split('#');
        if (splitInternalRef && splitInternalRef.length > 0) {
          $scope.$broadcast(vm.autoCompleteAssyNickname.inputName, {
            nickName: splitInternalRef[0]
          });
          setFocusByName(vm.autoCompleteAssyNickname.inputName);
        }
      }, true);
    };

    vm.showDescriptionPopUp = (object, ev, title) => {
      var obj;
      switch (title) {
        case 'Line Comment': obj = {
          title: title,
          description: object && object.remark ? object.remark : null,
          name: object.packingSlipSerialNumber
        }; break;
        case 'PO Description': obj = {
          title: title,
          description: object && object.partDescription ? object.partDescription : null,
          name: object.packingSlipSerialNumber
        }; break;
        case 'PO Internal Comment': obj = {
          title: title,
          description: object && object.internalLineComment ? object.internalLineComment : null,
          name: object.packingSlipSerialNumber
        }; break;
        case 'Part Purchase Comment': obj = {
          title: title,
          description: object && object.purchaseInspectionComment ? object.purchaseInspectionComment : null,
          name: object.packingSlipSerialNumber
        }; break;
        default:
          break;
      }
      const data = obj;
      data.label = 'Packing Slip Line#';
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        data).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.purchaseCommentHtml = (htmlStr) => {
      const commentInspectionList = htmlStr ? htmlStr.split(_groupConcatSeparatorValue) : [];
      const strMain = '<ul>{0}</ul>';
      let strSub = null;
      _.map(commentInspectionList, (data) => {
        strSub = strSub ? strSub.concat(stringFormat('<br /><li>{0}</li>', data)) : stringFormat('<li>{0}</li>', data);
      });
      vm.purchaseCommentHtmlStr = stringFormat(strMain, strSub);
      vm.purchaseCommentHtmlStr = vm.purchaseCommentHtmlStr ? vm.purchaseCommentHtmlStr.replace(/\n/g, '<br/>') : null;
    };

    vm.getPackingSlipModeStatus = (statusID) => {
      const status = _.find(CORE.PackingSlipModeStatus, (item) => item.ID === statusID);
      return status ? status.Name : '';
    };

    vm.getPackingSlipModeStatusClass = (statusID) => {
      const status = _.find(CORE.PackingSlipModeStatus, (item) => item.ID === statusID);
      return status ? status.ClassName : '';
    };

    vm.changepackingSlipModeStatus = (data) => {
      if (data) {
        if (vm.packingSlip.packingSlipModeStatus !== data.ID) {
          if ((vm.packingSlipForm.$invalid && BaseService.focusRequiredField(vm.packingSlipForm)) || vm.packingSlipForm.$dirty || vm.packingSlip.status === vm.PackingSlipStatus.Paid || (vm.packingSlip.lockStatus === vm.Transaction.CustomerPaymentLockStatus.Locked && !vm.loginUser.isUserSuperAdmin)) {
            vm.saveBtnDisableFlag = false;
            return;
          } else {
            vm.packingSlip.packingSlipModeStatus = data.ID;
            if (vm.packingSlipDetForm && vm.packingSlipDetForm.$dirty) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.CONFIRMATION_CHANGE_PS_MODE_FOR_DETAIL_DATA);
              const obj = {
                messageContent: messageContent,
                btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
              };
              DialogFactory.messageConfirmDialog(obj).then((yes) => {
                if (yes) {
                  vm.checkPendingLineValidation();
                }
              }, () => {
                vm.packingSlip.packingSlipModeStatus = vm.packingSlip.packingSlipModeStatus === CORE.PackingSlipModeStatus[0].ID ? CORE.PackingSlipModeStatus[1].ID : CORE.PackingSlipModeStatus[0].ID;
              }, (error) => BaseService.getErrorLog(error));
            } else {
              vm.checkPendingLineValidation();
            }
          }
        }
      }
    };

    vm.checkPendingLineValidation = () => {
      if (vm.packingSlip.packingSlipModeStatus === CORE.PackingSlipModeStatus[1].ID) {
        if (!(vm.sourceData && vm.sourceData.length > 0)) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RESTRICT_TO_PUBLISH_PS_NOT_HAVING_LINES);
          return DialogFactory.messageAlertDialog({ messageContent }).then(() => vm.packingSlip.packingSlipModeStatus = CORE.PackingSlipModeStatus[0].ID);
        }
        vm.cgBusyLoading = PackingSlipFactory.checkPSContainingPendingLine().query({ id: vm.packingSlipID }).$promise.then((response) => {
          if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RESTRICT_TO_PUBLISH_SOME_LINE_IS_PENDING);
            return DialogFactory.messageAlertDialog({ messageContent }).then(() => vm.packingSlip.packingSlipModeStatus = CORE.PackingSlipModeStatus[0].ID);
          } else {
            savePackingSlipDet();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        savePackingSlipDet();
      }
    };

    vm.changeReceivedStatus = () => {
      if ((vm.packingSlipDet && !vm.packingSlipDet.id) && (vm.purchaseRequirementList && vm.purchaseRequirementList.length > 0) && !vm.packingSlipDet.isReceiveBulkItem) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RECEIVED_STATUS_NOT_SET_AT_ADD_TIME);
        const model = {
          messageContent,
          multiple: false
        };
        return DialogFactory.messageAlertDialog(model).then(() => {
          vm.packingSlipDet.receivedStatus = vm.isPOCanceled ? vm.packingSlipReceivedStatus[2].value : vm.packingSlipReceivedStatus[0].value;
          setFocus('remark');
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        if (vm.packingSlipDet && vm.packingSlipDet.purchaseRequirementCount > 0 && (vm.packingSlipDet.receivedStatus === vm.packingSlipReceivedStatus[1].value || vm.packingSlipDet.receivedStatus === vm.packingSlipReceivedStatus[3].value) && vm.packingSlipDet.psInspectionStatusLineWise !== vm.packingSlipReceivedStatus[1].value && vm.packingSlipDet.psInspectionStatusLineWise !== vm.packingSlipReceivedStatus[3].value && !vm.packingSlipDet.isReceiveBulkItem) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RECEIVED_STATUS_NOT_SET_ACCEPT);
          const model = {
            messageContent,
            multiple: false
          };
          return DialogFactory.messageAlertDialog(model).then(() => {
            vm.packingSlipDet.receivedStatus = vm.packingSlipDet.oldReceivedStatus;
            setFocus('remark');
          }).catch((error) => BaseService.getErrorLog(error));
        }
        else if (vm.packingSlipDet && (vm.packingSlipDet.receivedStatus === vm.packingSlipReceivedStatus[0].value || vm.packingSlipDet.receivedStatus === vm.packingSlipReceivedStatus[2].value) && vm.packingSlipDet.TotalUMIDCount > 0) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RECEIVED_STATUS_NOT_SET_PENDING_REJECTED);
          messageContent.message = stringFormat(messageContent.message, vm.packingSlipDet.receivedStatus === vm.packingSlipReceivedStatus[0].value ? vm.packingSlipReceivedStatus[0].key : vm.packingSlipReceivedStatus[2].key);
          const model = {
            messageContent,
            multiple: false
          };
          return DialogFactory.messageAlertDialog(model).then(() => {
            vm.packingSlipDet.receivedStatus = vm.packingSlipDet.oldReceivedStatus;
            setFocus('remark');
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          vm.packingSlipDet.oldReceivedStatus = vm.packingSlipDet.receivedStatus;
        }
      }
    };

    vm.goToInvoiceList = () => {
      if (vm.packingSlip.refInvoice && vm.packingSlip.refInvoice.invoiceNumber) {
        BaseService.goToSupplierInvoiceList();
      }
    };

    vm.invoiceDetail = () => {
      if (vm.packingSlip.refInvoice && vm.packingSlip.refInvoice.id) {
        BaseService.goToSupplierInvoiceDetail(null, vm.packingSlip.refInvoice.id);
      }
    };

    vm.goToPurchaseOrderDetail = () => BaseService.goToPurchaseOrderDetail(vm.packingSlip.refPurchaseOrderID);

    vm.goToRoHSStatusList = () => BaseService.goToRohsList();

    const getRoHSList = () => MasterFactory.getRohsList().query().$promise.then((response) => {
      vm.RohsList = response && response.data ? response.data : [];
      if (!vm.autoCompleteRohsStatus) {
        initRohsAutoComplete();
      }
      return $q.resolve(vm.RohsList);
    }).catch((error) => BaseService.getErrorLog(error));

    getRoHSList();

    const initRohsAutoComplete = () => {
      /** Auto-Complete RoHs list*/
      vm.autoCompleteRohsStatus = {
        columnName: 'name',
        controllerName: CORE.MANAGE_ROHS_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_ROHS_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'rohsComplient',
        placeholderName: 'RoHS Requirement',
        isAddnew: true,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_ROHS_STATE],
          pageNameAccessLabel: CORE.PageName.rohs_status
        },
        callbackFn: getRoHSList,
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.packingSlipDet.rohsstatus = item.id;
          }
        }
      };
    };

    //go to manufacturer tab
    vm.goToManufacturerDetail = (id) => BaseService.goToManufacturer(id);

    //Fetch All PO Parts
    vm.FetchAllPOParts = () => {
      if ((!vm.packingSlip.refPurchaseOrderID) || vm.packingSlipDisable || !vm.packingSlipID) {
        return;
      }
      if (vm.packingSlipDetForm.$dirty) {
        const messageContent = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.CONFIRM_TO_SELECT_FROM_PO;
        const obj = {
          messageContent,
          btnText: CORE.MESSAGE_CONSTANT.RESET_AND_CONTINUE_BUTTON,
          canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.resetPackingSlipMaterialDet();
            openPOReleaseLinePopup();
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      } else { openPOReleaseLinePopup(); }
    };

    const openPOReleaseLinePopup = (mfgNumber, partID) => {
      const parInPolLineDet = {
        mfgNumber: mfgNumber || null,
        partID: partID || null,
        poNumber: vm.packingSlip.poNumber,
        supplierSONumber: vm.packingSlip.supplierSONumber,
        supplierName: vm.packingSlip.mfgFullName,
        refPurchaseOrderID: vm.packingSlip.refPurchaseOrderID,
        supplierID: vm.packingSlip.mfgCodemst.id ? vm.packingSlip.mfgCodemst.id : vm.packingSlip.mfgCodeID,
        supplierMfgName: vm.packingSlip.mfgCodemst && vm.packingSlip.mfgCodemst.mfgName ? vm.packingSlip.mfgCodemst.mfgName : null
      };
      vm.isopenPopup = true;
      DialogFactory.dialogService(
        CORE.PART_IN_PO_LINE_CONTROLLER,
        CORE.PART_IN_PO_LINE_VIEW,
        null,
        parInPolLineDet).then((item) => {
          vm.isopenPopup = false;
          vm.resetPackingSlipMaterialDet();
          $timeout(() => assignReleaseLineDetailToMaterialDetail(item));
        }, () => vm.isopenPopup = false);
    };

    //AutoComplete SO
    const getSOList = (searchObj) => PackingSlipFactory.getSOListFromPO().query(searchObj).$promise.then((res) => {
      var SOList = [];
      if (res && res.data) {
        if (vm.packingSlip.refPurchaseOrderID && res.data.soNumber && res.data.soNumber[0]) {
          if (res.data.soNumber[0].soNumber) {
            SOList = _.map(_.split(res.data.soNumber[0].soNumber, ','), (item) => ({ supplierSONumber: item }));
          }
        }

        _.each(res.data.supplierSONumber, (item) => {
          const exist = _.findIndex(SOList, (o) => o.supplierSONumber === item.supplierSONumber);
          if (exist === -1) {
            SOList.push(item);
          }
        });
      } else {
        vm.SOList = [];
      }
      vm.SOList = SOList;
      return vm.SOList;
    }).catch((error) => BaseService.getErrorLog(error));

    vm.autoCompleteSO = {
      columnName: 'supplierSONumber',
      keyColumnName: 'supplierSONumber',
      keyColumnId: 'supplierSONumber',
      placeholderName: 'Type here to search SO',
      inputName: 'supplierSONumber',
      mdRequireMatch: false,
      isRequired: true,
      isUppercaseSearchText: true,
      callbackFn: getSOList,
      onSelectCallbackFn: (item) => {
        if (item) {
          vm.packingSlip.supplierSONumber = item.supplierSONumber ? item.supplierSONumber : item;
        }
        else {
          vm.packingSlip.supplierSONumber = vm.autoCompleteSO.searchText;
        }
      },
      onSearchFn: (query) => {
        vm.packingSlip.supplierSONumber = query;

        const searchObj = {
          searchQuery: query.toUpperCase(),
          poNumber: vm.packingSlip.poNumber ? vm.packingSlip.poNumber : null
        };
        return getSOList(searchObj);
      }
    };

    vm.poDateOnChange = () => {
      vm.soDateOptions.minDate = (vm.packingSlip.poDate ? vm.packingSlip.poDate : vm.currentDate);
      if (vm.packingSlip.poDate) {
        if (new Date(vm.packingSlip.poDate) > new Date(vm.packingSlip.soDate)) {
          vm.packingSlip.soDate = null;
        }
      } else {
        vm.packingSlip.soDate = null;
      }
    };

    function createRMA(row, ev) {
      return PackingSlipFactory.getPackingSlipStatus().query({ id: vm.packingSlip.id }).$promise.then((res) => {
        if (res && res.data && res.data.packingSlipModeStatus === vm.packingSlipModeStatus[0].ID) {
          const messageContent = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_ALLOW_TO_CREATE_RMA_PACKING_SLIP_IS_DRAFT;
          return DialogFactory.messageAlertDialog({ messageContent }).then(() => getPackingSlipDet());
        } else {
          const objData = {
            mfgCodeID: vm.packingSlip.mfgCodeID,
            supplierCodeName: vm.packingSlip.mfgFullName,
            PartId: row.partID,
            mfgPN: row.mfgPN,
            pidCode: row.PIDCode,
            rohsIcon: row.rohsIcon,
            rohsName: row.rohsName,
            packingSlipID: vm.packingSlipID,
            packingSlipNumber: vm.packingSlip.packingSlipNumber
          };
          DialogFactory.dialogService(
            TRANSACTION.SUPPLIER_RMA_CREATE_POPUP_CONTROLLER,
            TRANSACTION.SUPPLIER_RMA_CREATE_POPUP_VIEW,
            ev,
            objData).then(() => {
            }, (err) => BaseService.getErrorLog(err));
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    // open Create Supplier RMA popup
    vm.createSupplierRMA = (row, ev) => {
      if (row) {
        if (row.receivedStatus !== 'R') {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RMA_CREATION_CONFIRMATION_FOR_NON_REJECTED_LINES);
          messageContent.message = stringFormat(messageContent.message, row.receivedStatusValue);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              createRMA(row, ev);
            }
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          createRMA(row, ev);
        }
      }
    };

    vm.calculateAcceptedLines = () => {
      vm.packingSlipDet.acceptedLines = vm.packingSlipDet.totalLines - vm.packingSlipDet.rejectedLines - vm.packingSlipDet.acceptedWithDeviationLines - vm.packingSlipDet.pendingLines;
      vm.packingSlipDet.acceptedLinesDisabled = vm.packingSlipDet.acceptedLines;
    };

    vm.changeLineLevelStatus = () => {
      if (vm.packingSlipDet.totalLines) {
        vm.isDisabledPendingStatus = vm.isDisabledAcceptedStatus = true;
        vm.packingSlipDet.rejectedLines = vm.packingSlipDet.rejectedLines || vm.packingSlipDet.rejectedLines === 0 ? vm.packingSlipDet.rejectedLines : parseInt(vm.packingSlipDetForm.rejectedLines.$viewValue) || null;
        vm.packingSlipDet.pendingLines = vm.packingSlipDet.pendingLines || parseInt(vm.packingSlipDetForm.pendingLines.$viewValue) || 0;
        vm.packingSlipDet.acceptedWithDeviationLines = vm.packingSlipDet.acceptedWithDeviationLines || parseInt(vm.packingSlipDetForm.acceptedWithDeviationLines.$viewValue) || 0;
        vm.calculateAcceptedLines();

        if (vm.packingSlipDet.acceptedLines < 0) {
          vm.packingSlipDetForm.totalLines.$setDirty(true);
          vm.packingSlipDetForm.totalLines.$touched = true;
          vm.packingSlipDetForm.totalLines.$setValidity('totalLinesMismatch', false);
        } else {
          vm.packingSlipDetForm.totalLines.$setValidity('totalLinesMismatch', true);
        }

        if (vm.packingSlipDet.totalLines === vm.packingSlipDet.acceptedLines) {
          vm.isDisabledAcceptedStatus = false;
          vm.packingSlipDet.receivedStatus = vm.packingSlipReceivedStatus[1].value;
        } else if (vm.packingSlipDet.acceptedWithDeviationLines > 0) {
          vm.packingSlipDet.receivedStatus = vm.packingSlipReceivedStatus[3].value;
        } else if (vm.packingSlipDet.rejectedLines > 0) {
          vm.packingSlipDet.receivedStatus = vm.packingSlipReceivedStatus[2].value;
        } else {
          vm.isDisabledPendingStatus = false;
          vm.packingSlipDet.receivedStatus = vm.packingSlipReceivedStatus[0].value;
        }
      } else {
        vm.isDisabledPendingStatus = vm.isDisabledAcceptedStatus = false;
        vm.packingSlipDet.acceptedLinesDisabled = vm.packingSlipDet.acceptedLines = vm.packingSlipDet.rejectedLines = vm.packingSlipDet.acceptedWithDeviationLines = vm.packingSlipDet.pendingLines = null;
        vm.packingSlipDet.receivedStatus = vm.packingSlipReceivedStatus[0].value;
      }
    };

    vm.viewPackingSlipDetRecord = (row, ev) => vm.updateRecord(row, ev, true);

    vm.showPackingSlipSummaryDetails = (row) => {
      const data = angular.copy(row);
      data.mfgCodeID = row.mfgcodeID;
      data.receivedQty = row.totalReceivedQty;
      data.pendingQty = row.pendingQty;
      data.poId = row.refPurchaseOrderID;
      data.id = row.refPurchaseOrderDetID;
      data.poNumber = vm.packingSlip.poNumber;
      data.qty = row.orderedQty;
      DialogFactory.dialogService(
        CORE.PURCHASE_ORDER_RECEIVED_QTY_DETAILS_POPUP_CONTROLLER,
        CORE.PURCHASE_ORDER_RECEIVED_QTY_DETAILS_POPUP_VIEW,
        event,
        data
      ).then(() => { }, () => { });
    };

    vm.changePSCustConsigned = (isCustConsigned) => {
      if (vm.packingSlip.refPurchaseOrderID || vm.packingSlipDisable) {
        vm.packingSlip.isCustConsigned = !isCustConsigned ? true : false;
        return;
      }
      if (vm.packingSlipID && vm.sourceData && vm.sourceData.length > 0) {
        const selectedIDs = vm.sourceData.map((item) => item.id);

        getPackingSlipMaterialDetailStatus(selectedIDs, 'checkValidation', vm.LabelConstant.PACKING_SLIP.CustomerConsigned).then((res) => {
          if (res) {
            if (isCustConsigned) {
              vm.packingSlip.customerID = null;
              if (vm.autoCompleteCustomer && vm.autoCompleteCustomer.inputName) {
                $scope.$broadcast(vm.autoCompleteCustomer.inputName, null);
              }
              if (vm.autoCompletecomponent.keyColumnId) {
                vm.packingSlipDet.lineCustomerID = null;
                if (vm.autoCompleteLineCustomer && vm.autoCompleteLineCustomer.inputName) {
                  $scope.$broadcast(vm.autoCompleteLineCustomer.inputName, null);
                }
              }
            } else {
              const searchObj = {
                inputName: vm.autoCompleteCustomer.inputName,
                type: CORE.MFG_TYPE.MFG,
                isCustomer: true
              };
              getCustomerMappingList(searchObj);
            }
            if (vm.autoCompletecomponent.keyColumnId) {
              vm.packingSlipDet.isLineCustConsigned = !isCustConsigned ? true : false;
            }
          } else {
            vm.packingSlip.isCustConsigned = !vm.packingSlip.isCustConsigned;
          }
        }, (error) => BaseService.getErrorLog(error));
      } else {
        if (vm.autoCompletecomponent.keyColumnId) {
          vm.packingSlipDet.isLineCustConsigned = !isCustConsigned ? true : false;
        }
        if (isCustConsigned) {
          vm.packingSlip.customerID = null;
          if (vm.autoCompleteCustomer && vm.autoCompleteCustomer.inputName) {
            $scope.$broadcast(vm.autoCompleteCustomer.inputName, null);
          }
          if (vm.autoCompletecomponent.keyColumnId) {
            vm.packingSlipDet.lineCustomerID = null;
            if (vm.autoCompleteLineCustomer && vm.autoCompleteLineCustomer.inputName) {
              $scope.$broadcast(vm.autoCompleteLineCustomer.inputName, null);
            }
          }
        } else {
          const searchObj = {
            inputName: vm.autoCompleteCustomer.inputName,
            type: CORE.MFG_TYPE.MFG,
            isCustomer: true
          };
          getCustomerMappingList(searchObj);
        }
      }
    };

    vm.changeLineCustConsigned = (isLineConsigned) => {
      if ((!vm.packingSlipID) || vm.packingSlipDisable || vm.packingSlip.refPurchaseOrderID || vm.packingSlipDet.TotalUMIDCount > 0 || vm.packingSlipDet.isRMACreated || vm.isView || vm.packingSlip.isCustConsigned || vm.packingSlipDet.partType === vm.CORE.PartType.Other) {
        vm.packingSlipDet.isLineCustConsigned = !isLineConsigned ? true : false;
        return;
      }
      if (vm.packingSlipDet.id) {
        getPackingSlipMaterialDetailStatus([vm.packingSlipDet.id], 'checkValidation', vm.LabelConstant.PACKING_SLIP.CustomerConsigned).then((res) => {
          if (res) {
            vm.lineCustConsignLogic(isLineConsigned);
          } else {
            vm.packingSlipDet.isLineCustConsigned = !vm.packingSlipDet.isLineCustConsigned;
          }
        }, (error) => BaseService.getErrorLog(error));
      } else {
        vm.lineCustConsignLogic(isLineConsigned);
      }
    };

    vm.lineCustConsignLogic = (isLineConsigned) => {
      if (isLineConsigned) {
        vm.packingSlipDet.lineCustomerID = null;
        if (vm.autoCompleteLineCustomer && vm.autoCompleteLineCustomer.inputName) {
          $scope.$broadcast(vm.autoCompleteLineCustomer.inputName, null);
        }
      } else {
        if (vm.packingSlipDet.mfgcodeID && vm.packingSlipDet.isCPN) {
          vm.packingSlipDet.lineCustomerID = vm.packingSlipDet.mfgcodeID;
          if (vm.autoCompleteLineCustomer) {
            getSupplierMfgCodeSearch({
              mfgcodeID: vm.packingSlipDet.lineCustomerID,
              type: CORE.MFG_TYPE.MFG,
              isCustomer: true
            }, true);
          }
        } else {
          const searchObj = {
            inputName: vm.autoCompleteLineCustomer.inputName,
            type: CORE.MFG_TYPE.MFG,
            isCustomer: true
          };
          getCustomerMappingList(searchObj, true);
        }
      }
    };

    // get default report By entity.
    function getDefaultReportByEntity(searchObj) {
      vm.deafultEntityReport = null;
      return ReportMasterFactory.getDefaultReportByEntity().query({ listObj: searchObj }).$promise.then((response) => {
        if (response && response.status && response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data) {
          vm.deafultEntityReport = response.data;
        }
        //return $q.resolve(response);
      }).catch((error) => BaseService.getErrorLog(error));
    }

    vm.generateInspectionRequirmentReport = (row) => {
      const obj = {
        messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.GENERATE_INSPECTION_REQUIRMENT_REPORT_CONFIRMATION,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          row.entity.isGeneratingInspectionReport = true;
          const entityInfo = {
            entityId: vm.entityID
          };
          const promise = [getDefaultReportByEntity(entityInfo)];
          $q.all(promise).then(() => {
            if (vm.deafultEntityReport) {
              const parameterValueJson = stringFormat('{"{0}":"{1}","{2}":"{3}","{4}":"{5}"}',
                CORE.ReportParameterFilterDbColumnName.SupplierPackingSlipId, row.entity.refPackingSlipMaterialRecID,
                CORE.ReportParameterFilterDbColumnName.PackingSlipSerialNumber, row.entity.packingSlipSerialNumber,
                CORE.ReportParameterFilterDbColumnName.PartID, row.entity.partID
              );
              const reportFileName = stringFormat('{0}-{1}-{2}', CORE.REPORT_SUFFIX.SUPPLIER_PACKING_SLIP, row.entity.mfgPN, row.entity.packingSlipSerialNumber);
              const reportInfo = {
                id: vm.deafultEntityReport.id,
                parameterValueJson: parameterValueJson,
                reportName: reportFileName,
                createdBy: vm.loginUser.userid.toString(),
                updatedBy: vm.loginUser.userid.toString(),
                createByRoleId: vm.loginUser.defaultLoginRoleID,
                updateByRoleId: vm.loginUser.defaultLoginRoleID
              };

              ReportMasterFactory.saveReportViewerParameter(reportInfo).then((response) => {
                if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                  PackingSlipFactory.createAndUploadInspectionRequirmentReportInDocuments().query({
                    ParameterGuid: response.data,
                    reportName: reportFileName,
                    refTransID: row.entity.refPackingSlipMaterialRecID,
                    entityID: vm.entityID,
                    gencFileOwnerType: vm.entityName
                  }).$promise.then((response) => {
                    row.entity.isGeneratingInspectionReport = false;
                    getPackingSlipDocumentCount();
                    return response;
                  }).catch((error) => {
                    BaseService.getErrorLog(error);
                    row.entity.isGeneratingInspectionReport = false;
                  });
                }
                else {
                  row.entity.isGeneratingInspectionReport = false;
                }
              }).catch((error) => {
                BaseService.getErrorLog(error);
                row.entity.isGeneratingInspectionReport = false;
              });
            } else {
              row.entity.isGeneratingInspectionReport = false;
            }
          }).catch((error) => {
            BaseService.getErrorLog(error);
            row.entity.isGeneratingInspectionReport = false;
          });
        }
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.changePSNonUMIDStock = (isNonUMIDStock) => {
      if ((vm.sourceData && vm.sourceData.length > 0) || vm.packingSlipDisable) {
        vm.packingSlip.isNonUMIDStock = !isNonUMIDStock ? true : false;
        return;
      }
      if (vm.packingSlipID && vm.sourceData && vm.sourceData.length > 0) {
        const selectedIDs = vm.sourceData.map((item) => item.id);

        getPackingSlipMaterialDetailStatus(selectedIDs, 'checkValidation', vm.LabelConstant.PACKING_SLIP.NonUMIDStock).then((res) => {
          if (res) {
            if (vm.autoCompletecomponent.keyColumnId) {
              vm.packingSlipDet.isNonUMIDStock = !isNonUMIDStock ? true : false;
            }
          } else {
            vm.packingSlip.isNonUMIDStock = !vm.packingSlip.isNonUMIDStock;
          }
        }, (error) => BaseService.getErrorLog(error));
      } else {
        if (vm.autoCompletecomponent.keyColumnId) {
          vm.packingSlipDet.isNonUMIDStock = !isNonUMIDStock ? true : false;
        }
      }
    };

    vm.changeNonUmidStock = (isUMIDStock) => {
      if ((!vm.packingSlipID) || vm.packingSlipDisable || vm.packingSlipDet.isRMACreated || vm.packingSlipDet.TotalUMIDCount > 0 || vm.isView || vm.packingSlipDet.partType === vm.CORE.PartType.Other || vm.packingSlip.isNonUMIDStock) {
        vm.packingSlipDet.isNonUMIDStock = !isUMIDStock ? true : false;
        return;
      }
      if (vm.packingSlipDet.id) {
        getPackingSlipMaterialDetailStatus([vm.packingSlipDet.id], 'checkValidation', vm.LabelConstant.PACKING_SLIP.NonUMIDStock).then((res) => {
          if (res) {
            if (!isUMIDStock) {
              vm.packingSlipDet.binID = vm.packingSlipDet.bin = vm.packingSlipDet.warehouseDisabled = vm.packingSlipDet.warehouse = vm.packingSlipDet.warehouseID = vm.packingSlipDet.parentWarehouseDisabled = vm.packingSlipDet.parentWarehouse = vm.packingSlipDet.parentWarehouseID = null;
            }
          } else {
            vm.packingSlipDet.isNonUMIDStock = !vm.packingSlipDet.isNonUMIDStock;
          }
        }, (error) => BaseService.getErrorLog(error));
      } else {
        if (!isUMIDStock) {
          vm.packingSlipDet.binID = vm.packingSlipDet.bin = vm.packingSlipDet.warehouseDisabled = vm.packingSlipDet.warehouse = vm.packingSlipDet.warehouseID = vm.packingSlipDet.parentWarehouseDisabled = vm.packingSlipDet.parentWarehouse = vm.packingSlipDet.parentWarehouseID = null;
        }
      }
    };

    vm.goTopurchaseOrder = () => BaseService.goToPurchaseOrderList();
    //link to go customer list page
    vm.goToCustomerList = () => BaseService.goToCustomerList();
    //link to go customer details page
    vm.goToCustomer = (id) => BaseService.goToCustomer(id);
    //Go To Personal Page
    vm.goToManagePersonal = (id) => BaseService.goToManagePersonnel(id);

    const redirectToPOAnchorTag = (poid, poNumber) => {
      const redirectToPOUrl = WebsiteBaseUrl + CORE.URL_PREFIX + TRANSACTION.TRANSACTION_ROUTE + TRANSACTION.TRANSACTION_PURCHASE_ORDER_ROUTE + TRANSACTION.TRANSACTION_PURCHASE_ORDER_MAIN_ROUTE + TRANSACTION.TRANSACTION_PURCHASE_ORDER_DETAIL_ROUTE.replace(':id', poid);
      return stringFormat('<a href=\'{0}\' target=\'_blank\' tabindex=\'-1\' class=\'underline\'>{1}</a>', redirectToPOUrl, poNumber);
    };

    const redirectToPartDetail = (pId, pMfrPN) => {
      const redirectToPartUrl = WebsiteBaseUrl + CORE.URL_PREFIX + USER.ADMIN_COMPONENT_ROUTE + USER.ADMIN_MANAGECOMPONENT_ROUTE + USER.ADMIN_MANAGECOMPONENT_DETAIL_TAB_ROUTE.replace(':mfgType', CORE.MFG_TYPE.MFG.toLowerCase()).replace(':coid', pId);
      return stringFormat('<a href=\'{0}\' target=\'_blank\' tabindex=\'-1\' class=\'underline\'>{1}</a>', redirectToPartUrl, pMfrPN);
    };

    $scope.$on('$destroy', () => {
      DialogFactory.closeAllDialogPopup();
    });
  };
})();
