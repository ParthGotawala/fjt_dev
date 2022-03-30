(function () {
  'use strict';

  angular
    .module('app.transaction.customerpacking')
    .controller('CustomerPackingSlipAddrMismatchPopupController', CustomerPackingSlipAddrMismatchPopupController);

  /** @ngInject */
  function CustomerPackingSlipAddrMismatchPopupController($mdDialog, data, BaseService, CORE, USER, GenericCategoryFactory,
    CustomerFactory, SalesOrderFactory, $q, CustomerPackingSlipFactory, DialogFactory) {
    const vm = this;
    vm.popupParamData = data;
    vm.LabelConstant = CORE.LabelConstant;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.confirmationMsgOnShipAddrMismatch = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUSTOMER_SO_PACKING_SLIP_ADDRESS_SHIPPING_MISMATCH_CONFIRMATION.message;
    vm.createNewPackingSlipOnShipAddrMismatch = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CREATE_NEW_PACKING_SLIP_ON_SHIP_ADDR_MISMATCH.message;
    vm.categoryTypeObjList = angular.copy(CORE.CategoryType);
    vm.radioGrpShippingSelection = angular.copy(CORE.AddressMismatchSelection);
    vm.cpsDetail = {};
    vm.selectedShippingDetails = vm.radioGrpShippingSelection[2].id;
    vm.disableManualSelection = true;

    vm.selectedShipToActionBtn = angular.copy(CORE.CustAddressViewActionBtn);
    vm.selectedShipToActionBtn.SetDefault.isVisible = false;
    vm.selectedShipToActionBtn.Delete.isVisible = false;

    vm.selectedContactActionBtn = angular.copy(CORE.CustAddressViewActionBtn);
    vm.selectedContactActionBtn.Delete.isVisible = false;
        
    const disableAddrContactActionButton = (disableFlag) => {
      vm.selectedShipToActionBtn.AddNew.isDisable = disableFlag;
      vm.selectedShipToActionBtn.Update.isDisable = disableFlag;
      vm.selectedShipToActionBtn.Delete.isDisable = disableFlag;
      vm.selectedShipToActionBtn.ApplyNew.isDisable = disableFlag;

      vm.selectedContactActionBtn.AddNew.isDisable = disableFlag;
      vm.selectedContactActionBtn.Update.isDisable = disableFlag;
      vm.selectedContactActionBtn.Delete.isDisable = disableFlag;
      vm.selectedContactActionBtn.ApplyNew.isDisable = disableFlag;
    };
    disableAddrContactActionButton(true);

    vm.selectedShipToOtherDet = {
      showAddressEmptyState: false,
      mfgType: CORE.MFG_TYPE.CUSTOMER,
      customerId: vm.popupParamData.customerID,
      addressType: 'S',
      companyName: vm.popupParamData.customerName,
      companyNameWithCode: vm.popupParamData.customerName,
      refTransID: vm.popupParamData.customerID,
      refTableName: CORE.TABLE_NAME.MFG_CODE_MST
    };
    // set isShippingChangedManually flag true only in case of first line of packing slip
    // this flag is used to check that wheather details changed from header radio button or manually
    vm.isShippingChangedManually = vm.popupParamData.isAnyPackingSlipDetAvailable ? false : true;
    vm.mismatchShipTo = false;
    vm.mismatchContactPerson = false;
    vm.mismatchShippingMethod = false;
    vm.mismatchCarrier = false;
    vm.mismatchCarrierAccNumber = false;

    // apply address after confirmation
    vm.applyAddress = (buttonType) => {
      let data = {};
      if (BaseService.focusRequiredField(vm.customerBillingAddressForm)) {
        return;
      }
      if (buttonType === 1) {
        data = {
          shipToId: vm.selectedDetail.shippingAddressID,
          shippingAddressObj: vm.selectedDetail.shippingAddressObj,
          shippingContactPersonID: vm.selectedDetail.shippingContactPersonID,
          shippingContactPersonObj: vm.selectedDetail.shippingContactPersonObj,
          shippingMethodId: vm.selectedDetail.shippingMethodID,
          carrierID: vm.selectedDetail.carrierID,
          carrierAccountNumber: vm.selectedDetail.carrierAccountNumber,
          continueExisting: false
        };
      } else {
        data.continueExisting = true;
      }
      BaseService.currentPagePopupForm.pop();
      $mdDialog.hide(data);
    };

    // initial  auto complete
    const initAutoComplete = () => {
      // Auto Complete Shipping Method
      vm.autoCompleteShipping = {
        columnName: 'gencCategoryName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: null,
        inputName: vm.categoryTypeObjList.ShippingType.Name,
        placeholderName: vm.categoryTypeObjList.ShippingType.Title,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_SHIPPINGTYPE_MANAGEGENERICCATEGORY_STATE],
          pageNameAccessLabel: CORE.PageName.shippingMethods,
          headerTitle: vm.categoryTypeObjList.ShippingType.Title
        },
        isRequired: true,
        isAddnew: true,
        callbackFn: () => getGenericCategoryList(vm.categoryTypeObjList.ShippingType.Name),
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.selectedDetail.shippingMethodID = item.gencCategoryID;
          }
          if (item && vm.isShippingChangedManually && vm.autoCompleteCarrier && (vm.selectedDetail.shippingMethodID !== item.gencCategoryID || vm.autoCompleteShipping.shippingMethodID !== item.gencCategoryID)) {
            if (vm.selectedDetail.shippingMethodId && vm.selectedDetail.shippingMethodId !== item.gencCategoryID) {
              const model = {
                messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.UPDATE_SHIPPING_METHOD_CONFIRMATION),
                btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
              };
              DialogFactory.messageConfirmDialog(model).then(() => {
                vm.autoCompleteCarrier.keyColumnId = item.carrierID;
                vm.selectedDetail.carrierAccountNumber = null;
              }, () => {
                vm.autoCompleteShipping.keyColumnId = vm.selectedDetail.shippingMethodId;
                vm.autoCompleteCarrier.keyColumnId = vm.selectedDetail.carrierID;
                vm.selectedDetail.carrierAccountNumber = vm.soRelLine.carrierAccountNumber;
              });
            } else {
              vm.autoCompleteCarrier.keyColumnId = item.carrierID;
            }
          } else if (!item) {
            vm.selectedDetail.carrierAccountNumber = null;
            vm.autoCompleteCarrier.keyColumnId = null;
          }
          vm.isShippingChangedManually = vm.popupParamData.isAnyPackingSlipDetAvailable ? false : true;// once data set
        }
      };
      // Auto Complete Carrier
      vm.autoCompleteCarrier = {
        columnName: 'gencCategoryName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: null,
        inputName: vm.categoryTypeObjList.Carriers.Name,
        placeholderName: vm.categoryTypeObjList.Carriers.Title,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_CARRIERMST_MANAGEGENERICCATEGORY_STATE],
          pageNameAccessLabel: CORE.PageName.Carriers,
          headerTitle: vm.categoryTypeObjList.Carriers.Title
        },
        isRequired: true,
        isAddnew: true,
        callbackFn: () => getGenericCategoryList(vm.categoryTypeObjList.Carriers.Name),
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.selectedDetail.carrierID = item.gencCategoryID;
          }
        }
      };
    };

    // Get Term/Carrier/Shipping list
    const getGenericCategoryList = (genCatType) => {
      const GencCategoryType = [genCatType];
      const listObj = {
        GencCategoryType: GencCategoryType,
        isActive: true
      };
      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((respGen) => {
        if (respGen && respGen.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          if (genCatType === vm.categoryTypeObjList.Carriers.Name) {
            vm.CarrierList = respGen.data;
          } else {
            vm.ShippingTypeList = respGen.data;
          }
          return $q.resolve(respGen.data);
        } else {
          return $q.resolve(false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // get complete shipping address list
    const getCustomerAddress = () => CustomerFactory.customerAddressList().query({
      customerId: vm.popupParamData.customerID,
      addressType: [CORE.AddressType.ShippingAddress],
      refTableName: CORE.TABLE_NAME.MFG_CODE_MST
    }).$promise.then((customeraddress) => {
      if (customeraddress.data) {
        vm.ShippingAddressList = customeraddress.data;
        if ((!vm.ShippingAddressList) || (vm.ShippingAddressList && vm.ShippingAddressList.length === 0)) {
          vm.ShippingAddressEmptyState = true;
        } else {
          vm.ShippingAddressEmptyState = false;
        }
      } else {
        vm.ShippingAddressEmptyState = true;
      }
      return $q.resolve(vm.ShippingAddressList);
    }).catch((error) => BaseService.getErrorLog(error));

    // get conctact person list
    const getCustomerContactPersonList = () => CustomerFactory.getCustomerContactPersons().query({
      refTransID: vm.popupParamData.customerID,
      refTableName: CORE.TABLE_NAME.MFG_CODE_MST
    }).$promise.then((contactperson) => {
      if (contactperson && contactperson.data) {
        vm.ContactPersonList = contactperson.data;
        if (!vm.ContactPersonList || vm.ContactPersonList.length === 0) {
          vm.ContactPersonEmptyState = true;
        } else {
          vm.ContactPersonEmptyState = false;
        }
        return vm.ContactPersonList;
      } else {
        vm.ContactPersonEmptyState = true;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    // Get Sales order list auto complete
    const getCustomerSalesOrderDetail = () => SalesOrderFactory.retriveSalesOrderByID().query({ id: vm.popupParamData.refSalesOrderID }).$promise.then((res) => {
      if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
        vm.soMst = res.data;
        vm.soMst.shippingAddressObj = _.find(vm.ShippingAddressList, (item) => item.id === vm.soMst.shippingAddressID);
        vm.soMst.shippingContactPersonObj = vm.soMst.shippingContactPersonID ? _.find(vm.ContactPersonList, (item) => item.personId === vm.soMst.shippingContactPersonID) : null;
        vm.soMst.shippingMethodText = vm.ShippingTypeList && vm.soMst.shippingMethodID ? _.find(vm.ShippingTypeList, (item) => item.gencCategoryID === vm.soMst.shippingMethodID).gencCategoryName : '';
        vm.soMst.carrierText = vm.CarrierList && vm.soMst.carrierID ? _.find(vm.CarrierList, (item) => item.gencCategoryID === vm.soMst.carrierID).gencCategoryName : '';
        vm.soMst.shipToOtherDet = {
          showAddressEmptyState: vm.ShippingAddressEmptyState,
          mfgType: CORE.MFG_TYPE.CUSTOMER,
          customerId: vm.popupParamData.customerID,
          addressType: 'S',
          addressBlockTitle: vm.LabelConstant.COMMON.ShippingAddress,
          companyName: vm.popupParamData.customerName,
          companyNameWithCode: vm.popupParamData.customerName,
          refTransID: vm.popupParamData.customerID,
          refTableName: CORE.TABLE_NAME.MFG_CODE_MST
        };
        vm.soMst.shippingContactPersonOtherDet = {
          customerId: vm.popupParamData.customerID,
          refTransID: vm.popupParamData.customerID,
          refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
          alreadySelectedPersonId: (vm.soMst.shppingContactPesonObj && vm.soMst.shppingContactPesonObj.personId) || null,
          showContPersonEmptyState: vm.ContactPersonEmptyState,
          companyName: vm.popupParamData.companyName,
          selectedContactPerson: vm.soMst.shppingContactPesonObj || null,
          mfgType: CORE.MFG_TYPE.CUSTOMER
        };
        return res.data;
      } else {
        return false;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    // get release line details to be added
    const getPendingReleaseLine = () => {
      if (vm.popupParamData.soRelLineId) {
        return CustomerPackingSlipFactory.getPendingSalesShippingDetails().query({ salesorderID: vm.popupParamData.soDetId, packingSlipID: null, packingslipDetID: null, soReleaseID: vm.popupParamData.soRelLineId }).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            vm.soRelLine = _.clone(res.data ? res.data.shippingsalesorderList[0] : []);
            vm.soRelLine.shippingAddressObj = _.find(vm.ShippingAddressList, (item) => item.id === vm.soRelLine.shippingAddressID);
            vm.soRelLine.shippingContactPersonObj = vm.ContactPersonList && vm.soRelLine.shippingContactPersonID ? _.find(vm.ContactPersonList, (item) => item.personId === vm.soRelLine.shippingContactPersonID) : null;
            vm.soRelLine.shippingMethodText = vm.ShippingTypeList && vm.soRelLine.shippingMethodID ? _.find(vm.ShippingTypeList, (item) => item.gencCategoryID === vm.soRelLine.shippingMethodID).gencCategoryName : '';
            vm.soRelLine.carrierText = vm.CarrierList && vm.soRelLine.carrierID ? _.find(vm.CarrierList, (item) => item.gencCategoryID === vm.soRelLine.carrierID).gencCategoryName : '';
            vm.soRelLine.shipToOtherDet = {
              showAddressEmptyState: vm.ShippingAddressEmptyState,
              mfgType: CORE.MFG_TYPE.CUSTOMER,
              customerId: vm.popupParamData.customerID,
              addressType: 'S',
              addressBlockTitle: vm.LabelConstant.COMMON.ShippingAddress,
              companyName: vm.popupParamData.customerName,
              companyNameWithCode: vm.popupParamData.customerName,
              refTransID: vm.popupParamData.customerID,
              refTableName: CORE.TABLE_NAME.MFG_CODE_MST
            };
            vm.soRelLine.shippingContactPersonOtherDet = {
              customerId: vm.popupParamData.customerID,
              refTransID: vm.popupParamData.customerID,
              refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
              alreadySelectedPersonId: (vm.soRelLine.shppingContactPesonObj && vm.soRelLine.shppingContactPesonObj.personId) || null,
              showContPersonEmptyState: vm.ContactPersonEmptyState,
              companyName: vm.popupParamData.companyName,
              selectedContactPerson: vm.soRelLine.shppingContactPesonObj || null,
              mfgType: CORE.MFG_TYPE.CUSTOMER
            };
            if (vm.selectedShippingDetails === vm.radioGrpShippingSelection[2].id) {
              vm.selectedDetail = angular.copy(vm.soRelLine);
              vm.autoCompleteShipping.keyColumnId = vm.selectedDetail.shippingMethodID;
              vm.autoCompleteCarrier.keyColumnId = vm.selectedDetail.carrierID;
            }
          }
          return res.data;
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        return false;
      }
    };

    const getCustomerPackingSlipDetail = () => {
      vm.cpsDetail.shippingAddressObj = vm.popupParamData.cpsShipToId ? _.find(vm.ShippingAddressList, (item) => item.id === vm.popupParamData.cpsShipToId) : null;
      vm.cpsDetail.shipToId = vm.popupParamData.cpsShipToId;
      vm.cpsDetail.shippingContactPersonObj = vm.popupParamData.cpsShipContactPersonId ? _.find(vm.ContactPersonList, (item) => item.personId === vm.popupParamData.cpsShipContactPersonId) : null;
      vm.cpsDetail.shippingContactPersonID = vm.popupParamData.cpsShipContactPersonId;
      vm.cpsDetail.shippingMethodID = vm.popupParamData.cpsShippingMethodId;
      vm.cpsDetail.shippingMethodText = vm.ShippingTypeList && vm.popupParamData.cpsShippingMethodId ? _.find(vm.ShippingTypeList, (item) => item.gencCategoryID === vm.popupParamData.cpsShippingMethodId).gencCategoryName : '';
      vm.cpsDetail.carrierID = vm.popupParamData.cpsCarrierId;
      vm.cpsDetail.carrierText = vm.CarrierList && vm.popupParamData.cpsCarrierId ? _.find(vm.CarrierList, (item) => item.gencCategoryID === vm.popupParamData.cpsCarrierId).gencCategoryName : '';
      vm.cpsDetail.carrierAccountNumber = vm.popupParamData.cpsCarrierAccountNumber;
      vm.cpsDetail.shipToOtherDet = {
        showAddressEmptyState: vm.ShippingAddressEmptyState,
        mfgType: CORE.MFG_TYPE.CUSTOMER,
        customerId: vm.popupParamData.customerID,
        addressType: 'S',
        addressBlockTitle: vm.LabelConstant.COMMON.ShippingAddress,
        companyName: vm.popupParamData.customerName,
        companyNameWithCode: vm.popupParamData.customerName,
        refTransID: vm.popupParamData.customerID,
        refTableName: CORE.TABLE_NAME.MFG_CODE_MST
      };
      vm.cpsDetail.shippingContactPersonOtherDet = {
        customerId: vm.popupParamData.customerID,
        refTransID: vm.popupParamData.customerID,
        refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
        alreadySelectedPersonId: (vm.cpsDetail.shppingContactPesonObj && vm.cpsDetail.shppingContactPesonObj.personId) || null,
        showContPersonEmptyState: vm.ContactPersonEmptyState,
        companyName: vm.popupParamData.companyName,
        selectedContactPerson: vm.cpsDetail.shppingContactPesonObj,
        mfgType: CORE.MFG_TYPE.CUSTOMER
      };
      if (vm.selectedShippingDetails === vm.radioGrpShippingSelection[1].id) {
        vm.selectedDetail = angular.copy(vm.cpsDetail);
        vm.autoCompleteShipping.keyColumnId = vm.selectedDetail.shippingMethodID;
        vm.autoCompleteCarrier.keyColumnId = vm.selectedDetail.carrierID;
      }
    };

    // initial  on page load
    const init = () => {
      let masterPromise = [];
      initAutoComplete();
      masterPromise.push(getGenericCategoryList(vm.categoryTypeObjList.ShippingType.Name));
      masterPromise.push(getGenericCategoryList(vm.categoryTypeObjList.Carriers.Name));
      masterPromise.push(getCustomerAddress());
      masterPromise.push(getCustomerContactPersonList());
      vm.cgBusyLoading = $q.all(masterPromise).then(() => {
        masterPromise = [getCustomerSalesOrderDetail(), getPendingReleaseLine(), getCustomerPackingSlipDetail()];
        vm.cgBusyLoading = $q.all(masterPromise).then(() => {
          setMismatchDetails();
        }).catch((error) => BaseService.getErrorLog(error));
      }).catch((error) => BaseService.getErrorLog(error));
      // Static code to enable save button
      //vm.customerBillingAddressForm.$$controls[0].$setDirty();
    };
    init();

    const setMismatchDetails = () => {
      let messageText = '';
      if (vm.soMst && vm.soRelLine && vm.cpsDetail) {
        if (vm.soRelLine.shippingAddressID !== vm.cpsDetail.shipToId) {
          vm.mismatchShipTo = true;
          messageText = stringFormat('{0} {1}', messageText, 'Shipping Address');
        }
        if (vm.soRelLine.shippingContactPersonID !== vm.cpsDetail.shippingContactPersonID) {
          vm.mismatchContactPerson = true;
          if (messageText) {
            messageText = stringFormat('{0} {1}', messageText, ' / ');
          }
          messageText = stringFormat('{0} {1}', messageText, 'Contact Person');
        }
        if (vm.soRelLine.shippingMethodID !== vm.cpsDetail.shippingMethodID) {
          vm.mismatchShippingMethod = true;
          if (messageText) {
            messageText = stringFormat('{0} {1}', messageText, ' / ');
          }
          messageText = stringFormat('{0} {1}', messageText, 'Shipping Method');
        }
        if (vm.soRelLine.carrierID !== vm.cpsDetail.carrierID) {
          vm.mismatchCarrier = true;
          if (messageText) {
            messageText = stringFormat('{0} {1}', messageText, ' / ');
          }
          messageText = stringFormat('{0} {1}', messageText, 'Carrier');
        }
        if (vm.soRelLine.carrierAccountNumber !== vm.cpsDetail.carrierAccountNumber) {
          vm.mismatchCarrierAccNumber = true;
          if (messageText) {
            messageText = stringFormat('{0} {1}', messageText, ' / ');
          }
          messageText = stringFormat('{0} {1}', messageText, 'Carrier Account#');
        }
        vm.confirmationMsgOnShipAddrMismatch = stringFormat(vm.confirmationMsgOnShipAddrMismatch, messageText);
      }
    };

    // open select Addresses popup
    vm.selectAddressCallBack = (ev, callBackAddress) => {
      if (callBackAddress) {
        getCustomerContactPersonList();
        getCustomerAddress();
        if (callBackAddress.addressType === CORE.AddressType.ShippingAddress) {
          vm.selectedDetail.shippingAddressObj = callBackAddress;
          vm.selectedDetail.shippingAddressID = callBackAddress.id;
          vm.selectedDetail.shippingContactPersonObj = callBackAddress.contactPerson;
          vm.selectedDetail.shippingContactPersonID = callBackAddress.contactPerson ? callBackAddress.contactPerson.personId : null;
          vm.selectedDetail.shipToOtherDet.alreadySelectedAddressID = callBackAddress.id;
          vm.selectedDetail.shipToOtherDet.alreadySelectedPersonId = callBackAddress.contactPerson ? callBackAddress.contactPerson.personId : null;
          if (vm.selectedDetail.shippingAddressObj.shippingMethodId || vm.selectedDetail.shippingAddressObj.carrierID) {
            commonShippingMethodConfirm(true);
          }
        }
      }
      setFocus('apply');
    };

    // open addEdit Addresses popup
    vm.addEditAddressCallBack = (ev, callBackAddress) => {
      if (callBackAddress) {
        if (callBackAddress.addressType === CORE.AddressType.ShippingAddress) {
          vm.selectedDetail.shippingAddressObj = callBackAddress;
          vm.selectedDetail.shippingAddressID = callBackAddress.id;
          vm.selectedDetail.shippingContactPersonObj = callBackAddress.contactPerson;
          vm.selectedDetail.shippingContactPersonID = callBackAddress.contactPerson ? callBackAddress.contactPerson.personId : null;
          vm.selectedDetail.shipToOtherDet.alreadySelectedAddressID = callBackAddress.id;
          vm.selectedDetail.shipToOtherDet.alreadySelectedPersonId = callBackAddress.contactPerson ? callBackAddress.contactPerson.personId : null;
          commonShippingMethodConfirm(true);
        }
        getCustomerContactPersonList();
        getCustomerAddress();
      }
    };

    // open select contact person  list
    vm.selectContactPersonCallBack = (ev, contactpersondetail) => {
      if (contactpersondetail) {
        const CustomerContactPersonPromise = [getCustomerContactPersonList()];
        vm.cgBusyLoading = $q.all(CustomerContactPersonPromise).then(() => {
          vm.selectedDetail.shippingContactPersonObj = contactpersondetail;
          vm.selectedDetail.shippingContactPersonID = contactpersondetail ? contactpersondetail.personId : null;
          vm.selectedDetail.shippingContactPersonOtherDet.alreadySelectedPersonId = vm.selectedDetail.shippingContactPersonID;
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    //add/ edit contact person details
    vm.addEditPersonCallBack = (ev, personDetils) => {
      if (personDetils) {
        const CustomerContactPersonPromise = [getCustomerContactPersonList()];
        vm.cgBusyLoading = $q.all(CustomerContactPersonPromise).then(() => {
          vm.selectedDetail.shippingContactPersonObj = personDetils;
          vm.selectedDetail.shippingContactPersonID = personDetils ? personDetils.personId : null;
          vm.selectedDetail.shippingContactPersonOtherDet.alreadySelectedPersonId = vm.selectedDetail.shippingContactPersonID;
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    // common confirmation detail
    const commonShippingMethodConfirm = (askConfirmation) => {
      if (askConfirmation) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SHIPPING_ADDR_CONFIRM_ALERT);
        messageContent.message = stringFormat(messageContent.message, 'Packing Slip');
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.autoCompleteCarrier.keyColumnId = vm.selectedDetail.shippingAddressObj ? (vm.selectedDetail.shippingAddressObj.carrierID || vm.autoCompleteCarrier.keyColumnId) : (vm.autoCompleteCarrier.keyColumnId || null);
            vm.autoCompleteShipping.keyColumnId = vm.selectedDetail.shippingAddressObj ? (vm.selectedDetail.shippingAddressObj.shippingMethodID || vm.autoCompleteShipping.keyColumnId) : (vm.autoCompleteShipping.keyColumnId || null);
          }
        }, () => {
        });
      } else {
        vm.autoCompleteCarrier.keyColumnId = vm.selectedDetail.shippingAddressObj ? (vm.selectedDetail.shippingAddressObj.carrierID || vm.autoCompleteCarrier.keyColumnId) : (vm.autoCompleteCarrier.keyColumnId || null);
        vm.autoCompleteShipping.keyColumnId = vm.selectedDetail.shippingAddressObj ? (vm.selectedDetail.shippingAddressObj.shippingMethodID || vm.autoCompleteShipping.keyColumnId) : (vm.autoCompleteShipping.keyColumnId || null);
      }
    };

    vm.selectedDetailChanged = () => {
      vm.isShippingChangedManually = false;
      vm.disableManualSelection = true;
      if (vm.selectedShippingDetails === 1) {
        vm.selectedDetail = angular.copy(vm.soMst);
        vm.autoCompleteShipping.keyColumnId = vm.selectedDetail.shippingMethodID;
        vm.autoCompleteCarrier.keyColumnId = vm.selectedDetail.carrierID;
        disableAddrContactActionButton(true);
      } else if (vm.selectedShippingDetails === 2) {
        vm.selectedDetail = angular.copy(vm.soRelLine);
        vm.autoCompleteShipping.keyColumnId = vm.selectedDetail.shippingMethodID;
        vm.autoCompleteCarrier.keyColumnId = vm.selectedDetail.carrierID;
        disableAddrContactActionButton(true);
      } else if (vm.selectedShippingDetails === 3) {
        vm.selectedDetail = angular.copy(vm.cpsDetail);
        vm.selectedDetail.shippingAddressID = vm.cpsDetail.shipToId;
        vm.autoCompleteShipping.keyColumnId = vm.selectedDetail.shippingMethodID;
        vm.autoCompleteCarrier.keyColumnId = vm.selectedDetail.carrierID;
        disableAddrContactActionButton(true);
      } else {
        vm.disableManualSelection = false;
        disableAddrContactActionButton(false);
      }
    };

    //go to customer Shipping address list page
    vm.goToCustShippingAddressList = () => BaseService.goToCustomerShippingAddressList(CORE.CUSTOMER_TYPE.CUSTOMER, vm.popupParamData.customerID);

    //go to Shipping Method - generic category list page
    vm.goToShippingMethodList = () => BaseService.goToGenericCategoryShippingTypeList();

    // go to sales order list
    vm.goToSalesOrderList = () => BaseService.goToSalesOrderList();

    // go to manage sales order page
    vm.goToManageSalesOrder = () => BaseService.goToManageSalesOrder(vm.popupParamData.refSalesOrderID);

    /** Redirect to part master page */
    vm.goToMFGPartList = () => BaseService.openInNew(USER.ADMIN_MFG_COMPONENT_STATE, {});

    // go with packing slip address (when PO line level address mismatch with packing slip address)
    //vm.goWithPackingSlipAddr = () => {
    //  $mdDialog.hide(false);
    //};

    // go to carrier list page
    vm.goTocarrierList = () => BaseService.goToGenericCategoryCarrierList();

    // go to customer packing slip list
    vm.goToCustomerPackingSlipList = () => BaseService.goToCustomerInvoicePackingSlipList();

    vm.cancel = () => {
      const data = {
        form: vm.customerBillingAddressForm
      };
      BaseService.showWithoutSavingAlertForPopUp(data);
      //$mdDialog.cancel();
    };
    // popup form validation
    angular.element(() => {
      vm.customerBillingAddressForm.$$controls[0].$setDirty();
      BaseService.currentPagePopupForm.push(vm.customerBillingAddressForm);
    });
  }
})();
