(function () {
    'use strict';
    angular
        .module('app.core')
        .directive('assemblyRevisionComments', AssemblyRevisionComments);

    /** @ngInject */
    function AssemblyRevisionComments($timeout, $mdDialog, $stateParams, BaseService, CORE, DialogFactory, CommentFactory, USER, TRANSACTION) {
        const directive = {
            restrict: 'E',
            replace: true,
            scope: {
                isSupplier: '=',
                isReadOnly: '=?'
            },
            templateUrl: 'app/directives/custom/assembly-revision-comments/assembly-revision-comments.html',
            controller: AssemblyRevisionCommentsCntrl,
            controllerAs: 'vm',
            link: function () {

            }
        };
        return directive;

        /** @ngInject */
        /**
        * Controller for view data of alias & attribute groups
        *
        * @param
        */
        function AssemblyRevisionCommentsCntrl($scope) {
            const vm = this;
            vm.isReadOnly = $scope.isReadOnly;
            vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
            vm.currentPageName = CORE.PAGENAME_CONSTANT[64].PageName;
            vm.entityName = CORE.AllEntityIDS.Assembly.Name;
            vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.COMMENTS;
            vm.DefaultDateTimeFormat = _dateTimeDisplayFormat;
            vm.isSupplier = $scope.isSupplier;
            vm.isUpdatable = vm.isSupplier ? false : true;
            vm.isHideDelete = vm.isSupplier ? true : false;
            vm.gridHeightClass = TRANSACTION.PartComment_Split_UI.PartCommentsGridUI;
            vm.LabelConstant = CORE.LabelConstant;
            vm.loginUser = BaseService.loginUser;
            const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;

            const initPageInfo = () => {
                vm.pagingInfo = {
                    Page: CORE.UIGrid.Page(),
                    SortColumns: [['commentId', 'ASC']],
                    SearchColumns: [],
                    PartID: $stateParams.coid,
                    IsSupplierPart: vm.isSupplier ? true : false
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
                enableCellEdit: false,
                enableCellEditOnFocus: false,
                exporterCsvFilename: CORE.PAGENAME_CONSTANT[64].PageName + '.csv',
                exporterMenuCsv: true,
                enableGrouping: false,
                enableColumnMenus: true,
                CurrentPage: vm.currentPageName,
                isAdd: vm.isSupplier || vm.isReadOnly ? false : true,
                enableFiltering: false,
                hideMultiDeleteButton: vm.isSupplier || vm.isReadOnly ? true : false,
                allowToExportAllData: true,
                exporterAllDataFn: () => {
                    const pagingInfoOld = _.clone(vm.pagingInfo);
                    pagingInfoOld.pageSize = 0;
                    pagingInfoOld.isExport = true;
                    return CommentFactory.retrieveComments().query(pagingInfoOld).$promise.then((response) => {
                        if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data && response.data.comment) {
                            setDataAfterGetAPICall(response, false);
                            return response.data.comment;
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
                    enableSorting: false
                }, {
                    field: 'comment',
                    displayName: 'Comment',
                    cellTemplate: '<div class="ui-grid-cell-contents text-left cm-white-space-normal">{{COL_FIELD}}</div>',
                    enableFiltering: false,
                    enableSorting: false,
                    width: '900'
                },
                {
                    field: 'updatedAt',
                    displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
                    width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
                    cellTemplate: '<div class="ui-grid-cell-contents text-left cm-white-space-normal">{{COL_FIELD}}</div>',
                    type: 'datetime',
                    enableSorting: true,
                    enableFiltering: false,
                    visible: CORE.UIGrid.VISIBLE_MODIFIED_AT
                },
                {
                    field: 'updatedBy',
                    displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
                    width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
                    cellTemplate: '<div class="ui-grid-cell-contents text-left cm-white-space-normal">{{COL_FIELD}}</div>',
                    enableFiltering: true,
                    enableSorting: true,
                    visible: CORE.UIGrid.VISIBLE_MODIFIED_BY
                },
                {
                    field: 'updatedByRole',
                    displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
                    cellTemplate: '<div class="ui-grid-cell-contents text-left cm-white-space-normal">{{COL_FIELD}}</div>',
                    width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
                    type: 'StringEquals',
                    enableFiltering: true,
                    visible: CORE.UIGrid.VISIBLE_MODIFIED_BYROLE
                },
                {
                    field: 'createdAt',
                    displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
                    width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
                    cellTemplate: '<div class="ui-grid-cell-contents text-left cm-white-space-normal">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateTimeFormat}}</div>',
                    enableFiltering: false,
                    enableSorting: true,
                    type: 'datetime',
                    visible: CORE.UIGrid.VISIBLE_CREATED_AT
                },
                {
                    field: 'createdBy',
                    displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
                    width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
                    cellTemplate: '<div class="ui-grid-cell-contents text-left cm-white-space-normal">{{COL_FIELD}}</div>',
                    enableFiltering: true,
                    enableSorting: true,
                    visible: CORE.UIGrid.VISIBLE_CREATED_BY
                },
                {
                    field: 'createdByRole',
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
                            ng-change="grid.appScope.$parent.vm.setCommentRemove(row.entity)"></md-checkbox></div>',
                        enableFiltering: false,
                        enableSorting: false,
                        exporterSuppressExport: true,
                        pinnedLeft: false,
                        allowCellFocus: false,
                        maxWidth: '80',
                        enableColumnMoving: false,
                        manualAddedCheckbox: true
                    },
                    {
                        field: 'ACtion',
                        displayName: 'Action',
                        width: '80',
                        cellTemplate: '<span class="padding-left-10 pt-2"><md-button class="md-primary grid-button md-icon-button bdrbtn cm-grid-action-view-icon" \
                                ng-click="grid.appScope.$parent.vm.updateRecord(row,$event)" \
                                ng-disabled="!grid.appScope.$parent.vm.isUpdatable" \
                                ng-class="{\'item-disabled\': !grid.appScope.$parent.vm.isUpdatable}" > \
                              <md-icon role="img" class="uigrid-icon" md-font-icon="icon-pencil"></md-icon> \
                              <md-tooltip md-direction="top">Update</md-tooltip>\
                          </md-button> </span>',
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
            const setDataAfterGetAPICall = (comment, isGetDataDown) => {
                if (comment && comment.data && comment.data.comment) {
                    if (!isGetDataDown) {
                        vm.sourceData = comment.data.comment;
                        vm.currentdata = vm.sourceData.length;
                    }
                    else if (comment.data.comment.length > 0) {
                        vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(comment.data.comment);
                        vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
                    }
                    // must set after new data comes
                    vm.totalSourceDataCount = comment.data.Count;
                    if (vm.isSupplier || vm.isReadOnly) {
                        processPartComments();
                    }
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
                        if (vm.pagingInfo.SearchColumns.length > 0) {
                            if (vm.pagingInfo.SearchColumns.length > 1) {
                                vm.isNoDataFound = false;
                                vm.emptyState = 0;
                            }
                            else {
                                vm.isNoDataFound = true;
                                vm.emptyState = null;
                            }
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
                    vm.gridOptions.gridApi.grid.options.isAdd = vm.isSupplier || vm.isReadOnly ? false : true;
                    vm.gridOptions.gridApi.grid.gridMenuScope.showFilters = false;
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
                    vm.Apply = false;
                }
            };
            /* retrieve comments list*/
            vm.loadData = () => {
                BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
                vm.cgBusyLoading = CommentFactory.retrieveComments().query(vm.pagingInfo).$promise.then((comment) => {
                    if (comment && comment.data) {
                        setDataAfterGetAPICall(comment, false);
                    }
                }).catch((error) => BaseService.getErrorLog(error));
            };

            /* load more data on mouse scroll */
            vm.getDataDown = () => {
                vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
                vm.pagingInfo.SearchColumns.push(searchColumn);
                vm.cgBusyLoading = CommentFactory.retrieveComments().query(vm.pagingInfo).$promise.then((comment) => {
                    if (comment && comment.data) {
                        setDataAfterGetAPICall(comment, false);
                    }
                }).catch((error) => BaseService.getErrorLog(error));
            };

            vm.applyAll = (applyAll) => {
                if (applyAll) {
                    _.map(vm.sourceData, selectRecord);
                }
                else {
                    _.map(vm.sourceData, unselectRecord);
                }
            };

            const selectRecord = (row) => {
                row.isRecordSelectedForRemove = true;
                vm.gridOptions.gridApi.selection.selectRow(row);
            };

            const unselectRecord = (row) => {
                row.isRecordSelectedForRemove = false;
                vm.gridOptions.clearSelectedRows();
            };

            vm.setCommentRemove = (row) => {
                var totalItem = vm.sourceData;
                var selectItem = _.filter(vm.sourceData, (data) => data.isRecordSelectedForRemove === true);
                if (row.isRecordSelectedForRemove) {
                    vm.gridOptions.gridApi.selection.selectRow(row);
                }
                else {
                    vm.gridOptions.gridApi.selection.unSelectRow(row);
                }

                if (totalItem.length === selectItem.length) {
                    vm.Apply = true;
                }
                else {
                    vm.Apply = false;
                }
            };

            vm.AddNewComment = () => {
                if (vm.isReadOnly) {
                    return;
                }

                const event = angular.element.Event('click');
                const data = { partID: $stateParams.coid };
                DialogFactory.dialogService(
                    CORE.COMPONENT_COMMENT_CONTROLLER,
                    CORE.COMPONENT_COMMENT_VIEW,
                    event,
                    data).then(() => {
                        vm.loadData();
                    },
                        () => {
                            vm.loadData();
                        }, (error) => BaseService.getErrorLog(error));
            };

            //edit comments
            vm.updateRecord = (row, ev) => {
                if (vm.isReadOnly) {
                    return;
                }

                const data = {
                    commentId: row.entity.commentId,
                    partID: $stateParams.coid
                };
                DialogFactory.dialogService(
                    CORE.COMPONENT_COMMENT_CONTROLLER,
                    CORE.COMPONENT_COMMENT_VIEW,
                    ev,
                    data).then(() => {
                        vm.loadData();
                    },
                        () => {
                            vm.loadData();
                        }, (error) => BaseService.getErrorLog(error));
            };

            //delete comments
            vm.deleteRecord = (comment) => {
                if (vm.isReadOnly) {
                    return;
                }
                var selectedIDs = [];
                if (comment) {
                    selectedIDs.push(comment.commentId);
                } else {
                    vm.selectedRows = vm.selectedRowsList;
                    if (vm.selectedRows.length > 0) {
                        selectedIDs = vm.selectedRows.map((comment) => comment.commentId);
                    }
                }
                if (selectedIDs) {
                    const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
                    messageContent.message = stringFormat(messageContent.message, 'Comment', selectedIDs.length);
                    const obj = {
                        messageContent: messageContent,
                        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                    };
                    const objIDs = {
                        id: selectedIDs
                    };
                    DialogFactory.messageConfirmDialog(obj).then((yes) => {
                        if (yes) {
                            vm.cgBusyLoading = CommentFactory.deleteComment().query({ objIDs: objIDs }).$promise.then((res) => {
                                if (res && res.data) {
                                    if (!vm.gridOptions.enablePaging) {
                                        initPageInfo();
                                    }
                                    vm.loadData();
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
                    messageContent.message = stringFormat(messageContent.message, 'Comment');
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

            //$scope.$on('$destroy', function () {
            //  $mdDialog.hide(false, {
            //    closeAll: true
            //  });
            //});
            const processPartComments = () => {
                _.each(vm.sourceData, (item) => {
                    item.isDisabledUpdate = item.isDisabledUpdate = true;
                    item.isRowSelectable = false;
                });
            };
            const onAddNew = $scope.$on('AddNew', () => {
                vm.AddNewComment();
            });

            vm.viewPurchaseRequirementList = () => {
                const data = {
                    title: vm.currentPageName,
                    list: _.map(vm.sourceData, 'comment')
                };
                DialogFactory.dialogService(
                    CORE.VIEW_BULLET_POINT_LIST_POPUP_CONTROLLER,
                    CORE.VIEW_BULLET_POINT_LIST_POPUP_VIEW,
                    null,
                    data).then(() => { },
                        () => { },
                        (err) => BaseService.getErrorLog(err));
            };

            $scope.$on('$destroy', () => {
                onAddNew();
            });
        }
    }
})();
