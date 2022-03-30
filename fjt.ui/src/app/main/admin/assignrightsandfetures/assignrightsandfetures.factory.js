(function () {
    'use strict';

    angular
        .module('app.admin.assignrightsandfetures')
        .factory('AssignRightsandFeturesFactory', AssignRightsandFeturesFactory);

    /** @ngInject */
    // Used this service for Assign rights and features for multiple users
    function AssignRightsandFeturesFactory($resource, CORE) {
        return {
            // Get userlist
            getUserList: () => $resource(CORE.API_URL + 'users/getUserList', {}, {
                query: {
                    isArray: false,
                    method: 'GET',
                },
            }),

             // Get all employee list which is assigned for perticular page - JAY SOLANKI
             retrieveEmployeeListForRights: () => $resource(CORE.API_URL + 'userPagePermision/retrieveEmployeeListForRights', {},
             {
                 query: {
                   isArray: false,
                   method: 'POST'
                 }
             }),

            // Get all employee list which is assigned for perticular feature - JAY SOLANKI
            retrieveEmployeeListForFeatureRights: () => $resource(CORE.API_URL + 'featureUserMapping/retrieveEmployeeListForFeatureRights', {},
            {
                query: {
                  isArray: false,
                  method: 'POST'
                }
            }),

            // Used for assign page or remove rights for selected pages for selected users - JAY SOLANKI
            mulitpleUserPagePermision: () => $resource(CORE.API_URL + 'userPagePermision/updateMulitpleUserPagePermision', {},
                {
                query: {
                  isArray: false,
                  method: 'POST'
                }
            }),

            // Used for assign page or remove rights for selected features for selected users - JAY SOLANKI
            mulitpleUserFeaturesPermision: () => $resource(CORE.API_URL + 'featureUserMapping/updateMulitpleUserFeatureRight', {}, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            })
        };
    }
})();