(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('companyAddress', companyAddress);

  /** @ngInject */
  function companyAddress() {
    var directive = {
      restrict: 'E',
      scope: {
        mfgcodeId: '=?',
        emptyMesssage: '=?',
        addressType: '=?'
      },
      templateUrl: 'app/directives/custom/company-address/company-address.html',
      controller: companyAddressCtrl,
      controllerAs: 'vm'
    };
    return directive;


    /** @ngInject */
    /**
    * Controller for view data of company address
    *
    * @param
    */
    function companyAddressCtrl($scope, $mdDialog, BaseService, CORE, USER, DialogFactory, CustomerFactory, ManufacturerFactory) {
      var vm = this;
      vm.EmptyMesssage = $scope.emptyMesssage;
      vm.mfgCodeId = $scope.mfgcodeId;
      vm.addressType = $scope.addressType;

      // get customer address list based on address type
      vm.getAddressesList = () => {
        vm.NoAddressFound = false;
        vm.addressList = [];
        if (vm.mfgCodeId && vm.addressType) {
          vm.cgBusyLoading = CustomerFactory.customerAddressList().query({
            customerId: vm.mfgCodeId,
            addressType: vm.addressType,
            refTableName: CORE.TABLE_NAME.MFG_CODE_MST
          }).$promise.then((addressesData) => {
            vm.addressList = addressesData.data;
            vm.NoAddressFound = vm.addressList && vm.addressList.length > 0 ? false : true;
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };
      vm.getAddressesList();

      /* retrieve customer Details*/
      vm.customerDetails = () => {
        if (vm.mfgCodeId) {
          vm.cgBusyLoading = ManufacturerFactory.customer().query({ id: vm.mfgCodeId, refTableName: CORE.TABLE_NAME.MFG_CODE_MST }).$promise.then((customer) => {
            vm.customer = angular.copy(customer.data);
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };
      vm.customerDetails();

      // To set shipping/billing address as default one
      vm.setDefaultAddress = (addressData) => {
        const setDefaultAddressAs = {
          id: addressData.id,
          customerId: addressData.customerId,
          addressType: addressData.addressType,
          issetDefault: !addressData.isDefault
        };

        vm.cgBusyLoading = CustomerFactory.setCustomerAddressesDefault().update({
        }, setDefaultAddressAs).$promise.then(() => {
          vm.getAddressesList(addressData.addressType);
        }).catch((error) => BaseService.getErrorLog(error));
      };

      // open addEdit Addresses popup
      vm.addEditAddress = (objAddress, ev) => {
        const data = {
          customerId: vm.mfgCodeId,
          companyName: vm.customer.mfgName,
          companyNameWithCode: stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, vm.customer.mfgCode, vm.customer.mfgName),
          objAddress: objAddress,
          addressType: vm.addressType,
          mfgType: vm.customer.mfgType
        };
        $scope.$parent.vm.ischange = true;
        DialogFactory.dialogService(
          USER.ADMIN_CUSTOMER_BILLING_SHIPPING_ADDRESSS_CONTROLLER,
          USER.ADMIN_CUSTOMER_BILLING_SHIPPING_ADDRESSS_VIEW,
          ev,
          data).then(() => {
            $scope.$parent.vm.ischange = false;
          }, () => {
            $scope.$parent.vm.ischange = false;
            vm.getAddressesList();
          }, (err) => BaseService.getErrorLog(err));
      };

      /* delete billing-shipping address */
      vm.deleteAddress = (objAddress) => {
        if (!objAddress || !objAddress.id || !vm.addressType) {
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
            selectedIDs = vm.selectedRows.map((item) => item.id);
          }
        }
        if (selectedIDs) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, CORE.AddressTypes[vm.addressType].title, 1);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          $scope.$parent.vm.ischange = true;

          const _objDelete = {
            id: objAddress.id,
            addressType: vm.addressType
          };

          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              $scope.$parent.vm.ischange = false;
              vm.cgBusyLoading = CustomerFactory.deleteCustomerAddresses().query({
                objDelete: _objDelete
              }).$promise.then((respose) => {
                if (respose.data && respose.data.TotalCount && respose.data.TotalCount > 0) {
                  BaseService.deleteAlertMessage(respose.data);
                }
                else {
                  vm.getAddressesList();
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => {
            $scope.$parent.vm.ischange = false;
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      $scope.$on('$destroy', () => {
        $mdDialog.cancel();
      });

      // Save Shipping Address changes
      $scope.$on('saveShiipingAddressChanges', () => {
        vm.getAddressesList();
      });

      //Set as current form when page loaded
      angular.element(() => {
        BaseService.currentPageForms = [vm.addressForm];
      });
    }
  }
})();
