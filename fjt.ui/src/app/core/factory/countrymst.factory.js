(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('CountryMstFactory', CountryMstFactory);


    /** @ngInject */
    function CountryMstFactory($resource, CORE) {
        return {

            getAllCountry: () =>  $resource(CORE.API_URL + 'countrymst/getAllCountry', {},
            {
                query: {
                    isArray: false,
                    method: 'GET'
                }
            }),
        }
    }
})();