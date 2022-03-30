(function () {
  'use strict';

  angular
    .module('app.traveler')
    .factory('TravelersFactory', TravelersFactory);

  /** @ngInject */
  function TravelersFactory($resource, CORE) {
    return {
      NarrativeHistory: () => $resource(CORE.API_URL + 'workordernarrativehistory/:id', {
        id: '@id'
      }, {
        query: {
          isArray: false
        },
        update: {
          method: 'PUT'
        }
      }),
      retriveNarrativeHistoryList: () => $resource(CORE.API_URL + 'workordernarrativehistory/retriveNarrativeHistoryList', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getTravelerDetails: () => $resource(CORE.API_URL + 'workorder_trans/getTravelerDetails', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      getTravelerLatestDetails: () => $resource(CORE.API_URL + 'workorder_trans/getTravelerLatestDetails', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      getWorkorderCertificateByWoID: () => $resource(CORE.API_URL + 'workorder_operation_employee/getWorkorderCertificateByWoID', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      getWorkorderEquipmentByWoID: () => $resource(CORE.API_URL + 'workorder_operation_employee/getWorkorderEquipmentByWoID', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      getWorkorderPartByWoID: () => $resource(CORE.API_URL + 'workorder_operation_employee/getWorkorderPartByWoID', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      retrieveOperationLogDetails: () => $resource(CORE.API_URL + 'retrieveOperationLogDetails', {
        operationObj: '@_operationObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getAllWorkorderSerials: () => $resource(CORE.API_URL + 'workorder_operation_employee/getAllWorkorderSerials/:woID', {
        woID: '@_woID'
      }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),

      getActiveOperationListByEmployeeID: () => $resource(CORE.API_URL + 'workorder_trans/getActiveOperationListByEmployeeID', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deleteNarrativeHistory: () => $resource(CORE.API_URL + 'workordernarrativehistory/deleteNarrativeHistory', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getWoOpExpiredExpiringPartDetails: () => $resource(CORE.API_URL + 'workorder_trans/getWoOpExpiredExpiringPartDetails', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getWOOPUserWiseAckPendingNotificationList: () => $resource(CORE.API_URL + 'workorder_trans/getWOOPUserWiseAckPendingNotificationList', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      scanIncomingOutgoingRack: () => $resource(CORE.API_URL + 'workorder_trans/scanIncomingOutgoingRack', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      scanClearMaterial: () => $resource(CORE.API_URL + 'workorder_trans/scanClearMaterial', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      scanRackforHistory: () => $resource(CORE.API_URL + 'workorder_trans/scanRackforHistory', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getCurrentRackStatus: () => $resource(CORE.API_URL + 'workorder_trans/getCurrentRackStatus', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      retriveScannedRackdetail: () => $resource(CORE.API_URL + 'workorderoperation/retriveScannedRackdetail', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      retriveEmptyRackList: () => $resource(CORE.API_URL + 'workorderoperation/retriveEmptyRackList', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      retriveAvailableRackList: () => $resource(CORE.API_URL + 'workorderoperation/retriveAvailableRackList', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),

      retriveClearRackList: () => $resource(CORE.API_URL + 'workorderoperation/retriveClearRackList', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),

      retriveRackdetailHistory: () => $resource(CORE.API_URL + 'workorderoperation/retriveRackdetailHistory', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      })
    };
  }
})();
