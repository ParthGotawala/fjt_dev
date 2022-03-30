(function () {
  'use strict';

  angular
    .module('app.admin.aliasPartsValidation')
    .factory('AliasPartsValidationFactory', scanner);
  /** @ngInject */
  function scanner($resource, CORE) {
    return {
      retrieveAliasPartsValidation: () => $resource(CORE.API_URL + 'aliasPartsValidation/retrieveAliasPartsValidation', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      saveAliasPartsValidation: () => $resource(CORE.API_URL + 'aliasPartsValidation/createAliasPartsValidation', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      updateAliasPartsValidation: () => $resource(CORE.API_URL + 'aliasPartsValidation/updateAliasPartsValidation', { aliasPartsValidationInfo: '@_aliasPartsValidationInfo' }, {
        query: {
          method: 'PUT',
          isArray: false
        }
      }),
      deleteAliasPartsValidation: () => $resource(CORE.API_URL + 'aliasPartsValidation/deleteAliasPartsValidation', {
        objDelete: '@_objDelete'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      checkAlternatePartValidationUsed: () => $resource(CORE.API_URL + 'aliasPartsValidation/checkAlternatePartValidationUsed', {
        objIDs: '@_objIDs'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getColumnField: () => $resource(CORE.API_URL + 'aliasPartsValidation/getColumnField', {},
        {
          query: {
            method: 'GET',
            isArray: false
          }
        }),
      retrieveAliasPartsValidationDetails: () => $resource(CORE.API_URL + 'aliasPartsValidation/retrieveAliasPartsValidationDetails', {
        listObj: '@_listObj'
      },
        {
          query: {
            method: 'POST',
            isArray: false
          }
        }),
      checkAliasPartsValidationExists: () => $resource(CORE.API_URL + 'aliasPartsValidation/checkAliasPartsValidationExists', {
        objs: '@_objs'
      },
        {
          query: {
            method: 'POST',
            isArray: false
          }
        }),
      copyAliasPartalidations: () => $resource(CORE.API_URL + 'aliasPartsValidation/copyAliasPartalidations', {
        copyAliasPartValidationsObj: '@_copyAliasPartValidationsObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      })
    };
  }
})();
