(function () {
  'use sctrict';
  angular
    .module('app.core')
    .directive('rackHistoryGrid', rackHistoryGrid);

  /** @ngInject */
  function rackHistoryGrid(TravelersFactory) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        woOpId: '=',
        woId: '=',
        rackId: '='
      },
      templateUrl: 'app/directives/custom/rack-history-grid/rack-history-grid.html',
      controller: rackHistoryGridCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function rackHistoryGridCtrl($scope, $timeout, CORE, BaseService, USER) {
      var vm = this;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.isNoDataFound = false;
      vm.EmptyMesssage = CORE.EMPTYSTATE.RACKHISTORY;
      vm.isHideDelete = true;
      vm.setScrollClass = 'gridScrollHeight_Rack_History_Page';
      vm.gridConfig = CORE.gridConfig;
      vm.DefaultDateTimeFormat = _dateTimeDisplayFormat;
      vm.loginUser = BaseService.loginUser;
      const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
      // page info detail
      vm.pagingInfo = {
        // Page: 1,
        SortColumns: [['id', 'DESC']],
        SearchColumns: []
      };
      //grid option settings
      vm.gridOptions = {
        enablePaging: isEnablePagination,
        enablePaginationControls: isEnablePagination,
        filterOptions: vm.pagingInfo.SearchColumns,
        enableCellEdit: false,
        enableCellEditOnFocus: false,
        exporterCsvFilename: 'Rack History.csv',
        exporterMenuCsv: true,
        enableColumnMenus: false
      };

      //grid header detail
      vm.sourceHeader = [
        {
          field: '#',
          width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
          cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
          enableFiltering: false,
          enableSorting: false,
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
          field: 'rackName',
          displayName: 'Rack',
          cellTemplate: '<div class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
          width: '130',
          enableFiltering: true,
          enableSorting: true,
          allowCellFocus: false
        },
        {
          field: 'assyStatusName',
          displayName: 'Operation Status',
          cellTemplate: '<div class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
          width: '180',
          enableFiltering: true,
          enableSorting: true,
          allowCellFocus: false,
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: CORE.RackTransactionType
          }
        },
        {
          field: 'opstatusName',
          displayName: 'Assy Status',
          cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >\
                      <div ng-repeat="item in row.entity.rackStatusList">\
                       {{item}}\
                      </div>\
                    </div> ',
          width: '200',
          enableFiltering: true,
          enableSorting: true,
          allowCellFocus: false,
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: CORE.RackStatusFilter
          }
        },
        {
          field: 'pidCode',
          displayName: 'Assy ID',
          cellTemplate: '<div  class=\"ui-grid-cell-contents\">\
                        <common-pid-code-label-link  ng-if= "row.entity.partID" component-id="row.entity.partID"\
                          label="grid.appScope.$parent.vm.CORE.LabelConstant.MFG.AssyID"\
                          value="COL_FIELD"\
                          is-assembly="true"\
                        rohs-icon="row.entity.rohsIcon"\
                        is-copy="row.entity.pidCode ? true : false"\
                        rohs-status="row.entity.rohsName"></common-pid-code-label-link >\
                        </div > ',
          width: '250',
          enableFiltering: true,
          enableSorting: true,
          allowCellFocus: false
        },
        {
          field: 'woNumber',
          displayName: 'WO#',
          cellTemplate: '<div class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
          width: '100',
          enableFiltering: true,
          enableSorting: true,
          allowCellFocus: false
        },
        {
          field: 'workCertificationList',
          width: '350',
          displayName: 'WO Standards',
          cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents">'
            + '<span class="label-box margin-left-2" ng-style = "{\'background-color\': standardItem.colorCode}" ng-repeat="standardItem in row.entity.woCertificationDetListWithNewLine track by $index">'
            + '{{standardItem.stdClassName}}'
            + '</span>'
            + '</div> ',
          enableFiltering: false,
          enableSorting: true,
          cellTooltip: true
        },
        {
          field: 'operationName',
          displayName: CORE.LabelConstant.Operation.OP,
          cellTemplate: '<div class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
          width: '280',
          enableFiltering: true,
          enableSorting: true,
          allowCellFocus: false
        },
        {
          field: 'flux',
          displayName: 'Flux',
          cellTemplate: '<div class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
          width: '100',
          enableFiltering: true,
          enableSorting: true,
          allowCellFocus: false
        },
        {
          field: 'userName',
          displayName: CORE.LabelConstant.COMMON.GRIDHEADER_SCANNEDBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '90',
          enableFiltering: true,
          enableSorting: true,
          allowCellFocus: false
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
        if (response && response.data && response.data.rackHistory) {
          setRohsIcon(response.data.rackHistory);
          formatWorkorderCertiOfGridData(response.data.rackHistory);
          if (!isGetDataDown) {
            vm.sourceData = response.data.rackHistory;
            vm.currentdata = vm.sourceData.length;
          }
          else if (response.data.rackHistory.length > 0) {
            vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(response.data.rackHistory);
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
              if (vm.rackName) {
                vm.EmptyMesssage = angular.copy(CORE.EMPTYSTATE.RACKHISTORY);
                vm.EmptyMesssage.MESSAGERACK = stringFormat(vm.EmptyMesssage.MESSAGERACK, vm.rackName);
              }
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


      // get list of scanned clear rack
      vm.loadData = () => {
        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        vm.pagingInfo.woOPID = $scope.woOpId ? $scope.woOpId : null;
        vm.pagingInfo.woID = $scope.woId ? $scope.woId : null;
        vm.pagingInfo.rackID = $scope.rackId ? $scope.rackId : null;
        vm.cgBusyLoading = TravelersFactory.retriveRackdetailHistory().query(vm.pagingInfo).$promise.then((response) => {
          if (response && response.data) {
            setDataAfterGetAPICall(response, false);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };
      // get list of scanned clear rack, called method after scroll
      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.cgBusyLoading = TravelersFactory.retriveRackdetailHistory().query(vm.pagingInfo).$promise.then((response) => {
          if (response && response.data) {
            setDataAfterGetAPICall(response, true);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      //format standard class
      const formatWorkorderCertiOfGridData = (rackList) => {
        const existsCertiOfWorkorderList = _.filter(rackList, (rackItem) => rackItem.workCertificationList);
        _.each(existsCertiOfWorkorderList, (woCertiItem) => {
          const woCertificationDetListWithNewLine = [];
          const classWithColorCode = woCertiItem.workCertificationList.split('@@@@@@');
          _.each(classWithColorCode, (item) => {
            if (item) {
              const objItem = item.split('######');
              const standardClassObj = {};
              standardClassObj.stdClassName = objItem[0].trim();
              standardClassObj.colorCode = objItem[1] ? objItem[1] : CORE.DefaultStandardTagColor;
              woCertificationDetListWithNewLine.push(standardClassObj);
            }
          });
          woCertiItem.woCertificationDetListWithNewLine = woCertificationDetListWithNewLine;
          woCertiItem.workCertificationList = _.map(woCertificationDetListWithNewLine, 'stdClassName').toString();
        });
      };

      //set rohs icon
      const setRohsIcon = (racklist) => {
        _.each(racklist, (rack) => {
          if (rack.rohsIcon) {
            rack.rohsIcon = stringFormat('{0}{1}{2}', CORE.WEB_URL, USER.ROHS_BASE_PATH, rack.rohsIcon);
          }
          let rackStatusList = [];
          if (rack.opstatusName) {
            rackStatusList = rack.opstatusName.split(',');
          }
          rack.rackStatusList = rackStatusList;
        });
      };

      $scope.$on(CORE.EventName.refreshinoutGrid, (ev, data) => {
        vm.pagingInfo.Page = 1;
        vm.rackName = data;
        vm.loadData();
      });
    }
  }
})();
