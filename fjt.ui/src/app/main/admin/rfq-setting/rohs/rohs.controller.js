(function () {
  'use strict';

  angular
    .module('app.admin.rfqsetting')
    .controller('RohsController', RohsController);

  /** @ngInject */
  function RohsController(USER, $scope, CORE, RFQSettingFactory, BaseService, $timeout, DialogFactory, $mdDialog) { // eslint-disable-line func-names
    const vm = this;
    vm.isViewAlias = false;
    vm.isUpdatable = true;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.ROHS;
    vm.StatusOptionsGridHeaderDropdown = CORE.StatusGridHeaderDropdown;
    vm.KeywordStatusGridHeaderDropdown = CORE.KeywordStatusGridHeaderDropdown;
    vm.DefaultDateFormat = _dateTimeDisplayFormat;
    vm.gridConfig = CORE.gridConfig;
    vm.LabelConstant = CORE.LabelConstant;
    vm.partSourceDetailsList = _.clone(CORE.Suppliers_Api);
    vm.rohsAliasDetail = [];
    vm.rohsAliasCriteria = [];
    vm.isEditIntigrate = false;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
    const CurrentPageName = CORE.PAGENAME_CONSTANT[54].PageName;

    /** get filter for source details */
    vm.getListFilters = () => {
      if (vm.isCheckAR && vm.isCheckAV && vm.isCheckDK && vm.isCheckMO && vm.isCheckNW && vm.isCheckTTI && vm.isCheckHEILIND) {
        vm.isCheckAll = true;
      } else if (!vm.isCheckAR || !vm.isCheckAV || !vm.isCheckDK || !vm.isCheckMO || !vm.isCheckNW || !vm.isCheckTTI || !vm.isCheckHEILIND) {
        vm.isCheckAll = false;
      }
      vm.pagingInfo.Page = vm.gridOptions.paginationCurrentPage = CORE.UIGrid.Page();
      vm.loadData();
    };

    vm.getAllListFilter = () => {
      if (vm.isCheckAll) {
        vm.isCheckAR = vm.isCheckAV = vm.isCheckDK = vm.isCheckMO = vm.isCheckNW = vm.isCheckTTI = vm.isCheckHEILIND = true;
      } else {
        vm.isCheckAR = vm.isCheckAV = vm.isCheckDK = vm.isCheckMO = vm.isCheckNW = vm.isCheckTTI = vm.isCheckHEILIND = false;
      }
      vm.pagingInfo.Page = vm.gridOptions.paginationCurrentPage = CORE.UIGrid.Page();
      vm.loadData();
    };

    vm.sourceHeader = [{
      field: 'Action',
      cellClass: 'gridCellColor',
      displayName: 'Action',
      width: '120',
      cellTemplate: '<grid-action-view grid="grid" row="row" style="\overflow: hidden;padding:1px !important; overflow: hidden; white-space: nowrap;\" class="height-grid ui-grid-cell-contents"></grid-action-view>',
      enableFiltering: false,
      enableSorting: false,
      exporterSuppressExport: true,
      pinnedLeft: false
    }, {
      field: '#',
      width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
      cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
      enableFiltering: false,
      enableSorting: false
    }, {
      field: 'name',
      displayName: 'Name',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '200'
    }, {
      field: 'parentRoHS',
      displayName: 'Parent RoHS',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '200'
    }, {
      field: 'RoHSPeers',
      displayName: 'Acceptable RoHS Peers',
      cellTemplate: ' <div style="overflow: hidden" class="ui-grid-cell-contents layout-wrap"> ' +
        ' <span class="label-box margin-left-2 mb-5 label-primary" ng-repeat="objrohsPeer in row.entity.rohsPeerlist track by $index">{{objrohsPeer}}</span> ' +
        ' </div> ',
      width: '200'
    }, {
      field: 'rohsParentList',
      displayName: 'Acceptable as Part of',
      cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents layout-wrap"> ' +
        ' <span class="label-box margin-left-2 mb-5 label-primary" ng-repeat="objrohsParent in row.entity.rohsParents track by $index">{{objrohsParent}}</span> ' +
        ' </div> ',
      width: '200'
    }, {
      field: 'rohsAcceptableChildrenList',
      displayName: 'Acceptable Children & Peers',
      cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents layout-wrap"> ' +
        ' <span class="label-box margin-left-2 mb-5 label-primary" ' +
        ' ng-repeat="objrohsPeerAndChild in row.entity.rohsAcceptableChildrenAndPeerArr track by $index">{{objrohsPeerAndChild}}</span> ' +
        ' </div> ',
      width: '200'
    }, {
      field: 'category',
      displayName: 'Category',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '200'
    }, {
      field: 'displayOrder',
      displayName: vm.LabelConstant.COMMON.DisplayOrder + CORE.Modify_Grid_column_Allow_Change_Message,
      cellTemplate: CORE.DISPLAYORDER.CellTemplate,
      editableCellTemplate: CORE.DISPLAYORDER.EditableCellTemplate,
      width: CORE.DISPLAYORDER.Width,
      maxWidth: CORE.DISPLAYORDER.MaxWidth,
      enableCellEdit: true,
      type: 'number',
      validators: {
        required: false
      }
    }, {
      field: 'rohsPath',
      displayName: 'Icon',
      width: '90',
      maxWidth: 150,
      cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-click="grid.appScope.$parent.vm.addEditIcon(row.entity,$event)">' +
        '<span>' +
        '<img class="cm-country-image" ng-src="{{COL_FIELD}}">' +
        '</span>' +
        '</div>',
      enableFiltering: false,
      enableSorting: false,
      exporterSuppressExport: true,
      enableCellEdit: false
    }, {
      field: 'description',
      displayName: 'Description',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '300'
    }, {
      field: 'aliaslist',
      width: '300',
      displayName: 'Alias',
      cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" ng-repeat="item in row.entity.aliaslistWithNewLine">\
                      <div layout="row" class="cm-custom-chips" >\
                       <span class="mr-5 pt-2">{{ item.aliasName }} </span>\
                       <md-chips ng-repeat="source in item.sourceDetails" >\
                           <md-chip>{{source}}</md-chip>\
                        </md-chips>\
                      </div>\
                    </div> ',
      enableFiltering: true,
      enableSorting: true
    }, {
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
      width: 120
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
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">' +
        '<span class="label-box" \
                              ng-class="{\'label-success\':row.entity.systemGenerated == true, \
                              \'label-warning\':row.entity.systemGenerated == false}"> \
                                  {{ COL_FIELD }}' +
        '</span>' +
        '</div>',
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        term: null,
        options: vm.KeywordStatusGridHeaderDropdown
      },
      ColumnDataType: 'StringEquals',
      width: 120
    }];
    vm.sourceHeader.unshift({
      field: 'Apply',
      headerCellTemplate: '<md-checkbox class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox" ng-model="grid.appScope.$parent.vm.Apply" \
                            ng-change="grid.appScope.$parent.vm.applyAll(grid.appScope.$parent.vm.Apply)"></md-checkbox>',
      width: '75',
      cellTemplate: '<div class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox" style="overflow:initial"><md-checkbox  ng-disabled="row.entity.isDisabledDelete"  ng-model="row.entity.isRecordSelectedForRemove" \
                            ng-change="grid.appScope.$parent.vm.setRoHSRemove(row.entity)"></md-checkbox></div>',
      enableFiltering: false,
      enableSorting: false,
      exporterSuppressExport: true,
      pinnedLeft: false,
      enableColumnMoving: false,
      manualAddedCheckbox: true
    });
    const initPageInfo = () => {
      vm.pagingInfo = {
        // Page: CORE.UIGrid.Page(),
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
      exporterCsvFilename: `${CurrentPageName}.csv`,
      CurrentPage: CurrentPageName
    };

    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICall = (rohs, isGetDataDown) => {
      if (rohs && rohs.data && rohs.data.RoHSList) {
        vm.pagingInfo.SourceDetail = null;
        bindData(rohs.data.RoHSList);
        if (!isGetDataDown) {
          vm.sourceData = rohs.data.RoHSList;
          vm.currentdata = vm.sourceData.length;
        } else if (rohs.data.RoHSList.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(rohs.data.RoHSList);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }

        vm.sourceData.map((item) => {
          if (item.rohsIcon) {
            item.rohsPath = CORE.WEB_URL + USER.ROHS_BASE_PATH + item.rohsIcon;
          } else {
            item.rohsPath = CORE.WEB_URL + CORE.NO_IMAGE_ROHS;
          }
        });

        // must set after new data comes
        vm.totalSourceDataCount = rohs.data.Count;
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
          if (vm.pagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode) || vm.rohsAliasCriteria.length > 0) {
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
          if (!isGetDataDown) {
            vm.resetSourceGrid();
            if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
            }
          } else {
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount !== vm.currentdata ? true : false);
          }
        });
        vm.rohsAliasCriteria = [];
      }
    };

    /* retrieve rohs list*/
    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      if (vm.isCheckAR) {
        vm.rohsAliasCriteria.push(vm.partSourceDetailsList[0].ID);
      }
      if (vm.isCheckAV) {
        vm.rohsAliasCriteria.push(vm.partSourceDetailsList[1].ID);
      }
      if (vm.isCheckDK) {
        vm.rohsAliasCriteria.push(vm.partSourceDetailsList[2].ID);
      }
      if (vm.isCheckMO) {
        vm.rohsAliasCriteria.push(vm.partSourceDetailsList[3].ID);
      }
      if (vm.isCheckNW) {
        vm.rohsAliasCriteria.push(vm.partSourceDetailsList[4].ID);
      }
      if (vm.isCheckTTI) {
        vm.rohsAliasCriteria.push(vm.partSourceDetailsList[5].ID);
      }
      if (vm.isCheckHEILIND) {
        vm.rohsAliasCriteria.push(vm.partSourceDetailsList[8].ID);
      }
      vm.pagingInfo.SourceDetail = vm.rohsAliasCriteria ? vm.rohsAliasCriteria.join(',') : vm.rohsAliasCriteria;
      vm.Apply = false;
      vm.cgBusyLoading = RFQSettingFactory.retriveRohsList().query(vm.pagingInfo).$promise.then((rohs) => {
        if (rohs && rohs.data) {
          setDataAfterGetAPICall(rohs, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* load more data on mouse scroll */
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = RFQSettingFactory.retriveRohsList().query(vm.pagingInfo).$promise.then((rohs) => {
        if (rohs && rohs.data) {
          setDataAfterGetAPICall(rohs, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    //bind data
    const bindData = (rohsDetail) => {
      _.each(rohsDetail, (item) => {
        var aliasDetails = [];
        var aliasList = [];
        var split = item.aliaslist ? item.aliaslist.split('##') : null;
        _.each(split, (aliasitem) => {
          vm.rohsAliasDetail = aliasitem ? aliasitem.split('@@@') : null;
          const aliasName = vm.rohsAliasDetail[0] ? vm.rohsAliasDetail[0] : null;
          const sourceDetails = vm.rohsAliasDetail[1] ? vm.rohsAliasDetail[1].split('#$#') : null;
          aliasDetails.push({
            aliasName: aliasName,
            sourceDetails: sourceDetails
          });
          aliasList.push(aliasName);
          item.aliaslistWithNewLine = aliasDetails ? aliasDetails : null;
          item.aliaslist = aliasList ? aliasList.join(',') : null;
        });

        if (item.RoHSPeers) {
          let rohsPeer = [];
          rohsPeer = item.RoHSPeers.split('@@@');

          item.rohsPeerlist = rohsPeer;
          item.RoHSPeers = _.map(rohsPeer).toString();
        }
        if (item.rohsParentList) {
          let rohsParents = [];
          rohsParents = item.rohsParentList.split('@@@');

          item.rohsParents = rohsParents;
          item.rohsParentList = _.map(rohsParents).toString();
        }
        if (item.rohsAcceptableChildrenList) {
          let rohsAcceptableChildrenAndPeerArr = [];
          rohsAcceptableChildrenAndPeerArr = item.rohsAcceptableChildrenList.split('@@@');

          item.rohsAcceptableChildrenAndPeerArr = rohsAcceptableChildrenAndPeerArr;
          item.rohsAcceptableChildrenList = _.map(rohsAcceptableChildrenAndPeerArr).toString();
        }
      });
    };
    //Update cell for display order field
    function cellEdit() {
      vm.isEditIntigrate = true;
      vm.gridOptions.gridApi.edit.on.afterCellEdit($scope, (rowEntity, colDef, newvalue, oldvalue) => {
        var obj = _.find(vm.sourceData, (item) => item.id === rowEntity.id);
        var index = vm.sourceData.indexOf(obj);
        if (colDef.field === 'displayOrder' && newvalue !== oldvalue) {
          if (!BaseService.setInvalidDisplayOrder(oldvalue, newvalue, index, (colDef.colInitIndex - 1), vm.gridOptions, vm.sourceData, vm.sourceHeader, rowEntity, 0)) {
            return;
          }
          const rohsModel = {
            displayOrder: newvalue,
            id: rowEntity.id
          };
          vm.cgBusyLoading = RFQSettingFactory.updateRoHSDisplayOrder().save(rohsModel).$promise.then((res) => {
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
    // delete rohs
    vm.deleteRecord = (partcategory) => {
      let selectedIDs = [];
      if (partcategory) {
        selectedIDs.push(partcategory.id);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((partCategoryItem) => partCategoryItem.id);
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
            vm.cgBusyLoading = RFQSettingFactory.deleteRohs().query({
              objIDs: objIDs
            }).$promise.then((data) => {
              if (data && data.data && (data.data.length > 0 || data.data.transactionDetails)) {
                const detail = {
                  TotalCount: data.data.transactionDetails[0].TotalCount,
                  pageName: CORE.PageName.rohs
                };
                BaseService.deleteAlertMessageWithHistory(detail, (ev) => {
                  const IDs = {
                    id: selectedIDs,
                    CountList: true
                  };
                  return RFQSettingFactory.deleteRohs().query({
                    objIDs: IDs
                  }).$promise.then((res) => {
                    let data = {};
                    data = res.data;

                    data.pageTitle = partcategory ? partcategory.name : null;
                    data.PageName = CORE.PageName.rohs;
                    data.selectedIDs = stringFormat('{0}{1}', selectedIDs.length, ' Selected');
                    if (res.data) {
                      DialogFactory.dialogService(
                        USER.ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER,
                        USER.ADMIN_SHOW_TRANSACTION_DETAILS_VIEW,
                        ev,
                        data).then(() => { }, () => { });
                    }
                  }).catch((error) => BaseService.getErrorLog(error));
                });
              } else {
                BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                vm.gridOptions.clearSelectedRows();
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => { }).catch((error) => BaseService.getErrorLog(error));
      } else {
        //show validation message no data selected
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContent.message = stringFormat(messageContent.message, CurrentPageName);
        const alertModel = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(alertModel);
      }
    };


    /* add.edit defect category*/
    vm.addEditIcon = (data, ev) => {
      DialogFactory.dialogService(
        USER.ADMIN_ROHS_ADD_UPDATE_MODAL_CONTROLLER,
        USER.ADMIN_ROHS_ADD_UPDATE_MODAL_VIEW,
        ev,
        data).then(() => {
          BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
        }, (err) => BaseService.getErrorLog(err));
    };

    /* add.edit Rohs Status*/
    vm.addEditRecord = (data, ev) => {
      var objdata = {};
      if (data) {
        objdata = data;
      }
      objdata.isMaster = true;
      DialogFactory.dialogService(
        CORE.MANAGE_ROHS_MODAL_CONTROLLER,
        CORE.MANAGE_ROHS_MODAL_VIEW,
        ev,
        objdata).then(() => {
          BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
        }, () => {
          BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
        }, (err) => BaseService.getErrorLog(err));
    };

    /* delete multiple data called from directive of ui-grid*/
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };

    /* Update rohs */
    vm.updateRecord = (row, ev) => {
      vm.addEditRecord(row.entity, ev);
    };

    vm.cancel = () => {
      $mdDialog.cancel();
    };

    /* Add component Field Alias */
    vm.showAlias = (row, ev) => {
      var model = {
        refTableName: CORE.TABLE_NAME.RFQ_ROHS,
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
        },
          () => { });
    };
    //apply all details
    vm.applyAll = (applyAll) => {
      if (applyAll) {
        _.map(vm.sourceData, selectRoHS);
      } else {
        _.map(vm.sourceData, unselectRoHS);
      }
    };
    const selectRoHS = (row) => {
      row.isRecordSelectedForRemove = row.isDisabledDelete ? false : true;
      if (row.isRecordSelectedForRemove) {
        vm.gridOptions.gridApi.selection.selectRow(row);
      }
    };
    const unselectRoHS = (row) => {
      row.isRecordSelectedForRemove = false;
      vm.gridOptions.clearSelectedRows();
    };
    vm.setRoHSRemove = (row) => {
      var totalItem = _.filter(vm.sourceData, (data) => !data.isDisabledDelete);
      var selectItem = _.filter(vm.sourceData, (data) => data.isRecordSelectedForRemove === true);
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
      $mdDialog.hide(false, {
        closeAll: true
      });
    });
  }
})();
