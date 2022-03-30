(function () {
  'use strict';

  angular
    .module('app.transaction.shipped')
    .controller('ShippedAssemblyListController', ShippedAssemblyListController);

  /** @ngInject */
  function ShippedAssemblyListController($mdDialog, $scope, $timeout, $state, CORE, USER, TRANSACTION,
    ShippedFactory, DialogFactory, BaseService) {

    const vm = this;
    vm.isUpdatable = true;
    vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.SHIPPED;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.DefaultDateTimeFormat = _dateTimeDisplayFormat;
    vm.gridConfig = CORE.gridConfig;
    vm.LabelConstant = CORE.LabelConstant;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    // for copy icon into ui-grid action column

    vm.sourceHeader = [{
      field: 'Action',
      cellClass: 'layout-align-center-center',
      displayName: 'Action',
      width: '75',
      cellTemplate: `<grid-action-view grid="grid" row="row"></grid-action-view>`,
      enableFiltering: false,
      enableSorting: false,
      exporterSuppressExport: true,
      pinnedLeft: true
    }, {
      field: '#',
      width: '70',
      cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
      enableFiltering: false,
      enableSorting: false,
    }, {
      field: 'outwinvoiceno',
      displayName: 'Invoice#',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '120',
      allowCellFocus: true
    }, {
      field: 'outwinvoicedate',
      displayName: 'Invoice Date',
      type: 'date',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.ONLY_DATE_COLUMN,
      enableFiltering: false,
      enableSorting: false,
      allowCellFocus: true
    }, {
      field: 'mfgName',
      displayName: 'Customer',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '260',
      allowCellFocus: true
    }, {
      field: 'PIDCode',
      displayName: vm.LabelConstant.Assembly.ID,
      //   cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link \
                                        component-id="row.entity.partID" \
                                        label="grid.appScope.$parent.vm.LabelConstant.Assembly.ID" \
                                        value="row.entity.PIDCode" \
                                        is-copy="true" \
                                        is-mfg="true" \
                                        mfg-label="grid.appScope.$parent.vm.LabelConstant.Assembly.MFGPN" \
                                        mfg-value="row.entity.mfgPN" \
                                        rohs-icon="row.entity.rohsIcon" \
                                        rohs-status="row.entity.rohsName" \
                                        is-custom-part="row.entity.isCustom" \
                                        is-copy-ahead-label="true" \
                                        is-assembly="true"></common-pid-code-label-link></div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.PID
    }, {
      field: 'nickName',
      displayName: vm.LabelConstant.Assembly.NickName,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.ASSY_NICKNAME,
      allowCellFocus: true
    }, {
      field: 'mfgPNDescription',
      displayName: vm.LabelConstant.Assembly.Description,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '300',
      allowCellFocus: true
    }, {
      field: 'salesOrderNumber',
      displayName: 'Ref. Sales Order',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '110',
      allowCellFocus: true
    }, {
      field: 'woNumber',
      displayName: 'Work Order#',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '90',
      allowCellFocus: true
    }, {
      field: 'shippedqty',
      displayName: 'Shipped Qty',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '90',
      allowCellFocus: true
    },
    {
      field: 'ShippingAddress',
      displayName: vm.LabelConstant.Address.ShippingAddress,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '250',
    },
    {
      field: 'shippedNotes',
      displayName: 'Shipping Notes',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '200',
    }, {
      field: 'description',
      displayName: 'Notes',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '200',
      allowCellFocus: true
    }, {
      field: 'createdby',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      enableFiltering: true,
      enableSorting: false,
      allowCellFocus: true
    }, {
      field: 'updatedAt',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
      type: 'datetime',
      enableFiltering: false
    }, {
      field: 'updatedby',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
      type: 'StringEquals',
      enableFiltering: true,
    }, {
      field: 'updatedbyRole',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
      type: 'StringEquals',
      enableFiltering: true,
    }, {
      field: 'createdAt',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
      type: 'datetime',
      enableFiltering: false
    }];

    let initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['partID', 'DESC']],
        SearchColumns: [],
      };
    }

    initPageInfo();
    //close popup on page destroy 
    $scope.$on('$destroy', function () {
      $mdDialog.hide(false, { closeAll: true });
    });
    vm.gridOptions = {
      showColumnFooter: false,
      enableRowHeaderSelection: true,
      enableFullRowSelection: false,
      enableRowSelection: true,
      multiSelect: true,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: 'Shipped Assembly.csv',
    };

    /* retrieve work order list*/
    vm.loadData = () => {

      if (vm.pagingInfo.SortColumns.length == 0)
        vm.pagingInfo.SortColumns = [['partID', 'DESC']];
      vm.cgBusyLoading = ShippedFactory.shipped(vm.pagingInfo).query().$promise.then((shipped) => {
        vm.sourceData = [];
        shipped.data.shippeds.forEach((item) => {
          item.rohsIcon = stringFormat('{0}{1}', vm.rohsImagePath, item.rohsIcon);
          item.outwinvoicedate = item.outwinvoicedate ? BaseService.getUIFormatedDate(item.outwinvoicedate, vm.DefaultDateFormat) : null;
        });
        if (shipped.data) {
          vm.sourceData = shipped.data.shippeds;
        }
        vm.totalSourceDataCount = shipped.data.Count;
        if (!vm.gridOptions.enablePaging) {
          vm.currentdata = vm.sourceData.length;
          vm.gridOptions.gridApi.infiniteScroll.resetScroll();
        }
        vm.gridOptions.clearSelectedRows();
        if (vm.totalSourceDataCount == 0) {
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
          if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount == vm.currentdata) {
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
          }
        });
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = ShippedFactory.shipped(vm.pagingInfo).query().$promise.then((shipped) => {
        vm.sourceData = vm.sourceData.concat(shipped.data.shippeds);
        vm.currentdata = vm.sourceData.length;
        vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
        $timeout(() => {
          vm.resetSourceGrid();
          return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount != vm.currentdata ? true : false);
        });
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };

    vm.selectedWorkorder = () => {
      return vm.gridOptions.getSelectedRowsCount ? vm.gridOptions.getSelectedRowsCount() : 0;
    };

    vm.fab = {
      Status: false,
    };


    vm.addRecord = (row, ev) => {
      $state.go(TRANSACTION.TRANSACTION_MANAGESHIPPED_STATE, { owID: null });
    };

    vm.updateRecord = (row, ev) => {
      $state.go(TRANSACTION.TRANSACTION_MANAGESHIPPED_STATE, {
        owID: row.entity.id
      });
    };

    /* delete salesorder*/
    vm.deleteRecord = (salesorder) => {
      let selectedIDs = [];
      if (salesorder) {
        selectedIDs.push(salesorder.id);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((item) => item.id);
        }
      }
      if (selectedIDs) {
        let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, "Shipped assembly", selectedIDs.length);
        let obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        let objIDs = {
          id: selectedIDs,
          CountList: false,
        }
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.cgBusyLoading = ShippedFactory.deleteShippedAssembly().query({ objIDs: objIDs }).$promise.then((response) => {
              if (response && response.data) {
                if (response.data.length > 0 || response.data.transactionDetails) {
                  var data = {
                    TotalCount: response.data.transactionDetails[0].TotalCount,
                    pageName: CORE.PageName.shippedassembly
                  }
                  BaseService.deleteAlertMessageWithHistory(data, function (ev) {
                    let objIDs = {
                      id: selectedIDs,
                      CountList: true,
                    };
                    return vm.cgBusyLoading = ShippedFactory.deleteShippedAssembly().save({
                      objIDs: objIDs,
                    }).$promise.then((res) => {
                      let data = {};
                      data = res.data;
                      data.pageTitle = salesorder ? salesorder.outwinvoiceno : null;
                      data.PageName = CORE.PageName.shippedassembly;
                      data.id = selectedIDs;
                      data.selectedIDs = stringFormat('{0}{1}', selectedIDs.length, ' Selected');
                      if (res.data) {
                        DialogFactory.dialogService(
                          USER.ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER,
                          USER.ADMIN_SHOW_TRANSACTION_DETAILS_VIEW,
                          ev,
                          data).then((res) => {
                          }, () => {
                          });
                      }
                    }).catch((error) => {
                      return BaseService.getErrorLog(error);
                    });
                  });
                } else {
                  BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                  vm.gridOptions.clearSelectedRows();
                }
              }

            }).catch((error) => {
              return BaseService.getErrorLog(error);
            });
          }

        }, (cancel) => {
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
      else {
        //show validation message no data selected
        let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContent.message = stringFormat(messageContent.message, "Shipped Assembly");
        let alertModel = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(alertModel);
      }
    };


    /* delete multiple data called from directive of ui-grid*/
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    }
  }

})();
