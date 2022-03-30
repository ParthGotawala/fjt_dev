(function () {
  'use strict';

  angular
    .module('app.workorder')
    .factory('WorkorderTransactionUMIDFactory', WorkorderTransactionUMIDFactory);

  /** @ngInject */
  function WorkorderTransactionUMIDFactory($resource, CORE) {
    return {
      umid_transaction: (param) => $resource(CORE.API_URL + 'umid_transaction/:id', {
        id: '@_id'
      }, {
        query: {
          isArray: false,
          method: 'GET',
          params: {
            page: 0,
            pageSize: CORE.UIGrid.ItemsPerPage(),
            order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
            search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null,
            woOpEqpID: param && param.woOpEqpID ? param.woOpEqpID : null,
            woOPID: param && param.woOPID ? param.woOPID : null,
            woTransID: param && param.woTransID ? param.woTransID : null,
            isVerify: param && param.isVerify ? param.isVerify : null,
            transactionType: param && param.transactionType ? param.transactionType : null
          }
        },
        update: {
          method: 'PUT'
        }
      }),

      feeder_change_transaction: (param) => $resource(CORE.API_URL + 'feeder_change_transaction/:id', {
        id: '@_id'
      }, {
        query: {
          isArray: false,
          method: 'GET',
          params: {
            page: 1,
            pageSize: CORE.UIGrid.ItemsPerPage(),
            order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
            search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null,
            woOpEqpID: param && param.woOpEqpID ? param.woOpEqpID : null,
            eqpFeederID: param && param.eqpFeederID ? param.eqpFeederID : null
          }
        }
      }),


      feeder_verification_transaction: (param) => $resource(CORE.API_URL + 'feeder_verification_transaction/:id', {
        id: '@_id'
      }, {
        query: {
          isArray: false,
          method: 'GET',
          params: {
            page: 1,
            pageSize: CORE.UIGrid.ItemsPerPage(),
            order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
            search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null,
            woTransUMIDDetID: param && param.woTransUMIDDetID,
            transactionType: param && param.transactionType ? param.transactionType : null
          }
        }
      }),

      deleteFeederTransaction: () => $resource(CORE.API_URL + 'umid_transaction/deleteFeederTransaction', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      deleteWorkorderTransUMIDDetails: () => $resource(CORE.API_URL + 'umid_transaction/deleteWorkorderTransUMIDDetails', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      validateScanFeederFirst: () => $resource(CORE.API_URL + 'umid_transaction/validateScanFeederFirst', {
        feederObj: '@_feederObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      validateScanFeederForSearch: () => $resource(CORE.API_URL + 'umid_transaction/validateScanFeederForSearch', {
        feederObj: '@_feederObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      validateScanUMIDFirst: () => $resource(CORE.API_URL + 'umid_transaction/validateScanUMIDFirst', {
        umidObj: '@_umidObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      validateScanChangeReel: () => $resource(CORE.API_URL + 'umid_transaction/validateScanChangeReel', {
        umidObj: '@_umidObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      validateScanUMIDOnly: () => $resource(CORE.API_URL + 'umid_transaction/validateScanUMIDOnly', {
        umidObj: '@_umidObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getFeederDeatilFromUMID: () => $resource(CORE.API_URL + 'umid_transaction/getFeederDeatilFromUMID/:pUMID', {
        pUMID: '@_pUMID'
      }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      validateScanMissingUMIDOnly: () => $resource(CORE.API_URL + 'umid_transaction/validateScanMissingUMIDOnly', {
        umidObj: '@_umidObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      checkWOKitReutrn: () => $resource(CORE.API_URL + 'umid_transaction/checkWOKitReutrn', {
        obj: '@_obj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getUMIDFeederStatus: () => $resource(CORE.API_URL + 'umid_transaction/getUMIDFeederStatus', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getPendingVerificationUMIDCount: () => $resource(CORE.API_URL + 'umid_transaction/getPendingVerificationUMIDCount', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getUMIDActiveFeederList: () => $resource(CORE.API_URL + 'umid_transaction/getUMIDActiveFeederList', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      })
    };
  }
})();
