(function () {
  'use strict';
  angular
    .module('app.admin.bank')
    .controller('BankListController', BankListController);
  /** @nginject */
  function BankListController($timeout, USER, CORE, DialogFactory, BaseService, BankFactory) {
    const vm = this;
    vm.isHideDelete = false;
    vm.isUpdatable = true;
    vm.gridConfig = CORE.gridConfig;
    vm.LabelConstant = CORE.LabelConstant;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.BANK_EMPTY;
    vm.loginUser = BaseService.loginUser;
    vm.StatusOptionsGridHeaderDropdown = CORE.StatusOptionsGridHeaderDropdown;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [],
        SearchColumns: [],
        pageName: CORE.PAGENAME_CONSTANT[42].PageName
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
      CurrentPage: CORE.PAGENAME_CONSTANT[42].PageName,
      exporterCsvFilename: 'Bank Account.csv'
    };

    vm.sourceHeader = [
      {
        field: 'Action',
        displayName: 'Action',
        width: '80',
        cellTemplate: '<grid-action-view grid="grid" row="row" row-entity="row.entity"></grid-action-view>',
        enableFiltering: false,
        enableSorting: false,
        exporterSuppressExport: true,
        pinnedLeft: true
      },
      {
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
        enableFiltering: false,
        enableSorting: false
      },
      {
        field: 'accountCode',
        displayName: 'Account Code',
        width: '300',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'bankName',
        displayName: 'Bank Name',
        width: '300',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'accountNumber',
        displayName: 'Account Number',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '200',
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'typeOfAccountValue',
        displayName: 'Type of Account',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: 150,
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'acct_name',
        displayName: 'Chart of Account',
        cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-if="row.entity.acct_name">\
                            <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.updateChartOfAccount(row.entity);" tabindex="-1">{{COL_FIELD}}</a>\
                            <copy-text label="\'Chart of Account\'" text="row.entity.acct_name"></copy-text>\
                        </div>',
        width: '200',
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'creditDebitTypeValue',
        displayName: 'Credit/Debit Type',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: 150,
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'isActiveConvertedValue',
        displayName: 'Status',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" \
                        ng-class="{\'label-success\':row.entity.isActive == true ,\
                        \'label-warning\':row.entity.isActive == false }"> \
                            {{COL_FIELD}}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        ColumnDataType: 'StringEquals',
        filter: {
          term: null,
          options: vm.StatusOptionsGridHeaderDropdown
        }
      },
      {
        field: 'updatedAt',
        displayName: CORE.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
        width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        type: 'datetime'
      },
      {
        field: 'updatedby',
        displayName: CORE.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'updatedbyRole',
        displayName: CORE.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true
      },
      {
        field: 'createdAt',
        displayName: CORE.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateTimeFormat}}</div>',
        enableFiltering: false,
        enableSorting: true,
        type: 'datetime'
      }
      , {
        field: 'createdby',
        displayName: CORE.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'createdbyRole',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }
    ];


    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICall = (Bank, isGetDataDown) => {
      if (Bank && Bank.data && Bank.data.Bank) {
        if (!isGetDataDown) {
          vm.sourceData = Bank.data.Bank;
          vm.currentdata = vm.sourceData.length;
        }
        else if (Bank.data.Bank.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(Bank.data.Bank);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }

        // must set after new data comes
        vm.totalSourceDataCount = Bank.data.Count;
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

    /* retrieve SupplierAttributeTemplate list*/
    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = BankFactory.retrieveBankList().query(vm.pagingInfo).$promise.then((Bank) => {
        if (Bank && Bank.data) {
          setDataAfterGetAPICall(Bank, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* load more data on mouse scroll */
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = BankFactory.retrieveBankList().query(vm.pagingInfo).$promise.then((Bank) => {
        if (Bank && Bank.data) {
          setDataAfterGetAPICall(Bank, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.updateRecord = (row, ev) => {
      const PopupData = {
        id: row.entity.id
      };
      DialogFactory.dialogService(
        USER.ADMIN_BANK_ADD_UPDATE_MODAL_CONTROLLER,
        USER.ADMIN_BANK_ADD_UPDATE_MODAL_VIEW,
        ev,
        PopupData).then((data) => {
          if (data) {
            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
          }
        }, () => {
          BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.deleteRecord = (bank) => {
      let selectedIDs = [];
      if (bank) {
        selectedIDs.push(bank.id);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((bank) => bank.id);
        }
      }
      if (selectedIDs) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Bank Account', selectedIDs.length);
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
            vm.cgBusyLoading = BankFactory.deleteBank().query({ objIDs: objIDs }).$promise.then((res) => {
              if (res && res.data && (res.data.length > 0 || res.data.transactionDetails)) {
                const data = {
                  TotalCount: res.data.transactionDetails[0].TotalCount,
                  pageName: CORE.PageName.Bank
                };
                BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                  const objIDs = {
                    id: selectedIDs,
                    CountList: true
                  };
                  return BankFactory.deleteBank().query({ objIDs: objIDs }).$promise.then((res) => {
                    let data = {};
                    data = res.data;
                    data.PageName = CORE.PageName.Bank;
                    data.selectedIDs = stringFormat('{0}{1}', selectedIDs.length, ' Selected');
                    if (res.data) {
                      DialogFactory.dialogService(
                        USER.ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER,
                        USER.ADMIN_SHOW_TRANSACTION_DETAILS_VIEW,
                        ev,
                        data).then(() => {
                        }, () => {
                        }).catch((error) => BaseService.getErrorLog(error));
                    }
                  }).catch((error) => BaseService.getErrorLog(error));
                });
              } else {
                BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.addBank = (ev) => {
      DialogFactory.dialogService(
        USER.ADMIN_BANK_ADD_UPDATE_MODAL_CONTROLLER,
        USER.ADMIN_BANK_ADD_UPDATE_MODAL_VIEW,
        ev,
        null).then((data) => {
          if (data) {
            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
          }
        }, () => {
          BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };

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
          acct_id: row.acctId
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
  }
})();
