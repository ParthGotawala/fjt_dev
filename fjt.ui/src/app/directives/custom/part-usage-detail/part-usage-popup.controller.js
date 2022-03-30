(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('PartUsageController', PartUsageController);

  /** @ngInject */
  function PartUsageController($mdDialog, CORE, USER, RFQTRANSACTION, data, BaseService) {
    const vm = this;
    vm.cid = data.partID;
    //go to manage part number
    vm.goToComponentDetail = (partID) => {
      BaseService.goToComponentDetailTab(CORE.MFG_TYPE.MFG.toLowerCase(), partID, USER.PartMasterTabs.Detail.Name);
    };
    //go to assy list 
    vm.goToPartList = () => {
      BaseService.goToPartList();
      return false;
    }
    // go to customer
    vm.goToManufacturer = (mfgCodeID) => {
      BaseService.goToManufacturer(mfgCodeID);
      return false;
    }
    //redirect to customer list 
    vm.goToManufacturerList = () => {
      BaseService.goToManufacturerList();
      return false;
    }

    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }

})();
