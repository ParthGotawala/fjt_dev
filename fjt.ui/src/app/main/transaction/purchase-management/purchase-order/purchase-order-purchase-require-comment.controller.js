(function () {
    'use strict';

    angular
        .module('app.core')
        .controller('PurchaseOrderPurchasePartRequirementPopupController', PurchaseOrderPurchasePartRequirementPopupController);

    function PurchaseOrderPurchasePartRequirementPopupController($mdDialog, CORE, USER, $scope, data, BaseService, $timeout, TRANSACTION, PurchaseOrderFactory, $filter, ComponentFactory, DialogFactory) {
        const vm = this;
        vm.LabelConstant = CORE.LabelConstant;
        vm.gridPurchaseOrderPurchasePartRequirementDetail = CORE.gridConfig.gridPurchaseOrderPurchasePartRequirementDetail;
        vm.purchaseOrderDetail = data || {};
        vm.isHideDelete = vm.purchaseOrderDetail.isView ? true : false;
        vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.POPURCHASEPARTREQUIREMENTNDETAIL;
        vm.headerdata = vm.sourceData = vm.sourceActualData = [];
        vm.loginUser = BaseService.loginUser;
        const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;
        let actualData = [];
        vm.ispoPartRequirement = true;
        const defaultRole = _.find(vm.loginUser.roles, (role) => role.id === vm.loginUser.defaultLoginRoleID);
        //get purchase requirement list page
        const getPurchaseInstructionData = () => {
            vm.cgBusyLoading = PurchaseOrderFactory.getPurchaseOrderMaterialPurchasePartRequirementDetail().query(vm.pagingInfo).$promise.then((requirementResponse) => {
                if (requirementResponse.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                    vm.sourceData = requirementResponse.data.PurchaseOrderMaterialPurchasePartRequirementList.concat(vm.sourceData);
                    vm.sourceActualData = angular.copy(vm.sourceData);
                    actualData = angular.copy(vm.sourceActualData);
                    vm.isshowDetail = true;
                }
            }).catch((error) => BaseService.getErrorLog(error));
        };

        vm.goToPartList = () => BaseService.goToPartList();
        vm.goToPartDetails = (data) => BaseService.goToComponentDetailTab(null, data.partID);
        vm.goToSupplierPartList = () => BaseService.goToSupplierPartList();
        vm.goToSupplierPartDetails = (data) => BaseService.goToSupplierPartDetails(data.partID);
        vm.goToSupplierPOList = () => BaseService.goToPurchaseOrderList();
        vm.goToSupplierPODetail = (data) => BaseService.goToPurchaseOrderDetail(data.poID);

        vm.headerdata.push(
            {
                label: vm.LabelConstant.PURCHASE_ORDER.PO,
                value: vm.purchaseOrderDetail.poNumber,
                displayOrder: 1,
                labelLinkFn: vm.goToSupplierPOList,
                valueLinkFn: vm.goToSupplierPODetail,
                valueLinkFnParams: { poID: vm.purchaseOrderDetail.poID },
                isCopy: true
            },
            {
                label: vm.LabelConstant.MFG.MFGPN,
                value: vm.purchaseOrderDetail.mfgPN,
                displayOrder: 2,
                labelLinkFn: vm.goToPartList,
                valueLinkFn: vm.goToPartDetails,
                valueLinkFnParams: { partID: vm.purchaseOrderDetail.partID },
                isCopy: true,
                isCopyAheadLabel: false,
                imgParms: {
                    imgPath: stringFormat(CORE.RoHSImageFormat, _configWebUrl, USER.ROHS_BASE_PATH, vm.purchaseOrderDetail.rohsIcon),
                    imgDetail: vm.purchaseOrderDetail.rohsName
                }
            },
            {
                label: vm.LabelConstant.MFG.SupplierPN,
                value: vm.purchaseOrderDetail.supplierPN,
                displayOrder: 3,
                labelLinkFn: vm.goToSupplierPartList,
                valueLinkFn: vm.goToSupplierPartDetails,
                valueLinkFnParams: { partID: vm.purchaseOrderDetail.supplierMfgPNID },
                isCopy: true,
                isCopyAheadLabel: false,
                imgParms: {
                    imgPath: stringFormat(CORE.RoHSImageFormat, _configWebUrl, USER.ROHS_BASE_PATH, vm.purchaseOrderDetail.rohsIcon),
                    imgDetail: vm.purchaseOrderDetail.rohsName
                }
            }
        );
        const initPageInfo = () => {
            vm.pagingInfo = {
                page: 0,
                pageSize: CORE.UIGrid.ItemsPerPage(),
                SortColumns: [['id', 'DESC']],
                SearchColumns: [],
                purchaseOrderDetID: vm.purchaseOrderDetail.id,
                pageName: CORE.PAGENAME_CONSTANT[46].PageName
            };
        };

        initPageInfo();

        vm.gridOptions = {
            enablePaging: isEnablePagination,
            enablePaginationControls: isEnablePagination,
            showColumnFooter: false,
            enableRowHeaderSelection: !vm.purchaseOrderDetail.isView,
            enableFullRowSelection: false,
            enableRowSelection: true,
            multiSelect: true,
            filterOptions: vm.pagingInfo.SearchColumns,
            exporterMenuCsv: true,
            allowToExportAllData: true,
            CurrentPage: CORE.PAGENAME_CONSTANT[46].PageName,
            enableCellEdit: vm.purchaseOrderDetail.isDisable ? false : true,
            enableCellEditOnFocus: true,
            exporterCsvFilename: 'Purchase Order Material Purchase ' + vm.LabelConstant.PURCHASE_INSPECTION_REQUIREMENT.PurchaseRequirement + ' Detail.csv',
            isAdd: !vm.purchaseOrderDetail.isView,
            hideAddNew: vm.purchaseOrderDetail.isView,
            exporterAllDataFn: () => {
                const pagingInfoOld = _.clone(vm.pagingInfo);
                pagingInfoOld.pageSize = 0;
                pagingInfoOld.Page = 1;
                vm.gridOptions.isExport = pagingInfoOld.isExport = true;
                return PurchaseOrderFactory.getPurchaseOrderMaterialPurchasePartRequirementDetail().query(pagingInfoOld).$promise.then((response) => {
                    if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                        if (response && response.data && response.data.PurchaseOrderMaterialPurchasePartRequirementList) {
                            vm.loadData();
                            return response.data.PurchaseOrderMaterialPurchasePartRequirementList;
                        }
                    }
                }).catch((error) => BaseService.getErrorLog(error));
            }
        };

        vm.sourceHeader = [
            {
                field: 'Action',
                cellClass: 'layout-align-center-center',
                displayName: 'Action',
                width: '90',
                cellTemplate: '<grid-action-view grid="grid" row="row" number-of-action-button="1"></grid-action-view>',
                enableFiltering: false,
                enableSorting: false,
                exporterSuppressExport: true,
                pinnedLeft: true,
                cellEditableCondition: false
            },
            {
                field: '#',
                width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
                cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
                enableFiltering: false,
                enableSorting: false,
                cellEditableCondition: false,
                allowCellFocus: false
            },
            {
                field: 'instruction',
                // displayName: 'Part Requirement',
                headerCellTemplate: '<div class="ui-grid-cell-contents"><a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToPartRequirement();$event.preventDefault();">' + vm.LabelConstant.PURCHASE_INSPECTION_REQUIREMENT.PurchaseRequirement + '</a>\
                                        <md-tooltip>'+ vm.LabelConstant.PURCHASE_INSPECTION_REQUIREMENT.PurchaseRequirement + '</md-tooltip>\
                                    </div>',
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                cellEditableCondition: false,
                width: '435'
            },
            {
                field: 'updatedAt',
                displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
                type: 'datetime',
                cellEditableCondition: false,
                enableFiltering: false
            },
            {
                field: 'updatedby',
                displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
                type: 'StringEquals',
                cellEditableCondition: false,
                enableFiltering: true
            },
            {
                field: 'updatedbyRole',
                displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
                type: 'StringEquals',
                cellEditableCondition: false,
                enableFiltering: true
            },
            {
                field: 'createdAt',
                displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
                type: 'datetime',
                cellEditableCondition: false,
                enableFiltering: false
            }, {
                field: 'createdby',
                displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
                type: 'StringEquals',
                enableFiltering: true,
                cellEditableCondition: false
            }, {
                field: 'createdbyRole',
                displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
                type: 'StringEquals',
                enableFiltering: true,
                cellEditableCondition: false
            }];
        //source data changes
        vm.sourceData = vm.sourceActualData = vm.purchaseOrderDetail.PORequirementDetail;
        actualData = angular.copy(vm.sourceActualData);
        if (!vm.purchaseOrderDetail.id) {
            vm.isshowDetail = true;
        } else {
            vm.sourceData = _.filter(vm.purchaseOrderDetail.PORequirementDetail, (item) => !item.id);
            vm.sourceActualData = angular.copy(vm.sourceData);
            actualData = angular.copy(vm.sourceActualData);
            getPurchaseInstructionData();
        }

        vm.loadData = () => {
            if (vm.pagingInfo.SearchColumns.length > 0) {
                vm.isNoDataFound = false;
                if (vm.search) {
                    vm.emptyState = null;
                    vm.sourceData = vm.sourceDataCopy ? vm.sourceDataCopy : vm.sourceData;
                }
                if (!vm.search) {
                    vm.sourceDataCopy = _.clone(vm.sourceData);
                }
                vm.search = true;
                _.each(vm.pagingInfo.SearchColumns, (item) => {
                    vm.sourceData = $filter('filter')(vm.sourceData, { [item.ColumnName]: item.SearchString });
                });
                if (vm.sourceData.length === 0) {
                    vm.emptyState = 0;
                }
            }
            else {
                if (!vm.search && vm.sourceData.length === 0) {
                    vm.isNoDataFound = true;
                    vm.emptyState = null;
                }
                else {
                    vm.emptyState = null;
                    vm.isNoDataFound = false;
                    if (vm.search) {
                        vm.sourceData = vm.sourceDataCopy ? vm.sourceDataCopy : vm.sourceData;
                        vm.search = false;
                    }
                }
            }
            vm.totalSourceDataCount = vm.sourceData.length;
            vm.currentdata = vm.totalSourceDataCount;
            _.map(vm.sourceData, (sdata) => {
                sdata.isDisabledDelete = vm.purchaseOrderDetail.isDisable;
                sdata.systemGenerated = vm.purchaseOrderDetail.isDisable;
            });
            $timeout(() => {
                vm.resetSourceGrid();
                if (vm.gridOptions && vm.gridOptions.gridApi) {
                    return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
                }
            }, true);
        };
        vm.gotoPartCommentPage = () => {
            BaseService.goToPartPurchaseInspectionRequirement(vm.purchaseOrderDetail.partID);
        };
        vm.getDataDown = () => {
            vm.pagingInfo.page = vm.pagingInfo.page + 1;
            vm.cgBusyLoading = PurchaseOrderFactory.getPurchaseOrderMaterialPurchasePartRequirementDetail().query(vm.pagingInfo).$promise.then((requirementResponse) => {
                setDataAfterGetAPICall(requirementResponse, true);
            }).catch((error) => BaseService.getErrorLog(error));
        };
        //cancel page
        vm.cancel = () => {
            BaseService.currentPageFlagForm = [];
            const objlist = {
                isDirty: vm.isdirty,
                purchaseRequirement: vm.sourceData
            };
            $mdDialog.cancel(objlist);
        };
        vm.getPurchaseRequirementList = () => {
            vm.cgBusyLoading = ComponentFactory.getPurchaseInspectionRequirementByPartId().query({
                partId: vm.purchaseOrderDetail.partID,
                category: CORE.RequirmentCategory.PurchasingAndIncomingInspectionComments.id
            }).$promise.then((purchaseInspection) => {
                if (purchaseInspection) {
                    vm.PORequirementDetail = _.filter(purchaseInspection.data, (data) => data.inspectionmst && data.inspectionmst.requiementType === 'R');
                    vm.PORequirementDetail = _.map(vm.PORequirementDetail, (requirement) => ({
                        instruction: requirement.inspectionmst.requirement,
                        updatedby: vm.loginUser.employee.initialName,
                        createdby: vm.loginUser.employee.initialName,
                        createdbyRole: defaultRole ? defaultRole.name : null,
                        updatedbyRole: defaultRole ? defaultRole.name : null,
                        createdAt: BaseService.getCurrentDateTimeUI(),// $filter('date')(new Date(), CORE.DateFormatArray[2].format),
                        updatedAt: BaseService.getCurrentDateTimeUI(),
                        id: null
                    }));
                    _.each(vm.PORequirementDetail, (requirement) => {
                        const objInstruction = _.find(vm.sourceData, (item) => item.instruction.toLowerCase() === requirement.instruction.toLowerCase());
                        if (!objInstruction) {
                            vm.sourceData.push(requirement);
                            vm.isdirty = true;
                        }
                    });
                    vm.loadData();
                }
            }).catch((error) => BaseService.getErrorLog(error));
        };
        // delete requirement
        vm.deleteRecord = (purchaseOrder) => {
            let selectedInstructions = [];
            if (purchaseOrder) {
                selectedInstructions.push(purchaseOrder.instruction);
            } else {
                vm.selectedRows = vm.selectedRowsList;
                if (vm.selectedRows.length > 0) {
                    selectedInstructions = vm.selectedRows.map((purchaseOrderItem) => purchaseOrderItem.instruction);
                }
            }
            if (selectedInstructions) {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
                messageContent.message = stringFormat(messageContent.message, 'Purchase Order Material Purchase Requirement', selectedInstructions.length);
                const obj = {
                    messageContent: messageContent,
                    btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                    canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                };
                DialogFactory.messageConfirmDialog(obj).then((resposne) => {
                    if (resposne) {
                        _.each(selectedInstructions, (objinstruction) => {
                            const objData = _.find(vm.sourceData, (item) => item.instruction === objinstruction);
                            if (objData) {
                                const objIndex = vm.sourceData.indexOf(objData);
                                vm.sourceData.splice(objIndex, 1);
                                vm.isdirty = true;
                            }
                        });
                        vm.gridOptions.clearSelectedRows();
                        vm.loadData();
                    }
                }, () => { }).catch((error) => BaseService.getErrorLog(error));
            } else {
                //show validation message no data selected
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
                messageContent.message = stringFormat(messageContent.message, 'Purchase Order Material Purchase Requirement');
                const alertModel = {
                    messageContent: messageContent,
                    multiple: true
                };
                DialogFactory.messageAlertDialog(alertModel);
            }
        };
        /* delete multiple data called from directive of ui-grid*/
        vm.deleteMultipleData = () => {
            vm.deleteRecord();
        };
        //go to part requirement list page
        vm.goToPartRequirement = () => {
            BaseService.goToPurchaseInspectionRequirement();
        };
        //reset details
        vm.resetRequirements = () => {
            vm.isdirty = false;
            vm.sourceData = angular.copy(actualData);
            vm.loadData();
        };
        vm.addPurchaseInspectionRequirement = () => {
            const data = { isrequirementOnly: true };
            DialogFactory.dialogService(
                CORE.MANAGE_PURCHASE_INSPECTION_REQUIREMENT_MODAL_CONTROLLER,
                CORE.MANAGE_PURCHASE_INSPECTION_REQUIREMENT_MODAL_VIEW,
                null,
                data).then(() => {
                }, (response) => {
                    if (response) {
                        const objRquirement = {
                            instruction: response.requirement,
                            updatedby: vm.loginUser.employee.initialName,
                            createdby: vm.loginUser.employee.initialName,
                            createdbyRole: defaultRole ? defaultRole.name : null,
                            updatedbyRole: defaultRole ? defaultRole.name : null,
                            createdAt: BaseService.getCurrentDateTimeUI(),
                            updatedAt: BaseService.getCurrentDateTimeUI(),
                            id: null
                        };
                        vm.sourceData.push(objRquirement);
                        vm.isdirty = true;
                        vm.loadData();
                    }
                }, (err) => BaseService.getErrorLog(err));
        };
        vm.viewPurchaseRequirement = (row, ev) => {
            const obj = {
                title: vm.LabelConstant.PURCHASE_ORDER.PurchaseRequirement,
                description: row.entity.instruction,
                name: row.entity.lineID
            };
            const data = obj;
            data.label = vm.LabelConstant.PURCHASE_ORDER.POLineID;
            openCommonDescriptionPopup(ev, data);
        };
        //open comment popup
        const openCommonDescriptionPopup = (ev, data) => {
            DialogFactory.dialogService(
                CORE.DESCRIPTION_MODAL_CONTROLLER,
                CORE.DESCRIPTION_MODAL_VIEW,
                ev,
                data).then(() => {
                }, (err) => BaseService.getErrorLog(err));
        };
        vm.viewPurchaseRequirementList = () => {
            const data = {
                title: vm.LabelConstant.PURCHASE_INSPECTION_REQUIREMENT.PurchaseRequirement,
                list: _.map(vm.sourceData, 'instruction')
            };
            DialogFactory.dialogService(
                CORE.VIEW_BULLET_POINT_LIST_POPUP_CONTROLLER,
                CORE.VIEW_BULLET_POINT_LIST_POPUP_VIEW,
                null,
                data).then(() => { },
                    () => { },
                    (err) => BaseService.getErrorLog(err));
        };
        $scope.$on('AddNew', () => {
            vm.addPurchaseInspectionRequirement();
        });
        angular.element(() => {
            BaseService.currentPageFlagForm = [vm.isdirty];
            $timeout(() => {
                setFocus('close');
            }, 500);
        });
    }
})();
