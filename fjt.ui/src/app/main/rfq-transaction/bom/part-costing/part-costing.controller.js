(function () {
  'use strict';

  angular.module('app.rfqtransaction')
    .controller('PartCostingController', PartCostingController);

  /* @ngInject */
  function PartCostingController($scope, $state, $mdSidenav, $stateParams, $q, $timeout, CORE, RFQTRANSACTION, $filter,
    PartCostingFactory, DialogFactory, NotificationFactory, $mdDialog, BaseService, socketConnectionService, PRICING, BOMFactory, ImportExportFactory, ManageMFGCodePopupFactory, SalesOrderFactory, MasterFactory) {
    var vm = this;
    var rfqAssyID = $stateParams.id;
    if ($scope.$parent && $scope.$parent.vm) {
      $scope.$parent.vm.activeTab = 2;
    }
    vm.path = stringFormat('{0}{1}', WebsiteBaseUrl, RFQTRANSACTION.PRICING_UPDATE_STOCK);
    vm.waringCommentIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.WARNING_COMMENT_ICON);
    vm.PricingFilters = _.clone(RFQTRANSACTION.PRICING_FILTER);
    vm.PriceType = RFQTRANSACTION.PRICE_FILTER.GetRFQConsolidateRfqLineItem.ID;
    vm.leadTime = RFQTRANSACTION.PRICE_FILTER.GetLeadTimeRiskLineItems.ID;
    vm.leadtImeFilter = RFQTRANSACTION.LEADTIME_FILTER;
    vm.lead = RFQTRANSACTION.PRICING_LEADTIME;
    const groupConcatSeparatorValue = _groupConcatSeparatorValue;
    vm.isExternalApi = true;
    vm.IsemptyState = false;
    vm.isCleanPrice = true;
    vm.Option = RFQTRANSACTION.LEADTIME_FILTER[1].ID;
    $scope.$parent.$parent.$parent.vm.title = RFQTRANSACTION.RFQ_PART_COSTING_LABEL;
    $scope.$parent.$parent.$parent.vm.activeTab = 2;
    $scope.$parent.$parent.$parent.vm.packaging = true;
    vm.isExpand = true;
    vm.isPricing = true;
    vm.isPricingStatus = true;
    vm.isShowPricingStatus = true;
    vm.isHideDelete = true;
    vm.DefaultDateFormat = _dateTimeDisplayFormat;
    vm.EmptyMesssage = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.PART_COSTING;
    vm.EmptyMesssageVerified = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.NOT_VERIFIED_BOM;
    const PartCosting = RFQTRANSACTION.PART_COSTING;
    vm.PRICING_STATUS = PRICING.PRICING_STATUS;
    vm.GRID_MENU_CONSTANT = angular.copy(RFQTRANSACTION.GRID_MENU_CONSTANT);
    vm.SelectedTabName = PRICING.REVIEW_PRICING_TABS.PartCosting.Name;
    vm.isClearPriceShow = true;
    vm.selectedFilterName = RFQTRANSACTION.PRICE_FILTER.GetRFQConsolidateRfqLineItem;
    vm.isSuggestedParts = true;
    vm.LabelConstant = CORE.LabelConstant;
    vm.loginUser = BaseService.loginUser;
    vm.loginUserId = vm.loginUser.userid;
    vm.disableDraft = true;
    vm.disabledSubmit = false;

    //paging details for grid
    vm.pagingInfo = {
      Page: 0,
      SortColumns: [['lineID', 'ASC']],
      SearchColumns: [],
      id: rfqAssyID,
      spName: RFQTRANSACTION.PRICE_FILTER.GetRFQConsolidateRfqLineItem.SpName,
      FilterID: RFQTRANSACTION.PRICE_FILTER.GetRFQConsolidateRfqLineItem.ID,
      ppackageing: true
    };
    getAssyDetails();
    //get assy details
    function getAssyDetails() {
      return BOMFactory.getAssyDetails().query({ id: rfqAssyID }).$promise.then((response) => {
        if (response && response.data) {
          const rfqAssy = response.data;
          vm.bom = {
            assemblyDescription: rfqAssy.componentAssembly ? rfqAssy.componentAssembly.mfgPNDescription : '',
            assemblyNumber: rfqAssy.componentAssembly ? rfqAssy.componentAssembly.mfgPN : '',
            assemblyRev: rfqAssy.componentAssembly ? rfqAssy.componentAssembly.rev : '',
            rfqID: rfqAssy.rfqrefID,
            partID: rfqAssy.partID,
            rohsIcon: rfqAssy.componentAssembly ? rfqAssy.componentAssembly.rfq_rohsmst ? rfqAssy.componentAssembly.rfq_rohsmst.rohsIcon : null : null,
            PIDCode: rfqAssy.componentAssembly ? rfqAssy.componentAssembly.PIDCode : '',
            RoHS: rfqAssy.componentAssembly ? rfqAssy.componentAssembly.rfq_rohsmst ? rfqAssy.componentAssembly.rfq_rohsmst.name : null : null,
            customerID: rfqAssy.rfqForms.customerId,
            isActivityStart: rfqAssy.isActivityStart,
            activityStartBy: rfqAssy.activityStartBy
          };
          if (response.data.jobType) {
            vm.bom.isMaterialAllow = response.data.jobType.isMaterialCosting;
          }
        }
      });
    }
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
      exporterCsvFilename: 'Part Costing.csv',
      exporterMenuCsv: true,
      enableGrouping: false,
      enableColumnMenus: true,
      hideMultiDeleteButton: true
    };
    //set header for ui grid
    const sourceHeader = [{
      field: 'Action',
      cellClass: 'layout-align-center-center',
      headerCellTemplate: '<div class="ui-grid-cell-contents">Action <br/><span style="color:black" ng-if="grid.appScope.$parent.vm.selectedFilterName.ID==1">Priced items {{grid.appScope.$parent.vm.PricedPercentage}}</span></div>',
      //displayName: 'Action',
      width: '180',
      cellTemplate: '<grid-action-view grid="grid" ng-click="$event.stopPropagation();" row="row"  style="overflow: hidden;padding:5px !important;overflow: hidden; white-space: nowrap;" class="height-grid ui-grid-cell-contents" ></grid-action-view>',
      enableFiltering: false,
      enableSorting: false,
      enableCellEdit: false,
      exporterSuppressExport: true,
      enableColumnMenus: false,
      enableRowSelection: false,
      enableFullRowSelection: false,
      multiSelect: false,
      maxWidth: '250'
    }, {
      field: '#',
      width: '55',
      cellTemplate: '<div class="ui-grid-cell-contents"  ng-disabled="row.Entity.isdisable"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
      enableFiltering: false,
      enableSorting: false,
      enableCellEdit: false,
      allowCellFocus: false,
      enableColumnMenus: false,
      maxWidth: '60'
    }, {
      field: 'CPNPID',
      displayName: vm.LabelConstant.MFG.CPN,
      width: '200',
      cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents"><span ng-class="{\'text-line-through\':(row.entity.restrictCPNUseInBOMStep||!row.entity.restrictCPNUsePermanentlyStep||!row.entity.restrictCPNUseWithPermissionStep)}">{{COL_FIELD}}</span></div>',
      enableFiltering: true,
      enableSorting: true,
      enableCellEdit: false,
      enableColumnMenus: false,
      allowCellFocus: false,
      maxWidth: '350'

    }, {
      field: 'lineID',
      displayName: 'Item(Line#)',
      width: '70',
      cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
      enableFiltering: true,
      enableSorting: true,
      enableCellEdit: false,
      enableColumnMenus: false,
      allowCellFocus: false,
      maxWidth: '120'

    }, {
      field: 'consolidatedpartlineID',
      displayName: 'Consolidated Item Detail',
      cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents-break" ng-repeat="item in row.entity.consolidatedpartlineIDPart">{{item?item.substring(0,item.lastIndexOf("|")):""}}</div>',
      width: '300',
      enableCellEdit: false,
      maxWidth: '500',
      enableFiltering: true,
      enableSorting: true,
      enableColumnMenus: false,
      allowCellFocus: false,
      visible: false
    }, {
      field: 'consolidateRestrictPartDetail',
      displayName: 'Consolidated Part Restriction Details',
      cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.consolidateRestrictPartDetail" ng-click="grid.appScope.$parent.vm.getrestrictedPartDetails(row.entity, $event)"> \
                                   View \
                            <md-tooltip>View Consolidated Restricted Part Detail</md-tooltip>\
                            </md-button>',
      width: '130',
      enableCellEdit: false,
      maxWidth: '130',
      enableFiltering: false,
      enableSorting: false,
      enableColumnMenus: false,
      allowCellFocus: false,
      visible: false
    }, {
      field: 'refDesig',
      displayName: vm.LabelConstant.BOM.REF_DES,
      cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
      width: '150',
      enableCellEdit: false,
      maxWidth: '1000',
      enableFiltering: true,
      enableSorting: true,
      enableColumnMenus: false,
      allowCellFocus: false,
      visible: false
    }, {
      field: 'unitName',
      displayName: 'UOM',
      cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
      width: '70',
      enableCellEdit: false,
      maxWidth: '90',
      enableFiltering: true,
      enableSorting: true,
      enableColumnMenus: false,
      allowCellFocus: false
    }, {
      field: 'componentExcel',
      displayName: vm.LabelConstant.MFG.PID,
      cellTemplate: '<alternative-component-details is-expand="grid.appScope.$parent.vm.isExpand" ng-click="$event.stopPropagation();" row-data="row.entity"></alternative-component-details>',
      width: '400',
      minWidth: '400',
      enableCellEdit: false,
      maxWidth: '600',
      enableFiltering: true,
      enableSorting: true,
      enableColumnMenus: false,
      allowCellFocus: false
    }, {
      field: 'qpa',
      displayName: 'Consolidated QPA',
      cellTemplate: '<a class="ui-grid-cell-contents-break text-left cursor-pointer underline" ng-class="{\'text-decoration-red\':row.entity.isqpaMismatch}"  ng-click="grid.appScope.$parent.vm.getQuoteDetails(row.entity,$event)"><span ng-class="{\'red\':row.entity.isqpaMismatch}">{{COL_FIELD}}</span><md-tooltip>View Consolidated QPA</md-tooltip></div>',
      width: '120',
      maxWidth: '120',
      enableCellEdit: false,
      enableFiltering: true,
      enableSorting: true,
      enableColumnMenus: false,
      allowCellFocus: false

    }, {
      field: 'numOfPosition',
      displayName: vm.LabelConstant.MFG.noOfPosition,
      cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
      width: '65',
      maxWidth: '90',
      enableCellEdit: false,
      enableFiltering: true,
      enableSorting: true,
      allowCellFocus: false
    }, {
      field: 'partTypeName',
      displayName: 'Functional Type',
      width: '150',
      cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
      enableCellEdit: false,
      allowCellFocus: false,
      visible: false,
      isMenuItemDisabled: true,
      maxWidth: '200'
    }, {
      field: 'name',
      displayName: 'Mounting Type',
      width: '150',
      cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
      enableCellEdit: false,
      allowCellFocus: false,
      visible: false,
      isMenuItemDisabled: true,
      maxWidth: '180'
    }, {
      field: 'PartStatus',
      displayName: 'Status Description',
      width: '200',
      cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >\
                                            <a>\
                                                <div ng-bind-html="grid.appScope.$parent.vm.getPartDetails(row.entity)"></div>\
                                            </a>\
                                        </div>',
      enableCellEdit: false,
      allowCellFocus: false,
      visible: false,
      isMenuItemDisabled: true,
      maxWidth: '300'
    }, {
      field: 'LTBDate',
      displayName: vm.LabelConstant.MFG.LtbDate,
      width: '150',
      cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
      visible: false,
      isMenuItemDisabled: true,
      enableCellEdit: false,
      allowCellFocus: false,
      maxWidth: '200'
    }, {
      field: 'EOLDate',
      displayName: vm.LabelConstant.MFG.EolDate,
      width: '150',
      cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
      visible: false,
      isMenuItemDisabled: true,
      enableCellEdit: false,
      allowCellFocus: false,
      maxWidth: '200'
    }];
    vm.sourceHeader = _.clone(sourceHeader);
    // show pricing status
    vm.showPricingStatus = (row, data) => {
      if (data.status === vm.PRICING_STATUS.NotPricing) {
        const model = {
          title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
          textContent: data.msg,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT,
          multiple: true
        };
        DialogFactory.alertDialog(model);
        return false;
      }
    };

    // disable lineItem button
    const SetAutoPricingDisable = (objLineItem) => {
      const objPending = _.find(objLineItem.pricing, { 'status': vm.PRICING_STATUS.SendRequest });
      if (objPending) {
        objLineItem.isDisabled = true;
      }
      else {
        objLineItem.isDisabled = false;
      }
    };

    const bindGridData = (consolidatemfg) => {
      _.each(consolidatemfg.data.consolidateParts, (item) => {
        item.customerID = consolidatemfg.data.customerID;
        item.ConsolidateQuantity = _.filter(consolidatemfg.data.quantitydetails, (consolidate) => consolidate.consolidateID == item.id);
        item.lineItemCustoms = consolidatemfg.data.lineItemCustoms;
        item.pricingList = _.filter(consolidatemfg.data.pricingList, (priceList) => priceList.ConsolidateID == item.id);
        item.autoPricingStatus = _.filter(consolidatemfg.data.autoPricingStatus, (pitem) => pitem.consolidateID == item.id && pitem.status);
        if (_.find(consolidatemfg.data.lineItemCustoms, (cust) => cust.id == item.id && cust.custom)) {
          item.isCustom = true;
        }
        const result = _.find(item.pricing, (apistatus) => apistatus.status == 0);
        if (result) {
          vm.isClearPriceShow = false;
        }
        const filterByLineItemArr = _.filter(consolidatemfg.data.autoPricingStatus, { 'consolidateID': item.id });
        if (filterByLineItemArr.length > 0) {
          item.pricing = [];
          _.each(filterByLineItemArr, (objPricing) => {
            const reqObj = {};
            reqObj.pricingApiName = objPricing.pricingApiName;
            reqObj.pricingSupplierID = objPricing.pricingSupplierID;
            reqObj.consolidateID = objPricing.consolidateID;
            reqObj.rfqAssyID = objPricing.rfqAssyID;
            reqObj.status = objPricing.status;
            reqObj.msg = objPricing.msg;
            item.pricing.push(reqObj);
          });
          SetAutoPricingDisable(item);
        }
        item.mfgComponents = item.mfgPN ? item.mfgPN.split(groupConcatSeparatorValue) : '';
        if (item.mfgComponents && item.mfgComponents.length > 0) {
          const componentPIDDet = [];
          _.each(item.mfgComponents, (mfgpndet) => {
            if (_.includes(mfgpndet, '@@@')) {
              const mfgPNValue = mfgpndet ? mfgpndet.split('@@@') : '';
              const componentPID = mfgPNValue[0].split('***').join(',');
              if (componentPID) {
                componentPIDDet.push(componentPID.split('..').join(','));
              }
            }
          });
          if (componentPIDDet.length > 0) {
            item.componentExcel = componentPIDDet.join(',');
          }
        }
        if (item.consolidatedpartlineID) {
          item.consolidatedpartlineID = item.consolidatedpartlineID.replace(/{/g, '').replace(/}/g, '');
          item.consolidatedpartlineIDPart = item.consolidatedpartlineID ? item.consolidatedpartlineID.split(groupConcatSeparatorValue) : '';
        }
        if (item.consolidateRestrictPartDetail) {
          item.consolidateRestrictPartDetail = item.consolidateRestrictPartDetail.replace(/{/g, '').replace(/}/g, '');
          item.consolidateRestrictPartDetailPart = item.consolidateRestrictPartDetail ? item.consolidateRestrictPartDetail.split(groupConcatSeparatorValue) : '';
        }
      });
      const anyLineDisable = _.find(consolidatemfg.data.consolidateParts, { 'isDisabled': true });
      if (anyLineDisable) {
        _.each(consolidatemfg.data.consolidateParts, (o) => {
          o.isDisabled = true;
        });
        if (!vm.isClearPriceShow) {
          const objAssyPricing = { status: vm.PRICING_STATUS.SendRequest };
          $scope.$emit(PRICING.EventName.UpdateStatus, objAssyPricing);
          vm.assyLoading = true;
        }
      }
    };
    const sourceData = angular.copy(vm.sourceHeader);

    //get list of consolidated part number rfq line items and shows with its pricing
    vm.loadData = () => {
      _.each(vm.pagingInfo.SearchColumns, (searchCol) => {
        var obj = _.find(vm.quantityTotals, (item) => item.requestQty === searchCol.ColumnName);
        if (obj) {
          searchCol.ColumnDataType = vm.pagingInfo.FilterID === RFQTRANSACTION.PRICE_FILTER.GetRFQCustomRulesLineItems.ID && vm.pagingInfo.SearchColumns.length > 0 ? 'Percentage' : 'Grater';
        }
      });
      vm.cgBusyLoading = PartCostingFactory.consolidatepart(vm.pagingInfo).query().$promise.then((consolidatemfg) => {
        if (consolidatemfg && consolidatemfg.data && consolidatemfg.data.isReadyForPricing) {
          vm.bomnotVerified = false;
          vm.isSummaryComplete = consolidatemfg.data.isSummaryComplete;
          bindGridData(consolidatemfg);
          vm.sourceData = consolidatemfg.data.consolidateParts;
          vm.turntimeList = consolidatemfg.data.qtyTurnTime;
          vm.rfqID = consolidatemfg.data.rfqID;
          vm.restrictedParts = consolidatemfg.data.restrictPartsAssy;
          vm.ConsolidateQuantity = consolidatemfg.data.quantitydetails;
          vm.quantityTotals = consolidatemfg.data.quantityTotals;
          vm.custompartDetails = consolidatemfg.data.custompartDetails;
          vm.totalSourceDataCount = consolidatemfg.data.Count;
          if (vm.totalSourceDataCount === 0) {
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
          //var summary = true;
          const totalItems = _.filter(vm.sourceData, (item) => item.isPurchase);
          const totalPriced = [];
          if (vm.ConsolidateQuantity.length > 0) {
            _.each(totalItems, (pricePercentage) => {
              var Ispercentage = true;
              _.each(vm.ConsolidateQuantity, (qtyPercentage) => {
                if (!pricePercentage[qtyPercentage.requestQty] && !pricePercentage[qtyPercentage.priceGroupName]) {
                  Ispercentage = false;
                  return false;
                }
              });
              if (Ispercentage) {
                totalPriced.push(pricePercentage);
              }
            });
            vm.PricedPercentage = stringFormat('{0}/{1}', totalPriced.length, totalItems.length); //(totalPriced.length * 100 / totalItems.length);
            vm.unQuotedPrice = false;
            //if (totalPriced.length > 0 || totalItems.length == 0 || BaseService.isChangePriceSelector) {
            //  summary = false;
            //}
            if (totalPriced.length !== totalItems.length) {
              vm.unQuotedPrice = true;
            }
          }
          vm.isShowSummary = false;
          vm.noParts = totalItems.length > 0 ? false : true;
          //var partcostdata = {
          //  totalItems: totalItems,
          //  summary: false
          //}
          //$scope.$emit(RFQTRANSACTION.EVENT_NAME.ShowSummary, partcostdata);
          //enable only draft save button  on load
          //var data = {
          //  disableDraft: true,
          //  disabledSubmit: false
          //}
          //$scope.$emit(PRICING.EventName.Costing_Button_EnableDisable, data);
          //vm.disableDraft = true;
          //vm.disabledSubmit = false;
          vm.gridOptions.clearSelectedRows();
          if (vm.sourceData.length > 0) {//&& (pageinfo || vm.pagingInfo.FilterID == RFQTRANSACTION.PRICE_FILTER.GetRFQCustomRulesLineItems.ID)
            vm.partcostingKeys = Object.keys(vm.sourceData[0]).sort((a, b) => a - b);
            _.each(vm.partcostingKeys, (keys) => {
              if (BaseService.checkForVisibleColumnInGrid(PartCosting, keys, sourceData)) {
                const partQty = _.find(vm.sourceHeader, (pQty) => pQty.field == keys);
                if (partQty) {
                  const index = _.indexOf(vm.sourceHeader, partQty);
                  vm.sourceHeader.splice(index, 1);
                }
                const objQtyPrice = _.find(vm.sourceData, (sData) => sData.isPurchase == true && (sData[keys]));
                let keysQty = keys;
                let displayTemplate = '<div class="ui-grid-cell-contents"><span class="ui-grid-header-cell-label">' + keys + '</span></div>';
                const priceGroupDet = _.find(vm.quantityTotals, { priceGroupName: keys });
                let enableSorting = true;
                let actualQty = keys;
                let priceGrpId = null;
                if (priceGroupDet && priceGroupDet.rfqPriceGroupId != null) {
                  keysQty = priceGroupDet.requestQty;
                  displayTemplate = '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.$parent.vm.getPriceGRoupDetails(' + priceGroupDet.rfqPriceGroupId + ',$event)" class="text-underline cursor-pointer ui-grid-header-cell-label ui-grid-header-link-color">' + keys + '</a></div>';
                  enableSorting = false;
                  actualQty = priceGroupDet.qty;
                  priceGrpId = priceGroupDet.rfqPriceGroupId;
                }

                const obj = {
                  field: keys,
                  displayName: keys,
                  headerCellTemplate: displayTemplate,
                  enableSorting: enableSorting,
                  cellTemplate: '<div ng-if="row.entity.isPurchase && !row.entity.restrictCPNUseInBOMStep && row.entity.restrictCPNUsePermanentlyStep && row.entity.restrictCPNUseWithPermissionStep" ng-click="$event.stopPropagation();" style="padding:5px;height: 100%;overflow: hidden; white-space: nowrap;" class="height-grid ui-grid-cell-contents">\
                                                        <a ng-if="(!COL_FIELD && COL_FIELD!=0.000000)||COL_FIELD==0 || !grid.appScope.$parent.vm.bom.isMaterialAllow" class="cm-price-icon" ng-click="!grid.appScope.$parent.vm.bom.isMaterialAllow?\'\':grid.appScope.$parent.vm.getPricing(row.entity,' + keysQty + ',$event)">\
                                                            <md-icon style="float:left;" class="color-white" md-font-icon="icons-add-pricing"  ng-disabled="!grid.appScope.$parent.vm.bom.isMaterialAllow || !grid.appScope.$parent.vm.bom.isActivityStart || grid.appScope.$parent.vm.bom.activityStartBy != grid.appScope.$parent.vm.loginUserId" ng-class="{\'cursor-not-allow\':!grid.appScope.$parent.vm.bom.isMaterialAllow || !grid.appScope.$parent.vm.bom.isActivityStart || grid.appScope.$parent.vm.bom.activityStartBy != grid.appScope.$parent.vm.loginUserId}">\
                                                                <md-tooltip  md-direction="top" ng-if= "grid.appScope.$parent.vm.bom.isMaterialAllow && grid.appScope.$parent.vm.bom.isActivityStart && grid.appScope.$parent.vm.bom.activityStartBy == grid.appScope.$parent.vm.loginUserId"> {{ grid.appScope.$parent.vm.getMessage(row.entity, ' + keysQty + ') }}</md-tooltip >\
                                                                <md-tooltip  md-direction="top" ng-if= "!grid.appScope.$parent.vm.bom.isActivityStart || grid.appScope.$parent.vm.bom.activityStartBy != grid.appScope.$parent.vm.loginUserId"> You can start Costing process by clicking on Start Costing Activity button. </md-tooltip >\
                                                            </md-icon >\
                                                        </a>\
                                                        <selected-component-details ng-if="grid.appScope.$parent.vm.sourceData.length > 0 && (COL_FIELD!=0 && (COL_FIELD || COL_FIELD==0.000000)) && grid.appScope.$parent.vm.bom.isMaterialAllow" row-data="row.entity" total-assy-price="grid.appScope.$parent.vm.quantityTotals" selected-filter="grid.appScope.$parent.vm.selectedFilterName" total-line-items="grid.appScope.$parent.vm.sourceData.length" qty-details-list="grid.appScope.$parent.vm.ConsolidateQuantity" request-qty=' + keysQty + ' consolidated-qty=' + actualQty + ' price-group-id=' + priceGrpId + ' select-price="grid.appScope.$parent.vm.getPricing(rowData, requestQty, event)" selected-page-name="grid.appScope.$parent.vm.SelectedTabName" is-show="!grid.appScope.$parent.vm.isSummaryComplete && grid.appScope.$parent.vm.bom.isActivityStart && grid.appScope.$parent.vm.bom.activityStartBy == grid.appScope.$parent.vm.loginUserId">\
                                                    </div>\
                                                   <div ng-if="!row.entity.isPurchase || !grid.appScope.$parent.vm.bom.isMaterialAllow" ng-click="$event.stopPropagation();" style="overflow: hidden;" class="ui-grid-cell-contents">\
                                                        <span ng-if="grid.appScope.$parent.vm.bom.isMaterialAllow" style="color: rgb(3,155,229);">DNP<md-tooltip  md-direction="top">\
                                                            Do Not Purchase Part\
                                                        </md-tooltip></span>\
                                                   </div>\
                                                   <div ng-if="(row.entity.restrictCPNUseInBOMStep || !row.entity.restrictCPNUsePermanentlyStep || !row.entity.restrictCPNUseWithPermissionStep) && row.entity.isPurchase" ng-click="$event.stopPropagation();" style="overflow: hidden;" class="ui-grid-cell-contents">\
                                                        <span style="color: rgb(3,155,229);">Restricted CPN (Component)</span>\
                                                   </div>',
                  width: !objQtyPrice ? '150' : '1000',
                  enableCellEdit: false,
                  maxWidth: !objQtyPrice ? '350' : '1200',
                  allowCellFocus: false,
                  footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer" ng-if="grid.appScope.$parent.vm.bom.isMaterialAllow"><span> {{grid.appScope.$parent.vm.getFooterPrice(' + keysQty + ', col)}} \
                                          <md-tooltip md-direction="left" class="tooltip-height-auto" ng-bind-html="grid.appScope.$parent.vm.getFootertooltip(' + keysQty + ', col)" ></md-tooltip></span></div>',
                  //< md - tooltip md-direction="left" class="tooltip-height-auto" ng - bind - html="grid.appScope.$parent.vm.getFootertooltip(' + keys + ', col)" ></md - tooltip > </span >  </div > ',
                  menuItems: [
                    {
                      icon: vm.GRID_MENU_CONSTANT.CLEAR_SELECTIONS.ICON,
                      title: vm.GRID_MENU_CONSTANT.CLEAR_SELECTIONS.NAME,
                      action: function () {
                        vm.clearSelectionPrice(keys);
                      },
                      shown: function () {
                        return (vm.isClearPriceShow && !vm.isSummaryComplete);
                      }
                    }
                  ]
                };
                vm.sourceHeader.push(obj);
              }
            });
          }
          //<a tooltip-placement="left" tooltip-popup-delay="500" tooltip-append-to-body="true" uib-tooltip="Pricing Available  " tooltip-class="customClass" qty-id="20184" line-item-id="380207" class="ui-grid-cell-contents  "><i class="icon-square-inc pricing padding6px" style=""></i>  </a>
          $timeout(() => {
            if (vm.currentdata == 0) {
              vm.assyLoading = false;
              vm.disabledSubmit = true;
              $scope.$emit(PRICING.EventName.UpdateStatus, null);
            }
            if (RFQTRANSACTION.PRICE_FILTER.GetRFQMaterialAtRiskLineItems.ID == vm.selectedFilterName.ID) {
              vm.sourceHeader[11].visible = true;
              vm.sourceHeader[12].visible = true;
              vm.sourceHeader[13].visible = true;
              vm.sourceHeader[14].visible = true;
              vm.sourceHeader[15].visible = true;
              vm.sourceHeader[11].isMenuItemDisabled = false;
              vm.sourceHeader[12].isMenuItemDisabled = false;
              vm.sourceHeader[13].isMenuItemDisabled = false;
              vm.sourceHeader[14].isMenuItemDisabled = false;
              vm.sourceHeader[15].isMenuItemDisabled = false;
            }
            else {
              vm.sourceHeader[10].visible = false;
              vm.sourceHeader[11].visible = false;
              vm.sourceHeader[12].visible = false;
              vm.sourceHeader[13].visible = false;
              vm.sourceHeader[14].visible = false;
              vm.sourceHeader[15].visible = false;
              vm.sourceHeader[11].isMenuItemDisabled = true;
              vm.sourceHeader[12].isMenuItemDisabled = true;
              vm.sourceHeader[13].isMenuItemDisabled = true;
              vm.sourceHeader[14].isMenuItemDisabled = true;
              vm.sourceHeader[15].isMenuItemDisabled = true;
            }
            vm.resetSourceGrid();
            if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
            }
          });
        }
        else {
          vm.bomnotVerified = true;
        }
        if (BOMFactory.isqtyUpdate) {
          BOMFactory.isqtyUpdate = false;
          recalculatePriceItems(true);
        }
        if (vm.isClearPriceShow) {
          getTotalCount();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    //get all nmfg code list
    const getMfgSearch = () => ManageMFGCodePopupFactory.getMfgcodeList().query().$promise.then((mfgcodes) => {
      vm.mfgCodeList = _.filter(mfgcodes.data, (item) => item.mfgType === 'MFG');
      vm.supplierList = mfgcodes.data;
    }).catch((error) => BaseService.getErrorLog(error));

    //get Part Status
    vm.getPartDetails = (enitity) => {
      let strDetails = '';
      if (enitity.PartStatus) {
        strDetails = '<span class="quantityDetails"><span class="label-header">Part Status:</span> ' + enitity.PartStatus + '</span>';
      }
      if (enitity.LTBDate) {
        strDetails += '</br></br><span class="quantityDetails"><span class="label-header">LTB Date</span> : ' + $filter('date')(enitity.LTBDate, _dateDisplayFormat) + '</span></br>';
      }
      if (enitity.EOLDate) {
        strDetails += '</br></br><span class="quantityDetails"><span class="label-header">EOL Date</span> : ' + $filter('date')(enitity.EOLDate, _dateDisplayFormat) + '</span></br>';
      }
      return strDetails;
    };
    getMfgSearch();
    //get message for prices
    vm.getMessage = (rowEntity, qty) => {
      var objMessage = _.find(vm.ConsolidateQuantity, (consolidate) => consolidate.requestQty == qty && consolidate.consolidateID == rowEntity.id);
      if (objMessage && objMessage.pricenotselectreason) {
        return objMessage.pricenotselectreason;
      } else {
        return RFQTRANSACTION.PART_COSTING.Review;
      }
    };
    //get alternate part number list
    function getLineItemParts() {
      PartCostingFactory.getAssyIDAlternatePartList().query({ rfqAssyID: rfqAssyID }).$promise.then((lineitems) => {
        vm.partNumberList = lineitems.data.partList;
      }).catch((error) => BaseService.getErrorLog(error));
    }
    //show  consolidated QPA
    vm.getQuoteDetails = (row, ev) => {
      const obj = {
        consolidatedpartlineID: row.consolidatedpartlineIDPart,
        qpa: row.qpa
      };
      DialogFactory.dialogService(
        RFQTRANSACTION.CONSOLIDATED_QPA_POPUP_CONTROLLER,
        RFQTRANSACTION.CONSOLIDATED_QPA_POPUP_VIEW,
        ev,
        obj).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };

    // To open Display Restricted part detail pop up
    vm.getrestrictedPartDetails = (row, ev) => {
      const obj = {
        consolidateRestrictPartDetail: row.consolidateRestrictPartDetailPart,
        CPNPID: row.CPNPID,
        custPNID: row.custPNID,
        restrictCPNUseInBOMStep: row.restrictCPNUseInBOMStep,
        restrictCPNUsePermanentlyStep: row.restrictCPNUsePermanentlyStep,
        restrictCPNUseWithPermissionStep: row.restrictCPNUseWithPermissionStep,
        cpncustAssyPN: row.cpncustAssyPN,
        CPNRoHSName: row.CPNRoHSName,
        CPNRoHSIcon: row.CPNRoHSIcon
      };
      DialogFactory.dialogService(
        RFQTRANSACTION.CONSOLIDATED_RESTRICTED_PART_POPUP_CONTROLLER,
        RFQTRANSACTION.CONSOLIDATED_RESTRICTED_PART_POPUP_VIEW,
        ev,
        obj).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };
    getLineItemParts();
    //it will use for infinite scroll and concate data
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = PartCostingFactory.consolidatepart(vm.pagingInfo).query().$promise.then((consolidatemfg) => {
        if (consolidatemfg.data) {
          bindGridData(consolidatemfg);
          vm.sourceData = vm.sourceData.concat(consolidatemfg.data.consolidateParts);
          vm.currentdata = vm.sourceData.length;
          vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
          let summary = true;
          const totalItems = _.filter(vm.sourceData, (item) => item.isPurchase == true);
          const totalPriced = [];
          if (vm.ConsolidateQuantity.length > 0) {
            _.each(totalItems, (pricePercentage) => {
              var Ispercentage = true;
              _.each(vm.ConsolidateQuantity, (qtyPercentage) => {
                if (!pricePercentage[qtyPercentage.requestQty] && pricePercentage[qtyPercentage.requestQty] != 0) {
                  Ispercentage = false;
                  return false;
                }
              });
              if (Ispercentage) {
                totalPriced.push(pricePercentage);
              }
            });
            vm.PricedPercentage = stringFormat('{0}/{1}', totalPriced.length, totalItems.length); //(totalPriced.length * 100 / totalItems.length);
            vm.unQuotedPrice = false;
            if (totalPriced.length > 0 || totalItems.length == 0) {
              summary = false;
            }
            if (totalPriced.length != totalItems.length) {
              vm.unQuotedPrice = true;
            }
          }
          vm.isShowSummary = summary;
          vm.noParts = totalItems.length > 0 ? false : true;
          //var partcostdata = {
          //  totalItems: totalItems,
          //  summary: summary
          //}
          //$scope.$emit(RFQTRANSACTION.EVENT_NAME.ShowSummary, partcostdata);
          $timeout(() => {
            vm.resetSourceGrid();
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount != vm.currentdata ? true : false);
          });
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //open price group popup
    vm.getPriceGRoupDetails = (priceGroupId, event) => {
      const data = {
        priceGroupId: priceGroupId,
        rfqID: vm.rfqID
      };
      DialogFactory.dialogService(
        RFQTRANSACTION.ADD_RFQ_PRICE_GROUP_DETAILS_POPUP_CONTROLLER,
        RFQTRANSACTION.ADD_RFQ_PRICE_GROUP_DETAILS_POPUP_VIEW,
        event,
        data).then(() => {
        }, () => {
        }, (error) => BaseService.getErrorLog(error));
    };

    //get pricing open price selector popup
    vm.getPricing = (rowEntity, qty) => {
      if (vm.isSummaryComplete) {
        return false;
      }

      if (!vm.bom.isActivityStart || vm.bom.activityStartBy != vm.loginUserId) {
        return false;
      }

      rowEntity.qty = qty;
      rowEntity.rfqID = vm.rfqID;
      rowEntity.partID = vm.bom.partID;
      rowEntity.pricePercentage = vm.PricedPercentage;
      rowEntity.assemblyDescription = vm.bom ? vm.bom.assemblyDescription : null;
      rowEntity.assemblyNumber = vm.bom ? vm.bom.assemblyNumber : null;
      rowEntity.assemblyRev = vm.bom ? vm.bom.assemblyRev : null;
      rowEntity.quantityTotals = vm.quantityTotals;
      rowEntity.unQuotedPrice = vm.unQuotedPrice;
      rowEntity.mfgCodeList = vm.mfgCodeList;
      rowEntity.supplierList = vm.supplierList;
      rowEntity.packagingAll = vm.packagingAll;
      rowEntity.rohsIcon = vm.bom.rohsIcon;
      rowEntity.PIDCode = vm.bom.PIDCode;
      rowEntity.RoHS = vm.bom.RoHS;
      rowEntity.PricingFilterID = vm.selectedFilterName.ID;
      rowEntity.customerID = vm.bom.customerID;
      rowEntity.restrictedParts = vm.restrictedParts;
      if (rowEntity.ConsolidateQuantity.length === 0) {
        rowEntity.ConsolidateQuantity = vm.quantityTotals;
      }
      const sourceData = angular.copy(vm.sourceData);
      const rowDetail = angular.copy(rowEntity);
      const data = {
        sourceData: sourceData,
        rowEntity: rowDetail
      };
      $mdSidenav('price-selector').open();
      $scope.$emit(RFQTRANSACTION.EVENT_NAME.OpenPriceSelector, data);

      $mdSidenav('price-selector').onClose(() => {
        $scope.$emit(RFQTRANSACTION.EVENT_NAME.ClosePriceSelector, false);
        if (BaseService.isChangePriceSelector) {
          saveInternalVersion(false);
          vm.pagingInfo.Page = CORE.UIGrid.Page();
          vm.loadData();
          vm.disableDraft = false;
          vm.disabledSubmit = false;
        }
      });
    };

    //open popup for pricing apis
    vm.getPricingApis = (selectedData, event, type) => {
      const dataObj = {};
      dataObj.lineItemList = [];
      dataObj.type = type;
      if (type === 'multiple') {
        dataObj.lineItemList = selectedData;
      } else {
        if (!selectedData.isPurchase || selectedData.isCustom || selectedData.isDisabled || vm.isSummaryComplete || (vm.bom && (!vm.bom.isActivityStart || vm.bom.activityStartBy != vm.loginUserId))) { return false; }
        dataObj.lineItemList.push(selectedData);
      }
      dataObj.Quantity = vm.quantityTotals;
      dataObj.UpdatePricingStatus = null;
      dataObj.UpdatePricingStatus = vm.UpdatePricingStatus;
      dataObj.customprice = false;
      DialogFactory.dialogService(
        CORE.RFQ_TRANSACTION_BOM_PART_COSTING_MANAGEPRICE_MODAL_CONTROLLER,
        CORE.RFQ_TRANSACTION_BOM_PART_COSTING_MANAGEPRICE_MODAL_VIEW,
        event,
        dataObj).then(() => {
        }, (data) => {
          if (data) {
            vm.pagingInfo.Page = CORE.UIGrid.Page();
            vm.isClearPriceShow = false;
            vm.loadData();
            vm.disabledSubmit = false;
            vm.disableDraft = false;
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    // add auto pricing api wise to lineitem
    function addAutoPricingInLineItem(pricingObj, objLineItem) {
      const reqObj = {};
      reqObj.pricingApiName = pricingObj.pricingApiName;
      reqObj.consolidateID = pricingObj.id;
      reqObj.rfqAssyID = pricingObj.rfqAssyID;
      reqObj.status = pricingObj.status;
      reqObj.msg = pricingObj.msg;
      reqObj.pricingSupplierID = pricingObj.pricingSupplierID;
      objLineItem.pricing.push(reqObj);
    }

    // call update pricing status from popup
    vm.UpdatePricingStatus = (lineItemList) => {
      _.each(lineItemList, (item) => {
        const objLineItem = _.find(vm.sourceData, { 'id': item.id });
        // check with grid data line item exists or not
        if (objLineItem) {
          _.each(item.pricingList, (obj) => {
            if (objLineItem.pricing && objLineItem.pricing.length > 0) {
              const objPricing = _.find(objLineItem.pricing, {
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
      const objAssyPricing = {};
      objAssyPricing.status = vm.PRICING_STATUS.SendRequest;
      // update ui for loader in bom page
      $scope.$emit(PRICING.EventName.UpdateStatus, objAssyPricing);
      vm.assyLoading = true;
    };

    // call when api response come and update status
    vm.UpdatePricingResponseStatus = (pricingObj) => {
      if (pricingObj.consolidateID) {
        const objLineItem = _.find(vm.sourceData, { 'id': pricingObj.consolidateID });
        // check with grid data line item exists or not
        if (objLineItem) {
          if (objLineItem.pricing && objLineItem.pricing.length > 0) {
            const objPricing = _.find(objLineItem.pricing, {
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
    };

    // method to update pricing status loader
    vm.UpdateAllPricing = (ev) => {
      if (vm.assyLoading || vm.isSummaryComplete || vm.noParts || !vm.bom.isMaterialAllow || vm.checkAllCustomParts() || !vm.bom.isActivityStart || vm.bom.activityStartBy != vm.loginUserId) { return false;}
      if (vm.gridOptions.getSelectedRowsCount() > 0) {
        const selectedRows = vm.gridOptions.getSelectedRows();
        const source = _.filter(selectedRows, (prices) => prices.isPurchase && !prices.restrictCPNUseInBOMStep && prices.restrictCPNUsePermanentlyStep && prices.restrictCPNUseWithPermissionStep);
        vm.getPricingApis(source, ev, 'multiple');
      }
      else {
        const source = _.filter(vm.sourceData, (prices) => prices.isPurchase && !prices.restrictCPNUseInBOMStep && prices.restrictCPNUsePermanentlyStep && prices.restrictCPNUseWithPermissionStep);
        vm.getPricingApis(source, ev, 'multiple');
      }
    };
    // Recalculate pricing logic from existing
    vm.recalculatePrice = () => {
      if (vm.assyLoading || vm.isSummaryComplete || vm.noParts || !vm.bom.isMaterialAllow || !vm.bom.isActivityStart || vm.bom.activityStartBy != vm.loginUserId) { return false;}
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.LINENONQUOTEITEM);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          recalculatePriceItems();
        }
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    };
    //recalculate logic for price
    function recalculatePriceItems(isPriced) {
      const autocompletePromise = [getPricingList(), getnonQuoteQtyItems(), getComponentCustomer()];
      vm.cgBusyLoading = $q.all(autocompletePromise).then((responses) => {
        if (responses) {
          vm.pricingList = responses[0];
          vm.nonQuotedQtyList = responses[1].notQuoteQtyList;
          vm.pricingsetting = responses[1].priceSetting;
          vm.customerloaprice = responses[2];
          vm.nonQuotedCustomPrice = _.filter(angular.copy(vm.nonQuotedQtyList), (noQuote) => noQuote.iscustom);
          if (vm.nonQuotedCustomPrice.length > 0) {
            const Ids = _.map(vm.nonQuotedCustomPrice, 'consolidateID');
            const filteredList = _.filter(vm.pricingList, (p) => _.includes(Ids, p.ConsolidateID));
            if (filteredList.length > 0) {
              const minDate = _.minBy(filteredList, (o) => (new Date(o.UpdatedTimeStamp)));
              const maxDate = _.maxBy(filteredList, (o) => (new Date(o.UpdatedTimeStamp)));
              if (minDate && maxDate) {
                const currDate = (new Date(minDate.UpdatedTimeStamp));
                currDate.setDate(currDate.getDate() - 1);
                const currMaxDate = (new Date(maxDate.UpdatedTimeStamp));
                currMaxDate.setDate(currMaxDate.getDate() + 1);
                const startDate = $filter('date')(new Date(currDate), CORE.DateFormatArray[0].format);
                const endDate = $filter('date')(new Date(currMaxDate), CORE.DateFormatArray[0].format);
                vm.cgBusyLoading = $q.all([retrievePriceBreak(startDate, endDate)]).then(() => {
                  vm.cgBusyLoading = $q.all([customPartCalculations()]).then(() => {
                    vm.cgBusyLoading = PartCostingFactory.saveAssyPriceQtyBreak().query({ assyQtyBreak: vm.allPriceBreakDetail }).$promise.then(() => {
                      vm.cgBusyLoading = $q.all([getPricingList()]).then((pResponse) => {
                        vm.pricingList = pResponse[0];
                        calculatePriceWithCommonDetails(isPriced);
                      });
                    }).catch((error) => BaseService.getErrorLog(error));
                  });
                });
              }
              else {
                calculatePriceWithCommonDetails(isPriced);
              }
            }
            else {
              calculatePriceWithCommonDetails(isPriced);
            }
          }
          else {
            calculatePriceWithCommonDetails(isPriced);
          }
        }
      });
    }
    //let calculate commondetails
    const calculatePriceWithCommonDetails = (isPriced) => {
      const autocompletePromise = [BindPricingDetail()];
      vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
        var objPrice = {
          pricelist: vm.nonQuoteList,
          isModified: isPriced
        };
        vm.cgBusyLoading = PartCostingFactory.saveFinalPrice().query({ pricingObj: objPrice }).$promise.then(() => {
          vm.pagingInfo.Page = CORE.UIGrid.Page();
          vm.loadData();
        });
      });
    };

    //save custom part price as per new calculation
    const customPartCalculations = () => {
      return $timeout(() => {
        vm.allPriceBreakDetail = [];
        _.each(vm.nonQuotedCustomPrice, (Custom) => {
          const priceselector = _.filter(vm.pricingList, (plist) => plist.ConsolidateID == Custom.consolidateID);
          if (priceselector.length > 0) {
            _.each(priceselector, (priceSelect) => {
              const bomUom = _.find(vm.UnitList, (uom) => uom.id == priceSelect.bomUnitID);
              const compUom = _.find(vm.UnitList, (uom) => uom.id == priceSelect.componentUnitID);
              _.each(priceSelect.assemblyQtyBreak, (qtyBreak) => {
                let priceBreakDetail;
                let ActualPrice = 0;
                let unitPrice = 0;
                let leadTime = 0;
                if (qtyBreak.RfqAssyQtyId == Custom.qtyID) {
                  const settingType = RFQTRANSACTION.PRICE_SELECTEION_SETTING_TYPE.CUSTOM_PART_SELECTION.value;
                  const setting = _.find(vm.pricingsetting, (set) => set.requestQty == Custom.requestQty && set.settingType == settingType);
                  if (setting && setting.isLeadTime) {
                    const qtyBreaklst = _.filter(angular.copy(vm.qtyBreakList), (qBreak) => qBreak.componentID == priceSelect.PartNumberId && qBreak.packagingID == priceSelect.packageID && qBreak.UpdatedTimeStamp == priceSelect.UpdatedTimeStamp && qBreak.supplierID == priceSelect.SupplierID);
                    if (qtyBreaklst.length > 0) {
                      let consolidateList = _.filter(qtyBreaklst, (consolidate) => consolidate.qty == qtyBreak.OrderQty);
                      if (consolidateList.length == 0) {
                        let pricelst = _.orderBy(_.filter(qtyBreaklst, (consolidate) => consolidate.qty < qtyBreak.OrderQty && consolidate.leadTime <= (setting.leadTime ? setting.leadTime : 1)), ['qty', 'price'], ['ASC', 'ASC']);
                        if (pricelst.length > 0) {
                          priceBreakDetail = pricelst[pricelst.length - 1];
                        }
                        else {
                          pricelst = _.orderBy(_.filter(qtyBreaklst, (consolidate) => consolidate.qty < qtyBreak.OrderQty), ['qty', 'price'], ['ASC', 'ASC']);
                          if (pricelst.length > 0) {
                            priceBreakDetail = pricelst[pricelst.length - 1];
                          } else {
                            priceBreakDetail = _.orderBy(qtyBreaklst, ['qty', 'price'], ['ASC', 'ASC'])[0];
                          }
                        }
                      } else {
                        const actualConsolidateList = angular.copy(consolidateList);
                        consolidateList = _.filter(consolidateList, (consolidate) => consolidate.leadTime <= (setting.leadTime ? setting.leadTime : 1));
                        if (consolidateList.length == 0) {
                          consolidateList = actualConsolidateList;
                        }
                        priceBreakDetail = _.minBy(consolidateList, 'price');
                      }
                      if (priceBreakDetail) {
                        unitPrice = parseFloat(priceBreakDetail.price);
                        leadTime = priceBreakDetail.leadTime ? parseFloat(priceBreakDetail.leadTime) : 0;
                      }
                      else {
                        let priceList = _.sortBy(_.filter(qtyBreaklst, (qBreak) => qBreak.qty < qtyBreak.OrderQty), (o) => o.qty);
                        if (priceList.length == 0) {
                          priceList = _.sortBy(qtyBreaklst, (qBreak) => qBreak.qty);
                        }
                        unitPrice = parseFloat(priceList[priceList.length - 1].price);
                        leadTime = parseFloat(priceList[priceList.length - 1].leadTime);
                      }
                      ActualPrice = angular.copy(unitPrice);
                      if (compUom && bomUom) {
                        unitPrice = (unitPrice * (compUom.baseUnitConvertValue ? compUom.baseUnitConvertValue : 1)) / ((priceSelect.packageQty ? priceSelect.packageQty : 1) * (bomUom.baseUnitConvertValue ? bomUom.baseUnitConvertValue : 1));
                      }
                      if (priceSelect.AdditionalValueFee) {
                        //Add value for additional value
                        const additionalValue = parseFloat(priceSelect.AdditionalValueFee) / parseInt(qtyBreak.OrderQty);
                        unitPrice = unitPrice + additionalValue;
                        ActualPrice = ActualPrice + additionalValue;
                      }
                      qtyBreak.ActualPrice = ActualPrice;
                      qtyBreak.PricePerPart = unitPrice;
                      qtyBreak.TotalDollar = parseFloat((parseFloat(unitPrice) * parseFloat(qtyBreak.OrderQty)).toFixed(6));
                      qtyBreak.leadTime = leadTime;
                      vm.allPriceBreakDetail.push(qtyBreak);
                    }
                  }
                }
              });
            });
          }
        });
      }, 0);
    };
    //recalculate logic for price
    //function recalculatePriceItemss(isPriced) {
    //  var autocompletePromise = [getPricingList(), getnonQuoteQtyItems(), getComponentCustomer()];
    //  vm.cgBusyLoading = $q.all(autocompletePromise).then((responses) => {
    //    if (responses) {
    //      vm.pricingList = responses[0];
    //      vm.nonQuotedQtyList = responses[1].notQuoteQtyList;
    //      vm.pricingsetting = responses[1].priceSetting;
    //      vm.customerloaprice = responses[2];
    //      autocompletePromise = [BindPricingDetail()];
    //      vm.cgBusyLoading = $q.all(autocompletePromise).then((responses) => {
    //        var objPrice = {
    //          pricelist: vm.nonQuoteList,
    //          isModified: isPriced,
    //        }
    //        vm.cgBusyLoading = PartCostingFactory.saveFinalPrice().query({ pricingObj: objPrice }).$promise.then((finalPrice) => {
    //          vm.pagingInfo.Page = CORE.UIGrid.Page();
    //          vm.loadData();
    //        });
    //      });
    //    }
    //  });
    //}
    function getStockDetails(listPriceAll, nonQuote, supplierObj) {
      var stock = {}; var uniqueDetails;
      //if (nonQuote.uomID > 0) {
      stock.supplierStock = _.sumBy(listPriceAll, (o) => { if (o.SupplierID == supplierObj.SupplierID && o.ConsolidateID == nonQuote.consolidateID) { return o.OtherStock; } });
      stock.grossStock = _.sumBy(_.filter(listPriceAll, (pData) => !pData.copyFromID && pData.ConsolidateID == nonQuote.consolidateID), (o) => o.OtherStock);
      uniqueDetails = _.uniqBy(_.filter(listPriceAll, (x) => x.OtherStock > 0 && x.ConsolidateID == nonQuote.consolidateID), (y) => y.SupplierName);
      uniqueDetails = _.uniqBy(uniqueDetails, 'SupplierID');
      stock.pricingSuppliers = _.map(uniqueDetails, 'SupplierName').join();

      //}
      //else {
      //stock.supplierStock = _.sumBy(listPriceAll, (o) => { if (o.SupplierID == supplierObj.SupplierID && o.ConsolidateID == nonQuote.consolidateID) { return o.OrgInStock } });
      //stock.grossStock = _.sumBy(_.filter(listPriceAll, (pData) => { return !pData.copyFromID && pData.ConsolidateID == nonQuote.consolidateID }), function (o) { return o.OrgInStock; });
      //uniqueDetails = _.uniqBy(_.filter(listPriceAll, (x) => { return x.OrgInStock > 0 && x.ConsolidateID == nonQuote.consolidateID }), (y) => { return y.SupplierName });
      //uniqueDetails = _.uniqBy(uniqueDetails, 'SupplierID');
      //stock.pricingSuppliers = _.map(uniqueDetails, 'SupplierName').join();
      // }
      return stock;
    }
    //make list for pricing
    function BindPricingDetail() {
      return $timeout(() => {
        vm.nonQuoteList = [];
        vm.nonQuotedQtyList = _.sortBy(vm.nonQuotedQtyList, ['qtyID']);
        _.each(vm.nonQuotedQtyList, (nonQuote) => {
          var listPriceAll = _.filter(vm.pricingList, (item) => item.ConsolidateID === nonQuote.consolidateID);
          if (listPriceAll && listPriceAll.length) {
            const approvedPriceList = _.filter(listPriceAll, (item) => {
              if (!item.mismatchMountingTypeStep || !item.mismatchFunctionalCategoryStep) {
                if (item.approvedMountingType) {
                  return item;
                }
              } else {
                return item;
              }
            });
            //if (approvedPriceList && approvedPriceList.length) {
            listPriceAll = approvedPriceList;
            //}
          }
          const listPrice = listPriceAll.map((x) => x.assemblyQtyBreak);
          let consolidateList = [];
          _.each(listPrice, (lprice) => {
            _.each(lprice, (qBreak) => {
              consolidateList.push(qBreak);
            });
          });
          consolidateList = _.filter(consolidateList, (consolidate) => consolidate.RfqAssyQtyId == nonQuote.qtyID && consolidate.PricePerPart);
          _.each(consolidateList, (qtyBreak) => {
            qtyBreak.objQtySupplier = _.find(listPriceAll, (listPrice) => listPrice._id == qtyBreak.qtySupplierID);
          });
          let settingType = RFQTRANSACTION.PRICE_SELECTEION_SETTING_TYPE.NON_CUSTOM_PART_SELECTION.value;
          if (listPriceAll.length > 0 && listPriceAll[0].isCustom) {
            settingType = RFQTRANSACTION.PRICE_SELECTEION_SETTING_TYPE.CUSTOM_PART_SELECTION.value;
          }
          const setting = _.find(vm.pricingsetting, (set) => set.requestQty == nonQuote.requestQty && set.settingType == settingType);
          const consoliadteListPackaging = _.clone(consolidateList);

          if (setting) {
            if (listPriceAll.length > 0 && listPriceAll[0].isCustom && setting.isLeadTime) {
              consolidateList = _.filter(consolidateList, (leads) => leads.leadTime <= (setting.leadTime ? setting.leadTime : 1));
              lowestPrice(consolidateList, listPriceAll, nonQuote);
              return;
            }
            let stock;
            if (setting.packagingID && setting.packagingID > 0) {
              consolidateList = _.filter(consolidateList, (pkg) => pkg.objQtySupplier.packageID == setting.packagingID);
              if (consolidateList.length == 0) {
                consolidateList = consoliadteListPackaging; //as discussed with DP packaging type is not match then also need to take price for it 14/11/2019 (3:16PM)
                //QuoteList(nonQuote.qtyID, nonQuote.consolidateID, null, null, null, null, null, null, null, null,
                //          null, null, null, null, null, null, null, null, null, null, stringFormat(RFQTRANSACTION.PRICING.FAILEDTOMEETPACKAGING, setting.name), 0, nonQuote.id, null, null, null);
              }
            }
            if (consolidateList.length > 0) {
              if (!setting.isLeadTime) {
                //while stock  quantity is match with require quantity
                if (setting.isCheckRequiredQty) {
                  let highestStock;
                  let ismatch = false;
                  if (!setting.stockPercentage) {
                    highestStock = _.filter(consolidateList, (high) => high.objQtySupplier && high.objQtySupplier.OtherStock >= high.OrderQty);
                  } else {
                    ismatch = true;
                    const qty = ((nonQuote.requestQty * nonQuote.qpa) + ((100 * setting.stockPercentage) / (nonQuote.requestQty * nonQuote.qpa)));
                    highestStock = _.filter(consolidateList, (high) => high.objQtySupplier && high.objQtySupplier.OtherStock >= qty);
                  }
                  //stock is not match with requirement
                  if (highestStock.length == 0) {
                    QuoteList(nonQuote.qtyID, nonQuote.consolidateID, null, null, null, null, null, null, null, null,
                      null, null, null, null, null, null, null, null, null, null, ismatch ? RFQTRANSACTION.PRICING.FAILEDTOMEETOVERRUN : RFQTRANSACTION.PRICING.FAILEDTOMEETSTK, 0, nonQuote.id, null, null, null, null);
                  }
                  else {
                    //if pakaging id not assign in setting then will take highest stock lowest price
                    const objhighest = _.minBy(highestStock, 'PricePerPart');
                    //packaging match with settings
                    const supplierObj = _.find(listPriceAll, (suppObj) => suppObj._id == objhighest.qtySupplierID);
                    stock = getStockDetails(listPriceAll, nonQuote, supplierObj);
                    QuoteList(nonQuote.qtyID, supplierObj.ConsolidateID, objhighest ? objhighest.TotalDollar : null, objhighest ? objhighest.PricePerPart : 0, supplierObj.SupplierName,
                      supplierObj.SourceOfPrice, supplierObj.ManufacturerPartNumber, supplierObj.MinimumBuy, supplierObj.Multiplier, supplierObj.OtherStock,
                      supplierObj.APILeadTime, supplierObj.PIDCode, supplierObj.PartNumberId, supplierObj.ApiNoOfPosition, stock.supplierStock, stock.grossStock, stock.pricingSuppliers,
                      supplierObj.Packaging, supplierObj._id, objhighest.OrderQty, null, 0, nonQuote.id, objhighest ? objhighest.ActualPrice : 0, objhighest ? objhighest.ActualQty : 0, supplierObj.OrgInStock, supplierObj.SupplierID);
                  }
                }
                //stock and price is N/A then it will execute
                else if (setting.stock === RFQTRANSACTION.COMMON_TYPE_STATUS.NOTAPPLIED && setting.price === RFQTRANSACTION.COMMON_TYPE_STATUS.NOTAPPLIED) {
                  lowestPrice(consolidateList, listPriceAll, nonQuote);
                }
                //while stock is highest and price is N/A then it will execute
                else if (setting.stock === RFQTRANSACTION.COMMON_TYPE_STATUS.HIGHEST && setting.price === RFQTRANSACTION.COMMON_TYPE_STATUS.NOTAPPLIED) {
                  const objPrice = _.maxBy(consolidateList, 'objQtySupplier.OtherStock');
                  if (objPrice) {
                    const supplierObj = _.find(listPriceAll, (suppObj) => suppObj._id == objPrice.qtySupplierID);
                    stock = getStockDetails(listPriceAll, nonQuote, supplierObj);
                    QuoteList(nonQuote.qtyID, supplierObj.ConsolidateID, objPrice ? objPrice.TotalDollar : null, objPrice ? objPrice.PricePerPart : 0, supplierObj.SupplierName,
                      supplierObj.SourceOfPrice, supplierObj.ManufacturerPartNumber, supplierObj.MinimumBuy, supplierObj.Multiplier, supplierObj.OtherStock,
                      supplierObj.APILeadTime, supplierObj.PIDCode, supplierObj.PartNumberId, supplierObj.ApiNoOfPosition, stock.supplierStock, stock.grossStock, stock.pricingSuppliers,
                      supplierObj.Packaging, supplierObj._id, objPrice.OrderQty, null, 0, nonQuote.id, objPrice ? objPrice.ActualPrice : 0, objPrice ? objPrice.ActualQty : 0, supplierObj.OrgInStock, supplierObj.SupplierID);
                  }
                }
                //while stock is lowest and price is N/A in setting then it will execute
                else if (setting.stock === RFQTRANSACTION.COMMON_TYPE_STATUS.LOWEST && setting.price === RFQTRANSACTION.COMMON_TYPE_STATUS.NOTAPPLIED) {
                  const objPrice = _.minBy(consolidateList, 'objQtySupplier.OtherStock');
                  if (objPrice) {
                    const supplierObj = _.find(listPriceAll, (suppObj) => suppObj._id == objPrice.qtySupplierID);
                    stock = getStockDetails(listPriceAll, nonQuote, supplierObj);
                    QuoteList(nonQuote.qtyID, supplierObj.ConsolidateID, objPrice ? objPrice.TotalDollar : null, objPrice ? objPrice.PricePerPart : 0, supplierObj.SupplierName,
                      supplierObj.SourceOfPrice, supplierObj.ManufacturerPartNumber, supplierObj.MinimumBuy, supplierObj.Multiplier, supplierObj.OtherStock,
                      supplierObj.APILeadTime, supplierObj.PIDCode, supplierObj.PartNumberId, supplierObj.ApiNoOfPosition, stock.supplierStock, stock.grossStock, stock.pricingSuppliers,
                      supplierObj.Packaging, supplierObj._id, objPrice.OrderQty, null, 0, nonQuote.id, objPrice ? objPrice.ActualPrice : 0, objPrice ? objPrice.ActualQty : 0, supplierObj.OrgInStock, supplierObj.SupplierID);
                  }
                }
                //while stock is N/A and price is highest in setting then it will execute
                else if (setting.stock === RFQTRANSACTION.COMMON_TYPE_STATUS.NOTAPPLIED && setting.price === RFQTRANSACTION.COMMON_TYPE_STATUS.HIGHEST) {
                  const objPrice = _.maxBy(consolidateList, 'PricePerPart');
                  if (objPrice) {
                    const supplierObj = _.find(listPriceAll, (suppObj) => suppObj._id == objPrice.qtySupplierID);
                    stock = getStockDetails(listPriceAll, nonQuote, supplierObj);
                    QuoteList(nonQuote.qtyID, supplierObj.ConsolidateID, objPrice ? objPrice.TotalDollar : null, objPrice ? objPrice.PricePerPart : 0, supplierObj.SupplierName,
                      supplierObj.SourceOfPrice, supplierObj.ManufacturerPartNumber, supplierObj.MinimumBuy, supplierObj.Multiplier, supplierObj.OtherStock,
                      supplierObj.APILeadTime, supplierObj.PIDCode, supplierObj.PartNumberId, supplierObj.ApiNoOfPosition, stock.supplierStock, stock.grossStock, stock.pricingSuppliers,
                      supplierObj.Packaging, supplierObj._id, objPrice.OrderQty, null, 0, nonQuote.id, objPrice ? objPrice.ActualPrice : 0, objPrice ? objPrice.ActualQty : 0, supplierObj.OrgInStock, supplierObj.SupplierID);
                  }
                }
                // while stock is Highest and Price is highest
                else if (setting.stock === RFQTRANSACTION.COMMON_TYPE_STATUS.HIGHEST && setting.price === RFQTRANSACTION.COMMON_TYPE_STATUS.HIGHEST) {
                  let objPrice = _.maxBy(consolidateList, 'objQtySupplier.OtherStock');
                  const liststock = _.filter(consolidateList, (clist) => clist.objQtySupplier.OtherStock == objPrice.objQtySupplier.OtherStock);
                  if (liststock.length > 1) {
                    objPrice = _.maxBy(liststock, 'PricePerPart');
                  }
                  if (objPrice) {
                    const supplierObj = _.find(listPriceAll, (suppObj) => suppObj._id == objPrice.qtySupplierID);
                    stock = getStockDetails(listPriceAll, nonQuote, supplierObj);
                    QuoteList(nonQuote.qtyID, supplierObj.ConsolidateID, objPrice ? objPrice.TotalDollar : null, objPrice ? objPrice.PricePerPart : 0, supplierObj.SupplierName,
                      supplierObj.SourceOfPrice, supplierObj.ManufacturerPartNumber, supplierObj.MinimumBuy, supplierObj.Multiplier, supplierObj.OtherStock,
                      supplierObj.APILeadTime, supplierObj.PIDCode, supplierObj.PartNumberId, supplierObj.ApiNoOfPosition, stock.supplierStock, stock.grossStock, stock.pricingSuppliers,
                      supplierObj.Packaging, supplierObj._id, objPrice.OrderQty, null, 0, nonQuote.id, objPrice ? objPrice.ActualPrice : 0, objPrice ? objPrice.ActualQty : 0, supplierObj.OrgInStock, supplierObj.SupplierID);
                  }
                }
                // while stock is Lowest and Price is highest
                else if (setting.stock === RFQTRANSACTION.COMMON_TYPE_STATUS.LOWEST && setting.price === RFQTRANSACTION.COMMON_TYPE_STATUS.HIGHEST) {
                  let objPrice = _.minBy(consolidateList, 'objQtySupplier.OtherStock');
                  const liststock = _.filter(consolidateList, (clist) => clist.objQtySupplier.OtherStock == objPrice.objQtySupplier.OtherStock);
                  if (liststock.length > 1) {
                    objPrice = _.maxBy(liststock, 'PricePerPart');
                  }
                  if (objPrice) {
                    const supplierObj = _.find(listPriceAll, (suppObj) => suppObj._id == objPrice.qtySupplierID);
                    stock = getStockDetails(listPriceAll, nonQuote, supplierObj);
                    QuoteList(nonQuote.qtyID, supplierObj.ConsolidateID, objPrice ? objPrice.TotalDollar : null, objPrice ? objPrice.PricePerPart : 0, supplierObj.SupplierName,
                      supplierObj.SourceOfPrice, supplierObj.ManufacturerPartNumber, supplierObj.MinimumBuy, supplierObj.Multiplier, supplierObj.OtherStock,
                      supplierObj.APILeadTime, supplierObj.PIDCode, supplierObj.PartNumberId, supplierObj.ApiNoOfPosition, stock.supplierStock, stock.grossStock, stock.pricingSuppliers,
                      supplierObj.Packaging, supplierObj._id, objPrice.OrderQty, null, 0, nonQuote.id, objPrice ? objPrice.ActualPrice : 0, objPrice ? objPrice.ActualQty : 0, supplierObj.OrgInStock, supplierObj.SupplierID);
                  }
                }
                // while stock is N/A and Price is highest
                else if (setting.stock === RFQTRANSACTION.COMMON_TYPE_STATUS.NOTAPPLIED && setting.price === RFQTRANSACTION.COMMON_TYPE_STATUS.LOWEST) {
                  lowestPrice(consolidateList, listPriceAll, nonQuote);
                }
                // while stock is Highest and Price is highest
                else if (setting.stock === RFQTRANSACTION.COMMON_TYPE_STATUS.HIGHEST && setting.price === RFQTRANSACTION.COMMON_TYPE_STATUS.LOWEST) {
                  let objPrice = _.maxBy(consolidateList, 'objQtySupplier.OtherStock');
                  const liststock = _.filter(consolidateList, (clist) => clist.objQtySupplier.OtherStock == objPrice.objQtySupplier.OtherStock);
                  if (liststock.length > 1) {
                    objPrice = _.minBy(liststock, 'PricePerPart');
                  }
                  if (objPrice) {
                    const supplierObj = _.find(listPriceAll, (suppObj) => suppObj._id == objPrice.qtySupplierID);
                    stock = getStockDetails(listPriceAll, nonQuote, supplierObj);
                    QuoteList(nonQuote.qtyID, supplierObj.ConsolidateID, objPrice ? objPrice.TotalDollar : null, objPrice ? objPrice.PricePerPart : 0, supplierObj.SupplierName,
                      supplierObj.SourceOfPrice, supplierObj.ManufacturerPartNumber, supplierObj.MinimumBuy, supplierObj.Multiplier, supplierObj.OtherStock,
                      supplierObj.APILeadTime, supplierObj.PIDCode, supplierObj.PartNumberId, supplierObj.ApiNoOfPosition, stock.supplierStock, stock.grossStock, stock.pricingSuppliers,
                      supplierObj.Packaging, supplierObj._id, objPrice.OrderQty, null, 0, nonQuote.id, objPrice ? objPrice.ActualPrice : 0, objPrice ? objPrice.ActualQty : 0, supplierObj.OrgInStock, supplierObj.SupplierID);
                  }
                }
                // while stock is Highest and Price is highest
                else if (setting.stock === RFQTRANSACTION.COMMON_TYPE_STATUS.LOWEST && setting.price === RFQTRANSACTION.COMMON_TYPE_STATUS.LOWEST) {
                  let objPrice = _.minBy(consolidateList, 'objQtySupplier.OtherStock');
                  const liststock = _.filter(consolidateList, (clist) => clist.objQtySupplier.OtherStock == objPrice.objQtySupplier.OtherStock);
                  if (liststock.length > 1) {
                    objPrice = _.minBy(liststock, 'PricePerPart');
                  }
                  if (objPrice) {
                    const supplierObj = _.find(listPriceAll, (suppObj) => suppObj._id == objPrice.qtySupplierID);
                    stock = getStockDetails(listPriceAll, nonQuote, supplierObj);
                    QuoteList(nonQuote.qtyID, supplierObj.ConsolidateID, objPrice ? objPrice.TotalDollar : null, objPrice ? objPrice.PricePerPart : 0, supplierObj.SupplierName,
                      supplierObj.SourceOfPrice, supplierObj.ManufacturerPartNumber, supplierObj.MinimumBuy, supplierObj.Multiplier, supplierObj.OtherStock,
                      supplierObj.APILeadTime, supplierObj.PIDCode, supplierObj.PartNumberId, supplierObj.ApiNoOfPosition, stock.supplierStock, stock.grossStock, stock.pricingSuppliers,
                      supplierObj.Packaging, supplierObj._id, objPrice.OrderQty, null, 0, nonQuote.id, objPrice ? objPrice.ActualPrice : 0, objPrice ? objPrice.ActualQty : 0, supplierObj.OrgInStock, supplierObj.SupplierID);
                  }
                }
              }
              else {
                lowestPrice(consolidateList, listPriceAll, nonQuote);
              }
            }
          }
          else {
            if (listPriceAll.length > 0 && listPriceAll[0].isCustom) {
              consolidateList = _.filter(consolidateList, (leads) => leads.leadTime <= 1);
              lowestPrice(consolidateList, listPriceAll, nonQuote);
              return;
            }
            //get lowest supplier price record
            lowestPrice(consolidateList, listPriceAll, nonQuote);
          }
        });
      }, 0);
    }
    //function for lowest price get
    function lowestPrice(consolidateList, listPriceAll, nonQuote) {
      var objPrice = _.minBy(consolidateList, 'PricePerPart');
      if (objPrice) {
        const supplierObj = _.find(listPriceAll, (suppObj) => suppObj._id == objPrice.qtySupplierID);
        const stock = getStockDetails(listPriceAll, nonQuote, supplierObj);
        QuoteList(nonQuote.qtyID, supplierObj.ConsolidateID, objPrice ? objPrice.TotalDollar : null, objPrice ? objPrice.PricePerPart : 0, supplierObj.SupplierName,
          supplierObj.SourceOfPrice, supplierObj.ManufacturerPartNumber, supplierObj.MinimumBuy, supplierObj.Multiplier, supplierObj.OtherStock,
          supplierObj.isCustom ? objPrice.leadTime : supplierObj.APILeadTime, supplierObj.PIDCode, supplierObj.PartNumberId, supplierObj.ApiNoOfPosition, stock.supplierStock, stock.grossStock, stock.pricingSuppliers,
          supplierObj.Packaging, supplierObj._id, objPrice.OrderQty, null, 0, nonQuote.id, objPrice ? objPrice.ActualPrice : 0, objPrice ? objPrice.ActualQty : 0, supplierObj.OrgInStock, supplierObj.SupplierID);
      }
    }
    //create list
    function QuoteList(RfqAssyQtyId, consolidateID, finalPrice, unitPrice, supplier, selectionMode, selectedMpn, min, mult, currentStock,
      leadTime, selectedPIDCode, componentID, apiLead, supplierStock, grossStock, pricingSuppliers, packaging, rfqQtySupplierID,
      quoteQty, pricenotselectreason, availableInternalStock, id, unitEachPrice, quoteQtyEach, supplierEachStcok, supplierID) {
      var loaPrice = _.find(vm.customerloaprice, (cloa) => cloa.componentID == componentID);
      var obj = {
        RfqAssyQtyId: RfqAssyQtyId,
        consolidateID: consolidateID,
        finalPrice: finalPrice,
        unitPrice: unitPrice,
        supplier: supplier,
        refSupplierID: supplierID,
        selectionMode: selectionMode,
        selectedMpn: selectedMpn,
        min: min,
        mult: mult,
        currentStock: currentStock,
        leadTime: leadTime,
        selectedPIDCode: selectedPIDCode,
        componentID: componentID,
        apiLead: apiLead,
        supplierStock: supplierStock,
        grossStock: grossStock,
        pricingSuppliers: pricingSuppliers,
        packaging: packaging,
        rfqQtySupplierID: rfqQtySupplierID,
        quoteQty: quoteQty,
        pricenotselectreason: pricenotselectreason,
        availableInternalStock: availableInternalStock,
        isBomUpdate: false,
        id: id,
        LOAprice: loaPrice ? loaPrice.loa_price : null,
        unitEachPrice: unitEachPrice,
        quoteQtyEach: quoteQtyEach,
        supplierEachStcok: supplierEachStcok
      };
      vm.nonQuoteList.push(obj);
    }
    //pricing api name
    const pricingFilterName = (data) => {
      vm.selectedFilterName = data;
      vm.pagingInfo.spName = data.SpName;
      vm.pagingInfo.FilterID = data.ID;
      vm.pagingInfo.leadTime = data.leadTime;
      if (vm.pagingInfo.FilterID === RFQTRANSACTION.PRICE_FILTER.GetRFQCustomRulesLineItems.ID) {
        vm.pagingInfo.SortColumns = [];
      }
      else {
        vm.pagingInfo.SortColumns = [['lineID', 'ASC']];
      }
      if (vm.pagingInfo.FilterID === RFQTRANSACTION.PRICE_FILTER.GetRFQConsolidateRfqLineItem.ID ||
        vm.pagingInfo.FilterID === RFQTRANSACTION.PRICE_FILTER.GetRFQCustomRulesLineItems.ID) {//GetRFQCustomRulesLineItems
        vm.EmptyMesssage = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.PART_COSTING;
      } else if (vm.pagingInfo.FilterID === RFQTRANSACTION.PRICE_FILTER.GetRFQUnQuotedLineItems.ID) {
        vm.EmptyMesssage = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.NOT_QUOTED;
      } else if (vm.pagingInfo.FilterID === RFQTRANSACTION.PRICE_FILTER.GetExcessMaterialLineItems.ID) {
        vm.EmptyMesssage = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.EXCESS_MATERIAL;
      } else if (vm.pagingInfo.FilterID === RFQTRANSACTION.PRICE_FILTER.GetRFQMaterialAtRiskLineItems.ID) {
        vm.EmptyMesssage = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.MATERIAL_RISK;
      } else if (vm.pagingInfo.FilterID === RFQTRANSACTION.PRICE_FILTER.GetLeadTimeRiskLineItems.ID) {
        vm.EmptyMesssage = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.LEADTIME_RISK;
      } else if (vm.pagingInfo.FilterID === RFQTRANSACTION.PRICE_FILTER.GetRFQManualSelectPrice.ID) {
        vm.EmptyMesssage = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.MANUAL_PRICE;
      } else if (vm.pagingInfo.FilterID === RFQTRANSACTION.PRICE_FILTER.GetCostingNotRequiredDNP.ID) {
        vm.EmptyMesssage = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.COSTING_NOT_REQUIRE;
      }
      vm.gridOptions.gridApi.grid.clearAllFilters();
      vm.pagingInfo.Page = CORE.UIGrid.Page();
      vm.loadData();
    };
    //pricing api name
    const packagingAlisFilterName = $scope.$on(RFQTRANSACTION.EVENT_NAME.Packaging, (name, packaing) => {
      vm.pagingInfo.ppackageing = packaing;
      vm.pagingInfo.Page = CORE.UIGrid.Page();
      vm.loadData();
    });
    //export excel document
    vm.exportPricing = (ev) => {
      if (vm.isSummaryComplete || vm.assyLoading || !vm.bom.isMaterialAllow || !vm.bom.isActivityStart || vm.bom.activityStartBy != vm.loginUserId) { return false;}
      exportFilePrice(ev);
    };

    //import excel document
    vm.importPricing = (ev) => {
      if (vm.isSummaryComplete || vm.assyLoading || !vm.bom.isMaterialAllow || !vm.bom.isActivityStart || vm.bom.activityStartBy != vm.loginUserId) { return false; }
      vm.event = ev;
      angular.element('#fiexcel').trigger('click');
    };

    //draft save  history of pricing
    vm.saveDraftPricing = () => {
      if (vm.isShowSummary || vm.isSummaryComplete || vm.assyLoading || vm.disableDraft || !vm.bom.isMaterialAllow || !vm.bom.isActivityStart || vm.bom.activityStartBy != vm.loginUserId) { return false;}
      vm.savePricingHistory();
    };

    vm.cgBusyLoading = PartCostingFactory.getSupplierList().query({ isPricing: true }).$promise.then((suppliers) => {
      vm.Suppliers = _.sortBy(suppliers.data, (o) => o.mfgName);
    }).catch((error) => BaseService.getErrorLog(error));
    //receive event for stock update
    vm.stockUpdate = () => {
      if (vm.assyLoading || vm.isSummaryComplete || vm.noParts || !vm.bom.isMaterialAllow || vm.checkAllCustomParts() || !vm.bom.isActivityStart || vm.bom.activityStartBy != vm.loginUserId) { return false;}
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.STOCK_UPDATE_CONFIRM);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          const selectedLineItem = [];
          _.each(vm.sourceData, (item) => {
            if (item.isPurchase) {
              const prcObj = {};
              prcObj.id = item.id;
              prcObj.rfqAssyID = rfqAssyID;
              item.status = PRICING.PRICING_STATUS.SendRequest;
              item.pricingList = prcObj.pricingList = _.filter(vm.Suppliers, (a) => _.find(item.autoPricingStatus, (b) => b.pricingSupplierID === a.id));
              if (item.pricingList.length > 0) {
                selectedLineItem.push(prcObj);
              }
            }
          });
          if (selectedLineItem.length > 0) {
            vm.UpdatePricingStatus(selectedLineItem);
          }
          // progress bar
          if (selectedLineItem.length > 0) {
            vm.requestQty = null;
            const selectSupplierList = selectedLineItem[0].pricingList;
            vm.cgBusyLoading = PartCostingFactory.getPricingFromApis().query({ pricingApiObj: { pricingApiList: selectedLineItem, isCustomPrice: false, isStockUpdate: true, isPurchaseApi: false, DKVersion: _DkVersion, selectSupplierList: selectSupplierList } }).$promise.then(() => {
              vm.pagingInfo.Page = CORE.UIGrid.Page();
              vm.isClearPriceShow = false;
              vm.loadData();
            }).catch((error) => BaseService.getErrorLog(error));
          }
          else {
            const model = {
              multiple: true,
              messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.STOCK_NOT_UPDATE)
            };
            DialogFactory.messageAlertDialog(model);
            return false;
          }
        }
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    };
    // [S] Socket Listeners

    function connectSocket() {
      socketConnectionService.on(PRICING.EventName.LineItemPricingStatus, pricingStatusListener);
      socketConnectionService.on(PRICING.EventName.revisedQuote, revisedQuote);
      socketConnectionService.on(PRICING.EventName.sendCostingStartStopActivity, CostingStartStopActivity);
      socketConnectionService.on(PRICING.EventName.sendSubmittedQuote, sendSubmittedQuote);
      socketConnectionService.on(PRICING.EventName.AssemblyPricingStatus, pricingAssyStatusListener);
    }
    connectSocket();

    socketConnectionService.on('reconnect', () => {
      connectSocket();
    });
    function removeSocketListener() {
      socketConnectionService.removeListener(PRICING.EventName.LineItemPricingStatus, pricingStatusListener);
      socketConnectionService.removeListener(PRICING.EventName.revisedQuote, revisedQuote);
      socketConnectionService.removeListener(PRICING.EventName.sendCostingStartStopActivity, CostingStartStopActivity);
      socketConnectionService.removeListener(PRICING.EventName.AssemblyPricingStatus, pricingAssyStatusListener);
      socketConnectionService.removeListener(PRICING.EventName.sendSubmittedQuote, sendSubmittedQuote);
    }

    function revisedQuote(assyid) {
      if (assyid == rfqAssyID && vm.isSummaryComplete) {
        vm.isSummaryComplete = false;
      }
    }

    function CostingStartStopActivity(data) {
      if (data.rfqAssyID == rfqAssyID) {
        vm.bom.isActivityStart = !vm.bom.isActivityStart;
        vm.bom.activityStartBy = data.loginUserId;
      }
    }

    function pricingStatusListener(message) {
      if (message && (message.rfqAssyID == rfqAssyID || message.AssyID == rfqAssyID)) {
        $timeout(statusReceive(message));
      }
    }
    function sendSubmittedQuote(data) {
      if (data.assyID == rfqAssyID) {
        vm.isSummaryComplete = true;
      }
    }
    function pricingAssyStatusListener(message) {
      if (!vm.isClearPriceShow && message && (message.AssyID == rfqAssyID || message.rfqAssyID == rfqAssyID)) {
        $timeout(statusAssyReceive(message));
      }
    }
    function statusReceive(message) {
      $scope.$emit(PRICING.EventName.updateExpectedTimePrice, message);
      vm.UpdatePricingResponseStatus(message);
    }

    function statusAssyReceive(data) {
      $scope.$emit(PRICING.EventName.UpdateStatus, data);
      if (data.status !== vm.PRICING_STATUS.SendRequest) {
        vm.isClearPriceShow = true;
        vm.assyLoading = false;
        _.each(vm.sourceData, (lineItem) => {
          lineItem.isDisabled = false;
        });
        if (data.isStockUpdate)//for stock update{
        {
          NotificationFactory.success(RFQTRANSACTION.PRICING.STOCK_UPDATE);
          vm.pagingInfo.Page = CORE.UIGrid.Page();
          vm.loadData();
        }
        else {
          const model = {
            multiple: true,
            messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.PRICING_DONE)
          };
          DialogFactory.messageAlertDialog(model);
          recalculatePriceItems(true);
        }
        // vm.loadData();
      } else {
        vm.assyLoading = true;
        vm.disabledSubmit = true;
      }
    }
    $scope.$on('$destroy', () => {
      // Remove socket listeners
      removeSocketListener();
      packagingAlisFilterName();
      $mdDialog.hide(false, {
        closeAll: true
      });
    });

    // on disconnect socket
    socketConnectionService.on('disconnect', () => {
      removeSocketListener();
    });

    //get total sum of all quantity
    vm.getFooterPrice = (key) => {
      let displayText = '';
      if (vm.sourceData && vm.sourceData.length > 0 && (vm.selectedFilterName.ID === RFQTRANSACTION.PRICE_FILTER.GetRFQConsolidateRfqLineItem.ID || vm.selectedFilterName.ID === RFQTRANSACTION.PRICE_FILTER.GetRFQCustomRulesLineItems.ID)) {
        const objTotal = _.find(vm.quantityTotals, (item) => item.requestQty == key);

        if (objTotal) {
          if (objTotal.TotalExtendedPrice || objTotal.TotalExtendedPrice == 0) {
            if (displayText) {
              displayText += ' | ';
            }
            displayText += 'Assy Price: ' + $filter('currency')(objTotal.TotalExtendedPrice) + ' EA';
          }
          if (objTotal.TotalAssemblyPrice || objTotal.TotalAssemblyPrice == 0) {
            if (displayText) {
              displayText += ' | ';
            }
            displayText += 'Ext. Price: ' + $filter('currency')(objTotal.TotalAssemblyPrice + (objTotal.TotalExcessPrice || 0));
          }
          if (objTotal.TotalExcessPrice || objTotal.TotalExcessPrice > 0) {
            if (displayText) {
              displayText += ' | ';
            }
            displayText += 'Excess Price: ' + $filter('currency')(objTotal.TotalExcessPrice);
          }
        }
      }
      return displayText;
    };

    //get tool tip
    vm.getFootertooltip = (key) => {
      let displayText = '';
      if (vm.selectedFilterName.ID === RFQTRANSACTION.PRICE_FILTER.GetRFQConsolidateRfqLineItem.ID || vm.selectedFilterName.ID === RFQTRANSACTION.PRICE_FILTER.GetRFQCustomRulesLineItems.ID) {
        const objTotal = _.find(vm.quantityTotals, (item) => item.requestQty == key);

        if (objTotal) {
          if (objTotal.TotalExtendedPrice || objTotal.TotalExtendedPrice == 0) {
            if (displayText) {
              displayText += '<br/>';
            }
            displayText += 'Assy Price Formula: Sum of all line items ext. price.';
          }
          if (objTotal.TotalAssemblyPrice || objTotal.TotalAssemblyPrice == 0) {
            if (displayText) {
              displayText += '<br/>';
            }
            displayText += 'Ext. Price Formula: Sum of all line items cost per assy(w/ excess).';
          }
          if (objTotal.TotalExcessPrice || objTotal.TotalExcessPrice > 0) {
            if (displayText) {
              displayText += '<br/>';
            }
            displayText += 'Excess Price Formula: Sum of all line items excess price.';
          }
        }
      }
      return displayText;
    };
    //call function for save summary
    const savePartCostingPrice = (historyID) => {
      var summaryList = [];
      _.each(vm.turntimeList, (item) => {
        let objTotal = _.find(vm.quantityTotals, (total) => total.requestQty == item.requestQty);
        let customPartDetails = _.filter(vm.custompartDetails, (cust) => cust.requestQty == item.requestQty);
        if (!objTotal) {
          objTotal = _.find(vm.quantityTotals, (total) => total.rfqPriceGroupId == item.rfqPriceGroupId);
          customPartDetails = _.filter(vm.custompartDetails, (cust) => cust.rfqPriceGroupId == item.rfqPriceGroupId);
        }
        const custartIds = _.map(customPartDetails, 'componentID');
        const totalExcessPriceOfCustomPart = _.sumBy(customPartDetails, (c) => ((c.qpa ? c.qpa : 1) * (c.unitPrice ? c.unitPrice : 0)));
        const max = _.maxBy(_.filter(vm.ConsolidateQuantity, (dataQty) => (dataQty.quoteQty > dataQty.currentStock) && dataQty.requestQty == item.requestQty && !custartIds.includes(dataQty.componentid)), 'leadTime');
        const summary = {
          isPartCosting: true,
          rfqAssyID: rfqAssyID,
          rfqAssyQtyID: item.rfqAssyQtyID,
          rfqAssyQtyTurnTimeID: item.qtyTimeID,
          requestedQty: (objTotal.qtyID == item.rfqAssyQtyID ? objTotal.requestQty : item.requestQty),
          turnTime: item.turnTime,
          timeType: item.unitOfTime,
          unitPrice: objTotal ? (objTotal.TotalExtendedPrice - (totalExcessPriceOfCustomPart ? totalExcessPriceOfCustomPart : 0)) : null,
          excessQtyTotalPrice: objTotal ? objTotal.TotalExcessPrice : null,
          historyID: historyID,
          days: max ? max.leadTime * 7 : 0,
          nonQuotedConsolidatelineItemIDs: _.map(_.filter(vm.notQuotedList, (noQuote) => !noQuote[item.requestQty]), 'id').join()
        };
        const customPartList = [];
        _.each(customPartDetails, (custPart) => {
          var max = _.maxBy(_.filter(vm.ConsolidateQuantity, (dataQty) => (dataQty.quoteQty > dataQty.currentStock) && dataQty.requestQty == item.requestQty && dataQty.componentid == custPart.componentID), 'leadTime');
          const customPart = {
            mfgPNID: custPart.componentID,
            unitPrice: ((custPart.qpa ? custPart.qpa : 1) * (custPart.unitPrice ? custPart.unitPrice : 0)),
            leadTimeDays: max ? max.leadTime * 7 : 0,
            rfqAssyID: rfqAssyID,
            rfqAssyQtyID: item.rfqAssyQtyID
          };
          customPartList.push(customPart);
        });
        if (customPartList.length > 0) {
          summary.customPartList = customPartList;
        }
        summaryList.push(summary);
      });
      vm.cgBusyLoading = PartCostingFactory.saveSummaryQuote().query({ summaryQuoteObj: summaryList }).$promise.then(() => {
        vm.disableDraft = false;
        vm.disabledSubmit = false;
        //var data = {
        //  disableDraft: false,
        //  disabledSubmit: false
        //}
        //$scope.$emit(PRICING.EventName.Costing_Button_EnableDisable, data);
        PartCostingFactory.removeQuoteSummary().query({ rfqAssyID: rfqAssyID }).$promise.then(() => {
          saveInternalVersion(true);
        });
      }).catch((error) => BaseService.getErrorLog(error));
    };
    //submit part costing detail for summary tab
    vm.submitPricing = () => {
      if (vm.isShowSummary || vm.isSummaryComplete || vm.assyLoading || vm.disabledSubmit || !vm.bom.isMaterialAllow || !vm.bom.isActivityStart || vm.bom.activityStartBy != vm.loginUserId) { return false;}
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.MATERIAL_COSTING_SUBMIT_CONFIRM);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          vm.savePricingHistory(true);
        }
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //clear pricing for selection quantity
    vm.clearSelectionPrice = (qty) => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.COSTING_CLEAR);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          const objqty = _.find(vm.ConsolidateQuantity, (item) => item.requestQty == qty);
          const objPrice = {
            rfqAssyID: parseInt(rfqAssyID)
          };
          if (objqty) {
            objPrice.qtyID = objqty.qtyID;
            vm.cgBusyLoading = PartCostingFactory.cleanSelectionPrice().query({ priceClean: objPrice }).$promise.then(() => {
              vm.pagingInfo.Page = CORE.UIGrid.Page();
              vm.loadData();
            });
          }
        }
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //clear pricing for all quantity
    vm.clearAllPricing = () => {
      if (vm.assyLoading || vm.isSummaryComplete || vm.noParts || !vm.bom.isMaterialAllow || !vm.bom.isActivityStart || vm.bom.activityStartBy != vm.loginUserId) { return false;}
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.COSTING_CLEAR);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          const objPrice = {
            rfqAssyID: parseInt(rfqAssyID)
          };
          vm.cgBusyLoading = PartCostingFactory.cleanPrice().query({ priceClean: objPrice }).$promise.then(() => {
            vm.pagingInfo.Page = CORE.UIGrid.Page();
            vm.loadData();
            vm.disableDraft = false;
            vm.disabledSubmit = false;
          });
        }
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    };
    //

    //get packaging list
    const getpackaging = () => {
      PartCostingFactory.getPackaging().query().$promise.then((packaging) => {
        if (packaging && packaging.data) {
          vm.packagingAll = packaging.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    getpackaging();

    //go to bom
    vm.suggestedAlternates = () => {
      $state.go(RFQTRANSACTION.RFQ_IMPORT_BOM_STATE, { id: rfqAssyID, partId: vm.bom.partID });
      $scope.$parent.$parent.$parent.vm.title = RFQTRANSACTION.RFQ_IMPORT_BOM_LABEL;
      $scope.$parent.$parent.$parent.vm.activeTab = 0;
    };
    //create list for export details
    function exportFilePrice() {
      var pricingList = _.filter(vm.sourceData, (prices) => prices.isPurchase == true && !prices.restrictCPNUseInBOMStep && prices.restrictCPNUsePermanentlyStep && prices.restrictCPNUseWithPermissionStep);
      var priceExportList = [];
      _.each(pricingList, (item) => {
        _.each(item.mfgComponents, (component) => { //&& rest.consolidateID == item.id
          const componentDet = component.split('@@@');
          let componentDetID = null;
          let componentDetMFR = null;
          let componentDetMFRPN = null;
          if (componentDet) {
            componentDetID = componentDet.length > 24 ? Number(componentDet[24]) : null;
            componentDetMFR = componentDet.length > 23 ? componentDet[23] : null;
            componentDetMFRPN = componentDet.length > 22 ? componentDet[22] : null;
          }
          if (!_.find(vm.restrictedParts, { mfgPNID: componentDetID })) {
            const nonRohs = _.find(vm.partNumberList, { mfgPNID: componentDetID });
            if (nonRohs) {
              if (nonRohs.customerApproval === 'P' && nonRohs.RoHSStatusID === RFQTRANSACTION.NON_RoHS) {
                return;
              }
              if (nonRohs.RoHSStatusID === RFQTRANSACTION.TBD || nonRohs.partStatusID === RFQTRANSACTION.TBD ||
                nonRohs.mountingtypeID === RFQTRANSACTION.TBD || nonRohs.functionalCategoryID === RFQTRANSACTION.TBD) {
                return;
              }
            }
            _.each(vm.quantityTotals, (quantity) => {
              const priceGroupDet = _.find(vm.ConsolidateQuantity, { requestQty: quantity.requestQty, consolidateID: item.id });
              let requestQty = quantity.requestQty;
              let qty = (quantity.requestQty) * (item.qpa ? item.qpa : 1);
              if (priceGroupDet && priceGroupDet.rfqPriceGroupId != null) {
                requestQty = priceGroupDet.priceGroupName;
                qty = priceGroupDet.requestQty;
              }
              if (!item[requestQty]) {
                const objPrice = {
                  'ID*': item.id,
                  'Item*': item.lineID,
                  'MFR*': componentDetMFR,
                  'MPN*': componentDetMFRPN ? componentDetMFRPN.replace('***', ',') : '',
                  'Supplier*': null,
                  'Min': null,
                  'Mult': null,
                  'Quantity*': qty,
                  'Supplier Stock*': 0,
                  'Unit Price': null,
                  'Ext. Price': null,
                  TimeStamp: null,
                  'Std. Lead Time (Weeks)': null,
                  'Additional Value Fee': null,
                  Packaging: null,
                  'SPN': null,
                  'NCNR (Yes/No)': null,
                  'Custom Reel (Yes/No)': null
                };
                priceExportList.push(objPrice);
              }
            });
          }
        });
      });
      const TimeStamp = $filter('date')(new Date(), CORE.DateFormatArray[0].format);
      if (priceExportList.length === 0) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.LINE_ITEM_QUOTE);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
      }
      else {
        exportFile(priceExportList, stringFormat('RFQ-{0}-{1}.xls', vm.bom.rfqID, TimeStamp));
      }
    }
    //export document for pricing
    function exportFile(componentList, name) {
      vm.cgBusyLoading = ImportExportFactory.importFile(componentList).then((res) => {
        if (res.data && componentList.length > 0) {
          const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
          if (navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(blob, name);
          } else {
            const link = document.createElement('a');
            if (link.download !== undefined) {
              const url = URL.createObjectURL(blob);
              link.setAttribute('href', url);
              link.setAttribute('download', name);
              link.style = 'visibility:hidden';
              document.body.appendChild(link);
              $timeout(() => {
                link.click();
                document.body.removeChild(link);
              });
            }
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    const _pricingHeader = RFQTRANSACTION.PRICING_COLUMN_MAPPING;
    vm.eroOptions = {
      workstart: function () {
      },
      workend: function () { },
      sheet: function (json, sheetnames, select_sheet_cb, file) {
        var type = file.name.split('.');
        if (_.find(CORE.UPLOAD_DOCUMENT_TYPE, (docType) => docType === type[type.length - 1])) {
          const data = {
            headers: _pricingHeader,
            excelHeaders: json[0],
            notquote: true,
            headerName: RFQTRANSACTION.Price_Header
          };
          DialogFactory.dialogService(
            RFQTRANSACTION.PRICING_COLUMN_MAPPING_CONTROLLER,
            RFQTRANSACTION.PRICING_COLUMN_MAPPING_VIEW,
            vm.event,
            data).then((result) => {
              json[0] = result.excelHeaders;
              generateModel(json, result.model);
            }, (err) => BaseService.getErrorLog(err));
        } else {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.FILE_TYPE_NOT_ALLOWED);
          messageContent.message = stringFormat(messageContent.message, (CORE.UPLOAD_DOCUMENT_TYPE).join());
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
        }
      },
      badfile: function () {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.BOM_UPLOAD_FAIL_TEXT);
        const alertModel = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(alertModel);
      },
      pending: function () {
        // console.log('Pending');
      },
      failed: function () {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.FILE_TYPE_NOT_ALLOWED);
        messageContent.message = stringFormat(messageContent.message, (CORE.UPLOAD_DOCUMENT_TYPE).join());
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
      },
      large: function () {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.BOM_UPLOAD_FAIL_SIZE_TEXT);
        const alertModel = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(alertModel);
      },
      multiplefile: function () {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SINGLE_FILE_UPLOAD);
        const alertModel = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(alertModel);
      }
    };
    // Create model from array
    function generateModel(uploadedPrice, priceHeaders) {
      var pricingmodel = [];
      var i = 1, len = uploadedPrice.length;
      // loop through excel data and bind into model
      for (i, len; i < len; i++) {
        const item = uploadedPrice[i];
        const modelRow = {};
        uploadedPrice[0].forEach((column, index) => {
          if (!column.name) {
            return;
          }
          const obj = priceHeaders.find((x) => x.column && x.column.toUpperCase() === column.name.toUpperCase());
          if (!obj) {
            return;
          }
          const field = _pricingHeader.find((x) => x.fieldName == obj.header);
          if (!modelRow[field.fieldName]) {
            modelRow[field.fieldName] = item[index] ? item[index] : null;
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
        var remark = '';
        var error = '';
        var mfgPN;
        var objLine = _.find(vm.sourceData, (part) => part.id == item.ID && part.lineID == item.Item);
        if (objLine) {
          const partNumberList = [];
          _.each(objLine.mfgComponents, (item) => {
            const mfgpart = item ? item.split('@@@') : null;
            let componentDetMFR = null;
            let componentDetMFRPN = null;
            if (mfgpart) {
              componentDetMFR = mfgpart.length > 23 ? mfgpart[23] : null;
              componentDetMFRPN = mfgpart.length > 22 ? mfgpart[22] : null;
            }
            const objPart = {
              Mfg: componentDetMFR,
              Name: componentDetMFRPN
            };
            partNumberList.push(objPart);
          });
          const mfgCode = _.find(vm.mfgCodeList, (mfgCode) => item.MFR && (mfgCode.mfgCode.toUpperCase() == item.MFR.toString().toUpperCase() || mfgCode.mfgName.toUpperCase() == item.MFR.toString().toUpperCase()) || (_.find(mfgCode.mfgCodeAlias, (codeAlias) => item.MFR && codeAlias.alias.toUpperCase() == item.MFR.toString().toUpperCase())));

          if (mfgCode) {
            mfgPN = _.find(partNumberList, (mfg) => item[vm.LabelConstant.MFG.MFGPN] && (mfg.Mfg.toUpperCase() == mfgCode.mfgCode.toUpperCase() || mfg.Mfg.toUpperCase() == mfgCode.mfgName.toUpperCase()) && mfg.Name.toUpperCase() == item[vm.LabelConstant.MFG.MFGPN].toString().toUpperCase());
          }
          if (!item.MFR) {
            error = stringFormat(RFQTRANSACTION.PRICING.REQUIRED, vm.LabelConstant.MFG.MFG);
            remark = stringFormat('{0},{1}', remark, error);
            isDirty = true;
          }
          else if (item.MFR && !mfgCode) {
            error = stringFormat(RFQTRANSACTION.PRICING.INVALID, vm.LabelConstant.MFG.MFG);
            remark = stringFormat('{0},{1}', remark, error);
            isDirty = true;
          }
          if (!item[vm.LabelConstant.MFG.MFGPN]) {
            error = stringFormat(RFQTRANSACTION.PRICING.REQUIRED, vm.LabelConstant.MFG.MFGPN);
            remark = stringFormat('{0},{1}', remark, error);
            isDirty = true;
          }
          else if (item[vm.LabelConstant.MFG.MFGPN] && !mfgPN) {
            error = stringFormat(RFQTRANSACTION.PRICING.INVALID, vm.LabelConstant.MFG.MFGPN);
            remark = stringFormat('{0},{1}', remark, error);
            isDirty = true;
          }
          if (!item.Min) {
            item.Min = 1;
          }
          else if (item.Min) {
            try {
              item.Min = parseInt(item.Min);
              if (item.Min < 0) {
                error = stringFormat(RFQTRANSACTION.PRICING.INVALID, 'Min');
                remark = stringFormat('{0},{1}', remark, error);
                isDirty = true;
              }
            } catch (err) {
              error = stringFormat(RFQTRANSACTION.PRICING.INVALID, 'Min');
              remark = stringFormat('{0},{1}', remark, error);
              isDirty = true;
            }
          }
          if (!item.Mult) {
            item.Mult = 1;
          }
          else if (item.Mult) {
            try {
              item.Mult = parseInt(item.Mult);
              if (item.Mult < 0) {
                error = stringFormat(RFQTRANSACTION.PRICING.INVALID, 'Mult');
                remark = stringFormat('{0},{1}', remark, error);
                isDirty = true;
              }
            } catch (err) {
              error = stringFormat(RFQTRANSACTION.PRICING.INVALID, 'Mult');
              remark = stringFormat('{0},{1}', remark, error);
              isDirty = true;
            }
          }
          if (!item.Supplier) {
            error = stringFormat(RFQTRANSACTION.PRICING.REQUIRED, 'Supplier');
            remark = stringFormat('{0},{1}', remark, error);
            isDirty = true;
          }
          else if (item.Supplier) {
            const supplierCode = _.find(vm.supplierList, (mfgCode) => mfgCode.isCustOrDisty && ((mfgCode.mfgCode.toUpperCase() == item.Supplier.toUpperCase() || mfgCode.mfgName.toUpperCase() == item.Supplier.toUpperCase()) || (_.find(mfgCode.mfgCodeAlias, (codeAlias) => codeAlias.alias.toUpperCase() == item.Supplier.toUpperCase()))));
            if (!supplierCode) {
              error = stringFormat(RFQTRANSACTION.PRICING.INVALID, 'Supplier');
              remark = stringFormat('{0},{1}', remark, error);
              isDirty = true;
            } else {
              item.Supplier = supplierCode.mfgName;
            }
          }
          if (!item.Quantity) {
            error = stringFormat(RFQTRANSACTION.PRICING.REQUIRED, 'Quantity');
            remark = stringFormat('{0},{1}', remark, error);
            isDirty = true;
          }
          else if (item.Quantity) {
            try {
              item.Quantity = parseInt(item.Quantity);
            } catch (err) {
              error = stringFormat(RFQTRANSACTION.PRICING.INVALID, 'Quantity');
              remark = stringFormat('{0},{1}', remark, error);
              isDirty = true;
            }
          }
          if (!item['Unit Price'] && !item['Ext. Price']) {
            error = stringFormat(RFQTRANSACTION.PRICING.REQUIRED, 'Unit Price');
            remark = stringFormat('{0},{1}', remark, error);
            isDirty = true;
          }
          if (!item['Unit Price'] && item['Ext. Price']) {
            try {
              item['Ext. Price'] = parseFloat(item['Ext. Price']);
              if (item['Ext. Price'] <= 0) {
                error = stringFormat(RFQTRANSACTION.PRICING.INVALID, 'Ext. Price');
                remark = stringFormat('{0},{1}', remark, error);
                isDirty = true;
              }
            } catch (err) {
              error = stringFormat(RFQTRANSACTION.PRICING.INVALID, 'Ext. Price');
              remark = stringFormat('{0},{1}', remark, error);
              isDirty = true;
            }
            if (_.isNaN(item['Ext. Price'])) {
              error = stringFormat(RFQTRANSACTION.PRICING.INVALID, 'Ext. Price');
              remark = stringFormat('{0},{1}', remark, error);
              isDirty = true;
            }
            //As per discussion with DP on 03/07/2020 no need to check validation for price.
            //var isminPrice = _.filter(parts, (minPrice) => { return minPrice.MFR == item.MFR && minPrice["MFR PN"] == item["MFR PN"] && minPrice.Item == item.Item });
            //isminPrice = _.filter(isminPrice, (minPrice) => { return parseInt(minPrice.Quantity) < parseInt(item.Quantity) });
            //var isminPrice = _.find(isminPrice, (minPrice) => { return parseFloat(item["Ext. Price"]) < parseFloat(minPrice["Ext. Price"]) });
            //if (isminPrice) {
            //  error = RFQTRANSACTION.PRICING.EXTPRICE_CHECK_VALIDATION;
            //  remark = stringFormat('{0},{1}', remark, error);
            //  isDirty = true;
            //}
            if (!isDirty) {
              item['Unit Price'] = parseFloat(item['Ext. Price']) / parseInt(item.Quantity);
            }
          }
          if (item['Unit Price']) {
            try {
              item['Unit Price'] = parseFloat(item['Unit Price']);
              if (item['Unit Price'] <= 0) {
                error = stringFormat(RFQTRANSACTION.PRICING.INVALID, 'Unit Price');
                remark = stringFormat('{0},{1}', remark, error);
                isDirty = true;
              }
            } catch (err) {
              error = stringFormat(RFQTRANSACTION.PRICING.INVALID, 'Unit Price');
              remark = stringFormat('{0},{1}', remark, error);
              isDirty = true;
            }
            if (_.isNaN(item['Unit Price'])) {
              error = stringFormat(RFQTRANSACTION.PRICING.INVALID, 'Unit Price');
              remark = stringFormat('{0},{1}', remark, error);
              isDirty = true;
            }
            //if (!isDirty) {
            //  var isminPrice = _.filter(parts, (minPrice) => { return minPrice.MFR == item.MFR && minPrice["MFR PN"] == item["MFR PN"] && minPrice.Item == item.Item });
            //  isminPrice = _.filter(isminPrice, (minPrice) => { return parseInt(minPrice.Quantity) < parseInt(item.Quantity) });
            //  var isminPrice = _.find(isminPrice, (minPrice) => { return parseFloat(item['Unit Price']) > parseFloat(minPrice['Unit Price']) });
            //  if (isminPrice) {
            //    error = RFQTRANSACTION.PRICING.PRICE_CHECK_VALIDATION;
            //    remark = stringFormat('{0},{1}', remark, error);
            //    isDirty = true;
            //  }
            //}
          }

          if (!item['Supplier Stock']) {
            item['Supplier Stock'] = 0;
          }
          else if (item['Supplier Stock']) {
            try {
              item['Supplier Stock'] = parseInt(item['Supplier Stock']);
              if (item['Supplier Stock'] < 0) {
                error = stringFormat(RFQTRANSACTION.PRICING.INVALID, 'Supplier Stock');
                remark = stringFormat('{0},{1}', remark, error);
                isDirty = true;
              }
            } catch (err) {
              error = stringFormat(RFQTRANSACTION.PRICING.INVALID, 'Supplier Stock');
              remark = stringFormat('{0},{1}', remark, error);
              isDirty = true;
            }
          }
          if (item.TimeStamp) {
            try {
              item.TimeStamp = new Date(item.TimeStamp);
            }
            catch (err) {
              error = stringFormat(RFQTRANSACTION.PRICING.INVALID, 'TimeStamp');
              remark = stringFormat('{0},{1}', remark, error);
              isDirty = true;
            }
          }
          if (item['Std. Lead Time']) {
            try {
              item['Std. Lead Time'] = parseFloat(item['Std. Lead Time']);
              if (item['Std. Lead Time'] < 0 && item['Std. Lead Time'] > 9999) {
                error = stringFormat(RFQTRANSACTION.PRICING.INVALID, 'Std. Lead Time');
                remark = stringFormat('{0},{1}', remark, error);
                isDirty = true;
              }
            }
            catch (err) {
              error = stringFormat(RFQTRANSACTION.PRICING.INVALID, 'Std. Lead Time');
              remark = stringFormat('{0},{1}', remark, error);
              isDirty = true;
            }
          }
          if (item.Packaging) {
            const objPackage = _.find(vm.packagingAll, (pakg) => pakg.name.toUpperCase() == item.Packaging.toUpperCase() || (_.find(pakg.component_packagingmst, (pkgAlias) => pkgAlias.alias.toUpperCase() == item.Packaging.toUpperCase())));
            if (!objPackage) {
              error = stringFormat(RFQTRANSACTION.PRICING.INVALID, 'Packaging');
              remark = stringFormat('{0},{1}', remark, error);
              isDirty = true;
            }
          }
          if (item.NCNR) {
            const isexist = _.find(RFQTRANSACTION.CUSTOM_STATUS, (status) => status.Name.toUpperCase() == item.NCNR.toUpperCase());
            if (!isexist) {
              error = stringFormat(RFQTRANSACTION.PRICING.INVALID, 'NCNR');
              remark = stringFormat('{0},{1}', remark, error);
              isDirty = true;
            } else {
              item.NCNR = isexist.Name;
            }
          }
          if (item['Custom Reel']) {
            const isexist = _.find(RFQTRANSACTION.CUSTOM_STATUS, (status) => status.Name.toUpperCase() == item['Custom Reel'].toUpperCase());
            if (!isexist) {
              error = stringFormat(RFQTRANSACTION.PRICING.INVALID, 'Custom Reel');
              remark = stringFormat('{0},{1}', remark, error);
              isDirty = true;
            }
            else {
              item['Custom Reel'] = isexist.Name;
            }
          }
          if (item['Additional Value Fee']) {
            try {
              item['Additional Value Fee'] = parseFloat(item['Additional Value Fee']);
            }
            catch (err) {
              error = stringFormat(RFQTRANSACTION.PRICING.INVALID, 'Additional Value Fee');
              remark = stringFormat('{0},{1}', remark, error);
              isDirty = true;
            }
          }
          if (isDirty) {
            item.Remark = remark.substring(1);
            errorPrice.push(item);
          }
        }
        else {
          item.remark = stringFormat(RFQTRANSACTION.PRICING.INVALID, 'Line Item');
          errorPrice.push(item);
        }
      });
      if (errorPrice.length > 0) {
        exportFile(errorPrice, 'errorPricing.xls');
      } else {
        const autocompleteQtyPromise = [getnonQuoteQtyItems()];
        vm.cgBusyLoading = $q.all(autocompleteQtyPromise).then((responses) => {
          if (responses) {
            vm.pricingsetting = responses[0].priceSetting;
            saveExportPricing(parts);
          }
        });
      }
    }
    const getUnitList = () => {
      SalesOrderFactory.getUnitList().query().$promise.then((unitlist) => {
        vm.UnitList = unitlist.data;
      }).catch((error) => BaseService.getErrorLog(error));
    };
    getUnitList();
    //get pricing list
    function getPricingList() {
      return PartCostingFactory.retrievePricingList().query({ rfqAssyID: rfqAssyID, isPurchaseApi: false }).$promise.then((list) => {
        if (list && list.data) {
          return list.data.pricing;
        }
        return list.data;
      }).catch((error) => BaseService.getErrorLog(error));
    }
    //get not quoted line items and price settings
    function getnonQuoteQtyItems() {
      return PartCostingFactory.getnonQuotedQty().query({ rfqAssyID: rfqAssyID, isPurchaseApi: false }).$promise.then((list) => {
        if (list && list.data) {
          return list.data;
        }
        return list.data;
      }).catch((error) => BaseService.getErrorLog(error));
    }
    //get price break details
    function retrievePriceBreak(startDate, endDate) {
      const pObj = {
        timeStamp: startDate,
        toDate: endDate,
        Type: 'Manual'
      };
      return PartCostingFactory.retrievePriceBreak().query({ pricingObj: pObj }).$promise.then((qtyBreak) => {
        if (qtyBreak && qtyBreak.data) {
          vm.qtyBreakList = qtyBreak.data.qtyBreak;
        }
        return vm.qtyBreakList;
      }).catch((error) => BaseService.getErrorLog(error));
    };
    //save details of pricing in database
    const saveExportPricing = (parts) => {
      var list = groupByMulti(parts, ['ID', vm.LabelConstant.MFG.MFGPN]);
      var priceListForPrice = [];
      _.each(list, (unitList) => {
        _.each(unitList, (partNumber) => {
          var priceBreakList = [];
          var assyQtyBreak = [];
          const mfgParts = partNumber[0];
          const objLine = _.find(vm.sourceData, (part) => part.id == mfgParts.ID && part.lineID == mfgParts.Item);
          if (objLine) {
            const currentObj = _.find(vm.partNumberList, (cPartNumber) => cPartNumber.mfgPN.toUpperCase() == mfgParts[vm.LabelConstant.MFG.MFGPN].toUpperCase() && (mfgParts.MFR.toUpperCase() == cPartNumber.mfgName.toUpperCase() || mfgParts.MFR.toUpperCase() == cPartNumber.mfgCode.toUpperCase()));
            let selectPartNumber;
            if (currentObj) {
              selectPartNumber = currentObj;
            }
            if (selectPartNumber && !_.find(vm.restrictedParts, (rest) => rest.mfgPNID == selectPartNumber.mfgPNID && rest.consolidateID == mfgParts.ID)) {
              if (mfgParts.Packaging) {
                const objPackage = _.find(vm.packagingAll, (pakg) => pakg.name.toUpperCase() == mfgParts.Packaging.toUpperCase() || (_.find(pakg.component_packagingmst, (pkgAlias) => pkgAlias.alias.toUpperCase() == mfgParts.Packaging.toUpperCase())));
              }
              const supplierCode = _.find(vm.supplierList, (mfgCode) => mfgCode.isCustOrDisty && ((mfgCode.mfgCode.toUpperCase() == mfgParts.Supplier.toUpperCase() || mfgCode.mfgName.toUpperCase() == mfgParts.Supplier.toUpperCase()) || (_.find(mfgCode.mfgCodeAlias, (codeAlias) => codeAlias.alias.toUpperCase() == mfgParts.Supplier.toUpperCase()))));
              if (selectPartNumber.noOfPosition && selectPartNumber.connecterTypeID === RFQTRANSACTION.DEFAULT_ID.HEADER_BREAKWAY) {
                objLine.uomID = RFQTRANSACTION.DEFAULT_ID.PINUOM;
              }
              const BomUnit = _.find(vm.UnitList, (uoms) => uoms.id == objLine.uomID);
              const CompUnit = _.find(vm.UnitList, (uoms) => uoms.id == selectPartNumber.uom);
              let stock = parseInt(mfgParts['Supplier Stock']);
              if (BomUnit && CompUnit) {
                stock = stock * (selectPartNumber.unit ? selectPartNumber.unit : 1);
                const fromBasedUnitValues = (CompUnit.baseUnitConvertValue);
                const toBasedUnitValues = BomUnit.baseUnitConvertValue;
                const ConvertFromValueIntoBasedValue = (stock / fromBasedUnitValues);
                stock = ConvertFromValueIntoBasedValue * toBasedUnitValues;
              }
              if (selectPartNumber.noOfPosition && selectPartNumber.connecterTypeID === RFQTRANSACTION.DEFAULT_ID.HEADER_BREAKWAY) {
                stock = stock * (selectPartNumber.noOfPosition);
              }
              const objCustom = _.find(objLine.lineItemCustoms, (item) => item.id == objLine.id && item.custom);
              const supplierQty = {
                ConsolidateID: parseInt(mfgParts.ID),
                MinimumBuy: parseInt(mfgParts.Min),
                Active: true,
                PartNumberId: selectPartNumber ? selectPartNumber.mfgPNID : null,
                SupplierPN: mfgParts['Supplier PN'],
                SourceOfPrice: 'Manual',
                Packaging: mfgParts.Packaging,
                Authorized_Reseller: true,
                ManufacturerPartNumber: mfgParts[vm.LabelConstant.MFG.MFGPN],
                APILeadTime: parseFloat(mfgParts['Std. Lead Time']),
                Multiplier: parseInt(mfgParts.Mult),
                ManufacturerName: stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, selectPartNumber.mfgCode, selectPartNumber.mfgName),
                SupplierName: mfgParts.Supplier,
                PurchaseUom: selectPartNumber ? selectPartNumber.unitName : null,
                OrgInStock: parseInt(mfgParts['Supplier Stock']),
                NCNR: mfgParts.NCNR,
                RoHS: selectPartNumber ? selectPartNumber.name : null,
                Reeling: mfgParts['Custom Reel'],
                PartStatus: selectPartNumber ? selectPartNumber.partStatusName : null,
                LTBDate: null,
                IsDeleted: false,
                PIDCode: selectPartNumber ? selectPartNumber.PIDCode : null,
                PriceType: 'Standard',
                rfqAssyID: parseInt(rfqAssyID),
                ApiNoOfPosition: selectPartNumber ? selectPartNumber.noOfPosition : null,
                NoOfPosition: currentObj ? currentObj.numOfposition : null,
                noOfRows: selectPartNumber ? selectPartNumber.noOfRows : null,
                partPackage: selectPartNumber ? selectPartNumber.partPackage : null,
                isPackaging: selectPartNumber.isPackaging ? true : false,
                mfgPNDescription: selectPartNumber ? selectPartNumber.mfgPNDescription : null,
                mfgCodeID: selectPartNumber ? selectPartNumber.mfgCodeID : null,
                packageID: mfgParts.Packaging && objPackage ? objPackage.id : null,
                SupplierID: supplierCode ? supplierCode.id : null,
                OtherStock: stock,
                BOMAbbrivation: BomUnit ? BomUnit.abbreviation : null,
                PartAbbrivation: selectPartNumber ? selectPartNumber.abbrivation : null,
                MountingTypeID: selectPartNumber ? selectPartNumber.mountingtypeID : null,
                FunctionalTypeID: selectPartNumber ? selectPartNumber.functionalCategoryID : null,
                MountingType: selectPartNumber ? selectPartNumber.mountName : null,
                FunctionalType: selectPartNumber ? selectPartNumber.partTypeName : null,
                qpa: objLine.qpa ? objLine.qpa : 1,
                bomUnitID: BomUnit.id,
                componentUnitID: selectPartNumber.uom,
                packageQty: selectPartNumber.unit,
                PackageSPQQty: selectPartNumber.packageQty,
                connectorTypeID: selectPartNumber ? selectPartNumber.connecterTypeID : null,
                AuthorizeSupplier: supplierCode ? supplierCode.authorizeType : null,
                rohsIcon: selectPartNumber ? selectPartNumber.rohsIcon : null,
                isPurchaseApi: false,
                AdditionalValueFee: mfgParts['Additional Value Fee'] ? mfgParts['Additional Value Fee'] : 0,
                isCustom: objCustom ? true : false
              };
              _.each(partNumber, (pBreak) => {
                var priceBreak = {
                  componentID: selectPartNumber ? selectPartNumber.mfgPNID : null,
                  mfgPN: mfgParts[vm.LabelConstant.MFG.MFGPN],
                  supplier: mfgParts.Supplier,
                  supplierPN: mfgParts['Supplier PN'],
                  price: parseFloat(pBreak['Unit Price']),
                  qty: parseInt(pBreak.Quantity),
                  Packaging: mfgParts.Packaging,
                  isCustomPrice: false,
                  Type: 'Manual',
                  packagingID: mfgParts.Packaging && objPackage ? objPackage.id : null,
                  leadTime: pBreak['Std. Lead Time'] ? parseFloat(pBreak['Std. Lead Time']) : 0,
                  supplierID: supplierCode ? supplierCode.id : null
                };
                priceBreakList.push(priceBreak);
              });
              _.each(vm.quantityTotals, (assyQty) => {
                var price;
                var unitPrice;
                var leadTime;
                var requestQty = assyQty.requestQty * (objLine.qpa ? objLine.qpa : 1);

                if (BomUnit) {  //common code for each
                  const fromBasedUnitValues = (BomUnit.baseUnitConvertValue) * (selectPartNumber.unit ? selectPartNumber.unit : 1);
                  const toBasedUnitValues = CompUnit.baseUnitConvertValue;
                  const ConvertFromValueIntoBasedValue = (requestQty / fromBasedUnitValues);
                  requestQty = parseInt(Math.ceil(ConvertFromValueIntoBasedValue * toBasedUnitValues)) == 0 ? 1 : parseInt(Math.ceil(ConvertFromValueIntoBasedValue * toBasedUnitValues));
                }
                if (selectPartNumber.noOfPosition && selectPartNumber.connecterTypeID === RFQTRANSACTION.DEFAULT_ID.HEADER_BREAKWAY) {
                  currentObj.numOfposition = currentObj.numOfposition ? currentObj.numOfposition : 1;
                  requestQty = requestQty * (currentObj.numOfposition);
                  const noOfPositionDiff = parseFloat((selectPartNumber.noOfPosition) - ((selectPartNumber.noOfPosition) % (currentObj.numOfposition)));
                  if (noOfPositionDiff == 0) {
                    return;
                  }
                  requestQty = requestQty / noOfPositionDiff;
                }
                let ordQty = Math.max((Math.ceil((requestQty) / supplierQty.Multiplier) * supplierQty.Multiplier), supplierQty.MinimumBuy);
                const ActualQty = ordQty;
                let priceBreakDetail;
                if (objCustom) {
                  const settingType = RFQTRANSACTION.PRICE_SELECTEION_SETTING_TYPE.CUSTOM_PART_SELECTION.value;
                  const setting = _.find(vm.pricingsetting, (set) => set.requestQty == assyQty.requestQty && set.settingType == settingType);
                  if (setting && setting.isLeadTime) {
                    let consolidateList = _.filter(priceBreakList, (consolidate) => consolidate.qty == ordQty);
                    if (consolidateList.length == 0) {
                      let pricelst = _.orderBy(_.filter(priceBreakList, (consolidate) => consolidate.qty < ordQty && consolidate.leadTime <= (setting.leadTime ? setting.leadTime : 1)), ['qty', 'price'], ['ASC', 'ASC']);
                      if (pricelst.length > 0) {
                        priceBreakDetail = pricelst[pricelst.length - 1];
                      }
                      else {
                        pricelst = _.orderBy(_.filter(priceBreakList, (consolidate) => consolidate.qty < ordQty), ['qty', 'price'], ['ASC', 'ASC']);
                        if (pricelst.length > 0) {
                          priceBreakDetail = pricelst[pricelst.length - 1];
                        } else {
                          priceBreakDetail = _.orderBy(priceBreakList, ['qty', 'price'], ['ASC', 'ASC'])[0];
                        }
                      }
                    } else {
                      const actualConsolidateList = angular.copy(consolidateList);
                      consolidateList = _.filter(consolidateList, (consolidate) => consolidate.leadTime <= (setting.leadTime ? setting.leadTime : 1));
                      if (consolidateList.length == 0) {
                        consolidateList = actualConsolidateList;
                      }
                      priceBreakDetail = _.minBy(consolidateList, 'price');
                    }
                  } else {
                    const consolidateList = _.filter(priceBreakList, (consolidate) => consolidate.qty == ordQty);
                    if (consolidateList.length == 0) {
                      const pricelst = _.orderBy(_.filter(priceBreakList, (consolidate) => consolidate.qty < ordQty), ['qty', 'price'], ['ASC', 'ASC']);
                      if (pricelst.length > 0) {
                        priceBreakDetail = pricelst[pricelst.length - 1];
                      } else {
                        priceBreakDetail = _.orderBy(priceBreakList, ['qty', 'price'], ['ASC', 'ASC'])[0];
                      }
                    } else {
                      priceBreakDetail = _.minBy(consolidateList, 'price');
                    }
                  }
                } else {
                  priceBreakDetail = _.find(priceBreakList, (qtyBreak) => qtyBreak.qty == ordQty);
                }
                if (priceBreakDetail) {
                  unitPrice = parseFloat(priceBreakDetail.price);
                  price = parseFloat((priceBreakDetail.price * ordQty).toFixed(_unitPriceFilterDecimal));
                  leadTime = parseFloat(priceBreakDetail.leadTime);
                }
                else {
                  let priceList = _.sortBy(_.filter(priceBreakList, (qtyBreak) => qtyBreak.qty < ordQty), (o) => o.qty);
                  if (priceList.length == 0) {
                    priceList = _.sortBy(priceBreakList, (qtyBreak) => qtyBreak.qty);
                  }
                  unitPrice = parseFloat(priceList[priceList.length - 1].price);
                  price = parseFloat((priceList[priceList.length - 1].price * ordQty).toFixed(_unitPriceFilterDecimal));
                  leadTime = parseFloat(priceList[priceList.length - 1].leadTime);
                }
                let ActualPrice = unitPrice;
                if (BomUnit) {
                  unitPrice = (unitPrice * (CompUnit.baseUnitConvertValue ? CompUnit.baseUnitConvertValue : 1)) / ((selectPartNumber.unit ? selectPartNumber.unit : 1) * (BomUnit.baseUnitConvertValue ? BomUnit.baseUnitConvertValue : 1));
                  const toBasedUnitValues = (BomUnit.baseUnitConvertValue) * (selectPartNumber.unit ? selectPartNumber.unit : 1);
                  const fromBasedUnitValues = CompUnit.baseUnitConvertValue;
                  const ConvertFromValueIntoBasedValue = (ordQty / fromBasedUnitValues);
                  ordQty = parseInt(Math.ceil(ConvertFromValueIntoBasedValue * toBasedUnitValues)) == 0 ? 1 : parseInt(Math.ceil(ConvertFromValueIntoBasedValue * toBasedUnitValues));
                  //require quantity for price
                  // ConvertFromValueIntoBasedValue = (requestQty / fromBasedUnitValues);
                  requestQty = parseInt(assyQty.requestQty * (objLine.qpa ? objLine.qpa : 1));
                }
                if (selectPartNumber.noOfPosition && selectPartNumber.connecterTypeID === RFQTRANSACTION.DEFAULT_ID.HEADER_BREAKWAY) {
                  ordQty = ordQty * (selectPartNumber.noOfPosition);
                  unitPrice = unitPrice / (selectPartNumber.noOfPosition);
                  requestQty = requestQty * (currentObj.numOfposition);
                }
                if (supplierQty.AdditionalValueFee) {
                  //Add value for additional value
                  const additionalValue = parseFloat(supplierQty.AdditionalValueFee) / parseInt(ordQty);
                  unitPrice = unitPrice + additionalValue;
                  ActualPrice = ActualPrice + additionalValue;
                }
                const assyQtyObj = {
                  RfqAssyQtyId: assyQty.qtyID,
                  isDeleted: false,
                  ConsolidateID: parseInt(mfgParts.ID),
                  CurrentQty: assyQty.requestQty,
                  OrderQty: parseInt(ordQty),
                  PricePerPart: unitPrice,
                  leadTime: leadTime,
                  TotalDollar: price,
                  RequireQty: requestQty,
                  ActualPrice: ActualPrice,
                  ActualQty: ActualQty
                };
                assyQtyBreak.push(assyQtyObj);
              });
              const priceListBreak = {
                priceBreakList: priceBreakList,
                assyQtyBreak: assyQtyBreak,
                supplierQty: supplierQty
              };
              priceListForPrice.push(priceListBreak);
            }
          }
        });
      });

      savePricing(priceListForPrice);
    };
    function savePricing(priceListForPrice) {
      vm.cgBusyLoading = PartCostingFactory.saveImportPricing().query({ objManualPrice: priceListForPrice }).$promise.then(() => {
        vm.pagingInfo.Page = CORE.UIGrid.Page();
        vm.loadData();
      }).catch((error) => BaseService.getErrorLog(error));
    }
    function getTotalCount() {
      vm.cgBusyLoading = PartCostingFactory.getNotQuoteNRNDCount().query({ id: rfqAssyID }).$promise.then((list) => {
        if (list && list.data) {
          vm.notQuotedList = list.data.NotQuotedList;
          checkCount(list.data);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    //save history for pricing which is selected in list
    vm.savePricingHistory = (isSubmit) => {
      getRFQAssyDetailsByID(isSubmit);
    };

    function getRFQAssyDetailsByID(isSave) {
      BOMFactory.getAssyDetails().query({ id: rfqAssyID }).$promise.then((response) => {
        if (response && response.data) {
          vm.pidCode = response.data.componentAssembly.PIDCode;
          vm.isSummaryComplete = response.data.isSummaryComplete;
          if (vm.isSummaryComplete) {
            if (BOMFactory.isBOMChanged) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.QUOTE_ALREADY_SUBMIT);
              messageContent.message = stringFormat(messageContent.message, vm.pidCode, 'pricing');
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              return DialogFactory.messageAlertDialog(model).then(() => {
                BOMFactory.isBOMChanged = false;
                vm.loadData();
              }, () => {
                BOMFactory.isBOMChanged = false;
              }).catch((error) => BaseService.getErrorLog(error));
            }
            else {
              vm.loadData();
            }
          }
          else if (!vm.isSummaryComplete) {
            savePriceHistory(isSave);
          }
        }
      }).catch((error) => {
        BaseService.getErrorLog(error);
        return null;
      });
    };

    function savePriceHistory(isSubmit) {
      var objHistory = {
        rfqAssyID: rfqAssyID,
        isSubmit: isSubmit
      };
      vm.cgBusyLoading = PartCostingFactory.savePricingHistory().query({ historyObj: objHistory }).$promise.then((response) => {
        if (isSubmit) {
          savePartCostingPrice(response.data.historyID);
        } else {
          vm.disableDraft = true;
          vm.disabledSubmit = false;
          //var data = {
          //  disableDraft: true,
          //  disabledSubmit: false
          //}
          //$scope.$emit(PRICING.EventName.Costing_Button_EnableDisable, data);
          saveInternalVersion(false);
        }
      });
    }

    //get loa price from customer
    function getComponentCustomer() {
      return MasterFactory.getComponentCustomer().query({ customerID: vm.bom.customerID }).$promise.then((loaprice) => loaprice.data).catch((error) => BaseService.getErrorLog(error));
    }

    function saveInternalVersion(isSubmit) {
      var objSubmit = {
        pAssyId: rfqAssyID,
        isPricing: true,
        issubmit: isSubmit
      };
      BOMFactory.saveInternalVersionAssy().query(objSubmit).$promise.then(() => {

      }).catch((error) => BaseService.getErrorLog(error));
    }

    //open popup for price selection setting
    vm.PriceSetting = (ev) => {
      if (vm.assyLoading || vm.isSummaryComplete || !vm.bom.isMaterialAllow || !vm.bom.isActivityStart || vm.bom.activityStartBy != vm.loginUserId) {
        return false;
      }
      const data = {
        rfqAssyID: rfqAssyID
      };
      DialogFactory.dialogService(
        CORE.ASSY_QTY_PRICE_SELECT_SETTING_CONTROLLER,
        CORE.ASSY_QTY_PRICE_SELECT_SETTING_VIEW,
        ev,
        data).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };

    // stop all pricing request
    vm.StopAllPricing = () => {
      vm.cgBusyLoading = PartCostingFactory.stopPricingRequests().query({
        pricingApiObj: {
          rfqAssyID: rfqAssyID,
          isPurchaseApi: false
        }
      }).$promise.then((res) => {
        vm.assyLoading = false;
        vm.isClearPriceShow = true;
        $scope.$emit(PRICING.EventName.Costing_Button_EnableDisable);
        recalculatePriceItems(true);
        NotificationFactory.somethingWrong(res.data.msg);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* open popup for add-edit comments */
    vm.rfqLineitemsDiscription = (ev) => {
      if (vm.isSummaryComplete || !vm.bom.isMaterialAllow || vm.assyLoading || !vm.bom.isActivityStart || vm.bom.activityStartBy != vm.loginUserId) { return false;}
      const data = {
        rfqAssyID: rfqAssyID,
        partID: vm.bom.partID,
        isHideNote: true
      };
      DialogFactory.dialogService(
        RFQTRANSACTION.RFQ_LINEITEMS_DESCRIPTION_CONTROLLER,
        RFQTRANSACTION.RFQ_LINEITEMS_DESCRIPTION_VIEW,
        ev,
        data).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    };
    // open popup for pricong history
    vm.showPricingHistory = (ev) => {
      if (!vm.bom.isActivityStart || vm.bom.activityStartBy != vm.loginUserId) { return false;}
      const data = {
        rfqAssyID: rfqAssyID
      };
      DialogFactory.dialogService(
        RFQTRANSACTION.PRICE_HISTORY_POPUP_CONTROLLER,
        RFQTRANSACTION.PRICE_HISTORY_POPUP_VIEW,
        ev,
        data).then(() => {
        }, () => {
        }, (error) => BaseService.getErrorLog(error));
    };
    //chnage filter option
    vm.pricingChange = (pricingID) => {
      if (RFQTRANSACTION.PRICE_FILTER.GetLeadTimeRiskLineItems.ID != pricingID) {
        const Price = _.find(RFQTRANSACTION.PRICING_FILTER, (item) => item.ID == pricingID);
        if (Price) {
          pricingFilterName(Price);
        }
      }
      else {
        vm.leadTimeSearch();
      }
    };
    //check lead time
    vm.leadTimeSearch = () => {
      var lead = vm.lead;
      if (vm.lead && vm.Option === 'D') {
        lead = parseInt(Math.floor(vm.lead / 5));
      }
      if (lead || lead == 0) {
        RFQTRANSACTION.PRICE_FILTER.GetLeadTimeRiskLineItems.leadTime = lead;
        pricingFilterName(RFQTRANSACTION.PRICE_FILTER.GetLeadTimeRiskLineItems);
      }
    };
    //update count for filter after refresh
    const checkCount = (data) => {
      if (data) {
        const notQuote = _.find(vm.PricingFilters, (quote) => quote.ID === RFQTRANSACTION.PRICE_FILTER.GetRFQUnQuotedLineItems.ID);
        if (notQuote) {
          notQuote.Name = stringFormat('{0} ({1})', RFQTRANSACTION.PRICE_FILTER.GetRFQUnQuotedLineItems.Name, data.CountNotQuote);
        }
        const obsolate = _.find(vm.PricingFilters, (quote) => quote.ID === RFQTRANSACTION.PRICE_FILTER.GetRFQMaterialAtRiskLineItems.ID);
        if (obsolate) {
          obsolate.Name = stringFormat('{0} ({1})', RFQTRANSACTION.PRICE_FILTER.GetRFQMaterialAtRiskLineItems.Name, data.CountObsolate);
        }
        const manualPrice = _.find(vm.PricingFilters, (quote) => quote.ID === RFQTRANSACTION.PRICE_FILTER.GetRFQManualSelectPrice.ID);
        if (manualPrice) {
          manualPrice.Name = stringFormat('{0} ({1})', RFQTRANSACTION.PRICE_FILTER.GetRFQManualSelectPrice.Name, data.CountManual);
        }
        const DNPItemCount = _.find(vm.PricingFilters, (quote) => quote.ID === RFQTRANSACTION.PRICE_FILTER.GetCostingNotRequiredDNP.ID);
        if (DNPItemCount) {
          DNPItemCount.Name = stringFormat('{0} ({1})', RFQTRANSACTION.PRICE_FILTER.GetCostingNotRequiredDNP.Name, data.DNPItemCount);
        }
      }
    };

    //check custom parts
    vm.checkAllCustomParts = () => {
      const customPriceList = _.filter(vm.sourceData, (item) => item.isCustom);

      if (vm.sourceData && customPriceList.length == vm.sourceData.length) {
        return true;
      }
      return false;
    };
    //clear price confirmation
    vm.clearselectedPrice = (row) => {
      if (!row.isPurchase || row.isDisabled || vm.isSummaryComplete || (vm.bom && (!vm.bom.isActivityStart || vm.bom.activityStartBy != vm.loginUserId))) { return false;}
      let isselectedPrice = false;
      if (vm.ConsolidateQuantity.length > 0) {
        _.each(vm.ConsolidateQuantity, (qtyPercentage) => {
          if (row[qtyPercentage.requestQty] || row[qtyPercentage.priceGroupName]) {
            isselectedPrice = true;
          }
        });
      }
      if (!isselectedPrice) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.CLEAR_PRICE_ALERT);
        messageContent.message = stringFormat(messageContent.message, row.lineID);
        const obj = {
          multiple: true,
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(obj).then(() => {
        });
        return;
      } else {
        //confirmation
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.CLEAR_PRICE_CONFIRMATION);
        messageContent.message = stringFormat(messageContent.message, row.lineID);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.cgBusyLoading = PartCostingFactory.clearSelectedqtyPrice().query({ id: row.id }).$promise.then(() => {
              vm.pagingInfo.Page = 1;
              vm.loadData();
              vm.disableDraft = false;
              vm.disabledSubmit = false;
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    //close pop-up on destroy page
    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, {
        closeAll: true
      });
      if ($mdSidenav('price-selector') && $mdSidenav('price-selector').isOpen()) {
        $mdSidenav('price-selector').close();
      }
    });
  }
})();
