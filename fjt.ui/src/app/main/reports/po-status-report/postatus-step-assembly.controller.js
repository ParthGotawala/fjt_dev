(function () {
  'use strict';

  angular
    .module('app.reports.postatusreport')
    .controller('POStatusStepAssemblyController', POStatusStepAssemblyController);

  /** @ngInject */
  function POStatusStepAssemblyController(CORE, BaseService, SalesOrderFactory, $stateParams, USER, REPORTS) {
    const vm = this;
    vm.emptySearch = CORE.EMPTYSTATE.EMPTY_SEARCH;
    if (!$stateParams || !$stateParams.customerID || !$stateParams.salesOrderDetID || !$stateParams.partID) {
      return;
    }

    const customerID = $stateParams.customerID;
    const salesOrderDetID = $stateParams.salesOrderDetID;
    const partID = $stateParams.partID;
    vm.allLabelConstant = angular.copy(CORE.LabelConstant);
    vm.debounceConstant = CORE.Debounce;
    //vm.customerPOwiseAssyDetails = null;
    const CustPOStatusLegend = angular.copy(CORE.Cust_PO_Status_Report_Legend);
    const custPOStatusLegendList = _.values(CustPOStatusLegend);
    vm.woQtyCalculationNote = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.PO_REPORT_WO_QTY_CALCULATION_NOTE.message;
    vm.poMainAssyDet = {};
    vm.selectedItems = [];
    vm.query = {
      order: '',
      search: ''
    };
    vm.limit = 300;
    //vm.workorderdet = [];
    vm.qtyProgressDataforAssyAllWo = [];
    vm.poAssywiseWOList = [];
    let poAssywiseWOListCopy = [];
    const rohsFolderPath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    const assemblyTypeTag = CORE.AssemblyTypeTag;
    vm.isDisplayQtyProgressDataScale = true;
    vm.CommonEmptyMessage = {
      IMAGEURL: REPORTS.REPORTS_EMPTYSTATE.NoRecordFound.IMAGEURL,
      MESSAGE: stringFormat(REPORTS.REPORTS_EMPTYSTATE.NoRecordFound.MESSAGE, 'assembly work order')
    };

    /* get/set qty in percentage value to display in horizontal bar */
    const getWoQtyDataInPercentage = (actualValue, buildQty) => eval(actualValue * 100 / buildQty).toFixed(2);

    /* to apply class for work order status */
    vm.getWoStatusClassName = (statusID,woID) => {
      if (woID ) {
        return stringFormat('{0} {1}', BaseService.getWoStatusClassName(statusID), 'label-box');
      } else {
        return '';
      }
    };


    /* get work order status like draft,published,etc */
    vm.getWoStatus = (statusID) => BaseService.getWoStatus(statusID);

    /* get assembly po detail list */
    const retrieveCustomerPOwiseWOAssyList = () => {
      vm.isDisplayQtyProgressDataScale = true;
      vm.cgBusyLoading = SalesOrderFactory.getCustomerPOwiseWOAssyList().save({
        customerID: customerID,
        salesOrderDetID: salesOrderDetID,
        partID: partID
      }).$promise.then((res) => {
        if (res && res.data && res.data.poAssywiseWOList && res.data.poAssywiseWOList.length > 0) {
          vm.poAssywiseWOList = res.data.poAssywiseWOList;
          _.each(vm.poAssywiseWOList, (assyWOItem) => {
            assyWOItem.displayRohsIcon = rohsFolderPath + assyWOItem.rohsIcon;
            if (assyWOItem.isSubAssembly) {
              assyWOItem.assemblyTypeTagName = assemblyTypeTag.SubAssembly.DisplayText;
              assyWOItem.assemblyTypeTagClassName = assemblyTypeTag.SubAssembly.ClassName;
            }
            else {
              assyWOItem.assemblyTypeTagName = assemblyTypeTag.Assembly.DisplayText;
              assyWOItem.assemblyTypeTagClassName = assemblyTypeTag.Assembly.ClassName;
            }
          });

          vm.isContainSubAssembly = _.some(vm.poAssywiseWOList, (assyWOItem) => assyWOItem.isSubAssembly === 1);

          /* [S] - progress bar for summary of assy all work order qty */

          const poAssywiseWOListWithOutSubAssy = _.filter(vm.poAssywiseWOList, (assyWOItem) => assyWOItem.isSubAssembly === 0);

          // count qty data only for main assembly not for sub-assembly
          if (poAssywiseWOListWithOutSubAssy && poAssywiseWOListWithOutSubAssy.length > 0) {
            vm.poMainAssyDet = _.first(poAssywiseWOListWithOutSubAssy);

            const totalShippedQty = _.sumBy(poAssywiseWOListWithOutSubAssy, 'shippedQty');
            const totalScrapQty = _.sumBy(poAssywiseWOListWithOutSubAssy, 'scrapQty');
            //let totalWIPQty = _.sumBy(poAssywiseWOListWithOutSubAssy, 'wipQty');
            const totalWIPQty = _.sumBy(poAssywiseWOListWithOutSubAssy, 'displayWIPQtyForReport');
            const totalBuildQty = _.sumBy(poAssywiseWOListWithOutSubAssy, 'buildQty');
            const totalUnProcessQty = _.sumBy(poAssywiseWOListWithOutSubAssy, 'unProcessQty');
            // const totalPOQty = _.sumBy(poAssywiseWOListWithOutSubAssy, 'poQty');

            /* qty in percentage */
            const totalShippedQtyInPer = getWoQtyDataInPercentage(totalShippedQty || 0, totalBuildQty);
            const totalScrapQtyInPer = getWoQtyDataInPercentage(totalScrapQty || 0, totalBuildQty);
            const totalWIPQtyInPer = getWoQtyDataInPercentage(totalWIPQty || 0, totalBuildQty);
            const totalUnProcessQtyInPer = getWoQtyDataInPercentage(totalUnProcessQty || 0, totalBuildQty);

            vm.assyPOStatusLegendList = _.filter(custPOStatusLegendList, (legendItem) => legendItem.isDisplayAtAssyLevel);
            vm.qtyProgressDataforAssyAllWo = [];
            if (totalBuildQty > 0) {
              vm.qtyProgressDataforAssyAllWo = [
                {
                  name: CustPOStatusLegend.ShippedQty.Key, value: totalShippedQty,
                  valueInPer: totalShippedQtyInPer, color: CustPOStatusLegend.ShippedQty.BackgroundColor,
                  orderBy: CustPOStatusLegend.ShippedQty.orderBy
                },
                {
                  name: CustPOStatusLegend.ScrapQty.Key, value: totalScrapQty,
                  valueInPer: totalScrapQtyInPer, color: CustPOStatusLegend.ScrapQty.BackgroundColor,
                  orderBy: CustPOStatusLegend.ScrapQty.orderBy
                },
                {
                  name: CustPOStatusLegend.WIPQty.Key, value: totalWIPQty,
                  valueInPer: totalWIPQtyInPer, color: CustPOStatusLegend.WIPQty.BackgroundColor,
                  orderBy: CustPOStatusLegend.WIPQty.orderBy
                },
                {
                  name: CustPOStatusLegend.UnProcessedQty.Key, value: totalUnProcessQty,
                  valueInPer: totalUnProcessQtyInPer, color: CustPOStatusLegend.UnProcessedQty.BackgroundColor,
                  orderBy: CustPOStatusLegend.UnProcessedQty.orderBy
                }
              ];
            }
          }

          poAssywiseWOListCopy = angular.copy(vm.poAssywiseWOList);

          /* [E] - progress bar for summary of assy all work order qty */

          const isAllWODraft = _.every(vm.poAssywiseWOList, ['woStatus', CORE.WOSTATUS.DRAFT]);
          if (isAllWODraft) {
            vm.isDisplayQtyProgressDataScale = false;
          }

          //let salesObj = _.first(res.data.salesordermst);

          //if (salesObj) {
          //    vm.assyobj = _.first(salesObj.salesOrderDet);
          //    if (vm.assyobj) {

          //        /* rohs icon setting */
          //        vm.RoHSLeadFreeText = vm.assyobj.componentAssembly.rfq_rohsmst.name;
          //        vm.RoHSLeadFreeIcon = CORE.WEB_URL + USER.ROHS_BASE_PATH + vm.assyobj.componentAssembly.rfq_rohsmst.rohsIcon;

          //        var uniqWO = _.groupBy(vm.assyobj.SalesOrderDetails, "woID");
          //        var workoredrList = [];
          //        _.each(uniqWO, function (uniqwo) {
          //            workoredrList.push(uniqwo[0]);
          //        });
          //        vm.workorderdet = workoredrList;

          //        /* [S] - progress bar for summary of assy all work order qty */
          //        let totalShippedAssyQty = 0;
          //        let totalPoQty = 0;
          //        let totalAssignedPoQty = 0;
          //        if (vm.assyobj.salesShippingDet && vm.assyobj.salesShippingDet.length > 0) {
          //            _.each(vm.assyobj.salesShippingDet, (ssdItem) => {
          //                totalShippedAssyQty += _.sum(_.map(ssdItem.shippedAssembly, 'shippedqty'));
          //            })
          //        }
          //        totalAssignedPoQty = _.sum(_.map(vm.assyobj.SalesOrderDetails, 'poQty'));
          //        totalPoQty = vm.assyobj.qty;
          //        let totalUnProcessQty = totalPoQty - (totalAssignedPoQty || 0);
          //        let totalWIPQty = totalAssignedPoQty - (totalShippedAssyQty || 0);

          //        /* qty in percentage */
          //        let totalUnProcessQtyInPer = getWoQtyDataInPercentage(totalUnProcessQty || 0, totalPoQty);
          //        let totalWIPQtyInPer = getWoQtyDataInPercentage(totalWIPQty || 0, totalPoQty);
          //        let totalShippedAssyQtyInPer = getWoQtyDataInPercentage(totalShippedAssyQty || 0, totalPoQty);

          //        vm.assyPOStatusLegendList = _.filter(custPOStatusLegendList, (legendItem) => {
          //            return legendItem.isDisplayAtAssyLevel;
          //        });

          //        vm.qtyProgressDataforAssyAllWo = [
          //             {
          //                 name: CustPOStatusLegend.ShippedQty.Key, value: totalShippedAssyQty,
          //                 valueInPer: totalShippedAssyQtyInPer, color: CustPOStatusLegend.ShippedQty.BackgroundColor
          //             },
          //             {
          //                 name: CustPOStatusLegend.WIPQty.Key, value: totalWIPQty,
          //                 valueInPer: totalWIPQtyInPer, color: CustPOStatusLegend.WIPQty.BackgroundColor
          //             },
          //             {
          //                 name: CustPOStatusLegend.UnProcessedQty.Key, value: totalUnProcessQty,
          //                 valueInPer: totalUnProcessQtyInPer, color: CustPOStatusLegend.UnProcessedQty.BackgroundColor
          //             }
          //        ];
          //        /* [E] - progress bar for summary of assy all work order qty */

          //    }
          //}
          //if (vm.workorderdet.length == 0) {
          //    vm.isassynotfound = true;
          //    vm.CommonEmptyMessage.MESSAGE = stringFormat(REPORTS.REPORTS_EMPTYSTATE.NoRecordFound.MESSAGE, item.text);
          //}
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    retrieveCustomerPOwiseWOAssyList();

    /* to refresh data  */
    vm.refreshPODetails = () => {
      retrieveCustomerPOwiseWOAssyList();
    };

    // go to assembly list
    vm.goToAssemblyList = () => {
        BaseService.goToPartList();
    };

    vm.goToWorkorderDetails = (woID) => {
      BaseService.goToWorkorderDetails(woID);
      return false;
    };

    // search filter
    vm.filterPOAssyWiseWOData = () => {
      if (vm.query.search) {
        vm.poAssywiseWOList = _.filter(poAssywiseWOListCopy, (assyWOItem) => {
          return assyWOItem.woNumber.toString().toLowerCase().indexOf(vm.query.search) !== -1
            || assyWOItem.woVersion.toString().toLowerCase().indexOf(vm.query.search) !== -1
            || assyWOItem.assemblyTypeTagName.toString().toLowerCase().indexOf(vm.query.search) !== -1
            || assyWOItem.PIDCode.toString().toLowerCase().indexOf(vm.query.search) !== -1
            || assyWOItem.rev.toString().toLowerCase().indexOf(vm.query.search) !== -1
            || assyWOItem.poQty.toString().toLowerCase().indexOf(vm.query.search) !== -1
            || assyWOItem.buildQty.toString().toLowerCase().indexOf(vm.query.search) !== -1
            || assyWOItem.scrapQty.toString().toLowerCase().indexOf(vm.query.search) !== -1
            || assyWOItem.shippedQty.toString().toLowerCase().indexOf(vm.query.search) !== -1
            || assyWOItem.displayWIPQtyForReport.toString().toLowerCase().indexOf(vm.query.search) !== -1
            || assyWOItem.unProcessQty.toString().toLowerCase().indexOf(vm.query.search) !== -1;
        });
      }
      else {
        vm.poAssywiseWOList = angular.copy(poAssywiseWOListCopy);
      }
    };
  }
})();
