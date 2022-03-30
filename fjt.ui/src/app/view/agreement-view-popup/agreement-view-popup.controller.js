(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('AgreementPopupController', AgreementPopupController);


  /** @ngInject */
  function AgreementPopupController($mdDialog, data, BaseService, CONFIGURATION, CORE, DialogFactory, $filter, AgreementFactory) {
    const vm = this;
    vm.data = data;
    vm.headerdata = [];
    vm.agreementApproval = {};
    vm.agreementTypeID = vm.data.agreementTypeID;
    vm.isTemplateView = vm.data.isTemplateView ? vm.data.isTemplateView : false;
    vm.isArchieveVersion = vm.data.isArchieveVersion ? vm.data.isArchieveVersion : false;
    vm.isShowSignature = vm.data.isShowSignature ? vm.data.isShowSignature : false;
    vm.Title = !vm.isTemplateView ? CONFIGURATION.HEADER_INFORMATION.TERMS_AND_CONDITION : vm.isArchieveVersion ? vm.data.pageName : stringFormat('View {0}', vm.data.pageName);
    vm.Label = CONFIGURATION.HEADER_INFORMATION;

    // Get Agreement Type and Last Published details
    const getAgreementDetails = () => {
      vm.cgBusyLoading = AgreementFactory.getAgreementDetails().query({ agreementTypeID: vm.agreementTypeID }).$promise.then((template) => {
        vm.AgreementDetails = template.data.data;
        vm.headerdata.push({
          value: vm.AgreementDetails.LastPublishversion,
          label: CONFIGURATION.HEADER_INFORMATION.CURRENT_VERSION,
          displayOrder: 1
        });
        vm.headerdata.push({
          value: vm.AgreementDetails.LastPublishedDate,
          label: CONFIGURATION.HEADER_INFORMATION.EFFECTIVE_DATE,
          displayOrder: 2
        });
      });
    };

    // got to email template list
    const goToEmailTemplateList = () => BaseService.goToEmailTemplateList();

    // go to agreement template list
    const goToAgreementTemplateList = () => BaseService.goToAgreementTemplateList();

    //bind header details
    if (vm.isTemplateView) {
      vm.headerdata.push({
        value: vm.data.templateLabel,
        label: CONFIGURATION.HEADER_INFORMATION.NAME,
        displayOrder: 1,
        valueLinkFn: vm.data.templateType === CONFIGURATION.Agreement_Template_Type.EMAIL ? goToEmailTemplateList : goToAgreementTemplateList
      }, {
        value: vm.data.isPublished ? CONFIGURATION.HEADER_INFORMATION.PUBLISHED : CONFIGURATION.HEADER_INFORMATION.DRAFT,
        label: CONFIGURATION.HEADER_INFORMATION.STATUS,
        displayOrder: 2
      });
    } else {
      getAgreementDetails();
    }

    vm.cancel = () => {
      if (!vm.isTemplateView) {
        const isdirty = vm.agreementForm.$dirty;
        if (isdirty) {
          const data = {
            form: vm.agreementForm
          };
          BaseService.showWithoutSavingAlertForPopUp(data);
        } else {
          $mdDialog.cancel();
        }
      } else {
        $mdDialog.hide();
      }
    };

    vm.agree = () => {
      if (BaseService.focusRequiredField(vm.agreementForm)) {
        const elmnt = document.getElementById('signaturePadDiv');
        elmnt.scrollIntoView();
        return;
      }
      $mdDialog.hide(vm.agreementApproval);
    };

    /* set signature after drag on signature-pad */
    vm.setSignatureValue = (signature) => {
      if (signature.isEmpty || !signature.dataUrl) {
        const model = {
          messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.PROVIDE_SIGNATURE),
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
        return;
      }
      vm.agreementApproval.signaturevalue = signature.dataUrl;
      vm.isSignatureAdded = true;
      vm.agreementForm.signaturePad.$setDirty();
    };

    /* clear signature */
    vm.clearSignatureValue = () => {
      vm.isSignatureAdded = false;
      vm.agreementForm.$setPristine();
      vm.agreementForm.$setUntouched();
    };

    /* cancel signature */
    vm.cancelSignatureValue = () => {
      vm.isSignatureAdded = true;
      vm.agreementForm.signaturePad.$setDirty();
    };

    /* delete  signature to add new one */
    vm.deleteSignatureValue = (clearFunCallback, acceptFunCallback, signature) => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
      messageContent.message = stringFormat(messageContent.message, 'Signature', '');
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          clearFunCallback();  //clear();
          signature = acceptFunCallback();  //accept();
          vm.agreementApproval.signaturevalue = null;
          vm.isSignatureAdded = false;
          vm.agreementForm.$setPristine();
          vm.agreementForm.$setUntouched();
        }
      }).catch((error) => { BaseService.getErrorLog(error); });
    };

    // check signature has changed or not
    vm.checkSignatureChanges = () => {
      if (vm.agreementForm) {
        vm.agreementForm.signaturePad.$setDirty();
      }
    };
  }
})();
