(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('ArchieveVersionPopupController', ArchieveVersionPopupController);
  /** @ngInject */
  function ArchieveVersionPopupController($mdDialog, data, BaseService, CONFIGURATION) {
    const vm = this;
    vm.data = data;
    vm.isTemplateView = vm.data.templateType ? true : false;
    vm.templateType = vm.data.templateType;
    vm.isViewSignature = vm.data.isViewSignature ? vm.data.isViewSignature : false;
    vm.headerdata = [];

    // got to email template list
    const goToEmailTemplateList = () => BaseService.goToEmailTemplateList();

    // go to agreement template list
    const goToAgreementTemplateList = () => BaseService.goToAgreementTemplateList();

    // go to agreement template list
    const goToUserAgreementTemplateList = () => BaseService.goToUserAgreementTemplateList();

    if (vm.data.templateType === CONFIGURATION.Agreement_Template_Type.USERAGREEMENT) {
      vm.labelLink = goToUserAgreementTemplateList;
    } else if (vm.data.templateType === CONFIGURATION.Agreement_Template_Type.EMAIL) {
      vm.labelLink = goToEmailTemplateList;
    } else if (vm.data.templateType === CONFIGURATION.Agreement_Template_Type.AGREEMENT) {
      vm.labelLink = goToAgreementTemplateList;
    }

    //bind header details
    if (vm.data) {
      vm.headerdata.push({
        value: vm.data.templateLabel,
        label: CONFIGURATION.HEADER_INFORMATION.NAME,
        displayOrder: 1,
        valueLinkFn: vm.labelLink
      }, {
        value: vm.data.latestVersion,
          label: CONFIGURATION.HEADER_INFORMATION.PUBLISHED_VERSION,
        displayOrder: 2
      }, {
          value: vm.data.lastPublishedDate,
          label: CONFIGURATION.HEADER_INFORMATION.PUBLISHED_DATE,
        displayOrder: 3
      });
    }

    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
