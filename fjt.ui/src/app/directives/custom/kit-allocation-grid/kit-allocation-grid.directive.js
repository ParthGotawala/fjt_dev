(function () {
  'use sctrict';
  angular
    .module('app.core')
    .directive('kitAllocationGrid', kitAllocationGrid);

  /** @ngInject */
  function kitAllocationGrid($mdDialog, KitAllocationFactory) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        salesOrderDetail: '=',
        isSelectSO: '=',
        assemblyDetail: '=',
        shortageLines: '=',
        packagingAlias: '=',
        kitFilter: '=?',
        mountingTypeId: '=?'
      },
      templateUrl: 'app/directives/custom/kit-allocation-grid/kit-allocation-grid.html',
      controller: kitAllocationGridCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function kitAllocationGridCtrl($scope, $timeout, $filter, CORE, USER, TRANSACTION, DialogFactory, BaseService, $q) {
      var vm = this;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.LabelConstant = CORE.LabelConstant;
      vm.transaction = TRANSACTION;
      vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.KIT_ALLOCATION;
      vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
      vm.salesOrderDetail = $scope.salesOrderDetail;
      vm.mountingTypeId = $scope.mountingTypeId;
      vm.isSelectSO = $scope.isSelectSO;
      vm.assemblyDetail = $scope.assemblyDetail;
      vm.shortageLines = $scope.shortageLines;
      vm.packagingAlias = $scope.packagingAlias;
      vm.gridConfig = CORE.gridConfig;
      vm.isHideDelete = true;
      vm.isExpand = true;
      vm.salesOrderDetail.SubAssy = vm.assemblyDetail.mfgPN;
      vm.salesOrderDetail.SubAssyPIDCode = vm.assemblyDetail.pIDCode;
      vm.salesOrderDetail.SubAssymfgPNwithOutSpacialChar = vm.assemblyDetail.mfgPNwithOutSpacialChar;
      vm.salesOrderDetail.SubAssypidCodewithOutSpacialChar = vm.assemblyDetail.pidCodewithOutSpacialChar;
      vm.salesOrderDetail.SubAssyMfgPNDescription = vm.assemblyDetail.mfgPNDescription;
      vm.salesOrderDetail.SubAssySpecialNote = vm.assemblyDetail.specialNote;
      vm.isNoDataFound = false;
      vm.isBOMNotSave = false;
      vm.isDeallocatedUMID = true;
      vm.isInternalStock = true;
      vm.isCustomerStock = true;
      vm.isDeallocationStock = true;
      vm.isCustConsignStatus = true;
      vm.isCustConsignHistory = true;
      vm.showAdvanceFilter = vm.mountingTypeId ? true : false;
      vm.currentDate = $filter('date')(new Date(), 'MMddyy');
      vm.KeywordStatusGridHeaderDropdown = CORE.KeywordStatusGridHeaderDropdown;
      vm.isEnableKitLineCustConsignStatus = false;
      vm.loginUser = BaseService.loginUser;
      let objApproval = null;

      const getAllRights = () => {
        vm.isEnableKitLineCustConsignStatus = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToChangeKitLineCustConsignStatus);
      };
      getAllRights();

      if (vm.assemblyDetail.level > 0) {
        vm.salesOrderDetail.SubAssyId = vm.assemblyDetail.partId;
        vm.salesOrderDetail.SubKitQty = vm.assemblyDetail.kitQty;
        vm.salesOrderDetail.SubMrpQty = vm.assemblyDetail.mrpQty;
        vm.salesOrderDetail.SubPOQty = (vm.salesOrderDetail.poQty * vm.assemblyDetail.perAssyBuildQty);
        vm.salesOrderDetail.kitRohsIcon = vm.assemblyDetail.kitRohsIcon;
        vm.salesOrderDetail.kitRohsName = vm.assemblyDetail.kitRohsName;
        vm.salesOrderDetail.kitNumber = stringFormat('{0}-{1}', vm.salesOrderDetail.kitNumber, vm.salesOrderDetail.SubAssy);
      } else {
        vm.salesOrderDetail.SubAssyId = null;
        vm.salesOrderDetail.SubKitQty = null;
      }
      const initPageInfo = () => {
        vm.pagingInfo = {
          Page: 0,
          pageSize: CORE.UIGrid.ItemsPerPage(),
          SortColumns: [['lineID', 'ASC']],
          SearchColumns: []
        };
      };
      initPageInfo();

      vm.gridOptions = {
        filterOptions: vm.pagingInfo.SearchColumns,
        enableCellEdit: true,
        enablePaging: false,
        enableCellEditOnFocus: false,
        exporterCsvFilename: vm.salesOrderDetail.isCallFromFeasibility ? stringFormat('Build Feasibility Shortage Detail-{0}-{1}-{2}.csv', vm.assemblyDetail.pIDCode, vm.salesOrderDetail.feasibilityKitQty, vm.currentDate) : 'Kit Allocation.csv',
        exporterMenuCsv: true,
        allowToExportAllData: true,
        enableColumnMenus: false,
        enableRowSelection: false,
        enableFullRowSelection: false,
        exporterAllDataFn: () => {
          const pagingInfoOld = _.clone(vm.pagingInfo);
          pagingInfoOld.pageSize = 0;
          pagingInfoOld.Page = 1;
          vm.gridOptions.isExport = pagingInfoOld.isExport = true;
          return KitAllocationFactory.getKitAllocationList().query(pagingInfoOld).$promise.then((response) => {
            if (response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data) {
              _.map(response.data.kitReleaseList, (item) => {
                item.displayPIDs = getPIDsFromString(item.mfgPN);
              });
              return response.data.kitReleaseList;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      const initUIGrid = () => {
        vm.sourceHeader = [{
          field: 'Action',
          cellClass: 'gridCellColor',
          displayName: 'Action',
          width: '200',
          cellTemplate: '<grid-action-view grid="grid" row="row" number-of-action-button="5"></grid-action-view>',
          enableFiltering: false,
          enableSorting: false,
          exporterSuppressExport: true,
          pinnedLeft: false
        },
        {
          field: '#',
          width: '50',
          cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
          enableFiltering: false,
          enableSorting: false,
          enableCellEdit: false,
          allowCellFocus: false
        },
        {
          field: 'lineID',
          displayName: 'Item(Line#)',
          cellTemplate: '<div class="ui-grid-cell-contents">\
                            <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.uploadBom(row.entity);" tabindex="-1">{{COL_FIELD}}</a>\
                        </div>',
          width: '65',
          type: 'number',
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          allowCellFocus: false
        },
        {
          field: 'custPIDCode',
          displayName: CORE.LabelConstant.MFG.CPN,
          cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link \
                                                component-id="row.entity.custPNID" \
                                                label="grid.appScope.$parent.vm.LabelConstant.MFG.PID" \
                                                value="row.entity.custPIDCode" \
                                                is-copy="true" \
                                                is-mfg="true" \
                                                mfg-label="grid.appScope.$parent.vm.LabelConstant.MFG.CPN" \
                                                mfg-value="row.entity.custPN" \
                                                rohs-icon="grid.appScope.$parent.vm.rohsImagePath + row.entity.cpnRoHsIcon" \
                                                rohs-status="row.entity.cpnRoHsName" \
                                                is-copy-ahead-label="true" \
                                                is-search-findchip="false" \
                                                is-search-digi-key="false" \
                                                is-custom-part="row.entity.custIsCustom"\
                                                restrict-packaging-use-permanently="row.entity.restrictPackagingUsePermanently" \
                                                restrict-packaging-use-with-permission="row.entity.restrictPackagingUseWithpermission" \
                                                restrict-use-in-bom-permanently="row.entity.restrictCPNUseInBOMStep"> \
                                    </common-pid-code-label-link></div>',
          width: '300',
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          allowCellFocus: false
        },
        {
          field: 'displayPIDs',
          displayName: CORE.LabelConstant.MFG.PID,
          cellTemplate: '<alternative-component-details is-expand="grid.appScope.$parent.vm.isExpand" row-data="row.entity" is-hide-loa=true></alternative-component-details>',
          width: '400',
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          allowCellFocus: false
        },
        {
          field: 'qpa',
          displayName: 'QPA',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
          width: '80',
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          allowCellFocus: false
        },
        {
          field: 'dnpQty',
          displayName: 'DNP QPA',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
          width: '110',
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          allowCellFocus: false
        },
        {
          field: 'partTypeName',
          displayName: 'Functional Type',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '175',
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          allowCellFocus: false
        },
        {
          field: 'name',
          displayName: 'Mounting Type',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '130',
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          allowCellFocus: false
        },
        {
          field: 'unitName',
          displayName: 'UOM',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '100',
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          allowCellFocus: false
        },
        {
          field: 'isCustConsignValue',
          displayName: 'Customer Consigned',
          cellTemplate: '<div class="ui-grid-cell-contents text-center"><md-checkbox class="cm-feture-btn-color" ng-change="grid.appScope.$parent.vm.changeCustConsignStatus($event, row.entity)" ng-model="row.entity.isCustConsign" ng-disabled="!grid.appScope.$parent.vm.isEnableKitLineCustConsignStatus"/></div>',
          width: 170,
          enableCellEdit: false,
          enableFiltering: false,
          enableSorting: false,
          allowCellFocus: false,
          maxWidth: '300'
        },
        {
          field: 'requiredQtyBuild',
          displayName: 'Required Units',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-class="{\'highlight-cell\': row.entity.uomMismatchedStep == 0}">{{COL_FIELD | fiveDecimalDisplayOrder}}</div>',
          width: '130',
          cellClass: function (grid, row) {
            if (row.entity.uomMismatchedStep === 0) {
              return 'cm-kit-release-hot-err';
            }
          },
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          allowCellFocus: false
        },
        {
          field: 'requirePinsBuild',
          displayName: 'Required Pins',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-class="{\'highlight-cell\': row.entity.uomMismatchedStep == 0}">{{COL_FIELD}}</div>',
          width: '120',
          cellClass: function (grid, row) {
            if (row.entity.uomMismatchedStep === 0) {
              return 'cm-kit-release-hot-err';
            }
          },
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          allowCellFocus: false
        },
        {
          field: 'allocatedQty',
          displayName: vm.LabelConstant.KitAllocation.AllocatedCount,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | fiveDecimalDisplayOrder}}</div>',
          width: '150',
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          allowCellFocus: false
        },
        {
          field: 'allocatedUnit',
          displayName: vm.LabelConstant.KitAllocation.AllocatedUnits,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">' +
            '<span ng-if="COL_FIELD && !grid.appScope.$parent.vm.salesOrderDetail.isCallFromFeasibility">' +
            '<a tabindex="-1" class="text-underline cursor-pointer" ng-click="grid.appScope.$parent.vm.kitAllocatPopUp($event, row.entity, \'AllocatedStock\', \'ALL\')">{{ COL_FIELD | fiveDecimalDisplayOrder }}</a>' +
            '</span>' +
            '<span ng-if="!COL_FIELD || grid.appScope.$parent.vm.salesOrderDetail.isCallFromFeasibility">{{ COL_FIELD | fiveDecimalDisplayOrder }}</span>' +
            '</div> ',
          width: '150',
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          allowCellFocus: false
        },
        {
          field: 'allocatedPins',
          displayName: vm.LabelConstant.KitAllocation.AllocatedPins,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
          width: '100',
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          allowCellFocus: false
        },
        {
          field: 'scrapedPins',
          displayName: vm.LabelConstant.KitAllocation.ScrapedPins,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
          width: '100',
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          allowCellFocus: false
        },
        {
          field: 'consumeQty',
          displayName: vm.LabelConstant.KitAllocation.ConsumedCount,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | fiveDecimalDisplayOrder}}</div>',
          width: '110',
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          allowCellFocus: false
        },
        {
          field: 'consumeUnits',
          displayName: vm.LabelConstant.KitAllocation.ConsumedUnits,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">' +
            '<span ng-if="COL_FIELD && !grid.appScope.$parent.vm.salesOrderDetail.isCallFromFeasibility">' +
            '<a tabindex="-1" class="text-underline cursor-pointer" ng-click="grid.appScope.$parent.vm.kitAllocatPopUp($event, row.entity, \'ConsumedStock\', \'ALL\')">{{COL_FIELD || 0}}</a>' +
            '</span>' +
            '<span ng-if="!COL_FIELD || grid.appScope.$parent.vm.salesOrderDetail.isCallFromFeasibility">{{(COL_FIELD || 0) | fiveDecimalDisplayOrder}}</span>' +
            '</div>',
          width: '110',
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          allowCellFocus: false
        },
        {
          field: 'allocated_shared',
          displayName: 'Allocated/Shared',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | fiveDecimalDisplayOrder}}</div>',
          width: '145',
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          allowCellFocus: false
        },
        {
          field: 'shortagePerBuildQty',
          displayName: vm.LabelConstant.KitAllocation.ShortagePerBuildUnits,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-class="{\'highlight-cell\': row.entity.shortagePerBuildQty > 0}">{{COL_FIELD | fiveDecimalDisplayOrder}}</div>',
          width: '160',
          cellClass: function (grid, row) {
            if (row.entity.shortagePerBuildQty > 0) {
              return 'cm-kit-release-hot-err';
            }
          },
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          allowCellFocus: false
        },
        {
          field: 'shortagePerBuildPins',
          displayName: vm.LabelConstant.KitAllocation.ShortagePerBuildPins,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-class="{\'highlight-cell\': row.entity.shortagePerBuildPins > 0}">{{COL_FIELD | fiveDecimalDisplayOrder}}</div>',
          width: '160',
          cellClass: function (grid, row) {
            if (row.entity.shortagePerBuildPins > 0) {
              return 'cm-kit-release-hot-err';
            }
          },
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          allowCellFocus: false
        },
        {
          field: 'shortagePerBuildWithAvailableQty',
          displayName: vm.LabelConstant.KitAllocation.ShortagePerBuildWithAvailableUnits,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-class="{\'highlight-cell\': row.entity.shortagePerBuildWithAvailableQty > 0}">{{COL_FIELD | fiveDecimalDisplayOrder}}</div>',
          width: '150',
          cellClass: function (grid, row) {
            if (row.entity.shortagePerBuildWithAvailableQty > 0) {
              return 'cm-kit-release-hot-err';
            }
          },
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          allowCellFocus: false
        },
        {
          field: 'shortagePerBuildWithAvailablePins',
          displayName: vm.LabelConstant.KitAllocation.ShortagePerBuildWithAvailablePins,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-class="{\'highlight-cell\': row.entity.shortagePerBuildWithAvailablePins > 0}">{{COL_FIELD | fiveDecimalDisplayOrder}}</div>',
          width: '150',
          cellClass: function (grid, row) {
            if (row.entity.shortagePerBuildWithAvailablePins > 0) {
              return 'cm-kit-release-hot-err';
            }
          },
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          allowCellFocus: false
        },
        {
          field: 'perScrapQty',
          displayName: 'Scrapped%',
          cellTemplate: '<div>'
            + '<md-button class="md-raised md-mini float-right md-mini grid-button md-icon-button bdrbtn kit-status text-left">'
            + '<div class="cm-quote-progress" style="width:{{(row.entity.perScrapQty || 0) +\'%\'}}"></div>'
            + '<span class="relative" style="margin-left:5px !important;"><span>{{(row.entity.perScrapQty || 0)}}%</span></span>'
            + '<md-tooltip md-direction="top">Scrapped%</md-tooltip>'
            + '</md-button>'
            + '</div>',
          width: '120',
          allowCellFocus: false,
          enableCellEdit: false
        },
        {
          field: 'freeToShareAmongOtherKits',
          displayName: 'Excess Allocation',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | fiveDecimalDisplayOrder}}</div>',
          width: '130',
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          allowCellFocus: false
        },
        {
          field: 'allocatedSTKPosition',
          displayName: 'Total Stock of Allocated UMIDs',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
          width: '130',
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          allowCellFocus: false
        },
        {
          field: 'isNotRequiredKitAllocationValue',
          displayName: vm.LabelConstant.KitAllocation.NonKittingItem,
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" \
                        ng-class="{\'label-success\':row.entity.isNotRequiredKitAllocationValue == \'Yes\',\
                        \'label-warning\':row.entity.isNotRequiredKitAllocationValue == \'No\' }"> \
                            {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.KeywordStatusGridHeaderDropdown
          },
          ColumnDataType: 'StringEquals',
          enableFiltering: true,
          enableSorting: false,
          width: '150'
        },
        {
          field: 'notRequiredKitAllocationReason',
          displayName: vm.LabelConstant.KitAllocation.NonKittingItemReason,
          cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.notRequiredKitAllocationReason || !row.entity.isNotRequiredKitAllocation" ng-click="grid.appScope.$parent.vm.showNotRequireKitAllocationReaseon(row.entity, $event)"> \
                                View \
                            </md-button>',
          enableFiltering: false,
          enableSorting: false,
          width: '150',
          enableCellEdit: false
        },
        {
          field: 'availabelStock',
          displayName: 'Internal Stock',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-class="{\'highlight-cell\': row.entity.uomMismatchedStep == 0 && (!COL_FIELD || COL_FIELD == 0)}"> \
                                        <span ng-if="COL_FIELD && !grid.appScope.$parent.vm.salesOrderDetail.isCallFromFeasibility"> \
                                            <a tabindex="-1" class="text-underline cursor-pointer" ng-click="grid.appScope.$parent.vm.kitAllocatPopUp($event, row.entity, \'AvailableStock\', \'IS\')"> \
                                                {{(COL_FIELD || 0) | fiveDecimalDisplayOrder}} \
                                            </a> \
                                        </span> \
                                        <span ng-if="!COL_FIELD || grid.appScope.$parent.vm.salesOrderDetail.isCallFromFeasibility"> \
                                            {{(COL_FIELD || 0) | fiveDecimalDisplayOrder}} \
                                        </span> \
                                    </div>',
          width: '150',
          cellClass: function (grid, row) {
            if (row.entity.isNotRequiredKitAllocation && row.entity.availabelStock) {
              return 'cm-not-require-kit-allocation-color';
            } else if (row.entity.uomMismatchedStep === 0 && (!row.entity.availabelStock || row.entity.availabelStock === 0)) {
              return 'cm-kit-release-hot-err';
            }
          },
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          allowCellFocus: false
        },
        {
          field: 'availabelStockCustomerConsign',
          displayName: 'Customer Stock',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-class="{\'highlight-cell\': row.entity.uomMismatchedStep == 0 && (!COL_FIELD || COL_FIELD == 0)}"> \
                                        <span ng-if="COL_FIELD && !grid.appScope.$parent.vm.salesOrderDetail.isCallFromFeasibility"> \
                                            <a tabindex="-1" class="text-underline cursor-pointer" ng-click="grid.appScope.$parent.vm.kitAllocatPopUp($event, row.entity, \'AvailableStock\', \'CS\')"> \
                                                {{(COL_FIELD || 0) | fiveDecimalDisplayOrder}} \
                                            </a> \
                                        </span> \
                                        <span ng-if="!COL_FIELD || grid.appScope.$parent.vm.salesOrderDetail.isCallFromFeasibility"> \
                                            {{(COL_FIELD || 0) | fiveDecimalDisplayOrder}} \
                                        </span> \
                                    </div>',
          width: '150',
          cellClass: function (grid, row) {
            if (row.entity.isNotRequiredKitAllocation && row.entity.availabelStockCustomerConsign) {
              return 'cm-not-require-kit-allocation-color';
            } else if (row.entity.uomMismatchedStep === 0 && (!row.entity.availabelStockCustomerConsign || row.entity.availabelStockCustomerConsign === 0)) {
              return 'cm-kit-release-hot-err';
            }
          },
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          allowCellFocus: false
        }
        ];
      };
      initUIGrid();

      const filterCriteria = () => {
        vm.pagingInfo.Page = 0;
        vm.pagingInfo.assyID = vm.salesOrderDetail.partId;
        vm.pagingInfo.partID = vm.assemblyDetail.partId;
        vm.pagingInfo.refSalesOrderDetailId = vm.salesOrderDetail.SalesOrderDetailId;
        vm.pagingInfo.shortageLines = vm.shortageLines;
        vm.pagingInfo.packagingAlias = vm.packagingAlias;
        vm.pagingInfo.feasibilityQty = vm.salesOrderDetail.isCallFromFeasibility ? vm.salesOrderDetail.feasibilityKitQty : null;
        vm.pagingInfo.isCallFromFeasibility = vm.salesOrderDetail.isCallFromFeasibility;
        if (vm.salesOrderDetail.isCallFromFeasibility) {
          vm.pagingInfo.mountingType = vm.mountingTypeId ? vm.mountingTypeId.toString() : null;
        }
        vm.pagingInfo.customerId = vm.salesOrderDetail.customerID;
      };

      vm.advancedFilterCriteria = (filter) => {
        vm.pagingInfo.functionalType = filter.functionalType;
        vm.pagingInfo.mountingType = filter.mountingType;
        vm.pagingInfo.cartType = filter.cartType;
        vm.pagingInfo.warehouse = filter.warehouse;
        vm.loadData();
      };

      if (vm.salesOrderDetail.isCallFromFeasibility) {
        const findIndexShortageWithoutAvailableUnits = _.findIndex(vm.sourceHeader, (data) => data.displayName === vm.LabelConstant.KitAllocation.ShortagePerBuildUnits);
        if (findIndexShortageWithoutAvailableUnits !== -1) {
          vm.sourceHeader.splice(findIndexShortageWithoutAvailableUnits, 1);
        }
        const findIndexShortageWithoutAvailablePins = _.findIndex(vm.sourceHeader, (data) => data.displayName === vm.LabelConstant.KitAllocation.ShortagePerBuildPins);
        if (findIndexShortageWithoutAvailablePins !== -1) {
          vm.sourceHeader.splice(findIndexShortageWithoutAvailablePins, 1);
        }
      } else {
        const findIndexShortageWithAvailableUnits = _.findIndex(vm.sourceHeader, (data) => data.displayName === vm.LabelConstant.KitAllocation.ShortagePerBuildWithAvailableUnits);
        if (findIndexShortageWithAvailableUnits !== -1) {
          vm.sourceHeader.splice(findIndexShortageWithAvailableUnits, 1);
        }
        const findIndexShortageWithAvailablePins = _.findIndex(vm.sourceHeader, (data) => data.displayName === vm.LabelConstant.KitAllocation.ShortagePerBuildWithAvailablePins);
        if (findIndexShortageWithAvailablePins !== -1) {
          vm.sourceHeader.splice(findIndexShortageWithAvailablePins, 1);
        }
      }

      vm.loadData = () => {
        filterCriteria();
        const searchPID = _.find(vm.pagingInfo.SearchColumns, (data) => data.ColumnName === 'displayPIDs');
        if (searchPID) {
          searchPID.ColumnName = 'mfgPN';
        }
        const checkSortColumns = _.filter(vm.pagingInfo.SortColumns, (data) => {
          const obj = _.find(data, (item) => item === 'displayPIDs');
          if (obj) { return data; };
        });
        if (checkSortColumns.length > 0) {
          const sortPID = _.find(checkSortColumns, (data) => data[0] === 'displayPIDs');
          if (sortPID) {
            sortPID[0] = 'mfgPN';
          }
        }
        vm.cgBusyLoading = KitAllocationFactory.getKitAllocationList().query(vm.pagingInfo).$promise.then((response) => {
          if (response.data) {
            vm.sourceData = response.data.kitReleaseList;
            const uomMismatchLine = response.data.UOMMismatchLine;
            const BOMLineCount = response.data.BOMLineCount;

            if (uomMismatchLine) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.UOM_MISMATCH);
              messageContent.message = stringFormat(messageContent.message, uomMismatchLine);
              const model = {
                messageContent: messageContent,
                btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK,
                canbtnText: 'Go To BOM',
                multiple: true
              };
              return DialogFactory.messageConfirmDialog(model).then(() => {
                $scope.$parent.vm.isReCalculate = true;
                $scope.$parent.vm.isReCalculateDisable = false;
                $mdDialog.cancel(true);
                DialogFactory.closeDialogPopup(true);
              }, () => {
                $scope.$parent.vm.isReCalculate = true;
                $scope.$parent.vm.isReCalculateDisable = false;
                BaseService.goToComponentBOMWithSubAssy(vm.salesOrderDetail.partId, vm.partId && vm.partId !== 0 ? vm.partId : vm.salesOrderDetail.partId);
              }).catch((error) => BaseService.getErrorLog(error));
            }

            _.map(vm.sourceData, (item, index) => {
              item.displayPIDs = getPIDsFromString(item.mfgPN);
              item.rowNum = index + 1;
              item.isPreviousBtnDisable = index === 0 ? true : false;
              item.isNextBtnDisable = index + 1 === vm.sourceData.length ? true : false;
              item.isDisableDeallocation = item.allocatedUnit > 0 ? false : true;
              item.isCustConsign = !item.isPurchase;
            });
            vm.totalSourceDataCount = response.data.Count;

            vm.filterData = {
              functionalTypeList: response.data.FunctionalTypeList,
              mountingTypeList: response.data.MountingTypeList,
              warehouseList: response.data.WarehouseList,
              pagingInfo: vm.pagingInfo
            };

            if (!vm.gridOptions.enablePaging) {
              vm.currentdata = vm.sourceData.length;
            }

            if (vm.totalSourceDataCount === 0) {
              if (vm.pagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
                vm.isNoDataFound = false;
                vm.emptyState = 0;
              } else if (vm.pagingInfo.functionalType || vm.pagingInfo.mountingType || vm.pagingInfo.cartType || vm.pagingInfo.warehouse || vm.pagingInfo.shortageLines) {
                vm.isNoDataFound = false;
                vm.emptyState = 0;
              } else {
                if (BOMLineCount === 0) {
                  vm.isNoDataFound = true;
                  vm.emptyState = null;
                } else {
                  vm.isNoDataFound = true;
                  vm.isBOMNotSave = true;
                  vm.emptyState = null;
                }
              }
            }
            else {
              vm.isNoDataFound = false;
              vm.emptyState = null;
            }
            $scope.$parent.vm.kitDetailNotFound = vm.isNoDataFound;

            $timeout(() => {
              vm.resetSourceGrid();
              if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
                vm.isallloaded = true;
                return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
              } else {
                vm.isallloaded = false;
              }
            });
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.updateLineDetail = (data) => {
        let rowdetails = null;
        if (data) {
          _.map(vm.sourceData, (item) => {
            if (item.id === data.id) {
              item.shortagePerBuildQty = data.shortagePerBuildQty;
              item.shortagePerBuildPins = data.shortagePerBuildPins;
            }
          });
          rowdetails = _.find(vm.sourceData, (item) => item.id === data.id);
        }
        return $q.resolve(rowdetails);
      };

      vm.getLineDetail = (data, isPrevious) => {
        let rowdetails = null;
        if (data) {
          if (vm.shortageLines) {
            vm.sourceData = _.filter(vm.sourceData, (item) => item.shortagePerBuildQty > 0);
          }
          if (isPrevious) {
            rowdetails = _.find(vm.sourceData, (item) => item.rowNum === data.rowNum - 1);
          } else {
            rowdetails = _.find(vm.sourceData, (item) => item.rowNum === data.rowNum + 1);
          }
          if (vm.shortageLines) {
            _.map(vm.sourceData, (item, index) => {
              item.rowNum = index + 1;
              item.isPreviousBtnDisable = index === 0 ? true : false;
              item.isNextBtnDisable = index + 1 === vm.sourceData.length ? true : false;
            });
          }
          rowdetails = _.find(vm.sourceData, (item) => item.id === rowdetails.id);
          return $q.resolve(rowdetails);
        }
      };

      vm.kitAllocatPopUp = (event, row, rowField, stockType) => {
        const data = {
          partDetail: row,
          salesOrderDetail: vm.salesOrderDetail,
          rowField: rowField,
          assemblyDetail: vm.assemblyDetail,
          stockType: stockType,
          getLineDetail: vm.getLineDetail,
          updateLineDetail: vm.updateLineDetail,
          isShowNextPrevious: true,
          isConsolidatedTab: false
        };
        data.partDetail.shortageLines = vm.shortageLines;
        data.partDetail.packagingAlias = vm.packagingAlias;
        DialogFactory.dialogService(
          TRANSACTION.STOCK_ALLOCATE_POPUP_CONTROLLER,
          TRANSACTION.STOCK_ALLOCATE_POPUP_VIEW,
          event,
          data).then(() => {
          }, (kitallocate) => {
            if (kitallocate) {
              vm.stockAllocateLineID = kitallocate ? kitallocate.lineId : 0;
              // Get updated line detail and replace with old detail and get advance filter data also if any update for in
              $scope.$parent.vm.getKitReleaseSummaryAndStatus();
              vm.loadData();
            }
          }, (err) => BaseService.getErrorLog(err));
      };

      vm.uploadBom = (data) => {
        BaseService.goToComponentBOMWithSubAssyAndKeyWord(vm.salesOrderDetail.partId, vm.assemblyDetail.partId, data ? data.lineID : null);
      };

      vm.goToCPNDetail = (event, row) => {
        if (row && row.custPNID) {
          BaseService.goToComponentDetailTab(CORE.MFG_TYPE.MFG, row.custPNID, USER.PartMasterTabs.Detail.Name);
        }
      };

      vm.showNotRequireKitAllocationReaseon = (object, ev) => {
        const obj = {
          title: vm.LabelConstant.KitAllocation.NonKittingItemReason,
          description: object.notRequiredKitAllocationReason,
          name: object.lineID
        };
        const data = obj;
        data.label = 'Item';
        DialogFactory.dialogService(
          CORE.DESCRIPTION_MODAL_CONTROLLER,
          CORE.DESCRIPTION_MODAL_VIEW,
          ev,
          data
        ).then(() => {
        }, (err) => BaseService.getErrorLog(err));
      };

      // Dealloction line material
      vm.deallocateFromKit = (row) => {
        if (row) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.DEALLOCATION_FOR_LINE_UMID);
          messageContent.message = stringFormat(messageContent.message, row.lineID);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_CONFIRM_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              const objData = {
                fromScreen: CORE.LabelConstant.KitAllocation.PageName,
                assyID: vm.salesOrderDetail.SubAssyId ? vm.salesOrderDetail.SubAssyId : vm.salesOrderDetail.partId,
                refSalesOrderDetID: vm.salesOrderDetail.SalesOrderDetailId,
                refRfqLineitem: row.refRfqLineitem
              };
              vm.cgBusyLoading = KitAllocationFactory.deallocateUMIDFromKit().query(objData).$promise.then((response) => {
                if (response.data) {
                  BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      const getAuthenticationOfApprovalPart = (row, informationMsg) => {
        const objPartDetail = {
          AccessRole: CORE.ROLE_ACCESS.VERIFICATION_ROLE_ACCESS,
          refTableName: CORE.TABLE_NAME.KIT_ALLOCATION,
          isAllowSaveDirect: false,
          approveFromPage: CORE.PAGENAME_CONSTANT[25].PageName,
          confirmationType: CORE.Generic_Confirmation_Type.PERMISSION_FOR_CUSTCONSIGN_STATUS_KITALLOCATION,
          createdBy: vm.loginUser.userid,
          updatedBy: vm.loginUser.userid,
          informationMsg: informationMsg
        };
        DialogFactory.dialogService(
          CORE.GENERIC_CONFIRMATION_MODAL_CONTROLLER,
          CORE.GENERIC_CONFIRMATION_MODAL_VIEW,
          null,
          objPartDetail).then((data) => {
            if (data) {
              const approvalReasonList = [];
              data.transactionType = stringFormat(CORE.MESSAGE_CONSTANT.GENERIC_AUTHENTICATION_REASON.CONFIRMATION_FOR_KIT_ALLOCATION_CUSTCONSIGN_STATUS, row.isPurchase ? 'Customer Consigned' : 'Purchased', row.lineID);
              objApproval = data;
              if (objApproval) {
                approvalReasonList.push(objApproval);
              }
              const objData = {
                id: row.id,
                isPurchase: !row.isPurchase,
                approvalReasonList: approvalReasonList
              };
              vm.cgBusyLoading = KitAllocationFactory.saveCustconsignStatusForKitLineItem().query(objData).$promise.then((response) => {
                if (response.data) {
                  BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => {
            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
          }).catch((error) => BaseService.getErrorLog(error));
      };

      // change Customer Consgin status
      vm.changeCustConsignStatus = (event, row) => {
        if (row) {
          const informationMsg = stringFormat(CORE.MESSAGE_CONSTANT.KIT_ALLOCATION_CUSTCONSIGN_STATUS_NOTE, row.lineID);
          getAuthenticationOfApprovalPart(row, informationMsg);
        }
      };

      // show history for change Customer Consgin status value
      vm.custConsignHistory = (row) => {
        const headerData = [{
          label: 'Line#',
          value: row.lineID,
          displayOrder: 1
        }];
        const PopupData = {
          refID: row.id,
          confirmationType: CORE.Generic_Confirmation_Type.PERMISSION_FOR_CUSTCONSIGN_STATUS_KITALLOCATION,
          refTableName: CORE.TABLE_NAME.KIT_ALLOCATION,
          title: 'Customer Consigned Status History',
          headerData: headerData,
          showTransactionType: true,
          EmptyMesssage: TRANSACTION.TRANSACTION_EMPTYSTATE.CUSTOMERCONSIGNSTATUSHISTORY
        };
        DialogFactory.dialogService(
          CORE.SHOW_GENERIC_CONFIRMATION_CONTROLLER,
          CORE.SHOW_GENERIC_CONFIRMATION_VIEW,
          null,
          PopupData).then(() => {
          }, () => {
          }, (err) => BaseService.getErrorLog(err));
      };

      // open deallocated material popup
      vm.deallocatedUMID = (row) => {
        const dataObj = {
          rohsIcon: vm.salesOrderDetail.rohsIcon,
          rohsName: vm.salesOrderDetail.rohs,
          mfgPN: vm.salesOrderDetail.SubAssy ? vm.salesOrderDetail.SubAssy : vm.salesOrderDetail.assyName,
          assyID: vm.salesOrderDetail.SubAssyId ? vm.salesOrderDetail.SubAssyId : vm.salesOrderDetail.partId,
          PIDCode: vm.salesOrderDetail.SubAssyPIDCode ? vm.salesOrderDetail.SubAssyPIDCode : vm.salesOrderDetail.assyPIDCode,
          refSalesOrderDetID: vm.salesOrderDetail.SalesOrderDetailId,
          partId: row && row.mfgPNIdsWithPackaging ? row.mfgPNIdsWithPackaging : null,
          kitNumber: vm.salesOrderDetail.kitNumber
        };
        DialogFactory.dialogService(
          TRANSACTION.DEALLOCATED_UID_POPUP_CONTROLLER,
          TRANSACTION.DEALLOCATED_UID_POPUP_VIEW,
          event,
          dataObj).then(() => {
          }, () => {
          }, (err) => BaseService.getErrorLog(err));
      };

      $scope.$on('KitAllocationShortageLines', (event, data) => {
        vm.shortageLines = data;
        BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
      });

      $scope.$on('KitAllocationPackagingAlias', (event, data) => {
        vm.packagingAlias = data;
        BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
      });

      //close popup on page destroy
      $scope.$on('$destroy', () => {
        $mdDialog.hide(false, { closeAll: true });
      });
    }
  }
})();
