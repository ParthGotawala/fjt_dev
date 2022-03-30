(function () {
  'use strict';

  angular
    .module('app.transaction.receivingmaterial')
    .controller('AddSupplierQuotePopUpController', AddSupplierQuotePopUpController);

  function AddSupplierQuotePopUpController($mdDialog, $timeout, $q, CORE, BaseService, data, USER, MasterFactory, SupplierQuoteFactory, DialogFactory, CustomerFactory) {
    const vm = this;
    vm.supplierQuote = {};
    vm.saveDisable = false;
    vm.supplierQuoteStaus = CORE.SupplierQuoteWorkingStatus;
    vm.LabelConstant = CORE.LabelConstant;
    vm.DATE_PICKER = CORE.DATE_PICKER;
    vm.IsPickerOpen = {};
    vm.IsPickerOpen[vm.DATE_PICKER.quoteDate] = false;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.autoFocusSupplier = true;
    vm.supplierQuote.quoteDate = new Date();
    vm.clickCancel = false;
    const groupConcatSeparatorValue = _groupConcatSeparatorValue;
    vm.quoteDateOptions = {
      maxDate: new Date()
    };
    vm.supplierQuote.quoteStatus = vm.supplierQuoteStaus[0].ID;
    const alternateMFRPNList = [];
    if (data.mfgPN && !data.mfgCode) {
      const items = data.mfgPN.split(groupConcatSeparatorValue);
      _.each(items, (alternate) => {
        let mfgpartNumber = '';
        let mfgCode = '';
        var altPart = alternate.split('@@@');
        if (altPart) {
          if (altPart.length > 22 && altPart[22]) {
            mfgpartNumber = altPart[22].split('***').join(',');
            if (mfgpartNumber) {
              mfgpartNumber = mfgpartNumber.split('..').join(',');
            }
          }
          if (altPart.length > 23 && altPart[23]) {
            mfgCode = altPart[23];
          }
          const componentObj = {
            MFRPN: mfgpartNumber,
            MFR: mfgCode
          };
          alternateMFRPNList.push(componentObj);
        }
      });
    } else {
      const componentObj = {
        MFRPN: data.mfgPN,
        MFR: data.mfgCode
      };
      alternateMFRPNList.push(componentObj);
    }

    /** Get supplier list */
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

    function selectedSupplierDetails(item) {
      if (item) {
        if (vm.supplierQuote.quoteNumber && vm.formAddSupplierQuote.$dirty) {
          vm.checkQuoteNumberUnique();
        }
        vm.supplierQuote.supplierID = item.id;
        vm.supplierQuote.mfgName = item.mfgName;
        const autocompletePromise = [getSupplierAddress(item.id)];
        vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.supplierQuote.supplierID = null;
        vm.supplierQuote.mfgName = null;
        vm.supplierQuote.billingAddressID = null;
        vm.supplierQuote.billingAddress = null;
        vm.supplierQuote.billingContactPersonID = null;
        vm.supplierQuote.billingContactPerson = null;
        vm.supplierQuote.shippingAddressID = null;
        vm.supplierQuote.shippingAddress = null;
        vm.supplierQuote.shippingContactPersonID = null;
        vm.supplierQuote.shippingContactPerson = null;
      }
    };

    /** Initialize auto-complete */
    function initAutoComplete() {
      /** Auto-complete for supplier */
      vm.autoCompleteSupplier = {
        columnName: 'mfgCodeName',
        controllerName: CORE.MANAGE_MFGCODE_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_MFGCODE_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.supplierQuote && vm.supplierQuote.supplierID ? vm.supplierQuote.supplierID : null,
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
        onSelectCallbackFn: selectedSupplierDetails
      };
    };

    const autocompletePromise = [getSupplierList()];
    vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
      initAutoComplete();
    }).catch((error) => BaseService.getErrorLog(error));

    vm.checkQuoteNumberUnique = () => {
      $timeout(() => {
        if (!vm.clickCancel && vm.supplierQuote.quoteNumber && vm.autoCompleteSupplier.keyColumnId) {
          const checkObject = {
            id: vm.supplierQuote.id ? vm.supplierQuote.id : null,
            quoteNumber: vm.supplierQuote.quoteNumber,
            supplierID: vm.autoCompleteSupplier.keyColumnId
          };
          vm.cgBusyLoading = SupplierQuoteFactory.checkUniqueSupplierQuoteNumber().query(checkObject).$promise.then((response) => {
            if (response.data && response.data.length > 0) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
              messageContent.message = stringFormat(messageContent.message, `Supplier wise ${vm.LabelConstant.SupplierQuote.Quote}`);
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              DialogFactory.messageAlertDialog(model).then((yes) => {
                if (yes) {
                  vm.supplierQuote.quoteNumber = null;
                  setFocus('quoteNumber');
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }, 200);
    };

    const getSupplierAddress = (id) => CustomerFactory.customerAddressList().query({
      customerId: id || vm.autoCompleteSupplier.keyColumnId,
      addressType: [CORE.AddressType.ShippingAddress, CORE.AddressType.BusinessAddress],
      refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
      onlyDefault: true
    }).$promise.then((customeraddress) => {
      vm.shippingAddressList = _.filter(customeraddress.data, (item) => item.addressType === CORE.AddressType.ShippingAddress);
      vm.billingAddressList = _.filter(customeraddress.data, (item) => item.addressType === CORE.AddressType.BusinessAddress);
      // set bill to address
      const defaultBillToAddrDet = _.find(vm.billingAddressList, (addrItem) => addrItem.isDefault);
      if (defaultBillToAddrDet) {
        vm.supplierQuote.billingAddressID = defaultBillToAddrDet.id;
        vm.supplierQuote.billingAddress = BaseService.generateAddressFormateToStoreInDB(vm.billingAddress);
        if (defaultBillToAddrDet.contactPerson) {
          vm.supplierQuote.billingContactPersonID = defaultBillToAddrDet.contactPerson.personId;
          vm.supplierQuote.billingContactPerson = defaultBillToAddrDet.contactPerson ? BaseService.generateContactPersonDetFormat(defaultBillToAddrDet.contactPerson) : null;
        }
      }
      // set ship to address
      const defaultShipToAddrDet = _.find(vm.shippingAddressList, (addrItem) => addrItem.isDefault);
      if (defaultShipToAddrDet) {
        vm.supplierQuote.shippingAddressID = defaultShipToAddrDet.id;
        vm.supplierQuote.shippingAddress = BaseService.generateAddressFormateToStoreInDB(vm.billingAddress);
        if (defaultShipToAddrDet.contactPerson) {
          vm.supplierQuote.shippingContactPersonID = defaultShipToAddrDet.contactPerson.personId;
          vm.supplierQuote.shippingContactPerson = defaultShipToAddrDet.contactPerson ? BaseService.generateContactPersonDetFormat(defaultShipToAddrDet.contactPerson) : null;
        }
      }
      return $q.resolve(customeraddress.data);
    }).catch((error) => BaseService.getErrorLog(error));

    vm.addSupplierQuote = () => {
      vm.saveDisable = true;
      if (BaseService.focusRequiredField(vm.formAddSupplierQuote)) {
        vm.saveDisable = false;
        return;
      }
      if (!checkAddressValidation()) {
        vm.manageSupplierQuoteDetail();
      }
    };

    vm.manageSupplierQuoteDetail = () => {
      vm.supplierQuote.gencFileOwnerType = vm.entityName;
      vm.supplierQuote.quoteDate = BaseService.getAPIFormatedDate(vm.supplierQuote.quoteDate);
      vm.cgBusyLoading = SupplierQuoteFactory.manageSupplierQuoteDetail().query(vm.supplierQuote).$promise.then((response) => {
        vm.saveDisable = false;
        if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          vm.supplierQuote.id = response.data.id;
          vm.clickCancel = false;
          BaseService.currentPagePopupForm = [];
          const MFRPN = stringFormat('{0}###{1}', alternateMFRPNList[0].MFR, alternateMFRPNList[0].MFRPN);
          $mdDialog.hide({ id: vm.supplierQuote.id, component: MFRPN });
        } else if (response.status === CORE.ApiResponseTypeStatus.EMPTY && response.errors.data && response.errors.data.quoteNumber) {
          vm.supplierQuote.quoteNumber = null;
          setFocus('quoteNumber');
          vm.clickCancel = false;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const checkAddressValidation = () => {
      vm.saveDisable = true;
      let label;
      if (vm.supplierQuote.shippingAddressID || vm.supplierQuote.billingAddressID) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ADDRESS_CONTACT_PERSON_REQUIRED_FOR_STATUS);
        if ((vm.supplierQuote.billingAddressID && !vm.supplierQuote.billingContactPersonID) || (!vm.supplierQuote.billingAddressID && vm.supplierQuote.billingContactPersonID)) {
          label = (vm.supplierQuote.billingAddressID && !vm.supplierQuote.billingContactPersonID) ? vm.LabelConstant.Address.BusinessAddress + ' ' + CORE.PAGENAME_CONSTANT[67].PageName : vm.LabelConstant.Address.BusinessAddress;
          messageContent.message = stringFormat(messageContent.message, label);
          const obj = {
            multiple: true,
            messageContent: messageContent
          };
          return DialogFactory.messageAlertDialog(obj).then(() => {
            vm.saveDisable = false;
            return true;
          });
        } else if ((vm.supplierQuote.shippingAddressID && !vm.supplierQuote.shippingContactPersonID) || (!vm.supplierQuote.shippingAddressID && vm.supplierQuote.shippingContactPersonID)) {
          label = (vm.supplierQuote.shippingAddressID && !vm.supplierQuote.shippingContactPersonID) ? vm.LabelConstant.Address.ShippingAddress + ' ' + CORE.PAGENAME_CONSTANT[67].PageName : vm.LabelConstant.Address.ShippingAddress;
          messageContent.message = stringFormat(messageContent.message, label);
          const obj = {
            multiple: true,
            messageContent: messageContent
          };
          return DialogFactory.messageAlertDialog(obj).then(() => {
            vm.saveDisable = false;
            return true;
          });
        } else {
          vm.saveDisable = false;
          return false;
        }
      } else {
        vm.saveDisable = false;
        return false;
      }
    };

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.formAddSupplierQuote, vm.checkDirtyObject);
      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        $mdDialog.cancel();
      }
    };

    vm.checkFormDirty = (form, columnName) => BaseService.checkFormDirty(form, columnName);

    /* For max length validation */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    vm.goToCustomerList = () => {
      BaseService.goToCustomerList();
    };

    vm.goToAssayList = () => {
      BaseService.openInNew(USER.ADMIN_MFG_COMPONENT_STATE, {});
    };

    //link to go supplier list page
    vm.goToSupplierList = () => {
      BaseService.goToSupplierList();
    };

    /** Validate max size */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    // Check Form Dirty state on state change and reload browser
    angular.element(() => {
      BaseService.currentPagePopupForm = [vm.formAddSupplierQuote];
    });
  }
})();
