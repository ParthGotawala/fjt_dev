(function () {
  'use strict';

  angular.module('app.admin.supplierattributetemplate').factory('SupplierAttributeTemplateFactory', SupplierAttributeTemplateFactory);
  /** @ngInject */
  function SupplierAttributeTemplateFactory($resource, CORE) {
    return {
      retrieveSupplierAttributeList: () => $resource(CORE.API_URL + 'supplierAttributeTemplate/retrieveSupplierAttributeList', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      checkSupplierAttributeTemplateUnique: () => $resource(CORE.API_URL + 'supplierAttributeTemplate/checkSupplierAttributeTemplateUnique', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      saveSupplierAttributeTemplate: () => $resource(CORE.API_URL + 'supplierAttributeTemplate/saveSupplierAttributeTemplate', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      deleteSupplierAttributeTemplate: () => $resource(CORE.API_URL + 'supplierAttributeTemplate/deleteSupplierAttributeTemplate', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getSupplierList: () => $resource(CORE.API_URL + 'supplierAttributeTemplate/getSupplierList', {},
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      getSupplierAttributeTemplateByID: () => $resource(CORE.API_URL + 'supplierAttributeTemplate/getSupplierAttributeTemplateByID/:id', {
        id: '@_id'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      })
    };
  }
})();
