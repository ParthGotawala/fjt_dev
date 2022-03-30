(function () {
  'use strict';

  angular
    .module('app.workorder')
    .factory('WorkorderTransFirstPcsdetFactory', WorkorderTransFirstPcsdetFactory);

  /** @ngInject */
  function WorkorderTransFirstPcsdetFactory($resource, CORE) {
    return {
      saveWorkorderTransFirstpcsDet: () => $resource(CORE.API_URL + 'workorder_trans_firstpcsdet/saveWorkorderTransFirstpcsDetails', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deleteWorkorderTransFirstpcsdet: () => $resource(CORE.API_URL + 'workorder_trans_firstpcsdet/deleteWorkorderTransFirstpcsdet', {
        deleteObj: '@_deleteObj'
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getWOTransFirstpcsSerialsDet: () => $resource(CORE.API_URL + 'workorder_trans_firstpcsdet/getWOTransFirstpcsSerialsDet', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      })
    };
  }
})();
