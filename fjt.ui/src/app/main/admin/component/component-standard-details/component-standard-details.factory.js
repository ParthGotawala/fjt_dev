(function () {
    'use strict';

    angular
        .module('app.admin.componentStandardDetails')
        .factory('ComponentStandardDetailsFactory', ComponentStandardDetailsFactory);

    /** @ngInject */
    function ComponentStandardDetailsFactory($resource, CORE) {
        return {
         
            getcomponentstandardDetail: (param) => $resource(CORE.API_URL + 'componentStandardDetails/getStandardDetail/:id',
            { id: '@_id' },
             {
                 query: {
                     isArray: false,
                     method: "GET"
                 },
             }),
            createComponentStandardDetail: () => $resource(CORE.API_URL + 'componentStandardDetails/createComponentStandardDetail/', {},
                {
                    query: {
                        method: 'POST',
                        isArray: false
                    }
                }),
        }
    }

})();