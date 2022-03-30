(function () {
    'use strict';

    angular
        .module('app.admin.purchaseincominginspectionreq')
        .controller('PurchaseInspectionController', PurchaseInspectionController);

    /** @ngInject */
    function PurchaseInspectionController($mdDialog, $scope, $timeout, CORE, USER, PurchaseInspectionRequirementFactory, DialogFactory, BaseService) {
        const vm = this;
        vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.PURCHASE_INSPECTION_REQUIREMENT;
        vm.gridConfig = CORE.gridConfig;
        vm.isUpdatable = true;
        vm.isViewRequirementReference = true;
        vm.LabelConstant = CORE.LabelConstant;
        vm.currentPageName = vm.LabelConstant.PURCHASE_INSPECTION_REQUIREMENT.PurchaseRequirement;
        vm.loginUser = BaseService.loginUser;
        const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;
        vm.StatusOptionsGridHeaderDropdown = CORE.StatusOptionsGridHeaderDropdown;
        vm.PartRequirementTypeOptionsGridHeaderDropdown = CORE.PartRequirementTypeOptionsGridHeaderDropdown;
        vm.KeywordStatusGridHeaderDropdown = CORE.KeywordStatusGridHeaderDropdown;

        vm.sourceHeader = [
            {
                field: 'Action',
                cellClass: 'gridCellColor',
                displayName: 'Action',
                width: '90',
                cellTemplate: '<grid-action-view grid="grid" row="row" style="overflow: hidden;padding:1px !important; overflow: hidden; white-space: nowrap;" class="height-grid ui-grid-cell-contents"></grid-action-view>',
                enableFiltering: false,
                enableSorting: false,
                exporterSuppressExport: true,
                pinnedLeft: false
            }, {
                field: '#',
                width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
                cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
                enableFiltering: false,
                enableSorting: false
            },
            {
                field: 'requiementType',
                displayName: 'Type',
                cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
                    + '<span  class="label-box" \
                                            ng-class="{\'label-success\':row.entity.requiementType == grid.appScope.$parent.vm.PartRequirementTypeOptionsGridHeaderDropdown[1].id, \
                                            \'label-warning\':row.entity.requiementType == grid.appScope.$parent.vm.PartRequirementTypeOptionsGridHeaderDropdown[2].id }"> \
                                                {{ COL_FIELD }}'
                    + '</span>'
                    + '</div>',
                filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
                filter: {
                    term: null,
                    options: vm.PartRequirementTypeOptionsGridHeaderDropdown
                },
                ColumnDataType: 'StringEquals',
                width: 120,
                enableCellEdit: false
            },
            {
                field: 'requirement',
                displayName: vm.currentPageName,
                cellTemplate: '<div class="ui-grid-cell-contents text-left cm-white-space-normal">{{COL_FIELD}}</div>',
                width: '670'
            },
            {
                field: 'partRequirementCategoryName',
                displayName: vm.LabelConstant.PURCHASE_INSPECTION_REQUIREMENT.PartRequirementCategory,
                cellTemplate: '<div class="ui-grid-cell-contents"><a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToManageGenericCategoryPartRequirementCategory(row.entity.gencCategoryID);">{{COL_FIELD}}</a></div>',
                width: 220,
                enableCellEdit: false
            },
            {
                field: 'isActiveConvertedValue',
                displayName: 'Status',
                cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
                    + '<span  class="label-box" \
                                            ng-class="{\'label-success\':row.entity.isActive == true, \
                                            \'label-warning\':row.entity.isActive == false}"> \
                                                {{ COL_FIELD }}'
                    + '</span>'
                    + '</div>',
                filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
                filter: {
                    term: null,
                    options: vm.StatusOptionsGridHeaderDropdown
                },
                ColumnDataType: 'StringEquals',
                width: 130,
                enableCellEdit: false
            },
            {
                field: 'SystemGeneratedValue',
                displayName: vm.LabelConstant.COMMON.GRIDHEADER_SYSTEM_GENERATED,
                cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
                    + '<span class="label-box" \
                  ng-class="{\'label-success\':row.entity.systemGenerated == true, \
                  \'label-warning\':row.entity.systemGenerated == false}"> \
                  {{ COL_FIELD }}'
                    + '</span>'
                    + '</div>',
                filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
                filter: {
                    term: null,
                    options: vm.KeywordStatusGridHeaderDropdown
                },
                ColumnDataType: 'StringEquals',
                width: 120
            },
            {
                field: 'updatedAt',
                displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
                type: 'datetime',
                enableFiltering: false,
                visible: CORE.UIGrid.VISIBLE_MODIFIED_AT
            }, {
                field: 'updatedBy',
                displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
                type: 'StringEquals',
                enableFiltering: true,
                visible: CORE.UIGrid.VISIBLE_MODIFIED_BY
            }, {
                field: 'updateByRoleId',
                displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
                type: 'StringEquals',
                enableFiltering: true,
                visible: CORE.UIGrid.VISIBLE_MODIFIED_BYROLE
            }, {
                field: 'createdAt',
                displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
                type: 'datetime',
                enableFiltering: false,
                visible: CORE.UIGrid.VISIBLE_CREATED_AT
            }, {
                field: 'createdBy',
                displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
                type: 'StringEquals',
                enableFiltering: true,
                visible: CORE.UIGrid.VISIBLE_CREATED_BY
            }, {
                field: 'createByRoleId',
                displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
                type: 'StringEquals',
                enableFiltering: true,
                visible: CORE.UIGrid.VISIBLE_CREATED_BYROLE
            }];
        vm.sourceHeader.unshift(
            {
                field: 'Apply',
                headerCellTemplate: '<md-checkbox class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox" ng-model="grid.appScope.$parent.vm.Apply" \
                            ng-change="grid.appScope.$parent.vm.applyAll(grid.appScope.$parent.vm.Apply)"></md-checkbox>',
                width: '75',
                cellTemplate: '<div class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox" style="overflow:initial"><md-checkbox  ng-disabled="row.entity.isDisabledDelete || row.entity.systemGenerated"  ng-model="row.entity.isRecordSelectedForRemove" \
                            ng-change="grid.appScope.$parent.vm.setRequirementRemove(row.entity)"></md-checkbox></div>',
                enableFiltering: false,
                enableSorting: false,
                exporterSuppressExport: true,
                pinnedLeft: false,
                allowCellFocus: false,
                enableColumnMoving: false,
                manualAddedCheckbox: true
            });

        const initPageInfo = () => {
            vm.pagingInfo = {
                Page: CORE.UIGrid.Page(),
                SortColumns: [['requiementType', 'DESC'], ['requirement', 'ASC']],
                SearchColumns: []
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
            allowToExportAllData: true,
            exporterCsvFilename: vm.currentPageName + '.csv',
            CurrentPage: vm.currentPageName,
            exporterAllDataFn: () => {
                const pagingInfoOld = _.clone(vm.pagingInfo);
                pagingInfoOld.pageSize = 0;
                pagingInfoOld.isExport = true;
                return PurchaseInspectionRequirementFactory.getpurchaseInspectList().query(pagingInfoOld).$promise.then((requirementType) => {
                    if (requirementType && requirementType.status === CORE.ApiResponseTypeStatus.SUCCESS && requirementType.data && requirementType.data.RequirementList) {
                        setDataAfterGetAPICall(requirementType, false);
                        return requirementType.data.RequirementList;
                    }
                }).catch((error) => BaseService.getErrorLog(error));
            }
        };

        function setDataAfterGetAPICall(requirementType, isGetDataDown) {
            if (requirementType && requirementType.data.RequirementList) {
                if (!isGetDataDown) {
                    vm.sourceData = _.each(requirementType.data.RequirementList, (item) => item.isDisabledDelete = item.systemGenerated);
                    vm.currentdata = vm.sourceData.length;
                }
                else if (requirementType.data.RequirementList.length > 0) {
                    vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(requirementType.data.RequirementList);
                    vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
                }
                // must set after new data comes
                vm.totalSourceDataCount = requirementType.data.Count;
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

        /* retrieve Users list*/
        vm.loadData = () => {
            vm.Apply = false;
            if (vm.pagingInfo.SortColumns.length === 0) {
                vm.pagingInfo.SortColumns = [['requiementType', 'DESC'], ['requirement', 'ASC']];
            }
            BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
            vm.cgBusyLoading = PurchaseInspectionRequirementFactory.getpurchaseInspectList().query(vm.pagingInfo).$promise.then((requirementType) => {
                if (requirementType.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                    setDataAfterGetAPICall(requirementType, false);
                }
            }).catch((error) => BaseService.getErrorLog(error));
        };

        /* load more data on mouse scroll */
        vm.getDataDown = () => {
            vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
            vm.cgBusyLoading = PurchaseInspectionRequirementFactory.getpurchaseInspectList().query(vm.pagingInfo).$promise.then((requirementType) => {
                if (requirementType) {
                    setDataAfterGetAPICall(requirementType, true);
                }
            }).catch((error) => BaseService.getErrorLog(error));
        };

        // Show Refrence of Requirement Purchase Inspection
        vm.viewRequirementReference = (purchasecategory, ev) => {
            const data = purchasecategory.entity.id;
            if (data) {
                DialogFactory.dialogService(
                    CORE.WHERE_USED_PURCHASE_INSPECTION_REQUIREMENT_MODAL_CONTROLLER,
                    CORE.WHERE_USED_PURCHASE_INSPECTION_REQUIREMENT_MODAL_VIEW,
                    ev,
                    data).then(() => {
                    }, () => {
                    });
            }
        };

        // delete purchase inspection requirement
        vm.deleteRecord = (purchasecategory) => {
            let selectedIDs = [];
            if (purchasecategory) {
                selectedIDs.push(purchasecategory.id);
            } else {
                vm.selectedRows = vm.selectedRowsList;
                if (vm.selectedRows.length > 0) {
                    selectedIDs = vm.selectedRows.map((purchaseCategoryItem) => purchaseCategoryItem.id);
                }
            }
            if (selectedIDs) {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
                messageContent.message = stringFormat(messageContent.message, vm.currentPageName, selectedIDs.length);
                const obj = {
                    messageContent: messageContent,
                    btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                    canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                };
                const objIDs = {
                    id: selectedIDs,
                    CountList: false
                };
                DialogFactory.messageConfirmDialog(obj).then((resposne) => {
                    if (resposne) {
                        vm.cgBusyLoading = PurchaseInspectionRequirementFactory.deletePurchaseRequirement().query({ objIDs: objIDs }).$promise.then((response) => {
                            if (response && response.data && (response.data.length > 0 || response.data.transactionDetails)) {
                                const data = {
                                    TotalCount: response.data.transactionDetails[0].TotalCount,
                                    pageName: CORE.PageName.purchaseInspectionRequirement
                                };
                                objIDs.CountList = true;
                                BaseService.deleteAlertMessageWithHistory(data, (ev) => PurchaseInspectionRequirementFactory.deletePurchaseRequirement().query({
                                    objIDs: objIDs
                                }).$promise.then((res) => {
                                    let data = {};
                                    data = res.data;
                                    data.pageTitle = purchasecategory ? purchasecategory.requirement : null;
                                    data.PageName = CORE.PageName.purchaseInspectionRequirement + '(s)';
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
                                }).catch((error) => BaseService.getErrorLog(error)));
                            }
                            else {
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
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
                messageContent.message = stringFormat(messageContent.message, vm.currentPageName);
                const alertModel = {
                    messageContent: messageContent,
                    multiple: true
                };
                DialogFactory.messageAlertDialog(alertModel);
            }
        };

        //open popup for add edit new purchase requirement
        vm.addEditRecord = (data, ev) => {
            var objdata = angular.copy(data);

            DialogFactory.dialogService(
                CORE.MANAGE_PURCHASE_INSPECTION_REQUIREMENT_MODAL_CONTROLLER,
                CORE.MANAGE_PURCHASE_INSPECTION_REQUIREMENT_MODAL_VIEW,
                ev,
                objdata).then(() => {
                }, (data) => {
                    if (data) {
                        vm.loadData(); // to not reload list page if update details discussed with DP 27-02-2021
                        // BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                    }
                }, (error) => BaseService.getErrorLog(error));
        };

        /* Update rohs */
        vm.updateRecord = (row, ev) => {
            vm.addEditRecord(row.entity, ev);
        };

        /* delete multiple data called from directive of ui-grid*/
        vm.deleteMultipleData = () => {
            vm.deleteRecord();
        };

        //refresh list page
        vm.refreshpurchaseInspectionList = () => {
            vm.loadData();
        };

        //apply all details
        vm.applyAll = (applyAll) => {
            if (applyAll) {
                _.map(vm.sourceData, selectRequirement);
            } else {
                _.map(vm.sourceData, unselectRequirement);
            }
        };
        const selectRequirement = (row) => {
            row.isRecordSelectedForRemove = row.isDisabledDelete ? false : true;
            if (row.isRecordSelectedForRemove) {
                vm.gridOptions.gridApi.selection.selectRow(row);
            }
        };
        const unselectRequirement = (row) => {
            row.isRecordSelectedForRemove = false;
            vm.gridOptions.clearSelectedRows();
        };
        vm.setRequirementRemove = (row) => {
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

        vm.goToManageGenericCategoryPartRequirementCategory = (id) => BaseService.goToManageGenericCategoryPartRequirementCategory(id);

        vm.updatePartRequirementCategory = (event) => {
            if (vm.selectedRowsList && vm.selectedRowsList.length > 0) {
                const objCategory = {
                    isfromMap: false,
                    rowData: vm.selectedRowsList
                };
                DialogFactory.dialogService(
                    CORE.PURCHASE_INSPECTION_UPDATE_MULTIPLE_CATEGORY_MODAL_CONTROLLER,
                    CORE.PURCHASE_INSPECTION_UPDATE_MULTIPLE_CATEGORY_MODAL_VIEW,
                    event,
                    objCategory).then(() => {
                        // success
                    }, (data) => {
                        if (data) {
                            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                        }
                    }, (err) => BaseService.getErrorLog(err));
            }
        };

        vm.viewPurchaseRequirementList = () => {
            const data = {
                title: vm.currentPageName,
                list: _.map(vm.sourceData, 'requirement')
            };
            DialogFactory.dialogService(
                CORE.VIEW_BULLET_POINT_LIST_POPUP_CONTROLLER,
                CORE.VIEW_BULLET_POINT_LIST_POPUP_VIEW,
                null,
                data).then(() => { }, () => { });
        };

        // Redirect to requirement & comments templete
        vm.goToTemplatePurchaseInspectionRequirement = () => BaseService.goToTemplatePurchaseInspectionRequirement();
        //close popup on page destroy
        $scope.$on('$destroy', () => {
            $mdDialog.hide(false, { closeAll: true });
        });
    }
})();
