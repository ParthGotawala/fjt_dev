(function () {
  'use strict';

  angular
    .module('app.configuration.chartrawdatacategory')
    .controller('ChartRawdataCategoryController', ChartRawdataCategoryController);

  /** @ngInject */
  function ChartRawdataCategoryController($mdDialog, $scope, $timeout, CORE, CONFIGURATION, RawdataCategoryFactory, DialogFactory, BaseService) {
    const vm = this;
    vm.isUpdatable = true;
    vm.EmptyMesssage = CONFIGURATION.CONFIGURATION_EMPTYSTATE.CHARTRAWDATACATEGORY;

    vm.sourceHeader = [
      {
        field: 'Action',
        cellClass: 'gridCellColor',
        displayName: 'Action',
        width: '80',
        cellTemplate: `<grid-action-view grid="grid" row="row"></grid-action-view>`,
        enableFiltering: false,
        enableSorting: false,
        exporterSuppressExport: true,
        pinnedLeft: true
      },
      {
        field: '#',
        width: '60',
        cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
        enableFiltering: false,
        enableSorting: false
      },
      {
        field: 'name',
        displayName: 'Name',
        width: '300',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
      }
      //, {
      //	field: 'dbViewName',
      //	displayName: 'DB View Name',
      //	width: '300',
      //	cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      //},
    ];

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        //ItemsPerPage: CORE.UIGrid.ItemsPerPage(),
        SortColumns: [['name', 'ASC']],
        SearchColumns: [],
        roleId: null
      };
    };

    initPageInfo();

    vm.gridOptions = {
      showColumnFooter: false,
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: false,
      multiSelect: false,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: 'Report/Widget_Data_Source.csv'
    };

    vm.loadData = () => {
      vm.cgBusyLoading = RawdataCategoryFactory.rawdatacategorylist(vm.pagingInfo).query().$promise.then((rawdatacategory) => {
        vm.sourceData = rawdatacategory.data.Chart_Rawdata_Category;
        vm.totalSourceDataCount = rawdatacategory.data.Count;

        _.each(vm.sourceData, (item) => {
          item.isDisabledDelete = true;
          if (item.isSystemGenerated) {
            item.isDisabledUpdate = true;
          }
        });

        if (!vm.gridOptions.enablePaging) {
          vm.currentdata = vm.sourceData.length;
          vm.gridOptions.gridApi.infiniteScroll.resetScroll();
        }
        vm.gridOptions.clearSelectedRows();
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
          vm.resetSourceGrid();
          if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
          }
        });
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = RawdataCategoryFactory.rawdatacategorylist(vm.pagingInfo).query().$promise.then((rawdatacategory) => {
        vm.sourceData = vm.sourceData.concat(rawdatacategory.data.Chart_Rawdata_Category);
        vm.currentdata = vm.sourceData.length;
        _.each(vm.sourceData, (item) => {
          item.isDisabledDelete = true;
          if (item.isSystemGenerated) {
            item.isDisabledUpdate = true;
          }
        });
        vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
        $timeout(() => {
          vm.resetSourceGrid();
          return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount !== vm.currentdata ? true : false);
        });
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.updateRecord = (row, ev) => {
      vm.OpenPopupForManageRawdatacategory(row.entity, ev);
    };

    /* open popup for add-edit Rawdatacategory */
    vm.OpenPopupForManageRawdatacategory = (data, ev) => {
      DialogFactory.dialogService(
        CONFIGURATION.MANAGE_RAWDATACATEGORY_MODAL_CONTROLLER,
        CONFIGURATION.MANAGE_RAWDATACATEGORY_MODAL_VIEW,
        ev,
        data).then(() => {
          BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.selectedRawdatacategory = () => vm.gridOptions.getSelectedRowsCount ? vm.gridOptions.getSelectedRowsCount() : 0;

    /* delete rawdatacategory*/
    vm.deleteRecord = (rawdatacategory) => {
      let selectedIDs = [];
      if (rawdatacategory) {
        selectedIDs.push(rawdatacategory.chartRawDataCatID);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((rawdatacategoryitem) => rawdatacategoryitem.chartRawDataCatID);
        }
      }

      if (selectedIDs) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Report/Widget Data Source', selectedIDs.length);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        const objIDs = {
          id: selectedIDs
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            //const index = vm.gridData.data.indexOf(row.entity);
            RawdataCategoryFactory.deleterawdatacategory().query({ objIDs: objIDs }).$promise.then((res) => {
              if (res && res.data) {
                /* manually put remove as in vm.loaddata(), we added filterCategory */
                if (vm.pagingInfo) {
                  _.remove(vm.pagingInfo.SearchColumns, (searchItem) => searchItem === filterCategory);
                }
                if (res.data.TotalCount && res.data.TotalCount > 0) {
                  BaseService.deleteAlertMessage(res.data);
                } else {
                  BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                  vm.gridOptions.clearSelectedRows();
                }
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, (error) => BaseService.getErrorLog(error));
      }
      else {
        //show validation message no data selected
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContent.message = stringFormat(messageContent.messagem, 'Report/Widget Data Source');
        const alertModel = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(alertModel);
      }
    };
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };
    //close popup on page destroy
    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, { closeAll: true });
    });
  }
})();
