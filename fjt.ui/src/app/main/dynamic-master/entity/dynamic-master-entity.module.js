(function () {
    'use strict';
    angular
        .module('app.customforms.entity', ['flow'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, CUSTOMFORMS, CORE) {
        $stateProvider.state(CUSTOMFORMS.CUSTOMFORMS_ENTITY_STATE, {
            url: CUSTOMFORMS.CUSTOMFORMS_ENTITY_ROUTE,
            views: {
                'content@app': {
                    templateUrl: CUSTOMFORMS.CUSTOMFORMS_ENTITY_VIEW,
                    controller: CUSTOMFORMS.CUSTOMFORMS_ENTITY_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            },
            data: {
                // autoActivateChild: CUSTOMFORMS.CUSTOMFORMS_ENTITY_LIST_STATE
            }
        })
            .state(CUSTOMFORMS.CUSTOMFORMS_ENTITY_LIST_STATE, {
                url: CUSTOMFORMS.CUSTOMFORMS_ENTITY_LIST_ROUTE,
                data: {
                    'selectedTab': 0
                },
                views: {
                    'dataelementlist': {
                        templateUrl: CUSTOMFORMS.CUSTOMFORMS_ENTITY_LIST_VIEW,
                        controller: CUSTOMFORMS.CUSTOMFORMS_ENTITY_LIST_CONTROLLER,
                    }
                },
                params: { entityID: null }
            })
         .state(CUSTOMFORMS.CUSTOMFORMS_MANAGE_ENTITY_STATE, {
             url: CUSTOMFORMS.CUSTOMFORMS_MANAGE_ENTITY_ROUTE,
             data: {
                 'selectedTab': 1
             },
             views: {
                 'managedataelement': {
                     templateUrl: CUSTOMFORMS.CUSTOMFORMS_MANAGE_ENTITY_VIEW,
                     controller: CUSTOMFORMS.CUSTOMFORMS_MANAGE_ENTITY_CONTROLLER,
                 }
             },
             params: { entityID: null, refTransID:null }
          })
          .state(CUSTOMFORMS.CUSTOMFORMS_ENTITY_HISTORY_STATE, {
            url: CUSTOMFORMS.CUSTOMFORMS_ENTITY_HISTORY_ROUTE,
           data: {
             'selectedTab': 2
           },
           views: {
             'dataelementlist': {
               templateUrl: CUSTOMFORMS.CUSTOMFORMS_ENTITY_HISTORY_VIEW,
               controller: CUSTOMFORMS.CUSTOMFORMS_ENTITY_HISTORY_CONTROLLER,
             }
           },
           params: { entityID: null }
         })

    }
})();
