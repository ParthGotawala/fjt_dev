(function () {
    'use strict';

    angular
        .module('app.rfqtransaction')
        .controller('MaterialsAtRiskController', MaterialsAtRiskController);

    /** @ngInject */
    function MaterialsAtRiskController($filter, $state, $scope, $timeout, $stateParams, $mdSidenav, RFQTRANSACTION, BOMFactory, PartCostingFactory,
        DialogFactory, CORE, PRICING, BaseService, uiGridGroupingConstants) {
        const vm = this;
        vm.isExpand = true;
        var rfqAssyBomID = $stateParams.id;
        vm.EmptyMesssage = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.MATERIAL_RISK;
        var PartCosting = RFQTRANSACTION.PART_COSTING;
        vm.isHideDelete = true;

        //paging details for grid
        vm.pagingInfo = {
            Page: CORE.UIGrid.Page(),
            SortColumns: [['lineID', 'ASC']],
            SearchColumns: [],
            id: rfqAssyBomID
        };
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
            exporterCsvFilename: 'Materials At Risk.csv',
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
                     width: '80',
                     cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
                     enableCellEdit: false,
                     allowCellFocus: false,

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
                     field: 'partTypeName',
                     displayName: 'Part Types',
                     width: '150',
                     cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
                     enableCellEdit: false,
                     allowCellFocus: false,
                 },
                {
                    field: 'name',
                    displayName: 'Part Class',
                    width: '100',
                    cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
                    enableCellEdit: false,
                    allowCellFocus: false,
                },
                {
                    field: 'PartStatus',
                    displayName: 'Description',
                    width: '200',
                    cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >\
                                            <a>\
                                                <div ng-bind-html="grid.appScope.$parent.vm.getPartDetails(row.entity)"></div>\
                                            </a>\
                                        </div>',
                    enableCellEdit: false,
                    allowCellFocus: false,
                },
                {
                    field: 'PartStatus',
                    displayName: 'Part Status',
                    width: '120',
                    cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
                    visible: false,
                    enableCellEdit: false,
                    allowCellFocus: false,
                },
                {
                    field: 'LTBDate',
                    displayName: 'LTB Date',
                    width: '80',
                    cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
                    visible: false,
                    enableCellEdit: false,
                    allowCellFocus: false,
                },
                {
                    field: 'EOLDate',
                    displayName: 'EOL Date',
                    width: CORE.UI_GRID_COLUMN_WIDTH.ONLY_DATE_COLUMN,
                    cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
                    visible: false,
                    enableCellEdit: false,
                    allowCellFocus: false,
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
            });
        };


        //get list of consolidated part number rfq line items and shows with its pricing
        vm.loadData = () => {
            vm.sourceData = [];
            vm.cgBusyLoading = PartCostingFactory.retrieveMaterialAtRiskLineItems(vm.pagingInfo).query().$promise.then((consolidatemfg) => {
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
                            if (BaseService.checkForVisibleColumnInGrid(PartCosting, keys, vm.sourceHeader)
                                && keys != PartCosting.PartTypeName
                                && keys != PartCosting.PartClassName
                                && keys != PartCosting.QPA) {
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
                                    allowCellFocus: false,
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
                }
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        }
        //it will use for infinite scroll and concate data 
        vm.getDataDown = () => {
            vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
            vm.cgBusyLoading = PartCostingFactory.retrieveMaterialAtRiskLineItems(vm.pagingInfo).query().$promise.then((consolidatemfg) => {
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
        vm.getPartDetails = (enitity) => {
            let strDetails = '<span class="quantityDetails"><span class="label-header">Part Status:</span> ' + enitity.PartStatus + '</span>';
            if (enitity.LTBDate) {
                strDetails += '</br></br><span class="quantityDetails"><span class="label-header">\LTB Date</span> : ' + $filter('date')(enitity.LTBDate, _dateDisplayFormat) + '</span></br>';
            }
            if (enitity.EOLDate) {
                strDetails += '</br></br><span class="quantityDetails"><span class="label-header">\EOL Date</span> : ' + $filter('date')(enitity.EOLDate, _dateDisplayFormat) + '</span></br>';
            }
            return strDetails;
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

    }
})();