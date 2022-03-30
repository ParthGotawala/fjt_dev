(function () {
  'use strict';

  angular.module('app.transaction.reserveStockRequest')
    .controller('ReserveStockRequestController', ReserveStockRequestController);

  /** @ngInject */
  function ReserveStockRequestController($scope, $timeout, BaseService, ReserveStockRequestFactory, DialogFactory, USER, CORE, TRANSACTION) {
    const vm = this;
    vm.isUpdatable = true;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.DefaultDateTimeFormat = _dateTimeDisplayFormat;
    vm.sourceData = [];
    vm.totalSourceDataCount = 0;
    vm.currentdata = 0;
    vm.isNoDataFound = false;
    vm.EmptyMesssage = angular.copy(USER.ADMIN_EMPTYSTATE.RESERVE_STOCK_REQUEST);
    vm.gridConfig = CORE.gridConfig;
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.MEASUREMENT_TYPES_COUNT = CORE.MEASUREMENT_TYPES.COUNT;

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['transactionDate', 'DESC']],
        SearchColumns: []
      };

      if (vm.isInvoicePage) {
        vm.pagingInfo.SortColumns.push(['receiptDate', 'DESC']);
      }
    };
    initPageInfo();

    vm.gridOptions = {
      showColumnFooter: false,
      enableRowHeaderSelection: true,
      enableFullRowSelection: false,
      enableRowSelection: true,
      multiSelect: true,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: 'ReserveStockRequest.csv'
    };

    vm.sourceHeader = [{
      field: 'Action',
      displayName: 'Action',
      width: '80',
      cellTemplate: '<grid-action-view grid="grid" row="row"></grid-action-view>',
      enableFiltering: false,
      enableSorting: false,
      exporterSuppressExport: true,
      pinnedLeft: true
    }, {
      field: '#',
      width: '50',
      cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
      enableFiltering: false,
        enableSorting: false,
        pinnedLeft: true
    }, {
      field: 'customerName',
      width: 250,
      displayName: CORE.LabelConstant.Customer.Customer,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
    }, {
      field: 'transactionDate',
      displayName: 'Transaction Date',
      width: 100,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
      type: 'datetime'
    }, {
      field: 'assyPIDCode',
      width: CORE.UI_GRID_COLUMN_WIDTH.PID,
      displayName: vm.LabelConstant.Assembly.PIDCode,
      cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link ng-if="row.entity.assyID" \
                            component-id="row.entity.assyID" \
                            label="grid.appScope.$parent.vm.LabelConstant.Assembly.PIDCode" \
                            value="row.entity.assyPIDCode" \
                            is-copy="true" \
                            is-custom-part="row.entity.isCustomAssy"\
                            rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.assyRohsIcon" \
                            rohs-status="row.entity.assyRohsName"></common-pid-code-label-link></div>'
    }, {
      field: 'nickName',
      displayName: 'Nickname',
      width: CORE.UI_GRID_COLUMN_WIDTH.ASSY_NICKNAME,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
    }, {
      field: 'mfg',
      width: '150',
      displayName: vm.LabelConstant.MFG.MFG,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
    }, {
      field: 'mfgPN',
      width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
      displayName: vm.LabelConstant.MFG.MFGPN,
      cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link ng-if="row.entity.partID" \
                            component-id="row.entity.partID" \
                            label="grid.appScope.$parent.vm.LabelConstant.MFG.MFGPN" \
                            value="row.entity.mfgPN" \
                            is-copy="true" \
                            is-custom-part="row.entity.isCustom"\
                            rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.rohsIcon" \
                            rohs-status="row.entity.rohsName" \
                            is-search-digi-key="true"></common-pid-code-label-link></div>'
    }, {
      field: 'count',
      width: '150',
      displayName: 'Count',
      cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{row.entity.uomClassID === grid.appScope.$parent.vm.MEASUREMENT_TYPES_COUNT.ID ? (COL_FIELD)  : (COL_FIELD | unit)}}</div>'
    }, {
      field: 'unit',
      displayName: 'Unit',
      width: 150,
      cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{row.entity.uomClassID === grid.appScope.$parent.vm.MEASUREMENT_TYPES_COUNT.ID ? (COL_FIELD)  : (COL_FIELD | unit)}}</div>'
    }, {
      field: 'uomName',
      displayName: 'UOM',
      width: 100,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
    }, {
      field: 'description',
      width: '300',
      displayName: 'Description',
      cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>'
    }, {
      field: 'updatedAt',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
      type: 'datetime',
      enableFiltering: false
    }, {
      field: 'updatedby',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
      type: 'StringEquals',
      enableFiltering: true
    }, {
      field: 'updatedbyRole',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
      type: 'StringEquals',
      enableFiltering: true
    }, {
      field: 'createdAt',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
      type: 'datetime',
      enableFiltering: false
      },
      {
        field: 'createdby',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        type: 'StringEquals',
        enableFiltering: true
      },
      {
        field: 'createdbyRole',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }];

    /* retrieve reserve stock request list*/
    vm.loadData = () => {
      if (vm.pagingInfo.SortColumns.length === 0) {
        vm.pagingInfo.SortColumns = [['transactionDate', 'DESC']];
      }

      vm.cgBusyLoading = ReserveStockRequestFactory.getRequestList(vm.pagingInfo).query().$promise.then((response) => {
        vm.sourceData = [];
        if (response.data) {
          vm.sourceData = response.data.stockRequestList;
          vm.totalSourceDataCount = response.data.Count;
        }

        if (!vm.gridOptions.enablePaging) {
          vm.currentdata = vm.sourceData.length;
          vm.gridOptions.gridApi.infiniteScroll.resetScroll();
        }
        vm.gridOptions.clearSelectedRows();
        if (vm.totalSourceDataCount === 0) {
          if (vm.pagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode) || !_.isEmpty(vm.pagingInfo.chequeNumber)) {
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
          vm.resetSourceGrid();
          if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
          }
        });
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = ReserveStockRequestFactory.getRequestList(vm.pagingInfo).query().$promise.then((response) => {
        vm.sourceData = vm.sourceData.concat(response.data.stockRequestList);
        vm.totalSourceDataCount = response.data.Count;
        vm.currentdata = vm.sourceData.length;
        vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
        $timeout(() => {
          vm.resetSourceGrid();
          return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount !== vm.currentdata ? true : false);
        });
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.updateRecord = (row) => {
      vm.addReserveStockRequest({ id: row.entity.id });
    };

    vm.addReserveStockRequest = (requestDet) => {
      DialogFactory.dialogService(
        TRANSACTION.RESERVE_STOCK_REQUEST_POPUP_CONTROLLER,
        TRANSACTION.RESERVE_STOCK_REQUEST_POPUP_VIEW,
        event,
        requestDet).then((response) => {
          if (response) {
            vm.loadData();
          }
        }, (err) => BaseService.getErrorLog(err));
    };


    /* delete request list*/
    vm.deleteRecord = (requestList) => {
      let selectedIDs = [];
      if (requestList) {
        selectedIDs.push(requestList.id);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((item) => item.id);
        }
      }
      if (selectedIDs) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Reserve Stock Request', selectedIDs.length);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        const objIDs = {
          id: selectedIDs
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.cgBusyLoading = ReserveStockRequestFactory.deleteRequest().query({ objIDs: objIDs }).$promise.then((res) => {
              if (res && res.data) {
                //if (res.data.TotalCount && res.data.TotalCount > 0) {
                //    BaseService.deleteAlertMessage(res.data);
                //} else {
                BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                //  }
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
  }
})();
