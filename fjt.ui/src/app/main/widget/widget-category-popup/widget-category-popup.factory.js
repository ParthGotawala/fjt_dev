(function () {
  'use strict';

  angular
    .module('app.widget')
    .factory('WidgetCategoryPopupFactory', WidgetCategoryPopupFactory);

  /** @ngInject */
  function WidgetCategoryPopupFactory($resource, CORE) {
    return {
      saveChartCategory: () => $resource(CORE.API_URL + 'chartcategory/saveChartCategory', null,
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      getChartCategoryByID: () => $resource(CORE.API_URL + 'chartcategory/getChartCategoryByID/:id',
        {
          id: '@_id'
        },
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      checkDuplicateChartCategory: () => $resource(CORE.API_URL + 'chartcategory/checkDuplicateChartCategory', null,
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
    }
  }
})();
