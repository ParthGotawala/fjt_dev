(function () {
  'use strict';

  angular
    .module('app.reports.workorderdataelement')
    .factory('WorkorderDataelementFactory', WorkorderDataelementFactory);

  /** @ngInject */
  function WorkorderDataelementFactory($resource, $http, CORE) {
    return {
      retrieveAllWorkordersforTransDataElement: () => $resource(CORE.API_URL + 'workorders/retrieveAllWorkordersforTransDataElement', {},
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      retrieveAllWorkorderOperationforTransDataElement: () => $resource(CORE.API_URL + 'workorderoperation/retrieveAllWorkorderOperationforTransDataElement/:woID', {
        woID: '@_woID'
      },
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      retrieveAllWOOPEquipmentforTransDataElement: () => $resource(CORE.API_URL + 'equipment/retrieveAllWOOPEquipmentforTransDataElement/:woID/:woOPID', {
        woID: '@_woID',
        woOPID: '@_woOPID'
      },
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      getWoTransactionDataElementValuesList: () => $resource(CORE.API_URL + 'workorder_trans_dataelement_values/getWoTransactionDataElementValuesList', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),

      getWoOpAllTransDataElementValuesList: (param) => $resource(CORE.API_URL + 'workorder_trans_dataelement_values/getWoOpAllTransDataElementValuesList', {
      }, {
        query: {
          isArray: false,
          params: {
            entityID: JSON.stringify(param.entityID),
            woOPID: JSON.stringify(param.woOPID)
          }
        }
      }),

      getWoOpEqpAllTransDataElementValuesList: (param) => $resource(CORE.API_URL + 'workorder_trans_equipment_dataelement_values/getWoOpEqpAllTransDataElementValuesList', {
      }, {
        query: {
          isArray: false,
          params: {
            entityID: JSON.stringify(param.entityID),
            woOPID: JSON.stringify(param.woOPID),
            eqpID: JSON.stringify(param.eqpID)
          }
        }
      }),

      getWoTransactionEquipmentDataElementValuesList: () => $resource(CORE.API_URL + 'workorder_trans_equipment_dataelement_values/getWoTransactionEquipmentDataElementValuesList', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      })
    };
  }
})();
