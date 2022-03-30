(function () {
    'use strict';

    angular
        .module('app.transaction.requestforship')
        .controller('RequestForShipListController', RequestForShipListController);

    /** @ngInject */
    function RequestForShipListController($mdDialog, $scope, $timeout, $state, TRANSACTION, CORE, RequestForShipFactory, DialogFactory, BaseService, USER) {
        const vm = this;

        vm.isUpdatable = true;        
        vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.REQUEST_FOR_SHIP_LIST;
        vm.DefaultDateFormat = _dateDisplayFormat;
        vm.gridConfig = CORE.gridConfig;
        vm.LabelConstant = CORE.LabelConstant;
        vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
        vm.statusGridHeaderDropdown = [{ id: null, value: 'All' }];

        for (var item in CORE.SHIPPING_REQUEST_STATUS_DROPDOWN) {       
            vm.statusGridHeaderDropdown.push({ id: item, value: item });
        }

        vm.verificationStatusGridHeaderDropdown = [{ id: null, value: 'All' }].concat(CORE.SHIPPING_REQUEST_VERIFY_STATUS);


        vm.sourceHeader = [{
            field: 'Action',
            cellClass: 'gridCellColor',
            displayName: 'Action',
            width: '80',
            cellTemplate: `<grid-action-view grid="grid" row="row"></grid-action-view>`,
            enableFiltering: false,
            enableSorting: false,
            exporterSuppressExport: true,
            pinnedLeft: true
          },
          {
            field: '#',
            width: '70',
            cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
            enableFiltering: false,
            enableSorting: false,
          },
          {
            field: 'note',
            displayName: 'Subject',
            width: 300,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
          },
          {
            field: 'mfgName',
            displayName: 'Customer',
            width: 200,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
          },
          {
            field: 'PIDCode',
            displayName: vm.LabelConstant.Assembly.ID,
            cellTemplate: ' <div class= "ui-grid-cell-contents" > <common-pid-code-label-link \
                            component-id="row.entity.partMasterID" \
                            label="grid.appScope.$parent.vm.LabelConstant.Assembly.ID" \
                            value="row.entity.PIDCode" \
                            is-copy="true" \
                            is-mfg="true" \
                            mfg-label="grid.appScope.$parent.vm.LabelConstant.Assembly.MFGPN" \
                            mfg-value="row.entity.mfgPN" \
                            rohs-icon="row.entity.rohsIcon" \
                            rohs-status="row.entity.rohsName" \
                            is-copy-ahead-label="true" \
                            is-assembly="true"></common-pid-code-label-link></div>',
            width: CORE.UI_GRID_COLUMN_WIDTH.PID
          },
          {
            field: 'woNumber',
            displayName: 'WO#',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: 100
          },
          {
            field: 'buildQty',
            displayName: 'Build Qty',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: 100
          },
          {
            field: 'ShippedQty',
            displayName: 'Shipped Qty',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: 90
          },
          {
            field: 'qty',
            displayName: 'Requested for Shipment Qty',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: 105
          },
          {
            field: 'apprvCount',
            displayName: 'Count for Request Approval Sent',
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right"> \
                            <a tabindex="-1" ng-class="{\'red\': row.entity.kitReleasePlanCount <= 0}" class="text-underline cursor-pointer" ng-click="grid.appScope.$parent.vm.goToApprovalTab(row, $event)"> \
                              {{ COL_FIELD }} \
                            </a> \
                        <md-tooltip md-direction="top">Plan Kit</md-tooltip> \
                        </div >',
            width: 150
          },
          {
            field: 'status',
            displayName: 'Status',
            cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
              + '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.status == \'Published\', \
                            \'label-warning\':row.entity.status == \'Draft\'}"> \
                                {{COL_FIELD}}'
              + '</span>'
              + '</div>',
            filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
            filter: {
              term: null,
              options: vm.statusGridHeaderDropdown
            },
            width: 125
          }, 
          {
            field: 'verificationStatus',
            displayName: 'Verification Status',
            cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.verificationStatus == \'Verified\', \
                            \'label-warning\':row.entity.verificationStatus == \'Pending\'}"> \
                                {{COL_FIELD}}'
            + '</span>'
            + '</div>',
            filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
            filter: {
                term: null,
                options: vm.verificationStatusGridHeaderDropdown
            },
            width: 120
          },
          {
            field: 'requestDate',
            displayName: 'Request Date',
            type: 'date',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date: grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
            width: CORE.UI_GRID_COLUMN_WIDTH.ONLY_DATE_COLUMN,
            enableFiltering: false,
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
            field: 'updatedby',
            displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
            type: 'StringEquals',
            enableFiltering: true,
          },
          {
            field: 'updatedbyRole',
            displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
            type: 'StringEquals',
            enableFiltering: true,
          },
          {
            field: 'createdAt',
            displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
            type: 'datetime',
            enableFiltering: false
          }
        ];

        //init paging info
        let initPageInfo = () => {
            vm.pagingInfo = {
                Page: CORE.UIGrid.Page(),
                SortColumns: [['requestDate', 'DESC']],
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
            exporterCsvFilename: 'Request For Shipment.csv',
        };

        /* retrieve Users list*/
        vm.loadData = () => {
            vm.cgBusyLoading = RequestForShipFactory.getShippingRequest(vm.pagingInfo).query().$promise.then((response) => {
                if (response.status == CORE.ApiResponseTypeStatus.SUCCESS) {
                    vm.sourceData = response.data.data;
                  

                    vm.sourceData.forEach((item) => {
                      item.rohsIcon = vm.rohsImagePath + item.rohsIcon;                      
                      //if (item.statusID == CORE.SHIPPING_REQUEST_STATUS_DROPDOWN.Published)
                      //      item.isDisabledUpdate = true;
                    });

                    vm.totalSourceDataCount = response.data.Count;
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
            vm.cgBusyLoading = RequestForShipFactory.getShippingRequest(vm.pagingInfo).query().$promise.then((response) => {
                if (response && response.data) {

                    response.data.data.forEach((item) => {
                        item.rohsIcon = vm.rohsImagePath + item.rohsIcon;                      
                        //if (item.status == "PUBLISHED")
                        //    item.isDisabledUpdate = true;
                    });

                    vm.sourceData = vm.sourceData.concat(response.data.data);
                    vm.currentdata = vm.sourceData.length;
                    vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
                    $timeout(() => {
                        vm.resetSourceGrid();
                        return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount != vm.currentdata ? true : false);
                    });
                }
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        };

        // add new request
        vm.addRecord = ($event) => {            
          $state.go(TRANSACTION.TRANSACTION_MANAGE_DETAIL_STATE, { id: null });          
        };


        //update request
        vm.updateRecord = (row, ev) => {            
            $state.go(TRANSACTION.TRANSACTION_MANAGE_DETAIL_STATE, { id: row.entity.id });    
        };

       
        //delete request detail
        vm.deleteRecord = (entity) => {
          let selectedIDs = [];
            if (entity) {
                selectedIDs.push(entity.id);
            } else {
                vm.selectedRows = vm.selectedRowsList;
                if (vm.selectedRows.length > 0) {
                    selectedIDs = vm.selectedRows.map((item) => item.dtlID);
                }
            }

            if (selectedIDs) {
                let objIDs = {
                    id: selectedIDs,
                    CountList: false,
                }
                let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
                messageContent.message = stringFormat(messageContent.message, "Shipping request", selectedIDs.length);
                let obj = {
                    messageContent : messageContent,
                    btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                    canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                };
                DialogFactory.messageConfirmDialog(obj).then((yes) => {
                    if (yes) {
                        vm.cgBusyLoading = RequestForShipFactory.deleteRequestForShip().save({
                            objIDs: objIDs,
                        }).$promise.then((response) => {
                            reloadGrid();                           
                        }).catch((error) => {
                            return BaseService.getErrorLog(error);
                        });
                    }
                }, (cancel) => {
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            }
        };

        vm.deleteMultipleData = () => {
            vm.deleteRecord();
        }

        function reloadGrid() {
            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
            vm.gridOptions.clearSelectedRows();
        }

        //On approval count go to approval tab
        vm.goToApprovalTab=(row, event)=>{
          $state.go(TRANSACTION.TRANSACTION_MANAGE_APPROVAL_STATE, { id: row.entity.id }); 
        }
        //close popup on page destroy 
        $scope.$on('$destroy', function () {
            $mdDialog.hide(false, { closeAll: true });
        });
    }

})();
