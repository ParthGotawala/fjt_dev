(function () {
  'use strict';

  angular
    .module('app.admin.rfqsetting')
    .controller('KeywordController', KeywordController);

  /** @ngInject */
  function KeywordController(USER, $scope, CORE, RFQSettingFactory, BaseService, $timeout, DialogFactory, $mdDialog) {
    const vm = this;
    vm.isUpdatable = true;
    vm.showUMIDHistory = true;
    vm.actionButtonName = 'History';
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.KEYWORD;
    vm.StatusKeywords = CORE.StatusGridHeaderDropdown;
    vm.isEditIntigrate = false;
    vm.DefaultDateFormat = _dateTimeDisplayFormat;
    vm.gridConfig = CORE.gridConfig;
    vm.LabelConstant = CORE.LabelConstant;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;

    vm.sourceHeader = [{
      field: 'Action',
      cellClass: 'gridCellColor',
      displayName: 'Action',
      width: '90',
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
      field: 'keyword',
      displayName: 'Keyword',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '700'
    }, {
      field: 'displayOrder',
      displayName: 'Display Order' + CORE.Modify_Grid_column_Allow_Change_Message,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | number: 2}}</div>',
      width: 150,
      enableCellEdit: true,
      type: 'number'
    }, {
      field: 'Active',
      displayName: 'Status',
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
        + '<span class="label-box" \
                                                            ng-class="{\'label-success\':row.entity.isActive == true, \
                                                            \'label-warning\':row.entity.isActive == false}"> \
                                                                {{ COL_FIELD}}'
        + '</span>'
        + '</div>',
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        term: null,
        options: vm.StatusKeywords,
        width: 150
      }
    }, {
      field: 'updatedAt',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
      type: 'datetime',
      enableFiltering: false,
      visible: false
    }, {
      field: 'updatedby',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
      type: 'StringEquals',
      enableFiltering: true,
      visible: false
    }, {
      field: 'updatedbyRole',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
      type: 'StringEquals',
      enableFiltering: true,
      visible: false
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
      enableFiltering: true,
      visible: false
    }];

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [],
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
      exporterCsvFilename: 'Keyword.csv',
      allowToExportAllData: true,
      exporterAllDataFn: () => {
        const pagingInfoOld = _.clone(vm.pagingInfo);
        pagingInfoOld.pageSize = 0;
        pagingInfoOld.Page = 1;
        vm.gridOptions.isExport = pagingInfoOld.isExport = true;
        return RFQSettingFactory.retriveKeywordList().query(pagingInfoOld).$promise.then((keyword) => {
          if (keyword && keyword.data && keyword.data.Keyword) {
            return keyword.data.Keyword;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    function setDataAfterGetAPICall(keyword, isGetDataDown) {
      if (keyword && keyword.data.Keyword) {
        if (!isGetDataDown) {
          vm.sourceData = keyword.data.Keyword;
          vm.currentdata = vm.sourceData.length;
        }
        else if (keyword.data.Keyword.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(keyword.data.Keyword);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        // must set after new data comes
        vm.totalSourceDataCount = keyword.data.Count;
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
        if (!isGetDataDown && !vm.isEditIntigrate) {
          cellEdit();
        }
        $timeout(() => {
          vm.resetSourceGrid();
          if (!isGetDataDown) {
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

    /* retrieve Keyword list*/
    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = RFQSettingFactory.retriveKeywordList().query(vm.pagingInfo).$promise.then((keyword) => {
        if (keyword.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          setDataAfterGetAPICall(keyword, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* load more data on mouse scroll */
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = RFQSettingFactory.retriveKeywordList().query(vm.pagingInfo).$promise.then((keyword) => {
        if (keyword) {
          setDataAfterGetAPICall(keyword, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // delete keyword
    vm.deleteRecord = (keywords) => {
      let selectedIDs = [];
      if (keywords) {
        selectedIDs.push(keywords.id);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((keywordsItem) => keywordsItem.id);
        }
      }
      if (selectedIDs) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Keyword', selectedIDs.length);
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
            vm.cgBusyLoading = RFQSettingFactory.deleteKeyword().query({ objIDs: objIDs }).$promise.then((data) => {
              if (data && data.data && (data.data && data.data.TotalCount > 0)) {
                const alertModel = {
                  title: USER.USER_INFORMATION_LABEL,
                  textContent: CORE.MESSAGE_CONSTANT.DELETE_ALERT_MESSAGE
                };
                DialogFactory.messageConfirmDialog(alertModel);
              }
              else {
                BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                vm.gridOptions.clearSelectedRows();
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => { // Empty Block
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        //show validation message no data selected
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContent.message = stringFormat(messageContent.message, 'Keywords');
        const alertModel = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(alertModel);
      }
    };

    vm.addEditRecord = (data, ev) => {
      DialogFactory.dialogService(
        CORE.MANAGE_KEYWORD_MODAL_CONTROLLER,
        CORE.MANAGE_KEYWORD_MODAL_VIEW,
        ev,
        data).then(() => { // Empty Block
        }, (data) => {
          if (data) {
            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
          }
        }, (error) => BaseService.getErrorLog(error));
    };

    /* delete multiple data called from directive of ui-grid*/
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };

    /* Update Keyword */
    vm.updateRecord = (row, ev) => {
      vm.addEditRecord(row.entity, ev);
    };

    //Update cell for display order flied
    function cellEdit() {
      vm.isEditIntigrate = true;
      vm.gridOptions.gridApi.edit.on.afterCellEdit($scope, (rowEntity, colDef, newvalue, oldvalue) => {
        if (colDef.field === 'displayOrder') {
          if (newvalue !== oldvalue) {
            const keywordModel = {
              displayOrder: newvalue,
              id: rowEntity.id,
              keyword: rowEntity.keyword
            };
            //if (newvalue != null || newvalue != '') {
            vm.cgBusyLoading = RFQSettingFactory.keyword().save(keywordModel).$promise.then((res) => {
              if (res) {
                if (res.status === 'FAILED') {
                  if (colDef.field === 'displayOrder') {
                    rowEntity.displayOrder = oldvalue;
                  }
                }
                else if (res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                  BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                }
              }
            }).catch((error) => BaseService.getErrorLog(error));
            //} else {
            //    const obj = _.find(vm.sourceData, function (item) { return item.id == rowEntity.id });
            //    const index = vm.sourceData.indexOf(obj);
            //    vm.gridOptions.gridApi.grid.validate.setInvalid(vm.gridOptions.data[index], vm.gridOptions.columnDefs[4]);
            //}
          }
        }
      });
    }

    /* Show History Popup */
    vm.UMIDHistory = (row, ev) => {
      row.title = `${CORE.PageName.keywords} History`;
      row.TableName = CORE.DATAENTRYCHANGE_AUDITLOG_TABLENAME.RFQ_LINEITEMS_KEYWORDS;
      row.EmptyMesssage = CORE.COMMON_HISTORY.KEYWORD.HISTORY_EMPTY_MESSAGE;
      row.headerData = [{
        label: CORE.COMMON_HISTORY.KEYWORD.LABLE_NAME,
        value: row.keyword,
        displayOrder: 1,
        labelLinkFn: vm.goToKeywordList
      }];
      DialogFactory.dialogService(
        CORE.COMMON_HISTORY_POPUP_MODAL_CONTROLLER,
        CORE.COMMON_HISTORY_POPUP_MODAL_VIEW,
        ev,
        row).then(() => { // Empty Block
        }, (err) => BaseService.getErrorLog(err));
    };

    /* Goto Keywords list page. */
    vm.goToKeywordList = () => BaseService.goToKeywordList();

    //close popup on page destroy
    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, { closeAll: true });
    });
  }
})();
