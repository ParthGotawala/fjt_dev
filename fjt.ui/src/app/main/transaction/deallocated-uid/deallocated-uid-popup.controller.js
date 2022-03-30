(function () {
  'use strict';

  angular
    .module('app.transaction.receivingmaterial')
    .controller('DeallocatedUIDPopUpController', DeallocatedUIDPopUpController);

  /** @ngInject */
  function DeallocatedUIDPopUpController(data, CORE, USER, BaseService, $mdDialog, TRANSACTION) {
    const vm = this;
    vm.labelConstant = CORE.LabelConstant;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.uidDetail = data || {};
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
    if (vm.uidDetail) {
      vm.headerdata.push({
        label: vm.labelConstant.Assembly.ID,
        value: vm.uidDetail.PIDCode,
        displayOrder: 2,
        labelLinkFn: vm.goToAssyList,
        valueLinkFn: vm.goToAssyMaster,
        valueLinkFnParams: vm.uidDetail.assyID,
        isCopy: true,
        isCopyAheadLabel: false,
        isAssy: true,
        imgParms: {
          imgPath: vm.rohsImagePath + vm.uidDetail.rohsIcon,
          imgDetail: vm.uidDetail.rohsName
        }
      }, {
        label: 'Kit Number',
        value: vm.uidDetail.kitNumber,
        displayOrder: 1
      });
    }

    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
