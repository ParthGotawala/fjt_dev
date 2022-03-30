(function () {
  'use strict';

  angular
    .module('app.admin.equipment')
    .factory('EquipmentFactory', EquipmentFactory);

  /** @ngInject */
  function EquipmentFactory($resource, CORE, $http) {
    return {
      equipment: () => $resource(CORE.API_URL + 'equipment/:id/:isPermanentDelete', {
        id: '@_id',
        isPermanentDelete: '@_isPermanentDelete'
      }, {
        query: {
          isArray: false
        },
        update: {
          method: 'PUT'
        }
      }),
      retriveEquipmentList: () => $resource(CORE.API_URL + 'equipment/retriveEquipmentList', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getequipmentlist: () => $resource(CORE.API_URL + 'equipment/getequipmentlist', {},
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      getequipmentBySearch: () => $resource(CORE.API_URL + 'equipment/getequipmentBySearch', {
        listObj: '@_listObj'
      },
        {
          query: {
            method: 'POST',
            isArray: false
          }
        }),
      saveEquipmentMaintenanceSchedule: () => $resource(CORE.API_URL + 'equipment/saveEquipmentMaintenanceSchedule/:id', {
        id: '@_id'
      }, {
        update: {
          method: 'POST'
        }
      }),

      retrieveEquipmentEntityDataElements: () => $resource(CORE.API_URL + 'equipment_dataelement/retrieveEquipmentEntityDataElements', {
        equipmentObj: '@_equipmentObj'
      },
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      documentList: () => $resource(CORE.API_URL + 'equipment/retriveEquipmentDocumentList', {
        searchObj: '@_searchObj'
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      downloadEquipmentDocument: (gencFileID) => $http.get(CORE.API_URL + 'equipment/downloadEquipmentDocument/' + gencFileID, { responseType: 'arraybuffer' })
        .then((response) => response,
          (error) => error),
      retrieveEquipmentProfile: () => $resource(CORE.API_URL + 'equipment/retrieveEquipmentProfile/:id', {
        id: '@_id'
      },
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),

      retriveEmployeeEquipmentsWithProfile: () => $resource(CORE.API_URL + 'equipment/retriveEmployeeEquipmentsWithProfile', {
        equipmentObj: '@_equipmentObj'
      },
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      getOperationEquipmentlist: () => $resource(CORE.API_URL + 'equipment/getOperationEquipmentlist', {
        equipmentObj: '@_equipmentObj'
      },
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      deleteEquipment: () => $resource(CORE.API_URL + 'equipment/deleteEquipment', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      checkEquipmentAndWorkstationNameAlreadyExists: () => $resource(CORE.API_URL + 'equipment/checkEquipmentAndWorkstationNameAlreadyExists',
        { objs: '@_objs' }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      downloadequipmentAndworkstationTemplate: (model) => $http.get(CORE.API_URL + 'equipment/downloadequipmentAndworkstationTemplate/' + model, { responseType: 'arraybuffer' })
        .then((response) => response
          , (error) => error),
      checkEquipmentInWarehouse: () => $resource(CORE.API_URL + 'equipment/checkEquipmentInWarehouse',
        { objs: '@_objs' }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getAssemblySamplesList: (param) => $resource(CORE.API_URL + 'equipment/getAssemblySamplesList/', {}, {
        query: {
          method: 'GET',
          isArray: false,
          params: {
            id: param && param.id ? param.id : 0,
            woID: param && param.woID ? param.woID : 0,
            isShowAll: param && param.isShowAll ? param.isShowAll : false,
            isInitialDataLoading: param && param.isInitialDataLoading ? param.isInitialDataLoading : false
          }
        }
      })
    };
  }
})();
