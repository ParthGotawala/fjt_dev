(function () {
  'use restrict'

  angular.module('app.core')
    .controller('TransferStockUnallocatedUmidHistoryPopUpController', TransferStockUnallocatedUmidHistoryPopUpController);

  /* @ngInject */
  function TransferStockUnallocatedUmidHistoryPopUpController(data, $mdDialog, CORE, BaseService, $timeout, MasterFactory, ManufacturerFactory, DialogFactory) {
    var vm = this;
    let loginUser = BaseService.loginUser;
    vm.xferHistoryData = data || [];
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    let defaultRoleDetails = _.find(loginUser.roles, { id: loginUser.defaultLoginRoleID });
    vm.TransferStockUnallocateUMIDHistory = CORE.TransferStockUnallocateUMIDHistoryPopup;
    vm.accessLevelDetail = {};
    vm.displayNote = vm.xferHistoryData.message;
       
    function getAccessLevel() {
      return ManufacturerFactory.getAcessLeval().query({ access: CORE.ROLE_ACCESS.VERIFICATION_ROLE_ACCESS }).$promise.then((response) => {
        if (response && response.data) {
          vm.accessLevelDetail.accessRole = response.data.name;
          vm.accessLevelDetail.accessLevel = response.data.accessLevel
          vm.accessLevelDetail.allowAccess = false;
          if (defaultRoleDetails.accessLevel <= response.data.accessLevel) {
            vm.accessLevelDetail.allowAccess = true;
          }
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    getAccessLevel();

    function showWithoutSavingAlertforcancle() {
      let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.WITHOUT_APPLING_FILTER_ALERT_BODY_MESSAGE);
      let obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {

        }
        $timeout(() => { $mdDialog.hide(); })
      }, (error) => {
        return BaseService.getErrorLog(error);
      });
    }

    vm.cancel = () => {
      let isdirty = vm.unallocatedUmidHistoryForm.$dirty;
      if (isdirty) {
        showWithoutSavingAlertforcancle();
      } else {
        $mdDialog.hide();
      }
    }

    vm.SubmitForm = () => {
      if (BaseService.focusRequiredField(vm.unallocatedUmidHistoryForm)) {
        return;
      }
      var encryptedPassword = encryptAES(vm.unallocatedUmidHistory.password);

      vm.cgBusyLoading = MasterFactory.validatePassword().save({
        password: encryptedPassword.toString(),
        accessLevel: defaultRoleDetails.accessLevel
      }).$promise.then((response) => {
        if (response && response.data) {
          BaseService.currentPagePopupForm.pop();
          vm.unallocatedXferHistoryData = {
            reason: vm.unallocatedUmidHistory.reason,
            createdBy: null,
            updatedBy: null,
            updateByRoleId: null,
            createByRoleId: null
          }
          $mdDialog.hide(vm.unallocatedXferHistoryData);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }
  }
})();
