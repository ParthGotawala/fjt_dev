(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .controller('PricingHistoryPopupController', PricingHistoryPopupController);

  /** @ngInject */
  function PricingHistoryPopupController($mdDialog, $timeout, $filter, CORE, RFQTRANSACTION,
    data, PartCostingFactory, BaseService) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.isHideDelete = true;
    vm.PricingType = RFQTRANSACTION.PRICING_HISTORY_TYPE;
    var PartCosting = RFQTRANSACTION.PART_COSTING;
    vm.EmptyMesssage = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.PRICING_HISTORY;
    vm.isExpand = true;
    vm.isOptionChange = false;
    vm.setScrollClass = "gridScrollHeight_PriceHistory";
    //paging details for grid
    vm.pagingInfo = {
      Page: CORE.UIGrid.Page(),
      SortColumns: [['lineID', 'ASC']],
      SearchColumns: [],
      id: data.rfqAssyID,
      passyQtyID: 0,
      spName: vm.PricingType[0].spName,
      pstartHistory: 1,
      plastHistory: 1
    };

    //set grid option for action with ui grid
    vm.gridOptions = {
      enableRowSelection: false,
      showColumnFooter: true,
      showGridFooter: false,
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: false,
      multiSelect: false,
      filterOptions: vm.pagingInfo.SearchColumns,
      enablePaging: false,
      enableCellEditOnFocus: true,
      exporterCsvFilename: 'Pricing History.csv',
      enableGrouping: false,
      enableGridMenu: true
    };

    PartCostingFactory.getPricingHistoryList().query({ rfqAssyID: data.rfqAssyID }).$promise.then((list) => {
      vm.pricingHistory = list.data.pricingHistoryList;
      if (vm.pricingHistory.length > 0) {
        vm.pricingHistory[vm.pricingHistory.length - 1].id = "Last";
        vm.qtyList = list.data.assyQtyList;
        initAutoComplete();
        vm.assyQtyAutoComplete.keyColumnId = vm.qtyList[0].id;
        vm.priceHistoryTypeAutoComplete.keyColumnId = vm.PricingType[0].id;
        vm.show = true;
      }
      else
        vm.isNoDataFound = true;
    }).catch((error) => {
      return BaseService.getErrorLog(error);
    });
    //set header for ui grid
    let sourceHeader = [
      {
        field: '#',
        width: '55',
        cellTemplate: '<div class="ui-grid-cell-contents"  ng-disabled="row.Entity.isdisable"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
        enableFiltering: false,
        enableSorting: false,
        enableCellEdit: false,
        allowCellFocus: false,
        enableColumnMenus: false,
        maxWidth: '65',
      },
      {
        field: 'lineID',
        displayName: 'Item',
        width: '80',
        cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
        enableFiltering: true,
        enableSorting: true,
        enableCellEdit: false,
        enableColumnMenus: false,
        allowCellFocus: false,
        maxWidth: '100',

      },
      {
        field: 'mfgPN',
        displayName: 'PID',
        cellTemplate: '<alternative-component-details is-expand="grid.appScope.$parent.vm.isExpand" ng-click="$event.stopPropagation();" row-data="row.entity" is-history="true"></alternative-component-details>',
        width: CORE.UI_GRID_COLUMN_WIDTH.PID,
        enableCellEdit: false,
        maxWidth: '500',
        enableFiltering: true,
        enableSorting: true,
        enableColumnMenus: false,
        allowCellFocus: false,
      },
      {
        field: 'qpa',
        displayName: 'Consolidated QPA',
        cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
        width: '120',
        maxWidth: '120',
        enableCellEdit: false,
        enableFiltering: true,
        enableSorting: true,
        enableColumnMenus: false,
        allowCellFocus: false,

      }
    ];
    vm.sourceHeader = _.clone(sourceHeader);
    var sourceData = angular.copy(vm.sourceHeader);
    //get list of pricing history
    vm.loadData = () => {
      if (vm.isOptionChange) {
        vm.pagingInfo.SortColumns = [['lineID', 'ASC']];
        vm.sourceHeader = _.clone(sourceHeader);
        sourceData = angular.copy(vm.sourceHeader);
      }
      if (vm.pagingInfo.SortColumns.length > 0) {
        var pageinfo = _.find(vm.pagingInfo.SortColumns, (column) => { return column[0] == 'lineID' });
      }
      vm.pagingInfo.passyQtyID = vm.assyQtyAutoComplete.keyColumnId ? vm.assyQtyAutoComplete.keyColumnId : vm.qtyList[0].id;
      vm.cgBusyLoading = PartCostingFactory.getPricingHistoryforAssembly(vm.pagingInfo).query().$promise.then((pricinghistory) => {
        if (pricinghistory.data && pricinghistory.data.consolidateParts) {
          vm.isOptionChange = false;
          vm.sourceData = pricinghistory.data.consolidateParts;
          vm.totalCount = pricinghistory.data.totalCount;
          vm.totalSourceDataCount = pricinghistory.data.Count;
          if (vm.totalSourceDataCount == 0) {
            if (vm.pagingInfo.SearchColumns.length > 0) {
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
          if (!vm.gridOptions.enablePaging) {
            vm.currentdata = vm.sourceData.length;
            vm.gridOptions.gridApi.infiniteScroll.resetScroll();
          }
          vm.gridOptions.clearSelectedRows();
          if (vm.sourceData.length > 0 && pageinfo) {
            vm.partcostingKeys = Object.keys(vm.sourceData[0]);
            _.each(vm.partcostingKeys, function (keys) {
              if (BaseService.checkForVisibleColumnInGrid(PartCosting, keys, sourceData)) {
                var partQty = _.find(vm.sourceHeader, (pQty) => { return pQty.field == keys });
                if (partQty) {
                  var index = _.indexOf(vm.sourceHeader, partQty);
                  vm.sourceHeader.splice(index, 1);
                }
                var objQtyPrice = _.find(vm.sourceData, (sData) => { return sData.isPurchase == true && (sData[keys] || sData[keys] == 0) });
                var ischange = _.find(vm.pricingHistory, (history) => { return history.createdAt == keys });
                if (ischange) {
                  var historyindex = _.indexOf(vm.pricingHistory, ischange);
                  if (historyindex > 0)
                    var lastHistory = vm.pricingHistory[historyindex - 1].createdAt;
                }
                var obj = {
                  field: keys,
                  displayName: keys,
                  cellTemplate: '<div ng-if="row.entity.isPurchase" ng-class="{\'highlight\':(row.entity[\'' + keys + '\'] && row.entity[\'' + keys + '\']!=row.entity[\'' + lastHistory + '\'])}" style="padding:5px;height: 100%;overflow: hidden; white-space: nowrap;\" class=\"height-grid ui-grid-cell-contents\">\
                                                       {{COL_FIELD}}\
                                                    </div>\
                                                   <div ng-if="!row.entity.isPurchase" ng-click="$event.stopPropagation();" style="overflow: hidden;" class="ui-grid-cell-contents">\
                                                        <span style="color: rgb(3,155,229);">DNP</span>\
                                                        <md-tooltip  md-direction="top">\
                                                            Do Not Purchase Part\
                                                        </md-tooltip>\
                                                   </div>',
                  width: !objQtyPrice ? '100' : '500',
                  enableCellEdit: false,
                  maxWidth: !objQtyPrice ? '300' : '800',
                  allowCellFocus: false,
                  footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer" >{{grid.appScope.$parent.vm.getFooterPrice(\'' + keys + '\', col)}}</div>',
                }
                vm.sourceHeader.push(obj);
              }
            });
          }
          $timeout(() => {
            vm.resetSourceGrid();
            if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount == vm.currentdata) {
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
            }
          });

        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    //it will use for infinite scroll and concate data 
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = PartCostingFactory.getPricingHistoryforAssembly(vm.pagingInfo).query().$promise.then((pricinghistory) => {
        if (pricinghistory.data && pricinghistory.data.consolidateParts) {
          vm.sourceData = vm.sourceData.concat(pricinghistory.data.consolidateParts);
          vm.currentdata = vm.sourceData.length;
          vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
          $timeout(() => {
            vm.resetSourceGrid();
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount != vm.currentdata ? true : false);
          });
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };
    vm.cancel = () => {
      $mdDialog.cancel();
    };
    function getHistoryformLocal(item) {
      if (item) {
        vm.pagingInfo.pstartHistory = item.historyID;
        if (vm.priceHistoryToAutoComplete && vm.priceHistoryToAutoComplete.keyColumnId && item.historyID > vm.priceHistoryToAutoComplete.keyColumnId) {
          vm.priceHistoryFromAutoComplete.keyColumnId = vm.pricingHistory[0].historyID;
        }
      }
    }
    function getHistorytoLocal(item) {
      if (item) {
        vm.pagingInfo.plastHistory = item.historyID;
        if (vm.priceHistoryFromAutoComplete && vm.priceHistoryFromAutoComplete.keyColumnId && item.historyID < vm.priceHistoryFromAutoComplete.keyColumnId) {
          vm.priceHistoryFromAutoComplete.keyColumnId = vm.pricingHistory[0].historyID;
        }
      }
    }
    //select pricing type
    //1.last five
    //2. select range
    //3.compare any two price
    function getPricingType(item) {
      if (item) {
        vm.pagingInfo.spName = item.spName;
        vm.isOptionChange = true;
      }
    }
    //serach 
    vm.searchData = () => {
      vm.sourceHeader = _.clone(sourceHeader);
      sourceData = angular.copy(vm.sourceHeader);
      vm.pagingInfo.SortColumns = [['lineID', 'ASC']];
      vm.loadData();
    }
    let initAutoComplete = () => {
      vm.assyQtyAutoComplete = {
        columnName: 'requestQty',
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'Request Qty',
        placeholderName: 'Request Qty',
        isRequired: false,
        isAddnew: false,
      },
        vm.priceHistoryTypeAutoComplete = {
          columnName: 'Value',
          keyColumnName: 'id',
          keyColumnId: null,
          inputName: 'Option',
          placeholderName: 'Option',
          isRequired: false,
          isAddnew: false,
          onSelectCallbackFn: getPricingType
        },
        vm.priceHistoryFromAutoComplete = {
          columnName: 'id',
          keyColumnName: 'historyID',
          keyColumnId: null,
          inputName: 'History ID',
          placeholderName: 'History ID',
          isRequired: false,
          isAddnew: false,
          onSelectCallbackFn: getHistoryformLocal
        }
      vm.priceHistoryToAutoComplete = {
        columnName: 'id',
        keyColumnName: 'historyID',
        keyColumnId: null,
        inputName: 'History ID',
        placeholderName: 'History ID',
        isRequired: false,
        isAddnew: false,
        onSelectCallbackFn: getHistorytoLocal
      }
    }
    vm.checkDisable = () => {
      if (!vm.assyQtyAutoComplete || !vm.assyQtyAutoComplete.keyColumnId)
        return false;
      if (vm.assyQtyAutoComplete.keyColumnId && !vm.priceHistoryTypeAutoComplete.keyColumnId)
        return false;
      if (vm.assyQtyAutoComplete.keyColumnId && vm.priceHistoryTypeAutoComplete.keyColumnId != 1) {
        if (!vm.priceHistoryFromAutoComplete.keyColumnId || !vm.priceHistoryToAutoComplete.keyColumnId)
          return false;
      }
      return true;
    }
    //get total sum of all quantity
    vm.getFooterPrice = (key, col) => {
      let displayText = "";
      let objTotal = _.find(vm.totalCount, function (item) { return item.createdAt == key });
      if (objTotal) {
        if (objTotal.TotalExtendedPrice || objTotal.TotalExtendedPrice == 0) {
          displayText += "Assy Price: " + $filter('currency')(objTotal.TotalExtendedPrice) + " EA";
        }
        if (objTotal.TotalAssemblyPrice || objTotal.TotalAssemblyPrice == 0) {
          if (displayText) {
            displayText += " | ";
          }
          displayText += "Ext. Price: " + $filter('currency')(objTotal.TotalAssemblyPrice + (objTotal.TotalExcessPrice || 0));
        }
        if (objTotal.TotalExcessPrice || objTotal.TotalExcessPrice > 0) {
          if (displayText) {
            displayText += " | ";
          }
          displayText += "Excess Price: " + $filter('currency')(objTotal.TotalExcessPrice);
        }
      }

      return displayText;
    }
  }
})();
