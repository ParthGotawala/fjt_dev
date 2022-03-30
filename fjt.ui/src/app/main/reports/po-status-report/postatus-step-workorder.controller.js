(function () {
  'use strict';

  angular
    .module('app.reports.postatusreport')
    .controller('POStatusStepWorkOrderController', POStatusStepWorkOrderController);

  /** @ngInject */
  function POStatusStepWorkOrderController(CORE, BaseService, SalesOrderFactory, $stateParams, TravelersFactory, USER, REPORTS) {
    const vm = this;
    vm.emptySearch = CORE.EMPTYSTATE.EMPTY_SEARCH;
    vm.CommonEmptyMessage = {
      IMAGEURL: REPORTS.REPORTS_EMPTYSTATE.NoRecordFound.IMAGEURL,
    }
    if (!$stateParams || !$stateParams.salesOrderDetID || !$stateParams.woID) {
      return;
    }

    let salesOrderDetID = $stateParams.salesOrderDetID;
    let woID = $stateParams.woID;
    vm.allLabelConstant = angular.copy(CORE.LabelConstant);
    vm.debounceConstant = CORE.Debounce;
    vm.customerPOwiseAssyDetails = null;
    let CustPOStatusLegend = angular.copy(CORE.Cust_PO_Status_Report_Legend);
    let custPOStatusLegendList = _.values(CustPOStatusLegend);
    vm.selectedItems = [];
    vm.query = {
      order: '',
      search: '',
    };
    vm.limit = 300;
    vm.workOrderOperationList = [];
    vm.qtyProgressDataforAssyAllWo = [];
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.Stock_Column = angular.copy(CORE.PRODUCTION_REPORT_STOCK_COLUMN);
    vm.DateFormat = _dateDisplayFormat;
    let workOrderOperationListCopy = [];

    /* get/set qty in percentage value to display in horizontal bar */
    let getWoQtyDataInPercentage = (actualValue, buildQty) => {
      return eval(actualValue * 100 / buildQty).toFixed(2);
    }

    /* to apply class for work order status */
    vm.getWoStatusClassName = (statusID) => {
      return BaseService.getWoStatusClassName(statusID);
    }

    /* get work order status like draft,published,etc */
    vm.getWoStatus = (statusID) => {
      return BaseService.getWoStatus(statusID);
    }

    /*get operation list and traveled quantity details from work order id */
    let getWOOperationDetails = () => {
      vm.qtyProgressDataforWoAssy = [];
      vm.cgBusyLoading = SalesOrderFactory.getWorkOrderOperationList().query({ id: woID }).$promise.then((operation) => {
        vm.isWOOPListAvailable = false;
        var remain = vm.workordermst.buildQty;
        var unprocess = 0;
        if (operation.data && operation.data.length > 0) {
          _.each(operation.data, (item, index) => {
            item.LoopOperationQty = "N/A";
            if (item[vm.Stock_Column.IsTerminated] == 'Yes') {
              vm.isTerminated = true;
              vm.TransferWorkorder = item[vm.Stock_Column.TO_WO_NUMBER];
            }
            // check workorder operation is manufacturer quantity is true than show stock details other wise 0
            if (item[vm.Stock_Column.MFG_QTY_REQUIRED] == "Yes") {
              // if operation rework than issue quantity as stockqty
              if (item[vm.Stock_Column.IS_REWORK_OPERATION] == 'Yes') {
                if (item.isLoopOperation) {
                  operation.data[index - 1].LoopOperationQty = item[vm.Stock_Column.OP_PASSED_QTY];
                  if (operation.data[index - 1][vm.Stock_Column.ISSUE_QTY] > 0) {
                    operation.data[index - 1][vm.Stock_Column.ISSUE_QTY] = operation.data[index - 1][vm.Stock_Column.ISSUE_QTY] - item[vm.Stock_Column.OP_PASSED_QTY];
                  }
                }
                if (item[vm.Stock_Column.ISSUE_QTY] > 0) {
                  item[vm.Stock_Column.OP_STOCK_QTY] = item[vm.Stock_Column.OP_STOCK_QTY] + item[vm.Stock_Column.OP_SCRAPED_QTY];
                  item[vm.Stock_Column.UNPROCESS_QTY] = item[vm.Stock_Column.ISSUE_QTY] - item[vm.Stock_Column.OP_STOCK_QTY];
                } else {
                  item[vm.Stock_Column.OP_STOCK_QTY] = 0;
                  item[vm.Stock_Column.UNPROCESS_QTY] = 0;
                }
              } else {
                item[vm.Stock_Column.OP_STOCK_QTY] = item[vm.Stock_Column.OP_STOCK_QTY] + item[vm.Stock_Column.OP_SCRAPED_QTY];
                item[vm.Stock_Column.UNPROCESS_QTY] = remain - item[vm.Stock_Column.OP_STOCK_QTY] + unprocess;
                if (operation.data[index + 1] && operation.data[index + 1].isLoopOperation && operation.data[index + 1][vm.Stock_Column.OP_PASSED_QTY] > 0) {
                  item[vm.Stock_Column.UNPROCESS_QTY] = item[vm.Stock_Column.UNPROCESS_QTY] + operation.data[index + 1][vm.Stock_Column.OP_PASSED_QTY];
                }
              }

              // result data carried forward for next operation
              if (item[vm.Stock_Column.IS_REWORK_OPERATION] != 'Yes') {
                remain = item[vm.Stock_Column.OP_STOCK_QTY] - item[vm.Stock_Column.OP_SCRAPED_QTY] - item[vm.Stock_Column.SHIPPED_QTY];
                unprocess = item[vm.Stock_Column.UNPROCESS_QTY];
              } else {
                remain = remain - item[vm.Stock_Column.OP_SCRAPED_QTY] - item[vm.Stock_Column.SHIPPED_QTY];
              }
            }
            else {
              item[vm.Stock_Column.OP_STOCK_QTY] = 0;
              item[vm.Stock_Column.UNPROCESS_QTY] = 0;
              item[vm.Stock_Column.OP_SCRAPED_QTY] = 0;
              item[vm.Stock_Column.TRANSFER_QTY] = 0;
              item[vm.Stock_Column.SHIPPED_QTY] = 0;
            }
            item.opFullName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, item[vm.Stock_Column.OP_NAME], item[vm.Stock_Column.OP_NUMBER]);
          });
          vm.workOrderOperationList = operation.data;

          if (vm.workOrderOperationList.length == 0) {
            vm.CommonEmptyMessage.MESSAGE = stringFormat(REPORTS.REPORTS_EMPTYSTATE.NoRecordFound.OPERATION_MSG,
              (vm.allLabelConstant.Workorder.WO + " " + vm.workordermst.woNumber));
          }

          /* display progress bar for work order assembly wise */
          if (vm.workOrderOperationList && vm.workOrderOperationList.length > 0) {

            //let OpTrasferredQtyRecordsWithData = _.reject(vm.workOrderOperationList, (item) => {
            //  return item[vm.Stock_Column.TRANSFER_QTY] == 0;
            //});
            let totalOfTrasferredQty = _.sumBy(vm.workOrderOperationList, vm.Stock_Column.TRANSFER_QTY);

            //let OpScrapQtyRecordsWithData = _.reject(vm.workOrderOperationList, (item) => {
            //  return item[vm.Stock_Column.OP_SCRAPED_QTY] == 0;
            //});
            //let totalOfScrappedQty = _.max(_.map(vm.workOrderOperationList, vm.Stock_Column.OP_SCRAPED_QTY));
            vm.totalOfScrappedQty = _.sumBy(vm.workOrderOperationList, vm.Stock_Column.OP_SCRAPED_QTY);

            //let OpShippedQtyRecordsWithData = _.reject(vm.workOrderOperationList, (item) => {
            //  return item[vm.Stock_Column.SHIPPED_QTY] == 0;
            //});
            vm.totShippedQty = _.sumBy(vm.workOrderOperationList, vm.Stock_Column.SHIPPED_QTY);

            let totWIPQty = vm.workordermst.buildQty - (vm.totShippedQty + vm.totalOfScrappedQty + totalOfTrasferredQty);

            /* qty data in percentage */
            let totTransferredQtyInPer = getWoQtyDataInPercentage(totalOfTrasferredQty || 0, vm.workordermst.buildQty);
            let totScrappedQtyInPer = getWoQtyDataInPercentage(vm.totalOfScrappedQty || 0, vm.workordermst.buildQty);
            let totShippedQtyInPer = getWoQtyDataInPercentage(vm.totShippedQty || 0, vm.workordermst.buildQty);
            let totWIPQtyInPer = getWoQtyDataInPercentage(totWIPQty || 0, vm.workordermst.buildQty);

            vm.woOpPOStatusLegendList = _.filter(custPOStatusLegendList, (legendItem) => {
              return legendItem.isDisplayAtWoOpLevel;
            });

            vm.qtyProgressDataforWoAssy = [
              {
                name: CustPOStatusLegend.ShippedQty.Key, value: vm.totShippedQty,
                valueInPer: totShippedQtyInPer, color: CustPOStatusLegend.ShippedQty.BackgroundColor,
                orderBy: CustPOStatusLegend.ShippedQty.orderBy
              },
              {
                name: CustPOStatusLegend.ScrapQty.Key, value: vm.totalOfScrappedQty,
                valueInPer: totScrappedQtyInPer, color: CustPOStatusLegend.ScrapQty.BackgroundColor,
                orderBy: CustPOStatusLegend.ScrapQty.orderBy
              },
              {
                name: CustPOStatusLegend.TransferredQty.Key, value: totalOfTrasferredQty,
                valueInPer: totTransferredQtyInPer, color: CustPOStatusLegend.TransferredQty.BackgroundColor,
                orderBy: CustPOStatusLegend.TransferredQty.orderBy
              },
              {
                name: CustPOStatusLegend.WIPQty.Key, value: totWIPQty,
                valueInPer: totWIPQtyInPer, color: CustPOStatusLegend.WIPQty.BackgroundColor,
                orderBy: CustPOStatusLegend.WIPQty.orderBy
              }
            ];
            workOrderOperationListCopy = angular.copy(vm.workOrderOperationList);
            vm.isWOOPListAvailable = true;
          }
        }
        else {
          vm.CommonEmptyMessage.MESSAGE = stringFormat(REPORTS.REPORTS_EMPTYSTATE.NoRecordFound.OPERATION_MSG,
            (vm.allLabelConstant.Workorder.WO + " " + vm.workordermst.woNumber));
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    ///*Get standard data list*/
    //let getWOStandardsData = () => {
    //    let _objList = {
    //        woID: woID
    //    };
    //    vm.cgBusyLoadingCertificate = TravelersFactory.getWorkorderCertificateByWoID().query({ listObj: _objList }).$promise.then((woStandardDetails) => {
    //        vm.woStandardDetails = [];
    //        vm.woStandardDetails = woStandardDetails.data;
    //        var priority = null;
    //        _.each(vm.woStandardDetails, (certificate) => {
    //            if (certificate.certificateStandards) {
    //                if (priority == null) {
    //                    priority = certificate.certificateStandards.priority;
    //                    vm.colorCode = certificate.standardsClass ? certificate.standardsClass.colorCode ? certificate.standardsClass.colorCode : null : null;
    //                    vm.className = certificate.standardsClass ? certificate.standardsClass.className ? certificate.standardsClass.className : null : null;

    //                }
    //                else {
    //                    if (priority > certificate.certificateStandards.priority) {
    //                        priority = certificate.certificateStandards.priority;
    //                        vm.colorCode = certificate.standardsClass ? certificate.standardsClass.colorCode ? certificate.standardsClass.colorCode : null : null;
    //                        vm.className = certificate.standardsClass ? certificate.standardsClass.className ? certificate.standardsClass.className : null : null;
    //                    }

    //                }
    //            }
    //        });
    //        vm.SelectedRoHS = _.find(vm.RohsList, { id: vm.workordermst.RoHSStatusID });
    //        if (vm.SelectedRoHS) {
    //            vm.RoHSLeadFreeText = vm.SelectedRoHS.name;
    //            vm.RoHSLeadFreeIcon = vm.rohsImagePath + vm.SelectedRoHS.rohsIcon;
    //        }
    //    }).catch((error) => {
    //        return BaseService.getErrorLog(error);
    //    });
    //}


    /* get wo assembly detail list */
    let retrieveCustomerPOAssywiseWoDetails = () => {
      vm.cgBusyLoading = SalesOrderFactory.getCustomerPOAssywiseWoDetails().save({
        salesOrderDetID: salesOrderDetID,
        woID: woID
      }).$promise.then((res) => {
        if (res && res.data && res.data.salesordermst.length > 0) {
          let salesObj = _.first(res.data.salesordermst);

          if (salesObj) {
            vm.salesordermstDet = salesObj;
            vm.assyobj = _.first(salesObj.salesOrderDet);
            if (vm.assyobj) {
              let soDetObj = _.first(vm.assyobj.SalesOrderDetails);
              if (soDetObj) {
                vm.workordermst = soDetObj.WoSalesOrderDetails;
                if (vm.workordermst) {
                  vm.RoHSLeadFreeText = vm.workordermst.rohs.name;
                  vm.RoHSLeadFreeIcon = CORE.WEB_URL + USER.ROHS_BASE_PATH + vm.workordermst.rohs.rohsIcon;
                }

                //if (vm.workordermst.length == 0) {
                //    vm.CommonEmptyMessage.MESSAGE = stringFormat(REPORTS.REPORTS_EMPTYSTATE.NoRecordFound.MESSAGE, vm.allLabelConstant.Workorder.PageName);
                //}
                vm.PoQty = _.sumBy(soDetObj.WoSalesOrderDetails.WoSalesOrderDetails, function (o) { return o.poQty; });
                getWOOperationDetails();
                //getWOStandardsData();
              }
            }
          }
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    retrieveCustomerPOAssywiseWoDetails();

    vm.refreshPODetails = () => {
      retrieveCustomerPOAssywiseWoDetails();
    }

    /* to filter searched data  */
    vm.filterWoOpData = () => {
      if (vm.query.search) {
        vm.workOrderOperationList = _.filter(workOrderOperationListCopy, (woOPItem) => {
          return woOPItem[vm.Stock_Column.OP_NUMBER].toString().toLowerCase().indexOf(vm.query.search) != -1
            || woOPItem[vm.Stock_Column.OP_NAME].toString().toLowerCase().indexOf(vm.query.search) != -1
            || woOPItem[vm.Stock_Column.OP_VERSION].toString().toLowerCase().indexOf(vm.query.search) != -1
            || woOPItem[vm.Stock_Column.OP_STATUS].toString().toLowerCase().indexOf(vm.query.search) != -1
            || woOPItem.reason.toString().toLowerCase().indexOf(vm.query.search) != -1
            || woOPItem.unprocess.toString().toLowerCase().indexOf(vm.query.search) != -1
            || woOPItem[vm.Stock_Column.OP_STOCK_QTY].toString().toLowerCase().indexOf(vm.query.search) != -1
            || woOPItem[vm.Stock_Column.OP_PASSED_QTY].toString().toLowerCase().indexOf(vm.query.search) != -1
            || woOPItem[vm.Stock_Column.OP_DEFECT_OBSERVED_QTY].toString().toLowerCase().indexOf(vm.query.search) != -1
            || woOPItem[vm.Stock_Column.OP_REWORK_REQUIRED_QTY].toString().toLowerCase().indexOf(vm.query.search) != -1
            || woOPItem[vm.Stock_Column.OP_SCRAPED_QTY].toString().toLowerCase().indexOf(vm.query.search) != -1
            || woOPItem.OPBoardWithMissingPartsQty.toString().toLowerCase().indexOf(vm.query.search) != -1
            || woOPItem.OPBypassedQty.toString().toLowerCase().indexOf(vm.query.search) != -1
            || woOPItem[vm.Stock_Column.TRANSFER_QTY].toString().toLowerCase().indexOf(vm.query.search) != -1
            || woOPItem[vm.Stock_Column.SHIPPED_QTY].toString().toLowerCase().indexOf(vm.query.search) != -1
        });
      }
      else {
        vm.workOrderOperationList = angular.copy(workOrderOperationListCopy);
      }
      displaySumOfQty();
    }

    let displaySumOfQty = () => {
      if (vm.workOrderOperationList && vm.workOrderOperationList.length > 0) {
        vm.totalOfScrappedQty = _.sumBy(vm.workOrderOperationList, vm.Stock_Column.OP_SCRAPED_QTY);
        vm.totShippedQty = _.sumBy(vm.workOrderOperationList, vm.Stock_Column.SHIPPED_QTY);
      }
      else {
        vm.totalOfScrappedQty = vm.totShippedQty = 0;
      }
    }

    /* Navigation Details */
    vm.goToAssemblyList = () => {
        BaseService.goToPartList();
    };
    vm.goToAssemblyDetails = () => {
        BaseService.goToComponentDetailTab(null, vm.woAllHeaderDetails.partID);
      return false;
    }

    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
      return false;
    };
    vm.goToWorkorderDetails = () => {
      BaseService.goToWorkorderDetails(woID);
      return false;
    }

    //hyperlink go for sales order list page
    vm.goToSalesOrderList = () => {
      BaseService.goToSalesOrderList();
    };

    //redirect to salesorder details
    vm.goToManageSalesOrder = (salesOrderMstID) => {
      BaseService.goToManageSalesOrder(salesOrderMstID);
      return false;
    }

  }
})();
