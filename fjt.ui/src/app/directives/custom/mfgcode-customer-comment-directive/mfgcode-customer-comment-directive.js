(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('componentCustomerComment', componentCustomerComment);

    /** @ngInject */
    function componentCustomerComment(CORE, DialogFactory, $rootScope, $timeout, USER, BaseService, CustomerFactory) {
        var directive = {
            restrict: 'E',
            replace: true,
            scope: {
                customerid: '=?',
                customerName: '=?',
                customerType: '=?',
                customerCode: '=?'
            },
            templateUrl: 'app/directives/custom/mfgcode-customer-comment-directive/mfgcode-customer-comment.html',
            controller: componentCustomerCommentController,
            controllerAs: 'vm'
        };
        return directive;
        /** @ngInject */

        function componentCustomerCommentController($scope) {
            var vm = this;
            vm.customerCode = $scope.customerCode;
            vm.customerType = $scope.customerType;
            vm.customerName = $scope.customerName;
            vm.customerID = $scope.customerid;
            vm.currentPageName = `Comments (These comments will be printed on the ${vm.customerType === CORE.CUSTOMER_TYPE.CUSTOMER ? 'Sales Order' : 'Purchase Order'})`;
            vm.LabelConstant = CORE.LabelConstant;
            vm.SaveType = USER.purchaseInpectionSaveType;
            vm.gridMfgComment = vm.customerType === CORE.CUSTOMER_TYPE.CUSTOMER ? CORE.gridConfig.gridCustomerComment : CORE.gridConfig.gridSupplierComment;
            vm.loginUser = BaseService.loginUser;
            const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
            vm.StatusOptionsGridHeaderDropdown = CORE.StatusOptionsGridHeaderDropdown;

            vm.PartRequirementTypeOptionsGridHeaderDropdown = CORE.PartRequirementTypeOptionsGridHeaderDropdown;

            vm.EmptyMesssage = angular.copy(USER.ADMIN_EMPTYSTATE.PURCHASE_INSPECTION_REQUIREMENT_EMPTY);
            vm.EmptyMesssage.MESSAGE = stringFormat(vm.EmptyMesssage.MESSAGE, USER.CustomerTabs.Comments.Name);
            vm.EmptyMesssage.ADDNEWMESSAGE = stringFormat(vm.EmptyMesssage.ADDNEWMESSAGE, 'comment');

            const initPageInfo = () => {
                vm.pagingInfo = {
                    Page: CORE.UIGrid.Page(),
                    pageSize: CORE.UIGrid.ItemsPerPage(),
                    //SortColumns: [['createdAt', 'DESC']],
                    SearchColumns: [],
                    MFGId: vm.customerID
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
                enableFiltering: true,
                exporterMenuCsv: true,
                exporterCsvFilename: `comments_${vm.customerName}` + '.csv',
                isAdd: true,
                CurrentPage: vm.customerName + 'Comments',
                allowToExportAllData: true,
                exporterAllDataFn: () => {
                    const pagingInfoOld = _.clone(vm.pagingInfo);
                    pagingInfoOld.pageSize = 0;
                    pagingInfoOld.isExport = true;
                    return CustomerFactory.getAllCustomerComment().query(pagingInfoOld).$promise.then((response) => {
                        if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data && response.data.CustomerCommentList) {
                            setDataAfterGetAPICall(response, false);
                            return response.data.CustomerCommentList;
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

                    ColumnDataType: 'StringEquals',
                    width: 120
                },
                {
                    field: 'partRequirementCategoryName',
                    displayName: 'Category',
                    cellTemplate: '<div class="ui-grid-cell-contents"><a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToManageGenericCategoryPartRequirementCategory(row.entity.gencCategoryID);">{{COL_FIELD}}</a></div>',
                    width: 210
                },
                {
                    field: 'requirement',
                    displayName: 'Comment',
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
                    enableCellEdit: false
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

            vm.sourceHeader.unshift(
                {
                    field: 'Apply',
                    headerCellTemplate: '<md-checkbox class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox" ng-model="grid.appScope.$parent.vm.Apply" \
                            ng-change="grid.appScope.$parent.vm.applyAll(grid.appScope.$parent.vm.Apply)"></md-checkbox>',
                    width: '75',
                    cellTemplate: '<div class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox" style="overflow:initial"><md-checkbox  ng-disabled="false"  ng-model="row.entity.isRecordSelectedForRemove" \
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

            // to set data in grid after data is retrieved from API in loadData() and getDataDown() function
            const setDataAfterGetAPICall = (CustomerCommentList, isGetDataDown) => {
                if (CustomerCommentList && CustomerCommentList.data && CustomerCommentList.data.CustomerCommentList) {
                    if (!isGetDataDown) {
                        vm.sourceData = CustomerCommentList.data.CustomerCommentList;
                        vm.currentdata = vm.sourceData.length;
                    }
                    else if (CustomerCommentList.data.CustomerCommentList.length > 0) {
                        vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(CustomerCommentList.data.CustomerCommentList);
                        vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
                    }
                    // must set after new data comes
                    vm.totalSourceDataCount = CustomerCommentList.data.Count;
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
                                    vm.gridOptions.gridApi.grid.options.isAdd = true;
                                }
                                //if (vm.gridOptions.gridApi.grid.gridMenuScope) {
                                //  vm.gridOptions.gridApi.grid.gridMenuScope.showFilters = false;
                                //}
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
                /*if (vm.pagingInfo.SortColumns.length === 0) {
                  vm.pagingInfo.SortColumns = [['createdAt', 'DESC']];
                }*/

                vm.pagingInfo.MFGId = vm.customerID;
                vm.cgBusyLoading = CustomerFactory.getAllCustomerComment().query(vm.pagingInfo).$promise.then((CustomerCommentList) => {
                    if (CustomerCommentList && CustomerCommentList.data) {
                        $scope.$emit('customerCommentCount');
                        setDataAfterGetAPICall(CustomerCommentList, false);
                    }
                }).catch((error) => BaseService.getErrorLog(error));
            };

            vm.getDataDown = () => {
                vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
                vm.cgBusyLoading = CustomerFactory.getAllCustomerComment().query(vm.pagingInfo).$promise.then((CustomerCommentList) => {
                    if (CustomerCommentList && CustomerCommentList.data) {
                        setDataAfterGetAPICall(CustomerCommentList, true);
                    }
                }).catch((error) => BaseService.getErrorLog(error));
            };

            vm.refreshCustomerComment = () => vm.loadData();

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
                    messageContent.message = stringFormat(messageContent.message, 'comment', selectedIDs.length);

                    const obj = {
                        messageContent: messageContent,
                        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                    };
                    const objIDs = {
                        id: selectedIDs,
                        CountList: false,
                        customerType: vm.customerType
                    };

                    DialogFactory.messageConfirmDialog(obj).then((resposne) => {
                        if (resposne) {
                            vm.cgBusyLoading = CustomerFactory.deleteCustomerComment().query({ objIDs: objIDs }).$promise.then((data) => {
                                BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                                $scope.$emit('customerCommentCount');
                                vm.gridOptions.clearSelectedRows();
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

            vm.addCustomerComment = () => {
                const data = {
                    mfgCode: vm.customerCode,
                    mfgName: vm.customerName,
                    mfgCodeId: vm.customerID,
                    customerType: vm.customerType,
                    totalCommentCount: vm.sourceData.length
                };
                DialogFactory.dialogService(
                    CORE.COMPONENT_CUSTOMER_COMMENT_DET_MODAL_CONTROLLER,
                    CORE.COMPONENT_CUSTOMER_COMMENT_DET_MODAL_VIEW,
                    null,
                    data).then(() => {
                    }, (response) => {
                        if (response) {
                            $scope.$emit('customerCommentCount');
                            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                        }
                    }, (err) => BaseService.getErrorLog(err));
            };
            const onAddNew = $scope.$on('AddNew', () => vm.addCustomerComment());


            vm.goToManageGenericCategoryPartRequirementCategory = (id) => BaseService.goToManageGenericCategoryPartRequirementCategory(id);

            vm.copyPartRequirement = () => {
                const data = {
                    mfgCodeId: vm.customerID,
                    inspectionList: vm.selectedRowsList,
                    requirmentCategory: vm.requirmentCategory
                };
                DialogFactory.dialogService(
                    CORE.COMPONENET_REQUIREMENT_COPY_POPUP_MODAL_CONTROLLER,
                    CORE.COMPONENET_REQUIREMENT_COPY_POPUP_MODAL_VIEW,
                    null,
                    data).then(() => BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData),
                        () => BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData),
                        (err) => BaseService.getErrorLog(err));
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

            vm.gotoRequirementsMst = () => BaseService.goToPurchaseInspectionRequirement();

            $scope.$on('$destroy', () => {
                onAddNew();
            });
        }
    }
})();
