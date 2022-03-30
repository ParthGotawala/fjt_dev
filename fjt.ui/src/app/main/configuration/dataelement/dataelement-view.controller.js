(function () {
    'use strict';

    angular
        .module('app.configuration.dataelement')
        .controller('DataElementViewController', DataElementViewController);

    /** @ngInject */
    function DataElementViewController($stateParams) {

        const vm = this;
        vm.entityID = $stateParams.id;
        if (vm.entityID) {
        }
        else {
        }
    }
})();