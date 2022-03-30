(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('supplierQuoteSummaryGrid', supplierQuoteSummaryGrid);

  /** @ngInject */
  function supplierQuoteSummaryGrid(BaseService, $timeout, CORE, USER, TRANSACTION, DialogFactory, SupplierQuoteFactory, ManufacturerFactory, ComponentFactory, $mdDialog, $filter) {
    const directive = {
      restrict: 'E',
      replace: false,
      scope: {
        isNoDataFound: '='
      },
      templateUrl: 'app/directives/custom/supplier-quote-summary-grid/supplier-quote-summary-grid.html',
      controller: supplierQuoteSummaryGridCtrl,
      controllerAs: 'vm',
      link: function () {
      }
    };
    return directive;
    /** @ngInject */
    /**
    * Controller for view data of alternative details
    *
    * @param
    */
    function supplierQuoteSummaryGridCtrl($scope) {
      const vm = this;
      vm.supplierQuote = {};
      vm.isHideDelete = false;
      vm.isUpdatable = true;
      vm.generateFilterChip = false;
      vm.gridConfig = CORE.gridConfig;
      vm.DefaultDateFormat = _dateDisplayFormat;
      vm.LabelConstant = CORE.LabelConstant.SupplierQuote;
      vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.SUPPLIER_QUOTE;
      vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
      vm.supplierQuoteStatus = TRANSACTION.supplierQuoteStatusDropdown;
      vm.CheckSearchTypeList = TRANSACTION.CheckSearchType;
      vm.checkSerachSQType = vm.CheckSearchTypeList[1].id;
      vm.SupplierQuoteAdvanceFilter = angular.copy(TRANSACTION.SupplierQuoteAdvancedFilters);
      vm.loginUser = BaseService.loginUser;
      vm.draft = vm.published = false;
      vm.DATE_PICKER = angular.copy(CORE.DATE_PICKER);
      vm.IsFromPickerOpen = {};
      vm.IsFromPickerOpen[vm.DATE_PICKER.fromDate] = false;
      vm.IsToPickerOpen = {};
      vm.IsToPickerOpen[vm.DATE_PICKER.toDate] = false;
      vm.partIds = [];
      vm.EmptyMesssageFilter = USER.ADMIN_EMPTYSTATE.COMPONENT_FILTERS;
      const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;

      vm.todayDate = new Date();
      vm.fromDateOptions = {
        maxDate: vm.supplierQuote.toDate,
        appendToBody: true,
        fromDateOpenFlag: false
      };
      vm.toDateOptions = {
        minDate: vm.supplierQuote.fromDate,
        appendToBody: true,
        toDateOpenFlag: false
      };

      vm.fromDateChanged = () => {
        if (vm.supplierQuote.fromDate) {
          vm.toDateOptions.minDate = (vm.supplierQuote.fromDate ? vm.supplierQuote.fromDate : vm.todayDate);

          if (new Date(vm.supplierQuote.fromDate) > new Date(vm.supplierQuote.toDate)) {
            vm.supplierQuote.toDate = null;
          }
          if (!vm.supplierQuote.toDate) {
            vm.supplierQuote.toDate = null;
          }
        } else {
          vm.supplierQuote.toDate = null;
          vm.fromDateOptions.fromDateOpenFlag = false;
        }
      };

      vm.toDateChanged = () => {
        vm.toDateOptions.toDateOpenFlag = false;
      };

      //get max length validations
      vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

      const initPageInfo = () => {
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),
          SortColumns: [],
          SearchColumns: [],
          pageSize: CORE.UIGrid.ItemsPerPage(),
          isSummaryView: true
        };
      };
      initPageInfo();

      // go to supplier list page
      vm.goToSupplierList = () => {
        BaseService.goToSupplierList();
      };

      // go to supplier page
      vm.goToSupplier = (supplierID) => {
        BaseService.goToSupplierDetail(supplierID);
      };

      // go to manufacturer page
      vm.goToManufacturer = (id) => {
        BaseService.goToManufacturer(id);
      };

      // go to supplier quote detail page
      vm.goToSupplierQuoteDetail = (id) => {
        BaseService.goToSupplierQuoteWithPartDetail(id);
      };

      // go to supplier part detail tab
      vm.goToSupplierDetailTab = (quoteNumber) => {
        BaseService.openInNew(TRANSACTION.TRANSACTION_SUPPLIER_QUOTE_DETAILLIST_STATE, { quote: quoteNumber });
      };

      vm.advanceFilterSearch = () => {
        vm.callLoadData = true;
        if (!vm.supplierQuoteFilterInfo.$valid && BaseService.focusRequiredField(vm.supplierQuoteFilterInfo)) {
          return;
        }
        initPageInfo();
        if (vm.gridOptions && vm.gridOptions.gridApi) {
          _.each(vm.gridOptions.gridApi.grid.columns, (col) => {
            if (!_.isEmpty(col.filters[0].term)) {
              vm.callLoadData = false;
              col.filters[0].term = undefined;
            }
          });
        }
        vm.loadData();
      };

      // search list page for supplier
      vm.searchsupplierList = () => {
        const supplierListToFilter = angular.copy(vm.supplierCodeDetail);
        vm.supplierCodeListToDisplay = vm.supplierSearchText ? _.filter(supplierListToFilter, (item) => item.mfgCodeName.toLowerCase().contains(vm.supplierSearchText.toLowerCase())) : supplierListToFilter;
      };

      vm.clearsupplierSearchText = () => {
        vm.supplierSearchText = undefined;
        vm.searchsupplierList();
      };

      vm.clearSupplierFilter = () => {
        vm.supplierCodeDetailModel = [];
        if (vm.pagingInfo.supplierIds) {
          vm.advanceFilterSearch();
        }
      };

      vm.searchMfrPn = (query) => {
        const searchObj = {
          query: query,
          mfgType: CORE.MFG_TYPE.MFG
        };
        return ComponentFactory.getComponentMFGPIDCodeAliasSearch().query({ listObj: searchObj }).$promise.then((component) => {
          if (component && component.data) {
            component.data.data = _.differenceWith(component.data.data, vm.partIds, (arrValue, othValue) => arrValue.id === othValue.id);
            return component.data.data;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* supplier drop-down fill up */
      vm.getMfgSearch = () => {
        vm.supplierSearchText = undefined;
        const searchObj = {
          mfgType: CORE.MFG_TYPE.DIST,
          isCodeFirst: true
        };
        return ManufacturerFactory.getAllManufacturerWithFormattedCodeList(searchObj).query().$promise.then((mfgcodes) => {
          vm.supplierCodeDetail = mfgcodes.data;
          vm.supplierCodeListToDisplay = angular.copy(vm.supplierCodeDetail);
        }).catch((error) => BaseService.getErrorLog(error));
      };

      //remove selected filter chip
      vm.removeAppliedFilter = (item) => {
        if (item) {
          item.isDeleted = true;
          switch (item.value) {
            case vm.SupplierQuoteAdvanceFilter.Supplier.value:
              vm.supplierCodeDetailModel = null;
              break;
            case vm.SupplierQuoteAdvanceFilter.QuoteStatus.value:
              vm.draft = vm.published = false;
              break;
            case vm.SupplierQuoteAdvanceFilter.QuoteDate.value:
              vm.supplierQuote.fromDate = vm.supplierQuote.toDate = null;
              vm.resetDateFilter();
              break;
            case vm.SupplierQuoteAdvanceFilter.Parts.value:
              vm.partIds = [];
              break;
            case vm.SupplierQuoteAdvanceFilter.Quote.value:
              vm.advanceSearchPoSoPsInv = null;
              break;
            case vm.SupplierQuoteAdvanceFilter.ClearAll.value:
              break;
            default:
              break;
          }
          vm.advanceFilterSearch();
        }
      };

      //reset filter
      vm.resetFilter = () => {
        if (vm.gridOptions && vm.gridOptions.gridApi) {
          _.each(vm.gridOptions.gridApi.grid.columns, (col) => {
            if (!_.isEmpty(col.filters[0].term)) {
              vm.callLoadData = false;
              col.filters[0].term = undefined;
            }
          });
        }
        vm.supplierSearchText = undefined;
        vm.clearsupplierSearchText();
        vm.supplierCodeDetailModel = [];
        vm.partIds = [];
        vm.advanceSearchSQ = null;
        vm.resetDateFilter();
        $timeout(() => {
          vm.draft = vm.published = false;
          vm.checkSerachSQType = vm.CheckSearchTypeList[1].id;
          initPageInfo();
          vm.loadData();
        });
      };

      vm.getMfgSearch();

      // Clear grid Column Filter
      vm.clearGridColumnFilter = (item) => {
        if (item) {
          item.filters[0].term = undefined;
          if (!item.isFilterDeregistered) {
            //refresh data grid
            vm.gridOptions.gridApi.grid.onClearUnregisteredColumnFilter();
          }
        }
      };

      // Get Tool tip for selected filters
      function getFilterTooltip(displayList, selectedModdel, idFieldName, valueFieldName, optionalLabel) {
        var maxTooltipLimit = 10;
        var isTooltipGreatrtthenLimit = false;
        var moreTooltipText = '<br />more...';
        if (displayList && displayList.length && selectedModdel && ((Array.isArray(selectedModdel) ? selectedModdel.length : true))) {
          let toolTipText;
          if (Array.isArray(selectedModdel)) {
            toolTipText = displayList.filter((item) => item[idFieldName] && selectedModdel.includes(item[idFieldName].toString()));
          }
          else {
            toolTipText = displayList.filter((item) => item[idFieldName] === selectedModdel);
          }
          if (toolTipText && toolTipText.length > maxTooltipLimit) {
            toolTipText = toolTipText.splice(0, maxTooltipLimit);
            isTooltipGreatrtthenLimit = true;
          }
          toolTipText = toolTipText.map((a) => a[valueFieldName]);
          return (optionalLabel ? (optionalLabel + ': ') : '') + toolTipText.join('<br />') + (isTooltipGreatrtthenLimit ? moreTooltipText : '') + (optionalLabel ? '<br />' : '');
        }
        else {
          return '';
        }
      }

      vm.gridOptions = {
        enablePaging: isEnablePagination,
        enablePaginationControls: isEnablePagination,
        showColumnFooter: false,
        enableRowHeaderSelection: true,
        enableFullRowSelection: false,
        enableRowSelection: true,
        multiSelect: true,
        filterOptions: vm.pagingInfo.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: stringFormat('{0}.csv', CORE.PAGENAME_CONSTANT[33].PageName),
        allowToExportAllData: true,
        exporterAllDataFn: () => {
          const pagingInfoOld = _.clone(vm.pagingInfo);
          pagingInfoOld.pageSize = 0;
          pagingInfoOld.Page = 1;
          vm.gridOptions.isExport = pagingInfoOld.isExport = true;
          return SupplierQuoteFactory.retrieveSupplierQuoteList().query(pagingInfoOld).$promise.then((response) => {
            if (response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data) {
              return response.data.SupplierQuote;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      vm.sourceHeader = [
        {
          field: 'Action',
          displayName: 'Action',
          width: '80',
          cellTemplate: '<grid-action-view grid="grid" row="row" style="overflow: hidden;padding:5px !important; white-space: nowrap;" class="height-grid ui-grid-cell-contents"></grid-action-view>',
          enableFiltering: false,
          enableSorting: false,
          exporterSuppressExport: true,
          pinnedLeft: true,
          allowCellFocus: false
        },
        {
          field: '#',
          width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
          cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
          enableFiltering: false,
          pinnedLeft: true,
          enableSorting: false
        },
        {
          field: 'statusConvertedValue',
          displayName: vm.LabelConstant.QuoteStatus,
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" \
                              ng-class="{\'label-success\':row.entity.quoteStatus == \'P\', \
                                  \'label-warning\':row.entity.quoteStatus == \'D\'}"> \
                                        {{ COL_FIELD }}'
            + '</span>'
            + '</div>',
          enableFiltering: false,
          enableSorting: false
        },
        {
          field: 'supplier',
          displayName: vm.LabelConstant.Supplier,
          cellTemplate: '<div class="ui-grid-cell-contents"><span><a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToSupplier(row.entity.supplierID);$event.preventDefault();">{{row.entity.supplier}}</a>\
                                        <md-tooltip>{{row.entity.supplier}}</md-tooltip> </span> <copy-text label="\'Supplier\'" text="row.entity.supplier"></copy-text></div>',
          width: 200,
          ColumnDataType: 'StringEquals',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'quoteNumber',
          displayName: vm.LabelConstant.Quote,
          cellTemplate: '<div class="ui-grid-cell-contents"><span><a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToSupplierQuoteDetail(row.entity.id);$event.preventDefault();">{{row.entity.quoteNumber}}</a>\
                                        <md-tooltip>{{row.entity.quoteNumber}}</md-tooltip> </span> <copy-text label="\'Quote\'" text="row.entity.quoteNumber"></copy-text></div>',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'quoteDate',
          displayName: vm.LabelConstant.QuoteDate,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD  | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
          width: '120',
          type: 'date',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'reference',
          width: '120',
          displayName: vm.LabelConstant.Reference,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'billTo',
          displayName: CORE.LabelConstant.COMMON.BillingAddress,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '300'
        },
        {
          field: 'billToContactName',
          displayName: CORE.LabelConstant.COMMON.BillingAddressContactPerson,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '300'
        },
        {
          field: 'shipTo',
          displayName: CORE.LabelConstant.COMMON.ShippingAddress,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '300'
        },
        {
          field: 'shipToContactName',
          displayName: CORE.LabelConstant.COMMON.ShippingAddressContactPerson,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '300'
        },
        {
          field: 'noOfSupplierPartLine',
          width: '150',
          displayName: 'No of Items',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">\
                                      <span ng-if="row.entity.noOfSupplierPartLine">\
                                        <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToSupplierDetailTab(row.entity.quoteNumber);$event.preventDefault();">{{row.entity.noOfSupplierPartLine}}</a>\
                                        <md-tooltip>{{row.entity.noOfSupplierPartLine}}</md-tooltip>\
                                    </span>\
                              <span ng-if="!row.entity.noOfSupplierPartLine">\
                                        {{row.entity.noOfSupplierPartLine}}\
                                    </span>\
                                    </div>',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'updatedAt',
          displayName: CORE.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
          width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          type: 'datetime',
          visible: CORE.UIGrid.VISIBLE_MODIFIED_AT
        },
        {
          field: 'updatedby',
          displayName: CORE.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableFiltering: true,
          enableSorting: true,
          visible: CORE.UIGrid.VISIBLE_MODIFIED_BY
        },
        {
          field: 'createdAt',
          displayName: CORE.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateTimeFormat}}</div>',
          enableFiltering: false,
          enableSorting: true,
          type: 'datetime',
          visible: CORE.UIGrid.VISIBLE_CREATED_AT
        },
        {
          field: 'createdby',
          displayName: CORE.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableFiltering: true,
          enableSorting: true,
          visible: CORE.UIGrid.VISIBLE_CREATED_BY
        },
        {
          field: 'updatedByRole',
          displayName: CORE.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          type: 'StringEquals',
          enableFiltering: true,
          visible: CORE.UIGrid.VISIBLE_MODIFIED_BYROLE
        },
        {
          field: 'createdByRole',
          displayName: CORE.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
          type: 'StringEquals',
          enableFiltering: true,
          visible: CORE.UIGrid.VISIBLE_CREATED_BYROLE
        }
      ];

      const generateSearchCriteria = () => {
        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        vm.generateFilterChip = false;
        if (vm.supplierCodeDetailModel && vm.supplierCodeDetailModel.length > 0) {
          vm.pagingInfo.supplierIds = vm.supplierCodeDetailModel.join(',');
          vm.generateFilterChip = true;
          vm.SupplierQuoteAdvanceFilter.Supplier.isDeleted = false;
          vm.SupplierQuoteAdvanceFilter.Supplier.tooltip = getFilterTooltip(vm.supplierCodeListToDisplay, vm.supplierCodeDetailModel, 'id', 'mfgCodeName');
        } else {
          vm.pagingInfo.supplierIds = null;
          vm.SupplierQuoteAdvanceFilter.Supplier.isDeleted = true;
        }
        let strQuoteStatusFilter = '';
        if (!(vm.draft && vm.published)) {
          if (vm.draft) {
            strQuoteStatusFilter = stringFormat('{0},{1}', strQuoteStatusFilter, vm.supplierQuoteStatus[1].id);
            vm.SupplierQuoteAdvanceFilter.QuoteStatus.tooltip = vm.supplierQuoteStatus[1].value;
          }
          if (vm.published) {
            strQuoteStatusFilter = stringFormat('{0},{1}', strQuoteStatusFilter, vm.supplierQuoteStatus[2].id);
            vm.SupplierQuoteAdvanceFilter.QuoteStatus.tooltip = vm.supplierQuoteStatus[2].value;
          }
        }
        vm.SupplierQuoteAdvanceFilter.QuoteStatus.tooltip = vm.draft && vm.published ? vm.supplierQuoteStatus[0].value : vm.SupplierQuoteAdvanceFilter.QuoteStatus.tooltip;
        vm.pagingInfo.quoteStatus = strQuoteStatusFilter && strQuoteStatusFilter.length > 0 ? strQuoteStatusFilter.substring(1) : '';

        if (vm.supplierQuote.fromDate) {
          vm.pagingInfo.fromDate = BaseService.getAPIFormatedDate(vm.supplierQuote.fromDate);
          vm.SupplierQuoteAdvanceFilter.QuoteDate.tooltip = 'From: ' + $filter('date')(new Date(vm.pagingInfo.fromDate), vm.DefaultDateFormat);
        } else {
          vm.pagingInfo.fromDate = null;
        }
        if (vm.supplierQuote.toDate) {
          vm.pagingInfo.toDate = BaseService.getAPIFormatedDate(vm.supplierQuote.toDate);
          vm.SupplierQuoteAdvanceFilter.QuoteDate.tooltip = 'To: ' + $filter('date')(new Date(vm.pagingInfo.toDate), vm.DefaultDateFormat);
        } else {
          vm.pagingInfo.toDate = null;
        }
        vm.SupplierQuoteAdvanceFilter.QuoteDate.tooltip = vm.pagingInfo.fromDate && vm.pagingInfo.toDate ? 'From:' + $filter('date')(new Date(vm.pagingInfo.fromDate), vm.DefaultDateFormat) + ' To:' + $filter('date')(new Date(vm.pagingInfo.toDate), vm.DefaultDateFormat) : vm.SupplierQuoteAdvanceFilter.QuoteDate.tooltip;

        vm.pagingInfo.searchType = vm.checkSerachSQType;
        if (vm.advanceSearchSQ) {
          vm.pagingInfo.advanceSearchSQ = vm.SupplierQuoteAdvanceFilter.Quote.tooltip = vm.advanceSearchSQ;
          vm.generateFilterChip = true;
          vm.SupplierQuoteAdvanceFilter.Quote.isDeleted = false;
        } else {
          vm.pagingInfo.advanceSearchSQ = null;
          vm.SupplierQuoteAdvanceFilter.Quote.isDeleted = true;
        }

        if (vm.partIds && vm.partIds.length > 0) {
          vm.pagingInfo.partIds = _.map(vm.partIds, 'id').join(',');
          vm.generateFilterChip = true;
          vm.SupplierQuoteAdvanceFilter.Parts.isDeleted = false;
        } else {
          vm.pagingInfo.partIds = null;
          vm.SupplierQuoteAdvanceFilter.Parts.isDeleted = true;
        }

        vm.SupplierQuoteAdvanceFilter.QuoteDate.isDeleted = !(vm.pagingInfo.fromDate || vm.pagingInfo.toDate);
        vm.SupplierQuoteAdvanceFilter.QuoteStatus.isDeleted = !(vm.draft || vm.published);
        vm.generateFilterChip = vm.generateFilterChip ? vm.generateFilterChip : (!vm.SupplierQuoteAdvanceFilter.QuoteDate.isDeleted || !vm.SupplierQuoteAdvanceFilter.QuoteStatus.isDeleted);

        if (vm.gridOptions && vm.gridOptions.gridApi) {
          vm.isUiGridColumnFiltersApplied = _.some(vm.gridOptions.gridApi.grid.columns, (col) => !_.isEmpty(col.filters[0].term));
        }
      };

      function setDataAfterGetAPICall(supplierquote, isGetDataDown) {
        if (supplierquote && supplierquote.data.SupplierQuote) {
          if (!isGetDataDown) {
            vm.sourceData = supplierquote.data.SupplierQuote;
            vm.currentdata = vm.sourceData.length;
          }
          else if (supplierquote.data.SupplierQuote.length > 0) {
            vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(supplierquote.data.SupplierQuote);
            vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
          }

          // must set after new data comes
          vm.totalSourceDataCount = supplierquote.data.Count;
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
            if (vm.pagingInfo.SearchColumns.length > 0 || vm.generateFilterChip) {
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

      vm.loadData = () => {
        if (vm.callLoadData === false) {
          vm.callLoadData = true;
          return;
        }
        generateSearchCriteria();
        vm.cgBusyLoading = SupplierQuoteFactory.retrieveSupplierQuoteList().query(vm.pagingInfo).$promise.then((response) => {
          if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            setDataAfterGetAPICall(response, false);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.cgBusyLoading = SupplierQuoteFactory.retrieveSupplierQuoteList().query(vm.pagingInfo).$promise.then((response) => {
          setDataAfterGetAPICall(response, true);
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.scanSearchKey = ($event) => {
        $timeout(() => {
          if ($event.keyCode === 13) {
            vm.loadData();
          }
        });
      };

      vm.updateRecord = (row) => {
        if (row.entity) {
          if (vm.partId) {
            BaseService.goToSupplierQuoteWithPartDetail(row.entity.id);
          }
          else {
            BaseService.openInNew(TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_QUOTE_STATE, { id: row.entity.id });
          }
        }
      };

      vm.deleteRecord = (supplierQuote) => {
        let selectedIDs = [];
        if (supplierQuote) {
          if (supplierQuote.id) {
            selectedIDs.push(supplierQuote.id);
          }
        } else {
          vm.selectedRows = vm.selectedRowsList;
          if (vm.selectedRows.length > 0) {
            selectedIDs = vm.selectedRows.map((item) => item.id);
          }
        }
        if (selectedIDs) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, 'Supplier Quote', selectedIDs.length);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          const objIDs = {
            supplierQuoteID: selectedIDs,
            CountList: false
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              vm.cgBusyLoading = SupplierQuoteFactory.deleteSupplierQuote().query({ objIDs: objIDs }).$promise.then((res) => {
                if (res && res.data && (res.data.length > 0 || res.data.transactionDetails)) {
                  const data = {
                    TotalCount: res.data.transactionDetails[0].TotalCount,
                    pageName: CORE.PageName.supplierQuote
                  };
                  BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                    const objIDs = {
                      supplierQuoteID: selectedIDs,
                      CountList: true
                    };
                    return SupplierQuoteFactory.deleteSupplierQuote().query({ objIDs: objIDs }).$promise.then((res) => {
                      let data = {};
                      data = res.data;
                      data.pageTitle = supplierQuote ? supplierQuote.quoteNumber : null;
                      data.PageName = CORE.PageName.supplierQuote;
                      data.selectedIDs = stringFormat('{0}{1}', selectedIDs.length, ' Selected');
                      data.id = selectedIDs;
                      if (res.data) {
                        DialogFactory.dialogService(
                          USER.ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER,
                          USER.ADMIN_SHOW_TRANSACTION_DETAILS_VIEW,
                          ev,
                          data).then(() => {
                          }, () => {
                          });
                      }
                    }).catch((error) => BaseService.getErrorLog(error));
                  });
                } else {
                  vm.loadData();
                  //BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      vm.deleteMultipleData = () => {
        vm.deleteRecord();
      };

      vm.addSupplierQuote = () => {
        BaseService.goToSupplierQuoteWithPartDetail();
      };

      vm.AddSupplierQuoteButtonObj = {
        buttonText: 'Add Supplier Quote',
        buttonRoute: TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_QUOTE_STATE,
        buttonParams: { sID: 0 }
      };

      //close popup on page destroy
      $scope.$on('$destroy', () => {
        $mdDialog.hide(false, { closeAll: true });
      });
    }
  }
})();
