(function () {
  'use strict';

  angular
    .module('app.configuration.settings')
    .factory('SettingsFactory', SettingsFactory);

  /** @ngInject */
  function SettingsFactory($resource, CORE) {
    return {
      settings: () => $resource(CORE.API_URL + 'settings/:id', {
        id: '@_id'
      }, {
        update: {
          method: 'PUT'
        }
      }),
      retriveDataKeyList: () => $resource(CORE.API_URL + 'settings/retriveDataKeyList', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      retriveExternalKeySettings: () => $resource(CORE.API_URL + 'settings/retriveExternalKeySettings', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      saveExternalKeySettings: () => $resource(CORE.API_URL + 'settings/saveExternalKeySettings', {
        externalKeys: '@_externalKeys'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getTimezoneList: () => $resource(CORE.API_URL + 'settings/getTimezoneList', {
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      retriveExternalKeySettingsForCompanyLogo: () => $resource(CORE.API_URL + 'settings/retriveExternalKeySettingsForCompanyLogo', {
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      // Configure Restrict File Type API
      retriveConfigureFileType: (param) => $resource(CORE.API_URL + 'genericfileextension/retriveConfigureFileType', {
      }, {
        query: {
          isArray: false,
          method: 'GET',
          params: {
            page: param && param.Page ? param.Page : 1,
            pageSize: CORE.UIGrid.ItemsPerPage(),
            order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
            search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null,
            id: param && param.id ? param.id : null
          }
        }
      }),
      retriveConfigureFileTypeById: (param) => $resource(CORE.API_URL + 'genericfileextension/retriveConfigureFileTypeById', {
      }, {
        query: {
          isArray: false,
          method: 'GET',
          params: {
            id: param && param.id ? param.id : null
          }
        }
      }),
      retriveConfigureFileTypeForUIGrid: () => $resource(CORE.API_URL + 'genericfileextension/retriveConfigureFileTypeForUIGrid', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      deleteConfigureFileType: () => $resource(CORE.API_URL + 'genericfileextension/deleteConfigureFileType', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      saveConfigureFileType: () => $resource(CORE.API_URL + 'genericfileextension/saveConfigureFileType/', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        },
      }),
      checkDuplicateExtension: () => $resource(CORE.API_URL + 'genericfileextension/checkDuplicateExtension', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      })
    };
  }
})();
