(function () {
  'use strict';

  angular
    .module('app.transaction.receivingmaterial')
    .controller('ReturnKitDecisionController', ReturnKitDecisionController);

  /** @ngInject */
  function ReturnKitDecisionController($mdDialog, CORE, data, DialogFactory, KitAllocationFactory, BaseService, TRANSACTION) {
    const vm = this;
    vm.LabelConstant = CORE.LabelConstant;
    vm.KIT_RETURN_STATUS = TRANSACTION.KIT_RETURN_STATUS;
    vm.kitReleasePlanList = data ? data.kitReleasePlanList : [];
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.ErrorCode = TRANSACTION.STOCKALLOCATIONERRORCODE;
    vm.returnWithShortageDisable = _.sumBy(vm.kitReleasePlanList, (item) => item.kitReturnStatus === vm.KIT_RETURN_STATUS.RS.value);
    vm.headerdata = [];
    if (vm.returnWithShortageDisable) {
      setFocus('returnKit');
    }

    vm.continueReturn = (isWithShortage) => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RETURN_KIT_CONFIRM);
      messageContent.message = stringFormat(messageContent.message, isWithShortage ? 'return kit with intent to Re-release' : 'return the Kit fully');
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          const planIds = _.map(_.filter(vm.kitReleasePlanList, (data) => (data.kitReturnStatus === vm.KIT_RETURN_STATUS.RR.value || vm.KIT_RETURN_STATUS.RS.value)), 'id');
          vm.cgBusyLoading = KitAllocationFactory.returnKit().query({ id: planIds, isWithShortage: isWithShortage }).$promise.then((response) => {
            if (response && response.data && response.data.ErrorCode === vm.ErrorCode.FULLY_KIT_RETUNRED) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.FULLY_KIT_RETUNRED);
              messageContent.message = stringFormat(messageContent.message, 'perform kit return');
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              return DialogFactory.messageAlertDialog(model).then((yes) => {
                if (yes) {
                  setFocus('returnWithShortage');
                }
              }, () => {
              }).catch((error) => BaseService.getErrorLog(error));
            } else {
              $mdDialog.hide();
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
