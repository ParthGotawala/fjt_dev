(function () {
  'use strict';
  angular
    .module('app.transaction.rack')
    .controller('RackController', RackController);

  function RackController($scope, $timeout, TRANSACTION, USER, CORE, RackFactory, BaseService, DialogFactory, ReceivingMaterialFactory) {
    const vm = this;

    vm.isUpdatable = true;
    vm.gridConfig = CORE.gridConfig;
    vm.LabelConstant = CORE.LabelConstant;
    vm.StatusOptionsGridHeaderDropdown = CORE.StatusOptionsGridHeaderDropdown;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.RACK;
    vm.rackOPStatusOptions = CORE.RackTransactionType;
    vm.actionButtonName = 'View Rack History';
    vm.showUMIDHistory = true;
    vm.rackOPStatusValue = vm.rackOPStatusOptions[0].Value;
    vm.wiprack = true;
    vm.completedRack = true;
    vm.isPrinted = true;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;

    vm.RackOPStatusFilter = () => {
      if (vm.emptyRack && vm.wiprack && vm.completedRack) {
        vm.allRack = true;
      } else {
        vm.allRack = false;
      }
      vm.pagingInfo.Page = vm.gridOptions.paginationCurrentPage = CORE.UIGrid.Page();
      vm.loadData();
    };

    vm.sourceHeader = [
      {
        field: 'Action',
        cellClass: 'gridCellColor',
        displayName: 'Action',
        width: '110',
        cellTemplate: '<grid-action-view grid="grid" row="row"></grid-action-view>',
        enableFiltering: false,
        enableSorting: false,
        exporterSuppressExport: true,
        pinnedLeft: true,
        enableCellEdit: false
      },
      {
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
        enableFiltering: false,
        enableSorting: false,
        enableCellEdit: false,
        pinnedLeft: true
      },
      {
        field: 'name',
        width: '250',
        displayName: 'Name',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
      },
      {
        field: 'woNumber',
        width: '80',
        displayName: 'WO#',
        cellTemplate: '<div class="ui-grid-cell-contents text-left"><span ng-if="row.entity.woID">\
                                        <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToworkOrder(row.entity.woID);$event.preventDefault();">{{row.entity.woNumber}}</a>\
                                    </span>\
                        <span ng-if="!row.entity.woID">\
                                        {{row.entity.woNumber}}\
                                    </span>\
                                    </div>',
        enableFiltering: true
      },
      {
        field: 'opNumber',
        width: '110',
        displayName: vm.LabelConstant.Operation.OP,
        cellTemplate: '<div class="ui-grid-cell-contents text-left"><span ng-if="row.entity.woOPID">\
                                        <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.gotoOperation(row.entity.woOPID);$event.preventDefault();">{{row.entity.opNumber}}</a>\
                                    </span>\
                        <span ng-if="!row.entity.woOPID">\
                                        {{row.entity.opNumber}}\
                                    </span>\
                                    </div>',
        enableFiltering: true
      },
      {
        field: 'opName',
        width: '250',
        displayName: 'Operation Name',
        cellTemplate: '<div class="ui-grid-cell-contents text-left"><span ng-if="row.entity.woOPID">\
                                        <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.gotoOperation(row.entity.woOPID);$event.preventDefault();">{{row.entity.opName}}</a>\
                                    </span>\
                        <span ng-if="!row.entity.woOPID">\
                                        {{row.entity.opName}}\
                                    </span>\
                                    </div>',
        enableFiltering: true
      },
      {
        field: 'opStatusConvertedValue',
        displayName: 'Operation Status',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '150',
        ColumnDataType: 'StringEquals',
        enableFiltering: false,
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.rackOPStatusOptions
        }
      },
      {
        field: 'isActiveConvertedValue',
        displayName: 'Status',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span  class="label-box" \
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
        width: '100',
        ColumnDataType: 'StringEquals',
        enableFiltering: true,
        enableSorting: false
      },
      {
        field: 'updatedAt',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableFiltering: false
      },
      {
        field: 'updatedby',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true
      },
      {
        field: 'updatedbyRole',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true
      },
      {
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
      }
    ];

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['name', 'ASC']],
        SearchColumns: [],
        isPrint: true,
        pageName: CORE.PAGENAME_CONSTANT[28].PageName
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
      exporterCsvFilename: 'Rack.csv'
    };

    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICall = (rack, isGetDataDown) => {
      if (rack && rack.data && rack.data.rack) {
        if (!isGetDataDown) {
          vm.sourceData = rack.data.rack;
          vm.currentdata = vm.sourceData.length;
        }
        else if (rack.data.rack.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(rack.data.rack);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        vm.sourceData.map((item) => item.isActiveStatus = (item.isActive) ? 'Active' : 'Inactive');

        // must set after new data comes
        vm.totalSourceDataCount = rack.data.Count;
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
          if (vm.pagingInfo.SearchColumns.length > 0 || vm.pagingInfo.opStatus) {
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

    vm.loadData = () => {
      if (vm.pagingInfo.SortColumns.length === 0) {
        vm.pagingInfo.SortColumns = [['name', 'ASC']];
      }
      bindRackFilter();
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = RackFactory.getRackList().query(vm.pagingInfo).$promise.then((rack) => {
        if (rack && rack.data) {
          setDataAfterGetAPICall(rack, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //get data down
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = RackFactory.getRackList().query(vm.pagingInfo).$promise.then((rack) => {
        if (rack && rack.data) {
          setDataAfterGetAPICall(rack, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* add.edit defect category*/
    vm.addEditRecord = (data, ev) => {
      DialogFactory.dialogService(
        TRANSACTION.TRANSACTION_RACK_ADD_UPDATE_MODAL_CONTROLLER,
        TRANSACTION.TRANSACTION_RACK_ADD_UPDATE_MODAL_VIEW,
        ev,
        data).then(() => {
        }, (data) => {
          if (data) {
            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
          }
        }, (err) => BaseService.getErrorLog(err));
    };
    /* update defect category*/
    vm.updateRecord = (row, ev) => {
      vm.addEditRecord(row.entity, ev);
    };
    // delete rack
    vm.deleteRecord = (rack) => {
      let selectedIDs = [];
      if (rack) {
        selectedIDs.push(rack.id);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((rackItem) => rackItem.id);
        }
      }
      if (selectedIDs) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Rack', selectedIDs.length);

        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        const objIDs = {
          id: selectedIDs,
          CountList: false
        };
        DialogFactory.messageConfirmDialog(obj).then((resposne) => {
          if (resposne) {
            vm.cgBusyLoading = RackFactory.deleteRack().query({ objIDs: objIDs }).$promise.then((rackDet) => {
              if (rackDet && rackDet.data && (rackDet.data.length > 0 || rackDet.data.transactionDetails)) {
                const data = {
                  TotalCount: rackDet.data.transactionDetails[0].TotalCount,
                  pageName: CORE.PageName.Rack
                };
                BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                  const IDs = {
                    id: selectedIDs,
                    CountList: true
                  };
                  return RackFactory.deleteRack().query({
                    objIDs: IDs
                  }).$promise.then((res) => {
                    let data = {};
                    data = res.data;
                    data.pageTitle = rack ? rack.name : null;
                    data.PageName = CORE.PageName.Rack;
                    data.selectedIDs = stringFormat('{0}{1}', selectedIDs.length, ' Selected');
                    if (res.data) {
                      DialogFactory.dialogService(
                        USER.ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER,
                        USER.ADMIN_SHOW_TRANSACTION_DETAILS_VIEW,
                        ev,
                        data).then(() => {
                        }, () => {
                        }, (err) => BaseService.getErrorLog(err));
                    }
                  }).catch((error) => BaseService.getErrorLog(error));
                });
              }
              else {
                BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                vm.gridOptions.clearSelectedRows();
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        //show validation message no data selected
        const messageContent = angular.cop(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContent.message = stringFormat(messageContent.message, 'Rack');
        const alertModel = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(alertModel);
      }
    };

    /* delete multiple data called from directive of ui-grid*/
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };
    //refresh rack
    vm.refreshRack = () => {
      vm.pagingInfo.Page = vm.gridOptions.paginationCurrentPage = CORE.UIGrid.Page();
      vm.loadData();
    };

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
      vm.rowData.pageName = TRANSACTION.TRANSACTION_RACK_LABEL;
      DialogFactory.dialogService(CORE.PRINT_BARCODE_LABEL_MODAL_CONTROLLER, CORE.PRINT_BARCODE_LABEL_MODAL_VIEW, event, vm.rowData).then(() => {
      }, (printerDetailList) => {
        if (printerDetailList) {
          const printList = [];
          let printObj;
          _.each(printerDetailList, (data) => {
            printObj = {
              'rackName': data.rackName,
              'count': 1,
              'reqName': 'Print',
              'numberOfPrint': data.noPrint,
              'PrinterName': data.PrinterName,
              'ServiceName': data.ServiceName,
              'printType': data.printType,
              'pageName': TRANSACTION.TRANSACTION_RACK_LABEL
            };
            printList.push(printObj);
          });
          vm.cgBusyLoading = ReceivingMaterialFactory.printLabelTemplate().query({ printObj: printList }).$promise.then(() => {
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }, (err) => BaseService.getErrorLog(err));
    };

    //multiple prints
    $scope.$on('PrintDocument', (name, data) => {
      $scope.PrintDocument(data.data, data.ev);
    });

    //Open Rack history popup
    vm.UMIDHistory = (row, event) => {
      const data = { rackName: row.name, rackID: row.id };
      DialogFactory.dialogService(
        CORE.RACK_HISTORY_MODAL_CONTROLLER,
        CORE.RACK_HISTORY_MODAL_VIEW,
        event,
        data).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };

    //bind rack filter
    const bindRackFilter = () => {
      let statusIds = '';
      if (vm.emptyRack) {
        statusIds = stringFormat('{0},{1}', statusIds, vm.rackOPStatusOptions[1].key);
      }
      if (vm.wiprack) {
        statusIds = stringFormat('{0},{1}', statusIds, vm.rackOPStatusOptions[2].key);
      }
      if (vm.completedRack) {
        statusIds = stringFormat('{0},{1}', statusIds, vm.rackOPStatusOptions[3].key);
      }
      if (statusIds) {
        statusIds = statusIds.substr(1);
      }
      else {
        statusIds = CORE.NotRackTransaction;
      }
      vm.pagingInfo.opStatus = statusIds;
    };

    //check all filter
    vm.checkAllFilter = () => {
      if (vm.allRack) {
        vm.emptyRack = true;
        vm.wiprack = true;
        vm.completedRack = true;
      } else {
        vm.emptyRack = false;
        vm.wiprack = false;
        vm.completedRack = false;
      }
      vm.pagingInfo.Page = vm.gridOptions.paginationCurrentPage = CORE.UIGrid.Page();
      vm.loadData();
    };
    // go to workorder
    vm.goToworkOrder = (id) => {
      BaseService.goToWorkorderDetails(id);
    };

    // go to operation
    vm.gotoOperation = (id) => {
      BaseService.goToWorkorderOperationDetails(id);
    };
  }
})();
