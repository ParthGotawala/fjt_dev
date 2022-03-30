(function () {
  'use strict';
  angular.module('app.core').directive('customerCpnParts', customerCpnParts);

  /** @ngInject */
  function customerCpnParts() {
    const directive = {
      restrict: 'E',
      replace: true,
      scope: {
        customerId: '=',
        keywords: '=?',
        componentId: '=?',
        mfgPn: '=?',
        mfgCode: '=?',
        mfgName: '=?'
      },
      templateUrl: 'app/directives/custom/customer-cpn-parts/customer-cpn-parts.html',
      controller: CustomerCPNPartsController,
      controllerAs: 'vm',
      link: function () {
      }
    };
    return directive;

    /** @ngInject */
    /**
    * Directive for view data of customer CPN
    * @param
    */
    function CustomerCPNPartsController($state, $scope, $mdDialog, $stateParams, $timeout, DialogFactory, BaseService, CORE, USER,
      DataElementTransactionValueFactory, CustomerFactory, ComponentFactory, ManufacturerFactory, MasterFactory, ChartOfAccountsFactory,
      ImportExportFactory, RFQTRANSACTION) {
      const vm = this;
      vm.customerId = $scope.customerId;
      vm.keywords = $scope.keywords;
      vm.componentId = $scope.componentId;
      let _dummyEvent = null;
      vm.isHideDelete = true;
      vm.isDeleteFeatureBased = true;
      let isCPNUploaded = false;
      vm.mfgType = CORE.MFG_TYPE.MFG;
      vm.gridConfig = CORE.gridConfig;
      vm.LabelConstant = CORE.LabelConstant;
      vm.EmptyMesssageComponantalias = USER.ADMIN_EMPTYSTATE.COMPONANT_CUST_ALIAS_REV;
      vm.EmptyMesssageComponantaliasPN = USER.ADMIN_EMPTYSTATE.COMPONANT_CUST_ALIAS_REV_PN;
      vm.loginUser = BaseService.loginUser;
      vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
      vm.CPNGridHeaderDropdown = CORE.CPNGridHeaderDropdown;
      vm.enabledDeleteMPNMapping = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToDeleteMPNFromCPNMapping);
      const _cpnItemsHeaders = [{ name: vm.LabelConstant.MFG.CPN, field: 'cpn', displayOrder: 1, isActive: true, isRequired: true }, { name: vm.LabelConstant.BOM.CPN_REV, field: 'revision', displayOrder: 2, isActive: true }, { name: vm.LabelConstant.MFG.MFG, field: 'mfgCode', displayOrder: 3, isActive: true, isRequired: true }, { name: vm.LabelConstant.MFG.MFGPN, field: 'mfgPN', displayOrder: 4, isActive: true, isRequired: true }];

      const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;

      //initialize paging info for customer alias rev. grid
      const initPageInfo = () => {
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),
          SortColumns: [['rev', 'ASC']],
          SearchColumns: []
        };
        if (vm.keywords) {
          vm.pagingInfo.SearchColumns = [{ 'ColumnName': 'custAssyPN', 'SearchString': decodeURIComponent(vm.keywords) }];
        }
      };
      initPageInfo();
      //initialize paging info for component grid
      const initComponentPageInfo = () => {
        vm.ComponentPageInfo = {
          Page: CORE.UIGrid.Page(),
          SortColumns: [],
          SearchColumns: []
        };
      };
      initComponentPageInfo();
      //grid options for customer alias rev. grid
      vm.gridOptions = {
        enablePaging: isEnablePagination,
        enablePaginationControls: isEnablePagination,
        showColumnFooter: false,
        enableRowHeaderSelection: false,
        enableFullRowSelection: false,
        enableRowSelection: false,
        multiSelect: false,
        filterOptions: vm.pagingInfo.SearchColumns,
        //CurrentPage: CORE.PAGENAME_CONSTANT[13].PageName,
        exporterMenuCsv: true,
        exporterCsvFilename: 'CPN.csv'
      };
      //grid options for component grid
      vm.ComponentgridOptions = {
        enablePaging: isEnablePagination,
        enablePaginationControls: isEnablePagination,
        showColumnFooter: false,
        enableRowHeaderSelection: false,
        enableFullRowSelection: false,
        enableRowSelection: false,
        multiSelect: false,
        filterOptions: vm.pagingInfo.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: 'Customer_MFG_PN_Mapping.csv',
        isShowDelete: true,
        isDeleteFeatureBased: true
      };

      function setFilterDetails() {
        if (vm.gridOptions && vm.gridOptions.gridApi && vm.keywords) {
          vm.gridOptions.gridApi.grid.getColumn('custAssyPN').filters[0] = {
            term: decodeURIComponent(vm.keywords)
          };
          vm.keywords = null;
        }
      }

      //source header for customer alias rev. grid
      vm.sourceHeader = [
        {
          field: 'Apply',
          displayName: 'Select',
          width: '75',
          cellTemplate: '<div class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox"><md-checkbox  ng-model="row.entity.isCPNRecordSelected" \
                           ng-disabled="!row.entity.isCPN" \
                           ng-change="grid.appScope.$parent.vm.getSelectedCPNRow(row.entity)" ></md-checkbox></div > ',
          enableFiltering: false,
          enableSorting: false,
          exporterSuppressExport: true,
          pinnedLeft: false,
          enableColumnMoving: false,
          manualAddedCheckbox: true
        },
        {
          field: '#',
          width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
          cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
          enableFiltering: false,
          enableSorting: false
        },
        {
          field: 'customer',
          width: '210',
          displayName: vm.LabelConstant.MFG.CustomerCode,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                              <a class="cm-text-decoration underline" ng-if="row.entity.mfgcodeID > 0"\
                                  ng-click="grid.appScope.$parent.vm.editManufacturer(row.entity.mfgType,row.entity.mfgcodeID);"\
                                  tabindex="-1">{{COL_FIELD}}</a>\
                              <span ng-if="row.entity.mfgcodeID <= 0">{{COL_FIELD}}</span>\
                          </div>',
          enableFiltering: true,
          enableSorting: true
        }, {
          field: 'mfgPN',
          width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
          displayName: vm.LabelConstant.MFG.MFGPN,
          cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-class="{\'text-line-through\': (row.entity.restrictUsePermanently == true || row.entity.restrictUSEwithpermission == true) }">\
                              <common-pid-code-label-link component-id="row.entity.id"\
                                                         label="grid.appScope.$parent.vm.LabelConstant.MFG.MFGPN" \
                                                         value="COL_FIELD"\
                                                         is-copy="true"\
                                                         rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.rohsIcon"\
                                                         rohs-status="row.entity.rohsComplientConvertedValue"\
                                                         is-search-digi-key="!row.entity.isCustom" is-search-findchip="!row.entity.isCustom"\
                                                         is-supplier="false"> \
                                  </common-pid-code-label-link> \
                            </div>',
          enableFiltering: true,
          enableSorting: true
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
                            ng-click="grid.appScope.$parent.vm.showVersionHistory(row.entity,row.entity.id,$event)"><a>{{COL_FIELD}}</a></div>',
          enableFiltering: true,
          enableSorting: true
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
          displayName: vm.LabelConstant.MFG.PartType,
          width: 120,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        }, {
          field: 'mfgPNDescription',
          width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
          displayName: vm.LabelConstant.MFG.MFGPNDescription,
          cellTemplate: '<div class="ui-grid-cell-contents ui-grid-cell-contents-break text-left">{{COL_FIELD}}</div>',
          enableFiltering: true,
          enableSorting: true
        }];
      //source header for component grid
      vm.ComponentsourceHeader = [{
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="grid.appScope.$parent.vm.loginUser.uiGridPreference !== \'P\'">\
        <span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span>\
        </div>\
        <div class="ui-grid-cell-contents grid-cell-text-right" ng-if="grid.appScope.$parent.vm.loginUser.uiGridPreference === \'P\'">\
        <span><b>{{(grid.appScope.$parent.vm.ComponentPageInfo.pageSize * (grid.appScope.$parent.vm.ComponentPageInfo.Page - 1)) + (grid.renderContainers.body.visibleRowCache.indexOf(row) + 1)}}</b></span>\
        </div>',
        enableFiltering: false,
        enableSorting: false
      }, {
        field: 'mfrCode',
        width: '210',
          displayName: vm.LabelConstant.MFG.MFG,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                              <a class="cm-text-decoration underline" ng-if="row.entity.mfgcodeID > 0"\
                                  ng-click="grid.appScope.$parent.vm.editManufacturer(row.entity.mfgType,row.entity.mfgcodeID);"\
                                  tabindex="-1">{{COL_FIELD}}</a>\
                              <span ng-if="row.entity.mfgcodeID <= 0">{{COL_FIELD}}</span>\
                          </div>',
        enableFiltering: true,
        enableSorting: true
      }, {
        field: 'mfgPN',
        width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
        displayName: vm.LabelConstant.MFG.MFGPN,
        cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-class="{\'text-line-through\': (row.entity.restrictUsePermanently == true || row.entity.restrictUSEwithpermission == true) }">\
                              <common-pid-code-label-link component-id="row.entity.refComponentID"\
                                                         label="grid.appScope.$parent.vm.LabelConstant.MFG.MFGPN" \
                                                         value="COL_FIELD"\
                                                         is-copy="true"\
                                                         rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.rohsIcon"\
                                                         rohs-status="row.entity.rohsComplientConvertedValue"\
                                                         is-search-digi-key="!row.entity.isCustom" is-search-findchip="!row.entity.isCustom"\
                                                         is-supplier="false"> \
                                  </common-pid-code-label-link> \
                            </div>',
        enableFiltering: true,
        enableSorting: true
      }, {
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
      }, {
        field: 'mfgPNDescription',
        width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
        displayName: vm.LabelConstant.MFG.MFGPNDescription,
        cellTemplate: '<div class="ui-grid-cell-contents ui-grid-cell-contents-break text-left">{{COL_FIELD}}</div>',
        enableFiltering: true,
        enableSorting: true
      }, {
        field: 'createdAt',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableFiltering: false
      }, {
        field: 'createdbyRole',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }, {
        field: 'createdby',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }];

      //get customer alias rev. data for grid bind
      vm.loadData = () => {
        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        vm.pagingInfo.customerID = vm.customerId ? vm.customerId : null;
        vm.pagingInfo.componentId = vm.componentId ? vm.componentId : null;
        if (vm.pagingInfo.customerID || vm.pagingInfo.componentId) {
          vm.cgBusyLoading = ComponentFactory.getComponentCustAliasRevByCustId().query(vm.pagingInfo).$promise.then((CompCustAliasRev) => {
            if (CompCustAliasRev && CompCustAliasRev.data) {
              setDataAfterGetAPICall(CompCustAliasRev, false);
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
        else {
          vm.isNoDataFound = true;
          vm.emptyState = null;
        }
      };

      //get data down for customer alias rev. grid
      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.cgBusyLoading = ComponentFactory.getComponentCustAliasRevByCustId().query(vm.pagingInfo).$promise.then((CompCustAliasRev) => {
          if (CompCustAliasRev && CompCustAliasRev.data) {
            setDataAfterGetAPICall(CompCustAliasRev, true);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };
      // to set data in grid after data is retrieved from API in loadData() and getDataDown() function
      const setDataAfterGetAPICall = (CompCustAliasRev, isGetDataDown) => {
        if (CompCustAliasRev && CompCustAliasRev.data && CompCustAliasRev.data.CompCustAliasRev) {
          if (!isGetDataDown) {
            vm.sourceData = CompCustAliasRev.data.CompCustAliasRev;
            vm.currentdata = vm.sourceData.length;
            if (vm.sourceData.length > 0) {
              if (!vm.CPNPartID) {
                const firstRow = _.find(vm.sourceData, (x) => x.isCPN);
                if (firstRow) {
                  vm.CPNPartID = firstRow.id;
                  firstRow.isCPNRecordSelected = true;
                }
              }
              else {
                _.each(vm.sourceData, (item) => {
                  item.isCPNRecordSelected = false;
                });

                const selectedRow = _.find(vm.sourceData, (item) => item.id === vm.CPNPartID && item.isCPN);
                if (selectedRow) {
                  selectedRow.isCPNRecordSelected = true;
                }
                else {
                  const firstRow = _.find(vm.sourceData, (x) => x.isCPN);
                  if (firstRow) {
                    vm.CPNPartID = firstRow.id;
                    firstRow.isCPNRecordSelected = true;
                  } else {
                    vm.CPNPartID = null;
                  }
                }
              }
            }
            else {
              vm.CPNPartID = null;
            }
          }
          else if (CompCustAliasRev.data.CompCustAliasRev.length > 0) {
            vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(CompCustAliasRev.data.CompCustAliasRev);
            vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
          }

          // must set after new data comes
          vm.totalSourceDataCount = CompCustAliasRev.data.Count;
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
            if (!isGetDataDown) {
              vm.resetSourceGrid();
              vm.ComponentPageInfo.Page = vm.ComponentgridOptions.paginationCurrentPage = CORE.UIGrid.Page();
              vm.ComponentloadData();
              $timeout(() => { setFilterDetails(); });
              if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
                return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
              }
            }
            else {
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount !== vm.currentdata ? true : false);
            }
          });
        }
      };
      //on selection for customer grid
      vm.getSelectedCPNRow = (row) => {
        if (row && row.id) {
          if (row.id !== vm.CPNPartID) {
            _.each(vm.sourceData, (item) => {
              item.isCPNRecordSelected = false;
            });
            vm.CPNPartID = row.id;
            vm.cpnPartNum = row.custAssyPN;
            vm.cpnRev = row.rev;
            vm.CPNMFGPN = row.mfgPN;
            row.isCPNRecordSelected = true;
            vm.ComponentloadData();
          }
          else {
            row.isCPNRecordSelected = true;
          }
        }
      };
      //get customer MFG PN mapping component data for grid bind
      vm.ComponentloadData = () => {
        BaseService.setPageSizeOfGrid(vm.ComponentPageInfo, vm.ComponentgridOptions);
        vm.ComponentPageInfo.ComponentCustAliasRevID = vm.CPNPartID;
        if (vm.CPNPartID) {
          vm.cgBusyLoading = ComponentFactory.getComponentCustAliasRevPNByCustId().query(vm.ComponentPageInfo).$promise.then((CompCustAliasRevPN) => {
            if (CompCustAliasRevPN && CompCustAliasRevPN.data) {
              vm.refComponentIDList = [];
              setComponentDataAfterGetAPICall(CompCustAliasRevPN, false);
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
        else {
          vm.refComponentIDList = [];
        }
      };
      //get data down for component grid
      vm.ComponentgetDataDown = () => {
        vm.ComponentPageInfo.Page = vm.ComponentPageInfo.Page + 1;
        vm.cgBusyLoading = ComponentFactory.getComponentCustAliasRevPNByCustId().query(vm.ComponentPageInfo).$promise.then((CompCustAliasRevPN) => {
          if (CompCustAliasRevPN && CompCustAliasRevPN.data) {
            setComponentDataAfterGetAPICall(CompCustAliasRevPN, true);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.autoCompleteComponentAlias = {
        columnName: 'mfgPN',
        keyColumnName: 'id',
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        keyColumnId: null,
        inputName: vm.LabelConstant.MFG.MFGPN,
        placeholderName: vm.LabelConstant.MFG.MFGPN,
        isAddnew: true,
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          popupAccessRoutingState: [USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE],
          pageNameAccessLabel: CORE.LabelConstant.PART_MASTER.PageName
        },
        callbackFn: function (obj) {
          const searchObj = {
            id: obj.id,
            mfgType: CORE.MFG_TYPE.MFG,
            inputName: vm.autoCompleteComponentAlias.inputName,
            categoryID: CORE.PartCategory.Component
          };
          return getAliasSearch(searchObj);
        },
        onSelectCallbackFn: addSelectedMappingMFGPart,
        onSearchFn: function (query) {
          const searchObj = {
            mfgType: CORE.MFG_TYPE.MFG,
            isGoodPart: CORE.PartCorrectList.CorrectPart,
            query: query,
            inputName: vm.autoCompleteComponentAlias.inputName,
            categoryID: CORE.PartCategory.Component
          };
          return getAliasSearch(searchObj);
        }
      };
      //get alias for auto-complete-search
      function getAliasSearch(searchObj) {
        return ComponentFactory.getComponentMFGAliasSearch().query({ listObj: searchObj }).$promise.then((componentAlias) => {
          if (componentAlias && componentAlias.data.data) {
            componentAlias.data.data = _.reject(componentAlias.data.data, (item) => {
              var component = _.filter(vm.refComponentIDList, (obj) => obj === item.id);
              if (component.length > 0) {
                return true;
              }
              else {
                const addComponent = _.find(vm.addedPartListFromAutoComplete, (objAddedMFGItem) => objAddedMFGItem.id === item.id);
                if (addComponent) {
                  return true;
                }
              }
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

      /* when selected mapping mfg from auto complete */
      function addSelectedMappingMFGPart(selectedItem) {
        if (selectedItem) {
          checkCustomPartValidation(selectedItem);
        }
      };
      vm.autoCompleteComponentCPNAlias = {
        columnName: 'mfgPN',
        keyColumnName: 'id',
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        keyColumnId: null,
        inputName: 'CPN Part',
        placeholderName: vm.LabelConstant.MFG.MFGPN,
        isAddnew: true,
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          popupAccessRoutingState: [USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE],
          pageNameAccessLabel: CORE.LabelConstant.PART_MASTER.PageName,
          customerID: vm.customerId,
          category: CORE.PartCategory.Component,
          isCPNPartEntry: true,
          refComponentId: vm.componentId
        },
        callbackFn: function (obj) {
          const searchObj = {
            id: obj.id,
            mfgType: CORE.MFG_TYPE.MFG,
            inputName: vm.autoCompleteComponentCPNAlias.inputName,
            categoryID: CORE.PartCategory.Component,
            isContainCPN: true,
            strictCPNPart: true
          };
          return getCPNPartSearch(searchObj);
        },
        onSelectCallbackFn: addSelectedCPNMFGPart,
        onSearchFn: function (query) {
          const searchObj = {
            mfgType: CORE.MFG_TYPE.MFG,
            isGoodPart: CORE.PartCorrectList.CorrectPart,
            query: query,
            inputName: vm.autoCompleteComponentCPNAlias.inputName,
            categoryID: CORE.PartCategory.Component,
            isContainCPN: true,
            strictCPNPart: true
          };
          return getCPNPartSearch(searchObj);
        }
      };
      //get alias for auto-complete-search
      function getCPNPartSearch(searchObj) {
        return ComponentFactory.getComponentMFGAliasSearch().query({ listObj: searchObj }).$promise.then((componentAlias) => {
          if (componentAlias && componentAlias.data.data) {
            componentAlias.data.data = _.reject(componentAlias.data.data, (item) => {
              var component = _.filter(vm.refComponentIDList, (obj) => obj === item.id);
              if (component.length > 0) {
                return true;
              }
              else {
                const addComponent = _.find(vm.addedPartListFromAutoComplete, (objAddedMFGItem) => objAddedMFGItem.id === item.id);
                if (addComponent) {
                  return true;
                }
              }
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

      /* when selected mapping mfg from auto complete */
      function addSelectedCPNMFGPart(selectedItem) {
        if (selectedItem) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.ADD_ALTERNATE_PART_CPN_WITH_AVL_CONFIRMATION);
          const mfgAVLRedirectURL = BaseService.generateManufacturerDetailRedirectURL(CORE.CUSTOMER_TYPE.MANUFACTURER, selectedItem.id, true, true, selectedItem.mfgName, selectedItem.mfgCode);
          const cpnParthyperLink = BaseService.generateComponentRedirectURL(selectedItem.id, CORE.MFG_TYPE.MFG, true, selectedItem.orgMfgPN);

          const mfgRedirectURL = BaseService.generateManufacturerDetailRedirectURL(CORE.CUSTOMER_TYPE.MANUFACTURER, selectedItem.id, true, true, $scope.mfgName, $scope.mfgCode);
          const avlPartHyperLink = BaseService.generateComponentRedirectURL(vm.componentId, CORE.MFG_TYPE.MFG, true, $scope.mfgPn);

          messageContent.message = stringFormat(messageContent.message, `${mfgRedirectURL} ${avlPartHyperLink}`, `${mfgAVLRedirectURL} ${cpnParthyperLink}`);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              const avlPartDet = {
                id: vm.componentId
              };
              vm.saveCPN(avlPartDet, selectedItem.id, true);
            }
          }, () => {
            vm.autoCompleteComponentCPNAlias.keyColumnId = null;
            vm.wizardStep5ComponentAlias.$setDirty(true);
            $timeout(() => {
              $scope.$broadcast(vm.autoCompleteComponentCPNAlias.inputName, null);
            });
          });
        }
      };

      // save AVL part
      function saveAVLPart(selectedItem) {
        vm.cgBusyLoading = ManufacturerFactory.getAssumblyListFromCPN().query({ id: vm.CPNPartID }).$promise.then((response) => {
          if (response && response.data && response.data.length > 0) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.ADD_ALTERNATE_PART_CONFIRMATION_BOM_BODY_MESSAGE);
            messageContent.message = stringFormat(messageContent.message, selectedItem.mfgPN);
            const subMessage = [];
            const message = messageContent.message + '<br/><br/><table style=\'width:100%\'><thead><tr><th class=\'border-bottom padding-5\'>#</th><th class=\'border-bottom padding-5\'>' + vm.LabelConstant.Assembly.PIDCode + '</th></tr></thead><tbody>{0}</tbody></table>';
            _.each(response.data, (item, index) => {
              const redirectURL = BaseService.generateComponentRedirectURL(item.id, CORE.MFG_TYPE.MFG);
              const hyperLink = BaseService.getHyperlinkHtml(redirectURL, item.PIDCode);
              subMessage.push('<tr><td class="border-bottom padding-5">' + (index + 1) + '</td><td class="border-bottom padding-5">' + hyperLink);
            });
            messageContent.message = stringFormat(message, subMessage.join(''));
            const obj = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
            };
            DialogFactory.messageConfirmDialog(obj).then((yes) => {
              if (yes) {
                vm.saveCPN(selectedItem, vm.CPNPartID);
              }
            }, () => {
            });
          }
          else {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.ADD_ALTERNATE_PART_CPN_CONFIRMATION);
            messageContent.message = stringFormat(messageContent.message, selectedItem.mfgPN);
            const obj = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
            };
            DialogFactory.messageConfirmDialog(obj).then((yes) => {
              if (yes) {
                vm.saveCPN(selectedItem, vm.CPNPartID);
              }
            }, () => {
              vm.autoCompleteComponentAlias.keyColumnId = null;
              vm.wizardStep5ComponentAlias.$setDirty(true);
              $timeout(() => {
                $scope.$broadcast(vm.autoCompleteComponentAlias.inputName, null);
              });
            });
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }

      function customPartRevMismatchValicationMessage() {
        const messgaeContent = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.AVL_CUSTOME_PART_REV_SHOULD_SAME;
        const obj = {
          messageContent: messgaeContent
        };
        return DialogFactory.messageAlertDialog(obj).then(() => {
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }

      // Check Custom Part rev validation for CPN AVL parts
      function checkCustomPartValidation(selectedItem) {
        const objReq = {
          refCPNID: vm.CPNPartID
        };
        vm.cgBusyLoading = ManufacturerFactory.getAVLPartDetailByCPNID().save(objReq).$promise.then((resAVLParts) => {
          if (resAVLParts && resAVLParts.data && resAVLParts.data.length > 0) {
            resAVLParts.data = _.filter(resAVLParts.data, (item) => {
              if (item.refAVLPart && (item.refAVLPart.isCustom && item.refAVLPart.rev !== selectedItem.rev) || (!item.refAVLPart.isCustom && item.refAVLPart.rev !== selectedItem.rev)) {
                return true;
              }
            });

            if (resAVLParts.data.length > 0 || (selectedItem.isCustom && selectedItem.rev !== vm.cpnRev)) {
              customPartRevMismatchValicationMessage();
            } else {
              saveAVLPart(selectedItem);
            }
          } else if (selectedItem.isCustom && selectedItem.rev !== vm.cpnRev) {
            customPartRevMismatchValicationMessage();
          } else {
            saveAVLPart(selectedItem);
          }
        }).catch((error) => {
          BaseService.getErrorLog(error);
          return true;
        });
      };
      vm.addUpdaterevisionPN = () => {
        //!vm.wizardStep5ComponentAlias.$valid || !vm.checkFormDirty(vm.wizardStep5ComponentAlias) || vm.addedPartListFromAutoComplete.length == 0
        if (vm.addedPartListFromAutoComplete.length === 0) {
          vm.autoCompleteComponentAlias.isRequired = true;
          BaseService.focusRequiredField(vm.wizardStep5ComponentAlias);
          return;
        }
        vm.cgBusyLoading = ManufacturerFactory.getAssumblyListFromCPN().query({ id: data.refCPNPartID }).$promise.then((response) => {
          if (response && response.data && response.data.length > 0) {
            const AssemblyList = _.map(response.data, 'PIDCode').join(',');
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.ADD_ALTERNATE_PART_CONFIRMATION_BOM_BODY_MESSAGE);
            messageContent.message = stringFormat(messageContent.message, AssemblyList);
            const obj = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
            };
            DialogFactory.messageConfirmDialog(obj).then((yes) => {
              if (yes) {
                vm.saveCPN();
              }
            }, () => {
            });
          }
          else {
            vm.saveCPN();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.saveCPN = (selectedPart, cpnPartID, isFocusCPNAutoCom) => {
        var custRevisionPnModel = {
          refCPNPartID: cpnPartID,
          customerID: vm.customerId,
          refComponentIDs: selectedPart.id
        };
        vm.cgBusyLoading = ManufacturerFactory.saveCustMFGPN().save(custRevisionPnModel).$promise.then((res) => {
          if (res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            vm.loadData();
            vm.autoCompleteComponentAlias.keyColumnId = null;
            vm.wizardStep5ComponentAlias.$setDirty(true);
            $timeout(() => {
              $scope.$broadcast(vm.autoCompleteComponentCPNAlias.inputName, null);
            });
          } else if (res && (typeof (res.alretCallbackFn) === 'object')) {
            res.alretCallbackFn.then(() => {
              $timeout(() => {
                $scope.$broadcast(vm.autoCompleteComponentCPNAlias.inputName, null);
              });
              setFocusByName(isFocusCPNAutoCom ? vm.autoCompleteComponentCPNAlias.inputName : vm.autoCompleteComponentAlias.inputName);
            });
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      //add customer part number
      vm.custpartnumber = (data, ev) => {
        const popUpData = { popupAccessRoutingState: [USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE], pageNameAccessLabel: vm.LabelConstant.PART_MASTER.PageName };
        const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
        if (isAccessPopUp) {
          const data = {
            mfgType: vm.mfgType,
            customerID: vm.customerId,
            isCustomPartEntry: true,
            isCPNPartEntry: true
          };
          DialogFactory.dialogService(
            CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
            CORE.MANAGE_COMPONENT_MODAL_VIEW,
            ev,
            data).then(() => {
              //BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
            }, () => {
              BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
            }, (err) => BaseService.getErrorLog(err));
        }
      };

      vm.exportCPN = () => {
        const cpnDetail = {
          customerId: vm.customerId
        };
        if (vm.componentId) {
          cpnDetail.componentId = vm.componentId;
        }

        vm.cgBusyLoading = ManufacturerFactory.exportCPNDetails().query({ cpnDetail }).$promise.then((result) => {
          if (result && result.status === CORE.ApiResponseTypeStatus.SUCCESS && result.data) {
            const cpnList = [];
            if (result.data) {
              _.each(result.data, (item, index) => {
                const obj = {};
                obj['Item'] = index + 1;
                obj[vm.LabelConstant.MFG.CustomerCode] = item.customer;
                obj[vm.LabelConstant.MFG.MFGPN] = item.mfgPN;
                obj[vm.LabelConstant.MFG.CPN] = item.custAssyPN;
                obj[vm.LabelConstant.MFG.Rev] = item.rev;
                obj['PID Code'] = item.PIDCode;
                obj['Internal Revision'] = item.liveVersion;
                obj[vm.LabelConstant.MFG.PartType] = item.PartType;
                obj['CPN'] = item.CPN;
                obj['CPN ' + vm.LabelConstant.MFG.MFGPNDescription] = item.CPNDescription;
                obj[vm.LabelConstant.MFG.MFG] = item.mfgCode;
                obj[vm.LabelConstant.MFG.MFGPN] = item.mfgPN;
                obj[vm.LabelConstant.MFG.MFGPNDescription] = item.Description;
                cpnList.push(obj);
              });
              if (cpnList.length === 0) {
                const obj = {};
                obj['Item'] = '';
                obj[vm.LabelConstant.MFG.CustomerCode] = '';
                obj[vm.LabelConstant.MFG.MFGPN] = '';
                obj[vm.LabelConstant.MFG.CPN] = '';
                obj[vm.LabelConstant.MFG.Rev] = '';
                obj['PID Code'] = '';
                obj['Internal Revision'] = '';
                obj[vm.LabelConstant.MFG.PartType] = '';
                obj['CPN'] = '';
                obj['CPN ' + vm.LabelConstant.MFG.MFGPNDescription] = '';
                obj[vm.LabelConstant.MFG.MFG] = '';
                obj[vm.LabelConstant.MFG.MFGPN] = '';
                obj[vm.LabelConstant.MFG.MFGPNDescription] = '';
                cpnList.push(obj);
              }
              if (cpnList.length > 0) {
                vm.cgBusyLoading = ImportExportFactory.importFile(cpnList).then((res) => {
                  if (res.data && cpnList.length > 0) {
                    exportFileDetail(res, 'CPN_Export_Data.xls');
                  }
                }).catch((error) => BaseService.getErrorLog(error));
              }
            }
          }
        });
      };

      // to set data in grid after data is retrieved from API in loadData() and getDataDown() function
      const setComponentDataAfterGetAPICall = (CompCustAliasRevPN, isGetDataDown) => {
        if (CompCustAliasRevPN && CompCustAliasRevPN.data && CompCustAliasRevPN.data.CompCustAliasRevPN) {
          if (!isGetDataDown) {
            vm.ComponentsourceData = CompCustAliasRevPN.data.CompCustAliasRevPN;
            vm.Componentcurrentdata = vm.ComponentsourceData.length;
          }
          else if (CompCustAliasRevPN.data.CompCustAliasRevPN.length > 0) {
            vm.ComponentsourceData = vm.ComponentgridOptions.data = vm.ComponentgridOptions.data.concat(CompCustAliasRevPN.data.CompCustAliasRevPN);
            vm.Componentcurrentdata = vm.ComponentgridOptions.currentItem = vm.ComponentgridOptions.data.length;
          }
          if (vm.ComponentsourceData.length > 0) {
            _.each(vm.ComponentsourceData, (item) => {
              if (vm.CPNPartID === item.refComponentID || vm.enabledDeleteMPNMapping !== true) {
                item.isDisabledDelete = true;
              }
              vm.refComponentIDList.push(item.refComponentID);
            });
          }
          // must set after new data comes
          vm.ComponenttotalSourceDataCount = CompCustAliasRevPN.data.Count;
          if (!vm.ComponentgridOptions.enablePaging) {
            if (!isGetDataDown) {
              vm.ComponentgridOptions.gridApi.infiniteScroll.resetScroll();
            }
            else {
              vm.ComponentgridOptions.gridApi.infiniteScroll.saveScrollPercentage();
            }
          }
          if (!isGetDataDown) {
            vm.ComponentgridOptions.clearSelectedRows();
          }
          if (vm.ComponenttotalSourceDataCount === 0) {
            if (vm.ComponentPageInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
              vm.ComponentemptyState = 0;
            }
            else {
              vm.isComponentNoDataFound = true;
              vm.ComponentemptyState = null;
            }
          }
          else {
            vm.isComponentNoDataFound = false;
            vm.ComponentemptyState = null;
          }
          $timeout(() => {
            if (!isGetDataDown) {
              vm.gridOptions.clearSelectedRows();
              const objCPN = _.find(vm.sourceData, (customer) => customer.id === vm.CPNPartID);
              vm.gridOptions.gridApi.selection.selectRow(objCPN);
              vm.ComponentresetSourceGrid();
              if (!vm.ComponentgridOptions.enablePaging && vm.ComponenttotalSourceDataCount === vm.Componentcurrentdata) {
                return vm.ComponentgridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
              }
            }
            else {
              return vm.ComponentgridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.ComponenttotalSourceDataCount !== vm.Componentcurrentdata ? true : false);
            }
          });
        }
      };
      //export template details
      function exportFileDetail(res, name) {
        const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        if (navigator.msSaveOrOpenBlob) {
          navigator.msSaveOrOpenBlob(blob, name);
        } else {
          const link = document.createElement('a');
          if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', name);
            link.style = 'visibility:hidden';
            document.body.appendChild(link);
            $timeout(() => {
              link.click();
              document.body.removeChild(link);
            });
          }
        }
      }
      /* Open popup for display history of entry change */
      vm.showVersionHistory = (row, componentId, ev) => {
        BaseService.showVersionHistory(row, componentId, ev);
      };

      // Import CPN Functionality
      vm.importCPN = (ev) => {
        _dummyEvent = ev;
        angular.element('#fi-excel').trigger('click');
      };

      vm.erOptions = {
        workstart: () => {
          if (!vm.isNoDataFound) {
            isCPNUploaded = true;
          }
          vm.isNoDataFound = true;
          $scope.$apply();
        },
        workend: () => {
        },
        sheet: (json) => {
          columnMappingStepFn(json);
        },
        badfile: () => {
          const model = {
            title: CORE.MESSAGE_CONSTANT.CPN_UPLOAD_FAIL,
            textContent: CORE.MESSAGE_CONSTANT.CPN_UPLOAD_FAIL_TEXT,
            multiple: true
          };
          DialogFactory.alertDialog(model);
        },
        failed: (e) => {
          const model = {
            title: CORE.MESSAGE_CONSTANT.CPN_UPLOAD_FAIL,
            textContent: e.stack,
            multiple: true
          };
          DialogFactory.alertDialog(model);
          // console.log(e, e.stack);
        },
        multiplefile: () => {
          const model = {
            title: null,
            textContent: CORE.MESSAGE_CONSTANT.SINGLE_FILE_UPLOAD,
            multiple: true
          };
          DialogFactory.alertDialog(model);
        },
        large: () => {
          const model = {
            title: CORE.MESSAGE_CONSTANT.CPN_UPLOAD_FAIL,
            textContent: CORE.MESSAGE_CONSTANT.BOM_UPLOAD_FAIL_SIZE_TEXT,
            multiple: true
          };
          DialogFactory.alertDialog(model);
        }
      };

      function columnMappingStepFn(bomArray) {
        const data = {
          lineItemsHeaders: _cpnItemsHeaders,
          excelHeaders: bomArray[0],
          isCustRevision: true,
          isCPNUpload: true
        };

        DialogFactory.dialogService(
          RFQTRANSACTION.BOM_COLUMN_MAPPING_CONTROLLER,
          RFQTRANSACTION.BOM_COLUMN_MAPPING_VIEW,
          _dummyEvent,
          data).then((result) => {
            isCPNUploaded = false;
            generateModel(bomArray, result);
          }, () => {
            if (isCPNUploaded) {
              isCPNUploaded = false;
            }
          }, (err) => BaseService.getErrorLog(err));
      };

      // Create model from array
      function generateModel(uploadedCPN, cpnHeaders) {
        vm.cpnModel = [];
        if (uploadedCPN && uploadedCPN.length > 0) {
          const headerRowArr = uploadedCPN[0];
          // loop through excel data and bind into model
          for (let i = 1, len = uploadedCPN.length; i < len; i++) {
            const item = uploadedCPN[i];
            const modelRow = {
            };
            const alternateParts = [];
            cpnHeaders.forEach((objCPNHeader) => {
              if (!objCPNHeader.column) {
                return;
              }
              const matchingIndexList = [];
              headerRowArr.forEach((header, index) => {
                if (header && header.toUpperCase() === objCPNHeader.column.toUpperCase()) {
                  matchingIndexList.push(index);
                }
              });
              if (!matchingIndexList.length) {
                return;
              }
              const field = _cpnItemsHeaders.find((x) => x.name === objCPNHeader.header).field;
              if (!modelRow[field]) {
                modelRow[field] = item[matchingIndexList[0]] === '' ? null : item[matchingIndexList[0]];
              }
              if (matchingIndexList.length > 1 && RFQTRANSACTION.MULTI_FIELDS.indexOf(field) !== -1) {
                matchingIndexList.splice(0, 1);
                matchingIndexList.forEach((index) => {
                  var value = item[index];
                  if (!value) {
                    return;
                  }
                  value = value.toUpperCase();
                  switch (field) {
                    case 'mfgCode': {
                      const filterObj = alternateParts.find((x) => !x.mfgCode && x.mfgPN);
                      if (filterObj) {
                        filterObj.mfgCode = value;
                      }
                      else {
                        const obj = {
                          mfgCode: value, mfgPN: null
                        };
                        alternateParts.push(obj);
                      }
                      break;
                    }
                    case 'mfgPN': {
                      const filterObj = alternateParts.find((x) => x.mfgCode && !x.mfgPN);
                      if (filterObj) {
                        filterObj.mfgPN = value;
                      }
                      else {
                        const obj = {
                          mfgCode: null, mfgPN: value
                        };
                        alternateParts.push(obj);
                      }
                      break;
                    }
                  }
                });
              }
            });

            let isAllPropNull = true;

            // if all properties are null then do not take line item
            for (const prop in modelRow) {
              if (modelRow[prop]) {
                isAllPropNull = false;
                break;
              }
            }

            if (!isAllPropNull) {
              const isExists = _.some(vm.cpnModel, (x) => x.cpn === modelRow.cpn && x.revision === modelRow.revision);
              // If line with same CPN not exist then create new line
              if (!isExists) {
                if (modelRow.mfgCode) {
                  modelRow.mfgCode = modelRow.mfgCode.trim();
                }

                if (modelRow.mfgPN) {
                  modelRow.mfgPN = modelRow.mfgPN.trim();
                }
                vm.cpnModel.push(modelRow);
              }
              // Add MFG into array to create new line as same CPN is already exists
              else {
                if (modelRow.mfgCode || modelRow.mfgPN) {
                  alternateParts.splice(0, 0, {
                    mfgCode: modelRow.mfgCode === null ? null : modelRow.mfgCode.trim().toUpperCase(),
                    mfgPN: modelRow.mfgPN === null ? null : modelRow.mfgPN.trim().toUpperCase()
                  });
                }
              }

              // Append all alternate lines into main array
              if (alternateParts.length) {
                alternateParts.forEach((parts) => {
                  var alternateModelRow = angular.copy(modelRow);
                  alternateModelRow.mfgCode = parts.mfgCode === null ? null : parts.mfgCode.trim();
                  alternateModelRow.mfgPN = parts.mfgPN === null ? null : parts.mfgPN.trim();
                  //alternateModelRow._lineID = modelRow.lineID;
                  vm.cpnModel.push(alternateModelRow);
                });
              }
            };
          };
          vm.importCPNDetails();
        }
      }

      vm.importCPNDetails = () => {
        var cpnDetail = {
          cpnImportedDetail: vm.cpnModel,
          customerId: vm.customerId
        };
        vm.cgBusyLoading = ManufacturerFactory.importCPNDetails().query({ cpnDetail }).$promise.then((result) => {
          if (result && result.status !== CORE.ApiResponseTypeStatus.SUCCESS && result.errors && result.errors.data) {
            if (result.errors.data && result.errors.data.error === 'CPNWithDifferentMPNRev') {
              const messgaeContent = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.AVL_CUSTOME_PART_REV_SHOULD_SAME;
              const obj = {
                messageContent: messgaeContent
              };
              return DialogFactory.messageAlertDialog(obj).then(() => {
                exportErrorCSV(result);
              }, () => {
                exportErrorCSV(result);
              }).catch((error) => BaseService.getErrorLog(error));
            } else {
              exportErrorCSV(result);
            }
          }
          else {
            vm.loadData();
          }
        });
      };

      // Export CSV for Error List
      function exportErrorCSV(result) {
        const errorCPNList = [];
        if (result.errors.data.mfgORMfgPNErrorList && result.errors.data.mfgORMfgPNErrorList.length > 0) {
          _.each(result.errors.data.mfgORMfgPNErrorList, (data) => {
            const objErrCPN = {};
            objErrCPN[vm.LabelConstant.MFG.CPN] = data.cpn;
            objErrCPN[vm.LabelConstant.MFG.Rev] = data.revision;
            objErrCPN.Error = stringFormat(CORE.MESSAGE_CONSTANT.CPN_UPLOAD.MFRPN_NOT_ADDED);
            errorCPNList.push(objErrCPN);
          });
        }
        if (result.errors.data.mfgORMfgPNNotExistList && result.errors.data.mfgORMfgPNNotExistList.length > 0) {
          _.each(result.errors.data.mfgORMfgPNNotExistList, (data) => {
            const objErrCPN = {};
            objErrCPN[vm.LabelConstant.MFG.CPN] = data.cpn;
            objErrCPN[vm.LabelConstant.MFG.Rev] = data.revision;
            objErrCPN.Error = stringFormat(CORE.MESSAGE_CONSTANT.CPN_UPLOAD.MFRPN_NOT_EXIST, data.mfgCode, data.mfgPN);
            errorCPNList.push(objErrCPN);
          });
        }
        if (result.errors.data.cpnErrorList && result.errors.data.cpnErrorList.length > 0) {
          _.each(result.errors.data.cpnErrorList, (data) => {
            const objErrCPN = {};
            objErrCPN[vm.LabelConstant.MFG.CPN] = data.cpn;
            objErrCPN[vm.LabelConstant.MFG.Rev] = data.revision;
            objErrCPN.Error = stringFormat(CORE.MESSAGE_CONSTANT.CPN_UPLOAD.NO_CPN_ADDED, data.mfgCode, data.mfgPN);
            errorCPNList.push(objErrCPN);
          });
        }
        if (result.errors.data.existCPNMismatchMFGPNList && result.errors.data.existCPNMismatchMFGPNList.length > 0) {
          _.each(result.errors.data.existCPNMismatchMFGPNList, (data) => {
            const objErrCPN = {};
            objErrCPN[vm.LabelConstant.MFG.CPN] = data.custPart;
            objErrCPN[vm.LabelConstant.MFG.Rev] = data.custPNRev;
            objErrCPN.Error = stringFormat(CORE.MESSAGE_CONSTANT.CPN_UPLOAD.MFRPN_MISMATCHED);
            errorCPNList.push(objErrCPN);
          });
        }
        if (result.errors.data.CPNWithDifferentRev && result.errors.data.CPNWithDifferentRev.length > 0) {
          _.each(result.errors.data.CPNWithDifferentRev, (data) => {
            const objErrCPN = {};
            objErrCPN[vm.LabelConstant.MFG.CPN] = data.custPart;
            objErrCPN[vm.LabelConstant.MFG.Rev] = data.custPNRev;
            objErrCPN.Error = stringFormat(CORE.MESSAGE_CONSTANT.CPN_UPLOAD.CUSTOM_PART_REV_MISMATCH);
            errorCPNList.push(objErrCPN);
          });
        }
        if (errorCPNList.length > 0) {
          vm.cgBusyLoading = ImportExportFactory.importFile(errorCPNList).then((res) => {
            if (res.data && errorCPNList.length > 0) {
              exportFileDetail(res, 'CPN_Import_error.xls');
              vm.loadData();
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }

      vm.goToComponentList = () => {
        BaseService.goToPartList();
      };

      vm.editManufacturer = (mfgType, mfgcodeID) => {
        if (mfgType === CORE.MFG_TYPE.DIST) {
          BaseService.goToSupplierDetail(mfgcodeID);
        }
        else {
          BaseService.goToManufacturer(mfgcodeID);
        }
      };

      vm.deleteRecord = (row) => {
        const data = row;
        data.CPNPartID = vm.CPNPartID;
        DialogFactory.dialogService(
          USER.DELETE_MPN_CPN_MAPPING_CONTROLLER,
          USER.DELETE_MPN_CPN_MAPPING_VIEW,
          null,
          row).then(() => {
            vm.loadData();
          }, () => {
            vm.loadData();
          }, (err) => BaseService.getErrorLog(err));
      };

      /* delete multiple data called from directive of ui-grid*/
      // Used for Delete Part from part list from right side grid
      vm.deleteMultipleData = () => {
        let selectedIDs = [];
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((componentitem) => componentitem.id);
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

                      data.pageTitle = null;
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
      // reset grid after delete CPN
      function resetPaginationAndLoadData() {
        vm.pagingInfo.Page = vm.gridOptions.paginationCurrentPage = CORE.UIGrid.Page();
        BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
      };
    }
  }
})();
