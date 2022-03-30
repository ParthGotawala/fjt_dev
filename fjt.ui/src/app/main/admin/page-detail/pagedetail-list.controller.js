(function () {
  'use strict';

  angular.module('app.admin.page')
    .controller('PageDetailController', PageDetailController);

  /** @ngInject */
  function PageDetailController($state, $scope, $timeout, $mdDialog, USER, CORE, PageDetailFactory, DialogFactory, GenericCategoryFactory, BaseService) {
    var vm = this;
    vm.isUpdatable = true;
    vm.viewAssignFeature = true;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.PAGE_DETAIL;
    vm.gridConfig = CORE.gridConfig;
    vm.LabelConstant = CORE.LabelConstant;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;

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
      field: 'iconClass',
      width: '100',
      displayName: 'Icon',
      cellTemplate: '<div class="ui-grid-cell-contents text-left"><md-icon role="img" md-font-icon="{{COL_FIELD}}" class="material-icons mat-icon"></md-icon></div>'
    }, {
      field: 'pageName',
      width: '250',
      displayName: 'Name',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
    }, {
      field: 'pageRoute',
      width: '250',
      displayName: 'Page Route',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
    }, {
      field: 'pageURL',
      width: '250',
      displayName: 'URL',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
    }, {
      field: 'menuName',
      displayName: 'Menu Name',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      enableFiltering: true,
      width: '250'
    }, {
      field: 'parentPageRoute',
      displayName: 'Parent Page Route',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
    }, {
      field: 'pageNameOfParentPage',
      displayName: 'Parent Page',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{row.entity.pageNameOfParentPage}}</div>',
      enableFiltering: true,
      enableSorting: true
    }, {
      field: 'orderBy',
      displayName: 'Order By',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '70'
    }, {
      field: 'tabLevel',
      displayName: 'Tab Level',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '70'
    }, {
      field: 'ROConvertedValue',
      displayName: 'RO',
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
        + '<span  class="label-box" \
                            ng-class="{\'label-success\':row.entity.RO == true, \
                            \'label-warning\':row.entity.RO == false}"> \
                                {{ COL_FIELD }}'
        + '</span>'
        + '</div>',
      enableFiltering: false,
      width: '100'
    }, {
      field: 'RWConvertedValue',
      displayName: 'RW',
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
        + '<span  class="label-box" \
                            ng-class="{\'label-success\':row.entity.RW == true, \
                            \'label-warning\':row.entity.RW == false}"> \
                                {{ COL_FIELD }}'
        + '</span>'
        + '</div>',
      enableFiltering: false,
      width: '100'
    }, {
      field: 'hasChildConvertedValue',
      displayName: 'Has Child',
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
        + '<span  class="label-box" \
                            ng-class="{\'label-success\':row.entity.hasChild == true, \
                            \'label-warning\':row.entity.hasChild == false}"> \
                                {{ COL_FIELD }}'
        + '</span>'
        + '</div>',
      enableFiltering: false,
      width: '100'
    }, {
      field: 'isActiveConvertedValue',
      displayName: 'Is Active',
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
        + '<span  class="label-box" \
                            ng-class="{\'label-success\':row.entity.isActive == true, \
                            \'label-warning\':row.entity.isActive == false}"> \
                                {{ COL_FIELD }}'
        + '</span>'
        + '</div>',
      enableFiltering: false,
      width: '110'
    }, {
      field: 'updatedAtvalue',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
      type: 'datetime',
      enableFiltering: false
    }, {
      field: 'updatedbyvalue',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
      type: 'StringEquals',
      enableFiltering: true
    }, {
      field: 'updatedbyRolevalue',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
      type: 'StringEquals',
      enableFiltering: true
    }, {
      field: 'createdAtvalue',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
      type: 'datetime',
      enableFiltering: false
    },
    {
      field: 'createdbyvalue',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
      type: 'StringEquals',
      enableFiltering: true
    }, {
      field: 'createdbyRolevalue',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
      type: 'StringEquals',
      enableFiltering: true
    }];
    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['pageName', 'ASC']],
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
      exporterCsvFilename: 'Page Detail.csv'
    };

    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICall = (pages, isGetDataDown) => {
      if (pages && pages.data && pages.data.PageDetails) {
        if (!isGetDataDown) {
          vm.sourceData = pages.data.PageDetails;
          vm.currentdata = vm.sourceData.length;
        }
        else if (pages.data.PageDetails.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(pages.data.PageDetails);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        _.each(vm.sourceData, (item) => {
          item.isDisabledAssignFeature = item.parentPageID > 0 ? false : true;
        });

        // must set after new data comes
        vm.totalSourceDataCount = pages.data.Count;
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
        });
      }
    };

    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = PageDetailFactory.retrievePageDetailList().query(vm.pagingInfo).$promise.then((pages) => {
        if (pages && pages.data) {
          setDataAfterGetAPICall(pages, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));;
    };

    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = PageDetailFactory.retrievePageDetailList().query(vm.pagingInfo).$promise.then((pages) => {
        if (pages && pages.data) {
          setDataAfterGetAPICall(pages, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));;
    };

    vm.selectedStandardMessage = () => vm.gridOptions.getSelectedRowsCount ? vm.gridOptions.getSelectedRowsCount() : 0;

    vm.fab = {
      Status: false
    };

    /* delete standard*/
    vm.deleteRecord = (row) => {
      let selectedIDs = [];
      if (row) {
        selectedIDs.push(row.pageID);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((item) => item.pageID);
        }
      }
      if (selectedIDs) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Pages(s)', selectedIDs.length);
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
            vm.cgBusyLoading = PageDetailFactory.deletePageDetail().query({ objIDs: objIDs }).$promise.then((res) => {
              if (res) {
                if (res.data && res.data.TotalCount && res.data.TotalCount > 0) {
                  BaseService.deleteAlertMessage(res.data);
                } else {
                  BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                  vm.gridOptions.clearSelectedRows();
                }
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        //show validation message no data selected
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContent.message = stringFormat(messageContent.message, 'page');
        const alertModel = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(alertModel);
      }
    };

    /* Update Standard Message*/
    vm.updateRecord = (row) => {
      $state.go(USER.ADMIN_MANAGEPAGE_STATE, { pageID: row.entity.pageID });
    };

    /* Add Page*/
    vm.addPage = () => {
      $state.go(USER.ADMIN_MANAGEPAGE_STATE, { pageID: null });
    };

    /* delete multiple data called from directive of ui-grid*/
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };

    vm.AssignFeature = (item, $event) => {
      var model = {
        title: USER.ASSIGN_FEATURE,
        data: item
      };
      DialogFactory.dialogService(
        USER.ADMIN_ASSIGN_FEATURES_MODAL_CONTROLLER,
        USER.ADMIN_ASSIGN_FEATURES_MODAL_VIEW,
        $event,
        model).then((response) => {
          item.features = response;
        }, (error) => BaseService.getErrorLog(error));
    };

    //close popup on page destroy
    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, { closeAll: true });
    });
  };
})();
