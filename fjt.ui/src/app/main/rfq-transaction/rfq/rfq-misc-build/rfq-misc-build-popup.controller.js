(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .controller('AddRFQMiscBuildController', AddRFQMiscBuildController);

  /** @ngInject */
  function AddRFQMiscBuildController($mdDialog, $filter, RFQSettingFactory, ComponentFactory, CORE, USER, data, BaseService, DialogFactory) {
    const vm = this;

    vm.rfqAssyMiscBuild = angular.copy(data.rfqAssyMiscBuild);
    vm.isAdd = data.rfqAssyMiscBuild.length === 0;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;

    vm.extPrice = (item, index) => {
      if (item.proposedBuildQty === 0) {
        item.noOfBuild = null;
      }
      if (item && item.noOfBuild) {
        if (item.proposedBuildQty && item.noOfBuild) {
          item.TotalBuildQty = item.proposedBuildQty * item.noOfBuild;
        }
        if (!vm.checkDetails() && _.last(vm.rfqAssyMiscBuild) === item) {
          addnewLine();
        }

        vm.TotalEU = _.sumBy(vm.rfqAssyMiscBuild, 'TotalBuildQty');
      }
      if (item.proposedBuildQty && item.noOfBuild && item.buildDate) {
        const duplicatObj = _.find(vm.rfqAssyMiscBuild, (objMiscBuild, i) => {
          if (index !== i) {
            return !item.proposedBuildQty === objMiscBuild.proposedBuildQty && !item.noOfBuild === !objMiscBuild.noOfBuild && !item.buildDate === !objMiscBuild.buildDate;
          }
        });

        if (duplicatObj) {
          vm.isDuplicate = true;
        } else {
          vm.isDuplicate = false;
        }
      }
    };

    vm.checkDetails = () => {
       _.find(vm.rfqAssyMiscBuild, (item) => !item.proposedBuildQty || !item.noOfBuild || !item.buildDate);
    };

    function addnewLine() {
      var obj = {
        proposedBuildQty: 0,
        noOfBuild: 0,
        TotalBuildQty: 0,
        buildDate: null,
        buildDateOptions: {
          buildDateOpenFlag: false,
          minDate: new Date()
        }
      };
      vm.rfqAssyMiscBuild.push(obj);
    }

    vm.removeMiscBuild = (item, index) => {
      if (item && vm.rfqAssyMiscBuild.length > 1) {
        vm.rfqAssyMiscBuild.splice(index, 1);
      }
      vm.TotalEU = _.sumBy(vm.rfqAssyMiscBuild, 'TotalBuildQty');
      vm.MiscBuildForm.$setDirty();
    };
    addnewLine();
    // close pop up
    vm.cancel = () => {
      const isdirty = vm.MiscBuildForm.$dirty;
      if (isdirty) {
        const data = {
          form: vm.MiscBuildForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm = [];
        vm.MiscBuildForm.$setPristine();
        $mdDialog.cancel(data.rfqAssyMiscBuild);
      }
    };


    // send selected list array back to parent controller
    vm.save = () => {
      if (vm.isDuplicate) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DB_DUPLICATE_MESSAGE);
        DialogFactory.messageAlertDialog({
          messageContent: messageContent,
          multiple: true
        });
      } else {
        if (BaseService.focusRequiredField(vm.MiscBuildForm)) {
          return true;
        } else {
          vm.MiscBuildForm.$setPristine();
          BaseService.currentPagePopupForm = [];
          $mdDialog.hide(vm.rfqAssyMiscBuild);
        }
      }
    };
    _.each(vm.rfqAssyMiscBuild, (objItem) => {
      objItem.TotalBuildQty = objItem.proposedBuildQty * objItem.noOfBuild;
    });
    vm.TotalEU = _.sumBy(vm.rfqAssyMiscBuild, 'TotalBuildQty');
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.MiscBuildForm);
    });
  };
})();
