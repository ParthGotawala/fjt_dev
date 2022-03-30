(function () {
  'use strict';

  angular
    .module('app.admin.dynamicmessage')
    .controller('DynamicMessageController', DynamicMessageController);

  /** @ngInject */
  function DynamicMessageController(CORE, USER, $mdDialog, $state, $timeout, DynamicMessageFactory, $scope, DialogFactory, BaseService) {

    const vm = this;
    vm.emptyDataTable = CORE.EMPTYSTATE.EMPTY_SEARCH;
    vm.selectedItems = [];
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.DYNAMIC_MESSAGE;
    vm.isShowFilter = false;
    vm.isShowFilterForEmpTimeline = false;
    let allSourceData = [];
    let empTimelineAllMessageCopy = [];
    vm.isMessagesAvailable = false;
    vm.isMessagesAvailableForEmpTimeline = false;
    vm.isSearchingUIMsg = false;
    vm.isSearchingTimelineMsg = false;
    vm.debounceConstant = CORE.Debounce;
    vm.exportFileNameForUIMessages = "UI Messages";
    vm.exportFileNameForTimelineMessages = "Timeline Messages";
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;

    /*START Declaration for configuration messages */
    /*****************************************************/
    vm.dynamicmessageSourceData = []; // For full list from API
    vm.emptyState = null;
    vm.isViewDynamicMessageHistory = true;
    vm.isNoDataFound = true;

    let initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['messageCode', 'asc']],
        SearchColumns: []
      };
    }
    initPageInfo();

    vm.isHideDelete = true;  //to hide global delete column of UI-grid
    vm.isUpdatable = true;

    vm.gridOptions = {
      enablePaging: isEnablePagination,
      enablePaginationControls: isEnablePagination,
      showColumnFooter: false,
      enableCellEditOnFocus: false,
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: false,
      multiSelect: false,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: 'dynamicmessage.csv',
    };
    /*END Declaration for configuration messages */



    //if set pagination from controller set true to here
    //vm.ispagination = true;
    vm.limitOptions = [25, 50, 75, 100];
    vm.query = {
      order: '',
      search: {
        key: '',
        value: '',
        moduleName: ''
      },
      limit: 100,
      page: 1,
      isPagination: vm.ispagination == undefined ? CORE.isPagination : vm.ispagination,
    };

    /* retrieve dynamic message list*/
    vm.loadData = () => {
      vm.cgBusyLoading = DynamicMessageFactory.dynamicmessage().query().$promise.then((dynamicmessage) => {
        if (dynamicmessage.data && dynamicmessage.data.dynamicMessageList) {
          allSourceData = dynamicmessage.data.dynamicMessageList;
          vm.isMessagesAvailable = allSourceData.length > 0 ? true : false;
          _.each(allSourceData, function (item, $index) {
            item.index = $index + 1;
          });
          vm.sourceData = angular.copy(allSourceData);
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }


    /* update message */
    vm.updateRecordUIMessages = (data, ev) => {
      DialogFactory.dialogService(
        USER.ADMIN_MANAGE_DYNAMICMESSAGE_MODAL_CONTROLLER,
        USER.ADMIN_MANAGE_DYNAMICMESSAGE_MODAL_VIEW,
        ev,
        data).then((dynamicMessageList) => {
          vm.clearFilter();
          vm.loadData();
          let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.DYNAMIC_MESSAGE_UPDATION_ALERT);
          let modelObj = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(modelObj);
        }, (err) => {
          return BaseService.getErrorLog(err);
        });
    };

    vm.clearFilter = () => {
      vm.query.search.key = '',
        vm.query.search.value = '',
        vm.query.search.moduleName = '',
        vm.isShowFilter = false;
      vm.isSearchingUIMsg = false;
      vm.sourceData = angular.copy(allSourceData);
    }

    vm.searchData = (searchItem, field) => {
      let searchTxt = searchItem ? searchItem.toLowerCase() : '';
      if (!searchTxt) {
        vm.query.search[field] = '';
      }
      if (vm.query.search.key || vm.query.search.value || vm.query.search.moduleName) {
        vm.isSearchingUIMsg = true;
        vm.sourceData = [];
        switch (field) {
          case "key":
            vm.sourceData = _.filter(angular.copy(allSourceData), (dataItem) => {
              return dataItem.key.toLowerCase().indexOf(searchTxt) != -1
                && dataItem.value.toLowerCase().indexOf(vm.query.search.value.toLowerCase()) != -1
                && dataItem.moduleName.toLowerCase().indexOf(vm.query.search.moduleName.toLowerCase()) != -1
            });
            break;
          case "value":
            vm.sourceData = _.filter(angular.copy(allSourceData), (dataItem) => {
              return dataItem.value.toLowerCase().indexOf(searchTxt) != -1
                && dataItem.key.toLowerCase().indexOf(vm.query.search.key.toLowerCase()) != -1
                && dataItem.moduleName.toLowerCase().indexOf(vm.query.search.moduleName.toLowerCase()) != -1;
            });
            break;
          case "moduleName":
            vm.sourceData = _.filter(angular.copy(allSourceData), (dataItem) => {
              return dataItem.moduleName.toLowerCase().indexOf(searchTxt) != -1
                && dataItem.key.toLowerCase().indexOf(vm.query.search.key.toLowerCase()) != -1
                && dataItem.value.toLowerCase().indexOf(vm.query.search.value.toLowerCase()) != -1;
            });
            break;
          default:
            vm.sourceData = angular.copy(allSourceData);
            break;
        }
        _.each(vm.sourceData, function (item, $index) {
          item.index = $index + 1;
        });
      }
      else {
        vm.isSearchingUIMsg = false;
        vm.sourceData = angular.copy(allSourceData);
      }
    }

    //close popup on page destroy 
    $scope.$on('$destroy', function () {
      $mdDialog.hide('', { closeAll: true });
    });

    vm.onTabChanges = (msWizard) => {
      vm.selectedTabIndex = msWizard.selectedIndex;
      vm.clearFilter();
      vm.clearFilterForEmpTimeline();

      if (vm.selectedTabIndex == 0) {
        vm.loadData();
      } else if (vm.selectedTabIndex == 1) {
        vm.loadTimelineDynamicMessages();
      } else if (vm.selectedTabIndex == 2) {
        //load mongodb data
        vm.loadDynamicMessages();
      }
    }

    /* ******************************* Time line messages section ************************** */
    vm.queryForEmpTimeline = {
      order: '',
      search: {
        key: '',
        title: '',
        description: '',
        primarykey: ''
      },
      limit: 100,
      page: 1,
      isPagination: vm.ispagination == undefined ? CORE.isPagination : vm.ispagination,
    };

    vm.clearFilterForEmpTimeline = () => {
      vm.queryForEmpTimeline.search.key = '',
        vm.queryForEmpTimeline.search.title = '',
        vm.queryForEmpTimeline.search.description = '',
        vm.queryForEmpTimeline.search.primarykey = '',
        vm.isShowFilterForEmpTimeline = false;
      vm.isSearchingTimelineMsg = false;
      vm.empTimelineAllMessageList = angular.copy(empTimelineAllMessageCopy);
    }

    vm.loadTimelineDynamicMessages = () => {
      vm.cgBusyLoading = DynamicMessageFactory.timelinedynamicmessages().query().$promise.then((dynamicmessage) => {
        if (dynamicmessage.data && dynamicmessage.data.empTimelineDynamicMessageList.length > 0) {
          empTimelineAllMessageCopy = dynamicmessage.data.empTimelineDynamicMessageList;
          vm.isMessagesAvailableForEmpTimeline = empTimelineAllMessageCopy.length > 0 ? true : false;
          _.each(empTimelineAllMessageCopy, function (item, $index) {
            item.index = $index + 1;
          });
          vm.empTimelineAllMessageList = angular.copy(empTimelineAllMessageCopy);
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    vm.searchDataForEmpTimeline = (searchItem, field) => {
      let searchTxt = searchItem ? searchItem.toLowerCase() : '';
      if (!searchTxt) {
        vm.queryForEmpTimeline.search[field] = '';
      }
      if (vm.queryForEmpTimeline.search.key || vm.queryForEmpTimeline.search.title
        || vm.queryForEmpTimeline.search.description || vm.queryForEmpTimeline.search.primarykey) {
        vm.isSearchingTimelineMsg = true;
        vm.empTimelineAllMessageList = [];
        switch (field) {
          case "key":
            vm.empTimelineAllMessageList = _.filter(angular.copy(empTimelineAllMessageCopy), (dataItem) => {
              return dataItem.key.toLowerCase().indexOf(searchTxt) != -1
                && dataItem.title.toLowerCase().indexOf(vm.queryForEmpTimeline.search.title.toLowerCase()) != -1
                && dataItem.description.toLowerCase().indexOf(vm.queryForEmpTimeline.search.description.toLowerCase()) != -1
                && dataItem.primarykey.toLowerCase().indexOf(vm.queryForEmpTimeline.search.primarykey.toLowerCase()) != -1
            });
            break;
          case "title":
            vm.empTimelineAllMessageList = _.filter(angular.copy(empTimelineAllMessageCopy), (dataItem) => {
              return dataItem.title.toLowerCase().indexOf(searchTxt) != -1
                && dataItem.key.toLowerCase().indexOf(vm.queryForEmpTimeline.search.key.toLowerCase()) != -1
                && dataItem.description.toLowerCase().indexOf(vm.queryForEmpTimeline.search.description.toLowerCase()) != -1
                && dataItem.primarykey.toLowerCase().indexOf(vm.queryForEmpTimeline.search.primarykey.toLowerCase()) != -1;
            });
            break;
          case "description":
            vm.empTimelineAllMessageList = _.filter(angular.copy(empTimelineAllMessageCopy), (dataItem) => {
              return dataItem.description.toLowerCase().indexOf(searchTxt) != -1
                && dataItem.key.toLowerCase().indexOf(vm.queryForEmpTimeline.search.key.toLowerCase()) != -1
                && dataItem.title.toLowerCase().indexOf(vm.queryForEmpTimeline.search.title.toLowerCase()) != -1
                && dataItem.primarykey.toLowerCase().indexOf(vm.queryForEmpTimeline.search.primarykey.toLowerCase()) != -1;
            });
            break;
          case "primarykey":
            vm.empTimelineAllMessageList = _.filter(angular.copy(empTimelineAllMessageCopy), (dataItem) => {
              return dataItem.primarykey.toLowerCase().indexOf(searchTxt) != -1
                && dataItem.key.toLowerCase().indexOf(vm.queryForEmpTimeline.search.key.toLowerCase()) != -1
                && dataItem.title.toLowerCase().indexOf(vm.queryForEmpTimeline.search.title.toLowerCase()) != -1
                && dataItem.description.toLowerCase().indexOf(vm.queryForEmpTimeline.search.description.toLowerCase()) != -1;
            });
            break;
          default:
            vm.empTimelineAllMessageList = angular.copy(empTimelineAllMessageCopy);
            break;
        }
        _.each(vm.empTimelineAllMessageList, function (item, $index) {
          item.index = $index + 1;
        });
      }
      else {
        vm.isSearchingTimelineMsg = false;
        vm.empTimelineAllMessageList = angular.copy(empTimelineAllMessageCopy);
      }
    }

    vm.updateRecordOfEmpTimeline = (data, ev) => {

      DialogFactory.dialogService(
        USER.ADMIN_MANAGE_TIMELINE_MESSAGE_MODAL_CONTROLLER,
        USER.ADMIN_MANAGE_TIMELINE_MESSAGE_MODAL_VIEW,
        ev,
        data).then((dynamicMessageList) => {
          vm.clearFilterForEmpTimeline();
          vm.loadTimelineDynamicMessages();
          let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.DYNAMIC_MESSAGE_UPDATION_ALERT);
          let modelObj = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(modelObj);
        }, (err) => {
          return BaseService.getErrorLog(err);
        });
    }

    /************ FOR DynamicMessage from MONGODB*********************** */
    vm.messageTypeListDropDown = angular.copy(CORE.DYNAMIC_MESSAGE_TYPE_DROPDOWN);
    vm.messageCategoryListDropDown = angular.copy(CORE.DYNAMIC_MESSAGE_CATEGORY_DROPDOWN);
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.DefaultDateTimeFormat = _dateTimeDisplayFormat;
    vm.gridConfig = CORE.gridConfig;
    vm.sourceHeader = [
      {
        field: 'Action',
        displayName: 'Action',
        width: '100',
        cellTemplate: `<grid-action-view grid="grid" row="row"></grid-action-view>`,
        enableFiltering: false,
        enableSorting: false,
        exporterSuppressExport: true,
        pinnedLeft: true,
        enableCellEdit: false,
      },
      {
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
        enableSorting: false,
        enableFiltering: false
      },
      {
        field: 'messageCode',
        width: '100',
        displayName: 'Message Code',
        cellTemplate: '<div class="ui-grid-cell-contents  text-left"> {{COL_FIELD}}</div>',
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'messageType',
        width: '160',
        displayName: 'Message Type',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">' +
          '<span class="label-box" ng-class="{\'label-danger\':row.entity.messageType==\'Error\',\'label-warning\':row.entity.messageType==\'Warning\',' +
          '\'label-success\':row.entity.messageType==\'Success\',\'label-primary\':row.entity.messageType==\'Confirmation\',' +
          '\'label-info\':row.entity.messageType==\'Information\'}">{{COL_FIELD | uppercase }}</span></div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.messageTypeListDropDown
        },
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'category',
        width: '140',
        displayName: 'Category',
        cellTemplate: '<div class="ui-grid-cell-contents text-left"> {{COL_FIELD}}</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.messageCategoryListDropDown
        },
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'message',
        width: '1000',
        displayName: 'Message',
        cellTemplate: '<div class="ui-grid-cell-contents text-left"> {{COL_FIELD}}</div>',
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'versionNumber',
        width: '80',
        displayName: 'Last Version',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right"> {{COL_FIELD}}</div>',
        ColumnDataType: 'Number',
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'createdDate',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left"> {{COL_FIELD |date:grid.appScope.$parent.vm.DefaultDateTimeFormat}}</div>',
        type: 'datetime',
        enableFiltering: false,
        enableSorting: true
      },
      {
        field: 'createdByName',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left"> {{COL_FIELD}}</div>',
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'modifiedDate',
        width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left"> {{COL_FIELD |date:grid.appScope.$parent.vm.DefaultDateTimeFormat}}</div>',
        type: 'datetime',
        enableFiltering: false,
        enableSorting: true
      },
      {
        field: 'modifiedByName',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left"> {{COL_FIELD}}</div>',
        enableFiltering: true,
        enableSorting: true
      },

    ];

    vm.loadDynamicMessages = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = DynamicMessageFactory.getDynamicMessageListDB(vm.pagingInfo).query().$promise.then((result) => {
        if (result.data && result.data.dynamicMessageList) {
          vm.dynamicmessageSourceData = result.data.dynamicMessageList;
          vm.totalDataCount = result.data.dynamicMessageCount;
          vm.isNoDataFound = vm.totalDataCount === 0 ? true : false;

          if (!vm.gridOptions.enablePaging) {
            vm.currentdata = vm.dynamicmessageSourceData.length;
            vm.gridOptions.gridApi.infiniteScroll.resetScroll();
          }
          vm.gridOptions.clearSelectedRows();
          if (vm.totalDataCount == 0) {
            if (vm.pagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
              vm.isNoDataFound = false;
              vm.emptyState = 0;
            } else {
              vm.isNoDataFound = true;
              vm.emptyState = null;
            }
          } else if (vm.totalDataCount > 0) {
            vm.isNoDataFound = false;
            vm.emptyState = null;
          }

          $timeout(() => {
            vm.resetSourceGrid();
            if (!vm.gridOptions.enablePaging && vm.totalDataCount == vm.currentdata) {
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
            }

          });

        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    } //end of loadDynamicMessages()

    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = DynamicMessageFactory.getDynamicMessageListDB(vm.pagingInfo).query().$promise.then((result) => {

        vm.dynamicmessageSourceData = vm.dynamicmessageSourceData.concat(result.data.dynamicMessageList);
        vm.currentdata = vm.dynamicmessageSourceData.length;

        vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
        $timeout(() => {
          vm.resetSourceGrid();
          return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalDataCount != vm.currentdata ? true : false);
        });
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };//end of getDataDown()

    /* update message cofiguration*/
    vm.updateRecord = (row, ev) => {
      if (vm.selectedTabIndex === 2) {
        DialogFactory.dialogService(
          USER.ADMIN_MANAGE_DYNAMICMESSAGE_DB_POPUP_CONTROLLER,
          USER.ADMIN_MANAGE_DYNAMICMESSAGE_DB_POPUP_VIEW,
          ev,
          row.entity).then(() => {
            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadDynamicMessages);
          }, (err) => {
            return BaseService.getErrorLog(err);
          });
      }
    };

    //show message previous version 
    vm.viewDynamicMessageHistory = (row, ev) => {
      DialogFactory.dialogService(
        USER.ADMIN_DYNAMICMESSAGE_HISTORY_POPUP_CONTROLLER,
        USER.ADMIN_DYNAMICMESSAGE_HISTORY_POPUP_VIEW,
        ev,
        row.entity).then(() => {
          //nothing to refresh
        }, (err) => {
          return BaseService.getErrorLog(err);
        });
    };

    ///generate JSON
    vm.generateJSON = () => {
      let data = { callFromDbScript: false };
      vm.cgBusyLoading = DynamicMessageFactory.generateJSonFromMongoDB(data).query().$promise.then((result) => {
        //nothing to show
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };

    /************ FOR DynamicMessage from MONGODB*********************** */
  }

})();
