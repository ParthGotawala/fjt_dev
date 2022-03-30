(function () {
  'use strict';
  angular
    .module('app.core')
    .controller('rfqListChangeHistoryPopupController', RfqListChangeHistoryPopupController);

  /** @ngInject */
  function RfqListChangeHistoryPopupController($q, $scope, $timeout, $mdDialog, data, CORE, USER, BaseService, RFQFactory, RFQTRANSACTION, DialogFactory, WORKORDER) {
    var vm = this;
    vm.isHideDelete = true;
    vm.ViewDiffOfChange = true;
    vm.headerdata = [];
    vm.quoteGroup = data ? data.quoteGroup : null;
    vm.rfqAssyID = data ? data.rfqAssyID : null;
    vm.partId = data ? data.partId : null;
    vm.mfgType = data ? data.mfgType : null;
    vm.rohsIcon = data ? data.rohsIcon : null;
    vm.rohsName = data ? data.rohsName : null;
    vm.LabelConstant = CORE.LabelConstant.Assembly;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.EmptyMesssage = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.RFQ_HISTORY;
    vm.ComponentHistoryModel = {};
    vm.DateTimeFormat = _dateTimeDisplayFormat;
    vm.setScrollClass = 'gridScrollHeight_Component';
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;

    vm.goToComponentDetail = () => {
      BaseService.goToComponentDetailTab(vm.mfgType.toLowerCase(), vm.partId, USER.PartMasterTabs.Detail.Name);
    };
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };

    vm.goToRFQ = () => {
      BaseService.openInNew(RFQTRANSACTION.RFQ_MANAGE_STATE, { id: vm.quoteGroup, rfqAssyId: vm.rfqAssyID });
      return false;
    };

    if (data) {
      vm.headerdata = [{
        label: vm.LabelConstant.QuoteGroup,
        value: vm.quoteGroup,
        displayOrder: 1,
        labelLinkFn: null,
        valueLinkFn: vm.goToRFQ,
        valueLinkFnParams: null,
        isCopy: false,
        copyParams: null,
        imgParms: null
      }, {
        label: vm.LabelConstant.ID,
        value: data.PIDCode,
        displayOrder: 1,
        labelLinkFn: vm.goToPartList,
        valueLinkFn: vm.goToComponentDetail,
        valueLinkFnParams: null,
        isCopy: true,
        copyParams: null,
        imgParms: {
          imgPath: vm.rohsIcon,
          imgDetail: vm.rohsName
        }
      }, {
        label: vm.LabelConstant.Assy,
        value: data.mfgPN,
        displayOrder: 2,
        labelLinkFn: vm.goToPartList,
        valueLinkFn: vm.goToComponentDetail,
        valueLinkFnParams: null,
        isCopy: true,
        copyParams: null,
        imgParms: {
          imgPath: vm.rohsIcon,
          imgDetail: vm.rohsName
        }
      }];
    }

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),

        SortColumns: [['updatedAt', 'DESC']],
        SearchColumns: []
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
      enableCellEdit: false,
      enableCellEditOnFocus: false,
      exporterCsvFilename: null,
      exporterMenuCsv: false,
      enableGrouping: false,
      enableColumnMenus: true
    };

    vm.sourceHeader = [
      {
        field: 'Action',
        cellClass: 'gridCellColor',
        displayName: 'Action',
        width: '85',
        cellTemplate: '<grid-action-view grid="grid" row="row"></grid-action-view>',
        enableFiltering: false,
        enableSorting: false,
        exporterSuppressExport: true,
        pinnedLeft: true
      },
      {
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
        enableFiltering: false,
        enableSorting: false
      }, {
        field: 'Colname',
        displayName: 'Field Name',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '250'
      },
      {
        field: 'Oldval',
        displayName: 'Old Value',
        cellTemplate: '<span class="ui-grid-cell-contents text-left" ng-bind-html="row.entity.Oldval"></span>',
        width: '300',
        type: 'html'
      },
      {
        field: 'Newval',
        displayName: 'New Value',
        cellTemplate: '<span class="ui-grid-cell-contents text-left" ng-bind-html="row.entity.Newval"></span>',
        width: '300'
      },
      {
        field: 'createdAt',
        displayName: 'Modified Date',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DateTimeFormat}}</div>',
        enableFiltering: false,
        width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE
      },
      {
        field: 'ModifiedUser',
        displayName: 'Modified By',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY
      }];

    function setDataAfterGetAPICall(rfqType, isGetDataDown) {
      if (rfqType && rfqType.data.rfqHistory) {
        if (!isGetDataDown) {
          vm.sourceData = BaseService.getFormatedHistoryDataList(rfqType.data.rfqHistory);
          vm.currentdata = vm.sourceData.length;
        }
        else if (rfqType.data.rfqHistory.length > 0) {
          rfqType.data.rfqHistory = BaseService.getFormatedHistoryDataList(rfqType.data.rfqHistory);
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(rfqType.data.rfqHistory);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }

        // must set after new data comes
        vm.totalSourceDataCount = rfqType.data.Count;
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
            vm.emptyState = 0;
          }
        }
        else {
          vm.isNoDataFound = false;
          vm.emptyState = null;
        }
        $timeout(() => {
          vm.resetSourceGrid();
          if (!isGetDataDown) {
            if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
            }
          }
          else {
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount !== vm.currentdata ? true : false);
          }
        });
      }
    }

    /* retrieve data list*/
    vm.loadData = () => {
      if (vm.pagingInfo.SortColumns.length === 0) {
        vm.pagingInfo.SortColumns = [['updatedAt', 'DESC']];
      }
      vm.pagingInfo.id = vm.rfqAssyID;
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = RFQFactory.getRfqListHistory().query(vm.pagingInfo).$promise.then((response) => {
        if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          setDataAfterGetAPICall(response, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* load more data on mouse scroll */
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.pagingInfo.id = vm.rfqAssyID;
      vm.cgBusyLoading = RFQFactory.getRfqListHistory().query(vm.pagingInfo).$promise.then((response) => {
        setDataAfterGetAPICall(response, true);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.openDifferenceOfChange = (row, ev) => {
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
        ev,
        data).then(() => 1, () => {
        }, (error) => BaseService.getErrorLog(error));
    };

    vm.fab = {
      Status: false
    };

    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, {
        closeAll: true
      });
    });

    vm.cancel = () => {
      BaseService.currentPagePopupForm.pop();
      DialogFactory.closeDialogPopup();
    };
  }
})();
