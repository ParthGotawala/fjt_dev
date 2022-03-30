(function () {
  'use strict';

  angular
    .module('app.admin.genericcategory')
    .factory('GenericCategoryFactory', GenericCategoryFactory);

  /** @ngInject */
  function GenericCategoryFactory($resource, CORE, $http) {
    return {
      retrieveGenericCategory: () => $resource(CORE.API_URL + 'genericcategory/retriveGenericCategory', { },
    {
      query: {
        isArray: false,
          method: 'POST'
      }
    }),
      genericcategory: () => $resource(CORE.API_URL + 'genericcategory/:id/:categoryType?', {
        id: '@_id'
      }, {
        query: {
          isArray: false,
          method: 'POST'
        },
        update: {
          method: 'PUT'
        }
      }),
      retriveGenericCategoryList: () => $resource(CORE.API_URL + 'genericcategory/retriveGenericCategoryList', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getAllGenericCategoryList: () => $resource(CORE.API_URL + 'genericcategory/getAllGenericCategoryList', {},
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      getAllGenericCategoryByCategoryType: () => $resource(CORE.API_URL + 'genericcategory/getAllGenericCategoryByCategoryType', {
        categoryType: '@_categoryType'
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getSelectedGenericCategoryList: () => $resource(CORE.API_URL + 'genericcategory/getSelectedGenericCategoryList', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      downloadGenericCategoryTemplate: (categoryType) => $http.get(CORE.API_URL + 'genericcategory/downloadGenericCategoryTemplate/' + categoryType, { responseType: 'arraybuffer' })
        .then((response) => response
          , (error) => error),
      deleteGenericCategory: () => $resource(CORE.API_URL + 'genericcategory/deleteGenericCategory', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      checkGenericCategoryAlreadyExists: () => $resource(CORE.API_URL + 'genericcategory/checkGenericCategoryAlreadyExists',
        { objs: '@_objs' }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      })
    };
  }
})();
