(function () {
    'use strict';

    angular
        .module('app.admin.purchaseincominginspectionreq')
        .controller('PurchaseInspectionTemplateController', PurchaseInspectionTemplateController);

    /** @ngInject */
    function PurchaseInspectionTemplateController($mdDialog, $scope, $timeout, CORE, USER, PurchaseInspectionRequirementFactory, DialogFactory, BaseService, OPERATION) {
        const vm = this;
        vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.PURCHASE_INSPECTION_REQUIREMENT_TEMPLATE;
        vm.gridConfig = CORE.gridConfig;
        vm.isDisabledDelete = false;
        vm.isUpdatable = vm.isCopyTemplate = true;
        vm.LabelConstant = CORE.LabelConstant;
        vm.loginUser = BaseService.loginUser;
        const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;

        vm.sourceHeader = [
            {
                field: 'Action',
                cellClass: 'gridCellColor',
                displayName: 'Action',
                width: '100',
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
                enableSorting: false,
                maxWidth: '80'
            }, {
                field: 'name',
                displayName: 'Name',
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                width: '450'
            }, {
                field: 'requirement',
                displayName: vm.LabelConstant.PURCHASE_INSPECTION_REQUIREMENT.PurchaseRequirement,
                cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" ng-repeat="item in row.entity.requirementList track by $index">\
                      <div layout="row" class="cm-custom-chips" >\
                       <span class="mr-5 pt-2">{{ item.requirement }} </span>\
                       <md-chips ng-if="item.requirmentType">\
                           <md-chip>{{ item.requirmentType }}</md-chip>\
                        </md-chips>\
                      </div>\
                    </div> ',
                width: '800'
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
                cellTemplate: '<div class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox" style="overflow:initial"><md-checkbox  ng-disabled="row.entity.isDisabledDelete"  ng-model="row.entity.isRecordSelectedForRemove" \
                            ng-change="grid.appScope.$parent.vm.setTemplateRemove(row.entity)"></md-checkbox></div>',
                enableFiltering: false,
                enableSorting: false,
                exporterSuppressExport: true,
                pinnedLeft: false,
                allowCellFocus: false,
                maxWidth: '80',
                enableColumnMoving: false,
                manualAddedCheckbox: true
            });

        const initPageInfo = () => {
            vm.pagingInfo = {
                Page: CORE.UIGrid.Page(),
                SortColumns: [['name', 'ASC']],
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
            exporterCsvFilename: vm.LabelConstant.PURCHASE_INSPECTION_REQUIREMENT.PurchaseRequirement + ' Template.csv',
            CurrentPage: CORE.PAGENAME_CONSTANT[32].PageName,
            allowToExportAllData: true,
            exporterAllDataFn: () => {
                const pagingInfoOld = _.clone(vm.pagingInfo);
                pagingInfoOld.pageSize = 0;
                pagingInfoOld.isExport = true;
                return PurchaseInspectionRequirementFactory.getPurchaseInspTemplateList().query(pagingInfoOld).$promise.then((response) => {
                    if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data && response.data.TemplateCategory) {
                        setDataAfterGetAPICall(response, false);
                        return response.data.TemplateCategory;
                    }
                }).catch((error) => BaseService.getErrorLog(error));
            }
        };

        function setDataAfterGetAPICall(inspectionType, isGetDataDown) {
            if (inspectionType && inspectionType.data.TemplateCategory) {
                bindData(inspectionType.data.TemplateCategory);
                if (!isGetDataDown) {
                    vm.sourceData = inspectionType.data.TemplateCategory;
                    vm.currentdata = vm.sourceData.length;
                }
                else if (inspectionType.data.TemplateCategory.length > 0) {
                    vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(inspectionType.data.TemplateCategory);
                    vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
                }
                // must set after new data comes
                vm.totalSourceDataCount = inspectionType.data.Count;
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
            BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
            vm.cgBusyLoading = PurchaseInspectionRequirementFactory.getPurchaseInspTemplateList().query(vm.pagingInfo).$promise.then((inspectionType) => {
                if (inspectionType.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                    setDataAfterGetAPICall(inspectionType, false);
                }
            }).catch((error) => BaseService.getErrorLog(error));
        };

        /* load more data on mouse scroll */
        vm.getDataDown = () => {
            vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
            vm.cgBusyLoading = PurchaseInspectionRequirementFactory.getPurchaseInspTemplateList().query(vm.pagingInfo).$promise.then((inspectionType) => {
                if (inspectionType) {
                    setDataAfterGetAPICall(inspectionType, true);
                }
            }).catch((error) => BaseService.getErrorLog(error));
        };

        //bind data
        const bindData = (requirementDetails) => {
            var requirmentType = '';
            var manageCSVRequirementList = [];
            var split;
            _.each(requirementDetails, (item) => {
                vm.requirementList = [];
                manageCSVRequirementList = [];
                split = item.requirement ? item.requirement.split('#$#') : null;
                _.each(split, (reqitem) => {
                    var RequirementList = reqitem ? reqitem.split('$#$') : null;
                    var requirementName = RequirementList.length > 0 ? RequirementList[1] : null;
                    var inspectionDetailId = RequirementList.length > 0 ? RequirementList[0] : null;
                    requirmentType = '';
                    if (requirementName && requirementName.length > 0) {
                        const dataList = requirementName.split('###');
                        requirementName = dataList.length > 0 ? dataList[0] : null;
                        requirmentType = dataList.length > 0 ? dataList[1] : null;
                    }
                    vm.requirementList.push({
                        inspectionDetailId: inspectionDetailId,
                        requirement: requirementName,
                        requirmentType: requirmentType
                    });
                    manageCSVRequirementList.push(requirementName);
                    item.requirementList = vm.requirementList ? vm.requirementList : null;
                    item.requirement = manageCSVRequirementList ? manageCSVRequirementList.join(',') : null;
                });
            });
        };

        // delete purchase inspection requirement
        vm.deleteRecord = (templatecategory) => {
            let selectedIDs = [];
            if (templatecategory) {
                selectedIDs.push(templatecategory.id);
            } else {
                vm.selectedRows = vm.selectedRowsList;
                if (vm.selectedRows.length > 0) {
                    selectedIDs = vm.selectedRows.map((templateCategoryItem) => templateCategoryItem.id);
                }
            }
            if (selectedIDs) {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
                messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.PURCHASE_INSPECTION_REQUIREMENT.PurchaseRequirement + ' template', selectedIDs.length);
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
                        vm.cgBusyLoading = PurchaseInspectionRequirementFactory.deletePurchaseRequirementTemplate().query({ objIDs: objIDs }).$promise.then((response) => {
                            if (response && response.data && (response.data.length > 0 || response.data.transactionDetails)) {
                                const data = {
                                    TotalCount: response.data.transactionDetails[0].TotalCount,
                                    pageName: CORE.PageName.purchaseInspectionRequirement
                                };
                                BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                                    const IDs = {
                                        id: selectedIDs,
                                        CountList: true
                                    };
                                    return PurchaseInspectionRequirementFactory.deletePurchaseRequirement().query({
                                        objIDs: IDs
                                    }).$promise.then((res) => {
                                        const data = res.data || {};
                                        data.pageTitle = templatecategory ? templatecategory.name : null;
                                        data.PageName = CORE.PageName.purchaseInspectionRequirement;
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
                            }
                        }).catch((error) => BaseService.getErrorLog(error));
                    }
                }, () => {
                }).catch((error) => BaseService.getErrorLog(error));
            }
            else {
                //show validation message no data selected
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
                messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.PURCHASE_INSPECTION_REQUIREMENT.PurchaseRequirement + ' template');
                const alertModel = {
                    messageContent: messageContent,
                    multiple: true
                };
                DialogFactory.messageAlertDialog(alertModel);
            }
        };

        //open popup for add edit new purchase requirement
        vm.addEditRecord = (data, ev) => {
            DialogFactory.dialogService(
                CORE.MANAGE_PURCHASE_INSPECTION_REQUIREMENT_TEMPLATE_MODAL_CONTROLLER,
                CORE.MANAGE_PURCHASE_INSPECTION_REQUIREMENT_TEMPLATE_MODAL_VIEW,
                ev,
                data).then(() => {
                }, (data) => {
                    if (data) {
                        BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                    }
                }, (error) => BaseService.getErrorLog(error));
        };

        /* Update Purchase Requirement Template */
        vm.updateRecord = (row, ev) => vm.addEditRecord(row.entity, ev);

        /* delete multiple data called from directive of ui-grid*/
        vm.deleteMultipleData = () => vm.deleteRecord();

        //apply all details
        vm.applyAll = (applyAll) => {
            if (applyAll) {
                _.map(vm.sourceData, selectTemplate);
            } else {
                _.map(vm.sourceData, unselectTemplate);
            }
        };
        const selectTemplate = (row) => {
            row.isRecordSelectedForRemove = row.isDisabledDelete ? false : true;
            if (row.isRecordSelectedForRemove) {
                vm.gridOptions.gridApi.selection.selectRow(row);
            }
        };
        const unselectTemplate = (row) => {
            row.isRecordSelectedForRemove = false;
            vm.gridOptions.clearSelectedRows();
        };
        vm.setTemplateRemove = (row) => {
            var totalItem = _.filter(vm.sourceData, (data) => !data.isDisabledDelete);
            var selectItem = _.filter(vm.sourceData, (data) => data.isRecordSelectedForRemove === true);
            if (row.isRecordSelectedForRemove) {
                vm.gridOptions.gridApi.selection.selectRow(row);
            } else {
                vm.gridOptions.gridApi.selection.unSelectRow(row);
            }
            vm.Apply = totalItem.length === selectItem.length;
        };

        vm.copyMasterTemplate = (row, event) => {
            DialogFactory.dialogService(
                USER.COPY_PURCHASE_INSPECTION_TEMPLATE_MODAL_CONTROLLER,
                USER.COPY_PURCHASE_INSPECTION_TEMPLATE_MODAL_VIEW,
                event,
                row).then((response) => {
                    if (response) {
                        BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                    }
                }, () => {
                }, (err) => BaseService.getErrorLog(err));
        };

        //Redirect to requirement & comments
        vm.goToPurchaseInspectionRequirement = () => BaseService.goToPurchaseInspectionRequirement();
        //close popup on page destroy
        $scope.$on('$destroy', () => $mdDialog.hide(false, { closeAll: true }));
    }
})();
