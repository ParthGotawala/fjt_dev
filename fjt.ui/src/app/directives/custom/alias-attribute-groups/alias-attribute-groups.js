(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('aliasAttributeGroups', aliasAttributeGroups);

  /** @ngInject */
  function aliasAttributeGroups(BaseService, USER, CORE, DialogFactory, ComponentFactory) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        isSupplier: '=?',
        partDetail: '=?',
        rohsList: '=?',
        isReadOnly: '=?'
      },
      templateUrl: 'app/directives/custom/alias-attribute-groups/alias-attribute-groups.html',
      controller: aliasAttributeGroupsCtrl,
      controllerAs: 'vm'
    };
    return directive;


    /** @ngInject */
    /**
    * Controller for view data of alias & attribute groups
    *
    * @param
    */
    function aliasAttributeGroupsCtrl($scope, $element, $attrs, $timeout, $state, $stateParams, DialogFactory, MasterFactory, RFQTRANSACTION, $q) {
      const vm = this;
      vm.isReadOnly = $scope.isReadOnly;
      vm.cid = $stateParams.coid;
      vm.RohsList = $scope.rohsList;
      vm.partDetail = $scope.partDetail;
      vm.isSupplier = $scope.isSupplier;
      vm.addPackagingAliasPartLabel = stringFormat(CORE.ADD_ALIAS_PART, '');
      vm.mfgType = $state && $state.$current && $state.$current.parent && $state.$current.parent.name === USER.ADMIN_MANAGEDISTCOMPONENT_STATE ? CORE.MFG_TYPE.DIST : CORE.MFG_TYPE.MFG;
      vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
      vm.partMasterAlternateGroupsTabs = USER.PartMasterAlternateGroupsTabs;
      vm.selectedTabIndex = 0;
      vm.subTabName = $stateParams.subTab;
      vm.LabelConstant = angular.copy(CORE.LabelConstant);
      vm.PartCategory = CORE.PartCategory;
      vm.PartCorrectList = CORE.PartCorrectList;
      vm.KeywordStatusGridHeaderDropdown = CORE.KeywordStatusGridHeaderDropdown;

      vm.ComponentAlternatePartType = null;
      vm.IsPackagingPartsTab = false;
      vm.IsAlternatePartsTab = false;
      vm.IsRoHSReplacmentPartsTab = false;
      vm.IsWhereUsedTab = false;
      vm.IsDriveToolsTab = false;
      vm.IsProcessMaterialTab = false;
      vm.IsCPNListTab = false;
      vm.IsWhereUsedOtherTab = false;
      vm.IsRequireMatingPartsTab = false;
      vm.IsPickupPadPartsTab = false;
      vm.IsProgramPartTab = false;
      vm.IsRequireFunctionalTestingPartsTab = false;
      vm.IsFunctionalTestingEquipmentTab = false;
      vm.IsPurchaseHistoryTab = false;

      vm.PackagingPartEmptyMesssage = USER.ADMIN_EMPTYSTATE.COMPONENT_PACKAGINGPART;
      vm.PossibleAlternatePartEmptyMesssage = USER.ADMIN_EMPTYSTATE.COMPONENT_POSSIBLE_ALTERNATEPART;
      vm.ProcessMaterialPartEmptyMesssage = USER.ADMIN_EMPTYSTATE.COMPONENT_PROCESS_MATERIAL_PART;
      vm.FunctionalTestingEquipmentEmptyMesssage = USER.ADMIN_EMPTYSTATE.COMPONENT_FUNCTIONAL_TESTING_FUNCTIONAL_PART;

      vm.PackagingPartsTabName = USER.PartMasterAlternateGroupsTabs.PackagingParts.Name;
      vm.AlternatePartsTabName = USER.PartMasterAlternateGroupsTabs.AlternateParts.Name;
      vm.RoHSReplacmentPartsTabName = USER.PartMasterAlternateGroupsTabs.RoHSReplacementParts.Name;
      vm.WhereUsedTabName = USER.PartMasterAlternateGroupsTabs.WhereUsed.Name;
      vm.DriveToolsTabName = USER.PartMasterAlternateGroupsTabs.DriveTools.Name;
      vm.ProcessMaterialTabName = USER.PartMasterAlternateGroupsTabs.ProcessMaterial.Name;
      vm.CPNListTabName = USER.PartMasterAlternateGroupsTabs.CPNList.Name;
      vm.WhereUsedOtherTabName = USER.PartMasterAlternateGroupsTabs.WhereUsedOther.Name;
      vm.RequireMatingPartsTabName = USER.PartMasterAlternateGroupsTabs.RequireMatingParts.Name;
      vm.PickupPadPartsTabName = USER.PartMasterAlternateGroupsTabs.PickupPadParts.Name;
      vm.ProgramTabName = USER.PartMasterAlternateGroupsTabs.Program.Name;
      vm.RequireFunctionalTestigPartsTabName = USER.PartMasterAlternateGroupsTabs.RequireFunctionalTestingParts.Name;
      vm.FunctionalTestingEquipmentTabName = USER.PartMasterAlternateGroupsTabs.FunctionalEquipmentParts.Name;
      vm.PurchaseHistoryTabName = USER.PartMasterAlternateGroupsTabs.PurchaseHistory.Name;

      vm.mfgLabelConstant = CORE.LabelConstant.MFG;
      vm.gridConfig = CORE.gridConfig;
      vm.loginUser = BaseService.loginUser;
      const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;

      vm.DefaultDateFormat = _dateDisplayFormat;
      if (vm.subTabName) {
        const tab = _.find(USER.PartMasterAlternateGroupsTabs, (item) => item.Name === vm.subTabName);
        if (tab) {
          vm.selectedTabIndex = tab.ID;
          switch (tab.Name) {
            case USER.PartMasterAlternateGroupsTabs.AlternateParts.Name:
              vm.ComponentAlternatePartType = CORE.ComponentAlternatePartType.AlternatePart;
              break;
            case USER.PartMasterAlternateGroupsTabs.RoHSReplacementParts.Name:
              vm.ComponentAlternatePartType = CORE.ComponentAlternatePartType.RoHSReplacementPart;
              break;
            case USER.PartMasterAlternateGroupsTabs.RequireMatingParts.Name:
              vm.ComponentAlternatePartType = CORE.ComponentAlternatePartType.MatingPartRequired;
              break;
            case USER.PartMasterAlternateGroupsTabs.PickupPadParts.Name:
              vm.ComponentAlternatePartType = CORE.ComponentAlternatePartType.PickupPadRequired;
              break;
            case USER.PartMasterAlternateGroupsTabs.Program.Name:
              vm.ComponentAlternatePartType = CORE.ComponentAlternatePartType.ProgrammingRequired;
              break;
            case USER.PartMasterAlternateGroupsTabs.RequireFunctionalTestingParts.Name:
              vm.ComponentAlternatePartType = CORE.ComponentAlternatePartType.FunctionaTestingRequired;
              break;
            default:
          }
        }
      }

      const stateChangeSuccessCall = $scope.$on('$viewContentLoaded', () => {
        $timeout(() => {
          vm.addAliasPart = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowAddAliasParts);
        }, _configWOTimeout);
      });

      $timeout(() => {
        vm.addAliasPart = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowAddAliasParts);
      });

      // get RoHS List
      function getRoHSList() {
        MasterFactory.getRohsList().query().$promise.then((requirement) => {
          initAutoCompleteAlias();
          if (requirement && requirement.data) {
            if (vm.cid) {
              vm.RohsList = requirement.data;
            }
            else {
              vm.RohsList = _.filter(requirement.data, (item) => item.isActive);
            }
          }
          else {
            vm.RohsList = [];
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }

      vm.stateTransfer = (tabIndex) => {
        var itemTabName = _.find(vm.partMasterAlternateGroupsTabs, (valItem) => valItem.ID === tabIndex);
        if (itemTabName && itemTabName.Name !== vm.tabName) {
          const routeState = (vm.mfgType.toUpperCase() === CORE.MFG_TYPE.DIST) ? USER.ADMIN_MANAGEDISTCOMPONENT_ALTERNATEGROUP_STATE : USER.ADMIN_MANAGECOMPONENT_ALTERNATEGROUP_STATE;
          $state.go(routeState, { coid: vm.cid, selectedTab: USER.PartMasterTabs.AlternateGroup.Name, subTab: itemTabName.Name });
        }
      };

      const initAutoCompleteAlias = () => {
        if (vm.IsPackagingPartsTab) {
          vm.autoCompletePackagingAlias = {
            columnName: 'mfgPN',
            keyColumnName: 'id',
            keyColumnId: null,
            controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
            viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
            inputName: 'Packaging Alias',
            placeholderName: 'Search text or Add',
            isRequired: false,
            isAddnew: true,
            addData: {
              mfgType: CORE.MFG_TYPE.MFG,
              parentId: vm.partDetail.mfgcodeID,
              isBadPart: vm.PartCorrectList.CorrectPart,
              functionalCategoryID: vm.partDetail.functionalCategoryID,
              mountingTypeID: vm.partDetail.mountingTypeID
            },
            callbackFn: function (obj) {
              var selectedRoHS = _.find(vm.RohsList, (m) => m.id === vm.partDetail.RoHSStatusID);
              const searchObj = {
                id: obj.id,
                isGoodPart: vm.PartCorrectList.CorrectPart,
                mfgType: CORE.MFG_TYPE.MFG,
                inputName: vm.autoCompletePackagingAlias.inputName,
                rohsMainCategoryID: selectedRoHS.refMainCategoryID,
                isRohsMainCategoryInvertMatch: true,
                mountingTypeID: vm.partDetail.mountingTypeID,
                packagingAliasFilter: true
              };
              if (!vm.partDetail.isCustom) {
                searchObj.mfgcodeID = vm.partDetail.mfgcodeID;
              }
              return getAliasSearch(searchObj);
            },
            onSelectCallbackFn: getComponentPackagingAliasDetail,
            onSearchFn: function (query) {
              var selectedRoHS = _.find(vm.RohsList, (m) => m.id === vm.partDetail.RoHSStatusID);
              const searchObj = {
                mfgType: CORE.MFG_TYPE.MFG,
                isGoodPart: vm.PartCorrectList.CorrectPart,
                query: query,
                inputName: vm.autoCompletePackagingAlias.inputName,
                rohsMainCategoryID: selectedRoHS.refMainCategoryID,
                isRohsMainCategoryInvertMatch: true,
                mountingTypeID: vm.partDetail.mountingTypeID,
                packagingAliasFilter: true
              };
              if (!vm.partDetail.isCustom) {
                searchObj.mfgcodeID = vm.partDetail.mfgcodeID;
              }
              return getAliasSearch(searchObj);
            }
          };
        }
        if (vm.IsFunctionalTestingEquipmentTab) {
          vm.autoCompleteRequireFunctionalTestingEquipmentsAlias = {
            columnName: 'assetName',
            keyColumnName: 'eqpID',
            controllerName: USER.ADMIN_EQUIPMENT_ADD_MODAL_CONTROLLER,
            viewTemplateURL: USER.ADMIN_EQUIPMENT_ADD_MODAL_VIEW,
            keyColumnId: null,
            inputName: 'Equipment',
            placeholderName: 'Search text or Add',
            isRequired: false,
            addData: {
              mfgType: CORE.MFG_TYPE.MFG,
              popupAccessRoutingState: [USER.ADMIN_MANAGEEQUIPMENT_STATE],
              pageNameAccessLabel: CORE.PageName.equipments
            },
            callbackFn: function (obj) {
              if (obj.status === CORE.ApiResponseTypeStatus.SUCCESS && obj.data && obj.data.equipmentData) {
                const searchObj = {
                  eqpID: obj.data.equipmentData.eqpID,
                  query: obj.data.equipmentData.assetName,
                  inputName: vm.autoCompleteRequireFunctionalTestingEquipmentsAlias.inputName
                };
                return getFunctionalTestingEquipmentSearch(searchObj);
              } else {
                const searchObj = {
                  eqpID: obj.eqpID,
                  query: obj.assetName,
                  inputName: vm.autoCompleteRequireFunctionalTestingEquipmentsAlias.inputName
                };
                return getFunctionalTestingEquipmentSearch(searchObj);
              }
            },
            isAddnew: true,
            onSelectCallbackFn: getComponentFunctionalTestingEquipmentDetail,
            onSearchFn: function (query) {
              const searchObj = {
                query: query,
                inputName: vm.autoCompleteRequireFunctionalTestingEquipmentsAlias.inputName
              };
              return getFunctionalTestingEquipmentSearch(searchObj);
            }
          };
        }

        if (vm.IsDriveToolsTab) {
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
        }

        if (vm.IsProcessMaterialTab) {
          vm.autoCompleteProcessMaterial = {
            columnName: 'mfgPN',
            keyColumnName: 'id',
            controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
            viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
            keyColumnId: null,
            inputName: 'ProcessMaterial',
            placeholderName: 'Search text or Add',
            isRequired: false,
            isAddnew: true,
            addData: {
              mfgType: CORE.MFG_TYPE.MFG,
              isBadPart: vm.PartCorrectList.CorrectPart
            },
            callbackFn: function (obj) {
              const searchObj = {
                id: obj.id,
                mfgType: CORE.MFG_TYPE.MFG,
                isGoodPart: vm.PartCorrectList.CorrectPart,
                categoryID: vm.partDetail.category,
                inputName: vm.autoCompleteProcessMaterial.inputName,
                processMaterialPartFilter: true
              };
              return getAliasSearch(searchObj);
            },
            onSelectCallbackFn: getComponentProcessMaterialDetail,
            onSearchFn: function (query) {
              const searchObj = {
                mfgType: CORE.MFG_TYPE.MFG,
                isGoodPart: vm.PartCorrectList.CorrectPart,
                query: query,
                categoryID: vm.partDetail.category,
                inputName: vm.autoCompleteProcessMaterial.inputName,
                processMaterialPartFilter: true
              };
              return getAliasSearch(searchObj);
            }
          };
        }
      };

      vm.onTabChanges = (TabName, msWizard) => {
        vm.IsPackagingPartsTab = TabName === USER.PartMasterAlternateGroupsTabs.PackagingParts.Name ? true : false;
        vm.IsAlternatePartsTab = TabName === USER.PartMasterAlternateGroupsTabs.AlternateParts.Name ? true : false;
        vm.IsRoHSReplacmentPartsTab = TabName === USER.PartMasterAlternateGroupsTabs.RoHSReplacementParts.Name ? true : false;
        vm.IsWhereUsedTab = TabName === USER.PartMasterAlternateGroupsTabs.WhereUsed.Name ? true : false;
        vm.IsDriveToolsTab = TabName === USER.PartMasterAlternateGroupsTabs.DriveTools.Name ? true : false;
        vm.IsProcessMaterialTab = TabName === USER.PartMasterAlternateGroupsTabs.ProcessMaterial.Name ? true : false;
        vm.IsCPNListTab = TabName === USER.PartMasterAlternateGroupsTabs.CPNList.Name ? true : false;
        vm.IsWhereUsedOtherTab = TabName === USER.PartMasterAlternateGroupsTabs.WhereUsedOther.Name ? true : false;
        vm.IsRequireMatingPartsTab = TabName === USER.PartMasterAlternateGroupsTabs.RequireMatingParts.Name ? true : false;
        vm.IsPickupPadPartsTab = TabName === USER.PartMasterAlternateGroupsTabs.PickupPadParts.Name ? true : false;
        vm.IsProgramPartTab = TabName === USER.PartMasterAlternateGroupsTabs.Program.Name ? true : false;
        vm.IsRequireFunctionalTestingPartsTab = TabName === USER.PartMasterAlternateGroupsTabs.RequireFunctionalTestingParts.Name ? true : false;
        vm.IsFunctionalTestingEquipmentTab = TabName === USER.PartMasterAlternateGroupsTabs.FunctionalEquipmentParts.Name ? true : false;
        vm.IsPurchaseHistoryTab = TabName === USER.PartMasterAlternateGroupsTabs.PurchaseHistory.Name ? true : false;

        getRoHSList();

        msWizard.selectedIndex = vm.selectedTabIndex;
        vm.stateTransfer(vm.selectedTabIndex);
        $('#content').animate({ scrollTop: 0 }, 200);
      };
      vm.editManufacturer = (mfgType, mfgcodeID) => {
        if (mfgType === CORE.MFG_TYPE.DIST) {
          BaseService.goToSupplierDetail(mfgcodeID);
        }
        else {
          BaseService.goToManufacturer(mfgcodeID);
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

      /*---------------------------- [S] - Process Material Equipment List ----------------------------*/
      vm.PMNotFound = false;
      vm.isHideDelete = true;
      const iniPMPageInfo = () => {
        vm.pagingInfoPM = {
          Page: CORE.UIGrid.Page(),
          pageSize: CORE.UIGrid.ItemsPerPage(),
          SortColumns: [],
          SearchColumns: []
        };
      };
      vm.sourceHeaderPM = [
        {
          field: '#',
          width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="grid.appScope.$parent.vm.loginUser.uiGridPreference !== \'P\'">\
          <span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span>\
          </div>\
          <div class="ui-grid-cell-contents grid-cell-text-right" ng-if="grid.appScope.$parent.vm.loginUser.uiGridPreference === \'P\'">\
          <span><b>{{(grid.appScope.$parent.vm.pagingInfoPM.pageSize * (grid.appScope.$parent.vm.pagingInfoPM.Page - 1)) + (grid.renderContainers.body.visibleRowCache.indexOf(row) + 1)}}</b></span>\
          </div>',
          enableFiltering: false,
          enableSorting: false,
          enableCellEdit: false
        },
        {
          field: 'mfgCode',
          displayName: vm.LabelConstant.MFG.MFGCode,
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
          displayName: 'Customer Part#',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-class="{\'text-line-through\': (row.entity.restrictUsePermanently == true || row.entity.restrictUSEwithpermission == true) }">\
                              <common-pid-code-label-link component-id="row.entity.id"\
                                                         value="COL_FIELD"\
                                                         is-copy="true"\
                                                         rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.rohsIcon"\
                                                         rohs-status="row.entity.rohsComplientConvertedValue"\
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
                              <common-pid-code-label-link component-id="row.entity.id"\
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
                            ng-click="grid.appScope.$parent.vm.showVersionHistory(row.entity, row.entity.id,$event)"><a>{{COL_FIELD}}</a></div>',
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

      vm.pagingInfoPM = {
        Page: CORE.UIGrid.Page(),
        pageSize: CORE.UIGrid.ItemsPerPage(),
        SortColumns: [],
        SearchColumns: []
      };

      vm.gridOptionsPM = {
        enablePaging: isEnablePagination,
        enablePaginationControls: isEnablePagination,
        showColumnFooter: false,
        enableRowHeaderSelection: false,
        enableFullRowSelection: false,
        enableRowSelection: false,
        multiSelect: false,
        filterOptions: vm.pagingInfoPM.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: 'Process Material Parts.csv',
        hideFilter: true
      };

      /* retrieve Process material Part list */
      vm.loadDataPM = () => {
        BaseService.setPageSizeOfGrid(vm.pagingInfoPM, vm.gridOptionsPM);
        if (vm.pagingInfoPM.SortColumns.length === 0) {
          vm.pagingInfoPM.SortColumns = [['mfgPN', 'ASC']];
          vm.pagingInfoPM.type = vm.ComponentAlternatePartType;
        }
        vm.pagingInfoPM.id = vm.cid ? vm.cid : null;
        vm.cgBusyLoading = ComponentFactory.getProcessMaterialPartGridList().query(vm.pagingInfoPM).$promise.then((response) => {
          vm.PMNotFound = true;
          vm.sourceDataPM = response.data.processMaterialPartList;
          vm.totalSourceDataCountPM = response.data.Count;

          if (!vm.gridOptionsPM.enablePaging) {
            vm.currentdataPM = vm.sourceDataPM.length;
            vm.gridOptionsPM.gridApi.infiniteScroll.resetScroll();
          }
          vm.gridOptionsPM.clearSelectedRows();
          if (vm.totalSourceDataCountPM === 0) {
            if (vm.pagingInfoPM.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
              vm.PMNotFound = false;
              vm.emptyStatePM = 0;
            }
            else {
              vm.PMNotFound = true;
              vm.emptyStatePM = null;
            }
          }
          else {
            vm.PMNotFound = false;
            vm.emptyStatePM = null;
          }

          if (!vm.gridOptionsPM.enablePaging) {
            vm.currentdataPM = vm.sourceDataPM.length;
          }

          $timeout(() => {
            vm.resetSourceGridPM();
            return vm.gridOptionsPM.gridApi.infiniteScroll.dataLoaded(false, false);
          }, 1000);
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.getDataDownPM = () => {
        vm.pagingInfoPM.Page = vm.pagingInfoPM.Page + 1;
        vm.cgBusyLoading = ComponentFactory.getProcessMaterialPartGridList().query(vm.pagingInfoPM).$promise.then((response) => {
          vm.sourceDataPM = vm.gridOptionsPM.data = vm.gridOptionsPM.data.concat(response.data.processMaterialPartList);
          vm.currentdataPM = vm.gridOptionsPM.currentItem = vm.gridOptionsPM.data.length;
          vm.gridOptionsPM.gridApi.infiniteScroll.saveScrollPercentage();
          $timeout(() => {
            if (!vm.gridOptionsPM.enablePaging && vm.totalSourceDataCountPM === vm.currentdataPM) {
              return vm.gridOptionsPM.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCountPM !== vm.currentdataPM ? true : false);
            }
          });
        }).catch((error) => BaseService.getErrorLog(error));
      };

      // when item selected from process Material auto complete
      const getComponentProcessMaterialDetail = (item) => {
        if (item) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.ADD_PROCESS_MATERIAL_CONFIRMATION_BODY_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, item.mfgPN);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              $scope.ComponentProcessMaterial = item;
              saveProcessMaterial();
              setFocusOnControl(vm.autoCompleteProcessMaterial.inputName);
            }
          }, () => {
            setFocusOnControl(vm.autoCompleteProcessMaterial.inputName);
          });
        }
      };
      //Save Process Material
      function saveProcessMaterial() {
        const componentInfo = {
          refComponentID: vm.cid,
          componentID: $scope.ComponentProcessMaterial.id
        };
        return ComponentFactory.createComponentProcessMaterial().save({ componentObj: componentInfo }).$promise.then((res) => {
          if (res && res.data) {
            BaseService.reloadUIGrid(vm.gridOptionsPM, vm.pagingInfoPM, iniPMPageInfo, vm.loadDataPM);
          }
          else {
            $scope.$broadcast(vm.autoCompleteProcessMaterial.inputName, null);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      /*---------------------------- [E] - Process Material Equipment List ----------------------------*/

      /*---------------------------- [S] - Functional Testing Equipment List ----------------------------*/
      vm.FTENotFound = false;
      vm.isHideDelete = true;
      vm.sourceHeaderFTE = [
        {
          field: '#',
          width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="grid.appScope.$parent.vm.loginUser.uiGridPreference !== \'P\'">\
          <span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span>\
          </div>\
          <div class="ui-grid-cell-contents grid-cell-text-right" ng-if="grid.appScope.$parent.vm.loginUser.uiGridPreference === \'P\'">\
          <span><b>{{(grid.appScope.$parent.vm.pagingInfoFTE.pageSize * (grid.appScope.$parent.vm.pagingInfoFTE.Page - 1)) + (grid.renderContainers.body.visibleRowCache.indexOf(row) + 1)}}</b></span>\
          </div>',
          enableFiltering: false,
          enableSorting: false,
          enableCellEdit: false
        }, {
          field: 'assetName',
          displayName: 'Name',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                              <a class="cm-text-decoration underline" ng-if="row.entity.eqpID > 0"\
                                  ng-click="grid.appScope.$parent.vm.goToEquipment(row.entity.eqpID);"\
                                  tabindex="-1">{{COL_FIELD}}</a>\
                              <span ng-if="row.entity.eqpID <= 0">{{COL_FIELD}}</span>\
                          </div>',
          width: '200'
        },
        {
          field: 'eqpMake',
          displayName: 'Make',
          width: '250'
        }, {
          field: 'eqpModel',
          displayName: 'Model',
          width: '130'
        }, {
          field: 'eqpYear',
          displayName: 'Year',
          width: '100'
        }
      ];

      const iniFTEPageInfo = () => {
        vm.pagingInfoFTE = {
          Page: CORE.UIGrid.Page(),
          pageSize: CORE.UIGrid.ItemsPerPage(),
          SortColumns: [],
          SearchColumns: []
        };
      };
      vm.pagingInfoFTE = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [],
        SearchColumns: []
      };

      vm.gridOptionsFTE = {
        enablePaging: isEnablePagination,
        enablePaginationControls: isEnablePagination,
        showColumnFooter: false,
        enableRowHeaderSelection: false,
        enableFullRowSelection: false,
        enableRowSelection: false,
        multiSelect: false,
        filterOptions: vm.pagingInfoFTE.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: 'Functional Testing Equipment.csv',
        hideFilter: true
      };

      /* retrieve work order serials list */
      vm.loadDataFTE = () => {
        BaseService.setPageSizeOfGrid(vm.pagingInfoFTE, vm.gridOptionsFTE);
        if (vm.pagingInfoFTE.SortColumns.length === 0) {
          vm.pagingInfoFTE.SortColumns = [['assetName', 'ASC']];
          vm.pagingInfoFTE.type = vm.ComponentAlternatePartType;
        }
        vm.pagingInfoFTE.id = vm.cid ? vm.cid : null;
        vm.cgBusyLoading = ComponentFactory.getFunctionaltestingEquipmentGridList().query(vm.pagingInfoFTE).$promise.then((response) => {
          vm.FTENotFound = true;
          vm.sourceDataFTE = response.data.functionalTestingEquipmentList;
          vm.totalSourceDataCountFTE = response.data.Count;

          if (!vm.gridOptionsFTE.enablePaging) {
            vm.currentdataFTE = vm.sourceDataFTE.length;
            vm.gridOptionsFTE.gridApi.infiniteScroll.resetScroll();
          }
          vm.gridOptionsFTE.clearSelectedRows();
          if (vm.totalSourceDataCountFTE === 0) {
            if (vm.pagingInfoFTE.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
              vm.FTENotFound = false;
              vm.emptyStateFTE = 0;
            }
            else {
              vm.FTENotFound = true;
              vm.emptyStateFTE = null;
            }
          }
          else {
            vm.FTENotFound = false;
            vm.emptyStateFTE = null;
          }

          if (!vm.gridOptionsFTE.enablePaging) {
            vm.currentdataFTE = vm.sourceDataFTE.length;
          }

          $timeout(() => {
            vm.resetSourceGridFTE();
            return vm.gridOptionsFTE.gridApi.infiniteScroll.dataLoaded(false, false);
          }, 1000);
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.getDataDownFTE = () => {
        vm.pagingInfoFTE.Page = vm.pagingInfoFTE.Page + 1;
        vm.cgBusyLoading = ComponentFactory.getFunctionaltestingEquipmentGridList().query(vm.pagingInfoFTE).$promise.then((response) => {
          vm.sourceDataFTE = vm.gridOptionsFTE.data = vm.gridOptionsFTE.data.concat(response.data.functionalTestingEquipmentList);
          vm.currentdataFTE = vm.gridOptionsFTE.currentItem = vm.gridOptionsFTE.data.length;
          vm.gridOptionsFTE.gridApi.infiniteScroll.saveScrollPercentage();
          $timeout(() => {
            if (!vm.gridOptionsFTE.enablePaging && vm.totalSourceDataCountFTE === vm.currentdataFTE) {
              return vm.gridOptionsFTE.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCountFTE !== vm.currentdataFTE ? true : false);
            }
          });
        }).catch((error) => BaseService.getErrorLog(error));
      };

      const getComponentFunctionalTestingEquipmentDetail = (item) => {
        if (item) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.ADD_FUNCTIONAL_TESTING_EQUIPMENT_CONFIRMATION_BODY_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, item.assetName);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              saveComponentFunctionalTestingEquipment(item);
            }
          }, () => {
            // Cancel
          });
        }
      };
      function getFunctionalTestingEquipmentSearch(searchObj) {
        searchObj.currentPartId = vm.cid;
        return ComponentFactory.getComponentFunctionalTestingEquipmentSearch().query({ listObj: searchObj }).$promise.then((componentAlias) => {
          if (componentAlias && componentAlias.data.data) {
            if (searchObj.eqpID) {
              $timeout(() => {
                $scope.$broadcast(searchObj.inputName, componentAlias.data.data[0]);
              });
            }
          }
          return componentAlias.data.data;
        }).catch((error) => BaseService.getErrorLog(error));
      }
      /* save  component alternate detail into database */
      function saveComponentFunctionalTestingEquipment(item) {
        const componentInfo = {
          eqpID: item.eqpID,
          componentID: vm.cid
        };
        ComponentFactory.createComponentFunctionalTestingEquipment().query({ componentObj: componentInfo }).$promise.then((res) => {
          if (res && res.data) {
            $scope.$broadcast(vm.autoCompleteRequireFunctionalTestingEquipmentsAlias.inputName, null);
            BaseService.reloadUIGrid(vm.gridOptionsFTE, vm.pagingInfoFTE, iniFTEPageInfo, vm.loadDataFTE);
          }
          else {
            $scope.$broadcast(vm.autoCompleteRequireFunctionalTestingEquipmentsAlias.inputName, null);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }

      vm.goToEquipment = (equipmentId) => {
        BaseService.goToManageEquipmentWorkstation(equipmentId);
      };
      /*---------------------------- [E] - Functional Testing Equipment List ----------------------------*/

      /*---------------------------- [S] - Possible Alternate List ----------------------------*/
      vm.PALNotFound = false;
      vm.sourceHeaderPAL = [
        {
          field: '#',
          width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="grid.appScope.$parent.vm.loginUser.uiGridPreference !== \'P\'">\
          <span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span>\
          </div>\
          <div class="ui-grid-cell-contents grid-cell-text-right" ng-if="grid.appScope.$parent.vm.loginUser.uiGridPreference === \'P\'">\
          <span><b>{{(grid.appScope.$parent.vm.pagingInfoPAL.pageSize * (grid.appScope.$parent.vm.pagingInfoPAL.Page - 1)) + (grid.renderContainers.body.visibleRowCache.indexOf(row) + 1)}}</b></span>\
          </div>',
          enableFiltering: false,
          enableSorting: false,
          enableCellEdit: false
        },
        {
          field: 'mfrCode',
          displayName: vm.LabelConstant.MFG.MFGCode,
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
          displayName: 'Customer Part#',
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
                            ng-click="grid.appScope.$parent.vm.showVersionHistory(row.entity, row.entity.ID,$event)"><a>{{COL_FIELD}}</a></div>',
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
          field: 'partPackage',
          displayName: 'Package/Case (Shape)',
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
          field: 'feature',
          displayName: 'Feature',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
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

      vm.pagingInfoPAL = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [],
        SearchColumns: []
      };

      vm.gridOptionsPAL = {
        enablePaging: isEnablePagination,
        enablePaginationControls: isEnablePagination,
        showColumnFooter: false,
        enableRowHeaderSelection: false,
        enableFullRowSelection: false,
        enableRowSelection: false,
        multiSelect: false,
        filterOptions: vm.pagingInfoPAL.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: 'PossibleAlternateList.csv',
        hideFilter: true
      };

      /* retrieve work order serials list */
      vm.loadDataPAL = () => {
        BaseService.setPageSizeOfGrid(vm.pagingInfoPAL, vm.gridOptionsPAL);
        if (vm.pagingInfoPAL.SortColumns.length === 0) {
          vm.pagingInfoPAL.SortColumns = [['mfgPN', 'ASC']];
        }
        vm.pagingInfoPAL.id = vm.cid ? vm.cid : null;
        vm.cgBusyLoading = ComponentFactory.getComponentPossibleAlternetPartList().query(vm.pagingInfoPAL).$promise.then((possibleparts) => {
          vm.sourceDataPAL = possibleparts.data.possiblePartList;
          vm.totalSourceDataCountPAL = possibleparts.data.Count;

          if (!vm.gridOptionsPAL.enablePaging) {
            vm.currentdataPAL = vm.sourceDataPAL.length;
            vm.gridOptionsPAL.gridApi.infiniteScroll.resetScroll();
          }
          vm.gridOptionsPAL.clearSelectedRows();
          if (vm.totalSourceDataCountPAL === 0) {
            if (vm.pagingInfoPAL.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
              vm.PALNotFound = false;
              vm.emptyStatePAL = 0;
            }
            else {
              vm.PALNotFound = true;
              vm.emptyStatePAL = null;
            }
          }
          else {
            vm.PALNotFound = false;
            vm.emptyStatePAL = null;
          }

          if (!vm.gridOptionsPAL.enablePaging) {
            vm.currentdataPAL = vm.sourceDataPAL.length;
          }

          $timeout(() => {
            vm.resetSourceGridPAL();
            if (!vm.gridOptionsPAL.enablePaging && vm.totalSourceDataCountPAL === vm.currentdataPAL) {
              return vm.gridOptionsPAL.gridApi.infiniteScroll.dataLoaded(false, false);
            }
          }, 1000);
        }).catch((error) => BaseService.getErrorLog(error));
      };
      vm.getDataDownPAL = () => {
        vm.pagingInfoPAL.Page = vm.pagingInfoPAL.Page + 1;
        vm.cgBusyLoading = ComponentFactory.getComponentPossibleAlternetPartList().query(vm.pagingInfoPAL).$promise.then((possibleparts) => {
          vm.sourceDataPAL = vm.gridOptionsPAL.data = vm.gridOptionsPAL.data.concat(possibleparts.data.possiblePartList);
          vm.currentdataPAL = vm.gridOptionsPAL.currentItem = vm.gridOptionsPAL.data.length;
          vm.totalSourceDataCountPAL = possibleparts.data.Count;
          vm.gridOptionsPAL.gridApi.infiniteScroll.saveScrollPercentage();
          $timeout(() => {
            vm.resetSourceGridPAL();
            return vm.gridOptionsPAL.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCountPAL !== vm.currentdataPAL ? true : false);
          });
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /*---------------------------- [E] - Possible Alternate  List ----------------------------*/

      /*---------------------------- [S] - Where used in Assembly ----------------------------*/
      vm.SiteEmptyMesssage = USER.ADMIN_EMPTYSTATE.COMPONENT_WHERE_USED;

      vm.SiteDetNotFound = false;
      vm.siteTotalSourceDataCount = 0;
      vm.siteSourceHeader = [
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
          displayName: vm.LabelConstant.MFG.MFGCode,
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
          displayName: 'Customer Part#',
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
      /*---------------------------- [E] - Where used in Assembly ----------------------------*/

      /*---------------------------- [S] - Where used Other ----------------------------*/
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
          displayName: vm.LabelConstant.MFG.MFGCode,
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
          displayName: 'Customer Part#',
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
      /*---------------------------- [E] - Where used Other ----------------------------*/


      /*---------------------------- [S] - Drive Tools List ----------------------------*/
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
          displayName: vm.LabelConstant.MFG.MFGCode,
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
          displayName: 'Customer Part#',
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
      //Save Component Drive Tools
      function saveDriveTool() {
        const componentInfo = {
          refComponentID: vm.cid,
          componentID: $scope.ComponentDriveToolsAlias.id
        };
        return ComponentFactory.createComponentDriveTools().save({ componentObj: componentInfo }).$promise.then((res) => {
          if (res && res.data) {
            BaseService.reloadUIGrid(vm.driveToolsGridOptions, vm.driveToolsPagingInfo, iniDTPageInfo, vm.loadDriveToolsData);
          }
          else {
            $scope.$broadcast(vm.autoCompleteDriveToolAlias.inputName, null);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      /*---------------------------- [E] - Drive Tools List ----------------------------*/


      /*---------------------------- [S] - Purchase History ----------------------------*/
      vm.PurchaseHistoryNotFound = false;

      vm.purchaseHistorySourceHeader = [
        {
          field: '#',
          width: '50',
          cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
          enableFiltering: false,
          enableSorting: false,
          enableCellEdit: false
        },
        {
          field: 'purchaseDate',
          displayName: 'Purchase Date',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
          width: '200',
          type: 'date',
          enableCellEdit: false
        },
        {
          field: 'purchaseSupplier',
          displayName: 'Purchase Supplier',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '200',
          enableCellEdit: false
        },
        {
          field: 'qty',
          displayName: 'Qty.',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '150',
          enableCellEdit: false,
          ColumnDataType: 'NUMBER'
        },
        {
          field: 'price',
          displayName: 'Price',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false,
          ColumnDataType: 'NUMBER'
        },
        {
          field: 'supplierPN',
          displayName: 'Supplier PN',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false,
          ColumnDataType: 'NUMBER'
        },
        {
          field: 'min',
          displayName: 'Min.',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '200',
          enableCellEdit: false
        },
        {
          field: 'muli',
          displayName: 'Mult.',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '150',
          enableCellEdit: false,
          ColumnDataType: 'NUMBER'
        },
        {
          field: 'package',
          displayName: 'Package',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false,
          ColumnDataType: 'NUMBER'
        },
        {
          field: 'ltb',
          displayName: 'EOL',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false,
          ColumnDataType: 'NUMBER'
        },
        {
          field: 'nichname',
          displayName: 'Nickname',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'availableStock',
          displayName: 'Available Stock',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false,
          ColumnDataType: 'NUMBER'
        }
      ];

      vm.purchaseHistoryPagingInfo = {
        Page: CORE.UIGrid.Page()
      };

      vm.purchaseHistoryGridOptions = {
        showColumnFooter: false,
        enableRowHeaderSelection: true,
        enableFullRowSelection: false,
        enableRowSelection: false,
        multiSelect: true,
        filterOptions: vm.purchaseHistoryPagingInfo.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: 'PurchaseHistory.csv'
      };

      /* retrieve purchase history */
      vm.loadPurchaseHistoryData = () => {
        vm.purchaseHistorySourceData = [{ id: 1, nickname: '100017', assyWithRev: 'PC100017 (B)', qpa: 10, eau: 1000, totalUsage: 950, status: 'Active' },
        { id: 2, nickname: '100012', assyWithRev: 'CD100012 (A)', qpa: 50, eau: 450, totalUsage: 300, status: 'Inactive' },
        { id: 3, nickname: '200017', assyWithRev: 'AB200017 (C)', qpa: 20, eau: 845, totalUsage: 456, status: 'Active' }];
        vm.purchaseHistoryTotalSourceDataCount = vm.siteSourceData.length;
        if (!vm.purchaseHistoryGridOptions.enablePaging) {
          vm.purchaseHistoryCurrentdata = vm.siteSourceData.length;
        }
        vm.PurchaseHistoryNotFound = true;
        $timeout(() => {
          vm.resetPurchaseHistorySourceGrid();
        }, 1000);
      };
      /*---------------------------- [E] - Purchase History ----------------------------*/


      /*---------------------------- [S] - CPN List  * ----------------------------*/
      vm.CPNEmptyMesssage = USER.ADMIN_EMPTYSTATE.COMPONENT_CPN;

      vm.cpnNotFound = false;
      vm.sourceHeaderCPN = [
        {
          field: '#',
          width: '50',
          cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
          enableFiltering: false,
          enableSorting: false,
          enableCellEdit: false
        },
        {
          field: 'mfgCode',
          displayName: vm.LabelConstant.MFG.MFGCode,
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
          cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link component-id="row.entity.refComponentID"\
                                             label="grid.appScope.$parent.vm.LabelConstant.MFG.MFGPN"\
                                             value="COL_FIELD"\
                                             rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.rohsIcon"\
                                             rohs-status="row.entity.rohsComplientConvertedValue"\
                                             is-copy="true"\
                                             is-supplier="false"\
                                             rohs-status = row.entity.rohsName\
                                             rohs-icon= grid.appScope.$parent.vm.rohsImagePath+row.entity.rohsIcon>\
                      </common-pid-code-label-link></div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
          allowCellFocus: false
        },
        {
          field: 'custAssyPN',
          width: '320',
          displayName: 'Customer Part#',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-class="{\'text-line-through\': (row.entity.restrictUsePermanently == true || row.entity.restrictUSEwithpermission == true) }">\
                              <common-pid-code-label-link component-id="row.entity.refComponentID"\
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
                              <common-pid-code-label-link component-id="row.entity.refComponentID"\
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
                            ng-click="grid.appScope.$parent.vm.showVersionHistory(row.entity, row.entity.refComponentID,$event)"><a>{{COL_FIELD}}</a></div>',
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
          displayName: 'Connector Type(External)',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '200',
          enableCellEdit: false
        },
        {
          field: 'connecterTypeInternal',
          displayName: 'Connector Type(Internal)',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '200',
          enableCellEdit: false
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
          displayName: 'Pitch (Unit in mm)',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'pitchMating',
          displayName: 'Pitch Mating(Unit in mm)',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'sizeDimension',
          displayName: 'Size/Dimension',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'length',
          displayName: 'Length',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'width',
          displayName: 'Width',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'heightText',
          displayName: 'Height-Seated (Max)(External)',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'height',
          displayName: 'Height-Seated (Max)(Internal)',
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
          field: 'value',
          displayName: 'Value',
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
          displayName: 'Color',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        }
      ];

      vm.pagingInfoCPN = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [],
        SearchColumns: []
      };

      vm.gridOptionsCPN = {
        enablePaging: isEnablePagination,
        enablePaginationControls: isEnablePagination,
        showColumnFooter: false,
        enableRowHeaderSelection: false,
        enableFullRowSelection: false,
        enableRowSelection: false,
        multiSelect: false,
        filterOptions: vm.pagingInfoCPN.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: 'AVL List.csv',
        hideFilter: true
      };

      /* retrieve CPN */
      vm.loadDataCPN = () => {
        if (vm.pagingInfoCPN.SortColumns.length === 0) {
          vm.pagingInfoCPN.SortColumns = [['id', 'ASC']];
        }
        vm.pagingInfoCPN.ComponentCustAliasRevID = vm.cid;
        vm.cgBusyLoading = ComponentFactory.getComponentCustAliasRevPNByCustId().query(vm.pagingInfoCPN).$promise.then((response) => {
          vm.cpnNotFound = true;

          vm.sourceDataCPN = response.data.CompCustAliasRevPN;
          vm.totalCPNSourceDataCount = response.data.Count;

          if (!vm.gridOptionsCPN.enablePaging) {
            vm.currentdataCPN = vm.sourceDataCPN.length;
            vm.gridOptionsCPN.gridApi.infiniteScroll.resetScroll();
          }
          vm.gridOptionsCPN.clearSelectedRows();
          if (vm.totalCPNSourceDataCount === 0) {
            if (vm.pagingInfoCPN.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
              vm.cpnNotFound = false;
              vm.cpnEmptyState = 0;
            }
            else {
              vm.cpnNotFound = true;
              vm.cpnEmptyState = null;
            }
          }
          else {
            vm.cpnNotFound = false;
            vm.cpnEmptyState = null;
          }

          if (!vm.gridOptionsCPN.enablePaging) {
            vm.currentdataCPN = vm.sourceDataCPN.length;
          }

          $timeout(() => {
            vm.resetSourceGridCPN();
          }, 1000);
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.getCPNDataDown = () => {
        vm.pagingInfoCPN.Page = vm.pagingInfoCPN.Page + 1;
        vm.cgBusyLoading = ComponentFactory.getComponentCustAliasRevPNByCustId().query(vm.pagingInfoCPN).$promise.then((response) => {
          vm.sourceDataCPN = vm.sourceDataCPN.concat(response.data.CompCustAliasRevPN);
          vm.currentdataCPN = vm.sourceDataCPN ? vm.sourceDataCPN.length : null;
          vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
          $timeout(() => {
            vm.resetSourceGridCPN();
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalCPNSourceDataCount !== vm.currentdata ? true : false);
          });
        }).catch((error) => BaseService.getErrorLog(error));
      };

      //copy part number on click
      vm.copyText = (copytext) => {
        var $temp = $('<input>');
        $('body').append($temp);
        $temp.val(copytext).select();
        document.execCommand('copy');
        $temp.remove();
        vm.showstatus = true;
      };
      //remove copied status on hover
      vm.checkStatus = () => {
        vm.showstatus = false;
      };
      /*---------------------------- [E] - CPN List  * ----------------------------*/

      /*---------------------------- [S] - Packaging Part List  ----------------------------*/
      vm.PackagingPartNotFound = false;
      const iniPackagingParttPageInfo = () => {
        vm.pagingInfoPackagingPart = {
          Page: CORE.UIGrid.Page(),
          pageSize: CORE.UIGrid.ItemsPerPage(),
          SortColumns: [],
          SearchColumns: []
        };
      };

      vm.sourceHeaderPackagingPart = [
        {
          field: '#',
          width: '50',
          cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
          enableFiltering: false,
          enableSorting: false,
          enableCellEdit: false
        },
        {
          field: 'mfrCode',
          displayName: vm.LabelConstant.MFG.MFGCode,
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
                                             value="COL_FIELD"\
                                             is-copy="true"\
                                             is-supplier="false"\
                                             rohs-status = row.entity.rohsName\
                                             rohs-icon= grid.appScope.$parent.vm.rohsImagePath+row.entity.rohsIcon>\
                      </common-pid-code-label-link></div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
          allowCellFocus: false
        },
        {
          field: 'custAssyPN',
          width: '320',
          displayName: 'Customer Part#',
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
                            ng-click="grid.appScope.$parent.vm.showVersionHistory(row.entity, row.entity.ID,$event)"><a>{{COL_FIELD}}</a></div>',
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
          displayName: 'Connector Type(External)',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '200',
          enableCellEdit: false
        },
        {
          field: 'connecterTypeInternal',
          displayName: 'Connector Type(Internal)',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '200',
          enableCellEdit: false
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
          displayName: 'Pitch (Unit in mm)',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'pitchMating',
          displayName: 'Pitch Mating(Unit in mm)',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'sizeDimension',
          displayName: 'Size/Dimension',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'length',
          displayName: 'Length',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'width',
          displayName: 'Width',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'heightText',
          displayName: 'Height-Seated (Max)(External)',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'height',
          displayName: 'Height-Seated (Max)(Internal)',
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
          field: 'value',
          displayName: 'Value',
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
          displayName: 'Color',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        }
      ];

      vm.pagingInfoPackagingPart = {
        Page: CORE.UIGrid.Page(),
        pageSize: CORE.UIGrid.ItemsPerPage(),
        SortColumns: [],
        SearchColumns: []
      };
      vm.gridOptionsPackagingPart = {
        enablePaging: isEnablePagination,
        enablePaginationControls: isEnablePagination,
        showColumnFooter: false,
        enableRowHeaderSelection: false,
        enableFullRowSelection: false,
        enableRowSelection: false,
        multiSelect: false,
        filterOptions: vm.pagingInfoPackagingPart.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: 'PackagingAliasParts.csv',
        hideFilter: true
      };

      /* retrieve packaging parts */
      vm.loadDataPackagingPart = () => {
        if (vm.pagingInfoPackagingPart.SortColumns.length === 0) {
          vm.pagingInfoPackagingPart.SortColumns = [['id', 'ASC']];
        }
        vm.pagingInfoPackagingPart.id = vm.cid;

        vm.cgBusyLoading = ComponentFactory.getComponentPackgingParts().query(vm.pagingInfoPackagingPart).$promise.then((response) => {
          vm.PackagingPartNotFound = true;

          vm.sourceDataPackagingPart = response.data.packagingParts;
          vm.totalPackagingPartSourceDataCount = response.data.Count;

          if (!vm.gridOptionsPackagingPart.enablePaging) {
            vm.currentdataPackagingPart = vm.sourceDataPackagingPart.length;
            vm.gridOptionsPackagingPart.gridApi.infiniteScroll.resetScroll();
          }
          vm.gridOptionsPackagingPart.clearSelectedRows();
          if (vm.totalPackagingPartSourceDataCount === 0) {
            if (vm.pagingInfoPackagingPart.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
              vm.PackagingPartNotFound = false;
              vm.packagingPartEmptyState = 0;
            }
            else {
              vm.PackagingPartNotFound = true;
              vm.packagingPartEmptyState = null;
            }
          }
          else {
            vm.PackagingPartNotFound = false;
            vm.packagingPartEmptyState = null;
          }

          if (!vm.gridOptionsPackagingPart.enablePaging) {
            vm.currentdataPackagingPart = vm.sourceDataPackagingPart.length;
          }

          $timeout(() => {
            vm.resetSourceGridPackagingPart();
          }, 1000);
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.getPackagingPartDataDown = () => {
        vm.pagingInfoPackagingPart.Page = vm.pagingInfoPackagingPart.Page + 1;
        vm.cgBusyLoading = ComponentFactory.getComponentPackgingParts().query(vm.pagingInfoPackagingPart).$promise.then((response) => {
          vm.sourceDataPackagingPart = vm.sourceDataPackagingPart.concat(response.data.packagingParts);
          vm.currentdataPackagingPart = vm.sourceDataPackagingPart ? vm.sourceDataPackagingPart.length : null;
          vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
          $timeout(() => {
            vm.resetSourceGridPackagingPart();
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalPackagingPartSourceDataCount !== vm.currentdata ? true : false);
          });
        }).catch((error) => BaseService.getErrorLog(error));
      };

      // start component packaging alias region
      const getComponentPackagingAliasDetail = (item) => {
        if (item) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.ADD_PACKING_ALIAS_CONFIRMATION_BODY_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, item.mfgPN);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              const validationPromise = [checkPackagingAliasValidations(item)];
              $scope.$parent.vm.cgBusyLoading = $q.all(validationPromise).then((responses) => {
                var res = _.find(responses, (response) => response === false);
                if (res !== false) {
                  $scope.ComponentPackagingAlias = item;
                  saveComponentPackagingAlias();
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => {
            // Cancel
          });
        }
      };
      //Check on Add Alternate Parts
      function checkPackagingAliasValidations(item) {
        var componentObj = {
          toPartId: vm.cid,
          fromPartId: item.id,
          typeId: CORE.ComponentValidationPartType.PackagingAlias
        };
        return $scope.$parent.vm.cgBusyLoading = ComponentFactory.checkAlternateAliasValidations().query(componentObj).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            return true;
          }
          else {
            return false;
          }
        }).catch(() => false);
      }
      /* save  component packaging detail into database */
      function saveComponentPackagingAlias() {
        const componentInfo = {
          PID: $scope.ComponentPackagingAlias.PID,
          componetID: $scope.ComponentPackagingAlias.id,
          mfgPN: $scope.ComponentPackagingAlias.mfgPN,
          aliasgroupID: $scope.ComponentPackagingAlias.packaginggroupID,
          parentComponentID: vm.cid,
          parentPackaginggroupID: vm.partDetail.packaginggroupID
        };
        $scope.$parent.vm.cgBusyLoading = ComponentFactory.createPackagingAlias().query({ componentObj: componentInfo }).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS && res.data) {
            if (res.data && res.data.assemblyList) {
              DialogFactory.dialogService(
                USER.ADMIN_BOM_ACTIVITY_STARTED_ASSEMBLY_LIST_POPUP_CONTROLLER,
                USER.ADMIN_BOM_ACTIVITY_STARTED_ASSEMBLY_LIST_POPUP_VIEW,
                null,
                res.data.assemblyList
              ).then(() => {
                // success
              }, () => {
                // calcel
              });
            }
            else {
              if (res.data.aliasgroupID) {
                vm.partDetail.packaginggroupID = res.data.aliasgroupID;
              }
              $scope.$broadcast(vm.autoCompletePackagingAlias.inputName, null);
              BaseService.reloadUIGrid(vm.gridOptionsPackagingPart, vm.pagingInfoPackagingPart, iniPackagingParttPageInfo, vm.loadDataPackagingPart);
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }

      vm.addPackagingAliasPart = (event) => {
        vm.partDetail.mfgCode = vm.partDetail.mfgCodemst ? vm.partDetail.mfgCodemst.mfgCode : null;
        vm.partDetail.manufacturerName = vm.partDetail.mfgCodemst ? vm.partDetail.mfgCodemst.mfgName : null;
        vm.partDetail.rohsComplientConvertedValue = vm.partDetail.rohsName;
        vm.partDetail.mfgType = vm.partDetail.mfgCodemst.mfgType;
        DialogFactory.dialogService(
          USER.ADMIN_COMPONENT_ADD_PACKAGING_ALIAS_POPUP_CONTROLLER,
          USER.ADMIN_COMPONENT_ADD_PACKAGING_ALIAS_POPUP_VIEW,
          event,
          vm.partDetail).then(() => {
            BaseService.reloadUIGrid(vm.gridOptionsPackagingPart, vm.pagingInfoPackagingPart, iniPackagingParttPageInfo, vm.loadDataPackagingPart);
          }, (data) => {
            if (data) {
              //  BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
            }
          }, (err) => BaseService.getErrorLog(err));
      };
      /*---------------------------- [E] - Packaging Part List  ----------------------------*/

      /* Open popup for display history of entry change */
      vm.showVersionHistory = (row, componentId, ev) => {
        BaseService.showVersionHistory(row, componentId, ev);
      };

      $scope.$on('$destroy', () => {
        stateChangeSuccessCall();
      });
    }
  }
})();
