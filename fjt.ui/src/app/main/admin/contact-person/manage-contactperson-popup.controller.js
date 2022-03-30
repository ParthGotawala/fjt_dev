(function () {
  'use strict';

  angular
    .module('app.admin.cotactPerson')
    .controller('ManageContactpersonPopupController', ManageContactpersonPopupController);

  /** @ngInject */
  function ManageContactpersonPopupController($mdDialog, $q, data, CORE, CustomerFactory, BaseService, $timeout, $scope, USER, DialogFactory, ContactPersonFactory, MasterFactory) {
    const vm = this;
    vm.isSubmit = false;
    vm.EmailPattern = CORE.EmailPattern;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.CORE_ContactPersonRefEntities = CORE.ContactPersonRefEntities;
    vm.LabelConstant = CORE.LabelConstant;
    vm.BUTTON_TYPE = CORE.POPUP_FOOTER_BUTTON;
    vm.contactPersonIconClass = USER.ADMIN_EMPTYSTATE.CONTACT_PERSON.ICON_CLASS;
    vm.phoneMobileFaxCategoryList = angular.copy(CORE.PhoneMobileFaxCategory);
    vm.phoneEmailEmptyMsg = angular.copy(CORE.EMPTYSTATE.PHONE_EMAIL_NOT_ADDED);
    vm.phoneEmailEmptyMsg.phoneEmptyMsg = stringFormat(vm.phoneEmailEmptyMsg.MESSAGE, 'Phone');
    vm.phoneEmailEmptyMsg.emailEmptyMsg = stringFormat(vm.phoneEmailEmptyMsg.MESSAGE, 'Email');
    vm.currentPageName = CORE.PageName.ContactPerson;
    vm.PhoneMobileFaxCategory = _.reduce(vm.phoneMobileFaxCategoryList, (obj, item) => { obj[item['objectKey']] = item; return obj; }, {});
    vm.companyName = data ? (data.companyName ? data.companyName : data.parentId ? data.parentId.companyName : null) : null;
    vm.isFromListPage = data ? data.isFromListPage : false;
    vm.isFromMasterpage = data ? data.isFromMasterpage : false;
    vm.isAddOnlyPrimaryPerson = data ? data.isAddOnlyPrimaryPerson : false;
    vm.customer_contactperson = data ? angular.copy(data) : {};
    vm.updatecontactPersonFeature = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToUpdateContactPerson);
    vm.historyactionButtonName = `${vm.currentPageName} History`;
    vm.isActiveDisabled = !vm.isFromMasterpage;
    vm.selectedRefEntity = {};
    vm.isReadOnly = false;
    vm.isContPersonUsedInTrans = false;
    vm.phoneNumberNote = null;
    vm.isDirtyPhoneDetailForm = false;
    vm.isDirtyEmailDetailForm = false;
    let oldContactPerson = '';
    vm.RadioGroup = {
      isActive: { array: CORE.ActiveRadioGroup },
      refEntityTypeRadio: angular.copy(CORE.ContactPersonEntityRadioGroup.RefEntityTypeRadio),
      eamilSettingsForContactPerson: CORE.EamilSettingsForContactPersonRadio
    };
    // Convert object to Array for Get CustomerType for redirect to Customer/ Manufacturer/Supplier.
    const refEntityTypeArray = _.reduce(vm.RadioGroup.refEntityTypeRadio, (obj, value) => {
      obj[value.mfgType] = value.Value;
      return obj;
    }, {});

    if (data && data.mfgType) {
      if ((data.mfgType === CORE.MFG_TYPE.MFG) || (data.mfgType === CORE.MFG_TYPE.CUSTOMER)) {
        vm.fromPageName = refEntityTypeArray[CORE.MFG_TYPE.MFG];
      } else if ((data.mfgType === CORE.MFG_TYPE.DIST)) {
        vm.fromPageName = refEntityTypeArray[CORE.MFG_TYPE.DIST];
      } else {
        vm.fromPageName = null;
      }
    }

    const setPageRights = (pageList) => {
      if (pageList && pageList.length > 0) {
        let pageRight = {};
        pageRight = pageList.find((a) => a.PageDetails && (a.PageDetails.pageRoute === USER.ADMIN_CONTACT_PERSON_STATE));
        vm.isReadOnly = pageRight && pageRight.RO ? true : false;
      }
    };
    if (BaseService.loginUserPageList && BaseService.loginUserPageList.length > 0) {
      setPageRights(BaseService.loginUserPageList);
    }

    /* Reset PhoneNumber Details Object */
    vm.resetPhoneNumberDetObj = (isFromReset, isResetForm) => {
      vm.phoneNumberDet = {
        category: null,
        phone: null,
        phoneCountryCode: CORE.defaultCountryCodeForPhone,
        phExtension: null
      };
      if (isFromReset) {
        vm.customer_contactpersonForm['phone'].$setValidity('intltel', true);
        $scope.$broadcast(vm.autoCompletePhoneCategory.inputName + 'ResetAutoComplete');
        $timeout(() => {
          vm.autoCompletePhoneCategory.keyColumnId = vm.phoneMobileFaxCategoryList[0].key;
          if (isResetForm) {
            resetForm();
          }
        });
        setFocus('id_contact_forcontactperson');
        vm.isDirtyPhoneDetailForm = false;
      }
    };

    /* Reset Email Details Object */
    vm.resetEmailDetObj = (isFromReset) => {
      vm.emailDet = {
        email: null
      };
      if (isFromReset) {
        vm.customer_contactpersonForm['contPersonEmail'].$setValidity('pattern', true);
        vm.customer_contactpersonForm['contPersonEmail'].$setPristine();
        vm.customer_contactpersonForm['contPersonEmail'].$setUntouched();
        setFocus('contPersonEmail');
        vm.isDirtyEmailDetailForm = false;
      }
    };

    /* Check need to disable all input: feature based. */
    const checkUpdateDisabled = () => {
      vm.isUpdateDisabled = vm.customer_contactperson.personId && !vm.updatecontactPersonFeature;
    };

    /* Check need to disable 'isActive' or 'isDefault' Checkbox */
    vm.checkIsActiveOrIsDefultDisabled = () => {
      if (vm.customer_contactperson.isDefault === true || (!vm.isFromMasterpage && !vm.customer_contactperson.personId) || vm.isAddOnlyPrimaryPerson) {
        vm.isActiveDisabled = true;
        if (vm.customer_contactperson.isActive !== true) {
          vm.customer_contactperson.isActive = true;
        }
      }
      else {
        vm.isActiveDisabled = false;
      }
      vm.isDefaultDisabled = (vm.customer_contactperson.isActive !== true || vm.oldIsDefaultValue) ? true : false;
    };

    const resetContactPersonModel = (isFromResetModel) => {
      vm.customer_contactperson = {
        refTransID: data.refTransID,
        refTableName: data.refTableName,
        firstName: data.Name || null,
        isActive: true,
        mailToCategory: vm.RadioGroup.eamilSettingsForContactPerson[0].value,
        isPrimary: vm.isAddOnlyPrimaryPerson ? true : false,
        refEntityType: vm.isFromListPage ? vm.RadioGroup.refEntityTypeRadio[1].Value : null
      };
      if (isFromResetModel && vm.isFromListPage) {
        // $scope.$broadcast(vm.autoCompleteRefEntityType.inputName + 'searchText', null);
        vm.changeRefEntityType();
      }
      vm.oldIsDefaultValue = false;
      vm.emailList = [];
      vm.phoneNumberList = [];
      vm.resetPhoneNumberDetObj(isFromResetModel, isFromResetModel);
      vm.resetEmailDetObj(isFromResetModel);
      checkUpdateDisabled();
      vm.checkIsActiveOrIsDefultDisabled();
    };

    /* Autocomplete for Contact Person Type. */
    const bindAutoCompleteRefEntityType = (refTransID) => {
      vm.autoCompleteRefEntityType = {
        columnName: 'mfgCodeName',
        keyColumnName: 'id',
        keyColumnId: refTransID || null,
        inputName: 'Contact Person Type',
        placeholderName: 'type here to search',
        isDisabled: !(vm.customer_contactperson.refEntityType && vm.refEntityType),
        isRequired: true,
        isAddnew: false,
        callbackFn: getRefEntityTypeList,
        onSelectCallbackFn: (item) => {
          vm.selectedRefEntity = {
            refTransID: item.id,
            refEntityName: item.mfgCodeName,
            refEntityType: vm.customer_contactperson.refEntityType
          };
          bindHeaderdata();
        }
      };
    };

    /* Get List Values on search for autocomplete RefEntityType */
    const getRefEntityTypeList = () => {
      const searchObj = {
        mfgType: vm.refEntityType ? vm.refEntityType.mfgType : null,
        isCustOrDisty: vm.refEntityType ? vm.refEntityType.isCustOrDisty : false
      };
      return MasterFactory.getCustomerList().query(searchObj).$promise.then((response) => {
        let refEntityTypeList = [];
        if (response && response.data && response.data.length > 0) {
          refEntityTypeList = response.data;
        }
        vm.refEntityDataList = refEntityTypeList;
        return $q.resolve(refEntityTypeList);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* Change Contact Person Type (Customer, Manufacturer / Supplier / Personnel) */
    vm.changeRefEntityType = (isBindAutocomplete) => {
      vm.refEntityType = null;
      if (vm.autoCompleteRefEntityType) {
        vm.autoCompleteRefEntityType.keyColumnId = null;
      }
      vm.isShowRefEntityType = vm.customer_contactperson.refEntityType === vm.CORE_ContactPersonRefEntities.Personnel ? false : true;
      vm.refEntityType = _.find(vm.RadioGroup.refEntityTypeRadio, (item) => item.Value === vm.customer_contactperson.refEntityType);
      vm.selectedRefEntity = {};
      bindHeaderdata();

      const autocompletePromise = [getRefEntityTypeList()];
      vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
        if (isBindAutocomplete) {
          bindAutoCompleteRefEntityType(vm.customer_contactperson.refTransID);
          vm.customer_contactperson.refTransID = null;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* Check ContactPerson used in Transaction. */
    const checkContPersonUsed = () => {
      if (vm.customer_contactperson.personId) {
        const IDs = {
          id: [vm.customer_contactperson.personId],
          CountList: true,
          isForOnlyCountList: true
        };
        vm.cgBusyLoading = ContactPersonFactory.deleteCustomerContactPerson().query({
          objIDs: IDs
        }).$promise.then((res) => {
          vm.isContPersonUsedInTrans = (res && res.data && res.data.transactionDetails && res.data.transactionDetails.length > 0) ? true : false;
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.isContPersonUsedInTrans = false;
      }
    };

    const initAutoComplete = () => {
      vm.autoCompletePhoneCategory = {
        columnName: 'value',
        keyColumnName: 'key',
        keyColumnId: vm.phoneMobileFaxCategoryList[0].key,
        inputName: 'phoneCategory',
        inputId: 'phoneCategory',
        placeholderName: 'type here to search',
        isRequired: false,
        onSelectCallbackFn: (item) => {
          vm.phoneNumberDet.category = item ? item.key : null;
          vm.isPhExtVisable = item ? item.isContainExt : false;
        }
      };
    };

    /* Header data */
    const bindHeaderdata = () => {
      if (vm.selectedRefEntity && vm.selectedRefEntity.refTransID) {
        vm.headerdata = [{
          label: vm.selectedRefEntity.refEntityType,
          value: vm.selectedRefEntity.refEntityName,
          displayOrder: 1,
          labelLinkFn: () => { vm.goToRefEntityTypeList(vm.selectedRefEntity.refEntityType); },
          valueLinkFn: () => { vm.goToManageEntity(); }
        }];
      } else {
        vm.headerdata = [];
      }
    };

    const configurePhoneEmailList = () => {
      vm.emailList = [];
      vm.phoneNumberList = [];
      try { vm.emailList = vm.customer_contactperson.email ? JSON.parse(vm.customer_contactperson.email) : []; } catch (ex) { /* Catch Error */ }
      try { vm.phoneNumberList = vm.customer_contactperson.phoneNumber ? JSON.parse(vm.customer_contactperson.phoneNumber) : []; } catch (ex) { /* Catch Error */ }
      _.each(vm.phoneNumberList, (item, index) => {
        item.tempID = (index + 1);
        item.categoryGrp = ((item.category === vm.PhoneMobileFaxCategory.workFax.key) || (item.category === vm.PhoneMobileFaxCategory.homeFax.key)) ? 'fax' : 'phone'; // Managed Group only for internal purpose for manage 'isPrimary' logic.
      });
      _.each(vm.emailList, (item, index) => { item.tempID = (index + 1); });
    };

    /* Get Contact Person Details */
    const getContactPersonDetails = () => {
      vm.cgBusyLoading = ContactPersonFactory.getContactPersonById().query({ id: vm.customer_contactperson.personId }).$promise.then((contactPersonDet) => {
        if (contactPersonDet && contactPersonDet.data) {
          vm.customer_contactperson = angular.copy(contactPersonDet.data);
          vm.isPrimary = vm.isAddOnlyPrimaryPerson ? true : vm.customer_contactperson.isPrimary;
          vm.oldIsDefaultValue = vm.customer_contactperson.isDefault;
          oldContactPerson = BaseService.applyContactPersonDispNameFormat(vm.customer_contactperson.firstName, vm.customer_contactperson.middleName, vm.customer_contactperson.lastName);
          configurePhoneEmailList();
          vm.customer_contactperson.refEntityType = data.refEntityType;
          checkUpdateDisabled();
          vm.resetPhoneNumberDetObj();
          vm.resetEmailDetObj();
          checkContPersonUsed();
          vm.checkIsActiveOrIsDefultDisabled();
          vm.copyOfCustomer_contactperson = angular.copy(vm.customer_contactperson);
          if (vm.isFromListPage) {
            vm.changeRefEntityType(true);
          } else {
            vm.isShowRefEntityType = vm.customer_contactperson.refEntityType !== vm.CORE_ContactPersonRefEntities.Personnel;
            vm.selectedRefEntity = {
              refTransID: vm.customer_contactperson.refTransID,
              refEntityName: vm.companyName,
              refEntityType: vm.fromPageName
            };
            bindHeaderdata();
          }
          initAutoComplete();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    if (vm.customer_contactperson.personId) {
      getContactPersonDetails();
    } else {
      if (vm.isAddOnlyPrimaryPerson && data.contactPersonData) {
        vm.isInUpdatemode = true;
        vm.customer_contactperson = angular.copy(data.contactPersonData);
        vm.oldIsDefaultValue = angular.copy(data.contactPersonData.isDefault);
        configurePhoneEmailList();
        vm.resetPhoneNumberDetObj(false, false);
        vm.resetEmailDetObj(false);
        checkUpdateDisabled();
        vm.checkIsActiveOrIsDefultDisabled();
      } else {
        resetContactPersonModel();
      }
      initAutoComplete();
      if (vm.isFromListPage) {
        vm.changeRefEntityType(true);
      } else {
        vm.isShowRefEntityType = vm.customer_contactperson.refEntityType !== vm.CORE_ContactPersonRefEntities.Personnel;
        vm.selectedRefEntity = {
          refTransID: vm.customer_contactperson.refTransID,
          refEntityName: vm.companyName,
          refEntityType: vm.fromPageName
        };
        bindHeaderdata();
      }
    }

    /* Function for Filter Category: In Perticular Category If PhoneNumber is not available then hide category Label. */
    vm.checkDisplayCategory = (item) => _.some(vm.phoneNumberList, (phone) => phone.category === item.key);
    /* Filter PhoneNumber List by Category. */
    vm.filterPhoneList = (categoryObj) => (item) => item.category === categoryObj.key;

    /* return Other values then isActive is Changed or Not. */
    const isValuesChangedExceptIsActive = () => {
      let isValuesChanged = false;
      if (vm.customer_contactperson && vm.copyOfCustomer_contactperson) {
        isValuesChanged = (((vm.customer_contactperson.firstName || false) !== (vm.copyOfCustomer_contactperson.firstName || false)) || ((vm.customer_contactperson.middleName || null) !== (vm.copyOfCustomer_contactperson.middleName || null)) ||
          ((vm.customer_contactperson.lastName || null) !== (vm.copyOfCustomer_contactperson.lastName || null)) || ((vm.customer_contactperson.isPrimary || null) !== (vm.copyOfCustomer_contactperson.isPrimary || null)) ||
          ((vm.customer_contactperson.isDefault || null) !== (vm.copyOfCustomer_contactperson.isDefault || null)) || ((vm.customer_contactperson.title || null) !== (vm.copyOfCustomer_contactperson.title || null)) ||
          ((vm.customer_contactperson.division || null) !== (vm.copyOfCustomer_contactperson.division || null)) || ((vm.customer_contactperson.additionalComment || null) !== (vm.copyOfCustomer_contactperson.additionalComment || null)) ||
          ((vm.customer_contactperson.email || null) !== (vm.copyOfCustomer_contactperson.email || null)) || ((vm.customer_contactperson.phoneNumber || null) !== (vm.copyOfCustomer_contactperson.phoneNumber || null)) ||
          ((vm.customer_contactperson.mobile || null) !== (vm.copyOfCustomer_contactperson.mobile || null)) || ((vm.customer_contactperson.faxNumber || null) !== (vm.copyOfCustomer_contactperson.faxNumber || null)));
      }
      return isValuesChanged;
    };

    vm.saveContactPerson = (buttonCategory) => {
      if (!vm.isReadOnly) {
        vm.isSubmit = false;
        if (BaseService.focusRequiredField(vm.customer_contactpersonForm)) {
          vm.isSubmit = true;
          if (vm.customer_contactperson.personId && !vm.checkFormDirty(vm.customer_contactpersonForm) && buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
            formatContactPersonDetails(vm.customer_contactperson);
            BaseService.currentPagePopupForm.pop();
            $mdDialog.cancel(vm.customer_contactperson);
          }
          return;
        }
        if (!vm.customer_contactpersonForm.$valid) {
          BaseService.focusRequiredField(vm.customer_contactpersonForm);
          vm.isSubmit = true;
          return;
        }

        if ((vm.phoneNumberDet && (vm.phoneNumberDet.phone || vm.phoneNumberDet.phExtension || (vm.phoneNumberDet.isPrimary !== vm.phoneNumberDet.isPrimaryDisabled))) || (vm.emailDet && (vm.emailDet.email || (vm.emailDet.isprimary !== vm.emailDet.isPrimaryDisabled)))) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.DATA_ENTERED_NOT_ADDED);
          if (vm.emailDet && (vm.emailDet.email || (vm.emailDet.isprimary !== vm.emailDet.isPrimaryDisabled))) {
            messageContent.message = stringFormat(messageContent.message, 'Email(s)');
          } else {
            messageContent.message = stringFormat(messageContent.message, 'Phone Detail(s)');
          }

          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_TRANSACTION_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_TRANSACTION_CANCEL_TEXT
          };

          DialogFactory.messageConfirmDialog(obj).then(() => {
            vm.savecustomer_contactperson(buttonCategory);
          }, () => { // Empty Block
          }).catch((error) => {
            BaseService.getErrorLog(error);
          });
        } else {
          vm.savecustomer_contactperson(buttonCategory);
        }
      }
    };

    /* Save Contact Person */
    vm.savecustomer_contactperson = (buttonCategory) => {
      vm.customer_contactperson.isPrimary = vm.isShowRefEntityType ? vm.customer_contactperson.isPrimary : false; // save isPrimary & isDefault when ref. Entity type is Supplier or manufacturer.
      vm.customer_contactperson.isDefault = vm.isShowRefEntityType ? vm.customer_contactperson.isDefault : false;
      const customer_contactpersonInfo = vm.customer_contactperson;

      if (vm.emailList && vm.emailList.length > 0) {
        const emailList = _.map(vm.emailList, (item) => ({
          email: item.email,
          isprimary: item.isprimary
        }));
        customer_contactpersonInfo.email = angular.toJson(emailList);
      } else {
        customer_contactpersonInfo.email = null;
      }

      if (vm.phoneNumberList && vm.phoneNumberList.length > 0) {
        const phoneNumberList = _.map(vm.phoneNumberList, (item) => ({
          category: item.category,
          phone: item.phone,
          phoneCountryCode: item.phoneCountryCode,
          phExtension: item.phExtension,
          isPrimary: item.isPrimary
        }));
        customer_contactpersonInfo.phoneNumber = angular.toJson(phoneNumberList);
      } else {
        customer_contactpersonInfo.phoneNumber = null;
      }

      if (vm.isFromListPage) {
        customer_contactpersonInfo.refTransID = vm.autoCompleteRefEntityType.keyColumnId;
        customer_contactpersonInfo.refTableName = vm.refEntityType.tableName;

        customer_contactpersonInfo.isRefTypeChanged = vm.copyOfCustomer_contactperson ? ((customer_contactpersonInfo.refTransID !== vm.copyOfCustomer_contactperson.refTransID) || (customer_contactpersonInfo.refTableName !== vm.copyOfCustomer_contactperson.refTableName)) : true;
        customer_contactpersonInfo.isPrimaryChanged = vm.copyOfCustomer_contactperson ? (customer_contactpersonInfo.isPrimary !== vm.copyOfCustomer_contactperson.isPrimary) : false;
        if (customer_contactpersonInfo.isRefTypeChanged && vm.copyOfCustomer_contactperson) {
          customer_contactpersonInfo.oldRefTransID = vm.copyOfCustomer_contactperson.refTransID;
          customer_contactpersonInfo.oldRefTableName = vm.copyOfCustomer_contactperson.refTableName;
        }
      }

      if (vm.isAddOnlyPrimaryPerson && !customer_contactpersonInfo.refTransID) {
        customer_contactpersonInfo.personFullName = BaseService.applyContactPersonDispNameFormat(customer_contactpersonInfo.firstName, customer_contactpersonInfo.middleName, customer_contactpersonInfo.lastName);
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel(customer_contactpersonInfo);
      } else if (customer_contactpersonInfo.personId) {
        if (vm.updatecontactPersonFeature) {
          const checkContPersonUsedPromise = [checkContPersonUsed()];
          vm.cgBusyLoading = $q.all(checkContPersonUsedPromise).then(() => {
            if (vm.isContPersonUsedInTrans || (vm.customer_contactperson.isActive !== vm.copyOfCustomer_contactperson.isActive)) {
              let messageContent = {};
              if (vm.isContPersonUsedInTrans && isValuesChangedExceptIsActive()) {
                messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.BILL_SHIP_ADDR_CHANGE_CONFIRM);
              } else if (vm.customer_contactperson.isActive !== vm.copyOfCustomer_contactperson.isActive) {
                messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.ADDRESS_CONTACT_STATUS_CHANGE);
                messageContent.message = stringFormat(messageContent.message, vm.currentPageName, (vm.customer_contactperson.isActive ? 'Inactive' : 'Active'), (vm.customer_contactperson.isActive ? 'Active' : 'Inactive'));
              }
              if (messageContent && messageContent.message) {
                const obj = {
                  messageContent: messageContent,
                  btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                  canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                };
                DialogFactory.messageConfirmDialog(obj).then((yes) => {
                  if (yes) {
                    vm.updateContactPerson(customer_contactpersonInfo, buttonCategory);
                  }
                }, () => { // Empty Block
                }).catch((error) => {
                  BaseService.getErrorLog(error);
                });
              } else {
                vm.updateContactPerson(customer_contactpersonInfo, buttonCategory);
              }
            } else {
              vm.updateContactPerson(customer_contactpersonInfo, buttonCategory);
            }
          }).catch((error) => {
            BaseService.getErrorLog(error);
          });
        }
      } else {
        vm.cgBusyLoading = CustomerFactory.customerContactperson().save(customer_contactpersonInfo).$promise.then((contact) => {
          if (contact && contact.status === CORE.ApiResponseTypeStatus.SUCCESS && contact.data) {
            vm.oldIsDefaultValue = vm.customer_contactperson.isDefault = contact.data.isDefault;
            formatContactPersonDetails(contact.data);
            if (vm.isAddOnlyPrimaryPerson) {
              BaseService.currentPagePopupForm.pop();
              $mdDialog.cancel(contact.data);
            }
            vm.saveAndProceed(buttonCategory, contact.data);
          }
        }).catch((error) => {
          BaseService.getErrorLog(error);
        });
      }
    };

    vm.updateContactPerson = (customer_contactpersonInfo, buttonCategory) => {
      vm.cgBusyLoading = CustomerFactory.customerContactperson().update({
        personId: customer_contactpersonInfo.personId
      }, customer_contactpersonInfo).$promise.then((response) => {
        if (response && response.data) {
          formatContactPersonDetails(customer_contactpersonInfo);
          vm.oldIsDefaultValue = vm.customer_contactperson.isDefault = response.data.isDefault;
          vm.saveAndProceed(buttonCategory, customer_contactpersonInfo);
        }
      }).catch((error) => {
        BaseService.getErrorLog(error);
      });
    };

    // to format name, email etc details for contact person
    const formatContactPersonDetails = (contItem) => {
      contItem.personFullName = BaseService.applyContactPersonDispNameFormat(contItem.firstName, contItem.middleName, contItem.lastName);
      let allEmails = null;
      if (contItem.email) {
        try {
          allEmails = JSON.parse(contItem.email);
        } catch (ex) {
          // catch error
        }
      }
      contItem.emailList = allEmails && allEmails.length > 0 ? _.map(allEmails, 'email').join(', ') : null;
      contItem.phoneList = BaseService.convertJsonPhoneNumberToSting(contItem.phoneNumber);
    };

    /* Manage Add Contact Person Btn and After Save manage need to close popup or not. */
    vm.saveAndProceed = (buttonCategory, data) => {
      if (buttonCategory === vm.BUTTON_TYPE.SAVE) {
        vm.resetPhoneNumberDetObj(true, true);
        vm.resetEmailDetObj(true);
        data.refEntityType = vm.customer_contactperson.refEntityType;
        vm.customer_contactperson = angular.copy(data);
        vm.copyOfCustomer_contactperson = angular.copy(vm.customer_contactperson);
        oldContactPerson = BaseService.applyContactPersonDispNameFormat(vm.customer_contactperson.firstName, vm.customer_contactperson.middleName, vm.customer_contactperson.lastName);
        checkUpdateDisabled();
        vm.checkIsActiveOrIsDefultDisabled();
      } else if (buttonCategory === vm.BUTTON_TYPE.ADDNEW) {
        const isdirty = vm.customer_contactpersonForm.$dirty;
        if (isdirty) {
          const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_RESET_BODY_MESSAGE);
          const obj = {
            messageContent: messgaeContent,
            btnText: CORE.MESSAGE_CONSTANT.RESET_POPUP_BUTTON,
            canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
          };
          DialogFactory.messageConfirmDialog(obj).then(() => {
            resetForm();
            resetContactPersonModel(true);
            checkContPersonUsed();
            setFocus(vm.isFromListPage ? 'refTransType' : 'contPersonActive');
          }, () => { // Empty Block
          }, (error) => BaseService.getErrorLog(error));
        } else {
          resetForm();
          resetContactPersonModel(true);
          checkContPersonUsed();
        }
      } else if (buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel(data);
      }
      setFocus(vm.isFromListPage ? 'refTransType' : 'contPersonActive');
    };

    /* Edit Phone number */
    vm.editPhoneNumber = (item) => {
      vm.phoneNumberDet = angular.copy(item);
      vm.phoneNumberDet.phone = removeDialCodeForPhnData('id_contact_forcontactperson', vm.phoneNumberDet.phone);
      vm.phoneNumberDet.isPrimaryDisabled = item.isPrimary;
      vm.phoneNumberDet.categoryGrp = item.categoryGrp;
      vm.autoCompletePhoneCategory.keyColumnId = vm.phoneNumberDet.category;
      const categoryObj = _.find(vm.phoneMobileFaxCategoryList, (category) => category.key === item.category);
      vm.isPhExtVisable = categoryObj ? categoryObj.isContainExt : false;
      setFocus('id_contact_forcontactperson');
    };

    /* Set Primary Phone Number */
    vm.setPhoneNumberAsPrimary = (item) => {
      if (item) {
        const primaryPhoneNumber = _.find(vm.phoneNumberList, (obj) => (obj.isPrimary && (obj.categoryGrp === item.categoryGrp)));
        if (primaryPhoneNumber) {
          primaryPhoneNumber.isPrimary = false;
        }
        if (item.tempID === vm.phoneNumberDet.tempID) {
          vm.phoneNumberDet.isPrimaryDisabled = vm.phoneNumberDet.isPrimary = true;
        } else if ((vm.phoneNumberDet.categoryGrp === item.categoryGrp) && vm.phoneNumberDet.isPrimary) {
          vm.phoneNumberDet.isPrimaryDisabled = vm.phoneNumberDet.isPrimary = false;
        }
        item.isPrimaryDisabled = item.isPrimary = true;
        vm.customer_contactperson.phoneNumberChanged = true;
        const phoneNumberControl = _.find(vm.customer_contactpersonForm.$$controls, (ctrl) => ctrl.$name === 'phoneNumberChanged');
        phoneNumberControl.$setDirty();
      }
    };

    /* Add/Update Phone number */
    vm.addPhoneNumberToList = () => {
      let phoneNumberControl;
      if (!vm.phoneNumberDet.phone || !vm.phoneNumberDet.phone.trim() || !vm.customer_contactpersonForm['phone'].$valid ||
        !vm.phoneNumberDet.category) {
        if (!vm.phoneNumberDet.phone || !vm.phoneNumberDet.phone.trim() || !vm.customer_contactpersonForm['phone'].$valid) {
          vm.customer_contactpersonForm['phone'].$setTouched();
          vm.customer_contactpersonForm['phone'].$setValidity('intltel', false);
          setFocus('id_contact_forcontactperson');
        }
        if (!vm.phoneNumberDet.category) {
          vm.phoneCategoryForm['vm.autocompleteDetail']['phoneCategory'].$setValidity('md-require-match', false);
          if (vm.phoneNumberDet.phone && vm.phoneNumberDet.phone.trim() && vm.customer_contactpersonForm['phone'].$valid) {
            setFocus('phoneCategory');
          }
        }
        return;
      }
      const phone = addDialCodeForPhnData('id_contact_forcontactperson', vm.phoneNumberDet.phone);

      const checkDuplicate = _.find(vm.phoneNumberList, (obj) => obj.tempID !== vm.phoneNumberDet.tempID && obj.phone === phone && obj.category === vm.phoneNumberDet.category && ((obj.phExtension || null) === (vm.phoneNumberDet.phExtension || null)));
      if (checkDuplicate) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALREADY_EXISTS);
        messageContent.message = stringFormat(messageContent.message, 'Phone ' + phone);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model).then(() => {
          vm.resetPhoneNumberDetObj(true);
        });
      } else {
        // Add / Update Category Group. (Managed Group only for internal purpose for manage 'isPrimary' logic.)
        vm.phoneNumberDet.categoryGrp = ((vm.phoneNumberDet.category === vm.PhoneMobileFaxCategory.workFax.key) || (vm.phoneNumberDet.category === vm.PhoneMobileFaxCategory.homeFax.key)) ? 'fax' : 'phone';

        // Give Alert if First added Phone / Fax is not Set as Primary.
        const isFoundPrimary = (vm.phoneNumberDet.isPrimary || (_.some(vm.phoneNumberList, (item) => ((item.categoryGrp === vm.phoneNumberDet.categoryGrp) && item.isPrimary))));
        if (isFoundPrimary) {
          // Remove other Primary Phone / Fax.
          if (vm.phoneNumberDet.isPrimary) {
            _.each(vm.phoneNumberList, (item) => {
              if (item.categoryGrp === vm.phoneNumberDet.categoryGrp) {
                item.isPrimary = false;
              }
            });
          }

          const phoneObj = _.find(vm.phoneNumberList, (obj) => obj.tempID === vm.phoneNumberDet.tempID);
          if (phoneObj) {
            phoneObj.phone = phone;
            phoneObj.category = vm.phoneNumberDet.category;
            phoneObj.phoneCountryCode = vm.phoneNumberDet.phone ? vm.phoneNumberDet.phoneCountryCode : null;
            phoneObj.phExtension = vm.phoneNumberDet.phExtension;
            phoneObj.isPrimary = vm.phoneNumberDet.isPrimary || false;
            phoneObj.categoryGrp = vm.phoneNumberDet.categoryGrp;
          } else {
            vm.phoneNumberList.push({
              phone: phone,
              category: vm.phoneNumberDet.category,
              phoneCountryCode: vm.phoneNumberDet.phone ? vm.phoneNumberDet.phoneCountryCode : null,
              phExtension: vm.phoneNumberDet.phExtension,
              isPrimary: vm.phoneNumberDet.isPrimary || false,
              categoryGrp: vm.phoneNumberDet.categoryGrp,
              tempID: (vm.phoneNumberList.length + 1)
            });
          }
          vm.customer_contactperson.phoneNumberChanged = true;
          phoneNumberControl = _.find(vm.customer_contactpersonForm.$$controls, (ctrl) => ctrl.$name === 'phoneNumberChanged');
          phoneNumberControl.$setDirty();
          vm.resetPhoneNumberDetObj(true);
        } else {
          const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.FIRST_EMAIL_PHONE_PRIMARY_REQUIRED);
          messgaeContent.message = stringFormat(messgaeContent.message, vm.phoneNumberDet.categoryGrp === 'phone' ? 'Phone' : 'Fax');
          const model = {
            messageContent: messgaeContent
          };
          return DialogFactory.messageAlertDialog(model).then(() => {
            // Empty Block.
          });
        }
      }
    };

    /* Remove Phone number from list */
    vm.removePhoneNumber = (item) => {
      let phoneNumberControl;
      if (item) {
        vm.customer_contactpersonForm.$setDirty(true);
        vm.customer_contactperson.phoneNumberChanged = true;
        phoneNumberControl = _.find(vm.customer_contactpersonForm.$$controls, (ctrl) => ctrl.$name === 'phoneNumberChanged');
        phoneNumberControl.$setDirty();
        vm.phoneNumberList.splice((item.tempID - 1), 1);

        if (item.isPrimary) {
          const phoneObj = _.find(vm.phoneNumberList, (phoneObj) => phoneObj.categoryGrp === item.categoryGrp);
          if (phoneObj) {
            phoneObj.isPrimary = true;
            if (phoneObj.tempID === vm.phoneNumberDet.tempID) {
              vm.phoneNumberDet.isPrimaryDisabled = vm.phoneNumberDet.isPrimary = true;
            }
          }
        }
        if (item.tempID === vm.phoneNumberDet.tempID) {
          vm.resetPhoneNumberDetObj(true);
        }

        _.each(vm.phoneNumberList, (item, index) => {
          item.tempID = (index + 1);
        });
        setFocus('id_contact_forcontactperson');
      }
    };

    /* Remove All Phone Number */
    vm.removeAllPhoneNumber = () => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.REMOVE_ALL_CONFIRMATION);
      messageContent.message = stringFormat(messageContent.message, 'Phone Number(s)');
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_TRANSACTION_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_TRANSACTION_CANCEL_TEXT
      };

      DialogFactory.messageConfirmDialog(obj).then(() => {
        if (vm.phoneNumberList && vm.phoneNumberList.length > 0) {
          vm.phoneNumberList = [];
          vm.customer_contactperson.phoneNumberChanged = true;
          const phoneNumberControl = _.find(vm.customer_contactpersonForm.$$controls, (ctrl) => ctrl.$name === 'phoneNumberChanged');
          phoneNumberControl.$setDirty();
        }
        vm.resetPhoneNumberDetObj(true);
      }, () => { //Empty Block
      }).catch((error) => {
        BaseService.getErrorLog(error);
      });
    };

    /* Edit Email */
    vm.editEmail = (item) => {
      vm.emailDet = angular.copy(item);
      vm.emailDet.isPrimaryDisabled = item.isprimary;
      setFocus('contPersonEmail');
    };

    /* Set Primary Email */
    vm.setEmailAsPrimary = (item) => {
      if (item) {
        const primaryEmail = _.find(vm.emailList, (obj) => obj.isprimary);
        if (primaryEmail) {
          primaryEmail.isprimary = false;
        }
        if (item.tempID === vm.emailDet.tempID) {
          vm.emailDet.isPrimaryDisabled = vm.emailDet.isprimary = true;
        } else if (vm.emailDet.isprimary) {
          vm.emailDet.isPrimaryDisabled = vm.emailDet.isprimary = false;
        }
        item.isprimary = true;
        vm.customer_contactperson.emailChanged = true;
        const emailControl = _.find(vm.customer_contactpersonForm.$$controls, (ctrl) => ctrl.$name === 'emailChanged');
        emailControl.$setDirty();
      }
    };

    /* On Enter key add Email to Email List. */
    vm.addEmailToListOnEnter = () => {
      vm.addEmailToList();
    };

    /* Add/Update Eamil */
    vm.addEmailToList = () => {
      let emailControl;
      vm.isDisableEmail = true;
      if (!vm.emailDet.email || !vm.emailDet.email.trim() || !vm.customer_contactpersonForm['contPersonEmail'].$valid) {
        vm.isDisableEmail = false;
        vm.customer_contactpersonForm['contPersonEmail'].$setTouched();
        vm.customer_contactpersonForm['contPersonEmail'].$setValidity('pattern', false);
        setFocus('contPersonEmail');
        return;
      }
      vm.isDisableEmail = false;
      const checkDuplicate = _.find(vm.emailList, (obj) => obj.tempID !== vm.emailDet.tempID && obj.email === vm.emailDet.email);

      if (checkDuplicate) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALREADY_EXISTS);
        messageContent.message = stringFormat(messageContent.message, 'Email ' + vm.emailDet.email);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model).then(() => {
          vm.resetEmailDetObj(true);
        });
      } else {
        // Give Alert if First added Phone / Fax is not Set as Primary.
        const isFirstemailNotPrimary = (!vm.emailDet.isprimary && (vm.emailList.length === 0));
        if (isFirstemailNotPrimary) {
          const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.FIRST_EMAIL_PHONE_PRIMARY_REQUIRED);
          messgaeContent.message = stringFormat(messgaeContent.message, 'Email');
          const model = {
            messageContent: messgaeContent
          };
          return DialogFactory.messageAlertDialog(model).then(() => {
            // Empty Block.
          });
        } else {
          if (vm.emailDet.isprimary) {
            _.each(vm.emailList, (item) => {
              item.isprimary = false;
            });
          }
          const emailObj = _.find(vm.emailList, (obj) => obj.tempID === vm.emailDet.tempID);
          if (emailObj) {
            emailObj.email = vm.emailDet.email;
            emailObj.isprimary = vm.emailDet.isprimary;
          } else {
            vm.emailList.push({
              email: vm.emailDet.email,
              isprimary: vm.emailList.length === 0 ? true : vm.emailDet.isprimary,
              tempID: (vm.emailList.length + 1)
            });
          }
          vm.customer_contactperson.emailChanged = true;
          emailControl = _.find(vm.customer_contactpersonForm.$$controls, (ctrl) => ctrl.$name === 'emailChanged');
          emailControl.$setDirty();
          vm.resetEmailDetObj(true);
        }
      }
    };

    /* Remove Email from list */
    vm.removeEmail = (item, index) => {
      let emailControl;
      if (item) {
        vm.customer_contactpersonForm.$setDirty(true);
        vm.customer_contactperson.emailChanged = true;
        emailControl = _.find(vm.customer_contactpersonForm.$$controls, (ctrl) => ctrl.$name === 'emailChanged');
        emailControl.$setDirty();
        vm.emailList.splice(index, 1);

        if (item.isprimary) {
          vm.emailList[0].isprimary = true;
          if (vm.emailList[0].tempID === vm.emailDet.tempID) {
            vm.emailDet.isPrimaryDisabled = vm.emailDet.isprimary = true;
          }
        }
        if (item.tempID === vm.emailDet.tempID) {
          vm.resetEmailDetObj(true);
        }

        _.each(vm.emailList, (item, index) => {
          item.tempID = (index + 1);
        });
        setFocus('contPersonEmail');
      }
    };

    /* Remove All Email */
    vm.removeAllEmail = () => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.REMOVE_ALL_CONFIRMATION);
      messageContent.message = stringFormat(messageContent.message, 'Email(s)');
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_TRANSACTION_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_TRANSACTION_CANCEL_TEXT
      };

      DialogFactory.messageConfirmDialog(obj).then(() => {
        if (vm.emailList && vm.emailList.length > 0) {
          vm.emailList = [];
          vm.customer_contactperson.emailChanged = true;
          const emailControl = _.find(vm.customer_contactpersonForm.$$controls, (ctrl) => ctrl.$name === 'emailChanged');
          emailControl.$setDirty();
        }
        vm.resetEmailDetObj(true);
      }, () => {//Empty Block
      }).catch((error) => {
        BaseService.getErrorLog(error);
      });
    };

    /* Reset Customer Form Set Pristine and Untouched */
    const resetForm = () => {
      vm.customer_contactpersonForm.$setPristine();
      vm.customer_contactpersonForm.$setUntouched();
    };

    /*Used to close-pop-up*/
    vm.cancel = () => {
      const isDirty = vm.checkFormDirty(vm.customer_contactpersonForm);
      if (isDirty) {
        const data = {
          form: vm.customer_contactpersonForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };

    vm.checkFormDirty = (form, columnName) => BaseService.checkFormDirty(form, columnName);

    /* called for max length validation */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    /* show phone number color legend on click of pallet icon */
    vm.showColorLengend = (ev) => {
      const data = {
        pageName: 'Phone Type',
        legendList: CORE.LegendList.phoneCategory
      };
      DialogFactory.dialogService(
        CORE.LEGEND_MODAL_CONTROLLER,
        CORE.LEGEND_MODAL_VIEW,
        ev,
        data).then(() => {
          //sucess section
        }, (error) => BaseService.getErrorLog(error));
    };

    /* Create Duplicate Contact Person. */
    vm.createDuplicateContactPerson = (ev) => {
      const contactPersonData = {
        personId: vm.copyOfCustomer_contactperson ? vm.copyOfCustomer_contactperson.personId : null,
        refEntityType: vm.copyOfCustomer_contactperson ? vm.copyOfCustomer_contactperson.refEntityType : null,
        isFromListPage: data.isFromListPage,
        isFromMasterpage: data.isFromMasterpage,
        isAddOnlyPrimaryPerson: data.isAddOnlyPrimaryPerson
      };

      DialogFactory.dialogService(
        USER.ADMIN_DUPLICATE_CONTACTPERSON_MODAL_CONTROLLER,
        USER.ADMIN_DUPLICATE_CONTACTPERSON_MODAL_VIEW,
        ev,
        contactPersonData).then(() => {//Empty Block
        }, (data) => {
          if (data && data.personId) {
            vm.isDuplicateActionPerformed = true;
            if (data.isDefault) {
              vm.oldIsDefaultValue = vm.copyOfCustomer_contactperson.isDefault = vm.customer_contactperson.isDefault = false;
              vm.checkIsActiveOrIsDefultDisabled();
            }
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    /* Show History Popup */
    vm.openContactPersonHistoryPopup = (ev) => {
      const data = {
        id: vm.customer_contactperson.personId,
        title: vm.historyactionButtonName,
        TableName: CORE.DATAENTRYCHANGE_AUDITLOG_TABLENAME.CONTACT_PERSON,
        EmptyMesssage: stringFormat(CORE.COMMON_HISTORY.MESSAGE, `${vm.currentPageName} history`),
        headerData: [{
          label: vm.currentPageName,
          value: oldContactPerson,
          displayOrder: 1,
          labelLinkFn: vm.goToContactPersonList
        }]
      };

      DialogFactory.dialogService(
        CORE.COMMON_HISTORY_POPUP_MODAL_CONTROLLER,
        CORE.COMMON_HISTORY_POPUP_MODAL_VIEW,
        ev,
        data).then(() => { //Empty Block
        }, (err) => BaseService.getErrorLog(err));
    };

    /* Go To Contact Person List */
    vm.goToContactPersonList = () => {
      BaseService.goToContactPersonList();
    };

    /* Go to Ref EntityType List. */
    vm.goToRefEntityTypeList = (refEntityType) => {
      if (refEntityType === CORE.ContactPersonRefEntities.CustomerAndManufacturer) {
        BaseService.goToManufacturerList();
      } else if (refEntityType === CORE.ContactPersonRefEntities.Supplier) {
        BaseService.goToSupplierList();
      } else if (refEntityType === CORE.ContactPersonRefEntities.Personnel) {
        BaseService.goToPersonnelList();
      }
      return;
    };

    vm.goToManageEntity = () => {
      if (vm.selectedRefEntity.refEntityType === refEntityTypeArray.DIST) {
        BaseService.goToSupplierDetail(vm.selectedRefEntity.refTransID);
      } else if (vm.selectedRefEntity.refEntityType === refEntityTypeArray.MFG) {
        BaseService.goToManufacturer(vm.selectedRefEntity.refTransID);
      }
      return;
    };

    vm.checkCopyStatus = () => { vm.copystatus = false; };
    vm.copyPhoneNumber = ($event, item) => { $event.stopPropagation(); copyTextForWindow(item); vm.copystatus = true; };

    //Set as current form when page loaded
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.customer_contactpersonForm);
    });
  }
})();
