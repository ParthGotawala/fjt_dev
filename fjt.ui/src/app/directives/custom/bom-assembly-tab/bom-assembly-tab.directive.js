
(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('bomAssemblyTab', bomAssemblyTab);

  /** @ngInject */
  function bomAssemblyTab() {
    var directive = {
      restrict: 'E',
      scope: {
        rfqAssyid: '=?',
        partid: '=',
        subPartid: '=?',
        isSearchBom: '=?'
      },
      templateUrl: 'app/directives/custom/bom-assembly-tab/bom-assembly-tab.html',
      controller: bomAssemblyDetailsCtrl,
      controllerAs: 'vm'
    };
    return directive;
    /** @ngInject */
    function bomAssemblyDetailsCtrl($scope, $state, $timeout, BaseService, BOMFactory, CORE, DialogFactory, USER, RFQTRANSACTION) {
      var vm = this;
      vm.rfqAssyID = $scope.rfqAssyid;
      vm.subAssemblyList = [];
      vm.partId = $scope.partid;
      vm.subPartid = $scope.subPartid ? $scope.subPartid : $scope.partId;

      function active() {
        getAllSubAssyDetails();
      }
      $scope.active = active;
      active();

      function getAllSubAssyDetails() {
        return BOMFactory.getAllUniqueSubAssemblyByBOMPartID().query({ id: vm.partId }).$promise.then((response) => {
          if (response && response.data) {
            const rfqAllSubParts = response.data;
            if (vm.subAssemblyList.length > 0) {
              vm.subAssemblyList.splice(0, vm.subAssemblyList.length);
            }
            vm.selectedBOMIndex1 = null;
            _.each(rfqAllSubParts, (obj, index) => {
              var bomImportParam = '({ mfgType: \'' + CORE.MFG_TYPE.MFG + '\', coid: ' + vm.partId + ', selectedTab: \'' + USER.PartMasterTabs.BOM.Name + '\', subTab: ' + obj.prPerPartID + ' })';
              if (obj.prPerPartID === parseInt(vm.subPartid)) {
                vm.selectedBOMIndex1 = index;
              }
              const subAssembly = {
                id: null,
                partId: obj.prPerPartID,
                src: bomImportParam,
                level: 2,
                pIDCode: obj.PIDCode,
                rfqAssyID: null,
                isFromComponent: true,
                ErrorCount: 0
              };
              vm.subAssemblyList.push(subAssembly);
            });

            $timeout(() => {
              vm.selectedBOMIndex = vm.selectedBOMIndex1;
            });
          }
        });
      }

      /* fun to check form dirty on tab change */
      vm.isBOMStepValid = function (item) {
        var isDirty = BOMFactory.isBOMChanged;
        if (isDirty) {
          vm.selectedBOMIndex = vm.selectedBOMIndex1;
          return showWithoutSavingAlertforTabChange(item);
        }
        else if (vm.subPartid !== item.partId) {
          BOMFactory.bomSelectedFilter = null;
          $state.params.keywords = null;
          if ($scope.isSearchBom) {
            $state.go(RFQTRANSACTION.RFQ_SEARCH_BOM_STATE, { assyid: vm.partId, subassyid: item.partId });
          }
          else {
            $state.go(USER.ADMIN_MANAGECOMPONENT_BOM_STATE, { coid: vm.partId, selectedTab: USER.PartMasterTabs.BOM.Name, subTab: item.partId, keywords: null });
          }
        }
      };

      /* Show save alert popup when performing tab change*/
      function showWithoutSavingAlertforTabChange(item) {
        const obj = {
          title: CORE.MESSAGE_CONSTANT.WITHOUT_SAVING_ALERT_HEADER_MESSAGE,
          textContent: CORE.MESSAGE_CONSTANT.WITHOUT_SAVING_ALERT_BODY_MESSAGE,
          btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
          canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
        };
        return DialogFactory.confirmDiolog(obj).then(() => {
          BOMFactory.bomSelectedFilter = null;
          BOMFactory.isBOMChanged = false;
          BaseService.currentPageFlagForm = [];
          $state.params.keywords = null;
          $state.go(USER.ADMIN_MANAGECOMPONENT_BOM_STATE, { coid: vm.partId, selectedTab: USER.PartMasterTabs.BOM.Name, subTab: item.partId, keywords: null });
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
    }
  }
})();
