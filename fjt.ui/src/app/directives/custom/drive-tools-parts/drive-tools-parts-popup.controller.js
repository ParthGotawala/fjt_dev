(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .controller('DriveToolsPartsPopupController', DriveToolsPartsPopupController);

  /** @ngInject */
  function DriveToolsPartsPopupController(data, CORE, USER, BaseService, $stateParams, BOMFactory, $mdDialog,
    $timeout, RFQTRANSACTION, DialogFactory, WorkorderFactory, $state, ComponentFactory) {
    const vm = this;
    vm.isHideDelete = true;
    vm.partID = data.partID;
    vm.DateFormat = _dateTimeDisplayFormat;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.COMPONENT;
    vm.LabelConstant = CORE.LabelConstant;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;
    vm.sourceHeader = [
      {
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
        enableFiltering: false,
        enableSorting: false,
        pinnedLeft: true
      },
      {
        field: 'assyPID',
        displayName: 'Assy ID',
        enableCellEdit: false,
        width: '250',
        enableGrouping: true,
        grouping: {
          groupPriority: 0
        },
        cellTemplate: '<div class="ui-grid-cell-contents" ng-if="row.groupHeader">{{COL_FIELD}}</div>'
      },
      {
        field: 'lineID',
        displayName: 'Item',
        enableCellEdit: false,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
        width: '100',
        ColumnDataType: 'Number'
      },
      {
        field: 'qpa',
        displayName: 'QPA',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
        enableCellEdit: false,
        width: '100'
      },
      {
        field: 'refDesig',
        displayName: vm.LabelConstant.BOM.REF_DES,
        enableCellEdit: false,
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        width: '170'
      },
      {
        field: 'partMfgCode',
        displayName: vm.LabelConstant.MFG.MFG,
        enableCellEdit: false,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '150'
      },
      {
        field: 'partMfgPN',
        displayName: vm.LabelConstant.MFG.MFGPN,
        cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link component-id="row.entity.partID"\
                                             value="COL_FIELD"\
                                             is-copy="COL_FIELD ? true:false"\
                                             rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.partRohsIcon"\
                                             rohs-status="row.entity.partRohsStatus"\
                                             is-search-digi-key="COL_FIELD ? true:false"\
                                             is-custom-part="row.entity.partIsCustom"\
                                             redirection-disable="false">\
                      </common-pid-code-label-link></div>',
        enableCellEdit: false,
        width: '200'
      },
      {
        field: 'drivePartMfgCode',
        displayName: 'Require Drive Tools' + vm.LabelConstant.MFG.MFG,
        enableCellEdit: false,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '160'
      },
      {
        field: 'drivePartMfgPN',
        displayName: 'Require Drive Tools' + vm.LabelConstant.MFG.MFGPN,
        cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link component-id="row.entity.drivePartID"\
                                             value="COL_FIELD"\
                                             is-copy="COL_FIELD ? true:false"\
                                             rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.drivePartRohsIcon"\
                                             rohs-status="row.entity.drivePartRohsStatus"\
                                             is-search-digi-key="COL_FIELD ? true:false"\
                                             is-custom-part="row.entity.drivePartIsCustom"\
                                             redirection-disable="false">\
                      </common-pid-code-label-link></div>',
        enableCellEdit: false,
        width: '220'
      }, {
        field: 'stock',
        displayName: 'Available Stock',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
        enableCellEdit: false,
        width: '100'
      }, {
        field: 'price',
        displayName: 'Price $',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
        enableCellEdit: false,
        width: '150'
      }
    ];

    const initPageInfo = () => {
      vm.pagingInfo = {
        partID: vm.partID,
        narrative: vm.narrative,
        Page: CORE.UIGrid.Page(),
        SortColumns: [['assyID', 'DESC']],
        SearchColumns: []
      };
    };

    initPageInfo();
    getComponentdetailByID();
    function getComponentdetailByID() {
      vm.cgBusyLoading = ComponentFactory.getComponentByID().query({ id: vm.partID }).$promise.then((response) => {
        vm.selectedComponent = {
          id: vm.partID,
          MFGPN: response.data.mfgPN,
          MFG: response.data.mfgCodemst.mfgCode,
          CustomerID: response.data.mfgCodemst.id,
          Customer: response.data && response.data.mfgCodemst && response.data.mfgCodemst.mfgCodeName,
          Component: stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, response.data.mfgCodemst.mfgCode, response.data.mfgPN),
          RoHSStatusIcon: response.data.rfq_rohsmst !== null ? stringFormat('{0}{1}{2}', CORE.WEB_URL, USER.ROHS_BASE_PATH, response.data.rfq_rohsmst.rohsIcon) : null,
          RoHSName: response.data.rfq_rohsmst !== null ? response.data.rfq_rohsmst.name : null,
          PIDCode: response.data.PIDCode
        };
        bindHeaderData();
      }).catch((error) => BaseService.getErrorLog(error));
    }
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
      exporterCsvFilename: 'Parts Require Drive Tools.csv',
      enableGrouping: true
    };

    function setDataAfterGetAPICall(assyDriveTools, isGetDataDown) {
      if (assyDriveTools && assyDriveTools.data.assyDriveToolslist) {
        if (!isGetDataDown) {
          vm.sourceData = assyDriveTools.data.assyDriveToolslist;
          vm.currentdata = vm.sourceData.length;
        }
        else if (assyDriveTools.data.assyDriveToolslist.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(assyDriveTools.data.assyDriveToolslist);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        // must set after new data comes
        vm.totalSourceDataCount = assyDriveTools.data.Count;
        if (vm.totalSourceDataCount === 0) {
          if (vm.pagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
            vm.isNoDataFound = false;
            vm.emptyState = 0;
          }
          else {
            if (vm.isAdvanceSearch) {
              vm.isNoDataFound = false;
              vm.emptyState = 0;
            } else {
              vm.isNoDataFound = true;
              vm.emptyState = 0;
            }
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

    /* retrieve bom changes history list*/
    vm.loadData = () => {
      vm.pagingInfo.partID = vm.partID;
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = BOMFactory.getAssyDriveToolsList().query(vm.pagingInfo).$promise.then((assyDriveTools) => {
        if (assyDriveTools.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          setDataAfterGetAPICall(assyDriveTools, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.pagingInfo.partID = vm.partID;
      vm.cgBusyLoading = BOMFactory.getAssyDriveToolsList().query(vm.pagingInfo).$promise.then((assyDriveTools) => {
        setDataAfterGetAPICall(assyDriveTools, true);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.updateRecord = (row, ev) => {
      var data = {
        narrative: row.entity.narrative,
        time: row.entity.time,
        id: row.entity.id
      };
      DialogFactory.dialogService(
        RFQTRANSACTION.BOM_NARRATIVE_HISTORY_POPUP_CONTROLLER,
        RFQTRANSACTION.BOM_NARRATIVE_HISTORY_POPUP_VIEW,
        ev,
        data).then(() => {
          BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.clearFilter = () => {
      if (!vm.gridOptions.enablePaging) {
        initPageInfo();
      }
      vm.loadData();
    };

    vm.close = () => {
      $mdDialog.cancel();
    };


    //go to manage part number
    vm.goToAssyMaster = () => {
        BaseService.goToComponentDetailTab(null, vm.selectedComponent.id);
      return false;
    };

    //go to assy list
    vm.goToAssyList = () => {
        BaseService.goToPartList();
      return false;
    };

    // go to customer
    vm.goToCustomer = () => {
      BaseService.goToCustomer(vm.selectedComponent.CustomerID);
      return false;
    };

    //redirect to customer list
    vm.goToCustomerList = () => {
      BaseService.goToCustomerList();
      return false;
    };

    function bindHeaderData() {
      vm.headerdata = [];
      vm.headerdata.push({
        label: vm.LabelConstant.Customer.Customer,
        value: vm.selectedComponent.Customer,
        displayOrder: 1,
        labelLinkFn: vm.goToCustomerList,
        valueLinkFn: vm.goToCustomer,
        valueLinkFnParams: null,
        isCopy: false,
        copyParams: null,
        imgParms: null
      }, {
        label: vm.LabelConstant.Assembly.ID,
        value: vm.selectedComponent.PIDCode,
        displayOrder: 1,
        labelLinkFn: vm.goToAssyList,
        valueLinkFn: vm.goToAssyMaster,
        isCopy: true,
        isAssy: true,
        imgParms: {
          imgPath: vm.selectedComponent.RoHSStatusIcon,
          imgDetail: vm.selectedComponent.RoHSName
        }
      }, {
        label: vm.LabelConstant.Assembly.MFGPN,
        value: vm.selectedComponent.MFGPN,
        displayOrder: 1,
        labelLinkFn: vm.goToAssyList,
        valueLinkFn: vm.goToAssyMaster,
        isCopy: true,
        isAssy: true,
        imgParms: {
          imgPath: vm.selectedComponent.RoHSStatusIcon,
          imgDetail: vm.selectedComponent.RoHSName
        }
      });
    }
  }
})();
