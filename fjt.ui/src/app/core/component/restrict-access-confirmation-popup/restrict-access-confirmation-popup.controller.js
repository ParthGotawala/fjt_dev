(function () {
  'use strict';

  angular.module('app.core').controller('RestrictAccessConfirmationPopupController', RestrictAccessConfirmationPopupController);

  function RestrictAccessConfirmationPopupController(data, DialogFactory, CORE, BaseService, MasterFactory, ManufacturerFactory, $mdDialog) { // eslint-disable-line func-names
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    const loginUser = BaseService.loginUser;

    vm.genericDetailModel = _.clone(data);
    vm.accessLevelDetail = {
      username: null,
      password: null
    };
    if (!vm.genericDetailModel.msgObject) {
      vm.genericDetailModel.msgObject = {};
    }

    // vm.isAccessLevelUser = false;
    vm.isVerificationApprovalReuired = false;
    if (vm.genericDetailModel.isFromTravelerScan && vm.genericDetailModel.msgObject.msgText === 'UMID049') {
      vm.isVerificationApprovalReuired = true;
    }

    const getAccessLavel = () => {
      const obj = {
        access: vm.isVerificationApprovalReuired ? CORE.ROLE_ACCESS.SUPERVISOR_APPROVAL_FOR_UMIDSCAN : CORE.ROLE_ACCESS.VERIFICATION_ROLE_ACCESS
      };
      return ManufacturerFactory.getAcessLeval().query(obj).$promise.then((response) => {
        if (response && response.data) {
          vm.accessLevelDetail.accessRole = response.data.name;
          vm.accessLevelDetail.accessLevel = response.data.accessLevel;
          vm.accessLevelDetail.allowAccess = false;
          const currentLoginUserRole = _.find(loginUser.roles, (item) => item.id === loginUser.defaultLoginRoleID);
          if (currentLoginUserRole && currentLoginUserRole.accessLevel <= response.data.accessLevel) {
            vm.accessLevelDetail.allowAccess = true;
            if (vm.isVerificationApprovalReuired) {
              vm.genericDetailModel.msgObject.msgText = '<p class="font-size-22"><b>Supervisory approval is preferred. Self approval is acceptable.</b></p>';
            }
          } else if (currentLoginUserRole.accessLevel !== response.data.accessLevel) {
            vm.genericDetailModel.msgObject.msgText = '<p class="font-size-22"><b>Supervisory approval is required. Please contact supervisor.</b></p>';
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    getAccessLavel();


    //check and verify user and its access level in database.
    vm.checkAndverifyUser = () => {
      if (vm.VerificationForm.$invalid) {
        BaseService.focusRequiredField(vm.VerificationForm);
        return;
      }
      const encryptedusername = encryptAES(vm.accessLevelDetail.username);
      const encryptedPassword = encryptAES(vm.accessLevelDetail.password);
      if (!vm.isVerificationApprovalReuired) {
        const model = {
          username: vm.accessLevelDetail.username.toString(),
          password: encryptedPassword.toString(),
          featureName: vm.genericDetailModel.featureName
        };
        vm.cgBusyLoading = MasterFactory.verifyUserForRestrictWithPermissionFeature().save(model).$promise.then((response) => {
          if (response && response.data) {
            vm.genericDetailModel.approvedBy = response.data.userID;
            if (!vm.genericDetailModel.isAllowSaveDirect) {
              BaseService.currentPagePopupForm.pop();
              $mdDialog.hide(vm.genericDetailModel);
            }
            else {
              ////save direct in database for reason
              //saveApprovalReason();
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        const model = {
          username: encryptedusername.toString(),
          password: encryptedPassword.toString(),
          accessLevel: vm.accessLevelDetail.accessLevel
        };
        vm.cgBusyLoading = MasterFactory.verifyUser().save(model).$promise.then((response) => {
          if (response && response.data) {
            vm.genericDetailModel.approvedBy = response.data.userID;
            if (!vm.genericDetailModel.isAllowSaveDirect) {
              BaseService.currentPagePopupForm.pop();
              $mdDialog.hide(vm.genericDetailModel);
            }
          } else {
            vm.genericDetailModel.approvedBy = null;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    ////save approval reason
    //function saveApprovalReason() {
    //    vm.cgBusyLoading = MasterFactory.createAuthenticatedApprovalReason().query({ objReason: vm.genericDetailModel }).$promise.then((response) => {
    //        BaseService.currentPagePopupForm.pop();
    //        $mdDialog.cancel();
    //    }).catch((error) => {
    //        BaseService.getErrorLog(error);
    //    });
    //}

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.VerificationForm);
      if (isdirty) {
        const data = {
          form: vm.VerificationForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };

    vm.checkFormDirty = (form, columnName) => BaseService.checkFormDirty(form, columnName);

    //on load submit form
    angular.element(() => BaseService.currentPagePopupForm.push(vm.VerificationForm));

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
  }
})();
