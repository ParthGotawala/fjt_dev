(function () {
  'use strict';

  angular
    .module('app.transaction.transferstock')
    .controller('TransferStockHistoryController', TransferStockHistoryController);

  /** @ngInject */
  function TransferStockHistoryController($scope, $mdDialog, data, BaseService, USER, CORE, $timeout, TransferStockFactory, ReceivingMaterialFactory, TRANSACTION, DialogFactory) {
    const vm = this;

    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.isHideDelete = true;
    vm.DefaultDateTimeFormat = _dateTimeDisplayFormat;
    vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.TRANSFERSTOCKHISTORY;
    vm.KitAllocationEmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.KITHISTORY;
    vm.WOEmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.WOHISTORY;
    vm.UIDDet = data || {};
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.gridConfig = CORE.gridConfig;
    vm.KitAllocationStatusDropDown = CORE.KitAllocationStatusDropDown;
    $scope.splitPaneFirstProperties = {};
    $scope.splitPaneSecondProperties = {};
    vm.UmidHistoryGridUI = TRANSACTION.UMID_History_Split_UI.UmidHistoryGridUI;
    vm.KITWOHistoryGridUI = TRANSACTION.UMID_History_Split_UI.KITWOHistoryGridUI;
    vm.isTransit = vm.UIDDet.isTransit;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;
    vm.MEASUREMENT_TYPES_COUNT = CORE.MEASUREMENT_TYPES.COUNT;
    const getGridDetail = (GridClass) => document.getElementsByClassName(GridClass);


    //const setGridHeight = (gridchildclientHeight, clientHeightChild) => {
    //  if (gridchildclientHeight && gridchildclientHeight.length > 1) {
    //    gridchildclientHeight[0].setAttribute('style', `height: ${clientHeightChild}px !important;`);
    //    gridchildclientHeight[1].setAttribute('style', `height: ${clientHeightChild}px !important;`);
    //  } else if (gridchildclientHeight && gridchildclientHeight.length > 0) {
    //    gridchildclientHeight[0].setAttribute('style', `height: ${clientHeightChild}px !important;`);
    //  }
    //};

    //$scope.$watch('splitPaneFirstProperties.firstComponentSize', () => {
    //  const gridclientHeight = getGridDetail(TRANSACTION.UMID_History_Split_UI.UmidHistoryGridUI);
    //  const clientHeight = $scope.splitPaneFirstProperties.firstComponentSize - 50;
    //  setGridHeight(gridclientHeight, clientHeight);

    //  const gridchildclientHeight = getGridDetail(TRANSACTION.UMID_History_Split_UI.KITWOHistoryGridUI);
    //  const clientHeightChild = $scope.splitPaneFirstProperties.lastComponentSize - 110;
    //  setGridHeight(gridchildclientHeight, clientHeightChild);
    //});


    /* Retrieve list of part detail to transfer stock */
    vm.getUIDDetail = () => {
      vm.cgBusyLoading = ReceivingMaterialFactory.getUMIDByID().query({ id: vm.UIDDet.id }).$promise.then((response) => {
        if (response && response.data) {
          vm.UIDDet = {
            id: response.data.id,
            uid: response.data.uid,
            pkgQty: response.data.pkgQty,
            pkgUnit: response.data.pkgUnit,
            orgQty: response.data.orgQty,
            orgPkgUnit: response.data.orgPkgUnit,
            fromUID: response.data.fromUID,
            fromUIDId: response.data.fromUIDId,
            parentUID: response.data.parentUID,
            parentUIDId: response.data.parentUIDId,
            receiveMaterialType: response.data.receiveMaterialType,
            mfgcodeID: response.data.component && response.data.component.mfgCodemst ? response.data.component.mfgCodemst.id : null,
            mfgCode: response.data.component && response.data.component.mfgCodemst ? response.data.component.mfgCodemst.mfgCode : null,
            mfgName: response.data.component && response.data.component.mfgCodemst ? response.data.component.mfgCodemst.mfgName : null,
            refcompid: response.data.component ? response.data.component.id : null,
            PIDCode: response.data.component ? response.data.component.PIDCode : null,
            mfgPN: response.data.component ? response.data.component.mfgPN : null,
            rohsIcon: response.data.component && response.data.component.rfq_rohsmst ? response.data.component.rfq_rohsmst.rohsIcon : null,
            rohsName: response.data.component && response.data.component.rfq_rohsmst ? response.data.component.rfq_rohsmst.name : null,
            uomName: response.data.component && response.data.component.UOMs ? response.data.component.UOMs.unitName : null,
            binName: response.data.binMst ? response.data.binMst.Name : null,
            warehouseName: response.data.binMst && response.data.binMst.warehousemst ? response.data.binMst.warehousemst.Name : null,
            deptName: response.data.binMst && response.data.binMst.warehousemst && response.data.binMst.warehousemst.parentWarehouseMst ? response.data.binMst.warehousemst.parentWarehouseMst.Name : null,
            uomClassID: response.data.component && response.data.component.UOMs && response.data.component.UOMs.measurementType && response.data.component.UOMs.measurementType.id ? response.data.component.UOMs.measurementType.id : null
          };
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getUIDDetail();

    // show Approval Reason Popup
    vm.showApprovalReason = (object, ev) => {
      const headerData = [{
        label: vm.LabelConstant.TransferStock.UMID,
        value: vm.UIDDet.uid,
        displayOrder: 1,
        labelLinkFn: () => {
          BaseService.goToUMIDList();
        },
        valueLinkFn: () => {
          BaseService.goToUMIDDetail(vm.UIDDet.id);
        },
        isCopy: true
      }];
      const obj = {
        title: 'Approved Reason',
        description: object.approvalReason,
        headerData: headerData
      };
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        obj
      ).then(() => {

      }, (err) => BaseService.getErrorLog(err));
    };

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['id', 'DESC']],
        SearchColumns: [],
        pageName: CORE.PAGENAME_CONSTANT[7].PageName,
        isPrint: true,
        uid: vm.UIDDet.id
      };

      vm.kitAllocationPagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['updatedAt', 'DESC']],
        SearchColumns: [],
        pageName: CORE.PAGENAME_CONSTANT[7].PageName,
        isPrint: true,
        uid: vm.UIDDet.id
      };

      vm.wOPagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['updatedAt', 'DESC']],
        SearchColumns: [],
        pageName: CORE.PAGENAME_CONSTANT[7].PageName,
        isPrint: true,
        uid: vm.UIDDet.id
      };
    };
    initPageInfo();

    vm.sourceHeader = [
      {
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
        enableFiltering: false,
        enableSorting: false
      }, {
        field: 'createdAt',
        displayName: 'Transaction Date',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        allowCellFocus: false,
        type: 'datetime'
      }, {
        field: 'binName',
        displayName: vm.LabelConstant.TransferStock.Bin,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '140',
        allowCellFocus: false
      }, {
        field: 'warehouseName',
        displayName: vm.LabelConstant.TransferStock.WH,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '130',
        allowCellFocus: false
      }, {
        field: 'departmentName',
        displayName: vm.LabelConstant.TransferStock.ParentWH,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '170',
        allowCellFocus: false
      }, {
        field: 'currentQty',
        displayName: vm.LabelConstant.KitAllocation.Count,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{row.entity.uomClassID === grid.appScope.$parent.vm.MEASUREMENT_TYPES_COUNT.ID ? (COL_FIELD)  : (COL_FIELD | unit)}}</div>',
        width: '150',
        allowCellFocus: false
      }, {
        field: 'currentUnit',
        displayName: vm.LabelConstant.KitAllocation.Units,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{row.entity.uomClassID === grid.appScope.$parent.vm.MEASUREMENT_TYPES_COUNT.ID ? (COL_FIELD)  : (COL_FIELD | unit)}}</div>',
        width: '150',
        allowCellFocus: false
      }, {
        field: 'uomName',
        displayName: 'UOM',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '90',
        allowCellFocus: false
      }, {
        field: 'scrappedQty',
        displayName: 'Scrapped Qty/Count',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="COL_FIELD > 0 || COL_FIELD == 0">{{row.entity.uomClassID === grid.appScope.$parent.vm.MEASUREMENT_TYPES_COUNT.ID ? (COL_FIELD)  : (COL_FIELD | unit)}}</div>',
        width: '150',
        allowCellFocus: false
      }, {
        field: 'scrappedUnit',
        displayName: 'Scrapped Units',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="COL_FIELD > 0 || COL_FIELD == 0">{{row.entity.uomClassID === grid.appScope.$parent.vm.MEASUREMENT_TYPES_COUNT.ID ? (COL_FIELD)  : (COL_FIELD | unit)}}</div>',
        width: '150',
        allowCellFocus: false
      }, {
        field: 'consumedQty',
        displayName: vm.LabelConstant.KitAllocation.ConsumedCount,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="COL_FIELD > 0 || COL_FIELD == 0">{{row.entity.uomClassID === grid.appScope.$parent.vm.MEASUREMENT_TYPES_COUNT.ID ? (COL_FIELD)  : (COL_FIELD | unit)}}</div>',
        width: '150',
        allowCellFocus: false
      }, {
        field: 'consumedUnit',
        displayName: vm.LabelConstant.KitAllocation.ConsumedUnits,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="COL_FIELD > 0 || COL_FIELD == 0">{{row.entity.uomClassID === grid.appScope.$parent.vm.MEASUREMENT_TYPES_COUNT.ID ? (COL_FIELD)  : (COL_FIELD | unit)}}</div>',
        width: '150',
        allowCellFocus: false
      }, {
        field: 'adjustQty',
        displayName: vm.LabelConstant.KitAllocation.AdjustCount,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="COL_FIELD != null">{{row.entity.uomClassID === grid.appScope.$parent.vm.MEASUREMENT_TYPES_COUNT.ID ? (COL_FIELD)  : (COL_FIELD | unit)}}</div>',
        width: '150',
        allowCellFocus: false
      }, {
        field: 'adjustUnit',
        displayName: vm.LabelConstant.KitAllocation.AdjustUnits,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="COL_FIELD != null">{{row.entity.uomClassID === grid.appScope.$parent.vm.MEASUREMENT_TYPES_COUNT.ID ? (COL_FIELD)  : (COL_FIELD | unit)}}</div>',
        width: '150',
        allowCellFocus: false
      }, {
        field: 'reason',
        displayName: 'Remark',
        cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.reason" ng-click="grid.appScope.$parent.vm.showReasonForTransaction(row.entity, $event)">View</md-button>',
        enableFiltering: false,
        enableSorting: false,
        width: '100',
        enableCellEdit: false
      }, {
        field: 'orgQty',
        displayName: vm.LabelConstant.KitAllocation.InitialCount,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{row.entity.uomClassID === grid.appScope.$parent.vm.MEASUREMENT_TYPES_COUNT.ID ? (COL_FIELD)  : (COL_FIELD | unit)}}</div>',
        width: '150',
        allowCellFocus: false
      }, {
        field: 'orgUnit',
        displayName: vm.LabelConstant.KitAllocation.InitialUnits,
        cellTemplate: '<div class="ui-grid-cell-contents  grid-cell-text-right">{{row.entity.uomClassID === grid.appScope.$parent.vm.MEASUREMENT_TYPES_COUNT.ID ? (COL_FIELD)  : (COL_FIELD | unit)}}</div>',
        width: '150',
        allowCellFocus: false
      }, {
        field: 'splitQty',
        displayName: vm.LabelConstant.UMIDManagement.SplitCount,
        cellTemplate: '<div class="ui-grid-cell-contents  grid-cell-text-right" ng-if="COL_FIELD != null">{{row.entity.uomClassID === grid.appScope.$parent.vm.MEASUREMENT_TYPES_COUNT.ID ? (COL_FIELD)  : (COL_FIELD | unit)}}</div>',
        width: '150',
        allowCellFocus: false
      }, {
        field: 'splitUnit',
        displayName: vm.LabelConstant.UMIDManagement.SplitUnits,
        cellTemplate: '<div class="ui-grid-cell-contents  grid-cell-text-right" ng-if="COL_FIELD != null">{{row.entity.uomClassID === grid.appScope.$parent.vm.MEASUREMENT_TYPES_COUNT.ID ? (COL_FIELD)  : (COL_FIELD | unit)}}</div>',
        width: '150',
        allowCellFocus: false
      },
      {
        field: 'splitUID',
        displayName: vm.LabelConstant.UMIDManagement.SplitUMID,
        cellTemplate: '<div class="ui-grid-cell-contents text-left"> \
                        <a tabindex="-1" ng-click="grid.appScope.$parent.vm.goToUMIDDetail(row.entity.splitUID)" class="cm-text-decoration underline cursor-pointer">{{COL_FIELD | uppercase}}</a> \
                        <copy-text ng-if="row.entity.splitUID" label="grid.appScope.$parent.vm.LabelConstant.UMIDManagement.SplitUMID" text="row.entity.splitUID"></copy-text></div>',
        width: '170',
        allowCellFocus: false
      }, {
        field: 'transType',
        displayName: 'Transaction Type',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '150',
        allowCellFocus: false
      }, {
        field: 'actionPerformed',
        displayName: 'Action Performed',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '170',
        allowCellFocus: false
      }, {
        field: 'refTrans',
        displayName: 'Ref. Transaction',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">' +
          '<span ng-if= "!row.entity.refTransID || !row.entity.refTransTable">{{COL_FIELD}}</span >' +
          '<span ng-if= "row.entity.refTransID && row.entity.refTransTable">' +
          '<a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToRefTransactionDetailScreen(row.entity);" tabindex="-1">{{ COL_FIELD }}</a>' +
          '</span>' +
          '</div > ',
        width: '150',
        allowCellFocus: false
      },
      {
        field: 'approvalReason',
        displayName: 'Approved Reason',
        cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.approvalReason" ng-click="grid.appScope.$parent.vm.showApprovalReason(row.entity, $event)">View</md-button>',
        width: '200'
      },
      {
        field: 'deallocatedKitDesc',
        displayName: 'Deallocated Kit',
        cellTemplate: ' <div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '500',
        allowCellFocus: false
      },
      {
        field: 'approvedDate',
        displayName: 'Approved Date',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
        allowCellFocus: false,
        type: 'datetime',
        enableFiltering: false,
        enableSorting: true
      }, {
        field: 'approvedBy',
        displayName: 'Approved By',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        allowCellFocus: false
      },
      {
        field: 'approvedByRole',
        displayName: 'Approved By Role',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true
      },
      {
        field: 'createdByName',
        displayName: 'Modified By',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        allowCellFocus: false
      },
      {
        field: 'updateByRole',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }
    ];

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
      exporterCsvFilename: 'TransferStockHistory.csv',
      hideFilter: true
    };


    function setDataAfterGetAPICall(receivingmaterial, isGetDataDown) {
      if (receivingmaterial && receivingmaterial.data.component) {
        if (!isGetDataDown) {
          vm.sourceData = receivingmaterial.data.component;
          vm.currentdata = vm.sourceData.length;
        }
        else if (receivingmaterial.data.component.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(receivingmaterial.data.component);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        // must set after new data comes
        vm.totalSourceDataCount = receivingmaterial.data.Count;
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

    vm.loadData = () => {
      if (vm.pagingInfo.SortColumns.length === 0) {
        vm.pagingInfo.SortColumns = [['id', 'DESC']];
      }
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = TransferStockFactory.transferStockHistory().query(vm.pagingInfo).$promise.then((receivingmaterial) => {
        vm.sourceData = [];
        if (receivingmaterial.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          setDataAfterGetAPICall(receivingmaterial, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = TransferStockFactory.transferStockHistory().query(vm.pagingInfo).$promise.then((receivingmaterial) => {
        setDataAfterGetAPICall(receivingmaterial, true);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.kitAllocationSourceHeader = [
      {
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
        enableFiltering: false,
        enableSorting: false
      },
      {
        field: 'createdBy',
        displayName: 'Allocated By',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        allowCellFocus: false
      },
      {
        field: 'createdAt',
        displayName: 'Allocated Date',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        allowCellFocus: false,
        type: 'datetime'
      }, {
        field: 'createdbyRole',
        displayName: 'Allocated By Role',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        type: 'StringEquals',
        enableFiltering: true
      },
      {
        field: 'updatedBy',
        displayName: 'Modify By',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        allowCellFocus: false
      },
      {
        field: 'updatedAt',
        displayName: 'Transaction Date',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        allowCellFocus: false,
        type: 'datetime'
      }, {
        field: 'updatedbyRole',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true
      },
      {
        field: 'allocatedToKit',
        displayName: 'Allocated To Kit',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">' +
          '<a tabindex="-1" class= "text-underline cursor-pointer" ng-click="grid.appScope.$parent.vm.allocatedKit(row.entity)" ng-if="row.entity.status == \'A\'">' +
          '{{ COL_FIELD }}' +
          '</a>' +
          '<span ng-if="row.entity.status != \'A\'">{{ COL_FIELD }}</span>' +
          '</div>',
        width: '250',
        allowCellFocus: false
      },
      {
        field: 'custPN',
        displayName: CORE.LabelConstant.MFG.CPN,
        width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
        cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link \
                                    component-id="row.entity.custPNID" \
                                    label="grid.appScope.$parent.vm.LabelConstant.MFG.ID" \
                                    value="row.entity.custPNPIDCode" \
                                    is-copy="true" \
                                    is-mfg="true" \
                                    mfg-label="grid.appScope.$parent.vm.LabelConstant.MFG.MFGPN" \
                                    mfg-value="row.entity.custPN" \
                                    rohs-icon="row.entity.custPNrohsIcon" \
                                    rohs-status="row.entity.custPNrohsName" \
                                    is-copy-ahead-label="true" \
                                    is-search-findchip="false" \
                                    is-search-digi-key="false"></common-pid-code-label-link></div>',
        enableCellEdit: false,
        enableCellEditOnFocus: false,
        allowCellFocus: false
      },
      {
        field: 'statusText',
        displayName: 'Status',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" \
                        ng-class="{\'label-success\':row.entity.status == \'A\',\
                        \'label-warning\':row.entity.status == \'R\',\
                        \'label-primary\':row.entity.status == \'D\'}"> \
                            {{COL_FIELD}}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.KitAllocationStatusDropDown
        },
        ColumnDataType: 'StringEquals',
        enableFiltering: true,
        enableSorting: false,
        width: '100'
      },
      {
        field: 'allocatedQty',
        displayName: vm.LabelConstant.KitAllocation.AllocatedCount,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD || 0}}</div>',
        width: '110',
        allowCellFocus: false
      },
      {
        field: 'convertedAllocatedUnit',
        displayName: vm.LabelConstant.KitAllocation.AllocatedUnits,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
        width: '110',
        allowCellFocus: false
      },
      {
        field: 'consumeQty',
        displayName: vm.LabelConstant.KitAllocation.ConsumedCount,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD || 0}}</div>',
        width: '110',
        allowCellFocus: false
      },
      {
        field: 'convertedConsumeUnit',
        displayName: vm.LabelConstant.KitAllocation.ConsumedUnits,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
        width: '110',
        allowCellFocus: false
      },
      {
        field: 'returnQty',
        displayName: vm.LabelConstant.KitAllocation.ReturnCount,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD || 0}}</div>',
        width: '110',
        allowCellFocus: false
      },
      {
        field: 'convertedReturnUnit',
        displayName: vm.LabelConstant.KitAllocation.ReturnUnits,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
        width: '110',
        allowCellFocus: false
      },
      {
        field: 'roHSApprovalReason',
        displayName: vm.LabelConstant.KitAllocation.RoHSApprovalReason,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>'
          + '<md-tooltip md-direction="top" class="tooltip-multiline" ng-if="row.entity.roHSApprovalReason!=null">{{row.entity.roHSApprovalReason}}</md-tooltip>',
        width: '110',
        allowCellFocus: false
      },
      {
        field: 'roHSApprovedBy',
        displayName: vm.LabelConstant.KitAllocation.RoHSApprovedBy,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        allowCellFocus: false
      },
      {
        field: 'roHSApprovedOn',
        displayName: vm.LabelConstant.KitAllocation.RoHSApprovedOn,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        allowCellFocus: false,
        type: 'datetime'
      },
      {
        field: 'deallocateReason',
        displayName: 'Deallocated Reason',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: 300,
        allowCellFocus: false
      }
    ];

    vm.kitAllocationGridOptions = {
      enablePaging: isEnablePagination,
      enablePaginationControls: isEnablePagination,
      showColumnFooter: false,
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: true,
      multiSelect: false,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: 'KitHistory.csv',
      hideFilter: true
    };

    function setDataAfterGetkitAllocationAPICall(kitAllocationList, isGetDataDown) {
      if (kitAllocationList && kitAllocationList.data.kitAllocationList) {
        if (!isGetDataDown) {
          vm.kitAllocationSourceData = kitAllocationList.data.kitAllocationList;
          vm.kitAllocationCurrentdata = vm.kitAllocationSourceData.length;
        }
        else if (kitAllocationList.data.kitAllocationList.length > 0) {
          vm.kitAllocationSourceData = vm.kitAllocationGridOptions.data = vm.kitAllocationGridOptions.data.concat(kitAllocationList.data.kitAllocationList);
          vm.kitAllocationCurrentdata = vm.kitAllocationGridOptions.currentItem = vm.kitAllocationGridOptions.data.length;
        }
        if (vm.kitAllocationSourceData && vm.kitAllocationSourceData.length > 0) {
          _.each(vm.kitAllocationSourceData, (s) => {
            s.custPNrohsIcon = stringFormat('{0}{1}', vm.rohsImagePath, s.custPNrohsIcon);
          });
        }
        // must set after new data comes
        vm.totalKitAllocationSourceDataCount = kitAllocationList.data.Count;
        if (!vm.kitAllocationGridOptions.enablePaging) {
          if (!isGetDataDown) {
            vm.kitAllocationGridOptions.gridApi.infiniteScroll.resetScroll();
          }
          else {
            vm.kitAllocationGridOptions.gridApi.infiniteScroll.saveScrollPercentage();
          }
        }
        if (!isGetDataDown) {
          vm.kitAllocationGridOptions.clearSelectedRows();
        }
        if (vm.totalKitAllocationSourceDataCount === 0) {
          if (vm.kitAllocationPagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
            vm.isNoDataFoundKitAllocation = false;
            vm.emptyStateKitAllocation = 0;
          }
          else {
            vm.isNoDataFoundKitAllocation = true;
            vm.emptyStateKitAllocation = null;
          }
        }
        else {
          vm.isNoDataFoundKitAllocation = false;
          vm.emptyStateKitAllocation = null;
        }
        $timeout(() => {
          vm.resetKitAllocationSourceGrid();
          if (!isGetDataDown) {
            if (!vm.kitAllocationGridOptions.enablePaging && vm.totalKitAllocationSourceDataCount === vm.kitAllocationCurrentdata) {
              return vm.kitAllocationGridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
            }
          }
          else {
            return vm.kitAllocationGridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalKitAllocationSourceDataCount !== vm.kitAllocationCurrentdata ? true : false);
          }
        });
      }
    }

    vm.kitAllocationLoadData = () => {
      if (vm.kitAllocationPagingInfo.SortColumns.length === 0) {
        vm.kitAllocationPagingInfo.SortColumns = [['updatedAt', 'DESC']];
      }
      BaseService.setPageSizeOfGrid(vm.kitAllocationPagingInfo, vm.kitAllocationGridOptions);
      vm.cgBusyLoading = TransferStockFactory.getUMIDKitAllocationHistory().query(vm.kitAllocationPagingInfo).$promise.then((kitAllocationList) => {
        if (kitAllocationList.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          vm.kitAllocationSourceData = [];
          setDataAfterGetkitAllocationAPICall(kitAllocationList, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.kitAllocationGetDataDown = () => {
      vm.kitAllocationPagingInfo.Page = vm.kitAllocationPagingInfo.Page + 1;
      vm.cgBusyLoading = TransferStockFactory.getUMIDKitAllocationHistory().query(vm.kitAllocationPagingInfo).$promise.then((kitAllocationList) => {
        setDataAfterGetkitAllocationAPICall(kitAllocationList, true);
      }).catch((error) => BaseService.getErrorLog(error));
    };


    vm.wOSourceHeader = [
      {
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
        enableFiltering: false,
        enableSorting: false
      },
      {
        field: 'updatedBy',
        displayName: 'Added By',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        allowCellFocus: false
      },
      {
        field: 'updatedAt',
        displayName: 'Added Date',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        allowCellFocus: false,
        type: 'datetime'
      },
      {
        field: 'woNumber',
        displayName: vm.LabelConstant.Workorder.WO,
        cellTemplate: '<div class="ui-grid-cell-contents text-left"><a tabindex="-1" class="text-underline cursor-pointer color-black" ng-click="grid.appScope.$parent.vm.goToWODetail(row.entity)">{{COL_FIELD}}</a></div>',
        width: '150',
        allowCellFocus: false
      },
      {
        field: 'operatioName',
        displayName: vm.LabelConstant.Operation.Name,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '200',
        allowCellFocus: false
      }
    ];

    vm.wOGridOptions = {
      enablePaging: isEnablePagination,
      enablePaginationControls: isEnablePagination,
      showColumnFooter: false,
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: true,
      multiSelect: false,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: 'WOHistory.csv',
      hideFilter: true
    };

    function setDataAfterGetWOAPICall(wOList, isGetDataDown) {
      if (wOList && wOList.data.woList) {
        if (!isGetDataDown) {
          vm.wOSourceData = wOList.data.woList;
          vm.wOCurrentdata = vm.wOSourceData.length;
        }
        else if (wOList.data.woList.length > 0) {
          vm.wOSourceData = vm.wOGridOptions.data = vm.wOGridOptions.data.concat(wOList.data.woList);
          vm.wOCurrentdata = vm.wOGridOptions.currentItem = vm.wOGridOptions.data.length;
        }
        // must set after new data comes
        vm.totalWOSourceDataCount = wOList.data.Count;
        if (!vm.wOGridOptions.enablePaging) {
          if (!isGetDataDown) {
            vm.wOGridOptions.gridApi.infiniteScroll.resetScroll();
          }
          else {
            vm.wOGridOptions.gridApi.infiniteScroll.saveScrollPercentage();
          }
        }
        if (!isGetDataDown) {
          vm.wOGridOptions.clearSelectedRows();
        }
        if (vm.totalWOSourceDataCount === 0) {
          if (vm.wOPagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
            vm.isNoDataFoundWO = false;
            vm.emptyStateWO = 0;
          }
          else {
            vm.isNoDataFoundWO = true;
            vm.emptyStateWO = null;
          }
        }
        else {
          vm.isNoDataFoundWO = false;
          vm.emptyStateWO = null;
        }
        $timeout(() => {
          vm.resetWOSourceGrid();
          if (!isGetDataDown) {
            if (!vm.wOGridOptions.enablePaging && vm.totalWOSourceDataCount === vm.wOCurrentdata) {
              return vm.wOGridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
            }
          }
          else {
            return vm.wOGridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalWOSourceDataCount !== vm.wOCurrentdata ? true : false);
          }
        });
      }
    }

    vm.wOLoadData = () => {
      if (vm.wOPagingInfo.SortColumns.length === 0) {
        vm.wOPagingInfo.SortColumns = [['updatedAt', 'DESC']];
      }
      BaseService.setPageSizeOfGrid(vm.wOPagingInfo, vm.wOGridOptions);
      vm.cgBusyLoading = TransferStockFactory.getUMIDWorkOrderHistory().query(vm.wOPagingInfo).$promise.then((wOList) => {
        vm.wOSourceData = [];
        if (wOList.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          setDataAfterGetWOAPICall(wOList, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.wOGetDataDown = () => {
      vm.wOPagingInfo.Page = vm.wOPagingInfo.Page + 1;
      vm.cgBusyLoading = TransferStockFactory.getUMIDWorkOrderHistory().query(vm.wOPagingInfo).$promise.then((wOList) => {
        setDataAfterGetWOAPICall(wOList, true);
      }).catch((error) => BaseService.getErrorLog(error));
    };


    vm.cancel = () => {
      $mdDialog.cancel();
    };

    vm.goToWHList = () => {
      BaseService.goToWHList();
    };

    vm.goToBinList = () => {
      BaseService.goToBinList();
    };

    vm.goToUMIDList = () => {
      BaseService.goToUMIDList();
    };

    // Need to manage this for parent and from id
    vm.goToUMIDDetail = (id) => BaseService.goToUMIDDetail(id);

    vm.goToPartList = () => {
      BaseService.goToPartList();
    };

    vm.goToMFGList = () => {
      BaseService.goToManufacturerList();
    };

    vm.goToUOMList = () => {
      BaseService.goToUOMList();
    };

    vm.goToCustomer = (id) => {
      BaseService.goToCustomer(id);
    };

    vm.showReasonForTransaction = (row, ev) => {
      const headerData = [{
        label: vm.LabelConstant.UMIDManagement.UMID,
        value: vm.UIDDet.uid,
        displayOrder: 1,
        labelLinkFn: () => {
          BaseService.goToUMIDList();
        },
        valueLinkFn: vm.goToUMIDDetail,
        valueLinkFnParams: { id: vm.UIDDet.id }
      }];
      const data = {
        title: 'Remark',
        description: row.reason,
        headerData: headerData
      };
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        data
      ).then(() => {

      }, (err) => BaseService.getErrorLog(err));
    };

    vm.allocatedKit = (rowData) => {
      const data = rowData;
      data.refUMIDId = data.refUIDId;
      DialogFactory.dialogService(
        TRANSACTION.ALLOCATED_KIT_CONTROLLER,
        TRANSACTION.ALLOCATED_KIT_VIEW,
        event,
        data).then(() => {
        }, (allocatedKit) => {
          if (allocatedKit) {
            vm.kitAllocationLoadData();
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.goToWODetail = (row) => {
      if (row) {
        BaseService.goToWorkorderDetails(row.woID);
      }
    };

    vm.goToRefTransactionDetailScreen = (row) => {
      if (row && row.refTransID && row.refTransTable === 'packing_slip_material_receive' && (row.transType === 'Supplier RMA - Returned' || row.transType === 'Supplier RMA - Corrected')) {
        BaseService.goToManageSupplierRMA(TRANSACTION.SupplierRMATab.SupplierRMA, row.refTransID);
      }
    };
  }
})();
