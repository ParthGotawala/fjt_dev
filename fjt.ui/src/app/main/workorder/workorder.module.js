(function () {
    'use strict';

    angular
        .module('app.workorder',
            [
                'app.workorder.workorders',
                'textAngular',
                'wipImageZoom'
            ]
        )
        .config(config);

    /** @ngInject */
    function config($stateProvider, WORKORDER) {
        $stateProvider.state(WORKORDER.WORKORDER_STATE, {
            url: WORKORDER.WORKORDER_ROUTE,
            views: {
                'content@app': {
                    template: '<div ui-view></div>'
                }
            }
        });

        //// Navigation
        //msNavigationServiceProvider.saveItem('workorder', {
        //    title: WORKORDER.WORKORDER_LABEL,
        //    icon: 'icon-receipt',
        //    weight: 3
        //});

        //msNavigationServiceProvider.saveItem('workorder.template', {
        //    title: WORKORDER.WORKORDER_WORKORDERS_LABEL,
        //    icon: 'icon-format-list-numbers',
        //    state: WORKORDER.WORKORDER_WORKORDERS_STATE
        //});
        ////msNavigationServiceProvider.saveItem('workorder.addnew', {
        ////    title: WORKORDER.WORKORDER_ADDNEW_LABEL,
        ////    icon: 'icon-playlist-plus',
        ////    state: WORKORDER.WORKORDER_ADDNEW_STATE
        ////});
        //msNavigationServiceProvider.saveItem('workorder.manage', {
        //    title: WORKORDER.WORKORDER_MANAGE_LABEL,
        //    icon: 'icon-playlist-plus',
        //    state: WORKORDER.WORKORDER_MANAGE_STATE
        //});

        ////state = '' because we want to open popup on click of menu item
        ////chat-menu-popup.directive.js: 'msNavigationItem' directive created to open popup on chat click
        //msNavigationServiceProvider.saveItem('chat', {
        //    title: 'Chat',
        //    icon: 'icon-hangouts',
        //    state: ''           
        //});
    }
})();