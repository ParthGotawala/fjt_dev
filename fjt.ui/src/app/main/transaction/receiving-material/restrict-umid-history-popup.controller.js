(function () {
  'use strict';

  angular
    .module('app.transaction.receivingmaterial')
    .controller('RestrictUMIDHistoryPopUpController', RestrictUMIDHistoryPopUpController);

  /** @ngInject */
  function RestrictUMIDHistoryPopUpController($mdDialog, $scope, $timeout, BaseService, DialogFactory, USER, CORE, data, TRANSACTION, ReceivingMaterialFactory) {
    const vm = this;
    vm.CORE = CORE;
    vm.transaction = TRANSACTION;
    vm.isHideDelete = true;
    vm.detailOfUMID = data;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.RESTRICTUMIDHISTORY;
    vm.DefaultDateTimeFormat = _dateTimeDisplayFormat;
    vm.LabelConstant = CORE.LabelConstant;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;

    vm.goToUMIDList = () => {
      BaseService.goToUMIDList(0, 0);
      return false;
    };

    vm.goToUMIDDetail = (data) => BaseService.goToUMIDDetail(data.id);

    vm.goToPartList = () => {
      BaseService.goToPartList(CORE.MFG_TYPE.MFG);
      return false;
    };
    vm.goToComponentDetail = (data) => {
      BaseService.goToComponentDetailTab(null, data.id);
      return false;
    };

    vm.headerdata = [
      {
        label: vm.CORE.LabelConstant.TransferStock.UMID,
        value: vm.detailOfUMID.uid,
        displayOrder: 1,
        isCopy: true,
        labelLinkFn: vm.goToUMIDList,
        valueLinkFn: vm.goToUMIDDetail,
        valueLinkFnParams: { id: vm.detailOfUMID.id }
      },
      {
        label: vm.CORE.LabelConstant.MFG.MFGPN,
        value: vm.detailOfUMID.mfgPN,
        displayOrder: 2,
        labelLinkFn: vm.goToPartList,
        valueLinkFn: vm.goToComponentDetail,
        valueLinkFnParams: { id: vm.detailOfUMID.refcompid },
        isCopy: true,
        imgParms: {
          imgPath: vm.detailOfUMID.rohsIcon,
          imgDetail: vm.detailOfUMID.rohsName
        }
      }
    ];

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['id', 'DESC']],
        SearchColumns: [],
        umid: vm.detailOfUMID.id
      };
    };
    initPageInfo();

    vm.gridOptions = {
      enablePaging: isEnablePagination,
      enablePaginationControls: isEnablePagination,
      showColumnFooter: false,
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: true,
      multiSelect: false,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: 'RestrictUMIDHistory.csv'
    };

    vm.sourceHeader = [
      {
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
        enableFiltering: false,
        enableSorting: false
      },
      {
        field: 'transactionDate',
        displayName: 'Transaction Date',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateTimeFormat}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        allowCellFocus: false,
        type: 'datetime'
      },
      {
        field: 'createdByName',
        displayName: 'Modified By',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        allowCellFocus: false
      },
      {
        field: 'uid',
        displayName: vm.CORE.LabelConstant.TransferStock.UMID,
        cellTemplate: '<div class="ui-grid-cell-contents text-left"> \
                        <a tabindex="-1" ng-click="grid.appScope.$parent.vm.goToUMIDDetail(row.entity)" class="cm-text-decoration underline cursor-pointer">{{COL_FIELD | uppercase}}</a> \
                        <copy-text label="grid.appScope.$parent.vm.CORE.LabelConstant.UMIDManagement.UMID" text="row.entity.uid"></copy-text></div>',
        width: '170',
        allowCellFocus: false
      },
      {
        field: 'PIDCode',
        displayName: CORE.LabelConstant.MFG.PID,
        cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link \
                                        component-id="row.entity.refcompid" \
                                        label="grid.appScope.$parent.vm.CORE.LabelConstant.MFG.PID" \
                                        value="row.entity.PIDCode" \
                                        is-copy="true" \
                                        is-mfg="true" \
                                        mfg-label="grid.appScope.$parent.vm.CORE.LabelConstant.MFG.MFGPN" \
                                        mfg-value="row.entity.mfgPN" \
                                        rohs-icon="row.entity.rohsIcon" \
                                        rohs-status="row.entity.rohsName" \
                                        is-copy-ahead-label="true" \
                                        restrict-use-permanently="row.entity.restrictUsePermanently" \
                                        restrict-use-with-permission="row.entity.restrictUSEwithpermission" \
                                        restrict-packaging-use-permanently="row.entity.restrictPackagingUsePermanently" \
                                        restrict-packaging-use-with-permission="row.entity.restrictPackagingUseWithpermission" > \
                                    </common-pid-code-label-link></div>',
        width: '300',
        allowCellFocus: false
      },
      {
        field: 'restrictTypeLabel',
        displayName: 'Restrict Type',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" \
                        ng-class="{\'label-success\':row.entity.restrictType == \'R\',\
                        \'label-warning\':row.entity.restrictType == \'U\'}"> \
                            {{COL_FIELD}}'
          + '</span>'
          + '</div>',
        width: '150',
        allowCellFocus: false
      },
      {
        field: 'reasonForRestrict',
        displayName: 'Reason For Restricted UMID',
        cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.reasonForRestrict" ng-click="grid.appScope.$parent.vm.showReasonUMIDRestricted(row.entity, $event)"> \
                                View \
                            </md-button>',
        enableFiltering: false,
        enableSorting: false,
        width: '120',
        enableCellEdit: false
      }, {
        field: 'createdbyRole',
        ddisplayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }];

    function setDataAfterGetAPICall(restrictumid, isGetDataDown) {
      if (restrictumid && restrictumid.data.history) {
        if (!isGetDataDown) {
          vm.sourceData = restrictumid.data.history;
          vm.currentdata = vm.sourceData.length;
        }
        else if (restrictumid.data.history.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(restrictumid.data.history);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        if (vm.sourceData && vm.sourceData.length > 0) {
          _.map(vm.sourceData, (data) => {
            data.rohsIcon = stringFormat('{0}{1}', vm.rohsImagePath, data.rohsIcon);
          });
        }
        // must set after new data comes
        vm.totalSourceDataCount = restrictumid.data.Count;
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

    /* retrieve Receiving Material list*/
    vm.loadData = () => {
      if (vm.pagingInfo.SortColumns.length === 0) {
        vm.pagingInfo.SortColumns = [['id', 'DESC']];
      }
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = ReceivingMaterialFactory.restrictUMIDHistory().query(vm.pagingInfo).$promise.then((response) => {
        vm.sourceData = [];
        if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          setDataAfterGetAPICall(response, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = ReceivingMaterialFactory.restrictUMIDHistory().query(vm.pagingInfo).$promise.then((response) => {
        setDataAfterGetAPICall(response, true);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.showReasonUMIDRestricted = (object, ev) => {
      const obj = {
        title: vm.transaction.restrictUMIDReasonTitle,
        description: object.reasonForRestrict,
        name: object.uid
      };
      const data = obj;
      data.label = vm.CORE.LabelConstant.TransferStock.UMID;
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        data
      ).then(() => {

      }, (err) => BaseService.getErrorLog(err));
    };

    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
