(function () {
  'use strict';

  angular
    .module('app.transaction.warehousebin')
    .controller('WarehouseController', WarehouseController);

  function WarehouseController($mdDialog, $rootScope, $timeout, $state, $stateParams, $scope, $q, CORE, USER, TRANSACTION, DialogFactory, BaseService, WarehouseBinFactory, ReceivingMaterialFactory, TransferStockFactory, socketConnectionService) {
    const vm = this;
    vm.cartType = TRANSACTION.warehouseType;
    vm.smartCartStatus = TRANSACTION.smartCartStatus;
    vm.default = 'All';
    vm.WarehouseType = vm.default;
    vm.smartCartStatusDetail = vm.default;
    vm.CustomSearchTypeForList = CORE.CustomSearchTypeForList;
    vm.searchType = vm.CustomSearchTypeForList.Contains;
    vm.isUpdatable = true;
    vm.isAudit = true;
    vm.IsWarehouse = true;
    vm.isNoDataFound = false;
    vm.StatusOptionsGridHeaderDropdown = CORE.StatusOptionsGridHeaderDropdown;
    vm.KeywordStatusGridHeaderDropdown = CORE.KeywordStatusGridHeaderDropdown;
    vm.UserAccessModeGridHeaderDropdown = CORE.UserAccessModeGridHeaderDropdown;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.WAREHOUSE;
    vm.DefaultDateFormat = _dateTimeDisplayFormat;
    vm.gridConfig = CORE.gridConfig;
    vm.LabelConstant = CORE.LabelConstant;
    vm.showUMIDHistory = true;
    vm.actionButtonName = 'Warehouse History';
    vm.isPrinted = true;
    vm.isWarehouseTransfer = true;
    vm.isWHToWHTransfer = true;
    vm.offlineSmartCartCount = 0;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;

    // init pagination details
    const initPageInfo = () => {
      if ($stateParams.warehousetype) {
        vm.WarehouseType = null;
        const searchState = angular.copy($stateParams.warehousetype.replace(' ', ''));
        if (searchState === vm.cartType.SmartCart.value.replace(' ', '')) {
          vm.WarehouseType = vm.cartType.SmartCart.key;
        }
        else if (searchState === vm.cartType.ShelvingCart.value.replace(' ', '')) {
          vm.WarehouseType = vm.cartType.ShelvingCart.key;
        }
        else if (searchState === vm.cartType.Equipment.value.replace(' ', '')) {
          vm.WarehouseType = vm.cartType.Equipment.key;
        }
        else {
          $state.transitionTo($state.$current, { warehousetype: '' }, {
            location: true,
            inherit: true,
            notify: false
          });
        }
      }
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['isDepartment', 'DESC']],
        SearchColumns: [],
        pageName: CORE.PAGENAME_CONSTANT[18].PageName,
        isPrint: true
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
      allowToExportAllData: true,
      exporterCsvFilename: vm.IsWarehouse ? 'Warehouse.csv' : 'Bin.csv',
      exporterAllDataFn: () => {
        const pagingInfoOld = _.clone(vm.pagingInfo);
        pagingInfoOld.pageSize = 0;
        pagingInfoOld.Page = 1;
        vm.gridOptions.isExport = pagingInfoOld.isExport = true;
        return WarehouseBinFactory.retriveWarehouseList().query(pagingInfoOld).$promise.then((response) => {
          if (response.data && response.data.warehouse) {
            return response.data.warehouse;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    /*call source header in function so manufacure list can bind and append in header filter*/
    vm.sourceHeader = [{
      field: 'Action',
      cellClass: 'layout-align-start-center',
      displayName: 'Action',
      width: '270',
      cellTemplate: '<grid-action-view grid="grid" row="row" number-of-action-button="8" row-entity="row.entity"></grid-action-view>',
      enableFiltering: false,
      enableSorting: false,
      exporterSuppressExport: true,
      pinnedLeft: true
    }, {
      field: '#',
      width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
      cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
      enableFiltering: false,
      enableSorting: false,
      allowCellFocus: false,
      pinnedLeft: true
    }, {
      field: 'warehouseTypeValue',
      displayName: 'Warehouse Type',
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center" ng-if="row.entity.warehouseType">'
        + '<span class="label-box" \
                        ng-class="{\'label-warning\':row.entity.warehouseType == grid.appScope.$parent.vm.cartType.SmartCart.key,\
                        \'label-info\':row.entity.warehouseType == grid.appScope.$parent.vm.cartType.ShelvingCart.key,\
                        \'label-primary\':row.entity.warehouseType == grid.appScope.$parent.vm.cartType.Equipment.key}"> \
                            {{COL_FIELD}}'
        + '</span>'
        + '</div>',
      width: '140',
      allowCellFocus: false,
      enableFiltering: false
    }, {
      field: 'Name',
      width: '250',
      displayName: 'Warehouse Name',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
    },
    {
      field: 'leftSideWHLabel',
      width: '150',
      displayName: 'Side 1',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
    },
    {
      field: 'rightSideWHLabel',
      width: '150',
      displayName: 'Side 2',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
    },
    {
      field: 'nickname',
      width: '150',
      displayName: 'Nickname',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
    }, {
      field: 'parentWarehouseName',
      width: '200',
      displayName: 'Parent Warehouse',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
    }, {
      field: 'Description',
      width: '300',
      displayName: 'Description',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
    }, {
      field: 'uniqueCartID',
      width: '130',
      displayName: 'Unique Cart Id',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
    }, {
      field: 'domain',
      width: '130',
      displayName: 'Domain',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
    }, {
      field: 'cartMfr',
      width: '130',
      displayName: 'Cart Manufacturer',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
    }, {
      field: 'cartMachineName',
      width: '130',
      displayName: 'Cart Machine Name',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
    }, {
      field: 'equipmentName',
      width: '110',
      displayName: 'Equipment',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
    }, {
      field: 'slotCount',
      width: '115',
      displayName: 'Total Slot in Cart',
      cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="row.entity.ID > 0">' +
        '<span ng-if="row.entity.slotCount && row.entity.slotCount > 0">' +
        '<a tabindex="-1" class="text-underline cursor-pointer" ng-click="grid.appScope.$parent.vm.goToBin(row.entity)">{{ COL_FIELD | numberWithoutDecimal }}</a>' +
        '</span>' +
        '<span ng-if="!row.entity.slotCount || row.entity.slotCount <= 0">{{ COL_FIELD | numberWithoutDecimal }}</span>' +
        '</div>'
    }, {
      field: 'isActiveConvertedValue',
      displayName: 'Status',
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
        + '<span class="label-box" \
                        ng-class="{\'label-success\':row.entity.isActive == true ,\
                        \'label-warning\':row.entity.isActive == false }"> \
                            {{COL_FIELD}}'
        + '</span>'
        + '</div>',
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        term: null,
        options: vm.StatusOptionsGridHeaderDropdown
      },
      width: '90',
      ColumnDataType: 'StringEquals',
      enableFiltering: true,
      enableSorting: false
    }, {
      field: 'parentConvertedValue',
      displayName: 'Permanent Warehouse',
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
        + '<span class="label-box" \
                                        ng-class="{\'label-success\':row.entity.isPermanentWH == true,\
                                        \'label-warning\':row.entity.isPermanentWH == false }"> \
                                            {{COL_FIELD}}'
        + '</span>'
        + '</div>',
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        term: null,
        options: vm.KeywordStatusGridHeaderDropdown
      },
      ColumnDataType: 'StringEquals',
      enableFiltering: true,
      enableSorting: false,
      width: '115'
    }, {
      field: 'allMovableBinConvertValue',
      displayName: 'Movable Bin/Slot',
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
        + '<span ng-if="row.entity.allMovableBin != null" class="label-box" \
                                        ng-class="{\'label-success\':row.entity.allMovableBin == true,\
                                        \'label-warning\':row.entity.allMovableBin == false }"> \
                                            {{COL_FIELD}}'
        + '</span>'
        + '</div>',
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        term: null,
        options: vm.KeywordStatusGridHeaderDropdown
      },
      ColumnDataType: 'StringEquals',
      enableFiltering: true,
      enableSorting: false,
      width: '95'
    }, {
      field: 'systemGeneratedConvertedValue',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_SYSTEM_GENERATED,
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
        + '<span class="label-box" \
                              ng-class="{\'label-success\':row.entity.systemGenerated == true,\
                              \'label-warning\':row.entity.systemGenerated == false }"> \
                                  {{COL_FIELD}}'
        + '</span>'
        + '</div>',
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        term: null,
        options: vm.KeywordStatusGridHeaderDropdown
      },
      ColumnDataType: 'StringEquals',
      enableFiltering: true,
      width: '115'
    },
    {
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
    vm.scanSearchKey = ($event) => {
      $timeout(() => {
        if ($event.keyCode === 13) {
          vm.advanceFilterSearch();
        }
      });
    };

    vm.advanceFilterSearch = () => {
      const queryStr = angular.copy(vm.WarehouseType);
      if (queryStr) {
        $state.transitionTo($state.$current, { warehousetype: queryStr === 'All' ? '' : queryStr.replace(' ', '') }, {
          location: true,
          inherit: true,
          notify: false
        });
      }
      vm.pagingInfo.Page = vm.gridOptions.paginationCurrentPage = CORE.UIGrid.Page();
      vm.loadData();
    };

    vm.resetNameUniqueCartId = () => {
      $state.transitionTo($state.$current, { warehousetype: '' }, {
        location: true,
        inherit: true,
        notify: false
      });
      vm.searchNameUniqueCartId = null;
      vm.pagingInfo.SearchColumns = [];
      vm.WarehouseType = vm.default;
      vm.smartCartStatusDetail = vm.default;
      vm.isEmptyWarehouse = false;
      vm.searchType = CORE.CustomSearchTypeForList.Contains;
      BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
    };

    function genSearch() {
      // vm.pagingInfo.Page = CORE.UIGrid.Page();
      if (vm.WarehouseType) {
        if (vm.WarehouseType === vm.default) {
          const searchObjIndex = _.findIndex(vm.pagingInfo.SearchColumns, { ColumnName: 'warehouseType' });
          if (searchObjIndex !== -1) {
            vm.pagingInfo.SearchColumns.splice(searchObjIndex, 1);
          }
        }
        else {
          vm.pagingInfo.SearchColumns.push({ ColumnName: 'warehouseType', SearchString: vm.WarehouseType, ColumnDataType: 'StringEquals' });
        }
      }
      if (vm.WarehouseType === vm.cartType.SmartCart.key) {
        if (vm.smartCartStatusDetail === vm.default) {
          const searchObjIndexSmartCart = _.findIndex(vm.pagingInfo.SearchColumns, { ColumnName: 'isCartOnline' });
          if (searchObjIndexSmartCart !== -1) {
            vm.pagingInfo.SearchColumns.splice(searchObjIndexSmartCart, 1);
          }
        } else {
          vm.pagingInfo.SearchColumns.push({ ColumnName: 'isCartOnline', SearchString: vm.smartCartStatusDetail, ColumnDataType: 'StringEquals' });
        }
      }
      if (vm.searchNameUniqueCartId) {
        let columnDataType = null;
        if (vm.searchType === CORE.CustomSearchTypeForList.Exact) {
          columnDataType = 'StringEquals';
        }

        const itemIndexName = _.findIndex(vm.pagingInfo.SearchColumns, { ColumnName: 'warehouseName' });
        if (itemIndexName !== -1) {
          vm.pagingInfo.SearchColumns.splice(itemIndexName, 1);
        }

        const itemIndexNickname = _.findIndex(vm.pagingInfo.SearchColumns, { ColumnName: 'nickname' });
        if (itemIndexNickname !== -1) {
          vm.pagingInfo.SearchColumns.splice(itemIndexNickname, 1);
        }

        const itemIndexUniqueCartID = _.findIndex(vm.pagingInfo.SearchColumns, { ColumnName: 'uniqueCartID' });
        if (itemIndexUniqueCartID !== -1) {
          vm.pagingInfo.SearchColumns.splice(itemIndexUniqueCartID, 1);
        }

        vm.pagingInfo.SearchColumns.push({ ColumnName: 'Name', SearchString: vm.searchNameUniqueCartId, ColumnDataType: columnDataType, isExternalSearch: true });
        vm.pagingInfo.SearchColumns.push({ ColumnName: 'nickname', SearchString: vm.searchNameUniqueCartId, ColumnDataType: columnDataType, isExternalSearch: true });
        vm.pagingInfo.SearchColumns.push({ ColumnName: 'uniqueCartID', SearchString: vm.searchNameUniqueCartId, ColumnDataType: columnDataType, isExternalSearch: true });
      }
      if (vm.isEmptyWarehouse) {
        vm.pagingInfo.SearchColumns.push({ ColumnName: 'slotCount', SearchString: 0, ColumnDataType: 'StringEquals' });
      } else {
        const searchObjEmptyWarehouse = _.findIndex(vm.pagingInfo.SearchColumns, { ColumnName: 'slotCount' });
        if (searchObjEmptyWarehouse !== -1) {
          vm.pagingInfo.SearchColumns.splice(searchObjEmptyWarehouse, 1);
        }
      }
    }

    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICall = (warehouses, isGetDataDown, isResetPagination) => {
      if (warehouses && warehouses.data && warehouses.data.warehouse) {
        if (!isGetDataDown) {
          vm.sourceData = warehouses.data.warehouse;
          vm.currentdata = vm.sourceData.length;
        }
        else if (warehouses.data.warehouse.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(warehouses.data.warehouse);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        // must set after new data comes
        vm.totalSourceDataCount = vm.gridOptions.totalItems = warehouses.data.Count;
        processWarehouse();
        if (!vm.gridOptions.enablePaging) {
          if (!isGetDataDown && isResetPagination) {
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
            if ($scope.$parent.vm) {
              $scope.$parent.vm.isFoundAnyWarehouse = true;
            }
          }
          else {
            vm.isNoDataFound = true;
            vm.emptyState = null;
            if ($scope.$parent.vm) {
              $scope.$parent.vm.isFoundAnyWarehouse = false;
            }
          }
        }
        else {
          vm.isNoDataFound = false;
          vm.emptyState = null;
          if ($scope.$parent.vm) {
            $scope.$parent.vm.isFoundAnyWarehouse = true;
          }
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

    /*get list of warehouse having manufacture type 'MFG' */
    vm.loadData = (pagingInfo, isResetPagination) => {
      genSearch();
      const originalPageSize = vm.pagingInfo.pageSize;
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions, isResetPagination);
      if (vm.pagingInfo.SortColumns.length === 0) {
        vm.pagingInfo.SortColumns = [['isDepartment', 'DESC']];
      }
      vm.pagingInfo.IsWarehouse = vm.IsWarehouse;
      vm.cgBusyLoading = WarehouseBinFactory.retriveWarehouseList().query(vm.pagingInfo).$promise.then((warehouses) => {
        if (isResetPagination === false) {
          vm.pagingInfo.pageSize = originalPageSize;
        }
        if (warehouses && warehouses.data) {
          setDataAfterGetAPICall(warehouses, false, isResetPagination);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* update warehouse*/
    vm.updateRecord = (row, ev) => {
      row.entity.generateWarehouse = false;
      DialogFactory.dialogService(
        TRANSACTION.TRANSACTION_MANAGEWAREHOUSE_CONTROLLER,
        TRANSACTION.TRANSACTION_MANAGEWAREHOUSE_VIEW,
        ev,
        row.entity).then(() => {
        }, (data) => {
          if (data) {
            vm.loadData(vm.pagingInfo, false);
          }
        },
          (err) => BaseService.getErrorLog(err));
    };

    /* add warehouse*/


    /* delete warehouse*/
    vm.deleteRecord = (warehouse) => {
      let selectedIDs = [];
      if (warehouse) {
        selectedIDs.push(warehouse.ID);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((warehouseitem) => warehouseitem.ID);
        }
      }
      if (selectedIDs) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Warehouse', selectedIDs.length);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        const objIDs = {
          id: selectedIDs,
          CountList: false
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.cgBusyLoading = WarehouseBinFactory.deleteWarehouse().query({ objIDs: objIDs }).$promise.then((res) => {
              if (res && res.data) {
                if (res.data.length > 0 || res.data.transactionDetails) {
                  const data = {
                    TotalCount: res.data.transactionDetails[0].TotalCount,
                    pageName: CORE.PageName.warehouse
                  };
                  BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                    const IDs = {
                      id: selectedIDs,
                      CountList: true
                    };
                    return WarehouseBinFactory.deleteWarehouse().query({
                      objIDs: IDs
                    }).$promise.then((res) => {
                      let data = {};
                      data = res.data;
                      data.pageTitle = warehouse ? warehouse.Name : null;
                      data.PageName = CORE.PageName.warehouse;
                      data.selectedIDs = stringFormat('{0}{1}', selectedIDs.length, ' Selected');
                      if (res.data) {
                        DialogFactory.dialogService(
                          USER.ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER,
                          USER.ADMIN_SHOW_TRANSACTION_DETAILS_VIEW,
                          ev,
                          data).then(() => {
                          }, () => {
                          });
                      }
                    }).catch((error) => BaseService.getErrorLog(error));
                  });
                }
                else {
                  BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                  vm.gridOptions.clearSelectedRows();
                }
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    /* delete multiple data called from directive of ui-grid*/
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };

    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = WarehouseBinFactory.retriveWarehouseList().query(vm.pagingInfo).$promise.then((warehouses) => {
        if (warehouses && warehouses.data) {
          setDataAfterGetAPICall(warehouses, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    $rootScope.$on('WarehouseEvent', () => {
      vm.loadData(vm.pagingInfo, false);
    });

    vm.addEditRecordWarehouse = (data, ev) => {
      DialogFactory.dialogService(
        TRANSACTION.TRANSACTION_MANAGEWAREHOUSE_CONTROLLER,
        TRANSACTION.TRANSACTION_MANAGEWAREHOUSE_VIEW,
        ev,
        data).then(() => {
        }, () => {
        },
          (err) => BaseService.getErrorLog(err));
    };

    //multiple prints
    $scope.$on('PrintDocument', (ev, data) => {
      $scope.PrintDocument(data.data, data.ev);
    });

    vm.printRecord = (row, ev) => {
      $scope.PrintDocument(row, ev);
    };

    $scope.PrintDocument = (row) => {
      vm.rowData = {};
      if (row && row.entity) {
        vm.rowData = row.entity;
      } else {
        vm.rowData.selectedRecord = row;
      }
      vm.rowData.pageName = TRANSACTION.TRANSACTION_WAREHOUSE_LABEL;
      DialogFactory.dialogService(
        CORE.PRINT_BARCODE_LABEL_MODAL_CONTROLLER,
        CORE.PRINT_BARCODE_LABEL_MODAL_VIEW,
        event,
        vm.rowData).then(() => {
        }, (printerDetailList) => {
          if (printerDetailList) {
            const printList = [];
            let printObj;
            _.each(printerDetailList, (data) => {
              printObj = {
                'warehouseName': data.warehouseName,
                'count': 1,
                'reqName': 'Print',
                'numberOfPrint': data.noPrint,
                'PrinterName': data.PrinterName,
                'ServiceName': data.ServiceName,
                'printType': data.printType,
                'pageName': TRANSACTION.TRANSACTION_WAREHOUSE_LABEL
              };
              printList.push(printObj);
            });
            vm.cgBusyLoading = ReceivingMaterialFactory.printLabelTemplate().query({ printObj: printList }).$promise.then(() => {
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    /**
     * Send request to check cart status
     * @param {any} row
     */
    vm.showLight = (row) => {
      row.entity.isCartOnline = false;
      vm.cgBusyLoading = WarehouseBinFactory.sendRequestToCheckCartStatus().query({
        TransactionID: getGUID(),
        TowerID: row.entity.uniqueCartID
      }).$promise.then(() => {
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // [S] Socket Listeners
    function connectSocket() {
      socketConnectionService.on(CORE.Socket_IO_Events.InoAuto.updateCartStatus, updateCartStatus);
    }
    connectSocket();

    socketConnectionService.on('reconnect', () => {
      connectSocket();
    });
    function removeSocketListener() {
      socketConnectionService.removeListener(CORE.Socket_IO_Events.InoAuto.updateCartStatus, updateCartStatus);
    }

    $scope.$on('$destroy', () => {
      // Remove socket listeners
      removeSocketListener();
    });

    // on disconnect socket
    socketConnectionService.on('disconnect', () => {
      removeSocketListener();
    });
    /**
     * Update cart status online/offline in grid
     * @param {any} response
     */
    function updateCartStatus(response) {
      // console.log('receive', response, new Date());

      if (response) {
        $scope.$applyAsync(() => {
          _.each(response.cartList, (item) => {
            var cartDetail = _.find(vm.sourceData, { uniqueCartID: item.uniqueCartID });
            if (cartDetail) {
              cartDetail.isCartOnline = item.isCartOnline;
              cartDetail.isActive = true;
              cartDetail.isActiveStatus = (cartDetail.isActive) ? 'Active' : 'Inactive';
            }
          });

          if (!response.requestForSingleCart) {
            const uniqueCartIDs = _.map(response.cartList, 'uniqueCartID');
            const offlineCarts = _.filter(vm.sourceData, (item) => (uniqueCartIDs.indexOf(item.uniqueCartID) === -1 && item.warehouseType === vm.cartType.SmartCart.key));
            _.map(offlineCarts, (cart) => {
              cart.isCartOnline = false;
            });
          }
        });
      }
    }
    //to generate bin from action menu
    vm.generateBin = (row, ev) => {
      DialogFactory.dialogService(
        TRANSACTION.TRANSACTION_BIN_ADD_UPDATE_MODAL_CONTROLLER,
        TRANSACTION.TRANSACTION_BIN_ADD_UPDATE_MODAL_VIEW,
        ev,
        row.entity).then(() => {
        }, (data) => {
          if (data) {
            vm.loadData(vm.pagingInfo, false);
          }
        }, () => {
        },
          (err) => BaseService.getErrorLog(err));
    };
    //to show history of warehouse
    vm.UMIDHistory = (row) => {
      const WarehouseDet = {
        id: row.ID
      };
      DialogFactory.dialogService(
        CORE.WAREHOUSE_HISTORY_MODAL_CONTROLLER,
        CORE.WAREHOUSE_HISTORY_MODAL_VIEW,
        event,
        WarehouseDet).then(() => {

        }, (err) => BaseService.getErrorLog(err));
    };
    vm.transferWarehouse = (row) => {
      const parameters = {
        paramSearchWHId: row.ID,
        deptID: row.parentWHID
      };
      vm.cgBusyLoading = TransferStockFactory.getActiveWarehouse().query(parameters).$promise.then((response) => {
        if (response.data) {
          const warehouseDetail = response.data.warehouseList ? response.data.warehouseList[0] : [];
          warehouseDetail.transferSection = CORE.TransferSection.WH;
          warehouseDetail.transferLabel = CORE.TransferLabel.TransferFrom;
          warehouseDetail.otherKitName = _.map(BaseService.generateRedirectLinkForKit(warehouseDetail.kitName)).join(', '); // kitName.length > 0 ? _.map(kitName).join(', ') : '';
          const transferItemDet = {
            transferItem: warehouseDetail,
            transferTo: CORE.TransferSection.WH,
            fromWHID: warehouseDetail.id,
            transType: CORE.UMID_History.Trasaction_Type.WH_Dept_Transfer,
            isCheckMismatchInventory: false,
            mismatchInventoryData: {
              whDetail: warehouseDetail,
              currentKit: null,
              salesOrderDetail: null
            },
            transferFromDept: { ID: warehouseDetail.parentWHID },
            transferToDept: null,
            transferOption: CORE.TrasferStockType.StockTransferToOtherDept,
            actionPerformed: stringFormat('{0} ({1}: {2})', CORE.UMID_History.Action_Performed.TransferMaterial, CORE.UMID_History.Trasaction_Type.WithinDept, CORE.UMID_History.Trasaction_Type.OtherDept)
          };
          DialogFactory.dialogService(
            CORE.TRANSFER_WAREHOUSE_BIN_MODAL_CONTROLLER,
            CORE.TRANSFER_WAREHOUSE_BIN_MODAL_VIEW,
            event,
            transferItemDet).then((response) => {
              if (response) {
                vm.loadData(vm.pagingInfo, false);
              }
            }, (err) => BaseService.getErrorLog(err));
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    vm.transferWarehouseToWarehouse = (row) => {
      const parameters = {
        paramSearchWHId: row.ID,
        deptID: row.parentWHID
      };
      vm.cgBusyLoading = TransferStockFactory.getActiveWarehouse().query(parameters).$promise.then((response) => {
        if (response.data) {
          const warehouseDetail = response.data.warehouseList ? response.data.warehouseList[0] : [];
          warehouseDetail.transferSection = CORE.TransferSection.WH;
          warehouseDetail.transferLabel = CORE.TransferLabel.TransferFrom;
          warehouseDetail.otherKitName = _.map(BaseService.generateRedirectLinkForKit(warehouseDetail.kitName)).join(', ');
          const transferItemDet = {
            transferItem: warehouseDetail,
            transferTo: CORE.TransferSection.WH,
            fromWHID: warehouseDetail.id,
            transType: CORE.UMID_History.Trasaction_Type.WH_WH_Transfer,
            isCheckMismatchInventory: false,
            mismatchInventoryData: {
              whDetail: warehouseDetail,
              currentKit: null,
              salesOrderDetail: null
            },
            transferFromDept: { ID: warehouseDetail.parentWHID },
            transferToDept: null,
            transferOption: null,
            actionPerformed: stringFormat('{0} ({1}: {2})', CORE.UMID_History.Action_Performed.TransferMaterial, CORE.UMID_History.Trasaction_Type.WithinDept, CORE.UMID_History.Trasaction_Type.OtherDept)
          };
          DialogFactory.dialogService(
            CORE.TRANSFER_WAREHOUSE_BIN_MODAL_CONTROLLER,
            CORE.TRANSFER_WAREHOUSE_BIN_MODAL_VIEW,
            event,
            transferItemDet).then((response) => {
              if (response) {
                vm.loadData(vm.pagingInfo, false);
              }
            }, (err) => BaseService.getErrorLog(err));
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const processWarehouse = () => {
      _.map(vm.sourceData, (item) => {
        item.isActiveStatus = (item.isActive) ? 'Active' : 'Inactive';
        item.isGenerateBin = true;
        if (item.isDepartment || item.systemGenerated) {
          item.isDisabledUpdate = true;
          item.isDisabledDelete = true;
          item.isRowSelectable = false;
          item.isSystemGenerated = true;
          item.isGenerateBin = false;
          item.isDisabledUMIDHistory = true;
        }
        if (!item.isActive) {
          item.isDisabledGenerateBin = true;
        }
        if (item.warehouseType === vm.cartType.SmartCart.key) {
          item.isDisabledShowLight = false;
          //if (item.isCartOnline)
          //  item.isCartActive = true;
          //else
          //  item.isCartActive = false;
        } else {
          item.isDisabledShowLight = true;
        }

        item.isShowLight = (item.warehouseType === vm.cartType.SmartCart.key);
      });
      vm.offlineSmartCartCount = _.filter(vm.sourceData, (item) => (!item.isCartOnline && item.warehouseType === vm.cartType.SmartCart.key)).length;
    };
    vm.goToBin = (row) => {
      if (row) {
        BaseService.openInNew(TRANSACTION.TRANSACTION_BIN_STATE, { warehouseId: row.ID });
      }
    };
    vm.changeCart = () => {
      if (vm.smartCartStatusDetail !== vm.default) {
        vm.WarehouseType = vm.cartType.SmartCart.key;
      }
    };
    vm.changeCartType = () => {
      if (vm.WarehouseType !== vm.cartType.SmartCart.key) {
        vm.smartCartStatusDetail = vm.default;
      }
    };
    // Make all cart off-line while hit check cart status button
    $rootScope.$on('checkCartStatus', () => {
      _.map(vm.sourceData, (item) => {
        item.isCartOnline = false;
      });
    });
  }
})();
