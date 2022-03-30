(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('quoteAttributeGrid', quoteAttributeGrid);
  /** @ngInject */
  function quoteAttributeGrid(USER, CORE, RFQSettingFactory, BaseService, $timeout, DialogFactory) {
    const directive = {
      scope: {
        type: '=?',
        refereshData: '=',
        isNoDataFound: '='
      },
      templateUrl: 'app/directives/custom/quote-attribute-grid/quote-attribute-grid.html',
      controller: quoteAttributeGridCtrl,
      controllerAs: 'vm',
      link: function () {
      }
    };
    return directive;
    /** @ngInject */
    /**
    * Controller for view data of alternative details
    *
    * @param
    */

    function quoteAttributeGridCtrl($scope) {
      const vm = this;
      vm.isUpdatable = true;
      vm.showUMIDHistory = true;
      vm.actionButtonName = 'History';
      vm.type = $scope.type;
      $scope.refereshData = refereshData;
      vm.attributeTypeConst = CORE.ATTRIBUTE_TYPE;
      vm.quote_attribute_type = CORE.QUOTE_DB_ATTRIBUTE_TYPE;
      vm.quoteAyytibuteTypeName = CORE.ATTRIBUTE_TYPE_NAME;
      vm.EmptyMesssage = vm.type === vm.attributeTypeConst.RFQ ? USER.ADMIN_EMPTYSTATE.QUOTE_DYNAMIC_FIELDS : USER.ADMIN_EMPTYSTATE.SUPPLIER_QUOTE_DYNAMIC_FIELDS;
      vm.StatusOptionsGridHeaderDropdown = CORE.StatusOptionsGridHeaderDropdown;
      vm.DisplayMarginStatusGridHeaderDropdown = CORE.DisplayMarginStatusGridHeaderDropdown;
      vm.CostingTypeStatusGridHeaderDropdown = CORE.CostingTypeStatusGridHeaderDropdown;
      vm.isEditIntigrate = false;
      vm.DefaultDateFormat = _dateTimeDisplayFormat;
      vm.gridConfig = CORE.gridConfig;
      vm.LabelConstant = CORE.LabelConstant;
      vm.selectedTabIndex = 0;
      vm.loginUser = BaseService.loginUser;
      const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;

      vm.quoteAttributeColumn = [
        {
          field: 'commissionConvertedValue',
          displayName: 'Commission',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" \
                                                            ng-class="{\'label-success\':row.entity.isCommission == true, \
                                                            \'label-warning\':row.entity.isCommission == false}"> \
                                                                {{ COL_FIELD }}'
            + '</span>'
            + '</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.DisplayMarginStatusGridHeaderDropdown
          },
          ColumnDataType: 'StringEquals',
          width: 120
        }, {
          field: 'includeInOtherAttributeValue',
          displayName: 'Include Other Attribute In Calculation',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" \
                                                            ng-class="{\'label-success\':row.entity.isIncludeInOtherAttribute == true, \
                                                            \'label-warning\':row.entity.isIncludeInOtherAttribute == false}"> \
                                                                {{ COL_FIELD }}'
            + '</span>'
            + '</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.DisplayMarginStatusGridHeaderDropdown
          },
          ColumnDataType: 'StringEquals',
          width: 180
        },
        {
          field: 'refQuoteAttributeName',
          displayName: 'Ref. Quote Attribute',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '180',
          enableCellEdit: false
        }];

      //Column definitions
      vm.sourceHeader = [{
        field: 'Action',
        cellClass: 'gridCellColor',
        displayName: 'Action',
        width: '75',
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
        pinnedLeft: true,
        enableSorting: false,
        enableCellEdit: false
      }, {
        field: 'fieldName',
        displayName: 'Name',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '500',
        enableCellEdit: false
      }, {
        field: 'displayOrder',
        displayName: 'Display Order' + CORE.Modify_Grid_column_Allow_Change_Message,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | number: 2}}</div>',
        width: 230,
        enableCellEdit: true,
        type: 'number'
      }, {
        field: 'costingType',
        displayName: 'Costing Type',
        enableCellEdit: false,
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" ng-class="grid.appScope.$parent.vm.getCostingTypeClassName(row.entity.costingType)">'
          + '{{COL_FIELD}} ({{grid.appScope.$parent.vm.getType(row.entity.dataType)}})'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.CostingTypeStatusGridHeaderDropdown
        }
      }, {
        field: 'displayPercentageConvertedValue',
        displayName: 'Display %',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.displayPercentage == true, \
                            \'label-warning\':row.entity.displayPercentage == false}"> \
                                {{ COL_FIELD }}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.DisplayMarginStatusGridHeaderDropdown
        },
        width: '110'
      }, {
        field: 'displayMarginConvertedValue',
        displayName: 'Display Margin',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.displayMargin == true, \
                            \'label-warning\':row.entity.displayMargin == false}"> \
                                {{ COL_FIELD }}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.DisplayMarginStatusGridHeaderDropdown
        },
        width: '130'
      }, {
        field: 'displayAffectType',
        displayName: 'Lead Time Affecting',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span  \
                            ng-class="{\'label-success label-box\':row.entity.affectType == \'M\', \
                            \'label-warning label-box\':row.entity.affectType == \'L\'}"> \
                                {{ COL_FIELD }}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: CORE.AffectTypeStatusGridHeaderDropdown
        },
        width: '110'
      }, {
        field: 'displaySelectionType',
        displayName: 'Lead Time Selection Criteria',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '180'
      }, {
        field: 'toolingQty',
        displayName: 'Qty',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="row.entity.toolingQty">{{COL_FIELD | numberWithoutDecimal}}</div>',
        width: '100'
      }, {
        field: 'toolingPrice',
        displayName: 'Price(ea)',
        cellTemplate: '<div class="ui-grid-cell-contents  grid-cell-text-right" ng-if="row.entity.toolingPrice">{{COL_FIELD | amount}}</div>',
        width: '100'
      }, {
        field: 'applyToAllConvertedValue',
        displayName: 'Apply To All ' + (vm.type === vm.attributeTypeConst.RFQ ? vm.quoteAyytibuteTypeName.RFQ : vm.quoteAyytibuteTypeName.SUPPLIER),
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" \
                                                            ng-class="{\'label-success\':row.entity.applyToAll == true, \
                                                            \'label-warning\':row.entity.applyToAll == false}"> \
                                                                {{ COL_FIELD }}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.DisplayMarginStatusGridHeaderDropdown
        },
        ColumnDataType: 'StringEquals',
        width: 120
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
          options: vm.StatusOptionsGridHeaderDropdown
        },
        ColumnDataType: 'StringEquals',
        width: 120
      }, {
        field: 'updatedAt',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableFiltering: false,
        visible: false
      }, {
        field: 'updatedby',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true,
        visible: false
      }, {
        field: 'updatedbyRole',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true,
        visible: false
      }, {
        field: 'createdAt',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableFiltering: false
      }, {
        field: 'createdby',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }, {
        field: 'createdbyRole',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        type: 'StringEquals',
        enableFiltering: true,
        visible: false
      }];

      if (vm.type === vm.attributeTypeConst.RFQ) {
        _.each(vm.quoteAttributeColumn, (item, index) => {
          vm.sourceHeader.splice((12 + index), 0, item);
        });
      }


      const initPageInfo = () => {
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),
          SortColumns: [],
          SearchColumns: []
        };
      };

      initPageInfo();

      //bind grid Options
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
        exporterCsvFilename: stringFormat('{0} {1}', (vm.type === vm.attributeTypeConst.RFQ ? vm.quoteAyytibuteTypeName.RFQ : vm.quoteAyytibuteTypeName.SUPPLIER), 'Quote Attributes.csv')
      };

      function setDataAfterGetAPICall(quoteDynamicFields, isGetDataDown) {
        if (quoteDynamicFields && quoteDynamicFields.data.QuoteDynamicFields) {
          if (!isGetDataDown) {
            vm.sourceData = quoteDynamicFields.data.QuoteDynamicFields;
            vm.currentdata = vm.sourceData.length;
          }
          else if (quoteDynamicFields.data.QuoteDynamicFields.length > 0) {
            vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(quoteDynamicFields.data.QuoteDynamicFields);
            vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
          }
          // must set after new data comes
          vm.totalSourceDataCount = quoteDynamicFields.data.Count;
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
            if (!vm.isEditIntigrate) {
              cellEdit();
            }
          }
          if (vm.totalSourceDataCount === 0) {
            if (vm.pagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
              vm.isNoDataFound = false;
              $scope.isNoDataFound = false;
              vm.emptyState = 0;
            }
            else {
              vm.isNoDataFound = true;
              $scope.isNoDataFound = true;
              vm.emptyState = null;
            }
          }
          else {
            vm.isNoDataFound = false;
            $scope.isNoDataFound = false;
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
        vm.pagingInfo.type = vm.type === vm.attributeTypeConst.RFQ ? vm.quote_attribute_type.RFQ : vm.quote_attribute_type.SUPPLIER;
        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        vm.cgBusyLoading = RFQSettingFactory.retriveQuoteDynamicFieldsList().query(vm.pagingInfo).$promise.then((quoteDynamicFields) => {
          if (quoteDynamicFields.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            setDataAfterGetAPICall(quoteDynamicFields, false);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* load more data on mouse scroll */
      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.pagingInfo.type = vm.type === vm.attributeTypeConst.RFQ ? vm.quote_attribute_type.RFQ : vm.quote_attribute_type.SUPPLIER;
        vm.cgBusyLoading = RFQSettingFactory.retriveQuoteDynamicFieldsList().query(vm.pagingInfo).$promise.then((quoteDynamicFields) => {
          if (quoteDynamicFields) {
            setDataAfterGetAPICall(quoteDynamicFields, true);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      // delete quote Dynamic Fields
      vm.deleteRecord = (quoteDynamicFields) => {
        let selectedIDs = [];
        if (quoteDynamicFields) {
          selectedIDs.push(quoteDynamicFields.id);
        } else {
          vm.selectedRows = vm.selectedRowsList;
          if (vm.selectedRows.length > 0) {
            selectedIDs = vm.selectedRows.map((quoteDynamicFieldsItem) => quoteDynamicFieldsItem.id);
          }
        }
        if (selectedIDs) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, 'Quote Attributes', selectedIDs.length);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          const objIDs = {
            id: selectedIDs,
            CountList: false
          };
          DialogFactory.messageConfirmDialog(obj).then((resposne) => {
            if (resposne) {
              vm.cgBusyLoading = RFQSettingFactory.deleteQuoteDynamicFields().query({ objIDs: objIDs }).$promise.then((response) => {
                if (response && response.data && (response.data.length > 0 || response.data.transactionDetails)) {
                  const data = {
                    TotalCount: response.data.transactionDetails[0].TotalCount,
                    pageName: CORE.PageName.quote_attribute
                  };
                  BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                    const IDs = {
                      id: selectedIDs,
                      CountList: true
                    };
                    return RFQSettingFactory.deleteQuoteDynamicFields().query({
                      objIDs: IDs
                    }).$promise.then((res) => {
                      const data = res.data || {};
                      data.pageTitle = quoteDynamicFields ? quoteDynamicFields.fieldName : null;
                      data.PageName = CORE.PageName.quote_attribute;
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
          messageContent.message = stringFormat(messageContent.message, 'Quote Attributes');
          const alertModel = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(alertModel);
        }
      };

      // add/edit quote Dynamic Fields
      vm.addEditRecord = (data, ev) => {
        if (!data) {
          data = { quoteAttributeType: vm.type === vm.attributeTypeConst.RFQ ? vm.quote_attribute_type.RFQ : vm.quote_attribute_type.SUPPLIER };
        }
        DialogFactory.dialogService(
          CORE.MANAGE_QUOTE_DYNAMIC_FIELDS_MODAL_CONTROLLER,
          CORE.MANAGE_QUOTE_DYNAMIC_FIELDS_MODAL_VIEW,
          ev,
          data).then(() => {
          }, (data) => {
            if (data) {
              BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
            }
          }, () => {
          });
      };

      vm.getCostingTypeClassName = (statusID) => BaseService.getCostingTypeClassName(statusID);

      /* delete multiple data called from directive of ui-grid*/
      vm.deleteMultipleData = () => {
        vm.deleteRecord();
      };

      /* Update Quote Dynamic Fields*/
      vm.updateRecord = (row, ev) => {
        vm.addEditRecord(row.entity, ev);
      };
      //get type of costing
      vm.getType = (item) => {
        const objItem = _.find(CORE.Costing_Data_Type, (data) => data.ID === item);
        if (objItem) {
          return objItem.Name;
        }
      };

      //Update cell for display order flied
      function cellEdit() {
        vm.isEditIntigrate = true;
        vm.gridOptions.gridApi.edit.on.afterCellEdit($scope, (rowEntity, colDef, newvalue, oldvalue) => {
          if (colDef.field === 'displayOrder') {
            if (newvalue !== oldvalue) {
              const measurementInfo = {
                displayOrder: newvalue,
                id: rowEntity.id,
                fieldName: rowEntity.fieldName
              };
              //if (newvalue != null) {
              vm.cgBusyLoading = RFQSettingFactory.quoteDynamicFields().save(measurementInfo).$promise.then((res) => {
                if (res) {
                  if (res.status === CORE.ApiResponseTypeStatus.FAILED) {
                    if (colDef.field === 'displayOrder') {
                      rowEntity.displayOrder = oldvalue;
                    }
                  }
                  else if (res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                    BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                  }
                }
              }).catch((error) => BaseService.getErrorLog(error));
              //} else {
              //    const obj = _.find(vm.sourceData, function (item) { return item.id == rowEntity.id });
              //    const index = vm.sourceData.indexOf(obj);
              //    vm.gridOptions.gridApi.grid.validate.setInvalid(vm.gridOptions.data[index], vm.gridOptions.columnDefs[4]);
              //}
            }
          }
        });
      }
      //refresh quote attributes
      vm.refreshQuoteAttributes = () => {
        vm.loadData();
      };
      function refereshData() {
        BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
      }

      /* Show History Popup */
      vm.UMIDHistory = (row, ev) => {
        row.title = `${CORE.PageName.quote_attribute} History`;
        row.TableName = CORE.DATAENTRYCHANGE_AUDITLOG_TABLENAME.QUOTECHARGES_DYNAMIC_FIELDS_MST;
        row.EmptyMesssage = vm.type === vm.attributeTypeConst.RFQ ? CORE.COMMON_HISTORY.RFQ_QUOTE_ATTRIBUTE.HISTORY_EMPTY_MESSAGE : CORE.COMMON_HISTORY.SUPPLIER_QUOTE_ATTRIBUTE.HISTORY_EMPTY_MESSAGE;
        row.headerData = [{
          label: 'Type',
          value: vm.type === vm.attributeTypeConst.RFQ ? CORE.COMMON_HISTORY.RFQ_QUOTE_ATTRIBUTE.Type : CORE.COMMON_HISTORY.SUPPLIER_QUOTE_ATTRIBUTE.Type,
          displayOrder: 1,
          labelLinkFn: vm.goToQuoteAttributeList
        }, {
          label: vm.type === vm.attributeTypeConst.RFQ ? CORE.COMMON_HISTORY.RFQ_QUOTE_ATTRIBUTE.LABLE_NAME : CORE.COMMON_HISTORY.SUPPLIER_QUOTE_ATTRIBUTE.LABLE_NAME,
          value: row.fieldName,
          displayOrder: 2,
          labelLinkFn: vm.goToQuoteAttributeList
        }];
        DialogFactory.dialogService(
          CORE.COMMON_HISTORY_POPUP_MODAL_CONTROLLER,
          CORE.COMMON_HISTORY_POPUP_MODAL_VIEW,
          ev,
          row).then(() => { }, (err) => BaseService.getErrorLog(err));
      };

      /* Goto Quote Attributes list page. */
      vm.goToQuoteAttributeList = () => {
        if (vm.type === vm.attributeTypeConst.RFQ) {
          BaseService.goToQuoteAttributeList();
        } else {
          BaseService.goToSupplierQuoteAttributelist();
        }
      };
    }
  }
})();
