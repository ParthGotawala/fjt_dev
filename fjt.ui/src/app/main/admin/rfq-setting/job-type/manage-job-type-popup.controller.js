(function () {
  'use strict';
  angular
    .module('app.admin.rfqsetting')
    .controller('ManageJobTypesPopupController', ManageJobTypesPopupController);
  /** @ngInject */
  function ManageJobTypesPopupController($mdDialog, $timeout, data, CORE, RFQSettingFactory, BaseService, DialogFactory) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.taToolbar = CORE.Toolbar;
    vm.clickCancel = false;
    vm.BUTTON_TYPE = CORE.POPUP_FOOTER_BUTTON;
    vm.descriptionMaxLength = _maxLengthForDescription;
    vm.historyactionButtonName = `${CORE.PAGENAME_CONSTANT[26].PageName} History`;
    let oldJobtypeName = data && data.name ? data.name : data && data.Name ? data.Name : null;
    vm.pageInit = (data) => {
      vm.jobTypeModel = {
        id: data ? data.id : null,
        name: data && data.name ? data.name : data && data.Name ? data.Name : null,
        shortname: data ? data.shortname : null,
        description: data ? data.description : null,
        termsandcondition: data ? data.termsandcondition : null,
        isActive: data ? data.isActive === undefined ? true : data.isActive : true,
        isLaborCosting: data ? data.isLaborCosting : false,
        isMaterialCosting: data ? data.isMaterialCosting : false
      };
    };
    vm.pageInit(data);

    function getDetails() {
      vm.cgBusyLoading = RFQSettingFactory.retriveJobType().query({
        id: vm.jobTypeModel.id
      }).$promise.then((response) => {
        if (response && response.data) {
          vm.jobTypeModel.name = response.data.name;
          vm.jobTypeModel.shortname = response.data.shortname;
          vm.jobTypeModel.description = response.data.description;
          vm.jobTypeModel.termsandcondition = response.data.termsandcondition;
          vm.jobTypeModel.isActive = response.data.isActive ? response.data.isActive : false;
          vm.jobTypeModel.isLaborCosting = response.data.isLaborCosting ? response.data.isLaborCosting : false;
          vm.jobTypeModel.isMaterialCosting = response.data.isMaterialCosting ? response.data.isMaterialCosting : false;
          vm.copyActive = angular.copy(vm.jobTypeModel.isActive);
          if (vm.jobTypeModel.id < 0) {
            vm.isDisabled = true;
          }
          if (response.data.rfqAssemblies && response.data.rfqAssemblies.length > 0) {
            vm.JobTypeInUse = true;
          } else {
            vm.JobTypeInUse = false;
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    vm.saveAndProceed = (buttonCategory, data) => {
      if (data) {
        vm.data = data;
      }
      if (buttonCategory === vm.BUTTON_TYPE.SAVE) {
        vm.AddJobTypesForm.$setPristine();
        vm.pageInit(data);
        getDetails();
      } else if (buttonCategory === vm.BUTTON_TYPE.ADDNEW) {
        const isdirty = vm.checkFormDirty(vm.AddJobTypesForm);
        if (isdirty) {
          const data = {
            form: vm.AddJobTypesForm
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
              vm.AddJobTypesForm.$setPristine();
            }
          }, () => {
          }, (error) => BaseService.getErrorLog(error));
        } else {
          vm.pageInit();
          vm.AddJobTypesForm.$setPristine();
        }
      } else if (buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel(vm.data);
      }
      setFocusByName('jobtypename');
    };

    if (data && data.id) {
      getDetails();
    }

    vm.saveJobType = (buttonCategory) => {
      vm.saveDisable = true;
      if (BaseService.focusRequiredField(vm.AddJobTypesForm)) {
        if (vm.jobTypeModel.id && !vm.checkFormDirty(vm.AddJobTypesForm) && buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
          $mdDialog.cancel(vm.data);
        }
        vm.saveDisable = false;
        return;
      }
      if (vm.jobTypeModel.id && vm.copyActive !== vm.jobTypeModel.isActive) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.STATUS_CHANGE_CONFIRMATION);
        messageContent.message = stringFormat(messageContent.message, vm.copyActive ? 'Enable' : 'Disable', vm.jobTypeModel.isActive ? 'Enable' : 'Disable');
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            savejobtype(buttonCategory);
          }
        }, () => {
        });
      } else { savejobtype(buttonCategory); }
    };

    // save job type
    const savejobtype = (buttonCategory) => {
      vm.cgBusyLoading = RFQSettingFactory.jobType().save(vm.jobTypeModel).$promise.then((res) => {
        if (res.data) {
          if (res.data.id) {
            oldJobtypeName = vm.jobTypeModel.name;
            vm.saveAndProceed(buttonCategory, res.data);
          }
        }
        if (res && res.status === CORE.ApiResponseTypeStatus.FAILED && res.errors.data && res.errors.data.fieldName) {
          if (checkResponseHasCallBackFunctionPromise(res)) {
            res.alretCallbackFn.then(() => {
              if (res.errors.data.fieldName === 'Name') {
                setFocus('jobtypename');
              } else {
                setFocus('jobtypeshortname');
              }
            });
          }
          if (res.errors.data.fieldName === 'Name') {
            vm.jobTypeModel.name = null;
          }
          else {
            vm.jobTypeModel.shortname = null;
          }
          $timeout(() => {
            vm.clickCancel = false;
          }, 300);
        } else {
          if (checkResponseHasCallBackFunctionPromise(res)) {
            res.alretCallbackFn.then(() => {
              BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.AddJobTypesForm);
            });
          }
        }
        vm.saveDisable = false;
      }).catch((error) => {
        vm.saveDisable = false;
        return BaseService.getErrorLog(error);
      });
    };

    vm.checkUniqueJobTypeName = (jobType) => {
      $timeout(() => {
        if (!vm.clickCancel && jobType) {
          const obj = {
            id: data ? data.id : null,
            name: jobType
          };
          vm.cgBusyLoading = RFQSettingFactory.findSameJobType().save(obj).$promise.then((res) => {
            if (res && res.status === CORE.ApiResponseTypeStatus.FAILED) {
              if (checkResponseHasCallBackFunctionPromise(res)) {
                res.alretCallbackFn.then(() => {
                  setFocus('jobtypename');
                });
              }
              vm.jobTypeModel.name = null;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }, 200);
    };

    vm.checkUniqueJobTypeShortName = (shortname) => {
      $timeout(() => {
        if (!vm.clickCancel && shortname) {
          const obj = {
            id: data ? data.id : null,
            shortname: shortname
          };
          vm.cgBusyLoading = RFQSettingFactory.findSameJobType().save(obj).$promise.then((res) => {
            if (res && res.status === CORE.ApiResponseTypeStatus.FAILED) {
              if (checkResponseHasCallBackFunctionPromise(res)) {
                res.alretCallbackFn.then(() => {
                  setFocus('jobtypeshortname');
                });
              }
              vm.jobTypeModel.shortname = null;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }, 200);
    };

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.AddJobTypesForm);
      if (isdirty) {
        const data = {
          form: vm.AddJobTypesForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
        $timeout(() => {
          vm.clickCancel = false;
        }, 300);
      } else {
        BaseService.currentPagePopupForm = [];
        $mdDialog.cancel(true);
      }
    };

    vm.htmlToPlaintext = (text) => text ? String(text).replace(/<[^>]+>/gm, '') : '';

    vm.getMaxLengthValidation = (maxLength, enterTextLength, description) => {
      if (description) {
        vm.entertext = vm.htmlToPlaintext(description);
        return BaseService.getDescrLengthValidation(maxLength, vm.entertext.length);
      } else {
        return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
      }
    };

    /* Show History Popup */
    vm.openJobTypeHistoryPopup = (ev) => {
      const data = {
        id: vm.jobTypeModel.id,
        title: vm.historyactionButtonName,
        TableName :CORE.DATAENTRYCHANGE_AUDITLOG_TABLENAME.JOBTYPE,
        EmptyMesssage : CORE.COMMON_HISTORY.JOBTYPE.HISTORY_EMPTY_MESSAGE,
        headerData: [{
          label: CORE.PAGENAME_CONSTANT[26].PageName,
          value: oldJobtypeName,
          displayOrder: 1,
          labelLinkFn: vm.gotoJobTypeList
        }]
      };

      DialogFactory.dialogService(
        CORE.COMMON_HISTORY_POPUP_MODAL_CONTROLLER,
        CORE.COMMON_HISTORY_POPUP_MODAL_VIEW,
        ev,
        data).then(() => {}, (err) => BaseService.getErrorLog(err));
    };

    /* Goto Jobtype list page. */
    vm.gotoJobTypeList = () => BaseService.goToJobTypeList();

    // Check Form Dirty state on state change and reload browser
    angular.element(() => {
      BaseService.currentPagePopupForm = [vm.AddJobTypesForm];
    });

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };
  }
})();
