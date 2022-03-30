(function () {
  'use strict';

  angular
    .module('app.admin.component')
    .controller('ComponentController', ComponentController);

  /** @ngInject */
  function ComponentController($timeout, $mdDialog, $scope, $rootScope, $state, $location, $stateParams, $q, $filter, USER, CORE, ComponentFactory, BaseService, DialogFactory, MasterFactory,
    PartCostingFactory, NotificationFactory, socketConnectionService, RFQTRANSACTION, APIVerificationErrorPopupFactory, RFQSettingFactory, BOMFactory, PRICING, TRANSACTION, ImportBOMFactory) {
    var vm = this;
    vm.isUpdatable = true;
    vm.popoverPlacement = 'left';
    vm.showUMIDHistory = true;
    vm.isAssyAtGlance = true;
    vm.isDeleteFeatureBased = true;
    vm.isCreateDuplicatePart = true;
    vm.keywords = null;
    vm.headerSearchKeywords = null;
    vm.isCopyPart = true;
    vm.isDeleteBOM = true;
    vm.isGoToBOM = true;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.COMPONENT;
    vm.SupplierEmptyMesssage = USER.ADMIN_EMPTYSTATE.SUPPLIER_COMPONENT;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.DefaultDateTimeFormat = _dateTimeDisplayFormat;
    vm.CustomPartGridHeaderDropdown = CORE.CustomPartGridHeaderDropdown;
    vm.CPNGridHeaderDropdown = CORE.CPNGridHeaderDropdown;
    vm.HazmatMaterialGridHeaderDropdown = CORE.HazmatMaterialGridHeaderDropdown;
    vm.ReceiveBulkItemGridHeaderDropdown = CORE.ReceiveBulkItemGridHeaderDropdown;
    vm.KeywordStatusGridHeaderDropdown = CORE.KeywordStatusGridHeaderDropdown;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.gridMfgPartList = CORE.gridConfig.gridMfgPartList;
    vm.gridMfgPartList = CORE.gridConfig.gridMfgPartList;
    vm.gridSupplierPartList = CORE.gridConfig.gridSupplierPartList;
    vm.componentverify = true;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.mfgType = $stateParams.mfgType ? $filter('lowercase')($stateParams.mfgType) : null;
    vm.tabName = $stateParams.tabName ? $stateParams.tabName : USER.PartMasterTabs.Detail.Name;
    vm.advancedFilterOptions = [];
    vm.loginUser = BaseService.loginUser;
    vm.actionButtonName = 'History';
    vm.PartType = CORE.PartType;
    //vm.isDataFields = true;
    vm.entityID = CORE.AllEntityIDS.Component.ID;
    vm.setScrollClass = 'gridScrollHeight_Component';
    //vm.isNoDataFound = true;
    vm.isGridVisible = false;
    vm.mfgTypeList = CORE.MFG_TYPE;
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.mfgTypeName = vm.mfgType && (vm.mfgType.toUpperCase() === vm.mfgTypeList.DIST) ? vm.LabelConstant.MFG.Supplier : vm.LabelConstant.MFG.MFG;
    /*get component status class name from base service*/
    vm.getcompStatusClassName = (statusID) => BaseService.getcompStatusClassName(statusID);
    /*get Rohs status class name from base service*/
    vm.getRohsStatusClassName = (statusId) => BaseService.getRohsStatusClassName(statusId);
    vm.inActivePartStatus = CORE.PartStatusList.InActiveInternal;
    //vm.packagingList = [{ id: null, value: 'All' }];
    vm.gridOptions = {};
    vm.attributesSearchHeader = '';
    vm.filteredMfgCodeList = [{ id: null, mfgCode: 'All' }];
    vm.filteredMfgCodeForSupplierPartsList = [{ id: null, mfgCode: 'All' }];
    vm.filteredPartStatusList = [{ id: null, name: 'All' }];
    vm.filteredPackagingList = [{ id: null, value: 'All' }];
    vm.filteredPackageCaseListForFilters = [{ id: null, value: 'All' }];
    vm.filteredFunctionalTypeList = [{ id: null, partTypeName: 'All' }];
    vm.filteredMountingTypeList = [{ id: null, name: 'All' }];
    vm.filteredPartTypeList = [{ id: null, Value: 'All' }];
    vm.filteredRoHSList = [{ id: null, Value: 'All' }];
    vm.filteredExternalRoHSList = [{ id: null, Value: 'All' }];
    vm.filteredStandardsList = [{ id: null, Value: 'All' }];
    vm.filteredCountryList = [{ id: null, Value: 'All' }];
    vm.filteredOperationalAttributeList = [{ id: null, Value: 'All' }];
    vm.filteredExternalFunctionalTypeList = [{ functionalCategoryText: null }];
    vm.filteredExternalMountingTypeList = [{ mountingTypeText: null }];
    vm.filteredAssemblyTypeList = [{ id: null, Value: 'All' }];
    vm.quoteProgressGridHeaderDropdown = CORE.RFQQuoteProgressGridHeaderDropdown;
    vm.rfqSubmittedStatus = _.find(vm.quoteProgressGridHeaderDropdown, { id: 'Submitted' }).value;
    vm.rfqCompletedStatus = _.find(vm.quoteProgressGridHeaderDropdown, { id: 'Completed' }).value;
    vm.WaterSolubleGridHeaderDropdown = CORE.WaterSolubleGridHeaderDropdown;
    vm.NoCleanGridHeaderDropdown = CORE.NoCleanGridHeaderDropdown;
    vm.transactionType = TRANSACTION.StartStopActivityTransactionType;
    vm.actionType = TRANSACTION.StartStopActivityActionType;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
    vm.SortByCriteria = '';

    function active() {
      vm.searchObj = $location.search();
      if (vm.searchObj && vm.searchObj.keywords) {
        vm.keywords = decodeURIComponent(vm.searchObj.keywords);
      } else if (vm.searchObj && vm.searchObj.headersearchkeywords) {
        vm.attributesSearchHeader = decodeURIComponent(vm.searchObj.headersearchkeywords);
        if (vm.searchObj.functionaltype && vm.searchObj.mountingtype) {
          vm.groupSearchData = {
            functionalCategoryID: parseInt(vm.searchObj.functionaltype),
            mountingTypeID: parseInt(vm.searchObj.mountingtype),
            groupName: vm.searchObj.groupname
          };
        }
      }
    }
    active();

    let reTryCount = 0;
    const getAllRights = () => {
      vm.updatePartsAttributesFeature = BaseService.checkFeatureRights(CORE.FEATURE_NAME.UpdatePartsAttributes);
      vm.isDeleteFeatureEnable = BaseService.checkFeatureRights(CORE.FEATURE_NAME.DeletePart);
      vm.stopExternalPartUpdateFeature = BaseService.checkFeatureRights(CORE.FEATURE_NAME.StopExternalPartUpdate);
      if ((!vm.updatePartsAttributesFeature) && reTryCount < _configGetFeaturesRetryCount) {
        reTryCount++;
        getAllRights(); //put for hard reload option as it will not get data from feature rights
      }
    };

    // on state change success for select index of tabs
    $scope.$on('$stateChangeSuccess', () => {
      $timeout(() => {
        getAllRights();
      }, _configWOTimeout);
    });

    //// on reload
    //let stateChangeSuccessCall = $scope.$on('$viewContentLoaded', function () {
    //  $timeout(() => {
    //    getAllRights();
    //  }, _configWOTimeout);
    //});


    /*get mfg code list for filter dropdown*/
    const mfgCodeDetail = (insertedDataFromPopup, IsMFG) => {
      getRoHSList(IsMFG);
    };

    /* unit dropdown fill up */
    function getUomlist() {
      return ComponentFactory.getUOMsList().query().$promise.then((res) => {
        vm.uomlist = [{ id: undefined, value: 'All' }];
        if (res && res.data) {
          _.each(res.data, (item) => {
            var obj = {
              id: item.unitName,
              value: item.unitName
            };
            vm.uomlist.push(obj);
          });
        }
        return true;
      }).catch((error) => BaseService.getErrorLog(error));
    }
    // get Component MSL List
    function getComponentMSLList() {
      return MasterFactory.getComponentMSLList().query().$promise.then((mslList) => {
        vm.componentMSLList = [{ id: undefined, value: 'All' }];
        if (mslList && mslList.data) {
          _.each(mslList.data, (item) => {
            var dispValue = item.levelRating + ' (' + item.time + ')';
            var obj = {
              id: dispValue,
              value: dispValue
            };
            vm.componentMSLList.push(obj);
          });
        }
        return true;
      }).catch((error) => BaseService.getErrorLog(error));
    }
    function getBusinessRisk() {
      vm.businessRisk = [{ id: undefined, value: 'All' }];
      _.each(CORE.BusinessRisk, (item) => {
        var obj = {
          id: item,
          value: item
        };
        vm.businessRisk.push(obj);
      });
    }
    getBusinessRisk();

    function getPackaging() {
      return PartCostingFactory.getPackaging().query().$promise.then((packaging) => {
        vm.packagingList = [{ id: undefined, value: 'All' }];
        vm.packagingListForFilters = [];
        if (packaging && packaging.data) {
          _.each(packaging.data, (item) => {
            vm.packagingList.push(
              {
                id: item.name,
                value: item.name
              }
            );
            vm.packagingListForFilters.push(
              {
                id: item.id,
                value: item.name
              }
            );
          });
        }
        return true;
      }).catch((error) => BaseService.getErrorLog(error));
    }
    function getPackageCase() {
      return ComponentFactory.getPackageCaseTypeList().query().$promise.then((packageDet) => {
        vm.packageCaseList = [{ id: undefined, value: 'All' }];
        vm.packageCaseListForFilters = [];
        if (packageDet && packageDet.data) {
          _.each(packageDet.data, (item) => {
            vm.packageCaseList.push(
              {
                id: item.name,
                value: item.name
              }
            );
            vm.packageCaseListForFilters.push(
              {
                id: item.id,
                value: item.name
              }
            );
          });
        }
        return true;
      }).catch((error) => BaseService.getErrorLog(error));
    };
    /* connecterType dropdown fill up */
    function connecterType() {
      return ComponentFactory.getConnecterTypeList().query().$promise.then((res) => {
        vm.connecterTypeList = [{ id: null, value: 'All' }];
        if (res && res.data) {
          _.each(res.data, (item) => {
            var obj = {
              id: item.name,
              value: item.name
            };
            vm.connecterTypeList.push(obj);
          });
        }
        return true;
      }).catch((error) => BaseService.getErrorLog(error));
    }
    function getPartStatusList() {
      return RFQSettingFactory.getPartStatusList().query().$promise.then((partstatus) => {
        vm.partStatusList = [{ id: null, value: 'All' }];
        if (partstatus && partstatus.data) {
          _.each(partstatus.data, (item) => {
            var obj = {
              id: item.name,
              value: item.name
            };
            vm.partStatusList.push(obj);
          });
        }
        return true;
      }).catch((error) => BaseService.getErrorLog(error));
    };
    // get RoHS List
    function getRoHSList(IsMFG) {
      return MasterFactory.getRohsList().query().$promise.then((requirement) => {
        vm.RohsList = [{ id: undefined, value: 'All' }];
        vm.rohsListForFilters = [];
        if (requirement && requirement.data) {
          _.each(requirement.data, (item) => {
            var obj = {
              id: item.name,
              value: item.name
            };
            vm.RohsList.push(obj);
            vm.rohsListForFilters.push({
              id: item.id,
              value: item.name
            });
          });
        }
        //loadsource(IsMFG);
        const validationPromise = [getUomlist(), getComponentMSLList(), getPackaging(), getPackageCase(), connecterType(), getPartStatusList()];
        vm.cgBusyLoading = $q.all(validationPromise).then(() => {
          loadsource(IsMFG);
          vm.showFilters = true;
        }).catch((error) => BaseService.getErrorLog(error));
      }).catch((error) => BaseService.getErrorLog(error));
    }

    vm.openDataSheetLink = (link) => {
      BaseService.openURLInNew(link);
    };
    vm.goToComponentDetail = (mfgType, partId) => {
      if (mfgType) {
        mfgType = mfgType.toLowerCase();
      }
      BaseService.goToComponentDetailTab(mfgType, partId, USER.PartMasterTabs.Detail.Name);
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

    vm.editCustomer = (id) => BaseService.goToCustomer(id);

    const PIDCodeObject =
    {
      field: 'PIDCode',
      displayName: 'PID Code',
      width: CORE.UI_GRID_COLUMN_WIDTH.PID,
      cellTemplate: '<div class="ui-grid-cell-contents"  ng-class="{\'inactive-part\': (row.entity.partStatus === grid.appScope.$parent.vm.inActivePartStatus) }"><common-pid-code-label-link component-id="row.entity.id"\
                                             label="grid.appScope.$parent.vm.LabelConstant.MFG.PID"\
                                             value="COL_FIELD"\
                                             is-copy="true"\
                                             is-good-part="row.entity.isGoodPart" \
                                             is-search-findchip="false"\
                                             is-search-digi-key="false"\
                                             is-custom-part="row.entity.isCustom"\
                                             restrict-use-permanently="row.entity.restrictUsePermanently" \
                                             restrict-use-with-permission="row.entity.restrictUSEwithpermission" \
                                             restrict-packaging-use-permanently="row.entity.restrictPackagingUsePermanently" \
                                             restrict-packaging-use-with-permission="row.entity.restrictPackagingUseWithpermission" \
                                             redirection-disable="row.entity.isDisabledUpdate"\>\
                      </common-pid-code-label-link></div>',
      enableFiltering: true,
      enableSorting: true,
      allowCellFocus: false
    };
    const AliasMFGCode =
    {
      field: 'AliasMFGCode',
      //displayName: vm.LabelConstant.MFG.MFGCode,
      displayName: vm.LabelConstant.MFG.MFG + ' Name',
      width: 120,
      //cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                                            <a class="cm-text-decoration underline"\
                                                ng-click="grid.appScope.$parent.vm.editManufacturer(grid.appScope.$parent.vm.mfgTypeList.MFG,row.entity.AliasMFGCodeID);"\
                                                tabindex="-1">{{COL_FIELD}}</a>\
                                        </div>',
      enableFiltering: true,
      enableSorting: true,
      allowCellFocus: false
    };
    const AliasMFGPN =
    {
      field: 'AliasMFGPN',
      displayName: vm.LabelConstant.MFG.MFGPN,
      width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
      cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link component-id="row.entity.AliascompID"\
                                             label="grid.appScope.$parent.vm.LabelConstant.MFG.MFGPN"\
                                             value="COL_FIELD"\
                                             is-copy="true"\
                                              is-good-part="row.entity.isGoodPart"\
                                             is-supplier="false"\
                                             is-custom-part="row.entity.isCustom"\
                                             restrict-use-permanently="row.entity.restrictUsePermanently" \
                                             restrict-use-with-permission="row.entity.restrictUSEwithpermission" \
                                             restrict-packaging-use-permanently="row.entity.restrictPackagingUsePermanently" \
                                             restrict-packaging-use-with-permission="row.entity.restrictPackagingUseWithpermission" \
                                             redirection-disable="row.entity.isDisabledUpdate">\
                      </common-pid-code-label-link></div>',
      enableFiltering: true,
      enableSorting: true,
      allowCellFocus: false
    };
    const PartStockColumn =
    {
      field: 'partStock',
      displayName: 'Stock',
      width: 100,
      cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">\
                                            <a class="cm-text-decoration underline"\
                                                ng-click="grid.appScope.$parent.vm.goToComponentUMIDList(row.entity.mfgType,row.entity.id);"\
                                                tabindex="-1">{{COL_FIELD | numberWithoutDecimal}}</a>\
                                        </div>',
      enableFiltering: true,
      enableSorting: true,
      allowCellFocus: false,
      isConditionallyVisibleColumn: true,
      isMenuItemDisabled: true,
      menuDisabledHint: 'Apply Sort by Stock criteria to enable'
    };
    const PartUsageColumn =
    {
      field: 'partUsage',
      displayName: 'Usage',
      width: 100,
      cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
      enableFiltering: true,
      enableSorting: true,
      allowCellFocus: false,
      isConditionallyVisibleColumn: true,
      isMenuItemDisabled: true,
      menuDisabledHint: 'Apply Sort by Usage criteria to enable'
    };

    const EcoDfmColumn =
    {
      field: 'activeEcoDfmCount',
      displayName: 'Active ' + vm.LabelConstant.Workorder.ECO_DFM_COMMON_LABEL,
      width: 100,
      cellTemplate: '<div class="ui-grid-cell-contents-break grid-cell-text-right cursor-pointer underline padding-right-10"\
                          ng-if="row.entity.activeEcoDfmCount && row.entity.activeEcoDfmCount > 0">\
                            <a ng-click="grid.appScope.$parent.vm.openEcoDfmTab(row.entity,$event)">\
                            <span>{{COL_FIELD | numberWithoutDecimal}}\</span>\
                            <md-tooltip>View '+ vm.LabelConstant.Workorder.ECO_DFM_COMMON_LABEL + '</md-tooltip>\
                          </a></div>',
      enableFiltering: true,
      enableSorting: true,
      allowCellFocus: false,
      isConditionallyVisibleColumn: true,
      isMenuItemDisabled: true,
      menuDisabledHint: 'Select Assembly/Sales Kit in Part Type filter to enable'
    };

    const bomActivityColumn =
    {
      field: 'activityStartTime',
      width: '150',
      displayName: 'Activity Started From (HH:MM:SS)',
      type: 'date',
      cellTemplate: '<div class="ui-grid-cell-contents text-center flex layout-align-center-center" ng-if="row.entity.isActivityStart && row.entity.currentTimerDiff"><label flex="100" layout-align="start center" layout="row" class="label-box label-warning">{{row.entity.currentTimerDiff}}</label><img class="ml-5 h-22 w-22" src="../../../../../assets/images/logos/stop.png" ng-click="grid.appScope.$parent.vm.stopBOMActivity(row.entity);" title="Stop Activity"></div>',
      enableFiltering: false,
      exporterSuppressExport: true
    };

    if (vm.mfgType === CORE.MFG_TYPE.MFG.toLowerCase()) {
      vm.IsManfucaturer = true;
      vm.IsDistributor = false;
      vm.selectedIndex = 0;
      mfgCodeDetail(null, vm.IsManfucaturer);
      //loadsource(vm.IsManfucaturer);
    } else {
      vm.IsManfucaturer = false;
      vm.IsDistributor = true;
      vm.selectedIndex = 1;
      mfgCodeDetail(null, vm.IsManfucaturer);
      //loadsource(vm.IsManfucaturer);
    }
    /*call source header in function so manufacture list can bind and append in header filter*/
    function loadsource(IsMFG) {
      if (IsMFG) {
        vm.IsManfucaturer = true;
        vm.IsDistributor = false;
      }
      else {
        vm.IsManfucaturer = false;
        vm.IsDistributor = true;
      }
      vm.sourceHeader = [
        {
          field: 'Action',
          cellClass: 'layout-align-center-center',
          displayName: 'Action',
          width: '210',
          cellTemplate: '<grid-action-view grid="grid" row="row" number-of-action-button="5"></grid-action-view>',
          //cellTemplate: `<grid-action-view grid="grid" row="row" style="\overflow: hidden;padding:0px !important;overflow: hidden; white-space: nowrap;\" class="height-grid ui-grid-cell-contents"></grid-action-view>`,
          enableFiltering: false,
          enableSorting: false,
          exporterSuppressExport: true,
          pinnedLeft: true
        },
        {
          field: '#',
          displayName: '#',
          width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
          cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
          enableFiltering: false,
          enableSorting: false,
          allowCellFocus: false
        },
        {
          field: 'serialNumber',
          width: 130,
          displayName: 'SystemID',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'imageURL',
          width: 80,
          displayName: 'Image',
          cellTemplate: '<div class="ui-grid-cell-contents">'
            + '<img class="cm-grid-images image-popover" ng-src="{{COL_FIELD}}"'
            + ' uib-popover-template="\'imagePreviewTemplate.html\'" '
            + ' popover-trigger="\'mouseenter\'" '
            + ' popover-append-to-body ="true" '
            + ' popover-class= "width-400 height-400 cm-center-screen-location cm-component-img" '
            + ' popover-placement="{{grid.appScope.$parent.vm.popoverPlacement}}" '
            + ' /> </div>',
          exporterSuppressExport: true,
          enableFiltering: false,
          enableSorting: false,
          allowCellFocus: false
        },
        {
          field: 'uploadedSamplePicturesCount',
          width: 100,
          displayName: 'Sample Images',
          cellTemplate: '<div class="ui-grid-cell-contents-break grid-cell-text-right cursor-pointer underline">\
                            <a ng-if="row.entity.uploadedSamplePicturesCount && row.entity.uploadedSamplePicturesCount > 0"\
                                ng-click="grid.appScope.$parent.vm.openDocumentTab(row.entity,$event)">\
                            <span>{{COL_FIELD | numberWithoutDecimal}}\</span>\
                            <md-tooltip>View Sample Images</md-tooltip>\
                          </a></div>'
        },
        {
          field: 'mfgCode',
          displayName: IsMFG ? vm.LabelConstant.MFG.MFG : vm.LabelConstant.MFG.Supplier,
          width: 120,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                                            <a class="cm-text-decoration underline" \
                                                ng-click="grid.appScope.$parent.vm.editManufacturer(row.entity.mfgType,row.entity.mfgcodeID);"\
                                                tabindex="-1">{{COL_FIELD}}</a>\
                                        </div>',
          allowCellFocus: false
        },
        {
          field: 'mfgCode',
          displayName: vm.LabelConstant.MFG.CustomerCode,
          width: 120,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                                            <a class="cm-text-decoration underline" ng-if="row.entity.isCustOrDisty > 0" \
                                                ng-click="grid.appScope.$parent.vm.editCustomer(row.entity.mfgcodeID);"\
                                                tabindex="-1">{{COL_FIELD}}</a>\
                                        </div>',
          allowCellFocus: false
        },
        {
          field: 'mfrNameText',
          width: 200,
          displayName: 'MFR (External)',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'mfgPN',
          width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
          displayName: IsMFG ? vm.LabelConstant.MFG.MFGPN : vm.LabelConstant.MFG.SupplierPN,
          cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link component-id="row.entity.id"\
                                             label="grid.appScope.$parent.vm.IsManfucaturer ? grid.appScope.$parent.vm.LabelConstant.MFG.MFGPN : grid.appScope.$parent.vm.LabelConstant.MFG.SupplierPN"\
                                             value="COL_FIELD"\
                                             is-copy="true"\
                                             is-good-part="row.entity.isGoodPart" \
                                             is-custom-part="grid.appScope.$parent.vm.PartType.Other==row.entity.partType?true:row.entity.isCustom"\
                                             rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.rohsIcon"\
                                             rohs-status="row.entity.rohsComplientConvertedValue"\
                                             has-sub-assembly="row.entity.subAssemblyCount"\
                                             is-search-digi-key="true"\
                                             is-supplier="grid.appScope.$parent.vm.IsManfucaturer? false: true"\
                                             restrict-use-permanently="row.entity.restrictUsePermanently" \
                                             restrict-use-with-permission="row.entity.restrictUSEwithpermission" \
                                             restrict-packaging-use-permanently="row.entity.restrictPackagingUsePermanently" \
                                             restrict-packaging-use-with-permission="row.entity.restrictPackagingUseWithpermission" \
                                             redirection-disable="row.entity.isDisabledUpdate">\
                      </common-pid-code-label-link></div>',
          allowCellFocus: false
        },
        {
          field: 'nickName',
          width: 100,
          displayName: 'Nick Name',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'custAssyPN',
          width: '320',
          displayName: 'Part#',
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
          field: 'dataSheetLink',
          width: 120,
          displayName: 'Data Sheet Link',
          //cellTemplate: '<a class="ui-grid-cell-contents text-left cursor-pointer" ng-class="{\'cursor-not-allow\':row.entity.dataSheetLink == null}" ng-click="grid.appScope.$parent.vm.openDataSheetLink(row.entity.dataSheetLink)">{{COL_FIELD}}</a>',
          cellTemplate: '<a class="ui-grid-cell-contents text-left cursor-pointer" ng-if="(row.entity.dataSheetLink != \'null\' && row.entity.dataSheetLink)" href="{{grid.appScope.$parent.vm.getDataSheetLink(row.entity)}}" target="_blank">Click Here</a>',
          enableSorting: true,
          enableFiltering: false
        },
        {
          field: 'mfgPNDescription',
          width: 250,
          //displayName: IsMFG ? 'MFG Description' : 'Supplier Description',
          displayName: vm.LabelConstant.MFG.MFGPNDescription,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'detailDescription',
          width: 250,
          displayName: 'Detailed Description',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'specialNote',
          width: 250,
          displayName: 'Special Note',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'purchasingComment',
          width: 100,
          displayName: 'Purchasing Comment',
          //cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
          cellTemplate: '<a class="cm-text-decoration underline" ng-if="row.entity.purchasingComment"\
                                ng-click="grid.appScope.$parent.vm.viewPurchaseComment(row, $event);"\
                                tabindex="-1">View</a>'
        },
        {
          field: 'packagingName',
          displayName: 'Packaging',
          width: 150,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.packagingList
          },
          allowCellFocus: false,
          ColumnDataType: 'StringEquals'
        },
        {
          field: 'partStatusValue',
          displayName: 'Part Status (Internal)',
          width: 100,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.partStatusList
          },
          ColumnDataType: 'StringEquals'
        },
        {
          field: 'partStatusText',
          width: 100,
          displayName: 'Part Status (External)',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'functionalCategoryText',
          width: 120,
          displayName: 'Functional Type (External)',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'functionalCategoryName',
          width: 120,
          displayName: 'Functional Type (Internal)',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-class="{\'cm-input-color-red\' :row.entity.functionalCategoryID==-1}">{{COL_FIELD}}</div>'
        },
        {
          field: 'mountingTypeText',
          width: 120,
          displayName: 'Mounting Type (External)',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'mountingTypeName',
          width: 120,
          displayName: 'Mounting Type (Internal)',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-class="{\'cm-input-color-red\' :row.entity.mountingTypeID==-1}">{{COL_FIELD}}</div>'
        },
        {
          field: 'isCustomValue',
          displayName: 'Custom Part',
          width: 120,
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.isCustom == 1,\
                            \'label-warning\':row.entity.isCustom == 0}"> \
                                {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.CustomPartGridHeaderDropdown
          },
          ColumnDataType: 'StringEquals',
          enableFiltering: true,
          enableSorting: false
        },
        {
          field: 'isCPNValue',
          displayName: vm.LabelConstant.MFG.CPN,
          width: 100,
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.isCPN == 1,\
                            \'label-warning\':row.entity.isCPN == 0}"> \
                                {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.CPNGridHeaderDropdown
          },
          ColumnDataType: 'StringEquals',
          enableFiltering: true,
          enableSorting: false
        },
        {
          field: 'categoryName',
          displayName: 'Part Type',
          width: 120,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'epicorType',
          displayName: 'Purchase Type',
          width: 120,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'assemblyTypeName',
          displayName: vm.LabelConstant.MFG.AssyType,
          width: 250,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'supplier',
          width: 100,
          displayName: 'Source',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'operatingTemp',
          width: 150,
          displayName: 'Operating Temperature (°C)',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'minOperatingTemp',
          width: 130,
          displayName: 'Min Operating Temperature (°C)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>'
        },
        {
          field: 'maxOperatingTemp',
          width: 130,
          displayName: 'Max Operating Temperature (°C)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>'
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
          field: 'noOfPosition',
          width: 120,
          displayName: vm.LabelConstant.MFG.noOfPosition,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>'
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
          field: 'tolerance',
          width: 120,
          displayName: 'Tolerance',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'voltage',
          width: 120,
          displayName: 'Voltage',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'value',
          width: 120,
          displayName: 'Value',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'partPackage',
          width: 130,
          displayName: 'Package/Case(Shape) (External)',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'packageCaseTypeValue',
          displayName: 'Package/Case(Shape) Type',
          width: 130,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.packageCaseList
          },
          allowCellFocus: false,
          ColumnDataType: 'StringEquals'
        },
        {
          field: 'powerRating',
          width: 120,
          displayName: 'Power (Watts)',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'weight',
          width: 120,
          displayName: 'Weight',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'feature',
          width: 120,
          displayName: 'Feature',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
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
          field: 'color',
          width: 120,
          displayName: 'Color',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'scrapValuePerBuild',
          width: 120,
          displayName: 'Scrap Rate (Per Build)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>'
        },
        {
          field: 'scrapRatePercentagePerBuild',
          width: 120,
          displayName: 'Scrap Rate (Per Build) (%)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>'
        },
        {
          field: 'plannedValuePerBuild',
          width: 170,
          displayName: 'Planned Overrun (Per Build)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>'
        },
        {
          field: 'plannedOverRunPercentagePerBuild',
          width: 170,
          displayName: 'Planned Overrun (Per Build) (%)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>'
        },
        {
          field: 'selfLifeDays',
          width: 120,
          displayName: vm.LabelConstant.MFG.ShelfLifeDays,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>'
        },
        {
          field: 'shelfListDaysThresholdPercentage',
          width: 120,
          displayName: vm.LabelConstant.MFG.ShelfLifeDaysPer,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>'
        },
        {
          field: 'maxPriceLimit',
          width: 120,
          displayName: 'Max. Price Limit',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>'
        },
        {
          field: 'maxQtyonHand',
          width: 120,
          displayName: 'Max. Qty on Hand',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>'
        },
        {
          field: 'saftyStock',
          width: 120,
          displayName: 'Min. Qty (Safety Stock)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>'
        },
        {
          field: 'eau',
          width: 120,
          displayName: 'EAU',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>'
        },
        {
          field: 'businessRisk',
          displayName: 'Business Risk',
          width: 150,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.businessRisk
          },
          allowCellFocus: false
        },
        {
          field: 'deviceMarking',
          width: 100,
          displayName: 'Device Marking',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'minimum',
          width: 100,
          displayName: 'Min',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>'
        },
        {
          field: 'mult',
          width: 100,
          displayName: 'Mult',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>'
        },
        {
          field: 'packageQty',
          width: 100,
          displayName: 'SPQ',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>'
        },
        {
          field: 'unitName',
          width: 100,
          displayName: 'UOM (Internal)',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.uomlist
          },
          ColumnDataType: 'StringEquals',
          allowCellFocus: false
        },
        {
          field: 'uomText',
          width: 100,
          displayName: 'UOM (External)',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'pcbPerArray',
          width: 100,
          displayName: 'PCB Per Array',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'grossWeight',
          width: 100,
          displayName: 'Unit Gross Weight',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'packagingWeight',
          width: 100,
          displayName: 'Unit Net Weight',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'ltbDate',
          displayName: vm.LabelConstant.MFG.LtbDate,
          type: 'date',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
          enableFiltering: false,
          enableSorting: false
        },
        {
          field: 'eolDate',
          displayName: vm.LabelConstant.MFG.EolDate,
          type: 'date',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
          enableFiltering: false,
          enableSorting: false
        },
        {
          field: 'leadTime',
          width: 150,
          displayName: 'Std. Lead Time (In week)',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'rohsComplientConvertedValue',
          width: '100',
          displayName: 'RoHS Status  (Internal)',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-class="{\'cm-input-color-red\' :row.entity.RoHSStatusID==-1}">{{COL_FIELD}}</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.RohsList
          },
          allowCellFocus: false
        },
        {
          field: 'rohsText',
          width: 100,
          displayName: 'RoHS Status (External)',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'mslName',
          displayName: 'MSL',
          width: 120,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.componentMSLList
          },
          ColumnDataType: 'StringEquals',
          enableFiltering: true,
          enableSorting: false
        },
        {
          field: 'isGoodPart',
          displayName: 'Correct Part',
          width: 150,
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.isGoodPartValue == \'Correct Part\',\
                            \'label-warning\':row.entity.isGoodPartValue == \'Incorrect Part\',\
                            \'label-danger\':row.entity.isGoodPartValue == \'TBD Part\'}"> \
                                {{row.entity.isGoodPartValue}}'
            + '</span>'
            + '</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: CORE.CorrectPartGridHeaderDropdown
          },
          enableFiltering: true,
          enableSorting: false
        },
        {
          field: 'restrictPackagingUsePermanently',
          width: 350,
          displayName: 'Restriction Setting',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">'
            + '<div ng-if="row.entity.restrictPackagingUsePermanently">{{grid.appScope.$parent.vm.CORE_MESSAGE_CONSTANT.COMPONENT_VALIDATION_MESSAGES.RESTRICT_USE_EXCLUDING_PACKAGING_ALIAS_PERMANENTLY}}</div>'
            + '<div ng-if="row.entity.restrictPackagingUseWithpermission">{{grid.appScope.$parent.vm.CORE_MESSAGE_CONSTANT.COMPONENT_VALIDATION_MESSAGES.RESTRICT_USE_EXCLUDING_PACKAGING_ALIAS_WITH_PERMISSION}}</div>'
            + '<div ng-if="row.entity.restrictUsePermanently">{{grid.appScope.$parent.vm.CORE_MESSAGE_CONSTANT.COMPONENT_VALIDATION_MESSAGES.RESTRICT_USE_INCLUDING_PACKAGING_ALIAS_PERMANENTLY}}</div>'
            + '<div ng-if="row.entity.restrictUSEwithpermission">{{grid.appScope.$parent.vm.CORE_MESSAGE_CONSTANT.COMPONENT_VALIDATION_MESSAGES.RESTRICT_USE_INCLUDING_PACKAGING_ALIAS_WITH_PERMISSION}}</div>'
            + '</div>',
          enableFiltering: false,
          enableSorting: false
        },
        {
          field: 'certificatelist',
          width: 300,
          displayName: 'Standards',
          cellTemplate: '<div class="ui-grid-cell-contents"> '
            + '<div style="overflow: initial" class="label-box margin-left-2" '
            + ' ng-style = "{\'background-color\': standardItem.colorCode}" '
            + ' ng-repeat="standardItem in row.entity.partCertificationDetListWithNewLine track by $index"> '
            + ' {{standardItem.stdClassName}} '
            + ' </div> '
            + ' </div> ',
          enableFiltering: false,
          enableSorting: false
        }, {
          field: 'isExportControl',
          displayName: 'Export Controlled',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.isExportControl ==\'Yes\', \
                            \'label-warning\':row.entity.isExportControl == \'No\'}"> \
                                {{ COL_FIELD }}'
            + '</span>'
            + '</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.KeywordStatusGridHeaderDropdown
          },
          ColumnDataType: 'StringEquals',
          width: 120,
          enableCellEdit: false,
          enableFiltering: true
        },
        {
          field: 'obsoleteDate',
          width: 100,
          displayName: 'Obsolete Date',
          type: 'date',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
          enableFiltering: false,
          enableSorting: false
        },
        {
          field: 'reversalDate',
          width: 100,
          displayName: 'Reversal Date',
          type: 'date',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
          enableFiltering: false,
          enableSorting: false
        },
        {
          field: 'reversalPart',
          width: 100,
          displayName: 'Reversal Part',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.reversalPart ==\'Yes\', \
                            \'label-warning\':row.entity.reversalPart == \'No\'}"> \
                                {{ COL_FIELD }}'
            + '</span>'
            + '</div>'
        },
        {
          field: 'updatedAtApiValue',
          displayName: 'Last Cloud API Update Date',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
          type: 'datetime',
          enableFiltering: false
        },
        {
          field: 'frequencyName',
          displayName: 'Charge Frequency',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: 120
        },
        {
          field: 'isWaterSolubleConvertedValue',
          displayName: vm.LabelConstant.Operation.WaterSoluble,
          width: 120,
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.isWaterSoluble == 1,\
                            \'label-warning\':row.entity.isWaterSoluble == 0}"> \
                                {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.WaterSolubleGridHeaderDropdown
          },
          ColumnDataType: 'StringEquals',
          enableFiltering: true,
          enableSorting: false
        },
        {
          field: 'isNoCleanConvertedValue',
          displayName: vm.LabelConstant.Operation.NoClean,
          width: 120,
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.isNoClean == 1,\
                            \'label-warning\':row.entity.isNoClean == 0}"> \
                                {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.NoCleanGridHeaderDropdown
          },
          ColumnDataType: 'StringEquals',
          enableFiltering: true,
          enableSorting: false
        },
        {
          field: 'isHazmatMaterialValue',
          displayName: 'Hazmat Material',
          width: 120,
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.isHazmatMaterial == 1,\
                            \'label-warning\':row.entity.isHazmatMaterial == 0}"> \
                                {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.HazmatMaterialGridHeaderDropdown
          },
          ColumnDataType: 'StringEquals',
          enableFiltering: true,
          enableSorting: false
        }, {
          field: 'isReceiveBulkConvertedValue',
          displayName: 'Receive as a Bulk item',
          width: 120,
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.isReceiveBulkItem == 1,\
                            \'label-warning\':row.entity.isReceiveBulkItem == 0}"> \
                                {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.ReceiveBulkItemGridHeaderDropdown
          },
          ColumnDataType: 'StringEquals',
          enableFiltering: true,
          enableSorting: false
        }, {
          field: 'PurchaseCOA',
          displayName: 'Purchase COA',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-if="row.entity.purchaseacctId"><a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.updateChartOfAccounts(row.entity.purchaseacctId);">{{COL_FIELD}}</a></div>',
          width: '200'
        }, {
          field: 'SalesCOA',
          displayName: 'Sales COA',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-if="row.entity.salesacctId"><a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.updateChartOfAccounts(row.entity.salesacctId);">{{COL_FIELD}}</a></div>',
          width: '200'
        },
        {
          field: 'updatedAtValue',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
          type: 'datetime',
          enableFiltering: false
        }, {
          field: 'updatedbyValue',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          type: 'StringEquals',
          enableFiltering: true
        }, {
          field: 'updatedbyRoleValue',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          type: 'StringEquals',
          enableFiltering: true
        }, {
          field: 'createdbyRoleValue',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
          type: 'StringEquals',
          enableFiltering: true
        }, {
          field: 'createdbyValue',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
          type: 'StringEquals',
          enableFiltering: true
        }, {
          field: 'createdAtValue',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
          type: 'datetime',
          enableFiltering: false
        }
        , {
          field: 'SystemGeneratedValue',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_SYSTEM_GENERATED,
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" \
                  ng-class="{\'label-success\':row.entity.systemGenerated == true, \
                  \'label-warning\':row.entity.systemGenerated == false}"> \
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
        }
      ];

      if (IsMFG) {
        /*vm.IsManfucaturer = true;
        vm.IsDistributor = false;*/
        vm.sourceHeader.splice(5, 0, bomActivityColumn);
        vm.sourceHeader.splice(6, 0, PIDCodeObject);
        vm.sourceHeader.splice(14, 0, PartStockColumn);
        vm.sourceHeader.splice(15, 0, PartUsageColumn);
        vm.sourceHeader.splice(28, 0, EcoDfmColumn);
      }
      else {
        /*vm.IsManfucaturer = false;
        vm.IsDistributor = true;*/
        vm.sourceHeader.splice(8, 0, AliasMFGCode);
        vm.sourceHeader.splice(9, 0, AliasMFGPN);
        vm.sourceHeader.splice(12, 0, PartStockColumn);
        vm.sourceHeader.splice(13, 0, PartUsageColumn);
        vm.sourceHeader.splice(25, 0, EcoDfmColumn);
      }
      if (vm.keywords) {
        if (vm.advancedFilterOptions) {
          vm.advancedFilterOptions.attributesSearch = [];
          //vm.advancedFilterOptions.attributesSearch.push(vm.keywords.replace(/\"/g, '\\"').replace(/\'/g, "\\'"));
          vm.advancedFilterOptions.attributesSearch.push(vm.keywords.replace(/\"/g, '\\"').replace(/\'/g, '\\\''));
        }
        vm.isGridVisible = true;
      }
    }
    // init pagination details
    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        pageSize: CORE.UIGrid.ItemsPerPage(),
        SortColumns: [['id', 'DESC']],
        SearchColumns: []
      };
    };
    initPageInfo();
    vm.gridOptions = {
      enablePaging: isEnablePagination,
      enablePaginationControls: isEnablePagination,
      showColumnFooter: false,
      enableRowHeaderSelection: true,
      enableFullRowSelection: false,
      enableRowSelection: true,
      multiSelect: true,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      allowToExportAllData: true,
      //CurrentPage: CORE.PAGENAME_CONSTANT[9].PageName, // commented as per discussion with DV in receiving group for Bug 20565: System generated issues in part master[Icons and should not editable]
      exporterCsvFilename: vm.IsManfucaturer ? 'Manufacturer Part.csv' : 'Supplier Part.csv',
      hideMultiDeleteButton: true,
      showCloudUpdateButton: true,
      rowTemplate: '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.uid" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader, \'cm-part-restriction-bgcolor\': (row.entity.restrictPackagingUsePermanently || row.entity.restrictPackagingUseWithpermission || row.entity.restrictUsePermanently || row.entity.restrictUSEwithpermission) }" role="gridcell" ui-grid-cell="">',
      exporterAllDataFn: () => {
        const pagingInfoOld = _.clone(vm.pagingInfo);
        pagingInfoOld.pageSize = 0;
        pagingInfoOld.Page = 1;
        vm.gridOptions.isExport = pagingInfoOld.isExport = true;
        return ComponentFactory.retrieveComponentList().query(pagingInfoOld).$promise.then((response) => {
          if (response.data && response.data.components) {
            return response.data.components;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    // on tab chnage reset all data for new grid
    const resetDataOnTabChange = () => {
      vm.isNoDataFound = true;
      vm.sourceHeader = vm.sourceData = [];
      vm.currentdata = vm.totalSourceDataCount = 0;
      //mfgCodeDetail(null, IsMFG);
    };

    // On tab change filter data for parts
    vm.onTabChanges = (IsMFG, IsClick) => {
      if (vm.IsManfucaturer !== IsMFG) {
        resetDataOnTabChange(IsMFG);
      }
      vm.IsManfucaturer = false;
      vm.IsDistributor = false;
      if (IsClick) {
        vm.pagingInfo.SearchColumns = [];
        if (IsMFG) {
          vm.IsManfucaturer = true;
          vm.IsDistributor = false;
          $state.go(USER.ADMIN_MFG_COMPONENT_STATE);
        } else {
          vm.IsManfucaturer = false;
          vm.IsDistributor = true;
          $state.go(USER.ADMIN_DIST_COMPONENT_STATE);
        }
      }
    };

    vm.stopBOMActivity = (row) => {
      var messageContent = {};
      if (vm.loginUser.userid === row.activityStartBy || vm.loginUser.isUserSuperAdmin) {
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.BOM_STOP_FROM_RFQ_LIST_MESSAGE);
        if (vm.loginUser.userid === row.activityStartBy) {
          let message = '<br/><br/><table style=\'width:100%\'><thead><tr><th class=\'border-bottom padding-5\'>#</th><th class=\'border-bottom padding-5\'>' + vm.LabelConstant.Assembly.PIDCode + '</th></tr></thead><tbody>{0}</tbody></table>';
          const subMessage = '<tr><td class="border-bottom padding-5"> 1</td><td class="border-bottom padding-5">' + row.PIDCode + '</td></tr>';

          message = stringFormat(message, subMessage);
          messageContent.message = stringFormat(messageContent.message, message);
        }
        if (vm.loginUser.userid !== row.activityStartBy && vm.loginUser.isUserSuperAdmin) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.BOM_STOP_BY_SA_FROM_RFQ_LIST_MESSAGE);
          let message = '<br/><br/><table style=\'width:100%\'><thead><tr><th class=\'border-bottom padding-5\'>#</th><th class=\'border-bottom padding-5\'>' + vm.LabelConstant.Assembly.PIDCode + '</th><th class=\'border-bottom padding-5\'>Activity Started By</th></tr></thead><tbody>{0}</tbody></table>';
          const subMessage = '<tr><td class="border-bottom padding-5">1</td><td class="border-bottom padding-5">' + row.PIDCode + '</td><td class="border-bottom padding-5">' + row.activityStartedByUserName + '</td></tr>';
          message = stringFormat(message, subMessage);
          messageContent.message = stringFormat(messageContent.message, row.activityStartedByUserName, message);
        }
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };

        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            const dataObj = {
              refTransID: row.id,
              isActivityStart: false,
              transactionType: vm.transactionType[0].id,
              actionType: vm.actionType[0].id
            };
            vm.isStartAndStopRequestFromThisTab = true;
            vm.cgBusyLoading = BOMFactory.startStopBOMActivity().save(dataObj).$promise.then((response) => {
              if (response && response.data) {
                row.isActivityStart = false;
                row.currentTimerDiff = '';
              }
            }).catch((error) => {
              BaseService.getErrorLog(error);
            });
          }
        }, () => {
          // cancel
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        const alertModel = {
          messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.BOM_DIFFERENT_USER_STOP_MESSAGE
        };

        DialogFactory.messageAlertDialog(alertModel);
      }
    };

    //Start BOM Activity Timer to update running time
    function startBOMActivityTimer(isBOMActivityStarted) {
      if (vm.bomActivityTimer) {
        clearInterval(vm.bomActivityTimer);
      }
      if (isBOMActivityStarted && vm.IsManfucaturer) {
        vm.bomActivityTimer = setInterval(() => {
          _.each(vm.sourceData, (item) => {
            if (item.isActivityStart) {
              //item.activityStartTime = item.activityStartTime + 1;
              //item.currentTimerDiff = secondsToTime(item.activityStartTime, true);
              const currDate = getCurrentUTC();
              const totalConsumptionTime = calculateSeconds(item.activityStartAt, currDate);
              item.currentTimerDiff = secondsToTime(totalConsumptionTime, true);
            }
            else {
              item.currentTimerDiff = '';
            }
          });
        }, _configSecondTimeout);
      }
    }
    //format Alias (all in new line) Of Grid Data
    const formatStanradrdsOfGridData = (partList) => {
      const existsCertiOfPartList = _.filter(partList, (item) => item.certificatelist);
      _.each(existsCertiOfPartList, (itemCerti) => {
        const partCertificationDetListWithNewLine = [];
        const classWithColorCode = itemCerti.certificatelist.split('@@@@@@');
        _.each(classWithColorCode, (itemColor) => {
          if (itemColor) {
            const objItem = itemColor.split('######');
            const standardClassObj = {};
            standardClassObj.stdClassName = objItem[0].trim();
            standardClassObj.colorCode = objItem[1] ? objItem[1] : CORE.DefaultStandardTagColor;
            partCertificationDetListWithNewLine.push(standardClassObj);
          }
        });
        itemCerti.partCertificationDetListWithNewLine = partCertificationDetListWithNewLine;
        itemCerti.certificatelist = _.map(partCertificationDetListWithNewLine, 'stdClassName').toString();
      });
    };

    function setFilteredMasterFilterData(componentsObj) {
      if (componentsObj.data.FilterValues) {
        /*here creating unique values list for each object and that is used on UI for selection as filters*/
        vm.filteredMfgCodeList = _.map(
          _.groupBy(componentsObj.data.FilterValues, 'mfgcodeID'),
          (grp) => ({
            id: grp[0].mfgcodeID,
            mfg: grp[0].mfgCode,
            mfgCodeName: grp[0].mfgCode,
            displayOrder: grp[0].mfgDisplayOrder
          }));
        vm.filteredMfgCodeList = _.sortBy((_.sortBy(vm.filteredMfgCodeList, 'mfgCodeName')), 'displayOrder');

        vm.filteredMfgCodeForSupplierPartsList = _.map(
          _.groupBy(componentsObj.data.FilterValues, 'AliasMFGCodeID'),
          (grp) => ({
            id: grp[0].AliasMFGCodeID,
            mfg: grp[0].AliasMFGName,
            mfgCodeName: grp[0].AliasMFGCode,
            displayOrder: grp[0].AliasMFGDisplayOrder
          }));
        vm.filteredMfgCodeForSupplierPartsList = _.sortBy((_.sortBy(vm.filteredMfgCodeForSupplierPartsList, 'mfgCodeName')), 'displayOrder');

        vm.filteredPartStatusList = _.map(
          _.groupBy(componentsObj.data.FilterValues, 'partStatus'),
          (grp) => ({
            id: grp[0].partStatus,
            name: grp[0].partStatusValue,
            displayOrder: grp[0].parStatusDisplayOrder
          }));
        vm.filteredPartStatusList = _.sortBy((_.sortBy(vm.filteredPartStatusList, 'name')), 'displayOrder');

        vm.filteredPackagingList = _.map(
          _.groupBy(
            _.filter(componentsObj.data.FilterValues, (obj) => obj.packagingID && obj),
            'packagingID'),
          (grp) => ({
            id: grp[0].packagingID,
            value: grp[0].packagingName,
            displayOrder: grp[0].packagingDisplayOrder
          }));
        vm.filteredPackagingList = _.sortBy((_.sortBy(vm.filteredPackagingList, 'value')), 'displayOrder');

        /**
         * Progressive Filter apply base on get record on load for Package Case list
         * */
        vm.filteredPackageCaseListForFilters = _.map(
          _.groupBy(
            _.filter(componentsObj.data.FilterValues, (obj) => obj.partPackageID && obj),
            'partPackageID'),
          (grp) => ({
            id: grp[0].partPackageID,
            value: grp[0].packageCaseTypeValue
          }));

        vm.filteredFunctionalTypeList = _.map(
          _.groupBy(componentsObj.data.FilterValues, 'functionalCategoryID'),
          (grp) => ({
            id: grp[0].functionalCategoryID,
            partTypeName: grp[0].functionalCategoryName,
            displayOrder: grp[0].functionalCategoryDisplayOrder
          }));
        vm.filteredFunctionalTypeList = _.sortBy((_.sortBy(vm.filteredFunctionalTypeList, 'partTypeName')), 'displayOrder');

        vm.filteredMountingTypeList = _.map(
          _.groupBy(componentsObj.data.FilterValues, 'mountingTypeID'),
          (grp) => ({
            id: grp[0].mountingTypeID,
            name: grp[0].mountingTypeName,
            displayOrder: grp[0].mountingTypeDisplayOrder
          }));
        vm.filteredMountingTypeList = _.sortBy((_.sortBy(vm.filteredMountingTypeList, 'name')), 'displayOrder');

        vm.filteredPartTypeList = _.map(
          _.groupBy(componentsObj.data.FilterValues, 'partType'),
          (grp) => ({
            id: grp[0].partType,
            Value: grp[0].categoryName
          }));
        vm.filteredPartTypeList = _.orderBy(vm.filteredPartTypeList, ['Value'], ['asc']);

        //vm.filteredStandardsList = componentsObj.data.StandardsList;
        //vm.filteredCountryList = componentsObj.data.AcceptableShippingCountryList;
        //vm.filteredOperationalAttributeList = componentsObj.data.OperationalAttributeList;

        /*vm.filteredAssemblyTypeList = _.map(
          _.groupBy(componentsObj.data.FilterValues, 'assemblyTypeName'),
          function (grp) {
            return {
              id: grp[0].assemblyType,
              name: grp[0].assemblyTypeName
            }
          });
        vm.filteredAssemblyTypeList = _.orderBy(vm.filteredAssemblyTypeList, ['name'], ['asc']);*/

        vm.filteredExternalFunctionalTypeList = _.map(
          _.groupBy(
            _.filter(componentsObj.data.FilterValues, (obj) => obj.functionalCategoryText),
            'functionalCategoryText'),
          (grp) => ({
            functionalCategoryText: grp[0].functionalCategoryText
          }));
        vm.filteredExternalFunctionalTypeList = _.orderBy(vm.filteredExternalFunctionalTypeList, ['functionalCategoryText'], ['asc']);

        vm.filteredExternalMountingTypeList = _.map(
          _.groupBy(_.filter(componentsObj.data.FilterValues, (obj) => obj.mountingTypeText),
            'mountingTypeText'),
          (grp) => ({
            mountingTypeText: grp[0].mountingTypeText
          }));
        vm.filteredExternalMountingTypeList = _.orderBy(vm.filteredExternalMountingTypeList, ['mountingTypeText'], ['asc']);

        vm.filteredRoHSList = _.map(
          _.groupBy(componentsObj.data.FilterValues, 'RoHSStatusID'),
          (grp) => ({
            id: grp[0].RoHSStatusID,
            value: grp[0].rohsComplientConvertedValue,
            displayOrder: grp[0].rohsDisplayOrder
          }));
        vm.filteredRoHSList = _.sortBy((_.sortBy(vm.filteredRoHSList, 'value')), 'displayOrder');

        vm.filteredExternalRoHSList = _.map(
          _.groupBy(_.filter(componentsObj.data.FilterValues, (obj) => obj.rohsText),
            'rohsText'),
          (grp) => ({
            rohsText: grp[0].rohsText
          }));
        vm.filteredExternalRoHSList = _.orderBy(vm.filteredExternalRoHSList, ['rohsText'], ['asc']);
      }
    }

    function setPopover() {
      $('.image-popover').on('mouseenter', (e) => {
        vm.popoverPlacement = (e.view.innerWidth / 2);
        if (vm.popoverPlacement < e.clientX) {
          vm.popoverPlacement = 'left';
        }
        else {
          vm.popoverPlacement = 'right';
        }
      });
    };

    $timeout(() => {
      $rootScope.$on(CORE.GRID_COL_PINNED_AND_VISIBLE_CHANGE, () => {
        $timeout(() => {
          setPopover();
        }, _configSecondTimeout);
      });
    });

    function setUIformatedDate(data) {
      if (data && data.length > 0) {
        _.each(data, (row) => {
          if (row) {
            row.ltbDate = row.ltbDate ? BaseService.getUIFormatedDate(row.ltbDate, vm.DefaultDateFormat) : row.ltbDate;
            row.eolDate = row.eolDate ? BaseService.getUIFormatedDate(row.eolDate, vm.DefaultDateFormat) : row.eolDate;
            row.obsoleteDate = row.obsoleteDate ? BaseService.getUIFormatedDate(row.obsoleteDate, vm.DefaultDateFormat) : row.obsoleteDate;
            row.reversalDate = row.reversalDate ? BaseService.getUIFormatedDate(row.reversalDate, vm.DefaultDateFormat) : row.reversalDate;
          }
        });
      }
    }

    function setDataAfterGetAPICall(components, isGetDataDown) {
      if (components && components.data.components) {
        vm.showGroupWiseList = false;
        setUIformatedDate(components.data.components);
        formatStanradrdsOfGridData(components.data.components);
        if (!isGetDataDown) {
          vm.sourceData = components.data.components;
          vm.currentdata = vm.sourceData.length;
        }
        else if (components.data.components.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(components.data.components);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        setFilteredMasterFilterData(components);
        if (vm.sourceData && vm.sourceData.length > 0) {
          _.each(vm.sourceData, (obj) => {
            obj.isGoToBOMDisabled = true;
            obj.isBOMDelete = true;
            obj.disableAssyAtGlance = true;
            obj.isDisabledDelete = !vm.enableDeleteOperation;
            if (obj.category === CORE.PartCategory.SubAssembly) {
              obj.isGoToBOMDisabled = false;
              obj.disableAssyAtGlance = false;
            }
            if (obj.category === CORE.PartCategory.SubAssembly && vm.enabledDeleteBOM && obj.bomLineCount > 0 && obj.assemblyCount <= 1 && !(obj.quoteProgress === vm.rfqSubmittedStatus || obj.quoteProgress === vm.rfqCompletedStatus)) {
              obj.isBOMDelete = false;
            }
            obj.imageURL = BaseService.getPartMasterImageURL(obj.documentPath, obj.imageURL);
            if (obj.id <= 0) {
              //obj.isDisabledUpdate =
              obj.isDisabledDelete = true;
              //obj.isRowSelectable = false;
            }
            if (obj.partType === CORE.PartType.Other) {
              obj.isOtherPart = true;
            }
          });
          startBOMActivityTimer(true/*vm.pagingInfo.isBOMActivityStarted*/);
          $timeout(() => {
            setPopover();
          }, _configSecondTimeout);
        }
        // must set after new data comes
        vm.totalSourceDataCount = components.data.Count;
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
          if (vm.pagingInfo.SearchColumns.length > 0) {
            vm.isNoDataFound = false;
            vm.emptyState = 0;
          }
          else {
            vm.isNoDataFound = true;
            vm.emptyState = 0;
          }
        }
        else {
          vm.isNoDataFound = false;
          vm.emptyState = null;
        }
        $timeout(() => {
          if (!isGetDataDown) {
            vm.resetSourceGrid();
            $scope.$broadcast(USER.PartMasterAdvanceFilters.RefreshAdvanceFilterData, null);
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

    /*get list of component having manufacture type 'MFG' */
    vm.loadData = () => {
      /*condition added to remove double call (On page load fetch Group data)
       * 1.was on click of search
       * 2.was when UI grid visible
       */
      if (!vm.isGridVisible || vm.isAlreadyFetchData) {
        vm.isAlreadyFetchData = false;
        vm.isGridVisible = true;
        return;
      }
      configureFilterObject();

      getComponentList();
    };

    // Set Filter data into Pageinfo for pass API call
    const configureFilterObject = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);

      if (vm.pagingInfo.SortColumns.length === 0) {
        vm.pagingInfo.SortColumns = [['id', 'DESC']];
      }
      vm.pagingInfo.isMFG = vm.IsManfucaturer;
      if (vm.advancedFilterOptions) {
        if (vm.advancedFilterOptions.mfgCodeDetailModel && vm.advancedFilterOptions.mfgCodeDetailModel.length > 0) {
          vm.pagingInfo.mfgCodeIds = vm.advancedFilterOptions.mfgCodeDetailModel.join(',');
        }
        else {
          vm.pagingInfo.mfgCodeIds = null;
        }

        if (vm.advancedFilterOptions.mfgCodeForSupplierPartsDetailModel && vm.advancedFilterOptions.mfgCodeForSupplierPartsDetailModel.length > 0) {
          vm.pagingInfo.mfgCodeIdsForSupplierParts = vm.advancedFilterOptions.mfgCodeForSupplierPartsDetailModel.join(',');
        }
        else {
          vm.pagingInfo.mfgCodeIdsForSupplierParts = null;
        }
        if (vm.advancedFilterOptions.packagingDetailModel && vm.advancedFilterOptions.packagingDetailModel.length > 0) {
          vm.pagingInfo.packagingIds = `'${vm.advancedFilterOptions.packagingDetailModel.join('\',\'')}'`;
        }
        else {
          vm.pagingInfo.packagingIds = null;
        }
        if (vm.advancedFilterOptions.partStatusListModel && vm.advancedFilterOptions.partStatusListModel.length > 0) {
          vm.pagingInfo.partStatusIds = vm.advancedFilterOptions.partStatusListModel.join(',');
        }
        else {
          vm.pagingInfo.partStatusIds = null;
        }
        if (vm.advancedFilterOptions.mountingTypeListModel && vm.advancedFilterOptions.mountingTypeListModel.length > 0) {
          vm.pagingInfo.mountingTypeIds = vm.advancedFilterOptions.mountingTypeListModel.join(',');
        }
        else {
          vm.pagingInfo.mountingTypeIds = null;
        }
        if (vm.advancedFilterOptions.externalMountingTypeListModel && vm.advancedFilterOptions.externalMountingTypeListModel.length > 0) {
          vm.pagingInfo.externalMountingTypeValues = vm.advancedFilterOptions.externalMountingTypeListModel;
          vm.pagingInfo.externalMountingTypeValues = _.map(vm.pagingInfo.externalMountingTypeValues, (itemValue) => {
            itemValue = itemValue.replace('\\', '\\\\\\');
            // eslint-disable-next-line no-useless-escape
            return itemValue = itemValue.replace(/\"/g, '\\"').replace(/\'/g, '\\\'');
          });
          vm.pagingInfo.externalMountingTypeValues = `'${vm.pagingInfo.externalMountingTypeValues.join('\',\'')}'`;
        }
        else {
          vm.pagingInfo.externalFunctionalTypeValues = null;
        }
        if (vm.advancedFilterOptions.functionalTypeListModel && vm.advancedFilterOptions.functionalTypeListModel.length > 0) {
          vm.pagingInfo.functionalTypeIds = vm.advancedFilterOptions.functionalTypeListModel.join(',');
        }
        else {
          vm.pagingInfo.functionalTypeIds = null;
        }
        if (vm.advancedFilterOptions.externalFunctionalTypeListModel && vm.advancedFilterOptions.externalFunctionalTypeListModel.length > 0) {
          vm.pagingInfo.externalFunctionalTypeValues = vm.advancedFilterOptions.externalFunctionalTypeListModel;
          vm.pagingInfo.externalFunctionalTypeValues = _.map(vm.pagingInfo.externalFunctionalTypeValues, (itemValue) => {
            itemValue = itemValue.replace('\\', '\\\\\\');
            // eslint-disable-next-line no-useless-escape
            return itemValue = itemValue.replace(/\"/g, '\\"').replace(/\'/g, '\\\'');
          });
          vm.pagingInfo.externalFunctionalTypeValues = `'${vm.pagingInfo.externalFunctionalTypeValues.join('\',\'')}'`;
        }
        else {
          vm.pagingInfo.externalFunctionalTypeValues = null;
        }
        if (vm.advancedFilterOptions.attributesSearchHeader && vm.advancedFilterOptions.attributesSearchHeader.length > 0) {
          vm.pagingInfo.attributesSearchHeader = vm.advancedFilterOptions.attributesSearchHeader;
          vm.pagingInfo.attributesSearchHeader = vm.pagingInfo.attributesSearchHeader.replace('\\', '\\\\\\\\\\\\');
          // eslint-disable-next-line no-useless-escape
          vm.pagingInfo.attributesSearchHeader = vm.pagingInfo.attributesSearchHeader.replace(/\"/g, '\\"').replace(/\'/g, '\\\'').replace('[', '\\\\[').replace(']', '\\\\]').replace(/\%/g, '\\\\%');
        }
        else {
          vm.pagingInfo.attributesSearchHeader = null;
        }
        if (vm.advancedFilterOptions.attributesSearch && vm.advancedFilterOptions.attributesSearch.length > 0) {
          vm.pagingInfo.attributesSearch = vm.advancedFilterOptions.attributesSearch.join(',');
        }
        else {
          vm.pagingInfo.attributesSearch = null;
        }
        if (vm.advancedFilterOptions.packagingAlias) {
          vm.pagingInfo.packagingAlias = vm.advancedFilterOptions.packagingAlias;
        }
        else {
          vm.pagingInfo.packagingAlias = null;
        }
        if (vm.advancedFilterOptions.alternatePart) {
          vm.pagingInfo.alternatePart = vm.advancedFilterOptions.alternatePart;
        }
        else {
          vm.pagingInfo.alternatePart = null;
        }
        if (vm.advancedFilterOptions.roHSAlternatePart) {
          vm.pagingInfo.roHSAlternatePart = vm.advancedFilterOptions.roHSAlternatePart;
        }
        else {
          vm.pagingInfo.roHSAlternatePart = null;
        }
        if (vm.advancedFilterOptions.partUsedInAssembly) {
          vm.pagingInfo.partUsedInAssembly = vm.advancedFilterOptions.partUsedInAssembly;
        }
        else {
          vm.pagingInfo.partUsedInAssembly = null;
        }
        if (vm.advancedFilterOptions.multiplePartNumbers && vm.advancedFilterOptions.multiplePartNumbers.length > 0) {
          vm.pagingInfo.multiplePartNumbers = [];
          //_.each(vm.advancedFilterOptions.multiplePartNumbers, (item) => {
          //  var replacedString = item.replace('\\', '\\\\');
          //  // eslint-disable-next-line no-useless-escape
          //  replacedString.replace(/\"/g, '\\"').replace(/\'/g, '\\\'').replace('[', '\\\\[').replace(']', '\\\\]');
          //  vm.pagingInfo.multiplePartNumbers.push(replacedString);
          //});
          vm.pagingInfo.multiplePartNumbers = '\'' + vm.advancedFilterOptions.multiplePartNumbers.join('\',\'') + '\'';
        }
        else {
          vm.pagingInfo.multiplePartNumbers = null;
        }
        if (vm.advancedFilterOptions.partTypeModel && vm.advancedFilterOptions.partTypeModel.length > 0) {
          vm.pagingInfo.partTypeIds = `'${vm.advancedFilterOptions.partTypeModel.join('\',\'')}'`;
        }
        else {
          vm.pagingInfo.partTypeIds = null;
        }
        if (vm.advancedFilterOptions.certificateStandards && vm.advancedFilterOptions.certificateStandards.length > 0) {
          vm.pagingInfo.certificateStandardsIds = `'${vm.advancedFilterOptions.certificateStandards.join('\',\'')}'`;
        }
        else {
          vm.pagingInfo.certificateStandardsIds = null;
        }
        if (vm.advancedFilterOptions.standardsClass && vm.advancedFilterOptions.standardsClass.length > 0) {
          vm.pagingInfo.standardsClassIds = `'${vm.advancedFilterOptions.standardsClass.join('\',\'')}'`;
        }
        else {
          vm.pagingInfo.standardsClassIds = null;
        }
        if (vm.advancedFilterOptions.assemblyModel && vm.advancedFilterOptions.assemblyModel.length > 0) {
          vm.pagingInfo.assemblyIds = `'${vm.advancedFilterOptions.assemblyModel.join('\',\'')}'`;
        }
        else {
          vm.pagingInfo.assemblyIds = null;
        }
        if (vm.advancedFilterOptions.assemblyTypeModel && vm.advancedFilterOptions.assemblyTypeModel.length > 0) {
          vm.pagingInfo.assemblyTypeIds = `'${vm.advancedFilterOptions.assemblyTypeModel.join('\',\'')}'`;
        }
        else {
          vm.pagingInfo.assemblyTypeIds = null;
        }
        if (vm.advancedFilterOptions.rohsModel && vm.advancedFilterOptions.rohsModel.length > 0) {
          vm.pagingInfo.rohsIds = `'${vm.advancedFilterOptions.rohsModel.join('\',\'')}'`;
        }
        else {
          vm.pagingInfo.rohsIds = null;
        }
        if (vm.advancedFilterOptions.externalRoHSStatusListModel && vm.advancedFilterOptions.externalRoHSStatusListModel.length > 0) {
          vm.pagingInfo.externalRoHSStatusListValues = vm.advancedFilterOptions.externalRoHSStatusListModel;
          vm.pagingInfo.externalRoHSStatusListValues = _.map(vm.pagingInfo.externalRoHSStatusListValues, (itemValue) => {
            itemValue = itemValue.replace('\\', '\\\\\\');
            // eslint-disable-next-line no-useless-escape
            return itemValue = itemValue.replace(/\"/g, '\\"').replace(/\'/g, '\\\'');
          });
          vm.pagingInfo.externalRoHSStatusListValues = `'${vm.pagingInfo.externalRoHSStatusListValues.join('\',\'')}'`;
        }
        else {
          vm.pagingInfo.externalRoHSStatusListValues = null;
        }
        if (vm.advancedFilterOptions.operationalAttributeModel && vm.advancedFilterOptions.operationalAttributeModel.length > 0) {
          vm.pagingInfo.operationalAttributeIds = `'${vm.advancedFilterOptions.operationalAttributeModel.join('\',\'')}'`;
        }
        else {
          vm.pagingInfo.operationalAttributeIds = null;
        }
        if (vm.advancedFilterOptions.disapprovedSupplierModel && vm.advancedFilterOptions.disapprovedSupplierModel.length > 0) {
          vm.pagingInfo.disapprovedSupplierIds = `'${vm.advancedFilterOptions.disapprovedSupplierModel.join('\',\'')}'`;
        }
        else {
          vm.pagingInfo.disapprovedSupplierIds = null;
        }
        if (vm.advancedFilterOptions.acceptableShippingCountryModel && vm.advancedFilterOptions.acceptableShippingCountryModel.length > 0) {
          vm.pagingInfo.acceptableShippingCountryIds = `'${vm.advancedFilterOptions.acceptableShippingCountryModel.join('\',\'')}'`;
        }
        else {
          vm.pagingInfo.acceptableShippingCountryIds = null;
        }
        if (vm.advancedFilterOptions.componentOrdering) {
          vm.pagingInfo.componentOrdering = vm.advancedFilterOptions.componentOrdering;
        }
        else {
          vm.pagingInfo.componentOrdering = null;
        }
        if (vm.advancedFilterOptions.componentUsageCriteria) {
          vm.pagingInfo.componentUsageCriteria = vm.advancedFilterOptions.componentUsageCriteria;
          const criteriaDet = CORE.ComponentUsageCriteria.find((x) => x.key === vm.advancedFilterOptions.componentUsageCriteria);
          vm.SortByCriteria = criteriaDet ? criteriaDet.value : '';
        }
        else {
          vm.pagingInfo.componentUsageCriteria = null;
          vm.SortByCriteria = '';
        }
        if (vm.advancedFilterOptions.fromDate) {
          vm.pagingInfo.fromDate = (BaseService.getAPIFormatedDate(vm.advancedFilterOptions.fromDate));
        }
        else {
          vm.pagingInfo.fromDate = null;
        }
        if (vm.advancedFilterOptions.toDate) {
          vm.pagingInfo.toDate = (BaseService.getAPIFormatedDate(vm.advancedFilterOptions.toDate));
        }
        else {
          vm.pagingInfo.toDate = null;
        }
        if (vm.advancedFilterOptions.obsoleteDate) {
          vm.pagingInfo.obsoleteDate = (BaseService.getAPIFormatedDate(vm.advancedFilterOptions.obsoleteDate));
        }
        else {
          vm.pagingInfo.obsoleteDate = null;
        }

        if (vm.advancedFilterOptions.fromCreatedOnDate) {
          vm.pagingInfo.fromCreatedOnDate = (BaseService.getAPIFormatedDate(vm.advancedFilterOptions.fromCreatedOnDate));
        }
        else {
          vm.pagingInfo.fromCreatedOnDate = null;
        }
        if (vm.advancedFilterOptions.toCreatedOnDate) {
          vm.pagingInfo.toCreatedOnDate = (BaseService.getAPIFormatedDate(vm.advancedFilterOptions.toCreatedOnDate));
        }
        else {
          vm.pagingInfo.toCreatedOnDate = null;
        }
        vm.pagingInfo.isReversal = vm.advancedFilterOptions.isReversal;
        vm.pagingInfo.isCPN = vm.advancedFilterOptions.isCPN;
        vm.pagingInfo.isCustom = vm.advancedFilterOptions.isCustom;
        vm.pagingInfo.isBOMActivityStarted = vm.advancedFilterOptions.isBOMActivityStarted;
        vm.pagingInfo.isExportControl = vm.advancedFilterOptions.isExportControl;
        vm.pagingInfo.isEcoDfmColumnVisible = vm.advancedFilterOptions.isEcoDfmColumnVisible;
        vm.pagingInfo.isSearchFromHeader = vm.isSearchFromHeader;
        vm.pagingInfo.isOperatingTemperatureBlank = vm.advancedFilterOptions.isOperatingTemperatureBlank;
        vm.pagingInfo.isIdenticalMfrPN = vm.advancedFilterOptions.isIdenticalMfrPN;
        vm.pagingInfo.isProductionPNEmpty = vm.advancedFilterOptions.isProductionPNEmpty;
        vm.pagingInfo.isExcludeIncorrectPart = vm.advancedFilterOptions.isExcludeIncorrectPart;
        vm.pagingInfo.restrictUSEwithpermission = vm.advancedFilterOptions.restrictUSEwithpermission;
        vm.pagingInfo.restrictPackagingUseWithpermission = vm.advancedFilterOptions.restrictPackagingUseWithpermission;
        vm.pagingInfo.restrictUsePermanently = vm.advancedFilterOptions.restrictUsePermanently;
        vm.pagingInfo.restrictPackagingUsePermanently = vm.advancedFilterOptions.restrictPackagingUsePermanently;
        vm.pagingInfo.multiplePartFilterFieldName = vm.advancedFilterOptions.multiplePartFilterFieldName;
        if (vm.advancedFilterOptions.operationalAttributeModel && vm.advancedFilterOptions.operationalAttributeModel.length > 0) {
          vm.pagingInfo.operationalAttributeIds = `'${vm.advancedFilterOptions.operationalAttributeModel.join('\',\'')}'`;
        }
        else {
          vm.pagingInfo.operationalAttributeIds = null;
        }
        vm.pagingInfo.multiplePartByUploadFileDetail = (vm.advancedFilterOptions.multiplePartByUploadFileDetail && Array.isArray(vm.advancedFilterOptions.multiplePartByUploadFileDetail)
          && vm.advancedFilterOptions.multiplePartByUploadFileDetail.length > 0) ? `'${vm.advancedFilterOptions.multiplePartByUploadFileDetail.join('\',\'')}'` : null;
        vm.pagingInfo.packageIds = vm.advancedFilterOptions.packageCaseDetailModel && vm.advancedFilterOptions.packageCaseDetailModel.length > 0 ?
          `'${vm.advancedFilterOptions.packageCaseDetailModel.join('\',\'')}'` : null;

        if (vm.advancedFilterOptions.isRefreshMasterFilters) {
          vm.pagingInfo.isRefreshMasterFilters = vm.advancedFilterOptions.isRefreshMasterFilters;
        }

        const StockColumn = _.find(vm.sourceHeader, (item) => item.field === 'partStock');
        if (vm.advancedFilterOptions.stockQuantity || vm.pagingInfo.componentOrdering === 'STOCK') {
          vm.pagingInfo.stockQuantity = vm.advancedFilterOptions.stockQuantity;
          if (StockColumn) {
            StockColumn.visible = true;
            StockColumn.isMenuItemDisabled = false;
          }
        }
        else {
          vm.pagingInfo.stockQuantity = null;
          if (StockColumn) {
            StockColumn.visible = false;
            StockColumn.isMenuItemDisabled = true;
          }
        }
        const usageColumn = _.find(vm.sourceHeader, (item) => item.field === 'partUsage');
        if (vm.pagingInfo.componentOrdering === 'USAGE') {
          if (usageColumn) {
            usageColumn.visible = true;
            usageColumn.isMenuItemDisabled = false;
            usageColumn.displayName = 'Usage ' + (vm.SortByCriteria ? '(' + vm.SortByCriteria + ')' : '');
          }
        }
        else {
          if (usageColumn) {
            usageColumn.visible = false;
            usageColumn.isMenuItemDisabled = true;
            usageColumn.displayName = 'Usage ' + (vm.SortByCriteria ? '(' + vm.SortByCriteria + ')' : '');
          }
        }
        const ecoColumn = _.find(vm.sourceHeader, (item) => item.field === 'activeEcoDfmCount');
        if (vm.pagingInfo.isEcoDfmColumnVisible === true) {
          if (ecoColumn) {
            ecoColumn.visible = true;
            ecoColumn.isMenuItemDisabled = false;
          }
        }
        else {
          if (ecoColumn) {
            ecoColumn.visible = false;
            ecoColumn.isMenuItemDisabled = true;
          }
        }
      }
      vm.enabledDeleteBOM = BaseService.checkFeatureRights(CORE.FEATURE_NAME.DeleteBOM);
    };

    // Fetch data from Component Data
    const getComponentList = (isOnloadPageCall) => {
      vm.isNoGroupDataFound = false;
      vm.cgBusyLoading = ComponentFactory.retrieveComponentList().query(vm.pagingInfo).$promise.then((components) => {
        vm.enableDeleteOperation = BaseService.checkFeatureRights(CORE.FEATURE_NAME.DeletePart);
        vm.updatePartsAttributesFeature = BaseService.checkFeatureRights(CORE.FEATURE_NAME.UpdatePartsAttributes);
        vm.stopExternalPartUpdateFeature = BaseService.checkFeatureRights(CORE.FEATURE_NAME.StopExternalPartUpdate);
        if (vm.gridOptions) {
          vm.gridOptions.hideMultiDeleteButton = !vm.enableDeleteOperation;
        }
        vm.groupWiseListData = [];
        if (components && components.data) {
          vm.isSearchFromHeader = false;/*setting false due to show empty grid while search from grid column*/
          if (vm.pagingInfo.isSearchFromHeader && components.data.Count !== 1) {
            vm.showGroupWiseList = true;
            if (!components.data || components.data.Count === 0) {
              vm.isNoDataFound = true;
              vm.emptyState = 0;
            }
            else {
              vm.isNoDataFound = false;
              vm.emptyState = 0;
            }
            vm.groupWiseListData = components.data.GroupingWiseList;
            vm.isGroupSectionVisiable = true;
            vm.isNoGroupDataFound = Array.isArray(vm.groupWiseListData) && vm.groupWiseListData.length > 0 ? false : true;
          }
          else {
            vm.isGridVisible = true;
            vm.isAlreadyFetchData = isOnloadPageCall ? true : false;
            $timeout(() => {
              setDataAfterGetAPICall(components, false);
            }, _configWOTimeout);
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    // on scroll down get data
    vm.getDataDown = () => {
      vm.enabledDeleteBOM = BaseService.checkFeatureRights(CORE.FEATURE_NAME.DeleteBOM);
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;

      vm.cgBusyLoading = ComponentFactory.retrieveComponentList().query(vm.pagingInfo).$promise.then((components) => {
        setDataAfterGetAPICall(components, true);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.selectedCustomer = () => vm.gridOptions.getSelectedRowsCount ? vm.gridOptions.getSelectedRowsCount() : 0;

    vm.fab = {
      Status: false
    };

    function resetPaginationAndLoadData() {
      vm.pagingInfo.Page = vm.gridOptions.paginationCurrentPage = CORE.UIGrid.Page();
      BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
    };

    /* delete component*/
    vm.deleteRecord = (component) => {
      if (!vm.enableDeleteOperation) {
        return;
      }
      let selectedIDs = [];
      if (component) {
        selectedIDs.push(component.id);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((componentitem) => componentitem.id);
        }
      }

      const systemGEneratedPartsIds = _.find(selectedIDs, (i) => i < 0);
      if (systemGEneratedPartsIds) {
        const alertModel = {
          messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.SYSTEM_GENERATED_PARTS_DELETE_NOT_ALLOWED
        };
        DialogFactory.messageAlertDialog(alertModel);
        return;
      }

      if (selectedIDs) {
        const data = {
          transctionList: CORE.DELETE_MODULE_LIST.PARTS,
          deleteCount: selectedIDs.length,
          moduleName: 'Part'
        };
        DialogFactory.dialogService(
          CORE.DELETE_CONFIRMATION_MODAL_CONTROLLER,
          CORE.DELETE_CONFIRMATION_MODAL_VIEW,
          null,
          data).then(() => {
            const objIDs = {
              id: selectedIDs,
              CountList: false
            };
            vm.cgBusyLoading = ComponentFactory.deleteComponent().query({ objIDs: objIDs }).$promise.then((data) => {
              if (data && data.data && (data.data.length > 0 || data.data.transactionDetails)) {
                const dataObj = {
                  TotalCount: data.data.transactionDetails[0].TotalCount,
                  pageName: CORE.PageName.component
                };
                BaseService.deleteAlertMessageWithHistory(dataObj, (ev) => {
                  const IDs = {
                    id: selectedIDs,
                    CountList: true
                  };
                  return ComponentFactory.deleteComponent().query({
                    objIDs: IDs
                  }).$promise.then((res) => {
                    let data = {};
                    if (res && res.data) {
                      data = res.data;
                    }
                    data.redirectToPartDetailPage = true;

                    data.pageTitle = component ? component.name : null;
                    data.PageName = CORE.PageName.component;
                    data.selectedIDs = stringFormat('{0}{1}', selectedIDs.length, ' Selected');
                    if (res.data) {
                      DialogFactory.dialogService(
                        USER.ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER,
                        USER.ADMIN_SHOW_TRANSACTION_DETAILS_VIEW,
                        ev,
                        data).then(() => {
                          // success
                        }, () => {
                          // calcel
                        });
                    }
                  }).catch((error) => BaseService.getErrorLog(error));
                });
              }
              else {
                //BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                resetPaginationAndLoadData();
                vm.gridOptions.clearSelectedRows();
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }, () => {
            // cancel
            console.log('Cancel' + response);
          }, (err) => BaseService.getErrorLog(err));
      }
      else {
        //show validation message no data selected
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContent.message = stringFormat(messageContent.message, 'part');
        const alertModel = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(alertModel);
      }
    };

    /* update part*/
    vm.updateRecord = (row) => {
      const routeState = (vm.mfgType.toUpperCase() === vm.mfgTypeList.DIST) ? USER.ADMIN_MANAGEDISTCOMPONENT_DETAIL_STATE : USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE;
      BaseService.openInNew(routeState, {
        coid: row.entity.id
      });
    };

    /* add part*/
    vm.addEditRecord = () => {
      const routeState = (vm.mfgType.toUpperCase() === vm.mfgTypeList.DIST) ? USER.ADMIN_MANAGEDISTCOMPONENT_DETAIL_STATE : USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE;
      BaseService.openInNew(routeState, {
        coid: null
      });
    };

    /* Remove multiple part*/
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };

    vm.viewPurchaseComment = (rowdata, ev) => {
      if (rowdata && rowdata.entity) {
        DialogFactory.dialogService(
          CORE.COMPONENT_PURCHASE_COMMENT_MODAL_CONTROLLER,
          CORE.COMPONENT_PURCHASE_COMMENT__MODAL_VIEW,
          ev,
          rowdata.entity).then(() => {
            // success
          }, () => {
            // cancel
          }, (err) => BaseService.getErrorLog(err));
      }
    };

    /* open pop up for Assy at glance */
    vm.getAssyAtGlance = (rowdata, ev) => {
      var data = { partID: rowdata.id };
      DialogFactory.dialogService(
        RFQTRANSACTION.ASSEMBLY_AT_GLANCE_CONTROLLER,
        RFQTRANSACTION.ASSEMBLY_AT_GLANCE_VIEW,
        ev,
        data).then(() => {
          // success
        }, () => {
          // cancel
        }, (err) => BaseService.getErrorLog(err));
    };

    function connectSocket() {
      socketConnectionService.on(CORE.EventName.sendPartUpdateVerification, sendPartUpdateVerification);
      socketConnectionService.on(PRICING.EventName.sendBOMStartStopActivity, updateStopBOMActivity);
      socketConnectionService.on(CORE.EventName.sendPartMasterProgressbarUpdate, sendPartMasterProgressbarUpdate);
      socketConnectionService.on(CORE.EventName.componentListUpdate, componentListUpdate);
      socketConnectionService.on(CORE.EventName.sendPartUpdateStopNotificationToAllUsers, stopPartUpdate);
    }
    connectSocket();

    socketConnectionService.on('reconnect', () => {
      connectSocket();
    });
    function removeSocketListener() {
      socketConnectionService.removeListener(CORE.EventName.sendPartUpdateVerification, sendPartUpdateVerification);
      socketConnectionService.removeListener(CORE.EventName.sendPartMasterProgressbarUpdate, sendPartMasterProgressbarUpdate);
      socketConnectionService.removeListener(PRICING.EventName.sendBOMStartStopActivity, updateStopBOMActivity);
      socketConnectionService.removeListener(CORE.EventName.componentListUpdate, componentListUpdate);
      socketConnectionService.removeListener(CORE.EventName.sendPartUpdateStopNotificationToAllUsers, stopPartUpdate);
    }
    $scope.$on('$destroy', () => {
      removeSocketListener();
      if (vm.bomActivityTimer) {
        clearInterval(vm.bomActivityTimer);
      }
      $mdDialog.hide(false, {
        closeAll: true
      });
    });

    //verify component manually
    vm.componentVerification = (row, event) => {
      if (row && row.id <= 0) {
        return;
      }
      vm.transactionID = getGUID();
      const listMfrPN = [];
      vm.dummyevent = event;
      vm.dummyRow = row;
      if (row && !row.isCustom) {
        const objMfr = {
          transactionID: vm.transactionID,
          partNumber: row.mfgPN,
          isPartUpdate: true,
          partID: row.id,
          type: CORE.DIGIKEY_TYPE_ACC.FJT_SCHEDULE_PARTUPDATEV3
        };
        listMfrPN.push(objMfr);
      } else {
        _.each(vm.selectedRowsList, (objMfrDet) => {
          if (!objMfrDet.isCustom && objMfrDet.id > 0) {
            const objMfr = {
              transactionID: vm.transactionID,
              partNumber: objMfrDet.mfgPN,
              isPartUpdate: true,
              partID: objMfrDet.id,
              type: CORE.DIGIKEY_TYPE_ACC.FJT_SCHEDULE_PARTUPDATEV3
            };
            listMfrPN.push(objMfr);
          }
        });
      }
      if (listMfrPN.length > 0) {
        vm.cgBusyLoading = ComponentFactory.getPartDetailFromExternalApi().save(listMfrPN).$promise.then(() => {
          getProgressDetail(CORE.DIGIKEY_TYPE_ACC.FJT_SCHEDULE_PARTUPDATEV3, null);
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.INVALID_SELECT_PART);
        const alertModel = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(alertModel);
      }
    };

    socketConnectionService.on('disconnect', () => {
      removeSocketListener();
    });

    function sendPartUpdateVerification(item) {
      const objApi = {
        ispartMaster: true,
        transactionID: item.transactionID
      };
      APIVerificationErrorPopupFactory.getAPIVerificationErrors().query({ objApiError: objApi }).$promise.then((response) => {
        if (response && response.data && response.data.bomError.length > 0) {
          getProgressDetail(CORE.DIGIKEY_TYPE_ACC.FJT_SCHEDULE_PARTUPDATEV3, item.transactionID);
          if (!isOpenPopup && item.transactionID && item.type && item.userID === vm.loginUser.userid) {
            openErrorListPopup();
          }
        } else {
          if (vm.remainingParts) {
            getProgressDetail(CORE.DIGIKEY_TYPE_ACC.FJT_SCHEDULE_PARTUPDATEV3, item.transactionID, true);
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }
    //call progressbar function
    function sendPartMasterProgressbarUpdate(item) {
      if (item.transactionID && item.type) {
        getProgressDetail(CORE.DIGIKEY_TYPE_ACC.FJT_SCHEDULE_PARTUPDATEV3, item.transactionID);
      }
    }
    function updateStopBOMActivity(data) {
      if (data) {
        const lstItem = _.find(vm.sourceData, (item) => item.id === data.partID);
        if (lstItem) {
          lstItem.isActivityStart = data.isActivityStart === true ? true : false;
          if (lstItem.isActivityStart) {
            lstItem.activityStartAt = data.activityStartAt;
          }
        }
      }
    }
    ///update ui for component
    function componentListUpdate() {
      getProgressDetail(CORE.DIGIKEY_TYPE_ACC.FJT_SCHEDULE_PARTUPDATEV3, null);
    }

    vm.cloudUpdateMultipleData = () => {
      vm.componentVerification();
    };

    vm.updatePartsAttributes = (event) => {
      if (vm.selectedRowsList && vm.selectedRowsList.length > 0) {
        const objAttributes = {
          isfromMap: false,
          rowData: vm.selectedRowsList
        };
        DialogFactory.dialogService(
          USER.ADMIN_COMPONENT_UPDATE_MULTIPLE_ATTRIBUTES_POPUP_CONTROLLER,
          USER.ADMIN_COMPONENT_UPDATE_MULTIPLE_ATTRIBUTES_POPUP_VIEW,
          event,
          objAttributes).then(() => {
            // success
          }, (data) => {
            if (data) {
              BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
            }
          }, (err) => BaseService.getErrorLog(err));
      }
    };

    vm.updatePartsMPNAndPIDCode = (event) => {
      DialogFactory.dialogService(
        USER.ADMIN_COMPONENT_UPDATE_MPN_PIDCODE_POPUP_CONTROLLER,
        USER.ADMIN_COMPONENT_UPDATE_MPN_PIDCODE_POPUP_VIEW,
        event,
        null).then(() => {
          BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
        }, (data) => {
          if (data) {
            //  BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    const componentStatus = (ev) => {
      DialogFactory.dialogService(
        CORE.COMPONENT_NONETYPE_MODAL_CONTROLLER,
        CORE.COMPONENT_NONETYPE_MODAL_VIEW,
        ev,
        null).then(() => {
          // success
        }, (() => {
          // cancel
        }), (error) => BaseService.getErrorLog(error));
    };

    //mapped already add part none type detail
    vm.refreshComponent = () => {
      vm.cgBusyLoading = ComponentFactory.getrefreshComponent().query({}).$promise.then(() => {
        // success
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //check all None Type of detail component //vm.checkNoneTypeComponent
    vm.checkNoneTypeComponent = (ev) => {
      vm.cgBusyLoading = ComponentFactory.getNoneTypeComponent().query().$promise.then((comp) => {
        if (comp && comp.data && comp.data.length > 0) {
          componentStatus(ev);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //remove Right pid copied status on hover
    vm.pIdRightStatus = () => {
      vm.showPidRightstatus = false;
    };
    //copy Right pid on click
    vm.copyRightPidText = (item) => {
      var copytext = item;
      var $temp = $('<input>');
      $('body').append($temp);
      $temp.val(copytext).select();
      document.execCommand('copy');
      $temp.remove();
      vm.showPidRightstatus = true;
    };

    //remove MFG PN copied status on hover
    vm.MFGPNStatus = () => {
      vm.showMFGPNstatus = false;
    };
    //copy MFG PN on click
    vm.copyMFGPNText = (item) => {
      var copytext = item;
      var $temp = $('<input>');
      $('body').append($temp);
      $temp.val(copytext).select();
      document.execCommand('copy');
      $temp.remove();
      vm.showMFGPNstatus = true;
    };
    vm.clearGroupFilters = (canLoadData) => {
      vm.selectedGroupText = undefined;
      vm.functionalTypeIdFromGroupingList = undefined;
      vm.mountingTypeIDFromGroupingList = undefined;
      vm.advancedFilterOptions.functionalTypeListModel = [];
      vm.advancedFilterOptions.mountingTypeListModel = [];
      if (canLoadData) {
        //vm.loadData();
        resetPaginationAndLoadData();
      }
    };

    vm.setHeaderSearchFlag = () => {
      vm.isSearchFromHeader = vm.attributesSearchHeader ? true : false;
      if (vm.advancedFilterOptions) {
        vm.advancedFilterOptions.attributesSearchHeader = vm.attributesSearchHeader;
      }
    };

    vm.refreshGridData = (returnObject, isFromHeader, event, data, isOnLoadPage) => {
      vm.pagingInfo.Page = vm.gridOptions.paginationCurrentPage = CORE.UIGrid.Page();
      vm.advancedFilterOptions = [];
      vm.advancedFilterOptions.attributesSearchHeader = vm.attributesSearchHeader;

      if (isFromHeader) {
        const searchData = {
          headersearchkeyword: vm.attributesSearchHeader
        };
        if (data) {
          searchData.functionaltype = data.functionalCategoryID;
          searchData.mountingtype = data.mountingTypeID;
          searchData.groupname = data.groupName;
          if (vm.mfgType === CORE.MFG_TYPE.MFG.toLowerCase()) {
            BaseService.goToPartList(null, searchData);
          } else {
            BaseService.goToSupplierPartList(null, searchData);
          }
        } else {
          vm.isSearchFromHeader = vm.attributesSearchHeader ? true : false;
          if ((!event) || (event && event.keyCode === 13)) {
            vm.clearGroupFilters();
            $scope.$broadcast(USER.PartMasterAdvanceFilters.ClearFilterSelection, null);
            $state.transitionTo($state.$current, { headersearchkeywords: encodeURIComponent(searchData.headersearchkeyword) }, { reload: true, location: true, notify: true });
          }
        }
      }
      else {
        vm.isSearchFromHeader = isOnLoadPage ? true : false;
        if (returnObject) {
          vm.advancedFilterOptions = returnObject;
        }
        if (data) {
          if (data.functionaltype) {
            vm.functionalTypeIdFromGroupingList = data.functionaltype;
          }
          if (data.mountingtype) {
            vm.mountingTypeIDFromGroupingList = data.mountingtype;
          }
          vm.selectedGroupText = data.groupname;
        }
        if (vm.functionalTypeIdFromGroupingList) {
          vm.advancedFilterOptions.functionalTypeListModel = [vm.functionalTypeIdFromGroupingList];
        }
        if (vm.mountingTypeIDFromGroupingList) {
          vm.advancedFilterOptions.mountingTypeListModel = [vm.mountingTypeIDFromGroupingList];
        }
        //commented BaseService.reloadUIGrid because creating issue in clear column filter using chip from advance filter
        //BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
        //vm.loadData();

        // In case of Grid Visible flag set true then go for Load Data (As that flag will Update from Advance Filter) - [SHUBHAM - 04/12/2021]
        if (vm.isGridVisible) {
          resetPaginationAndLoadData();
        }
        if (returnObject && returnObject.isGridVisible && !vm.isGridVisible && !vm.isSearchFromHeader) {
          vm.isGridVisible = true;
        };
        if (vm.isSearchFromHeader) {
          configureFilterObject();
          getComponentList(true);
        }
      }
    };

    vm.clearGridData = () => {
      vm.isNoDataFound = false;
      vm.sourceData = [];
      vm.currentdata = vm.totalSourceDataCount = 0;
      vm.isGridVisible = false;
      vm.pagingInfo.SearchColumns = [];
    };

    vm.showExternalValuesPopup = () => {
      var data = [];
      DialogFactory.dialogService(
        USER.ADMIN_COMPONENT_ENTERNAL_VALUES_POPUP_CONTROLLER,
        USER.ADMIN_COMPONENT_ENTERNAL_VALUES_POPUP_VIEW, null, data).then(() => {
          // success
        }, () => {
          //vm.getFunctionalTypePartList(vm.cid);
        }, (err) => BaseService.getErrorLog(err));
    };
    //Export Selected Parts in Excel file
    vm.excelExportSelectedComponent = () => {
      let selectedIDs = [];
      if (!vm.selectedRowsList || vm.selectedRowsList.length === 0) {
        return;
      }
      else {
        selectedIDs = vm.selectedRowsList.map((componentitem) => componentitem.id);
      }
      if (selectedIDs) {
        const objIDs = {
          id: selectedIDs
        };
        vm.cgBusyLoading = ComponentFactory.getComponentListForPartStat(objIDs).then((res) => {
          if (res.data) {
            const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
            const link = document.createElement('a');
            if (link.download !== undefined) {
              const TimeStamp = $filter('date')(new Date(), CORE.DateFormatArray[0].format);
              const url = URL.createObjectURL(blob);
              link.setAttribute('href', url);
              link.setAttribute('download', 'Parts_' + TimeStamp);
              link.style = 'visibility:hidden';
              document.body.appendChild(link);
              $timeout(() => {
                link.click();
                document.body.removeChild(link);
              });
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        //show validation message no data selected
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContent.message = stringFormat(messageContent.message, 'part');
        const alertModel = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(alertModel);
      }
    };

    vm.copyPart = (rowData, ev) => {
      //let obj = { AssyID: rowData.id };
      DialogFactory.dialogService(
        USER.ADMIN_COPY_ASSEMBLY_POPUP_CONTROLLER,
        USER.ADMIN_COPY_ASSEMBLY_POPUP_VIEW,
        ev,
        rowData).then(() => {
          // success
        }, () => {
          // cancel
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.createDuplicatePart = (rowData, ev) => {
      DialogFactory.dialogService(
        USER.ADMIN_CREATE_ASSEMBLY_REVISION_POPUP_CONTROLLER,
        USER.ADMIN_CREATE_ASSEMBLY_REVISION_POPUP_VIEW,
        ev,
        rowData).then((responseDetail) => {
          if (responseDetail && Array.isArray(responseDetail) && responseDetail.length > 0) {
            const partID = responseDetail[0].id ? responseDetail[0].id : responseDetail[0].partId;
            BaseService.goToComponentDetailTab(vm.mfgType, partID);
          }
          BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
        }, () => {
          // cancel
        }, (err) => BaseService.getErrorLog(err));
    };

    //get data sheet link
    vm.getDataSheetLink = (item) => {
      if (item.dataSheetLink) {
        if (_.includes(item.dataSheetLink, 'http')) {
          return item.dataSheetLink;
        }
        else {
          return stringFormat('{0}{1}{2}{3}{4}{5}', CORE.WEB_URL, USER.COMPONENT_DATASHEET_BASE_PATH, item.documentPath, '/', USER.COMPONENT_DATASHEET_FOLDER_NAME, item.dataSheetLink);
        }
      }
    };
    /*Method to Show Part History
     *used Method Name "UMIDHistory" because used UMID History UI grid button*/
    vm.UMIDHistory = (row) => {
      var data = {
        mfgType: CORE.MFG_TYPE.MFG,
        mfgCode: row.mfgCode,
        mfgcodeID: row.mfgcodeID,
        mfgPN: row.mfgPN,
        partId: row.id,
        PIDCode: row.PIDCode,
        rohsIcon: vm.rohsImagePath + row.rohsIcon,
        rohsName: row.rohsComplientConvertedValue
      };
      var _dummyEvent = null;

      DialogFactory.dialogService(
        CORE.COMPONENT_HISTORY_POPUP_MODAL_CONTROLLER,
        CORE.COMPONENT_HISTORY_POPUP_MODAL_VIEW,
        _dummyEvent,
        data).then(() => {
          // success
        }, () => {
          //BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
        }, (error) => BaseService.getErrorLog(error));
    };
    /*open document tab in browers new tab*/
    //In  part document tab  , docOpenType : 0-normal rout , 1-to open operator folder , 2- to upload image
    vm.openDocumentTab = (row) => {
      const routeState = vm.mfgType.toUpperCase() === CORE.MFG_TYPE.MFG ? USER.ADMIN_MANAGECOMPONENT_DOCUMENT_STATE : USER.ADMIN_MANAGEDISTCOMPONENT_DOCUMENT_STATE;
      BaseService.openInNew(routeState, { coid: row.id, docOpenType: 1 });
    };
    /*open eco.dfm tab in browers new tab*/
    vm.openEcoDfmTab = (row) => {
      const routeState = vm.mfgType.toUpperCase() === CORE.MFG_TYPE.MFG ? USER.ADMIN_MANAGECOMPONENT_DFM_STATE : USER.ADMIN_MANAGEDISTCOMPONENT_DFM_STATE;
      BaseService.openInNew(routeState, { coid: row.id });
    };
    let isOpenPopup = false;
    function openErrorListPopup() {
      var data = {
        transactionID: vm.transactionID,
        isPartmaster: true
      };
      isOpenPopup = true;
      DialogFactory.dialogService(
        RFQTRANSACTION.API_VERIFICATION_ERROR_CONTROLLER,
        RFQTRANSACTION.API_VERIFICATION_ERROR_VIEW,
        vm.dummyevent,
        data).then(() => {
          isOpenPopup = false;
        }, (data) => {
          isOpenPopup = false;
          removePartStatus();
          if (data.iscontinue) {
            vm.componentVerification(vm.dummyRow, vm.dummyevent);
          }
        });
    }
    function removePartStatus() {
      var objRemoval = {
        transactionID: vm.transactionID
      };
      ComponentFactory.removePartStatus().save(objRemoval).$promise.then(() => {
        // success
      }).catch((error) => BaseService.getErrorLog(error));
    }
    angular.element(() => {
      setFocus('attributesSearchHeader');
      vm.updatePartsAttributesFeature = BaseService.checkFeatureRights(CORE.FEATURE_NAME.UpdatePartsAttributes);
      vm.updatePartsMPNPID = BaseService.checkFeatureRights(CORE.FEATURE_NAME.UpdatePartsMPNPID);
      vm.stopExternalPartUpdateFeature = BaseService.checkFeatureRights(CORE.FEATURE_NAME.StopExternalPartUpdate);
    });

    vm.deleteBOM = function (row) {
      const data = {
        rfqAssyID: row.rfqAssyID,
        partID: row.id
      };
      DialogFactory.dialogService(
        RFQTRANSACTION.DELETE_BOM_CONFIRMATION_CONTROLLER,
        RFQTRANSACTION.DELETE_BOM_CONFIRMATION_VIEW,
        null,
        data).then(() => {
          vm.loadData();
        }, (err) => BaseService.getErrorLog(err));
    };

    //get part master progress bar and remain time to update part
    const getProgressDetail = (type, transactionId, isNotifyMessage) => {
      ImportBOMFactory.retrieveBOMorPMPregressStatus().query({ type: type, transactionID: transactionId }).$promise.then((response) => {
        if (response && response.data && response.data.length > 0) {
          const partProgressData = response.data[0];
          vm.totalParts = partProgressData.totalParts;
          vm.remainingParts = partProgressData.remainingParts;
          vm.remainTime = partProgressData.remainTime;
          vm.messageToShowProgress = seconds_to_days_hours_mins_secs_str(vm.remainTime);

          if (!vm.remainingParts && isNotifyMessage) {
            NotificationFactory.success(CORE.MESSAGE_CONSTANT.COMPONENT_VERIFICATION_SUCCESS_MESSAGE);
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    getProgressDetail(CORE.DIGIKEY_TYPE_ACC.FJT_SCHEDULE_PARTUPDATEV3, null);

    //stop external part update
    vm.stopExternalPartUpdate = () => {
      var messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.PART_STOP_CONFIRMATION);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          const objUpdate = { type: CORE.DIGIKEY_TYPE_ACC.FJT_SCHEDULE_PARTUPDATEV3 };
          vm.cgBusyLoading = ComponentFactory.stopExternalPartUpdate().query(objUpdate).$promise.then(() => {
            vm.remainingParts = 0;
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }, () => {
        // cancel
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.updateChartOfAccounts = (id) => {
      const loginUserAllAccessPageRoute = _.map(BaseService.loginUserPageList, (item) => item.PageDetails && item.PageDetails.pageRoute);
      if (!_.find(loginUserAllAccessPageRoute, (item) => item === USER.ADMIN_CHART_OF_ACCOUNTS_STATE)) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.POPUP_ACCESS_DENIED);
        messageContent.message = stringFormat(messageContent.message, CORE.Chart_of_Accounts.SINGLELABEL.toLowerCase());
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
      } else {
        const PopupData = {
          acct_id: id
        };
        DialogFactory.dialogService(
          CORE.MANAGE_CHART_OF_ACCOUNTS_MODAL_CONTROLLER,
          CORE.MANAGE_CHART_OF_ACCOUNTS_MODAL_VIEW,
          event,
          PopupData).then(() => {
          }, () => {
          }, (err) => BaseService.getErrorLog(err));
      }
    };

    ///update ui for part update details after stopping
    function stopPartUpdate(user) {
      getProgressDetail(CORE.DIGIKEY_TYPE_ACC.FJT_SCHEDULE_PARTUPDATEV3, null);
      if (user && user.id !== vm.loginUser.userid) {
        vm.remainingParts = 0;
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.PART_UPDATE_STOPP);
        messageContent.message = stringFormat(messageContent.message, user.username);
        const alertModel = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(alertModel);
      }
    }

    /* Open popup for display history of entry change */
    vm.showVersionHistory = (row, componentId, ev) => {
      BaseService.showVersionHistory(row, componentId, ev);
    };

    /**
     * Redirect to Part master edit case for UMID tab
     * @param {any} mfgType - Supplier/Manufacturer
     * @param {any} partId - ID of Selected Part
     */
    vm.goToComponentUMIDList = (mfgType, partId) => {
      BaseService.goToComponentUMIDList(partId, mfgType);
    };

    // ------------------------------------------ [S] - Import Part Section -----------------------------
    // get derived Verification MPN list
    function getVerificationMPNList() {
      vm.cgBusyLoading = ComponentFactory.getVerificationMPNList().query().$promise.then((response) => {
        if (response && response.data) {
          vm.apiVerificationErrorCount = (_.filter(_.uniqBy(response.data, 'importMfgPN'), (error) => !error.isVerified)).length;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }
    getVerificationMPNList();
    vm.importDetail = (ev, newimport) => {
      const popUpData = { popupAccessRoutingState: [USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE], pageNameAccessLabel: CORE.LabelConstant.PART_MASTER.PageName };
      const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
      if (isAccessPopUp) {
        vm.event = ev;
        if (vm.apiVerificationErrorCount > 0 && !newimport) {
          openMFRErrorPopup();
        } else {
          DialogFactory.dialogService(
            CORE.COMPONENT_IMPORT_MODAL_CONTROLLER,
            CORE.COMPONENT_IMPORT_MODAL_VIEW,
            vm.event,
            null).then(() => {
              getVerificationMPNList();
            }, () => {
              getVerificationMPNList();
            }, (err) => BaseService.getErrorLog(err));
        }
      }
    };

    // open derived manufacturer popup
    function openMFRErrorPopup() {
      DialogFactory.dialogService(
        CORE.COMPONENT_IMPORT_MAPP_ERROR_MODAL_CONTROLLER,
        CORE.COMPONENT_IMPORT_MAPP_ERROR_MODAL_VIEW,
        vm.event,
        null).then(() => {
          getVerificationMPNList();
        }, () => {
          getVerificationMPNList();
        }, (err) => BaseService.getErrorLog(err));
    }
    // ------------------------------------------ [E] - Import Part Section -----------------------------

    vm.clearHeaderSearch = () => {
      if (vm.searchObj && (vm.searchObj.keywords || vm.searchObj.headersearchkeywords)) {
        $state.transitionTo($state.$current, {}, { reload: true, location: true, notify: true });
      } else {
        vm.attributesSearchHeader = '';
      }
    };
  }
})();
