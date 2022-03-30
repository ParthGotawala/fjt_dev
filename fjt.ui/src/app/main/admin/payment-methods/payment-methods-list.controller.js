(function () {
  'use strict';

  angular
    .module('app.admin.genericcategory')
    .controller('PaymentMethodsController', PaymentMethodsController);

  /** @ngInject */
  function PaymentMethodsController($timeout, $scope, $state, $stateParams, USER, CORE, DialogFactory, Upload, BaseService) {
    var vm = this;
    vm.loginUser = BaseService.loginUser;
    vm.tabName = $stateParams.tabName ? $stateParams.tabName.toLowerCase() : USER.PaymentMethodsTabs.Payable.Name;
    vm.PaymentMethodsTabs = USER.PaymentMethodsTabs;
    const allowedFileType = 'csv';
    vm.isNoDataFound = false;
    vm.roleAdmin = CORE.Role.SuperAdmin.toLowerCase();
    vm.roleExecutive = CORE.Role.Executive.toLowerCase();
    _.find(vm.loginUser.roles, (role) => {
      if (role.id === vm.loginUser.defaultLoginRoleID) {
        vm.defaultRole = role.name.toLowerCase();
      }
    });

    if (vm.tabName === USER.PaymentMethodsTabs.Payable.Name) {
      vm.selectedIndex = 0;
      vm.CORE_categoryType = CORE.CategoryType.PayablePaymentMethods;
    } else {
      vm.selectedIndex = 1;
      vm.CORE_categoryType = CORE.CategoryType.ReceivablePaymentMethods;
    }
    vm.categoryType = _.find(CORE.Category_Type, (cateType) => cateType.categoryTypeID === vm.CORE_categoryType.ID);
    vm.addButtonLabel = vm.categoryType.singleLabel;

    // On tab change filter data for parts
    vm.onTabChanges = (IsPayableMethods, IsClick) => {
      if (IsClick) {
        if (IsPayableMethods) {
          $state.go(USER.ADMIN_GENERICCATEGORY_PAYABLE_PAYMENT_METHODS_STATE);
        } else {
          $state.go(USER.ADMIN_GENERICCATEGORY_RECEIVABLE_PAYMENT_METHODS_STATE);
        }
      }
    };


    vm.documentFiles = (file) => {
      if (file.length > 0) {
        let ext = null;
        _.each(file, (item) => {
          ext = (item.name).substr((item.name).lastIndexOf('.') + 1);
        });

        if (!ext || ext !== allowedFileType) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.FILE_TYPE_NOT_ALLOWED);
          messageContent.message = stringFormat(messageContent.message, allowedFileType);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
          return;
        }

        if (!vm.categoryType.categoryType) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SOMTHING_WRONG);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
          return;
        }

        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SURE_TO_IMPORT_GENERICCATEGRY_FILE);
        messageContent.message = stringFormat(messageContent.message, vm.categoryType ? vm.categoryType.displayName : 'Generic category');
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.cgBusyLoading = Upload.upload({
              url: `${CORE.API_URL}genericcategory/uploadGenericDocuments`,
              method: 'POST',
              data: {
                documents: file,
                categoryType: vm.categoryType.categoryType
              }
            }).progress((evt) => {
              file.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            }).then((res) => {
              if (!res.data.status) {
                const blob = new Blob([res.data], { type: 'text/csv' });
                if (navigator.msSaveOrOpenBlob) {
                  navigator.msSaveOrOpenBlob(blob, vm.categoryType.displayName + '.csv');
                } else {
                  const link = document.createElement('a');
                  if (!link.download) {
                    const url = URL.createObjectURL(blob);
                    link.setAttribute('href', url);
                    link.setAttribute('download', vm.categoryType.displayName + '.csv');
                    link.style = 'visibility:hidden';
                    document.body.appendChild(link);
                    $timeout(() => {
                      link.click();
                      document.body.removeChild(link);
                    });
                  }
                }
              }
              $scope.$broadcast(USER.GenericCategoryListReloadBroadcast, null);
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.downloadDocumentTemplate = () => {
      $scope.$broadcast(USER.GenericCategoryExportTemplateBroadcast, null);
    };

    vm.updateRecord = () => {
      $scope.$broadcast(USER.GenericCategoryAddUpdateBroadcast, null);
    };
  }
})();
