(function () {
  'use sctrict';
  angular
    .module('app.core')
    .directive('incomingOutgoingGrid', incomingOutgoingGrid);

  /** @ngInject */
  function incomingOutgoingGrid(TravelersFactory) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        woOpId: '=',
        type: '=',
        operationName: '='
      },
      templateUrl: 'app/directives/custom/incoming-outgoing-grid/incoming-outgoing-grid.html',
      controller: incomingOutgoingGridCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function incomingOutgoingGridCtrl($scope, $timeout, CORE, BaseService, DialogFactory) {
      var vm = this;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.isNoDataFound = false;
      vm.EmptyMesssage = angular.copy(CORE.EMPTYSTATE.RACK);
      vm.actionButtonName = 'View Rack History';
      vm.showUMIDHistory = true;
      vm.EmptyMesssage.MESSAGE = stringFormat(vm.EmptyMesssage.MESSAGE, $scope.operationName);
      vm.isHideDelete = true;
      vm.setScrollClass = 'gridScrollHeight_Incoming_Outgoing_Page';
      vm.gridClass = $scope.type === CORE.Incomin_Outgoing[0].id ? CORE.gridConfig.gridIncoming : CORE.gridConfig.gridOutgoing;
      vm.gridConfig = CORE.gridConfig;
      vm.DefaultDateTimeFormat = _dateTimeDisplayFormat;
      vm.loginUser = BaseService.loginUser;
      const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
      // page info detail
      vm.pagingInfo = {
        // Page: 1,
        SortColumns: [['id', 'DESC']],
        SearchColumns: [],
        woOPID: $scope.woOpId,
        ptransactionType: $scope.type
      };
      //grid option settings
      vm.gridOptions = {
        enablePaging: isEnablePagination,
        enablePaginationControls: isEnablePagination,
        filterOptions: vm.pagingInfo.SearchColumns,
        enableCellEdit: false,
        enableCellEditOnFocus: false,
        exporterCsvFilename: $scope.type === CORE.Incomin_Outgoing[0].id ? 'Incoming Rack.csv' : 'Outgoing Rack.csv',
        exporterMenuCsv: true,
        enableColumnMenus: false
      };

      //grid header detail
      vm.sourceHeader = [
        {
          field: 'Action',
          displayName: 'Action',
          width: '100',
          cellTemplate: '<grid-action-view grid="grid" row="row" number-of-action-button="2"></grid-action-view>',
          enableFiltering: false,
          enableSorting: false,
          exporterSuppressExport: true,
          pinnedLeft: false,
          allowCellFocus: false
        },
        {
          field: '#',
          width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
          cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
          enableFiltering: false,
          enableSorting: false,
          allowCellFocus: false
        },
        {
          field: 'rackName',
          displayName: 'Rack',
          cellTemplate: '<div class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
          width: '150',
          enableFiltering: true,
          enableSorting: true,
          allowCellFocus: false
        },
        {
          field: 'rackStatus',
          displayName: 'Assy Status',
          width: '300',
          enableFiltering: true,
          cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >\
                      <div ng-repeat="item in row.entity.rackStatusList">\
                       {{item}}\
                      </div>\
                    </div> ',
          enableSorting: true,
          allowCellFocus: false,
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: CORE.RackStatusFilter
          },
          visible: $scope.type === CORE.Incomin_Outgoing[1].id
        },
        {
          field: 'createdby',
          displayName: CORE.LabelConstant.COMMON.GRIDHEADER_SCANNEDBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '175',
          enableFiltering: true,
          enableSorting: true,
          allowCellFocus: false
        },
        {
          field: 'createdAt',
          displayName: CORE.LabelConstant.COMMON.GRIDHEADER_SCANNEDON,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateTimeFormat}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
          allowCellFocus: false,
          type: 'datetime',
          enableFiltering: false,
          enableSorting: true
        },
        {
          field: 'updatedbyRole',
          displayName: CORE.LabelConstant.COMMON.GRIDHEADER_SCANNEDBY_ROLE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          type: 'StringEquals',
          enableFiltering: true
        }
      ];

      // to set data in grid after data is retrived from API in loadData() and getDataDown() function
      const setDataAfterGetAPICall = (response, isGetDataDown) => {
        if (response && response.data && response.data.scanrack) {
          bindData(response.data.scanrack);
          if (!isGetDataDown) {
            vm.sourceData = response.data.scanrack;
            vm.currentdata = vm.sourceData.length;
          }
          else if (response.data.scanrack.length > 0) {
            vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(response.data.scanrack);
            vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
          }
          // must set after new data comes
          vm.totalSourceDataCount = response.data.Count;
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
            } else {
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


      // get list of scanned rack
      vm.loadData = () => {
        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        vm.cgBusyLoading = TravelersFactory.retriveScannedRackdetail().query(vm.pagingInfo).$promise.then((response) => {
          if (response && response.data) {
            setDataAfterGetAPICall(response, false);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };
      // get list of scanned rack, called method after scroll
      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.cgBusyLoading = TravelersFactory.retriveScannedRackdetail().query(vm.pagingInfo).$promise.then((response) => {
          if (response && response.data) {
            setDataAfterGetAPICall(response, true);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };


      $scope.$on(CORE.EventName.refreshinoutGrid, () => {
        vm.pagingInfo.Page = 1;
        vm.loadData();
      });

      //open history popup
      vm.UMIDHistory = (row, event) => {
        const data = { rackName: row.rackName, rackID: row.rackID };
        DialogFactory.dialogService(
          CORE.RACK_HISTORY_MODAL_CONTROLLER,
          CORE.RACK_HISTORY_MODAL_VIEW,
          event,
          data).then(() => {
          }, () => {
          }, (err) => BaseService.getErrorLog(err));
      };

      //bind data
      const bindData = (incomingGrid) => {
        _.each(incomingGrid, (gridItem) => {
          let rackStatusList = [];
          if (gridItem.rackStatus) {
            rackStatusList = gridItem.rackStatus.split(',');
          }
          gridItem.rackStatusList = rackStatusList;
        });
      };
    }
  }
})();
