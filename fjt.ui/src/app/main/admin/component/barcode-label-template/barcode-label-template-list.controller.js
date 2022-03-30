(function () {
    'use strict';

    angular
        .module('app.admin.barcode-label-template')
        .controller('BarcodeLabelTemplateController', BarcodeLabelTemplateController);

    /** @ngInject */
    function BarcodeLabelTemplateController($timeout, $scope, $mdDialog, $state, USER, CORE, BaseService, DialogFactory, BarcodeLabelTemplateFactory) {
        const vm = this;
        vm.isUpdatable = true;
        vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.BARCODE_LABEL_TEMPLATE;
        vm.StatusOptionsGridHeaderDropdown = CORE.BarcodeTemplateStatusGridHeaderDropdown;
        vm.TypeOptionsGridHeaderDropdown = CORE.BarcodeTemplateTypeGridHeaderDropdown;
        vm.gridConfig = CORE.gridConfig;
        vm.LabelConstant = CORE.LabelConstant;
        vm.BarcodeCategoryDropdown = CORE.BarcodeCategoryDropdown;
        vm.loginUser = BaseService.loginUser;
        const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;

        vm.getBarcodeClass = (id) => {
            const objStatus = _.find(CORE.BarcodeStatus, { ID: id });
            if (objStatus) {
                return objStatus.ClassName;
            }
        };
        vm.getBarcodeStatus = (id) => {
            const objStatus = _.find(CORE.BarcodeStatus, { ID: id });
            if (objStatus) {
                return objStatus.Name;
            }
        };
        vm.getBarcodeType = (id) => {
            const objType = _.find(USER.BARCODE, (item), { Id: id });
            if (objType) {
                return objType.Value;
            }
        };
        vm.sourceHeader = [{
            field: 'Action',
            cellClass: 'gridCellColor',
            displayName: 'Action',
            width: 80,
            cellTemplate: '<grid-action-view grid="grid" row="row"></grid-action-view>',
            enableFiltering: false,
            enableSorting: false,
            exporterSuppressExport: true,
            pinnedLeft: true
        }, {
            field: '#',
            width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
            cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
            enableFiltering: false,
            enableSorting: false
        }, {
            field: 'mfg',
            displayName: vm.LabelConstant.MFG.MFG + '/Supplier',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: 155
        }, {
            field: 'statusLabel',
            width: 115,
            displayName: 'Status',
            cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
                + '<span class="label-box" ng-class="{\'label-success\':row.entity.status === 1 ,\
                         \'label-warning\':row.entity.status === 0 }"> \
                            {{COL_FIELD}}'
                + '</span>'
                + '</div>',
            filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
            filter: {
                term: null,
                options: vm.StatusOptionsGridHeaderDropdown
            },
            ColumnDataType: 'StringEquals',
            enableFiltering: true,
            enableSorting: true
        }, {
            field: 'barcodeCategory',
            width: 150,
            displayName: 'Category',
            cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
                + '<span class="label-box" \
                      ng-class="{\'label-info\':row.entity.barcodeCategory === grid.appScope.$parent.vm.BarcodeCategoryDropdown[1].value,\
                      \'label-primary\':row.entity.barcodeCategory === grid.appScope.$parent.vm.BarcodeCategoryDropdown[2].value}"> \
                          {{COL_FIELD}}'
                + '</span>'
                + '</div>',
            filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
            filter: {
                term: null,
                options: vm.BarcodeCategoryDropdown
            },
            ColumnDataType: 'StringEquals',
            enableFiltering: true,
            enableSorting: true
        }, {
            field: 'barcodeTypeLabel',
            displayName: 'Type',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{(COL_FIELD)}}</div>',
            width: 180,
            filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
            filter: {
                term: null,
                options: vm.TypeOptionsGridHeaderDropdown
            },
            ColumnDataType: 'StringEquals',
            enableFiltering: true,
            enableSorting: true
        },
        {
            field: 'separatorName',
            displayName: 'Barcode Separator',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: 100
        },
        {
            field: 'numberOfDelimiter',
            displayName: 'Number of Field Identifier',
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
            width: 110
        },
        {
            field: 'prefixlength',
            displayName: 'Ignore Number of Prefix Characters',
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
            width: 150
        },
        {
            field: 'suffixlength',
            displayName: 'Ignore Number of Suffix Characters',
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
            width: 150
        },
        {
            field: 'name',
            displayName: 'Name',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: 170
        }, {
            field: 'Samplereaddata',
            displayName: 'Label String',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: 630
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
        }
            , {
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
            enableFiltering: true
        }];
        let initPageInfo = () => {
            vm.pagingInfo = {
                Page: CORE.UIGrid.Page(),
                pageSize: CORE.UIGrid.ItemsPerPage(),
                SortColumns: [['id', 'DESC']],
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
            exporterCsvFilename: 'Barcode Template.csv'
        };

        // to set data in grid after data is retrived from API in loadData() and getDataDown() function
        const setDataAfterGetAPICall = (templateData, isGetDataDown) => {
            if (templateData && templateData.data && templateData.data.barcodeTemplate) {
                if (!isGetDataDown) {
                    vm.sourceData = templateData.data.barcodeTemplate;
                    vm.currentdata = vm.sourceData.length;
                }
                else if (templateData.data.barcodeTemplate.length > 0) {
                    vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(templateData.data.barcodeTemplate);
                    vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
                }

                // must set after new data comes
                vm.totalSourceDataCount = templateData.data.Count;
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
            vm.cgBusyLoading = BarcodeLabelTemplateFactory.retrieveBarcodeLabelTemplateList().query(vm.pagingInfo).$promise.then((templateData) => {
                if (templateData && templateData.data) {
                    setDataAfterGetAPICall(templateData, false);
                }
            }).catch((error) => BaseService.getErrorLog(error));
        };

        /* to get data on scroll down in grid */
        vm.getDataDown = () => {
            vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
            vm.cgBusyLoading = BarcodeLabelTemplateFactory.retrieveBarcodeLabelTemplateList().query(vm.pagingInfo).$promise.then((templateData) => {
                setDataAfterGetAPICall(templateData, true);
            }).catch((error) => BaseService.getErrorLog(error));
        };

        vm.selectedBarcodeLabelTemplate = () => vm.gridOptions.getSelectedRowsCount ? vm.gridOptions.getSelectedRowsCount() : 0;

        vm.fab = {
            Status: false
        };

        /* add barcode template*/
        vm.addEditRecord = () => {
            $state.go(USER.ADMIN_MANAGE_BARCODE_LABEL_TEMPLATE_STATE, { id: null });
        };

        /* Update barcode template */
        vm.updateRecord = (row) => {
            $state.go(USER.ADMIN_MANAGE_BARCODE_LABEL_TEMPLATE_STATE, { id: row.entity.id });
        };

        /* delete  barcode template*/
        vm.deleteRecord = (template) => {
            let selectedIDs = [];
            if (template) {
                selectedIDs.push(template.id);
            } else {
                vm.selectedRows = vm.selectedRowsList;
                if (vm.selectedRows.length > 0) {
                    selectedIDs = vm.selectedRows.map((item) => item.id);
                }
            }
      if (selectedIDs) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Barcode template', selectedIDs.length);
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
                        vm.cgBusyLoading = BarcodeLabelTemplateFactory.deleteBarcodeLabelTemplate().query({ objIDs: objIDs }).$promise.then((res) => {
                            if (res && res.data && (res.data.length > 0 || res.data.transactionDetails)) {
                                const data = {
                                    TotalCount: res.data.transactionDetails[0].TotalCount,
                                    pageName: CORE.PageName.barcode_templates
                                };
                                BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                                    const IDs = {
                                        id: selectedIDs,
                                        CountList: true
                                    };
                                    return BarcodeLabelTemplateFactory.deleteBarcodeLabelTemplate().query({
                                        objIDs: IDs
                                    }).$promise.then((res) => {
                                        let data = {};
                                        data = res.data;
                                        data.pageTitle = template ? template.name : null;
                                        data.PageName = CORE.PageName.barcode_templates;
                                        data.id = selectedIDs;
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
                                vm.gridOptions.clearSelectedRows();
                            }
                        }).catch((error) => BaseService.getErrorLog(error));
                    }
                }, () => {
                }).catch((error) => BaseService.getErrorLog(error));
            }
            else {
                //show validation message no data selected
                const alertModel = {
                    title: USER.USER_ERROR_LABEL,
                    textContent: stringFormat(USER.SELECT_ONE_LABEL, 'Barcode template')
                };
                DialogFactory.alertDialog(alertModel);
            }
        };

        /* delete multiple data called from directive of ui-grid*/
        vm.deleteMultipleData = () => {
            vm.deleteRecord();
        };

        $scope.$on('$destroy', () => {
            $mdDialog.hide(false, {
                closeAll: true
            });
        });
    }
})();
