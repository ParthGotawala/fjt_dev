(function () {
  'use strict';

  angular
    .module('app.admin.cotactPerson')
    .factory('ContactPersonFactory', ContactPersonFactory);

  /** @ngInject */
  function ContactPersonFactory($resource, CORE) {
    return {
      retrieveContactPersonList: () => $resource(CORE.API_URL + 'customer_contactperson/retrieveContactPersonList', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      deleteCustomerContactPerson: () => $resource(CORE.API_URL + 'customer_contactperson/deleteCustomerContactPerson', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getRefEntityTypeList: () => $resource(CORE.API_URL + 'customer_contactperson/getRefEntityTypeList', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      retrieveEmployeeContactpersonList: () => $resource(CORE.API_URL + 'customer_contactperson/retrieveEmployeeContactpersonList', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      getContactPersonList: () => $resource(CORE.API_URL + 'customer_contactperson/getContactPersonList', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getContactPersonById: () => $resource(CORE.API_URL + 'customer_contactperson/getContactPersonById/:id', {
        id: '@_id'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      managePrimaryContactPersons: () => $resource(CORE.API_URL + 'customer_contactperson/managePrimaryContactPersons', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      })
    };
  }
})();
