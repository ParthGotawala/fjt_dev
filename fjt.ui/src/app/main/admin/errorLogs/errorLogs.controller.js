(function () {
  'use strict';

  angular
    .module('app.admin.errorLogs')
    .controller('ErrorLogsController', ErrorLogsController);

  /** @ngInject */
  function ErrorLogsController($mdDialog, $scope, $q, $filter, $timeout, CORE, USER, ErrorLogsFactory, DialogFactory, BaseService) {
    const vm = this;
    vm.isHideDelete = true;
    vm.isNoDataFound = false;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.ERRORLOGS;
    vm.CORE_MESSAGE_CONSTANT = angular.copy(CORE.MESSAGE_CONSTANT);
    vm.CORE_MESSAGE_CONSTANT.MAX_DATE_TODAY_DATE = stringFormat(vm.CORE_MESSAGE_CONSTANT.MAX_DATE_TODAY_DATE, 'From Date', 'To Date');
    vm.CORE_MESSAGE_CONSTANT.MIN_DATE_TODAY_DATE = stringFormat(vm.CORE_MESSAGE_CONSTANT.MIN_DATE_TODAY_DATE, 'To Date', 'From Date');
    vm.DefaultDateTimeFormat = _dateTimeDisplayFormat;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
    vm.isAPILog = true;
    vm.dateFilter = {
      toDate: null,
      fromDate: null,
      uiMask: '99/99/9999 99:99',
      uiMaskFormat: 'MM/dd/yyyy HH:mm'
    };
    vm.errorLogQuery = {
      toDate: null,
      fromDate: null
    };

    /*Constraint for datepicker */
    const initDateOption = () => {
      vm.fromDateOptions = {
        appendToBody: true,
        fromDateOpenFlag: false,
        maxDate: vm.dateFilter.toDate
      };
      vm.toDateOptions = {
        appendToBody: true,
        toDateOpenFlag: false,
        minDate: vm.dateFilter.fromDate
      };
    };
    initDateOption();

    vm.checkDateValidation = (type) => {
      if (vm.filtersInfo) {
        if (vm.filtersInfo.fromDate && vm.filtersInfo.toDate && vm.dateFilter.fromDate && vm.dateFilter.toDate) {
          if (type && vm.dateFilter.fromDate <= vm.dateFilter.toDate) {
            vm.filtersInfo.toDate.$setValidity('minvalue', true);
          }
          if (type && vm.dateFilter.fromDate > vm.dateFilter.toDate) {
            vm.filtersInfo.fromDate.$setValidity('maxvalue', false);
          }
          if (!type && vm.dateFilter.fromDate <= vm.dateFilter.toDate) {
            vm.filtersInfo.fromDate.$setValidity('maxvalue', true);
          }
          if (!type && vm.dateFilter.fromDate > vm.dateFilter.toDate) {
            vm.filtersInfo.toDate.$setValidity('minvalue', false);
          }
        }
      }
    };

    /*On changing To Date */
    vm.fromDateChanged = () => {
      initDateOption();
      vm.checkDateValidation(true);
      vm.fromDateOptions.fromDateOpenFlag = true;
    };

    /*On changing From Date */
    vm.toDateChanged = () => {
      initDateOption();
      vm.checkDateValidation(false);
      vm.toDateOptions.toDateOpenFlag = true;
    };

    /*reset Advance filter */
    vm.resetAdvanceFilter = () => {
      vm.dateFilter.fromDate = null;
      vm.dateFilter.toDate = null;
      vm.isCheckAll = false;
      vm.loadData();
    };

    /*search Advance filter */
    vm.applyAdvanceFilter = () => {
      initPageInfo();
      if (vm.dateFilter.fromDate) {
        vm.errorLogQuery.fromDate = new Date(vm.dateFilter.fromDate).toGMTString();//BaseService.getAPIFormatedDate(vm.dateFilter.fromDate);
      } else {
        vm.errorLogQuery.fromDate = null;
      }
      if (vm.dateFilter.toDate) {
        vm.errorLogQuery.toDate = new Date(vm.dateFilter.toDate).toGMTString();//BaseService.getAPIFormatedDate(vm.dateFilter.toDate);
      } else {
        vm.errorLogQuery.toDate = null;
      }
      const exceptionExist = vm.sourceHeader.some((a) => a.field === 'exception');
      if (vm.isAPILog) {
        if (exceptionExist) {
          vm.sourceHeader.splice(3, 1);
        }
      } else {
        if (!exceptionExist) {
          const exceptionMessage =
          {
            field: 'exception',
            width: '200',
            displayName: 'Exception',
            cellTemplate: '<div class="ui-grid-cell-contents text-left"> {{COL_FIELD}}</div>',
            enableFiltering: true
          };
          vm.sourceHeader.splice(3, 0, exceptionMessage);
        }
      }
      vm.loadData();
    };

    vm.sourceHeader = [{
      field: '#',
      width: '60',
      cellTemplate: '<div class="ui-grid-cell-contents text-left"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
      enableSorting: false,
      enableFiltering: false
    },
    {
      field: 'level',
      width: '100',
      displayName: 'Log Type',
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center" >' +
        '<span class="label-box" ng-class="{\'label-danger\':row.entity.level==\'error\' || row.entity.level==\'Error\',\'label-warn\':row.entity.level==\'warning\'}">{{COL_FIELD | uppercase }}</span></div>',
      enableFiltering: true
    },
    {
      field: 'message',
      width: '1320',
      displayName: 'Message',
      cellTemplate: '<div class="ui-grid-cell-contents text-left"> {{COL_FIELD}}</div>',
      enableFiltering: true
    },
    {
      field: '#',
      width: '110',
      displayName: '',
      cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-click="grid.appScope.$parent.vm.popup(row.entity, $event)">View</md-button>',
      enableFiltering: false,
      enableSorting: false
    },
    {
      field: 'timestamp',
      width: '180',
      displayName: 'Log Date',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      type: 'datetime',
      enableFiltering: false,
      enableSorting: true
    }];

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['timestamp', 'DESC']],
        SearchColumns: []
      };
    };

    initPageInfo();

    vm.popup = function (ErrorMsg, ev) {
      const data = {
        title: 'Message',
        label: 'Log Type',
        description: `${ErrorMsg.message} \n ${ErrorMsg.exception ? ErrorMsg.exception : ''}`,
        name: ErrorMsg.level,
        label2: 'Log Date',
        logTime: ErrorMsg.timestamp
      };
      // let data = obj;
      //data.label = 'Log Type';
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        data
      ).then(() => {
        if (!vm.gridOptionsUOM.enablePaging) {
          initPageInfo();
        }
        vm.loadData();
      }, (err) => BaseService.getErrorLog(err));
    };

    vm.gridOptions = {
      enablePaging: isEnablePagination,
      enablePaginationControls: isEnablePagination,
      showColumnFooter: false,
      enableCellEditOnFocus: true,
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: false,
      multiSelect: false,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: 'ErrorLog.csv'
    };

    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      if (vm.pagingInfo.SortColumns.length === 0) {
        vm.pagingInfo.SortColumns = [['timestamp', 'DESC']];
      };
      vm.pagingInfo.isGetAPILogs = vm.isAPILog;
      vm.cgBusyLoading = ErrorLogsFactory.Logs(vm.pagingInfo).query(vm.errorLogQuery).$promise.then((response) => {
        if (response && response.data.result) {
          _.each(response.data.result, (item) => {
            item.timestamp = BaseService.getUIFormatedDateTime(item.timestamp, vm.DefaultDateTimeFormat);
          });
          vm.sourceData = response.data.result;
          vm.totalSourceDataCount = response.data.Count;

          if (!vm.gridOptions.enablePaging) {
            vm.currentdata = vm.sourceData.length;
            vm.gridOptions.gridApi.infiniteScroll.resetScroll();
          }

          vm.gridOptions.clearSelectedRows();
          if (vm.totalSourceDataCount === 0) {
            if (vm.pagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
              vm.isNoDataFound = false;
              vm.emptyState = 0;
            } else {
              vm.isNoDataFound = true;
              vm.emptyState = null;
              vm.errorLogQuery.fromDate = null;
              vm.errorLogQuery.toDate = null;
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
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = ErrorLogsFactory.Logs(vm.pagingInfo).query(vm.errorLogQuery).$promise.then((response) => {
        _.each(response.data.result, (item) => {
          item.timestamp = BaseService.getUIFormatedDateTime(item.timestamp, vm.DefaultDateTimeFormat);
        });
        vm.sourceData = vm.sourceData.concat(response.data.result);
        vm.currentdata = vm.sourceData.length;
        vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
        $timeout(() => {
          vm.resetSourceGrid();
          return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount !== vm.currentdata ? true : false);
        });
      }).catch((error) => BaseService.getErrorLog(error));
    };
  }
})();
