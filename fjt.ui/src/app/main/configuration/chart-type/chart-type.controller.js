(function () {
    'use strict';

    angular
        .module('app.configuration.charttype')
        .controller('ChartTypeController', ChartTypeController);

    /** @ngInject */
    function ChartTypeController(USER,$scope, CORE, ChartTypeFactory, BaseService, $timeout, DialogFactory, $mdDialog) {  // eslint-disable-line func-names
        const vm = this;
        vm.isUpdatable = true;
        vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.JOB_TYPE;
        vm.StatusOptionsGridHeaderDropdown = CORE.StatusOptionsGridHeaderDropdown;

        vm.sourceHeader = [
            {
                field: 'Action',
                cellClass: 'gridCellColor',
                displayName: 'Action',
                width: '120',
                cellTemplate: `<grid-action-view grid="grid" row="row"></grid-action-view>`,
                enableFiltering: false,
                enableSorting: false,
                exporterSuppressExport: true,
                pinnedLeft: true
            }, {
                field: '#',
                width: '70',
                cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
                enableFiltering: false,
                enableSorting: false,
            }, {
                field: 'name',
                displayName: 'Name',
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                width: '200'
            }, {
                field: 'iconClass',
                displayName: 'Icon Class',
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            },
             {
                 field: 'activeConvertedValue',
                 displayName: 'Active',
                 cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">\
                               <span class="label-box" \
                                                            ng-class="{\'label-success\':row.entity.isActive == true, \
                                                            \'label-warning\':row.entity.isActive == false}"> \
                                                                {{ COL_FIELD }}\
                               </span>\
                               </div>',
                 filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
                 filter: {
                     term: null,
                     options: vm.StatusOptionsGridHeaderDropdown
                 },
                 ColumnDataType: 'StringEquals',
                 width: 168
             },
        ];

        let initPageInfo = () => {
            vm.pagingInfo = {
                Page: CORE.UIGrid.Page(),
                //ItemsPerPage: CORE.UIGrid.ItemsPerPage(),
                SortColumns: [['name', 'ASC']],
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
            exporterCsvFilename: 'Chart Type.csv',
        };

        /* retrieve Users list*/
        vm.loadData = () => {
            vm.cgBusyLoading = ChartTypeFactory.retriveChartType(vm.pagingInfo).query().$promise.then((charttype) => {
                if (charttype.status == CORE.ApiResponseTypeStatus.SUCCESS) {
                    vm.sourceData = charttype.data.ChartType;
                    vm.totalSourceDataCount = charttype.data.Count;
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
                }
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        }

        /* load more data on mouse scroll */
        vm.getDataDown = () => {
            vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
            vm.cgBusyLoading = ChartTypeFactory.retriveChartType(vm.pagingInfo).query().$promise.then((charttype) => {
                vm.sourceData = vm.sourceData.concat(charttype.data.ChartType);
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

          // delete chart type
        vm.deleteRecord = (chartTypes) => {
            let selectedIDs = [];
            if (chartTypes) {
                selectedIDs.push(chartTypes.chartTypeID);
            } else {
                vm.selectedRows = vm.selectedRowsList;
                if (vm.selectedRows.length > 0) {
                    selectedIDs = vm.selectedRows.map((chartTypesItem) => chartTypesItem.chartTypeID);
                }
            }
            if (selectedIDs) {
                let obj = {
                    title: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM, "Chart Type"),
                    textContent: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM_MESSAGE, selectedIDs.length, "Chart Type"),
                    btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                    canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                };
                let objIDs = {
                    id: selectedIDs
                }
                DialogFactory.confirmDiolog(obj).then((resposne) => {
                    vm.cgBusyLoading = ChartTypeFactory.deleteChartType().query({ objIDs: objIDs }).$promise.then((data) => {
                        if (data.data && data.data.TotalCount > 0) {
                            let alertModel = {
                                title: USER.USER_INFORMATION_LABEL,
                                textContent: CORE.MESSAGE_CONSTANT.DELETE_ALERT_MESSAGE
                            };
                            DialogFactory.alertDialog(alertModel);
                        }
                        else {
                            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                            vm.gridOptions.clearSelectedRows();
                        }
                    }).catch((error) => {
                        return BaseService.getErrorLog(error);
                    });
                }, (cancel) => {
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            }
            else {
                //show validation message no data selected
                let alertModel = {
                    title: USER.USER_ERROR_LABEL,
                    textContent: stringFormat(USER.SELECT_ONE_LABEL, "Chart Types")
                };
                DialogFactory.alertDialog(alertModel);
            }
        };
       
        vm.addEditRecord = (data, ev) => {
            DialogFactory.dialogService(
            CORE.MANAGE_CHART_TYPES_MODAL_CONTROLLER,
            CORE.MANAGE_CHART_TYPES_MODAL_VIEW,
            ev,
            data).then(() => {
            }, (data) => {
                if (data) {
                    BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                }
            },
             (err) => {
             });
        };

        /* delete multiple data called from directive of ui-grid*/
        vm.deleteMultipleData = () => {
            vm.deleteRecord();
        }

        /* Update Chart type */
        vm.updateRecord = (row, ev) => {
            vm.addEditRecord(row.entity, ev);
        };

        //close popup on page destroy 
        $scope.$on('$destroy', function () {
            $mdDialog.hide('', { closeAll: true });
        });
    }
})();