(function () {
  'use strict';

  angular
    .module('app.admin.manufacturer')
    .controller('ManufacturerController', ManufacturerController);

  function ManufacturerController($state, $stateParams, $mdDialog, $scope, $timeout, CORE, USER, ManufacturerFactory, DialogFactory, BaseService, RFQTRANSACTION, ImportExportFactory, $rootScope) {
    const vm = this;
    vm.isUpdatable = vm.showUMIDHistory = true;
    vm.actionButtonName = 'History';
    vm.isImport = vm.IsManfucaturer = vm.IsDistributor = vm.isEditIntigrate = false;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.MANUFACTURER;
    vm.KeywordStatusGridHeaderDropdown = CORE.KeywordStatusGridHeaderDropdown;
    vm.Model = CORE.Import_export.Manufacturer.FileName;
    vm.StatusOptionsGridHeaderDropdown = CORE.StatusOptionsGridHeaderDropdown;
    vm.Module = CORE.Import_export.Manufacturer.FileName;
    vm.EntityTableName = CORE.Import_export.Manufacturer.Table_Name;
    vm.mfgType = $stateParams.mfgType ? $stateParams.mfgType : null;
    vm.ManfucaturerTab = CORE.ManfucaturerTab;
    vm.DistributorTab = CORE.DistributorTab;
    vm.DefaultDateFormat = _dateTimeDisplayFormat;
    vm.DefaultDateWithoutTimeFormat = _dateDisplayFormat;
    vm.setScrollClass = 'gridScrollHeight_Manufacturer';
    vm.selectedIndex = 0;
    vm.modulesForExportSampleTemplateConst = CORE.modulesForExportSampleTemplate;
    vm.gridConfig = CORE.gridConfig;
    vm.LabelConstant = CORE.LabelConstant;
    vm.customerTypeList = CORE.customerTypeDropdown;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;

    function loadsource(IsMFG) {
      vm.sourceHeader = [{
        field: 'Action',
        cellClass: 'gridCellColor',
        displayName: 'Action',
        width: '90',
        cellTemplate: '<grid-action-view grid="grid" row="row" style="overflow: hidden;padding:5px !important;overflow: hidden; white-space: nowrap;" class="height-grid ui-grid-cell-contents padding-0" ></grid-action-view>',
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
        field: 'systemID',
        width: '140',
        displayName: 'SystemID',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        enableFiltering: true,
        enableSorting: true,
        allowCellFocus: false
      }, {
        field: 'customerSystemID',
        width: '140',
        displayName: 'Customer#',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        enableFiltering: true,
        enableSorting: true,
        allowCellFocus: false
      }, {
        field: 'mfgCode',
        width: '100',
        displayName: 'Code',
        cellTemplate: '<div class="ui-grid-cell-contents text-left"><a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.editManufacturer(row.entity.id);">{{COL_FIELD}}</a>\
                          <copy-text label="\'Code\'" ng-if="row.entity.mfgCode" text="row.entity.mfgCode"></copy-text>\
                      </div>',
        enableFiltering: true,
        enableSorting: true,
        allowCellFocus: false
      }, {
        field: 'mfgName',
        width: '250',
        displayName: 'Business Name',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        enableFiltering: true,
        enableSorting: true,
        allowCellFocus: false
      }, {
        field: 'legalName',
        width: '250',
        displayName: 'Legal Name',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        enableFiltering: true,
        enableSorting: true,
        allowCellFocus: false
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
        field: 'aliaslist',
        width: '400',
        displayName: 'Alias',
        cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" ng-repeat="item in row.entity.aliaslistWithNewLine track by $index">\
                    <span>{{item.alias}}</span>&nbsp;\
                    <md-icon md-font-icon="icons-map-manufacturer" ng-if="item.isMapped"><md-tooltip>Mapped</md-tooltip></md-icon>\
                    <md-icon md-font-icon="icon-eye"><md-tooltip md-direction="top" class="tt-multiline">Created By: {{item.createdBy}} <br />Created At: {{item.createdAt | date:vm.DefaultDateFormat}}</md-tooltip></md-icon>\
          <md-icon md-font-icon="icon-history" ng-click="grid.appScope.$parent.vm.viewWhereUsed(row.entity, item.alias,$event)"><md-tooltip>Where Used</md-tooltip></md-icon>\
                  </div>',
        enableFiltering: true,
        enableSorting: true,
        allowCellFocus: false
      },
      {
        field: 'dateCodeFormat',
        displayName: CORE.LabelConstant.MFG.MFRDateCodeFormat,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true
      },
      {
        field: 'customerType',
        displayName: 'Customer Type',
        cellTemplate: '<div class="ui-grid-cell-contents">' +
          '<span  \
                              ng-class="{\'label-box label-success\':row.entity.customerType == \'E\', \
                              \'label-box label-warning\':row.entity.customerType == \'B\'}"> \
                                  {{grid.appScope.$parent.vm.getCustomerType(row.entity.customerType)}}' +
          '</span>' +
          '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.customerTypeList
        },
        ColumnDataType: 'StringEquals',
        width: '145'
      },
      {
        field: 'isCustOrDistyText',
        width: '250',
        displayName: 'Current Status(Manufacturer/Customer)',
        cellTemplate: '<div class="ui-grid-cell-contents text-left" style="width:100%; float:left; overflow:hidden;">\
                                      <span class="label-box" ng-class="grid.appScope.$parent.vm.getMFGTypeCurrStatusClassName(row.entity.isCustOrDistyText)">\
                                      {{COL_FIELD}}\
                                      </span>\
                                      </div>',
        enableFiltering: true,
        enableSorting: true,
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: CORE.MFRTypeDropdown
        },
        ColumnDataType: 'StringEquals'
      },
      {
        field: 'isActiveConvertedValue',
        displayName: 'Status',
        cellTemplate: '<div class="ui-grid-cell-contents">' +
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
        width: '110'
      },
      {
        field: 'updatedby',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true,
        visible: false
      }, {
        field: 'updatedAt',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableFiltering: false,
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
      }
      ];

      vm.editManufacturer = (id) => {
        if (vm.IsManfucaturer) {
          BaseService.goToManufacturer(id);
        }
      };

      vm.sourceHeader.unshift({
        field: 'Apply',
        headerCellTemplate: '<md-checkbox class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox" ng-model="grid.appScope.$parent.vm.Apply" \
                              ng-change="grid.appScope.$parent.vm.applyAll(grid.appScope.$parent.vm.Apply)"></md-checkbox>',
        width: '75',
        cellTemplate: '<div class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox" style="overflow:initial"><md-checkbox ng-disabled="row.entity.isDisabledDelete"  ng-model="row.entity.isRecordSelectedForRemove" \
                              ng-change="grid.appScope.$parent.vm.setMFGRemove(row.entity)"></md-checkbox></div>',
        enableFiltering: false,
        enableSorting: false,
        exporterSuppressExport: true,
        pinnedLeft: false,
        enableColumnMoving: false,
        manualAddedCheckbox: true
      });

      if (IsMFG) {
        const acquiredByObj = {
          field: 'acquired',
          width: '200',
          displayName: 'Acquired By',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableFiltering: true,
          enableSorting: true
        };

        const acquisitionDateObj = {
          field: 'buyDate',
          width: '170',
          displayName: 'Acquisition Date',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          type: 'date',
          enableFiltering: false,
          enableSorting: true
        };

        /* to add field at specific index */
        let acquiredByAddIndex = vm.sourceHeader.map((obj) => obj.field).indexOf('aliaslist');
        acquiredByAddIndex = acquiredByAddIndex > 0 ? acquiredByAddIndex + 1 : vm.sourceHeader.length - 1;
        vm.sourceHeader.splice(acquiredByAddIndex, 0, acquiredByObj);
        vm.sourceHeader.splice(acquiredByAddIndex + 1, 0, acquisitionDateObj);
        // vm.sourceHeader.splice(acquiredByAddIndex + 2, 0, isCompanyObj);
      } else {
        const objAuthorize = {
          field: 'authorizeTypeTxt',
          width: '200',
          displayName: 'Authorize Type',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableFiltering: true,
          enableSorting: true
        };
        vm.sourceHeader.splice(6, 0, objAuthorize);
      }
    }
    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [],
        SearchColumns: [],
        mfgType: vm.IsManfucaturer ? CORE.MFG_TYPE.MFG : CORE.MFG_TYPE.DIST,
        isCustOrDisty: vm.IsManfucaturer ? null : true,
        fromPageRequest: vm.IsManfucaturer ? CORE.MFG_TYPE.MFG : CORE.MFG_TYPE.DIST
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
      allowToExportAllData: true,
      exporterCsvFilename: vm.IsManfucaturer ? `${CORE.PAGENAME_CONSTANT[21].PageName}.csv` : 'Supplier.csv',
      CurrentPage: CORE.PAGENAME_CONSTANT[21].PageName,
      exporterAllDataFn: () => {
        const pagingInfoOld = _.clone(vm.pagingInfo);
        pagingInfoOld.pageSize = 0;
        pagingInfoOld.Page = 1;
        vm.gridOptions.isExport = pagingInfoOld.isExport = true;
        return ManufacturerFactory.retriveMfgCodeList().query(pagingInfoOld).$promise.then((manufacturer) => {
          if (manufacturer.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            if (manufacturer && manufacturer.data.mfgCode) {
              formatAliasOfGridData(manufacturer.data.mfgCode);
              return manufacturer.data.mfgCode;
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    // On tab change filter data for parts
    vm.onTabChanges = (TabName) => {
      vm.pagingInfo.SearchColumns = [];
      if (TabName === vm.ManfucaturerTab) {
        vm.IsManfucaturer = true;
        vm.IsDistributor = false;
        loadsource(vm.IsManfucaturer);
      } else {
        vm.IsManfucaturer = false;
      }
      if (TabName === vm.DistributorTab) {
        vm.IsDistributor = true;
        vm.IsManfucaturer = false;
        $timeout(loadsource(vm.IsManfucaturer));
      } else {
        vm.IsDistributor = false;
      }
    };

    function setDataAfterGetAPICall(manufacturer, isGetDataDown) {
      if (manufacturer && manufacturer.data.mfgCode) {
        formatAliasOfGridData(manufacturer.data.mfgCode);
        if (!isGetDataDown) {
          getDerivedManufacturerList();
          vm.gridOptions.exporterCsvFilename = vm.IsManfucaturer ? `${CORE.PAGENAME_CONSTANT[21].PageName}.csv` : 'Supplier.csv';
          vm.sourceData = manufacturer.data.mfgCode;
          vm.currentdata = vm.sourceData.length;
        } else if (manufacturer.data.mfgCode.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(manufacturer.data.mfgCode);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        if (vm.sourceData && vm.sourceData.length > 0) {
          _.each(vm.sourceData, (item) => item.buyDate = item.buyDate ? BaseService.getUIFormatedDate(item.buyDate, vm.DefaultDateWithoutTimeFormat) : null);
        }
        // must set after new data comes
        vm.totalSourceDataCount = manufacturer.data.Count;
        if (!vm.gridOptions.enablePaging) {
          if (!isGetDataDown) {
            vm.gridOptions.gridApi.infiniteScroll.resetScroll();
          } else {
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
          } else {
            vm.isNoDataFound = true;
            vm.emptyState = null;
          }
        } else {
          vm.isNoDataFound = false;
          vm.emptyState = null;
        }
        if (!vm.isEditIntigrate) {
          cellEdit();
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

    // get defect category data for grid bind
    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.pagingInfo.IsMFG = vm.IsManfucaturer;
      vm.pagingInfo.mfgType = vm.IsManfucaturer ? CORE.MFG_TYPE.MFG : CORE.MFG_TYPE.DIST;
      vm.pagingInfo.isCustOrDisty = vm.IsManfucaturer ? null : true;
      vm.pagingInfo.fromPageRequest = vm.IsManfucaturer ? CORE.MFG_TYPE.MFG : CORE.MFG_TYPE.DIST;
      vm.Apply = false;
      vm.cgBusyLoading = ManufacturerFactory.retriveMfgCodeList().query(vm.pagingInfo).$promise.then((manufacturer) => {
        if (manufacturer.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          if (manufacturer) {
            setDataAfterGetAPICall(manufacturer, false);
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // get data down
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = ManufacturerFactory.retriveMfgCodeList().query(vm.pagingInfo).$promise.then((manufacturer) => setDataAfterGetAPICall(manufacturer, true))
        .catch((error) => BaseService.getErrorLog(error));
    };

    // format Alias (all in new line) Of Grid Data
    const formatAliasOfGridData = (mfglist) => {
      _.each(mfglist, (item) => {
        // item.aliaslist = item.aliaslist ? item.aliaslist.replace(/!!!!/g, "<br>") : null;
        const Aliaslist = [];
        item.aliaslistWithNewLine = item.aliaslist ? item.aliaslist.split('!!!!') : null;
        _.each(item.aliaslistWithNewLine, (aliasSplit, index) => {
          aliasSplit = aliasSplit.split('@@@');
          if (Array.isArray(aliasSplit) && aliasSplit.length > 0) {
            const objSplitter = {
              alias: aliasSplit[0],
              isMapped: parseInt(aliasSplit[1]),
              createdBy: aliasSplit[2],
              createdAt: aliasSplit[3]
            };
            item.aliaslistWithNewLine[index] = objSplitter;
            Aliaslist.push(aliasSplit[0]);
          }
        });
        item.aliaslist = Aliaslist ? Aliaslist.join(',') : null;
      });
    };

    // Update cell for display order flied
    function cellEdit() {
      vm.isEditIntigrate = true;
      vm.gridOptions.gridApi.edit.on.afterCellEdit($scope, (rowEntity, colDef, newvalue, oldvalue) => {
        var obj = _.find(vm.sourceData, (item) => item.id === rowEntity.id);
        var index = vm.sourceData.indexOf(obj);
        if (colDef.field === 'displayOrder' && newvalue !== oldvalue) {
          if (!BaseService.setInvalidDisplayOrder(oldvalue, newvalue, index, (colDef.colInitIndex - 1), vm.gridOptions, vm.sourceData, vm.sourceHeader, rowEntity, 0)) {
            return;
          }
          const mfgCodeModel = {
            displayOrder: newvalue,
            id: rowEntity.id,
            fromPageRequest: vm.IsManfucaturer ? CORE.MFG_TYPE.MFG : CORE.MFG_TYPE.DIST
          };
          vm.cgBusyLoading = ManufacturerFactory.updateDisplayOrder().save(mfgCodeModel).$promise.then((res) => {
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
    // apply all details
    vm.applyAll = (applyAll) => {
      if (applyAll) {
        _.map(vm.sourceData, selectMFG);
      } else {
        _.map(vm.sourceData, unselectMFG);
      }
    };
    const selectMFG = (row) => {
      row.isRecordSelectedForRemove = row.isDisabledDelete ? false : true;
      if (row.isRecordSelectedForRemove) {
        vm.gridOptions.gridApi.selection.selectRow(row);
      }
    };
    const unselectMFG = (row) => {
      row.isRecordSelectedForRemove = false;
      vm.gridOptions.clearSelectedRows();
    };
    vm.setMFGRemove = (row) => {
      const totalItem = _.filter(vm.sourceData, (data) => !data.isDisabledDelete);
      const selectItem = _.filter(vm.sourceData, (data) => data.isRecordSelectedForRemove === true);
      if (row.isRecordSelectedForRemove) {
        vm.gridOptions.gridApi.selection.selectRow(row);
      } else {
        vm.gridOptions.gridApi.selection.unSelectRow(row);
      }
      vm.Apply = totalItem.length === selectItem.length;
    };

    vm.selectedOtherPermission = () => vm.gridOptions.getSelectedRowsCount ? vm.gridOptions.getSelectedRowsCount() : 0;

    vm.viewWhereUsed = (rowDet, code, ev) => {
      const mfgDetail = {
        name: rowDet.mfgName,
        mfgCode: code,
        isManufacturer: (vm.mfgType === CORE.MFG_TYPE.DIST ? false : true),
        mfgTypeLabel: vm.LabelConstant.MFG.Manufacturers
      };
      DialogFactory.dialogService(
        CORE.VIEW_WHEREUSED_MANUFACTURER_MODAL_CONTROLLER,
        CORE.VIEW_WHEREUSED_MANUFACTURER_MODAL_VIEW,
        ev,
        mfgDetail).then(() => { }, () => { }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.fab = {
      Status: false
    };

    /* update manufacturer*/
    vm.updateRecord = (row, ev) => vm.addEditRecord(row.entity, ev);

    /* delete defect category*/
    vm.deleteRecord = (manufacturer) => {
      let selectedIDs = [];
      if (manufacturer) {
        // selectedIDs = otherPermission.id;
        selectedIDs.push(manufacturer.id);
        // mfgTypeDet = manufacturer.mfgType;
      } else {
        // mfgTypeDet = vm.selectedRowsList[0].mfgType;
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((manufacturerItem) => manufacturerItem.id);
        }
      }

      if (selectedIDs) {
        const obj = {
          title: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM, vm.IsManfucaturer ? vm.LabelConstant.MFG.MFG : vm.LabelConstant.MFG.Supplier),
          textContent: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM_MESSAGE, selectedIDs.length, vm.IsManfucaturer ? vm.LabelConstant.MFG.MFG : vm.LabelConstant.MFG.Supplier),
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        const objIDs = {
          id: selectedIDs,
          // mfgType: mfgTypeDet,
          fromPageRequest: vm.IsManfucaturer ? CORE.MFG_TYPE.MFG : CORE.MFG_TYPE.DIST,
          CountList: false
        };
        DialogFactory.confirmDiolog(obj).then((resposne) => {
          if (resposne) {
            vm.cgBusyLoading = ManufacturerFactory.deleteMfgCode().query({
              objIDs: objIDs
            }).$promise.then((data) => {
              if (data.data && (data.data.length > 0 || data.data.transactionDetails)) {
                const deleteData = {
                  TotalCount: data.data.transactionDetails[0].TotalCount,
                  pageName: vm.IsManfucaturer ? CORE.PageName.manufacturer : CORE.PageName.supplier
                };
                BaseService.deleteAlertMessageWithHistory(deleteData, (ev) => {
                  const objIDs = {
                    id: selectedIDs,
                    CountList: true
                  };
                  return ManufacturerFactory.deleteMfgCode().query({
                    objIDs: objIDs
                  }).$promise.then((res) => {
                    let data = {};
                    data = res.data;
                    data.pageTitle = manufacturer ? manufacturer.mfgName : null;
                    data.PageName = vm.IsManfucaturer ? CORE.PageName.manufacturer : CORE.PageName.supplier;
                    data.selectedIDs = stringFormat('{0}{1}', selectedIDs.length, ' Selected');
                    if (res.data) {
                      DialogFactory.dialogService(
                        USER.ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER,
                        USER.ADMIN_SHOW_TRANSACTION_DETAILS_VIEW,
                        ev,
                        data).then(() => { }, () => { }).catch((error) => BaseService.getErrorLog(error));
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
        // show validation message no data selected
        const alertModel = {
          title: USER.USER_ERROR_LABEL,
          textContent: stringFormat(USER.SELECT_ONE_LABEL, 'manufacturer')
        };
        DialogFactory.alertDialog(alertModel);
      }
    };

    /* add.edit manufacturer*/
    vm.addEditRecord = (data, ev) => {
      if (data && data.id) {
        data.masterPage = true;
        data.isUpdatable = true;
        if (vm.IsManfucaturer) {
          BaseService.goToManufacturer(data.id);
        } else if (vm.IsDistributor) {
          BaseService.goToSupplierDetail(data.id);
        }
      } else {
        data = {
          mfgType: vm.IsManfucaturer ? CORE.MFG_TYPE.MFG : CORE.MFG_TYPE.DIST,
          masterPage: true
        };

        DialogFactory.dialogService(
          CORE.MANAGE_MFGCODE_MODAL_CONTROLLER,
          CORE.MANAGE_MFGCODE_MODAL_VIEW,
          ev,
          data).then(() => { }, (data) => {
            if (data) {
              BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
            }
          },
            (err) => BaseService.getErrorLog(err));
      }
    };

    /* delete multiple data called from directive of ui-grid*/
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };

    vm.import = (ev) => {
      vm.event = ev;
      if (vm.apiVerificationErrorCount > 0) {
        openMFRErrorPopup();
      } else {
        angular.element('#fiexcel').trigger('click');
      }
    };

    vm.importDetail = (ev, newimport) => {
      vm.event = ev;
      if (vm.apiVerificationErrorCount > 0 && !newimport) {
        openMFRErrorPopup();
      } else {
        const data = {
          type: CORE.MFG_TYPE.MFG
        };
        DialogFactory.dialogService(
          CORE.MFR_IMPORT_MODAL_CONTROLLER,
          CORE.MFR_IMPORT_MODAL_VIEW,
          vm.event,
          data).then(() => {
            vm.loadData();
          }, () => {
            vm.loadData();
          }, (err) => BaseService.getErrorLog(err));
      }
    };

    // Import functionality

    vm.eroOptions = {
      workstart: function () { },
      workend: function () { },
      sheet: function (json, sheetnames, select_sheet_cb, file) {
        const type = file.name.split('.');
        if (_.find(CORE.UPLOAD_DOCUMENT_TYPE, (docType) => docType === type[type.length - 1])) {
          const data = {
            headers: CORE.MFG_COLUMN_MAPPING,
            excelHeaders: json[0],
            notquote: true,
            headerName: vm.LabelConstant.MFG.MFG
          };
          DialogFactory.dialogService(
            RFQTRANSACTION.PRICING_COLUMN_MAPPING_CONTROLLER,
            RFQTRANSACTION.PRICING_COLUMN_MAPPING_VIEW,
            vm.event,
            data).then((result) => {
              json[0] = result.excelHeaders;
              generateModel(json, result.model, data.excelHeaders);
            }, (err) => BaseService.getErrorLog(err));
        } else {
          const model = {
            title: CORE.MESSAGE_CONSTANT.ERROR,
            textContent: CORE.MESSAGE_CONSTANT.INVALID_DOC_FILE,
            multiple: true
          };
          DialogFactory.alertDialog(model);
        }
      },
      badfile: function () {
        const model = {
          title: CORE.MESSAGE_CONSTANT.ERROR,
          textContent: CORE.MESSAGE_CONSTANT.INVALID_DOC_FILE,
          multiple: true
        };
        DialogFactory.alertDialog(model);
      },
      pending: function () {
        // console.log('Pending');
      },
      failed: function () {
        const model = {
          title: CORE.MESSAGE_CONSTANT.ERROR,
          textContent: CORE.MESSAGE_CONSTANT.INVALID_DOC_FILE,
          multiple: true
        };
        DialogFactory.alertDialog(model);
        // console.log(e, e.stack);
      },
      large: function () {
        const model = {
          title: CORE.MESSAGE_CONSTANT.ERROR,
          textContent: CORE.MESSAGE_CONSTANT.BOM_UPLOAD_FAIL_SIZE_TEXT,
          multiple: true
        };
        DialogFactory.alertDialog(model);
      },
      multiplefile: function () {

      }
    };

    // Create model from array
    function generateModel(uploadedMFR, mfrHeaders, excelHeader) {
      const mfrmodel = [];
      // loop through excel data and bind into model
      for (let i = 1, len = uploadedMFR.length; i < len; i++) {
        const item = uploadedMFR[i];
        const modelRow = {};
        uploadedMFR[0].forEach((column, index) => {
          if (column === null) {
            return;
          }
          const obj = mfrHeaders.find((x) => x.column && x.column.toUpperCase() === column.toUpperCase());
          if (!obj) {
            return;
          }
          const field = CORE.MFG_COLUMN_MAPPING.find((x) => x === obj.header);
          if (!modelRow[field]) {
            modelRow[field] = item[index] ? item[index] : null;
          }
        });
        mfrmodel.push(modelRow);
      };
      checkUploadedMFR(mfrmodel, uploadedMFR, mfrHeaders, excelHeader);
    }
    // check format1 && format 2 uploaded details
    function checkUploadedMFR(mfrmodel, data, mfrHeaders, excelHeader) {
      const headers = _.keys(mfrmodel[0]); // get header detail
      if (!_.find(headers, (head) => head === (vm.LabelConstant.MFG.MFGCode))) {
        mfrmodel = _.filter(mfrmodel, (mfr) => mfr[vm.IsManfucaturer ? vm.LabelConstant.MFG.MFRName : vm.LabelConstant.MFG.SupplierName]); // filter only mfr having name
        // Format 2
        mfrmodel = _.uniq(mfrmodel);
        _.each(mfrmodel, (item) => {
          item[vm.IsManfucaturer ? vm.LabelConstant.MFG.MFRName : vm.LabelConstant.MFG.SupplierName] = replaceHiddenSpecialCharacter(item[vm.IsManfucaturer ? vm.LabelConstant.MFG.MFRName : vm.LabelConstant.MFG.SupplierName]);
        });
        const objModel = {
          mfgType: vm.IsManfucaturer ? CORE.MFG_TYPE.MFG : CORE.MFG_TYPE.DIST,
          mfrmodel: mfrmodel
        };
        vm.cgBusyLoading = ManufacturerFactory.importFormatTwoManufacturerDetails().query({
          mfgList: objModel
        }).$promise.then(() => {
          openMFRErrorPopup();
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        // format 1
        // mapped detail against mfr name
        const mappedHeader = _.find(mfrHeaders, (mapp) => mapp.header === (vm.LabelConstant.MFG.MFRName));
        const formatHeder = excelHeader;
        const indexHeaderList = [];
        if (mappedHeader) {
          _.each(formatHeder, (header, index) => {
            if (header === mappedHeader.column || header === (vm.LabelConstant.MFG.MFRName)) {
              indexHeaderList.push(index);
            }
          });
        }
        if (indexHeaderList.length === 0) {
          DialogFactory.alertDialog({
            title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
            textContent: stringFormat(CORE.MESSAGE_CONSTANT.INVALID_MFR_MAPPING, vm.LabelConstant.MFG.MFRName),
            multiple: true
          });
          return;
        }
        const mfgAliasList = data;
        let modelList = [];
        _.each(mfrmodel, (model, index) => {
          if (model[vm.LabelConstant.MFG.MFGCode]) {
            const modelObject = {
              mfgCode: model[vm.LabelConstant.MFG.MFGCode],
              mfgAlias: [],
              mfgType: vm.IsManfucaturer ? CORE.MFG_TYPE.MFG : CORE.MFG_TYPE.DIST
            };
            _.each(mfgAliasList[index + 1], (alias, aliasIndex) => {
              if (alias && ((_.find(indexHeaderList, (aIndex) => aIndex === aliasIndex))) && (!_.find(modelObject.mfgAlias, (mfgAlias) => mfgAlias === alias))) {
                alias = replaceHiddenSpecialCharacter(alias);
                modelObject.mfgAlias.push(alias);
              }
            });
            if (modelObject.mfgAlias.length > 0) {
              modelList.push(modelObject);
            }
          }
        });
        if (modelList.length > 0) {
          modelList = _.uniqWith(modelList, _.isEqual);
          modelList = _.filter(modelList, (item) => item.mfgAlias.length > 0);
          vm.cgBusyLoading = ManufacturerFactory.importFormatOneManufacturerDetails().query({
            mfgImportedDetail: modelList
          }).$promise.then((manufacturer) => {
            if (manufacturer && manufacturer.status === CORE.ApiResponseTypeStatus.FAILED) {
              const exportList = _.filter(manufacturer.data, (fStatus) => fStatus.status === CORE.ApiResponseTypeStatus.FAILED);
              const errorMfrList = [];
              _.each(exportList, (errMFr) => {
                const objErrMFR = {};
                objErrMFR[vm.LabelConstant.MFG.MFGCode] = errMFr.mfgCode;
                _.each(errMFr.mfgAlias, (alias, index) => {
                  objErrMFR[stringFormat('{0}{1}', (vm.LabelConstant.MFG.MFRName), index > 1 ? index - 1 : '')] = alias;
                });
                objErrMFR.Error = errMFr.message;
                errorMfrList.push(objErrMFR);
              });
              vm.cgBusyLoading = ImportExportFactory.importFile(errorMfrList).then((res) => {
                if (res.data && errorMfrList.length > 0) {
                  exportFileDetail(res, 'Manufacturer_error.xls');
                }
              }).catch((error) => BaseService.getErrorLog(error));
            } else {
              vm.loadData();
            }
          });
        }
      }
    }

    vm.exportTemplate = () => {
      const mfgType = vm.IsManfucaturer ? CORE.modulesForExportSampleTemplate.MANUFACTURE : CORE.modulesForExportSampleTemplate.SUPPLIER;
      vm.cgBusyLoading = ManufacturerFactory.exportSampleMFGTemplate({
        mfgType: mfgType
      }).then((response) => {
        if (response.status === 404) {
          DialogFactory.alertDialog({
            title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
            textContent: CORE.MESSAGE_CONSTANT.DownloadFileErrorMsg.NotFound,
            multiple: true
          });
        } else if (response.status === 403) {
          DialogFactory.alertDialog({
            title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
            textContent: CORE.MESSAGE_CONSTANT.DownloadFileErrorMsg.AccessDenied,
            multiple: true
          });
        } else if (response.status === 401) {
          DialogFactory.alertDialog({
            title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
            textContent: CORE.MESSAGE_CONSTANT.DownloadFileErrorMsg.Unauthorized,
            multiple: true
          });
        } else {
          exportFileDetail(response, mfgType + '.xlsx');
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    // export template details
    function exportFileDetail(res, name) {
      const blob = new Blob([res.data], {
        type: 'application/vnd.ms-excel'
      });
      if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(blob, name);
      } else {
        const link = document.createElement('a');
        if (!link.download) {
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

    // open derived manufacturer popup
    function openMFRErrorPopup() {
      const data = {
        type: CORE.MFG_TYPE.MFG,
        isCustOrDisty: false
      };
      DialogFactory.dialogService(
        CORE.MFR_IMPORT_MAPP_ERROR_MODAL_CONTROLLER,
        CORE.MFR_IMPORT_MAPP_ERROR_MODAL_VIEW,
        vm.event,
        data).then(() => { }, () => vm.loadData(), (err) => BaseService.getErrorLog(err));
    }

    // get derived manufacturer list
    function getDerivedManufacturerList() {
      vm.cgBusyLoading = ManufacturerFactory.getVerificationManufacturerList({
        type: CORE.MFG_TYPE.MFG,
        isCustOrDisty: false
      }).query().$promise.then((response) => {
        if (response && response.data) {
          vm.apiVerificationErrorCount = (_.filter(_.uniqBy(response.data, 'importMfg'), (error) => !error.isVerified)).length;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }
    // common function
    function commonFunction(data) {
      if (!data.isContinue) {
        BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
      } else {
        vm.importDetail(vm.event, true);
      }
    }

    vm.UMIDHistory = (row, ev) => {
      row.title = 'Manufacturer History';
      row.TableName = CORE.DATAENTRYCHANGE_AUDITLOG_TABLENAME.MFGCODEMST;
      row.headerData = [{
        label: vm.LabelConstant.MFG.MFGCode,
        value: BaseService.getMfgCodeNameFormat(row.mfgCode, row.mfgName),
        displayOrder: 1,
        valueLinkFn: vm.editManufacturer,
        valueLinkFnParams: row.id,
        labelLinkFn: vm.goToManufacturerList
      }];
      DialogFactory.dialogService(
        CORE.COMMON_HISTORY_POPUP_MODAL_CONTROLLER,
        CORE.COMMON_HISTORY_POPUP_MODAL_VIEW,
        ev,
        row).then(() => { }, () => vm.loadData(), (err) => BaseService.getErrorLog(err));
    };

    vm.goToManufacturerList = () => BaseService.goToManufacturerList();

    function UpdateVerificationManufacturer(data) {
      vm.cgBusyLoading = ManufacturerFactory.UpdateVerificationManufacturer().query({
        manufacturers: data.isAnyVerified
      }).$promise.then(() => commonFunction(data))
        .catch((error) => BaseService.getErrorLog(error));
    }
    // get customer type
    vm.getCustomerType = (type) => {
      const cType = _.find(vm.customerTypeList, (customerType) => customerType.id === type);
      if (cType && cType.id) {
        return cType.value;
      }
      return '';
    };
    /* set curr status of mfg added */
    vm.getMFGTypeCurrStatusClassName = (mfgStatusText) => {
      const type = _.find(CORE.MfgAddedAsCurrStatus, (item) => item.mfgAddedAsText === mfgStatusText);
      return type ? type.className : '';
    };
    /* Refresher List on import data event */
    const refreshUIGridList = $rootScope.$on(USER.RefreshManufactureList, () => {
      if (vm.gridOptions.gridApi) {
        vm.gridOptions.gridApi.grid.clearAllFilters();
      }
      vm.loadData();
    });
    // close popup on page destroy
    $scope.$on('$destroy', () => {
      refreshUIGridList();
      $mdDialog.hide(false, {
        closeAll: true
      });
    });
  }
})();
