(function () {
  'use strict';
  angular
    .module('app.admin.supplierattributetemplate', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, msApiProvider, USER, CORE) {
    // State
    $stateProvider.state(USER.ADMIN_SUPPLIER_ATTRIBUTE_TEMPLATE_STATE, {
      url: USER.ADMIN_SUPPLIER_ATTRIBUTE_TEMPLATE_ROUTE,
      views: {
        'content@app': {
          templateUrl: USER.ADMIN_SUPPLIER_ATTRIBUTE_TEMPLATE_VIEW,
          controller: USER.ADMIN_SUPPLIER_ATTRIBUTE_TEMPLATE_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    });
  }

})();
