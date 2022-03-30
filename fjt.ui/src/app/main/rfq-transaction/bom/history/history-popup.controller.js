(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .controller('RFQAssemblyHistoryController', RFQAssemblyHistoryController);

  /** @ngInject */
  function RFQAssemblyHistoryController(data, CORE, USER, BaseService, $stateParams, BOMFactory, $mdDialog,
    $timeout, RFQTRANSACTION, DialogFactory, WorkorderFactory, $state, ComponentFactory) {
    const vm = this;
    vm.ViewDiffOfChange = true;
    vm.isHideDelete = true;
    vm.isUpdatable = data.narrative;
    vm.partID = data.partID;
    vm.narrative = data.narrative;
    vm.title = data.title;
    vm.assemblyNumber = data.assemblyNumber;
    vm.assemblyRev = data.assemblyRev;
    vm.setScrollClass = 'gridScrollHeight_Bom';
    vm.itemID = data.itemID;
    vm.DateFormat = _dateTimeDisplayFormat;
    vm.LabelConstant = CORE.LabelConstant;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;

    const searchColumn = {
      ColumnDataType: 'StringEquals',
      ColumnName: 'lineID',
      SearchString: vm.itemID ? vm.itemID.toString() : null
    };

    vm.sourceHeader = [
      {
        field: 'Action',
        cellClass: 'gridCellColor',
        displayName: 'Action',
        width: '100',
        cellTemplate: '<grid-action-view grid="grid" row="row"></grid-action-view>',
        enableFiltering: false,
        enableSorting: false,
        exporterSuppressExport: true
      },
      {
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
        enableFiltering: false,
        enableSorting: false
      },
      {
        field: 'changeVersion',
        displayName: 'Changed Version',
        enableCellEdit: false,
        width: '150'
      },
      {
        field: 'lineID',
        displayName: 'Item',
        enableCellEdit: false,
        width: '100',
        ColumnDataType: 'Number'
      },
      {
        field: 'mfgcode',
        displayName: vm.LabelConstant.MFG.MFG,
        enableCellEdit: false,
        width: '220',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                                            <a class="cm-text-decoration underline" ng-if="row.entity.mfgCodeID > 0"\
                                                ng-click="grid.appScope.$parent.vm.editManufacturer(row.entity.mfgCodeID, $event);"\
                                                tabindex="-1">({{row.entity.mfgMasterCode}}) {{COL_FIELD}}</a>\
                                            <span ng-if="row.entity.mfgCodeID <= 0">{{COL_FIELD}}</span>\
                                        </div>',
        allowCellFocus: false
      },
      {
        field: 'mfgPN',
        displayName: vm.LabelConstant.MFG.MFGPN,
        enableCellEdit: false,
        width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
        cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link component-id="row.entity.mfgPNID"\
                                             label="grid.appScope.$parent.vm.LabelConstant.MFG.MFGPN"\
                                             value="COL_FIELD"\
                                             is-copy="true"\
                                             rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.rohsIcon"\
                                             rohs-status="row.entity.rohsComplientConvertedValue"\
                                             is-search-digi-key="row.entity.mfgPN ? true : false"\
                                             is-supplier="false"\
                                             is-custom-part="row.entity.isCustom"\
                                             cust-part-number="row.entity.custAssyPN"\
                                             restrict-use-permanently="row.entity.restrictUsePermanently" \
                                             restrict-use-with-permission="row.entity.restrictUSEwithpermission" \
                                             restrict-packaging-use-permanently="row.entity.restrictPackagingUsePermanently" \
                                             restrict-packaging-use-with-permission="row.entity.restrictPackagingUseWithpermission" \
                                             redirection-disable="row.entity.mfgPNID ? false : true">\
                      </common-pid-code-label-link></div>',
        allowCellFocus: false
      },
      {
        field: 'columnName',
        displayName: 'BOM Attributes',
        enableCellEdit: false,
        width: '220'
      },
      {
        field: 'oldValue',
        displayName: 'Last Value',
        //cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.oldValue.length > 15 ? (row.entity.oldValue | htmlToPlaintext | limitTo: 15) + " ..." : row.entity.oldValue | htmlToPlaintext}}</div>',
        enableCellEdit: false,
        visible: !vm.narrative,
        width: '200'
      }, {
        field: 'newValue',
        displayName: 'New Value',
        //cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.newValue.length > 15 ? (row.entity.newValue | htmlToPlaintext | limitTo: 15) + " ..." : row.entity.newValue | htmlToPlaintext}}</div>',
        enableCellEdit: false,
        visible: !vm.narrative,
        width: '200'
      }, {
        field: 'description',
        displayName: 'Description',
        cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
          '<span class="cursor-pointer bom-header-wrap" ng-bind-html="row.entity.description"></span> &nbsp;' +
          '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.description && row.entity.description !== \'-\'" ng-click="grid.appScope.$parent.vm.showLinePSDescriptionPopUp(row.entity, $event)">' +
          '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
          '<md-tooltip>View</md-tooltip>' +
          '</button>' +
          '</div>',
        width: '300',
        enableCellEdit: false,
        type: 'html'
      }, {
        field: 'narrative',
        displayName: 'Narrative',
        cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.narrative" ng-click="grid.appScope.$parent.vm.showNarrativeInfo(row.entity, $event)"> \
                                   View \
                                </md-button>',
        enableCellEdit: false,
        enableFiltering: false,
        enableSorting: false,
        exporterSuppressExport: true,
        visible: vm.narrative,
        width: '120'
      }, {
        field: 'narrativeTime',
        displayName: 'Narrative Time (HH:mm)',
        enableCellEdit: false,
        visible: vm.narrative,
        enableFiltering: false,
        enableSorting: false,
        width: '150'
      }, {
        field: 'createdAt',
        displayName: 'Modified Date',
        cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.createdAt | date:grid.appScope.$parent.vm.DateFormat}}</div>',
        enableCellEdit: false,
        enableFiltering: false,
        type: 'datetime',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE
      }, {
        field: 'CreatedUser',
        displayName: 'Modified By',
        enableCellEdit: false,
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY
      }
    ];

    const initPageInfo = () => {
      vm.pagingInfo = {
        partID: vm.partID,
        narrative: vm.narrative,
        Page: CORE.UIGrid.Page(),
        SortColumns: [['ID', 'DESC']],
        SearchColumns: []
      };
    };
    // show description for line level comment
    vm.showLinePSDescriptionPopUp = (object, ev) => {
      const description = object && object.description ? angular.copy(object.description).replace(/\r/g, '<br/>') : null;
      const obj = {
        title: 'Description',
        description: description
      };
      openCommonDescriptionPopup(ev, obj);
    };

    const openCommonDescriptionPopup = (ev, data) => {
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        data).then(() => {
        }, (err) => BaseService.getErrorLog(err));
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
          RoHSStatusIcon: response.data.rfq_rohsmst !== null ? stringFormat(CORE.RoHSImageFormat, CORE.WEB_URL, USER.ROHS_BASE_PATH, response.data.rfq_rohsmst.rohsIcon) : null,
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
      exporterCsvFilename: vm.narrative ? 'R&D Activity.csv' : 'Assembly BOM Changes Version History.csv'
    };


    function setDataAfterGetAPICall(assyChangeHistory, isGetDataDown) {
      if (assyChangeHistory && assyChangeHistory.data.assemblyLogList) {
        if (!isGetDataDown) {
          vm.sourceData = assyChangeHistory.data.assemblyLogList;
          vm.currentdata = vm.sourceData.length;
        }
        else if (assyChangeHistory.data.assemblyLogList.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(assyChangeHistory.data.assemblyLogList);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        if (vm.narrative) {
          vm.BindTotalSumHeader();
        }
        // must set after new data comes
        vm.totalSourceDataCount = assyChangeHistory.data.Count;
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
      if (vm.itemID && vm.pagingInfo) {
        vm.pagingInfo.SearchColumns.push(searchColumn);
      }
      vm.pagingInfo.page = vm.pagingInfo.Page ? vm.pagingInfo.Page : 1;
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.pagingInfo.partID = vm.partID;
      vm.cgBusyLoading = BOMFactory.getBOMHistory().query(vm.pagingInfo).$promise.then((assyChangeHistory) => {
        if (assyChangeHistory.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          setDataAfterGetAPICall(assyChangeHistory, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getDataDown = () => {
      vm.pagingInfo.page = vm.pagingInfo.page + 1;
      vm.pagingInfo.partID = vm.partID;
      vm.cgBusyLoading = BOMFactory.getBOMHistory().query(vm.pagingInfo).$promise.then((assyChangeHistory) => {
        setDataAfterGetAPICall(assyChangeHistory, true);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.updateRecord = (row, ev) => {
      const data = {
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
        }, (error) => BaseService.getErrorLog(error));
    };

    /* Open popup for display difference of entry change */
    vm.openDifferenceOfChange = (row, $event) => {
      const data = {
        Colname: row.entity.columnName,
        Oldval: row.entity.oldValue,
        Newval: row.entity.newValue,
        Tablename: row.entity.tableName,
        RefTransID: row.entity.refTransID
      };

      DialogFactory.dialogService(
        RFQTRANSACTION.DIFFERENCE_OF_BOM_CHANGE_POPUP_CONTROLLER,
        RFQTRANSACTION.DIFFERENCE_OF_BOM_CHANGE_POPUP_VIEW,
        $event,
        data).then(() => {
        }, () => {
        }, (error) => BaseService.getErrorLog(error));
    };

    vm.editManufacturer = (mfgcodeID, $event) => {
      if (!mfgcodeID || mfgcodeID <= 0) {
        return;
      }
      const data = {
        id: mfgcodeID,
        mfgType: CORE.MFG_TYPE.MFG,
        isUpdatable: true
      };
      DialogFactory.dialogService(
        CORE.MANAGE_MFGCODE_MODAL_CONTROLLER,
        CORE.MANAGE_MFGCODE_MODAL_VIEW,
        $event,
        data).then(() => {
        }, () => {
        }, (error) => BaseService.getErrorLog(error));
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
        displayOrder: 2,
        labelLinkFn: vm.goToCustomerList,
        valueLinkFn: vm.goToCustomer,
        valueLinkFnParams: null,
        isCopy: false,
        copyParams: null,
        imgParms: null
      }, {
        label: vm.LabelConstant.Assembly.ID,
        value: vm.selectedComponent.PIDCode,
        displayOrder: 3,
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
        displayOrder: 4,
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

    vm.BindTotalSumHeader = () => {
      const totalTimeInSec = (_.sumBy(vm.sourceData, (o) => o.time ? o.time : 0) * 60);
      const totalTime = _.find(vm.headerdata, { displayOrder: 1 });
      _.each(vm.sourceData, (item) => {
        if (item && item.time) {
          item.narrativeTime = convertDisplayTime(item.time * 60);
        }
      });
      if (totalTime) {
        totalTime.value = vm.secondsToTime(totalTimeInSec);
      }
      else {
        vm.headerdata.push({ label: vm.LabelConstant.Traveler.Totaltime, value: vm.secondsToTime(totalTimeInSec), displayOrder: 1 });
      }
    };

    vm.secondsToTime = (time) => {
      if (time === 0) {
        return secondsToTime(time, true);
      } else {
        return time ? secondsToTime(time, true) : '-';
      }
    };

    /* Show Narrative*/
    vm.showNarrativeInfo = (object, ev) => {
      const obj = {
        title: 'Narrative',
        description: object.narrative,
        name: object.columnName
      };
      const data = obj;
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        data).then(() => {
          BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
        }, (error) => BaseService.getErrorLog(error));
    };
    /* Ends */
  }
})();
