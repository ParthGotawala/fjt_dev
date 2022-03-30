(function () {
  'use restrict';

  angular.module('app.transaction.receivingmaterial')
    .controller('UIDTransferDeallocationVerificationPopUpController', UIDTransferDeallocationVerificationPopUpController);

  /* @ngInject */
  function UIDTransferDeallocationVerificationPopUpController(data, $mdDialog, $filter, CORE, BaseService, MasterFactory, USER) {
    var vm = this;
    vm.LabelConstant = CORE.LabelConstant;
    vm.DefaultDateFormat = _dateTimeDisplayFormat;
    vm.countApprovalData = data || [];
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.headerData = [];
    vm.isFromSplitUMID = data.isFromSplitUMID;
    vm.MEASUREMENT_TYPES_COUNT = CORE.MEASUREMENT_TYPES.COUNT;
    let messageContent;
    messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.APPROVED_TO_DEALLOCATE_FROM_KIT_WARNING);
    vm.APPROVED_TO_DEALLOCATE_FROM_KIT_WARNING = stringFormat(messageContent.message, vm.isFromSplitUMID ? 'Split Count/Units' : 'Consumption');
    messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.COUNT_MATERIAL_CONFIRMATION_WITH_SELECTED_KIT);
    vm.kitDeallocationNote = stringFormat(messageContent.message, vm.countApprovalData.UMID, vm.countApprovalData.currentUnit, vm.countApprovalData.uom, !vm.countApprovalData.isKitSelected ? '' : 'will consumed against', vm.countApprovalData.selectedKitName, vm.APPROVED_TO_DEALLOCATE_FROM_KIT_WARNING);
    vm.reasonNote = CORE.COUNT_MATERIAL_POPUP_NOTES.APPROVE_TO_DEALLOCATE_FROM_KIT_NOTE;

    vm.goToUMIDList = () => {
      BaseService.goToUMIDList();
    };

    vm.goToUMIDDetail = () => BaseService.goToUMIDDetail(vm.countApprovalData.umidId);

    vm.goToManufacturerList = () => {
      BaseService.goToManufacturerList();
    };

    // go to part list page
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };

    // go to manufacturer edit page
    vm.goToManufacturer = () => {
      BaseService.goToManufacturer(vm.countApprovalData.mfgCodeID);
    };

    // go to part master detail tab
    vm.goToComponentDetailTab = () => {
      BaseService.goToComponentDetailTab(vm.countApprovalData.mfgType.toLowerCase(), vm.countApprovalData.componentID, USER.PartMasterTabs.Detail.Name);
    };

    vm.goToUOMList = () => {
      BaseService.goToUOMList();
    };

    vm.headerData = [{
      label: vm.LabelConstant.TransferStock.UMID,
      value: vm.countApprovalData.UMID,
      displayOrder: 1,
      labelLinkFn: vm.goToUMIDList,
      valueLinkFn: vm.goToUMIDDetail,
      isCopy: true
    }, {
      label: vm.LabelConstant.MFG.MFG,
      value: vm.countApprovalData.mfgCode,
      displayOrder: 2,
      labelLinkFn: vm.goToManufacturerList,
      valueLinkFn: vm.goToManufacturer
    }, {
      label: vm.LabelConstant.MFG.MFGPN,
      value: vm.countApprovalData.mfgPN,
      displayOrder: 3,
      labelLinkFn: vm.goToPartList,
      valueLinkFn: vm.goToComponentDetailTab,
      isCopy: true,
      isCopyAheadLabel: true,
      imgParms: {
        imgPath: vm.countApprovalData.rfq_rohsmst.rohsIcon !== null ? stringFormat(CORE.RoHSImageFormat, CORE.WEB_URL, USER.ROHS_BASE_PATH, vm.countApprovalData.rfq_rohsmst.rohsIcon) : null,
        imgDetail: vm.countApprovalData.rfq_rohsmst.name
      },
      isCopyAheadOtherThanValue: true,
      copyAheadLabel: vm.LabelConstant.MFG.MFGPN,
      copyAheadValue: vm.countApprovalData.mfgPN
    }, {
      label: 'Current Count',
      value: vm.countApprovalData.currentQty,
      displayOrder: 4,
      isUnitFormat: vm.countApprovalData.uomClassID === vm.MEASUREMENT_TYPES_COUNT.ID ? false : true
    }, {
      label: 'Current Unit',
      value: vm.countApprovalData.currentUnit,
      displayOrder: 5,
      isUnitFormat: vm.countApprovalData.uomClassID === vm.MEASUREMENT_TYPES_COUNT.ID ? false : true
    }, {
      label: 'UOM',
      value: vm.countApprovalData.uom,
      displayOrder: 6,
      labelLinkFn: vm.goToUOMList
    }];

    vm.Save = () => {
      if (BaseService.focusRequiredField(vm.countApprovalForm)) {
        return;
      }
      const encryptedUserName = encryptAES(vm.countapproval.username);
      const encryptedPassword = encryptAES(vm.countapproval.password);
      const model = {
        username: encryptedUserName.toString(),
        password: encryptedPassword.toString(),
        accessLevel: vm.countApprovalData && vm.countApprovalData.accessLevelDetail ? vm.countApprovalData.accessLevelDetail.accessLevel : null
      };

      vm.cgBusyLoading = MasterFactory.verifyUser().save(model).$promise.then((response) => {
        if (response && response.data) {
          BaseService.currentPagePopupForm.pop();
          const countApprovalData = {
            approvalReason: vm.countapproval.reason,
            approvedBy: null,
            approvedByRoleId: null,
            isApproved: true,
            deallocatedKitDesc: null
          };
          $mdDialog.hide(countApprovalData);
        }
      }).catch((error) => {
        BaseService.getErrorLog(error);
      });
    };

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.countApprovalForm);
      if (isdirty) {
        const data = {
          form: vm.countApprovalForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };

    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.countApprovalForm);
    });
  }
})();
