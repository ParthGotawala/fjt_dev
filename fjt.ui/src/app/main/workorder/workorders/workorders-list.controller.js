(function () {
  'use strict';

  angular
    .module('app.workorder.workorders')
    .controller('WorkordersController', WorkordersController);

  /** @ngInject */
  function WorkordersController(BaseService, DialogFactory, CORE) {
    const vm = this;
    vm.loginUser = BaseService.loginUser;

    // open work order number build history pop up
    vm.viewWONumberBuildHistory = (event) => {
      const data = {};
      DialogFactory.dialogService(
        CORE.WO_BUILD_HISTORY_COMP_NICKNAME_POPUP_CONTROLLER,
        CORE.WO_BUILD_HISTORY_COMP_NICKNAME_POPUP_VIEW,
        event,
        data).then(() => { // Success Section
        }, () => { // Cancel Section
        }, (err) => BaseService.getErrorLog(err));
    };
  }
})();
