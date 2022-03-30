(function () {

    'use sctrict';
    angular
      .module('app.core')
      .directive('purchaseConsolidateSelectPartGrid', purchaseConsolidateSelectPartGrid);

    /** @ngInject */
    function purchaseConsolidateSelectPartGrid(CORE, $mdDialog, $filter, PurchaseFactory) {
        var directive = {
            restrict: 'E',
            replace: true,
            scope: {
                refSalesOrderDetId: "=",
                kitLineItemId: "=",
                requestQty: "=",
                click: "=",
                refMongoTrnsId:"=?"
            },
            templateUrl: 'app/directives/custom/purchase-consolidate-selectpart-grid/purchase-consolidate-selectpart-grid.html',
            controller: PurchaseConsolidateSelectPartGridCtrl,
            controllerAs: 'vm'
        };
        return directive;

        /** @ngInject */
        function PurchaseConsolidateSelectPartGridCtrl($scope, $q, $element, $attrs, $timeout, $filter, CORE, USER, TRANSACTION, DialogFactory, BaseService, PRICING, RFQTRANSACTION, PartCostingFactory) {
            var vm = this;
            vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
            vm.isApplyPrice = true;
            let rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
            vm.LabelConstant = CORE.LabelConstant.MFG;
            vm.apiConstant = RFQTRANSACTION.API_LINKS;
            vm.EmptyMesssage = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.PRICING;
            vm.isHideDelete = true;
                vm.pagingInfo = {
                    Page: 0,
                    SortColumns: [['Unit', 'ASC'],['OrgInStock','DESC']],
                    SearchColumns: []
                };
            vm.gridOptions = {
                enableRowSelection: false,
                enableRowHeaderSelection: false,
                multiSelect: false,
                showColumnFooter: false,
                enableFullRowSelection: true,
                filterOptions: vm.pagingInfo.SearchColumns,
                enableCellEdit: false,
                enablePaging: false,
                enableCellEditOnFocus: false,
                enableGridMenu: true,
                hideFilter:true
            };
            vm.priceSelectPartClass = TRANSACTION.Purchase_Split_UI.PricingGridUI;
            //source header detail
            vm.sourceHeader = [
                    {
                        field: 'Action',
                        cellClass: 'layout-align-center-center',
                        displayName: 'Action',
                        width: '100',
                        cellTemplate: '<grid-action-view grid="grid" ng-click="$event.stopPropagation();" row="row"  style="\overflow: hidden;padding:4px !important;overflow: hidden; white-space: nowrap;\" class="height-grid ui-grid-cell-contents" ></grid-action-view>',
                        enableFiltering: false,
                        enableSorting: false,
                        enableCellEdit: false,
                        exporterSuppressExport: true,
                        enableColumnMenus: false,
                        enableRowSelection: false,
                        enableFullRowSelection: false,
                        multiSelect: false,
                        maxWidth: '130',
                        pinnedLeft: true,
                    },
                    {
                        field: 'imageURL',
                        width: 90,
                        displayName: 'Image',
                        cellTemplate: '<div class="ui-grid-cell-contents">'
                                     + '<img class="cm-grid-images" ng-src="{{grid.appScope.$parent.vm.getImageURL(row.entity)}}"></img>'
                                     + '</div>',
                      enableFiltering: false,
                      exporterSuppressExport: true,
                        maxWidth: '80',
                        enableSorting: false,
                        allowCellFocus: false,
                        enableCellEdit: false,
                    },
                           {
                               field: 'SourceOfPrice',
                               displayName: 'Price Applied',
                               width: '90',
                               cellTemplate: '<div class=\"ui-grid-cell-contents\" ng-class=\"{\'background-skyblue-pricing\':row.entity.SourceOfPrice==\'Manual\'}">{{COL_FIELD}}</div>',
                               enableCellEdit: false,
                               allowCellFocus: false,
                               maxWidth: '145',
                               filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
                               filter: {
                                   term: null,
                                   options: RFQTRANSACTION.PRICE_APPLIED
                               },

                           },

                         {
                             field: 'SupplierName',
                             displayName: 'Supplier',
                             cellTemplate: '<div   class=\"ui-grid-cell-contents\" ng-class="{\'pricing-grey\':row.entity.AuthorizeSupplier==2,\'pricing-light-grey\':row.entity.AuthorizeSupplier==3}">{{COL_FIELD}}\
                                              <md-tooltip ng-if="row.entity.AuthorizeSupplier==grid.appScope.$parent.vm.supplierAuthorize[1].id || row.entity.AuthorizeSupplier==grid.appScope.$parent.vm.supplierAuthorize[2].id">{{row.entity.AuthorizeSupplier==grid.appScope.$parent.vm.supplierAuthorize[1].id?grid.appScope.$parent.vm.supplierAuthorize[1].Value:grid.appScope.$parent.vm.supplierAuthorize[2].Value}}</md-tooltip>\
                                             </div>',
                             width: 90,
                             enableCellEdit: false,
                             maxWidth: '130',
                             allowCellFocus: false,

                         },
                         {
                             field: 'PriceType',
                             displayName: 'Price Type',
                             width: 110,
                             cellTemplate: '<div  style="overflow: hidden;cursor:pointer"  class=\"ui-grid-cell-contents\"  >{{COL_FIELD?COL_FIELD:"Standard"}}</div>',
                             enableCellEdit: false,
                             allowCellFocus: false,
                             maxWidth: '135',
                             filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
                             filter: {
                                 term: null,
                                 options: RFQTRANSACTION.PRICE_TYPE
                             },

                         },
                         {
                             field: 'ManufacturerName',
                             displayName: vm.LabelConstant.MFG,
                             cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents">' +
                                                '{{row.entity.ManufacturerName}}' +
                                                '<md-tooltip> {{row.entity.ManufacturerName}} </md-tooltip>' +
                                            '</div>',
                             width: '180',
                             enableCellEdit: false,
                             allowCellFocus: false,
                             maxWidth: '250',
                         },

                {
                    field: 'ManufacturerPartNumber',
                    displayName: vm.LabelConstant.MFGPN,
                    cellTemplate: '<div  class="ui-grid-cell-contents">' +
                                               '<span class="underline cursor-pointer" ng-click="grid.appScope.$parent.vm.gotoComponent(row.entity);$event.stopPropagation();">' +
                                                '{{row.entity.ManufacturerPartNumber}}' +
                                                '<md-tooltip> {{row.entity.ManufacturerPartNumber}} </md-tooltip>' +
                                                 '</span>' +
                                          '<span ng-if="row.entity.rohsIcon">' +
                                          ' <img class="rohs-bom-image" ng-src="{{grid.appScope.$parent.vm.rohsName(row.entity.rohsIcon)}}">' +
                                          '<md-tooltip>{{row.entity.RoHS}}</md-tooltip>' +
                                          '</span>' +
                                                '<md-icon  ng-if="row.entity.isPackaging" md-font-icon="icon-share">' +
                                                    '<md-tooltip md-direction="top">Packaging alias</md-tooltip>' +
                                                '</md-icon>' +
                                                '<span  ' +
                                                'ng-click="grid.appScope.$parent.vm.getProductDetail(row.entity.ProductUrl);$event.stopPropagation();">' +
                                                '<img role="img" class="margin-top-5 height-12 padding-right-5 padding-left-5" ng-src="{{grid.appScope.$parent.vm.getImage(row.entity)}}" />' +
                                                '<md-tooltip md-direction="top" ng-if="grid.appScope.$parent.vm.getImage(row.entity)">Search on {{row.entity.SupplierName}}</md-tooltip>' +
                                                '</span>' +
                                                '<span ' +
                                                'ng-click="grid.appScope.$parent.vm.getFindchip(row.entity.ManufacturerPartNumber);$event.stopPropagation();">' +
                                                '<img role="img" class="margin-top-5 height-12 padding-right-5" ng-src="{{grid.appScope.$parent.vm.apiConstant.FindChipImage}}" />' +
                                                '<md-tooltip md-direction="top">Search on FindChip</md-tooltip>' +
                                                '</span>' +
                                                '<md-icon class="icon-cog color-black padding-top-5 margin-0"   style="min-width: 16px;width: 16px" ng-click="grid.appScope.$parent.vm.getOctoPart(row.entity.ManufacturerPartNumber);$event.stopPropagation();">' +
                                                '<md-tooltip md-direction="top">' +
                                                'Search on OctoPart' +
                                                '</md-tooltip>' +
                                                '</md-icon>' +
                                                '<md-icon class="icon-content-copy cursor-pointer color-black padding-top-5 ml-5" style="min-width: 16px;width: 16px" ng-click="grid.appScope.$parent.vm.copyMFGPNText(row.entity.ManufacturerPartNumber)" ng-mouseover="grid.appScope.$parent.vm.MFGPNStatus();$event.stopPropagation();">' +
                                                    '<md-tooltip md-direction="top" ng-show="!grid.appScope.$parent.vm.showMFGPNstatus"> Copy {{grid.appScope.$parent.vm.LabelConstant.MFGPN}}</md-tooltip>' +
                                                    '<md-tooltip md-direction="bottom" ng-show="grid.appScope.$parent.vm.showMFGPNstatus"> Copied </md-tooltip>' +
                                                '</md-icon>' +
                                            '</div>',
                    width: '250',
                    enableCellEdit: false,
                    allowCellFocus: false,
                    maxWidth: '300',
                },
                    {
                        field: 'mfgPNDescription',
                        displayName: 'Description',
                        cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents">' +
                                                 '{{row.entity.mfgPNDescription}}' +
                                                 '<md-tooltip ng-if="row.entity.mfgPNDescription"> {{row.entity.mfgPNDescription}} </md-tooltip>' +
                                             '</div>',
                        width: '250',
                        enableCellEdit: false,
                        allowCellFocus: false,
                        maxWidth: '300',

                    },
                     {
                         field: 'OrgInStock',
                         displayName: 'Supplier Stock',
                         cellTemplate: '<div style="text-align:end;" class="ui-grid-cell-contents">{{COL_FIELD | numberWithoutDecimal}}</div>',
                         width: '100',
                         maxWidth: '200',
                         enableCellEdit: false,
                         allowCellFocus: false,
                     },
                     {
                         field: 'MinimumBuy',
                         displayName: 'SPQ',
                         cellTemplate: "<div style=\"overflow: hidden;text-align: end;\" class=\"ui-grid-cell-contents\">{{COL_FIELD | numberWithoutDecimal}}</div>",
                         width: '100',
                         maxWidth: '150',
                         enableCellEdit: false,
                         allowCellFocus: false,
                         visible: true,
                     },
                    {
                        field: 'packageQty',
                        displayName: 'Unit Qty',
                        cellTemplate: "<div style=\"overflow: hidden;text-align: end;\" class=\"ui-grid-cell-contents\">{{COL_FIELD}}</div>",
                        width: '90',
                        maxWidth: '150',
                        enableCellEdit: false,
                        allowCellFocus: false,
                        visible: true,
                    },
                    {
                        field: 'PartAbbrivation',
                        displayName: 'UOM',
                        cellTemplate: "<div style=\"overflow: hidden;text-align: end;\" class=\"ui-grid-cell-contents\">{{COL_FIELD}}</div>",
                        width: '90',
                        maxWidth: '150',
                        enableCellEdit: false,
                        allowCellFocus: false,
                        visible: true,
                    },
                    {
                        field: 'OtherStock',
                        displayName: 'Supplier Converted Stock',
                        cellTemplate: "<div style=\"overflow: hidden;text-align: end;\" class=\"ui-grid-cell-contents\">{{COL_FIELD?COL_FIELD.toFixed(2):0}}</div>",
                        width: 160,
                        maxWidth: '200',
                        enableCellEdit: false,
                        allowCellFocus: false,
                        visible: true,
                    },
                    {
                        field: 'TimeStamp',
                        displayName: 'TimeStamp',
                        cellTemplate: "<div style=\"overflow: hidden;\" class=\"ui-grid-cell-contents\">{{COL_FIELD | date :  grid.appScope.$parent.vm.DefaultDateFormat}}</div>",
                        width: '160',
                        maxWidth: '220',
                        enableCellEdit: false,
                        allowCellFocus: false,
                        enableFiltering: false,
                        enableSorting: false,
                    },
                    {
                        field: 'APILeadTime',
                        displayName: 'Std. Lead Time (Weeks)',
                        cellTemplate: '<div  style="overflow: hidden;text-align: end;" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
                        width: 130,
                        enableCellEdit: false,
                        allowCellFocus: false,
                        maxWidth: '250',
                        visible: !vm.iscustomPartNumber
                    },
                    {
                        field: 'MinimumBuy',
                        displayName: 'Min',
                        cellTemplate: '<div style="overflow: hidden;text-align: end;" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
                        width: '80',
                        maxWidth: '200',
                        enableCellEdit: false,
                        allowCellFocus: false,
                    },
                    {
                        field: 'Multiplier',
                        displayName: 'Mult',
                        cellTemplate: '<div style="overflow: hidden;text-align: end;" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
                        width: '80',
                        maxWidth: '200',
                        enableCellEdit: false,
                        allowCellFocus: false,
                    },
                    {
                        field: 'Packaging',
                        displayName: 'Packaging',
                        cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
                        width: '140',
                        maxWidth: '300',
                        enableCellEdit: false,
                        allowCellFocus: false,
                    },
                    {
                        field: 'partPackage',
                        displayName: 'Package/Case (Shape)',
                        cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
                        width: '140',
                        maxWidth: '300',
                        enableCellEdit: false,
                        allowCellFocus: false,
                    },
                    {
                        field: 'MountingType',
                        displayName: 'Mounting Type',
                        cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
                        width: '100',
                        maxWidth: '300',
                        enableCellEdit: false,
                        allowCellFocus: false,
                    },
                    {
                        field: 'FunctionalType',
                        displayName: 'Functional Type',
                        cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
                        width: '100',
                        maxWidth: '300',
                        enableCellEdit: false,
                        allowCellFocus: false,
                    },
                    {
                        field: 'ApiNoOfPosition',
                        displayName: 'API Pin Count',//API No.Of Position
                        cellTemplate: '<div style="overflow: hidden;text-align: end;" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
                        width: '100',
                        enableCellEdit: false,
                        allowCellFocus: false,
                        maxWidth: '200',
                    },
                    {
                        field: 'NoOfPosition',
                        displayName: 'Pin Count',//No.Of Position
                        cellTemplate: '<div style="overflow: hidden;text-align: end;" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
                        width: '100',
                        enableCellEdit: false,
                        allowCellFocus: false,
                        maxWidth: '200',
                    },
                    {
                        field: 'SupplierPN',
                        displayName: 'Supplier PN',
                        cellTemplate: '<div style="overflow: hidden;"  class=\"ui-grid-cell-contents\">{{COL_FIELD}}</div>',
                        width: '140',
                        enableCellEdit: false,
                        allowCellFocus: false,
                        maxWidth: '300',
                    },
                    {
                        field: 'Region',
                        displayName: 'Region',
                        cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
                        width: '140',
                        enableCellEdit: false,
                        allowCellFocus: false,
                        maxWidth: '300',
                    },
                    {
                        field: 'NCNR',
                        displayName: 'NCNR',
                        cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
                        width: '140',
                        enableCellEdit: false,
                        allowCellFocus: false,
                        maxWidth: '250',
                    },
                    {
                        field: 'Reeling',
                        displayName: 'Custom Reel Available',
                        cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
                        width: '140',
                        enableCellEdit: false,
                        allowCellFocus: false,
                        maxWidth: '250',
                    },
                    {
                        field: 'PartStatus',
                        displayName: 'Part Status',
                        cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
                        width: '140',
                        maxWidth: '250',
                        enableCellEdit: false,
                        allowCellFocus: false,
                    },
                    {
                        field: 'LTBDate',
                        displayName: 'LTB Date',
                        cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD | date :  grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
                        width: '140',
                        maxWidth: '250',
                        enableCellEdit: false,
                        allowCellFocus: false,
                    }
                    //{
                    //    field: 'copyFromID',
                    //    displayName: 'Copy',
                    //    cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD?"YES":"NO"}}</div>',
                    //    width: '80',
                    //    maxWidth: '250',
                    //    enableCellEdit: false,
                    //    allowCellFocus: false,
                    //    enableFiltering: false,
                    //},
                ];

            //get list of pricing base on its quantity
          vm.loadData = () => {
                let pricingObj = {
                    refAssyID: $scope.refSalesOrderDetId,
                    consolidateID: $scope.kitLineItemId,
                    IsDeleted: false,
                    isPurchaseApi: true
                };
                vm.cgBusyLoading = PartCostingFactory.retrievePricing().query({ pricingObj: pricingObj }).$promise.then((pricing) => {
                  let pricingDet = (pricing && pricing.data && pricing.data.pricing) ? pricing.data.pricing : [];
                    vm.isresponse = true;
                    let pricingList = [];
                    if (vm.pnDetailList) {
                        _.each(pricingDet, (price) => {
                            if (_.find(vm.pnDetailList, (part) => { return part.mfgPNID == price.PartNumberId })) {
                                pricingList.push(price);
                            }   
                        });
                    }
                    pricingDet = pricingList;
                    _.each(pricingDet, (api) => {
                        api.TimeStamp = $filter('date')(api.TimeStamp, _dateTimeDisplayFormat);
                    });
                    var pricingDetailList = [];
                    _.each(pricingDet, (pricingDetail) => {
                        var objPrice = pricingDetail.assemblyQtyBreak[0];
                        if (objPrice) {
                                pricingDetail[stringFormat("Unit")] = objPrice.PricePerPart;
                                pricingDetail[stringFormat("Ext_Price")] = objPrice.TotalDollar ? parseFloat(objPrice.TotalDollar) : null;
                                pricingDetail[stringFormat("QuoteQty")] = objPrice.OrderQty;
                                pricingDetail[stringFormat("leadTime")] = objPrice.leadTime;
                                pricingDetail[stringFormat("UOM")] = pricingDetail.BOMAbbrivation;
                                pricingDetail[stringFormat("RequireQty")] = objPrice.RequireQty;
                                pricingDetail[stringFormat("ActualQuoteQty")] = objPrice.ActualQty;
                                pricingDetail[stringFormat("ActualQuotePrice")] = objPrice.ActualPrice;

                            }
                            else {
                                pricingDetail[stringFormat("Unit")] = null;
                                pricingDetail[stringFormat("Ext_Price")] = null;
                                pricingDetail[stringFormat("QuoteQty")] = null;
                                pricingDetail[stringFormat("leadTime")] = null;
                                pricingDetail[stringFormat("UOM")] = null;
                                pricingDetail[stringFormat("RequireQty")] = null;
                                pricingDetail[stringFormat("ActualQuoteQty")] = null;
                                pricingDetail[stringFormat("ActualQuotePrice")] = null;
                            }
                        pricingDetailList.push(pricingDetail);
                    }); 
                        var position = 16;
                        var max = 7;
                        if (vm.iscustomPartNumber) {
                            max = 8;
                        }
                        if (pricingDet.length > 0) {
                                for (var i = 0; i < max; i++) {
                                    position = position + 1;
                                    var celltemplate;
                                    var visible = true;
                                    var keys = "";
                                    var display = "";
                                     if (i == 0) {
                                        keys = stringFormat("RequireQty");
                                        display = stringFormat("Reqd. Qty");
                                        celltemplate = "<div style=\"overflow: hidden;text-align: end;\" class=\"ui-grid-cell-contents\">{{COL_FIELD | numberWithoutDecimal}}</div>";
                                    }
                                     else if (i == 1) {
                                        keys = stringFormat("QuoteQty");
                                        display = stringFormat("{0}",(pricingDet[0].componentUnitID > 0 || pricingDet[0].connectorTypeID == RFQTRANSACTION.DEFAULT_ID.HEADER_BREAKWAY) ? "Quoted Unit(s)" : "Quote Qty");
                                        celltemplate = "<div style=\"overflow: hidden;text-align: end;\" class=\"ui-grid-cell-contents\" ng-style=\"grid.appScope.$parent.vm.classCellClass('" + $scope.requestQty + "')\" >{{COL_FIELD | numberWithoutDecimal}}</div>";
                                        var headerCellTemplate = "<div class=\"ui-grid-cell-contents\"><span ng-style=\"{'background-color': grid.appScope.$parent.vm.headerCellClass('" + $scope.requestQty + "')}\">" + display + "</span></div>";
                                    }
                                    else if (i == 2) {
                                        keys = stringFormat("UOM");
                                        display = stringFormat("UOM");
                                        celltemplate = "<div style=\"overflow: hidden;text-align: end;\" class=\"ui-grid-cell-contents\">{{COL_FIELD}}</div>";
                                    }
                                    else if (i == 3) {
                                        keys = stringFormat("Unit");
                                        display = stringFormat("Unit($)");
                                        celltemplate = "<div style=\"overflow: hidden;text-align: end;\" class=\"ui-grid-cell-contents\">{{COL_FIELD | unitPrice }}</div>";
                                        var headerCellTemplate = "<div class=\"ui-grid-cell-contents\"><span>" + display + "</span></div>";
                                    }
                                    else if (i == 4) {
                                        (pricingDet[0].componentUnitID > 0 || pricingDet[0].connectorTypeID == RFQTRANSACTION.DEFAULT_ID.HEADER_BREAKWAY) ? visible = true : visible = false;
                                        keys = stringFormat("ActualQuoteQty");
                                        display = stringFormat("Quoted Qty");
                                        celltemplate = "<div style=\"overflow: hidden;text-align: end;\" class=\"ui-grid-cell-contents\" >{{COL_FIELD | numberWithoutDecimal}}</div>";

                                    }
                                    else if (i == 5) {
                                        (pricingDet[0].componentUnitID > 0 || pricingDet[0].connectorTypeID == RFQTRANSACTION.DEFAULT_ID.HEADER_BREAKWAY) ? visible = true : visible = false;
                                        keys = stringFormat("ActualQuotePrice");
                                        display = stringFormat("Quoted Qty Price EA");
                                        celltemplate = "<div style=\"overflow: hidden;text-align: end;\" class=\"ui-grid-cell-contents\" >{{COL_FIELD | unitPrice}}</div>";

                                    }
                                    else if (i == 6) {
                                        keys = stringFormat("Ext_Price");
                                        display = stringFormat("Ext. Price($)");
                                        celltemplate = "<div style=\"overflow: hidden;text-align: end;\" class=\"ui-grid-cell-contents\">{{COL_FIELD | amount }}</div>";
                                    }
                                    else if (i == 7) {
                                        keys = stringFormat("leadTime");
                                        display = stringFormat("Std. Lead Time (Weeks)");
                                        celltemplate = "<div style=\"overflow: hidden;text-align: end;\" class=\"ui-grid-cell-contents\">{{COL_FIELD}}</div>";
                                    }
                                    var obj = {
                                        field: keys,
                                        cellTemplate: celltemplate,
                                        width: 120,
                                        maxWidth: '450',
                                        enableCellEdit: false,
                                        enableFiltering: true,
                                        visible: visible
                                    }
                                    if (i == 1 || i == 3)
                                        obj.headerCellTemplate = headerCellTemplate;
                                    else {
                                        obj.displayName = display;
                                        obj.enableFiltering = false;
                                    }
                                    var partfield = _.find(vm.sourceHeader, (pQty) => { return pQty.field == keys });
                                    if (partfield) {
                                        var index = _.indexOf(vm.sourceHeader, partfield);
                                        vm.sourceHeader.splice(index, 1);
                                    }
                                    var format = stringFormat("leadTime");
                                    partfield = _.find(vm.sourceHeader, (pQty) => { return pQty.field == format });
                                    if (partfield) {
                                        var index = _.indexOf(vm.sourceHeader, partfield);
                                        vm.sourceHeader.splice(index, 1);
                                    }
                                    vm.sourceHeader.splice(position, 0, obj);
                                }
                        }
                    vm.sourceData = pricingDetailList;
                    if (vm.pagingInfo.SortColumns.length > 0) {
                        var column = [];
                        var sortBy = [];
                        _.each(vm.pagingInfo.SortColumns, function (item) {
                            column.push(item[0]);
                            sortBy.push(item[1]);
                        });
                        vm.sourceData = _.orderBy(vm.sourceData, column, sortBy);
                    }
                    if (vm.pagingInfo.SearchColumns.length > 0) {
                        _.each(vm.pagingInfo.SearchColumns, function (item) {
                            vm.sourceData = $filter('filter')(vm.sourceData, { [item.ColumnName]: item.SearchString });
                        });
                        if (vm.sourceData.length == 0)
                            vm.emptyState = 0;
                    }
                    else {
                        vm.emptyState = null;
                    }
                    vm.totalSourceDataCount = vm.sourceData.length;
                    vm.currentdata = vm.totalSourceDataCount;
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
                    vm.selectedrow = null;
                    $timeout(() => {
                        vm.gridOptions.clearSelectedRows();
                        vm.resetSourceGrid();
                      $timeout(() => {
                            var selectPart = _.find(vm.sourceData, (select) => { return select._id == $scope.refMongoTrnsId });
                            if (selectPart) {
                                var index = _.indexOf(vm.sourceData, selectPart);
                                vm.gridOptions.clearSelectedRows();
                                vm.gridOptions.gridApi.selection.selectRow(vm.gridOptions.data[index]);
                            }
                        });
                        if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount == vm.currentdata) {
                            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
                        }
                    });

                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            }
            //this will not call as mongodb not managing like this
            vm.getDataDown = () => {
            }
            //keep watch to update directive value base on selection details
            $scope.$watch('click', function (oldvalue, newValue) {
                if (vm.isresponse) {
                    getAlternateLineItemParts();
                    vm.loadData();
                }
            });
            getAlternateLineItemParts();
            //get alternate part number list
            function getAlternateLineItemParts() {
                PartCostingFactory.getAlternatePartList().query({ consolidateID: $scope.kitLineItemId, pisPurchaseApi: true }).$promise.then((lineitems) => {
                  vm.pnDetailList = (lineitems && lineitems.data && lineitems.data.alternateParts) ? _.clone(lineitems.data.alternateParts) : [];
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            }
            //get image URL
            vm.getImageURL = (row) => {
                var obj = _.find(vm.pnDetailList, (item) => { return item.mfgPNID == row.PartNumberId });
                if (obj) {
                    if (obj.imageURL) {
                        if (!obj.imageURL.startsWith("http://") && !obj.imageURL.startsWith("https://"))
                            return BaseService.getPartMasterImageURL(obj.documentPath, obj.imageURL);
                        else
                            return obj.imageURL;
                    }
                    else
                        return CORE.NO_IMAGE_COMPONENT;
                }
                return CORE.NO_IMAGE_COMPONENT;
            }
            //concate rohs icon
            vm.rohsName = (icon) => {
                return stringFormat("{0}{1}", rohsImagePath, icon);
            }
            //find chip link detail
            vm.getFindchip = (mfgpn) => {
                if (mfgpn) {
                    mfgpn = encodeURIComponent(mfgpn);
                    BaseService.openURLInNew(RFQTRANSACTION.API_LINKS.FINDCHIPS + mfgpn);
                }
            }
            //find mfg in product URL
            vm.getProductDetail = (url) => {
                if (url) {
                    return BaseService.openURLInNew(url);
                }
            }
            //remove MFG PN copied status on hover
            vm.MFGPNStatus = () => {
                vm.showMFGPNstatus = false;
            }
            //copy MFG PN on click 
            vm.copyMFGPNText = (item) => {
                var copytext = item;
                var $temp = $("<input>");
                $("body").append($temp);
                $temp.val(copytext).select();
                document.execCommand("copy");
                $temp.remove();
                vm.showMFGPNstatus = true;
            }
            //get supplier image 
            vm.getImage = (row) => {
                let SupplierApis = _.clone(CORE.Suppliers_Api);
                var imageObj = _.find(SupplierApis, (item) => { return item.ID == row.SupplierID });
                if (imageObj && imageObj.ID < 0) {
                    return imageObj.ID == -6 ? stringFormat(imageObj.Image, WebsiteBaseUrl) : imageObj.Image;
                }
                else
                    return "";
            }

            //select Price manual
            vm.applyPurchasePrice = (row, ev) => {
                let obj = {
                    title: CORE.MESSAGE_CONSTANT.WITHOUT_SAVING_ALERT_HEADER_MESSAGE,
                    textContent: CORE.MESSAGE_CONSTANT.PRICING_SELECT,
                    btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
                    canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                };
                DialogFactory.confirmDiolog(obj).then((yes) => {
                    if (yes) {
                        //logic set to check selected price is higher than any other price
                        var isHigh = _.find(vm.sourceData, (price) => { return row._id != price._id && price.Unit && parseFloat(price.Unit ? price.Unit : 0) <= (parseFloat(row.Unit ? row.Unit : 0) / parseFloat(_ForceToBuyPriceDifferenceXTimeLess)) });
                        if (isHigh) {
                            var model = {
                                title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
                                textContent: stringFormat(TRANSACTION.PURCHASE.PURCHASE_PRICE_SELECT, isHigh.SupplierName, isHigh.Packaging ? "(" + isHigh.Packaging + ")" : "", _ForceToBuyPriceDifferenceXTimeLess, row.SupplierName, row.Packaging ? "(" + row.Packaging + ")" : ""),
                                multiple: true
                            };
                            DialogFactory.alertDialog(model);
                            return false;
                        }
                        else {
                            saveSelectedPrice(row);
                        }
                    }
                }, (cancel) => {
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
                
            }
            //save price and details for line item which comes from external api
            let saveSelectedPrice=(objItem)=>{
                let supplierUnitStock;
                let grossStock;
                let uniqueDetails;
                let pricingSuppliers;
                let SupplierEachStock;
                var PriceList = []
                supplierStock = _.sumBy(vm.sourceData, (o) => { if (o.SupplierID == objItem.SupplierID) { return o.OtherStock } });
                SupplierEachStock = _.sumBy(vm.sourceData, (o) => { if (o.SupplierID == objItem.SupplierID) { return o.OrgInStock } });
                grossStock = _.sumBy(_.filter(vm.sourceData, (pData) => { return !pData.copyFromID }), function (o) { return o.OtherStock; });
                uniqueDetails = _.uniqBy(_.filter(vm.sourceData, (x) => { return x.OtherStock > 0 }), (y) => { return y.SupplierName });
                uniqueDetails = _.uniqBy(uniqueDetails, 'SupplierID');
                pricingSuppliers = _.map(uniqueDetails, 'SupplierName').join();

                var obj = {
                    id: $scope.kitLineItemId,
                    refQuoteUnitPriceEach: objItem.Unit,
                    refsupplierID: objItem.SupplierID,
                    refPriceselectionMode: objItem.SourceOfPrice,
                    refSelectedPartUnitStock: objItem.OtherStock,
                    refLeadTime: vm.iscustomPartNumber ? (objItem.leadTime ? objItem.leadTime : objItem.APILeadTime) : objItem.APILeadTime,
                    refPricePartID: objItem.PartNumberId,
                    refsupplierUnitStock: supplierStock,
                    refCumulativeStock: grossStock,
                    refCumulativeStockSuppliers: pricingSuppliers ? pricingSuppliers : null,
                    refpackagingID: objItem.packageID,
                    refMongoTrnsID: objItem._id,
                    refQuoteUnitQty: objItem.QuoteQty,
                    refQuoteQtyPriceEach: objItem.ActualQuotePrice,
                    refquoteQtyEach: objItem.ActualQuoteQty,
                    refSelectedPartQtyStock: objItem.OrgInStock,
                    refsupplierQtyStcok: SupplierEachStock
                }
                PriceList.push(obj);
                vm.cgBusyLoading = PurchaseFactory.savePurchasePrice().query({ pricingObj: PriceList }).$promise.then((finalPrice) => {
                    var index = _.indexOf(vm.sourceData, objItem);
                    vm.gridOptions.clearSelectedRows();
                    vm.gridOptions.gridApi.selection.selectRow(vm.gridOptions.data[index]);
                });
            }
        }
    }
})();
