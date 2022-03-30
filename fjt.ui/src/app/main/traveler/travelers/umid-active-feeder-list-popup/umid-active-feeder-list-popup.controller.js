(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('umidActiveFeederListController', umidActiveFeederListController);

  /** @ngInject */
  function umidActiveFeederListController(CORE, BaseService, $timeout, $mdDialog, WorkorderTransactionUMIDFactory, WORKORDER, USER, data) {
    var vm = this;
    var setOperationColTemplate = '';
    vm.DefaultDateTimeFormat = _dateTimeDisplayFormat;
    vm.EmptyMesssageOperation = WORKORDER.WORKORDER_EMPTYSTATE.ACTIVE_OPERATION;
    vm.isHideDelete = true;  //to hide global delete column of UI-grid
    vm.isUpdatable = false;
    vm.gridConfig = CORE.gridConfig;
    vm.data = data;
    vm.data.message = 'UMID is in use and Verification is Pending at following details.';
    // 'UMID is Loaded in Feeder at following details, You cannot change count of <b>{0}</b>.';
    vm.data.message = stringFormat(vm.data.message, vm.data.uid);
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;

    vm.LabelConstant = CORE.LabelConstant;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;


    /* to move at operation update page */
    vm.goToTravelerOperationDetails = (data) => {
      BaseService.goToTravelerOperationDetails(data.woOPID, data.employeeID, data.woOPID);
      return false;
    };
    //goto workorder detail
    vm.goToWorkOrderDetail = (data) => {
      BaseService.goToWorkorderDetails(data.entity.woID);
      return false;
    };

    /** Redirect to umid list page */
    vm.goToUMIDList = () => {
      BaseService.goToUMIDList();
    };

    /** Redirect to manage umid page */
    vm.goToUMIDDetail = () => BaseService.goToUMIDDetail(vm.data.id);

    //go to assembly list
    vm.goToAssyList = () => {
      BaseService.goToPartList();
    };

    //go to manage part number
    vm.goToAssyMaster = () => {
      BaseService.goToComponentDetailTab(vm.data.component.mfgCodemst.mfgType.toLowerCase(), vm.data.component.id, USER.PartMasterTabs.Detail.Name);
    };

    //redirect to employee  Detail
    vm.goToEmployeeDetail = (empId) => {
      BaseService.goToManagePersonnel(empId);
    };

    //go to workorder operation equipment
    vm.goToWorkorderOperationEquipments = (woOPID) => {
      BaseService.goToWorkorderOperationEquipments(woOPID);
    };
    vm.headerData = [{
      label: vm.LabelConstant.MFG.PID,
      value: vm.data.component.PIDCode,
      displayOrder: 2,
      labelLinkFn: vm.goToAssyList,
      valueLinkFn: vm.goToAssyMaster,
      isCopy: true,
      isCopyAheadLabel: true,
      imgParms: {
        imgPath: vm.data.component.rfq_rohsmst.rohsIcon !== null ? stringFormat(CORE.RoHSImageFormat, CORE.WEB_URL, USER.ROHS_BASE_PATH, vm.data.component.rfq_rohsmst.rohsIcon) : null,
        imgDetail: vm.data.component.rfq_rohsmst.name
      },
      isCopyAheadOtherThanValue: true,
      copyAheadLabel: vm.LabelConstant.MFG.MFGPN,
      copyAheadValue: vm.data.component.mfgPN
    }, {
      label: vm.LabelConstant.TransferStock.UMID,
      value: vm.data.uid,
      displayOrder: 1,
      labelLinkFn: vm.goToUMIDList,
      valueLinkFn: vm.goToUMIDDetail,
      isCopy: true
    }];

    //init paging info for grid
    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        pageSize: CORE.UIGrid.ItemsPerPage(),
        SortColumns: [],
        SearchColumns: [],
        refsidid: vm.data.id
      };
    };
    initPageInfo();

    //set grid options
    vm.gridOptions = {
      enablePaging: isEnablePagination,
      enablePaginationControls: isEnablePagination,
      enableCellEditOnFocus: false,
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: false,
      multiSelect: false,
      exporterMenuCsv: true,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterCsvFilename: 'UMID Active Feeder List.csv'
    };


    //set source header for grid
    const setGridDataHeader = () => {
      setOperationColTemplate = '';
      setOperationColTemplate = '<div class="ui-grid-cell-contents text-left" ng-if="row.entity.showOperationLink"> \
            <a tabindex="-1"class= "text-underline cursor-pointer" ng-click="grid.appScope.$parent.vm.goToTravelerOperationDetails(row.entity)" > \
                {{row.entity.opFullName}} \
            </a> \
            <md-tooltip md-direction="top">{{COL_FIELD}}</md-tooltip> </div> \
            <div class="ui-grid-cell-contents text-left" ng-if="!row.entity.showOperationLink"> \
                {{row.entity.opFullName}} \
            <md-tooltip md-direction="top">{{COL_FIELD}}</md-tooltip> </div>';
      vm.sourceHeader = [
        {
          field: '#',
          width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
          cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
          enableSorting: false,
          enableFiltering: false
        },
        {
          field: 'PIDCode',
          displayName: vm.LabelConstant.Assembly.ID,
          cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link \
                                component-id="row.entity.partId" \
                                label="grid.appScope.$parent.vm.LabelConstant.Assembly.ID" \
                                value="row.entity.PIDCode" \
                                is-copy="true" \
                                is-mfg="true" \
                                mfg-label="grid.appScope.$parent.vm.LabelConstant.Assembly.MFGPN" \
                                mfg-value="row.entity.mfgPN" \
                                rohs-icon="row.entity.rohsIcon" \
                                rohs-status="row.entity.rohsName" \
                                is-copy-ahead-label="true"\
                                is-assembly="true"></common-pid-code-label-link></div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.PID
        },
        {
          field: 'woNumber',
          width: '150',
          displayName: vm.LabelConstant.Workorder.WO,
          cellTemplate: '<div class="ui-grid-cell-contents text-left" flex="100"> \
            <a tabindex="-1" class= "text-underline cursor-pointer min-width-max-content" ng-click="grid.appScope.$parent.vm.goToWorkOrderDetail(row, $event)" > \
                {{COL_FIELD}} \
            </a> \
            <md-tooltip md-direction="top" class="inline-block min-width-max-content">{{row.entity.woNumber}} </md-tooltip> </div> ',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'opFullName',
          width: '250',
          displayName: vm.LabelConstant.Operation.OP,
          cellTemplate: setOperationColTemplate,
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'opVersion',
          width: '80',
          displayName: vm.LabelConstant.Operation.Version,
          cellTemplate: '<div class="ui-grid-cell-contents text-left"> {{ COL_FIELD }}</div>',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'employeeName',
          width: '180',
          displayName: 'Personnel Name',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">' +
            '<a tabindex="-1" class="text-underline cursor-pointer min-width-max-content" ng-click="grid.appScope.$parent.vm.goToEmployeeDetail(row.entity.employeeID, $event)" > ' +
            '{{ COL_FIELD }}</a></div> ',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'equipmentName',
          width: '180',
          displayName: 'Equipment',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">' +
            '<a tabindex="-1" class="text-underline cursor-pointer min-width-max-content" ng-click="grid.appScope.$parent.vm.goToWorkorderOperationEquipments(row.entity.woOPID, $event)" > ' +
            '  {{ COL_FIELD }} ' +
            '</a> </div>',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'displayActivityType',
          width: '180',
          displayName: 'Activity Type',
          cellTemplate: '<div class="ui-grid-cell-contents text-left"> {{COL_FIELD}}</div>',
          enableFiltering: true,
          enableSorting: true
        }
      ];
    };

    //vm.startTimer = ((data) => data.tickActivity = setInterval(() => {
    //  data.currentTotalTime = data.currentTotalTime + 1;
    //  data.currentTotalDiff = secondsToTime(data.currentTotalTime, true);
    //}, _configSecondTimeout)
    //);

    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICall = (response, isGetDataDown) => {
      if (response && response.data && response.data.feederList) {
        _.each(response.data.feederList, (item) => {
          // item.currentTotalDiff = secondsToTime(item.currentTotalTime, true);
          //if (item.opStatus === 'Work In Progress' || item.opStatus === 'Hold') {
          //  vm.startTimer(item);
          //}
          if (vm.loginUser.isUserSuperAdmin) {
            item.showOperationLink = true;
          } else if (vm.loginUser.employee.id === item.employeeID) {
            item.showOperationLink = true;
          } else {
            item.showOperationLink = false;
          }
          item.rohsIcon = vm.rohsImagePath + item.rohsIcon;
        });
        if (!isGetDataDown) {
          if ((vm.pagingInfo.SearchColumns && vm.pagingInfo.SearchColumns.length === 0) && (vm.pagingInfo.SortColumns && vm.pagingInfo.SortColumns.length === 0)) {
            setGridDataHeader();
          }
          vm.sourceData = response.data.feederList;
          vm.currentdata = vm.sourceData.length;
        }
        else if (response.data.feederList.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(response.data.feederList);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }

        // must set after new data comes
        vm.totalSourceDataCount = _.first(_.map(response.data.feederList, (det) => det.totalCount));;
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
            vm.isNoDataFoundActiveFeeder = false;
            vm.emptyState = 0;
          }
          else {
            vm.isNoDataFoundActiveFeeder = true;
            vm.emptyState = null;
          }
        }
        else {
          vm.isNoDataFoundActiveFeeder = false;
          vm.emptyState = null;
        }
        $timeout(() => {
          if (isGetDataDown) {
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount !== vm.currentdata ? true : false);
          }
          else {
            vm.resetSourceGrid();
            if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
            }
          }
        });
      }
    };


    // [S] Get Operation List
    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = WorkorderTransactionUMIDFactory.getUMIDActiveFeederList().query(vm.pagingInfo).$promise.then((response) => {
        if (response && response.data) {
          setDataAfterGetAPICall(response, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = WorkorderTransactionUMIDFactory.getUMIDActiveFeederList().query(vm.pagingInfo).$promise.then((response) => {
        if (response && response.data) {
          setDataAfterGetAPICall(response, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // close popup
    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
