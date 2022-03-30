(function () {
  'use strict';

  angular
    .module('app.admin.page')
    .factory('PageDetailFactory', PageDetailFactory);

  /** @ngInject */
  function PageDetailFactory($resource, CORE) {
    return {
      pageDetail: () => $resource(CORE.API_URL + 'pages/:pageID', {
        pageID: '@_pageID'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        },
        update: {
          method: 'PUT'
        }
      }),

      retrievePageDetailList: () => $resource(CORE.API_URL + 'pages/retrivePageDetailList', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      getParentPageDetails: (param) => $resource(CORE.API_URL + 'pages/getParentPageDetails', {},
        {
          query: {
            isArray: false,
            params: {
              page: param && param.Page ? param.Page : 1,
              pageSize: CORE.UIGrid.ItemsPerPage(),
              order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
              search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null
            }
          }
        }),
      getPageList: () => $resource(CORE.API_URL + 'pages/getPageList', {}, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),

      getPageWithFeatureList: () => $resource(CORE.API_URL + 'pages/getPageWithFeatureList', {}, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      deletePageDetail: () => $resource(CORE.API_URL + 'pages/deletePageDetail', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      getPageNameList: () => $resource(CORE.API_URL + 'pages/getPageNameList', {}, {
        query: {
          isArray: false,
          method: 'GET'
        }
      })
    };
  }
})();
