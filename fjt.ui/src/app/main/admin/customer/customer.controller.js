(function () {
  'use strict';

  angular
    .module('app.admin.customer')
    .controller('CustomerController', CustomerController);

  /** @ngInject */
  function CustomerController($timeout, $scope, $mdDialog, $state, $stateParams, USER, CORE,
    DialogFactory, BaseService, DASHBOARD, ManufacturerFactory, RFQTRANSACTION, ImportExportFactory, $rootScope) {
    if (!$stateParams.customerType) {
      $state.go(DASHBOARD.DASHBOARD_STATE);
      return;
    }

    const vm = this;
    vm.isUpdatable = vm.showUMIDHistory = true;
    vm.actionButtonName = 'History';
    vm.CurrentPageName = $stateParams.customerType === CORE.CUSTOMER_TYPE.CUSTOMER ? CORE.PAGENAME_CONSTANT[10].PageName : CORE.PAGENAME_CONSTANT[22].PageName;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.CUSTOMER;
    vm.EmptyMesssageSupplier = USER.ADMIN_EMPTYSTATE.SUPPLIER;
    vm.customerType = $stateParams.customerType;
    vm.StatusOptionsGridHeaderDropdown = CORE.StatusOptionsGridHeaderDropdown;
    vm.InvoiceRequireManagementApprovalGridHeaderDropdown = CORE.InvoiceRequireManagementApprovalGridHeaderDropdown;
    vm.DefaultDateFormat = _dateTimeDisplayFormat;
    vm.CustOrDistyConst = CORE.CUSTOMER_TYPE;
    vm.gridConfig = CORE.gridConfig;
    vm.LabelConstant = CORE.LabelConstant;
    vm.KeywordStatusGridHeaderDropdown = CORE.KeywordStatusGridHeaderDropdown;
    vm.customerTypeList = CORE.customerTypenameDropdown;
    vm.isEditIntigrate = false;
    vm.customerTypeName = vm.customerType === CORE.CUSTOMER_TYPE.CUSTOMER ? CORE.MFG_TYPE.MFG : CORE.MFG_TYPE.DIST;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;
    if (vm.customerType === '1') {
      vm.entityID = CORE.AllEntityIDS.Customer.ID;
    } else {
      vm.entityID = CORE.AllEntityIDS.Supplier.ID;
    }

    vm.sourceHeader = [{
      field: 'Action',
      cellClass: 'layout-align-center-center',
      displayName: 'Action',
      width: '120',
      cellTemplate: '<grid-action-view grid="grid" row="row" style="overflow: hidden;padding:5px;overflow: hidden; white-space: nowrap;" class="height-grid ui-grid-cell-contents"></grid-action-view>',
      enableFiltering: false,
      enableSorting: false,
      exporterSuppressExport: true,
      pinnedLeft: false
    },
    {
      field: '#',
      width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
      cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
      enableFiltering: false,
      enableSorting: false
    }, {
      field: 'systemID',
      width: '140',
      displayName: 'SystemID',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      enableFiltering: true,
      enableSorting: true,
      allowCellFocus: false
    }, {
      field: 'mfgName',
      displayName: vm.entityID === CORE.AllEntityIDS.Customer.ID ? 'Business Name' : 'Company',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '250'
    }, {
      field: 'mfgCode',
      displayName: 'Code',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                          <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.editCustomerOrSuppllier(row.entity.id);">{{COL_FIELD}}</a>\
                          <copy-text label="\'Code\'" ng-if="row.entity.mfgCode" text="row.entity.mfgCode"></copy-text>\
                    </div>',
      width: '100'
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
      field: 'aliaslist',
      width: '330',
      displayName: 'Alias',
      cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" ng-repeat="item in row.entity.aliaslistWithNewLine track by $index">\
                    <span>{{item.alias}}</span>&nbsp;\
                    <md-icon md-font-icon="icons-map-manufacturer" ng-if="item.isMapped"><md-tooltip>Mapped</md-tooltip></md-icon>\
                    <md-icon md-font-icon="icon-eye"><md-tooltip md-direction="top" class="tt-multiline">Created By: {{item.createdBy}} <br />Created At: {{item.createdAt | date:vm.DefaultDateFormat}}</md-tooltip></md-icon>\
          <md-icon md-font-icon="icon-history" ng-click="grid.appScope.$parent.vm.viewWhereUsed(row.entity, item.alias,$event)"><md-tooltip>Where Used</md-tooltip></md-icon>\
                  </div>',
      enableFiltering: true,
      enableSorting: true
    }, {
      field: 'personFullNameList',
      displayName: 'Primary Contacts',
      cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents layout-wrap"> '
        + ' <span class="label-box margin-left-2 mb-5 label-primary" '
        + ' ng-repeat="item in row.entity.personFullNamesList track by $index">{{item}}</span> '
        + ' </div> ',
      width: 300
    }, {
      field: 'contact',
      displayName: 'Phone',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}{{row.entity.phExtension ? " " + "Ext." + row.entity.phExtension : ""}}</div>',
      width: '150'
    }, {
      field: 'faxNumber',
      displayName: 'Fax',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '140'
    }, {
      field: 'email',
      displayName: 'Email',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '250'
    }, {
      field: 'website',
      displayName: 'Website',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '240'
    }, {
      field: 'gencCategoryName',
      displayName: 'Terms',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '240'
    }, {
      field: 'taxID',
      displayName: 'Tax ID',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '150'
    }, {
      field: 'accountRef',
      displayName: 'Account Reference',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '150'
    },
    {
      field: 'paymentMethodName',
      displayName: vm.LabelConstant.SupplierInvoice.PaymentMethod,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                            <a class="cm-text-decoration underline" ng-if="row.entity.systemGeneratedPaymentMethod === 0" ng-click="grid.appScope.$parent.vm.goToPaymentMethodDetail(row.entity);" tabindex="-1">{{COL_FIELD}}</a>\
                            <span ng-if="row.entity.systemGeneratedPaymentMethod === 1">{{COL_FIELD}}</span>\
                            <copy-text label="grid.appScope.$parent.vm.LabelConstant.SupplierInvoice.PaymentMethod" ng-if="row.entity.paymentMethodName" text="row.entity.paymentMethodName"></copy-text>\
                        </div>',
      width: '150'
    },
    {
      field: 'isActiveConvertedValue',
      displayName: 'Status',
      cellTemplate: '<div class="ui-grid-cell-contents">' +
        '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.isActive == true, \
                            \'label-warning\':row.entity.isActive == false}"> \
                                {{ COL_FIELD }}' +
        '</span>' +
        '</div>',
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        term: null,
        options: vm.StatusOptionsGridHeaderDropdown
      },
      ColumnDataType: 'StringEquals',
      width: '110'
    },
    {
      field: 'ShippingName',
      displayName: 'Shipping Method',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '200'
    }, {
      field: 'carrierName',
      displayName: 'Carrier',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '200'
    }, {
      field: 'carrierAccount',
      displayName: 'Carrier Account#',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '200'
    }, {
      field: 'shippingInsuranceName',
      displayName: 'Shipping insurance',
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">' +
        '<span class="label-box" \
                              ng-class="{\'label-success\':row.entity.shippingInsurence == true, \
                              \'label-warning\':row.entity.shippingInsurence == false}"> \
                                  {{COL_FIELD}}' +
        '</span>' +
        '</div>',
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        term: null,
        options: vm.KeywordStatusGridHeaderDropdown
      },
      ColumnDataType: 'StringEquals',
      width: '120'
    }, {
      field: 'rmaShippingName',
      displayName: 'RMA Shipping Method',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '200'
    }, {
      field: 'rmacarrierName',
      displayName: 'RMA Carrier',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '200'
    }, {
      field: 'rmaCarrierAccount',
      displayName: 'RMA Carrier Account#',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '200'
    }, {
      field: 'rmashippingInsuranceName',
      displayName: 'RMA Shipping insurance',
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">' +
        '<span class="label-box" \
                              ng-class="{\'label-success\':row.entity.rmaShippingInsurence == true, \
                              \'label-warning\':row.entity.rmaShippingInsurence == false}"> \
                                  {{COL_FIELD}}' +
        '</span>' +
        '</div>',
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        term: null,
        options: vm.KeywordStatusGridHeaderDropdown
      },
      ColumnDataType: 'StringEquals',
      width: '135'
    }, {
      field: 'ChartOfAccounts',
      displayName: 'COA',
      cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-if="row.entity.acctId"><a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.updateChartOfAccounts(row.entity.acctId);">{{COL_FIELD}}</a></div>',
      width: '200'
    },
    {
      field: 'updatedAt',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
      type: 'datetime',
      enableFiltering: false,
      visible: false
    }, {
      field: 'updatedby',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
      type: 'StringEquals',
      enableFiltering: true,
      visible: false
    }, {
      field: 'updatedbyRole',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
      type: 'StringEquals',
      enableFiltering: true,
      visible: false
    }, {
      field: 'createdAt',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
      type: 'datetime',
      enableFiltering: false
    }, {
      field: 'createdby',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
      type: 'StringEquals',
      enableFiltering: true
    }, {
      field: 'createdbyRole',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
      type: 'StringEquals',
      enableFiltering: true,
      visible: false
    }, {
      field: 'SyatemGeneratedValue',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_SYSTEM_GENERATED,
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">' +
        '<span class="label-box" \
                              ng-class="{\'label-success\':row.entity.systemGenerated == true, \
                              \'label-warning\':row.entity.systemGenerated == false}"> \
                                  {{ COL_FIELD }}' +
        '</span>' +
        '</div>',
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        term: null,
        options: vm.KeywordStatusGridHeaderDropdown
      },
      ColumnDataType: 'StringEquals',
      width: 120
    }
    ];

    vm.editCustomerOrSuppllier = (id) => vm.customerType === CORE.CUSTOMER_TYPE.CUSTOMER ? BaseService.goToCustomer(id) : BaseService.goToSupplierDetail(id);

    vm.sourceHeader.unshift({
      field: 'Apply',
      headerCellTemplate: '<md-checkbox class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox" ng-model="grid.appScope.$parent.vm.Apply" \
                            ng-change="grid.appScope.$parent.vm.applyAll(grid.appScope.$parent.vm.Apply)"></md-checkbox>',
      width: '75',
      cellTemplate: '<div class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox" style="overflow:initial"><md-checkbox   ng-disabled="row.entity.isDisabledDelete"  ng-model="row.entity.isRecordSelectedForRemove" \
                            ng-change="grid.appScope.$parent.vm.setMFGRemove(row.entity)"></md-checkbox></div>',
      enableFiltering: false,
      enableSorting: false,
      exporterSuppressExport: true,
      pinnedLeft: false,
      enableColumnMoving: false,
      manualAddedCheckbox: true
    });
    if (vm.entityID === CORE.AllEntityIDS.Supplier.ID) {
      const objAuthorize = {
        field: 'authorizeTypeTxt',
        width: '200',
        displayName: 'Authorize Type',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        enableFiltering: true,
        enableSorting: true
      };
      vm.sourceHeader.splice(6, 0, objAuthorize);

      const objInvoiceRequireApproval = {
        field: 'invoicesRequireManagementApprovalValue',
        width: 180,
        displayName: 'All Invoices Require Management Approval',
        cellTemplate: '<div class="ui-grid-cell-contents">' +
          '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.invoicesRequireManagementApproval == true, \
                            \'label-warning\':row.entity.invoicesRequireManagementApproval == false}"> \
                                {{ COL_FIELD }}' +
          '</span>' +
          '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.InvoiceRequireManagementApprovalGridHeaderDropdown
        },
        ColumnDataType: 'StringEquals'
      };

      vm.sourceHeader.splice(9, 0, objInvoiceRequireApproval);
      const objSupplierEnableDisable = {
        field: 'supplierEnableText',
        width: 220,
        displayName: 'Enable Supplier API Request for All Users',
        cellTemplate: '<div class="ui-grid-cell-contents">' +
          '<span  \
                            ng-class="{\'label-box label-success\':row.entity.isSupplierEnable && row.entity.isPricingApi, \
                            \'label-box label-warning\':row.entity.isPricingApi && !row.entity.isSupplierEnable}"> \
                                {{row.entity.isPricingApi? COL_FIELD:"" }}' +
          '</span>' +
          '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.InvoiceRequireManagementApprovalGridHeaderDropdown
        },
        ColumnDataType: 'StringEquals'
      };

      vm.sourceHeader.splice(10, 0, objSupplierEnableDisable);

      const objSupplierDisplayOrder = {
        field: 'externalSupplierOrder',
        displayName: 'Supplier API Request Order' + CORE.Modify_Grid_column_Allow_Change_Message,
        cellTemplate: CORE.DISPLAYORDER.CellTemplate,
        width: '180',
        maxWidth: CORE.DISPLAYORDER.MaxWidth,
        enableCellEdit: true,
        cellEditableCondition: function ($scope) {
          return $scope.row.entity.isPricingApi && $scope.row.entity.externalSupplierOrder > 0;
        },
        type: 'number'
      };
      vm.sourceHeader.splice(11, 0, objSupplierDisplayOrder);
      const mappingType = {
        field: 'mappingMfr',
        width: '330',
        displayName: 'Manufacturer Mapping',
        cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" ng-repeat="item in row.entity.mappingWithNewLine track by $index">\
                    {{item}}&nbsp;\
                  </div>',
        enableFiltering: true,
        enableSorting: true
      };
      vm.sourceHeader.splice(25, 0, mappingType);
      const customerMapping = {
        field: 'customerMapping',
        width: '330',
        displayName: CORE.LabelConstant.COMMON.CustomerMapping,
        cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" ng-repeat="item in row.entity.customerMappingWithNewLine track by $index">\
                    {{item}}&nbsp;\
                  </div>',
        enableFiltering: true,
        enableSorting: true
      };
      vm.sourceHeader.splice(26, 0, customerMapping);
    }
    if (vm.entityID === CORE.AllEntityIDS.Customer.ID) {
      const customerNumber = {
        field: 'customerSystemID',
        width: '140',
        displayName: 'Customer#',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        enableFiltering: true,
        enableSorting: true,
        allowCellFocus: false
      };
      vm.sourceHeader.splice(4, 0, customerNumber);
      const dateCodeFormat = {
        field: 'dateCodeFormat',
        displayName: CORE.LabelConstant.MFG.MFRDateCodeFormat,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: 100,
        type: 'StringEquals',
        enableFiltering: true
      };
      vm.sourceHeader.splice(8, 0, dateCodeFormat);

      const customerType = {
        field: 'customerTypeName',
        displayName: 'Customer Type',
        cellTemplate: '<div class="ui-grid-cell-contents">' +
          '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.customerType == \'E\', \
                            \'label-warning\':row.entity.customerType == \'B\'}"> \
                                {{row.entity.customerTypeName}}' +
          '</span>' +
          '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.customerTypeList
        },
        ColumnDataType: 'StringEquals',
        width: '145'
      };
      vm.sourceHeader.splice(9, 0, customerType);
      const SalesCommossionTo = {
        field: 'salesCommissionTo',
        displayName: 'Sales Commission To',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true
      };
      vm.sourceHeader.splice(9, 0, SalesCommossionTo);
      const mappingType = {
        field: 'mappingMfr',
        width: '330',
        displayName: 'Customer Mapping',
        cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" ng-repeat="item in row.entity.mappingWithNewLine track by $index">\
                    {{item}}&nbsp;\
                  </div>',
        enableFiltering: true,
        enableSorting: true
      };
      vm.sourceHeader.splice(27, 0, mappingType);

      const legalName = {
        field: 'legalName',
        displayName: 'Legal Name',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '250'
      };
      vm.sourceHeader.splice(6, 0, legalName);
    }
    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [],
        SearchColumns: [],
        mfgType: vm.customerTypeName,
        isCustOrDisty: CORE.CUSTOMER_TYPE.CUSTOMER, // in both customer/supplier case : isCustOrDisty - table entry 1
        fromPageRequest: vm.customerType === CORE.CUSTOMER_TYPE.CUSTOMER ? CORE.MFG_TYPE.CUSTOMER : CORE.MFG_TYPE.DIST
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
      exporterCsvFilename: $stateParams.customerType === CORE.CUSTOMER_TYPE.CUSTOMER ? 'Customer.csv' : 'Supplier.csv',
      CurrentPage: vm.CurrentPageName,
      allowToExportAllData: true,
      /* Calls everytime for Export All Data [rowType = ALL] */
      exporterAllDataFn: () => {
        /* For scrolling pagination vm.pagingInfo.Page is increase everytime so we have to set API side pagePerReocrds as NULL for Export All Data */
        const pagingInfoOld = _.clone(vm.pagingInfo);
        pagingInfoOld.pageSize = 0;
        pagingInfoOld.Page = 1;
        vm.gridOptions.isExport = pagingInfoOld.isExport = true;
        return ManufacturerFactory.retriveCustomerList().query(pagingInfoOld).$promise.then((customers) => {
          if (customers && customers.status === CORE.ApiResponseTypeStatus.SUCCESS && customers.data && customers.data.mfgCode) {
            return customers.data.mfgCode;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    function setDataAfterGetAPICall(customers, isGetDataDown) {
      if (customers && customers.data.mfgCode) {
        formatAliasOfGridData(customers.data.mfgCode);
        if (!isGetDataDown) {
          vm.sourceData = customers.data.mfgCode;
          vm.currentdata = vm.sourceData.length;
          getDerivedManufacturerList();
        } else if (customers.data.mfgCode.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(customers.data.mfgCode);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        // must set after new data comes
        vm.totalSourceDataCount = customers.data.Count;
        if (!vm.gridOptions.enablePaging) {
          if (!isGetDataDown) {
            vm.gridOptions.gridApi.infiniteScroll.resetScroll();
          } else {
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
          } else {
            vm.isNoDataFound = true;
            vm.emptyState = null;
          }
        } else {
          vm.isNoDataFound = false;
          vm.emptyState = null;
        }
        if (!vm.isEditIntigrate) {
          cellEdit();
        }
        $timeout(() => {
          vm.resetSourceGrid();
          if (!isGetDataDown) {
            if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
            }
          } else {
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount !== vm.currentdata ? true : false);
          }
        });
      }
    }

    vm.loadData = () => {
      vm.Apply = false;
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = ManufacturerFactory.retriveCustomerList().query(vm.pagingInfo).$promise.then((customers) => {
        if (customers.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          if (customers) {
            setDataAfterGetAPICall(customers, false);
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = ManufacturerFactory.retriveCustomerList().query(vm.pagingInfo).$promise.then((customers) => {
        setDataAfterGetAPICall(customers, true);
      }).catch((error) => BaseService.getErrorLog(error));
    };


    //format Alias (all in new line) Of Grid Data
    const formatAliasOfGridData = (customerlist) => {
      _.each(customerlist, (item) => {
        const Aliaslist = [];
        const MFRMappinglist = [];
        const CustomerMappingList = [];
        //item.aliaslist = item.aliaslist ? item.aliaslist.replace(/!!!!/g, "<br>") : null;
        item.aliaslistWithNewLine = item.aliaslist ? item.aliaslist.split('!!!!') : null;
        item.mappingWithNewLine = item.mappingMfr ? item.mappingMfr.split('##$$') : null;
        item.customerMappingWithNewLine = item.customerMapping ? item.customerMapping.split('##$$') : null;

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
          }
          Aliaslist.push(aliasSplit[0]);
        });
        if (item.mappingWithNewLine && item.mappingWithNewLine.length > 0) {
          _.each(item.mappingWithNewLine, (mfr) => {
            MFRMappinglist.push(mfr);
          });
        }
        if (item.customerMappingWithNewLine && item.customerMappingWithNewLine.length > 0) {
          _.each(item.customerMappingWithNewLine, (customer) => {
            CustomerMappingList.push(customer);
          });
        }
        item.aliaslist = Aliaslist ? Aliaslist.join(',') : null;
        item.mappingMfr = MFRMappinglist ? MFRMappinglist.join(',') : null;
        item.customerMapping = CustomerMappingList ? CustomerMappingList.join(',') : null;
        item.personFullNamesList = item.personFullNameList ? item.personFullNameList.split(',') : [];
      });
    };

    //Update cell for display order flied
    function cellEdit() {
      vm.isEditIntigrate = true;
      vm.gridOptions.gridApi.edit.on.afterCellEdit($scope, (rowEntity, colDef, newvalue, oldvalue) => {
        var obj = _.find(vm.sourceData, (item) => item.id === rowEntity.id);
        var index = vm.sourceData.indexOf(obj);
        if ((colDef.field === 'displayOrder' || colDef.field === 'externalSupplierOrder') && newvalue !== oldvalue) {
          if (!BaseService.setInvalidDisplayOrder(oldvalue, newvalue, index, (colDef.colInitIndex - 1), vm.gridOptions, vm.sourceData, vm.sourceHeader, rowEntity, 0)) {
            return;
          }
          if (colDef.field === 'externalSupplierOrder' && !newvalue) {
            rowEntity.externalSupplierOrder = oldvalue;
            return;
          }
          const mfgCodeModel = {
            id: rowEntity.id,
            fromPageRequest: vm.customerTypeName
          };
          if (colDef.field === 'displayOrder') {
            mfgCodeModel.displayOrder = newvalue;
          } else {
            mfgCodeModel.externalSupplierOrder = newvalue;
          }
          vm.cgBusyLoading = ManufacturerFactory.updateDisplayOrder().save(mfgCodeModel).$promise.then((res) => {
            if (res) {
              if (res.status === CORE.ApiResponseTypeStatus.FAILED || res.status === CORE.ApiResponseTypeStatus.EMPTY) {
                if (colDef.field === 'displayOrder') {
                  rowEntity.displayOrder = oldvalue;
                } else {
                  rowEntity.externalSupplierOrder = oldvalue;
                }
              } else if (res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      });
    }

    //apply all details
    vm.applyAll = (applyAll) => {
      if (applyAll) {
        _.map(vm.sourceData, selectMFG);
      } else {
        _.map(vm.sourceData, unselectMFG);
      }
    };
    const selectMFG = (row) => {
      row.isRecordSelectedForRemove = row.isDisabledDelete ? false : true;
      if (row.isRecordSelectedForRemove) {
        vm.gridOptions.gridApi.selection.selectRow(row);
      }
    };
    const unselectMFG = (row) => {
      row.isRecordSelectedForRemove = false;
      vm.gridOptions.clearSelectedRows();
    };
    vm.setMFGRemove = (row) => {
      var totalItem = _.filter(vm.sourceData, (data) => !data.isDisabledDelete);
      var selectItem = _.filter(vm.sourceData, (data) => data.isRecordSelectedForRemove === true);
      if (row.isRecordSelectedForRemove) {
        vm.gridOptions.gridApi.selection.selectRow(row);
      } else {
        vm.gridOptions.gridApi.selection.unSelectRow(row);
      }
      if (totalItem.length === selectItem.length) {
        vm.Apply = true;
      } else {
        vm.Apply = false;
      }
    };

    vm.selectedCustomer = () => vm.gridOptions.getSelectedRowsCount ? vm.gridOptions.getSelectedRowsCount() : 0;

    vm.fab = {
      Status: false
    };

    /* delete customer*/
    vm.deleteRecord = (customer) => {
      let selectedIDs = [];
      if (customer) {
        //selectedIDs = customer.id;
        selectedIDs.push(customer.id);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((customeritem) => customeritem.id);
        }
      }
      if (selectedIDs) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, vm.customerType === CORE.CUSTOMER_TYPE.CUSTOMER ? 'Customer' : 'Supplier', selectedIDs.length);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        const objIDs = {
          id: selectedIDs,
          fromPageRequest: vm.customerTypeName === CORE.MFG_TYPE.MFG ? CORE.MFG_TYPE.CUSTOMER : vm.customerTypeName,
          CountList: false
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.cgBusyLoading = ManufacturerFactory.deleteCustomer().query({
              objIDs: objIDs
            }).$promise.then((res) => {
              if (res && res.data) {
                if (res.data.length > 0 || res.data.transactionDetails) {
                  const data = {
                    TotalCount: res.data.transactionDetails[0].TotalCount,
                    pageName: CORE.CUSTOMER_TYPE.CUSTOMER === $stateParams.customerType ? CORE.PageName.customer : CORE.PageName.supplier
                  };
                  BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                    const IDs = {
                      id: res.data.IDs,
                      CountList: true
                    };
                    return ManufacturerFactory.deleteCustomer().query({
                      objIDs: IDs
                    }).$promise.then((res) => {
                      let data = {};
                      data = res.data;
                      data.pageTitle = customer ? stringFormat('({0}){1}{2}', customer.mfgCode, ' ', customer.mfgName) : null;
                      data.PageName = CORE.CUSTOMER_TYPE.CUSTOMER === $stateParams.customerType ? CORE.PageName.customer : CORE.PageName.supplier;
                      data.selectedIDs = stringFormat('{0}{1}', selectedIDs.length, ' Selected');
                      if (res.data) {
                        DialogFactory.dialogService(
                          USER.ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER,
                          USER.ADMIN_SHOW_TRANSACTION_DETAILS_VIEW,
                          ev,
                          data).then(() => { }, () => { });
                      }
                    }).catch((error) => BaseService.getErrorLog(error));
                  });
                } else {
                  BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                  vm.gridOptions.clearSelectedRows();
                }
              } else {
                BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                vm.gridOptions.clearSelectedRows();
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => { }).catch((error) => BaseService.getErrorLog(error));
      } else {
        //show validation message no data selected
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContent.message = stringFormat(messageContent.message, vm.customerType === CORE.CUSTOMER_TYPE.CUSTOMER ? 'customer' : 'supplier');
        const alertModel = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(alertModel);
      }
    };

    /* update customer*/
    vm.updateRecord = (row) => {
      if ($stateParams.customerType === CORE.CUSTOMER_TYPE.CUSTOMER) {
        BaseService.goToCustomer(row.entity.id);
      } else {
        BaseService.goToSupplierDetail(row.entity.id);
      }
    };
    /* Refresher List on import data event */
    const refreshUIGridList = $rootScope.$on(USER.RefreshSupplierCustomerList, (event, data) => {
      if (vm.gridOptions.gridApi) {
        vm.gridOptions.gridApi.grid.clearAllFilters();
      }
      vm.loadData();
    });

    //close popup on page destroy
    $scope.$on('$destroy', () => {
      refreshUIGridList();
      $mdDialog.hide(false, {
        closeAll: true
      });
    });

    /* add customer*/
    vm.addEditRecord = () => {
      if ($stateParams.customerType === CORE.CUSTOMER_TYPE.CUSTOMER) {
        BaseService.goToCustomer(null);
      } else {
        BaseService.goToSupplierDetail(null);
      }
    };


    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };

    vm.viewWhereUsed = (rowDet, code, ev) => {
      const mfgDetail = {
        name: rowDet.mfgName,
        mfgCode: code,
        isManufacturer: (vm.customerType === CORE.CUSTOMER_TYPE.SUPPLIER ? false : true),
        mfgTypeLabel: vm.customerType === CORE.CUSTOMER_TYPE.CUSTOMER ? vm.LabelConstant.MFG.Customer : vm.LabelConstant.MFG.Supplier
      };
      DialogFactory.dialogService(
        CORE.VIEW_WHEREUSED_MANUFACTURER_MODAL_CONTROLLER,
        CORE.VIEW_WHEREUSED_MANUFACTURER_MODAL_VIEW,
        ev,
        mfgDetail).then(() => { }, () => { }).catch((error) => BaseService.getErrorLog(error));
    };

    // Import functionality
    const _mfrHeader = CORE.SUPPLIER_COLUMN_MAPPING;
    vm.eroOptions = {
      workstart: function () { },
      workend: function () { },
      sheet: function (json, sheetnames, select_sheet_cb, file) {
        var type = file.name.split('.');
        if (_.find(CORE.UPLOAD_DOCUMENT_TYPE, (docType) => docType === type[type.length - 1])) {
          const data = {
            headers: _mfrHeader,
            excelHeaders: json[0],
            notquote: true,
            headerName: vm.LabelConstant.MFG.Supplier
          };
          DialogFactory.dialogService(
            RFQTRANSACTION.PRICING_COLUMN_MAPPING_CONTROLLER,
            RFQTRANSACTION.PRICING_COLUMN_MAPPING_VIEW,
            vm.event,
            data).then((result) => {
              json[0] = result.excelHeaders;
              generateModel(json, result.model, data.excelHeaders);
            }, (err) => BaseService.getErrorLog(err));
        } else {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.INVALID_DOC_FILE);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
        }
      },
      badfile: function () {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.INVALID_DOC_FILE);
        var model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
      },
      pending: function () { },
      failed: function () {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.INVALID_DOC_FILE);
        var model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
      },
      large: function () {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.BOM_UPLOAD_FAIL_SIZE_TEXT);
        var model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
      },
      multiplefile: function () {

      }
    };

    // Create model from array
    function generateModel(uploadedMFR, mfrHeaders, excelHeader) {
      var mfrmodel = [];
      // loop through excel data and bind into model
      for (let i = 1, len = uploadedMFR.length; i < len; i++) {
        const item = uploadedMFR[i];
        const modelRow = {};
        uploadedMFR[0].forEach((column, index) => {
          if (column === null) {
            return;
          }
          const obj = mfrHeaders.find((x) => x.column && x.column.toUpperCase() === column.toUpperCase());
          if (!obj) {
            return;
          }
          const field = _mfrHeader.find((x) => x === obj.header);
          if (!modelRow[field]) {
            modelRow[field] = item[index] ? item[index] : null;
          }
        });
        mfrmodel.push(modelRow);
      };
      checkUploadedMFR(mfrmodel, uploadedMFR, mfrHeaders, excelHeader);
    }
    //check format1 && format 2 uploaded details
    function checkUploadedMFR(mfrmodel, data, mfrHeaders, excelHeader) {
      var headers = _.keys(mfrmodel[0]); //get header detail
      if (!_.find(headers, (head) => head === vm.LabelConstant.MFG.SupplierCode)) {
        mfrmodel = _.filter(mfrmodel, (mfr) => mfr[vm.LabelConstant.MFG.SupplierName]); // filter only mfr having name
        //Format 2
        mfrmodel = _.uniq(mfrmodel);
        const objModel = {
          mfgType: CORE.MFG_TYPE.DIST,
          mfrmodel: mfrmodel
        };
        vm.cgBusyLoading = ManufacturerFactory.importFormatTwoManufacturerDetails().query({
          mfgList: objModel
        }).$promise.then(() => {
          openMFRErrorPopup();
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        //format 1
        //mapped detail against mfr name
        const mappedHeader = _.find(mfrHeaders, (mapp) => mapp.header === vm.LabelConstant.MFG.SupplierName);
        const formatHeder = excelHeader;
        const indexHeaderList = [];
        if (mappedHeader) {
          _.each(formatHeder, (header, index) => {
            if (header === mappedHeader.column || header === vm.LabelConstant.MFG.SupplierName) {
              indexHeaderList.push(index);
            }
          });
        }
        if (indexHeaderList.length === 0) {
          DialogFactory.alertDialog({
            title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
            textContent: stringFormat(CORE.MESSAGE_CONSTANT.INVALID_MFR_MAPPING, vm.LabelConstant.MFG.SupplierName),
            multiple: true
          });
          return;
        }
        const mfgAliasList = data;
        let modelList = [];
        _.each(mfrmodel, (model, index) => {
          if (model[vm.LabelConstant.MFG.SupplierCode]) {
            const modelObject = {
              mfgCode: model[vm.LabelConstant.MFG.SupplierCode],
              mfgAlias: [],
              mfgType: CORE.MFG_TYPE.DIST
            };
            _.each(mfgAliasList[index + 1], (alias, aliasIndex) => {
              if (alias && ((_.find(indexHeaderList, (aIndex) => aIndex === aliasIndex))) && (!_.find(modelObject.mfgAlias, (mfgAlias) => mfgAlias === alias))) {
                modelObject.mfgAlias.push(alias);
              }
            });
            if (modelObject.mfgAlias.length > 0) {
              modelList.push(modelObject);
            }
            // modelList.push(modelObject);
          }
        });
        if (modelList.length > 0) {
          modelList = _.uniqWith(modelList, _.isEqual);
          modelList = _.filter(modelList, (item) => item.mfgAlias.length > 0);
          vm.cgBusyLoading = ManufacturerFactory.importFormatOneManufacturerDetails().query({
            mfgImportedDetail: modelList
          }).$promise.then((manufacturer) => {
            if (manufacturer && manufacturer.status === CORE.ApiResponseTypeStatus.FAILED) {
              const exportList = _.filter(manufacturer.data, (fStatus) => fStatus.status === CORE.ApiResponseTypeStatus.FAILED);
              const errorMfrList = [];
              _.each(exportList, (errMFr) => {
                var objErrMFR = {};
                objErrMFR[vm.LabelConstant.MFG.SupplierCode] = errMFr.mfgCode;
                _.each(errMFr.mfgAlias, (alias, index) => {
                  objErrMFR[stringFormat('{0}{1}', (vm.LabelConstant.MFG.SupplierName), index > 1 ? index - 1 : '')] = alias;
                });
                objErrMFR.Error = errMFr.message;
                errorMfrList.push(objErrMFR);
              });
              vm.cgBusyLoading = ImportExportFactory.importFile(errorMfrList).then((res) => {
                if (res.data && errorMfrList.length > 0) {
                  exportFileDetail(res, 'Supplier_error.xls');
                }
              }).catch((error) => BaseService.getErrorLog(error));
            } else {
              vm.loadData();
            }
          });
        }
      }
    }

    //export template details
    function exportFileDetail(res, name) {
      const blob = new Blob([res.data], {
        type: 'application/vnd.ms-excel'
      });
      if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(blob, name);
      } else {
        const link = document.createElement('a');
        if (!link.download) {
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', name);
          link.style = 'visibility:hidden';
          document.body.appendChild(link);
          $timeout(() => {
            link.click();
            document.body.removeChild(link);
          });
        }
      }
    }

    //open derived manufacturer popup
    function openMFRErrorPopup() {
      const data = {
        type: vm.customerTypeName,
        isCustOrDisty: true
      };
      DialogFactory.dialogService(
        CORE.MFR_IMPORT_MAPP_ERROR_MODAL_CONTROLLER,
        CORE.MFR_IMPORT_MAPP_ERROR_MODAL_VIEW,
        vm.event,
        data).then(() => { }, (data) => {
          if (data) {
            if (vm.gridOptions.gridApi) {
              vm.gridOptions.gridApi.grid.clearAllFilters();
            }
            vm.loadData();
          }
        }, (err) => BaseService.getErrorLog(err));
    }

    //common function
    function commonFunction(data) {
      if (!data.isContinue) {
        vm.loadData();
      } else {
        angular.element('#fiexcel').trigger('click');
      }
    }

    function UpdateVerificationManufacturer(data) {
      vm.cgBusyLoading = ManufacturerFactory.UpdateVerificationManufacturer().query({
        manufacturers: data.isAnyVerified
      }).$promise.then(() => {
        commonFunction(data);
      }).catch((error) => BaseService.getErrorLog(error));
    }

    //get derived manufacturer list
    function getDerivedManufacturerList() {
      vm.cgBusyLoading = ManufacturerFactory.getVerificationManufacturerList({
        type: vm.customerTypeName,
        isCustOrDisty: true
      }).query().$promise.then((response) => {
        if (response && response.data) {
          vm.apiVerificationErrorCount = (_.filter(response.data, (error) => !error.isVerified)).length;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }


    vm.import = (ev) => {
      vm.event = ev;
      if (vm.apiVerificationErrorCount > 0) {
        openMFRErrorPopup();
      } else {
        vm.importDetail(vm.event, true);
      }
    };

    vm.exportTemplate = (mfrType) => {
      let mfgType = null;
      if (mfrType === vm.CustOrDistyConst.CUSTOMER) {
        mfgType = CORE.modulesForExportSampleTemplate.CUSTOMER;
      } else if (mfrType === vm.CustOrDistyConst.SUPPLIER) {
        mfgType = CORE.modulesForExportSampleTemplate.SUPPLIER;
      }
      let messageContent = {};
      vm.cgBusyLoading = ManufacturerFactory.exportSampleMFGTemplate({
        mfgType: mfgType
      }).then((response) => {
        if (response.status === 404) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_NotFound);
          DialogFactory.messageAlertDialog({
            messageContent: messageContent,
            multiple: true
          });
        } else if (response.status === 403) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_AccessDenied);
          DialogFactory.messageAlertDialog({
            messageContent: messageContent,
            multiple: true
          });
        } else if (response.status === 401) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_Unauthorized);
          DialogFactory.messageAlertDialog({
            messageContent: messageContent,
            multiple: true
          });
        } else {
          exportFileDetail(response, mfgType + '.xlsx');
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //regenerate digikey token
    vm.generateToken = (row, ev) => {
      DialogFactory.dialogService(
        USER.EXTERNAL_API_POPUP_CONTROLLER,
        USER.EXTERNAL_API_POPUP_VIEW,
        ev,
        null).then(() => { }, () => { }, (err) => BaseService.getErrorLog(err));
    };

    vm.importDetail = (ev) => {
      vm.event = ev;
      if (vm.apiVerificationErrorCount > 0) {
        openMFRErrorPopup();
      } else {
        const data = {
          type: vm.customerTypeName,
          isCustOrDisty: vm.customerType === CORE.CUSTOMER_TYPE.CUSTOMER ? true : false
        };
        DialogFactory.dialogService(
          CORE.MFR_IMPORT_MODAL_CONTROLLER,
          CORE.MFR_IMPORT_MODAL_VIEW,
          vm.event,
          data).then(() => {
            if (data) {
              if (vm.gridOptions.gridApi) {
                vm.gridOptions.gridApi.grid.clearAllFilters();
              }
              vm.loadData();
            }
          }, () => {
            vm.loadData();
          }, (err) => BaseService.getErrorLog(err));
      }
    };

    vm.updateChartOfAccounts = (id) => {
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
          acct_id: id
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

    vm.UMIDHistory = (row, ev) => {
      row.title = `${vm.CurrentPageName} History`;
      row.TableName = CORE.DATAENTRYCHANGE_AUDITLOG_TABLENAME.MFGCODEMST;
      row.headerData = [{
        label: vm.CurrentPageName,
        value: BaseService.getMfgCodeNameFormat(row.mfgCode, row.mfgName),
        displayOrder: 1,
        valueLinkFn: vm.editCustomerOrSuppllier,
        valueLinkFnParams: row.id,
        labelLinkFn: vm.goToCustomerOrSuppllierList
      }];
      DialogFactory.dialogService(
        CORE.COMMON_HISTORY_POPUP_MODAL_CONTROLLER,
        CORE.COMMON_HISTORY_POPUP_MODAL_VIEW,
        ev,
        row).then(() => { }, () => vm.loadData(), (err) => BaseService.getErrorLog(err));
    };

    vm.goToCustomerOrSuppllierList = () => vm.customerType === CORE.CUSTOMER_TYPE.CUSTOMER ? BaseService.goToCustomerList() : BaseService.goToSupplierList();

    //get customer type
    vm.getCustomerType = (type) => {
      const cType = _.find(vm.customerTypeList, (customerType) => customerType.id === type);
      if (cType) {
        return cType.value;
      }
      return '';
    };
    vm.goToPaymentMethodDetail = (row) => {
      BaseService.openInNew(USER.ADMIN_PAYMENT_METHODS_MANAGEGENERICCATEGORY_STATE, { gencCategoryID: row.paymentMethodID });
    };
  }
})();
