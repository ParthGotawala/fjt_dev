(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('umidStatusList', umidStatusList);

  /** @ngInject */
  function umidStatusList(BaseService, $timeout, CORE, TRANSACTION, PRICING) {
    const directive = {
      restrict: 'E',
      replace: false,
      scope: {
        list: '=',
        screenName: '=?'
      },
      templateUrl: 'app/directives/custom/umid-status-list/umid-status-list.html',
      controller: umidStatusListCtrl,
      controllerAs: 'vm',
      link: function () {
      }
    };
    return directive;
    /** @ngInject */
    /**
    * Controller for view data of alternative details
    *
    * @param
    */
    function umidStatusListCtrl($scope, $element, $attrs, $filter) {
      const vm = this;
      vm.CORE = CORE;
      vm.setScrollClass = 'gridScrollHeight_UMIDStatus';
      vm.isHideDelete = true;
      vm.loginUser = BaseService.loginUser;
      vm.DefaultDateFormat = _dateTimeDisplayFormat;
      vm.screenName = $scope.screenName;

      vm.sourceHeader = [
        {
          field: '#',
          width: '50',
          cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
          enableFiltering: false,
          enableSorting: false
        },
        {
          field: 'UID',
          displayName: vm.CORE.LabelConstant.TransferStock.UMID,
          cellTemplate: '<div class="ui-grid-cell-contents text-left"> \
                        <a tabindex="-1" ng-click="grid.appScope.$parent.vm.goToUIDManage(row.entity)" class="cm-text-decoration underline cursor-pointer">{{COL_FIELD | uppercase}}</a> \
                        <copy-text label="grid.appScope.$parent.vm.CORE.LabelConstant.UMIDManagement.UMID" text="COL_FIELD"></copy-text></div>',
          width: vm.screenName === TRANSACTION.UMID_STATUS_LIST_SCREEN.UMID_Transfer ? '300' : '150',
          allowCellFocus: false
        },
        {
          field: 'frmlocation',
          displayName: 'From Location/Bin',
          cellTemplate: '<div class="ui-grid-cell-contents text-left"><a tabindex="-1" ng-click="grid.appScope.$parent.vm.goToUMIDList(null, row.entity.frmBinID)" class="cm-text-decoration underline cursor-pointer">{{COL_FIELD}}</a></div>',
          width: vm.screenName === TRANSACTION.UMID_STATUS_LIST_SCREEN.UMID_Transfer ? '170' : '120',
          allowCellFocus: false
        },
        {
          field: 'frmwarehouse',
          displayName: 'From Warehouse',
          cellTemplate: '<div class="ui-grid-cell-contents text-left"><a tabindex="-1" ng-click="grid.appScope.$parent.vm.goToUMIDList(row.entity.frmWHID, null)" class="cm-text-decoration underline cursor-pointer">{{COL_FIELD}}</a></div>',
          width: vm.screenName === TRANSACTION.UMID_STATUS_LIST_SCREEN.UMID_Transfer ? '170' : '110',
          allowCellFocus: false
        },
        {
          field: 'frmParentWarehouse',
          displayName: 'From Parent Warehouse',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: vm.screenName === TRANSACTION.UMID_STATUS_LIST_SCREEN.UMID_Transfer ? '200' : '145',
          allowCellFocus: false
        },
        {
          field: 'tolocation',
          displayName: vm.CORE.LabelConstant.TransferStock.ToBin,
          cellTemplate: '<div class="ui-grid-cell-contents text-left"><a tabindex="-1" ng-click="grid.appScope.$parent.vm.goToUMIDList(null, row.entity.toBinID)" class="cm-text-decoration underline cursor-pointer">{{COL_FIELD}}</a></div>',
          width: vm.screenName === TRANSACTION.UMID_STATUS_LIST_SCREEN.UMID_Transfer ? '170' : '110',
          allowCellFocus: false
        },
        {
          field: 'towarehouse',
          displayName: 'To Warehouse',
          cellTemplate: '<div class="ui-grid-cell-contents text-left"><a tabindex="-1" ng-click="grid.appScope.$parent.vm.goToUMIDList(row.entity.toWarehouseID, null)" class="cm-text-decoration underline cursor-pointer">{{COL_FIELD}}</a></div>',
          width: vm.screenName === TRANSACTION.UMID_STATUS_LIST_SCREEN.UMID_Transfer ? '170' : '100',
          allowCellFocus: false
        },
        {
          field: 'toparentWarehouse',
          displayName: 'To Parent Warehouse',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: vm.screenName === TRANSACTION.UMID_STATUS_LIST_SCREEN.UMID_Transfer ? '200' : '145',
          allowCellFocus: false
        },
        {
          field: 'timestamp',
          displayName: 'TimeStamp',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD |date : grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
          width: vm.screenName === TRANSACTION.UMID_STATUS_LIST_SCREEN.UMID_Transfer ? '170' : '150',
          allowCellFocus: false
        }
      ];

      if (vm.screenName === TRANSACTION.UMID_STATUS_LIST_SCREEN.Bin_Transfer) {
        const findIndexUmid = _.findIndex(vm.sourceHeader, (data) => data.displayName === vm.CORE.LabelConstant.TransferStock.UMID);
        if (findIndexUmid !== -1) {
          vm.sourceHeader.splice(findIndexUmid, 1);
        }

        const findIndexToBin = _.findIndex(vm.sourceHeader, (data) => data.displayName === vm.CORE.LabelConstant.TransferStock.ToBin);
        if (findIndexToBin !== -1) {
          vm.sourceHeader.splice(findIndexToBin, 1);
        }
      }

      const initPageInfo = () => {
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),
          SortColumns: [['index', 'DESC']],
          SearchColumns: [],
          pageName: CORE.PAGENAME_CONSTANT[7].PageName
        };
      };

      initPageInfo();

      vm.gridOptions = {
        enableFiltering: TRANSACTION.UMID_STATUS_LIST_SCREEN.UMID_Stock_Transfer ? false : true,
        showColumnFooter: false,
        enableRowHeaderSelection: false,
        enableFullRowSelection: false,
        enableRowSelection: false,
        multiSelect: false,
        enableCellEdit: false,
        filterOptions: vm.pagingInfo.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: 'UMID Status.csv',
        allowCellFocus: false
      };

      /* retrieve Receiving Material list*/
      vm.loadData = () => {
        vm.sourceData = $scope.list;
        if (vm.pagingInfo.SortColumns.length > 0) {
          const column = [];
          const sortBy = [];
          _.each(vm.pagingInfo.SortColumns, (item) => {
            column.push(item[0]);
            sortBy.push(item[1]);
          });
          vm.sourceData = _.orderBy(vm.sourceData, column, sortBy);
        }
        if (vm.pagingInfo.SearchColumns.length > 0) {
          _.each(vm.pagingInfo.SearchColumns, (item) => {
            vm.sourceData = $filter('filter')(vm.sourceData, { [item.ColumnName]: item.SearchString });
          });
          if (vm.sourceData.length === 0) {
            vm.emptyState = 0;
          }
        }
        else {
          vm.emptyState = null;
        }
        vm.totalSourceDataCount = vm.sourceData.length;
        vm.currentdata = vm.totalSourceDataCount;
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
          // set Filter disable default - Given this change by DP to fix Count-material UI [10-03-2021]
          if (vm.gridOptions && vm.gridOptions.gridApi && vm.gridOptions.gridApi.grid) {
            if (vm.gridOptions.gridApi.grid.gridMenuScope) {
              vm.gridOptions.gridApi.grid.gridMenuScope.showFilters = false;
            }
          }
          vm.resetSourceGrid();
          if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
          }
        });
      };

      // method to update grid list
      const ScannUMIDStatus = $scope.$on(PRICING.EventName.ScannUMID, (name, data) => {
        vm.sourceData.push(data);
        vm.sourceData = _.orderBy(vm.sourceData, ['index'], ['desc']);
        vm.totalSourceDataCount = vm.sourceData.length;
        vm.currentdata = vm.totalSourceDataCount;
        $timeout(() => {
          vm.resetSourceGrid();
        });
      });

      vm.goToUIDManage = (data) => BaseService.goToUMIDDetail(data.id);
        
      $scope.$on('$destroy', () => {
        ScannUMIDStatus();
      });

      vm.goToUMIDList = (whId, binId) => {
        BaseService.goToUMIDList(whId, binId);
      };
    }
  }
})();
