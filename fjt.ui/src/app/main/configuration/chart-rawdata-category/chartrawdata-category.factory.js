(function () {
    'use strict';

    angular
        .module('app.configuration.chartrawdatacategory')
        .factory('RawdataCategoryFactory', RawdataCategoryFactory);

    /** @ngInject */
    function RawdataCategoryFactory($resource, CORE) {
        return {
            rawdatacategorylist: (param) => $resource(CORE.API_URL + 'chartrawdatacategory/getChartRawdatalist', {
                //   id: '@_id',
            },
          {
              query: {
                  isArray: false,
                  method: 'GET',
                  params: {
                      page: param.Page,  // as value 0 also come 
                      pageSize: CORE.UIGrid.ItemsPerPage(),
                      order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
                      search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null,
                      roleID: param && param.RoleId ? param.RoleId : null,
                  }
              },

          }),

            saveRawdataCategory: () => $resource(CORE.API_URL + 'chartrawdatacategory/saveChartrawdataCategory',
         {
             query: {
                 isArray: false,
                 method: 'POST'
             }
         }),

            deleterawdatacategory: () => $resource(CORE.API_URL + 'chartrawdatacategory/deleteRawdatacategory', {
                listObj: '@_listObj',
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            checkDuplicateRawDataCategoryDetails: () => $resource(CORE.API_URL + 'chartrawdatacategory/checkDuplicateRawDataCategoryDetails', {
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }), 
        }
    }
})();