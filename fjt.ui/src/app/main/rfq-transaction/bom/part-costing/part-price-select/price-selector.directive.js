
(function () {
  'use strict';
  angular
    .module('app.rfqtransaction').directive('priceSelector', priceSelector);

  /** @ngInject */
  function priceSelector($timeout, $filter, $q, CORE, RFQTRANSACTION,
    PartCostingFactory, BaseService, DialogFactory, PRICING, $mdSidenav, ImportExportFactory, USER, TRANSACTION, SalesOrderFactory, socketConnectionService, NotificationFactory, MasterFactory) { // eslint-disable-line func-names
    return {
      restrict: 'E',
      scope: {
        lineitem: '='
      },
      templateUrl: CORE.RFQ_TRANSACTION_BOM_PART_COSTING_PRICE_SELECTOR_MODAL_VIEW,
      controllerAs: 'vm',
      controller: ['$scope', function ($scope) {
        const vm = this;
        var lineitem = '';
        vm.showMarquee = false;
        const groupConcatSeparatorValue = _groupConcatSeparatorValue;
        const mfgPNstring = $scope.lineitem.rowEntity.mfgPN;
        // const loginUser = BaseService.loginUser;
        if ($scope.lineitem && $scope.lineitem.rowEntity.mfgPN) {
          const items = $scope.lineitem.rowEntity.mfgPN.split(groupConcatSeparatorValue);
          _.each(items, (alternate) => {
            var altPart = alternate.split('@@@');
            if (altPart) {
              lineitem = stringFormat('{0}{1} & ', lineitem, altPart[0]);
              lineitem = lineitem.replace('***', ',');
            }
          });
          $scope.lineitem.rowEntity.mfgPN = lineitem.slice(0, -2);
        }
        vm.selectedPartPriceMatrix = [];
        vm.LabelConstant = CORE.LabelConstant.MFG;
        vm.AssemblyLabelConstant = CORE.LabelConstant.Assembly;
        vm.supplierAuthorize = CORE.SUPPLIER_AUTHORIZE_TYPE;
        vm.lineItem = _.clone($scope.lineitem.rowEntity);
        vm.path = stringFormat('{0}{1}', WebsiteBaseUrl, RFQTRANSACTION.PRICING_UPDATE_STOCK);
        vm.allLineItemList = _.clone($scope.lineitem.sourceData);
        vm.allLineItemList = _.filter(vm.allLineItemList, (item) => item.isPurchase && !item.restrictCPNUseInBOMStep && item.restrictCPNUsePermanentlyStep && item.restrictCPNUseWithPermissionStep);
        vm.isHideDelete = false;
        vm.commonstatus = CORE.CommonStatus;
        vm.DefaultDateFormat = _dateTimeDisplayFormat; //CORE.DateFormatArray[2].format;
        vm.PricingType = CORE.PRICING_TYPE;
        vm.PriceTypeDetail = CORE.PRICING_TYPEDETAIL;
        vm.apiConstant = RFQTRANSACTION.API_LINKS;
        vm.PriceType = vm.PriceTypeDetail.CURRENT_PRICE;
        vm.DefaultPriceFilter = RFQTRANSACTION.PRICING_FILTER[0];
        vm.EmptyMesssage = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.PRICING;
        vm.ishistory = false;
        vm.isShowPriceBreak = true;
        const rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
        vm.rohsIcon = stringFormat('{0}{1}', rohsImagePath, vm.lineItem.rohsIcon);
        const objCustom = _.find($scope.lineitem.rowEntity.lineItemCustoms, (item) => item.id === vm.lineItem.id);
        if (objCustom && objCustom.custom === 1) {
          vm.iscustomPartNumber = true;
        } else {
          vm.iscustomPartNumber = false;
        }
        vm.isUpdatable = true;
        vm.lineItem.quantityTotals = _.sortBy(vm.lineItem.quantityTotals, (o) => o.requestQty);
        //paging details for grid
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),
          SortColumns: [],
          SearchColumns: []
        };
        vm.isModifyPrice = true;
        //set grid option for action with ui grid
        vm.gridOptions = {
          enableRowSelection: true,
          enableRowHeaderSelection: false,
          multiSelect: false,
          showColumnFooter: false,
          enableFullRowSelection: true,
          filterOptions: vm.pagingInfo.SearchColumns,
          enableCellEdit: true,
          enablePaging: false,
          enableCellEditOnFocus: true,
          enableGridMenu: true,
          hideMultiDeleteButton: true,
          exporterMenuCsv: true,
          exporterCsvFilename: 'Price Data.csv'
        };
        vm.customPartColumn = [{
          field: 'refSupplierQuoteNumber',
          displayName: 'Supplier Quote#',
          cellTemplate: '<div  class="ui-grid-cell-contents">' +
            '<span class="underline cursor-pointer" ng-click="grid.appScope.$parent.vm.goToSupplierQuoteDetail(row.entity.refSupplierQuoteID);$event.stopPropagation();">' +
            '{{row.entity.refSupplierQuoteNumber}}' +
            '</span>' +
            '</div>',
          width: '110',
          enableCellEdit: false,
          maxWidth: '140',
          allowCellFocus: false

        }, {
          field: 'refSupplierQuoteDateValue',
          displayName: 'Supplier Quote Date',
          cellTemplate: '<div style="overflow: hidden;" class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '110',
          enableCellEdit: false,
          maxWidth: '140',
          allowCellFocus: false
        }];
        //set header for ui grid
        vm.sourceHeader = [{
          field: 'Action',
          cellClass: 'layout-align-center-center',
          displayName: 'Action',
          width: '100',
          cellTemplate: '<grid-action-view grid="grid" ng-click="$event.stopPropagation();" row="row"  style="overflow: hidden;padding:5px;overflow: hidden; white-space: nowrap;" class="height-grid ui-grid-cell-contents" ></grid-action-view>',
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
          visible: vm.PriceType === vm.PriceTypeDetail.CURRENT_PRICE
        }, {
          field: 'imageURL',
          width: 70,
          displayName: '',
          cellTemplate: '<div class="ui-grid-cell-contents">'
            + '<img class="cm-grid-images" ng-src="{{grid.appScope.$parent.vm.getImageURL(row.entity)}}"></img>'
            + '</div>',
          enableFiltering: false,
          maxWidth: '80',
          enableSorting: false,
          allowCellFocus: false,
          enableCellEdit: false
        }, {
          field: 'SourceOfPrice',
          displayName: 'Price Applied',
          width: '120',
          cellTemplate: '<div class="ui-grid-cell-contents" ng-class="{\'background-skyblue-pricing\':row.entity.SourceOfPrice==\'Manual\'}"><md-icon  ng-if="grid.appScope.$parent.vm.PriceType==grid.appScope.$parent.vm.PriceTypeDetail.HISTORICAL_PRICE"  class="icon-clock" style="float:left !important;color:red"><md-tooltip md-direction="right">This price was pulled on {{row.entity.TimeStamp | date : grid.appScope.$parent.vm.DefaultDateFormat }}</md-tooltip></md-icon>{{COL_FIELD}}</div>',
          enableCellEdit: false,
          allowCellFocus: false,
          maxWidth: '145',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: RFQTRANSACTION.PRICE_APPLIED
          }
        }, {
          field: 'SupplierName',
          displayName: 'Supplier',
          cellTemplate: '<div class="ui-grid-cell-contents" ng-class="{\'pricing-grey\':row.entity.AuthorizeSupplier==2,\'pricing-light-grey\':row.entity.AuthorizeSupplier==3}">\
                            <a class="cm-text-decoration underline"\
                                                ng-click="grid.appScope.$parent.vm.goToSupplierDetail(row.entity.SupplierID);"\
                                                tabindex="-1">{{COL_FIELD}}\
                            <md-tooltip ng-if="row.entity.AuthorizeSupplier==grid.appScope.$parent.vm.supplierAuthorize[1].id || row.entity.AuthorizeSupplier==grid.appScope.$parent.vm.supplierAuthorize[2].id">\
                            {{row.entity.AuthorizeSupplier==grid.appScope.$parent.vm.supplierAuthorize[1].id?grid.appScope.$parent.vm.supplierAuthorize[1].Value:grid.appScope.$parent.vm.supplierAuthorize[2].Value}}</md-tooltip>\
                          </a>\
                          </div>',
          width: '110',
          enableCellEdit: false,
          maxWidth: '140',
          allowCellFocus: false
        }, {
          field: 'PriceType',
          displayName: 'Price Type',
          width: '135',
          cellTemplate: '<div  style="overflow: hidden;cursor:pointer"  class="ui-grid-cell-contents"  >{{COL_FIELD?COL_FIELD:"Standard"}}</div>',
          enableCellEdit: false,
          allowCellFocus: false,
          maxWidth: '150',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: RFQTRANSACTION.PRICE_TYPE
          }
        }, {
          field: 'ManufacturerName',
          displayName: vm.LabelConstant.MFG,
          cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents">' +
            '<a class="cm-text-decoration underline" ' +
            ' ng-click="grid.appScope.$parent.vm.goToManufacturer(row.entity.mfgCodeID);"' +
            ' tabindex="-1"> ' +
            '{{row.entity.ManufacturerName}}' +
            '<md-tooltip> {{row.entity.ManufacturerName}} </md-tooltip></a>' +
            '</div>',
          width: '180',
          enableCellEdit: false,
          allowCellFocus: false,
          maxWidth: '250'
        }, {
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
            'ng-click="grid.appScope.$parent.vm.getProductDetail(row.entity.ProductUrl);$event.stopPropagation();" ng-hide="row.entity.isCustom || !row.entity.ProductUrl">' +
            '<img role="img" class="margin-top-5 height-12 padding-right-5 padding-left-5" ng-src="{{grid.appScope.$parent.vm.getImage(row.entity)}}" />' +
            '<md-tooltip md-direction="top" ng-if="grid.appScope.$parent.vm.getImage(row.entity)">Search on {{row.entity.SupplierName}}</md-tooltip>' +
            '</span>' +
            '<span ' +
            'ng-click="grid.appScope.$parent.vm.getFindchip(row.entity.ManufacturerPartNumber);$event.stopPropagation();" ng-hide="row.entity.isCustom">' +
            '<img role="img" class="margin-top-5 height-12 padding-right-5" ng-src="{{grid.appScope.$parent.vm.apiConstant.FindChipImage}}" />' +
            '<md-tooltip md-direction="top">Search on FindChip</md-tooltip>' +
            '</span>' +
            '<md-icon class="icon-cog color-black padding-top-5 margin-0"   style="min-width: 16px;width: 16px" ng-click="grid.appScope.$parent.vm.getOctoPart(row.entity.ManufacturerPartNumber);$event.stopPropagation();" ng-hide="row.entity.isCustom">' +
            '<md-tooltip md-direction="top">' +
            'Search on OctoPart' +
            '</md-tooltip>' +
            '</md-icon>' +
            '<span ' +
            'ng-click="grid.appScope.$parent.vm.getGooglesearch(row.entity.ManufacturerPartNumber);$event.stopPropagation();" ng-hide="row.entity.isCustom">' +
            '<img role="img" class="margin-top-5 height-12 padding-right-5" ng-src="{{grid.appScope.$parent.vm.apiConstant.GOOGLE_IMAGE}}" />' +
            '<md-tooltip md-direction="top">Search on Google</md-tooltip>' +
            '</span>' +
            '<copy-text label="grid.appScope.$parent.vm.LabelConstant.MFGPN" text="row.entity.ManufacturerPartNumber"></copy-text>' +
            '<copy-part-text label="PID" text="row.entity.custAssyPN" ng-if="row.entity.isCustom && row.entity.custAssyPN"></copy-part-text>' +
            '</div>',
          width: '250',
          enableCellEdit: false,
          allowCellFocus: false,
          maxWidth: '300'
        }, {
          field: 'mfgPNDescription',
          displayName: 'Description',
          cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents">' +
            '{{row.entity.mfgPNDescription}}' +
            '<md-tooltip ng-if="row.entity.mfgPNDescription"> {{row.entity.mfgPNDescription}} </md-tooltip>' +
            '</div>',
          width: '250',
          enableCellEdit: false,
          allowCellFocus: false,
          maxWidth: '300'
        }, {
          field: 'OrgInStock',
          displayName: 'Supplier Stock',
          cellTemplate: '<div style="text-align:end;" class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
          width: '100',
          maxWidth: '200',
          enableCellEdit: false,
          allowCellFocus: false
        }, {
          field: 'MinimumBuy',
          displayName: 'SPQ',
          cellTemplate: '<div style="overflow: hidden;text-align: end;" class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
          width: '100',
          maxWidth: '150',
          enableCellEdit: false,
          allowCellFocus: false,
          visible: true
        }, {
          field: 'packageQty',
          displayName: 'Unit Qty',
          cellTemplate: '<div style="overflow: hidden;text-align: end;" class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
          width: '90',
          maxWidth: '150',
          enableCellEdit: false,
          allowCellFocus: false,
          visible: true
        }, {
          field: 'PartAbbrivation',
          displayName: 'UOM',
          cellTemplate: '<div style="overflow: hidden;text-align: end;" class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '90',
          maxWidth: '150',
          enableCellEdit: false,
          allowCellFocus: false,
          visible: true
        }, {
          field: 'OtherStock',
          displayName: 'Supplier Converted Stock',
          cellTemplate: '<div style="overflow: hidden;text-align: end;" class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD?COL_FIELD.toFixed(2):0}}</div>',
          width: '150',
          maxWidth: '200',
          enableCellEdit: false,
          allowCellFocus: false,
          visible: true
        }, {
          field: 'TimeStamp',
          displayName: 'TimeStamp',
          cellTemplate: '<div style="overflow: hidden;" class="ui-grid-cell-contents">{{COL_FIELD | date :  grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
          width: '160',
          maxWidth: '220',
          enableCellEdit: false,
          allowCellFocus: false,
          enableFiltering: false,
          enableSorting: false
        }, {
          field: 'APILeadTime',
          displayName: 'Std. Lead Time (Weeks)',
          cellTemplate: '<div  style="overflow: hidden;text-align: end;" class="ui-grid-cell-contents grid-cell-text-right" >{{COL_FIELD}}</div>',
          width: '110',
          enableCellEdit: false,
          allowCellFocus: false,
          maxWidth: '250',
          visible: !vm.iscustomPartNumber
        }, {
          field: 'MinimumBuy',
          displayName: 'Min',
          cellTemplate: '<div style="overflow: hidden;text-align: end;" class="ui-grid-cell-contents grid-cell-text-right" >{{COL_FIELD}}</div>',
          width: '80',
          maxWidth: '200',
          enableCellEdit: false,
          allowCellFocus: false
        }, {
          field: 'Multiplier',
          displayName: 'Mult',
          cellTemplate: '<div style="overflow: hidden;text-align: end;" class="ui-grid-cell-contents grid-cell-text-right" >{{COL_FIELD}}</div>',
          width: '80',
          maxWidth: '200',
          enableCellEdit: false,
          allowCellFocus: false
        }, {
          field: 'AdditionalValueFee',
          displayName: 'Additional Value Fee',
          cellTemplate: '<div style="overflow: hidden;text-align: end;" class="ui-grid-cell-contents grid-cell-text-right" >{{COL_FIELD |  amount}}</div>',
          width: '100',
          maxWidth: '250',
          enableCellEdit: false,
          allowCellFocus: false
        }, {
          field: 'Packaging',
          displayName: 'Packaging',
          cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
          width: '140',
          maxWidth: '300',
          enableCellEdit: false,
          allowCellFocus: false
        }, {
          field: 'partPackage',
          displayName: 'Package/Case (Shape)',
          cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
          width: '140',
          maxWidth: '300',
          enableCellEdit: false,
          allowCellFocus: false
        }, {
          field: 'MountingType',
          displayName: 'Mounting Type',
          cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
          width: '100',
          maxWidth: '300',
          enableCellEdit: false,
          allowCellFocus: false
        }, {
          field: 'FunctionalType',
          displayName: 'Functional Type',
          cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
          width: '100',
          maxWidth: '300',
          enableCellEdit: false,
          allowCellFocus: false
        }, {
          field: 'ApiNoOfPosition',
          displayName: 'API Pin Count',//API No.Of Position
          cellTemplate: '<div style="overflow: hidden;text-align: end;" class="ui-grid-cell-contents grid-cell-text-right" >{{COL_FIELD}}</div>',
          width: '100',
          enableCellEdit: false,
          allowCellFocus: false,
          maxWidth: '200'
        }, {
          field: 'NoOfPosition',
          displayName: 'Pin Count',//No.Of Position
          cellTemplate: '<div style="overflow: hidden;text-align: end;" class="ui-grid-cell-contents grid-cell-text-right" >{{COL_FIELD}}</div>',
          width: '100',
          enableCellEdit: false,
          allowCellFocus: false,
          maxWidth: '200'
        }, {
          field: 'SupplierPN',
          displayName: 'Supplier PN',
          cellTemplate: '<div style="overflow: hidden;"  class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '140',
          enableCellEdit: false,
          allowCellFocus: false,
          maxWidth: '300'
        }, {
          field: 'Region',
          displayName: 'Region',
          cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
          width: '140',
          enableCellEdit: false,
          allowCellFocus: false,
          maxWidth: '300'
        }, {
          field: 'NCNR',
          displayName: 'NCNR',
          cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
          width: '140',
          enableCellEdit: false,
          allowCellFocus: false,
          maxWidth: '250'
        }, {
          field: 'Reeling',
          displayName: 'Custom Reel Available',
          cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
          width: '140',
          enableCellEdit: false,
          allowCellFocus: false,
          maxWidth: '250'
        }, {
          field: 'PartStatus',
          displayName: 'Part Status',
          cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
          width: '140',
          maxWidth: '250',
          enableCellEdit: false,
          allowCellFocus: false
        }, {
          field: 'LTBDate',
          displayName: 'LTB Date',
          cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD | date :  grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
          width: '140',
          maxWidth: '250',
          enableCellEdit: false,
          allowCellFocus: false
        }, {
          field: 'copyFromID',
          displayName: 'Copy',
          cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD?"YES":"NO"}}</div>',
          width: '80',
          maxWidth: '250',
          enableCellEdit: false,
          allowCellFocus: false,
          enableFiltering: false
        }];

        if (vm.iscustomPartNumber) {
          _.each(vm.customPartColumn, (item, index) => {
            vm.sourceHeader.splice((4 + index), 0, item);
          });
        }

        //get list of pricing base on its quantity
        vm.loadData = () => {
          const pricingObj = {
            refAssyID: vm.lineItem.rfqAssyID,
            consolidateID: vm.lineItem.id,
            IsDeleted: vm.PriceType === vm.PriceTypeDetail.CURRENT_PRICE ? false : true,
            isPurchaseApi: false
          };
          vm.cgBusyLoading = PartCostingFactory.retrievePricing().query({ pricingObj: pricingObj }).$promise.then((pricing) => {
            vm.selectedPartPriceMatrix = [];
            const pricingDet = pricing.data.pricing;
            _.each(pricingDet, (api) => {
              api.TimeStamp = $filter('date')(api.TimeStamp, _dateTimeDisplayFormat);
              api.refSupplierQuoteDateValue = api.refSupplierQuoteDate ? $filter('date')(api.refSupplierQuoteDate, _dateDisplayFormat) : null;
            });
            const pricingDetailList = [];
            _.each(pricingDet, (pricingDetail) => {
              _.each(vm.lineItem.quantityTotals, (pricingApi) => {
                var objPrice = _.find(pricingDetail.assemblyQtyBreak, (itemPrice) => itemPrice.RfqAssyQtyId === pricingApi.qtyID);
                if (objPrice) {
                  const objSelect = _.find(vm.lineItem.ConsolidateQuantity, (selectedPrice) => selectedPrice.requestQty === pricingApi.requestQty && selectedPrice.selectionMode === pricingDetail.SourceOfPrice &&
                    selectedPrice.rfqQtySupplierID === objPrice.qtySupplierID);
                  pricingDetail[stringFormat('{0}_Unit', pricingApi.requestQty)] = objPrice.PricePerPart;
                  pricingDetail[stringFormat('{0}_Check', pricingApi.requestQty)] = (vm.PriceType === vm.PriceTypeDetail.CURRENT_PRICE) && objSelect ? true : false;
                  pricingDetail[stringFormat('{0}_Ext_Price', pricingApi.requestQty)] = objPrice.TotalDollar ? parseFloat(objPrice.TotalDollar) : null;
                  pricingDetail[stringFormat('{0}_QuoteQty', pricingApi.requestQty)] = objPrice.OrderQty;
                  pricingDetail[stringFormat('{0}_leadTime', pricingApi.requestQty)] = objPrice.leadTime;
                  pricingDetail[stringFormat('{0}_UOM', pricingApi.requestQty)] = pricingDetail.BOMAbbrivation;
                  pricingDetail[stringFormat('{0}_RequireQty', pricingApi.requestQty)] = objPrice.RequireQty;
                  pricingDetail[stringFormat('{0}_ActualQuoteQty', pricingApi.requestQty)] = objPrice.ActualQty;
                  pricingDetail[stringFormat('{0}_ActualQuotePrice', pricingApi.requestQty)] = objPrice.ActualPrice;
                  if (pricingDetail[stringFormat('{0}_Check', pricingApi.requestQty)]) {
                    const selectedpriceobj = {
                      requestQty: pricingApi.requestQty,
                      ManufacturerName: pricingDetail.ManufacturerName,
                      ManufacturerPartNumber: pricingDetail.ManufacturerPartNumber,
                      SupplierName: pricingDetail.SupplierName,
                      PriceType: pricingDetail.PriceType,
                      Packaging: pricingDetail.Packaging,
                      PIDCode: pricingDetail.PIDCode,
                      SupplierID: pricingDetail.SupplierID,
                      PartNumberId: pricingDetail.PartNumberId,
                      PurchaseUom: pricingDetail.PurchaseUom,
                      PartAbbrivation: pricingDetail.PartAbbrivation,
                      rohsIcon: pricingDetail.rohsIcon,
                      RoHS: pricingDetail.RoHS,
                      isCustom: pricingDetail.isCustom,
                      isPackaging: pricingDetail.isPackaging,
                      ProductUrl: pricingDetail.ProductUrl,
                      custAssyPN: pricingDetail.custAssyPN
                    };
                    selectedpriceobj.RequireQty = pricingDetail[stringFormat('{0}_RequireQty', pricingApi.requestQty)];
                    selectedpriceobj.QuoteQty = pricingDetail[stringFormat('{0}_QuoteQty', pricingApi.requestQty)];
                    selectedpriceobj.Ext_Price = pricingDetail[stringFormat('{0}_Ext_Price', pricingApi.requestQty)] || 0;
                    selectedpriceobj.ActualQuotePrice = pricingDetail[stringFormat('{0}_ActualQuotePrice', pricingApi.requestQty)];
                    selectedpriceobj.UOM = pricingDetail[stringFormat('{0}_UOM', pricingApi.requestQty)];
                    selectedpriceobj.Units = pricingDetail[stringFormat('{0}_ActualQuoteQty', pricingApi.requestQty)];
                    selectedpriceobj.leadTime = pricingDetail[stringFormat('{0}_leadTime', pricingApi.requestQty)] || pricingDetail.APILeadTime;
                    vm.selectedPartPriceMatrix.push(selectedpriceobj);
                  }
                }
                else {
                  pricingDetail[stringFormat('{0}_Unit', pricingApi.requestQty)] = null;
                  pricingDetail[stringFormat('{0}_Check', pricingApi.requestQty)] = false;
                  pricingDetail[stringFormat('{0}_Ext_Price', pricingApi.requestQty)] = null;
                  pricingDetail[stringFormat('{0}_QuoteQty', pricingApi.requestQty)] = null;
                  pricingDetail[stringFormat('{0}_leadTime', pricingApi.requestQty)] = null;
                  pricingDetail[stringFormat('{0}_UOM', pricingApi.requestQty)] = null;
                  pricingDetail[stringFormat('{0}_RequireQty', pricingApi.requestQty)] = null;
                  pricingDetail[stringFormat('{0}_ActualQuoteQty', pricingApi.requestQty)] = null;
                  pricingDetail[stringFormat('{0}_ActualQuotePrice', pricingApi.requestQty)] = null;
                }
              });
              pricingDetail.isDisabledUpdate = (pricingDetail.SourceOfPrice === 'Auto' || vm.PriceType !== vm.PriceTypeDetail.CURRENT_PRICE || pricingDetail.refSupplierQuoteDateValue) ? true : false;
              pricingDetail.isDisabledDelete = (pricingDetail.SourceOfPrice === 'Auto' || vm.PriceType !== vm.PriceTypeDetail.CURRENT_PRICE) ? true : false;
              pricingDetailList.push(pricingDetail);
            });
            if (vm.PriceType === vm.PriceTypeDetail.CURRENT_PRICE) {
              vm.ishistory = false;
              let position = 17;
              let max = 8;
              if (vm.iscustomPartNumber) {
                max = 9;
              }
              if (pricingDet.length > 0) {
                _.each(vm.lineItem.quantityTotals, (quoteQty) => {
                  for (let i = 0; i < max; i++) {
                    position = position + 1;
                    let celltemplate;
                    let priceselect;
                    let headerCellclass = '';
                    let headerCellTemplate = '';
                    let cellClass = '';
                    let visible = true;
                    //var headerCellTemplate;
                    let keys = '';
                    let display = '';
                    let check = '';

                    if (i === 0) {
                      keys = stringFormat('{0}_Check', quoteQty.requestQty);
                      display = stringFormat('{0} Check', (quoteQty.rfqPriceGroupId !== null ? quoteQty.priceGroupName : quoteQty.requestQty));
                      celltemplate = '<input type="checkbox" ng-model="row.entity[\'' + keys + '\']" ng-change="grid.appScope.$parent.vm.priceClick(row,row.entity,COL_FIELD,\'' + keys + '\')">';
                      headerCellclass = 'border-1px-solid';
                      cellClass = stringFormat('border-cell-left {0}', '');
                    }
                    else if (i === 1) {
                      keys = stringFormat('{0}_RequireQty', quoteQty.requestQty);
                      display = stringFormat('Reqd. Qty for {0}', (quoteQty.rfqPriceGroupId !== null ? quoteQty.priceGroupName : quoteQty.requestQty));
                      celltemplate = '<div style="overflow: hidden;text-align: end;" class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>';
                      headerCellclass = 'border-bottom-solid';
                    }
                    else if (i === 2) {
                      priceselect = true;
                      keys = stringFormat('{0}_QuoteQty', quoteQty.requestQty);
                      display = stringFormat('{1} for {0}', (quoteQty.rfqPriceGroupId !== null ? quoteQty.priceGroupName : quoteQty.requestQty), (vm.lineItem.uomID > 0 || pricingDet[0].connectorTypeID == RFQTRANSACTION.DEFAULT_ID.HEADER_BREAKWAY) ? 'Quoted Unit(s)' : 'Quote Qty');
                      check = stringFormat('{0}_Check', quoteQty.requestQty);
                      celltemplate = "<div style=\"overflow: hidden;text-align: end;\" class=\"ui-grid-cell-contents grid-cell-text-right\" ng-style=\"row.entity['" + check + "'] && grid.appScope.$parent.vm.classCellClass('" + quoteQty.requestQty + "')\" >{{COL_FIELD | numberWithoutDecimal}}</div>";
                      headerCellTemplate = "<div class=\"ui-grid-cell-contents\"><span ng-style=\"{'background-color': grid.appScope.$parent.vm.headerCellClass('" + check + "','" + quoteQty.requestQty + "')}\">" + display + "</span></div>";
                      headerCellclass = 'border-bottom-solid';
                    }
                    else if (i === 3) {
                      priceselect = true;
                      keys = stringFormat('{0}_UOM', quoteQty.requestQty);
                      display = stringFormat('UOM for {0}', (quoteQty.rfqPriceGroupId !== null ? quoteQty.priceGroupName : quoteQty.requestQty));
                      celltemplate = '<div style="overflow: hidden;text-align: end;" class="ui-grid-cell-contents">{{COL_FIELD}}</div>';
                      headerCellclass = 'border-bottom-solid';
                    }
                    else if (i === 4) {
                      priceselect = true;
                      keys = stringFormat('{0}_Unit', quoteQty.requestQty);
                      display = stringFormat('{0} Unit($)', (quoteQty.rfqPriceGroupId !== null ? quoteQty.priceGroupName : quoteQty.requestQty));
                      check = stringFormat('{0}_Check', quoteQty.requestQty);
                      celltemplate = "<div style=\"overflow: hidden;text-align: end;\" class=\"ui-grid-cell-contents grid-cell-text-right\" ng-class=\"{'background-green-pricing':(row.entity['" + check + "'] == true)}\">{{COL_FIELD | unitPrice }}</div>";
                      headerCellTemplate = "<div class=\"ui-grid-cell-contents\"><span ng-style=\"{'background-color': grid.appScope.$parent.vm.UnitCellClass('" + check + "')}\">" + display + "</span></div>";
                      headerCellclass = 'border-bottom-solid';
                    }
                    else if (i === 5) {
                      priceselect = true;
                      (vm.lineItem.uomID > 0 || pricingDet[0].connectorTypeID === RFQTRANSACTION.DEFAULT_ID.HEADER_BREAKWAY) ? visible = true : visible = false;
                      keys = stringFormat('{0}_ActualQuoteQty', quoteQty.requestQty);
                      display = stringFormat('Quoted Qty for {0}', (quoteQty.rfqPriceGroupId !== null ? quoteQty.priceGroupName : quoteQty.requestQty));
                      celltemplate = '<div style="overflow: hidden;text-align: end;" class="ui-grid-cell-contents grid-cell-text-right" >{{COL_FIELD | numberWithoutDecimal}}</div>';
                      headerCellclass = 'border-bottom-solid';
                    }
                    else if (i === 6) {
                      priceselect = true;
                      (vm.lineItem.uomID > 0 || pricingDet[0].connectorTypeID === RFQTRANSACTION.DEFAULT_ID.HEADER_BREAKWAY) ? visible = true : visible = false;
                      keys = stringFormat('{0}_ActualQuotePrice', quoteQty.requestQty);
                      display = stringFormat('Quoted Qty Price EA for {0}', (quoteQty.rfqPriceGroupId !== null ? quoteQty.priceGroupName : quoteQty.requestQty));
                      celltemplate = '<div style="overflow: hidden;text-align: end;" class="ui-grid-cell-contents grid-cell-text-right" >{{COL_FIELD | unitPrice}}</div>';
                      headerCellclass = 'border-bottom-solid';
                    }
                    else if (i === 7) {
                      priceselect = true;
                      keys = stringFormat('{0}_Ext_Price', quoteQty.requestQty);
                      display = stringFormat('Ext. Price @ {0}($)', (quoteQty.rfqPriceGroupId !== null ? quoteQty.priceGroupName : quoteQty.requestQty));
                      check = stringFormat('{0}_Check', quoteQty.requestQty);
                      celltemplate = '<div style="overflow: hidden;text-align: end;" class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount }}</div>';
                      headerCellclass = vm.iscustomPartNumber ? 'border-bottom-solid' : 'border-right-solid';
                      cellClass = vm.iscustomPartNumber ? cellClass : stringFormat('border-cell-right {0}', '');
                    }
                    else if (i === 8) {
                      keys = stringFormat('{0}_leadTime', quoteQty.requestQty);
                      display = stringFormat('{0} Std. Lead Time (Weeks)', (quoteQty.rfqPriceGroupId !== null ? quoteQty.priceGroupName : quoteQty.requestQty));
                      celltemplate = '<div style="overflow: hidden;text-align: end;" class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>';
                      headerCellclass = 'border-right-solid';
                    }
                    const obj = {
                      field: keys,
                      cellTemplate: celltemplate,
                      width: '120',
                      maxWidth: '450',
                      enableCellEdit: i === 4 || i === 8 ? true : false,
                      enableFiltering: true,
                      cellEditableCondition: cellEditable,
                      visible: visible,
                      headerCellClass: headerCellclass,
                      cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var objIndex = vm.sourceData.indexOf(row.entity);
                        var splitData = col.colDef.field.split('_');
                        if (objIndex === 0) {
                          if (splitData[1] === 'Check') {
                            return 'border-cell-top-left';
                          }
                          if (splitData[1] == (vm.iscustomPartNumber ? 'leadTime' : 'Ext')) {
                            return 'border-cell-top-right';
                          } else {
                            return 'border-cell-top';
                          }
                        }
                        if (objIndex === (vm.sourceData.length - 1)) {
                          if (splitData[1] === 'Check') {
                            return 'border-cell-leftbottom';
                          } else if (splitData[1] == (vm.iscustomPartNumber ? 'leadTime' : 'Ext')) {
                            return 'border-cell-right-bottom';
                          } else {
                            return 'border-cell-bottom';
                          }
                        }
                        else if (objIndex != 0) {
                          if (splitData[1] == 'Check') {
                            return 'border-cell-left';
                          }
                          if (splitData[1] == (vm.iscustomPartNumber ? 'leadTime' : 'Ext')) {
                            return 'border-cell-right';
                          }
                        }
                      }
                    }
                    if (i === 2 || i === 4) {
                      obj.headerCellTemplate = headerCellTemplate;
                    } else {
                      obj.displayName = display;
                      obj.enableFiltering = false;
                    }
                    if (i === 4 || i === 8) {
                      if (i === 4) {
                        obj.editableCellTemplate = '<div class="grid-edit-input"><form name="inputForm"><input type="INPUT_TYPE" onkeypress="return OnlyNumbersWithFirstDot(event, this)" min="0" max="9999999" ng-style="{\'background-color\':rowRenderIndex % 2==0?\'transparent !important\':\'#f3f3f3 !important\'}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" style="width:100%;text-align:left;border:none;margin-left:-10px"></form></div>';
                      } else {
                        obj.editableCellTemplate = '<div class="grid-edit-input"><form name="inputForm"><input type="INPUT_TYPE" onkeypress="return OnlyNumeric(event)" min="1" max="999" ng-style="{\'background-color\':rowRenderIndex % 2==0?\'transparent !important\':\'#f3f3f3 !important\'}"   ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" style="width:100%;text-align:left;border:none;margin-left:-10px"></form></div>';
                      }
                    }
                    let partfield = _.find(vm.sourceHeader, (pQty) => pQty.field == keys);
                    if (partfield) {
                      const index = _.indexOf(vm.sourceHeader, partfield);
                      vm.sourceHeader.splice(index, 1);
                    }
                    const format = stringFormat('{0}_leadTime', quoteQty.requestQty);
                    partfield = _.find(vm.sourceHeader, (pQty) => pQty.field === format);
                    if (partfield) {
                      const index = _.indexOf(vm.sourceHeader, partfield);
                      vm.sourceHeader.splice(index, 1);
                    }
                    vm.sourceHeader.splice(position, 0, obj);
                  }
                });
              }
            }
            else {
              vm.ishistory = true;
              let position = 17;
              let max = 7;
              if (vm.iscustomPartNumber) {
                max = 8;
              }
              if (pricingDet.length > 0) {
                _.each(vm.lineItem.quantityTotals, (quoteQty) => {
                  for (let i = 0; i < max; i++) {
                    position = position + 1;
                    let celltemplate;
                    let headerCellclass = '';
                    let cellClass = '';
                    //var headerCellTemplate;
                    let keys = '';
                    let display = '';
                    let visible = true;
                    if (i === 0) {
                      keys = stringFormat('{0}_RequireQty', quoteQty.requestQty);
                      display = stringFormat('Reqd. Qty for {0}', quoteQty.requestQty);
                      celltemplate = '<div style="overflow: hidden;text-align: end;" class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>';
                      cellClass = stringFormat('border-cell-left {0}', '');
                      headerCellclass = 'border-1px-solid';
                    }
                    else if (i === 1) {
                      keys = stringFormat('{0}_QuoteQty', quoteQty.requestQty);
                      display = stringFormat('{1} for {0}', quoteQty.requestQty, (vm.lineItem.uomID > 0 || pricingDet[0].connectorTypeID === RFQTRANSACTION.DEFAULT_ID.HEADER_BREAKWAY) ? 'Quoted Unit(s)' : 'Quote Qty');
                      celltemplate = '<div style="overflow: hidden;text-align: end;" class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>';
                      headerCellclass = 'border-bottom-solid';
                    }
                    else if (i === 2) {
                      keys = stringFormat('{0}_UOM', quoteQty.requestQty);
                      display = stringFormat('UOM for {0}', quoteQty.requestQty);
                      celltemplate = '<div style="overflow: hidden;text-align: end;" class="ui-grid-cell-contents">{{COL_FIELD}}</div>';
                      headerCellclass = 'border-bottom-solid';
                    }
                    else if (i === 3) {
                      keys = stringFormat('{0}_Unit', quoteQty.requestQty);
                      display = stringFormat('{0} Unit($)', quoteQty.requestQty);
                      celltemplate = '<div style="overflow: hidden;text-align: end;" class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | unitPrice }}</div>';
                      headerCellclass = 'border-bottom-solid';
                    }
                    else if (i === 4) {
                      (vm.lineItem.uomID > 0 || pricingDet[0].connectorTypeID === RFQTRANSACTION.DEFAULT_ID.HEADER_BREAKWAY) ? visible = true : visible = false;
                      keys = stringFormat('{0}_ActualQuoteQty', quoteQty.requestQty);
                      display = stringFormat('Quoted Qty for {0}', quoteQty.requestQty);
                      celltemplate = '<div style="overflow: hidden;text-align: end;" class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>';
                    }
                    else if (i === 5) {
                      (vm.lineItem.uomID > 0 || pricingDet[0].connectorTypeID === RFQTRANSACTION.DEFAULT_ID.HEADER_BREAKWAY) ? visible = true : visible = false;
                      keys = stringFormat('{0}_ActualQuotePrice', quoteQty.requestQty);
                      display = stringFormat('Quoted Qty Price EA for {0}', quoteQty.requestQty);
                      celltemplate = '<div style="overflow: hidden;text-align: end;" class="ui-grid-cell-contents grid-cell-text-right" >{{COL_FIELD | unitPrice}}</div>';
                      headerCellclass = 'border-bottom-solid';
                    }
                    else if (i === 6) {
                      vm.lineItem.uomID > 0 ? priceselect = true : priceselect = false;
                      keys = stringFormat('{0}_Ext_Price', quoteQty.requestQty);
                      display = stringFormat('Ext. Price @ {0}($)', quoteQty.requestQty);
                      celltemplate = '<div style="overflow: hidden;text-align: end;" class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount  }}</div>';
                      headerCellclass = vm.iscustomPartNumber ? 'border-bottom-solid' : 'border-right-solid';
                      cellClass = vm.iscustomPartNumber ? cellClass : stringFormat('border-cell-right {0}', '');
                    }
                    else if (i === 7) {
                      keys = stringFormat('{0}_leadTime', quoteQty.requestQty);
                      display = stringFormat('{0} Std. Lead Time (Weeks)', quoteQty.requestQty);
                      celltemplate = '<div style="overflow: hidden;text-align: end;" class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>';
                      headerCellclass = 'border-right-solid';
                      cellClass = stringFormat('border-cell-right {0}', '');
                    }
                    const obj = {
                      field: keys,
                      cellTemplate: celltemplate,
                      width: '120',
                      displayName: display,
                      maxWidth: '450',
                      enableCellEdit: false,
                      enableFiltering: true,
                      visible: visible,
                      headerCellClass: headerCellclass,
                      cellClass: (grid, row, col) => {
                        var objIndex = vm.sourceData.indexOf(row.entity);
                        var splitData = col.colDef.field.split('_');
                        if (objIndex === (vm.sourceData.length - 1)) {
                          if (splitData[1] === 'Check') {
                            return 'border-cell-leftbottom';
                          } else if (splitData[1] === (vm.iscustomPartNumber ? 'leadTime' : 'Ext')) {
                            return 'border-cell-right-bottom';
                          } else {
                            return 'border-cell-bottom';
                          }
                        }
                        else {
                          if (splitData[1] === 'Check') {
                            return 'border-cell-left';
                          } else if (splitData[1] === (vm.iscustomPartNumber ? 'leadTime' : 'Ext')) {
                            return 'border-cell-right';
                          }
                        }
                      }
                    };
                    let partfield = _.find(vm.sourceHeader, (pQty) => pQty.field === keys);
                    if (partfield) {
                      const index = _.indexOf(vm.sourceHeader, partfield);
                      vm.sourceHeader.splice(index, 1);
                    }
                    let format = stringFormat('{0}_leadTime', quoteQty.requestQty);
                    partfield = _.find(vm.sourceHeader, (pQty) => pQty.field === format);
                    if (partfield) {
                      const index = _.indexOf(vm.sourceHeader, partfield);
                      vm.sourceHeader.splice(index, 1);
                    }
                    format = stringFormat('{0}_Check', quoteQty.requestQty);
                    partfield = _.find(vm.sourceHeader, (pQty) => pQty.field === format);
                    if (partfield) {
                      const index = _.indexOf(vm.sourceHeader, partfield);
                      vm.sourceHeader.splice(index, 1);
                    }
                    vm.sourceHeader.splice(position, 0, obj);
                  }
                });
              }
            }
            vm.sourceData = pricingDetailList;
            if (vm.pagingInfo.SortColumns.length > 0) {
              const column = [];
              const sortBy = [];
              _.each(vm.pagingInfo.SortColumns, (item) => {
                column.push(item[0]);
                sortBy.push(item[1]);
              });
              vm.sourceData = _.orderBy(vm.sourceData, column, sortBy);
            }
            if (vm.pagingInfo.SearchColumns.length > 0) {
              _.each(vm.pagingInfo.SearchColumns, (item) => {
                vm.sourceData = $filter('filter')(vm.sourceData, { [item.ColumnName]: item.SearchString });
              });
              if (vm.sourceData.length === 0) {
                vm.emptyState = 0;
              }
            }
            else {
              vm.emptyState = null;
            }
            vm.totalSourceDataCount = vm.sourceData.length;
            vm.currentdata = vm.totalSourceDataCount;
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
            vm.selectedrow = null;
            vm.qtyBreakList = [];
            vm.selectedPartPriceMatrix = _.orderBy(vm.selectedPartPriceMatrix, 'requestQty');
            $timeout(() => {
              vm.gridOptions.clearSelectedRows();
              if (vm.PriceType === vm.PriceTypeDetail.CURRENT_PRICE) {
                vm.sourceHeader[0].visible = true;
              }
              else {
                vm.sourceHeader[0].visible = false;
              }
              vm.resetSourceGrid();
              if (vm.editableItem) {
                const objExist = _.find(vm.sourceData, (objSource) => objSource._id === vm.editableItem._id);
                if (objExist) {
                  BaseService.isChangePriceSelector = true;
                  vm.saveFinalPrice(false, true);
                  vm.editableItem = null;
                }
              }
              $timeout(() => {
                vm.gridOptions.clearSelectedRows();
                vm.gridOptions.gridApi.selection.selectRow(vm.gridOptions.data[0]);
                const row = {
                  entity: vm.sourceData[0]
                };
                callbackFunction(row);
                if (!vm.isUpdate) {
                  celledit();
                }
              }, true);
              if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
                return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
              }
            });
          }).catch((error) => BaseService.getErrorLog(error));
        };
        const cellEditable = ($scope) => {
          if ($scope.row.entity.SourceOfPrice === 'Auto') {
            return false;
          } else {
            return true;
          }
        };
        vm.getDataDown = () => {
        };
        //pricing consolidate quantity list
        vm.getConsolidatePartQty = () => {
          vm.cgBusyLoading = PartCostingFactory.getConsolidatePartQty().query({ id: vm.lineItem.rfqAssyID }).$promise.then((response) => {
            const consolidatePN = _.find(response.data, { 'id': vm.lineItem.id });
            if (consolidatePN) {
              vm.pricingQtyList = consolidatePN.rfqConsolidatedMFGPNLineItemQuantity;
            }
          });
        };
        //get header cell color for quote quantity
        vm.headerCellClass = function (col, qty) {
          var column = col.split('_');
          var objCell = _.find(vm.sourceData, (item) => item[column[0] + '_Check'] === true);
          qty = parseFloat(parseInt(qty) * vm.lineItem.qpa * (vm.lineItem.numOfPosition ? vm.lineItem.numOfPosition : 1));
          if (objCell) {
            if (qty <= vm.getcumilativeStock()) {
              return RFQTRANSACTION.PRICING_BG_COLORS.STOCK_MATCH;
            } else if (qty <= (vm.getcumilativeStock() + vm.availableInternalstock)) {
              return RFQTRANSACTION.PRICING_BG_COLORS.STOCK_HALF_MATCH;
            } else {
              return RFQTRANSACTION.PRICING_BG_COLORS.STOCK_NOT_MATCH;
            }
          }
          return '';
        };
        //get header cell color for quote qty
        vm.classCellClass = function (qty) {
          qty = parseFloat(parseInt(qty) * vm.lineItem.qpa * (vm.lineItem.numOfPosition ? vm.lineItem.numOfPosition : 1));
          if (qty <= vm.getcumilativeStock()) {
            return { 'background-color': RFQTRANSACTION.PRICING_BG_COLORS.STOCK_MATCH };
          } else if (qty <= (vm.getcumilativeStock() + vm.availableInternalstock)) {
            return { 'background-color': RFQTRANSACTION.PRICING_BG_COLORS.STOCK_HALF_MATCH };
          } else {
            return { 'background-color': RFQTRANSACTION.PRICING_BG_COLORS.STOCK_NOT_MATCH };
          }
        };

        //get alternate part number list
        function getAlternateLineItemParts() {
          PartCostingFactory.getAlternatePartList().query({ consolidateID: vm.lineItem.id, pisPurchaseApi: false }).$promise.then((lineitems) => {
            vm.pnDetailList = _.clone(lineitems.data.alternateParts);
            vm.consolidateQtyDetails = _.clone(lineitems.data.consolidateQty);
          }).catch((error) => BaseService.getErrorLog(error));
        }
        getAlternateLineItemParts();
        //get image URL
        vm.getImageURL = (row) => {
          var obj = _.find(vm.pnDetailList, (item) => item.mfgPNID === row.PartNumberId);
          if (obj) {
            if (obj.imageURL) {
              if (!obj.imageURL.startsWith('http://') && !obj.imageURL.startsWith('https://')) {
                return BaseService.getPartMasterImageURL(obj.documentPath, obj.imageURL);
              } else {
                return obj.imageURL;
              }
            } else {
              return CORE.NO_IMAGE_COMPONENT;
            }
          }
          return CORE.NO_IMAGE_COMPONENT;
        };
        //get header cell color for unit price
        vm.UnitCellClass = function (col) {
          var column = col.split('_');
          var objCell = _.find(vm.sourceData, (item) => item[column[0] + '_Check'] === true);
          if (objCell) {
            return RFQTRANSACTION.PRICING_BG_COLORS.STOCK_MATCH;
          }
          return '';
        };
        //get available internal stock
        const getAvailableInternalStock = () => {
          PartCostingFactory.getConsolidateAvailableStock().query({ pconsolidateID: vm.lineItem.id }).$promise.then((response) => {
            if (response && response.data) {
              vm.availableInternalstock = response.data[0].availableStock;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        };
        getAvailableInternalStock();
        vm.getConsolidatePartQty();
        //find mfg in product URL
        vm.getProductDetail = (url) => {
          if (url) {
            return BaseService.openURLInNew(url);
          }
        };
        //update stock for current line item
        vm.stockUpdate = () => {
          if (vm.PriceType == vm.PriceTypeDetail.HISTORICAL_PRICE || vm.sourceData.length === 0) { return false; }
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.STOCK_UPDATE_CONFIRM);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              const selectedLineItem = [];
              const prcObj = {};
              prcObj.id = vm.lineItem.id;
              prcObj.rfqAssyID = vm.lineItem.rfqAssyID;
              vm.lineItem.pricingList = prcObj.pricingList = _.filter(vm.Suppliers, (a) => _.find(vm.lineItem.autoPricingStatus, (b) => b.pricingApiName.toUpperCase() === a.mfgName.toUpperCase()));
              if (vm.lineItem.pricingList.length > 0) {
                selectedLineItem.push(prcObj);
              }
              // progress bar
              if (selectedLineItem.length > 0) {
                vm.isResponse = false;
                vm.stockClick = true;
                vm.cgBusyLoading = PartCostingFactory.getPricingFromApis().query({ pricingApiObj: { pricingApiList: selectedLineItem, isCustomPrice: false, isStockUpdate: true, isPurchaseApi: false, DKVersion: _DkVersion, selectSupplierList: vm.lineItem.pricingList } }).$promise.then(() => {
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
        //find chip link detail
        vm.getFindchip = (mfgpn) => {
          if (mfgpn) {
            mfgpn = encodeURIComponent(mfgpn);
            BaseService.openURLInNew(RFQTRANSACTION.API_LINKS.FINDCHIPS + mfgpn);
          }
        };
        //find chip link detail on google
        vm.getGooglesearch = (mfgpn) => {
          if (mfgpn) {
            mfgpn = encodeURIComponent(mfgpn);
            BaseService.openURLInNew(RFQTRANSACTION.API_LINKS.GOOGLE + mfgpn);
          }
        };
        //select price click
        vm.priceClick = (row, obj, value, currentfield) => {
          if (value && obj && obj.PartNumberId) {
            const partDet = _.find(vm.pnDetailList, { mfgPNID: obj.PartNumberId });
            if (partDet && !partDet.approvedMountingType && (!partDet.mismatchMountingTypeStep || !partDet.mismatchFunctionalCategoryStep)) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.MOUNTING_FUNCTIONAL_TYPE_MISMATCHED_WITH_APPROVED_TYPE);
              const obj = {
                messageContent: messageContent
              };
              DialogFactory.messageAlertDialog(obj);
              obj[currentfield] = false;
              return false;
            }
          }
          if (value) {
            if (vm.lineItem.quantityTotals.length > 1) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.PRICING_SELECT_ALL);
              const objData = {
                messageContent: messageContent,
                btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
              };
              DialogFactory.messageConfirmDialog(objData).then((yes) => {
                if (yes) {
                  checkPriceClick(row.grid.options.data, currentfield, obj, true);
                }
              }, () => {
                checkPriceClick(row.grid.options.data, currentfield, obj, false);
              }).catch((error) => BaseService.getErrorLog(error));
            } else {
              checkPriceClick(row.grid.options.data, currentfield, obj, true);
            }
          } else {
            const selectedQty = currentfield.split('_')[0];
            const prevSelectedObj = _.find(vm.selectedPartPriceMatrix, (x) => x.RequireQty === obj[stringFormat('{0}_RequireQty', selectedQty)]);
            if (prevSelectedObj) {
              vm.selectedPartPriceMatrix.splice(vm.selectedPartPriceMatrix.indexOf(prevSelectedObj), 1);
            }
          }
          vm.isdirty = true;
          BaseService.currentPageFlagForm = [vm.isdirty];
        };
        function checkPriceClick(listData, currentfield, obj, status) {
          if (!status) {
            _.each(listData, (item) => {
              item[currentfield] = false;
            });
            obj[currentfield] = true;
            const selectedQty = currentfield.split('_')[0];
            const prevSelectedObj = _.find(vm.selectedPartPriceMatrix, (x) => x.RequireQty === obj[stringFormat('{0}_RequireQty', selectedQty)]);
            if (prevSelectedObj) {
              vm.selectedPartPriceMatrix.splice(vm.selectedPartPriceMatrix.indexOf(prevSelectedObj), 1);
            }
            const selectedpriceobj = {
              requestQty: selectedQty,
              ManufacturerName: obj.ManufacturerName,
              ManufacturerPartNumber: obj.ManufacturerPartNumber,
              SupplierName: obj.SupplierName,
              PriceType: obj.PriceType,
              Packaging: obj.Packaging,
              PIDCode: obj.PIDCode,
              SupplierID: obj.SupplierID,
              PartNumberId: obj.PartNumberId,
              PurchaseUom: obj.PurchaseUom,
              PartAbbrivation: obj.PartAbbrivation,
              rohsIcon: obj.rohsIcon,
              RoHS: obj.RoHS,
              isCustom: obj.isCustom,
              isPackaging: obj.isPackaging,
              ProductUrl: obj.ProductUrl,
              custAssyPN: obj.custAssyPN
            };
            selectedpriceobj.RequireQty = obj[stringFormat('{0}_RequireQty', selectedQty)];
            selectedpriceobj.QuoteQty = obj[stringFormat('{0}_QuoteQty', selectedQty)];
            selectedpriceobj.Ext_Price = obj[stringFormat('{0}_Ext_Price', selectedQty)] || 0;
            selectedpriceobj.ActualQuotePrice = obj[stringFormat('{0}_ActualQuotePrice', selectedQty)];
            selectedpriceobj.UOM = obj[stringFormat('{0}_UOM', selectedQty)];
            selectedpriceobj.Units = obj[stringFormat('{0}_ActualQuoteQty', selectedQty)];
            selectedpriceobj.leadTime = obj[stringFormat('{0}_leadTime', selectedQty)];
            vm.selectedPartPriceMatrix.push(selectedpriceobj);
          }
          else {
            vm.selectedPartPriceMatrix = [];
            _.each(listData, (dataList) => {
              _.each(vm.lineItem.quantityTotals, (qty) => {
                if (dataList._id === obj._id) {
                  dataList[stringFormat('{0}_Check', qty.requestQty)] = true;
                  const selectedpriceobj = {
                    requestQty: qty.requestQty,
                    ManufacturerName: dataList.ManufacturerName,
                    ManufacturerPartNumber: dataList.ManufacturerPartNumber,
                    SupplierName: dataList.SupplierName,
                    PriceType: dataList.PriceType,
                    Packaging: dataList.Packaging,
                    PIDCode: dataList.PIDCode,
                    SupplierID: dataList.SupplierID,
                    PartNumberId: dataList.PartNumberId,
                    PurchaseUom: dataList.PurchaseUom,
                    PartAbbrivation: dataList.PartAbbrivation,
                    rohsIcon: dataList.rohsIcon,
                    RoHS: dataList.RoHS,
                    isPackaging: dataList.isPackaging,
                    isCustom: dataList.isCustom,
                    ProductUrl: dataList.ProductUrl,
                    custAssyPN: dataList.custAssyPN
                  };
                  selectedpriceobj.RequireQty = dataList[stringFormat('{0}_RequireQty', qty.requestQty)];
                  selectedpriceobj.QuoteQty = dataList[stringFormat('{0}_QuoteQty', qty.requestQty)];
                  selectedpriceobj.Ext_Price = dataList[stringFormat('{0}_Ext_Price', qty.requestQty)] || 0;
                  selectedpriceobj.ActualQuotePrice = dataList[stringFormat('{0}_ActualQuotePrice', qty.requestQty)];
                  selectedpriceobj.UOM = dataList[stringFormat('{0}_UOM', qty.requestQty)];
                  selectedpriceobj.Units = dataList[stringFormat('{0}_ActualQuoteQty', qty.requestQty)];
                  selectedpriceobj.leadTime = obj[stringFormat('{0}_leadTime', qty.requestQty)];
                  vm.selectedPartPriceMatrix.push(selectedpriceobj);
                }
                else {
                  dataList[stringFormat('{0}_Check', qty.requestQty)] = false;
                }
              });
            });
          }
          vm.selectedPartPriceMatrix = _.orderBy(vm.selectedPartPriceMatrix, 'requestQty');
        }
        //get OctoPart api link
        vm.getOctoPart = (mfgpn) => {
          if (mfgpn) {
            BaseService.openURLInNew(RFQTRANSACTION.API_LINKS.OCTOPART + mfgpn);
          }
        };
        // call function to save updated detail of pricing
        //check price break shows
        vm.showPrice = (isshow) => {
          if (!isshow) {
            vm.gridOptions.clearSelectedRows();
          }
        };
        function celledit() {
          vm.isUpdate = true;
          vm.gridOptions.gridApi.edit.on.afterCellEdit($scope, (rowEntity, colDef, newvalue, oldvalue) => {
            let pricing = false;
            if (newvalue !== oldvalue && vm.PriceType === vm.PriceTypeDetail.CURRENT_PRICE && !pricing && newvalue) {
              pricing = true;
              let assemblyQtyBreak = {};
              const qty = colDef.field.split('_');
              vm.cgBusyLoading = $q.all([priceBreakselector(rowEntity)]).then((responses) => {
                const response = responses.length > 0 ? responses[0] : [];
                let objPrice;
                let objLeadTime;
                if (vm.iscustomPartNumber) {
                  if (qty[1] === 'Unit') {
                    objPrice = _.find(response, (priceBreaks) => priceBreaks.price === parseFloat(newvalue) && priceBreaks.qty === parseInt(qty[0]));
                    if (!objPrice) {
                      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.CUSTOM_PRICEBREAK_ALERT);
                      messageContent.message = stringFormat(messageContent.message, stringFormat('price <b>${0}</b>', newvalue), parseInt(qty[0]), 'price');
                      const obj = {
                        multiple: true,
                        messageContent: messageContent
                      };
                      DialogFactory.messageAlertDialog(obj).then(() => {
                        rowEntity[colDef.field] = oldvalue;
                      });
                      return;
                    }
                  } else {
                    objLeadTime = _.find(response, (priceBreaks) => priceBreaks.leadTime === parseFloat(newvalue) && priceBreaks.qty === parseInt(qty[0]));
                    if (!objLeadTime) {
                      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.CUSTOM_PRICEBREAK_ALERT);
                      messageContent.message = stringFormat(messageContent.message, stringFormat('leadtime <b>{0} week(s)</b>', newvalue), parseInt(qty[0]), 'leadtime');
                      const obj = {
                        multiple: true,
                        messageContent: messageContent
                      };
                      DialogFactory.messageAlertDialog(obj).then(() => {
                        rowEntity[colDef.field] = oldvalue;
                      });
                      return;
                    }
                  }
                } else {
                  objPrice = _.find(response, (priceBreaks) => priceBreaks.price === parseFloat(newvalue) && priceBreaks.qty === parseInt(qty[0]));
                  if (!objPrice) {
                    const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.CUSTOM_PRICEBREAK_ALERT);
                    messageContent.message = stringFormat(messageContent.message, stringFormat('price $<b>{0}</b>', newvalue), parseInt(qty[0]), 'price');
                    const obj = {
                      multiple: true,
                      messageContent: messageContent
                    };
                    DialogFactory.messageAlertDialog(obj).then(() => {
                      rowEntity[colDef.field] = oldvalue;
                    });
                    return;
                  }
                }
                _.each(rowEntity.assemblyQtyBreak, (qtybreak) => {
                  if (qtybreak.CurrentQty === parseInt(qty[0])) {
                    assemblyQtyBreak = _.clone(qtybreak);
                    assemblyQtyBreak.PricePerPart = objLeadTime ? objLeadTime.price : parseFloat((rowEntity[qty[0] + '_Unit']).toFixed(_unitPriceFilterDecimal));
                    assemblyQtyBreak.TotalDollar = parseFloat((rowEntity[qty[0] + '_Unit'] * qtybreak.OrderQty).toFixed(_unitPriceFilterDecimal));
                    if (vm.iscustomPartNumber) {
                      assemblyQtyBreak.leadTime = objPrice ? objPrice.leadTime : parseFloat(rowEntity[qty[0] + '_leadTime'] ? rowEntity[qty[0] + '_leadTime'] : 0);
                    }
                    savePriceForQuantity(assemblyQtyBreak);
                  }
                });
              });
            } else {
              rowEntity[colDef.field] = oldvalue;
            }
            pricing = false;
          });
          vm.gridOptions.gridApi.selection.on.rowSelectionChanged($scope, callbackFunction);
          vm.gridOptions.gridApi.colResizable.on.columnSizeChanged($scope, () => {
            vm.gridOptions.clearSelectedRows();
          });
        }

        vm.selectedItems = [];
        //let price selector price break
        const priceBreakselector = (row) => {
          const pricingObj = {
            componentID: [row.PartNumberId],
            UpdatedTimeStamp: row.UpdatedTimeStamp,
            Type: row.SourceOfPrice,
            supplierID: row.SupplierID
          };
          if (row.SourceOfPrice !== 'Auto') {
            pricingObj.qtySupplierID = row._id;
          }
          return PartCostingFactory.retrievePriceBreak().query({ pricingObj: pricingObj }).$promise.then((qtyBreak) => {
            if (qtyBreak && qtyBreak.data) {
              const qtyBreakList = _.orderBy(qtyBreak.data.qtyBreak, ['qty', 'price'], ['ASC', 'ASC']);
              _.each(qtyBreakList, (pBreak) => {
                pBreak.price = parseFloat(pBreak.price);
              });
              return qtyBreakList;
            } else { return []; }
          }).catch((error) => BaseService.getErrorLog(error));
        };
        function callbackFunction(row) {
          if (row.entity) {
            vm.selectedrow = row.entity;
            const pricingObj = {
              componentID: [row.entity.PartNumberId],
              UpdatedTimeStamp: row.entity.UpdatedTimeStamp,
              Type: row.entity.SourceOfPrice,
              supplierID: row.entity.SupplierID
            };
            if (row.entity.SourceOfPrice !== 'Auto') {
              pricingObj.qtySupplierID = row.entity._id;
            }
            vm.cgBusyLoading = PartCostingFactory.retrievePriceBreak().query({ pricingObj: pricingObj }).$promise.then((qtyBreak) => {
              if (qtyBreak && qtyBreak.data) {
                const priceBreakList = [];
                const qtyBreakList = _.orderBy(qtyBreak.data.qtyBreak, ['qty', 'price'], ['ASC', 'ASC']);

                _.each(qtyBreakList, (pBreak) => {
                  pBreak.price = parseFloat(pBreak.price);
                });
                const dataList = groupByMulti(qtyBreakList, ['Packaging', 'supplierPN']);
                _.each(dataList, (breakPrice, key) => {
                  _.each(breakPrice, (supplierBreak, supplierkey) => {
                    var obj = {
                      packaging: key,
                      supplierPN: supplierkey,
                      priceBreak: supplierBreak
                    };
                    priceBreakList.push(obj);
                  });
                });
                vm.qtyBreakList = priceBreakList;
                return vm.qtyBreakList;
              } else { return []; }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        };
        //save price for quantity on cell edit
        const savePriceForQuantity = (obj) => {
          vm.cgBusyLoading = PartCostingFactory.savePriceForQuantity().query({ pricingObj: obj }).$promise.then(() => {
            vm.loadData();
            BaseService.isChangePriceSelector = true;
          }).catch((error) => BaseService.getErrorLog(error));
        };

        vm.checkUnPricedQty = () => (vm.lineItem.unQuotedPrice);

        // get alternate part number list
        function getLineItemParts() {
          PartCostingFactory.getAssyIDAlternatePartList().query({ rfqAssyID: vm.lineItem.rfqAssyID }).$promise.then((lineitems) => {
            vm.partNumberList = lineitems.data.partList;
          }).catch((error) => BaseService.getErrorLog(error));
        }
        getLineItemParts();
        //get loa price from customer
        function getComponentCustomer() {
          MasterFactory.getComponentCustomer().query({ customerID: vm.lineItem.customerID }).$promise.then((loaprice) => {
            vm.customerloaprice = loaprice.data;
          }).catch((error) => BaseService.getErrorLog(error));
        }
        getComponentCustomer();
        //save selected price for quantity open popup for confirmation
        vm.savePrice = (pricelist, close, isModified) => {
          if (close || isModified) {
            saveLineItemPrice(pricelist, isModified);
          }
          else if (pricelist.length > 0) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.PRICING_SELECT);
            const obj = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
            };
            DialogFactory.messageConfirmDialog(obj).then((yes) => {
              if (yes) {
                saveLineItemPrice(pricelist, isModified);
              }
            }, () => {
            }).catch((error) => BaseService.getErrorLog(error));
          }
          else {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE_LABEL);
            messageContent.message = stringFormat(messageContent.message, 'quantity for pricing');
            const model = {
              multiple: true,
              messageContent: messageContent
            };
            DialogFactory.messageAlertDialog(model);
            return false;
          }
        };
        //save selected price for quantity
        vm.saveFinalPrice = (isclose, isModified) => {
          if (vm.PriceType == vm.PriceTypeDetail.HISTORICAL_PRICE || vm.isNoDataFound || !vm.isdirty) { return false; }
          const PriceList = [];
          _.each(vm.lineItem.quantityTotals, (qtyItems) => {
            var column = stringFormat('{0}_Check', qtyItems.requestQty);
            var objItem = _.find(vm.sourceData, (item) => item[column] === true);
            var objConsolidateItem = _.find(vm.consolidateQtyDetails, (cqd) => cqd.qtyid === qtyItems.qtyID);
            if (objItem) {
              const loaPrice = _.find(vm.customerloaprice, (cloa) => cloa.componentID === objItem.PartNumberId);
              let uniqueDetails;
              //if (vm.lineItem.uomID > 0) {
              const supplierStock = _.sumBy(vm.sourceData, (o) => {
                if (o.SupplierID === objItem.SupplierID) {
                  return o.OtherStock;
                }
              });
              const grossStock = _.sumBy(_.filter(vm.sourceData, (pData) => !pData.copyFromID), (o) => o.OtherStock);
              uniqueDetails = _.uniqBy(_.filter(vm.sourceData, (x) => x.OtherStock > 0), (y) => y.SupplierName);
              uniqueDetails = _.uniqBy(uniqueDetails, 'SupplierID');
              const pricingSuppliers = _.map(uniqueDetails, 'SupplierName').join();

              const objPricing = {
                RfqAssyQtyId: qtyItems.qtyID,
                consolidateID: vm.lineItem.id,
                finalPrice: objItem[qtyItems.requestQty + '_Ext_Price'] ? objItem[qtyItems.requestQty + '_Ext_Price'] : 0,
                unitPrice: objItem[qtyItems.requestQty + '_Unit'],
                supplier: objItem.SupplierName,
                selectedMpn: objItem.ManufacturerPartNumber,
                min: objItem.MinimumBuy,
                mult: objItem.Multiplier,
                currentStock: objItem.OtherStock,
                leadTime: vm.iscustomPartNumber ? objItem[qtyItems.requestQty + '_leadTime'] ? objItem[qtyItems.requestQty + '_leadTime'] : objItem.APILeadTime : objItem.APILeadTime,
                selectedPIDCode: objItem.PIDCode,
                componentID: objItem.PartNumberId,
                refSupplierID: objItem.SupplierID,
                apiLead: objItem.ApiNoOfPosition,
                supplierStock: supplierStock ? supplierStock : null,
                grossStock: grossStock ? grossStock : null,
                pricingSuppliers: pricingSuppliers ? pricingSuppliers : null,
                packaging: objItem.Packaging,
                rfqQtySupplierID: objItem._id,
                quoteQty: objItem[qtyItems.requestQty + '_QuoteQty'],
                pricenotselectreason: null,
                availableInternalStock: vm.availableInternalstock ? vm.availableInternalstock : 0,
                isBomUpdate: false,
                id: objConsolidateItem.id,
                LOAprice: loaPrice ? loaPrice.loa_price : null,
                unitEachPrice: objItem[qtyItems.requestQty + '_ActualQuotePrice'],
                quoteQtyEach: objItem[qtyItems.requestQty + '_ActualQuoteQty'],
                supplierEachStcok: objItem.OrgInStock,
                selectionMode: objItem.SourceOfPrice
              };
              PriceList.push(objPricing);
            }
            else {
              const objPricing = {
                RfqAssyQtyId: qtyItems.qtyID,
                consolidateID: vm.lineItem.id,
                finalPrice: null,
                unitPrice: null,
                supplier: null,
                selectionMode: null,
                selectedMpn: null,
                min: null,
                mult: null,
                currentStock: null,
                leadTime: null,
                selectedPIDCode: null,
                componentID: null,
                apiLead: null,
                supplierStock: null,
                grossStock: null,
                pricingSuppliers: null,
                packaging: null,
                rfqQtySupplierID: null,
                quoteQty: null,
                pricenotselectreason: null,
                availableInternalStock: null,
                isBomUpdate: false,
                id: objConsolidateItem.id,
                LOAprice: null,
                unitEachPrice: null,
                quoteQtyEach: null,
                supplierEachStcok: null,
                refSupplierID: null
              };
              PriceList.push(objPricing);
            }
          });
          vm.savePrice(PriceList, isclose, isModified);
        };
        //pricing type change current or history
        vm.pricingChange = () => {
          vm.loadData();
        };
        const saveLineItemPrice = (pricelist, isModified) => {
          var objPrice = {
            pricelist: pricelist,
            isModified: isModified
          };
          vm.cgBusyLoading = PartCostingFactory.saveFinalPrice().query({ pricingObj: objPrice }).$promise.then(() => {
            vm.isdirty = false;
            const objPrice = _.find(vm.allLineItemList, (list) => list.id === pricelist[0].consolidateID);
            if (objPrice) {
              _.each(pricelist, (price) => {
                var qtyObj = _.find(vm.lineItem.quantityTotals, (o) => o.qtyID === price.RfqAssyQtyId);
                if (qtyObj) {
                  objPrice[qtyObj.requestQty] = price.finalPrice;
                }
              });
            }
            //vm.lineItem.unQuotedPrice
            BaseService.isChangePriceSelector = true;
            const totalPriced = [];
            _.each(vm.lineItem.ConsolidateQuantity, (Consolidateqty) => {
              var objQty = _.find(pricelist, (item) => item.RfqAssyQtyId === Consolidateqty.qtyID);
              if (objQty) {
                Consolidateqty.rfqQtySupplierID = objQty.rfqQtySupplierID;
                Consolidateqty.packaging = objQty.packaging;
                Consolidateqty.selectedMpn = objQty.selectedMpn;
                Consolidateqty.supplier = objQty.supplier;
                Consolidateqty.selectionMode = objQty.selectionMode;
                Consolidateqty.refSupplierID = objQty.refSupplierID;
              }
            });
            //check unquoted price exist or not
            _.each(vm.allLineItemList, (pricePercentage) => {
              var Ispercentage = true;
              _.each(vm.lineItem.ConsolidateQuantity, (qtyPercentage) => {
                if (!pricePercentage[qtyPercentage.requestQty] && pricePercentage[qtyPercentage.requestQty] !== 0) {
                  Ispercentage = false;
                }
              });
              if (Ispercentage) {
                totalPriced.push(pricePercentage);
              }
            });
            if (totalPriced.length !== vm.allLineItemList.length) {
              vm.lineItem.unQuotedPrice = true;
            } else {
              vm.lineItem.unQuotedPrice = false;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        };
        //get cumilative stock
        vm.getcumilativeStock = () => {
          vm.aggregteSupplier = 0;
          if (vm.sourceData) {
            vm.aggregteSupplier = _.sumBy(_.filter(vm.sourceData, (pData) => !pData.copyFromID), (o) => o.OtherStock);
            return vm.aggregteSupplier;
          } else {
            return vm.aggregteSupplier;
          }
        };
        //copy line item of quantity supplier
        vm.modifyPrice = (row, evt) => {
          if (row && row.entity) {
            const objExist = _.find(vm.sourceData, (source) => source.copyFromID === row.entity._id);
            if (objExist) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.COPY_EXIST);
              messageContent.message = stringFormat(messageContent.message, row.entity.Packaging && row.entity.Packaging !== 'null' ? row.entity.Packaging : 'N/A');
              const model = {
                multiple: true,
                messageContent: messageContent
              };
              DialogFactory.messageAlertDialog(model);
            }
            else {
              priceModified(row, evt);
            }
          }
        };

        vm.cgBusyLoading = PartCostingFactory.getSupplierList().query({ isPricing: true }).$promise.then((suppliers) => {
          vm.Suppliers = _.sortBy(suppliers.data, (o) => o.mfgName);
        }).catch((error) => BaseService.getErrorLog(error));

        function priceModified(row) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.MODIFY_PRICE);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_CONFIRM_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              if (row && row.entity) {
                const obj = {
                  APILeadTime: row.entity.APILeadTime,
                  Active: row.entity.Active,
                  ApiNoOfPosition: row.entity.ApiNoOfPosition,
                  Authorized_Reseller: row.entity.Authorized_Reseller,
                  ConsolidateID: row.entity.ConsolidateID,
                  CurrencyName: row.entity.CurrencyName,
                  IsDeleted: row.entity.IsDeleted,
                  LTBDate: row.entity.LTBDate,
                  ManufacturerName: row.entity.ManufacturerName,
                  ManufacturerPartNumber: row.entity.ManufacturerPartNumber,
                  MinimumBuy: row.entity.MinimumBuy,
                  Multiplier: row.entity.Multiplier,
                  NCNR: row.entity.NCNR,
                  NoOfPosition: row.entity.NoOfPosition,
                  OrgInStock: row.entity.OrgInStock,
                  PIDCode: row.entity.PIDCode,
                  Packaging: row.entity.Packaging,
                  PartNumberId: row.entity.PartNumberId,
                  PartStatus: row.entity.PartStatus,
                  PriceType: row.entity.PriceType,
                  ProductUrl: row.entity.ProductUrl,
                  PurchaseUom: row.entity.PurchaseUom,
                  Reeling: row.entity.Reeling,
                  Region: row.entity.Region,
                  RoHS: row.entity.RoHS,
                  SourceOfPrice: 'Manual',
                  SupplierName: row.entity.SupplierName,
                  SupplierPN: row.entity.SupplierPN,
                  eolDate: row.entity.eolDate,
                  feature: row.entity.feature,
                  isPackaging: row.entity.isPackaging,
                  mfgPNDescription: row.entity.mfgPNDescription,
                  noOfRows: row.entity.noOfRows,
                  partPackage: row.entity.partPackage,
                  rfqAssyID: row.entity.rfqAssyID,
                  value: row.entity.value,
                  packageID: row.entity.packageID,
                  mfgCodeID: row.entity.mfgCodeID,
                  SupplierID: row.entity.SupplierID,
                  OtherStock: row.entity.OtherStock,
                  PartAbbrivation: row.entity.PartAbbrivation,
                  BOMAbbrivation: row.entity.BOMAbbrivation,
                  packageQty: row.entity.packageQty,
                  MountingTypeID: row.entity.MountingTypeID,
                  FunctionalTypeID: row.entity.FunctionalTypeID,
                  MountingType: row.entity.MountingType,
                  FunctionalType: row.entity.FunctionalType,
                  rohsIcon: row.entity.rohsIcon,
                  PackageSPQQty: row.entity.PackageSPQQty,
                  copyFromID: row.entity._id,
                  bomUnitID: row.entity.bomUnitID,
                  componentUnitID: row.entity.componentUnitID,
                  qpa: row.entity.qpa,
                  connectorTypeID: row.entity.connectorTypeID,
                  AuthorizeSupplier: row.entity.AuthorizeSupplier,
                  UpdatedTimeStamp: row.entity.UpdatedTimeStamp,
                  isPurchaseApi: row.entity.isPurchaseApi ? row.entity.isPurchaseApi : false,
                  AdditionalValueFee: row.entity.AdditionalValueFee
                };
                const assemblyQtyBreak = [];
                _.each(row.entity.assemblyQtyBreak, (item) => {
                  var qty = {
                    ConsolidateID: item.ConsolidateID,
                    CurrentQty: item.CurrentQty,
                    OrderQty: item.OrderQty,
                    PricePerPart: item.PricePerPart,
                    RfqAssyQtyId: item.RfqAssyQtyId,
                    SufficientStockQty: item.SufficientStockQty,
                    TotalDollar: item.TotalDollar,
                    isDeleted: item.isDeleted,
                    leadTime: item.leadTime,
                    RequireQty: item.RequireQty,
                    ActualPrice: item.ActualPrice,
                    ActualQty: item.ActualQty
                  };
                  assemblyQtyBreak.push(qty);
                });
                const objcopy = {
                  objQtySupplier: obj,
                  assyQtylist: assemblyQtyBreak,
                  orgSourcePrice: row.entity.SourceOfPrice,
                  _id: row.entity._id
                };
                vm.cgBusyLoading = PartCostingFactory.saveCopyPricing().query({ copyPrice: objcopy }).$promise.then(() => {
                  vm.loadData();
                }).catch((error) => BaseService.getErrorLog(error));
              }
            }
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
        }

        //open popup
        vm.updateRecord = (row, ev) => {
          vm.openPopupManualPrice(ev, row.entity);
        };
        //open popup for manual price add
        vm.openPopupManualPrice = (ev, item) => {
          const data = {
            parentScope: vm.lineItem,
            selectedLine: item,
            iscustomPartNumber: vm.iscustomPartNumber
          };
          vm.editableItem = item;
          DialogFactory.dialogService(
            RFQTRANSACTION.PRICE_MANUAL_ADD_CONTROLLER,
            RFQTRANSACTION.PRICE_MANUAL_ADD_VIEW,
            ev,
            data).then(() => {
            }, (detail) => {
              if (detail) {
                vm.loadData();
              }
            }, (err) => BaseService.getErrorLog(err));
        };

        //open popup for manual price add
        vm.openSupplierQuoteDet = (ev) => {
          if (vm.PriceType == vm.PriceTypeDetail.HISTORICAL_PRICE || !vm.lineItem.qpa) { return false; }
          const data = {
            pnDetailList: vm.pnDetailList,
            parentScope: vm.lineItem,
            existingSupplierQuoteId: _.uniq(_.map(vm.sourceData, 'refSupplierQuoteID')),
            mfgPN: mfgPNstring
          };
          DialogFactory.dialogService(
            RFQTRANSACTION.SUPPLIER_QUOTE_DETAILS_CONTROLLER,
            RFQTRANSACTION.SUPPLIER_QUOTE_DETAILS_VIEW,
            ev,
            data).then(() => {
            }, (detail) => {
              if (detail) {
                vm.loadData();
              }
            }, (err) => BaseService.getErrorLog(err));
        };

        //next and previous data function seprated
        vm.getPrevNextQty = (type) => {
          if (type === 'P' && vm.checkLastPrevPricing()) { return false; }
          if (type === 'N' && vm.checkLastNextPricing()) { return false; }
          let index = _.findIndex(vm.allLineItemList, (item) => item.id === vm.lineItem.id);
          if (type === 'N' && index < (vm.allLineItemList.length - 1)) {
            commonNextPrevDetail(index + 1);
          }
          else if (type === 'P' && index > 0) {
            commonNextPrevDetail(index - 1);
          }
        };
        //common code for next previous
        const nextPrevCommon = (index) => {
          vm.lineItem.qpa = _.clone(vm.allLineItemList[index].qpa);
          vm.lineItem.id = _.clone(vm.allLineItemList[index].id);
          vm.lineItem.lineID = _.clone(vm.allLineItemList[index].lineID);
          vm.lineItem.mfgComponents = _.clone(vm.allLineItemList[index].mfgComponents);
          vm.lineItem.ConsolidateQuantity = _.clone(vm.allLineItemList[index].ConsolidateQuantity);
          vm.lineItem.uomID = _.clone(vm.allLineItemList[index].uomID);
          vm.lineItem.numOfPosition = _.clone(vm.allLineItemList[index].numOfPosition);
          vm.lineItem.numOfRows = _.clone(vm.allLineItemList[index].numOfRows);
          vm.isshow = false;
          let actualPart = '';
          // const items = $scope.lineitem.rowEntity.mfgPN.split(',');
          _.each(vm.lineItem.mfgComponents, (alternate) => {
            var altPart = alternate.split('@@@');
            if (altPart) {
              actualPart = stringFormat('{0}{1} & ', actualPart, altPart[0]);
              actualPart = actualPart.replace('***', ',');
            }
          });
          //const items = vm.lineItem.component.split(',');
          //_.each(items, (alternate) => {
          //  var altPart = alternate.split('###');
          //  if (altPart) {
          //    actualPart = stringFormat('{0}{1}+{2} & ', actualPart, altPart[1], altPart[0]);
          //    actualPart = actualPart.replace('***', ',');
          //  }
          //});
          vm.lineItem.mfgPN = actualPart.slice(0, -2);
          const objCustom = _.find($scope.lineitem.rowEntity.lineItemCustoms, (item) => item.id === vm.lineItem.id);
          if (objCustom && objCustom.custom === 1) {
            vm.iscustomPartNumber = true;
          } else {
            vm.iscustomPartNumber = false;
          }
          vm.gridOptions.columnDefs[9].visible = !vm.iscustomPartNumber;
          getAlternateLineItemParts();
          vm.loadData();
          getAvailableInternalStock();
        };
        //common function for next and previous detail
        const commonNextPrevDetail = (index) => {
          if (vm.isdirty) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
            const obj = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
              canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
            };
            DialogFactory.messageConfirmDialog(obj).then((yes) => {
              if (yes) {
                BaseService.currentPageFlagForm = [];
                vm.isdirty = false;
                nextPrevCommon(index);
              }
            }, () => {
            }).catch((error) => BaseService.getErrorLog(error));
          }
          else {
            nextPrevCommon(index);
          }
        };
        //get next unprice detail for quantity
        vm.getUnPricedQty = () => {
          if (!vm.checkUnPricedQty() || vm.PriceTypeDetail.HISTORICAL_PRICE == vm.PriceType) { return false; }
          const currentindex = _.findIndex(vm.allLineItemList, (item) => item.id === vm.lineItem.id);
          let unPriceIndex;
          for (let i = 0; i < vm.allLineItemList.length; i++) {
            for (let j = 0; j < vm.lineItem.quantityTotals.length; j++) {
              if (!(vm.allLineItemList[i][vm.lineItem.quantityTotals[j].requestQty])) {
                unPriceIndex = _.indexOf(vm.allLineItemList, vm.allLineItemList[i]);
              }
            }
            if ((unPriceIndex === 0 || unPriceIndex) && (unPriceIndex > currentindex)) {
              commonNextPrevDetail(unPriceIndex);
              break;
            }
            if (i === (vm.allLineItemList.length - 1)) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.PRICING_CONTINUE);
              const obj = {
                messageContent: messageContent,
                btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
              };
              DialogFactory.messageConfirmDialog(obj).then((yes) => {
                if (yes) {
                  startunPriceQty();
                }
              }, () => {
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }
        };
        function connectSocket() {
          socketConnectionService.on(PRICING.EventName.AssemblyPricingStatus, pricingStatusListener);
        }
        connectSocket();

        socketConnectionService.on('reconnect', () => {
          connectSocket();
        });
        function removeSocketListener() {
          socketConnectionService.removeListener(PRICING.EventName.AssemblyPricingStatus, pricingStatusListener);
        }

        function pricingStatusListener(message) {
          if (message && message.AssyID === vm.lineItem.rfqAssyID && !vm.isResponse && vm.stockClick) {
            vm.isResponse = true;
            vm.stockClick = false;
            NotificationFactory.success(RFQTRANSACTION.PRICING.STOCK_UPDATE);
            $timeout(vm.loadData(),10000);
          }
        }
        $scope.$on('$destroy', () => {
          // Remove socket listeners
          removeSocketListener();
        });

        // on disconnect socket
        socketConnectionService.on('disconnect', () => {
          removeSocketListener();
        });
        //check object for next pricing
        vm.checkLastNextPricing = () => {
          if (vm.allLineItemList) {
            const index = _.findIndex(vm.allLineItemList, { id: vm.lineItem.id });
            if (index === (vm.allLineItemList.length - 1)) {
              return true;
            } else {
              return false;
            }
          }
          return false;
        };
        //check object for Prev pricing
        vm.checkLastPrevPricing = () => {
          if (vm.allLineItemList) {
            const index = _.findIndex(vm.allLineItemList, (item) => item.id === vm.lineItem.id);
            if (index === 0) {
              return true;
            } else {
              return false;
            }
          }
          return false;
        };
        //start un priced item quantity from first
        const startunPriceQty = () => {
          var unPriceIndex;
          for (let i = 0; i < vm.allLineItemList.length; i++) {
            for (let j = 0; j < vm.lineItem.quantityTotals.length; j++) {
              if (!vm.allLineItemList[i][vm.lineItem.quantityTotals[j].requestQty]) {
                unPriceIndex = _.indexOf(vm.allLineItemList, vm.allLineItemList[i]);
                break;
              }
            }
            if (unPriceIndex === 0 || unPriceIndex) {
              commonNextPrevDetail(unPriceIndex);
              break;
            }
          }
          if (!unPriceIndex && unPriceIndex !== 0) {
            const model = {
              multiple: true,
              messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.PRICING_LINEITEM)
            };
            DialogFactory.messageAlertDialog(model);
            return false;
          }
        };
        //remove MFG PN copied status on hover
        vm.MFGPNStatus = () => {
          vm.showMFGPNstatus = false;
        };
        //get selected row or not
        vm.getselectedRow = () => {
          vm.select = vm.gridOptions.gridApi.selection.getSelectedRows();
          if (vm.select.length === 0 && vm.isShowPriceBreak) {
            if (vm.selectedrow) {
              const index = _.indexOf(vm.sourceData, vm.selectedrow);
              vm.gridOptions.clearSelectedRows();
              vm.gridOptions.gridApi.selection.selectRow(vm.gridOptions.data[index]);
              return true;
            }
            else {
              return false;
            }
          }
          if (vm.select.length === 0) {
            vm.qtyBreakList = [];
            return false;
          }
          else if (vm.select.length > 1) {
            const index = _.indexOf(vm.sourceData, vm.selectedrow);
            vm.gridOptions.clearSelectedRows();
            vm.gridOptions.gridApi.selection.selectRow(vm.gridOptions.data[index]);
            return true;
          }
          else {
            return true;
          }
        };

        //copy MFG PN on click
        vm.copyMFGPNText = (item) => {
          var copytext = item;
          var $temp = $('<input>');
          $('body').append($temp);
          $temp.val(copytext).select();
          document.execCommand('copy');
          $temp.remove();
          vm.showMFGPNstatus = true;
        };
        vm.exportPricing = () => {
          if (vm.PriceType == vm.PriceTypeDetail.HISTORICAL_PRICE) { return false; };
          const priceExportList = [];
          _.each(vm.lineItem.mfgComponents, (component) => {
            if (!_.find(vm.lineItem.restrictedParts, (rest) => rest.mfgPNID === component.split('@@@')[3])) { //&& rest.consolidateID == vm.lineItem.id
              const nonRohs = _.find(vm.partNumberList, (nonRohsPart) => nonRohsPart.mfgPNID === component.split('@@@')[3]);
              if (nonRohs) {
                if (nonRohs.customerApproval === 'P' && nonRohs.RoHSStatusID === RFQTRANSACTION.NON_RoHS) {
                  return;
                } if (nonRohs.RoHSStatusID === RFQTRANSACTION.TBD || nonRohs.partStatusID === RFQTRANSACTION.TBD ||
                  nonRohs.mountingtypeID === RFQTRANSACTION.TBD || nonRohs.functionalCategoryID === RFQTRANSACTION.TBD) {
                  return;
                }
              }
              _.each(vm.lineItem.quantityTotals, (quantity) => {
                const componentDet = component.split('@@@');
                var objPrice = {
                  'ID*': vm.lineItem.id,
                  'Item*': vm.lineItem.lineID,
                  'MFR*': componentDet.length > 23 ? componentDet[23] : null,
                  'MPN*': componentDet.length > 22 ? (componentDet[22]).replace('***', ',') : null,
                  'Supplier*': null,
                  'Min': null,
                  'Mult': null,
                  'Quantity*': (quantity.requestQty) * (vm.lineItem.qpa ? vm.lineItem.qpa : 0),
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
              });
            }
          });

          const TimeStamp = $filter('date')(new Date(), CORE.DateFormatArray[0].format);
          exportFile(priceExportList, stringFormat('RFQ-{0}-{1}.xls', vm.lineItem.rfqID, TimeStamp));
        };
        //export document for pricing
        function exportFile(componentList, name) {
          if (componentList.length > 0) {
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
          else {
            const model = {
              multiple: true,
              messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.NOPARTSFORPRICE)
            };
            DialogFactory.messageAlertDialog(model);
          }
        }
        //import price
        vm.importPricing = (event) => {
          if (vm.PriceType == vm.PriceTypeDetail.HISTORICAL_PRICE || !vm.lineItem.qpa) { return false; }
          vm.event = event;
          angular.element('#fi-excel').trigger('click');
        };
        const _pricingHeader = RFQTRANSACTION.PRICING_COLUMN_MAPPING;
        vm.erOptions = {
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
          // loop through excel data and bind into model
          for (let i = 1, len = uploadedPrice.length; i < len; i++) {
            const item = uploadedPrice[i];
            const modelRow = {};
            uploadedPrice[0].forEach((column, index) => {
              if (column === null) {
                return;
              }
              const obj = priceHeaders.find((x) => x.column && x.column.toUpperCase() === column.name.toUpperCase());
              if (!obj) {
                return true;
              }
              const field = _pricingHeader.find((x) => x.fieldName === obj.header);
              if (!modelRow[field.fieldName]) {
                modelRow[field.fieldName] = item[index] ? item[index] : null;
              }
              else if (_multiFields.indexOf(field) !== -1) {
                let value = item[index] ? item[index] : null;
                if (!value) {
                  return true;
                }
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
            var remark = '';
            var error = '';
            var mfgPN;
            if (vm.lineItem.id === item.ID && vm.lineItem.lineID === item.Item) {
              const partNumberList = [];
              _.each(vm.lineItem.mfgComponents, (item) => {
                var mfgpart = item ? item.split('@@@') : '';
                var objPart = {
                  Mfg: mfgpart[23],
                  Name: mfgpart[22]
                };
                partNumberList.push(objPart);
              });
              const mfgCode = _.find(vm.lineItem.mfgCodeList, (mfgCode) => item.MFR && (mfgCode.mfgCode.toUpperCase() === item.MFR.toString().toUpperCase() || mfgCode.mfgName.toUpperCase() === item.MFR.toString().toUpperCase()) || (_.find(mfgCode.mfgCodeAlias, (codeAlias) => item.MFR && codeAlias.alias.toUpperCase() === item.MFR.toString().toUpperCase())));
              if (mfgCode) {
                mfgPN = _.find(partNumberList, (mfg) => item[vm.LabelConstant.MFGPN] && (mfg.Mfg.toUpperCase() === mfgCode.mfgCode.toUpperCase() || mfg.Mfg.toUpperCase() === mfgCode.mfgName.toUpperCase()) && mfg.Name.toUpperCase() === item[vm.LabelConstant.MFGPN].toString());
              }
              if (!item.MFR) {
                error = stringFormat(RFQTRANSACTION.PRICING.REQUIRED, vm.LabelConstant.MFG);
                remark = stringFormat('{0},{1}', remark, error);
                isDirty = true;
              }
              else if (item.MFR && !mfgCode) {
                error = stringFormat(RFQTRANSACTION.PRICING.INVALID, vm.LabelConstant.MFG);
                remark = stringFormat('{0},{1}', remark, error);
                isDirty = true;
              }
              if (!item[vm.LabelConstant.MFGPN]) {
                error = stringFormat(RFQTRANSACTION.PRICING.REQUIRED, vm.LabelConstant.MFGPN);
                remark = stringFormat('{0},{1}', remark, error);
                isDirty = true;
              }
              else if (item[vm.LabelConstant.MFGPN] && !mfgPN) {
                error = stringFormat(RFQTRANSACTION.PRICING.INVALID, vm.LabelConstant.MFGPN);
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
                const supplierCode = _.find(vm.lineItem.supplierList, (mfgCode) => mfgCode.isCustOrDisty && ((mfgCode.mfgCode.toUpperCase() === item.Supplier.toUpperCase() || mfgCode.mfgName.toUpperCase() === item.Supplier.toUpperCase()) || (_.find(mfgCode.mfgCodeAlias, (codeAlias) => codeAlias.alias.toUpperCase() === item.Supplier.toUpperCase()))));
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
                //  remark = stringFormat("{0},{1}", remark, error);
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
                //  var isminPrice = _.find(isminPrice, (minPrice) => { return parseFloat(item["Unit Price"]) > parseFloat(minPrice["Unit Price"]) });
                //  if (isminPrice) {
                //    error = RFQTRANSACTION.PRICING.PRICE_CHECK_VALIDATION;
                //    remark = stringFormat("{0},{1}", remark, error);
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
                    error = stringFormat(RFQTRANSACTION.PRICING.INVALID, 'Std. Lead Time (Weeks)');
                    remark = stringFormat('{0},{1}', remark, error);
                    isDirty = true;
                  }
                }
                catch (err) {
                  error = stringFormat(RFQTRANSACTION.PRICING.INVALID, 'Std. Lead Time (Weeks)');
                  remark = stringFormat('{0},{1}', remark, error);
                  isDirty = true;
                }
              }
              if (item.Packaging) {
                const objPackage = _.find(vm.lineItem.packagingAll, (pakg) => pakg.name.toUpperCase() === item.Packaging.toUpperCase() || (_.find(pakg.component_packagingmst, (pkgAlias) => pkgAlias.alias.toUpperCase() === item.Packaging.toUpperCase())));
                if (!objPackage) {
                  error = stringFormat(RFQTRANSACTION.PRICING.INVALID, 'Packaging');
                  remark = stringFormat('{0},{1}', remark, error);
                  isDirty = true;
                }
              }
              if (item.NCNR) {
                const isexist = _.find(RFQTRANSACTION.CUSTOM_STATUS, (status) => status.Name.toUpperCase() === item.NCNR.toUpperCase());
                if (!isexist) {
                  error = stringFormat(RFQTRANSACTION.PRICING.INVALID, 'NCNR');
                  remark = stringFormat('{0},{1}', remark, error);
                  isDirty = true;
                } else {
                  item.NCNR = isexist.Name;
                }
              }
              if (item['Custom Reel']) {
                const isexist = _.find(RFQTRANSACTION.CUSTOM_STATUS, (status) => status.Name.toUpperCase() === item['Custom Reel'].toUpperCase());
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
            const autocompletePromise = [getnonQuoteQtyItems()];
            vm.cgBusyLoading = $q.all(autocompletePromise).then((responses) => {
              if (responses) {
                vm.pricingsetting = responses[0].priceSetting;
                saveExportPricing(parts);
              }
            });
          }
        };

        // get supplier image
        vm.getImage = (row) => {
          const SupplierApis = _.clone(CORE.Suppliers_Api);
          var imageObj = _.find(SupplierApis, (item) => item.ID === row.SupplierID);
          if (imageObj && imageObj.ID < 0) {
            return imageObj.ID === -6 ? stringFormat(imageObj.Image, WebsiteBaseUrl) : imageObj.Image;
          }
          else {
            return '';
          }
        };
        //concate rohs icon
        vm.rohsName = (icon) => stringFormat('{0}{1}', rohsImagePath, icon);
        const getUnitList = () => {
          SalesOrderFactory.getUnitList().query().$promise.then((unitlist) => {
            vm.UnitList = unitlist.data;
          }).catch((error) => BaseService.getErrorLog(error));
        };
        getUnitList();
        //go to part master
        vm.gotoPartMaster = (item) => {
          BaseService.goToComponentDetailTab(null, item.partID);
        };

        //clear price confirmation
        vm.clearselectedPrice = () => {
          if (vm.PriceType != vm.PriceTypeDetail.CURRENT_PRICE || vm.sourceData.length === 0) { return false; }
          let isselectedPrice = false;
          if (vm.lineItem.ConsolidateQuantity.length > 0) {
            _.each(vm.lineItem.ConsolidateQuantity, (qtyPercentage) => {
              const objIscheck = _.find(vm.sourceData, (item) => item[qtyPercentage.requestQty + '_Check']);
              if (objIscheck) {
                isselectedPrice = true;
              }
            });
          }
          if (!isselectedPrice) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.CLEAR_PRICE_ALERT);
            messageContent.message = stringFormat(messageContent.message, vm.lineItem.lineID);
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
            messageContent.message = stringFormat(messageContent.message, vm.lineItem.lineID);
            const obj = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
            };
            DialogFactory.messageConfirmDialog(obj).then((yes) => {
              if (yes) {
                const objPrice = {
                  id: vm.lineItem.id
                };
                vm.cgBusyLoading = PartCostingFactory.clearSelectedqtyPrice().query(objPrice).$promise.then(() => {
                  _.each(vm.lineItem.ConsolidateQuantity, (consolidate) => {
                    consolidate.rfqQtySupplierID = null;
                    consolidate.unitPrice = null;
                  });
                  vm.pagingInfo.Page = 1;
                  vm.loadData();
                  BaseService.isChangePriceSelector = true;
                }).catch((error) => BaseService.getErrorLog(error));
              }
            }, () => {
            }).catch((error) => BaseService.getErrorLog(error));
          }
        };
        //save details of pricing in database
        const saveExportPricing = (parts) => {
          var list = groupByMulti(parts, ['ID', vm.LabelConstant.MFGPN]);
          var priceListForPrice = [];
          _.each(list, (unitList) => {
            _.each(unitList, (partNumber) => {
              var objPackage = null;
              var priceBreakList = [];
              var assyQtyBreak = [];
              const mfgParts = partNumber[0];
              var currentObj = _.find(vm.partNumberList, (cPartNumber) => cPartNumber.mfgPN.toUpperCase() === mfgParts[vm.LabelConstant.MFGPN].toUpperCase() && (mfgParts.MFR.toUpperCase() === cPartNumber.mfgName.toUpperCase() || mfgParts.MFR.toUpperCase() === cPartNumber.mfgCode.toUpperCase()));
              var selectPartNumber;
              if (currentObj) {
                selectPartNumber = currentObj;
              }
              if (selectPartNumber && !_.find(vm.lineItem.restrictedParts, (rest) => rest.mfgPNID === selectPartNumber.mfgPNID && rest.consolidateID === mfgParts.ID)) {
                if (mfgParts.Packaging) {
                  objPackage = _.find(vm.lineItem.packagingAll, (pakg) => pakg.name.toUpperCase() === mfgParts.Packaging.toUpperCase() || (_.find(pakg.component_packagingmst, (pkgAlias) => pkgAlias.alias.toUpperCase() === mfgParts.Packaging.toUpperCase())));
                }
                const supplierCode = _.find(vm.lineItem.supplierList, (mfgCode) => mfgCode.isCustOrDisty && ((mfgCode.mfgCode.toUpperCase() === mfgParts.Supplier.toUpperCase() || mfgCode.mfgName.toUpperCase() === mfgParts.Supplier.toUpperCase()) || (_.find(mfgCode.mfgCodeAlias, (codeAlias) => codeAlias.alias.toUpperCase() === mfgParts.Supplier.toUpperCase()))));
                let uomID = vm.lineItem.uomID;
                if (selectPartNumber.noOfPosition && selectPartNumber.connecterTypeID === RFQTRANSACTION.DEFAULT_ID.HEADER_BREAKWAY) {
                  uomID = RFQTRANSACTION.DEFAULT_ID.PINUOM;
                }
                const BomUnit = _.find(vm.UnitList, (uoms) => uoms.id === uomID);
                const CompUnit = _.find(vm.UnitList, (uoms) => uoms.id === selectPartNumber.uom);
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
                const supplierQty = {
                  ConsolidateID: parseInt(mfgParts.ID),
                  MinimumBuy: parseInt(mfgParts.Min),
                  Active: true,
                  PartNumberId: selectPartNumber ? selectPartNumber.mfgPNID : null,
                  SupplierPN: mfgParts['Supplier PN'],
                  SourceOfPrice: 'Manual',
                  Packaging: mfgParts.Packaging,
                  Authorized_Reseller: true,
                  ManufacturerPartNumber: mfgParts[vm.LabelConstant.MFGPN],
                  APILeadTime: mfgParts['Std. Lead Time'] ? parseFloat(mfgParts['Std. Lead Time']) : 0,
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
                  rfqAssyID: parseInt(vm.lineItem.rfqAssyID),
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
                  qpa: vm.lineItem.qpa,
                  bomUnitID: BomUnit.id,
                  componentUnitID: selectPartNumber.uom,
                  packageQty: selectPartNumber.unit,
                  PackageSPQQty: selectPartNumber.packageQty,
                  connectorTypeID: selectPartNumber ? selectPartNumber.connecterTypeID : null,
                  AuthorizeSupplier: supplierCode ? supplierCode.authorizeType : null,
                  rohsIcon: selectPartNumber ? selectPartNumber.rohsIcon : null,
                  isPurchaseApi: false,
                  AdditionalValueFee: mfgParts['Additional Value Fee'] ? mfgParts['Additional Value Fee'] : 0,
                  isCustom: vm.iscustomPartNumber ? true : false
                };
                _.each(partNumber, (pBreak) => {
                  var priceBreak = {
                    componentID: selectPartNumber ? selectPartNumber.mfgPNID : null,
                    mfgPN: mfgParts[vm.LabelConstant.MFGPN],
                    supplier: mfgParts.Supplier,
                    supplierPN: mfgParts['Supplier PN'],
                    price: parseFloat(pBreak['Unit Price']),
                    qty: parseInt(pBreak.Quantity),
                    Packaging: mfgParts.Packaging,
                    isCustomPrice: false,
                    leadTime: pBreak['Std. Lead Time'] ? parseFloat(pBreak['Std. Lead Time']) : 0,
                    Type: 'Manual',
                    packagingID: mfgParts.Packaging && objPackage ? objPackage.id : null,
                    supplierID: supplierCode ? supplierCode.id : null
                  };
                  priceBreakList.push(priceBreak);
                });
                _.each(vm.lineItem.quantityTotals, (assyQty) => {
                  var price;
                  var unitPrice;
                  var leadTime;
                  var requestQty = assyQty.requestQty * (vm.lineItem.qpa ? vm.lineItem.qpa : 0);
                  if (BomUnit && CompUnit) { // changed code for each
                    const fromBasedUnitValues = (BomUnit.baseUnitConvertValue) * (selectPartNumber.unit ? selectPartNumber.unit : 1);
                    const toBasedUnitValues = CompUnit.baseUnitConvertValue;
                    const ConvertFromValueIntoBasedValue = (requestQty / fromBasedUnitValues);
                    requestQty = parseInt(Math.ceil(ConvertFromValueIntoBasedValue * toBasedUnitValues)) === 0 ? 1 : parseInt(Math.ceil(ConvertFromValueIntoBasedValue * toBasedUnitValues));
                  }
                  //else {
                  //    requestQty = requestQty * (vm.lineItem.qpa ? vm.lineItem.qpa : 1);
                  //}
                  if (selectPartNumber.noOfPosition && selectPartNumber.connecterTypeID === RFQTRANSACTION.DEFAULT_ID.HEADER_BREAKWAY) {
                    currentObj.numOfposition = currentObj.numOfposition ? currentObj.numOfposition : 1;
                    requestQty = requestQty * (currentObj.numOfposition);
                    const noOfPositionDiff = parseFloat((selectPartNumber.noOfPosition) - ((selectPartNumber.noOfPosition) % (currentObj.numOfposition)));
                    if (noOfPositionDiff === 0) {
                      return;
                    }
                    requestQty = requestQty / noOfPositionDiff;
                  }
                  let ordQty = Math.max((Math.ceil((requestQty) / supplierQty.Multiplier) * supplierQty.Multiplier), supplierQty.MinimumBuy);
                  const ActualQty = ordQty;
                  let priceBreakDetail;
                  if (vm.iscustomPartNumber) {
                    const settingType = RFQTRANSACTION.PRICE_SELECTEION_SETTING_TYPE.CUSTOM_PART_SELECTION.value;
                    const setting = _.find(vm.pricingsetting, (set) => set.requestQty === assyQty.requestQty && set.settingType === settingType);
                    if (setting && setting.isLeadTime) {
                      let consolidateList = _.filter(priceBreakList, (consolidate) => consolidate.qty === ordQty);
                      if (consolidateList.length === 0) {
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
                        if (consolidateList.length === 0) {
                          consolidateList = actualConsolidateList;
                        }
                        priceBreakDetail = _.minBy(consolidateList, 'price');
                      }
                    } else {
                      const consolidateList = _.filter(priceBreakList, (consolidate) => consolidate.qty === ordQty);
                      if (consolidateList.length === 0) {
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
                    priceBreakDetail = _.find(priceBreakList, (qtyBreak) => qtyBreak.qty === ordQty);
                  }
                  if (priceBreakDetail) {
                    unitPrice = parseFloat(priceBreakDetail.price);
                    price = parseFloat((priceBreakDetail.price * ordQty).toFixed(_unitPriceFilterDecimal));
                    leadTime = parseFloat(priceBreakDetail.leadTime);
                  }
                  else {
                    let priceList = _.sortBy(_.filter(priceBreakList, (qtyBreak) => qtyBreak.qty < ordQty), (o) => o.qty);
                    if (priceList.length === 0) {
                      priceList = _.sortBy(priceBreakList, (qtyBreak) => qtyBreak.qty);
                    }
                    unitPrice = parseFloat(priceList[priceList.length - 1].price);
                    price = parseFloat((priceList[priceList.length - 1].price * ordQty).toFixed(_unitPriceFilterDecimal));
                    leadTime = parseFloat(priceList[priceList.length - 1].leadTime);
                  }
                  let ActualPrice = unitPrice;
                  if (BomUnit && CompUnit) {
                    unitPrice = (unitPrice * (CompUnit.baseUnitConvertValue ? CompUnit.baseUnitConvertValue : 1)) / ((selectPartNumber.unit ? selectPartNumber.unit : 1) * (BomUnit.baseUnitConvertValue ? BomUnit.baseUnitConvertValue : 1));
                    const toBasedUnitValues = (BomUnit.baseUnitConvertValue) * (selectPartNumber.unit ? selectPartNumber.unit : 1);
                    const fromBasedUnitValues = CompUnit.baseUnitConvertValue;
                    const ConvertFromValueIntoBasedValue = (ordQty / fromBasedUnitValues);
                    ordQty = parseInt(Math.ceil(ConvertFromValueIntoBasedValue * toBasedUnitValues)) === 0 ? 1 : parseInt(Math.ceil(ConvertFromValueIntoBasedValue * toBasedUnitValues));
                    //require quantity for price
                    requestQty = parseInt(assyQty.requestQty * (vm.lineItem.qpa ? vm.lineItem.qpa : 0));
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
                    RequireQty: requestQty,
                    OrderQty: parseInt(ordQty),
                    PricePerPart: unitPrice,
                    leadTime: leadTime,
                    TotalDollar: price,
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
            });
          });

          vm.cgBusyLoading = PartCostingFactory.saveImportPricing().query({ objManualPrice: priceListForPrice }).$promise.then(() => {
            vm.loadData();
          }).catch((error) => BaseService.getErrorLog(error));
        };
        //go to component page
        vm.gotoComponent = (row) => {
          BaseService.goToComponentDetailTab(null, row.PartNumberId);
        };

        vm.addSupplierQuoteDetail = () => {
          if (vm.isshow || vm.PriceType != vm.PriceTypeDetail.CURRENT_PRICE || !vm.lineItem.qpa) { return false; }
          const data = {
            mfgPN: mfgPNstring
          };

          DialogFactory.dialogService(
            TRANSACTION.ADD_SUPPLIER_QUOTE_MODAL_CONTROLLER,
            TRANSACTION.ADD_SUPPLIER_QUOTE_MODAL_VIEW,
            null,
            data).then((resData) => {
              BaseService.goToSupplierQuoteWithPartDetail(resData.id, resData.component);
            }, () => {
            }, (err) => BaseService.getErrorLog(err));
        };

        // redirect to supplier quote detail page
        vm.goToSupplierQuoteDetail = (id) => {
          BaseService.goToSupplierQuoteWithPartDetail(id);
        };
        //go to Supplier Quote page
        vm.gotoSupplierQuote = () => {
          if (vm.isshow || vm.PriceType != vm.PriceTypeDetail.CURRENT_PRICE || !vm.lineItem.qpa) { return false; }
          BaseService.goToSupplierQuoteList();
        };
        // Go to Manufacture Page
        vm.goToManufacturer = (mfgcodeID) => {
          BaseService.goToManufacturer(mfgcodeID);
        };
        // Go to Supplier Page
        vm.goToSupplierDetail = (mfgcodeID) => {
          BaseService.goToSupplierDetail(mfgcodeID);
        };

        // Redirect to RFQ Detail page
        vm.goToRFQ = () => {
          BaseService.goToRFQUpdate(vm.lineItem.rfqID, vm.lineItem.rfqAssyID);
          return false;
        };
        //go to assy list
        vm.goToAssyList = () => {
          BaseService.goToPartList();
          return false;
        };
        //remove part price
        // delete partcategory
        vm.deleteRecord = (row) => {
          const obj = {
            rfqSupplierID: row._id
          };
          return PartCostingFactory.getUsedPricing().query(obj).$promise.then((response) => {
            if (response.data) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.COSTING_PRICE_ALREADY_USE);
              messageContent.message = stringFormat(messageContent.message);
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              return DialogFactory.messageAlertDialog(model).then(() => {
              }, () => {
              }).catch((error) => BaseService.getErrorLog(error));
            } else {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
              messageContent.message = stringFormat(messageContent.message, 'Price', 1);
              const obj = {
                messageContent: messageContent,
                btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
              };
              DialogFactory.messageConfirmDialog(obj).then((resposne) => {
                if (resposne) {
                  const obj = {
                    id: row._id,
                    rfqAssyID: parseInt(row.rfqAssyID) || null,
                    ConsolidateID: row.ConsolidateID
                  };
                  PartCostingFactory.removeSelectedQuotePrice().query(obj).$promise.then(() => {
                    vm.refreshPrice();
                  }).catch((error) => BaseService.getErrorLog(error));
                }
              }, () => {
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }).catch((error) => BaseService.getErrorLog(error));
        };
        //refresh price
        vm.refreshPrice = () => {
          vm.loadData();
        };
        $scope.cancel = function () {
          if (vm.isdirty) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.PRICING_SAVE);
            const obj = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
            };
            DialogFactory.messageConfirmDialog(obj).then((yes) => {
              if (yes) {
                vm.saveFinalPrice(true);
              }
              $mdSidenav('price-selector').close();
            }, () => {
              $mdSidenav('price-selector').close();
            }).catch((error) => BaseService.getErrorLog(error));
            BaseService.currentPageFlagForm = [];
          }
          else {
            BaseService.currentPageFlagForm = [];
            $mdSidenav('price-selector').close();
          }
        };

        //get not quoted line items and price settings
        function getnonQuoteQtyItems() {
          return PartCostingFactory.getnonQuotedQty().query({ rfqAssyID: vm.lineItem.rfqAssyID, isPurchaseApi: false }).$promise.then((list) => {
            if (list && list.data) {
              return list.data;
            }
            return list.data;
          }).catch((error) => BaseService.getErrorLog(error));
        }
        // on load controller
        angular.element(() => {
          vm.showMarquee = true;
        });
      }],
      link: () => {
      }
    };
  }
})();
