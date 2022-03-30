(function () {
  'use strict';

  angular
    .module('app.reports.postatusreport')
    .controller('POStatusReportMainController', POStatusReportMainController);

  /** @ngInject */
  function POStatusReportMainController($timeout, CORE, REPORTS, BaseService, $state, $scope, SalesOrderFactory) {

    const vm = this;
    vm.allLabelConstant = CORE.LabelConstant;
    vm.isShowSideNav = true;
    vm.WorkOrderStatus = CORE.WoStatus;
    vm.documentClass = 'postatus-js-tree';
    const poStatusReportConst = CORE.PO_STATUS_REPORT;
    vm.EmptySalesMesssage = REPORTS.REPORTS_EMPTYSTATE.NoSalesOrder;
    vm.emptyStateForSelectCustomer = REPORTS.REPORTS_EMPTYSTATE.CUSTOMER_PO_MAIN;
    vm.SalesOrderList = [];

    const getWoStatus = (statusID) => BaseService.getWoStatus(statusID);

    /*get sales order list,assembly-revision list and work order list*/
    const getSalesorderList = () => {
      vm.cgBusyLoading = SalesOrderFactory.getAllSalesOrderList().query({
        refTableName: CORE.TABLE_NAME.MFG_CODE_MST
      }).$promise.then((res) => {
        vm.SalesOrderList = [];
        if (res && res.data) {
          vm.SalesOrderList = res.data;
          createTreeView();
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };

    /* to refresh tree and bind all details of tree again  */
    vm.refreshTree = () => {
      vm.autoCompleteWorkOrderStatus.keyColumnId = null;
      vm.poStatusTreeList = [];
      getSalesorderList();
    };

    /*get/set tree view for PO status */
    const createTreeView = () => {
      vm.poStatusTreeList = [];
      _.each(vm.SalesOrderList, (customer) => {
        if (customer.salesordermst.length > 0) {
          const custObj = {
            id: stringFormat(poStatusReportConst.Tree_ID_Format, poStatusReportConst.Customer, customer.id),
            //id: 'cust_' + customer.id,
            parent: '#',
            text: customer.mfgCode,
            move_state: REPORTS.PO_STATUS_CUSTOMER_REPORT_STATE,
            params: {
              customerID: customer.id.toString()
            }
          };
          custObj.tooltip = stringFormat(poStatusReportConst.ToolTip_Format, vm.allLabelConstant.Customer.Customer, custObj.text);
          vm.poStatusTreeList.push(custObj);
          _.each(customer.salesordermst, (salesorder) => {
            var obj = {
              id: stringFormat(poStatusReportConst.Tree_ID_Format, poStatusReportConst.SalesOrder_PO_Numer, salesorder.id),
              //id: 'PO_' + salesorder.id,
              parent: custObj.id,
              text: stringFormat('{0} {1}', salesorder.poNumber, salesorder.poType ? '(' + salesorder.poType + ')' : ''),
              move_state: REPORTS.PO_STATUS_PO_REPORT_STATE,
              params: {
                customerID: customer.id.toString(),
                salesOrderID: salesorder.id.toString()
              }
            };
            obj.tooltip = stringFormat(poStatusReportConst.ToolTip_Format, vm.allLabelConstant.Workorder.PO, obj.text);
            vm.poStatusTreeList.push(obj);

            _.each(salesorder.salesOrderDet, (assy) => {
              var assyrev = {
                id: stringFormat(poStatusReportConst.Tree_ID_Format, poStatusReportConst.Sales_Order_Det_As_Assembly, assy.id),
                //id: 'Assy_' + assy.id,
                parent: obj.id,
                text: stringFormat(poStatusReportConst.PO_Assy_LineID_Format, assy.componentAssembly ? assy.componentAssembly.PIDCode : 'NA', assy.lineID),
                move_state: REPORTS.PO_STATUS_ASSY_REPORT_STATE,
                params: {
                  customerID: customer.id.toString(),
                  //salesOrderID: salesorder.id.toString(),
                  salesOrderDetID: assy.id.toString(),
                  partID: assy.componentAssembly ? assy.componentAssembly.id.toString() : '',
                }
              };
              assyrev.tooltip = stringFormat(poStatusReportConst.PO_Assy_LineID_ToolTip_Format, vm.allLabelConstant.Assembly.PIDCode, assyrev.text),
                vm.poStatusTreeList.push(assyrev);

              const workorderdatagroupbyID = _.groupBy(assy.SalesOrderDetails, 'woID');
              _.each(workorderdatagroupbyID, (workorderdetail) => {
                var workorder = workorderdetail[0];
                if (workorder.WoSalesOrderDetails.customerID === customer.id) {
                  const work = {
                    id: stringFormat(poStatusReportConst.Tree_ID_Format, poStatusReportConst.WO_SO_Det_As_WorkOrder, workorder.woSalesOrderDetID),
                    //id: 'Work_' + workorder.woSalesOrderDetID,
                    parent: assyrev.id,
                    text: workorder.WoSalesOrderDetails.woNumber,
                    move_state: REPORTS.PO_STATUS_WORKORDER_REPORT_STATE,
                    params: {
                      //salesOrderID: salesorder.id.toString(),
                      salesOrderDetID: assy.id.toString(),
                      woID: workorder.WoSalesOrderDetails.woID.toString(),
                      woSalesOrderDetID: workorder.woSalesOrderDetID.toString()
                    },
                    data: getWoStatus(workorder.WoSalesOrderDetails.woSubStatus)
                  };
                  work.tooltip = stringFormat(poStatusReportConst.ToolTip_Format, vm.allLabelConstant.Workorder.WO, work.text),
                    vm.poStatusTreeList.push(work);
                }
              });
              //const initialStockGroupID = _.groupBy(assy.InitialStock, 'woNumber');
              //_.each(initialStockGroupID, (stockDet) => {
              //  const stockDetail = stockDet[0];
              //  if (stockDetail.refSalesOrderDetID === assy.id) {
              //    const work = {
              //      id: stringFormat(poStatusReportConst.Tree_ID_Format, poStatusReportConst.Initial_Stock, stockDetail.refSalesOrderDetID),
              //      //id: 'Work_' + workorder.woSalesOrderDetID,
              //      parent: assyrev.id,
              //      text: stockDetail.woNumber,
              //      move_state: REPORTS.PO_STATUS_WORKORDER_REPORT_STATE,
              //      params: {
              //        //salesOrderID: salesorder.id.toString(),
              //        salesOrderDetID: assy.id.toString(),
              //        refSalesOrderDetID: stockDetail.refSalesOrderDetID.toString(),
              //        refSalesOrderID: stockDetail.refSalesOrderID.toString()
              //      }
              //     //  data: getWoStatus(workorder.WoSalesOrderDetails.woSubStatus)
              //    };
              //    work.tooltip = stringFormat(poStatusReportConst.ToolTip_Format, vm.allLabelConstant.Workorder.WO, work.text),
              //      vm.poStatusTreeList.push(work);
              //  }
              //});
            });
          });
        }
      });
      // }
      //});
    };

    vm.HideShowSideNav = (isSideNave) => {
      vm.isShowSideNav = false;
      if (isSideNave) {
        vm.isShowSideNav = true;
      }
    };

    /*select node from tree and show list for subnode based on list*/
    vm.selectedNode = (item) => {
      vm.isAnyTreeNodeSelected = true;
      if ($state.current.name !== item.move_state || ($state.current.name === item.move_state && !_.isEqual($state.params, item.params))) {
        const existNodeToSetData = _.find(vm.poStatusTreeList, (treeItem) => treeItem.id === item.id);
        if (existNodeToSetData && !existNodeToSetData.params.isAutoTreeNodeSelection) {
          _.map(vm.poStatusTreeList, (item) => {
            item.params.isAutoTreeNodeSelection = false;
          });
          existNodeToSetData.params.isAutoTreeNodeSelection = true;
          $state.go(item.move_state, item.params);
        }
      }
    };

    const getWorkOrderStatus = (item) => $scope.$broadcast('serachNode', item);

    vm.autoCompleteWorkOrderStatus = {
      columnName: 'Name',
      keyColumnName: 'ID',
      keyColumnId: null,
      inputName: 'Work Order Status',
      placeholderName: 'Work Order Status',
      isRequired: false,
      isAddnew: false,
      onSelectCallbackFn: getWorkOrderStatus
    };

    getSalesorderList();

    /* once tree view ready then select node if any when url access externally or reload page case 
    it may be possible that on reload no any node selected */
    vm.callAfterTreeLoad = (selectedTreeNodeItem) => {
      let displayReportForParams = null;
      if ($state.current.data) {
        displayReportForParams = $state.current.data.displayReportFor;
      }
      if (displayReportForParams && vm.poStatusTreeList && vm.poStatusTreeList.length) {
        let selecteNodeIDFromTree = null;
        let nodeAssyItemToBeSelect;
        let nodeWoItemToBeSelect;

        /* identify type of report and set tree node as per requirement  */
        switch (displayReportForParams.toString().trim()) {
          case poStatusReportConst.displayReportFor.customer:
            selecteNodeIDFromTree = stringFormat(poStatusReportConst.Tree_ID_Format, poStatusReportConst.Customer, $state.params.customerID);
            break;
          case poStatusReportConst.displayReportFor.po:
            selecteNodeIDFromTree = stringFormat(poStatusReportConst.Tree_ID_Format, poStatusReportConst.SalesOrder_PO_Numer, $state.params.salesOrderID);
            break;
          case poStatusReportConst.displayReportFor.assembly:
            nodeAssyItemToBeSelect = _.find(vm.poStatusTreeList, (treeItem) =>
              treeItem.params.customerID === $state.params.customerID && treeItem.params.salesOrderDetID === $state.params.salesOrderDetID
              && treeItem.params.partID === $state.params.partID && treeItem.id.indexOf(poStatusReportConst.Sales_Order_Det_As_Assembly) !== -1
            );
            selecteNodeIDFromTree = nodeAssyItemToBeSelect ? stringFormat(poStatusReportConst.Tree_ID_Format, poStatusReportConst.Sales_Order_Det_As_Assembly, nodeAssyItemToBeSelect.params.salesOrderDetID) : null;
            break;
          case poStatusReportConst.displayReportFor.workorder:
            nodeWoItemToBeSelect = _.find(vm.poStatusTreeList, (treeItem) => treeItem.params.salesOrderDetID === $state.params.salesOrderDetID && treeItem.params.woID === $state.params.woID
              && treeItem.id.indexOf(poStatusReportConst.WO_SO_Det_As_WorkOrder) !== -1);
            selecteNodeIDFromTree = stringFormat(poStatusReportConst.Tree_ID_Format, poStatusReportConst.WO_SO_Det_As_WorkOrder, nodeWoItemToBeSelect.params.woSalesOrderDetID);
            break;
          //case poStatusReportConst.displayReportFor.initialStock:
          //  const nodeOSItemToBeSelect = _.find(vm.poStatusTreeList, (treeItem) => treeItem.params.salesOrderDetID === $state.params.salesOrderDetID
          //    && treeItem.id.indexOf(poStatusReportConst.Initial_Stock) !== -1);
          //  selecteNodeIDFromTree = stringFormat(poStatusReportConst.Tree_ID_Format, poStatusReportConst.Initial_Stock, nodeOSItemToBeSelect.params.woSalesOrderDetID);
          //  break;
        }
        if (selecteNodeIDFromTree) {
          const existNodeToSetData = _.find(vm.poStatusTreeList, (item) => item.id == selecteNodeIDFromTree);
          if (existNodeToSetData && !existNodeToSetData.params.isAutoTreeNodeSelection) {
            _.map(vm.poStatusTreeList, (item) => item.params.isAutoTreeNodeSelection = false);
            existNodeToSetData.params.isAutoTreeNodeSelection = true;
            $('.postatus-js-tree').jstree(true).deselect_all(true);
            //$('.postatus-js-tree').jstree(true).settings.core.data = vm.poStatusTreeList;
            $('.postatus-js-tree').jstree(true).select_node(selecteNodeIDFromTree);
          }
        }
      }
    };

    // to refresh tree data
    vm.refreshPOTreeData = () => {
      getSalesorderList();
    };
  }
})();
