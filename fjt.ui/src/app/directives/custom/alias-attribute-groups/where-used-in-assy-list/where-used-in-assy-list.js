(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('whereUsedInAssyList', whereUsedInAssyList);

  /** @ngInject */
  function whereUsedInAssyList(BaseService, USER, CORE, DialogFactory, ComponentFactory) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        componentId: '=?'
      },
      templateUrl: 'app/directives/custom/alias-attribute-groups/where-used-in-assy-list/where-used-in-assy-list.html',
      controller: whereUsedInAssyListCtrl,
      controllerAs: 'vm'
    };
    return directive;


    /** @ngInject */
    /**
    * Controller for view data of whereUsedInAssyListCtrl
    *
    * @param
    */
    function whereUsedInAssyListCtrl($scope, $element, $attrs, $timeout) {
      const vm = this;
      vm.cid = $scope.componentId;
      vm.mfgType = $scope.mfgType;
      vm.IsSupplier = vm.mfgType && vm.mfgType.toUpperCase() === CORE.MFG_TYPE.DIST ? true : false;
      vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
      vm.LabelConstant = angular.copy(CORE.LabelConstant);
      vm.mfgLabelConstant = CORE.LabelConstant.MFG;
      vm.loginUser = BaseService.loginUser;
      const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
      vm.PartCorrectList = CORE.PartCorrectList;
      vm.SiteEmptyMesssage = USER.ADMIN_EMPTYSTATE.COMPONENT_WHERE_USED;
      vm.isGoToBOM = true;

      vm.SiteDetNotFound = false;
      vm.siteTotalSourceDataCount = 0;
      vm.siteSourceHeader = [
        {
          field: 'Action',
          cellClass: 'gridCellColor',
          displayName: 'Action',
          width: '85',
          cellTemplate: '<grid-action-view grid="grid" row="row"></grid-action-view>',
          enableFiltering: false,
          enableSorting: false,
          exporterSuppressExport: true,
          pinnedLeft: true
        },
        {
          field: '#',
          width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="grid.appScope.$parent.vm.loginUser.uiGridPreference !== \'P\'">\
          <span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span>\
          </div>\
          <div class="ui-grid-cell-contents grid-cell-text-right" ng-if="grid.appScope.$parent.vm.loginUser.uiGridPreference === \'P\'">\
          <span><b>{{(grid.appScope.$parent.vm.sitePagingInfo.pageSize * (grid.appScope.$parent.vm.sitePagingInfo.Page - 1)) + (grid.renderContainers.body.visibleRowCache.indexOf(row) + 1)}}</b></span>\
          </div>',
          enableFiltering: false,
          enableSorting: false,
          enableCellEdit: false
        },

        {
          field: 'mfrCode',
          displayName: vm.LabelConstant.MFG.MFG,
          width: 120,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                              <a class="cm-text-decoration underline" ng-if="row.entity.MID > 0"\
                                  ng-click="grid.appScope.$parent.vm.editManufacturer(row.entity.mfgType,row.entity.MID);"\
                                  tabindex="-1">{{COL_FIELD}}</a>\
                              <span ng-if="row.entity.MID <= 0">{{COL_FIELD}}</span>\
                          </div>',
          allowCellFocus: false
        },
        {
          field: 'mfgPN',
          width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
          displayName: vm.LabelConstant.MFG.MFGPN,
          cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link component-id="row.entity.partID"\
                                    label="grid.appScope.$parent.vm.LabelConstant.MFG.MFGPN"\
                                    value="COL_FIELD"\
                                    is-copy="true"\
                                    rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.rohsIcon"\
                                    rohs-status="row.entity.rohsName"\
                                    is-search-digi-key="true"\
                                    is-supplier="false">\
                      </common-pid-code-label-link></div>',
          allowCellFocus: false
        },
        {
          field: 'custAssyPN',
          width: '320',
          displayName: 'Part#',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-class="{\'text-line-through\': (row.entity.restrictUsePermanently == true || row.entity.restrictUSEwithpermission == true) }">\
                              <common-pid-code-label-link component-id="row.entity.partID"\
                                                         value="COL_FIELD"\
                                                         is-copy="true"\
                                                         rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.rohsIcon"\
                                                         rohs-status="row.entity.rohsName"\
                                                         is-supplier="false"\
                                                         is-assembly="true"> \
                                  </common-pid-code-label-link> \
                            </div>',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'rev',
          width: '95',
          displayName: 'Revision',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'PIDCode',
          displayName: 'PID Code',
          width: CORE.UI_GRID_COLUMN_WIDTH.PID,
          cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-class="{\'text-line-through\': (row.entity.restrictUsePermanently == true || row.entity.restrictUSEwithpermission == true) }">\
                              <common-pid-code-label-link component-id="row.entity.partID"\
                                                         label="grid.appScope.$parent.vm.LabelConstant.MFG.PID"\
                                                         value="COL_FIELD"\
                                                         is-good-part="row.entity.isGoodPart" \
                                                         is-search-findchip="false"\
                                                         is-search-digi-key="false"\
                                                         is-custom-part="row.entity.isCustom"\
                                                         restrict-use-permanently="row.entity.restrictUsePermanently" \
                                                         restrict-use-with-permission="row.entity.restrictUSEwithpermission" \
                                                         restrict-packaging-use-permanently="row.entity.restrictPackagingUsePermanently" \
                                                         restrict-packaging-use-with-permission="row.entity.restrictPackagingUseWithpermission" \
                                                         is-copy="true"\
                                                         is-supplier="false"\
                                                         is-assembly="true"> \
                                  </common-pid-code-label-link> \
                            </div>',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'liveVersion',
          width: '110',
          displayName: 'Internal Revision',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-if="!COL_FIELD">{{COL_FIELD}}</div> \
                        <div class="ui-grid-cell-contents text-left" ng-if="COL_FIELD" \
                            ng-click="grid.appScope.$parent.vm.showVersionHistory(row.entity, row.entity.partID,$event)"><a>{{COL_FIELD}}</a></div>',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'mfgPNDescription',
          width: 250,
          displayName: vm.LabelConstant.MFG.MFGPNDescription,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'nickname',
          displayName: 'Nickname',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.ASSY_NICKNAME,
          enableCellEdit: false
        },
        {
          field: 'qpa',
          displayName: 'QPA',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD | numberWithoutDecimal}}</div>',
          width: '120',
          enableCellEdit: false,
          ColumnDataType: 'NUMBER'
        },
        {
          field: 'refDesig',
          displayName: vm.LabelConstant.BOM.REF_DES,
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: 250,
          enableCellEdit: false,
          ColumnDataType: 'NUMBER'
        },

        {
          field: 'dnpQty',
          displayName: 'DNP',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD | numberWithoutDecimal}}</div>',
          width: '120',
          enableCellEdit: false,
          ColumnDataType: 'NUMBER'
        },
        {
          field: 'dnpDesig',
          displayName: vm.LabelConstant.BOM.DNP_REF_DES,
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: 250,
          enableCellEdit: false
        },
        {
          field: 'annualUsage',
          displayName: 'EAU',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD | numberWithoutDecimal}}</div>',
          width: 100,
          enableCellEdit: false,
          ColumnDataType: 'NUMBER'
        },
        {
          field: 'totalUsage',
          displayName: 'Total Usage',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD | numberWithoutDecimal}}</div>',
          width: 150,
          enableCellEdit: false,
          ColumnDataType: 'NUMBER'
        },
        {
          field: 'partStatusValue',
          displayName: 'Part Status',
          width: 200,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div part-status-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.partStatusList
          },
          ColumnDataType: 'StringEquals'
        }
      ];

      vm.sitePagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['whereUsed', 'ASC']],
        SearchColumns: [],
        partID: vm.cid
      };

      vm.siteGridOptions = {
        enablePaging: isEnablePagination,
        enablePaginationControls: isEnablePagination,
        showColumnFooter: false,
        enableRowHeaderSelection: false,
        enableFullRowSelection: false,
        enableRowSelection: false,
        multiSelect: false,
        filterOptions: vm.sitePagingInfo.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: 'WhereUsedInAssemblyComponentDetail.csv',
        hideFilter: true
      };

      /* retrieve site list */
      vm.loadSiteData = () => {
        BaseService.setPageSizeOfGrid(vm.sitePagingInfo, vm.siteGridOptions);
        if (vm.sitePagingInfo.SortColumns.length === 0) {
          vm.sitePagingInfo.SortColumns = [['whereUsed', 'ASC']];
        }
        vm.cgBusyLoading = ComponentFactory.getWhereUseComponent().query(vm.sitePagingInfo).$promise.then((response) => {
          vm.siteSourceData = [];
          if (response.data) {
            vm.siteSourceData = response.data.whereUsedComponents;
            vm.siteTotalSourceDataCount = response.data.Count;
          }

          if (!vm.siteGridOptions.enablePaging) {
            vm.siteCurrentdata = vm.siteSourceData.length;
            vm.siteGridOptions.gridApi.infiniteScroll.resetScroll();
          }
          vm.siteGridOptions.clearSelectedRows();
          if (vm.siteTotalSourceDataCount === 0) {
            if (vm.sitePagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
              vm.SiteDetNotFound = false;
              vm.siteEmptyState = 0;
            }
            else {
              vm.SiteDetNotFound = true;
              vm.siteEmptyState = null;
            }
          }
          else {
            vm.SiteDetNotFound = false;
            vm.siteEmptyState = null;
          }
          $timeout(() => {
            vm.resetSiteSourceGrid();
            if (!vm.siteGridOptions.enablePaging && vm.siteTotalSourceDataCount === vm.siteCurrentdata) {
              return vm.siteGridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
            }
          });
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.siteGetDataDown = () => {
        vm.sitePagingInfo.Page = vm.sitePagingInfo.Page + 1;
        vm.cgBusyLoading = ComponentFactory.getWhereUseComponent().query(vm.sitePagingInfo).$promise.then((response) => {
          vm.siteSourceData = vm.siteGridOptions.data = vm.siteSourceData.concat(response.data.whereUsedComponents);
          vm.siteCurrentdata = vm.siteGridOptions.data = vm.siteSourceData.length;
          vm.siteTotalSourceDataCount = response.data.Count;
          vm.siteGridOptions.gridApi.infiniteScroll.saveScrollPercentage();
          $timeout(() => {
            vm.resetSiteSourceGrid();
            return vm.siteGridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.siteTotalSourceDataCount !== vm.siteCurrentdata ? true : false);
          });
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.goToBOM = (row) => {
        BaseService.goToComponentBOM(row.id);
      };

      vm.editManufacturer = (mfgType, mfgcodeID) => {
        if (mfgType === CORE.MFG_TYPE.DIST) {
          BaseService.goToSupplierDetail(mfgcodeID);
        }
        else {
          BaseService.goToManufacturer(mfgcodeID);
        }
      };

      /* Open popup for display history of entry change */
      vm.showVersionHistory = (row, componentId, ev) => {
        BaseService.showVersionHistory(row, componentId, ev);
      };
    }
  }
})();
