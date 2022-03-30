(function () {

  'use sctrict';
  angular
    .module('app.core')
    .directive('purchaseGrid', purchaseGrid);

  /** @ngInject */
  function purchaseGrid(CORE, $mdDialog, $filter) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        salesOrderDetail: "=",
        isSelectSO: "=",
        assemblyDetail: "=",
        packagingAlias: "="
      },
      templateUrl: 'app/directives/custom/purchase-grid/purchase-grid.html',
      controller: purchaseGridCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function purchaseGridCtrl($scope, $element, $attrs, $timeout, $filter, CORE, USER, TRANSACTION, DialogFactory, BaseService, PurchaseFactory) {
      var vm = this;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.PURCHASE_PARTS_LIST;
      vm.LabelConstant = CORE.LabelConstant;
      vm.salesOrderDetail = $scope.salesOrderDetail;
      vm.isSelectSO = $scope.isSelectSO;
      vm.assemblyDetail = $scope.assemblyDetail;
      vm.packagingAlias = $scope.packagingAlias;
      vm.isHideDelete = true;
      vm.isAddPurchaseDetails = true;
      var _dummyEvent = null;

      vm.isExpand = true;
      vm.salesOrderDetail.SubAssy = vm.assemblyDetail.pIDCode;
      if (vm.assemblyDetail.level > 0) {
        vm.salesOrderDetail.SubAssyId = vm.assemblyDetail.partId;
        vm.salesOrderDetail.SubKitQty = vm.assemblyDetail.kitQty;
        vm.salesOrderDetail.subAssyMrpQty = vm.assemblyDetail.subAssyMrpQty;
        vm.salesOrderDetail.kitRohsIcon = vm.assemblyDetail.kitRohsIcon;
        vm.salesOrderDetail.kitRohsName = vm.assemblyDetail.kitRohsName;
      } else {
        vm.salesOrderDetail.SubAssyId = null;
        vm.salesOrderDetail.SubKitQty = null;
      }
      let initPageInfo = () => {
        vm.pagingInfo = {
          Page: 0,
          SortColumns: [['lineID', 'ASC']],
          SearchColumns: []
        };
      }
      initPageInfo();

      vm.gridOptions = {
        enableRowHeaderSelection: false,
        enableFullRowSelection: false,
        enableRowSelection: false,
        multiSelect: false,
        filterOptions: vm.pagingInfo.SearchColumns,
        enableCellEdit: false,
        enablePaging: false,
        enableCellEditOnFocus: false,
          exporterCsvFilename: `${TRANSACTION.TRANSACTION_PURCHASE_LABEL}.csv`,
        exporterMenuCsv: true,
        enableGrouping: false,
        enableColumnMenus: false
      };

      let initUIGrid = () => {
        vm.sourceHeader = [
          {
            field: 'Action',
            cellClass: 'layout-align-center-center',
            displayName: 'Action',
            width: 100,
            cellTemplate: `<grid-action-view grid="grid" row="row"></grid-action-view>`,
            enableFiltering: false,
            enableSorting: false,
            exporterSuppressExport: true,
          },
          {
            field: '#',
            width: '50',
            cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
            enableFiltering: false,
            enableSorting: false,
            enableCellEdit: false,
            allowCellFocus: false,
          },
          {
            field: 'lineID',
            displayName: 'Item',
            cellTemplate: '<div class="ui-grid-cell-contents text-left" style="padding:0px !important">{{COL_FIELD}}</div>',
            width: '70',
            type: 'number',
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false,
          },
          {
            field: 'displayPIDs',
            displayName: CORE.LabelConstant.MFG.PID,
            cellTemplate: '<alternative-component-details is-expand="grid.appScope.$parent.vm.isExpand" row-data="row.entity"></alternative-component-details>',
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
            field: 'mountingTypeName',
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
            width: '90',
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false
          },
          {
            field: 'requiredQtyBuild',
            displayName: 'Require Units',
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
            width: '130',
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false
          },
          {
            field: 'requiredPinsBuild',
            displayName: 'Require Pins',
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
            width: '130',
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false
          },
          {
            field: 'allocatedQty',
            displayName: 'Allocated Qty/Count',
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
            width: '100',
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false
          },
          {
            field: 'allocatedUnit',
            displayName: 'Allocated Units',
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right"><span ng-if="COL_FIELD"><a class="text-underline cursor-pointer" ng-click="grid.appScope.$parent.vm.kitAllocatPopUp($event, row.entity, \'AllocatedStock\', \'ALL\')" tabindex="-1">{{COL_FIELD}}</a></span><span ng-if="!COL_FIELD">{{COL_FIELD}}</span></div>',
            width: '100',
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false
          },
          {
            field: 'allocatedPins',
            displayName: 'Allocated Pins',
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
            width: '100',
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false
          },
          {
            field: 'scrapedPins',
            displayName: 'Scrapped Pins',
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
            width: '100',
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false
          },
          {
            field: 'allocated_shared',
            displayName: 'Allocated/Shared',
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
            width: '145',
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false
          },
          {
            field: 'shortagePerBuild',
            displayName: vm.LabelConstant.KitAllocation.ShortagePerBuildUnits,
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-class="{\'highlight-cell\': row.entity.shortagePerBuild}">{{COL_FIELD}}</div>',
            width: '120',
            cellClass: function (grid, row) {
              if (row.entity.shortagePerBuild > 0) {
                return 'cm-kit-release-hot-err';
              }
            },
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false
          },
          {
            field: 'availabelStock',
            displayName: 'Internal Stock',
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right"> \
                                        <span ng-if="COL_FIELD && !grid.appScope.$parent.vm.salesOrderDetail.isCallFromFeasibility"> \
                                            <a tabindex="-1" class="text-underline cursor-pointer" ng-click="grid.appScope.$parent.vm.kitAllocatPopUp($event, row.entity, \'AvailableStock\', \'IS\')"> \
                                                {{COL_FIELD || 0}} \
                                            </a> \
                                        </span> \
                                        <span ng-if="!COL_FIELD || grid.appScope.$parent.vm.salesOrderDetail.isCallFromFeasibility"> \
                                            {{COL_FIELD || 0}} \
                                        </span> \
                                    </div>',
            width: '100',
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false
          },
          {
            field: 'availabelStockCustomerConsign',
            displayName: 'Customer Stock',
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right"> \
                                        <span ng-if="COL_FIELD && !grid.appScope.$parent.vm.salesOrderDetail.isCallFromFeasibility"> \
                                            <a tabindex="-1" class="text-underline cursor-pointer" ng-click="grid.appScope.$parent.vm.kitAllocatPopUp($event, row.entity, \'AvailableStock\', \'CS\')"> \
                                                {{COL_FIELD || 0}} \
                                            </a> \
                                        </span> \
                                        <span ng-if="!COL_FIELD || grid.appScope.$parent.vm.salesOrderDetail.isCallFromFeasibility"> \
                                            {{COL_FIELD || 0}} \
                                        </span> \
                                    </div>',
            width: '100',
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false
          },
          {
            field: 'poQty',
            displayName: vm.LabelConstant.Purchase.PurchasedQty,
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
            width: 100,
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false
          },
          {
            field: 'poUnits',
            displayName: vm.LabelConstant.Purchase.PurchasedUnits,
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
            width: 100,
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false
          },
          {
            field: 'poDetails',
            displayName: vm.LabelConstant.Purchase.PurchasedDetails,
            cellTemplate: '<div class="ui-grid-cell-contents text-left" style="padding:0px !important">{{COL_FIELD}}</div>',
            width: 300,
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false
          },
        ];
      }
      initUIGrid();

      vm.loadData = () => {
        vm.pagingInfo.assyID = vm.salesOrderDetail.partId;
        vm.pagingInfo.partID = vm.assemblyDetail.partId;
        vm.pagingInfo.refSalesOrderDetailId = vm.salesOrderDetail.SalesOrderDetailId;
        vm.pagingInfo.packagingAlias = vm.packagingAlias;
        vm.pagingInfo.customerId = vm.salesOrderDetail.customerID;
        var searchPID = _.find(vm.pagingInfo.SearchColumns, { ColumnName: 'displayPIDs' });
        if (searchPID) {
          searchPID.ColumnName = 'mfgPN';
        }
        let checkSortColumns = _.filter(vm.pagingInfo.SortColumns, (data) => {
          let obj = _.find(data, (item) => { return item == 'displayPIDs' });
          if (obj) { return data };
        });
        if (checkSortColumns.length > 0) {
          var sortPID = _.find(checkSortColumns, (data) => { return data[0] == 'displayPIDs'; });
          if (sortPID) {
            sortPID[0] = 'mfgPN';
          }
        }
        vm.cgBusyLoading = PurchaseFactory.getPurchaseList().query(vm.pagingInfo).$promise.then((response) => {
          if (response.data) {
            vm.sourceData = response.data.kitReleaseList;
            _.map(vm.sourceData, (item) => {
              item.displayPIDs = getPIDsFromString(item.mfgPN);
            });
            vm.totalSourceDataCount = response.data.Count;

            if (!vm.gridOptions.enablePaging) {
              vm.currentdata = vm.sourceData.length;
              vm.gridOptions.gridApi.infiniteScroll.resetScroll();
            }

            vm.gridOptions.clearSelectedRows();
            if (vm.totalSourceDataCount == 0) {
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
              if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount == vm.currentdata) {
                vm.isallloaded = true;
                return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
              } else {
                vm.isallloaded = false;
              }
            });

            $timeout(() => {
              //initUIGrid();
              vm.resetSourceGrid();
              angular.element('.highlight-cell').parent().addClass('cm-kit-release-hot-err');
            }, true);
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

      vm.getDataDown = () => {
        if (!vm.isallloaded) {
          var searchPID = _.find(vm.pagingInfo.SearchColumns, { ColumnName: 'displayPIDs' });
          if (searchPID) {
            searchPID.ColumnName = 'mfgPN';
          }
          let checkSortColumns = _.filter(vm.pagingInfo.SortColumns, (data) => {
            let obj = _.find(data, (item) => { return item == 'displayPIDs' });
            if (obj) { return data };
          });
          if (checkSortColumns.length > 0) {
            var sortPID = _.find(checkSortColumns, (data) => { return data[0] == 'displayPIDs'; });
            if (sortPID) {
              sortPID[0] = 'mfgPN';
            }
          }
          vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
          vm.cgBusyLoading = PurchaseFactory.getPurchaseList().query(vm.pagingInfo).$promise.then((response) => {
            vm.sourceData = vm.sourceData.concat(response.data.kitReleaseList);
            _.map(vm.sourceData, (item) => {
              item.displayPIDs = getPIDsFromString(item.mfgPN);
            });
            vm.currentdata = vm.sourceData.length;
            vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
            $timeout(() => {
              vm.resetSourceGrid();
              if (vm.totalSourceDataCount == vm.currentdata) {
                vm.isallloaded = true;
              }
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount != vm.currentdata ? true : false);
            });
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
        }
      };

      vm.kitAllocatPopUp = (event, row, rowField, stockType) => {
        const data = {
          partDetail: row,
          salesOrderDetail: vm.salesOrderDetail,
          rowField: rowField,
          assemblyDetail: vm.assemblyDetail,
          stockType: stockType,
          isShowNextPrevious: false
        };
        data.partDetail.packagingAlias = vm.packagingAlias;
        DialogFactory.dialogService(
          TRANSACTION.STOCK_ALLOCATE_POPUP_CONTROLLER,
          TRANSACTION.STOCK_ALLOCATE_POPUP_VIEW,
          event,
          data).then(() => {
          }, (kitallocate) => {
              if (kitallocate) {
                vm.cgBusyLoading = PurchaseFactory.getPurchaseList().query(kitallocate).$promise.then((response) => {
                  if (response.data && response.data.kitReleaseList && response.data.kitReleaseList.length > 0) {
                    const updateLine = response.data.kitReleaseList[0];
                    let selectRowIndex = 0;
                    _.map(vm.gridOptions.data, (data, $index) => {
                      if (data.lineID === updateLine.lineID) {
                        vm.sourceData.splice($index, 1);
                        selectRowIndex = $index;
                        vm.sourceData.splice($index, 0, updateLine);
                      }
                    });

                    $timeout(() => {
                      vm.resetSourceGrid();
                      vm.gridOptions.clearSelectedRows();
                      vm.gridOptions.gridApi.selection.selectRow(vm.gridOptions.data[selectRowIndex]);
                    });
                  }
                }).catch((error) => BaseService.getErrorLog(error));

              //if (kitallocate.sourceData && kitallocate.sourceData[0]) {
              //  _.each(vm.gridOptions.data, (data, $index) => {//vm.gridOptions.data vm.sourceData
              //    if (data.lineID == kitallocate.sourceData[0].lineID) {
              //      vm.sourceData.splice($index, 1);
              //      vm.sourceData.splice($index, 0, kitallocate.sourceData[0]);
              //    }
              //  });
              //  $timeout(() => {
              //    vm.resetSourceGrid();
              //  });
              //  $timeout(() => {
              //    angular.element('.highlight-cell').parent().addClass('cm-kit-release-hot-err');
              //  }, _configSecondTimeout);
              //}
            }
          }, (err) => {
            return BaseService.getErrorLog(err);
          });
      }

      vm.AddPurchaseDetails = (row, ev) => {
        DialogFactory.dialogService(
          TRANSACTION.MANAGE_PURCHASE_MODAL_CONTROLLER,
          TRANSACTION.MANAGE_PURCHASE_MODAL_VIEW,
          _dummyEvent, {
          refAssyId: vm.salesOrderDetail.partId,
          refRfqLineitem: row.entity.refRfqLineitem,
          isPackagingAlias: vm.packagingAlias
        }).then((data) => {
          if (data) {
            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
          }
        }, (err) => {
          // Empty
          BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
        });
      }

      vm.uploadBom = () => {
        BaseService.openInNew(USER.ADMIN_MANAGECOMPONENT_BOM_STATE, {  coid: vm.salesOrderDetail.partId, selectedTab: USER.PartMasterTabs.BOM.Name });
      }
      $scope.$on('PurchasePackagingAlias', (event, data) => {
        vm.packagingAlias = data;
        BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
      });
    }
  }
})();
