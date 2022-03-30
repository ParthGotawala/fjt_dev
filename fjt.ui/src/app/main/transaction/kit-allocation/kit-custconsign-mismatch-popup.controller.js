(function () {
  'use strict';

  angular
    .module('app.transaction.receivingmaterial')
    .controller('KitCustConsignMismatchPopUpController', KitCustConsignMismatchPopUpController);

  function KitCustConsignMismatchPopUpController($mdDialog, CORE, USER, BaseService, data, KitAllocationFactory, DialogFactory) {
    const vm = this;
    vm.kitAllocationList = data ? data.kitAllocationList : [];
    vm.LabelConstant = CORE.LabelConstant;
    vm.errorMessage = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.KIT_ALLOCATION_CUSTCONSIGN_STATUS);
    vm.headerdata = [];
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.salesOrderDetail = data ? data.salesOrderDetail : {};
    vm.loginUser = BaseService.loginUser;
    if (vm.kitAllocationList) {
      _.map(vm.kitAllocationList, (item) => {
        item.isCustomerConsign = !item.isPurchase;
      });
    }
    let objApproval = null;
    const getAllRights = () => {
      vm.isEnableKitLineCustConsignStatus = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToChangeKitLineCustConsignStatus);
    };
    getAllRights();

    vm.query = {
      order: ''
    };

    vm.goToSalesOrderList = () => {
      BaseService.goToSalesOrderList();
      return false;
    };

    vm.goToManageSalesOrder = () => {
      BaseService.goToManageSalesOrder(vm.salesOrderDetail.refSalesOrderDetID);
      return false;
    };

    vm.goToAssyMaster = () => {
      BaseService.goToComponentDetailTab(null, vm.salesOrderDetail.assyID);
      return false;
    };

    vm.goToAssy = () => {
      BaseService.goToPartList();
      return false;
    };

    vm.headerdata.push(
      {
        label: vm.LabelConstant.SalesOrder.PO,
        value: vm.salesOrderDetail.poNumber,
        displayOrder: 1,
        labelLinkFn: vm.goToSalesOrderList,
        valueLinkFn: vm.goToManageSalesOrder,
        isCopy: true
      },
      {
        label: vm.LabelConstant.SalesOrder.SO,
        value: vm.salesOrderDetail.soNumber,
        displayOrder: 2,
        labelLinkFn: vm.goToSalesOrderList,
        valueLinkFn: vm.goToManageSalesOrder,
        isCopy: true
      },
      {
        label: CORE.LabelConstant.Assembly.PIDCode,
        value: vm.salesOrderDetail.assyPIDCode,
        displayOrder: 3,
        labelLinkFn: vm.goToAssy,
        valueLinkFn: vm.goToAssyMaster,
        isCopy: true,
        imgParms: {
          imgPath: vm.rohsImagePath + vm.salesOrderDetail.rohsIcon,
          imgDetail: vm.salesOrderDetail.rohsName
        }
      },
      {
        label: CORE.LabelConstant.Assembly.Assy,
        value: vm.salesOrderDetail.assyName,
        displayOrder: 4,
        labelLinkFn: vm.goToAssy,
        valueLinkFn: vm.goToAssyMaster,
        isCopy: true,
        imgParms: {
          imgPath: vm.rohsImagePath + vm.salesOrderDetail.rohsIcon,
          imgDetail: vm.salesOrderDetail.rohsName
        }
      }
    );

    vm.getAuthenticationOfApprovalPart = (item) => {
      const informationMsg = stringFormat(CORE.MESSAGE_CONSTANT.KIT_ALLOCATION_CUSTCONSIGN_STATUS_NOTE, item.lineID);
      const objPartDetail = {
        AccessRole: CORE.ROLE_ACCESS.VERIFICATION_ROLE_ACCESS,
        refTableName: CORE.TABLE_NAME.KIT_ALLOCATION,
        isAllowSaveDirect: false,
        approveFromPage: CORE.PAGENAME_CONSTANT[25].PageName,
        confirmationType: CORE.Generic_Confirmation_Type.PERMISSION_FOR_CUSTCONSIGN_STATUS_KITALLOCATION,
        createdBy: vm.loginUser.userid,
        updatedBy: vm.loginUser.userid,
        informationMsg: informationMsg
      };
      DialogFactory.dialogService(
        CORE.GENERIC_CONFIRMATION_MODAL_CONTROLLER,
        CORE.GENERIC_CONFIRMATION_MODAL_VIEW,
        null,
        objPartDetail).then((data) => {
          if (data) {
            const approvalReasonList = [];
            item.isDisable = true;
            data.transactionType = stringFormat(CORE.MESSAGE_CONSTANT.GENERIC_AUTHENTICATION_REASON.CONFIRMATION_FOR_KIT_ALLOCATION_CUSTCONSIGN_STATUS, item.isPurchase ? 'Customer Consigned' : 'Purchased', item.lineID);
            objApproval = data;
            if (objApproval) {
              approvalReasonList.push(objApproval);
            }
            const objData = {
              id: item.id,
              isPurchase: !item.isPurchase,
              approvalReasonList: approvalReasonList
            };
            vm.cgBusyLoading = KitAllocationFactory.saveCustconsignStatusForKitLineItem().query(objData).$promise.then((response) => {
              if (response.data) {
                const findIndex = _.findIndex(vm.kitAllocationList, (data) => data.id === item.id);
                if (findIndex !== -1) {
                  vm.kitAllocationList.splice(findIndex, 1);
                }
                if (vm.kitAllocationList && vm.kitAllocationList.length === 0) {
                  vm.cancel(true);
                }
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => { }).catch((error) => BaseService.getErrorLog(error));
    };

    // Need to remove if not in use
    vm.keepData = (item) => {
      const findIndex = _.findIndex(vm.kitAllocationList, (data) => data.id === item.id);
      if (findIndex !== -1) {
        vm.kitAllocationList.splice(findIndex, 1);
      }
      if (vm.kitAllocationList && vm.kitAllocationList.length === 0) {
        vm.cancel(true);
      }
    };

    vm.cancel = (isRefresh) => {
      if (vm.formCustConsign.$dirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        vm.formCustConsign.$setPristine();
        vm.formCustConsign.$setUntouched();
        BaseService.currentPagePopupForm = [];
        $mdDialog.cancel(isRefresh);
      }
    };

    angular.element(() => {
      BaseService.currentPagePopupForm = [vm.formCustConsign];
    });
  }
})();
