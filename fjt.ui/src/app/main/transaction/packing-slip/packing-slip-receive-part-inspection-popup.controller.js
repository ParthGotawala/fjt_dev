(function () {
    'use strict';

    angular
        .module('app.core')
        .controller('PackingSlipReceivePartInspectionPopupController', PackingSlipReceivePartInspectionPopupController);

    function PackingSlipReceivePartInspectionPopupController($scope, $mdDialog, DialogFactory, CORE, USER, data, BaseService, $timeout, TRANSACTION, PackingSlipFactory) {
        const vm = this;
        vm.LabelConstant = CORE.LabelConstant;
        vm.MaterialInvoiceStatus = CORE.MaterialInvoiceStatus;
        vm.gridPackingSlipReceivePartInspectionDetail = CORE.gridConfig.gridPackingSlipReceivePartInspectionDetail;
        vm.packingSlipDetail = data && data.lineDetail ? data.lineDetail : {};
        vm.packingSlipDisable = data && data.packingSlipDisable ? data.packingSlipDisable : false;
        vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.PSRECEVIEDPARTINSTRUCTIONDETAIL;
        vm.isHideDelete = true;
        vm.packingSlipInspectionStatus = TRANSACTION.PackingSlipInspectionStatus;
        vm.headerdata = [];
        vm.isdirty = false;
        vm.loginUser = BaseService.loginUser;
        const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;
        vm.receivedStatus = null;

        vm.changeValue = () => {
            vm.isdirty = true;
            BaseService.currentPageFlagForm = [vm.isdirty];
        };

        vm.goToPartList = () => {
            BaseService.goToPartList();
            return false;
        };

        vm.goToPartDetails = (data) => {
            BaseService.goToComponentDetailTab(null, data.partID);
            return false;
        };

        vm.goToSupplierPartList = () => {
            BaseService.goToSupplierPartList();
            return false;
        };

        vm.goToSupplierPartDetails = (data) => {
            BaseService.goToSupplierPartDetails(data.partID);
            return false;
        };

        vm.headerdata.push(
            {
                label: vm.LabelConstant.PACKING_SLIP.PackingSlipLine,
                value: vm.packingSlipDetail.packingSlipSerialNumber,
                displayOrder: 1
            },
            {
                label: vm.LabelConstant.MFG.MFGPN,
                value: vm.packingSlipDetail.mfgPN,
                displayOrder: 2,
                labelLinkFn: vm.goToPartList,
                valueLinkFn: vm.goToPartDetails,
                valueLinkFnParams: { partID: vm.packingSlipDetail.partID },
                isCopy: true,
                isCopyAheadLabel: false,
                imgParms: {
                    imgPath: stringFormat(CORE.RoHSImageFormat, _configWebUrl, USER.ROHS_BASE_PATH, vm.packingSlipDetail.rohsIcon),
                    imgDetail: vm.packingSlipDetail.rohsName
                }
            },
            {
                label: vm.LabelConstant.MFG.SupplierPN,
                value: vm.packingSlipDetail.supplierPN,
                displayOrder: 3,
                labelLinkFn: vm.goToSupplierPartList,
                valueLinkFn: vm.goToSupplierPartDetails,
                valueLinkFnParams: { partID: vm.packingSlipDetail.supplierMFGPNID },
                isCopy: true,
                isCopyAheadLabel: false,
                imgParms: {
                    imgPath: stringFormat(CORE.RoHSImageFormat, _configWebUrl, USER.ROHS_BASE_PATH, vm.packingSlipDetail.supplierRohsIcon),
                    imgDetail: vm.packingSlipDetail.supplierRohsName
                }
            }
        );

        const initPageInfo = () => {
            vm.pagingInfo = {
                page: CORE.UIGrid.Page(),
                pageSize: CORE.UIGrid.ItemsPerPage(),
                SortColumns: [['id', 'DESC']],
                SearchColumns: [],
                lineId: vm.packingSlipDetail.id
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
            multiSelect: false,
            filterOptions: vm.pagingInfo.SearchColumns,
            enableCellEdit: true,
            enableCellEditOnFocus: true,
            exporterMenuCsv: true,
            allowToExportAllData: true,
            exporterCsvFilename: 'Packing Slip Material Receive Part Instruction Detail.csv',
            exporterAllDataFn: () => {
                const pagingInfoOld = _.clone(vm.pagingInfo);
                pagingInfoOld.pageSize = 0;
                pagingInfoOld.Page = 1;
                vm.gridOptions.isExport = pagingInfoOld.isExport = true;
                return PackingSlipFactory.getPackingSlipMaterialReceivePartInspectionDetail().query(pagingInfoOld).$promise.then((response) => {
                    if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                        if (response && response.data && response.data.PackingSlipMaterialReceivePartInspectionList) {
                            setDataAfterGetAPICall(response, false);
                            return response.data.PackingSlipMaterialReceivePartInspectionList;
                        }
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
                cellEditableCondition: false,
                maxWidth: '80'
            },
            {
                field: 'instruction',
                displayName: vm.LabelConstant.PURCHASE_INSPECTION_REQUIREMENT.PurchaseRequirement,
                cellTemplate: '<div class="ui-grid-cell-contents text-left cm-white-space-normal">{{COL_FIELD}}</div>',
                cellEditableCondition: false,
                width: '500'
            },
            {
                field: 'inspectionStatusValue',
                displayName: 'Status',
                cellTemplate: '<div class="cm-supplier-stock" style="height:100% !important;width:100% !important" >' +
                    '<form name="inputForm" flex="100" layout="row" style="height:100% !important;width:100% !important">' +
                    '<md-radio-group layout="row" ng-model="row.entity.inspectionStatus" name="inspectionStatusGroup" ng-change="grid.appScope.$parent.vm.changeValue()" ng-disabled = "grid.appScope.$parent.vm.packingSlipDisable">' +
                    '<md-radio-button name="inspectionStatus" ng-repeat="item in grid.appScope.$parent.vm.packingSlipInspectionStatus" ng-value="item.value" class="md-primary margin-right-10">{{item.key}}</md-radio-button>' +
                    '</md-radio-group>' +
                    '</form>' +
                    '</div>',
                cellEditableCondition: false,
                allowCellFocus: true,
                width: '450'
            },
            {
                field: 'remark',
                headerCellTemplate: '<div class="ui-grid-cell-contents">Comment&nbsp;(Double Click in the space to edit)' +
                    '<md-icon class="icon-question-mark-circle help-icon">' +
                    '<md-tooltip md-direction="top">Comment is required when status is <b>Reject</b> or <b>Accepted with Deviation</b>.</md-tooltip>' +
                    '</md-icon>' +
                    '<span style="color:red">&nbsp;*</span>' +
                    '</div>',
                cellTemplate: '<div class="ui-grid-cell-contents cm-white-space-normal" ng-class="{\'invalid\':grid.validate.isInvalid(row.entity, col.colDef) && (row.entity.inspectionStatus === grid.appScope.$parent.vm.packingSlipInspectionStatus[3].value || row.entity.inspectionStatus === grid.appScope.$parent.vm.packingSlipInspectionStatus[2].value), \'height-25\': grid.validate.isInvalid(row.entity, col.colDef) && (row.entity.inspectionStatus === grid.appScope.$parent.vm.packingSlipInspectionStatus[3].value || row.entity.inspectionStatus === grid.appScope.$parent.vm.packingSlipInspectionStatus[2].value) }" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}" ng-disabled="false" style="padding:0px !important;">{{COL_FIELD}}</div>',
                cellEditableCondition: !vm.packingSlipDisable,
                allowCellFocus: true,
                width: '500',
                validators: { required: true },
                cellClass: function (grid, row) {
                    return 'cm-ps-part-inspection-remark-main';
                }
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
                enableFiltering: true
            }, {
                field: 'createdbyRole',
                displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
                type: 'StringEquals',
                enableFiltering: true
            }];

        function setDataAfterGetAPICall(inspectionResponse, isGetDataDown) {
            if (inspectionResponse && inspectionResponse.data.PackingSlipMaterialReceivePartInspectionList) {
                if (!isGetDataDown) {
                    vm.sourceData = inspectionResponse.data.PackingSlipMaterialReceivePartInspectionList;
                    vm.currentdata = vm.sourceData.length;
                }
                else if (inspectionResponse.data.PackingSlipMaterialReceivePartInspectionList.length > 0) {
                    vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(inspectionResponse.data.PackingSlipMaterialReceivePartInspectionList);
                    vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
                }
                // must set after new data comes
                vm.totalSourceDataCount = inspectionResponse.data.Count;
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
                cellEdit();
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

        vm.loadData = () => {
            BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
            vm.cgBusyLoading = PackingSlipFactory.getPackingSlipMaterialReceivePartInspectionDetail().query(vm.pagingInfo).$promise.then((inspectionResponse) => {
                if (inspectionResponse.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                    setDataAfterGetAPICall(inspectionResponse, false);
                }
            }).catch((error) => BaseService.getErrorLog(error));
        };

        vm.getDataDown = () => {
            vm.pagingInfo.page = vm.pagingInfo.page + 1;
            vm.cgBusyLoading = PackingSlipFactory.getPackingSlipMaterialReceivePartInspectionDetail().query(vm.pagingInfo).$promise.then((inspectionResponse) => {
                setDataAfterGetAPICall(inspectionResponse, true);
            }).catch((error) => BaseService.getErrorLog(error));
        };

        const cellEdit = () => {
            vm.gridOptions.gridApi.edit.on.afterCellEdit($scope, (rowEntity, colDef, newvalue) => {
                if (colDef && colDef.displayName === 'Remark') {
                    if (newvalue) {
                        if (newvalue.length > 255) {
                            rowEntity.isSaveDisable = true;

                            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.REMARK_MAX_LENGTH);
                            messageContent.message = stringFormat(messageContent.message, '255');

                            const model = {
                                messageContent: messageContent,
                                multiple: true
                            };
                            DialogFactory.messageAlertDialog(model).then(() => {
                                rowEntity.isSaveDisable = true;
                                rowEntity.remark = null;
                                $timeout(() => {
                                    const index = vm.sourceData.indexOf(rowEntity);
                                    vm.gridOptions.gridApi.cellNav.scrollToFocus(vm.sourceData[index ? index : 0], vm.sourceHeader[3]);
                                });
                            });
                        }
                        else {
                            vm.changeValue();
                            rowEntity.isSaveDisable = false;
                        }
                    }
                }
                vm.isDisableSaveButton = _.some(vm.sourceData, (data) => data.isSaveDisable === true);
            });
        };

        vm.updateMaterialReceivePartInstructionStatus = () => {
            if (vm.packingSlipDisable || vm.isDisableSaveButton || (vm.packingSlipDetail && (vm.packingSlipDetail.TotalUMIDCount > 0 || (vm.packingSlipDetail.invoiceStatus && vm.packingSlipDetail.invoiceStatus !== vm.MaterialInvoiceStatus.Pending)))) {
                return;
            }
            const objRequireRemark = _.find(vm.sourceData, (data) => (data.inspectionStatus === vm.packingSlipInspectionStatus[3].value || data.inspectionStatus === vm.packingSlipInspectionStatus[2].value) && !data.remark);
            if (objRequireRemark) {
                const index = _.indexOf(vm.sourceData, objRequireRemark);
                if (index !== -1) {
                    const indexOfRemark = _.indexOf(vm.sourceHeader, _.find(vm.sourceHeader, (data) => data.field === TRANSACTION.PSReceivedPartInspectionColumn.Remark) || {});
                    if (indexOfRemark !== -1) {
                        vm.gridOptions.gridApi.cellNav.scrollToFocus(vm.sourceData[index], vm.sourceHeader[indexOfRemark]);
                        vm.gridOptions.gridApi.grid.validate.setInvalid(vm.sourceData[index], vm.sourceHeader[indexOfRemark]);
                    }
                }
                return;
            }

            if (BaseService.focusRequiredField(vm.formPackingSlipPartInspection)) {
                return;
            }

            const findReject = _.find(vm.sourceData, data => data.inspectionStatus === vm.packingSlipInspectionStatus[2].value);
            if (findReject) {
                vm.receivedStatus = vm.packingSlipInspectionStatus[2].value;
                vm.receivedStatusName = vm.packingSlipInspectionStatus[2].key;
            } else {
                const findPending = _.find(vm.sourceData, data => data.inspectionStatus === vm.packingSlipInspectionStatus[0].value);
                if (findPending) {
                    vm.receivedStatus = vm.packingSlipInspectionStatus[0].value;
                    vm.receivedStatusName = vm.packingSlipInspectionStatus[0].key;
                } else {
                    const findAcceptWithDeviation = _.find(vm.sourceData, data => data.inspectionStatus === vm.packingSlipInspectionStatus[3].value);
                    if (findAcceptWithDeviation) {
                        vm.receivedStatus = vm.packingSlipInspectionStatus[3].value;
                        vm.receivedStatusName = vm.packingSlipInspectionStatus[3].key;
                    } else {
                        vm.receivedStatus = vm.packingSlipInspectionStatus[1].value;
                        vm.receivedStatusName = vm.packingSlipInspectionStatus[1].key;
                    }
                }
            }

            if (vm.packingSlipDetail && vm.packingSlipDetail.binID && vm.packingSlipDetail.packagingID && vm.packingSlipDetail.partID && vm.packingSlipDetail.refPackingSlipMaterialRecID && vm.receivedStatus !== vm.packingSlipInspectionStatus[0].value) {
                vm.checkduplicateBinValidation();
            } else {
                vm.savePartInstructionDetails();
            }

        };

        vm.checkduplicateBinValidation = () => {
            vm.cgBusyLoading = PackingSlipFactory.checkSameBinAndDifferentStatus().query({
                partID: vm.packingSlipDetail.partID,
                refPackingSlipMaterialRecID: vm.packingSlipDetail.refPackingSlipMaterialRecID,
                binID: vm.packingSlipDetail.binID,
                packagingID: vm.packingSlipDetail.packagingID,
                id: vm.packingSlipDetail.id || null,
                receivedStatus: vm.receivedStatus || null
            }).$promise.then((response) => {
                if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                    if (response.data && response.data.length > 0) {
                        const newReceivedStatusName = vm.receivedStatus === vm.packingSlipInspectionStatus[2].value ? `${vm.packingSlipInspectionStatus[1].key} / ${vm.packingSlipInspectionStatus[3].key}` : vm.packingSlipInspectionStatus[2].key;
                        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.BIN_CONTAIN_SAME_PART_WITH_SAME_STATUS);
                        messageContent.message = stringFormat(messageContent.message, vm.receivedStatusName, redirectToPartDetail(vm.packingSlipDetail.partID, vm.packingSlipDetail.PIDCode), newReceivedStatusName, vm.packingSlipDetail.bin);
                        const data = {
                            messageContent,
                            lineDetails: vm.packingSlipDetail
                        };
                        return DialogFactory.dialogService(
                            TRANSACTION.DUPLICATE_BIN_WITH_DIFFERENT_RECEIVED_STATUS_CONTROLLER,
                            TRANSACTION.DUPLICATE_BIN_WITH_DIFFERENT_RECEIVED_STATUS_VIEW,
                            null,
                            data).then((response) => {
                                if (response && response.binID) {
                                    vm.packingSlipDetail.binID = response.binID;
                                    vm.packingSlipDetail.bin = response.bin;
                                    vm.packingSlipDetail.warehouseID = response.warehouseID;
                                    vm.packingSlipDetail.warehouse = response.warehouse;
                                    vm.packingSlipDetail.parentWarehouseID = response.parentWarehouseID;
                                    vm.packingSlipDetail.parentWarehouse = response.parentWarehouse;
                                    vm.checkduplicateBinValidation();
                                }
                            }, () => { });
                    } else {
                        vm.savePartInstructionDetails();
                    }
                }
            }).catch((error) => BaseService.getErrorLog(error));
        }

        vm.savePartInstructionDetails = () => {
            const lineComment = _.map(_.filter(vm.sourceData, (data) => (data.inspectionStatus === vm.packingSlipInspectionStatus[3].value || data.inspectionStatus === vm.packingSlipInspectionStatus[2].value) && data.remark), 'remark').join(' \n ');
            vm.cgBusyLoading = PackingSlipFactory.updateMaterialReceivePartInstructionStatus().query({
                lineId: vm.packingSlipDetail.id,
                refPackingSlipNumberForInvoice: vm.packingSlipDetail.refPackingSlipNumberForInvoice,
                instructionList: vm.sourceData,
                lineComments: lineComment || null,
                isPOCanceled: vm.packingSlipDetail.isPOCanceled,
                receivedStatus: vm.receivedStatus
            }).$promise.then((instruction) => {
                if (instruction && instruction.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                    BaseService.currentPageFlagForm = [];
                    $mdDialog.hide(vm.receivedStatus);
                }
            }).catch((error) => BaseService.getErrorLog(error));
        }

        vm.checkFormDirty = (form, columnName) => BaseService.checkFormDirty(form, columnName);

        vm.cancel = () => {
            if (vm.isdirty) {
                BaseService.showWithoutSavingAlertForPopUp();
            } else {
                vm.formPackingSlipPartInspection.$setPristine();
                BaseService.currentPageFlagForm = [];
                $mdDialog.cancel();
            }
        };

        vm.viewPurchaseRequirementList = () => {
            if (vm.isNoDataFound) {
                return;
            }
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

        const redirectToPartDetail = (pId, pMfrPN) => {
            const redirectToPartUrl = WebsiteBaseUrl + CORE.URL_PREFIX + USER.ADMIN_COMPONENT_ROUTE + USER.ADMIN_MANAGECOMPONENT_ROUTE + USER.ADMIN_MANAGECOMPONENT_DETAIL_TAB_ROUTE.replace(':mfgType', CORE.MFG_TYPE.MFG.toLowerCase()).replace(':coid', pId);
            return stringFormat('<a href=\'{0}\' target=\'_blank\' tabindex=\'-1\' class=\'underline\'>{1}</a>', redirectToPartUrl, pMfrPN);
        };

      angular.element(() => {
        BaseService.currentPageFlagForm = [vm.isdirty];
      });
    }
})();
