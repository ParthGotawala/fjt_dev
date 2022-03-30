(function () {
    'use strict';

    angular
        .module('app.admin.department', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider, USER, CORE) {
        // State
        $stateProvider.state(USER.ADMIN_DEPARTMENT_STATE, {
            url: USER.ADMIN_DEPARTMENT_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_DEPARTMENT_VIEW,
                    controller: USER.ADMIN_DEPARTMENT_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });

      $stateProvider.state(USER.ADMIN_MANAGEDEPARTMENT_STATE, {
        url: USER.ADMIN_MANAGEDEPARTMENT_ROUTE,
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGEDEPARTMENT_VIEW,
            controller: USER.ADMIN_MANAGEDEPARTMENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      //});
        }).state(USER.ADMIN_MANAGEDEPARTMENT_DETAIL_STATE, {
          url: USER.ADMIN_MANAGEDEPARTMENT_DETAIL_ROUTE,
          params: {
            selectedTab: USER.DepartmentTabs.Detail.Name
          },
          views: {
            'content@app': {
              templateUrl: USER.ADMIN_MANAGEDEPARTMENT_VIEW,
              controller: USER.ADMIN_MANAGEDEPARTMENT_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        }).state(USER.ADMIN_MANAGEDEPARTMENT_EMPLOYEE_STATE, {
          url: USER.ADMIN_MANAGEDEPARTMENT_EMPLOYEE_ROUTE,
          params: {
            selectedTab: USER.DepartmentTabs.Employee.Name
          },
          views: {
            'content@app': {
              templateUrl: USER.ADMIN_MANAGEDEPARTMENT_VIEW,
              controller: USER.ADMIN_MANAGEDEPARTMENT_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        }).state(USER.ADMIN_MANAGEDEPARTMENT_LOCATION_STATE, {
          url: USER.ADMIN_MANAGEDEPARTMENT_LOCATION_ROUTE,
          params: {
            selectedTab: USER.DepartmentTabs.Geolocations.Name
          },
          views: {
            'content@app': {
              templateUrl: USER.ADMIN_MANAGEDEPARTMENT_VIEW,
              controller: USER.ADMIN_MANAGEDEPARTMENT_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        }).state(USER.ADMIN_MANAGEDEPARTMENT_MISC_STATE, {
            url: USER.ADMIN_MANAGEDEPARTMENT_MISC_ROUTE,
            params: {
              selectedTab: USER.DepartmentTabs.Misc.Name
            },
            views: {
              'content@app': {
                templateUrl: USER.ADMIN_MANAGEDEPARTMENT_VIEW,
                controller: USER.ADMIN_MANAGEDEPARTMENT_CONTROLLER,
                controllerAs: CORE.CONTROLLER_AS
              }
            }
          });
    }

})();
