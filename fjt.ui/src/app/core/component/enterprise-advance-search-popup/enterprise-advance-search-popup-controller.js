(function () {
  'use restrict';

  angular.module('app.core')
    .controller('EnterpriseAdvanceSearchPopupController', EnterpriseAdvanceSearchPopupController);

  /* @ngInject */
  function EnterpriseAdvanceSearchPopupController(data, $mdDialog, DialogFactory, CORE, BaseService, $timeout, $window) {
    var vm = this;
    vm.advanceSearchFilterData = data || [];
    vm.isElasticAdvaceSearchFormDirty = true;
    vm.enterpriseAdvanceSearchCondition = CORE.ENTERPRICE_ADVANCE_SEARCH_CONDITION;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.isRemoveCondition = true;

    vm.addGroup = () => {
      vm.advanceSearchFilterData.push({ SearchCriteria: [{ Condition: null, Value: null }] });
    };

    function active() {
      if (vm.advanceSearchFilterData.length === 0) {
        vm.addGroup();
      }
    }
    active();

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    vm.removeGroup = (index) => {
      vm.isElasticAdvaceSearchFormDirty = true;
      vm.advanceSearchFilterData.splice(index, 1);
    };

    vm.addCondition = (item) => {
      item.SearchCriteria.push({ Condition: null, Value: null });
    };

    vm.removeCondition = (item, index) => {
      vm.isElasticAdvaceSearchFormDirty = true;
      item.SearchCriteria.splice(index, 1);
    };

    vm.SubmitForm = () => {
      vm.isRemoveCondition = true;
      if (BaseService.focusRequiredField(vm.elasticAdvaceSearchForm, vm.isElasticAdvaceSearchFormDirty)) {
        return;
      }

      if (vm.advanceSearchFilterData.length === 0) {
        const model = {
          messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ATLEAST_ONE_GROUP_REQUIRED),
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
        return;
      }
      if (vm.advanceSearchFilterData.length >= 1) {
        _.each(vm.advanceSearchFilterData, (value) => {
          if (value.SearchCriteria.length === 0) {
            vm.isRemoveCondition = false;
          }
        });
        if (!vm.isRemoveCondition) {
          const model = {
            messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ATLEAST_ONE_CONDITION_REQUIRED),
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
          return;
        } else {
          $mdDialog.hide(vm.advanceSearchFilterData);
        }
      }
    };

    function showWithoutSavingAlertforcancle() {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.WITHOUT_APPLING_FILTER_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          vm.advanceSearchFilterData = [];
        }
        $timeout(() => { $mdDialog.hide(); });
      }, (error) => BaseService.getErrorLog(error));
    }

    vm.cancel = () => {
      const isdirty = vm.elasticAdvaceSearchForm.$dirty;
      if (isdirty) {
        showWithoutSavingAlertforcancle();
      } else {
        $mdDialog.cancel();
      }
    };

    vm.clear = () => {
      vm.advanceSearchFilterData = [];
      $timeout(() => $mdDialog.hide());
    };
  }
})();
