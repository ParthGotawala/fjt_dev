(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('AssemblyStockStatusPopUpController', AssemblyStockStatusPopUpController);

  function AssemblyStockStatusPopUpController($mdDialog, CORE, $filter, DialogFactory, $scope, $q,
    BaseService, data, WorkorderFactory, TRANSACTION, USER, $timeout, uiGridGroupingConstants) {
    const vm = this;
    vm.CORE = CORE;
    vm.isHideDelete = true;
    vm.gridConfig = CORE.gridConfig;
    vm.data = data;
    vm.allLabelConstant = CORE.LabelConstant;
    vm.empty = CORE.EMPTYSTATE.EMPTY_SEARCH;
    vm.EmptyMesssageWO = angular.copy(TRANSACTION.TRANSACTION_EMPTYSTATE.WO_ASSEMBLY);
    vm.EmptyMesssagePO = angular.copy(TRANSACTION.TRANSACTION_EMPTYSTATE.PO_ASSEMBLY);
    vm.loginUser = BaseService.loginUser;
    vm.isViewAssemblyInitialStock = true;
    vm.isViewAddStockAdjustment = true;
    vm.isViewAssemblyWO = true;
    vm.isDisplayAllPO = false;
    vm.isDisplayAllWO = false;
    vm.selectedPoNumber = null;
    $scope.splitPaneFirstProperties = {};
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
    vm.DefaultDateFormat = _dateDisplayFormat;
    // Go to Assembly List
    vm.goToAssemblyList = () => {
        BaseService.goToPartList();
      return false;
    };
    // Go to assembly detail page
    vm.goToAssemblyDetails = () => {
        BaseService.goToComponentDetailTab(null, vm.data.partID);
      return false;
    };
    // Grid fields for Sales order grid
    vm.sourceHeaderPO = [
      {
        field: 'Action',
        cellClass: 'gridCellColor',
        displayName: 'Action',
        width: '100',
        cellTemplate: '<grid-action-view grid="grid" row="row" number-of-action-button="3" row-entity="row.entity"></grid-action-view>',
        enableFiltering: false,
        enableSorting: false,
        exporterSuppressExport: true,
        pinnedLeft: true
      },
      {
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="grid.appScope.$parent.vm.loginUser.uiGridPreference !== \'P\'">\
        <span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span>\
        </div>\
        <div class="ui-grid-cell-contents grid-cell-text-right" ng-if="grid.appScope.$parent.vm.loginUser.uiGridPreference === \'P\'">\
        <span><b>{{(grid.appScope.$parent.vm.pagingInfoPO.pageSize * (grid.appScope.$parent.vm.pagingInfoPO.Page - 1)) + (grid.renderContainers.body.visibleRowCache.indexOf(row) + 1)}}</b></span>\
        </div>',
        enableFiltering: false,
        enableSorting: false
      },
      {
        field: 'poDate',
        displayName: vm.allLabelConstant.Workorder.PODate,
        width: 110,
        headerCellTemplate: '<div ng-class="{ \'sortable\': sortable }">' +
          '<div class="ui-grid-vertical-bar">&nbsp;</div>' +
          '<div class="ui-grid-cell-contents" col-index="renderIndex">{{grid.appScope.$parent.vm.allLabelConstant.Workorder.PODate}}<span class="icon-question-mark-circle help-icon">\
                            <md-tooltip md-direction="top">Sales Order PO Date</md-tooltip></span>' +
          '<span ui-grid-visible="col.sort.direction" ng-class="{ \'ui-grid-icon-up-dir\': col.sort.direction == asc, \'ui-grid-icon-down-dir\': col.sort.direction == desc, \'ui-grid-icon-blank\': !col.sort.direction }">' +
          '&nbsp;' +
          '</span>' +
          '</div>' +
          '<div class="ui-grid-column-menu-button" ng-if="grid.options.enableColumnMenus && !col.isRowHeader  && col.colDef.enableColumnMenu !== false" class="ui-grid-column-menu-button" ng-click="toggleMenu($event)">' +
          '<i class="ui-grid-icon-angle-down">&nbsp;</i>' +
          '</div>' +
          '<div ng-if="filterable" class="ui-grid-filter-container" ng-repeat="colFilter in col.filters">' +
          '<input type="text" class="ui-grid-filter-input" ng-model="colFilter.term" />' +
          '<div class="margin-top-4 ui-grid-filter-button" ng-click="colFilter.term = null">' +
          '<i class="icon icon-close margin-right-0" ng-show="!!colFilter.term">&nbsp;</i>' +
          '</div>' +
          '</div>' +
          '</div>',
        //headerTooltip: 'Sales Order PO Date',
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'poNumber',
        displayName: vm.allLabelConstant.SalesOrder.PO,
        headerCellTemplate: '<div ng-class="{ \'sortable\': sortable }">' +
          '<div class="ui-grid-vertical-bar">&nbsp;</div>' +
          '<div class="ui-grid-cell-contents" col-index="renderIndex">{{grid.appScope.$parent.vm.allLabelConstant.SalesOrder.PO}}<span class="icon-question-mark-circle help-icon">\
                            <md-tooltip md-direction="top">Purchase Order Number</md-tooltip></span>' +
          '<span ui-grid-visible="col.sort.direction" ng-class="{ \'ui-grid-icon-up-dir\': col.sort.direction == asc, \'ui-grid-icon-down-dir\': col.sort.direction == desc, \'ui-grid-icon-blank\': !col.sort.direction }">' +
          '&nbsp;' +
          '</span>' +
          '</div>' +
          '<div class="ui-grid-column-menu-button" ng-if="grid.options.enableColumnMenus && !col.isRowHeader  && col.colDef.enableColumnMenu !== false" class="ui-grid-column-menu-button" ng-click="toggleMenu($event)">' +
          '<i class="ui-grid-icon-angle-down">&nbsp;</i>' +
          '</div>' +
          '<div ng-if="filterable" class="ui-grid-filter-container" ng-repeat="colFilter in col.filters">' +
          '<input type="text" class="ui-grid-filter-input" ng-model="colFilter.term" />' +
          '<div class="margin-top-4 ui-grid-filter-button" ng-click="colFilter.term = null">' +
          '<i class="icon icon-close margin-right-0" ng-show="!!colFilter.term">&nbsp;</i>' +
          '</div>' +
          '</div>' +
          '</div>',
        //headerTooltip: 'Purchase Order Number',
        cellTemplate: '<span class="ui-grid-cell-contents text-left" ng-if="row.entity.poNumber">\
                                        <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToManageSalesOrder(row.entity.soID);$event.preventDefault();">{{row.entity.poNumber}}</a>\
                                        <md-tooltip>{{row.entity.poNumber}}</md-tooltip> '+
          '<copy-text  label="grid.appScope.$parent.vm.allLabelConstant.SalesOrder.PO" text="row.entity.poNumber" ng-if="row.entity.poNumber"> </copy-text>'
          + '</span>' +
          '<span class="ui-grid-cell-contents text-left" ng-if="!row.entity.poNumber">{{row.entity.poNumber}}' +
          '<copy-text  label="grid.appScope.$parent.vm.allLabelConstant.SalesOrder.PO" text="row.entity.poNumber" ng-if="row.entity.poNumber"> </copy-text>'
          + '</span>',
        enableCellEdit: false,
        enableCellEditOnFocus: true,
        width: '230',
        allowCellFocus: true
      },
      {
        field: 'soNumber',
        displayName: vm.allLabelConstant.SalesOrder.SO,
        headerCellTemplate: '<div ng-class="{ \'sortable\': sortable }">' +
          '<div class="ui-grid-vertical-bar">&nbsp;</div>' +
          '<div class="ui-grid-cell-contents" col-index="renderIndex">{{grid.appScope.$parent.vm.allLabelConstant.SalesOrder.SO}}<span class="icon-question-mark-circle help-icon">\
                            <md-tooltip md-direction="top">Sales Order Number</md-tooltip></span>' +
          '<span ui-grid-visible="col.sort.direction" ng-class="{ \'ui-grid-icon-up-dir\': col.sort.direction == asc, \'ui-grid-icon-down-dir\': col.sort.direction == desc, \'ui-grid-icon-blank\': !col.sort.direction }">' +
          '&nbsp;' +
          '</span>' +
          '</div>' +
          '<div class="ui-grid-column-menu-button" ng-if="grid.options.enableColumnMenus && !col.isRowHeader  && col.colDef.enableColumnMenu !== false" class="ui-grid-column-menu-button" ng-click="toggleMenu($event)">' +
          '<i class="ui-grid-icon-angle-down">&nbsp;</i>' +
          '</div>' +
          '<div ng-if="filterable" class="ui-grid-filter-container" ng-repeat="colFilter in col.filters">' +
          '<input type="text" class="ui-grid-filter-input" ng-model="colFilter.term" />' +
          '<div class="margin-top-4 ui-grid-filter-button" ng-click="colFilter.term = null">' +
          '<i class="icon icon-close margin-right-0" ng-show="!!colFilter.term">&nbsp;</i>' +
          '</div>' +
          '</div>' +
          '</div>',
        //headerTooltip: 'Sales Order Number',
        cellTemplate: '<span class="ui-grid-cell-contents text-left" ng-if="row.entity.soNumber">\
                                        <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToManageSalesOrder(row.entity.soID);$event.preventDefault();">{{row.entity.soNumber}}</a>\
                                        <md-tooltip>{{row.entity.soNumber}}</md-tooltip>'+
          '<copy-text  label="grid.appScope.$parent.vm.allLabelConstant.SalesOrder.SO" text="row.entity.soNumber" ng-if="row.entity.soNumber"> </copy-text>' +
          '</span>' +
          '<span class="ui-grid-cell-contents text-left" ng-if="!row.entity.soNumber">{{row.entity.soNumber}}' +
          '<copy-text  label="grid.appScope.$parent.vm.allLabelConstant.SalesOrder.SO" text="row.entity.soNumber" ng-if="row.entity.soNumber"> </copy-text>' +
          '</span>',
        enableCellEdit: false,
        enableCellEditOnFocus: true,
        width: '170',
        allowCellFocus: true
      },
      //{
      //  field: 'IsLegacyPOText',
      //  displayName: 'Legacy PO',
      //  cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
      //    + '<span  ng-class="{\'label-box label-warning\':(!row.entity.isLegacyPO),\
      //                  \'label-box label-success\':(row.entity.isLegacyPO)}"> \
      //                      {{COL_FIELD}}'
      //    + '</span>'
      //    + '</div>',
      //  width: '110',
      //  allowCellFocus: false,
      //  filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      //  filter: {
      //    term: null,
      //    options: CORE.MasterTemplateDropdown
      //  },
      //  ColumnDataType: 'StringEquals',
      //  enableFiltering: true,
      //  enableSorting: true
      //},
      {
        field: 'POType',
        displayName: 'PO Type',
        width: 100,
        cellTemplate: '<div class="ui-grid-cell-contents">'
          + '<span class="label-box" ng-class="grid.appScope.$parent.vm.getPOTypeClassName(row.entity.POType)"> '
          + '{{ COL_FIELD }}</span>'
          + '</div>',
        enableFiltering: false,
        enableSorting: true
      },
      {
        field: 'lineID',
        displayName: 'SO Line#',
        width: 70,
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'custPOLineNumber',
        displayName: 'Cust PO Line#',
        width: 100,
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        enableFiltering: true,
        enableSorting: true,
        treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
        footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right" >Total</div>'
      },
      {
        field: 'poQty',
        displayName: vm.allLabelConstant.Workorder.POQty,
        enableCellEdit: false,
        enableCellEditOnFocus: true,
        headerCellTemplate: '<div ng-class="{ \'sortable\': sortable }">' +
          '<div class="ui-grid-vertical-bar">&nbsp;</div>' +
          '<div class="ui-grid-cell-contents" col-index="renderIndex">{{grid.appScope.$parent.vm.allLabelConstant.Workorder.POQty}}<span class="icon-question-mark-circle help-icon">\
                            <md-tooltip md-direction="top">Sales Order PO Qty</md-tooltip></span>' +
          '<span ui-grid-visible="col.sort.direction" ng-class="{ \'ui-grid-icon-up-dir\': col.sort.direction == asc, \'ui-grid-icon-down-dir\': col.sort.direction == desc, \'ui-grid-icon-blank\': !col.sort.direction }">' +
          '&nbsp;' +
          '</span>' +
          '</div>' +
          '<div class="ui-grid-column-menu-button" ng-if="grid.options.enableColumnMenus && !col.isRowHeader  && col.colDef.enableColumnMenu !== false" class="ui-grid-column-menu-button" ng-click="toggleMenu($event)">' +
          '<i class="ui-grid-icon-angle-down">&nbsp;</i>' +
          '</div>' +
          '<div ng-if="filterable" class="ui-grid-filter-container" ng-repeat="colFilter in col.filters">' +
          '<input type="text" class="ui-grid-filter-input" ng-model="colFilter.term" />' +
          '<div class="margin-top-4 ui-grid-filter-button" ng-click="colFilter.term = null">' +
          '<i class="icon icon-close margin-right-0" ng-show="!!colFilter.term">&nbsp;</i>' +
          '</div>' +
          '</div>' +
          '</div>',
        //headerTooltip: 'Sales Order PO Qty',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
        width: '85',
        treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
        footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right" >{{grid.appScope.$parent.vm.sumPOAssyPOQty}}</div>'
      },
      {
        field: 'buildQty',
        displayName: vm.allLabelConstant.Workorder.PlannedBuildQty,
        headerCellTemplate: '<div ng-class="{ \'sortable\': sortable }">' +
          '<div class="ui-grid-vertical-bar">&nbsp;</div>' +
          '<div class="ui-grid-cell-contents" col-index="renderIndex">{{grid.appScope.$parent.vm.allLabelConstant.Workorder.PlannedBuildQty}}<span class="icon-question-mark-circle help-icon">\
                            <md-tooltip md-direction="top">{{grid.appScope.$parent.vm.allLabelConstant.Workorder.PlannedBuildQty}} = Assigned Work Order PO Qty</md-tooltip></span>' +
          '<span ui-grid-visible="col.sort.direction" ng-class="{ \'ui-grid-icon-up-dir\': col.sort.direction == asc, \'ui-grid-icon-down-dir\': col.sort.direction == desc, \'ui-grid-icon-blank\': !col.sort.direction }">' +
          '&nbsp;' +
          '</span>' +
          '</div>' +
          '<div class="ui-grid-column-menu-button" ng-if="grid.options.enableColumnMenus && !col.isRowHeader  && col.colDef.enableColumnMenu !== false" class="ui-grid-column-menu-button" ng-click="toggleMenu($event)">' +
          '<i class="ui-grid-icon-angle-down">&nbsp;</i>' +
          '</div>' +
          '<div ng-if="filterable" class="ui-grid-filter-container" ng-repeat="colFilter in col.filters">' +
          '<input type="text" class="ui-grid-filter-input" ng-model="colFilter.term" />' +
          '<div class="margin-top-4 ui-grid-filter-button" ng-click="colFilter.term = null">' +
          '<i class="icon icon-close margin-right-0" ng-show="!!colFilter.term">&nbsp;</i>' +
          '</div>' +
          '</div>' +
          '</div>',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
        width: 100,
        treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
        footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right" >{{grid.appScope.$parent.vm.sumPOAssyBuildQty}}</div>'
      },
      {
        field: 'shippedQty',
        displayName: vm.allLabelConstant.Shipped.ShippedQty,
        headerCellTemplate: '<div ng-class="{ \'sortable\': sortable }">' +
          '<div class="ui-grid-vertical-bar">&nbsp;</div>' +
          '<div class="ui-grid-cell-contents" col-index="renderIndex">{{grid.appScope.$parent.vm.allLabelConstant.Shipped.ShippedQty}}<span class="icon-question-mark-circle help-icon">\
                            <md-tooltip md-direction="top">Shipped PO Qty</md-tooltip></span>' +
          '<span ui-grid-visible="col.sort.direction" ng-class="{ \'ui-grid-icon-up-dir\': col.sort.direction == asc, \'ui-grid-icon-down-dir\': col.sort.direction == desc, \'ui-grid-icon-blank\': !col.sort.direction }">' +
          '&nbsp;' +
          '</span>' +
          '</div>' +
          '<div class="ui-grid-column-menu-button" ng-if="grid.options.enableColumnMenus && !col.isRowHeader  && col.colDef.enableColumnMenu !== false" class="ui-grid-column-menu-button" ng-click="toggleMenu($event)">' +
          '<i class="ui-grid-icon-angle-down">&nbsp;</i>' +
          '</div>' +
          '<div ng-if="filterable" class="ui-grid-filter-container" ng-repeat="colFilter in col.filters">' +
          '<input type="text" class="ui-grid-filter-input" ng-model="colFilter.term" />' +
          '<div class="margin-top-4 ui-grid-filter-button" ng-click="colFilter.term = null">' +
          '<i class="icon icon-close margin-right-0" ng-show="!!colFilter.term">&nbsp;</i>' +
          '</div>' +
          '</div>' +
          '</div>',
        //headerTooltip: 'Shipped PO Qty',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
        width: 85,
        treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
        footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right" >{{grid.appScope.$parent.vm.sumPOAssyShippedQty}}</div>'
      },
      {
        field: 'backOrderQty',
        displayName: vm.allLabelConstant.Qty.BackOrderQty,
        headerCellTemplate: '<div ng-class="{ \'sortable\': sortable }">' +
          '<div class="ui-grid-vertical-bar">&nbsp;</div>' +
          '<div class="ui-grid-cell-contents" col-index="renderIndex">{{grid.appScope.$parent.vm.allLabelConstant.Qty.BackOrderQty}}<span class="icon-question-mark-circle help-icon">\
                            <md-tooltip md-direction="top">{{grid.appScope.$parent.vm.allLabelConstant.Qty.BackOrderQty}} = Sales Order PO Qty - Shipped PO Qty</md-tooltip></span>' +
          '<span ui-grid-visible="col.sort.direction" ng-class="{ \'ui-grid-icon-up-dir\': col.sort.direction == asc, \'ui-grid-icon-down-dir\': col.sort.direction == desc, \'ui-grid-icon-blank\': !col.sort.direction }">' +
          '&nbsp;' +
          '</span>' +
          '</div>' +
          '<div class="ui-grid-column-menu-button" ng-if="grid.options.enableColumnMenus && !col.isRowHeader  && col.colDef.enableColumnMenu !== false" class="ui-grid-column-menu-button" ng-click="toggleMenu($event)">' +
          '<i class="ui-grid-icon-angle-down">&nbsp;</i>' +
          '</div>' +
          '<div ng-if="filterable" class="ui-grid-filter-container" ng-repeat="colFilter in col.filters">' +
          '<input type="text" class="ui-grid-filter-input" ng-model="colFilter.term" />' +
          '<div class="margin-top-4 ui-grid-filter-button" ng-click="colFilter.term = null">' +
          '<i class="icon icon-close margin-right-0" ng-show="!!colFilter.term">&nbsp;</i>' +
          '</div>' +
          '</div>' +
          '</div>',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
        width: 140,
        treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
        footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right" >{{grid.appScope.$parent.vm.sumPOAssyBackOrderQty}}</div>'
      },
      {
        field: 'excessShipQty',
        displayName: vm.allLabelConstant.Qty.ExcessShipQty,
        enableCellEdit: false,
        enableCellEditOnFocus: true,
        width: 120,
        headerCellTemplate: '<div ng-class="{ \'sortable\': sortable }">' +
          '<div class="ui-grid-vertical-bar">&nbsp;</div>' +
          '<div class="ui-grid-cell-contents" col-index="renderIndex">{{grid.appScope.$parent.vm.allLabelConstant.Qty.ExcessShipQty}}<span class="icon-question-mark-circle help-icon">\
                            <md-tooltip md-direction="top">{{grid.appScope.$parent.vm.allLabelConstant.Qty.ExcessShipQty}} = Shipped PO Qty - Sales Order PO Qty</md-tooltip></span>' +
          '<span ui-grid-visible="col.sort.direction" ng-class="{ \'ui-grid-icon-up-dir\': col.sort.direction == asc, \'ui-grid-icon-down-dir\': col.sort.direction == desc, \'ui-grid-icon-blank\': !col.sort.direction }">' +
          '&nbsp;' +
          '</span>' +
          '</div>' +
          '<div class="ui-grid-column-menu-button" ng-if="grid.options.enableColumnMenus && !col.isRowHeader  && col.colDef.enableColumnMenu !== false" class="ui-grid-column-menu-button" ng-click="toggleMenu($event)">' +
          '<i class="ui-grid-icon-angle-down">&nbsp;</i>' +
          '</div>' +
          '<div ng-if="filterable" class="ui-grid-filter-container" ng-repeat="colFilter in col.filters">' +
          '<input type="text" class="ui-grid-filter-input" ng-model="colFilter.term" />' +
          '<div class="margin-top-4 ui-grid-filter-button" ng-click="colFilter.term = null">' +
          '<i class="icon icon-close margin-right-0" ng-show="!!colFilter.term">&nbsp;</i>' +
          '</div>' +
          '</div>' +
          '</div>',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
        treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
        footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right" >{{grid.appScope.$parent.vm.sumPOAssyExcessShipQty}}</div>'
      }
    ];

    // Grid Fields for Production Work order qty grid
    vm.sourceHeaderWO = [
      {
        field: 'Action',
        cellClass: 'gridCellColor',
        displayName: 'Action',
        width: '110',
        cellTemplate: '<grid-action-view grid="grid" row="row" number-of-action-button="3" row-entity="row.entity"></grid-action-view>',
        enableFiltering: false,
        enableSorting: false,
        exporterSuppressExport: true,
        pinnedLeft: true
      },
      {
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="grid.appScope.$parent.vm.loginUser.uiGridPreference !== \'P\'">\
        <span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span>\
        </div>\
        <div class="ui-grid-cell-contents grid-cell-text-right" ng-if="grid.appScope.$parent.vm.loginUser.uiGridPreference === \'P\'">\
        <span><b>{{(grid.appScope.$parent.vm.pagingInfoWO.pageSize * (grid.appScope.$parent.vm.pagingInfoWO.Page - 1)) + (grid.renderContainers.body.visibleRowCache.indexOf(row) + 1)}}</b></span>\
        </div>',
        enableFiltering: false,
        enableSorting: false
      },
      {
        field: 'stockTypeName',
        displayName: 'Stock Type',
        width: 135,
        //headerTooltip: 'Stock Type',
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'woNumber',
        displayName: vm.allLabelConstant.Workorder.WO,
        headerCellTemplate: '<div ng-class="{ \'sortable\': sortable }">' +
          '<div class="ui-grid-vertical-bar">&nbsp;</div>' +
          '<div class="ui-grid-cell-contents" col-index="renderIndex">{{grid.appScope.$parent.vm.allLabelConstant.Workorder.WO}}<span class="icon-question-mark-circle help-icon">\
                            <md-tooltip md-direction="top">Work Order Number</md-tooltip></span>' +
          '<span ui-grid-visible="col.sort.direction" ng-class="{ \'ui-grid-icon-up-dir\': col.sort.direction == asc, \'ui-grid-icon-down-dir\': col.sort.direction == desc, \'ui-grid-icon-blank\': !col.sort.direction }">' +
          '&nbsp;' +
          '</span>' +
          '</div>' +
          '<div class="ui-grid-column-menu-button" ng-if="grid.options.enableColumnMenus && !col.isRowHeader  && col.colDef.enableColumnMenu !== false" class="ui-grid-column-menu-button" ng-click="toggleMenu($event)">' +
          '<i class="ui-grid-icon-angle-down">&nbsp;</i>' +
          '</div>' +
          '<div ng-if="filterable" class="ui-grid-filter-container" ng-repeat="colFilter in col.filters">' +
          '<input type="text" class="ui-grid-filter-input" ng-model="colFilter.term" />' +
          '<div class="margin-top-4 ui-grid-filter-button" ng-click="colFilter.term = null">' +
          '<i class="icon icon-close margin-right-0" ng-show="!!colFilter.term">&nbsp;</i>' +
          '</div>' +
          '</div>' +
          '</div>',
        //headerTooltip: 'Work Order Number',
        cellTemplate: '<span class="ui-grid-cell-contents text-left" ng-if="row.entity.woid">\
                                        <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToWorkorderDetails(row.entity);$event.preventDefault();">{{row.entity.woNumber}}</a>\
                                        <md-tooltip>{{row.entity.woNumber}}</md-tooltip>\
                                    </span>\
                        <span class= "ui-grid-cell-contents text-left" ng-if= "!row.entity.woid" >\
                            <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToAssemblyOpeningBalanceDetails();$event.preventDefault();">{{ row.entity.woNumber }}</a>\
                            <md-tooltip>{{ row.entity.woNumber }}</md-tooltip> \
                       </span> \
                      <copy-text  label="grid.appScope.$parent.vm.allLabelConstant.Workorder.WO" text="row.entity.woNumber" ng-if="row.entity.woNumber"> </copy-text>',
        enableCellEdit: false,
        width: '210',
        enableFiltering: true,
        allowCellFocus: true
      },
      {
        field: 'woVersion',
        displayName: vm.allLabelConstant.Workorder.Version,
        headerCellTemplate: '<div ng-class="{ \'sortable\': sortable }">' +
          '<div class="ui-grid-vertical-bar">&nbsp;</div>' +
          '<div class="ui-grid-cell-contents" col-index="renderIndex">{{grid.appScope.$parent.vm.allLabelConstant.Workorder.Version}}<span class="icon-question-mark-circle help-icon">\
                            <md-tooltip md-direction="top">Work Order Version</md-tooltip></span>' +
          '<span ui-grid-visible="col.sort.direction" ng-class="{ \'ui-grid-icon-up-dir\': col.sort.direction == asc, \'ui-grid-icon-down-dir\': col.sort.direction == desc, \'ui-grid-icon-blank\': !col.sort.direction }">' +
          '&nbsp;' +
          '</span>' +
          '</div>' +
          '<div class="ui-grid-column-menu-button" ng-if="grid.options.enableColumnMenus && !col.isRowHeader  && col.colDef.enableColumnMenu !== false" class="ui-grid-column-menu-button" ng-click="toggleMenu($event)">' +
          '<i class="ui-grid-icon-angle-down">&nbsp;</i>' +
          '</div>' +
          '<div ng-if="filterable" class="ui-grid-filter-container" ng-repeat="colFilter in col.filters">' +
          '<input type="text" class="ui-grid-filter-input" ng-model="colFilter.term" />' +
          '<div class="margin-top-4 ui-grid-filter-button" ng-click="colFilter.term = null">' +
          '<i class="icon icon-close margin-right-0" ng-show="!!colFilter.term">&nbsp;</i>' +
          '</div>' +
          '</div>' +
          '</div>',
        //headerTooltip: 'Work Order Version',
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        enableCellEdit: false,
        width: '70',
        allowCellFocus: true
      },
      {
        field: 'poNumber',
        displayName: vm.CORE.LabelConstant.Workorder.PO,
        headerCellTemplate: '<div ng-class="{ \'sortable\': sortable }">' +
          '<div class="ui-grid-vertical-bar">&nbsp;</div>' +
          '<div class="ui-grid-cell-contents" col-index="renderIndex">{{grid.appScope.$parent.vm.allLabelConstant.Workorder.PO}}<span class="icon-question-mark-circle help-icon">\
                            <md-tooltip md-direction="top">Purchase Order Number</md-tooltip></span>' +
          '<span ui-grid-visible="col.sort.direction" ng-class="{ \'ui-grid-icon-up-dir\': col.sort.direction == asc, \'ui-grid-icon-down-dir\': col.sort.direction == desc, \'ui-grid-icon-blank\': !col.sort.direction }">' +
          '&nbsp;' +
          '</span>' +
          '</div>' +
          '<div class="ui-grid-column-menu-button" ng-if="grid.options.enableColumnMenus && !col.isRowHeader  && col.colDef.enableColumnMenu !== false" class="ui-grid-column-menu-button" ng-click="toggleMenu($event)">' +
          '<i class="ui-grid-icon-angle-down">&nbsp;</i>' +
          '</div>' +
          '<div ng-if="filterable" class="ui-grid-filter-container" ng-repeat="colFilter in col.filters">' +
          '<input type="text" class="ui-grid-filter-input" ng-model="colFilter.term" />' +
          '<div class="margin-top-4 ui-grid-filter-button" ng-click="colFilter.term = null">' +
          '<i class="icon icon-close margin-right-0" ng-show="!!colFilter.term">&nbsp;</i>' +
          '</div>' +
          '</div>' +
          '</div>',
        //headerTooltip: 'Purchase Order Number', // in purchase cell template in case of initial stock  PO# can be based on SO Entry or Manual Entry.
        cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-if="!row.entity.woid" ng-repeat="item in row.entity.poNumberList track by $index">' +
          '<a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToManageSalesOrder(item.soID)" tabindex="-1">{{item.poNumber}}</a>' +
          '<span ng-if="row.entity.poNumberList.length - 1 > $index">,</span> </div> ' +
          '<span class="ui-grid-cell-contents text-left" ng-if="row.entity.woid">\
                     <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.showSalesOrderDetails($event,row.entity);$event.preventDefault();">{{row.entity.poNumber}}</a>\
                     <md-tooltip>{{row.entity.poNumber}}</md-tooltip>'+
          '<copy-text  label="grid.appScope.$parent.vm.allLabelConstant.SalesOrder.PO" text="row.entity.poNumber" ng-if="row.entity.poNumber"> </copy-text>' +
          '</span>' +
          '<span class="ui-grid-cell-contents text-left" ng-if="!row.entity.woid && row.entity.poNumberList.length === 0">{{row.entity.poNumber}}' +
          '<copy-text  label="grid.appScope.$parent.vm.allLabelConstant.SalesOrder.PO" text="row.entity.poNumber" ng-if="row.entity.poNumber"> </copy-text> </span>',
        enableCellEdit: false,
        width: '230',
        allowCellFocus: true
      },
      {
        field: 'soNumbers',
        displayName: vm.allLabelConstant.SalesOrder.SO,
        headerCellTemplate: '<div ng-class="{ \'sortable\': sortable }">' +
          '<div class="ui-grid-vertical-bar">&nbsp;</div>' +
          '<div class="ui-grid-cell-contents" col-index="renderIndex">{{grid.appScope.$parent.vm.allLabelConstant.SalesOrder.SO}}<span class="icon-question-mark-circle help-icon">\
                            <md-tooltip md-direction="top">Sales Order Number</md-tooltip></span>' +
          '<span ui-grid-visible="col.sort.direction" ng-class="{ \'ui-grid-icon-up-dir\': col.sort.direction == asc, \'ui-grid-icon-down-dir\': col.sort.direction == desc, \'ui-grid-icon-blank\': !col.sort.direction }">' +
          '&nbsp;' +
          '</span>' +
          '</div>' +
          '<div class="ui-grid-column-menu-button" ng-if="grid.options.enableColumnMenus && !col.isRowHeader  && col.colDef.enableColumnMenu !== false" class="ui-grid-column-menu-button" ng-click="toggleMenu($event)">' +
          '<i class="ui-grid-icon-angle-down">&nbsp;</i>' +
          '</div>' +
          '<div ng-if="filterable" class="ui-grid-filter-container" ng-repeat="colFilter in col.filters">' +
          '<input type="text" class="ui-grid-filter-input" ng-model="colFilter.term" />' +
          '<div class="margin-top-4 ui-grid-filter-button" ng-click="colFilter.term = null">' +
          '<i class="icon icon-close margin-right-0" ng-show="!!colFilter.term">&nbsp;</i>' +
          '</div>' +
          '</div>' +
          '</div>',
        //headerTooltip: 'Sales Order Number',
        cellTemplate: '<div class= "ui-grid-cell-contents text-left" ng-if= "!row.entity.woid" ng-repeat="item in row.entity.soNumberList track by $index" > ' +
          '<a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToManageSalesOrder(item.soID)" tabindex="-1">{{item.soNumber}}</a>' +
          '<span ng-if="row.entity.soNumberList.length - 1 > $index">,</span> </div> ' +
          '<span class="ui-grid-cell-contents text-left" ng-if="row.entity.woid">\
                           <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.showSalesOrderDetails($event,row.entity);$event.preventDefault();">{{row.entity.soNumbers}}</a>\
                           <md-tooltip>{{row.entity.soNumbers}}</md-tooltip> '+
          '<copy-text  label="grid.appScope.$parent.vm.allLabelConstant.SalesOrder.SO" text="row.entity.soNumbers" ng-if="row.entity.soNumbers"> </copy-text>' +
          '</span>' +
          '<span class="ui-grid-cell-contents text-left" ng-if="!row.entity.woid && row.entity.soNumberList.length === 0"> {{row.entity.soNumbers}}' +
          '<copy-text  label="grid.appScope.$parent.vm.allLabelConstant.SalesOrder.SO" text="row.entity.soNumbers" ng-if="row.entity.soNumbers"> </copy-text> </span>',
        enableCellEdit: false,
        width: '230',
        allowCellFocus: true
      },
      {
        field: 'initialWOStockPOQty',
        displayName: vm.CORE.LabelConstant.Workorder.POQty,
        enableCellEdit: false,
        headerCellTemplate: '<div ng-class="{ \'sortable\': sortable }">' +
          '<div class="ui-grid-vertical-bar">&nbsp;</div>' +
          '<div class="ui-grid-cell-contents" col-index="renderIndex">{{grid.appScope.$parent.vm.CORE.LabelConstant.Workorder.POQty}}<span class="icon-question-mark-circle help-icon">\
                            <md-tooltip md-direction="top">Sales Order Assigned PO Qty</md-tooltip></span>' +
          '<span ui-grid-visible="col.sort.direction" ng-class="{ \'ui-grid-icon-up-dir\': col.sort.direction == asc, \'ui-grid-icon-down-dir\': col.sort.direction == desc, \'ui-grid-icon-blank\': !col.sort.direction }">' +
          '&nbsp;' +
          '</span>' +
          '</div>' +
          '<div class="ui-grid-column-menu-button" ng-if="grid.options.enableColumnMenus && !col.isRowHeader  && col.colDef.enableColumnMenu !== false" class="ui-grid-column-menu-button" ng-click="toggleMenu($event)">' +
          '<i class="ui-grid-icon-angle-down">&nbsp;</i>' +
          '</div>' +
          '<div ng-if="filterable" class="ui-grid-filter-container" ng-repeat="colFilter in col.filters">' +
          '<input type="text" class="ui-grid-filter-input" ng-model="colFilter.term" />' +
          '<div class="margin-top-4 ui-grid-filter-button" ng-click="colFilter.term = null">' +
          '<i class="icon icon-close margin-right-0" ng-show="!!colFilter.term">&nbsp;</i>' +
          '</div>' +
          '</div>' +
          '</div>',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
        width: '85',
        treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
        footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right" >{{grid.appScope.$parent.vm.sumPoQty}}</div>'
      },
      {
        field: 'buildOverageQty',
        displayName: vm.allLabelConstant.Qty.BuildOverageQty,
        headerCellTemplate: '<div ng-class="{ \'sortable\': sortable }">' +
          '<div class="ui-grid-vertical-bar">&nbsp;</div>' +
          '<div class="ui-grid-cell-contents" col-index="renderIndex">{{grid.appScope.$parent.vm.allLabelConstant.Qty.BuildOverageQty}}<span class="icon-question-mark-circle help-icon">\
                            <md-tooltip md-direction="top">{{grid.appScope.$parent.vm.allLabelConstant.Qty.BuildOverageQty}} = Work Order Build Qty - Sales Order Assigned PO Qty</md-tooltip></span>' +
          '<span ui-grid-visible="col.sort.direction" ng-class="{ \'ui-grid-icon-up-dir\': col.sort.direction == asc, \'ui-grid-icon-down-dir\': col.sort.direction == desc, \'ui-grid-icon-blank\': !col.sort.direction }">' +
          '&nbsp;' +
          '</span>' +
          '</div>' +
          '<div class="ui-grid-column-menu-button" ng-if="grid.options.enableColumnMenus && !col.isRowHeader  && col.colDef.enableColumnMenu !== false" class="ui-grid-column-menu-button" ng-click="toggleMenu($event)">' +
          '<i class="ui-grid-icon-angle-down">&nbsp;</i>' +
          '</div>' +
          '<div ng-if="filterable" class="ui-grid-filter-container" ng-repeat="colFilter in col.filters">' +
          '<input type="text" class="ui-grid-filter-input" ng-model="colFilter.term" />' +
          '<div class="margin-top-4 ui-grid-filter-button" ng-click="colFilter.term = null">' +
          '<i class="icon icon-close margin-right-0" ng-show="!!colFilter.term">&nbsp;</i>' +
          '</div>' +
          '</div>' +
          '</div>',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
        width: '100',
        treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
        footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right" >{{grid.appScope.$parent.vm.sumBuildOvgQty}}</div>'
      },
      {
        field: 'buildQty',
        displayName: vm.allLabelConstant.Workorder.ActualBuildQty,
        headerCellTemplate: '<div ng-class="{ \'sortable\': sortable }">' +
          '<div class="ui-grid-vertical-bar">&nbsp;</div>' +
          '<div class="ui-grid-cell-contents" col-index="renderIndex">{{grid.appScope.$parent.vm.allLabelConstant.Workorder.ActualBuildQty}}<span class="icon-question-mark-circle help-icon">\
                            <md-tooltip md-direction="top">Work Order {{grid.appScope.$parent.vm.allLabelConstant.Workorder.ActualBuildQty}} = Sales Order Assigned PO Qty</md-tooltip></span>' +
          '<span ui-grid-visible="col.sort.direction" ng-class="{ \'ui-grid-icon-up-dir\': col.sort.direction == asc, \'ui-grid-icon-down-dir\': col.sort.direction == desc, \'ui-grid-icon-blank\': !col.sort.direction }">' +
          '&nbsp;' +
          '</span>' +
          '</div>' +
          '<div class="ui-grid-column-menu-button" ng-if="grid.options.enableColumnMenus && !col.isRowHeader  && col.colDef.enableColumnMenu !== false" class="ui-grid-column-menu-button" ng-click="toggleMenu($event)">' +
          '<i class="ui-grid-icon-angle-down">&nbsp;</i>' +
          '</div>' +
          '<div ng-if="filterable" class="ui-grid-filter-container" ng-repeat="colFilter in col.filters">' +
          '<input type="text" class="ui-grid-filter-input" ng-model="colFilter.term" />' +
          '<div class="margin-top-4 ui-grid-filter-button" ng-click="colFilter.term = null">' +
          '<i class="icon icon-close margin-right-0" ng-show="!!colFilter.term">&nbsp;</i>' +
          '</div>' +
          '</div>' +
          '</div>',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
        width: '120',
        treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
        footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right" >{{grid.appScope.$parent.vm.sumBuildQty}}</div>'
      },
      {
        field: 'scrapQty',
        displayName: vm.allLabelConstant.Traveler.ScrappedQty,
        headerCellTemplate: '<div ng-class="{ \'sortable\': sortable }">' +
          '<div class="ui-grid-vertical-bar">&nbsp;</div>' +
          '<div class="ui-grid-cell-contents" col-index="renderIndex">{{grid.appScope.$parent.vm.allLabelConstant.Traveler.ScrappedQty}}<span class="icon-question-mark-circle help-icon">\
                            <md-tooltip md-direction="top">Total Work Order Scrapped Qty In Process</md-tooltip></span>' +
          '<span ui-grid-visible="col.sort.direction" ng-class="{ \'ui-grid-icon-up-dir\': col.sort.direction == asc, \'ui-grid-icon-down-dir\': col.sort.direction == desc, \'ui-grid-icon-blank\': !col.sort.direction }">' +
          '&nbsp;' +
          '</span>' +
          '</div>' +
          '<div class="ui-grid-column-menu-button" ng-if="grid.options.enableColumnMenus && !col.isRowHeader  && col.colDef.enableColumnMenu !== false" class="ui-grid-column-menu-button" ng-click="toggleMenu($event)">' +
          '<i class="ui-grid-icon-angle-down">&nbsp;</i>' +
          '</div>' +
          '<div ng-if="filterable" class="ui-grid-filter-container" ng-repeat="colFilter in col.filters">' +
          '<input type="text" class="ui-grid-filter-input" ng-model="colFilter.term" />' +
          '<div class="margin-top-4 ui-grid-filter-button" ng-click="colFilter.term = null">' +
          '<i class="icon icon-close margin-right-0" ng-show="!!colFilter.term">&nbsp;</i>' +
          '</div>' +
          '</div>' +
          '</div>',
        //headerTooltip: 'Total Work Order Scrapped Qty In Process',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
        width: '140',
        treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
        footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right" >{{grid.appScope.$parent.vm.sumScrapQty}}</div>'
      },
      {
        field: 'wipQty',
        displayName: vm.allLabelConstant.Qty.WIPQty,
        enableCellEdit: false,
        headerCellTemplate: '<div ng-class="{ \'sortable\': sortable }">' +
          '<div class="ui-grid-vertical-bar">&nbsp;</div>' +
          '<div class="ui-grid-cell-contents" col-index="renderIndex">{{grid.appScope.$parent.vm.allLabelConstant.Qty.WIPQty}}<span class="icon-question-mark-circle help-icon">\
                            <md-tooltip md-direction="top">Total In Process Qty</md-tooltip></span>' +
          '<span ui-grid-visible="col.sort.direction" ng-class="{ \'ui-grid-icon-up-dir\': col.sort.direction == asc, \'ui-grid-icon-down-dir\': col.sort.direction == desc, \'ui-grid-icon-blank\': !col.sort.direction }">' +
          '&nbsp;' +
          '</span>' +
          '</div>' +
          '<div class="ui-grid-column-menu-button" ng-if="grid.options.enableColumnMenus && !col.isRowHeader  && col.colDef.enableColumnMenu !== false" class="ui-grid-column-menu-button" ng-click="toggleMenu($event)">' +
          '<i class="ui-grid-icon-angle-down">&nbsp;</i>' +
          '</div>' +
          '<div ng-if="filterable" class="ui-grid-filter-container" ng-repeat="colFilter in col.filters">' +
          '<input type="text" class="ui-grid-filter-input" ng-model="colFilter.term" />' +
          '<div class="margin-top-4 ui-grid-filter-button" ng-click="colFilter.term = null">' +
          '<i class="icon icon-close margin-right-0" ng-show="!!colFilter.term">&nbsp;</i>' +
          '</div>' +
          '</div>' +
          '</div>',
        //headerTooltip: 'Total In Process Qty',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
        width: '110',
        treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
        footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right" >{{grid.appScope.$parent.vm.sumWipQty}}</div>'
      },
      {
        field: 'movedToStockQty',
        displayName: 'Initial Qty / Moved to Stock',
        enableCellEdit: false,
        //headerTooltip: 'Initial Qty / Moved to Stock',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
        width: '110',
        treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
        footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right" >{{grid.appScope.$parent.vm.sumMovedToStockQty}}</div>'
      }, {
        field: 'shippedQty',
        displayName: vm.allLabelConstant.Shipped.ShippedQty,
        enableCellEdit: false,
        headerCellTemplate: '<div ng-class="{ \'sortable\': sortable }">' +
          '<div class="ui-grid-vertical-bar">&nbsp;</div>' +
          '<div class="ui-grid-cell-contents" col-index="renderIndex">{{grid.appScope.$parent.vm.allLabelConstant.Shipped.ShippedQty}}<span class="icon-question-mark-circle help-icon">\
                            <md-tooltip md-direction="top">Shipped PO Qty</md-tooltip></span>' +
          '<span ui-grid-visible="col.sort.direction" ng-class="{ \'ui-grid-icon-up-dir\': col.sort.direction == asc, \'ui-grid-icon-down-dir\': col.sort.direction == desc, \'ui-grid-icon-blank\': !col.sort.direction }">' +
          '&nbsp;' +
          '</span>' +
          '</div>' +
          '<div class="ui-grid-column-menu-button" ng-if="grid.options.enableColumnMenus && !col.isRowHeader  && col.colDef.enableColumnMenu !== false" class="ui-grid-column-menu-button" ng-click="toggleMenu($event)">' +
          '<i class="ui-grid-icon-angle-down">&nbsp;</i>' +
          '</div>' +
          '<div ng-if="filterable" class="ui-grid-filter-container" ng-repeat="colFilter in col.filters">' +
          '<input type="text" class="ui-grid-filter-input" ng-model="colFilter.term" />' +
          '<div class="margin-top-4 ui-grid-filter-button" ng-click="colFilter.term = null">' +
          '<i class="icon icon-close margin-right-0" ng-show="!!colFilter.term">&nbsp;</i>' +
          '</div>' +
          '</div>' +
          '</div>',
        //headerTooltip: 'Shipped PO Qty',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
        width: '110',
        treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
        footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right" >{{grid.appScope.$parent.vm.sumShippedQty}}</div>'
      }, {
        field: 'stockAdjustmentQty',
        displayName: vm.allLabelConstant.Qty.StockAdjustmentQty,
        enableCellEdit: false,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
        width: '110',
        treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
        footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right" >{{grid.appScope.$parent.vm.sumStockAdjustmentQty}}</div>'
      },
      {
        field: 'readytoShipQty',
        displayName: vm.allLabelConstant.Qty.ReadyToShipQty,
        enableCellEdit: false,
        headerCellTemplate: '<div ng-class="{ \'sortable\': sortable }">' +
          '<div class="ui-grid-vertical-bar">&nbsp;</div>' +
          '<div class="ui-grid-cell-contents" col-index="renderIndex">{{grid.appScope.$parent.vm.allLabelConstant.Qty.ReadyToShipQty}}<span class="icon-question-mark-circle help-icon">\
                            <md-tooltip md-direction="top">Total Work Order Ready To Ship Qty</md-tooltip></span>' +
          '<span ui-grid-visible="col.sort.direction" ng-class="{ \'ui-grid-icon-up-dir\': col.sort.direction == asc, \'ui-grid-icon-down-dir\': col.sort.direction == desc, \'ui-grid-icon-blank\': !col.sort.direction }">' +
          '&nbsp;' +
          '</span>' +
          '</div>' +
          '<div class="ui-grid-column-menu-button" ng-if="grid.options.enableColumnMenus && !col.isRowHeader  && col.colDef.enableColumnMenu !== false" class="ui-grid-column-menu-button" ng-click="toggleMenu($event)">' +
          '<i class="ui-grid-icon-angle-down">&nbsp;</i>' +
          '</div>' +
          '<div ng-if="filterable" class="ui-grid-filter-container" ng-repeat="colFilter in col.filters">' +
          '<input type="text" class="ui-grid-filter-input" ng-model="colFilter.term" />' +
          '<div class="margin-top-4 ui-grid-filter-button" ng-click="colFilter.term = null">' +
          '<i class="icon icon-close margin-right-0" ng-show="!!colFilter.term">&nbsp;</i>' +
          '</div>' +
          '</div>' +
          '</div>',
        //headerTooltip: 'Total Work Order Ready To Ship Qty',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
        width: '95',
        treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
        footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right" >{{grid.appScope.$parent.vm.sumReadyToShipQty}}</div>'
      }, {
        field: 'excessFreetoUseQty',
        displayName: vm.allLabelConstant.Qty.ExcessFreetoUseQty,
        enableCellEdit: false,
        headerCellTemplate: '<div ng-class="{ \'sortable\': sortable }">' +
          '<div class="ui-grid-vertical-bar">&nbsp;</div>' +
          '<div class="ui-grid-cell-contents" col-index="renderIndex">{{grid.appScope.$parent.vm.allLabelConstant.Qty.ExcessFreetoUseQty}}<span class="icon-question-mark-circle help-icon">\
                            <md-tooltip md-direction="top">{{grid.appScope.$parent.vm.allLabelConstant.MFRQtyTooltipNotes.ExcessFreetoUseHelpText}}</md-tooltip></span>' +
          '<span ui-grid-visible="col.sort.direction" ng-class="{ \'ui-grid-icon-up-dir\': col.sort.direction == asc, \'ui-grid-icon-down-dir\': col.sort.direction == desc, \'ui-grid-icon-blank\': !col.sort.direction }">' +
          '&nbsp;' +
          '</span>' +
          '</div>' +
          '<div class="ui-grid-column-menu-button" ng-if="grid.options.enableColumnMenus && !col.isRowHeader  && col.colDef.enableColumnMenu !== false" class="ui-grid-column-menu-button" ng-click="toggleMenu($event)">' +
          '<i class="ui-grid-icon-angle-down">&nbsp;</i>' +
          '</div>' +
          '<div ng-if="filterable" class="ui-grid-filter-container" ng-repeat="colFilter in col.filters">' +
          '<input type="text" class="ui-grid-filter-input" ng-model="colFilter.term" />' +
          '<div class="margin-top-4 ui-grid-filter-button" ng-click="colFilter.term = null">' +
          '<i class="icon icon-close margin-right-0" ng-show="!!colFilter.term">&nbsp;</i>' +
          '</div>' +
          '</div>' +
          '</div>',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
        width: '150',
        treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
        footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right" >{{grid.appScope.$parent.vm.sumExcessFreetoUseQty}}</div>'
      }
    ];
    // initial info for PO
    const initPageInfoPO = () => {
      vm.pagingInfoPO = {
        Page: CORE.UIGrid.Page(),
        pageSize: CORE.UIGrid.ItemsPerPage(),
        SortColumns: [],
        SearchColumns: [],
        assyID: vm.data.partID,
        isShowAllPO: vm.isShowAllPO ? true : false,
        isAssemblyPO: true
      };
    };
    // initial info for WO
    const initPageInfoWO = () => {
      vm.pagingInfoWO = {
        Page: CORE.UIGrid.Page(),
        pageSize: CORE.UIGrid.ItemsPerPage(),
        SortColumns: [],
        SearchColumns: [],
        assyID: vm.data.partID,
        woID: null,
        poNumber: vm.selectedPoNumber ? vm.selectedPoNumber : null,
        SONumber: vm.selectedSONumber ? vm.selectedSONumber : null,        
        isShowAllWO: vm.isShowAllWO ? true : false
      };
    };

    initPageInfoPO();
    initPageInfoWO();

    vm.gridOptionsPO = {
      enablePaging: isEnablePagination,
      enablePaginationControls: isEnablePagination,
      showColumnFooter: true,
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: false,
      multiSelect: false,
      filterOptions: vm.pagingInfoPO.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: 'Assembly Stock PO Details.csv',
      allowToExportAllData: true,
      /* Calls everytime for Export All Data [rowType = ALL] */
      exporterAllDataFn: () => {
        /* For scrolling pagination vm.pagingInfo.Page is increase everytime so we have to set API side pagePerReocrds as NULL for Export All Data */
        const pagingInfoOld = _.clone(vm.pagingInfoPO);
        pagingInfoOld.pageSize = 0;
        pagingInfoOld.Page = 1;
        vm.gridOptionsPO.isExport = pagingInfoOld.isExport = true;
        return WorkorderFactory.getAssemblyStockPODetailsByAssyID().query(pagingInfoOld).$promise.then((resStk) => {
          if (resStk.status === CORE.ApiResponseTypeStatus.SUCCESS && resStk.data) {
            _.each(resStk.data.poAssemblyDetails, (obj) => {
              obj.poDate = BaseService.getUIFormatedDate(obj.poDate, vm.DefaultDateFormat);;
            });           
            return resStk.data.poAssemblyDetails;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.gridOptionsWO = {
      enablePaging: isEnablePagination,
      enablePaginationControls: isEnablePagination,
      showColumnFooter: true,
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: false,
      multiSelect: false,
      filterOptions: vm.pagingInfoWO.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: 'Assembly Stock WO Details.csv',
      allowToExportAllData: true,
      /* Calls everytime for Export All Data [rowType = ALL] */
      exporterAllDataFn: () => {
        /* For scrolling pagination vm.pagingInfo.Page is increase everytime so we have to set API side pagePerReocrds as NULL for Export All Data */
        const pagingInfoOld = _.clone(vm.pagingInfoWO);
        pagingInfoOld.pageSize = 0;
        pagingInfoOld.Page = 1;
        vm.gridOptionsWO.isExport = pagingInfoOld.isExport = true;
        return WorkorderFactory.getAssemblyStockWODetailsByAssyID().query(pagingInfoOld).$promise.then((resStk) => {
          if (resStk.status === CORE.ApiResponseTypeStatus.SUCCESS && resStk.data) {            
            return resStk.data.woAssemblyDetails;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.headerdata = [];
    vm.headerdata.push(
      {
        label: vm.allLabelConstant.Assembly.PIDCode,
        value: vm.data.PIDCode,
        displayOrder: 1,
        isCopy: true,
        isAssy: true,
        labelLinkFn: vm.goToAssemblyList,
        valueLinkFn: vm.goToAssemblyDetails,
        imgParms: {
          imgPath: vm.data.rohsIcon,
          imgDetail: vm.data.rohsName
        }
      },
      {
        label: vm.allLabelConstant.Assembly.MFGPN,
        value: vm.data.mfgPN,
        displayOrder: 2,
        isCopy: true,
        isAssy: true,
        labelLinkFn: vm.goToAssemblyList,
        valueLinkFn: vm.goToAssemblyDetails,
        imgParms: {
          imgPath: vm.data.rohsIcon,
          imgDetail: vm.data.rohsName
        }
      },
      {
        label: vm.allLabelConstant.Qty.ReadyToShipQtyWithStockAdjustment,
        value: 0,
        displayOrder: 3
      },
      {
        label: vm.allLabelConstant.Qty.ExcessFreetoUseQty,
        value: 0,
        displayOrder: 4
      }
    );

    const loadGridData = () => {
      vm.cgBusyLoading = $q.all([vm.loadDataPO(), vm.loadDataWO()]).then(() => {
        setSummaryDetailsQty();
      }).catch((error) => {
        BaseService.getErrorLog(error);
      });
    };

    // Refresh Assembly stock details
    vm.refreshStockDetails = () => {
      vm.isShowAllWO = false;
      vm.isShowAllPO = false;
      vm.selectedPoNumber = null;
      vm.selectedSONumber = null;
      initPageInfoPO();
      initPageInfoWO();
      loadGridData();
    };

    vm.showAllWO = () => {
      //if (vm.isShowAllWO) {
      //  vm.pagingInfoWO.poNumber = vm.selectedPoNumber ? vm.selectedPoNumber : null;
      //} else {
      //  vm.selectedPoNumber = null;
      //}
      vm.pagingInfoWO.isShowAllWO = vm.isShowAllWO ? true : false;
      vm.pagingInfoWO.poNumber = vm.selectedPoNumber ? vm.selectedPoNumber : null;
      vm.pagingInfoWO.poNumber = vm.selectedSONumber ? vm.selectedSONumber : null;      
      vm.loadDataWO();
    };

    vm.showAllPO = () => {
      vm.pagingInfoPO.isShowAllPO = vm.isShowAllPO ? true : false;
      vm.loadDataPO();
    };
    //view assembly stock WO detail based on selected PO.
    vm.viewAssemblyWO = (data) => {
      vm.getAssemblyWOSelectedPO(data.entity);
    };

    vm.getAssemblyWOSelectedPO = (row) => {
      if (row && row.poNumber) {
        vm.selectedPoNumber = row.poNumber;
        vm.selectedSONumber = row.soNumber;
        vm.isDisplayAllWO = false;
        initPageInfoWO();
        vm.loadDataWO();
      } else {
        vm.isNoDataFoundWO = true;
        vm.selectedPoNumber = null;
        vm.selectedSONumber = null;
        vm.sourceDataWO = [];
        vm.totalSourceDataCountWO = 0;
      }
    };

    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setPODataAfterGetAPICall = (assemblyPOStockDetails, isGetDataDownPO) => {
      if (assemblyPOStockDetails && assemblyPOStockDetails.data && assemblyPOStockDetails.data.poAssemblyDetails) {
        // set date default folder, disable view assembly stock and add adjustment action buttons.
        _.map(assemblyPOStockDetails.data.poAssemblyDetails, (data) => {
          data.poDate = BaseService.getUIFormatedDate(data.poDate, vm.DefaultDateFormat);
          data.isDisabledViewAssemblyInitialStock = true;
          data.isDisableAddStockAdjustment = true;
          if (data.woCount > 0) {
            data.hasDatailData = true;
          } else {
            data.hasDatailData = false;
          }
        });
        if (!isGetDataDownPO) {
          vm.sourceDataPO = assemblyPOStockDetails.data.poAssemblyDetails;
          vm.currentdataPO = vm.sourceDataPO.length;
        }
        else if (assemblyPOStockDetails.data.assemblyPOStockDetailsList.length > 0) {
          vm.sourceDataPO = vm.gridOptionsPO.data = vm.gridOptionsPO.data.concat(assemblyPOStockDetails.data.poAssemblyDetails);
          vm.currentdataPO = vm.gridOptionsPO.currentItem = vm.gridOptionsPO.data.length;
        }

        // must set after new data comes
        vm.totalSourceDataCountPO = assemblyPOStockDetails.data.count;
        if (!vm.gridOptionsPO.enablePaging) {
          if (!isGetDataDownPO) {
            vm.gridOptionsPO.gridApi.infiniteScroll.resetScroll();
          }
          else {
            vm.gridOptionsPO.gridApi.infiniteScroll.saveScrollPercentage();
          }
        }
        if (!isGetDataDownPO) {
          vm.gridOptionsPO.clearSelectedRows();
        }
        if (vm.totalSourceDataCountPO === 0) {
          if (vm.pagingInfoPO.SearchColumns.length > 0) {
            vm.isNoDataFoundPO = false;
            vm.emptyStatePO = 0;
          }
          else {
            vm.isNoDataFoundPO = true;
            vm.emptyStatePO = null;
          }
        }
        else {
          vm.isNoDataFoundPO = false;
          vm.emptyStatePO = null;
        }
        $timeout(() => {
          if (!isGetDataDownPO) {
            vm.resetSourceGridPO();
            if (!vm.gridOptionsPO.enablePaging && vm.totalSourceDataCountPO === vm.currentdataPO) {
              return vm.gridOptionsPO.gridApi.infiniteScroll.dataLoaded(false, false);
            }
          }
          else {
            return vm.gridOptionsPO.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCountPO !== vm.currentdataPO ? true : false);
          }
        });
      }
    };

    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setWODataAfterGetAPICall = (assemblyWOStockDetails, isGetDataDownWO) => {
      if (assemblyWOStockDetails && assemblyWOStockDetails.data && assemblyWOStockDetails.data.woAssemblyDetails) {
        // Disable action button
        _.map(assemblyWOStockDetails.data.woAssemblyDetails, (data) => {
          data.isDisabledViewAssemblyWO = true;
          if (data.woid) {
            data.isDisabledViewAssemblyInitialStock = true;
            if (!data.readytoShipQty) {
              data.isDisableAddStockAdjustment = true;
            }
          }
        });
        if (!isGetDataDownWO) {
          vm.sourceDataWO = assemblyWOStockDetails.data.woAssemblyDetails;
          vm.currentdataWO = vm.sourceDataWO.length;
          formatSONumberListOfGridData(vm.sourceDataWO);
          formatPONumberListOfGridData(vm.sourceDataWO);
        }
        else if (assemblyWOStockDetails.data.assemblyWOStockDetailsList.length > 0) {
          vm.sourceDataWO = vm.gridOptionsWO.data = vm.gridOptionsWO.data.concat(assemblyWOStockDetails.data.woAssemblyDetails);
          vm.currentdataWO = vm.gridOptionsWO.currentItem = vm.gridOptionsWO.data.length;
        }

        // must set after new data comes
        vm.totalSourceDataCountWO = assemblyWOStockDetails.data.count;
        if (!vm.gridOptionsWO.enablePaging) {
          if (!isGetDataDownWO) {
            vm.gridOptionsWO.gridApi.infiniteScroll.resetScroll();
          }
          else {
            vm.gridOptionsWO.gridApi.infiniteScroll.saveScrollPercentage();
          }
        }
        if (!isGetDataDownWO) {
          vm.gridOptionsWO.clearSelectedRows();
        }
        if (vm.totalSourceDataCountWO === 0) {
          if (vm.pagingInfoWO.SearchColumns.length > 0) {
            vm.isNoDataFoundWO = false;
            vm.emptyStateWO = 0;
          }
          else {
            vm.isNoDataFoundWO = true;
            vm.emptyStateWO = null;
          }
        }
        else {
          vm.isNoDataFoundWO = false;
          vm.emptyStateWO = null;
        }
        $timeout(() => {
          if (!isGetDataDownWO) {
            vm.resetSourceGridWO();
            if (!vm.gridOptionsWO.enablePaging && vm.totalSourceDataCountWO === vm.currentdataWO) {
              return vm.gridOptionsWO.gridApi.infiniteScroll.dataLoaded(false, false);
            }
          }
          else {
            return vm.gridOptionsWO.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCountWO !== vm.currentdataWO ? true : false);
          }
        });
      }
    };

    // get data from API for sales order
    vm.loadDataPO = () => {
      if (vm.data.partID) {
        const getAssemblyPOStockStatusList = () => {
          vm.cgBusyLoading = WorkorderFactory.getAssemblyStockPODetailsByAssyID().query(vm.pagingInfoPO).$promise.then((assemblyPOStockDetails) => {
            if (assemblyPOStockDetails && assemblyPOStockDetails.data) {
              vm.poAssemblyDetails = assemblyPOStockDetails.data.poAssemblyDetails;
              setSumOfPOAssyQty();
              setPODataAfterGetAPICall(assemblyPOStockDetails, false);
            }
          }).catch((error) => BaseService.getErrorLog(error));
        };
        getAssemblyPOStockStatusList();
      }
    };

    // get data from API for work order
    vm.loadDataWO = () => {
      if (vm.data.partID) {
        const getAssemblyWOStockStatusList = () => {
          vm.pagingInfoWO.isShowAllWO = vm.isShowAllWO ? true : false;
          vm.pagingInfoWO.poNumber = vm.selectedPoNumber ? vm.selectedPoNumber : null;
          vm.pagingInfoWO.SONumber = vm.selectedSONumber ? vm.selectedSONumber : null;
          vm.cgBusyLoading = WorkorderFactory.getAssemblyStockWODetailsByAssyID().query(vm.pagingInfoWO).$promise.then((assemblyWOStockDetails) => {
            if (assemblyWOStockDetails && assemblyWOStockDetails.data) {
              vm.woAssemblyDetails = assemblyWOStockDetails.data.woAssemblyDetails;
              setSumOfWOAssyQty();
              setWODataAfterGetAPICall(assemblyWOStockDetails, false);
            }
          }).catch((error) => BaseService.getErrorLog(error));
        };
        getAssemblyWOStockStatusList();
      }
    };

    const setSummaryDetailsQty = () => {
      vm.cgBusyLoading = WorkorderFactory.getAssemblyStockSummaryByAssyID().query({
        assyID: vm.data.partID
      }).$promise.then((assemblySummaryDetails) => {
        if (assemblySummaryDetails && assemblySummaryDetails.data) {
          vm.readyToShipQtyWithStockAdjustment = assemblySummaryDetails.data.readytoShipQty + assemblySummaryDetails.data.stockAdjustmentQty;
          vm.sumSummaryWipQty = assemblySummaryDetails.data.wipQty;
          vm.sumSummaryExcessFreetoUseQty = assemblySummaryDetails.data.excessFreetoUseQty;
          vm.sumSummaryPOAssyBackOrderQty = assemblySummaryDetails.data.backOrderQty;
          vm.sumReadyToShipQtyWithStockAdjustAndWIPQty = (vm.readyToShipQtyWithStockAdjustment || 0) + (vm.sumSummaryWipQty || 0);
          vm.possibleExcessQty = (vm.sumReadyToShipQtyWithStockAdjustAndWIPQty || 0) - (vm.sumSummaryPOAssyBackOrderQty || 0);
          setReadyToShipQtyHeader();
          setExcessFreetoUseQtyHeader();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // to display total sum of work order assembly qty
    const setSumOfWOAssyQty = () => {
      vm.sumPoQty = _.sumBy(vm.woAssemblyDetails, (o) => o.initialWOStockPOQty);
      vm.sumBuildOvgQty = _.sumBy(vm.woAssemblyDetails, (o) => o.buildOverageQty);
      vm.sumBuildQty = _.sumBy(vm.woAssemblyDetails, (o) => o.buildQty);
      vm.sumScrapQty = _.sumBy(vm.woAssemblyDetails, (o) => o.scrapQty);
      vm.sumReadyToShipQty = _.sumBy(vm.woAssemblyDetails, (o) => o.readytoShipQty);
      vm.sumShippedQty = _.sumBy(vm.woAssemblyDetails, (o) => o.shippedQty);
      vm.sumWipQty = _.sumBy(vm.woAssemblyDetails, (o) => o.wipQty);
      vm.sumMovedToStockQty = _.sumBy(vm.woAssemblyDetails, (o) => o.movedToStockQty);
      vm.sumStockAdjustmentQty = _.sumBy(vm.woAssemblyDetails, (o) => o.stockAdjustmentQty);
      vm.sumExcessFreetoUseQty = _.sumBy(vm.woAssemblyDetails, (o) => o.excessFreetoUseQty);
    };

    // to display total sum of sales order assembly qty
    const setSumOfPOAssyQty = () => {
      vm.sumPOAssyPOQty = (_.sumBy(vm.poAssemblyDetails, (o) => o.poQty)) || 0;
      vm.sumPOAssyBuildQty = (_.sumBy(vm.poAssemblyDetails, (o) => o.buildQty)) || 0;
      vm.sumPOAssyShippedQty = (_.sumBy(vm.poAssemblyDetails, (o) => o.shippedQty)) || 0;
      vm.sumPOAssyBackOrderQty = (_.sumBy(vm.poAssemblyDetails, (o) => o.backOrderQty)) || 0;
      vm.sumPOAssyExcessShipQty = (_.sumBy(vm.poAssemblyDetails, (o) => o.excessShipQty)) || 0;
    };

    // to set Ready To Ship Qty on pop up Header
    const setReadyToShipQtyHeader = () => {
      const readyToShipQtyHeader = _.find(vm.headerdata, (headerItem) => headerItem.label === vm.allLabelConstant.Qty.ReadyToShipQtyWithStockAdjustment);
      if (readyToShipQtyHeader) {
        readyToShipQtyHeader.value = vm.readyToShipQtyWithStockAdjustment;
      }
    };

    // to set Excess (Free to Use) Qty on pop up Header
    const setExcessFreetoUseQtyHeader = () => {
      const excessFreetoUseQtyHeader = _.find(vm.headerdata, (headerItem) => headerItem.label === vm.allLabelConstant.Qty.ExcessFreetoUseQty);
      if (excessFreetoUseQtyHeader) {
        excessFreetoUseQtyHeader.value = vm.sumSummaryExcessFreetoUseQty;
      }
    };

    /* display work order sales order header all details while click on that link*/
    vm.showSalesOrderDetails = (ev, row) => {
      if (row && row.poNumber && row.soNumbers) {
        const data = angular.copy(row);
        data.salesOrderNumber = row.soNumbers;
        DialogFactory.dialogService(
          CORE.WO_SO_HEADER_DETAILS_MODAL_CONTROLLER,
          CORE.WO_SO_HEADER_DETAILS_MODAL_VIEW,
          ev,
          data).then(() => {
          }, (() => {
          }), (error) => BaseService.getErrorLog(error));
      }
    };

    vm.cancel = () => {
      $mdDialog.cancel();
    };

    // go to work order details
    vm.goToWorkorderDetails = (row) => {
      if (row) {
        BaseService.goToWorkorderDetails(row.woid);
        return false;
      }
    };

    // open initial stock
    vm.addOpeningBalance = (ev) => {
      const popUpData = {
        popupAccessRoutingState: [TRANSACTION.TRANSACTION_STOCK_ADJUSTMENT_STATE],
        pageNameAccessLabel: CORE.LabelConstant.StockAdjustment.PageName
      };
      const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
      if (isAccessPopUp) {
        const data = {
          isAddDataFromCustomerPackingSlipPage: true,
          customerPackingSlipDet: {
            partID: vm.data.partID
          }
        };

        DialogFactory.dialogService(
          USER.ADMIN_ASSEMBLYSTOCK_UPDATE_MODAL_CONTROLLER,
          USER.ADMIN_ASSEMBLYSTOCK_UPDATE_MODAL_VIEW,
          ev,
          data).then(() => {
            vm.refreshStockDetails();
            // vm.loadDataWO();
          }, (error) => BaseService.getErrorLog(error));
      }
    };

    // view initial stock of work order
    vm.viewAssemblyInitialStock = (row, ev) => {
      if (!row.woNumber) {
        return;
      }
      const popUpData = {
        popupAccessRoutingState: [USER.ADMIN_ASSEMBLYSTOCK_STATE],
        pageNameAccessLabel: CORE.LabelConstant.StockAdjustment.PageName
      };
      const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
      if (isAccessPopUp) {
        const data = {
          partID: vm.data.partID,
          PIDCode: vm.data.PIDCode,
          rohsIcon: vm.data.rohsIcon,
          rohsName: vm.data.rohsName,
          woNumber: row.woNumber
        };

        DialogFactory.dialogService(
          USER.ASSY_OPENING_STOCK_LIST_MODAL_CONTROLLER,
          USER.ASSY_OPENING_STOCK_LIST_MODAL_VIEW,
          ev,
          data).then(() => {
            // success/fail block
          }, (err) => BaseService.getErrorLog(err));
      }
    };

    // open stock adjustment popup to add new adjustment
    vm.addStockAdjustment = (row, ev) => {
      if (!row.entity.woNumber) {
        return;
      }
      const popUpData = {
        popupAccessRoutingState: [TRANSACTION.TRANSACTION_STOCK_ADJUSTMENT_STATE],
        pageNameAccessLabel: CORE.LabelConstant.StockAdjustment.PageName
      };
      const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
      if (isAccessPopUp) {
        const data = {
          isAddDataFromCustomerPackingSlipPage: true,
          customerPackingSlipDet: {
            partID: vm.data.partID,
            PIDCode: vm.data.PIDCode,
            woNumber: row.entity.woNumber
          }
        };

        DialogFactory.dialogService(
          TRANSACTION.TRANSACTION_STOCK_ADJUSTMENT_POPUP_CONTROLLER,
          TRANSACTION.TRANSACTION_STOCK_ADJUSTMENT_POPUP_VIEW,
          ev,
          data).then((resposne) => {
            if (resposne) {
              vm.loadDataWO();
            }
          }, (err) => BaseService.getErrorLog(err));
      }
    };

    // Initial Stock Redirection Button
    vm.goToAssemblyOpeningBalanceDetails = () => {
      BaseService.goToAssemblyOpeningBalanceDetails(vm.data.partID);
      return false;
    };

    //format poNumber List (all in new line) Of Grid Data
    const formatPONumberListOfGridData = (data) => {
      _.each(data, (item) => {
        if (item.poNumber) {
          item.poNumberList = item.poNumber.split('@@@@@') || [];
          if (item.poNumberList && item.poNumberList.toString().contains('#####')) {
            _.each(item.poNumberList, (aliasSplit, index) => {
              const poSplitList = aliasSplit.split('#####');
              if (Array.isArray(poSplitList) && poSplitList.length > 0) {
                const objPODet = {
                  poNumber: poSplitList[0],
                  soID: poSplitList[1]
                };
                item.poNumberList[index] = objPODet;
              }
            });
          } else {
            item.poNumberList = [];
          }
          item.poNumber = item.poNumber ? item.poNumber.replace(/#####\d+@@@@@/g, ', ').replace(/#####\d+/g, '') : null;
        }
      });
    };

    //format soNumber List (all in new line) Of Grid Data
    const formatSONumberListOfGridData = (data) => {
      _.each(data, (item) => {
        if (item.soNumbers) {
          item.soNumberList = item.soNumbers.split('@@@@@') || [];
          if (item.soNumberList && item.soNumberList.toString().contains('#####')) {
            _.each(item.soNumberList, (aliasSplit, index) => {
              const soSplitList = aliasSplit.split('#####');
              if (Array.isArray(soSplitList) && soSplitList.length > 0) {
                const objSODet = {
                  soNumber: soSplitList[0],
                  soID: soSplitList[1]
                };
                item.soNumberList[index] = objSODet;
              }
            });
          } else {
            item.soNumberList = [];
          }
          item.soNumbers = item.soNumbers ? item.soNumbers.replace(/#####\d+@@@@@/g, ', ').replace(/#####\d+/g, '') : null;
        }
      });
    };

    vm.clearPONumberFromWOList = () => {
      vm.selectedPoNumber = null;
      vm.selectedSONumber = null;
      BaseService.reloadUIGrid(vm.gridOptionsWO, vm.pagingInfoWO, initPageInfoWO, vm.loadDataWO);
    };

    //go to salesordder detail
    vm.goToManageSalesOrder = (soId) => {
      BaseService.goToManageSalesOrder(soId);
    };

    //after page load
    setSummaryDetailsQty();
    // get class for Sale Order type
    vm.getPOTypeClassName = (classText) => {
      const poType = _.find(CORE.POType, (item) => item.Name === classText);
      return poType ? poType.ClassName : '';
    };
  }

})();
