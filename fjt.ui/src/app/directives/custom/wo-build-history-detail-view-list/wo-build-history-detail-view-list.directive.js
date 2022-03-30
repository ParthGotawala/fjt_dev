(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('woBuildHistoryDetailViewList', woBuildHistoryDetailViewList);

  /** @ngInject */
  function woBuildHistoryDetailViewList(BaseService, $timeout, USER, CORE, ComponentNicknameWOBuildDetailFactory, TRANSACTION, $q) {
    var directive = {
      restrict: 'E',
      replace: false,
      scope: {
        popupParamData: '=?'
      },
      templateUrl: 'app/directives/custom/wo-build-history-detail-view-list/wo-build-history-detail-view-list.html',
      controller: woBuildHistoryDetailViewListCtrl,
      controllerAs: 'vm'
    };
    return directive;
    /** @ngInject */
    function woBuildHistoryDetailViewListCtrl($scope) {
      var vm = this;
      vm.isHideDelete = true;
      vm.gridConfig = CORE.gridConfig;
      vm.loginUser = BaseService.loginUser;
      const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
      vm.LabelConstant = CORE.LabelConstant;
      vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
      vm.popupParamData = $scope.popupParamData || {};
      vm.popupParamDataCopy = angular.copy(vm.popupParamData);

      const initPageInfo = () => {
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),
          SortColumns: [],
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
        exporterCsvFilename: 'WOBuildHistoryDetailView.csv',
        hideMultiDeleteButton: true,
        enableExpandableRowHeader: true,
        expandableRowTemplate: TRANSACTION.TRANSACTION_EXPANDABLEJS,
        expandableRowHeight: 350,
        expandableRowScope: $scope
      };
      if (vm.popupParamDataCopy.assyNickName) {
        vm.pagingInfo.SearchColumns.push({ ColumnName: 'nickName', SearchString: vm.popupParamDataCopy.assyNickName });
      }

      vm.sourceHeader = [{
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
        enableFiltering: false,
        enableSorting: false
      },
      {
        field: 'nickName',
        displayName: 'Nickname',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '460',
        filter: {
          term: angular.copy(vm.popupParamDataCopy.assyNickName) || null
        }
      },
      {
        field: 'custAssyPN',
        displayName: 'Part#',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '250'
      },
      {
        field: 'rev',
        displayName: 'Rev',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '70'
      },
      {
        field: 'lastWOSeriesNumber',
        displayName: 'Last WO Series#',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '150'
      },
      {
        field: 'lastWOBuildNumber',
        displayName: 'Last WO Build#',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '110'
      },
      {
        field: 'woCount',
        displayName: 'Total WO (Incl. Initial Stock)',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '130'
      }
      ];
      vm.popupParamDataCopy.assyNickName = null;

      /* to bind data in grid on load */
      vm.loadData = () => {
        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        vm.cgBusyLoading = ComponentNicknameWOBuildDetailFactory.getCompNicknameWObuildSummaryInfo().query(vm.pagingInfo).$promise.then((respList) => {
          if (respList && respList.data) {
            setDataAfterGetAPICall(respList, false);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* to set data in grid after data is retrieved from API in loadData() and getDataDown() function */
      const setDataAfterGetAPICall = (respList, isGetDataDown) => {
        if (respList && respList.data && respList.data.woBuildList) {
          if (!isGetDataDown) {
            vm.sourceData = respList.data.woBuildList;
            vm.currentdata = vm.sourceData.length;
          }
          else if (respList.data.woBuildList.length > 0) {
            vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(respList.data.woBuildList);
            vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
          }

          // must set after new data comes
          vm.totalSourceDataCount = respList.data.Count;
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
            if (!isGetDataDown) {
              vm.resetSourceGrid();
              $timeout(() => {
                vm.expandableJS();
              }, _configTimeout);
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

      vm.expandableJS = () => {
        if (vm.gridOptions.gridApi && vm.gridOptions.gridApi.expandable) {
          vm.gridOptions.gridApi.expandable.on.rowExpandedStateChanged($scope, (row) => {
            //$scope.parentrow = row.entity;
            if (row.isExpanded) {
              vm.subGridpagingInfo = {
                Page: CORE.UIGrid.Page(),
                SortColumns: [],
                SearchColumns: []
              };
              vm.subGridgridOptions = vm.subGridgridOptions ? vm.subGridgridOptions : {};
              vm.subGridgridOptions[row.entity.nickName] = {
                showColumnFooter: false,
                enableRowHeaderSelection: false,
                enableFullRowSelection: false,
                enableRowSelection: false,
                multiSelect: false,
                filterOptions: vm.subGridpagingInfo.SearchColumns,
                enableCellEdit: false,
                enablePaging: false,
                enableExpandableRowHeader: false,
                enableGridMenu: false,
                enableCellEditOnFocus: false,
                appScopeProvider: $scope,
                enableCellSelection: true,
                allowCellFocus: true,
                subGridHeight: 350
                //enableFiltering: true
              };

              vm.subGridsourceHeader = [{
                field: '#',
                width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
                cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
                enableFiltering: false,
                enableSorting: false
              },
              {
                field: 'PIDCode',
                displayName: vm.LabelConstant.Assembly.ID,
                cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link \
                                        component-id="row.entity.partID" \
                                        label="grid.appScope.vm.LabelConstant.Assembly.ID" \
                                        value="row.entity.PIDCode" \
                                        is-copy="true" \
                                        rohs-icon="row.entity.rohsIcon" \
                                        rohs-status="row.entity.rohsName" \
                                        is-custom-part="row.entity.isCustom" \
                                        is-assembly="true"></div>',
                enableCellEdit: false,
                enableCellEditOnFocus: true,
                width: CORE.UI_GRID_COLUMN_WIDTH.PID,
                allowCellFocus: true
              },
              {
                field: 'woNumber',
                displayName: vm.LabelConstant.Workorder.WO,
                cellTemplate: '<a class="ui-grid-cell-contents cm-text-decoration" ng-click="grid.appScope.vm.goToWorkorderDetails(row.entity.woID,row.entity.woType,row.entity.partID);">\
                                                {{row.entity.woNumber}} </a>\
                                        <copy-text  label="grid.appScope.vm.LabelConstant.Workorder.WO" text="row.entity.woNumber" ng-if="row.entity.woNumber"> </copy-text>\
                                        <md-tooltip ng-if="row.entity.woNumber">{{row.entity.woNumber}}</md-tooltip> ',
                width: '150'
              },
              {
                field: 'woTypeText',
                displayName: 'Type',
                width: '150'
              }
              ];

              const subGridWOData = [getCompNicknameWObuildSummaryDet(row.entity)];
              vm.cgBusyLoading = $q.all(subGridWOData).then(() => {

              });

              vm.subGridgridOptions[row.entity.nickName].columnDefs = vm.subGridsourceHeader;
              //vm.subGridgridOptions.data = row.entity.SalesDetail;
              //vm.isValidChildData = true;
              vm.subGridgridOptions[row.entity.nickName].onRegisterApi = function (gridApi) {
                vm.gridApi = gridApi;
              };
              row.entity.subGridOptions = vm.subGridgridOptions[row.entity.nickName];
            }
          });
        }
      };

      /* to get data on scroll down in grid */
      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.cgBusyLoading = ComponentNicknameWOBuildDetailFactory.getCompNicknameWObuildSummaryInfo().query(vm.pagingInfo).$promise.then((respList) => {
          if (respList && respList.data) {
            setDataAfterGetAPICall(respList, true);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* get detail view data of work order number for selected assembly nickname */
      const getCompNicknameWObuildSummaryDet = (selectedParentDet) => {
        if (!selectedParentDet || !selectedParentDet.nickName) {
          vm.subGridgridOptions[selectedParentDet.nickName].data = [];
          return;
        }
        const compWODet = {
          assyNickname: selectedParentDet.nickName,
          woSeriesNumber: selectedParentDet.lastWOSeriesNumber
        };
        return ComponentNicknameWOBuildDetailFactory.getWOBuildDetailInfoByByAssyNickName().query(compWODet).$promise.then((respList) => {
          if (respList && respList.data) {
            _.each(respList.data.woBuildDetailList, (assyWOItem) => {
              assyWOItem.rohsIcon = stringFormat('{0}{1}', vm.rohsImagePath, assyWOItem.rohsIcon);
            });
            vm.subGridgridOptions[selectedParentDet.nickName].data = respList.data.woBuildDetailList || [];
          }
          return $q.resolve(respList);
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* to go at work order details page  */
      vm.goToWorkorderDetails = (woID, woType, partID) => {
        if (woType === CORE.ASSY_STOCK_TYPE.WorkOrderStock) {
          BaseService.goToWorkorderDetails(woID);
          return false;
        } else if (woType === CORE.ASSY_STOCK_TYPE.OpeningStock) {
          BaseService.goToAssemblyOpeningBalanceDetails(partID);
          return false;
        }
      };
    }
  }
})();
