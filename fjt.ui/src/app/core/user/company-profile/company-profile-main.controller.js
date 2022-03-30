(function () {
  'use strict';

  angular
    .module('app.companyprofile')
    .controller('CompanyProfileController', CompanyProfileController);

  /** @ngInject */
  function CompanyProfileController($scope, $timeout, BaseService, CORE, USER, DASHBOARD, $state, CompanyProfileFactory, $stateParams, ManufacturerFactory, DialogFactory) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.loginUser = BaseService.loginUser;
    vm.LabelConstant = CORE.LabelConstant;
    vm.loginUserID = BaseService.loginUser.userid;
    vm.userID = BaseService.loginUser.employee.id;
    vm.DetailsTabName = CORE.CompanyProfileTabs.Details;
    vm.addressesTabName = CORE.CompanyProfileTabs.Addresses;
    vm.remittanceAddressTabName = CORE.CompanyProfileTabs.RemittanceAddress;
    vm.contactsTabName = CORE.CompanyProfileTabs.Contacts;
    vm.companyPreferenceTabName = CORE.CompanyProfileTabs.CompanyPreference;
    vm.isDetailTab = false;
    vm.isAddressesTab = false;
    vm.isRemittanceAddressTab = false;
    vm.isCompanyPreferenceTab = false;
    vm.saveDisable = false;
    vm.addressType = CORE.AddressType;
    $scope.splitPaneFirstProperties = {};
    $scope.splitPaneSecondProperties = {};
    //$scope.splitPaneThirdProperties = {};
    //$scope.splitPaneFourthProperties = {};
    $scope.splitSubPaneFirstProperties = {};
    $scope.splitSubPaneSecondProperties = {};
    $scope.splitSubPaneThirdProperties = {};
    $scope.splitSubPaneFourthProperties = {};

    vm.GoToHome = () => {
      $state.go(DASHBOARD.DASHBOARD_STATE);
      BaseService.currentPageForms = [];
    };
    vm.tabName = $stateParams.selectedTab;
    vm.pageTabRights =
    {
      DetailTab: false,
      AddressesTab: false,
      RemittanceAddressTab: false,
      CompanyPreferenceTab: false
    };

    if (vm.tabName) {
      const tab = _.find(CORE.CompanyProfileTabs, (item) => item.Name === vm.tabName);
      if (tab) {
        vm.selectedTabIndex = tab.ID;
      }
    };

    const setAddressesData = () => {
      vm.billingAddressData = {
        addressType: CORE.AddressType.BillingAddress,
        customerId: vm.mfgCodeId,
        isMasterPage: true,
        alreadySelectedAddressID: null,
        companyNameWithCode: vm.companyNameWithCode,
        companyName: vm.customer.mfgName,
        mfgType: vm.customer.mfgType
      };
      vm.shippingAddressData = {
        addressType: CORE.AddressType.ShippingAddress,
        customerId: vm.mfgCodeId,
        isMasterPage: true,
        alreadySelectedAddressID: null,
        companyNameWithCode: vm.companyNameWithCode,
        companyName: vm.customer.mfgName,
        mfgType: vm.customer.mfgType
      };
      vm.payToAddressData = {
        addressType: CORE.AddressType.PayToInformation,
        customerId: vm.mfgCodeId,
        isMasterPage: true,
        alreadySelectedAddressID: null,
        companyNameWithCode: vm.companyNameWithCode,
        companyName: vm.customer.mfgName,
        mfgType: vm.customer.mfgType
      };
      vm.markForAddressData = {
        addressType: CORE.AddressType.IntermediateAddress,
        customerId: vm.mfgCodeId,
        isMasterPage: true,
        alreadySelectedAddressID: null,
        companyNameWithCode: vm.companyNameWithCode,
        companyName: vm.customer.mfgName,
        mfgType: vm.customer.mfgType
      };
      vm.businessAddressData = {
        addressType: CORE.AddressType.BusinessAddress,
        customerId: vm.mfgCodeId,
        isMasterPage: true,
        alreadySelectedAddressID: null,
        companyNameWithCode: vm.companyNameWithCode,
        companyName: vm.customer.mfgName,
        mfgType: vm.customer.mfgType
      };
      vm.contactPersonDetail = {
        companyName: vm.customer.mfgName,
        refTransID: vm.mfgCodeId,
        refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
        isMasterPage: true
      };
    };

    //transfer route as per tab change -- Charmi
    vm.stateTransfer = (tabIndex) => {
      var itemTabName = _.find(CORE.CompanyProfileTabs, (valItem) => valItem.ID === tabIndex);
      if (itemTabName && itemTabName.Name !== vm.tabName) {
        switch (itemTabName.Name) {
          case CORE.CompanyProfileTabs.Details.Name:
            $state.go(CORE.COMPANY_PROFILE_DETAIL_STATE);
            break;
          case CORE.CompanyProfileTabs.Addresses.Name:
            $state.go(CORE.COMPANY_PROFILE_ADDRESSES_STATE);
            break;
          case CORE.CompanyProfileTabs.RemittanceAddress.Name:
            $state.go(CORE.COMPANY_PROFILE_REMITTANCE_ADDRESS_STATE);
            break;
          case CORE.CompanyProfileTabs.Contacts.Name:
            $state.go(CORE.COMPANY_PROFILE_CONTACTS_STATE);
            break;
          case CORE.CompanyProfileTabs.CompanyPreference.Name:
            $state.go(CORE.COMPANY_PROFILE_COMPANY_PREFERENCE_STATE);
            break;
          default: break;
        }
      }
    };

    /* Manually put as load "ViewDataElement directive" only on other details tab  */
    vm.onTabChanges = (TabName, msWizard) => {
      msWizard.selectedIndex = vm.selectedTabIndex;
      vm.stateTransfer(vm.selectedTabIndex);
      $('#content').animate({ scrollTop: 0 }, 200);

      if (TabName === vm.DetailsTabName) {
        vm.isDetailTab = true;
      } else if (TabName === vm.addressesTabName) {
        vm.isAddressesTab = true;
      } else if (TabName === vm.remittanceAddressTabName) {
        vm.isRemittanceAddressTab = true;
      } else if (TabName === vm.contactsTabName) {
        vm.isContactsTab = true;
      } else if (TabName === vm.companyPreferenceTabName) {
        vm.isCompanyPreferenceTab = true;
      } else {
        vm.isDetailTab = true;
      }
    };

    const setTabWisePageRights = (pageList) => {
      if (pageList && pageList.length > 0) {
        let tab = pageList.find((a) => a.PageDetails && a.PageDetails.pageRoute === CORE.COMPANY_PROFILE_DETAIL_STATE);
        if (tab && tab.isActive) {
          vm.pageTabRights.DetailTab = true;
        }
        tab = pageList.find((a) => a.PageDetails && a.PageDetails.pageRoute === CORE.COMPANY_PROFILE_ADDRESSES_STATE);
        if (tab && tab.isActive) {
          vm.pageTabRights.AddressesTab = true;
        }
        tab = pageList.find((a) => a.PageDetails && a.PageDetails.pageRoute === CORE.COMPANY_PROFILE_REMITTANCE_ADDRESS_STATE);
        if (tab && tab.isActive) {
          vm.pageTabRights.RemittanceAddressTab = true;
        }
        tab = pageList.find((a) => a.PageDetails && a.PageDetails.pageRoute === CORE.COMPANY_PROFILE_CONTACTS_STATE);
        if (tab && tab.isActive) {
          vm.pageTabRights.ContactsTab = true;
        }

        tab = pageList.find((a) => a.PageDetails && a.PageDetails.pageRoute === CORE.COMPANY_PROFILE_COMPANY_PREFERENCE_STATE);
        if (tab && tab.isActive) {
          vm.pageTabRights.CompanyPreferenceTab = true;
        }
      }
    };

    /* Show save alert popup when performing tab change*/
    const showWithoutSavingAlertforTabChange = (step) => {
      var messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      return DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          vm.ischange = false;
          if (step === 0) {
            vm.companyDetailsTabForm.$setPristine();
            return true;
          }
        }
      }, () => {
        vm.ischange = true;
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* fun to check form dirty on tab change */
    vm.isStepValid = (step) => {
      switch (step) {
        case 0: {
          if (vm.ischange || vm.checkFormDirty(vm.companyDetailsTabForm)) {
            return showWithoutSavingAlertforTabChange(step);
          } else { return true; }
        }
        default: break;
      }
    };

    /* Next Step Click */
    vm.CheckStepAndAction = (msWizard) => {
      if (msWizard.selectedIndex === 0) {
        vm.saveDisable = true;
        $scope.$broadcast('savecompanyProfileDetails', vm.companyDetailsTabForm);
        vm.saveDisable = false;
      }
      if (msWizard.selectedIndex === 3) {
        vm.saveDisable = true;
        $scope.$broadcast('updatecompanyProfileDetails');
        vm.saveDisable = false;
      }
    };

    // for setting tab wise page rights on page reload
    $timeout(() => {
      $scope.$on(USER.LoginUserPageListBroadcast, (event, data) => {
        setTabWisePageRights(data);
        $scope.$applyAsync();
      });
    });

    const getCompanyInfo = () => {
      vm.cgBusyLoading = CompanyProfileFactory.getCompanyDetail().query().$promise.then((company) => {
        vm.companyProfile = angular.copy(company.data);
        vm.mfgCodeId = vm.companyProfile && vm.companyProfile.mfgCodeId ? vm.companyProfile.mfgCodeId : null;
        if (vm.mfgCodeId) {
          vm.customerDetails(vm.mfgCodeId);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    getCompanyInfo();

    vm.customerDetails = (customerID) => {
      vm.cgBusyLoading = ManufacturerFactory.customer().query({ id: customerID, refTableName: CORE.TABLE_NAME.MFG_CODE_MST }).$promise.then((customer) => {
        vm.customer = angular.copy(customer.data);
        vm.companyNameWithCode = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, vm.customer.mfgCode, vm.customer.mfgName);
        setAddressesData();
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // open addEdit Addresses popup
    vm.addEditAddress = (objAddressType, ev) => {
      const data = {
        customerId: vm.mfgCodeId,
        companyName: vm.customer.mfgName,
        companyNameWithCode: stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, vm.customer.mfgCode, vm.customer.mfgName),
        objAddress: null,
        addressType: objAddressType,
        mfgType: vm.customer.mfgType
      };
      vm.ischange = true;
      DialogFactory.dialogService(
        USER.ADMIN_CUSTOMER_BILLING_SHIPPING_ADDRESSS_CONTROLLER,
        USER.ADMIN_CUSTOMER_BILLING_SHIPPING_ADDRESSS_VIEW,
        ev,
        data).then(() => {
          vm.ischange = false;
        }, () => {
          $scope.$broadcast('saveShiipingAddressChanges');
          vm.ischange = false;
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.checkFormDirty = (form) => BaseService.checkFormDirty(form);

    // Set tab wise page rights on first load
    if (BaseService.loginUserPageList && BaseService.loginUserPageList.length > 0) {
      setTabWisePageRights(BaseService.loginUserPageList);
    }
  }
})();
