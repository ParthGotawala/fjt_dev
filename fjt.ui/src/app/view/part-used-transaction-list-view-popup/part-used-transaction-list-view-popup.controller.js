(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('PartUsedTransactionListViewPopupController', PartUsedTransactionListViewPopupController);

  function PartUsedTransactionListViewPopupController($mdDialog, CORE, BaseService, data) {
    const vm = this;
    const usedTransactionDet = angular.copy(data);
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.NotrOnChangeInActivePart = CORE.MESSAGE_CONSTANT.USED_PART_CHANGE_TO_INACTIVE;
    vm.USED_CANCEL_PART_CHANGE_TO_INACTIVE = CORE.MESSAGE_CONSTANT.USED_CANCEL_PART_CHANGE_TO_INACTIVE;
    vm.usedTransactionList = usedTransactionDet && usedTransactionDet.usedTransactionList ? usedTransactionDet.usedTransactionList : [];
    vm.purchaseOrderList = [];
    vm.cancelledPurchaseOrderList = [];
    vm.salesOrderList = [];
    vm.packingSlipList = [];
    vm.headerdata = [];
    vm.assyID = usedTransactionDet && usedTransactionDet.assyDetail ? usedTransactionDet.assyDetail.assyID : 0;
    vm.partType = usedTransactionDet && usedTransactionDet.partType ? usedTransactionDet.partType : '';

    let assyHeaderObj = {};
    if (vm.partType === CORE.PartCategory.SubAssembly) {
      assyHeaderObj = {
        label: CORE.LabelConstant.Assembly.ID,
        value: usedTransactionDet && usedTransactionDet.assyDetail ?
          (usedTransactionDet.assyDetail.pidCode ? usedTransactionDet.assyDetail.pidCode.trim() : usedTransactionDet.assyDetail.pidCode) : null,
        displayOrder: 2,
        labelLinkFn: vm.goToAssyList,
        valueLinkFn: vm.goToAssyMaster,
        valueLinkFnParams: null,
        isCopy: true,
        isAssy: true,
        isCopyAheadLabel: false,
        imgParms: {
          imgPath: usedTransactionDet && usedTransactionDet.assyDetail ? usedTransactionDet.assyDetail.assyRohsIcon : null,
          imgDetail: usedTransactionDet && usedTransactionDet.assyDetail ? usedTransactionDet.assyDetail.assyRohsName : null
        }
      };
    } else {
      assyHeaderObj = {
        label: vm.LabelConstant.MFG.PID,
        value: usedTransactionDet && usedTransactionDet.assyDetail ?
          (usedTransactionDet.assyDetail.pidCode ? usedTransactionDet.assyDetail.pidCode.trim() : usedTransactionDet.assyDetail.pidCode) : null,
        displayOrder: 1,
        labelLinkFn: vm.goToAssyList,
        valueLinkFn: vm.goToAssyMaster,
        isCopy: true,
        isCopyAheadLabel: true,
        imgParms: {
          imgPath: usedTransactionDet && usedTransactionDet.assyDetail ? usedTransactionDet.assyDetail.assyRohsIcon : null,
          imgDetail: usedTransactionDet && usedTransactionDet.assyDetail ? usedTransactionDet.assyDetail.assyRohsName : null
        },
        isCopyAheadOtherThanValue: true,
        copyAheadLabel: vm.LabelConstant.MFG.MFGPN,
        copyAheadValue: usedTransactionDet && usedTransactionDet.assyDetail ? usedTransactionDet.assyDetail.MFGPN : null
      };
    };

    vm.headerdata.push(assyHeaderObj);
    // Get Record of (Purchase/Cancelled Purchase Order/Sales Order/Packing Slip List)
    vm.purchaseOrderList = vm.usedTransactionList.filter((x) => x.tranctionType === 'PO' && x.cancellationConfirmPending === '');
    vm.cancelledPurchaseOrderList = vm.usedTransactionList.filter((x) => x.tranctionType === 'PO' && x.cancellationConfirmPending === CORE.PO_Working_Status.Canceled.id);
    vm.salesOrderList = vm.usedTransactionList.filter((x) => x.tranctionType === 'SO');
    vm.packingSlipList = vm.usedTransactionList.filter((x) => x.tranctionType === 'PS');


    //go to assy list
    vm.goToAssyList = () => {
        BaseService.goToPartList();
      return false;
    };

    // go to manage assembly
    vm.goToAssyMaster = () => {
        BaseService.goToComponentDetailTab(null, vm.assyID);
      return false;
    };
    /* to go at work order details page  */
    vm.goToWorkorderDetails = (woID) => {
      BaseService.goToWorkorderDetails(woID);
      return false;
    };
    //manage workorder operation
    vm.manageWorkorderOperation = (woOPID) => {
      BaseService.goToWorkorderOperationDetails(woOPID);
    };
    vm.goToPurchaseOrderDetail = (id) => {
      BaseService.goToPurchaseOrderDetail(id);
    };
    vm.goToPackingSlipDetail = (id) => {
      BaseService.goToManagePackingSlipDetail(id);
    };
    vm.goToManageSalesOrder = (id) => {
      BaseService.goToManageSalesOrder(id);
    };
    vm.cancel = () => {
      $mdDialog.cancel();
    };
    vm.proceed = (isProceed) => {
      $mdDialog.hide({ Proceed: isProceed });
    };
  }
})();
