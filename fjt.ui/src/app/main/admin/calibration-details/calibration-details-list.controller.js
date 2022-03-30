(function () {
  'use strict';

  angular
    .module('app.admin.calibrationdetails')
    .controller('CalibrationDetailsListController', CalibrationDetailsListController);

  /** @ngInject */
  function CalibrationDetailsListController($scope, CORE, USER, DialogFactory, BaseService) {
    const vm = this;
    vm.isNoDataFound = false;

    /* add edit record*/
    vm.addEditRecord = (data, ev) => {
      const popUpData = { popupAccessRoutingState: [USER.ADMIN_MANAGE_CALIBRATION_DETAILS_POPUP_STATE], pageNameAccessLabel: CORE.PageName.CalibrationDetails };
      const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
      if (isAccessPopUp) {
        DialogFactory.dialogService(
          USER.ADMIN_ADD_UPDATE_CALIBRATION_DETAILS_MODAL_CONTROLLER,
          USER.ADMIN_ADD_UPDATE_CALIBRATION_DETAILS_MODAL_VIEW,
          ev,
          data).then(() => {
            $scope.$broadcast(USER.CalibrationDetailListReloadBroadcast, null);
          }, (err) => {
            return BaseService.getErrorLog(err);
          });
      }
    };
  }
})();
