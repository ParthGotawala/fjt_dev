(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('ECODFMDescriptionPopupController', ECODFMDescriptionPopupController);

    /** @ngInject */
    function ECODFMDescriptionPopupController($mdDialog, data) {
        const vm = this;
        vm.data = data;
        vm.cancel = () => {
            $mdDialog.cancel();
        };
    }
})();
