(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('transactionModesList', transactionModesList);

  /** @ngInject */
  function transactionModesList($mdDialog, $timeout, $state, CORE, USER, DialogFactory, BaseService, TransactionModesFactory) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        transactionModesTabName: '=',
        cgBusyLoading: '='
      },
      templateUrl: 'app/directives/custom/transaction-modes-list/transaction-modes-list.html',
      controller: transactionModesListCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function transactionModesListCtrl($scope) {
      var vm = this;
      vm.transactionModesTabName = $scope.transactionModesTabName;
      vm.loginUser = BaseService.loginUser;
      vm.isNoDataFound = false;
      vm.isUpdatable = true;
      vm.StatusOptionsGridHeaderDropdown = CORE.StatusOptionsGridHeaderDropdown;
      vm.isEditIntigrate = false;
      vm.LabelConstant = CORE.LabelConstant;
      vm.KeywordStatusGridHeaderDropdown = CORE.KeywordStatusGridHeaderDropdown;
      vm.gridConfig = CORE.gridConfig;

      vm.selectedTransactionModesTab = _.find(USER.TransactionModesTabs, (tabs) => tabs.Name === vm.transactionModesTabName);
      vm.Message = stringFormat(USER.ADMIN_EMPTYSTATE.USER.MESSAGE, vm.selectedTransactionModesTab.DisplayName);
      vm.AddnewMessage = stringFormat(USER.ADMIN_EMPTYSTATE.USER.ADDNEWMESSAGE, vm.selectedTransactionModesTab.DisplayName);
      const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination;

      /* sourceHeader data */
      vm.sourceHeader = [{
        field: 'Action',
        cellClass: 'gridCellColor',
        displayName: 'Action',
        width: '80',
        cellTemplate: '<grid-action-view grid="grid" row="row"></grid-action-view>',
        enableFiltering: false,
        enableSorting: false,
        exporterSuppressExport: true,
        pinnedLeft: true,
        enableCellEdit: false
      }, {
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
        enableFiltering: false,
        enableSorting: false,
        enableCellEdit: false
      }, {
        field: 'modeCode',
        displayName: 'Mode Code',
        width: 200,
        enableCellEdit: false
      }, {
        field: 'modeName',
        displayName: 'Mode Name',
        width: 270,
        enableCellEdit: false
      }, {
        field: 'displayOrder',
        displayName: vm.LabelConstant.COMMON.DisplayOrder + CORE.Modify_Grid_column_Allow_Change_Message,
        cellTemplate: CORE.DISPLAYORDER.CellTemplate,
        editableCellTemplate: CORE.DISPLAYORDER.EditableCellTemplate,
        width: CORE.DISPLAYORDER.Width,
        maxWidth: CORE.DISPLAYORDER.MaxWidth,
        enableCellEdit: true,
        type: 'number'
      }, {
        field: 'isActiveConvertedValue',
        displayName: 'Status',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span  class="label-box" \
                                            ng-class="{\'label-success\':row.entity.isActive == true, \
                                            \'label-warning\':row.entity.isActive == false}"> \
                                                {{ COL_FIELD }}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.StatusOptionsGridHeaderDropdown
        }
      }, {
        field: 'systemGeneratedConvertedValue',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_SYSTEM_GENERATED,
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" ng-class="{\'label-success\':row.entity.systemGenerated == true, \'label-warning\':row.entity.systemGenerated == false}"> {{ COL_FIELD }}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.KeywordStatusGridHeaderDropdown
        },
        ColumnDataType: 'StringEquals',
        width: 150
      }, {
        field: 'description',
        displayName: 'Description',
        cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
          '<span class="cursor-pointer bom-header-wrap">{{ COL_FIELD }}</span> &nbsp;' +
          '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.description && row.entity.description !== \'-\'" ng-click="grid.appScope.$parent.vm.showDescription(row.entity, $event)">' +
          '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
          '<md-tooltip>View</md-tooltip>' +
          '</button>' +
          '</div>',
        width: 300
      }, {
        field: 'acct_name',
        displayName: 'Chart of Account',
        cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-if="row.entity.acct_name">\
                            <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.updateChartOfAccount(row.entity);" tabindex="-1">{{COL_FIELD}}</a>\
                            <copy-text label="\'Chart of Account\'" text="row.entity.acct_name"></copy-text>\
                        </div>',
        width: 250,
        enableCellEdit: false
      }, {
        field: 'createdAtvalue',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableFiltering: false
      }, {
        field: 'updatedAtvalue',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableFiltering: false,
        visible: false
      }, {
        field: 'createdbyvalue',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }, {
        field: 'updatedbyvalue',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true,
        visible: false
      }, {
        field: 'createdbyRolevalue',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        type: 'StringEquals',
        enableFiltering: true,
        visible: false
      }, {
        field: 'updatedbyRolevalue',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true,
        visible: false
      }];

      /* to display Description */
      vm.showDescription = (row, ev) => {
        const popupData = {
          title: 'Description',
          description: row.description
        };
        showDescription(popupData, ev);
      };

      const showDescription = (popupData, ev) => {
        DialogFactory.dialogService(
          CORE.DESCRIPTION_MODAL_CONTROLLER,
          CORE.DESCRIPTION_MODAL_VIEW,
          ev,
          popupData).then(() => {
          }, (err) => BaseService.getErrorLog(err));
      };

      const initPageInfo = () => {
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),
          SortColumns: [],
          SearchColumns: [],
          TransMode: vm.selectedTransactionModesTab.modeType
        };
      };
      initPageInfo();

      vm.gridOptions = {
        enablePaging: isEnablePagination,
        enablePaginationControls: isEnablePagination,
        showColumnFooter: false,
        enableRowHeaderSelection: true,
        enableFullRowSelection: false,
        enableRowSelection: true,
        multiSelect: true,
        filterOptions: vm.pagingInfo.SearchColumns,
        exporterMenuCsv: true,
        enableCellEdit: false,
        enableCellEditOnFocus: true,
        CurrentPage: CORE.PAGENAME_CONSTANT[58].PageName,
        exporterCsvFilename: vm.selectedTransactionModesTab.addButtonLabel + '.csv',
        allowToExportAllData: true,
        /* Calls everytime for Export All Data [rowType = ALL] */
        exporterAllDataFn: () => {
          /* For scrolling pagination vm.pagingInfo.Page is increase everytime so we have to set API side pagePerReocrds as NULL for Export All Data */
          const pagingInfoOld = _.clone(vm.pagingInfo);
          pagingInfoOld.pageSize = 0;
          pagingInfoOld.Page = 1;
          vm.gridOptions.isExport = pagingInfoOld.isExport = true;
          return TransactionModesFactory.retrieveTransactionModesList().query(pagingInfoOld).$promise.then((transactionmodes) => {
            if (transactionmodes && transactionmodes.status === CORE.ApiResponseTypeStatus.SUCCESS && transactionmodes.data && transactionmodes.data.TransactionModes) {
              return transactionmodes.data.TransactionModes;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      function setDataAfterGetAPICall(transactionmodes, isGetDataDown) {
        if (transactionmodes && transactionmodes.data && transactionmodes.data.TransactionModes) {
          if (!isGetDataDown) {
            vm.sourceData = transactionmodes.data.TransactionModes;
            vm.currentdata = vm.sourceData.length;
          }
          else if (transactionmodes.data.TransactionModes.length > 0) {
            vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(transactionmodes.data.TransactionModes);
            vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
          }
          _.each(vm.sourceData, (item) => {
            if (item.systemGenerated) {
              item.isDisabledDelete = true;
            }
          });
          // must set after new data comes
          vm.totalSourceDataCount = transactionmodes.data.Count;
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
          if (!isGetDataDown && !vm.isEditIntigrate) {
            cellEdit();
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

      /* retrieve Transaction mode list. */
      vm.loadData = () => {
        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        $scope.cgBusyLoading = TransactionModesFactory.retrieveTransactionModesList().query(vm.pagingInfo).$promise.then((transactionmodes) => {
          if (transactionmodes.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            setDataAfterGetAPICall(transactionmodes, false);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* Load more records on scroll down. */
      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        $scope.cgBusyLoading = TransactionModesFactory.retrieveTransactionModesList().query(vm.pagingInfo).$promise.then((transactionmodes) => {
          if (transactionmodes) {
            setDataAfterGetAPICall(transactionmodes, true);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.updateRecord = (row) => {
        BaseService.goToManageTransactionModes(vm.transactionModesTabName, row && row.entity ? row.entity.id : null, false);
      };

      /* Delete records. */
      vm.deleteRecord = (transactionmodes) => {
        let selectedIDs = [];

        if (transactionmodes) {
          selectedIDs.push(transactionmodes.id);
        } else {
          vm.selectedRows = vm.selectedRowsList;
          if (vm.selectedRows.length > 0) {
            selectedIDs = vm.selectedRows.map((transactionmodesItem) => transactionmodesItem.id);
          }
        }

        if (selectedIDs) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, vm.selectedTransactionModesTab.addButtonLabel, selectedIDs.length);
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
              $scope.cgBusyLoading = TransactionModesFactory.deleteTransactionModes().query({ objIDs: objIDs, modeType: vm.selectedTransactionModesTab.modeType }).$promise.then((res) => {
                if (res) {
                  if (res.data && (res.data.length > 0 || res.data.transactionDetails)) {
                    const data = {
                      TotalCount: res.data.transactionDetails[0].TotalCount,
                      pageName: vm.selectedTransactionModesTab.addButtonLabel,
                      IsHideTransactionCount: false
                    };
                    BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                      const IDs = {
                        id: selectedIDs,
                        CountList: true
                      };
                      return TransactionModesFactory.deleteTransactionModes().query({
                        objIDs: IDs,
                        modeType: vm.selectedTransactionModesTab.modeType
                      }).$promise.then((res) => {
                        let data = {};
                        data = res.data;
                        data.pageTitle = vm.selectedTransactionModesTab.addButtonLabel;
                        data.PageName = vm.selectedTransactionModesTab.addButtonLabel;
                        data.selectedIDs = stringFormat('{0}{1}', selectedIDs.length, ' Selected');
                        if (res.data) {
                          DialogFactory.dialogService(
                            USER.ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER,
                            USER.ADMIN_SHOW_TRANSACTION_DETAILS_VIEW,
                            ev,
                            data).then(() => {
                            }, () => {
                            });
                        }
                      }).catch((error) => BaseService.getErrorLog(error));
                    });
                  } else {
                    BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                    vm.gridOptions.clearSelectedRows();
                  }
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
        }
        else {
          //show validation message no data selected
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
          messageContent.message = stringFormat(messageContent.message, vm.selectedTransactionModesTab.addButtonLabel);
          const alertModel = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(alertModel);
        }
      };

      /* delete multiple data called from directive of ui-grid */
      vm.deleteMultipleData = () => {
        vm.deleteRecord();
      };

      /* Display duplicate TrnasactionMode Message */
      const duplicateTrnasactionModeMessage = (duplicateField) => {
        if (duplicateField && duplicateField.displayOrder) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
          messageContent.message = stringFormat(messageContent.message, 'Display Order');
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          return DialogFactory.messageAlertDialog(model).catch((error) => BaseService.getErrorLog(error));
        }
      };

      /* Update cell for display order flied */
      function cellEdit() {
        vm.isEditIntigrate = true;
        vm.gridOptions.gridApi.edit.on.afterCellEdit($scope, (rowEntity, colDef, newvalue, oldvalue) => {
          const obj = _.find(vm.sourceData, (item) => item.id === rowEntity.id);
          const index = vm.sourceData.indexOf(obj);
          if (colDef.field === 'displayOrder' && newvalue !== oldvalue) {
            if (!BaseService.setInvalidDisplayOrder(oldvalue, newvalue, index, (colDef.colInitIndex - 1), vm.gridOptions, vm.sourceData, vm.sourceHeader, rowEntity, 0)) {
              return;
            }
            const displayOrderInfo = {
              displayOrder: newvalue,
              modeType: vm.selectedTransactionModesTab.modeType,
              id: rowEntity.id
            };

            $scope.cgBusyLoading = TransactionModesFactory.saveTransactionMode().save(displayOrderInfo).$promise.then((res) => {
              if (res) {
                if (res.status === CORE.ApiResponseTypeStatus.FAILED || res.status === CORE.ApiResponseTypeStatus.EMPTY) {
                  rowEntity.displayOrder = oldvalue;
                  duplicateTrnasactionModeMessage(res.errors ? res.errors.data : null);
                }
                else if (res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                  BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                }
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        });
      }

      /* Update chart of account  */
      vm.updateChartOfAccount = (row) => {
        const loginUserAllAccessPageRoute = _.map(BaseService.loginUserPageList, (item) => item.PageDetails && item.PageDetails.pageRoute);
        if (!_.find(loginUserAllAccessPageRoute, (item) => item === USER.ADMIN_CHART_OF_ACCOUNTS_STATE)) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.POPUP_ACCESS_DENIED);
          messageContent.message = stringFormat(messageContent.message, CORE.Chart_of_Accounts.SINGLELABEL.toLowerCase());
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
        } else {
          const PopupData = {
            acct_id: row.acct_id
          };
          DialogFactory.dialogService(
            CORE.MANAGE_CHART_OF_ACCOUNTS_MODAL_CONTROLLER,
            CORE.MANAGE_CHART_OF_ACCOUNTS_MODAL_VIEW,
            event,
            PopupData).then(() => {
            }, () => {
            }, (err) => BaseService.getErrorLog(err));
        }
      };

      /* close popup on page destroy */
      $scope.$on('$destroy', () => {
        $mdDialog.hide(false, { closeAll: true });
      });
    }
  }
})();
