(function () {
  'use strict';

  angular.module('app.transaction.supplierRMA')
    .controller('ManageSupplierRMAController', ManageSupplierRMAController);

  /** @ngInject */
  function ManageSupplierRMAController($scope, $state, $stateParams, $timeout, $q, $filter, BaseService, MasterFactory, PackingSlipFactory, DataElementTransactionValueFactory, DialogFactory, USER, CORE, TRANSACTION, uiGridGroupingConstants,
    SupplierRMAFactory, GenericCategoryFactory, CustomerFactory, ManageMFGCodePopupFactory, ComponentFactory, PartCostingFactory, SalesOrderFactory, CONFIGURATION) {
    const vm = this;
    vm.CORE = CORE;
    vm.Transaction = TRANSACTION;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.LabelConstant = CORE.LabelConstant;
    vm.selectedTabIndex = 0;
    vm.supplierRMATab = TRANSACTION.SupplierRMATab;
    vm.supplierRMATabName = TRANSACTION.SupplierRMATabName;
    vm.maxLengthForDescription = _maxLengthForDescription;
    vm.tabType = $stateParams.type;
    vm.supplierRMAParamId = $stateParams.id;
    vm.partid = $stateParams.partid;
    vm.packingslipid = $stateParams.packingslipid;
    vm.isSupplierRMATab = false;
    vm.isDocumentTab = false;
    vm.isMiscTab = false;
    vm.isPrintDisable = false;
    vm.isDownloadDisabled = false;
    vm.supplierRMADisable = false;
    vm.trackingNumberDet = {
      trackNumber: null
    };
    vm.loginUser = BaseService.loginUser;
    vm.disableTrackingNumber = false;
    vm.currentDate = new Date();
    vm.DATE_PICKER = CORE.DATE_PICKER;
    vm.rmaDateOptions = {
      appendToBody: true,
      maxDate: vm.currentDate
    };
    vm.packingSlipDateOptions = {
      appendToBody: true,
      maxDate: vm.currentDate
    };
    vm.receiptDateOptions = {
      appendToBody: true,
      minDate: vm.currentDate
    };
    vm.IsPickerOpen = {
      [vm.DATE_PICKER.poDate]: false,
      [vm.DATE_PICKER.packingSlipDate]: false,
      [vm.DATE_PICKER.receiptDate]: false
    };
    vm.rmaAddressViewActionBtnDet = angular.copy(CORE.CustAddressViewActionBtn);
    vm.rmaAddressContPersonViewActionBtnDet = angular.copy(CORE.ContactPersonViewActionBtn);
    vm.rmaMarkedForAddressViewActionBtnDet = angular.copy(CORE.CustAddressViewActionBtn);
    vm.rmaMarkedForAddressContPersonViewActionBtnDet = angular.copy(CORE.ContactPersonViewActionBtn);
    vm.supplierRMAStatusCode = CORE.SupplierRMAStatusCode;
    vm.supplierRMAModeStatus = CORE.SupplierRMAModeStatus;
    vm.supplierRMAEntity = CORE.AllEntityIDS.Supplier_RMA;
    vm.otherDetailTitle = CORE.OtherDetail.TabName;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.entity = CORE.Entity;
    vm.dataElementList = [];
    vm.fileList = {};
    vm.addDaysInCurrentDate = (date, days) => new Date(moment(date, 'DD-MM-YYYY').add(days, 'days'));
    vm.supplierRMA = {
      packingSlipModeStatus: vm.supplierRMAModeStatus[0].ID,
      poDate: vm.currentDate,
      packingSlipDate: vm.currentDate,
      receiptDate: vm.addDaysInCurrentDate(new Date(), 7),
      shippingInsurance: false,
      supplierRMATrackNumber: []
    };
    vm.supplierRMADet = {};
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    vm.getMaxDateValidation = (FromDate, ToDate) => BaseService.getMaxDateValidation(FromDate, ToDate);
    vm.getMinDateValidation = (FromDate, ToDate) => BaseService.getMinDateValidation(FromDate, ToDate);
    vm.CategoryTypeObjList = CORE.CategoryType;
    vm.rmaAddressList = [];
    vm.rmaAddress = null;
    vm.rmaMarkForAddress = null;
    vm.materialDetTitle = 'Add';
    vm.isScanLabel = false;
    vm.isUpdatable = true;
    vm.isViewTemplate = true;
    vm.isDisableRMADate = false;
    vm.isEdit = false;

    let idOfSelectMultipleBarcode = null;
    let scanPackingSlipDetail = null;
    let isAlreadyFireRMAQtyValidation = false;
    let rmaStockDetailList = [];

    const maxAddressLength = CORE.maxAddressLength;

    vm.rmaAddressViewAddrOtherDet = {
      mfgType: CORE.MFG_TYPE.DIST,
      customerId: null,
      addressType: CORE.AddressType.RMAShippingAddress,
      addressBlockTitle: vm.LabelConstant.COMMON.RMAShippingAddress,
      refTransID: null,
      refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
      alreadySelectedAddressID: null,
      alreadySelectedPersonId: null,
      showAddressEmptyState: false
    };

    vm.rmaMarkedAddressViewAddrOtherDet = {
      mfgType: CORE.MFG_TYPE.DIST,
      customerId: null,
      addressType: CORE.AddressType.RMAIntermediateAddress,
      addressBlockTitle: vm.LabelConstant.Address.RMAIntermediateAddress,
      refTransID: null,
      refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
      alreadySelectedAddressID: null,
      alreadySelectedPersonId: null,
      showAddressEmptyState: false
    };

    if (vm.tabType === vm.supplierRMATab.SupplierRMA) {
      vm.selectedTabIndex = 0;
    } else if (vm.tabType === vm.supplierRMATab.Documents) {
      vm.selectedTabIndex = 1;
    } else if (vm.tabType === vm.supplierRMATab.MISC) {
      vm.selectedTabIndex = 2;
    }

    const active = () => {
      if (vm.supplierRMAParamId) {
        getSupplierRMADet();
        getDataKey();
      } else {
        getAutoCompleteData();
        if (vm.supplierRMA.packingSlipModeStatus === 'D') {
          vm.label = CORE.OPSTATUSLABLEPUBLISH;
        }
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
          $state.go(TRANSACTION.TRANSACTION_SUPPLIER_RMA_STATE);
        }
      }, (error) => BaseService.getErrorLog(error));
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
            if (vm.supplierRMADetailForm && vm.supplierRMALineDetailForm) {
              vm.supplierRMADetailForm.$setPristine();
              vm.supplierRMALineDetailForm.$setPristine();
            }
            vm.resetRMAMaterialDet();
            return true;
          }
          if (step === 2) {
            if (vm.supplierRMAMiscForm) {
              vm.supplierRMAMiscForm.$setPristine();
            }
            return true;
          }
        }
      }, () => { }).catch((error) => BaseService.getErrorLog(error));
    };

    function checkAndAutoSetStockForSingleLine() {
      if (vm.supplierRMADet &&
        vm.supplierRMADet.refPackingSlipIdForRma &&
        vm.supplierRMADet.refPackingSlipDetIdForRMA &&
        vm.supplierRMADet.partID &&
        vm.supplierRMADet.packagingID) {
        vm.cgBusyLoading = PackingSlipFactory.getSupplierRMAStockList().query({
          rmaDetailId: vm.supplierRMADet.id,
          packingSlipId: vm.supplierRMADet.refPackingSlipIdForRma,
          packingSlipDetailId: vm.supplierRMADet.refPackingSlipDetIdForRMA,
          partId: vm.supplierRMADet.partID,
          packagingId: vm.supplierRMADet.packagingID
        }).$promise.then((stockList) => {
          if (stockList && stockList.data && stockList.data.length === 1) {
            rmaStockDetailList = stockList.data;

            _.map(rmaStockDetailList, (data) => {
              data.isSelect = true;
              data.isNotValidShipmentQty = false;
              data.rmaId = vm.supplierRMAParamId;
              data.packingSlipId = vm.supplierRMADet.refPackingSlipIdForRma;
              data.packingSlipDetId = vm.supplierRMADet.refPackingSlipDetIdForRMA;
              data.orgAvailableQty = data.stockId ? CalcSumofArrayElement([data.availableQty, data.shipmentQty], _unitFilterDecimal) : angular.copy(data.availableQty);

              if (data.umidId) {
                data.availableQty = CalcSumofArrayElement([data.orgAvailableQty, (data.availableQtyAtRMA * -1)], _unitFilterDecimal);
              } else {
                data.availableQty = CalcSumofArrayElement([data.orgAvailableQty, (data.shipmentQty * -1)], _unitFilterDecimal);
              }
              data.shipmentQty = angular.copy(data.availableQty);
              data.availableQty = 0;
              data.transactionAction = 'Add';
            });

            vm.supplierRMADet.receivedQty = CalcSumofArrayElement(_.map(rmaStockDetailList, 'shipmentQty'), 0);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    }

    const getSupplierList = () => {
      const queryObj = {
        isCustomerCodeRequired: true
      };
      return MasterFactory.getSupplierList().query(queryObj).$promise.then((response) => {
        if (response && response.data) {
          vm.supplierList = response.data;
        }
        return $q.resolve(vm.supplierList);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const getGenericCategoryList = () => {
      const GencCategoryType = [vm.CategoryTypeObjList.ShippingType.Name, vm.CategoryTypeObjList.Carriers.Name];
      const listObj = {
        GencCategoryType: GencCategoryType,
        isActive: true
      };
      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((genricData) => {
        if (genricData && genricData.data) {
          const allGenericList = genricData.data;
          _.map(allGenericList, (item) => {
            if (item.gencCategoryCode) {
              item.gencCategoryDisplayName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.gencCategoryCode, item.gencCategoryName);
            }
            else {
              item.gencCategoryDisplayName = item.gencCategoryName;
            }
          });
          vm.shippingMethodList = _.filter(allGenericList, (data) => data.categoryType === vm.CategoryTypeObjList.ShippingType.Name);
          vm.carrierList = _.filter(allGenericList, (data) => data.categoryType === vm.CategoryTypeObjList.Carriers.Name);
          return $q.resolve(allGenericList);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const getSupplierRMADocumentCount = () => {
      if (vm.supplierRMA && vm.supplierRMA.id) {
        vm.cgBusyLoading = PackingSlipFactory.getPackingSlipDocumentCount().query({
          id: vm.supplierRMA.id,
          type: CORE.AllEntityIDS.Supplier_RMA.Name
        }).$promise.then((response) => {
          vm.documentCount = response.data;
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.documentCount = 0;
      }
    };

    const getSupplierPnByIdPackagingMfg = () => {
      if (vm.supplierRMA && vm.supplierRMADet && vm.supplierRMA.mfgCodeID && vm.supplierRMADet.partID && vm.supplierRMADet.packagingID) {
        vm.cgBusyLoading = SupplierRMAFactory.getSupplierPnByIdPackagingMfg().query({
          mfrCodeId: vm.supplierRMA.mfgCodeID,
          mfrPNId: vm.supplierRMADet.partID,
          packagingId: vm.supplierRMADet.packagingID
        }).$promise.then((response) => {
          if (response && response.data) {
            vm.supplierRMADet.supplierMFGPNID = response.data.id;
            vm.supplierRMADet.supplierMfgCodeId = response.data.mfgCodemst.id;
            vm.supplierRMADet.supplierCode = response.data.mfgCodemst && response.data.mfgCodemst.mfgCodeName ? response.data.mfgCodemst.mfgCodeName : null;
            vm.supplierRMADet.supplierPN = response.data.mfgPN;
          } else {
            vm.supplierRMADet.supplierMFGPNID = null;
            vm.supplierRMADet.supplierMfgCodeId = null;
            vm.supplierRMADet.supplierCode = null;
            vm.supplierRMADet.supplierPN = null;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.supplierRMADet.supplierMFGPNID = null;
        vm.supplierRMADet.supplierMfgCodeId = null;
        vm.supplierRMADet.supplierCode = null;
        vm.supplierRMADet.supplierPN = null;
        validationOfAddDetailWithoutSupplier();
      }
    };

    const validationOfAddDetailWithoutSupplier = () => {
      if (!vm.supplierRMA.mfgCodeID && vm.supplierRMADet.partID) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.WITHOUT_SUPPLIER_RMA_DETAIL_NOT_ADD);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        return DialogFactory.messageAlertDialog(obj).then((yes) => {
          if (yes) {
            vm.resetRMAMaterialDet();
            $timeout(() => {
              setFocusByName('Supplier');
            });
          }
        }, () => { }, (error) => BaseService.getErrorLog(error));
      }
    };

    const getAutoCompleteData = () => {
      const autocompletePromise = [getSupplierList(), getGenericCategoryList(), getPackaging()];
      vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
        vm.cgBusyLoading = $q.all([initAutoComplete(), initRMAMFRAutoComplete(), initRMALineAutoComplete()]).then(() => {
          if (vm.autoCompletecomponent && vm.partid) {
            getComponentDetailsByMfg({
              id: vm.partid,
              mfgType: CORE.MFG_TYPE.MFG,
              isContainCPN: true
            });
          }

          if (vm.autoPackingSlip && vm.partid) {
            getPackingSlipBySearch({
              packingSlipId: vm.packingslipid,
              mfrPnId: vm.partid
            });
          }

          if (vm.autoCompletecomponent && vm.partid) {
            setFocusByName('rmaSerialNumber');
          } else if (vm.supplierRMAParamId) {
            $timeout(() => { setFocusByName('rmaScanLabel'); });
          } else {
            $timeout(() => { setFocusByName('Supplier'); });
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const getPackingSlipSearch = (searchObj) => PackingSlipFactory.getPackingSlipInvoice().query({ search: searchObj }).$promise.then((packingSlip) => {
      if (packingSlip) {
        return packingSlip.data;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    const selectSupplierRMA = (item) => {
      if (item) {
        $state.go(TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_RMA_STATE, {
          type: vm.supplierRMATab.SupplierRMA,
          id: item.id
        });
      }
    };

    const setAddressButtonsState = (buttonsObj, isDisabled) => {
      buttonsObj.AddNew.isDisable = isDisabled;
      buttonsObj.Update.isDisable = isDisabled;
      buttonsObj.ApplyNew.isDisable = isDisabled;
      buttonsObj.Delete.isDisable = isDisabled;
      buttonsObj.SetDefault.isDisable = isDisabled;
    };

    const getSupplierRMADet = () => {
      if (vm.supplierRMAParamId) {
        vm.supplierRMADisable = false;
        vm.cgBusyLoading = PackingSlipFactory.getPackingSlipDet().query({
          id: vm.supplierRMAParamId,
          receiptType: TRANSACTION.PackingSlipReceiptType.SupplierRMA
        }).$promise.then((response) => {
          if (response.data) {
            vm.supplierRMA = response.data ? response.data.PackingSlip : null;
            if (vm.supplierRMA) {
              vm.copySupplierRMA = angular.copy(vm.supplierRMA);
              vm.supplierRMA.mfgCode = vm.supplierRMA.mfgCodemst ? vm.supplierRMA.mfgCodemst.mfgCode : null;

              vm.supplierRMA.poDate = vm.supplierRMA.poDate ? BaseService.getUIFormatedDate(vm.supplierRMA.poDate, vm.DefaultDateFormat) : null;
              vm.supplierRMA.receiptDate = vm.supplierRMA.receiptDate ? BaseService.getUIFormatedDate(vm.supplierRMA.receiptDate, vm.DefaultDateFormat) : null;
              vm.supplierRMA.packingSlipDate = vm.supplierRMA.packingSlipDate ? BaseService.getUIFormatedDate(vm.supplierRMA.packingSlipDate, vm.DefaultDateFormat) : null;
              vm.supplierRMA.shippedDate = vm.supplierRMA.shippedDate ? BaseService.getUIFormatedDate(vm.supplierRMA.shippedDate, vm.DefaultDateFormat) : null;
              if (vm.supplierRMA.refInvoice && vm.supplierRMA.refInvoice.creditMemoDate) {
                vm.supplierRMA.refInvoice.creditMemoDate = vm.supplierRMA.refInvoice.creditMemoDate ? BaseService.getUIFormatedDate(vm.supplierRMA.refInvoice.creditMemoDate, vm.DefaultDateFormat) : null;
              }
              vm.supplierRMA.lockedAt = BaseService.getUIFormatedDateTimeInCompanyTimeZone(vm.supplierRMA.lockedAt, _dateTimeDisplayFormat);
              vm.supplierRMA.lockedByUser = vm.supplierRMA.packingSlipLockedBy && vm.supplierRMA.packingSlipLockedBy.username ? vm.supplierRMA.packingSlipLockedBy.username : '';
              vm.trackingNumberDet.trackNumber = null;
              vm.supplierRMA.oldPackingSlipModeStatus = angular.copy(vm.supplierRMA.packingSlipModeStatus);
              if (vm.supplierRMA.status === vm.supplierRMAStatusCode.WaitingForCreditMemo || vm.supplierRMA.status === vm.supplierRMAStatusCode.CreditMemoReceived || vm.supplierRMA.status === vm.supplierRMAStatusCode.ApprovedToPay || vm.supplierRMA.status === vm.supplierRMAStatusCode.Paid || vm.supplierRMA.packingSlipModeStatus !== 'D') {
                vm.supplierRMADisable = true;
              }
              setAddressButtonsState(vm.rmaAddressViewActionBtnDet, vm.supplierRMADisable);
              setAddressButtonsState(vm.rmaAddressContPersonViewActionBtnDet, vm.supplierRMADisable);
              setAddressButtonsState(vm.rmaMarkedForAddressViewActionBtnDet, vm.supplierRMADisable);
              setAddressButtonsState(vm.rmaMarkedForAddressContPersonViewActionBtnDet, vm.supplierRMADisable);
              vm.supplierRMA.supplierRMATrackNumber = vm.supplierRMA.packingSlipTrackNumber || [];
              _.each(vm.supplierRMA.supplierRMATrackNumber, (item, index) => {
                item.tempID = (index + 1);
              });
              vm.supplierRMA.mfgFullName = (vm.supplierRMA.mfgCodemst && vm.supplierRMA.mfgCodemst.mfgCodeName) ? vm.supplierRMA.mfgCodemst.mfgCodeName : null;
              if (vm.supplierRMA.packingSlipModeStatus === 'D') {
                vm.label = CORE.OPSTATUSLABLEPUBLISH;
              } else if (vm.supplierRMA.packingSlipModeStatus === 'P') {
                vm.label = CORE.OPSTATUSLABLEDRAFT;
              } else {
                vm.label = null;
              }
              vm.rmaAddressViewAddrOtherDet.alreadySelectedPersonId = vm.supplierRMA.rmaShippingContactPersonID;
              vm.rmaMarkedAddressViewAddrOtherDet.alreadySelectedPersonId = vm.supplierRMA.rmaMarkForContactPersonID;

              getAutoCompleteData();
              vm.checkDateValidation();
              getSupplierRMADocumentCount();
              vm.supplierRMA.statusText = (_.find(CORE.SupplierRMAStatus, {
                code: vm.supplierRMA.status
              }) || {
                value: CORE.SupplierRMAStatus[1].value
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

    // get customer contact person list
    const getCustomerContactPersonList = (objData) => CustomerFactory.getCustomerContactPersons().query({
      refTransID: (objData && objData.supplierID) ? objData.supplierID : null,
      refTableName: CORE.TABLE_NAME.MFG_CODE_MST
    }).$promise.then((contactperson) => {
      if (contactperson && contactperson.data && objData) {
        if (objData.addressType === CORE.AddressType.RMAShippingAddress) {
          vm.rmaAddressContactPerson = _.find(contactperson.data, (item) => item.personId === objData.alreadySelectedPersonId);
          vm.rmaAddressViewAddrOtherDet.alreadySelectedPersonId = vm.rmaAddressContactPerson ? vm.rmaAddressContactPerson.personId : null;
        } else if (objData.addressType === CORE.AddressType.RMAIntermediateAddress) {
          vm.markedForAddressContactPerson = _.find(contactperson.data, (item) => item.personId === objData.alreadySelectedPersonId);
          vm.rmaMarkedAddressViewAddrOtherDet.alreadySelectedPersonId = vm.markedForAddressContactPerson ? vm.markedForAddressContactPerson.personId : null;
        }
      }
    }).catch((error) => BaseService.getErrorLog(error));

    const getRMAAddressList = (id, addressBlockTitle) => {
      vm.cgBusyLoading = CustomerFactory.customerAddressList().query({
        customerId: id,
        addressType: [CORE.AddressType.RMAShippingAddress, CORE.AddressType.RMAIntermediateAddress],
        refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
        onlyDefault: vm.supplierRMAParamId ? false : true
      }).$promise.then((rmaAddress) => {
        if (addressBlockTitle) {
          if (addressBlockTitle === vm.LabelConstant.COMMON.RMAShippingAddress) {
            if (vm.supplierRMA && vm.supplierRMA.rmaShippingAddressId && vm.supplierRMAParamId) {
              vm.rmaAddress = _.find(rmaAddress.data, (item) => item.id === vm.supplierRMA.rmaShippingAddressId);
              vm.rmaAddressViewAddrOtherDet.alreadySelectedAddressID = vm.rmaAddress ? vm.rmaAddress.id : null;
              getCustomerContactPersonList({
                supplierID: vm.supplierRMA.mfgCodeID,
                addressType: CORE.AddressType.RMAShippingAddress,
                alreadySelectedPersonId: vm.supplierRMA.rmaShippingContactPersonID
              });
            } else {
              if (!vm.supplierRMAParamId) {
                vm.rmaAddress = _.find(rmaAddress.data, (item) => item.isDefault === true);
                vm.rmaAddressViewAddrOtherDet.alreadySelectedAddressID = vm.rmaAddress ? vm.rmaAddress.id : null;
                vm.supplierRMA.rmaShippingAddressId = vm.rmaAddressViewAddrOtherDet.alreadySelectedAddressID;
                vm.rmaAddressContactPerson = (vm.rmaAddress && vm.rmaAddress.contactPerson) ? angular.copy(vm.rmaAddress.contactPerson) : null;
                vm.rmaAddressViewAddrOtherDet.alreadySelectedPersonId = vm.rmaAddressContactPerson ? vm.rmaAddressContactPerson.personId : null;
                vm.supplierRMA.rmaShippingContactPersonID = vm.rmaAddressViewAddrOtherDet.alreadySelectedPersonId;
              }
              else {
                vm.rmaAddress = null;
                vm.rmaAddressContactPerson = null;
                vm.rmaAddressViewAddrOtherDet.alreadySelectedAddressID = null;
                vm.rmaAddressViewAddrOtherDet.alreadySelectedPersonId = null;
              }
            }
            if (!rmaAddress || !rmaAddress.data || rmaAddress.data.length === 0 &&
              (vm.rmaAddressViewAddrOtherDet && !vm.rmaAddressViewAddrOtherDet.alreadySelectedAddressID)) {
              vm.rmaAddressViewAddrOtherDet.showAddressEmptyState = true;
            } else {
              vm.rmaAddressViewAddrOtherDet.showAddressEmptyState = false;
            }
          } else if (addressBlockTitle === vm.LabelConstant.Address.RMAIntermediateAddress) {
            if (vm.supplierRMA && vm.supplierRMA.rmaMarkForAddressId && vm.supplierRMAParamId) {
              vm.rmaMarkForAddress = _.find(rmaAddress.data, (item) => item.id === vm.supplierRMA.rmaMarkForAddressId);
              vm.rmaMarkedAddressViewAddrOtherDet.alreadySelectedAddressID = vm.rmaMarkForAddress ? vm.rmaMarkForAddress.id : null;
              getCustomerContactPersonList({
                supplierID: vm.supplierRMA.mfgCodeID,
                addressType: CORE.AddressType.RMAIntermediateAddress,
                alreadySelectedPersonId: vm.supplierRMA.rmaMarkForContactPersonID
              });
            } else {
              if (!vm.supplierRMAParamId) {
                vm.rmaMarkedAddressViewAddrOtherDet.alreadySelectedAddressID = null;
                vm.rmaMarkedAddressViewAddrOtherDet.alreadySelectedPersonId = null;
              }
              else {
                vm.rmaMarkForAddress = null;
                vm.markedForAddressContactPerson = null;
                vm.rmaMarkedAddressViewAddrOtherDet.alreadySelectedAddressID = null;
                vm.rmaMarkedAddressViewAddrOtherDet.alreadySelectedPersonId = null;
              }
            }
            if (!rmaAddress || !rmaAddress.data || rmaAddress.data.length === 0 &&
              (vm.rmaMarkedAddressViewAddrOtherDet && !vm.rmaMarkedAddressViewAddrOtherDet.rmaMarkForAddressId)) {
              vm.rmaMarkedAddressViewAddrOtherDet.showAddressEmptyState = true;
            } else {
              vm.rmaMarkedAddressViewAddrOtherDet.showAddressEmptyState = false;
            }
          }
        } else {
          if (vm.supplierRMA && vm.supplierRMA.rmaShippingAddressId && vm.supplierRMAParamId) {
            vm.rmaAddress = _.find(rmaAddress.data, (item) => item.id === vm.supplierRMA.rmaShippingAddressId);
            vm.rmaAddressViewAddrOtherDet.alreadySelectedAddressID = vm.rmaAddress ? vm.rmaAddress.id : null;
            getCustomerContactPersonList({
              supplierID: vm.supplierRMA.mfgCodeID,
              addressType: CORE.AddressType.RMAShippingAddress,
              alreadySelectedPersonId: vm.supplierRMA.rmaShippingContactPersonID
            });
          } else {
            if (!vm.supplierRMAParamId) {
              vm.rmaAddress = _.find(rmaAddress.data, (item) => item.isDefault === true);
              vm.rmaAddressViewAddrOtherDet.alreadySelectedAddressID = vm.rmaAddress ? vm.rmaAddress.id : null;
              vm.supplierRMA.rmaShippingAddressId = vm.rmaAddressViewAddrOtherDet.alreadySelectedAddressID;
              vm.rmaAddressContactPerson = (vm.rmaAddress && vm.rmaAddress.contactPerson) ? angular.copy(vm.rmaAddress.contactPerson) : null;
              vm.rmaAddressViewAddrOtherDet.alreadySelectedPersonId = vm.rmaAddressContactPerson ? vm.rmaAddressContactPerson.personId : null;
              vm.supplierRMA.rmaShippingContactPersonID = vm.rmaAddressViewAddrOtherDet.alreadySelectedPersonId;
            }
            else {
              vm.rmaAddress = null;
              vm.rmaAddressContactPerson = null;
              vm.rmaAddressViewAddrOtherDet.alreadySelectedAddressID = null;
              vm.rmaAddressViewAddrOtherDet.alreadySelectedPersonId = null;
            }
          }
          if (!rmaAddress || !rmaAddress.data || rmaAddress.data.length === 0 &&
            (vm.rmaAddressViewAddrOtherDet && !vm.rmaAddressViewAddrOtherDet.alreadySelectedAddressID)) {
            vm.rmaAddressViewAddrOtherDet.showAddressEmptyState = true;
          } else {
            vm.rmaAddressViewAddrOtherDet.showAddressEmptyState = false;
          }

          if (vm.supplierRMA && vm.supplierRMA.rmaMarkForAddressId && vm.supplierRMAParamId) {
            vm.rmaMarkForAddress = _.find(rmaAddress.data, (item) => item.id === vm.supplierRMA.rmaMarkForAddressId);
            vm.rmaMarkedAddressViewAddrOtherDet.alreadySelectedAddressID = vm.rmaMarkForAddress ? vm.rmaMarkForAddress.id : null;
            getCustomerContactPersonList({
              supplierID: vm.supplierRMA.mfgCodeID,
              addressType: CORE.AddressType.RMAIntermediateAddress,
              alreadySelectedPersonId: vm.supplierRMA.rmaMarkForContactPersonID
            });
          } else {
            if (!vm.supplierRMAParamId) {
              //vm.rmaMarkedAddressViewAddrOtherDet.alreadySelectedAddressID = null;
              //vm.rmaMarkedAddressViewAddrOtherDet.alreadySelectedPersonId = null;
              if (vm.rmaAddress && vm.rmaAddress.defaultIntermediateAddressID) {
                //vm.rmaMarkForAddress = _.find(rmaAddress.data, (item) => item.id === vm.rmaAddress.defaultIntermediateAddressID);
                vm.rmaMarkForAddress = vm.rmaAddress.defaultIntmdCustomerAddresses;
                vm.rmaMarkedAddressViewAddrOtherDet.alreadySelectedAddressID = vm.rmaMarkForAddress ? vm.rmaMarkForAddress.id : null;
                vm.supplierRMA.rmaMarkForAddressId = vm.rmaMarkedAddressViewAddrOtherDet.alreadySelectedAddressID;
                vm.markedForAddressContactPerson = (vm.rmaAddress && vm.rmaAddress.defaultIntmdContactPerson) ? angular.copy(vm.rmaAddress.defaultIntmdContactPerson) : null;
                vm.rmaMarkedAddressViewAddrOtherDet.alreadySelectedPersonId = vm.markedForAddressContactPerson ? vm.markedForAddressContactPerson.personId : null;
                vm.supplierRMA.rmaMarkForContactPersonID = vm.rmaMarkedAddressViewAddrOtherDet.alreadySelectedPersonId;
              }
            }
            else {
              vm.rmaMarkForAddress = null;
              vm.markedForAddressContactPerson = null;
              vm.rmaMarkedAddressViewAddrOtherDet.alreadySelectedAddressID = null;
              vm.rmaMarkedAddressViewAddrOtherDet.alreadySelectedPersonId = null;
            }
          }
          if (!rmaAddress || !rmaAddress.data || rmaAddress.data.length === 0 &&
            (vm.rmaMarkedAddressViewAddrOtherDet && !vm.rmaMarkedAddressViewAddrOtherDet.rmaMarkForAddressId)) {
            vm.rmaMarkedAddressViewAddrOtherDet.showAddressEmptyState = true;
          } else {
            vm.rmaMarkedAddressViewAddrOtherDet.showAddressEmptyState = false;
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.removeAddress = () => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DEFINE_ADDRESS_REMOVE_CONFIRMATION);
      messageContent.message = stringFormat(messageContent.message, 'RMA shipping ');
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then(() => {
        vm.supplierRMA.rmaShippingAddress = vm.supplierRMA.rmaShippingContactPerson = vm.supplierRMA.rmaShippingContactPersonID = vm.supplierRMA.rmaShippingAddressId =
          vm.rmaAddressViewAddrOtherDet.alreadySelectedPersonId = vm.rmaAddressViewAddrOtherDet.alreadySelectedAddressID = vm.rmaAddressContactPerson = vm.rmaAddress = null;
        vm.rmaAddressViewActionBtnDet.Update.isDisable = vm.rmaAddressViewActionBtnDet.Delete.isDisable = !vm.rmaAddress || vm.supplierRMADisable;
        // Static code to enable save button
        vm.supplierRMADetailForm.$$controls[0].$setDirty();
      }, () => { });
    };
    vm.removeContactPerson = () => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONTACT_PERSON_FROM_ADDR);
      messageContent.message = stringFormat(messageContent.message, 'RMA shipping ');
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then(() => {
        vm.supplierRMA.rmaShippingContactPerson = vm.supplierRMA.rmaShippingContactPersonID = vm.rmaAddressContactPerson = vm.rmaAddressViewAddrOtherDet.alreadySelectedPersonId = null;
        vm.rmaAddressContPersonViewActionBtnDet.Update.isDisable = vm.rmaAddressContPersonViewActionBtnDet.Delete.isDisable = !vm.rmaAddressContactPerson || vm.supplierRMADisable;
        // Static code to enable save button
        vm.supplierRMADetailForm.$$controls[0].$setDirty();
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    };
    vm.removeMarkedForContactPerson = () => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONTACT_PERSON_FROM_ADDR);
      messageContent.message = stringFormat(messageContent.message, 'mark for ');
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then(() => {
        vm.supplierRMA.rmaMarkForContactPerson = vm.supplierRMA.rmaMarkForContactPersonID = vm.markedForAddressContactPerson = vm.rmaMarkedAddressViewAddrOtherDet.alreadySelectedPersonId = null;
        vm.rmaMarkedForAddressContPersonViewActionBtnDet.Update.isDisable = vm.rmaMarkedForAddressContPersonViewActionBtnDet.Delete.isDisable = !vm.markedForAddressContactPerson || vm.supplierRMADisable;
        // Static code to enable save button
        vm.supplierRMADetailForm.$$controls[0].$setDirty();
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const getComponentDetailsByMfg = (searchObj) => ComponentFactory.getComponentMFGAliasSearch().query({ listObj: searchObj }).$promise.then((component) => {
      _.each(component.data.data, (comp) => {
        comp.ismfgpn = true;
      });
      if (searchObj.id || searchObj.id === 0) {
        $timeout(() => {
          if (vm.autoCompletecomponent.inputName) {
            $scope.$broadcast(vm.autoCompletecomponent.inputName, component.data.data[0]);
          }
          if (vm.autoCompleteMfgPIDCode) {
            $scope.$broadcast(vm.autoCompleteMfgPIDCode.inputName, component.data.data[0]);
          }
        });
      }
      return component.data.data;
    }).catch((error) => BaseService.getErrorLog(error));

    const duplicateRMALineMessage = (row, ev) => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RMA_LINE_EDIT_CONFIRMATION);
      messageContent.message = stringFormat(messageContent.message, vm.supplierRMADet.packingSlipSerialNumber);
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
        vm.supplierRMADet.packingSlipSerialNumber = null;
        setFocus('rmaSerialNumber');
      }, (error) => BaseService.getErrorLog(error));
    };

    const getPackaging = () => PartCostingFactory.getPackaging().query().$promise.then((packaging) => {
      if (packaging && packaging.data) {
        vm.packagingList = packaging.data;
      }
      return vm.packagingList;
    }).catch((error) => BaseService.getErrorLog(error));

    const getPackingSlipBySearch = (searchObj) => {
      if (searchObj) {
        return SupplierRMAFactory.getPackingSlipBySearch().query(searchObj).$promise.then((searchData) => {
          const receiptTypeList = searchData.data;
          vm.packingSlipList = _.filter(receiptTypeList, (data) => data.receiptType === vm.Transaction.PackingSlipReceiptType.PackingSlip);
          vm.supplierInvoiceList = _.filter(receiptTypeList, (data) => data.receiptType === vm.Transaction.PackingSlipReceiptType.SupplierInvoice);

          if (searchObj.packingSlipId) {
            $timeout(() => {
              if (vm.autoPackingSlip && vm.autoPackingSlip.inputName) {
                $scope.$broadcast(vm.autoPackingSlip.inputName, receiptTypeList[0]);
              }
              if ((!vm.supplierRMADet.id || !vm.isEdit) && searchObj.callingAutoCompleteName === 'AUTO-PACKAGING') {
                vm.supplierRMADet.packingSlipDetail = receiptTypeList[0].packingSlipMaterialReceiveDet;
                checkValidationPackingSlipAndPart('AUTO-PACKAGING');
              }
            });
          }

          if (searchObj.invoiceId) {
            onSelectInvoice(receiptTypeList[0]);
          }
          return receiptTypeList;
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    const validationForSPQ = () => {
      if (parseInt(vm.supplierRMADet.spq) === 0 && vm.supplierRMADet.sourceName === TRANSACTION.Packaging.TapeAndReel) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SPQ_ZERO_NOT_ALLOW_FOR_TR);
        const model = {
          messageContent: messageContent,
          multiple: false
        };
        return DialogFactory.messageAlertDialog(model).then((yes) => {
          if (yes) {
            BaseService.goToComponentDetailTab(CORE.MFG_TYPE.MFG, vm.supplierRMADet.partID, null);
            vm.resetRMAMaterialDet();
            setFocus('rmaScanLabel');
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    const editMaterialDetail = (row) => {
      if (vm.supplierRMALineDetailForm) {
        vm.supplierRMALineDetailForm.$setPristine();
        vm.supplierRMALineDetailForm.$setUntouched();
      }
      vm.materialDetTitle = 'Update';
      vm.isEdit = true;
      vm.supplierRMADet = angular.copy(row);
      if (vm.autoCompletecomponent) {
        getComponentDetailsByMfg({
          id: vm.supplierRMADet.partID,
          mfgType: CORE.MFG_TYPE.MFG,
          isContainCPN: true
        });
      }

      setFocus('rmaSerialNumber');
      if (vm.autoPackaging) {
        vm.autoPackaging.keyColumnId = vm.supplierRMADet.packagingID;
      }

      if (vm.autoPackingSlip && vm.supplierRMADet.refPackingSlipIdForRma) {
        vm.autoPackingSlip.keyColumnId = vm.supplierRMADet.refPackingSlipIdForRma;
        getPackingSlipBySearch({
          packingSlipId: vm.supplierRMADet.refPackingSlipIdForRma,
          mfrPnId: vm.supplierRMADet.partID,
          packagingId: vm.supplierRMADet.packagingID,
          refPackingSlipDetIdForRMA: vm.supplierRMADet.refPackingSlipDetIdForRMA
        });
      }

      if (vm.supplierRMADet.refInvoiceIdForRma) {
        getPackingSlipBySearch({
          invoiceId: vm.supplierRMADet.refInvoiceIdForRma,
          mfrPnId: vm.supplierRMADet.partID,
          packagingId: vm.supplierRMADet.packagingID,
          refPackingSlipDetIdForRMA: vm.supplierRMADet.refPackingSlipDetIdForRMA
        });
      }
    };

    // set data for customer address directive
    const setOtherDetForAddrDir = (addressBlockTitle, suppID) => {
      if (addressBlockTitle === vm.LabelConstant.COMMON.RMAShippingAddress) {
        vm.rmaAddressViewAddrOtherDet.customerId = suppID || vm.autoCompleteSupplier.keyColumnId;
        vm.rmaAddressViewAddrOtherDet.refTransID = suppID || vm.autoCompleteSupplier.keyColumnId;
        vm.rmaAddressViewAddrOtherDet.companyName = vm.supplierRMA.mfgName || null;
        vm.rmaAddressViewAddrOtherDet.companyNameWithCode = vm.supplierRMA.mfgFullName || null;
      } else if (addressBlockTitle === vm.LabelConstant.Address.RMAIntermediateAddress) {
        vm.rmaMarkedAddressViewAddrOtherDet.customerId = suppID || vm.autoCompleteSupplier.keyColumnId;
        vm.rmaMarkedAddressViewAddrOtherDet.refTransID = suppID || vm.autoCompleteSupplier.keyColumnId;
        vm.rmaMarkedAddressViewAddrOtherDet.companyName = vm.supplierRMA.mfgName || null;
        vm.rmaMarkedAddressViewAddrOtherDet.companyNameWithCode = vm.supplierRMA.mfgFullName || null;
      }
    };

    const initAutoComplete = () => {
      vm.autoCompleteSupplierRMA = {
        columnName: 'formattedTransNumber',
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'RMAPSNumber',
        placeholderName: 'Supplier RMA|Packing Slip#',
        isRequired: false,
        isAddnew: false,
        callbackFn: function () { },
        onSelectCallbackFn: selectSupplierRMA,
        onSearchFn: function (query) {
          const searchObj = {
            receiptType: 'R',
            searchquery: query
          };
          return getPackingSlipSearch(searchObj);
        }
      };

      vm.autoCompleteSupplier = {
        columnName: 'mfgCodeName',
        controllerName: CORE.MANAGE_MFGCODE_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_MFGCODE_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.supplierRMA && vm.supplierRMA.mfgCodeID ? vm.supplierRMA.mfgCodeID : null,
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
            vm.supplierRMA.mfgCodeID = item.id;
            vm.supplierRMA.mfgName = item.mfgName;
            vm.supplierRMA.mfgFullName = item.mfgCodeName;
            vm.supplierRMA.mfgCode = item.mfgCode;
            if (!vm.supplierRMAParamId) {
              vm.supplierRMA.shippingMethodId = item.rmaShippingMethodId;
              vm.supplierRMA.carrierId = item.rmaCarrierID;
              vm.supplierRMA.carrierAccountNumber = item.rmaCarrierAccount;
              vm.supplierRMA.shippingInsurance = item.rmaShippingInsurence;
            }
            setOtherDetForAddrDir(vm.LabelConstant.Address.RMAIntermediateAddress, item.id);
            setOtherDetForAddrDir(vm.LabelConstant.COMMON.RMAShippingAddress, item.id);
            vm.checkUniqueRMANumber();
            supplierPNbelongWithSelectedSupplierValidation();
            getRMAAddressList(vm.supplierRMA.mfgCodeID);
          } else {
            vm.supplierRMA.mfgCodeID = null;
            vm.supplierRMA.mfgName = null;
            vm.supplierRMA.mfgCode = null;
            vm.supplierRMA.mfgFullName = null;
            vm.supplierRMA.shippingMethodId = null;
            vm.supplierRMA.carrierId = null;
            vm.supplierRMA.carrierAccountNumber = null;
            vm.supplierRMA.shippingInsurance = null;
            vm.supplierRMA.rmaShippingAddressId = null;
            vm.supplierRMA.rmaShippingAddress = null;
            vm.supplierRMA.rmaShippingContactPersonID = null;
            vm.supplierRMA.rmaShippingContactPerson = null;
            vm.rmaAddressViewAddrOtherDet.alreadySelectedAddressID = null;
            vm.rmaAddressViewAddrOtherDet.alreadySelectedPersonId = null;
            // vm.rmaAddressList = [];
            vm.rmaAddress = null;
            vm.rmaAddressContactPerson = null;
            vm.rmaMarkForAddress = null;
            vm.markedForAddressContactPerson = null;
            vm.rmaAddressViewAddrOtherDet.showAddressEmptyState = false;
            vm.rmaAddressViewAddrOtherDet.showAddressEmptyState = false;
            vm.isDisableRMADate = false;
            vm.rmaAddressViewAddrOtherDet.customerId = null;
            vm.rmaAddressViewAddrOtherDet.refTransID = null;
            vm.rmaAddressViewAddrOtherDet.companyName = null;
            vm.rmaAddressViewAddrOtherDet.companyNameWithCode = null;
            vm.rmaMarkedAddressViewAddrOtherDet.customerId = null;
            vm.rmaMarkedAddressViewAddrOtherDet.refTransID = null;
            vm.rmaMarkedAddressViewAddrOtherDet.companyName = null;
            vm.rmaMarkedAddressViewAddrOtherDet.companyNameWithCode = null;
          }
          initAutoComplete();
        }
      };

      vm.autoCompleteShippingMethod = {
        columnName: 'gencCategoryDisplayName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.supplierRMA && vm.supplierRMA.shippingMethodId ? vm.supplierRMA.shippingMethodId : null,
        inputName: vm.CategoryTypeObjList.ShippingType.Name,
        placeholderName: vm.CategoryTypeObjList.ShippingType.Title,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_SHIPPINGTYPE_MANAGEGENERICCATEGORY_STATE],
          pageNameAccessLabel: CORE.PageName.shippingMethods,
          headerTitle: vm.CategoryTypeObjList.ShippingType.Title
        },
        isRequired: true,
        isAddnew: true,
        callbackFn: getGenericCategoryList,
        onSelectCallbackFn: (item) => {
          if (item && item.gencCategoryID) {
            vm.supplierRMA.shippingMethodId = item.gencCategoryID;
          } else {
            vm.supplierRMA.shippingMethodId = null;
          }
        }
      };

      vm.autoCompleteCarrier = {
        columnName: 'gencCategoryDisplayName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.supplierRMA && vm.supplierRMA.carrierId ? vm.supplierRMA.carrierId : null,
        inputName: vm.CategoryTypeObjList.Carriers.Title,
        placeholderName: vm.CategoryTypeObjList.Carriers.Title,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_CARRIERMST_MANAGEGENERICCATEGORY_STATE],
          pageNameAccessLabel: CORE.PageName.Carrier,
          headerTitle: vm.CategoryTypeObjList.Carriers.Title
        },
        isRequired: true,
        isAddnew: true,
        callbackFn: getGenericCategoryList,
        onSelectCallbackFn: (item) => {
          if (item && item.gencCategoryID) {
            vm.supplierRMA.carrierId = item.gencCategoryID;
          } else {
            vm.supplierRMA.carrierId = null;
          }
        }
      };
    };

    const initRMAMFRAutoComplete = () => {
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
        isRequired: true,
        callbackFn: function (obj) {
          const searchObj = {
            id: obj.id,
            mfgType: CORE.MFG_TYPE.MFG,
            isContainCPN: true
          };
          return getComponentDetailsByMfg(searchObj);
        },
        onSelectCallbackFn: (item) => {
          if (item) {
            if (item.id) {
              let messageContent;
              if (item.isGoodPart === CORE.PartCorrectList.CorrectPart) {
                const isDifferentPartSelected = (vm.supplierRMADet.partID !== item.id);
                vm.supplierRMADet.partID = item.id;
                vm.supplierRMADet.mfgcodeID = item.mfgcodeID;
                vm.supplierRMADet.mfgCode = item.mfgCode;
                vm.supplierRMADet.mfgName = item.mfgName;
                vm.supplierRMADet.fullMfgName = item.mfgCodeName;
                vm.supplierRMADet.mfgPN = item.orgMfgPN;
                vm.supplierRMADet.PIDCode = item.PIDCode;
                vm.supplierRMADet.rohsIcon = item.rohsIcon;
                vm.supplierRMADet.rohsName = item.rohsName;
                vm.supplierRMADet.unit = item.unit;
                vm.supplierRMADet.uom = item.uom;
                vm.supplierRMADet.uomName = item.unitName;
                vm.supplierRMADet.imageURL = BaseService.getPartMasterImageURL(item.documentPath, item.imageURL);
                $scope.$broadcast(vm.autoCompleteMfgPIDCode.inputName, item);
                if (scanPackingSlipDetail && scanPackingSlipDetail.packaging) {
                  const packagingObj = _.find(vm.packagingList, (data) => data.name === scanPackingSlipDetail.packaging);
                  vm.supplierRMADet.packagingID = packagingObj && packagingObj.id ? packagingObj.id : null;
                  vm.autoPackaging.keyColumnId = vm.supplierRMADet.packagingID;
                  vm.supplierRMADet.packaging = packagingObj ? packagingObj.name : null;
                  vm.supplierRMADet.sourceName = packagingObj ? packagingObj.sourceName : null;
                } else {
                  vm.supplierRMADet.packagingID = vm.supplierRMADet && (vm.supplierRMADet.supplierPackagingId || item.packagingID || vm.supplierRMADet.packagingID);
                  vm.autoPackaging.keyColumnId = vm.supplierRMADet.packagingID;
                  const packagingObj = _.find(vm.packagingList, (data) => data.id === vm.supplierRMADet.packagingID);
                  vm.supplierRMADet.packaging = packagingObj ? packagingObj.name : null;
                  vm.supplierRMADet.sourceName = packagingObj ? packagingObj.sourceName : null;
                }

                vm.supplierRMADet.spq = vm.supplierRMADet && vm.supplierRMADet.supplierSpq ? parseInt(vm.supplierRMADet.supplierSpq) : item.packageQty ? parseInt(item.packageQty) : 0;
                vm.supplierRMADet.partType = item.partType;
                initRMALineAutoComplete();
                if (isDifferentPartSelected) {
                  checkAndAutoSetStockForSingleLine();
                }
              } else {
                messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MFRPN_BAD_PART);
                messageContent.message = stringFormat(messageContent.message, item.PIDCode, item.isGoodPart === CORE.PartCorrectList.IncorrectPart ? CORE.PartCorrectLabelList.IncorrectPart : CORE.PartCorrectLabelList.UnknownPart);
                const model = {
                  messageContent: messageContent,
                  multiple: true
                };
                DialogFactory.messageAlertDialog(model).then(() => {
                  if (vm.supplierRMADet) {
                    vm.supplierRMADet.partID = vm.supplierRMADet.mfgPN = null;
                  }
                  $scope.$broadcast(vm.autoCompletecomponent.inputName, null);
                  $scope.$broadcast(vm.autoCompleteMfgPIDCode.inputName, null);
                  vm.autoCompletecomponent.keyColumnId = null;
                  vm.autoCompleteMfgPIDCode.keyColumnId = null;
                  setFocusByName(CORE.LabelConstant.MFG.MFGPN);
                });
              }
            }
          } else {
            vm.supplierRMADet.partID = null;
            vm.supplierRMADet.mfgCode = null;
            vm.supplierRMADet.mfgName = null;
            vm.supplierRMADet.mfgcodeID = null;
            vm.supplierRMADet.fullMfgName = null;
            vm.supplierRMADet.mfgPN = null;
            vm.supplierRMADet.PIDCode = null;
            vm.supplierRMADet.rohsIcon = null;
            vm.supplierRMADet.rohsName = null;
            vm.supplierRMADet.unit = null;
            vm.supplierRMADet.uom = null;
            vm.supplierRMADet.uomName = null;
            vm.supplierRMADet.packagingID = null;
            vm.supplierRMADet.packaging = null;
            vm.supplierRMADet.sourceName = null;
            scanPackingSlipDetail = null;
            vm.supplierRMADet.imageURL = null;
            $scope.$broadcast(vm.autoCompleteMfgPIDCode.inputName, null);

            initRMALineAutoComplete();
          }
        },
        onSearchFn: function (query) {
          const searchObj = {
            query: query,
            mfgType: CORE.MFG_TYPE.MFG,
            inputName: vm.autoCompletecomponent.inputName,
            isContainCPN: true
          };
          return getComponentDetailsByMfg(searchObj);
        }
      };
      vm.autoCompleteMfgPIDCode = {
        columnName: 'PIDCode',
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'autoCompleteMfgPIDCode',
        placeholderName: CORE.LabelConstant.MFG.PID,
        isAddnew: true,
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          popupAccessRoutingState: [USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE],
          pageNameAccessLabel: CORE.LabelConstant.PART_MASTER.PageName
        },
        isRequired: true,
        callbackFn: function () {
        },
        onSelectCallbackFn: (item) => {
          if (item) {
            $scope.$broadcast(vm.autoCompletecomponent.inputName, item);
          } else {
            $scope.$broadcast(vm.autoCompletecomponent.inputName, null);
          }
        },
        onSearchFn: function (query) {
          const searchObj = {
            query: query,
            mfgType: CORE.MFG_TYPE.MFG,
            inputName: vm.autoCompleteMfgPIDCode.inputName,
            isContainCPN: true
          };
          return getComponentDetailsByMfg(searchObj);
        }
      };
    };

    function onSelectInvoice(item) {
      vm.supplierRMADet.refInvoiceIdForRma = item.id;
      vm.supplierRMADet.refInvoiceValue = item.invoiceNumber;
      vm.supplierRMADet.refInvoiceForRma = null;
      if (vm.supplierRMADet.refPackingSlipDetIdForRMA) {
        const selectItem = _.find(vm.supplierRMADet.packingSlipDetail, (data) => data.id === vm.supplierRMADet.refPackingSlipDetIdForRMA);
        if (selectItem) {
          /*select invoice line for qty and price*/
          const selectItemDetail = _.find(item.packingSlipMaterialReceiveDet, (data) => data.packingSlipSerialNumber === selectItem.packingSlipSerialNumber);
          if (selectItemDetail) {
            vm.supplierRMADet.packingSlipDetail = [selectItemDetail];
          }
        }
      } else {/*assign packing slip line details in case of invoice not created for selected packing slip*/
        vm.supplierRMADet.packingSlipDetail = item.packingSlipMaterialReceiveDet;
      }
      if (!vm.supplierRMADet.id || (vm.supplierRMADet.id && !vm.supplierRMADet.invoicePrice)) {
        vm.supplierRMADet.packingSlipQty = null;
        vm.supplierRMADet.receivedQty = null;
        if (vm.supplierRMADet.packingSlipDetail && vm.supplierRMADet.packingSlipDetail.length > 1) {
          //if (vm.supplierRMADet.refPackingSlipDetIdForRMA) {
          //  const selectItem = _.find(vm.supplierRMADet.packingSlipDetail, (data) => data.id === vm.supplierRMADet.refPackingSlipDetIdForRMA);
          //  vm.supplierRMADet.packingSlipDetail = [selectItem];
          //} else {
          selectLineForSameMfrPnLine(item, 'Add');
          //}
        } else {
          checkPackingSlipBelongSameSupplier(item.mfgCodeID, item.packingSlipNumber, 'AUTO-PACKINGSLIP');
        }
      } else if (vm.supplierRMADet.id && vm.supplierRMADet.refInvoiceIdForRma && !vm.isEdit) {
        vm.supplierRMADet.packingSlipQty = null;
        vm.supplierRMADet.receivedQty = null;
        if (vm.supplierRMADet.packingSlipDetail && vm.supplierRMADet.packingSlipDetail.length > 1) {
          selectLineForSameMfrPnLine(item, 'Edit');
        } else {
          checkValidationPackingSlipAndPart('AUTO-PACKINGSLIP');
        }
      }
    }

    const initRMALineAutoComplete = () => {
      vm.autoPackaging = {
        columnName: 'name',
        keyColumnName: 'id',
        controllerName: CORE.MANAGE_PACKAGING_TYPE_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_PACKAGING_TYPE_MODAL_VIEW,
        keyColumnId: vm.supplierRMADet && vm.supplierRMADet.packagingID ? vm.supplierRMADet.packagingID : null,
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
            vm.supplierRMADet.packagingID = item.id;
            vm.supplierRMADet.packaging = item.name;
            vm.supplierRMADet.sourceName = item.sourceName;
            validationForSPQ();
            if (vm.supplierRMADet && vm.supplierRMADet.partID && vm.supplierRMADet.refPackingSlipIdForRma) {
              getPackingSlipBySearch({
                searchQuery: null,
                receiptTypes: vm.Transaction.PackingSlipReceiptType.PackingSlip,
                supplierId: vm.supplierRMADet.mfgcodeID,
                mfrPnId: vm.supplierRMADet.partID,
                packingSlipId: vm.supplierRMADet.refPackingSlipIdForRma,
                packagingId: vm.supplierRMADet.packagingID,
                callingAutoCompleteName: 'AUTO-PACKAGING'
              });
            } else if (!vm.supplierRMADet.id || !vm.isEdit) {
              checkValidationPackingSlipAndPart('AUTO-PACKAGING');
            }
          } else {
            vm.supplierRMADet.packagingID = null;
            vm.supplierRMADet.packaging = null;
            vm.supplierRMADet.sourceName = null;
            vm.isEdit = false;
          }
          //if (!vm.supplierRMADet.id || !vm.isEdit) {
          //  checkValidationPackingSlipAndPart('AUTO-PACKAGING');
          //}
          getSupplierPnByIdPackagingMfg();
        }
      };

      vm.autoPackingSlip = {
        columnName: 'packingSlipNumber',
        keyColumnName: 'id',
        keyColumnId: vm.supplierRMADet && vm.supplierRMADet.refPackingSlipIdForRma ? vm.supplierRMADet.refPackingSlipIdForRma : null,
        inputName: 'PackingSlipNumber',
        placeholderName: 'Packing Slip#',
        isAddnew: false,
        onSearchFn: (query) => {
          const searchObj = {
            searchQuery: query,
            receiptTypes: vm.Transaction.PackingSlipReceiptType.PackingSlip,
            supplierId: vm.supplierRMA.mfgCodeID,
            mfrPnId: vm.supplierRMADet.partID,
            packagingId: vm.supplierRMADet.packagingID
          };
          return getPackingSlipBySearch(searchObj);
        },
        onSelectCallbackFn: (item) => {
          if (item) {
            if (item.id !== vm.supplierRMADet.refPackingSlipIdForRma) {
              if (item.packingSlipModeStatus === CORE.PackingSlipModeStatus[0].ID) {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PACKING_SLIP_IN_DRAFT_INVOICE_NOT_CREATE);
                messageContent.message = stringFormat(messageContent.message, 'supplier RMA', redirectToPackingSlipDetail(item.id, item.packingSlipNumber));
                const model = {
                  messageContent: messageContent,
                  multiple: true
                };
                DialogFactory.messageAlertDialog(model).then((yes) => {
                  if (yes) {
                    $scope.$broadcast(vm.autoPackingSlip.inputName, null);
                    vm.supplierRMADet.refPackingSlipIdForRma = null;
                    vm.supplierRMADet.refPackingSlipDetIdForRMA = null;
                    vm.supplierRMADet.refPackingSlipValue = null;
                    vm.supplierRMADet.refInvoiceIdForRma = null;
                    vm.supplierRMADet.packingSlipQty = null;
                    vm.supplierRMADet.receivedQty = null;
                    vm.supplierRMADet.refInvoiceValue = null;
                    vm.supplierRMADet.packingSlipDetail = null;
                    clearDataBasedOnInvoice();
                    setFocusByName(vm.autoPackingSlip.inputName);
                  }
                }).catch((error) => BaseService.getErrorLog(error));
              } else {
                vm.supplierRMADet.refPackingSlipIdForRma = item.id;
                vm.supplierRMADet.refPackingSlipValue = item.packingSlipNumber;
                if (!vm.supplierRMADet.id) {
                  vm.supplierRMADet.refPackingSlipDetIdForRMA = item.packingSlipMaterialReceiveDet.length === 1 ? item.packingSlipMaterialReceiveDet[0].id : null;
                }
                vm.supplierRMADet.refPackingSlipForRma = null;
                vm.supplierRMADet.refInvoiceIdForRma = item.refPackingSlipNumberForInvoice;

                vm.supplierRMADet.packingSlipDetail = item.packingSlipMaterialReceiveDet;
                if (!item.refPackingSlipNumberForInvoice || (vm.supplierRMADet.id && (!vm.supplierRMADet.packingSlipQty || !vm.supplierRMADet.receivedQty))) {
                  checkPackingSlipBelongSameSupplier(item.mfgCodeID, item.packingSlipNumber, 'AUTO-PACKINGSLIP');
                } else {
                  const objPSDetail = _.find(item.packingSlipMaterialReceiveDet, (data) => data.id === vm.supplierRMADet.refPackingSlipDetIdForRMA);
                  if (objPSDetail) {
                    vm.supplierRMADet.orgPackingSlipQty = angular.copy(objPSDetail.packingSlipQty);
                    vm.supplierRMADet.orgReceivedQty = angular.copy(objPSDetail.receivedQty);
                  }
                }
                if (!vm.isEdit && item.refPackingSlipNumberForInvoice) {
                  getPackingSlipBySearch({
                    invoiceId: item.refPackingSlipNumberForInvoice,
                    mfrPnId: vm.supplierRMADet.partID,
                    packagingId: vm.supplierRMADet.packagingID
                  });
                } else {
                  vm.isEdit = false;
                }
                if (item && item.packingSlipMaterialReceiveDet.length === 1) {
                  checkAndAutoSetStockForSingleLine();
                } else {
                  selectLineForSameMfrPnLine(item, 'Add');
                }
              }
            }
          } else {
            if (vm.supplierRMADet.receivedQty && vm.supplierRMADet.id) {
              const searchObj = {
                packingSlipId: vm.supplierRMADet.refPackingSlipIdForRma,
                receiptTypes: vm.Transaction.PackingSlipReceiptType.PackingSlip,
                supplierId: vm.supplierRMA.mfgCodeID,
                mfrPnId: vm.supplierRMADet.partID,
                packagingId: vm.supplierRMADet.packagingID
              };
              getPackingSlipBySearch(searchObj);

              const model = {
                messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PACKING_SLIP_CHANGE_SHIPPED_QTY_VALIDATION,
                multiple: false
              };
              DialogFactory.messageAlertDialog(model).then(() => {
                setFocusByName('PackingSlipNumber');
              }).catch((error) => BaseService.getErrorLog(error));
            } else {
              vm.supplierRMADet.refPackingSlipIdForRma = null;
              vm.supplierRMADet.refPackingSlipDetIdForRMA = null;
              vm.supplierRMADet.refPackingSlipValue = null;
              vm.supplierRMADet.refInvoiceIdForRma = null;
              vm.supplierRMADet.packingSlipQty = null;
              vm.supplierRMADet.receivedQty = null;
              vm.supplierRMADet.refInvoiceValue = null;
              vm.supplierRMADet.packingSlipDetail = null;
              //clearDataOfBaseOnPackingSlip();
              clearDataBasedOnInvoice();
            }
          }
        }
      };
    };

    const checkPackingSlipBelongSameSupplier = (supplierId, packingSlipNumber, callFrom) => {
      if (supplierId && supplierId !== vm.supplierRMA.mfgCodeID) {
        const objSupplier = _.find(vm.supplierList, (data) => data.id === vm.supplierRMA.mfgCodeID);
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RMA_PS_NOT_MAPPED_SUPPLIER);
        messageContent.message = stringFormat(messageContent.message, packingSlipNumber, objSupplier ? objSupplier.mfgCodeName : '');
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        return DialogFactory.messageAlertDialog(model).then((yes) => {
          if (yes) {
            vm.supplierRMADet.refPackingSlipIdForRma = null;
            vm.supplierRMADet.refPackingSlipDetIdForRMA = null;
            vm.supplierRMADet.refPackingSlipValue = null;
            vm.supplierRMADet.refInvoiceIdForRma = null;
            vm.supplierRMADet.refInvoiceValue = null;
            $scope.$broadcast(vm.autoPackingSlip.inputName, null);
            vm.supplierRMADet.packingSlipDetail = null;
            setFocusByName('PackingSlipNumber');
          }
        }, () => {

        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        checkValidationPackingSlipAndPart(callFrom);
      }
    };

    const scanLabel = (e) => {
      if (e.keyCode === 13) {
        if (!vm.supplierRMADet.scanLabel) {
          return;
        }

        idOfSelectMultipleBarcode = null;

        const scanlabel = {
          regxpString: vm.supplierRMADet.scanLabel,
          category: CORE.BarcodeCategory.MFRPN,
          callFrom: 'RMA'
        };

        scanLabelDetail(scanlabel);
      }
    };

    const scanLabelDetail = (scanlabel) => {
      vm.cgBusyLoading = PackingSlipFactory.scanPackingBarcode().save(scanlabel).$promise.then((res) => {
        vm.isScanLabel = true;
        if (res.data && res.data.Component) {
          if (res.data.Component.supplierMfgId && (vm.autoCompleteSupplier && vm.autoCompleteSupplier.keyColumnId) && res.data.Component.supplierMfgId !== vm.autoCompleteSupplier.keyColumnId) {
            vm.cgBusyLoading = false;
            const objSupplier = _.find(vm.supplierList, (data) => data.id === vm.autoCompleteSupplier.keyColumnId);
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MISMATCH_SUPPLIER);
            messageContent.message = stringFormat(messageContent.message, res.data.Component.supplierMFGPN, objSupplier ? objSupplier.mfgCodeName : '');
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            return DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                vm.resetRMAMaterialDet();
                vm.isScanLabel = false;
                setFocus('rmaScanLabel');
              }
            }, () => {
            }).catch((error) => BaseService.getErrorLog(error));
          }

          const objPart = res.data.Component;
          scanPackingSlipDetail = res.data.PackingSlipDetail;
          if (objPart && objPart.supplierMFGPNID) {
            vm.supplierRMADet.supplierMFGPNID = objPart.supplierMFGPNID;
            vm.supplierRMADet.supplierCode = objPart.supplierMFGCodeName;
            vm.supplierRMADet.supplierMfgCodeId = objPart.supplierMfgId;
            vm.supplierRMADet.supplierPN = objPart.supplierMFGPN;
            vm.supplierRMADet.supplierIsCustom = objPart.isCustom;
            vm.supplierRMADet.supplierRohsName = objPart.supplierRohsName;
            vm.supplierRMADet.supplierRohsIcon = objPart.supplierRohsIcon;
            vm.supplierRMADet.supplierPackagingId = objPart.supplierPackagingId;
            vm.supplierRMADet.supplierSpq = objPart.supplierPkgQty;
          }
          else {
            vm.supplierRMADet.supplierMFGPNID = null;
            vm.supplierRMADet.supplierCode = null;
            vm.supplierRMADet.supplierMfgCodeId = null;
            vm.supplierRMADet.supplierPN = null;
            vm.supplierRMADet.supplierIsCustom = null;
            vm.supplierRMADet.supplierRohsName = null;
            vm.supplierRMADet.supplierRohsIcon = null;
            vm.supplierRMADet.supplierPackagingId = null;
            vm.supplierRMADet.supplierSpq = null;
          }

          getComponentDetailsByMfg({
            id: objPart.id,
            mfgcodeID: objPart.mfgcodeID,
            isContainCPN: true
          });
          initRMAMFRAutoComplete();
          setFocus('rmaSerialNumber');
        }
        else {
          vm.isScanLabel = false;
          if (res.data && (res.data.messagecode === '0' || res.data.messagecode === '4')) {
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
              vm.supplierRMADet.scanLabel = null;
              setFocus('rmaScanLabel');
            }).catch((error) => BaseService.getErrorLog(error));
          }
          else if (res.data && res.data.messagecode === '5') {
            selectPartPopup(res.data.MFGPart);
          }
          else if (['6', '8', '11', '12', '16'].indexOf(res.data.messagecode) !== -1) {
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
                vm.supplierRMADet.scanLabel = null;
                setFocus('rmaScanLabel');
              }
            }, () => {
            }).catch((error) => BaseService.getErrorLog(error));
          }
          else if (res.data.messagecode === '9') {
            selectBarcodePopup(res.data.MFGPart);
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
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
        supplierName: vm.supplierRMA && vm.supplierRMA.mfgCodemst ? vm.supplierRMA.mfgCodemst.mfgCodeName : null
      };
      DialogFactory.dialogService(
        TRANSACTION.SELECT_PART_MODAL_CONTROLLER,
        TRANSACTION.SELECT_PART_MODAL_VIEW,
        event,
        data).then(() => { }, (selectItem) => {
          if (selectItem) {
            popUpForMultipleListed(selectItem, 'MultiplePart');
            setFocus('rmaSerialNumber');
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    const selectBarcodePopup = (mfgPart) => {
      const data = mfgPart;
      DialogFactory.dialogService(
        TRANSACTION.SELECT_BARCODE_MODAL_CONTROLLER,
        TRANSACTION.SELECT_BARCODE_MODAL_VIEW,
        event,
        data).then(() => { }, (selectItem) => {
          if (selectItem) {
            idOfSelectMultipleBarcode = selectItem.id;
            popUpForMultipleListed(selectItem, 'MultipleBarcode');
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    const popUpForMultipleListed = (selectItem, selectType) => {
      if (selectItem) {
        const scanlabel = {
          regxpString: vm.supplierRMADet.scanLabel,
          mfgId: selectType === 'MultiplePart' && selectItem ? selectItem.id : 0,
          barcodeId: selectType === 'MultipleBarcode' && selectItem ? selectItem.id : idOfSelectMultipleBarcode ? idOfSelectMultipleBarcode : null,
          category: CORE.BarcodeCategory.MFRPN,
          callFrom: 'RMA'
        };
        scanLabelDetail(scanlabel);
      }
    };

    const checkValidationPackingSlipAndPart = (callFrom) => {
      if (vm.supplierRMADet.partID && vm.supplierRMADet.packagingID && (vm.supplierRMADet.refPackingSlipIdForRma || vm.supplierRMADet.refInvoiceIdForRma)) {
        if (vm.supplierRMADet && vm.supplierRMADet.packingSlipDetail && vm.supplierRMADet.packingSlipDetail.length > 0) {
          const objSelectPartDetail = _.find(vm.supplierRMADet.packingSlipDetail, (data) => data.partID === vm.supplierRMADet.partID && data.packagingID === vm.supplierRMADet.packagingID);
          if (objSelectPartDetail) {
            checkAndAutoSetStockForSingleLine();
            //vm.supplierRMADet.packingSlipQty = objSelectPartDetail.packingSlipQty;
            //vm.supplierRMADet.receivedQty = objSelectPartDetail.receivedQty;
            if (!vm.isEdit) {/*to keep entered qty and price while create RMA*/
              vm.supplierRMADet.packingSlipQty = objSelectPartDetail.receivedQty;
              vm.supplierRMADet.invoicePrice = objSelectPartDetail.invoicePrice;
            }
            vm.supplierRMADet.orgPackingSlipQty = angular.copy(objSelectPartDetail.packingSlipQty);
            vm.supplierRMADet.orgReceivedQty = angular.copy(objSelectPartDetail.receivedQty);
            vm.supplierRMADet.orgInvoicePrice = angular.copy(objSelectPartDetail.invoicePrice);
            if (!isAlreadyFireRMAQtyValidation) {
              vm.calculateExtendedPrice();
            }
          } else {
            if (callFrom !== 'AUTO-PACKAGING') {
              clearDataOfBaseOnPackingSlip();
            }
            showMessagePartNotContainPS(callFrom);
          }
        } else {
          showMessagePartNotContainPS(callFrom);
          if (!vm.supplierRMADet.id) {
            clearDataOfBaseOnPackingSlip();
          }
        }
      } else {
        if (!vm.supplierRMADet.id) {
          clearDataOfBaseOnPackingSlip();
        }
      }
    };

    const showMessagePartNotContainPS = (callFrom) => {
      let messageContent = null;
      if (vm.supplierRMADet.refPackingSlipIdForRma) {
        //const objPackingSlip = _.find(vm.packingSlipList, (data) => data.id === vm.supplierRMADet.refPackingSlipIdForRma);
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PART_NOT_CONTAIN_IN_PAKING_SLIP);
        messageContent.message = stringFormat(messageContent.message, stringFormat('({0}) {1}', vm.supplierRMADet.mfgCode, vm.supplierRMADet.mfgPN), vm.supplierRMADet.refPackingSlipValue, vm.supplierRMADet.packaging);
      } else if (vm.supplierRMADet.refInvoiceIdForRma) {
        //const objInvoice = _.find(vm.supplierInvoiceList, (data) => data.id === vm.supplierRMADet.refInvoiceIdForRma);
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PART_NOT_CONTAIN_IN_INVOICE);
        messageContent.message = stringFormat(messageContent.message, stringFormat('({0}) {1}', vm.supplierRMADet.mfgCode, vm.supplierRMADet.mfgPN), vm.supplierRMADet.refInvoiceValue, vm.supplierRMADet.packaging);
      }

      if (messageContent) {
        const obj = {
          messageContent: messageContent,
          multiple: true
        };
        return DialogFactory.messageAlertDialog(obj).then((yes) => {
          if (yes) {
            if (callFrom === 'AUTO-PACKINGSLIP') {
              if (vm.supplierRMADet.refPackingSlipIdForRma) {
                vm.supplierRMADet.refPackingSlipIdForRma = null;
                vm.supplierRMADet.refPackingSlipDetIdForRMA = null;
                vm.supplierRMADet.refPackingSlipValue = null;
                vm.supplierRMADet.refInvoiceIdForRma = null;
                vm.supplierRMADet.refInvoiceValue = null;
                $scope.$broadcast(vm.autoPackingSlip.inputName, null);
                vm.supplierRMADet.packingSlipDetail = null;
                setFocusByName('PackingSlipNumber');
              } else {
                vm.supplierRMADet.packingSlipDetail = null;
                vm.supplierRMADet.refInvoiceIdForRma = null;
                vm.supplierRMADet.refInvoiceValue = null;
                clearDataBasedOnInvoice();
                setFocusByName('invoiceNumber');
              }
            } else if (callFrom === 'AUTO-PACKAGING') {
              if (vm.supplierRMADet.id) {
                vm.autoPackaging.keyColumnId = null;
                setFocusByName('Packaging');
              } else {
                if (vm.supplierRMADet.scanLabel) {
                  vm.isScanLabel = false;
                  vm.supplierRMADet.scanLabel = null;
                  setFocus('rmaScanLabel');
                } else {
                  setFocusByName('MFG');
                }
              }
            }
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    const clearDataOfBaseOnPackingSlip = () => {
      vm.supplierRMADet.packingSlipQty = null;
      vm.supplierRMADet.receivedQty = null;
      vm.supplierRMADet.invoicePrice = null;
      vm.supplierRMADet.extendedPrice = null;
    };

    function clearDataBasedOnInvoice() {
      vm.supplierRMADet.refInvoiceIdForRma = null;
      vm.supplierRMADet.refInvoiceValue = null;
      vm.supplierRMADet.packingSlipDetail = null;
      clearDataOfBaseOnPackingSlip();
    }


    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: 0,
        SortColumns: [
          ['packingSlipSerialNumber', 'ASC']
        ],
        SearchColumns: [],
        packingSlipID: vm.supplierRMAParamId
      };
    };

    const getDataKey = () => SalesOrderFactory.getDataKey().query().$promise.then((dataKey) => {
      if (dataKey) {
        vm.dataKey = dataKey.data;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    const checkAddressErrorDetail = (address, type) => {
      if (address && address.replace(/<br\/>/g, '\r').length > maxAddressLength) {
        const messageConstant = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.ADDRESS_MAX_LENGTH_VALIDATION);
        messageConstant.message = stringFormat(messageConstant.message, type, maxAddressLength, address.replace(/<br\/>/g, '\r').length);
        const obj = {
          multiple: true,
          messageContent: messageConstant
        };
        DialogFactory.messageAlertDialog(obj).then(() => {
          if (type === 'RMA To') {
            setFocus('addRmaAddress');
          } else if (type === vm.LabelConstant.Address.RMAIntermediateAddress) {
            setFocus('addRmaMarkForAddress');
          }
        });
        return 1;
      }
      return 0;
    };

    const selectLineForSameMfrPnLine = (detail, callFrom) => {
      const data = {
        lineDetailList: vm.supplierRMADet.packingSlipDetail,
        packingSlipId: vm.supplierRMADet.refPackingSlipIdForRma
      };
      DialogFactory.dialogService(
        TRANSACTION.SELCET_LINE_FOR_SAME_MFRPN_LINE_CONTROLLER,
        TRANSACTION.SELCET_LINE_FOR_SAME_MFRPN_LINE_VIEW,
        event,
        data).then(() => { }, (selectItem) => {
          if (selectItem) {
            vm.supplierRMADet.packingSlipDetail = [selectItem];
            vm.supplierRMADet.refPackingSlipDetIdForRMA = vm.supplierRMADet.packingSlipDetail[0].packingSlipDetailId;
            if (callFrom === 'Add') {
              checkPackingSlipBelongSameSupplier(detail.mfgCodeID, detail.packingSlipNumber, 'AUTO-PACKINGSLIP');
            } else if (callFrom === 'Edit') {
              checkValidationPackingSlipAndPart('AUTO-PACKINGSLIP');
            }
            setFocusByName('internalRmaLineRemark');
          } else {
            $scope.$broadcast(vm.autoPackingSlip.inputName, null);
            setFocusByName('PackingSlipNumber');
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    initPageInfo();

    vm.goBack = () => {
      let isDirty;
      if (vm.tabType === vm.supplierRMATab.SupplierRMA) {
        isDirty = (vm.supplierRMADetailForm && vm.supplierRMADetailForm.$dirty) || (vm.supplierRMALineDetailForm && vm.supplierRMALineDetailForm.$dirty); // Need to add other form when developed;
      } else if (vm.tabType === vm.supplierRMATab.MISC) {
        isDirty = vm.supplierRMAMiscForm && vm.supplierRMAMiscForm.$dirty;
      }

      if (isDirty) {
        return showWithoutSavingAlertforBackButton();
      } else {
        BaseService.currentPageForms = [];
        $state.go(TRANSACTION.TRANSACTION_SUPPLIER_RMA_STATE);
      }
    };

    vm.isStepValid = function (step) {
      let isValid = false;
      switch (step) {
        case 0: {
          const isDirty = (vm.supplierRMADetailForm && vm.supplierRMADetailForm.$dirty) || (vm.supplierRMALineDetailForm && vm.supplierRMALineDetailForm.$dirty);
          if (isDirty) {
            isValid = showWithoutSavingAlertforTabChange(step);
          } else {
            isValid = true;
          }
          break;
        }
        case 1: {
          if (vm.supplierRMADocumentForm) {
            vm.supplierRMADocumentForm.$setPristine();
            vm.supplierRMADocumentForm.$setUntouched();
          }
          break;
        }
        case 2: {
          if (vm.supplierRMAMiscForm && vm.supplierRMAMiscForm.$dirty) {
            isValid = showWithoutSavingAlertforTabChange(step);
          } else {
            isValid = true;
          }
          break;
        }
      }
      return isValid;
    };

    vm.onTabChanges = (TabName, msWizard) => {
      if (TabName === vm.supplierRMATab.SupplierRMA) {
        vm.isSupplierRMATab = true;
        vm.currentForm = msWizard.currentStepForm();
      } else {
        vm.isSupplierRMATab = false;
      }

      if (TabName === vm.supplierRMATab.Documents) {
        vm.isDocumentTab = true;
        vm.currentForm = msWizard.currentStepForm();
      } else {
        vm.isDocumentTab = false;
      }

      if (TabName === vm.supplierRMATab.MISC) {
        vm.isMiscTab = true;
        vm.currentForm = msWizard.currentStepForm();
      } else {
        vm.isMiscTab = false;
      }

      active();

      msWizard.selectedIndex = vm.selectedTabIndex;
      BaseService.currentPageForms = [vm.currentForm];
      vm.stateTransfer(TabName);
      $('#content').animate({
        scrollTop: 0
      }, 200);

      getSupplierRMADocumentCount();
    };

    vm.stateTransfer = (TabName) => {
      if (vm.supplierRMALineDetailForm && vm.supplierRMALineDetailForm.$dirty) {
        vm.resetRMAMaterialDet();
      }
      switch (TabName) {
        case vm.supplierRMATab.SupplierRMA:
          $state.transitionTo($state.$current, {
            type: vm.supplierRMATab.SupplierRMA,
            id: vm.supplierRMAParamId
          }, {
            location: true,
            inherit: true,
            notify: false
          });
          break;
        case vm.supplierRMATab.Documents:
          $state.transitionTo($state.$current, {
            type: vm.supplierRMATab.Documents,
            id: vm.supplierRMAParamId
          }, {
            location: true,
            inherit: true,
            notify: false
          });
          break;
        case vm.supplierRMATab.MISC:
          $state.transitionTo($state.$current, {
            type: vm.supplierRMATab.MISC,
            id: vm.supplierRMAParamId
          }, {
            location: true,
            inherit: true,
            notify: false
          });
          break;
        default:
      }
    };

    vm.addSupplierRMA = (isOpenInNew) => {
      if (isOpenInNew) {
        BaseService.goToManageSupplierRMA(vm.supplierRMATab.SupplierRMA);
      } else {
        $state.go(TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_RMA_STATE, { type: vm.supplierRMATab.SupplierRMA, id: null });
      }
    };

    vm.checkDateValidation = () => {
      if (vm.supplierRMA) {
        const rmaDate = vm.supplierRMA.poDate ? new Date($filter('date')(vm.supplierRMA.poDate, vm.DefaultDateFormat)) : null;
        const packingSlipDate = vm.supplierRMA.packingSlipDate ? new Date($filter('date')(vm.supplierRMA.packingSlipDate, vm.DefaultDateFormat)) : null;
        const receiptDate = vm.supplierRMA.receiptDate ? new Date($filter('date')(vm.supplierRMA.receiptDate, vm.DefaultDateFormat)) : null;

        if (vm.supplierRMADetailForm) {
          if (vm.supplierRMADetailForm.rmaDate && vm.supplierRMADetailForm.packingSlipDate && rmaDate && packingSlipDate) {
            if (rmaDate > packingSlipDate) {
              vm.supplierRMADetailForm.packingSlipDate.$setDirty(true);
              vm.supplierRMADetailForm.packingSlipDate.$touched = true;
              vm.supplierRMADetailForm.packingSlipDate.$setValidity('mindate', false);
            } else {
              vm.supplierRMADetailForm.packingSlipDate.$setValidity('mindate', true);
            }
            vm.rmaDateOptions.maxDate = packingSlipDate;
            vm.packingSlipDateOptions.minDate = rmaDate;
            vm.receiptDateOptions.minDate = packingSlipDate;
          }

          if (vm.supplierRMADetailForm.packingSlipDate && vm.supplierRMADetailForm.shippedDate && packingSlipDate && receiptDate) {
            if (packingSlipDate > receiptDate) {
              vm.supplierRMADetailForm.shippedDate.$setDirty(true);
              vm.supplierRMADetailForm.shippedDate.$touched = true;
              vm.supplierRMADetailForm.shippedDate.$setValidity('mindate', false);
            } else {
              vm.supplierRMADetailForm.shippedDate.$setValidity('mindate', true);
            }
            vm.packingSlipDateOptions.maxDate = receiptDate;
            vm.receiptDateOptions.minDate = packingSlipDate;
          } else {
            if (vm.supplierRMADetailForm && vm.supplierRMADetailForm.shippedDate) {
              vm.supplierRMADetailForm.shippedDate.$setValidity('mindate', true);
            }
          }
        }
      }
    };

    vm.getSupplierRMAModeStatus = (statusID) => {
      const status = _.find(vm.supplierRMAModeStatus, (item) => item.ID === statusID);
      return status ? status.Name : '';
    };

    vm.getSupplierRMAModeStatusClassName = (statusID) => {
      const status = _.find(vm.supplierRMAModeStatus, (item) => item.ID === statusID);
      return status ? status.ClassName : '';
    };

    vm.changeSupplierRMAModeStatus = (data) => {
      if (data) {
        if (vm.supplierRMA.packingSlipModeStatus !== data.ID) {
          if (vm.supplierRMADetailForm.$invalid) {
            if (BaseService.focusRequiredField(vm.supplierRMADetailForm)) {
              return;
            }
          } else if (checkAddressValidation()) {
            return;
          } else {
            vm.supplierRMA.packingSlipModeStatus = data.ID;
            if (vm.supplierRMADetForm && vm.supplierRMADetForm.$dirty) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.CONFIRMATION_CHANGE_PS_MODE_FOR_DETAIL_DATA);
              const obj = {
                messageContent: messageContent,
                btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
              };
              DialogFactory.messageConfirmDialog(obj).then((yes) => {
                if (yes) {
                  vm.saveRMADetail();
                }
              }, () => {
                vm.supplierRMA.packingSlipModeStatus = vm.supplierRMA.oldPackingSlipModeStatus;
              }, (error) => BaseService.getErrorLog(error));
            } else {
              vm.saveRMADetail();
            }
          }
        }
      }
    };

    function supplierPNbelongWithSelectedSupplierValidation() {
      if (vm.supplierRMA && vm.supplierRMA.mfgCodeID && (vm.sourceData && vm.sourceData.length > 0)) {
        const pidString = _.map(_.filter(vm.sourceData, (data) => data.supplierMfgCodeId && data.supplierMfgCodeId !== vm.supplierRMA.mfgCodeID), 'supplierPN').join(',');
        if (pidString) {
          const objSupplier = _.find(vm.supplierList, (data) => data.id === vm.supplierRMA.mfgCodeID);
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MISMATCH_SUPPLIER);
          messageContent.message = stringFormat(messageContent.message, pidString, objSupplier ? objSupplier.mfgCodeName : '');
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          return DialogFactory.messageAlertDialog(model).then((yes) => {
            if (yes) {
              vm.isDisableRMADate = false;
              vm.autoCompleteSupplier.keyColumnId = null;
              setFocusByName('Supplier');
            }
          }, () => {

          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          const packingSlipNumberString = _.map(_.filter(vm.sourceData, (data) => data.refPackingSlipSupplierId && data.refPackingSlipSupplierId !== vm.supplierRMA.mfgCodeID), 'refPackingSlipNumber').join(',');
          if (packingSlipNumberString) {
            const objSupplier = _.find(vm.supplierList, (data) => data.id === vm.supplierRMA.mfgCodeID);
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RMA_PS_NOT_MAPPED_SUPPLIER);
            messageContent.message = stringFormat(messageContent.message, packingSlipNumberString, objSupplier ? objSupplier.mfgCodeName : '');
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            return DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                vm.isDisableRMADate = false;
                vm.autoCompleteSupplier.keyColumnId = null;
                setFocusByName('Supplier');
              }
            }, () => {

            }).catch((error) => BaseService.getErrorLog(error));
          }
        }
      };
    }

    vm.checkUniqueRMANumber = () => {
      if ((vm.supplierRMA.mfgCodeID && vm.supplierRMA.poNumber && !vm.supplierRMA.id) ||
        (vm.supplierRMA.id && (vm.supplierRMA.mfgCodeID !== vm.copySupplierRMA.mfgCodeID || vm.supplierRMA.poNumber !== vm.copySupplierRMA.poNumber))) {
        vm.cgBusyLoading = SupplierRMAFactory.checkUniqueRMANumber().query({
          id: vm.supplierRMA.id || 0,
          mfgCodeId: vm.supplierRMA.mfgCodeID,
          poNumber: vm.supplierRMA.poNumber,
          packingSlipReceiptType: [TRANSACTION.PackingSlipReceiptType.SupplierRMA],
          requiredAllRows: true
        }).$promise.then((res) => {
          vm.isDisableRMADate = false;
          if (res && res.data && res.data.length > 0) {
            vm.isDisableRMADate = true;
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SUPPLIER_RMA_NUMNER_EXIST_CONFIRMATION_TO_UPDATE_OR_CREATE_NEW);
            messageContent.message = stringFormat(messageContent.message, vm.supplierRMA.poNumber, vm.supplierRMA.mfgFullName);
            const buttonsList = [
              { name: 'CANCEL' },
              { name: 'UPDATE RMA' },
              { name: 'ADD RMA PACKING SLIP' },
              { name: 'RESET RMA#' }];
            const data = {
              messageContent: messageContent,
              buttonsList: buttonsList,
              buttonIndexForFocus: 2,
              rmaList: res.data
            };

            DialogFactory.dialogService(
              CORE.SUPPLIER_RMA_DUPLICATE_CONFIRMATION_POPUP_CONTROLLER,
              CORE.SUPPLIER_RMA_DUPLICATE_CONFIRMATION_POPUP_VIEW,
              null,
              data).then(() => { }, (response) => {
                if (response.name === buttonsList[0].name) {
                  vm.supplierRMA.poNumber = vm.copySupplierRMA.poNumber;
                  vm.cancel();
                } else if (response.name === buttonsList[1].name) {
                  //update RMA
                  if (vm.supplierRMADetailForm) {
                    vm.supplierRMADetailForm.$setPristine();
                  }
                  if (response.row && response.row.id) {
                    $state.go(TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_RMA_STATE, { type: TRANSACTION.SupplierRMATab.SupplierRMA, id: response.row.id });
                  }
                } else if (response.name === buttonsList[2].name) {
                  //create RMA with entered RMA#
                  if (res && res.data && !vm.supplierRMA.id) {
                    vm.isDisableRMADate = true;
                    vm.supplierRMA.poDate = res.data[0].poDate ? BaseService.getUIFormatedDate(res.data[0].poDate, vm.DefaultDateFormat) : null;
                  }
                  setFocus('shippedDate');
                } else if (response.name === buttonsList[3].name) {
                  //Change RMA#
                  vm.isDisableRMADate = false;
                  vm.supplierRMA.poNumber = null;
                  setFocus('rmaNumber');
                }
              }, (err) => BaseService.getErrorLog(err));
          }

          //if (vm.supplierRMA && vm.supplierRMA.mfgCodeID && (vm.sourceData && vm.sourceData.length > 0)) {
          //  const pidString = _.map(_.filter(vm.sourceData, (data) => data.supplierMfgCodeId && data.supplierMfgCodeId !== vm.supplierRMA.mfgCodeID), 'supplierPN').join(',');
          //  if (pidString) {
          //    const objSupplier = _.find(vm.supplierList, (data) => data.id === vm.supplierRMA.mfgCodeID);
          //    const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MISMATCH_SUPPLIER);
          //    messageContent.message = stringFormat(messageContent.message, pidString, objSupplier ? objSupplier.mfgName : '');
          //    const model = {
          //      messageContent: messageContent,
          //      multiple: true
          //    };
          //    return DialogFactory.messageAlertDialog(model).then((yes) => {
          //      if (yes) {
          //        vm.isDisableRMADate = false;
          //        vm.autoCompleteSupplier.keyColumnId = null;
          //        setFocusByName('Supplier');
          //      }
          //    }, () => {

          //    }).catch((error) => BaseService.getErrorLog(error));
          //  } else {
          //    const packingSlipNumberString = _.map(_.filter(vm.sourceData, (data) => data.refPackingSlipSupplierId && data.refPackingSlipSupplierId !== vm.supplierRMA.mfgCodeID), 'refPackingSlipNumber').join(',');
          //    if (packingSlipNumberString) {
          //      const objSupplier = _.find(vm.supplierList, (data) => data.id === vm.supplierRMA.mfgCodeID);
          //      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RMA_PS_NOT_MAPPED_SUPPLIER);
          //      messageContent.message = stringFormat(messageContent.message, packingSlipNumberString, objSupplier ? objSupplier.mfgName : '');
          //      const model = {
          //        messageContent: messageContent,
          //        multiple: true
          //      };
          //      return DialogFactory.messageAlertDialog(model).then((yes) => {
          //        if (yes) {
          //          vm.isDisableRMADate = false;
          //          vm.autoCompleteSupplier.keyColumnId = null;
          //          setFocusByName('Supplier');
          //        }
          //      }, () => {

          //      }).catch((error) => BaseService.getErrorLog(error));
          //    }
          //  }
          //};
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.checkUniqueTrackNumber = () => {
      const checkDuplicate = _.find(vm.supplierRMA.supplierRMATrackNumber, (obj) => obj.tempID !== vm.trackingNumberDet.tempID && obj.trackNumber === vm.trackingNumberDet.trackNumber);
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

    vm.addTrackingNumberToList = (event) => {
      if (event.keyCode === 13) {
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
            const trackingNumberDet = _.find(vm.supplierRMA.supplierRMATrackNumber, (obj) => obj.tempID === vm.trackingNumberDet.tempID);
            if (trackingNumberDet) {
              trackingNumberDet.trackNumber = vm.trackingNumberDet.trackNumber;
            } else {
              vm.supplierRMA.supplierRMATrackNumber.push({
                trackNumber: vm.trackingNumberDet.trackNumber,
                refPackingSlipMaterialRecID: vm.supplierRMAParamId,
                tempID: (vm.supplierRMA.supplierRMATrackNumber.length + 1)
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

    vm.editTrackingNumber = (item) => {
      if ((vm.supplierRMA.lockStatus === vm.Transaction.CustomerPaymentLockStatus.Locked && !vm.loginUser.isUserSuperAdmin)) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RMA_NOT_CHANGE_AS_CREDIT_MEMO_CREATE);
        messageContent.message = stringFormat(messageContent.message, vm.supplierRMA.poNumber);
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

    vm.removeTrackNumber = (item, index) => {
      if ((vm.supplierRMA.lockStatus === vm.Transaction.CustomerPaymentLockStatus.Locked && !vm.loginUser.isUserSuperAdmin)) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RMA_NOT_CHANGE_AS_CREDIT_MEMO_CREATE);
        messageContent.message = stringFormat(messageContent.message, vm.supplierRMA.poNumber);
        const model = {
          messageContent: messageContent,
          multiple: false
        };
        return DialogFactory.messageAlertDialog(model).then(() => {
          vm.trackingNumberDet.trackNumber = null;
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.supplierRMA.removeRMATrackNumberIds = vm.supplierRMA.removeRMATrackNumberIds || [];
        if (item) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, 'Supplier RMA tracking#', '');
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };

          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              vm.supplierRMADetailForm.$setDirty(true);
              if (item.id > 0) {
                vm.supplierRMA.removeRMATrackNumberIds.push(item.id);
              }

              vm.supplierRMA.supplierRMATrackNumber.splice(index, 1);
              const numberIndex = _.findIndex(vm.supplierRMA.supplierRMATrackNumber, (obj) => obj.trackNumber === item.trackNumber);
              $timeout(() => {
                if (numberIndex === -1) {
                  vm.supplierRMADetailForm.trackingNumber.$setValidity('duplicate', true);
                }
              });
              vm.isAddTrackDisable = _.filter(vm.supplierRMA.supplierRMATrackNumber, (obj) => !obj.trackNumber).length > 0;
              _.each(vm.supplierRMA.supplierRMATrackNumber, (item, index) => {
                item.tempID = (index + 1);
              });

              setFocus('trackingNumber');
            }
          }, () => {
            setFocus('trackingNumber');
          }).catch((error) => BaseService.getErrorLog(error));
        }

        vm.isAddTrackDisable = _.filter(vm.supplierRMA.supplierRMATrackNumber, (obj) => !obj.trackNumber).length > 0;
      }
    };

    vm.removeRMAMarkForAddress = () => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MARKFOR_ADDRESS_REMOVE_CONFIRMATION);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          vm.rmaMarkForAddress = null;
          vm.supplierRMA.rmaMarkForAddressId = null;
          vm.supplierRMA.rmaMarkForAddress = null;
          vm.supplierRMA.rmaMarkForContactPersonID = null;
          vm.supplierRMA.rmaMarkForContactPerson = null;
          vm.rmaMarkForAddress = null;
          vm.markedForAddressContactPerson = null;
          vm.rmaMarkedAddressViewAddrOtherDet.alreadySelectedAddressID = null;
          vm.rmaMarkedAddressViewAddrOtherDet.alreadySelectedPersonId = null;
          // Static code to enable save button
          vm.supplierRMADetailForm.$$controls[0].$setDirty();
        }
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // rerfresh address
    vm.refreshAddress = () => {
      const addressPromise = [getRMAAddressList(vm.autoCompleteSupplier.keyColumnId, vm.LabelConstant.COMMON.RMAShippingAddress)];
      vm.cgBusyLoading = $q.all(addressPromise).then(() => {
        setOtherDetForAddrDir(vm.LabelConstant.COMMON.RMAShippingAddress, vm.autoCompleteSupplier.keyColumnId);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.refreshMarkedForAddress = () => {
      const addressPromise = [getRMAAddressList(vm.autoCompleteSupplier.keyColumnId, vm.LabelConstant.Address.RMAIntermediateAddress)];
      vm.cgBusyLoading = $q.all(addressPromise).then(() => {
        setOtherDetForAddrDir(vm.LabelConstant.Address.RMAIntermediateAddress, vm.autoCompleteSupplier.keyColumnId);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.checkValidationAndSaveRMADetail = () => {
      vm.supplierRMADisable = true;
      if (BaseService.focusRequiredField(vm.supplierRMADetailForm)) {
        vm.supplierRMADisable = false;
        return;
      }
      if (checkAddressValidation()) {
        return;
      } else {
        if (checkAddressErrorDetail(vm.supplierRMA.rmaShippingAddress, 'RMA To')) {
          vm.rmaAddress = null;
          vm.supplierRMA.rmaShippingAddressId = null;
          vm.supplierRMA.rmaShippingAddress = null;
          vm.supplierRMA.rmaShippingContactPersonID = null;
          vm.supplierRMA.rmaShippingContactPerson = null;
          vm.rmaAddressViewAddrOtherDet.alreadySelectedAddressID = null;
          vm.rmaAddressViewAddrOtherDet.alreadySelectedPersonId = null;
          vm.rmaAddressContactPerson = null;
          //setFocus('addRmaAddress');
          vm.supplierRMADisable = false;
          return;
        } else if (checkAddressErrorDetail(vm.supplierRMA.rmaShippingAddress, vm.LabelConstant.Address.RMAIntermediateAddress)) {
          vm.rmaMarkForAddress = null;
          vm.supplierRMA.rmaMarkForAddressId = null;
          vm.supplierRMA.rmaMarkForAddress = null;
          vm.supplierRMA.rmaMarkForContactPersonID = null;
          vm.supplierRMA.rmaMarkForContactPerson = null;
          vm.markedForAddressContactPerson = null;
          vm.rmaAddressViewAddrOtherDet.alreadySelectedAddressID = null;
          vm.rmaAddressViewAddrOtherDet.alreadySelectedPersonId = null;
          //setFocus('addRmaMarkForAddress');
          vm.supplierRMADisable = false;
          return;
        } else {
          vm.saveRMADetail();
        }
      }
    };

    vm.scanLabel = (e) => {
      $timeout(() => {
        scanLabel(e);
      }, true);
      /** Prevent enter key submit event */
      preventInputEnterKeyEvent(e);
    };

    vm.checkRMALine = (ev) => {
      if (vm.supplierRMALineDetailForm.$dirty && vm.supplierRMADet.packingSlipSerialNumber && (vm.sourceData && vm.sourceData.length > 0)) {
        const row = _.find(vm.sourceData, (a) => a.id !== vm.supplierRMADet.id && a.packingSlipSerialNumber === parseInt(vm.supplierRMADet.packingSlipSerialNumber));
        if (row && vm.supplierRMADet.partID) {
          const sameRowWithPart = _.find(vm.sourceData, (data) => data.packingSlipSerialNumber === parseInt(vm.supplierRMADet.packingSlipSerialNumber) && data.partID === vm.supplierRMADet.partID);
          if (sameRowWithPart) {
            duplicateRMALineMessage(sameRowWithPart, ev);
          } else {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RMA_LINE_EXIST_CONFIRMATION);
            messageContent.message = stringFormat(messageContent.message, `(${row.mfgCode}) ${row.mfgPN}`);
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
              vm.supplierRMADet.packingSlipSerialNumber = null;
              setFocus('rmaSerialNumber');
            }, (error) => BaseService.getErrorLog(error));
          }
        }
        else if (row) {
          duplicateRMALineMessage(row, ev);
        }
      }
    };

    vm.blurPackingSlip = () => {
      if (vm.supplierRMADet.refPackingSlipForRma) {
        $scope.$broadcast(vm.autoPackingSlip.inputName, null);
        vm.supplierRMADet.refInvoiceIdForRma = null;
        vm.supplierRMADet.refInvoiceValue = null;
        if (!vm.supplierRMADet.refInvoiceForRma) {
          vm.supplierRMADet.refInvoiceForRma = angular.copy(vm.supplierRMADet.refPackingSlipForRma);
          clearDataBasedOnInvoice();
          vm.supplierRMADet.refInvoiceIdForRma = null;
          vm.supplierRMADet.refInvoiceValue = null;
        }
      }
    };

    vm.blurInvoice = () => {
      if (vm.supplierRMADet.refInvoiceForRma) {
        clearDataBasedOnInvoice();
        vm.supplierRMADet.refInvoiceIdForRma = null;
        vm.supplierRMADet.refInvoiceValue = null;
        if (!vm.supplierRMADet.refPackingSlipForRma) {
          vm.supplierRMADet.refPackingSlipForRma = angular.copy(vm.supplierRMADet.refInvoiceForRma);
          $scope.$broadcast(vm.autoPackingSlip.inputName, null);
          vm.supplierRMADet.refInvoiceIdForRma = null;
          vm.supplierRMADet.refInvoiceValue = null;
        }
      }
    };

    vm.checkValidationAndCalculateExtendedPrice = () => {
      if (vm.supplierRMALineDetailForm) {
        if (vm.supplierRMADet.refPackingSlipIdForRma) {
          if (vm.supplierRMADet.orgInvoicePrice && vm.supplierRMADet.invoicePrice) {
            if (vm.supplierRMADet.orgInvoicePrice < vm.supplierRMADet.invoicePrice) {
              vm.supplierRMALineDetailForm.rmaUnitPrice.$setDirty(true);
              vm.supplierRMALineDetailForm.rmaUnitPrice.$touched = true;
              vm.supplierRMALineDetailForm.rmaUnitPrice.$setValidity('rmaUnitPriceValidation', false);
            } else {
              vm.supplierRMALineDetailForm.rmaUnitPrice.$setValidity('rmaUnitPriceValidation', true);
              if (!isAlreadyFireRMAQtyValidation) {
                vm.calculateExtendedPrice('POPrice');
              }
            }
          } else {
            if (!isAlreadyFireRMAQtyValidation) {
              vm.calculateExtendedPrice('POPrice');
            }
          }
        } else {
          if (!isAlreadyFireRMAQtyValidation) {
            vm.calculateExtendedPrice('POPrice');
          }
        }
      }
    };

    vm.calculateExtendedPrice = (callFrom) => {
      if (vm.supplierRMADet.packingSlipQty && vm.supplierRMADet.receivedQty && vm.supplierRMADet.packingSlipQty < vm.supplierRMADet.receivedQty && !isAlreadyFireRMAQtyValidation) {
        isAlreadyFireRMAQtyValidation = true;
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RMA_SHIIPED_QTY_NOT_GRETER_RMA_QTY);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        return DialogFactory.messageAlertDialog(model).then(() => {
          isAlreadyFireRMAQtyValidation = false;
          if (callFrom === 'RMAQty' || callFrom === 'POPrice') {
            vm.supplierRMADet.packingSlipQty = null;
            setFocus('rmaIssueQty');
          } else if (callFrom === 'ShippedQty') {
            vm.supplierRMADet.receivedQty = null;
            setFocus('shippedQty');
          }
        });
      }

      if (vm.supplierRMADet.receivedQty && vm.supplierRMADet.invoicePrice) {
        vm.supplierRMADet.extendedPrice = multipleUnitValue(vm.supplierRMADet.packingSlipQty, vm.supplierRMADet.invoicePrice);
      }
    };

    function updateLineRecord(row, ev, isLineDetailsDisabled) {
      if (vm.supplierRMALineDetailForm.$dirty) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.BARCODE_MESSAGE_LOST);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.RMALineDetailDisable = isLineDetailsDisabled;
            editMaterialDetail(row.entity, ev);
          }
        }, () => {

        }, (error) => BaseService.getErrorLog(error));
      } else {
        vm.RMALineDetailDisable = isLineDetailsDisabled;
        editMaterialDetail(row.entity, ev);
      }
    }

    vm.updateRecord = (row, ev, isLineDetailsDisabled) => {
      if (row.entity.packingSlipModeStatus === CORE.PackingSlipModeStatus[0].ID) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PS_POSTING_STATUS_NOT_ALLOW);
        messageContent.message = stringFormat(messageContent.message, 'update', 'RMA Packing Slip', redirectToPackingSlipDetail(row.entity.refPackingSlipIdForRma, row.entity.refPackingSlipNumber), redirectToPartDetail(row.entity.partID, row.entity.mfgPN), row.entity.packaging, row.entity.refPackingSlipBinName);

        DialogFactory.messageAlertDialog({ messageContent: messageContent });
        return;
      } else {
        updateLineRecord(row, ev, isLineDetailsDisabled);
      }
    };

    vm.viewTemplate = (row, ev) => {
      updateLineRecord(row, ev, true);
    };

    vm.deleteRecord = (material) => {
      let selectedIDs = [];
      if (material) {
        selectedIDs.push(material.id);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((item) => item.id);
        }
      }

      if (selectedIDs) {
        vm.cgBusyLoading = PackingSlipFactory.checkRelationOfStockAndRMA().query({ rmaDetailId: selectedIDs }).$promise.then((responseStock) => {
          if (responseStock && responseStock.data && responseStock.data.length > 0) {
            if (selectedIDs.length === 1) {
              const lineObj = _.find(vm.sourceData, (data) => data.id === parseInt(selectedIDs[0]));
              editMaterialDetail(lineObj, null);
            }
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.CHECK_RMA_STOCK_RELATION_MESSAGE_RMA_DETAIL_GRID);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                if (selectedIDs.length === 1) {
                  $timeout(() => {
                    vm.addSupplierRMAStock(null);
                  });
                }
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
          else {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
            messageContent.message = stringFormat(messageContent.message, 'Supplier RMA Material', selectedIDs.length);
            const obj = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
            };
            const objIDs = {
              id: selectedIDs,
              CountList: false
            };
            DialogFactory.messageConfirmDialog(obj).then((yes) => {
              if (yes) {
                vm.cgBusyLoading = SupplierRMAFactory.deleteSupplierRMAMaterial().query({
                  objIDs: objIDs,
                  refPackingSlipMaterialRecID: vm.supplierRMAParamId,
                  refPackingSlipNumberForInvoice: vm.supplierRMA.refPackingSlipNumberForInvoice
                }).$promise.then((res) => {
                  if (res && res.data && (res.data.TotalCount && res.data.TotalCount > 0)) {
                    BaseService.deleteAlertMessage(res.data);
                  } else {
                    vm.gridOptions.clearSelectedRows();
                    BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                  }
                }).catch((error) => BaseService.getErrorLog(error));
              }
            }, () => {
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        const alertModel = {
          title: USER.USER_ERROR_LABEL,
          textContent: stringFormat(USER.SELECT_ONE_LABEL, 'Supplier RMA Material')
        };
        DialogFactory.alertDialog(alertModel);
      }
    };

    vm.resetRMAMaterialDet = () => {
      idOfSelectMultipleBarcode = null;
      scanPackingSlipDetail = null;
      vm.materialDetTitle = 'Add';
      vm.isScanLabel = false;
      vm.RMALineDetailDisable = false;
      rmaStockDetailList = [];
      vm.supplierRMADet = {
        refPackingSlipMaterialRecID: vm.supplierRMAParamId,
        scanLabel: null,
        packingSlipSerialNumber: null,
        unit: null,
        uomName: null,
        packagingID: null,
        packingSlipQty: null,
        receivedQty: null,
        invoicePrice: null,
        extendedPrice: null,
        refPackingSlipIdForRma: null,
        refInvoiceIdForRma: null,
        refPackingSlipForRma: null,
        refInvoiceForRma: null,
        remark: null
      };

      $scope.$broadcast(vm.autoCompletecomponent ? vm.autoCompletecomponent.inputName : null, null);
      $scope.$broadcast(vm.autoCompleteMfgPIDCode ? vm.autoCompleteMfgPIDCode.inputName : null, null);

      if (vm.supplierRMA && vm.supplierRMA.poNumber) {
        setFocus('rmaScanLabel');
      }

      initRMALineAutoComplete();
      vm.autoPackingSlip.searchText = null;

      if (vm.autoPackingSlip) {
        $scope.$broadcast(vm.autoPackingSlip.inputName, null);
      }

      clearDataBasedOnInvoice();

      $timeout(() => {
        if (vm.supplierRMALineDetailForm) {
          vm.supplierRMALineDetailForm.$setPristine();
          vm.supplierRMALineDetailForm.$setUntouched();
        }
      });
    };

    vm.ShipToContactPersonAddUpdateCallback = (ev, appliedContactPerson) => {
      if (appliedContactPerson) {
        vm.rmaAddressContactPerson = appliedContactPerson;
        vm.supplierRMA.rmaShippingContactPersonID = appliedContactPerson.personId;
        vm.rmaAddressViewAddrOtherDet.alreadySelectedPersonId = vm.supplierRMA.rmaShippingContactPersonID;
        vm.supplierRMADetailForm.$setDirty();
      }
    };

    vm.ShipToAddressAddUpdateCallback = (ev, appliedAddress) => {
      if (appliedAddress) {
        vm.rmaAddress = appliedAddress;
        vm.supplierRMA.rmaShippingAddressId = appliedAddress.id;
        vm.rmaAddressViewAddrOtherDet.alreadySelectedAddressID = vm.supplierRMA.rmaShippingAddressId;
        vm.rmaAddressContactPerson = (appliedAddress && appliedAddress.contactPerson) ? appliedAddress.contactPerson : null;
        vm.supplierRMA.rmaShippingContactPersonID = vm.rmaAddressContactPerson ? vm.rmaAddressContactPerson.personId : null;
        vm.rmaAddressViewAddrOtherDet.alreadySelectedPersonId = vm.supplierRMA.rmaShippingContactPersonID;
        vm.supplierRMADetailForm.$setDirty();
      }
    };

    vm.markedForContactPersonAddUpdateCallback = (ev, appliedContactPerson) => {
      if (appliedContactPerson) {
        vm.markedForAddressContactPerson = appliedContactPerson;
        vm.supplierRMA.rmaMarkForContactPersonID = appliedContactPerson.personId;
        vm.rmaMarkedAddressViewAddrOtherDet.alreadySelectedPersonId = vm.supplierRMA.rmaMarkForContactPersonID;
        vm.supplierRMADetailForm.$setDirty();
      }
    };

    vm.rmaMarkedForAddressAddUpdateCallback = (ev, appliedAddress) => {
      if (appliedAddress) {
        vm.rmaMarkForAddress = appliedAddress;
        vm.supplierRMA.rmaMarkForAddressId = appliedAddress.id;
        vm.rmaMarkedAddressViewAddrOtherDet.alreadySelectedAddressID = vm.supplierRMA.rmaMarkForAddressId;
        vm.markedForAddressContactPerson = (appliedAddress && appliedAddress.contactPerson) ? appliedAddress.contactPerson : null;
        vm.supplierRMA.rmaMarkForContactPersonID = vm.markedForAddressContactPerson ? vm.markedForAddressContactPerson.personId : null;
        vm.rmaMarkedAddressViewAddrOtherDet.alreadySelectedPersonId = vm.supplierRMA.rmaMarkForContactPersonID;
        vm.supplierRMADetailForm.$setDirty();
      }
    };

    const checkAddressValidation = () => {
      vm.supplierRMADisable = true;
      if (!vm.supplierRMA.rmaShippingAddressId || !vm.supplierRMA.rmaShippingContactPersonID) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ADDRESS_CONTACT_PERSON_REQUIRED_FOR_STATUS);
        messageContent.message = stringFormat(messageContent.message, !vm.supplierRMA.rmaShippingAddressId ? vm.LabelConstant.COMMON.RMAShippingAddress : vm.LabelConstant.COMMON.RMAShippingAddress + ' ' + CORE.PAGENAME_CONSTANT[67].PageName);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model).then();
        vm.supplierRMADisable = false;
        return 1;
      } else if (vm.supplierRMA.rmaMarkForAddressId && !vm.supplierRMA.rmaMarkForContactPersonID) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ADDRESS_CONTACT_PERSON_REQUIRED_FOR_STATUS);
        messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.Address.RMAIntermediateAddress + ' ' + CORE.PAGENAME_CONSTANT[67].PageName);
        const model = {
          messageContent: messageContent,
          multiple: 1
        };
        DialogFactory.messageAlertDialog(model).then();
        vm.supplierRMADisable = false;
        return 1;
      } else {
        vm.supplierRMADisable = false;
        return 0;
      }
    };

    vm.saveRMADetail = () => {
      vm.supplierRMA.rmaMarkForAddress = BaseService.generateAddressFormateToStoreInDB(vm.rmaMarkForAddress);
      vm.supplierRMA.rmaMarkForContactPerson = BaseService.generateContactPersonDetFormat(vm.markedForAddressContactPerson);
      vm.supplierRMA.rmaShippingAddress = BaseService.generateAddressFormateToStoreInDB(vm.rmaAddress);
      vm.supplierRMA.rmaShippingContactPerson = BaseService.generateContactPersonDetFormat(vm.rmaAddressContactPerson);
      vm.supplierRMA.status = vm.supplierRMA.id > 0 ? vm.supplierRMA.status : vm.supplierRMA.packingSlipModeStatus === vm.supplierRMAModeStatus[0].ID ? vm.supplierRMAStatusCode.Draft : vm.supplierRMA.packingSlipModeStatus === vm.supplierRMAModeStatus[1].ID ? vm.supplierRMAStatusCode.WaitingForShipment : vm.supplierRMAStatusCode.WaitingForCreditMemo;
      vm.supplierRMA.poDate = BaseService.getAPIFormatedDate(vm.supplierRMA.poDate);
      vm.supplierRMA.packingSlipDate = BaseService.getAPIFormatedDate(vm.supplierRMA.packingSlipDate);
      vm.supplierRMA.receiptDate = BaseService.getAPIFormatedDate(vm.supplierRMA.receiptDate);
      vm.supplierRMA.gencFileOwnerType = vm.supplierRMAEntity.Name;
      vm.supplierRMA.receiptType = CORE.packingSlipReceiptType.R.Key;
      vm.supplierRMA.packingSlipTrackNumber = vm.supplierRMA.supplierRMATrackNumber;
      vm.supplierRMA.removePackingSlipTrackNumberIds = vm.supplierRMA.removeRMATrackNumberIds;

      vm.cgBusyLoading = SupplierRMAFactory.saveRMADetail().query(vm.supplierRMA).$promise.then((response) => {
        vm.supplierRMADisable = false;
        if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          if (vm.supplierRMADetailForm) {
            vm.supplierRMADetailForm.$setPristine();
          }
          if (vm.supplierRMALineDetailForm) {
            vm.supplierRMALineDetailForm.$setPristine();
          }
          vm.resetRMAMaterialDet();
          if (response && response.data) {
            if (vm.supplierRMAParamId) {
              if (vm.tabType === vm.supplierRMATab.SupplierRMA) {
                vm.loadData();
                getSupplierRMADet();
              }
            } else {
              vm.supplierRMAParamId = response.data.supplierRMADetail.id;
              $state.go(TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_RMA_STATE, { type: vm.supplierRMATab.SupplierRMA, id: vm.supplierRMAParamId });
            }
          }
        }
        else if (response.status === CORE.ApiResponseTypeStatus.FAILED) {
          if (response.errors && response.errors.data.errorCode === 1) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.UNIQUE_PS_FOR_RMA);
            messageContent.message = stringFormat(messageContent.message, 'Packing slip', vm.supplierRMA && vm.supplierRMA.packingSlipNumber ? vm.supplierRMA.packingSlipNumber : null, vm.supplierRMA && vm.supplierRMA.poNumber ? vm.supplierRMA.poNumber : null, 'packing slip');
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model);
          } else if (response.errors && response.errors.data.errorCode === 2) {
            const obj = vm.autoCompleteSupplier && vm.autoCompleteSupplier.keyColumnId ? _.find(vm.supplierList, (data) => data.id === vm.autoCompleteSupplier.keyColumnId) : {};
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PACKING_SLIP_UNIQUE);
            messageContent.message = stringFormat(messageContent.message, 'supplier RMA#', vm.supplierRMA.poNumber, obj && obj.mfgCodeName ? obj.mfgCodeName : null, 'supplier RMA#');
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                vm.supplierRMA.poNumber = null;
                setFocus('rmaNumber');
              }
            }, () => {
            }).catch((error) => BaseService.getErrorLog(error));
          } else if (response.errors && response.errors.data.errorMessage === 'ADDRESS_DATA_MISSING') {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ADDRESS_CONTACT_PERSON_REQUIRED_FOR_STATUS);
            messageContent.message = stringFormat(messageContent.message, !vm.supplierRMA.rmaShippingAddressId ? vm.LabelConstant.COMMON.RMAShippingAddress : vm.LabelConstant.COMMON.RMAShippingAddress + ' ' + CORE.PAGENAME_CONSTANT[67].PageName);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model);
          } else if (response.errors && response.errors.data.errorMessage === 'ADDRESS_DATA_MISSING_FOR_MARK') {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ADDRESS_CONTACT_PERSON_REQUIRED_FOR_STATUS);
            messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.Address.RMAIntermediateAddress + ' ' + CORE.PAGENAME_CONSTANT[67].PageName);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model);
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.saveRMALineDetail = () => {
      let messageContent;
      let obj;

      if (BaseService.focusRequiredField(vm.supplierRMALineDetailForm)) {
        return;
      }

      if (!vm.supplierRMADet.extendedPrice) {
        if (!isAlreadyFireRMAQtyValidation) {
          vm.calculateExtendedPrice();
        }
      }

      const duplicatePackingLineNum = _.findIndex(vm.sourceData, (obj) => obj.id !== vm.supplierRMADet.id && obj.packingSlipSerialNumber === parseInt(vm.supplierRMADet.packingSlipSerialNumber));
      if (duplicatePackingLineNum !== -1) {
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
        messageContent.message = stringFormat(messageContent.message, 'RMA line#');
        obj = {
          messageContent: messageContent,
          multiple: true
        };
        return DialogFactory.messageAlertDialog(obj).then((yes) => {
          if (yes) {
            vm.supplierRMADet.packingSlipSerialNumber = null;
            setFocus('rmaSerialNumber');
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }

      if (vm.supplierRMADet.refPackingSlipIdForRma) {
        if ((vm.supplierRMADet.orgReceivedQty < vm.supplierRMADet.packingSlipQty) || (vm.supplierRMADet.orgReceivedQty < vm.supplierRMADet.receivedQty)) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RMA_QTY_SHIPPED_QTY_NOT_MORE_PS_QTY_RECEIVED_QTY);
          messageContent.message = stringFormat(messageContent.message, vm.supplierRMADet.refPackingSlipValue ? vm.supplierRMADet.refPackingSlipValue : '');
          obj = {
            messageContent: messageContent,
            multiple: true
          };
          return DialogFactory.messageAlertDialog(obj).then((yes) => {
            if (yes) {
              if (vm.supplierRMADet.orgPackingSlipQty < vm.supplierRMADet.packingSlipQty) {
                vm.supplierRMADet.packingSlipQty = null;
                setFocus('rmaIssueQty');
              } else {
                vm.supplierRMADet.receivedQty = null;
                setFocus('shippedQty');
              }
            }
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }

      const validationSupplierSelected = validationOfAddDetailWithoutSupplier();
      if (validationSupplierSelected) {
        return;
      }

      let saveRMALineStockList = [];
      if (rmaStockDetailList && rmaStockDetailList.length > 0) {
        saveRMALineStockList = _.map(rmaStockDetailList, (data) => ({
          stockId: data.stockId || {},
          transactionAction: data.transactionAction,
          refRMAId: data.rmaId,
          type: data.type,
          refSidId: data.umidId ? data.umidId : {},
          refPackingSlipId: data.packingSlipId,
          refPackingSlipDetId: data.packingSlipDetId,
          partId: data.partId,
          packagingId: data.packagingId,
          binId: data.binId,
          qty: data.shipmentQty,
          availableQtyAtRMA: data.availableQtyAtRMA,
          availableUnitAtRMA: data.availableUnitAtRMA,
          transferBinId: data.transferBinId || {},
          transferWarehouseId: data.transferWarehouseId || {},
          transferParentWarehouseId: data.transferParentWarehouseId || {}
        }));
      }

      vm.supplierRMADet.refSupplierPartId = vm.supplierRMADet.supplierMFGPNID;
      vm.supplierRMADet.refPackingSlipNumberForInvoice = vm.supplierRMA.refPackingSlipNumberForInvoice;
      vm.supplierRMADet.refPackingSlipMaterialRecID = vm.supplierRMAParamId;
      vm.supplierRMADet.purchasePrice = vm.supplierRMADet.invoicePrice;
      vm.supplierRMADet.saveRMALineStockList = saveRMALineStockList;
      vm.cgBusyLoading = SupplierRMAFactory.saveRMALineDetail().query(vm.supplierRMADet).$promise.then((response) => {
        if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          vm.resetRMAMaterialDet();
          vm.gridOptions.clearSelectedRows();
          BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
        } else {
          if (response.errors && response.errors.data && response.errors.data.errorCode === 1) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RMA_LINE_NOT_CHANGE_AS_CREDIT_MEMO_CREATE);
            const obj = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(obj);
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.saveMisc = () => {
      if (BaseService.focusRequiredField(vm.supplierRMAMiscForm)) {
        return;
      }
      const dynamicControlList = DataElementTransactionValueFactory.getDataElementTransactionList(vm.dataElementList);
      DataElementTransactionValueFactory.saveTransctionValue({
        referenceTransID: vm.supplierRMAParamId,
        entityID: vm.supplierRMAEntity.ID,
        dataElementList: dynamicControlList.dataElementList,
        removeElementList: dynamicControlList.removeElementList,
        subFormTransList: dynamicControlList.subFormTransList,
        deletedsubFormTransIDs: dynamicControlList.deletedsubFormTransIDs,
        removeSubFormTransListConditional: dynamicControlList.removeSubFormTransListConditional
      }, vm.fileList).then(() => {
        DataElementTransactionValueFactory.displaySuccessMessage(dynamicControlList.dataElementList);
        vm.supplierRMAMiscForm.$setPristine();

        vm.isMiscTab = false;
        vm.fileList = {};
        $timeout(() => {
          vm.isMiscTab = true;
        }, 0);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.gridOptions = {
      showColumnFooter: true,
      enableRowHeaderSelection: true,
      enableFullRowSelection: false,
      enableRowSelection: true,
      multiSelect: true,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: 'SupplierRMAMaterial.csv'
    };

    vm.sourceHeader = [
      {
        field: 'Action',
        cellClass: 'layout-align-center-center',
        displayName: 'Action',
        width: '80',
        cellTemplate: '<grid-action-view grid="grid" row="row"></grid-action-view>',
        enableFiltering: false,
        enableSorting: false,
        exporterSuppressExport: true,
        pinnedLeft: true
      },
      {
        field: 'packingSlipSerialNumber',
        width: '80',
        displayName: vm.LabelConstant.SupplierRMA.RMALine,
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        reeAggregationType: uiGridGroupingConstants.aggregation.SUM,
        footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right" >{{grid.appScope.$parent.vm.getTotalLineItems()}}</div>'
      },
      {
        field: 'mfgName',
        width: 200,
        displayName: CORE.LabelConstant.MFG.MFG,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                              <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToManufacturerDetail(row.entity.mfgcodeID);" tabindex="-1">{{COL_FIELD}}</a>\
                              <copy-text label="grid.appScope.$parent.vm.LabelConstant.MFG.MFG" text="row.entity.mfgName" ng-if="row.entity.mfgName"></copy-text>\
                           </div>'
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
                            rohs-icon="grid.appScope.$parent.vm.rohsImagePath + row.entity.rohsIcon" \
                            rohs-status="row.entity.rohsName" \
                            supplier-name="(row.entity.isCustom || row.entity.isCustomSupplier) ? null :(grid.appScope.$parent.vm.supplierRMA && grid.appScope.$parent.vm.supplierRMA.mfgCodemst ? grid.appScope.$parent.vm.supplierRMA.mfgCodemst.mfgName : null)" \
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
        field: 'refPackingSlipNumber',
        width: '120',
        displayName: vm.LabelConstant.SupplierRMA.RefPackingSlipNumber,
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>'
      },
      {
        field: 'refInvoiceNumber',
        width: '120',
        displayName: vm.LabelConstant.SupplierRMA.RefInvoiceNumber,
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>'
      },
      {
        field: 'packingSlipQty',
        width: 130,
        displayName: vm.LabelConstant.SupplierRMA.RMAIssueQty,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal }}</div>',
        treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
        footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right" >{{grid.appScope.$parent.vm.getQtySum("packingSlipQty")}}</div>'
      },
      {
        field: 'receivedQty',
        width: 150,
        displayName: vm.LabelConstant.SupplierRMA.ShippedQty,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right rec-qty">{{COL_FIELD | numberWithoutDecimal }}</div>',
        treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
        footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right rec-qty" >{{grid.appScope.$parent.vm.getQtySum("receivedQty")}}</div>'
      },
      {
        field: 'invoicePrice',
        displayName: vm.LabelConstant.SupplierRMA.RMAUnitPrice,
        width: '120',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="COL_FIELD">{{COL_FIELD | unitPrice }}</div><div class="ui-grid-cell-contents grid-cell-text-right" ng-if="!COL_FIELD">${{COL_FIELD}}</div>',
        footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right" >{{grid.appScope.$parent.vm.getFooterTotal("invoicePrice")}}</div>'
      },
      {
        field: 'extendedPrice',
        displayName: vm.LabelConstant.SupplierRMA.ExtendedRMAPrice,
        width: '140',
        treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="COL_FIELD">{{COL_FIELD | amount }}</div><div class="ui-grid-cell-contents grid-cell-text-right" ng-if="!COL_FIELD">${{COL_FIELD}}</div>',
        footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right">{{grid.appScope.$parent.vm.getFooterTotal("extendedPrice")}}</div>'
      },
      {
        field: 'remark',
        displayName: vm.LabelConstant.SupplierRMA.RMALineRemark,
        width: '130',
        cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.remark" ng-click="grid.appScope.$parent.vm.showDescriptionPopUp(row.entity, \'LineComment\', $event)"> \
                                View \
                            </md-button>'
      },
      {
        field: 'internalRemark',
        displayName: vm.LabelConstant.SupplierRMA.InternalRMALineRemark,
        width: '130',
        cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.internalRemark" ng-click="grid.appScope.$parent.vm.showDescriptionPopUp(row.entity, \'InternalLineComment\', $event)"> \
                                View \
                            </md-button>'
      },
      {
        field: 'supplierCode',
        width: 200,
        displayName: CORE.LabelConstant.MFG.SupplierCode,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                                            <a class="cm-text-decoration underline" \
                                                ng-click="grid.appScope.$parent.vm.goToSupplier(row.entity.supplierMfgCodeId);"\
                                                tabindex="-1">{{COL_FIELD}}</a>\
                                            <copy-text label="grid.appScope.$parent.vm.LabelConstant.MFG.SupplierCode" text="row.entity.supplierCode" ng-if="row.entity.supplierCode"></copy-text>\
                                        </div>'
      },
      {
        field: 'supplierPN',
        displayName: CORE.LabelConstant.MFG.SupplierPN,
        cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link ng-if="row.entity.supplierMFGPNID" \
                            component-id="row.entity.supplierMFGPNID" \
                            label="grid.appScope.$parent.vm.CORE.LabelConstant.MFG.SupplierPN" \
                            value="row.entity.supplierPN" \
                            is-copy="true" \
                            is-supplier="true" \
                            rohs-icon="grid.appScope.$parent.vm.rohsImagePath + row.entity.supplierRohsIcon" \
                            rohs-status="row.entity.supplierRohsName" \
                            supplier-name="grid.appScope.$parent.vm.supplierRMA && grid.appScope.$parent.vm.supplierRMA.mfgCodemst ? grid.appScope.$parent.vm.supplierRMA.mfgCodemst.mfgName : null" \
                            is-search-findchip="true"></common-pid-code-label-link></div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
        allowCellFocus: false
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

    vm.loadData = () => {
      if (vm.supplierRMAParamId) {
        if (vm.pagingInfo.SortColumns.length === 0) {
          vm.pagingInfo.SortColumns = [
            ['packingSlipSerialNumber', 'ASC']
          ];
        }

        vm.cgBusyLoading = PackingSlipFactory.getPackingSlipMaterialList().query(vm.pagingInfo).$promise.then((response) => {
          vm.sourceData = [];
          if (response.data) {
            vm.sourceData = response.data.packingSlipMaterialList;
            vm.totalSourceDataCount = response.data.Count;

            $timeout(() => {
              _.map(vm.sourceData, (data, index) => {
                data.isDisabledUpdate = false;
                data.isDisabledDelete = false;
                data.isRowSelectable = true;
                if (vm.supplierRMA && ((vm.supplierRMA.status === vm.supplierRMAStatusCode.CreditMemoReceived && vm.supplierRMA.status === vm.supplierRMAStatusCode.ApprovedToPay && vm.supplierRMA.status === vm.supplierRMAStatusCode.Paid) || (vm.supplierRMA.packingSlipModeStatus !== vm.supplierRMAModeStatus[0].ID))) {
                  data.isDisabledUpdate = true;
                  data.isDisabledDelete = true;
                  data.isRowSelectable = false;
                } else {
                  data.isDisabledUpdate = false;
                  data.isDisabledDelete = false;
                  data.isRowSelectable = true;
                }
                data.tempID = (index + 1);
              });
            });
          }

          if (!vm.gridOptions.enablePaging) {
            vm.currentdata = vm.sourceData.length;
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

          $timeout(() => {
            vm.resetSourceGrid();
            if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
            }
          });
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.sourceData = [];
        vm.totalSourceDataCount = 0;
        vm.isNoDataFound = true;
        vm.emptyState = null;
        $timeout(() => {
          if (!vm.gridOptions.enablePaging) {
            vm.currentdata = vm.sourceData.length;
          }
          vm.resetSourceGrid();
          if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
          }
        });
      }
    };

    vm.getTotalLineItems = () => {
      let sum = vm.sourceData.length > 0 ? vm.sourceData.length : 0;
      sum = $filter('numberWithoutDecimal')(sum);
      const display = stringFormat('Total Line Items: {0}', sum);
      return display;
    };

    vm.getQtySum = (columnName) => {
      const sum = _.sumBy(vm.sourceData, (data) => data[columnName]);
      vm[`total${columnName}`] = sum;
      return $filter('unit')(sum);
    };

    vm.getFooterTotal = (columnName) => {
      const sum = _.sumBy(vm.sourceData, (data) => data[columnName]);
      vm[`total${columnName}`] = sum;
      return $filter('amount')(sum);
    };

    vm.goToSupplierRMAList = () => {
      BaseService.goToSupplierRMAList();
    };
    vm.goToManufacturerDetail = (id) => {
      BaseService.goToManufacturer(id);
    };

    vm.goToSupplierInvoiceDetail = (id) => {
      BaseService.goToSupplierInvoiceDetail(TRANSACTION.SupplierInvoiceType.Detail, id);
      return false;
    };

    vm.showDescriptionPopUp = (object, field, ev) => {
      const obj = {
        name: object.packingSlipSerialNumber
      };

      if (field === 'LineComment') {
        obj.title = vm.LabelConstant.SupplierRMA.RMALineRemark;
        obj.description = object && object.remark ? object.remark : null;
      } else if (field === 'InternalLineComment') {
        obj.title = vm.LabelConstant.SupplierRMA.InternalRMALineRemark;
        obj.description = object && object.internalRemark ? object.internalRemark : null;
      }

      const data = obj;
      data.label = vm.LabelConstant.SupplierRMA.RMALine;
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        data).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.scanDocument = () => {
      const scanDocumentDet = {
        id: vm.supplierRMA.id,
        filePrefix: `${vm.supplierRMA.mfgCode}-${vm.supplierRMA.poNumber}-${$filter('date')(new Date(), 'MMddyyyyhhmmss')}`,
        gencFileOwnerType: CORE.AllEntityIDS.Supplier_RMA.Name,
        mfgCodeID: vm.supplierRMA.mfgCodeID
      };
      DialogFactory.dialogService(
        CORE.PREVIEW_SCAN_DOCUMENT_MODAL_CONTROLLER,
        CORE.PREVIEW_SCAN_DOCUMENT_MODAL_VIEW,
        event,
        scanDocumentDet).then((response) => {
          if (response && response.saveDocument) {
            getSupplierRMADocumentCount();
          }
          if (vm.isDocumentTab) {
            $rootScope.$emit('refreshDocuments', true);
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.printRecord = (isDownload) => {
      if (isDownload) {
        vm.isDownloadDisabled = true;
      } else {
        vm.isPrintDisable = true;
      }
      let dataKeyvalue;
      _.each(vm.dataKey, (item) => {
        if (item.key === CONFIGURATION.SETTING.TermsAndCondition) {
          return dataKeyvalue = item.values;
        }
      });
      const supplierRMAReportDetails = {
        id: vm.supplierRMAParamId,
        termsAndCondition: dataKeyvalue,
        RMAData: {
          poNumber: vm.supplierRMA.poNumber,
          mfgCode: vm.supplierRMA.mfgCode
        }
      };
      SupplierRMAFactory.getSupplierRMAReport(supplierRMAReportDetails).then((response) => {
        const RMAData = response.config.data.RMAData;
        if (isDownload) {
          vm.isDownloadDisabled = false;
        } else {
          vm.isPrintDisable = false;
        }
        BaseService.downloadReport(response, stringFormat('{0}-{1}-{2}', CORE.REPORT_SUFFIX.SUPPLIER_RMA_MEMO, RMAData.poNumber, RMAData.mfgCode), isDownload, true);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.addSupplierRMAStock = (event) => {
      const data = {
        packingSlipId: vm.supplierRMADet.refPackingSlipIdForRma,
        packingSlipNumber: vm.supplierRMADet.refPackingSlipValue,
        invoiceId: vm.supplierRMADet.refInvoiceIdForRma,
        invoiceNumber: vm.supplierRMADet.refInvoiceValue,
        supplierId: vm.supplierRMA.mfgCodeID,
        mfrPnId: vm.supplierRMADet.partID,
        PIDCode: vm.supplierRMADet.PIDCode,
        packagingId: vm.supplierRMADet.packagingID,
        packingSlipDetailId: vm.supplierRMADet.refPackingSlipDetIdForRMA,
        rmaId: vm.supplierRMAParamId,
        rmaDetailId: vm.supplierRMADet.id,
        partId: vm.supplierRMADet.partID,
        rmaStockDetailList: rmaStockDetailList,
        mfgPN: vm.supplierRMADet.mfgPN,
        rohsIcon: vm.supplierRMADet.rohsIcon,
        rohsName: vm.supplierRMADet.rohsName
      };

      const objPackaging = _.find(vm.packagingList, (data) => data.id === vm.supplierRMADet.packagingID);
      if (objPackaging) {
        data.packagingName = objPackaging.name;
      }

      DialogFactory.dialogService(
        TRANSACTION.SUPPLIER_RMA_STOCK_POPUP_CONTROLLER,
        TRANSACTION.SUPPLIER_RMA_STOCK_POPUP_VIEW,
        event,
        data).then(() => {
        }, (response) => {
          if (response && response.length > 0) {
            rmaStockDetailList = response;
            //vm.supplierRMADet.packingSlipQty = CalcSumofArrayElement(_.map(rmaStockDetailList, 'orgAvailableQty'), 0);
            vm.supplierRMADet.receivedQty = CalcSumofArrayElement(_.map(rmaStockDetailList, 'shipmentQty'), 0);
            vm.supplierRMALineDetailForm.$$controls[0].$setDirty();
          }
          setFocus('rmaUnitPrice');
        });
    };

    vm.opencustomerpackingSlipChangesHistoryAuditLog = (ev) => {
      const data = angular.copy(vm.supplierRMA);
      DialogFactory.dialogService(
        TRANSACTION.TRANSACTION_PACKING_SLIP_CHANGE_HISTORY_CONTROLLER,
        TRANSACTION.TRANSACTION_PACKING_SLIP_CHANGE_HISTORY_VIEW,
        ev,
        data).then(() => { }, () => { }, (error) => BaseService.getErrorLog(error));
    };

    vm.goToSupplierList = () => {
      BaseService.goToSupplierList();
    };

    vm.goToSupplierDetail = () => {
      BaseService.goToSupplierDetail(vm.supplierRMA.mfgCodeID);
    };

    vm.goToShippingMethodList = () => {
      BaseService.openInNew(USER.ADMIN_GENERICCATEGORY_SHIPPINGTYPE_STATE);
    };

    vm.goToCarrierList = () => {
      BaseService.openInNew(USER.ADMIN_GENERICCATEGORY_CARRIERMST_STATE);
    };

    vm.goToMFGList = () => {
      BaseService.openInNew(USER.ADMIN_MANUFACTURER_STATE, {});
    };

    vm.goToMFGPartList = () => {
      BaseService.openInNew(USER.ADMIN_MFG_COMPONENT_STATE, {});
    };
    vm.goToSupplierPartList = () => {
      BaseService.goToSupplierPartList();
    };

    vm.goToSupplierPartDetails = (id) => {
      BaseService.goToSupplierPartDetails(id);
    };

    vm.goToUomList = () => {
      BaseService.openInNew(USER.ADMIN_UNIT_STATE, {});
    };

    vm.goToPackaging = () => {
      BaseService.goToPackaging();
    };

    vm.goToPackingSlipList = () => {
      BaseService.goToPackingSlipList();
    };

    vm.goToSupplierInvoiceList = () => {
      BaseService.goToSupplierInvoiceList();
    };

    vm.goToSupplierRMAAddress = () => {
      if (vm.supplierRMA && vm.supplierRMA.mfgCodeID) {
        BaseService.goToSupplierRMAAddress(vm.supplierRMA.mfgCodeID);
      }
    };

    vm.goToSupplier = (supplierId) => {
      if (supplierId) {
        BaseService.goToSupplierDetail(supplierId);
      }
    };

    vm.goToCreditMemoList = () => {
      BaseService.goToCreditMemoList();
    };

    vm.goToCreditMemoDetail = (id) => {
      BaseService.goToCreditMemoDetail(null, id);
    };

    $scope.$on('documentCount', () => {
      getSupplierRMADocumentCount();
    });

    angular.element(() => {
      if ($state.current.name === TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_RMA_STATE) {
        BaseService.currentPageForms = [vm.supplierRMADetailForm, vm.supplierRMALineDetailForm];
      }
    });

    const redirectToPartDetail = (pId, pMfrPN) => {
      const redirectToPartUrl = WebsiteBaseUrl + CORE.URL_PREFIX + USER.ADMIN_COMPONENT_ROUTE + USER.ADMIN_MANAGECOMPONENT_ROUTE + USER.ADMIN_MANAGECOMPONENT_DETAIL_TAB_ROUTE.replace(':mfgType', CORE.MFG_TYPE.MFG.toLowerCase()).replace(':coid', pId);
      return stringFormat('<a href=\'{0}\' target=\'_blank\' tabindex=\'-1\' class=\'underline\'>{1}</a>', redirectToPartUrl, pMfrPN);
    };

    const redirectToPackingSlipDetail = (pId, pPackingSlipNumber) => {
      const redirectToPartUrl = WebsiteBaseUrl + CORE.URL_PREFIX + TRANSACTION.TRANSACTION_ROUTE + TRANSACTION.TRANSACTION_MATERIAL_RECEIVE_ROUTE.replace(':type', TRANSACTION.PackingSlipTabType.PackingSlip) + TRANSACTION.TRANSACTION_MANAGE_MATERIAL_RECEIVE_ROUTE.replace(':type', TRANSACTION.PackingSlipTabType.PackingSlip).replace(':id', pId);
      return stringFormat('<a href=\'{0}\' target=\'_blank\' tabindex=\'-1\' class=\'underline\'>{1}</a>', redirectToPartUrl, pPackingSlipNumber);
    };
  }
})();
