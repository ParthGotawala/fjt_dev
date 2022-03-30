(function () {
    'use strict';

    angular
        .module('app.admin.unitconversion')
        .factory('UnitConversionFactory', UnitConversionFactory);

    /** @ngInject */
    function UnitConversionFactory($resource, CORE, $http) {
        return {
            retriveConversionList: () => $resource(CORE.API_URL + 'measurement_type/retriveConversionList/:id', {
                id: '@_id'
            }, {
                query: {
                    isArray: false,
                    method: 'GET',
                }
            }),
        }
    }
})();