(function () {
  'use strict';

  angular.module('app.rfqtransaction')
    .controller('LaborSummaryController', LaborSummaryController);

  /* @ngInject */
  function LaborSummaryController($scope, $timeout, $stateParams, $q, CORE, RFQTRANSACTION, BOMFactory, DialogFactory, BaseService) {
    var vm = this;
    if ($scope.$parent && $scope.$parent.vm) {
      $scope.$parent.vm.activeTab = 3;
    }
    vm.rfqAssyID = $stateParams.id;
    vm.subAssemblyList = [];
    vm.partId = $stateParams.partId;
    //get all assembly details
    function getAllSubAssyDetails() {
      return BOMFactory.getAllUniqueSubAssemblyByPartID().query({ id: vm.rfqAssyID }).$promise.then((response) => response.data);
    }

    const autocompletePromise = [getAllSubAssyDetails()];
    vm.cgBusyLoading = $q.all(autocompletePromise).then((responses) => {
      if (responses) {
        const rfqAllSubParts = responses[0];
        if (vm.subAssemblyList.length > 0) {
          vm.subAssemblyList.splice(0, vm.subAssemblyList.length);
        }
        vm.selectedBOMIndex1 = null;
        _.each(rfqAllSubParts, (obj, index) => {
          const laborParam = '({id: ' + vm.rfqAssyID + ', partId: ' + obj.prPerPartID + '})';
          if (parseInt(obj.prPerPartID) === parseInt(vm.partId)) {
            vm.selectedBOMIndex1 = index;
          }
          const subAssembly = {
            id: (obj.rfqAssyID ? obj.rfqAssyID : -1),
            partId: obj.prPerPartID,
            src: RFQTRANSACTION.RFQ_LABOR_STATE + laborParam,
            pIDCode: obj.PIDCode,
            rfqAssyID: (obj.rfqAssyID ? obj.rfqAssyID : -1),
            isCurrentComponent: parseInt(index) === 0 ? true : false
          };
          vm.subAssemblyList.push(subAssembly);
        });
        $timeout(() => {
          vm.selectedBOMIndex = vm.selectedBOMIndex1;
        });
      }
    });

    /* fun to check form dirty on tab change */
    vm.isStepValid = (step) => {
      var isDirty = BOMFactory.isBOMChanged;
      if (isDirty) {
        return showWithoutSavingAlertforTabChange(step);
      }
      else {
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
        BOMFactory.isBOMChanged = false;
        BaseService.currentPageFlagForm = [];
        return true;
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    }
  }
})();
