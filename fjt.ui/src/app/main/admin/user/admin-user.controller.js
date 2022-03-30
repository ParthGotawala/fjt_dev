(function () {
    'use strict';

    angular
        .module('app.admin.user')
        .controller('AdminUserController', AdminUserController);

    /** @ngInject */
    function AdminUserController($state, $timeout, $mdDialog,$scope,
			USER, CORE, UserFactory, DialogFactory, BaseService) {  // eslint-disable-line func-names
        const vm = this;
        vm.isUpdatable = true;
        vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.USER;


        vm.sourceHeader = [
            {
                field: 'Action',
                cellClass: 'gridCellColor',
                displayName: 'Action',
                width: '120',
                cellTemplate: `<grid-action-view grid="grid" row="row"></grid-action-view>`,
                //headerCellTemplate:
                //`<span style="float:left"/>
				//	<span class="ui-icon ui-icon-close" style="float:left"/>
				//	<span style="float:left" class ="ui-icon ui-icon-arrowthick-2-n-s"/>`,
                enableFiltering: false,
                enableSorting: false,
                exporterSuppressExport: true,
                pinnedLeft: true
            },
                {
                    field: '#',
                    width: '70',
                    cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
                    //headerCellTemplate:
                    //`<span style="float:left"/>
                    //<span class="ui-icon ui-icon-close" style="float:left"/>
                    //<span style="float:left" class ="ui-icon ui-icon-arrowthick-2-n-s"/>`,
                    enableFiltering: false,
                    enableSorting: false,
                }, {
                    field: 'username',
                    displayName: 'User ID',
                    cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                },
            {
                field: 'emailAddress',
                displayName: 'Email',
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',

            },
             {
                 field: 'firstName',
                 displayName: 'FirstName',
                 cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',

             },
             {
                 field: 'lastName',
                 displayName: 'LastName',
                 cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
             }
        ];

        let initPageInfo = () => {
            vm.pagingInfo = {
                Page: CORE.UIGrid.Page(),
                //ItemsPerPage: CORE.UIGrid.ItemsPerPage(),
                SortColumns: [['username', 'ASC']],
                SearchColumns: []
            };
        }

        initPageInfo();

        vm.gridOptions = {
            showColumnFooter: false,
            enableRowHeaderSelection: true,
            enableFullRowSelection: false,
            enableRowSelection: true,
            multiSelect: true,
            filterOptions: vm.pagingInfo.SearchColumns,
            exporterMenuCsv: true,
            exporterCsvFilename: 'Users.csv',
        };

        /* retrieve Users list*/
        vm.loadData = () => {
            vm.cgBusyLoading = UserFactory.user(vm.pagingInfo).query().$promise.then((users) => {
                vm.sourceData = users.data.users;
                vm.totalSourceDataCount = users.data.Count;
                if (!vm.gridOptions.enablePaging) {
                    vm.currentdata = vm.sourceData.length;
                    vm.gridOptions.gridApi.infiniteScroll.resetScroll();
                }
                vm.gridOptions.clearSelectedRows();
                if (vm.totalSourceDataCount == 0) {
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
                    if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount == vm.currentdata) {
                        return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
                    }
                });
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        }

        /* load more data on mouse scroll */
        vm.getDataDown = () => {
            vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
            vm.cgBusyLoading = UserFactory.user(vm.pagingInfo).query().$promise.then((users) => {
                vm.sourceData = vm.sourceData.concat(users.data.users);
                vm.currentdata = vm.sourceData.length;
                vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
                $timeout(() => {
                    vm.resetSourceGrid();
                    return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount != vm.currentdata ? true : false);
                });
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        };

        vm.selectedUser = () => {
            return vm.gridOptions.getSelectedRowsCount ? vm.gridOptions.getSelectedRowsCount() : 0;
        };

        vm.fab = {
            Status: false,
        };



        // delete user
        vm.deleteRecord = (user) => {
            let currentUser = BaseService.loginUser;
            let selectedIDs = [];
            if (user) {
                //selectedIDs = user.id;
                selectedIDs.push(user.id);
            } else {
                vm.selectedRows = vm.selectedRowsList;
                if (vm.selectedRows.length > 0) {
                    selectedIDs = vm.selectedRows.map((useritem) => useritem.id);
                }
            }
            if (selectedIDs) {
                let obj = {
                    title: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM, "User"),
                    textContent: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM_MESSAGE, selectedIDs.length, "user"),
                    btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                    canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                };

                DialogFactory.confirmDiolog(obj).then((yes) => {
                    if (yes) {
                        let loginUser = _.find(selectedIDs, (userId) => {
                            return userId == currentUser.userid
                        });
                        if (loginUser) {
                            DialogFactory.alertDialog({ title: CORE.MESSAGE_CONSTANT.ALERT_HEADER, textContent: USER.USER_DELETE_WARNING, multiple: true });
                            return;
                        }
                        else {
                            vm.cgBusyLoading = UserFactory.user().delete({ id: selectedIDs }).$promise.then((employees) => {
                                BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                                vm.gridOptions.clearSelectedRows();
                            }).catch((error) => {
                                return BaseService.getErrorLog(error);
                            });
                        }
                    }
                    
                }, (cancel) => {
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            }
            else {
                //show validation message no data selected
                let alertModel = {
                    title: USER.USER_ERROR_LABEL,
                    textContent: stringFormat(USER.SELECT_ONE_LABEL, "user")
                };
                DialogFactory.alertDialog(alertModel);
            }
        };


        /* add customer*/
        vm.addUser = (row, ev) => {
            $state.go(USER.ADMIN_MANAGEUSER_STATE, { uid: null });
        };

        /* update customer*/
        vm.updateRecord = (row, ev) => {
            $state.go(USER.ADMIN_MANAGEUSER_STATE, { uid: row.entity.id });
        };

        /* delete multiple data called from directive of ui-grid*/
        vm.deleteMultipleData = () => {
            vm.deleteRecord();
        }
        $scope.$on('$destroy', function () {
            
            $mdDialog.hide(false, {
                closeAll: true
            });
        });
    }

})();