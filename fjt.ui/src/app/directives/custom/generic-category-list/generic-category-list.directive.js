(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('genericCategoryList', genericCategoryList);

    /** @ngInject */
    function genericCategoryList($mdDialog, $timeout, $state, CORE, USER, GenericCategoryFactory, DialogFactory, Upload, BaseService, ReceivingMaterialFactory) {
        var directive = {
            restrict: 'E',
            replace: true,
            scope: {
                categoryTypeId: '=?',
                cgBusyLoading: '=',
                isNoDataFound: '='
            },
            templateUrl: 'app/directives/custom/generic-category-list/generic-category-list.html',
            controller: genericCategoryListCtrl,
            controllerAs: 'vm'
        };
        return directive;

        /** @ngInject */
        function genericCategoryListCtrl($scope) {
            var vm = this;
            vm.categoryTypeID = $scope.categoryTypeId ? parseInt($scope.categoryTypeId) : null;
            vm.loginUser = BaseService.loginUser;
            //vm.cgBusyLoading = $scope.cgBusyLoading;
            vm.isNoDataFound = $scope.isNoDataFound;

            vm.isUpdatable = true;
            vm.StatusOptionsGridHeaderDropdown = CORE.StatusOptionsGridHeaderDropdown;
            vm.isEditIntigrate = false;
            vm.DefaultDateFormat = _dateTimeDisplayFormat;
            let CategoryTypeList = [];
            vm.gridConfig = CORE.gridConfig;
            vm.LabelConstant = CORE.LabelConstant;
            vm.KeywordStatusGridHeaderDropdown = CORE.KeywordStatusGridHeaderDropdown;
            vm.EOMGridHeaderDropdown = CORE.EOMGridHeaderDropdown;
            CategoryTypeList = angular.copy(CORE.Category_Type);
            const CategoryTypeObjList = angular.copy(CORE.CategoryType);
            vm.paymenterm = CategoryTypeObjList.Terms.ID;
            vm.HomeMenuID = CategoryTypeObjList.HomeMenu.ID;
            vm.shippingMethodID = CategoryTypeObjList.ShippingType.ID;
            vm.notificationCategoryID = CategoryTypeObjList.NotificationCategory.ID;
            vm.reportCategoryID = CategoryTypeObjList.ReportCategory.ID;

            vm.categoryType = _.find(CategoryTypeList, (cateType) => cateType.categoryTypeID === vm.categoryTypeID);
            const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;
            vm.homeMenuCategory = _.find(CategoryTypeList, (cateType) => cateType.categoryTypeID === vm.HomeMenuID);
            vm.roleAdmin = CORE.Role.SuperAdmin.toLowerCase();
            vm.roleExecutive = CORE.Role.Executive.toLowerCase();
            _.find(vm.loginUser.roles, (role) => {
                if (role.id === vm.loginUser.defaultLoginRoleID) {
                    vm.defaultRole = role.name.toLowerCase();
                }
            });
            vm.manageGenericCategory = {};
            vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
            const isEnableGridOption = (vm.categoryType.categoryType === vm.homeMenuCategory.categoryType) && (vm.defaultRole === vm.roleAdmin || vm.defaultRole === vm.roleExecutive ? false : true);
            vm.EmptyMessage = USER.ADMIN_EMPTYSTATE.GENERICCATEGORY;
            vm.Message = stringFormat(vm.EmptyMessage.MESSAGE, vm.categoryType.displayName);
            vm.addButtonLabel = vm.categoryType.singleLabel;
            vm.AddnewMessage = stringFormat(vm.EmptyMessage.ADDNEWMESSAGE, vm.categoryType.displayName);
            vm.imageUrl = stringFormat(vm.EmptyMessage.IMAGEURL, vm.categoryType.EmptyStateImageName + '.png');


            // To Hide show column after grid load done.
            vm.isVisibleParent = () => {
                // show parent column in case of Equipment & Workstation Groups and part type
                const objParent = _.find(vm.sourceHeader, (col) => col.field === 'gencCategoryNameOfParentGenericCategory');
                objParent.visible = false;
                if (vm.categoryType.categoryTypeID === CategoryTypeObjList.EquipmentGroup.ID) {
                    objParent.visible = true;
                }
                else {
                    /* removed 'Parent Name' column as to not display in menu item while csv export */
                    _.remove(vm.sourceHeader, (col) => col.field === 'gencCategoryNameOfParentGenericCategory');
                }
                //Carrier Field Visible for Shipping Method
                const objCarrier = _.find(vm.sourceHeader, (col) => col.field === 'carrierName');
                objCarrier.visible = false;
                if (vm.categoryType.categoryTypeID === CategoryTypeObjList.ShippingType.ID) {
                    objCarrier.visible = true;
                }
                else {
                    /* removed 'Parent Name' column as to not display in menu item while csv export */
                    _.remove(vm.sourceHeader, (col) => col.field === 'carrierName');
                }

                //Description Field Visible for Report Category
                const objDescription = _.find(vm.sourceHeader, (col) => col.field === 'description');
                objDescription.visible = false;
                if (vm.categoryType.categoryTypeID === CategoryTypeObjList.ReportCategory.ID ||
                    vm.categoryType.categoryTypeID === CategoryTypeObjList.PayablePaymentMethods.ID ||
                    vm.categoryType.categoryTypeID === CategoryTypeObjList.ReceivablePaymentMethods.ID) {
                    objDescription.visible = true;
                }
                else {
                    /* removed 'Parent Name' column as to not display in menu item while csv export */
                    _.remove(vm.sourceHeader, (col) => col.field === 'description');
                }

                //Payment Type Category is only for Payment Mothod Master
                const objPaymentTypeCategory = _.find(vm.sourceHeader, (col) => col.field === 'paymentTypeCategoryName');
                objPaymentTypeCategory.visible = false;
                if (vm.categoryType.categoryTypeID === CategoryTypeObjList.PayablePaymentMethods.ID ||
                    vm.categoryType.categoryTypeID === CategoryTypeObjList.ReceivablePaymentMethods.ID) {
                    objPaymentTypeCategory.visible = true;
                }
                else {
                    /* removed 'Parent Name' column as to not display in menu item while csv export */
                    _.remove(vm.sourceHeader, (col) => col.field === 'paymentTypeCategoryName');
                }

                //Bank Account is only for Payment Mothod Master
                const objAccountCode = _.find(vm.sourceHeader, (col) => col.field === 'accountCode');
                objAccountCode.visible = false;
                if (vm.categoryType.categoryTypeID === CategoryTypeObjList.PayablePaymentMethods.ID) {
                    objAccountCode.visible = true;
                }
                else {
                    /* removed 'Parent Name' column as to not display in menu item while csv export */
                    _.remove(vm.sourceHeader, (col) => col.field === 'accountCode');
                }

                // hide code column if not required in case of printer
                const objCode = _.find(vm.sourceHeader, { field: 'gencCategoryCode' });
                const objDisplayOrder = _.find(vm.sourceHeader, { field: 'displayOrder' });
                objCode.visible = true;
                objDisplayOrder.visible = true;
                if (vm.categoryType.categoryTypeID === CategoryTypeObjList.Printer.ID) {
                    objCode.visible = false;
                    objDisplayOrder.visible = false;
                } else if (vm.categoryType.categoryTypeID === CategoryTypeObjList.HomeMenu.ID || vm.categoryType.categoryTypeID === CategoryTypeObjList.DocumentType.ID) {
                    objCode.visible = false;
                } else if (vm.categoryType.categoryTypeID === CategoryTypeObjList.ReportCategory.ID) {
                    objCode.visible = false;
                    _.remove(vm.sourceHeader, (col) => col.field === 'gencCategoryCode');
                }
            };
            $timeout(() => {
                vm.isVisibleParent();
            }, 0);

            CategoryTypeList.unshift({ categoryTypeID: null, categoryType: 'All', passfilterValue: null });


            vm.updateBank = (row) => {
                const loginUserAllAccessPageRoute = _.map(BaseService.loginUserPageList, (item) => item.PageDetails && item.PageDetails.pageRoute);
                if (!_.find(loginUserAllAccessPageRoute, (item) => item === USER.ADMIN_BANK_STATE)) {
                    const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.POPUP_ACCESS_DENIED);
                    messageContent.message = stringFormat(messageContent.message, USER.ADMIN_BANK_LABEL.toLowerCase());
                    const model = {
                        messageContent: messageContent,
                        multiple: true
                    };
                    DialogFactory.messageAlertDialog(model);
                } else {
                    const PopupData = {
                        id: row.bankid
                    };
                    DialogFactory.dialogService(
                        USER.ADMIN_BANK_ADD_UPDATE_MODAL_CONTROLLER,
                        USER.ADMIN_BANK_ADD_UPDATE_MODAL_VIEW,
                        event,
                        PopupData).then(() => {
                        }, () => {
                        }, (err) => BaseService.getErrorLog(err));
                }
            };
            vm.goToPaymentTypeCategoryDetail = (row) => BaseService.openInNew(USER.ADMIN_PAYMENT_TYPE_CATEGORY_MANAGEGENERICCATEGORY_STATE, { gencCategoryID: row.paymentTypeCategoryId });

            vm.sourceHeader = [{
                field: 'Action',
                cellClass: 'gridCellColor',
                displayName: 'Action',
                width: '80',
                cellTemplate: '<grid-action-view grid="grid" row="row"></grid-action-view>',
                enableFiltering: false,
                enableSorting: false,
                exporterSuppressExport: true,
                pinnedLeft: true,
                enableCellEdit: false
            }, {
                field: '#',
                width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
                cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
                enableFiltering: false,
                enableSorting: false,
                enableCellEdit: false
            }, {
                field: 'gencCategoryName',
                displayName: vm.categoryTypeID === CategoryTypeObjList.BarcodeSeparator.ID ? 'Barcode Field Separator(s)' : 'Name',
                width: 250,
                enableCellEdit: false
            }, {
                field: 'gencCategoryCode',
                displayName: vm.categoryTypeID === CategoryTypeObjList.BarcodeSeparator.ID ? 'Name' : 'Code',
                width: 150,
                enableCellEdit: false
            }, {
                field: 'gencCategoryNameOfParentGenericCategory',
                displayName: 'Parent Name',
                cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
                width: 250,
                enableCellEdit: false
            }, {
                field: 'carrierName',
                displayName: 'Carrier',
                cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
                width: 200,
                enableCellEdit: false
            },
            {
                field: 'paymentTypeCategoryName',
                displayName: 'Payment Type Category',
                cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-if="row.entity.paymentTypeCategoryName">\
                            <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToPaymentTypeCategoryDetail(row.entity);" tabindex="-1">{{COL_FIELD}}</a>\
                            <copy-text label="\'Payment Type Category\'" text="row.entity.paymentTypeCategoryName"></copy-text>\
                        </div>',
                width: 200,
                enableCellEdit: false
            },
            {
                field: 'accountCode',
                displayName: vm.LabelConstant.Bank.BankAccountCode,
                cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-if="row.entity.accountCode">\
                            <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.updateBank(row.entity);" tabindex="-1">{{COL_FIELD}}</a>\
                            <copy-text label="grid.appScope.$parent.vm.LabelConstant.Bank.BankAccountCode" text="row.entity.accountCode"></copy-text>\
                        </div>',
                width: 200,
                enableCellEdit: false
            },
            {
                field: 'description',
                displayName: 'Description',
                cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.description" ng-click="grid.appScope.$parent.vm.viewRecord(row.entity, $event)"> \
                                   View \
                                </md-button>',
                width: 120,
                enableFiltering: false,
                enableSorting: false,
                enableCellEdit: false
            }, {
                field: 'displayOrder',
                displayName: vm.LabelConstant.COMMON.DisplayOrder + (!isEnableGridOption ? CORE.Modify_Grid_column_Allow_Change_Message : ''),
                cellTemplate: CORE.DISPLAYORDER.CellTemplate,
                editableCellTemplate: CORE.DISPLAYORDER.EditableCellTemplate,
                width: CORE.DISPLAYORDER.Width,
                maxWidth: CORE.DISPLAYORDER.MaxWidth,
                enableCellEdit: !isEnableGridOption,
                type: 'number'
            }, {
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
            }, {
                field: 'updatedAt',
                displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
                type: 'datetime',
                enableFiltering: false
            }, {
                field: 'updatedby',
                displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
                type: 'StringEquals',
                enableFiltering: true,
                visible: CORE.UIGrid.VISIBLE_MODIFIED_AT
            }, {
                field: 'updatedbyRole',
                displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
                type: 'StringEquals',
                enableFiltering: true,
                visible: CORE.UIGrid.VISIBLE_MODIFIED_BYROLE
            }, {
                field: 'createdAt',
                displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
                type: 'datetime',
                enableFiltering: false,
                visible: CORE.UIGrid.VISIBLE_CREATED_AT
            }, {
                field: 'createdby',
                displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
                type: 'StringEquals',
                enableFiltering: true,
                visible: CORE.UIGrid.VISIBLE_CREATED_BY
            }, {
                field: 'createdbyRole',
                displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
                type: 'StringEquals',
                enableFiltering: true,
                visible: CORE.UIGrid.VISIBLE_CREATED_BYROLE
            }, {
                field: 'SyatemGeneratedValue',
                displayName: vm.LabelConstant.COMMON.GRIDHEADER_SYSTEM_GENERATED,
                cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
                    + '<span class="label-box" ng-class="{\'label-success\':row.entity.systemGenerated == true, \'label-warning\':row.entity.systemGenerated == false}"> {{ COL_FIELD }}'
                    + '</span>'
                    + '</div>',
                filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
                filter: {
                    term: null,
                    options: vm.KeywordStatusGridHeaderDropdown
                },
                ColumnDataType: 'StringEquals',
                width: 120
            }];

            if (vm.categoryType.categoryTypeID === vm.paymenterm) {
                const termsDaysObj = {
                    field: 'termsDays',
                    displayName: 'Terms Days',
                    width: 120,
                    enableCellEdit: false
                };
                const isEOMObj = {
                    field: 'isEOMValue',
                    displayName: 'EOM',
                    width: 100,
                    cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
                        + '<span class="label-box" ng-class="{\'label-success\':row.entity.isEOM == true, \'label-warning\':row.entity.isEOM == false}"> {{ COL_FIELD }}'
                        + '</span>'
                        + '</div>',
                    filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
                    filter: {
                        term: null,
                        options: vm.EOMGridHeaderDropdown
                    },
                    ColumnDataType: 'StringEquals',
                    enableCellEdit: false
                };
                /* to add field at specific index */
                let termsDaysByAddIndex = vm.sourceHeader.map((obj) => obj.field).indexOf('gencCategoryCode');
                termsDaysByAddIndex = termsDaysByAddIndex > 0 ? termsDaysByAddIndex + 1 : vm.sourceHeader.length - 1;
                vm.sourceHeader.splice(termsDaysByAddIndex, 0, termsDaysObj);
                vm.sourceHeader.splice(termsDaysByAddIndex + 1, 0, isEOMObj);
            }
            const initPageInfo = () => {
                vm.pagingInfo = {
                    Page: CORE.UIGrid.Page(),
                    SortColumns: [],
                    SearchColumns: [], /* for default - directly set in sp */
                    genericCategoryType: vm.categoryType.categoryType
                };
            };
            initPageInfo();

            vm.gridOptions = {
                enablePaging: isEnablePagination,
                enablePaginationControls: isEnablePagination,
                genericCategoryTypeID: vm.categoryType.categoryTypeID,
                showColumnFooter: false,
                enableRowHeaderSelection: true,
                enableFullRowSelection: false,
                enableRowSelection: true,
                multiSelect: true,
                filterOptions: vm.pagingInfo.SearchColumns,
                exporterMenuCsv: true,
                enableCellEdit: false,
                enableCellEditOnFocus: true,
                exporterCsvFilename: vm.categoryType.displayName + '.csv',
                CurrentPage: CORE.PAGENAME_CONSTANT[0].PageName,
                allowToExportAllData: true,
                exporterAllDataFn: () => {
                    const pagingInfoOld = _.clone(vm.pagingInfo);
                    pagingInfoOld.pageSize = 0;
                    pagingInfoOld.isExport = true;
                    return GenericCategoryFactory.retriveGenericCategoryList().query(pagingInfoOld).$promise.then((response) => {
                        if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data && response.data.genericcategory) {
                            setDataAfterGetAPICall(response, false);
                            return response.data.genericcategory;
                        }
                    }).catch((error) => BaseService.getErrorLog(error));
                }
            };
            // Used to disbale multi select option when category is home menu and user is not Admin/Executive
            if (vm.categoryType.categoryType === vm.homeMenuCategory.categoryType) {
                vm.gridOptions.multiSelect = vm.defaultRole === vm.roleAdmin || vm.defaultRole === vm.roleExecutive ? true : false;
            }
            else {
                vm.gridOptions.multiSelect = true;
            }

            // in case of notification category->  set enable/disable/selection option for edit/delete/select manually
            if (vm.categoryType.categoryTypeID === vm.notificationCategoryID) {
                vm.isHideDelete = true;
                vm.gridOptions.CurrentPage = null;
                vm.gridOptions.enableRowHeaderSelection = false;
                vm.gridOptions.multiSelect = false;
            }

            vm.viewRecord = (item, $event) => {
                item.description = item && item.description ? angular.copy(item.description).replace(/\n/g, '<br/>') : null;
                const obj = {
                    title: 'Description',
                    description: item.description
                };
                const data = obj;
                DialogFactory.dialogService(
                    CORE.DESCRIPTION_MODAL_CONTROLLER,
                    CORE.DESCRIPTION_MODAL_VIEW,
                    $event,
                    data).then((response) => {
                        item.description = response;
                    }, (error) => BaseService.getErrorLog(error));
            };

            function setDataAfterGetAPICall(genericcategory, isGetDataDown) {
                if (genericcategory && genericcategory.data && genericcategory.data.genericcategory) {
                    if (!isGetDataDown) {
                        vm.sourceData = genericcategory.data.genericcategory;
                        vm.currentdata = vm.sourceData.length;
                    }
                    else if (genericcategory.data.genericcategory.length > 0) {
                        vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(genericcategory.data.genericcategory);
                        vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
                  }
                    if (vm.sourceData && vm.sourceData.length > 0 && vm.categoryType.categoryType === vm.homeMenuCategory.categoryType) {
                        // Used to disbale delete and edit option when category is home menu and user is not Admin/Executive
                        _.each(vm.sourceData, (item) => {
                            item.isDisabledDelete = isEnableGridOption;
                            item.isDisabledUpdate = isEnableGridOption;
                            item.isRowSelectable = !isEnableGridOption;
                        });
                    }
                    else if (vm.categoryType.categoryTypeID === vm.notificationCategoryID) {
                        _.each(vm.sourceData, (item) => {
                            item.isDisabledDelete = true;
                            item.isDisabledUpdate = false;
                            item.isRowSelectable = false;
                        });
                    }
                    // must set after new data comes
                    vm.totalSourceDataCount = genericcategory.data.Count;
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
                            vm.isNoDataFound = $scope.isNoDataFound = false;
                            vm.emptyState = 0;
                        }
                        else {
                            vm.isNoDataFound = $scope.isNoDataFound = true;
                            vm.emptyState = null;
                        }
                    }
                    else {
                        vm.isNoDataFound = $scope.isNoDataFound = false;
                        vm.emptyState = null;
                    }
                    if (!isGetDataDown && !vm.isEditIntigrate) {
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

            /* retrieve generic category list*/
            vm.loadData = () => {
                BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
                $scope.cgBusyLoading = GenericCategoryFactory.retriveGenericCategoryList().query(vm.pagingInfo).$promise.then((genericcategory) => {
                    if (genericcategory.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                        setDataAfterGetAPICall(genericcategory, false);
                    }
                }).catch((error) => BaseService.getErrorLog(error));
            };

            vm.getDataDown = () => {
                vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
                $scope.cgBusyLoading = GenericCategoryFactory.retriveGenericCategoryList().query(vm.pagingInfo).$promise.then((genericcategory) => {
                    if (genericcategory) {
                        setDataAfterGetAPICall(genericcategory, true);
                    }
                }).catch((error) => BaseService.getErrorLog(error));
            };

            vm.updateRecord = (row) => {
                let manageGenericCategoryState = null;
                switch (parseInt(vm.categoryTypeID)) {
                    case CategoryTypeObjList.EquipmentGroup.ID:
                        manageGenericCategoryState = USER.ADMIN_EQPGROUP_MANAGEGENERICCATEGORY_STATE;
                        break;
                    case CategoryTypeObjList.EquipmentType.ID:
                        manageGenericCategoryState = USER.ADMIN_EQPTYPE_TYPE_MANAGEGENERICCATEGORY_STATE;
                        break;
                    case CategoryTypeObjList.EquipmentOwnership.ID:
                        manageGenericCategoryState = USER.ADMIN_EQPOWNER_MANAGEGENERICCATEGORY_STATE;
                        break;
                    case CategoryTypeObjList.StandardType.ID:
                        manageGenericCategoryState = USER.ADMIN_STANDTYPE_MANAGEGENERICCATEGORY_STATE;
                        break;
                    case CategoryTypeObjList.EmployeeTitle.ID:
                        manageGenericCategoryState = USER.ADMIN_EMPTITLE_MANAGEGENERICCATEGORY_STATE;
                        break;
                    case CategoryTypeObjList.OperationType.ID:
                        manageGenericCategoryState = USER.ADMIN_OPTYPE_MANAGEGENERICCATEGORY_STATE;
                        break;
                    case CategoryTypeObjList.ShippingStatus.ID:
                        manageGenericCategoryState = USER.ADMIN_SHIPSTATUS_MANAGEGENERICCATEGORY_STATE;
                        break;
                    case CategoryTypeObjList.OperationVerificationStatus.ID:
                        manageGenericCategoryState = USER.ADMIN_VERISTATUS_MANAGEGENERICCATEGORY_STATE;
                        break;
                    case CategoryTypeObjList.LocationType.ID:
                        manageGenericCategoryState = USER.ADMIN_LOCATIONTYPE_MANAGEGENERICCATEGORY_STATE;
                        break;
                    case CategoryTypeObjList.WorkArea.ID:
                        manageGenericCategoryState = USER.ADMIN_WORKAREA_MANAGEGENERICCATEGORY_STATE;
                        break;
                    case CategoryTypeObjList.ShippingType.ID:
                        manageGenericCategoryState = USER.ADMIN_SHIPPINGTYPE_MANAGEGENERICCATEGORY_STATE;
                        break;
                    case CategoryTypeObjList.Terms.ID:
                        manageGenericCategoryState = USER.ADMIN_TERMS_MANAGEGENERICCATEGORY_STATE;
                        break;
                    case CategoryTypeObjList.Printer.ID:
                        manageGenericCategoryState = USER.ADMIN_PRINTER_TYPE_MANAGEGENERICCATEGORY_STATE;
                        break;
                    case CategoryTypeObjList.PartStatus.ID:
                        manageGenericCategoryState = USER.ADMIN_PART_STATUS_MANAGEGENERICCATEGORY_STATE;
                        break;
                    case CategoryTypeObjList.BarcodeSeparator.ID:
                        manageGenericCategoryState = USER.ADMIN_BARCODE_SEPARATOR_MANAGEGENERICCATEGORY_STATE;
                        break;
                    case CategoryTypeObjList.HomeMenu.ID:
                        manageGenericCategoryState = USER.ADMIN_HOME_MENU_CATEGORY_MANAGEGENERICCATEGORY_STATE;
                        break;
                    case CategoryTypeObjList.DocumentType.ID:
                        manageGenericCategoryState = USER.ADMIN_DOCUMENT_TYPE_MANAGEGENERICCATEGORY_STATE;
                        break;
                    case CategoryTypeObjList.ECO_DFMType.ID:
                        manageGenericCategoryState = USER.ADMIN_ECO_DFM_TYPE_MANAGEGENERICCATEGORY_STATE;
                        break;
                    case CategoryTypeObjList.ChargesType.ID:
                        manageGenericCategoryState = USER.ADMIN_CHARGES_TYPE_MANAGEGENERICCATEGORY_STATE;
                        break;
                    case CategoryTypeObjList.NotificationCategory.ID:
                        manageGenericCategoryState = USER.ADMIN_NOTIFICATION_CATEGORY_MANAGEGENERICCATEGORY_STATE;
                        break;
                    case CategoryTypeObjList.PayablePaymentMethods.ID:
                        manageGenericCategoryState = USER.ADMIN_PAYMENT_METHODS_MANAGEGENERICCATEGORY_STATE;
                        break;
                    case CategoryTypeObjList.Carriers.ID:
                        manageGenericCategoryState = USER.ADMIN_CARRIERMST_MANAGEGENERICCATEGORY_STATE;
                        break;
                    case CategoryTypeObjList.ReportCategory.ID:
                        manageGenericCategoryState = USER.ADMIN_REPORTCATEGORY_MANAGEGENERICCATEGORY_STATE;
                        break;
                    case CategoryTypeObjList.PartRequirementCategory.ID:
                        manageGenericCategoryState = USER.ADMIN_PARTREQUIREMENTCATEGORY_MANAGEGENERICCATEGORY_STATE;
                        break;
                    case CategoryTypeObjList.ReceivablePaymentMethods.ID:
                        manageGenericCategoryState = USER.ADMIN_RECEIVABLE_PAYMENT_METHODS_MANAGEGENERICCATEGORY_STATE;
                        break;
                    case CategoryTypeObjList.PaymentTypeCategory.ID:
                        manageGenericCategoryState = USER.ADMIN_PAYMENT_TYPE_CATEGORY_MANAGEGENERICCATEGORY_STATE;
                        break;
                }

                $state.go(manageGenericCategoryState, {
                    categoryTypeID: vm.categoryTypeID,
                    gencCategoryID: row ? row.entity.gencCategoryID : null
                });
            };

            // delete
            vm.deleteRecord = (genericcategory) => {
                let selectedIDs = [];
                let categoryType = null;

                if (genericcategory) {
                    selectedIDs.push(genericcategory.gencCategoryID);
                    categoryType = genericcategory.categoryType;
                } else {
                    vm.selectedRows = vm.selectedRowsList;
                    if (vm.selectedRows.length > 0) {
                        selectedIDs = vm.selectedRows.map((genericcategoryItem) => genericcategoryItem.gencCategoryID);
                    }
                }

                if (selectedIDs) {
                    const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
                    messageContent.message = stringFormat(messageContent.message, vm.categoryType ? vm.categoryType.displayName : 'Generic category', selectedIDs.length);
                    const obj = {
                        messageContent: messageContent,
                        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                    };
                    const objIDs = {
                        id: selectedIDs,
                        categoryType: categoryType,
                        displayName: vm.categoryType.displayName,
                        CountList: false
                    };
                    DialogFactory.messageConfirmDialog(obj).then((yes) => {
                        if (yes) {
                            $scope.cgBusyLoading = GenericCategoryFactory.deleteGenericCategory().query({ objIDs: objIDs }).$promise.then((res) => {
                                if (res) {
                                    if (res.data && (res.data.length > 0 || res.data.transactionDetails)) {
                                        const data = {
                                            TotalCount: res.data.transactionDetails[0].TotalCount,
                                            pageName: vm.categoryType.displayName,
                                            IsHideTransactionCount: vm.categoryType.categoryTypeID === CategoryTypeObjList.DocumentType.ID ? true : false
                                        };
                                        BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                                            const IDs = {
                                                id: selectedIDs,
                                                CountList: true
                                            };
                                            return GenericCategoryFactory.deleteGenericCategory().query({
                                                objIDs: IDs
                                            }).$promise.then((res) => {
                                                let data = {};
                                                data = res.data;
                                                data.pageTitle = genericcategory ? genericcategory.gencCategoryName : null;
                                                data.PageName = vm.categoryType.displayName;
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
                    messageContent.message = stringFormat(messageContent.message, vm.categoryType ? vm.categoryType.displayName : 'generic category');
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

            //Update cell for display order flied
            function cellEdit() {
                vm.isEditIntigrate = true;
                vm.gridOptions.gridApi.edit.on.afterCellEdit($scope, (rowEntity, colDef, newvalue, oldvalue) => {
                    const obj = _.find(vm.sourceData, (item) => item.gencCategoryID === rowEntity.gencCategoryID);
                    const index = vm.sourceData.indexOf(obj);
                    if (colDef.field === 'displayOrder' && newvalue !== oldvalue) {
                        if (!BaseService.setInvalidDisplayOrder(oldvalue, newvalue, index, (colDef.colInitIndex - 1), vm.gridOptions, vm.sourceData, vm.sourceHeader, rowEntity, 0)) {
                            return;
                        }
                        const categoryInfo = {
                            displayOrder: newvalue,
                            id: rowEntity.gencCategoryID,
                            categoryType: rowEntity.categoryType,
                            gencCategoryName: rowEntity.gencCategoryName,
                            gencCategoryCode: rowEntity.gencCategoryCode,
                            displayName: vm.categoryType.displayName,
                            singleLabel: vm.categoryType.singleLabel
                        };
                        $scope.cgBusyLoading = GenericCategoryFactory.genericcategory().update({
                            id: rowEntity.gencCategoryID
                        }, categoryInfo).$promise.then((res) => {
                            if (res) {
                                if (res.status === CORE.ApiResponseTypeStatus.FAILED || res.status === CORE.ApiResponseTypeStatus.EMPTY) {
                                    rowEntity.displayOrder = oldvalue;
                                }
                                else if (res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                                    BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                                }
                            }
                        }).catch((error) => BaseService.getErrorLog(error));
                    }
                });
            }

            vm.downloadDocument = () => {
                let messageContent = {};
                $scope.cgBusyLoading = GenericCategoryFactory.downloadGenericCategoryTemplate(vm.categoryType.fileName).then((response) => {
                    if (response.status === 404) {
                        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_NotFound);
                        DialogFactory.messageAlertDialog({ messageContent: messageContent, multiple: true });
                    } else if (response.status === 403) {
                        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_AccessDenied);
                        DialogFactory.messageAlertDialog({ messageContent: messageContent, multiple: true });
                    } else if (response.status === 401) {
                        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_Unauthorized);
                        DialogFactory.messageAlertDialog({ messageContent: messageContent, multiple: true });
                    }
                    else {
                        const blob = new Blob([response.data], { type: 'text/csv' });
                        if (navigator.msSaveOrOpenBlob) {
                            navigator.msSaveOrOpenBlob(blob, vm.categoryType.displayName + '.csv');
                        } else {
                            const link = document.createElement('a');
                            if (!link.download) {
                                const url = URL.createObjectURL(blob);
                                link.setAttribute('href', url);
                                link.setAttribute('download', vm.categoryType.displayName + '.csv');
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


            //refresh generic category
            vm.refreshCategory = () => {
                vm.loadData();
            };

            const reloadGenericCategoryList = $scope.$on(USER.GenericCategoryListReloadBroadcast, () => {
                if (!vm.gridOptions.enablePaging) {
                    initPageInfo();
                }
                vm.loadData();
            });

            const exportGenericCategoryTemplate = $scope.$on(USER.GenericCategoryExportTemplateBroadcast, () => {
                vm.downloadDocument();
            });

            const addUpdateGenericCategory = $scope.$on(USER.GenericCategoryAddUpdateBroadcast, () => {
                vm.updateRecord();
            });

            //close popup on page destroy
            $scope.$on('$destroy', () => {
                $mdDialog.hide(false, { closeAll: true });
                reloadGenericCategoryList();
                exportGenericCategoryTemplate();
                addUpdateGenericCategory();
            });
        }
    }
})();
