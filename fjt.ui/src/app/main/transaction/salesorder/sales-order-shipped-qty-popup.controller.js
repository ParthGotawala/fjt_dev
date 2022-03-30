(function () {
  'use strict';

  angular
    .module('app.transaction.salesorder')
    .controller('SalesOrderShippedQtyPopupController', SalesOrderShippedQtyPopupController);

  /** @ngInject */
  function SalesOrderShippedQtyPopupController($mdDialog, data, BaseService, CORE, USER, SalesOrderFactory, DialogFactory, $timeout) {
    const vm = this;
    vm.popupParamData = data;
    vm.isUpdatable = true;
    vm.LabelConstant = CORE.LabelConstant;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.subAssy = CORE.PartCategory.SubAssembly;
    vm.loginUser = BaseService.loginUser;
    vm.isHideDelete = true;
    vm.gridId = CORE.gridConfig.gridSOShippedQtyBifurcation;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [],
        SearchColumns: [],
        id: vm.popupParamData.id,
        releaseID: vm.popupParamData.releaseID || null,
        soID: vm.popupParamData.soID || null,
        cpsStatus: vm.popupParamData.cpsStatus
      };
    };
    initPageInfo();


    const formatDataForExport = (allData) => {
      _.map(allData, (data) => {
        data.packingSlipDate = BaseService.getUIFormatedDate(data.packingSlipDate, vm.DefaultDateFormat);
        data.invoiceDate = BaseService.getUIFormatedDate(data.invoiceDate, vm.DefaultDateFormat);
      });
    };
    // const setGrid = () => {
    /** Grid options for material grid */
    vm.gridOptions = {
      enablePaging: isEnablePagination,
      enablePaginationControls: isEnablePagination,
      showColumnFooter: true,
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: false,
      multiSelect: false,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: 'SalesOrderShippingHistory.csv',
      CurrentPage: CORE.PAGENAME_CONSTANT[65].PageName,
      hideMultiDeleteButton: false,
      allowToExportAllData: true,
      /* Calls everytime for Export All Data [rowType = ALL] */
      exporterAllDataFn: () => {
        /* For scrolling pagination vm.pagingInfo.Page is increase everytime so we have to set API side pagePerReocrds as NULL for Export All Data */
        const pagingInfoOld = _.clone(vm.pagingInfo);
        pagingInfoOld.pageSize = 0;
        pagingInfoOld.Page = 1;
        vm.gridOptions.isExport = pagingInfoOld.isExport = true;
        return SalesOrderFactory.getSalesOrderPackingSlipNumber().query(pagingInfoOld).$promise.then((resAllExp) => {
          if (resAllExp.status === CORE.ApiResponseTypeStatus.SUCCESS && resAllExp.data) {
            formatDataForExport(resAllExp.data);
            return resAllExp.data;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.sourceData = [];

    vm.bindGridDetail = (gridData) => {
      _.each(gridData, (item) => {
        item.packingSlipDate = BaseService.getUIFormatedDate(item.packingSlipDate, vm.DefaultDateFormat);
        item.invoiceDate = BaseService.getUIFormatedDate(item.invoiceDate, vm.DefaultDateFormat);
        const status = _.find(CORE.CustomerPackingSlipStatusInInvoice, (ps) => ps.ID === parseInt(item.subStatus));
        if (status) {
          //item.statusName = !status.ID ? CORE.CustomerPackingSlipStatusInInvoice[1].Name : status.Name;
          item.className = !status.ID ? CORE.CustomerPackingSlipStatusInInvoice[1].ClassName : status.ClassName;
        }
      });
      // vm.salesOrderShippedQty = response.data;
      // vm.totalShippedQty = _.sumBy(response.data, (item) => item.shipQty);
    };
    // set footer total for UI grid
    vm.getFooterShipQtyTotal = () => {
      const sum = (_.sumBy(vm.sourceData, (item) => item.shipQty)) || 0;
      return sum;
    };

    vm.sourceHeader = [
      {
        field: 'Action',
        cellClass: 'layout-align-center-center',
        displayName: 'Action',
        width: '90',
        cellTemplate: '<grid-action-view grid="grid" row="row" number-of-action-button="3"></grid-action-view>',
        enableFiltering: false,
        enableSorting: false,
        exporterSuppressExport: true,
        pinnedLeft: true
      },
      {
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
        enableFiltering: false,
        enableSorting: false
      },
      {
        field: 'statusName',
        displayName: 'Packing Slip Status',
        width: 200,
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" ng-class="row.entity.className">'
          + '{{row.entity.statusName}}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: CORE.CustomerPackingSlipStatusGridHeaderDropdown
        },
        enableFiltering: true,
        enableSorting: true,
        ColumnDataType: 'StringEquals'
      },
      {
        field: 'mfrName',
        displayName: vm.LabelConstant.MFG.MFG,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                                        <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToManufacturer(row.entity.mfgcodeID);$event.preventDefault();">{{row.entity.mfrName}}</a>\
                            <copy-text label="\'MFR\'" text="row.entity.mfrName" ng-if="row.entity.mfrName"></copy-text></div>',
        width: '180'
      },
      {
        field: 'mfgpn',
        displayName: vm.LabelConstant.MFG.MFGPN,
        cellTemplate: '<div class="ui-grid-cell-contents" ng-if="row.entity.partId"><common-pid-code-label-link  \
                                component-id="row.entity.partId" \
                                label="grid.appScope.$parent.vm.LabelConstant.MFG.MFGPN" \
                                value="row.entity.mfgPN" \
                                is-copy="true" \
                                is-custom-part = row.entity.isCustom \
                                cust-part-number = row.entity.custAssyPN\
                                is-search-findchip="false"\
                                is-formated="true"\
                                is-search-digi-key="false"\
                                rohs-icon="grid.appScope.$parent.vm.rohsImagePath + row.entity.rohsIcon" \
                                rohs-status="row.entity.rohsName"></common-pid-code-label-link></div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.PID
      },
      {
        field: 'PIDCode',
        displayName: vm.LabelConstant.SalesOrder.AssyIDPID,
        cellTemplate: '<div class="ui-grid-cell-contents" ng-if="row.entity.partId"><common-pid-code-label-link  \
                                component-id="row.entity.partId" \
                                label="grid.appScope.$parent.vm.LabelConstant.SalesOrder.AssyIDPID" \
                                value="row.entity.PIDCode" \
                                is-copy="true" \
                                is-custom-part = row.entity.isCustom \
                                cust-part-number = row.entity.custAssyPN\
                                is-search-findchip="false"\
                                is-formated="true"\
                                is-search-digi-key="false"\
                                rohs-icon="grid.appScope.$parent.vm.rohsImagePath + row.entity.rohsIcon" \
                                rohs-status="row.entity.rohsName"></common-pid-code-label-link></div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.PID
      },
      {
        field: 'nickname',
        width: '150',
        displayName: 'Nickname',
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>'
      },
      {
        field: 'packingSlipNumber',
        displayName: 'Packing Slip#',
        cellTemplate: '<div class= "ui-grid-cell-contents grid-cell-text-left">'
          +'<a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToPackingSlip(row.entity.id,row.entity.refSalesOrderID);$event.preventDefault();">{{ COL_FIELD }}</a> \
                            <copy-text  label="grid.appScope.$parent.vm.CORE.LabelConstant.CustomerPackingSlip.PackingSlipNumber" text="row.entity.packingSlipNumber"> </copy-text>\
                            <md-tooltip>{{row.entity.packingSlipNumber}}</md-tooltip> \
                         </div>',
        width: '130'
      },
      {
        field: 'packingSlipDate',
        displayName: 'Packing Slip Date',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.ONLY_DATE_COLUMN,
        type: 'date',
        enableFiltering: false,
        enableSorting: true,
        footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right" >Total</div>'
      },
      {
        field: 'shipQty',
        width: 90,
        displayName: 'Shipped Qty',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
        footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right" >{{grid.appScope.$parent.vm.getFooterShipQtyTotal()}}</div>'
      },
      {
        field: 'invoiceNumber',
        displayName: 'Invoice#',
        cellTemplate: '<div class= "ui-grid-cell-contents grid-cell-text-left"> <a ng-if="row.entity.invoiceNumber" tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToInvoice(row.entity.refCustInvoiceID);$event.preventDefault();">{{row.entity.invoiceNumber}}</a> ' +
          '<copy-text  label="grid.appScope.$parent.vm.CORE.LabelConstant.CustomerPackingInvoice.CustomerInvoiceNumber" text="row.entity.invoiceNumber" ng-if="row.entity.invoiceNumber"> </copy-text>\
                                        <md-tooltip ng-if="row.entity.invoiceNumber">{{row.entity.invoiceNumber}}</md-tooltip>'+
        '</div>',
        width: '140'
      },
      {
        field: 'invoiceDate',
        displayName: 'Invoice Date', cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.ONLY_DATE_COLUMN,
        type: 'date',
        enableFiltering: false
      },
      {
        field: 'shippingNotes',
        displayName: 'Line Shipping Comments',
        cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
          '<span class="cursor-pointer bom-header-wrap">{{ COL_FIELD }}</span> &nbsp;' +
          '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.shippingNotes && row.entity.shippingNotes !== \'-\'" ng-click="grid.appScope.$parent.vm.showLineShippingComment(row.entity, $event)">' +
          '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
          '<md-tooltip>View</md-tooltip>' +
          '</button>' +
          '</div>',
        width: '250',
        enableFiltering: false,
        enableSorting: true
      },
      {
        field: 'internalComment',
        displayName: 'Line Internal Notes',
        cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
          '<span class="cursor-pointer bom-header-wrap">{{ COL_FIELD }}</span> &nbsp;' +
          '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.internalComment && row.entity.internalComment !== \'-\'" ng-click="grid.appScope.$parent.vm.showLineInternalComment(row.entity, $event)">' +
          '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
          '<md-tooltip>View</md-tooltip>' +
          '</button>' +
          '</div>',
        width: '250',
        enableFiltering: false,
        enableSorting: true
      }
    ];

    // get packing slip qty wise detail
    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = SalesOrderFactory.getSalesOrderPackingSlipNumber().query(vm.pagingInfo).$promise.then((response) => {
        if (response && response.data && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          setDataAfterGetAPICall(response);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //call when user scroll down on list page
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = CSalesOrderFactory.getSalesOrderPackingSlipNumber().query(vm.pagingInfo).$promise.then((response) => {
        if (response && response.data && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          setDataAfterGetAPICall(response, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //const getPackinfSlipQtyForSO = () => {
    //  // BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
    //  vm.cgBusyLoading = SalesOrderFactory.getSalesOrderPackingSlipNumber().query({
    //    id: vm.popupParamData.id,
    //    releaseID: vm.popupParamData.releaseID || null,
    //    soID: vm.popupParamData.soID || null
    //  }).$promise.then((response) => {
    //    if (response && response.data) {
    //      _.each(response.data, (item) => {
    //        item.packingSlipDate = BaseService.getUIFormatedDate(item.packingSlipDate, vm.DefaultDateFormat);
    //        item.invoiceDate = BaseService.getUIFormatedDate(item.invoiceDate, vm.DefaultDateFormat);
    //        const status = _.find(CORE.CustomerPackingSlipStatusInInvoice, (ps) => ps.ID === parseInt(item.subStatus));
    //        if (status) {
    //          item.statusName = !status.ID ? CORE.CustomerPackingSlipStatusInInvoice[1].Name : status.Name;
    //          item.className = !status.ID ? CORE.CustomerPackingSlipStatusInInvoice[1].ClassName : status.ClassName;
    //        }
    //      });
    //      vm.salesOrderShippedQty = response.data;
    //      vm.totalShippedQty = _.sumBy(response.data, (item) => item.shipQty);
    //    }
    //  }).catch((error) => BaseService.getErrorLog(error));
    //};


    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICall = (shipQtyRes, isGetDataDown) => {
      if (shipQtyRes && shipQtyRes.data && shipQtyRes.data.shipList) {
        vm.bindGridDetail(shipQtyRes.data.shipList);
        if (!isGetDataDown) {
          vm.sourceData = shipQtyRes.data.shipList;
          vm.currentdata = vm.sourceData.length;
        }
        else if (shipQtyRes.data.shipList.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(shipQtyRes.data.shipList);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        // must set after new data comes
        vm.totalSourceDataCount = shipQtyRes.data.Count;
        if (!vm.gridOptions.enablePaging) {
          if (!isGetDataDown) {
            vm.gridOptions.gridApi.infiniteScroll.resetScroll();
          }
          else {
            vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
          }
        }
        if (!isGetDataDown) {
          vm.gridOptions.clearSelectedRows();
        }
        if (vm.totalSourceDataCount === 0) {
          if (vm.pagingInfo.SearchColumns.length > 0) {
            vm.isNoDataFound = false;
            vm.emptyState = 0;
          }
          else {
            vm.isNoDataFound = true;
            vm.emptyState = null;
          }
        }
        else {
          vm.isNoDataFound = false;
          vm.emptyState = null;
        }
        $timeout(() => {
          if (!isGetDataDown) {
            vm.resetSourceGrid();
            if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
            }
          }
          else {
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount !== vm.currentdata ? true : false);
          }
        });
      }
    };

    //vm.loadData();

    vm.cancel = () => {
      $mdDialog.cancel();
    };

    vm.queryAssemblyList = {
      order: '',
      assembly_search: '',
      limit: 5,
      page: 1,
      isPagination: CORE.isPagination
    };

    const showDescription = (popupData, ev) => {
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        popupData).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    };

    //show SO Line shipping comment in pop up
    vm.showLineShippingComment = (obj, ev) => {
      const popupData = {
        title: vm.LabelConstant.SalesOrder.ShippingCommentsLine,
        description: obj.shippingNotes
      };
      showDescription(popupData, ev);
    };

    //show SO Line internal comment in pop up
    vm.showLineInternalComment = (obj, ev) => {
      const popupData = {
        title: vm.LabelConstant.SalesOrder.InternalNotesLine,
        description: obj.internalComment
      };
      showDescription(popupData, ev);
    };

    //update record
    vm.updateRecord = (row) => BaseService.goToManageCustomerPackingSlip(row.entity.id, vm.popupParamData.soID|| 0);

    // go to packing slip
    vm.goToPackingSlip = (id) => BaseService.goToManageCustomerPackingSlip(id, vm.popupParamData.soID);
    // go to invoice
    vm.goToInvoice = (id) => BaseService.goToManageCustomerInvoice(id);

    //go to part master
    vm.goToPartMaster = () => BaseService.goToComponentDetailTab(null, vm.popupParamData.partID);

    //link to go for part master list page
    vm.goToPartList = () => BaseService.goToPartList();
    // goto MFR List
    vm.goToManufacturerList = () => BaseService.goToManufacturerList();

    vm.goToManufacturer = (id) => BaseService.goToManufacturer(id);

    // go to  sales order list
    vm.goToSalesOrderList = () => BaseService.goToSalesOrderList();

    // go to manage  sales order
    vm.goToManageSalesOrder = () => BaseService.goToManageSalesOrder(vm.popupParamData.soID);


    // go to customer list
    vm.goToCustomerList = () => BaseService.goToCustomerList();

    // go to manage customer
    vm.goToManageCustomer = () => BaseService.goToCustomer(vm.popupParamData.customerId);

    vm.headerdata = [];
    vm.headerdata.push({
      label: 'PO Qty',
      value: vm.popupParamData.poQty,
      displayOrder: 5
    }, {
      label: 'Shipped Qty',
      value: vm.popupParamData.shippedQty,
      displayOrder: 6
    }, {
      label: CORE.LabelConstant.SalesOrder.AssyIDPID,
      value: vm.popupParamData.pidCode,
      displayOrder: 3,
      labelLinkFn: vm.goToPartList,
      valueLinkFn: vm.goToPartMaster,
      isCopy: true,
      isAssy: vm.popupParamData.partType === vm.subAssy,
      imgParms: {
        imgPath: vm.popupParamData.rohsIcon,
        imgDetail: vm.popupParamData.rohsName
      }
    }, {
      label: 'PO Line#',
      value: vm.popupParamData.custPOLineNumber,
      displayOrder: 4
    });
    if (vm.popupParamData.soNumber) {
      vm.headerdata.push({
        label: vm.LabelConstant.SalesOrder.SO,
        value: vm.popupParamData.soNumber,
        labelLinkFn: vm.goToSalesOrderList,
        valueLinkFn: vm.goToManageSalesOrder,
        isCopy: true,
        displayOrder: 0
      });
    }
    if (vm.popupParamData.poNumber) {
      vm.headerdata.push({
        label: vm.LabelConstant.SalesOrder.PO,
        value: vm.popupParamData.poNumber,
        labelLinkFn: vm.goToSalesOrderList,
        valueLinkFn: vm.goToManageSalesOrder,
        isCopy: true,
        displayOrder: 1
      });
    }
    if (vm.popupParamData.customerId) {
      vm.headerdata.push({
        label: vm.LabelConstant.Customer.Customer,
        value: vm.popupParamData.customerName,
        labelLinkFn: vm.goToCustomerList,
        valueLinkFn: vm.goToManageCustomer,
        isCopy: true,
        displayOrder: 2
      });
    }
  }
})();
