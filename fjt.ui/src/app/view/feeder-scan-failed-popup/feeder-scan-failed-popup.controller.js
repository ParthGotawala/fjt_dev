(function () {
  'use strict';

  angular.module('app.core')
    .controller('FeederScanFailedPopupController', FeederScanFailedPopupController);

  function FeederScanFailedPopupController(data, DialogFactory, CORE, ReceivingMaterialFactory,
    BaseService, ManufacturerFactory, MasterFactory) { // eslint-disable-line func-names
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = CORE.LabelConstant;
    vm.FeederDet = data;
    vm.showUnlockConfig = false;
    vm.accessLevelDetail = {};
    vm.verificationType = CORE.VerificationType;
    vm.unlockScreen = () => {
      vm.showUnlockConfig = true;
      // set focus on username
      setTimeout(() => {
        const userNameEle = angular.element(document.querySelector('#username'));
        userNameEle.focus();
      }, 1000);
    };
    const loginUser = BaseService.loginUser;

    vm.goToUMIDList = () => {
      BaseService.goToUMIDList();
    };

    vm.goToUMIDDetail = () => BaseService.goToUMIDDetail(vm.FeederDet.uidVerificationDet.umidID);
    
    vm.headerdata = [];
    vm.headerdata.push({ label: 'Type', value: vm.FeederDet.feederScan.type, displayOrder: 1 });
    if (vm.FeederDet.feederScan.type === vm.verificationType.FeederFirst) {
      vm.headerdata.push({
        label: vm.LabelConstant.Traveler.Feeder,
        value: vm.FeederDet.uidVerificationDet.scanString1,
        displayOrder: 2,
        isCopy: true
      });
      if (vm.FeederDet.uidVerificationDet.scanString2) {
        vm.headerdata.push({
          label: vm.LabelConstant.UMIDManagement.UMID,
          value: vm.FeederDet.uidVerificationDet.scanString2,
          displayOrder: 3,
          isCopy: true,
          labelLinkFn: vm.goToUMIDList,
          valueLinkFn: vm.FeederDet.uidVerificationDet.umidID ? vm.goToUMIDDetail : null
        });
      }
    } else if (vm.FeederDet.feederScan.type === vm.verificationType.UMIDFirst) {
      vm.headerdata.push({
        label: vm.LabelConstant.UMIDManagement.UMID,
        value: vm.FeederDet.uidVerificationDet.scanString1,
        displayOrder: 2,
        isCopy: true,
        labelLinkFn: vm.goToUMIDList,
        valueLinkFn: vm.FeederDet.uidVerificationDet.umidID ? vm.goToUMIDDetail : null
      });
      if (vm.FeederDet.uidVerificationDet.scanString2) {
        vm.headerdata.push({
          label: vm.LabelConstant.Traveler.Feeder,
          value: vm.FeederDet.uidVerificationDet.scanString2,
          displayOrder: 3
        });
      }
    } else if (vm.FeederDet.feederScan.type === vm.verificationType.OnlyUMID) {
      vm.headerdata.push({
        label: vm.LabelConstant.UMIDManagement.UMID,
        value: vm.FeederDet.uidVerificationDet.scanString1,
        displayOrder: 2,
        isCopy: true,
        labelLinkFn: vm.goToUMIDList,
        valueLinkFn: vm.FeederDet.uidVerificationDet.umidID ? vm.goToUMIDDetail : null
      });
    } else if (vm.FeederDet.feederScan.type === vm.verificationType.ScanUMIDForPreProgramming) {
      vm.headerdata.push({
        label: vm.LabelConstant.UMIDManagement.UMID,
        value: vm.FeederDet.uidVerificationDet.scanString1,
        displayOrder: 2,
        isCopy: true,
        labelLinkFn: vm.goToUMIDList,
        valueLinkFn: vm.FeederDet.uidVerificationDet.umidID ? vm.goToUMIDDetail : null
      });
    }

    function getAccessLavel() {
      return ManufacturerFactory.getAcessLeval().query({ access: CORE.ROLE_ACCESS.VERIFICATION_ROLE_ACCESS }).$promise.then((response) => {
        if (response && response.data) {
          vm.accessLevelDetail.accessRole = response.data.name;
          vm.accessLevelDetail.accessLevel = response.data.accessLevel;
          vm.accessLevelDetail.allowAccess = false;
          const currentLoginUserRole = _.find(loginUser.roles, (item) => item.id === loginUser.defaultLoginRoleID);
          if (currentLoginUserRole && currentLoginUserRole.accessLevel <= response.data.accessLevel) {
            vm.accessLevelDetail.allowAccess = true;
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    getAccessLavel();

    vm.unlockBySupervisor = () => {
      if (!vm.buttonClicked) {
        vm.buttonClicked = true;
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
            vm.FeederDet.uidVerificationDet.unlockUserID = response.data.userID;
            saveUnlockReason();
          } else {
            vm.buttonClicked = false;
          }
        }).catch((error) => {
          BaseService.getErrorLog(error);
          vm.buttonClicked = false;
        });
        // }
        // else {
        //     let obj = {
        //         title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
        //         textContent: TRANSACTION.UNAUTHORIZE_USER,
        //         multiple: true
        //     };
        //     vm.buttonClicked = false;
        //     DialogFactory.alertDialog(obj);
        // }
      }
    };

    // unlock reason
    const saveUnlockReason = () => {
      vm.cgBusyLoading = ReceivingMaterialFactory.saveUnlockVerificationDetail().query(vm.FeederDet.uidVerificationDet).$promise.then((res) => {
        if (!res.errors) {
          if (vm.buttonClicked) {
            DialogFactory.hideDialogPopup(true);
            vm.buttonClicked = false;
          }
        }
        vm.buttonClicked = false;
      }).catch((error) => BaseService.getErrorLog(error));
    };
    /* called for max length validation */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
  }
})();
