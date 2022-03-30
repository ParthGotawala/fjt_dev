(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .controller('AssyQuantityPriceSelectionSettingController', AssyQuantityPriceSelectionSettingController);

  /** @ngInject */
  function AssyQuantityPriceSelectionSettingController($mdDialog, $scope, $timeout, $filter, $q, CORE, RFQTRANSACTION, data, PartCostingFactory, BaseService, DialogFactory) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.isHideDelete = true;
    vm.priceSelectionSettingType = RFQTRANSACTION.PRICE_SELECTEION_SETTING_TYPE;
    vm.cancel = () => {
      if (vm.isdirty) {
        var messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
        let obj = {
          messageContent: messgaeContent,
          btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
          canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
        };
        return DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            BaseService.currentPageFlagForm = [];
            $mdDialog.cancel();
          }
        }, (cancel) => {
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
      else {
        BaseService.currentPageFlagForm = [];
        $mdDialog.cancel();
      }
    };
    vm.PriceStatus = RFQTRANSACTION.CUSTOM_PRICING_STATUS;
    vm.StockStatus = RFQTRANSACTION.CUSTOM_PRICING_STATUS;
    vm.commonStatus = RFQTRANSACTION.COMMON_STATUS;
    var DATA_CONST = RFQTRANSACTION.PART_COSTING;
    vm.gridConfig = CORE.gridConfig;
    //paging details for grid
    vm.pagingInfo = {
      Page: CORE.UIGrid.Page(),
      SortColumns: [],
      SearchColumns: [],
      id: data.rfqAssyID,
      settingType: vm.priceSelectionSettingType.NON_CUSTOM_PART_SELECTION.value
    };
    vm.isdirty = false;
    //set grid option for action with ui grid
    vm.gridOptions = {
      enableRowSelection: false,
      showColumnFooter: false,
      showGridFooter: false,
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: false,
      multiSelect: false,
      filterOptions: vm.pagingInfo.SearchColumns,
      enableCellEdit: true,
      enablePaging: false,
      enableCellEditOnFocus: true,
      exporterCsvFilename: 'Price Selection Setting.csv',
      exporterMenuCsv: true,
      enableGrouping: false,
      enableGridMenu: true
    };

    PartCostingFactory.getPackaging().query().$promise.then((packaging) => {
      if (packaging && packaging.data) {
        let packagingData = [];
        _.each(packaging.data, function (item) {
          var obj = {
            id: item.id,
            value: item.name
          }
          packagingData.push(obj);
        });
        vm.packaging = _.clone(packagingData);
        var obj = { id: null, value: 'All' };
        packagingData.splice(0, 0, obj);
        vm.packagingAll = packagingData;
        vm.show = true;
        loaddata();
      }
    }).catch((error) => {
      return BaseService.getErrorLog(error);
    });
    function loaddata() {
      //set header for ui grid
      vm.sourceHeader = [
        {
          field: '#',
          width: '50',
          cellTemplate: '<div class="ui-grid-cell-contents"  ng-disabled="row.Entity.isdisable"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
          enableFiltering: false,
          enableSorting: false,
          enableCellEdit: false,
          allowCellFocus: false,
          enableHiding: false,
          maxWidth: '80',
          pinnedLeft: true
        },
        {
          field: 'requestQty',
          displayName: 'Qty to Quote',
          width: '120',
          cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" ><span ng-if="!row.entity.rfqPriceGroupId">{{COL_FIELD}}</span><span ng-if="row.entity.rfqPriceGroupId">{{row.entity.priceGoupName}}</span></div>',
          enableFiltering: false,
          enableSorting: false,
          enableCellEdit: false,
          enableHiding: false,
          ColumnDataType: 'Number',
          maxWidth: '150',
          pinnedLeft: true
        },
        {
          field: 'quantityTypeName',
          displayName: 'Qty Type',
          width: '100',
          cellTemplate: '<div class="ui-grid-cell-contents" ><span>{{COL_FIELD}}</span></div>',
          enableFiltering: true,
          enableSorting: true,
          enableCellEdit: false,
          enableHiding: false,
          maxWidth: '150',
        },
        {
          field: 'stockName',
          displayName: 'Available Supplier Stock',
          width: '250',
          cellTemplate: "<div class=\"cm-supplier-stock\" style=\"height:100% !important;width:100% !important\" >\
                            <form name=\"inputForm\" flex=\"100\" layout=\"row\" style=\"height:100% !important;width:100% !important\">\
                                <md-radio-group layout=\"row\" ng-model=\"row.entity.stockName\" ng-change=\"grid.appScope.$parent.vm.changeRadioButtonValue(col,row.entity)\" name=\"stockName\">\
                                        <md-radio-button  ng-repeat=\"item in grid.appScope.$parent.vm.StockStatus\" ng-value=\"item.value\" class=\"md-primary margin-right-10\">{{item.value}}</md-radio-button>\
                                </md-radio-group> \
                            </form>\
                        </div>",
          headerCellTemplate: '<div class="ui-grid-cell-contents">Available Supplier Stock <md-icon role=\"img\" md-font-icon=\"icons-copy-to-all-vertical\" class=\"material-icons mat-icon icons-copy-to-all-vertical cursor-pointer margin-right-5 margin-left-5\" ng-click=\"grid.appScope.$parent.vm.applyAllstockNameVertically()\"><md-tooltip md-direction=\"top\" >Copy First to All</md-tooltip></md-icon></div>',
          enableFiltering: true,
          enableSorting: false,
          enableCellEditOnFocus: false,
          cellEditableCondition: false,
          enableHiding: false,
          ColumnDataType: 'Number',
          allowCellFocus: true,
          maxWidth: '250',
        },
        {
          field: 'priceName',
          displayName: 'Supplier Standard Price',
          width: '250',
          cellTemplate: "<div class=\"cm-supplier-stock\" style=\"height:100% !important;width:100% !important\" >\
                            <form name=\"inputForm\" flex=\"100\" layout=\"row\" style=\"height:100% !important;width:100% !important\">\
                                <md-radio-group layout=\"row\" ng-model=\"row.entity.priceName\" ng-change=\"grid.appScope.$parent.vm.changeRadioButtonValue(col,row.entity)\" name=\"priceName\">\
                                        <md-radio-button  ng-repeat=\"item in grid.appScope.$parent.vm.PriceStatus\" ng-value=\"item.value\" class=\"md-primary margin-right-10\">{{item.value}}</md-radio-button>\
                                </md-radio-group> \
                            </form>\
                        </div>",
          headerCellTemplate: '<div class="ui-grid-cell-contents">Supplier Standard Price <md-icon role=\"img\" md-font-icon=\"icons-copy-to-all-vertical\" class=\"material-icons mat-icon icons-copy-to-all-vertical cursor-pointer margin-right-5 margin-left-5\" ng-click=\"grid.appScope.$parent.vm.applyAllPriceNameVertically()\"><md-tooltip md-direction=\"top\" >Copy First to All</md-tooltip></md-icon></div>',
          enableFiltering: false,
          enableSorting: false,
          enableCellEditOnFocus: false,
          cellEditableCondition: false,
          enableHiding: false,
          allowCellFocus: true,
          maxWidth: '250',
        },
        {
          field: 'name',
          displayName: 'Packaging' + CORE.Modify_Grid_column_Allow_Change_Message,
          cellTemplate: '<div  class="ui-grid-cell-contents api-bom-error cm-overflow-hidden" >{{COL_FIELD}}<i class="ui-grid-icon-angle-down" aria-hidden="true"></i></div>',
          width: '240',
          //filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters">'
          //  + '<select class="form-control ui-grid-filter-input"  ng-model="colFilter.term" ng-options="option.id as option.name for option in colFilter.options"></select>'
          //  + '</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.packagingAll
          },
          editableCellTemplate: "<div  style=\"height:100% !important;width:100% !important\" ><form name=\"inputForm\" style=\"height:100% !important;width:100% !important\"><select id='ddlpackage_{{grid.renderContainers.body.visibleRowCache.indexOf(row)}}' ng-change=\"grid.appScope.$parent.vm.changeinValue()\" ng-class=\"'colt' + col.uid\" ui-grid-edit-dropdown ng-model=\"MODEL_COL_FIELD\" ng-options=\"field[editDropdownIdLabel] as field[editDropdownValueLabel] CUSTOM_FILTERS for field in editDropdownOptionsArray\"   style=\"height:100% !important;width:100% !important\" class='form-control'></select></form></div>",
          editDropdownIdLabel: 'value',
          editDropdownValueLabel: 'value',
          editDropdownOptionsArray: vm.packaging,
          enableCellEdit: true,
          cellEditableCondition: true,
          ColumnDataType: 'Number',
          enableHiding: false,
          maxWidth: '500',
        },
        {
          field: 'CheckRequiredQty',
          displayName: 'Must meets Quoted Qty Stock Requirement Buy',
          cellTemplate: '<div class="ui-grid-cell-contents text-center" style="padding:0"><input type="checkbox"  ng-change="grid.appScope.$parent.vm.setRemark(row.entity)"  ng-model="row.entity.CheckRequiredQty" ng-click="$event.stopPropagation();"></div>',
          width: '150',
          enableFiltering: false,
          enableSorting: false,
          cellEditableCondition: false,
          enableCellEditOnFocus: false,
          enableHiding: false,
          maxWidth: '200',
        },
        {
          field: 'stockPercentage',
          displayName: 'Supplier Stock above in Place of Over Quoted Qty Requirement %' + CORE.Modify_Grid_column_Allow_Change_Message,
          cellTemplate: '<div style="overflow: hidden" class="text-right ui-grid-cell-contents">{{COL_FIELD?COL_FIELD.toFixed(2):COL_FIELD}}</div>',
          width: '400',
          enableCellEdit: true,
          ColumnDataType: 'Number',
          enableHiding: false,
          type: 'number',
          maxWidth: '400',
        },
        {
          field: 'isLeadTime',
          displayName: 'Lead Time Acceptable',
          cellTemplate: '<div class="ui-grid-cell-contents text-center" style="padding:0"><input type="checkbox"  ng-model="row.entity.isLeadTime" ng-change="grid.appScope.$parent.vm.setLeadTime(row.entity)" ng-click="$event.stopPropagation();"></div>',
          width: '110',
          enableFiltering: false,
          enableSorting: false,
          enableCellEditOnFocus: false,
          cellEditableCondition: false,
          enableHiding: false,
          maxWidth: '200',
        },
        {
          field: 'remark',
          displayName: 'Decision',
          cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}<md-tooltip md-direction="top">{{COL_FIELD}}</md-tooltip></div>',
          width: '400',
          enableFiltering: false,
          enableCellEdit: false,
          allowCellFocus: false,
          enableSorting: true,
          enableHiding: false,
          maxWidth: '800',
        }
      ];
    }

    vm.applyAllstockNameVertically = () => {
      _.each(vm.sourceData, (dataobj) => {
        dataobj.stockName = _.head(vm.sourceData).stockName;
      })
    };

    vm.applyAllPriceNameVertically = () => {
      _.each(vm.sourceData, (dataobj) => {
        dataobj.priceName = _.head(vm.sourceData).priceName;
      })
    }

    //get list of assy wise quantity price selection setting
    vm.loadData = () => {
      _.each(vm.pagingInfo.SortColumns, (item) => {
        if (item[0] == DATA_CONST.StockName)
          item[0] = DATA_CONST.Stock;
        else if (item[0] == DATA_CONST.PriceName)
          item[0] = DATA_CONST.Price;
      });
      if (vm.pagingInfo.SearchColumns.length > 0) {
        var objStock = _.find(vm.pagingInfo.SearchColumns, (item) => { return item.ColumnName == DATA_CONST.StockName });
        if (objStock)
          objStock.ColumnName = DATA_CONST.Stock;
        var objPrice = _.find(vm.pagingInfo.SearchColumns, (item) => { return item.ColumnName == DATA_CONST.PriceName });
        if (objPrice)
          objPrice.ColumnName = DATA_CONST.Price;
        var objpackage = _.find(vm.pagingInfo.SearchColumns, (item) => { return item.ColumnName == "name" });
        if (objpackage)
          objpackage.ColumnName = "packagingID";
      }
      vm.cgBusyLoading = PartCostingFactory.pricingselectionsetting().query(vm.pagingInfo).$promise.then((pricingSelect) => {
        _.each(pricingSelect.data.pricingSettings, function (item) {
          var objPrice = _.find(vm.PriceStatus, (price) => { return price.id == item.price });
          var objStock = _.find(vm.StockStatus, (stock) => { return stock.id == item.stock });
          if (objPrice)
            item.priceName = objPrice.value;
          else
            item.priceName = _.head(vm.PriceStatus).value;
          if (objStock)
            item.stockName = objStock.value;
          else
            item.stockName = _.head(vm.StockStatus).value;
          if (!item.packagingID)
            item.name = _.head(vm.StockStatus).value;
          if (!item.price && !item.stock && !item.isCheckRequiredQty)
            item.isLeadTime = 1;
          item.isLeadTime = item.isLeadTime == 1 ? true : false;
          item.CheckRequiredQty = item.isCheckRequiredQty == 1 ? true : false;
          if (!item.remark) {
            item.remark = returnMessage(item.stockName, _.head(vm.StockStatus).value, item.priceName, _.head(vm.PriceStatus).value, item.CheckRequiredQty, item.isLeadTime);
          }
        });
        vm.sourceData = pricingSelect.data.pricingSettings;
        vm.totalSourceDataCount = pricingSelect.data.Count;
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
        }

        $timeout(() => {
          vm.gridOptions.clearSelectedRows();
          if (vm.gridOptions.gridApi) {
            vm.gridOptions.gridApi.infiniteScroll.resetScroll();
          }
          $timeout(() => {
            vm.resetSourceGrid();
            celledit();
          }, true)
          if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount == vm.currentdata) {
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
          }
        });

      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    //it will use for infinite scroll and concat data 
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = PartCostingFactory.pricingselectionsetting().query(vm.pagingInfo).$promise.then((pricingSelect) => {
        if (pricingSelect.data) {
          _.each(pricingSelect.data.pricingSettings, function (item) {
            var objPrice = _.find(vm.PriceStatus, (price) => { return price.id == item.price });
            var objStock = _.find(vm.StockStatus, (stock) => { return stock.id == item.stock });
            if (objPrice)
              item.priceName = objPrice.value;
            else
              item.priceName = _.head(vm.PriceStatus).value;
            if (objStock)
              item.stockName = objStock.value;
            else
              item.stockName = _.head(vm.StockStatus).value;
            if (!item.price && !item.stock && !item.isCheckRequiredQty)
              item.isLeadTime = 1;
            item.isLeadTime = item.isLeadTime == 1 ? true : false;
            item.CheckRequiredQty = item.isCheckRequiredQty == 1 ? true : false;
            if (!item.remark) {
              item.remark = returnMessage(item.stockName, _.head(vm.StockStatus).value, item.priceName, _.head(vm.PriceStatus).value, item.CheckRequiredQty, item.isLeadTime);
            }
          });
          vm.sourceData = vm.sourceData.concat(pricingSelect.data.pricingSettings);
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

    // call function to save lead quantity and overage percentage
    function celledit() {
      vm.gridOptions.gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newvalue, oldvalue) {
        var obj = _.find(vm.sourceData, function (item) { return item.id == rowEntity.id });
        var index = vm.sourceData.indexOf(obj);
        if (colDef.name == DATA_CONST.StockPercentage) {
          vm.changeinValue();
          if (rowEntity.isLeadTime || rowEntity.stockPercentage > 1000) {
            rowEntity.stockPercentage = 0;
            rowEntity.remark = returnMessage(rowEntity.stockName, _.head(vm.StockStatus).value, rowEntity.priceName, _.head(vm.PriceStatus).value, rowEntity.CheckRequiredQty, rowEntity.isLeadTime, rowEntity.stockPercentage, rowEntity.name);
            return false;
          }
          else {
            rowEntity.remark = returnMessage(rowEntity.stockName, _.head(vm.StockStatus).value, rowEntity.priceName, _.head(vm.PriceStatus).value, rowEntity.CheckRequiredQty, rowEntity.isLeadTime, rowEntity.stockPercentage, rowEntity.name);
          }
        }
        else if ((colDef.name == DATA_CONST.StockName || colDef.name == DATA_CONST.PriceName) && rowEntity.isLeadTime && (rowEntity.stockName != _.head(vm.StockStatus).value || rowEntity.priceName != _.head(vm.PriceStatus).value)) {
          rowEntity.isLeadTime = false;
          rowEntity.remark = returnMessage(rowEntity.stockName, _.head(vm.StockStatus).value, rowEntity.priceName, _.head(vm.PriceStatus).value, rowEntity.CheckRequiredQty, rowEntity.isLeadTime, rowEntity.stockPercentage, rowEntity.name);
          vm.changeinValue();
        }

        else if ((colDef.name == DATA_CONST.StockName || colDef.name == DATA_CONST.PriceName || colDef.name == DATA_CONST.StockPercentage) && !rowEntity.isLeadTime) {

          rowEntity.remark = returnMessage(rowEntity.stockName, _.head(vm.StockStatus).value, rowEntity.priceName, _.head(vm.PriceStatus).value, rowEntity.CheckRequiredQty, rowEntity.isLeadTime, rowEntity.stockPercentage, rowEntity.name);
          vm.changeinValue();
        }
        else if (colDef.name == "name") {
          rowEntity.remark = returnMessage(rowEntity.stockName, _.head(vm.StockStatus).value, rowEntity.priceName, _.head(vm.PriceStatus).value, rowEntity.CheckRequiredQty, rowEntity.isLeadTime, rowEntity.stockPercentage, rowEntity.name);
          vm.changeinValue();
        }
        else if (colDef.name == "leadTime") {
          if (rowEntity.isLeadTime) {
            if (newvalue) {
              if (parseFloat(newvalue) < 10000) {
                newvalue = parseFloat(newvalue).toFixed("1").toString();
                let decimalarray = newvalue.split(".");
                if (decimalarray.length > 1) {
                  var validDecimal = ["0", "2", "4", "6", "8"];
                  if (validDecimal.includes(decimalarray[1])) {
                    vm.gridOptions.gridApi.grid.validate.setValid(vm.gridOptions.data[index], vm.gridOptions.columnDefs[vm.gridOptions.columnDefs.indexOf(colDef)]);
                    rowEntity.isInValid = false;
                    rowEntity.remark = returnMessage(rowEntity.stockName, _.head(vm.StockStatus).value, rowEntity.priceName, _.head(vm.PriceStatus).value, rowEntity.CheckRequiredQty, rowEntity.isLeadTime, rowEntity.stockPercentage, rowEntity.name, rowEntity.leadTime);
                    vm.changeinValue();
                  } else {
                    vm.gridOptions.gridApi.grid.validate.setInvalid(vm.gridOptions.data[index], vm.gridOptions.columnDefs[vm.gridOptions.columnDefs.indexOf(colDef)]);
                    rowEntity.isInValid = true;
                  }
                }
                return newvalue;
              }
            }
          } else {
            rowEntity.leadTime = newvalue = null;
          }
          vm.changeinValue();
        }
        else {
          rowEntity.stockName = _.head(vm.StockStatus).value;
          rowEntity.priceName = _.head(vm.PriceStatus).value;
          rowEntity.CheckRequiredQty = false;
          rowEntity.remark = stringFormat(RFQTRANSACTION.PRICING.PRICING_PRICE, vm.PriceStatus[2].value, rowEntity.name && rowEntity.name != "N/A" ? " and " + rowEntity.name + " packaging." : ".");
          vm.changeinValue();
        }
      });
      if (vm.sourceData.length > 0)
        vm.gridOptions.gridApi.cellNav.scrollToFocus(_.head(vm.sourceData), vm.gridOptions.columnDefs[0]);
    }

    //check flag for lead time is consider or not
    vm.setLeadTime = (row) => {
      vm.changeinValue();
      if (row.isLeadTime) {
        row.CheckRequiredQty = false;
        row.stockPercentage = null;
        row.leadTime = vm.pagingInfo.settingType == vm.priceSelectionSettingType.CUSTOM_PART_SELECTION.value ? 1 : 0;
        row.stockName = _.head(vm.StockStatus).value;
        row.priceName = _.head(vm.PriceStatus).value;
        row.remark = stringFormat(RFQTRANSACTION.PRICING.PRICING_PRICE, vm.PriceStatus[2].value, row.name && row.name != "N/A" ? " and " + row.name + " packaging." : ".");
      }
      else {
        row.CheckRequiredQty = false;
        row.stockPercentage = null;
        row.leadTime = null;
        row.stockName = vm.StockStatus[1].value;
        row.priceName = vm.PriceStatus[2].value;
        row.remark = stringFormat(RFQTRANSACTION.PRICING.PRICING_STK_PRICE, vm.StockStatus[1].value, vm.PriceStatus[2].value, row.name && row.name != "N/A" ? " and " + row.name + " packaging." : ".");
      }
    }

    //set remark on base of quantity require
    vm.setRemark = (row) => {
      vm.changeinValue();
      if (row.CheckRequiredQty) {
        row.isLeadTime = false;
        row.leadTime = null;
        row.stockName = _.head(vm.StockStatus).value;
        row.priceName = _.head(vm.StockStatus).value;
      }
      else {
        row.stockPercentage = null;
      }
      row.remark = returnMessage(row.stockName, _.head(vm.StockStatus).value, row.priceName, _.head(vm.PriceStatus).value, row.CheckRequiredQty, row.isLeadTime, row.stockPercentage, row.name);
    }
    //set form dirty on change value
    vm.changeRadioButtonValue = (colDef, rowEntity) => {
      if (colDef.name == DATA_CONST.StockPercentage) {
        vm.changeinValue();
        if (rowEntity.isLeadTime || rowEntity.stockPercentage > 1000) {
          rowEntity.stockPercentage = 0;
          rowEntity.remark = returnMessage(rowEntity.stockName, _.head(vm.StockStatus).value, rowEntity.priceName, _.head(vm.PriceStatus).value, rowEntity.CheckRequiredQty, rowEntity.isLeadTime, rowEntity.stockPercentage, rowEntity.name);
          return false;
        }
        else {
          rowEntity.remark = returnMessage(rowEntity.stockName, _.head(vm.StockStatus).value, rowEntity.priceName, _.head(vm.PriceStatus).value, rowEntity.CheckRequiredQty, rowEntity.isLeadTime, rowEntity.stockPercentage, rowEntity.name);
        }
      }
      else if ((colDef.name == DATA_CONST.StockName || colDef.name == DATA_CONST.PriceName) && rowEntity.isLeadTime && (rowEntity.stockName != _.head(vm.StockStatus).value || rowEntity.priceName != _.head(vm.PriceStatus).value)) {
        rowEntity.isLeadTime = false;
        rowEntity.remark = returnMessage(rowEntity.stockName, _.head(vm.StockStatus).value, rowEntity.priceName, _.head(vm.PriceStatus).value, rowEntity.CheckRequiredQty, rowEntity.isLeadTime, rowEntity.stockPercentage, rowEntity.name);
        vm.changeinValue();
      }

      else if ((colDef.name == DATA_CONST.StockName || colDef.name == DATA_CONST.PriceName || colDef.name == DATA_CONST.StockPercentage) && !rowEntity.isLeadTime) {

        rowEntity.remark = returnMessage(rowEntity.stockName, _.head(vm.StockStatus).value, rowEntity.priceName, _.head(vm.PriceStatus).value, rowEntity.CheckRequiredQty, rowEntity.isLeadTime, rowEntity.stockPercentage, rowEntity.name);
        vm.changeinValue();
      }
      else if (colDef.name == "name") {
        rowEntity.remark = returnMessage(rowEntity.stockName, _.head(vm.StockStatus).value, rowEntity.priceName, _.head(vm.PriceStatus).value, rowEntity.CheckRequiredQty, rowEntity.isLeadTime, rowEntity.stockPercentage, rowEntity.name);
        vm.changeinValue();
      }
      else {
        rowEntity.stockName = _.head(vm.StockStatus).value;
        rowEntity.priceName = _.head(vm.PriceStatus).value;
        rowEntity.CheckRequiredQty = false;
        rowEntity.remark = stringFormat(RFQTRANSACTION.PRICING.PRICING_PRICE, vm.PriceStatus[2].value, rowEntity.name && rowEntity.name != "N/A" ? " and " + rowEntity.name + " packaging." : ".");
        vm.changeinValue();
      }
      vm.changeinValue();
    }

    //save quantity wise setting for pricing
    vm.saveQtySetting = (isSaveandClose) => {
      vm.saveDisable = true;
      if (BaseService.focusRequiredField(vm.manualpriceform, vm.isdirty)) {// || !msWizard.currentStepForm().$dirty) {
        vm.saveDisable = false;
        return;
      }
      let invalidline = _.find(vm.sourceData, x => x.isInValid);
      if (invalidline) {
        var messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.INVALID_LEADTIME_ENTERED);
        let obj = {
          messageContent: messageContent,
        };
        DialogFactory.messageAlertDialog(obj);
        vm.saveDisable = false;
      } else {
        var priceSetting = [];
        let FirststockStatusID = _.head(vm.StockStatus).id;
        _.each(vm.sourceData, (item) => {
          var objstock = _.find(vm.StockStatus, (stock) => { return stock.value == item.stockName });
          var objprice = _.find(vm.PriceStatus, (price) => { return price.value == item.priceName });
          var objpackage = _.find(vm.packaging, (pkg) => { return pkg.value == item.name });
          var objSetting = {
            id: item.id,
            qtyID: item.qtyID,
            stock: item.isLeadTime ? FirststockStatusID : objstock ? objstock.id : FirststockStatusID,
            price: item.isLeadTime ? FirststockStatusID : objprice ? objprice.id : FirststockStatusID,
            isCheckRequiredQty: item.isLeadTime ? false : item.CheckRequiredQty,
            isLeadTime: item.isLeadTime,
            stockPercentage: item.stockPercentage,
            remark: item.remark,
            packagingID: objpackage ? objpackage.id : null,
            rfqPriceGroupId: item ? item.rfqPriceGroupId : null,
            rfqPriceGroupDetailId: item ? item.rfqPriceGroupDetailId : null,
            settingType: vm.pagingInfo.settingType,
            leadTime: item.leadTime
          }
          priceSetting.push(objSetting);
        });
        vm.cgBusyLoading = PartCostingFactory.savePriceSelectionSetting().query({ priceSettingList: priceSetting }).$promise.then((saveSetting) => {
          if (isSaveandClose) {
            BaseService.currentPageFlagForm = [];
            $mdDialog.cancel();
          } else {
            vm.isdirty = false;
            vm.loadData();
          }
          vm.saveDisable = false;
        }).catch((error) => {
          vm.saveDisable = false;
          return BaseService.getErrorLog(error);
        });
      }
    }
    //check list update or not
    vm.changeinValue = () => {
      vm.isdirty = true;
      BaseService.currentPageFlagForm = [vm.isdirty];
    }

    // return remark message
    let returnMessage = (stock, dbstock, price, dbPrice, ismatchqty, leadTime, stockPercentage, packaging,leadTimeValue) => {
      if (!leadTime) {
        if (ismatchqty) {
          return stockPercentage ? stringFormat(RFQTRANSACTION.PRICING.PRICING_MATCH_QTY_STOCK, stockPercentage) : RFQTRANSACTION.PRICING.PRICING_MATCH_QTY;
        }
        else if (stock == dbstock || price == dbPrice) {
          if (stock == dbstock && price == dbPrice && ismatchqty) {
            return stockPercentage ? stringFormat(RFQTRANSACTION.PRICING.PRICING_MATCH_QTY_STOCK, stockPercentage) : RFQTRANSACTION.PRICING.PRICING_MATCH_QTY;
          }
          else if (stock == dbstock && price == dbPrice && !ismatchqty) {
            return stringFormat(RFQTRANSACTION.PRICING.PRICING_PRICE, vm.PriceStatus[2].value, packaging && packaging != "N/A" ? " and " + packaging + " packaging." : ".");
          }
          else {
            if (stock == dbstock) {
              return stringFormat(RFQTRANSACTION.PRICING.PRICING_PRICE, price, packaging && packaging != "N/A" ? " and " + packaging + " packaging." : ".");
            }
            else {
              return stringFormat(RFQTRANSACTION.PRICING.PRICING_STK, stock, packaging && packaging != "N/A" ? " and " + packaging + " packaging." : ".");
            }
          }
        }
        else {
          return stringFormat(RFQTRANSACTION.PRICING.PRICING_STK_PRICE, stock, price, packaging && packaging != "N/A" ? " and " + packaging + " packaging." : ".");
        }
      }
      else if (vm.pagingInfo.settingType != vm.priceSelectionSettingType.CUSTOM_PART_SELECTION.value || !leadTimeValue) {
        return stringFormat(RFQTRANSACTION.PRICING.PRICING_PRICE, vm.PriceStatus[2].value, packaging && packaging != "N/A" ? " and " + packaging + " packaging." : ".");
      } else {
        return stringFormat(RFQTRANSACTION.PRICING.PRICING_DEFAULT_WITHLEADTIME, leadTimeValue);
      }
    }

    // on main tab change
    vm.onTabChanges = (TabName, msWizard) => {
      //vm.selectedIndex = msWizard.selectedIndex;
      vm.isNoDataFound = true;
      if (TabName == vm.priceSelectionSettingType.NON_CUSTOM_PART_SELECTION.name) {
        vm.NonCustomPartTab = true;
        vm.CustomPartTab = false;
        vm.pagingInfo.settingType = vm.priceSelectionSettingType.NON_CUSTOM_PART_SELECTION.value;
        loaddata();
        vm.loadData();
      }
      else {
        let leadtimeColobj = {
          field: 'leadTime',
          displayName: 'Lead Time (Week) (only even decimal value allow)' + CORE.Modify_Grid_column_Allow_Change_Message,
          cellTemplate: '<div style="overflow: hidden;text-align:right !important" ng-class=\"{invalid:grid.validate.isInvalid(row.entity,col.colDef)}\" class="text-right ui-grid-cell-contents">{{COL_FIELD?COL_FIELD.toFixed(1):COL_FIELD}}</div>',
          width: '300',
          enableCellEdit: true,
          ColumnDataType: 'Number',
          enableHiding: false,
          type: 'number',
          maxWidth: '400',
          validators: { required: false }
        }
        vm.NonCustomPartTab = false;
        vm.CustomPartTab = true;
        vm.pagingInfo.settingType = vm.priceSelectionSettingType.CUSTOM_PART_SELECTION.value;
        loaddata();
        vm.sourceHeader.splice(9, 0, leadtimeColobj);
        vm.loadData();
      }

      msWizard.selectedIndex = vm.selectedTabIndex;

      $("#content").animate({ scrollTop: 0 }, 200);
    }

    vm.isStepValid = function (step) {
      switch (step) {
        case 0: {
          var isDirty = vm.isdirty;
          if (isDirty)
            return showWithoutSavingAlertforTabChange(step);
          else
            return true;
          break;
        }
        case 1: {
          var isDirty = vm.isdirty;
          if (isDirty)
            return showWithoutSavingAlertforTabChange(step);
          else
            return true;
          break;
        }
      }
    }
    /* Show save alert popup when performing tab change*/
    function showWithoutSavingAlertforTabChange(step) {
      var messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      let obj = {
        messageContent: messgaeContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      return DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          vm.isSave = false;
          switch (step) {
            case 0:
              vm.isdirty = false;
              vm.pagingInfo.settingType = vm.priceSelectionSettingType.CUSTOM_PART_SELECTION.value;
              loaddata();
              return true;
              break;
            case 1:
              vm.isdirty = false;
              vm.pagingInfo.settingType = vm.priceSelectionSettingType.NON_CUSTOM_PART_SELECTION.value;
              loaddata();
              return true;
              break;
          }
        }
      }, (cancel) => {
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    vm.CopyPriceSelectionSetting = () => {
      vm.isCopyDisable = true;
      var messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.COPY_PRICE_SELECTION_CONFIRMATION);
      messageContent.message = stringFormat(messageContent.message, vm.pagingInfo.settingType == vm.priceSelectionSettingType.CUSTOM_PART_SELECTION.value ? 'non-custom part' : 'custom part', vm.pagingInfo.settingType == vm.priceSelectionSettingType.CUSTOM_PART_SELECTION.value ? 'custom part' : 'non-custom part');
      let obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((resposne) => {
        if (resposne) {
          let paramobj = {
            rfqAssyID: parseInt(data.rfqAssyID),
            toSettingType: vm.pagingInfo.settingType,
            fromSettingType: vm.pagingInfo.settingType == vm.priceSelectionSettingType.CUSTOM_PART_SELECTION.value ? vm.priceSelectionSettingType.NON_CUSTOM_PART_SELECTION.value : vm.priceSelectionSettingType.CUSTOM_PART_SELECTION.value
          }
          vm.cgBusyLoading = PartCostingFactory.CopyPriceSelectionSetting().query(paramobj).$promise.then((saveSetting) => {
            vm.isCopyDisable = false;
            vm.loadData();
          }).catch((error) => {
            vm.isCopyDisable = false;
            return BaseService.getErrorLog(error);
          });
        }
      }, (cancel) => {
        vm.isCopyDisable = false;
      }).catch((error) => {
        vm.isCopyDisable = false;
        return BaseService.getErrorLog(error);
      });
    }
  }
})();
