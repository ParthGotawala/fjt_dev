(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('packingSlipGrid', packingSlipGrid);
    /** @ngInject */
    function packingSlipGrid($state, $stateParams, $timeout, BaseService, PackingSlipFactory, DialogFactory, USER, CORE, TRANSACTION, ManufacturerFactory, ComponentFactory, $filter) {
        const directive = {
            restrict: 'E',
            replace: false,
            scope: {
                receiptType: '=?'
            },
            templateUrl: 'app/directives/custom/packing-slip-grid/packing-slip-grid.html',
            controller: packingSlipGridCtrl,
            controllerAs: 'vm',
            link: function () {
            }
        };
        return directive;
        /** @ngInject */
        /**
        * Controller for view data of alternative details
        *
        * @param
        */

        function packingSlipGridCtrl($scope) {
            const vm = this;
            vm.transaction = TRANSACTION;
            vm.PackingSlipAdvanceFilters = angular.copy(CORE.PackingSlipAdvanceFilters);
            vm.DefaultDateTimeFormat = _dateTimeDisplayFormat;
            vm.DefaultDateFormat = _dateDisplayFormat;
            vm.tabType = $stateParams.type;
            vm.selectedIndex = 0;
            vm.isReadyToLock = vm.isNotApplicable = vm.customerpackingsliphistory = vm.isViewLock = vm.isUpdatable = vm.isCheckWFI = vm.IsPackingList = vm.isCheckInv = true;
            vm.isLocked = vm.applyFilter = vm.isCheckPaid = vm.isCheckPartiallyPaid = vm.isCheckATP = vm.isCheckIR = false;
            vm.currentPage = $state.current.name;
            vm.selectedRowsList = [];
            vm.totalSourceDataCount = 0;
            vm.statusTypeList = CORE.InvoiceVerificationStatusOptionsGridHeaderDropdown;
            vm.gridConfig = CORE.gridConfig;
            vm.LabelConstant = CORE.LabelConstant;
            vm.StatusOptionsGridHeaderDropdown = CORE.InvoiceVerificationStatusOptionsGridHeaderDropdown;
            vm.EmptyMesssage = {
                MESSAGE: angular.copy(USER.ADMIN_EMPTYSTATE.MATERIAL_RECEIVE.MESSAGE),
                IMAGEURL: angular.copy(USER.ADMIN_EMPTYSTATE.MATERIAL_RECEIVE.IMAGEURL),
                ADDNEWMESSAGE: stringFormat(USER.ADMIN_EMPTYSTATE.MATERIAL_RECEIVE.ADDNEWMESSAGE)
            };
            vm.receiptType = $scope.receiptType;
            vm.isAddInvoice = vm.receiptType === TRANSACTION.PackingSlipInvoiceTabName.SupplierInvoices ? true : false;
            vm.addInvoiceActionButtonName = vm.isAddInvoice ? 'Add Supplier Invoice' : null;
            vm.loginUser = BaseService.loginUser;
            vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
            vm.CORE_MFG_TYPE = CORE.MFG_TYPE;
            vm.packingSlipModeStatusOptionsGridHeaderDropdown = CORE.PackingSlipModeStatusOptionsGridHeaderDropdown;
            vm.PackingSlipPostingStatus = CORE.PackingSlipModeStatus;
            const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;
            vm.historyactionButtonName = 'Packing Slip Change History';
            vm.transTypeText = 'Packing Slip';
            vm.checkSearchType = vm.transaction.CheckSearchType[1].id;
            vm.dateTypeList = vm.transaction.MaterialReceiptDateFilterList;
            vm.selectedDateType = vm.dateTypeList[2].key;

            /* get all feature rights for customer payment */
            const getAllFeatureRights = () => {
                vm.allowToLockSupplierPackingSlipFeature = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToLockSupplierPackingSlip);
                if ((vm.allowToLockSupplierPackingSlipFeature === null || vm.allowToLockSupplierPackingSlipFeature === undefined) && (vm.reTryCount < _configGetFeaturesRetryCount)) {
                    vm.reTryCount++;
                    getAllFeatureRights(); // put for hard reload option as it will not get data from feature rights
                }
            };
            getAllFeatureRights();

            const initHeaderDetails = () => {
                vm.sourceHeader = [
                    {
                        field: 'Action',
                        displayName: 'Action',
                        width: 140,
                        cellTemplate: '<grid-action-view grid="grid" row="row" number-of-action-button="3"></grid-action-view>',
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
                        field: 'systemId',
                        displayName: vm.LabelConstant.COMMON.SystemID,
                        width: 125,
                        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
                        enableFiltering: true,
                        enableSorting: true
                    },
                    {
                        field: 'packingSlipModeStatusValue',
                        displayName: vm.LabelConstant.PACKING_SLIP.PackingSlipPostingStatus,
                        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
                            + '<span class="label-box" ng-class="{\'label-warning\':row.entity.packingSlipModeStatus == \'D\' ,\
                        \'label-primary\':row.entity.packingSlipModeStatus == \'P\' }"> \
                            {{COL_FIELD}}'
                            + '</span>'
                            + '</div>',
                        width: 120,
                        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
                        filter: {
                            term: null,
                            options: vm.packingSlipModeStatusOptionsGridHeaderDropdown
                        },
                        ColumnDataType: 'StringEquals',
                        enableFiltering: true,
                        enableSorting: true
                    },
                    {
                        field: 'statusValue',
                        displayName: 'Packing Slip Status',
                        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
                            + '<span class="label-box" \
                        ng-class="{\'label-danger\':row.entity.status == \'I\' ,\
                                   \'label-warning\':row.entity.status == \'W\', \
                                    \'label-info\':row.entity.status == \'IR\', \
                                     \'label-success\':row.entity.status == \'A\' ,\
                                      \'bg-purple\':row.entity.status == \'PP\' ,\
                                       \'label-primary\':row.entity.status == \'P\' ,\
                                         }"> \
                                            {{COL_FIELD}}'
                            + '</span>'
                            + '</div>',
                        width: 180,
                        ColumnDataType: 'StringEquals',
                        enableFiltering: false,
                        enableSorting: true
                    },
                    {
                        field: 'lockStatusValue',
                        displayName: vm.LabelConstant.PACKING_SLIP.LockStatus,
                        width: 145,
                        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
                            + '<span class="label-box" ng-class="grid.appScope.$parent.vm.getSupplierTransactionLockStatusClassName(row.entity.lockStatus)">'
                            + '{{COL_FIELD}}'
                            + '</span>'
                            + '</div>',
                        enableSorting: true,
                        enableFiltering: true,
                        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
                        filter: {
                            term: null,
                            options: TRANSACTION.PackingSlipLockStatusGridHeaderDropdown
                        }
                    },
                    {
                        field: 'isCustConsignedValue',
                        displayName: vm.LabelConstant.PACKING_SLIP.CustomerConsigned,
                        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
                            + '<span  ng-class="{\'label-box label-warning\':(!row.entity.isCustConsigned),\
                        \'label-box label-success\':(row.entity.isCustConsigned)}"> \
                            {{COL_FIELD}}'
                            + '</span>'
                            + '</div>',
                        width: '170',
                        allowCellFocus: false,
                        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
                        filter: {
                            term: null,
                            options: CORE.CustomerConsignedDropDown
                        },
                        ColumnDataType: 'StringEquals',
                        enableFiltering: true,
                        enableSorting: false
                    },
                    {
                        field: 'customerName',
                        displayName: vm.LabelConstant.PACKING_SLIP.Customer,
                        cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-if="row.entity.CustomerID && row.entity.customerName"> <span><a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-click="grid.appScope.$parent.vm.goToCustomer(row.entity.CustomerID);$event.preventDefault();">{{COL_FIELD}}</a>\
                                    </span>\
                                    <copy-text label="\'Customer\'" text="row.entity.customerName"></copy-text></div>',
                        width: '220',
                        enableCellEdit: false,
                        enableFiltering: true,
                        enableSorting: true
                    },
                    {
                        field: 'isNonUMIDStockValue',
                        displayName: vm.LabelConstant.PACKING_SLIP.NonUMIDStock,
                        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
                            + '<span  ng-class="{\'label-box label-warning\':(!row.entity.isNonUMIDStock),\
                        \'label-box label-success\':(row.entity.isNonUMIDStock)}"> \
                            {{COL_FIELD}}'
                            + '</span>'
                            + '</div>',
                        width: '170',
                        allowCellFocus: false,
                        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
                        filter: {
                            term: null,
                            options: CORE.NonUmidStockDropDown
                        },
                        ColumnDataType: 'StringEquals',
                        enableFiltering: true,
                        enableSorting: false
                    },
                    {
                        field: 'supplierCodeName',
                        width: '200',
                        displayName: 'Supplier',
                        cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                              <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToSupplier(row.entity.mfgCodeID);" tabindex="-1">{{COL_FIELD}}</a>\
                              <copy-text label="grid.appScope.$parent.vm.LabelConstant.MFG.Supplier" text="row.entity.supplierCodeName"></copy-text>\
                           </div>'
                    },
                    {
                        field: 'poNumber',
                        width: '175',
                        displayName: 'PO#',
                        cellTemplate: '<div class="ui-grid-cell-contents">\
                              <span ng-if="!row.entity.poId">{{COL_FIELD}}</span>\
                              <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToPurchaseOrderDetail(row.entity);" tabindex="-1" ng-if="row.entity.poId">{{COL_FIELD}}</a>\
                              <copy-text label="grid.appScope.$parent.vm.LabelConstant.PURCHASE_ORDER.PO" text="row.entity.poNumber"></copy-text>\
                           </div>'
                    },
                    {
                        field: 'poDate',
                        displayName: vm.LabelConstant.SalesOrder.PODate,
                        width: CORE.UI_GRID_COLUMN_WIDTH.ONLY_DATE_COLUMN,
                        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
                        type: 'date',
                        enableFiltering: false
                    },
                    {
                        field: 'packingSlipNumber',
                        width: '200',
                        displayName: 'Packing Slip#',
                        cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                              <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToManagePackingSlipDetail(row.entity);" tabindex="-1">{{COL_FIELD}}</a>\
                              <copy-text label="grid.appScope.$parent.vm.LabelConstant.SupplierInvoice.PackingSlipNumber" text="row.entity.packingSlipNumber"></copy-text>\
                              <md-icon md-font-icon="" class= "material-icons mat-icon icon-lock" ng-if="row.entity.lockStatus === grid.appScope.$parent.vm.transaction.CustomerPaymentLockStatus.Locked" style="margin-left:5px !important;"> </md-icon>\
                           </div>'
                    },
                    {
                        field: 'packingSlipDate',
                        displayName: vm.LabelConstant.PACKING_SLIP.PackingSlipDate,
                        width: CORE.UI_GRID_COLUMN_WIDTH.ONLY_DATE_COLUMN,
                        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
                        type: 'date',
                        enableFiltering: false
                    },
                    {
                        field: 'supplierSONumber',
                        width: '150',
                        displayName: CORE.LabelConstant.SalesOrder.SO,
                        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
                    },
                    {
                        field: 'soDate',
                        displayName: vm.LabelConstant.SalesOrder.SODate,
                        width: CORE.UI_GRID_COLUMN_WIDTH.ONLY_DATE_COLUMN,
                        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
                        type: 'date',
                        enableFiltering: false
                    },
                    {
                        field: 'receiptDate',
                        displayName: vm.LabelConstant.PACKING_SLIP.MaterialReceiptDate,
                        width: CORE.UI_GRID_COLUMN_WIDTH.ONLY_DATE_COLUMN,
                        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
                        type: 'date',
                        enableFiltering: false
                    },
                    {
                        field: 'packingSlipDocCount',
                        width: '120',
                        displayName: vm.currentPage === vm.transaction.TRANSACTION_SUPPLIER_INVOICE_STATE ? 'Invoice Documents' : 'Packing Slip Documents',
                        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">\
                          <a class="cursor-pointer underline" ng-class="{\'grid-cell-text-danger\': !COL_FIELD, \'cm-text-decoration\': COL_FIELD}" ng-click="grid.appScope.$parent.vm.goToManagePackingSlipDetail(row.entity, grid.appScope.$parent.vm.transaction.MaterialReceiveTabType.Documents);" tabindex="-1">{{COL_FIELD | numberWithoutDecimal }}</a> \
                        </div>'
                        // cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-class="{\'grid-cell-text-danger\': !COL_FIELD}">{{COL_FIELD | numberWithoutDecimal }}</div>'
                    },
                    {
                        field: 'TotalLines',
                        width: 100,
                        displayName: vm.LabelConstant.PACKING_SLIP.TotalLines + ' Received',
                        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal }}</div>'
                    },
                    {
                        field: 'RejectedLines',
                        width: 85,
                        displayName: vm.LabelConstant.PACKING_SLIP.RejectedLines,
                        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal }}</div>'
                    },
                    {
                        field: 'AcceptedWithDeviationLines',
                        width: 125,
                        displayName: vm.LabelConstant.PACKING_SLIP.AcceptedWithDeviationLines,
                        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal }}</div>'
                    },
                    {
                        field: 'PendingLines',
                        width: 85,
                        displayName: vm.LabelConstant.PACKING_SLIP.PendingLines,
                        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal }}</div>'
                    },
                    {
                        field: 'AcceptedLines',
                        width: 85,
                        displayName: vm.LabelConstant.PACKING_SLIP.AcceptedLines,
                        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal }}</div>'
                    },
                    {
                        field: 'refInvoiceNumber',
                        width: 150,
                        displayName: 'Ref. Invoice#',
                        cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                              <a class="cm-text-decoration underline" ng-if="row.entity.refInvoiceNumber" ng-click="grid.appScope.$parent.vm.goToSupplierInvoiceDetail(row.entity);" tabindex="-1">{{COL_FIELD}}</a>\
                              <copy-text label="grid.appScope.$parent.vm.LabelConstant.SupplierInvoice.RefInvoiceNumber" text="row.entity.refInvoiceNumber" ng-if="row.entity.refInvoiceNumber"></copy-text>\
                              <md-icon md-font-icon="" class= "material-icons mat-icon icon-lock" ng-if="row.entity.refInvoiceLockStatus === grid.appScope.$parent.vm.transaction.CustomerPaymentLockStatus.Locked" style="margin-left:5px !important;"> </md-icon>\
                           </div>'
                    },
                    {
                        field: 'refInvoiceDate',
                        width: CORE.UI_GRID_COLUMN_WIDTH.ONLY_DATE_COLUMN,
                        displayName: 'Ref. Invoice Date',
                        cellTemplate: '<div class="ui-grid-cell-contents text-left grid-cell-text-bold" ng-if="row.entity.receiptType == \'P\'">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
                        type: 'date',
                        enableFiltering: false
                    },
                    {
                        field: 'lockedAt',
                        displayName: 'Locked Date',
                        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
                        type: 'datetime',
                        enableFiltering: false
                    },
                    {
                        field: 'lockByName',
                        displayName: 'Locked By',
                        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
                        enableFiltering: true
                    },
                    {
                        field: 'lockedByRoleName',
                        displayName: 'Locked By Role',
                        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
                        enableFiltering: true
                    },
                    {
                        field: 'updatedAt',
                        displayName: 'Modified Date',
                        width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
                        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                        type: 'datetime',
                        enableFiltering: false
                    },
                    {
                        field: 'updatedByName',
                        displayName: 'Modified By',
                        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
                        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                        enableFiltering: true,
                        enableSorting: true
                    },
                    {
                        field: 'updatedbyRole',
                        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
                        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
                        type: 'StringEquals',
                        enableFiltering: true
                    },
                    {
                        field: 'createdAt',
                        displayName: 'Created Date',
                        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
                        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateTimeFormat}}</div>',
                        enableSorting: true,
                        type: 'datetime',
                        enableFiltering: false
                    },
                    {
                        field: 'createdByName',
                        displayName: 'Created By',
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
            };
            initHeaderDetails();
            const initPageInfo = () => {
                vm.pagingInfo = {
                    Page: CORE.UIGrid.Page(),
                    SortColumns: [['receiptDate', 'DESC']],
                    SearchColumns: [],
                    pageName: CORE.PAGENAME_CONSTANT[7].PageName
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
                allowToExportAllData: true,
                exporterCsvFilename: `${vm.transaction.TRANSACTION_MATERIAL_RECEIVE_LABEL}.csv`,
                exporterAllDataFn: () => {
                    const pagingInfoOld = _.clone(vm.pagingInfo);
                    pagingInfoOld.pageSize = 0;
                    pagingInfoOld.Page = 1;
                    vm.gridOptions.isExport = pagingInfoOld.isExport = true;
                    return PackingSlipFactory.getPackingSlipList().query(pagingInfoOld).$promise.then((response) => {
                        if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                            if (response && response.data && response.data.packingSlip) {
                                setDataAfterGetAPICall(response, false);
                                return response.data.packingSlip;
                            }
                        }
                    }).catch((error) => BaseService.getErrorLog(error));
                }
            };

            //set Filter Labels
            function setFilteredLabels() {
                vm.PackingSlipAdvanceFilters.Supplier.isDeleted = !(vm.mfgCodeDetailModel && vm.mfgCodeDetailModel.length > 0);
                vm.PackingSlipAdvanceFilters.PackingSlipStatus.isDeleted = !(vm.isCheckInv || vm.isCheckWFI || vm.isCheckIR || vm.isCheckATP || vm.isCheckPartiallyPaid || vm.isCheckPaid);
                vm.PackingSlipAdvanceFilters.Search_PO_SO_Packingslip_InvoiceNo.isDeleted = !(vm.advanceSearchPoSoPsInv);
                vm.PackingSlipAdvanceFilters.MFRPN.isDeleted = !(vm.filterMFRPNText);
                vm.PackingSlipAdvanceFilters.ReceivedStatus.isDeleted = !(vm.isPending || vm.isAccepted || vm.isAcceptedWithDeviation || vm.isRejected);
                vm.PackingSlipAdvanceFilters.PaymentOrCheck.isDeleted = !(vm.chequeNumber);
                vm.PackingSlipAdvanceFilters.LockStatus.isDeleted = !(vm.isReadyToLock || vm.isNotApplicable || vm.isLocked);
                vm.PackingSlipAdvanceFilters.PostingStatus.isDeleted = !(vm.isDraft || vm.isPublish);
                vm.PackingSlipAdvanceFilters.Search_PS_Comments.isDeleted = !(vm.PSComments);
                if (vm.packingSlipFromDate || vm.packingSlipToDate) {
                    vm.PackingSlipAdvanceFilters.PackingSlipDate.isDeleted = !(vm.selectedDateType === vm.dateTypeList[2].key);
                    vm.PackingSlipAdvanceFilters.MaterialReceiptDate.isDeleted = !(vm.selectedDateType === vm.dateTypeList[1].key);
                    vm.PackingSlipAdvanceFilters.PODate.isDeleted = !(vm.selectedDateType === vm.dateTypeList[0].key);
                } else {
                    vm.PackingSlipAdvanceFilters.PackingSlipDate.isDeleted = true;
                    vm.PackingSlipAdvanceFilters.MaterialReceiptDate.isDeleted = true;
                    vm.PackingSlipAdvanceFilters.PODate.isDeleted = true;
                }

                //==>>>Set filter tool-tip
                vm.PackingSlipAdvanceFilters.Supplier.tooltip = getFilterTooltip(vm.mfgCodeListToDisplay, vm.mfgCodeDetailModel, 'id', 'mfgCodeName');
                if (vm.filterMFRPNText) {
                    vm.PackingSlipAdvanceFilters.MFRPN.tooltip = vm.filterMFRPNText;
                }
                vm.PackingSlipAdvanceFilters.Search_PO_SO_Packingslip_InvoiceNo.tooltip = vm.advanceSearchPoSoPsInv ? vm.advanceSearchPoSoPsInv : null;
                vm.pagingInfo.advanceSearchPoSoPsInv = BaseService.convertSpecialCharToSearchString(vm.advanceSearchPoSoPsInv);

                vm.PackingSlipAdvanceFilters.Search_PS_Comments.tooltip = vm.PSComments ? vm.PSComments : null;
                vm.pagingInfo.PSComments = BaseService.convertSpecialCharToSearchString(vm.PSComments);

                vm.PackingSlipAdvanceFilters.PaymentOrCheck.tooltip = vm.chequeNumber ? vm.chequeNumber : null;
                vm.pagingInfo.paymentNumber = BaseService.convertSpecialCharToSearchString(vm.chequeNumber);

                if (vm.isReadyToLock && vm.isNotApplicable && vm.isLocked) {
                    vm.pagingInfo.lockStatusFilter = null;
                    vm.PackingSlipAdvanceFilters.LockStatus.tooltip = 'All';
                } else if (!vm.isReadyToLock && !vm.isNotApplicable && !vm.isLocked) {
                    vm.PackingSlipAdvanceFilters.LockStatus.tooltip = vm.pagingInfo.lockStatusFilter = null;
                } else {
                    const searchLockStatus = [];
                    const searchLockStatusTooltip = [];
                    if (vm.isNotApplicable) {
                        searchLockStatus.push(vm.transaction.PackingSlipLockStatus.NA.id);
                        searchLockStatusTooltip.push(vm.transaction.PackingSlipLockStatus.NA.value);
                    }
                    if (vm.isReadyToLock) {
                        searchLockStatus.push(vm.transaction.PackingSlipLockStatus.ReadyToLock.id);
                        searchLockStatusTooltip.push(vm.transaction.PackingSlipLockStatus.ReadyToLock.value);
                    }
                    if (vm.isLocked) {
                        searchLockStatus.push(vm.transaction.PackingSlipLockStatus.Locked.id);
                        searchLockStatusTooltip.push(vm.transaction.PackingSlipLockStatus.Locked.value);
                    }
                    vm.pagingInfo.lockStatusFilter = `'${searchLockStatus.join('\',\'')}'`;
                    vm.PackingSlipAdvanceFilters.LockStatus.tooltip = `${searchLockStatusTooltip.join('<br />')}`;
                }

                if (vm.isDraft && vm.isPublish) {
                    vm.pagingInfo.PostingStatusFilter = null;
                    vm.PackingSlipAdvanceFilters.PostingStatus.tooltip = 'All';
                } else if (!vm.isDraft && !vm.isPublish) {
                    vm.PackingSlipAdvanceFilters.PostingStatus.tooltip = vm.pagingInfo.PostingStatusFilter = null;
                } else {
                    if (vm.isDraft) {
                        vm.pagingInfo.PostingStatusFilter = vm.PackingSlipPostingStatus[0].ID;
                        vm.PackingSlipAdvanceFilters.PostingStatus.tooltip = vm.PackingSlipPostingStatus[0].Name;
                    } else if(vm.isPublish) {
                        vm.pagingInfo.PostingStatusFilter = vm.PackingSlipPostingStatus[1].ID;
                        vm.PackingSlipAdvanceFilters.PostingStatus.tooltip = vm.PackingSlipPostingStatus[1].Name;
                    }
                }

                if (!vm.isPending && !vm.isAccepted && !vm.isAcceptedWithDeviation && !vm.isRejected) {
                    vm.pagingInfo.receivedStatusFilter = vm.PackingSlipAdvanceFilters.ReceivedStatus.tooltip = null;
                } else {
                    const receivedStatusFilter = [];
                    const receivedStatusFilterTooltip = [];
                    if (vm.isPending) {
                        receivedStatusFilter.push('PendingLines > 0');
                        receivedStatusFilterTooltip.push(vm.transaction.PackingSlipReceivedStatus[0].key);
                    }
                    if (vm.isAccepted) {
                        receivedStatusFilter.push('AcceptedLines > 0');
                        receivedStatusFilterTooltip.push(vm.transaction.PackingSlipReceivedStatus[1].key);
                    }
                    if (vm.isAcceptedWithDeviation) {
                        receivedStatusFilter.push('AcceptedWithDeviationLines > 0');
                        receivedStatusFilterTooltip.push(vm.transaction.PackingSlipReceivedStatus[3].key);
                    }
                    if (vm.isRejected) {
                        receivedStatusFilter.push('RejectedLines > 0');
                        receivedStatusFilterTooltip.push(vm.transaction.PackingSlipReceivedStatus[2].key);
                    }
                    vm.PackingSlipAdvanceFilters.ReceivedStatus.tooltip = vm.isPending && vm.isAccepted && vm.isAcceptedWithDeviation && vm.isRejected ? 'All' : `${receivedStatusFilterTooltip.join('<br />')}`;
                    vm.pagingInfo.receivedStatusFilter = receivedStatusFilter.join(' OR ');
                }

                if (!vm.isCheckInv && !vm.isCheckWFI && !vm.isCheckIR && !vm.isCheckATP && !vm.isCheckPartiallyPaid && !vm.isCheckPaid) {
                    vm.pagingInfo.whereStatus = vm.PackingSlipAdvanceFilters.PackingSlipStatus.tooltip = null;
                } else {
                    const searchCol = [];
                    const packingSlipStatusTooltip = [];
                    if (vm.isCheckInv) {
                        searchCol.push(vm.statusTypeList[1].code);
                        packingSlipStatusTooltip.push(vm.statusTypeList[1].value);
                    }
                    if (vm.isCheckWFI) {
                        searchCol.push(vm.statusTypeList[2].code);
                        packingSlipStatusTooltip.push(vm.statusTypeList[2].value);
                    }
                    if (vm.isCheckIR) {
                        searchCol.push(vm.statusTypeList[3].code);
                        packingSlipStatusTooltip.push(vm.statusTypeList[3].value);
                    }
                    if (vm.isCheckATP) {
                        searchCol.push(vm.statusTypeList[4].code);
                        packingSlipStatusTooltip.push(vm.statusTypeList[4].value);
                    }
                    if (vm.isCheckPartiallyPaid) {
                        searchCol.push(vm.statusTypeList[7].code);
                        packingSlipStatusTooltip.push(vm.statusTypeList[7].value);
                    }
                    if (vm.isCheckPaid) {
                        searchCol.push(vm.statusTypeList[5].code);
                        packingSlipStatusTooltip.push(vm.statusTypeList[5].value);
                    }
                    vm.pagingInfo.whereStatus = searchCol;
                    vm.PackingSlipAdvanceFilters.PackingSlipStatus.tooltip = vm.isCheckInv && vm.isCheckWFI && vm.isCheckIR && vm.isCheckATP && vm.isCheckPartiallyPaid && vm.isCheckPaid ? 'All' : `${packingSlipStatusTooltip.join('<br />')}`;
                }

                let tooltip = null;
                if (vm.packingSlipFromDate && vm.packingSlipToDate) {
                    tooltip = 'From: ' + $filter('date')(new Date(vm.packingSlipFromDate), vm.DefaultDateFormat) + ' To:' + $filter('date')(new Date(vm.packingSlipToDate), vm.DefaultDateFormat);
                }
                else if (vm.packingSlipFromDate) {
                    tooltip = $filter('date')(new Date(vm.packingSlipFromDate), vm.DefaultDateFormat);
                }
                if (vm.selectedDateType === vm.dateTypeList[2].key) {
                    vm.PackingSlipAdvanceFilters.PackingSlipDate.tooltip = tooltip;
                } else if (vm.selectedDateType === vm.dateTypeList[1].key) {
                    vm.PackingSlipAdvanceFilters.MaterialReceiptDate.tooltip = tooltip;
                } else if (vm.selectedDateType === vm.dateTypeList[0].key) {
                    vm.PackingSlipAdvanceFilters.PODate.tooltip = tooltip;
                }
                //<<<==Set filter tool-tip

                if (vm.gridOptions && vm.gridOptions.gridApi) {
                    vm.isUiGridColumnFiltersApplied = _.some(vm.gridOptions.gridApi.grid.columns, (col) => !_.isEmpty(col.filters[0].term));
                }

                vm.numberOfMasterFiltersApplied = _.filter(vm.PackingSlipAdvanceFilters, (num) => num.isDeleted === false).length;
            }

            vm.removeAppliedFilter = (item) => {
                if (item) {
                    item.isDeleted = true;
                    switch (item.value) {
                        case vm.PackingSlipAdvanceFilters.Supplier.value:
                            vm.mfgCodeDetailModel = [];
                            break;
                        case vm.PackingSlipAdvanceFilters.PackingSlipStatus.value:
                            vm.isCheckInv = vm.isCheckWFI = vm.isCheckIR = vm.isCheckATP = vm.isCheckPartiallyPaid = vm.isCheckPaid = false;
                            break;
                        case vm.PackingSlipAdvanceFilters.Search_PO_SO_Packingslip_InvoiceNo.value:
                            vm.advanceSearchPoSoPsInv = null;
                            break;
                        case vm.PackingSlipAdvanceFilters.MFRPN.value:
                            clearMFRPN();
                            break;
                        case vm.PackingSlipAdvanceFilters.ReceivedStatus.value:
                            vm.isPending = vm.isAccepted = vm.isAcceptedWithDeviation = vm.isRejected = false;
                            break;
                        case vm.PackingSlipAdvanceFilters.PackingSlipDate.value:
                        case vm.PackingSlipAdvanceFilters.MaterialReceiptDate.value:
                        case vm.PackingSlipAdvanceFilters.PODate.value:
                            vm.packingSlipFromDate = vm.packingSlipToDate = null;
                            vm.resetDateFilter();
                            break;
                        case vm.PackingSlipAdvanceFilters.PaymentOrCheck.value:
                            vm.chequeNumber = null;
                            break;
                        case vm.PackingSlipAdvanceFilters.LockStatus.value:
                            vm.isNotApplicable = vm.isReadyToLock = vm.isLocked = false;
                            break;
                        case vm.PackingSlipAdvanceFilters.PostingStatus.value:
                            vm.isPublish = vm.isDraft = false;
                            break;
                        case vm.PackingSlipAdvanceFilters.Search_PS_Comments.value:
                            vm.PSComments = null;
                            break;
                    }
                    vm.loadData();
                }
            };

            vm.removeSearchFilter = () => {
                vm.advanceSearchPoSoPsInv = null;
                vm.loadData();
            };

            vm.removeChequeFilter = () => {
                vm.chequeNumber = null;
                vm.loadData();
            };

            vm.removeCommentsFilter = () => {
                vm.PSComments = null;
                vm.loadData();
            };

            //Clear grid Column Filter
            vm.clearGridColumnFilter = (item) => {
                if (item) {
                    item.filters[0].term = undefined;
                    if (!item.isFilterDeregistered) {
                        //refresh data grid
                        vm.gridOptions.gridApi.grid.onClearUnregisteredColumnFilter();
                    }
                }
            };

            vm.applyFiltersOnEnter = (event) => {
                if (event.keyCode === 13) {
                    vm.searchAdvanceFilter();
                }
            };

            vm.searchAdvanceFilter = () => {
                if (!vm.filtersInfo.$valid && BaseService.focusRequiredField(vm.filtersInfo)) {
                    return;
                }
                vm.loadData();
            };

            vm.resetAdvanceFilter = (isReset) => {
                if (vm.gridOptions && vm.gridOptions.gridApi) {
                    _.each(vm.gridOptions.gridApi.grid.columns, (col) => {
                        if (!_.isEmpty(col.filters[0].term)) {
                            vm.callLoadData = false;
                            col.filters[0].term = undefined;
                        }
                    });
                }
                //vm.isCheckAll = false;
                vm.isReadyToLock = vm.isNotApplicable = vm.isCheckInv = vm.isCheckWFI = isReset ? true : false;
                vm.isPublish = vm.isDraft = vm.isLocked = vm.isCheckIR = vm.isCheckATP = vm.isCheckPaid = vm.isPending = vm.isAccepted = vm.isAcceptedWithDeviation = vm.isRejected = false;
                vm.isCheckPartiallyPaid = false;
                vm.mfrSearchText = undefined;
                vm.clearMfrSearchText();
                vm.mfgCodeDetailModel = [];
                vm.PSComments = vm.advanceSearchPoSoPsInv = vm.packingSlipFromDate = vm.packingSlipToDate = vm.chequeNumber = null;
                vm.selectedDateType = vm.dateTypeList[2].key;
                vm.resetDateFilter();
                vm.checkSearchType = vm.transaction.CheckSearchType[1].id;
                clearMFRPN();
                vm.loadData();
            };

            function clearMFRPN() {
                vm.filterMFRPNText = null;
                vm.pagingInfo.mfrPnId = null;
                $scope.$broadcast(vm.autoCompletecomponent.inputName, null);
            }

            function setDataAfterGetAPICall(packingSlip, isGetDataDown) {
                if (packingSlip && packingSlip.data && packingSlip.data.packingSlip) {
                    if (!isGetDataDown) {
                        vm.sourceData = packingSlip.data.packingSlip;
                        vm.currentdata = vm.sourceData.length;
                    }
                    else if (packingSlip.data.packingSlip.length > 0) {
                        vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(packingSlip.data.packingSlip);
                        vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
                    }

                    if (!isGetDataDown && vm.sourceData && vm.sourceData.length > 0) {
                        _.map(vm.sourceData, (data) => {
                            if (data.refInvoiceNumber || data.itemReceived === 0) {
                                data.isDisabledAddInvoice = true;
                            }
                            else {
                                data.isDisabledAddInvoice = false;
                            }
                            if (!vm.allowToLockSupplierPackingSlipFeature) {
                                data.isDisableLockTransaction = true;
                            }
                            if (data.lockStatus === TRANSACTION.CustomerPaymentLockStatus.Locked) {
                                data.isDisableLockTransaction = true;
                                data.isDisabledDelete = !vm.loginUser.isUserSuperAdmin;
                            }
                            data.packingSlipDate = BaseService.getUIFormatedDate(data.packingSlipDate, vm.DefaultDateFormat);
                            data.receiptDate = BaseService.getUIFormatedDate(data.receiptDate, vm.DefaultDateFormat);
                            data.refInvoiceDate = data.refInvoiceDate ? BaseService.getUIFormatedDate(data.refInvoiceDate, vm.DefaultDateFormat) : null;
                        });
                    }
                    // must set after new data comes
                    vm.totalSourceDataCount = packingSlip.data.Count;
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
                        if (vm.pagingInfo.SearchColumns.length > 0 || (vm.pagingInfo.whereStatus && vm.pagingInfo.whereStatus.length > 0) || vm.pagingInfo.mfgCodeId || vm.pagingInfo.packingSlipToDate || vm.pagingInfo.packingSlipFromDate || vm.pagingInfo.receivedStatusFilter || vm.isReadyToLock || vm.isNotApplicable || vm.isLocked || vm.isDraft || vm.isPublish || vm.chequeNumber || vm.advanceSearchPoSoPsInv || vm.PSComments || vm.filterMFRPNText) {
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
            }

            vm.loadData = () => {
                if (vm.mfgCodeDetailModel && vm.mfgCodeDetailModel.length > 0) {
                    vm.pagingInfo.mfgCodeIds = vm.mfgCodeDetailModel.join(',');
                }
                else {
                    vm.pagingInfo.mfgCodeIds = null;
                }

                if (vm.packingSlipFromDate) {
                    vm.pagingInfo.packingSlipFromDate = (BaseService.getAPIFormatedDate(vm.packingSlipFromDate));
                }
                else {
                    vm.pagingInfo.packingSlipFromDate = null;
                }
                if (vm.packingSlipToDate) {
                    vm.pagingInfo.packingSlipToDate = (BaseService.getAPIFormatedDate(vm.packingSlipToDate));
                }
                else {
                    vm.pagingInfo.packingSlipToDate = null;
                }
                vm.pagingInfo.selectedDateType = vm.selectedDateType;
                vm.pagingInfo.exactPaymentNumberSearch = vm.checkSearchType === vm.transaction.CheckSearchType[1].id;
                vm.pagingInfo.SearchColumnName = TRANSACTION.PackingSlipColumn.Status;
                vm.pagingInfo.receiptType = 'P';
                // vm.pagingInfo.isPackingslipWithRejectedLines = vm.isPackingslipWithRejectedLines;
                if (vm.pagingInfo.SortColumns.length === 0) {
                    vm.pagingInfo.SortColumns = [['receiptDate', 'DESC']];
                }
                BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
                setFilteredLabels();
                vm.cgBusyLoading = PackingSlipFactory.getPackingSlipList().query(vm.pagingInfo).$promise.then((response) => {
                    if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                        setDataAfterGetAPICall(response, false);
                    }
                }).catch((error) => BaseService.getErrorLog(error));
            };

            vm.getDataDown = () => {
                vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
                vm.cgBusyLoading = PackingSlipFactory.getPackingSlipList().query(vm.pagingInfo).$promise.then((response) => {
                    setDataAfterGetAPICall(response, true);
                }).catch((error) => BaseService.getErrorLog(error));
            };

            vm.updateRecord = (row) => vm.addPackingSlip(row.entity.id);

            vm.deleteRecord = (pakingSlip) => {
                let selectedIDs = [];
                if (pakingSlip) {
                    if (pakingSlip.lockStatus === TRANSACTION.CustomerPaymentLockStatus.Locked && !vm.loginUser.isUserSuperAdmin) {
                        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SUPPLIER_TRANSACTION_DELETE_VALIDATION_FOR_LOCKED_HALT_TRANSACTIONS);
                        messageContent.message = stringFormat(messageContent.message, 'Locked');
                        const model = {
                            messageContent: messageContent
                        };
                        DialogFactory.messageAlertDialog(model);
                        return;
                    }
                    selectedIDs.push(pakingSlip.id);
                } else {
                    vm.selectedRows = vm.selectedRowsList;
                    if (vm.selectedRows.length > 0) {
                        if (!vm.loginUser.isUserSuperAdmin) {
                            const inValidRecords = _.filter(vm.selectedRowsList, (a) => a.lockStatus === TRANSACTION.CustomerPaymentLockStatus.Locked);
                            if (inValidRecords && inValidRecords.length > 0) {
                                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SUPPLIER_TRANSACTION_DELETE_VALIDATION_FOR_LOCKED_HALT_TRANSACTIONS);
                                messageContent.message = stringFormat(messageContent.message, 'Locked');
                                const model = {
                                    messageContent: messageContent
                                };
                                DialogFactory.messageAlertDialog(model);
                                return;
                            }
                        }
                        selectedIDs = vm.selectedRows.map((item) => item.id);
                    }
                }
                if (selectedIDs && selectedIDs.length) {
                    const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
                    messageContent.message = stringFormat(messageContent.message, 'Packing Slip', selectedIDs.length);
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
                            vm.cgBusyLoading = PackingSlipFactory.deletePackingSlip().query({ objIDs: objIDs }).$promise.then((res) => {
                                if (res && res.data && (res.data.length > 0 || res.data.transactionDetails)) {
                                    const data = {
                                        TotalCount: res.data.transactionDetails[0].TotalCount,
                                        pageName: CORE.PageName.material_receipt
                                    };
                                    BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                                        const
                                            objIDs = {
                                                id: selectedIDs,
                                                CountList: true
                                            };
                                        return PackingSlipFactory.deletePackingSlip().query({ objIDs: objIDs }).$promise.then((res) => {
                                            let data = {};
                                            data = res.data;
                                            data.pageTitle = pakingSlip ? pakingSlip.packingSlipNumber : null;
                                            data.PageName = CORE.PageName.material_receipt;
                                            data.selectedIDs = stringFormat('{0}{1}', selectedIDs.length, ' Selected');
                                            data.id = selectedIDs;
                                            if (res.data) {
                                                DialogFactory.dialogService(
                                                    USER.ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER,
                                                    USER.ADMIN_SHOW_TRANSACTION_DETAILS_VIEW,
                                                    ev,
                                                    data).then(() => {
                                                    }, () => { });
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

            /* delete multiple data called from directive of ui-grid*/
            vm.deleteMultipleData = () => {
                vm.deleteRecord();
            };

            vm.lockRecord = (row, event) => {
                var selectedIds = [];
                if (!vm.allowToLockSupplierPackingSlipFeature) {
                    return;
                }
                if (row && row.entity) {
                    if (row.entity.lockStatus !== TRANSACTION.CustomerPaymentLockStatus.ReadyToLock) {
                        const model = {
                            messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SUPPLIER_TRANSACTION_IS_ALREADY_LOCKED
                        };
                        DialogFactory.messageAlertDialog(model);
                        return;
                    }
                    selectedIds.push(row.entity.id);
                } else {
                    if (vm.selectedRowsList.length > 0) {
                        const inValidRecords = _.filter(vm.selectedRowsList, (a) => a.lockStatus !== TRANSACTION.CustomerPaymentLockStatus.ReadyToLock);
                        if (inValidRecords && inValidRecords.length > 0) {
                            const model = {
                                messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SUPPLIER_TRANSACTION_IS_ALREADY_LOCKED
                            };
                            DialogFactory.messageAlertDialog(model);
                            return;
                        }
                        selectedIds = vm.selectedRowsList.map((item) => item.id);
                    }
                }
                /*if no record selected then return*/
                if (!selectedIds || selectedIds.length === 0) {
                    return;
                }
                const obj = {
                    messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.LOCK_RECORD_CONFIRMATION,
                    btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
                    canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                };
                DialogFactory.messageConfirmDialog(obj).then((yes) => {
                    if (yes) {
                        const objData = {
                            receiptType: 'P',
                            ids: selectedIds
                        };
                        vm.cgBusyLoading = PackingSlipFactory.lockTransaction().query(objData).$promise.then((response) => {
                            if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                                vm.loadData();
                            }
                        }).catch((error) => BaseService.getErrorLog(error));
                    }
                }, () => {
                    // Cancel
                });
            };

            vm.addPackingSlip = (id) => BaseService.goToManagePackingSlipDetail(id);;

            vm.addInvoiceInPackingSlip = (row) => {
                if (row.entity) {
                    $state.go(TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_INVOICE_STATE, {
                        type: TRANSACTION.SupplierInvoiceType.Detail,
                        id: null,
                        slipType: CORE.PackingSlipInvoiceTabName,
                        packingSlipNumber: row.entity.packingSlipNumber
                    });
                }
            };

            vm.opencustomerpackingSlipChangesHistoryAuditLog = (row, ev) => {
                const data = row.entity;
                DialogFactory.dialogService(
                    TRANSACTION.TRANSACTION_PACKING_SLIP_CHANGE_HISTORY_CONTROLLER,
                    TRANSACTION.TRANSACTION_PACKING_SLIP_CHANGE_HISTORY_VIEW,
                    ev,
                    data).then(() => { }, () => { }, (error) => BaseService.getErrorLog(error));
            };

            vm.getMfgSearch = () => {
                vm.mfrSearchText = undefined;

                vm.cgBusyLoading = ManufacturerFactory.getAllManufacturerWithFormattedCodeList({ mfgType: CORE.MFG_TYPE.DIST }).query().$promise.then((mfgcodes) => {
                    vm.mfgCodeDetail = vm.mfgCodeListToDisplay = [];
                    if (mfgcodes && mfgcodes.data) {
                        vm.mfgCodeDetail = mfgcodes.data;
                        vm.mfgCodeListToDisplay = angular.copy(vm.mfgCodeDetail);
                    }
                    return vm.mfgCodeDetail;
                }).catch((error) => BaseService.getErrorLog(error));
            };
            vm.getMfgSearch();

            vm.todayDate = new Date();

            vm.onCheckNumberChange = () => {
                if (vm.chequeNumber) {
                    vm.isCheckPaid = vm.isCheckPartiallyPaid = true;
                }
            };

            vm.searchMfrList = () => {
                let mfrListToFilter;
                if (vm.timeoutWatch) {
                    $timeout.cancel(vm.timeoutWatch);
                }
                vm.timeoutWatch = $timeout(() => {
                    vm.mfgCodeDetailModel = [];
                    mfrListToFilter = angular.copy(vm.mfgCodeDetail);
                    vm.mfgCodeListToDisplay = vm.mfrSearchText ? _.filter(mfrListToFilter, (item) => item.mfgCodeName.toLowerCase().contains(vm.mfrSearchText.toLowerCase())) : mfrListToFilter;
                }, _configTimeout);
            };

            vm.clearMfrSearchText = () => {
                vm.mfrSearchText = undefined;
                vm.searchMfrList();
            };

            vm.clearManufacturerFilter = () => {
                vm.mfgCodeDetailModel = [];
            };

            const initAutoComplete = () => {
                vm.autoCompletecomponent = {
                    columnName: 'mfgPN',
                    keyColumnName: 'id',
                    keyColumnId: null,
                    inputName: CORE.LabelConstant.MFG.MFGPN,
                    placeholderName: CORE.LabelConstant.MFG.MFGPN,
                    isAddnew: false,
                    isRequired: false,
                    onSelectCallbackFn: (item) => {
                        if (item && item.id) {
                            vm.pagingInfo.mfrPnId = item.id;
                            vm.filterMFRPNText = item.mfgPN;
                        } else {
                            vm.pagingInfo.mfrPnId = null;
                            vm.filterMFRPNText = null;
                        }
                    },
                    onSearchFn: function (query) {
                        const searchObj = {
                            query: query,
                            inputName: vm.autoCompletecomponent.inputName,
                            isContainCPN: true
                        };
                        return searchMfrPn(searchObj);
                    }
                };
            };

            initAutoComplete();

            const searchMfrPn = (searchObj) => ComponentFactory.getComponentMFGAliasSearch().query({ listObj: searchObj }).$promise.then((component) => component.data.data).catch((error) => BaseService.getErrorLog(error));

            /* to get/apply class for Supplier transaction lock status */
            vm.getSupplierTransactionLockStatusClassName = (lockStatus) => BaseService.getCustPaymentLockStatusClassName(lockStatus);

            vm.goToSupplierList = () => {
                BaseService.goToSupplierList();
            };

            vm.goToSupplier = (supplierId) => {
                if (supplierId) {
                    BaseService.goToSupplierDetail(supplierId);
                }
            };

            vm.goToSupplierInvoiceDetail = (row) => {
                if (row) {
                    BaseService.goToSupplierInvoiceDetail(TRANSACTION.SupplierInvoiceType.Detail, row.invoiceId);
                }
            };

            vm.goToManagePackingSlipDetail = (row, type) => {
                if (row) {
                    BaseService.goToManagePackingSlipDetail(row.id, type);
                }
            };

            vm.goToPartList = () => {
                BaseService.goToPartList();
            };

            vm.goToPurchaseOrderDetail = (row) => {
                if (row) {
                    BaseService.goToPurchaseOrderDetail(row.poId);
                }
            };

            vm.goToCustomer = (id) => BaseService.goToCustomer(id);
        }
    }
})();
