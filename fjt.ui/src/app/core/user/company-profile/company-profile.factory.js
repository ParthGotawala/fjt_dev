(function () {
  'use strict';

  angular
    .module('app.companyprofile')
    .factory('CompanyProfileFactory', CompanyProfileFactory);

/** @ngInject */
  function CompanyProfileFactory($resource, CORE) {
    return {
      getCompanyDetail: () => $resource(CORE.API_URL + 'company_info/getCompanyInfo', {}, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      checkEmailUnique: () => $resource(CORE.API_URL + 'company_info/checkEmailUnique', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      checkCompanyNameUnique: () => $resource(CORE.API_URL + 'company_info/checkCompanyNameUnique', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getCompanyAddress: () => $resource(CORE.API_URL + 'company_info/getCompanyAddress/:id', { id: '@_id'},
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      getCompanyContactPersons: () => $resource(CORE.API_URL + 'company_info/getCompanyContactPersons/:personId', { personId: '@_personId' },
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      updateCompanyPreferences: () => $resource(CORE.API_URL + 'company_info/updateCompanyPreferences', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      })
    };
  }
})();
