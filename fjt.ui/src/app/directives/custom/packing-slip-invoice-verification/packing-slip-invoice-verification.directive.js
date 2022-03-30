(function () {
    'use sctrict';
    angular
        .module('app.core')
        .directive('packingSlipInvoiceVerification', packingSlipInvoiceVerification);

    /** @ngInject */
    function packingSlipInvoiceVerification(CORE, $mdDialog, $filter, PackingSlipFactory) {
        var directive = {
            restrict: 'E',
            replace: true,
            scope: {
                packingSlipData: "=",
                invoicePackingDetailForm: "="
            },
            templateUrl: 'app/directives/custom/packing-slip-invoice-verification/packing-slip-invoice-verification.html',
            controller: packingSlipInvoiceVerificationCtrl,
            controllerAs: 'vm'
        };
        return directive;

        /** @ngInject */
        function packingSlipInvoiceVerificationCtrl($scope, $element, $attrs, $timeout, $filter, CORE, USER, TRANSACTION, RFQTRANSACTION, uiGridGroupingConstants, DialogFactory, BaseService) {
            var vm = this;
            vm.CORE = CORE;
            vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
            //vm.invoicePackingDetail = $scope.invoicePackingDetailForm;
            //$scope.invoicePackingDetailForm = vm.invoicePackingDetail;
            //vm.sourceData = $scope.invoiceSourceList;

            vm.DefaultDateFormat = _dateDisplayFormat;
            vm.packingSlipData = $scope.packingSlipData;
            //$scope.invoiceForm = vm.invoicePackingList;

            //vm.packingSlipData.receiptDate = $filter('date')(vm.packingSlipData.receiptDate, vm.DefaultDateFormat);
            //vm.packingSlipData.packingSlipDate = $filter('date')(vm.packingSlipData.packingSlipDate, vm.DefaultDateFormat);
            vm.packingSlipData.invoiceDate = $filter('date')(vm.packingSlipData.invoiceDate, vm.DefaultDateFormat);
            vm.packingSlipData.creditMemoDate = $filter('date')(vm.packingSlipData.creditMemoDate, vm.DefaultDateFormat);
            vm.packingSlipData.debitMemoDate = $filter('date')(vm.packingSlipData.debitMemoDate, vm.DefaultDateFormat);
            vm.isHideDelete = true;
            vm.isUpdatable = true;
            vm.recordUpdate = false;
            vm.packingInvoiceData = {
                updateMaterialType: true,
            };
            vm.formInvoice = false;
            vm.VerificationGridHeaderDropdown = CORE.InvoiceApproveStatusOptionsGridHeaderDropdown;
            vm.InvoiceApproveMemoOptionsGridHeaderDropdown = CORE.InvoiceApproveMemoOptionsGridHeaderDropdown;
            vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
            vm.packaging_Charges_List = CORE.packaging_Charges_List;
            vm.RadioGroup = {
                type: {
                    array: TRANSACTION.TypeOfUpdateMaterial
                }
            }
            let objOfLineItem = {};
            vm.DefaultDateFormat = _dateDisplayFormat;
            let unitDecimal = _unitPriceFilterDecimal;
            let amountDecimal = _amountFilterDecimal;
            vm.PackingSlipStatus = CORE.PackingSlipStatus;

            //vm.invoicePackingDetail = vm.invoicePackingDetail.$dirty;

            let initPageInfo = () => {
                vm.pagingInfo = {
                    Page: CORE.UIGrid.Page(),
                    SortColumns: [['packingSlipSerialNumber', 'ASC']],
                    SearchColumns: [],
                    pageName: CORE.PAGENAME_CONSTANT[7].PageName,
                    packingSlipID: vm.packingSlipData.id
                };
            }
            initPageInfo();

            vm.gridOptions = {
                showColumnFooter: true,
                enableRowHeaderSelection: false,
                enableFullRowSelection: false,
                enableRowSelection: true,
                multiSelect: true,
                filterOptions: vm.pagingInfo.SearchColumns,
                exporterMenuCsv: true,
                enableCellEdit: false,
                enableCellEditOnFocus: true,
                exporterCsvFilename: 'Supplier Invoice.csv'
            };

            vm.sourceHeader = [
                {
                    field: 'Action',
                    cellClass: 'layout-align-center-center',
                    displayName: 'Action',
                    width: '80',
                    cellTemplate: `<grid-action-view grid="grid" row="row" ng-if="row.visible"></grid-action-view>`,
                    enableFiltering: false,
                    enableSorting: false,
                    exporterSuppressExport: true,
                    pinnedLeft: true
                },
                {
                    field: 'packingSlipSerialNumber',
                    width: '160',
                    displayName: 'Packing Slip Line#',
                    cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                    footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right">{{grid.appScope.$parent.vm.getTotalLineItems()}}</div>'
                },
                {
                    field: 'mfgPN',
                    displayName: CORE.LabelConstant.MFG.MFGPN,
                    cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link ng-if="row.entity.partID" \
                                    component-id="row.entity.partID" \
                                    label="grid.appScope.$parent.vm.CORE.LabelConstant.MFG.MFGPN" \
                                    value="row.entity.mfgPN" \
                                    is-copy="true" \
                                    rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.rohsIcon" \
                                    rohs-status="row.entity.rohsName" \
                                    is-custom-part="row.entity.isCustom"\
                                    supplier-name="grid.appScope.$parent.vm.packingSlipData && grid.appScope.$parent.vm.packingSlipData.mfgCodemst ? grid.appScope.$parent.vm.packingSlipData.mfgCodemst.mfgName : null" \
                                    is-search-findchip="true"></common-pid-code-label-link></div>',
                    width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
                    allowCellFocus: false,
                    ColumnDataType: 'StringEquals'
                },
                //{
                //    field: 'unit',
                //    width: '80',
                //    displayName: 'Unit',
                //    cellTemplate: '<div class="ui-grid-cell-contents ">{{COL_FIELD | number:4 }}</div>',
                //},
                //{
                //    field: 'uomName',
                //    width: '160',
                //    displayName: 'UOM',
                //    cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                //},
                {
                    field: 'otherChargesValue',
                    width: '100',
                    displayName: 'Other Charges',
                    cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
                },
                {
                    field: 'packingSlipQty',
                    displayName: 'Packing Slip Qty',
                    width: '120',
                    cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal }}</div>',
                    footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right" >{{grid.appScope.$parent.vm.getQtySum("packingSlipQty")}}</div>'
                },
                {
                    field: 'receivedQty',
                    displayName: 'Received Qty',
                    width: '120',
                    cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal }}</div>',
                    footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right" >{{grid.appScope.$parent.vm.getQtySum("receivedQty")}}</div>'
                },
                {
                    field: 'invoicePrice',
                    displayName: 'Invoice Price',
                    width: '120',
                    cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="COL_FIELD">{{COL_FIELD | unitPrice }}</div><div class="ui-grid-cell-contents grid-cell-text-right" ng-if="!COL_FIELD">${{COL_FIELD}}</div>',
                    footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right" >{{grid.appScope.$parent.vm.getFooterTotal("invoicePrice")}}</div>'
                },
                {
                    field: 'purchasePrice',
                    displayName: 'Agreed Purchase Unit Price $',
                    width: '140',
                    cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="COL_FIELD">{{COL_FIELD | unitPrice }}</div><div class="ui-grid-cell-contents grid-cell-text-right" ng-if="!COL_FIELD">${{COL_FIELD}}</div>',
                    footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right" >{{grid.appScope.$parent.vm.getFooterTotal("purchasePrice")}}</div>'
                },
                {
                    field: 'extendedPrice',
                    displayName: 'Material Extended Charges $',
                    width: '140',
                    treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
                    cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="COL_FIELD">{{COL_FIELD | amount }}</div><div class="ui-grid-cell-contents grid-cell-text-right" ng-if="!COL_FIELD">${{COL_FIELD}}</div>',
                    footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right">{{grid.appScope.$parent.vm.getFooterTotal("extendedPrice")}}</div>'
                },
                {
                    field: 'invoiceVerificationStatus',
                    displayName: 'Verification Action',
                    cellTemplate: '<md-button class="md-primary md-raised margin-0" ng-if="row.entity.status == \'D\'" ng-click="grid.appScope.$parent.vm.verifiedRecord(row, $event)"> \
                                   Approve \
                                </md-button>',
                    enableFiltering: false,
                    enableSorting: false,
                    width: '120',
                    enableCellEdit: false
                },
                {
                    field: 'invoiceVerificationStatus',
                    displayName: 'Charged Status',
                    width: '160',
                    cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
                        + '<span class="label-box" \
                                        ng-class="{\'label-success\':row.entity.status == \'A\', \
                                                  \'label-warning\':row.entity.status == \'P\', \
                                                  \'label-danger\':row.entity.status == \'D\'}"> \
                                        {{ COL_FIELD }}'
                        + '</span>'
                        + '</div>',
                    filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
                    filter: {
                        term: null,
                        options: vm.VerificationGridHeaderDropdown
                    },
                    ColumnDataType: 'StringEquals',
                    enableFiltering: true,
                    enableSorting: false
                },
                {
                    field: 'approveNote',
                    displayName: 'Approve Note',
                    cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.approveNote" ng-click="grid.appScope.$parent.vm.showApproveNote(row.entity, $event)"> \
                                        View \
                                    </md-button>',
                    enableFiltering: false,
                    enableSorting: false,
                    width: '100',
                    enableCellEdit: false,
                },
                {
                    field: 'receiptTypeName',
                    displayName: 'Memo Type',
                    width: '140',
                    cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
                        + '<span class="label-box" \
                                        ng-class="{\'label-success\':row.entity.receiptType == \'C\', \
                                                  \'label-warning\':row.entity.receiptType == \'D\'}"> \
                                        {{ COL_FIELD }}'
                        + '</span>'
                        + '</div>',
                    filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
                    filter: {
                        term: null,
                        options: vm.InvoiceApproveMemoOptionsGridHeaderDropdown
                    },
                    ColumnDataType: 'StringEquals',
                    enableFiltering: true,
                    enableSorting: false,
                },
                {
                    field: 'creditMemoNumber',
                    displayName: 'Credit Memo Number',
                    width: '140',
                    cellTemplate: '<div class="ui-grid-cell-contents" ng-if="row.entity.receiptType == \'C\'">{{COL_FIELD}}</div>',
                },
                {
                    field: 'creditMemoDate',
                    displayName: 'Credit Memo Date',
                    width: '120',
                    cellTemplate: '<div class="ui-grid-cell-contents" ng-if="row.entity.receiptType == \'C\'">{{COL_FIELD | date: grid.appScope.$parent.vm.DefaultDateFormat }}</div>',
                },
                {
                    field: 'debitMemoNumber',
                    displayName: 'Debit Memo Number',
                    width: '140',
                    cellTemplate: '<div class="ui-grid-cell-contents" ng-if="row.entity.receiptType == \'D\'">{{COL_FIELD}}</div>',
                },
                {
                    field: 'debitMemoDate',
                    displayName: 'Debit Memo Date',
                    width: '120',
                    cellTemplate: '<div class="ui-grid-cell-contents" ng-if="row.entity.receiptType == \'D\'">{{COL_FIELD | date: grid.appScope.$parent.vm.DefaultDateFormat }}</div>',
                },
                {
                    field: 'difference',
                    displayName: 'Difference Amount',
                    width: '100',
                    cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | unitPrice }}</div>',
                    footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right">{{grid.appScope.$parent.vm.getFooterTotal("difference")}}</div>'
                },
                {
                    field: 'amount',
                    displayName: 'Amount',
                    width: '100',
                    cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="row.entity.receiptType">{{COL_FIELD | amount }}</div>',
                    footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right">{{grid.appScope.$parent.vm.getFooterTotal("amount")}}</div>'
                },
            ]

            vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
                return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
            };

            vm.loadData = () => {
                vm.removeMaterialList = [];
                if (vm.pagingInfo.SortColumns.length == 0)
                    vm.pagingInfo.SortColumns = [['packingSlipSerialNumber', 'ASC']];

                _.map(vm.pagingInfo.SearchColumns, (data) => {
                    if (data.ColumnName == TRANSACTION.PackingSlipDetailColumn.InvoiceVerificationStatus) {
                        data.ColumnName = TRANSACTION.PackingSlipDetailColumn.Status;
                        if (data.SearchString == vm.VerificationGridHeaderDropdown[1].value)
                            data.SearchString = 'P';
                        if (data.SearchString == vm.VerificationGridHeaderDropdown[2].value)
                            data.SearchString = 'A';
                        if (data.SearchString == vm.VerificationGridHeaderDropdown[3].value)
                            data.SearchString = 'D';
                    }
                });
                vm.pagingInfo.Page = 0;
                vm.cgBusyLoading = PackingSlipFactory.getPackingSlipMaterialList(vm.pagingInfo).query().$promise.then((response) => {
                    vm.sourceData = [];
                    if (response.data) {
                        vm.sourceData = response.data.packingSlipMaterialList;
                        vm.totalSourceDataCount = response.data.Count;
                    }
                    let otherChargeValue = _.remove(vm.sourceData, (data) => { return data.packingSlipSerialNumber < 0 });
                    _.filter(otherChargeValue, (data) => { return vm.sourceData.push(data) });
                    vm.packingSlipData.totalExtendedPrice = 0;
                    _.map(vm.sourceData, (data) => {
                        if (vm.packingSlipData.invoiceNumber) {
                            data.isDisabledUpdate = false;
                            if (data.status == 'A') {
                                data.isDisabledUpdate = true;
                            }
                        } else {
                            data.isDisabledUpdate = true;
                        }
                        data.invoicePrice = data.invoicePrice ? data.invoicePrice : 0;
                        data.purchasePrice = data.purchasePrice ? data.purchasePrice : 0;
                        data.extendedPrice = data.extendedPrice ? data.extendedPrice : 0;
                        data.difference = data.difference ? data.difference : null;
                        data.amount = data.amount ? data.amount : null;

                        if (_.some(vm.sourceData, (data) => { return data.status == 'D' })) {
                            vm.packingSlipData.statusText = (_.find(CORE.InvoiceVerificationStatusOptionsGridHeaderDropdown, { code: vm.PackingSlipStatus.Investigate })).value;
                            vm.packingSlipData.status = vm.PackingSlipStatus.Investigate;
                        } else if (_.filter(vm.sourceData, (data) => { return data.status == 'A' }).length == vm.sourceData.length && vm.packingSlipData.status == vm.PackingSlipStatus.Paid) {
                            vm.packingSlipData.statusText = (_.find(CORE.InvoiceVerificationStatusOptionsGridHeaderDropdown, { code: vm.PackingSlipStatus.Paid })).value;
                            vm.packingSlipData.status = vm.PackingSlipStatus.Paid;
                        } else if (_.filter(vm.sourceData, (data) => { return data.status == 'A' }).length == vm.sourceData.length) {
                            vm.packingSlipData.statusText = (_.find(CORE.InvoiceVerificationStatusOptionsGridHeaderDropdown, { code: vm.PackingSlipStatus.Approved })).value;
                            vm.packingSlipData.status = vm.PackingSlipStatus.Approved;
                        } else if (_.filter(vm.sourceData, (data) => { return data.status == 'P' }).length == vm.sourceData.length) {
                            vm.packingSlipData.statusText = (_.find(CORE.InvoiceVerificationStatusOptionsGridHeaderDropdown, { code: vm.PackingSlipStatus.WaitingForInvoice })).value;
                            vm.packingSlipData.status = vm.PackingSlipStatus.WaitingForInvoice;
                        }
                    });
                    detailOfCharges();
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

                    _.map(vm.sourceData, (item, index) => {
                        item.tempID = (index + 1);
                    });
                    $timeout(() => {
                        vm.resetSourceGrid();
                        if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount == vm.currentdata) {
                            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
                        }
                    });
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            };

            vm.getDataDown = () => {
                //vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
                vm.pagingInfo.Page = 0;
                vm.cgBusyLoading = PackingSlipFactory.getPackingSlipMaterialList(vm.pagingInfo).query().$promise.then((response) => {
                    vm.sourceData = vm.sourceData.concat(response.data.packingSlipMaterialList);
                    vm.currentdata = vm.sourceData.length;
                    vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
                    _.map(vm.sourceData, (item, index) => {
                        item.tempID = (index + 1);
                    });
                    $timeout(() => {
                        vm.resetSourceGrid();
                        return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount != vm.currentdata ? true : false);
                    });
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            };

            vm.resetPackingInvoice = () => {
                vm.packingInvoiceData = {
                    updateMaterialType: true,
                    invoicePrice: null,
                    purchasePrice: null,
                    packingSlipSerialNumber: null
                };
                vm.recordUpdate = false;
                objOfLineItem = {};
                vm.invoicePackingList.$setPristine();
                vm.invoicePackingList.$setUntouched();
            };

            vm.checkPackingLine = () => {
                if (vm.packingInvoiceData && vm.packingInvoiceData.packingSlipSerialNumber) {
                    let checkPackingLine = _.find(vm.sourceData, (data) => { return data.packingSlipSerialNumber == vm.packingInvoiceData.packingSlipSerialNumber });
                    vm.packingInvoiceData = angular.copy(checkPackingLine);
                    objOfLineItem = checkPackingLine;
                    let validationMessage;
                    if (checkPackingLine && checkPackingLine.status == 'A') {
                        validationMessage = TRANSACTION.ALREADY_VERIFIED;
                    } else if (checkPackingLine && checkPackingLine.packingSlipSerialNumber < 0) {
                        vm.packingInvoiceData.updateMaterialType = false;
                        return;
                    } else if (checkPackingLine && checkPackingLine.packingSlipSerialNumber > 0) {
                        vm.packingInvoiceData.updateMaterialType = true;
                        return;
                    } else if (!checkPackingLine) {
                        validationMessage = TRANSACTION.LINE_ITEM_NOT_FOUND;
                    }

                    if (validationMessage) {
                        let alertModel = {
                            title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
                            textContent: validationMessage
                        };
                        DialogFactory.alertDialog(alertModel).then((yes) => {
                            if (yes) {
                                objOfLineItem = {};
                                if (vm.packingInvoiceData)
                                    vm.packingInvoiceData = {
                                        updateMaterialType: true
                                    };
                                $timeout(() => {
                                    let myEl = angular.element(document.querySelector('#slipLine'));
                                    myEl.focus();
                                }, true);
                                return false;
                            } else {
                                objOfLineItem = {};
                                if (vm.packingInvoiceData)
                                    vm.packingInvoiceData = {
                                        updateMaterialType: true
                                    };
                                $timeout(() => {
                                    let myEl = angular.element(document.querySelector('#slipLine'));
                                    myEl.focus();
                                }, true);
                                return false;
                            }
                        }, (cancel) => {
                        }).catch((error) => {
                            return BaseService.getErrorLog(error);
                        });
                    } else {
                        vm.calculateExtendedPrice();
                    }
                }
            }

            vm.updateRecord = (row, ev) => {
                //let validationMessage;
                //if (!row.entity.invoicePrice) {
                //    validationMessage = TRANSACTION.UPADTE_PURCHASE_PRICE;
                //} else if (!row.entity.purchasePrice) {
                //    validationMessage = TRANSACTION.UPADTE_AGREED_PRICE;
                //}

                //if (!row.entity.invoicePrice || !row.entity.purchasePrice) {
                //    let alertModel = {
                //        title: USER.USER_ERROR_LABEL,
                //        textContent: validationMessage
                //    };
                //    DialogFactory.alertDialog(alertModel).then((yes) => {
                //        if (yes) {
                //            return false;
                //        }
                //    }, (cancel) => {

                //    }).catch((error) => {
                //        return BaseService.getErrorLog(error);
                //    });
                //    return;
                //} else {

                if (row.entity) {
                    row.entity.invoicePrice = row.entity.invoicePrice ? parseFloat(row.entity.invoicePrice) : 0;
                    row.entity.purchasePrice = row.entity.invoicePrice ? parseFloat(row.entity.purchasePrice) : 0;
                    row.entity.extendedPrice = row.entity.extendedPrice ? parseFloat(row.entity.extendedPrice) : 0;
                }
                vm.packingInvoiceData = angular.copy(row.entity);
                objOfLineItem = vm.packingInvoiceData;
                if (vm.packingInvoiceData.packingSlipSerialNumber < 0) {
                    vm.packingInvoiceData.updateMaterialType = false;
                    vm.packingInvoiceData.chargiesType = vm.packaging_Charges_List[0].value == vm.packingInvoiceData.otherCharges ? -1 : -2;
                } else {
                    vm.packingInvoiceData.updateMaterialType = true;
                }
                vm.recordUpdate = true;
                //}
            };

            vm.updatePackingDetail = () => {
                if (vm.packingInvoiceData && vm.packingInvoiceData.packingSlipSerialNumber) {
                    if (!parseFloat(vm.packingInvoiceData.invoicePrice) || !parseFloat(vm.packingInvoiceData.purchasePrice)) {

                        let validationMessage;
                        if (!parseFloat(vm.packingInvoiceData.invoicePrice)) {
                          validationMessage = TRANSACTION.UPDATE_INVOICE_PRICE;
                        } else if (!parseFloat(vm.packingInvoiceData.purchasePrice)) {
                          validationMessage = TRANSACTION.UPDATE_PURCHASE_PRICE;
                        }

                        let alertModel = {
                            title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
                            textContent: validationMessage
                        };
                        DialogFactory.alertDialog(alertModel).then((yes) => {
                            if (yes) {
                                return false;
                            }
                        }, (cancel) => {

                        }).catch((error) => {
                            return BaseService.getErrorLog(error);
                        });
                        return;
                    } else {
                        let checkPackingLine = _.find(vm.gridOptions.data, (data) => { return data.packingSlipSerialNumber == vm.packingInvoiceData.packingSlipSerialNumber });
                        let invoiceData = {};

                        if (!checkPackingLine && vm.packingInvoiceData.packingSlipSerialNumber < 0) {
                            invoiceData.refPackingSlipMaterialRecID = vm.packingSlipData.id;
                            invoiceData.packingSlipSerialNumber = vm.packingInvoiceData.packingSlipSerialNumber;
                            invoiceData.otherCharges = vm.packingInvoiceData.packingSlipSerialNumber;
                            invoiceData.orderedQty = 1;
                            invoiceData.receivedQty = 1;
                            invoiceData.packingSlipQty = 1;
                            invoiceData.invoicePrice = vm.packingInvoiceData.invoicePrice;
                            invoiceData.purchasePrice = vm.packingInvoiceData.purchasePrice;
                            invoiceData.extendedPrice = parseFloat(invoiceData.receivedQty * invoiceData.invoicePrice).toFixed(amountDecimal);
                        } else if (checkPackingLine && checkPackingLine.packingSlipSerialNumber < 0 && checkPackingLine.status == 'A') {
                            let alertModel = {
                                title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
                                textContent: TRANSACTION.ALREADY_VERIFIED
                            };
                            DialogFactory.alertDialog(alertModel).then((yes) => {
                                if (yes) {
                                    vm.resetPackingInvoice();
                                }
                            }, (cancel) => {

                            }).catch((error) => {
                                return BaseService.getErrorLog(error);
                            });
                            return;
                        } else {
                            invoiceData.id = checkPackingLine.id;
                            invoiceData.refPackingSlipMaterialRecID = vm.packingSlipData.id;
                            invoiceData.invoicePrice = vm.packingInvoiceData.invoicePrice;
                            invoiceData.purchasePrice = vm.packingInvoiceData.purchasePrice;
                            invoiceData.extendedPrice = parseFloat(checkPackingLine.receivedQty * invoiceData.invoicePrice).toFixed(amountDecimal);
                            invoiceData.otherCharges = vm.packingInvoiceData.packingSlipSerialNumber && vm.packingInvoiceData.packingSlipSerialNumber < 0 ? vm.packingInvoiceData.packingSlipSerialNumber : null;
                        }

                        if (parseFloat(vm.packingInvoiceData.purchasePrice) && parseFloat(vm.packingInvoiceData.invoicePrice) && (vm.packingInvoiceData.purchasePrice == vm.packingInvoiceData.invoicePrice && vm.packingInvoiceData.receivedQty == vm.packingInvoiceData.packingSlipQty)) {
                            invoiceData.status = 'A';
                        } else {
                            invoiceData.status = 'D';
                        }
                        invoiceData.isApproveFlow = false;
                      vm.cgBusyLoading = PackingSlipFactory.saveInvoiceMaterial().query(invoiceData).$promise.then((response) => {
                            if (response && response.data) {
                                //checkPackingLine.invoicePrice = angular.copy(vm.packingInvoiceData.invoicePrice);
                                //checkPackingLine.purchasePrice = angular.copy(vm.packingInvoiceData.purchasePrice);
                                //checkPackingLine.extendedPrice = checkPackingLine.invoicePrice * checkPackingLine.receivedQty;
                                //detailOfCharges();
                                BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                                $scope.invoicePackingDetailForm = false;
                                //vm.resetPackingInvoice();
                                vm.packingInvoiceData = {
                                    updateMaterialType: true
                                };
                                vm.recordUpdate = false;
                                objOfLineItem = {};
                                $timeout(() => {
                                    let myEl = angular.element(document.querySelector('#slipLine'));
                                    myEl.focus();
                                    vm.invoicePackingList.$setPristine();
                                    vm.invoicePackingList.$setUntouched();
                                }, true);
                            }

                        }).catch((error) => {
                            return BaseService.getErrorLog(error);
                        });
                    }
                }
            }

            vm.verifiedRecord = (row, ev) => {
                let data = row.entity;
                data.packingSlipData = vm.packingSlipData;
                //let validationMessage;
                //if (data && !data.invoicePrice) {
                //    validationMessage = TRANSACTION.UPADTE_PURCHASE_PRICE;
                //} else if (data && !data.purchasePrice) {
                //    validationMessage = TRANSACTION.UPADTE_AGREED_PRICE;
                //}

                //if (data && (!data.invoicePrice || !data && data.purchasePrice)) {
                //    let alertModel = {
                //        title: USER.USER_ERROR_LABEL,
                //        textContent: validationMessage
                //    };
                //    DialogFactory.alertDialog(alertModel).then((yes) => {
                //        if (yes) {

                //            return false;
                //        }
                //    }, (cancel) => {

                //    }).catch((error) => {
                //        return BaseService.getErrorLog(error);
                //    });
                //    return;
                //} else {
                data.poNumber = vm.packingSlipData.poNumber;
                data.packingSlipId = vm.packingSlipData.id;
                data.invoiceDate = vm.packingSlipData.invoiceDate;
                DialogFactory.dialogService(
                    TRANSACTION.VERIFICATION_PACKAGING_CONTROLLER,
                    TRANSACTION.VERIFICATION_PACKAGING_VIEW,
                    event,
                    data).then(() => {
                    }, (verified) => {
                        if (verified) {
                            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                        }
                    }, (err) => {
                        return BaseService.getErrorLog(err);
                    });
                //}
            }

            $scope.$watch('vm.invoicePackingList.$dirty', function () {
                if (vm.invoicePackingList.$dirty) {
                    $scope.invoicePackingDetailForm = vm.invoicePackingList.$dirty;
                }
            });

            vm.getFooterTotal = (columnName) => {
                let sum = _.sumBy(vm.sourceData, (data) => {
                    if (columnName == TRANSACTION.PackingSlipColumn.TotalAmount) {
                        if (data['receiptType'])
                            return data[columnName];
                        else
                            return 0;
                    } else {
                        return data[columnName];
                    }

                });
                sum = $filter('amount')(sum);
                //let display = stringFormat("Total: {0}", sum);
                return sum;
            }

            vm.getTotalLineItems = () => {
                //let sum = _.sumBy(vm.sourceData, (data) => { return data.packingSlipSerialNumber > 0; });
                let sum = vm.sourceData.length > 0 ? vm.sourceData.length : 0;
                sum = $filter('numberWithoutDecimal')(sum);
                let display = stringFormat("Total Line Items: {0}", sum);
                return display;
            };

            vm.getQtySum = (columnName) => {
                let sum = _.sumBy(vm.sourceData, (data) => { return data[columnName]; });
                return $filter('numberWithoutDecimal')(sum);
            };

            vm.searchToDigikey = (part) => {
                BaseService.openURLInNew(RFQTRANSACTION.API_LINKS.DIGIKEY + part);
            }

            let detailOfCharges = () => {
                vm.packingSlipData.totalChargies = parseFloat(_.sumBy(vm.sourceData, (data) => {
                    if (data.packingSlipSerialNumber < 0)
                        return data.extendedPrice
                    //else
                    //    return 0;
                })).toFixed(amountDecimal);
                vm.packingSlipData.totalChargies = parseFloat(vm.packingSlipData.totalChargies) ? vm.packingSlipData.totalChargies : 0;
                vm.packingSlipData.sumExtendedPrice = parseFloat(_.sumBy(vm.sourceData, (data) => {
                    if (data.packingSlipSerialNumber > 0)
                        return data.extendedPrice;
                    //else
                    //    return 0;
                })).toFixed(amountDecimal);
                vm.packingSlipData.sumExtendedPrice = parseFloat(vm.packingSlipData.sumExtendedPrice) ? vm.packingSlipData.sumExtendedPrice : 0;
                vm.packingSlipData.totalExtendedPrice = (parseFloat(vm.packingSlipData.sumExtendedPrice ? vm.packingSlipData.sumExtendedPrice : 0) + parseFloat(vm.packingSlipData.totalChargies ? vm.packingSlipData.totalChargies : 0)).toFixed(amountDecimal);

                vm.packingSlipData.sumExtendedPriceDisplay = vm.packingSlipData.sumExtendedPrice ? $filter('amount')(vm.packingSlipData.sumExtendedPrice) : 0;
                vm.packingSlipData.totalExtendedPriceDisplay = vm.packingSlipData.totalExtendedPrice ? $filter('amount')(vm.packingSlipData.totalExtendedPrice) : 0;
            }

            vm.changeUpdateMaterialType = () => {
                objOfLineItem = {};
                if (vm.packingInvoiceData.updateMaterialType) {
                    vm.packingInvoiceData = {
                        updateMaterialType: true,
                        chargiesType: null,
                        extendedPrice: null
                    };
                } else {
                    vm.packingInvoiceData = {
                        updateMaterialType: false,
                        chargiesType: vm.packaging_Charges_List[0].id,
                        extendedPrice: null,
                        packingSlipSerialNumber: vm.packaging_Charges_List[0].id
                    };
                }
            }

            vm.changeChargiesType = () => {
                if (vm.packingInvoiceData.chargiesType == -1) {
                    vm.packingInvoiceData.packingSlipSerialNumber = -1;
                } else if (vm.packingInvoiceData.chargiesType == -2) {
                    vm.packingInvoiceData.packingSlipSerialNumber = -2;
                } else if (vm.packingInvoiceData.chargiesType == -3) {
                    vm.packingInvoiceData.packingSlipSerialNumber = -3;
                }
            }

            vm.calculateExtendedPrice = () => {
                if (vm.packingInvoiceData.invoicePrice && !vm.packingInvoiceData.purchasePrice) {
                    vm.packingInvoiceData.purchasePrice = angular.copy(vm.packingInvoiceData.invoicePrice);
                }

                if (objOfLineItem && objOfLineItem.receivedQty && vm.packingInvoiceData.invoicePrice) {
                    vm.packingInvoiceData.extendedPrice = parseFloat(((objOfLineItem.receivedQty || 0) * (vm.packingInvoiceData.invoicePrice || 0)).toFixed(2));
                } else if (objOfLineItem && !objOfLineItem.receivedQty && !vm.packingInvoiceData.updateMaterialType && vm.packingInvoiceData.invoicePrice) {
                    vm.packingInvoiceData.extendedPrice = parseFloat((1 * (vm.packingInvoiceData.invoicePrice || 0)).toFixed(2));
                } else {
                    vm.packingInvoiceData.extendedPrice = 0;
                }
            }

            vm.showApproveNote = (object, ev) => {
                let obj = {
                    title: 'Approve Note',
                    description: object.approveNote,
                    name: object.packingSlipSerialNumber,
                    label: 'Packing Slip Line#'
                }
                let data = obj;
                DialogFactory.dialogService
                    (
                        CORE.DESCRIPTION_MODAL_CONTROLLER,
                        CORE.DESCRIPTION_MODAL_VIEW,
                        ev,
                        data
                    ).then(() => {

                    }, (err) => {
                        return BaseService.getErrorLog(err);
                    });
            }

            vm.addInvoiceInPackingSlip = () => {
                let data = vm.packingSlipData;
                DialogFactory.dialogService(
                    TRANSACTION.ADD_INVOICE_CONTROLLER,
                    TRANSACTION.ADD_INVOICE_VIEW,
                    event,
                    data).then(() => {
                    }, (invoice) => {
                        if (invoice) {
                            vm.packingSlipData.invoiceNumber = invoice.invoiceNumber;
                            vm.packingSlipData.invoiceDate = $filter('date')(invoice.invoiceDate, vm.DefaultDateFormat);
                            vm.packingSlipData.applyDate = invoice.applyDate;
                            vm.loadData();
                        }
                    }, (err) => {
                        return BaseService.getErrorLog(err);
                    });
            }

          angular.element(() => {
            BaseService.currentPageForms = [vm.invoicePackingList];
          });
        }
    }

})();
