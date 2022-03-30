(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('AddSupplierRMAPopUpController', AddSupplierRMAPopUpController);

  function AddSupplierRMAPopUpController($mdDialog, $q, $filter, $timeout, data, USER, CORE, TRANSACTION, BaseService, DialogFactory, MasterFactory,
    SupplierRMAFactory, GenericCategoryFactory, CustomerFactory) {
    const vm = this;
    vm.saveBtnDisableFlag = false;
    vm.objData = data ? data : [];
    vm.CORE = CORE;
    vm.Transaction = TRANSACTION;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.supplierQuoteStaus = CORE.SupplierQuoteWorkingStatus;
    vm.PartCategory = CORE.PartCategory;
    vm.LabelConstant = CORE.LabelConstant;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.maxLengthForDescription = _maxLengthForDescription;
    vm.rmaAddressList = [];
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.rmaAddressViewActionBtnDet = angular.copy(CORE.CustAddressViewActionBtn);
    vm.rmaAddressContPersonViewActionBtnDet = angular.copy(CORE.ContactPersonViewActionBtn);
    vm.rmaMarkedForAddressViewActionBtnDet = angular.copy(CORE.CustAddressViewActionBtn);
    vm.rmaMarkedForAddressContPersonViewActionBtnDet = angular.copy(CORE.ContactPersonViewActionBtn);
    vm.rmaAddressViewActionBtnDet.Delete.isVisible = false;
    vm.rmaAddressContPersonViewActionBtnDet.Delete.isVisible = false;
    vm.rmaMarkedForAddressContPersonViewActionBtnDet.Delete.isVisible = false;
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
    vm.supplierRMAStatusCode = CORE.SupplierRMAStatusCode;
    vm.supplierRMAModeStatus = CORE.SupplierRMAModeStatus;
    vm.supplierRMAEntity = CORE.AllEntityIDS.Supplier_RMA;
    vm.addDaysInCurrentDate = (date, days) => new Date(moment(date, 'DD-MM-YYYY').add(days, 'days'));
    vm.supplierRMA = {
      mfgCodeID: vm.objData ? vm.objData.mfgCodeID : null,
      packingSlipModeStatus: vm.supplierRMAModeStatus[0].ID,
      poDate: vm.currentDate,
      packingSlipDate: vm.currentDate,
      receiptDate: vm.addDaysInCurrentDate(new Date(), 7),
      shippingInsurance: true,
      supplierRMATrackNumber: []
    };
    vm.CategoryTypeObjList = CORE.CategoryType;
    const maxAddressLength = CORE.maxAddressLength;
    vm.trackingNumberFieldName = 'trackingNumber';

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
      addressType: CORE.AddressType.RMAShippingAddress,
      addressBlockTitle: vm.LabelConstant.Address.MarkForAddress,
      refTransID: null,
      refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
      alreadySelectedAddressID: null,
      alreadySelectedPersonId: null,
      showAddressEmptyState: false
    };
    function getSupplierList() {
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
    function getGenericCategoryList() {
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
          } else if (type === vm.LabelConstant.Address.MarkForAddress) {
            setFocus('addRmaMarkForAddress');
          }
        });
        return 1;
      }
      return 0;
    };

    const getRMAAddressList = (id, addressBlockTitle) => {
      vm.cgBusyLoading = CustomerFactory.customerAddressList().query({
        customerId: id,
        addressType: CORE.AddressType.RMAShippingAddress,
        refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
        onlyDefault: true
      }).$promise.then((rmaAddress) => {
        if (addressBlockTitle) {
          if (addressBlockTitle === vm.LabelConstant.COMMON.RMAShippingAddress) {
            vm.rmaAddress = _.find(rmaAddress.data, (item) => item.isDefault === true);
            vm.rmaAddressViewAddrOtherDet.alreadySelectedAddressID = vm.rmaAddress ? vm.rmaAddress.id : null;
            vm.supplierRMA.rmaShippingAddressId = vm.rmaAddressViewAddrOtherDet.alreadySelectedAddressID;
            vm.rmaAddressContactPerson = (vm.rmaAddress && vm.rmaAddress.contactPerson) ? angular.copy(vm.rmaAddress.contactPerson) : null;
            vm.rmaAddressViewAddrOtherDet.alreadySelectedPersonId = vm.rmaAddressContactPerson ? vm.rmaAddressContactPerson.personId : null;
            vm.supplierRMA.rmaShippingContactPersonID = vm.rmaAddressViewAddrOtherDet.alreadySelectedPersonId;
            if (!rmaAddress || !rmaAddress.data || rmaAddress.data.length === 0 &&
              (vm.rmaAddressViewAddrOtherDet && !vm.rmaAddressViewAddrOtherDet.alreadySelectedAddressID)) {
              vm.rmaAddressViewAddrOtherDet.showAddressEmptyState = true;
            } else {
              vm.rmaAddressViewAddrOtherDet.showAddressEmptyState = false;
            }
          } else if (addressBlockTitle === vm.LabelConstant.Address.MarkForAddress) {
            vm.rmaMarkedAddressViewAddrOtherDet.alreadySelectedAddressID = null;
            vm.rmaMarkedAddressViewAddrOtherDet.alreadySelectedPersonId = null;
            if (!rmaAddress || !rmaAddress.data || rmaAddress.data.length === 0 &&
              (vm.rmaMarkedAddressViewAddrOtherDet && !vm.rmaMarkedAddressViewAddrOtherDet.rmaMarkForAddressId)) {
              vm.rmaMarkedAddressViewAddrOtherDet.showAddressEmptyState = true;
            } else {
              vm.rmaMarkedAddressViewAddrOtherDet.showAddressEmptyState = false;
            }
          }
        } else {
          vm.rmaAddress = _.find(rmaAddress.data, (item) => item.isDefault === true);
          vm.rmaAddressViewAddrOtherDet.alreadySelectedAddressID = vm.rmaAddress ? vm.rmaAddress.id : null;
          vm.supplierRMA.rmaShippingAddressId = vm.rmaAddressViewAddrOtherDet.alreadySelectedAddressID;
          vm.rmaAddressContactPerson = (vm.rmaAddress && vm.rmaAddress.contactPerson) ? angular.copy(vm.rmaAddress.contactPerson) : null;
          vm.rmaAddressViewAddrOtherDet.alreadySelectedPersonId = vm.rmaAddressContactPerson ? vm.rmaAddressContactPerson.personId : null;
          vm.supplierRMA.rmaShippingContactPersonID = vm.rmaAddressViewAddrOtherDet.alreadySelectedPersonId;
          if (!rmaAddress || !rmaAddress.data || rmaAddress.data.length === 0 &&
            (vm.rmaAddressViewAddrOtherDet && !vm.rmaAddressViewAddrOtherDet.alreadySelectedAddressID)) {
            vm.rmaAddressViewAddrOtherDet.showAddressEmptyState = true;
          } else {
            vm.rmaAddressViewAddrOtherDet.showAddressEmptyState = false;
          }
          vm.rmaMarkedAddressViewAddrOtherDet.alreadySelectedAddressID = null;
          vm.rmaMarkedAddressViewAddrOtherDet.alreadySelectedPersonId = null;

          if (!rmaAddress || !rmaAddress.data || rmaAddress.data.length === 0 &&
            (vm.rmaMarkedAddressViewAddrOtherDet && !vm.rmaMarkedAddressViewAddrOtherDet.rmaMarkForAddressId)) {
            vm.rmaMarkedAddressViewAddrOtherDet.showAddressEmptyState = true;
          } else {
            vm.rmaMarkedAddressViewAddrOtherDet.showAddressEmptyState = false;
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // set data for customer address directive
    const setOtherDetForAddrDir = (addressBlockTitle, suppID) => {
      if (addressBlockTitle === vm.LabelConstant.COMMON.RMAShippingAddress) {
        vm.rmaAddressViewAddrOtherDet.customerId = suppID || vm.autoCompleteSupplier.keyColumnId;
        vm.rmaAddressViewAddrOtherDet.refTransID = suppID || vm.autoCompleteSupplier.keyColumnId;
        vm.rmaAddressViewAddrOtherDet.companyName = vm.supplierRMA.mfgName || null;
        vm.rmaAddressViewAddrOtherDet.companyNameWithCode = vm.supplierRMA.mfgFullName || null;
      } else if (addressBlockTitle === vm.LabelConstant.Address.MarkForAddress) {
        vm.rmaMarkedAddressViewAddrOtherDet.customerId = suppID || vm.autoCompleteSupplier.keyColumnId;
        vm.rmaMarkedAddressViewAddrOtherDet.refTransID = suppID || vm.autoCompleteSupplier.keyColumnId;
        vm.rmaMarkedAddressViewAddrOtherDet.companyName = vm.supplierRMA.mfgName || null;
        vm.rmaMarkedAddressViewAddrOtherDet.companyNameWithCode = vm.supplierRMA.mfgFullName || null;
      }
    };

    function initAutoComplete() {
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
            vm.supplierRMA.shippingMethodId = item.rmaShippingMethodId;
            vm.supplierRMA.carrierId = item.rmaCarrierID;
            vm.supplierRMA.carrierAccountNumber = item.rmaCarrierAccount;
            vm.supplierRMA.shippingInsurance = item.rmaShippingInsurence;
              setOtherDetForAddrDir(vm.LabelConstant.Address.MarkForAddress, item.id);
            setOtherDetForAddrDir(vm.LabelConstant.COMMON.RMAShippingAddress, item.id);
            vm.checkUniqueRMANumber();
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
            vm.rmaAddressViewAddrOtherDet.showAddressEmptyState = false;
            vm.rmaAddressViewAddrOtherDet.showAddressEmptyState = false;
            vm.rmaAddressViewAddrOtherDet.customerId = null;
            vm.rmaAddressViewAddrOtherDet.refTransID = null;
            vm.rmaAddressViewAddrOtherDet.companyName = null;
            vm.rmaAddressViewAddrOtherDet.companyNameWithCode = null;
            vm.rmaMarkedAddressViewAddrOtherDet.customerId = null;
            vm.rmaMarkedAddressViewAddrOtherDet.refTransID = null;
            vm.rmaMarkedAddressViewAddrOtherDet.companyName = null;
            vm.rmaMarkedAddressViewAddrOtherDet.companyNameWithCode = null;
            vm.rmaAddress = null;
            vm.rmaAddressContactPerson = null;
            vm.rmaMarkForAddress = null;
            vm.markedForAddressContactPerson = null;
            vm.isDisableRMADate = false;
          }
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

    function getAutoCompleteData() {
      const autocompletePromise = [getSupplierList(), getGenericCategoryList()];
      vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
        initAutoComplete();
      }).catch((error) => BaseService.getErrorLog(error));
    }

    vm.checkUniqueRMANumber = () => {
      if (vm.supplierRMA.mfgCodeID && vm.supplierRMA.poNumber) {
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
                  if (vm.supplierRMADetailForm) {
                    vm.supplierRMADetailForm.$setPristine();
                  }
                  vm.cancel();
                } else if (response.name === buttonsList[1].name) {
                  //update RMA
                  if (vm.supplierRMADetailForm) {
                    vm.supplierRMADetailForm.$setPristine();
                  }
                  if (response.row && response.row.id) {
                    BaseService.goToManageSupplierRMA(TRANSACTION.SupplierRMATab.SupplierRMA, response.row.id, vm.objData.PartId, vm.objData.packingSlipID);
                    vm.cancel();
                  }
                } else if (response.name === buttonsList[2].name) {
                  //create RMA with entered RMA#
                  if (res && res.data) {
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
        }).catch((error) => BaseService.getErrorLog(error));
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

    vm.goToSupplierList = () => {
      BaseService.goToSupplierList();
      return false;
    };

    vm.goToSupplierDetail = (data) => {
      BaseService.goToSupplierDetail(data.id);
      return false;
    };
    vm.goToPartList = () => {
      BaseService.goToPartList();
      return false;
    };
    vm.goToPartDetail = () => {
      BaseService.goToComponentDetailTab(CORE.MFG_TYPE.MFG.toLowerCase(), vm.objData.PartId, USER.PartMasterTabs.Detail.Name);
    };

    vm.goToPackingSlipList = () => {
      BaseService.goToPackingSlipList();
    };
    vm.goToPackingSlipDetail = () => {
      BaseService.goToManagePackingSlipDetail(vm.objData.packingSlipID);
    };

    function active() {
      getAutoCompleteData();

      vm.headerdata = [
        {
          label: vm.LabelConstant.MFG.Supplier,
          value: vm.objData.supplierCodeName,
          displayOrder: 1,
          labelLinkFn: vm.goToSupplierList,
          valueLinkFn: vm.goToSupplierDetail,
          valueLinkFnParams: { id: vm.objData.mfgCodeID }
        },
        {
          label: vm.LabelConstant.MFG.PID,
          value: vm.objData.pidCode,
          displayOrder: 2,
          labelLinkFn: vm.goToPartList,
          valueLinkFn: vm.goToPartDetail,
          isCopy: true,
          isCopyAheadLabel: true,
          isAssy: true,
          imgParms: {
            imgPath: vm.rohsImagePath + vm.objData.rohsIcon,
            imgDetail: vm.objData.rohsName
          },
          isCopyAheadOtherThanValue: true,
          copyAheadLabel: vm.LabelConstant.MFG.MFGPN,
          copyAheadValue: vm.objData.mfgPN
        },
        {
          label: vm.LabelConstant.SupplierRMA.RefPackingSlipNumber,
          value: vm.objData.packingSlipNumber,
          displayOrder: 3,
          labelLinkFn: vm.goToPackingSlipList,
          valueLinkFn: vm.goToPackingSlipDetail
        }
      ];
    }
    active();

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
            setFocus(vm.trackingNumberFieldName);
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
            setFocus(vm.trackingNumberFieldName);
            return;
          }
          if (vm.checkUniqueTrackNumber()) {
            vm.disableTrackingNumber = false;
            setFocus(vm.trackingNumberFieldName);
            const trackingNumberDet = _.find(vm.supplierRMA.supplierRMATrackNumber, (obj) => obj.tempID === vm.trackingNumberDet.tempID);
            if (trackingNumberDet) {
              trackingNumberDet.trackNumber = vm.trackingNumberDet.trackNumber;
            } else {
              vm.supplierRMA.supplierRMATrackNumber.push({
                trackNumber: vm.trackingNumberDet.trackNumber,
                refPackingSlipMaterialRecID: null/*vm.supplierRMAParamId*/,
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
      vm.trackingNumberDet = angular.copy(item);
      setFocus(vm.trackingNumberFieldName);
    };

    vm.removeTrackNumber = (item, index) => {
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

            setFocus(vm.trackingNumberFieldName);
          }
        }, () => {
          setFocus(vm.trackingNumberFieldName);
        }).catch((error) => BaseService.getErrorLog(error));
      }

      vm.isAddTrackDisable = _.filter(vm.supplierRMA.supplierRMATrackNumber, (obj) => !obj.trackNumber).length > 0;
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
        const addressPromise = [getRMAAddressList(vm.autoCompleteSupplier.keyColumnId, vm.LabelConstant.Address.MarkForAddress)];
      vm.cgBusyLoading = $q.all(addressPromise).then(() => {
        setOtherDetForAddrDir(vm.LabelConstant.COMMON.MarkFor, vm.autoCompleteSupplier.keyColumnId);
      }).catch((error) => BaseService.getErrorLog(error));
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
        messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.Address.MarkForAddress + ' ' + CORE.PAGENAME_CONSTANT[67].PageName);
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
      if (BaseService.focusRequiredField(vm.supplierRMADetailForm)) {
        return;
      }
      if (checkAddressValidation()) {
        return;
      }

      if (checkAddressErrorDetail(vm.supplierRMA.rmaShippingAddress, 'RMA To')) {
        vm.rmaAddress = null;
        vm.supplierRMA.rmaShippingAddressId = null;
        vm.supplierRMA.rmaShippingAddress = null;
        setFocus('addRmaAddress');
        return;
      } else if (checkAddressErrorDetail(vm.supplierRMA.rmaShippingAddress, vm.LabelConstant.Address.MarkForAddress)) {
        vm.rmaMarkForAddress = null;
        vm.supplierRMA.rmaMarkForAddressId = null;
        vm.supplierRMA.rmaMarkForAddress = null;
        setFocus('addRmaMarkForAddress');
        return;
      }

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
        if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          if (vm.supplierRMADetailForm) {
            vm.supplierRMADetailForm.$setPristine();
          }
          //vm.resetRMAMaterialDet();
          if (response && response.data) {
            BaseService.goToManageSupplierRMA(TRANSACTION.SupplierRMATab.SupplierRMA, response.data.supplierRMADetail.id, vm.objData.PartId, vm.objData.packingSlipID);
            vm.cancel();
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
            messageContent.message = stringFormat(messageContent.message, 'supplier RMA#', vm.supplierRMA.poNumber, obj && obj.mfgName ? obj.mfgName : null, 'supplier RMA#');
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
            messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.Address.MarkForAddress + ' ' + CORE.PAGENAME_CONSTANT[67].PageName);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model);
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.goToSupplierList = () => {
      BaseService.goToSupplierList();
    };
    vm.goToSupplierRMAList = () => {
      BaseService.goToSupplierRMAList();
    };
    vm.goToShippingMethodList = () => {
      BaseService.openInNew(USER.ADMIN_GENERICCATEGORY_SHIPPINGTYPE_STATE);
    };

    vm.goToCarrierList = () => {
      BaseService.openInNew(USER.ADMIN_GENERICCATEGORY_CARRIERMST_STATE);
    };

    vm.goToSupplierRMAAddress = () => {
      if (vm.supplierRMA && vm.supplierRMA.mfgCodeID) {
        BaseService.goToSupplierRMAAddress(vm.supplierRMA.mfgCodeID);
      }
    };


    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.supplierRMADetailForm, vm.checkDirtyObject);
      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        $mdDialog.cancel();
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    vm.getMaxDateValidation = (FromDate, ToDate) => BaseService.getMaxDateValidation(FromDate, ToDate);
    vm.getMinDateValidation = (FromDate, ToDate) => BaseService.getMinDateValidation(FromDate, ToDate);

    // Check Form Dirty state on state change and reload browser
    angular.element(() => {
      BaseService.currentPagePopupForm = [vm.supplierRMADetailForm];
    });
  }
})();
