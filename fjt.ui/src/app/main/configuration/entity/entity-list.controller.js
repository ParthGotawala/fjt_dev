(function () {
  'use strict';

  angular
    .module('app.configuration.entity')
    .controller('EntityController', EntityController);

  /** @ngInject */
  function EntityController($mdDialog, $timeout, $state, $stateParams,
    CORE, USER, CONFIGURATION, EntityFactory, DialogFactory, BaseService, $rootScope, $scope) {
    const vm = this;
    vm.isUpdatable = true;
    vm.EmptyMesssage = CONFIGURATION.CONFIGURATION_EMPTYSTATE.ENTITY;
    vm.EmptyMesssageForForm = CONFIGURATION.CONFIGURATION_EMPTYSTATE.FORM;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
    vm.customFormsStatus = angular.copy(CORE.CustomFormsStatus);
    vm.EntityStatusGridHeaderDropdown = CORE.EntityStatusGridHeaderDropdown;
    vm.gridConfig = CORE.gridConfig;
    vm.LabelConstant = CORE.LabelConstant;
    vm.KeywordStatusGridHeaderDropdown = CORE.KeywordStatusGridHeaderDropdown;
    // $rootScope.gridOption.CurrentPage = CORE.PAGENAME_CONSTANT.EntityList.PageName;
    vm.systemGeneratedEntity = $stateParams.systemGenerated ? $stateParams.systemGenerated : null;
    let filterCategory = null;

    vm.getEntityStatusClassName = (statusID) => BaseService.getEntityStatusClassName(statusID);

    if (vm.systemGeneratedEntity) {
      vm.isInviteEmployee = vm.systemGeneratedEntity === '1' ? false : true;
      filterCategory = {
        ColumnName: 'systemGenerated',
        SearchString: vm.systemGeneratedEntity
      };
    }

    if (vm.systemGeneratedEntity === '1') {
      vm.gridId = 'gridEntitySystemGenerated';
    } else {
      vm.gridId = 'gridEntityCustom';
    }
    vm.sourceHeader = [{
      field: 'Action',
      cellClass: 'gridCellColor',
      displayName: 'Action',
      width: '100',
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
      field: 'entityName',
      displayName: 'Name',
      width: vm.systemGeneratedEntity === '1' ? 300 : 200,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
    }, {
      field: 'remark',
      displayName: 'Remark',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: 250,
      visible: vm.systemGeneratedEntity !== '1'
    },
    {
      field: 'delete',
      displayName: 'Manage',
      cellTemplate: '<md-button class="md-warn margin-0" ng-click="grid.appScope.$parent.vm.updateRecordEntityDataElement(row)"> \
                                    Manage Fields \
                                </md-button>',
      width: 150,
      enableFiltering: false,
      enableSorting: false
    },
    {
      field: 'updatedAt',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
      type: 'datetime',
      enableFiltering: false,
      visible: CORE.UIGrid.VISIBLE_MODIFIED_AT
    }, {
      field: 'updatedby',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
      type: 'StringEquals',
      enableFiltering: true,
      visible: CORE.UIGrid.VISIBLE_MODIFIED_BY
    }, {
      field: 'updatedbyRole',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
      type: 'StringEquals',
      enableFiltering: true,
      visible: CORE.UIGrid.VISIBLE_MODIFIED_BYROLE
    }, {
      field: 'createdAt',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
      type: 'datetime',
      enableFiltering: false,
      visible: CORE.UIGrid.VISIBLE_CREATED_AT
    },
    {
      field: 'createdby',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
      type: 'StringEquals',
      enableFiltering: true,
      visible: CORE.UIGrid.VISIBLE_CREATED_BY
    }, {
      field: 'createdbyRole',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
      type: 'StringEquals',
      enableFiltering: true,
      visible: CORE.UIGrid.VISIBLE_CREATED_BYROLE
    },
    {
      field: 'SyatemGeneratedValue',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_SYSTEM_GENERATED,
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center"> \
            <span class="label-box" ng-class="{\'label-success\':row.entity.systemGenerated == true, \'label-warning\':row.entity.systemGenerated == false}"> {{ COL_FIELD }} </span></div>',
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        term: null,
        options: vm.KeywordStatusGridHeaderDropdown
      },
      ColumnDataType: 'StringEquals',
      width: 120
    }
    ];

    if (vm.systemGeneratedEntity === '0') {
      const entityStatusTextObj = {
        field: 'entityStatusText',
        displayName: 'Status',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" ng-class="grid.appScope.$parent.vm.getEntityStatusClassName(row.entity.entityStatus)">'
          + '{{COL_FIELD}}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.EntityStatusGridHeaderDropdown
        },
        width: 120
      };
      vm.sourceHeader.splice(5, 0, entityStatusTextObj);
      // vm.sourceHeader.push(entityStatusTextObj);
    }

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['entityName', 'ASC']],
        SearchColumns: [],
        isUserSuperAdmin: vm.loginUser.isUserSuperAdmin ? 1 : 0,
        loginEmployeeID: (vm.systemGeneratedEntity === '1' || vm.loginUser.isUserSuperAdmin) ? null : vm.loginUser.employee.id,
        isSystemGeneratedEntity: vm.systemGeneratedEntity
      };
    };

    initPageInfo();

    vm.gridOptions = {
      enablePaging: isEnablePagination,
      enablePaginationControls: isEnablePagination,
      showColumnFooter: false,
      enableRowHeaderSelection: vm.systemGeneratedEntity ? (vm.systemGeneratedEntity === '0' ? true : false) : false,
      enableFullRowSelection: false,
      enableRowSelection: true,
      multiSelect: true,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: vm.systemGeneratedEntity === '0' ? 'Forms.csv' : 'Data Tracking Entities.csv',
      CurrentPage: CORE.PAGENAME_CONSTANT[4].PageName,
      allowToExportAllData: true,
      exporterAllDataFn: () => {
        const pagingInfoOld = _.clone(vm.pagingInfo);
        pagingInfoOld.pageSize = 0;
        pagingInfoOld.Page = 1;
        vm.gridOptions.isExport = pagingInfoOld.isExport = true;
        return EntityFactory.retriveEntitiesList().query(pagingInfoOld).$promise.then((entity) => {
          if (entity && entity.data && entity.data.entity) {
            return entity.data.entity;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICall = (entity, isGetDataDown) => {
      if (entity && entity.data && entity.data.entity) {
        _.each(entity.data.entity, (item) => {
          if (item.entityStatus === 1) {
            item.isDisabledDelete = true;
            item.isRowSelectable = false;
          } else {
            item.isDisabledDelete = false;
            item.isRowSelectable = true;
          }
        });
        if (!isGetDataDown) {
          vm.sourceData = entity.data.entity;
          vm.currentdata = vm.sourceData.length;
        }
        else if (entity.data.entity.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(entity.data.entity);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }

        // must set after new data comes
        vm.totalSourceDataCount = entity.data.Count;
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
          if (vm.pagingInfo.SearchColumns.length > 1 || !_.isEmpty(vm.SearchMode)) {
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
    };

    /* retrieve entity list*/
    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      if (filterCategory) {
        vm.pagingInfo.SearchColumns.push(filterCategory);
      }
      vm.cgBusyLoading = EntityFactory.retriveEntitiesList().query(vm.pagingInfo).$promise.then((entity) => {
        if (entity && entity.data) {
          setDataAfterGetAPICall(entity, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* to bind data in grid on load */
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = EntityFactory.retriveEntitiesList().query(vm.pagingInfo).$promise.then((entity) => {
        if (entity && entity.data) {
          setDataAfterGetAPICall(entity, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.selectedEntity = () => vm.gridOptions.getSelectedRowsCount ? vm.gridOptions.getSelectedRowsCount() : 0;

    vm.fab = {
      Status: false
    };


    vm.updateRecord = (row, ev) => {
      vm.OpenPopupForManageEntity(row.entity, ev);
    };

    /* update entity data element*/
    vm.updateRecordEntityDataElement = (row, ev) => {
      vm.addEditRecord(row.entity, ev);
    };

    /* delete entity*/
    vm.deleteRecord = (entity) => {
      let selectedIDs = [];
      const entityType = vm.systemGeneratedEntity === '1' ? 'Entity' : 'Form(s)';
      if (entity) {
        selectedIDs.push(entity.entityID);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((entityitem) => entityitem.entityID);
        }
      }

      if (selectedIDs) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, entityType, selectedIDs.length);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        const objIDs = {
          id: selectedIDs,
          systemGenerated: vm.systemGeneratedEntity,
          entityType: entityType,
          CountList: false
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            //const index = vm.gridData.data.indexOf(row.entity);
            EntityFactory.deleteEntity().query({ objIDs: objIDs }).$promise.then((res) => {
              if (res && res.data) {
                /* manually put remove as in vm.loaddata(), we added filterCategory */
                if (vm.pagingInfo) {
                  _.remove(vm.pagingInfo.SearchColumns, (searchItem) => searchItem === filterCategory);
                }
                if (res.data.length > 0 || res.data.transactionDetails) {
                  const data = {
                    TotalCount: res.data.transactionDetails[0].TotalCount,
                    pageName: CORE.PageName.create_forms
                  };
                  BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                    const objIDs = {
                      id: selectedIDs,
                      systemGenerated: vm.systemGeneratedEntity,
                      entityType: entityType,
                      CountList: true
                    };
                    return EntityFactory.deleteEntity().query({ objIDs: objIDs }).$promise.then((res) => {
                      let data = {};
                      data = res.data;
                      data.pageTitle = entity ? entity.entityName : null;
                      data.PageName = CORE.PageName.create_forms;
                      data.selectedIDs = stringFormat('{0}{1}', selectedIDs.length, ' Selected');
                      if (res.data) {
                        DialogFactory.dialogService(
                          USER.ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER,
                          USER.ADMIN_SHOW_TRANSACTION_DETAILS_VIEW,
                          ev,
                          data).then(() => { // Empty Block
                          }, () => { // Empty Block
                          });
                      }
                    }).catch((error) => BaseService.getErrorLog(error));
                  });
                }
                else {
                  BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                  vm.gridOptions.clearSelectedRows();
                }
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => { // Empty Block
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        //show validation message no data selected
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContent.message = stringFormat(messageContent.message, 'entity');
        const alertModel = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(alertModel);
      }
    };


    /* add/edit entity*/
    vm.addEditRecord = (data) => {
      if (data && data.entityID) {
        if (vm.systemGeneratedEntity === '1') {
          $state.go(CONFIGURATION.CONFIGURATION_DATAELEMENT_MANAGE_STATE, { entityID: data.entityID, dataElementID: null });
        }
        else if (vm.systemGeneratedEntity === '0') {
          $state.go(CONFIGURATION.CONFIGURATION_FORMS_DATAELEMENT_MANAGE_STATE, { entityID: data.entityID, dataElementID: null });
        }
      }
      else {
        $state.go(CONFIGURATION.CONFIGURATION_DATAELEMENT_MANAGE_STATE, { entityID: null, dataElementID: null });
      }
    };

    vm.viewDetails = (data) => {
      if (data && data.entity.entityID) {
        $state.go(CONFIGURATION.CONFIGURATION_DATAELEMENT_VIEW_STATE, { id: data.entity.entityID });
      }
    };

    /* delete multiple data called from directive of ui-grid*/
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };

    /* open popup for add-edit entity */
    vm.OpenPopupForManageEntity = (data, ev) => {
      DialogFactory.dialogService(
        CONFIGURATION.MANAGE_ENTITY_MODAL_CONTROLLER,
        CONFIGURATION.MANAGE_ENTITY_MODAL_VIEW,
        ev,
        data).then(() => {
          if (!vm.gridOptions.enablePaging) {
            // initPageInfo();
            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
          }
          vm.loadData();
        }, (err) => BaseService.getErrorLog(err));
    };

    /* open popup to add employee for view widget */
    vm.inviteEmployee = (entityModel, ev) => {
      const data = {
        entityID: entityModel.entityID,
        entityName: entityModel.entityName,
        createdBy: entityModel.createdBy,
        entityStatus: entityModel.entityStatusText
      };
      DialogFactory.dialogService(
        CONFIGURATION.ENTITY_EMPLOYEE_MODAL_CONTROLLER,
        CONFIGURATION.ENTITY_EMPLOYEE_MODAL_VIEW,
        ev,
        data).then(() => { // Empty Block
        }, () => { // Empty Block
        },
          () => { // Empty Block
          });
    };

    //close popup on page destroy
    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, { closeAll: true });
    });
    /*Refresh the page*/
    vm.refresh = () => {
      vm.pagingInfo.SearchColumns = [];
      vm.loadData();
    };
  }
})();
