(function () {
    'use strict';

    angular
        .module('app.rfqtransaction')
        .controller('SuggestedAlternativeController', SuggestedAlternativeController);

    /** @ngInject */
    function SuggestedAlternativeController($filter, $state, $scope, $timeout, $stateParams, $mdSidenav, RFQTRANSACTION, BOMFactory, PartCostingFactory,
        DialogFactory, CORE, PRICING, BaseService, uiGridGroupingConstants) {
        const vm = this;
        vm.isExpand = true;
        var rfqAssyBomID = $stateParams.id;
        vm.EmptyMesssage = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.SUGGESTED_ALTERNATIVE;
        var PartCosting = RFQTRANSACTION.PART_COSTING;
      vm.isHideDelete = true;
      vm.MfgLabelConstant = vm.LabelConstant.MFG;

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
            exporterCsvFilename: 'Suggested Alternative.csv',
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

                 },
                 {
                     field: 'partTypeName',
                     displayName: 'Part Types',
                     width: '150',
                     cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
                     enableCellEdit: false,
                 },
                {
                    field: 'name',
                    displayName: 'Part Class',
                    width: '100',
                    cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
                    enableCellEdit: false,
                },
                 {
                     field: 'selectedPIDCode',
                     displayName: vm.MfgLabelConstant.MFGPN,
                     cellTemplate: '<div layout="row" style="padding:5px;height: 100%;overflow: hidden; white-space: nowrap;\" class=\"height-grid ui-grid-cell-contents\">\
                                        <div style="overflow: hidden; height: auto !important;"> \
                                            <div ng-class="[row.entity.PartStatus==\'Obsolete\'?\'background-grey\':row.entity.isEpoxy?\'background-red\':\'\']">\
                                                     {{grid.appScope.$parent.vm.isExpand ? row.entity.selectedPIDCode : ($index>1 ? "" : row.entity.selectedPIDCode)}}\
                                                    <md-icon ng-if="row.entity.selectedRoHSStatus == \'1\'" class="icon-leaf green-fg">\
                                                            <md-tooltip md-direction="top">\
                                                                RoHS Complaint\
                                                            </md-tooltip>\
                                                    </md-icon>\
                                                    <md-icon ng-if="row.entity.selectedRoHSStatus != \'1\'" class="icon-leaf icon-no-leaf red-fg">\
                                                            <md-tooltip md-direction="top">\
                                                                Non-RoHS Complaint\
                                                            </md-tooltip>\
                                                    </md-icon>\
                                                    <md-icon class="icon-content-copy cursor-pointer color-black padding-top-5 margin-0" style="min-width: 16px;width: 16px" ng-if="row.entity.selectedPIDCode" ng-click="grid.appScope.$parent.vm.copyMFGPNText(row.entity.selectedPIDCode)" ng-mouseover="grid.appScope.$parent.vm.MFGPNStatus()">\
                                                            <md-tooltip md-direction="top" ng-show="!grid.appScope.$parent.vm.showMFGPNstatus">\
                                                                Copy\
                                                            </md-tooltip>\
                                                            <md-tooltip md-direction="bottom" ng-show="grid.appScope.$parent.vm.showMFGPNstatus">\
                                                                Copied\
                                                            </md-tooltip>\
                                                    </md-icon>\
                                            </div>\
                                        </div>',
                     width: '250',
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
                },
                {
                    field: 'AlternatePN',
                    displayName: 'Alternate Part',
                    cellTemplate: '<div layout="row" style="padding:5px;height: 100%;overflow: hidden; white-space: nowrap;\" class=\"height-grid ui-grid-cell-contents\" >\
                                        <div style="width: 85%; overflow: hidden; height: auto !important;"> \
                                            <div ng-repeat="item in row.entity.mfgAlterparts" ng-class="[item.isEpoxy?\'background-red\':\'\']">\
                                                     {{grid.appScope.$parent.vm.isExpand ? item.part : ($index>1 ? "" : item.part)}}\
                                                    <md-icon ng-if="item.rohsStatus == \'1\'" class="icon-leaf green-fg">\
                                                            <md-tooltip md-direction="top">\
                                                                RoHS Complaint\
                                                            </md-tooltip>\
                                                    </md-icon>\
                                                    <md-icon ng-if="item.rohsStatus != \'1\'" class="icon-leaf icon-no-leaf red-fg">\
                                                            <md-tooltip md-direction="top">\
                                                                Non-RoHS Complaint\
                                                            </md-tooltip>\
                                                    </md-icon>\
                                                    <md-icon ng-if="item.LOAStatus != \'1\'" ng-click="grid.appScope.$parent.vm.importLOA(item,$event)" class="icon-folder-upload cursor-pointer color-black margin-top-10">\
                                                        <md-tooltip md-direction="top">\
                                                            Upload LOA\
                                                        </md-tooltip>\
                                                    </md-icon>\
                                                    <md-icon ng-if="item.LOAStatus == \'1\'"ng-click="grid.appScope.$parent.vm.importLOA(item,$event)" class="icon-folder-plus cursor-pointer color-black margin-top-10">\
                                                            <md-tooltip md-direction="top">\
                                                                Upload LOA\
                                                            </md-tooltip>\
                                                    </md-icon>\
                                            </div>\
                                        </div>\
                                        <div style="width:15%; float:right;">\
                                            <span ng-if="grid.appScope.$parent.vm.isExpand?false:row.entity.mfgAlterparts.length>2" style="border-radius: 50%;text-align: center;width: 24px;height: 24px;line-height: 24px;float:right;cursor:pointer" class="md-accent-bg unread-message-count">\
                                                 {{row.entity.mfgAlterparts.length}}\
                                                    <md-tooltip md-direction="top" class="tooltip-multiline">\
                                                        <div ng-repeat="data in row.entity.mfgAlterparts" ng-class="[data.isEpoxy?"background-red":""]">\
                                                           {{data.part}} \
                                                             <md-icon ng-if="data.rohsStatus == \'1\'" class="icon-leaf green-fg">\
                                                                <md-tooltip md-direction="top">\
                                                                    RoHS Complaint\
                                                                </md-tooltip>\
                                                            </md-icon>\
                                                            <md-icon ng-if="item.rohsStatus != \'1\'" class="icon-leaf icon-no-leaf red-fg">\
                                                                    <md-tooltip md-direction="top">\
                                                                        Non-RoHS Complaint\
                                                                    </md-tooltip>\
                                                            </md-icon>\
                                                            <md-icon ng-if="data.LOAStatus != \'1\'" ng-click="grid.appScope.$parent.vm.importLOA(data,$event)" class="icon-folder-upload cursor-pointer color-black margin-top-10">\
                                                                <md-tooltip md-direction="top">\
                                                                    Upload LOA\
                                                                </md-tooltip>\
                                                            </md-icon>\
                                                            <md-icon ng-if="data.LOAStatus == \'1\'" ng-click="grid.appScope.$parent.vm.importLOA(data,$event)" class="icon-folder-plus cursor-pointer color-black margin-top-10">\
                                                                    <md-tooltip md-direction="top">\
                                                                        Upload LOA\
                                                                    </md-tooltip>\
                                                            </md-icon>\
                                                        </div>\
                                                    </md-tooltip>\
                                            </span>\
                                        </div>\
                                    </div>',
                    enableCellEdit: false,
                    allowCellFocus: false,
                    width: '350',
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
                    width: '80',
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
                item.mfgAlterpartsData = item.AlternatePN ? item.AlternatePN.split(',') : "";
                item.mfgAlterparts = [];
                _.each(item.mfgAlterpartsData, (rohsData, index) => {
                    let mfgData = {};
                    mfgData.customerID = consolidatemfg.data.customerID;
                    let txtValue = rohsData ? rohsData.split('@@@') : "";
                    mfgData.LOAStatus = txtValue[4];
                    mfgData.componentID = Number(txtValue[3]);
                    mfgData.part = txtValue.length > 0 ? txtValue[0] : "";
                    mfgData.rohsStatus = txtValue.length > 0 ? txtValue[1] : false;
                    mfgData.isEpoxy = txtValue.length > 1 ? (_.includes(txtValue[2].toLowerCase(), 'epoxy')) ? true : false : false;
                    item.mfgAlterparts.push(mfgData);
                });
                //item.mfgComponents = item.component ? item.component.split(',') : "";
            });
        };


        //get list of consolidated part number rfq line items and shows with its pricing
        vm.loadData = () => {
            vm.sourceData = [];
            vm.cgBusyLoading = PartCostingFactory.retrieveSuggestedAlternative(vm.pagingInfo).query().$promise.then((consolidatemfg) => {
                if (consolidatemfg.data.isReadyForPricing) {
                    vm.bomnotVerified = false;
                    bindGridData(consolidatemfg);
                    vm.sourceData = consolidatemfg.data.consolidateParts;
                    vm.Quantity = consolidatemfg.data.quantity;
                    vm.QuantityDetails = consolidatemfg.data.quantityDetails;
                    if (vm.sourceData.length > 0) {
                        vm.partcostingKeys = Object.keys(vm.sourceData[0]);
                        _.each(vm.partcostingKeys, (keys) => {
                            if (BaseService.checkForVisibleColumnInGrid(PartCosting, keys, vm.sourceHeader)
                                && keys != PartCosting.PartTypeName
                                && keys != PartCosting.PartClassName
                                && keys != PartCosting.AlternatePN
                                && keys != PartCosting.SelectedRoHSStatus) {
                                var obj = {
                                    field: keys,
                                    displayName: keys,
                                    cellTemplate: '<div ng-if="row.entity.isPurchase"  style="padding:5px;height: 100%;overflow: hidden; white-space: nowrap;\" class=\"height-grid ui-grid-cell-contents\" ng-click="grid.appScope.$parent.vm.getPricing(' + keys + ',row.entity,$event)">\
                                                        <span ng-if="COL_FIELD">{{COL_FIELD}} \
                                                            <div ng-bind-html="grid.appScope.$parent.vm.getConsolidatePartQty(row.entity.id,' + keys + ')"></div>\
                                                        </span>\
                                                        <md-icon style="float:left;color:rgb(0,150,136)" \
                                                                ng-if="!COL_FIELD" class="icon-square-inc-cash">\
                                                            <md-tooltip  md-direction="top">\
                                                                Pricing Available\
                                                            </md-tooltip>\
                                                        </md-icon>\
                                                        <a>\
                                                            <div ng-bind-html="grid.appScope.$parent.vm.getPartStatus(row.entity.id,' + keys + ')"></div>\
                                                        </a>\
                                                    </div>\
                                                   <div  ng-if="!row.entity.isPurchase" style="overflow: hidden;" class="ui-grid-cell-contents">\
                                                        <a>DNP</a>\
                                                        <md-tooltip  md-direction="top">\
                                                            Do Not Purchase Part\
                                                        </md-tooltip>\
                                                   </div>',
                                    width: '300',
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
            vm.cgBusyLoading = PartCostingFactory.retrieveSuggestedAlternative(vm.pagingInfo).query().$promise.then((consolidatemfg) => {
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

        ////pricing object for tooltip
        vm.getConsolidatePartQty = (id, qty) => {
            let findQtyObj = _.find(vm.QuantityDetails, { 'consolidateID': id, 'requestQty': qty });
            if (findQtyObj) {
                return '<span class="quantityDetails"><span class="label-header">Supplier:</span> ' + findQtyObj.supplier + '</span></br></br>\
                        <span class="quantityDetails"><span class="label-header">Unit Price:</span> $  ' + findQtyObj.unitPrice + '</span></br></br>\
                        <span class="quantityDetails"><span class="label-header">Selected MPN:</span> ' + findQtyObj.selectedPIDCode + '</span></br></br>\
                        <span class="quantityDetails"><span class="label-header">Selection Mode:</span> ' + findQtyObj.selectionMode + '</span>';
            }
            return '';
        }

        //get Part Status
        vm.getPartDetails = (enitity) => {
            if (enitity.LTBDate) {
                return '<span class="quantityDetails"><span class="label-header">Part Status:</span> ' + enitity.PartStatus + '</span></br></br>\
                    <span class="quantityDetails"><span class="label-header">\LTB Date</span> : ' + $filter('date')(enitity.LTBDate, _dateDisplayFormat) + '</span></br>';
            } else {
                return '<span class="quantityDetails"><span class="label-header">Part Status:</span> ' + enitity.PartStatus + '</span>';
            }
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

        vm.importLOA = (item, ev) => {
            var data = {
                componentID: item.componentID,
                rfqAssyID: item.rfqAssyID,
                customerID: item.customerID,
                refLineitemID: item.refLineitemID
            };
            DialogFactory.dialogService(
            RFQTRANSACTION.COMPONENT_CUSTOMER_LOA_POPUP_CONTROLLER,
            RFQTRANSACTION.COMPONENT_CUSTOMER_LOA_POPUP_VIEW,
            ev,
            data).then((data) => {
                if (data) {
                    addAlternateParts(bomObj, data, false);
                }
            },
                (err) => {
                });

        }

        //remove MFG PN copied status on hover
        vm.MFGPNStatus = () => {
            vm.showMFGPNstatus = false;
        }
        //copy MFG PN on click 
        vm.copyMFGPNText = (item) => {
            var copytext = item.replace('+', ':').split(':')[1];
            var $temp = $("<input>");
            $("body").append($temp);
            $temp.val(copytext).select();
            document.execCommand("copy");
            $temp.remove();
            vm.showMFGPNstatus = true;
        }

    }
})();
