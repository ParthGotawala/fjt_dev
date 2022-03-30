(function () {
  'use strict';

  angular
    .module('app.transaction.kitlist', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, TRANSACTION, CORE) {
    $stateProvider.state(TRANSACTION.KIT_LIST_STATE, {
      url: TRANSACTION.KIT_LIST_ROUTE,
      params: {
        selectedTab: CORE.KitListTab.KitList.Name
      },
      views: {
        'content@app': {
          templateUrl: TRANSACTION.KIT_LIST_VIEW,
          controller: TRANSACTION.KIT_LIST_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    }).state(TRANSACTION.SUB_KIT_LIST_STATE, {
      url: TRANSACTION.SUB_KIT_LIST_ROUTE,
      params: {
        selectedTab: CORE.KitListTab.SubKitList.Name
      },
      views: {
        'content@app': {
          templateUrl: TRANSACTION.SUB_KIT_LIST_VIEW,
          controller: TRANSACTION.SUB_KIT_LIST_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      },
      resolve: {
      }
    });
  }
})();
