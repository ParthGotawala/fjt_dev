(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('PackagingAliasPartValidationPopupController', PackagingAliasPartValidationPopupController);

  function PackagingAliasPartValidationPopupController($mdDialog, CORE, BaseService, data) {
    const vm = this;
    vm.CORE = CORE;
    vm.MFGPN = CORE.LabelConstant.MFG.MFGPN;
    vm.packaginAliasList = angular.copy(data);
    vm.ATTRIBUTE_MIS_MATCH_LIST_NOTES = CORE.MESSAGE_CONSTANT.ATTRIBUTE_MIS_MATCH_LIST_NOTES;
    vm.cancel = () => {
      $mdDialog.cancel();
    };
    vm.proceed = (isProceed) => {
      $mdDialog.hide({ Proceed: isProceed });
    };
  }
})();
