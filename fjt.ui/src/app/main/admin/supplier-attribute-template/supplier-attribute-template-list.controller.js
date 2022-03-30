(function () {
  'use strict';
  angular
    .module('app.admin.supplierattributetemplate')
    .controller('SupplierAttributeTemplateListController', SupplierAttributeTemplateListController);
  /** @nginject */
  function SupplierAttributeTemplateListController($timeout, USER, CORE, DialogFactory, BaseService, SupplierAttributeTemplateFactory) {
    const vm = this;
    vm.isHideDelete = false;
    vm.isUpdatable = true;
    vm.gridConfig = CORE.gridConfig;
    vm.LabelConstant = CORE.LabelConstant;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.SUPPLIER_ATTRIBUTE_TEMPLATE;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [],
        SearchColumns: [],
        pageName: CORE.PAGENAME_CONSTANT[34].PageName
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
      multiSelect: true,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      CurrentPage: CORE.PAGENAME_CONSTANT[34].PageName,
      exporterCsvFilename: 'SupplierAttributeTemplate.csv'
    };

    vm.goToSupplier = (supplierId) => {
      if (supplierId) {
        BaseService.goToSupplierDetail(supplierId);
      }
    };

    vm.sourceHeader = [
      {
        field: 'Action',
        displayName: 'Action',
        width: '100',
        cellTemplate: '<grid-action-view grid="grid" row="row" row="row" style="overflow: hidden;padding:1px !important;overflow: hidden; white-space: nowrap;" class="height-grid ui-grid-cell-contents"></grid-action-view>',
        enableFiltering: false,
        enableSorting: false,
        exporterSuppressExport: true,
        pinnedLeft: true,
        enablePinning: false
      },
      {
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
        enableFiltering: false,
        pinnedLeft: true,
        enableSorting: false
      },
      {
        field: 'name',
        displayName: 'Template Name',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'supplier',
        displayName: vm.LabelConstant.Supplier.Supplier,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                              <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToSupplier(row.entity.supplieID);" tabindex="-1">{{COL_FIELD}}</a>\
                              <copy-text label="grid.appScope.$parent.vm.LabelConstant.Supplier.Supplier" text="row.entity.supplier"></copy-text>\
                           </div>',
        width: '200',
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'attibuteName',
        width: '400',
        displayName: 'Attributes',
        cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents layout-wrap"> '
          + ' <span class="label-box margin-left-2 mb-5 background-skyblue-pricing" ng-repeat="attibuteName in row.entity.attributeNames">{{attibuteName}}</span> '
          + ' </div> ',
        enableFiltering: false,
        enableSorting: false
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

    vm.sourceHeader.unshift(
      {
        field: 'Apply',
        headerCellTemplate: '<md-checkbox class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox" ng-model="grid.appScope.$parent.vm.apply" \
                            ng-change="grid.appScope.$parent.vm.applyAll(grid.appScope.$parent.vm.apply)"></md-checkbox>',
        width: '75',
        cellTemplate: '<div class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox" style="overflow:initial"><md-checkbox  class="margin-0" ng-model="row.entity.isRecordSelectedForRemove" \
                            ng-change="grid.appScope.$parent.vm.setSupplierAttributeTemplateRemove(row.entity)"></md-checkbox></div>',
        enableFiltering: false,
        enableSorting: false,
        exporterSuppressExport: true,
        pinnedLeft: false,
        allowCellFocus: false,
        maxWidth: '80',
        enableColumnMoving: false,
        manualAddedCheckbox: true
      }
    );

    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICall = (SupplierAttributeTemplate, isGetDataDown) => {
      if (SupplierAttributeTemplate && SupplierAttributeTemplate.data && SupplierAttributeTemplate.data.SupplierAttributeTemplate) {
        if (!isGetDataDown) {
          vm.sourceData = SupplierAttributeTemplate.data.SupplierAttributeTemplate;
          vm.currentdata = vm.sourceData.length;
        }
        else if (SupplierAttributeTemplate.data.SupplierAttributeTemplate.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(SupplierAttributeTemplate.data.SupplierAttributeTemplate);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }

        processSupplierAttrbuteTemplate(vm.sourceData);
        // must set after new data comes
        vm.totalSourceDataCount = SupplierAttributeTemplate.data.Count;
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
      //vm.apply manually set at setSupplierAttributeTemplateRemove ,need to reset.
      vm.apply = false;
      vm.cgBusyLoading = SupplierAttributeTemplateFactory.retrieveSupplierAttributeList().query(vm.pagingInfo).$promise.then((SupplierAttributeTemplate) => {
        if (SupplierAttributeTemplate && SupplierAttributeTemplate.data) {
          setDataAfterGetAPICall(SupplierAttributeTemplate, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* load more data on mouse scroll */
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = SupplierAttributeTemplateFactory.retrieveSupplierAttributeList().query(vm.pagingInfo).$promise.then((SupplierAttributeTemplate) => {
        if (SupplierAttributeTemplate && SupplierAttributeTemplate.data) {
          setDataAfterGetAPICall(SupplierAttributeTemplate, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const processSupplierAttrbuteTemplate = (data) => {
      _.each(data, (item) => {
        if (item.attributesList) {
          const splitAttributes = item.attributesList.split('@@@');
          const attributeNames = [];
          _.map(splitAttributes, (data) => {
            if (data) {
              const splitValue = data.split('###');
              if (splitValue.length > 0) {
                attributeNames.push(splitValue[2]);
              }
            }
          });
          item.attributeNames = attributeNames;
        }
      });
    };

    vm.updateRecord = (row, ev) => {
      const PopupData = {
        id: row.entity.id
      };
      DialogFactory.dialogService(
        USER.ADMIN_SUPPLIER_ATTRIBUTE_TEMPLATE_ADD_UPDATE_MODAL_CONTROLLER,
        USER.ADMIN_SUPPLIER_ATTRIBUTE_TEMPLATE_ADD_UPDATE_MODAL_VIEW,
        ev,
        PopupData).then((data) => {
          if (data) {
            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
          }
        }, () => {
          BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.deleteRecord = (supplierAttributeTemplate) => {
      let selectedIDs = [];
      if (supplierAttributeTemplate) {
        selectedIDs.push(supplierAttributeTemplate.id);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((template) => template.id);
        }
      }
      if (selectedIDs) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Supplier attribute template', selectedIDs.length);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };

        const objDelete = {
          id: selectedIDs
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.cgBusyLoading = SupplierAttributeTemplateFactory.deleteSupplierAttributeTemplate().query({
              objIDs: objDelete
            }).$promise.then(() => {
              BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
              vm.gridOptions.clearSelectedRows();
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    vm.addSupplierAttributeTemplate = (ev) => {
      DialogFactory.dialogService(
        USER.ADMIN_SUPPLIER_ATTRIBUTE_TEMPLATE_ADD_UPDATE_MODAL_CONTROLLER,
        USER.ADMIN_SUPPLIER_ATTRIBUTE_TEMPLATE_ADD_UPDATE_MODAL_VIEW,
        ev,
        null).then((data) => {
          if (data) {
            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
          }
        }, () => {
          BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.applyAll = (applyAll) => {
      if (applyAll) {
        _.map(vm.sourceData, selectTemplate);
      } else {
        _.map(vm.sourceData, unselectTemplate);
      }
    };
    const selectTemplate = (row) => {
      vm.gridOptions.gridApi.selection.selectRow(row);
    };
    const unselectTemplate = (row) => {
      row.isRecordSelectedForRemove = false;
      vm.gridOptions.clearSelectedRows();
    };
    vm.setSupplierAttributeTemplateRemove = (row) => {
      const totalItem = vm.sourceData.length;
      const selectItem = _.filter(vm.sourceData, (data) => data.isRecordSelectedForRemove === true);
      if (row.isRecordSelectedForRemove) {
        vm.gridOptions.gridApi.selection.selectRow(row);
      }
      else {
        vm.gridOptions.gridApi.selection.unSelectRow(row);
      }
      if (totalItem === selectItem.length) {
        vm.apply = true;
      } else {
        vm.apply = false;
      }
    };
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };
  }
})();
