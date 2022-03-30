(function () {
    'use strict';

    angular
        .module('app.operation.operations')
        .controller('OperationImageController', OperationImageController);

    /** @ngInject */
    function OperationImageController($uibModalInstance, operationImage) {// eslint-disable-line func-names
        const vm = this;
        vm.imageName = operationImage.fileName;
        vm.heading = operationImage.heading;

        vm.cancel = () => {
            $uibModalInstance.dismiss('cancel');
        };
    }

})();