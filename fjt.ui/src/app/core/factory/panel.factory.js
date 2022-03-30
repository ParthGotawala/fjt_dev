(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('PanelFactory', ['USER', '$mdPanel', '$q', PanelFactory]);

    /** @ngInject */
    function PanelFactory(USER, $mdPanel, $q) {
        return {
            panelService: (ctrl, template, ev) => $mdPanel.open({
                attachTo: angular.element(document.body),
                controller: ctrl,
                controllerAs: USER.CONTROLLER_AS,
                disableParentScroll: false,
                templateUrl: template,
                hasBackdrop: true,
                panelClass: 'demo-dialog-example',
                position: $mdPanel.newPanelPosition()
                          .absolute()
                          .center(),
                trapFocus: true,
                targetEvent: ev,
                openFrom: ev,
                zIndex: 150,
                clickOutsideToClose: false,
                escapeToClose: false,
                focusOnOpen: true
            }),
        };
    }

})();