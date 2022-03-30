(function () {
  'use strict';

  angular
    .module('app.workorder')
    .factory('WorkorderOperationFirstPieceFactory', WorkorderOperationFirstPieceFactory);

  /** @ngInject */
  function WorkorderOperationFirstPieceFactory($resource, CORE) {
    return {
      workorder_operation_firstpiece: (param) => $resource(CORE.API_URL + 'workorder_operation_firstpiece', {
      }, {
        query: {
          isArray: false,
          params: param ? {
            woID: param.woID,
            woopID: param.woopID
          } : null
        }
      }),
      save_Workorder_Operation_Firstpiece: () => $resource(CORE.API_URL + 'workorder_operation_firstpiece/save_Workorder_Operation_Firstpiece', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deleteWorkorderOperationFirstpiece: () => $resource(CORE.API_URL + 'workorder_operation_firstpiece/deleteWorkorderOperationFirstpiece', {
        listObj: '@_listObj'
      }, {
        query: {
          isArray: false
        }
      }),
      retriveWorkorderOperationFirstPieceByWoOp: () => $resource(CORE.API_URL + 'workorder_operation_firstpiece/retriveWorkorderOperationFirstPieceByWoOp', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getWOAllFirstPieceSerialsDet: () => $resource(CORE.API_URL + 'workorder_operation_firstpiece/getWOAllFirstPieceSerialsDet', {},
        {
          query: {
            method: 'POST',
            isArray: false
          }
        }),
      checkScanSerialExistsOnPrevOPFirstArticle: () => $resource(CORE.API_URL + 'workorder_operation_firstpiece/checkScanSerialExistsOnPrevOPFirstArticle', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      saveWOOPFirstpieceSerialsPickFromPrevOP: () => $resource(CORE.API_URL + 'workorder_operation_firstpiece/saveWOOPFirstpieceSerialsPickFromPrevOP', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      })
    };
  }
})();
