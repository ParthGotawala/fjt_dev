(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('componentQuotePriceHistory', componentQuotePriceHistory);

  /** @ngInject */
  function componentQuotePriceHistory(CORE, $stateParams, USER, $q, ComponentFactory, BaseService, $timeout, PRICING, ManufacturerFactory, RFQTRANSACTION, $filter) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        partId: '=?',
        mfgType: '=?',
        mfgCode: '=?',
        mfgPn: '=?',
        disableExternalApi: '=?',
        isCustom: '=?',
        isCpn: '=?'
      },
      templateUrl: 'app/directives/custom/component-quote-price-history/component-quote-price-history.html',
      controller: componentQuotePriceHistoryCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function componentQuotePriceHistoryCtrl($scope) {
      var vm = this;
      vm.partId = $scope.partId;
      vm.mfgType = $scope.mfgType;
      vm.mfgPn = $scope.mfgPn;
      vm.mfgCode = $scope.mfgCode;
      vm.DefaultDateTimeFormat = _dateTimeDisplayFormat;
      vm.CustomPriceDropdown = CORE.CustomPriceDropdown;
      vm.disableExternalApi = $scope.disableExternalApi;
      const priceOption = angular.copy(RFQTRANSACTION.PRICE_APPLIED);
      vm.apiPriceHistoryBy = priceOption.filter((a) => a.id);
      const defaultTTMDuration = CORE.CommonDateFilterSearchCriteria.find((a) => a.key === 'TTM');
      vm.selectedDuration = defaultTTMDuration.key;
      vm.selectAPI = $scope.isCustom || $scope.isCpn ? vm.apiPriceHistoryBy[1].id : vm.apiPriceHistoryBy[0].id; //RFQTRANSACTION.PRICE_APPLIED
      vm.pricingHistoryEmptyMesssage = USER.ADMIN_EMPTYSTATE.PRICING_HISTROY;
      //Initalize auto complete for pricing apis
      const initAutoComplete = () => {
        vm.autoCompletePricingDist = {
          columnName: 'mfgCodeName',
          controllerName: CORE.MANAGE_MFGCODE_MODAL_CONTROLLER,
          viewTemplateURL: CORE.MANAGE_MFGCODE_MODAL_VIEW,
          keyColumnName: 'id',
          keyColumnId: null,
          inputName: 'Supplier',
          placeholderName: 'Supplier',
          isRequired: true,
          isAddnew: true,
          isUppercaseSearchText: true,
          onSelectCallbackFn: getSupplierApi,
          addData: {
            mfgType: CORE.MFG_TYPE.DIST,
            popupAccessRoutingState: [USER.ADMIN_MANAGESUPPLIER_DETAIL_STATE],
            pageNameAccessLabel: CORE.PageName.supplier
          },
          callbackFn: function () {
            return vm.getSupplierCode();
          }
        };
      };
      const initPageInfo = () => {
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),
          SortColumns: [['timeStamp', 'DESC']],
          SearchColumns: []
        };
      };
      initPageInfo();
      /*get data for ui-grid */

      vm.sourceHeader = [
        {
          field: '#',
          width: '70',
          cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
          enableFiltering: false,
          enableSorting: false
        },
        {
          field: 'supplier',
          displayName: 'Supplier',
          width: '200',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                             <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToSupplierDetail(row.entity.supplierID);"\
                                  tabindex="-1">{{COL_FIELD}}</a>\
                        </div>'
        },
        {
          field: 'supplierPN',
          displayName: 'Supplier PN',
          width: '200',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                             <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToSupplierPartDetails(row.entity.supplierPartID);"\
                                  tabindex="-1">{{COL_FIELD}}</a>\
                        </div>'
        },
        {
          field: 'Packaging',
          displayName: 'Packaging',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>'
        },
        {
          field: 'qty',
          displayName: 'Qty',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>'
        },
        {
          field: 'standardPrice',
          displayName: 'Standard Price',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | unitPrice}}</div>'
        },
        {
          field: 'extendedPrice',
          displayName: 'Extended Price',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>'
        },
        {
          field: 'customPrice',
          displayName: 'Special Price',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | unitPrice}}</div>'
        },
        {
          field: 'extendedCustomPrice',
          displayName: 'Extended Price',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>'
        },
        {
          field: 'Type',
          displayName: 'Price Type',
          width: '120',
          cellTemplate: '<div class=\"ui-grid-cell-contents\" ng-class=\"{\'background-skyblue-pricing\':row.entity.SourceOfPrice==\'Manual\'}">{{COL_FIELD}}</div>',
          enableCellEdit: false,
          enableFiltering: false,
          allowCellFocus: false,
          maxWidth: '145'
        },
        {
          field: 'timeStamp',
          width: '200',
          displayName: 'Timestamp',
          enableFiltering: false,
          cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.timeStamp}}</div>'
        }
      ];

      vm.gridOptions = {
        showColumnFooter: false,
        enableRowHeaderSelection: false,
        enableFullRowSelection: false,
        enableRowSelection: false,
        multiSelect: false,
        filterOptions: vm.pagingInfo.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: 'Pricing Histroy.csv'
      };
      vm.isHideDelete = true;
      vm.sourceData = [];

      // load data for ui-grid
      vm.loadData = () => {
        vm.pagingInfo.componentID = $scope.partId;
        vm.pagingInfo.fromDate = BaseService.getAPIFormatedDate(vm.fromDate);
        vm.pagingInfo.toDate = vm.toDate ? vm.toDate : vm.pagingInfo.fromDate;
        vm.pagingInfo.supplierID = vm.selectAPI === vm.apiPriceHistoryBy[0].id ? vm.selectedSupplier : vm.autoCompletePricingDist.keyColumnId;
        vm.pagingInfo.Type = vm.selectAPI;
        vm.pagingInfo.priceFilter = vm.selectedPrice;
        vm.pagingInfo.isMfg = (vm.mfgType.toLowerCase() === CORE.MFG_TYPE.MFG.toLowerCase());
        vm.cgBusyLoading = ComponentFactory.getPricingHistroy(vm.pagingInfo).query().$promise.then((response) => {
          if (response && response.data && response.data.result) {
            _.each(response.data.result, (item) => {
              item.supplier = (vm.selectedSupplier && vm.selectedSupplier.mfgCodeName) ? vm.selectedSupplier.mfgCodeName : item.supplier;
              if (item.packagingID && vm.packagingList && vm.packagingList.length) {
                const pricePackaging = _.find(vm.packagingList, (pack) => pack.id === item.packagingID);
                item.Packaging = pricePackaging ? pricePackaging.name : item.Packaging;
              }
              item.timeStamp = BaseService.getUIFormatedDateTime(item.timeStamp, vm.DefaultDateTimeFormat);
            });
            vm.sourceData = response.data.result;
            vm.totalSourceDataCount = response.data.Count;

            if (!vm.gridOptions.enablePaging) {
              vm.currentdata = vm.sourceData.length;
              vm.gridOptions.gridApi.infiniteScroll.resetScroll();
            }

            vm.gridOptions.clearSelectedRows();
            if (vm.totalSourceDataCount === 0) {
              vm.priceHistroyNotFound = false;
              vm.emptyState = 0;
            }
            else {
              vm.priceHistroyNotFound = false;
              vm.emptyState = null;
            }
            $timeout(() => {
              vm.resetSourceGrid();
              if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
                return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
              }
            });
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* load more data on mouse scroll */
      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.cgBusyLoading = ComponentFactory.getPricingHistroy(vm.pagingInfo).query().$promise.then((response) => {
          if (response && response.data && response.data.result) {
            _.each(response.data.result, (item) => {
              item.supplier = (vm.selectedSupplier && vm.selectedSupplier.mfgCodeName) ? vm.selectedSupplier.mfgCodeName : item.supplier;
              if (item.packagingID && vm.packagingList && vm.packagingList.length) {
                const pricePackaging = _.find(vm.packagingList, (pack) => pack.id === item.packagingID);
                item.Packaging = pricePackaging ? pricePackaging.name : item.Packaging;
              }
            });
            vm.sourceData = vm.sourceData.concat(response.data.result);
            vm.currentdata = vm.sourceData.length;
            vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
            $timeout(() => {
              vm.resetSourceGrid();
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount !== vm.currentdata ? true : false);
            });
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      //get data for mfgcode
      vm.getSupplierCode = () => {
        var searchObj = {
          mfgType: CORE.MFG_TYPE.DIST,
          isCodeFirst: true
        };

        return ManufacturerFactory.getAllManufacturerWithFormattedCodeList(searchObj).query().$promise.then((mfgcodes) => {
          vm.SupplierList = [];
          if (mfgcodes && mfgcodes.data) {
            vm.SupplierList = mfgcodes.data;
          }
          vm.APISupplier = _.orderBy(vm.SupplierList.filter((a) => a.id < 0), 'id', 'desc');
          //vm.SupplierList = vm.SupplierList.filter((a) => a.id >= 0);
          vm.selectedSupplier = vm.APISupplier[0].id;
          return $q.resolve(vm.SupplierList);
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.selectPriceChange = () => {
        if (vm.mfgType.toUpperCase() !== $scope.mfgType) {
          if (vm.selectedPrice === 'latestPrice') {
            vm.autoCompletePricingDist.keyColumnId = PRICING.SUPPLIER_CODE.DigiKey.Id;
          }
          else {
            vm.autoCompletePricingDist.keyColumnId = '';
          }
        }
      };
      vm.selectPriceType = () => {
        vm.selectedSupplier = PRICING.SUPPLIER_CODE.DigiKey.Id;
      };
      const getSupplierApi = (item) => {
        vm.selectedSupplier = item;
        if (!item) {
          vm.apiurl = '';
          vm.response = '';
        }
      };

      vm.priceSelectorDateReset = () => {
        //const date = new Date();
        //date.setDate(date.getDate() - 30);
        //vm.toDate = new Date();
        //vm.fromDate = date;
        vm.resetDateFilter();
        vm.selectedPrice = 'latestPrice';
        vm.selectAPI = $scope.isCustom || $scope.isCpn? vm.apiPriceHistoryBy[1].id : vm.apiPriceHistoryBy[0].id;
        vm.selectedSupplier = PRICING.SUPPLIER_CODE.DigiKey.Id;
        vm.autoCompletePricingDist.keyColumnId = PRICING.SUPPLIER_CODE.DigiKey.Id;
        initPageInfo();
        vm.loadData();
      };

      vm.fromDateChanged = () => {
        vm.selectedLtbDate = vm.fromDate ? $filter('date')(new Date(vm.fromDate), vm.DefaultDateFormat) : null;
        if (vm.fromDate > vm.toDate) {
          vm.toDate = null;
        }
        vm.fromDateOptions = {
          fromDateOpenFlag: false
        };
      };

      vm.toDateChanged = () => {
        vm.SelectedEolDate = vm.toDate ? $filter('date')(new Date(vm.toDate), vm.DefaultDateFormat) : null;
        if (vm.toDate < vm.fromDate) {
          vm.fromDate = null;
        }
        vm.toDateOptions = {
          toDateOpenFlag: false
        };
      };
      vm.toOpenPicker = (type, ev) => {
        if (ev.keyCode === 40) {
          vm.IsToPickerOpen[type] = true;
        }
      };
      vm.priceSelectorDateSearch = () => {
        // initPageInfo();
        // vm.loadData();
        BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
      };

      const autocompletePromise = [vm.getSupplierCode()];
      $scope.$parent.vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
        initAutoComplete();
        vm.selectedPrice = 'latestPrice';
        if (vm.partHeaderDataLoaded && (vm.mfgType.toUpperCase() === vm.mfgTypeDist)) {
          vm.autoCompletePricingDist.keyColumnId = vm.displayComponentDetail.mfgcodeID;
        }
        else {
          vm.autoCompletePricingDist.keyColumnId = PRICING.SUPPLIER_CODE.DigiKey.Id;
        }
        vm.isPricingHistoryGridVisible = true;
      }).catch((error) => BaseService.getErrorLog(error));

      //link to go supplier list page
      vm.goToSupplierList = () => {
        BaseService.goToSupplierList();
      };

      angular.element(() => {
        BaseService.currentPageForms.push(vm.priceBreakForm);
      });

      vm.goToPartPriceBreakDetails = () => {
        BaseService.openInNew(USER.ADMIN_COMPONENT_PRICE_BREAK_DETAILS_STATE, {});
      };
      // Go to Supplier Page
      vm.goToSupplierDetail = (mfgcodeID) => {
        BaseService.goToSupplierDetail(mfgcodeID);
      };
      //go to part master
      vm.goToSupplierPartDetails = (partID) => {
        BaseService.goToSupplierPartDetails(partID);
      };
    }
  }
})();
