(function () {
    'use strict';

    angular
        .module('app.admin.labeltemplates')
        .controller('LabelTemplatesController', LabelTemplatesController);

    /** @ngInject */
    function LabelTemplatesController($mdDialog, $scope, $timeout, $state, $q, CORE, USER, LabelTemplatesFactory, GenericCategoryFactory, DialogFactory, Upload, BaseService, ReceivingMaterialFactory) {
        const vm = this;
        const allowedFileType = 'csv';
        vm.StatusOptionsGridHeaderDropdown = CORE.StatusOptionsGridHeaderDropdown;
        vm.VerificationOptionsGridHeaderDropDown = CORE.VerificationOptionsGridHeaderDropDown;
        vm.DefaultLabelTemplateOptionsGridHeaderDropDown = CORE.DefaultLabelTemplateOptionsGridHeaderDropDown;

        vm.LabelTempName = CORE.PAGENAME_CONSTANT[27].PageName;

        vm.gridConfig = CORE.gridConfig;
        vm.LabelConstant = CORE.LabelConstant;
        vm.loginUser = BaseService.loginUser;
        const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;
        vm.isCellEditIntegrated = false;
        vm.manageLabelTemplates = {};
        vm.isUpdatable = true;
        vm.isVerifyLabelTemplate = true;
        vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
        vm.EmptyMessage = USER.ADMIN_EMPTYSTATE.LABELTEMPLATES;

        vm.dataelementList = CORE.LABELTEMPLATE_DEFAULTLABELTYPE;

        vm.sourceHeader = [
            {
                field: 'Action',
                cellClass: 'gridCellColor',
                displayName: 'Action',
                width: '90',
                cellTemplate: '<grid-action-view grid="grid" row="row"></grid-action-view>',
                enableFiltering: false,
                enableSorting: false,
                exporterSuppressExport: true,
                pinnedLeft: true,
                enableCellEdit: false
            },
            {
                field: '#',
                width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
                cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
                enableSorting: false,
                enableCellEdit: false
            },
            {
                field: 'Name',
                displayName: 'Name',
                width: 250,
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
                field: 'isVerifiedConvertedValue',
                displayName: 'Verified',
                cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
                    + '<span  class="label-box" \
                                            ng-class="{\'label-success\':row.entity.isVerified == true, \
                                            \'label-warning\':row.entity.isVerified == false}"> \
                                                {{ COL_FIELD }}'
                    + '</span>'
                    + '</div>',
                filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
                filter: {
                    term: null,
                    options: vm.VerificationOptionsGridHeaderDropDown
                },
                ColumnDataType: 'StringEquals',
                width: 130,
                enableCellEdit: false
            },
            {
                field: 'defaultLabelTemplate',
                displayName: 'Default Template (Modify below as Required)',
                editableCellTemplate: '<div style="height:100% !important;width:100% !important" ><form name="inputForm" style="height:100% !important;width:100% !important"><select id="ddlDataType_{{grid.renderContainers.body.visibleRowCache.indexOf(row)}}" ng-class=""colt" + col.uid" ui-grid-edit-dropdown ng-model="MODEL_COL_FIELD" ng-options="field[editDropdownIdLabel] as field[editDropdownValueLabel] CUSTOM_FILTERS for field in editDropdownOptionsArray"   style="height:100% !important;width:100% !important" class="form-control"></select></form></div>',
                editDropdownIdLabel: 'name',
                editDropdownValueLabel: 'name',
                editDropdownOptionsArray: vm.dataelementList,
                width: 200,
                enableCellEdit: true,
                filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
                filter: {
                    term: null,
                    options: vm.DefaultLabelTemplateOptionsGridHeaderDropDown
                }
            },
            {
                field: 'verifiedAt',
                displayName: 'Verified Date',
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
                type: 'datetime',
                enableFiltering: false
            },
            {
                field: 'verifiedBy',
                displayName: 'Last Verified By',
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
                type: 'StringEquals',
                enableFiltering: true
            },
            {
                field: 'verifiedByRoleId',
                displayName: 'Last Verified By Role',
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
                type: 'StringEquals',
                enableFiltering: true
            },
            {
                field: 'updatedAt',
                displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
                type: 'datetime',
                enableFiltering: false
            },
            {
                field: 'updatedBy',
                displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
                type: 'StringEquals',
                enableFiltering: true
            },
            {
                field: 'updateByRoleId',
                displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
                type: 'StringEquals',
                enableFiltering: true
            },
            {
                field: 'createdAt',
                displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
                type: 'datetime',
                enableFiltering: false
            },
            {
                field: 'createdBy',
                displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
                type: 'StringEquals',
                enableFiltering: true
            },
            {
                field: 'createByRoleId',
                displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
                type: 'StringEquals',
                enableFiltering: true
            }];

        const initPageInfo = () => {
            vm.pagingInfo = {
                Page: CORE.UIGrid.Page(),
                SortColumns: [],
                SearchColumns: [] /* for default - directly set in sp */
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
            enableCellEdit: false,
            enableCellEditOnFocus: true,
            showVerifyLabelTemplateButton: true,
            exporterCsvFilename: `${vm.LabelTempName}.csv`,
            CurrentPage: vm.LabelTempName
        };

        //Import Label Templates Data
        vm.documentFiles = (file) => {
            if (file.length > 0) {
                let ext = null;
                _.each(file, (item) => {
                    ext = (item.name).substr((item.name).lastIndexOf('.') + 1);
                });

                if (!ext || ext !== allowedFileType) {
                    const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.FILE_TYPE_NOT_ALLOWED);
                    messageContent.message = stringFormat(messageContent.message, allowedFileType);
                    const model = {
                        messageContent: messageContent,
                        multiple: true
                    };
                    DialogFactory.messageAlertDialog(model);
                    return;
                }

                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SURE_TO_IMPORT_GENERICCATEGRY_FILE);
                messageContent.message = stringFormat(messageContent.message, vm.LabelTempName);
                const obj = {
                    messageContent: messageContent,
                    btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                    canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                };

                DialogFactory.messageConfirmDialog(obj).then((yes) => {
                    if (yes) {
                        vm.cgBusyLoading = Upload.upload({
                            url: `${CORE.API_URL}labeltemplates/uploadLabelTemplatesDocuments`,
                            method: 'POST',
                            data: {
                                documents: file,
                                categoryType: vm.LabelTempName
                            }
                        }).progress((evt) => {
                            file.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        }).then((res) => {
                            if (res.data && !res.data.status) {
                                const blob = new Blob([res.data], { type: 'text/csv' });
                                const link = document.createElement('a');
                                if (!link.download) {
                                    const url = URL.createObjectURL(blob);
                                    link.setAttribute('href', url);
                                    link.setAttribute('download', vm.LabelTempName + '.csv');
                                    link.style = 'visibility:hidden';
                                    document.body.appendChild(link);
                                    $timeout(() => {
                                        link.click();
                                        document.body.removeChild(link);
                                    });
                                }
                            }
                            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                            vm.gridOptions.clearSelectedRows();
                        }).catch((error) => BaseService.getErrorLog(error));
                    }
                }).catch((error) => BaseService.getErrorLog(error));
            }
        };

        //Add Record
        vm.addrecord = () => {
            $state.go(USER.ADMIN_MANAGELABELTEMPLATES_STATE, { id: null });
        };

        // Update record
        vm.updateRecord = (row) => {
            $state.go(USER.ADMIN_MANAGELABELTEMPLATES_STATE, {
                id: row ? row.entity.id : null
            });
        };

        //Verify Label Template
        vm.verifyLabelTemplate = (row) => {
            if (row && row.entity && row.entity.id !== 0) {
                verifyLabelTemplateFunction([row.entity], true);
            }
        };

        vm.downloadDocument = () => {
            vm.cgBusyLoading = GenericCategoryFactory.downloadGenericCategoryTemplate(vm.LabelTempName).then((response) => {
                //need to compare with 404,403 like response as from API returning STATE.EMPTY and it's generic category API so not able to chaneg now
                if (response.status === 404) {
                    DialogFactory.messageAlertDialog({ messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_NotFound), multiple: true });
                } else if (response.status === 403) {
                    DialogFactory.messageAlertDialog({ messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_AccessDenied), multiple: true });
                } else if (response.status === 401) {
                    DialogFactory.messageAlertDialog({ messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_Unauthorized), multiple: true });
                } else {
                    const blob = new Blob([response.data], { type: 'text/csv' });
                    if (navigator.msSaveOrOpenBlob) {
                        navigator.msSaveOrOpenBlob(blob, vm.LabelTempName + '.csv');
                    } else {
                        const link = document.createElement('a');
                        if (!link.download) {
                            const url = URL.createObjectURL(blob);
                            link.setAttribute('href', url);
                            link.setAttribute('download', vm.LabelTempName + '.csv');
                            link.style = 'visibility:hidden';
                            document.body.appendChild(link);
                            $timeout(() => {
                                link.click();
                                document.body.removeChild(link);
                            });
                        }
                    }
                }
            }).catch((error) => BaseService.getErrorLog(error));
        };

        function setDataAfterGetAPICall(labeltemplates, isGetDataDown) {
            if (labeltemplates && labeltemplates.data.labeltemplates) {
                if (!isGetDataDown) {
                    vm.sourceData = labeltemplates.data.labeltemplates;
                    vm.resetBartenderConfiguration();
                    vm.currentdata = vm.sourceData.length;
                }
                else if (labeltemplates.data.labeltemplates.length > 0) {
                    vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(labeltemplates.data.labeltemplates);
                    vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
                }

                if (!isGetDataDown && vm.sourceData && vm.sourceData.length > 0) {
                    vm.sourceData.map((item) => {
                        const defaultLabelTemplate = _.find(CORE.LABELTEMPLATE_DEFAULTLABELTYPE, { ID: item.defaultLabelTemplate });
                        if (defaultLabelTemplate && defaultLabelTemplate.ID !== null) {
                            item.defaultLabelTemplate = defaultLabelTemplate.name;
                        }
                    });
                }

                // must set after new data comes
                vm.totalSourceDataCount = labeltemplates.data.Count;
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
                if (!isGetDataDown && !vm.isCellEditIntegrated) {
                    cellEdit();
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

        /* retrieve Label Template list*/
        vm.loadData = () => {
            BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
            vm.cgBusyLoading = LabelTemplatesFactory.retriveLabelTemplatesList().query(vm.pagingInfo).$promise.then((labeltemplates) => {
                if (labeltemplates.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                    setDataAfterGetAPICall(labeltemplates, false);
                }
            }).catch((error) => BaseService.getErrorLog(error));
        };

        vm.getDataDown = () => {
            vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
            vm.cgBusyLoading = LabelTemplatesFactory.retriveLabelTemplatesList().query(vm.pagingInfo).$promise.then((labeltemplates) => {
                if (labeltemplates) {
                    setDataAfterGetAPICall(labeltemplates, true);
                }
            }).catch((error) => BaseService.getErrorLog(error));
        };

        function cellEdit() {
            vm.isCellEditIntegrated = true;
            vm.gridOptions.gridApi.edit.on.afterCellEdit($scope, (rowEntity, colDef, newvalue, oldvalue) => {
                if (newvalue !== oldvalue) {
                    if (newvalue === 'Select') {
                        rowEntity.defaultLabelTemplate = oldvalue;
                    }
                    else {
                        const defaultLabelTemplate = _.find(CORE.LABELTEMPLATE_DEFAULTLABELTYPE, { name: newvalue });

                        const Object = {
                            id: rowEntity.id,
                            Name: rowEntity.Name,
                            defaultLabelTemplate: defaultLabelTemplate.ID,
                            isActive: rowEntity.isActive,
                            isVerified: rowEntity.isVerified,
                            isListPage: true
                        };

                        vm.cgBusyLoading = LabelTemplatesFactory.updateLabelTemplate().query({
                            listObj: Object
                        }).$promise.then((res) => {
                            if (res && res.data && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                                if (defaultLabelTemplate && defaultLabelTemplate.name === 'UMID') {
                                    BaseService.setPrintStorage('PrintFormateOfUMID', Object);
                                } else if (defaultLabelTemplate && defaultLabelTemplate.name === 'Search Material') {
                                    BaseService.setPrintStorage('PrintFormateOfSearchMaterial', Object);
                                }
                                BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                            }
                            else {
                                rowEntity.defaultLabelTemplate = oldvalue;
                            }
                        }).catch((error) => BaseService.getErrorLog(error));
                    }
                }
            });
        }

        // delete
        vm.deleteRecord = (labeltemplates) => {
            let selectedIDs = [];
            const categoryType = null;

            if (labeltemplates) {
                selectedIDs.push(labeltemplates.id);
            } else {
                vm.selectedRows = vm.selectedRowsList;
                if (vm.selectedRows.length > 0) {
                    selectedIDs = vm.selectedRows.map((labeltemplatesItem) => labeltemplatesItem.id);
                }
            }

            if (selectedIDs) {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
                messageContent.message = stringFormat(messageContent.message, vm.LabelTempName, selectedIDs.length, vm.LabelTempName);

                const obj = {
                    messageContent: messageContent,
                    btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                    canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                };
                const objIDs = {
                    id: selectedIDs,
                    categoryType: categoryType,
                    CountList: false
                };
                DialogFactory.messageConfirmDialog(obj).then((yes) => {
                    if (yes) {
                        vm.cgBusyLoading = LabelTemplatesFactory.deleteLabelTemplates().query({ objIDs: objIDs }).$promise.then((res) => {
                            if (res && res.data) {
                                if (res.data.length > 0 || res.data.transactionDetails) {
                                    const data = {
                                        TotalCount: res.data.transactionDetails[0].TotalCount,
                                        pageName: vm.LabelTempName
                                    };
                                    BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                                        const IDs = {
                                            id: selectedIDs,
                                            CountList: true
                                        };
                                        return LabelTemplatesFactory.deleteLabelTemplates().query({
                                            objIDs: IDs
                                        }).$promise.then((res) => {
                                            let data = {};
                                            data = res.data;
                                            data.PageName = vm.LabelTempName;
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
                                } else {
                                    BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                                    vm.gridOptions.clearSelectedRows();
                                }
                            }
                        }).catch((error) => BaseService.getErrorLog(error));
                    }
                }, () => {
                }).catch((error) => BaseService.getErrorLog(error));
            }
            else {
                //show validation message no data selected
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
                messageContent.message = stringFormat(messageContent.message, vm.LabelTempName);
                const alertModel = {
                    messageContent: messageContent
                };
                DialogFactory.messageAlertDialog(alertModel);
            }
        };

        /* delete multiple data called from directive of ui-grid*/
        vm.deleteMultipleData = () => {
            vm.deleteRecord();
        };

        vm.updateBartenderConfiguration = () => {
            if (BaseService.focusRequiredField(vm.manageBarTenderForm)) {
                return;
            }
            if (vm.manageBarTenderForm.$dirty && vm.manageBarTenderForm.$valid) {
                if (vm.manageLabelTemplates.BartenderServer && vm.manageLabelTemplates.BartenderServerPort) {
                    const updateObject = {
                        BartenderServer: vm.manageLabelTemplates.BartenderServer,
                        BartenderServerPort: vm.manageLabelTemplates.BartenderServerPort
                    };
                    vm.cgBusyLoading = ReceivingMaterialFactory.saveBartenderServerDetails().query({
                        updateObj: updateObject
                    }).$promise.then((res) => {
                        if (res && res.data) {
                            vm.showconfiguration = false;
                            if (vm.manageBarTenderForm) {
                                vm.manageBarTenderForm.$setPristine();
                            }
                        }
                    }).catch((error) => BaseService.getErrorLog(error));
                }
            }
        };

        vm.resetBartenderConfiguration = () => {
            vm.cgBusyLoading = ReceivingMaterialFactory.getBartenderServerDetails().query().$promise.then((res) => {
                if (res && res.data) {
                    const host = _.find(res.data, (item) => item.key === 'BartenderServer');
                    const port = _.find(res.data, (item) => item.key === 'BartenderServerPort');
                    vm.manageLabelTemplates.BartenderServer = host ? host.values : null;
                    vm.manageLabelTemplates.BartenderServerPort = port ? port.values : null;
                    if (vm.manageBarTenderForm) {
                        vm.manageBarTenderForm.$setPristine();
                    }
                }
            }).catch((error) => BaseService.getErrorLog(error));
        };

        vm.verifyLabelTemplateMultipleData = () => {
            verifyLabelTemplateFunction(vm.selectedRowsList, (vm.selectedRowsList && vm.selectedRowsList.length === 1));
        };
        function verifyLabelTemplateFunction(rows, singleSelection) {
            if (rows && rows.length > 0) {
                const allPromises = [];
                vm.invalidLabelTemplateNames = [];
                vm.invalidLabelTemplateMessage = undefined;
                _.each(rows, (item) => {
                    const obj = {};
                    obj.entity = item;
                    allPromises.push(verifyLabelTemplatePromise(item));
                });
                if (allPromises && allPromises.length) {
                    vm.cgBusyLoading = $q.all(allPromises).then((responses) => {
                        if (vm.invalidLabelTemplateNames && vm.invalidLabelTemplateNames.length) {
                            let messageContent = '';
                            if (singleSelection && vm.invalidLabelTemplateMessage) {
                                messageContent = vm.invalidLabelTemplateMessage;
                            }
                            else {
                                messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.LABEL_TEMPLATE_VERIFICATION_MESSAGE);
                                messageContent.message = stringFormat(messageContent.message, vm.invalidLabelTemplateNames.join(', '), '');
                            }
                            const alertModel = {
                                messageContent: messageContent
                            };
                            DialogFactory.messageAlertDialog(alertModel);
                        }
                        else if (responses && responses.length && (_.find(responses, (response) => response.data && response.data.data && response.data.data.StatusCode === CORE.API_RESPONSE_CODE.BAD_REQUEST))) {
                            const msgContent = responses[0].data.messageContent;
                            const alertModel = {
                                messageContent: msgContent
                            };
                            DialogFactory.messageAlertDialog(alertModel);
                        }
                        else {
                            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.LABEL_TEMPLATE_VERIFICATION_SUCCESS_MESSAGE);
                            const alertModel = {
                                messageContent: messageContent
                            };
                            DialogFactory.messageAlertDialog(alertModel);
                        }
                        BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                    }).catch((error) => BaseService.getErrorLog(error));
                }
            }
        }

        function verifyLabelTemplatePromise(item) {
            if (item && item.id !== 0) {
                const printObj = {
                    'ServiceName': item.Name,
                    'reqName': 'Web Service',
                    'PrinterName': ''
                };
                const listObj = {
                    id: item.id
                };
                return ReceivingMaterialFactory.verifyLabelTemplate().query({ verifyObj: printObj }).$promise.then((res) => {
                    let canUpdateVarified = true;
                    if (res && res.data) {
                        if (res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                            if (res.data.data && res.data.data.StatusCode &&
                                res.data.data.StatusCode === CORE.API_RESPONSE_CODE.PAGE_NOT_FOUND) {
                                listObj.isVerified = false;
                                vm.invalidLabelTemplateNames.push(printObj.ServiceName);
                                vm.invalidLabelTemplateMessage = res.data.messageContent ? res.data.messageContent : undefined;
                            }
                            else if (res.data.data && res.data.data.StatusCode &&
                                res.data.data.StatusCode === CORE.API_RESPONSE_CODE.BAD_REQUEST) {
                                canUpdateVarified = false;
                            }
                            else {
                                listObj.isVerified = true;
                            }
                        }
                        else if (res && res.data && res.status === CORE.ApiResponseTypeStatus.FAILED) {
                            canUpdateVarified = false;
                        }
                        else {
                            listObj.isVerified = false;
                            vm.invalidLabelTemplateNames.push(printObj.ServiceName);
                            vm.invalidLabelTemplateMessage = res.data.messageContent ? res.data.messageContent : undefined;
                        }
                    }
                    else if (res && res.status === CORE.ApiResponseTypeStatus.FAILED) {
                        canUpdateVarified = false;
                    }
                    if (canUpdateVarified) {
                        return LabelTemplatesFactory.verifyLabelTemplate().query({ listObj: listObj }).$promise.then((res) => res);
                    }
                    else {
                        return res;
                    }
                }).catch((error) => BaseService.getErrorLog(error));
            }
        };

        vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

        vm.configureBartender = () => {
            if (!vm.manageLabelTemplates.BartenderServer || !vm.manageLabelTemplates.BartenderServerPort) {
                vm.resetBartenderConfiguration();
            }
            vm.showconfiguration = true;
        };
        vm.closeConfiguration = () => vm.showconfiguration = false;

        angular.element(() => {
            vm.resetBartenderConfiguration();
        });

        vm.downloadSampleFileIntegration = () => {
            vm.cgBusyLoading = LabelTemplatesFactory.downloadSampleFileIntegration().then((response) => {
                var model = {
                    messageContent: '',
                    multiple: true
                };
                if (response.status === 404) {
                    model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_NotFound);
                    DialogFactory.messageAlertDialog(model);
                } else if (response.status === 403) {
                    model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_AccessDenied);
                    DialogFactory.messageAlertDialog(model);
                } else if (response.status === 401) {
                    model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_Unauthorized);
                    DialogFactory.messageAlertDialog(model);
                } else {
                    const blob = new Blob([response.data], {
                        type: 'application/vnd.btin'
                    });
                    const link = document.createElement('a');
                    if (link.download !== undefined) {
                        const url = URL.createObjectURL(blob);
                        link.setAttribute('href', url);
                        link.setAttribute('download', 'SampleBarTenderIntegration.btin');
                        link.style = 'visibility:hidden';
                        document.body.appendChild(link);
                        $timeout(() => {
                            link.click();
                            document.body.removeChild(link);
                        });
                    }
                }
            }).catch((error) => BaseService.getErrorLog(error));
        };

        //close popup on page destroy
        $scope.$on('$destroy', () => $mdDialog.hide(false, { closeAll: true }));
    }
})();
