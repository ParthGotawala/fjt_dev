(function () {
  'use strict';

  angular
    .module('app.admin.defectCategory')
    .factory('DefectCategoryFactory', DefectCategoryFactory);

  /** @ngInject */
  function DefectCategoryFactory($resource, CORE) {
    return {
      DefectCategory: () => $resource(CORE.API_URL + 'defectcategory/:defectCatId', {
        defectCatId: '@_defectCatId'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        },
        update: {
          method: 'PUT'
        }
      }),
      retriveDefectCategoryList: () => $resource(CORE.API_URL + 'defectcategory/retriveDefectCategoryList', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      checkDuplicateDefectCategoryName: () => $resource(CORE.API_URL + 'defectcategory/checkDuplicateDefectCategoryName', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      })
    };
  }
})();
