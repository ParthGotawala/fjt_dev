(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('showActiveOperationList', showActiveOperationList);

  /** @ngInject */
  function showActiveOperationList(CORE, BaseService, $timeout, $filter, WorkorderTransFactory, WORKORDER, USER) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        woId: '=?',
        employeeId: '=?'
      },
      templateUrl: 'app/directives/custom/show-active-operation-list/show-active-operation-list.html',
      controller: activeOperationListCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    /**
    * Controller for text-angular define before load directive
    *
    * @param
    */
    function activeOperationListCtrl($scope) {
      var vm = this;
      var setOperationColTemplate = '';
      vm.employeeID = $scope.employeeId ? $scope.employeeId : null;
      vm.woID = $scope.woId ? $scope.woId : null;
      vm.DefaultDateTimeFormat = _dateTimeDisplayFormat;
      vm.EmptyMesssageOperation = WORKORDER.WORKORDER_EMPTYSTATE.ACTIVE_OPERATION;
      vm.isHideDelete = true;  //to hide global delete column of UI-grid
      vm.isUpdatable = false;
      vm.gridConfig = CORE.gridConfig;
      vm.loginUser = BaseService.loginUser;
      const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;

      vm.LabelConstant = CORE.LabelConstant;
      vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;


      //init paging info for grid
      const initPageInfo = () => {
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),
          pageSize: CORE.UIGrid.ItemsPerPage(),
          SortColumns: [],
          SearchColumns: [],
          employeeID: vm.employeeID,
          woID: vm.woID,
          count: 0
        };
      };
      initPageInfo();

      //set grid options
      vm.gridOptions = {
        enablePaging: isEnablePagination,
        enablePaginationControls: isEnablePagination,
        enableCellEditOnFocus: false,
        enableRowHeaderSelection: false,
        enableFullRowSelection: false,
        enableRowSelection: false,
        multiSelect: false,
        exporterMenuCsv: true,
        filterOptions: vm.pagingInfo.SearchColumns,
        exporterCsvFilename: 'Active Operation List.csv'
      };


      //set source header for grid
      const setGridDataHeader = () => {
        setOperationColTemplate = '';
        setOperationColTemplate = '<div class="ui-grid-cell-contents text-left" ng-if="row.entity.showOperationLink"> \
            <a tabindex="-1"class= "text-underline cursor-pointer" ng-click="grid.appScope.$parent.vm.goToTravelerOperationDetails(row.entity)" > \
                {{row.entity.opFullName}} \
            </a> \
            <md-tooltip md-direction="top">{{COL_FIELD}}</md-tooltip> </div> \
            <div class="ui-grid-cell-contents text-left" ng-if="!row.entity.showOperationLink"> \
                {{row.entity.opFullName}} \
            <md-tooltip md-direction="top">{{COL_FIELD}}</md-tooltip> </div>';
        vm.sourceHeader = [
          {
            field: '#',
            width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
            cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
            enableSorting: false,
            enableFiltering: false
          },
          {
            field: 'PIDCode',
            displayName: vm.LabelConstant.Assembly.ID,
            cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link \
                                component-id="row.entity.partId" \
                                label="grid.appScope.$parent.vm.LabelConstant.Assembly.ID" \
                                value="row.entity.PIDCode" \
                                is-copy="true" \
                                is-mfg="true" \
                                mfg-label="grid.appScope.$parent.vm.LabelConstant.Assembly.MFGPN" \
                                mfg-value="row.entity.mfgPN" \
                                rohs-icon="row.entity.rohsIcon" \
                                rohs-status="row.entity.rohsName" \
                                is-copy-ahead-label="true"\
                                is-assembly="true"></common-pid-code-label-link></div>',
            width: CORE.UI_GRID_COLUMN_WIDTH.PID
          },
          {
            field: 'woNumber',
            width: '150',
            displayName: vm.LabelConstant.Workorder.WO,
            cellTemplate: '<div class="ui-grid-cell-contents text-left" flex="100"> \
            <a tabindex="-1" class= "text-underline cursor-pointer min-width-max-content" ng-click="grid.appScope.$parent.vm.goToWorkOrderDetail(row, $event)" > \
                {{COL_FIELD}} \
            </a> \
            <md-tooltip md-direction="top" class="inline-block min-width-max-content">{{row.entity.woNumber}} </md-tooltip> </div> ',
            enableFiltering: true,
            enableSorting: true
          },
          {
            field: 'opFullName',
            width: '200',
            displayName: vm.LabelConstant.Operation.OP,
            cellTemplate: setOperationColTemplate,
            enableFiltering: true,
            enableSorting: true
          },
          {
            field: 'employeeName',
            width: '150',
            displayName: 'Personnel Name',
            cellTemplate: '<div class="ui-grid-cell-contents text-left"> {{COL_FIELD}}</div>',
            enableFiltering: true,
            enableSorting: true
          },
          {
            field: 'displayActivityType',
            width: '180',
            displayName: 'Activity Type',
            cellTemplate: '<div class="ui-grid-cell-contents text-left"> {{COL_FIELD}}</div>',
            enableFiltering: true,
            enableSorting: true
          },
          {
            field: 'checkinDateTime',
            width: '150',
            displayName: 'Activity Started Time',
            cellTemplate: '<div class="ui-grid-cell-contents text-left"> {{COL_FIELD |date:grid.appScope.$parent.vm.DefaultDateTimeFormat}}</div>',
            type: 'date',
            enableFiltering: false,
            enableSorting: true
          },
          {
            field: 'currentTotalDiff',
            width: '150',
            displayName: 'Current Total Time',
            type: 'date',
            cellTemplate: '<div class="ui-grid-cell-contents text-center flex layout-align-center-center"><label flex="100" layout-align="start center" layout="row" class="label-box label-warning" style="min-width: 100px !important;">{{ COL_FIELD}}</label></div>',
            enableFiltering: false,
            enableSorting: true
          },
          {
            field: 'opStatus',
            width: '150',
            displayName: 'Status',
            cellTemplate: '<div class="ui-grid-cell-contents text-left"> {{COL_FIELD}}</div>',
            enableFiltering: true,
            enableSorting: true
          }
        ];
      };

      vm.startTimer = ((data) => data.tickActivity = setInterval(() => {
        data.currentTotalTime = data.currentTotalTime + 1;
        data.currentTotalDiff = secondsToTime(data.currentTotalTime, true);
      }, _configSecondTimeout)
      );

      // to set data in grid after data is retrived from API in loadData() and getDataDown() function
      const setDataAfterGetAPICall = (response, isGetDataDown) => {
        if (response && response.data && response.data.activeOperationList) {
          _.each(response.data.activeOperationList, (item) => {
            // item.currentTotalDiff = secondsToTime(item.currentTotalTime, true);
            if (item.opStatus === 'Work In Progress' || item.opStatus === 'Hold') {
              vm.startTimer(item);
            }
            if (vm.loginUser.isUserSuperAdmin) {
              item.showOperationLink = true;
            } else if (vm.loginUser.employee.id === item.employeeID) {
              item.showOperationLink = true;
            } else {
              item.showOperationLink = false;
            }
            item.rohsIcon = vm.rohsImagePath + item.rohsIcon;
          });
          if (!isGetDataDown) {
            if ((vm.pagingInfo.SearchColumns && vm.pagingInfo.SearchColumns.length === 0) && (vm.pagingInfo.SortColumns && vm.pagingInfo.SortColumns.length === 0)) {
              setGridDataHeader();
            }
            vm.sourceData = response.data.activeOperationList;
            vm.currentdata = vm.sourceData.length;
          }
          else if (response.data.activeOperationList.length > 0) {
            vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(response.data.activeOperationList);
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
            if (isGetDataDown) {
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount !== vm.currentdata ? true : false);
            }
            else {
              vm.resetSourceGrid();
              if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
                return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
              }
            }
          });
        }
      };


      // [S] Get Operation List
      vm.loadData = () => {
        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        vm.cgBusyLoading = WorkorderTransFactory.getActiveOperationList().query(vm.pagingInfo).$promise.then((response) => {
          if (response && response.data) {
            setDataAfterGetAPICall(response, false);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.cgBusyLoading = WorkorderTransFactory.getActiveOperationList().query(vm.pagingInfo).$promise.then((response) => {
          if (response && response.data) {
            setDataAfterGetAPICall(response, true);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* to move at operation update page */
      vm.goToTravelerOperationDetails = (data) => {
        BaseService.goToTravelerOperationDetails(data.woOPID, data.employeeID, data.homeOPID);
        return false;
      };
      //goto workorder detail
      vm.goToWorkOrderDetail = (data) => {
        BaseService.goToWorkorderDetails(data.entity.woID);
        return false;
      };
    }
  }
})();
