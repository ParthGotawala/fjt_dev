(function () {
    'use strict';

    angular
        .module('app.admin.rfqsetting')
        .controller('RFQReasonController', RFQReasonController);

    /** @ngInject */
    function RFQReasonController(USER, $scope, CORE, RFQSettingFactory, BaseService, $timeout, DialogFactory, $mdDialog, $stateParams, $state, RFQTRANSACTION) {  // eslint-disable-line func-names
        const vm = this;
        vm.isUpdatable = true;
        // vm.view = true;
        vm.isNoDataFound = true;
        vm.StatusGridHeaderDropdown = CORE.StatusGridHeaderDropdown;
        vm.Reason_Type = CORE.Reason_Type;
        vm.DefaultDateFormat = _dateTimeDisplayFormat;
        vm.gridConfig = CORE.gridConfig;
        vm.LabelConstant = CORE.LabelConstant.COMMON;
        let filterReason = null;
        const reasonId = $stateParams.reasonId;
        const currentstate = $state.current.name;
        vm.loginUser = BaseService.loginUser;
        const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;

        if (reasonId) {
            vm.selectedReasonType = _.find(vm.Reason_Type, (rsn) => rsn.id.toString() === reasonId);
            switch (vm.selectedReasonType.id) {
                case vm.Reason_Type.RFQ.id:
                    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.REASON;
                    break;
                case vm.Reason_Type.BOM.id:
                    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.BOM_REASON;
                    break;
                case vm.Reason_Type.INVOICE_APPROVE.id:
                    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.INVOICE_APPROVE;
                break;
              case vm.Reason_Type.KIT_RELEASE_COMMENT.id:
                vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.KIT_RELEASE_COMMENT;
                break;
            }
            filterReason = {
                ColumnName: 'reason_type',
                SearchString: reasonId
            };
        }

        vm.sourceHeader = [{
            field: 'Action',
            cellClass: 'gridCellColor',
            displayName: 'Action',
            width: '70',
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
            field: 'reasonCategory',
            displayName: vm.selectedReasonType.CategoryDisplayColumn,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: '650'
        }, {
            field: 'activeConvertedValue',
            displayName: 'Status',
            cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
                + '<span class="label-box" \
                                                            ng-class="{\'label-success\':row.entity.isActive == true, \
                                                            \'label-warning\':row.entity.isActive == false}"> \
                                                                {{ COL_FIELD }}'
                + '</span>'
                + '</div>',
            filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
            filter: {
                term: null,
                options: vm.StatusGridHeaderDropdown
            },
            ColumnDataType: 'StringEquals',
            width: 150
        }, {
            field: 'reason',
            displayName: vm.selectedReasonType.ReasonDisplayColumn,
            cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.reason" ng-click="grid.appScope.$parent.vm.showReason(row.entity, $event)"> \
                                   View \
                                </md-button>',
            enableFiltering: false,
            enableSorting: false,
            exporterSuppressExport: true,
            width: '100',
            enableCellEdit: false
        }, {
            field: 'updatedAt',
            displayName: vm.LabelConstant.GRIDHEADER_MODIFY_DATE,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
            type: 'datetime',
            enableFiltering: false
        }, {
            field: 'updatedby',
            displayName: vm.LabelConstant.GRIDHEADER_MODYFYBY,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
            type: 'StringEquals',
            enableFiltering: true
        }, {
            field: 'updatedbyRole',
            displayName: vm.LabelConstant.GRIDHEADER_MODYFYBY_ROLE,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
            type: 'StringEquals',
            enableFiltering: true
        }, {
            field: 'createdAt',
            displayName: vm.LabelConstant.GRIDHEADER_CREATED_DATE,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
            type: 'datetime',
            enableFiltering: false
        }, {
            field: 'createdby',
            displayName: vm.LabelConstant.GRIDHEADER_CREATEDBY,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
            type: 'StringEquals',
            enableFiltering: true
        }, {
            field: 'createdbyRole',
            displayName: vm.LabelConstant.GRIDHEADER_CREATEDBY_ROLE,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
            type: 'StringEquals',
            enableFiltering: true
        }];

        const initPageInfo = () => {
            vm.pagingInfo = {
                Page: CORE.UIGrid.Page(),
                SortColumns: [['reasonCategory', 'ASC']],
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
            exporterCsvFilename: vm.selectedReasonType.title + '.csv'
        };

        function setDataAfterGetAPICall(reason, isGetDataDown) {
            if (reason && reason.data && reason.data.Reason) {
                if (!isGetDataDown) {
                    vm.sourceData = reason.data.Reason;
                    vm.currentdata = vm.sourceData.length;
                }
                else if (reason.data.Reason.length > 0) {
                    vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(reason.data.Reason);
                    vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
                }
                // must set after new data comes
                vm.totalSourceDataCount = reason.data.Count;
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
                    if (vm.pagingInfo.SearchColumns.length > 1 || !_.isEmpty(vm.SearchMode)) {
                        vm.isNoDataFound = false;
                        $scope.$parent.vm.isNoDataFound = false;
                        vm.emptyState = 0;
                    }
                    else {
                        vm.isNoDataFound = true;
                        $scope.$parent.vm.isNoDataFound = true;
                        vm.emptyState = null;
                    }
                }
                else {
                    vm.isNoDataFound = false;
                    $scope.$parent.vm.isNoDataFound = false;
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
            if (filterReason) {
                const obj = _.find(vm.pagingInfo.SearchColumns, (x) => x.ColumnName === 'reason_type');
                if (!obj) {
                    vm.pagingInfo.SearchColumns.push(filterReason);
                    vm.pagingInfo.reason_type = vm.selectedReasonType.id;
                }
            }
            BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
            vm.cgBusyLoading = RFQSettingFactory.retriveReasonList().query(vm.pagingInfo).$promise.then((reason) => {
                if (reason && reason.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                    setDataAfterGetAPICall(reason, false);
                }
            }).catch((error) => BaseService.getErrorLog(error));
        };

        /* load more data on mouse scroll */
        vm.getDataDown = () => {
            vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
            vm.cgBusyLoading = RFQSettingFactory.retriveReasonList().query(vm.pagingInfo).$promise.then((reason) => {
                if (reason.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                    setDataAfterGetAPICall(reason, true);
                }
            }).catch((error) => BaseService.getErrorLog(error));
        };

        // delete reason
        vm.deleteRecord = (reason) => {
            let selectedIDs = [];
            if (reason) {
                selectedIDs.push(reason.id);
            } else {
                vm.selectedRows = vm.selectedRowsList;
                if (vm.selectedRows.length > 0) {
                    selectedIDs = vm.selectedRows.map((reasonItem) => reasonItem.id);
                }
            }
            if (selectedIDs) {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
                messageContent.message = stringFormat(messageContent.message, vm.selectedReasonType.title, selectedIDs.length);
                const obj = {
                    messageContent: messageContent,
                    btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                    canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                };
                DialogFactory.messageConfirmDialog(obj).then((resposne) => {
                    if (resposne) {
                        const objIDs = {
                            id: selectedIDs,
                            reason_type: vm.selectedReasonType.id,
                            CountList: false
                        };
                        vm.cgBusyLoading = RFQSettingFactory.deleteReason().query({ objIDs }).$promise.then((response) => {
                            if (response && response.data && (response.data.length > 0 || response.data.transactionDetails)) {
                                const data = {
                                    TotalCount: response.data.transactionDetails[0].TotalCount,
                                    pageName: CORE.PageName.rfq_reason
                                };
                                BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                                    const objIDs = {
                                        id: selectedIDs,
                                        CountList: true
                                    };
                                    return vm.cgBusyLoading = RFQSettingFactory.deleteReason().save({
                                        objIDs
                                    }).$promise.then((res) => {
                                        let data = {};
                                        data = res.data;
                                        data.pageTitle = reason ? reason.reasonCategory : null;
                                        data.PageName = CORE.PageName.rfq_reason;
                                        data.id = selectedIDs;
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
                messageContent.message = stringFormat(messageContent.message, 'Reason');
                DialogFactory.messageAlertDialog({ messageContent });
            }
        };


        // view details
        vm.showReason = (object, ev) => {
            const obj = {
                title: vm.selectedReasonType.ReasonDisplayColumn,
                description: object.reason,
                name: object.reasonCategory
            };
            DialogFactory.dialogService(
                CORE.DESCRIPTION_MODAL_CONTROLLER,
                CORE.DESCRIPTION_MODAL_VIEW,
                ev,
                obj).then(() => BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData)
                , (err) => BaseService.getErrorLog(err));
        };

        // add edit popup
        vm.addEditRecord = (data, ev) => {
            if (data === null) {
                data = {
                    reasonID: reasonId
                };
            }
            data.reasonId = reasonId;

            DialogFactory.dialogService(
                USER.ADMIN_REASON_ADD_UPDATE_MODAL_CONTROLLER,
                USER.ADMIN_REASON_ADD_UPDATE_MODAL_VIEW,
                ev,
                data).then(() => {
                }, (data) => {
                    if (data) {
                        BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                    }
                });
        };


        const RefreshDetail = $scope.$on(RFQTRANSACTION.EVENT_NAME.ResponseReason, (evt, data) => {
            if (data === currentstate) {
                BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
            }
        });

        /* delete multiple data called from directive of ui-grid*/
        vm.deleteMultipleData = () => vm.deleteRecord();

        /* Update Reason */
        vm.updateRecord = (row, ev) => vm.addEditRecord(row.entity, ev);

        //close popup on page destroy
        $scope.$on('$destroy', () => {
            RefreshDetail();
            $mdDialog.hide(false, { closeAll: true });
        });
    }
})();
