(function () {
  'use restrict';

  angular.module('app.core')
    .controller('WhereUsedInspectionRequirementPopupController', WhereUsedInspectionRequirementPopupController);

  function WhereUsedInspectionRequirementPopupController(data, $mdDialog, DialogFactory, CORE, BaseService, $timeout, PurchaseInspectionRequirementFactory) {
    var vm = this;
    vm.isFormDirty = true;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.whereUsed = CORE.WhereUsedPurchaseInspectionRequirementPopup;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;
    vm.LabelConstant = CORE.LabelConstant;

    vm.sourceHeader = [
      {
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
        enableFiltering: false,
        enableSorting: false,
        maxWidth: '80'
      }, {
        field: 'TransactionType',
        displayName: vm.whereUsed.TransactionTypeLabel,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '400'
      },
      {
        field: 'Transaction',
        displayName: vm.whereUsed.TransactionLabel,
        cellTemplate: '<div class="ui-grid-cell-contents"> \
                            <common-pid-code-label-link  ng-if="row.entity.isPartTransaction" \
                                             component-id="row.entity.componentid"\
                                             label="grid.appScope.$parent.vm.LabelConstant.MFG.PID"\
                                             value="COL_FIELD"\
                                             is-copy="true"\
                                             is-search-findchip="false"\
                                             is-search-digi-key="false"\
                                             is-custom-part="row.entity.isCustom"\
                                             restrict-use-permanently="row.entity.restrictUsePermanently" \
                                             restrict-use-with-permission="row.entity.restrictUSEwithpermission" \
                                             restrict-packaging-use-permanently="row.entity.restrictPackagingUsePermanently" \
                                             restrict-packaging-use-with-permission="row.entity.restrictPackagingUseWithpermission"\>\
                          </common-pid-code-label-link> \
                          <a  ng-if="!row.entity.isPartTransaction" ng-click="grid.appScope.$parent.vm.goToTemplatePurchaseInspectionRequirement(row)" class="color-black text-decoration-underline cursor-pointer">{{COL_FIELD}}</a> \
                       </div>',
        width: '800'
      }];

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['TransactionType', 'ASC']],
        SearchColumns: []
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
      multiSelect: true,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: `Where Used ${vm.LabelConstant.PURCHASE_INSPECTION_REQUIREMENT.PurchaseRequirement}.csv`,
      CurrentPage: CORE.PAGENAME_CONSTANT[31].PageName
    };

    function setDataAfterGetAPICall(inspectionType, isGetDataDown) {
      if (inspectionType && inspectionType.data.InspectionCategory) {
        bindData(inspectionType.data.InspectionCategory);
        if (!isGetDataDown) {
          vm.sourceData = inspectionType.data.InspectionCategory;
          vm.currentdata = vm.sourceData.length;
        }
        else if (inspectionType.data.InspectionCategory.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(inspectionType.data.InspectionCategory);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        // must set after new data comes
        vm.totalSourceDataCount = inspectionType.data.Count;
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

    /* retrieve Users list*/
    vm.loadData = () => {
      vm.isHideDelete = true;
      vm.Apply = false;
      vm.pagingInfo.Id = data;
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = PurchaseInspectionRequirementFactory.whereUsedRequirementReference().query(vm.pagingInfo).$promise.then((inspectionType) => {
        if (inspectionType.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          setDataAfterGetAPICall(inspectionType, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* load more data on mouse scroll */
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = TransferStockFactory.whereUsedRequirementReference().query(vm.pagingInfo).$promise.then((inspectionType) => {
        setDataAfterGetAPICall(inspectionType, true);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //bind data
    const bindData = (transactionDetail) => {
      _.each(transactionDetail, (item) => {
        if (item.TransactionType === 'Requirements & Comments Template') {
          item.isPartTransaction = false;
        }
      });
    };

    // Go to Template Requirement
    vm.goToTemplatePurchaseInspectionRequirement = (row) => {
      if (row && row.entity && row.entity.componentid) {
        BaseService.goToPartPurchaseInspectionRequirement(row.entity.componentid);
      }
      else {
        BaseService.goToTemplatePurchaseInspectionRequirement();
      }
      return false;
    };

    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
