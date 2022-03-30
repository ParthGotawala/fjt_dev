(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('selectAddressView', selectAddressView);

  /** @ngInject */
  function selectAddressView(USER, BaseService, DialogFactory, CustomerFactory, CORE) {
    const directive = {
      restrict: 'E',
      replace: true,
      scope: {
        addressData: '<',
        selectAddressCallBack: '&'
      },
      templateUrl: 'app/directives/custom/select-address-view/select-address-view.html',
      controller: selectAddressViewCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    /**
    * Controller for text-angular define before load directive
    *
    * @param
    */
    function selectAddressViewCtrl($scope) {
      const vm = this;
      vm.LabelConstant = CORE.LabelConstant;
      vm.companyName = $scope.addressData ? ($scope.addressData.companyName ? $scope.addressData.companyName : null) : null;
      vm.companyNameWithCode = $scope.addressData && $scope.addressData.companyNameWithCode ? $scope.addressData.companyNameWithCode : null;
      vm.addressList = [];
      const customerId = $scope.addressData.customerId;
      vm.addressType = $scope.addressData.addressType;
      vm.custAddrViewActionBtnDet = angular.copy(CORE.CustAddressViewActionBtn);
      if ($scope.addressData && !$scope.addressData.isMasterPage) {
        vm.alreadySelectedAddressID = $scope.addressData && $scope.addressData.alreadySelectedAddressID ? $scope.addressData.alreadySelectedAddressID : $scope.addressData.viewOnly ? null : 0;
        vm.selectedAddress = $scope.addressData && $scope.addressData.selectedAddress ? angular.copy($scope.addressData.selectedAddress) : null;
        if (vm.selectedAddress) {
          vm.selectedAddress.defaultSelected = true;
        }
        vm.selectedContactPerson = $scope.addressData && $scope.addressData.selectedContactPerson ? angular.copy($scope.addressData.selectedContactPerson) : null;
      }
      if ($scope.addressData) {
        vm.selectedAddrTypeDet = $scope.addressData.mfgType === CORE.MFG_TYPE.DIST ? CORE.AddressTypes.SUPP[$scope.addressData.addressType] : CORE.AddressTypes.CUST_MFR[$scope.addressData.addressType];
      }
      //vm.custAddrViewActionBtnDet.Delete.isVisible = vm.custAddrViewActionBtnDet.ApplyNew.isVisible = vm.custAddrViewActionBtnDet.AddNew.isVisible = false;
      //vm.custAddrViewActionBtnDet.Update.isVisible = true;
      vm.COREAddressType = CORE.AddressType;
      vm.isAddNewAddress = false;
      vm.emptySearch = CORE.EMPTYSTATE.EMPTY_SEARCH;
      vm.emptyMsgForAddress = null;

      vm.viewdefaultCustAddrOtherDet = {
        customerId: customerId,
        addressType: $scope.addressData.addressType,
        addressBlockTitle: vm.selectedAddrTypeDet.title,
        refTransID: customerId,
        refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
        mfgType: $scope.addressData.mfgType || CORE.MFG_TYPE.MFG,
        companyName: vm.companyName,
        companyNameWithCode: vm.companyNameWithCode
      };
      if ($scope.addressData.addressType) {
        switch ($scope.addressData.addressType) {
          case CORE.AddressType.BillingAddress:
            vm.addressTypeTitle = vm.LabelConstant.Address.BillingAddress;
            vm.emptyMsgForAddress = USER.ADMIN_EMPTYSTATE.CUSTOMERBILLINGADDRESS;
            break;
          case CORE.AddressType.ShippingAddress:
            vm.addressTypeTitle = $scope.addressData.mfgType === CORE.MFG_TYPE.DIST ? vm.LabelConstant.Address.ShippingFromAddress : vm.LabelConstant.Address.ShippingAddress;
            vm.emptyMsgForAddress = $scope.addressData.mfgType === CORE.MFG_TYPE.DIST ? USER.ADMIN_EMPTYSTATE.SHIPPINGFROMADDRESS : USER.ADMIN_EMPTYSTATE.CUSTOMERSHIPPINGADDRESS;
            break;
          case CORE.AddressType.RMAShippingAddress:
            vm.addressTypeTitle = $scope.addressData.mfgType === CORE.MFG_TYPE.DIST ? vm.LabelConstant.COMMON.RMAShippingAddress : vm.LabelConstant.Address.RMAShippingAddress;
            vm.emptyMsgForAddress = $scope.addressData.mfgType === CORE.MFG_TYPE.DIST ? USER.ADMIN_EMPTYSTATE.RMA_SHIPPING_ADDRESS : USER.ADMIN_EMPTYSTATE.SHIPPING_FROM_ADDRESS_RMA;
            break;
          case CORE.AddressType.PayToInformation:
            vm.addressTypeTitle = vm.LabelConstant.Address.PayToAddress;
            vm.emptyMsgForAddress = USER.ADMIN_EMPTYSTATE.SUPPLIERPAYTOINFORMATION;
            break;
          case CORE.AddressType.IntermediateAddress:
            vm.addressTypeTitle = vm.LabelConstant.Address.MarkForAddress;
            vm.emptyMsgForAddress = USER.ADMIN_EMPTYSTATE.MARK_FOR_INTERMEDIATE_ADDRESS;
            break;
          case CORE.AddressType.WireTransferAddress:
            vm.addressTypeTitle = vm.LabelConstant.Address.WireTransferAddress;
            vm.emptyMsgForAddress = USER.ADMIN_EMPTYSTATE.WIRE_TRANSFER_ADDRESS;
            break;
          case CORE.AddressType.BusinessAddress:
            vm.addressTypeTitle = vm.LabelConstant.Address.BusinessAddress;
            vm.emptyMsgForAddress = USER.ADMIN_EMPTYSTATE.BUSINESS_ADDRESS;
            break;
          case CORE.AddressType.RMAIntermediateAddress:
            vm.addressTypeTitle = vm.LabelConstant.Address.RMAIntermediateAddress;
            vm.emptyMsgForAddress = USER.ADMIN_EMPTYSTATE.RMA_INTERMEDIATE_ADDRESS;
            break;
        }
      }

      // get customer address list based on address type
      const getCustomerAddressesList = () => {
        if (customerId) {
          vm.cgBusyLoading = CustomerFactory.customerAddressList().query({
            customerId: customerId,
            addressType: vm.addressType,
            refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
            onlyActiveActive: vm.isInactiveAddress ? false : true
          }).$promise.then((addressesData) => {
            vm.addressList = addressesData.data;
            const defaultIDObj = _.find(vm.addressList, (item) => item.id === vm.alreadySelectedAddressID);
            if (defaultIDObj) {
              defaultIDObj.selectedRecordInMaster = true;
            }
            vm.addressList = _.sortBy(vm.addressList,
              [(o) => o.selectedRecordInMaster]);
            vm.allAddressList = [];
            vm.addressList.forEach((address) => {
              const objAddress = {
                addressList: address,
                contactPerson: address.contactPerson,
                viewCustAddrOtherDet: {
                  customerId: customerId,
                  addressType: $scope.addressData.addressType,
                  addressBlockTitle: vm.selectedAddrTypeDet.title,
                  refTransID: customerId,
                  refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
                  alreadySelectedAddressID: (address && address.id) || null,
                  mfgType: $scope.addressData.mfgType || CORE.MFG_TYPE.MFG,
                  alreadySelectedPersonId: (address && address.personId) || null,
                  showAddressEmptyState: false,
                  companyName: vm.companyName,
                  companyNameWithCode: vm.companyNameWithCode,
                  isMasterPage: true
                }
              };
              if ($scope.addressData.isMasterPage) {
                // objAddress.viewCustAddrOtherDet.isMasterPage = $scope.addressData.isMasterPage ? true : false;
                objAddress.viewCustAddrOtherDet.addressBlockTitle = address.isDefault ? 'Default Address' : '';
                objAddress.custAddrViewActionBtnDet = angular.copy(CORE.CustAddressViewActionBtn);
                objAddress.contPersonViewActionBtnDet = angular.copy(CORE.CustAddressViewActionBtn);
                objAddress.custAddrViewActionBtnDet.Delete.isDisable = address.systemGenerated ? true : false;
                objAddress.custAddrViewActionBtnDet.SetDefault.isVisible = (($scope.addressData.addressType === CORE.AddressType.IntermediateAddress) || ($scope.addressData.addressType === CORE.AddressType.RMAIntermediateAddress)) ? false : true;
                objAddress.custAddrViewActionBtnDet.Duplicate.isVisible = true;
                objAddress.custAddrViewActionBtnDet.SetDefault.isDisable = (vm.addressList.filter((item) => item.isActive)).length > 1 ? false : address.isDefault;
                objAddress.custAddrViewActionBtnDet.AddNew.isVisible = objAddress.custAddrViewActionBtnDet.ApplyNew.isVisible = false;
                objAddress.contPersonViewActionBtnDet.AddNew.isVisible = objAddress.contPersonViewActionBtnDet.Update.isVisible = objAddress.contPersonViewActionBtnDet.ApplyNew.isVisible = objAddress.contPersonViewActionBtnDet.Delete.isVisible = objAddress.contPersonViewActionBtnDet.SetDefault.isVisible = false;
              } else {
                objAddress.custAddrViewActionBtnDet = angular.copy(CORE.CustAddressViewActionBtn);
                objAddress.custAddrViewActionBtnDet.ApplyNew.isVisible = objAddress.custAddrViewActionBtnDet.AddNew.isVisible = false;
                objAddress.custAddrViewActionBtnDet.SetDefault.isVisible = (($scope.addressData.addressType === CORE.AddressType.IntermediateAddress) || ($scope.addressData.addressType === CORE.AddressType.RMAIntermediateAddress)) ? false : true;
                objAddress.custAddrViewActionBtnDet.Update.isVisible = objAddress.custAddrViewActionBtnDet.Delete.isVisible = objAddress.custAddrViewActionBtnDet.Duplicate.isVisible = true;
                objAddress.custAddrViewActionBtnDet.SetDefault.isDisable = (vm.addressList.filter((item) => item.isActive)).length > 1 ? false : address.isDefault;
              }
              vm.allAddressList.push(objAddress);
            });
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };
      getCustomerAddressesList();

      vm.getInactiveAddress = () => {
        getCustomerAddressesList();
      };
      vm.addAddress = (addSpecificAddrType) => {
        const data = {};
        data.customerId = customerId ? customerId : null;
        data.companyName = vm.companyName;
        data.addressType = addSpecificAddrType ? addSpecificAddrType : (vm.addressType ? vm.addressType : null);
        data.companyNameWithCode = vm.companyNameWithCode;
        data.mfgType = $scope.addressData.mfgType || CORE.MFG_TYPE.MFG;
        data.isMasterPage = true;
        if ($scope.addressData.mfgType === CORE.MFG_TYPE.DIST) {
          data.customerType = CORE.CUSTOMER_TYPE.SUPPLIER;
        } else if ($scope.addressData.mfgType === CORE.MFG_TYPE.MFG) {
          data.customerType = CORE.CUSTOMER_TYPE.MANUFACTURER;
        } else {
          data.customerType = CORE.CUSTOMER_TYPE.CUSTOMER;
        }
        DialogFactory.dialogService(
          USER.ADMIN_CUSTOMER_BILLING_SHIPPING_ADDRESSS_CONTROLLER,
          USER.ADMIN_CUSTOMER_BILLING_SHIPPING_ADDRESSS_VIEW,
          null,
          data).then(() => {
          }, (address) => {
            if (address) {
              if ($scope.addressData && !$scope.addressData.isMasterPage) {
                vm.alreadySelectedAddressID = address.id;
                $scope.selectAddressCallBack()(address);
              }
              getCustomerAddressesList();
            }
          });
      };
      vm.setDefaultAddress = (ev, callbackfn) => {
        if (callbackfn) {
          if ($scope.addressData && !$scope.addressData.isMasterPage) {
            vm.alreadySelectedAddressID = callbackfn.id;
            const selectedAddress = _.find(vm.addressList, (item) => item.id === vm.alreadySelectedAddressID);
            $scope.selectAddressCallBack()(selectedAddress);
          }
        }
      };
      // open addEdit Addresses popup
      vm.addEditAddress = (ev, callBackAddress) => {
        if (callBackAddress) {
          let objAddress = _.find(vm.addressList, (item) => item.id === callBackAddress.id);
          const objcopyAddress = _.find(vm.allAddressList, (item) => item.addressList.id === callBackAddress.id);
          if (objAddress) {
            objAddress = callBackAddress;
            if ($scope.addressData && !$scope.addressData.isMasterPage) {
              if (objAddress.id === vm.alreadySelectedAddressID) {
                $scope.selectAddressCallBack()(objAddress);
              }
            }
          }
          if (objcopyAddress) {
            objcopyAddress.addressList = callBackAddress;
          }
          getCustomerAddressesList();
        }
      };

      // call Back function for copy address
      vm.duplicateAddressCallBack = (ev, addressType) => {
        getCustomerAddressesList();
      };
      // To set shipping/billing address as default one
      vm.setDefaultShippingBillingAddress = (ev, customerAddressesData) => {
        if (!customerAddressesData.isActive) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.INACTIVE_CANNOT_SET_DEFAULT);
          messageContent.message = stringFormat(messageContent.message, vm.selectedAddrTypeDet.title);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
          return;
        }
        const setDefaultAddressAs = {
          id: customerAddressesData.id,
          customerId: customerId,
          addressType: vm.addressType,
          issetDefault: !customerAddressesData.isDefault
        };
        vm.cgBusyLoading = CustomerFactory.setCustomerAddressesDefault().update({
        }, setDefaultAddressAs).$promise.then(() => {
          getCustomerAddressesList();
        }).catch((error) => BaseService.getErrorLog(error));
      };
      /* delete billing-shipping address */
      vm.deleteBillingShippingAddress = (ev, objAddress) => {
        if (!objAddress || !objAddress.id || !objAddress.addressType) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SOMTHING_WRONG);
          const alertModel = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(alertModel);
          return;
        }
        let selectedIDs = [];
        if (objAddress) {
          selectedIDs.push(objAddress.id);
        }
        else {
          vm.selectedRows = vm.selectedRowsList;
          if (vm.selectedRows.length > 0) {
            selectedIDs = vm.selectedRows.map((departmentItem) => departmentItem.id);
          }
        }
        if (selectedIDs) {
          const addrTypeDetToDelete = $scope.addressData.mfgType === CORE.MFG_TYPE.DIST ? CORE.AddressTypes.SUPP[objAddress.addressType] : CORE.AddressTypes.CUST_MFR[objAddress.addressType];

          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, addrTypeDetToDelete.title, 1);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          const _objDelete = {};
          _objDelete.id = objAddress.id,
            _objDelete.addressType = objAddress.addressType;
          _objDelete.CountList = false;
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              vm.cgBusyLoading = CustomerFactory.deleteCustomerAddresses().query({
                objDelete: _objDelete
              }).$promise.then((res) => {
                if (res && res.data && (res.data.length > 0 || res.data.transactionDetails)) {
                  const data = {
                    TotalCount: res.data.transactionDetails[0].TotalCount,
                    pageName: addrTypeDetToDelete.title
                  };
                  BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                    const objIDs = {
                      id: selectedIDs,
                      CountList: true
                    };
                    return CustomerFactory.deleteCustomerAddresses().query({ objDelete: objIDs }).$promise.then((res) => {
                      let data = {};
                      data = res.data;
                      data.pageTitle = null;
                      data.PageName = addrTypeDetToDelete.title;
                      data.selectedIDs = stringFormat('{0}{1}', selectedIDs.length, ' Selected');
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
                  if (vm.alreadySelectedAddressID === objAddress.id && ($scope.addressData && !$scope.addressData.isMasterPage)) {
                    vm.alreadySelectedAddressID = $scope.addressData && vm.selectedAddress && $scope.addressData.alreadySelectedAddressID ? $scope.addressData.alreadySelectedAddressID : 0;
                    vm.selectedAddress = $scope.addressData && $scope.addressData.selectedAddress ? angular.copy($scope.addressData.selectedAddress) : null;
                    $scope.selectAddressCallBack()(vm.selectedAddress);
                  }
                  getCustomerAddressesList();
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };
    }
  }
})();
