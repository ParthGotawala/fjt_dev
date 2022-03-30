(function () {
    'use strict';

    angular
        .module('app.core')
        .controller('PurchaseOrderReceivedQtyDetailsController', PurchaseOrderReceivedQtyDetailsController);

    /** @ngInject */
    function PurchaseOrderReceivedQtyDetailsController($mdDialog, $timeout, CORE, USER, TRANSACTION, data, PurchaseOrderFactory, BaseService, uiGridGroupingConstants) {
        const vm = this;
        vm.isHideDelete = true;
        vm.PageName = CORE.PURCHASE_ORDER_RECEIVED_QTY_DETAILS_POPUP_TITLE;
        vm.DefaultDateTimeFormat = _dateTimeDisplayFormat;
        vm.DefaultDateFormat = _dateDisplayFormat;
        vm.gridID = CORE.gridConfig.gridReceivedQtyDetails;
        vm.LabelConstant = CORE.LabelConstant;
        vm.PackingSlipLocked = TRANSACTION.CustomerPaymentLockStatus.Locked;
        vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
        vm.loginUser = BaseService.loginUser;
        const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
        vm.PopupData = data;

        vm.goToMFGList = () => BaseService.goToManufacturerList();
        vm.goToManufacturerDetail = () => BaseService.goToManufacturer(vm.PopupData.mfgCodeID);

        vm.goToPartList = () => BaseService.goToPartList();
        vm.goToPartDetail = () => BaseService.goToComponentDetailTab(null, vm.PopupData.partID);

        vm.goToPurchaseOrderNumber = () => BaseService.goToPurchaseOrderList();
        vm.goToManagePurchaseOrder = () => BaseService.goToPurchaseOrderDetail(vm.PopupData.poId);

        vm.goToManagePackingSlipDetail = (id) => BaseService.goToManagePackingSlipDetail(id);

        vm.close = () => $mdDialog.cancel();

        vm.sourceHeader = [
            {
                field: '#',
                width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
                cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
                enableFiltering: false,
                enableSorting: false
            },
            {
                field: 'packingSlipSerialNumber',
                width: '90',
                displayName: vm.LabelConstant.PACKING_SLIP.PSLineNumber,
                cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
                reeAggregationType: uiGridGroupingConstants.aggregation.SUM,
                footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right" >{{grid.appScope.$parent.vm.getTotalLineItems()}}</div>'
            },
            {
                field: 'packingSlipStatus',
                displayName: vm.LabelConstant.PACKING_SLIP.PackingSlipStatus,
                cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
                    + '<span class="label-box" \
                        ng-class="{\'label-danger\':row.entity.status == \'I\' ,\
                                   \'label-warning\':row.entity.status == \'W\', \
                                    \'label-info\':row.entity.status == \'IR\', \
                                     \'label-success\':row.entity.status == \'A\' ,\
                                      \'bg-purple\':row.entity.status == \'PP\' ,\
                                       \'label-primary\':row.entity.status == \'P\' ,\
                                         }"> \
                                            {{COL_FIELD}}'
                    + '</span>'
                    + '</div>',
                width: 180,
                ColumnDataType: 'StringEquals',
                enableFiltering: false,
                enableSorting: true
            },
            {
                field: 'packingSlipNumber',
                width: '200',
                displayName: vm.LabelConstant.PACKING_SLIP.PackingSlipNumber,
                cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                              <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToManagePackingSlipDetail(row.entity.id);" tabindex="-1">{{COL_FIELD}}</a>\
                              <copy-text label="grid.appScope.$parent.vm.LabelConstant.PACKING_SLIP.PackingSlipNumber" text="row.entity.packingSlipNumber"></copy-text>\
                              <md-icon md-font-icon="" class= "material-icons mat-icon icon-lock" ng-if="row.entity.lockStatus === grid.appScope.$parent.vm.PackingSlipLocked" style="margin-left:5px !important;"> </md-icon>\
                           </div>'
            },
            {
                field: 'packingSlipDate',
                displayName: vm.LabelConstant.PACKING_SLIP.PackingSlipDate,
                width: 120,
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
                type: 'date',
                enableFiltering: false
            },
            {
                field: 'supplierSONumber',
                width: '150',
                displayName: CORE.LabelConstant.SalesOrder.SO,
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
            },
            {
                field: 'soDate',
                displayName: vm.LabelConstant.SalesOrder.SODate,
                width: 90,
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
                type: 'date',
                enableFiltering: false
            },
            {
                field: 'receiptDate',
                displayName: vm.LabelConstant.PACKING_SLIP.MaterialReceiptDate,
                width: 120,
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
                type: 'date',
                enableFiltering: false
            },
            {
                field: 'packaging',
                width: '120',
                displayName: vm.LabelConstant.PACKING_SLIP.Packaging,
                cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>'
            },
            {
                field: 'receivedQty',
                width: 150,
                displayName: vm.LabelConstant.PACKING_SLIP.ReceivedQty,
                cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right rec-qty">{{COL_FIELD | numberWithoutDecimal}}</div>',
                treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
                footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right rec-qty" >{{grid.appScope.$parent.vm.getQtySum("receivedQty")}}</div>'
            },
            {
                field: 'packingSlipQty',
                width: 120,
                displayName: vm.LabelConstant.PACKING_SLIP.PackingSlipQty,
                cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
                treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
                footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right" >{{grid.appScope.$parent.vm.getQtySum("packingSlipQty")}}</div>'
            },
            {
                field: 'bin',
                width: '150',
                displayName: CORE.LabelConstant.TransferStock.Bin,
                cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>'
            },
            {
                field: 'warehouse',
                width: '150',
                displayName: CORE.LabelConstant.TransferStock.WH,
                cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>'
            },
            {
                field: 'parentWarehouse',
                width: 200,
                displayName: CORE.LabelConstant.TransferStock.ParentWH,
                cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>'
            },
            {
                field: 'unit',
                width: '80',
                displayName: 'Unit',
                cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | unit }}</div>'
            },
            {
                field: 'uomName',
                width: '160',
                displayName: 'UOM',
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
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
                field: 'createdByName',
                displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
                type: 'StringEquals',
                enableFiltering: true
            }
        ];

        vm.pagingInfo = {
            Page: CORE.UIGrid.Page(),
            SortColumns: [],
            SearchColumns: []
        };

        vm.headerdata = [{
            label: vm.LabelConstant.MFG.MFG,
            value: vm.PopupData.mfgName,
            displayOrder: 1,
            labelLinkFn: vm.goToMFGList,
            valueLinkFn: vm.goToManufacturerDetail,
            isCopy: true
        }, {
            label: vm.LabelConstant.MFG.MFGPN,
            value: vm.PopupData.mfgPN,
            displayOrder: 2,
            labelLinkFn: vm.goToPartList,
            valueLinkFn: vm.goToPartDetail,
            isCopy: true,
            isAssy: vm.PopupData.iscustom,
            imgParms: {
                imgPath: stringFormat('{0}{1}', vm.rohsImagePath, vm.PopupData.rohsIcon),
                imgDetail: vm.PopupData.rohsName
            }
        }, {
            label: vm.LabelConstant.MFG.PID,
            value: vm.PopupData.PIDCode,
            displayOrder: 3,
            labelLinkFn: vm.goToPartList,
            valueLinkFn: vm.goToPartDetail,
            isCopy: true,
            isCopyAheadLabel: true,
            isAssy: vm.PopupData.iscustom,
            imgParms: {
                imgPath: stringFormat('{0}{1}', vm.rohsImagePath, vm.PopupData.rohsIcon),
                imgDetail: vm.PopupData.rohsName
            },
            isCopyAheadOtherThanValue: true,
            copyAheadLabel: vm.LabelConstant.MFG.MFGPN,
            copyAheadValue: vm.PopupData.mfgPN
        }, {
            label: vm.LabelConstant.PURCHASE_ORDER.PO,
            value: vm.PopupData.poNumber,
            displayOrder: 4,
            labelLinkFn: vm.PopupData.poId ? vm.goToPurchaseOrderNumber : null,
            valueLinkFn: vm.PopupData.poId ? vm.goToManagePurchaseOrder : null,
            isCopy: true
        }, {
            label: 'Order Qty',
            value: vm.PopupData.qty,
            displayOrder: 5
        }, {
            label: vm.LabelConstant.PURCHASE_ORDER.ReceivedQty,
            value: vm.PopupData.receivedQty,
            displayOrder: 6
        }, {
            label: vm.LabelConstant.PURCHASE_ORDER.OpenQty,
            value: vm.PopupData.pendingQty,
            displayOrder: 7
        }];

        vm.gridOptions = {
            enablePaging: isEnablePagination,
            enablePaginationControls: isEnablePagination,
            showColumnFooter: false,
            enableRowHeaderSelection: false,
            enableFullRowSelection: false,
            enableRowSelection: false,
            multiSelect: false,
            isHideDelete: true,
            filterOptions: vm.pagingInfo.SearchColumns,
            exporterMenuCsv: true,
            allowToExportAllData: true,
            exporterCsvFilename: `${vm.PageName}.csv`,
            exporterAllDataFn: () => {
                const pagingInfoOld = _.clone(vm.pagingInfo);
                pagingInfoOld.pageSize = 0;
                pagingInfoOld.Page = 1;
                vm.gridOptions.isExport = pagingInfoOld.isExport = true;
                vm.pagingInfo.refPODetID = vm.PopupData.id;
                vm.pagingInfo.refReleaseLineID = vm.PopupData.refReleaseLineID || null;
                return PurchaseOrderFactory.getAllPackingSlipByPODetID().query(pagingInfoOld).$promise.then((response) => {
                    if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                        if (response && response.data && response.data.packingSlips) {
                            setDataAfterGetAPICall(response.data, false);
                            return response.data.packingSlips;
                        }
                    }
                }).catch((error) => BaseService.getErrorLog(error));
            }
        };
        // to set data in grid after data is retrived from API in loadData() and getDataDown() function
        const setDataAfterGetAPICall = (data, isGetDataDown) => {
            if (!isGetDataDown) {
                vm.sourceData = data.packingSlips;
                vm.currentdata = vm.sourceData.length;
            }
            else if (data.packingSlips.length > 0) {
                vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(data.packingSlips);
                vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
            }
            // must set after new data comes
            vm.totalSourceDataCount = data.Count;
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
        };

        /* retrieve purchase order changes history list*/
        vm.loadData = () => {
            BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
            vm.pagingInfo.refPODetID = vm.PopupData.id;
            vm.pagingInfo.refReleaseLineID = vm.PopupData.refReleaseLineID || null;
            vm.pagingInfo.poNumber = vm.PopupData.poNumber || null;
            vm.pagingInfo.partID = vm.PopupData.partID || null;
            vm.pagingInfo.refPOLineID = vm.PopupData.refPOLineID || null;
            vm.cgBusyLoading = PurchaseOrderFactory.getAllPackingSlipByPODetID().query(vm.pagingInfo).$promise.then((response) => {
                if (response && response.data && response.data.packingSlips) {
                    setDataAfterGetAPICall(response.data, false);
                }
            }).catch((error) => BaseService.getErrorLog(error));
        };

        vm.getDataDown = () => {
            vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
            vm.pagingInfo.refPODetID = vm.PopupData.id;
            vm.pagingInfo.refReleaseLineID = vm.PopupData.refReleaseLineID || null;
            vm.cgBusyLoading = PurchaseOrderFactory.getAllPackingSlipByPODetID().query(vm.pagingInfo).$promise.then((response) => {
                if (response && response.data && response.data.packingSlips) {
                    setDataAfterGetAPICall(response.data, true);
                }
            }).catch((error) => BaseService.getErrorLog(error));
        };
    }
})();
