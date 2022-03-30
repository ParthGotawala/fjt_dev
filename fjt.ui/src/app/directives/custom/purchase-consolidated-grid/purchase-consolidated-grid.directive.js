(function () {

  'use sctrict';
  angular
    .module('app.core')
    .directive('purchaseConsolidatedGrid', purchaseConsolidatedGrid);

  /** @ngInject */
  function purchaseConsolidatedGrid(CORE, $mdDialog, $filter) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        salesOrderDetail: "=",
        isSelectSO: "=",
        packagingAlias: "=",
        partIds: '=?'
      },
      templateUrl: 'app/directives/custom/purchase-consolidated-grid/purchase-consolidated-grid.html',
      controller: PurchaseConsolidatedGridCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function PurchaseConsolidatedGridCtrl($scope, $q, $element, $attrs, $timeout, $filter, CORE, TRANSACTION, DialogFactory, PurchaseFactory, BaseService, PRICING, RFQTRANSACTION, socketConnectionService, PartCostingFactory, NotificationFactory, MasterFactory, CONFIGURATION) {
      var vm = this;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.salesOrderDetail = $scope.salesOrderDetail;
      vm.isSelectSO = $scope.isSelectSO;
      vm.packagingAlias = $scope.packagingAlias;
      vm.PRICING_STATUS = PRICING.PRICING_STATUS;
      vm.isHideDelete = true;
      vm.isExpand = true;
      vm.view = true;
      vm.isPricing = true;
      vm.isPricingStatus = true;
      vm.isShowPricingStatus = true;
      vm.purchaseHeightClass = TRANSACTION.Purchase_Split_UI.PurchaseGridUI;

      let initPageInfo = () => {
        vm.pagingInfo = {
          Page: 0,
          SortColumns: [['lineID', 'ASC']],
          SearchColumns: []
        };
      }
      initPageInfo();

      vm.gridOptions = {
        enableRowHeaderSelection: false,
        enableFullRowSelection: false,
        enableRowSelection: false,
        multiSelect: false,
        filterOptions: vm.pagingInfo.SearchColumns,
        enableCellEdit: true,
        enablePaging: false,
        enableCellEditOnFocus: false,
        exporterCsvFilename: 'Purchase Consolidated.csv',
        exporterMenuCsv: true,
        enableGrouping: false,
        enableColumnMenus: false
      };

      let initUIGrid = () => {
        vm.sourceHeader = [
          {
            field: 'Action',
            cellClass: 'layout-align-center-center',
            //headerCellTemplate: '<div class="ui-grid-cell-contents">Action <br><span style="color:black" ng-if="grid.appScope.$parent.vm.selectedFilterName.ID==1">Priced items {{grid.appScope.$parent.vm.PricedPercentage}}</span></div>',
            displayName: 'Action',
            width: 150,
            cellTemplate: '<grid-action-view grid="grid" ng-click="$event.stopPropagation();" row="row" number-of-action-button="3"   style="\overflow: hidden;padding:5px !important;overflow: hidden; white-space: nowrap;\" class="height-grid ui-grid-cell-contents" ></grid-action-view>',
            enableFiltering: false,
            enableSorting: false,
            enableCellEdit: false,
            exporterSuppressExport: true,
            enableColumnMenus: false,
            enableRowSelection: false,
            enableFullRowSelection: false,
            multiSelect: false,

          },
          {
            field: '#',
            width: 50,
            cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
            enableFiltering: false,
            enableSorting: false,
            enableCellEdit: false,
            allowCellFocus: false,
          },
          {
            field: 'lineID',
            displayName: 'Item',
            cellTemplate: '<div class="ui-grid-cell-contents text-left" style="padding:0px !important">{{COL_FIELD}}</div>',
            width: 60,
            type: 'number',
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false,
          },
          {
            field: 'consolidatedpartlineID',
            displayName: 'Consolidated Item Detail',
            cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents-break" ng-repeat="item in row.entity.consolidatedpartlineID">{{item?item.substring(0,item.lastIndexOf("|")):""}}</div>',
            width: 420,
            enableCellEdit: false,
            maxWidth: 500,
            enableFiltering: true,
            enableSorting: true,
            enableColumnMenus: false,
            allowCellFocus: false,
            visible: false
          },
          {
            field: 'displayPIDs',
            displayName: CORE.LabelConstant.MFG.PID,
            cellTemplate: '<alternative-component-details is-expand="grid.appScope.$parent.vm.isExpand" row-data="row.entity"></alternative-component-details>',
            width: CORE.UI_GRID_COLUMN_WIDTH.PID,
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false
          },
          {
            field: 'consolidatedQPA',
            displayName: 'QPA',
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
            width: 100,
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false
          },
          {
            field: 'partTypeName',
            displayName: 'Functional Type',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: 175,
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false
          },
          {
            field: 'mountingTypeName',
            displayName: 'Mounting Type',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: 130,
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false
          },
          {
            field: 'unitName',
            displayName: 'BOM UOM',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: 100,
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false
          },
          {
            field: 'requireQty',
            displayName: 'Require Units',
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
            width: 120,
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false
          },
          {
            field: 'requirePins',
            displayName: 'Require Pins',
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
            width: 120,
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false
          },
          {
            field: 'allocatedQty',
            displayName: 'Allocated Qty/Count',
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
            width: 100,
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false
          },
          {
            field: 'allocatedUnit',
            displayName: 'Allocated Units',
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
            width: 100,
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false
          },
          {
            field: 'scrapedPins',
            displayName: 'Scrapped Pins',
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
            width: 100,
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false
          },
          {
            field: 'allocatedPins',
            displayName: 'Allocated Pins',
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
            width: 100,
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false
          },
          {
            field: 'requiredUnitsPOQty',
            displayName: `Required Units PO Qty`,
            cellTemplate: `<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>`,
            width: 120,
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false
          },
          {
            field: 'requiredPinsPOQty',
            displayName: `Require Pins PO Qty`,
            cellTemplate: `<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>`,
            width: 115,
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false
          },
          {
            field: 'requiredUnitsMRPQty',
            displayName: `Required Units MRP Qty`,
            cellTemplate: `<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>`,
            width: 100,
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false
          },
          {
            field: 'requiredPinsMRPQty',
            displayName: `Require Pins MRP Qty`,
            cellTemplate: `<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>`,
            width: 120,
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false
          },
          {
            field: 'quoteSupplier',
            displayName: 'Quote Price Supplier',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: 110,
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false
          },
          {
            field: 'quotePartNo',
            displayName: 'Quote Price Part#',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: 110,
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false
          },
          {
            field: 'quoteUnitPrice',
            displayName: `Quote Price Unite Price`,
            cellTemplate: `<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>`,
            width: 110,
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false
          },
          {
            field: 'quotePackaging',
            displayName: 'Quote Price Packaging',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: 110,
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false
          },
          {
            field: 'selectedPriceSupplier',
            displayName: 'Selected Price Supplier',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: 100,
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false
          },
          {
            field: 'selectedPricePartNo',
            displayName: 'Selected Price Part#',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: 100,
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false
          },
          {
            field: 'selectedPriceUnitPrice',
            displayName: `Selected Price Unit Price`,
            cellTemplate: `<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>`,
            width: 100,
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false
          },
          {
            field: 'selectedPricePackaging',
            displayName: 'Selected Price Packaging',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: 100,
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false
          },
          {
            field: 'cumulativeStock',
            displayName: `Cumulative Stock`,
            cellTemplate: `<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>`,
            width: 110,
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false
          },
          {
            field: 'selectedSupplierStock',
            displayName: `Selected Supplier Stock`,
            cellTemplate: `<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>`,
            width: 100,
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false
          },
          {
            field: 'shortage',
            displayName: `Shortage`,
            cellTemplate: `<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>`,
            width: 100,
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false
          },
          {
            field: 'inTransitStock',
            displayName: `In Transit Stock`,
            cellTemplate: `<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>`,
            width: 100,
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false
          },
          {
            field: 'possibilityOfAvailableQty',
            displayName: `Possibility of available Qty`,
            cellTemplate: `<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>`,
            width: 100,
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false
          },
          {
            field: 'BOMIssues',
            displayName: 'BOM Issues',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: 110,
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false
          }
        ];
      }
      initUIGrid();

      vm.loadData = () => {
        vm.pagingInfo.partID = vm.salesOrderDetail.partId;
        vm.pagingInfo.poQty = vm.salesOrderDetail.poQty;
        vm.pagingInfo.mrpQty = vm.salesOrderDetail.mrpQty;
        vm.pagingInfo.customerId = vm.salesOrderDetail.customerID;
        // Replace the soQty to kitQty
        vm.pagingInfo.kitQty = vm.salesOrderDetail.soQty;
        //added SalesOrderDetailId to get pricing status
        vm.pagingInfo.SalesOrderDetailId = vm.salesOrderDetail.SalesOrderDetailId;
        vm.pagingInfo.packagingAlias = vm.packagingAlias;
        var searchPID = _.find(vm.pagingInfo.SearchColumns, { ColumnName: 'displayPIDs' });
        if (searchPID) {
          searchPID.ColumnName = 'mfgPN';
        }
        let checkSortColumns = _.filter(vm.pagingInfo.SortColumns, (data) => {
          let obj = _.find(data, (item) => { return item == 'displayPIDs' });
          if (obj) { return data };
        });
        if (checkSortColumns.length > 0) {
          var sortPID = _.find(checkSortColumns, (data) => { return data[0] == 'displayPIDs'; });
          if (sortPID) {
            sortPID[0] = 'mfgPN';
          }
        }
        vm.cgBusyLoading = PurchaseFactory.getPurchaseConsolidatedList().query(vm.pagingInfo).$promise.then((response) => {
          if (response.data) {
            vm.sourceData = response.data.purchaseConsolidatedList;
            bindGridData(response);
            _.map(vm.sourceData, (item) => {
              item.displayPIDs = getPIDsFromString(item.mfgPN);
              item.autoPricingStatus = _.filter(response.data.autoPricingStatus, (autoPrice) => { return autoPrice.consolidateID == item.id && autoPrice.status });
            });
            vm.totalSourceDataCount = response.data.Count;

            if (!vm.gridOptions.enablePaging) {
              vm.currentdata = vm.sourceData.length;
              vm.gridOptions.gridApi.infiniteScroll.resetScroll();
            }

            _.map(vm.sourceData, (item) => {
              if (item.consolidatedpartlineID) {
                item.consolidatedpartlineID = item.consolidatedpartlineID.replace(/{/g, '').replace(/}/g, '');
                item.consolidatedpartlineID = item.consolidatedpartlineID ? item.consolidatedpartlineID.split(',') : "";
              }

            });
            vm.gridOptions.clearSelectedRows();
            if (vm.totalSourceDataCount == 0) {
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
              vm.resetSourceGrid();
              angular.element('.highlight-cell').parent().addClass('cm-kit-release-hot-err');
              if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount == vm.currentdata) {
                vm.isallloaded = true;
                return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
              } else {
                vm.isallloaded = false;
              }
            });
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

      vm.getDataDown = () => {
        if (!vm.isallloaded) {
          var searchPID = _.find(vm.pagingInfo.SearchColumns, { ColumnName: 'displayPIDs' });
          if (searchPID) {
            searchPID.ColumnName = 'mfgPN';
          }
          let checkSortColumns = _.filter(vm.pagingInfo.SortColumns, (data) => {
            let obj = _.find(data, (item) => { return item == 'displayPIDs' });
            if (obj) { return data };
          });
          if (checkSortColumns.length > 0) {
            var sortPID = _.find(checkSortColumns, (data) => { return data[0] == 'displayPIDs'; });
            if (sortPID) {
              sortPID[0] = 'mfgPN';
            }
          }
          vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
          vm.cgBusyLoading = PurchaseFactory.getPurchaseConsolidatedList().query(vm.pagingInfo).$promise.then((response) => {
            vm.sourceData = vm.sourceData.concat(response.data.purchaseConsolidatedList);
            _.map(vm.sourceData, (item) => {
              item.displayPIDs = getPIDsFromString(item.mfgPN);
            });
            vm.currentdata = vm.sourceData.length;
            vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
            $timeout(() => {
              vm.resetSourceGrid();
              if (vm.totalSourceDataCount == vm.currentdata) {
                vm.isallloaded = true;
              }
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount != vm.currentdata ? true : false);
            });
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
        }
      }

      vm.viewRecord = (item) => {
        $scope.partIds = null;
        if (item) {
           // var splitPartIDs = item.entity.component.split(',');
          // var partIdsTemp = _.map(splitPartIDs, (item) => { return item.split('###')[3] });

          $timeout(() => {
            $scope.$emit("selectionChange", item.entity);
            $scope.partIds = item.entity.mfgPart;
          });
        }
      };

      $scope.$on('PurchasePackagingAlias', (event, data) => {
        vm.packagingAlias = data;
        BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
      });
      //Pricing for Purchase

      //bind pricing details and its status
      let bindGridData = (consolidatemfg) => {
        _.each(consolidatemfg.data.purchaseConsolidatedList, (item) => {
          let filterByLineItemArr = _.filter(consolidatemfg.data.autoPricingStatus, { 'consolidateID': item.rfqLineItemsId });
          if (filterByLineItemArr.length > 0) {
            item.pricing = [];
            _.each(filterByLineItemArr, (objPricing) => {
              let reqObj = {};
              reqObj.pricingApiName = objPricing.pricingApiName;
              reqObj.pricingSupplierID = objPricing.pricingSupplierID;
              reqObj.consolidateID = objPricing.consolidateID; //kit_allocation_lineitems table PK
              reqObj.rfqAssyID = objPricing.rfqAssyID; // sales order detail table id
              reqObj.status = objPricing.status;
              reqObj.msg = objPricing.msg;
              item.pricing.push(reqObj);
            });
            SetAutoPricingDisable(item);
          }
        });
        //to check common loader
        let anyLineDisable = _.find(consolidatemfg.data.purchaseConsolidatedList, { 'isDisabled': true });
        if (anyLineDisable) {
          _.each(consolidatemfg.data.purchaseConsolidatedList, (o) => { o.isDisabled = true });
          let objPurchasePricing = {};
          objPurchasePricing.status = vm.PRICING_STATUS.SendRequest;
          $scope.$emit(TRANSACTION.EventName.UpdatePurchaseStatus, objPurchasePricing);
        }
      };

      //open popup for pricing apis
      vm.getPricingApis = (selectedData, event, type) => {
        let dataObj = {};
        dataObj.lineItemList = [];
        dataObj.type = type;
        if (type == "multiple") {
          dataObj.lineItemList = selectedData;
        } else {
          dataObj.lineItemList.push(selectedData);
        }
        dataObj.UpdatePricingStatus = vm.UpdatePricingStatus;
        dataObj.customprice = true;
        dataObj.isPurchaseApi = true;
        DialogFactory.dialogService(
          CORE.RFQ_TRANSACTION_BOM_PART_COSTING_MANAGEPRICE_MODAL_CONTROLLER,
          CORE.RFQ_TRANSACTION_BOM_PART_COSTING_MANAGEPRICE_MODAL_VIEW,
          event,
          dataObj).then(() => {
          }, (data) => {
            if (data) {
              vm.pagingInfo.Page = CORE.UIGrid.Page();
              vm.loadData();
            }
          },
            (err) => {
              return BaseService.getErrorLog(err);
            });
      }

      // call update pricing status from popup
      vm.UpdatePricingStatus = (lineItemList) => {
        _.each(lineItemList, (item) => {
          let objLineItem = _.find(vm.sourceData, { 'id': item.id });
          // check with grid data line item exists or not
          if (objLineItem) {
            _.each(item.pricingList, (obj) => {
              if (objLineItem.pricing && objLineItem.pricing.length > 0) {
                let objPricing = _.find(objLineItem.pricing, {
                  'consolidateID': item.id,
                  'pricingSupplierID': obj.id
                });
                if (objPricing) {
                  objPricing.status = vm.PRICING_STATUS.SendRequest;
                } else {
                  item.pricingApiName = obj.mfgName;
                  item.pricingSupplierID = obj.id;
                  addAutoPricingInLineItem(item, objLineItem);
                }
              }
              else {
                objLineItem.pricing = [];
                item.pricingApiName = obj.mfgName;
                item.pricingSupplierID = obj.id;
                addAutoPricingInLineItem(item, objLineItem);
              }
            });
            SetAutoPricingDisable(objLineItem);
          }
        });
        let objPurchasePricing = {};
        objPurchasePricing.status = vm.PRICING_STATUS.SendRequest;
        // update ui for loader in bom page
        $scope.$emit(TRANSACTION.EventName.UpdatePurchaseStatus, objPurchasePricing);
      }

      // add auto pricing api wise to lineitem
      function addAutoPricingInLineItem(pricingObj, objLineItem) {
        let reqObj = {};
        reqObj.pricingApiName = pricingObj.pricingApiName;
        reqObj.consolidateID = pricingObj.id;
        reqObj.rfqAssyID = pricingObj.rfqAssyID;
        reqObj.status = pricingObj.status;
        reqObj.msg = pricingObj.msg;
        reqObj.pricingSupplierID = pricingObj.pricingSupplierID;
        objLineItem.pricing.push(reqObj);
      }
      // disable lineItem button
      let SetAutoPricingDisable = (objLineItem) => {
        let objPending = _.find(objLineItem.pricing, { 'status': vm.PRICING_STATUS.SendRequest });
        if (objPending) {
          objLineItem.isDisabled = true;
        }
        else {
          objLineItem.isDisabled = false;
        }
      }

      // [S] Socket Listeners
      function connectSocket() {
        socketConnectionService.on(PRICING.EventName.PurchaseLineItemPricingStatus, pricingStatusListener);
        socketConnectionService.on(PRICING.EventName.SaleSPricingStatus, pricingSalesStatusListener);
        socketConnectionService.on(PRICING.EventName.Purchase_askDigikeyAuthentication, askForDigikeyAuthentication);
      }
      connectSocket();

      socketConnectionService.on('reconnect', () => {
        connectSocket();
      });

      //call for line item wise socket status
      function pricingStatusListener(message) {
        if (message && (message.rfqAssyID == vm.pagingInfo.SalesOrderDetailId || message.AssyID == vm.pagingInfo.SalesOrderDetailId)) { //message.rfqAssyID as vm.pagingInfo.SalesOrderDetailId manage same for part costing and purchase
          $timeout(statusReceive(message));
        }
      }
      function statusReceive(message) {
        vm.UpdatePricingResponseStatus(message);
      }

      // call when api response come and update status
      vm.UpdatePricingResponseStatus = (pricingObj) => {
        if (pricingObj.consolidateID) {
          let objLineItem = _.find(vm.sourceData, { 'id': pricingObj.consolidateID });
          // check with grid data line item exists or not
          if (objLineItem) {
            if (objLineItem.pricing && objLineItem.pricing.length > 0) {
              let objPricing = _.find(objLineItem.pricing, {
                'consolidateID': pricingObj.consolidateID,
                'pricingSupplierID': pricingObj.pricingSupplierID
              });
              if (objPricing) {
                objPricing.status = pricingObj.status;
                objPricing.msg = pricingObj.msg;
                objPricing.errorMsg = pricingObj.errorMsg;
              } else {
                addAutoPricingInLineItem(pricingObj, objLineItem);
              }
            } else {
              objLineItem.pricing = [];
              addAutoPricingInLineItem(pricingObj, objLineItem);
            }
            //to check for enable/disable 
            //SetAutoPricingDisable(objLineItem);
          }
        }
      }
      function pricingSalesStatusListener(message) {
        if (message && (message.rfqAssyID == vm.pagingInfo.SalesOrderDetailId || message.AssyID == vm.pagingInfo.SalesOrderDetailId)) { //message.rfqAssyID as vm.pagingInfo.SalesOrderDetailId manage same for part costing and purchase
          $timeout(statusSalesReceive(message));
        }
      }
      //call for final socket update call for pricing
      function statusSalesReceive(data) {
        $scope.$emit(TRANSACTION.EventName.UpdatePurchaseStatus, data);
        if (data.status != vm.PRICING_STATUS.SendRequest) {
          _.each(vm.sourceData, (lineItem) => {
            lineItem.isDisabled = false;
          });
          if (data.isStockUpdate)//for stock update{
          {
            vm.pagingInfo.Page = CORE.UIGrid.Page();
            NotificationFactory.success(RFQTRANSACTION.PRICING.STOCK_UPDATE);
            vm.loadData();
          }
          else {
            var model = {
              title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
              textContent: RFQTRANSACTION.PRICING.PRICING_DONE,
              multiple: true
            };
            DialogFactory.alertDialog(model);
            recalculatePriceItems();
          }
          // vm.loadData();
        }
      }
      //call if digikey credential expires
      function askForDigikeyAuthentication(message) {
        if (!vm.openDigikeyPopup && message.AssyID == vm.pagingInfo.SalesOrderDetailId) {  //message.rfqAssyID as vm.pagingInfo.SalesOrderDetailId manage same for part costing and purchase
          $timeout(askForDigikeyVerification(message));
        }
      }
      function askForDigikeyVerification(message) {
        let event = angular.element.Event('click');
        angular.element('body').trigger(event);
        vm.verfiyDigikey(event);
      }
      // verify digikey popup
      vm.verfiyDigikey = (ev) => {
        vm.openDigikeyPopup = true;
        MasterFactory.getSelectedGlobalSettingKeyValues().query({ allKeys: [CONFIGURATION.SETTING.DKVersion] }).$promise.then((response) => {
          if (response.data) {
            _.each(response.data, (item) => {
              switch (item.key) {
                case CONFIGURATION.SETTING.DKVersion:
                  _DkVersion = item.values;
                  break;
              }
            });
            var data = {
              appID: _DkVersion == CORE.DKVersion.DKV2 ? PRICING.APP_DK_TYPE.FJT : PRICING.APP_DK_TYPE.FJTV3,
              isNewVersion: _DkVersion == CORE.DKVersion.DKV2 ? false : true
            }
            DialogFactory.dialogService(
              CORE.DIGIKEY_VERIFICATION_MODAL_CONTROLLER,
              CORE.DIGIKEY_VERIFICATION_MODAL_VIEW,
              ev,
              data).then(() => {
                vm.openDigikeyPopup = false;
              }, () => {
                vm.openDigikeyPopup = false;
              }, (err) => {
                vm.openDigikeyPopup = false;
              });
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
      //get all supplier price details
      vm.cgBusyLoading = PartCostingFactory.getSupplierList().query({ isPricing: true }).$promise.then((suppliers) => {
        vm.Suppliers = _.sortBy(suppliers.data, (o) => { return o.mfgName });
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
      //receive event for stock update
      let stkUpdate = $scope.$on(TRANSACTION.EventName.PurchaseStockUpdate, (name, data) => {
        let obj = {
          title: CORE.MESSAGE_CONSTANT.PUBLISHTEMPLATE_CONFIRM,
          textContent: RFQTRANSACTION.PRICING.STOCK_UPDATE_CONFIRM,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.confirmDiolog(obj).then((yes) => {
          if (yes) {
            let selectedLineItem = [];
            _.each(vm.sourceData, (item) => {
              if (item.isPurchase) {
                let prcObj = {};
                prcObj.id = item.id;
                prcObj.rfqAssyID = vm.salesOrderDetail.SalesOrderDetailId;
                item.status = PRICING.PRICING_STATUS.SendRequest;
                item.pricingList = prcObj.pricingList = _.filter(vm.Suppliers, function (a) {
                  return _.find(item.autoPricingStatus, function (b) {
                    return b.pricingSupplierID === a.id;
                  });
                });
                if (item.pricingList.length > 0)
                  selectedLineItem.push(prcObj);
              }
            });
            if (selectedLineItem.length > 0)
              vm.UpdatePricingStatus(selectedLineItem);
            // progress bar
            if (selectedLineItem.length > 0) {
              vm.cgBusyLoading = PartCostingFactory.getPricingFromApis().query({ pricingApiObj: { pricingApiList: selectedLineItem, isCustomPrice: true, isPurchaseApi: true, isStockUpdate: true } }).$promise.then((res) => {
                vm.pagingInfo.Page = CORE.UIGrid.Page();
                vm.loadData();
              }).catch((error) => {
                return BaseService.getErrorLog(error);
              });
            }
            else {
              var model = {
                title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
                textContent: stringFormat(RFQTRANSACTION.PRICING.STOCK_NOT_UPDATE),
                multiple: true
              };
              DialogFactory.alertDialog(model);
              return false;
            }
          }
        }, (cancel) => {
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      });
      // method to update pricing status loader
      let updateAllPricingStatus = $scope.$on(TRANSACTION.EventName.UpdateAllPurchasePricing, function (name, data) {
        if (vm.gridOptions.getSelectedRowsCount() > 0) {
          var selectedRows = vm.gridOptions.getSelectedRows();
          var source = _.filter(selectedRows, (prices) => { return prices.isPurchase == true && !prices.restrictCPNUseInBOMStep && prices.restrictCPNUsePermanentlyStep && prices.restrictCPNUseWithPermissionStep });
          vm.getPricingApis(source, data, "multiple");
        }
        else {
          var source = _.filter(vm.sourceData, (prices) => { return prices.isPurchase == true && !prices.restrictCPNUseInBOMStep && prices.restrictCPNUsePermanentlyStep && prices.restrictCPNUseWithPermissionStep });
          vm.getPricingApis(source, data, "multiple");
        }
      });

      // method to update pricing status loader
      let refeshGrid = $scope.$on('refeshPurchaseGrid', function (name, data) {
        //vm.isClearPriceShow = true;
        recalculatePriceItems();
      });
      // show pricing status
      vm.showPricingStatus = (row, data, event) => {
        if (data.status == vm.PRICING_STATUS.NotPricing) {
          var model = {
            title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
            textContent: data.msg,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT,
            multiple: true
          };
          DialogFactory.alertDialog(model);
          return false;
        }
      }

      //recalculate logic for price
      function recalculatePriceItems(isPriced) {
        var autocompletePromise = [getPricingList(), getnonQuoteQtyItems()];
        vm.cgBusyLoading = $q.all(autocompletePromise).then((responses) => {
          if (responses) {
            vm.pricingList = responses[0];
            vm.nonQuotedQtyList = responses[1].notQuoteQtyList;
            autocompletePromise = [BindPricingDetail()];
            vm.cgBusyLoading = $q.all(autocompletePromise).then((responses) => {
              vm.cgBusyLoading = PurchaseFactory.savePurchasePrice().query({ pricingObj: vm.nonQuoteList }).$promise.then((finalPrice) => {
                vm.pagingInfo.Page = CORE.UIGrid.Page();
                vm.loadData();
              });
            });
          }
        });
      }
      //make list for pricing details
      function BindPricingDetail() {
        return $timeout(() => {
          vm.nonQuoteList = [];
          _.each(vm.nonQuotedQtyList, (nonQuote) => {
            var listPriceAll = _.filter(vm.pricingList, (item) => { return item.ConsolidateID == nonQuote.id });
            var listPrice = listPriceAll.map(x => x.assemblyQtyBreak);
            var consolidateList = [];
            _.each(listPrice, (lprice) => {
              _.each(lprice, (qBreak) => {
                consolidateList.push(qBreak);
              })
            });
            consolidateList = _.filter(consolidateList, (consolidate) => { return consolidate.PricePerPart });
            _.each(consolidateList, (qtyBreak) => {
              qtyBreak.objQtySupplier = _.find(listPriceAll, (listPrice) => { return listPrice._id == qtyBreak.qtySupplierID });
            });
            var stock; var packageing = true; var objPrice = null;
            if (consolidateList.length > 0) {
              // while stock is fulfiled and having minimum price
              var liststock = _.filter(consolidateList, (high) => { return high.objQtySupplier && high.objQtySupplier.OtherStock >= high.OrderQty });
              if (liststock.length > 0)
                objPrice = _.minBy(liststock, 'PricePerPart');
              if (objPrice) {
                //check logic for pricing which is lowest to 4-5 times then selected price.
                var minPriceForPart = _.find(consolidateList, (price) => { return price._id != objPrice._id && price.PricePerPart && parseFloat(price.PricePerPart ? price.PricePerPart : 0) <= (parseFloat(objPrice.PricePerPart ? objPrice.PricePerPart : 0) / parseFloat(_ForceToBuyPriceDifferenceXTimeLess)) });
                if (minPriceForPart)
                  objPrice = minPriceForPart;
                //end logic
                var supplierObj = _.find(listPriceAll, (suppObj) => { return suppObj._id == objPrice.qtySupplierID });
                stock = getStockDetails(listPriceAll, nonQuote, supplierObj);
                QuoteList(nonQuote.id, objPrice ? objPrice.PricePerPart : 0, supplierObj.SupplierID,
                  supplierObj.SourceOfPrice, supplierObj.OtherStock,
                  supplierObj.APILeadTime, supplierObj.PartNumberId, stock.supplierStock, stock.grossStock, stock.pricingSuppliers,
                  supplierObj.packageID, supplierObj._id, objPrice.OrderQty, objPrice ? objPrice.ActualPrice : 0, objPrice ? objPrice.ActualQty : 0, supplierObj.OrgInStock, stock.supplierQtyStock);
              }
              else {
                QuoteList(nonQuote.id);
              }
            }
          });
        }, 0);
      }
      //get stock details
      function getStockDetails(listPriceAll, nonQuote, supplierObj) {
        var stock = {}; var uniqueDetails;
        stock.supplierStock = _.sumBy(listPriceAll, (o) => { if (o.SupplierID == supplierObj.SupplierID && o.ConsolidateID == nonQuote.id) { return o.OtherStock } });
        stock.supplierQtyStock = _.sumBy(listPriceAll, (o) => { if (o.SupplierID == supplierObj.SupplierID && o.ConsolidateID == nonQuote.id) { return (o.OrgInStock ? o.OrgInStock : 0) } });
        stock.grossStock = _.sumBy(_.filter(listPriceAll, (pData) => { return !pData.copyFromID && pData.ConsolidateID == nonQuote.id }), function (o) { return o.OtherStock; });
        uniqueDetails = _.uniqBy(_.filter(listPriceAll, (x) => { return x.OtherStock > 0 && x.ConsolidateID == nonQuote.id }), (y) => { return y.SupplierName });
        uniqueDetails = _.uniqBy(uniqueDetails, 'SupplierID');
        stock.pricingSuppliers = _.map(uniqueDetails, 'SupplierName').join();
        return stock;
      }
      //save selected part details
      //create list
      function QuoteList(id, refQuoteUnitPriceEach, refsupplierID,
        refPriceselectionMode, refSelectedPartUnitStock,
        refLeadTime, refPricePartID, refsupplierUnitStock, refCumulativeStock, refCumulativeStockSuppliers
        , refpackagingID, refMongoTrnsID,
        refQuoteUnitQty, refQuoteQtyPriceEach, refquoteQtyEach, refSelectedPartQtyStock, refsupplierQtyStcok) {
        var obj = {
          id: id,
          refQuoteUnitPriceEach: refQuoteUnitPriceEach,
          refsupplierID: refsupplierID,
          refPriceselectionMode: refPriceselectionMode,
          refSelectedPartUnitStock: refSelectedPartUnitStock,
          refLeadTime: refLeadTime,
          refPricePartID: refPricePartID,
          refsupplierUnitStock: refsupplierUnitStock,
          refCumulativeStock: refCumulativeStock,
          refCumulativeStockSuppliers: refCumulativeStockSuppliers,
          refpackagingID: refpackagingID,
          refMongoTrnsID: refMongoTrnsID,
          refQuoteUnitQty: refQuoteUnitQty,
          refQuoteQtyPriceEach: refQuoteQtyPriceEach,
          refquoteQtyEach: refquoteQtyEach,
          refSelectedPartQtyStock: refSelectedPartQtyStock,
          refsupplierQtyStcok: refsupplierQtyStcok
        }
        vm.nonQuoteList.push(obj);
      }
      //get pricing list from mongo database.
      //get pricing list
      function getPricingList() {
        return PartCostingFactory.retrievePricingList().query({ rfqAssyID: vm.salesOrderDetail.SalesOrderDetailId, isPurchaseApi: true }).$promise.then((list) => {
          if (list && list.data) {
            return list.data.pricing;
          }
          return list.data;
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
      //get not quoted line items and price settings
      function getnonQuoteQtyItems() {
        return PartCostingFactory.getnonQuotedQty().query({ rfqAssyID: vm.salesOrderDetail.SalesOrderDetailId, isPurchaseApi: true }).$promise.then((list) => {
          if (list && list.data) {
            return list.data;
          }
          return list.data;
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

      function removeSocketListener() {
        socketConnectionService.removeListener(PRICING.EventName.PurchaseLineItemPricingStatus, pricingStatusListener);
        socketConnectionService.removeListener(PRICING.EventName.SaleSPricingStatus, pricingSalesStatusListener);
        socketConnectionService.removeListener(PRICING.EventName.Purchase_askDigikeyAuthentication, askForDigikeyAuthentication);
      }

      //on page destroy remove socket so it will not call duplicate
      $scope.$on('$destroy', function () {
        // Remove socket listeners
        removeSocketListener();
        updateAllPricingStatus();
        refeshGrid();
        stkUpdate();
        $mdDialog.hide(false, {
          closeAll: true
        });
      });

      // on disconnect socket
      socketConnectionService.on('disconnect', function () {
        removeSocketListener();
      });
    }
  }
})();
