(function () {
    'use strict';

    angular.module('app.admin.certificate-standard')
        .controller('StandardClassAddPopupController', StandardClassAddPopupController);

    /** @ngInject */
    function StandardClassAddPopupController($mdDialog, data, CORE, CertificateStandardFactory, $rootScope, BaseService) {
        const vm = this;
        vm.standardClass = data;
        vm.class = data;
        vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;

        //Add Standard class
        vm.AddStandardClass = () => {
            //vm.isSubmit = false;
            $mdDialog.cancel();
            
        };
        vm.cancel = () => {
            vm.standardClass = vm.class;
            $mdDialog.cancel();
        };
    }

})();