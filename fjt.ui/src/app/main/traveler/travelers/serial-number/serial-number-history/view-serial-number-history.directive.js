(function () {
  'use strict';
  angular.module('app.core').directive('serialNumberHistory', serialNumberHistory);

  /** @ngInject */
  function serialNumberHistory() {
    const directive = {
      restrict: 'E',
      replace: true,
      scope: {
        serialNoId: '=?'
      },
      templateUrl: 'app/main/traveler/travelers/serial-number/serial-number-history/view-serial-number-history.html',
      controller: serialNumberHistoryController,
      controllerAs: 'vm',
      link: function () {
      }
    };
    return directive;

    /** @ngInject */
    /**
    * Controller for view serial numbar History
    * @param
    */
    function serialNumberHistoryController($scope, $q, $mdDialog, $timeout, WorkorderSerialMstFactory, CORE, WORKORDER, WorkorderFactory, DialogFactory, BaseService) {
      const vm = this;
      vm.isHideDelete = true;
      vm.setScrollClass = 'gridScrollHeight_RFQ';
      vm.serialNoid = $scope.serialNoId ? $scope.serialNoId : null;
      vm.gridConfig = CORE.gridConfig;
      vm.SerialTypeLabel = CORE.SerialTypeLabel;
      vm.debounceTime = CORE.DEBOUNCE_TIME_INTERVAL;
      vm.LabelConstant = CORE.LabelConstant;
      vm.EmptyMesssage = WORKORDER.WORKORDER_EMPTYSTATE.WORKORDER_SERIAL_TRANS_HISTORY;
      vm.prodStatus = CORE.productStatus;
      vm.productStatusFilter = CORE.productStatusFilter;
      vm.statusText = CORE.statusText;
      vm.loginUser = BaseService.loginUser;
      const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
      const initPageInfo = () => {
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),
          SortColumns: [['woTransSerialID', 'DESC']],
          SearchColumns: [],
          serialNoid: vm.serialNoid
        };
        vm.pagingInfo.SearchColumns.push();
        initsourcedata();
      };
      const initsourcedata = () => {
        vm.sourceHeader = [{
          field: '#',
          width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
          cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
          enableFiltering: false,
          enableSorting: false
        }, {
          field: 'createdAt',
          displayName: 'Scanned On',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
          type: 'datetime',
          enableFiltering: false
        }, {
          field: 'opName',
          displayName: vm.LabelConstant.Operation.OP,
          width: 250
        }, {
          field: 'prodstatus',
          displayName: 'OP Status of ' + vm.SerialTypeLabel.MFRSerial.Label,
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.productStatusFilter
          },
          ColumnDataType: 'StringEquals',
          width: 200
        }, {
          field: 'employeeName',
          displayName: 'Scanned By',
          width: 150
        }, {
          field: 'serialNo',
          displayName: vm.SerialTypeLabel.MFRSerial.Label,
          width: 200

        }, {
          field: 'productSerialNO',
          displayName: vm.SerialTypeLabel.FinalSerial.Label,
          width: 200

        }];
      };
      initPageInfo();


      vm.dateFormat = _dateDisplayFormat;


      vm.gridOptions = {
        enablePaging: isEnablePagination,
        enablePaginationControls: isEnablePagination,
        showColumnFooter: false,
        enableRowHeaderSelection: false,
        enableFullRowSelection: false,
        enableRowSelection: false,
        multiSelect: false,
        filterOptions: vm.pagingInfo.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: 'Work order Serial# History.csv'
      };

      // to set data in grid after data is retrived from API in loadData() and getDataDown() function
      const setDataAfterGetAPICall = (response, isGetDataDown) => {
        if (response && response.data && response.data.serialNoTransHIstory) {
          if (!isGetDataDown) {
            vm.sourceData = response.data.serialNoTransHIstory;
            vm.currentdata = vm.sourceData.length;
          }
          else if (response.data.serialNoTransHIstory.length > 0) {
            vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(response.data.serialNoTransHIstory);
            vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
          }
          bindGridData();
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
      };

      /* retrieve serial# history list*/
      vm.loadData = () => {
        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        vm.cgBusyLoading = WorkorderSerialMstFactory.getSerialNumberTransHistory().query(vm.pagingInfo).$promise.then((response) => {
          if (response && response.data) {
            setDataAfterGetAPICall(response, false);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* load more data on mouse scroll */
      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.pagingInfo.SearchColumns.push(searchColumn);
        vm.cgBusyLoading = WorkorderSerialMstFactory.getSerialNumberTransHistory().query(vm.pagingInfo).$promise.then((response) => {
          if (response && response.data) {
            setDataAfterGetAPICall(response, true);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };
      function bindGridData() {
        _.each(vm.sourceData, (data) => {
          vm.selectedProdStatus = _.find(vm.prodStatus, (item) => item.id === data.prodStatus);
          if (vm.selectedProdStatus) {
            data.prodstatus = vm.selectedProdStatus.status;
          }
        });
      }
      vm.fab = {
        Status: false
      };
    }
  }
})();
