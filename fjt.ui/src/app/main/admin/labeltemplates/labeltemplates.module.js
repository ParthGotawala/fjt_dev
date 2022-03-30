(function () {
  'use strict';

  angular
    .module('app.admin.labeltemplates', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, msApiProvider, USER, CORE) {

    $stateProvider.state(USER.ADMIN_LABELTEMPLATE_PRINTER_FORMAT_STATE, {
      url: USER.ADMIN_LABELTEMPLATE_PRINTER_FORMAT_ROUTE,
     
      views: {
        'content@app': {
          templateUrl: USER.ADMIN_LABELTEMPLATES_VIEW,
          controller: USER.ADMIN_LABELTEMPLATES_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    });

    $stateProvider.state(USER.ADMIN_MANAGELABELTEMPLATES_STATE, {
      url: USER.ADMIN_MANAGELABELTEMPLATES_ROUTE,      
      views: {
        'content@app': {
          templateUrl: USER.ADMIN_MANAGELABELTEMPLATES_VIEW,
          controller: USER.ADMIN_MANAGELABELTEMPLATES_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    });

  }

})();
