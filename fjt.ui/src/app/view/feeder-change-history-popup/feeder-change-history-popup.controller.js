(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('FeederChangeHistoryController', FeederChangeHistoryController);

  /** @ngInject */
  function FeederChangeHistoryController($timeout, $mdDialog, data, $state, BaseService, $scope, CORE, USER, WORKORDER, TRAVELER, WorkorderTransactionUMIDFactory) {
    const vm = this;
    vm.data = data;
    vm.isHideDelete = true;
    vm.isNoDataFound = true;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = CORE.LabelConstant;
    vm.EmptyMesssage = TRAVELER.TRAVELER_EMPTYSTATE.FEEDER_CHANGE_HISTORY;
    const feederMappingObj = angular.copy(WORKORDER.FEEDER_COLUMN_MAPPING);
    vm.ScanStatusOptionsGridHeaderDropdown = CORE.ScanStatusOptionsGridHeaderDropdown;
    vm.DefaultDateFormat = _dateTimeDisplayFormat;


    /*
     * Author :  Vaibhav Shah
     * Purpose : Work Order List
     */
    vm.goToWorkorderList = (data) => {
      BaseService.goToWorkorderList();
      return false;
    };
    vm.goToWorkorderDetails = () => {
      BaseService.goToWorkorderDetails(vm.data.woID);
      return false;
    };

    /*Used to goto equipment list*/
    vm.goToEquipmentList = () => {
      BaseService.goToEquipmentWorkstationList();
    }

    /*Move to equipment page*/
    vm.goToManageEquipmentWorkstation = (equip) => {
      BaseService.goToManageEquipmentWorkstation(equip.eqpID);
    };

    vm.headerdata = [];
    // vm.headerdata.push({ label: 'Equipment Name', value: vm.data.equipment.assetName, displayOrder: 1 });
    vm.headerdata.push({
      label: 'Equipment Name', value: vm.data.equipment.assetName, displayOrder: 1, labelLinkFn: vm.goToEquipmentList,
      valueLinkFn: vm.goToManageEquipmentWorkstation,
      valueLinkFnParams: { eqpID: vm.data.equipment.eqpID },
      isCopy: false
    });
    vm.headerdata.push({
      label: vm.LabelConstant.Workorder.WO, value: vm.data.woNumber, displayOrder: 2, labelLinkFn: vm.goToWorkorderList,
      valueLinkFn: vm.goToWorkorderDetails,
      valueLinkFnParams: { woID: vm.data.woID },
      isCopy: false
    });
    vm.headerdata.push({
      label: vm.LabelConstant.Workorder.Version, value: vm.data.woVersion, displayOrder: 3
    });

    // operation name
    vm.opName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, vm.data.opName, vm.data.opNumber);
    vm.data.rohsIcon = stringFormat('{0}{1}', vm.rohsImagePath, vm.data.rohsIcon);

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['updatedAt', 'DESC']],
        SearchColumns: [],
        pageName: CORE.PAGENAME_CONSTANT[17].PageName,
        woOpEqpID: vm.data.woOpEqpID,
        eqpFeederID: vm.data.eqpFeederID
      };
    };

    initPageInfo();

    vm.sourceHeader = [
      {
        field: '#',
        width: '70',
        cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
        enableFiltering: false,
        enableSorting: false,
        enableCellEdit: false
      },
      {
        field: 'feederLocation',
        displayName: feederMappingObj.Feeder.Name,
        width: 130,
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        enableCellEdit: false
      },
      {
        field: 'umid',
        displayName: 'UMID',
        width: 150,
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        enableCellEdit: false
      }, {
        field: 'mfgPN',
        displayName: feederMappingObj.PID.Name,
        enableCellEdit: false,
        cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link  ng-class="{\'text-double-line-through\':row.entity.restrictPermission}"  ng-style="{\'text-decoration-line\':row.entity.isRestricted?\'line-through\':\'\'}"\
                                        component-id="row.entity.mfgPNID" \
                                        label="grid.appScope.$parent.vm.LabelConstant.MFG.PID" \
                                        value="row.entity.PIDCode" \
                                        is-copy="true" \
                                        rohs-icon="row.entity.rohsIcon" \
                                        rohs-status="row.entity.rohsName"\
                                        is-custom-part="row.entity.isCustom" \
                                        is-search-digi-key="true" \
                                        is-search-findchip="true" \><div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN
      },
      {
        field: 'changedOn',
        displayName: 'Changed On',
        width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
        enableCellEdit: false,
        type: 'datetime'
      },
      {
        field: 'changedBy',
        displayName: 'Changed By',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        enableCellEdit: false
      },
      {
        field: 'scannedBy',
        displayName: 'Added By',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        enableCellEdit: false
      }, {
        field: 'updatedAt',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
        type: 'datetime',
        enableSorting: true,
        enableFiltering: false
      }
    ];

    vm.gridOptions = {
      showColumnFooter: false,
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: true,
      multiSelect: false,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      enableCellEdit: false,
      enableCellEditOnFocus: true,
      exporterCsvFilename: 'FeederChangeHistory.csv'
    };

    /* retrieve feeder details list*/
    vm.loadData = () => {
      vm.cgBusyLoading = WorkorderTransactionUMIDFactory.feeder_change_transaction(vm.pagingInfo).query({
        id: null
      }).$promise.then((response) => {
        if (response && response.data && response.data.feeder) {
          vm.sourceData = response.data.feeder;
          _.each(vm.sourceData, (s) => {
            s.rohsIcon = stringFormat('{0}{1}', vm.rohsImagePath, s.rohsIcon);
          });
          vm.totalSourceDataCount = response.data.Count;
          if (!vm.gridOptions.enablePaging) {
            vm.currentdata = vm.sourceData ? vm.sourceData.length : null;
            vm.gridOptions.gridApi.infiniteScroll.resetScroll();
          }
          vm.gridOptions.clearSelectedRows();
          if (vm.totalSourceDataCount === 0) {
            if (vm.pagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
              vm.isNoDataFoundChangeHistory = false;
              vm.emptyState = 0;
            }
            else {
              vm.isNoDataFoundChangeHistory = true;
              vm.emptyState = null;
            }
          }
          else {
            vm.isNoDataFoundChangeHistory = false;
            vm.emptyState = null;
          }
          $timeout(() => {
            vm.resetSourceGrid();
            if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
            }
          });
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* load more data on mouse scroll */
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = WorkorderTransactionUMIDFactory.feeder_change_transaction(vm.pagingInfo).query({
        id: null, woOpEqpID: vm.data.woOpEqpID, eqpFeederID: vm.data.eqpFeederID
      }).query().$promise.then((response) => {
        vm.sourceData = vm.sourceData.concat(response.data.feeder);
        vm.currentdata = vm.sourceData ? vm.sourceData.length : null;
        vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
        $timeout(() => {
          vm.resetSourceGrid();
          return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount != vm.currentdata ? true : false);
        });
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.cancel = () => {
      $mdDialog.cancel();
    };

    /* called for max length validation */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    };
  }
})();
