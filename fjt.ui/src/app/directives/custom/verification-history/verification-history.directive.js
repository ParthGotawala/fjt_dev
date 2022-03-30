(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('verificationHistory', verificationHistory);

    /** @ngInject */
    function verificationHistory($timeout, $state, BaseService, CORE, USER, TRANSACTION, ReceivingMaterialFactory) {
        var directive = {
            restrict: 'E',
            replace: false,
            scope: {
                filterTypes: '=?',
                woOPID: '=?',
                umidId: '=?'
            },
            templateUrl: 'app/directives/custom/verification-history/verification-history.html',
            controller: verificationHistoryCtrl,
            controllerAs: 'vm'
        };
        return directive;

        /** @ngInject */
        function verificationHistoryCtrl($scope) {
            const vm = this;
            vm.isHideDelete = true;
            $scope.$parent.vm.currentState = $state.current.name;
            vm.umidId = $scope.umidId;
            vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.VERIFICATIONHISTORY;
            vm.isNoDataFound = true;
            vm.gridConfig = CORE.gridConfig;
            vm.DefaultDateFormat = _dateTimeDisplayFormat;
            vm.VerificationStatus = CORE.VerificationStatus;
            vm.searchFilterData = true;
            vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
            vm.LabelConstant = CORE.LabelConstant;
            vm.loginUser = BaseService.loginUser;
            const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;
            let filterData = 0;
            if ($scope.filterTypes && $scope.filterTypes.isScanUMIDForPreProgramming) {
                /*Used to filter - Scan UMID For Pre-Programming*/
                filterData = 4;
            } else if ($scope.filterTypes && $scope.filterTypes.isScanUMIDOnly) {
                /*Used to filter Scan UMID Only*/
                filterData = 3;
            } else if ($scope.filterTypes && $scope.filterTypes.isScanFeederFirstAndUMIDFirstAndChangeReel) {
                /*Used to filter Scan Feeder First, Scan UMID First, Change Reel */
                filterData = 2;
            } else {
                /*Used to filter
                  UMID to MFR/Supplier PN Label (1D or 2D),
                  UMID to PID Labels,
                  UMID to CPN Labels, UMID to UMID Labels,
                  UMID Label to MFR PN(Without Barcode)*/
                filterData = 1;
            }
            vm.woOPID = $scope.filterTypes && $scope.filterTypes.woOPID ? $scope.filterTypes.woOPID : 0;
            const initPageInfo = () => {
                vm.pagingInfo = {
                    Page: CORE.UIGrid.Page(),
                    SortColumns: [['createdAt', 'DESC']],
                    SearchColumns: [],
                    status: vm.VerificationStatus.Unverified,
                    UID: null,
                    filterType: filterData,
                    woOPID: vm.woOPID
                };
            };

            initPageInfo();

            vm.sourceHeader = [
                {
                    field: '#',
                    width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
                    cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
                    enableFiltering: false,
                    enableSorting: false,
                    enableCellEdit: false,
                    pinnedLeft: true
                },
                {
                    field: 'status',
                    displayName: 'Verification Status',
                    cellTemplate: '<div class="ui-grid-cell-contents">'
                        + '<span class="label-box" \
                              ng-class="{\'label-success\':row.entity.status == grid.appScope.$parent.vm.VerificationStatus.Verified, \
                              \'label-danger\':row.entity.status == grid.appScope.$parent.vm.VerificationStatus.Unverified}"> \
                                  {{ COL_FIELD }}'
                        + '</span>'
                        + '</div>',
                    ColumnDataType: 'StringEquals',
                    width: 165,
                    enableFiltering: false
                },
                {
                    field: 'verificationType',
                    displayName: 'Label Verification Type',
                    width: 180,
                    enableCellEdit: false
                },
                {
                    field: 'scanString1',
                    displayName: 'Scanned Label1',
                    width: 150,
                    enableCellEdit: false
                },
                {
                    field: 'scanString2',
                    displayName: 'Scanned Label2',
                    width: 150,
                    enableCellEdit: false
                },
                {
                    field: 'scanString1MFG',
                    displayName: stringFormat('Scanned Label1 {0}', CORE.LabelConstant.MFG.MFG),
                    width: 200,
                    enableCellEdit: false
                },
                {
                    field: 'scanString1MFGPNID',
                    displayName: stringFormat('Scanned Label1 {0}', CORE.LabelConstant.MFG.MFGPN),
                    cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link ng-if="row.entity.string1PartID" \
                                        component-id="row.entity.string1PartID" \
                                        label="grid.appScope.$parent.vm.LabelConstant.MFG.MFGPN" \
                                        value="row.entity.scanString1MFGPNID" \
                                        is-copy="true" \
                                        rohs-icon="row.entity.rohsIcon1" \
                                        rohs-status="row.entity.string1RohsName" \
                                        is-custom-part="row.entity.string1IsCustomPart" \
                                        is-search-digi-key="true"></common-pid-code-label-link></div>',
                    width: CORE.UI_GRID_COLUMN_WIDTH.PID,
                    enableCellEdit: false
                },
                {
                    field: 'string1CustPN',
                    displayName: 'Scanned Label1 CPN(Component)',
                    width: CORE.UI_GRID_COLUMN_WIDTH.PID,
                    cellTemplate: '<div class= "ui-grid-cell-contents"> <common-pid-code-label-link \
                                  component-id="row.entity.string1CustPNID" \
                                  label="grid.appScope.$parent.vm.LabelConstant.MFG.PID" \
                                  value="row.entity.string1CustPNPIDCode" \
                                  is-copy="true" \
                                  is-mfg="true" \
                                  mfg-label="grid.appScope.$parent.vm.LabelConstant.MFG.CPN" \
                                  mfg-value="row.entity.string1CustPN" \
                                  rohs-icon="row.entity.string1CustPNRohsIcon" \
                                  rohs-status="row.entity.string1CustPNRohsName" \
                                  is-copy-ahead-label="true" \
                                  is-search-findchip="false" \
                                  is-search-digi-key="false"> \
                                  </common-pid-code-label-link></div>',
                    enableCellEdit: false,
                    allowCellFocus: false
                },
                {
                    field: 'scanString2MFG',
                    displayName: stringFormat('Scanned Label2 {0}', CORE.LabelConstant.MFG.MFG),
                    width: 200,
                    enableCellEdit: false
                },
                {
                    field: 'scanString2MFGPNID',
                    displayName: stringFormat('Scanned Label2 {0}', CORE.LabelConstant.MFG.MFGPN),
                    cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link ng-if="row.entity.string2PartID" \
                                        component-id="row.entity.string2PartID" \
                                        label="grid.appScope.$parent.vm.LabelConstant.MFG.MFGPN" \
                                        value="row.entity.scanString2MFGPNID" \
                                        is-copy="true" \
                                        rohs-icon="row.entity.rohsIcon2" \
                                        rohs-status="row.entity.string2RohsName" \
                                        is-custom-part="row.entity.string2IsCustomPart" \
                                        is-search-digi-key="true"></common-pid-code-label-link></div>',
                    width: CORE.UI_GRID_COLUMN_WIDTH.PID,
                    enableCellEdit: false
                },
                {
                    field: 'string2CustPN',
                    displayName: 'Scanned Label2 CPN(Component)',
                    width: CORE.UI_GRID_COLUMN_WIDTH.PID,
                    cellTemplate: '<div class= "ui-grid-cell-contents"> <common-pid-code-label-link \
                                  component-id="row.entity.string2CustPNID" \
                                  label="grid.appScope.$parent.vm.LabelConstant.MFG.PID" \
                                  value="row.entity.string2CustPNPIDCode" \
                                  is-copy="true" \
                                  is-mfg="true" \
                                  mfg-label="grid.appScope.$parent.vm.LabelConstant.MFG.CPN" \
                                  mfg-value="row.entity.string2CustPN" \
                                  rohs-icon="row.entity.string2CustPNRohsIcon" \
                                  rohs-status="row.entity.string2CustPNRohsName" \
                                  is-copy-ahead-label="true" \
                                  is-search-findchip="false" \
                                  is-search-digi-key="false"> \
                                  </common-pid-code-label-link></div>',
                    enableCellEdit: false,
                    allowCellFocus: false
                },
                {
                    field: 'createdByName',
                    displayName: 'Scan Label By',
                    enableCellEdit: false,
                    width: 130
                },
                {
                    field: 'createdAt',
                    width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
                    displayName: 'Scan Time',
                    cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD| date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
                    type: 'datetime',
                    enableFiltering: true
                },
                {
                    field: 'unlockByName',
                    displayName: 'Screen Unlocked By',
                    enableCellEdit: false,
                    width: 130
                    //exporterSuppressExport: vm.pagingInfo.status == vm.VerificationStatus.Unverified ? false : true
                },
                {
                    field: 'unLockNotes',
                    displayName: 'Screen Unlock Notes',
                    width: 200,
                    cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
                    enableCellEdit: false
                },
                {
                    field: 'updatedAt',
                    width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
                    displayName: 'Screen Unlocked Time',
                    cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-if="row.entity.status == grid.appScope.$parent.vm.VerificationStatus.Unverified">{{COL_FIELD| date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
                    type: 'datetime',
                    enableFiltering: true,
                    enableSorting: true
                }, {
                    field: 'updatedbyRole',
                    displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
                    cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                    width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
                    type: 'StringEquals',
                    enableFiltering: true
                }, {
                    field: 'createdbyRole',
                    displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
                    cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                    width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
                    type: 'StringEquals',
                    enableFiltering: true
                }
            ];

            // remove specific field from display in case of scan UMID in traveler pre-programming
            if ($scope.filterTypes && $scope.filterTypes.isScanUMIDForPreProgramming) {
                const removeItem = ['scanString2', 'scanString2MFG', 'scanString2MFGPNID', 'string2CustPN'];
                _.remove(vm.sourceHeader, (obj) => removeItem.includes(obj.field));
            }

            vm.gridOptions = {
                enablePaging: isEnablePagination,
                enablePaginationControls: isEnablePagination,
                showColumnFooter: false,
                enableRowHeaderSelection: false,
                enableFullRowSelection: false,
                enableRowSelection: true,
                multiSelect: false,
                filterOptions: vm.pagingInfo.SearchColumns,
                exporterMenuCsv: true,
                enableCellEdit: false,
                enableCellEditOnFocus: true,
                exporterCsvFilename: 'VerificationHistory.csv'
            };

            function setDataAfterGetAPICall(verificationhistory, isGetDataDown) {
                if (verificationhistory && verificationhistory.data.history) {
                    if (!isGetDataDown) {
                        vm.sourceData = verificationhistory.data.history;
                        vm.currentdata = vm.sourceData.length;
                    }
                    else if (verificationhistory.data.history.length > 0) {
                        vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(verificationhistory.data.history);
                        vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
                    }
                    // must set after new data comes
                    vm.totalSourceDataCount = verificationhistory.data.Count;
                    if (!isGetDataDown && vm.sourceData && vm.sourceData.length > 0) {
                        _.map(vm.sourceData, (data) => {
                            data.rohsIcon1 = stringFormat('{0}{1}', vm.rohsImagePath, data.string1RohsIcon);
                            data.rohsIcon2 = stringFormat('{0}{1}', vm.rohsImagePath, data.string2RohsIcon);

                            data.string1CustPNRohsIcon = stringFormat('{0}{1}', vm.rohsImagePath, data.string1CustPNRohsIcon);
                            data.string2CustPNRohsIcon = stringFormat('{0}{1}', vm.rohsImagePath, data.string2CustPNRohsIcon);
                        });
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
                        if (vm.pagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode) || vm.searchFilterData) {
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

            /* Retrieve verification history*/
            vm.loadData = () => {
                if (vm.pagingInfo.SortColumns.length === 0) {
                    vm.pagingInfo.SortColumns = [['id', 'DESC']];
                }
                vm.pagingInfo.umidId = vm.umidId;
                BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
                vm.cgBusyLoading = ReceivingMaterialFactory.verificationHistory().query(vm.pagingInfo).$promise.then((response) => {
                    if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                        setDataAfterGetAPICall(response, false);
                    }
                }).catch((error) => BaseService.getErrorLog(error));
            };

            /* load more data on mouse scroll */
            vm.getDataDown = () => {
                vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
                vm.cgBusyLoading = ReceivingMaterialFactory.verificationHistory().query(vm.pagingInfo).$promise.then((response) => {
                    if (response) {
                        setDataAfterGetAPICall(response, true);
                    }
                }).catch((error) => BaseService.getErrorLog(error));
            };

            vm.searchHistory = () => {
                vm.searchFilterData = true;
                vm.pagingInfo.Page = CORE.UIGrid.Page();
                vm.loadData();
            };


            vm.resetHistoryFilter = () => {
                vm.pagingInfo.Page = CORE.UIGrid.Page();
                vm.pagingInfo.status = vm.VerificationStatus.Unverified;
                vm.pagingInfo.UID = null;
                vm.gridOptions.gridApi.grid.clearAllFilters();
                vm.loadData();
            };
        }
    }
})();
