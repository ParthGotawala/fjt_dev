(function () {
  'use strict';

  angular
    .module('app.transaction.packingSlip')
    .controller('InvoiceRefundPopupController', InvoiceRefundPopupController);

  function InvoiceRefundPopupController($scope, $mdDialog, $timeout, CORE, USER, BaseService, data, PackingSlipFactory, TRANSACTION) {
    const vm = this;
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.displayRefundDetail = {};
    vm.packingSlipData = angular.copy(data.packingSlipData) || {};
    vm.paymentId = vm.packingSlipData.paymentId;
    vm.supplierDet = angular.copy(data.supplierDet) || {};
    vm.TRANSACTION = TRANSACTION;
    vm.isPaymentVoided = false;
    vm.loginUser = BaseService.loginUser;

    if (vm.packingSlipData) {
      vm.paymentId = (vm.packingSlipData.paymentId) ? vm.packingSlipData.paymentId : undefined;
      vm.isVoidAndReIssuePayment = vm.packingSlipData.isVoidAndReIssuePayment ? true : false;
    }
    vm.popupTitle = 'Void & Reissue Refund';
    vm.saveBtnDisableFlag = false;

    const getAllRights = () => {
      vm.allowToVoidAndReIssueRefundFeature = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToVoidAndReIssueRefund);
      if ((vm.allowToVoidAndReIssueRefundFeature === null || vm.allowToVoidAndReIssueRefundFeature === undefined) && (vm.reTryCount < _configGetFeaturesRetryCount)) {
        getAllRights(); // put for hard reload option as it will not get data from feature rights
        vm.reTryCount++;
      }
    };

    function setTabWisePageRights(pageList) {
        if (pageList && pageList.length > 0) {
          const tab = pageList.find((a) => a.PageDetails && a.PageDetails.pageRoute === TRANSACTION.TRANSACTION_INVOICE_MANAGE_REFUND_DETAIL_STATE);
          if (tab) {
            vm.isReadOnly = tab.RO ? true : false;
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

    getAllRights();

    vm.goToSupplierList = () => {
      BaseService.goToSupplierList();
      return false;
    };

    vm.goToSupplierDetail = (data) => {
      BaseService.goToSupplierDetail(data.id);
      return false;
    };

    const init = () => {
      vm.headerdata = [];
      if (vm.packingSlipData && vm.packingSlipData.refVoidPaymentOrCheckNumber) {
        vm.headerdata.push({
          label: 'Ref Void Payment# or Check#',
          value: vm.packingSlipData.refVoidPaymentOrCheckNumber,
          displayOrder: 1
        });
      }
      if (vm.supplierDet) {
        vm.headerdata.push({
          label: vm.LabelConstant.MFG.Supplier,
          value: vm.supplierDet.supplierCode,
          displayOrder: (vm.headerdata.length + 1),
          labelLinkFn: vm.goToSupplierList,
          valueLinkFn: vm.goToSupplierDetail,
          valueLinkFnParams: { id: vm.supplierDet.mfgCodeID }
        });
      }
    };

    init();

    vm.voidAndReissueRefund = () => {
      if (vm.isReadOnly) {
        return;
      }
      $scope.$broadcast(USER.SupplierInvoiceVoidAndReIssueRefundBroadcast);
    };

    vm.checkFormDirty = (form, columnName) => BaseService.checkFormDirty(form, columnName);

    $scope.$on(USER.SupplierInvoiceVoidRefundSaveSuccessBroadcast, () => {
      vm.supplierRefundDetailForm.$setPristine();
      BaseService.currentPagePopupForm = [];
      $mdDialog.cancel({ isPaymentVoided: true });
    });

    angular.element(() => {
      //BaseService.currentPagePopupForm = [vm.supplierRefundDetailForm];
      //vm.setFocusOnCloseButton();
    });
    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.supplierRefundDetailForm, vm.checkDirtyObject);
      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        vm.supplierRefundDetailForm.$setPristine();
        BaseService.currentPagePopupForm = [];
        $mdDialog.cancel((vm.paymentId) ? true : false);
      }
    };
  }
})();
