(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('componentInspectionRequirementDet', componentInspectionRequirementDet);

    /** @ngInject */
    function componentInspectionRequirementDet(CORE, DialogFactory, $rootScope, $timeout, USER, BaseService, ComponentFactory, TRANSACTION) {
        var directive = {
            restrict: 'E',
            replace: true,
            scope: {
                partId: '=',
                partDetail: '=?',
                isSupplier: '=',
                requirmentCategory: '=',
                isReadOnly: '=?'
            },
            templateUrl: 'app/directives/custom/componenet-inspection-requirement-det/componenet-inspection-requirement-det.html',
            controller: componenetInspectionRequirementDetCtrl,
            controllerAs: 'vm'
        };
        return directive;
        /** @ngInject */

        function componenetInspectionRequirementDetCtrl($scope) {
            var vm = this;
            vm.isCopyPart = true;
            vm.isReadOnly = $scope.isReadOnly || false;
            vm.partId = $scope.partId || null;
            vm.partDetail = $scope.partDetail || null;
            vm.isSupplier = $scope.isSupplier;
            vm.isHideDelete = vm.isSupplier || vm.isReadOnly ? true : false;
            vm.requirmentCategory = $scope.requirmentCategory || {};
            vm.LabelConstant = CORE.LabelConstant;
            vm.gridPurchaseInspectionRequirement = CORE.gridConfig.gridPurchaseInspectionRequirement;
            vm.loginUser = BaseService.loginUser;
            const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
            vm.StatusOptionsGridHeaderDropdown = CORE.StatusOptionsGridHeaderDropdown;
            vm.PartRequirementTypeOptionsGridHeaderDropdown = CORE.PartRequirementTypeOptionsGridHeaderDropdown;

            vm.EmptyMesssage = angular.copy(USER.ADMIN_EMPTYSTATE.PURCHASE_INSPECTION_REQUIREMENT_EMPTY);
            vm.EmptyMesssage.MESSAGE = stringFormat(vm.EmptyMesssage.MESSAGE, vm.requirmentCategory.value);
            vm.EmptyMesssage.ADDNEWMESSAGE = stringFormat(vm.EmptyMesssage.ADDNEWMESSAGE, vm.requirmentCategory.value);

            if (vm.requirmentCategory.id === 'P') {
                vm.gridHeightClass = TRANSACTION.PartComment_Split_UI.PurchasingIncomingInspectionCommentsGridUI;
            }
            else if (vm.requirmentCategory.id === 'M') {
                vm.gridHeightClass = TRANSACTION.PartComment_Split_UI.ManufacturingProductionCommentsGridUI;
            }
            else if (vm.requirmentCategory.id === 'S') {
                vm.gridHeightClass = TRANSACTION.PartComment_Split_UI.ShippingCommentsGridUI;
            }

            const initPageInfo = () => {
                vm.pagingInfo = {
                    Page: CORE.UIGrid.Page(),
                    pageSize: CORE.UIGrid.ItemsPerPage(),
                    SortColumns: [['requiementType', 'DESC']],
                    SearchColumns: [],
                    partId: vm.partId,
                    category: vm.requirmentCategory.id
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
                exporterCsvFilename: vm.requirmentCategory.value + '.csv',
                CurrentPage: CORE.PAGENAME_CONSTANT[64].PageName,
                isAdd: vm.isSupplier || vm.isReadOnly ? false : true,
                enableFiltering: false,
                hideFilter: true,
                hideMultiDeleteButton: vm.isSupplier || vm.isReadOnly ? true : false,
                allowToExportAllData: true,
                exporterAllDataFn: () => {
                    const pagingInfoOld = _.clone(vm.pagingInfo);
                    pagingInfoOld.pageSize = 0;
                    pagingInfoOld.isExport = true;
                    return ComponentFactory.getAllPurchaseInspectionRequirement().query(pagingInfoOld).$promise.then((response) => {
                        if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data && response.data.PurchaseInspectionRequirementList) {
                            setDataAfterGetAPICall(response.data, false);
                            return response.data.PurchaseInspectionRequirementList;
                        }
                    }).catch((error) => BaseService.getErrorLog(error));
                }
            };

            vm.sourceHeader = [
                {
                    field: '#',
                    width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
                    cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
                    enableFiltering: false,
                    enableSorting: false,
                    maxWidth: '80'
                },
                {
                    field: 'requiementType',
                    displayName: 'Type',
                    cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
                        + '<span  class="label-box" \
                                            ng-class="{\'label-success\':row.entity.requiementType === grid.appScope.$parent.vm.PartRequirementTypeOptionsGridHeaderDropdown[1].id, \
                                            \'label-warning\':row.entity.requiementType === grid.appScope.$parent.vm.PartRequirementTypeOptionsGridHeaderDropdown[2].id }"> \
                                                {{ COL_FIELD }}'
                        + '</span>'
                        + '</div>',
                    filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
                    filter: {
                        term: null,
                        options: vm.PartRequirementTypeOptionsGridHeaderDropdown
                    },
                    ColumnDataType: 'StringEquals',
                    enableSorting: false,
                    width: 120
                },
                {
                    field: 'partRequirementCategoryName',
                    displayName: vm.LabelConstant.PURCHASE_INSPECTION_REQUIREMENT.PartRequirementCategory,
                    cellTemplate: '<div class="ui-grid-cell-contents"><a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToManageGenericCategoryPartRequirementCategory(row.entity.gencCategoryID);">{{COL_FIELD}}</a></div>',
                    width: 210
                },
                {
                    field: 'requirement',
                    displayName: vm.LabelConstant.PURCHASE_INSPECTION_REQUIREMENT.PurchaseRequirement,
                    cellTemplate: '<div class="ui-grid-cell-contents text-left cm-white-space-normal">{{COL_FIELD}}</div>',
                    width: '800'
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
                    enableCellEdit: false,
                    enableSorting: false
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
                    field: 'updatedby',
                    displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
                    cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                    width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
                    type: 'StringEquals',
                    enableFiltering: true,
                    visible: CORE.UIGrid.VISIBLE_MODIFIED_BY
                }, {
                    field: 'updatedbyRole',
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
                },
                {
                    field: 'createdby',
                    displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
                    cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                    width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
                    type: 'StringEquals',
                    enableFiltering: true,
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
            if (!vm.isSupplier && !vm.isReadOnly) {
                vm.sourceHeader.unshift(
                    {
                        field: 'Apply',
                        headerCellTemplate: '<md-checkbox class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox" ng-model="grid.appScope.$parent.vm.Apply" \
                            ng-change="grid.appScope.$parent.vm.applyAll(grid.appScope.$parent.vm.Apply)"></md-checkbox>',
                        width: '75',
                        cellTemplate: '<div class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox" style="overflow:initial"><md-checkbox  ng-disabled="row.entity.isDisabledDelete"  ng-model="row.entity.isRecordSelectedForRemove" \
                            ng-change="grid.appScope.$parent.vm.setInspectionRemove(row.entity)"></md-checkbox></div>',
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
            }

            // to set data in grid after data is retrived from API in loadData() and getDataDown() function
            const setDataAfterGetAPICall = (PurchaseInspectionRequirementList, isGetDataDown) => {
                if (PurchaseInspectionRequirementList && PurchaseInspectionRequirementList.data && PurchaseInspectionRequirementList.data.PurchaseInspectionRequirementList) {
                    if (!isGetDataDown) {
                        vm.sourceData = PurchaseInspectionRequirementList.data.PurchaseInspectionRequirementList;
                        vm.currentdata = vm.sourceData.length;
                    }
                    else if (PurchaseInspectionRequirementList.data.PurchaseInspectionRequirementList.length > 0) {
                        vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(PurchaseInspectionRequirementList.data.PurchaseInspectionRequirementList);
                        vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
                    }
                    // must set after new data comes
                    vm.totalSourceDataCount = PurchaseInspectionRequirementList.data.Count;
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
                            if (vm.gridOptions && vm.gridOptions.gridApi && vm.gridOptions.gridApi.grid) {
                                if (vm.gridOptions.gridApi.grid.options) {
                                    vm.gridOptions.gridApi.grid.options.isAdd = vm.isSupplier || vm.isReadOnly ? false : true;
                                }
                                if (vm.gridOptions.gridApi.grid.gridMenuScope) {
                                    vm.gridOptions.gridApi.grid.gridMenuScope.showFilters = false;
                                }
                            }
                            if (vm.isSupplier || vm.isReadOnly) {
                                $scope.$emit(USER.ComponentGetDetailBroadcast, null);
                            }
                            vm.resetSourceGrid();
                            if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
                                return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
                            }
                        }
                        else {
                            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount !== vm.currentdata ? true : false);
                        }
                    });
                    vm.Apply = false;
                }
            };

            vm.loadData = () => {
                BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
                if (vm.pagingInfo.SortColumns.length === 0) {
                    vm.pagingInfo.SortColumns = [['requiementType', 'DESC']];
                }
                vm.cgBusyLoading = ComponentFactory.getAllPurchaseInspectionRequirement().query(vm.pagingInfo).$promise.then((PurchaseInspectionRequirementList) => {
                    if (PurchaseInspectionRequirementList && PurchaseInspectionRequirementList.data) {
                        setDataAfterGetAPICall(PurchaseInspectionRequirementList, false);
                    }
                }).catch((error) => BaseService.getErrorLog(error));
            };

            vm.getDataDown = () => {
                vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
                vm.cgBusyLoading = ComponentFactory.getAllPurchaseInspectionRequirement().query(vm.pagingInfo).$promise.then((PurchaseInspectionRequirementList) => {
                    if (PurchaseInspectionRequirementList && PurchaseInspectionRequirementList.data) {
                        setDataAfterGetAPICall(PurchaseInspectionRequirementList, true);
                    }
                }).catch((error) => BaseService.getErrorLog(error));
            };

            vm.refreshPurchaseInspectionRequirement = () => vm.loadData();

            vm.applyAll = (applyAll) => applyAll ? _.map(vm.sourceData, selectInspection) : _.map(vm.sourceData, unselectInspection);

            const selectInspection = (row) => {
                row.isRecordSelectedForRemove = true;
                vm.gridOptions.gridApi.selection.selectRow(row);
            };

            const unselectInspection = (row) => {
                row.isRecordSelectedForRemove = false;
                vm.gridOptions.clearSelectedRows();
            };

            vm.setInspectionRemove = (row) => {
                var totalItem = vm.sourceData;
                var selectItem = _.filter(vm.sourceData, (data) => data.isRecordSelectedForRemove === true);
                if (row.isRecordSelectedForRemove) {
                    vm.gridOptions.gridApi.selection.selectRow(row);
                }
                else {
                    vm.gridOptions.gridApi.selection.unSelectRow(row);
                }

                vm.Apply = totalItem.length === selectItem.length ? true : false;
            };

            vm.deleteMultipleData = () => vm.deleteRecord();

            vm.deleteRecord = (selectedRow) => {
                if (vm.isReadOnly) {
                    return;
                }
                let selectedIDs = [];
                if (selectedRow) {
                    selectedIDs.push(selectedRow.id);
                }
                else {
                    vm.selectedRows = vm.selectedRowsList;
                    if (vm.selectedRows.length > 0) {
                        selectedIDs = vm.selectedRows.map((data) => data.id);
                    }
                }

                if (selectedIDs) {
                    const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
                    messageContent.message = stringFormat(messageContent.message, vm.requirmentCategory.value, selectedIDs.length);

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
                            vm.cgBusyLoading = ComponentFactory.deletePurchaseInspectionRequirement().query({ objIDs: objIDs }).$promise.then((data) => {
                                if (data && data.data && (data.data.length > 0 || data.data.transactionDetails)) {
                                    const data = {
                                        TotalCount: data.data.transactionDetails[0].TotalCount,
                                        pageName: CORE.PageName.mounting_type
                                    };
                                    BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                                        const IDs = {
                                            id: selectedIDs,
                                            CountList: true
                                        };
                                        return RFQSettingFactory.deleteMountingType().query({
                                            objIDs: IDs
                                        }).$promise.then((res) => {
                                            const data = res.data;
                                            data.pageTitle = selectedRow ? selectedRow.name : null;
                                            data.PageName = CORE.PageName.purchase_inspection_requirement;
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
                                }
                                else {
                                    BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                                    vm.gridOptions.clearSelectedRows();
                                    $scope.$emit(USER.ComponentGetDetailBroadcast, null);
                                }
                            }).catch((error) => BaseService.getErrorLog(error));
                        }
                    }, () => {
                    }).catch((error) => BaseService.getErrorLog(error));
                }
                else {
                    const messageContent = angular.cop(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
                    messageContent.message = stringFormat(messageContent.message, USER.ADMIN_MANAGECOMPONENT_PURCHASE_INSPECTION_REQUIREMENT_LABEL);
                    const alertModel = {
                        messageContent: messageContent,
                        multiple: true
                    };
                    DialogFactory.messageAlertDialog(alertModel);
                }
            };

            vm.addPurchaseInspectionRequirement = () => {
                if (vm.isReadOnly) {
                    return;
                }

                const data = {
                    partId: vm.partId,
                    partDetail: vm.partDetail,
                    inspectionList: vm.sourceData,
                    requirmentCategory: vm.requirmentCategory
                };
                DialogFactory.dialogService(
                    CORE.COMPONENET_INSPECTION_REQUIREMENT_DET_MODAL_CONTROLLER,
                    CORE.COMPONENET_INSPECTION_REQUIREMENT_DET_MODAL_VIEW,
                    null,
                    data).then(() => {
                    }, (response) => {
                        if (response) {
                            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                            $scope.$emit(USER.ComponentGetDetailBroadcast, null);
                        }
                    }, (err) => BaseService.getErrorLog(err));
            };
            const onAddNew = $scope.$on('AddNew', () => vm.addPurchaseInspectionRequirement());

            $rootScope.$on(vm.requirmentCategory.broadCastValue, () => BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData));

            vm.goToManageGenericCategoryPartRequirementCategory = (id) => BaseService.goToManageGenericCategoryPartRequirementCategory(id);

            vm.copyPartRequirement = () => {
                if (vm.isReadOnly) {
                    return;
                }

                const data = {
                    partId: vm.partId,
                    partDetail: vm.partDetail,
                    inspectionList: vm.selectedRowsList,
                    requirmentCategory: vm.requirmentCategory
                };
                DialogFactory.dialogService(
                    CORE.COMPONENET_REQUIREMENT_COPY_POPUP_MODAL_CONTROLLER,
                    CORE.COMPONENET_REQUIREMENT_COPY_POPUP_MODAL_VIEW,
                    null,
                    data).then(() => { },
                        () => $scope.$emit(USER.ComponentGetDetailBroadcast, null),
                        (err) => BaseService.getErrorLog(err));
            };

            vm.viewPurchaseRequirementList = () => {
                const data = {
                    title: vm.requirmentCategory.value,
                    list: _.map(vm.sourceData, 'requirement')
                };
                DialogFactory.dialogService(
                    CORE.VIEW_BULLET_POINT_LIST_POPUP_CONTROLLER,
                    CORE.VIEW_BULLET_POINT_LIST_POPUP_VIEW,
                    null,
                    data).then(() => { },
                        () => { },
                        (err) => BaseService.getErrorLog(err));
            };

            vm.gotoRequirementsMst = () => BaseService.goToPurchaseInspectionRequirement();

            $scope.$on('$destroy', () => {
                onAddNew();
            });
        }
    }
})();
