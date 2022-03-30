(function () {
  'use strict';

  angular
    .module('app.workorder')
    .factory('WorkorderTransHoldUnholdFactory', WorkorderTransHoldUnholdFactory);

  /** @ngInject */
  function WorkorderTransHoldUnholdFactory($resource, CORE) {
    return {
      workorder_trans_hold_unhold: () => $resource(CORE.API_URL + 'workorder_trans_hold_unhold/retriveWorkorderHaltResumeDetails', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      })
    };
  }
})();
