(function () {
  'use strict';
  angular.module('app.rfqtransaction').directive('rfqList', rfqList);

  /** @ngInject */
  function rfqList() {
    const directive = {
      restrict: 'E',
      replace: true,
      scope: {
        partid: '=?'
      },
      templateUrl: 'app/directives/custom/rfq-list/rfq-list.html',
      controller: RFQListController,
      controllerAs: 'vm',
      link: function () {
      }
    };
    return directive;

    /** @ngInject */
    /**
    * Controller for view data of RFQ
    * @param
    */
    function RFQListController($timeout, $scope, $mdDialog, $state, $filter, CORE, RFQTRANSACTION, CONFIGURATION, PRICING, DialogFactory, BaseService, RFQFactory, USER, RFQSettingFactory, MasterFactory, ImportBOMFactory, BOMFactory, AssyTypeFactory, WorkorderFactory, ComponentFactory, socketConnectionService, $q, SupplierInvoiceFactory, TRANSACTION) {
      const vm = this;
      vm.isPartFilter = $scope.partid ? true : false;
      vm.isUpdatable = true;
      vm.showUMIDHistory = true;
      vm.view = false;
      vm.isDeleteBOM = true;
      vm.isDownload = true;
      vm.isPrinted = true;
      vm.comapnyCode = '';
      const APIProjectURLconfig = _configWebUrl;
      vm.reportFormat = 1;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.KeywordStatusGridHeaderDropdown = CORE.KeywordStatusGridHeaderDropdown;
      vm.isAssyAtGlance = true;
      vm.isExportQuoteReport = true;
      vm.RFQFilterCriteria = RFQTRANSACTION.RFQFilterCriteria;
      vm.selectedRowsList = [];
      vm.gridConfig = CORE.gridConfig;
      vm.CORE = CORE;
      vm.LabelConstant = CORE.LabelConstant;
      vm.configTimeout = _configTimeout;
      vm.EmptyStateMesssage = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.RFQ;
      vm.actionButtonName = 'Assembly Quote Status History';
      vm.isCostingActivityHistory = true;
      vm.DisplayStatus = CORE.DisplayStatus;
      vm.DateDisplayFormatArray = CORE.DateFormatArray;
      vm.DateFormatArray = _dateDisplayFormat;
      vm.DefaultDateTimeFormat = _dateTimeDisplayFormat;
      vm.rfqStatus = RFQTRANSACTION.RFQ_ASSY_STATUS;
      vm.rfqQuoteProgress = RFQTRANSACTION.RFQ_ASSY_QUOTE_STATUS;
      vm.loginUser = BaseService.loginUser;
      vm.loginUserId = vm.loginUser.userid;
      vm.transactionType = TRANSACTION.StartStopActivityTransactionType;
      vm.actionType = TRANSACTION.StartStopActivityActionType;
      const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;

      const IsPermanentDelete = CORE.IsPermanentDelete;
      vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
      vm.isBOM = true;
      vm.isCopyBOM = true;
      vm.isCopyRFQ = true;
      vm.setScrollClass = 'gridScrollHeight_RFQ';
      vm.IsRepeatGridHeaderDropdown = CORE.IsRepeatGridHeaderDropdown;
      vm.statusGridHeaderDropdown = CORE.RFQStatusGridHeaderDropdown;
      vm.serachRfq = vm.statusGridHeaderDropdown[1].id;
      vm.searchText = vm.statusGridHeaderDropdown[1].id;
      vm.quoteProgressGridHeaderDropdown = CORE.RFQQuoteProgressGridHeaderDropdown;
      vm.rfqSubmittedStatus = _.find(vm.quoteProgressGridHeaderDropdown, { id: 'Submitted' }).value;
      vm.rfqCompletedStatus = _.find(vm.quoteProgressGridHeaderDropdown, { id: 'Completed' }).value;
      vm.rfqCancelledStatus = _.find(vm.statusGridHeaderDropdown, { id: 'Canceled' }).value;
      vm.isAssyChangeStatus = true;
      vm.quotePageType = RFQTRANSACTION.QUOTE_PAGE_TYPE;
      vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.COMPONENT_FILTERS;
      vm.showRefreshMessage = false;
      vm.quoteDueDateOptions = {
        quoteDueDateOpenFlag: false
      };
      vm.filter = {
        searchRfq: vm.statusGridHeaderDropdown[1].id,
        searchcompleteRfq: '',
        quoteDueDate: null,
        isExportControlled: false,
        isQuoteOverdue: false,
        isSubAssemblyBOMs: false,
        isPriceGroupQuoteAssembly: false,
        customers: [],
        jobType: [],
        rfqType: [],
        assyType: [],
        assyPID: [],
        assyMfgPn: [],
        nicknames: [],
        criteria: null,
        olderThenDays: null
      };
      function getCompayDetails() {
        vm.cgBusyLoading = SupplierInvoiceFactory.companyConfigurationCheck().query({}).$promise.then((response) => {
          if (response && response.data) {
            vm.comapnyCode = response.data.mfgCode;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }

      function connectSocket() {
        socketConnectionService.on(PRICING.EventName.sendBOMStartStopActivity, startStopActivityListener);
        socketConnectionService.on(PRICING.EventName.sendCostingStartStopActivity, startStopCostingActivityListener);
      }
      connectSocket();

      socketConnectionService.on('reconnect', () => {
        connectSocket();
      });

      function removeSocketListener() {
        socketConnectionService.removeListener(PRICING.EventName.sendBOMStartStopActivity, startStopActivityListener);
        socketConnectionService.removeListener(PRICING.EventName.sendCostingStartStopActivity, startStopCostingActivityListener);
      }


      // [S] Socket Listeners
      function startStopActivityListener(message) {
        if (message && message.partID) {
          const partList = _.filter(vm.sourceData, { partID: message.partID });
          _.each(partList, (item) => {
            if (message.isActivityStart) {
              item.username = message.userName;
              item.isActivityStart = true;
              item.activityStartAt = 0;
              item.activityStartBy = message.loginUserId;
              item.activityStartAtDateTime = message.activityStartAt;
              vm.startTimer(item);
            }
            else {
              item.username = '';
              item.isActivityStart = false;
              item.activityStartAt = 0;
              item.activityStartBy = null;
              item.activityStartAtDateTime = null;
              item.currentTimerDiff = '';
              clearInterval(item.tickActivity);
            }
          });
          if (partList && partList.length) {
            $timeout(() => {
              vm.resetSourceGrid();
              $scope.$applyAsync();
            });
          }
        }
      }

      // [S] Socket Listeners for Costing Activity Start Stop
      function startStopCostingActivityListener(message) {
        if (message && message.rfqAssyID) {
          const RFQAssyList = _.filter(vm.sourceData, { rfqAssyID: parseInt(message.rfqAssyID) });
          _.each(RFQAssyList, (item) => {
            if (message.isActivityStart) {
              item.costingUserName = message.userName;
              item.isCostingActivityStart = true;
              item.costingActivityBy = message.loginUserId;
              item.costingActivityStartAt = 0;
              vm.startCostingTimer(item);
            }
            else {
              item.costingUserName = '';
              item.isCostingActivityStart = false;
              item.costingActivityStartAt = 0;
              item.costingActivityBy = null;
              item.currentCostingTimerDiff = '';
              clearInterval(item.tickCostingActivity);
            }
          });
          if (RFQAssyList && RFQAssyList.length) {
            $timeout(() => {
              vm.resetSourceGrid();
              $scope.$applyAsync();
            });
          }
        }
      }

      // on disconnect socket
      socketConnectionService.on('disconnect', () => {
        removeSocketListener();
      });

      /*call source header in function so RoHS list can bind and append in header filter*/
      function loadsource() {
        vm.sourceHeader = [{
          field: 'Action',
          cellClass: 'gridCellColor',
          displayName: 'Action',
          width: '120',
          cellTemplate: '<grid-action-view grid="grid" row="row"></grid-action-view>',
          enableFiltering: false,
          enableSorting: false,
          exporterSuppressExport: true,
          pinnedLeft: true
        }, {
          field: '#',
          width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
          cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
          enableFiltering: false,
          enableSorting: false
        }, {
          field: 'QuoteStatus',
          width: '410',
          minWidth: '410',
          displayName: 'Cost status',
          cellTemplate: '<rfq-assembly-quote-status row-data="row.entity"></rfq-assembly-quote-status>',
          ColumnDataType: 'StringEquals',
          enableSorting: false,
          enableFiltering: false,
          allowCellFocus: false
        }, {
          field: 'status',
          width: '120',
          displayName: vm.LabelConstant.BOM.RFQStatus,
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" \
                                    ng-class="{\'label-success\':row.entity.status == grid.appScope.$parent.vm.statusGridHeaderDropdown[3].value, \
                                    \'label-info\':row.entity.status == grid.appScope.$parent.vm.statusGridHeaderDropdown[2].value, \
                                    \'label-danger\':row.entity.status == grid.appScope.$parent.vm.statusGridHeaderDropdown[4].value, \
                                    \'red A200-bg\':row.entity.status == grid.appScope.$parent.vm.statusGridHeaderDropdown[5].value, \
                                    \'label-warning\':row.entity.status == grid.appScope.$parent.vm.statusGridHeaderDropdown[1].value}"> \
                                        {{ COL_FIELD }}'
            + '</span>'
            + '</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.statusGridHeaderDropdown
          },
          ColumnDataType: 'StringEquals',
          enableFiltering: false,
          enableSorting: false
        }, {
          field: 'quoteProgress',
          width: '140',
          displayName: vm.LabelConstant.BOM.QuoteProgress,
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" \
                                    ng-class="{\'label-info\':row.entity.quoteProgress == grid.appScope.$parent.vm.quoteProgressGridHeaderDropdown[3].value, \
                                    \'label-primary\':row.entity.quoteProgress == grid.appScope.$parent.vm.quoteProgressGridHeaderDropdown[2].value, \
                                    \'label-success\':row.entity.quoteProgress == grid.appScope.$parent.vm.quoteProgressGridHeaderDropdown[4].value, \
                                    \'label-warning\':row.entity.quoteProgress == grid.appScope.$parent.vm.quoteProgressGridHeaderDropdown[1].value}"> \
                                        {{ COL_FIELD }}'
            + '</span>'
            + '</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.quoteProgressGridHeaderDropdown
          },
          ColumnDataType: 'StringEquals',
          enableFiltering: false,
          enableSorting: false
        }, {
          field: 'username',
          width: '100',
          displayName: 'Activity Started By',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-if="row.entity.isActivityStart">{{COL_FIELD}}</div>'
        }, {
          field: 'activityStartAt',
          width: '150',
          displayName: 'Activity Started From (HH:MM:SS)',
          type: 'date',
          cellTemplate: '<div class="ui-grid-cell-contents text-center flex layout-align-center-center" ng-if="row.entity.isActivityStart"><label flex="100" layout-align="start center" layout="row" class="label-box label-warning">{{row.entity.currentTimerDiff}}</label><img class="ml-5 h-22 w-22" src="../../../../../assets/images/logos/stop.png" ng-click="grid.appScope.$parent.vm.stopBOMActivity(row.entity);" title="Stop Activity"></div>',
          enableFiltering: false,
          exporterSuppressExport: true
        },
        {
          field: 'costingUserName',
          width: '130',
          displayName: 'Costing Activity Started By',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-if="row.entity.isCostingActivityStart">{{COL_FIELD}}</div>'
        }, {
          field: 'costingActivityStartAt',
          width: '150',
          displayName: 'Costing Activity Started From (HH:MM:SS)',
          type: 'date',
          cellTemplate: '<div class="ui-grid-cell-contents text-center flex layout-align-center-center" ng-if="row.entity.isCostingActivityStart"><label flex="100" layout-align="start center" layout="row" class="label-box label-warning">{{row.entity.currentCostingTimerDiff}}</label><img class="ml-5 h-22 w-22" src="../../../../../assets/images/logos/stop.png" ng-click="grid.appScope.$parent.vm.stopCostingActivity(row.entity);" title="Stop Costing Activity"></div>',
          enableFiltering: false,
          exporterSuppressExport: true
        },
        {
          field: 'Customer',
          width: '300',
          displayName: 'Customer',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        }, {
          field: 'salesCommissionTo',
          displayName: 'Sales Commission To',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          type: 'StringEquals',
          enableFiltering: true
        }, {
          field: 'id',
          width: '75',
          displayName: vm.LabelConstant.Assembly.QuoteGroup,
          cellTemplate: '<a class="cm-text-decoration underline"\
                                ng-click="grid.appScope.$parent.vm.goToRFQ(row.entity.id, row.entity.rfqAssyID);"\
                                tabindex="-1">{{COL_FIELD}}</a>'
        }, {
          field: 'quoteGroupAssyCount',
          width: '120',
          displayName: vm.LabelConstant.BOM.QuoteGroupAssy,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" style="color:red;" >{{COL_FIELD | numberWithoutDecimal}}</div>'
        }, {
          field: 'liveInternalVersion',
          width: '135',
          displayName: vm.LabelConstant.BOM.InternalVersion,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        }, {
          field: 'lineItemCount',
          width: '70',
          displayName: 'Item Count',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" style="color:red;" >{{COL_FIELD | numberWithoutDecimal}}</div>'
        }, {
          field: 'assyLevel',
          width: '70',
          displayName: vm.LabelConstant.BOM.AssyLevel,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>'
        }, {
          field: 'revisedQuoteCount',
          width: '100',
          displayName: 'Revised Quote Count',
          cellTemplate: '<a class="ui-grid-cell-contents grid-cell-text-right cursor-pointer" ng-class="{\'cursor-not-allow\':row.entity.revisedQuoteCount==0}" ng-click="grid.appScope.$parent.vm.requoteHistory(row.entity,row.entity.revisedQuoteCount,$event)">{{COL_FIELD | numberWithoutDecimal}}</a>'
        }, {
          field: 'PIDCode',
          width: CORE.UI_GRID_COLUMN_WIDTH.PID,
          // maxWidth: CORE.UI_GRID_COLUMN_WIDTH.PID,
          displayName: vm.LabelConstant.Assembly.PIDCode,
          cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link \
                                component-id="row.entity.partID" \
                                label="grid.appScope.$parent.vm.LabelConstant.Assembly.ID" \
                                value="row.entity.PIDCode" \
                                is-custom-part="row.entity.isCustom" \
                                cust-part-number="row.entity.custAssyPN"\
                                is-copy="true" \
                                rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.rohsIcon" \
                                rohs-status="row.entity.rohsComplientConvertedValue" \
                                is-assembly="true"\></div>',
          allowCellFocus: false,
          minWidth: CORE.UI_GRID_COLUMN_WIDTH.PID
        }, {
          field: 'mfgPN',
          width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
          //maxWidth: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
          displayName: vm.LabelConstant.Assembly.MFGPN,
          minWidth: CORE.UI_GRID_COLUMN_WIDTH.PID,
          cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link \
                                component-id="row.entity.partID" \
                                label="grid.appScope.$parent.vm.LabelConstant.Assembly.MFGPN" \
                                value="row.entity.mfgPN" \
                                is-copy="true" \
                                is-custom-part="row.entity.isCustom" \
                                cust-part-number="row.entity.custAssyPN"\
                                rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.rohsIcon" \
                                rohs-status="row.entity.rohsComplientConvertedValue" \
                                is-assembly="true"\></div>',
          allowCellFocus: false
        }, {
          field: 'rev',
          width: '100',
          displayName: vm.LabelConstant.Assembly.Rev,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        }, {
          field: 'nickName',
          width: CORE.UI_GRID_COLUMN_WIDTH.ASSY_NICKNAME,
          displayName: vm.LabelConstant.Assembly.NickName,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        }, {
          field: 'mfgPNDescription',
          width: '250',
          displayName: vm.LabelConstant.Assembly.Description,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        }, {
          field: 'assyType',
          width: '150',
          displayName: vm.LabelConstant.MFG.AssyType,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        }, {
          field: 'JobType',
          width: '100',
          displayName: 'Job Type',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        }, {
          field: 'OrderType',
          width: '130',
          displayName: 'RFQ Type',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        }, {
          field: 'quoteInDate',
          width: CORE.UI_GRID_COLUMN_WIDTH.ONLY_DATE_COLUMN,
          displayName: 'Quote Entry Date',
          type: 'date',
          cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.quoteInDate | date:grid.appScope.$parent.vm.DateFormatArray}}</div>',
          enableFiltering: false
        }, {
          field: 'quoteDueDate',
          width: CORE.UI_GRID_COLUMN_WIDTH.ONLY_DATE_COLUMN,
          displayName: 'Quote Due Date',
          type: 'date',
          cellTemplate: '<div class="ui-grid-cell-contents" style="color:{{row.entity.dueDateColor}}">{{row.entity.quoteDueDate | date:grid.appScope.$parent.vm.DateFormatArray}}</div>',
          enableFiltering: false
        }, {
          field: 'quoteNumber',
          width: '140',
          displayName: vm.LabelConstant.BOM.LastQuote,
          //cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          //cellTemplate: '<a class="ui-grid-cell-contents text-left cursor-pointer" ng-if="row.entity.quoteNumber" ng-class="{\'cursor-not-allow\':row.entity.lastQuoteID == null}" ng-click="grid.appScope.$parent.vm.goToQuote(row.entity.rfqAssyID,row.entity.lastQuoteID,$event)">{{COL_FIELD}}</a>'
          cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                  <a class="ui-grid-cell-contents text-left cursor-pointer"\
                      ng-if="row.entity.quoteNumber" ng-class="{\'cursor-not-allow\':row.entity.lastQuoteID == null}"\
                      ng-click="grid.appScope.$parent.vm.goToQuote(row.entity.rfqAssyID,row.entity.lastQuoteID,$event)"\
                      tabindex="-1">{{COL_FIELD}}</a>\
                  <copy-text label="grid.appScope.$parent.vm.LabelConstant.BOM.LastQuote" text="row.entity.quoteNumber" ng-if="row.entity.quoteNumber"></copy-text>\
              </div>'
        }, {
          field: 'quoteSubmitDate',
          width: CORE.UI_GRID_COLUMN_WIDTH.ONLY_DATE_COLUMN,
          displayName: 'Quote Submitted Date',
          type: 'date',
          cellTemplate: '<div class="ui-grid-cell-contents" style="color:{{row.entity.submitDateColor}}">{{row.entity.quoteSubmitDate | date:grid.appScope.$parent.vm.DateFormatArray}}</div>',
          enableFiltering: false
        }, {
          field: 'quoteValidTillDate',
          width: CORE.UI_GRID_COLUMN_WIDTH.ONLY_DATE_COLUMN,
          displayName: 'Quote Valid Till',
          type: 'date',
          cellTemplate: '<div class="ui-grid-cell-contents" style="color:{{row.entity.quoteValidTillDate}}">{{row.entity.quoteValidTillDate | date:grid.appScope.$parent.vm.DateFormatArray}}</div>',
          enableFiltering: false
        }, {
          field: 'RFQ_SubmitedBy',
          width: '165',
          displayName: 'Quote Submitted By',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>'
        }, {
          field: 'winQuantity',
          width: '150',
          displayName: 'Quote Win QTY',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right text denger" ng-if="row.entity.winPrice">{{ COL_FIELD | numberWithoutDecimal}}</div>'
        }, {
          field: 'winPrice',
          width: '150',
          displayName: 'Quote Win Price',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right text denger" ng-if="row.entity.winPrice">\
                                {{ COL_FIELD | amount }}</div>'
        }, {
          field: 'reason',
          width: '100',
          displayName: 'Quote Reason',
          cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-if="row.entity.reason" ng-click="grid.appScope.$parent.vm.viewRecord(row.entity,\'Quote Reason\', $event)"> \
                                View \
                               </md-button>',
          enableFiltering: false,
          type: 'html'
        }, {
          field: 'quoteClosedDate',
          width: CORE.UI_GRID_COLUMN_WIDTH.ONLY_DATE_COLUMN,
          displayName: 'Quote Closed Date',
          type: 'date',
          cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.quoteClosedDate | date:grid.appScope.$parent.vm.DateFormatArray}}</div>',
          enableFiltering: false
        }, {
          field: 'RFQ_ClosedBy',
          width: '150',
          displayName: 'Quote Closed By',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>'
        }, {
          field: 'isRepeat',
          width: '135',
          displayName: 'Life Expectancy',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">\
                              <span class="label-box" \
                                ng-class="{\'label-success\':row.entity.isRepeat == \'Repeat\', \
                                \'label-warning\':row.entity.isRepeat == \'One Time\'}"> \
                                    {{ COL_FIELD }}\
                              </span>\
                              </div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.IsRepeatGridHeaderDropdown
          },
          ColumnDataType: 'StringEquals',
          enableFiltering: true,
          enableSorting: false
        }, {
          field: 'isExportControl',
          displayName: 'Export Controlled',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.isExportControl ==\'Yes\', \
                            \'label-warning\':row.entity.isExportControl == \'No\'}"> \
                                {{ COL_FIELD }}'
            + '</span>'
            + '</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.KeywordStatusGridHeaderDropdown
          },
          ColumnDataType: 'StringEquals',
          width: 120,
          enableCellEdit: false,
          enableFiltering: true
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
          enableFiltering: true
        }, {
          field: 'createdAt',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
          type: 'datetime',
          enableFiltering: false,
          visible: false
        }, {
          field: 'rfqCreatedBy',
          displayName: 'RFQ Created By',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
          type: 'StringEquals',
          enableFiltering: true
        }];
      };
      const initPageInfo = () => {
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),
          pageSize: CORE.UIGrid.ItemsPerPage(),
          SortColumns: [['quoteDueDate', 'DESC']],
          SearchColumns: []
        };
      };
      initPageInfo();
      vm.isshow = true;
      loadsource();



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
        exporterCsvFilename: 'RFQ.csv'
      };


      //check for rfq status filter
      vm.getListFilter = () => {
        if (vm.filter.searchRfq === 'Completed') {
          vm.filter.searchcompleteRfq = vm.statusGridHeaderDropdown[3].id;
          vm.searchText = vm.filter.searchcompleteRfq;
        }
        else {
          vm.filter.searchcompleteRfq = '';
          vm.searchText = vm.filter.searchRfq;
        }
      };
      vm.getCompleteListFilter = () => {
        vm.searchText = vm.filter.searchcompleteRfq;
      };
      vm.quoteOverDueChange = () => {
        if (vm.filter.isQuoteOverdue) {
          vm.searchText = vm.filter.searchRfq = vm.statusGridHeaderDropdown[1].id;
        }
      };
      vm.resetAllFilters = () => {
        vm.searchText = vm.statusGridHeaderDropdown[1].id;
        vm.filter = {
          searchRfq: vm.statusGridHeaderDropdown[1].id,
          searchcompleteRfq: '',
          quoteDueDate: null,
          isExportControlled: false,
          isQuoteOverdue: false,
          isSubAssemblyBOMs: false,
          isPriceGroupQuoteAssembly: false,
          customers: [],
          jobType: [],
          rfqType: [],
          assyType: [],
          assyPID: [],
          assyMfgPn: [],
          nicknames: [],
          criteria: null,
          olderThenDays: null
        };
        vm.clearCustomerSearchText();
        vm.clearAssemblyTypeSearchText();
        vm.clearRFQTypeSearchText();
        vm.clearJobTypeSearchText();
        BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
      };


      vm.clearSelection = () => {
        vm.searchText = vm.statusGridHeaderDropdown[1].id;
        vm.filter = {
          searchRfq: vm.statusGridHeaderDropdown[1].id,
          searchcompleteRfq: '',
          quoteDueDate: null,
          isExportControlled: false,
          isQuoteOverdue: false,
          isSubAssemblyBOMs: false,
          isPriceGroupQuoteAssembly: false,
          customers: [],
          jobType: [],
          rfqType: [],
          assyType: [],
          assyPID: [],
          assyMfgPn: [],
          nicknames: [],
          criteria: null,
          olderThenDays: null
        };
      };

      vm.clearFilter = () => {
        vm.clearCustomerSearchText();
        vm.clearAssemblyTypeSearchText();
        vm.clearRFQTypeSearchText();
        vm.clearJobTypeSearchText();
      };

      //bind filter details
      const bindFilterDetail = () => {
        let assyIds = [];
        vm.isNoDatainFilter = false;
        const objStatus = _.find(vm.pagingInfo.SearchColumns, (item) => item.ColumnName === 'status');
        const objdudate = _.find(vm.pagingInfo.SearchColumns, (item) => item.ColumnName === 'quoteDueDate');
        if (vm.searchText) {
          if (vm.filter.searchRfq === 'Completed') {
            vm.isNoDatainFilter = true;
            vm.pagingInfo.SearchColumns.push({ ColumnName: 'quoteProgress', SearchString: vm.filter.searchRfq, ColumnDataType: 'StringEquals' });
          } else {
            vm.pagingInfo.SearchColumns = _.filter(vm.pagingInfo.SearchColumns, (item) => item.ColumnName !== 'quoteProgress');
          }
          if (objStatus) {
            objStatus.SearchString = vm.searchText;
          }
          else {
            vm.pagingInfo.SearchColumns.push({ ColumnName: 'status', SearchString: vm.searchText, ColumnDataType: 'StringEquals' });
          }
        }
        else {
          if (vm.filter.searchRfq === 'Completed') {
            vm.isNoDatainFilter = true;
            vm.pagingInfo.SearchColumns.push({ ColumnName: 'quoteProgress', SearchString: vm.filter.searchRfq, ColumnDataType: 'StringEquals' });
          } else {
            vm.pagingInfo.SearchColumns = _.filter(vm.pagingInfo.SearchColumns, (item) => item.ColumnName !== 'quoteProgress');
          }
          vm.pagingInfo.SearchColumns = _.filter(vm.pagingInfo.SearchColumns, (item) => item.ColumnName !== 'status');
        }
        if (objdudate && vm.filter.quoteDueDate) {
          vm.isNoDatainFilter = true;
          objdudate.SearchString = $filter('date')(vm.filter.quoteDueDate, vm.DateDisplayFormatArray[11].format);
        } else if (objdudate && !vm.filter.quoteDueDate) {
          vm.pagingInfo.SearchColumns.splice(vm.pagingInfo.SearchColumns.indexOf(objdudate), 1);
        } else {
          if (vm.filter.quoteDueDate) {
            vm.isNoDatainFilter = true;
            const quoteDueDate = $filter('date')(vm.filter.quoteDueDate, vm.DateDisplayFormatArray[11].format);
            vm.pagingInfo.SearchColumns.push({ ColumnName: 'quoteDueDate', SearchString: quoteDueDate, ColumnDataType: null });
          }
        }
        if (vm.filter.customers && vm.filter.customers.length > 0) {
          vm.isNoDatainFilter = true;
          vm.pagingInfo.customerIds = vm.filter.customers.join(',');
        } else {
          vm.pagingInfo.customerIds = null;
        }
        if (vm.filter.jobType && vm.filter.jobType.length > 0) {
          vm.isNoDatainFilter = true;
          vm.pagingInfo.jobTypeIds = vm.filter.jobType.join(',');
        } else {
          vm.pagingInfo.jobTypeIds = null;
        }
        if (vm.filter.rfqType && vm.filter.rfqType.length > 0) {
          vm.isNoDatainFilter = true;
          vm.pagingInfo.rfqTypeIds = vm.filter.rfqType.join(',');
        } else {
          vm.pagingInfo.rfqTypeIds = null;
        }
        if (vm.filter.assyType && vm.filter.assyType.length > 0) {
          vm.isNoDatainFilter = true;
          vm.pagingInfo.assyTypeIds = vm.filter.assyType.join(',');
        } else {
          vm.pagingInfo.assyTypeIds = null;
        }
        if (vm.filter.nicknames && vm.filter.nicknames.length > 0) {
          vm.pagingInfo.assyNicknameIds = [];
          _.each(vm.filter.nicknames, (item) => {
            var replacedString = item.nickname.replace('\\', '\\\\');
            replacedString.replace(/\"/g, '\\"').replace(/\'/g, "\\'").replace('[', '\\\\[').replace(']', '\\\\]');
            vm.pagingInfo.assyNicknameIds.push(replacedString);
          });
          vm.pagingInfo.assyNicknameIds = '"' + vm.pagingInfo.assyNicknameIds.join('","') + '"';
          vm.isNoDatainFilter = true;
        } else {
          vm.pagingInfo.assyNicknameIds = null;
        }
        assyIds = _.uniq(_.compact([..._.map(vm.filter.assyPID, 'id'), ..._.map(vm.filter.assyMfgPn, 'id')]));
        if (assyIds && assyIds.length > 0) {
          vm.pagingInfo.assyIds = assyIds.join(',');
        } else {
          vm.pagingInfo.assyIds = null;
        }
        if (vm.filter.isExportControlled || vm.filter.isQuoteOverdue || vm.filter.isSubAssemblyBOMs || vm.filter.isPriceGroupQuoteAssembly) {
          vm.isNoDatainFilter = true;
        }
        if ($scope.partid) {
          vm.pagingInfo.assyIds = $scope.partid;
        }
        setCriteriaCalculationDate(vm.pagingInfo);
        vm.pagingInfo.isExportControlled = vm.filter.isExportControlled;
        vm.pagingInfo.isQuoteOverdue = vm.filter.isQuoteOverdue;
        vm.pagingInfo.isSubAssemblyBOMs = vm.filter.isSubAssemblyBOMs;
        vm.pagingInfo.isPriceGroupQuoteAssembly = vm.filter.isPriceGroupQuoteAssembly;
        vm.pagingInfo.criteria = vm.filter.criteria || null;
        vm.pagingInfo.olderThenDays = vm.filter.olderThenDays || null;
      };

      function setCriteriaCalculationDate(filterObj) {
        var currentDate = BaseService.getCurrentDateTime();
        var date = new Date(currentDate);
        filterObj.fromDate = null;
        filterObj.toDate = null;
        switch (vm.filter.criteria) {
          case vm.RFQFilterCriteria.CURRENT_MONTH.value:
            filterObj.fromDate = moment(currentDate).startOf('month').format(CORE.MOMENT_DATE_TIME_FORMAT);
            filterObj.toDate = moment(currentDate).endOf('month').format(CORE.MOMENT_DATE_TIME_FORMAT);
            break;
          case vm.RFQFilterCriteria.CURRENT_QUARTER.value:
            filterObj.fromDate = moment(currentDate).startOf('quarter').format(CORE.MOMENT_DATE_TIME_FORMAT);
            filterObj.toDate = moment(currentDate).endOf('quarter').format(CORE.MOMENT_DATE_TIME_FORMAT);
            break;
          case vm.RFQFilterCriteria.CURRENT_YEAR.value:
            {
              switch (_accountingYear) {
                case CONFIGURATION.ACCOUNTINGYEAR.CALENDARYEAR:
                  filterObj.fromDate = moment(currentDate).startOf('year').format(CORE.MOMENT_DATE_TIME_FORMAT);
                  filterObj.toDate = moment(currentDate).endOf('year').format(CORE.MOMENT_DATE_TIME_FORMAT);
                  break;
                case CONFIGURATION.ACCOUNTINGYEAR.FISCALYEAR:
                  filterObj.fromDate = new Date(date.getFullYear(), 3, 1);/*3 Means April month [as moment starting 0 as January, 1 is first date of the month*/
                  filterObj.toDate = new Date((date.getFullYear() + 1), 3, 0);/*+1 Added One Year to current Year, 3 Means April month [as moment starting 0 as January, 0 is to take previous months last date]*/
                  break;
              }
            }
            break;
          case vm.RFQFilterCriteria.LAST_MONTH.value:
            filterObj.fromDate = moment(currentDate).subtract(1, 'months').startOf('month').format(CORE.MOMENT_DATE_TIME_FORMAT);
            filterObj.toDate = moment(currentDate).subtract(1, 'months').endOf('month').format(CORE.MOMENT_DATE_TIME_FORMAT);
            break;
          case vm.RFQFilterCriteria.LAST_QUARTER.value:
            filterObj.fromDate = moment(currentDate).subtract(3, 'months').startOf('quarter').format(CORE.MOMENT_DATE_TIME_FORMAT);
            filterObj.toDate = moment(currentDate).subtract(3, 'months').endOf('quarter').format(CORE.MOMENT_DATE_TIME_FORMAT);
            break;
          case vm.RFQFilterCriteria.LAST_YEAR.value:
            {
              switch (_accountingYear) {
                case CONFIGURATION.ACCOUNTINGYEAR.CALENDARYEAR:
                  filterObj.fromDate = moment(currentDate).subtract(12, 'months').startOf('year').format(CORE.MOMENT_DATE_TIME_FORMAT);
                  filterObj.toDate = moment(currentDate).subtract(12, 'months').endOf('year').format(CORE.MOMENT_DATE_TIME_FORMAT);
                  break;
                case CONFIGURATION.ACCOUNTINGYEAR.FISCALYEAR:
                  filterObj.fromDate = new Date(date.getFullYear() - 1, 3, 1);/*moment start month from 0(zero) as january*/
                  filterObj.toDate = new Date(date.getFullYear(), 3, 0);
                  break;
              }
            }
            break;
        }
        filterObj.fromDate = BaseService.getAPIFormatedDate(filterObj.fromDate);
        filterObj.toDate = BaseService.getAPIFormatedDate(filterObj.toDate);
      };

      function setDataAfterGetAPICall(rfq, isGetDataDown) {
        if (rfq && rfq.data.RFQ) {
          bindRFQdata(rfq.data);
          if (!isGetDataDown) {
            vm.sourceData = rfq.data.RFQ;
            vm.currentdata = vm.sourceData.length;
          }
          else if (rfq.data.RFQ.length > 0) {
            vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(rfq.data.RFQ);
            vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
          }
          // must set after new data comes
          vm.totalSourceDataCount = rfq.data.Count;
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
              vm.isNoDataFound = false;
              vm.emptyState = 0;
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
            $scope.$applyAsync();
          });
        }
      }
      // Apply filter click
      vm.applyFilter = () => {
        vm.pagingInfo.Page = CORE.UIGrid.Page();
        vm.loadData();
      };

      vm.loadData = () => {
        bindFilterDetail();
        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        vm.cgBusyLoading = RFQFactory.retrieveRFQList().query(vm.pagingInfo).$promise.then((rfq) => {
          if (rfq.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            setDataAfterGetAPICall(rfq, false);
          } else {
            vm.isNoDataFound = true;
            vm.emptyState = null;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      function bindRFQdata(RFQData) {
        var rfqQuoteStatus = _.groupBy(RFQData.QuoteStatus, 'rfqAssyID');
        vm.enabledDeleteBOM = BaseService.checkFeatureRights(CORE.FEATURE_NAME.DeleteBOM);
        _.each(RFQData.RFQ, (rfqObj) => {
          var statusobj = null;
          rfqObj.isDownloadDisabled = true;
          rfqObj.isPrintDisable = true;
          if (vm.enabledDeleteBOM && rfqObj.lineItemCount > 0 && !(rfqObj.quoteProgress === vm.rfqSubmittedStatus || rfqObj.quoteProgress === vm.rfqCompletedStatus) && rfqObj.assyRFQCount <= 1) {
            rfqObj.isBOMDelete = false;
          }
          else {
            rfqObj.isBOMDelete = true;
          }
          if (rfqObj.lineItemCount === 0) {
            rfqObj.isCopyBOM = true;
            rfqObj.isCopyRFQ = true;
          } else {
            rfqObj.isCopyBOM = false;
            rfqObj.isCopyRFQ = false;
          }
          if (rfqObj.isReadyForPricing) {
            rfqObj.isDisabledDelete = true;
            //   rfqObj.isRowSelectable = false;
          }
          if ((rfqObj.status === vm.statusGridHeaderDropdown[2].id || rfqObj.status === vm.statusGridHeaderDropdown[3].id || rfqObj.status === vm.statusGridHeaderDropdown[4].id) && (rfqObj.quoteProgress === vm.quoteProgressGridHeaderDropdown[3].id || rfqObj.quoteProgress === vm.quoteProgressGridHeaderDropdown[4].id)) {
            rfqObj.isExportQuoteReport = true;
            if ((rfqObj.status === vm.statusGridHeaderDropdown[2].id || rfqObj.status === vm.statusGridHeaderDropdown[3].id) && (rfqObj.quoteProgress === vm.quoteProgressGridHeaderDropdown[3].id || rfqObj.quoteProgress === vm.quoteProgressGridHeaderDropdown[4].id)) {
              rfqObj.isDownloadDisabled = false;
              rfqObj.isPrintDisable = false;
            }
          } else {
            rfqObj.isExportQuoteReport = false;
          }
          if (rfqObj.quoteProgress === vm.quoteProgressGridHeaderDropdown[4].value) {
            rfqObj.isRowSelectable = false;
          }
          const oneDay = 24 * 60 * 60 * 1000;
          const newdate = new Date();
          const quoteDueDate = new Date(rfqObj.quoteDueDate);
          const quoteSubmitDate = rfqObj.quoteSubmitDate ? new Date(rfqObj.quoteSubmitDate) : null;

          if (newdate < quoteDueDate) {
            if (quoteSubmitDate) {
              if (quoteDueDate > quoteSubmitDate) {
                rfqObj.submitDateColor = 'green';
              } else {
                rfqObj.submitDateColor = 'red';
              }
            } else {
              const diffDays = Math.round(Math.abs((newdate.getTime() - quoteDueDate.getTime()) / (oneDay)));
              if (diffDays < 5) {
                rfqObj.dueDateColor = 'red';
              }
            }
          } else {
            if (quoteSubmitDate) {
              if (quoteDueDate > quoteSubmitDate) {
                rfqObj.submitDateColor = 'green';
              } else {
                rfqObj.submitDateColor = 'red';
              }
            } else {
              rfqObj.dueDateColor = 'red';
            }
          }
          if (rfqObj.status === vm.rfqCancelledStatus) {
            rfqObj.rfqAssyChangeStatus = false;
          }
          else {
            rfqObj.rfqAssyChangeStatus = true;
          }
          const statusdata = rfqQuoteStatus[rfqObj.rfqAssyID];
          if (statusdata) {
            statusobj = null;
          }
          _.each(statusdata, (obj) => {
            var status = obj.name + ':' + obj.status;
            if (statusobj) {
              statusobj = statusobj + ',' + status;
            } else {
              statusobj = status;
            }
          });

          rfqObj.QuoteStatus = statusobj || null;
          rfqObj.quoteDueDate = BaseService.getUIFormatedDate(rfqObj.quoteDueDate, vm.DateFormatArray);
          rfqObj.quoteInDate = BaseService.getUIFormatedDate(rfqObj.quoteInDate, vm.DateFormatArray);
          if (rfqObj.isActivityStart) {
            vm.startTimer(rfqObj);
          }
          if (rfqObj.isCostingActivityStart) {
            vm.startCostingTimer(rfqObj);
          }
        });

        return RFQData;
      }

      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.cgBusyLoading = RFQFactory.retrieveRFQList().query(vm.pagingInfo).$promise.then((rfq) => {
          setDataAfterGetAPICall(rfq, true);
        }).catch((error) => BaseService.getErrorLog(error));
      };



      //To get assy type list
      vm.getAssyTypeList = () => {
        vm.assemblyTypeSearchText = undefined;
        return AssyTypeFactory.getAssyTypeList().query().$promise.then((response) => {
          vm.assemblyTypeList = vm.assemblyTypeListToDisplay = [];
          if (response && response.data) {
            vm.assemblyTypeList = _.sortBy(response.data, [function (o) { return o.name; }]);
            vm.assemblyTypeListToDisplay = angular.copy(vm.assemblyTypeList);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      //To get customer list
      vm.getCustomerList = () => {
        vm.customerSearchText = undefined;
        return MasterFactory.getCustomerList().query().$promise.then((customer) => {
          if (customer && customer.data) {
            _.each(customer.data, (item) => {
              item.mfgactualName = item.mfgName;
              item.mfgName = item.mfgCodeName;
            });
            vm.customerList = customer.data;
            vm.customerListToDisplay = angular.copy(vm.customerList);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };


      //to restrict search criteria
      const returnCommonSeach = (criteria) => {
        var replacedString = criteria.replace('\\', '\\\\');
        criteria = replacedString.replace(/\"/g, '\\"').replace(/\'/g, "\\'").replace('[', '\\\\[').replace(']', '\\\\]');
        return criteria.length > 100 ? criteria.substring(0, 100) : criteria;
      };

      vm.queryAssySearchPID = (criteria) => {
        const searchObj = {
          searchString: returnCommonSeach(criteria),
          PIDCode: true
        };
        return ComponentFactory.getAllAssyFilterList().query(searchObj).$promise.then((response) => {
          if (response && response.data) {
            response.data = _.differenceWith(response.data, vm.filter.assyPID, (arrValue, othValue) => arrValue.id === othValue.id);
            return response.data;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      //search assy mfgpn query
      vm.queryAssySearchMfgPn = (criteria) => {
        const searchObj = {
          searchString: returnCommonSeach(criteria),
          mfgPN: true
        };
        return ComponentFactory.getAllAssyFilterList().query(searchObj).$promise.then((response) => {
          if (response && response.data) {
            response.data = _.differenceWith(response.data, vm.filter.assyMfgPn, (arrValue, othValue) => arrValue.id === othValue.id);
            return response.data;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      //search nick name query
      vm.queryNicknameSearch = (criteria) => {
        const searchObj = {
          searchString: returnCommonSeach(criteria)
        };
        return ComponentFactory.getAllNickNameFilterList().query(searchObj).$promise.then((nickresponse) => {
          if (nickresponse && nickresponse.data) {
            nickresponse.data = _.differenceWith(nickresponse.data, vm.filter.nicknames, (arrValue, othValue) => arrValue.nickname === othValue.nickname);
            return nickresponse.data;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.getJobTypeList = () => {
        vm.jobTypeSearchText = undefined;
        return RFQSettingFactory.getJobTypeList().query().$promise.then((response) => {
          if (response.data) {
            vm.jobTypeList = response.data;
            vm.jobTypeListToDisplay = angular.copy(vm.jobTypeList);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.getRfqTypeList = () => {
        vm.rfqTypeSearchText = undefined;
        return RFQSettingFactory.getRfqTypeList().query().$promise.then((response) => {
          if (response.data) {
            vm.rfqTypeList = response.data;
            vm.rfqTypeListToDisplay = angular.copy(vm.rfqTypeList);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      //To get data for all advanced filters
      function init() {
        var masterDataPromise = [
          vm.getAssyTypeList(),
          vm.getCustomerList(),
          vm.getJobTypeList(),
          vm.getRfqTypeList(),
          getCompayDetails()
        ];

        vm.cgBusyLoading = $q.all(masterDataPromise).then(() => {
        });
      }
      init();

      /* Start Timer after checkin start */
      vm.startTimer = (data) => {
        data.currentTimerDiff = '';
        data.tickActivity = setInterval(() => {
          //data.activityStartAt = data.activityStartAt + 1;
          //data.currentTimerDiff = secondsToTime(data.activityStartAt, true);

          const currDate = getCurrentUTC();
          data.totalConsumptionTime = calculateSeconds(data.activityStartAtDateTime, currDate);
          data.currentTimerDiff = secondsToTime(data.totalConsumptionTime, true);
        }, _configSecondTimeout);
      };

      /* Start Timer after checkin start */
      vm.startCostingTimer = (data) => {
        data.currentCostingTimerDiff = '';
        data.tickCostingActivity = setInterval(() => {
          data.costingActivityStartAt = data.costingActivityStartAt + 1;
          data.currentCostingTimerDiff = secondsToTime(data.costingActivityStartAt, true);
        }, _configSecondTimeout);
      };

      vm.selectedRFQ = () => vm.gridOptions.getSelectedRowsCount ? vm.gridOptions.getSelectedRowsCount() : 0;

      vm.fab = {
        Status: false
      };

      vm.updateRecord = (row) => {
        BaseService.openInNew(RFQTRANSACTION.RFQ_MANAGE_STATE, { id: row.entity.id, rfqAssyId: row.entity.rfqAssyID });
      };

      // delete
      vm.deleteRecord = (row) => {
        let selectedIDs = [];
        if (row) {
          selectedIDs.push(row.rfqAssyID);
        } else {
          vm.selectedRows = vm.selectedRowsList;
          if (vm.selectedRows.length > 0) {
            selectedIDs = vm.selectedRows.map((item) => item.rfqAssyID);
          }
        }

        if (selectedIDs) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, 'RFQ Assembly(s)', selectedIDs.length);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          const objIDs = {
            id: selectedIDs,
            isPermanentDelete: IsPermanentDelete,
            CountList: false
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              vm.cgBusyLoading = RFQFactory.deleteRFQ().query({ objIDs: objIDs }).$promise.then((res) => {
                if (res && res.data) {
                  if (res.data.length > 0 || res.data.transactionDetails) {
                    const data = {
                      TotalCount: res.data.transactionDetails[0].TotalCount,
                      pageName: CORE.PageName.rfq_list
                    };
                    const messageContent = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.RFQ_DELETE_MESSAGE;
                    messageContent.message = stringFormat(messageContent.message, data.TotalCount);
                    const alertModel = {
                      messageContent: messageContent
                    };

                    return DialogFactory.messageAlertDialog(alertModel).then(() => {
                      vm.loadData();
                    }, () => {
                    }).catch((error) => BaseService.getErrorLog(error));
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
          // show validation message no data selected
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
          messageContent.message = stringFormat(messageContent.message, 'RFQ');
          const alertModel = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(alertModel);
        }
      };


      vm.isDisableDescription = (data) => data.opDescription ? false : true;

      vm.getOpStatus = (statusID) => BaseService.getOpStatus(statusID);

      /* delete multiple data called from directive of ui-grid*/
      vm.deleteMultipleData = () => {
        vm.deleteRecord();
      };

      vm.getBOM = (row) => {
        var id = row.rfqAssyID;
        var partId = row.partID;
        BaseService.openInNew(RFQTRANSACTION.RFQ_IMPORT_BOM_STATE, { id: id, partId: partId });
      };

      function copyRFQBOM(rowdata, ev, isCopyBOM) {
        const obj = {
          rfqAssyID: rowdata.rfqAssyID,
          IsCopyPricing: true,
          partID: rowdata.partID,
          quoteGroup: rowdata.id,
          isCopyBOM: isCopyBOM
        };
        DialogFactory.dialogService(
          RFQTRANSACTION.COPY_BOM_CONTROLLER,
          RFQTRANSACTION.COPY_BOM_VIEW,
          ev,
          obj).then(() => {
            vm.loadData();
          }, () => {
          }, (err) => BaseService.getErrorLog(err));
      };
      /* open pop up for CopyBOM */
      vm.copyBOM = (rowdata, ev) => {
        copyRFQBOM(rowdata, ev, true);
      };

      /* open pop up for CopyRFQ */
      vm.copyRFQ = (rowdata, ev) => {
        copyRFQBOM(rowdata, ev, false);
      };

      /* open pop up for CopyBOM */
      vm.getAssyAtGlance = (rowdata, ev) => {
        const obj = rowdata;
        DialogFactory.dialogService(
          RFQTRANSACTION.ASSEMBLY_AT_GLANCE_CONTROLLER,
          RFQTRANSACTION.ASSEMBLY_AT_GLANCE_VIEW,
          ev,
          obj).then(() => {
          }, () => {
          }, (err) => BaseService.getErrorLog(err));
      };

      /* open pop up for Export Quote report */
      vm.exportQuoteReport = (rowdata) => {
        if (!rowdata.isExportQuoteReport) { return false;}
        vm.cgBusyLoading = RFQFactory.generateRFQQuoteDetailReport({ rfqAssyID: rowdata.rfqAssyID }).then((response) => {
          if (response.data) {
            const filename = stringFormat(CORE.ExportFormat, rowdata.customerCode, rowdata.mfgPNwithoutSpecialChar, 'Costed BOM Consolidate', $filter('date')(new Date(), CORE.ExportDateFormat));
            const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
            const link = document.createElement('a');
            if (link.download !== undefined) {
              const url = URL.createObjectURL(blob);
              link.setAttribute('href', url);
              link.setAttribute('download', filename);
              link.style = 'visibility:hidden';
              document.body.appendChild(link);
              $timeout(() => {
                link.click();
                document.body.removeChild(link);
              });
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* open pop up for Export Cost Report */
      vm.exportCostReport = (rowdata) => {
        if (!rowdata.isExportQuoteReport) { return false;}
        const filename = stringFormat(CORE.ExportFormat, rowdata.customerCode, rowdata.mfgPNwithoutSpecialChar, 'Costed BOM Per Line', $filter('date')(new Date(), CORE.ExportDateFormat));
        vm.cgBusyLoading = RFQFactory.generateRFQCostDetailReport({ rfqAssyID: rowdata.rfqAssyID, filename: filename }).then((response) => {
          if (response.data) {
            const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
            const link = document.createElement('a');
            if (link.download !== undefined) {
              const url = URL.createObjectURL(blob);
              link.setAttribute('href', url);
              link.setAttribute('download', filename);
              link.style = 'visibility:hidden';
              document.body.appendChild(link);
              $timeout(() => {
                link.click();
                document.body.removeChild(link);
              });
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.requoteHistory = (row, count, ev) => {
        const obj = {
          rfqAssyID: row.rfqAssyID,
          Customer: row.Customer,
          customerID: row.customerID,
          PIDCode: row.PIDCode,
          mfgPN: row.mfgPN,
          partID: row.partID,
          quoteGroup: row.id,
          rohsIcon: row.rohsIcon,
          rohsName: row.rohsComplientConvertedValue
        };
        if (count) {
          DialogFactory.dialogService(
            RFQTRANSACTION.ASSEMBLY_REQUOTE_HISTORY_CONTROLLER,
            RFQTRANSACTION.ASSEMBLY_REQUOTE_HISTORY_VIEW,
            ev,
            obj).then(() => {
            }, () => {
            }, (err) => BaseService.getErrorLog(err));
        }
      };

      vm.goToQuote = (rfqAssyId, lastQuoteID) => {
        BaseService.openInNew(RFQTRANSACTION.QUOTE_SUMMARY_DETAIL_STATE, { id: rfqAssyId, quoteSubmittedID: lastQuoteID, pageType: vm.quotePageType.QUOTE.Name });
      };

      /* open change rfqAssyStatus pop up */
      vm.rfqAssyChangeStatus = (rowdata, ev) => {
        if (!rowdata.rfqAssyChangeStatus) { return false;}
        const obj = {
          rfqAssyID: rowdata.rfqAssyID,
          Customer: rowdata.Customer,
          customerID: rowdata.customerID,
          PIDCode: rowdata.PIDCode,
          mfgPN: rowdata.mfgPN,
          partID: rowdata.partID,
          rohsIcon: rowdata.rohsIcon,
          quoteGroup: rowdata.id,
          rohsName: rowdata.rohsComplientConvertedValue,
          quoteProgress: rowdata.quoteProgress,
          status: rowdata.rfq_statusID,
          winPrice: rowdata.winPrice,
          winQuantity: rowdata.winQuantity,
          reason: rowdata.reason,
          isActivityStart: rowdata.isCostingActivityStart
        };
        DialogFactory.dialogService(
          RFQTRANSACTION.ASSEMBLY_QUOTE_STATUS_CHANGE_POPUP_CONTROLLER,
          RFQTRANSACTION.ASSEMBLY_QUOTE_STATUS_CHANGE_POPUP_VIEW,
          ev,
          obj).then(() => {
            vm.loadData();
          }, () => {
          }, (err) => BaseService.getErrorLog(err));
      };

      /* open change rfqAssyStatus pop up */
      vm.changeAssyStatus = (ev) => {
        if (vm.selectedRowsList.length === 0) { return false;}
        vm.selectedRows = vm.selectedRowsList;
        const obj = {
          assyList: vm.selectedRows
        };

        DialogFactory.dialogService(
          RFQTRANSACTION.ASSEMBLY_QUOTE_STATUS_CHANGE_POPUP_CONTROLLER,
          RFQTRANSACTION.ASSEMBLY_QUOTE_STATUS_CHANGE_POPUP_VIEW,
          ev,
          obj).then(() => {
            vm.loadData();
          }, () => {
          }, (err) => BaseService.getErrorLog(err));
      };

      vm.viewRecord = (rowdata, noteType, $event) => {
        const obj = {
          title: noteType,
          description: rowdata.reason
        };
        DialogFactory.dialogService(
          CORE.DESCRIPTION_MODAL_CONTROLLER,
          CORE.DESCRIPTION_MODAL_VIEW,
          $event,
          obj).then(() => {
          }, (error) => BaseService.getErrorLog(error));
      };

      $scope.$on('$destroy', () => {
        removeSocketListener();
        $mdDialog.hide(false, {
          closeAll: true
        });
      });

      vm.deleteBOM = function (rowdata) {
        if (rowdata.isBOMDelete) { return false;}
        const data = {
          rfqAssyID: rowdata.rfqAssyID,
          partID: rowdata.partID
        };
        DialogFactory.dialogService(
          RFQTRANSACTION.DELETE_BOM_CONFIRMATION_CONTROLLER,
          RFQTRANSACTION.DELETE_BOM_CONFIRMATION_VIEW,
          null,
          data).then(() => {
            vm.loadData();
          }, (err) => BaseService.getErrorLog(err));
      };

      const manageStartStopActivity = (data) => {
        if (vm.loginUserId === data.activityStartBy || vm.loginUser.isUserSuperAdmin) {
          let messageContent = data.transactionType === vm.transactionType[1].id ? angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.COSTING_STOP_FROM_RFQ_LIST_MESSAGE) : angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.BOM_STOP_FROM_RFQ_LIST_MESSAGE);
          if (vm.loginUserId === data.activityStartBy) {
            let message = '<br/><br/><table style=\'width:100%\'><thead><tr><th class=\'border-bottom padding-5\'>#</th><th class=\'border-bottom padding-5\'>' + vm.LabelConstant.Assembly.PIDCode + '</th></tr></thead><tbody>{0}</tbody></table>';
            const subMessage = '<tr><td class="border-bottom padding-5">1 </td><td class="border-bottom padding-5">' + data.PIDCode + '</td></tr>';
            message = stringFormat(message, subMessage);
            messageContent.message = stringFormat(messageContent.message, message);
          }
          if (vm.loginUserId !== data.activityStartBy && vm.loginUser.isUserSuperAdmin) {
            messageContent = data.transactionType === vm.transactionType[1].id ? angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.COSTING_STOP_BY_SA_FROM_RFQ_LIST_MESSAGE) : angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.BOM_STOP_BY_SA_FROM_RFQ_LIST_MESSAGE);
            let message = '<br/><br/><table style=\'width:100%\'><thead><tr><th class=\'border-bottom padding-5\'>#</th><th class=\'border-bottom padding-5\'>' + vm.LabelConstant.Assembly.PIDCode + '</th><th class=\'border-bottom padding-5\'>Activity Started By</th></tr></thead><tbody>{0}</tbody></table>';
            const subMessage = '<tr><td class="border-bottom padding-5">1 </td><td class="border-bottom padding-5">' + data.PIDCode + '</td><td class="border-bottom padding-5">' + data.userName + '</td></tr>';
            message = stringFormat(message, subMessage);
            messageContent.message = stringFormat(messageContent.message, data.userName, message);
          }

          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };

          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              const APICall = data.transactionType === vm.transactionType[1].id ? BOMFactory.startStopCostingActivity : BOMFactory.startStopBOMActivity;
              const dataObj = {
                refTransID: data.refTransID,
                isActivityStart: data.isActivityStart,
                transactionType: data.transactionType,
                actionType: data.actionType
              };
              vm.isStartAndStopRequestFromThisTab = true;
              vm.cgBusyLoading = APICall().save(dataObj).$promise.then(() => {
                vm.loadData();
              }).catch((error) => {
                BaseService.getErrorLog(error);
              });
            }
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          const messageContent = data.transactionType === vm.transactionType[1].id? CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.COSTING_DIFFERENT_USER_STOP_MESSAGE : CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.BOM_DIFFERENT_USER_STOP_MESSAGE;
          messageContent.message = stringFormat(messageContent.message, data.userName);
          const alertModel = {
            messageContent: messageContent
          };

          DialogFactory.messageAlertDialog(alertModel).then(() => {
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      vm.stopBOMActivity = (data) => {
        const objData = {
          transactionType: vm.transactionType[0].id,
          actionType: vm.actionType[0].id,
          activityStartBy: data.activityStartBy,
          userName: data.username,
          PIDCode: data.PIDCode,
          isActivityStart: false,
          refTransID: data.partID
        };
        manageStartStopActivity(objData);
      };

      // Stop Costing Activity
      vm.stopCostingActivity = (data) => {
        const objData = {
          transactionType: vm.transactionType[1].id,
          actionType: vm.actionType[0].id,
          activityStartBy: data.costingActivityBy,
          userName: data.costingUserName,
          PIDCode: data.PIDCode,
          isActivityStart: false,
          refTransID: data.rfqAssyID
        };
        manageStartStopActivity(objData);
      };

      vm.goToComponentDetail = (mfgType, partId) => {
        if (mfgType) {
          mfgType = mfgType.toLowerCase();
        }
        BaseService.goToComponentDetailTab(mfgType, partId, USER.PartMasterTabs.Detail.Name);
      };
      vm.goToRFQ = (quoteID, rfqAssyID) => {
        BaseService.openInNew(RFQTRANSACTION.RFQ_MANAGE_STATE, { id: quoteID, rfqAssyId: rfqAssyID });
      };
      /*Method to Show RFQ List History
     *used Method Name 'UMIDHistory' because used UMID History UI grid button*/
      vm.UMIDHistory = (row) => {
        var data = {
          quoteGroup: row.id,
          rfqAssyID: row.rfqAssyID,
          mfgType: CORE.MFG_TYPE.MFG,
          mfgPN: row.mfgPN,
          partId: row.partID,
          PIDCode: row.PIDCode,
          rohsIcon: vm.rohsImagePath + row.rohsIcon,
          rohsName: row.rohsComplientConvertedValue
        };
        var _dummyEvent = null;

        DialogFactory.dialogService(
          CORE.RFQ_LIST_HISTORY_POPUP_MODAL_CONTROLLER,
          CORE.RFQ_LIST_HISTORY_POPUP_MODAL_VIEW,
          _dummyEvent,
          data).then(() => {
          }, () => {
          }, (error) => BaseService.getErrorLog(error));
      };

      // Show Costing activity History
      vm.CostingActivityHistory = (rowdata, ev) => {
        var data = {
          refTransID: rowdata.rfqAssyID,
          transactionType: vm.transactionType[1].id
        };
        DialogFactory.dialogService(
          RFQTRANSACTION.BOM_ACTIVITY_HISTORY_POPUP_CONTROLLER,
          RFQTRANSACTION.BOM_ACTIVITY_HISTORY_POPUP_VIEW,
          ev,
          data).then(() => {
            //success
          }, (err) => BaseService.getErrorLog(err));
      };

      vm.printRecord = (rowdata, isDownload) => {
        if (isDownload) {
          rowdata.entity.isDownloadDisabled = true;
        } else {
          rowdata.entity.isPrintDisable = true;
        }
        BOMFactory.downloadQuoteSummaryReport({
          RFQAssyID: rowdata.entity.rfqAssyID,
          AssyQuoteSubmittedID: rowdata.entity.lastQuoteID,
          APIProjectURL: APIProjectURLconfig,
          ShowAvailableStock: false,
          CompanyCode: vm.comapnyCode,
          isCustomPartDetShowInReport: rowdata.entity.isCustomPartDetShowInReport || false,
          format: vm.reportFormat,
          QuoteData: {
            quoteNumber: rowdata.entity.quoteNumber,
            partCostingBOMInternalVersion: rowdata.entity.partCostingBOMInternalVersion,
            customerCode: rowdata.entity.customerCode
          }
        }).then((response) => {
          const QuoteData = response.config.data.QuoteData;
          if (isDownload) {
            rowdata.entity.isDownloadDisabled = false;
          } else {
            rowdata.entity.isPrintDisable = false;
          }
          BaseService.downloadReport(response, stringFormat('{0}-{1}-{2}-{3}', CORE.REPORT_SUFFIX.QUOTE, QuoteData.quoteNumber, QuoteData.partCostingBOMInternalVersion, QuoteData.customerCode), isDownload, true);
        }).catch((error) => BaseService.getErrorLog(error));
      };

      // DownLoad Quote Report
      vm.onDownload = (rowdata) => vm.printRecord(rowdata, true);

      vm.searchCustomerList = () => {
        const customerListToFilter = angular.copy(vm.customerList);
        vm.customerListToDisplay = vm.customerSearchText ? _.filter(customerListToFilter, (item) => item.mfgName.toLowerCase().contains(vm.customerSearchText.toLowerCase())) : customerListToFilter;
      };
      vm.searchAssemblyTypeList = () => {
        const assemblyTypeListToFilter = angular.copy(vm.assemblyTypeList);
        vm.assemblyTypeListToDisplay = vm.assemblyTypeSearchText ? _.filter(assemblyTypeListToFilter, (item) => item.name.toLowerCase().contains(vm.assemblyTypeSearchText.toLowerCase())) : assemblyTypeListToFilter;
      };
      vm.searchRFQTypeList = () => {
        const rfqTypeListToFilter = angular.copy(vm.rfqTypeList);
        vm.rfqTypeListToDisplay = vm.rfqTypeSearchText ? _.filter(rfqTypeListToFilter, (item) => item.name.toLowerCase().contains(vm.rfqTypeSearchText.toLowerCase())) : rfqTypeListToFilter;
      };

      vm.searchJobTypeList = () => {
        const jobTypeListToFilter = angular.copy(vm.jobTypeList);
        vm.jobTypeListToDisplay = vm.jobTypeSearchText ? _.filter(jobTypeListToFilter, (item) => item.name.toLowerCase().contains(vm.jobTypeSearchText.toLowerCase())) : jobTypeListToFilter;
      };


      //clear customer filter search
      vm.clearCustomerSearchText = () => {
        vm.customerSearchText = undefined;
        vm.searchCustomerList();
      };

      //clear assembly filter search
      vm.clearAssemblyTypeSearchText = () => {
        vm.assemblyTypeSearchText = undefined;
        vm.searchAssemblyTypeList();
      };

      //clear assembly filter search
      vm.clearRFQTypeSearchText = () => {
        vm.rfqTypeSearchText = undefined;
        vm.searchRFQTypeList();
      };

      //clear assembly filter search
      vm.clearJobTypeSearchText = () => {
        vm.jobTypeSearchText = undefined;
        vm.searchJobTypeList();
      };

      //clease customer filter list
      vm.clearCustomerListFilter = () => {
        vm.filter.customers = [];
      };

      //clear assy type filter list
      vm.clearAsssemblyTypeFilter = () => {
        vm.filter.assyType = [];
      };

      //clear job type filter list
      vm.clearJobTypeFilter = () => {
        vm.filter.jobType = [];
      };

      //clear rfq type filter list
      vm.clearRFQTypeFilter = () => {
        vm.filter.rfqType = [];
      };
      //go to customer list page
      vm.goToCustomerList = () => {
        BaseService.goToCustomerList();
        return false;
      };
      //go to part master list page
      vm.goToPartMasterList = () => {
        BaseService.goToPartList();
        return false;
      };
      //go to assy type list
      vm.goToAssyTypeList = () => {
        BaseService.goToAssyTypeList();
        return false;
      };

      //go to rfq type list
      vm.goToRFQTypeList = () => {
        BaseService.openInNew(USER.ADMIN_RFQ_TYPE_STATE, {});
        return false;
      };

      //go to job type list
      vm.goToJobTypeList = () => {
        BaseService.openInNew(USER.ADMIN_JOB_TYPE_STATE, {});
        return false;
      };
      vm.addRecord = () => {
        BaseService.openInNew(RFQTRANSACTION.RFQ_MANAGE_STATE, { id: null, rfqAssyId: null });
      };

      angular.element(document.querySelector('.forms')).bind('scroll', () => {
        alert('scrolling is cool!');
      });
    }
  }
})();
