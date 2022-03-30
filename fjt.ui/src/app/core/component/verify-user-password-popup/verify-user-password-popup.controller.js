(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('varifyUserPasswordPopupController', varifyUserPasswordPopupController);

  /** @ngInject */
  function varifyUserPasswordPopupController(data, CORE, USER, DialogFactory, BaseService, MasterFactory) {

    const vm = this;
    vm.isSaveEnable = true;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    var isValidate = data ? data.isValidate : false;
    vm.timeoutImage = USER.ADMIN_EMPTYSTATE.VERIFY_USER.IMAGEURL;
    vm.verifyMessage = stringFormat(vm.CORE_MESSAGE_CONSTANT.USER_CREDENTIALS, data ? data.accessRole : " "),

      vm.save = () => {
        vm.isSaveEnable = false;
        var encryptedusername = encryptAES(vm.username);
        var encryptedPassword = encryptAES(vm.password);
        var model = {
          username: encryptedusername.toString(),
          password: encryptedPassword.toString(),
          accessLevel: data ? data.accessLevel : null
        }

        if (isValidate) {
          vm.cgBusyLoading = MasterFactory.verifyUser().save(model).$promise.then((response) => {
            if (response && response.data) {
              if (!vm.isSaveEnable) {
                DialogFactory.hideDialogPopup(true);
              }
            }
            vm.isSaveEnable = true;
          }).catch((error) => {
            vm.isSaveEnable = true;
            BaseService.getErrorLog(error);
          });
        }
        else {
          if (!vm.isSaveEnable) {
            DialogFactory.hideDialogPopup(vm.password);
          }
          vm.isSaveEnable = true;
        }
      }

    vm.cancel = () => {
      DialogFactory.closeDialogPopup(vm.password);
    };
  }
})();
