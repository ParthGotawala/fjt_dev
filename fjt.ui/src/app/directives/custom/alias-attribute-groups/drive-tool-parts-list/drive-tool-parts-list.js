(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('driveToolPartsList', driveToolPartsList);

  /** @ngInject */
  function driveToolPartsList(BaseService, USER, CORE, DialogFactory, ComponentFactory) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        componentId: '=?',
        mfgType: '=?',
        partDetail: '=?',
        rohsList: '=?',
        isReadOnly: '=?'
      },
      templateUrl: 'app/directives/custom/alias-attribute-groups/drive-tool-parts-list/drive-tool-parts-list.html',
      controller: driveToolPartsListCtrl,
      controllerAs: 'vm'
    };
    return directive;


    /** @ngInject */
    /**
    * Controller for view data of driveToolPartsListCtrl
    *
    * @param
    */
    function driveToolPartsListCtrl($scope, $element, $attrs, $timeout, $state, RFQTRANSACTION, DialogFactory) {
      const vm = this;
      vm.isReadOnly = $scope.isReadOnly;
      vm.cid = $scope.componentId;
      vm.partDetail = $scope.partDetail;
      vm.RohsList = $scope.rohsList;
      vm.mfgType = $scope.mfgType;
      vm.IsSupplier = vm.mfgType && vm.mfgType.toUpperCase() === CORE.MFG_TYPE.DIST ? true : false;
      vm.addPackagingAliasPartLabel = stringFormat(CORE.ADD_ALIAS_PART, '');
      vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
      vm.KeywordStatusGridHeaderDropdown = CORE.KeywordStatusGridHeaderDropdown;
      vm.LabelConstant = angular.copy(CORE.LabelConstant);
      vm.mfgLabelConstant = CORE.LabelConstant.MFG;
      vm.gridConfig = CORE.gridConfig;
      vm.loginUser = BaseService.loginUser;
      vm.PackagingPartEmptyMesssage = USER.ADMIN_EMPTYSTATE.COMPONENT_PACKAGINGPART;
      const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
      vm.PartCorrectList = CORE.PartCorrectList;
      vm.EmptyMesssage = {};

      const onAddDeleteDriveToolsPart = $scope.$on(CORE.EventName.onAddDeleteDriveToolsPart, () => {
        BaseService.reloadUIGrid(vm.driveToolsGridOptions, vm.driveToolsPagingInfo, iniDTPageInfo, vm.loadDriveToolsData);
      });

      // start component Drive tools alias region
      const getComponentDriveToolsDetail = (item) => {
        if (item) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.ADD_DRIVE_TOOL_CONFIRMATION_BODY_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, item.mfgPN);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              $scope.ComponentDriveToolsAlias = item;
              saveDriveTool();
            }
          }, () => {
            // Cancel
          });
        }
      };

      function getAliasSearch(searchObj) {
        searchObj.currentPartId = vm.cid;
        return ComponentFactory.getComponentMFGAliasPartsSearch().query({ listObj: searchObj }).$promise.then((componentAlias) => {
          if (componentAlias && componentAlias.data.data) {
            _.each(componentAlias.data.data, (item) => {
              item.isIcon = true;
            });
            if (searchObj.id) {
              $timeout(() => {
                $scope.$broadcast(searchObj.inputName, componentAlias.data.data[0]);
              });
            }
          }
          return componentAlias.data.data;
        }).catch((error) => BaseService.getErrorLog(error));
      }

      vm.autoCompleteDriveToolAlias = {
        columnName: 'mfgPN',
        keyColumnName: 'id',
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        keyColumnId: null,
        inputName: 'Drive Tool',
        placeholderName: 'Search text or Add',
        isRequired: false,
        isAddnew: true,
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          isBadPart: vm.PartCorrectList.CorrectPart,
          mountingTypeName: 'Tools',
          popupAccessRoutingState: [USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE],
          pageNameAccessLabel: CORE.PageName.part_master
        },
        callbackFn: function (obj) {
          const searchObj = {
            id: obj.id,
            mfgType: CORE.MFG_TYPE.MFG,
            isGoodPart: vm.PartCorrectList.CorrectPart,
            categoryID: vm.partDetail.category,
            inputName: vm.autoCompleteDriveToolAlias.inputName,
            driveToolsPartFilter: true
          };
          return getAliasSearch(searchObj);
        },
        onSelectCallbackFn: getComponentDriveToolsDetail,
        onSearchFn: function (query) {
          const searchObj = {
            mfgType: CORE.MFG_TYPE.MFG,
            isGoodPart: vm.PartCorrectList.CorrectPart,
            query: query,
            mountingType: 'Tools',
            categoryID: vm.partDetail.category,
            inputName: vm.autoCompleteDriveToolAlias.inputName,
            strictCustomPart: false,
            driveToolsPartFilter: true
          };
          return getAliasSearch(searchObj);
        }
      };

      vm.DriveToolsNotFound = false;
      vm.DriveToolsEmptyMesssage = USER.ADMIN_EMPTYSTATE.COMPONENT_DRIVE_TOOLS;

      vm.driveToolsTotalSourceDataCount = 0;
      vm.driveToolsSourceHeader = [
        {
          field: '#',
          width: '50',
          cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
          enableFiltering: false,
          enableSorting: false,
          enableCellEdit: false
        },
        {
          field: 'imageURL',
          width: 70,
          displayName: '',
          cellTemplate: '<div class="ui-grid-cell-contents">'
            + '<img class="cm-grid-images" ng-src="{{COL_FIELD}}"></img>'
            + '</div>',
          enableFiltering: false,
          enableSorting: false,
          allowCellFocus: false
        },
        {
          field: 'mfgCode',
          displayName: vm.LabelConstant.MFG.MFG,
          width: 120,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                              <a class="cm-text-decoration underline" ng-if="row.entity.mfgCodeId > 0"\
                                  ng-click="grid.appScope.$parent.vm.editManufacturer(row.entity.mfgType,row.entity.mfgCodeId);"\
                                  tabindex="-1">{{COL_FIELD}}</a>\
                              <span ng-if="row.entity.mfgCodeId <= 0">{{COL_FIELD}}</span>\
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
          field: 'partStock',
          displayName: 'Stock',
          width: 120,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
          enableFiltering: true,
          enableSorting: true,
          allowCellFocus: false
        },
        {
          field: 'functionalCategoryText',
          width: 150,
          displayName: 'Functional Type (External)',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'functionalCategoryName',
          width: 150,
          displayName: 'Functional Type (Internal)',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-class="{\'cm-input-color-red\' :row.entity.functionalCategoryID==-1}">{{COL_FIELD}}</div>'
        },
        {
          field: 'mountingTypeText',
          width: 150,
          displayName: 'Mounting Type (External)',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'mountingTypeName',
          width: 150,
          displayName: 'Mounting Type (Internal)',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-class="{\'cm-input-color-red\' :row.entity.mountingTypeID==-1}">{{COL_FIELD}}</div>'
        }
      ];

      const iniDTPageInfo = () => {
        vm.driveToolsPagingInfo = {
          Page: CORE.UIGrid.Page(),
          pageSize: CORE.UIGrid.ItemsPerPage(),
          SortColumns: [],
          refComponentID: vm.cid,
          SearchColumns: [],
          withStock: true
        };
      };

      vm.driveToolsPagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['id', 'DESC']],
        SearchColumns: [],
        refComponentID: vm.cid,
        withStock: true
      };

      vm.driveToolsGridOptions = {
        enablePaging: isEnablePagination,
        enablePaginationControls: isEnablePagination,
        showColumnFooter: false,
        enableRowHeaderSelection: false,
        enableFullRowSelection: false,
        enableRowSelection: false,
        multiSelect: false,
        filterOptions: vm.driveToolsPagingInfo.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: 'DriveToolsDetail.csv',
        hideFilter: true
      };

      /* retrieve Drive Tools list */
      vm.loadDriveToolsData = () => {
        if (vm.driveToolsPagingInfo.SortColumns.length === 0) {
          vm.driveToolsPagingInfo.SortColumns = [['id', 'DESC']];
        }

        vm.cgBusyLoading = ComponentFactory.getDriveToolListByComponentId().query(vm.driveToolsPagingInfo).$promise.then((response) => {
          vm.driveToolsSourceData = [];
          if (response.data) {
            vm.driveToolsSourceData = response.data.driveTools;
            vm.driveToolsTotalSourceDataCount = response.data.Count;
            if (vm.driveToolsSourceData && vm.driveToolsSourceData.length > 0) {
              _.each(vm.driveToolsSourceData, (obj) => {
                if (obj.imageURL === '' || obj.imageURL === null) {
                  obj.imageURL = CORE.NO_IMAGE_COMPONENT;
                }
                else if (!obj.imageURL.startsWith('http://') && !obj.imageURL.startsWith('https://') && obj.imageURL !== CORE.NO_IMAGE_COMPONENT) {
                  obj.imageURL = BaseService.getPartMasterImageURL(obj.documentPath, obj.imageURL);
                }
              });
            }
          }

          if (!vm.driveToolsGridOptions.enablePaging) {
            vm.driveToolsCurrentdata = vm.driveToolsSourceData.length;
            vm.driveToolsGridOptions.gridApi.infiniteScroll.resetScroll();
          }
          vm.driveToolsGridOptions.clearSelectedRows();
          if (vm.driveToolsTotalSourceDataCount === 0) {
            if (vm.driveToolsPagingInfo.SearchColumns.length > 0) {
              vm.DriveToolsNotFound = false;
              vm.driveToolsEmptyState = 0;
            }
            else {
              vm.DriveToolsNotFound = true;
              vm.driveToolsEmptyState = null;
            }
          }
          else {
            vm.DriveToolsNotFound = false;
            vm.driveToolsEmptyState = null;
          }
          $timeout(() => {
            vm.resetDriveToolsSourceGrid();
            if (!vm.driveToolsGridOptions.enablePaging && vm.driveToolsTotalSourceDataCount === vm.driveToolsCurrentdata) {
              return vm.driveToolsGridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
            }
          });
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.driveToolsGetDataDown = () => {
        vm.driveToolsPagingInfo.Page = vm.driveToolsPagingInfo.Page + 1;
        vm.cgBusyLoading = ComponentFactory.getDriveToolListByComponentId().query(vm.driveToolsPagingInfo).$promise.then((response) => {
          vm.driveToolsSourceData = vm.driveToolsSourceData.concat(response.data.driveTools);
          vm.driveToolsTotalSourceDataCount = response.data.Count;
          vm.driveToolsCurrentdata = vm.driveToolsSourceData.length;
          vm.driveToolsGridOptions.gridApi.infiniteScroll.saveScrollPercentage();
          if (vm.driveToolsSourceData && vm.driveToolsSourceData.length > 0) {
            _.each(vm.driveToolsSourceData, (obj) => {
              if (obj.imageURL === '' || obj.imageURL === null) {
                obj.imageURL = CORE.NO_IMAGE_COMPONENT;
              }
              else if (!obj.imageURL.startsWith('http://') && !obj.imageURL.startsWith('https://') && obj.imageURL !== CORE.NO_IMAGE_COMPONENT) {
                obj.imageURL = BaseService.getPartMasterImageURL(obj.documentPath, obj.imageURL);
              }
            });
          }
          $timeout(() => {
            vm.resetDriveToolsSourceGrid();
            return vm.driveToolsGridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.driveToolsTotalSourceDataCount !== vm.driveToolsCurrentdata ? true : false);
          });
        }).catch((error) => BaseService.getErrorLog(error));
      };

      //Save Component Drive Tools
      function saveDriveTool() {
        const componentInfo = {
          refComponentID: vm.cid,
          componentID: $scope.ComponentDriveToolsAlias.id
        };
        return ComponentFactory.createComponentDriveTools().save({ componentObj: componentInfo }).$promise.then((res) => {
          if (res && res.data) {
            $scope.$emit(CORE.EventName.onAddDeleteDriveToolsPart, vm.ComponentAlternatePartType);
          }
          else {
            $scope.$broadcast(vm.autoCompleteDriveToolAlias.inputName, null);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }

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
        onAddDeleteDriveToolsPart();
      });
    }
  }
})();
