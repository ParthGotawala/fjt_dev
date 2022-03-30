(function () {
  'use sctrict';
  angular
    .module('app.core')
    .directive('kitAllocationConsolidatedGrid', kitAllocationConsolidatedGrid);

  /** @ngInject */
  function kitAllocationConsolidatedGrid(KitAllocationFactory) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        salesOrderDetail: '=',
        isSelectSO: '=',
        shortageLines: '=',
        packagingAlias: '=',
        mountingTypeId: '=?'
      },
      templateUrl: 'app/directives/custom/kit-allocation-consolidated-grid/kit-allocation-consolidated-grid.html',
      controller: kitAllocationConsolidatedGridCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function kitAllocationConsolidatedGridCtrl($scope, $timeout, $filter, CORE, USER, TRANSACTION, RFQTRANSACTION, DialogFactory, BaseService, $mdDialog, $q) {
      var vm = this;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.KIT_ALLOCATION;
      vm.LabelConstant = CORE.LabelConstant;
      vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
      vm.transaction = TRANSACTION;
      vm.salesOrderDetail = $scope.salesOrderDetail;
      vm.mountingTypeId = $scope.mountingTypeId;
      vm.isSelectSO = $scope.isSelectSO;
      vm.isNoDataFound = false;
      vm.isBOMNotSave = false;
      vm.shortageLines = $scope.shortageLines;
      vm.packagingAlias = $scope.packagingAlias;
      vm.isHideDelete = true;
      vm.isExpand = true;
      vm.isDeallocatedUMID = true;
      vm.gridConfig = CORE.gridConfig;
      vm.currentDate = $filter('date')(new Date(), 'MMddyy');
      vm.KeywordStatusGridHeaderDropdown = CORE.KeywordStatusGridHeaderDropdown;

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
        exporterCsvFilename: vm.salesOrderDetail.isCallFromFeasibility ? stringFormat('Build Feasibility Shortage Detail[Consolidate]-{0}-{1}-{2}.csv', vm.salesOrderDetail.assyPIDCode, vm.salesOrderDetail.feasibilityKitQty, vm.currentDate) : 'Kit Allocation Consolidated.csv',
        exporterMenuCsv: true,
        allowToExportAllData: true,
        enableColumnMenus: false,
        exporterAllDataFn: () => {
          const pagingInfoOld = _.clone(vm.pagingInfo);
          pagingInfoOld.pageSize = 0;
          pagingInfoOld.Page = 1;
          vm.gridOptions.isExport = pagingInfoOld.isExport = true;
          return KitAllocationFactory.getKitAllocationConsolidatedList().query(pagingInfoOld).$promise.then((response) => {
            if (response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data) {
              _.map(response.data.kitAllocationConsolidatedList, (item) => {
                item.displayPIDs = getPIDsFromString(item.mfgPN);
              });
              return response.data.kitAllocationConsolidatedList;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      const initUIGrid = () => {
        vm.sourceHeader = [{
          field: 'Action',
          cellClass: 'gridCellColor',
          displayName: 'Action',
          width: '100',
          cellTemplate: '<grid-action-view grid="grid" row="row" style="overflow: hidden;padding:1px !important; overflow: hidden; white-space: nowrap;" class="height-grid ui-grid-cell-contents"></grid-action-view>',
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
          cellTemplate: '<div class="ui-grid-cell-contents text-left" style="padding:0px !important">{{COL_FIELD}}</div>',
          width: '60',
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
                                                is-custom-part="row.entity.custIsCustom"\
                                                is-search-digi-key="false" \
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
          field: 'consolidatedpartlineID',
          displayName: 'Consolidated Item Detail',
          cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents-break" ng-repeat="item in row.entity.consolidatedpartlineIDPart">{{item?item.substring(0,item.lastIndexOf("|")):""}}</div>',
          width: '420',
          enableCellEdit: false,
          maxWidth: '500',
          enableFiltering: true,
          enableSorting: true,
          enableColumnMenus: false,
          allowCellFocus: false,
          visible: false
        },
        {
          field: 'consolidateRestrictPartDetail',
          displayName: 'Consolidated Part Restriction Detail',
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
          field: 'consolidatedQPA',
          displayName: 'QPA',
          cellTemplate: '<a class="ui-grid-cell-contents-break text-left cursor-pointer underline" ng-click="grid.appScope.$parent.vm.getQuoteDetails(row.entity,$event)"><span>{{COL_FIELD}}</span><md-tooltip>View Consolidated QPA</md-tooltip></div>',
          width: '100',
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          allowCellFocus: false
        },
        {
          field: 'dnpQPA',
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
          field: 'requireQty',
          displayName: 'Require Units',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-class="{\'highlight-cell\': row.entity.uomMismatchedStep == 0}">{{COL_FIELD | fiveDecimalDisplayOrder}}</div>',
          width: '120',
          cellClass: (grid, row) => {
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
          field: 'requirePins',
          displayName: 'Require Pins',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-class="{\'highlight-cell\': row.entity.uomMismatchedStep == 0}">{{COL_FIELD}}</div>',
          width: '120',
          cellClass: (grid, row) => {
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
            '<a class="text-underline cursor-pointer" ng-click="grid.appScope.$parent.vm.kitAllocatPopUp($event, row.entity, \'AllocatedStock\', \'ALL\')" tabindex="-1">{{COL_FIELD | fiveDecimalDisplayOrder}}</a>' +
            '</span>' +
            '<span ng-if="!COL_FIELD || grid.appScope.$parent.vm.salesOrderDetail.isCallFromFeasibility">{{COL_FIELD | fiveDecimalDisplayOrder}}</span>' +
            '</div>',
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
            '<a class="text-underline cursor-pointer" ng-click="grid.appScope.$parent.vm.kitAllocatPopUp($event, row.entity, \'ConsumedStock\', \'ALL\')" tabindex="-1">{{COL_FIELD | fiveDecimalDisplayOrder}}</a>' +
            '</span>' +
            '<span ng-if="!COL_FIELD || grid.appScope.$parent.vm.salesOrderDetail.isCallFromFeasibility">{{COL_FIELD | fiveDecimalDisplayOrder}}</span>' +
            '</div>',
          width: '110',
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
          cellClass: (grid, row) => {
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
          cellClass: (grid, row) => {
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
          cellClass: (grid, row) => {
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
          enableCellEdit: false,
          allowCellFocus: false
        },
        {
          field: 'shortagePerBuildWithAvailablePins',
          displayName: vm.LabelConstant.KitAllocation.ShortagePerBuildWithAvailablePins,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-class="{\'highlight-cell\': row.entity.shortagePerBuildWithAvailablePins > 0}">{{COL_FIELD | fiveDecimalDisplayOrder}}</div>',
          width: '150',
          cellClass: (grid, row) => {
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
        }
        ];
      };
      initUIGrid();

      const filterCriteria = () => {
        vm.pagingInfo.Page = 0;
        vm.pagingInfo.partID = vm.salesOrderDetail.partId;
        vm.pagingInfo.refSalesOrderDetailId = vm.salesOrderDetail.SalesOrderDetailId;
        vm.pagingInfo.kitQty = vm.salesOrderDetail.isCallFromFeasibility ? vm.salesOrderDetail.feasibilityKitQty : vm.salesOrderDetail.kitQty;
        vm.pagingInfo.shortageLines = vm.shortageLines;
        vm.pagingInfo.packagingAlias = vm.packagingAlias;
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
      const bindGridData = (consolidatemfg) => {
        _.map(consolidatemfg.data.kitAllocationConsolidatedList, (item) => {
          if (item.consolidatedpartlineID) {
            item.consolidatedpartlineID = item.consolidatedpartlineID.replace(/{/g, '').replace(/}/g, '');
            item.consolidatedpartlineIDPart = item.consolidatedpartlineID ? item.consolidatedpartlineID.split(_groupConcatSeparatorValue) : '';
          }
          if (item.consolidateRestrictPartDetail) {
            item.consolidateRestrictPartDetail = item.consolidateRestrictPartDetail.replace(/{/g, '').replace(/}/g, '');
            item.consolidateRestrictPartDetailPart = item.consolidateRestrictPartDetail ? item.consolidateRestrictPartDetail.split(_groupConcatSeparatorValue) : '';
          }
        });
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
        const searchPID = _.find(vm.pagingInfo.SearchColumns, { ColumnName: 'displayPIDs' });
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
        vm.cgBusyLoading = KitAllocationFactory.getKitAllocationConsolidatedList().query(vm.pagingInfo).$promise.then((response) => {
          if (response.data) {
            vm.sourceData = response.data.kitAllocationConsolidatedList;
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
            });

            vm.totalSourceDataCount = response.data.Count;
            bindGridData(response);
            vm.filterData = {
              functionalTypeList: response.data.FunctionalTypeList,
              mountingTypeList: response.data.MountingTypeList,
              warehouseList: response.data.WarehouseList,
              pagingInfo: vm.pagingInfo
            };

            if (!vm.gridOptions.enablePaging) {
              vm.currentdata = vm.sourceData.length;
              //vm.gridOptions.gridApi.infiniteScroll.resetScroll();
            }

            //vm.gridOptions.clearSelectedRows();
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
          isConsolidatedTab: true
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

      vm.uploadBom = () => {
        BaseService.goToComponentBOM(vm.salesOrderDetail.partId);
      };

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

      vm.getrestrictedPartDetails = (row, ev) => {
        const obj = {
          consolidateRestrictPartDetail: row.consolidateRestrictPartDetailPart
        };
        DialogFactory.dialogService(
          RFQTRANSACTION.CONSOLIDATED_RESTRICTED_PART_POPUP_CONTROLLER,
          RFQTRANSACTION.CONSOLIDATED_RESTRICTED_PART_POPUP_VIEW,
          ev,
          obj).then(() => {
          }, () => {
          }, (err) => BaseService.getErrorLog(err));
      };

      // open deallocated material popup
      vm.deallocatedUMID = (row) => {
        const dataObj = {
          rohsIcon: vm.salesOrderDetail.rohsIcon,
          rohsName: vm.salesOrderDetail.rohs,
          mfgPN: vm.salesOrderDetail.assyName,
          assyID: vm.salesOrderDetail.partId,
          PIDCode: vm.salesOrderDetail.assyPIDCode,
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
