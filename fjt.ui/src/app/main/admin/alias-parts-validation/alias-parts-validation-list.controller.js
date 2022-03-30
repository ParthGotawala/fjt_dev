(function () {
  'use strict';

  angular
    .module('app.admin.aliasPartsValidation')
    .controller('AliasPartsValidationListController', AliasPartsValidationListController);

  /** @ngInject */
  function AliasPartsValidationListController($mdDialog, $scope, $q, $timeout, CORE, USER, AliasPartsValidationFactory, DialogFactory, BaseService) {
    const vm = this;
    vm.isUpdatable = true;
    vm.isCopyAliasPartValidations = true;
    vm.DefaultDateTimeFormat = _dateTimeDisplayFormat;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.ALIAS_PARTS_VALIDATION;
    vm.StatusOptionsGridHeaderDropdown = CORE.StatusOptionsGridHeaderDropdown;
    vm.validationTypeList = CORE.validationTypeOptionsDropdown;
    vm.matchCriteriaList = CORE.matchCriteriaOptionsDropdown;
    vm.gridConfig = CORE.gridConfig;
    vm.view = true;
    vm.LabelConstant = CORE.LabelConstant;
    vm.loginUser = BaseService.loginUser;
    vm.currentPageName = CORE.PageName.alias_parts_validation;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
    vm.sourceHeader = [
      {
        field: 'Action',
        cellClass: 'gridCellColor',
        displayName: 'Action',
        width: '100',
        cellTemplate: '<grid-action-view grid="grid" row="row" number-of-action-button="3"></grid-action-view>',
        enableFiltering: false,
        enableSorting: false,
        exporterSuppressExport: true,
        pinnedLeft: true,
        enableCellEdit: false
      },
      {
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
        enableFiltering: false,
        enableSorting: false,
        enableCellEdit: false
      },
      {
        field: 'typeName',
        width: '200',
        displayName: 'Part Group',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        enableCellEdit: false
      },
      {
        field: 'partTypeName',
        width: '200',
        displayName: 'Functional Type',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        enableCellEdit: false
      },
      {
        field: 'countofGroup',
        width: '200',
        displayName: 'Number of Validations',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
        enableCellEdit: false
      }, {
        field: 'updatedAt',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableFiltering: false
      }, {
        field: 'updatedBy',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }, {
        field: 'updateByRole',
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
        field: 'createdBy',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        type: 'StringEquals',
        enableFiltering: true
      },
      {
        field: 'createByRole',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }
    ];
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
      enableRowHeaderSelection: true,
      enableFullRowSelection: false,
      enableRowSelection: true,
      multiSelect: true,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: `${vm.currentPageName}.csv`
    };

    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICall = (aliasPartsValidation, isGetDataDown) => {
      if (aliasPartsValidation && aliasPartsValidation.data && aliasPartsValidation.data.aliasPartsValidation) {
        if (!isGetDataDown) {
          vm.sourceData = aliasPartsValidation.data.aliasPartsValidation;
          vm.currentdata = vm.sourceData.length;
        }
        else if (aliasPartsValidation.data.aliasPartsValidation.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(aliasPartsValidation.data.aliasPartsValidation);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }

        // must set after new data comes
        vm.totalSourceDataCount = aliasPartsValidation.data.Count;
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

    /* to bind data in grid on load */
    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = AliasPartsValidationFactory.retrieveAliasPartsValidation().query(vm.pagingInfo).$promise.then((aliasPartsValidation) => {
        if (aliasPartsValidation && aliasPartsValidation.data) {
          setDataAfterGetAPICall(aliasPartsValidation, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* to get data on scroll down in grid */
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = AliasPartsValidationFactory.retrieveAliasPartsValidation().query(vm.pagingInfo).$promise.then((aliasPartsValidation) => {
        if (aliasPartsValidation && aliasPartsValidation.data) {
          setDataAfterGetAPICall(aliasPartsValidation, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    /* add.edit  Alias Part Validations records */
    vm.addEditRecord = (data, ev) => {
      DialogFactory.dialogService(
        USER.ADMIN_ALIAS_PARTS_VALIDATION_ADD_UPDATE_MODAL_CONTROLLER,
        USER.ADMIN_ALIAS_PARTS_VALIDATION_ADD_UPDATE_MODAL_VIEW,
        ev,
        data).then(() => {
          BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
        }, (err) => BaseService.getErrorLog(err));
    };
    /* View  Alias Part Validations records */
    vm.viewRecord = (data, ev) => {
      data.entity.isViewOnly = true;
      DialogFactory.dialogService(
        USER.ADMIN_ALIAS_PARTS_VALIDATION_ADD_UPDATE_MODAL_CONTROLLER,
        USER.ADMIN_ALIAS_PARTS_VALIDATION_ADD_UPDATE_MODAL_VIEW,
        ev,
        data.entity).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    };

    /* Open Copy Alias Part Validations popup*/
    vm.copyAliasPartValidations = (data, ev) => {
      DialogFactory.dialogService(
        USER.ADMIN_ALIAS_PARTS_VALIDATION_COPY_CONTROLLER,
        USER.ADMIN_ALIAS_PARTS_VALIDATION_COPY_VIEW,
        ev,
        data).then(() => {
          BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
        }, (err) => BaseService.getErrorLog(err));
    };
    /* update  Alias Part Validations category*/
    vm.updateRecord = (row, ev) => {
      vm.addEditRecord(row.entity, ev);
    };
    //close popup on page destroy
    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, { closeAll: true });
    });
    vm.deleteRecord = (aliasPartsValidation, ev) => {
      let type = [];
      let refRfqPartTypeId = [];
      if (aliasPartsValidation) {
        type.push(aliasPartsValidation.type);
        refRfqPartTypeId.push(aliasPartsValidation.refRfqPartTypeId);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          type = vm.selectedRows.map((aliasPartsValidationItem) => aliasPartsValidationItem.type);
          refRfqPartTypeId = vm.selectedRows.map((aliasPartsValidationItem) => aliasPartsValidationItem.refRfqPartTypeId);
        }
      }
      if (refRfqPartTypeId && type) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, vm.currentPageName, type.length);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        const objDelete = {
          type: type ? type : null,
          refRfqPartTypeId: refRfqPartTypeId ? refRfqPartTypeId : null
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            const objIDs = {
              type: type ? type : null,
              functionalCategoryID: refRfqPartTypeId ? refRfqPartTypeId : null
            };
            return AliasPartsValidationFactory.checkAlternatePartValidationUsed().query({ objIDs: objIDs }).$promise.then((res) => {
              const data = {};
              data.transactionDetails = res.data;
              data.isAlterntePartValidation = true;
              data.PageName = vm.currentPageName;
              if (data.transactionDetails && data.transactionDetails.cnt !== 0) {
                DialogFactory.dialogService(
                  USER.ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER,
                  USER.ADMIN_SHOW_TRANSACTION_DETAILS_VIEW,
                  ev,
                  data).then((res) => {
                    if (res === true) {
                      vm.cgBusyLoading = AliasPartsValidationFactory.deleteAliasPartsValidation().query({
                        objDelete: objDelete
                      }).$promise.then(() => {
                        BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                        vm.gridOptions.clearSelectedRows();
                      }).catch((error) => BaseService.getErrorLog(error));
                    }
                  }, () => {
                  });
              }
              else {
                vm.cgBusyLoading = AliasPartsValidationFactory.deleteAliasPartsValidation().query({
                  objDelete: objDelete
                }).$promise.then(() => {
                  BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                  vm.gridOptions.clearSelectedRows();
                }).catch((error) => BaseService.getErrorLog(error));
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        //show validation message no data selected
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContent.message = stringFormat(messageContent.message, vm.currentPageName);
        const alertmodel = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messaegeAlertDialog(alertmodel);
      }
    };
    /* delete multiple data called from directive of ui-grid*/
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };
    //refresh scanner
    vm.refreshAliasPartsValidation = () => {
      vm.loadData();
    };
  }
})();
