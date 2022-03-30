(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('dateCodeFormatList', dateCodeFormatList);

  /** @ngInject */
  function dateCodeFormatList(CORE, USER, BaseService, $timeout, DCFormatFactory, TRANSACTION, DialogFactory, $mdDialog) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        isListPage: '='
      },
      templateUrl: 'app/directives/custom/date-code-format-list/date-code-format-list.html',
      controller: dateCodeFormatListCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function dateCodeFormatListCtrl($scope) {
      var vm = this;
      vm.isListPage = $scope.isListPage || false;
      vm.isUpdatable = vm.showUMIDHistory = vm.isListPage;
      vm.isHideDelete = !vm.isListPage;
      vm.pageName = CORE.PageName.DCFormat;
      vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.DC_FORMAT;
      vm.StatusOptionsGridHeaderDropdown = CORE.StatusOptionsGridHeaderDropdown;
      vm.gridConfig = CORE.gridConfig;
      vm.LabelConstant = CORE.LabelConstant;
      vm.searchAndSelectToUpdate = CORE.SEARCH_SELECT_TO_UPDATE_HINT;
      vm.debounceTime = CORE.DEBOUNCE_TIME_INTERVAL;
      vm.KeywordStatusGridHeaderDropdown = CORE.KeywordStatusGridHeaderDropdown;
      vm.DateCodeCategoryDropDown = USER.DateCodeCategoryDropDown;
      vm.CheckSearchTypeList = TRANSACTION.CheckSearchType;
      vm.checkSerachDCType = vm.searchType = vm.CheckSearchTypeList[1].id;
      vm.DCFormatAdvanceFilter = angular.copy(TRANSACTION.DCFormatAdvanceFilters);
      vm.loginUser = BaseService.loginUser;
      const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;

      /* to display Line shipping comments */
      vm.showPartDescription = (data, ev) => {
        const popupData = {
          title: 'Description',
          description: data.description
        };
        DialogFactory.dialogService(
          CORE.DESCRIPTION_MODAL_CONTROLLER,
          CORE.DESCRIPTION_MODAL_VIEW,
          ev,
          popupData).then(() => {
          }, (err) => BaseService.getErrorLog(err));
      };

      vm.sourceHeader = [
        {
          field: 'Action',
          cellClass: 'gridCellColor',
          displayName: 'Action',
          width: '100',
          cellTemplate: '<grid-action-view grid="grid" row="row" style="overflow: hidden;padding:1px !important; overflow: hidden; white-space: nowrap;" class="height-grid ui-grid-cell-contents"></grid-action-view>',
          enableFiltering: false,
          enableSorting: false,
          exporterSuppressExport: true,
          pinnedLeft: vm.isListPage
        },
        {
          field: '#',
          width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
          cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
          enableFiltering: false,
          pinnedLeft: vm.isListPage,
          enableSorting: false,
          enableCellEdit: false
        },
        {
          field: 'systemID',
          width: 150,
          displayName: vm.LabelConstant.COMMON.SystemID,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableCellEdit: false,
          enableFiltering: true
        },
        {
          field: 'categoryName',
          displayName: 'Category',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{(COL_FIELD)}}</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.DateCodeCategoryDropDown
          },
          ColumnDataType: 'StringEquals',
          width: 120
        },
        {
          field: 'dateCodeFormat',
          width: 120,
          displayName: 'Date Code Format',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableCellEdit: false,
          enableFiltering: true
        },
        {
          field: 'description',
          displayName: 'Description',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
            '<span class="cursor-pointer bom-header-wrap">{{ COL_FIELD }}</span> &nbsp;' +
            '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.description && row.entity.description !== \'-\'" ng-click="grid.appScope.$parent.vm.showPartDescription(row.entity, $event)">' +
            '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
            '<md-tooltip>View</md-tooltip>' +
            '</button>' +
            '</div>',
          width: 100,
          enableFiltering: false,
          enableSorting: false,
          enableCellEdit: false
        },
        {
          field: 'systemGeneratedValue',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_SYSTEM_GENERATED,
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" ng-class="{\'label-success\':row.entity.systemGenerated == true, \'label-warning\':row.entity.systemGenerated == false}"> {{ COL_FIELD }}'
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
          field: 'updatedAt',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
          type: 'datetime',
          enableFiltering: false
        },
        {
          field: 'updatedby',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          type: 'StringEquals',
          enableFiltering: true
        },
        {
          field: 'updatedbyRole',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          type: 'StringEquals',
          enableFiltering: true
        },
        {
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


      const initPageInfo = () => {
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),
          SortColumns: [['dateCodeFormat', 'ASC']],
          SearchColumns: []
        };
      };

      initPageInfo();

      vm.gridOptions = {
        enableFiltering: true,
        enablePaging: isEnablePagination,
        enablePaginationControls: isEnablePagination,
        showColumnFooter: false,
        enableRowHeaderSelection: vm.isListPage,
        enableFullRowSelection: false,
        enableRowSelection: vm.isListPage,
        multiSelect: true,
        allowToExportAllData: true,
        filterOptions: vm.pagingInfo.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: `${vm.pageName}.csv`,
        /* Calls everytime for Export All Data [rowType = ALL] */
        exporterAllDataFn: () => {
          /* For scrolling pagination vm.pagingInfo.Page is increase everytime so we have to set API side pagePerReocrds as NULL for Export All Data */
          const pagingInfoOld = _.clone(vm.pagingInfo);
          pagingInfoOld.pageSize = 0;
          pagingInfoOld.Page = 1;
          vm.gridOptions.isExport = pagingInfoOld.isExport = true;
          return DCFormatFactory.retrieveDCFormatList().query(vm.pagingInfo).$promise.then((category) => {
            if (category.status === CORE.ApiResponseTypeStatus.SUCCESS && category.data) {
              return category.data.DCFormatList;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      vm.searchCommonData = (isReset) => {
        if (isReset) {
          vm.searchDCFormat = null;
          initPageInfo();
          vm.gridOptions.gridApi.grid.clearAllFilters();
        }
        else {
          vm.pagingInfo.Page = CORE.UIGrid.Page();
          setExternalSearchFilter();
        }
        vm.loadData();
      };

      /* to avoid duplicate filter data adding in list */
      const setExternalSearchFilter = () => {
        if (vm.pagingInfo.SearchColumns.length > 0) {
          _.remove(vm.pagingInfo.SearchColumns, (item) => item.isExternalSearch);
        }
        vm.pagingInfo.searchDCFormat = vm.searchDCFormat;
        vm.pagingInfo.searchDCFormatType = vm.searchType;
      };

      const generateSearchCriteria = () => {
        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        vm.generateFilterChip = false;
        if (vm.searchDCFormat) {
          vm.pagingInfo.searchDCFormat = vm.DCFormatAdvanceFilter.DCFormat.tooltip = vm.searchDCFormat;
          vm.generateFilterChip = true;
          vm.DCFormatAdvanceFilter.DCFormat.isDeleted = false;
        } else {
          vm.pagingInfo.searchDCFormat = null;
          vm.DCFormatAdvanceFilter.DCFormat.isDeleted = true;
        }
        vm.pagingInfo.searchDCFormatType = vm.checkSerachDCType || vm.CheckSearchTypeList[1].id;
        if (vm.gridOptions && vm.gridOptions.gridApi) {
          vm.isUiGridColumnFiltersApplied = _.some(vm.gridOptions.gridApi.grid.columns, (col) => !_.isEmpty(col.filters[0].term));
        }
      };

      /* Show History Popup */
      vm.UMIDHistory = (row, ev) => {
        row.title = `${vm.pageName} History`;
        row.TableName = CORE.DATAENTRYCHANGE_AUDITLOG_TABLENAME.DATE_CODE_FORMAT;
        row.EmptyMesssage = vm.EmptyMesssage.MESSAGE;
        row.headerData = [{
          label: vm.LabelConstant.COMMON.SystemID,
          value: row.systemID,
          displayOrder: 1,
          labelLinkFn: vm.goToDCFormatList
        }];
        DialogFactory.dialogService(
          CORE.COMMON_HISTORY_POPUP_MODAL_CONTROLLER,
          CORE.COMMON_HISTORY_POPUP_MODAL_VIEW,
          ev,
          row).then(() => { }, (err) => BaseService.getErrorLog(err));
      };

      const bindGridData = () => {
        let findIndexToReduce;
        if (!vm.isListPage) {
          findIndexToReduce = _.findIndex(vm.sourceHeader, (data) => data.displayName === 'Action');
          if (findIndexToReduce !== -1) {
            vm.sourceHeader.splice(findIndexToReduce, 1);
          }
          findIndexToReduce = _.findIndex(vm.sourceHeader, (data) => data.displayName === vm.LabelConstant.COMMON.SystemID);
          if (findIndexToReduce !== -1) {
            vm.sourceHeader.splice(findIndexToReduce, 1);
          }
          findIndexToReduce = _.findIndex(vm.sourceHeader, (data) => data.displayName === 'Description');
          if (findIndexToReduce !== -1) {
            vm.sourceHeader.splice(findIndexToReduce, 1);
          }
          findIndexToReduce = _.findIndex(vm.sourceHeader, (data) => data.displayName === vm.LabelConstant.COMMON.GRIDHEADER_SYSTEM_GENERATED);
          if (findIndexToReduce !== -1) {
            vm.sourceHeader.splice(findIndexToReduce, 1);
          }
          findIndexToReduce = _.findIndex(vm.sourceHeader, (data) => data.displayName === vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE);
          if (findIndexToReduce !== -1) {
            vm.sourceHeader.splice(findIndexToReduce, 1);
          }
          findIndexToReduce = _.findIndex(vm.sourceHeader, (data) => data.displayName === vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY);
          if (findIndexToReduce !== -1) {
            vm.sourceHeader.splice(findIndexToReduce, 1);
          }
          findIndexToReduce = _.findIndex(vm.sourceHeader, (data) => data.displayName === vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE);
          if (findIndexToReduce !== -1) {
            vm.sourceHeader.splice(findIndexToReduce, 1);
          }
          findIndexToReduce = _.findIndex(vm.sourceHeader, (data) => data.displayName === vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE);
          if (findIndexToReduce !== -1) {
            vm.sourceHeader.splice(findIndexToReduce, 1);
          }
          findIndexToReduce = _.findIndex(vm.sourceHeader, (data) => data.displayName === vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY);
          if (findIndexToReduce !== -1) {
            vm.sourceHeader.splice(findIndexToReduce, 1);
          }
          findIndexToReduce = _.findIndex(vm.sourceHeader, (data) => data.displayName === vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE);
          if (findIndexToReduce !== -1) {
            vm.sourceHeader.splice(findIndexToReduce, 1);
          }
        }
      };

      function setDataAfterGetAPICall(category, isGetDataDown) {
        if (category && category.data.DCFormatList) {
          if (!isGetDataDown) {
            vm.sourceData = category.data.DCFormatList;
            vm.currentdata = vm.sourceData.length;
          }
          else if (category.data.DCFormatList.length > 0) {
            vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(category.data.DCFormatList);
            vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
          }
          bindGridData();
          // must set after new data comes
          vm.totalSourceDataCount = category.data.Count;
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
            if (vm.pagingInfo.SearchColumns.length > 0 || (vm.generateFilterChip || vm.pagingInfo.searchDCFormat)) {
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

      //get defect category data for grid bind
      vm.loadData = () => {
        if (vm.callLoadData === false) {
          vm.callLoadData = true;
          return;
        }
        if (!vm.isListPage) {
          setExternalSearchFilter();
        } else {
          generateSearchCriteria();
        }
        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        vm.cgBusyLoading = DCFormatFactory.retrieveDCFormatList().query(vm.pagingInfo).$promise.then((category) => {
          if (category.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            setDataAfterGetAPICall(category, false);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      //get data down
      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.cgBusyLoading = DCFormatFactory.retrieveDCFormatList().query(vm.pagingInfo).$promise.then((category) => {
          setDataAfterGetAPICall(category, true);
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.removeSearchDCFormat = () => {
        vm.searchDCFormat = null;
        vm.checkSerachDCType = vm.CheckSearchTypeList[1].id;
        vm.loadData();
      };

      vm.scanSearchKey = ($event) => {
        $timeout(() => {
          if ($event.keyCode === 13) {
            if (!vm.filterInfo.$valid && BaseService.focusRequiredField(vm.filterInfo)) {
              return;
            }
            vm.loadData();
          }
        });
      };

      vm.advanceFilterSearch = () => {
        vm.callLoadData = true;
        if (!vm.filterInfo.$valid && BaseService.focusRequiredField(vm.filterInfo)) {
          return;
        }
        initPageInfo();
        if (vm.gridOptions && vm.gridOptions.gridApi) {
          _.each(vm.gridOptions.gridApi.grid.columns, (col) => {
            if (!_.isEmpty(col.filters[0].term)) {
              vm.callLoadData = false;
              col.filters[0].term = undefined;
            }
          });
        }
        vm.loadData();
      };

      // reset filter
      vm.resetFilter = () => {
        if (vm.gridOptions && vm.gridOptions.gridApi) {
          _.each(vm.gridOptions.gridApi.grid.columns, (col) => {
            if (!_.isEmpty(col.filters[0].term)) {
              vm.callLoadData = false;
              col.filters[0].term = undefined;
            }
          });
        }
        vm.searchDCFormat = null;
        $timeout(() => {
          vm.checkSerachDCType = vm.CheckSearchTypeList[1].id;
          initPageInfo();
          vm.loadData();
        });
      };

      // remove filter
      vm.removeAppliedFilter = (item) => {
        if (item) {
          item.isDeleted = true;
          switch (item.value) {
            case vm.DCFormatAdvanceFilter.DCFormat.value:
              vm.searchDCFormat = null;
              vm.checkSerachDCType = vm.CheckSearchTypeList[1].id;
              vm.advanceFilterSearch();
              break;
            case vm.DCFormatAdvanceFilter.ClearAll.value:
              vm.clearSelection();
              break;
          }
        }
      };

      // Clear selected master filters from boxes
      vm.clearSelection = () => {
        vm.searchDCFormat = null;
        vm.checkSerachDCType = vm.CheckSearchTypeList[1].id;
        initPageInfo();
        vm.loadData();
      };

      vm.isClearSelectionDisabled = () => (!vm.searchDCFormat);

      vm.clearGridColumnFilter = (item) => {
        if (item) {
          item.filters[0].term = undefined;
          if (!item.isFilterDeregistered) {
            //refresh data grid
            vm.gridOptions.gridApi.grid.onClearUnregisteredColumnFilter();
          }
        }
      };

      /* add.edit defect category*/
      vm.addEditRecord = (data, ev) => {
        DialogFactory.dialogService(
          USER.ADMIN_DC_FORMAT_POPUP_CONTROLLER,
          USER.ADMIN_DC_FORMAT_POPUP_VIEW,
          ev,
          data).then(() => {
          }, () => {
            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
          }, (err) => BaseService.getErrorLog(err));
      };

      /* update defect category*/
      vm.updateRecord = (row, ev) => {
        vm.addEditRecord(row.entity, ev);
      };

      vm.goToDCFormatList = () => BaseService.goToDCFormatList();

      //close popup on page destroy
      $scope.$on('$destroy', () => {
        $mdDialog.hide(false, { closeAll: true });
      });

      /* Delete Date Code Format Details */
      vm.deleteRecord = (dcFormatCategory) => {
        let selectedIDs = [];
        if (dcFormatCategory) {
          selectedIDs.push(dcFormatCategory.id);
        } else {
          vm.selectedRows = vm.selectedRowsList;
          if (vm.selectedRows.length > 0) {
            selectedIDs = vm.selectedRows.map((categoryItem) => categoryItem.id);
          }
        }
        if (selectedIDs) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, vm.pageName, selectedIDs.length);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          const objIDs = {
            id: selectedIDs,
            CountList: false
          };
          DialogFactory.messageConfirmDialog(obj).then((resposne) => {
            if (resposne) {
              vm.cgBusyLoading = DCFormatFactory.deleteDCFormat().query({ objIDs: objIDs }).$promise.then((data) => {
                if (data && data.data && (data.data.length > 0 || data.data.transactionDetails)) {
                  let resData = {};
                  resData = {
                    TotalCount: data.data.transactionDetails[0].TotalCount,
                    pageName: vm.pageName
                  };
                  BaseService.deleteAlertMessageWithHistory(resData, (ev) => {
                    const IDs = {
                      id: selectedIDs,
                      CountList: true
                    };
                    return DCFormatFactory.deleteDCFormat().query({
                      objIDs: IDs
                    }).$promise.then((res) => {
                      let data = {};
                      data = res.data;
                      data.pageTitle = dcFormatCategory ? dcFormatCategory.name : null;
                      data.PageName = vm.pageName;
                      data.selectedIDs = stringFormat('{0}{1}', selectedIDs.length, ' Selected');
                      if (res.data) {
                        DialogFactory.dialogService(
                          USER.ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER,
                          USER.ADMIN_SHOW_TRANSACTION_DETAILS_VIEW,
                          ev,
                          data).then(() => {
                          }, () => {
                          });
                      }
                    }).catch((error) => BaseService.getErrorLog(error));
                  });
                }
                else {
                  BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                  vm.gridOptions.clearSelectedRows();
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
        }
        else {
          // show validation message no data selected
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
          messageContent.message = stringFormat(messageContent.message, vm.pageName);
          const alertModel = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(alertModel);
        }
      };

      /* delete multiple data called from directive of ui-grid*/
      vm.deleteMultipleData = () => {
        vm.deleteRecord();
      };

      $scope.$on('RefreshDateCodeGrid', () => {
        BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
      });

      // refresh dc format data
      vm.refreshData = () => {
        vm.loadData();
      };
    }
  }
})();
