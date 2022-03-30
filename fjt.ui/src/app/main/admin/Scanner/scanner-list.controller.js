(function () {
  'use strict';

  angular
    .module('app.admin.scanner')
    .controller('ScannerListController', ScannerListController);

  /** @ngInject */
  function ScannerListController($mdDialog, $scope, $q, $timeout, CORE, USER, ScannerFactory, DialogFactory, BaseService) {
    const vm = this;
    vm.isUpdatable = true;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.SCANNER;
    vm.StatusOptionsGridHeaderDropdown = CORE.StatusOptionsGridHeaderDropdown;
    vm.gridConfig = CORE.gridConfig;
    vm.LabelConstant = CORE.LabelConstant;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;

    vm.sourceHeader = [{
      field: 'Action',
      cellClass: 'gridCellColor',
      displayName: 'Action',
      width: '80',
      cellTemplate: '<grid-action-view grid="grid" row="row"></grid-action-view>',
      enableFiltering: false,
      enableSorting: false,
      exporterSuppressExport: true,
      pinnedLeft: true,
      enableCellEdit: false
    }, {
      field: '#',
      width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
      cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
      enableFiltering: false,
      enableSorting: false,
      enableCellEdit: false
    }, {
      field: 'ipAddress',
      width: '200',
      displayName: 'IP Address',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      enableCellEdit: false
    }, {
      field: 'nodename',
      width: '200',
      displayName: 'Host Name',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      enableCellEdit: false
    }, {
      field: 'usbModelName',
      width: '200',
      displayName: 'Model Name (For USB Configuration)',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      enableCellEdit: false
    }, {
      field: 'macAddress',
      width: '200',
      displayName: 'MAC Address',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      enableFiltering: true,
      enableSorting: true
    }, {
      field: 'make',
      width: '150',
      displayName: 'Make',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      enableCellEdit: false
    }, {
      field: 'model',
      width: '150',
      displayName: 'Model',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      enableCellEdit: false
    }, {
      field: 'version',
      width: '100',
      displayName: 'Version',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      enableFiltering: true,
      enableSorting: true
    }, {
      field: 'location',
      width: '150',
      displayName: 'Location',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      enableFiltering: true,
      enableSorting: true
    }, {
      field: 'isActiveConvertedValue',
      width: '120',
      displayName: 'Status',
      cellTemplate: '<div class="ui-grid-cell-contents">'
        + '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.isActive == true, \
                            \'label-warning\':row.entity.isActive == false}"> \
                                {{ COL_FIELD }}'
        + '</span>'
        + '</div>',
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        term: null,
        options: vm.StatusOptionsGridHeaderDropdown
      },
      enableCellEdit: false,
      ColumnDataType: 'StringEquals'
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

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['ipAddress', 'ASC']],
        SearchColumns: []
      };
    };
    initPageInfo();
    vm.gridOptions = {
      enablePaging: isEnablePagination,
      enablePaginationControls: isEnablePagination,
      showColumnFooter: false,
      enableRowHeaderSelection: true,
      enableFullRowSelection: false,
      enableRowSelection: true,
      multiSelect: true,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: 'Scanner.csv'
    };

    function setDataAfterGetAPICall(scanner, isGetDataDown) {
      if (scanner && scanner.data.scanner) {
        if (!isGetDataDown) {
          vm.sourceData = scanner.data.scanner;
          vm.currentdata = vm.sourceData.length;
        }
        else if (scanner.data.scanner.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(scanner.data.scanner);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        if (vm.sourceData && vm.sourceData.length > 0) {
          vm.sourceData.map((item) => {
            item.isActiveStatus = (item.isActive) ? 'Active' : 'Inactive';
          });
        }
        // must set after new data comes
        vm.totalSourceDataCount = scanner.data.Count;
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
          if (vm.pagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
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
    }

    //get defect category data for grid bind
    vm.loadData = () => {
      if (vm.pagingInfo.SortColumns.length === 0) {
        vm.pagingInfo.SortColumns = [['ipAddress', 'ASC']];
      }
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = ScannerFactory.retrieveScannerList().query(vm.pagingInfo).$promise.then((scanner) => {
        if (scanner.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          if (scanner) {
            setDataAfterGetAPICall(scanner, false);
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //get data down
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = ScannerFactory.retrieveScannerList().query(vm.pagingInfo).$promise.then((scanner) => {
        setDataAfterGetAPICall(scanner, true);
      }).catch((error) => BaseService.getErrorLog(error));
    };
    /* add.edit defect category*/
    vm.addEditRecord = (data, ev) => {
      DialogFactory.dialogService(
        USER.SCANNER_ADD_UPDATE_MODAL_CONTROLLER,
        USER.SCANNER_ADD_UPDATE_MODAL_VIEW,
        ev,
        data).then(() => {
          BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
        }, (err) => BaseService.getErrorLog(err));
    };
    /* update defect category*/
    vm.updateRecord = (row, ev) => {
      vm.addEditRecord(row.entity, ev);
    };
    //close popup on page destroy
    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, { closeAll: true });
    });
    vm.deleteRecord = (scanner) => {
      let selectedIDs = [];
      if (scanner) {
        selectedIDs.push(scanner.id);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((scanneritem) => scanneritem.id);
        }
      }
      if (selectedIDs) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Scanner', selectedIDs.length);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };

        const objDelete = {
          id: selectedIDs
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            if (yes) {
              vm.cgBusyLoading = ScannerFactory.deleteScanner().query({
                objDelete: objDelete
              }).$promise.then(() => {
                BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                vm.gridOptions.clearSelectedRows();
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    /* delete multiple data called from directive of ui-grid*/
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };
    //refresh scanner
    vm.refreshScannner = () => {
      vm.loadData();
    };
  }
})();
