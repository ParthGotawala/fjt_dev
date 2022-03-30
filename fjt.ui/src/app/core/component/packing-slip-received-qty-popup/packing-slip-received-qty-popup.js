(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('PackingSlipReceivedQtyPopupController', PackingSlipReceivedQtyPopupController);

  /** @ngInject */
  function PackingSlipReceivedQtyPopupController($scope, TRANSACTION, $mdDialog, data, BaseService, USER, CORE, DialogFactory) {
    const vm = this;
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.receivedQtyList = data.allReceivedQty;
    vm.receivedQtyList[0].isDisable=true;
    const total = _.sumBy(data.allReceivedQty, 'receivedQty');
    vm.total = total && !Number.isNaN(total) ? _.sumBy(data.allReceivedQty, 'receivedQty') : 0;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.SUPPLIER_QUOTE_PART_PRICING_HISTORY;
    vm.headerdata = [];

    vm.goToManufacturerList = () => {
      BaseService.goToManufacturerList();
    };
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };

    vm.goToSupplierPartList = () => {
      BaseService.goToSupplierPartList();
    };
    vm.goToManufacturer = () => {
      BaseService.goToManufacturer(vm.headerDetails.component.mfgCodemst.id);
    };
    vm.goToComponentDetailTab = () => {
      BaseService.goToComponentDetailTab(CORE.MFG_TYPE.MFG, vm.headerDetails.component.id, USER.PartMasterTabs.Detail.Name);
    };
    vm.goToSupplierComponentDetailTab = () => {
      BaseService.goToComponentDetailTab(CORE.MFG_TYPE.DIST, vm.headerDetails.supplierComponent.id, USER.PartMasterTabs.Detail.Name);
    };


    vm.receivedQty = (item) => {
      vm.total = _.sumBy(vm.receivedQtyList, 'receivedQty');
      if (item && item.receivedQty && !_.find(vm.receivedQtyList, (item) => !item.receivedQty)) {
        if (vm.receivedQtyList.length === 1) {
          vm.receivedQtyList[0].isDisable = false;
        }
        const qty = {
          receivedQty: null,
          isDisable: false
        };
        vm.receivedQtyList.push(qty);
      }
    };

    vm.removeReceivedQty = (item) => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
      messageContent.message = stringFormat(messageContent.message, 'Received Qty Line', 1);
      const model = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT,
        multiple: true
      };
      DialogFactory.messageConfirmDialog(model).then((yes) => {
        if (yes) {
          const index = vm.receivedQtyList.indexOf(item);
          if (vm.receivedQtyList.length > 1) {
            vm.receivedQtyList.splice(index, 1);
            if (vm.receivedQtyList.length === 1) {
              vm.receivedQtyList[0].isDisable = true;
            }
            else {
              _.each(vm.receivedQtyList, (remove) => {
                remove.isDisable = false;
              });
            }
            vm.packingSlipReceivedQtyForm.$dirty = true;
          }
          vm.total = _.sumBy(vm.receivedQtyList, 'receivedQty');
          setFocus('saveReceivedQtyBtn');
        }
      }, () => {
          setFocus('saveReceivedQtyBtn');
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.save = () => {
      if (BaseService.focusRequiredField(vm.packingSlipReceivedQtyForm)) {
        return;
      } else {
        const receivingQtyCheck = _.filter(vm.receivedQtyList, (item) => item.receivedQty);
        const receivingQty = {
          receivedQty: vm.total,
          allReceivedQty: receivingQtyCheck.length !== 0 ? _.map(receivingQtyCheck, 'receivedQty').join(',') : null
        };
        $mdDialog.hide(receivingQty);
      }
    };

    vm.cancel = () => {
      if (vm.packingSlipReceivedQtyForm.$dirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.packingSlipReceivedQtyForm);
    });
  }
})();
