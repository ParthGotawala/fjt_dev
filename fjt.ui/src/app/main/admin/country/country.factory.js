(function () {
  'use strict';

  angular
    .module('app.admin.country')
    .factory('CountryFactory', CountryFactory);

  /** @ngInject */
  function CountryFactory($resource, CORE) {
    return {
      Country: () => $resource(CORE.API_URL + 'countrymst/:countryId', {
        countryId: '@_countryId'
      }, {
        query: {
          isArray: false
        }
      }),
      retriveCountryList: () => $resource(CORE.API_URL + 'countrymst/retriveCountryList', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deleteCountry: () => $resource(CORE.API_URL + 'countrymst/deleteCountry', {
        objIDs: '@_objIDs'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      checkNameUnique: () => $resource(CORE.API_URL + 'countrymst/checkNameUnique',
        { objs: '@_objs' }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      updateCountryDisplayOrder: () => $resource(CORE.API_URL + 'countrymst/updateCountryDisplayOrder', {
        countryModel: '@_countryModel'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      checkUniqueCountryAlias: () => $resource(CORE.API_URL + 'countrymst/checkUniqueCountryAlias', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      })
    };
  }
})();
