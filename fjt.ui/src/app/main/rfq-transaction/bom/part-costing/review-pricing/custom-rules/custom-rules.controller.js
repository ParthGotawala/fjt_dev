(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .controller('CustomRulesController', CustomRulesController);

  /** @ngInject */
  function CustomRulesController($scope, $mdSidenav, $stateParams, $q, $timeout, CORE, RFQTRANSACTION, TRANSACTION,
    PartCostingFactory, DialogFactory, NotificationFactory, BaseService, socketConnectionService, PRICING, uiGridGroupingConstants, $mdDialog) {
    var vm = this;
    var rfqAssyID = $stateParams.id;
    let loginUser = BaseService.loginUser;
    vm.IsemptyState = false;
    vm.isExpand = true;
    vm.isPricing = true;
    vm.isPricingStatus = true;
    vm.isShowPricingStatus = true;
    vm.isHideDelete = true;
    vm.EmptyMesssage = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.PART_COSTING;
    vm.EmptyMesssageVerified = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.NOT_VERIFIED_BOM;
    var PartCosting = RFQTRANSACTION.PART_COSTING;
    vm.PRICING_STATUS = PRICING.PRICING_STATUS;
    vm.GRID_MENU_CONSTANT = angular.copy(RFQTRANSACTION.GRID_MENU_CONSTANT);
    vm.SelectedTabName = PRICING.REVIEW_PRICING_TABS.CustomRules.Name;
    vm.MfgLabelConstant = vm.LabelConstant.MFG;
    //paging details for grid
    vm.pagingInfo = {
      Page: CORE.UIGrid.Page(),
      SortColumns: [],
      SearchColumns: [],
      id: rfqAssyID
    };
    //set grid option for action with ui grid
    vm.gridOptions = {
      showColumnFooter: true,
      enableRowHeaderSelection: false,
      enableFullRowSelection: true,
      enableRowSelection: true,
      multiSelect: true,
      filterOptions: vm.pagingInfo.SearchColumns,
      enableCellEdit: false,
      enablePaging: false,
      enableCellEditOnFocus: false,
      exporterCsvFilename: 'Costing.csv',
      exporterMenuCsv: true,
      enableGrouping: false,
        enableColumnMenus: true,
        hideMultiDeleteButton: true
    };
    //set header for ui grid
    vm.sourceHeader = [
      {
        field: 'Action',
        cellClass: 'layout-align-center-center',
        headerCellTemplate: '<div class="ui-grid-cell-contents">Action <br> {{grid.appScope.$parent.vm.PricedPercentage?grid.appScope.$parent.vm.PricedPercentage.toFixed(2):0}}% Priced</div>',
        width: '160',
        cellTemplate: '<grid-action-view grid="grid" row="row"  style="\overflow: hidden;padding:5px;overflow: hidden; white-space: nowrap;\" class="height-grid ui-grid-cell-contents" ></grid-action-view>',
        enableFiltering: false,
        enableSorting: false,
        enableCellEdit: false,
        exporterSuppressExport: true,
        enableColumnMenus: false
      },
      {
        field: '#',
        width: '55',
        cellTemplate: '<div class="ui-grid-cell-contents"  ng-disabled="row.Entity.isdisable"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
        enableFiltering: false,
        enableSorting: false,
        enableCellEdit: false,
        allowCellFocus: false,
        enableColumnMenus: false
      },
      {
        field: 'lineID',
        displayName: 'Item',
        width: '55',
        cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
        enableFiltering: true,
        enableSorting: true,
        enableCellEdit: false,
        enableColumnMenus: false,
        allowCellFocus: false,

      },
      {
        field: 'description',
        displayName: 'Description',
        cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
        width: '100',
        enableCellEdit: false,
        enableFiltering: true,
        enableSorting: true,
        enableColumnMenus: false,
        allowCellFocus: false,
        visible: false
      },
      {
        field: 'mfgPN',
        displayName: vm.MfgLabelConstant.MFGPN,
        cellTemplate: '<alternative-component-details is-expand="grid.appScope.$parent.vm.isExpand" row-data="row.entity"></alternative-component-details>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
        enableCellEdit: false,
        enableFiltering: true,
        enableSorting: true,
        enableColumnMenus: false,
        allowCellFocus: false,
      },
      {
        field: 'qpa',
        displayName: 'QPA',
        cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        width: '55',
        enableCellEdit: false,
        enableFiltering: true,
        enableSorting: true,
        enableColumnMenus: false,
        allowCellFocus: false,
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
    ];

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

    // disable lineItem button
    let SetAutoPricingDisable = (objLineItem) => {
      let objPending = _.find(objLineItem.pricing, { 'status': vm.PRICING_STATUS.SendRequest });
      objLineItem.isDisabled = false;
      if (objPending) {
        objLineItem.isDisabled = true;
      }
    }

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
            reqObj.msg = objPricing.msg;
            item.pricing.push(reqObj);
          });
          SetAutoPricingDisable(item);
        }
        item.mfgComponents = item.component ? item.component.split(',') : "";
      });
      let anyLineDisable = _.find(consolidatemfg.data.consolidateParts, { 'isDisabled': true });
      if (anyLineDisable) {
        _.each(consolidatemfg.data.consolidateParts, (o) => { o.isDisabled = true });
        let objAssyPricing = {};
        objAssyPricing.status = vm.PRICING_STATUS.SendRequest;
        $scope.$emit(PRICING.EventName.UpdateStatus, objAssyPricing);
      }
    };
    //get list of consolidated part number rfq line items and shows with its pricing
    vm.loadData = () => {
      vm.sourceData = [];
      vm.cgBusyLoading = PartCostingFactory.retrieveCustomRulesLineItems(vm.pagingInfo).query().$promise.then((consolidatemfg) => {
        if (consolidatemfg && consolidatemfg.data && consolidatemfg.data.isReadyForPricing) {
          vm.bomnotVerified = false;
          bindGridData(consolidatemfg);
          vm.sourceData = consolidatemfg.data.consolidateParts;
          vm.turntimeList = consolidatemfg.data.qtyTurnTime;
          vm.rfqID = consolidatemfg.data.rfqID;
          vm.ConsolidateQuantity = consolidatemfg.data.quantitydetails;
          vm.quantityTotals = consolidatemfg.data.quantityTotals;
          vm.isSummaryComplete = consolidatemfg.data.isSummaryComplete;
          if (vm.sourceData.length > 0) {
            _.each(vm.sourceData, (item) => {
              item.customerID = consolidatemfg.data.customerID;
            })
            let partcostingKeys = Object.keys(vm.sourceData[0]);
            _.each(partcostingKeys, function (keys) {
              if (BaseService.checkForVisibleColumnInGrid(PartCosting, keys, vm.sourceHeader)
                && keys != PartCosting.RowID
                && keys != PartCosting.Sum10
                && keys != PartCosting.Agg10) {
                var obj = {
                  field: keys,
                  displayName: keys,
                  cellTemplate: '<div ng-if="row.entity.isPurchase" style="padding:5px;height: 100%;overflow: hidden; white-space: nowrap;\" class=\"height-grid ui-grid-cell-contents\">\
                                                        <a ng-if="!COL_FIELD" ng-click="grid.appScope.$parent.vm.getPricing(row.entity,' + keys + ',$event)">\
                                                            <md-icon style="float:left;color:rgb(0,150,136)" class="icon-square-inc-cash"><md-tooltip  md-direction="top">Pricing Available</md-tooltip></md-icon>\
                                                        </a>\
                                                        <selected-component-details ng-if="grid.appScope.$parent.vm.sourceData.length > 0 && COL_FIELD" row-data="row.entity" qty-details-list="grid.appScope.$parent.vm.ConsolidateQuantity" request-qty="' + keys + '" select-price="grid.appScope.$parent.vm.getPricing(rowData, requestQty, event)" selected-page-name="grid.appScope.$parent.vm.SelectedTabName" is-show="!grid.appScope.$parent.vm.isSummaryComplete">\
                                                    </div>\
                                                   <div ng-if="!row.entity.isPurchase" style="overflow: hidden;" class="ui-grid-cell-contents">\
                                                        <a>DNP</a>\
                                                        <md-tooltip  md-direction="top">\
                                                            Do Not Purchase Part\
                                                        </md-tooltip>\
                                                   </div>',
                  width: '450',
                  enableCellEdit: false,
                  allowCellFocus: false,
                  ColumnDataType: 'Percentage',
                  menuItems: [{
                    icon: vm.GRID_MENU_CONSTANT.CLEAR_ALL_PRICING.ICON,
                    title: vm.GRID_MENU_CONSTANT.CLEAR_ALL_PRICING.NAME,
                    action: function () {
                      vm.clearPrice(keys);
                    }
                  },
                  {
                    icon: vm.GRID_MENU_CONSTANT.CLEAR_SELECTIONS.ICON,
                    title: vm.GRID_MENU_CONSTANT.CLEAR_SELECTIONS.NAME,
                    action: function () {
                      vm.clearSelectionPrice(keys);
                    }
                  },
                  ],
                  footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer" >{{grid.appScope.$parent.vm.getFooterPrice(' + keys + ', col)}}</div>',
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
          var summary = true;
          var totalItems = _.filter(vm.sourceData, (item) => { return item.isPurchase == true });
          var totalPriced = [];
          if (vm.ConsolidateQuantity.length > 0) {
            _.each(totalItems, function (pricePercentage) {
              var Ispercentage = true;
              _.each(vm.ConsolidateQuantity, function (qtyPercentage) {
                if (!pricePercentage[qtyPercentage.requestQty]) {
                  Ispercentage = false;
                  return false;
                }
              })
              if (Ispercentage)
                totalPriced.push(pricePercentage);
            });
            vm.PricedPercentage = (totalPriced.length * 100 / totalItems.length);
            if (vm.PricedPercentage >= 100) {
              summary = false;
            }
          }
          $scope.$emit(RFQTRANSACTION.EVENT_NAME.ShowSummary, summary);
          vm.gridOptions.clearSelectedRows();

          $timeout(() => {
            if (vm.currentdata == 0) {
              $scope.$emit(PRICING.EventName.UpdateStatus, null);
            }
            vm.resetSourceGrid();
            //$timeout(() => {
            //    celledit();
            //}, true)
            if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount == vm.currentdata) {
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
            }
          });
        }
        else {
          vm.bomnotVerified = true;
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    //it will use for infinite scroll and concate data 
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = PartCostingFactory.retrieveCustomRulesLineItems(vm.pagingInfo).query().$promise.then((consolidatemfg) => {
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
    //get pricing open price selector popup
    vm.getPricing = (rowEntity, qty, event) => {
      if (vm.isSummaryComplete)
        return false;
      let objPart = _.find(vm.ConsolidateQuantity, { 'consolidateID': rowEntity.id, 'requestQty': qty });
      rowEntity.qty = qty;
      if (objPart) {
        rowEntity.supplier = objPart ? objPart.supplier : null;
        rowEntity.unitPrice = objPart ? objPart.unitPrice : null;
        rowEntity.rfqID = vm.rfqID;
        rowEntity.pricePercentage = vm.PricedPercentage;
        rowEntity.selectedPN = objPart ? objPart.selectedMpn : null;
        $mdSidenav('price-selector').open();
        $scope.$emit(RFQTRANSACTION.EVENT_NAME.OpenPriceSelector, rowEntity);

        $mdSidenav('price-selector').onClose(function () {
          $scope.$emit(RFQTRANSACTION.EVENT_NAME.ClosePriceSelector, false);
          vm.loadData();
        });
      }
    }

    //// show all supplier pricing with status
    //vm.showPricingStatus = (row, event) => {
    //    vm.showPopOver = true;
    //}

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
      dataObj.Quantity = vm.quantityTotals;
      dataObj.UpdatePricingStatus = null;
      dataObj.UpdatePricingStatus = vm.UpdatePricingStatus;
      dataObj.customprice = true;
      DialogFactory.dialogService(
        CORE.RFQ_TRANSACTION_BOM_PART_COSTING_MANAGEPRICE_MODAL_CONTROLLER,
        CORE.RFQ_TRANSACTION_BOM_PART_COSTING_MANAGEPRICE_MODAL_VIEW,
        event,
        dataObj).then(() => {
        }, (data) => {
          if (data) {
            vm.loadData();
          }
        },
          (err) => {
            return BaseService.getErrorLog(err);
          });
    }

    // add auto pricing api wise to lineitem
    function addAutoPricingInLineItem(pricingObj, objLineItem) {
      let reqObj = {};
      reqObj.pricingApiName = pricingObj.pricingApiName;
      reqObj.consolidateID = pricingObj.id;
      reqObj.rfqAssyID = pricingObj.rfqAssyID;
      reqObj.status = pricingObj.status;
      reqObj.msg = pricingObj.msg;
      objLineItem.pricing.push(reqObj);
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
                'pricingApiName': obj.Name
              });
              if (objPricing) {
                objPricing.status = vm.PRICING_STATUS.SendRequest;
              } else {
                item.pricingApiName = obj.Name;
                addAutoPricingInLineItem(item, objLineItem);
              }
            }
            else {
              objLineItem.pricing = [];
              item.pricingApiName = obj.Name;
              addAutoPricingInLineItem(item, objLineItem);
            }
          });
          SetAutoPricingDisable(objLineItem);
        }
      });
      let objAssyPricing = {};
      objAssyPricing.status = vm.PRICING_STATUS.SendRequest;
      // update ui for loader in bom page
      $scope.$emit(PRICING.EventName.UpdateStatus, objAssyPricing);
    }

    // call when api reposnse come and update status
    vm.UpdatePricingResponseStatus = (pricingObj) => {
      if (pricingObj.consolidateID) {
        let objLineItem = _.find(vm.sourceData, { 'id': pricingObj.consolidateID });
        // check with grid data line item exists or not
        if (objLineItem) {
          if (objLineItem.pricing && objLineItem.pricing.length > 0) {
            let objPricing = _.find(objLineItem.pricing, {
              'consolidateID': pricingObj.consolidateID,
              'pricingApiName': pricingObj.pricingApiName
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
          SetAutoPricingDisable(objLineItem);
        }
      }
    }

    // method to update pricing status loader
    let updateAllPricingStatus = $scope.$on(PRICING.EventName.UpdateAllPricing, function (name, data) {
      if (vm.gridOptions.getSelectedRowsCount() > 0) {
        vm.getPricingApis(vm.gridOptions.gridApi.selection.getSelectedRows(), data, "multiple");
      }
      else {
        vm.getPricingApis(vm.sourceData, data, "multiple");
      }
    });

    // method to update pricing status loader
    let refeshGrid = $scope.$on('refeshGrid', function (name, data) {
      vm.loadData();
    });


    // [S] Socket Listeners
    function connectSocket() {
      socketConnectionService.on(PRICING.EventName.LineItemPricingStatus, pricingStatusListener);
      socketConnectionService.on(PRICING.EventName.AssemblyPricingStatus, pricingAssyStatusListener);
    }
    connectSocket();

    socketConnectionService.on('reconnect', () => {
      connectSocket();
    });
    function removeSocketListener() {
      socketConnectionService.removeListener(PRICING.EventName.LineItemPricingStatus, pricingStatusListener);
      socketConnectionService.removeListener(PRICING.EventName.AssemblyPricingStatus, pricingAssyStatusListener);
    }

    function pricingStatusListener(message) {
      if (message && message.userID == loginUser.userid) {
        $timeout(statusReceive(message));
      }
    }
    function pricingAssyStatusListener(message) {
      if (message && message.userID == loginUser.userid) {
        $timeout(statusAssyReceive(message));
      }
    }
    function statusReceive(message) {
      vm.UpdatePricingResponseStatus(message);
    }
    function statusAssyReceive(data) {
      $scope.$emit(PRICING.EventName.UpdateStatus, data);
      if (data.status != vm.PRICING_STATUS.SendRequest) {
        NotificationFactory.success(RFQTRANSACTION.PRICING.PRICING_DONE);
        vm.loadData();
      }
    }
    $scope.$on('$destroy', function () {
      // Remove socket listeners
      removeSocketListener();
      updateAllPricingStatus();
      refeshGrid();
      $mdDialog.hide(false, {
        closeAll: true
      });
    });

    // on disconnect socket.io
    socketConnectionService.on('disconnect', function () {
      removeSocketListener();
    });

    //get total sum of all quantity
    vm.getFooterPrice = (key, col) => {
      let objTotal = _.find(vm.quantityTotals, function (item) { return item.requestQty == key });
      let displayText = "";
      if (objTotal) {
        if (objTotal.TotalUnitPrice) {
          displayText = "Unit: $ " + (objTotal.TotalUnitPrice.toFixed(6));
        }
        if (objTotal.TotalAssemblyPrice) {
          if (displayText) {
            displayText += " | ";
          }
          displayText += "Assy: $ " + (objTotal.TotalAssemblyPrice.toFixed(6));
        }
        if (objTotal.TotalExtendedPrice) {
          if (displayText) {
            displayText += " | ";
          }
          displayText += "Extd.: $ " + (objTotal.TotalExtendedPrice.toFixed(6));
        }
      }
      return displayText;
    }


    //receive event from bom for summary save 
    $scope.$on(PRICING.EventName.SaveSummary, (name, data) => {
      vm.submitPricing();
    });
    //call function for save summary
    let savePartCostingPrice = () => {
      var summaryList = [];
      _.each(vm.turntimeList, (item) => {
        var price = 0;
        var excessQtyPrice = 0;
        _.each(vm.ConsolidateQuantity, (consolidate) => {
          if (consolidate && consolidate.unitPrice) {
            price = price + (consolidate.unitPrice * consolidate.qpa);
            if ((consolidate.requestQty * consolidate.qpa) < consolidate.min) {
              var excessQty = (consolidate.min - (consolidate.requestQty * consolidate.qpa))
              excessQtyPrice = excessQtyPrice + (excessQty * consolidate.unitPrice);
            }
          }
        });
        var objSum = _.sumBy(vm.sourceData, (sumall) => { return sumall[item.requestQty]; });
        var summary = {
          rfqAssyID: rfqAssyID,
          rfqAssyQtyID: item.rfqAssyQtyID,
          rfqAssyQtyTurnTimeID: item.qtyTimeID,
          requestedQty: item.requestQty,
          turnTime: item.turnTime,
          timeType: item.turnType,
          unitPrice: price,
          materialCost: objSum,
          shippingCost: null,
          total: objSum,
          excessQtyTotalPrice: excessQtyPrice,
          commissionProfitPercentage: null,
          commissionProfitDollar: null,
          commissionProfitBase: null,
          materialProfitPercentage: null,
          materialProfitDollar: null,
          materialMargin: null
        }
        summaryList.push(summary);
      }
      );
      vm.cgBusyLoading = PartCostingFactory.saveSummaryQuote().query({ summaryQuoteObj: summaryList }).$promise.then((response) => {

      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    //submit part costing detail for summary tab
    vm.submitPricing = () => {
      let obj = {
        title: CORE.MESSAGE_CONSTANT.PUBLISHTEMPLATE_CONFIRM,
        textContent: RFQTRANSACTION.PRICING.MATERIAL_COSTING_SUBMIT_CONFIRM,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.confirmDiolog(obj).then((yes) => {
        if (yes)
          savePartCostingPrice();
      }, (cancel) => {
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    //clear pricing for selection quantity 
    vm.clearSelectionPrice = (qty) => {
      let obj = {
        title: CORE.MESSAGE_CONSTANT.PUBLISHTEMPLATE_CONFIRM,
        textContent: stringFormat(RFQTRANSACTION.PRICING.COSTING_CLEAR, qty),
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.confirmDiolog(obj).then((yes) => {
        if (yes) {
          var objqty = _.find(vm.ConsolidateQuantity, function (item) { return item.requestQty == qty });
          var objPrice = {
            rfqAssyID: parseInt(rfqAssyID)
          };
          if (objqty) {
            objPrice.qtyID = objqty.qtyID
            vm.cgBusyLoading = PartCostingFactory.cleanSelectionPrice().query({ priceClean: objPrice }).$promise.then((response) => {
              vm.loadData();
            });
          }
        }
      }, (cancel) => {
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    //clear pricing for all quantity
    vm.clearPrice = (qty) => {
      let obj = {
        title: CORE.MESSAGE_CONSTANT.PUBLISHTEMPLATE_CONFIRM,
        textContent: stringFormat(RFQTRANSACTION.PRICING.COSTING_CLEAR, qty),
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.confirmDiolog(obj).then((yes) => {
        if (yes) {
          var objPrice = {
            rfqAssyID: parseInt(rfqAssyID)
          };
          vm.cgBusyLoading = PartCostingFactory.cleanPrice().query({ priceClean: objPrice }).$promise.then((response) => {
            vm.loadData();
          });
        }
      }, (cancel) => {
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
  }
})();
