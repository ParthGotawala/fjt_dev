(function () {
  'use strict';

  angular
    .module('app.transaction.receivingmaterial')
    .controller('SetDateCodeFormatPopupController', SetDateCodeFormatPopupController);

  function SetDateCodeFormatPopupController($mdDialog, $timeout, CORE, TRANSACTION, DialogFactory, BaseService, ManufacturerFactory, data, $state, DCFormatFactory, $q, USER) {
    const vm = this;
    vm.initData = data || {};
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = CORE.LabelConstant;
    vm.BUTTON_TYPE = CORE.POPUP_FOOTER_BUTTON;

    const setHeaderData = () => {
      vm.headerData = [{
        label: vm.LabelConstant.MFG.MFG,
        value: vm.dcCodeModel.mfgCodeName,
        displayOrder: 1,
        labelLinkFn: vm.goToManufacturerList,
        valueLinkFn: vm.goToManufacturer,
        valueLinkFnParams: vm.dcCodeModel.mfgCodeId,
        isCopy: true
      },
      {
        label: vm.LabelConstant.MFG.MPNCPN,
        value: vm.dcCodeModel.mfgPN,
        displayOrder: 2,
        labelLinkFn: vm.goToPartList,
        valueLinkFn: vm.goToComponentDetailTab,
        isCopy: true,
        imgParms: {
          imgPath: vm.dcCodeModel.rohsIcon !== null ? stringFormat(CORE.RoHSImageFormat, CORE.WEB_URL, USER.ROHS_BASE_PATH, vm.dcCodeModel.rohsIcon) : null,
          imgDetail: vm.dcCodeModel.rohsName
        }
      },
      {
        label: vm.LabelConstant.MFG.PID,
        value: vm.dcCodeModel.PIDCode,
        displayOrder: 3,
        labelLinkFn: vm.goToPartList,
        valueLinkFn: vm.goToComponentDetailTab,
        isCopy: true,
        isCopyAheadLabel: true,
        imgParms: {
          imgPath: vm.dcCodeModel.rohsIcon !== null ? stringFormat(CORE.RoHSImageFormat, CORE.WEB_URL, USER.ROHS_BASE_PATH, vm.dcCodeModel.rohsIcon) : null,
          imgDetail: vm.dcCodeModel.rohsName
        },
        isCopyAheadOtherThanValue: true,
        copyAheadLabel: vm.LabelConstant.MFG.MFGPN,
        copyAheadValue: vm.dcCodeModel.mfgPN
      }];
    };

    vm.pageInit = (data) => {
      vm.dcCodeModel = {
        mfgType: data && data.mfgType ? data.mfgType : null,
        mfgPN: data && data.mfgPN ? data.mfgPN : null,
        partId: data && data.partId ? data.partId : null,
        mfgCodeName: data && data.mfgCodeName ? data.mfgCodeName : null,
        mfgCodeId: data && data.mfgCodeId ? data.mfgCodeId : null,
        PIDCode: data && data.PIDCode ? data.PIDCode : null,
        rohsIcon: data && data.PIDCode ? data.rohsIcon : null,
        rohsName: data && data.rohsName ? data.rohsName : null,
        mfgCodeFormat: data && data.mfgCodeFormat === true ? true : false,
        dateCodeFormatID: data && data.dateCodeFormatID ? data.dateCodeFormatID : null
      };
      setHeaderData();
    };

    vm.autoCompleteDateCodeFormat = {
      columnName: 'dateCodeFormatValue',
      keyColumnName: 'id',
      keyColumnId: vm.dcCodeModel ? vm.dcCodeModel.dateCodeFormatID : null,
      inputName: 'dateCodeFormatValue',
      placeholderName: vm.MFRDateCodeFormat,
      isRequired: true,
      callbackFn: getDateCodeFormatList,
      onSelectCallbackFn: (item) => {
        if (item) {
          vm.autoCompleteDateCodeFormat.keyColumnId = item.id;
          vm.dcCodeModel.dateCodeFormatID = item.id;
        }
        else {
          vm.autoCompleteDateCodeFormat.keyColumnId = null;
          vm.dcCodeModel.dateCodeFormatID = null;
        }
      }
    };

    function getDateCodeFormatList() {
      return DCFormatFactory.retriveDateCodeFormatList().query({}).$promise.then((dcFormatList) => {
        if (dcFormatList && dcFormatList.data) {
          vm.dateCodeFormatList = dcFormatList.data;
          return vm.dateCodeFormatList;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }
    getDateCodeFormatList();

    // go to Manufacturer list page
    vm.goToManufacturerList = () => {
      BaseService.goToManufacturerList();
    };

    // go to part list page
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };

    // go to manufacturer edit page
    vm.goToManufacturer = () => {
      BaseService.goToManufacturer(vm.dcCodeModel.mfgCodeId);
    };

    // go to part master detail tab
    vm.goToComponentDetailTab = () => {
      BaseService.goToComponentDetailTab(vm.dcCodeModel.mfgType.toLowerCase(), vm.dcCodeModel.partId, USER.PartMasterTabs.Detail.Name);
    };

    vm.pageInit(vm.initData);

    vm.saveAndProceed = (buttonCategory, data) => {
      if (data) {
        vm.data = data;
      }
      if (buttonCategory === vm.BUTTON_TYPE.SAVE) {
        vm.dateCodeForm.$setPristine();
        vm.pageInit(data);
      } else if (buttonCategory === vm.BUTTON_TYPE.ADDNEW) {
        const isdirty = vm.checkFormDirty(vm.dateCodeForm);
        if (isdirty) {
          const data = {
            form: vm.dateCodeForm
          };
          const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_RESET_BODY_MESSAGE);
          const obj = {
            messageContent: messgaeContent,
            btnText: CORE.MESSAGE_CONSTANT.RESET_POPUP_BUTTON,
            canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
          };
          DialogFactory.messageConfirmDialog(obj).then(() => {
            if (data) {
              vm.pageInit();
              vm.dateCodeForm.$setPristine();
            }
          }, () => {
          }, (error) => BaseService.getErrorLog(error));
        } else {
          vm.pageInit();
          vm.dateCodeForm.$setPristine();
        }
      } else if (buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel(vm.data);
      }
      setFocusByName('mfgCodeFormat');
    };

    vm.saveDateCode = (buttonCategory) => {
      if (BaseService.focusRequiredField(vm.dateCodeForm)) {
        if (vm.data && vm.data.dateCodeFormatID && !vm.dateCodeForm.$dirty && buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
          $mdDialog.cancel(vm.data);
        }
        return;
      } else if (vm.dcCodeModel.mfgCodeFormat && vm.dcCodeModel.mfgCodeId) {
        vm.cgBusyLoading = ManufacturerFactory.CheckAnyCustomPartSupplierMFRMapping().save({ mfgCodeID: vm.dcCodeModel.mfgCodeId }).$promise.then((response) => {
          if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data && response.data > 0) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MFR_SUPPLIER_MAPPING_CUSTOM_PART);
            const model = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
            };
            DialogFactory.messageConfirmDialog(model).then((yes) => {
              if (yes) {
                manageSaveDateCodeDetails(buttonCategory);
              }
            }, () => $q.resolve(false)).catch((error) => BaseService.getErrorLog(error));
          } else {
            manageSaveDateCodeDetails(buttonCategory);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else if (!vm.dcCodeModel.mfgCodeFormat && vm.dcCodeModel.partId) {
        manageSaveDateCodeDetails(buttonCategory);
      }
    };

    const manageSaveDateCodeDetails = (buttonCategory) => {
      vm.cgBusyLoading = DCFormatFactory.setDateCodeFormatData().save(vm.dcCodeModel).$promise.then((res) => {
        if (res.data && res.data.dateCodeFormatID) {
          vm.saveAndProceed(buttonCategory, res.data);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.cancel = () => {
      const isdirty = vm.dateCodeForm.$dirty;
      if (isdirty) {
        const data = {
          form: vm.dateCodeForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        $mdDialog.cancel(vm.data ? vm.data : false);
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    //on load submit form
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.dateCodeForm);
    });
  }
})();
