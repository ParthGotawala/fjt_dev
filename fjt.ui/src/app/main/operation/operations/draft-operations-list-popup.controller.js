(function () {
  'use strict';

  angular
    .module('app.operation.operations')
    .controller('DraftOperationListPopupController', DraftOperationListPopupController);

  /** @ngInject */
  function DraftOperationListPopupController($mdDialog, $scope, $timeout, data, CORE, OperationFactory, BaseService, OPERATION, DialogFactory) {
    const vm = this;
    vm.EmptyMesssage = OPERATION.OPERATION_EMPTYSTATE.OPERATION;
    vm.SampleStatusGridHeaderDropdown = CORE.SampleStatusGridHeaderDropdown;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = CORE.LabelConstant;
    vm.gridConfig = CORE.gridConfig;
    vm.isHideDelete = true;
    vm.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.ONLY_PUBLISHED_OPERATION_CONVERTINTOTEMPLATE);

    // Source header data
    vm.sourceHeader = [{
      field: '#',
      width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
      cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
      enableFiltering: false,
      enableSorting: false
    }, {
      field: 'opStatusConvertedValue',
      displayName: 'Status',
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
        + '<span class="label-box" ng-class="grid.appScope.$parent.vm.getOpStatusClassName(row.entity.opStatus)">'
        + '{{COL_FIELD}}'
        + '</span>'
        + '</div>',
      width: 120,
      enableFiltering: false,
      enableSorting: false,
    }, {
      field: 'opNumber',
      displayName: vm.LabelConstant.Operation.OP,
      cellClass: 'alignRight text-right',
      cellTemplate: '<a class="ui-grid-cell-contents cm-text-decoration" ng-click="grid.appScope.$parent.vm.goTooperationDetails(row.entity.opID);">\
                                                {{row.entity.opNumber | threeDecimal}} \
                                            </a><md-tooltip md-direction="top">{{row.entity.opNumber | threeDecimal}}</md-tooltip>',
      width: 105
    }, {
      field: 'opName',
      displayName: 'Name',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: 520
    }, {
      field: 'shortDescription',
      displayName: 'Short Description',
      cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
        '<span class="cursor-pointer bom-header-wrap">{{ COL_FIELD }}</span> &nbsp;' +
        '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.shortDescription && row.entity.shortDescription !== \'-\'" ng-click="grid.appScope.$parent.vm.showDescription(row.entity, true, $event)">' +
        '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
        '<md-tooltip>View</md-tooltip>' +
        '</button>' +
        '</div>',
      enableFiltering: false,
      width: '300'
    }, {
      field: 'operationType',
      displayName: 'Operation Type',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: 300
    }, {
      field: 'mountingType',
      displayName: 'Mounting Type',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: 300

    }, {
      field: 'isMoveToStockConvertedValue',
      displayName: 'Last Operation',
      headerCellTemplate: '<div ng-class="{ \'sortable\': sortable }">' +
        '<div class="ui-grid-vertical-bar">&nbsp;</div>' +
        '<div class="ui-grid-cell-contents" col-index="renderIndex">Last Operation<span class="icon-question-mark-circle help-icon">\
                            <md-tooltip md-direction="top">{{grid.appScope.$parent.vm.LabelConstant.Operation.LastOperationAndMoveToStock}}</md-tooltip></span>' +
        '<span ui-grid-visible="col.sort.direction" ng-class="{ \'ui-grid-icon-up-dir\': col.sort.direction == asc, \'ui-grid-icon-down-dir\': col.sort.direction == desc, \'ui-grid-icon-blank\': !col.sort.direction }">' +
        '&nbsp;' +
        '</span>' +
        '</div>' +
        '<div class="ui-grid-column-menu-button" ng-if="grid.options.enableColumnMenus && !col.isRowHeader  && col.colDef.enableColumnMenu !== false" class="ui-grid-column-menu-button" ng-click="toggleMenu($event)">' +
        '<i class="ui-grid-icon-angle-down">&nbsp;</i>' +
        '</div>' +
        '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>' +
        '</div>',
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
        + '<span class="label-box" ng-if="row.entity.isMoveToStock == true" \
                            ng-class="{\'label-success\':row.entity.isMoveToStock == true, \
                            \'label-warning\':row.entity.isMoveToStock == false}"> \
                                {{ COL_FIELD }}'
        + '</span>'
        + '</div>',
      filter: {
        term: null,
        options: vm.SampleStatusGridHeaderDropdown
      },
      width: '100'
    }];

    // init pageInfo.
    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['opNumber', 'ASC']],
        SearchColumns: [],
        isOnlyDraftOperation: true,
        masterTemplateId: data && data.masterTemplateId ? data.masterTemplateId : null
      };
    };
    initPageInfo();

    // grid options
    vm.gridOptions = {
      enablePaging: false, // isEnablePagination,
      enablePaginationControls: false, //isEnablePagination,
      showColumnFooter: false,
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: false,
      multiSelect: false,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: 'DraftOperations.csv'
    };

    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICall = (operation, isGetDataDown) => {
      if (operation && operation.data && operation.data.operation) {
        if (!isGetDataDown) {
          vm.sourceData = operation.data.operation;
          vm.currentdata = vm.sourceData.length;
        }
        else if (operation.data.operation.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(operation.data.operation);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }

        // must set after new data comes
        vm.totalSourceDataCount = operation.data.Count;
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
            vm.emptyState = 0;
          }
          else {
            vm.emptyState = null;
            const data = {
              isCloseFromNoDataFound: true
            };
            $mdDialog.hide(data);
          }
        }
        else {
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

    // to bind data in grid on load
    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = OperationFactory.retriveDraftOperationsByMasterTemplate().query(vm.pagingInfo).$promise.then((operation) => {
        if (operation && operation.data) {
          setDataAfterGetAPICall(operation, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // to get data on scroll down in grid
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = OperationFactory.retriveDraftOperationsByMasterTemplate().query(vm.pagingInfo).$promise.then((operation) => {
        if (operation && operation.data) {
          setDataAfterGetAPICall(operation, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // get class name for operation status.
    vm.getOpStatusClassName = (statusID) => BaseService.getOpStatusClassName(statusID);

    // Show Description
    vm.showDescription = (object, isShortDescription, ev) => {
      const obj = {
        title: 'Operation',
        description: isShortDescription ? object.shortDescription : object.opDescription,
        name: object.opName
      };
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        obj).then(() => {
          initPageInfo();
          vm.loadData();
        }, (err) => BaseService.getErrorLog(err));
    };

    // go to operation master page
    vm.goTooperationDetails = (id) => {
      BaseService.goToManageOperation(id);
    };

    vm.cancel = (isCopyMasterTemplate) => {
      const data = {
        isCopyMasterTemplate: isCopyMasterTemplate
      };
      $mdDialog.hide(data);
    };
  }
})();
