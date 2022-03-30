(function () {
  'use restrict';

  angular.module('app.configuration')
    .controller('AgreementTypePopupController', AgreementTypePopupController);

  /* @ngInject */
  function AgreementTypePopupController(data, $mdDialog, DialogFactory, CORE, BaseService, AgreementFactory) {
    var vm = this;
    vm.isAgreementFormDirty = true;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.loginUser = BaseService.loginUser;
    vm.userId = vm.loginUser.identityUserId;
    vm.userName = vm.loginUser.employee.initialName;
    vm.userRole = _.find(vm.loginUser.roles, (item) => item.id === vm.loginUser.defaultLoginRoleID);
    vm.roleName = vm.userRole.name;

    if (data) {
      vm.agreement = {
        agreementTypeID: data.agreementTypeID,
        displayName: data.displayName ? data.displayName : null,
        templateType: data.templateType,
        userName: vm.userName,
        userRoleName: vm.roleName
      };
    }

    // Check Duplicate Agreement Type
    vm.checkDuplicateName = () => {
      vm.isduplicate = false;

      if (vm.agreement.displayName) {
        vm.cgBusyLoading = AgreementFactory.checkDuplicateAgreementType().save({
          agreementTypeID: (vm.agreement.agreementTypeID || vm.agreement.agreementTypeID === 0) ? vm.agreement.agreementTypeID : null,
          displayName: vm.agreement.displayName,
          templateType: vm.agreement.templateType
        }).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.data && res.data.isDuplicate) {
            vm.isduplicate = true;
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
            messageContent.message = stringFormat(messageContent.message, 'Name');

            const uniqueObj = {
              messageContent: messageContent,
              controlName: 'displayName'
            };

            const obj = {
              messageContent: uniqueObj.messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK,
              multiple: true
            };

            vm.agreement.displayName = null;

            DialogFactory.messageAlertDialog(obj).then(() => {
              if (uniqueObj.controlName) {
                setFocusByName(uniqueObj.controlName);
              }
            }, () => {
            }).catch((error) => BaseService.getErrorLog(error));
          };
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    // Save Agreement Type
    vm.SaveAgreementType = () => {
      if (BaseService.focusRequiredField(vm.AgreementForm, vm.isAgreementFormDirty)) {
        return;
      }
      vm.cgBusyLoading = AgreementFactory.saveAgreementType().save(vm.agreement).$promise.then((res) => {
        if (res.data && res.data.agreementTypeID) {
          BaseService.currentPagePopupForm = [];
          $mdDialog.hide(res.data);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    vm.cancel = () => {
      const isdirty = vm.AgreementForm.$dirty;
      if (isdirty) {
        const data = {
          form: vm.AgreementForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm = [];
        $mdDialog.cancel();
      }
    };

    // Check Form Dirty state on state change and reload browser
    angular.element(() => {
      BaseService.currentPagePopupForm = [vm.AgreementForm];
    });
  };
})();
