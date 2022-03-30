(function () {
  'use strict';
  angular.module('app.core').directive('componentKitAllocation', componentKitAllocation);

  /** @ngInject */
  function componentKitAllocation() {
    const directive = {
      restrict: 'E',
      replace: true,
      scope: {
      },
      templateUrl: 'app/directives/custom/component-kit-allocation/component-kit-allocation.html',
      controller: ComponentKitAllocationController,
      controllerAs: 'vm',
      link: function () {
      }
    };
    return directive;

    /** @ngInject */
    /**
    * Controller for view data of Component Kit Allocation
    * @param
    */
    function ComponentKitAllocationController($scope, $stateParams, $mdDialog, $timeout, $state, USER, CORE, DialogFactory, BaseService, ComponentFactory, TRANSACTION) {
      const vm = this;
      vm.isHideDelete = true;
      vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.COMPONENT_KIT_ALLOCATION;
      vm.coid = $stateParams.coid ? $stateParams.coid : null;
      vm.setScrollClass = 'gridScrollHeight_Component';
      vm.LabelConstant = CORE.LabelConstant;
      vm.MFG_TYPE = CORE.MFG_TYPE;
      vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
      vm.isExpand = true;
      vm.loginUser = BaseService.loginUser;
      const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;
      vm.MEASUREMENT_TYPES_COUNT = CORE.MEASUREMENT_TYPES.COUNT;

      const initPageInfo = () => {
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),
          SortColumns: [['id', 'DESC']],
          SearchColumns: [],
          showPackagingAlias: true
        };
      };

      initPageInfo();

      vm.gridOptions = {
        enablePaging: isEnablePagination,
        enablePaginationControls: isEnablePagination,
        showColumnFooter: false,
        enableRowHeaderSelection: false,
        enableFullRowSelection: false,
        enableRowSelection: false,
        multiSelect: false,
        filterOptions: vm.pagingInfo.SearchColumns,
        enableCellEdit: false,
        enableCellEditOnFocus: false,
        exporterMenuCsv: true,
        exporterCsvFilename: 'ComponentKitAllocation.csv',
        enableGrouping: false,
        enableColumnMenus: true
      };

      vm.sourceHeader = [
        {
          field: '#',
          width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
          cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
          enableFiltering: false,
          enableSorting: false
        },
        {
          field: 'kitName',
          displayName: 'Kit',
          cellTemplate: '<div class="ui-grid-cell-contents text-left"><a ng-click="grid.appScope.$parent.vm.allocatedKit(row.entity)" tabindex="-1">{{COL_FIELD}}</a></div>',
          width: '400'
        },
        {
          field: 'lineID',
          displayName: 'Item',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
          width: '70'
        },
        {
          field: 'qpa',
          displayName: 'QPA',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
          width: '80'
        },
        {
          field: 'requireUnitsForBuild',
          displayName: 'Require Units',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
          width: '120'
        },
        {
          field: 'displayPIDs',
          displayName: CORE.LabelConstant.MFG.PID,
          cellTemplate: '<alternative-component-details is-expand="grid.appScope.$parent.vm.isExpand" row-data="row.entity"></alternative-component-details>',
          width: '360',
          allowCellFocus: false
        },
        {
          field: 'uid',
          displayName: 'UMID',
          cellTemplate: '<div class="ui-grid-cell-contents text-left"> \
                        <a tabindex="-1" ng-click="grid.appScope.$parent.vm.goToUIDManage(row.entity.refUIDId)" class="cm-text-decoration underline cursor-pointer">{{COL_FIELD | uppercase}}</a> \
                        <copy-text label="grid.appScope.$parent.vm.LabelConstant.UMIDManagement.UMID" text="row.entity.uid"></copy-text></div>',
          width: '170',
          allowCellFocus: false
        },
        {
          field: 'pkgQty',
          displayName: 'Count',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{row.entity.uomClassID === grid.appScope.$parent.vm.MEASUREMENT_TYPES_COUNT.ID ? (COL_FIELD)  : (COL_FIELD | unit)}}</div>',
          width: '130'
        },
        {
          field: 'pkgUnit',
          displayName: 'Units',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{row.entity.uomClassID === grid.appScope.$parent.vm.MEASUREMENT_TYPES_COUNT.ID ? (COL_FIELD)  : (COL_FIELD | unit)}}</div>',
          width: '130'
        },
        {
          field: 'uom',
          displayName: 'UOM',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '100'
        },
        {
          field: 'allocatedQty',
          displayName: vm.LabelConstant.KitAllocation.AllocatedCount,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{row.entity.allocatedUOMClassID === grid.appScope.$parent.vm.MEASUREMENT_TYPES_COUNT.ID ? (COL_FIELD)  : (COL_FIELD | unit)}}</div>',
          width: '130'
        },
        {
          field: 'allocatedUnit',
          displayName: vm.LabelConstant.KitAllocation.AllocatedUnits,
          cellTemplate: '<div class="ui-grid-cell-contents text-left"><span ng-if="COL_FIELD"><a class="text-underline cursor-pointer" ng-click="grid.appScope.$parent.vm.kitAllocatPopUp($event, row.entity, \'AllocatedStock\', \'ALL\')" tabindex="-1">{{row.entity.allocatedUOMClassID === grid.appScope.$parent.vm.MEASUREMENT_TYPES_COUNT.ID ? (COL_FIELD)  : (COL_FIELD | unit)}}</a></span><span ng-if="!COL_FIELD">{{COL_FIELD}}</span></div>',
          width: '130'
        },
        {
          field: 'allocatedUOM',
          displayName: vm.LabelConstant.KitAllocation.AllocatedUOM,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '100'
        },
        {
          field: 'allocatedPins',
          displayName: vm.LabelConstant.KitAllocation.AllocatedPins,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
          width: '130'
        }];


      function setDataAfterGetAPICall(allocatedInKit, isGetDataDown) {
        if (allocatedInKit && allocatedInKit.data.allocatedInKit) {
          if (!isGetDataDown) {
            vm.sourceData = allocatedInKit.data.allocatedInKit;
            vm.currentdata = vm.sourceData.length;
          }
          else if (allocatedInKit.data.allocatedInKit.length > 0) {
            vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(allocatedInKit.data.allocatedInKit);
            vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
          }
          if (vm.sourceData && vm.sourceData.length > 0) {
            _.map(vm.sourceData, (item) => {
              item.displayPIDs = getPIDsFromString(item.mfgPN);
            });
          }
          // must set after new data comes
          vm.totalSourceDataCount = allocatedInKit.data.Count;
          if (!vm.gridOptions.enablePaging) {
            if (!isGetDataDown) {
              vm.gridOptions.gridApi.infiniteScroll.resetScroll();
            }
            else {
              vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
            }
          }
          if (!isGetDataDown) {
            vm.gridOptions.clearSelectedRows();
          }
          if (vm.totalSourceDataCount === 0) {
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
            if (!isGetDataDown) {
              if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
                return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
              }
            }
            else {
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount !== vm.currentdata ? true : false);
            }
          });
        }
      }

      /* retrieve data list*/
      vm.loadData = () => {
        if (vm.pagingInfo.SortColumns.length === 0) {
          vm.pagingInfo.SortColumns = [['id', 'DESC']];
        }
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
        vm.pagingInfo.id = vm.coid;
        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        vm.cgBusyLoading = ComponentFactory.getAllocatedKitByPart().query(vm.pagingInfo).$promise.then((response) => {
          if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            setDataAfterGetAPICall(response, false);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* load more data on mouse scroll */
      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.pagingInfo.id = vm.coid;
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
        vm.cgBusyLoading = ComponentFactory.getAllocatedKitByPart().query(vm.pagingInfo).$promise.then((response) => {
          setDataAfterGetAPICall(response, true);
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.fab = {
        Status: false
      };

      $scope.$on('$destroy', () => {
        $mdDialog.hide(false, {
          closeAll: true
        });
      });

      vm.allocatedKit = (rowData) => {
        BaseService.goToKitList(rowData.refSalesOrderDetID, rowData.assyID, null);
      };

      // redirect to UMID Management page
      vm.goToUIDManage = (id) => BaseService.goToUMIDDetail(id);

      vm.kitAllocatPopUp = (event, row, rowField, stockType) => {
        var partDetail = angular.copy(row);
        partDetail.uomID = partDetail.allocatedUOMID;
        partDetail.requiredQtyBuild = partDetail.requireUnitsForBuild;
        partDetail.unitName = partDetail.uom;
        partDetail.packagingAlias = vm.pagingInfo.showPackagingAlias;
        const data = {
          partDetail: partDetail,
          salesOrderDetail: {
            SalesOrderDetailId: row.refSalesOrderDetID,
            partId: row.assyID
          },
          rowField: rowField,
          stockType: stockType,
          assemblyDetail: {
            kitQty: row.kitQty,
            kitRohsIcon: stringFormat('{0}{1}', vm.rohsImagePath, row.assyRohsIcon),
            kitRohsId: row.assyRohsId,
            kitRohsName: row.assyRohsName,
            mfgPN: row.assyPN,
            pIDCode: row.assyPIDCode,
            partId: row.assyID
          },
          isShowNextPrevious: false
        };
        DialogFactory.dialogService(
          TRANSACTION.STOCK_ALLOCATE_POPUP_CONTROLLER,
          TRANSACTION.STOCK_ALLOCATE_POPUP_VIEW,
          event,
          data).then(() => {
          }, () => {
            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
          }, (err) => BaseService.getErrorLog(err));
      };

      vm.changePackagingAlias = () => {
        vm.pagingInfo.Page = CORE.UIGrid.Page();
        vm.loadData();
      };
    }
  }
})();
