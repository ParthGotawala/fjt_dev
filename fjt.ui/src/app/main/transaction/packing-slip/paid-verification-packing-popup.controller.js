(function () {
  'use strict';

  angular
    .module('app.transaction.packingSlip')
    .controller('PaidVerificationPackagingController', PaidVerificationPackagingController);

  function PaidVerificationPackagingController($scope, $mdDialog, $timeout, CORE, USER, BaseService, data, PackingSlipFactory, TRANSACTION) {
    const vm = this;
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.packingSlipData = angular.copy(data.packingSlipData) || {};
    vm.paymentForIds = angular.copy(data.paymentForIds) || [];
    vm.supplierDet = angular.copy(data.supplierDet) || {};
    vm.TRANSACTION = TRANSACTION;
    vm.isPaymentVoided = false;
    vm.isPaymentLocked = false;
    vm.isSearchPaymentOrCheckDisplay = false;
    vm.loginUser = BaseService.loginUser;
    vm.lockStatus = '';
    vm.lockByName = '';
    vm.lockedAt = '';
    if (vm.packingSlipData) {
      vm.paymentId = (vm.packingSlipData.paymentId) ? vm.packingSlipData.paymentId : undefined;
      vm.viewOnly = vm.packingSlipData.viewOnly ? true : false;
      vm.isVoidAndReIssuePayment = vm.packingSlipData.isVoidAndReIssuePayment ? true : false;
      vm.isHidePaymentPopupDetails = vm.isSearchPaymentOrCheckDisplay = (vm.packingSlipData.isHidePaymentPopupDetails) ? vm.packingSlipData.isHidePaymentPopupDetails : false;
    }
    vm.popupTitle = 'Pay Now for Invoice';
    if (vm.isVoidAndReIssuePayment) {
      vm.popupTitle = 'Void & Reissue Payment';
    }
    else if (vm.viewOnly) {
      vm.popupTitle = 'Invoice Details';
    }
    vm.saveBtnDisableFlag = false;

    vm.anyItemSelect = false;

    const getAllRights = () => {
      vm.allowToVoidAndReIssuePaymentFeature = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToVoidAndReIssuePayment);
      if ((vm.allowToVoidAndReIssuePaymentFeature === null || vm.allowToVoidAndReIssuePaymentFeature === undefined) && (vm.reTryCount < _configGetFeaturesRetryCount)) {
        getAllRights(); // put for hard reload option as it will not get data from feature rights
        vm.reTryCount++;
      }
    };

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

    // get all paid payment or check number by search
    const getAllPaidPaymentOrCheckNumberBySearch = (searchObj) =>
      PackingSlipFactory.getAllPaidPaymentOrCheckNumberBySearch().save({
        listObj: searchObj
      }).$promise.then((checkList) => {
        if (checkList && checkList.data && checkList.data.data) {
          vm.checkSearchList = checkList.data.data;
        }
        else {
          vm.checkSearchList = [];
        }
        return vm.checkSearchList;
      }).catch((error) => BaseService.getErrorLog(error));

    const initAutoComplete = () => {
      vm.autoCompleteSearchPaymentOrCheckNumber = {
        columnName: 'formatedPaymentNumber',
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'SearchPaymentOrCheckNumber',
        placeholderName: 'Type here to search Payment# Or Check#',
        callbackFn: () => {
        },
        isAddnew: false,
        addData: {
        },
        onSelectCallbackFn: (checkDetail) => {
          if (checkDetail) {
            vm.paymentId = checkDetail.id;
            vm.packingSlipData.paymentId = vm.paymentId;
            vm.packingSlipData.refVoidPaymentOrCheckNumber = checkDetail.paymentNumber;
            vm.supplierDet.mfgCodeID = checkDetail.mfgcodeID;
            vm.supplierDet.supplier = checkDetail.supplier;
            data = vm.packingSlipData;
            vm.isPaymentVoided = false;
            vm.isHidePaymentPopupDetails = false;
            init();
          }
          else {
            vm.isHidePaymentPopupDetails = true;
            vm.paymentId = undefined;
          }
        },
        onSearchFn: (query) => {
          const searchObj = {
            query: query
          };
          return getAllPaidPaymentOrCheckNumberBySearch(searchObj);
        }
      };
    };

    if (vm.isSearchPaymentOrCheckDisplay) {
      initAutoComplete();
    }

    vm.checkFormDirty = (form, columnName) => BaseService.checkFormDirty(form, columnName);

    vm.paidAmount = (pIsCheckPrint) => {
      $scope.$broadcast(USER.SupplierInvoicePaymentSaveBroadcase, pIsCheckPrint);
    };

    vm.printCheck = () => {
      vm.isPrintDisabled = true;
      $scope.$broadcast(USER.SupplierInvoicePaymentCheckPrintBroadcast, null);
    };

    vm.printRemittanceReport = () => {
      vm.isPrintRemittDisabled = true;
      $scope.$broadcast(USER.SupplierInvoicePaymentRemottancePrintBroadcast, null);
    };

    vm.voidPayment = () => {
      $scope.$broadcast(USER.SupplierInvoiceVoidPaymentBroadcast, null);
    };

    vm.voidAndReIssuePayment = () => {
      $scope.$broadcast(USER.SupplierInvoiceVoidAndReIssuePaymentBroadcast, null);
    };

    $scope.$on(USER.SupplierInvoiceVoidPaymentSaveSuccessBroadcast, () => {
      vm.formPaidPackaging.$setPristine();
      BaseService.currentPagePopupForm = [];
      $mdDialog.cancel(true);
    });

    vm.setFocusOnCloseButton = () => {
      $timeout(() => {
        if (vm.viewOnly ||
          (vm.lockStatus === TRANSACTION.CustomerPaymentLockStatus.Locked && !vm.loginUser.isUserSuperAdmin)) {
          setFocus('btnClose');
        }
      }, _configTimeout);
    };

    angular.element(() => {
      BaseService.currentPagePopupForm = [vm.formPaidPackaging];
      vm.setFocusOnCloseButton();
    });
    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.formPaidPackaging, vm.checkDirtyObject);
      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        vm.formPaidPackaging.$setPristine();
        BaseService.currentPagePopupForm = [];
        $mdDialog.cancel((vm.paymentId /*&& vm.isVoidAndReIssuePayment*/) ? true : false);
      }
    };
  }
})();
