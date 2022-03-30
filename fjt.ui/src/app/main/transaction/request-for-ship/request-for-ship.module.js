(function () {
    'use strict';

    angular
        .module('app.transaction.requestforship', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, TRANSACTION, CORE, USER) {        
        $stateProvider.state(TRANSACTION.TRANSACTION_REQUEST_FOR_SHIP_LIST_STATE, {
            url: TRANSACTION.TRANSACTION_REQUEST_FOR_SHIP_LIST_ROUTE,
            views: {
                'content@app': {
                    templateUrl: TRANSACTION.TRANSACTION_REQUEST_FOR_SHIP_LIST_VIEW,
                    controller: TRANSACTION.TRANSACTION_REQUEST_FOR_SHIP_LIST_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        }).state(TRANSACTION.TRANSACTION_MANAGE_REQUEST_FOR_SHIP_STATE, {
            url: TRANSACTION.TRANSACTION_MANAGE_REQUEST_FOR_SHIP_ROUTE,
            views: {
                'content@app': {
                    templateUrl: TRANSACTION.TRANSACTION_MANAGE_REQUEST_FOR_SHIP_VIEW,
                    controller: TRANSACTION.TRANSACTION_MANAGE_REQUEST_FOR_SHIP_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        })
        .state(TRANSACTION.TRANSACTION_MANAGE_DETAIL_STATE, {
          url: TRANSACTION.TRANSACTION_MANAGE_DETAIL_ROUTE,
          params: {
            selectedTab: TRANSACTION.RequestShippingTabs.Detail.Name
          },
          views: {
            'content@app': {
              templateUrl: TRANSACTION.TRANSACTION_MANAGE_REQUEST_FOR_SHIP_VIEW,
              controller:  TRANSACTION.TRANSACTION_MANAGE_REQUEST_FOR_SHIP_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        })
        .state(TRANSACTION.TRANSACTION_MANAGE_APPROVAL_STATE, {
          url: TRANSACTION.TRANSACTION_MANAGE_APPROVAL_ROUTE,
          params: {
            selectedTab: TRANSACTION.RequestShippingTabs.Approval.Name
          },
          views: {
            'content@app': {
              templateUrl: TRANSACTION.TRANSACTION_MANAGE_REQUEST_FOR_SHIP_VIEW,
              controller: TRANSACTION.TRANSACTION_MANAGE_REQUEST_FOR_SHIP_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        });
    }

})();
