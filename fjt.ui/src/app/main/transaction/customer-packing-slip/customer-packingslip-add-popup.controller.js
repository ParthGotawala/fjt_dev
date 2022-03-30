(function () {
  'use strict';
  angular
    .module('app.transaction.customerpacking')
    .controller('AddCustomerPackingSlipPopupController', AddCustomerPackingSlipPopupController);

  /** @ngInject */
  function AddCustomerPackingSlipPopupController($mdDialog, $scope, CORE, USER, BaseService, data, CustomerPackingSlipFactory,
    SalesOrderFactory, $timeout, GenericCategoryFactory, CustomerFactory, DialogFactory, RFQTRANSACTION, TRANSACTION, $q, WorkorderFactory) {
    const vm = this;
    vm.LabelConstant = CORE.LabelConstant;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.maxLengthForDescription = _maxLengthForDescription;
    vm.isWithSODetail = data ? data.isWithSODetail : false;
    vm.PackingSlipHeader = data ? angular.copy(data.soHeaderData) : {};
    vm.PackingSlipHeaderCopy = data ? angular.copy(data.soHeaderData) : {};
    vm.soDetailId = data ? angular.copy(data.soDetailId) : null;
    vm.soReleaseId = data ? angular.copy(data.soReleaseId) : null;
    vm.isOtherComponent = data ? angular.copy(data.isOtherComponent) : false;
    vm.releaseDetailLength = data ? angular.copy(data.releaseDetailLength) : 0;
    vm.checkSumAndColor = data ? angular.copy(data.checkRelSumAndColor) : false;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.headerData = [];
    vm.categoryTypeObjList = angular.copy(CORE.CategoryType);
    vm.partCategoryConst = angular.copy(CORE.PartCategory);
    if (vm.PackingSlipHeader) {
      vm.PackingSlipHeader.cpsDate = new Date();
    }
    vm.pendingReleaseLineList = [];

    vm.shipToActionBtn = angular.copy(CORE.CustAddressViewActionBtn);
    vm.shipToContactActionBtn = angular.copy(CORE.CustAddressViewActionBtn);
    vm.intermediateToActionBtn = angular.copy(CORE.CustAddressViewActionBtn);
    vm.intermediateToContactActionBtn = angular.copy(CORE.ContactPersonViewActionBtn);

    vm.shipToActionBtn.SetDefault.isVisible = false;
    vm.shipToActionBtn.Delete.isVisible = false;
    vm.intermediateToActionBtn.SetDefault.isVisible = false;
    vm.intermediateToActionBtn.Delete.isVisible = true;


    vm.shipToOtherDet = {
      showAddressEmptyState: false,
      showContPersonEmptyState: false,
      mfgType: CORE.MFG_TYPE.CUSTOMER,
      customerId: vm.PackingSlipHeader.customerID,
      addressType: 'S',
      addressBlockTitle: vm.LabelConstant.Address.ShippingAddress,
      companyName: vm.PackingSlipHeader.customerName,
      companyNameWithCode: vm.PackingSlipHeader.customerName,
      refTransID: vm.PackingSlipHeader.customerID,
      refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
      alreadySelectedPersonId: vm.PackingSlipHeader.shippingContactPersonID
    };
    vm.intermediateToOtherDet = {
      showAddressEmptyState: false,
      showContPersonEmptyState: false,
      mfgType: CORE.MFG_TYPE.CUSTOMER,
      customerId: vm.PackingSlipHeader.customerID,
      addressType: CORE.AddressType.IntermediateAddress,
      addressBlockTitle: vm.LabelConstant.Address.MarkForAddress,
      companyNameWithCode: vm.PackingSlipHeader.customerName,
      companyName: vm.PackingSlipHeader.customerName,
      refTransID: vm.PackingSlipHeader.customerID,
      refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
      alreadySelectedPersonId: vm.PackingSlipHeader.intermediateContactPersonID
    };

    // initial  auto complete
    const initAutoComplete = () => {
      // Auto Complete Sales order
      vm.autoCompleteSO = {
        columnName: 'salesOrderNumber',
        keyColumnName: 'soId',
        keyColumnId: (vm.PackingSlipHeader && vm.PackingSlipHeader.soId) ? vm.PackingSlipHeader.soId : null,
        inputName: 'SearchPO',
        placeholderName: 'Type here to search SO#',
        isRequired: false,
        isAddnew: false,
        isUppercaseSearchText: true,
        searchText: '',
        onSearchFn: (query) => getCustomerSalesOrderDetail(query)
      };
      // Auto Complete Payment Term
      vm.autoCompleteTerm = {
        columnName: 'gencCategoryName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: null,
        inputName: vm.categoryTypeObjList.Terms.Name,
        placeholderName: vm.categoryTypeObjList.Terms.Title,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_TERMS_MANAGEGENERICCATEGORY_STATE],
          pageNameAccessLabel: CORE.PageName.paymentTerm,
          headerTitle: vm.categoryTypeObjList.Terms.Title
        },
        isRequired: true,
        isAddnew: true,
        callbackFn: () => getGenericCategoryList(vm.categoryTypeObjList.Terms.Name),
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.PackingSlipHeader.termsID = item.gencCategoryID;
          }
        }
      };
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
            vm.PackingSlipHeader.shippingMethodID = item.gencCategoryID;
          }
          if (item && vm.autoCompleteCarrier && (vm.PackingSlipHeader.shippingMethodId !== item.gencCategoryID || vm.autoCompleteShipping.shippingMethodId !== item.gencCategoryID)) {
            if (vm.PackingSlipHeader.shippingMethodId && vm.PackingSlipHeader.shippingMethodId !== item.gencCategoryID) {
              const model = {
                messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.UPDATE_SHIPPING_METHOD_CONFIRMATION),
                btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
              };
              DialogFactory.messageConfirmDialog(model).then(() => {
                vm.autoCompleteCarrier.keyColumnId = item.carrierID;
                vm.PackingSlipHeader.carrierAccountNumber = null;
              }, () => {
                vm.autoCompleteShipping.keyColumnId = vm.PackingSlipHeader.shippingMethodId;
                vm.autoCompleteCarrier.keyColumnId = vm.PackingSlipHeader.carrierID;
                vm.PackingSlipHeader.carrierAccountNumber = vm.PackingSlipHeaderCopy.carrierAccountNumber;
              });
            } else {
              vm.autoCompleteCarrier.keyColumnId = item.carrierID;
            }
          } else if (!item) {
            vm.PackingSlipHeader.carrierAccountNumber = null;
            vm.autoCompleteCarrier.keyColumnId = null;
          }
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
            vm.PackingSlipHeader.carrierID = item.gencCategoryID;
          }
        }
      };
    };

    // Get Sales order list auto complete
    const getCustomerSalesOrderDetail = (searchText) => {
      const searchObj = {
        custID: vm.PackingSlipHeader.customerID,
        orgSOId: vm.PackingSlipHeader && vm.PackingSlipHeader.soId ? vm.PackingSlipHeader.soId : null,
        searchPO: searchText ? searchText : null
      };
      return SalesOrderFactory.getCustomerSalesOrderDetail().query(searchObj).$promise.then((res) => {
        if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          $timeout(() => {
            if (vm.autoCompleteSO && vm.autoCompleteSO.inputName) {
              $scope.$broadcast(vm.autoCompleteSO.inputName, res.data.soList[0]);
            }
          });
          return res.data.soList;
        } else {
          return false;
        }
      }).catch((error) => BaseService.getErrorLog(error));
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
          if (genCatType === vm.categoryTypeObjList.Terms.Name) {
            vm.TermsList = respGen.data;
            if (vm.autoCompleteTerm) {
              vm.autoCompleteTerm.keyColumnId = vm.PackingSlipHeader.termsID;
            }
          } else if (genCatType === vm.categoryTypeObjList.Carriers.Name) {
            vm.CarrierList = respGen.data;
            if (vm.autoCompleteCarrier) {
              vm.autoCompleteCarrier.keyColumnId = vm.PackingSlipHeader.carrierID;
            }
          } else {
            vm.ShippingTypeList = respGen.data;
            if (vm.autoCompleteShipping) {
              vm.autoCompleteShipping.keyColumnId = vm.PackingSlipHeader.shippingMethodID;
            }
          }
          return $q.resolve(respGen.data);
        } else {
          return $q.resolve(false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // get release line details to be added
    vm.getPendingReleaseLine = () => {
      if (vm.soDetailId) {
        return CustomerPackingSlipFactory.getPendingSalesShippingDetails().query({ salesorderID: vm.soDetailId, packingSlipID: null, packingslipDetID: null, soReleaseID: vm.soReleaseId || null }).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            vm.pendingReleaseLineList = _.clone(res.data ? res.data.shippingsalesorderList : []);
            _.each(vm.pendingReleaseLineList, (item) => {
              item.openPOQty = item.poQty - (item.lineTotShippedQty || 0);
              item.openPOQty = item.openPOQty < 0 ? 0 : item.openPOQty;
              item.openRelQty = item.qty - (item.shippedQty || 0);
              item.openRelQty = item.openRelQty < 0 ? 0 : item.openRelQty;
              item.isAssembly = (item.partType === CORE.PartType.SubAssembly) ? true : false;
              item.isOtherComponent = (item.partType === CORE.PartType.Other) ? true : false;
            });
          }
          return vm.pendingReleaseLineList;
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        return false;
      }
    };

    //get pending shipping list for other charges
    const getShippingListForOtherCharges = () => CustomerPackingSlipFactory.getSOPendingShippingListForOtherCharges().query({
      salesOrderID: vm.PackingSlipHeader.soId
    }).$promise.then((res) => {
      if (res && res.data) {
        vm.pendingReleaseLineList = _.filter(res.data, (item) => item.sDetId === vm.soDetailId);
        return vm.pendingReleaseLineList;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    const getCustomerAddress = () => CustomerFactory.customerAddressList().query({
      customerId: vm.PackingSlipHeader.customerID,
      addressType: [CORE.AddressType.ShippingAddress, CORE.AddressType.BillingAddress, CORE.AddressType.IntermediateAddress],
      refTableName: CORE.TABLE_NAME.MFG_CODE_MST
    }).$promise.then((customeraddress) => {
      if (customeraddress.data) {
        vm.ContactAddress = customeraddress.data;
        vm.ShippingAddressList = _.filter(vm.ContactAddress, (item) => item.addressType === 'S');
        vm.BillingAddressList = _.filter(vm.ContactAddress, (item) => item.addressType === 'B');
        vm.intermediateAddressList = _.filter(vm.ContactAddress, (item) => item.addressType === CORE.AddressType.IntermediateAddress);
        if ((!vm.ShippingAddressList) || (vm.ShippingAddressList && vm.ShippingAddressList.length === 0)) {
          vm.shipToOtherDet.showAddressEmptyState = true;
        } else {
          vm.shipToOtherDet.showAddressEmptyState = false;
        }
        if ((!vm.intermediateAddressList) || (vm.intermediateAddressList && vm.intermediateAddressList.length === 0)) {
          vm.intermediateToOtherDet.showAddressEmptyState = true;
        } else {
          vm.intermediateToOtherDet.showAddressEmptyState = false;
        }
      } else {
        vm.shipToOtherDet.showAddressEmptyState = true;
        vm.intermediateToOtherDet.showAddressEmptyState = true;
      }
      return $q.resolve(vm.ContactAddress);
    }).catch((error) => BaseService.getErrorLog(error));

    const getCustomerContactPersonList = () => CustomerFactory.getCustomerContactPersons().query({
      refTransID: vm.PackingSlipHeader.customerID,
      refTableName: CORE.TABLE_NAME.MFG_CODE_MST
    }).$promise.then((contactperson) => {
      if (contactperson && contactperson.data) {
        vm.ContactPersonList = contactperson.data;
        if (vm.ContactPersonList && vm.ContactPersonList.length > 0) {
          vm.shipToOtherDet.showContPersonEmptyState = false;
          vm.intermediateToOtherDet.showContPersonEmptyState = false;
        } else {
          vm.shipToOtherDet.showContPersonEmptyState = true;
          vm.intermediateToOtherDet.showContPersonEmptyState = true;
        }
        return $q.resolve(vm.ContactPersonList);
      }
    }).catch((error) => BaseService.getErrorLog(error));

    const setAddressDetailForCPS = () => {
      // billing address
      vm.BillingAddress = _.find(vm.BillingAddressList, (item) => item.id === vm.PackingSlipHeader.billingAddressID);
      vm.PackingSlipHeader.billingAddressObj = vm.BillingAddress;
      vm.PackingSlipHeader.billingContactPersonObj = _.find(vm.ContactPersonList, (item) => item.personId === vm.PackingSlipHeader.billingContactPersonID);

      // shipping address
      vm.ShippingAddress = _.find(vm.ShippingAddressList, (item) => item.id === vm.PackingSlipHeader.shippingAddressID);
      vm.PackingSlipHeader.shippingAddressObj = vm.ShippingAddress;

      vm.PackingSlipHeader.shippingContactPersonObj = _.find(vm.ContactPersonList, (item) => item.personId === vm.PackingSlipHeader.shippingContactPersonID);
      vm.PackingSlipHeader.shippingContactPersonId = vm.PackingSlipHeader.shippingContactPersonObj ? vm.PackingSlipHeader.shippingContactPersonObj.personId : null;

      // intermediate address
      if (vm.ShippingAddress) {
        vm.IntermediateAddress = _.find(vm.intermediateAddressList, (item) => item.id === vm.ShippingAddress.defaultIntermediateAddressID);
        vm.PackingSlipHeader.intermediateAddressObj = vm.IntermediateAddress || null;

        vm.PackingSlipHeader.intermediateContactPersonObj = _.find(vm.ContactPersonList, (item) => item.personId === vm.ShippingAddress.defaultIntermediateContactPersonID);
        vm.PackingSlipHeader.intermediateContactPersonID = vm.PackingSlipHeader.intermediateContactPersonObj ? vm.PackingSlipHeader.intermediateContactPersonObj.personId : null;
      }

      if (vm.pendingReleaseLineList && vm.pendingReleaseLineList.length > 0) {
        if (vm.pendingReleaseLineList[0].shippingAddressID) {
          vm.ShippingAddress = _.find(vm.ShippingAddressList, (item) => item.id === vm.pendingReleaseLineList[0].shippingAddressID);
          vm.PackingSlipHeader.shippingAddressObj = vm.ShippingAddress;
          vm.PackingSlipHeader.shippingAddressID = vm.pendingReleaseLineList[0].shippingAddressID;
        }
        if (vm.pendingReleaseLineList[0].shippingContactPersonID) {
          vm.PackingSlipHeader.shippingContactPersonObj = _.find(vm.ContactPersonList, (item) => item.personId === vm.pendingReleaseLineList[0].shippingContactPersonID);
          vm.PackingSlipHeader.shippingContactPersonId = vm.PackingSlipHeader.shippingContactPersonObj ? vm.PackingSlipHeader.shippingContactPersonObj.personId : null;
        }
        if (vm.autoCompleteShipping && vm.autoCompleteCarrier) {
          vm.autoCompleteShipping.keyColumnId = vm.pendingReleaseLineList[0].shippingMethodID ? vm.pendingReleaseLineList[0].shippingMethodID : vm.PackingSlipHeader.shippingMethodID;
          vm.autoCompleteCarrier.keyColumnId = vm.pendingReleaseLineList[0].carrierID ? vm.pendingReleaseLineList[0].carrierID : vm.PackingSlipHeader.carrierID;
          vm.PackingSlipHeader.carrierAccountNumber = vm.pendingReleaseLineList[0].carrierAccountNumber ? vm.pendingReleaseLineList[0].carrierAccountNumber : vm.PackingSlipHeader.carrierAccountNumber;
        }
      }/* else {
        vm.ShippingAddress = _.find(vm.ShippingAddressList, (item) => item.id === vm.PackingSlipHeader.shippingAddressID);
        vm.PackingSlipHeader.shippingAddressObj = vm.ShippingAddress;

        vm.PackingSlipHeader.shippingContactPersonObj = _.find(vm.ContactPersonList, (item) => item.personId === vm.PackingSlipHeader.shippingContactPersonID);
        vm.PackingSlipHeader.shippingContactPersonId = vm.PackingSlipHeader.shippingContactPersonObj.personId;
      }*/
    };

    // initial  on page load
    const init = () => {
      const masterPromise = [];
      initAutoComplete();
      masterPromise.push(getGenericCategoryList(vm.categoryTypeObjList.ShippingType.Name));
      masterPromise.push(getGenericCategoryList(vm.categoryTypeObjList.Terms.Name));
      masterPromise.push(getGenericCategoryList(vm.categoryTypeObjList.Carriers.Name));
      masterPromise.push(getCustomerAddress());
      masterPromise.push(getCustomerContactPersonList());
      masterPromise.push(getCustomerSalesOrderDetail());
      if (!vm.isOtherComponent) {
        masterPromise.push(vm.getPendingReleaseLine());
      } else {
        masterPromise.push(getShippingListForOtherCharges());
      }
      vm.cgBusyLoading = $q.all(masterPromise).then(() => {
        // initAutoComplete();
        setAddressDetailForCPS();
      });
    };
    init();


    //go to customer list
    vm.goToCustomerList = () => BaseService.goToCustomerList();

    //go to customer manage page
    vm.goToCustomerManage = () => BaseService.goToCustomer(vm.PackingSlipHeader.customerID);

    //go to sales order
    vm.goToSalesorder = () => BaseService.goToSalesOrderList();

    // go to manage sales order page
    vm.goToManageSalesOrder = () => BaseService.goToManageSalesOrder(vm.PackingSlipHeader.soId);

    //go to Shipping Method - generic category list page
    vm.goToShippingMethodList = () => BaseService.goToGenericCategoryShippingTypeList();

    //go to Carrier - generic category list page
    vm.goToCarrierList = () => BaseService.goToGenericCategoryCarrierList();

    // go to payment terms list
    vm.goToPaymentTermList = () => BaseService.goToGenericCategoryTermsList();

    // go to manufacturer detail page
    vm.goToManufacturerDetail = (id) => BaseService.goToManufacturer(id);

    // add header data
    if (vm.PackingSlipHeader && vm.PackingSlipHeader.customerID) {
      vm.headerData.push({
        label: vm.LabelConstant.Customer.Customer,
        value: vm.PackingSlipHeader.customerName,
        displayOrder: 1,
        labelLinkFn: vm.goToCustomerList,
        valueLinkFn: vm.goToCustomerManage,
        valueLinkFnParams: null
      });
      vm.headerData.push({
        label: vm.LabelConstant.SalesOrder.SO,
        value: vm.PackingSlipHeader.salesOrderNumber,
        displayOrder: 2,
        labelLinkFn: vm.goToSalesorder,
        valueLinkFn: vm.goToManageSalesOrder,
        valueLinkFnParams: null,
        isCopy: true
      });
    }


    // check bill of material added for sales order assembly or not
    const validateAssemblyByAssyID = () => {
      const checkShippingAssyList = [];
      const dataArray = [];
      _.each(vm.pendingReleaseLineList, (item) => {
        const shippingCountryDetObj = {};
        if (vm.PackingSlipHeader.intermediateAddressObj) {
          shippingCountryDetObj.countryID = vm.PackingSlipHeader.intermediateAddressObj.countryID;
          shippingCountryDetObj.countryName = vm.PackingSlipHeader.intermediateAddressObj.countryMst ? vm.PackingSlipHeader.intermediateAddressObj.countryMst.countryName : '';
        } else {
          shippingCountryDetObj.countryID = vm.PackingSlipHeader.shippingAddressObj.countryID;
          shippingCountryDetObj.countryName = vm.PackingSlipHeader.shippingAddressObj.countryMst ? vm.PackingSlipHeader.shippingAddressObj.countryMst.countryName : '';
        }
        shippingCountryDetObj.partID = item.partID;
        shippingCountryDetObj.qty = item.openRelQty || item.openPOQty;
        shippingCountryDetObj.lineID = 0;
        checkShippingAssyList.push(shippingCountryDetObj);
        dataArray.push(item.partID);
      });

      const objCheckBOM = {
        partIDs: dataArray,
        shippingAddressID: vm.PackingSlipHeader.intermediateAddressObj ? vm.PackingSlipHeader.intermediateAddressObj.id : (vm.PackingSlipHeader.shippingAddressObj ? vm.PackingSlipHeader.shippingAddressObj.id : null),
        isFromSalesOrder: true,
        checkShippingAssyList: checkShippingAssyList,
        transType: 'P'
      };
      return WorkorderFactory.validateAssemblyByAssyID().update({ obj: objCheckBOM }).$promise.then((response) => {
        if (response && response.data) {
          return response.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // validate packing slip and update
    vm.validateAndSavePackingSlip = () => {
      if (!vm.PackingSlipHeader.shippingAddressID) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ADDRESS_CONTACT_PERSON_REQUIRED_FOR_STATUS);
        messageContent.message = stringFormat(messageContent.message, 'ShipTo Address');
        const obj = {
          multiple: true,
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(obj);
        return;
      } else if (vm.soDetailId) {
        const bomPromise = [validateAssemblyByAssyID()];
        vm.cgBusyLoading = $q.all(bomPromise).then((resData) => {
          resData = _.first(resData);
          if (resData.errorObjList && resData.errorObjList.length > 0) {
            const errorMessage = _.map(resData.errorObjList, (obj) => { if (obj.isAlert) { return obj.errorText; } }).join('<br/>');
            if (errorMessage) {
              const obj = {
                multiple: true,
                title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
                textContent: errorMessage
              };
              DialogFactory.alertDialog(obj);
              return;
            }
            const errorMsg = _.find(resData.errorObjList, (obj) => obj.isMessage && obj.isShippingAddressError);
            if (errorMsg) {
              const assyInvalidShippingList = [];
              _.each(resData.exportControlPartList, (partItem) => {
                let objAssy = {};
                objAssy = _.assign(partItem);
                const assyDets = _.find(vm.pendingReleaseLineList, (soDet) => soDet.partID === partItem.partID);
                if (assyDets) {
                  objAssy.PIDCode = assyDets.pidcode;
                  objAssy.partID = assyDets.partID;
                  objAssy.rohsIcon = stringFormat('{0}{1}', vm.rohsImagePath, assyDets.rohsIcon);
                  objAssy.rohsText = assyDets.rohsName;
                  objAssy.mfgPN = vm.isOtherComponent ? assyDets.mfgPN : assyDets.mfgpn;
                  objAssy.nickName = assyDets.nickName;
                  objAssy.description = assyDets.assyDescription;
                  objAssy.isCustom = assyDets.iscustom;
                  objAssy.custAssyPN = assyDets.custAssyPN;
                  if (assyDets.partType === vm.partCategoryConst.Component) {
                    if (objAssy.isCustom) {
                      objAssy.partTypeText = 'Custom Part';
                    } else {
                      objAssy.partTypeText = 'Off-the-shelf Part';
                    }
                  }
                  if (assyDets.isCPN) {
                    objAssy.partTypeText = 'CPN Part';
                  }
                  if (assyDets.partType === vm.partCategoryConst.SubAssembly) {
                    objAssy.partTypeText = 'Assembly';
                  }
                  objAssy.componentStandardList = assyDets.standards;
                }
                assyInvalidShippingList.push(objAssy);
              });
              if (assyInvalidShippingList.length > 0) {
                const data = {
                  assyList: assyInvalidShippingList,
                  errorMessage: errorMsg.errorText,
                  salesOrderNumber: vm.PackingSlipHeader.salesOrderNumber,
                  revision: vm.PackingSlipHeader.sorevision,
                  //countryName: vm.IntermediateAddress && vm.IntermediateAddress.countryMst && vm.IntermediateAddress.countryMst.countryName ? vm.IntermediateAddress.countryMst.countryName : vm.ShippingAddress.countryMst.countryName,
                  salesOrderID: vm.PackingSlipHeader.soId,
                  iscustompacking: true,
                  transType: 'P'
                };
                if (vm.PackingSlipHeader.intermediateAddressObj) {
                  data.countryName = vm.PackingSlipHeader.intermediateAddressObj.countryName;
                } else {
                  data.countryName = vm.PackingSlipHeader.shippingAddressObj.countryName;
                }
                DialogFactory.dialogService(
                  CORE.VIEW_EXPORT_CONTROL_ASSY_LIST_MODAL_CONTROLLER,
                  CORE.VIEW_EXPORT_CONTROL_ASSY_LIST_MODAL_VIEW,
                  event,
                  data).then(() => {
                  }, () => {
                  }, (err) => BaseService.getErrorLog(err));
              } else {
                addCustomerPackingSlip();
              }
            }
          } else {
            addCustomerPackingSlip();
          }
        });
      } else {
        addCustomerPackingSlip();
      }
    };
    // Add Customer Packing Slip
    const addCustomerPackingSlip = () => {
      vm.AddCustPackingSlip.$$controls[0].$setDirty();
      if (BaseService.focusRequiredField(vm.AddCustPackingSlip)) {
        return;
      }
      const saveObj = {
        customerID: vm.PackingSlipHeader.customerID,
        refSalesOrderID: vm.PackingSlipHeader.soId,
        poNumber: vm.PackingSlipHeader.poNumber,
        poDate: BaseService.getAPIFormatedDate(vm.PackingSlipHeader.poDate),
        poRevision: vm.PackingSlipHeader.poRevision,
        soNumber: vm.PackingSlipHeader.salesOrderNumber,
        soDate: BaseService.getAPIFormatedDate(vm.PackingSlipHeader.soDate),
        sorevision: vm.PackingSlipHeader.sorevision,
        packingSlipDate: BaseService.getAPIFormatedDate(vm.PackingSlipHeader.cpsDate),
        headerComment: vm.PackingSlipHeader.internalComment,
        packingSlipComment: vm.PackingSlipHeader.shippingComment,
        billingAddressID: vm.PackingSlipHeader.billingAddressID,
        shippingAddressID: vm.PackingSlipHeader.shippingAddressID,
        intermediateShipmentID: vm.PackingSlipHeader.intermediateShipmentID,
        billingAddress: BaseService.generateAddressFormateToStoreInDB(vm.PackingSlipHeader.billingAddressObj),
        shippingAddress: BaseService.generateAddressFormateToStoreInDB(vm.PackingSlipHeader.shippingAddressObj),
        intermediateAddress: BaseService.generateAddressFormateToStoreInDB(vm.PackingSlipHeader.intermediateAddressObj),
        freeOnBoardId: vm.PackingSlipHeader.freeOnBoardId,
        termsId: vm.PackingSlipHeader.termsID,
        salesCommissionTo: vm.PackingSlipHeader.salesCommissionTo,
        contactPersonId: vm.PackingSlipHeader.contactPersonId,
        shippingMethodID: vm.autoCompleteShipping && vm.autoCompleteShipping.keyColumnId ? vm.autoCompleteShipping.keyColumnId : vm.PackingSlipHeader.shippingMethodID,
        carrierID: vm.autoCompleteCarrier && vm.autoCompleteCarrier.keyColumnId ? vm.autoCompleteCarrier.keyColumnId : vm.PackingSlipHeader.carrierID,
        carrierAccountNumber: vm.PackingSlipHeader.carrierAccountNumber,
        billingContactPersonID: vm.PackingSlipHeader.billingContactPersonID,
        shippingContactPersonID: vm.PackingSlipHeader.shippingContactPersonID,
        intermediateContactPersonID: vm.PackingSlipHeader.intermediateContactPersonID,
        billingContactPerson: BaseService.generateContactPersonDetFormat(vm.PackingSlipHeader.billingContactPersonObj),
        shippingContactPerson: BaseService.generateContactPersonDetFormat(vm.PackingSlipHeader.shippingContactPersonObj),
        intermediateContactPerson: BaseService.generateContactPersonDetFormat(vm.PackingSlipHeader.intermediateContactPersonObj)
      };
      console.log(saveObj);
      vm.cgBusyLoading = CustomerPackingSlipFactory.saveCustomerPackingSlipFromSO().query(saveObj).$promise.then((res) => {
        if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          BaseService.goToManageCustomerPackingSlip(res.data[0][0].packingSlipId, vm.PackingSlipHeader.soId, null, vm.isOtherComponent ? 2 : 1, vm.soDetailId, vm.soReleaseId);
          $mdDialog.cancel();
        } else {
          setFocus('btnSave');
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };


    //view assy details
    vm.ViewAssemblyStockStatus = (detailData, event) => {
      const data = angular.copy(detailData);
      data.rohsIcon = vm.rohsImagePath + detailData.rohsIcon;
      DialogFactory.dialogService(
        CORE.ASSEMBLY_STOCK_STATUS_MODAL_CONTROLLER,
        CORE.ASSEMBLY_STOCK_STATUS_MODAL_VIEW,
        event,
        data).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };

    // open release line popup
    vm.goToReleaseDetail = (detData, ev) => {
      const rowDetail = {
        id: detData.sDetId,
        salesOrderDetStatus: detData.salesOrderDetStatus,
        qty: detData.custPOQty,
        poDate: vm.PackingSlipHeader.poDate,
        mfrID: detData.mfgcodeID,
        partID: detData.partID,
        lineID: detData.lineID,
        mfrName: detData.mfgName,
        mfgPN: detData.mfgpn,
        isCustom: detData.iscustom,
        rohsIcon: vm.rohsImagePath + detData.rohsIcon,
        rohsText: detData.rohsName,
        PIDCode: detData.pidcode,
        materialTentitiveDocDate: detData.materialTentitiveDocDate
      };
      // release line pop-up view only
      const data = {
        rowDetail: _.clone(rowDetail),
        customerID: vm.PackingSlipHeader.customerID,
        soID: vm.PackingSlipHeader.soId,
        soNumber: vm.PackingSlipHeader.salesOrderNumber,
        soDate: vm.PackingSlipHeader.soDate,
        poDate: vm.PackingSlipHeader.poDate,
        isDisable: true,
        poNumber: vm.PackingSlipHeader.poNumber,
        companyNameWithCode: vm.PackingSlipHeader.customerName,
        companyName: vm.PackingSlipHeader.customerName
      };
      DialogFactory.dialogService(
        CORE.SO_RELEASE_LINE_MODAL_CONTROLLER,
        CORE.SO_RELEASE_LINE_MODAL_VIEW,
        ev,
        data).then(() => {
        }, (response) => {
          if (response) {
            vm.searchData();
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    /* Add/Update Initial Assembly Stock*/
    vm.addEditAssemblyStock = (partID, ev) => {
      const data = {};
      if (partID) {
        data.assyId = partID;
      }
      DialogFactory.dialogService(
        USER.ADMIN_ASSEMBLYSTOCK_UPDATE_MODAL_CONTROLLER,
        USER.ADMIN_ASSEMBLYSTOCK_UPDATE_MODAL_VIEW,
        ev,
        data).then(() => { }, () => { });
    };

    /*Assembly at glance*/
    vm.getAssyAtGlance = (detData, ev) => {
      DialogFactory.dialogService(
        RFQTRANSACTION.ASSEMBLY_AT_GLANCE_CONTROLLER,
        RFQTRANSACTION.ASSEMBLY_AT_GLANCE_VIEW,
        ev,
        detData).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };

    // open stock adjustment popup to add new adjustment
    vm.addStockAdjustment = (item, ev) => {
      if (!item.isAssembly) {
        return;
      }
      const popUpData = {
        popupAccessRoutingState: [TRANSACTION.TRANSACTION_STOCK_ADJUSTMENT_STATE],
        pageNameAccessLabel: CORE.LabelConstant.StockAdjustment.PageName
      };
      const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
      if (isAccessPopUp) {
        const data = {
          isAddDataFromCustomerPackingSlipPage: true,
          customerPackingSlipDet: {
            partID: item.partId,
            PIDCode: item.pidCode
            // woNumber: row.entity.woNumber
          }
        };
        DialogFactory.dialogService(
          TRANSACTION.TRANSACTION_STOCK_ADJUSTMENT_POPUP_CONTROLLER,
          TRANSACTION.TRANSACTION_STOCK_ADJUSTMENT_POPUP_VIEW,
          ev,
          data).then(() => { }, (err) => BaseService.getErrorLog(err));
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
            vm.PackingSlipHeader.carrierAccountNumber = vm.PackingSlipHeader.shippingAddressObj ? (vm.PackingSlipHeader.shippingAddressObj.carrierAccount || vm.PackingSlipHeader.carrierAccountNumber) : (vm.PackingSlipHeader.carrierAccountNumber || null);
            vm.autoCompleteCarrier.keyColumnId = vm.PackingSlipHeader.shippingAddressObj ? (vm.PackingSlipHeader.shippingAddressObj.carrierID || vm.autoCompleteCarrier.keyColumnId) : (vm.autoCompleteCarrier.keyColumnId || null);
            vm.autoCompleteShipping.keyColumnId = vm.PackingSlipHeader.shippingAddressObj ? (vm.PackingSlipHeader.shippingAddressObj.shippingMethodID || vm.autoCompleteShipping.keyColumnId) : (vm.autoCompleteShipping.keyColumnId || null);
          }
        }, () => {
        });
      } else {
        vm.PackingSlipHeader.carrierAccountNumber = vm.PackingSlipHeader.shippingAddressObj ? (vm.PackingSlipHeader.shippingAddressObj.carrierAccount || vm.PackingSlipHeader.carrierAccountNumber) : (vm.PackingSlipHeader.carrierAccountNumber || null);
        vm.autoCompleteCarrier.keyColumnId = vm.PackingSlipHeader.shippingAddressObj ? (vm.PackingSlipHeader.shippingAddressObj.carrierID || vm.autoCompleteCarrier.keyColumnId) : (vm.autoCompleteCarrier.keyColumnId || null);
        vm.autoCompleteShipping.keyColumnId = vm.PackingSlipHeader.shippingAddressObj ? (vm.PackingSlipHeader.shippingAddressObj.shippingMethodID || vm.autoCompleteShipping.keyColumnId) : (vm.autoCompleteShipping.keyColumnId || null);
      }
    };

    // open select intermediate Addresses popup
    vm.selectInterAddressCallBack = (ev, callBackAddress) => {
      if (callBackAddress) {
        callBackAddress.addressType = 'I';
        vm.selectAddressCallBack(ev, callBackAddress);
      }
    };

    // open select Addresses popup
    vm.selectAddressCallBack = (ev, callBackAddress) => {
      if (callBackAddress) {
        if (!_.find(vm.ShippingAddressList, (item) => item.id === callBackAddress.id)) {
          vm.ShippingAddressList.push(callBackAddress);
        }
        if (callBackAddress.addressType === CORE.AddressType.ShippingAddress) {
          vm.PackingSlipHeader.shippingAddressObj = callBackAddress;
          vm.PackingSlipHeader.shippingAddressID = callBackAddress.id;
          vm.PackingSlipHeader.shippingContactPersonObj = callBackAddress.contactPerson;
          vm.PackingSlipHeader.shippingContactPersonID = callBackAddress.contactPerson ? callBackAddress.contactPerson.personId : null;
          vm.shipToOtherDet.alreadySelectedAddressID = callBackAddress.id;
          vm.shipToOtherDet.alreadySelectedPersonId = callBackAddress.contactPerson ? callBackAddress.contactPerson.personId : null;
          commonShippingMethodConfirm(true);
        } else if (callBackAddress.addressType === CORE.AddressType.IntermediateAddress) {
          vm.PackingSlipHeader.intermediateAddressObj = callBackAddress;
          vm.PackingSlipHeader.intermediateShipmentID = callBackAddress.id;
          vm.PackingSlipHeader.intermediateContactPersonObj = callBackAddress.contactPerson;
          vm.PackingSlipHeader.intermediateContactPersonID = callBackAddress.contactPerson ? callBackAddress.contactPerson.personId : null;
          vm.intermediateToOtherDet.alreadySelectedAddressID = callBackAddress.id;
          vm.intermediateToOtherDet.alreadySelectedPersonId = callBackAddress.contactPerson ? callBackAddress.contactPerson.personId : null;
        }
      }
      setFocus('packingSlipComment');
    };

    // open intermediate addEdit Addresses popup
    vm.addEditInterAddressCallBack = (ev, callBackAddress) => {
      if (callBackAddress) {
        callBackAddress.addressType = 'I';
        vm.addEditAddressCallBack(ev, callBackAddress);
      }
    };

    // open addEdit Addresses popup
    vm.addEditAddressCallBack = (ev, callBackAddress) => {
      if (callBackAddress) {
        if (callBackAddress.addressType === CORE.AddressType.ShippingAddress) {
          vm.PackingSlipHeader.shippingAddressObj = callBackAddress;
          vm.PackingSlipHeader.shippingAddressID = callBackAddress.id;
          vm.PackingSlipHeader.shippingContactPersonObj = callBackAddress.contactPerson;
          vm.PackingSlipHeader.shippingContactPersonID = callBackAddress.contactPerson ? callBackAddress.contactPerson.personId : null;
          vm.shipToOtherDet.alreadySelectedAddressID = callBackAddress.id;
          vm.shipToOtherDet.alreadySelectedPersonId = callBackAddress.contactPerson ? callBackAddress.contactPerson.personId : null;
          commonShippingMethodConfirm(true);
        } else if (callBackAddress.addressType === CORE.AddressType.IntermediateAddress) {
          vm.PackingSlipHeader.intermediateAddressObj = callBackAddress;
          vm.PackingSlipHeader.intermediateShipmentID = callBackAddress.id;
          vm.PackingSlipHeader.intermediateContactPersonObj = callBackAddress.contactPerson;
          vm.PackingSlipHeader.intermediateContactPersonID = callBackAddress.contactPerson ? callBackAddress.contactPerson.personId : null;
          vm.intermediateToOtherDet.alreadySelectedAddressID = callBackAddress.id;
          vm.intermediateToOtherDet.alreadySelectedPersonId = callBackAddress.contactPerson ? callBackAddress.contactPerson.personId : null;
        }
        getCustomerContactPersonList();
        getCustomerAddress(vm.PackingSlipHeader.customerID);
        //const addressPromise = [getCustomerContactPersonList(), getCustomerAddress(vm.PackingSlipHeader.customerID)];
        //vm.cgBusyLoading = $q.all(addressPromise).then(() => {
        //}).catch((error) => BaseService.getErrorLog(error));
      }
    };

    //add edit intermediate address contact person
    vm.addEditInterAddressContactPersonCallBack = (ev, callBackData, addressType) => {
      addressType = 'I';
      vm.addEditAddressContactPersonCallBack(ev, callBackData, addressType);
    };

    //add edit address contact person
    vm.addEditAddressContactPersonCallBack = (ev, callBackData, addressType) => {
      if (callBackData) {
        if (addressType === CORE.AddressType.IntermediateAddress) {
          vm.PackingSlipHeader.intermediateContactPersonObj = callBackData;
          vm.PackingSlipHeader.intermediateContactPersonID = callBackData.personId;
        } else {
          vm.PackingSlipHeader.shippingContactPersonObj = callBackData;
          vm.PackingSlipHeader.shippingContactPersonID = callBackData.personId;
        }
        getCustomerContactPersonList();
      }
    };

    // open  intermediate select contact person  list
    vm.selectInterAddressContactPersonCallBack = (ev, callBackData, addressType) => {
      addressType = 'I';
      vm.selectAddressContactPersonCallBack(ev, callBackData, addressType);
    };

    // open select contact person  list
    vm.selectAddressContactPersonCallBack = (ev, callBackData, addressType) => {
      if (callBackData) {
        if (addressType === CORE.AddressType.ShippingAddress) {
          vm.ShippingAddressContactPerson = callBackData ? _.find(vm.ContactPersonList, (item) => item.personId === callBackData.personId) : vm.ShippingAddress.contactPerson;
          vm.PackingSlipHeader.shippingContactPersonID = callBackData.personId;
          vm.shipToOtherDet.alreadySelectedPersonId = callBackData.personId;
        } else if (addressType === CORE.AddressType.IntermediateAddress) {
          vm.IntermediateAddressContactPerson = callBackData ? _.find(vm.ContactPersonList, (item) => item.personId === callBackData.personId) : vm.IntermediateAddress.contactPerson;
          vm.PackingSlipHeader.intermediateContactPersonID = callBackData.personId;
          vm.intermediateToOtherDet.alreadySelectedPersonId = callBackData.personId;
        }
      }
    };

    // delete intermediate contact person call back
    vm.deleteInterAddrContanctPersonCallBack = (ev, callBackData) => {
      callBackData.addressType = 'I';
      vm.deleteAddrContanctPersonCallBack(ev, callBackData);
    };

    // delete contact person call back
    vm.deleteAddrContanctPersonCallBack = (ev, callBackData) => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONTACT_PERSON_FROM_ADDR);
      if (callBackData.addressType === CORE.AddressType.IntermediateAddress) {
        messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.COMMON.MarkFor);
      } else {
        messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.COMMON.ShippingAddress);
      }
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          if (callBackData.addressType === CORE.AddressType.IntermediateAddress) {
            vm.IntermediateAddressContactPerson = null;
            vm.PackingSlipHeader.intermediateContactPerson = null;
            vm.PackingSlipHeader.intermediateContactPersonID = null;
            vm.PackingSlipHeader.intermediateContactPersonObj = null;
            vm.intermediateToOtherDet.alreadySelectedAddressID = null;
            vm.intermediateToOtherDet.alreadySelectedPersonId = null;
          } else {
            vm.ShippingAddressContactPerson = null;
            vm.PackingSlipHeader.shippingContactPerson = null;
            vm.PackingSlipHeader.shippingContactPersonID = null;
            vm.PackingSlipHeader.shippingContactPersonObj = null;
            vm.shipToOtherDet.alreadySelectedAddressID = null;
            vm.shipToOtherDet.alreadySelectedPersonId = null;
          }
        }
      }, () => { }).catch((error) => BaseService.getErrorLog(error));
    };

    // close pop up
    vm.cancel = () => {
      const data = {
        form: vm.AddCustPackingSlip
      };
      BaseService.showWithoutSavingAlertForPopUp(data);
      /*  BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();*/
    };

    // popup form validation
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.AddCustPackingSlip);
    });
  }
})();
