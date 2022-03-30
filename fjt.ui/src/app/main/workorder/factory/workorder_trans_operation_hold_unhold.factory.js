(function () {
  'use strict';

  angular
    .module('app.workorder')
    .factory('WorkorderTransOperationHoldUnholdFactory', WorkorderTransOperationHoldUnholdFactory);

  /** @ngInject */
  function WorkorderTransOperationHoldUnholdFactory($resource, CORE) {
    return {
      getWOHaltOperationsDet: () => $resource(CORE.API_URL + 'workorder_trans_operation_hold_unhold/getWOHaltOperationsDet', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      })
    };
  }
})();
