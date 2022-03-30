(function () {
  'use strict';
  angular
    .module('app.configuration.managetemplate', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, CONFIGURATION, CORE) {
    $stateProvider.state(CONFIGURATION.CONFIGURATION_MANAGE_TEMPLATE_STATE, {
      url: CONFIGURATION.CONFIGURATION_MANAGE_TEMPLATE_ROUTE,
      views: {
        'content@app': {
          template: '<div ui-view></div>'
        }
      }
    });
    $stateProvider.state(CONFIGURATION.CONFIGURATION_AGREEMENT_TEMPLATE_STATE, {
      url: CONFIGURATION.CONFIGURATION_AGREEMENT_TEMPLATE_ROUTE,
      params: {
        templateType: CONFIGURATION.Agreement_Template_Type.AGREEMENT
      },
      views: {
        'content@app': {
          templateUrl: CONFIGURATION.CONFIGURATION_AGREEMENT_TEMPLATE_VIEW,
          controller: CONFIGURATION.CONFIGURATION_AGREEMENT_TEMPLATE_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    });
    $stateProvider.state(CONFIGURATION.CONFIGURATION_MAIL_TEMPLATE_STATE, {
      url: CONFIGURATION.CONFIGURATION_MAIL_TEMPLATE_ROUTE,
      params: {
        templateType: CONFIGURATION.Agreement_Template_Type.EMAIL
      },
      views: {
        'content@app': {
          templateUrl: CONFIGURATION.CONFIGURATION_AGREEMENT_TEMPLATE_VIEW,
          controller: CONFIGURATION.CONFIGURATION_AGREEMENT_TEMPLATE_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    });
    $stateProvider.state(CONFIGURATION.CONFIGURATION_AGREEMENT_STATE, {
      url: CONFIGURATION.CONFIGURATION_AGREEMENT_ROUTE,
      params: {
        templateType: CONFIGURATION.Agreement_Template_Type.AGREEMENT
      },
      views: {
        'content@app': {
          templateUrl: CONFIGURATION.CONFIGURATION_AGREEMENT_VIEW,
          controller: CONFIGURATION.CONFIGURATION_AGREEMENT_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    });
    $stateProvider.state(CONFIGURATION.CONFIGURATION_EMAIL_TEMPLATE_STATE, {
      url: CONFIGURATION.CONFIGURATION_EMAIL_TEMPLATE_ROUTE,
      params: {
        templateType: CONFIGURATION.Agreement_Template_Type.EMAIL
      },
      views: {
        'content@app': {
          templateUrl: CONFIGURATION.CONFIGURATION_AGREEMENT_VIEW,
          controller: CONFIGURATION.CONFIGURATION_AGREEMENT_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    });
    $stateProvider.state(CONFIGURATION.CONFIGURATION_MANAGE_EMAIL_STATE, {
      url: CONFIGURATION.CONFIGURATION_MANAGE_EMAIL_ROUTE,
      params: {
        templateType: CONFIGURATION.Agreement_Template_Type.EMAIL
      },
      views: {
        'content@app': {
          templateUrl: CONFIGURATION.CONFIGURATION_MANAGE_AGREEMENT_EMAIL_VIEW,
          controller: CONFIGURATION.CONFIGURATION_MANAGE_AGREEMENT_EMAIL_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    });
    $stateProvider.state(CONFIGURATION.CONFIGURATION_MANAGE_AGREEMENT_STATE, {
      url: CONFIGURATION.CONFIGURATION_MANAGE_AGREEMENT_ROUTE,
      params: {
        templateType: CONFIGURATION.Agreement_Template_Type.AGREEMENT
      },
      views: {
        'content@app': {
          templateUrl: CONFIGURATION.CONFIGURATION_MANAGE_AGREEMENT_EMAIL_VIEW,
          controller: CONFIGURATION.CONFIGURATION_MANAGE_AGREEMENT_EMAIL_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    });
  }
})();
