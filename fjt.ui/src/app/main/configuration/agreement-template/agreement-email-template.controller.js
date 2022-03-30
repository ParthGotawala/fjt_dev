(function () {
  'use strict';

  angular
    .module('app.configuration.managetemplate')
    .controller('AgreementEmailTemplateController', AgreementEmailTemplateController);

  /** @ngInject */
  function AgreementEmailTemplateController($stateParams, CONFIGURATION) {
    var vm = this;
    vm.templateType = $stateParams.templateType;

    switch (vm.templateType) {
      case CONFIGURATION.Agreement_Template_Type.AGREEMENT:
        vm.pageName = CONFIGURATION.CONFIGURATION_AGREEMENT_LABEL;
        vm.emptyMesssage = CONFIGURATION.CONFIGURATION_EMPTYSTATE.AGREEMENT;
        break;
      case CONFIGURATION.Agreement_Template_Type.EMAIL:
        vm.pageName = CONFIGURATION.CONFIGURATION_EMAIL_TEMPLATE_LABEL;
        vm.emptyMesssage = CONFIGURATION.CONFIGURATION_EMPTYSTATE.MAIL_TEMPLATE;
        break;
    }
  }
})();
