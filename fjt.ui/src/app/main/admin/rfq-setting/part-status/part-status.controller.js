(function () {
  'use strict';

  angular
    .module('app.admin.rfqsetting')
    .controller('PartStatusController', PartStatusController);

  /** @ngInject */
  function PartStatusController(USER, $scope, CORE, RFQSettingFactory, BaseService, $timeout, DialogFactory, $mdDialog) { // eslint-disable-line func-names
    const vm = this;
    vm.isViewAlias = false;
    vm.isUpdatable = true;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.PART_STATUS;
    vm.StatusOptionsGridHeaderDropdown = CORE.StatusGridHeaderDropdown;
    vm.KeywordStatusGridHeaderDropdown = CORE.KeywordStatusGridHeaderDropdown;
    vm.DefaultDateFormat = _dateTimeDisplayFormat;
    vm.gridConfig = CORE.gridConfig;
    vm.LabelConstant = CORE.LabelConstant;
    const CurrentPageName = CORE.PAGENAME_CONSTANT[55].PageName;
    vm.partSourceDetailsList = _.clone(CORE.Suppliers_Api);
    vm.partStatusAliasDetail = [];
    vm.PartStatusAliasCriteria = [];
    vm.isEditIntigrate = false;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;

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
        vm.isCheckAR = vm.isCheckAV = vm.isCheckDK = vm.isCheckMO = vm.isCheckNW = vm.isCheckTTI = vm.isCheckHEILIND= true;
      } else {
        vm.isCheckAR = vm.isCheckAV = vm.isCheckDK = vm.isCheckMO = vm.isCheckNW = vm.isCheckTTI = vm.isCheckHEILIND= false;
      }
      vm.loadData();
    };

    vm.sourceHeader = [{
        field: 'Action',
        cellClass: 'gridCellColor',
        displayName: 'Action',
        width: '100',
        cellTemplate: '<grid-action-view grid="grid" row="row" style="overflow: hidden;padding:5px;overflow: hidden; white-space: nowrap;" class="height-grid ui-grid-cell-contents" ></grid-action-view>',
        enableFiltering: false,
        enableSorting: false,
        exporterSuppressExport: true,
        pinnedLeft: false,
        maxWidth: '100'
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
      },
      {
        field: 'displayOrder',
        displayName: vm.LabelConstant.COMMON.DisplayOrder + CORE.Modify_Grid_column_Allow_Change_Message,
        cellTemplate: CORE.DISPLAYORDER.CellTemplate,
        editableCellTemplate: CORE.DISPLAYORDER.EditableCellTemplate,
        width: CORE.DISPLAYORDER.Width,
        maxWidth: CORE.DISPLAYORDER.MaxWidth,
        enableCellEdit: true,
        type: 'number'
      },
      {
        field: 'colorCode',
        displayName: 'Color ',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">\
                              <span class="label-box label-colorCode" style="background-color:{{COL_FIELD}};Height:20px;width:50px" ng-show="row.entity.colorCode">\
                                                    </span><span class="label-box black-500-fg" ng-show="!row.entity.colorCode" style="border-color:gray;Height:20px;width:50px">\
                                                    </span>\
                               </div>',
        width: '80',
        enableFiltering: false,
        maxWidth: '100'
      },
      {
        field: 'aliaslist',
        width: '330',
        displayName: 'Alias',
        cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" ng-repeat="item in row.entity.statusAlias">\
                      <div layout="row" class="cm-custom-chips" >\
                       <span class="mr-5 pt-2">{{ item.aliasName }} </span>\
                       <md-chips ng-repeat="source in item.sourceDetails" >\
                           <md-chip>{{source}}</md-chip>\
                        </md-chips>\
                      </div>\
                    </div> ',
        enableSorting: true,
        maxWidth: '400'
      },
      {
        field: 'activeConvertedValue',
        displayName: 'Status',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">' +
          '<span class="label-box" \
                                                            ng-class="{\'label-success\':row.entity.isActive == true, \
                                                            \'label-warning\':row.entity.isActive == false}"> \
                                                                {{ COL_FIELD }}' +
          '</span>' +
          '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.StatusOptionsGridHeaderDropdown
        },
        ColumnDataType: 'StringEquals',
        width: 120,
        maxWidth: '120'
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
      }, {
        field: 'createdby',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY
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
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">' +
          '<span class="label-box" ng-class="{\'label-success\':row.entity.systemGenerated == true, \'label-warning\':row.entity.systemGenerated == false}"> {{ COL_FIELD }}' +
          '</span>' +
          '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.KeywordStatusGridHeaderDropdown
        },
        ColumnDataType: 'StringEquals',
        width: 120
      }
    ];
    vm.sourceHeader.unshift({
      field: 'Apply',
      headerCellTemplate: '<md-checkbox class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox" ng-model="grid.appScope.$parent.vm.Apply" \
                            ng-change="grid.appScope.$parent.vm.applyAll(grid.appScope.$parent.vm.Apply)"></md-checkbox>',
      width: '75',
      cellTemplate: '<div class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox" style="overflow:initial"><md-checkbox ng-disabled="row.entity.isDisabledDelete"  ng-model="row.entity.isRecordSelectedForRemove" \
                            ng-change="grid.appScope.$parent.vm.setPartStatusRemove(row.entity)"></md-checkbox></div>',
      enableFiltering: false,
      enableSorting: false,
      exporterSuppressExport: true,
      pinnedLeft: false,
      maxWidth: '80',
      enableColumnMoving: false,
      manualAddedCheckbox: true
    });
    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        //ItemsPerPage: CORE.UIGrid.ItemsPerPage(),
        SourceDetail: null,
        SortColumns: [],
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
      exporterCsvFilename: 'Part Status.csv',
      CurrentPage: CurrentPageName
    };


    function setDataAfterGetAPICall(partStatus, isGetDataDown) {
      if (partStatus && partStatus.data.PartStatus) {
        bindData(partStatus.data.PartStatus);
        if (!isGetDataDown) {
          vm.sourceData = partStatus.data.PartStatus;
          vm.currentdata = vm.sourceData.length;
        } else if (partStatus.data.PartStatus.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(partStatus.data.PartStatus);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        // must set after new data comes
        vm.totalSourceDataCount = partStatus.data.Count;
        if (!vm.gridOptions.enablePaging) {
          if (!isGetDataDown) {
            vm.gridOptions.gridApi.infiniteScroll.resetScroll();
          } else {
            vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
          }
        }
        if (!isGetDataDown) {
          vm.gridOptions.clearSelectedRows();
          if (!vm.isEditIntigrate) {
            cellEdit();
          }
        }
        if (vm.totalSourceDataCount === 0) {
          if (vm.pagingInfo.SearchColumns.length > 0 || vm.PartStatusAliasCriteria.length > 0) {
            vm.isNoDataFound = false;
            vm.emptyState = 0;
          } else {
            vm.isNoDataFound = true;
            vm.emptyState = null;
          }
        } else {
          vm.isNoDataFound = false;
          vm.emptyState = null;
        }
        $timeout(() => {
          vm.resetSourceGrid();
          if (!isGetDataDown) {
            if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
            }
          } else {
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount !== vm.currentdata ? true : false);
          }
        });
      }
    }


    /* retrieve Part Status list*/
    vm.loadData = () => {
      if (vm.isCheckAR) {
        vm.PartStatusAliasCriteria.push(vm.partSourceDetailsList[0].ID);
      }
      if (vm.isCheckAV) {
        vm.PartStatusAliasCriteria.push(vm.partSourceDetailsList[1].ID);
      }
      if (vm.isCheckDK) {
        vm.PartStatusAliasCriteria.push(vm.partSourceDetailsList[2].ID);
      }
      if (vm.isCheckMO) {
        vm.PartStatusAliasCriteria.push(vm.partSourceDetailsList[3].ID);
      }
      if (vm.isCheckNW) {
        vm.PartStatusAliasCriteria.push(vm.partSourceDetailsList[4].ID);
      }
      if (vm.isCheckTTI) {
        vm.PartStatusAliasCriteria.push(vm.partSourceDetailsList[5].ID);
      }
      if (vm.isCheckHEILIND) {
        vm.PartStatusAliasCriteria.push(vm.partSourceDetailsList[8].ID);
      }
      vm.pagingInfo.SourceDetail = vm.PartStatusAliasCriteria ? vm.PartStatusAliasCriteria.join(',') : vm.PartStatusAliasCriteria;
      vm.Apply = false;
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = RFQSettingFactory.retrivePartStatusList().query(vm.pagingInfo).$promise.then((partStatus) => {
        if (partStatus.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          vm.pagingInfo.SourceDetail = null;
          setDataAfterGetAPICall(partStatus, false);
        }
        vm.PartStatusAliasCriteria = [];
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* load more data on mouse scroll */
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = RFQSettingFactory.retrivePartStatusList().query(vm.pagingInfo).$promise.then((partStatus) => {
        if (partStatus) {
          setDataAfterGetAPICall(partStatus, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //bind data
    const bindData = (partStatusDetail) => {
      _.each(partStatusDetail, (item) => {
        const aliasDetails = [];
        const aliasList = [];
        const split = item.aliaslist ? item.aliaslist.split('##') : null;
        _.each(split, (aliasitem) => {
          vm.partStatusAliasDetail = aliasitem ? aliasitem.split('@@@') : null;
          const aliasName = vm.partStatusAliasDetail[0] ? vm.partStatusAliasDetail[0] : null;
          const sourceDetails = vm.partStatusAliasDetail[1] ? vm.partStatusAliasDetail[1].split('#$#') : null;
          aliasDetails.push({
            aliasName: aliasName,
            sourceDetails: sourceDetails
          });
          aliasList.push(aliasName);
          item.statusAlias = aliasDetails ? aliasDetails : null;
          item.aliaslist = aliasList ? aliasList.join(',') : null;
        });
      });
    };

    //Update cell for display order flied
    function cellEdit() {
      vm.isEditIntigrate = true;
      vm.gridOptions.gridApi.edit.on.afterCellEdit($scope, (rowEntity, colDef, newvalue, oldvalue) => {
        var obj = _.find(vm.sourceData, (item) => item.id === rowEntity.id);
        var index = vm.sourceData.indexOf(obj);
        if (colDef.field === 'displayOrder' && newvalue !== oldvalue) {
          if (!BaseService.setInvalidDisplayOrder(oldvalue, newvalue, index, (colDef.colInitIndex - 1), vm.gridOptions, vm.sourceData, vm.sourceHeader, rowEntity, 0)) {
            return;
          }
          const partStatusModel = {
            displayOrder: newvalue,
            id: rowEntity.id
          };
          vm.cgBusyLoading = RFQSettingFactory.updatePartStatusDisplayOrder().save(partStatusModel).$promise.then((res) => {
            if (res) {
              if (res.status === CORE.ApiResponseTypeStatus.FAILED || res.status === CORE.ApiResponseTypeStatus.EMPTY) {
                rowEntity.displayOrder = oldvalue;
              } else if (res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      });
    }
    // delete part status
    vm.deleteRecord = (partstatus) => {
      let selectedIDs = [];
      if (partstatus) {
        selectedIDs.push(partstatus.id);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((partstatusItem) => partstatusItem.id);
        }
      }
      if (selectedIDs) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Part Status', selectedIDs.length);
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
            vm.cgBusyLoading = RFQSettingFactory.deletePartStatus().query({
              objIDs: objIDs
            }).$promise.then((data) => {
              if (data && data.data && (data.data.length > 0 || data.data.transactionDetails)) {
                const dataObj = {
                  TotalCount: data.data.transactionDetails[0].TotalCount,
                  pageName: CORE.PageName.part_status
                };
                BaseService.deleteAlertMessageWithHistory(dataObj, (ev) => {
                  const IDs = {
                    id: selectedIDs,
                    CountList: true
                  };
                  return RFQSettingFactory.deletePartStatus().query({
                    objIDs: IDs
                  }).$promise.then((res) => {
                    let data = {};
                    data = res.data;
                    data.pageTitle = partstatus ? partstatus.name : null;
                    data.PageName = CORE.PageName.part_status;
                    data.selectedIDs = stringFormat('{0}{1}', selectedIDs.length, ' Selected');
                    if (res.data) {
                      DialogFactory.dialogService(
                        USER.ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER,
                        USER.ADMIN_SHOW_TRANSACTION_DETAILS_VIEW,
                        ev,
                        data).then(() => {}, () => {});
                    }
                  }).catch((error) => BaseService.getErrorLog(error));
                });
              } else {
                BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                vm.gridOptions.clearSelectedRows();
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {}).catch((error) => BaseService.getErrorLog(error));
      } else {
        //show validation message no data selected
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContent.message = stringFormat(messageContent.message, 'Part Status');
        const alertModel = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(alertModel);
      }
    };
    //open popup for add edit new part status
    vm.addEditRecord = (data, ev) => {
      let objdata = {};
      if (data) {
        objdata = data;
      }
      objdata.isMaster = true;
      DialogFactory.dialogService(
        USER.ADMIN_PART_STATUS_ADD_UPDATE_MODAL_CONTROLLER,
        USER.ADMIN_PART_STATUS_ADD_UPDATE_MODAL_VIEW,
        ev,
        objdata).then((result) => {
        if (result) {
          BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
        }
      }, (error) => BaseService.getErrorLog(error));
    };

    /* delete multiple data called from directive of ui-grid*/
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };

    /* Update part status */
    vm.updateRecord = (row, ev) => {
      vm.addEditRecord(row.entity, ev);
    };

    vm.cancel = () => {
      $mdDialog.cancel();
    };

    /* Add component Field Alias */
    vm.showAlias = (row, ev) => {
      const model = {
        refTableName: CORE.TABLE_NAME.RFQ_MOUNTINGTYPE,
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
    //refresh part status
    vm.refreshPartStatus = () => {
      vm.loadData();
    };
    //apply all details
    vm.applyAll = (applyAll) => {
      if (applyAll) {
        _.map(vm.sourceData, selectStatus);
      } else {
        _.map(vm.sourceData, unselectStatus);
      }
    };
    const selectStatus = (row) => {
      row.isRecordSelectedForRemove = row.isDisabledDelete ? false : true;
      if (row.isRecordSelectedForRemove) {
        vm.gridOptions.gridApi.selection.selectRow(row);
      }
    };
    const unselectStatus = (row) => {
      row.isRecordSelectedForRemove = false;
      vm.gridOptions.clearSelectedRows();
    };
    vm.setPartStatusRemove = (row) => {
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

    //close popup on part status
    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, {
        closeAll: true
      });
    });
  }
})();
