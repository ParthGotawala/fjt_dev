(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('supplierAssemblyList', supplierAssemblyList);

  /** @ngInject */
  function supplierAssemblyList(BaseService, USER, CORE, DialogFactory, ComponentFactory) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        componentId: '=?',
        mfgType: '=?',
        partDetail: '=?',
        isReadOnly: '=?'
      },
      templateUrl: 'app/directives/custom/alias-attribute-groups/supplier-assembly-list/supplier-assembly-list.html',
      controller: supplierAssemblyListCtrl,
      controllerAs: 'vm'
    };
    return directive;


    /** @ngInject */
    /**
    * Controller for view data of supplierAssemblyListCtrl
    *
    * @param
    */
    function supplierAssemblyListCtrl($scope, $element, $attrs, $timeout) {
      const vm = this;
      vm.isReadOnly = $scope.isReadOnly;
      vm.cid = $scope.componentId;
      vm.partDetail = $scope.partDetail;
      vm.mfgType = $scope.mfgType;
      vm.IsSupplier = vm.mfgType && vm.mfgType.toUpperCase() === CORE.MFG_TYPE.DIST ? true : false;
      vm.addPackagingAliasPartLabel = stringFormat(CORE.ADD_ALIAS_PART, '');
      vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
      vm.KeywordStatusGridHeaderDropdown = CORE.KeywordStatusGridHeaderDropdown;
      vm.LabelConstant = angular.copy(CORE.LabelConstant);
      vm.mfgLabelConstant = CORE.LabelConstant.MFG;
      vm.gridConfig = CORE.gridConfig;
      vm.PartCategory = CORE.PartCategory;
      vm.loginUser = BaseService.loginUser;
      vm.PackagingPartEmptyMesssage = USER.ADMIN_EMPTYSTATE.COMPONENT_PACKAGINGPART;
      const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
      vm.PartCorrectList = CORE.PartCorrectList;
      vm.EmptyMesssage = {};

      vm.supplierAssyNotFound = false;
      vm.supplierAssyEmptyMesssage = vm.partDetail.category === CORE.PartCategory.SubAssembly ? USER.ADMIN_EMPTYSTATE.COMPONENT_ASSEMBLY_PART : USER.ADMIN_EMPTYSTATE.COMPONENT_SUPPLIER_PART;

      const iniPageInfo = () => {
        vm.supplierAssyPagingInfo = {
          Page: CORE.UIGrid.Page(),
          pageSize: CORE.UIGrid.ItemsPerPage(),
          SortColumns: [],
          SearchColumns: []
        };
      };
      const onAddDeleteSupplier = $scope.$on(CORE.EventName.onAddDeleteSupplier, () => {
        BaseService.reloadUIGrid(vm.supplierAssyGridOptions, vm.supplierAssyPagingInfo, iniPageInfo, vm.loadSupplierAssyData);
      });

      vm.supplierAssyTotalSourceDataCount = 0;
      vm.supplierAssySourceHeader = [
        {
          field: '#',
          width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="grid.appScope.$parent.vm.loginUser.uiGridPreference !== \'P\'">\
          <span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span>\
          </div>\
          <div class="ui-grid-cell-contents grid-cell-text-right" ng-if="grid.appScope.$parent.vm.loginUser.uiGridPreference === \'P\'">\
          <span><b>{{(grid.appScope.$parent.vm.supplierAssyPagingInfo.pageSize * (grid.appScope.$parent.vm.supplierAssyPagingInfo.Page - 1)) + (grid.renderContainers.body.visibleRowCache.indexOf(row) + 1)}}</b></span>\
          </div>',
          enableFiltering: false,
          enableSorting: false,
          enableCellEdit: false
        },
        {
          field: 'mfrCode',
          displayName: vm.LabelConstant.MFG.MFG,
          width: 200,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                              <a class="cm-text-decoration underline" ng-if="row.entity.mfgcodeID > 0"\
                                  ng-click="grid.appScope.$parent.vm.editManufacturer(row.entity.mfgType,row.entity.mfgcodeID);"\
                                  tabindex="-1">{{COL_FIELD}}</a>\
                              <span ng-if="row.entity.mfgcodeID <= 0">{{COL_FIELD}}</span>\
                          </div>',
          allowCellFocus: false
        },
        {
          field: 'mfgPN',
          displayName: vm.mfgLabelConstant.MFGPN,
          cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link component-id="row.entity.ID"\
                                             label="grid.appScope.$parent.vm.LabelConstant.MFG.MFGPN"\
                                             rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.rohsIcon"\
                                             rohs-status="row.entity.rohsName"\
                                             value="COL_FIELD"\
                                             is-copy="true"\
                                             rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.rohsIcon"\
                                             rohs-status="row.entity.rohsName"\
                                             is-supplier="false"\
                      </common-pid-code-label-link></div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
          enableCellEdit: false
        },
        {
          field: 'custAssyPN',
          width: '320',
          displayName: 'Part#',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-class="{\'text-line-through\': (row.entity.restrictUsePermanently == true || row.entity.restrictUSEwithpermission == true) }">\
                              <common-pid-code-label-link component-id="row.entity.ID"\
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
                              <common-pid-code-label-link component-id="row.entity.ID"\
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
                            ng-click="grid.appScope.$parent.vm.showVersionHistory(row.entity,row.entity.ID,$event)"><a>{{COL_FIELD}}</a></div>',
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
          field: 'functionalTypeExternal',
          displayName: 'Functional Type(External)',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '200',
          enableCellEdit: false
        },
        {
          field: 'functionalTypeInternal',
          displayName: 'Functional Type(Internal)',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '200',
          enableCellEdit: false
        },
        {
          field: 'mountingTypeExternal',
          displayName: 'Mounting Type(External)',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '200',
          enableCellEdit: false
        },
        {
          field: 'mountingTypeInternal',
          displayName: 'Mounting Type(Internal)',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '200',
          enableCellEdit: false
        },
        {
          field: 'feature',
          displayName: 'Feature',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'isEpoxyMount',
          displayName: 'Epoxy Mount',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" \
                  ng-class="{\'label-success\':row.entity.isEpoxyMount === \'Yes\', \
                  \'label-warning\':row.entity.isEpoxyMount === \'No\'}"> \
                  {{ COL_FIELD }}'
            + '</span>'
            + '</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.KeywordStatusGridHeaderDropdown
          },
          ColumnDataType: 'StringEquals',
          width: 120
        },
        {
          field: 'partPackage',
          displayName: 'Package/Case (Shape)',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'operatingTemp',
          displayName: 'Operating Temperature',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'minOperatingTemp',
          displayName: 'Min Operating Temp',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'maxOperatingTemp',
          displayName: 'Max Operating Temp',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'temperatureCoefficient',
          displayName: 'Temperature Coefficient',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'temperatureCoefficientValue',
          displayName: 'Temperature Coefficient Value',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'temperatureCoefficientUnit',
          displayName: 'Temperature Coefficient Unit',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'connectorTypeText',
          width: 120,
          displayName: 'Connector Type (External)',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'connecterTypeName',
          width: 120,
          displayName: 'Connector Type (Internal)',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-class="{\'cm-input-color-red\' :row.entity.connecterTypeID==-1}">{{COL_FIELD}}</div>'
        },
        {
          field: 'noOfPositionText',
          displayName: vm.LabelConstant.MFG.noOfPositionText,
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'noOfPosition',
          width: 120,
          displayName: vm.LabelConstant.MFG.noOfPosition,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>'
        },
        {
          field: 'noOfRowsText',
          displayName: 'No. of Rows (External)',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'noOfRows',
          width: 120,
          displayName: 'No. of Rows',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>'
        },
        {
          field: 'pitch',
          width: 120,
          displayName: 'Pitch (Unit in mm)',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'pitchMating',
          width: 150,
          displayName: 'Pitch Mating(Unit in mm)',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'sizeDimension',
          width: 120,
          displayName: 'Size/Dimension',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'length',
          width: 120,
          displayName: 'Size/Dimension Length',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>'
        },
        {
          field: 'width',
          width: 120,
          displayName: 'Size/Dimension Width',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>'
        },
        {
          field: 'heightText',
          width: 120,
          displayName: 'Height - Seated (Max)',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'height',
          width: 120,
          displayName: 'Height - Seated (Max) Height',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>'
        },
        {
          field: 'maxOperatingTemp',
          displayName: 'Max Operating Temp',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'tolerance',
          displayName: 'Tolerance',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'voltage',
          displayName: 'Voltage',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'values',
          displayName: 'Values',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'powerRating',
          displayName: 'Power(Watts)',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'weight',
          displayName: 'Weight',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'color',
          width: 120,
          displayName: 'Color',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'updatedAt',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
          type: 'datetime',
          enableFiltering: false
        }, {
          field: 'updatedby',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          type: 'StringEquals',
          enableFiltering: true
        }, {
          field: 'updatedbyRole',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          type: 'StringEquals',
          enableFiltering: true
        }, {
          field: 'createdAt',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
          type: 'datetime',
          enableFiltering: false
        },
        {
          field: 'createdby',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
          type: 'StringEquals',
          enableFiltering: true
        },
        {
          field: 'createdbyRole',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
          type: 'StringEquals',
          enableFiltering: true
        }
      ];

      vm.supplierAssyPagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['id', 'DESC']],
        SearchColumns: [],
        refComponentID: vm.cid,
        withStock: true
      };
      iniPageInfo();
      vm.supplierAssyGridOptions = {
        enablePaging: isEnablePagination,
        enablePaginationControls: isEnablePagination,
        showColumnFooter: false,
        enableRowHeaderSelection: false,
        enableFullRowSelection: false,
        enableRowSelection: false,
        multiSelect: false,
        filterOptions: vm.supplierAssyPagingInfo.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: 'supplierAssyDetail.csv',
        hideFilter: true
      };

      /* retrieve Drive Tools list */
      vm.loadSupplierAssyData = () => {
        BaseService.setPageSizeOfGrid(vm.supplierAssyPagingInfo, vm.supplierAssyGridOptions);
        if (vm.supplierAssyPagingInfo.SortColumns.length === 0) {
          vm.supplierAssyPagingInfo.SortColumns = [['id', 'DESC']];
        }

        if (vm.partDetail.category === CORE.PartCategory.SubAssembly) {
          vm.supplierAssyPagingInfo.nickName = vm.partDetail.nickName;
          vm.supplierAssyPagingInfo.mfgType = vm.mfgType;
          vm.cgBusyLoading = ComponentFactory.getAssemblyRevisionList().query(vm.supplierAssyPagingInfo).$promise.then((response) => {
            vm.supplierAssySourceData = [];
            bindGridData(response);
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          vm.supplierAssyPagingInfo.id = vm.cid;
          vm.cgBusyLoading = ComponentFactory.getComponentAliasGroup().query(vm.supplierAssyPagingInfo).$promise.then((response) => {
            vm.supplierAssySourceData = [];
            bindGridData(response);
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };
      const bindGridData = (response, isGetDataDown) => {
        vm.driveToolsSourceData = [];
        vm.driveToolsTotalSourceDataCount = 0;
        if (response.data) {
          if (isGetDataDown) {
            vm.supplierAssySourceData = vm.supplierAssySourceData.concat(response.data.data);
          } else {
            vm.supplierAssySourceData = response.data.data;
          }
          vm.supplierAssyTotalSourceDataCount = response.data.Count;
        }

        if (!vm.supplierAssyGridOptions.enablePaging) {
          vm.supplierAssyCurrentdata = vm.supplierAssySourceData.length;
          vm.supplierAssyGridOptions.gridApi.infiniteScroll.resetScroll();
        }
        vm.supplierAssyGridOptions.clearSelectedRows();
        if (vm.supplierAssyTotalSourceDataCount === 0) {
          if (vm.supplierAssyPagingInfo.SearchColumns.length > 0) {
            vm.supplierAssyNotFound = false;
            vm.supplierAssyEmptyState = 0;
          }
          else {
            vm.supplierAssyNotFound = true;
            vm.supplierAssyEmptyState = null;
          }
        }
        else {
          vm.supplierAssyNotFound = false;
          vm.supplierAssyEmptyState = null;
        }
        $timeout(() => {
          vm.resetsupplierAssySourceGrid();
          if (!vm.supplierAssyGridOptions.enablePaging && vm.supplierAssyTotalSourceDataCount === vm.supplierAssyCurrentdata) {
            return vm.supplierAssyGridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
          }
        });
      };

      vm.supplierAssyGetDataDown = () => {
        vm.supplierAssyPagingInfo.Page = vm.supplierAssyPagingInfo.Page + 1;
        if (vm.partDetail.category === CORE.PartCategory.SubAssembly) {
          vm.cgBusyLoading = ComponentFactory.getAssemblyRevisionList().query(vm.supplierAssyPagingInfo).$promise.then((response) => {
            bindGridData(response);
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          vm.cgBusyLoading = ComponentFactory.getComponentAliasGroup().query(vm.supplierAssyPagingInfo).$promise.then((response) => {
            bindGridData(response);
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      vm.addSupplierAliasPart = () => {
        if (vm.partDetail.category !== vm.PartCategory.SubAssembly && vm.IsSupplier === false) {
          const data = {};
          data.mfgType = CORE.MFG_TYPE.DIST;
          data.supplierMfgCodeId = vm.partDetail.mfgcodeID;
          data.supplierMfgPnID = vm.partDetail.id;
          data.category = vm.partDetail.category;

          DialogFactory.dialogService(
            CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
            CORE.MANAGE_COMPONENT_MODAL_VIEW, null, data).then(() => {
            }, () => {
              $scope.$emit(CORE.EventName.onAddDeleteSupplier);
            }, (err) => BaseService.getErrorLog(err));
        }
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

      $scope.$on('$destroy', () => {
        onAddDeleteSupplier();
      });
    }
  }
})();
