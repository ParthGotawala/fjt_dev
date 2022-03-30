(function () {
  'use strict';

  angular
    .module('app.admin.customer')
    .controller('CopyAddressPopupController', CopyAddressPopupController);

  /** @ngInject */
  function CopyAddressPopupController(data, CORE, BaseService, CountryMstFactory, GenericCategoryFactory, CustomerFactory,
    USER, $scope, $timeout, $mdDialog, DialogFactory) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    //vm.addressType = CORE.AddressTypes;
    const CategoryTypeObjList = angular.copy(CORE.CategoryType);
    vm.isSubmit = false;
    vm.LabelConstant = CORE.LabelConstant;
    vm.addressIconClass = data.addressType === CORE.AddressType.ShippingAddress ? 't-icons-shipping-address' : (data.addressType === CORE.AddressType.BillingAddress ? 't-icons-billing-address' : (data.addressType === CORE.AddressType.PayToInformation ? 't-icons-payment-address' : 't-icons-rma-address'));
    vm.fromCustomerAddress = { id: data.addressId, addressType: data.addressType };
    vm.toCustomerAddress = { id: data.addressId, addressType: data.addressType };
    vm.mfgType = data ? (data.mfgType ? data.mfgType : null) : null;
    vm.addressType = vm.mfgType === CORE.MFG_TYPE.DIST ? CORE.AddressTypes.SUPP : CORE.AddressTypes.CUST_MFR;
    vm.addressTypeTitle = vm.addressType[data.addressType].value;
    vm.addressTypeTitleText = vm.addressType[data.addressType].title;
    vm.isDist = data.mfgType === CORE.MFG_TYPE.DIST ? true : false;
    vm.textAreaRows = CORE.TEXT_AREA_ROWS;
    vm.contactPersonEmptyStateObj = angular.copy(USER.ADMIN_EMPTYSTATE.CONTACT_PERSON);
    vm.companyName = data ? (data.companyName ? data.companyName : null) : null;
    vm.companyNameWithCode = data ? (data.companyNameWithCode ? data.companyNameWithCode : null) : null;
    vm.isMasterPage = data && data.isMasterPage;
    vm.custPersonViewActionBtnDet = angular.copy(CORE.ContactPersonViewActionBtn);
    vm.fromCustPersonViewActionBtnDet = angular.copy(CORE.ContactPersonViewActionBtn);
    vm.fromCustPersonViewActionBtnDet.AddNew.isDisable = vm.fromCustPersonViewActionBtnDet.Update.isDisable = vm.fromCustPersonViewActionBtnDet.ApplyNew.isDisable = vm.fromCustPersonViewActionBtnDet.Delete.isDisable = vm.fromCustPersonViewActionBtnDet.Refresh.isDisable = true;
    vm.mfgTypeConst = CORE.MFG_TYPE;

    vm.intermediateFromActionBtn = vm.fromCustPersonViewActionBtnDet;
    vm.intermediateFromContactActionBtn = vm.fromCustPersonViewActionBtnDet;

    vm.intermediateToActionBtn = angular.copy(CORE.CustAddressViewActionBtn);
    vm.intermediateToContactActionBtn = angular.copy(CORE.CustAddressViewActionBtn);
    let selectedCountry;

    // set other detail of mark for address
    vm.intermediateFromOtherDet = {
      showAddressEmptyState: false,
      mfgType: CORE.MFG_TYPE.CUSTOMER,
      customerId: data.customerId,
      addressType: CORE.AddressType.IntermediateAddress,
      addressBlockTitle: vm.LabelConstant.Address.MarkForAddress,
      companyName: vm.companyNameWithCode,
      refTransID: data.customerId,
      refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
      alreadySelectedPersonId: ''
    };
    vm.intermediateToOtherDet = angular.copy(vm.intermediateFromOtherDet);

    //initialize auto complete
    const initAutoComplete = () => {
      vm.autoCompleteCountry = {
        columnName: 'countryName',
        //parentColumnName: 'countryAlias',
        controllerName: USER.ADMIN_COUNTRY_ADD_UPDATE_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_COUNTRY_ADD_UPDATE_MODAL_VIEW,
        keyColumnName: 'countryID',
        keyColumnId: null,
        inputName: 'Country',
        placeholderName: 'Country',
        isRequired: true,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_COUNTRY_STATE],
          pageNameAccessLabel: CORE.PageName.country
        },
        isAddnew: true,
        callbackFn: function (obj) {
          const searchObj = {
            countryID: obj
          };
          return getAllCountryList(searchObj);
        },
        onSelectCallbackFn: (item) => {
          if (item) {
            selectedCountry = item;
            vm.toCustomerAddress.countryID = selectedCountry ? selectedCountry.countryID : null;
          } else {
            selectedCountry = null;
            vm.toCustomerAddress.countryID = null;
          }
        },
        onSearchFn: function (query) {
          const searchObj = {
            searchQuery: query,
            inputName: vm.autoCompleteCountry.inputName
          };
          return getAllCountryList(searchObj);
        }
      };
      vm.autoCompleteShipping = {
        columnName: 'gencCategoryDisplayName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: null,
        inputName: CategoryTypeObjList.ShippingType.Name,
        placeholderName: CategoryTypeObjList.ShippingType.Title,
        addData: {
          headerTitle: CategoryTypeObjList.ShippingType.Title,
          pageNameAccessLabel: CORE.PageName.shippingMethods,
          popupAccessRoutingState: [USER.ADMIN_SHIPPINGTYPE_MANAGEGENERICCATEGORY_STATE]
        },
        isRequired: true,
        isAddnew: true,
        callbackFn: getGenericCategoryList(CategoryTypeObjList.ShippingType.Name),
        onSelectCallbackFn: (item) => {
          if (item) {
            if (vm.autoCompleteCarriers) {
              if (!vm.toCustomerAddress || (vm.toCustomerAddress && vm.toCustomerAddress.shippingMethodID !== item.gencCategoryID)) {
                vm.autoCompleteCarriers.keyColumnId = item.carrierID;
              }
            }
          }
          else {
            vm.autoCompleteCarriers.keyColumnId = null;
            vm.toCustomerAddress.carrierAccount = null;
          }
        }
      };
      vm.autoCompleteCarriers = {
        columnName: 'gencCategoryDisplayName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: null,
        inputName: CategoryTypeObjList.Carriers.Title,
        placeholderName: CategoryTypeObjList.Carriers.singleLabel,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_CARRIERMST_MANAGEGENERICCATEGORY_STATE],
          pageNameAccessLabel: CORE.PageName.Carrier,
          headerTitle: CategoryTypeObjList.Carriers.Name
        },
        isRequired: false,
        isAddnew: true,
        callbackFn: getGenericCategoryList(CategoryTypeObjList.Carriers.Name)
      };
    };

    const getAllCountryList = (searchObj) => CountryMstFactory.getAllCountry().query(searchObj).$promise.then((countries) => {
      if (searchObj && searchObj.countryID) {
        //vm.toCustomerAddress.selectedCountryTxt = countries.data[0] ? countries.data[0].countryName : '';
        //vm.toCustomerAddress.countryID = countries.data[0] ? countries.data[0].countryID : '';
        selectedCountry = countries.data[0];
        $timeout(() => {
          if (vm.autoCompleteCountry && vm.autoCompleteCountry.inputName) {
            $scope.$broadcast(vm.autoCompleteCountry.inputName, selectedCountry);
          }
        });
      }
      vm.countryDetail = countries.data;
      ///* if all country data (length 1 means only seleted one) */
      //if (!searchObj && vm.countryDetail && vm.countryDetail.length > 0) {
      //  vm.allCountryList = angular.copy(vm.countryDetail);
      //}
      return countries.data;
    }).catch((error) => BaseService.getErrorLog(error));

    // get shipping method and carrier list
    const getGenericCategoryList = (genCatType) => {
      const GencCategoryType = [genCatType];
      const listObj = {
        GencCategoryType: GencCategoryType,
        isActive: true
      };
      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((respGen) => {
        if (respGen && respGen.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          if (genCatType === CategoryTypeObjList.Carriers.Name) {
            vm.CarrierList = respGen.data;
            _.each(vm.CarrierList, (item) => {
              if (item.gencCategoryCode) {
                item.gencCategoryDisplayName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.gencCategoryCode, item.gencCategoryName);
              }
              else {
                item.gencCategoryDisplayName = item.gencCategoryName;
              }
            });
            if (vm.autoCompleteCarriers) {
              vm.autoCompleteCarriers.keyColumnId = vm.toCustomerAddress.carrierID;
            }
          } else {
            vm.ShippingTypeList = respGen.data;
            _.each(vm.ShippingTypeList, (item) => {
              if (item.gencCategoryCode) {
                item.gencCategoryDisplayName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.gencCategoryCode, item.gencCategoryName);
              }
              else {
                item.gencCategoryDisplayName = item.gencCategoryName;
              }
            });
            if (vm.autoCompleteShipping) {
              vm.autoCompleteShipping.keyColumnId = vm.toCustomerAddress.shippingMethodID;
            }
          }
          return respGen.data;// $q.resolve(vm.TermsList);
        } else {
          return false;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // set data for Contact Person directive
    const setOtherDetForContactPerson = (isSetForFromAddress) => {
      vm.contactPersonOtherDet = {
        customerId: vm.toCustomerAddress.customerId,
        companyName: vm.companyNameWithCode,
        refTransID: vm.toCustomerAddress.customerId,
        refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
        alreadySelectedPersonId: (vm.toCustomerAddress.contactPerson && vm.toCustomerAddress.contactPerson.personId) || null,
        selectedContactPerson: vm.toCustomerAddress.contactPerson || null,
        mfgType: vm.mfgType
      };
      if (isSetForFromAddress) {
        vm.fromContactPersonOtherDet = angular.copy(vm.contactPersonOtherDet);
      }
    };

    // get from address data
    const getCustomerAddress = (id, customerId) => CustomerFactory.customerAddressList().query({
      addressID: id,
      customerId: customerId,
      addressType: data.addressType,
      refTableName: CORE.TABLE_NAME.MFG_CODE_MST
    }).$promise.then((customeraddress) => {
      if (customeraddress && customeraddress.status === CORE.ApiResponseTypeStatus.SUCCESS) {
        vm.fromCustomerAddress = angular.copy(customeraddress.data[0]);
        vm.fromCustomerAddress = angular.copy(customeraddress.data[0]);
        if (vm.fromCustomerAddress) {
          vm.fromCustomerAddress.isActiveText = _.find(CORE.ActiveRadioGroup, (item) => item.Value === vm.fromCustomerAddress.isActive).Key;
          if (vm.fromCustomerAddress.Carrier) {
            vm.fromCustomerAddress.Carrier.carrierName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, vm.fromCustomerAddress.Carrier.gencCategoryCode, vm.fromCustomerAddress.Carrier.gencCategoryName);
          }
          if (vm.fromCustomerAddress.shippingMethod) {
            vm.fromCustomerAddress.shippingMethod.shippingMethodName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, vm.fromCustomerAddress.shippingMethod.gencCategoryCode, vm.fromCustomerAddress.shippingMethod.gencCategoryName);
          }
        }
        vm.toCustomerAddress = angular.copy(customeraddress.data[0]);
        setOtherDetForContactPerson(true);
        setIntmdAddrDetForApplied(vm.fromCustomerAddress.defaultIntmdCustomerAddresses, false);
        setIntmdContDetForApplied(vm.fromCustomerAddress.defaultIntmdContactPerson, false);
        vm.toCustomerAddress.id = null;
        vm.toCustomerAddress.isActive = true;
        vm.toCustomerAddress.isActiveText = _.find(CORE.ActiveRadioGroup, (item) => item.Value === true).Key;
        if (vm.autoCompleteCarriers && !vm.autoCompleteCarriers.keyColumnId) {
          vm.autoCompleteCarriers.keyColumnId = vm.toCustomerAddress.carrierID;
        }
        if (vm.autoCompleteShipping && !vm.autoCompleteShipping.keyColumnId) {
          vm.autoCompleteShipping.keyColumnId = vm.toCustomerAddress.shippingMethodID;
        }
        if (vm.autoCompleteCountry && vm.autoCompleteCountry.inputName && !vm.autoCompleteCountry.keyColumnId) {
          getAllCountryList({ countryID: vm.toCustomerAddress.countryID });
        }
      }
      return customeraddress.data;
    }).catch((error) => BaseService.getErrorLog(error));

    // after select/add/update address, set details in model
    const setIntmdAddrDetForApplied = (newApplyAddrDet, isIntmdToAddrOnly) => {
      if (newApplyAddrDet) {
        if (!isIntmdToAddrOnly) {
          vm.fromCustomerAddress.defaultIntermediateAddressID = newApplyAddrDet.id;
          vm.fromCustomerAddress.intermediateAddressObj = newApplyAddrDet;
          vm.intermediateFromOtherDet.alreadySelectedAddressID = newApplyAddrDet.id;
        }

        vm.toCustomerAddress.defaultIntermediateAddressID = newApplyAddrDet.id;
        vm.toCustomerAddress.intermediateAddressObj = newApplyAddrDet;
        vm.intermediateToOtherDet.alreadySelectedAddressID = newApplyAddrDet.id;
      } else {
        if (!isIntmdToAddrOnly) {
          vm.fromCustomerAddress.defaultIntermediateAddressID = null;
          vm.fromCustomerAddress.intermediateAddressObj = null;
          vm.intermediateFromOtherDet.alreadySelectedAddressID = null;
        }

        vm.toCustomerAddress.defaultIntermediateAddressID = null;
        vm.toCustomerAddress.intermediateAddressObj = null;
        vm.intermediateToOtherDet.alreadySelectedAddressID = null;
      }
    };

    // after select/add/update address, set details in model
    const setIntmdContDetForApplied = (newApplyContDet, isIntmdToContOnly) => {
      if (newApplyContDet) {
        if (!isIntmdToContOnly) {
          vm.fromCustomerAddress.defaultIntermediateContactPersonID = newApplyContDet.personId;
          vm.fromCustomerAddress.intermediateContactPersonObj = angular.copy(newApplyContDet);
          vm.intermediateFromOtherDet.alreadySelectedPersonId = vm.fromCustomerAddress.intermediateContactPersonObj.personId;
        }

        vm.toCustomerAddress.defaultIntermediateContactPersonID = newApplyContDet.personId;
        vm.toCustomerAddress.intermediateContactPersonObj = angular.copy(newApplyContDet);
        vm.intermediateToOtherDet.alreadySelectedPersonId = vm.toCustomerAddress.intermediateContactPersonObj.personId;
      } else {
        if (!isIntmdToContOnly) {
          vm.fromCustomerAddress.defaultIntermediateContactPersonID = null;
          vm.fromCustomerAddress.intermediateContactPersonObj = null;
          vm.intermediateFromOtherDet.alreadySelectedPersonId = null;
        }

        vm.toCustomerAddress.defaultIntermediateContactPersonID = null;
        vm.toCustomerAddress.intermediateContactPersonObj = null;
        vm.intermediateToOtherDet.alreadySelectedPersonId = null;
      }
    };

    //initialize on form load
    const init = () => {
      initAutoComplete();
      getCustomerAddress(data.addressId, data.customerId);
      $timeout(() => {
        // vm.copyAddressForm.$setPristine();
        vm.copyAddressForm.$setDirty();
      });
    };
    init();

    // to delete contact person
    vm.deleteContactPerson = () => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONTACT_PERSON_FROM_ADDR);
      let addressType;
      if (data.addressType === CORE.AddressType.BillingAddress) {
        addressType = 'Billing';
      } else if (data.addressType === CORE.AddressType.ShippingAddress) {
        addressType = 'Shipping';
      } else if (data.addressType === CORE.AddressType.PayToInformation) {
        addressType = 'Remit To';
      } else if (data.addressType === CORE.AddressType.IntermediateAddress) {
        addressType = 'Mark For (Intmd. Ship To)';
      } else if (data.addressType === CORE.AddressType.WireTransferAddress) {
        addressType = 'Wire Transfer';
      } else if (data.addressType === CORE.AddressType.BusinessAddress) {
        addressType = 'Business';
      } else if (data.addressType === CORE.AddressType.RMAShippingAddress) {
        addressType = 'RMA Shipping';
      }
      // data.addressType === CORE.AddressType.ShippingAddress ? 't-icons-shipping-address' : (data.addressType === CORE.AddressType.BillingAddress ? 't-icons-billing-address' : (data.addressType === CORE.AddressType.PayToInformation ? 't-icons-payment-address' : 't-icons-rma-address'));
      messageContent.message = stringFormat(messageContent.message, addressType);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          vm.toCustomerAddress.contactPerson = null;
          setOtherDetForContactPerson();
          vm.copyAddressForm.$$controls[0].$setDirty();
        }
      }, () => { }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.findAddress = () => {
      /* postcode can be more then 5 charactor. */
      //  if (vm.customerAddresses.postcode && vm.customerAddresses.postcode.length === 5) {
      if (vm.toCustomerAddress.postcode) {
        const geocoder = new google.maps.Geocoder();
        const zip = vm.toCustomerAddress.postcode;
        let city = '';
        let state = '';
        let country = '';
        vm.getDetails = geocoder.geocode({ 'componentRestrictions': { 'postalCode': zip } }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            const address_components = results[0].address_components;
            vm.toCustomerAddress.latitude = results[0].geometry.location.lat();
            vm.toCustomerAddress.longitude = results[0].geometry.location.lng();
            _.each(address_components, (component) => {
              const types = component.types;
              _.each(types, (type) => {
                if (type === 'locality') {
                  city = component.long_name;
                }
                if (type === 'administrative_area_level_1') {
                  state = component.long_name;
                }
                if (type === 'country') {
                  country = component.long_name;
                }
              });
            });
            $timeout(() => {
              vm.toCustomerAddress.city = vm.toCustomerAddress.city ? vm.toCustomerAddress.city : (city ? city : null);
              vm.toCustomerAddress.state = vm.toCustomerAddress.state ? vm.toCustomerAddress.state : (state ? state.toUpperCase() : null);
              if (!vm.toCustomerAddress.countryID) {
                if (country) {
                  const matchedCountry = _.find(allCountryList, (item) => item.countryName === country);
                  if (matchedCountry && matchedCountry.countryID) {
                    vm.autoCompleteCountry.keyColumnId = matchedCountry.countryID;
                    vm.toCustomerAddress.selectedCountryTxt = matchedCountry.countryName ? matchedCountry.countryName : '';
                    vm.toCustomerAddress.countryID = matchedCountry.countryID;
                    selectedCountry = matchedCountry;
                    $timeout(() => {
                      if (vm.autoCompleteCountry && vm.autoCompleteCountry.inputName) {
                        $scope.$broadcast(vm.autoCompleteCountry.inputName, selectedCountry);
                      }
                    });
                  }
                }
                else {
                  vm.toCustomerAddress.countryID = null;
                }
              }
            }, 0);
          }
        });
      }
    };

    // check  for dirty
    vm.checkFormDirty = (form, columnName) => BaseService.checkFormDirty(form, columnName);

    // Save Duplicate Address
    vm.saveCustomerAddress = () => {
      vm.saveBtnDisableFlag = true;
      if (BaseService.focusRequiredField(vm.copyAddressForm)) {
        vm.saveBtnDisableFlag = false;
        return;
      }
      const customerAddresses = angular.copy(vm.toCustomerAddress);
      //customerAddresses.latitude = vm.customerAddresses.latitude;
      //customerAddresses.longitude = vm.customerAddresses.longitude;
      customerAddresses.defaultContactPersonID = vm.toCustomerAddress.contactPerson ? angular.copy(vm.toCustomerAddress.contactPerson.personId) : null;
      customerAddresses.isActive = true;
      customerAddresses.isDefault = false;
      customerAddresses.systemGenerated = false;
      customerAddresses.shippingMethodID = (vm.autoCompleteShipping && vm.autoCompleteShipping.keyColumnId) ? vm.autoCompleteShipping.keyColumnId : null;
      customerAddresses.carrierID = (vm.autoCompleteCarriers && vm.autoCompleteCarriers.keyColumnId) ? vm.autoCompleteCarriers.keyColumnId : null;
      //customerAddresses.carrierAccount = vm.customerAddresses.carrierAccount;
      vm.cgBusyLoading = CustomerFactory.saveCustomerAddresses().save(customerAddresses).$promise.then((address) => {
        if (address && address.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          vm.saveBtnDisableFlag = false;
          // vm.saveAndProceed(buttonCategory, vm.address);
          BaseService.currentPagePopupForm.pop();
          $mdDialog.cancel(vm.address);
        } else {
          vm.saveBtnDisableFlag = false;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // set address call back data after select address
    vm.selectInterAddressToCallBack = (ev, callBackAddress) => {
      if (callBackAddress) {
        setIntmdAddrDetForApplied(callBackAddress, true);
        setIntmdContDetForApplied(callBackAddress.contactPerson, true);
        // Static code to enable save button
        vm.copyAddressForm.$setDirty();
      }
    };

    // set address call back data after select address
    vm.deleteInterAddressToCallBack = (ev, callBackAddress) => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DEFINE_ADDRESS_REMOVE_CONFIRMATION);
      messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.COMMON.InternmediateAddress);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };

      DialogFactory.messageConfirmDialog(obj).then((resp) => {
        if (resp) {
          setIntmdAddrDetForApplied(null, true);
          setIntmdContDetForApplied(null, true);
          // Static code to enable save button
          vm.copyAddressForm.$setDirty();
        }
      });
    };

    vm.selectInterAddressContactPersonToCallBack = (ev, callBackContactPerson) => {
      if (callBackContactPerson) {
        setIntmdContDetForApplied(callBackContactPerson, true);
        // Static code to enable save button
        vm.copyAddressForm.$setDirty();
      }
    };

    vm.deleteInterAddrContanctPersonToCallBack = (ev, callBackData) => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONTACT_PERSON_FROM_ADDR);
      messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.COMMON.InternmediateAddress);

      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          setIntmdContDetForApplied(null, true);
          vm.copyAddressForm.$setDirty();
        }
      }, () => { }).catch((error) => BaseService.getErrorLog(error));
    };

    /*Used to close po-up*/
    vm.cancel = () => {
      const isDirty = vm.checkFormDirty(vm.copyAddressForm, null);
      if (isDirty) {
        const data = {
          form: vm.copyAddressForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };

    /* called for max length validation */
    vm.getMaxLengthValidation = ((maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength));

    vm.goToCustomerContactPersonList = (customerId) => {
      const custType = data && data.mfgType === CORE.MFG_TYPE.DIST ? CORE.CUSTOMER_TYPE.SUPPLIER : CORE.CUSTOMER_TYPE.CUSTOMER;
      BaseService.goToCustTypeContactPersonList(custType, customerId);
    };

    //go to to Country master
    vm.goToCountryList = () => BaseService.openInNew(USER.ADMIN_COUNTRY_STATE, {});

    // go to carrier list page
    vm.goTocarrierList = () => BaseService.goToGenericCategoryCarrierList();

    vm.goToShippingMethodList = () => BaseService.goToGenericCategoryShippingTypeList();

    //Set as current form when page loaded
    angular.element(() => { BaseService.currentPagePopupForm.push(vm.copyAddressForm); });
  }// end of controller
})();
