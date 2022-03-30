(function () {
  'use strict';

  angular
    .module('app.admin.employee', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, msApiProvider, USER, CORE) {
    // State
    $stateProvider.state(USER.ADMIN_EMPLOYEE_STATE, {
      url: USER.ADMIN_EMPLOYEE_ROUTE,
      views: {
        'content@app': {
          templateUrl: USER.ADMIN_EMPLOYEE_VIEW,
          controller: USER.ADMIN_EMPLOYEE_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    })
      .state(USER.ADMIN_EMPLOYEE_MANAGE_STATE, {
        url: USER.ADMIN_EMPLOYEE_MANAGE_ROUTE,
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_EMPLOYEE_UPDATE_VIEW,
            controller: USER.ADMIN_EMPLOYEE_UPDATE_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      }).state(USER.ADMIN_EMPLOYEE_MANAGE_DETAIL_STATE, {
        url: USER.ADMIN_EMPLOYEE_MANAGE_DETAIL_ROUTE,
        params: {
          selectedTab: USER.EmployeeMasterTabs.Detail.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_EMPLOYEE_UPDATE_VIEW,
            controller: USER.ADMIN_EMPLOYEE_UPDATE_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      }).state(USER.ADMIN_EMPLOYEE_MANAGE_CREDENTIAL_STATE, {
        url: USER.ADMIN_EMPLOYEE_MANAGE_CREDENTIAL_ROUTE,
        params: {
          selectedTab: USER.EmployeeMasterTabs.Credential.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_EMPLOYEE_UPDATE_VIEW,
            controller: USER.ADMIN_EMPLOYEE_UPDATE_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_EMPLOYEE_MANAGE_SECURITY_AND_SETTINGS_STATE, {
        url: USER.ADMIN_EMPLOYEE_MANAGE_SECURITY_AND_SETTINGS_ROUTE,
        params: {
          selectedTab: USER.EmployeeMasterTabs.Security.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_EMPLOYEE_UPDATE_VIEW,
            controller: USER.ADMIN_EMPLOYEE_UPDATE_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_EMPLOYEE_MANAGE_RIGHTS_SUMMARY_STATE, {
        url: USER.ADMIN_EMPLOYEE_MANAGE_RIGHTS_SUMMARY_ROUTE,
        params: {
          selectedTab: USER.EmployeeMasterTabs.RightsSummary.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_EMPLOYEE_UPDATE_VIEW,
            controller: USER.ADMIN_EMPLOYEE_UPDATE_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_EMPLOYEE_MANAGE_DEPARTMENT_STATE, {
        url: USER.ADMIN_EMPLOYEE_MANAGE_DEPARTMENT_ROUTE,
        params: {
          selectedTab: USER.EmployeeMasterTabs.Department.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_EMPLOYEE_UPDATE_VIEW,
            controller: USER.ADMIN_EMPLOYEE_UPDATE_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_EMPLOYEE_MANAGE_DOCUMENTS_STATE, {
        url: USER.ADMIN_EMPLOYEE_MANAGE_DOCUMENTS_ROUTE,
        params: {
          selectedTab: USER.EmployeeMasterTabs.Documents.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_EMPLOYEE_UPDATE_VIEW,
            controller: USER.ADMIN_EMPLOYEE_UPDATE_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_EMPLOYEE_MANAGE_WORKSTATIONS_STATE, {
        url: USER.ADMIN_EMPLOYEE_MANAGE_WORKSTATIONS_ROUTE,
        params: {
          selectedTab: USER.EmployeeMasterTabs.Workstations.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_EMPLOYEE_UPDATE_VIEW,
            controller: USER.ADMIN_EMPLOYEE_UPDATE_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_EMPLOYEE_MANAGE_CUSTOMERMAPPING_STATE, {
        url: USER.ADMIN_EMPLOYEE_MANAGE_CUSTOMERMAPPING_ROUTE,
        params: {
          selectedTab: USER.EmployeeMasterTabs.CustomerMapping.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_EMPLOYEE_UPDATE_VIEW,
            controller: USER.ADMIN_EMPLOYEE_UPDATE_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_EMPLOYEE_MANAGE_OTHERDETAIL_STATE, {
        url: USER.ADMIN_EMPLOYEE_MANAGE_OTHERDETAIL_ROUTE,
        params: {
          selectedTab: USER.EmployeeMasterTabs.OtherDetail.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_EMPLOYEE_UPDATE_VIEW,
            controller: USER.ADMIN_EMPLOYEE_UPDATE_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_EMPLOYEE_MANAGE_PREFERENCE_STATE, {
        url: USER.ADMIN_EMPLOYEE_MANAGE_PREFERENCE_ROUTE,
        params: {
          selectedTab: USER.EmployeeMasterTabs.Preference.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_EMPLOYEE_UPDATE_VIEW,
            controller: USER.ADMIN_EMPLOYEE_UPDATE_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_EMPLOYEE_PROFILE_STATE, {
        url: USER.ADMIN_EMPLOYEE_PROFILE_ROUTE,
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_EMPLOYEE_PROFILE_VIEW,
            controller: USER.ADMIN_EMPLOYEE_PROFILE_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      }).state(USER.ADMIN_EMPLOYEE_TIMELINE_STATE, {
        url: USER.ADMIN_EMPLOYEE_TIMELINE_ROUTE,
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_EMPLOYEE_TIMELINE_VIEW,
            controller: USER.ADMIN_EMPLOYEE_TIMELINE_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      }).state(USER.MANAGE_EMPLOYEE_OPERATIONS_STATE, {
        url: USER.MANAGE_EMPLOYEE_OPERATIONS_ROUTE,
        views: {
          'content@app': {
            templateUrl: USER.MANAGE_EMPLOYEE_OPERATIONS_VIEW,
            controller: USER.MANAGE_EMPLOYEE_OPERATIONS_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      }).state(USER.ADMIN_EMPLOYEE_MANAGE_USERAGREEMENT_STATE, {
        url: USER.ADMIN_EMPLOYEE_MANAGE_USERAGREEMENT_ROUTE,
        params: {
          selectedTab: USER.EmployeeMasterTabs.UserAgreement.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_EMPLOYEE_UPDATE_VIEW,
            controller: USER.ADMIN_EMPLOYEE_UPDATE_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
  }
})();
