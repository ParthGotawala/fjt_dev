(function () {
  'use strict';

  angular
    .module('app.admin.eco')
    .factory('ECOFactory', ECOFactory);

  /** @ngInject */
  function ECOFactory($resource, CORE) {
    return {
      ECOCategory: () => $resource(CORE.API_URL + 'ecocategory/:ecoTypeCatID', {
        ecoTypeCatID: '@_ecoTypeCatID'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        },
        update: {
          method: 'PUT'
        }
      }),
      retriveECOCategoryList: () => $resource(CORE.API_URL + 'ecocategory/retrieveECOCategoryList', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getAllECOTypeCategory: (param) => $resource(CORE.API_URL + 'ecocategory/getAllECOTypeCategory', { category: '@_category' },
        {
          query: {
            isArray: false,
            params: {
              page: param && param.Page ? param.Page : 1,
              pageSize: CORE.UIGrid.ItemsPerPage(),
              order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
              search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null,
              category: param && param.category ? param.category : null
            }
          }
        }),
      ECOTypeValue: () => $resource(CORE.API_URL + 'ecotypevalue/:ecoTypeValID', {
        ecoTypeValID: '@_ecoTypeValID'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        },
        update: {
          method: 'PUT'
        }
      }),
      retriveECOTypeValuesList: () => $resource(CORE.API_URL + 'ecotypevalue/retriveECOTypeValuesList', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deleteECOTypeCategory: () => $resource(CORE.API_URL + 'ecocategory/deleteECOTypeCategory', {
        objIDs: '@_objIDs'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deleteECOTypeValue: () => $resource(CORE.API_URL + 'ecotypevalue/deleteECOTypeValue', {
        objIDs: '@_objIDs'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getECOCategoryList: () => $resource(CORE.API_URL + 'ecotypevalue/getECOCategoryList', { categoryType: '@_categoryType' },
        {
          query: {
            method: 'POST',
            isArray: false
          }
        }),
      checkEcoCategoryAlreadyExists: () => $resource(CORE.API_URL + 'ecocategory/checkEcoCategoryAlreadyExists',
        { objs: '@_objs' }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      checkEcoTypeValuesAlreadyExists: () => $resource(CORE.API_URL + 'ecotypevalue/checkEcoTypeValuesAlreadyExists',
        { objs: '@_objs' }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      })
    };
  }
})();
