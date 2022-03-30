(function () {
  'use strict';

  angular
    .module('app.login')
    .controller('LogoutResponseController', LogoutResponseController);

  /** @ngInject */
  function LogoutResponseController(CORE, BaseService, $timeout) {
    const vm = this;
    vm.user = {};
    /* only for debug purpose - [S]*/
    let tractActivityLog = getLocalStorageValue('tractActivityLog');
    if (!tractActivityLog || !Array.isArray(tractActivityLog)) {
      tractActivityLog = [];
    }
    const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'called logout respoonse.' };
    tractActivityLog.push(obj);
    setLocalStorageValue('tractActivityLog', tractActivityLog);
    /* [E]*/
    // receive logout call From IdentityServer.
    BaseService.signoutListner();
  }
})();
