(function () {
  'use strict';

  angular
    .module('app.admin.supplierlimit')
    .controller('SupplierLimitController', SupplierLimitController);

  /** @ngInject */
  function SupplierLimitController($q, $filter, $timeout, CORE, USER, SupplierLimitFactory, ManufacturerFactory, BaseService) {
    const vm = this;
    vm.isHideDelete = true;
    vm.isNoDataFound = false;
    vm.isloadPage = true;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.SUPPLIERLIMITS;
    vm.gridConfig = CORE.gridConfig;
    vm.CORE_MESSAGE_CONSTANT = angular.copy(CORE.MESSAGE_CONSTANT);
    vm.MAX_DATE_TODAY_DATE = stringFormat(vm.CORE_MESSAGE_CONSTANT.MAX_DATE_TODAY_DATE, 'From Date', 'To Date');
    vm.MAX_DATE_TODAY_DATE_TODATE = stringFormat(vm.CORE_MESSAGE_CONSTANT.MAX_DATE_TODAY_DATE, 'To Date', 'Today');
    vm.CORE_MESSAGE_CONSTANT.MIN_DATE_TODAY_DATE = stringFormat(vm.CORE_MESSAGE_CONSTANT.MIN_DATE_TODAY_DATE, 'To Date', 'From Date');
    vm.DefaultDateTimeFormat = CORE.KitExportDateFormat;
    vm.loginUser = BaseService.loginUser;
    vm.setScrollClass = 'gridScrollHeight_Supplier_Limit';
    vm.dateFilterOptionList = CORE.DATE_FILTER_LIST;
    vm.dateFilterObj = CORE.DATE_FILTER_OBJ;
    vm.dateFilter = {
      toDate: null,
      fromDate: null,
      today: new Date(),
      uiMask: '99/99/99',
      uiMaskFormat: 'MM/dd/yy'
    };
    vm.supplierLimitQuery = {
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
        minDate: vm.dateFilter.fromDate,
        maxDate: new Date()
      };
    };
    initDateOption();

    // check date vallidation
    vm.checkDateValidation = (type) => {
      const fromDate = vm.dateFilter.fromDate ? new Date($filter('date')(vm.dateFilter.fromDate, vm.DefaultDateTimeFormat)) : vm.filtersInfo.fromDate.$viewValue ? new Date($filter('date')(vm.filtersInfo.fromDate.$viewValue, vm.DefaultDateTimeFormat)) : null;
      const toDate = vm.dateFilter.toDate ? new Date($filter('date')(vm.dateFilter.toDate, vm.DefaultDateTimeFormat)) : vm.filtersInfo.toDate.$viewValue ? new Date($filter('date')(vm.filtersInfo.toDate.$viewValue, vm.DefaultDateTimeFormat)) : null;
      if (vm.filtersInfo) {
        if (vm.filtersInfo.fromDate && vm.filtersInfo.toDate && fromDate && toDate) {
          if (type && fromDate <= toDate) {
            vm.dateFilter.toDate = toDate;
            vm.filtersInfo.toDate.$setValidity('minvalue', true);
          }
          if (type && fromDate > toDate) {
            vm.dateFilter.fromDate = fromDate;
            vm.filtersInfo.fromDate.$setValidity('maxvalue', false);
          }
          if (!type && fromDate <= toDate) {
            vm.dateFilter.fromDate = fromDate;
            vm.filtersInfo.fromDate.$setValidity('maxvalue', true);
          }
          if (!type && fromDate > toDate) {
            vm.dateFilter.toDate = toDate;
            vm.filtersInfo.toDate.$setValidity('minvalue', false);
          }
        }
      }
    };

    /*On changing To Date */
    vm.fromDateChanged = () => {
      initDateOption();
      vm.checkDateValidation(true);
      vm.fromDateOptions.fromDateOpenFlag = false;
      vm.isdateChange = true;
      vm.autoCompleteDateFilter.keyColumnId = CORE.DATE_FILTER_OBJ.CUSTOM.ID;
    };

    /*On changing From Date */
    vm.toDateChanged = () => {
      initDateOption();
      vm.checkDateValidation(false);
      vm.toDateOptions.toDateOpenFlag = false;
      vm.isdateChange = true;
      vm.autoCompleteDateFilter.keyColumnId = CORE.DATE_FILTER_OBJ.CUSTOM.ID;
    };

    /*reset Advance filter */
    vm.resetAdvanceFilter = () => {
      vm.dateFilter.fromDate = null;
      vm.dateFilter.toDate = null;
      vm.supplierLimitQuery.fromDate = null;
      vm.supplierLimitQuery.toDate = null;
      vm.autoCompletePricingDist.keyColumnId = null;
      vm.autoCompleteDateFilter.keyColumnId = CORE.DATE_FILTER_OBJ.CUSTOM.ID;
      vm.loadData();
    };

    /*search Advance filter */
    vm.applyAdvanceFilter = () => {
      if (vm.dateFilter.fromDate) {
        vm.supplierLimitQuery.fromDate = BaseService.getAPIFormatedDate(vm.dateFilter.fromDate);
      } else {
        vm.supplierLimitQuery.fromDate = null;
      }
      if (vm.dateFilter.toDate) {
        vm.supplierLimitQuery.toDate = BaseService.getAPIFormatedDate(vm.dateFilter.toDate);
      } else {
        vm.supplierLimitQuery.toDate = null;
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
      field: 'supplierName',
      width: '100',
      displayName: 'Supplier',
      cellTemplate: '<div class="ui-grid-cell-contents text-left"> {{COL_FIELD}}</div>',
      enableFiltering: false
    },
    {
      field: 'clientID',
      width: '550',
      displayName: 'API Key',
      cellTemplate: '<div class="ui-grid-cell-contents text-left"> {{COL_FIELD}}</div>',
      enableFiltering: true
    },
    {
      field: 'currentDate',
      width: '140',
      displayName: 'Date Of API Request',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      type: 'datetime',
      enableFiltering: false,
      enableSorting: true
    },
    {
      field: 'totalCall',
      width: '130',
      displayName: 'API Requests Sent',
      cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right"> {{COL_FIELD}}</div>',
      enableFiltering: true,
      ColumnDataType: 'Number'
    },
    {
      field: 'limitExceedText',
      width: '140',
      displayName: 'Limit Exceed',
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
        + '<span  ng-class="{\'label-box label-warning\':(!row.entity.isLimitExceed),\
                        \'label-box label-success\':(row.entity.isLimitExceed)}"> \
                            {{COL_FIELD}}'
        + '</span>'
        + '</div>',
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        term: null,
        options: CORE.ShippingInsuranceDropDown
      },
      ColumnDataType: 'StringEquals',
      enableFiltering: true
    },
    {
      field: 'exceedCallNumber',
      width: '150',
      displayName: 'Successful API Response Received',
      cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right"> {{COL_FIELD}}</div>',
      enableFiltering: true,
      ColumnDataType: 'Number'
      },
      {
        field: 'callLimit',
        width: '150',
        displayName: 'API Requests Limit',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right"> {{COL_FIELD}}</div>',
        enableFiltering: true
      }
    ];

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['currentDate', 'DESC']],
        SearchColumns: []
      };
    };

    initPageInfo();

    vm.gridOptions = {
      showColumnFooter: false,
      enableCellEditOnFocus: true,
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: false,
      multiSelect: false,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: 'Supplier Limit.csv'
    };

    vm.loadData = () => {
      if (vm.pagingInfo.SortColumns.length === 0) {
        vm.pagingInfo.SortColumns = [['currentDate', 'DESC']];
      };
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.supplierLimitQuery.supplierID = (vm.autoCompletePricingDist && vm.autoCompletePricingDist.keyColumnId) ? vm.autoCompletePricingDist.keyColumnId : null;
      vm.cgBusyLoading = SupplierLimitFactory.SupplierLimits(vm.pagingInfo).query(vm.supplierLimitQuery).$promise.then((response) => {
        vm.sourceData = [];
        if (response && response.data) {
          setDataAfterGetAPICall(response, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = SupplierLimitFactory.SupplierLimits(vm.pagingInfo).query(vm.supplierLimitQuery).$promise.then((response) => {
        if (response && response.data && response.data.result) {
          setDataAfterGetAPICall(response, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICall = (supplierLimit, isGetDataDown) => {
      if (supplierLimit && supplierLimit.data && supplierLimit.data.result) {
        if (!isGetDataDown) {
          vm.sourceData = supplierLimit.data.result;
          vm.currentdata = vm.sourceData.length;
        }
        else if (supplierLimit.data.result.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(supplierLimit.data.result);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }

        // must set after new data comes
        vm.totalSourceDataCount = supplierLimit.data.Count;

        _.each(vm.sourceData, (item) => {
          item.currentDate = $filter('date')(item.currentDate, vm.DefaultDateTimeFormat);
        });
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
          if (vm.pagingInfo.SearchColumns.length > 0 || vm.autoCompletePricingDist.keyColumnId || (vm.dateFilter.fromDate || vm.supplierLimitQuery.toDate)) {
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
    //get data for mfgcode
    vm.getSupplierCode = () => {
      var searchObj = {
        mfgType: CORE.MFG_TYPE.DIST,
        isCodeFirst: true,
        isPricingApi: true
      };
      return ManufacturerFactory.getAllManufacturerWithFormattedCodeList(searchObj).query().$promise.then((mfgcodes) => {
        vm.SupplierList = [];
        if (mfgcodes && mfgcodes.data) {
          vm.SupplierList = mfgcodes.data;
        }
        if (!vm.autoCompletePricingDist) {
          initAutoComplete();
        }
        return $q.resolve(vm.SupplierList);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const initAutoComplete = () => {
      vm.autoCompletePricingDist = {
        columnName: 'mfgCodeName',
        controllerName: CORE.MANAGE_MFGCODE_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_MFGCODE_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'Supplier',
        placeholderName: 'Supplier',
        isRequired: false,
        isAddnew: false,
        isUppercaseSearchText: true,
        addData: {
          mfgType: CORE.MFG_TYPE.DIST,
          popupAccessRoutingState: [USER.ADMIN_MANAGESUPPLIER_DETAIL_STATE],
          pageNameAccessLabel: CORE.PageName.supplier
        },
        callbackFn: function () {
          return vm.getSupplierCode();
        }
      };
      vm.autoCompleteDateFilter = {
        columnName: 'Value',
        keyColumnName: 'ID',
        keyColumnId: 1,
        inputName: 'DateFilter',
        placeholderName: 'DateFilter',
        isRequired: false,
        isAddnew: false,
        onSelectCallbackFn: setDateAsPerFilter
      };
    };
    vm.getSupplierCode();

    const setDateAsPerFilter = (item) => {
      const filterDate = BaseService.getDateFilterOptions(item);
      if (!vm.isdateChange) {
        vm.dateFilter.fromDate = filterDate.fromDate;
        vm.dateFilter.toDate = filterDate.toDate;
        vm.supplierLimitQuery.fromDate = filterDate.fromDate;
        vm.supplierLimitQuery.toDate = filterDate.toDate;
      }
      vm.isdateChange = false;
      if (vm.isloadPage) {
        vm.isloadPage = false;
        vm.loadData();
      }
    };

    //link to go supplier list page
    vm.goToSupplierList = () => {
      BaseService.goToSupplierList();
    };
  }
})();
