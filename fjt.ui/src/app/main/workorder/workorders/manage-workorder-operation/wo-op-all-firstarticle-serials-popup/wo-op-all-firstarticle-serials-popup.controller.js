(function () {
  'use strict';

  angular
    .module('app.workorder.workorders')
    .controller('WOOPAllFirstArticleSerialsPopupController', WOOPAllFirstArticleSerialsPopupController);

  /** @ngInject */
  function WOOPAllFirstArticleSerialsPopupController($mdDialog, $timeout, CORE, data, BaseService, WORKORDER, WorkorderOperationFirstPieceFactory, DialogFactory) {
    const vm = this;
    vm.popupParamData = data;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = CORE.LabelConstant;
    vm.EmptyMesssageForFirstArticleSerials = WORKORDER.WORKORDER_EMPTYSTATE.FIRST_ARTICLE;
    vm.isHideDelete = true;
    const WoOpFirstArticleStatusGridHeaderDropdown = CORE.WoOpFirstArticleStatusGridHeaderDropdown;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;

    vm.sourceHeader = [{
      field: '#',
      width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
      cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
      enableFiltering: false,
      enableSorting: false
    },
    {
      field: 'opFullName',
      displayName: vm.LabelConstant.Operation.OP,
      width: 250
    },
    {
      field: 'serialno',
      displayName: 'Serial#',
      width: 125
    },
    {
      field: 'dateCode',
      displayName: 'Date Code',
      width: 80
    },
    {
      field: 'remark',
      displayName: 'Remark',
      cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-click="grid.appScope.$parent.vm.showDescription(row.entity, $event,\'remark\',\'Remark\')"> \
                                   View \
                                </md-button>',
      enableFiltering: false,
      enableSorting: false,
      exporterSuppressExport: true,
      width: '110'
    },
    {
      field: 'issue',
      displayName: 'Issues',
      cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-click="grid.appScope.$parent.vm.showDescription(row.entity, $event,\'issue\',\'Issue\')"> \
                                   View \
                                </md-button>',
      enableFiltering: false,
      enableSorting: false,
      exporterSuppressExport: true,
      width: '110'
    },
    {
      field: 'resolution',
      displayName: 'Resolution',
      cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-click="grid.appScope.$parent.vm.showDescription(row.entity, $event,\'resolution\',\'Resolution\')"> \
                                   View \
                                </md-button>',
      enableFiltering: false,
      enableSorting: false,
      exporterSuppressExport: true,
      width: '110'
    },
    {
      field: 'currStatusConvertedText',
      displayName: 'Status',
      width: 130,
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        term: null,
        options: WoOpFirstArticleStatusGridHeaderDropdown
      }
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
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      enableSorting: true,
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
        SortColumns: [],
        SearchColumns: [],
        woId: data.woID
      };
    };
    initPageInfo();

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
      exporterCsvFilename: 'Work Order(' + vm.popupParamData.woNumber + '-' + vm.popupParamData.woVersion + ') First Article Serial#.csv'
    };

    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICall = (response, isGetDataDown) => {
      if (response && response.data && response.data.firstArticleAllSerialsList) {
        if (!isGetDataDown) {
          vm.sourceData = response.data.firstArticleAllSerialsList;
          vm.currentdata = vm.sourceData.length;
        }
        else if (response.data.firstArticleAllSerialsList.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(response.data.firstArticleAllSerialsList);
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

    /* retrieve work order transaction box serials list */
    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.pagingInfo.woID = vm.popupParamData.woID ? vm.popupParamData.woID : null;
      vm.cgBusyLoading = WorkorderOperationFirstPieceFactory.getWOAllFirstPieceSerialsDet().query(vm.pagingInfo).$promise.then((response) => {
        if (response && response.data) {
          setDataAfterGetAPICall(response, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //call once scroll down on grid
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = WorkorderOperationFirstPieceFactory.getWOAllFirstPieceSerialsDet().query(vm.pagingInfo).$promise.then((response) => {
        if (response && response.data) {
          setDataAfterGetAPICall(response, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };


    /* Show Description*/
    vm.showDescription = (object, ev, field, displayName) => {
      const obj = {
        title: 'Serial',
        description: object[field],
        name: displayName
      };
      const data = obj;
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        data).then(() => {
          initPageInfo();
          vm.loadData();
        }, (err) => {
          BaseService.getErrorLog(err);
        });
    };


    /*close pop up*/
    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
