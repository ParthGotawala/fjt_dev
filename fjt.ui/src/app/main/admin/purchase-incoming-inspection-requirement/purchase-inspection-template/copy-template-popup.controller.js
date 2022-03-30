(function () {
  'use strict';

  angular
    .module('app.admin.user')
    .controller('CopyPurchaseInspectionTemplateModalController', CopyPurchaseInspectionTemplateModalController);

  /** @ngInject */
  function CopyPurchaseInspectionTemplateModalController($state, $mdDialog, OPERATION, CORE, data, OperationFactory, DialogFactory, BaseService, $timeout, PurchaseInspectionRequirementFactory) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = CORE.LabelConstant.PURCHASE_INSPECTION_REQUIREMENT;
    vm.copyPurchaseInspectionTemplate = {
      name: data && data.name ? data.name : null,
      TemplateName: null
    };
    let oldPurchaseInspectionTemplateCode = '';

    // close popup
    vm.cancel = () => {
      if (BaseService.checkFormDirty(vm.purchaseInspectionTemplateForm)) {
        const data = {
          form: vm.purchaseInspectionTemplateForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };

    //Set as current form when page loaded
    angular.element(() => BaseService.currentPagePopupForm.push(vm.purchaseInspectionTemplateForm));

    // save record of copied template
    vm.copyTemplate = () => {
      if (!vm.purchaseInspectionTemplateForm.$valid) {
        BaseService.focusRequiredField(vm.purchaseInspectionTemplateForm);
        return;
      }

      const obj = {
        name: vm.copyPurchaseInspectionTemplate.TemplateName,
        copyTemplate: true,
        newRequirementList: data.requirementList
      };
      vm.cgBusyLoading = PurchaseInspectionRequirementFactory.saveTemplate().save(obj).$promise.then((res) => {
        if (res && res.data) {
          $mdDialog.hide(res.data);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // check unique validation
    vm.checkDuplicateTemplateName = () => {
      if (vm.copyPurchaseInspectionTemplate && vm.copyPurchaseInspectionTemplate.TemplateName) {
        if (oldPurchaseInspectionTemplateCode !== vm.copyPurchaseInspectionTemplate.TemplateName) {
          if (vm.purchaseInspectionTemplateForm && vm.purchaseInspectionTemplateForm.TemplateName.$dirty && vm.copyPurchaseInspectionTemplate.TemplateName) {
            vm.cgBusyLoading = PurchaseInspectionRequirementFactory.checkDuplicateTemplate().query({
              name: vm.copyPurchaseInspectionTemplate.TemplateName
            }).$promise.then((res) => {
              oldPurchaseInspectionTemplateCode = angular.copy(vm.copyPurchaseInspectionTemplate.TemplateName);
              if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicate) {
                displayPurchaseInspectionTemplateUniqueMessage();
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }
      }
    };

    // display unique validation error message
    const displayPurchaseInspectionTemplateUniqueMessage = () => {
      oldPurchaseInspectionTemplateCode = '';
      vm.copyPurchaseInspectionTemplate.TemplateName = null;
      const templateNameEle = angular.element(document.querySelector('#TemplateName'));

      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
      messageContent.message = stringFormat(messageContent.message, 'Template');

      const obj = {
        messageContent: messageContent,
        multiple: true
      };
      DialogFactory.messageAlertDialog(obj).then(() => templateNameEle.focus());
    };

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
  }
})();
