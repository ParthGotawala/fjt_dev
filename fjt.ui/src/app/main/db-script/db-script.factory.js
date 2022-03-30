(function () {
  'use strict';

  angular
    .module('app.dbscript')
    .factory('DbScriptFactory', DbScriptFactory);

  /** @ngInject */
  function DbScriptFactory($resource, CORE) {
    return {
      executeAllRemainingDbScript: () => $resource(CORE.API_URL + 'dbversion/executeAllRemainingDbScript', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      executeIdentityDBScript: () => $resource(CORE.API_URL + 'dbversion/executeIdentityDBScript', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      retrieveCurrDBInfo: () => $resource(CORE.API_URL + 'dbversion/retrieveCurrDBInfo', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      executeMsgDBScript: () => $resource(CORE.API_URL + 'dbversion/executeMsgDBScript', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      checkValidUserToExecuteDbScript: () => $resource(CORE.API_URL + 'dbversion/checkValidUserToExecuteDbScript', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      generateJSonFromMongoDBFromDBScript: (data) => $resource(CORE.API_URL + 'dbversion/generateJSonFromMongoDBFromDBScript', {},
        {
          query: {
            method: 'GET',
            isArray: false,
            params: {
              callFromDbScript: data.callFromDbScript ? data.callFromDbScript : false
            }
          }
        }),
      saveTractActivityLog: () => $resource(CORE.API_URL + 'dbversion/saveTractActivityLog', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      })
    };
  }
})();
