(function () {
  'use strict';

  angular
    .module('app.transaction.boxserialnumbers')
    .directive('boxSerialNumberList', boxSerialNumberList);

  /** @ngInject */
  function boxSerialNumberList($timeout, TRANSACTION, CORE, USER, BoxSerialNumbersFactory, BaseService, DialogFactory, $rootScope) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        assyId: '=',
        woId: '=',
        assyStockId: '=',
        isAllowToAdd: '='
      },
      templateUrl: 'app/directives/custom/box-serial-number-list/box-serial-number-list.html',
      controller: boxSerialNumberListctrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    /**
    * @param
    */
    function boxSerialNumberListctrl($scope) {
      var vm = this;
      vm.isAllowToAdd = $scope.isAllowToAdd;
      vm.isUpdatable = true;
      vm.isMoveBoxSerialNo = true;
      vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.BOX_SERIAL_NUMBERS;
      vm.gridConfig = CORE.gridConfig;
      vm.LabelConstant = CORE.LabelConstant;
      vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
      vm.scanSerialNoHistory = true;
      vm.BoxSerialNoPackagingStatus = [{ id: null, value: 'All' }];
      vm.BoxSerialNoPackagingStatus = vm.BoxSerialNoPackagingStatus.concat(angular.copy(CORE.BoxSerialNoPackagingStatus));

      vm.sourceHeader = [{
        field: 'Action',
        cellClass: 'gridCellColor',
        displayName: 'Action',
        width: '120',
        cellTemplate: '<grid-action-view grid="grid" row="row"></grid-action-view>',
        enableFiltering: false,
        enableSorting: false,
        exporterSuppressExport: true,
        pinnedLeft: true
      }, {
        field: '#',
        width: '70',
        cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
        enableFiltering: false,
        enableSorting: false
      }, {
        field: 'status',
        displayName: 'Packaged Material Status',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{row.entity.statusName}}</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.BoxSerialNoPackagingStatus
        },
        width: '200'
      }, {
        field: 'uniqueID',
        displayName: vm.LabelConstant.MFG.PackagingBoxSerial,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '140'
      },
      {
        field: 'packagingMatPID',
        displayName: 'Package Material Part#',
        cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link ng-if="row.entity.partID" \
                            component-id="row.entity.partID" \
                            label="grid.appScope.$parent.vm.LabelConstant.MFG.PID" \
                            value="row.entity.packagingMatPID" \
                            is-copy="true" \
                            is-mfg="true" \
                            mfg-label="grid.appScope.$parent.vm.LabelConstant.MFG.MFGPN" \
                            mfg-value="row.entity.MfgPN" \
                            is-copy-ahead-label="true"\
                            is-custom-part="row.entity.isCustomPart"\
                            rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.partRohsIcon" \
                            rohs-status="row.entity.partRohsName"></common-pid-code-label-link></div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.PID
      },
      {
        field: 'poNumber',
        displayName: 'PO#',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '120'
      },
      {
        field: 'assyCode',
        displayName: vm.LabelConstant.Assembly.ID,
        cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link ng-if="row.entity.assyID" \
                            component-id="row.entity.assyID" \
                            is-assembly="true" \
                            label="grid.appScope.$parent.vm.LabelConstant.Assembly.PIDCode" \
                            value="row.entity.assyCode" \
                            is-copy="true" \
                            is-mfg="true" \
                            mfg-label="grid.appScope.$parent.vm.LabelConstant.Assembly.MFGPN" \
                            mfg-value="row.entity.assyMfgPN" \
                            is-copy-ahead-label="true"\
                            is-custom-part="row.entity.isCustomAssy"\
                            rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.assyRohsIcon" \
                            rohs-status="row.entity.assyRohsName"></common-pid-code-label-link></div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.PID
      }, {
        field: 'assyDescription',
        width: 250,
        displayName: vm.LabelConstant.MFG.MFGPNDescription,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
      }, {
        field: 'woNumber',
        displayName: vm.LabelConstant.Workorder.WO,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-left" ng-if="(!row.entity.woID)">{{COL_FIELD | numberWithoutDecimal}}</div>\
          <a class="ui-grid-cell-contents cm-text-decoration" ng-if="(row.entity.woID)" ng-click="grid.appScope.$parent.vm.goToWorkorderDetails(row.entity.woID);">\
                                                {{row.entity.woNumber}} \
                                            </a><md-tooltip md-direction="top">{{row.entity.woNumber}}</md-tooltip>',

        width: '150'
      },
      {
        field: 'qtyPerBox',
        displayName: 'Qty Per Box',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
        width: '90'
      },
      {
        field: 'datecode',
        displayName: 'Date Code',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '90'
      },
      {
        field: 'weight',
        displayName: 'Weight',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '120'
      },
      //{
      //  field: 'Serial#',
      //  displayName: 'Serial#',
      //  cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      //  width: '200'
      //  },
      {
        field: 'updatedAtvalue',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableFiltering: false
      }, {
        field: 'updatedbyvalue',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }, {
        field: 'updatedbyRole',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }, {
        field: 'createdbyvalue',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableFiltering: false
      }, {
        field: 'createdAtvalue',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableFiltering: false
      }, {
        field: 'createdbyRole',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }];

      const initPageInfo = () => {
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),
          SortColumns: [],
          SearchColumns: []
        };
      };
      initPageInfo();

      vm.gridOptions = {
        showColumnFooter: false,
        enableRowHeaderSelection: true,
        enableFullRowSelection: false,
        enableRowSelection: true,
        multiSelect: true,
        enableCellEditOnFocus: false,
        filterOptions: vm.pagingInfo.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: 'Packaging/Box Serial#.csv'
      };

      /* initial loading of data */
      vm.loadData = () => {
        vm.pagingInfo.assyID = $scope.assyId;
        vm.pagingInfo.woID = $scope.woId;
        vm.pagingInfo.assyStockId = $scope.assyStockId;
        vm.cgBusyLoading = BoxSerialNumbersFactory.retriveBoxSerialNoList().query(vm.pagingInfo).$promise.then((boxSerialList) => {
          if (boxSerialList && boxSerialList.data && boxSerialList.data.serialList) {
            boxSerialList.data.serialList.forEach((item) => {
              const statusDet = vm.BoxSerialNoPackagingStatus.find((status) => status.id === item.status);
              item.statusName = statusDet ? statusDet.value : '';
              item.statusName = statusDet ? statusDet.value : '';
              //item.isTrackBySerialNoWo = item.isTrackBySerialNo;
            });
            vm.sourceData = boxSerialList.data.serialList;
            vm.totalSourceDataCount = boxSerialList.data.Count;

            if (!vm.gridOptions.enablePaging) {
              vm.currentdata = vm.sourceData.length;
              vm.gridOptions.gridApi.infiniteScroll.resetScroll();
            }

            vm.gridOptions.clearSelectedRows();
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
            $scope.$emit('isNotDataFound', vm.isNoDataFound);
            $timeout(() => {
              vm.resetSourceGrid();
              if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
                return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
              }
            });
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* delete request list */
      vm.deleteRecord = (row) => {
        let selectedIDs = [];
        if (row) {
          selectedIDs.push(row.id);
        } else {
          vm.selectedRows = vm.selectedRowsList;
          if (vm.selectedRows.length > 0) {
            selectedIDs = vm.selectedRows.map((item) => item.id);
          }
        }

        if (selectedIDs) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.MFG.PackagingBoxSerial, selectedIDs.length);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          const objIDs = {
            id: selectedIDs,
            CountList: false
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              vm.cgBusyLoading = BoxSerialNumbersFactory.deleteBoxSerialNo().query({ objIDs: objIDs }).$promise
                .then((res) => {
                  if (res) {
                    BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                  }
                }).catch((error) => BaseService.getErrorLog(error));
            }
          })
            .catch((error) => BaseService.getErrorLog(error));
        }
      };

      /* delete multiple data called from directive of ui-grid*/
      vm.deleteMultipleData = () => {
        vm.deleteRecord();
      };

      /* to go at work order details page  */
      vm.goToWorkorderDetails = (woID) => {
        if (woID) {
          BaseService.goToWorkorderDetails(woID);
          return false;
        } else { return; }
      };

      /* Add box serial number */
      vm.addRecord = (data, ev) => {
        const detailObj = { data: data, ev: ev };
        $scope.$emit('addUpdateRecord', detailObj);
      };

      /* Update Box Serial Number */
      vm.updateRecord = (row) => {
        vm.addRecord({ id: row.entity.id });
      };

      /* to go at work order details page  */
      vm.goToWorkorderDetails = (woID) => {
        BaseService.goToWorkorderDetails(woID);
        return false;
      };

      /* Move Box serial Number list */
      vm.moveSerialNoPopup = (row, ev) => {
        const data = row && row.entity ? row.entity : null;
        DialogFactory.dialogService(
          TRANSACTION.TRANSACTION_MOVE_SERIAL_NUMBERS_POPUP_CONTROLLER,
          TRANSACTION.TRANSACTION_MOVE_SERIAL_NUMBERS_POPUP_VIEW,
          ev,
          data).then(() => {
            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
          }, (err) => BaseService.getErrorLog(err));
      };

      // View list of Scan SR# History
      vm.openScanSerialNoHistory = (row, ev) => {
        const data = row && row.entity ? { woBoxSerialID: row.entity.id } : null;

        DialogFactory.dialogService(
          TRANSACTION.TRANSACTION_BOX_SERIAL_NUMBERS_HISTORY_POPUP_CONTROLLER,
          TRANSACTION.TRANSACTION_BOX_SERIAL_NUMBERS_HISTORY_POPUP_VIEW,
          ev,
          data).then(() => {
            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
          }, (err) => BaseService.getErrorLog(err));
      };

      /* load more data on scroll */
      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.cgBusyLoading = BoxSerialNumbersFactory.retriveBoxSerialNoList().query(vm.pagingInfo).$promise.then((boxSerialNumberList) => {
          if (boxSerialNumberList && boxSerialNumberList.data.serialList) {
            vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(boxSerialNumberList.data.serialList);
            vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
            vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
            $timeout(() => {
              vm.resetSourceGrid();
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount !== vm.currentdata ? true : false);
            });
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };
      const refreshUIGridList = $rootScope.$on(USER.RefreshBoxSRNoUIGridList, () => {
        BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
      });

      //close popup on page destroy
      $scope.$on('$destroy', () => {
        refreshUIGridList();
      });
    }
  }
})();

