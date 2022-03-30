(function () {
  'use strict';

  angular
    .module('app.dashboard', ['chart.js'])
    .config(config);

  /** @ngInject */
  function config($stateProvider, DASHBOARD, CORE) {
    $stateProvider.state(DASHBOARD.DASHBOARD_STATE, {
      url: DASHBOARD.DASHBOARD_ROUTE,
      views: {
        'content@app': {
          templateUrl: DASHBOARD.DASHBOARD_VIEW,
          controller: DASHBOARD.DASHBOARD_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      },
      resolve: {
        //DashboardData: function (msApi) {
        //    return msApi.resolve('dashboard.project@get');
        //}
      }
    }).state(DASHBOARD.MYPROFILE_STATE, {
      url: DASHBOARD.MYPROFILED_ROUTE,
      views: {
        'content@app': {
          templateUrl: DASHBOARD.MYPROFILE_VIEW,
          controller: DASHBOARD.MYPROFILE_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      },
      resolve: {
        //DashboardData: function (msApi) {
        //    return msApi.resolve('dashboard.project@get');
        //}
      }
    }).state(DASHBOARD.LOGOUT_STATE, {
      url: DASHBOARD.LOGOUT_ROUTE
    }).state(DASHBOARD.SERVICE_STATUS_STATE, {
      url: DASHBOARD.SERVICE_STATUS_ROUTE,
      external: true
    });

    //// Navigation
    //msNavigationServiceProvider.saveItem('LoginUser', {
    //    title: DASHBOARD.USERNAME_LABEL,
    //    icon: 'icon-account-box-outline',
    //});

    //// Navigation
    //msNavigationServiceProvider.saveItem('LoginUser.myprofile', {
    //    title: DASHBOARD.MYPROFILE_LABEL,
    //    icon: 'icon-account'
    //});

    //// Navigation
    //msNavigationServiceProvider.saveItem('LoginUser.Logout', {
    //    title: DASHBOARD.LOGOUT_LABEL,
    //    icon: 'icon-logout',
    //    state: DASHBOARD.LOGOUT_STATE,
    //});

    //// Navigation
    //msNavigationServiceProvider.saveItem('LoginUser.Logout', {
    //    title: DASHBOARD.LOGOUT_LABEL,
    //    icon: 'icon-logout',
    //    state: DASHBOARD.LOGOUT_STATE,
    //    weight: 8
    //});

    //msNavigationServiceProvider.saveItem('dashboard', {
    //    title: DASHBOARD.DASHBOARD_LABEL,
    //    icon: 'icon-home',
    //    state: DASHBOARD.DASHBOARD_STATE,
    //    weight: 2
    //});
  }
})();
