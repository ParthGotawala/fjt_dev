(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('ExternalApiConfigurationController', ExternalApiConfigurationController);

  /** @ngInject */
  function ExternalApiConfigurationController($mdDialog, $scope, $timeout, CORE,
    data, BaseService, DialogFactory, SettingsFactory, PartCostingFactory) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.headerdata = [
      {
        label: CORE.LabelConstant.DK_CURRENT_VERSION,
        value: _DkVersion,
        displayOrder: 1,
        labelLinkFn: null,
        valueLinkFn: null,
        valueLinkFnParams: null,
        isCopy: false,
        copyParams: null,
        imgParms: null
      }];
    vm.isHideDelete = true;
    vm.cancel = () => {
      if (vm.isdirty) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
          canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            BaseService.currentPageFlagForm = [];
            $mdDialog.cancel();
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        $mdDialog.cancel();
      }
    };


    //paging details for grid
    vm.pagingInfo = {
      Page: CORE.UIGrid.Page(),
      SortColumns: [['appID', 'ASC']],
      SearchColumns: []
    };
    vm.isdirty = false;
    //set grid option for action with ui grid
    vm.gridOptions = {
      enableRowSelection: false,
      showColumnFooter: false,
      showGridFooter: false,
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      multiSelect: false,
      filterOptions: vm.pagingInfo.SearchColumns,
      enableCellEdit: true,
      enablePaging: false,
      enableCellEditOnFocus: true,
      exporterCsvFilename: 'External Api Configuration.csv',
      exporterMenuCsv: true,
      enableGrouping: false,
      enableGridMenu: true
    };


    //set header for ui grid
    vm.sourceHeader = [
      {
        field: '#',
        width: '50',
        cellTemplate: '<div class="ui-grid-cell-contents"  ng-disabled="row.Entity.isdisable"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
        enableFiltering: false,
        enableSorting: false,
        enableCellEdit: false,
        allowCellFocus: false,
        enableHiding: false,
        maxWidth: '80',
        pinnedLeft: false
      },
      {
        field: 'Version',
        displayName: 'Version',
        cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
        width: '100',
        enableFiltering: false,
        allowCellFocus: false,
        enableSorting: false,
        enableHiding: false,
        enableCellEdit: false,
        maxWidth: '200',
        pinnedLeft: false
      },
      {
        field: 'appID',
        displayName: 'Application',
        width: '200',
        cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
        enableFiltering: false,
        enableSorting: true,
        enableCellEdit: false,
        enableHiding: false,
        ColumnDataType: 'Number',
        maxWidth: '250',
        pinnedLeft: false
      },
      {
        field: 'clientID',
        displayName: 'Client ID' + CORE.Modify_Grid_column_Allow_Change_Message,
        width: '350',
        cellTemplate: '<div class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
        enableFiltering: true,
        enableSorting: true,
        enableHiding: false,
        maxWidth: '450'
      },
      {
        field: 'secretID',
        displayName: 'Secret ID' + CORE.Modify_Grid_column_Allow_Change_Message,
        width: '350',
        cellTemplate: '<div class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
        enableFiltering: true,
        enableSorting: true,
        enableHiding: false,
        maxWidth: '550'
      },
      {
        field: 'specialPriceCustomerID',
        displayName: 'Customer ID' + CORE.Modify_Grid_column_Allow_Change_Message,
        cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
        width: '130',
        enableFiltering: false,
        allowCellFocus: false,
        enableSorting: true,
        enableHiding: false,
        maxWidth: '200'
      },
      {
        field: 'perCallRecordCount',
        displayName: 'Record Count',
        cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
        width: '140',
        enableFiltering: false,
        allowCellFocus: false,
        enableSorting: true,
        enableHiding: false,
        enableCellEdit: false,
        maxWidth: '250'
      },
      {
        field: 'dkCallLimit',
        displayName: 'API Requests Limit' + CORE.Modify_Grid_column_Allow_Change_Message,
        cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
        width: '160',
        enableFiltering: false,
        allowCellFocus: false,
        enableSorting: true,
        enableHiding: false,
        maxWidth: '200'
      },
      {
        field: 'apiStatus',
        displayName: 'Status',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" \
                                                            ng-class="{\'label-success\':row.entity.apiStatus == \'Active\', \
                                                            \'label-warning underline cursor-pointer\':row.entity.apiStatus == \'Inactive\', \
                                                            \'label-primary\':row.entity.apiStatus == \'N/A\'}" ng-click="grid.appScope.$parent.vm.generateToken(row.entity, $event)"> \
                                                                {{ COL_FIELD }}'
          + '</span>'
          + '</div>',
        width: '130',
        enableFiltering: false,
        allowCellFocus: false,
        enableSorting: false,
        enableHiding: false,
        enableCellEdit: false,
        maxWidth: '200'
      }
    ];

    //get list of digikey credential details
    vm.loadData = () => {
      vm.cgBusyLoading = SettingsFactory.retriveExternalKeySettings().query(vm.pagingInfo).$promise.then((externalsettings) => {
        vm.sourceData = externalsettings.data.settings;
        vm.totalSourceDataCount = externalsettings.data.Count;
        if (vm.totalSourceDataCount === 0) {
          if (vm.pagingInfo.SearchColumns.length > 0) {
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
        if (!vm.gridOptions.enablePaging) {
          vm.currentdata = vm.sourceData.length;
          vm.gridOptions.gridApi.infiniteScroll.resetScroll();
        }
        _.each(vm.sourceData, (data) => {
          if (_DkVersion === data.Version) {
            checkAccessToken(data);
          }
          else {
            data.apiStatus = CORE.DIGKEY_STATUS.NotApplicable;
          }
        });
        vm.gridOptions.clearSelectedRows();
        $timeout(() => {
          vm.resetSourceGrid();
          $timeout(() => {
            celledit();
          }, true);
          if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
          }
        });
      }).catch((error) => BaseService.getErrorLog(error));
    };
    //it will use for infinite scroll and concate data
    vm.getDataDown = () => {

    };

    // call function to save lead quantity and overage percentage
    function celledit() {
      vm.gridOptions.gridApi.edit.on.afterCellEdit($scope, (rowEntity, colDef, newvalue, oldvalue)=> {
        if (newvalue !== oldvalue && newvalue) {
          vm.changeinValue();
        }
        if (rowEntity.perCallRecordCount) {
          rowEntity.perCallRecordCount = (rowEntity.perCallRecordCount > 50 ? 50 : rowEntity.perCallRecordCount) < 1 ? 1 : (rowEntity.perCallRecordCount > 50 ? 50 : rowEntity.perCallRecordCount);
        }
        if (rowEntity.dkCallLimit && colDef.field ==='dkCallLimit') {
          if (parseInt(newvalue)) {
            rowEntity.dkCallLimit = parseInt(newvalue);
          } else {
            rowEntity.dkCallLimit = oldvalue;
          }
        }
        if (rowEntity.specialPriceCustomerID && colDef.field === 'specialPriceCustomerID') {
          if (parseInt(newvalue) && rowEntity.specialPriceCustomerID.length<=12) {
            rowEntity.specialPriceCustomerID = parseInt(newvalue);
          } else {
            rowEntity.specialPriceCustomerID = oldvalue;
          }
        }
        if (!rowEntity.clientID || !rowEntity.secretID || !rowEntity.perCallRecordCount || !rowEntity.specialPriceCustomerID) {
          vm.isdirty = false;
        }
      });
      if (vm.sourceData.length > 0) {
        vm.gridOptions.gridApi.cellNav.scrollToFocus(vm.sourceData[0], vm.gridOptions.columnDefs[0]);
      }
    }

    //save external api
    vm.saveExternalApiSettings = () => {
      var Settings = [];
      _.each(vm.sourceData, (item) => {
        var ExternalSetting = {
          id: item.id,
          clientID: item.clientID,
          secretID: item.secretID,
          specialPriceCustomerID: item.specialPriceCustomerID,
          perCallRecordCount: item.perCallRecordCount,
          appID: item.appID,
          dkCallLimit: item.dkCallLimit
        };
        Settings.push(ExternalSetting);
      });
      vm.cgBusyLoading = SettingsFactory.saveExternalKeySettings().query({ externalKeys: Settings }).$promise.then((saveSetting) => {
        BaseService.currentPageFlagForm = [];
        $mdDialog.cancel(saveSetting);
      }).catch((error) => BaseService.getErrorLog(error));
    };
    //check list update or not
    vm.changeinValue = () => {
      vm.isdirty = true;
      BaseService.currentPageFlagForm = [true];
    };

    function checkAccessToken(data) {
      vm.cgBusyLoading = PartCostingFactory.checkAppAccessToken().query({ appID: data.appID }).$promise.then((suppliers) => {
        data.apiStatus = suppliers.status === CORE.ApiResponseTypeStatus.SUCCESS ? CORE.DIGKEY_STATUS.Active : CORE.DIGKEY_STATUS.InActive;
      }).catch((error) => BaseService.getErrorLog(error));
    }

    vm.generateToken = (row, ev) => {
      if (row && row.apiStatus === CORE.DIGKEY_STATUS.InActive) {
        const data = {
          appID: row.appID,
          isNewVersion: true
        };
        DialogFactory.dialogService(
          CORE.DIGIKEY_VERIFICATION_MODAL_CONTROLLER,
          CORE.DIGIKEY_VERIFICATION_MODAL_VIEW,
          ev,
          data).then(() => {
            checkAccessToken(row);
          }, (err) => BaseService.getErrorLog(err));
      }
    };
  }
})();
