(function () {
  'use strict';

  angular.module('app.core').controller('UIDVerificationFailedPopupController', UIDVerificationFailedPopupController);

  function UIDVerificationFailedPopupController(data, DialogFactory, CORE, ReceivingMaterialFactory, BaseService, ManufacturerFactory, MasterFactory) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.UIDDet = data;
    vm.showUnlockConfig = false;
    vm.accessLevelDetail = {};
    vm.unlockScreen = () => {
      vm.showUnlockConfig = true;
    };

    //var loginUser = BaseService.loginUser;
    function getAccessLavel() {
      return ManufacturerFactory.getAcessLeval().query({ access: CORE.ROLE_ACCESS.VERIFICATION_ROLE_ACCESS }).$promise.then((response) => {
        if (response && response.data) {
          vm.accessLevelDetail.accessRole = response.data.name;
          vm.accessLevelDetail.accessLevel = response.data.accessLevel;
         // vm.accessLevelDetail.allowAccess = false;
          //_.each(loginUser.roles, function (item) {
          //  if (item.accessLevel <= response.data.accessLevel) {
          //    vm.accessLevelDetail.allowAccess = true;
          //  }
          //});
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    getAccessLavel();

    vm.unlockBySupervisor = () => {
      if (vm.VerificationFailed.$invalid) {
        BaseService.focusRequiredField(vm.VerificationFailed);
        return;
      }

      const encryptedusername = encryptAES(vm.unlockUserDet.username);
      const encryptedPassword = encryptAES(vm.unlockUserDet.password);
      //if (vm.accessLevelDetail.allowAccess) {
      const model = {
        username: encryptedusername.toString(),
        password: encryptedPassword.toString(),
        accessLevel: vm.accessLevelDetail.accessLevel
      };
        vm.cgBusyLoading = MasterFactory.verifyUser().save(model).$promise.then((response) => {
          if (response && response.data) {
            vm.UIDDet.unlockUserID = response.data.userID;
            saveUnlockNotes();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      //}
      //else {
      //  let obj = {
      //    title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
      //    textContent: TRANSACTION.UNAUTHORIZE_USER,
      //    multiple: true
      //  };
      //  DialogFactory.alertDialog(obj);
      //}
    };

    const saveUnlockNotes = () => {
      vm.cgBusyLoading = ReceivingMaterialFactory.saveUnlockVerificationDetail().query(vm.UIDDet).$promise.then((res) => {
        if (!res.errors) {
          DialogFactory.hideDialogPopup(true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
  }
})();
