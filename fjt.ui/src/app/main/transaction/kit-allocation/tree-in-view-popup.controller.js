(function () {
  'use strict';
  angular.module('app.transaction.kitAllocation')
    .controller('BOMTreeViewPopupController', BOMTreeViewPopupController);
  function BOMTreeViewPopupController(data, $mdDialog, BaseService, CORE, DialogFactory, TRANSACTION, KitAllocationFactory) {
    const vm = this;
    vm.salesOrderDetailId = data.salesOrderDetailId;
    vm.partID = data.partID;
    vm.isKitAllocation = data.isKitAllocation;
    vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.KIT_ALLOCATION;
    vm.LabelConstant = CORE.LabelConstant;
    vm.isCallDirective = false;
    vm.isShowRecalcuate = false;
    vm.isAnyChange = false;
    vm.informationMessage = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RE_CALCULATE_INTERNALVERSIO);
    vm.popupTitle = data.isKitAllocation ? 'Kit Assembly Level View' : 'Assembly Level View';

    vm.goToKitList = () => BaseService.goToKitList(vm.salesOrderDetailId, vm.partID, null);
    vm.goToSalesOrderList = () => BaseService.goToSalesOrderList();
    vm.goToManageSalesOrder = () => BaseService.goToManageSalesOrder(data.soId);

    if (data && data.isKitAllocation && data.kitAllocationInternalVersion && data.liveVersion && data.liveVersion !== data.kitAllocationInternalVersion) {
      vm.isCallDirective = false;
      vm.informationMessage.message = stringFormat(vm.informationMessage.message, data.liveVersion, data.kitAllocationInternalVersion);
      vm.isShowRecalcuate = true;
    } else {
      vm.isCallDirective = true;
    }

    // Kit Recalculation for Main Assy
    vm.KitRecalcuation = () => {
      vm.isReCalculateDisable = true;
      const kitDetail = {
        refSalesOrderDetID: data.salesOrderDetailId,
        assyID: data.partID,
        isConsolidated: false,
        poNumber: data.poNumber,
        soNumber: data.soNumber,
        rohsIcon: data.rohsIcon,
        rohsName: data.rohsName,
        assyPIDCode: data.assyPIDCode,
        assyName: data.assyName
      };
      vm.cgBusyLoading = KitAllocationFactory.getCustConsignMismatchKitAllocationDetails().query(kitDetail).$promise.then((response) => {
        if (response.data && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          if (response.data.KitLineDetail && response.data.KitLineDetail.length > 0) {
            const KitLineDetail = {
              kitAllocationList: response.data.KitLineDetail,
              salesOrderDetail: kitDetail
            };
            DialogFactory.dialogService(
              TRANSACTION.KIT_CUSTCONSIGN_MISMATCH_POPUP_CONTROLLER,
              TRANSACTION.KIT_CUSTCONSIGN_MISMATCH_POPUP_VIEW,
              null,
              KitLineDetail).then(() => {
              }, (data) => {
                if (data) {
                  vm.reCalculateKitAllocation(true, data);
                }
              }).catch((error) => BaseService.getErrorLog(error));
          } else {
            vm.reCalculateKitAllocation(false, data);
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.reCalculateKitAllocation = (isPurchaseChange, rowData) => {
      const objData = {
        partId: rowData.partID,
        sodid: rowData.salesOrderDetailId,
        kitQty: rowData.kitQty,
        mrpQty: rowData.qty,
        isPurchaseChange: isPurchaseChange
      };
      vm.cgBusyLoading = KitAllocationFactory.reCalculateKitAllocation().query(objData).$promise.then((response) => {
        vm.isAnyChange = true;
        if (response.data && response.data.calculated && response.data.calculated.IsSuccess && response.data.calculated.IsSuccess === 0) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.BOM_INTERNAL_VERSION_NOT_SET);
          const model = {
            messageContent: messageContent,
            multiple: false
          };
          DialogFactory.messageAlertDialog(model).then(() => {
            vm.isReCalculateDisable = false;
          });
        } else {
          vm.isReCalculateDisable = false;
          vm.isShowRecalcuate = false;
          vm.isCallDirective = true;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.headerData = [{
      label: vm.LabelConstant.KitList.KitNumber,
      value: data.kitNumber,
      displayOrder: 1,
      valueLinkFn: vm.goToKitList,
      isCopy: true
    },
    {
      label: vm.LabelConstant.SalesOrder.PO,
      value: data.poNumber,
      displayOrder: 2,
      labelLinkFn: vm.goToSalesOrderList,
      valueLinkFn: vm.goToManageSalesOrder,
      isCopy: true
    },
    {
      label: vm.LabelConstant.SalesOrder.SO,
      value: data.soNumber,
      displayOrder: 3,
      labelLinkFn: vm.goToSalesOrderList,
      valueLinkFn: vm.goToManageSalesOrder,
      isCopy: true
    }];

    vm.cancel = () => {
      $mdDialog.cancel(vm.isAnyChange);
    };
  }
})();

