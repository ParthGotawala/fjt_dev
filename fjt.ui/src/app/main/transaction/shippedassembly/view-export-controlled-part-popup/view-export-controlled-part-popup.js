(function () {
  'use strict';

  angular
    .module('app.transaction.shipped')
    .controller('ViewExportControlledPartPopupController', ViewExportControlledPartPopupController);

  /** @ngInject */
  function ViewExportControlledPartPopupController($mdDialog, data, CORE, USER, BaseService) {
    const vm = this;
    vm.LabelConstant = CORE.LabelConstant;
    //vm.limitOptions = [25, 50, 75, 100];
    vm.selectedItems = [];
    //vm.query = {
    //    order: '',
    //    search: {
    //    },
    //    limit: 100,
    //    page: 1,
    //    isPagination: vm.ispagination == undefined ? CORE.isPagination : vm.ispagination,
    //};

    vm.assyData = data;    
    vm.assyData.alertMessage = (vm.assyData.alertMessage && vm.assyData.alertMessage.message) ? vm.assyData.alertMessage.message : vm.assyData.alertMessage;    
    if (vm.assyData && vm.assyData.exportControlledAssyPartList.length > 0) {
      _.each(vm.assyData.exportControlledAssyPartList, (partItem) => {
        let standardClassArray = [];
        if (partItem.allExportControlledStdWithClass) {
          let classWithColorCode = partItem.allExportControlledStdWithClass.split("@@@@@@");
          _.each(classWithColorCode, (stdClassItem) => {
            if (stdClassItem) {
              let objItem = stdClassItem.split("######");
              let standardClassObj = {};
              standardClassObj.colorCode = CORE.DefaultStandardTagColor;
              if (objItem[0]) {
                standardClassObj.certificateStandardID = objItem[0];
              }
              if (objItem[1]) {
                standardClassObj.className = objItem[1];
              }
              if (objItem[2]) {
                standardClassObj.colorCode = objItem[2];
              }
              standardClassArray.push(standardClassObj);
            }
          });
          if (classWithColorCode.length > 0) {
            partItem.partAllStandardsWithClass = standardClassArray;
          }
        }
        partItem.displayRohsIcon = CORE.WEB_URL + USER.ROHS_BASE_PATH + partItem.rohsIcon;
      });
    }

    /*to move at update certificate standard page  */
    vm.updatestandard = (certificateStandardID) => {
      BaseService.openInNew(USER.ADMIN_MANAGE_CERTIFICATE_STANDARD_DETAIL_STATE, { id: certificateStandardID })
    }

    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
