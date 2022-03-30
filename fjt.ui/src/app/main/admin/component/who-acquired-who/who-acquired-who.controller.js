(function () {
  'use strict';

  angular
    .module('app.admin.whoacquiredwho')
    .controller('WhoAcquiredWhoController', WhoAcquiredWhoController);

  /** @ngInject */
  function WhoAcquiredWhoController(USER, $scope, CORE, WhoAcquiredWhoFactory, BaseService, $timeout, DialogFactory, $mdDialog) {  // eslint-disable-line func-names
    const vm = this;
    vm.isUpdatable = true;
    vm.isHideDelete = true;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.WHO_ACQUIRED_WHO;
    vm.DateFormatArray = _dateDisplayFormat;
    vm.StatusOptionsGridHeaderDropdown = CORE.SampleStatusGridHeaderDropdown;
    vm.isAdd = false;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;
    vm.defaultDateTimeDisplayFormat = _dateTimeDisplayFormat;
    vm.defaultDateFormat = _dateDisplayFormat;
    vm.LabelConstant = CORE.LabelConstant;
    vm.gridConfig = CORE.gridConfig;
    vm.isAdd = vm.loginUser.isUserAdmin || vm.loginUser.isUserSuperAdmin;

    vm.sourceHeader = [{
      field: '#',
      width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
      cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
      enableFiltering: false,
      enableSorting: false
    }, {
      field: 'mfgBy',
      displayName: 'Acquired By',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                        <a class="cm-text-decoration underline" ng-if="row.entity.buyBy > 0" \
                            ng-click="grid.appScope.$parent.vm.editManufacturer(row.entity.buyBy);"\
                            tabindex="-1">{{COL_FIELD}}</a>\
                    </div>',
      width: '300'
    }, {
      field: 'mfgTo',
      displayName: 'Acquired ' + CORE.LabelConstant.MFG.MFG,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                          <a class="cm-text-decoration underline" ng-if="row.entity.buyTo > 0" \
                              ng-click="grid.appScope.$parent.vm.editManufacturer(row.entity.buyTo);"\
                              tabindex="-1">{{COL_FIELD}}</a>\
                      </div>',
      width: '300'
    }, {
      field: 'buyDate',
      displayName: 'Acquisition Date',
      type: 'date',
      cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.buyDate}}</div>',
      enableFiltering: false
    }, {
      field: 'description',
      displayName: 'Description',
      cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.description" ng-click="grid.appScope.$parent.vm.viewRecord(row.entity, $event)"> \
                          View \
                      </md-button >',
      width: '150',
      enableSorting: false,
      enableFiltering: false
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
        SortColumns: [['buyBy', 'ASC']],
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
      multiSelect: false,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: 'Mergers & Acquisitions.csv'
    };

    function setDataAfterGetAPICall(whoboughtwho, isGetDataDown) {
      if (whoboughtwho && whoboughtwho.data.whoboughtwho) {
        if (!isGetDataDown) {
          vm.sourceData = whoboughtwho.data.whoboughtwho;
          vm.currentdata = vm.sourceData.length;
        }
        else if (whoboughtwho.data.whoboughtwho.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(whoboughtwho.data.whoboughtwho);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        if (vm.sourceData && vm.sourceData.length > 0) {
          _.each(vm.sourceData, (item) => {
            item.buyDate = BaseService.getUIFormatedDate(item.buyDate, vm.defaultDateFormat);
          });
        }
        // must set after new data comes
        vm.totalSourceDataCount = whoboughtwho.data.Count;
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
          vm.resetSourceGrid();
          if (!isGetDataDown) {
            if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
            }
          }
          else {
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount !== vm.currentdata ? true : false);
          }
        });
      }
    }

    /* retrieve Users list*/
    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = WhoAcquiredWhoFactory.retriveWhoBoughtWhoList().query(vm.pagingInfo).$promise.then((response) => {
        if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          setDataAfterGetAPICall(response, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* load more data on mouse scroll */
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = WhoAcquiredWhoFactory.retriveWhoBoughtWhoList().query(vm.pagingInfo).$promise.then((response) => {
        if (response) {
          setDataAfterGetAPICall(response, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // view Description
    vm.viewRecord = (item, $event) => {
      const obj = {
        title: 'Description',
        description: item.description
      };
      const data = obj;
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        $event,
        data).then((response) => {
          item.termsandcondition = response;
        }, (error) => BaseService.getErrorLog(error));
    };

    vm.addEditRecord = (data, ev) => {
      DialogFactory.dialogService(
        CORE.MANAGE_WHO_ACQUIRED_WHO_MODAL_CONTROLLER,
        CORE.MANAGE_WHO_ACQUIRED_WHO_MODAL_VIEW,
        ev,
        data).then(() => {
        }, (data) => {
          if (data) {
            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.editManufacturer = (id) => BaseService.goToManufacturer(id);

    //close popup on page destroy
    $scope.$on('$destroy', () => {
      $mdDialog.hide('', { closeAll: true });
    });
  }
})();
