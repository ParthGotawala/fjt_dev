(function () {
  'use strict';

  angular
    .module('app.admin.whoacquiredwho')
    .factory('WhoAcquiredWhoFactory', WhoAcquiredWhoFactory);

  /** @ngInject */
  function WhoAcquiredWhoFactory($resource, CORE) {
    return {
      WhoBoughtWho: () => $resource(CORE.API_URL + 'whoBoughtWho/saveWhoBoughtWho/', {},
        {
          query: {
            isArray: false
          },
          update: {
            method: 'PUT'
          }
        }),

      retriveWhoBoughtWhoList: () => $resource(CORE.API_URL + 'whoBoughtWho/retriveWhoBoughtWhoList', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),

      retriveWhoBoughtWho: () => $resource(CORE.API_URL + 'whoBoughtWho/retriveWhoBoughtWho', {},
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),

      getMfgBuyToList: () => $resource(CORE.API_URL + 'whoBoughtWho/getMfgBuyToList', {},
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),

      deleteWhoBoughtWho: () => $resource(CORE.API_URL + 'whoBoughtWho/deleteWhoBoughtWho', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getAcquisitionDetails: () => $resource(CORE.API_URL + 'whoBoughtWho/getAcquisitionDetails', {
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
