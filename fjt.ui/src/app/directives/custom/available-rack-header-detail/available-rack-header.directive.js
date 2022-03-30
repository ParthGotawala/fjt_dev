(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('availableRackHeaderDetails', availableRackHeaderDetails);

  /** @ngInject */
  function availableRackHeaderDetails() {
    var directive = {
      restrict: 'E',
      scope: {
        headerDetails: "=",
      },
      templateUrl: 'app/directives/custom/available-rack-header-detail/available-rack-header.html',
      controller: availableRackHeaderDetailsCtrl,
      controllerAs: 'vm'
    };
    return directive;
    /** @ngInject */
    function availableRackHeaderDetailsCtrl($scope, CORE, USER, BaseService) {
      var vm = this;
      vm.headerObj = $scope.headerDetails;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.LabelConstant = CORE.LabelConstant;
      vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
      
      // rohs name
      if (!vm.headerObj.rohsIcon.toString().startsWith(vm.rohsImagePath)) {
        vm.headerObj.rohsIcon = vm.rohsImagePath + vm.headerObj.rohsIcon;
      }
      // vm.headerObj.rohsIcon = stringFormat('{0}{1}', vm.rohsImagePath, vm.headerObj.rohsIcon);

      //standard certification
      if (vm.headerObj.wocerti) {
        // show color code in background of class and default color of "label-primary (CORE.DefaultStandardTagColor)"
        let standardClassArray = [];
        let classWithColorCode = vm.headerObj.wocerti.split("@@@@@@");
          _.each(classWithColorCode, (item) => {
            if (item) {
              let objItem = item.split("######");
              let standardClassObj = {};
              standardClassObj.colorCode = CORE.DefaultStandardTagColor;
              if (objItem[0]) {
                standardClassObj.className = objItem[0];
              }
              if (objItem[1]) {
                standardClassObj.colorCode = objItem[1];
              }
              standardClassArray.push(standardClassObj);
            }
          });
          if (classWithColorCode.length > 0) {
            vm.headerObj.wocerti = standardClassArray;
          }
        // show color code in background of class and default color of "label-primary"
      }
      /*
     * Author :  Vaibhav Shah
     * Purpose : go to assy list 
     */
      vm.goToAssyList = () => {
          BaseService.goToPartList();
        return false;
      }

      /*
      * Author :  Vaibhav Shah
      * Purpose : go to manage part number
      */
      vm.goToAssyMaster = () => {
        BaseService.goToComponentDetailTab(CORE.MFG_TYPE.MFG.toLowerCase(), vm.headerObj.partID, USER.PartMasterTabs.Detail.Name);
        return false;
      }

      /*
       * Author :  Vaibhav Shah
       * Purpose : Go to Work Order List
       */
      vm.goToWorkorderList = () => {
        BaseService.goToWorkorderList();
        return false;
      }

      /*
      * Author :  Vaibhav Shah
      * Purpose : Go to Work Order Details page
      */
      vm.goToWorkorderDetails = () => {
        BaseService.goToWorkorderDetails(vm.headerObj.woID);
        return false;
      }

      // go to work order standard details
      vm.goToWorkorderStandards = () => {
        BaseService.goToWorkorderStandards(vm.headerObj.woID);
        return false;
      }
    }
  }
})();
