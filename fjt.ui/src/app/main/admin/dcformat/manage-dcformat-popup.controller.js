(function () {
  'use restrict';

  angular.module('app.admin.datecodeformat')
    .controller('ManageDCFormatPopupController', ManageDCFormatPopupController);

  /* @ngInject */
  function ManageDCFormatPopupController(data, $mdDialog, $scope, $filter, DialogFactory, CORE, BaseService, USER, DCFormatFactory) {
    var vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = CORE.LabelConstant;
    vm.pageName = CORE.PageName.DCFormat;
    vm.BUTTON_TYPE = CORE.POPUP_FOOTER_BUTTON;
    vm.DateCodeCategory = USER.DateCodeCategory;
    vm.textAreaRows = CORE.TEXT_AREA_ROWS;
    vm.DateCodeFormatList = USER.GregorianDateCodeFormatList;
    vm.JulianDateCodeFormatList = USER.JulianDateCodeFormatList;

    vm.pageInit = (data) => {
      vm.dcformatModel = {
        id: data && data.id ? data.id : null,
        systemID: data && data.systemID ? data.systemID : null,
        dateCodeFormat: data && data.dateCodeFormat ? data.dateCodeFormat : null,
        description: data && data.description ? data.description : null,
        category: data && data.category ? data.category : vm.DateCodeCategory[0].key,
        systemGenerated: data && data.systemGenerated ? data.systemGenerated : false,
        option1: vm.DateCodeFormatList[0].id,
        option2: vm.DateCodeFormatList[0].id,
        option3: vm.DateCodeFormatList[0].id,
        option4: vm.DateCodeFormatList[0].id
      };
      vm.DateCodeFormatList = vm.dcformatModel.category === vm.DateCodeCategory[1].key ? USER.JulianDateCodeFormatList : USER.GregorianDateCodeFormatList;
      if (vm.dcformatModel.id) {
        setOptionData(vm.dcformatModel);
      }
    };

    const setOptionData = (data) => {
      let initDateCodeFormat = angular.copy(data.dateCodeFormat);
      let intialCode;
      let initalOption = 1;
      let optionValue;
      while (initDateCodeFormat.length > 0) {
        intialCode = initDateCodeFormat.substring(0, 1);
        optionValue = initDateCodeFormat.substring(initDateCodeFormat.indexOf(intialCode), initDateCodeFormat.lastIndexOf(intialCode) + 1);
        vm.dcformatModel['option' + initalOption] = _.find(vm.DateCodeFormatList, { value: optionValue }).id;
        initDateCodeFormat = initDateCodeFormat.replace(optionValue, '');
        initalOption++;
      }
      return initDateCodeFormat.length;
    };

    vm.saveAndProceed = (buttonCategory, data) => {
      if (data) {
        vm.data = data;
      }
      if (buttonCategory === vm.BUTTON_TYPE.SAVE) {
        vm.dcFormatForm.$setPristine();
        vm.pageInit(data);
      } else if (buttonCategory === vm.BUTTON_TYPE.ADDNEW) {
        const isdirty = vm.checkFormDirty(vm.dcFormatForm);
        if (isdirty) {
          const data = {
            form: vm.dcFormatForm
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
              vm.dcFormatForm.$setPristine();
            }
          }, () => {
          }, (error) => BaseService.getErrorLog(error));
        } else {
          vm.pageInit();
          vm.dcFormatForm.$setPristine();
        }
      } else if (buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel(vm.data);
      }
      setFocus('description');
    };

    // Edit FOB Details
    const retriveDCFormatById = (id) => {
      vm.cgBusyLoading = DCFormatFactory.retriveDCFormatById().query({ id: id }).$promise.then((response) => {
        if (response && response.data) {
          vm.pageInit(response.data);
          vm.headerData = [{
            label: vm.pageName,
            value: vm.dcformatModel.dateCodeFormat,
            displayOrder: 1,
            labelLinkFn: vm.goToDCFormatList
          }];
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // Save FOB Details
    vm.saveDCFormat = (buttonCategory) => {
      let messageContent = null;
      if (BaseService.focusRequiredField(vm.dcFormatForm)) {
        if (vm.dcformatModel.id && !vm.dcFormatForm.$dirty && buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
          $mdDialog.cancel(vm.data);
        }
        return;
      } else {
        if (!vm.dcformatModel.dateCodeFormat) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_VALUE);
          messageContent.message = stringFormat(messageContent.message, vm.pageName, vm.pageName);
        } else if (!vm.dcformatModel.systemGenerated) {
          if (!vm.dcformatModel.dateCodeFormat.contains(vm.DateCodeFormatList[4].value)) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.INVALID_MFR_DATE_CODE);
          } else if (vm.dcformatModel.dateCodeFormat.contains('YYYYY')) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.INVALID_MFR_DATE_CODE);
          } else if (!(vm.dcformatModel.dateCodeFormat.contains(vm.DateCodeFormatList[3].value) || vm.dcformatModel.dateCodeFormat.contains(vm.DateCodeFormatList[2].value))) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.INVALID_MFR_DATE_CODE);
          }
        }
        if (messageContent) {
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model).then((yes) => {
            if (yes) {
              setFocus('option1');
              return true;
            }
          }, () => true).catch((error) => BaseService.getErrorLog(error));
        } else {
          vm.cgBusyLoading = DCFormatFactory.saveDCFormatDetails().save(vm.dcformatModel).$promise.then((res) => {
            if (res.data && res.data.id) {
              vm.saveAndProceed(buttonCategory, res.data);
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
    };

    if (data && data.id) {
      retriveDCFormatById(data.id);
    } else {
      vm.pageInit();
    }

    vm.selectedDateCode = (data) => {
      $timeout(() => {
        retriveDCFormatById(data.id);
      });
    };

    vm.generateDateCodeFormat = (modelName) => {
      let alreadySelected = false;
      const dateCodeFormat = vm.dcformatModel.dateCodeFormat;
      if (vm.dcformatModel[modelName] !== vm.DateCodeFormatList[0].id) {
        if (dateCodeFormat) {
          alreadySelected = dateCodeFormat.contains(_.find(vm.DateCodeFormatList, { id: vm.dcformatModel[modelName] }).value);
          if (alreadySelected) {
            vm.dcformatModel[modelName] = vm.DateCodeFormatList[0].id;
          }
        }
      }
      vm.dcformatModel.dateCodeFormat = '';
      for (let i = 1; i <= 4; i++) {
        if (vm.dcformatModel['option' + i]) {
          const findObject = _.find(vm.DateCodeFormatList, { id: vm.dcformatModel['option' + i] });
          vm.dcformatModel.dateCodeFormat += findObject.value;
        }
      }
    };

    vm.checkValidDateCodeFormat = () => {
      let messageContent = null;
      if (!vm.dcformatModel.dateCodeFormat) {
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_VALUE);
        messageContent.message = stringFormat(messageContent.message, vm.pageName, vm.pageName);
      } else if (!vm.dcformatModel.systemGenerated) {
        if (!vm.dcformatModel.dateCodeFormat.contains(vm.DateCodeFormatList[4].value)) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.INVALID_MFR_DATE_CODE);
        } else if (vm.dcformatModel.dateCodeFormat.contains(vm.DateCodeFormatList[4].value) && vm.dcformatModel.dateCodeFormat.contains(vm.DateCodeFormatList[5].value)) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.INVALID_MFR_DATE_CODE);
        } else if ((!vm.dcformatModel.dateCodeFormat.contains(vm.DateCodeFormatList[3].value) && vm.dcformatModel.dateCodeFormat.contains(vm.DateCodeFormatList[2].value)) ||
          (vm.dcformatModel.dateCodeFormat.contains(vm.DateCodeFormatList[3].value) && !vm.dcformatModel.dateCodeFormat.contains(vm.DateCodeFormatList[2].value))) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.INVALID_MFR_DATE_CODE);
        }
      }
      if (messageContent) {
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model).then((yes) => {
          if (yes) {
            setFocus('option1');
            return true;
          }
        }, () => true).catch((error) => BaseService.getErrorLog(error));
      } else {
        return false;
      }
    };

    vm.goToDCFormatList = () => BaseService.goToDCFormatList();

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    vm.cancel = () => {
      const isdirty = vm.dcFormatForm.$dirty;
      if (isdirty) {
        const data = {
          form: vm.dcFormatForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        $mdDialog.cancel(true);
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    // Check Form Dirty state on state change and reload browser
    angular.element(() => {
      BaseService.currentPagePopupForm = [vm.dcFormatForm];
    });
  };
})();
