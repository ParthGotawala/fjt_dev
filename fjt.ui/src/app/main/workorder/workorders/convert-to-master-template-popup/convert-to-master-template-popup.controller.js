(function () {
  'use strict';

  angular
    .module('app.admin.user')
    .controller('ConvertToMasterTemplateController', ConvertToMasterTemplateController);

  /** @ngInject */
  function ConvertToMasterTemplateController($state, $mdDialog, OPERATION, CORE, data, DialogFactory, OperationFactory, WorkorderFactory, BaseService, $timeout, $scope) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    let oldMasterTemplateCode = '';
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.headerdata = [];
    /* hyperlink go for list page */
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };

    /* go to particular assy */
    vm.goToPartDetails = () => {
        BaseService.goToComponentDetailTab(null, data.partID);
      return false;
    };
    //redirect to work order list
    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
      return false;
    };

    vm.goToWorkorderDetails = (woData) => {
      BaseService.goToWorkorderDetails(woData.woID);
      return false;
    };


    vm.goToOperationMasterTemplateList = () => {
      BaseService.goToOperationMasterTemplateList();
    };

    vm.headerdata = [{
      value: data.PIDCode,
      label: CORE.LabelConstant.Assembly.ID,
      displayOrder: (vm.headerdata.length + 1),
      labelLinkFn: vm.goToPartList,
      valueLinkFn: vm.goToPartDetails,
      isCopy: true,
      imgParms: {
        imgPath: data.rohsIcon,
        imgDetail: data.rohsName
      }
    }, {
      label: vm.LabelConstant.Workorder.WO, value: data.woNumber, displayOrder: (vm.headerdata.length + 1), labelLinkFn: vm.goToWorkorderList,
      valueLinkFn: vm.goToWorkorderDetails,
      valueLinkFnParams: { woID: data.woID }
    }, { label: vm.LabelConstant.Workorder.Version, value: data.woVersion, displayOrder: (vm.headerdata.length + 1) }
    ];
    vm.cancel = () => {
      let isdirty = vm.checkFormDirty(vm.masterTemplateForm);
      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        $mdDialog.cancel();
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      let checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    }

    //copy master template data into other details template
    vm.convertToMasterTemplate = () => {
      vm.isSubmit = false;
      if (!vm.masterTemplateForm.$valid) {
        vm.isSubmit = true;
        BaseService.focusRequiredField(vm.masterTemplateForm);
        return;
      }
      if (vm.masterTemplateForm.$dirty) {
        let obj = {
          title: stringFormat(CORE.MESSAGE_CONSTANT.ALERT_HEADER),
          textContent: stringFormat(CORE.MESSAGE_CONSTANT.ONLY_PUBLISHED_OPERATION_CONVERTINTOTEMPLATE),
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.confirmDiolog(obj).then((yes) => {
          if (yes) {
            const masterTemplateInfo = {
              woID: data.woID,
              masterTemplate: vm.mastertemplate.masterTemplate,
              description: vm.mastertemplate.description,
            }
            vm.cgBusyLoading = WorkorderFactory.convertToMasterTemplate().query({ obj: masterTemplateInfo }).$promise.then((masterTemplate) => {
              if (masterTemplate.status != "FAILED") {
                let obj = {
                  title: stringFormat(CORE.MESSAGE_CONSTANT.ALERT_HEADER),
                  textContent: stringFormat(CORE.MESSAGE_CONSTANT.SHOW_CONVERTED_OPERATION_LIST),
                  btnText: 'VIEW OPERATIONS',
                  canbtnText: 'CLOSE'
                };
                DialogFactory.confirmDiolog(obj).then((yes) => {
                  let data = masterTemplate.data;
                  if (yes) {
                    BaseService.openInNew(OPERATION.OPERATION_MASTER_MANAGE_TEMPLATE_STATE, { id: masterTemplate.data.masterTemplateID });
                    $mdDialog.cancel(masterTemplate.data);
                  }
                }, (cancel) => {
                  $mdDialog.cancel(masterTemplate.data);
                }).catch((error) => {
                  return BaseService.getErrorLog(error);
                });
              }
            }).catch((error) => {
              return BaseService.getErrorLog(error);
            });
          }
        }, (cancel) => {
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
      else {
        $mdDialog.cancel();
      }
    };

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    }

    vm.checkDublicateMasterTemplate = () => {
      if (vm.mastertemplate && oldMasterTemplateCode != vm.mastertemplate.masterTemplate) {
        if (vm.masterTemplateForm && vm.masterTemplateForm.masterTemplate.$dirty && vm.mastertemplate.masterTemplate) {
          vm.cgBusyLoading = OperationFactory.checkDublicateMasterTemplate().query({
            id: vm.mastertemplate.id,
            masterTemplate: vm.mastertemplate.masterTemplate
          }).$promise.then((res) => {
            vm.cgBusyLoading = false;
            oldMasterTemplateCode = angular.copy(vm.mastertemplate.masterTemplate);
            if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicateMasterTemplate) {
              displayMasterTemplateUniqueMessage();
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
    };

    /* display standard code unique confirmation message */
    let displayMasterTemplateUniqueMessage = () => {
      oldMasterTemplateCode = '';
      vm.mastertemplate.masterTemplate = null;
      let masterTemplateEle = angular.element(document.querySelector('#masterTemplate'));
      masterTemplateEle.focus();

      let obj = {
        title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
        textContent: stringFormat(CORE.MESSAGE_CONSTANT.OPERATION_NUMBER_UNIQUE, "Template"),
        multiple: true
      };
      DialogFactory.alertDialog(obj);
    }
  }
})();
