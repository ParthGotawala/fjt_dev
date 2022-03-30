(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('SalesOrderNotLinkedFPOPopupController', SalesOrderNotLinkedFPOPopupController);

  function SalesOrderNotLinkedFPOPopupController($mdDialog, CORE,
    BaseService, data, SalesOrderFactory, TRANSACTION, DialogFactory) {
    const vm = this;
    vm.CORE = CORE;
    vm.data = data;
    vm.allLabelConstant = CORE.LabelConstant;
    vm.subAssy = CORE.PartCategory.SubAssembly;
    vm.BlanketPODetails = TRANSACTION.BLANKETPOOPTIONDET;
    vm.EmptyMesssage = CORE.EMPTYSTATE.FPO_LINK_VIEW_ASSY_BPO;
    vm.openQty = ((vm.data.qty || 0) - (vm.data.usedQty || 0)) < 0 ? 0 : ((vm.data.qty || 0) - (vm.data.usedQty || 0));
    // get blanket PO list
    vm.getusedBlanketPODetails = () => {
      vm.cgBusyLoading = SalesOrderFactory.getSalesOrderFPONotLinkedList().query({ partID: vm.data.partID, customerID: vm.data.customerID }).$promise.then((response) => {
        if (response && response.data) {
          vm.soBlanketPOlist = response.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    vm.getusedBlanketPODetails();
    //link to go for part master list page
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };
    //go to part master
    vm.goToPartMaster = () => {
      BaseService.goToComponentDetailTab(null, vm.data.partID);
    };

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
        label: vm.allLabelConstant.SalesOrder.SO,
        value: vm.data.soNumber,
        isCopy: true,
        labelLinkFn: vm.goTosalesOrderList,
        valueLinkFn: vm.goToSalesOrderMaster,
        displayOrder: 2
      },
      {
        label: vm.allLabelConstant.SalesOrder.Revision,
        value: vm.data.revision,
        displayOrder: 3
      },
      {
        label: vm.allLabelConstant.SalesOrder.PO,
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
        label: vm.LabelConstant.SalesOrder.LegacyPo,
        value: 'Yes',
        displayOrder: 8
      });
    }
    if (vm.data.isRmaPO) {
      vm.headerdata.push({
        label: vm.LabelConstant.SalesOrder.RMAPo,
        value: 'Yes',
        displayOrder: 8
      });
    }
    vm.cancel = (isyes) => {
      $mdDialog.cancel(isyes);
    };

    vm.goToPartMaster = (partID) => {
      BaseService.goToComponentDetailTab(null, partID);
      return false;
    };
    // unlink future po details
    vm.unlinkDetail = (item) => {
      // confirmation to unlink details
      const messageContent = angular.copy(MESSAGE_CONSTANT.MFG.UNLINK_REMOVE_CONFIRMATION_ALERT);
      messageContent.message = COMMON.stringFormat(messageContent.message, item.poNumber, vm.data.poNumber);
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

    // open new popup for future po
    vm.openFuturePO = (ev) => {
      DialogFactory.dialogService(
        CORE.FUTURE_PO_ASSY_NEW_CREATE_MODAL_CONTROLLER,
        CORE.FUTURE_PO_ASSY_NEW_CREATE_MODAL_VIEW,
        ev,
        vm.data).then(() => {
        }, (response) => {
          if (response) {
            $mdDialog.cancel(response);
          }
        }, (err) => BaseService.getErrorLog(err));
    };
    vm.totalQty = () => _.sumBy(_.filter(vm.soBlanketPOlist, (item) => item.isBlanketPO), (o) => o.qty) || 0;

    vm.getusedBlanketPODetails = () => SalesOrderFactory.getBlanketPOUsedQtyForAssy().query({ id: vm.data.soID }).$promise.then((response) => {
      if (response && response.data) {
        vm.bomAssignedQtyList = response.data;
        return vm.usedQty = _.sumBy(vm.bomAssignedQtyList, (o) => (o.qty));
      }
    }).catch((error) => BaseService.getErrorLog(error));
    vm.getWoStatusClassName = (statusID) => BaseService.getWoStatusClassName(statusID);
    vm.saveMappedblanketPODetails = () => {
      const mappedList = _.filter(vm.soBlanketPOlist, (item) => item.isBlanketPO);
      if (mappedList.length === 0) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContent.message = stringFormat(messageContent.message, 'Future PO');
        const model = {
          multiple: true,
          messageContent: messageContent
        };
        return DialogFactory.messageAlertDialog(model).then(() => { });
      } else {
        vm.getusedBlanketPODetails().then(() => {
          if (vm.totalQty() > (vm.data.qty - vm.usedQty)) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.FPO_BPO_MAPPING_QTY_MISMATCH);
            messageContent.message = stringFormat(messageContent.message, vm.totalQty(), (vm.data.qty - vm.usedQty));
            const model = {
              multiple: true,
              messageContent: messageContent
            };
            return DialogFactory.messageAlertDialog(model).then(() => { setFocus('cancelBtn'); });
          } else {
            const blanketPO = {
              blanketID: vm.data.soID,
              mappedList: mappedList
            };
            SalesOrderFactory.linkFuturePOToBlanketPO().query(blanketPO).$promise.then((response) => {
              if (response) {
                $mdDialog.cancel(blanketPO);
              }
            });
          }
        });
      }
    };
    vm.refresh = () => {
      vm.getusedBlanketPODetails();
    };
    vm.openAssignedQty = (ev) => {
      vm.data.blanketPOID = vm.data.soID;
      vm.data.isfromUnlink = true;
      DialogFactory.dialogService(
        CORE.BLANKET_PO_ASSY_MODAL_CONTROLLER,
        CORE.BLANKET_PO_ASSY_MODAL_VIEW,
        ev,
        vm.data).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };
  }
})();
