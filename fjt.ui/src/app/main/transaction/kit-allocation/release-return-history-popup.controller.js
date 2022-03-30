(function () {
  'use strict';

  angular
    .module('app.transaction.receivingmaterial')
    .controller('ReleaseReturnHistPopupController', ReleaseReturnHistPopupController);

  /** @ngInject */
  function ReleaseReturnHistPopupController(data, CORE, USER, BaseService, $mdDialog) {
    const vm = this;
    vm.refAssyID = data.assyID || null;
    vm.salesOrderDetialId = data.salesOrderDetialId;
    vm.labelConstant = CORE.LabelConstant;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.headerdata = [];

    //go to manage part number
    vm.goToAssyMaster = (assyID) => {
      BaseService.goToComponentDetailTab(null, assyID);
    };

    //go to assy list
    vm.goToAssyList = () => {
      BaseService.goToPartList();
    };

    //bind header details
    if (data) {
      vm.headerdata.push({
        label: vm.labelConstant.Assembly.ID,
        value: data.PIDCode,
        displayOrder: 2,
        labelLinkFn: vm.goToAssyList,
        valueLinkFn: vm.goToAssyMaster,
        valueLinkFnParams: data.assyID,
        isCopy: true,
        isCopyAheadLabel: false,
        isAssy: true,
        imgParms: {
          imgPath: vm.rohsImagePath + data.rohsIcon,
          imgDetail: data.rohsName
        }
      }, {
        label: 'Kit Number',
        value: data.kitNumber,
        displayOrder: 1,
        isCopy: true
      });
    }

    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
