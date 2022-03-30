(function () {
    'use strict';

    angular
        .module('app.admin.certificate-standard', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, USER, CORE) {
        // State
        $stateProvider.state(USER.CERTIFICATE_STANDARD_STATE, {
            url: USER.CERTIFICATE_STANDARD_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.CERTIFICATE_STANDARD_VIEW,
                    controller: USER.CERTIFICATE_STANDARD_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        })
          .state(USER.ADMIN_MANAGE_CERTIFICATE_STANDARD_DETAIL_STATE, {
            url: USER.ADMIN_MANAGE_CERTIFICATE_STANDARD_DETAIL_ROUTE,
            params: {
              tabname: USER.StandardsTabs.Detail.Name
            },
            views: {
              'content@app': {
                templateUrl: USER.ADMIN_CERTIFICATE_STANDARD_UPDATE_VIEW,
                controller: USER.ADMIN_CERTIFICATE_STANDARD_UPDATE_CONTROLLER,
                controllerAs: CORE.CONTROLLER_AS
              }
            }
          })
          .state(USER.ADMIN_MANAGE_CERTIFICATE_STANDARD_DOCUMENTS_STATE, {
            url: USER.ADMIN_MANAGE_CERTIFICATE_STANDARD_DOCUMENTS_ROUTE,
            params: {
              tabname: USER.StandardsTabs.Documents.Name
            },
            views: {
              'content@app': {
                templateUrl: USER.ADMIN_CERTIFICATE_STANDARD_UPDATE_VIEW,
                controller: USER.ADMIN_CERTIFICATE_STANDARD_UPDATE_CONTROLLER,
                controllerAs: CORE.CONTROLLER_AS
              }
            }
          })
          .state(USER.ADMIN_MANAGE_CERTIFICATE_STANDARD_PERSONNEL_STATE, {
            url: USER.ADMIN_MANAGE_CERTIFICATE_STANDARD_PERSONNEL_ROUTE,
            params: {
              tabname: USER.StandardsTabs.Personnel.Name
            },
            views: {
              'content@app': {
                templateUrl: USER.ADMIN_CERTIFICATE_STANDARD_UPDATE_VIEW,
                controller: USER.ADMIN_CERTIFICATE_STANDARD_UPDATE_CONTROLLER,
                controllerAs: CORE.CONTROLLER_AS
              }
            }
          })
          .state(USER.ADMIN_MANAGE_CERTIFICATE_STANDARD_MISC_STATE, {
            url: USER.ADMIN_MANAGE_CERTIFICATE_STANDARD_MISC_ROUTE,
            params: {
              tabname: USER.StandardsTabs.MISC.Name
            },
            views: {
              'content@app': {
                templateUrl: USER.ADMIN_CERTIFICATE_STANDARD_UPDATE_VIEW,
                controller: USER.ADMIN_CERTIFICATE_STANDARD_UPDATE_CONTROLLER,
                controllerAs: CORE.CONTROLLER_AS
              }
            }
          });
    }

})();
