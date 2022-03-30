(function () {
  'use strict';

  angular.module('app.transaction.searchMaterial')
    .controller('SearchMaterialController', SearchMaterialController);

  /** @ngInject */
  function SearchMaterialController($scope, $timeout, CORE, USER, TRANSACTION, BaseService, DialogFactory, ImportBOMFactory, MasterFactory, ComponentFactory, SearchMaterialFactory, $mdDialog, ReceivingMaterialFactory, $state) {
    const vm = this;
    vm.LabelConstant = CORE.LabelConstant;
    vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.SEARCH_MATERIAL;
    vm.CustomSearchTypeForList = CORE.CustomSearchTypeForList;
    vm.gridConfig = CORE.gridConfig;
    vm.isHideDelete = true;
    vm.isPrinted = true;
    vm.bindHotTable = false;
    //vm.SearchUmidGridUI = TRANSACTION.Search_Material_Split_UI.SearchUmidGridUI;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.visibilityField = [];
    $scope.splitPaneFirstProperties = {};
    $scope.splitPaneSecondProperties = {};
    vm.MEASUREMENT_TYPES_COUNT = CORE.MEASUREMENT_TYPES.COUNT;

    vm.bomSupportDetail = {
      bomHeaderList: [],
      rohsList: [],
      attributeList: [],
      typeList: [],
      mountingTypeList: [],
      partTypeList: [],
      errorCodeList: []
    };

    let bomHeaderList = [];
    let rohsList = [];
    let attributeList = [];
    let typeList = [];
    let mountingTypeList = [];
    let partTypeList = [];
    let errorCodeList = [];

    const setSplitViewHeight = () => {
      const firstSlitComponentHeight = $scope.splitPaneFirstProperties.firstComponentSize;
      const lastSlitComponentHeight = $scope.splitPaneFirstProperties.lastComponentSize;

      if (firstSlitComponentHeight) {
        const bomSectionHeight = firstSlitComponentHeight - 5;
        const bomTableHeight = firstSlitComponentHeight - 55;
        $('.cm-bom-slip-section').height(bomSectionHeight);
        $('#hot-search-material-container').height(bomTableHeight);
        $('#hot-search-material-container .wtHolder').height(bomTableHeight);
      }

      const gridUmidClass = document.getElementsByClassName(vm.SearchUmidGridUI);
      if (lastSlitComponentHeight) {
        const umidGridHeight = lastSlitComponentHeight - 100;
        const umidSectionHeight = umidGridHeight + 95;
        $('.cm-umid-slip-section').height(umidSectionHeight);
        if (gridUmidClass && gridUmidClass.length > 1) {
          gridUmidClass[0].setAttribute('style', `height: ${umidGridHeight}px !important;`);
          gridUmidClass[1].setAttribute('style', `height: ${umidGridHeight}px !important;`);
        } else if (gridUmidClass && gridUmidClass.length > 0) {
          gridUmidClass[0].setAttribute('style', `height: ${umidGridHeight}px !important;`);
        }
      } else {
        $('.cm-umid-slip-section').height('353');
        if (gridUmidClass && gridUmidClass.length > 1) {
          gridUmidClass[0].setAttribute('style', 'height: 266px !important;');
          gridUmidClass[1].setAttribute('style', 'height: 266px !important;');
        } else if (gridUmidClass && gridUmidClass.length > 0) {
          gridUmidClass[0].setAttribute('style', 'height: 266px !important;');
        }
      }
    };

    $scope.$watch('splitPaneFirstProperties.firstComponentSize', () => {
      setSplitViewHeight();
    });

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: 0,
        pageSize: CORE.UIGrid.ItemsPerPage(),
        SortColumns: [['id', 'DESC']],
        SearchColumns: []
      };
    };
    initPageInfo();

    const active = () => {
      setDefaultValue();
      getRfqLineitemsHeaders();
      getRoHSList();
      getPartDynamicAttributeList();
      getTypeList();
      getMountingTypeList();
      getPartTypeList();
      getErrorCode();
      initAutoComplete();
    };

    vm.gridOptions = {
      filterOptions: vm.pagingInfo.SearchColumns,
      enableCellEdit: false,
      enablePaging: false,
      enableCellEditOnFocus: false,
      exporterCsvFilename: 'Search Material UMID Detail.csv',
      exporterMenuCsv: true,
      enableColumnMenus: false,
      enableRowSelection: false,
      enableFullRowSelection: false
    };

    vm.sourceHeader = [
      {
        field: 'Action',
        displayName: 'Action',
        width: '80',
        cellTemplate: '<grid-action-view grid="grid" row="row" number-of-action-button="4"></grid-action-view>',
        enableFiltering: false,
        enableSorting: false,
        exporterSuppressExport: true,
        pinnedLeft: true,
        allowCellFocus: false
      },
      {
        field: '#',
        width: '70',
        cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
        enableFiltering: false,
        enableSorting: false,
        pinnedLeft: true
      },
      {
        field: 'uid',
        displayName: 'UMID',
        cellTemplate: '<div class="ui-grid-cell-contents text-left"><a tabindex="-1" ng-click="grid.appScope.$parent.vm.goToUIDManage(row.entity)" class="cm-text-decoration underline cursor-pointer">{{COL_FIELD| uppercase}}</a>\
                       <copy-text label="grid.appScope.$parent.vm.LabelConstant.UMIDManagement.UMID" text="row.entity.uid"></copy-text></div>',
        width: '170',
        allowCellFocus: false
      },
      {
        field: 'fullMfrName',
        displayName: CORE.LabelConstant.MFG.MFG,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '145',
        allowCellFocus: false
      },
      {
        field: 'mfrPN',
        displayName: CORE.LabelConstant.MFG.MFGPN,
        cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link \
                                    component-id="row.entity.refcompid" \
                                    label="grid.appScope.$parent.vm.CORE.LabelConstant.MFG.MFGPN" \
                                    value="row.entity.mfrPN" \
                                    is-copy="true" \
                                    rohs-icon="row.entity.rohsIcon" \
                                    rohs-status="row.entity.rohsName" \
                                    is-search-digi-key="true" \
                                    is-custom-part="row.entity.isCustom"\
                                    restrict-use-permanently="row.entity.restrictUsePermanently" \
                                    restrict-use-with-permission="row.entity.restrictUSEwithpermission" \
                                    restrict-packaging-use-permanently="row.entity.restrictPackagingUsePermanently" \
                                    restrict-packaging-use-with-permission="row.entity.restrictPackagingUseWithpermission" \
                                </common-pid-code-label-link></div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
        allowCellFocus: false
      },
      {
        field: 'currentBinName',
        displayName: CORE.LabelConstant.TransferStock.CurrentLocation,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '180',
        allowCellFocus: false
      },
      {
        field: 'currentWarehouseName',
        displayName: 'Current Warehouse',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '140',
        allowCellFocus: false
      },
      {
        field: 'currentParentWarehouseName',
        displayName: 'Current Department',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '200',
        allowCellFocus: false
      },
      {
        field: 'currentCount',
        displayName: 'Count',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{row.entity.currentUOMClassID === grid.appScope.$parent.vm.MEASUREMENT_TYPES_COUNT.ID ? (COL_FIELD)  : (COL_FIELD | unit)}}</div>',
        width: '120',
        allowCellFocus: false
      },
      {
        field: 'currentUnit',
        displayName: 'Units',
        cellTemplate: '<div class="ui-grid-cell-contents  grid-cell-text-right">{{row.entity.currentUOMClassID === grid.appScope.$parent.vm.MEASUREMENT_TYPES_COUNT.ID ? (COL_FIELD)  : (COL_FIELD | unit)}}</div>',
        width: '120',
        allowCellFocus: false
      },
      {
        field: 'currentUOMName',
        displayName: 'UOM',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '100',
        allowCellFocus: false
      },
      {
        field: 'packagingName',
        displayName: 'Packaging',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '120',
        allowCellFocus: false
      },
      {
        field: 'allocatedToKit',
        displayName: 'Allocated In Kit',
        cellTemplate: '<div class="ui-grid-cell-contents text-left"><a ng-click="grid.appScope.$parent.vm.allocatedKit(row.entity)" class="cursor-pointer" tabindex="-1">{{COL_FIELD}}</a></div>',
        width: '330',
        allowCellFocus: false
      }
    ];

    const setDefaultValue = () => {
      vm.searchDetail = {
        assyId: null,
        searchString: null,
        searchType: vm.CustomSearchTypeForList.Exact,
        isSearch: false,
        salesOrderDetailId: null
      };
      if (vm.autoCompleteSO) {
        $scope.$broadcast(vm.autoCompleteSO.inputName, null);
      }
    };

    const getPartSearch = (searchObj) => ComponentFactory.getAllAssemblyBySearch().save({ listObj: searchObj }).$promise.then((assyIDList) => {
      if (assyIDList && assyIDList.data.data) {
        vm.assyList = assyIDList.data.data;
        if (searchObj.type === 'NickName') {
          vm.assyList = _.orderBy(_.uniqBy(vm.assyList, 'nickName'), 'nickName');
        }
      }
      else {
        vm.assyList = [];
      }
      return vm.assyList;
    }).catch((error) => BaseService.getErrorLog(error)
    );

    const getRfqLineitemsHeaders = () => {
      ImportBOMFactory.getRfqLineitemsHeaders().query().$promise.then((bomHeaderListResponse) => {
        if (bomHeaderListResponse && bomHeaderListResponse.data && bomHeaderListResponse.data.length > 0) {
          bomHeaderList = bomHeaderListResponse.data;

          const objDescription = _.find(bomHeaderList, { field: 'mfgPNDescription' });
          const objMfr = _.find(bomHeaderList, { field: 'mfgCode' });
          const objMfrPn = _.find(bomHeaderList, { field: 'mfgPN' });

          if (objDescription && objMfr && objMfrPn) {
            [objDescription.displayOrder, objMfr.displayOrder] = [objMfr.displayOrder, objDescription.displayOrder];
            [objDescription.displayOrder, objMfrPn.displayOrder] = [objMfrPn.displayOrder, objDescription.displayOrder];
            bomHeaderList = _.orderBy(bomHeaderList, ['displayOrder'], ['asc']);
          }

          _.map(bomHeaderList, (data) => {
            data.hidden = false;
          });

          vm.bomSupportDetail.bomHeaderList = bomHeaderList;

          //MasterFactory.getUIGridColumnDetail({ gridId: vm.gridConfig.gridSearchMaterialHotTable }).query().$promise.then((listOfColumn) => {
          //  if (listOfColumn && listOfColumn.data && listOfColumn.data.columnDefList.length > 0) {
          //    vm.bomSupportDetail.bomHeaderList = listOfColumn.data.columnDefList;
          //  } else {
          //    MasterFactory.saveUIGridColumnDetail().query({ gridId: vm.gridConfig.gridSearchMaterialHotTable, columnDefList: bomHeaderList }).$promise.then(() => {
          //      vm.bomSupportDetail.bomHeaderList = bomHeaderList;
          //    }).catch((error) => BaseService.getErrorLog(error));
          //  }
          //}).catch((error) => BaseService.getErrorLog(error));
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const getRoHSList = () => {
      MasterFactory.getRohsList().query().$promise.then((responseRoHs) => {
        if (responseRoHs && responseRoHs.data && responseRoHs.data.length > 0) {
          rohsList = responseRoHs.data;
          vm.bomSupportDetail.rohsList = rohsList;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const getPartDynamicAttributeList = () => {
      ComponentFactory.getPartDynamicAttributeList().query().$promise.then((responsePartDynamic) => {
        if (responsePartDynamic && responsePartDynamic.data && responsePartDynamic.data.length > 0) {
          attributeList = responsePartDynamic;
          vm.bomSupportDetail.attributeList = attributeList;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const getTypeList = () => {
      MasterFactory.getPartCategoryMstList().query().$promise.then((typeResponse) => {
        if (typeResponse && typeResponse.data && typeResponse.data.length > 0) {
          typeList = _.map(typeResponse.data, (item) => item.Value = item.categoryName);
          vm.bomSupportDetail.typeList = typeList;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const getMountingTypeList = () => {
      ComponentFactory.getMountingTypeList().query().$promise.then((mountingTypeResponse) => {
        if (mountingTypeResponse && mountingTypeResponse.data && mountingTypeResponse.data.length > 0) {
          mountingTypeList = mountingTypeResponse.data;
          vm.bomSupportDetail.mountingTypeList = mountingTypeList;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const getPartTypeList = () => {
      ComponentFactory.getPartTypeList().query().$promise.then((partTypeResponse) => {
        if (partTypeResponse && partTypeResponse.data && partTypeResponse.data.length > 0) {
          partTypeList = partTypeResponse.data;
          vm.bomSupportDetail.partTypeList = partTypeList;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const getErrorCode = () => {
      ImportBOMFactory.getErrorCode().query().$promise.then((errorCodeResponse) => {
        if (errorCodeResponse && errorCodeResponse.data && errorCodeResponse.data.length > 0) {
          errorCodeList = errorCodeResponse.data;
          vm.bomSupportDetail.errorCodeList = errorCodeList;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const getSalesOrderList = (query) => {
      return ReceivingMaterialFactory.get_PO_SO_Assembly_List().query(query).$promise.then((response) => {
        vm.SalesOrderNumberList = response.data;
        return vm.SalesOrderNumberList;
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const initAutoComplete = () => {
      vm.autoCompleteAssy = {
        columnName: 'PIDCode',
        keyColumnName: 'id',
        keyColumnId: vm.searchDetail.assyId,
        inputName: 'SearchAssy',
        placeholderName: 'Type here to search assembly',
        isRequired: false,
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.searchDetail.assyId = item.id;
            vm.searchDetail.nickName = null;
            vm.searchDetail.salesOrderDetailId = null;
            if (vm.autoCompleteNickname) {
              vm.autoCompleteNickname.searchText = null;
            }
            if (vm.autoCompleteSO) {
              vm.autoCompleteSO.searchText = null;
            }
          }
        },
        onSearchFn: (query) => {
          const searchObj = {
            query: query,
            type: 'AssyID'
          };
          return getPartSearch(searchObj);
        }
      };
      vm.autoCompleteNickname = {
        columnName: 'nickName',
        keyColumnName: 'id',
        keyColumnId: vm.searchDetail.nickName,
        inputName: 'nickName',
        placeholderName: 'Type here to search nickname',
        isRequired: false,
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.searchDetail.nickName = item.nickName;
            vm.searchDetail.assyId = null;
            vm.searchDetail.salesOrderDetailId = null;
            if (vm.autoCompleteAssy) {
              vm.autoCompleteAssy.searchText = null;
            }
            if (vm.autoCompleteSO) {
              vm.autoCompleteSO.searchText = null;
            }
          }
        },
        onSearchFn: (query) => {
          const searchObj = {
            query: query,
            type: 'NickName'
          };
          return getPartSearch(searchObj);
        }
      };
      vm.autoCompleteSO = {
        columnName: 'salescolumn',
        keyColumnName: 'SalesOrderDetailId',
        keyColumnId: vm.searchDetail.salesOrderDetailId,
        inputName: 'Kit#',
        placeholderName: 'Kit#',
        isRequired: false,
        isAddnew: false,
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.searchDetail.salesOrderDetailId = item.SalesOrderDetailId;
            vm.searchDetail.assyId = item.PartID;
            vm.searchDetail.nickName = null;
            if (vm.autoCompleteAssy) {
              vm.autoCompleteAssy.searchText = null;
            }
            if (vm.autoCompleteNickname) {
              vm.autoCompleteNickname.searchText = null;
            }
          }
        },
        onSearchFn: (query) => {
          const search = {
            search: query
          };
          return getSalesOrderList(search);
        }
      };
    };

    active();

    vm.searchBOMDetail = () => {
      if (vm.searchDetail.searchString) {
        vm.totalBOMDataCount = [];
        vm.bindHotTable = false;
        vm.cgBusyBOMLoading = SearchMaterialFactory.getSearchMaterialDetailOfBOM().query(vm.searchDetail).$promise.then((searchBOMResult) => {
          if (searchBOMResult && searchBOMResult.status === CORE.ApiResponseTypeStatus.SUCCESS && searchBOMResult.data) {
            vm.searchBOMList = searchBOMResult.data.BOMList;
            vm.totalBOMDataCount = vm.searchBOMList.length;
            vm.bindHotTable = true;
            //vm.isBOMNoDataFound = false;
            if (vm.totalBOMDataCount === 0) {
              vm.isBOMNoDataFound = true;
            } else {
              vm.isBOMNoDataFound = false;
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.searchUMIDDetail = () => {
      if (vm.searchDetail.searchString) {
        vm.pagingInfo.assyId = vm.searchDetail.assyId;
        vm.pagingInfo.searchString = vm.searchDetail.searchString;
        vm.pagingInfo.nickName = vm.searchDetail.nickName;
        vm.pagingInfo.searchType = vm.searchDetail.searchType;
        vm.cgBusyUMIDLoading = SearchMaterialFactory.getSearchMaterialDetailOfUMID().query(vm.pagingInfo).$promise.then((searchUMIDResult) => {
          if (searchUMIDResult && searchUMIDResult.status === CORE.ApiResponseTypeStatus.SUCCESS && searchUMIDResult.data) {
            vm.searchUMIDList = searchUMIDResult.data.UMIDList;
            vm.totalUMIDDataCount = vm.searchUMIDList.length;

            _.map(vm.searchUMIDList, (data) => {
              data.isPrintBtnDisable = !data.allocatedToKit;
              data.rohsIcon = stringFormat('{0}{1}', vm.rohsImagePath, data.rohsIcon);
            });

            if (!vm.gridOptions.enablePaging) {
              vm.currentdata = vm.searchUMIDList.length;
              vm.gridOptions.gridApi.infiniteScroll.resetScroll();
            }

            vm.gridOptions.clearSelectedRows();
            if (vm.totalUMIDDataCount === 0) {
              vm.isUMIDNoDataFound = false;
              vm.emptyState = 0;
            }
            else {
              vm.isUMIDNoDataFound = false;
              vm.emptyState = null;
            }

            $timeout(() => {
              vm.resetSourceGrid();
              if (!vm.gridOptions.enablePaging && vm.totalUMIDDataCount === vm.currentdata) {
                return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
              }
            });
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.scanSearchMaterial = (e) => {
      $timeout(() => {
        if (e.keyCode === 13) {
          if (!vm.searchDetail.searchString) {
            return;
          }
          vm.searchMaterial();
        }
      }, true);
      /** Prevent enter key submit event */
      preventInputEnterKeyEvent(e);
    };

    vm.searchMaterial = () => {
      $scope.splitPaneFirstProperties.firstComponentSize = 350;
      $scope.splitPaneFirstProperties.lastComponentSize = null;
      vm.searchBOMDetail();
      if (vm.searchDetail.isSearch) {
        vm.searchUMIDDetail();
      }
      vm.searchDetail.isSearch = true;
    };

    vm.resetSearch = () => {
      setDefaultValue();
      $scope.splitPaneFirstProperties = {};
      $scope.splitPaneSecondProperties = {};
      $scope.$broadcast(vm.autoCompleteAssy.inputName, null);
    };

    vm.goToPartList = () => {
      BaseService.goToPartList();
    };

    vm.goToKitList = () => {
      BaseService.openInNew(TRANSACTION.KIT_LIST_STATE);
    }

    vm.goToUIDManage = (data) =>  BaseService.goToUMIDDetail(data.id);
    
    vm.allocatedKit = (rowData) => {
      const data = rowData;
      data.refUMIDId = data.id;
      DialogFactory.dialogService(
        TRANSACTION.ALLOCATED_KIT_CONTROLLER,
        TRANSACTION.ALLOCATED_KIT_VIEW,
        event,
        data).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };

    const searchMaterialPrint = (rowData, ev) => {
      if (rowData) {
        DialogFactory.dialogService(
          TRANSACTION.SEARCH_MATERIAL_PRINT_UTILITY_POPUP_CONTROLLER,
          TRANSACTION.SEARCH_MATERIAL_PRINT_UTILITY_POPUP_VIEW,
          ev,
          rowData).then(() => {
          }, (err) => BaseService.getErrorLog(err));
      }
    };

    vm.printRecord = (row, ev) => {
      if (row && row.entity) {
        const data = {
          assyNickName: row.entity.assyNickName,
          bomLineNo: row.entity.bomLineNo,
          printLabelString: stringFormat('{0}#{1}', row.entity.assyNickName, row.entity.bomLineNo),
          isCallFromRow: true
        };
        searchMaterialPrint(data, ev);
      }
    };

    vm.printSearchMaterial = () => {
      const data = {
        isCallFromRow: false
      };
      searchMaterialPrint(data, null);
    };

    vm.searchMaterialManageField = (ev) => {
      DialogFactory.dialogService(
        TRANSACTION.SEARCH_MATERIL_MANAGE_FIELD_POPUP_CONTROLLER,
        TRANSACTION.SEARCH_MATERIL_MANAGE_FIELD_POPUP_VIEW,
        ev,
        vm.visibilityField).then(() => {
        }, (response) => {
          if (response) {
            $scope.$broadcast('searchMaterialVisibilityColumn', response);
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    //close popup on page destroy
    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, { closeAll: true });
    });
  }
})();
