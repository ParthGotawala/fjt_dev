(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('HelpBlogHistoryPopupController', HelpBlogHistoryPopupController);

  /** @ngInject */
  function HelpBlogHistoryPopupController(TRANSACTION, $mdDialog, DialogFactory, data, BaseService, CORE, $timeout, WORKORDER, HelpBlogFactory) {
    const vm = this;
    vm.id = data ? data.id : null;
    vm.isHideDelete = true;
    vm.ViewDiffOfChange = true;
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.HELPBLOGHISTORY;
    vm.gridConfig = CORE.gridConfig;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
    vm.headerdata = [];

    if (data) {
      vm.headerdata.push({
        value: data.title,
        label: 'Title',
        displayOrder: 1
      });
    }

    vm.showOldAndNewValue = (object, isNew) => {
      const obj = {
        title: isNew ? 'New Value' : 'Old Value',
        description: object
      };
      const data = obj;
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        null,
        data
      ).then(() => {

      }, (err) => BaseService.getErrorLog(err));
    };

    /* show value of section title in a popup */
    vm.showSectionTitleValue = (blogDescription) => {
      const obj = {
        title: 'Section Title',
        description: blogDescription
      };
      const data = obj;
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        null,
        data
      ).then(() => {

      }, (err) => BaseService.getErrorLog(err));
    };

    vm.sourceHeader = [
      {
        field: 'Action',
        cellClass: 'gridCellColor',
        displayName: 'Action',
        width: '75',
        cellTemplate: '<grid-action-view grid="grid" row="row"></grid-action-view>',
        enableFiltering: false,
        enableSorting: false,
        exporterSuppressExport: true,
        pinnedLeft: true
      },
      {
        field: '#',
        width: '50',
        cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
        enableFiltering: false,
        enableSorting: false
      },
      {
        field: 'sectionTitle',
        displayName: 'SectionTitle',
        cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
          '<span class="cursor-pointer bom-header-wrap">{{ COL_FIELD | htmlToPlaintext }}</span> &nbsp;' +
          '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.sectionTitle" ng-click="grid.appScope.$parent.vm.showSectionTitleValue(row.entity.sectionTitle)">' +
          '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
          '<md-tooltip>View</md-tooltip>' +
          '</button>' +
          '</div>',
        width: '150'
      },
      {
        field: 'Colname',
        displayName: 'Field Name',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '150'
      },
      {
        field: 'Oldval',
        displayName: 'Old Value',
        cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
          '<span class="cursor-pointer bom-header-wrap">{{ COL_FIELD | htmlToPlaintext }}</span> &nbsp;' +
          '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.Oldval" ng-click="grid.appScope.$parent.vm.showOldAndNewValue(row.entity.Oldval, false)">' +
          '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
          '<md-tooltip>View</md-tooltip>' +
          '</button>' +
          '</div>',
        width: '200',
        allowCellFocus: false
      },
      {
        field: 'Newval',
        displayName: 'New Value',
        cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
          '<span class="cursor-pointer bom-header-wrap">{{ COL_FIELD | htmlToPlaintext }}</span> &nbsp;' +
          '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.Newval" ng-click="grid.appScope.$parent.vm.showOldAndNewValue(row.entity.Newval, true)">' +
          '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
          '<md-tooltip>View</md-tooltip>' +
          '</button>' +
          '</div>',
        width: '200',
        allowCellFocus: false
      },
      {
        field: 'updatedAt',
        displayName: CORE.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
        width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        type: 'datetime',
        enableFiltering: false
      },
      {
        field: 'updatedby',
        displayName: CORE.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'updatedbyRole',
        displayName: CORE.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }];

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['ID', 'DESC']],
        SearchColumns: [],
        pageName: CORE.PAGENAME_CONSTANT[50].PageName,
        helpBlogId: vm.id,
        helpBlogDetId: data.helpBlogDetId
      };
    };

    initPageInfo();

    vm.gridOptions = {
      enablePaging: isEnablePagination,
      enablePaginationControls: isEnablePagination,
      showColumnFooter: false,
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: true,
      multiSelect: false,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: 'Help Blog History.csv'
    };

    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICall = (blogHistory, isGetDataDown) => {
      if (blogHistory && blogHistory.data && blogHistory.data.blogHistory) {
        if (!isGetDataDown) {
          vm.sourceData = blogHistory.data.blogHistory;
          vm.currentdata = vm.sourceData.length;
        }
        else if (blogHistory.data.blogHistory.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(blogHistory.data.blogHistory);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }

        // must set after new data comes
        vm.totalSourceDataCount = blogHistory.data.Count;
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

    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = HelpBlogFactory.getHelpBlogHistory().query(vm.pagingInfo).$promise.then((blogHistory) => {
        if (blogHistory && blogHistory.data) {
          setDataAfterGetAPICall(blogHistory, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = HelpBlogFactory.getHelpBlogHistory().query(vm.pagingInfo).$promise.then((blogHistory) => {
        if (blogHistory && blogHistory.data) {
          setDataAfterGetAPICall(blogHistory, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* Open pop-up for display difference of entry change */
    vm.openDifferenceOfChange = (row, $event) => {
      var data = {
        Colname: row.entity.Colname,
        Oldval: row.entity.Oldval,
        Newval: row.entity.Newval,
        Tablename: row.entity.Tablename,
        RefTransID: row.entity.RefTransID
      };

      DialogFactory.dialogService(
        WORKORDER.DIFFERENCE_OF_WORKORDER_CHANGE_POPUP_CONTROLLER,
        WORKORDER.DIFFERENCE_OF_WORKORDER_REVIEW_CHANGE_POPUP_VIEW,
        $event,
        data).then(() => {
        }, () => {
        }, (error) => BaseService.getErrorLog(error));
    };

    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
