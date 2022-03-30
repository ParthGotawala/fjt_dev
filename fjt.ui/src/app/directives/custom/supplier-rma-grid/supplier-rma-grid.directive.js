(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('supplierRmaGrid', supplierRmaGrid);
    /** @ngInject */
    function supplierRmaGrid($state, $timeout, BaseService, DialogFactory, USER, CORE, TRANSACTION, ManufacturerFactory, PackingSlipFactory, SupplierRMAFactory, SalesOrderFactory, CONFIGURATION, ComponentFactory, $filter) {
        const directive = {
            restrict: 'E',
            replace: false,
            scope: {

            },
            templateUrl: 'app/directives/custom/supplier-rma-grid/supplier-rma-grid.html',
            controller: supplierRmaGridCtrl,
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

        function supplierRmaGridCtrl($scope) {
            const vm = this;
            vm.isNotApplicable = vm.isReadyToLock = vm.isUpdatable = vm.isCheckDRA = vm.isCheckWS = vm.isCheckWC = vm.isAddInvoice = vm.isPrinted = vm.isDownload = vm.customerpackingsliphistory = vm.isViewLock = true;
            vm.isDraft = vm.isPublished = vm.isShipped = vm.isLocked = vm.isCheckCR = vm.isCheckATP = vm.isCheckPartiallyPaid = vm.isCheckPaid = false;
            vm.transaction = TRANSACTION;
            vm.DefaultDateTimeFormat = _dateTimeDisplayFormat;
            vm.DefaultDateFormat = _dateDisplayFormat;
            vm.loginUser = BaseService.loginUser;
            vm.LabelConstant = CORE.LabelConstant;
            vm.SupplierRMAAdvanceFilters = angular.copy(CORE.SupplierRMAAdvanceFilters);
            vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
            vm.SupplierRMAModeStatusOptionsGridHeaderDropdown = CORE.SupplierRMAModeStatusOptionsGridHeaderDropdown;
            vm.SupplierRMAModeStatus = CORE.SupplierRMAModeStatus;
            vm.EmptyMesssage = {
                MESSAGE: angular.copy(USER.ADMIN_EMPTYSTATE.SUPPLIER_RMA.MESSAGE),
                IMAGEURL: angular.copy(USER.ADMIN_EMPTYSTATE.SUPPLIER_RMA.IMAGEURL),
                ADDNEWMESSAGE: stringFormat(USER.ADMIN_EMPTYSTATE.SUPPLIER_RMA.ADDNEWMESSAGE)
            };
            vm.currentPage = $state.current.name;
            vm.gridConfig = CORE.gridConfig;
            vm.ShippingInsuranceDropDown = CORE.ShippingInsuranceDropDown;
            vm.CustomSearchTypeForList = CORE.CustomSearchTypeForList;
            vm.statusTypeList = CORE.SupplierRMAStatus;
            vm.addInvoiceActionButtonName = 'Add RMA Credit Memo';
            vm.historyactionButtonName = 'Supplier RMA Change History';
            vm.transTypeText = 'Supplier RMA';
            vm.selectedRowsList = [];

            const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;

            const initPageInfo = () => {
                vm.pagingInfo = {
                    Page: CORE.UIGrid.Page(),
                    SortColumns: [['shippedDate', 'DESC']],
                    SearchColumns: [],
                    searchType: vm.CustomSearchTypeForList.Exact
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
                exporterCsvFilename: 'SupplierRMA.csv',
                exporterAllDataFn: () => {
                    const pagingInfoOld = _.clone(vm.pagingInfo);
                    pagingInfoOld.pageSize = 0;
                    pagingInfoOld.Page = 1;
                    vm.gridOptions.isExport = pagingInfoOld.isExport = true;
                    return SupplierRMAFactory.getSupplierRMAList().query(pagingInfoOld).$promise.then((response) => {
                        if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                            setDataAfterGetAPICall(response, false);
                            return response.data.supplierRMA;
                        }
                    }).catch((error) => BaseService.getErrorLog(error));
                }
            };

            const initHeaderDetails = () => {
                vm.sourceHeader = [
                    {
                        field: 'Action',
                        displayName: 'Action',
                        width: '200',
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
                        enableSorting: false
                    },
                    {
                        field: 'systemId',
                        displayName: vm.LabelConstant.COMMON.SystemID,
                        width: 145,
                        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
                        enableFiltering: true,
                        enableSorting: true
                    },
                    {
                        field: 'rmaModeStatusValue',
                        displayName: vm.LabelConstant.SupplierRMA.RMAPostingStatus,
                        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
                            + '<span class="label-box" \
                              ng-class="{\'label-warning\':row.entity.rmaModeStatus == \'D\' ,\
                                        \'label-primary\':row.entity.rmaModeStatus == \'P\' ,\
                                        \'label-success\':row.entity.rmaModeStatus == \'S\'}"> \
                            {{COL_FIELD}}'
                            + '</span>'
                            + '</div>',
                        width: 175,
                        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
                        filter: {
                            term: null,
                            options: vm.SupplierRMAModeStatusOptionsGridHeaderDropdown
                        },
                        ColumnDataType: 'StringEquals',
                        enableFiltering: true,
                        enableSorting: true
                    },
                    {
                        field: 'statusValue',
                        displayName: vm.LabelConstant.SupplierRMA.RMAStatus,
                        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
                            + '<span class="label-box" \
                              ng-class="{\'label-danger\':row.entity.status === \'D\' ,\
                                        \'label-warning\':row.entity.status === \'WS\' ,\
                                        \'label-info\':row.entity.status === \'WC\' ,\
                                        \'light-pink-bg\':row.entity.status === \'CR\' ,\
                                        \'label-success\':row.entity.status === \'A\' ,\
                                        \'bg-purple\':row.entity.status === \'PP\' ,\
                                        \'label-primary\':row.entity.status === \'P\'}"> \
                            {{COL_FIELD}}'
                            + '</span>'
                            + '</div>',
                        width: 185,
                        ColumnDataType: 'StringEquals',
                        enableFiltering: false,
                        enableSorting: true
                    },
                    {
                        field: 'lockStatusValue',
                        displayName: 'Lock Status',
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
                            options: TRANSACTION.SupplierRMALockStatusGridHeaderDropdown
                        }
                    },
                    {
                        field: 'supplierCodeName',
                        width: '200',
                        displayName: vm.LabelConstant.SupplierRMA.Supplier,
                        cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                              <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToSupplier(row.entity.mfgCodeID);" tabindex="-1">{{COL_FIELD}}</a>\
                              <copy-text label="grid.appScope.$parent.vm.LabelConstant.MFG.Supplier" text="row.entity.supplierCodeName"></copy-text>\
                           </div>'
                    },
                    {
                        field: 'rmaNumber',
                        width: '180',
                        displayName: vm.LabelConstant.SupplierRMA.RMANumber,
                        cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                              <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToSupplierRMADetail(row.entity.id, grid.appScope.$parent.vm.transaction.SupplierRMATab.SupplierRMA);" tabindex="-1">{{COL_FIELD}}</a>\
                              <copy-text label="grid.appScope.$parent.vm.LabelConstant.SupplierRMA.RMANumber" text="row.entity.rmaNumber"></copy-text>\
                              <md-icon md-font-icon="" class= "material-icons mat-icon icon-lock" ng-if="row.entity.lockStatus === grid.appScope.$parent.vm.transaction.CustomerPaymentLockStatus.Locked" style="margin-left:5px !important;"> </md-icon>\
                          </div>'
                    },
                    {
                        field: 'rmaDate',
                        displayName: vm.LabelConstant.SupplierRMA.RMADate,
                        width: CORE.UI_GRID_COLUMN_WIDTH.ONLY_DATE_COLUMN,
                        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
                        type: 'date'
                    },
                    {
                        field: 'packingSlipNumber',
                        width: '180',
                        displayName: vm.LabelConstant.SupplierRMA.PackingSlipNumber,
                        cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                              <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToSupplierRMADetail(row.entity.id, grid.appScope.$parent.vm.transaction.SupplierRMATab.SupplierRMA);" tabindex="-1">{{COL_FIELD}}</a>\
                              <copy-text label="grid.appScope.$parent.vm.LabelConstant.SupplierRMA.PackingSlipNumber" text="row.entity.packingSlipNumber"></copy-text>\
                              <md-icon md-font-icon="" class= "material-icons mat-icon icon-lock" ng-if="row.entity.lockStatus === grid.appScope.$parent.vm.transaction.CustomerPaymentLockStatus.Locked" style="margin-left:5px !important;"> </md-icon>\
                          </div>'
                    },
                    {
                        field: 'packingSlipDate',
                        displayName: vm.LabelConstant.SupplierRMA.PackingSlipDate,
                        width: CORE.UI_GRID_COLUMN_WIDTH.ONLY_DATE_COLUMN,
                        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
                        type: 'date'
                    },
                    {
                        field: 'shippedDate',
                        displayName: vm.LabelConstant.SupplierRMA.ShippedDate,
                        width: CORE.UI_GRID_COLUMN_WIDTH.ONLY_DATE_COLUMN,
                        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
                        type: 'date'
                    },
                    {
                        field: 'rmaDocCount',
                        width: '120',
                        displayName: vm.LabelConstant.SupplierRMA.RMADocuments,
                        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">\
                          <a class="cursor-pointer underline" ng-class="{\'grid-cell-text-danger\': !COL_FIELD, \'cm-text-decoration\': COL_FIELD}" ng-click="grid.appScope.$parent.vm.goToSupplierRMADetail(row.entity.id, grid.appScope.$parent.vm.transaction.SupplierRMATab.Documents);" tabindex="-1">{{COL_FIELD | numberWithoutDecimal }}</a> \
                        </div>'
                    },
                    {
                        field: 'itemReturn',
                        width: '120',
                        displayName: vm.LabelConstant.SupplierRMA.ItemsReturn,
                        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal }}</div>'
                    },
                    {
                        field: 'refCreditMemoNumber',
                        width: 180,
                        displayName: vm.LabelConstant.SupplierRMA.RefCreditMemoNumber,
                        cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                              <a class="cm-text-decoration underline" ng-if="row.entity.refCreditMemoNumber" ng-click="grid.appScope.$parent.vm.goToCreditMemoDetail(row.entity.refCreditMemoId);" tabindex="-1">{{COL_FIELD}}</a>\
                              <copy-text label="grid.appScope.$parent.vm.LabelConstant.SupplierRMA.RefCreditMemoNumber" text="row.entity.refCreditMemoNumber" ng-if="row.entity.refCreditMemoNumber"></copy-text>\
                              <md-icon md-font-icon="" class= "material-icons mat-icon icon-lock" ng-if="row.entity.refCreditMemoLockStatus === grid.appScope.$parent.vm.transaction.CustomerPaymentLockStatus.Locked" style="margin-left:5px !important;"> </md-icon>\
                           </div>'
                    },
                    {
                        field: 'refCreditMemoDate',
                        displayName: vm.LabelConstant.SupplierRMA.RefCreditMemoDate,
                        width: CORE.UI_GRID_COLUMN_WIDTH.ONLY_DATE_COLUMN,
                        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
                        type: 'date'
                    },
                    {
                        field: 'remark',
                        displayName: vm.LabelConstant.SupplierRMA.RMARemark,
                        cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.remark" ng-click="grid.appScope.$parent.vm.showRemark(row.entity, $event, \'RMAComment\')"> \
                                        View \
                                    </md-button>',
                        enableFiltering: false,
                        enableSorting: false,
                        width: '100',
                        enableCellEdit: false
                    },
                    {
                        field: 'internalRemark',
                        displayName: vm.LabelConstant.SupplierRMA.InternalRMARemark,
                        cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.internalRemark" ng-click="grid.appScope.$parent.vm.showRemark(row.entity, $event, \'InternalRMAComment\')"> \
                                        View \
                                    </md-button>',
                        enableFiltering: false,
                        enableSorting: false,
                        width: '100',
                        enableCellEdit: false
                    },
                    {
                        field: 'shippingMethod',
                        displayName: vm.LabelConstant.SupplierRMA.ShippingMethod,
                        width: '140',
                        cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                              <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToManageGenericCategoryShippingType(row.entity.shippingMethodId);" tabindex="-1">{{COL_FIELD}}</a>\
                              <copy-text label="grid.appScope.$parent.vm.LabelConstant.SupplierRMA.ShippingMethod" text="row.entity.shippingMethod" ng-if="row.entity.shippingMethod"></copy-text>\
                           </div>'
                    },
                    {
                        field: 'carrier',
                        displayName: vm.LabelConstant.SupplierRMA.Carrier,
                        width: '140',
                        cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                              <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToManageGenericCategoryCarrier(row.entity.carrierId);" tabindex="-1">{{COL_FIELD}}</a>\
                              <copy-text label="grid.appScope.$parent.vm.LabelConstant.SupplierRMA.Carrier" text="row.entity.carrier" ng-if="row.entity.carrier"></copy-text>\
                           </div>'
                    },
                    {
                        field: 'carrierAccountNumber',
                        displayName: vm.LabelConstant.SupplierRMA.CarrierAccount,
                        width: '140',
                        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>'
                    },
                    {
                        field: 'shippingInsuranceValue',
                        displayName: vm.LabelConstant.SupplierRMA.ShippingInsurance,
                        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
                            + '<span class="label-box" \
                                ng-class="{\'label-success\':row.entity.shippingInsuranceValue === \'Yes\',\
                                           \'label-warning\':row.entity.shippingInsuranceValue === \'No\' }"> \
                                          {{COL_FIELD}}'
                            + '</span>'
                            + '</div>',
                        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
                        filter: {
                            term: null,
                            options: vm.ShippingInsuranceDropDown
                        },
                        ColumnDataType: 'StringEquals',
                        enableFiltering: true,
                        enableSorting: false,
                        width: '100'
                    },
                    {
                        field: 'lockedAt',
                        displayName: 'Locked Date',
                        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
                        type: 'datetime',
                        enableFiltering: false,
                        visible: CORE.UIGrid.VISIBLE_LOCKED_AT
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
                        enableFiltering: true,
                        visible: CORE.UIGrid.VISIBLE_LOCKED_BYROLE
                    },
                    {
                        field: 'updatedAt',
                        displayName: 'Modified Date',
                        width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
                        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                        type: 'datetime',
                        visible: CORE.UIGrid.VISIBLE_MODIFIED_AT
                    },
                    {
                        field: 'updatedByName',
                        displayName: 'Modified By',
                        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
                        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                        enableFiltering: true,
                        enableSorting: true,
                        visible: CORE.UIGrid.VISIBLE_MODIFIED_AT
                    },
                    {
                        field: 'updatedbyRole',
                        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
                        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
                        type: 'StringEquals',
                        enableFiltering: true,
                        visible: CORE.UIGrid.VISIBLE_MODIFIED_BYROLE
                    },
                    {
                        field: 'createdAt',
                        displayName: 'Created Date',
                        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
                        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateTimeFormat}}</div>',
                        enableFiltering: false,
                        enableSorting: true,
                        type: 'datetime',
                        visible: CORE.UIGrid.VISIBLE_CREATED_AT
                    },
                    {
                        field: 'createdByName',
                        displayName: 'Created By',
                        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
                        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                        enableFiltering: true,
                        enableSorting: true,
                        visible: CORE.UIGrid.VISIBLE_CREATED_BY
                    },
                    {
                        field: 'createdbyRole',
                        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
                        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
                        type: 'StringEquals',
                        enableFiltering: true,
                        visible: CORE.UIGrid.VISIBLE_CREATED_BYROLE
                    }
                ];
            };
            initHeaderDetails();

            let reTryCount = 0;
            const getAllRights = () => {
                vm.allowToLockSupplierRMAFeature = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToLockSupplierRMA);
                if ((vm.allowToLockSupplierRMAFeature === null || vm.allowToLockSupplierRMAFeature === undefined)
                    && reTryCount < _configGetFeaturesRetryCount) {
                    reTryCount++;
                    getAllRights(); //put for hard reload option as it will not get data from feature rights
                }
            };

            $timeout(() => {
                getAllRights();
            });

            //set Filter Labels
            function setFilteredLabels() {
                vm.SupplierRMAAdvanceFilters.Supplier.isDeleted = !(vm.mfgCodeDetailModel && vm.mfgCodeDetailModel.length > 0);
                vm.SupplierRMAAdvanceFilters.SupplierRMAStatus.isDeleted = !(vm.isCheckDRA || vm.isCheckWS || vm.isCheckWC || vm.isCheckCR || vm.isCheckATP || vm.isCheckPartiallyPaid || vm.isCheckPaid);
                vm.SupplierRMAAdvanceFilters.Search_RMA_Packingslip_CreditMemoNo.isDeleted = !(vm.advanceSearchNumbers);
                vm.SupplierRMAAdvanceFilters.MFRPN.isDeleted = !(vm.filterMFRPNText);
                vm.SupplierRMAAdvanceFilters.RMADate.isDeleted = !(vm.rmaFromDate || vm.rmaToDate);
                vm.SupplierRMAAdvanceFilters.LockStatus.isDeleted = !(vm.isNotApplicable || vm.isReadyToLock || vm.isLocked);
                vm.SupplierRMAAdvanceFilters.SearchComments.isDeleted = !(vm.rmaComments);
                vm.SupplierRMAAdvanceFilters.PostingStatus.isDeleted = !(vm.isDraft || vm.isPublished || vm.isShipped);

                //==>>>Set filter tool-tip
                vm.SupplierRMAAdvanceFilters.Supplier.tooltip = getFilterTooltip(vm.mfgCodeListToDisplay, vm.mfgCodeDetailModel, 'id', 'mfgCodeName');
                if (vm.advanceSearchNumbers) {
                    vm.SupplierRMAAdvanceFilters.Search_RMA_Packingslip_CreditMemoNo.tooltip = vm.advanceSearchNumbers;
                }
                if (vm.filterMFRPNText) {
                    vm.SupplierRMAAdvanceFilters.MFRPN.tooltip = vm.filterMFRPNText;
                }

                vm.SupplierRMAAdvanceFilters.SearchComments.tooltip = vm.rmaComments || null;
                vm.pagingInfo.rmaComments = BaseService.convertSpecialCharToSearchString(vm.rmaComments);

                if (vm.rmaFromDate && vm.rmaToDate) {
                    vm.SupplierRMAAdvanceFilters.RMADate.tooltip = 'From: ' + $filter('date')(new Date(vm.rmaFromDate), vm.DefaultDateFormat) + ' To:' + $filter('date')(new Date(vm.rmaToDate), vm.DefaultDateFormat);
                }
                else if (vm.rmaFromDate) {
                    vm.SupplierRMAAdvanceFilters.RMADate.tooltip = $filter('date')(new Date(vm.rmaFromDate), vm.DefaultDateFormat);
                }

                if (vm.isReadyToLock && vm.isNotApplicable && vm.isLocked) {
                    vm.pagingInfo.lockStatusFilter = null;
                    vm.SupplierRMAAdvanceFilters.LockStatus.tooltip = 'All';
                } else if (!vm.isReadyToLock && !vm.isNotApplicable && !vm.isLocked) {
                    vm.SupplierRMAAdvanceFilters.LockStatus.tooltip = vm.pagingInfo.lockStatusFilter = null;
                } else {
                    const searchLockStatus = [];
                    const searchLockStatusTooltip = [];
                    if (vm.isNotApplicable) {
                        searchLockStatus.push(vm.transaction.SupplierRMALockStatus.NA.id);
                        searchLockStatusTooltip.push(vm.transaction.SupplierRMALockStatus.NA.value);
                    }
                    if (vm.isReadyToLock) {
                        searchLockStatus.push(vm.transaction.SupplierRMALockStatus.ReadyToLock.id);
                        searchLockStatusTooltip.push(vm.transaction.SupplierRMALockStatus.ReadyToLock.value);
                    }
                    if (vm.isLocked) {
                        searchLockStatus.push(vm.transaction.SupplierRMALockStatus.Locked.id);
                        searchLockStatusTooltip.push(vm.transaction.SupplierRMALockStatus.Locked.value);
                    }
                    vm.pagingInfo.lockStatusFilter = `'${searchLockStatus.join('\',\'')}'`;
                    vm.SupplierRMAAdvanceFilters.LockStatus.tooltip = `${searchLockStatusTooltip.join('<br />')}`;
                }

                if (vm.isDraft && vm.isPublished && vm.isShipped) {
                    vm.pagingInfo.postingStatus = null;
                    vm.SupplierRMAAdvanceFilters.PostingStatus.tooltip = 'All';
                } else if (!vm.isDraft && !vm.isPublished && !vm.isShipped) {
                    vm.SupplierRMAAdvanceFilters.PostingStatus.tooltip = vm.pagingInfo.postingStatus = null;
                } else {
                    vm.pagingInfo.postingStatus = [];
                    const postingStatusTooltip = [];
                    if (vm.isDraft) {
                        vm.pagingInfo.postingStatus.push(vm.SupplierRMAModeStatus[0].ID);
                        postingStatusTooltip.push(vm.SupplierRMAModeStatus[0].Name);
                    }
                    if (vm.isPublished) {
                        vm.pagingInfo.postingStatus.push(vm.SupplierRMAModeStatus[1].ID);
                        postingStatusTooltip.push(vm.SupplierRMAModeStatus[1].Name);
                    }
                    if (vm.isShipped) {
                        vm.pagingInfo.postingStatus.push(vm.SupplierRMAModeStatus[2].ID);
                        postingStatusTooltip.push(vm.SupplierRMAModeStatus[2].Name);
                    }
                    vm.pagingInfo.postingStatus = `'${vm.pagingInfo.postingStatus.join('\',\'')}'`;
                    vm.SupplierRMAAdvanceFilters.PostingStatus.tooltip = `${postingStatusTooltip.join('<br />')}`;
                }

                if (vm.isCheckDRA && vm.isCheckWS && vm.isCheckWC && vm.isCheckCR && vm.isCheckATP && vm.isCheckPartiallyPaid && vm.isCheckPaid) {
                    vm.pagingInfo.whereStatus = vm.pagingInfo.SearchColumnName = null;
                    vm.SupplierRMAAdvanceFilters.SupplierRMAStatus.tooltip = 'All';
                } else if (!vm.isCheckDRA && !vm.isCheckWS && !vm.isCheckWC && !vm.isCheckCR && !vm.isCheckATP && !vm.isCheckPartiallyPaid && !vm.isCheckPaid) {
                    vm.SupplierRMAAdvanceFilters.SupplierRMAStatus.tooltip = vm.pagingInfo.whereStatus = vm.pagingInfo.SearchColumnName = null;
                }
                else {
                    const searchCol = [];
                    const RMAStausTooltip = [];
                    if (vm.isCheckDRA) {
                        searchCol.push(vm.statusTypeList[1].code);
                        RMAStausTooltip.push(vm.statusTypeList[1].value);
                    }
                    if (vm.isCheckWS) {
                        searchCol.push(vm.statusTypeList[2].code);
                        RMAStausTooltip.push(vm.statusTypeList[2].value);
                    }
                    if (vm.isCheckWC) {
                        searchCol.push(vm.statusTypeList[3].code);
                        RMAStausTooltip.push(vm.statusTypeList[3].value);
                    }
                    if (vm.isCheckCR) {
                        searchCol.push(vm.statusTypeList[4].code);
                        RMAStausTooltip.push(vm.statusTypeList[4].value);
                    }
                    if (vm.isCheckATP) {
                        searchCol.push(vm.statusTypeList[5].code);
                        RMAStausTooltip.push(vm.statusTypeList[5].value);
                    }
                    if (vm.isCheckPartiallyPaid) {
                        searchCol.push(vm.statusTypeList[7].code);
                        RMAStausTooltip.push(vm.statusTypeList[7].value);
                    }
                    if (vm.isCheckPaid) {
                        searchCol.push(vm.statusTypeList[6].code);
                        RMAStausTooltip.push(vm.statusTypeList[6].value);
                    }
                    vm.pagingInfo.whereStatus = searchCol;
                    vm.pagingInfo.SearchColumnName = TRANSACTION.PackingSlipColumn.Status;
                    vm.SupplierRMAAdvanceFilters.SupplierRMAStatus.tooltip = `${RMAStausTooltip.join('<br />')}`;
                }
                //<<<==Set filter tool-tip

                if (vm.gridOptions && vm.gridOptions.gridApi) {
                    vm.isUiGridColumnFiltersApplied = _.some(vm.gridOptions.gridApi.grid.columns, (col) => !_.isEmpty(col.filters[0].term));
                }

                vm.numberOfMasterFiltersApplied = _.filter(vm.SupplierRMAAdvanceFilters, (num) => num.isDeleted === false).length;
            }

            vm.removeAppliedFilter = (item) => {
                if (item) {
                    item.isDeleted = true;
                    switch (item.value) {
                        case vm.SupplierRMAAdvanceFilters.Supplier.value:
                            vm.mfgCodeDetailModel = [];
                            break;
                        case vm.SupplierRMAAdvanceFilters.SupplierRMAStatus.value:
                            vm.isCheckDRA = vm.isCheckWS = vm.isCheckWC = vm.isCheckCR = vm.isCheckATP = vm.isCheckPartiallyPaid = vm.isCheckPaid = false;
                            break;
                        case vm.SupplierRMAAdvanceFilters.Search_RMA_Packingslip_CreditMemoNo.value:
                            vm.advanceSearchNumbers = null;
                            break;
                        case vm.SupplierRMAAdvanceFilters.MFRPN.value:
                            clearMFRPN();
                            break;
                        case vm.SupplierRMAAdvanceFilters.RMADate.value:
                            vm.rmaFromDate = vm.rmaToDate = null;
                            vm.resetDateFilter();
                            break;
                        case vm.SupplierRMAAdvanceFilters.LockStatus.value:
                            vm.isNotApplicable = vm.isReadyToLock = vm.isLocked = false;
                            break;
                        case vm.SupplierRMAAdvanceFilters.SearchComments.value:
                            vm.rmaComments = null;
                            break;
                        case vm.SupplierRMAAdvanceFilters.PostingStatus.value:
                            vm.isDraft = vm.isPublished = vm.isShipped = false;
                            break;
                    }
                    vm.loadData();
                }
            };

            vm.removeCommentFilter = () => {
                vm.rmaComments = null;
                vm.loadData();
            };

            vm.removeSearchFilter = () => {
                vm.advanceSearchNumbers = null;
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

            const setDataAfterGetAPICall = (supplierRMA, isGetDataDown) => {
                if (supplierRMA && supplierRMA.data.supplierRMA) {
                    if (!isGetDataDown) {
                        vm.sourceData = supplierRMA.data.supplierRMA;
                        vm.currentdata = vm.sourceData.length;
                    }
                    else if (supplierRMA.data.supplierRMA.length > 0) {
                        vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(supplierRMA.data.supplierRMA);
                        vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
                    }

                    if (vm.sourceData && vm.sourceData.length > 0) {
                        _.map(vm.sourceData, (data) => {
                            data.packingSlipDate = BaseService.getUIFormatedDate(data.packingSlipDate, vm.DefaultDateFormat);
                            data.rmaDate = BaseService.getUIFormatedDate(data.packingSlipDate, vm.DefaultDateFormat);
                            data.receiptDate = data.receiptDate ? BaseService.getUIFormatedDate(data.receiptDate, vm.DefaultDateFormat) : null;
                            data.shippedDate = BaseService.getUIFormatedDate(data.shippedDate, vm.DefaultDateFormat);
                            data.refCreditMemoDate = data.refCreditMemoDate ? BaseService.getUIFormatedDate(data.refCreditMemoDate, vm.DefaultDateFormat) : null;
                            data.isPrintDisable = false;
                            data.isDownloadDisabled = false;

                            if (data.status === CORE.SupplierRMAStatusCode.WaitingForCreditMemo) {
                                data.isDisabledAddInvoice = false;
                            } else {
                                data.isDisabledAddInvoice = true;
                            }
                            if (!vm.allowToLockSupplierRMAFeature) {
                                data.isDisableLockTransaction = true;
                            }
                            if (data.lockStatus === TRANSACTION.CustomerPaymentLockStatus.Locked) {
                                data.isDisableLockTransaction = true;
                                if (!vm.loginUser.isUserSuperAdmin) {
                                    data.isDisabledDelete = true;
                                }
                            }
                        });
                    }
                    // must set after new data comes
                    vm.totalSourceDataCount = supplierRMA.data.Count;
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
                        if (vm.pagingInfo.SearchColumns.length > 0 || vm.isCheckDRA || vm.isCheckWS || vm.isCheckWC || vm.isCheckCR || vm.isCheckATP || vm.isCheckPartiallyPaid || vm.isCheckPaid || vm.rmaComments || vm.isDraft || vm.isPublished || vm.isShipped ||
                            vm.pagingInfo.mfgCodeIds || vm.pagingInfo.advanceSearchNumbers || vm.pagingInfo.mfrPnId || vm.pagingInfo.rmaFromDate || vm.pagingInfo.rmaToDate || vm.isNotApplicable || vm.isReadyToLock || vm.isLocked) {
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

            vm.loadData = () => {

                if (vm.mfgCodeDetailModel && vm.mfgCodeDetailModel.length > 0) {
                    vm.pagingInfo.mfgCodeIds = vm.mfgCodeDetailModel.join(',');
                }
                else {
                    vm.pagingInfo.mfgCodeIds = null;
                }

                vm.pagingInfo.advanceSearchNumbers = BaseService.convertSpecialCharToSearchString(vm.advanceSearchNumbers);

                if (vm.rmaFromDate) {
                    vm.pagingInfo.rmaFromDate = (BaseService.getAPIFormatedDate(vm.rmaFromDate));
                }
                else {
                    vm.pagingInfo.rmaFromDate = null;
                }
                if (vm.rmaToDate) {
                    vm.pagingInfo.rmaToDate = (BaseService.getAPIFormatedDate(vm.rmaToDate));
                }
                else {
                    vm.pagingInfo.rmaToDate = null;
                }

                if (vm.pagingInfo.SortColumns.length === 0) {
                    vm.pagingInfo.SortColumns = [['shippedDate', 'DESC']];
                }
                BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
                setFilteredLabels();
                vm.cgBusyLoading = SupplierRMAFactory.getSupplierRMAList().query(vm.pagingInfo).$promise.then((response) => {
                    if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                        setDataAfterGetAPICall(response, false);
                    }
                }).catch((error) => BaseService.getErrorLog(error));
            };

            vm.getDataDown = () => {
                vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
                vm.cgBusyLoading = SupplierRMAFactory.getSupplierRMAList().query(vm.pagingInfo).$promise.then((response) => {
                    setDataAfterGetAPICall(response, true);
                }).catch((error) => BaseService.getErrorLog(error));
            };

            vm.addSupplierRMA = () => {
                $state.go(TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_RMA_STATE, { type: TRANSACTION.SupplierRMATab.SupplierRMA, id: null });
            };

            vm.updateRecord = (row) => {
                if (row && row.entity) {
                    //$state.go(TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_RMA_STATE, { type: TRANSACTION.SupplierRMATab.SupplierRMA, id: row.entity.id });
                    BaseService.goToManageSupplierRMA(TRANSACTION.SupplierRMATab.SupplierRMA, row.entity.id);
                }
            };

            vm.deleteRecord = (row) => {
                let selectedIDs = [];
                if (row) {
                    if (row.lockStatus === TRANSACTION.CustomerPaymentLockStatus.Locked && !vm.loginUser.isUserSuperAdmin) {
                        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SUPPLIER_TRANSACTION_DELETE_VALIDATION_FOR_LOCKED_HALT_TRANSACTIONS);
                        messageContent.message = stringFormat(messageContent.message, 'Locked');
                        const model = {
                            messageContent: messageContent
                        };
                        DialogFactory.messageAlertDialog(model);
                        return;
                    }
                    selectedIDs.push(row.id);
                } else {
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
                    vm.selectedRows = vm.selectedRowsList;
                    if (vm.selectedRows.length > 0) {
                        selectedIDs = vm.selectedRows.map((item) => item.id);
                    }
                }

                if (selectedIDs && selectedIDs.length) {
                    vm.cgBusyLoading = PackingSlipFactory.checkRelationOfStockAndRMA().query({ rmaId: selectedIDs }).$promise.then((responseStock) => {
                        if (responseStock && responseStock.data && responseStock.data.length > 0) {
                            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.CHECK_RMA_STOCK_RELATION_MESSAGE_RMA_GRID);
                            const model = {
                                messageContent: messageContent,
                                multiple: true
                            };
                            DialogFactory.messageAlertDialog(model).then((yes) => {
                                if (yes) {
                                    if (selectedIDs.length === 1) {
                                        vm.goToSupplierRMADetail(parseInt(selectedIDs[0]), vm.transaction.SupplierRMATab.SupplierRMA);
                                    }
                                }
                            }).catch((error) => BaseService.getErrorLog(error));
                        } else {
                            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
                            messageContent.message = stringFormat(messageContent.message, 'Supplier RMA', selectedIDs.length);
                            const obj = {
                                messageContent: messageContent,
                                btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                            };
                            const objIDs = {
                                id: selectedIDs,
                                CountList: false,
                                isSupplierRMA: true
                            };
                            DialogFactory.messageConfirmDialog(obj).then((yes) => {
                                if (yes) {
                                    vm.cgBusyLoading = PackingSlipFactory.deletePackingSlip().query({ objIDs: objIDs }).$promise.then((res) => {
                                        if (res && res.data && (res.data.length > 0 || res.data.transactionDetails)) {
                                            const data = {
                                                TotalCount: res.data.transactionDetails[0].TotalCount,
                                                pageName: CORE.PageName.SupplierRMA
                                            };
                                            BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                                                const objIDs = {
                                                    id: selectedIDs,
                                                    CountList: true,
                                                    isSupplierRMA: true
                                                };
                                                return PackingSlipFactory.deletePackingSlip().query({ objIDs: objIDs }).$promise.then((res) => {
                                                    let data = {};
                                                    data = res.data;
                                                    data.pageTitle = row ? row.rmaNumber : null;
                                                    data.PageName = CORE.PageName.SupplierRMA;
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
                    }).catch((error) => BaseService.getErrorLog(error));
                } else {
                    const alertModel = {
                        title: USER.USER_ERROR_LABEL,
                        textContent: stringFormat(USER.SELECT_ONE_LABEL, 'Supplier RMA')
                    };
                    DialogFactory.alertDialog(alertModel);
                }
            };

            vm.deleteMultipleData = () => {
                vm.deleteRecord();
            };

            vm.lockRecord = (row, event) => {
                var selectedIds = [];
                if (!vm.allowToLockSupplierRMAFeature) {
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
                            receiptType: (row && row.entity) ? row.entity.receiptType : vm.selectedRowsList[0].receiptType,
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

            vm.addInvoiceInPackingSlip = (row) => {
                if (row.entity) {
                    $state.go(TRANSACTION.TRANSACTION_MANAGE_CREDIT_INVOICE_STATE, {
                        type: TRANSACTION.SupplierInvoiceType.Detail,
                        id: null,
                        slipType: CORE.PackingSlipInvoiceTabName,
                        packingSlipNumber: row.entity.packingSlipNumber
                    });
                }
            };

            const getDataKey = () => SalesOrderFactory.getDataKey().query().$promise.then((dataKey) => {
                if (dataKey) {
                    vm.dataKey = dataKey.data;
                }
            }).catch((error) => BaseService.getErrorLog(error));

            vm.printRecord = (data, isDownload) => {
                if (isDownload) {
                    data.entity.isDownloadDisabled = true;
                } else {
                    data.entity.isPrintDisable = true;
                }
                getDataKey();
                let dataKeyvalue;
                _.each(vm.dataKey, (item) => {
                    if (item.key === CONFIGURATION.SETTING.TermsAndCondition) {
                        return dataKeyvalue = item.values;
                    }
                });
                const supplierRMAReportDetails = {
                    id: data.entity.id,
                    termsAndCondition: dataKeyvalue,
                    RMAData: {
                        rmaNumber: data.entity.rmaNumber,
                        supplierCode: data.entity.supplierCode
                    }
                };
                SupplierRMAFactory.getSupplierRMAReport(supplierRMAReportDetails).then((response) => {
                    const RMAData = response.config.data.RMAData;
                    if (isDownload) {
                        data.entity.isDownloadDisabled = false;
                    } else {
                        data.entity.isPrintDisable = false;
                    }
                    BaseService.downloadReport(response, stringFormat('{0}-{1}-{2}', CORE.REPORT_SUFFIX.SUPPLIER_RMA_MEMO, RMAData.rmaNumber, RMAData.supplierCode), isDownload, true);
                }).catch((error) => BaseService.getErrorLog(error));
            };

            vm.getMfgSearch = () => {
                vm.mfrSearchText = undefined;
                const searchObj = {
                    mfgType: CORE.MFG_TYPE.DIST,
                    isCodeFirst: true
                };

                vm.cgBusyLoading = ManufacturerFactory.getAllManufacturerWithFormattedCodeList(searchObj).query().$promise.then((mfgcodes) => {
                    vm.mfgCodeDetail = vm.mfgCodeListToDisplay = [];
                    if (mfgcodes && mfgcodes.data) {
                        vm.mfgCodeDetail = mfgcodes.data;
                        vm.mfgCodeListToDisplay = angular.copy(vm.mfgCodeDetail);
                    }
                    return vm.mfgCodeDetail;
                }).catch((error) => BaseService.getErrorLog(error));
            };

            vm.getMfgSearch();

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
                vm.isNotApplicable = vm.isReadyToLock = vm.isCheckWC = vm.isCheckWS = vm.isCheckDRA = isReset ? true : false;
                vm.isDraft = vm.isPublished = vm.isShipped = vm.isLocked = vm.isCheckCR = false;
                vm.isCheckATP = false;
                vm.isCheckPartiallyPaid = vm.isCheckPaid = false;
                vm.mfrSearchText = undefined;
                vm.clearMfrSearchText();
                vm.mfgCodeDetailModel = [];
                vm.rmaComments = vm.advanceSearchNumbers = null;
                vm.rmaFromDate = vm.rmaToDate = null;
                vm.resetDateFilter();
                vm.pagingInfo.searchType = vm.CustomSearchTypeForList.Exact;
                clearMFRPN();
                vm.loadData();
            };

            function clearMFRPN() {
                vm.filterMFRPNText = null;
                vm.pagingInfo.mfrPnId = null;
                $scope.$broadcast(vm.autoCompletecomponent.inputName, null);
            }

            vm.showRemark = (row, event, field) => {
                const obj = {
                    name: row.rmaNumber
                };

                if (field === 'RMAComment') {
                    obj.title = 'RMA Comment';
                    obj.description = row.remark;
                } else if (field === 'InternalRMAComment') {
                    obj.title = 'Internal RMA Comment';
                    obj.description = row.internalRemark;
                }

                const data = obj;
                data.label = 'RMA#';
                DialogFactory.dialogService(
                    CORE.DESCRIPTION_MODAL_CONTROLLER,
                    CORE.DESCRIPTION_MODAL_VIEW,
                    event,
                    data).then(() => {
                    }, (err) => BaseService.getErrorLog(err));
            };

            vm.opencustomerpackingSlipChangesHistoryAuditLog = (row, ev) => {
                const data = row.entity;
                DialogFactory.dialogService(
                    TRANSACTION.TRANSACTION_PACKING_SLIP_CHANGE_HISTORY_CONTROLLER,
                    TRANSACTION.TRANSACTION_PACKING_SLIP_CHANGE_HISTORY_VIEW,
                    ev,
                    data).then(() => { }, () => { }, (error) => BaseService.getErrorLog(error));
            };

            vm.goToSupplier = (supplierId) => {
                if (supplierId) {
                    BaseService.goToSupplierDetail(supplierId);
                }
            };

            vm.goToSupplierRMADetail = (id, type) => {
                if (id) {
                    BaseService.goToManageSupplierRMA(type, id);
                }
            };

            vm.goToCreditMemoDetail = (id) => {
                BaseService.goToCreditMemoDetail(null, id);
            };

            vm.goToSupplierList = () => {
                BaseService.goToSupplierList();
            };

            vm.goToManageGenericCategoryCarrier = (id) => {
                if (id) {
                    BaseService.goToManageGenericCategoryCarrier(id);
                }
            };

            vm.goToManageGenericCategoryShippingType = (id) => {
                if (id) {
                    BaseService.goToManageGenericCategoryShippingType(id);
                }
            };

            vm.goToPartList = () => {
                BaseService.goToPartList();
            };

            /* to get/apply class for Supplier transaction lock status */
            vm.getSupplierTransactionLockStatusClassName = (lockStatus) => BaseService.getCustPaymentLockStatusClassName(lockStatus);


            // download print
            vm.onDownload = (row) => vm.printRecord(row, true);
        }
    }
})();
