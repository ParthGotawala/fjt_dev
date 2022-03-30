(function () {
  'use strict';

  angular
    .module('app.configuration.dataelement')
    .factory('DataElementFactory', DataElementFactory);

  /** @ngInject */
  function DataElementFactory($resource, CORE) {
    return {
      dataelement: (param) => $resource(CORE.API_URL + 'dataelements/:id/:dataelement/:entityID', {
        id: '@_id'
      }, {
        query: {
          isArray: false,
          params: {
            page: param && param.Page ? param.Page : 1,
            pageSize: CORE.UIGrid.ItemsPerPage(),
            order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
            search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null
          }
        },
        update: {
          method: 'PUT'
        }
      }),
      retrieveEntityDataElements: () => $resource(CORE.API_URL + 'dataelements/retrieveEntityDataElements/:id', {
        id: '@_id'
      },
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      getFixedEntityDataforCustomAutoCompleteForEntity: () => $resource(CORE.API_URL + 'dataelements/getFixedEntityDataforCustomAutoCompleteForEntity', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      getCustomEntityDataforCustomAutoCompleteForEntity: () => $resource(CORE.API_URL + 'dataelements/getCustomEntityDataforCustomAutoCompleteForEntity', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      getManualDataforCustomAutoCompleteForEntity: () => $resource(CORE.API_URL + 'dataelements/getManualDataforCustomAutoCompleteForEntity', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      dataelement_transactionvalues: (param) => $resource(CORE.API_URL + 'dataelement_transactionvalues/:id', {
        id: '@_id'
      }, {
        query: {
          isArray: false,
          params: {
            page: param && param.page ? param.page : 0,
            pageSize: CORE.UIGrid.ItemsPerPage(),
            order: param && param.order ? JSON.stringify(param.order) : null,
            search: param && param.search ? JSON.stringify(param.search) : null
          }
        },
        update: {
          method: 'PUT'
        }
      }),
      updateDisplayOrder: () => $resource(CORE.API_URL + 'dataelements/updateDisplayOrder', null, {
        update: {
          method: 'PUT'
        }
      }),
      createNewDataElement: () => $resource(CORE.API_URL + 'dataelements/createNewDataElement', null, null),
      SaveDataElementKeyValue: () => $resource(CORE.API_URL + 'dataelement_keyvalues/:id/:elementName/:dataElementName', {
        id: '@_id',
        elementName: '@_elementName',
        dataElementName: '@_dataElementName'
      }, {
        query: {
          isArray: false
        },
        update: {
          method: 'PUT'
        }
      }),
      getEntityDataElementsByEntityID: () => $resource(CORE.API_URL + 'dataelements/getEntityDataElementsByEntityID/:entityID', {
        entityID: '@_entityID'
      },
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      deleteDataElement: () => $resource(CORE.API_URL + 'dataelements/deleteDataElement', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deleteDataElement_KeyValues: () => $resource(CORE.API_URL + 'dataelement_keyvalues/deleteDataElement_KeyValues', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      checkDuplicateForDENameDisplayOrder: () => $resource(CORE.API_URL + 'dataelements/checkDuplicateForDENameDisplayOrder', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      resetFieldWidth: () => $resource(CORE.API_URL + 'dataelements/resetFieldWidth', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      })
    };
  }
})();
