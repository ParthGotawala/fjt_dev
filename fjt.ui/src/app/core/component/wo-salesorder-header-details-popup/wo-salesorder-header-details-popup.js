(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('WoSalesOrderHeaderDetailsPopupController', WoSalesOrderHeaderDetailsPopupController);

  /** @ngInject */
  function WoSalesOrderHeaderDetailsPopupController($mdDialog, data, BaseService, CORE, USER) {
    const vm = this;
    vm.woSoHeaderDetails = data;
    vm.selectedItems = [];
    vm.woSoHeaderDetailsList = [];
    vm.allLabelConstant = CORE.LabelConstant;
    vm.headerdata = [];
    const rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;

    /* hyperlink for part list page */
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };

    /* go to part details */
    vm.goToPartDetails = (item) => {
        BaseService.goToComponentDetailTab(null, item.id);
      return false;
    };

    /* go to workorder list */
    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
      return false;
    };
    /* go to workorder detail page */
    vm.goToWorkorderDetails = () => {
      BaseService.goToWorkorderDetails(data.woID || data.woid);
      return false;
    };

    vm.headerdata = [{
      label: CORE.LabelConstant.Assembly.PIDCode,
      value: data.PIDCode ? data.PIDCode : null,
      displayOrder: (vm.headerdata.length + 1),
      labelLinkFn: vm.goToPartList,
      valueLinkFn: vm.goToPartDetails,
      valueLinkFnParams: { id: data.partID ? data.partID : null },
      isCopy: true,
      imgParms: {
        imgPath: data.rohsIcon ? (rohsImagePath + data.rohsIcon) : null,
        imgDetail: data.rohsName ? data.rohsName : null
      }
    }, {
      label: CORE.LabelConstant.Workorder.WO,
      value: data.woNumber ? data.woNumber : null,
      displayOrder: (vm.headerdata.length + 1),
      labelLinkFn: vm.goToWorkorderList,
      valueLinkFn: data.woNumber ? vm.goToWorkorderDetails : null
    }];

    const poNumberList = vm.woSoHeaderDetails.poNumber.split(',');
    const salesOrderNumberList = vm.woSoHeaderDetails.salesOrderNumber.split(',');
    const woSOPOQtyList = vm.woSoHeaderDetails.soPOQty.split(','); // wo-so-po-qty
    const mrpQtyList = vm.woSoHeaderDetails.soMRPQty.split(',');
    const lineIDList = vm.woSoHeaderDetails.lineID.split(',');
    const salesOrderMstIDList = vm.woSoHeaderDetails.salesOrderMstIDs.split(',');
    const soPOQtyList = vm.woSoHeaderDetails.SOPOQtyValues.split(','); // so-po-qty
    const poTypeList = vm.woSoHeaderDetails.poType ? vm.woSoHeaderDetails.poType.split(',') : [];

    if (poNumberList.length === salesOrderNumberList.length && woSOPOQtyList.length === mrpQtyList.length && poNumberList.length === woSOPOQtyList.length) {
      for (let i = 0; i < poNumberList.length; i++) {
        vm.woSoHeaderDetailsList.push({
          poNumber: poNumberList[i],
          salesOrderNumber: salesOrderNumberList[i],
          woSOPOQty: woSOPOQtyList[i],
          soMRPQty: mrpQtyList[i],
          lineID: lineIDList[i],
          salesOrderMstID: salesOrderMstIDList[i],
          soPOQty: soPOQtyList[i],
          poType: poTypeList && poTypeList.length > 0 ? poTypeList[i]:''
        });
      }
    }

    //redirect to salesorder details
    vm.goToManageSalesOrder = (data) => {
      BaseService.goToManageSalesOrder(data.salesOrderMstID);
      return false;
    };

    vm.cancel = () => {
      $mdDialog.cancel();
    };

    // get class for Sale Order type
    vm.getPOTypeClassName = (classText) => {
      const poType = _.find(CORE.POType, (item) => item.Name === classText);
      return poType ? poType.ClassName : '';
    };
  }
})();
