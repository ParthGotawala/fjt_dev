(function () {
  'use strict';
  angular
    .module('app.transaction.warehousebin')
    .controller('BinController', BinController);
  /** @nginject */
  function BinController($mdDialog, $rootScope, $timeout, $scope, $state, $stateParams, TRANSACTION, USER, CORE, BinFactory,
    DialogFactory, BaseService, ReceivingMaterialFactory, WarehouseBinFactory, PRICING, socketConnectionService, NotificationFactory) {
    const vm = this;
    vm.CORE = CORE;
    vm.Isbin = true;
    vm.isUpdatable = true;
    vm.isviewalias = true;
    vm.showBinTransfer = true;
    vm.isNoDataFound = false;
    vm.colorStatus = true;
    vm.showUMIDHistory = true;
    vm.default = 'All';
    vm.WarehouseType = vm.default;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.CustomSearchTypeForList = CORE.CustomSearchTypeForList;
    vm.searchType = vm.CustomSearchTypeForList.Contains;
    vm.searchTypeWarehouse = vm.CustomSearchTypeForList.Contains;
    vm.DefaultDateFormat = _dateTimeDisplayFormat;
    vm.isPrinted = true;
    vm.cartType = TRANSACTION.warehouseType;
    vm.loginUser = BaseService.loginUser;
    vm.gridConfig = CORE.gridConfig;
    vm.LabelConstant = CORE.LabelConstant;
    vm.actionButtonName = 'Bin History';
    vm.clickButton = false;
    const warehouseId = $stateParams.warehouseId;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;

    if ($scope.$parent && $scope.$parent.vm) {
      $scope.$parent.vm.selectedNavItem = TRANSACTION.TRANSACTION_BIN_LABEL;
    }

    vm.BinStatusOptionsGridHeaderDropdown = CORE.StatusOptionsGridHeaderDropdown;
    vm.KeywordStatusGridHeaderDropdown = CORE.KeywordStatusGridHeaderDropdown;
    vm.BinTypeStatusGridHeaderDropdown = CORE.BinTypeStatusGridHeaderDropdown;
    vm.BinGenerateTypeStatusGridHeaderDropdown = CORE.BinGenerateTypeStatusGridHeaderDropdown;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.BIN;
    vm.sourceHeader = [
      {
        field: 'Action',
        cellClass: 'layout-align-center-center',
        displayName: 'Action',
        width: '180',
        cellTemplate: '<grid-action-view grid="grid" row="row" number-of-action-button="4"></grid-action-view>',
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
        enableSorting: false,
        pinnedLeft: true
      },
      {
        field: 'inovexStatus',
        displayName: 'Smart Cart Status',
        cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
        width: '120',
        maxWidth: '250',
        allowCellFocus: false,
        visible: false,
        isConditionallyVisibleColumn: true
      },
      {
        field: 'Name',
        displayName: 'Bin Name',
        enableSorting: true,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '250'
      },
      {
        field: 'warehouseName',
        displayName: 'Warehouse Name',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '250'
      },
      {
        field: 'parentWHName',
        displayName: 'Parent Warehouse',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '210'
      },
      {
        field: 'nickname',
        width: '150',
        displayName: 'Nickname',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
      },
      {
        field: 'prefix',
        width: '150',
        displayName: 'Prefix',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
      },
      {
        field: 'suffix',
        width: '150',
        displayName: 'Suffix',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
      },
      {
        field: 'Description',
        displayName: 'Description',
        width: '300',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
      },
      {
        field: 'warehouseTypeValue',
        displayName: 'Warehouse Type',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center" ng-if="row.entity.warehouseType">'
          + '<span class="label-box" \
                        ng-class="{\'label-warning\':row.entity.warehouseType == grid.appScope.$parent.vm.cartType.SmartCart.key,\
                        \'label-info\':row.entity.warehouseType == grid.appScope.$parent.vm.cartType.ShelvingCart.key,\
                        \'label-primary\':row.entity.warehouseType == grid.appScope.$parent.vm.cartType.Equipment.key}"> \
                            {{COL_FIELD}}'
          + '</span>'
          + '</div>',
        width: '140',
        allowCellFocus: false,
        enableFiltering: false
      },
      {
        field: 'isActiveConvertedValue',
        displayName: 'Status',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.isActive == true, \
                            \'label-warning\':row.entity.isActive == false}"> \
                                {{COL_FIELD}}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.BinStatusOptionsGridHeaderDropdown
        },
        ColumnDataType: 'StringEquals',
        enableFiltering: true,
        enableSorting: false,
        width: '90'
      }, {
        field: 'isPermanentBinConvertedValue',
        displayName: 'Bin Type',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" \
                                        ng-class="{\'label-success\':row.entity.isPermanentBin == true,\
                                        \'label-warning\':row.entity.isPermanentBin == false }"> \
                                            {{COL_FIELD}}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.BinTypeStatusGridHeaderDropdown
        },
        ColumnDataType: 'StringEquals',
        enableFiltering: true,
        enableSorting: false,
        width: '150'
      },
      {
        field: 'binGenerateType',
        displayName: 'Bin Generate Type',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" \
                              ng-class="{\'label-success\':row.entity.isRandom == true,\
                              \'label-warning\':row.entity.isRandom == false }"> \
                                  {{COL_FIELD}}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.BinGenerateTypeStatusGridHeaderDropdown
        },
        ColumnDataType: 'StringEquals',
        enableFiltering: true,
        enableSorting: false,
        width: '150'
      }, {
        field: 'systemGeneratedConvertedValue',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_SYSTEM_GENERATED,
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" \
                              ng-class="{\'label-success\':row.entity.systemGenerated == true,\
                              \'label-warning\':row.entity.systemGenerated == false }"> \
                                  {{COL_FIELD}}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.KeywordStatusGridHeaderDropdown
        },
        ColumnDataType: 'StringEquals',
        enableFiltering: true,
        width: '115'
      },
      {
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
        enableFiltering: true
      }, {
        field: 'updatedbyRole',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }, {
        field: 'createdAt',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableFiltering: false
      },
      {
        field: 'createdby',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        type: 'StringEquals',
        enableFiltering: true
      },
      {
        field: 'createdbyRole',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }];
    const initPageInfo = () => {
      if ($stateParams.warehousetype) {
        vm.WarehouseType = null;
        const searchState = angular.copy($stateParams.warehousetype.replace(' ', ''));
        if (searchState === vm.cartType.SmartCart.value.replace(' ', '')) {
          vm.WarehouseType = vm.cartType.SmartCart.key;
        }
        else if (searchState === vm.cartType.ShelvingCart.value.replace(' ', '')) {
          vm.WarehouseType = vm.cartType.ShelvingCart.key;
        }
        else if (searchState === vm.cartType.Equipment.value.replace(' ', '')) {
          vm.WarehouseType = vm.cartType.Equipment.key;
        }
        else {
          $state.transitionTo($state.$current, { warehousetype: '' }, {
            location: true,
            inherit: true,
            notify: false
          });
        }
      }
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['Name', 'ASC']],
        SearchColumns: [],
        pageName: CORE.PAGENAME_CONSTANT[19].PageName,
        isPrint: true
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
      exporterCsvFilename: vm.IsBIn ? 'Warehouse.csv' : 'Bin.csv'
    };

    //to create search crieteria equivalent to all filters.
    vm.genSearch = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      // vm.pagingInfo.Page = CORE.UIGrid.Page();
      if (vm.WarehouseType) {
        if (vm.WarehouseType === 'All') {
          const searchObjIndex = _.findIndex(vm.pagingInfo.SearchColumns, { ColumnName: 'warehouseType' });
          if (searchObjIndex !== -1) {
            vm.pagingInfo.SearchColumns.splice(searchObjIndex, 1);
          }
        } else {
          vm.pagingInfo.SearchColumns.push({ ColumnName: 'warehouseType', SearchString: vm.WarehouseType, ColumnDataType: 'StringEquals' });
        }
      }
      if (vm.searchNameNickname) {
        let columnDataType = null;
        if (vm.searchType === CORE.CustomSearchTypeForList.Exact) {
          columnDataType = 'StringEquals';
        }

        const itemIndexName = _.findIndex(vm.pagingInfo.SearchColumns, { ColumnName: 'Name' });
        if (itemIndexName !== -1) {
          vm.pagingInfo.SearchColumns.splice(itemIndexName, 1);
        }

        const itemIndexNickname = _.findIndex(vm.pagingInfo.SearchColumns, { ColumnName: 'nickname' });
        if (itemIndexNickname !== -1) {
          vm.pagingInfo.SearchColumns.splice(itemIndexNickname, 1);
        }

        const itemIndexWHName = _.findIndex(vm.pagingInfo.SearchColumns, { ColumnName: 'warehouseName' });
        if (itemIndexWHName !== -1) {
          vm.pagingInfo.SearchColumns.splice(itemIndexWHName, 1);
        }
        vm.pagingInfo.SearchColumns.push({ ColumnName: 'Name', SearchString: vm.searchNameNickname, ColumnDataType: columnDataType, isExternalSearch: true });
        vm.pagingInfo.SearchColumns.push({ ColumnName: 'nickname', SearchString: vm.searchNameNickname, ColumnDataType: columnDataType, isExternalSearch: true });
        vm.pagingInfo.SearchColumns.push({ ColumnName: 'warehouseName', SearchString: vm.searchNameNickname, ColumnDataType: columnDataType, isExternalSearch: true });
      }
      vm.pagingInfo.searchOnlyEmptyBin = vm.searchOnlyEmptyBin;
    };
    vm.scanSearchKey = ($event) => {
      $timeout(() => {
        if ($event.keyCode === 13) {
          vm.advanceFilterSearch();
        }
      });
    };
    vm.advanceFilterSearch = () => {
      const queryStr = angular.copy(vm.WarehouseType);
      if (queryStr) {
        $state.transitionTo($state.$current, { warehousetype: queryStr === 'All' ? '' : queryStr.replace(' ', '') }, {
          location: true,
          inherit: true,
          notify: false
        });
      }
      vm.pagingInfo.Page = vm.gridOptions.paginationCurrentPage = CORE.UIGrid.Page();
      vm.loadData();
    };
    vm.resetPage = () => {
      $state.transitionTo($state.$current, { warehousetype: '' }, {
        location: true,
        inherit: true,
        notify: false
      });
      vm.searchNameNickname = null;
      vm.searchWarehouse = null;
      vm.WarehouseType = vm.default;
      vm.pagingInfo.SearchColumns = [];
      vm.searchType = CORE.CustomSearchTypeForList.Contains;
      vm.searchTypeWarehouse = CORE.CustomSearchTypeForList.Contains;
      vm.searchOnlyEmptyBin = false;
      BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
    };

    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICall = (bin, isGetDataDown) => {
      if (bin && bin.data && bin.data.bin) {
        if (!isGetDataDown) {
          vm.sourceData = bin.data.bin;
          vm.currentdata = vm.sourceData.length;
        }
        else if (bin.data.bin.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(bin.data.bin);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        processBin();
        // must set after new data comes
        vm.totalSourceDataCount = bin.data.Count;
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
            if ($scope.$parent.vm) {
              $scope.$parent.vm.isFoundAnyBin = true;
            }
          }
          else {
            vm.isNoDataFound = true;
            vm.emptyState = null;
            if ($scope.$parent.vm) {
              $scope.$parent.vm.isFoundAnyBin = false;
            }
          }
        }
        else {
          vm.isNoDataFound = false;
          vm.emptyState = null;
          if ($scope.$parent.vm) {
            $scope.$parent.vm.isFoundAnyBin = true;
          }
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

    //get defect category data for grid bind
    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      //Clear UMID request on load/reload of grid
      if (vm.sourceData) {
        cancelRequest();
      }
      vm.genSearch();
      if (vm.pagingInfo.SortColumns.length === 0) {
        vm.pagingInfo.SortColumns = [['Name', 'ASC']];
      }
      if (warehouseId && warehouseId > 0) {
        vm.pagingInfo.warehouseId = warehouseId;
      }
      vm.pagingInfo.Isbin = vm.Isbin;
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = BinFactory.retriveBinList().query(vm.pagingInfo).$promise.then((bin) => {
        if (bin && bin.data) {
          setDataAfterGetAPICall(bin, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //get data down
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = BinFactory.retriveBinList().query(vm.pagingInfo).$promise.then((bin) => {
        if (bin && bin.data) {
          setDataAfterGetAPICall(bin, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const processBin = () => {
      _.map(vm.sourceData, (item) => {
        if (item.warehouseType === vm.cartType.SmartCart.key) {
          item.isDisabledDelete = true;
        }
        if (item.systemGenerated) {
          item.isDisabledUpdate = true;
          item.isDisabledDelete = true;
          item.isRowSelectable = false;
          item.isDisabledUMIDHistory = true;
        }
      });
    };

    vm.fab = {
      status: false
    };

    //Proceed for show light if click on Light icon from action column
    vm.showLightForUMID = (row, ev) => {
      if (!vm.clickButton) {
        vm.gridOptions.gridApi.selection.selectRow(row);
        $timeout(() => {
          //If flag is true than can not click on light icon
          vm.clickButton = true;
          vm.changeEvent(true, ev);
        });
      }
    };

    //If use Show Light / Cancel switch at top right side
    vm.changeEvent = (button, ev) => {
      if (button) {
        vm.searchbyUMID(ev);
      } else {
        vm.cancelSearch(ev);
      }
    };

    //check parts are selected or not and if selected than its smart cart or not
    vm.checkPartForSearch = () => {
      if (vm.selectedRowsList && vm.selectedRowsList.length > 0) {
        return false;
      } else {
        return true;
      }
    };

    //search by umid api call from here on changeof checkbox
    vm.searchbyUMID = () => {
      var emptyBinList = _.filter(vm.selectedRowsList, (carts) => carts.uid === null);
      if (emptyBinList.length > 0) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SELECT_BIN_WITH_UMID);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
        //To show status on switch at top, i.e. if search for UMID than switch is on else switch is off
        vm.showStatus = false;
        vm.clickButton = false;
        return;
      }

      const smartCartList = _.filter(vm.selectedRowsList, (carts) => carts.warehouseType === vm.cartType.SmartCart.key);
      if (smartCartList.length > 0) {
        const dept = getLocalStorageValue(vm.loginUser.employee.id);
        if (_.find(vm.selectedRowsList, (selectDept) => selectDept.departmentID !== dept.department.ID) && !vm.isComapnyLevel) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.INOAUTO_DEPARTMENT_VALIDATION);
          messageContent.message = stringFormat(messageContent.message, dept.department.Name);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
          //To show status on switch at top, i.e. if search for UMID than switch is on else switch is off
          vm.showStatus = false;
          vm.clickButton = false;
          return;
        } else {
          //vm.isComapnyLevel => used to search at company level
          checkColorAvailibility(vm.isComapnyLevel ? 0 : dept.department.ID);
        }
      } else {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SEARCH_ONLY_SMART_CART_UMID);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model, commonCancelFunction);
      }
    };

    //check color availability to prompt in cart
    function checkColorAvailibility(departmentID) {
      ReceivingMaterialFactory.getPromptIndicatorColor().query({
        pcartMfr: CORE.InoautoCart, prefDepartmentID: departmentID
      }).$promise.then((res) => {
        if (res && res.data && res.data.promptColors.length > 0) {
          vm.promptColorDetails = res.data.promptColors[0];
          vm.TimeOut = res.data.defaultTimeout && res.data.defaultTimeout[0].values ? res.data.defaultTimeout[0].values : CORE.CANCEL_REQUSET_TIMEOUT;
          funSearchByUMID(departmentID);
        } else {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PROMPT_ALREADY_USE);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          //color is not available message prompt
          DialogFactory.messageAlertDialog(model);
          return;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    //Remove light and hide Smart Cart Status column when cancel request
    function commonCancelFunction() {
      vm.gridOptions.clearSelectedRows();
      _.map(vm.sourceData, funUMIDList);
      const objStatus = _.find(vm.sourceHeader, (pheader) => pheader.field === 'inovexStatus');
      if (objStatus) {
        const index = _.indexOf(vm.sourceHeader, objStatus);
        vm.sourceHeader[index].visible = false;
      }
      $scope.$broadcast('showlight-receive', false);
      vm.showStatus = false;
      //To maintain transaction using ID
      vm.transactionID = null;
      vm.clickButton = false;
    }

    //Generate request to inovaxe to show light for BIN(UMID)
    function funSearchByUMID(departmentID) {
      vm.transactionID = getGUID();
      $scope.$emit('transferMaterial', vm.transactionID);
      const objSearchPartUMID = {
        UIDs: _.map(vm.selectedRowsList, 'uid'),
        PromptIndicator: vm.promptColorDetails.ledColorValue,
        ledColorID: vm.promptColorDetails.id,
        Priority: 0,
        TimeOut: vm.TimeOut,
        UserName: vm.loginUser.username,
        InquiryOnly: 0,
        departmentID: departmentID ? departmentID : null,
        TransactionID: vm.transactionID,
        Department: departmentID ? vm.selectedRowsList[0].parentWHName : '*',
        ReelBarCode: null
      };
      WarehouseBinFactory.sendRequestToSearchPartByUMID().query(objSearchPartUMID).$promise.then((response) => {
        if (response.status === 'FAILED') {
          vm.showStatus = false;
          vm.transactionID = null;
          $scope.$emit('transferMaterial', vm.transactionID);
          vm.clickButton = false;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    //Reset values for Light icon and Smart Cart Status column
    function funUMIDList(row) {
      row.inovexStatus = null;
      row.ledColorCssClass = null;
      row.ledColorName = null;
    }

    //cancel Request for search by umid
    vm.cancelSearch = () => {
      cancelRequest();
    };

    //Process for cancel request of BIN(UMID) search
    function cancelRequest(isManualCancel) {
      if (vm.transactionID) {
        const objTrans = {
          TransactionID: vm.transactionID,
          ReasonCode: CORE.InoAuto_Error_ReasonCode.CancelTask.Code,
          ReasonMessage: CORE.InoAuto_Error_ReasonCode.CancelTask.Message
        };
        if (isManualCancel) {
          objTrans.isManualCancel = true;
        }
        WarehouseBinFactory.sendRequestToCancelCartRequest().query(objTrans).$promise.then(() => {
          if (isManualCancel) {
            commonCancelFunction();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        commonCancelFunction();
      }
    }

    //Callback function when UMID request will get responce using Socket
    function updateUMIDRequest(response) {
      if (vm.transactionID === response.response.TransactionID && !vm.showStatus) {
        //$scope.$broadcast('showlight-receive', true);
        vm.showStatus = true;
        vm.response = response.response;
        const selectedPkg = response.response.ChosenPackages;
        const notFoundedPkg = response.response.UIDNotFound;
        const notAvailablePkg = response.response.UnavailablePackages;
        //add color for selected pkg Department
        _.each(selectedPkg, (item) => {
          var objUMID = _.find(vm.sourceData, (umid) => umid.uid === item.UID);
          if (objUMID) {
            objUMID.ledColorCssClass = vm.promptColorDetails.ledColorCssClass;
            objUMID.ledColorName = vm.promptColorDetails.ledColorName;
          }
        });
        _.map(selectedPkg, funChoosen);
        _.map(notFoundedPkg, funNotFound);
        _.map(notAvailablePkg, funNotAvailable);
        const sourceInovaxeHeader = _.find(vm.sourceHeader, (inoHeader) => inoHeader.field === 'inovexStatus');
        if (sourceInovaxeHeader) {
          vm.sourceHeader[vm.sourceHeader.indexOf(sourceInovaxeHeader)].visible = true;
        }
        $timeout(() => { vm.resetSourceGrid(); });
        if (selectedPkg.length === 0) {
          vm.clickButton = false;

          let messageContent = null;
          if (notAvailablePkg.length === 0) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.INOAUTO_UIDNOTFOUND);
          } else {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.INOAUTO_NOTAVAILABLE);
          }

          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model, commonCancelFunction);
          return;
        }
      }
    }

    //Set Smart Cart Status column value to 'Chosen' for selected row
    function funChoosen(row) {
      var Chosen = _.find(vm.sourceData, (Chosen) => Chosen.uid === row.UID);
      if (Chosen) {
        Chosen.inovexStatus = CORE.InoAuto_Search_Status.Chosen;
      }
    }

    //Set Smart Cart Status column value to 'Not Found' for selected row
    function funNotFound(row) {
      var notFound = _.find(vm.sourceData, (notFound) => notFound.uid === row);
      if (notFound) {
        notFound.inovexStatus = CORE.InoAuto_Search_Status.NotFound;
      }
    }

    //Set Smart Cart Status column value to 'Not Available' for selected row
    function funNotAvailable(row) {
      var notAvailable = _.find(vm.sourceData, (notAvailable) => notAvailable.uid === row.UID);
      if (notAvailable) {
        notAvailable.inovexStatus = CORE.InoAuto_Search_Status.NotAvailable;
      }
    }

    //received details for cancel request
    function updateCancelRequestStatus(req) {
      //Check if requested transaction is generated from current screen and
      //flag vm.open is false than request for cancel
      if (req.transactionID === vm.transactionID && !vm.open) {
        cancelRequestAlert(req);
      }
    }
    //cancel request
    function cancelRequestAlert(req) {
      if (req.code === CORE.INO_AUTO_RESPONSE.SUCCESS) {
        NotificationFactory.success(req.message);
        vm.success = true;
        return;
      }
      else {
        commonCancelFunction();
        vm.open = true;
        let messageContent = null;
        if (req.code === CORE.INO_AUTO_RESPONSE.CANCEL) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SEARCH_CANCEL_MANUALLY);
        } else {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SEARCH_CANCEL_TIMEOUT);
        }
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model, callbackCancel);
        return;
      }
    }

    //set flag false
    function callbackCancel() {
      vm.open = false;
    }

    // delete user
    vm.deleteRecord = (bin) => {
      let selectedIDs = [];
      if (bin) {
        selectedIDs.push(bin.id);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((binitem) => binitem.id);
        }
      }

      const smartCartList = _.filter(vm.sourceData, (item) => selectedIDs.indexOf(item.id) !== -1 && item.warehouseType === vm.cartType.SmartCart.key);
      if (smartCartList.length > 0) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.CART_BIN_NOT_DELETE_ALERT);
        const obj = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(obj);
        return;
      }

      if (selectedIDs) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Bin', selectedIDs.length);
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
            //BinFactory.checkBinStatusWithUMID().query(selectedIDs).$promise.then((res) => {
            //if (res && res.data) {
            //    let alertmodel = {
            //        title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
            //        textContent: TRANSACTION.NOT_DELETE_USE_BIN_IN_OTHER
            //    };
            //    DialogFactory.alertDialog(alertmodel);
            //    return;
            //} else {
            vm.cgBusyLoading = BinFactory.deleteBin().query({ objIDs: objIDs }).$promise.then((res) => {
              if (res && res.data) {
                if (res.data.length > 0 || res.data.transactionDetails) {
                  const data = {
                    TotalCount: res.data.transactionDetails[0].TotalCount,
                    pageName: CORE.PageName.bin
                  };
                  BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                    const IDs = {
                      id: selectedIDs,
                      CountList: true
                    };
                    return BinFactory.deleteBin().query({ objIDs: IDs }).$promise.then((res) => {
                      let data = {};
                      data = res.data;
                      data.pageTitle = bin ? bin.Name : null;
                      data.PageName = CORE.PageName.bin;
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
    };

    /* delete multiple data called from directive of ui-grid*/
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };
    //to show history of bin
    vm.UMIDHistory = (row) => {
      DialogFactory.dialogService(
        CORE.BIN_HISTORY_MODAL_CONTROLLER,
        CORE.BIN_HISTORY_MODAL_VIEW,
        event,
        row).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    };

    //open transfer binpopup
    vm.transferBin = (row, ev) => {
      DialogFactory.dialogService(
        TRANSACTION.BIN_TRANSFER_POPUP_CONTROLLER,
        TRANSACTION.BIN_TRANSFER_POPUP_VIEW,
        ev,
        row).then(() => {
        }, () => {
          BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
        }, (err) => BaseService.getErrorLog(err));
    };


    /* update defect category*/
    vm.updateRecord = (row, ev) => {
      DialogFactory.dialogService(
        TRANSACTION.TRANSACTION_BIN_ADD_UPDATE_MODAL_CONTROLLER,
        TRANSACTION.TRANSACTION_BIN_ADD_UPDATE_MODAL_VIEW,
        ev,
        row.entity).then(() => {
        }, (data) => {
          if (data) {
            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
          }
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };
    /* add component field alias */
    vm.showalias = (row, ev) => {
      var model = {
        reftablename: CORE.table_name.bin,
        refid: row.id,
        isaliassmallletter: true
      };
      DialogFactory.dialogservice(
        CORE.component_field_generic_alias_controller,
        CORE.component_field_generic_alias_view,
        ev,
        model).then(() => {
          BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
        },
          () => {
          }, (err) => BaseService.getErrorLog(err));
    };

    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, { closeall: true });
    });
    $rootScope.$on('BinEvent', () => {
      BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
    });

    vm.addEditRecordBin = (data, ev) => {
      DialogFactory.dialogService(
        TRANSACTION.TRANSACTION_BIN_ADD_UPDATE_MODAL_CONTROLLER,
        TRANSACTION.TRANSACTION_BIN_ADD_UPDATE_MODAL_VIEW,
        ev,
        data).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };

    //multiple prints
    $scope.$on('PrintDocument', (ev, data) => {
      $scope.PrintDocument(data.data, data.ev);
    });

    vm.printRecord = (row, ev) => {
      $scope.PrintDocument(row, ev);
    };

    $scope.PrintDocument = (row) => {
      vm.rowData = {};
      if (row && row.entity) {
        vm.rowData = row.entity;
      } else {
        vm.rowData.selectedRecord = row;
      }
      vm.rowData.pageName = TRANSACTION.TRANSACTION_BIN_LABEL;
      DialogFactory.dialogService(
        CORE.PRINT_BARCODE_LABEL_MODAL_CONTROLLER,
        CORE.PRINT_BARCODE_LABEL_MODAL_VIEW,
        event,
        vm.rowData).then(() => {
        }, (printerDetailList) => {
          if (printerDetailList) {
            const printList = [];
            let printObj;
            _.each(printerDetailList, (data) => {
              printObj = {
                'binName': data.binName,
                'count': 1,
                'numberOfPrint': data.noPrint,
                'reqName': 'Print',
                'PrinterName': data.PrinterName,
                'ServiceName': data.ServiceName,
                'printType': data.printType,
                'pageName': TRANSACTION.TRANSACTION_BIN_LABEL
              };
              printList.push(printObj);
            });
            vm.cgBusyLoading = ReceivingMaterialFactory.printLabelTemplate().query({ printObj: printList }).$promise.then(() => {
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    // [S] Socket Listeners
    function connectSocket() {
      socketConnectionService.on(CORE.Socket_IO_Events.InoAuto.updateUMIDRequest, updateUMIDRequest);
      socketConnectionService.on(CORE.Socket_IO_Events.InoAuto.updateCancelRequest, updateCancelRequestStatus);
    }
    connectSocket();

    socketConnectionService.on('reconnect', () => {
      connectSocket();
    });
    function removeSocketListener() {
      socketConnectionService.removeListener(CORE.Socket_IO_Events.InoAuto.updateUMIDRequest, updateUMIDRequest);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.InoAuto.updateCancelRequest, updateCancelRequestStatus);
    }


    $scope.$on('$destroy', () => {
      // Remove socket listeners
      cancelRequest();
      removeSocketListener();
    });

    // on disconnect socket
    socketConnectionService.on('disconnect', () => {
      removeSocketListener();
    });
  }
})();
