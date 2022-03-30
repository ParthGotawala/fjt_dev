(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('deallocatedUidList', deallocatedUidList);

  /** @ngInject */
  function deallocatedUidList() {
    var directive = {
      restrict: 'E',
      scope: {
        salesorderId: '=?',
        assyId: '=?',
        partId: '=?'
      },
      templateUrl: 'app/directives/custom/deallocated-uid-list/deallocated-uid-list.html',
      controller: deallocatedUidListCtrl,
      controllerAs: 'vm'
    };
    return directive;


    /** @ngInject */
    /**
    * Controller for view data of Deallocated UMID
    *
    * @param
    */
    function deallocatedUidListCtrl($timeout, BaseService, $scope, CORE, TRANSACTION, ReceivingMaterialFactory, USER) {
      const vm = this;
      vm.refSalesOrderID = $scope.salesorderId;
      vm.assyID = $scope.assyId;
      vm.partId = $scope.partId;
      vm.gridConfig = CORE.gridConfig;
      vm.isHideDelete = true;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
      vm.LabelConstant = CORE.LabelConstant;
      vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.DEALLOCATEDUIDLIST;
      vm.MEASUREMENT_TYPES_COUNT = CORE.MEASUREMENT_TYPES.COUNT;
      vm.loginUser = BaseService.loginUser;
      const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;

      const initPageInfo = () => {
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),
          SortColumns: [['updatedAt', 'DESC']],
          SearchColumns: []
        };
      };

      initPageInfo();

      // Got to UMID Management
      vm.goToUIDManage = (id) => BaseService.goToUMIDDetail(id);

      vm.sourceHeader = [
        {
          field: '#',
          width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
          cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
          enableFiltering: false,
          enableSorting: false,
          enableCellEdit: false
        },
        {
          field: 'lineID',
          displayName: 'BOM Line',
          cellTemplate: '<div class="ui-grid-cell-contents text-left"> {{COL_FIELD}} </div>',
          width: '65',
          type: 'number',
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          allowCellFocus: false
        },
        {
          field: 'uid',
          displayName: 'UMID',
          cellTemplate: '<div class="ui-grid-cell-contents text-left"> \
                        <a tabindex="-1" ng-click="grid.appScope.$parent.vm.goToUIDManage(row.entity.id)" class="cm-text-decoration underline cursor-pointer">{{COL_FIELD | uppercase}}</a> \
                        <copy-text label="grid.appScope.$parent.vm.LabelConstant.UMIDManagement.UMID" text="row.entity.uid"></copy-text></div>',
          width: '170',
          allowCellFocus: false
        },
        {
          field: 'dateCode',
          displayName: 'Internal Date Code',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '80',
          allowCellFocus: false
        },
        {
          field: 'UMIDRohsStatus',
          displayName: 'UMID RoHS Status',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '150',
          allowCellFocus: false
        },
        {
          field: 'PIDCode',
          displayName: vm.LabelConstant.MFG.PID,
          cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link \
                                        component-id="row.entity.refcompid" \
                                        label="grid.appScope.$parent.vm.LabelConstant.MFG.PID" \
                                        value="row.entity.PIDCode" \
                                        is-copy="true" \
                                        is-mfg="true" \
                                        mfg-label="grid.appScope.$parent.vm.LabelConstant.MFG.MFGPN" \
                                        mfg-value="row.entity.mfgPN" \
                                        rohs-icon="grid.appScope.$parent.vm.rohsImagePath + row.entity.rohsIcon" \
                                        rohs-status="row.entity.rohsName" \
                                        is-copy-ahead-label="true" \
                                        is-custom-part="row.entity.isCustom"\
                                        restrict-use-permanently="row.entity.restrictUsePermanently" \
                                        restrict-use-with-permission="row.entity.restrictUSEwithpermission" \
                                        restrict-packaging-use-permanently="row.entity.restrictPackagingUsePermanently" \
                                        restrict-packaging-use-with-permission="row.entity.restrictPackagingUseWithpermission" > \
                                    </common-pid-code-label-link></div>',
          width: '300',
          allowCellFocus: false
        },
        {
          field: 'allocatedQty',
          displayName: 'Deallocated Count',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{row.entity.uomClassID === grid.appScope.$parent.vm.MEASUREMENT_TYPES_COUNT.ID ? (COL_FIELD)  : (COL_FIELD | unit)}}</div>',
          width: '120',
          allowCellFocus: false
        },
        {
          field: 'allocatedUnit',
          displayName: 'Deallocated Units',
          cellTemplate: '<div class="ui-grid-cell-contents  grid-cell-text-right">{{row.entity.uomClassID === grid.appScope.$parent.vm.MEASUREMENT_TYPES_COUNT.ID ? (COL_FIELD)  : (COL_FIELD | unit)}}</div>',
          width: '120',
          allowCellFocus: false
        },
        {
          field: 'allocatedPins',
          displayName: 'Deallocated Pins',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
          width: '100',
          allowCellFocus: false
        },
        {
          field: 'unitName',
          displayName: 'UOM',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '100',
          allowCellFocus: false
        },
        {
          field: 'updatedBy',
          displayName: 'Deallocated By',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableFiltering: true,
          type: 'StringEquals',
          enableSorting: true
        },
        {
          field: 'updatedAt',
          displayName: 'Deallocated Date',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
          allowCellFocus: false,
          type: 'datetime',
          enableFiltering: false,
          enableSorting: true
        },
        {
          field: 'pkgQty',
          displayName: 'Current Count',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{row.entity.uomClassID === grid.appScope.$parent.vm.MEASUREMENT_TYPES_COUNT.ID ? (COL_FIELD)  : (COL_FIELD | unit)}}</div>',
          width: '120',
          allowCellFocus: false
        },
        {
          field: 'pkgUnit',
          displayName: 'Current Units',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{row.entity.uomClassID === grid.appScope.$parent.vm.MEASUREMENT_TYPES_COUNT.ID ? (COL_FIELD)  : (COL_FIELD | unit)}}</div>',
          width: '120',
          allowCellFocus: false
        },
        {
          field: 'currentPins',
          displayName: 'Current Pins',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
          width: '120',
          allowCellFocus: false
        },
        {
          field: 'binName',
          displayName: vm.LabelConstant.TransferStock.CurrentLocation,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '200',
          allowCellFocus: false

        },
        {
          field: 'warehouseName',
          displayName: vm.LabelConstant.TransferStock.CurrentWH,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '180',
          allowCellFocus: false
        },
        {
          field: 'departmentName',
          displayName: vm.LabelConstant.TransferStock.CurrentDepartment,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '180',
          allowCellFocus: false
        }, {
          field: 'remark',
          displayName: 'Remark',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '350',
          allowCellFocus: false
        }];

      vm.gridOptions = {
        enablePaging: isEnablePagination,
        enablePaginationControls: isEnablePagination,
        showColumnFooter: false,
        enableRowHeaderSelection: false,
        enableFullRowSelection: false,
        enableRowSelection: true,
        multiSelect: false,
        filterOptions: vm.pagingInfo.SearchColumns,
        exporterMenuCsv: true,
        enableCellEdit: false,
        enableCellEditOnFocus: true,
        exporterCsvFilename: 'Deallocated Material.csv'
      };

      function setDataAfterGetAPICall(stock, isGetDataDown) {
        if (stock && stock.data.DeallocatedUIDList) {
          if (!isGetDataDown) {
            vm.sourceData = stock.data.DeallocatedUIDList;
            vm.currentdata = vm.sourceData.length;
          }
          else if (stock.data.DeallocatedUIDList.length > 0) {
            vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(stock.data.DeallocatedUIDList);
            vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
          }
          // must set after new data comes
          vm.totalSourceDataCount = stock.data.Count;
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

      /* Retrieve split umid list */
      vm.loadData = () => {
        vm.pagingInfo.refSalesOrderID = vm.refSalesOrderID;
        vm.pagingInfo.assyID = vm.assyID;
        vm.pagingInfo.partIDs = vm.partId;
        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        vm.cgBusyLoading = ReceivingMaterialFactory.getDeallocatedUIDList().query(vm.pagingInfo).$promise.then((response) => {
          if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            setDataAfterGetAPICall(response, false);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* load more data on mouse scroll */
      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.cgBusyLoading = ReceivingMaterialFactory.getDeallocatedUIDList().query(vm.pagingInfo).$promise.then((response) => {
          if (response) {
            setDataAfterGetAPICall(response, true);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };
    }
  }
})();
