(function () {
  'use strict';

  angular
    .module('app.admin.customer')
    .controller('BillingShippingAddressesPopupController', BillingShippingAddressesPopupController);

  /** @ngInject */
  function BillingShippingAddressesPopupController($mdDialog, $timeout, data, BaseService, CORE, CustomerFactory, USER,
    $q, CountryMstFactory, $scope, DialogFactory, GenericCategoryFactory, ContactPersonFactory) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.emptySearch = CORE.EMPTYSTATE.EMPTY_SEARCH;
    vm.EmptyMsgContactPerson = USER.ADMIN_EMPTYSTATE.CUSTOMER_CONTACTPERSON;
    //vm.addressType = CORE.AddressTypes;
    const CategoryTypeObjList = angular.copy(CORE.CategoryType);
    vm.isSubmit = false;
    vm.isDist = data.mfgType === CORE.MFG_TYPE.DIST ? true : false;
    vm.companyName = data ? (data.companyName ? data.companyName : null) : null;
    vm.companyNameWithCode = data ? (data.companyNameWithCode ? data.companyNameWithCode : null) : null;
    vm.mfgType = data ? (data.mfgType ? data.mfgType : null) : null;
    vm.addressType = vm.mfgType === CORE.MFG_TYPE.DIST ? CORE.AddressTypes.SUPP : CORE.AddressTypes.CUST_MFR;
    vm.EmailPattern = CORE.EmailPattern;
    vm.custPersonViewActionBtnDet = angular.copy(CORE.CustAddressViewActionBtn);
    vm.custPersonViewActionBtnDet.AddNew.isVisible = vm.custPersonViewActionBtnDet.ApplyNew.isVisible = false;
    vm.phoneNumberNote = null;
    let allCountryList = [];
    vm.stateNote = CORE.General_Notes.State;
    vm.emailList = [];
    vm.isMasterPage = data && data.isMasterPage;
    vm.intermediateAddrActionBtn = angular.copy(CORE.CustAddressViewActionBtn);
    vm.intermediateAddrContactActionBtn = angular.copy(CORE.CustAddressViewActionBtn);
    vm.mfgTypeConst = CORE.MFG_TYPE;

    switch (data.addressType) {
      case CORE.AddressType.ShippingAddress:
        vm.addressIconClass = 't-icons-shipping-address';
        break;
      case CORE.AddressType.BillingAddress:
        vm.addressIconClass = 't-icons-billing-address';
        break;
      case CORE.AddressType.PayToInformation:
        vm.addressIconClass = 't-icons-payment-address';
        break;
      case CORE.AddressType.IntermediateAddress:
        vm.addressIconClass = 't-icons-mark-for-address';
        break;
      case CORE.AddressType.RMAShippingAddress:
        vm.addressIconClass = 't-icons-rma-address';
        break;
      case CORE.AddressType.WireTransferAddress:
        vm.addressIconClass = 't-icons-wire-transfer-address';
        break;
      case CORE.AddressType.BusinessAddress:
        vm.addressIconClass = 't-icons-business-address';
        break;
      case CORE.AddressType.RMAIntermediateAddress:
        vm.addressIconClass = 't-icons-rma-intermediate-address';
        break;
    }

    //vm.addressIconClass = data.addressType === CORE.AddressType.ShippingAddress ? 't-icons-shipping-address' : data.addressType === CORE.AddressType.BillingAddress ? 't-icons-billing-address' : data.addressType === CORE.AddressType.PayToInformation ? 't-icons-payment-address' : 't-icons-rma-address';
    vm.allowToUpdateAddress = false; // after loading customer address model re-assign value
    vm.LabelConstant = CORE.LabelConstant;
    vm.disableUpdateEntry = false;
    vm.radioHeaderGroup = {
      isActive: {
        array: CORE.ActiveRadioGroup
      }
    };
    let defaultCountry = {};
    vm.customerAddresses = {
      id: null,
      customerId: data ? data.customerId : null,
      addressType: data.addressType,
      street1: null,
      street2: null,
      street3: null,
      city: null,
      state: null,
      countryID: null,
      postcode: null,
      companyName: null,
      isCopyBillingAddress: false,
      isCopyShippingAddress: false,
      isCopyPayToInformation: false,
      isCopyRMAShippingAddress: false,
      additionalComment: null,
      shippingMethodID: null,
      carrierID: null,
      carrierAccount: null,
      isActive: true,
      defaultIntermediateAddressID: null,
      defaultIntermediateContactPersonID: null,
      intermediateAddressObj: null,
      intermediateContactPersonObj: null
    };
    const addCustomerAddress = Object.assign({}, vm.customerAddresses);
    let selectedCountry;

    // set other detail of mark for address
    vm.intermediateAddrOtherDet = {
      showAddressEmptyState: false,
      mfgType: vm.mfgType,
      customerId: data.customerId,
      addressType: vm.mfgType === CORE.MFG_TYPE.DIST ? CORE.AddressType.RMAIntermediateAddress : CORE.AddressType.IntermediateAddress,
      addressBlockTitle: vm.mfgType === CORE.MFG_TYPE.DIST ? vm.LabelConstant.Address.RMAIntermediateAddress : vm.LabelConstant.Address.MarkForAddress,
      companyName: vm.companyNameWithCode,
      refTransID: data.customerId,
      refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
      alreadySelectedPersonId: ''
    };


    function getAllCountryList(searchObj) {
      return CountryMstFactory.getAllCountry().query(searchObj).$promise.then((countries) => {
        _.each(countries.data, (item) => {
          item.country = item.countryName;
          item.countryName = item.country;
        });

        if (searchObj && searchObj.countryID) {
          vm.customerAddresses.selectedCountryTxt = countries.data[0] ? countries.data[0].countryName : '';
          vm.customerAddresses.countryID = countries.data[0] ? countries.data[0].countryID : '';
          selectedCountry = countries.data[0];
          $timeout(() => {
            if (vm.autoCompleteCountry && vm.autoCompleteCountry.inputName) {
              $scope.$broadcast(vm.autoCompleteCountry.inputName, selectedCountry);
            }
          });
        }

        vm.countryDetail = countries.data;
        /* if all country data (length 1 means only seleted one) */
        if (!searchObj && vm.countryDetail && vm.countryDetail.length > 0) {
          allCountryList = angular.copy(vm.countryDetail);
        }
        return countries.data;
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //Get list shipping list
    const getShippingList = () => {
      const GencCategoryType = [];
      GencCategoryType.push(CategoryTypeObjList.ShippingType.Name);
      const listObj = {
        GencCategoryType: GencCategoryType,
        isActive: vm.id ? true : false
      };
      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((shipping) => {
        if (shipping && shipping.data) {
          vm.ShippingTypeList = shipping.data;
          _.each(shipping.data, (item) => {
            if (item.gencCategoryCode) {
              item.gencCategoryDisplayName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.gencCategoryCode, item.gencCategoryName);
            }
            else {
              item.gencCategoryDisplayName = item.gencCategoryName;
            }
          });
          return $q.resolve(vm.ShippingTypeList);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //select shipping method
    const selectShippingMethod = (item) => {
      if (item) {
        if (vm.autoCompleteCarriers) {
          if (!vm.customerAddresses || (vm.customerAddresses && vm.customerAddresses.shippingMethodID !== item.gencCategoryID)) {
            vm.autoCompleteCarriers.keyColumnId = item.carrierID;
          }
        }
      }
      else {
        vm.autoCompleteCarriers.keyColumnId = null;
        vm.customerAddresses.carrierAccount = null;
      }
    };

    //redirect to Shipping method list
    vm.goShippingMethodList = () => {
      BaseService.openInNew(USER.ADMIN_GENERICCATEGORY_SHIPPINGTYPE_STATE);
    };
    const commonExecution = (isAddNew) => {
      vm.CopyofcustomerAddresses = angular.copy(vm.customerAddresses);
      if (vm.customerAddresses.id) {
        vm.operation = 'Update';
        vm.allowToUpdateAddress = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToUpdateAddress); // in case of add no featurerights to check
        setIntmdAddrDetForApplied(vm.customerAddresses.defaultIntmdCustomerAddresses);
        setIntmdContDetForApplied(vm.customerAddresses.defaultIntmdContactPerson);
      } else {
        vm.operation = 'Add';
        vm.allowToUpdateAddress = true;
        vm.customerAddresses.companyName = vm.companyName;
        if (vm.addressType[data.addressType].value === vm.addressType.P.value) {
          vm.customerAddresses.bankRemitToName = vm.companyName;
        }
      }
      if (vm.customerAddresses.id && !vm.customerAddresses.isActive) {
        vm.disableUpdateEntry = true;
      } else if (vm.customerAddresses.id && !vm.allowToUpdateAddress) {
        vm.disableUpdateEntry = true;
      } else {
        vm.disableUpdateEntry = false;
      }
      if (vm.customerAddresses && vm.customerAddresses.countryID) {
        getAllCountryList({ countryID: vm.customerAddresses.countryID, refTable: 'countrymst' });
      }
      const autocompletePromise = []; // getAllCountryList()];
      if (vm.customerAddresses && !vm.customerAddresses.countryID) {
        autocompletePromise.push(getAllCountryList());
      }
      if (vm.addressTypeTitle === vm.addressType.S.value) {
        autocompletePromise.push(getShippingList());
        autocompletePromise.push(getCarrierList());
      }
      vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
        defaultCountry = _.find(vm.countryDetail, (item) => item.countryName === CORE.defaultSelectedCountry.countryName);
        if (defaultCountry && defaultCountry.countryID !== null) {
          vm.customerAddresses.selectedCountryTxt = defaultCountry.countryName ? defaultCountry.countryName : '';
          vm.customerAddresses.countryID = defaultCountry.countryID;
          selectedCountry = defaultCountry;
          $timeout(() => {
            if (vm.autoCompleteCountry && vm.autoCompleteCountry.inputName) {
              $scope.$broadcast(vm.autoCompleteCountry.inputName, selectedCountry);
            }
          });
        }
        initAutoComplete();
        $timeout(() => {
          vm.customerBillingAddressForm.$setPristine();
          if (isAddNew) {
            setFocus('companyName');
          }
        });
      }).catch((error) => BaseService.getErrorLog(error));
    };
    // go to carrier list page
    vm.goTocarrierList = () => {
      BaseService.goToGenericCategoryCarrierList();
    };

    //Get carrier list
    const getCarrierList = () => {
      const GencCategoryType = [];
      GencCategoryType.push(CategoryTypeObjList.Carriers.Name);
      const listObj = {
        GencCategoryType: GencCategoryType,
        isActive: vm.id ? true : false
      };
      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((carrier) => {
        if (carrier && carrier.data) {
          vm.carrierList = carrier.data;
          _.each(carrier.data, (item) => {
            if (item.gencCategoryCode) {
              item.gencCategoryDisplayName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.gencCategoryCode, item.gencCategoryName);
            }
            else {
              item.gencCategoryDisplayName = item.gencCategoryName;
            }
          });
          return $q.resolve(vm.carrierList);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };


    vm.addressTypeTitle = vm.addressType[data.addressType].value;
    vm.addressTypeTitleText = vm.addressType[data.addressType].title;

    const getCustomerAddress = (id, customerId) => CustomerFactory.customerAddressList().query({
      addressID: id,
      customerId: customerId,
      addressType: data.addressType,
      refTableName: CORE.TABLE_NAME.MFG_CODE_MST
    }).$promise.then((customeraddress) => {
      vm.customerAddresses = customeraddress && customeraddress.data ? customeraddress.data[0] : vm.customerAddresses;
      vm.customerAddressesCopy = angular.copy(vm.customerAddresses);
      return $q.resolve(vm.customerAddresses);
    }).catch((error) => BaseService.getErrorLog(error));

    if (data && data.objAddress && data.objAddress.id) {
      getCustomerAddress(data.objAddress.id, data.objAddress.customerId).then(() => {
        commonExecution();
      });
    } else {
      vm.customerAddresses = data ? (data.objAddress ? angular.copy(data.objAddress) : vm.customerAddresses) : vm.customerAddresses;
      vm.customerAddressesCopy = angular.copy(vm.customerAddresses);
      commonExecution();
    }

    vm.checkUsedInTransaction = () => {
      const obj = {
        id: vm.customerAddresses.id,
        addressType: vm.customerAddresses.addressType,
        CountList: true,
        checkForTrans: true
      };
      return CustomerFactory.deleteCustomerAddresses().query({
        objDelete: obj
      }).$promise.then((respDelete) => {
        if (respDelete && respDelete.data && respDelete.data.transactionDetails && respDelete.data.transactionDetails.length > 0) {
          vm.addressUsedInTrans = true;
        } else {
          vm.addressUsedInTrans = false;
        }
        return $q.resolve(true);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* Save customer billing/shipping adderess */
    vm.saveCustomerAddress = (buttonCategory) => {
      // const OtherControll = _.find(vm.customerBillingAddressForm.$$controls, (item) => item.$name !== 'addressActive');
      const ActiveControll = _.find(vm.customerBillingAddressForm.$$controls, (item) => item.$name === 'addressActive');
      const isOtherControlDirty = BaseService.checkFormDirtyExceptParticularControl(vm.customerBillingAddressForm, 'addressActive');
      const isActiveControlDirty = ActiveControll ? ActiveControll.$dirty : false;
      let confirmationRequired = false;
      vm.saveBtnDisableFlag = true;
      const oldActiveText = vm.customerAddressesCopy ? _.find(CORE.ActiveRadioGroup, (item) => item.Value === vm.customerAddressesCopy.isActive).Key : '';
      const newActiveText = vm.customerAddresses ? _.find(CORE.ActiveRadioGroup, (item) => item.Value === vm.customerAddresses.isActive).Key : '';
      if (!vm.customerBillingAddressForm.$dirty && buttonCategory && vm.customerAddresses.id) {
        vm.saveBtnDisableFlag = false;
        vm.saveAndProceed(buttonCategory, vm.address || vm.customerAddresses);
        return;
      }
      if (BaseService.focusRequiredField(vm.customerBillingAddressForm)) {
        vm.saveBtnDisableFlag = false;
        return;
      }
      if (!vm.allowToUpdateAddress) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.GLOBAL_NOT_RIGHT_FOR_FEATURE);
        messageContent.message = stringFormat(messageContent.message, CORE.FEATURE_NAME.AllowToUpdateAddress);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
        return;
      }
      vm.customerAddresses.state = vm.customerAddresses.state ? (vm.customerAddresses.state).toUpperCase() : null;
      const customerAddresses = vm.customerAddresses;
      customerAddresses.latitude = vm.customerAddresses.latitude;
      customerAddresses.longitude = vm.customerAddresses.longitude;
      customerAddresses.shippingMethodID = (vm.autoCompleteShipping && vm.autoCompleteShipping.keyColumnId) ? vm.autoCompleteShipping.keyColumnId : null;
      customerAddresses.carrierID = (vm.autoCompleteCarriers && vm.autoCompleteCarriers.keyColumnId) ? vm.autoCompleteCarriers.keyColumnId : null;
      customerAddresses.carrierAccount = vm.customerAddresses.carrierAccount;

      if (vm.customerAddresses.id && vm.customerAddresses.customerId) {
        // case : Open "Active Address" 1 Make Inactive (without saving) 2 Again make Active (without saving)
        if (isActiveControlDirty && !isOtherControlDirty && vm.customerAddressesCopy.isActive === vm.customerAddresses.isActive) {
          vm.saveBtnDisableFlag = false;
          vm.saveAndProceed(buttonCategory, vm.customerAddresses);
          return;
        }
        let messageContent;
        vm.cgBusyLoading = $q.all([vm.checkUsedInTransaction()]).then(() => {
          if (isOtherControlDirty && vm.addressUsedInTrans) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.BILL_SHIP_ADDR_CHANGE_CONFIRM);
            confirmationRequired = true;
          } else if (!vm.addressUsedInTrans && !isActiveControlDirty) {
            confirmationRequired = false;
          } else {
            if (vm.customerAddressesCopy.isActive !== vm.customerAddresses.isActive) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.ADDRESS_CONTACT_STATUS_CHANGE);
              messageContent.message = stringFormat(messageContent.message, vm.addressTypeTitle, oldActiveText, newActiveText);
              confirmationRequired = true;
            } else {
              confirmationRequired = false;
            }
          }
          if (confirmationRequired) {
            const obj = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
            };
            DialogFactory.messageConfirmDialog(obj).then((yes) => {
              if (yes) {
                vm.updateCustoemrAddress(customerAddresses, buttonCategory);
              }
            }, () => {
              setFocusByName('companyName');
              vm.saveBtnDisableFlag = false;
            }).catch((error) => BaseService.getErrorLog(error));
          } else {
            vm.updateCustoemrAddress(customerAddresses, buttonCategory);
          }
        });
      } else if (!vm.customerAddresses.id && vm.customerAddresses.customerId) {
        vm.cgBusyLoading = CustomerFactory.saveCustomerAddresses().save(customerAddresses).$promise.then((address) => {
          vm.address = address.data;
          vm.saveBtnDisableFlag = false;
          vm.saveAndProceed(buttonCategory, vm.address);
          vm.getCustomerContactDetails();
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        BaseService.currentPagePopupForm.pop();
        DialogFactory.closeDialogPopup();
      }
    };

    vm.updateCustoemrAddress = (customerAddresses, buttonCategory) => {
      vm.cgBusyLoading = CustomerFactory.updateCustomerAddresses().update({
      }, customerAddresses).$promise.then((resp) => {
        vm.saveBtnDisableFlag = false;
        if (resp) {
          if (resp.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            //removeCountryDialCodeManual(customerAddresses);
            //BaseService.currentPagePopupForm.pop();
            //$mdDialog.cancel(vm.customerAddresses);
            vm.saveAndProceed(buttonCategory, vm.customerAddresses);
          } else if (resp.status === CORE.ApiResponseTypeStatus.EMPTY && resp.errors && resp.errors.data) {
            let prefix;
            if (resp.errors.data.respOfChkAddrUsedAPI && resp.errors.data.respOfChkAddrUsedAPI.isCustAddrUsedInFlow && resp.errors.data.respOfChkAddrUsedAPI.transactionDetails && resp.errors.data.respOfChkAddrUsedAPI.transactionDetails.length > 0) {
              prefix = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.ADDR_USED_IN_FLOW_COUNTRY_CHG_NOT_ALLOWED.message);
              const data = {
                TotalCount: _.sumBy(resp.errors.data.respOfChkAddrUsedAPI.transactionDetails, 'cnt'),
                pageName: vm.addressTypeTitleText,
                prefixDataForMsgCont: prefix
              };
              BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                const objIDs = {
                  id: [vm.customerAddresses.id],
                  CountList: true
                };
                return CustomerFactory.deleteCustomerAddresses().query({ objDelete: objIDs }).$promise.then((res) => {
                  let data = {};
                  data = res.data;
                  data.pageTitle = null;
                  data.PageName = vm.addressTypeTitleText;
                  data.selectedIDs = stringFormat('{0}{1}', 1, ' Selected');
                  if (res.data) {
                    DialogFactory.dialogService(
                      USER.ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER,
                      USER.ADMIN_SHOW_TRANSACTION_DETAILS_VIEW,
                      ev,
                      data).then(() => {
                      }, () => {
                      });
                  }
                }).catch((error) => BaseService.getErrorLog(error));
              });
              //const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.ADDR_USED_IN_FLOW_COUNTRY_CHG_NOT_ALLOWED);
              //const model = {
              //  messageContent: messageContent,
              //  multiple: true
              //};
              //DialogFactory.messageAlertDialog(model);
            }
          }
        }
        //removeCountryDialCodeManual(customerAddresses);
        //BaseService.currentPagePopupForm.pop();
        //$mdDialog.cancel(vm.customerAddresses);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // save functionality managed by button category
    vm.saveAndProceed = (buttonCategory, data) => {
      if (!buttonCategory) {
        vm.customerBillingAddressForm.$setPristine();
        getCustomerAddress(data.id, vm.customerAddresses.customerId).then(() => {
          commonExecution();
        });
      } else if (buttonCategory) {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel(data);
      }
      setFocusByName('companyName');
    };
    vm.addnewMethod = () => {
      if (vm.customerBillingAddressForm.$dirty) {
        const data = {
          form: vm.customerBillingAddressForm
        };
        const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_RESET_BODY_MESSAGE);
        const obj = {
          messageContent: messgaeContent,
          btnText: CORE.MESSAGE_CONSTANT.RESET_POPUP_BUTTON,
          canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
        };
        DialogFactory.messageConfirmDialog(obj).then(() => {
          if (data) {
            vm.customerAddresses = angular.copy(addCustomerAddress);
            commonExecution(true);
            vm.customerBillingAddressForm.$setPristine();
          }
        }, () => {
        }, (error) => BaseService.getErrorLog(error));
      } else {
        vm.customerAddresses = angular.copy(addCustomerAddress);
        commonExecution(true);
        vm.customerBillingAddressForm.$setPristine();
      }
    };
    vm.FindAddress = () => {
      /* postcode can be more then 5 charactor. */
      //  if (vm.customerAddresses.postcode && vm.customerAddresses.postcode.length === 5) {
      if (vm.customerAddresses.postcode) {
        const geocoder = new google.maps.Geocoder();
        const zip = vm.customerAddresses.postcode;
        let city = '';
        let state = '';
        let country = '';
        vm.getDetails = geocoder.geocode({ 'componentRestrictions': { 'postalCode': zip } }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            const address_components = results[0].address_components;
            vm.customerAddresses.latitude = results[0].geometry.location.lat();
            vm.customerAddresses.longitude = results[0].geometry.location.lng();
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
              vm.customerAddresses.city = vm.customerAddresses.city ? vm.customerAddresses.city : (city ? city : null);
              vm.customerAddresses.state = vm.customerAddresses.state ? vm.customerAddresses.state : (state ? state.toUpperCase() : null);
              if (!vm.customerAddresses.countryID) {
                if (country) {
                  const matchedCountry = _.find(allCountryList, (item) => item.countryName === country);
                  if (matchedCountry && matchedCountry.countryID) {
                    vm.autoCompleteCountry.keyColumnId = matchedCountry.countryID;
                    vm.customerAddresses.selectedCountryTxt = matchedCountry.countryName ? matchedCountry.countryName : '';
                    vm.customerAddresses.countryID = matchedCountry.countryID;
                    selectedCountry = matchedCountry;
                    $timeout(() => {
                      if (vm.autoCompleteCountry && vm.autoCompleteCountry.inputName) {
                        $scope.$broadcast(vm.autoCompleteCountry.inputName, selectedCountry);
                      }
                    });
                  }
                }
                else {
                  vm.customerAddresses.countryID = null;
                }
              }
            }, 0);
          }
        });
      }
    };

    ///*Used to check ditry object*/
    //vm.checkDirtyObject = {
    //  columnName: ['contact'],
    //  oldModelName: vm.CopyofcustomerAddresses,
    //  newModelName: vm.customerAddresses
    //};

    /*Used to close po-up*/
    vm.cancel = () => {
      //const isDirty = vm.checkFormDirty(vm.customerBillingAddressForm, vm.checkDirtyObject);
      const isDirty = vm.checkFormDirty(vm.customerBillingAddressForm, null);
      if (isDirty) {
        const data = {
          form: vm.customerBillingAddressForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };

    //Set as current form when page loaded
    angular.element(() => { BaseService.currentPagePopupForm.push(vm.customerBillingAddressForm); });
    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };


    const setCountryData = (item) => {
      selectedCountry = item;
      vm.customerAddresses.countryID = selectedCountry ? selectedCountry.countryID : null;
    };

    const initAutoComplete = () => {
      vm.autoCompleteCountry = {
        columnName: 'countryName',
        //parentColumnName: 'countryAlias',
        controllerName: USER.ADMIN_COUNTRY_ADD_UPDATE_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_COUNTRY_ADD_UPDATE_MODAL_VIEW,
        keyColumnName: 'countryID',
        keyColumnId: vm.customerAddresses ? vm.customerAddresses.countryID : null,
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
        onSelectCallbackFn: setCountryData,
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
        keyColumnId: vm.customerAddresses ? (vm.customerAddresses.shippingMethodID ? vm.customerAddresses.shippingMethodID : null) : null,
        inputName: CategoryTypeObjList.ShippingType.Name,
        placeholderName: CategoryTypeObjList.ShippingType.Title,
        addData: {
          headerTitle: CategoryTypeObjList.ShippingType.Title,
          pageNameAccessLabel: CORE.PageName.shippingMethods,
          popupAccessRoutingState: [USER.ADMIN_SHIPPINGTYPE_MANAGEGENERICCATEGORY_STATE]
        },
        isRequired: true,
        isAddnew: true,
        callbackFn: getShippingList,
        onSelectCallbackFn: selectShippingMethod
      };
      vm.autoCompleteCarriers = {
        columnName: 'gencCategoryDisplayName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.customerAddresses ? (vm.customerAddresses.carrierID ? vm.customerAddresses.carrierID : null) : null,
        inputName: CategoryTypeObjList.Carriers.Title,
        placeholderName: CategoryTypeObjList.Carriers.singleLabel,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_CARRIERMST_MANAGEGENERICCATEGORY_STATE],
          pageNameAccessLabel: CORE.PageName.Carrier,
          headerTitle: CategoryTypeObjList.Carriers.Name
        },
        isRequired: false,
        isAddnew: true,
        callbackFn: getCarrierList
      };
    };

    // add new contact person to set as default
    vm.addContactPerson = (ev) => {
      const popUpData = { popupAccessRoutingState: [USER.ADMIN_CONTACT_PERSON_STATE], pageNameAccessLabel: CORE.PageName.ContactPerson };
      if (BaseService.checkRightToAccessPopUp(popUpData)) {
        const data = {};
        data.companyName = vm.companyNameWithCode;
        data.refTransID = vm.customerAddresses.customerId;
        data.refTableName = CORE.TABLE_NAME.MFG_CODE_MST;
        data.isFromMasterpage = vm.isMasterPage;
        data.mfgType = vm.mfgType;
        DialogFactory.dialogService(
          USER.ADMIN_MANAGE_CONTACTPERSON_MODAL_CONTROLLER,
          USER.ADMIN_MANAGE_CONTACTPERSON_MODAL_VIEW,
          ev,
          data).then(() => {
          }, (resp) => {
            if (resp && resp.personId) {
              vm.getCustomerContactDetails();
            }
          }, (err) => BaseService.getErrorLog(err));
      }
    };
    // view billing shipping address
    vm.viewAddress = (ev) => {
      const addrs = {};
      addrs.objAddress = null;
      addrs.addressType = vm.customerAddresses && vm.customerAddresses.addressType ? vm.customerAddresses.addressType : data.addressType;
      addrs.customerId = vm.customerAddresses && vm.customerAddresses.customerId ? vm.customerAddresses.customerId : data.customerId;
      addrs.companyName = data.companyName;
      addrs.companyNameWithCode = data.companyNameWithCode;
      addrs.mfgType = data.mfgType;
      addrs.viewOnly = true;
      DialogFactory.dialogService(
        USER.ADMIN_SELECT_ADDRESSS_CONTROLLER,
        USER.ADMIN_SELECT_ADDRESSS_VIEW,
        ev,
        addrs).then(() => {
        }, () => {
        });
    };
    // get customer's all contact person details
    vm.getCustomerContactDetails = () => {
      if (vm.customerAddresses.customerId) {
        vm.cgBusyLoading = CustomerFactory.getCustomerContactPersonList().save({
          //customerId: vm.customerAddresses.customerId
          refTransID: vm.customerAddresses.customerId,
          refTableName: CORE.TABLE_NAME.MFG_CODE_MST
        }).$promise.then((res) => {
          vm.customerContactList = res && res.data ? res.data : [];
          vm.allContactPersonList = [];
          vm.customerContactList.forEach((contactPerson) => {
            const custPersonViewActionBtnDet = angular.copy(vm.custPersonViewActionBtnDet);
            custPersonViewActionBtnDet.SetDefault.isVisible = true;
            custPersonViewActionBtnDet.SetDefault.isDisable = (vm.customerContactList.filter((item) => item.isActive)).length > 1 ? false : (vm.customerAddresses.defaultContactPersonID === contactPerson.personId);
            contactPerson.isDefault = (vm.customerAddresses.defaultContactPersonID === contactPerson.personId);
            if (!vm.customerAddresses.id) {
              custPersonViewActionBtnDet.SetDefault.isDisable = true;
            }
            const objContactPerson = {
              contactPerson: contactPerson,
              viewContactPersonOtherDet: {
                customerId: vm.customerAddresses.customerId,
                refTransID: vm.customerAddresses.customerId,
                refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
                alreadySelectedPersonId: (contactPerson && contactPerson.personId) || null,
                showContPersonEmptyState: false,
                companyName: vm.companyName,
                isMaster: true,
                mfgType: vm.mfgType
              },
              custPersonViewActionBtnDet: custPersonViewActionBtnDet
            };
            vm.allContactPersonList.push(objContactPerson);
          });
          vm.allContactPersonList = vm.allContactPersonList.length > 0 ? _.orderBy(vm.allContactPersonList, ['contactPerson.isDefault', 'contactPerson.isPrimary', 'contactPerson.personFullName'], ['desc', 'desc', 'asc']) : [];
          if (vm.customerAddresses.id && vm.customerAddresses.defaultContactPersonID) {
            vm.defaultCustContForAddr = _.find(vm.customerContactList, (contItem) => contItem.personId === vm.customerAddresses.defaultContactPersonID);
            vm.viewContactPersonOtherDet = {
              customerId: vm.customerAddresses.customerId,
              refTransID: vm.customerAddresses.customerId,
              refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
              alreadySelectedPersonId: (vm.defaultCustContForAddr && vm.defaultCustContForAddr.personId) || null,
              showContPersonEmptyState: false,
              companyName: vm.companyName,
              isMaster: true,
              mfgType: vm.mfgType
            };
            vm.customerAddresses.contactPerson = vm.defaultCustContForAddr;
          } else {
            vm.defaultCustContForAddr = null;
            vm.customerAddresses.contactPerson = null;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    const sortContactPersonList = () => {
      vm.allContactPersonList = vm.allContactPersonList.length > 0 ? _.orderBy(vm.allContactPersonList, ['contactPerson.isDefault', 'contactPerson.isPrimary', 'contactPerson.personFullName'], ['desc', 'desc', 'asc']) : [];
    };

    // open addEdit contact person popup
    vm.addEditContactPersonCallBack = (ev, callBackContactPerson) => {
      if (callBackContactPerson) {
        const objcopyContactPerson = _.find(vm.allContactPersonList, (item) => item.contactPerson.personId === callBackContactPerson.personId);
        if (objcopyContactPerson) {
          objcopyContactPerson.contactPerson = callBackContactPerson;
        }
        sortContactPersonList();
      }
    };
    // remove contact person
    vm.removePerson = (ev, callBackPerson) => {
      vm.deleteContactPersonInfo(callBackPerson, ev);
    };
    /* delete customer contact person */
    vm.deleteContactPersonInfo = (contactPerson) => {
      if (!contactPerson || !contactPerson.personId) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SOMTHING_WRONG);
        const alertModel = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(alertModel);
        return;
      }

      const selectedIDs = [contactPerson.personId];
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
      messageContent.message = stringFormat(messageContent.message, 'Contact person', selectedIDs.length);
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
          vm.cgBusyLoading = ContactPersonFactory.deleteCustomerContactPerson().query({ objIDs: objIDs }).$promise.then((res) => {
            if (res) {
              if (res.data && (res.data.length > 0 || res.data.transactionDetails)) {
                const data = {
                  TotalCount: res.data.transactionDetails[0].TotalCount,
                  pageName: 'Contact person'
                };
                BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                  const IDs = {
                    id: selectedIDs,
                    CountList: true
                  };
                  return ContactPersonFactory.deleteCustomerContactPerson().query({
                    objIDs: IDs
                  }).$promise.then((res) => {
                    let data = {};
                    data = res.data;
                    data.pageTitle = contactPerson ? contactPerson.personFullName : null;
                    data.PageName = 'Contact person';
                    data.selectedIDs = stringFormat('{0}{1}', selectedIDs.length, ' selected');
                    if (res.data) {
                      DialogFactory.dialogService(
                        USER.ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER,
                        USER.ADMIN_SHOW_TRANSACTION_DETAILS_VIEW,
                        ev,
                        data).then(() => {
                        }, () => {
                        });
                    }
                  }).catch((error) => BaseService.getErrorLog(error));
                });
              } else {
                vm.getCustomerContactDetails();
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    };
    vm.getCustomerContactDetails();

    /* called for max length validation */
    vm.getMaxLengthValidation = ((maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength));

    //redirect to Country master
    vm.goToCountryList = () => {
      BaseService.openInNew(USER.ADMIN_COUNTRY_STATE, {});
    };

    vm.goToCustTypeContPersonList = () => {
      if (data.customerType) {
        BaseService.goToCustTypeContactPersonList(data.customerType, vm.customerAddresses.customerId);
      }
    };

    vm.setDefaultPerson = (ev, callbackfn) => {
      if (callbackfn) {
        vm.setDefaultContPerson(callbackfn);
      }
    };
    // set default contact person for defined address
    vm.setDefaultContPerson = (contPersonMst) => {
      vm.cgBusyLoading = CustomerFactory.setDefaultContactPersonForCustAddr().query({
        id: vm.customerAddresses.id,
        contPersonMstId: contPersonMst.personId,
        isSetDefault: !contPersonMst.isDefault
      }).$promise.then((resp) => {
        if (resp && resp.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          contPersonMst.isDefault = !contPersonMst.isDefault;
          vm.customerAddresses.defaultContactPersonID = contPersonMst.isDefault ? contPersonMst.personId : vm.customerAddresses.defaultContactPersonID;
          vm.customerAddresses.contactPerson = contPersonMst.isDefault ? contPersonMst : vm.customerAddresses.contactPerson;
          if (vm.address) {
            vm.address.defaultContactPersonID = contPersonMst.isDefault ? contPersonMst.personId : vm.address.defaultContactPersonID;
            vm.address.contactPerson = contPersonMst.isDefault ? contPersonMst : vm.address.contactPerson;
          }
          vm.searchTxtForContPerson = null;
          vm.getCustomerContactDetails();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    // open copy Addresses popup
    vm.duplicateAddress = (ev) => {
      const sendData = {};
      sendData.addressId = vm.customerAddresses && vm.customerAddresses.id ? vm.customerAddresses.id : (data.objAddress ? data.objAddress.id : null);
      sendData.addressType = vm.customerAddresses && vm.customerAddresses.addressType ? vm.customerAddresses.addressType : data.addressType; // CORE.AddressType.BillingAddress;
      sendData.customerId = vm.customerAddresses && vm.customerAddresses.customerId ? vm.customerAddresses.customerId : data.customerId;
      sendData.companyName = data.companyName;
      sendData.companyNameWithCode = data.companyNameWithCode;
      sendData.mfgType = data.mfgType;
      sendData.isMasterPage = vm.isMasterPage;

      DialogFactory.dialogService(
        USER.ADMIN_DUPLICATE_ADDRESSS_CONTROLLER,
        USER.ADMIN_DUPLICATE_ADDRESSS_VIEW,
        ev,
        sendData).then(() => {
        }, () => {
          //if (savedAddressDet) {
          //  $scope.paramAddressDet = savedAddressDet;
          //}
          //$scope.paramAddUpdateAddrCallbackFn() ? $scope.paramAddUpdateAddrCallbackFn()(ev, savedAddressDet, $scope.paramOtherDet.addressType) : '';
        });
    };

    // set address call back data after select address
    vm.selectInterAddressCallBack = (ev, callBackAddress) => {
      if (callBackAddress) {
        setIntmdAddrDetForApplied(callBackAddress);
        setIntmdContDetForApplied(callBackAddress.contactPerson);
        // Static code to enable save button
        vm.customerBillingAddressForm.$setDirty();
      }
    };

    // after select/add/update address, set details in model
    const setIntmdAddrDetForApplied = (newApplyAddrDet) => {
      if (newApplyAddrDet) {
        vm.customerAddresses.defaultIntermediateAddressID = newApplyAddrDet.id;
        vm.customerAddresses.intermediateAddressObj = newApplyAddrDet;
        vm.intermediateAddrOtherDet.alreadySelectedAddressID = newApplyAddrDet.id;
      } else {
        vm.customerAddresses.defaultIntermediateAddressID = null;
        vm.customerAddresses.intermediateAddressObj = null;
        vm.intermediateAddrOtherDet.alreadySelectedAddressID = null;
      }
    };

    // after select/add/update address, set details in model
    const setIntmdContDetForApplied = (newApplyContDet) => {
      if (newApplyContDet) {
        vm.customerAddresses.defaultIntermediateContactPersonID = newApplyContDet.personId;
        vm.customerAddresses.intermediateContactPersonObj = angular.copy(newApplyContDet);
        vm.intermediateAddrOtherDet.alreadySelectedPersonId = vm.customerAddresses.intermediateContactPersonObj.personId;
      } else {
        vm.customerAddresses.defaultIntermediateContactPersonID = null;
        vm.customerAddresses.intermediateContactPersonObj = null;
        vm.intermediateAddrOtherDet.alreadySelectedPersonId = null;
      }
    };

    // set address call back data after select address
    vm.deleteInterAddressCallBack = (ev, callBackAddress) => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DEFINE_ADDRESS_REMOVE_CONFIRMATION);
      messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.COMMON.InternmediateAddress);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };

      DialogFactory.messageConfirmDialog(obj).then((resp) => {
        if (resp) {
          setIntmdAddrDetForApplied(null);
          setIntmdContDetForApplied(null);
          // Static code to enable save button
          vm.customerBillingAddressForm.$setDirty();
        }
      });
    };

    vm.selectInterAddressContactPersonCallBack = (ev, callBackContactPerson) => {
      if (callBackContactPerson) {
        setIntmdContDetForApplied(callBackContactPerson);
        // Static code to enable save button
        vm.customerBillingAddressForm.$setDirty();
      }
    };

    vm.deleteInterAddrContanctPersonCallBack = (ev, callBackData) => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONTACT_PERSON_FROM_ADDR);
      messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.COMMON.InternmediateAddress);

      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          setIntmdContDetForApplied(null);
          vm.customerBillingAddressForm.$setDirty();
        }
      }, () => { }).catch((error) => BaseService.getErrorLog(error));
    };
  }
})();
