(function () {
  'use strict';

  angular.module('app.rfqtransaction')
    .controller('ImportBOMController', ImportBOMController);

  /* @ngInject */
  function ImportBOMController($scope, $timeout, $state, $stateParams, CORE, RFQTRANSACTION, BOMFactory, DialogFactory, BaseService) {
    var vm = this;
    vm.rfqAssyID = $stateParams.id;
    vm.subAssemblyList = [];
    vm.partId = $stateParams.partId;

    function active() {
      getAllSubAssyDetails();
      if ($scope.$parent && $scope.$parent.vm) {
        $scope.$parent.vm.activeTab = 0;
      }
    }
    $scope.active = active;
    active();

    function getAllSubAssyDetails() {
      return BOMFactory.getAllUniqueSubAssemblyByPartID().query({ id: vm.rfqAssyID }).$promise.then((response) => {
        if (response && response.data) {
          const rfqAllSubParts = response.data;
          if (vm.subAssemblyList.length > 0) {
            vm.subAssemblyList.splice(0, vm.subAssemblyList.length);
          }

          vm.selectedBOMIndex1 = null;
          _.each(rfqAllSubParts, (obj, index) => {
            var bomImportParam = '({id: ' + vm.rfqAssyID + ', partId: ' + obj.prPerPartID + '})';
            if (parseInt(obj.prPerPartID) === parseInt(vm.partId)) {
              vm.selectedBOMIndex1 = index;
            }

            const subAssembly = {
              id: (obj.rfqAssyID ? obj.rfqAssyID : -1),
              partId: obj.prPerPartID,
              src: RFQTRANSACTION.RFQ_IMPORT_BOM_STATE + bomImportParam,
              level: 2,
              pIDCode: obj.PIDCode,
              rfqAssyID: (obj.rfqAssyID ? obj.rfqAssyID : -1),
              isFromComponent: false,
              ErrorCount: 0
            };
            vm.subAssemblyList.push(subAssembly);
          });

          $timeout(() => {
            vm.selectedBOMIndex = vm.selectedBOMIndex1;
            if (vm.subAssemblyList && vm.subAssemblyList.length > parseInt(vm.selectedBOMIndex)) {
              $scope.$emit(RFQTRANSACTION.EVENT_NAME.UpdateBOMIcon, { partID: vm.subAssemblyList[parseInt(vm.selectedBOMIndex)].partId });
            }
          });
        }
      });
    }

    /* fun to check form dirty on tab change */
    vm.isStepValid = function (step) {
      var isDirty = BOMFactory.isBOMChanged;
      if (isDirty) {
        return showWithoutSavingAlertforTabChange(step);
      }
      else {
        BOMFactory.bomSelectedFilter = null;
        $state.params.keywords = null;
        $state.transitionTo($state.$current, $state.params, { location: true, inherit: true, notify: false });
        return true;
      }
    };

    /* Show save alert popup when performing tab change*/
    function showWithoutSavingAlertforTabChange() {
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
        $state.transitionTo($state.$current, $state.params, { location: true, inherit: true, notify: false });
        return true;
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    }
  }
})();
