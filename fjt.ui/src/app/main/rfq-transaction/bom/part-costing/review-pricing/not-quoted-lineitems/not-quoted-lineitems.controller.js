(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .controller('NotQuotedItemController', NotQuotedItemController);

  /** @ngInject */
  function NotQuotedItemController($filter, $state, $scope, $timeout, $stateParams, $mdSidenav, RFQTRANSACTION, BOMFactory, PartCostingFactory,
    DialogFactory, CORE, PRICING, BaseService, uiGridGroupingConstants, ImportExportFactory, $mdDialog) {
    const vm = this;
    vm.isExpand = true;
    var rfqAssyID = $stateParams.id;
    vm.EmptyMesssage = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.NOT_QUOTED;
    var PartCosting = RFQTRANSACTION.PART_COSTING;
    vm.SelectedTabName = PRICING.REVIEW_PRICING_TABS.NotQuoted.Name;
    vm.isHideDelete = true;
    vm.MfgLabelConstant = vm.LabelConstant.MFG;

    //paging details for grid
    vm.pagingInfo = {
      Page: CORE.UIGrid.Page(),
      SortColumns: [['lineID', 'ASC']],
      SearchColumns: [],
      id: rfqAssyID
    };
    var _dummyEvent = null;
    $timeout(function () {
      angular.element('#btndummy').triggerHandler('click');
    });
    //set grid option for action with ui grid
    vm.gridOptions = {
      showColumnFooter: false,
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: false,
      multiSelect: false,
      filterOptions: vm.pagingInfo.SearchColumns,
      enableCellEdit: true,
      enablePaging: false,
      enableCellEditOnFocus: true,
      exporterCsvFilename: 'Not Quoted Lineitems.csv',
      exporterMenuCsv: true,
      enableGrouping: false,

    };
    //set header for ui grid
    vm.sourceHeader = [
      {
        field: '#',
        width: '80',
        cellTemplate: '<div class="ui-grid-cell-contents" ng-disabled="row.Entity.isdisable"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
        enableFiltering: false,
        enableSorting: false,
        enableCellEdit: false,
        allowCellFocus: false,
      },
      {
        field: 'lineID',
        displayName: 'Item',
        width: '50',
        cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
        enableCellEdit: false,

      },
      {
        field: 'mfgPN',
        displayName: vm.MfgLabelConstant.MFGPN,
        cellTemplate: '<alternative-component-details is-expand="grid.appScope.$parent.vm.isExpand" row-data="row.entity"></alternative-component-details>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
        enableCellEdit: false,
        allowCellFocus: false,
      },
      {
        field: 'qpa',
        displayName: 'QPA',
        cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
        width: '50',
        enableCellEdit: false,
      },
      {
        field: 'numOfPosition',
        displayName: 'Lead',
        cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        width: '60',
        enableCellEdit: false,
        enableFiltering: true,
        enableSorting: true,
        enableColumnMenus: false,
        allowCellFocus: false,
      },
      {
        field: 'PartStatus',
        displayName: 'Part Status',
        width: '120',
        cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
        visible: false,
        enableCellEdit: false,
      },
      {
        field: 'LTBDate',
        displayName: 'LTB Date',
        width: CORE.UI_GRID_COLUMN_WIDTH.ONLY_DATE_COLUMN,
        cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
        visible: false,
        enableCellEdit: false,
      }
    ];

    // bind grid data
    let bindGridData = (consolidatemfg) => {
      _.each(consolidatemfg.data.consolidateParts, (item) => {
        let filterByLineItemArr = _.filter(consolidatemfg.data.autoPricingStatus, { 'consolidateID': item.id });
        if (filterByLineItemArr.length > 0) {
          item.pricing = [];
          _.each(filterByLineItemArr, (objPricing) => {
            let reqObj = {};
            reqObj.pricingApiName = objPricing.pricingApiName;
            reqObj.consolidateID = objPricing.consolidateID;
            reqObj.rfqAssyID = objPricing.rfqAssyID;
            reqObj.status = objPricing.status;
            item.pricing.push(reqObj);
          })
        }
        item.mfgComponents = item.component ? item.component.split(',') : "";
      });
    };


    //get list of consolidated part number rfq line items and shows with its pricing
    vm.loadData = () => {
      vm.sourceData = [];
      vm.cgBusyLoading = PartCostingFactory.retrieveNotQuotedLineItems(vm.pagingInfo).query().$promise.then((consolidatemfg) => {
        if (consolidatemfg.data.isReadyForPricing) {
          vm.bomnotVerified = false;
          bindGridData(consolidatemfg);
          vm.sourceData = consolidatemfg.data.consolidateParts;
          vm.Quantity = consolidatemfg.data.quantity;
          vm.ConsolidateQuantity = consolidatemfg.data.quantityDetails;
          if (vm.sourceData.length > 0) {
            _.each(vm.sourceData, (item) => {
              item.customerID = consolidatemfg.data.customerID;
            })
            vm.partcostingKeys = Object.keys(vm.sourceData[0]);
            _.each(vm.partcostingKeys, (keys) => {
              if (BaseService.checkForVisibleColumnInGrid(PartCosting, keys, vm.sourceHeader)) {
                var obj = {
                  field: keys,
                  displayName: keys,
                  cellTemplate: '<div ng-if="row.entity.isPurchase" style="padding:5px;height: 100%;overflow: hidden; white-space: nowrap;\" class=\"height-grid ui-grid-cell-contents\">\
                                                        <a ng-if="!COL_FIELD">\
                                                            <md-icon style="float:left;color:rgb(0,150,136)" class="icon-square-inc-cash"><md-tooltip  md-direction="top">Pricing Available</md-tooltip></md-icon>\
                                                        </a>\
                                                        <selected-component-details ng-if="grid.appScope.$parent.vm.sourceData.length > 0 && COL_FIELD" row-data="row.entity" qty-details-list="grid.appScope.$parent.vm.ConsolidateQuantity" request-qty="' + keys + '" select-price="grid.appScope.$parent.vm.getPricing(rowData, requestQty, event)" selected-page-name="grid.appScope.$parent.vm.SelectedTabName" is-show="false">\
                                                        <a>\
                                                            <div ng-bind-html="grid.appScope.$parent.vm.getPartStatus(row.entity.id,' + keys + ')"></div>\
                                                        </a>\
                                                    </div>\
                                                   <div ng-if="!row.entity.isPurchase" style="overflow: hidden;" class="ui-grid-cell-contents">\
                                                        <a>DNP</a>\
                                                        <md-tooltip  md-direction="top">\
                                                            Do Not Purchase Part\
                                                        </md-tooltip>\
                                                   </div>',
                  width: '450',
                  enableCellEdit: false,
                  enableGrouping: true,
                  treeAggregationType: uiGridGroupingConstants.aggregation.SUM
                }
                vm.sourceHeader.push(obj);
              }
            });
          }
          //<a tooltip-placement="left" tooltip-popup-delay="500" tooltip-append-to-body="true" uib-tooltip="Pricing Available  " tooltip-class="customClass" qty-id="20184" line-item-id="380207" class="ui-grid-cell-contents  "><i class="icon-square-inc pricing padding6px" style=""></i>  </a>
          vm.totalSourceDataCount = consolidatemfg.data.Count;
          if (vm.totalSourceDataCount == 0) {
            if (vm.pagingInfo.SearchColumns.length > 0) {
              vm.isNoDataFound = false;
              vm.emptyState = 0;
              $scope.$emit(RFQTRANSACTION.EVENT_NAME.HideImportExport, true);
            }
            else {
              $scope.$emit(RFQTRANSACTION.EVENT_NAME.HideImportExport, false);
              vm.isNoDataFound = true;
              vm.emptyState = null;
            }
          }
          else {
            $scope.$emit(RFQTRANSACTION.EVENT_NAME.HideImportExport, true);
            vm.isNoDataFound = false;
            vm.emptyState = null;
          }
          if (!vm.gridOptions.enablePaging) {
            vm.currentdata = vm.sourceData.length;
            vm.gridOptions.gridApi.infiniteScroll.resetScroll();
          }
          var totalItems = _.filter(vm.sourceData, (item) => { return item.isPurchase == true });
          if (vm.Quantity.length > 0) {
            var totalPriced = _.filter(totalItems, (pricedItem) => { return (pricedItem[vm.Quantity[0].requestQty] != null && pricedItem[vm.Quantity[0].requestQty] != undefined) });
            vm.PricedPercentage = (totalPriced.length * 100 / totalItems.length);
          }
          vm.gridOptions.clearSelectedRows();

          $timeout(() => {
            if (vm.currentdata == 0) {
              $scope.$emit(PRICING.EventName.UpdateStatus, null);
            }
            vm.resetSourceGrid();
            if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount == vm.currentdata) {
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
            }
          });
        }
        else {
          vm.bomnotVerified = true;
          $scope.$emit(RFQTRANSACTION.EVENT_NAME.HideImportExport, false);
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    //it will use for infinite scroll and concate data 
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = PartCostingFactory.retrieveNotQuotedLineItems(vm.pagingInfo).query().$promise.then((consolidatemfg) => {
        if (consolidatemfg.data) {
          bindGridData(consolidatemfg);
          vm.sourceData = vm.sourceData.concat(consolidatemfg.data.consolidateParts);
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

    //get Part Status
    vm.getPartStatus = (id, qty) => {
      let findQtyObj = _.find(vm.ConsolidateQuantity, { 'consolidateID': id, 'requestQty': qty });
      if (findQtyObj && (findQtyObj.partStatus == RFQTRANSACTION.PART_COSTING.Obsolete || findQtyObj.partStatus == RFQTRANSACTION.PART_COSTING.LTB)) {
        return '<span class="quantityDetails"><span class="label-header">Status: </span> ' + findQtyObj.partStatus + '</span></br></br>';
      }
      return '';
    }

    // get manual pricing popup
    vm.getPricing = (rowEntity, qty, event) => {
      let findQtyObj = _.find(vm.ConsolidateQuantity, { 'consolidateID': rowEntity.id, 'requestQty': qty });
      rowEntity.qty = qty;
      if (findQtyObj) {
        rowEntity.supplier = findQtyObj.supplier;
        rowEntity.unitPrice = findQtyObj.unitPrice;
        rowEntity.rfqID = $scope.$parent.vm.bom.rfqNo;
        rowEntity.pricePercentage = vm.PricedPercentage;
        rowEntity.selectedPN = findQtyObj.selectedMpn;
        $mdSidenav('price-selector').open();
        $scope.$emit(RFQTRANSACTION.EVENT_NAME.OpenPriceSelector, rowEntity);

        $mdSidenav('price-selector').onClose(function () {
          $scope.$emit(RFQTRANSACTION.EVENT_NAME.ClosePriceSelector, false);
          vm.loadData();
        });
      }
    }

    //get all list of not quoted items
    function getNotQuotedItems() {
      var pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['lineID', 'ASC']],
        SearchColumns: [],
        id: rfqAssyID,
        pageSize: 10000
      };
      vm.cgBusyLoading = PartCostingFactory.retrieveNotQuotedLineItems(pagingInfo).query().$promise.then((consolidatemfg) => {
        if (consolidatemfg.data.isReadyForPricing) {
          bindGridData(consolidatemfg);
          vm.notQuotedData = consolidatemfg.data.consolidateParts;
          vm.AllQuantity = consolidatemfg.data.quantity;
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    getNotQuotedItems();
    //export excel document 
    let exportPricingStatus = $scope.$on(RFQTRANSACTION.EVENT_NAME.ExportPricing, function (name, assyname) {
      exportFilePrice(assyname);
    });

    //import excel document 
    let importPricingStatus = $scope.$on(RFQTRANSACTION.EVENT_NAME.ImportPricing, function (name, ev) {
      angular.element('#fi-excel').trigger('click');
    });

    //create list for export details
    function exportFilePrice(assyname) {
      var pricingList = vm.notQuotedData;
      var priceExportList = [];
      _.each(pricingList, (item) => {
        _.each(item.mfgComponents, (component) => {
          _.each(vm.AllQuantity, (quantity) => {
            if (!item[quantity.requestQty]) {
              var objPrice = {
                LineID: parseInt(item.lineID),
                RfqAssyQtyId: quantity.id,
                ManufacturerName: component.split('###')[1],
                ManufacturerPartNumber: component.split('###')[0],
                OrderQty: (quantity.requestQty * item.qpa),
                SupplierName: null,
                PricePerPart: null,
                MinimumBuy: null,
                Multiplier: null,
                CurrentStockQty: null,
                "APILeadTime (days)": null,
                SupplierPN: null,
                Packaging: null,
                OnOrderEta: null,
                OnOrderQuantity: null,
                NCNR: null,
                RoHS: null,
                Reeling: null,
                LTBDate: null,
                PartStatus: null,
                PurchaseUom: null,
              }
              priceExportList.push(objPrice);
            }
          });
        });
      });
      exportFile(priceExportList, stringFormat("{0}.xls", assyname));
    }

    //export document for pricing
    function exportFile(componentList, name) {
      vm.cgBusyLoading = ImportExportFactory.importFile(componentList).then((res) => {
        if (res.data && componentList.length > 0) {
          let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
          if (navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(blob, name)
          } else {
            let link = document.createElement("a");
            if (link.download !== undefined) {
              let url = URL.createObjectURL(blob);
              link.setAttribute("href", url);
              link.setAttribute("download", name);
              link.style = "visibility:hidden";
              document.body.appendChild(link);
              $timeout(() => {
                link.click();
                document.body.removeChild(link);
              });
            }
          }
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    //excel import for pricing details
    var _pricingHeader = RFQTRANSACTION.PRICING_COLUMN_MAPPING;
    vm.erOptions = {
      workstart: function () {
      },
      workend: function () { },
      sheet: function (json, sheetnames, select_sheet_cb) {
        var data = {
          pricingHeaders: _pricingHeader,
          excelHeaders: json[0],
          notquote: true
        };
        DialogFactory.dialogService(
          RFQTRANSACTION.PRICING_COLUMN_MAPPING_CONTROLLER,
          RFQTRANSACTION.PRICING_COLUMN_MAPPING_VIEW,
          _dummyEvent,
          data).then((result) => {
            generateModel(json, result);
          }, (err) => {
            return BaseService.getErrorLog(err);
          });
      },
      badfile: function () {
        var model = {
          title: CORE.MESSAGE_CONSTANT.PRICE_UPLOAD_FAIL,
          textContent: CORE.MESSAGE_CONSTANT.BOM_UPLOAD_FAIL_TEXT,
          multiple: true
        };
        DialogFactory.alertDialog(model);
      },
      pending: function () {
        // console.log('Pending');
      },
      failed: function (e) {
        var model = {
          title: CORE.MESSAGE_CONSTANT.PRICE_UPLOAD_FAIL,
          textContent: e.stack,
          multiple: true
        };
        DialogFactory.alertDialog(model);
        // console.log(e, e.stack);
      },
      large: function (len, cb) {
        var model = {
          title: CORE.MESSAGE_CONSTANT.PRICE_UPLOAD_FAIL,
          textContent: CORE.MESSAGE_CONSTANT.BOM_UPLOAD_FAIL_SIZE_TEXT,
          multiple: true
        };
        DialogFactory.alertDialog(model);
      }
    };
    // Create model from array
    function generateModel(uploadedPrice, priceHeaders) {
      var pricingmodel = [];
      // loop through excel data and bind into model
      for (var i = 1, len = uploadedPrice.length; i < len; i++) {
        var item = uploadedPrice[i];
        var modelRow = {};
        uploadedPrice[0].forEach(function (column, index) {
          if (column == null)
            return;
          var obj = priceHeaders.find((x) => { return x.column && x.column.toUpperCase() == column.toUpperCase(); });
          if (!obj)
            return;
          var field = _pricingHeader.find((x) => { return x.fieldName == obj.header; });
          if (!modelRow[field.fieldName]) {
            modelRow[field.fieldName] = item[index];
          }
          else if (_multiFields.indexOf(field) != -1) {
            var value = item[index];
            if (!value)
              return;
            value = value.toUpperCase();
          }
        });
        pricingmodel.push(modelRow);
      };
      checkUploadedPrice(pricingmodel);
    }
    //check for validation for fields after update
    function checkUploadedPrice(parts) {
      var errorPrice = [];
      _.each(parts, (item) => {
        var isDirty = false;
        var remark = "";
        var error = "";
        var objLine = _.find(vm.notQuotedData, (part) => { return part.lineID == item.LineID });
        if (objLine) {
          var partNumberList = [];
          _.each(objLine.mfgComponents, function (item) {
            var mfgpart = item ? item.split('###') : "";
            var objPart = {
              Mfg: mfgpart[1],
              Name: mfgpart[0]
            };
            partNumberList.push(objPart);
          });
          if (!item.LineID || item.LineID != objLine.lineID) {
            if (!item.LineID)
              error = stringFormat(RFQTRANSACTION.PRICING.REQUIRED, "ConsolidateID");
            else
              error = stringFormat(RFQTRANSACTION.PRICING.INVALID, "ConsolidateID");
            isDirty = true;
            remark = error;
          }
          if (!item.ManufacturerName || !(_.find(partNumberList, (mfg) => { return mfg.Mfg.toUpperCase() == item.ManufacturerName.toUpperCase() }))) {
            if (!item.ManufacturerName)
              error = stringFormat(RFQTRANSACTION.PRICING.REQUIRED, "ManufacturerName");
            else
              error = stringFormat(RFQTRANSACTION.PRICING.INVALID, "ManufacturerName");
            if (isDirty) {
              remark = stringFormat("{0},{1}", remark, error);
            }
            else {
              remark = error;
              isDirty = true;
            }
          }
          if (!item.ManufacturerPartNumber || !(_.find(partNumberList, (mfg) => { return mfg.Name.toUpperCase() == item.ManufacturerPartNumber.toUpperCase() }))) {
            if (!item.ManufacturerPartNumber)
              error = stringFormat(RFQTRANSACTION.PRICING.REQUIRED, "ManufacturerPartNumber");
            else
              error = stringFormat(RFQTRANSACTION.PRICING.INVALID, "ManufacturerPartNumber");
            if (isDirty) {
              remark = stringFormat("{0},{1}", remark, error);
            }
            else {
              remark = error;
              isDirty = true;
            }
          }
          if (!item.MinimumBuy) {
            error = stringFormat(RFQTRANSACTION.PRICING.REQUIRED, "MinimumBuy");
            if (isDirty) {
              remark = stringFormat("{0},{1}", remark, error);
            }
            else {
              remark = error;
              isDirty = true;
            }
          }
          if (!item.Multiplier) {
            error = stringFormat(RFQTRANSACTION.PRICING.REQUIRED, "Multiplier");
            if (isDirty) {
              remark = stringFormat("{0},{1}", remark, error);
            }
            else {
              remark = error;
              isDirty = true;
            }
          }
          if (!item.PricePerPart) {
            error = stringFormat(RFQTRANSACTION.PRICING.REQUIRED, "PricePerPart");
            if (isDirty) {
              remark = stringFormat("{0},{1}", remark, error);
            }
            else {
              remark = error;
              isDirty = true;
            }
          }
          if (!item.RfqAssyQtyId) {
            error = stringFormat(RFQTRANSACTION.PRICING.REQUIRED, "RfqAssyQtyId");
            if (isDirty) {
              remark = stringFormat("{0},{1}", remark, error);
            }
            else {
              remark = error;
              isDirty = true;
            }
          }
          if (!item[RFQTRANSACTION.PART_COSTING.ApiLeadTime]) {
            error = stringFormat(RFQTRANSACTION.PRICING.REQUIRED, "ApiLeadTime");
            if (isDirty) {
              remark = stringFormat("{0},{1}", remark, error);
            }
            else {
              remark = error;
              isDirty = true;
            }
          }
          if (!item.SupplierName) {
            error = stringFormat(RFQTRANSACTION.PRICING.REQUIRED, "SupplierName");
            if (isDirty) {
              remark = stringFormat("{0},{1}", remark, error);
            }
            else {
              remark = error;
              isDirty = true;
            }
          }
          if (isDirty) {
            item.Remark = remark;
            errorPrice.push(item);
          }
        }
        else {
          item.remark = stringFormat(RFQTRANSACTION.PRICING.INVALID, "Line Item");
          errorPrice.push(item);
        }
      });
      if (errorPrice.length > 0)
        exportFile(errorPrice, "errorPricing.xls");
      else
        saveExportPricing(parts);
    }
    //save import pricing for quantity
    function saveExportPricing(pricing) {
      _.each(pricing, function (price) {
        var objConsolidate = _.find(vm.notQuotedData, function (item) { return item.lineID == price.LineID });
        price.LeadTime = price.LeadTime;
        price.Active = true;
        price.SupplierPN = price.SupplierPN ? price.SupplierPN : RFQTRANSACTION.PART_COSTING.Sku;
        price.SourceOfPrice = RFQTRANSACTION.PART_COSTING.Manual;
        price.IsDraft = false;
        price.OrderQty = Math.max((Math.ceil(price.OrderQty / price.Multiplier) * price.Multiplier), price.MinimumBuy);
        price.OrgMin = price.MinimumBuy;
        price.OrgMult = price.Multiplier;
        price.APILeadTime = price[RFQTRANSACTION.PART_COSTING.ApiLeadTime] ? parseInt(price[RFQTRANSACTION.PART_COSTING.ApiLeadTime]) : null;
        price.CurrentStockQty = price.CurrentStockQty ? parseInt(price.CurrentStockQty) : null;
        price.OrgInStock = price.CurrentStockQty;
        price.PricePerPart = parseFloat(price.PricePerPart),
          price.OrgUnitPrice = price.PricePerPart;
        price.TotalDollar = (price.OrderQty * price.PricePerPart);
        price.IsQtyBreakLowerThanTotalQty = false;
        price.Region = RFQTRANSACTION.PART_COSTING.Unknown;
        price.CurrencyName = RFQTRANSACTION.PART_COSTING.USD;
        price.CurrencyConversionRate = 1;
        price.CurrencyUnitPrice = price.PricePerPart;
        price.IsDeleted = false;
        price.PIDCode = stringFormat("{0}+{1}", price.ManufacturerName, price.ManufacturerPartNumber);
        price.PriceType = "Custom";
        price.rfqAssyID = parseInt(rfqAssyID);
        price.OutOfQtyBreak = false;
        price.ConsolidateID = objConsolidate ? objConsolidate.id : null,
          price.RfqAssyQtyId = parseInt(price.RfqAssyQtyId),
          price.SupplierName = price.SupplierName
      });
      PartCostingFactory.saveImportPricing().query({ importPricing: pricing }).$promise.then((pricing) => {
        vm.loadData();
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    // [E] Cell validation color

    // Create dummy event to bind theme to all popups which are opening from handsontable
    // Temporary solution
    vm.dummyEvent = ($event) => {
      _dummyEvent = $event;
    }
    //close popup on destroy page
    $scope.$on('$destroy', function () {
      $mdDialog.hide(false, {
        closeAll: true
      });
    });
  }
})();
