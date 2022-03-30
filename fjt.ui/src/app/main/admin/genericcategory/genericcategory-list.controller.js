(function () {
  'use strict';

  angular
    .module('app.admin.genericcategory')
    .controller('GenericCategoryController', GenericCategoryController);

  /** @ngInject */
  function GenericCategoryController($mdDialog, $scope, $timeout, $state, $stateParams, $rootScope, CORE, USER, GenericCategoryFactory, DialogFactory, Upload, BaseService, ReceivingMaterialFactory) {
    const vm = this;
    vm.loginUser = BaseService.loginUser;
    vm.categoryTypeID = parseInt($stateParams.categoryTypeID);
    const allowedFileType = 'csv';
    vm.isNoDataFound = false;
    const CategoryTypeList = angular.copy(CORE.Category_Type);
    vm.categoryType = _.find(CategoryTypeList, (cateType) => cateType.categoryTypeID === vm.categoryTypeID);
    vm.roleAdmin = CORE.Role.SuperAdmin.toLowerCase();
    vm.roleExecutive = CORE.Role.Executive.toLowerCase();
    _.find(vm.loginUser.roles, (role) => {
      if (role.id === vm.loginUser.defaultLoginRoleID) {
        vm.defaultRole = role.name.toLowerCase();
      }
    });
    vm.addButtonLabel = vm.categoryType.singleLabel;
    vm.HomeMenuID = CORE.CategoryType.HomeMenu.ID;
    vm.notificationCategoryID = CORE.CategoryType.NotificationCategory.ID;

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

    vm.downloadDocument = () => $scope.$broadcast(USER.GenericCategoryExportTemplateBroadcast, null);

    vm.updateRecord = () => $scope.$broadcast(USER.GenericCategoryAddUpdateBroadcast, null);

    //close popup on page destroy
    $scope.$on('$destroy', () => $mdDialog.hide(false, { closeAll: true }));
  }
})();
