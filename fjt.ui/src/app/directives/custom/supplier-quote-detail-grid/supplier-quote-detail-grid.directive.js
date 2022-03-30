(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('supplierQuoteDetailGrid', supplierQuoteDetailGrid);

  /** @ngInject */
  function supplierQuoteDetailGrid(BaseService, $timeout, $stateParams, CORE, USER, TRANSACTION, DialogFactory, SupplierQuoteFactory, ManufacturerFactory, ComponentFactory, $mdDialog, $filter) {
    const directive = {
      restrict: 'E',
      replace: false,
      scope: {
        isNoDataFound: '=',
        partId: '=?'
      },
      templateUrl: 'app/directives/custom/supplier-quote-detail-grid/supplier-quote-detail-grid.html',
      controller: supplierQuoteDetailGridCtrl,
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
    function supplierQuoteDetailGridCtrl($scope) {
      const vm = this;
      vm.supplierQuote = {};
      vm.partId = $scope.partId;
      vm.isFromPartMaster = $scope.isFromPartMaster || false;
      vm.gridConfig = CORE.gridConfig;
      vm.isHideDelete = false;
      vm.isUpdatable = true;
      vm.isPartPricing = true;
      vm.isPartPricingHistory = true;
      vm.isViewRequirementReference = true;
      vm.generateFilterChip = false;
      vm.isCopySupplierQuote = true;
      vm.DefaultDateFormat = _dateDisplayFormat;
      vm.LabelConstant = CORE.LabelConstant;
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
      if (vm.partId) {
        vm.partIds.push({
          id: vm.partId,
          mfgPN: $scope.$parent.$parent.vm.displayComponentDetail.mfgPN,
          isDisable: true
        });
        vm.isPartIdFilterDisabled = true;
      }
      vm.StatusOptionsGridHeaderDropdown = CORE.StatusOptionsGridHeaderDropdown;
      vm.EmptyMesssageFilter = USER.ADMIN_EMPTYSTATE.COMPONENT_FILTERS;
      const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;

      if ($stateParams && $stateParams.quote) {
        vm.checkSerachSQType = vm.CheckSearchTypeList[0].id;
        vm.advanceSearchSQ = $stateParams.quote;
      }

      //get max length validations
      vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

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

      const initPageInfo = () => {
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),
          SortColumns: [],
          SearchColumns: [],
          pageSize: CORE.UIGrid.ItemsPerPage(),
          isSummaryView: false
        };
      };
      initPageInfo();

      // go to supplier page
      vm.goToSupplier = (supplierID) => {
        BaseService.goToSupplierDetail(supplierID);
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
      //link to go supplier list page
      vm.goToSupplierList = () => {
        BaseService.goToSupplierList();
      };

      /* to display Line shipping comments */
      vm.showPartDescription = (row, ev) => {
        const popupData = {
          title: 'Description',
          description: row.entity.mfgPNDescription
        };
        DialogFactory.dialogService(
          CORE.DESCRIPTION_MODAL_CONTROLLER,
          CORE.DESCRIPTION_MODAL_VIEW,
          ev,
          popupData).then(() => {
          }, (err) => BaseService.getErrorLog(err));
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
        vm.partIds = _.filter(vm.partIds, (part) => part.isDisable);
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
            // refresh data grid
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
      const getFilterTooltipWithoutModel = (selectedModel, valueFieldName) => {
        var maxTooltipLimit = 10;
        var isTooltipGreatrtthenLimit = false;
        var moreTooltipText = '<br />more...';
        var toolTipText = '';
        if (selectedModel && selectedModel.length > 0) {
          toolTipText = selectedModel.map((a) => a[valueFieldName]);
          if (toolTipText && toolTipText.length > maxTooltipLimit) {
            toolTipText = toolTipText.splice(0, maxTooltipLimit);
            isTooltipGreatrtthenLimit = true;
          }
          return toolTipText.join('<br />') + (isTooltipGreatrtthenLimit ? moreTooltipText : '');
        } else {
          return '';
        }
      };

      vm.gridOptions = {
        enablePaging: isEnablePagination,
        enablePaginationControls: isEnablePagination,
        showColumnFooter: false,
        enableRowHeaderSelection: false,
        enableFullRowSelection: false,
        enableRowSelection: false,
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
              processSupplierQuote(response.data.SupplierQuote);
              return response.data.SupplierQuote;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      vm.sourceHeader = [
        {
          field: 'Action',
          displayName: 'Action',
          cellClass: 'layout-align-center-center',
          width: '200',
          cellTemplate: '<grid-action-view grid="grid" row="row" number-of-action-button="5" style="overflow: hidden;padding:5px !important; white-space: nowrap;" class="height-grid ui-grid-cell-contents"></grid-action-view>',
          enableFiltering: false,
          enableSorting: false,
          exporterSuppressExport: true,
          pinnedLeft: false,
          maxWidth: '100'
        },
        {
          field: '#',
          width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
          cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
          enableFiltering: false,
          enableSorting: false
        },
        {
          field: 'statusConvertedValue',
          displayName: vm.LabelConstant.SupplierQuote.QuoteStatus,
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
          displayName: vm.LabelConstant.SupplierQuote.Supplier,
          cellTemplate: '<div class="ui-grid-cell-contents"><span><a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToSupplier(row.entity.supplierID);$event.preventDefault();">{{row.entity.supplier}}</a>\
                                        <md-tooltip>{{row.entity.supplier}}</md-tooltip> </span> <copy-text label="\'Supplier\'" text="row.entity.supplier"></copy-text></div>',
          width: 200,
          ColumnDataType: 'StringEquals',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'quoteNumber',
          displayName: vm.LabelConstant.SupplierQuote.Quote,
          cellTemplate: '<div class="ui-grid-cell-contents"><span><a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToSupplierQuoteDetail(row.entity.id);$event.preventDefault();">{{row.entity.quoteNumber}}</a>\
                                        <md-tooltip>{{row.entity.quoteNumber}}</md-tooltip> </span> <copy-text label="\'Quote\'" text="row.entity.quoteNumber"></copy-text></div>',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'quoteDate',
          displayName: vm.LabelConstant.SupplierQuote.QuoteDate,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD  | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
          width: '120',
          type: 'date',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'mfgName',
          width: '300',
          displayName: CORE.LabelConstant.MFG.MFG,
          cellTemplate: '<div class="ui-grid-cell-contents text-left"><span><a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToManufacturer(row.entity.mfgcodeID);$event.preventDefault();">{{ row.entity.mfgName }}</a>\
                                        </span> <copy-text label="\'MFR\'" text="row.entity.mfgName" ng-if="row.entity.mfgName"></copy-text></div>'
        },
        {
          field: 'mfgPN',
          displayName: CORE.LabelConstant.MFG.MFGPN,
          cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link ng-if="row.entity.partID" \
                            component-id="row.entity.partID" \
                            label="grid.appScope.$parent.vm.CORE.LabelConstant.MFG.MFGPN" \
                            value="row.entity.mfgPN" \
                            is-copy="true" \
                            cust-part-number="row.entity.custAssyPN"\
                            is-custom-part="row.entity.isCustom || row.entity.isCustomSupplier "\
                            rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.rohsIcon" \
                            rohs-status="row.entity.rohsName" \
                            supplier-name="(row.entity.isCustom || row.entity.isCustomSupplier) ? null :row.entity.supplier" \
                            is-search-findchip="true"></common-pid-code-label-link></div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
          allowCellFocus: false
        },
        {
          field: 'supplierPN',
          displayName: CORE.LabelConstant.MFG.SupplierPN,
          cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link ng-if="row.entity.supplierPartID" \
                            component-id="row.entity.supplierPartID" \
                            label="grid.appScope.$parent.vm.CORE.LabelConstant.MFG.SupplierPN" \
                            value="row.entity.supplierPN" \
                            is-copy="true" \
                            rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.supplierRohsIcon" \
                            rohs-status="row.entity.supplierRohsName" \
                            supplier-name="(row.entity.isCustom || row.entity.isCustomSupplier) ? null :row.entity.supplier" \
                            is-supplier="true" \
                            is-search-findchip="true"></common-pid-code-label-link></div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
          allowCellFocus: false
        },
        {
          field: 'scanLabel',
          width: '170',
          displayName: 'Label String',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>'
        },
        {
          field: 'mfgPNDescription',
          width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
          displayName: vm.LabelConstant.MFG.MFGPNDescription,
          cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
            '<span class="cursor-pointer bom-header-wrap">{{ COL_FIELD }}</span> &nbsp;' +
            '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.mfgPNDescription && row.entity.mfgPNDescription !== \'-\'" ng-click="grid.appScope.$parent.vm.showPartDescription(row, $event)">' +
            '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
            '<md-tooltip>View</md-tooltip>' +
            '</button>' +
            '</div>',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'attributeNames',
          width: '250',
          displayName: 'Attributes',
          cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents layout-wrap"> '
            + ' <span class="label-box margin-left-2 mb-5 background-skyblue-pricing"'
            + ' ng-repeat="attibuteName in row.entity.attributeNames">{{attibuteName}}</span> '
            + ' </div> ',
          enableFiltering: false,
          enableSorting: false
        },
        {
          field: 'pricingCount',
          width: '160',
          displayName: 'Price Record Count',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>'
        },
        {
          field: 'isActiveConvertedValueDetail',
          displayName: 'Status',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" \
                        ng-class="{\'label-success\':row.entity.isActive == true ,\
                        \'label-warning\':row.entity.isActive == false }"> \
                            {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.StatusOptionsGridHeaderDropdown
          }
        },
        {
          field: 'reference',
          width: '120',
          displayName: vm.LabelConstant.SupplierQuote.Reference,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
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

      vm.sourceHeader.unshift({
        field: 'Apply',
        headerCellTemplate: '<md-checkbox class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox" ng-model="grid.appScope.$parent.vm.Apply" \
                              ng-change="grid.appScope.$parent.vm.applyAll(grid.appScope.$parent.vm.Apply)"></md-checkbox>',
        width: '75',
        cellTemplate: '<div class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox" style="overflow:initial"><md-checkbox ng-disabled="row.entity.isDisabledDelete" ng-model="row.entity.isRecordSelectedForRemove" \
                              ng-change="grid.appScope.$parent.vm.setSupplierQuoteRemove(row.entity)"></md-checkbox></div>',
        enableFiltering: false,
        enableSorting: false,
        exporterSuppressExport: true,
        pinnedLeft: false,
        enableColumnMoving: false,
        manualAddedCheckbox: true
      });

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
          vm.SupplierQuoteAdvanceFilter.Parts.tooltip = getFilterTooltipWithoutModel(vm.partIds, 'mfgPN');
        } else {
          vm.pagingInfo.partIds = null;
          vm.SupplierQuoteAdvanceFilter.Parts.isDeleted = true;
        }

        vm.SupplierQuoteAdvanceFilter.QuoteDate.isDeleted = !(vm.pagingInfo.fromDate || vm.pagingInfo.toDate);
        vm.SupplierQuoteAdvanceFilter.QuoteStatus.isDeleted = !(vm.draft || vm.published);
        vm.generateFilterChip = vm.generateFilterChip ? vm.generateFilterChip : (!vm.SupplierQuoteAdvanceFilter.QuoteDate.isDeleted || !vm.SupplierQuoteAdvanceFilter.QuoteStatus.isDeleted);
        //set assy filter disable in case call from part master
        if (vm.partId) {
          vm.SupplierQuoteAdvanceFilter.Parts.isDisable = true;
        }
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
          if (vm.sourceData && vm.sourceData.length > 0) {
            processSupplierQuote(vm.sourceData);
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

      const processSupplierQuote = (data) => {
        _.each(data, (item) => {
          if (item.attributesList) {
            const splitAttributes = item.attributesList.split('@@@');
            const attributeNames = [];
            _.map(splitAttributes, (data) => {
              if (data) {
                const splitValue = data.split('###');
                if (splitValue.length > 0) {
                  attributeNames.push(splitValue[1]);
                }
              }
            });
            item.attributeNames = attributeNames;
          }
        });
      };

      vm.copySupplierQuote = (row, ev) => {
        const supplierDet = {
          id: row.entity.id
        };
        vm.cgBusyLoading = SupplierQuoteFactory.checkInActivePartOfSupplierQuote().query(supplierDet).$promise.then((response) => {
          if (response.data && response.data.isContainInactivePart) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.DUPLICATE_SUPPLIER_QUOTE_WITH_INACTIVE_PART);
            messageContent.message = stringFormat(messageContent.message, row.entity.mfgPN, row.entity.quoteNumber);
            const obj = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(obj).then(() => {
            }, () => {
            }).catch((error) => BaseService.getErrorLog(error));
          } else {
            copyPopupOpen(row, ev);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      const copyPopupOpen = (row, ev) => {
        DialogFactory.dialogService(
          CORE.SUPPLIER_QUOTE_COPY_CONTROLLER,
          CORE.SUPPLIER_QUOTE_COPY_VIEW,
          ev,
          row.entity).then((data) => {
            if (data) {
              BaseService.openInNew(TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_QUOTE_STATE, { id: data });
              BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
            }
          }, () => {
          }, (err) => BaseService.getErrorLog(err));
      };

      vm.partPricing = (row, ev) => {
        const popUpData = {
          supplierQuoteId: row.entity.id,
          supplierQuotePartDetailId: row.entity.supplierQuotePartDetID,
          partId: row.entity.partID
        };
        DialogFactory.dialogService(
          CORE.SUPPLIER_QUOTE_PART_PRICE_DETAIL_CONTROLLER,
          CORE.SUPPLIER_QUOTE_PART_PRICE_DETAIL_VIEW,
          ev,
          popUpData).then((data) => {
            if (data) {
              BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
            }
          }, (err) => BaseService.getErrorLog(err));
      };

      vm.partPricingHistory = (row, ev) => {
        DialogFactory.dialogService(
          CORE.SUPPLIER_QUOTE_PART_PRICING_HISTORY_CONTROLLER,
          CORE.SUPPLIER_QUOTE_PART_PRICING_HISTORY_VIEW,
          ev,
          row.entity).then(() => {
          }, () => {
          }, (err) => BaseService.getErrorLog(err));
      };

      vm.viewRequirementReference = (row, ev) => {
        const popUpData = {
          supplierQuoteMstID: row.entity.id,
          supplierQuotePartDetID: row.entity.supplierQuotePartDetID,
          partID: row.entity.partID
        };
        DialogFactory.dialogService(
          CORE.SUPPLIER_QUOTE_PART_PRICING_WHERE_USED_CONTROLLER,
          CORE.SUPPLIER_QUOTE_PART_PRICING_WHERE_USED_VIEW,
          ev,
          popUpData).then(() => {
          }, () => {
          }, (err) => BaseService.getErrorLog(err));
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
        let refsupplierQuoteID = [];
        if (supplierQuote) {
          if (supplierQuote.supplierQuotePartDetID) {
            selectedIDs.push(supplierQuote.supplierQuotePartDetID);
            refsupplierQuoteID.push(supplierQuote.id);
          }
        } else {
          vm.selectedRows = vm.selectedRowsList;
          if (vm.selectedRows.length > 0) {
            selectedIDs = vm.selectedRows.map((item) => item.supplierQuotePartDetID);
            refsupplierQuoteID = vm.selectedRows.map((item) => item.id);
          }
        }
        if (selectedIDs) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, 'Supplier Quote Part Detail', selectedIDs.length);

          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          const objIDs = {
            id: selectedIDs,
            supplierQuoteID: refsupplierQuoteID,
            CountList: false
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              vm.cgBusyLoading = SupplierQuoteFactory.deleteSupplierQuotePartDetail().query({ objIDs: objIDs }).$promise.then((res) => {
                if (res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                  vm.loadData();
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          //show validation message no data selected
          const alertModel = {
            title: USER.USER_ERROR_LABEL,
            textContent: stringFormat(USER.SELECT_ONE_LABEL, 'supplier quote part detail'),
            multiple: true
          };
          DialogFactory.alertDialog(alertModel);
        }
      };

      vm.deleteMultipleData = () => {
        vm.deleteRecord();
      };

      vm.addSupplierQuote = () => {
        BaseService.goToSupplierQuoteWithPartDetail();
      };

      // apply all details
      vm.applyAll = (applyAll) => {
        if (applyAll) {
          _.map(vm.sourceData, selectSupplierQuote);
        } else {
          _.map(vm.sourceData, unSelectSupplierQuote);
        }
      };
      const selectSupplierQuote = (row) => {
        row.isRecordSelectedForRemove = row.isDisabledDelete ? false : true;
        if (row.isRecordSelectedForRemove) {
          vm.gridOptions.gridApi.selection.selectRow(row);
        }
      };
      const unSelectSupplierQuote = (row) => {
        row.isRecordSelectedForRemove = false;
        vm.gridOptions.clearSelectedRows();
      };
      vm.setSupplierQuoteRemove = (row) => {
        const totalItem = _.filter(vm.sourceData, (data) => !data.isDisabledDelete);
        const selectItem = _.filter(vm.sourceData, (data) => data.isRecordSelectedForRemove === true);
        if (row.isRecordSelectedForRemove) {
          vm.gridOptions.gridApi.selection.selectRow(row);
        } else {
          vm.gridOptions.gridApi.selection.unSelectRow(row);
        }
        vm.Apply = totalItem.length === selectItem.length;
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
