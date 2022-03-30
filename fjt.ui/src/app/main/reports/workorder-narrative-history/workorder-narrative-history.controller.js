(function () {
  'use strict';

  angular
    .module('app.reports.workordernarrativehistory')
    .controller('WorkorderNarrativeHistoryController', WorkorderNarrativeHistoryController);

  /** @ngInject */
  function WorkorderNarrativeHistoryController($timeout, $stateParams, CORE, USER, TRAVELER, BaseService, DialogFactory,
    TravelersFactory, $mdDialog, $scope) {
    const vm = this;
    vm.isUpdatable = true;
    vm.EmptyMesssage = angular.copy(TRAVELER.TRAVELER_EMPTYSTATE.WO_NARRATIVE_HISTORY);
    vm.LabelConstant = CORE.LabelConstant;
    vm.StatusOptionsGridHeaderDropdown = CORE.StatusOptionsGridHeaderDropdown;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.DefaultDateFormat = _dateTimeDisplayFormat;
    vm.editFeatureBased = true;
    vm.isDeleteFeatureBased = true;
    vm.gridConfig = CORE.gridConfig;
    vm.fromDateOptions = {
      fromDateOpenFlag: false
    };
    vm.toDateOptions = {
      toDateOpenFlag: false
    };
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;

    /*
    * Author :  Vaibhav Shah
    * Purpose : go to assy list
    */
    vm.goToAssyList = () => {
        BaseService.goToPartList();
      return false;
    };

    /*
    * Author :  Vaibhav Shah
    * Purpose : go to manage part number
    */
    vm.goToAssyMaster = () => {
      BaseService.goToComponentDetailTab(CORE.MFG_TYPE.MFG.toLowerCase(), vm.woDetails.partID, USER.PartMasterTabs.Detail.Name);
      return false;
    };

    /*
     * Author :  Vaibhav Shah
     * Purpose : Work Order List
     */
    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
      return false;
    };
    vm.goToWorkorderDetails = (data) => {
      BaseService.goToWorkorderDetails(data.woID);
      return false;
    };

    vm.sourceHeader = [
      {
        field: 'Action',
        cellClass: 'gridCellColor',
        displayName: 'Action',
        width: '75',
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
        enableSorting: false
      },
      {
        field: 'narrativeDescription',
        width: '150',
        displayName: 'Narrative Description',
        cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.narrativeDescription" ng-click="grid.appScope.$parent.vm.showNarrativeInfo(row.entity, $event)"> \
                                   View \
                                </md-button>',
        enableCellEdit: false,
        enableFiltering: false,
        enableSorting: false,
        exporterSuppressExport: true
      }, {
        field: 'PIDCode',
        displayName: vm.LabelConstant.Assembly.ID,
        cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link \
                                        component-id="row.entity.partID" \
                                        label="grid.appScope.$parent.vm.LabelConstant.Assembly.ID" \
                                        value="row.entity.PIDCode" \
                                        is-copy="true" \
                                        is-mfg="true" \
                                        mfg-label="grid.appScope.$parent.vm.LabelConstant.Assembly.MFGPN" \
                                        mfg-value="row.entity.mfgPN" \
                                        is-custom-part="row.entity.isCustom" \
                                        rohs-icon="row.entity.rohsIcon" \
                                        rohs-status="row.entity.rohsName" \
                                        is-copy-ahead-label="true"\
                                        is-assembly="true"></div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.PID
      }, {
        field: 'nickName',
        displayName: vm.LabelConstant.Assembly.NickName,
        enableCellEdit: false,
        enableCellEditOnFocus: true,
        width: CORE.UI_GRID_COLUMN_WIDTH.ASSY_NICKNAME
      }, {
        field: 'mfgPNDescription',
        displayName: vm.LabelConstant.Assembly.Description,
        enableCellEdit: false,
        enableCellEditOnFocus: true,
        width: '250'
      },
      {
        field: 'woNumber',
        displayName: vm.LabelConstant.Workorder.WO,
        enableCellEdit: false,
        width: '150'
      },
      {
        field: 'woVersion',
        displayName: vm.LabelConstant.Workorder.Version,
        enableCellEdit: false,
        width: '60'
      },
      {
        field: 'opName',
        displayName: vm.LabelConstant.Operation.OP,
        enableCellEdit: false,
        width: '250'
      }, {
        field: 'totalTimeConsume',
        displayName: 'Total Time Consumed',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{row.entity.totalTimeConsume | convertSecondsToTime}}</div>',
        enableFiltering: true,
        enableSorting: true,
        type: 'time',
        width: '100'
      }, {
        field: 'entryDate',
        displayName: 'Entry Date',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableSorting: true,
        enableFiltering: false
      },
      {
        field: 'employeeName',
        displayName: 'Added By',
        enableFiltering: true,
        enableSorting: true,
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY
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
      }];

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['entryDate', 'ASC']],
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
      exporterCsvFilename: 'Work Order R&D Narrative History.csv'
    };
    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICall = (narrativeHistory, isGetDataDown) => {
      if (narrativeHistory && narrativeHistory.data && narrativeHistory.data.narrativeHistory) {
        _.each(narrativeHistory.data.narrativeHistory, (item) => {
          item.rohsIcon = stringFormat('{0}{1}', vm.rohsImagePath, item.rohsIcon);
          item.isDisabledUpdate = true;
          item.isDisabledDelete = true;
          if (vm.enableNarrativeDetails) {
            item.isDisabledUpdate = false;
            item.isDisabledDelete = false;
          }
        });
        if (!isGetDataDown) {
          vm.sourceData = narrativeHistory.data.narrativeHistory;
          vm.currentdata = vm.sourceData.length;
        }
        else if (narrativeHistory.data.narrativeHistory.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(narrativeHistory.data.narrativeHistory);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        // must set after new data comes
        vm.totalSourceDataCount = narrativeHistory.data.Count;
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

    //get work order R&D Narrative History data for grid bind
    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.headerdata = [];
      vm.pagingInfo.fromDate = BaseService.getAPIFormatedDate(vm.fromDate);
      vm.pagingInfo.toDate = BaseService.getAPIFormatedDate(vm.toDate);
      vm.pagingInfo.woID = $stateParams.woID ? $stateParams.woID : null;

      vm.cgBusyLoading = TravelersFactory.retriveNarrativeHistoryList().query(vm.pagingInfo).$promise.then((narrativeHistory) => {
        vm.enableNarrativeDetails = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowNarrativeDetails);
        if (narrativeHistory && narrativeHistory.data) {
          if (narrativeHistory.data.woDetails && narrativeHistory.data.woDetails.length > 0) {
            vm.woDetails = _.first(narrativeHistory.data.woDetails);
            vm.headerdata.push({
              label: vm.LabelConstant.Assembly.PIDCode,
              value: vm.woDetails.PIDCode,
              displayOrder: 1,
              labelLinkFn: vm.goToAssyList,
              valueLinkFn: vm.goToAssyMaster,
              isCopy: true,
              isCopyAheadLabel: true,
              isAssy: true,
              imgParms: {
                imgPath: stringFormat('{0}{1}', vm.rohsImagePath, vm.woDetails.rohsIcon),
                imgDetail: vm.woDetails.name
              },
              isCopyAheadOtherThanValue: true,
              copyAheadLabel: vm.LabelConstant.Assembly.MFGPN,
              copyAheadValue: vm.woDetails.mfgPN
            });
            vm.headerdata.push({
              label: vm.LabelConstant.Workorder.WO, value: vm.woDetails.woNumber,
              displayOrder: 2, labelLinkFn: vm.goToWorkorderList,
              valueLinkFn: vm.goToWorkorderDetails,
              valueLinkFnParams: { woID: vm.woDetails.woID },
              isCopy: false
            });
            vm.headerdata.push({
              label: vm.LabelConstant.Workorder.Version,
              value: vm.woDetails.woVersion, displayOrder: 3
            });
          }
          setDataAfterGetAPICall(narrativeHistory, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //get data down
    vm.getDataDown = () => {
      vm.pagingInfo.fromDate = BaseService.getAPIFormatedDate(vm.fromDate);
      vm.pagingInfo.toDate = BaseService.getAPIFormatedDate(vm.toDate);
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = TravelersFactory.retriveNarrativeHistoryList().query(vm.pagingInfo).$promise.then((narrativeHistory) => {
        if (narrativeHistory && narrativeHistory.data) {
          setDataAfterGetAPICall(narrativeHistory, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.fab = {
      Status: false
    };


    /* update narrative details*/
    vm.updateRecord = (row, ev) => {
      vm.addEditRecord(row.entity, ev);
    };

    /* delete narrative details*/
    vm.deleteRecord = (narrativeHistory) => {
      let selectedIDs = [];
      if (narrativeHistory) {
        selectedIDs.push(narrativeHistory.id);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((narrativeHistoryItem) => narrativeHistoryItem.id);
        }
      }

      if (selectedIDs) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Work Order R&D Narrative History', selectedIDs.length);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        const objIDs = {
          id: selectedIDs,
          CountList: false
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.cgBusyLoading = TravelersFactory.deleteNarrativeHistory().query({ objIDs: objIDs }).$promise.then((res) => {
              if (res) {
                if (res.data && (res.data.length > 0 || res.data.transactionDetails)) {
                  const data = {
                    TotalCount: res.data.transactionDetails[0].TotalCount,
                    pageName: CORE.PageName.workorder_trans_narrative_history
                  };
                  BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                    const objIDs = {
                      id: selectedIDs,
                      CountList: true
                    };
                    return TravelersFactory.deleteNarrativeHistory().query({ objIDs: objIDs }).$promise.then((res) => {
                      let data = {};
                      data = res.data;
                      data.pageTitle = narrativeHistory ? narrativeHistory.className : null;
                      data.PageName = CORE.PageName.workorder_trans_narrative_history;
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
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
          //if (resposne) {
          //    vm.cgBusyLoading = TravelersFactory.NarrativeHistory().delete({
          //        id: selectedIDs,
          //    }).$promise.then((data) => {
          //        BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
          //        vm.gridOptions.clearSelectedRows();
          //    }).catch((error) => {
          //        return BaseService.getErrorLog(error);
          //    });
          //}
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        //show validation message no data selected
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContent.message = stringFormat(messageContent.message, 'work order R&D narrative history');
        const alertModel = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(alertModel);
      }
    };

    /* add.edit work order R&D Narrative History*/
    vm.addEditRecord = (data, ev) => {
      const obj = {};
      if (data) {
        obj.id = data.id;
        obj.partID = data.partID;
        obj.woTransID = data.woTransID;
        obj.woID = data.woID;
        obj.opID = data.opID;
        obj.woOPID = data.woOPID;
        obj.employeeID = data.employeeID;
        obj.narrativeDescription = data.narrativeDescription;
        obj.totalTimeConsume = data.totalTimeConsume;
      } else {
        obj.woID = vm.woDetails.woID;
        obj.partID = vm.woDetails.partID;
      }
      DialogFactory.dialogService(
        TRAVELER.ADD_NARRATIVE_DETAILS_POPUP_CONTROLLER,
        TRAVELER.ADD_NARRATIVE_DETAILS_POPUP_VIEW,
        ev,
        obj).then(() => {
          BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
        }, (err) => BaseService.getErrorLog(err));
    };

    /* delete multiple data called from directive of ui-grid*/
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };

    //close popup on page destroy
    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, { closeAll: true });
      // stateChangeSuccessCall();
    });

    //on change of from date
    vm.fromDateChanged = () => {
      if (vm.fromDate > vm.toDate) {
        vm.toDate = null;
      }
      vm.fromDateOptions = {
        fromDateOpenFlag: false
      };
    };

    //on change of to date
    vm.toDateChanged = () => {
      if (vm.toDate < vm.fromDate) {
        vm.fromDate = null;
      }
      vm.toDateOptions = {
        toDateOpenFlag: false
      };
    };

    // on click of search R&D narrative history
    vm.narrativeHistoryDateSearch = () => {
      initPageInfo();
      vm.loadData();
    };

    // set default date on load
    const setDefaultDate = () => {
      var date = new Date();
      date.setDate(date.getDate() - 30);
      vm.toDate = new Date();
      vm.fromDate = date;
    };

    // reset date for narrative
    vm.narrativeHistoryDateReset = () => {
      var date = new Date();
      date.setDate(date.getDate() - 30);
      vm.toDate = new Date();
      vm.fromDate = date;
      initPageInfo();
      vm.loadData();
    };

    /* Show Narrative*/
    vm.showNarrativeInfo = (object, ev) => {
      const obj = {
        title: 'Narrative',
        description: object.narrativeDescription,
        name: object.opName
      };
      const data = obj;
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        data).then(() => {
          BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
        }, (err) => BaseService.getErrorLog(err));
    };

    setDefaultDate();
  }
})();
