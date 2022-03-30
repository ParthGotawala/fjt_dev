(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('FeederVerificationHistoryPopupController', FeederVerificationHistoryPopupController);

  /** @ngInject */
  function FeederVerificationHistoryPopupController($timeout, $mdDialog, data, $state, BaseService, $scope, CORE, USER, WORKORDER, TRAVELER, WorkorderTransactionUMIDFactory) {
    const vm = this;
    vm.data = data;
    vm.isHideDelete = true;
    vm.isNoDataFound = true;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = CORE.LabelConstant;
    vm.EmptyMesssage = TRAVELER.TRAVELER_EMPTYSTATE.FEEDER_VERIFICATION_HISTORY;
    let feederMappingObj = angular.copy(WORKORDER.FEEDER_COLUMN_MAPPING);
    vm.ScanStatusOptionsGridHeaderDropdown = CORE.ScanStatusOptionsGridHeaderDropdown;
    vm.DefaultDateFormat = _dateTimeDisplayFormat;
    let rohsIcon = vm.data.rohsIcon;
    vm.data.rohsIcon = stringFormat('{0}{1}', vm.rohsImagePath, vm.data.rohsIcon);
    vm.FeederText = CORE.TransactionType.Feeder;

    /*
     * Author :  Vaibhav Shah
     * Purpose : Work Order List
     */
    vm.goToWorkorderList = (data) => {
      BaseService.goToWorkorderList();
      return false;
    }
    vm.goToWorkorderDetails = () => {
      BaseService.goToWorkorderDetails(vm.data.woID);
      return false;
    }
    /*Used to goto equipment list*/
    vm.goToEquipmentList = () => {
      BaseService.goToEquipmentWorkstationList();
    }

    /*Move to equipment page*/
    vm.goToManageEquipmentWorkstation = (equip) => {
      BaseService.goToManageEquipmentWorkstation(equip.eqpID);
    }

    vm.headerdata = [];
    if (vm.data.equipment) {
      // vm.headerdata.push({ label: 'Equipment Name', value: vm.data.equipment.assetName, displayOrder: 1 });
      vm.headerdata.push({
        label: 'Equipment Name', value: vm.data.equipment.assetName, displayOrder: 1, labelLinkFn: vm.goToEquipmentList,
        valueLinkFn: vm.goToManageEquipmentWorkstation,
        valueLinkFnParams: { eqpID: vm.data.equipment.eqpID },
        isCopy: false
      });
    }

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

    let initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['updatedAt', 'DESC']],
        SearchColumns: [],
        woTransUMIDDetID: vm.data.woTransUMIDDetID,
        transactionType: vm.data.transactionType
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
        enableCellEdit: false,
        visible: vm.data.transactionType == CORE.TransactionType.Feeder
      },
      {
        field: 'umid',
        displayName: 'UMID',
        width: 150,
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        enableCellEdit: false,
        allowCellFocus: true
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
                                        is- search - digi - key="true" \
                                        is-search-findchip="true" \></div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
        allowCellFocus: true
      },
      {
        field: 'verifiedBy',
        displayName: 'Verified By',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        enableCellEdit: false,
      },
      {
        field: 'verifiedOn',
        displayName: 'Verified On',
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
        enableCellEdit: false,
        width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
        type: 'datetime',
        enableSorting: true,
        enableFiltering: false,
      },
      {
        field: 'scannedBy',
        displayName: 'Added By',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        enableCellEdit: false,
      }, {
        field: 'updatedAt',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
        type: 'datetime',
        enableSorting: true,
        enableFiltering: false,
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
      exporterCsvFilename: 'Feeder Verification History.csv',
    };

    /* retrieve feeder details list*/
    vm.loadData = () => {
      let index = 0;
      vm.cgBusyLoading = WorkorderTransactionUMIDFactory.feeder_verification_transaction(vm.pagingInfo).query({
        id: null
      }).$promise.then((response) => {
        if (response && response.data && response.data.feeder) {
          vm.sourceData = response.data.feeder;
          _.each(vm.sourceData, (s) => {
            s.index = index + 1;
            s.rohsIcon = stringFormat('{0}{1}', vm.rohsImagePath, s.rohsIcon);
          });
          vm.totalSourceDataCount = response.data.Count;
          if (!vm.gridOptions.enablePaging) {
            vm.currentdata = vm.sourceData ? vm.sourceData.length : null;
            vm.gridOptions.gridApi.infiniteScroll.resetScroll();
          }
          vm.gridOptions.clearSelectedRows();
          if (vm.totalSourceDataCount == 0) {
            if (vm.pagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
              vm.isNoDataFoundFeederVerification = false;
              vm.emptyState = 0;
            }
            else {
              vm.isNoDataFoundFeederVerification = true;
              vm.emptyState = null;
            }
          }
          else {
            vm.isNoDataFoundFeederVerification = false;
            vm.emptyState = null;
          }
          $timeout(() => {
            vm.resetSourceGrid();
            if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount == vm.currentdata) {
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
            }
          });
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    /* load more data on mouse scroll */
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = WorkorderTransactionUMIDFactory.feeder_verification_transaction(vm.pagingInfo).query({
        id: null, woTransUMIDDetID: vm.data.woTransUMIDDetID
      }).query().$promise.then((response) => {
        vm.sourceData = vm.sourceData.concat(response.data.feeder);
        vm.currentdata = vm.sourceData ? vm.sourceData.length : null;
        vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
        $timeout(() => {
          vm.resetSourceGrid();
          return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount != vm.currentdata ? true : false);
        });
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    vm.cancel = () => {
      $mdDialog.cancel();
    };

    /* called for max length validation */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    }
  }
})();
