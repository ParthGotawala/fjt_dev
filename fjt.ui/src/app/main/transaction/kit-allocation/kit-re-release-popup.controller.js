(function () {
  'use strict';

  angular
    .module('app.transaction.receivingmaterial')
    .controller('ReReleaseKitValidationController', ReReleaseKitValidationController);

  /** @ngInject */
  function ReReleaseKitValidationController($mdDialog, CORE, data) {
    const vm = this;
    vm.LabelConstant = CORE.LabelConstant;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.releaseDetail = data || {};
    vm.reReleaseModel = {
      isMaintainKit: false,
      isChangeKit: false
    };
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    let messageContent;
    const currentPlan = vm.releaseDetail.releasePlan.plannKitNumber;
    const otherPlanList = _.map(_.filter(vm.releaseDetail.plans, (item) => item.plannKitNumber > currentPlan), 'plannKitNumber');
    if (otherPlanList && otherPlanList.length > 0) {
      vm.otherPlans = otherPlanList.join(',');
    }
    const planList = _.map(_.filter(vm.releaseDetail.plans, (item) => item.plannKitNumber >= currentPlan), 'plannKitNumber');
    if (planList && planList.length > 0) {
      vm.allPlans = planList.join(', ');
    }

    vm.headerdata = [
      {
        label: vm.LabelConstant.SalesOrder.PlannKit,
        value: currentPlan,
        displayOrder: 1
      }
    ];

    messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MAINTAIN_CURRENT_KIT_PLANNING);
    if (vm.otherPlans) {
      const appendMessage = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MAINTAIN_CURRENT_KIT_PLANNING);
      appendMessage.message = stringFormat(appendMessage.message, vm.otherPlans);
      messageContent.message = stringFormat(messageContent.message, currentPlan, appendMessage.message);
    } else {
      messageContent.message = stringFormat(messageContent.message, currentPlan, '');
    }
    vm.maintainKitMessage = messageContent.message;

    messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.CHANGE_CURRENT_KIT_PLANNING);
    messageContent.message = stringFormat(messageContent.message, vm.allPlans);
    vm.changeKitMessage = messageContent.message;

    messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RERELEASE_KIT);
    messageContent.message = stringFormat(messageContent.message, currentPlan);
    vm.reReleaseMessage = messageContent.message;

    vm.continueRelease = () => {
      vm.releaseDetail.isMaintainKit = vm.reReleaseModel.isMaintainKit;
      vm.releaseDetail.isChangeKit = vm.reReleaseModel.isChangeKit;
      $mdDialog.hide(vm.releaseDetail);
    };

    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
