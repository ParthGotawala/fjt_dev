(function () {
  'use strict';

  angular
    .module('app.admin.rfqsetting')
    .controller('ConnecterTypeController', ConnecterTypeController);

  /** @ngInject */
  function ConnecterTypeController(USER, $scope, CORE, RFQSettingFactory, BaseService, $timeout, DialogFactory, $mdDialog) {  // eslint-disable-line func-names
    const vm = this;
    vm.isViewAlias = false;
    vm.isUpdatable = true;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.CONNECTER_TYPE;
    vm.StatusOptionsGridHeaderDropdown = CORE.StatusGridHeaderDropdown;
    vm.KeywordStatusGridHeaderDropdown = CORE.KeywordStatusGridHeaderDropdown;
    vm.DefaultDateFormat = _dateTimeDisplayFormat;
    vm.gridConfig = CORE.gridConfig;
    vm.LabelConstant = CORE.LabelConstant;
    vm.partSourceDetailsList = _.clone(CORE.Suppliers_Api);
    vm.connectorTypeAliasDetail = [];
    vm.ConnectorTypeAliasCriteria = [];
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;
    const CurrentPageName = CORE.PAGENAME_CONSTANT[15].PageName;

    vm.getListFilters = () => {
      if (vm.isCheckAR && vm.isCheckAV && vm.isCheckDK && vm.isCheckMO && vm.isCheckNW && vm.isCheckTTI && vm.isCheckHEILIND) {
        vm.isCheckAll = true;
      } else if (!vm.isCheckAR || !vm.isCheckAV || !vm.isCheckDK || !vm.isCheckMO || !vm.isCheckNW || !vm.isCheckTTI || !vm.isCheckHEILIND) {
        vm.isCheckAll = false;
      }
      vm.loadData();
    };

    vm.getAllListFilter = () => {
      if (vm.isCheckAll) {
        vm.isCheckAR = vm.isCheckAV = vm.isCheckDK = vm.isCheckMO = vm.isCheckNW = vm.isCheckTTI = vm.isCheckHEILIND = true;
      } else {
        vm.isCheckAR = vm.isCheckAV = vm.isCheckDK = vm.isCheckMO = vm.isCheckNW = vm.isCheckTTI = vm.isCheckHEILIND = false;
      }
      vm.loadData();
    };

    vm.sourceHeader = [{
      field: 'Action',
      cellClass: 'gridCellColor',
      displayName: 'Action',
      width: '80',
      cellTemplate: '<grid-action-view grid="grid" row="row" style="overflow: hidden;padding:5px;overflow: hidden; white-space: nowrap;" class="height-grid ui-grid-cell-contents" ></grid-action-view>',
      enableFiltering: false,
      enableSorting: false,
      exporterSuppressExport: true,
      pinnedLeft: false,
      maxWidth: '90'
    }, {
      field: '#',
      width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
      cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
      enableFiltering: false,
      enableSorting: false,
      maxWidth: '80'
    }, {
      field: 'name',
      displayName: 'Name',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '300',
      maxWidth: '350'
    }, {
      field: 'description',
      displayName: 'Description',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '300',
      maxWidth: '500'
    }, {
      field: 'aliaslist',
      width: '330',
      displayName: 'Alias',
      cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" ng-repeat="item in row.entity.connectorAlias">\
                      <div layout="row" class="cm-custom-chips" >\
                       <span class="mr-5 pt-2">{{ item.aliasName }} </span>\
                       <md-chips ng-repeat="source in item.sourceDetails" >\
                           <md-chip>{{source}}</md-chip>\
                        </md-chips>\
                      </div>\
                    </div> ',
      enableFiltering: true,
      enableSorting: true,
      maxWidth: '400'
    }, {
      field: 'activeConvertedValue',
      displayName: 'Status',
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
        + '<span class="label-box" \
                                                            ng-class="{\'label-success\':row.entity.isActive == true, \
                                                            \'label-warning\':row.entity.isActive == false}"> \
                                                                {{ COL_FIELD }}'
        + '</span>'
        + '</div>',
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        term: null,
        options: vm.StatusOptionsGridHeaderDropdown
      },
      ColumnDataType: 'StringEquals',
      width: 120,
      maxWidth: '120'
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
    }, {
      field: 'SyatemGeneratedValue',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_SYSTEM_GENERATED,
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
        + '<span class="label-box"  ng-class="{\'label-success\':row.entity.systemGenerated == true, \'label-warning\':row.entity.systemGenerated == false}"> {{ COL_FIELD }}'
        + '</span>'
        + '</div>',
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        term: null,
        options: vm.KeywordStatusGridHeaderDropdown
      },
      ColumnDataType: 'StringEquals',
      width: 120
    }];
    vm.sourceHeader.unshift(
      {
        field: 'Apply',
        headerCellTemplate: '<md-checkbox class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox" ng-model="grid.appScope.$parent.vm.Apply" \
                            ng-change="grid.appScope.$parent.vm.applyAll(grid.appScope.$parent.vm.Apply)"></md-checkbox>',
        width: '75',
        cellTemplate: '<div class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox" style="overflow:initial"><md-checkbox  ng-disabled="row.entity.isDisabledDelete"  ng-model="row.entity.isRecordSelectedForRemove" \
                            ng-change="grid.appScope.$parent.vm.setConnectorTypeRemove(row.entity)"></md-checkbox></div>',
        enableFiltering: false,
        enableSorting: false,
        exporterSuppressExport: true,
        allowCellFocus: false,
        pinnedLeft: false,
        maxWidth: '80',
        enableColumnMoving: false,
        manualAddedCheckbox: true
      });

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SourceDetail: null,
        SortColumns: [['name', 'ASC']],
        SearchColumns: []
      };
    };
    initPageInfo();

    vm.gridOptions = {
      enablePaging: isEnablePagination,
      enablePaginationControls: isEnablePagination,
      showColumnFooter: false,
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: false,
      multiSelect: true,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: `${CurrentPageName}.csv`,
      CurrentPage: CurrentPageName
    };

    function setDataAfterGetAPICall(connecterType, isGetDataDown) {
      if (connecterType && connecterType.data.PartCategory) {
        bindData(connecterType.data.PartCategory);
        if (!isGetDataDown) {
          vm.sourceData = connecterType.data.PartCategory;
          vm.currentdata = vm.sourceData.length;
        }
        else if (connecterType.data.PartCategory.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(connecterType.data.PartCategory);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        // must set after new data comes
        vm.totalSourceDataCount = connecterType.data.Count;
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
          if (vm.pagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode) || vm.ConnectorTypeAliasCriteria.length > 0) {
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

    /* retrieve Users list*/
    vm.loadData = () => {
      if (vm.isCheckAR) {
        vm.ConnectorTypeAliasCriteria.push(vm.partSourceDetailsList[0].ID);
      }
      if (vm.isCheckAV) {
        vm.ConnectorTypeAliasCriteria.push(vm.partSourceDetailsList[1].ID);
      }
      if (vm.isCheckDK) {
        vm.ConnectorTypeAliasCriteria.push(vm.partSourceDetailsList[2].ID);
      }
      if (vm.isCheckMO) {
        vm.ConnectorTypeAliasCriteria.push(vm.partSourceDetailsList[3].ID);
      }
      if (vm.isCheckNW) {
        vm.ConnectorTypeAliasCriteria.push(vm.partSourceDetailsList[4].ID);
      }
      if (vm.isCheckTTI) {
        vm.ConnectorTypeAliasCriteria.push(vm.partSourceDetailsList[5].ID);
      }
      if (vm.isCheckHEILIND) {
        vm.ConnectorTypeAliasCriteria.push(vm.partSourceDetailsList[8].ID);
      }
      vm.pagingInfo.SourceDetail = vm.ConnectorTypeAliasCriteria !== null ? vm.ConnectorTypeAliasCriteria.join(',') : vm.ConnectorTypeAliasCriteria;
      vm.Apply = false;
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = RFQSettingFactory.retriveConnecterTypeList().query(vm.pagingInfo).$promise.then((connecterType) => {
        if (connecterType.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          vm.pagingInfo.SourceDetail = null;
          setDataAfterGetAPICall(connecterType, false);
        }
        vm.ConnectorTypeAliasCriteria = [];
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* load more data on mouse scroll */
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = RFQSettingFactory.retriveConnecterTypeList().query(vm.pagingInfo).$promise.then((connecterType) => {
        if (connecterType) {
          setDataAfterGetAPICall(connecterType, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //bind data
    const bindData = (connectorDetail) => {
      _.each(connectorDetail, (item) => {
        const aliasDetails = [];
        const aliasList = [];
        const split = item.aliaslist ? item.aliaslist.split('##') : null;
        _.each(split, (aliasitem) => {
          vm.connectorTypeAliasDetail = aliasitem ? aliasitem.split('@@@') : null;
          const aliasName = vm.connectorTypeAliasDetail[0] ? vm.connectorTypeAliasDetail[0] : null;
          const sourceDetails = vm.connectorTypeAliasDetail[1] ? vm.connectorTypeAliasDetail[1].split('#$#') : null;
          aliasDetails.push({
            aliasName: aliasName,
            sourceDetails: sourceDetails
          });
          aliasList.push(aliasName);
          item.connectorAlias = aliasDetails ? aliasDetails : null;
          item.aliaslist = aliasList ? aliasList.join(',') : null;
        });
      });
    };

    // delete connecter type
    vm.deleteRecord = (connectertype) => {
      let selectedIDs = [];
      if (connectertype) {
        selectedIDs.push(connectertype.id);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((connectertypeItem) => connectertypeItem.id);
        }
      }
      if (selectedIDs) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, CurrentPageName, selectedIDs.length);

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
            vm.cgBusyLoading = RFQSettingFactory.deleteConnecterType().query({ objIDs: objIDs }).$promise.then((data) => {
              if (data && data.data && (data.data.length > 0 || data.data.transactionDetails)) {
                const dataObj = {
                  TotalCount: data.data.transactionDetails[0].TotalCount,
                  pageName: CORE.PageName.connector_type
                };
                BaseService.deleteAlertMessageWithHistory(dataObj, (ev) => {
                  const IDs = {
                    id: selectedIDs,
                    CountList: true
                  };
                  return RFQSettingFactory.deleteConnecterType().query({
                    objIDs: IDs
                  }).$promise.then((res) => {
                    let data = {};
                    data = res.data;
                    data.pageTitle = connectertype ? connectertype.name : null;
                    data.PageName = CORE.PageName.connector_type;
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
        //show validation message no data selected
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContent.message = stringFormat(messageContent.message, CurrentPageName);
        const alertModel = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(alertModel);
      }
    };


    vm.addEditRecord = (data, ev) => {
      let objdata = {};
      if (data) {
        objdata = data;
      }
      objdata.isMaster = true;
      DialogFactory.dialogService(
        CORE.MANAGE_CONNECTER_TYPE_MODAL_CONTROLLER,
        CORE.MANAGE_CONNECTER_TYPE_MODAL_VIEW,
        ev,
        objdata).then((result) => {
          if (result) {
            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
          }
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };

    /* delete multiple data called from directive of ui-grid*/
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };

    /* Update partcategory */
    vm.updateRecord = (row, ev) => {
      vm.addEditRecord(row.entity, ev);
    };

    vm.cancel = () => {
      $mdDialog.cancel();
    };

    /* Add component Field Alias */
    vm.showAlias = (row, ev) => {
      const model = {
        refTableName: CORE.TABLE_NAME.RFQ_CONNECTERTYPE,
        refId: row.id,
        isEdit: true,
        isAliasSmallLetter: true
      };
      DialogFactory.dialogService(
        CORE.COMPONENT_FIELD_GENERIC_ALIAS_CONTROLLER,
        CORE.COMPONENT_FIELD_GENERIC_ALIAS_VIEW,
        ev,
        model).then(() => {
          BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
        }, (err) => BaseService.getErrorLog(err));
    };

    //apply all details
    vm.applyAll = (applyAll) => {
      if (applyAll) {
        _.map(vm.sourceData, selectConnector);
      } else {
        _.map(vm.sourceData, unselectConnector);
      }
    };
    const selectConnector = (row) => {
      row.isRecordSelectedForRemove = row.isDisabledDelete ? false : true;
      if (row.isRecordSelectedForRemove) {
        vm.gridOptions.gridApi.selection.selectRow(row);
      }
    };
    const unselectConnector = (row) => {
      row.isRecordSelectedForRemove = false;
      vm.gridOptions.clearSelectedRows();
    };
    vm.setConnectorTypeRemove = (row) => {
      const totalItem = _.filter(vm.sourceData, (data) => !data.isDisabledDelete);
      const selectItem = _.filter(vm.sourceData, (data) => data.isRecordSelectedForRemove === true);
      if (row.isRecordSelectedForRemove) {
        vm.gridOptions.gridApi.selection.selectRow(row);
      } else {
        vm.gridOptions.gridApi.selection.unSelectRow(row);
      }
      if (totalItem.length === selectItem.length) {
        vm.Apply = true;
      } else {
        vm.Apply = false;
      }
    };

    //close popup on page destroy
    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, { closeAll: true });
    });

    //refresh connector type
    vm.refreshConnectorType = () => {
      vm.loadData();
    };
  }
})();
