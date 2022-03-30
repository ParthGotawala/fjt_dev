(function () {
  'use strict';

  angular
    .module('app.transaction.boxserialnumbers')
    .controller('BoxSerialNumbersHistoryPopupController', BoxSerialNumbersHistoryPopupController);

  /** @ngInject */
  function BoxSerialNumbersHistoryPopupController(data, $timeout, $mdDialog, CORE, TRANSACTION, BoxSerialNumbersFactory, BaseService) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = CORE.LabelConstant;
    vm.gridBoxScanSerialNumbersHistory = CORE.gridConfig.gridBoxScanSerialNumbersHistory;
    vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.SCAN_BOX_SERIAL_HISTORY;
    vm.SerialTypeLabel = CORE.SerialTypeLabel;
    vm.isHideDelete = true;
    vm.serialID = data && data.serialID ? data.serialID : null;
    vm.woBoxSerialID = data && data.woBoxSerialID ? data.woBoxSerialID : null;
    vm.cancel = () => {
      $mdDialog.cancel(null);
    };
    // ------------------------------------ [S] - Scan Serial Number ------------------------------------
    // vm.SerialTypeLabel.MFRSerial.Label : vm.SerialTypeLabel.FinalSerial.Label,
    vm.sourceHeader = [
      {
        field: '#',
        width: '60',
        cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
        enableFiltering: false,
        enableSorting: false
      },
      {
        field: 'uniqueID',
        displayName: 'Box ID',
        width: 120,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
      },
      {
        field: 'SerialNo',
        displayName: vm.SerialTypeLabel.MFRSerial.Label,
        width: 180,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
      },
      {
        field: 'finalSerialNo',
        displayName: vm.SerialTypeLabel.FinalSerial.Label,
        width: 180,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
      },
      {
        field: 'description',
        displayName: 'Description',
        width: 600,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
      }, {
        field: 'createdbyvalue',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableFiltering: false
      }, {
        field: 'createdAtvalue',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableFiltering: false
      }, {
        field: 'createdbyRole',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }
    ];
    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SearchColumns: [],
        SortColumns: [['createdAtvalue', 'desc']]
      };
    };
    initPageInfo();

    vm.gridOptions = {
      showColumnFooter: false,
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: false,
      multiSelect: false,
      filterOptions: vm.pagingInfo.SearchColumns
    };
    /* retrieve work order transaction serials list */
    vm.loadData = () => {
      vm.pagingInfo.serialID = vm.serialID;
      vm.pagingInfo.woBoxSerialID = vm.woBoxSerialID;
      vm.cgBusyLoading = BoxSerialNumbersFactory.retriveBoxSerialNoHistory(vm.pagingInfo).query().$promise.then((workorderSerials) => {
        if (workorderSerials && workorderSerials.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          vm.sourceData = workorderSerials.data.serialList;
          vm.totalSourceDataCount = workorderSerials.data.Count;
          setGridOptionsAfterGetData();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //call once scroll down on grid
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = BoxSerialNumbersFactory.retriveBoxSerialNoHistory(vm.pagingInfo).query({}).$promise.then((workorderSerials) => {
        vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(workorderSerials.data.serialList);
        vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        //vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
        $timeout(() => {
          vm.resetSourceGrid();
          return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount !== vm.currentdata ? true : false);
        });
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* Set Grid Option after data get */
    const setGridOptionsAfterGetData = () => {
      if (!vm.gridOptions.enablePaging) {
        vm.currentdata = vm.sourceData.length;
        vm.gridOptions.gridApi.infiniteScroll.resetScroll();
      }
      vm.gridOptions.clearSelectedRows();
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
        vm.resetSourceGrid();
        if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
          return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
        }
      });
    };
  }
})();
