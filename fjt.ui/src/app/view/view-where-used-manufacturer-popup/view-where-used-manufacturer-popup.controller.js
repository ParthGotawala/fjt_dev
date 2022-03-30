(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('ViewWhereUsedManufacturerPopupController', ViewWhereUsedManufacturerPopupController);

  /** @ngInject */
  function ViewWhereUsedManufacturerPopupController(data, $timeout, $mdDialog, CORE, TRANSACTION, ManufacturerFactory, BaseService) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = CORE.LabelConstant;
    vm.gridMFRWhereUsed = CORE.gridConfig.gridMFRWhereUsed;
    vm.WhereUsedDropDown = CORE.WhereUsedDropDown;
    vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.MFR_WHERE_USED_HISTORY;
    vm.SerialTypeLabel = CORE.SerialTypeLabel;
    vm.isHideDelete = true;
    vm.mfgCode = data && data.mfgCode ? data.mfgCode : '';
    vm.name = data && data.name ? data.name : '';
    vm.mfgTypeLabel = data && data.mfgTypeLabel ? data.mfgTypeLabel : '';
    vm.isManufacturer = data && data.isManufacturer ? data.isManufacturer : false;
    vm.MFG_TYPE = CORE.MFG_TYPE;
    vm.cancel = () => {
      $mdDialog.cancel(null);
    };
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;
    vm.headerdata = [
      {
        label: vm.mfgTypeLabel,
        value: vm.name ? vm.name.trim() : vm.name,
        displayOrder: 1,
        labelLinkFn: null,
        valueLinkFn: null,
        valueLinkFnParams: null,
        isCopy: false,
        copyParams: null,
        imgParms: null
      }, {
        label: vm.LabelConstant.MFG.Alias,
        value: vm.mfgCode ? vm.mfgCode.trim() : vm.mfgCode,
        displayOrder: 2,
        labelLinkFn: null,
        valueLinkFn: null,
        valueLinkFnParams: null,
        isCopy: false,
        copyParams: null,
        imgParms: null
      }];

    vm.sourceHeader = [
      {
        field: '#',
        width: '60',
        cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
        enableFiltering: false,
        enableSorting: false
      },
      {
        field: 'Type',
        displayName: 'Type',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box"\
                            ng-class="{\'label-success\':row.entity.Type == 1, \
                            \'label-warning\':row.entity.Type == 2}"> \
                                {{COL_FIELD === 1 ? "BOM" : "Part"}}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.WhereUsedDropDown
        },
        width: '120'
      },
      {
        field: 'assyCode',
        displayName: vm.LabelConstant.MFG.PID,
        cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link component-id="row.entity.partId"\
                                             label="grid.appScope.$parent.vm.LabelConstant.MFG.PID"\
                                             value="COL_FIELD"\
                                             is-copy="true"\
                                             is-search-findchip="false"\
                                             is-search-digi-key="false"\
                                             is-supplier="(grid.appScope.$parent.vm.MFG_TYPE.DIST === row.entity.mfgType.toUpperCase())"\
                                             is-custom-part="row.entity.isCustom"\
                                             restrict-use-permanently="row.entity.restrictUsePermanently" \
                                             restrict-use-with-permission="row.entity.restrictUSEwithpermission" \
                                             restrict-packaging-use-permanently="row.entity.restrictPackagingUsePermanently" \
                                             restrict-packaging-use-with-permission="row.entity.restrictPackagingUseWithpermission" \
                                             redirection-disable="row.entity.isDisabledUpdate"\>\
                      </common-pid-code-label-link></div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.PID
      },
      {
        field: 'lineID',
        displayName: 'BOM Item',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                                            <a class="cm-text-decoration underline" ng-if="row.entity.lineID > 0"\
                                                ng-click="grid.appScope.$parent.vm.goToComponentBOMWithKeyWord(row.entity);"\
                                                tabindex="-1">{{COL_FIELD}}</a>\
                                            <span ng-if="row.entity.AliasMFGCodeID <= 0">{{COL_FIELD}}</span>\
                                        </div>',
        width: '100'
      },
      {
        field: 'orgMFGCode',
        displayName: 'Original ' + (vm.isManufacturer ? vm.LabelConstant.MFG.MFG : vm.LabelConstant.MFG.Supplier),
        width: '100',
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        allowCellFocus: false
      },
      {
        field: 'orgMFGPN',
        width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
        displayName: 'Original ' + (vm.isManufacturer ? vm.LabelConstant.MFG.MFGPN : vm.LabelConstant.MFG.SupplierPN),
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        allowCellFocus: false
      },
      {
        field: 'MFGCode',
        displayName: vm.isManufacturer ? vm.LabelConstant.MFG.MFG : vm.LabelConstant.MFG.Supplier,
        width: '100',
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        allowCellFocus: false
      },
      {
        field: 'MFGPN',
        width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
        displayName: vm.isManufacturer ? vm.LabelConstant.MFG.MFGPN : vm.LabelConstant.MFG.SupplierPN,
        cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link component-id="row.entity.mfgPNID"\
                                             label="grid.appScope.$parent.vm.LabelConstant.MFG.MFGPN"\
                                             value="COL_FIELD"\
                                             is-copy="true"\
                                             is-supplier="(!grid.appScope.$parent.vm.isManufacturer)"\
                                              is-custom-part="row.entity.mfgIsCustom"\
                                             restrict-use-permanently="row.entity.mfgRestrictUsePermanently" \
                                             restrict-use-with-permission="row.entity.mfgRestrictUSEwithpermission" \
                                             restrict-packaging-use-permanently="row.entity.mfgRestrictPackagingUsePermanently" \
                                             restrict-packaging-use-with-permission="row.entity.mfgRestrictPackagingUseWithpermission" \
                                             redirection-disable="row.entity.isDisabledUpdate">\
                      </common-pid-code-label-link></div>',
        allowCellFocus: false
      },
      {
        field: 'createdbyvalue',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableFiltering: false
      }, {
        field: 'createdAt',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableFiltering: false
      }
    ];
    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SearchColumns: [],
        SortColumns: [['createdAt', 'desc']]
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
      filterOptions: vm.pagingInfo.SearchColumns
    };
    /* retrieve work order transaction serials list */
    vm.loadData = () => {
      vm.pagingInfo.mfgCode = vm.mfgCode;
      vm.pagingInfo.isManufacturer = vm.isManufacturer;
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = ManufacturerFactory.retriveWhereUsedMFGList().query(vm.pagingInfo).$promise.then((mfgCodeList) => {
        if (mfgCodeList && mfgCodeList.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          setDataAfterGetAPICall(mfgCodeList, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //call once scroll down on grid
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = ManufacturerFactory.retriveWhereUsedMFGList().query(vm.pagingInfo).$promise.then((mfgCodeList) => {
        setDataAfterGetAPICall(mfgCodeList, true);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* Set Grid Option after data get */
    function setDataAfterGetAPICall(mfgCodeDetail, isGetDataDown) {
      if (mfgCodeDetail && mfgCodeDetail.data.mfgCodeList) {
        if (!isGetDataDown) {
          vm.sourceData = mfgCodeDetail.data.mfgCodeList;
          vm.currentdata = vm.sourceData.length;
        } else if (mfgCodeDetail.data.mfgCodeList.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(mfgCodeDetail.data.mfgCodeList);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }

        // must set after new data comes
        vm.totalSourceDataCount = mfgCodeDetail.data.Count;
        if (!vm.gridOptions.enablePaging) {
          if (!isGetDataDown) {
            vm.gridOptions.gridApi.infiniteScroll.resetScroll();
          } else {
            vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
          }
        }
        if (!isGetDataDown) {
          vm.gridOptions.clearSelectedRows();
        }
        if (vm.totalSourceDataCount === 0) {
          if (vm.pagingInfo.SearchColumns.length > 0) {
            vm.isNoDataFound = false;
            vm.emptyState = 0;
          } else {
            vm.isNoDataFound = true;
            vm.emptyState = null;
          }
        } else {
          vm.isNoDataFound = false;
          vm.emptyState = null;
        }
        $timeout(() => {
          vm.resetSourceGrid();
          if (!isGetDataDown) {
            if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
            }
          } else {
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount !== vm.currentdata ? true : false);
          }
        });
      }
    }

    vm.goToComponentBOMWithKeyWord = (rowData) => {
      BaseService.goToComponentBOMWithKeyWord(rowData.partId, rowData.MFGPN);
    };
  }
})();
