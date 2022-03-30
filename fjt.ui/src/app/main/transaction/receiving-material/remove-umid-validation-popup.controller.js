(function () {
  'use strict';

  angular
    .module('app.transaction.receivingmaterial')
    .controller('RemoveUIDValidationController', RemoveUIDValidationController);

  /** @ngInject */
  function RemoveUIDValidationController($mdDialog, CORE, BaseService, data) {
    const vm = this;
    vm.LabelConstant = CORE.LabelConstant;
    vm.uidModel = data || {};
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    let messageContent;

    if (vm.uidModel.UIDList && vm.uidModel.UIDList.length > 0) {
      vm.groupUIDData = _.find(_.groupBy(vm.uidModel.UIDList, 'binId', 'packaging', 'partId','receivedStatus'))[0];
      _.map(vm.uidModel.UIDList, (item) => {
        item.isopen = false;
        item.selectedUIdList = [];
        const split = item.uidData ? item.uidData.split('@@@') : null;
        _.map(split, (uidItem) => {
          vm.splitUIDDetails = uidItem ? uidItem.split('###') : null;
          const id = vm.splitUIDDetails[0] ? vm.splitUIDDetails[0] : null;
          const uid = vm.splitUIDDetails[1] ? vm.splitUIDDetails[1] : null;
          item.selectedUIdList.push({
            id: id,
            uid: uid
          });
        });
      });
    }

    if (vm.uidModel.errorCode === 1) {
      messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.REMOVE_UID_PS_STATUS_VALIDATION);
      vm.errorMessage = messageContent;
    } else if (vm.uidModel.errorCode === 2) {
      messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.REMOVE_UID_INTERNAL_VALIDATION);
      vm.errorMessage = messageContent;
    } else if (vm.uidModel.errorCode === 3) {
      messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.REMOVE_UID_WITH_PENDINGUID_VALIDATION);
      messageContent.message = stringFormat(messageContent.message, vm.groupUIDData.binName, vm.groupUIDData.pidCode, vm.groupUIDData.packagingName);
      vm.errorMessage = messageContent;
    }

    // go to UMID Management
    vm.goToUMIDManagement = (item) => BaseService.goToUMIDDetail(item.id);

    // go to Material Receipt detail tab
    vm.goToManagePackingSlipDetail = (id) => {
      if (id) {
        BaseService.goToManagePackingSlipDetail(id);
      }
    };

    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
