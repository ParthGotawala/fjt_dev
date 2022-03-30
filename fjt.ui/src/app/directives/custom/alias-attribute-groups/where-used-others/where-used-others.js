(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('whereUsedOthers', whereUsedOthers);

  /** @ngInject */
  function whereUsedOthers(BaseService, USER, CORE, DialogFactory, ComponentFactory) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        componentId: '=?',
        isReadOnly: '=?'
      },
      templateUrl: 'app/directives/custom/alias-attribute-groups/where-used-others/where-used-others.html',
      controller: whereUsedOthersCtrl,
      controllerAs: 'vm'
    };
    return directive;


    /** @ngInject */
    /**
    * Controller for view data of driveToolPartsListCtrl
    *
    * @param
    */
    function whereUsedOthersCtrl($scope, $element, $attrs, $timeout) {
      const vm = this;
      vm.isReadOnly = $scope.isReadOnly;
      vm.cid = $scope.componentId;
      vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
      vm.KeywordStatusGridHeaderDropdown = CORE.KeywordStatusGridHeaderDropdown;
      vm.LabelConstant = angular.copy(CORE.LabelConstant);
      vm.mfgLabelConstant = CORE.LabelConstant.MFG;
      vm.loginUser = BaseService.loginUser;
      const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
      vm.SiteOtherEmptyMesssage = USER.ADMIN_EMPTYSTATE.COMPONENT_WHERE_USED_OTHER;

      vm.SiteOtherDetNotFound = false;
      vm.siteOtherTotalSourceDataCount = 0;
      vm.siteOtherSourceHeader = [
        {
          field: '#',
          width: '50',
          cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
          enableFiltering: false,
          enableSorting: false,
          enableCellEdit: false
        },
        {
          field: 'whereUsed',
          displayName: 'Where Used',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.ASSY_NICKNAME,
          enableCellEdit: false
        },
        {
          field: 'mfrCode',
          displayName: vm.LabelConstant.MFG.MFG,
          width: 120,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                              <a class="cm-text-decoration underline" ng-if="row.entity.MID > 0"\
                                  ng-click="grid.appScope.$parent.vm.editManufacturer(row.entity.mfgType,row.entity.mfgCodeID );"\
                                  tabindex="-1">{{COL_FIELD}}</a>\
                              <span ng-if="row.entity.MID <= 0">{{COL_FIELD}}</span>\
                          </div>',
          allowCellFocus: false
        },
        {
          field: 'mfgPN',
          width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
          displayName: vm.LabelConstant.MFG.MFGPN,
          cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link component-id="row.entity.componentID"\
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
                              <common-pid-code-label-link component-id="row.entity.componentID"\
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
                              <common-pid-code-label-link component-id="row.entity.componentID"\
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
                            ng-click="grid.appScope.$parent.vm.showVersionHistory(row.entity, row.entity.componentID,$event)"><a>{{COL_FIELD}}</a></div>',
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

      vm.siteOtherPagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['whereUsed', 'ASC']],
        SearchColumns: [],
        partID: vm.cid
      };

      vm.siteOtherGridOptions = {
        showColumnFooter: false,
        enablePaging: isEnablePagination,
        enablePaginationControls: isEnablePagination,
        enableRowHeaderSelection: false,
        enableFullRowSelection: false,
        enableRowSelection: false,
        multiSelect: false,
        filterOptions: vm.siteOtherPagingInfo.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: 'WhereUsedOtherComponentDetail.csv',
        hideFilter: true
      };

      /* retrieve site Other list */
      vm.loadSiteOtherData = () => {
        if (vm.siteOtherPagingInfo.SortColumns.length === 0) {
          vm.siteOtherPagingInfo.SortColumns = [['whereUsed', 'ASC']];
        }

        vm.cgBusyLoading = ComponentFactory.getWhereUseComponentOther().query(vm.siteOtherPagingInfo).$promise.then((response) => {
          vm.siteOtherSourceData = [];
          if (response.data) {
            vm.siteOtherSourceData = response.data.whereUsedComponentsOther;
            vm.siteOtherTotalSourceDataCount = response.data.Count;
          }

          if (!vm.siteOtherGridOptions.enablePaging) {
            vm.siteOtherCurrentdata = vm.siteOtherSourceData.length;
            vm.siteOtherGridOptions.gridApi.infiniteScroll.resetScroll();
          }
          vm.siteOtherGridOptions.clearSelectedRows();
          if (vm.siteOtherTotalSourceDataCount === 0) {
            if (vm.siteOtherPagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
              vm.SiteOtherDetNotFound = false;
              vm.siteOtherEmptyState = 0;
            }
            else {
              vm.SiteOtherDetNotFound = true;
              vm.siteOtherEmptyState = null;
            }
          }
          else {
            vm.SiteOtherDetNotFound = false;
            vm.siteOtherEmptyState = null;
          }
          $timeout(() => {
            vm.resetSiteOtherSourceGrid();
            if (!vm.siteOtherGridOptions.enablePaging && vm.siteOtherTotalSourceDataCount === vm.siteOtherCurrentdata) {
              return vm.siteOtherGridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
            }
          });
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.siteOtherGetDataDown = () => {
        vm.siteOtherPagingInfo.Page = vm.siteOtherPagingInfo.Page + 1;
        vm.cgBusyLoading = ComponentFactory.getWhereUseComponentOther().query(vm.siteOtherPagingInfo).$promise.then((response) => {
          vm.siteOtherSourceData = vm.siteOtherSourceData.concat(response.data.whereUsedComponentsOther);
          vm.siteOtherTotalSourceDataCount = response.data.Count;
          vm.siteOtherCurrentdata = vm.siteOtherSourceData.length;
          vm.siteOtherGridOptions.gridApi.infiniteScroll.saveScrollPercentage();
          $timeout(() => {
            vm.resetSiteOtherSourceGrid();
            return vm.siteOtherGridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.siteOtherTotalSourceDataCount !== vm.siteOtherCurrentdata ? true : false);
          });
        }).catch((error) => BaseService.getErrorLog(error));
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
