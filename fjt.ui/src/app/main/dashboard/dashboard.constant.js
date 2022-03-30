(function () {
  'use strict';
  /** @ngInject */
  var DASHBOARD = {
    /**
     * ROUTES
     * STATES
     * CONTROLLERS
     * VIEWS / TEMPLATES
     * STRINGS
     */

    DASHBOARD_LABEL: 'Dashboard',
    DASHBOARD_ROUTE: '/dashboard',
    DASHBOARD_STATE: 'app.dashboard',
    DASHBOARD_CONTROLLER: 'DashboardController',
    DASHBOARD_VIEW: 'app/main/dashboard/dashboard.html',

    USERNAME_LABEL: '{{UserName}}',
    //USERNAME_LABEL: angular.injector(['BaseService']).loginUser.username,

    LOGOUT_LABEL: 'Logout',
    LOGOUT_ROUTE: '/logout',
    LOGOUT_STATE: 'app.logout',
    LOGOUT_CONTROLLER: 'LogoutController',

    MYPROFILE_LABEL: 'My Profile',

    MYPROFILE_ROUTE: '/myprofile',
    MYPROFILE_STATE: 'app.profile',
    MYPROFILE_CONTROLLER: 'DashboardController',
    MYPROFILE_VIEW: 'app/main/dashboard/dashboard.html',

    SERVICE_STATUS_ROUTE: '/status-service/service-status.html',
    SERVICE_STATUS_STATE: 'app.servicestatuspage',
    SERVICE_STATUS_CONTROLLER: 'ServiceStatusPageController',
    SERVICE_STATUS_VIEW: '/status-service/service-status.html'

  };

  angular
    .module('app.dashboard')
    .constant('DASHBOARD', DASHBOARD);
})();
