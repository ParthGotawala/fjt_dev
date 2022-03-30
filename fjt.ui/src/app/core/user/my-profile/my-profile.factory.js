(function () {
  'use strict';

  angular
    .module('app.userprofile')
    .factory('MyProfileFactory', MyProfileFactory);

  /** @ngInject */
  function MyProfileFactory($resource, CORE) {
    return {
      changePassword: () => $resource(CORE.API_URL + 'employees/changePassword', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getUserPreference: () => $resource(CORE.API_URL + 'userConfig/getUserPreference', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      saveUserConfiguration: () => $resource(CORE.API_URL + 'userConfig/saveUserConfiguration', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      })
    };
  }
})();
