(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('viewCustAddressContactDet', viewCustAddressContactDet);

  /** @ngInject */
  function viewCustAddressContactDet() {
    var directive = {
      replace: true,
      restrict: 'E',
      scope: {
        paramAddressDet: '=',
        paramContactPersonDet: '=',
        paramOtherDet: '=',
        paramAddrActionBtnDet: '=',
        paramContPersonActionBtnDet: '=',
        paramRadioBtnSelectedId: '=',
        paramAddUpdateAddrCallbackFn: '&',
        paramSelectAddrCallbackFn: '&',
        paramAddUpdateContactCallbackFn: '&',
        paramSelectContactCallbackFn: '&',
        paramDeleteAddrCallbackFn: '&',
        paramDeleteContPersonCallbackFn: '&',
        paramSetDefaultAddrCallbackFn: '&',
        paramCopyAddressCallbackFn: '&',
        paramRefreshAddressCallbackFn: '&',
        paramSetAddressCallbackFn: '&',
        paramHideContactPersonSection: '='
      },
      templateUrl: 'app/directives/custom/view-cust-addr-contact-det/view-cust-addr-contact-det.html',
      controller: viewCustAddressContactDetCtrl,
      controllerAs: 'vm'
    };
    return directive;


    /** @ngInject */
    /**
    * Controller for view data of customer address and contact details
    *
    * @param
    */
    function viewCustAddressContactDetCtrl($scope, DialogFactory, CORE, USER, BaseService) {
      var vm = this;
      vm.addressTypeConst = CORE.AddressType;
      vm.companyNameLbl = 'Bus. Name';
      vm.selectedRadioAddress = $scope.paramRadioBtnSelectedId;
      vm.allowToDeleteAddress = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToDeleteAddress);
      vm.LabelConstant = CORE.LabelConstant;
      vm.phoneCategoryOrder = _.map(CORE.PhoneMobileFaxCategory, (phoneObj) => phoneObj.key);
      if ($scope.paramOtherDet && $scope.paramOtherDet.addressType === CORE.AddressType.BillingAddress) {
        vm.addressEmptyStateObject = angular.copy(USER.ADMIN_EMPTYSTATE.CUSTOMERBILLINGADDRESS);
        vm.addrTypeIcon = 't-icons-billing-address';
      } else if ($scope.paramOtherDet && $scope.paramOtherDet.addressType === CORE.AddressType.PayToInformation) {
        vm.addressEmptyStateObject = angular.copy(USER.ADMIN_EMPTYSTATE.SUPPLIERPAYTOINFORMATION);
        vm.addrTypeIcon = 't-icons-payment-address';
      } else if ($scope.paramOtherDet && ($scope.paramOtherDet.addressType === CORE.AddressType.ShippingAddress)) {
        vm.addressEmptyStateObject = angular.copy(USER.ADMIN_EMPTYSTATE.CUSTOMERSHIPPINGADDRESS);
        vm.addrTypeIcon = 't-icons-shipping-address';
        vm.defIntmdAddrTypeIcon = 't-icons-mark-for-address';
      } else if ($scope.paramOtherDet && ($scope.paramOtherDet.addressType === CORE.AddressType.RMAShippingAddress)) {
        vm.addressEmptyStateObject = angular.copy(USER.ADMIN_EMPTYSTATE.SUPPLIERRMAADDRESS);
        vm.addrTypeIcon = 't-icons-rma-address';
        vm.defIntmdAddrTypeIcon = 't-icons-rma-intermediate-address';
      } else if ($scope.paramOtherDet && ($scope.paramOtherDet.addressType === CORE.AddressType.IntermediateAddress)) {
        vm.addressEmptyStateObject = angular.copy(USER.ADMIN_EMPTYSTATE.MARK_FOR_INTERMEDIATE_ADDRESS);
        vm.addrTypeIcon = 't-icons-mark-for-address';
      } else if ($scope.paramOtherDet && ($scope.paramOtherDet.addressType === CORE.AddressType.BusinessAddress)) {
        vm.addressEmptyStateObject = angular.copy(USER.ADMIN_EMPTYSTATE.BUSINESS_ADDRESS);
        vm.addrTypeIcon = 't-icons-business-address';
      } else if ($scope.paramOtherDet && ($scope.paramOtherDet.addressType === CORE.AddressType.RMAIntermediateAddress)) {
        vm.addressEmptyStateObject = angular.copy(USER.ADMIN_EMPTYSTATE.RMA_INTERMEDIATE_ADDRESS);
        vm.addrTypeIcon = 't-icons-rma-intermediate-address';
      }
      vm.contactPersonEmptyStateObj = angular.copy(USER.ADMIN_EMPTYSTATE.CONTACT_PERSON);
      if ($scope.paramOtherDet) {
        if ($scope.paramOtherDet.mfgType === CORE.MFG_TYPE.DIST) {
          vm.mfgEmptyState = angular.copy(USER.ADMIN_EMPTYSTATE.SUPPLIER);
          vm.companyNameLbl = 'Company';
          vm.customerType = CORE.CUSTOMER_TYPE.SUPPLIER;
        } else if ($scope.paramOtherDet.mfgType === CORE.MFG_TYPE.MFG) {
          // vm.mfgEmptyState taken from below customer as per existing code
          vm.mfgEmptyState = angular.copy(USER.ADMIN_EMPTYSTATE.CUSTOMER);
          vm.customerType = CORE.CUSTOMER_TYPE.MANUFACTURER;
        } else {
          vm.mfgEmptyState = angular.copy(USER.ADMIN_EMPTYSTATE.CUSTOMER);
          vm.customerType = CORE.CUSTOMER_TYPE.CUSTOMER;
        }
      }
      if ($scope.paramAddressDet) {
        $scope.paramAddressDet.isActiveText = _.find(CORE.ActiveRadioGroup, (item) => item.Value === $scope.paramAddressDet.isActive).Key;
      }
      $scope.$watch('paramContactPersonDet', () => {
        convertPhoneStringToArray();
      });

      const convertPhoneStringToArray = () => {
        const phoneList = $scope.paramContactPersonDet && $scope.paramContactPersonDet.phoneList ? $scope.paramContactPersonDet.phoneList : null;
        if (phoneList) {
          vm.phoneList = _.map(phoneList.split(' | '), (phoeObj) => phoeObj.split(':'));
          vm.phoneList = _.sortBy(vm.phoneList, (item) => vm.phoneCategoryOrder.indexOf(item[0]));
        } else {
          vm.phoneList = [];
        }
      };

      // open add/Edit customer Addresses popup
      vm.addEditAddress = (ev, addressDet) => {
        const data = {};
        data.objAddress = addressDet ? addressDet : null;
        data.addressType = $scope.paramOtherDet.addressType; // CORE.AddressType.BillingAddress;
        data.customerId = $scope.paramOtherDet.customerId;
        data.companyName = $scope.paramAddressDet ? $scope.paramAddressDet.companyName : $scope.paramOtherDet.companyName;
        data.companyNameWithCode = $scope.paramOtherDet.companyNameWithCode;
        data.customerType = vm.customerType;
        data.mfgType = $scope.paramOtherDet.mfgType;
        data.isMasterPage = true; //$scope.paramOtherDet.isMasterPage || false;
        DialogFactory.dialogService(
          USER.ADMIN_CUSTOMER_BILLING_SHIPPING_ADDRESSS_CONTROLLER,
          USER.ADMIN_CUSTOMER_BILLING_SHIPPING_ADDRESSS_VIEW,
          ev,
          data).then(() => {
          }, (savedAddressDet) => {
            if (savedAddressDet) {
              $scope.paramAddressDet = savedAddressDet;
              if ($scope.paramAddressDet) {
                $scope.paramAddressDet.isActiveText = _.find(CORE.ActiveRadioGroup, (item) => item.Value === $scope.paramAddressDet.isActive).Key;
                if ($scope.paramOtherDet.isMasterPage) {
                  $scope.paramContactPersonDet = savedAddressDet.contactPerson;
                  $scope.paramOtherDet.alreadySelectedPersonId = savedAddressDet.contactPerson && savedAddressDet.contactPerson.personId ? savedAddressDet.contactPerson.personId : null;
                  convertPhoneStringToArray();
                }
              }
              if ($scope.paramOtherDet.showAddressEmptyState) {
                $scope.paramOtherDet.showAddressEmptyState = false;
                $scope.paramOtherDet.alreadySelectedAddressID = $scope.paramAddressDet.id;
              }
            }
            $scope.paramAddUpdateAddrCallbackFn() ? $scope.paramAddUpdateAddrCallbackFn()(ev, savedAddressDet, $scope.paramOtherDet.addressType) : '';
          });
      };

      /* open customer address popup to select new one */
      vm.selectAddress = (ev) => {
        const data = {};
        data.objAddress = null;
        data.addressType = $scope.paramOtherDet.addressType;
        data.customerId = $scope.paramOtherDet.customerId;
        data.companyName = $scope.paramOtherDet.companyName;
        data.companyNameWithCode = $scope.paramOtherDet.companyNameWithCode;
        data.alreadySelectedAddressID = $scope.paramOtherDet.alreadySelectedAddressID || null;
        data.selectedAddress = $scope.paramAddressDet;
        data.selectedContactPerson = $scope.paramContactPersonDet;
        data.mfgType = $scope.paramOtherDet.mfgType;
        DialogFactory.dialogService(
          USER.ADMIN_SELECT_ADDRESSS_CONTROLLER,
          USER.ADMIN_SELECT_ADDRESSS_VIEW,
          ev,
          data).then(() => {
          }, (appliedAddress) => {
            if (appliedAddress) {
              $scope.paramAddressDet = appliedAddress;
            }
            $scope.paramSelectAddrCallbackFn() ? $scope.paramSelectAddrCallbackFn()(ev, appliedAddress) : '';
          });
      };
      // rerfresh address
      vm.refreshAddress = (ev) => {
        $scope.paramRefreshAddressCallbackFn() ? $scope.paramRefreshAddressCallbackFn()(ev, $scope.paramOtherDet) : '';
      };

      // Open add/edit contact persopn popup
      vm.addEditContactPerson = (ev, contactPersonDet) => {
        const popUpData = { popupAccessRoutingState: [USER.ADMIN_CONTACT_PERSON_STATE], pageNameAccessLabel: CORE.PageName.ContactPerson };
        if (BaseService.checkRightToAccessPopUp(popUpData)) {
          const data = {};
          data.personId = contactPersonDet ? contactPersonDet.personId : null;
          data.companyName = $scope.paramAddressDet ? $scope.paramAddressDet.companyName : $scope.paramOtherDet.companyName;
          data.refTransID = parseInt($scope.paramOtherDet.refTransID);
          data.refTableName = $scope.paramOtherDet.refTableName;
          data.mfgType = $scope.paramOtherDet.mfgType;
          data.isFromMasterpage = true;
          DialogFactory.dialogService(
            USER.ADMIN_MANAGE_CONTACTPERSON_MODAL_CONTROLLER,
            USER.ADMIN_MANAGE_CONTACTPERSON_MODAL_VIEW,
            ev,
            data).then(() => {
            }, (savedContactPersonDet) => {
              if (savedContactPersonDet) {
                $scope.paramContactPersonDet = savedContactPersonDet;
                convertPhoneStringToArray();
              }
              $scope.paramAddUpdateContactCallbackFn() ? $scope.paramAddUpdateContactCallbackFn()(ev, savedContactPersonDet, $scope.paramOtherDet.addressType) : '';
            });
        }
      };

      // open select contact person  list
      vm.selectContactPerson = (ev) => {
        const data = {};
        //data.customerId = parseInt(vm.billingAddress.customerId);
        data.companyName = $scope.paramAddressDet ? $scope.paramAddressDet.companyName : $scope.paramOtherDet.companyName;
        data.refTransID = parseInt($scope.paramOtherDet.refTransID);
        data.refTableName = $scope.paramOtherDet.refTableName;
        //data.personId = $scope.paramContactPersonDet ? $scope.paramContactPersonDet.personId : null;
        data.alreadySelectedPersonId = $scope.paramOtherDet.alreadySelectedPersonId || null;
        data.selectedContactPerson = $scope.paramContactPersonDet || null;
        data.mfgType = $scope.paramOtherDet.mfgType;
        DialogFactory.dialogService(
          USER.ADMIN_SELECT_CONTACT_PERSON_CONTROLLER,
          USER.ADMIN_SELECT_CONTACT_PERSON_VIEW,
          ev,
          data).then(() => {
          }, (appliedContactPersonDet) => {
            if (appliedContactPersonDet) {
              $scope.paramContactPersonDet = appliedContactPersonDet;
              convertPhoneStringToArray();
            }
            $scope.paramSelectContactCallbackFn() ? $scope.paramSelectContactCallbackFn()(ev, appliedContactPersonDet, $scope.paramOtherDet.addressType) : '';
          });
      };

      // to delete customer address
      vm.deleteAddress = (ev) => {
        if (!vm.allowToDeleteAddress && $scope.paramOtherDet.isMasterPage) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.GLOBAL_NOT_RIGHT_FOR_FEATURE);
          messageContent.message = stringFormat(messageContent.message, CORE.FEATURE_NAME.AllowToDeleteAddress);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
          return;
        }
        $scope.paramDeleteAddrCallbackFn() ? $scope.paramDeleteAddrCallbackFn()(ev, $scope.paramAddressDet) : '';
      };

      // to delete customer address
      vm.deleteContactPerson = (ev) => {
        $scope.paramDeleteContPersonCallbackFn() ? $scope.paramDeleteContPersonCallbackFn()(ev, $scope.paramAddressDet) : '';
      };

      //go to Customer/Supplier master Address tab
      vm.goToManageMfgMstAddress = () => {
        const custType = CORE.CUSTOMER_TYPE.CUSTOMER;
        if ($scope.paramOtherDet) {
          if ($scope.paramOtherDet.addressType === CORE.AddressType.BillingAddress) {
            if ($scope.paramOtherDet.mfgType === CORE.MFG_TYPE.DIST) {
              BaseService.goToSupplierBillTo($scope.paramOtherDet.customerId);
            } else {
              BaseService.goToCustomerBillingAddressList(custType, $scope.paramOtherDet.customerId);
            }
          } else if ($scope.paramOtherDet.addressType === CORE.AddressType.ShippingAddress) {
            if ($scope.paramOtherDet.mfgType === CORE.MFG_TYPE.DIST) {
              BaseService.goToSupplierShipTo($scope.paramOtherDet.customerId);
            } else {
              BaseService.goToCustomerShippingAddressList(custType, $scope.paramOtherDet.customerId);
            }
          } else if ($scope.paramOtherDet.addressType === CORE.AddressType.IntermediateAddress) {
            if ($scope.paramOtherDet.mfgType !== CORE.MFG_TYPE.DIST) {
              BaseService.goToCustomerMarkForAddressList($scope.paramOtherDet.customerId);
            }
          } else if ($scope.paramOtherDet.addressType === CORE.AddressType.RMAShippingAddress) {
            if ($scope.paramOtherDet.mfgType === CORE.MFG_TYPE.DIST) {
              BaseService.goToSupplierRMAAddress($scope.paramOtherDet.customerId);
            } else {
              BaseService.goToCustomerRMAAddress($scope.paramOtherDet.customerId);
            }
          } else if ($scope.paramOtherDet.addressType === CORE.AddressType.PayToInformation) {
            if ($scope.paramOtherDet.mfgType === CORE.MFG_TYPE.DIST) {
              BaseService.goToSupplierBankRemitTo($scope.paramOtherDet.customerId);
            } else if ($scope.paramOtherDet.mfgType === CORE.MFG_TYPE.MFG) {
              // redirect to company profile page
              BaseService.goToCompanyProfileRemitTo();
            }
          } else if ($scope.paramOtherDet.addressType === CORE.AddressType.BusinessAddress) {
            if ($scope.paramOtherDet.mfgType === CORE.MFG_TYPE.DIST) {
              BaseService.goToSupplierBusinessAddress($scope.paramOtherDet.customerId);
            } else {
              BaseService.goToCustomerBusinessAddressList($scope.paramOtherDet.customerId);
            }
          } else if ($scope.paramOtherDet.addressType === CORE.AddressType.WireTransferAddress) {
            if ($scope.paramOtherDet.mfgType === CORE.MFG_TYPE.DIST) {
              BaseService.goToSupplierWireTransferAddress($scope.paramOtherDet.customerId);
            } else {
              BaseService.goToCustomerWireTransferAddress($scope.paramOtherDet.customerId);
            }
          } else if ($scope.paramOtherDet.addressType === CORE.AddressType.RMAIntermediateAddress) {
            if ($scope.paramOtherDet.mfgType === CORE.MFG_TYPE.DIST) {
              BaseService.goToSupplierRMAIntermediateAddress($scope.paramOtherDet.customerId);
            }
          }
        }
      };

      vm.goToCustomerContactPersonList = () => {
        const custType = $scope.paramOtherDet && $scope.paramOtherDet.mfgType === CORE.MFG_TYPE.DIST ? CORE.CUSTOMER_TYPE.SUPPLIER : CORE.CUSTOMER_TYPE.CUSTOMER;
        BaseService.goToCustTypeContactPersonList(custType, $scope.paramOtherDet.customerId);
      };
      // added watch for radio button update
      $scope.$watch('paramRadioBtnSelectedId', () => vm.selectedRadioAddress = $scope.paramRadioBtnSelectedId);

      // to set customer address to default
      vm.setDefaultAddress = (ev) => {
        $scope.paramSetDefaultAddrCallbackFn() ? $scope.paramSetDefaultAddrCallbackFn()(ev, $scope.paramAddressDet) : '';
      };
      vm.setAddress = (ev) => {
        $scope.paramSetAddressCallbackFn() ? $scope.paramSetAddressCallbackFn()(ev, $scope.paramAddressDet) : '';
      };

      // open copy Addresses popup
      vm.duplicateAddress = (ev) => {
        const sendData = {};
        sendData.addressId = $scope.paramAddressDet.id;
        sendData.addressType = $scope.paramOtherDet.addressType; // CORE.AddressType.BillingAddress;
        sendData.customerId = $scope.paramOtherDet.customerId;
        sendData.companyName = $scope.paramAddressDet ? $scope.paramAddressDet.companyName : $scope.paramOtherDet.companyName;
        sendData.companyNameWithCode = $scope.paramOtherDet.companyNameWithCode;
        sendData.mfgType = $scope.paramOtherDet.mfgType;

        DialogFactory.dialogService(
          USER.ADMIN_DUPLICATE_ADDRESSS_CONTROLLER,
          USER.ADMIN_DUPLICATE_ADDRESSS_VIEW,
          ev,
          sendData).then(() => {
          }, () => {
            $scope.paramCopyAddressCallbackFn() ? $scope.paramCopyAddressCallbackFn()(ev, $scope.paramOtherDet.addressType) : '';
            //if (savedAddressDet) {
            //  $scope.paramAddressDet = savedAddressDet;
            //}
            //$scope.paramAddUpdateAddrCallbackFn() ? $scope.paramAddUpdateAddrCallbackFn()(ev, savedAddressDet, $scope.paramOtherDet.addressType) : '';
          });
      };
    }
  }
})();
