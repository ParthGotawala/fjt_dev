(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('ViewBlanketPOAssyDetailPopupController', ViewBlanketPOAssyDetailPopupController);

  function ViewBlanketPOAssyDetailPopupController($mdDialog, CORE,
    BaseService, data, SalesOrderFactory, TRANSACTION, DialogFactory) {
    const vm = this;
    vm.CORE = CORE;
    vm.data = data;
    vm.allLabelConstant = CORE.LabelConstant;
    vm.subAssy = CORE.PartCategory.SubAssembly;
    vm.BlanketPODetails = TRANSACTION.BLANKETPOOPTIONDET;
    vm.EmptyMesssage = CORE.EMPTYSTATE.VIEW_ASSY_BPO;
    // get blanket PO list
    vm.getusedBlanketPODetails = () => {
      vm.cgBusyLoading = SalesOrderFactory.getBlanketPOUsedQtyForAssy().query({ id: vm.data.blanketPOID }).$promise.then((response) => {
        if (response && response.data) {
          vm.soBlanketPOlist = response.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    vm.getusedBlanketPODetails();

    // go to sales order master
    vm.goToSalesOrderMaster = (id) => {
      BaseService.goToManageSalesOrder(id || vm.data.salesOrderID);
    };

    // go to sales order list page
    vm.goTosalesOrderList = () => {
      BaseService.goToSalesOrderList();
    };

    vm.queryAssemblyList = {
      order: '',
      assembly_search: '',
      limit: 5,
      page: 1,
      isPagination: vm.ispagination === undefined ? CORE.isPagination : vm.ispagination
    };

    vm.headerdata = [];
    vm.headerdata.push({
      label: 'PO Line#',
      value: vm.data.custPOLineNumber,
      displayOrder: 5
    },
      {
        label: CORE.LabelConstant.SalesOrder.SO,
        value: vm.data.soNumber,
        isCopy: true,
        labelLinkFn: vm.goTosalesOrderList,
        valueLinkFn: vm.goToSalesOrderMaster,
        displayOrder: 2
      },
      {
        label: CORE.LabelConstant.SalesOrder.Revision,
        value: vm.data.revision,
        displayOrder: 3
      },
      {
        label: CORE.LabelConstant.SalesOrder.PO,
        value: vm.data.poNumber,
        isCopy: true,
        labelLinkFn: vm.goTosalesOrderList,
        valueLinkFn: vm.goToSalesOrderMaster,
        displayOrder: 1
      });
    if (vm.data.blanketPOOption) {
      vm.headerdata.push({
        label: vm.allLabelConstant.SalesOrder.BlanketPO,
        value: 'Yes',
        displayOrder: 6
      });
      vm.headerdata.push({
        label: vm.allLabelConstant.SalesOrder.BlanketPOOption,
        value: vm.BlanketPODetails.USEBLANKETPO === vm.data.blanketPOOption ? TRANSACTION.BLANKETPOOPTION[0].value : vm.BlanketPODetails.LINKBLANKETPO === vm.data.blanketPOOption ? TRANSACTION.BLANKETPOOPTION[1].value : TRANSACTION.BLANKETPOOPTION[2].value,
        displayOrder: 6
      });
    }
    if (vm.data.isLegacyPO) {
      vm.headerdata.push({
        label: vm.allLabelConstant.SalesOrder.LegacyPo,
        value: 'Yes',
        displayOrder: 6
      });
    }
    if (vm.data.isRmaPO) {
      vm.headerdata.push({
        label: vm.allLabelConstant.SalesOrder.RMAPo,
        value: 'Yes',
        displayOrder: 6
      });
    }
    vm.cancel = (isyes) => {
      $mdDialog.cancel(isyes);
    };

    vm.goToPartMaster = (partID) => {
      BaseService.goToComponentDetailTab(null, partID);
      return false;
    };
    vm.refresh = () => {
      vm.getusedBlanketPODetails();
    };
    // unlink future po details
    vm.unlinkDetail = (item) => {
      // confirmation to unlink details
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.UNLINK_REMOVE_CONFIRMATION_ALERT);
      messageContent.message = stringFormat(messageContent.message, item.poNumber, vm.data.poNumber);
      const model = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      return DialogFactory.messageConfirmDialog(model).then(() => {
        const obj = {
          id: item.soDetID,
          blanketPOID: vm.data.blanketPOID
        };
        vm.cgBusyLoading = SalesOrderFactory.unlinkFuturePOFromBlanketPO().query(obj).$promise.then((response) => {
          if (response) {
            vm.getusedBlanketPODetails();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }, () => {
      });
    };
  }
})();
