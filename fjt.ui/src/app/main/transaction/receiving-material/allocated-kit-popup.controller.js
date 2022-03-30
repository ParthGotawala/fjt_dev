(function () {
  'use strict';

  angular
    .module('app.transaction.receivingmaterial')
    .controller('AllocatedKitPopUpController', AllocatedKitPopUpController);

  function AllocatedKitPopUpController($mdDialog, CORE, USER, DialogFactory, BaseService, data, ReceivingMaterialFactory, KitAllocationFactory) {
    const vm = this;
    vm.CORE = CORE;
    vm.uid = data.uid;
    vm.umidId = data.refUMIDId;
    vm.MEASUREMENT_TYPES_COUNT = CORE.MEASUREMENT_TYPES.COUNT;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.query = {
      order: ''
    };

    vm.goToUMIDList = () => {
      BaseService.goToUMIDList();
      return false;
    };

    vm.goToUMIDDetail = (data) => BaseService.goToUMIDDetail(data.id);

    vm.headerdata = [];
    vm.headerdata.push({
      label: CORE.LabelConstant.UMIDManagement.UMID,
      value: vm.uid,
      isCopy: true,
      displayOrder: 1,
      labelLinkFn: vm.goToUMIDList,
      valueLinkFn: vm.goToUMIDDetail,
      valueLinkFnParams: { id: data.id }
    });

    if (vm.umidId) {
      vm.getAllocatedKitList = () => {
        //, isAllStatus: vm.isAllStatus
        vm.cgBusyLoading = ReceivingMaterialFactory.getAllocatedKitByUID().query({ id: vm.umidId }).$promise.then((allocatedKit) => {
          vm.allocatedKitList = allocatedKit.data;
          _.map(vm.allocatedKitList, (item) => {
            item.mfgCode = stringFormat('({0}) {1}', item.AssemblyDetail.mfgCodemst.mfgCode, item.AssemblyDetail.mfgCodemst.mfgName);
            item.mfgPN = item.AssemblyDetail.mfgPN;
            item.PIDCode = item.AssemblyDetail.PIDCode;
            item.nickName = item.AssemblyDetail.nickName;
            item.isCustom = item.AssemblyDetail.isCustom;
            item.po = item.salesorderdetatil.salesOrderMst.poNumber;
            item.so = item.salesorderdetatil.salesOrderMst.salesOrderNumber;
            item.mrpQty = item.salesorderdetatil.mrpQty;
            item.kitQty = item.salesorderdetatil.kitQty;
            item.allocateUOMName = item.AllocatedUOM.unitName;
            item.allocateUOMClassID = item.AllocatedUOM.measurementTypeID;
            item.rohsIcon = stringFormat('{0}{1}', vm.rohsImagePath, item.AssemblyDetail.rfq_rohsmst.rohsIcon);
            item.rohsName = item.AssemblyDetail.rfq_rohsmst.name;
          });
        }).catch((error) => BaseService.getErrorLog(error));
      };
      vm.getAllocatedKitList();
    }

    vm.deallocateFromKit = (item) => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.DEALLOCATE_UMID_CONFIRMATION);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          const kitAllocationIds = [item.id];
          const umidIds = [item.refUIDId];
          const objData = {
            id: kitAllocationIds,
            umidID: umidIds,
            fromScreen: 'Allocated Kit'
          };
          vm.cgBusyLoading = KitAllocationFactory.deallocateUMIDFromKit().query(objData).$promise.then((response) => {
            if (response.data) {
              vm.getAllocatedKitList();
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.cancel = () => {
      $mdDialog.cancel(vm.allocatedKitList);
    };
  }
})();
