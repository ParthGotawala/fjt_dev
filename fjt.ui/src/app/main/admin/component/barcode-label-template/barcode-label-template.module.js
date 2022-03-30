(function () {
  'use strict';

  angular
    .module('app.admin.barcode-label-template', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, msApiProvider, USER, CORE) {

    // State
    $stateProvider.state(USER.ADMIN_BARCODE_LABEL_TEMPLATE_STATE, {
      url: USER.ADMIN_BARCODE_LABEL_TEMPLATE_ROUTE,
      views: {
        'content@app': {
          templateUrl: USER.ADMIN_BARCODE_LABEL_TEMPLATE_VIEW,
          controller: USER.ADMIN_BARCODE_LABEL_TEMPLATE_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    });

    $stateProvider.state(USER.ADMIN_MANAGE_BARCODE_LABEL_TEMPLATE_STATE, {
      url: USER.ADMIN_MANAGE_BARCODE_LABEL_TEMPLATE_ROUTE,
      views: {
        'content@app': {
          templateUrl: USER.ADMIN_MANAGE_BARCODE_LABEL_TEMPLATE_VIEW,
          controller: USER.ADMIN_MANAGE_BARCODE_LABEL_TEMPLATE_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    });
  }
})();
