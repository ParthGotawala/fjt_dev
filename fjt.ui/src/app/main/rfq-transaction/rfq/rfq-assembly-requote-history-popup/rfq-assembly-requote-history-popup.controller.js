(function () {
  'use strict';
  angular
    .module('app.rfqtransaction')
    .controller('AssemblyRequoteHistoryPopupController', AssemblyRequoteHistoryPopupController);
  /** @ngInject */
  function AssemblyRequoteHistoryPopupController($state, $window, $log, $sce, $filter, $rootScope, $mdDialog, $scope, $timeout, CORE, USER, BOMFactory, RFQTRANSACTION, data, BaseService, DialogFactory) {
    const vm = this;
    vm.EmptyMesssage = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.NO_QUOTE_SUMMARY_HISTORY;
    vm.DateFormatArray = _dateDisplayFormat;
    const rfqAssyID = data.rfqAssyID;
    vm.Customer = data.Customer;
    vm.customerID = data.customerID;
    vm.PIDcode = data.PIDCode;
    vm.labelConstant = CORE.LabelConstant;
    vm.AssyLabelConstant = CORE.LabelConstant.Assembly;
    vm.mfgPN = data.mfgPN;
    vm.partID = data.partID;
    vm.rohsIcon = data.rohsIcon;
    vm.QuoteGroup = data.quoteGroup;
    vm.rohsName = data.rohsName;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.isHideDelete = true;
    vm.isAssyAssyQuoteHistory = true;
    vm.quotePageType = RFQTRANSACTION.QUOTE_PAGE_TYPE;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;

    vm.sourceHeader = [{
      field: 'Action',
      cellClass: 'gridCellColor',
      displayName: 'Action',
      width: '80',
      cellTemplate: '<grid-action-view grid="grid" row="row"></grid-action-view>',
      enableFiltering: false,
      enableSorting: false,
      exporterSuppressExport: true,
      pinnedLeft: true
    }, {
      field: '#',
      width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
      cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
      enableFiltering: false,
      enableSorting: false
    }, {
      field: 'quoteInDate',
      width: '150',
      displayName: 'Quote Entry Date',
      enableFiltering: false,
      cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.quoteInDate | date:grid.appScope.$parent.vm.DateFormatArray}}</div>',
      type: 'date'
    }, {
      field: 'quoteDueDate',
      width: '150',
      displayName: 'Quote Due Date',
      enableFiltering: false,
      cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.quoteDueDate | date:grid.appScope.$parent.vm.DateFormatArray}}</div>',
      type: 'date'
    }, {
      field: 'quoteNumber',
      displayName: 'Last Quote#',
      cellTemplate: '<a class="ui-grid-cell-contents text-left cursor-pointer" ng-click="grid.appScope.$parent.vm.getAssyQuoteHistory(row.entity,$event)">{{COL_FIELD}}</a>',
      width: '120'
    }, {
      field: 'internalversion',
      displayName: 'Quoted Internal Version',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '150'
    }, {
      field: 'liveVersion',
      displayName: 'Current Internal Version',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '150'
    }, {
      field: 'Age',
      width: '115',
      displayName: 'Quote Age',
      enableFiltering: true,
      cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>'
    }, {
      field: 'quoteSubmitDate',
      width: '180',
      displayName: 'Quote Submitted Date',
      enableFiltering: false,
      cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.quoteSubmitDate | date:grid.appScope.$parent.vm.DateFormatArray}}</div>',
      type: 'date'
    }, {
      field: 'quoteSubmittedBy',
      width: '180',
      displayName: 'Quote Submitted By',
      cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>'
    }];

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['id', 'DESC']],
        SearchColumns: [],
        rfqAssyID: rfqAssyID
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
      exporterCsvFilename: 'Assembly Revised Quote History.csv'
    };

    /* retrieve reQuote history list*/
    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = BOMFactory.getAssemblyRequoteHistory().query(vm.pagingInfo).$promise.then((res) => {
        if (res.data && res.data.reQuoteHistory) {
          vm.sourceData = res.data.reQuoteHistory;
          vm.totalSourceDataCount = res.data.reQuoteHistory.length;
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
              if (vm.isNoDatainFilter) {
                vm.isNoDataFound = false;
                vm.emptyState = 0;
              } else {
                vm.isNoDataFound = true;
                vm.emptyState = null;
              }
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

    vm.viewRecord = (item, noteType, $event) => {
      const model = {
        title: noteType,
        isDisabled: true
      };
      if (noteType === 'BOM Issues') {
        model.data = item.BOMIssues;
      }
      if (noteType === 'Other Notes') {
        model.data = item.OtherNotes;
      }
      DialogFactory.dialogService(
        CORE.TEXT_ANGULAR_ELEMENT_MODAL_CONTROLLER,
        CORE.TEXT_ANGULAR_ELEMENT_MODAL_VIEW,
        $event,
        model).then(() => {
        }, (error) => BaseService.getErrorLog(error));
    };

    vm.getAssyQuoteHistory = (row) => {
      BaseService.openInNew(RFQTRANSACTION.QUOTE_SUMMARY_DETAIL_STATE, { id: row.rfqAssyID, quoteSubmittedID: row.id, pageType: vm.quotePageType.QUOTE.Name });
    };

    //go to manage part number
    vm.goToAssyMaster = () => {
        BaseService.goToComponentDetailTab(null, vm.partID);
      return false;
    };

    //go to assy list
    vm.goToAssyList = () => {
        BaseService.goToPartList();
      return false;
    };

    // go to customer
    vm.goToCustomer = () => {
      BaseService.goToCustomer(vm.customerID);
      return false;
    };

    //redirect to customer list
    vm.goToCustomerList = () => {
      BaseService.goToCustomerList();
      return false;
    };

    vm.goToRFQ = () => {
      BaseService.openInNew(RFQTRANSACTION.RFQ_MANAGE_STATE, { id: vm.QuoteGroup, rfqAssyId: rfqAssyID });
      return false;
    };

    vm.headerdata = [];
    vm.headerdata.push({
      label: vm.AssyLabelConstant.QuoteGroup,
      value: vm.QuoteGroup,
      displayOrder: 1,
      labelLinkFn: null,
      valueLinkFn: vm.goToRFQ,
      valueLinkFnParams: null,
      isCopy: false,
      copyParams: null,
      imgParms: null
    }, {
      label: vm.labelConstant.Customer.Customer,
      value: vm.Customer,
      displayOrder: 1,
      labelLinkFn: vm.goToCustomerList,
      valueLinkFn: vm.goToCustomer,
      valueLinkFnParams: null,
      isCopy: false,
      copyParams: null,
      imgParms: null
    }, {
      label: vm.labelConstant.Assembly.ID,
      value: vm.PIDcode,
      displayOrder: 1,
      labelLinkFn: vm.goToAssyList,
      valueLinkFn: vm.goToAssyMaster,
      valueLinkFnParams: null,
      isCopy: true,
      isCopyAheadLabel: false,
      isAssy: true,
      imgParms: {
        imgPath: vm.rohsImagePath + vm.rohsIcon,
        imgDetail: vm.rohsName
      }
    }, {
      label: vm.labelConstant.Assembly.MFGPN,
      value: vm.mfgPN,
      displayOrder: 1,
      labelLinkFn: vm.goToAssyList,
      valueLinkFn: vm.goToAssyMaster,
      valueLinkFnParams: null,
      isCopy: true,
      isCopyAheadLabel: false,
      isAssy: true,
      imgParms: {
        imgPath: vm.rohsImagePath + vm.rohsIcon,
        imgDetail: vm.rohsName
      }
    });

    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
