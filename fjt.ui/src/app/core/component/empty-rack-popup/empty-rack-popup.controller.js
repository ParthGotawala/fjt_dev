(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('EmptyRackPopupController', EmptyRackPopupController);

  /** @ngInject */
  function EmptyRackPopupController($mdDialog, TravelersFactory, CORE, USER, data, BaseService, $timeout) {
    const vm = this;
    vm.LabelConstant = CORE.LabelConstant;
    vm.rackObj = data || {};
    vm.gridConfig = CORE.gridConfig;
    vm.setScrollClass = 'gridScrollHeight_Empty_Page';
    vm.EmptyMesssage = CORE.EMPTYSTATE.EMPTYRACK;
    vm.isHideDelete = true;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
    vm.cancel = () => {
      $mdDialog.cancel();
    };
    //go to workorder pafge list
    vm.gotoWOlist = () => {
      BaseService.goToWorkorderList();
    };
    //go to workorder manage page
    vm.manageWoPage = () => {
      BaseService.goToWorkorderDetails(vm.rackObj.woID);
    };
    //manage workorder operation
    vm.manageWorkorderOperation = () => {
      BaseService.goToWorkorderOperationDetails(vm.rackObj.woOPID);
    };
    //go to workorder operation
    vm.workorderOperation = () => {
      BaseService.goToWorkorderOperations(vm.rackObj.woID);
    };
    //link to go for part master list page
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };
    //go to part master
    vm.goToPartMaster = () => {
        BaseService.goToComponentDetailTab(null, vm.rackObj.partID);
    };
    bindHeaderData();
    function bindHeaderData() {
      vm.headerdata = [];
      vm.headerdata.push({
        label: vm.LabelConstant.MFG.AssyID,
        value: vm.rackObj.PIDCode,
        displayOrder: 1,
        labelLinkFn: vm.goToPartList,
        valueLinkFn: vm.goToPartMaster,
        isCopy: true,
        isCopyAheadLabel: true,
        isAssy: true,
        imgParms: {
          imgPath: stringFormat('{0}{1}{2}', CORE.WEB_URL, USER.ROHS_BASE_PATH, vm.rackObj.rohsIcon),
          imgDetail: vm.rackObj.rohsStatus
        },
        isCopyAheadOtherThanValue: true,
        copyAheadLabel: vm.LabelConstant.MFG.MFGPN,
        copyAheadValue: vm.rackObj.mfgPN
      }, {
        label: vm.LabelConstant.Workorder.WO,
        value: vm.rackObj.woNumber,
        displayOrder: 2,
        labelLinkFn: vm.gotoWOlist,
        valueLinkFn: vm.manageWoPage
      }, {
        label: vm.LabelConstant.Workorder.Version,
        value: vm.rackObj.woVersion,
        displayOrder: 3
      }, {
        label: vm.LabelConstant.Operation.OP,
        value: stringFormat('({0}) {1}', vm.rackObj.opNumber.toFixed(3), vm.rackObj.opName),
        displayOrder: 4,
        labelLinkFn: vm.workorderOperation,
        valueLinkFn: vm.manageWorkorderOperation
      },
        {
          label: vm.LabelConstant.Operation.Version,
          value: vm.rackObj.opVersion,
          displayOrder: 5
        }
      );
    }

    // page info detail
    vm.pagingInfo = {
      // Page: 1,
      SortColumns: [['rackName', 'ASC']],
      SearchColumns: []
    };
    //grid option settings
    vm.gridOptions = {
      enablePaging: isEnablePagination,
      enablePaginationControls: isEnablePagination,
      filterOptions: vm.pagingInfo.SearchColumns,
      enableCellEdit: false,
      enableCellEditOnFocus: false,
      exporterCsvFilename: 'Empty Rack.csv',
      exporterMenuCsv: true,
      enableColumnMenus: false
    };

    //grid header detail
    vm.sourceHeader = [
      {
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
        enableFiltering: false,
        enableSorting: false,
        allowCellFocus: false
      },
      {
        field: 'rackName',
        displayName: 'Rack',
        cellTemplate: '<div class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
        width: '150',
        enableFiltering: true,
        enableSorting: true,
        allowCellFocus: false
      }
    ];

    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICall = (response, isGetDataDown) => {
      if (response && response.data && response.data.emptyRack) {
        if (!isGetDataDown) {
          vm.sourceData = response.data.emptyRack || [];
          vm.currentdata = vm.sourceData.length;
        }
        else if (response.data.emptyRack.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(response.data.emptyRack);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        // must set after new data comes
        vm.totalSourceDataCount = response.data.Count;
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
          if (vm.pagingInfo.SearchColumns.length > 0) {
            vm.isNoDataFound = false;
            vm.emptyState = 0;
          } else {
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


    // get list of empty rack detail
    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      if (vm.pagingInfo.SortColumns.length === 0) {
        vm.pagingInfo.SortColumns = [['rackName', 'ASC']];
      }
      vm.cgBusyLoading = TravelersFactory.retriveEmptyRackList().query(vm.pagingInfo).$promise.then((response) => {
        if (response && response.data) {
          setDataAfterGetAPICall(response, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    // get list of empty rack, called method after scroll
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = TravelersFactory.retriveEmptyRackList().query(vm.pagingInfo).$promise.then((response) => {
        if (response && response.data) {
          setDataAfterGetAPICall(response, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
  }
})();
