(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('employeeContactpersonHistoryList', employeeContactpersonHistoryList);

  /** @ngInject */
  function employeeContactpersonHistoryList($mdDialog, $timeout, $state, CORE, USER, DialogFactory, BaseService, ContactPersonFactory) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        cgBusyLoading: '=',
        contactPersonId: '=?',
        employeeId: '=?',
        titleName: '='
      },
      templateUrl: 'app/directives/custom/employee-contactperson-history/employee-contactperson-history.html',
      controller: employeeContactpersonHistoryCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function employeeContactpersonHistoryCtrl($scope) {
      var vm = this;
      vm.loginUser = BaseService.loginUser;
      vm.isHideDelete = true;
      vm.isNoDataFound = false;
      vm.contactPersonId = $scope.contactPersonId;
      vm.employeeId = $scope.employeeId;
      vm.title = $scope.titleName;
      vm.gridConfig = CORE.gridConfig;
      vm.LabelConstant = CORE.LabelConstant;
      vm.EmptyState = angular.copy(CORE.COMMON_HISTORY);
      const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination;

      /* SourceHeader data */
      vm.sourceHeader = [{
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
        enableFiltering: false,
        enableSorting: false
      }, {
        field: 'formattedName',
        displayName: vm.employeeId ? CORE.PageName.ContactPerson : CORE.MainTitle.Employee,
        width: 250
      }, {
        field: 'assignedAtValue',
        displayName: 'Assigned From',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: 160,
        type: 'datetime',
        enableFiltering: false
      }, {
        field: 'releasedAtValue',
        displayName: 'Released On',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: 160,
        type: 'datetime',
        enableFiltering: false
      }, {
        field: 'updatedAtValue',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableFiltering: false,
        visible: CORE.UIGrid.VISIBLE_MODIFIED_AT
      }, {
        field: 'updatedbyValue',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true,
        visible: CORE.UIGrid.VISIBLE_MODIFIED_BY
      }, {
        field: 'updatedbyRoleValue',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true,
        visible: CORE.UIGrid.VISIBLE_MODIFIED_BYROLE
      }, {
        field: 'createdAtValue',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableFiltering: false,
        visible: false
      }, {
        field: 'createdbyValue',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        type: 'StringEquals',
        enableFiltering: true,
        visible: CORE.UIGrid.VISIBLE_CREATED_BY
      }, {
        field: 'createdbyRoleValue',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        type: 'StringEquals',
        enableFiltering: true,
        visible: CORE.UIGrid.VISIBLE_CREATED_BYROLE
      }];

      /* Init Page Info Configuration */
      const initPageInfo = () => {
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),
          SortColumns: [['assignedAtValue', 'DESC']],
          SearchColumns: [],
          personId: $scope.contactPersonId,
          empId: $scope.employeeId
        };
      };
      initPageInfo();

      /* Grid Options */
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
        exporterCsvFilename: `${vm.title}.csv`,
        CurrentPage: CORE.PAGENAME_CONSTANT[68].PageName,
        allowToExportAllData: true,
        /* Calls everytime for Export All Data [rowType = ALL] */
        exporterAllDataFn: () => {
          /* For scrolling pagination vm.pagingInfo.Page is increase everytime so we have to set API side pagePerReocrds as NULL for Export All Data */
          const pagingInfoOld = _.clone(vm.pagingInfo);
          pagingInfoOld.pageSize = 0;
          pagingInfoOld.Page = 1;
          vm.gridOptions.isExport = pagingInfoOld.isExport = true;
          return ContactPersonFactory.retrieveEmployeeContactpersonList().query(pagingInfoOld).$promise.then((response) => {
            if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data && response.data.EmpOrCpList) {
              return contactPerson.data.EmpOrCpList;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      /* to set data in grid after data is retrived from API in loadData() and getDataDown() function */
      const setDataAfterGetAPICall = (EmpOrCpList, isGetDataDown) => {
        if (EmpOrCpList && EmpOrCpList.data && EmpOrCpList.data.EmpOrCpList) {
          if (!isGetDataDown) {
            vm.sourceData = EmpOrCpList.data.EmpOrCpList;
            vm.currentdata = vm.sourceData.length;
          }
          else if (EmpOrCpList.data.EmpOrCpList.length > 0) {
            vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(EmpOrCpList.data.EmpOrCpList);
            vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
          }

          // must set after new data comes
          vm.totalSourceDataCount = EmpOrCpList.data.Count;
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

      /* To Load Data on Grid. */
      vm.loadData = () => {
        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        $scope.cgBusyLoading = ContactPersonFactory.retrieveEmployeeContactpersonList().query(vm.pagingInfo).$promise.then((response) => {
          if (response && response.data) {
            setDataAfterGetAPICall(response, false);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* To get data on scroll down in grid */
      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        $scope.cgBusyLoading = ContactPersonFactory.retrieveEmployeeContactpersonList().query(vm.pagingInfo).$promise.then((response) => {
          if (response && response.data) {
            setDataAfterGetAPICall(response, true);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* Refresh Grid on Save Employee */
      const refreshGrid = $scope.$on('refreshGrid', () => {
        vm.loadData();
      });

      /* Destroy Event */
      $scope.$on('$destroy', () => {
        refreshGrid();
      });
    }
  }
})();
