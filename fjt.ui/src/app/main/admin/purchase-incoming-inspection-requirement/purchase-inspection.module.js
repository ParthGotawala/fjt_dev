(function () {
  'use strict';
  angular
    .module('app.admin.purchaseincominginspectionreq', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, msApiProvider, USER, CORE) {
    // State
    $stateProvider.state(USER.ADMIN_PURCHASE_INSPECTION_REQUIREMENT_STATE, {
      url: USER.ADMIN_PURCHASE_INSPECTION_REQUIREMENT_ROUTE,
      views: {
        'content@app': {
          templateUrl: USER.ADMIN_PURCHASE_INSPECTION_REQUIREMENT_VIEW,
          controller: USER.ADMIN_PURCHASE_INSPECTION_REQUIREMENT_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    });
    $stateProvider.state(USER.ADMIN_PURCHASE_INSPECTION_REQUIREMENT_TEMPLATE_STATE, {
      url: USER.ADMIN_PURCHASE_INSPECTION_REQUIREMENT_TEMPLATE_ROUTE,
      views: {
        'content@app': {
          templateUrl: USER.ADMIN_PURCHASE_INSPECTION_REQUIREMENT_TEMPLATE_VIEW,
          controller: USER.ADMIN_PURCHASE_INSPECTION_REQUIREMENT_TEMPLATE_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      },
    });
  }

})();
