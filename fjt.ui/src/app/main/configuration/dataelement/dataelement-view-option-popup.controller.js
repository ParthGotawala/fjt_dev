(function () {
    'use strict';

    angular
        .module('app.configuration.dataelement')
        .controller('DataElementViewOptionPopupController', DataElementViewOptionPopupController);

    /** @ngInject */
    function DataElementViewOptionPopupController($mdDialog, CORE, data) {
        const vm = this;
        vm.dataelement = data;
        vm.InputeFieldKeys = CORE.InputeFieldKeys;
        vm.cancel = () => {
            $mdDialog.cancel();
        };
    }
})();
