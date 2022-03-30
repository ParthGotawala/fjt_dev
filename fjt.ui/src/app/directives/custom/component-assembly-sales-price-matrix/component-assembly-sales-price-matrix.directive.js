(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('componentAssemblySalesPriceMatrix', componentAssemblySalesPriceMatrix);

  /** @ngInject */
  function componentAssemblySalesPriceMatrix($q, $sce, $state, $filter, $timeout, CORE, USER, RFQTRANSACTION, DialogFactory, BaseService, TRANSACTION, ComponentPriceBreakDetailsFactory) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        partId: '=?',
        rfqNumber: '=',
        mfgType: '=?',
        formName: '=',
        cgBusyLoading: '=',
        quoteValidDate: '=',
        isReadOnly: '=?'
      },
      templateUrl: 'app/directives/custom/component-assembly-sales-price-matrix/component-assembly-sales-price-matrix.html',
      controller: componentAssemblySalesPriceMatrixCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function componentAssemblySalesPriceMatrixCtrl($scope, $element, $attrs) {
      var vm = this;
      vm.isHideDelete = true;
      vm.isReadOnly = $scope.isReadOnly;
      vm.isDeleteFeatureBased = false;
      vm.LabelConstant = angular.copy(CORE.LabelConstant);
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.QUOTE_HISTORY;
      vm.DateTimeFormat = _dateDisplayFormat;
      vm.customprice = false;
      vm.gridQuoteHistory = CORE.gridConfig.gridQuoteHistory;
      vm.gridQuoteHistoryDetail = CORE.gridConfig.gridQuoteHistory;
      vm.partId = $scope.partId;
      vm.quoteValidTillDate = $scope.quoteValidDate;
      vm.mfgTypeDist = CORE.MFG_TYPE.DIST;
      vm.mfgType = $scope.mfgType ? $scope.mfgType.toUpperCase() : null;
      vm.rfqNumber = $scope.rfqNumber ? $scope.rfqNumber.toUpperCase() : null;
      vm.unitOfTime = RFQTRANSACTION.RFQ_TURN_TYPE;
      vm.amountInputStep = _amountInputStep;
      vm.unitPriceInputStep = _unitPriceInputStep;
      vm.salesPriceList = [];
      vm.deltedRows = [];
      vm.gridQuoteHistoryHeightClass = TRANSACTION.SalesPrice_Quote_Split_UI.QuoteHistoryGridUI;
      vm.gridQuoteHistoryDetHeightClass = TRANSACTION.SalesPrice_Quote_Split_UI.QuoteHistoryDetailGridUI;
      vm.rfqHistorylist = [];
      vm.rfqHistoryDetailList = [];
      $scope.splitPaneProperties = {};
      $scope.splitSubPaneProperties = {};
      vm.loginUser = BaseService.loginUser;
      const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
      //initialize paging info for Quote History grid
      const initPageInfo = () => {
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),
          SortColumns: [],
          SearchColumns: []
        };
      };
      initPageInfo();

      //initialize paging info for Selected Quote History Detail grid
      const initHistoryDetailPageInfo = () => {
        vm.HistoryDetailPageInfo = {
          Page: CORE.UIGrid.Page(),
          SortColumns: [],
          SearchColumns: []
        };
      };
      initHistoryDetailPageInfo();

      vm.gridOptions = {
        enablePaging: isEnablePagination,
        enablePaginationControls: isEnablePagination,
        showColumnFooter: false,
        enableRowHeaderSelection: false,
        enableFullRowSelection: false,
        enableRowSelection: false,
        multiSelect: false,
        isShowDelete: false,
        filterOptions: vm.pagingInfo.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: 'Quote History.csv'
      };

      //grid options for  Selected Quote History Detail grid
      vm.HistoryDetailgridOptions = {
        enablePaging: false,
        enablePaginationControls: false,
        showColumnFooter: false,
        enableRowHeaderSelection: false,
        enableFullRowSelection: false,
        enableRowSelection: false,
        multiSelect: false,
        filterOptions: vm.pagingInfo.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: `${vm.SelectedRfqNumber}.csv`,
        isShowDelete: false,
        isDeleteFeatureBased: false
      };

      vm.sourceHeader = [
        {
          field: 'Apply',
          displayName: 'Select',
          width: '75',
          cellTemplate: '<div class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox"><md-checkbox  ng-model="row.entity.isQuoteRecordSelected" \
                           ng-change="grid.appScope.$parent.vm.getSelectedQuoteRow(row.entity)" ></md-checkbox></div > ',
          enableFiltering: false,
          enableSorting: false,
          exporterSuppressExport: true,
          pinnedLeft: false,
          enableColumnMoving: false,
          manualAddedCheckbox: true
        },
        {
          field: '#',
          width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
          cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
          enableFiltering: false,
          enableSorting: false
        },
        {
          field: 'rfqNumber',
          width: '120',
          displayName: 'Quote#',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                                            <a class="cm-text-decoration underline" ng-if="(row.entity.maxRfqAssyID)" \
                                                ng-click="grid.appScope.$parent.vm.goToSummary(row.entity.maxRfqAssyID);"\
                                                tabindex="-1">{{COL_FIELD}}</a>\
                                          <span ng-if="(!row.entity.maxRfqAssyID)">{{COL_FIELD}}\</span>\
                                        </div>',
          enableFiltering: true,
          enableSorting: true
        }, {
          field: 'createdAtValue',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
          type: 'datetime',
          enableFiltering: false
        }, {
          field: 'createdbyRole',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
          type: 'StringEquals',
          enableFiltering: true
        }, {
          field: 'createdby',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
          type: 'StringEquals',
          enableFiltering: true
        }];
      //source header for History Details grid
      vm.HistoryDetailsourceHeader = [{
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
        enableFiltering: false,
        enableSorting: false
      }, {
        field: 'priceBreak',
        width: '100',
        displayName: 'Qty',
        cellTemplate: '<div class="ui-grid-cell-contents text-right">{{COL_FIELD}}</div>',
        enableFiltering: true,
        enableSorting: true
      }, {
        field: 'turnTime',
        width: '80',
        displayName: 'Turn Time',
        cellTemplate: '<div class="ui-grid-cell-contents text-right">{{COL_FIELD}}</div>',
        enableFiltering: true,
        enableSorting: true
      }, {
        field: 'unitOfTimeVal',
        width: '120',
        displayName: 'Unit Of Time',
        cellTemplate: '<div class="ui-grid-cell-contents ui-grid-cell-contents-break text-left">{{COL_FIELD}}</div>',
        enableFiltering: true,
        enableSorting: true
      }, {
        field: 'unitPrice',
        displayName: 'Unit Price ($)',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
        width: '100',
        type: 'datetime',
        enableFiltering: true,
        enableSorting: true
      }, {
        field: 'extPrice',
        displayName: 'Ext. Price ($)',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
        width: '120',
        type: 'StringEquals',
        enableFiltering: true
      }, {
        field: 'salesCommissionPercentage',
        displayName: 'Sales Commission (%)',
        cellTemplate: '<div class="ui-grid-cell-contents text-right">{{COL_FIELD}}</div>',
        width: '60',
        enableFiltering: true
      }, {
        field: 'salesCommissionAmount',
        width: '100',
        displayName: 'Sales Commission ($)',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
        enableFiltering: true,
        enableSorting: true
      }, {
        field: 'extSalesCommission',
        width: '100',
        displayName: 'Ext. Sales Commission ($)',
        cellTemplate: '<div class="ui-grid-cell-contents text-right">{{COL_FIELD}}</div>',
        enableFiltering: true,
        enableSorting: true
      }, {
        field: 'salesCommissionNotes',
        displayName: 'Sales Commission Note',
        cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
          '<span class="cursor-pointer bom-header-wrap">{{ COL_FIELD }}</span> &nbsp;' +
          '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.salesCommissionNotes && row.entity.salesCommissionNotes !== \'-\'" ng-click="grid.appScope.$parent.vm.showSalesCommissionlNotes(row, $event)">' +
          '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
          '<md-tooltip>View</md-tooltip>' +
          '</button>' +
          '</div>',
        width: '150',
        enableFiltering: false,
        enableSorting: false
      }];
      //get customer alias rev. data for grid bind
      vm.loadData = () => {
        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        vm.pagingInfo.partId = vm.partId;
        $scope.$parent.vm.cgBusyLoading = ComponentPriceBreakDetailsFactory.getSalesCommissionHistoryList().query(vm.pagingInfo).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS && res.data) {
            // vm.quoteHistoryList = res.data.quoteHistoryList;
            if (res && res.data) {
              setDataAfterGetAPICall(res, false);
            }
          }
        });
      };

      //get data down for customer alias rev. grid
      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        $scope.$parent.vm.cgBusyLoading = ComponentPriceBreakDetailsFactory.getSalesCommissionHistoryList().query(vm.pagingInfo).$promise.then((res) => {
          if (res && res.data) {
            setDataAfterGetAPICall(res, true);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };
      // to set data in grid after data is retrieved from API in loadData() and getDataDown() function
      const setDataAfterGetAPICall = (quoteHistory, isGetDataDown) => {
        if (quoteHistory && quoteHistory.data && quoteHistory.data.quoteHistoryList) {
          if (!isGetDataDown) {
            vm.sourceData = quoteHistory.data.quoteHistoryList;
            vm.currentdata = vm.sourceData.length;
          }
          else if (CompCustAliasRev.data.CompCustAliasRev.length > 0) {
            vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(quoteHistory.data.quoteHistoryList);
            vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
          }
          if (Array.isArray(vm.sourceData) && vm.sourceData.length > 0) {
            vm.sourceData[0].isQuoteRecordSelected = true;
            vm.SelectedRfqNumber = vm.sourceData[0].rfqNumber;
            vm.rfqAssyID = vm.sourceData[0].maxRfqAssyID;
          } else {
            vm.historyDetSourceData = [];
            vm.historyDetSourceDataCount = 0;
            vm.rfqAssyID = null;
            vm.SelectedRfqNumber = null;
          }

          // must set after new data comes
          vm.totalSourceDataCount = quoteHistory.data.Count;
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
        }
      };

      //on selection for Quote History
      vm.getSelectedQuoteRow = (row) => {
        if (row && row.id) {
          if (row.id !== vm.CPNPartID) {
            _.each(vm.sourceData, (item) => {
              item.isQuoteRecordSelected = false;
            });
            vm.SelectedRfqNumber = row.rfqNumber;
            vm.rfqAssyID = row.maxRfqAssyID;
            row.isQuoteRecordSelected = true;
            vm.HistoryDetailloadData();
          }
          else {
            row.isQuoteRecordSelected = true;
          }
        }
      };

      //get Selected Quote History Detail data for grid bind
      vm.HistoryDetailloadData = () => {
        BaseService.setPageSizeOfGrid(vm.HistoryDetailPageInfo, vm.HistoryDetailgridOptions);
        vm.HistoryDetailPageInfo.partId = vm.partId;
        vm.HistoryDetailPageInfo.rfqNumber = vm.SelectedRfqNumber;
        if (vm.SelectedRfqNumber) {
          $scope.$parent.vm.cgBusyLoading = ComponentPriceBreakDetailsFactory.getSalesCommissionHistoryDetList().query(vm.HistoryDetailPageInfo).$promise.then((res) => {
            if (res && res.data) {
              vm.HistoryDetailgridOptions.exporterCsvFilename = `${vm.SelectedRfqNumber}.csv`;
              setHistoryDetAfterGetAPICall(res, false);
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
        else {
          vm.historyDetSourceData = [];
          vm.historyDetSourceDataCount = 0;
          vm.rfqAssyID = null;
          vm.SelectedRfqNumber = null;
        }
      };

      // to set data in grid after data is retrieved from API in loadData() and getDataDown() function
      const setHistoryDetAfterGetAPICall = (historyDetList, isGetDataDown) => {
        if (historyDetList && historyDetList.data && historyDetList.data.historyDetail) {
          if (!isGetDataDown) {
            vm.historyDetSourceData = historyDetList.data.historyDetail;
            vm.historyDetcurrentdata = vm.historyDetSourceData.length;
          }
          else if (historyDetList.data.historyDetail.length > 0) {
            vm.historyDetSourceData = vm.HistoryDetailgridOptions.data = vm.HistoryDetailgridOptions.data.concat(historyDetList.data.historyDetail);
            vm.historyDetcurrentdata = vm.HistoryDetailgridOptions.currentItem = vm.HistoryDetailgridOptions.data.length;
          }
          // must set after new data comes
          vm.historyDetSourceDataCount = historyDetList.data.Count;
          if (!vm.HistoryDetailgridOptions.enablePaging) {
            if (!isGetDataDown) {
              vm.HistoryDetailgridOptions.gridApi.infiniteScroll.resetScroll();
            }
            else {
              vm.HistoryDetailgridOptions.gridApi.infiniteScroll.saveScrollPercentage();
            }
          }
          if (!isGetDataDown) {
            vm.HistoryDetailgridOptions.clearSelectedRows();
          }
          if (vm.historyDetSourceDataCount === 0) {
            if (vm.HistoryDetailPageInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
              vm.isHistoryDetNoDataFound = false;
              vm.HistoryDetemptyState = 0;
            }
            else {
              vm.isHistoryDetNoDataFound = true;
              vm.HistoryDetemptyState = null;
            }
          }
          else {
            vm.isHistoryDetNoDataFound = false;
            vm.HistoryDetemptyState = null;
          }
          $timeout(() => {
            if (!isGetDataDown) {
              vm.HistoryDetailgridOptions.clearSelectedRows();
              vm.historyDetresetSourceGrid();
              if (!vm.HistoryDetailgridOptions.enablePaging && vm.historyDetSourceDataCount === vm.Componentcurrentdata) {
                return vm.HistoryDetailgridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
              }
            }
            else {
              return vm.HistoryDetailgridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.historyDetSourceDataCount !== vm.historyDetcurrentdata ? true : false);
            }
          });
        }
      };

      /* to display header Sales Commission notes */
      vm.showSalesCommissionlNotes = (row, ev) => {
        const popupData = {
          title: 'Sales Commission Note',
          description: row.entity.salesCommissionNotes
        };
        DialogFactory.dialogService(
          CORE.DESCRIPTION_MODAL_CONTROLLER,
          CORE.DESCRIPTION_MODAL_VIEW,
          ev,
          popupData).then(() => {
          }, (err) => BaseService.getErrorLog(err));
      };

      function addNewRow() {
        if (vm.componentAssemblySalesPriceMatrix &&
          vm.componentAssemblySalesPriceMatrix.$invalid &&
          BaseService.focusRequiredField(vm.componentAssemblySalesPriceMatrix)) {
          return;
        }

        let minId = -1;
        if (vm.salesPriceList && vm.salesPriceList.length > 0) {
          const item = _.min(_.sortBy(vm.salesPriceList, 'id'), 'id');
          if (item && item.id <= 0) {
            minId = item.id - 1;
            if (minId === 0) {
              minId = -1;
            }
          }
        }
        const newRowObj = {
          id: minId,
          priceBreak: 1,/*Qty*/
          turnTime: 15,/*turn time*/
          unitOfTime: vm.unitOfTime.BUSINESS_DAY.VALUE, /*unit of time*/
          unitPrice: null,/*unit Price*/
          extendedPrice: $filter('amount')(0),
          salesCommissionPercentage: 0,
          salesCommissionAmount: 0,
          extendedSalesCommissionAmt: $filter('amount')(0),
          salesCommissionNotes: null,
          isHistory: false
        };
        vm.calculateExtPrice(newRowObj, false);
        vm.salesPriceList.push(newRowObj);

        const index = vm.salesPriceList.indexOf(newRowObj);
        if (index || index === 0) {
          setFocusByName('priceBreak' + index, true);
        }
      };

      vm.autoCompleteQuoteHistory = {
        columnName: 'rfqNumber',
        keyColumnName: 'rfqNumber',
        keyColumnId: null,
        inputName: 'RfqHistory',
        placeholderName: 'Quote History',
        isRequired: true,
        isAddnew: false,
        onSelectCallbackFn: function (item) {
          if (item) {
            vm.rfqNumberHistory = item.rfqNumber;
            getQuoteHistory(item.rfqNumber);
          } else {
            vm.rfqNumberHistory = null;
          }
        }
      };

      function getQuoteHistory(rfqNumber) {
        vm.rfqHistoryDetailList = [];
        if (rfqNumber) {
          const searchObj = {
            partId: vm.partId,
            rfqQuoteNumber: rfqNumber,
            isHistory: true
          };
          $scope.$parent.vm.cgBusyLoading = ComponentPriceBreakDetailsFactory.getAssySalesPriceListByAssyId().query(searchObj).$promise.then((response) => {
            if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data) {
              if (response.data.length) {
                _.each(response.data.salesCommissionDetails, (data, index) => data.id = ((index + 1) * -1));
                vm.rfqHistoryDetailList = response.data;
                vm.objHistoryRFQ = _.find(vm.rfqHistoryDetailList, (salePrice) => salePrice.rfqAssyID);
                _.each(vm.rfqHistoryDetailList, (item) => {
                  //item.extendedPrice = Math.round(item.unitPrice * item.priceBreak, _unitPriceFilterDecimal);
                  vm.calculateExtPrice(item, false);
                  vm.calculateExtSalesCommission(item);
                });
              }
            }
          });
        }
      };

      vm.addCommissionNewRow = (row, event, isAddNew) => {
        if (!event.originalEvent.altKey &&
          !event.originalEvent.ctrlKey &&
          !event.originalEvent.shiftKey) {
          if (event.originalEvent.keyCode === 9) {
            if (!vm.salesPriceList || vm.salesPriceList[vm.salesPriceList.length - 1].id === row.id) {
              addNewRow();
            }
          }
          else if (isAddNew) {
            addNewRow();
          }
        }
      };

      vm.removeRow = (row) => {
        if (vm.isReadOnly) {
          return;
        }

        if (row) {
          const index = vm.salesPriceList.indexOf(row);
          if (vm.salesPriceList.length > 0) {
            const obj = {
              messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.DELETE_SALES_COMMISSION_FROM_LIST_CONFIRMATION,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
            };
            DialogFactory.messageConfirmDialog(obj).then(() => {
              vm.salesPriceList.splice(index, 1);
              vm.checkQtyWisePriceValidation();
              vm.checkDuplicateValidation();
              if (row.id > 0) {
                vm.deltedRows.push(row);
                vm.componentAssemblySalesPriceMatrix.$setDirty();
              }
            }, () => {
              // cancel
            });
          }
        }
      };

      vm.reQuote = () => {
        if (vm.isReadOnly) {
          return;
        }
        if (vm.componentAssemblySalesPriceMatrix.$dirty) {
          const alertModel = {
            messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.SAVE_QUOTE_DETAIL_FOR_REQUOTE,
            multiple: true
          };
          DialogFactory.messageAlertDialog(alertModel);
          return;
        }
        if (vm.salesPriceList.length > 0) {
          const obj = {
            messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.REQUOTE_SALES_COMMISSION_ALL_DATA_CONFIRMATION,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };

          DialogFactory.messageConfirmDialog(obj).then(() => {
            _.each(vm.salesPriceList, (row) => {
              row.isHistory = true;
            });
            vm.componentAssemblySalesPriceMatrix.$setDirty();
            vm.saveAssySalesPrice(true);
            vm.rfqNumber = undefined;
            setFocusByName('rfqNumber');
          }, () => {
            // cancel
          });
        }
      };

      vm.calculateExtPrice = (item, isSetDirty) => {
        if (item) {
          item.extendedPrice = multipleUnitValue(item.unitPrice, item.priceBreak, _unitPriceFilterDecimal);
          item.extendedPrice = $filter('amount')(item.extendedPrice);
          if (isSetDirty) {
            vm.calculatePercentageAndAmount(item, true);
          }
        }
      };

      vm.calculateExtSalesCommission = (item) => {
        if (item) {
          item.extendedSalesCommissionAmt = multipleUnitValue(item.salesCommissionAmount, item.priceBreak, _unitPriceFilterDecimal);
          item.extendedSalesCommissionAmt = $filter('amount')(item.extendedSalesCommissionAmt);
        }
      };

      vm.getAssySalesPriceList = () => {
        const detailObj = {
          partId: vm.partId,
          isHistory: false
        };
        $scope.$parent.vm.cgBusyLoading = ComponentPriceBreakDetailsFactory.getAssySalesPriceListByAssyId().query(detailObj).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS && res.data) {
            vm.salesPriceList = res.data;
            vm.objRFQ = _.find(vm.salesPriceList, (salePrice) => salePrice.rfqAssyID);
            if (vm.salesPriceList && vm.salesPriceList.length > 0) {
              vm.componentAssemblySalesPriceMatrix.$setPristine();
              vm.deltedRows = [];
              const rfqNumberNew = _.first(vm.salesPriceList).rfqNumber;
              if (vm.rfqNumber !== rfqNumberNew) {
                vm.rfqNumber = rfqNumberNew;
              }

              _.each(vm.salesPriceList, (item) => {
                //item.extendedPrice = Math.round(item.unitPrice * item.priceBreak, _unitPriceFilterDecimal);
                vm.calculateExtPrice(item, false);
                vm.calculateExtSalesCommission(item);
              });
            }
          }
          $timeout(() => vm.setDefaultSize(), 2000);
        }).catch((error) => BaseService.getErrorLog(error));
      };
      vm.getAssySalesPriceList();

      vm.refreshData = () => {
        if (vm.componentAssemblySalesPriceMatrix.$dirty) {
          const obj = {
            messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.DELETE_SALES_COMMISSION_FROM_LIST_CONFIRMATION,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then(() => {
            vm.getAssySalesPriceList();
            vm.loadData();
          }, () => {
            // cancel
          });
        }
        else {
          vm.loadData();
          vm.getAssySalesPriceList();
        }
      };

      vm.saveAssySalesPrice = (isReQuote) => {
        if (vm.isReadOnly) {
          return;
        }

        if (BaseService.focusRequiredField(vm.componentAssemblySalesPriceMatrix)) {
          return;
        }
        if (vm.checkDuplicateValidation()) {
          return;
        }
        if (vm.checkQtyWisePriceValidation()) {
          return;
        }
        const newlyAddedRows = [];
        const updatedRows = [];

        if (vm.salesPriceList && vm.salesPriceList.length > 0) {
          _.each(vm.salesPriceList, (item) => {
            if (item.id < 0) {
              newlyAddedRows.push(item);
            }
            else if (item.id > 0) {
              updatedRows.push(item);
            }
          });
        }

        const salesPriceObj = {
          mfgPNID: vm.partId,
          rfqNumber: vm.rfqNumber,
          addedRecords: newlyAddedRows,
          updatedRecords: updatedRows,
          deletedIds: vm.deltedRows,
          isReQuote: isReQuote,
          quoteValidTillDate: vm.quoteValidTillDate
        };
        $scope.$parent.vm.cgBusyLoading = ComponentPriceBreakDetailsFactory.saveAssySalesPrice().query({ salesPriceObj: salesPriceObj })
          .$promise.then((res) => {
            if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              vm.deltedRows = [];
              vm.quoteValidTillDate = salesPriceObj.isReQuote ? null : vm.quoteValidTillDate;
              vm.componentAssemblySalesPriceMatrix.$setPristine();
              vm.getAssySalesPriceList();
              if (salesPriceObj.isReQuote) {
                vm.loadData();
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.calculatePercentageAndAmount = (row, isPercentageChanged) => {
        if (row) {
          const totalAmt = (row.unitPrice || 0); // ((row.priceBreak || 0) * (row.unitPrice || 0));
          if (isPercentageChanged) {
            //const calculatedAmt = (totalAmt * (row.salesCommissionPercentage || 0)) / 100;
            //const calculatedAmt = multipleUnitValue(totalAmt, (row.salesCommissionPercentage || 0), _unitPriceFilterDecimal) / 100;
            const calculatedAmt = roundUpNum((((100 / (100 + (row.salesCommissionPercentage || 0))) * totalAmt) * (row.salesCommissionPercentage || 0) / 100), _unitPriceFilterDecimal);
            if (row.salesCommissionAmount !== parseFloat(calculatedAmt.toFixed(_unitPriceFilterDecimal))) {
              vm.componentAssemblySalesPriceMatrix.$setDirty();
              row.salesCommissionAmount = parseFloat(calculatedAmt.toFixed(_unitPriceFilterDecimal));
            }
          }
          else {
            if ((row.salesCommissionAmount || 0) > (totalAmt / 2)) {
              row.salesCommissionAmount = (totalAmt / 2);
            }
            //const calculatedPercentage = (totalAmt && totalAmt !== 0) ? (((row.salesCommissionAmount || 0) * 100) / (totalAmt)) : 0;
            const calculatedPercentage = roundUpNum(((totalAmt - (totalAmt - (row.salesCommissionAmount || 0))) * 100 / (totalAmt - (row.salesCommissionAmount || 0))), _amountFilterDecimal);
            if (row.salesCommissionPercentage !== parseFloat(calculatedPercentage.toFixed(2))) {
              vm.componentAssemblySalesPriceMatrix.$setDirty();
              row.salesCommissionPercentage = parseFloat(calculatedPercentage.toFixed(2));
            }
          }

          vm.calculateExtSalesCommission(row);
        }
      };

      vm.checkQtyWisePriceValidation = () => {
        let isInvalidData = false;
        if (vm.salesPriceList && vm.salesPriceList.length) {
          _.map(vm.salesPriceList, (i) => { i.invalidPrice = false; });
          _.each(vm.salesPriceList, (item) => {
            let unitOfTime = parseFloat(item.turnTime || 0);
            if (item.unitOfTime === vm.unitOfTime.BUSINESS_DAY.VALUE) {
              unitOfTime = (7 * parseFloat(item.turnTime || 0) / 5);
            } else if (item.unitOfTime === vm.unitOfTime.WEEK.VALUE) {
              unitOfTime = (7 * parseFloat(item.turnTime || 0));
            }
            // const invalidData = _.find(vm.salesPriceList, (d) => d.priceBreak < item.priceBreak && d.unitPrice < item.unitPrice);
            const invalidData = _.find(vm.salesPriceList, (d) => d.priceBreak !== null && d.unitPrice !== null && d.priceBreak < item.priceBreak && d.unitPrice < item.unitPrice && (d.unitOfTime === vm.unitOfTime.BUSINESS_DAY.VALUE ? (7 * parseFloat(d.turnTime || 0) / 5) : d.unitOfTime === vm.unitOfTime.WEEK.VALUE ? (7 * parseFloat(d.turnTime || 0)) : parseFloat(d.turnTime || 0)) <= unitOfTime);
            if (invalidData) {
              invalidData.invalidPrice = true;
              item.invalidPrice = true;/*setting invalid for both lines with which price conflict*/
              isInvalidData = true;
            }
          });
        }
        return isInvalidData;
      };

      vm.checkDuplicateValidation = () => {
        let isInvalidData = false;
        if (vm.salesPriceList && vm.salesPriceList.length) {
          _.map(vm.salesPriceList, (i) => { i.duplicateQty = false; });
          const groupData = _.groupBy(vm.salesPriceList, (item) => item.priceBreak + '#' + item.turnTime + '#' + item.unitOfTime);
          _.each(groupData, (item) => {
            if (item.length > 1) {
              _.each(item, (row) => {
                const index = vm.salesPriceList.indexOf(row);
                if (index !== -1) {
                  vm.salesPriceList[index].duplicateQty = true;
                }
              });
              isInvalidData = true;
            }
          });
        }
        return isInvalidData;
      };

      vm.getSalesCommissionDetailsFromRfq = (isProceedOverrideQuote) => {
        if (vm.rfqNumber) {
          const searchObj = {
            partId: vm.partId,
            rfqQuoteNumber: vm.rfqNumber,
            isPushToPartMaster: false,
            proceedOverriderQuote: isProceedOverrideQuote ? true : false,
            isCallFromPartMaster: true
          };
          $scope.$parent.vm.cgBusyLoading = ComponentPriceBreakDetailsFactory.getSalesCommissionDetailsFromRfq().query(searchObj).$promise.then((response) => {
            if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data) {
              if (Array.isArray(response.data) && response.data.length > 0 && response.data[0].alreadyExistQuote) {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.REVERT_HISTORY_QUOTE_CONFIRMATION);
                messageContent.message = stringFormat(messageContent.message, searchObj.rfqQuoteNumber);
                const obj = {
                  messageContent: messageContent,
                  btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
                  canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                };

                DialogFactory.messageConfirmDialog(obj).then(() => {
                  vm.getSalesCommissionDetailsFromRfq(true);
                }, () => {
                  vm.rfqNumber = undefined;
                  setFocusByName('rfqNumber');
                  // cancel
                });
              } else {
                if (response.data.salesCommissionDetails.length) {
                  vm.salesPriceList = response.data.salesCommissionDetails;
                  vm.quoteValidTillDate = Array.isArray(vm.salesPriceList) && vm.salesPriceList.length > 0 ? vm.salesPriceList[0].quoteValidTillDate : null;
                  vm.objRFQ = _.find(vm.salesPriceList, (salePrice) => salePrice.rfqAssyID);
                  if (vm.salesPriceList && vm.salesPriceList.length > 0) {
                    // vm.rfqNumber = _.first(vm.salesPriceList).rfqNumber;
                    _.each(vm.salesPriceList, (item) => {
                      vm.calculateExtPrice(item, true);
                      vm.calculateExtSalesCommission(item);
                    });
                    vm.checkQtyWisePriceValidation();
                    vm.checkDuplicateValidation();
                  }
                  setFocusByName('priceBreak0', true);
                  vm.componentAssemblySalesPriceMatrix.$setPristine();
                }
                else if (vm.salesPriceList && vm.salesPriceList.length === 0) {
                  addNewRow();
                }
              }
              vm.loadData();
            }
          });
        }
      };

      vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

      const onSaveAssySalesPrice = $scope.$on(USER.ComponentAssySalesPriceSaveBroadcast, () => {
        vm.saveAssySalesPrice();
      });

      //dynamic height increase for purchase detail and selected part detail grid
      $scope.$watch('splitPaneProperties.firstComponentSize', () => {
        //for selected Quote History grid
        const gridchildclientHeightShipping = getGridDetail(TRANSACTION.SalesPrice_Quote_Split_UI.QuoteHistoryGridUI);
        const clientHeightChild = $scope.splitPaneProperties.lastComponentSize;// - 130;
        setGridHeight(gridchildclientHeightShipping, clientHeightChild);

        const gridchildclientHeightPartComments = getGridDetail(TRANSACTION.SalesPrice_Quote_Split_UI.QuoteHistoryDetailGridUI);
        setGridHeight(gridchildclientHeightPartComments, clientHeightChild);
      });

      //grid detail from class name
      function getGridDetail(GridClass) {
        return document.getElementsByClassName(GridClass);
      }
      //grid height can be used with function
      function setGridHeight(gridchildclientHeight, clientHeightChild) {
        if (gridchildclientHeight && gridchildclientHeight.length > 0) {
          gridchildclientHeight[0].setAttribute('style', 'height:' + clientHeightChild + 'px !important;');
        }
      }
      vm.setDefaultSize = () => {
        if ($scope.splitPaneProperties && $scope.splitPaneProperties.firstComponentSize && $scope.splitPaneProperties.lastComponentSize) {
          $scope.splitPaneProperties.firstComponentSize = $scope.splitPaneProperties.firstComponentSize + 5;
          $scope.splitPaneProperties.lastComponentSize = $scope.splitPaneProperties.lastComponentSize - 5;
        }
        else {
          $scope.splitPaneProperties = {
            firstComponentSize: 375,
            lastComponentSize: 325
          };
        }
      };

      angular.element(() => {
        BaseService.currentPageForms.push(vm.componentAssemblySalesPriceMatrix);
        $scope.formName = vm.componentAssemblySalesPriceMatrix;
        $timeout(() => {
          focusOnFirstEnabledFormField(vm.componentAssemblySalesPriceMatrix);
        }, _configTimeout);
      });
      // go to cost summary
      vm.goToSummary = (id) => {
        BaseService.goToQuoteSummary(id);
      };

      $scope.$on('$destroy', () => {
        onSaveAssySalesPrice();
      });
    }
  }
})();
