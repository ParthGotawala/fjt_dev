(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .controller('BomLineAdditionalCommentPopupController', BomLineAdditionalCommentPopupController);

  /** @ngInject */
  function BomLineAdditionalCommentPopupController($mdDialog, CORE, data, BaseService, CustomerConfirmationPopupFactory) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.comment = null;
    vm.LabelConstant = CORE.LabelConstant;
    vm.title = 'Additional Comment';
    vm.additionalComment = {
      lineID: data.lineID,
      description: data.description,
      rfqLineItemID: data.rfqLineItemID,
      partID: data.partID,
      id: data.id
    };

    vm.save = () => {
      if (BaseService.focusRequiredField(vm.customerApprovalForm)) {
        vm.saveDisable = false;
        return;
      } else {
        const lineitemsDescription = [];
        lineitemsDescription.push(vm.additionalComment);
        const model = {
          rfqAssyID: null,
          lineitemsDescription: lineitemsDescription,
          partID: data.partID,
          fromBOM: true
        };

        vm.cgBusyLoading = CustomerConfirmationPopupFactory.createRFQLineItemsDescription().save(model).$promise.then((response) => {
          if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            BaseService.currentPagePopupForm.pop();
            _.each(response.data, (objRes) => {
              const modelObj = _.find(model.lineitemsDescription, (objModel) => objModel.lineID === objRes.lineID && objModel.rfqLineItemID === objRes.rfqLineItemID);
              if (modelObj) {
                modelObj.id = objRes.id;
              }
            });
            _.each(model.lineitemsDescription, (objModel) => {
              if (!objModel.description) {
                objModel.id = null;
              }
            });

            $mdDialog.hide(model);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.customerApprovalForm);
      if (isdirty) {
        const data = {
          form: vm.customerApprovalForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };


    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };
    /* called for max length validation */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    // popup form validation
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.customerApprovalForm);
    });
  }
})();
