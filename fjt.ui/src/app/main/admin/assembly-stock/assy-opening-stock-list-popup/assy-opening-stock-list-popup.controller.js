(function () {
  'use strict';

  angular
    .module('app.admin.assemblyStock')
    .controller('AssyOpeningStockListPopupController', AssyOpeningStockListPopupController);

  /** @ngInject */
  function AssyOpeningStockListPopupController(data, BaseService, CORE, $mdDialog) {
    const vm = this;
    vm.popupParamData = data ? angular.copy(data) : {};
    vm.LabelConstant = CORE.LabelConstant;

    /* hyperlink for part list page */
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };

    /* go to part details */
    vm.goToPartDetails = () => {
        BaseService.goToComponentDetailTab(null, vm.popupParamData.partID);
    };

    vm.headerdata = [];
    vm.headerdata.push(
      {
        value: vm.popupParamData.PIDCode,
        label: vm.LabelConstant.Assembly.ID,
        displayOrder: 1,
        labelLinkFn: vm.goToPartList,
        valueLinkFn: vm.goToPartDetails,
        isCopy: true,
        imgParms: {
          imgPath: vm.popupParamData.rohsIcon,
          imgDetail: vm.popupParamData.rohsName
        }
      },
      {
        value: vm.popupParamData.woNumber,
        label: vm.LabelConstant.Workorder.WO,
        displayOrder: 2
      }
    );

    // close popup call
    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
