(function () {
  'use strict';

  angular
    .module('app.admin.datecodeformat')
    .controller('DCFormatController', DCFormatController);

  /** @ngInject */
  function DCFormatController($mdDialog, $scope, CORE, USER, DialogFactory, BaseService) {
    const vm = this;
    vm.pageName = CORE.PageName.DCFormat;

    /* add.edit defect category*/
    vm.addEditRecord = (data, ev) => {
      DialogFactory.dialogService(
        USER.ADMIN_DC_FORMAT_POPUP_CONTROLLER,
        USER.ADMIN_DC_FORMAT_POPUP_VIEW,
        ev,
        data).then(() => {
        }, () => {
            $scope.$broadcast('RefreshDateCodeGrid');
        }, (err) => BaseService.getErrorLog(err));
    };

    //close popup on page destroy
    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, { closeAll: true });
    });
  }
})();
