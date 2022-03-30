(function () {
  'use strict';

  angular
    .module('app.workorder.workorders')
    .factory('WorkorderGenerateSerialFactory', WorkorderGenerateSerialFactory);

  /** @ngInject */
  function WorkorderGenerateSerialFactory($resource, CORE) {
    return {
      generateSerial: () => $resource(CORE.API_URL + 'generateWorkorder_trans_serialNo/:woTransID', {
        woTransID: '@_woTransID'
      }, {
        query: {
          isArray: false
        },
        update: {
          method: 'PUT'
        }
      }),
      retriveWoTransSerialno: () => $resource(CORE.API_URL + 'generateWorkorder_trans_serialNo/retriveWoTransSerialno', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      })
    };
  }
})();
