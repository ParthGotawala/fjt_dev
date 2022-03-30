(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('manufacturersList', manufacturersList);

  /** @ngInject */
  function manufacturersList(CORE, USER, BaseService, $timeout, ManufacturerFactory, $state, DialogFactory) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        type: '=?',
        isChangeFromPopup: '=?',
        applyAsCustomerCallbackFn: '=',
        fromPageRequest: '=?'
      },
      templateUrl: 'app/directives/custom/manufacturers-list/manufacturers-list.html',
      controller: manufacturersListCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function manufacturersListCtrl($scope) {
      var vm = this;
      vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.MANUFACTURER;
      vm.CustomSearchTypeForList = CORE.CustomSearchTypeForList;
      vm.allMfgsModel = { searchText: null, searchType: CORE.CustomSearchTypeForList.Contains };
      vm.isHideDelete = true;
      vm.debounceTime = CORE.DEBOUNCE_TIME_INTERVAL;
      vm.mfgTypeDist = CORE.MFG_TYPE.DIST;
      vm.searchAndSelectToUpdate = CORE.SEARCH_SELECT_TO_UPDATE_HINT;
      vm.LabelConstant = CORE.LabelConstant;
      vm.mfgType = $scope.type ? $scope.type : CORE.MFG_TYPE.MFG;
      const isChangeFromPopup = $scope.isChangeFromPopup ? $scope.isChangeFromPopup : false;
      const fromPageRequest = $scope.fromPageRequest;
      vm.loginUser = BaseService.loginUser;
      const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;

      vm.sourceHeader = [
        {
          field: '#',
          width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
          cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
          enableFiltering: false,
          enableSorting: false
        },
        {
          field: 'mfgCode',
          width: '100',
          displayName: 'Code',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableFiltering: true,
          enableSorting: true,
          allowCellFocus: false
        },
        {
          field: 'mfgName',
          width: '280',
          displayName: vm.mfgType === vm.mfgTypeDist ? 'Company' : 'Business Name',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableFiltering: true,
          enableSorting: true,
          allowCellFocus: false
        },
        {
          field: 'aliaslist',
          width: '400',
          displayName: 'Alias',
          cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" ng-repeat="item in row.entity.aliaslistWithNewLine track by $index">\
                    <span>{{item.alias}}</span>&nbsp;\
                    <md-icon md-font-icon="icons-map-manufacturer" ng-if="item.isMapped"><md-tooltip>Mapped</md-tooltip></md-icon>\
                    <md-icon md-font-icon="icon-eye"><md-tooltip md-direction="top" class="tt-multiline">Created By: {{item.createdBy}} <br />Created At: {{item.createdAt | date:vm.DefaultDateFormat}}</md-tooltip></md-icon>\
          <md-icon md-font-icon="icon-history" ng-click="grid.appScope.$parent.vm.viewWhereUsed(row.entity, item.alias,$event)"><md-tooltip>Where Used</md-tooltip></md-icon>\
                  </div>',
          enableFiltering: true,
          enableSorting: true,
          allowCellFocus: false
        }
      ];

      vm.sourceHeader.unshift(
        {
          field: 'Apply',
          displayName: 'Select',
          width: '75',
          cellTemplate: '<div class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox" style="overflow:initial"><md-checkbox ng-model="row.entity.isRecordSelectedForUpdate" \
                           ng-disabled="row.entity.isDisabledUpdate" ng-change="grid.appScope.$parent.vm.setMFGAsCustomerOrUpdate(row.entity)"></md-checkbox>',
          enableFiltering: false,
          enableSorting: false,
          exporterSuppressExport: true,
          pinnedLeft: false,
          enableColumnMoving: false,
          manualAddedCheckbox: true
        });

      if (vm.mfgType === CORE.MFG_TYPE.MFG) {
        vm.sourceHeader.push(
          {
            field: 'isCustOrDistyText',
            width: '330',
            displayName: 'Current Status(Manufacturer/Customer)',
            cellTemplate: '<div class="ui-grid-cell-contents text-left" style="width:100%; float:left; overflow:hidden;">\
                                    <span class="label-box" ng-class="grid.appScope.$parent.vm.getMFGTypeCurrStatusClassName(row.entity.isCustOrDistyText)">\
                                    {{COL_FIELD}}\
                                    </span>\
                                    </div>',
            enableFiltering: false,
            enableSorting: false
          }
        );
      }
      else {
        const objAuthorize = {
          field: 'authorizeTypeTxt',
          width: '200',
          displayName: 'Authorize Type',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableFiltering: true,
          enableSorting: true
        };
        vm.sourceHeader.splice(5, 0, objAuthorize);
      }

      const initPageInfo = () => {
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),
          SortColumns: [['mfgCode', 'ASC']],
          SearchColumns: [],
          MfgType: vm.mfgType,
          SearchText: vm.allMfgsModel.searchText
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
        allowToExportAllData: true,
        exporterCsvFilename: vm.mfgType === CORE.MFG_TYPE.MFG ? 'Manufacturers/Customer.csv' : 'Supplier.csv',
        exporterAllDataFn: () => {
          const pagingInfoOld = _.clone(vm.pagingInfo);
          pagingInfoOld.pageSize = 0;
          pagingInfoOld.Page = 1;
          vm.gridOptions.isExport = pagingInfoOld.isExport = true;
          return ManufacturerFactory.getAllManufacturers().query(pagingInfoOld).$promise.then((manufacturer) => {
            if (manufacturer.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              //setDataAfterGetAPICall(manufacturer, false);
              if (manufacturer && manufacturer.data.mfgCode) {
                formatMfgGridData(manufacturer.data.mfgCode);
                return manufacturer.data.mfgCode;
              }
              return [];
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      function setDataAfterGetAPICall(manufacturer, isGetDataDown) {
        if (manufacturer && manufacturer.data.mfgCode) {
          formatMfgGridData(manufacturer.data.mfgCode);
          if (!isGetDataDown) {
            vm.sourceData = manufacturer.data.mfgCode;
            vm.currentdata = vm.sourceData.length;
          }
          else if (manufacturer.data.mfgCode.length > 0) {
            vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(manufacturer.data.mfgCode);
            vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
          }
          if (vm.sourceData && vm.sourceData.length > 0) {
            _.each(vm.sourceData, (item) => {
              item.isRecordSelectedForUpdate = false;
              if (item.isCustOrDisty) {
                item.isRowSelectable = false;
              }
            });
            const mfgObj = _.find(vm.sourceData, (x) => x.id === 0);
            if (mfgObj) {
              mfgObj.isDisabledUpdate = mfgObj.isDisabledDelete = true;
              mfgObj.isRowSelectable = false;
            }
          }
          // must set after new data comes
          vm.totalSourceDataCount = manufacturer.data.Count;
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
            if (vm.pagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode) || vm.pagingInfo.SearchText) {
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

      vm.loadData = () => {
        //if (vm.allMfgsModel.searchText) {
        //  setExternalSearchFilter();
        //}
        vm.pagingInfo.SearchText = vm.allMfgsModel.searchText;
        vm.pagingInfo.isExactSearch = vm.allMfgsModel.searchType === CORE.CustomSearchTypeForList.Exact ? true : false;
        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        vm.cgBusyLoading = ManufacturerFactory.getAllManufacturers().query(vm.pagingInfo).$promise.then((manufacturer) => {
          if (manufacturer.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            setDataAfterGetAPICall(manufacturer, false);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      const formatMfgGridData = (gridRows) => {
        _.each(gridRows, (item) => {
          const Aliaslist = [];
          item.aliaslistWithNewLine = item.aliaslist ? item.aliaslist.split('###') : null;
          _.each(item.aliaslistWithNewLine, (aliasSplit, index) => {
            aliasSplit = aliasSplit.split('@@@');
            if (Array.isArray(aliasSplit) && aliasSplit.length > 0) {
              const objSplitter = {
                alias: aliasSplit[0],
                isMapped: parseInt(aliasSplit[1]),
                createdBy: aliasSplit[2],
                createdAt: aliasSplit[3]
              };
              item.aliaslistWithNewLine[index] = objSplitter;
              Aliaslist.push(aliasSplit[0]);
            }
          });
          //item.aliaslist = item.aliaslist ? item.aliaslist.replace(/@@@\d+###/g, ', ').replace(/@@@\d+/g, '') : null;
          item.aliaslist = Aliaslist ? Aliaslist.join(',') : null;
        });
      };

      //get data down
      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.cgBusyLoading = ManufacturerFactory.getAllManufacturers().query(vm.pagingInfo).$promise.then((manufacturer) => {
          setDataAfterGetAPICall(manufacturer, true);
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* manual search by user to search exact or contains matching records */
      vm.searchMFGData = (isReset) => {
        if (isReset) {
          initPageInfo();
          vm.allMfgsModel.searchText = null;
          vm.allMfgsModel.searchType = vm.CustomSearchTypeForList.Contains;
          vm.gridOptions.gridApi.grid.clearAllFilters();
        }
        else {
          vm.pagingInfo.Page = CORE.UIGrid.Page();
          if (!vm.allMfgsModel.searchText) {
            /* to avoid duplicate filter data adding in list */
            if (vm.pagingInfo.SearchColumns.length > 0) {
              _.remove(vm.pagingInfo.SearchColumns, (item) => item.isExternalSearch);
            }
          }
        }
        vm.loadData();
      };

      /* set curr status of mfg added */
      vm.getMFGTypeCurrStatusClassName = (mfgStatusText) => {
        const type = _.find(CORE.MfgAddedAsCurrStatus, (item) => item.mfgAddedAsText === mfgStatusText);
        return type ? type.className : '';
      };

      vm.setMFGAsCustomerOrUpdate = (row) => {
        if (!row.isRecordSelectedForUpdate) {  /* unselect check box case */
          row.isRecordSelectedForUpdate = false;
          vm.gridOptions.clearSelectedRows();
          return;
        }

        /* select check box case */
        const confObj = {
          messageContent: '',
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };

        if (fromPageRequest === CORE.MFG_TYPE.CUSTOMER) {
          if (isChangeFromPopup) { /* from popup allowed to set/update information inside popup */
            if (row.mfgType === CORE.MFG_TYPE.MFG && (!row.isCustOrDisty)) {
              confObj.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.SET_MFG_AS_CUSTOMER_TOO);
            }
            else {
              confObj.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.WANT_TO_EDIT_RECORD);
            }
            DialogFactory.messageConfirmDialog(confObj).then((yes) => {
              if (yes) {
                row.isRecordSelectedForUpdate = false;
                vm.gridOptions.clearSelectedRows();
                $scope.applyAsCustomerCallbackFn(row.id, true);
              }
            }, () => {
              row.isRecordSelectedForUpdate = false;
              vm.gridOptions.clearSelectedRows();
            }).catch((error) => BaseService.getErrorLog(error));
          } else {
            const routeInfo = {
              selectedRow: row,
              confObj: confObj
            };
            if (row.mfgType === CORE.MFG_TYPE.MFG && (!row.isCustOrDisty || row.isCustOrDisty === null)) {
              // set mfg as customer case : move to manage manufacturer
              routeInfo.state = USER.ADMIN_MANAGEMANUFACTURER_DETAIL_STATE;
              routeInfo.customerType = CORE.CUSTOMER_TYPE.MANUFACTURER;
              moveToEntityManageState(routeInfo);
            }
            else {  // mfg already added as customer case : move to manage customer page
              routeInfo.state = USER.ADMIN_MANAGECUSTOMER_DETAIL_STATE;
              routeInfo.customerType = CORE.CUSTOMER_TYPE.CUSTOMER;
              moveToEntityManageState(routeInfo);
            }
          }
        }
        else if (fromPageRequest === CORE.MFG_TYPE.DIST) {
          if (isChangeFromPopup) { /* from popup allowed to set/update information inside popup */
            confObj.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.WANT_TO_EDIT_RECORD);
            DialogFactory.messageConfirmDialog(confObj).then((yes) => {
              if (yes) {
                row.isRecordSelectedForUpdate = false;
                vm.gridOptions.clearSelectedRows();
                $scope.applyAsCustomerCallbackFn(row.id, true);
              }
            }, () => {
              row.isRecordSelectedForUpdate = false;
              vm.gridOptions.clearSelectedRows();
            }).catch((error) => BaseService.getErrorLog(error));
          } else {
            const routeInfo = {
              state: USER.ADMIN_MANAGESUPPLIER_DETAIL_STATE,
              customerType: CORE.CUSTOMER_TYPE.SUPPLIER,
              selectedRow: row,
              confObj: confObj
            };
            moveToEntityManageState(routeInfo);
          }
        }
        else if (fromPageRequest === CORE.MFG_TYPE.MFG) {
          if (isChangeFromPopup) { /* from popup allowed to set/update information inside popup */
            confObj.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.WANT_TO_EDIT_RECORD);
            DialogFactory.messageConfirmDialog(confObj).then((yes) => {
              if (yes) {
                row.isRecordSelectedForUpdate = false;
                vm.gridOptions.clearSelectedRows();
                $scope.applyAsCustomerCallbackFn(row.id, true);
              }
            }, () => {
              row.isRecordSelectedForUpdate = false;
              vm.gridOptions.clearSelectedRows();
            }).catch((error) => BaseService.getErrorLog(error));
          } else {
            const routeInfo = {
              state: USER.ADMIN_MANAGEMANUFACTURER_DETAIL_STATE,
              customerType: CORE.CUSTOMER_TYPE.MANUFACTURER,
              selectedRow: row,
              confObj: confObj
            };
            moveToEntityManageState(routeInfo);
          }
        }
      };

      /* move to customer manage state with defined entity */
      const moveToEntityManageState = (routeInfo) => {
        routeInfo.confObj.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.WANT_TO_EDIT_RECORD);
        DialogFactory.messageConfirmDialog(routeInfo.confObj).then((yes) => {
          if (yes) {
            routeInfo.selectedRow.isRecordSelectedForUpdate = false;
            vm.gridOptions.clearSelectedRows();
            $state.go(routeInfo.state, { customerType: routeInfo.customerType, cid: routeInfo.selectedRow.id }, { reload: true });
          }
        }, () => {
          routeInfo.selectedRow.isRecordSelectedForUpdate = false;
          vm.gridOptions.clearSelectedRows();
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.changeSearchType = () => {
        vm.loadData();
      };
      vm.viewWhereUsed = (rowDet, code, ev) => {
        let mfgTypeLabel = vm.LabelConstant.MFG.Supplier;
        if (vm.mfgType !== CORE.MFG_TYPE.DIST) {
          mfgTypeLabel = rowDet.isCustOrDistyText === 'Both' ? vm.LabelConstant.MFG.Customer + '/' + vm.LabelConstant.MFG.Manufacturers : vm.LabelConstant.MFG.Manufacturers;
        }

        const mfgDetail = {
          name: rowDet.mfgName,
          mfgCode: code,
          isManufacturer: (vm.mfgType === CORE.MFG_TYPE.DIST ? false : true),
          mfgTypeLabel: mfgTypeLabel
        };
        DialogFactory.dialogService(
          CORE.VIEW_WHEREUSED_MANUFACTURER_MODAL_CONTROLLER,
          CORE.VIEW_WHEREUSED_MANUFACTURER_MODAL_VIEW,
          ev,
          mfgDetail).then(() => { }, () => { }).catch((error) => BaseService.getErrorLog(error));
      };
    }
  }
})();
