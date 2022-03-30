
(function () {
  'use strict';

  angular
    .module('app.transaction.purchaseorder')
    .controller('ManagePurchaseOrderDocument', ManagePurchaseOrderDocument);

  /** @ngInject */
  function ManagePurchaseOrderDocument($state, CORE, PurchaseOrderFactory, BaseService, $scope, TRANSACTION, $timeout, USER) {
    const vm = this;
    vm.poID = parseInt($state.params.id);
    vm.entityname = CORE.AllEntityIDS.Purchase_Order.Name;
    vm.isReadOnly = false;

    function setTabWisePageRights(pageList) {
      if (pageList && pageList.length > 0) {
        const tab = pageList.find((a) => a.PageDetails && a.PageDetails.pageRoute === TRANSACTION.TRANSACTION_PURCHASE_ORDER_DOCUMENT_STATE);
        if (tab) {
          vm.isReadOnly = tab.RO ? true : false;
          if ($scope.$parent && $scope.$parent.vm) {
            $scope.$parent.vm.isReadOnly = vm.isReadOnly;
          }
        }
      }
    }

    $timeout(() => {
      $scope.$on(USER.LoginUserPageListBroadcast, (event, data) => {
        var menudata = data;
        setTabWisePageRights(menudata);
        $scope.$applyAsync();
      });
    });

    if (BaseService.loginUserPageList && BaseService.loginUserPageList.length > 0) {
      setTabWisePageRights(BaseService.loginUserPageList);
    }

    //get purchase order detail
    const getPurchaseOrderDetail = () => {
      vm.cgBusyLoading = PurchaseOrderFactory.getPurchaseOrderDetailByID().query({ id: vm.poID }).$promise.then((res) => {
        if (res && res.data) {
          vm.purchaseOrder = res.data;
          if ($scope.$parent && $scope.$parent.vm) {
            $scope.$parent.vm.status = vm.purchaseOrder.status;
            $scope.$parent.vm.poWorkingStatus = vm.purchaseOrder.poWorkingStatus;
            $scope.$parent.vm.isDisabled = vm.purchaseOrder.poWorkingStatus === CORE.PO_Working_Status.Completed.id || vm.purchaseOrder.poWorkingStatus === CORE.PO_Working_Status.Canceled.id || vm.purchaseOrder.lockStatus === TRANSACTION.PurchaseOrderLockStatus.Locked.id;
            $scope.$parent.vm.poNumber = vm.purchaseOrder.poNumber;
            $scope.$parent.vm.poDate = vm.purchaseOrder.poDate;
            $scope.$parent.vm.poRevision = vm.purchaseOrder.poRevision;
            $scope.$parent.vm.soNumber = vm.purchaseOrder.soNumber;
            $scope.$parent.vm.label = vm.purchaseOrder.status ? CORE.OPSTATUSLABLEDRAFT : CORE.OPSTATUSLABLEPUBLISH;
            $scope.$parent.vm.poId = vm.purchaseOrder.id;
            $scope.$parent.vm.CancellationConfirmed = vm.purchaseOrder.CancellationConfirmed;
            $scope.$parent.vm.lockStatus = vm.purchaseOrder.lockStatus;
            $scope.$parent.vm.lockedBy = vm.purchaseOrder.lockedBy;
            $scope.$parent.vm.lockedByName = vm.purchaseOrder.lockedByName;
            $scope.$parent.vm.lockedAt = vm.purchaseOrder.lockedAt;
            $scope.$parent.vm.supplierName = vm.purchaseOrder.suppliers.mfgCodeName;
            $scope.$parent.vm.mfgCodeID = vm.purchaseOrder.supplierID;
            $scope.$parent.vm.mfgName = vm.purchaseOrder.suppliers.mfgCode;
          }
          $scope.$emit('PurchaseOrderAutocomplete');
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    getPurchaseOrderDetail();
    if ($scope.$parent && $scope.$parent.vm) {
      $scope.$parent.vm.activeTab = 1;
    }
  }
})();
