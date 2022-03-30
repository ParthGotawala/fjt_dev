(function () {
  'use strict';

  angular
    .module('app.transaction.salesorder')
    .controller('SalesOrderBlanketPOPopupController', SalesOrderBlanketPOPopupController);

  /** @ngInject */
  function SalesOrderBlanketPOPopupController($mdDialog, data, CORE, DialogFactory, SalesOrderFactory, BaseService) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.loginUser = BaseService.loginUser;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.subAssy = CORE.PartCategory.SubAssembly;
    vm.cancel = () => {
      $mdDialog.cancel();
    };
    // select blanket po
    vm.selectBPO = () => {
      if (!vm.selected) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContent.message = stringFormat(messageContent.message, 'Blanket PO');
        const model = {
          multiple: true,
          messageContent: messageContent
        };
        return DialogFactory.messageAlertDialog(model).then(() => { setFocus('btnCancel'); });
      } else { $mdDialog.cancel(vm.selected); }
    };
    vm.soBlanketPOModel = data || {};

    // get blanket PO list
    const getpendingBlanketPOList = () => {
      vm.cgBusyLoading = SalesOrderFactory.getBlanketPOAssyList().query({ customerID: vm.soBlanketPOModel.customerID, partID: vm.soBlanketPOModel.partID }).$promise.then((response) => {
        if (response && response.data) {
          _.each(response.data, (item) => {
            item.poDate = BaseService.getUIFormatedDate(item.poDate, vm.DefaultDateFormat);
            item.poRevisionDate = BaseService.getUIFormatedDate(item.poRevisionDate, vm.DefaultDateFormat);
          });
          vm.pendingBlanketPOAssyList = response.data;
          vm.selected = vm.soBlanketPOModel.blanketPOID;
          if (vm.soBlanketPOModel.soBlanketPOID) {
            vm.selectBPO();
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    getpendingBlanketPOList();

    // open blanket po assy
    vm.blanketPOAssy = (ev, item) => {
      const data = {
        blanketPOID: item.id,
        partID: vm.soBlanketPOModel.partID,
        custPOLineNumber: vm.soBlanketPOModel.custPOLineNumber,
        rohsIcon: vm.soBlanketPOModel.rohsIcon,
        rohsName: vm.soBlanketPOModel.rohsName,
        mfgPN: vm.soBlanketPOModel.mfgPN,
        mfr: vm.soBlanketPOModel.mfrName,
        mfrID: vm.soBlanketPOModel.mfrID,
        partType: vm.soBlanketPOModel.partType,
        PIDCode: vm.soBlanketPOModel.PIDCode,
        soNumber: vm.soBlanketPOModel.salesOrderNumber || vm.soBlanketPOModel.soNumber,
        poNumber: vm.soBlanketPOModel.poNumber,
        salesOrderID: vm.soBlanketPOModel.id || vm.soBlanketPOModel.salesOrderID,
        isAlert: false
      };
      DialogFactory.dialogService(
        CORE.BLANKET_PO_ASSY_MODAL_CONTROLLER,
        CORE.BLANKET_PO_ASSY_MODAL_VIEW,
        ev,
        data).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };

    // go to sales order page
    vm.goToSalesOrder = (id) => {
      BaseService.goToManageSalesOrder(id || vm.soBlanketPOModel.salesOrderID);
    };

    //go to part master
    vm.goToPartMaster = () => {
      BaseService.goToComponentDetailTab(null, vm.soBlanketPOModel.partID);
    };
    // go to sales order list
    vm.goToSalesOrderList = () => {
      BaseService.goToSalesOrderList();
    };
    //link to go for part master list page
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };
    vm.headerdata = [];
    vm.headerdata.push({
      label: CORE.LabelConstant.SalesOrder.PO,
      value: vm.soBlanketPOModel.poNumber,
      isCopy: true,
      displayOrder: 1,
      labelLinkFn: vm.goToSalesOrderList,
      valueLinkFn: vm.goToSalesOrder
    }, {
      label: CORE.LabelConstant.SalesOrder.PODate,
      value: vm.soBlanketPOModel.poDate,
      displayOrder: 3
    },
      {
        label: CORE.LabelConstant.SalesOrder.PORevision,
        value: vm.soBlanketPOModel.porevision,
        displayOrder: 2
      }, {
      label: CORE.LabelConstant.SalesOrder.SO,
      value: vm.soBlanketPOModel.soNumber,
      isCopy: true,
      displayOrder: 3,
      labelLinkFn: vm.goToSalesOrderList,
      valueLinkFn: vm.goToSalesOrder
    }, {
      label: CORE.LabelConstant.SalesOrder.Revision,
      value: vm.soBlanketPOModel.revision,
      displayOrder: 4
    }, {
      label: CORE.LabelConstant.SalesOrder.SODate,
      value: vm.soBlanketPOModel.soDate,
      displayOrder: 5
    }, {
      label: CORE.LabelConstant.SalesOrder.AssyIDPID,
      value: vm.soBlanketPOModel.PIDCode,
      displayOrder: 6,
      labelLinkFn: vm.goToPartList,
      valueLinkFn: vm.goToPartMaster,
      isCopy: true,
      isAssy: vm.soBlanketPOModel.partType === vm.subAssy,
      imgParms: {
        imgPath: vm.soBlanketPOModel.rohsIcon,
        imgDetail: vm.soBlanketPOModel.rohsName
      }
    }, {
      label: CORE.LabelConstant.SalesOrder.POLineID,
      value: vm.soBlanketPOModel.custPOLineNumber,
      displayOrder: 7
    });
  }
})();
