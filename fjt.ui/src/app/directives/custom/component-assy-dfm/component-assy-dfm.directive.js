(function () {
  'use strict';
  angular.module('app.core').directive('componentAssyDfm', componentAssyDfm);

  /** @ngInject */
  function componentAssyDfm(BaseService, CORE, DialogFactory, ComponentFactory) {
    const directive = {
      restrict: 'E',
      replace: true,
      scope: {
        partid: '=?',
        woid: '=?',
        requestType: '=?'
      },
      templateUrl: 'app/directives/custom/component-assy-dfm/component-assy-dfm.html',
      controller: ComponentAssyDFMController,
      controllerAs: 'vm',
      link: function () {
      }
    };
    return directive;

    /** @ngInject */
    /**
    * Controller for view data of Component DFM
    * @param
    */
    function ComponentAssyDFMController($scope, $q, $mdDialog, $timeout, $state, $stateParams, USER, CORE, WORKORDER, WorkorderFactory, DialogFactory, BaseService, ECORequestFactory) {
      const vm = this;
      var searchColumn;
      vm.requestType = WORKORDER.ECO_REQUEST_TYPE;
      vm.partID = $scope.partid ? $scope.partid : null;
      vm.setScrollClass = 'gridScrollHeight_RFQ';
      vm.woID = $scope.woid ? $scope.woid : null;
      vm.ecoRequstType = $scope.requestType ? $scope.requestType : null;
      vm.gridConfig = CORE.gridConfig;
      vm.debounceTime = CORE.DEBOUNCE_TIME_INTERVAL;
      vm.LabelConstant = CORE.LabelConstant;
      vm.ecoRequestFinalStatus = WORKORDER.ECO_REQUEST_FINAL_STATUS;
      vm.dfmRequestFinalStatus = WORKORDER.DFM_REQUEST_FINAL_STATUS;
      vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
      vm.isUpdatable = true;
      vm.EmptyMesssage = WORKORDER.WORKORDER_EMPTYSTATE.DFM_REQUEST_LIST;
      vm.DFMfinalstatusheaderdropdown = CORE.ECORequestFinalStatusGridHeaderDropdown;
      vm.ECOfinalstatusheaderdropdown = CORE.ECORequestFinalStatusGridHeaderDropdown;
      vm.ecostatusheaderdropdown = CORE.ECORequestStatusGridHeaderDropdown;
      vm.serachECODFM = vm.ecoRequstType ? vm.ecoRequstType : vm.requestType.ALL.Value;
      vm.loginUser = BaseService.loginUser;
      const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
      if ($stateParams.ecoDfmType) {
        vm.serachECODFM = $stateParams.ecoDfmType === vm.requestType.DFM.Value ? vm.requestType.DFM.Value : vm.requestType.ECO.Value;
      }
      $scope.$parent.$parent.vm.ecodfmrequestType = vm.serachECODFM;
      vm.serachfinalStatus = vm.DFMfinalstatusheaderdropdown[1].id;
      const initPageInfo = () => {
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),
          SortColumns: [['ecoReqID', 'ASC']],
          SearchColumns: [{
            ColumnName: 'finalstatusConvertedValue',
            SearchString: vm.serachfinalStatus,
            ColumnDataType: 'StringEquals'
          }],
          requestType: vm.serachECODFM,
          partID: vm.partID
        };
        vm.pagingInfo.SearchColumns.push();
        initsourcedata();
      };
      const initsourcedata = () => {
        vm.sourceHeader = [{
          field: 'Action',
          cellClass: 'gridCellColor',
          displayName: 'Action',
          width: '120',
          cellTemplate: '<grid-action-view grid="grid" row="row"></grid-action-view>',
          enableFiltering: false,
          enableSorting: false,
          exporterSuppressExport: true,
          pinnedLeft: true
        }, {
          field: '#',
          width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
          cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
          enableFiltering: false,
          enableSorting: false
        }, {
          field: 'workorder',
          displayName: vm.LabelConstant.Workorder.WO,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: 150
        }, {
          field: 'WoStatus',
          displayName: vm.LabelConstant.Workorder.Status,
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" ng-class="grid.appScope.$parent.vm.getWoStatusClassName(row.entity.woStatusID)">'
            + '{{COL_FIELD}}'
            + '</span>'
            + '</div>',
          enableFiltering: true,
          enableSorting: true,
          width: 210
        }, {
          field: 'ecoNumber',
          displayName: vm.serachECODFM === vm.requestType.ALL.Value ? vm.LabelConstant.Workorder.ECO_DFM_REQUEST_LABEL : vm.serachECODFM === vm.requestType.ECO.Value ? vm.LabelConstant.Workorder.ECO : vm.LabelConstant.Workorder.DFM,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: 160
        }, {
          field: 'custECONumberConvertedValue',
          displayName: 'Request From',
          width: 150,
          enableFiltering: false,
          enableSorting: false
        }, {
          field: 'ECODFMNumberValue',
          displayName: vm.serachECODFM === vm.requestType.ALL.Value ? vm.LabelConstant.Workorder.ECO_DFM_COMMON_LABEL : vm.serachECODFM === vm.requestType.ECO.Value ? vm.LabelConstant.Workorder.CECO : vm.LabelConstant.Workorder.CDFM,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: 150
        }, {
          field: 'fromPIDCode',
          displayName: vm.LabelConstant.Assembly.ID,
          cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link \
                                        component-id="row.entity.fromPartID" \
                                        label="grid.appScope.$parent.vm.LabelConstant.Assembly.ID" \
                                        value="row.entity.fromPIDCode" \
                                        is-copy="true" \
                                        is-custom-part="row.entity.fromIsCustom" \
                                        rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.fromPartRoHSIcon" \
                                        rohs-status="row.entity.fromPartRoHSName" \
                                        is-assembly="true"></div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.PID
        }, {
          field: 'fromMFGPN',
          displayName: vm.LabelConstant.Assembly.MFGPN,
          cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link \
                                        component-id="row.entity.fromPartID" \
                                        label="grid.appScope.$parent.vm.LabelConstant.Assembly.MFGPN" \
                                        value="row.entity.fromMFGPN" \
                                        is-copy="true" \
                                        is-custom-part="row.entity.fromIsCustom" \
                                        rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.fromPartRoHSIcon" \
                                        rohs-status="row.entity.fromPartRoHSName" \
                                        is-assembly="true"></div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN
        }, {
          field: 'fromNickName',
          displayName: vm.LabelConstant.Assembly.NickName,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: 180
        }, {
          field: 'toPIDCode',
          displayName: 'To ' + vm.LabelConstant.Assembly.ID,
          cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link component-id="row.entity.toPartID"\
                                        label="grid.appScope.$parent.vm.LabelConstant.Assembly.ID"\
                                        value="row.entity.toPIDCode"\
                                        is-mfg="true"\
                                        mfg-label="grid.appScope.$parent.vm.LabelConstant.Assembly.MFGPN"\
                                        mfg-value="row.entity.toMFGPN"\
                                        rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.toPartRoHSIcon"\
                                        rohs-status="row.entity.toPartRoHSName"\
                                        is-copy="true"\
                                        is-custom-part="row.entity.toIsCustom" \
                                        is-copy-ahead-label="true"\
                                        redirection-disable="false"\
                                        is-search-findchip="false"\
                                        is-search-digi-key="false">\
                                        </common-pid-code-label-link></div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN
        }, {
          field: 'EcoDfmType',
          displayName: 'ECO/DFM Type',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{row.entity.EcoDfmType}}</div>'
        }, {
          field: 'MountingType',
          displayName: 'Mounting Type',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{row.entity.MountingType}}</div>'
        }, {
          field: 'reasonForChange',
          displayName: WORKORDER.ECO_DFM_GRID_TITLE.ReasonForChange,
          cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.reasonForChange" ng-click="grid.appScope.$parent.vm.viewRecord(row.entity, \'ReasonForChange\')"> \
                                   View \
                                </md-button>',
          width: 120,
          enableFiltering: false,
          enableSorting: false,
          enableCellEdit: false,
          type: 'html'
        }, {
          field: 'documentCount',
          displayName: 'Attachment',
          cellTemplate: '<a class="ui-grid-cell-contents grid-cell-text-right cursor-pointer"\
                                                ng-class="{\'cursor-not-allow custom-cnt-link\':grid.appScope.$parent.vm.isDisableLink(row.entity.documentCount),\
                                                            \'underline\': !grid.appScope.$parent.vm.isDisableLink(row.entity.documentCount)}" \
                                                ng-click="grid.appScope.$parent.vm.gotoECODFMDocument(row, $event, !grid.appScope.$parent.vm.isDisableLink(row.entity.documentCount))">\
                                                {{COL_FIELD | numberWithoutDecimal}}\
                                    </a>',
          enableCellEdit: false,
          width: '120'
        }, {
          field: 'fullName',
          displayName: 'Initiate By',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{row.entity.fullName}}</div>'
        }, {
          field: 'initiateDate',
          displayName: 'Date Initiated',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{row.entity.initiateDate | date:grid.appScope.$parent.vm.dateFormat}}</div>',
          enableFiltering: false,
          type: 'date'
        }, {
          field: 'finalstatusConvertedValue',
          displayName: 'Final Status',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">\
                         <span class="label-box" \
                            ng-class="{\'label-success\':COL_FIELD == grid.appScope.$parent.vm.DFMfinalstatusheaderdropdown[2].value, \
                                \'label-warning\':COL_FIELD == grid.appScope.$parent.vm.DFMfinalstatusheaderdropdown[1].value, \
                                \'label-danger\':COL_FIELD == grid.appScope.$parent.vm.DFMfinalstatusheaderdropdown[3].value}"> \
                               {{ COL_FIELD }}\
                        </span>\
                        </div>',
          enableFiltering: false,
          width: 180,
          ColumnDataType: 'StringEquals'
        }, {
          field: 'statusConvertedValue',
          displayName: vm.serachECODFM === vm.requestType.ALL.Value ? vm.LabelConstant.Workorder.ECO_DFM_COMMON_LABEL + ' Status' : vm.serachECODFM === vm.requestType.ECO.Value ? vm.LabelConstant.Workorder.ECOStatus : vm.LabelConstant.Workorder.DFMStatus,
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" \
                            ng-class="{\'label-success\':COL_FIELD == grid.appScope.$parent.vm.ecostatusheaderdropdown[1].value, \
                                \'label-warning\':COL_FIELD == grid.appScope.$parent.vm.ecostatusheaderdropdown[2].value}"> \
                               {{ COL_FIELD }}'
            + '</span>'
            + '</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.ecostatusheaderdropdown
          },
          ColumnDataType: 'StringEquals'
        }, {
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
        }, {
          field: 'createdby',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
          type: 'StringEquals',
          enableFiltering: true
        }, {
          field: 'createdbyRole',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
          type: 'StringEquals',
          enableFiltering: true
        }];
      };
      initPageInfo();
      if (vm.woID && vm.ecoRequstType) {
        searchColumn = {
          ColumnDataType: 'Number',
          ColumnName: 'woID',
          SearchString: vm.woID
        };
      }
      function getWorkOrderListByAssyID() {
        return WorkorderFactory.getWorkOrderListByAssyID().query({ assyID: vm.partID }).$promise.then((response) => {
          vm.WoList = response.data;
          return vm.WoList;
        }).catch((error) => {
          BaseService.getErrorLog(error);
        });
      }

      function getSelectedWoDetail(item) {
        initPageInfo();
        const isWorkOrderFilter = _.find(vm.pagingInfo.SearchColumns, (item) => item.ColumnName === 'workorder');
        if (item) {
          vm.serachworkOrder = item.woNumber;
          if (isWorkOrderFilter) {
            isWorkOrderFilter.SearchString = vm.serachworkOrder;
          } else {
            vm.pagingInfo.SearchColumns.push({ ColumnName: 'workorder', SearchString: vm.serachworkOrder, ColumnDataType: 'StringEquals' });
          }
        } else {
          vm.serachworkOrder = null;
          if (isWorkOrderFilter) {
            vm.pagingInfo.SearchColumns.splice(vm.pagingInfo.SearchColumns.indexOf(isWorkOrderFilter), 1);
          }
        }
        vm.loadData();
      }

      function getFilterAutocompleteDetail() {
        var promises = [getWorkOrderListByAssyID()];
        vm.cgBusyLoading = $q.all(promises).then(() => {
          initAutoComplete();
        }).catch((error) => BaseService.getErrorLog(error));
      }
      vm.dateFormat = _dateDisplayFormat;
      const initAutoComplete = () => {
        vm.autoCompleteWorkorder = {
          columnName: 'woNumber',
          keyColumnName: 'woID',
          keyColumnId: null,
          inputName: 'Workorder',
          placeholderName: 'Workorder',
          isRequired: true,
          isAddnew: false,
          callbackFn: getWorkOrderListByAssyID,
          onSelectCallbackFn: getSelectedWoDetail
        };
        vm.autoCompleteSearchPart = {
          columnName: 'mfgPN',
          keyColumnName: 'id',
          keyColumnId: null,
          inputName: 'SearchPart',
          placeholderName: 'Type here to search part',
          callbackFn: (obj) => {
            const searchObj = {
              id: obj.id,
              mfgType: vm.mfgType,
              inputName: vm.autoCompleteSearchPart.inputName,
              categoryID: CORE.PartCategory.SubAssembly,
              isGoodPart: null
            };
            return getPartSearch(searchObj);
          },
          isAddnew: false,
          onSelectCallbackFn: (partDetail) => {
            if (partDetail) {
              BaseService.openInNew(USER.ADMIN_MANAGECOMPONENT_DFM_STATE, { coid: partDetail.id });

              vm.autoCompleteSearchPart.keyColumnId = null;
              $scope.$broadcast(vm.autoCompleteSearchPart.inputName + 'searchText', null);
            }
          },
          onSearchFn: (query) => {
            const searchObj = {
              mfgType: vm.mfgType,
              query: query,
              inputName: vm.autoCompleteSearchPart.inputName,
              categoryID: CORE.PartCategory.SubAssembly,
              isGoodPart: null
            };
            return getPartSearch(searchObj);
          }
        };
      };
      function getPartSearch(searchObj) {
        return ComponentFactory.getComponentMFGAliasSearch().query({ listObj: searchObj }).$promise.then((partList) => {
          if (partList && partList.data.data) {
            vm.partSearchList = partList.data.data;
          }
          else {
            vm.partSearchList = [];
          }
          return vm.partSearchList;
        }).catch((error) => BaseService.getErrorLog(error));
      }
      getFilterAutocompleteDetail();
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
        exporterCsvFilename: 'DFM Request.csv'
      };
      // to set data in grid after data is retrived from API in loadData() and getDataDown() function
      const setDataAfterGetAPICall = (ecoRequests, isGetDataDown) => {
        if (ecoRequests && ecoRequests.data && ecoRequests.data.ecoRequests) {
          _.each(ecoRequests.data.ecoRequests, (item) => {
            item.isDisabledDelete = (item.woStatusID === CORE.WOSTATUS.TERMINATED || item.woStatusID === CORE.WOSTATUS.COMPLETED || item.woStatusID === CORE.WOSTATUS.VOID) ? true : false;
            item.isRowSelectable = !item.isDisabledDelete;
          });
          if (!isGetDataDown) {
            vm.sourceData = ecoRequests.data.ecoRequests;
            vm.currentdata = vm.sourceData.length;
          }
          else if (ecoRequests.data.ecoRequests.length > 0) {
            vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(ecoRequests.data.ecoRequests);
            vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
          }

          // must set after new data comes
          vm.totalSourceDataCount = ecoRequests.data.Count;
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
            vm.isNoDataFound = false;
            vm.emptyState = 0;
          }
          else {
            vm.isNoDataFound = false;
            vm.emptyState = null;
          }
          $timeout(() => {
            if (!isGetDataDown) {
              vm.resetSourceGrid();
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

      /* retrieve DFM list*/
      vm.loadData = () => {
        const woIDFilter = _.find(vm.pagingInfo.SearchColumns, (col) => col.ColumnName === 'woID');
        if (vm.woID && !woIDFilter) {
          vm.pagingInfo.SearchColumns.push(searchColumn);
        }
        if (vm.autoCompleteWorkorder && vm.autoCompleteWorkorder.keyColumnId && !woIDFilter) {
          vm.pagingInfo.SearchColumns.push({ ColumnName: 'workorder', SearchString: vm.serachworkOrder, ColumnDataType: 'StringEquals' });
        }
        if (vm.searchText) {
          const objFinalStatus = _.find(vm.pagingInfo.SearchColumns, (item) => item.ColumnName === 'finalstatusConvertedValue');
          if (objFinalStatus) {
            objFinalStatus.SearchString = vm.serachfinalStatus;
          } else {
            vm.pagingInfo.SearchColumns.push({ ColumnName: 'finalstatusConvertedValue', SearchString: vm.serachfinalStatus, ColumnDataType: 'StringEquals' });
          }
          vm.pagingInfo.requestType = vm.ecoRequstType ? vm.ecoRequstType : vm.serachECODFM;
        } else {
          const objFinalStatus = _.find(vm.pagingInfo.SearchColumns, (item) => item.ColumnName === 'finalstatusConvertedValue');
          if (objFinalStatus) {
            objFinalStatus.SearchString = vm.serachfinalStatus;
            vm.searchText = vm.serachfinalStatus;
          }
        }
        vm.pagingInfo.ecodfmnum = vm.searchECONum;
        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        //vm.pagingInfo.SearchColumns.push(searchColumn);
        vm.cgBusyLoading = ECORequestFactory.retriveECORequestsList().query(vm.pagingInfo).$promise.then((response) => {
          if (response && response.data) {
            setDataAfterGetAPICall(response, false);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      //check for request Type filter
      vm.getListFilter = () => {
        initsourcedata();
        // const isWorkOrderFilter = _.find(vm.pagingInfo.SearchColumns, (item) => item.ColumnName === 'workorder');
        $scope.$parent.$parent.vm.ecodfmrequestType = vm.serachECODFM;
        if (vm.serachECODFM === vm.requestType.ECO.Value) {
          vm.serachfinalStatus = vm.ECOfinalstatusheaderdropdown[1].id;
          vm.searchText = vm.serachfinalStatus;
        }
        else if (vm.serachECODFM === vm.requestType.DFM.Value) {
          vm.serachfinalStatus = vm.DFMfinalstatusheaderdropdown[1].id;
          vm.searchText = vm.serachfinalStatus;
        }
        else if (vm.serachECODFM === vm.requestType.ALL.Value) {
          vm.serachfinalStatus = vm.DFMfinalstatusheaderdropdown[1].id;
          vm.searchText = vm.serachfinalStatus;
        }
        const isfinalstatusFilter = _.find(vm.pagingInfo.SearchColumns, (item) => item.ColumnName === 'finalstatusConvertedValue');
        if (isfinalstatusFilter) {
          isfinalstatusFilter.SearchString = vm.serachfinalStatus;
        }
        vm.pagingInfo.Page = CORE.UIGrid.Page();
        vm.pagingInfo.requestType = vm.serachECODFM;
        vm.loadData();
      };
      vm.getFinalStatusListFilter = () => {
        const isfinalstatusFilter = _.find(vm.pagingInfo.SearchColumns, (item) => item.ColumnName === 'finalstatusConvertedValue');
        if (vm.serachfinalStatus) {
          const columnObj = {
            field: 'finalStatusReason',
            displayName: WORKORDER.ECO_DFM_GRID_TITLE.ApprovalReason,
            cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.finalStatusReason" ng-click="grid.appScope.$parent.vm.viewRecord(row.entity,\'FinalStatusReason\')"> \
                                   View \
                                </md-button>',
            width: 120,
            enableFiltering: false,
            enableSorting: false,
            enableCellEdit: false,
            type: 'html'
          };
          const objReasonColumn = _.find(vm.sourceHeader, (x) => x.field === columnObj.field);
          if (objReasonColumn) {
            vm.sourceHeader.splice(19, 1);
          }
          if (vm.serachfinalStatus === vm.ECOfinalstatusheaderdropdown[2].value) {
            columnObj.displayName = WORKORDER.ECO_DFM_GRID_TITLE.ApprovalReason;
            vm.sourceHeader.splice(19, 0, columnObj);
          } else if (vm.serachfinalStatus === vm.ECOfinalstatusheaderdropdown[3].value) {
            columnObj.displayName = WORKORDER.ECO_DFM_GRID_TITLE.RejecttionReason;
            vm.sourceHeader.splice(19, 0, columnObj);
          }

          if (isfinalstatusFilter) {
            isfinalstatusFilter.SearchString = vm.serachfinalStatus;
            vm.searchText = vm.serachfinalStatus;
          } else {
            vm.pagingInfo.SearchColumns.push({ ColumnName: 'finalstatusConvertedValue', SearchString: vm.serachfinalStatus, ColumnDataType: 'StringEquals' });
          }
        } else {
          vm.searchText = vm.serachfinalStatus;
          vm.pagingInfo.SearchColumns.splice(vm.pagingInfo.SearchColumns.indexOf(isfinalstatusFilter), 1);
        }
        vm.pagingInfo.Page = CORE.UIGrid.Page();
        vm.loadData();
      };
      /* load more data on mouse scroll */
      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        if (searchColumn) {
          vm.pagingInfo.SearchColumns.push(searchColumn);
        }
        vm.cgBusyLoading = ECORequestFactory.retriveECORequestsList().query(vm.pagingInfo).$promise.then((response) => {
          if (response && response.data) {
            setDataAfterGetAPICall(response, true);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.fab = {
        Status: false
      };

      /* delete DFM list*/
      vm.deleteRecord = (ecoRequest) => {
        let ecoNumbers = null;
        let selectedIDs = [];
        if (ecoRequest) {
          selectedIDs.push(ecoRequest.ecoReqID);
          ecoNumbers = ecoRequest.ecoNumber;
        } else {
          vm.selectedRows = vm.selectedRowsList;
          if (vm.selectedRows.length > 0) {
            selectedIDs = vm.selectedRows.map((item) => item.ecoReqID);
            ecoNumbers = vm.selectedRows.map((item) => item.ecoNumber);
          }
        }

        if (selectedIDs) {
          const obj = {
            title: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM, vm.pagingInfo.requestType === vm.requestType.ECO.Value ? 'ECO request' : 'DFM request'),
            textContent: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM_MESSAGE, selectedIDs.length, vm.pagingInfo.requestType === vm.requestType.ECO.Value ? 'ECO request' : 'DFM request'),
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.confirmDiolog(obj).then((yes) => {
            if (yes) {
              vm.cgBusyLoading = ECORequestFactory.deleteECORequest().delete({
                ecoReqID: selectedIDs,
                ecoNumber: ecoNumbers.toString()
              }).$promise.then(() => {
                BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                vm.gridOptions.clearSelectedRows();
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };
      vm.addECODFMrequest = (requestType) => {
        if (requestType === vm.requestType.ECO.Value) {
          BaseService.goToAddWorkorderECORequest(vm.partID, vm.woID);
        } else if (requestType === vm.requestType.DFM.Value) {
          BaseService.goToAddWorkorderDFMRequest(vm.partID, vm.woID);
        }
      };

      vm.viewRecord = (item, title) => {
        let obj = {};
        if (title === 'ReasonForChange') {
          obj = {
            title: 'Reason for Change',
            reasonForChange: item.reasonForChange,
            description: item.description
          };
        } else if (title === 'FinalStatusReason') {
          obj = {
            title: item.finalStatus === WORKORDER.ECO_REQUEST_FINAL_STATUS.Accept.Value ? WORKORDER.ECO_DFM_GRID_TITLE.ApprovalReason : WORKORDER.ECO_DFM_GRID_TITLE.RejecttionReason,
            finalStatusReason: item.finalStatusReason,
            isFinalReason: true
          };
        }
        const data = obj;
        DialogFactory.dialogService(
          CORE.ECO_DFM_DESCRIPTION_MODAL_CONTROLLER,
          CORE.ECO_DFM_DESCRIPTION_MODAL_VIEW,
          null,
          data).then(() => {
          }, (error) => BaseService.getErrorLog(error));
      };

      vm.gotoECODFMDocument = (row) => {
        if (row.entity.requestType === vm.requestType.ECO.Value) {
          BaseService.openInNew(WORKORDER.DFM_REQUEST_DOCUMENT_STATE, { requestType: WORKORDER.ECO_REQUEST_TYPE.ECO.Name, partID: row.entity.fromPartID, woID: row.entity.woID, ecoReqID: row.entity.ecoReqID });
        } else if (row.entity.requestType === vm.requestType.DFM.Value) {
          BaseService.openInNew(WORKORDER.DFM_REQUEST_DOCUMENT_STATE, { requestType: WORKORDER.ECO_REQUEST_TYPE.DFM.Name, partID: row.entity.fromPartID, woID: row.entity.woID, ecoReqID: row.entity.ecoReqID });
        }
      };
      /*DFM Update*/
      vm.updateRecord = (row) => {
        if (row.entity.requestType === vm.requestType.DFM.Value) {
          BaseService.openInNew(WORKORDER.DFM_REQUEST_DETAIL_STATE, { requestType: WORKORDER.ECO_REQUEST_TYPE.DFM.Name, partID: row.entity.fromPartID, woID: row.entity.woID, ecoReqID: row.entity.ecoReqID });
        }
        if (row.entity.requestType === vm.requestType.ECO.Value) {
          BaseService.openInNew(WORKORDER.ECO_REQUEST_DETAIL_STATE, { requestType: WORKORDER.ECO_REQUEST_TYPE.ECO.Name, partID: row.entity.fromPartID, woID: row.entity.woID, ecoReqID: row.entity.ecoReqID });
        }
      };

      /* delete multiple data called from directive of ui-grid*/
      vm.deleteMultipleData = () => {
        vm.deleteRecord();
      };
      vm.goToComponentDetail = (mfgType, partId) => {
        if (mfgType) {
          mfgType = mfgType.toLowerCase();
        }
        BaseService.goToComponentDetailTab(mfgType, partId, USER.PartMasterTabs.Detail.Name);
      };
      vm.goTocomponentList = () => BaseService.openInNew(USER.ADMIN_MFG_COMPONENT_STATE, {});
      vm.getWoStatusClassName = (statusID) => BaseService.getWoStatusClassName(statusID);
      vm.gotoWorkorderlist = () => BaseService.goToWorkorderList();

      $scope.$on('$destroy', () => {
        $mdDialog.hide(false, {
          closeAll: true
        });
      });
    }
  }
})();
