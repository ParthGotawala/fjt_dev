(function () {
  'use strict';
  angular
    .module('app.core')
    .controller('ComponentTemperatureSensitiveDataListController', ComponentTemperatureSensitiveDataListController);

  /** @ngInject */
  function ComponentTemperatureSensitiveDataListController(data, $scope, $mdDialog, $timeout, BaseService, CORE, DialogFactory, USER, ComponentFactory) {
    const vm = this;
    vm.isUpdatable = true;
    vm.parentVM = data.parentVM;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.COMPONENT_TEMPERATURE;
    vm.componentID = (data && data.componentID) ? data.componentID : null;
    vm.DefaultDateTimeFormat = _dateTimeDisplayFormat;
    vm.isNoDataFound = true;
    vm.LabelConstant = CORE.LabelConstant;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;

    vm.sourceHeader = [
      {
        field: 'Action',
        cellClass: 'layout-align-center-center',
        displayName: 'Action',
        width: 80,
        cellTemplate: '<grid-action-view grid="grid" row="row"></grid-action-view>',
        enableFiltering: false,
        enableSorting: false,
        exporterSuppressExport: true,
        pinnedLeft: true,
        enableCellEdit: false
      },
      {
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
        enableFiltering: false,
        enableSorting: false,
        allowCellFocus: false,
        enableCellEdit: false
      },
      {
        field: 'pickTemperatureAbove',
        displayName: 'Temperature Above Liquidus (°C)',
        width: 230,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        type: 'number',
        enableCellEdit: false
      },
      {
        field: 'timeLiquidusSecond',
        displayName: 'Time Above Liquidus (second)',
        width: 180,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        type: 'number',
        enableCellEdit: false
      },
      {
        field: 'updatedAt',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
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
      }
      , {
        field: 'createdbyRole',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }
    ];

    // init pagination details
    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['id', 'DESC']],
        SearchColumns: [],
        pageName: CORE.PAGENAME_CONSTANT[9].PageName
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
      multiSelect: false,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: 'Temperature Sensitive Data.csv',
      enableCellEdit: true
    };

    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICall = (temperatureSensitiveData, isGetDataDown) => {
      if (temperatureSensitiveData && temperatureSensitiveData.data && temperatureSensitiveData.data.temperatureSensitiveData) {
        if (!isGetDataDown) {
          vm.sourceData = temperatureSensitiveData.data.temperatureSensitiveData;
          vm.currentdata = vm.sourceData.length;
        }
        else if (temperatureSensitiveData.data.temperatureSensitiveData.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(temperatureSensitiveData.data.temperatureSensitiveData);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        const componentObj = _.find(vm.sourceData, (x) => x.id === 0);
        if (componentObj) {
          componentObj.isDisabledUpdate = componentObj.isDisabledDelete = true;
          componentObj.isRowSelectable = false;
        }

        // must set after new data comes
        vm.totalSourceDataCount = temperatureSensitiveData.data.Count;
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
            if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
            }
          }
          else {
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount !== vm.currentdata ? true : false);
          }
        }, 500);
      }
    };
    /*get list of Component Temperature Sensitive Data*/
    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      if (vm.pagingInfo.SortColumns.length === 0) {
        vm.pagingInfo.SortColumns = [['id', 'DESC']];
      }
      vm.pagingInfo.componentID = vm.componentID ? vm.componentID : null;
      vm.cgBusyLoading = ComponentFactory.getComponentTemperatureSensitiveDataList().query(vm.pagingInfo).$promise.then((temperatureSensitiveData) => {
        if (temperatureSensitiveData && temperatureSensitiveData.data) {
          setDataAfterGetAPICall(temperatureSensitiveData, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    vm.loadData();

    /* load more data on mouse scroll */
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = ComponentFactory.getComponentTemperatureSensitiveDataList().query(vm.pagingInfo).$promise.then((temperatureSensitiveData) => {
        if (temperatureSensitiveData && temperatureSensitiveData.data) {
          setDataAfterGetAPICall(temperatureSensitiveData, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    /* delete Component Temperature Sensitive Data*/
    vm.deleteRecord = (data) => {
      if (data && data.id) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Temperature sensitive data', 1);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };

        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            const _dummyEvent = null;
            return DialogFactory.dialogService(
              CORE.MANAGE_PASSWORD_POPUP_CONTROLLER,
              CORE.MANAGE_PASSWORD_POPUP_VIEW,
              _dummyEvent, {
              isValidate: true
            }).then((response) => {
              if (response) {
                vm.cgBusyLoading = ComponentFactory.deleteComponentTemperatureSensitiveData().query({
                  id: data.id,
                  refComponentID: data.refComponentID
                }).$promise.then((res) => {
                  if (res && res.data) {
                    BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                    vm.gridOptions.clearSelectedRows();
                  }
                }).catch((error) => BaseService.getErrorLog(error));
              }
            }, () => {
              // Empty
            });
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        //show validation message no data selected
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContent.message = stringFormat(messageContent.message, 'temperature sensitive');
        const alertModel = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(alertModel);
      }
    };

    vm.close = () => {
      $mdDialog.cancel({ isTemperatureSensitive: (vm.sourceData && vm.sourceData.length > 0) });
    };

    vm.updateRecord = (row, ev) => {
      var data = {
        id: row ? row.entity.id : null,
        refComponentID: vm.componentID
      };
      DialogFactory.dialogService(
        USER.ADMIN_ADD_COMPONENT_TEMPERATURE_SENSITIVE_DATA_CONTROLLER,
        USER.ADMIN_ADD_COMPONENT_TEMPERATURE_SENSITIVE_DATA_VIEW,
        ev,
        data).then((data) => {
          if (data) {
            vm.loadData();
            if (vm.parentVM && vm.parentVM.wizardStep1ComponentInfo.$dirty && vm.parentVM.wizardStep1ComponentInfo.$valid) {
              vm.parentVM.saveComponent();
            }
          }
        }, () => {
          //vm.loadData();
        });
    };

    $scope.$on('AddNew', () => {
      vm.updateRecord();
    });
  }
})();
