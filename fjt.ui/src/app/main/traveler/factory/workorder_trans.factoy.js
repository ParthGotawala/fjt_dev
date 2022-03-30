(function () {
  'use strict';

  angular
    .module('app.traveler')
    .factory('WorkorderTransFactory', WorkorderTransFactory);

  /** @ngInject */
  function WorkorderTransFactory($resource, CORE) {
    return {
      checkInOperation: () => $resource(CORE.API_URL + 'workorder_trans/checkInOperation', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),


      checkOutOperation: () => $resource(CORE.API_URL + 'workorder_trans/checkOutOperation', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      //checkInEmployeeForOperation: () => $resource(CORE.API_URL + 'workorder_trans/checkInEmployeeForOperation', {
      //    listObj: '@_listObj',
      //}, {
      //    query: {
      //        method: 'POST',
      //        isArray: false
      //    }
      //}),

      checkOutEmployeeFromOperation: () => $resource(CORE.API_URL + 'workorder_trans/checkOutEmployeeFromOperation', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      pauseEmployeeFromOperation: () => $resource(CORE.API_URL + 'workorder_trans/pauseEmployeeFromOperation', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      pauseAllEmployeeFromOperation: () => $resource(CORE.API_URL + 'workorder_trans/pauseAllEmployeeFromOperation', {
        teamOpTransObj: '@_teamOpTransObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      resumeEmployeeForOperation: () => $resource(CORE.API_URL + 'workorder_trans/resumeEmployeeForOperation', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      resumeAllEmployeeForOperation: () => $resource(CORE.API_URL + 'workorder_trans/resumeAllEmployeeForOperation', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      retrieveWorkorderTransDetails: () => $resource(CORE.API_URL + 'workorder_trans/retrieveWorkorderTransDetails', {
        operationObj: '@_operationObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      retrieveWorkorderOperationStockDetails: () => $resource(CORE.API_URL + 'workorder_trans/retrieveWorkorderOperationStockDetails', {
        operationObj: '@_operationObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      workorder_trans: () => $resource(CORE.API_URL + 'workorder_trans/:woTransID', {
        woTransID: '@_woTransID'
      }, {
        query: {
          isArray: false
        },
        update: {
          method: 'PUT'
        }
      }),

      retrieveWorkorderTransList: () => $resource(CORE.API_URL + 'workorder_trans/retrieveWorkorder_TransList', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),

      checkWorkorderProductionStarted: () => $resource(CORE.API_URL + 'workorder_trans/checkWorkorderProductionStarted', {
        _obj: '@_obj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getTravelerEmpWorkingTimeStatus: () => $resource(CORE.API_URL + 'workorder_trans/getTravelerEmpWorkingTimeStatus', {
        _workorderTransInfo: '@_workorderTransInfo'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getActiveOperationList: () => $resource(CORE.API_URL + 'workorder_trans/getActiveOperationList', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      })
    };
  }
})();
