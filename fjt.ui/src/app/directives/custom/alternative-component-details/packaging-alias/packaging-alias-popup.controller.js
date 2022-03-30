(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('PackagingAliasPopupController', PackagingAliasPopupController);

  /** @ngInject */
  function PackagingAliasPopupController($mdDialog, $timeout, ComponentFactory, CORE, USER, data, BaseService) {
    const vm = this;

    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.COMPONENT;
    vm.setScrollClass = 'gridScrollHeight_Unit';
    const componentID = data.componentID;
    vm.component = data.pid;
    vm.mfgPN = data.mfgPN;
    vm.rohsName = data.rohsName;
    vm.rohsIcon = data.rohsIcon;
    vm.LabelConstant = CORE.LabelConstant;
    vm.isHideDelete = true;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;

    vm.sourceHeader = [{
      field: '#',
      width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
      cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
      enableFiltering: false,
      enableSorting: false
    }, {
      field: 'mfgCode',
      displayName: vm.LabelConstant.MFG.MFG,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '150'
    }, {
      field: 'mfgPN',
      width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
      displayName: vm.LabelConstant.MFG.MFGPN,
      cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link \
                                component-id="row.entity.id" \
                                label="grid.appScope.$parent.vm.LabelConstant.MFG.MFGPN" \
                                value="row.entity.mfgPN" \
                                is-copy="true" \
                                is-custom-part="row.entity.isCustom" \
                                cust-part-number="row.entity.custAssyPN"\
                                rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.rohsIcon" \
                                rohs-status="row.entity.rohsComplientConvertedValue">\
                              </div> ',
      allowCellFocus: false
    }, {
      field: 'PIDCode',
      displayName: 'PID',
      cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link \
                                component-id="row.entity.id" \
                                label="grid.appScope.$parent.vm.LabelConstant.MFG.PID" \
                                value="row.entity.PIDCode" \
                                is-copy="true" \
                                is-custom-part="row.entity.isCustom" \
                                cust-part-number="row.entity.custAssyPN"\
                                rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.rohsIcon" \
                                rohs-status="row.entity.rohsComplientConvertedValue">\
                              </div> ',
      width: CORE.UI_GRID_COLUMN_WIDTH.PID
    }];

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['mfgPN', 'ASC']],
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
      multiSelect: false,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: 'Packaging Alias.csv'
    };

    /* retrieve Users list*/
    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.pagingInfo.id = componentID;
      vm.cgBusyLoading = ComponentFactory.getcomponentPackagingaliaslist().query(vm.pagingInfo).$promise.then((res) => {
        if (res.data && res.data.component_Packaging_Alias) {
          vm.sourceData = res.data.component_Packaging_Alias;
          vm.totalSourceDataCount = res.data.component_Packaging_Alias.length;
          if (!vm.gridOptions.enablePaging) {
            vm.currentdata = vm.sourceData.length;
            vm.gridOptions.gridApi.infiniteScroll.resetScroll();
          }
          vm.gridOptions.clearSelectedRows();
          if (vm.totalSourceDataCount === 0) {
            if (vm.pagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
              vm.isNoDataFound = false;
              vm.emptyState = 0;
            }
            else {
              if (vm.isNoDatainFilter) {
                vm.isNoDataFound = false;
                vm.emptyState = 0;
              } else {
                vm.isNoDataFound = true;
                vm.emptyState = null;
              }
            }
          }
          else {
            vm.isNoDataFound = false;
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

    vm.cancel = () => {
      $mdDialog.cancel();
    };

    //remove Right pid copied status on hover
    vm.pIdRightStatus = () => {
      vm.showPidRightstatus = false;
    };

    //go to manage part number
    vm.goToAssyMaster = () => {
      BaseService.goToComponentDetailTab(CORE.MFG_TYPE.MFG.toLowerCase(), componentID, USER.PartMasterTabs.Detail.Name);
      return false;
    };

    //go to assy list
    vm.goToAssyList = () => {
        BaseService.goToPartList();
      return false;
    };

    vm.goToComponentDetail = (mfgType, partId) => {
      if (mfgType) {
        mfgType = mfgType.toLowerCase();
      }
      BaseService.goToComponentDetailTab(mfgType, partId, USER.PartMasterTabs.Detail.Name);
    };

    vm.headerdata = [];
    vm.headerdata.push({
      label: vm.LabelConstant.MFG.PID,
      value: vm.component,
      displayOrder: 1,
      labelLinkFn: vm.goToAssyList,
      valueLinkFn: vm.goToAssyMaster,
      isCopy: true,
      isCopyAheadLabel: true,
      isAssy: true,
      imgParms: {
        imgPath: vm.rohsIcon,
        imgDetail: vm.rohsName
      },
      isCopyAheadOtherThanValue: true,
      copyAheadLabel: vm.LabelConstant.MFG.MFGPN,
      copyAheadValue: vm.mfgPN
    });
  }
})();
